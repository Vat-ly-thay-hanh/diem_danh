/******************************************************************************
 * ui.js
 * ----------------------------------------------------------------------------
 * Quản lý toàn bộ giao diện chương trình.
 ******************************************************************************/

export class UI {
    constructor() {
        /* ==========================================================
           Chọn lớp
        ========================================================== */
        this.cboClass = document.getElementById("chonLop");
        this.btnLoad = document.getElementById("btnLayThongTin");

        /* ==========================================================
           Cột điểm danh
        ========================================================== */
        this.txtColumn = document.getElementById("nhapCot");
        this.btnCheckColumn = document.getElementById("btnKiemTraCot");

        /* ==========================================================
           Sơ đồ lớp
        ========================================================== */
        this.seatMap = document.getElementById("seatMap");

        /* ==========================================================
           Thông tin chỗ ngồi
        ========================================================== */
        this.pnlSeatInfo = document.getElementById("seatInfo");
        this.infoHo = document.getElementById("infoHo");
        this.infoTen = document.getElementById("infoTen");
        this.infoPH = document.getElementById("infoPH");
        this.infoHS = document.getElementById("infoHS");
        this.infoTruong = document.getElementById("infoTruong");
        this.infoStatus = document.getElementById("infoStatus");

        this.btnSua = document.getElementById("btnSua");
        this.btnTim = document.getElementById("btnTim");
        this.btnXoa = document.getElementById("btnXoa");

        /* ==========================================================
           Bộ đếm
        ========================================================== */
        this.lblSeatCount = document.getElementById("seatCount");

        /* ==========================================================
           Điểm danh
        ========================================================== */
        this.btnAttendance = document.getElementById("btnAttendance");

        /* ==========================================================
           Khởi tạo trạng thái ban đầu
        ========================================================== */
        this.initialize();
    }

    /******************************************************************
     * Khởi tạo giao diện ban đầu lúc ứng dụng vừa chạy
     ******************************************************************/
    initialize() {
        this.enable(this.cboClass);
        this.disable(this.btnLoad);

        // Cột điểm danh
        this.disable(this.txtColumn);
        this.disable(this.btnCheckColumn);

        // Thông tin chỗ ngồi và các nút chức năng ghế
        this.hide(this.pnlSeatInfo);
        this.disable(this.btnSua);
        this.disable(this.btnXoa);
        this.disable(this.btnTim);

        // Nút điểm danh và bộ đếm sĩ số sơ đồ
        this.disable(this.btnAttendance);
        this.setSeatCount(0);
    }

    /******************************************************************
     * Các hàm tiện ích thao tác DOM (Kích hoạt/Vô hiệu hóa/Ẩn/Hiện)
     ******************************************************************/
    enable(control) {
        if (control) control.disabled = false;
    }

    disable(control) {
        if (control) control.disabled = true;
    }

    show(control) {
        if (control) control.style.display = "";
    }

    hide(control) {
        if (control) control.style.display = "none";
    }

    setText(control, text) {
        if (control) control.textContent = text;
    }

    /******************************************************************
     * Xóa sạch nội dung text hiển thị thông tin học sinh
     ******************************************************************/
    clearSeatInfo() {
        this.infoHo.textContent = "";
        this.infoTen.textContent = "";
        this.infoPH.textContent = "";
        this.infoHS.textContent = "";
        this.infoTruong.textContent = "";
        this.infoStatus.textContent = "";
    }

    /******************************************************************
     * Hiển thị chi tiết thông tin học sinh lên panel
     ******************************************************************/
    showSeatInfo(student) {
        this.infoHo.textContent = student.lastName || "";
        this.infoTen.textContent = student.firstName || "";
        this.infoPH.textContent = student.parentPhone || "";
        this.infoHS.textContent = student.studentPhone || "";
        this.infoTruong.textContent = student.school || "";
        this.infoStatus.textContent = student.isChanged ? "Đã sửa" : "Chưa sửa";
        this.show(this.pnlSeatInfo);
    }

