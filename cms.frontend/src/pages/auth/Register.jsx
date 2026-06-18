import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService'; // Khai báo gọi API
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Register() {
    // KHAI BÁO LẠI CÁC BIẾN (Chính là những cái đang bị báo lỗi not defined)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không trùng khớp!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Mật khẩu phải chứa ít nhất 6 ký tự!");
            return;
        }

        try {
            // GỌI API ĐĂNG KÝ XUỐNG C#
            const payload = {
                FullName: formData.fullName,
                Email: formData.email,
                Phone: formData.phone,
                Password: formData.password
            };

            await authService.register(payload);

            alert("🎉 Chúc mừng bạn đã đăng ký tài khoản thành công! Vui lòng đăng nhập.");
            navigate('/login');

        } catch (err) {
            // Bắt lỗi nếu Email đã tồn tại từ C# ném lên
            setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className="register-page-wrapper d-flex flex-column min-vh-100 bg-light">
            <Header />

            <div className="container flex-grow-1 d-flex justify-content-center align-items-center py-5">
                <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
                    <div className="card-body p-4 p-md-5">

                        <div className="text-center mb-4">
                            <h3 className="font-weight-bold text-uppercase" style={{ color: '#1a1a1a' }}>Tạo Tài Khoản</h3>
                            <div className="mx-auto mt-2 mb-3" style={{ width: '50px', height: '3px', backgroundColor: '#11CAA0' }}></div>
                            <p className="text-muted small">Gia nhập cộng đồng xe đạp lớn nhất Việt Nam</p>
                        </div>

                        {error && <div className="alert alert-danger small py-2 text-center">{error}</div>}

                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-group mb-3">
                                <label className="font-weight-bold small text-muted">Họ và tên</label>
                                <input type="text" name="fullName" className="form-control bg-light border-0" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={handleChange} required />
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group mb-3">
                                    <label className="font-weight-bold small text-muted">Email</label>
                                    <input type="email" name="email" className="form-control bg-light border-0" placeholder="email@domain.com" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 form-group mb-3">
                                    <label className="font-weight-bold small text-muted">Số điện thoại</label>
                                    <input type="tel" name="phone" className="form-control bg-light border-0" placeholder="090x..." value={formData.phone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="font-weight-bold small text-muted">Mật khẩu</label>
                                <input type="password" name="password" className="form-control bg-light border-0" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                            </div>

                            <div className="form-group mb-4">
                                <label className="font-weight-bold small text-muted">Xác nhận mật khẩu</label>
                                <input type="password" name="confirmPassword" className="form-control bg-light border-0" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>

                            <button type="submit" className="btn btn-block text-white font-weight-bold py-3 text-uppercase" style={{ backgroundColor: '#11CAA0', borderRadius: '8px', letterSpacing: '1px' }}>
                                Đăng Ký Ngay
                            </button>
                        </form>

                        <div className="text-center mt-4 pt-3 border-top">
                            <p className="small text-muted mb-0">
                                Đã có tài khoản? <Link to="/login" className="font-weight-bold text-decoration-none" style={{ color: '#FF5A00' }}>Đăng nhập ngay</Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Register;