import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const bannerSlides = [
    {
        image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop",
        title: "Đam Mê Bất Tận Cùng BikeLife",
        description: "Khám phá các dòng xe đạp địa hình (MTB), xe đạp đua (Road) và phụ kiện chính hãng với mức giá tốt nhất thị trường.",
        buttonText: "MUA SẮM NGAY",
        buttonLink: "/shop"
    },
    {
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2070&auto=format&fit=crop",
        title: "Bộ Sưu Tập Xe Đạp Đua 2026",
        description: "Trải nghiệm tốc độ vượt trội với các dòng Road Bike cao cấp, khung carbon siêu nhẹ, thiết kế khí động học hoàn hảo.",
        buttonText: "XEM BỘ SƯU TẬP",
        buttonLink: "/shop"
    },
    {
        image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop",
        title: "Cộng Đồng Đạp Xe Việt Nam",
        description: "Tham gia hàng ngàn cua-rơ trên khắp cả nước, chia sẻ hành trình và đam mê cùng nhau chinh phục mọi cung đường.",
        buttonText: "THAM GIA NGAY",
        buttonLink: "/post"
    }
];

function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Tự động chuyển slide mỗi 5 giây
    useEffect(() => {
        const timer = setInterval(() => {
            handleNextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const handleNextSlide = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
            setIsTransitioning(false);
        }, 500);
    };

    const handlePrevSlide = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
            setIsTransitioning(false);
        }, 500);
    };

    const slide = bannerSlides[currentSlide];

    return (
        <section className="hero-banner position-relative" style={{ overflow: 'hidden' }}>
            {/* CSS cho animation */}
            <style>{`
                .hero-slide-content {
                    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
                }
                .hero-slide-content.fading {
                    opacity: 0;
                    transform: translateY(20px);
                }
                .hero-slide-content.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .hero-dot {
                    width: 12px; height: 12px; border-radius: 50%;
                    border: 2px solid #fff; background: transparent;
                    cursor: pointer; transition: all 0.3s;
                    margin: 0 5px;
                }
                .hero-dot.active {
                    background: #FF5A00; border-color: #FF5A00;
                    transform: scale(1.3);
                }
                .hero-nav-btn {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    background: rgba(255,255,255,0.2); border: none; color: #fff;
                    width: 50px; height: 50px; border-radius: 50%;
                    font-size: 20px; cursor: pointer; transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(5px); z-index: 10;
                }
                .hero-nav-btn:hover {
                    background: rgba(255,90,0,0.8); transform: translateY(-50%) scale(1.1);
                }
            `}</style>

            <div
                className="bg-dark text-white d-flex align-items-center justify-content-center text-center"
                style={{
                    height: '500px',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('${slide.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'background-image 0.8s ease-in-out'
                }}
            >
                {/* Nút điều hướng Trái */}
                <button className="hero-nav-btn" style={{ left: '20px' }} onClick={handlePrevSlide}>
                    <i className="fas fa-chevron-left"></i>
                </button>

                {/* Nội dung slide */}
                <div className={`container px-4 hero-slide-content ${isTransitioning ? 'fading' : 'visible'}`}>
                    <h1 className="display-4 font-weight-bold mb-3 text-uppercase" style={{ letterSpacing: '2px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                        {slide.title}
                    </h1>
                    <p className="lead mb-4 mx-auto text-light" style={{ maxWidth: '700px', fontSize: '18px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                        {slide.description}
                    </p>
                    <Link to={slide.buttonLink} className="btn btn-lg font-weight-bold text-white px-5 py-3 rounded-pill shadow" style={{ backgroundColor: '#FF5A00', border: 'none', transition: '0.3s' }}>
                        {slide.buttonText} <i className="fas fa-arrow-right ml-2"></i>
                    </Link>

                    {/* Chấm tròn chỉ slide */}
                    <div className="d-flex justify-content-center mt-4">
                        {bannerSlides.map((_, index) => (
                            <button
                                key={index}
                                className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
                                onClick={() => { setIsTransitioning(true); setTimeout(() => { setCurrentSlide(index); setIsTransitioning(false); }, 500); }}
                            />
                        ))}
                    </div>
                </div>

                {/* Nút điều hướng Phải */}
                <button className="hero-nav-btn" style={{ right: '20px' }} onClick={handleNextSlide}>
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </section>
    );
}

export default HeroBanner;