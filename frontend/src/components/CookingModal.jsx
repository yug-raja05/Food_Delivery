import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookingModal } from '../context/CookingModalContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CookingModal = () => {
  const {
    isOpen,
    activeItem,
    activeStep,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    videoRef,
    closeCookingModal,
    togglePlay,
    toggleMute,
    setStep,
    setCurrentTime,
    setDuration
  } = useCookingModal();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen || !activeItem) return null;

  const steps = activeItem.cookingSteps || [];
  const currentStepData = steps[activeStep] || steps[0] || {};
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleOrderFromModal = () => {
    if (!isAuthenticated) {
      closeCookingModal();
      showToast("Please sign in to order your food! 🔒", "info");
      navigate('/login');
      return;
    }
    addToCart(activeItem, 1);
    showToast(`Added ${activeItem.name} to cart! 🍛`);
    closeCookingModal();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  return (
    <div className="modal-backdrop open" role="dialog" aria-modal="true" onClick={closeCookingModal}>
      <div className="modal-dialog cooking-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeCookingModal} aria-label="Close video player">
          <i className="fas fa-xmark"></i>
        </button>

        {/* Realtime HD Video Player Viewport */}
        <div className="realtime-video-viewport">
          <video
            ref={videoRef}
            className="realtime-video-element"
            src={activeItem.videoUrl}
            poster={activeItem.videoPoster || activeItem.image}
            playsInline
            autoPlay
            muted={isMuted}
            loop
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
          />

          {/* Camera Live HUD Overlay */}
          <div className="video-hud-overlay">
            <div className="live-rec-badge">
              <span className="live-rec-dot"></span>
              <span>LIVE KITCHEN CAM</span>
            </div>
            <span className="video-cam-label">4K CAM-01 • S R Nagar</span>
          </div>

          {/* Video Controls Overlay */}
          <div className="video-controls-overlay">
            <div className="video-scrubber-bar">
              <div className="video-scrubber-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="video-controls-row">
              <div className="video-control-btn-group">
                <button type="button" className="vid-ctrl-btn" onClick={togglePlay} aria-label="Play or Pause Video">
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button type="button" className="vid-ctrl-btn" onClick={toggleMute} aria-label="Toggle Mute">
                  <i className={`fas ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                </button>
                <span className="video-time-display">
                  {Math.floor(currentTime)}s / {Math.floor(duration || 15)}s
                </span>
              </div>

              <div className="video-status-ticker">
                <i className="fas fa-fire"></i>
                <span>Fresh Wok Preparation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Content Column */}
        <div className="modal-body-content">
          <div className="modal-price-row">
            <div>
              <span className="section-tag" style={{ marginBottom: '0.4rem' }}>
                <i className="fas fa-fire-burner"></i> {activeItem.categoryLabel || activeItem.category || "Special Dish"}
              </span>
              <h2 className="modal-dish-title">{activeItem.name}</h2>
            </div>
            <div className="modal-dish-price">₹{Number(activeItem.price).toFixed(2)}</div>
          </div>

          {/* Key Ingredients Chips */}
          {activeItem.ingredients && activeItem.ingredients.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--dark-charcoal)', marginBottom: '0.5rem' }}>
                <i className="fas fa-leaf" style={{ color: 'var(--veg-color)' }}></i> Key Seasonings & Ingredients:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {activeItem.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span>{ing.icon}</span> {ing.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Step Nodes & Card */}
          {steps.length > 0 && (
            <div>
              <div className="cooking-timeline-bar">
                <div className="cooking-timeline-line"></div>
                <div
                  className="cooking-timeline-progress"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 80}%` }}
                ></div>
                {steps.map((stepItem, idx) => (
                  <div
                    key={idx}
                    className={`timeline-step-node ${idx === activeStep ? 'active' : idx < activeStep ? 'completed' : ''}`}
                    onClick={() => setStep(idx)}
                    title={stepItem.title}
                  >
                    {idx < activeStep ? <i className="fas fa-check" style={{ fontSize: '0.75rem' }}></i> : idx + 1}
                  </div>
                ))}
              </div>

              <div className="cooking-step-card">
                <div className="step-card-header">
                  <h3 className="step-card-title">{currentStepData.title}</h3>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                    Step {activeStep + 1} of {steps.length}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 0.5rem' }}>
                  {currentStepData.desc}
                </p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dark-charcoal)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fas fa-utensils" style={{ color: 'var(--secondary-hover)' }}></i> {currentStepData.actionText}
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div>
            <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleOrderFromModal}>
              <i className="fas fa-bag-shopping"></i> Order {activeItem.name} • ₹{Number(activeItem.price).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingModal;
