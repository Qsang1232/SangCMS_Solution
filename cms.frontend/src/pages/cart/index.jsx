import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = "https://localhost:7111"; // Link ảnh Backend

function Cart() {
    // State lưu mảng sản phẩm trong giỏ hàng
    const [cartItems, setCartItems] = useState([]);

    // 1. Lấy dữ liệu từ localStorage ngay khi mở trang Giỏ Hàng
    useEffect(() => {
        const savedCart = localStorage.getItem('bikeCart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart)); // Chuyển chuỗi JSON thành mảng
        }
    }, []);

    // Hàm lưu lại giỏ hàng (Cập nhật cả State và LocalStorage cùng lúc)
    const updateCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('bikeCart', JSON.stringify(newCart));
    };

    // Hàm định dạng tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Hàm Tăng/Giảm số lượng
    const handleIncrease = (id) => {
        const newCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(newCart);
    };

    const handleDecrease = (id) => {
        const newCart = cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCart(newCart);
    };

    // Hàm Xóa 1 món đồ
    const handleRemove = (id) => {
        if (window.confirm("Bạn có chắc muốn bỏ sản phẩm này khỏi giỏ hàng?")) {
            const newCart = cartItems.filter(item => item.id !== id);
            updateCart(newCart);
        }
    };

    // Tính tổng tiền toàn bộ giỏ hàng
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // KỊCH BẢN 1: GIỎ HÀNG TRỐNG
    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center min-vh-100 mt-5">
                <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" style={{ width: '150px', opacity: 0.5 }} className="mb-4" />
                <h3 className="font-weight-bold text-secondary">Giỏ hàng của bạn đang trống</h3>
                <p className="text-muted mb-4">Hãy quay lại cửa hàng và chọn cho mình chiếc xe đạp ưng ý nhé!</p>
                <Link to="/shop" className="btn btn-info px-5 py-2 rounded-pill font-weight-bold">
                    <i className="fas fa-arrow-left mr-2"></i> Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    // KỊCH BẢN 2: CÓ HÀNG TRONG GIỎ
    return (
        <div className="cart-page-wrapper py-5 bg-light min-vh-100">
            <div className="container">
                <h2 className="font-weight-bold mb-4 text-uppercase" style={{ color: '#005088' }}>
                    <i className="fas fa-shopping-cart mr-2"></i> Giỏ Hàng Của Bạn
                </h2>

                <div className="row">
                    {/* Cột Trái: Bảng danh sách sản phẩm */}
                    <div className="col-lg-8 mb-4">
                        <div className="card border-0 shadow-sm rounded">
                            <div className="card-body p-0 table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 pl-4">Sản phẩm</th>
                                            <th className="border-0 text-center">Đơn giá</th>
                                            <th className="border-0 text-center">Số lượng</th>
                                            <th className="border-0 text-right">Thành tiền</th>
                                            <th className="border-0"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="pl-4 py-3 align-middle">
                                                    <div className="d-flex align-items-center">
                                                        <img src={IMAGE_BASE_URL + item.imageUrl} alt={item.name} className="rounded border" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                                        <div className="ml-3">
                                                            <h6 className="mb-0 font-weight-bold text-dark">{item.name}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center align-middle font-weight-bold text-secondary">
                                                    {formatPrice(item.price)}
                                                </td>
                                                <td className="text-center align-middle">
                                                    <div className="btn-group border rounded bg-white" role="group">
                                                        <button type="button" className="btn btn-sm btn-light" onClick={() => handleDecrease(item.id)}>-</button>
                                                        <button type="button" className="btn btn-sm btn-white font-weight-bold px-3" disabled>{item.quantity}</button>
                                                        <button type="button" className="btn btn-sm btn-light" onClick={() => handleIncrease(item.id)}>+</button>
                                                    </div>
                                                </td>
                                                <td className="text-right align-middle font-weight-bold text-danger">
                                                    {formatPrice(item.price * item.quantity)}
                                                </td>
                                                <td className="text-center align-middle">
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.id)} title="Xóa">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Cột Phải: Hóa đơn tạm tính */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded">
                            <div className="card-body p-4">
                                <h5 className="font-weight-bold mb-4 border-bottom pb-2">Hóa Đơn Tạm Tính</h5>

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Tổng phụ:</span>
                                    <span className="font-weight-bold">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Phí giao hàng:</span>
                                    <span className="text-success font-weight-bold">Miễn phí</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="font-weight-bold text-dark h5 mb-0">TỔNG CỘNG:</span>
                                    <span className="font-weight-bold text-danger h4 mb-0">{formatPrice(totalAmount)}</span>
                                </div>

                                <Link to="/checkout" className="btn btn-info btn-block btn-lg font-weight-bold rounded-pill" style={{ backgroundColor: '#11CAA0', borderColor: '#11CAA0' }}>
                                    TIẾN HÀNH THANH TOÁN
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;