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

    // Hàm chuyển sang trang Shop khi click vào danh mục
    const handleCategoryClick = () => {
        navigate('/shop');
    };

    return (
        <section className="category-menu-wrapper py-4 bg-white border-bottom">
            <div className="container">
                <ul className="nav nav-pills nav-fill flex-column flex-sm-row">
                    <li className="nav-item m-1">
                        <button
                            className="nav-link w-100 font-weight-bold border-0 text-uppercase py-3 text-white"
                            style={{ borderRadius: '8px', fontSize: '14px', backgroundColor: '#005088' }}
                            onClick={handleCategoryClick}
                        >
                            Tất cả sản phẩm
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li className="nav-item m-1" key={cat.id}>
                            <button
                                className="nav-link w-100 font-weight-bold border-0 text-uppercase py-3 text-secondary bg-light"
                                style={{ borderRadius: '8px', fontSize: '14px' }}
                                onClick={handleCategoryClick}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default CategoryMenu;