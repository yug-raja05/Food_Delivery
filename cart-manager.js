// Zion Food Corner - Unified Cart State & Management System

const CART_STORAGE_KEY = "zion_food_corner_cart";
const APPLIED_COUPON_KEY = "zion_applied_coupon";

const PROMO_COUPONS = {
  ZION50: { code: "ZION50", discountType: "fixed", value: 50, minOrder: 150, desc: "₹50 OFF on orders above ₹150" },
  WELCOME10: { code: "WELCOME10", discountType: "percent", value: 10, minOrder: 100, desc: "10% OFF on all orders" },
  BIRYANI20: { code: "BIRYANI20", discountType: "fixed", value: 20, minOrder: 70, desc: "₹20 OFF Biryani & Rice Special" }
};

const CartManager = {
  getCart: function () {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading cart from localStorage", e);
      return [];
    }
  },

  saveCart: function (cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("zionCartUpdated", { detail: { cart } }));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  },

  addToCart: function (itemOrId, quantity = 1) {
    let item = itemOrId;
    if (typeof itemOrId === "number" || typeof itemOrId === "string") {
      if (typeof MENU_ITEMS !== "undefined") {
        item = MENU_ITEMS.find((i) => i.id === Number(itemOrId));
      }
    }
    if (!item || !item.id) {
      console.error("Invalid item added to cart:", itemOrId);
      return;
    }

    const qty = Math.max(1, Number(quantity) || 1);
    const cart = this.getCart();
    const existingIndex = cart.findIndex((i) => i.id === item.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: item.id,
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

  updateQuantity: function (itemId, newQty) {
    let cart = this.getCart();
    const q = Number(newQty);
    if (q <= 0) {
      cart = cart.filter((i) => i.id !== itemId);
    } else {
      const target = cart.find((i) => i.id === itemId);
      if (target) target.quantity = q;
    }
    this.saveCart(cart);
  },

  removeItem: function (itemId) {
    const cart = this.getCart().filter((i) => i.id !== itemId);
    this.saveCart(cart);
  },

  clearCart: function () {
    this.saveCart([]);
    localStorage.removeItem(APPLIED_COUPON_KEY);
  },

  getAppliedCoupon: function () {
    try {
      const code = localStorage.getItem(APPLIED_COUPON_KEY);
      return code && PROMO_COUPONS[code] ? PROMO_COUPONS[code] : null;
    } catch (e) {
      return null;
    }
  },

  applyCoupon: function (code) {
    const cleanCode = code ? code.trim().toUpperCase() : "";
    if (PROMO_COUPONS[cleanCode]) {
      localStorage.setItem(APPLIED_COUPON_KEY, cleanCode);
      return { success: true, coupon: PROMO_COUPONS[cleanCode] };
    }
    return { success: false, message: "Invalid coupon code. Try ZION50 or WELCOME10" };
  },

  removeCoupon: function () {
    localStorage.removeItem(APPLIED_COUPON_KEY);
    window.dispatchEvent(new CustomEvent("zionCartUpdated", { detail: { cart: this.getCart() } }));
  },

  getTotals: function () {
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

  getItemCount: function () {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  },

  updateBadges: function () {
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

  triggerCartButtonAlert: function (item, quantity = 1) {
    this.updateBadges();

    // 1. Animate My Cart buttons
    const cartButtons = document.querySelectorAll(".nav-cart-btn, #navCartBtn");
    cartButtons.forEach((btn) => {
      btn.classList.remove("cart-bump");
      void btn.offsetWidth; // trigger reflow
      btn.classList.add("cart-bump");
    });

    // 2. Show alert toast
    this.showCartAlertBadge(item, quantity);
  },

  showCartAlertBadge: function (item, quantity = 1) {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className = "toast-container";
      document.body.appendChild(toastContainer);
    }

    // Remove existing cart alerts to prevent stacking clutter
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

// Expose globally
window.CartManager = CartManager;

// Auto update badges on DOM load and storage changes
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => CartManager.updateBadges());
} else {
  CartManager.updateBadges();
}

window.addEventListener("storage", () => CartManager.updateBadges());
