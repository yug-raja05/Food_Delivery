import React from 'react';

export const Contact = ({ stats }) => {
  const avg = stats?.averageRating !== undefined ? Number(stats.averageRating) : 5.0;
  const roundedAvg = avg.toFixed(1);
  const total = stats?.totalFeedback !== undefined ? stats.totalFeedback : 3;

  const fullStars = Math.floor(avg);
  const hasHalf = avg - fullStars >= 0.4;

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) return <i key={i} className="fas fa-star"></i>;
      if (i === fullStars && hasHalf) return <i key={i} className="fas fa-star-half-stroke"></i>;
      return <i key={i} className="far fa-star"></i>;
    });
  };

  return (
    <section className="info-section" id="contact">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag"><i className="fas fa-headset"></i> Quick Connect</span>
          <h2 className="section-title">Visit or Call Us Today</h2>
          <p className="section-subtitle">
            Experience our delicious, freshly prepared delicacies or place your takeaway order directly with our kitchen.
          </p>
        </div>

        <div className="info-cards-grid">
          {/* 1. Location Card */}
          <div className="info-card reveal reveal-delay-1" id="info-card-address">
            <div>
              <div className="info-card-header">
                <div className="info-icon-wrapper red">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div>
                  <h3 className="info-card-title">Our Location</h3>
                  <span className="info-card-tag">S R Nagar, Bengaluru</span>
                </div>
              </div>
              <div className="info-card-body">
                <p className="info-card-text">
                  45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru 560027
                </p>
              </div>
            </div>
            <div className="info-card-footer">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027"
                target="_blank"
                rel="noopener noreferrer"
                className="info-card-action"
                id="info-map-link"
              >
                <span>Get Directions</span> <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          {/* 2. Opening Hours Card */}
          <div className="info-card reveal reveal-delay-2" id="info-card-hours">
            <div>
              <div className="info-card-header">
                <div className="info-icon-wrapper orange">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h3 className="info-card-title">Opening Hours</h3>
                  <span className="info-card-tag status-open-badge">
                    <span className="pulse-dot"></span> Open Today
                  </span>
                </div>
              </div>
              <div className="info-card-body">
                <div className="hours-schedule">
                  <div className="hours-row">
                    <span>Monday – Sunday:</span>
                    <strong>11:00 AM – 11:00 PM</strong>
                  </div>
                </div>
                <p className="info-card-subtext">
                  Open daily for dine-in, takeaway & fast doorstep delivery!
                </p>
              </div>
            </div>
            <div className="info-card-footer">
              <span className="info-badge-verified">
                <i className="fas fa-motorcycle" style={{ color: 'var(--secondary-hover)' }}></i> Fast Kitchen Dispatch
              </span>
            </div>
          </div>

          {/* 3. Call For Orders Card */}
          <div className="info-card reveal reveal-delay-3" id="info-card-contact">
            <div>
              <div className="info-card-header">
                <div className="info-icon-wrapper green">
                  <i className="fas fa-phone-volume"></i>
                </div>
                <div>
                  <h3 className="info-card-title">Call For Orders</h3>
                  <span className="info-card-tag">Quick Support</span>
                </div>
              </div>
              <div className="info-card-body">
                <p className="info-card-phone">
                  <a href="tel:09886764280" className="info-phone-link">098867 64280</a>
                </p>
                <p className="info-card-subtext">
                  Call directly for counter pickups or special party bulk catering orders.
                </p>
              </div>
            </div>
            <div className="info-card-footer">
              <a href="tel:09886764280" className="info-link" style={{ color: '#059669' }}>
                <span>Call Now</span> <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          {/* 4. Guest Feedback & Rating Card */}
          <div className="info-card reveal reveal-delay-4" id="info-card-feedback">
            <div>
              <div className="info-card-header">
                <div className="info-icon-wrapper amber">
                  <i className="fas fa-star"></i>
                </div>
                <div>
                  <h3 className="info-card-title">Guest Feedback</h3>
                  <span className="rating-pill-tag">
                    <i className="fas fa-heart" style={{ color: '#DC2626' }}></i> 100% Loved
                  </span>
                </div>
              </div>
              <div className="info-card-body">
                <div className="feedback-rating-display">
                  <span className="feedback-score-num" id="infoFeedbackRating">{roundedAvg}</span>
                  <div className="feedback-stars-group">
                    <div className="feedback-stars-gold" id="infoFeedbackStarsGroup">
                      {renderStars()}
                    </div>
                    <span className="feedback-meta-note">
                      <span id="infoFeedbackReviewCount">{total}</span> Verified Reviews
                    </span>
                  </div>
                </div>
                <div className="feedback-details-list">
                  <div className="feedback-detail-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Authentic Spices & Fresh Cuts</span>
                  </div>
                  <div className="feedback-detail-item">
                    <i className="fas fa-check-circle"></i>
                    <span>100% Hygienic Kitchen Prep</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="info-card-footer">
              <span className="info-badge-verified">
                <i className="fas fa-award" style={{ color: '#F59E0B' }}></i> Top Rated in S R Nagar
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
