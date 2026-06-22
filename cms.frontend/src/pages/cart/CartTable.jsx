import React from 'react';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL;

function CartTable({ cartItems, formatPrice, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body table-responsive p-0">
                <table className="table align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 pl-4">Sản phẩm xe đạp</th>
                            <th className="border-0 text-center">Đơn giá</th>
                            <th className="border-0 text-center">Số lượng</th>
                            <th className="border-0 text-right pr-4">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td className="pl-4 py-3">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={IMAGE_BASE_URL + item.imageUrl}
                                            alt={item.name}
                                            style={{ width: '70px', height: '70px', objectFit: 'contain', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}
                                        />
                                        <div className="ml-3">
                                            <span className="font-weight-bold text-dark d-block mb-1">{item.name}</span>
                                            <span className="badge badge-light border text-muted">Mã: #{item.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center font-weight-bold text-secondary">
                                    {formatPrice(item.price)}
                                </td>
                                <td className="text-center">
                                    <div className="btn-group border rounded bg-white shadow-sm">
                                        <button className="btn btn-sm btn-light font-weight-bold px-3" onClick={() => onDecrease(item.id)}>-</button>
                                        <button className="btn btn-sm btn-white font-weight-bold px-3" disabled>{item.quantity}</button>
                                        <button className="btn btn-sm btn-light font-weight-bold px-3" onClick={() => onIncrease(item.id)}>+</button>
                                    </div>
                                </td>
                                <td className="text-right font-weight-bold pr-4">
                                    <span className="text-danger" style={{ fontSize: '16px' }}>{formatPrice(item.price * item.quantity)}</span>
                                    <button
                                        className="btn btn-sm text-muted ml-3 hover-danger"
                                        onClick={() => onRemove(item.id)}
                                        title="Xóa khỏi giỏ hàng"
                                    >
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CartTable;