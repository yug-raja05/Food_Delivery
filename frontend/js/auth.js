/**
 * Helper to safely get the current cart item count without throwing errors
 */
function getSafeCartItemCount() {
  try {
    if (typeof CartManager === 'undefined' || !CartManager) return 0;
    if (typeof CartManager.getItemCount === 'function') return CartManager.getItemCount();
    if (typeof CartManager.getTotals === 'function') return CartManager.getTotals()?.itemCount || 0;
    if (typeof CartManager.getCart === 'function') {
      const cart = CartManager.getCart();
      return Array.isArray(cart) ? cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) : 0;
    }
  } catch (e) {
    console.warn("CartManager count check skipped:", e);
  }
  return 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Update Cart Badge Count in header if present
  const badge = document.getElementById('cartBadgeCount');
  if (badge) {
    const count = getSafeCartItemCount();
    badge.textContent = count;
  }

  // Parse query params for active tab and redirect target
  const urlParams = new URLSearchParams(window.location.search);
  const requestedTab = urlParams.get('tab');
  if (requestedTab === 'register') {
    switchAuthTab('register');
  }

  // If already logged in, show logged-in state or redirect prompt
  const currentUser = ApiClient.getStoredUser();
  if (currentUser && currentUser.email) {
    showLoggedInBanner(currentUser);
  }
});

/**
 * Switch between Sign In and Create Account tabs
 */
function switchAuthTab(tab) {
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authMainTitle = document.getElementById('authMainTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  const alertBox = document.getElementById('authAlertBox');

  // Hide any existing alerts
  if (alertBox) alertBox.style.display = 'none';

  if (tab === 'register') {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    authMainTitle.textContent = 'Create an Account';
    authSubtitle.textContent = 'Join Zion Food Corner for instant checkout and special foodie perks';
  } else {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    authMainTitle.textContent = 'Welcome Back';
    authSubtitle.textContent = 'Sign in to your account for faster ordering and saved delivery details';
  }
}

/**
 * Toggle password input visibility (show/hide)
 */
function togglePasswordVisibility(inputId, btnElement) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const icon = btnElement.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

/**
 * Handle Login Form Submit
 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmitBtn');

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showAlert('error', 'Please enter your email and password.');
    return;
  }

  // Set loading state
  const originalBtnContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

  try {
    const result = await ApiClient.loginUser(email, password);

    if (result && result.success) {
      showAlert('success', `Welcome back, ${result.user?.name || 'Foodie'}! Redirecting...`);

      // Determine redirect URL
      const urlParams = new URLSearchParams(window.location.search);
      let redirectUrl = urlParams.get('redirect');

      if (!redirectUrl) {
        // If cart has items, suggest cart, otherwise index
        const cartCount = getSafeCartItemCount();
        redirectUrl = cartCount > 0 ? 'cart.html' : 'index.html';
      }

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 700);
    } else {
      showAlert('error', result?.message || 'Invalid email or password. Please try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert('error', error.message || 'Unable to connect to server. Please ensure backend is running.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
  }
}

/**
 * Handle Registration Form Submit
 */
async function handleRegisterSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const passwordInput = document.getElementById('regPassword');
  const addressInput = document.getElementById('regAddress');
  const submitBtn = document.getElementById('registerSubmitBtn');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value;
  const defaultAddress = addressInput ? addressInput.value.trim() : '';

  if (!name || !email || !phone || !password) {
    showAlert('error', 'Please fill in all required fields.');
    return;
  }

  if (password.length < 6) {
    showAlert('error', 'Password must be at least 6 characters long.');
    return;
  }

  // Set loading state
  const originalBtnContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

  try {
    const result = await ApiClient.registerUser({
      name,
      email,
      phone,
      password,
      defaultAddress
    });

    if (result && result.success) {
      // Clear register form inputs
      nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      if (passwordInput) passwordInput.value = '';
      if (addressInput) addressInput.value = '';
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;

      // Switch to Sign In tab & prefill registered email
      switchAuthTab('login');

      const loginEmail = document.getElementById('loginEmail');
      const loginPassword = document.getElementById('loginPassword');
      if (loginEmail) {
        loginEmail.value = email;
      }
      if (loginPassword) {
        loginPassword.value = '';
        loginPassword.focus();
      }

      showAlert('success', `🎉 Account created successfully! Please enter your password to sign in.`);
    } else {
      showAlert('error', result?.message || 'Registration failed. Please check your details.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  } catch (error) {
    console.error('Registration error:', error);
    showAlert('error', error.message || 'Unable to connect to server. Please ensure backend is running.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
  }
}

/**
 * Display inline alert box inside the auth card
 */
function showAlert(type, message) {
  const alertBox = document.getElementById('authAlertBox');
  const alertIcon = document.getElementById('authAlertIcon');
  const alertMsg = document.getElementById('authAlertMsg');

  if (!alertBox || !alertMsg) return;

  alertBox.className = `auth-alert-box alert-${type}`;
  alertMsg.textContent = message;

  if (alertIcon) {
    if (type === 'success') {
      alertIcon.className = 'fas fa-circle-check';
    } else {
      alertIcon.className = 'fas fa-circle-exclamation';
    }
  }

  alertBox.style.display = 'flex';
}

/**
 * If user is already logged in, show a banner inside card with Logout & Continue options
 */
function showLoggedInBanner(user) {
  const alertBox = document.getElementById('authAlertBox');
  if (alertBox) {
    alertBox.className = 'auth-alert-box alert-info';
    alertBox.innerHTML = `
      <i class="fas fa-user-check"></i>
      <div style="flex: 1;">
        <span>You are currently signed in as <strong>${escapeHtml(user.name)}</strong> (${escapeHtml(user.email)}).</span>
        <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
          <a href="index.html" class="btn btn-sm btn-primary" style="padding: 4px 12px; font-size: 0.82rem;">Browse Menu</a>
          <a href="cart.html" class="btn btn-sm btn-outline" style="padding: 4px 12px; font-size: 0.82rem;">View Cart</a>
          <button type="button" class="btn btn-sm btn-outline" style="padding: 4px 12px; font-size: 0.82rem; color: #EF4444; border-color: rgba(239, 68, 68, 0.4);" onclick="handleAuthLogout()">Sign Out</button>
        </div>
      </div>
    `;
    alertBox.style.display = 'flex';
  }
}

function handleAuthLogout() {
  ApiClient.logoutUser();
  window.location.reload();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
