import React from 'react';

function LoadingOrEmpty({ isLoading, totalItems, children }) {
    if (isLoading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <p className="text-muted mt-3 font-italic">Đang nạp dữ liệu cửa hàng BikeLife, vui lòng chờ...</p>
            </div>
        );
    }

    if (totalItems === 0) {
        return (
            <div className="text-center py-5 my-4 bg-white rounded shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="Empty" style={{ width: '120px', opacity: 0.5 }} className="mb-3" />
                <h5 className="font-weight-bold text-secondary">RẤT TIẾC, KHÔNG CÓ SẢN PHẨM PHÙ HỢP</h5>
                <p className="text-muted small">Vui lòng nới rộng khoảng giá hoặc kiểm tra lại từ khóa tìm kiếm của bạn.</p>
            </div>
        );
    }

    return children;
}
export default LoadingOrEmpty;