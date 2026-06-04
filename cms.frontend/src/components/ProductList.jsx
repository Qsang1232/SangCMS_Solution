import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Đang tải danh sách sản phẩm thời trang...</div>;
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12">
                    <p className="text-muted alert alert-warning text-center">
                        Chưa có sản phẩm nào trong hệ thống. Hãy thêm dữ liệu vào bảng Posts nhé!
                    </p>
                </div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg">
                            {/* Hiển thị ảnh sản phẩm từ imageUrl của API */}
                            <img
                                src={item.imageUrl || "https://picsum.photos/200"}
                                className="card-img-top"
                                alt={item.title}
                                style={{ height: '200px', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
                            />
                            <div className="card-body">
                                {/* Sửa item.name thành item.title để khớp với dữ liệu bảng Posts */}
                                <h5 className="card-title font-weight-bold text-dark mb-2">{item.title}</h5>

                                <p className="card-text text-danger font-weight-bold">
                                    Giá bán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 350000)}
                                </p>
                                <p className="card-text small text-muted">
                                    Mô tả: {item.content || "Sản phẩm thời trang cao cấp thương hiệu SangCMS."}
                                </p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0 pt-0">
                                <button className="btn btn-outline-primary btn-block btn-sm">
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;