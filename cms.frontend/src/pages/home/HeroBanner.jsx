import React from 'react';
import { Link } from 'react-router-dom';

function HeroBanner() {
    return (
        <section className="hero-banner position-relative">
            <div
                className="bg-dark text-white d-flex align-items-center justify-content-center text-center"
                style={{
                    height: '500px',
                    // Ảnh nền xe đạp thể thao
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="container px-4">
                    <h1 className="display-4 font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '2px' }}>
                        Đam Mê Bất Tận Cùng BikeLife
                    </h1>
                    <p className="lead mb-4 mx-auto text-light" style={{ maxWidth: '700px', fontSize: '18px' }}>
                        Khám phá các dòng xe đạp địa hình (MTB), xe đạp đua (Road) và phụ kiện chính hãng với mức giá tốt nhất thị trường.
                    </p>
                    <Link to="/shop" className="btn btn-lg font-weight-bold text-white px-5 py-3 rounded-pill shadow" style={{ backgroundColor: '#FF5A00', border: 'none', transition: '0.3s' }}>
                        MUA SẮM NGAY <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;