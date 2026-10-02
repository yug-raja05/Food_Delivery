/**
 * Zion Food Corner - API Service
 * Centralized REST client connecting to Express backend and MongoDB Atlas
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const ApiClient = {
  baseUrl: API_BASE_URL,

  getStoredToken() {
    try {
      return localStorage.getItem("zion_auth_token") || null;
    } catch {
      return null;
    }
  },

  getStoredUser() {
    try {
      const raw = localStorage.getItem("zion_auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setAuthSession(user, token) {
    try {
      if (token) localStorage.setItem("zion_auth_token", token);
      if (user) localStorage.setItem("zion_auth_user", JSON.stringify(user));
    } catch (e) {
      console.warn("Could not save session to localStorage:", e);
    }
  },

  clearAuthSession() {
    try {
      localStorage.removeItem("zion_auth_token");
      localStorage.removeItem("zion_auth_user");
    } catch (e) {
      console.warn("Could not clear session:", e);
    }
  },

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
      console.warn(`[API Error: ${endpoint}]:`, error.message);
      throw error;
    }
  },

  // 1. Restaurant Details
  async getRestaurant() {
    return this.request("/restaurant");
  },

  // 2. Categories
  async getCategories() {
    return this.request("/categories");
  },

  // 3. Menu Items
  async getMenu() {
    return this.request("/menu");
  },

  async getMenuItem(id) {
    return this.request(`/menu/${id}`);
  },

  async getPopularItems() {
    return this.request("/menu/popular");
  },

  async getMenuByCategory(category) {
    return this.request(`/menu/category/${category}`);
  },

  async searchMenu(query) {
    return this.request(`/menu/search?q=${encodeURIComponent(query)}`);
  },

  // 4. Coupons
  async validateCoupon(code, subtotal) {
    return this.request("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal })
    });
  },

  async getCoupons() {
    return this.request("/coupons");
  },

  // 5. Orders
  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  },

  async getOrder(orderNumber) {
    return this.request(`/orders/${orderNumber}`);
  },

  async updateOrderStatus(orderNumber, status) {
    return this.request(`/orders/${orderNumber}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  },

  // 6. Customer Feedback
  async getFeedback(limit = 50) {
    return this.request(`/feedback?limit=${limit}`);
  },

  async getFeedbackStats() {
    return this.request("/feedback/stats");
  },

  async getItemFeedback(itemId) {
    return this.request(`/feedback/item/${itemId}`);
  },

  async getItemFeedbackStats(itemId) {
    return this.request(`/feedback/item/${itemId}/stats`);
  },

  async submitFeedback(feedbackData) {
    return this.request("/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData)
    });
  },

  // 7. Authentication
  async register(userData) {
    const res = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    if (res && res.data && res.data.token) {
      this.setAuthSession(res.data.user, res.data.token);
    }
    return res;
  },

  async login(credentials) {
    const res = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    if (res && res.data && res.data.token) {
      this.setAuthSession(res.data.user, res.data.token);
    }
    return res;
  },

  async getCurrentUser() {
    return this.request("/auth/me");
  },

  async updateProfile(profileData) {
    const res = await this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData)
    });
    if (res && res.data && res.data.user) {
      const current = this.getStoredUser() || {};
      this.setAuthSession({ ...current, ...res.data.user });
    }
    return res;
  }
};

export default ApiClient;
