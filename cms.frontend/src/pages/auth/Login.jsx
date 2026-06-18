import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService'; // Khai báo gọi API
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Login() {
    // KHAI BÁO LẠI CÁC BIẾN
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            // GỌI API ĐĂNG NHẬP XUỐNG C#
            const payload = {
                Email: credentials.email,
                Password: credentials.password
            };

            const userData = await authService.login(payload);

            // NẾU THÀNH CÔNG: Lưu thông tin từ SQL Server vào Trình duyệt
            localStorage.setItem('bikeCustomer', JSON.stringify(userData));

            alert(`Đăng nhập thành công! Chào mừng ${userData.fullName} trở lại.`);
            navigate('/'); // Trở về trang chủ

        } catch (err) {
            // Bắt lỗi sai Pass/Email từ C# ném lên
            setError(err.response?.data?.message || 'Sai email hoặc mật khẩu!');
        }
    };

    return (
        <div className="login-page-wrapper d-flex flex-column min-vh-100 bg-light">
            <Header />

            <div className="container flex-grow-1 d-flex justify-content-center align-items-center py-5">
                <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
                    <div className="card-body p-5">

                        <div className="text-center mb-4">
                            <h3 className="font-weight-bold text-uppercase" style={{ color: '#1a1a1a' }}>Đăng Nhập</h3>
                            <div className="mx-auto mt-2 mb-3" style={{ width: '50px', height: '3px', backgroundColor: '#FF5A00' }}></div>
                            <p className="text-muted small">Mở khóa đam mê cùng SangCMS Bikes</p>
                        </div>

                        {error && <div className="alert alert-danger small py-2 text-center">{error}</div>}

                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group mb-3">
                                <label className="font-weight-bold small text-muted">Email của bạn</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control bg-light border-0 py-4"
                                    placeholder="Ví dụ: admin@sangcms.bikes"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="font-weight-bold small text-muted mb-0">Mật khẩu</label>
                                    <a href="#" className="small text-decoration-none" style={{ color: '#FF5A00' }}>Quên mật khẩu?</a>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control bg-light border-0 py-4 mt-1"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-block text-white font-weight-bold py-3 text-uppercase"
                                style={{ backgroundColor: '#FF5A00', borderRadius: '8px', letterSpacing: '1px' }}
                            >
                                Đăng Nhập
                            </button>
                        </form>

                        <div className="text-center mt-4 pt-3 border-top">
                            <p className="small text-muted mb-0">
                                Chưa có tài khoản? <Link to="/register" className="font-weight-bold text-decoration-none" style={{ color: '#11CAA0' }}>Đăng ký ngay</Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;