import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách bài viết
    getAllPosts: () => {
        // Khớp với file PostsController.cs trong Backend
        return axiosClient.get('/Posts');
    },

    // 2. Hàm lấy danh mục bài viết (Chủ đề)
    getBlogCategories: () => {
        return axiosClient.get('/ProductsApi');
    }
};

export default blogService;