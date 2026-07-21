/******************************************************************************
 * seatMap.js
 * ----------------------------------------------------------------------------
 * Quản lý giao diện sơ đồ lớp.
 ******************************************************************************/

export class SeatMap {
    /**
     * @param {String} containerId
     * @param {SeatManager} seatManager
     */
    constructor(containerId, seatManager) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error("Không tìm thấy cấu trúc DOM cho seatMap.");
        }

        // Lưu lại để dùng nội bộ trong class khi refresh
        this.seatManager = seatManager; 
        this.clickCallback = null;

        // Tự động dựng khung ghế khi khởi tạo
        this.render();
    }

    /* =======================================================================
       Dựng 72 ghế lên giao diện HTML (Đổi từ create -> render cho khớp app.js)
    ======================================================================= */
render() {

    this.container.innerHTML = "";

    const columns = ["A", "B", "C", "D", "", "E", "F", "G", "H"];

    for (let row = 9; row >= 1; row--) {

        columns.forEach(column => {

            // Gặp lối đi
            if (column === "") {

                const gap = document.createElement("div");
                gap.className = "seat-gap";

                this.container.appendChild(gap);

                return;

            }

            const seatId = `${row}${column}`;

            const seat = document.createElement("div");

            seat.className = "seat seat-empty";

            seat.dataset.id = seatId;

            seat.textContent = seatId;

            seat.addEventListener("click", () => {

                if (this.clickCallback) {

                    this.clickCallback(seatId);

                }

            });

            this.container.appendChild(seat);

        });

    }

}

    /* =======================================================================
       Đăng ký sự kiện click từ Controller (app.js)
    ======================================================================= */
    onSeatClick(callback) {
        this.clickCallback = callback;
    }

    /* =======================================================================
       Lấy phần tử DOM của một ghế cụ thể
    ======================================================================= */
    getSeatElement(seatId) {
        return this.container.querySelector(`[data-id="${seatId}"]`);
    }

    /* =======================================================================
       Xóa hiệu ứng trạng thái đang chọn của tất cả các ghế trên giao diện
    ======================================================================= */
    clearSelection() {
        this.container.querySelectorAll(".seat").forEach(seat => {
            seat.classList.remove("seat-selected");
        });
    }

    /* =======================================================================
       Hiển thị hiệu ứng chọn một chiếc ghế
    ======================================================================= */
    select(seatId) {
        this.clearSelection();
        const seat = this.getSeatElement(seatId);
        if (seat) {
            seat.classList.add("seat-selected");
        }
    }

    /* =======================================================================
       Cập nhật trạng thái màu sắc (Trống / Có người) của một chiếc ghế
    ======================================================================= */
    updateSeat(seat) {
        const element = this.getSeatElement(seat.id);
        if (!element) {
            return;
        }

        element.classList.remove("seat-empty", "seat-full");

        if (seat.hasStudent) {
            element.classList.add("seat-full");
        } else {
            element.classList.add("seat-empty");
        }
    }

    /* =======================================================================
       Đồng bộ lại toàn bộ trạng thái sơ đồ ghế (Khớp hoàn hảo với app.js)
    ======================================================================= */
    refresh() {
        // Lấy danh sách ghế từ SeatManager đã lưu ở constructor
        this.seatManager.getAll().forEach(seat => {
            this.updateSeat(seat);
            
            // Đồng bộ luôn trạng thái chọn ghế từ thuộc tính nội tại của Seat đối tượng
            const element = this.getSeatElement(seat.id);
            if (element) {
                if (seat.isSelected()) {
                    element.classList.add("seat-selected");
                } else {
                    element.classList.remove("seat-selected");
                }
            }
        });
    }

    /* =======================================================================
       Reset giao diện sơ đồ về trạng thái trống ban đầu
    ======================================================================= */
    reset() {
        this.container.querySelectorAll(".seat").forEach(seat => {
            seat.classList.remove("seat-full", "seat-selected");
            seat.classList.add("seat-empty");
        });
    }
}