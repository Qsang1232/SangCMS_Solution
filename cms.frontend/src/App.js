import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// IMPORT CÁC TRANG CHỨC NĂNG
import Home from './pages/home/index';
import Shop from './pages/shop/index';
import ProductDetail from './pages/product-detail/index';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog/BlogDetail';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';

// ---------------------------------------------
// BỔ SUNG THÊM 2 DÒNG IMPORT TRANG TÀI KHOẢN NÀY
// ---------------------------------------------
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100 bg-light">
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />

                        {/* --------------------------------------------- */}
                        {/* BỔ SUNG THÊM 2 ĐỊA CHỈ ROUTE NÀY */}
                        {/* --------------------------------------------- */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="*" element={
                            <div className="container text-center py-5 my-5">
                                <h2>404 - KHÔNG TÌM THẤY TRANG</h2>
                                <a href="/" className="btn btn-dark mt-2">Quay lại Trang Chủ</a>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;