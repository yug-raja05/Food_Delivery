import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuthModal }) => {
  const { itemCount, subtotal, checkoutStep } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const profileDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setAuthDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setAuthDropdownOpen(false);
      }
    };

    if (authDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      if (location.pathname === '/') {
        const sectionIds = ['home', 'popular', 'menu', 'kitchen', 'about', 'feedback', 'location', 'contact'];
        const navbar = document.querySelector('.site-navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const scrollPos = window.scrollY + navbarHeight + 120;

        let current = 'home';
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && scrollPos >= el.offsetTop) {
            current = (id === 'popular' || id === 'kitchen') ? (id === 'popular' ? 'menu' : 'about') : id;
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (hash) => {
    setMobileDrawerOpen(false);
    const targetId = hash.replace('#', '');
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
    } else {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navbar = document.querySelector('.site-navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight + 2;
        window.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth'
        });
        setActiveSection(targetId);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Determine current active checkout step
  const currentStep = location.pathname === '/cart' ? 1 : (checkoutStep || 2);

  return (
    <>
      {/* Floating Ambient Glowing Blobs */}
      <div className="ambient-blob-container" aria-hidden="true">
        <div className="ambient-blob ambient-blob-1"></div>
        <div className="ambient-blob ambient-blob-2"></div>
        <div className="ambient-blob ambient-blob-3"></div>
      </div>

      {/* Top Status & Announcement Bar - Hidden on Cart & Checkout Pages */}
      {location.pathname !== '/cart' && location.pathname !== '/checkout' && (
        <div className="top-status-bar" id="topStatusBar">
          <div className="container">
            <div className="status-bar-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="status-badge-inline open-badge">
                  <span className="pulse-dot-green"></span>
                  <span>Open Now • 11:00 AM - 11:00 PM</span>
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                  Dine-In, Takeaway & Fast Delivery • Call 098867 64280
                </span>
              </div>
              <div className="top-info-links">
                <a href="tel:09886764280" className="top-link" id="top-phone-link">
                  <i className="fas fa-phone-volume"></i> 098867 64280
                </a>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                <span className="top-link">
                  <i className="fas fa-location-dot"></i> S R Nagar, Bengaluru
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header / Navigation Bar */}
      <header className={`site-navbar ${isScrolled ? 'scrolled' : ''}`} id="siteNavbar">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }} className="brand-logo" id="nav-brand-logo">
            <div className="brand-icon-box">
              <i className="fas fa-bowl-food"></i>
            </div>
            <div className="brand-text-group">
              <span className="brand-name">Zion <span>Food Corner</span></span>
              <span className="brand-badge">Fast Food & Indian Favourites</span>
            </div>
          </Link>

          {/* If on Cart / Checkout page: Show Clean Step Stepper with Full 3-Step Progression */}
          {location.pathname === '/cart' || location.pathname === '/checkout' ? (
            <div className="checkout-step-stepper" aria-label="Order progress">
              <div className={`step-node ${currentStep === 1 ? 'active' : 'completed'}`}>
                <span className="step-circle">{currentStep === 1 ? '1' : <i className="fas fa-check"></i>}</span>
                <span className="step-label">My Cart</span>
              </div>
              <div className={`step-divider-line ${currentStep >= 2 ? 'completed' : ''}`}></div>
              <div className={`step-node ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}`}>
                <span className="step-circle">{currentStep > 2 ? <i className="fas fa-check"></i> : '2'}</span>
                <span className="step-label">Delivery Details</span>
              </div>
              <div className={`step-divider-line ${currentStep >= 3 ? 'completed' : ''}`}></div>
              <div className={`step-node ${currentStep === 3 ? 'active completed' : ''}`}>
                <span className="step-circle">{currentStep === 3 ? <i className="fas fa-check"></i> : '3'}</span>
                <span className="step-label">{currentStep === 3 ? 'Order Confirmed' : 'Payment'}</span>
              </div>
            </div>
          ) : (
            /* Desktop Navigation Links for Home Page */
            <nav aria-label="Main Navigation">
              <ul className="nav-menu">
                <li>
                  <a
                    href="/#home"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
                    className={`nav-link ${location.pathname === '/' && activeSection === 'home' ? 'active' : ''}`}
                    id="nav-home"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/#menu"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#menu'); }}
                    className={`nav-link ${location.pathname === '/' && activeSection === 'menu' ? 'active' : ''}`}
                    id="nav-menu"
                  >
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="/#about"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }}
                    className={`nav-link ${location.pathname === '/' && activeSection === 'about' ? 'active' : ''}`}
                    id="nav-about"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/#feedback"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#feedback'); }}
                    className={`nav-link ${location.pathname === '/' && activeSection === 'feedback' ? 'active' : ''}`}
                    id="nav-feedback"
                  >
                    Feedback
                  </a>
                </li>
                <li>
                  <a
                    href="/#location"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#location'); }}
                    className={`nav-link ${location.pathname === '/' && activeSection === 'location' ? 'active' : ''}`}
                    id="nav-location"
                  >
                    Location
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                    className={`nav-link ${location.pathname === '/' && activeSection === 'contact' ? 'active' : ''}`}
                    id="nav-contact"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          )}

          {/* Nav Call to Action & Sign In / User Profile */}
          <div className="nav-actions">
            {(location.pathname === '/cart' || location.pathname === '/checkout') && (
              <Link to="/menu" className="btn-continue-shopping-link" id="nav-back-to-menu-btn">
                <i className="fas fa-arrow-left"></i>
                <span>Back to Menu</span>
              </Link>
            )}
            {/* User Auth Container */}
            <div id="navAuthContainer">
              {isAuthenticated && user ? (
                <div style={{ position: 'relative' }} ref={profileDropdownRef}>
                  <button
                    type="button"
                    className="nav-user-pill"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    aria-label="User Account Menu"
                  >
                    <div className="nav-user-avatar">{getInitials(user.name)}</div>
                    <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}></i>
                  </button>

                  {authDropdownOpen && (
                    <div className="user-dropdown-menu active" style={{ display: 'block' }}>
                      {/* Profile Header */}
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar-box">
                          {getInitials(user.name)}
                          <span className="profile-online-dot"></span>
                        </div>
                        <div className="profile-user-details">
                          <strong className="profile-user-name">{user.name}</strong>
                          <span className="profile-user-email">{user.email}</span>
                          <span className="profile-badge-pill"><i className="fas fa-circle-check"></i> Active Member</span>
                        </div>
                      </div>

                      {/* Dropdown Menu Links */}
                      <div className="profile-dropdown-links">
                        <Link
                          to="/cart"
                          className="profile-menu-link"
                          id="profile-nav-cart"
                          onClick={() => setAuthDropdownOpen(false)}
                        >
                          <div className="profile-icon-wrap cart-icon">
                            <i className="fas fa-bag-shopping"></i>
                          </div>
                          <div className="profile-link-text">
                            <span className="profile-link-title">My Cart</span>
                            <span className="profile-link-desc">{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</span>
                          </div>
                          {itemCount > 0 ? (
                            <span className="profile-cart-count-tag">{itemCount}</span>
                          ) : (
                            <i className="fas fa-chevron-right profile-link-chevron"></i>
                          )}
                        </Link>
                      </div>

                      {/* Profile Footer - Sign Out */}
                      <div className="profile-dropdown-footer">
                        <button
                          type="button"
                          className="profile-logout-button"
                          id="profileSignOutBtn"
                          onClick={() => {
                            logout();
                            setAuthDropdownOpen(false);
                          }}
                        >
                          <i className="fas fa-right-from-bracket"></i>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="nav-login-link"
                  id="navLoginBtn"
                  onClick={() => navigate('/login')}
                >
                  <i className="fas fa-circle-user"></i> <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Toggle Hamburger */}
            <button
              className={`mobile-toggle ${mobileDrawerOpen ? 'active' : ''}`}
              id="mobileToggle"
              aria-label="Toggle Navigation Menu"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileDrawerOpen ? 'open' : ''}`} id="mobileDrawer">
        <div className="mobile-drawer-content">
          <div className="drawer-header">
            <div className="brand-logo">
              <div className="brand-icon-box" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                <i className="fas fa-bowl-food"></i>
              </div>
              <div className="brand-text-group">
                <span className="brand-name" style={{ fontSize: '1.15rem' }}>Zion <span>Food Corner</span></span>
              </div>
            </div>
            <button
              className="modal-close-btn"
              id="closeDrawerBtn"
              aria-label="Close menu"
              style={{ position: 'static' }}
              onClick={() => setMobileDrawerOpen(false)}
            >
              <i className="fas fa-xmark"></i>
            </button>
          </div>

          <ul className="drawer-nav-list">
            <li>
              <Link
                to="/cart"
                className="drawer-nav-link"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800 }}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <span><i className="fas fa-cart-shopping" style={{ width: '24px', color: 'var(--primary)' }}></i> My Cart</span>
                <span className="cart-badge-count" style={{ position: 'static' }}>{itemCount}</span>
              </Link>
            </li>
            <li>
              <Link to="/" className="drawer-nav-link" onClick={() => setMobileDrawerOpen(false)}>
                <span><i className="fas fa-house" style={{ width: '24px', color: 'var(--primary)' }}></i> Home</span>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
              </Link>
            </li>
            <li>
              <Link to="/menu" className="drawer-nav-link" onClick={() => setMobileDrawerOpen(false)}>
                <span><i className="fas fa-book-open" style={{ width: '24px', color: 'var(--primary)' }}></i> Menu</span>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
              </Link>
            </li>
            <li>
              <a
                href="/#about"
                className="drawer-nav-link"
                onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }}
              >
                <span><i className="fas fa-circle-info" style={{ width: '24px', color: 'var(--primary)' }}></i> About</span>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
              </a>
            </li>
            <li>
              <a
                href="/#feedback"
                className="drawer-nav-link"
                onClick={(e) => { e.preventDefault(); handleNavClick('#feedback'); }}
              >
                <span><i className="fas fa-comments" style={{ width: '24px', color: 'var(--primary)' }}></i> Feedback</span>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
              </a>
            </li>
            <li>
              <a
                href="/#location"
                className="drawer-nav-link"
                onClick={(e) => { e.preventDefault(); handleNavClick('#location'); }}
              >
                <span><i className="fas fa-location-dot" style={{ width: '24px', color: 'var(--primary)' }}></i> Location</span>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="drawer-nav-link"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              >
                <span><i className="fas fa-envelope" style={{ width: '24px', color: 'var(--primary)' }}></i> Contact</span>
                <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
              </a>
            </li>
          </ul>

          <div className="drawer-actions">
            <Link to="/menu" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileDrawerOpen(false)}>
              <i className="fas fa-utensils"></i> View Menu
            </Link>
            <a href="tel:09886764280" className="btn btn-call" style={{ width: '100%' }}>
              <i className="fas fa-phone"></i> Call: 098867 64280
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
