import axiosClient from '../api/axiosClient'; // Đã sửa lại đường dẫn trỏ về thư mục api

const productService = {
    getAllProducts: (filters = null) => {
        return axiosClient.get('/ProductsApi');
    },
    getProductById: (id) => {
        return axiosClient.get(`/ProductsApi/${id}`);
    }
};

export default productService;