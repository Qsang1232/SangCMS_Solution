import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Nhập 4 mảnh ghép của trang chủ
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';

function Home() {
    return (
        <div className="homepage-wrapper d-flex flex-column min-vh-100 bg-light">
            <Header />

            <main className="flex-grow-1">
                <HeroBanner />
                <CategoryMenu />
                <ProductGrid />
                <LatestBlog />
            </main>

            <Footer />
        </div>
    );
}

export default Home;