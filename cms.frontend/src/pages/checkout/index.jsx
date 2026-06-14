import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService'; // Import API gọi Backend

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // State lưu thông tin khách hàng nhập vào form
    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: ''
    });

    // Lấy giỏ hàng từ LocalStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('bikeCart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Hàm tính tổng tiền
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Bắt sự kiện khi người dùng gõ vào các ô input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    // ====================================================
    // HÀM XỬ LÝ ĐẶT HÀNG: GỌI API GỬI XUỐNG C# SQL SERVER
    // ====================================================
    const handlePlaceOrder = async (e) => {
        e.preventDefault(); // Chặn hành vi tải lại trang của Form

        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống, không thể đặt hàng!");
            return;
        }

        // ĐÓNG GÓI DỮ LIỆU ĐỂ GỬI CHO C#
        // Các trường (customerName, address, notes, orderDetails) khớp với Backend của bạn
        const orderPayload = {
            customerName: customerInfo.fullName,
            phone: customerInfo.phone, // Truyền thêm sđt (nếu database C# có cột này)
            address: customerInfo.address,
            notes: customerInfo.note,  // Lưu ý: C# của bạn tên là 'notes'
            totalAmount: totalAmount,

            // Map mảng giỏ hàng thành mảng chi tiết đơn hàng (OrderDetails)
            orderDetails: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            // GỌI API: Đẩy dữ liệu lên Backend
            await orderService.createOrder(orderPayload);

            // NẾU THÀNH CÔNG
            alert(`Cảm ơn ${customerInfo.fullName}! Đơn hàng của bạn đã được đặt thành công.`);

            // 1. Xóa sạch giỏ hàng trong LocalStorage
            localStorage.removeItem('bikeCart');

            // 2. Chuyển hướng người dùng về Trang Chủ
            navigate('/');

        } catch (error) {
            // NẾU THẤT BẠI
            alert("Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại sau!");
            console.error("Chi tiết lỗi API Đặt hàng:", error);
        }
    };

    // Nếu không có hàng thì không cho thanh toán, bắt quay lại Shop
    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center mt-5 min-vh-100">
                <h4 className="text-danger mb-3">Bạn chưa có sản phẩm nào để thanh toán!</h4>
                <Link to="/shop" className="btn btn-info rounded-pill px-4">Quay lại cửa hàng</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page-wrapper py-5 bg-light min-vh-100">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>
                        Hoàn Tất Đơn Hàng
                    </h2>
                    <p className="text-muted">Vui lòng điền thông tin giao hàng bên dưới</p>
                </div>

                <form onSubmit={handlePlaceOrder}>
                    <div className="row">
                        {/* CỘT TRÁI: FORM THÔNG TIN */}
                        <div className="col-lg-7 mb-4">
                            <div className="card border-0 shadow-sm rounded p-4">
                                <h5 className="font-weight-bold mb-4 border-bottom pb-3">Thông Tin Giao Hàng</h5>

                                <div className="form-group mb-3">
                                    <label className="font-weight-bold">Họ và tên <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        placeholder="Nhập họ tên người nhận"
                                        value={customerInfo.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="font-weight-bold">Số điện thoại <span className="text-danger">*</span></label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        placeholder="Nhập số điện thoại liên hệ"
                                        value={customerInfo.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="font-weight-bold">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        rows="3"
                                        placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                                        value={customerInfo.address}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="font-weight-bold">Ghi chú thêm</label>
                                    <textarea
                                        className="form-control"
                                        name="note"
                                        rows="2"
                                        placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi giao..."
                                        value={customerInfo.note}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                        <div className="col-lg-5">
                            <div className="card border-0 shadow-sm rounded p-4" style={{ backgroundColor: '#f8fbff' }}>
                                <h5 className="font-weight-bold mb-4 border-bottom pb-3">Tóm Tắt Đơn Hàng</h5>

                                <div className="order-items-list mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {cartItems.map(item => (
                                        <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h6 className="mb-0 font-weight-bold text-dark">{item.name}</h6>
                                                <small className="text-muted">SL: {item.quantity}</small>
                                            </div>
                                            <span className="font-weight-bold text-info">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tạm tính:</span>
                                    <span className="font-weight-bold">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="text-success font-weight-bold">Miễn phí</span>
                                </div>

                                <div className="d-flex justify-content-between mb-4 border-top pt-3">
                                    <span className="font-weight-bold h5 mb-0">TỔNG CỘNG:</span>
                                    <span className="font-weight-bold text-danger h4 mb-0">{formatPrice(totalAmount)}</span>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-lg w-100 text-white font-weight-bold rounded-pill shadow-sm"
                                    style={{ backgroundColor: '#11CAA0' }}
                                >
                                    <i className="fas fa-check-circle mr-2"></i> XÁC NHẬN ĐẶT HÀNG
                                </button>

                                <div className="text-center mt-3">
                                    <Link to="/cart" className="text-muted"><small><i>Quay lại chỉnh sửa giỏ hàng</i></small></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;