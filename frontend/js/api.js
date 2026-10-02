/**
 * Zion Food Corner - Unified Frontend API Client
 * Connects frontend vanilla JavaScript seamlessly to Node.js/Express backend & MongoDB
 */

const API_BASE_URL =
  window.API_BASE_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "/api");

const ApiClient = {
  baseUrl: API_BASE_URL,

  /**
   * Generic request helper with error handling & auth token attachment
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getStoredToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.warn(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  /* ==========================================================================
     AUTHENTICATION & USER PROFILE
     ========================================================================== */
  getStoredToken() {
    return localStorage.getItem("zfc_auth_token") || null;
  },

  getStoredUser() {
    try {
      const u = localStorage.getItem("zfc_user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setAuthSession(user, token) {
    if (token) localStorage.setItem("zfc_auth_token", token);
    if (user) localStorage.setItem("zfc_user", JSON.stringify(user));
  },

  clearAuthSession() {
    localStorage.removeItem("zfc_auth_token");
    localStorage.removeItem("zfc_user");
  },

  async registerUser(userData) {
    const res = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    return res;
  },

  async loginUser(emailOrCredentials, password) {
    const payload = typeof emailOrCredentials === "object"
      ? emailOrCredentials
      : { email: emailOrCredentials, password };

    const res = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (res && res.data && res.data.token) {
      this.setAuthSession(res.data.user, res.data.token);
    }
    return res;
  },

  async getCurrentUser() {
    return this.request("/auth/me");
  },

  async updateUserProfile(profileData) {
    const res = await this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData)
    });
    if (res && res.data && res.data.user) {
      const current = this.getStoredUser() || {};
      this.setAuthSession({ ...current, ...res.data.user });
    }
    return res;
  },

  logoutUser() {
    this.clearAuthSession();
    window.location.reload();
  },

  /**
   * Helper to render unified auth avatar/pill in any page navbar
   */
  renderNavbarAuth(containerId = "navAuthContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = this.getStoredUser();
    if (user && user.email) {
      const initials = (user.name || "User")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
      const firstName = (user.name || "User").split(" ")[0];

      container.innerHTML = `
        <div class="nav-auth-container" style="position: relative;">
          <button type="button" class="nav-user-pill" id="${containerId}Btn" onclick="window.ApiClient.toggleDropdown('${containerId}Dropdown', event)" aria-label="User Account Menu">
            <div class="nav-user-avatar">${initials}</div>
            <span style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${firstName}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.7rem; color: var(--text-muted);"></i>
          </button>
          <div class="user-dropdown-menu" id="${containerId}Dropdown">
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${user.name || "Foodie"}</div>
              <div class="user-dropdown-email">${user.email}</div>
            </div>
            <a href="cart.html" class="user-dropdown-item">
              <i class="fas fa-bag-shopping" style="color: var(--primary);"></i> My Cart
            </a>
            <button type="button" class="user-dropdown-item text-danger" onclick="window.ApiClient.logoutUser()">
              <i class="fas fa-right-from-bracket"></i> Sign Out
            </button>
          </div>
        </div>
      `;
    } else {
      const isCartPage = window.location.pathname.includes("cart.html");
      const loginHref = isCartPage ? "login.html?redirect=cart.html" : "login.html";
      container.innerHTML = `
        <a href="${loginHref}" class="nav-login-link" aria-label="Sign In or Register">
          <i class="fas fa-circle-user"></i> <span>Sign In</span>
        </a>
      `;
    }
  },

  toggleDropdown(dropdownId, event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const isCurrentlyShown = dropdown.classList.contains("show");
    // Close any other open dropdowns
    document.querySelectorAll(".user-dropdown-menu.show").forEach((d) => d.classList.remove("show"));

    if (!isCurrentlyShown) {
      dropdown.classList.add("show");
    }
  },

  /**
   * 1. Get Restaurant information
   */
  async getRestaurant() {
    return this.request("/restaurant");
  },

  /**
   * 2. Get active category list
   */
  async getCategories() {
    return this.request("/categories");
  },

  /**
   * 3. Get all menu items (with optional category, veg/non-veg, popular filters)
   */
  async getMenu(filters = {}) {
    const query = new URLSearchParams();
    if (filters.category && filters.category !== "all") query.append("category", filters.category);
    if (filters.isVeg !== undefined && filters.isVeg !== null) query.append("isVeg", filters.isVeg);
    if (filters.popular) query.append("popular", "true");
    if (filters.search) query.append("search", filters.search);

    const qs = query.toString();
    return this.request(`/menu${qs ? `?${qs}` : ""}`);
  },

  /**
   * 4. Get a single menu item by ID (numeric or ObjectId)
   */
  async getMenuItem(id) {
    return this.request(`/menu/${id}`);
  },

  /**
   * 5. Get popular / bestselling menu items
   */
  async getPopularItems() {
    return this.request("/menu/popular");
  },

  /**
   * 6. Search menu items by text query
   */
  async searchMenu(query) {
    return this.request(`/menu/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * 7. Validate a coupon code against MongoDB server-side
   */
  async validateCoupon(code, subtotal = 0) {
    return this.request("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal })
    });
  },

  /**
   * 8. Create a new verified order in MongoDB
   */
  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  },

  /**
   * 9. Get an order receipt by order number
   */
  async getOrder(orderNumber) {
    return this.request(`/orders/${encodeURIComponent(orderNumber)}`);
  },

  /**
   * 10. Get all feedback / reviews
   */
  async getFeedback(limit = 50) {
    return this.request(`/feedback${limit ? `?limit=${limit}` : ""}`);
  },

  /**
   * 11. Get overall feedback stats (total count & average rating)
   */
  async getFeedbackStats() {
    return this.request("/feedback/stats");
  },

  /**
   * 12. Get item-specific feedback
   */
  async getItemFeedback(itemId) {
    return this.request(`/feedback/item/${encodeURIComponent(itemId)}`);
  },

  /**
   * 13. Get item-specific feedback stats
   */
  async getItemFeedbackStats(itemId) {
    return this.request(`/feedback/item/${encodeURIComponent(itemId)}/stats`);
  },

  /**
   * 14. Submit customer feedback / review
   */
  async submitFeedback(feedbackData) {
    return this.request("/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData)
    });
  }
};

// Expose globally to window
window.ApiClient = ApiClient;

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-auth-container")) {
    document.querySelectorAll(".user-dropdown-menu.show").forEach((d) => d.classList.remove("show"));
  }
});

