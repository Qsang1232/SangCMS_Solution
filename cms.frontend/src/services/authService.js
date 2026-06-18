import axiosClient from '../api/axiosClient'; // Đã sửa lại đường dẫn trỏ về thư mục api

const authService = {
    login: (credentials) => {
        return axiosClient.post('/CustomersApi/login', credentials);
    },
    register: (userData) => {
        return axiosClient.post('/CustomersApi/register', userData);
    }
};

export default authService;