import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CartTable from './CartTable'; // IMPORT BẢNG VÀO ĐÂY

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra đăng nhập
        const customer = localStorage.getItem('bikeCustomer');
        if (!customer) {
            alert('Bạn cần đăng nhập để xem giỏ hàng!');
            navigate('/login');
            return;
        }

        const savedCart = localStorage.getItem('bikeCart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, [navigate]);

    const updateCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('bikeCart', JSON.stringify(newCart));
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Các hàm truyền xuống cho file con CartTable xử lý
    const handleIncrease = (id) => updateCart(cartItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    const handleDecrease = (id) => updateCart(cartItems.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
    const handleRemove = (id) => { if (window.confirm("Bỏ sản phẩm này khỏi giỏ?")) updateCart(cartItems.filter(item => item.id !== id)); };

    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="cart-page bg-light min-vh-100 d-flex flex-column">
            <Header />
            <div className="container py-5 flex-grow-1">
                <h3 className="font-weight-bold text-uppercase mb-4" style={{ color: '#005088' }}>
                    <i className="fas fa-shopping-cart mr-2"></i> Giỏ Hàng Của Bạn
                </h3>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded shadow-sm border-0">
                        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty" style={{ width: '120px', opacity: 0.5 }} className="mb-4" />
                        <h4 className="font-weight-bold text-secondary">Giỏ hàng đang trống!</h4>
                        <p className="text-muted">Chưa có chiếc xe đạp nào được chọn. Hãy khám phá ngay nhé!</p>
                        <Link to="/shop" className="btn btn-outline-info mt-2 rounded-pill px-5 font-weight-bold">TIẾP TỤC MUA SẮM</Link>
                    </div>
                ) : (
                    <div className="row">
                        {/* CỘT TRÁI: GỌI FILE CON CART-TABLE RA HIỂN THỊ */}
                        <div className="col-lg-8 mb-4">
                            <CartTable
                                cartItems={cartItems}
                                formatPrice={formatPrice}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={handleRemove}
                            />
                        </div>

                        {/* CỘT PHẢI: HÓA ĐƠN */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#f8fbff', borderRadius: '12px' }}>
                                <h5 className="font-weight-bold border-bottom pb-3 mb-4 text-uppercase" style={{ color: '#005088' }}>Tổng Hóa Đơn</h5>
                                <div className="d-flex justify-content-between mb-3"><span className="text-muted">Tạm tính:</span><span className="font-weight-bold text-dark">{formatPrice(totalAmount)}</span></div>
                                <div className="d-flex justify-content-between mb-3"><span className="text-muted">Vận chuyển:</span><span className="text-success font-weight-bold">Miễn phí</span></div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4 mt-2">
                                    <span className="font-weight-bold h5 mb-0">TỔNG CỘNG:</span>
                                    <span className="text-danger font-weight-bold h4 mb-0">{formatPrice(totalAmount)}</span>
                                </div>
                                <Link to="/checkout" className="btn btn-block text-white font-weight-bold py-3 text-uppercase" style={{ backgroundColor: '#FF5A00', borderRadius: '8px', letterSpacing: '1px' }}>
                                    Tiến Hành Thanh Toán
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Cart;