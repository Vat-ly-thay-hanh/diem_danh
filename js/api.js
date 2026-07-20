/******************************************************************************
 * api.js
 * ----------------------------------------------------------------------------
 * Giao tiếp ứng dụng với Cloudflare Worker / Google Apps Script Backend.
 ******************************************************************************/

const WEB_APP_URL = "https://tight-block-c92c.hanhborn.workers.dev/";
const REQUEST_TIMEOUT_MS = 15000; // Thời gian chờ tối đa: 15 giây

export class Api {
    constructor() {
        this.url = WEB_APP_URL;
    }

    /**********************************************************************
     * Gửi request POST tập trung kèm cơ chế chặn treo mạng (Timeout)
     **********************************************************************/
    async post(data) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let response;

        try {
            response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
                signal: controller.signal // Gắn tín hiệu kiểm soát timeout
            });
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("Kết nối quá hạn, máy chủ phản hồi quá lâu.");
            }
            throw new Error("Không kết nối được máy chủ. Vui lòng kiểm tra mạng.");
        } finally {
            clearTimeout(id); // Xóa bộ đếm thời gian sau khi fetch hoàn tất
        }

        if (!response.ok) {
            throw new Error(`Máy chủ trả về lỗi HTTP: ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch {
            throw new Error("Dữ liệu cấu trúc trả về không hợp lệ (Không phải JSON).");
        }

        if (!result.success) {
            throw new Error(result.message || "Máy chủ phản hồi xử lý thất bại.");
        }

        return result;
    }

    /**********************************************************************
     * Lấy danh sách học sinh dựa trên tên lớp
     **********************************************************************/
    async getStudents(className) {
        const result = await this.post({
            action: "getStudents",
            className: className
        });

        console.log("===== API getStudents =====");
        console.log(result);
        console.log("students =", result.students);
        console.log("isArray =", Array.isArray(result.students));
        console.log("count =", result.students?.length);

        return result.students;
    }

    /**********************************************************************
     * Kiểm tra sự tồn tại của cột điểm danh trên bảng tính Excel
     **********************************************************************/
    async checkColumn(className, column) {
        const result = await this.post({
            action: "checkColumn",
            className: className,
            column: column
        });
        return result.exists;
    }

    /**********************************************************************
     * Đẩy cấu trúc sơ đồ và trạng thái ghi nhận điểm danh về máy chủ
     **********************************************************************/
    async attendance(className, column, seats) {
        return await this.post({
            action: "attendance",
            className: className,
            column: column,
            seats: seats
        });
    }

    /**********************************************************************
     * Kiểm tra trạng thái hoạt động của Server (Ping-Pong)
     **********************************************************************/
    async ping() {
        return await this.post({
            action: "ping"
        });
    }
}
