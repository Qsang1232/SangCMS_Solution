import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function ShopSidebar({ activeCategory, minPrice, maxPrice, onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();
                setCategories(response.data || response);
            } catch (error) {
                console.error("Lỗi nạp danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="card p-3 shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#005088', letterSpacing: '1px' }}>
                <i className="fas fa-filter mr-2"></i>Danh Mục
            </h6>

            <div className="list-group list-group-flush mb-4">
                <button
                    className={`list-group-item list-group-item-action border-0 px-2 d-flex align-items-center ${activeCategory === null ? 'text-primary font-weight-bold bg-light' : 'text-secondary'}`}
                    onClick={() => onFilterChange({ categoryProductId: null })}
                    style={{ borderRadius: '8px', transition: 'all 0.2s' }}
                >
                    <i className={`fas fa-chevron-right mr-2 small ${activeCategory === null ? 'opacity-100' : 'opacity-0'}`}></i>
                    Tất cả sản phẩm
                </button>

                {loading ? (
                    <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                ) : (
                    categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`list-group-item list-group-item-action border-0 px-2 d-flex align-items-center ${activeCategory === cat.id ? 'text-primary font-weight-bold bg-light' : 'text-secondary'}`}
                            onClick={() => onFilterChange({ categoryProductId: cat.id })}
                            style={{ borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px' }}
                        >
                            <i className={`fas fa-chevron-right mr-2 small ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`}></i>
                            {cat.name}
                        </button>
                    ))
                )}
            </div>

            <h6 className="font-weight-bold text-uppercase mb-3" style={{ color: '#005088', letterSpacing: '1px' }}>
                <i className="fas fa-tag mr-2"></i>Khoảng Giá (đ)
            </h6>
            <div className="price-filter-inputs">
                <div className="input-group input-group-sm mb-2">
                    <div className="input-group-prepend"><span className="input-group-text bg-white border-right-0 text-muted">Từ</span></div>
                    <input type="number" className="form-control border-left-0" placeholder="0" value={minPrice} onChange={(e) => onFilterChange({ minPrice: e.target.value })} />
                </div>
                <div className="input-group input-group-sm">
                    <div className="input-group-prepend"><span className="input-group-text bg-white border-right-0 text-muted">Đến</span></div>
                    <input type="number" className="form-control border-left-0" placeholder="999.000..." value={maxPrice} onChange={(e) => onFilterChange({ maxPrice: e.target.value })} />
                </div>
            </div>

            <button
                className="btn btn-sm btn-outline-secondary btn-block mt-4" style={{ borderRadius: '20px' }}
                onClick={() => onFilterChange({ categoryProductId: null, minPrice: '', maxPrice: '', keyword: '' })}
            >
                Xóa bộ lọc
            </button>
        </div>
    );
}
export default ShopSidebar;