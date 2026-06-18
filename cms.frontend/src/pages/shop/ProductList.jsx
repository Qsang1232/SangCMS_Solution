import React from 'react';
// NHỚ IMPORT THẺ SẢN PHẨM VÀO ĐÂY (Đây là cái khuôn vẽ ra từng chiếc xe đạp)
import ProductCard from '../../components/ProductCard';

function ProductList({ products }) {
    return (
        <div className="row mt-4">
            {/* Dùng vòng lặp map để lôi 4 chiếc xe đạp ra vẽ lên giao diện */}
            {products.map(product => (
                <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                    <ProductCard item={product} />
                </div>
            ))}
        </div>
    );
}

export default ProductList;