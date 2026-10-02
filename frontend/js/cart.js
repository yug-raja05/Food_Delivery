/**
 * Zion Food Corner - Full-Stack Cart & Checkout Application
 * Handles customer details, coupon validation, and order placement via Backend REST API
 */

let currentOrderMode = "takeaway"; // "takeaway", "delivery", "dinein"

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  initCartAuth();

  // Close Success Modal Handlers
  const successModal = document.getElementById("orderSuccessModal");
  const closeSuccessModalBtn = document.getElementById("closeSuccessModalBtn");

  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener("click", () => {
      successModal.classList.remove("open");
      successModal.setAttribute("aria-hidden", "true");
    });

    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        successModal.classList.remove("open");
        successModal.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && successModal.classList.contains("open")) {
        successModal.classList.remove("open");
        successModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // Listen to external cart updates (e.g. storage changes)
  window.addEventListener("zionCartUpdated", () => {
    renderCartPage();
  });
});

function initCartAuth() {
  if (window.ApiClient && window.ApiClient.renderNavbarAuth) {
    window.ApiClient.renderNavbarAuth("navCartAuthContainer");
  }

  const user = window.ApiClient ? window.ApiClient.getStoredUser() : null;
  const banner = document.getElementById("cartCustomerAuthBanner");
  const custName = document.getElementById("custName");
  const custPhone = document.getElementById("custPhone");
  const custAddress = document.getElementById("custAddress");

  if (user && user.email) {
    if (custName && !custName.value) custName.value = user.name || "";
    if (custPhone && !custPhone.value) custPhone.value = user.phone || "";
    if (custAddress && !custAddress.value && user.defaultAddress) {
      custAddress.value = user.defaultAddress;
    }

    if (banner) {
      banner.innerHTML = `
        <div class="auth-alert-box alert-success" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-bolt" style="color: var(--secondary);"></i>
            <span>Express Checkout active for <strong>${user.name || "Foodie"}</strong></span>
          </div>
          <span style="font-size: 0.78rem; opacity: 0.85;">Details pre-filled</span>
        </div>
      `;
    }
  } else if (banner) {
    banner.innerHTML = `
      <div class="auth-alert-box alert-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <i class="fas fa-circle-info"></i>
          <span>Have an account? <a href="login.html?redirect=cart.html" style="color: var(--primary); font-weight: 700; text-decoration: underline;">Sign In</a> for 1-click checkout!</span>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   CART PAGE RENDER
   ========================================================================== */
function renderCartPage() {
  const cart = CartManager.getCart();
  const totals = CartManager.getTotals();

  const emptyView = document.getElementById("cartEmptyView");
  const filledView = document.getElementById("cartFilledView");
  const cartHeaderActions = document.getElementById("cartHeaderActions");
  const itemsList = document.getElementById("cartItemsList");

  if (!cart || cart.length === 0) {
    if (emptyView) emptyView.style.display = "block";
    if (filledView) filledView.style.display = "none";
    if (cartHeaderActions) cartHeaderActions.style.display = "none";
    return;
  }

  if (emptyView) emptyView.style.display = "none";
  if (filledView) filledView.style.display = "grid";
  if (cartHeaderActions) cartHeaderActions.style.display = "block";

  // Render items count
  const countEl = document.getElementById("cartTotalItemsCount");
  if (countEl) countEl.textContent = totals.itemCount;

  // Render items list
  if (itemsList) {
    itemsList.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item-row" id="cart-item-row-${item.id || item.menuItemId}">
        <div class="cart-item-img-box">
          <img src="${item.image || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"}" alt="${item.name}" class="cart-item-img" />
          <span class="diet-icon-symbol ${item.isVeg ? "veg" : "nonveg"}"></span>
        </div>

        <div class="cart-item-info">
          <h3 class="cart-item-title">${item.name}</h3>
          <span class="cart-item-unit-price">₹${Number(item.price).toFixed(2)} each</span>
        </div>

        <div class="cart-item-stepper">
          <button class="cart-stepper-btn minus" onclick="handleItemQtyChange('${item.id || item.menuItemId}', ${item.quantity - 1})" aria-label="Decrease quantity">
            <i class="fas fa-minus"></i>
          </button>
          <span class="cart-stepper-val">${item.quantity}</span>
          <button class="cart-stepper-btn plus" onclick="handleItemQtyChange('${item.id || item.menuItemId}', ${item.quantity + 1})" aria-label="Increase quantity">
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div class="cart-item-total-col">
          <span class="cart-item-subtotal">₹${(item.price * item.quantity).toFixed(2)}</span>
          <button class="btn-cart-delete" onclick="handleRemoveItem('${item.id || item.menuItemId}')" aria-label="Remove ${item.name} from cart">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Update Free Delivery Tracker
  updateDeliveryTracker(totals);

  // Update Bill Summary
  updateBillSummary(totals);

  // Update Applied Coupon UI
  updateCouponUI(totals);
}

/* ==========================================================================
   DELIVERY PROGRESS & BILL CALCULATIONS
   ========================================================================== */
function updateDeliveryTracker(totals) {
  const trackerText = document.getElementById("trackerText");
  const trackerFill = document.getElementById("trackerFill");
  if (!trackerText || !trackerFill) return;

  if (totals.subtotal >= totals.freeDeliveryThreshold) {
    trackerText.innerHTML = `🎉 You unlocked <strong>FREE Delivery</strong> for this order!`;
    trackerFill.style.width = "100%";
    trackerFill.style.background = "linear-gradient(90deg, #10B981, #059669)";
  } else {
    const remaining = totals.freeDeliveryRemaining.toFixed(2);
    const pct = Math.min(100, Math.round((totals.subtotal / totals.freeDeliveryThreshold) * 100));
    trackerText.innerHTML = `Add <strong>₹${remaining}</strong> more to get <strong>FREE Delivery</strong>!`;
    trackerFill.style.width = `${pct}%`;
    trackerFill.style.background = "linear-gradient(90deg, var(--secondary), #D97706)";
  }
}

function updateBillSummary(totals) {
  const billCount = document.getElementById("billItemCount");
  const billSubtotal = document.getElementById("billSubtotal");
  const billPackaging = document.getElementById("billPackaging");
  const billDelivery = document.getElementById("billDelivery");
  const billTax = document.getElementById("billTax");
  const billDiscountRow = document.getElementById("billDiscountRow");
  const billDiscountVal = document.getElementById("billDiscountVal");
  const billGrandTotal = document.getElementById("billGrandTotal");
  const btnPlaceOrderTotal = document.getElementById("btnPlaceOrderTotal");

  if (billCount) billCount.textContent = totals.itemCount;
  if (billSubtotal) billSubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
  if (billPackaging) billPackaging.textContent = `₹${totals.packagingFee.toFixed(2)}`;

  if (billDelivery) {
    if (currentOrderMode !== "delivery") {
      billDelivery.textContent = "N/A (Pickup / Dine-in)";
    } else if (totals.deliveryFee === 0) {
      billDelivery.innerHTML = `<span style="color: #10B981; font-weight: 800;">FREE</span>`;
    } else {
      billDelivery.textContent = `₹${totals.deliveryFee.toFixed(2)}`;
    }
  }

  if (billTax) billTax.textContent = `₹${totals.tax.toFixed(2)}`;

  let effectiveDelivery = currentOrderMode === "delivery" ? totals.deliveryFee : 0;
  let finalGrandTotal = Math.max(0, totals.subtotal + totals.tax + totals.packagingFee + effectiveDelivery - totals.discount);

  if (totals.discount > 0) {
    if (billDiscountRow) billDiscountRow.style.display = "flex";
    if (billDiscountVal) billDiscountVal.textContent = `-₹${totals.discount.toFixed(2)}`;
  } else {
    if (billDiscountRow) billDiscountRow.style.display = "none";
  }

  if (billGrandTotal) billGrandTotal.textContent = `₹${finalGrandTotal.toFixed(2)}`;
  if (btnPlaceOrderTotal) btnPlaceOrderTotal.textContent = `₹${finalGrandTotal.toFixed(2)}`;
}

function updateCouponUI(totals) {
  const couponPill = document.getElementById("appliedCouponPill");
  const couponInputGroup = document.getElementById("couponInputGroup");
  const appliedName = document.getElementById("appliedCouponName");
  const appliedDesc = document.getElementById("appliedCouponDesc");
  const applied = CartManager.getAppliedCoupon();

  if (applied) {
    if (couponPill) couponPill.style.display = "flex";
    if (couponInputGroup) couponInputGroup.style.display = "none";
    if (appliedName) appliedName.textContent = `${applied.code} applied`;
    if (appliedDesc) {
      appliedDesc.textContent =
        applied.discountType === "percent" ? `${applied.value}% OFF` : `₹${applied.value} OFF`;
    }
  } else {
    if (couponPill) couponPill.style.display = "none";
    if (couponInputGroup) couponInputGroup.style.display = "flex";
  }
}

/* ==========================================================================
   CART INTERACTIONS
   ========================================================================== */
window.handleItemQtyChange = function (itemId, newQty) {
  CartManager.updateQuantity(itemId, newQty);
  renderCartPage();
};

window.handleRemoveItem = function (itemId) {
  CartManager.removeItem(itemId);
  renderCartPage();
};

window.handleClearCart = function () {
  if (confirm("Are you sure you want to remove all items from your food cart?")) {
    CartManager.clearCart();
    renderCartPage();
  }
};

/* ==========================================================================
   COUPON HANDLING
   ========================================================================== */
window.handleApplyCoupon = async function () {
  const input = document.getElementById("couponCodeInput");
  if (!input) return;
  const code = input.value.trim();

  if (!code) {
    showToast("Please enter a coupon code", "fa-triangle-exclamation");
    return;
  }

  const applyBtn = document.getElementById("btnApplyCoupon");
  if (applyBtn) applyBtn.disabled = true;

  try {
    const res = await CartManager.applyCoupon(code);
    if (res.success) {
      showToast(`Coupon applied! ${res.coupon.description || ""}`, "fa-circle-check");
      input.value = "";
    } else {
      showToast(res.message || "Invalid coupon code", "fa-circle-xmark");
    }
  } catch (e) {
    showToast("Error validating coupon with kitchen server", "fa-circle-xmark");
  } finally {
    if (applyBtn) applyBtn.disabled = false;
    renderCartPage();
  }
};

window.handleRemoveCoupon = function () {
  CartManager.removeCoupon();
  showToast("Coupon removed", "fa-trash-can");
  renderCartPage();
};

window.fillCoupon = function (code) {
  const input = document.getElementById("couponCodeInput");
  if (input) {
    input.value = code;
    handleApplyCoupon();
  }
};

/* ==========================================================================
   ORDER MODE SWITCHER
   ========================================================================== */
window.switchOrderMode = function (mode) {
  currentOrderMode = mode;
  document.querySelectorAll(".order-mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const deliveryFields = document.getElementById("deliveryFields");
  const dineinFields = document.getElementById("dineinFields");
  const custAddress = document.getElementById("custAddress");
  const tableNumber = document.getElementById("tableNumber");

  if (mode === "delivery") {
    if (deliveryFields) deliveryFields.style.display = "block";
    if (dineinFields) dineinFields.style.display = "none";
    if (custAddress) custAddress.required = true;
    if (tableNumber) tableNumber.required = false;
  } else if (mode === "dinein") {
    if (deliveryFields) deliveryFields.style.display = "none";
    if (dineinFields) dineinFields.style.display = "block";
    if (custAddress) custAddress.required = false;
    if (tableNumber) tableNumber.required = true;
  } else {
    // takeaway
    if (deliveryFields) deliveryFields.style.display = "none";
    if (dineinFields) dineinFields.style.display = "none";
    if (custAddress) custAddress.required = false;
    if (tableNumber) tableNumber.required = false;
  }

  renderCartPage();
};

window.triggerFormSubmit = function () {
  const form = document.getElementById("orderCustomerForm");
  if (form) {
    if (form.reportValidity()) {
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  }
};

/* ==========================================================================
   PLACE ORDER VIA BACKEND API
   ========================================================================== */
window.handlePlaceOrder = async function (e) {
  if (e) e.preventDefault();

  const cart = CartManager.getCart();
  if (!cart || cart.length === 0) {
    showToast("Your cart is empty! Please select some delicious items first.", "fa-bag-shopping");
    return;
  }

  const custName = document.getElementById("custName");
  const custPhone = document.getElementById("custPhone");
  const custAddress = document.getElementById("custAddress");
  const custLandmark = document.getElementById("custLandmark");
  const custPincode = document.getElementById("custPincode");
  const tableNumber = document.getElementById("tableNumber");
  const cookingInstructions = document.getElementById("cookingInstructions");
  const paymentMethodInput = document.querySelector("input[name='paymentMethod']:checked");
  const btnPlaceOrder = document.getElementById("btnPlaceOrder");

  if (!custName || !custName.value.trim()) {
    showToast("Please enter your name", "fa-user");
    if (custName) custName.focus();
    return;
  }

  if (!custPhone || !custPhone.value.trim()) {
    showToast("Please enter a valid phone number", "fa-phone");
    if (custPhone) custPhone.focus();
    return;
  }

  if (currentOrderMode === "delivery") {
    if (!custAddress || !custAddress.value.trim()) {
      showToast("Please provide your delivery address", "fa-location-dot");
      if (custAddress) custAddress.focus();
      return;
    }
  }

  if (currentOrderMode === "dinein") {
    if (!tableNumber || !tableNumber.value || Number(tableNumber.value) < 1) {
      showToast("Please enter your table number", "fa-chair");
      if (tableNumber) tableNumber.focus();
      return;
    }
  }

  const appliedCoupon = CartManager.getAppliedCoupon();

  // Prepare order payload
  const orderPayload = {
    customer: {
      name: custName.value.trim(),
      phone: custPhone.value.trim()
    },
    orderType: currentOrderMode,
    deliveryAddress:
      currentOrderMode === "delivery"
        ? {
            address: custAddress.value.trim(),
            landmark: custLandmark ? custLandmark.value.trim() : "",
            pincode: custPincode ? custPincode.value.trim() : "560027"
          }
        : undefined,
    tableNumber: currentOrderMode === "dinein" ? Number(tableNumber.value) : undefined,
    items: cart.map((i) => ({
      id: i.id || i.menuItemId,
      menuItemId: i.id || i.menuItemId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image
    })),
    cookingInstructions: cookingInstructions ? cookingInstructions.value.trim() : "",
    couponCode: appliedCoupon ? appliedCoupon.code : "",
    paymentMethod: paymentMethodInput ? paymentMethodInput.value : "cod"
  };

  // Disable button and show spinner
  if (btnPlaceOrder) {
    btnPlaceOrder.disabled = true;
    btnPlaceOrder.innerHTML = `<span><i class="fas fa-spinner fa-spin"></i> Placing Order...</span>`;
  }

  try {
    let orderResult = null;

    if (window.ApiClient && typeof window.ApiClient.createOrder === "function") {
      const response = await window.ApiClient.createOrder(orderPayload);
      if (response && response.success && response.data) {
        orderResult = response.data;
      } else {
        throw new Error(response.message || "Failed to create order on server.");
      }
    } else {
      throw new Error("API Client not loaded");
    }

    // Display confirmation modal with real backend data
    displayOrderSuccess(orderResult);

    // Clear cart only after confirmed backend order creation
    CartManager.clearCart();
    CartManager.updateBadges();
  } catch (error) {
    console.error("Order creation error:", error);
    showToast(`Order Failed: ${error.message || "Please check your network and try again."}`, "fa-circle-xmark");

    // Re-enable place order button
    if (btnPlaceOrder) {
      btnPlaceOrder.disabled = false;
      const totals = CartManager.getTotals();
      btnPlaceOrder.innerHTML = `
        <span>Place Order</span>
        <div class="btn-price-tag">
          <span id="btnPlaceOrderTotal">₹${totals.grandTotal.toFixed(2)}</span>
          <i class="fas fa-arrow-right"></i>
        </div>
      `;
    }
  }
};

/* ==========================================================================
   SUCCESS MODAL POPULATION
   ========================================================================== */
function displayOrderSuccess(order) {
  const successModal = document.getElementById("orderSuccessModal");
  const successOrderId = document.getElementById("successOrderId");
  const successGrandTotal = document.getElementById("successGrandTotal");
  const successItemsSummary = document.getElementById("successItemsSummary");
  const successCustomerDetails = document.getElementById("successCustomerDetails");
  const successOrderGreeting = document.getElementById("successOrderGreeting");

  if (!successModal) return;

  if (successOrderId) {
    successOrderId.textContent = `#${order.orderNumber}`;
  }

  if (successGrandTotal) {
    successGrandTotal.textContent = `₹${Number(order.grandTotal).toFixed(2)}`;
  }

  if (successOrderGreeting && order.customer && order.customer.name) {
    successOrderGreeting.innerHTML = `Hello <strong>${order.customer.name}</strong>, your order has been sent directly to the kitchen at Zion Food Corner.`;
  }

  if (successItemsSummary && order.items) {
    successItemsSummary.innerHTML = order.items
      .map(
        (i) => `
      <div class="receipt-item-row" style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
        <span>${i.quantity}x ${i.name}</span>
        <strong>₹${Number(i.subtotal || i.price * i.quantity).toFixed(2)}</strong>
      </div>
    `
      )
      .join("");
  }

  if (successCustomerDetails) {
    let modeText = "Takeaway / Self Pickup";
    if (order.orderType === "delivery") {
      modeText = `Home Delivery (${order.deliveryAddress ? order.deliveryAddress.address : ""})`;
    } else if (order.orderType === "dinein") {
      modeText = `Dine-In (Table #${order.tableNumber || "1"})`;
    }

    successCustomerDetails.innerHTML = `
      <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.75rem; border-top: 1px dashed var(--border-color); padding-top: 0.65rem;">
        <div><strong>Customer:</strong> ${order.customer ? order.customer.name : ""} (${order.customer ? order.customer.phone : ""})</div>
        <div><strong>Type:</strong> ${modeText}</div>
        <div><strong>Payment:</strong> ${order.paymentMethod === "upi" ? "UPI / Online Payment" : "Cash on Delivery / Counter"}</div>
        ${order.couponCode ? `<div><strong>Coupon:</strong> ${order.couponCode} (-₹${Number(order.discount || 0).toFixed(2)})</div>` : ""}
      </div>
    `;
  }

  successModal.classList.add("open");
  successModal.setAttribute("aria-hidden", "false");
}

/* ==========================================================================
   TOAST NOTIFICATIONS
   ========================================================================== */
window.showToast = function (message, icon = "fa-bell") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i class="fas ${icon}" style="color: var(--primary);"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px) scale(0.9)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
