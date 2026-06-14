import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import ProductCard from '../../components/ProductCard'; // Tái sử dụng thẻ sản phẩm

function Shop() {
    // State lưu trữ dữ liệu
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // State quản lý bộ lọc và loading
    const [loading, setLoading] = useState(true);
    const [activeCategoryId, setActiveCategoryId] = useState(null); // null = Hiện tất cả

    // Lấy dữ liệu ngay khi vào trang Shop
    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);
                // Gọi API lấy song song cả Danh mục và Sản phẩm để tiết kiệm thời gian
                const [categoryData, productData] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts()
                ]);

                setCategories(categoryData);
                setProducts(productData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu cửa hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShopData();
    }, []);

    // THUẬT TOÁN LỌC SẢN PHẨM: 
    // Nếu activeCategoryId là null -> Hiển thị hết. 
    // Nếu có ID -> Lọc những xe đạp/phụ kiện có categoryId khớp với ID khách bấm
    const displayProducts = activeCategoryId === null
        ? products
        : products.filter(item => item.categoryProductId === activeCategoryId || item.categoryId === activeCategoryId);
    // Lưu ý: Tùy Backend của bạn đặt tên biến là categoryProductId hay categoryId, thuật toán trên sẽ bao cả 2 trường hợp.

    if (loading) {
        return (
            <div className="container py-5 text-center min-vh-100 d-flex flex-column justify-content-center">
                <div className="spinner-border text-info mx-auto mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <h5 className="text-muted">Đang tải kệ hàng BikeLife...</h5>
            </div>
        );
    }

    return (
        <div className="shop-page-wrapper py-5 bg-light min-vh-100">
            <div className="container">

                {/* Banner nhỏ của trang Shop */}
                <div className="bg-white rounded shadow-sm p-4 mb-4 text-center border-bottom" style={{ borderColor: '#11CAA0' }}>
                    <h2 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        Cửa Hàng BikeLife
                    </h2>
                    <p className="text-muted mt-2 mb-0">Khám phá các dòng xe đạp thể thao và phụ kiện chính hãng</p>
                </div>

                <div className="row">
                    {/* CỘT TRÁI: BỘ LỌC DANH MỤC (SIDEBAR) */}
                    <div className="col-lg-3 mb-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: '80px', zIndex: 10 }}>
                            <div className="card-header bg-white font-weight-bold text-uppercase border-bottom-0 pt-4 pb-2" style={{ color: '#005088' }}>
                                <i className="fas fa-list mr-2"></i> Danh Mục
                            </div>
                            <ul className="list-group list-group-flush pb-3 px-2">
                                {/* Nút xem tất cả */}
                                <button
                                    className={`list-group-item list-group-item-action border-0 rounded mb-1 ${activeCategoryId === null ? 'active font-weight-bold' : ''}`}
                                    style={{ backgroundColor: activeCategoryId === null ? '#11CAA0' : 'transparent', color: activeCategoryId === null ? '#fff' : '#495057' }}
                                    onClick={() => setActiveCategoryId(null)}
                                >
                                    Tất cả sản phẩm
                                </button>

                                {/* Lặp các danh mục từ API */}
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`list-group-item list-group-item-action border-0 rounded mb-1 ${activeCategoryId === cat.id ? 'active font-weight-bold' : ''}`}
                                        style={{ backgroundColor: activeCategoryId === cat.id ? '#11CAA0' : 'transparent', color: activeCategoryId === cat.id ? '#fff' : '#495057' }}
                                        onClick={() => setActiveCategoryId(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* CỘT PHẢI: LƯỚI SẢN PHẨM */}
                    <div className="col-lg-9">
                        {/* Thanh công cụ nhỏ báo số lượng */}
                        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm mb-4">
                            <span className="text-muted">
                                Hiển thị <strong>{displayProducts.length}</strong> sản phẩm
                            </span>
                            <select className="form-control form-control-sm w-auto border-info">
                                <option>Sắp xếp: Mới nhất</option>
                                <option>Giá: Thấp đến Cao</option>
                                <option>Giá: Cao xuống Thấp</option>
                            </select>
                        </div>

                        {/* Đổ dữ liệu sản phẩm ra Lưới */}
                        <div className="row">
                            {displayProducts.length > 0 ? (
                                displayProducts.map((product) => (
                                    <div className="col-md-4 col-sm-6 mb-4" key={product.id}>
                                        {/* GỌI LẠI COMPONENT THẺ SẢN PHẨM */}
                                        <ProductCard item={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5 bg-white rounded shadow-sm">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="Empty" style={{ width: '100px', opacity: 0.5 }} className="mb-3" />
                                    <h5 className="text-muted">Chưa có sản phẩm nào trong danh mục này.</h5>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Shop;