import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Quá trình kết nối API bài viết thất bại:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []); // Mảng rỗng đảm bảo không bị render lặp vô hạn

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang kết nối Database lấy tin tức thời trang...</p>
            </div>
        );
    }

    return (
        <div className="card shadow-sm p-4 bg-white rounded border-0">
            <h4 className="card-title text-uppercase font-weight-bold text-dark border-bottom pb-3 mb-4">
                <i className="fa-solid fa-newspaper mr-2 text-info"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {posts.length === 0 ? (
                <div className="alert alert-light text-center border">
                    <p className="text-muted m-0">Hiện tại chưa có bài viết xu hướng nào trong hệ thống.</p>
                </div>
            ) : (
                <div className="row">
                    {posts.map((item) => (
                        <div className="col-12 mb-4" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm bg-light flex-row p-3">
                                <img
                                    src={item.imageUrl || "https://picsum.photos/150"}
                                    alt={item.title}
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                    className="mr-3"
                                />
                                <div className="card-body p-0 d-flex flex-column justify-content-between">
                                    <h5 className="font-weight-bold mb-1">
                                        <a href={`/post/${item.id}`} className="text-dark text-decoration-none">
                                            {item.title}
                                        </a>
                                    </h5>
                                    <p className="text-secondary small m-0 card-text-truncate">
                                        {item.content || 'Nhấn để xem chi tiết bài viết chia sẻ về xu hướng phối đồ công sở...'}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-2 text-muted small">
                                        <span>
                                            <i className="fa-regular fa-calendar-days mr-1"></i>
                                            {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : "04/06/2026"}
                                        </span>
                                        <span className="badge badge-pill badge-info px-3 py-1 text-white cursor-pointer">
                                            Đọc tiếp <i className="fa-solid fa-angle-right ml-1"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;