import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import PostCard from '../../components/PostCard';

function LatestBlog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                const data = await postService.getAllPosts();
                // Lấy 3 bài viết mới nhất
                setPosts(data.slice(0, 3));
            } catch (error) {
                console.error("Lỗi tải tin tức:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestPosts();
    }, []);

    if (loading) return null;

    return (
        <section className="latest-blog-section py-5 bg-white">
            <div className="container">
                <div className="text-center mb-5">
                    <h3 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>Cộng Đồng Đạp Xe</h3>
                    <p className="text-muted">Kinh nghiệm bảo dưỡng, review xe và các cung đường phượt hấp dẫn</p>
                    <div className="mx-auto" style={{ width: '60px', height: '3px', backgroundColor: '#FF5A00' }}></div>
                </div>

                <div className="row">
                    {posts.map((item) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                            <PostCard post={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LatestBlog;