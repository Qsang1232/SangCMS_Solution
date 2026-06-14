import axiosClient from '../api/axiosClient';

const categoryProductService = {
    // Tên hàm này phải khớp 100% với tên gọi trong CategoryProductList.jsx
    getAllCategoryProducts: () => {
        // Dựa vào tên file C# của bạn là CategoriesProductsController.cs
        return axiosClient.get('/CategoriesProducts');
    }
};

export default categoryProductService;