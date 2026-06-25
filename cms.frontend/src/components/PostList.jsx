import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

// 1. Khai báo URL gốc của Backend ASP.NET Core (Lấy từ port chạy thực tế của bạn)
const BASE_URL = "https://localhost:7111";

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
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang kết nối Database lấy tin tức...</p>
            </div>
        );
    }

    // Tự động tạo một số bài viết mẫu (Mock Data) đẹp mắt nếu Database đang trống
    const dummyPosts = [
        {
            id: 'demo-1',
            title: 'Hành trình chinh phục đèo Hải Vân bằng xe đạp Road: Những điều cần biết',
            imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            createdDate: '2023-10-15T00:00:00Z',
        },
        {
            id: 'demo-2',
            title: 'Top 5 phụ kiện không thể thiếu cho những chuyến đạp xe đường dài',
            imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            createdDate: '2023-11-02T00:00:00Z',
        },
        {
            id: 'demo-3',
            title: 'Hướng dẫn bảo dưỡng xe đạp leo núi (MTB) cơ bản tại nhà',
            imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            createdDate: '2023-11-20T00:00:00Z',
        },
        {
            id: 'demo-4',
            title: 'Đạp xe buổi sáng và những lợi ích tuyệt vời cho sức khỏe tim mạch',
            imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            createdDate: '2023-12-05T00:00:00Z',
        }
    ];

    const displayPosts = posts.length > 0 ? posts : dummyPosts;

    return (
        <div className="card shadow-sm p-4 bg-white rounded border-0">
            <h4 className="card-title text-uppercase font-weight-bold text-dark border-bottom pb-3 mb-4">
                <i className="fa-solid fa-newspaper mr-2" style={{ color: '#005088' }}></i> Các Bài Viết Đáng Chú Ý
            </h4>

            {displayPosts.length === 0 ? (
                <div className="alert alert-light text-center border">
                    <p className="text-muted m-0">Hiện tại chưa có bài viết xu hướng nào trong hệ thống.</p>
                </div>
            ) : (
                <div className="row">
                    {displayPosts.map((item) => (
                        <div className="col-md-6 mb-4" key={item.id}>
                            <div className="card h-100 border-0 shadow-sm rounded overflow-hidden" style={{ transition: 'transform 0.2s', backgroundColor: '#fff' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                
                                {/* Ảnh bài viết ở trên */}
                                <img
                                    src={
                                        item.imageUrl
                                            ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${BASE_URL}${item.imageUrl}`)
                                            : "https://picsum.photos/400/250"
                                    }
                                    alt={item.title}
                                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = "https://picsum.photos/400/250"; }}
                                />
                                
                                {/* Nội dung bài viết ở dưới */}
                                <div className="card-body d-flex flex-column p-4">
                                    <div className="text-muted small mb-2 font-weight-bold" style={{ color: '#F96D00' }}>
                                        <i className="far fa-calendar-alt mr-1"></i>
                                        {item.createdDate ? new Date(item.createdDate).toLocaleDateString('vi-VN') : "11/06/2026"}
                                    </div>
                                    
                                    <h5 className="font-weight-bold mb-3" style={{ lineHeight: '1.5' }}>
                                        <a href={`/post/${item.id}`} className="text-dark text-decoration-none" style={{
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                        }}>
                                            {item.title}
                                        </a>
                                    </h5>
                                    
                                    <div className="mt-auto pt-3 border-top">
                                        <a href={`/post/${item.id}`} className="text-info font-weight-bold text-decoration-none small text-uppercase">
                                            Đọc tiếp <i className="fas fa-arrow-right ml-1"></i>
                                        </a>
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