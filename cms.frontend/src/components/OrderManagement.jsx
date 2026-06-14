import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Hàm lấy lại danh sách đơn hàng để cập nhật giao diện thời gian thực
    const loadAllOrders = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadAllOrders().finally(() => setLoading(false));
    }, []);

    const handleViewDetails = async (orderId) => {
        try {
            setLoadingDetails(true);
            setActiveOrderId(orderId);
            const details = await orderService.getOrderDetails(orderId);
            setSelectedOrderDetails(details);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            setSelectedOrderDetails([]);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Hàm xử lý đổi trạng thái đơn hàng (Duyệt nhanh)
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            alert("Thay đổi trạng thái đơn hàng thành công!");
            loadAllOrders(); // Tải lại danh sách để đồng bộ số liệu mới
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái đơn hàng.");
        }
    };

    // Hàm xử lý xóa đơn hàng
    const handleDeleteOrder = async (orderId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng #${orderId} và toàn bộ chi tiết không?`)) {
            try {
                await orderService.deleteOrder(orderId);
                alert("Đã xóa đơn hàng thành công!");
                if (activeOrderId === orderId) {
                    setActiveOrderId(null);
                    setSelectedOrderDetails([]);
                }
                loadAllOrders(); // Tải lại bảng dữ liệu
            } catch (error) {
                alert("Lỗi hệ thống, không thể xóa đơn hàng.");
            }
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case 0: return <span className="badge badge-warning">Chờ duyệt</span>;
            case 1: return <span className="badge badge-primary">Đang giao</span>;
            case 2: return <span className="badge badge-success">Đã xong</span>;
            default: return <span className="badge badge-secondary">Không rõ</span>;
        }
    };

    if (loading) {
        return <div className="text-center my-4 text-muted small">Đang nạp dữ liệu quản trị hệ thống...</div>;
    }

    return (
        <div className="card shadow-sm p-4 mt-4 bg-white rounded">
            <h5 className="card-title text-uppercase font-weight-bold text-secondary mb-4">
                <i className="fa-solid fa-gears mr-2 text-danger"></i>
                Hệ Thống Kiểm Soát Vận Đơn & Khách Hàng (Mục 3, 4, 5)
            </h5>

            <div className="row">
                {/* BẢNG QUẢN LÝ ĐƠN HÀNG */}
                <div className="col-md-8 border-right">
                    <h6 className="font-weight-bold text-dark mb-3">Danh sách hóa đơn hệ thống</h6>
                    <div className="table-responsive">
                        <table className="table table-hover table-sm small">
                            <thead className="thead-light">
                                <tr>
                                    <th>Mã ĐH</th>
                                    <th>Khách Hàng</th>
                                    <th>Ngày Đặt</th>
                                    <th>Trạng Thái</th>
                                    <th className="text-center">Xử lý đơn</th>
                                    <th className="text-right">Công cụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center text-muted">Chưa phát sinh đơn hàng nào trên hệ thống.</td></tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className={activeOrderId === order.id ? "table-info" : ""}>
                                            <td><strong>#{order.id}</strong></td>
                                            <td>{order.customerName || `Khách hàng #${order.customerId}`}</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                            <td>{renderStatus(order.status)}</td>
                                            <td className="text-center">
                                                {order.status === 0 && (
                                                    <button className="btn btn-xs btn-success btn-sm py-0 px-1 font-weight-bold mr-1" onClick={() => handleUpdateStatus(order.id, 1)}>Duyệt giao</button>
                                                )}
                                                {order.status === 1 && (
                                                    <button className="btn btn-xs btn-info btn-sm py-0 px-1 font-weight-bold mr-1" onClick={() => handleUpdateStatus(order.id, 2)}>Hoàn tất</button>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    className="btn btn-xs btn-outline-secondary p-1 btn-sm mr-1 font-weight-bold"
                                                    onClick={() => handleViewDetails(order.id)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    className="btn btn-xs btn-outline-danger p-1 btn-sm font-weight-bold"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <i className="fa-solid fa-trash-can"></i> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* VÙNG HIỂN THỊ HÓA ĐƠN CHI TIẾT */}
                <div className="col-md-4">
                    <h6 className="font-weight-bold text-dark mb-3">Vật phẩm trong hóa đơn</h6>
                    {loadingDetails ? (
                        <div className="text-center text-muted small py-4">Đang truy xuất dữ liệu từ SQL...</div>
                    ) : activeOrderId === null ? (
                        <div className="alert alert-light text-center border text-muted small py-5">
                            Chọn lệnh "Xem chi tiết" của bất kì hóa đơn nào để bóc tách thông tin sản phẩm.
                        </div>
                    ) : (
                        <div className="bg-light p-3 rounded border">
                            <p className="font-weight-bold text-primary small mb-2">CHI TIẾT MÃ ĐƠN: #{activeOrderId}</p>
                            <ul className="list-group list-group-flush">
                                {selectedOrderDetails.length === 0 ? (
                                    <li className="list-group-item bg-transparent text-muted small text-center">Đơn hàng trống hoặc không chứa vật phẩm hợp lệ</li>
                                ) : (
                                    selectedOrderDetails.map((detail) => (
                                        <li key={detail.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-2 small">
                                            <div>
                                                <span className="font-weight-bold d-block text-truncate" style={{ maxWidth: '150px' }}>
                                                    {detail.product?.name || `Sản phẩm #${detail.productId}`}
                                                </span>
                                                <small className="text-muted">{detail.quantity} cái x {detail.unitPrice?.toLocaleString('vi-VN')}đ</small>
                                            </div>
                                            <span className="font-weight-bold text-dark">
                                                {(detail.quantity * detail.unitPrice).toLocaleString('vi-VN')}đ
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>

                            {selectedOrderDetails.length > 0 && (
                                <div className="d-flex justify-content-between font-weight-bold border-top pt-2 mt-2 text-danger">
                                    <span>THÀNH TIỀN:</span>
                                    <span>
                                        {selectedOrderDetails.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;