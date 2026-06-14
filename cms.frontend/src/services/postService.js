// Import cấu hình axiosClient dùng chung đã được cấu hình BaseURL ở thư mục api
import axiosClient from '../api/axiosClient';

const postService = {
    /**
     * 1. Lấy danh sách toàn bộ bài viết tin tức từ Backend
     * API Endpoint: GET /api/Posts
     * Tương ứng Backend: [HttpGet] public async Task<IActionResult> GetAll()
     */
    getAllPosts: async () => {
        try {
            // Thực hiện gọi API GET qua axiosClient
            const response = await axiosClient.get('/Posts');
            // Trả về dữ liệu mảng bài viết
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getAllPosts:", error);
            throw error; // Đẩy lỗi ra ngoài để Component nhận biết và xử lý UI
        }
    },

    /**
     * 2. Lấy danh sách bài viết theo mã chuyên mục (CategoryId)
     * API Endpoint: GET /api/Posts/category/{categoryId}
     * Tương ứng Backend: [HttpGet("category/{categoryId}")] public async Task<IActionResult> GetByCategory(int categoryId)
     */
    getPostsByCategory: async (categoryId) => {
        try {
            const response = await axiosClient.get(`/Posts/category/${categoryId}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getPostsByCategory với Category ID ${categoryId}:`, error);
            throw error;
        }
    },

    /**
     * 3. Lấy thông tin chi tiết của một bài viết theo ID
     * API Endpoint: GET /api/Posts/{id}
     * Tương ứng Backend: [HttpGet("{id}")] public async Task<IActionResult> GetDetail(int id)
     */
    getPostById: async (id) => {
        try {
            const response = await axiosClient.get(`/Posts/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getPostById với ID ${id}:`, error);
            throw error;
        }
    }
};

// BẮT BUỘC: Xuất mặc định để các file (như LatestBlog.jsx) có thể import trực tiếp không bị lỗi
export default postService;