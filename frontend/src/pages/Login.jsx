import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = ({ isModal = false, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    defaultAddress: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setError("Please enter your full name (at least 2 characters).");
        return;
      }
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 10) {
        setError("Please enter a valid 10-digit phone number.");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
    } else {
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!formData.password) {
        setError("Please enter your password.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          defaultAddress: formData.defaultAddress.trim()
        });
        showToast("Account created successfully! Welcome to Zion Food Corner! 🎉");
      } else {
        await login(formData.email.trim(), formData.password);
        showToast("Logged in successfully! 🍛");
      }

      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const authCardContent = (
    <div className="auth-card" id="authCard" style={{ maxWidth: '480px', width: '100%', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem 2.25rem', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
      {/* Auth Header */}
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="auth-icon-badge" style={{ width: '56px', height: '56px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.75rem', boxShadow: '0 4px 14px var(--primary-glow)' }}>
          <i className={isRegister ? "fas fa-user-plus" : "fas fa-user-lock"}></i>
        </div>
        <h1 className="auth-main-title" id="authMainTitle" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '0.35rem' }}>
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h1>
        <p className="auth-subtitle" id="authSubtitle" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {isRegister
            ? 'Join Zion Food Corner for instant checkout and special foodie perks'
            : 'Sign in to access your orders, saved addresses, and express checkout'}
        </p>
      </div>

      {/* Auth Tabs Bar */}
      <div className="auth-tabs-bar" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '4px', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem', gap: '4px' }}>
        <button
          type="button"
          className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
          id="tabLoginBtn"
          onClick={() => {
            setIsRegister(false);
            setError('');
          }}
          style={{
            border: 'none',
            background: !isRegister ? '#FFFFFF' : 'transparent',
            color: !isRegister ? 'var(--primary)' : 'var(--text-secondary)',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'inherit',
            fontSize: '0.92rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: !isRegister ? '0 3px 10px rgba(0, 0, 0, 0.08)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          <i className="fas fa-right-to-bracket"></i> Sign In
        </button>
        <button
          type="button"
          className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
          id="tabRegisterBtn"
          onClick={() => {
            setIsRegister(true);
            setError('');
          }}
          style={{
            border: 'none',
            background: isRegister ? '#FFFFFF' : 'transparent',
            color: isRegister ? 'var(--primary)' : 'var(--text-secondary)',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'inherit',
            fontSize: '0.92rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: isRegister ? '0 3px 10px rgba(0, 0, 0, 0.08)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          <i className="fas fa-user-plus"></i> Create Account
        </button>
      </div>

      {/* Alert Error Box */}
      {error && (
        <div className="auth-alert-box alert-error" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.85rem 1.15rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', fontWeight: 600 }}>
          <i className="fas fa-circle-exclamation" style={{ fontSize: '1.1rem', flexShrink: 0 }}></i>
          <span>{error}</span>
        </div>
      )}

      {/* Auth Form */}
      <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {isRegister && (
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <label className="form-label" htmlFor="regName" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
              Full Name <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-user auth-field-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}></i>
              <input
                type="text"
                id="regName"
                name="name"
                className="form-input auth-input"
                placeholder="e.g. Yug Raja"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ width: '100%', height: '48px', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)' }}
              />
            </div>
          </div>
        )}

        {isRegister ? (
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label className="form-label" htmlFor="regEmail" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
                Email Address <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-envelope auth-field-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}></i>
                <input
                  type="email"
                  id="regEmail"
                  name="email"
                  className="form-input auth-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', height: '48px', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label className="form-label" htmlFor="regPhone" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
                Phone Number <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-phone auth-field-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}></i>
                <input
                  type="tel"
                  id="regPhone"
                  name="phone"
                  className="form-input auth-input"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', height: '48px', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <label className="form-label" htmlFor="loginEmail" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
              Email Address <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-envelope auth-field-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}></i>
              <input
                type="email"
                id="loginEmail"
                name="email"
                className="form-input auth-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{ width: '100%', height: '48px', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)' }}
              />
            </div>
          </div>
        )}

        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <label className="form-label" htmlFor="authPassword" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
            {isRegister ? 'Create Password ' : 'Password '}
            <span style={{ color: 'var(--primary)' }}>* {isRegister && '(min 6 characters)'}</span>
          </label>
          <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-lock auth-field-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}></i>
            <input
              type={showPassword ? 'text' : 'password'}
              id="authPassword"
              name="password"
              className="form-input auth-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              style={{ width: '100%', height: '48px', paddingLeft: '2.85rem', paddingRight: '2.85rem', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)' }}
            />
            <button
              type="button"
              className="btn-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', padding: '0.35rem' }}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {isRegister && (
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <label className="form-label" htmlFor="regAddress" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-charcoal)' }}>
              Default Delivery Address (Optional)
            </label>
            <div className="auth-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-location-dot auth-field-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}></i>
              <input
                type="text"
                id="regAddress"
                name="defaultAddress"
                className="form-input auth-input"
                placeholder="Flat / House No, Street, S R Nagar"
                value={formData.defaultAddress}
                onChange={handleInputChange}
                style={{ width: '100%', height: '48px', paddingLeft: '2.85rem', paddingRight: '1rem', fontSize: '0.92rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-main)' }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-auth-submit"
          id="authSubmitBtn"
          disabled={submitting}
          style={{ width: '100%', height: '50px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)', marginTop: '0.5rem' }}
        >
          {submitting ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Please wait...</span>
            </>
          ) : (
            <>
              <span>{isRegister ? 'Create Account & Continue' : 'Sign In to Your Account'}</span>
              <i className="fas fa-arrow-right"></i>
            </>
          )}
        </button>
      </form>

      {/* Perks Box */}
      <div className="auth-perks-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-color)' }}>
        <div className="auth-perk-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <i className="fas fa-bolt" style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}></i>
          <span>1-Click Express Checkout</span>
        </div>
        <div className="auth-perk-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <i className="fas fa-tag" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
          <span>Exclusive Promo Coupons</span>
        </div>
        <div className="auth-perk-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          <i className="fas fa-shield-halved" style={{ color: '#10B981', fontSize: '1.1rem' }}></i>
          <span>100% Secure Server</span>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-backdrop open" onClick={onClose} role="dialog" aria-modal="true">
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}
          >
            <i className="fas fa-xmark"></i>
          </button>
          {authCardContent}
        </div>
      </div>
    );
  }

  return (
    <main className="auth-page-main" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      {authCardContent}
    </main>
  );
};

export default Login;
