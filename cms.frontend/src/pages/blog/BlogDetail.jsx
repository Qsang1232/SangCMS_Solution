import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams dùng để lấy ID từ thanh địa chỉ
import postService from '../../services/postService';

const IMAGE_BASE_URL = "https://localhost:7111"; // Cấu hình link ảnh backend

function BlogDetail() {
    // Lấy tham số :id từ URL (đã cấu hình trong App.jsx)
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // Truyền ID vào service để lấy đúng 1 bài viết
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetail();
    }, [id]); // Chạy lại useEffect nếu ID trên URL thay đổi

    if (loading) {
        return <div className="container py-5 text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    }

    if (!post) {
        return <div className="container py-5 text-center mt-5"><h4>Bài viết không tồn tại hoặc đã bị xóa!</h4><Link to="/blog" className="btn btn-info mt-3">Về danh sách</Link></div>;
    }

    return (
        <div className="blog-detail-wrapper py-5 bg-white">
            <div className="container">
                {/* Thanh điều hướng Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-transparent p-0 mb-4">
                        <li className="breadcrumb-item"><Link to="/" className="text-info">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/blog" className="text-info">Tin tức</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        {/* Tiêu đề bài viết */}
                        <h1 className="font-weight-bold mb-3" style={{ color: '#005088', lineHeight: '1.4' }}>
                            {post.title}
                        </h1>

                        {/* Ngày đăng */}
                        <p className="text-muted mb-4">
                            <i className="far fa-calendar-alt mr-2 text-info"></i>
                            Đăng ngày: {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                        </p>

                        {/* Ảnh bìa bài viết */}
                        {post.imageUrl && (
                            <div className="mb-5 rounded overflow-hidden shadow-sm">
                                <img src={IMAGE_BASE_URL + post.imageUrl} alt={post.title} className="img-fluid w-100" />
                            </div>
                        )}

                        {/* NỘI DUNG BÀI VIẾT (Render HTML raw từ CKEditor) */}
                        {/* Lưu ý: Đây là cú pháp bắt buộc của React để in HTML có sẵn thẻ <b>, <i>, <img> */}
                        <div
                            className="post-content text-justify"
                            style={{ fontSize: '16px', lineHeight: '1.8' }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <hr className="my-5" />

                        <div className="text-center">
                            <Link to="/blog" className="btn btn-outline-info rounded-pill px-4">
                                <i className="fas fa-arrow-left mr-2"></i> Xem các bài viết khác
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;