import React, { useState, useEffect } from 'react';
import postService from '../../services/postService';
import PostCard from '../../components/PostCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        postService.getAllPosts().then(data => setPosts(data)).catch(err => console.log(err));
    }, []);

    return (
        <div className="blog-page bg-light min-vh-100 d-flex flex-column">
            <Header />
            <div className="container py-5 flex-grow-1">
                <div className="text-center mb-5">
                    <h2 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>Cẩm Nang BikeLife</h2>
                    <div className="mx-auto mt-2" style={{ width: '60px', height: '3px', backgroundColor: '#FF5A00' }}></div>
                </div>
                <div className="row">
                    {posts.map(post => (
                        <div className="col-lg-4 col-md-6 mb-4" key={post.id}>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default Blog;