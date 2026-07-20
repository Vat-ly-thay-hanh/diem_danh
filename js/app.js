/******************************************************************************
 * app.js
 * ----------------------------------------------------------------------------
 * Chương trình chính.
 ******************************************************************************/

import { AppState } from "./state.js";
import { UI } from "./ui.js";
import { Dialog } from "./dialog.js";
import { Api } from "./api.js";
import { Search } from "./search.js";
import { Attendance } from "./attendance.js";
import { StudentManager } from "./studentManager.js";
import { SeatManager } from "./seatManager.js";
import { SeatMap } from "./seatMap.js";

class App {
    constructor() {
        /* ==========================================================
           Dữ liệu
        ========================================================== */
        this.state = new AppState();
        this.studentManager = new StudentManager();
        this.seatManager = new SeatManager();
        this.counterId = null; // Quản lý bộ đếm thời gian

        /* ==========================================================
           Giao diện
        ========================================================== */
        this.ui = new UI();
        this.dialog = new Dialog();
        this.seatMap = new SeatMap("seatMap", this.seatManager);

        /* ==========================================================
           API
        ========================================================== */
        this.api = new Api();

        /* ==========================================================
           Chức năng
        ========================================================== */
        this.search = new Search(
            this.dialog,
            this.studentManager,
            this.seatManager,
            this.state
        );

        this.attendance = new Attendance(
            this.api,
            this.dialog,
            this.state,
            this.seatManager,
            this.studentManager
        );

        /* ==========================================================
           Khởi tạo
        ========================================================== */
        this.initialize();
    }

    /******************************************************************
     * Khởi tạo chương trình
     ******************************************************************/
    initialize() {
        this.initializeUI();
        this.initializeSeatMap();
        this.initializeDialogs();
        this.startCounter();
        this.refreshAll(); // Khởi tạo ban đầu nên đồng bộ toàn bộ app
    }

    /******************************************************************
     * Khởi tạo UI
     ******************************************************************/
    initializeUI() {
        this.ui.bindEvents({
            onClassChanged: () => this.onClassChanged(),
            onLoadClass: () => this.loadStudents(),
            onColumnChanged: () => this.onColumnChanged(),
            onCheckColumn: () => this.checkColumn(),
            onSearchStudent: () => this.search.open(),
            onDeleteSeat: () => this.deleteSeat(),
            onEditStudent: () => this.editStudent(),
            onAttendance: () => this.attendance.openConfirm()
        });
    }

    /******************************************************************
     * Khởi tạo sơ đồ lớp
     ******************************************************************/
    initializeSeatMap() {
        this.seatMap.render();
        this.seatMap.onSeatClick((seatId) => {
            this.selectSeat(seatId);
        });
    }

    /******************************************************************
     * Khởi tạo dialog
     ******************************************************************/
    initializeDialogs() {
        this.dialog.bindEvents({
            onSearch: () => this.search.search(),
            onAssign: () => this.assignStudent(),
            onCloseSearch: () => this.dialog.closeSearch(),
            onSaveEdit: () => this.saveStudent(),
            onCancelEdit: () => this.dialog.closeEdit(),
            onYes: () => this.attendance.execute(),
            onNo: () => this.attendance.cancel(),
            onBack: () => this.attendance.backSuccess(),
            onExit: () => this.attendance.exit(),
            onBackError: () => this.attendance.backError()
        });
    }

    /******************************************************************
     * Đồng hồ cập nhật
     ******************************************************************/
    startCounter() {
        this.counterId = setInterval(() => {
            this.ui.refreshCounter(this.seatManager);
        }, 1000);
    }

    /******************************************************************
     * Cập nhật giao diện (Không bao gồm sơ đồ ghế)
     ******************************************************************/
    refreshUI() {
        this.ui.refreshAll(
            this.state,
            this.studentManager,
            this.seatManager
        );
    }

    /******************************************************************
     * Chọn lớp
     ******************************************************************/
    onClassChanged() {
        const value = this.ui.getSelectedClass();
        this.state.selectedClass = value;
        if (value !== this.state.loadedClass) {
            this.clearCurrentClass();
        }
        this.refreshUI();
    }

