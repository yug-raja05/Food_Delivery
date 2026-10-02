import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const FloatingCart = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const [animateBadge, setAnimateBadge] = useState(false);

  // Trigger pulse animation when item count increases
  useEffect(() => {
    if (itemCount > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 450);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  // Hide on Cart and Checkout pages or when empty
  if (itemCount === 0 || location.pathname === '/cart' || location.pathname === '/checkout' || location.pathname === '/login') {
    return null;
  }

  return (
    <aside className="floating-cart-wrapper" aria-label="Floating Shopping Cart">
      <Link
        to="/cart"
        className={`floating-cart-pill ${animateBadge ? 'pulse-bounce' : ''}`}
        id="floatingCartBtn"
      >
        {/* Cart Icon Box with Item Count Badge */}
        <div className="floating-cart-icon-box">
          <i className="fas fa-bag-shopping"></i>
          <span className="floating-cart-count" id="floatingCartCount">
            {itemCount}
          </span>
        </div>

        {/* Text Details (Clean - No Price) */}
        <div className="floating-cart-details">
          <strong className="floating-cart-label">My Cart</strong>
          <span className="floating-cart-subtext">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} ready to order
          </span>
        </div>

        {/* Action Button */}
        <div className="floating-cart-action">
          <span>View Cart</span>
          <i className="fas fa-arrow-right"></i>
        </div>
      </Link>
    </aside>
  );
};

export default FloatingCart;
