import axiosClient from '../api/axiosClient';

const blogService = {
    // Gọi đến api/Posts (Khớp với Controller vừa tạo ở trên)
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },

    // Gọi đến api/CategoriesProducts (Khớp 100% với file C# em gửi)
    getBlogCategories: () => {
        return axiosClient.get('/CategoriesProducts');
    }
};

export default blogService;