import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';

const IMAGE_BASE_URL = "https://localhost:7111";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // Mặc định khách mua 1 chiếc

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi tải chi tiết xe đạp/phụ kiện:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [id]);

    // Hàm format tiền tệ
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Nút Tăng/Giảm số lượng mua
    const handleDecrease = () => { if (quantity > 1) setQuantity(quantity - 1); };
    const handleIncrease = () => {
        // Thuật toán chặn không cho mua lố số lượng tồn kho
        if (quantity < product.stockQuantity) {
            setQuantity(quantity + 1);
        } else {
            alert(`Rất tiếc, cửa hàng chỉ còn ${product.stockQuantity} sản phẩm này!`);
        }
    };

    // ----------------------------------------------------
    // ĐÃ CẬP NHẬT: HÀM THÊM VÀO GIỎ HÀNG BẰNG LOCALSTORAGE
    // ----------------------------------------------------
    const handleAddToCart = () => {
        if (product.stockQuantity === 0) {
            alert("Sản phẩm này đã hết hàng!");
            return;
        }

        // Bước 1: Lấy giỏ hàng hiện tại từ LocalStorage
        const savedCart = localStorage.getItem('bikeCart');
        let cart = savedCart ? JSON.parse(savedCart) : [];

        // Bước 2: Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            // Nếu đã có: Chỉ cộng dồn thêm số lượng
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Nếu chưa có: Tạo mới đối tượng sản phẩm và đưa vào mảng
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity
            };
            cart.push(newItem);
        }

        // Bước 3: Lưu ngược mảng giỏ hàng mới vào lại LocalStorage
        localStorage.setItem('bikeCart', JSON.stringify(cart));

        alert(`Đã thêm thành công ${quantity} x [${product.name}] vào giỏ hàng!`);
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-info"></div></div>;
    if (!product) return <div className="container py-5 text-center"><h4>Không tìm thấy sản phẩm!</h4></div>;

    return (
        <div className="product-detail-wrapper py-5 bg-white min-vh-100">
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent p-0 mb-4">
                        <li className="breadcrumb-item"><Link to="/" className="text-info">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/shop" className="text-info">Cửa hàng</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                <div className="row">
                    {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
                    <div className="col-md-6 mb-4">
                        <div className="border rounded p-3 text-center bg-light" style={{ height: '500px' }}>
                            <img
                                src={IMAGE_BASE_URL + product.imageUrl}
                                alt={product.name}
                                className="img-fluid h-100"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    {/* CỘT PHẢI: THÔNG TIN VÀ NÚT MUA */}
                    <div className="col-md-6 pl-md-5">
                        <h2 className="font-weight-bold mb-3" style={{ color: '#005088' }}>{product.name}</h2>

                        {/* Trạng thái tồn kho */}
                        <div className="mb-3">
                            {product.stockQuantity > 0 ? (
                                <span className="badge badge-success px-3 py-2" style={{ fontSize: '14px' }}>
                                    <i className="fas fa-check-circle mr-1"></i> Còn hàng ({product.stockQuantity} chiếc)
                                </span>
                            ) : (
                                <span className="badge badge-danger px-3 py-2" style={{ fontSize: '14px' }}>
                                    <i className="fas fa-times-circle mr-1"></i> Hết hàng
                                </span>
                            )}
                        </div>

                        <h3 className="font-weight-bold text-danger mb-4 pb-3 border-bottom">
                            {formatPrice(product.price)}
                        </h3>

                        {/* Hiển thị mô tả sản phẩm (RAW HTML) */}
                        <div
                            className="product-description text-muted mb-4"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

                        {/* Khu vực chọn số lượng và Đặt hàng */}
                        <div className="d-flex align-items-center mb-4">
                            <span className="mr-3 font-weight-bold">Số lượng:</span>
                            <div className="input-group" style={{ width: '130px' }}>
                                <div className="input-group-prepend">
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleDecrease}>-</button>
                                </div>
                                <input type="text" className="form-control text-center font-weight-bold" value={quantity} readOnly />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleIncrease}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-4">
                            <button
                                className="btn btn-lg text-white font-weight-bold w-100 mr-2"
                                style={{ backgroundColor: '#11CAA0', borderRadius: '8px' }}
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity === 0}
                            >
                                <i className="fas fa-cart-plus mr-2"></i> THÊM VÀO GIỎ HÀNG
                            </button>
                            <button
                                className="btn btn-lg btn-outline-info font-weight-bold w-100"
                                style={{ borderRadius: '8px' }}
                            >
                                MUA NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetail;