import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Shop() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State 3: Khối quản lý tập trung toàn bộ tiêu chí lọc từ database
    const [filters, setFilters] = useState({
        categoryProductId: null,
        minPrice: '',
        maxPrice: '',
        keyword: ''
    });

    // Gọi API mỗi khi có bất kỳ ô lọc nào thay đổi
    useEffect(() => {
        const fetchFilterProducts = async () => {
            try {
                setIsLoading(true);
                // Truyền mảng filters xuống API C#
                const response = await productService.getAllProducts(filters);
                setProducts(response.data || response);
            } catch (error) {
                console.error("Lỗi gọi API lọc sản phẩm:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFilterProducts();
    }, [filters]);

    // Hàm CallBack truyền xuống cho các file con
    const handleFilterUpdate = (newFields) => {
        setFilters(prev => ({ ...prev, ...newFields }));
    };

    return (
        <div className="shop-page-wrapper bg-light min-vh-100 d-flex flex-column">
            <Header />

            <div className="container py-4 flex-grow-1">
                {/* Banner nhỏ của trang Shop */}
                <div className="bg-white rounded shadow-sm p-4 mb-4 text-center border-bottom" style={{ borderColor: '#F96D00' }}>
                    <h2 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        Cửa Hàng BikeLife
                    </h2>
                    <p className="text-muted mt-2 mb-0">Khám phá các dòng xe đạp thể thao và phụ kiện chính hãng</p>
                </div>

                <div className="row">
                    {/* CỘT TRÁI (3/12): Khu vực chứa bộ lọc dọc */}
                    <aside className="col-md-3 mb-4">
                        <ShopSidebar
                            activeCategory={filters.categoryProductId}
                            minPrice={filters.minPrice}
                            maxPrice={filters.maxPrice}
                            onFilterChange={handleFilterUpdate}
                        />
                    </aside>

                    {/* CỘT PHẢI (9/12): Khu vực chứa thanh Search và Lưới hàng hóa */}
                    <main className="col-md-9">
                        <ShopHeader
                            total={products.length}
                            keyword={filters.keyword}
                            onSearchChange={handleFilterUpdate}
                        />

                        {/* Kiểm soát UX qua LoadingOrEmpty trước khi render danh sách */}
                        <LoadingOrEmpty isLoading={isLoading} totalItems={products.length}>
                            <ProductList products={products} />
                        </LoadingOrEmpty>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Shop;