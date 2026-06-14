import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
    const [blogCategories, setBlogCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                // LƯU Ý: Đảm bảo trong file blogService.js, hàm này đang gọi return axiosClient.get('/ProductsApi');
                const data = await blogService.getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error("Lỗi hệ thống khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogCategories();
    }, []);

    if (loading) {
        return <div className="text-center my-3 text-muted small">Đang nạp danh sách sản phẩm...</div>;
    }

    return (
        <div className="card shadow-sm p-3 mt-4 bg-white rounded border-0">
            <h5 className="card-title text-uppercase font-weight-bold text-secondary">
                <i className="fa-solid fa-tags mr-2 text-info"></i> Sản Phẩm
            </h5>

            <div className="list-group list-group-flush mt-2">
                {blogCategories.length === 0 ? (
                    <p className="text-muted small pl-2">Chưa có sản phẩm nào.</p>
                ) : (
                    blogCategories.map((cate) => (
                        <a
                            key={cate.id}
                            /* CHỖ SỬA SỐ 1: Đổi link để khi click vào không bị nhảy sang trang blog */
                            href={`/product/detail/${cate.id}`}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-1 text-dark text-decoration-none small"
                        >
                            <span>
                                <i className="fa-regular fa-hashtag mr-2 text-muted"></i>
                                {/* CHỖ SỬA SỐ 2 (QUAN TRỌNG NHẤT): 
                                    Trong Database C# của bạn, cột tên sản phẩm thường là Title chứ không phải Name.
                                    Nên gọi {cate.name} nó sẽ bị trắng tinh. Mình dùng cate.title để nó hiện chữ "bánh kẹo", "bsss" */}
                                {cate.title || cate.name}
                            </span>
                            <span className="badge badge-light border text-muted">Xem</span>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogCategoryList;