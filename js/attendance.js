/******************************************************************************
 * attendance.js
 * ----------------------------------------------------------------------------
 * Xử lý điểm danh và đồng bộ hóa trạng thái ứng dụng.
 ******************************************************************************/

export class Attendance {
    constructor(api, dialog, appState, seatManager, studentManager) {
        this.api = api;
        this.dialog = dialog;
        this.appState = appState;
        this.seatManager = seatManager;
        this.studentManager = studentManager;
    }

    /******************************************************************
     * Hiện hộp thoại xác nhận trước khi điểm danh
     ******************************************************************/
    openConfirm() {
        this.dialog.showConfirm();
    }

    /******************************************************************
     * Người dùng hủy bỏ thao tác điểm danh
     ******************************************************************/
    cancel() {
        this.dialog.closeConfirm();
    }

    /******************************************************************
     * Thực thi tiến trình gửi dữ liệu điểm danh bất đồng bộ
     ******************************************************************/
    async execute() {
        this.dialog.closeConfirm();
        this.dialog.showLoading();

        try {
            const seats = this.buildSeatData();
            
            // Gọi API gửi thông tin lớp, tên cột điểm danh và cấu trúc sơ đồ ghế
            await this.api.attendance(
                this.appState.loadedClass,
                this.appState.checkedColumn,
                seats
            );

            this.dialog.closeLoading();
            this.dialog.showSuccess();
        } catch (error) {
            console.error("Lỗi tiến trình điểm danh hệ thống:", error);
            this.dialog.closeLoading();
            this.dialog.showError();
        }
    }

    /******************************************************************
     * Chuẩn hóa và đóng gói cấu trúc dữ liệu gửi lên máy chủ
     ******************************************************************/
    buildSeatData() {
        const result = [];

        this.seatManager.getAll().forEach(seat => {
            const item = {
                seatId: seat.id,
                hasStudent: seat.hasStudent,
                student: null
            };

            if (seat.hasStudent) {
                const student = this.studentManager.get(seat.studentRow);
                if (student) {
                    item.student = {
                        row: student.row,
                        lastName: student.lastName,
                        firstName: student.firstName,
                        parentPhone: student.parentPhone,
                        studentPhone: student.studentPhone,
                        school: student.school,
                        isChanged: student.isChanged
                    };
                }
            }

            result.push(item);
        });

        return result;
    }

    /******************************************************************
     * Đóng hộp thoại báo thành công để tiếp tục ở lại giao diện
     ******************************************************************/
    backSuccess() {
        this.dialog.closeSuccess();
    }

    /******************************************************************
     * Xử lý hành động thoát sau khi điểm danh thành công
     ******************************************************************/
    exit() {
        this.dialog.closeSuccess();
        // Cố gắng đóng cửa sổ nếu quyền hạn trình duyệt cho phép
        if (window.opener || window.history.length === 1) {
            window.close();
        } else {
            // Giải pháp an toàn thay thế: Tải lại trang hoặc điều hướng về trang chủ điều khiển
            window.location.reload();
        }
    }

    /******************************************************************
     * Đóng hộp thoại báo lỗi để người dùng kiểm tra lại dữ liệu sơ đồ
     ******************************************************************/
    backError() {
        this.dialog.closeError();
    }
}