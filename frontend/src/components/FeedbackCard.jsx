import React from 'react';

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? "min" : "mins"} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    return past.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recently";
  }
}

export const FeedbackCard = ({ feedback }) => {
  if (!feedback) return null;

  const initial = (feedback.name || "Customer").trim().charAt(0).toUpperCase();
  const rating = Number(feedback.rating) || 5;
  const itemBadgeText = feedback.itemName || "Overall Restaurant Experience";
  const timeAgo = formatTimeAgo(feedback.createdAt);

  return (
    <div className="feedback-card" id="activeFeedbackCard">
      <i className="fas fa-quote-right feedback-card-quote-icon"></i>

      <div className="feedback-card-header">
        <div className="feedback-card-stars" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={i < rating ? "fas fa-star" : "far fa-star"}></i>
          ))}
        </div>
        <span className="feedback-item-pill">
          <i className="fas fa-utensils"></i> {itemBadgeText} &bull; {rating}.0 ★
        </span>
      </div>

      <p className="feedback-card-message">
        "{feedback.message}"
      </p>

      <div className="feedback-card-footer">
        <div className="feedback-author-group">
          <div className="feedback-avatar-circle">{initial}</div>
          <div>
            <div className="feedback-author-name">
              {feedback.name}
              <i className="fas fa-circle-check feedback-verified-badge" title="Verified Customer"></i>
            </div>
            <span className="feedback-timestamp">{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
