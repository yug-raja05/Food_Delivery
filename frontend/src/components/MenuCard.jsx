import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCookingModal } from '../context/CookingModalContext';

export const MenuCard = ({ item, itemRating }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { openCookingModal } = useCookingModal();
  const navigate = useNavigate();

  const [localQty, setLocalQty] = useState(1);

  const itemId = item.id || item._id;
  const currentCartQty = getItemQuantity(itemId);

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast("Please sign in to order your food! 🔒", "info");
      navigate('/login');
      return;
    }
    if (currentCartQty > 0) {
      updateQuantity(itemId, 1);
    } else {
      setLocalQty((prev) => prev + 1);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast("Please sign in to order your food! 🔒", "info");
      navigate('/login');
      return;
    }
    if (currentCartQty > 0) {
      updateQuantity(itemId, -1);
    } else {
      setLocalQty((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast("Please sign in to order your food! 🔒", "info");
      navigate('/login');
      return;
    }
    const qty = currentCartQty > 0 ? 1 : localQty;
    addToCart(item, qty);
    showToast(`Added ${item.name} to cart! 🍛`);
  };

  // Rating badge info
  const ratingAvg = itemRating?.averageRating ? Number(itemRating.averageRating).toFixed(1) : null;
  const ratingCount = itemRating?.totalReviews || 0;

  return (
    <div
      className="menu-card"
      data-category={item.category}
      onClick={() => openCookingModal(item)}
      style={{ cursor: 'pointer' }}
    >
      {/* Media Header with Realtime Video Play Hint */}
      <div className="menu-card-img-container">
        <img
          src={item.image}
          alt={item.name}
          className="menu-card-img"
          loading="lazy"
        />

        {/* Category Badge */}
        <span className="menu-card-category-badge">
          {item.categoryLabel || item.category || 'Special Dish'}
        </span>

        {/* Veg / Non-Veg Indicator */}
        <div className="menu-card-diet-badge">
          <span className={`diet-icon-symbol ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
        </div>

        {/* Popular Tag */}
        {item.isPopular && (
          <div className="popular-badge">
            <i className="fas fa-fire"></i> Popular
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="menu-card-body" onClick={(e) => e.stopPropagation()}>
        <div>
          <div className="menu-card-header-row">
            <h3 className="menu-card-name">{item.name}</h3>
            <div className="menu-card-price-pill">₹{Number(item.price).toFixed(0)}</div>
          </div>

          {/* Dynamic Item Rating & Review Badge */}
          {ratingAvg ? (
            <div className="menu-card-rating-row" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.35rem 0', fontSize: '0.8rem', color: '#D97706', fontWeight: 700 }}>
              <i className="fas fa-star" style={{ color: '#F59E0B' }}></i>
              <span>{ratingAvg} ★</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({ratingCount})</span>
            </div>
          ) : (
            <div className="menu-card-category-tag" style={{ margin: '0.35rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-tag"></i> {item.categoryLabel || "Special Dish"}
            </div>
          )}

          <p className="menu-card-desc">{item.description}</p>
        </div>

        {/* Action Controls Footer */}
        <div className="menu-card-actions-bar">
          {/* Stepper */}
          <div className="card-qty-control">
            <button
              type="button"
              className="card-qty-btn"
              onClick={handleDecrement}
              aria-label="Decrease Quantity"
            >
              -
            </button>
            <span className="card-qty-val">
              {currentCartQty > 0 ? currentCartQty : localQty}
            </span>
            <button
              type="button"
              className="card-qty-btn"
              onClick={handleIncrement}
              aria-label="Increase Quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            className="btn-card-action btn-card-order"
            onClick={handleAddToCart}
          >
            <i className="fas fa-cart-plus"></i>
            <span>{currentCartQty > 0 ? 'Add More' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
