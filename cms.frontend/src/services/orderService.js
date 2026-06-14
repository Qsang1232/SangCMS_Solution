import axiosClient from '../api/axiosClient';

const orderService = {
    getAllCustomers: () => axiosClient.get('/OrdersApi/customers'),
    getAllOrders: () => axiosClient.get('/OrdersApi'),
    getOrderDetails: (orderId) => axiosClient.get(`/OrdersApi/${orderId}/details`),

    // TÍNH NĂNG MỚI (DÀNH CHO FRONTEND KHÁCH HÀNG): Đẩy đơn hàng lên Backend
    createOrder: (orderData) => {
        return axiosClient.post('/OrdersApi', orderData); // Gửi method POST để tạo mới
    },

    updateOrderStatus: (orderId, status) => {
        return axiosClient.put(`/OrdersApi/${orderId}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    deleteOrder: (orderId) => {
        return axiosClient.delete(`/OrdersApi/${orderId}`);
    }
};

export default orderService;