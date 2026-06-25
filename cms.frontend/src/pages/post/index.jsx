import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Post = () => {
    return (
        <div className="post-page bg-light min-vh-100 d-flex flex-column">
            <Header />
            
            {/* Banner Đơn giản, sạch sẽ */}
            <div className="bg-white border-bottom py-5 mb-5 text-center shadow-sm">
                <div className="container py-3">
                    <h1 className="font-weight-bold mb-3 text-uppercase" style={{ color: '#005088', letterSpacing: '1px' }}>
                        <i className="fas fa-users mr-2"></i>Về Chúng Tôi
                    </h1>
                    <p className="text-muted mx-auto mb-0" style={{ maxWidth: '650px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        SangCMS.Bikes - Khởi nguồn từ đam mê. Chúng tôi không chỉ bán xe đạp, mà còn xây dựng một cộng đồng giao lưu, chia sẻ kinh nghiệm sửa chữa và kỹ thuật đạp xe cho mọi người.
                    </p>
                </div>
            </div>

            <div className="container flex-grow-1 mb-5">
                {/* Section 1: Giới thiệu chung */}
                <div className="row mb-5 align-items-center bg-white p-4 rounded shadow-sm border-0">
                    <div className="col-md-6 mb-4 mb-md-0">
                        {/* Đã đổi sang ảnh cửa hàng xe đạp / xe đạp xịn xò */}
                        <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Cửa hàng SangCMS Bikes" className="img-fluid rounded shadow" style={{ objectFit: 'cover', height: '350px', width: '100%' }} />
                    </div>
                    <div className="col-md-6 pl-md-5">
                        <h3 className="font-weight-bold mb-4 text-uppercase" style={{ color: '#F96D00' }}>Hành Trình Của Chúng Tôi</h3>
                        <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                            Bắt đầu từ một xưởng độ xe nhỏ năm 2018, SangCMS.Bikes đã phát triển thành điểm đến tin cậy của hàng ngàn cua-rơ. 
                            Chúng tôi tự hào mang đến các dòng xe chất lượng cao từ Road, MTB đến Touring, cùng dịch vụ bảo dưỡng chuẩn quốc tế.
                        </p>
                        <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
                            Mục tiêu lớn nhất của cửa hàng là tạo ra một sân chơi thực sự, nơi mọi người có thể học hỏi cách tự sửa chữa xe, lên kế hoạch cho những chuyến đi xa và rèn luyện sức khỏe mỗi ngày.
                        </p>
                    </div>
                </div>

                {/* Section 2: Góc chia sẻ Kinh nghiệm & Sửa xe */}
                <div className="text-center mb-5">
                    <h3 className="font-weight-bold text-uppercase d-inline-block pb-2" style={{ color: '#005088', borderBottom: '3px solid #F96D00' }}>
                        Góc Chia Sẻ Kiến Thức
                    </h3>
                </div>

                <div className="row">
                    {/* Bài 1: Kinh nghiệm */}
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm rounded overflow-hidden" style={{ transition: 'transform 0.3s' }}
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <img src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Kinh nghiệm leo đèo" className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
                            <div className="card-body p-4">
                                <span className="badge badge-info mb-3 px-3 py-2">Kinh nghiệm đạp xe</span>
                                <h5 className="font-weight-bold mb-3" style={{ lineHeight: '1.4' }}>Kỹ thuật leo đèo dốc dài mà không bị hụt hơi</h5>
                                <p className="text-muted small mb-0">Cách kiểm soát nhịp thở, chỉnh líp xe phù hợp và phân phối sức lực khi leo đèo dài, giúp bạn duy trì tốc độ mà không bị căng cơ chột rút.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bài 2: Sửa chữa */}
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm rounded overflow-hidden" style={{ transition: 'transform 0.3s' }}
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <img src="https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Sửa xe thủng lốp" className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
                            <div className="card-body p-4">
                                <span className="badge badge-warning text-dark mb-3 px-3 py-2">Kỹ thuật & Sửa chữa</span>
                                <h5 className="font-weight-bold mb-3" style={{ lineHeight: '1.4' }}>Mẹo tự thay ruột (xăm) xe nhanh gọn giữa đường</h5>
                                <p className="text-muted small mb-0">Hướng dẫn chi tiết từ việc cạy lốp, tìm nguyên nhân gây thủng lốp đến cách bơm vá, giúp bạn tự tin một mình xử lý khi bị thủng lốp nơi đồng vắng.</p>
                            </div>
                        </div>
                    </div>

                    {/* Bài 3: Bảo dưỡng */}
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm rounded overflow-hidden" style={{ transition: 'transform 0.3s' }}
                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <img src="https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Bảo dưỡng xích" className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
                            <div className="card-body p-4">
                                <span className="badge badge-success mb-3 px-3 py-2">Bảo dưỡng định kỳ</span>
                                <h5 className="font-weight-bold mb-3" style={{ lineHeight: '1.4' }}>Lịch bảo dưỡng quan trọng cho xe đạp leo núi MTB</h5>
                                <p className="text-muted small mb-0">Bao lâu thì nên châm nhớt xích? Khi nào cần thay thế dầu phanh đĩa thủy lực? Tổng hợp các mốc thời gian bảo dưỡng quan trọng cần nhớ cho MTB.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Post;