    /******************************************************************
     * Lấy danh sách học sinh
     ******************************************************************/
    async loadStudents() {
        try {
            this.ui.showLoadingClass();
            const students = await this.api.getStudents(
                this.state.selectedClass
            );

            console.log("===== students =====");
            console.log(students);

            this.studentManager.clear();
            students.forEach(student => {
                this.studentManager.add(student);
            });
            this.state.loadedClass = this.state.selectedClass;
            this.seatManager.clearAssignments();
            this.state.selectedSeatId = "";
            this.state.checkedColumn = "";
            this.state.inputColumn = "";
            this.refreshAll();
        }
        catch (error) {
            alert(error.message);
            this.refreshAll(); // Đổi thành refreshAll để phục hồi đồng bộ sơ đồ lớp
        }
    }

    /******************************************************************
     * Thay đổi cột
     ******************************************************************/
    onColumnChanged() {
        this.state.inputColumn = this.ui.getInputColumn();
        if (this.state.inputColumn !== this.state.checkedColumn) {
            this.state.checkedColumn = "";
        }
        this.refreshUI();
    }

    /******************************************************************
     * Kiểm tra cột
     ******************************************************************/
    async checkColumn() {
        try {
            this.ui.showCheckingColumn();
            const ok = await this.api.checkColumn(
                this.state.loadedClass,
                this.state.inputColumn
            );
            if (!ok) {
                alert("Không tồn tại cột.");
                this.refreshAll();
                return;
            }
            this.state.checkedColumn = this.state.inputColumn;
            this.refreshUI();
        }
        catch (error) {
            alert(error.message);
            this.refreshAll(); // Đổi thành refreshAll đề phòng lỗi trạng thái
        }
    }

    /******************************************************************
     * Chọn ghế
     ******************************************************************/
    selectSeat(seatId) {
        this.state.selectedSeatId = seatId;
        this.seatManager.select(seatId);
        this.refreshAll(); // Dùng hàm tập trung thay vì gọi lẻ tẻ seatMap.refresh()
    }

    /******************************************************************
     * Chỉnh sửa học sinh
     ******************************************************************/
    editStudent() {
        const seat = this.seatManager.get(this.state.selectedSeatId);
        if (!seat || !seat.hasStudent) {
            return;
        }
        const student = this.studentManager.get(seat.studentRow);
        if (!student) {
            return;
        }
        this.dialog.showEdit(student);
    }

    /******************************************************************
     * Lưu chỉnh sửa học sinh
     ******************************************************************/
    saveStudent() {
        const seat = this.seatManager.get(this.state.selectedSeatId);
        if (!seat) {
            return;
        }

        const student = this.studentManager.get(seat.studentRow);
        if (!student) {
            return;
        }

        // Lấy dữ liệu mới từ giao diện dialog nhập vào
        const data = this.dialog.getEditData();
        
        // CHUẨN HÓA TẠI ĐÂY: Sử dụng luôn hàm update có sẵn của class Student
        student.update(data); 

        this.dialog.closeEdit();
        this.refreshAll();
    }

    /******************************************************************
     * Gán học sinh
     ******************************************************************/
    assignStudent() {
        if (this.search.assign()) {
            this.refreshAll();
        }
    }

    /******************************************************************
     * Xóa ghế
     ******************************************************************/
    deleteSeat() {
        this.seatManager.clearSeat(this.state.selectedSeatId);
        this.refreshAll();
    }

    /******************************************************************
     * Xóa toàn bộ dữ liệu khi đổi lớp
     ******************************************************************/
    clearCurrentClass() {
        this.studentManager.clear();
        this.seatManager.clearAssignments();
        this.state.loadedClass = "";
        this.state.checkedColumn = "";
        this.state.inputColumn = "";
        this.state.selectedSeatId = "";
        this.refreshAll();
    }

    /******************************************************************
     * Đồng bộ lại toàn bộ chương trình (Cả sơ đồ ghế và UI)
     ******************************************************************/
    refreshAll() {
        this.seatMap.refresh();
        this.refreshUI();
    }

    /******************************************************************
     * Giải phóng tài nguyên hệ thống
     ******************************************************************/
    destroy() {
        if (this.counterId) {
            clearInterval(this.counterId);
            this.counterId = null;
        }
    }
}

let app = null;

window.addEventListener("load", () => {
    app = new App();
});

window.addEventListener("beforeunload", () => {
    if (app) {
        app.destroy();
    }
});
