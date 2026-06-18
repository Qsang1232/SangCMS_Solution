import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [info, setInfo] = useState({ fullName: '', phone: '', address: '', note: '' });

    useEffect(() => {
        const saved = localStorage.getItem('bikeCart');
        if (saved) setCartItems(JSON.parse(saved));
    }, []);

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        const orderPayload = {
            CustomerName: info.fullName,
            Address: info.address,
            Notes: info.note,
            OrderDetails: cartItems.map(item => ({ ProductId: item.id, Quantity: item.quantity, Price: item.price }))
        };

        try {
            await orderService.createOrder(orderPayload);
            alert("ĐẶT HÀNG THÀNH CÔNG! SangCMS Bikes sẽ liên hệ bạn sớm nhất.");
            localStorage.removeItem('bikeCart');
            navigate('/');
        } catch (error) {
            alert("Lỗi kết nối máy chủ. Vui lòng thử lại!");
        }
    };

    if (cartItems.length === 0) return <div className="text-center py-5 mt-5"><Link to="/shop" className="btn btn-info">Giỏ hàng trống. Quay lại Cửa hàng</Link></div>;

    return (
        <div className="checkout-page bg-light min-vh-100 d-flex flex-column">
            <Header />
            <div className="container py-5 flex-grow-1">
                <h3 className="font-weight-bold text-center mb-5 text-uppercase" style={{ color: '#005088' }}>Hoàn Tất Thanh Toán</h3>
                <form onSubmit={handlePlaceOrder} className="row">
                    <div className="col-lg-7 mb-4">
                        <div className="card border-0 shadow-sm p-4">
                            <h5 className="font-weight-bold border-bottom pb-3 mb-4">Thông tin người nhận</h5>
                            <input type="text" className="form-control mb-3" placeholder="Họ và tên..." required onChange={e => setInfo({ ...info, fullName: e.target.value })} />
                            <input type="tel" className="form-control mb-3" placeholder="Số điện thoại..." required onChange={e => setInfo({ ...info, phone: e.target.value })} />
                            <textarea className="form-control mb-3" rows="3" placeholder="Địa chỉ giao hàng..." required onChange={e => setInfo({ ...info, address: e.target.value })}></textarea>
                            <textarea className="form-control mb-3" rows="2" placeholder="Ghi chú thêm..." onChange={e => setInfo({ ...info, note: e.target.value })}></textarea>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm p-4 bg-white">
                            <h5 className="font-weight-bold border-bottom pb-3 mb-4">Đơn hàng của bạn</h5>
                            {cartItems.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span className="small text-muted">{item.name} <strong className="text-dark">x{item.quantity}</strong></span>
                                    <span className="font-weight-bold text-dark">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between mt-3"><span className="h5 font-weight-bold">TỔNG CỘNG</span><span className="h4 font-weight-bold text-danger">{formatPrice(totalAmount)}</span></div>
                            <button type="submit" className="btn btn-block text-white font-weight-bold py-3 mt-4 rounded-pill" style={{ backgroundColor: '#FF5A00' }}>XÁC NHẬN ĐẶT HÀNG</button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
export default Checkout;