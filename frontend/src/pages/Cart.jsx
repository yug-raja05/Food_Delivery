import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { DEFAULT_COUPONS, FALLBACK_MENU_ITEMS } from '../data/constants';

// Curated Popular Add-ons to pair with orders
const RECOMMENDED_ADDONS = [
  {
    id: 'addon-1',
    name: 'Thums Up Can (300ml)',
    price: 40,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    tag: 'Chilled Drink'
  },
  {
    id: 'addon-2',
    name: 'Butter Naan (1 pc)',
    price: 40,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    tag: 'Fresh Tandoor'
  },
  {
    id: 'addon-3',
    name: 'Hot Gulab Jamun (2 Pcs)',
    price: 50,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=400&q=80',
    tag: 'Sweet Dessert'
  },
  {
    id: 'addon-4',
    name: 'Crispy Chicken Kabab (4 Pcs)',
    price: 90,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
    tag: 'Chef Choice'
  }
];

const TIP_OPTIONS = [
  { label: '₹10', value: 10, icon: '😊' },
  { label: '₹20', value: 20, icon: '⭐' },
  { label: '₹30', value: 30, icon: '💖' },
  { label: '₹50', value: 50, icon: '🚀' }
];

export const Cart = () => {
  const {
    cartItems,
    appliedCoupon,
    itemCount,
    subtotal,
    gst,
    deliveryFee,
    packagingFee,
    discount,
    deliveryTip,
    setDeliveryTip,
    grandTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [cookingNotes, setCookingNotes] = useState({});
  const [openNoteItemId, setOpenNoteItemId] = useState(null);
  const [noContactDelivery, setNoContactDelivery] = useState(false);
  const [optOutCutlery, setOptOutCutlery] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const freeDeliveryThreshold = 250;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = async (codeToApply) => {
    const targetCode = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!targetCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await applyCoupon(targetCode);
      showToast(`Coupon ${targetCode} applied! 🎉`);
      setCouponCodeInput('');
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Coupon removed.');
  };

  const handleAddAddon = (addon) => {
    addToCart({
      id: addon.id,
      name: addon.name,
      price: addon.price,
      image: addon.image,
      isVeg: addon.isVeg,
      category: 'addons'
    }, 1);
    showToast(`Added ${addon.name} to cart! 🍽️`);
  };

  const handleSaveNote = (itemId, note) => {
    setCookingNotes((prev) => ({
      ...prev,
      [itemId]: note
    }));
    setOpenNoteItemId(null);
    if (note.trim()) {
      showToast('Cooking preference saved! 👨‍🍳');
    }
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <main className="cart-page-main">
        <div className="container" style={{ padding: '3.5rem 1rem 5rem', minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="cart-empty-premium-card">
            <div className="cart-empty-visual-icon">
              <span className="cart-empty-emoji">🍲</span>
              <div className="cart-empty-sparkle-dot s1">✨</div>
              <div className="cart-empty-sparkle-dot s2">🔥</div>
            </div>

            <h1 className="cart-empty-heading">Your Food Cart is Empty</h1>
            <p className="cart-empty-subtext">
              Good food is always cooking at Zion Food Corner! Explore our royal Biryanis, hot Wok Noodles, crispy Fried Rice, and juicy Chicken specials.
            </p>

            <div className="cart-empty-actions-row">
              <Link to="/#menu" className="btn btn-primary btn-lg">
                <i className="fas fa-utensils"></i> Explore Full Menu
              </Link>
              <Link to="/#popular" className="btn btn-outline btn-lg">
                <i className="fas fa-fire"></i> Today's Specials
              </Link>
            </div>
          </div>

          {/* Quick recommendations grid on empty cart */}
          <div className="empty-cart-bestsellers-section">
            <h3 className="empty-bestsellers-title">
              <i className="fas fa-star" style={{ color: '#F59E0B' }}></i> Popular Dishes You Might Crave
            </h3>
            <div className="empty-bestsellers-grid">
              {FALLBACK_MENU_ITEMS.slice(0, 3).map((dish) => (
                <div key={dish.id} className="empty-bestseller-card">
                  <img src={dish.image} alt={dish.name} className="bestseller-img" />
                  <div className="bestseller-info">
                    <div className="bestseller-title-row">
                      <span className={`diet-symbol ${dish.isVeg ? 'veg' : 'nonveg'}`}></span>
                      <strong className="bestseller-name">{dish.name}</strong>
                    </div>
                    <span className="bestseller-price">₹{dish.price}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      addToCart(dish, 1);
                      showToast(`Added ${dish.name} to cart! 😋`);
                    }}
                  >
                    <i className="fas fa-plus"></i> Add
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page-main">
      <div className="container" style={{ padding: '2.5rem 1rem 5rem' }}>

        {/* Top Header Row */}
        <div className="cart-header-title-row">
          <div>
            <div className="cart-breadcrumb-tag">
              <i className="fas fa-bag-shopping"></i> Review Your Order
            </div>
            <h1 className="cart-page-heading">
              My Food Cart <span className="cart-items-count-pill">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </h1>
          </div>
          
          <div className="cart-header-actions-group">
            <button
              type="button"
              className="btn-clear-cart-interactive"
              onClick={() => setShowClearConfirm(true)}
              title="Clear all items in cart"
            >
              <i className="fas fa-trash-can"></i> Clear Cart
            </button>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        {showClearConfirm && (
          <div className="cart-modal-backdrop" onClick={() => setShowClearConfirm(false)}>
            <div className="cart-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon-box">
                <i className="fas fa-trash-can"></i>
              </div>
              <h3>Clear Food Cart?</h3>
              <p>Are you sure you want to remove all {itemCount} items from your cart?</p>
              <div className="confirm-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: '#DC2626', borderColor: '#DC2626' }}
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                    showToast('Cart cleared.');
                  }}
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="cart-layout-grid">
          
          {/* Left Column: Items & Addons & Delivery Preferences */}
          <div className="cart-items-column">

            {/* Free Delivery Milestone Progress */}
            <div className={`delivery-milestone-banner ${amountToFreeDelivery === 0 ? 'milestone-unlocked' : ''}`}>
              <div className="milestone-text-row">
                <div className="milestone-lead">
                  <span className="milestone-icon-badge">
                    <i className="fas fa-motorcycle"></i>
                  </span>
                  <span>
                    {amountToFreeDelivery > 0 ? (
                      <>
                        Add items worth <strong style={{ color: '#D9381E' }}>₹{amountToFreeDelivery.toFixed(0)}</strong> more for <strong>FREE Delivery!</strong>
                      </>
                    ) : (
                      <>
                        🎉 <strong>Awesome! You've unlocked FREE Home Delivery!</strong>
                      </>
                    )}
                  </span>
                </div>
                <span className="milestone-percent-tag">{freeDeliveryPercent}%</span>
              </div>
              <div className="milestone-progress-track">
                <div
                  className="milestone-progress-fill"
                  style={{ width: `${freeDeliveryPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-cards-container">
              {cartItems.map((item) => {
                const itemId = item.id || item._id;
                const itemTotal = Number(item.price) * (Number(item.quantity) || 1);
                const hasNote = cookingNotes[itemId];
                const isEditingNote = openNoteItemId === itemId;

                return (
                  <div key={itemId} className="cart-item-card-modern">
                    <div className="cart-item-main-row">
                      {/* Item Thumbnail */}
                      <div className="cart-item-thumb-wrapper">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      </div>

                      {/* Item Meta */}
                      <div className="cart-item-details-box">
                        <div className="cart-item-name-group">
                          <span className={`diet-symbol ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
                          <h2 className="cart-item-title">{item.name}</h2>
                        </div>
                        <div className="cart-item-unit-price">
                          ₹{Number(item.price).toFixed(0)} per portion
                        </div>

                        {/* Cooking Note indicator if saved */}
                        {hasNote && !isEditingNote && (
                          <div className="cart-item-saved-note-pill">
                            <i className="fas fa-pen-nib"></i> "{hasNote}"
                            <button
                              type="button"
                              className="btn-note-edit"
                              onClick={() => setOpenNoteItemId(itemId)}
                              title="Edit cooking instructions"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Interactive Stepper */}
                      <div className="cart-stepper-control">
                        <button
                          type="button"
                          className="cart-stepper-btn minus"
                          onClick={() => updateQuantity(itemId, -1)}
                          aria-label="Decrease quantity"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="cart-stepper-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-stepper-btn plus"
                          onClick={() => updateQuantity(itemId, 1)}
                          aria-label="Increase quantity"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      {/* Item Calculated Total */}
                      <div className="cart-item-price-display">
                        ₹{itemTotal.toFixed(0)}
                      </div>

                      {/* Trash Button */}
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => {
                          removeFromCart(itemId);
                          showToast(`Removed ${item.name} from cart.`);
                        }}
                        title="Remove dish"
                        aria-label="Remove dish"
                      >
                        <i className="fas fa-trash-can"></i>
                      </button>
                    </div>

                    {/* Expandable Cooking Instructions Note */}
                    {!hasNote && !isEditingNote && (
                      <div className="cart-item-note-action-row">
                        <button
                          type="button"
                          className="btn-add-cooking-note"
                          onClick={() => setOpenNoteItemId(itemId)}
                        >
                          <i className="fas fa-plus"></i> Add cooking instructions (e.g. Less spicy, Extra sauce)
                        </button>
                      </div>
                    )}

                    {isEditingNote && (
                      <div className="cart-item-note-editor">
                        <input
                          type="text"
                          className="cooking-note-input"
                          placeholder="e.g., Less spicy, no onions, keep sauce separate..."
                          defaultValue={cookingNotes[itemId] || ''}
                          id={`note-input-${itemId}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveNote(itemId, e.target.value);
                            }
                          }}
                          autoFocus
                        />
                        <div className="note-editor-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => setOpenNoteItemId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              const inputEl = document.getElementById(`note-input-${itemId}`);
                              handleSaveNote(itemId, inputEl ? inputEl.value : '');
                            }}
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Add More Dishes Banner */}
            <div className="add-more-dishes-banner">
              <div>
                <strong>Want to add more flavours?</strong>
                <p>Browse our complete freshly cooked menu for more curries & starters.</p>
              </div>
              <Link to="/#menu" className="btn btn-outline btn-sm">
                <i className="fas fa-plus"></i> Explore Menu
              </Link>
            </div>

            {/* Frequently Ordered Together Addons */}
            <div className="cart-addons-section">
              <div className="addons-section-header">
                <div>
                  <h3 className="addons-title">
                    <i className="fas fa-sparkles" style={{ color: '#F59E0B' }}></i> Frequently Ordered Together
                  </h3>
                  <p className="addons-subtitle">Complete your meal with fresh drinks & tandoor sides</p>
                </div>
              </div>

              <div className="cart-addons-grid">
                {RECOMMENDED_ADDONS.map((addon) => {
                  const isInCart = cartItems.some((ci) => (ci.id || ci._id) === addon.id);

                  return (
                    <div key={addon.id} className="addon-card">
                      <div className="addon-thumb-box">
                        <img src={addon.image} alt={addon.name} className="addon-img" />
                        <span className="addon-tag-badge">{addon.tag}</span>
                      </div>
                      <div className="addon-details">
                        <div className="addon-title-row">
                          <span className={`diet-symbol ${addon.isVeg ? 'veg' : 'nonveg'}`}></span>
                          <span className="addon-name">{addon.name}</span>
                        </div>
                        <div className="addon-price-action-row">
                          <span className="addon-price">₹{addon.price}</span>
                          <button
                            type="button"
                            className={`btn-addon-add ${isInCart ? 'added' : ''}`}
                            onClick={() => handleAddAddon(addon)}
                          >
                            {isInCart ? (
                              <>
                                <i className="fas fa-check"></i> Added
                              </>
                            ) : (
                              <>
                                <i className="fas fa-plus"></i> ADD
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Partner Tip Selection */}
            <div className="delivery-tip-card">
              <div className="delivery-tip-header">
                <div className="tip-header-icon">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <div>
                  <strong className="tip-title">Say thanks to your Delivery Hero</strong>
                  <p className="tip-desc">100% of your tip goes directly to your delivery partner.</p>
                </div>
              </div>

              <div className="tip-chips-row">
                {TIP_OPTIONS.map((tip) => (
                  <button
                    key={tip.value}
                    type="button"
                    className={`tip-chip-btn ${deliveryTip === tip.value ? 'selected' : ''}`}
                    onClick={() => {
                      if (deliveryTip === tip.value) {
                        setDeliveryTip(0);
                        showToast('Tip removed.');
                      } else {
                        setDeliveryTip(tip.value);
                        showToast(`₹${tip.value} tip added! Delivery partner thanks you ❤️`);
                      }
                    }}
                  >
                    <span className="tip-chip-emoji">{tip.icon}</span>
                    <span className="tip-chip-val">{tip.label}</span>
                  </button>
                ))}

                {deliveryTip > 0 && (
                  <button
                    type="button"
                    className="tip-chip-clear"
                    onClick={() => {
                      setDeliveryTip(0);
                      showToast('Tip removed.');
                    }}
                  >
                    Clear Tip
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Preferences Checkboxes */}
            <div className="delivery-preferences-card">
              <label className="pref-checkbox-row">
                <input
                  type="checkbox"
                  checked={optOutCutlery}
                  onChange={(e) => setOptOutCutlery(e.target.checked)}
                />
                <div className="pref-label-box">
                  <strong>🌱 Don't send cutlery, straws & tissues</strong>
                  <span>Help us reduce plastic waste. Save trees and protect the environment!</span>
                </div>
              </label>

              <div className="pref-divider"></div>

              <label className="pref-checkbox-row">
                <input
                  type="checkbox"
                  checked={noContactDelivery}
                  onChange={(e) => setNoContactDelivery(e.target.checked)}
                />
                <div className="pref-label-box">
                  <strong>🚪 Contactless Delivery</strong>
                  <span>Our delivery rider will ring your bell and leave the package at your door.</span>
                </div>
              </label>
            </div>

          </div>

          {/* Right Column: Order Summary, Coupons & Smart Bill Receipt */}
          <div className="cart-summary-column">

            {/* Coupon Code Section */}
            <div className="cart-coupon-card-modern">
              <div className="coupon-header-title">
                <i className="fas fa-ticket-simple" style={{ color: '#F59E0B' }}></i>
                <span>Coupons & Offers</span>
              </div>

              {appliedCoupon ? (
                <div className="applied-coupon-success-box">
                  <div className="applied-coupon-left">
                    <div className="applied-coupon-code">
                      <i className="fas fa-circle-check"></i> {appliedCoupon.code}
                    </div>
                    <div className="applied-coupon-desc">
                      {appliedCoupon.description} (Saved ₹{discount.toFixed(0)})
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-coupon"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="ENTER PROMO CODE"
                      value={couponCodeInput}
                      onChange={(e) => {
                        setCouponCodeInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon(couponCodeInput);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn-apply-coupon"
                      onClick={() => handleApplyCoupon(couponCodeInput)}
                      disabled={couponLoading || !couponCodeInput.trim()}
                    >
                      {couponLoading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Apply'}
                    </button>
                  </div>

                  {couponError && (
                    <div className="coupon-error-banner">
                      <i className="fas fa-circle-exclamation"></i> {couponError}
                    </div>
                  )}

                  {/* Available Coupon Cards */}
                  <div className="available-coupons-list">
                    <span className="avail-coupons-label">Available Offers:</span>
                    {DEFAULT_COUPONS.map((cp) => (
                      <div
                        key={cp.code}
                        className="available-coupon-chip"
                        onClick={() => handleApplyCoupon(cp.code)}
                      >
                        <div className="coupon-chip-left">
                          <span className="coupon-chip-tag">{cp.code}</span>
                          <span className="coupon-chip-text">{cp.description}</span>
                        </div>
                        <span className="coupon-chip-action">APPLY</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Smart Bill Details Receipt */}
            <div className="cart-bill-card-modern">
              <div className="bill-receipt-header">
                <h2 className="bill-receipt-title">
                  <i className="fas fa-receipt" style={{ color: 'var(--primary)' }}></i> Bill Summary
                </h2>
                <span className="bill-receipt-count">{itemCount} items</span>
              </div>

              <div className="bill-breakdown-list">
                <div className="bill-row">
                  <span className="bill-label">Item Total</span>
                  <span className="bill-value">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="bill-row discount-row">
                    <span className="bill-label">
                      <i className="fas fa-tag"></i> Coupon Discount ({appliedCoupon?.code})
                    </span>
                    <span className="bill-value green">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="bill-row">
                  <span className="bill-label">
                    GST & Gov Taxes (5%)
                  </span>
                  <span className="bill-value">₹{gst.toFixed(2)}</span>
                </div>

                <div className="bill-row">
                  <span className="bill-label">Restaurant Packaging</span>
                  <span className="bill-value">₹{packagingFee.toFixed(2)}</span>
                </div>

                <div className="bill-row">
                  <span className="bill-label">
                    Delivery Fee {subtotal >= freeDeliveryThreshold && <span className="free-badge">FREE</span>}
                  </span>
                  <span className="bill-value">
                    {deliveryFee === 0 ? (
                      <span className="green font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {deliveryTip > 0 && (
                  <div className="bill-row tip-row">
                    <span className="bill-label">
                      ❤️ Delivery Partner Tip
                    </span>
                    <span className="bill-value">₹{deliveryTip.toFixed(2)}</span>
                  </div>
                )}

                {/* Savings Callout Banner if discount or free delivery */}
                {(discount > 0 || deliveryFee === 0) && (
                  <div className="order-savings-callout">
                    <i className="fas fa-circle-check"></i>
                    <span>
                      You saved <strong>₹{(discount + (subtotal >= freeDeliveryThreshold ? 25 : 0)).toFixed(0)}</strong> on this order!
                    </span>
                  </div>
                )}

                <div className="bill-divider"></div>

                <div className="bill-row total-row">
                  <div>
                    <span className="total-label">Grand Total</span>
                    <div className="total-tax-inclusive">Inclusive of all taxes</div>
                  </div>
                  <span className="total-value">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Checkout CTA */}
              <button
                type="button"
                className="btn-proceed-checkout"
                id="btnProceedToCheckout"
                onClick={() => navigate('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <span className="btn-cta-price">₹{grandTotal.toFixed(2)} <i className="fas fa-arrow-right"></i></span>
              </button>

              {/* Trust Badges */}
              <div className="cart-trust-badges">
                <div className="trust-badge-item">
                  <i className="fas fa-shield-halved"></i>
                  <span>100% Safe Payments</span>
                </div>
                <div className="trust-badge-item">
                  <i className="fas fa-kitchen-set"></i>
                  <span>Hygienic Preparation</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Cart;
