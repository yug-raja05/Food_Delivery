import React, { useState } from 'react';
import ApiClient from '../services/api';

const RATING_LABELS = {
  1: "1 Star - Needs Improvement 😞",
  2: "2 Stars - Fair 😐",
  3: "3 Stars - Good 🙂",
  4: "4 Stars - Great! 😋",
  5: "5 Stars - Outstanding! ⭐"
};

export const FeedbackForm = ({ menuItems = [], onFeedbackSubmitted }) => {
  const [name, setName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('overall');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');

  const [nameError, setNameError] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [messageError, setMessageError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleRatingHover = (val) => setHoverRating(val);
  const handleRatingLeave = () => setHoverRating(0);
  const handleRatingClick = (val) => {
    setRating(val);
    setRatingError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError('');
    setRatingError('');
    setMessageError('');
    setAlert(null);

    let hasError = false;

    if (!name.trim() || name.trim().length < 2) {
      setNameError('Please enter your name (at least 2 characters).');
      hasError = true;
    }

    if (!rating || rating < 1 || rating > 5) {
      setRatingError('Please select a star rating (1 to 5 stars).');
      hasError = true;
    }

    if (!message.trim() || message.trim().length < 5) {
      setMessageError('Please write a feedback message (at least 5 characters).');
      hasError = true;
    } else if (message.trim().length > 500) {
      setMessageError('Message cannot exceed 500 characters.');
      hasError = true;
    }

    if (hasError) return;

    // Resolve itemName
    let resolvedItemName = "Overall Restaurant Experience";
    let resolvedItemId = null;

    if (selectedItemId !== 'overall') {
      const found = menuItems.find((i) => String(i.id || i._id) === String(selectedItemId));
      if (found) {
        resolvedItemName = found.name;
        resolvedItemId = found._id || found.id;
      }
    }

    const payload = {
      name: name.trim(),
      itemId: resolvedItemId,
      itemName: resolvedItemName,
      rating,
      message: message.trim()
    };

    setSubmitting(true);
    try {
      await ApiClient.submitFeedback(payload);
      setAlert({
        type: 'success',
        text: 'Thank you for your feedback! ❤️'
      });

      // Clear Form
      setName('');
      setSelectedItemId('overall');
      setRating(0);
      setMessage('');

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

      setTimeout(() => {
        setAlert(null);
      }, 6000);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setAlert({
        type: 'error',
        text: err.message || 'Unable to submit feedback. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating || rating;
  const ratingPreviewText = currentDisplayRating
    ? RATING_LABELS[currentDisplayRating] || `${currentDisplayRating} Stars`
    : "Select a rating";

  return (
    <div className="feedback-form-container reveal reveal-delay-2" id="feedbackFormCard">
      <div className="feedback-form-layout">
        {/* Left Side / Info Column */}
        <div className="feedback-form-side-banner">
          <div className="side-banner-badge">
            <i className="fas fa-feather-pointed"></i> Share Your Voice
          </div>
          <h3 className="side-banner-title">Rate Your Experience</h3>
          <p className="side-banner-desc">
            Your feedback helps our master chefs craft mouth-watering dishes and maintain unmatched quality!
          </p>

          <div className="side-banner-highlights">
            <div className="highlight-chip">
              <i className="fas fa-check-circle"></i> Instant live publishing
            </div>
            <div className="highlight-chip">
              <i className="fas fa-check-circle"></i> Rate specific dishes
            </div>
            <div className="highlight-chip">
              <i className="fas fa-check-circle"></i> Direct feedback to chefs
            </div>
          </div>

          <div className="side-banner-quote">
            <i className="fas fa-quote-left quote-icon"></i>
            <p>“Good food is all the sweeter when shared with good friends.”</p>
            <span>— Zion Food Corner Team</span>
          </div>
        </div>

        {/* Right Side / Form Fields */}
        <div className="feedback-form-main">
          <form id="feedbackForm" className="feedback-form" onSubmit={handleSubmit} noValidate>
            <div className="feedback-form-grid">
              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="feedbackName" className="form-label">
                  Your Full Name <span className="req-star">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <i className="fas fa-user-pen input-icon"></i>
                  <input
                    type="text"
                    id="feedbackName"
                    className={`form-input with-icon ${nameError ? 'error-border' : ''}`}
                    placeholder="e.g. Rahul Sharma"
                    maxLength={100}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    required
                  />
                </div>
                {nameError && <span className="feedback-field-error" style={{ display: 'block' }}>{nameError}</span>}
              </div>

              {/* Item Select */}
              <div className="form-group">
                <label htmlFor="feedbackItemSelect" className="form-label">
                  Dish / Experience <span className="req-star">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <i className="fas fa-bowl-rice input-icon"></i>
                  <select
                    id="feedbackItemSelect"
                    className="form-input with-icon form-select"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    <option value="overall">Overall Restaurant Experience</option>
                    {menuItems.map((item) => (
                      <option key={item.id || item._id} value={item.id || item._id}>
                        {item.name} ({item.categoryLabel || "Special"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Star Rating Picker */}
            <div className="form-group rating-picker-group">
              <label className="form-label">
                Your Rating <span className="req-star">*</span>
              </label>
              <div className="star-rating-picker-wrapper">
                <div
                  className="star-picker"
                  id="feedbackStarPicker"
                  role="radiogroup"
                  aria-label="Select star rating"
                  onMouseLeave={handleRatingLeave}
                >
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`star-btn ${val <= currentDisplayRating ? 'active' : ''}`}
                      onClick={() => handleRatingClick(val)}
                      onMouseEnter={() => handleRatingHover(val)}
                      aria-label={`${val} Star`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
                <span className="rating-label-preview" id="ratingLabelPreview">
                  {ratingPreviewText}
                </span>
              </div>
              {ratingError && <span className="feedback-field-error" style={{ display: 'block' }}>{ratingError}</span>}
            </div>

            {/* Message Area */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="feedbackMessage" className="form-label">
                  Your Review & Comments <span className="req-star">*</span>
                </label>
                <span
                  className="char-counter"
                  id="feedbackCharCounter"
                  style={{ color: message.length > 500 ? '#DC2626' : 'var(--text-muted)' }}
                >
                  {message.length} / 500
                </span>
              </div>
              <textarea
                id="feedbackMessage"
                className={`form-textarea ${messageError ? 'error-border' : ''}`}
                rows={4}
                placeholder="Share what you loved most about the food taste, spices, portions, or service..."
                maxLength={500}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (messageError) setMessageError('');
                }}
                required
              />
              {messageError && <span className="feedback-field-error" style={{ display: 'block' }}>{messageError}</span>}
            </div>

            {/* Feedback Submission Alert */}
            {alert && (
              <div className={`feedback-alert-box ${alert.type}`} style={{ display: 'flex' }}>
                <i className={`fas ${alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                <span>{alert.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg feedback-submit-btn"
              id="submitFeedbackBtn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
