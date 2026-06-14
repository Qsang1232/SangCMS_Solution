import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách quần áo, váy dạ hội
    getAllProducts: () => {
        const url = '/ProductsApi';
        return axiosClient.get(url);
    },

    // BỔ SUNG HÀM NÀY: Gọi API lấy chi tiết 1 sản phẩm theo ID
    getProductById: (id) => {
        // Nó sẽ gọi xuống C# theo đường dẫn: /ProductsApi/1, /ProductsApi/2...
        const url = `/ProductsApi/${id}`;
        return axiosClient.get(url);
    }
};

export default productService;