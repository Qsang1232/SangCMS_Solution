import axios from 'axios';

const axiosClient = axios.create({
    // Lấy link từ file .env, cộng thêm '/api'
    baseURL: process.env.REACT_APP_API_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});
// Giải thích: Interceptor giúp chúng ta can thiệp vào dữ liệu trước khi trả về cho component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục data bên trong dữ liệu JSON
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
