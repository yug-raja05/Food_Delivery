/**
 * Zion Food Corner - Unified Client Cart Management System
 * Stores temporary client-side cart state in localStorage
 * Source of truth for orders and final prices is verified on the backend API
 */

const CART_STORAGE_KEY = "zion_food_corner_cart";
const APPLIED_COUPON_KEY = "zion_applied_coupon";

// Local coupon fallback definitions for instant client estimation
const LOCAL_COUPONS = {
  ZION50: { code: "ZION50", discountType: "fixed", value: 50, minOrder: 150, description: "₹50 OFF on orders above ₹150" },
  WELCOME10: { code: "WELCOME10", discountType: "percent", value: 10, minOrder: 100, description: "10% OFF on all orders" },
  BIRYANI20: { code: "BIRYANI20", discountType: "fixed", value: 20, minOrder: 70, description: "₹20 OFF Biryani & Rice Special" }
};

const CartManager = {
  getCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading cart from localStorage", e);
      return [];
    }
  },

  saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("zionCartUpdated", { detail: { cart } }));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  },

  /**
   * Add item to cart with quantity
   */
  addToCart(itemOrId, quantity = 1) {
    let item = itemOrId;

    if (typeof itemOrId === "number" || typeof itemOrId === "string") {
      // Find from cached items loaded by app.js or window.ALL_MENU_ITEMS
      if (window.__ALL_MENU_ITEMS && Array.isArray(window.__ALL_MENU_ITEMS)) {
        item = window.__ALL_MENU_ITEMS.find((i) => i.id === Number(itemOrId) || i._id === itemOrId);
      }
    }

    if (!item || (!item.id && !item._id)) {
      console.error("Invalid item added to cart:", itemOrId);
      return;
    }

    const itemId = item.id || item._id;
    const qty = Math.max(1, Number(quantity) || 1);
    const cart = this.getCart();
    const existingIndex = cart.findIndex((i) => i.id === itemId || i.menuItemId === itemId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: itemId,
        menuItemId: itemId,
        name: item.name,
        price: Number(item.price) || 0,
        image: item.image || "",
        category: item.category || "",
        categoryLabel: item.categoryLabel || "",
        isVeg: !!item.isVeg,
        quantity: qty
      });
    }

    this.saveCart(cart);
    this.triggerCartButtonAlert(item, qty);
  },

  updateQuantity(itemId, newQty) {
    let cart = this.getCart();
    const q = Number(newQty);
    if (q <= 0) {
      cart = cart.filter((i) => i.id !== itemId && i.menuItemId !== itemId);
    } else {
      const target = cart.find((i) => i.id === itemId || i.menuItemId === itemId);
      if (target) target.quantity = q;
    }
    this.saveCart(cart);
  },

  removeItem(itemId) {
    const cart = this.getCart().filter((i) => i.id !== itemId && i.menuItemId !== itemId);
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
    localStorage.removeItem(APPLIED_COUPON_KEY);
  },

  getAppliedCoupon() {
    try {
      const raw = localStorage.getItem(APPLIED_COUPON_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      const code = localStorage.getItem(APPLIED_COUPON_KEY);
      return code && LOCAL_COUPONS[code] ? LOCAL_COUPONS[code] : null;
    }
  },

  /**
   * Validate and apply coupon through Backend API with graceful local fallback
   */
  async applyCoupon(code) {
    const cleanCode = code ? code.trim().toUpperCase() : "";
    const totals = this.getTotals();

    try {
      if (window.ApiClient && typeof window.ApiClient.validateCoupon === "function") {
        const response = await window.ApiClient.validateCoupon(cleanCode, totals.subtotal);
        if (response && response.success && response.data) {
          localStorage.setItem(APPLIED_COUPON_KEY, JSON.stringify(response.data));
          window.dispatchEvent(new CustomEvent("zionCartUpdated", { detail: { cart: this.getCart() } }));
          return { success: true, coupon: response.data, message: response.message };
        }
      }
    } catch (err) {
      // If backend reports an error, bubble message
      if (err && err.message) {
        return { success: false, message: err.message };
      }
    }

    // Local fallback check
    if (LOCAL_COUPONS[cleanCode]) {
      const coup = LOCAL_COUPONS[cleanCode];
      if (totals.subtotal < coup.minOrder) {
        return { success: false, message: `Minimum order of ₹${coup.minOrder} required for ${coup.code}.` };
      }
      localStorage.setItem(APPLIED_COUPON_KEY, JSON.stringify(coup));
      window.dispatchEvent(new CustomEvent("zionCartUpdated", { detail: { cart: this.getCart() } }));
      return { success: true, coupon: coup, message: "Coupon applied successfully!" };
    }

    return { success: false, message: "Invalid coupon code. Try ZION50 or WELCOME10" };
  },

  removeCoupon() {
    localStorage.removeItem(APPLIED_COUPON_KEY);
    window.dispatchEvent(new CustomEvent("zionCartUpdated", { detail: { cart: this.getCart() } }));
  },

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  },

  /**
   * Client-side estimate calculation for real-time UI rendering
   */
  getTotals() {
    const cart = this.getCart();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 250 ? 0 : 25);
    const packagingFee = subtotal === 0 ? 0 : 15;

    let discount = 0;
    const coupon = this.getAppliedCoupon();
    if (coupon && subtotal >= (coupon.minOrder || 0)) {
      if (coupon.discountType === "fixed") {
        discount = Math.min(coupon.value, subtotal);
      } else if (coupon.discountType === "percent") {
        discount = Math.round((subtotal * (coupon.value / 100)) * 100) / 100;
      }
    }

    const grandTotal = Math.max(0, subtotal + tax + deliveryFee + packagingFee - discount);

    return {
      itemCount,
      subtotal,
      tax,
      deliveryFee,
      packagingFee,
      discount,
      coupon,
      grandTotal: Math.round(grandTotal * 100) / 100,
      freeDeliveryThreshold: 250,
      freeDeliveryRemaining: Math.max(0, 250 - subtotal)
    };
  },

  updateBadges() {
    const totals = this.getTotals();

    // Update all count badges
    document.querySelectorAll(".cart-badge-count, #navCartCount, #drawerCartCount").forEach((el) => {
      el.textContent = totals.itemCount;
      if (totals.itemCount > 0) {
        el.classList.add("has-items");
        el.style.display = "flex";
      } else {
        el.classList.remove("has-items");
      }
    });

    // Update total price badges
    document.querySelectorAll(".cart-btn-total, #navCartTotal").forEach((el) => {
      el.textContent = `₹${totals.subtotal.toFixed(2)}`;
    });
  },

  triggerCartButtonAlert(item, quantity = 1) {
    this.updateBadges();

    // 1. Animate Cart buttons
    const cartButtons = document.querySelectorAll(".nav-cart-btn, #navCartBtn");
    cartButtons.forEach((btn) => {
      btn.classList.remove("cart-bump");
      void btn.offsetWidth; // trigger reflow
      btn.classList.add("cart-bump");
    });

    // 2. Show alert toast
    this.showCartAlertBadge(item, quantity);
  },

  showCartAlertBadge(item, quantity = 1) {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    document.querySelectorAll(".cart-toast-alert").forEach((t) => t.remove());

    const toast = document.createElement("div");
    toast.className = "cart-toast-alert";
    const lineTotal = (item.price * quantity).toFixed(2);
    toast.innerHTML = `
      <div class="cart-toast-icon">
        <i class="fas fa-bag-shopping"></i>
      </div>
      <div class="cart-toast-content">
        <div class="cart-toast-title">Added to Cart! ✅</div>
        <div class="cart-toast-subtitle">${quantity}x ${item.name} (₹${lineTotal})</div>
      </div>
      <a href="cart.html" class="cart-toast-action" id="toast-view-cart-btn">
        View Cart (${CartManager.getTotals().itemCount}) <i class="fas fa-arrow-right"></i>
      </a>
      <button class="cart-toast-close" onclick="this.parentElement.remove()" aria-label="Dismiss">
        <i class="fas fa-xmark"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 15);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }
};

window.CartManager = CartManager;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => CartManager.updateBadges());
} else {
  CartManager.updateBadges();
}

window.addEventListener("storage", () => CartManager.updateBadges());
