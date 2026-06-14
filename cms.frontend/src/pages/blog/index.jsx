import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import PostCard from '../../components/PostCard'; // Tái sử dụng component thẻ bài viết

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
                // Gọi API lấy TẤT CẢ bài viết
                const data = await postService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách tin tức xe đạp:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center min-vh-100">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang tải cẩm nang đạp xe...</p>
            </div>
        );
    }

    return (
        <div className="blog-page-wrapper py-5 bg-light min-vh-100">
            <div className="container">
                {/* Tiêu đề trang */}
                <div className="text-center mb-5">
                    <h2 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>
                        Cẩm Nang BikeLife
                    </h2>
                    <p className="text-muted">Kinh nghiệm bảo dưỡng, review xe đạp và các cung đường phượt hấp dẫn</p>
                    <div className="mx-auto" style={{ width: '80px', height: '3px', backgroundColor: '#11CAA0' }}></div>
                </div>

                {/* Lưới hiển thị toàn bộ bài viết */}
                <div className="row">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={post.id}>
                                <PostCard post={post} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">Chưa có bài viết nào được đăng.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blog;