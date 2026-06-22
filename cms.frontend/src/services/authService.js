import axiosClient from '../api/axiosClient';

const authService = {
    login: (credentials) => {
        return axiosClient.post('/CustomersApi/login', credentials);
    },
    register: (userData) => {
        return axiosClient.post('/CustomersApi/register', userData);
    },
    // THÊM HÀM NÀY ĐỂ GỌI API QUÊN MẬT KHẨU
    forgotPassword: (data) => {
        return axiosClient.post('/CustomersApi/forgot-password', data);
    }
};

export default authService;