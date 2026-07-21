/******************************************************************************
 * seat.js
 * ----------------------------------------------------------------------------
 * Lớp Seat
 *
 * Chỉ quản lý dữ liệu của một vị trí ngồi.
 * Không quản lý giao diện.
 * Không biết Student là gì.
 ******************************************************************************/

export class Seat {

    /**
     * @param {String} id
     */
    constructor(id) {

        // Ví dụ: "1A"
        this.id = id;

        // Đã xác định học sinh hay chưa
        this.status = false;

        // Số hàng của học sinh trong Google Sheet
        // null = chưa có học sinh
        this.studentRow = null;

        // Ghế đang được chọn
        this.selected = false;

    }

    /* =======================================================================
       Getter
    ======================================================================= */

    get hasStudent() {

        return this.studentRow !== null;

    }

    /* =======================================================================
       Gán học sinh
    ======================================================================= */

    assign(studentRow) {

        if (!Number.isInteger(studentRow) || studentRow <= 0) {

            throw new Error("studentRow không hợp lệ.");

        }

        this.studentRow = studentRow;

        this.status = true;

    }

    /* =======================================================================
       Xóa học sinh
    ======================================================================= */

    clear() {

        this.status = false;

        this.studentRow = null;

        this.selected = false;

    }

    /* =======================================================================
       Chọn ghế
    ======================================================================= */

    select() {

        this.selected = true;

    }

    /* =======================================================================
       Bỏ chọn
    ======================================================================= */

    unselect() {

        this.selected = false;

    }

    /* =======================================================================
       Kiểm tra có đang được chọn hay không
    ======================================================================= */

    isSelected() {

        return this.selected;

    }

    /* =======================================================================
       Chuyển sang Object để lưu JSON
    ======================================================================= */

    toJSON() {

        return {

            id: this.id,

            status: this.status,

            studentRow: this.studentRow,

            selected: this.selected

        };

    }

    /* =======================================================================
       Khởi tạo từ JSON
    ======================================================================= */

    static fromJSON(json) {

        const seat = new Seat(json.id);

        seat.status = Boolean(json.status);

        seat.studentRow = json.studentRow ?? null;

        seat.selected = Boolean(json.selected);

        return seat;

    }

}