import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = "https://localhost:7111"; // Đảm bảo link này khớp với Backend của bạn

function ProductCard({ item }) {
    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Hàm thêm nhanh 1 sản phẩm vào giỏ hàng
    const handleQuickAddToCart = () => {
        // 1. Lấy giỏ hàng cũ từ bộ nhớ
        const savedCart = localStorage.getItem('bikeCart');
        let cart = savedCart ? JSON.parse(savedCart) : [];

        // 2. Kiểm tra xem sản phẩm này đã có trong giỏ chưa
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // Nếu có rồi thì tăng số lượng lên 1
            cart[existingItemIndex].quantity += 1;
        } else {
            // Nếu chưa có thì thêm mới vào mảng với số lượng là 1
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1
            });
        }

        // 3. Lưu ngược lại vào bộ nhớ
        localStorage.setItem('bikeCart', JSON.stringify(cart));

        alert(`Đã thêm thành công [${item.name}] vào giỏ hàng!`);
    };

    return (
        <div className="card h-100 shadow-sm border-0 rounded">
            {/* Ảnh sản phẩm */}
            <div className="text-center p-3" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                <img
                    src={IMAGE_BASE_URL + item.imageUrl}
                    alt={item.name}
                    className="img-fluid h-100"
                    style={{ objectFit: 'contain' }}
                />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="card-body d-flex flex-column">
                <h6 className="font-weight-bold text-dark text-truncate" title={item.name}>
                    {item.name}
                </h6>
                <h6 className="font-weight-bold text-danger mb-3">
                    {formatPrice(item.price)}
                </h6>

                {/* 2 Nút bấm */}
                <div className="mt-auto d-flex justify-content-between gap-2">
                    <Link
                        to={`/product/${item.id}`}
                        className="btn btn-outline-info btn-sm flex-fill font-weight-bold rounded-pill mr-2"
                    >
                        <i className="fas fa-eye"></i> Chi tiết
                    </Link>
                    <button
                        className="btn btn-sm flex-fill text-white font-weight-bold rounded-pill"
                        style={{ backgroundColor: '#11CAA0' }}
                        onClick={handleQuickAddToCart}
                    >
                        <i className="fas fa-cart-plus"></i> Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;