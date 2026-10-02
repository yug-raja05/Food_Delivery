import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import ApiClient from '../services/api';

export const Location = ({ stats: propStats }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [internalStats, setInternalStats] = useState(null);

  useEffect(() => {
    if (!propStats) {
      ApiClient.getFeedbackStats()
        .then((res) => {
          if (res?.data) {
            setInternalStats(res.data);
          }
        })
        .catch((err) => console.warn('Could not auto-fetch location rating stats:', err));
    }
  }, [propStats]);

  const activeStats = propStats || internalStats;
  const avgRating = activeStats?.averageRating !== undefined 
    ? Number(activeStats.averageRating).toFixed(1) 
    : "5.0";

  const fullAddress = "45, 4th Main Rd, Corporation, Ashwath Nagar, Sampangi Rama Nagara, S R Nagar, Bengaluru, Karnataka 560027";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    showToast("📍 Restaurant address copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="location-section" id="location">
      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal">
          <span className="section-tag">
            <i className="fas fa-location-dot" style={{ color: '#EF4444' }}></i> Visit Our Kitchen
          </span>
          <h2 className="section-title">Find Us in S R Nagar, Bengaluru</h2>
          <p className="section-subtitle">
            Experience piping hot biryani, crispy kababs, and fast food straight from our kitchen or order for instant takeaway & delivery.
          </p>
        </div>

        <div className="location-grid-premium">
          {/* Left: Rich Location Info Card */}
          <div className="location-card-premium reveal reveal-delay-1">
            {/* Live Status Header */}
            <div className="location-card-header">
              <div className="location-status-pill open">
                <span className="live-pulse-dot"></span>
                <span>Open Now • 11:00 AM – 11:00 PM</span>
              </div>
              <div className="location-rating-badge">
                <i className="fas fa-star" style={{ color: '#F59E0B' }}></i> {avgRating} Star Rated
              </div>
            </div>

            {/* Restaurant Title & Icon */}
            <div className="location-brand-header">
              <div className="location-brand-icon-box">
                <i className="fas fa-bowl-food"></i>
              </div>
              <div className="location-heading-group">
                <h3 className="location-store-name">Zion Food Corner</h3>
                <p className="location-store-tagline">
                  Fast Food & Authentic Indian Delicacies
                </p>
              </div>
            </div>

            {/* Address Box with Red Location Pin & Copy Feature */}
            <div className="location-address-box">
              <div className="address-icon-wrap red-pin">
                <i className="fas fa-location-dot" style={{ color: '#EF4444', fontSize: '1.2rem' }}></i>
              </div>
              <div className="address-content-wrap">
                <span className="address-label">Store Address</span>
                <p className="address-full-text">{fullAddress}</p>
              </div>
              <button
                type="button"
                className={`copy-address-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyAddress}
                title="Copy Address to Clipboard"
                aria-label="Copy Address"
              >
                <i className={copied ? "fas fa-check" : "fas fa-copy"}></i>
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Feature Highlights (2x2 Grid) */}
            <div className="location-features-grid">
              <div className="loc-feat-item">
                <div className="loc-feat-icon blue">
                  <i className="fas fa-building-flag"></i>
                </div>
                <div className="loc-feat-text">
                  <strong>Landmark</strong>
                  <span>Near Corporation Officers Quarters</span>
                </div>
              </div>

              <div className="loc-feat-item">
                <div className="loc-feat-icon green">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="loc-feat-text">
                  <strong>Working Hours</strong>
                  <span>Open Daily (11:00 AM – 11:00 PM)</span>
                </div>
              </div>

              <div className="loc-feat-item">
                <div className="loc-feat-icon purple">
                  <i className="fas fa-motorcycle"></i>
                </div>
                <div className="loc-feat-text">
                  <strong>Delivery Radius</strong>
                  <span>Fast delivery within 5 km radius</span>
                </div>
              </div>

              <div className="loc-feat-item">
                <div className="loc-feat-icon amber">
                  <i className="fas fa-phone-volume"></i>
                </div>
                <div className="loc-feat-text">
                  <strong>Store Hotline</strong>
                  <span><a href="tel:09886764280">098867 64280</a></span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Directions & Call - WhatsApp removed) */}
            <div className="location-cta-row">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                id="get-directions-btn"
              >
                <i className="fas fa-diamond-turn-right"></i> Get Live Directions
              </a>

              <a href="tel:09886764280" className="btn btn-outline btn-lg" id="location-call-btn">
                <i className="fas fa-phone"></i> Call Kitchen
              </a>
            </div>
          </div>

          {/* Right: Modern Map Wrapper with Red Location Pin & ZION FOOD CORNER Tag */}
          <div className="map-premium-wrapper reveal reveal-delay-2">
            {/* Top-Left Google Maps Quick Action */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Zion+Food+Corner+45+4th+Main+Rd+Corporation+Ashwath+Nagar+Sampangi+Rama+Nagara+S+R+Nagar+Bengaluru+Karnataka+560027"
              target="_blank"
              rel="noopener noreferrer"
              className="map-open-btn"
              title="Open in Google Maps"
              id="map-open-external-btn"
            >
              <span>Maps</span>
              <i className="fas fa-arrow-up-right-from-square"></i>
            </a>

            {/* Embedded Google Map */}
            <iframe
              src="https://maps.google.com/maps?q=ZION+FOOD+CORNER,+45,+4th+Main+Rd,+Corporation,+Ashwath+Nagar,+Sampangi+Rama+Nagara,+Bengaluru,+Karnataka+560027&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="google-map-iframe-premium"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zion Food Corner Live Location Map"
            />

            <div className="map-bottom-strip">
              <i className="fas fa-location-dot" style={{ color: '#EF4444' }}></i>
              <span>Live Pin: 45, 4th Main Rd, S R Nagar, Bengaluru 560027</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
