import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                // Chỉ lấy 8 sản phẩm mới nhất hiển thị trang chủ cho đẹp
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error("Lỗi hệ thống khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-info"></div></div>;

    return (
        <section className="product-grid-wrapper py-5 bg-light">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        Sản phẩm nổi bật
                    </h4>
                </div>

                <div className="row">
                    {products.map((product) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.id}>
                            <ProductCard item={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductGrid;