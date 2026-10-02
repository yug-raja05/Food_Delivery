// Zion Food Corner - Cart Page Logic

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
  const custName = document.getElementById("custName");
  const custPhone = document.getElementById("custPhone");
  const custAddress = document.getElementById("custAddress");

  if (user && user.email) {
    if (custName && !custName.value) custName.value = user.name || "";
    if (custPhone && !custPhone.value) custPhone.value = user.phone || "";
    if (custAddress && !custAddress.value && user.defaultAddress) {
      custAddress.value = user.defaultAddress;
    }
  }
}

function renderCartPage() {
  const cart = CartManager.getCart();
  const totals = CartManager.getTotals();

  const emptyView = document.getElementById("cartEmptyView");
  const filledView = document.getElementById("cartFilledView");
  const cartHeaderActions = document.getElementById("cartHeaderActions");
  const itemsList = document.getElementById("cartItemsList");

  if (!cart || cart.length === 0) {
    emptyView.style.display = "block";
    filledView.style.display = "none";
    if (cartHeaderActions) cartHeaderActions.style.display = "none";
    return;
  }

  emptyView.style.display = "none";
  filledView.style.display = "grid";
  if (cartHeaderActions) cartHeaderActions.style.display = "block";

  // Render items count
  const countEl = document.getElementById("cartTotalItemsCount");
  if (countEl) countEl.textContent = totals.itemCount;

  // Render items list
  itemsList.innerHTML = cart.map((item) => `
    <div class="cart-item-row" id="cart-item-row-${item.id}">
      <div class="cart-item-img-box">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <span class="diet-icon-symbol ${item.isVeg ? 'veg' : 'nonveg'}"></span>
      </div>

      <div class="cart-item-info">
        <h3 class="cart-item-title">${item.name}</h3>
        <span class="cart-item-unit-price">₹${item.price.toFixed(2)} each</span>
      </div>

      <div class="cart-item-stepper">
        <button class="cart-stepper-btn minus" onclick="handleItemQtyChange(${item.id}, ${item.quantity - 1})" aria-label="Decrease quantity">
          <i class="fas fa-minus"></i>
        </button>
        <span class="cart-stepper-val">${item.quantity}</span>
        <button class="cart-stepper-btn plus" onclick="handleItemQtyChange(${item.id}, ${item.quantity + 1})" aria-label="Increase quantity">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="cart-item-total-col">
        <span class="cart-item-subtotal">₹${(item.price * item.quantity).toFixed(2)}</span>
        <button class="btn-cart-delete" onclick="handleRemoveItem(${item.id})" aria-label="Remove ${item.name} from cart">
          <i class="fas fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join("");

  // Update Free Delivery Tracker
  updateDeliveryTracker(totals);

  // Update Bill Summary
  updateBillSummary(totals);

  // Update Applied Coupon UI
  updateCouponUI(totals.coupon);
}

function updateDeliveryTracker(totals) {
  const trackerText = document.getElementById("trackerText");
  const trackerFill = document.getElementById("trackerFill");
  if (!trackerText || !trackerFill) return;

  if (totals.subtotal >= totals.freeDeliveryThreshold) {
    trackerText.innerHTML = `🎉 Congratulations! You have unlocked <strong>FREE Delivery</strong>!`;
    trackerFill.style.width = "100%";
    trackerFill.style.background = "linear-gradient(90deg, #10B981, #059669)";
  } else {
    const percent = Math.min(100, Math.round((totals.subtotal / totals.freeDeliveryThreshold) * 100));
    trackerText.innerHTML = `Add <strong>₹${totals.freeDeliveryRemaining.toFixed(2)}</strong> more to get <strong>FREE Delivery</strong>!`;
    trackerFill.style.width = `${percent}%`;
    trackerFill.style.background = "linear-gradient(90deg, var(--secondary), var(--primary))";
  }
}

function updateBillSummary(totals) {
  const billItemCount = document.getElementById("billItemCount");
  const billSubtotal = document.getElementById("billSubtotal");
  const billPackaging = document.getElementById("billPackaging");
  const billDelivery = document.getElementById("billDelivery");
  const billTax = document.getElementById("billTax");
  const billDiscountRow = document.getElementById("billDiscountRow");
  const billDiscountVal = document.getElementById("billDiscountVal");
  const billGrandTotal = document.getElementById("billGrandTotal");
  const btnPlaceOrderTotal = document.getElementById("btnPlaceOrderTotal");

  if (billItemCount) billItemCount.textContent = totals.itemCount;
  if (billSubtotal) billSubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
  if (billPackaging) billPackaging.textContent = `₹${totals.packagingFee.toFixed(2)}`;
  
  if (billDelivery) {
    if (totals.deliveryFee === 0) {
      billDelivery.innerHTML = `<span style="color: #059669; font-weight: 800;">FREE</span>`;
    } else {
      billDelivery.textContent = `₹${totals.deliveryFee.toFixed(2)}`;
    }
  }

  if (billTax) billTax.textContent = `₹${totals.tax.toFixed(2)}`;

  if (totals.discount > 0) {
    if (billDiscountRow) billDiscountRow.style.display = "flex";
    if (billDiscountVal) billDiscountVal.textContent = `-₹${totals.discount.toFixed(2)}`;
  } else {
    if (billDiscountRow) billDiscountRow.style.display = "none";
  }

  if (billGrandTotal) billGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
  if (btnPlaceOrderTotal) btnPlaceOrderTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
}

function updateCouponUI(coupon) {
  const inputGroup = document.getElementById("couponInputGroup");
  const pill = document.getElementById("appliedCouponPill");
  const nameEl = document.getElementById("appliedCouponName");
  const descEl = document.getElementById("appliedCouponDesc");

  if (!inputGroup || !pill) return;

  if (coupon) {
    inputGroup.style.display = "none";
    pill.style.display = "flex";
    if (nameEl) nameEl.textContent = `${coupon.code} applied`;
    if (descEl) descEl.textContent = coupon.desc;
  } else {
    inputGroup.style.display = "flex";
    pill.style.display = "none";
  }
}

/* Event Handlers */
function handleItemQtyChange(itemId, newQty) {
  if (newQty <= 0) {
    handleRemoveItem(itemId);
  } else {
    CartManager.updateQuantity(itemId, newQty);
    renderCartPage();
  }
}

function handleRemoveItem(itemId) {
  const row = document.getElementById(`cart-item-row-${itemId}`);
  if (row) {
    row.style.transition = "all 0.3s ease";
    row.style.opacity = "0";
    row.style.transform = "translateX(40px)";
    setTimeout(() => {
      CartManager.removeItem(itemId);
      renderCartPage();
      showToast("Item removed from cart");
    }, 280);
  } else {
    CartManager.removeItem(itemId);
    renderCartPage();
  }
}

function handleClearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    CartManager.clearCart();
    renderCartPage();
    showToast("Cart cleared successfully");
  }
}

function fillCoupon(code) {
  const input = document.getElementById("couponCodeInput");
  if (input) {
    input.value = code;
    handleApplyCoupon();
  }
}

function handleApplyCoupon() {
  const input = document.getElementById("couponCodeInput");
  if (!input || !input.value.trim()) {
    showToast("Please enter a valid coupon code");
    return;
  }

  const result = CartManager.applyCoupon(input.value);
  if (result.success) {
    showToast(`🎉 Coupon ${result.coupon.code} applied! Enjoy your discount.`);
    input.value = "";
    renderCartPage();
  } else {
    showToast(`❌ ${result.message}`);
  }
}

function handleRemoveCoupon() {
  CartManager.removeCoupon();
  showToast("Coupon removed");
  renderCartPage();
}

function switchOrderMode(mode) {
  currentOrderMode = mode;
  document.querySelectorAll(".order-mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const deliveryFields = document.getElementById("deliveryFields");
  const dineinFields = document.getElementById("dineinFields");
  const custAddress = document.getElementById("custAddress");
  const tableNumber = document.getElementById("tableNumber");

  if (deliveryFields) deliveryFields.style.display = mode === "delivery" ? "block" : "none";
  if (dineinFields) dineinFields.style.display = mode === "dinein" ? "block" : "none";

  if (custAddress) custAddress.required = mode === "delivery";
  if (tableNumber) tableNumber.required = mode === "dinein";
}

function triggerFormSubmit() {
  const form = document.getElementById("orderCustomerForm");
  if (form) {
    if (form.checkValidity()) {
      handlePlaceOrder(new Event("submit"));
    } else {
      form.reportValidity();
    }
  }
}

function handlePlaceOrder(event) {
  if (event) event.preventDefault();

  const cart = CartManager.getCart();
  if (!cart || cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  const name = document.getElementById("custName")?.value || "Valued Customer";
  const phone = document.getElementById("custPhone")?.value || "098867 64280";
  const instructions = document.getElementById("cookingInstructions")?.value || "None";
  const totals = CartManager.getTotals();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "cod";

  const orderId = `#ZFC-${Math.floor(1000 + Math.random() * 9000)}`;

  // Populate Success Modal
  const successModal = document.getElementById("orderSuccessModal");
  const successOrderId = document.getElementById("successOrderId");
  const successOrderGreeting = document.getElementById("successOrderGreeting");
  const successItemsSummary = document.getElementById("successItemsSummary");
  const successGrandTotal = document.getElementById("successGrandTotal");
  const successCustomerDetails = document.getElementById("successCustomerDetails");

  if (successOrderId) successOrderId.textContent = orderId;
  if (successOrderGreeting) {
    successOrderGreeting.innerHTML = `Thank you, <strong>${name}</strong>! Your order is confirmed and being prepared fresh at Zion Food Corner.`;
  }

  if (successItemsSummary) {
    successItemsSummary.innerHTML = cart.map((item) => `
      <div class="receipt-item-row">
        <span>${item.quantity}x ${item.name}</span>
        <strong>₹${(item.price * item.quantity).toFixed(2)}</strong>
      </div>
    `).join("");
  }

  if (successGrandTotal) successGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;

  if (successCustomerDetails) {
    let modeText = "Takeaway (Counter Pickup)";
    if (currentOrderMode === "delivery") {
      const address = document.getElementById("custAddress")?.value || "S R Nagar, Bengaluru";
      modeText = `Home Delivery to: ${address}`;
    } else if (currentOrderMode === "dinein") {
      const table = document.getElementById("tableNumber")?.value || "1";
      modeText = `Dine-In Table #${table}`;
    }

    const payText = paymentMethod === "upi" ? "UPI / Online Payment" : "Cash on Delivery / Counter";

    successCustomerDetails.innerHTML = `
      <div><strong>Contact:</strong> ${phone}</div>
      <div><strong>Order Type:</strong> ${modeText}</div>
      <div><strong>Payment:</strong> ${payText}</div>
      ${instructions && instructions !== "None" ? `<div><strong>Notes:</strong> <em>${instructions}</em></div>` : ""}
    `;
  }

  // Update step indicators
  const stepDetails = document.getElementById("stepIndicatorDetails");
  const stepDone = document.getElementById("stepIndicatorDone");
  if (stepDetails) stepDetails.classList.add("active");
  if (stepDone) stepDone.classList.add("active");

  // Show Success Modal
  if (successModal) {
    successModal.classList.add("open");
    successModal.setAttribute("aria-hidden", "false");
  }

  // Clear Cart
  CartManager.clearCart();
}

function showToast(message) {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-circle-info" style="color: var(--secondary);"></i> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
