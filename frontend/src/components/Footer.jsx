import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = ({ stats }) => {
  const avg = stats?.averageRating !== undefined ? Number(stats.averageRating) : 5.0;
  const roundedAvg = avg.toFixed(1);
  const total = stats?.totalFeedback !== undefined ? stats.totalFeedback : 3;

  const fullStars = Math.floor(avg);
  const hasHalf = avg - fullStars >= 0.4;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-column">
            <div className="footer-logo">
              <div className="brand-icon-box">
                <i className="fas fa-bowl-food"></i>
              </div>
              <div className="brand-text-group">
                <span className="brand-name">Zion <span>Food Corner</span></span>
                <span className="brand-badge" style={{ color: '#9CA3AF' }}>Fast Food & Indian Favourites</span>
              </div>
            </div>
            <p className="footer-tagline">
              Delicious Food at Affordable Prices
            </p>
            <p className="footer-desc">
              Enjoy freshly cooked biryani, fried rice, noodles, chicken dishes, and popular Indian favourites prepared fresh every single day in S R Nagar, Bengaluru.
            </p>
            <div>
              <span className="footer-status-pill open">
                <span className="pulse-dot"></span> Open Today: 11:00 AM – 11:00 PM
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="footer-column-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}></i> Home
                </Link>
              </li>
              <li>
                <Link to="/menu">
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}></i> Our Menu
                </Link>
              </li>
              <li>
                <a href="/#about">
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}></i> About Us
                </a>
              </li>
              <li>
                <a href="/#feedback">
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}></i> Customer Reviews
                </a>
              </li>
              <li>
                <a href="/#location">
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}></i> Store Location
                </a>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}></i> My Cart & Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours Info with Dynamic Rating */}
          <div>
            <h4 className="footer-column-title">Contact & Location</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <i className="fas fa-location-dot"></i>
                <div>
                  <strong>Address:</strong><br />
                  45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru 560027
                </div>
              </div>

              <div className="footer-contact-item">
                <i className="fas fa-phone-volume"></i>
                <div>
                  <strong>Phone:</strong><br />
                  <a href="tel:09886764280" style={{ color: '#FFFFFF', fontWeight: 800 }}>098867 64280</a>
                </div>
              </div>

              <div className="footer-contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <strong>Hours:</strong><br />
                  Monday – Sunday: 11:00 AM – 11:00 PM
                </div>
              </div>

              <div className="footer-contact-item">
                <i className="fas fa-star" style={{ color: '#F59E0B' }}></i>
                <div>
                  <strong>Customer Rating:</strong><br />
                  <span id="footerFeedbackRating" style={{ color: '#F59E0B', fontWeight: 800 }}>
                    {roundedAvg} / 5.0 ★
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: '0.4rem' }}>
                    ({total} Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Zion Food Corner. All rights reserved.</p>
          <p>Full-Stack Restaurant Ordering System &bull; S R Nagar, Bengaluru, Karnataka</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
