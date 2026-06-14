import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu() {
    // 1. Khai báo State để lưu mảng danh mục sản phẩm từ SQL Server đổ về
    const [categories, setCategories] = useState([]);

    // 2. Khai báo State để theo dõi danh mục nào đang được bấm chọn (Mặc định null là "Tất cả")
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    // 3. Khai báo State quản lý trạng thái Loading dữ liệu mạng
    const [loading, setLoading] = useState(true);

    // 4. Gọi API ngay khi component được nạp lên trang chủ
    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                // Gọi API thực tế thông qua service: GET /api/categoriesproducts
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi liên kết API lấy danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    // Hàm xử lý đổi trạng thái danh mục khi click và kích hoạt lọc dữ liệu
    const handleCategoryClick = (id) => {
        setActiveCategoryId(id);
        // Gợi ý tư duy: Ở các buổi nâng cao, bạn sẽ truyền ID này lên component cha (Home) 
        // để ép ProductGrid tải lại danh sách sản phẩm theo bộ lọc.
        console.log(`Đang yêu cầu lọc sản phẩm theo mã Danh mục ID: ${id}`);
    };

    if (loading) {
        return (
            <div className="text-center my-3 text-muted small">
                <div className="spinner-grow spinner-grow-sm text-secondary mr-2" role="status"></div>
                Đang đồng bộ phân loại sản phẩm thời trang...
            </div>
        );
    }

    return (
        <div className="category-menu-wrapper my-4">
            <div className="container">
                <div className="card border-0 shadow-sm p-2 bg-white rounded">
                    {/* Thanh điều hướng ngang dạng Nav Pills của Bootstrap 4 */}
                    <ul className="nav nav-pills justify-content-center flex-wrap">

                        {/* Nút mặc định: Hiển thị Tất Cả Sản Phẩm */}
                        <li className="nav-item m-1">
                            <button
                                className={`nav-link border-0 btn-sm font-weight-bold px-3 py-2 ${activeCategoryId === null ? 'active bg-dark text-white' : 'bg-light text-dark'}`}
                                onClick={() => handleCategoryClick(null)}
                                style={{ borderRadius: '20px', transition: 'all 0.3s' }}
                            >
                                <i className="fa-solid fa-border-all mr-1"></i> Tất Cả Danh Mục
                            </button>
                        </li>

                        {/* Duyệt mảng categories kéo về từ SQL bằng hàm map() */}
                        {categories.map((cat) => (
                            <li className="nav-item m-1" key={cat.id}>
                                <button
                                    className={`nav-link border-0 btn-sm font-weight-bold px-3 py-2 ${activeCategoryId === cat.id ? 'active bg-info text-white' : 'bg-light text-dark'}`}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    style={{ borderRadius: '20px', transition: 'all 0.3s' }}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CategoryMenu;