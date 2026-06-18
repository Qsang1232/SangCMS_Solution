import React from 'react';

function ShopHeader({ total, keyword, onSearchChange }) {
    return (
        <div className="card p-3 mb-4 shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="row align-items-center">
                <div className="col-md-4 mb-2 mb-md-0">
                    <span className="font-weight-bold text-secondary">
                        Tìm thấy <span style={{ color: '#F96D00' }}>{total}</span> sản phẩm
                    </span>
                </div>
                <div className="col-md-8">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text bg-white border-right-0 text-muted">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form-control border-left-0"
                            placeholder="Gõ từ khóa tìm xe đạp MTB, phụ kiện..."
                            value={keyword}
                            onChange={(e) => onSearchChange({ keyword: e.target.value })}
                            style={{ borderRadius: '0 20px 20px 0' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ShopHeader;