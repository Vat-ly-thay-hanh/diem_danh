/******************************************************************************
 * search.js
 * ----------------------------------------------------------------------------
 * Xử lý tìm kiếm và gán học sinh vào chỗ ngồi.
 ******************************************************************************/

export class Search {
    constructor(dialog, studentManager, seatManager, appState) {
        this.dialog = dialog;
        this.studentManager = studentManager;
        this.seatManager = seatManager;
        this.appState = appState;
    }

    /******************************************************************
     * Mở hộp thoại tìm kiếm
     ******************************************************************/
    open() {
        this.dialog.showSearch();
    }

    /******************************************************************
     * Thực hiện tìm kiếm và đẩy kết quả sang Dialog
     ******************************************************************/
    search() {
        // 1. Xóa kết quả cũ trên giao diện
        this.dialog.clearSearchResult();

        // 2. Lấy từ khóa và tìm trong danh sách học sinh
        const keyword = this.dialog.getSearchKeyword();
        const students = this.studentManager.search(keyword);

        // 3. Đẩy từng kết quả hiển thị lên giao diện
        students.forEach(student => {
            this.dialog.addSearchItem(
                `${student.lastName} ${student.firstName} (${student.school})`,
                student.row
            );
        });
        
        // Lưu ý: Không cần bindResultEvents() hay selectItem() nữa, 
        // dialog.js đã tự động xử lý Event Delegation cực kỳ mượt mà rồi!
    }

    /******************************************************************
     * Gán học sinh được chọn vào ghế trống
     ******************************************************************/
    assign() {
        // Lấy thông tin dòng học sinh đang được user chọn trực tiếp từ View (Dialog)
        const selectedRow = this.dialog.getSelectedStudentRow();

        if (selectedRow === null) {
            return false; // Không có học sinh nào được chọn
        }

        // Thực hiện gán học sinh vào ghế đang thao tác
        this.seatManager.assign(
            this.appState.selectedSeatId,
            selectedRow
        );

        // Đóng hộp thoại tìm kiếm sau khi gán thành công
        this.dialog.closeSearch();
        
        return true;
    }
}