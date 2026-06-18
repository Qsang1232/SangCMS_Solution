import React from 'react';

function ProductInfo({ product, formatPrice, quantity, setQuantity, handleAddToCart }) {
    return (
        <div className="product-info-wrapper pl-md-4">
            <h2 className="font-weight-bold text-uppercase mb-2" style={{ color: '#005088', lineHeight: '1.4' }}>
                {product.name}
            </h2>

            {/* Thanh trạng thái tồn kho */}
            <div className="mb-4 d-flex align-items-center">
                <span className="badge badge-success px-3 py-2 mr-3" style={{ fontSize: '13px' }}>
                    <i className="fas fa-check-circle mr-1"></i> Tồn kho: {product.stockQuantity} chiếc
                </span>
                <span className="text-muted small"><i className="fas fa-star text-warning mr-1"></i> 5.0 (24 đánh giá)</span>
            </div>

            <h3 className="text-danger font-weight-bold mb-4 pb-3 border-bottom" style={{ fontSize: '28px' }}>
                {formatPrice(product.price)}
            </h3>

            {/* In mô tả sinh ra từ CKEditor */}
            <div
                className="product-desc text-secondary mb-5 text-justify"
                style={{ fontSize: '15px', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Ô chọn số lượng và Nút Mua */}
            <div className="purchase-action-box bg-light p-4 rounded border">
                <div className="d-flex align-items-center mb-4">
                    <label className="font-weight-bold mr-4 mb-0 text-dark">SỐ LƯỢNG MUA:</label>
                    <div className="input-group" style={{ width: '130px' }}>
                        <div className="input-group-prepend">
                            <button className="btn btn-outline-secondary font-weight-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        </div>
                        <input
                            type="number"
                            className="form-control text-center font-weight-bold bg-white"
                            min="1"
                            value={quantity}
                            readOnly
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary font-weight-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>
                </div>

                <div className="d-flex" style={{ gap: '15px' }}>
                    <button
                        className="btn btn-lg flex-grow-1 text-white font-weight-bold text-uppercase"
                        style={{ backgroundColor: '#FF5A00', borderRadius: '8px', transition: '0.3s' }}
                        onClick={handleAddToCart}
                    >
                        <i className="fas fa-cart-plus mr-2"></i> Thêm Vào Giỏ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;