import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PostList from '../../components/PostList';
import LatestBlog from '../../components/LatestBlog';
import BlogCategoryList from '../../components/BlogCategoryList';

const Post = () => {
    return (
        <div className="post-page bg-light min-vh-100 d-flex flex-column">
            <Header />
            
            {/* Banner nổi bật dành riêng cho Trang Cộng Đồng */}
            <div className="container-fluid p-0 mb-5 position-relative">
                <div style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '350px',
                    filter: 'brightness(0.5)'
                }}></div>
                <div className="position-absolute w-100 text-center" style={{ top: '50%', left: '0', transform: 'translateY(-50%)' }}>
                    <h1 className="display-4 font-weight-bold text-white text-uppercase mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        Cộng Đồng Đạp Xe
                    </h1>
                    <p className="lead text-white font-weight-bold mx-auto" style={{ maxWidth: '600px', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                        Nơi giao lưu, chia sẻ kinh nghiệm, hành trình và đam mê cùng những cua-rơ trên mọi nẻo đường.
                    </p>
                    <div className="mx-auto mt-4" style={{ width: '80px', height: '4px', backgroundColor: '#FF5A00', borderRadius: '2px' }}></div>
                </div>
            </div>

            <div className="container flex-grow-1 mb-5">
                <div className="row">
                    {/* Cột trái: Hiển thị danh sách bài viết dưới dạng List dọc (Dùng component PostList sẵn có) */}
                    <div className="col-lg-8 mb-4">
                        <PostList />
                    </div>

                    {/* Cột phải: Sidebar chuyên nghiệp (Dùng LatestBlog và BlogCategoryList) */}
                    <div className="col-lg-4">
                        {/* sticky-top giúp sidebar trượt mượt mà theo màn hình */}
                        <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
                            <LatestBlog />
                            <BlogCategoryList />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Post;
