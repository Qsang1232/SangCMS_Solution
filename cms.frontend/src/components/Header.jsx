import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    // STATE: Lưu thông tin khách hàng đang đăng nhập, từ khóa tìm kiếm và số lượng giỏ hàng
    const [customer, setCustomer] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [cartCount, setCartCount] = useState(0);

    // Dùng useEffect để lấy thông tin từ LocalStorage mỗi khi load Header
    useEffect(() => {
        // Lấy thông tin user
        const userData = localStorage.getItem('bikeCustomer');
        if (userData) {
            setCustomer(JSON.parse(userData));
        }

        // Đếm tổng số lượng xe đạp trong giỏ
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('bikeCart');
            const cart = savedCart ? JSON.parse(savedCart) : [];
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        };

        updateCartCount();

        // Lắng nghe sự kiện để cập nhật số lượng giỏ hàng khi có thay đổi
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    // Xử lý sự kiện tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim() !== '') {
            // Đẩy từ khóa sang trang Shop để component Shop nhận và gọi API lọc
            navigate(`/shop?keyword=${keyword}`);
        }
    };

    // Hàm Xử lý Đăng xuất
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            localStorage.removeItem('bikeCustomer'); // Xóa bộ nhớ
            setCustomer(null); // Xóa state
            navigate('/login'); // Đá về trang đăng nhập
        }
    };

    // Hàm kiểm tra active menu
    const isActive = (path) => {
        return location.pathname === path ? 'active font-weight-bold' : 'text-dark';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">
            {/* CSS nội bộ hỗ trợ hover mượt mà */}
            <style>
                {`
                    .nav-link.active { color: #FF5A00 !important; border-bottom: 2px solid #FF5A00; }
                    .nav-link:hover { color: #FF5A00 !important; }
                    .transition-link:hover { color: #FF5A00 !important; }
                `}
            </style>

            {/* TẦNG 1: TOP BAR */}
            <div className="top-bar py-2 text-white" style={{ backgroundColor: '#1a1a1a', fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="top-bar-left">
                        <span className="mr-4">
                            <i className="fas fa-phone-alt mr-2" style={{ color: '#FF5A00' }}></i> Hotline: 090x.xxx.xxx
                        </span>
                        <span className="d-none d-md-inline">
                            <i className="fas fa-wrench mr-2" style={{ color: '#FF5A00' }}></i> Hotline Bảo Dưỡng: 080x.xxx.xxx
                        </span>
                    </div>

                    <div className="top-bar-right d-flex align-items-center">
                        {customer ? (
                            <>
                                <span className="text-light mr-3">
                                    <i className="fas fa-user-circle mr-1" style={{ color: '#FF5A00', fontSize: '16px' }}></i>
                                    Xin chào, <strong style={{ color: '#11CAA0' }}>{customer.fullName}</strong>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-link text-light text-decoration-none p-0 transition-link"
                                    style={{ fontSize: '13px' }}
                                >
                                    <i className="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-light mr-3 text-decoration-none transition-link">
                                    <i className="fas fa-user mr-1"></i> Đăng nhập
                                </Link>
                                <Link to="/register" className="text-light text-decoration-none transition-link">
                                    <i className="fas fa-user-plus mr-1"></i> Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* TẦNG 2: LOGO & SEARCH */}
            <div className="main-header py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0 text-dark" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    SangCMS<span style={{ color: '#FF5A00' }}>.Bikes</span>
                                </h3>
                                <small className="text-muted" style={{ fontSize: '11px', letterSpacing: '2px' }}>Premium Cycling</small>
                            </Link>
                        </div>

                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0 shadow-none"
                                    placeholder="Tìm kiếm xe đạp MTB, Road, phụ kiện..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    style={{ borderRadius: '25px 0 0 25px', fontSize: '14px', borderColor: '#e0e0e0' }}
                                />
                                <div className="input-group-append">
                                    <button className="btn px-4 text-white" type="submit" style={{ borderRadius: '0 25px 25px 0', backgroundColor: '#FF5A00', borderColor: '#FF5A00' }}>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2 text-dark transition-link" style={{ fontSize: '24px' }}>
                                <i className="fas fa-shopping-cart"></i>
                                <span className="badge badge-pill position-absolute" style={{ top: '0', right: '-5px', backgroundColor: '#FF5A00', color: '#fff', fontSize: '11px', border: '2px solid #fff' }}>
                                    {cartCount}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* TẦNG 3: MENU ĐIỀU HƯỚNG */}
            <div className="main-navigation bg-white">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <ul className="navbar-nav w-100 justify-content-center pt-2 pb-2">
                            <li className="nav-item mx-3"><Link to="/" className={`nav-link pb-1 px-0 text-decoration-none text-uppercase font-weight-bold ${isActive('/')}`} style={{ fontSize: '14px', transition: 'all 0.2s' }}>Trang Chủ</Link></li>
                            <li className="nav-item mx-3"><Link to="/shop" className={`nav-link pb-1 px-0 text-decoration-none text-uppercase font-weight-bold ${isActive('/shop')}`} style={{ fontSize: '14px', transition: 'all 0.2s' }}>Cửa Hàng</Link></li>
                            <li className="nav-item mx-3"><Link to="/blog" className={`nav-link pb-1 px-0 text-decoration-none text-uppercase font-weight-bold ${isActive('/blog')}`} style={{ fontSize: '14px', transition: 'all 0.2s' }}>Tin Tức</Link></li>
                            <li className="nav-item mx-3"><Link to="/post" className={`nav-link pb-1 px-0 text-decoration-none text-uppercase font-weight-bold ${isActive('/post')}`} style={{ fontSize: '14px', transition: 'all 0.2s' }}>Cộng Đồng Đạp Xe</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;