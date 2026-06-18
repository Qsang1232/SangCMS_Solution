import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import postService from '../../services/postService';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const IMAGE_BASE_URL = "https://localhost:7111";

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        postService.getPostById(id).then(data => setPost(data.data || data)).catch(err => console.log(err));
    }, [id]);

    if (!post) return <div className="text-center py-5 mt-5">Đang tải...</div>;

    return (
        <div className="blog-detail bg-light min-vh-100 d-flex flex-column">
            <Header />
            <div className="container py-5 flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-lg-9 bg-white p-5 rounded shadow-sm border-top" style={{ borderColor: '#FF5A00', borderWidth: '4px !important' }}>
                        <h1 className="font-weight-bold mb-3" style={{ color: '#005088' }}>{post.title}</h1>
                        <p className="text-muted mb-4"><i className="far fa-calendar-alt mr-2 text-info"></i> Đăng ngày: {new Date(post.createdDate).toLocaleDateString('vi-VN')}</p>

                        {post.imageUrl && (
                            <img src={IMAGE_BASE_URL + post.imageUrl} alt={post.title} className="img-fluid w-100 rounded mb-4" />
                        )}

                        <div className="post-content text-justify" style={{ fontSize: '16px', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default BlogDetail;