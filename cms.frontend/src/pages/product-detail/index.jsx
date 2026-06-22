import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductInfo from './ProductInfo'; // IMPORT FILE CON VÀO

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL;

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data.data || data);
            } catch (error) {
                console.error("Lỗi tải chi tiết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleAddToCart = () => {
        if (quantity > product.stockQuantity) {
            alert(`⛔ Lỗi hệ thống kho: Cửa hàng chỉ còn tối đa ${product.stockQuantity} chiếc!`);
            return;
        }

        const savedCart = localStorage.getItem('bikeCart');
        let cart = savedCart ? JSON.parse(savedCart) : [];
        const existingItem = cart.findIndex(item => item.id === product.id);

        if (existingItem !== -1) {
            cart[existingItem].quantity += quantity;
        } else {
            cart.push({
                id: product.id, name: product.name, price: product.price,
                imageUrl: product.imageUrl, quantity: quantity
            });
        }
        localStorage.setItem('bikeCart', JSON.stringify(cart));
        alert(`🎉 THÀNH CÔNG: Đã thêm ${quantity} xe [${product.name}] vào giỏ hàng!`);
    };

    if (loading) return <div className="text-center py-5 min-vh-100 mt-5"><div className="spinner-border text-info"></div></div>;
    if (!product) return <div className="text-center py-5 min-vh-100 mt-5 text-danger font-weight-bold">Không tìm thấy sản phẩm trên hệ thống!</div>;

    return (
        <div className="product-detail-page bg-light min-vh-100 d-flex flex-column">
            <Header />

            <div className="container py-5 flex-grow-1">
                {/* Breadcrumb dẫn hướng */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent p-0 mb-4 small font-weight-bold">
                        <li className="breadcrumb-item"><Link to="/" style={{ color: '#005088' }}>Trang Chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/shop" style={{ color: '#005088' }}>Cửa Hàng</Link></li>
                        <li className="breadcrumb-item active text-muted" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                <div className="row bg-white p-4 p-md-5 rounded shadow-sm border-top" style={{ borderColor: '#FF5A00', borderWidth: '4px !important' }}>
                    {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
                    <div className="col-md-6 mb-4 mb-md-0">
                        <div className="border rounded d-flex align-items-center justify-content-center p-3" style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
                            <img
                                src={IMAGE_BASE_URL + product.imageUrl}
                                alt={product.name}
                                className="img-fluid h-100"
                                style={{ objectFit: 'contain', transition: '0.5s' }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </div>
                    </div>

                    {/* CỘT PHẢI: GỌI FILE CON PRODUCT-INFO RA HIỂN THỊ */}
                    <div className="col-md-6">
                        <ProductInfo
                            product={product}
                            formatPrice={formatPrice}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            handleAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ProductDetail;