    /******************************************************************
     * Hiển thị số lượng sĩ số đã xếp chỗ lên bộ đếm
     ******************************************************************/
    setSeatCount(count) {
        this.lblSeatCount.textContent = count;
    }

    /******************************************************************
     * Cập nhật trạng thái nút "Lấy thông tin" theo State của App
     ******************************************************************/
    refreshLoadButton(appState) {
        if (appState.selectedClass === "") {
            this.disable(this.btnLoad);
            this.setText(this.btnLoad, "Lấy thông tin");
            return;
        }

        if (appState.isClassLoaded) {
            this.disable(this.btnLoad);
            this.setText(this.btnLoad, "Đã lấy thông tin lớp thành công!");
            return;
        }

        this.enable(this.btnLoad);
        this.setText(this.btnLoad, "Lấy thông tin");
    }

    /******************************************************************
     * Thay đổi text trạng thái khi đang gửi yêu cầu tải lớp
     ******************************************************************/
    showLoadingClass() {
        this.disable(this.btnLoad);
        this.setText(this.btnLoad, "Đang lấy thông tin...");
    }

    /******************************************************************
     * Cập nhật trạng thái ô nhập tên cột Excel
     ******************************************************************/
    refreshColumnInput(appState) {
        if (appState.isClassLoaded) {
            this.enable(this.txtColumn);
        } else {
            this.disable(this.txtColumn);
        }
    }

    /******************************************************************
     * Cập nhật nút "Kiểm tra cột" dựa trên dữ liệu người dùng nhập vào
     ******************************************************************/
    refreshCheckColumnButton(appState) {
        if (!appState.isClassLoaded) {
            this.disable(this.btnCheckColumn);
            this.setText(this.btnCheckColumn, "Kiểm tra cột");
            return;
        }

        if (appState.inputColumn.trim() === "") {
            this.disable(this.btnCheckColumn);
            this.setText(this.btnCheckColumn, "Kiểm tra cột");
            return;
        }

        if (appState.isColumnChecked) {
            this.disable(this.btnCheckColumn);
            this.setText(this.btnCheckColumn, "Tồn tại cột điểm danh");
            return;
        }

        this.enable(this.btnCheckColumn);
        this.setText(this.btnCheckColumn, "Kiểm tra cột");
    }

    /******************************************************************
     * Thay đổi trạng thái nút khi đang kiểm tra cột điểm danh API
     ******************************************************************/
    showCheckingColumn() {
        this.disable(this.btnCheckColumn);
        this.setText(this.btnCheckColumn, "Đang kiểm tra cột...");
    }

    /******************************************************************
     * Đồng bộ bảng thông tin chi tiết chỗ ngồi dựa trên ghế đang chọn
     ******************************************************************/
    refreshSeatInformation(appState, seatManager, studentManager) {

        // Luôn hiện panel
        this.show(this.pnlSeatInfo);

        // Chưa chọn ghế
        if (!appState.hasSelectedSeat) {

            this.clearSeatInfo();

            this.disable(this.btnSua);
            this.disable(this.btnXoa);
            this.disable(this.btnTim);

            return;
        }

        const seat = seatManager.get(appState.selectedSeatId);

        // Ghế chưa có học sinh
        if (!seat || !seat.hasStudent) {

            this.clearSeatInfo();

            this.disable(this.btnSua);
            this.disable(this.btnXoa);
            this.enable(this.btnTim);

            return;
        }

        

        const student = studentManager.get(seat.studentRow);

        if (!student) {

            this.clearSeatInfo();

            this.disable(this.btnSua);
            this.disable(this.btnXoa);
            this.enable(this.btnTim);

            return;
        }

        // Ghế đã có học sinh
        this.showSeatInfo(student);

        this.enable(this.btnSua);
        this.enable(this.btnXoa);
        this.disable(this.btnTim);
    }

    clearSeatInfo() {

        this.infoHo.textContent = "";
        this.infoTen.textContent = "";
        this.infoPH.textContent = "";
        this.infoHS.textContent = "";
        this.infoTruong.textContent = "";
        this.infoStatus.textContent = "";

    }


    /******************************************************************
     * Cập nhật kích hoạt nút "Điểm danh" nếu sơ đồ đã được xếp chỗ
     ******************************************************************/
    refreshAttendanceButton(seatManager) {
        if (seatManager.countAssigned() > 0) {
            this.enable(this.btnAttendance);
        } else {
            this.disable(this.btnAttendance);
        }
    }

    /******************************************************************
     * Làm mới lại bộ đếm sĩ số sơ đồ
     ******************************************************************/
    refreshCounter(seatManager) {
        this.setSeatCount(seatManager.countAssigned());
    }

    /******************************************************************
     * Gọi đồng bộ toàn bộ giao diện điều khiển (Khớp hoàn hảo với app.js)
     ******************************************************************/
    refreshAll(appState, studentManager, seatManager) {
        this.refreshLoadButton(appState);
        this.refreshColumnInput(appState);
        this.refreshCheckColumnButton(appState);
        this.refreshSeatInformation(appState, seatManager, studentManager);
        this.refreshCounter(seatManager);
        this.refreshAttendanceButton(seatManager);
    }

    /******************************************************************
     * Getter & Setter tương tác dữ liệu Input/Combobox
     ******************************************************************/
    getSelectedClass() {
        return this.cboClass.value.trim();
    }

    setSelectedClass(value) {
        this.cboClass.value = value;
    }

    getInputColumn() {
        return this.txtColumn.value.trim().toUpperCase();
    }

    setInputColumn(value) {
        this.txtColumn.value = value;
    }

    clearInputColumn() {
        this.txtColumn.value = "";
    }

    /******************************************************************
     * Reset riêng vùng thông tin ghế chọn
     ******************************************************************/
    resetSeatInfo() {
        this.clearSeatInfo();
        this.hide(this.pnlSeatInfo);
        this.disable(this.btnSua);
        this.disable(this.btnXoa);
        this.disable(this.btnTim);
    }

    /******************************************************************
     * Khôi phục toàn bộ giao diện về trạng thái ban đầu (Clear Form)
     ******************************************************************/
    reset() {
        this.cboClass.value = "";
        this.txtColumn.value = "";
        this.clearSeatInfo();
        this.hide(this.pnlSeatInfo);
        this.disable(this.btnLoad);
        this.disable(this.txtColumn);
        this.disable(this.btnCheckColumn);
        this.disable(this.btnSua);
        this.disable(this.btnTim);
        this.disable(this.btnXoa);
        this.disable(this.btnAttendance);
        this.setSeatCount(0);
    }

    /******************************************************************
     * Ủy quyền lắng nghe sự kiện từ Controller (app.js)
     ******************************************************************/
    bindEvents(events) {
        if (events.onClassChanged) {
            this.cboClass.addEventListener("change", events.onClassChanged);
        }
        if (events.onLoadClass) {
            this.btnLoad.addEventListener("click", events.onLoadClass);
        }
        if (events.onColumnChanged) {
            this.txtColumn.addEventListener("input", events.onColumnChanged);
        }
        if (events.onCheckColumn) {
            this.btnCheckColumn.addEventListener("click", events.onCheckColumn);
        }
        if (events.onEditStudent) {
            this.btnSua.addEventListener("click", events.onEditStudent);
        }
        if (events.onSearchStudent) {
            this.btnTim.addEventListener("click", events.onSearchStudent);
        }
        if (events.onDeleteSeat) {
            this.btnXoa.addEventListener("click", events.onDeleteSeat);
        }
        if (events.onAttendance) {
            this.btnAttendance.addEventListener("click", events.onAttendance);
        }
    }

    /******************************************************************
     * Bọc các hàm hội thoại mặc định của trình duyệt
     ******************************************************************/
    message(text) {
        alert(text);
    }

    confirm(text) {
        return confirm(text);
    }
}