/******************************************************************************
 * dialog.js
 * ----------------------------------------------------------------------------
 * Quản lý toàn bộ dialog của chương trình.
 ******************************************************************************/

export class Dialog {
    constructor() {
        /* ==========================================================
           Dialog chỉnh sửa thông tin học sinh
        ========================================================== */
        this.dlgEdit = document.getElementById("dlgEdit");
        this.editHo = document.getElementById("editHo");
        this.editTen = document.getElementById("editTen");
        this.editPH = document.getElementById("editPH");
        this.editHS = document.getElementById("editHS");
        this.editTruong = document.getElementById("editTruong");
        this.btnLuu = document.getElementById("btnLuu");
        this.btnHuy = document.getElementById("btnHuy");

        /* ==========================================================
           Dialog tìm kiếm học sinh để xếp chỗ
        ========================================================== */
        this.dlgSearch = document.getElementById("dlgSearch");
        this.searchText = document.getElementById("searchText");
        this.searchResult = document.getElementById("searchResult");
        this.btnSearch = document.getElementById("btnSearch");
        this.btnGan = document.getElementById("btnGan");
        this.btnThoat = document.getElementById("btnThoat");

        /* ==========================================================
           Dialog xác nhận hành động
        ========================================================== */
        this.dlgConfirm = document.getElementById("dlgConfirm");
        this.btnYes = document.getElementById("btnYes");
        this.btnNo = document.getElementById("btnNo");

        /* ==========================================================
           Dialog trạng thái (Loading, Success, Error)
        ========================================================== */
        this.dlgLoading = document.getElementById("dlgLoading");
        this.dlgSuccess = document.getElementById("dlgSuccess");
        this.btnBack = document.getElementById("btnBack");
        this.btnExit = document.getElementById("btnExit");
        this.dlgError = document.getElementById("dlgError");
        this.btnBackError = document.getElementById("btnBackError");

        // Biến cục bộ lưu trữ hàng của học sinh đang được chọn trong bảng tìm kiếm
        this.selectedStudentRow = null;

        this.initialize();
        this.initSearchSelectionField();
    }

    /******************************************************************
     * Khởi tạo trạng thái ban đầu
     ******************************************************************/
    initialize() {
        this.btnGan.disabled = true;
        this.selectedStudentRow = null;
    }

    /******************************************************************
     * Khởi tạo trình lắng nghe chọn học sinh (Giải quyết triệt để lỗi click)
     ******************************************************************/
    initSearchSelectionField() {
        // Sử dụng Event Delegation lắng nghe click trên khung chứa kết quả
        this.searchResult.addEventListener("click", (e) => {
            const clickedItem = e.target.closest(".search-item");
            if (!clickedItem) return;

            // Xóa trạng thái active của item cũ
            this.searchResult.querySelectorAll(".search-item").forEach(item => {
                item.classList.remove("search-item-selected");
            });

            // Kích hoạt item mới
            clickedItem.classList.add("search-item-selected");
            
            // Lưu lại row của học sinh được chọn và mở khóa nút Gán chỗ
            this.selectedStudentRow = parseInt(clickedItem.dataset.row, 10);
            this.btnGan.disabled = false;
        });
    }

    /******************************************************************
     * Cơ chế đóng mở Dialog lõi của HTML5
     ******************************************************************/
    show(dialog) {
        if (dialog && typeof dialog.showModal === "function") {
            dialog.showModal();
        }
    }

    close(dialog) {
        if (dialog && dialog.open) {
            dialog.close();
        }
    }

    closeAll() {
        [
            this.dlgEdit,
            this.dlgSearch,
            this.dlgConfirm,
            this.dlgLoading,
            this.dlgSuccess,
            this.dlgError
        ].forEach(dialog => this.close(dialog));
    }

    /* =======================================================================
       Chức năng cho Dialog chỉnh sửa (Edit)
    ======================================================================= */
    showEdit(student) {
        this.editHo.value = student.lastName || "";
        this.editTen.value = student.firstName || "";
        this.editPH.value = student.parentPhone || "";
        this.editHS.value = student.studentPhone || "";
        this.editTruong.value = student.school || "";
        this.show(this.dlgEdit);
    }

    getEditData() {
        return {
            lastName: this.editHo.value.trim(),
            firstName: this.editTen.value.trim(),
            parentPhone: this.editPH.value.trim(),
            studentPhone: this.editHS.value.trim(),
            school: this.editTruong.value.trim()
        };
    }

    closeEdit() {
        this.close(this.dlgEdit);
    }

    /* =======================================================================
       Chức năng cho Dialog tìm kiếm và xếp lớp (Search)
    ======================================================================= */
    showSearch() {
        this.searchText.value = "";
        this.clearSearchResult();
        this.selectedStudentRow = null;
        this.btnGan.disabled = true;
        this.show(this.dlgSearch);
    }

    getSearchKeyword() {
        return this.searchText.value.trim();
    }

    getSelectedStudentRow() {
        return this.selectedStudentRow;
    }

    clearSearchResult() {
        this.searchResult.innerHTML = "";
        this.selectedStudentRow = null;
        this.btnGan.disabled = true;
    }

    addSearchItem(text, row) {
        const item = document.createElement("div");
        item.className = "search-item";
        item.dataset.row = row;
        item.textContent = text;
        this.searchResult.appendChild(item);
    }

    closeSearch() {
        this.close(this.dlgSearch);
    }

    /* =======================================================================
       Chức năng quản lý các Dialog thông điệp & Xác nhận còn lại
    ======================================================================= */
    showConfirm() { this.show(this.dlgConfirm); }
    closeConfirm() { this.close(this.dlgConfirm); }

    showLoading() { this.show(this.dlgLoading); }
    closeLoading() { this.close(this.dlgLoading); }

    showSuccess() { this.show(this.dlgSuccess); }
    closeSuccess() { this.close(this.dlgSuccess); }

    showError() { this.show(this.dlgError); }
    closeError() { this.close(this.dlgError); }

    /******************************************************************
     * Đăng ký sự kiện điều hướng từ Controller (app.js)
     ******************************************************************/
    bindEvents(events) {
        if (events.onSaveEdit) this.btnLuu.addEventListener("click", events.onSaveEdit);
        if (events.onCancelEdit) this.btnHuy.addEventListener("click", events.onCancelEdit);
        
        if (events.onSearch) this.btnSearch.addEventListener("click", events.onSearch);
        if (events.onAssign) this.btnGan.addEventListener("click", events.onAssign);
        if (events.onCloseSearch) this.btnThoat.addEventListener("click", events.onCloseSearch);
        
        if (events.onYes) this.btnYes.addEventListener("click", events.onYes);
        if (events.onNo) this.btnNo.addEventListener("click", events.onNo);
        
        if (events.onBack) this.btnBack.addEventListener("click", events.onBack);
        if (events.onExit) this.btnExit.addEventListener("click", events.onExit);
        if (events.onBackError) this.btnBackError.addEventListener("click", events.onBackError);
    }
}