import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';
import { useNavigate } from 'react-router-dom';

function CategoryMenu() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = () => {
        navigate('/shop');
    };

    return (
        <section className="category-menu-wrapper py-5 bg-white border-bottom">
            <div className="container">
                <div className="text-center mb-4">
                    <h4 className="font-weight-bold text-uppercase" style={{ color: '#005088' }}>Mua Sắm Theo Danh Mục</h4>
                </div>

                {/* Lưới các khối vuông bo góc hiển thị danh mục */}
                <div className="row justify-content-center text-center">
                    {/* Khối tĩnh: Tất cả sản phẩm */}
                    <div className="col-6 col-sm-4 col-md-2 mb-3">
                        <div
                            className="category-box p-3 shadow-sm rounded-lg cursor-pointer transition-all h-100 d-flex flex-column justify-content-center"
                            style={{ backgroundColor: '#f8f9fa', border: '1px solid #eee' }}
                            onClick={handleCategoryClick}
                        >
                            <i className="fa-solid fa-bicycle text-primary mb-2" style={{ fontSize: '32px' }}></i>
                            <span className="d-block font-weight-bold text-dark small text-uppercase mt-2">Tất Cả</span>
                        </div>
                    </div>

                    {/* Vòng lặp render các danh mục từ database */}
                    {categories.map((cat) => (
                        <div className="col-6 col-sm-4 col-md-2 mb-3" key={cat.id}>
                            <div
                                className="category-box p-3 shadow-sm rounded-lg cursor-pointer transition-all h-100 d-flex flex-column justify-content-center"
                                style={{ backgroundColor: '#f8f9fa', border: '1px solid #eee' }}
                                onClick={handleCategoryClick}
                            >
                                <i className="fa-solid fa-gear text-secondary mb-2" style={{ fontSize: '32px' }}></i>
                                <span className="d-block font-weight-bold text-dark small text-uppercase mt-2">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Thêm CSS cho khối vuông tạo hiệu ứng hover mượt mà */}
            <style>{`
                .category-box:hover { 
                    transform: translateY(-5px); 
                    border-color: #FF5A00 !important; 
                    background-color: #fff !important; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                }
                .category-box:hover i { color: #FF5A00 !important; }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </section>
    );
}

export default CategoryMenu;