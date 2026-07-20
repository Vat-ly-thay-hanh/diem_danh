/******************************************************************************
 * studentManager.js
 * ----------------------------------------------------------------------------
 * Quản lý toàn bộ danh sách học sinh.
 ******************************************************************************/

import { Student } from "./student.js";

export class StudentManager {
    constructor() {
        // key = row trong Google Sheet
        this.students = new Map();
    }

    /* =======================================================================
       Thêm học sinh
    ======================================================================= */
    add(student) {

        if (!(student instanceof Student)) {
            student = new Student(student);
        }

        this.students.set(student.row, student);

    }

    /* =======================================================================
       Lấy học sinh theo số hàng
    ======================================================================= */
    get(row) {
        return this.students.get(row) ?? null;
    }

    /* =======================================================================
       Kiểm tra tồn tại
    ======================================================================= */
    has(row) {
        return this.students.has(row);
    }

    /* =======================================================================
       Xóa học sinh
    ======================================================================= */
    remove(row) {
        this.students.delete(row);
    }

    /* =======================================================================
       Xóa toàn bộ
    ======================================================================= */
    clear() {
        this.students.clear();
    }

    /* =======================================================================
       Tổng số học sinh
    ======================================================================= */
    count() {
        return this.students.size;
    }

    /* =======================================================================
       Danh sách Student
    ======================================================================= */
    getAll() {
        return [...this.students.values()];
    }

    /* =======================================================================
       Danh sách theo thứ tự hàng Google Sheet
    ======================================================================= */
    getAllSorted() {
        return [...this.students.values()].sort((a, b) => a.row - b.row);
    }

    /* =======================================================================
       Tìm kiếm học sinh theo tên hoặc họ tên (Không phân biệt hoa thường)
    ======================================================================= */
    search(keyword) {
        keyword = keyword.trim().toLowerCase();
        if (keyword === "") {
            return [];
        }

        // TỐI ƯU TẠI ĐÂY: Tìm kiếm gần đúng dựa trên cả họ lẫn tên (fullName)
        return this.getAllSorted().filter(student =>
            student.fullName.toLowerCase().includes(keyword)
        );
    }

    /* =======================================================================
       Lấy tất cả học sinh đã chỉnh sửa
    ======================================================================= */
    getChangedStudents() {
        return this.getAll().filter(student => student.isChanged);
    }

    /* =======================================================================
       Reset trạng thái changed
    ======================================================================= */
    resetChangedFlags() {
        this.getAll().forEach(student => student.resetChanged());
    }

    /* =======================================================================
       Xuất JSON
    ======================================================================= */
    toJSON() {
        return this.getAllSorted().map(student => student.toJSON());
    }

    /* =======================================================================
       Khôi phục danh sách từ mảng JSON nhận được từ API
    ======================================================================= */
    restore(jsonArray) {
        this.clear();
        if (!Array.isArray(jsonArray)) {
            return;
        }
        jsonArray.forEach(item => {
            this.add(Student.fromJSON(item));
        });
    }
}
