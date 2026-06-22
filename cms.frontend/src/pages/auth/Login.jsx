import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Login() {
    const navigate = useNavigate();

    // STATE CHO FORM ĐĂNG NHẬP
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // STATE CHO CHỨC NĂNG QUÊN MẬT KHẨU
    const [isForgotMode, setIsForgotMode] = useState(false); // Công tắc chuyển form
    const [forgotEmail, setForgotEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // HÀM XỬ LÝ ĐĂNG NHẬP
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                Email: credentials.email,
                Password: credentials.password
            };
            const userData = await authService.login(payload);
            localStorage.setItem('bikeCustomer', JSON.stringify(userData));

            // Ép hệ thống báo sự kiện để Header tự cập nhật tên
            window.dispatchEvent(new Event('storage'));

            alert(`Đăng nhập thành công! Chào mừng ${userData.fullName} trở lại.`);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Sai email hoặc mật khẩu!');
        }
    };

    // HÀM XỬ LÝ QUÊN MẬT KHẨU
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const response = await authService.forgotPassword({ Email: forgotEmail });
            setSuccessMsg(response.message || "Mật khẩu mới đã được gửi vào Email của bạn!");
            setForgotEmail(''); // Xóa trắng ô nhập liệu sau khi gửi thành công
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi hệ thống khi gửi email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper d-flex flex-column min-vh-100 bg-light">
            <Header />

            <div className="container flex-grow-1 d-flex justify-content-center align-items-center py-5">
                <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '15px' }}>
                    <div className="card-body p-5">

                        {/* HIỂN THỊ THÔNG BÁO LỖI HOẶC THÀNH CÔNG CHUNG */}
                        {error && <div className="alert alert-danger small py-2 text-center fw-bold">{error}</div>}
                        {successMsg && <div className="alert alert-success small py-2 text-center fw-bold">{successMsg}</div>}

                        {/* ========================================================= */}
                        {/* GIAO DIỆN QUÊN MẬT KHẨU */}
                        {/* ========================================================= */}
                        {isForgotMode ? (
                            <div>
                                <div className="text-center mb-4">
                                    <h4 className="font-weight-bold text-uppercase" style={{ color: '#1a1a1a' }}>Lấy Lại Mật Khẩu</h4>
                                    <div className="mx-auto mt-2 mb-3" style={{ width: '50px', height: '3px', backgroundColor: '#FF5A00' }}></div>
                                    <p className="text-muted small">Vui lòng nhập Email bạn đã dùng để đăng ký. Hệ thống sẽ gửi mật khẩu mới cho bạn.</p>
                                </div>

                                <form onSubmit={handleForgotSubmit}>
                                    <div className="form-group mb-4">
                                        <input
                                            type="email"
                                            className="form-control bg-light border-0 py-4"
                                            placeholder="Ví dụ: admin@sangcms.bikes"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-block text-white font-weight-bold py-3 text-uppercase mb-3"
                                        style={{ backgroundColor: '#FF5A00', borderRadius: '8px', letterSpacing: '1px' }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "ĐANG GỬI EMAIL..." : "NHẬN MẬT KHẨU MỚI"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-block btn-light font-weight-bold py-3 text-uppercase"
                                        onClick={() => { setIsForgotMode(false); setError(''); setSuccessMsg(''); }}
                                    >
                                        QUAY LẠI ĐĂNG NHẬP
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* ========================================================= */
                            /* GIAO DIỆN ĐĂNG NHẬP (MẶC ĐỊNH) */
                            /* ========================================================= */
                            <div>
                                <div className="text-center mb-4">
                                    <h3 className="font-weight-bold text-uppercase" style={{ color: '#1a1a1a' }}>Đăng Nhập</h3>
                                    <div className="mx-auto mt-2 mb-3" style={{ width: '50px', height: '3px', backgroundColor: '#FF5A00' }}></div>
                                    <p className="text-muted small">Mở khóa đam mê cùng SangCMS Bikes</p>
                                </div>

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

                                            {/* NÚT BẤM KÍCH HOẠT FORM QUÊN MẬT KHẨU */}
                                            <button
                                                type="button"
                                                className="btn btn-link small text-decoration-none p-0"
                                                style={{ color: '#FF5A00', fontSize: '13px' }}
                                                onClick={() => { setIsForgotMode(true); setError(''); setSuccessMsg(''); }}
                                            >
                                                Quên mật khẩu?
                                            </button>
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
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;