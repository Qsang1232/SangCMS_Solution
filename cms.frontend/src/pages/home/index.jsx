import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import postService from '../../services/postService';

// Tái sử dụng lại 2 component tấm thẻ đã làm
import ProductCard from '../../components/ProductCard';
import PostCard from '../../components/PostCard';

function Home() {
    // 1. Khai báo State lưu trữ dữ liệu
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Tab Danh mục đang được chọn (null = Tất cả)
    const [activeCategory, setActiveCategory] = useState(null);

    // 2. Gọi API lấy dữ liệu khi trang vừa load
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                // Gọi 3 API cùng lúc để tối ưu tốc độ load trang
                const [catData, prodData, postData] = await Promise.all([
                    categoryProductService.getAllCategoryProducts(),
                    productService.getAllProducts(),
                    postService.getAllPosts()
                ]);

                setCategories(catData);
                setProducts(prodData);
                // Tin tức trang chủ thường chỉ lấy 3 bài mới nhất
                setPosts(postData.slice(0, 3));
            } catch (error) {
                console.error("Lỗi tải dữ liệu trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    // 3. Xử lý logic lọc sản phẩm theo Tab Danh mục
    // Giới hạn hiển thị 8 sản phẩm trên trang chủ cho đẹp (2 hàng, mỗi hàng 4 cái)
    const displayProducts = activeCategory === null
        ? products.slice(0, 8)
        : products.filter(item => item.categoryId === activeCategory || item.categoryProductId === activeCategory).slice(0, 8);

    // Màn hình Loading
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            </div>
        );
    }

    return (
        <div className="home-page-wrapper bg-light">

            {/* =======================================
                PHẦN 1: BANNER HERO (Thay cho ô nét đứt)
            ======================================== */}
            <section className="hero-banner position-relative">
                <div
                    className="bg-dark text-white d-flex align-items-center justify-content-center text-center"
                    style={{
                        height: '450px',
                        backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="container px-4">
                        <h1 className="display-4 font-weight-bold mb-3">ĐAM MÊ BẤT TẬN CÙNG BIKELIFE</h1>
                        <p className="lead mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                            Khám phá các dòng xe đạp thể thao địa hình, xe đạp đua và phụ kiện chính hãng với mức giá tốt nhất thị trường.
                        </p>
                        <Link to="/shop" className="btn btn-lg font-weight-bold text-white px-5 rounded-pill shadow" style={{ backgroundColor: '#11CAA0' }}>
                            MUA SẮM NGAY
                        </Link>
                    </div>
                </div>
            </section>

            {/* =======================================
                PHẦN 2: SẢN PHẨM NỔI BẬT (Như trong ảnh)
            ======================================== */}
            <section className="featured-products py-5">
                <div className="container">

                    {/* Hàng nút Tabs Danh Mục giống hệt giao diện Fashion */}
                    <div className="d-flex flex-wrap justify-content-center mb-4 gap-2 border-bottom pb-3">
                        <button
                            className={`btn px-4 py-2 font-weight-bold rounded-0 mx-1 mb-2 ${activeCategory === null ? 'btn-dark text-white' : 'btn-white text-muted border-0'}`}
                            style={{
                                backgroundColor: activeCategory === null ? '#005088' : 'transparent',
                                borderBottom: activeCategory === null ? '3px solid #11CAA0' : 'none'
                            }}
                            onClick={() => setActiveCategory(null)}
                        >
                            TẤT CẢ SẢN PHẨM
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`btn px-4 py-2 font-weight-bold rounded-0 mx-1 mb-2 ${activeCategory === cat.id ? 'btn-dark text-white' : 'btn-white text-muted border-0'}`}
                                style={{
                                    backgroundColor: activeCategory === cat.id ? '#005088' : 'transparent',
                                    borderBottom: activeCategory === cat.id ? '3px solid #11CAA0' : 'none',
                                    textTransform: 'uppercase'
                                }}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Lưới Sản Phẩm (4 cột trên Desktop giống ảnh) */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                            SẢN PHẨM NỔI BẬT
                        </h4>
                        <span className="text-muted small">Hiển thị {displayProducts.length} sản phẩm</span>
                    </div>

                    <div className="row">
                        {displayProducts.length > 0 ? (
                            displayProducts.map((product) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.id}>
                                    <ProductCard item={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h5 className="text-muted">Đang cập nhật sản phẩm cho danh mục này...</h5>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-3">
                        <Link to="/shop" className="btn btn-outline-info rounded-pill px-5 font-weight-bold">
                            XEM TẤT CẢ TẠI CỬA HÀNG <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* =======================================
                PHẦN 3: XU HƯỚNG & TIN TỨC (Giống ảnh cuối)
            ======================================== */}
            <section className="latest-news py-5 bg-white">
                <div className="container">
                    <div className="text-center mb-5">
                        <h3 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>
                            CẨM NANG ĐẠP XE
                        </h3>
                        <p className="text-muted">Cập nhật xu hướng, mẹo bảo dưỡng và các cung đường phượt mới nhất</p>
                        <div className="mx-auto mt-2" style={{ width: '60px', height: '3px', backgroundColor: '#11CAA0' }}></div>
                    </div>

                    <div className="row justify-content-center">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div className="col-lg-4 col-md-6 mb-4" key={post.id}>
                                    <PostCard post={post} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center text-muted">
                                Đang cập nhật tin tức...
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Home;