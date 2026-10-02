import React from 'react';
import { Link } from 'react-router-dom';
import { useCookingModal } from '../context/CookingModalContext';

export const About = ({ stats }) => {
  const { openCookingModal } = useCookingModal();
  const avgRating = stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "5.0";

  return (
    <>
      {/* ==========================================================================
           KITCHEN HIGHLIGHTS / GALLERY
           ========================================================================== */}
      <section className="kitchen-section" id="kitchen">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag"><i className="fas fa-kitchen-set"></i> Kitchen Craft</span>
            <h2 className="section-title">From Our Kitchen</h2>
            <p className="section-subtitle">
              Every dish is cooked fresh on high heat with authentic Indian seasonings and fast-food traditions.
            </p>
          </div>

          <div className="kitchen-grid">
            {/* Gallery Item 1 */}
            <div
              className="kitchen-card reveal reveal-delay-1"
              onClick={() => openCookingModal(5)}
              style={{ cursor: 'pointer' }}
              title="Watch Wok Cooking Video"
            >
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                alt="Street wok preparation"
                className="kitchen-img"
                loading="lazy"
              />
              <div className="kitchen-overlay">
                <span className="kitchen-tag"><i className="fas fa-circle-play"></i> Wok Hei Video</span>
                <h3 className="kitchen-title">High Flame Street Cooking</h3>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div
              className="kitchen-card reveal reveal-delay-2"
              onClick={() => openCookingModal(10)}
              style={{ cursor: 'pointer' }}
              title="Watch Masala Cooking Video"
            >
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Fresh spice blends"
                className="kitchen-img"
                loading="lazy"
              />
              <div className="kitchen-overlay">
                <span className="kitchen-tag"><i className="fas fa-circle-play"></i> Simmer Video</span>
                <h3 className="kitchen-title">Traditional Indian Masalas</h3>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div
              className="kitchen-card reveal reveal-delay-3"
              onClick={() => openCookingModal(14)}
              style={{ cursor: 'pointer' }}
              title="Watch Parota Making Video"
            >
              <img
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
                alt="Golden crispy delicacies"
                className="kitchen-img"
                loading="lazy"
              />
              <div className="kitchen-overlay">
                <span className="kitchen-tag"><i className="fas fa-circle-play"></i> Tawa Video</span>
                <h3 className="kitchen-title">Fresh Parotas & Kababs</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           ABOUT SECTION
           ========================================================================== */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            {/* Left Visual Column with Floating Badge */}
            <div className="about-image-wrapper reveal">
              <div className="about-image-card">
                <img
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80"
                  alt="Zion Food Corner Ambience"
                  className="about-img"
                  loading="lazy"
                />
                <div className="about-stat-card">
                  <div className="about-stat-icon-badge">
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <strong className="stat-number" id="aboutStatRating">{avgRating} ★ Rating</strong>
                    <span className="stat-label">Top Rated Fast Food in S R Nagar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="about-content reveal reveal-delay-1">
              <div>
                <span className="section-tag"><i className="fas fa-heart" style={{ color: '#DC2626' }}></i> Our Story</span>
                <h2 className="about-title">Welcome to <span>Zion Food Corner</span></h2>
              </div>

              <p className="about-text-p">
                <strong>Zion Food Corner</strong> is a beloved local fast-food restaurant located at S R Nagar, Bengaluru. We specialize in serving delicious, freshly cooked Indian favourites including aromatic biryani, wok-tossed fried rice, noodles, chicken dishes, and vegetarian delicacies at pocket-friendly everyday prices.
              </p>
              <p className="about-text-p">
                Whether you are craving a late afternoon snack, a hearty lunch, or a quick dinner takeaway, our kitchen is always firing on high heat to deliver irresistible taste and speedy service.
              </p>

              <div className="about-features-list">
                <div className="about-feat-item">
                  <i className="fas fa-fire"></i>
                  <span>Freshly Cooked To Order</span>
                </div>
                <div className="about-feat-item">
                  <i className="fas fa-wallet"></i>
                  <span>Pocket-Friendly Prices</span>
                </div>
                <div className="about-feat-item">
                  <i className="fas fa-motorcycle"></i>
                  <span>Fast Pickup & Delivery</span>
                </div>
                <div className="about-feat-item">
                  <i className="fas fa-shield-heart"></i>
                  <span>Clean & Hygienic Kitchen</span>
                </div>
              </div>

              <div className="about-cta-row">
                <Link to="/menu" className="btn btn-primary btn-lg">
                  <i className="fas fa-utensils"></i> Explore Menu
                </Link>
                <a href="tel:09886764280" className="btn btn-outline btn-lg">
                  <i className="fas fa-phone"></i> Call 098867 64280
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
