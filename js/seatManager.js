/******************************************************************************
 * seatManager.js
 * ----------------------------------------------------------------------------
 * Quản lý toàn bộ sơ đồ lớp.
 ******************************************************************************/

import { Seat } from "./seat.js";
import { getAllSeatIds } from "./layout.js";

export class SeatManager {
    constructor() {
        this.seats = new Map();
        this.initialize();
    }

    /* =======================================================================
       Khởi tạo cấu trúc phòng học (Mặc định 80 ghế)
    ======================================================================= */
    initialize() {
        this.seats.clear();
        getAllSeatIds().forEach(id => {
            this.seats.set(id, new Seat(id));
        });
    }

    /* =======================================================================
       Lấy thông tin một chiếc ghế
    ======================================================================= */
    get(seatId) {
        return this.seats.get(seatId) ?? null;
    }

    /* =======================================================================
       Kiểm tra ghế có tồn tại trong phòng không
    ======================================================================= */
    has(seatId) {
        return this.seats.has(seatId);
    }

    /* =======================================================================
       Danh sách toàn bộ ghế dưới dạng mảng
    ======================================================================= */
    getAll() {
        return [...this.seats.values()];
    }

    /* =======================================================================
       Tìm xem học sinh đang ngồi ở ghế nào dựa vào số hàng
    ======================================================================= */
    findSeatByStudent(studentRow) {
        for (const seat of this.seats.values()) {
            if (seat.studentRow === studentRow) {
                return seat;
            }
        }
        return null;
    }

    /* =======================================================================
       Kiểm tra học sinh đã được xếp chỗ hay chưa
    ======================================================================= */
    isAssigned(studentRow) {
        return this.findSeatByStudent(studentRow) !== null;
    }

    /* =======================================================================
       Gán học sinh vào ghế (Tự động giải phóng ghế cũ nếu đổi chỗ)
    ======================================================================= */
    assign(seatId, studentRow) {
        const seat = this.get(seatId);
        if (!seat) {
            return false;
        }

        // Nếu học sinh đã ngồi ghế khác, giải phóng ghế cũ trước
        const oldSeat = this.findSeatByStudent(studentRow);
        if (oldSeat && oldSeat.id !== seatId) {
            oldSeat.clear();
        }

        seat.assign(studentRow);
        return true;
    }

    /* =======================================================================
       Giải phóng một chiếc ghế (Đuổi học sinh ra khỏi ghế)
    ======================================================================= */
    clearSeat(seatId) {
        const seat = this.get(seatId);
        if (!seat) {
            return false;
        }
        seat.clear();
        return true;
    }

    /* =======================================================================
       Xóa trống toàn bộ sơ đồ lớp học
    ======================================================================= */
    clearAssignments() {
        this.seats.forEach(seat => {
            seat.clear();
        });
    }

    /* =======================================================================
       Đếm tổng số học sinh đã có chỗ ngồi (Phục vụ bộ đếm sĩ số)
    ======================================================================= */
    countAssigned() {
        let count = 0;
        this.seats.forEach(seat => {
            if (seat.hasStudent) {
                count++;
            }
        });
        return count;
    }

    /* =======================================================================
       Bỏ chọn tất cả các ghế trong phòng
    ======================================================================= */
    unselectAll() {
        this.seats.forEach(seat => {
            seat.unselect();
        });
    }

    /* =======================================================================
       Chọn một chiếc ghế cụ thể (Đồng thời tự động bỏ chọn ghế cũ)
    ======================================================================= */
    select(seatId) {
        this.unselectAll();
        const seat = this.get(seatId);
        if (!seat) {
            return false;
        }
        seat.select();
        return true;
    }

    /* =======================================================================
       Lấy chiếc ghế hiện đang được chọn
    ======================================================================= */
    getSelected() {
        for (const seat of this.seats.values()) {
            if (seat.isSelected()) {
                return seat;
            }
        }
        return null;
    }

    /* =======================================================================
       Xuất dữ liệu sơ đồ lớp sang cấu trúc JSON
    ======================================================================= */
    toJSON() {
        return this.getAll().map(seat => seat.toJSON());
    }

    /* =======================================================================
       Khôi phục trạng thái sơ đồ từ mảng lưu trữ JSON
    ======================================================================= */
    restore(jsonArray) {
        this.initialize();
        if (!Array.isArray(jsonArray)) {
            return;
        }

        // Khôi phục vị trí các học sinh
        jsonArray.forEach(item => {
            if (item.studentRow !== null) {
                this.assign(item.id, item.studentRow);
            }
        });

        // Khôi phục cờ chọn ghế
        const selectedSeat = jsonArray.find(item => item.selected);
        if (selectedSeat) {
            this.select(selectedSeat.id);
        }
    }
}