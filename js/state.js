/******************************************************************************
 * state.js
 * ----------------------------------------------------------------------------
 * Quản lý toàn bộ trạng thái biến đổi của ứng dụng.
 ******************************************************************************/

export class AppState {
    constructor() {
        /* ===============================================================
           Thông tin lớp
        =============================================================== */
        // Giá trị đang chọn trong combobox
        this.selectedClass = "";

        // Lớp đã lấy dữ liệu thành công từ API
        this.loadedClass = "";

        /* ===============================================================
           Cột điểm danh
        =============================================================== */
        // Giá trị đang nhập trên ô input
        this.inputColumn = "";

        // Cột đã được API kiểm tra thành công
        this.checkedColumn = "";

        /* ===============================================================
           Ghế đang được chọn
        =============================================================== */
        // ID của ghế (Ví dụ: "4C", nếu không chọn thì để chuỗi rỗng "")
        this.selectedSeatId = "";
    }

    /* ===============================================================
       Các hàm Getter tiện ích phục vụ cho việc kiểm tra logic ở UI
    =============================================================== */

    // Đã tải dữ liệu lớp học hay chưa
    get isClassLoaded() {
        return this.loadedClass !== "";
    }

    // Cột điểm danh nhập vào đã được xác thực hay chưa
    get isColumnChecked() {
        return this.checkedColumn !== "";
    }

    // Hiện tại có đang chọn chiếc ghế nào không
    get hasSelectedSeat() {
        return this.selectedSeatId !== "";
    }
}