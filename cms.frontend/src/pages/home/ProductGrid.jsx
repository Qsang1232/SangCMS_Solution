import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Hiển thị 8 sản phẩm mỗi trang (4 cột x 2 hàng)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-info"></div></div>;

    // Tính toán phân trang
    const totalPages = Math.ceil(products.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = products.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Cuộn lên đầu khu vực sản phẩm cho mượt
        document.querySelector('.product-grid-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section className="product-grid-wrapper py-5 bg-light">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        Sản phẩm nổi bật
                    </h4>
                    <span className="text-muted small">
                        Trang {currentPage} / {totalPages} ({products.length} sản phẩm)
                    </span>
                </div>

                <div className="row">
                    {currentProducts.map((product) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.id}>
                            <ProductCard item={product} />
                        </div>
                    ))}
                </div>

                {/* Thanh phân trang */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination mb-0" style={{ gap: '5px' }}>
                                {/* Nút Trước */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link rounded shadow-sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{ color: '#005088' }}
                                    >
                                        &laquo; Trước
                                    </button>
                                </li>

                                {/* Các nút số trang */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button
                                            className="page-link rounded shadow-sm"
                                            onClick={() => handlePageChange(page)}
                                            style={currentPage === page
                                                ? { backgroundColor: '#FF5A00', borderColor: '#FF5A00', color: '#fff' }
                                                : { color: '#005088' }
                                            }
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}

                                {/* Nút Sau */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link rounded shadow-sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        style={{ color: '#005088' }}
                                    >
                                        Sau &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;