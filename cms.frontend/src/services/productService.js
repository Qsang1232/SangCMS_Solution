import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: (filters = {}) => {
        // Xây dựng query string từ các bộ lọc
        const params = {};
        if (filters.categoryProductId) params.categoryProductId = filters.categoryProductId;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.keyword) params.keyword = filters.keyword;

        return axiosClient.get('/ProductsApi', { params });
    },
    getProductById: (id) => {
        return axiosClient.get(`/ProductsApi/${id}`);
    }
};

export default productService;