/******************************************************************************
 * student.js
 * ----------------------------------------------------------------------------
 * Lớp Student
 *
 * Chỉ quản lý thông tin của một học sinh.
 * Không quản lý vị trí ngồi.
 ******************************************************************************/

export class Student {

    /**
     * @param {Object} data
     */
    constructor(data = {}) {

        // Hàng trong Google Sheet
        this.row = Number(data.row ?? 0);

        // Họ
        this.lastName = data.lastName?.trim() ?? "";

        // Tên
        this.firstName = data.firstName?.trim() ?? "";

        // SĐT phụ huynh
        this.parentPhone = data.parentPhone?.trim() ?? "";

        // SĐT học sinh
        this.studentPhone = data.studentPhone?.trim() ?? "";

        // Trường
        this.school = data.school?.trim() ?? "";

        // Đã chỉnh sửa hay chưa
        this.changed = Boolean(data.isChanged ?? false);

    }

    /* =======================================================================
       Getter
    ======================================================================= */

    get fullName() {

        return `${this.lastName} ${this.firstName}`.trim();

    }

    get isChanged() {

        return this.changed;

    }

    get isEmpty() {

        return (

            this.lastName === "" &&

            this.firstName === "" &&

            this.parentPhone === "" &&

            this.studentPhone === "" &&

            this.school === ""

        );

    }

    /* =======================================================================
       Setter
    ======================================================================= */

    setChanged(value = true) {

        this.changed = Boolean(value);

    }

    /* =======================================================================
       Cập nhật thông tin
    ======================================================================= */

    update(data = {}) {

        if ("lastName" in data)
            this.lastName = data.lastName.trim();

        if ("firstName" in data)
            this.firstName = data.firstName.trim();

        if ("parentPhone" in data)
            this.parentPhone = data.parentPhone.trim();

        if ("studentPhone" in data)
            this.studentPhone = data.studentPhone.trim();

        if ("school" in data)
            this.school = data.school.trim();

        this.changed = true;

    }

    /* =======================================================================
       Đặt lại trạng thái chỉnh sửa
    ======================================================================= */

    resetChanged() {

        this.changed = false;

    }

    /* =======================================================================
       Xóa toàn bộ dữ liệu
    ======================================================================= */

    clear() {

        this.lastName = "";

        this.firstName = "";

        this.parentPhone = "";

        this.studentPhone = "";

        this.school = "";

        this.changed = false;

    }

    /* =======================================================================
       Sao chép
    ======================================================================= */

    clone() {

        return new Student(this.toJSON());

    }

    /* =======================================================================
       Chuyển thành Object để lưu JSON
    ======================================================================= */

    toJSON() {

        return {

            row: this.row,

            lastName: this.lastName,

            firstName: this.firstName,

            parentPhone: this.parentPhone,

            studentPhone: this.studentPhone,

            school: this.school,

            changed: this.changed

        };

    }

    /* =======================================================================
       Khởi tạo từ Object
    ======================================================================= */

    static fromJSON(json) {

        return new Student(json);

    }

}
