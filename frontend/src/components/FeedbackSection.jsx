import React, { useState, useEffect, useRef, useMemo } from 'react';
import FeedbackCard from './FeedbackCard';
import FeedbackForm from './FeedbackForm';

export const FeedbackSection = ({ feedbackList = [], stats, menuItems = [], onRefresh }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const total = stats?.totalFeedback !== undefined ? stats.totalFeedback : feedbackList.length;
  const avg = stats?.averageRating !== undefined ? Number(stats.averageRating) : 5.0;
  const roundedAvg = avg.toFixed(1);

  // Breakdown counts (5★ down to 1★)
  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbackList.forEach((fb) => {
      const r = Math.round(Number(fb.rating)) || 5;
      if (counts[r] !== undefined) counts[r]++;
    });

    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star];
      const pct = feedbackList.length > 0 ? Math.round((count / feedbackList.length) * 100) : (star === 5 ? 100 : 0);
      return { star, count, pct };
    });
  }, [feedbackList]);

  // Carousel Navigation
  const nextSlide = () => {
    if (feedbackList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % feedbackList.length);
  };

  const prevSlide = () => {
    if (feedbackList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + feedbackList.length) % feedbackList.length);
  };

  // Carousel Auto-play with hover pause
  useEffect(() => {
    if (feedbackList.length > 1 && !isPaused) {
      autoPlayRef.current = setInterval(nextSlide, 4500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [feedbackList.length, isPaused]);

  // Generate star icons
  const renderStars = () => {
    const fullStars = Math.floor(avg);
    const hasHalf = avg - fullStars >= 0.4;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) return <i key={i} className="fas fa-star"></i>;
      if (i === fullStars && hasHalf) return <i key={i} className="fas fa-star-half-stroke"></i>;
      return <i key={i} className="far fa-star"></i>;
    });
  };

  return (
    <section className="feedback-section" id="feedback">
      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal">
          <span className="section-tag"><i className="fas fa-heart"></i> Diners' Voice</span>
          <h2 className="section-title">Customer Feedback</h2>
          <p className="section-subtitle">
            Real dining experiences and authentic stories from food lovers at Zion Food Corner
          </p>
        </div>

        {/* Live Rating Dashboard / Showcase Card */}
        <div className="feedback-showcase-card reveal reveal-delay-1">
          {/* Left: Big Rating Number & Stars */}
          <div className="feedback-score-hero">
            <div className="feedback-big-rating">
              <span className="feedback-score-number" id="feedbackAvgRating">{roundedAvg}</span>
              <span className="feedback-max-score">/ 5</span>
            </div>
            <div className="feedback-stars-display" id="overallStarsDisplay" aria-label={`${roundedAvg} out of 5 stars`}>
              {renderStars()}
            </div>
            <p className="feedback-total-label">
              Based on <strong id="feedbackTotalCount">{total === 1 ? '1 Customer Review' : `${total} Customer Reviews`}</strong>
            </p>
            <div className="feedback-satisfaction-pill">
              <i className="fas fa-shield-halved"></i> 100% Diner Satisfaction
            </div>
          </div>

          {/* Middle: Dynamic Rating Breakdown Bars */}
          <div className="feedback-breakdown-container">
            <div className="breakdown-title">Rating Breakdown</div>
            {breakdown.map(({ star, count, pct }) => (
              <div key={star} className="rating-bar-row">
                <span className="bar-star-label">{star} <i className="fas fa-star"></i></span>
                <div className="rating-progress-track">
                  <div className="rating-progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="bar-count-label">{count}</span>
              </div>
            ))}
          </div>

          {/* Right: Trust Badges & Highlights */}
          <div className="feedback-trust-features">
            <div className="trust-feature-item">
              <div className="trust-icon-box"><i className="fas fa-certificate"></i></div>
              <div className="trust-feature-info">
                <h4>Verified Diners</h4>
                <p>100% authentic community reviews</p>
              </div>
            </div>
            <div className="trust-feature-item">
              <div className="trust-icon-box"><i className="fas fa-fire-burner"></i></div>
              <div className="trust-feature-info">
                <h4>Fresh & Handcrafted</h4>
                <p>Freshly cooked with premium spices</p>
              </div>
            </div>
            <div className="trust-feature-item">
              <div className="trust-icon-box"><i className="fas fa-truck-fast"></i></div>
              <div className="trust-feature-info">
                <h4>Swift Service</h4>
                <p>Hot, timely table & takeaway service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="feedback-carousel-section reveal reveal-delay-1">
          <div
            className="feedback-carousel-wrapper"
            id="feedbackCarouselWrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <button
              type="button"
              className="carousel-nav-btn carousel-prev-btn"
              onClick={prevSlide}
              aria-label="Previous Review"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="feedback-carousel-track-container" id="feedbackCarouselContainer">
              {feedbackList.length > 0 ? (
                <FeedbackCard feedback={feedbackList[currentIndex] || feedbackList[0]} />
              ) : (
                <div className="feedback-empty-card">
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>❤️</div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                    Be the first to share your experience!
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Tell us what you love about Zion Food Corner using the form below.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="carousel-nav-btn carousel-next-btn"
              onClick={nextSlide}
              aria-label="Next Review"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Carousel Dots Indicators */}
          {feedbackList.length > 1 && (
            <div className="carousel-dots-container" id="feedbackCarouselDots">
              {feedbackList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Feedback Submission Form Card */}
        <FeedbackForm menuItems={menuItems} onFeedbackSubmitted={onRefresh} />
      </div>
    </section>
  );
};

export default FeedbackSection;
