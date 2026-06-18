import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="main-footer-wrapper text-light pt-5 mt-5" style={{ backgroundColor: '#111111' }}>
            {/* CSS nội bộ thay thế cho onMouseOver inline gây rối code */}
            <style>
                {`
                    .footer-link { color: #a0a0a0; transition: all 0.3s ease; text-decoration: none !important; }
                    .footer-link:hover { color: #FF5A00; padding-left: 5px; }
                    .social-icon { color: #fff; background: #333; width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 10px; transition: 0.3s; }
                    .social-icon:hover { background: #FF5A00; color: #fff; text-decoration: none; }
                `}
            </style>

            <div className="container pb-4">
                <div className="row">

                    {/* Cột 1: Thương hiệu */}
                    <div className="col-md-4 mb-4 mb-md-0">
                        <h4 className="font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>
                            SangCMS<span style={{ color: '#FF5A00' }}>.Bikes</span>
                        </h4>
                        <p className="text-justify" style={{ fontSize: '14px', lineHeight: '1.8', color: '#a0a0a0' }}>
                            Hệ thống xe đạp và phụ kiện cao cấp hàng đầu. Chúng tôi đồng hành cùng đam mê xê dịch của bạn với các dòng xe đạp địa hình (MTB), xe đạp đua (Road) chính hãng và dịch vụ hậu mãi chuyên nghiệp.
                        </p>
                        <div className="mt-4">
                            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
                            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>

                    {/* Cột 2: Hỗ trợ khách hàng */}
                    <div className="col-md-4 mb-4 mb-md-0 pl-md-5">
                        <h5 className="font-weight-bold mb-4 text-uppercase border-left pl-3" style={{ borderLeftColor: '#FF5A00', borderLeftWidth: '4px' }}>
                            Hỗ Trợ Khách Hàng
                        </h5>
                        <ul className="list-unstyled" style={{ fontSize: '14px', lineHeight: '2.2' }}>
                            <li>
                                <Link to="/policy/delivery" className="footer-link">
                                    <i className="fas fa-angle-right mr-2" style={{ fontSize: '12px', color: '#FF5A00' }}></i> Chính sách giao nhận xe
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy/warranty" className="footer-link">
                                    <i className="fas fa-angle-right mr-2" style={{ fontSize: '12px', color: '#FF5A00' }}></i> Chính sách bảo hành khung sườn
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy/maintenance" className="footer-link">
                                    <i className="fas fa-angle-right mr-2" style={{ fontSize: '12px', color: '#FF5A00' }}></i> Gói bảo dưỡng định kỳ
                                </Link>
                            </li>
                            <li>
                                <Link to="/policy/privacy" className="footer-link">
                                    <i className="fas fa-angle-right mr-2" style={{ fontSize: '12px', color: '#FF5A00' }}></i> Bảo mật thông tin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Liên hệ & Showroom */}
                    <div className="col-md-4">
                        <h5 className="font-weight-bold mb-4 text-uppercase border-left pl-3" style={{ borderLeftColor: '#FF5A00', borderLeftWidth: '4px' }}>
                            Hệ Thống Showroom
                        </h5>
                        <ul className="list-unstyled" style={{ fontSize: '14px', lineHeight: '1.8', color: '#a0a0a0' }}>
                            <li className="mb-3 d-flex align-items-start">
                                <i className="fas fa-map-marker-alt mt-1 mr-3" style={{ color: '#FF5A00', fontSize: '16px' }}></i>
                                <span><strong>Showroom TT:</strong> Khu công nghệ cao, Võ Chí Công, Quận 9, Hồ Chí Minh</span>
                            </li>
                            <li className="mb-3 d-flex align-items-center">
                                <i className="fas fa-phone-alt mr-3" style={{ color: '#FF5A00', fontSize: '16px' }}></i>
                                <span>Hotline: <strong className="text-white">090x.xxx.xxx</strong></span>
                            </li>
                            <li className="mb-3 d-flex align-items-center">
                                <i className="fas fa-envelope mr-3" style={{ color: '#FF5A00', fontSize: '16px' }}></i>
                                <span>Email: support@sangcms.bikes</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* THANH BẢN QUYỀN */}
            <div className="copyright-bar py-3 mt-3" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #222' }}>
                <div className="container text-center text-md-left d-md-flex justify-content-between align-items-center">
                    <p className="m-0" style={{ fontSize: '13px', color: '#666' }}>
                        &copy; {new Date().getFullYear()} <strong style={{ color: '#FF5A00' }}>SangCMS Bikes</strong>. All Rights Reserved.
                    </p>
                    <div className="payment-methods mt-2 mt-md-0">
                        {/* Demo các icon thanh toán */}
                        <i className="fab fa-cc-visa text-muted mr-2" style={{ fontSize: '24px' }}></i>
                        <i className="fab fa-cc-mastercard text-muted mr-2" style={{ fontSize: '24px' }}></i>
                        <i className="fab fa-cc-paypal text-muted" style={{ fontSize: '24px' }}></i>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;