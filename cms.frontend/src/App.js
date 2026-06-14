import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT CÁC COMPONENT TOÀN CỤC (LAYOUT CHUNG)
import Header from './components/Header';
import Footer from './components/Footer';

// 2. IMPORT CÁC TRANG CHỨC NĂNG
import Home from './pages/home/index';
import Shop from './pages/shop/index';
import ProductDetail from './pages/product-detail';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog/BlogDetail';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100 bg-light">

                {/* 1. HEADER LUÔN NẰM Ở TRÊN CÙNG CỦA MỌI TRANG */}
                <Header />

                {/* 2. RUỘT BÊN TRONG THAY ĐỔI TÙY THEO ĐƯỜNG DẪN */}
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="*" element={
                            <div className="container text-center py-5 my-5">
                                <h2>404 - KHÔNG TÌM THẤY TRANG</h2>
                                <a href="/" className="btn btn-dark mt-2">Quay lại Trang Chủ</a>
                            </div>
                        } />
                    </Routes>
                </main>

                {/* 3. FOOTER LUÔN NẰM Ở DƯỚI CÙNG */}
                <Footer />

            </div>
        </Router>
    );
}

export default App;