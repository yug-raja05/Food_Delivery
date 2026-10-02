import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiClient from '../services/api';

export const Hero = ({ stats: propStats }) => {
  const [internalStats, setInternalStats] = useState(null);

  useEffect(() => {
    if (!propStats) {
      ApiClient.getFeedbackStats()
        .then((res) => {
          if (res?.data) {
            setInternalStats(res.data);
          }
        })
        .catch((err) => console.warn('Could not auto-fetch hero rating stats:', err));
    }
  }, [propStats]);

  const activeStats = propStats || internalStats;
  const avgRating = activeStats?.averageRating !== undefined 
    ? Number(activeStats.averageRating).toFixed(1) 
    : "5.0";
  const totalReviews = activeStats?.totalFeedback !== undefined 
    ? activeStats.totalFeedback 
    : 3;

  const renderStars = () => {
    const numRating = Number(avgRating);
    const fullStars = Math.floor(numRating);
    const hasHalf = numRating - fullStars >= 0.4;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) return <i key={i} className="fas fa-star" style={{ color: '#F59E0B' }}></i>;
      if (i === fullStars && hasHalf) return <i key={i} className="fas fa-star-half-stroke" style={{ color: '#F59E0B' }}></i>;
      return <i key={i} className="far fa-star" style={{ color: '#D1D5DB' }}></i>;
    });
  };

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-grid">
          {/* Text Column */}
          <div className="hero-content reveal">
            <div className="hero-pill-badge" id="heroRatingPill">
              <i className="fas fa-star" style={{ color: '#F59E0B' }}></i> {avgRating} Star Rated Fast Food Corner
            </div>

            <h1 className="hero-title">
              Zion <span>Food Corner</span>
            </h1>

            <p className="hero-subtitle">
              Delicious Food at Affordable Prices
            </p>

            <p className="hero-description">
              Enjoy delicious biryani, fried rice, noodles, chicken dishes, and popular Indian favourites at affordable prices.
            </p>

            <div className="hero-cta-group">
              <Link to="/menu" className="btn btn-primary btn-lg" id="hero-btn-menu">
                <i className="fas fa-utensils"></i> View Menu
              </Link>
              <a href="tel:09886764280" className="btn btn-call btn-lg" id="hero-btn-call">
                <i className="fas fa-phone"></i> Call Now
              </a>
            </div>

            <div className="hero-rating-snippet">
              <div className="rating-stars" aria-label={`${avgRating} out of 5 stars`}>
                {renderStars()}
              </div>
              <div className="rating-text">
                <strong id="heroRatingDisplay">{avgRating} / 5 Rating</strong> &bull; {totalReviews} {totalReviews === 1 ? 'Customer Review' : 'Customer Reviews'}
              </div>
            </div>
          </div>

          {/* Media Visual Column */}
          <div className="hero-media-wrapper reveal reveal-delay-2">
            <div
              className="hero-main-card"
              id="hero3DCard"
            >
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80"
                alt="Aromatic Chicken Biryani at Zion Food Corner"
                className="hero-img"
              />
              <div className="floating-badge-price">
                ₹70.00
              </div>
              <div className="hero-image-overlay">
                <span className="hero-image-caption">Signature Dish</span>
                <h3 className="hero-image-dish">Special Chicken Biryani</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
