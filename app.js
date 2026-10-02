// Zion Food Corner - Realtime Video Culinary Experience & Interactive Frontend Logic

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentCategory = "all";
  let currentSearchQuery = "";
  let currentDietFilter = "all"; // 'all', 'veg', 'nonveg'
  let activeModalItem = null;
  let activeCookingItem = null;
  let currentCookingStep = 0;
  let cookingAutoPlayTimer = null;
  let orderQuantity = 1;

  // DOM Elements
  const popularGrid = document.getElementById("popularGrid");
  const menuGrid = document.getElementById("menuGrid");
  const categoryTabsContainer = document.getElementById("categoryTabs");
  const searchInput = document.getElementById("menuSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const dietFilterBtns = document.querySelectorAll(".diet-toggle-btn");
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const drawerNavLinks = document.querySelectorAll(".drawer-nav-link");
  const siteNavbar = document.getElementById("siteNavbar");

  // Modals Elements
  const orderModal = document.getElementById("orderModal");
  const closeOrderModal = document.getElementById("closeOrderModal");
  const toastContainer = document.getElementById("toastContainer");

  // Initialize
  initNavbarScroll();
  initMobileDrawer();
  renderCategoryTabs();
  renderPopularItems();
  renderMenuItems();
  initSearchAndFilter();
  initModals();
  initScrollReveal();
  initMouseParallaxAndTilt();
  initAuthUI();
  initFeedbackSection();

  function initAuthUI() {
    if (window.ApiClient && window.ApiClient.renderNavbarAuth) {
      window.ApiClient.renderNavbarAuth("navAuthContainer");
    }
  }

  /* ==========================================================================
     NAVBAR & SCROLL SPY
     ========================================================================== */
  function initNavbarScroll() {
    window.addEventListener("scroll", () => {
      if (siteNavbar) {
        siteNavbar.classList.toggle("scrolled", window.scrollY > 30);
      }
      updateActiveNavLink();
    }, { passive: true });

    // Smooth click handler with instant active state update
    document.querySelectorAll('.nav-link, .drawer-nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            e.preventDefault();
            const navbarHeight = siteNavbar ? siteNavbar.offsetHeight : 80;
            const targetPos = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight + 2;

            // Immediately activate clicked item
            document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
            document.querySelectorAll(`.nav-link[href="${href}"]`).forEach((l) => l.classList.add('active'));

            window.scrollTo({
              top: Math.max(0, targetPos),
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Run once on initial page load
    setTimeout(updateActiveNavLink, 100);
  }

  function updateActiveNavLink() {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    if (sections.length === 0) return;

    const navbarHeight = siteNavbar ? siteNavbar.offsetHeight : 80;
    const scrollPos = window.scrollY + navbarHeight + 60;

    let currentSectionId = "home";

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
        break;
      }
      if (scrollPos >= sectionTop) {
        currentSectionId = section.getAttribute("id");
      }
    }

    // Near the bottom of page, highlight last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
      currentSectionId = sections[sections.length - 1].getAttribute("id") || currentSectionId;
    }

    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    document.querySelectorAll(".drawer-nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* ==========================================================================
     MOBILE DRAWER
     ========================================================================== */
  function initMobileDrawer() {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      mobileDrawer.classList.toggle("open");
      document.body.style.overflow = mobileDrawer.classList.contains("open") ? "hidden" : "";
    });

    closeDrawerBtn.addEventListener("click", closeDrawer);
    mobileDrawer.addEventListener("click", (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });

    drawerNavLinks.forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });
  }

  function closeDrawer() {
    mobileToggle.classList.remove("active");
    mobileDrawer.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ==========================================================================
     CATEGORY TABS RENDER
     ========================================================================== */
  function renderCategoryTabs() {
    categoryTabsContainer.innerHTML = CATEGORIES.map((cat) => {
      const count =
        cat.id === "all"
          ? MENU_ITEMS.length
          : MENU_ITEMS.filter((item) => item.category === cat.id).length;

      const isActive = cat.id === currentCategory ? "active" : "";

      return `
        <button class="filter-btn ${isActive}" data-category="${cat.id}" id="filter-btn-${cat.id}">
          <i class="${cat.icon}"></i>
          <span>${cat.name}</span>
          <span class="filter-count">${count}</span>
        </button>
      `;
    }).join("");

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        renderMenuItems();
      });
    });
  }

  /* ==========================================================================
     POPULAR ITEMS SECTION
     ========================================================================== */
  function renderPopularItems() {
    popularGrid.innerHTML = POPULAR_ITEMS.map((item, idx) => `
      <article class="popular-card reveal reveal-delay-${(idx % 4) + 1}" id="popular-item-${item.id}">
        <div class="popular-card-image-wrap">
          <img src="${item.image}" alt="${item.name}" class="popular-card-image" loading="lazy" />
          <span class="popular-badge">
            <i class="fas fa-fire"></i> Popular
          </span>
          <span class="menu-card-diet-badge" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
            <span class="diet-icon-symbol ${item.isVeg ? 'veg' : 'nonveg'}"></span>
          </span>
        </div>
        <div class="popular-card-body">
          <div class="popular-card-header-row">
            <h3 class="popular-card-title">${item.name}</h3>
            <span class="popular-card-price-pill">₹${item.price.toFixed(2)}</span>
          </div>
          ${getItemRatingHtml(item)}
          <p class="popular-card-desc">${item.description}</p>
          <div class="popular-card-actions-bar">
            <div class="card-qty-control" onclick="event.stopPropagation();">
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty(${item.id}, -1, 'popular-qty-')" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <span class="card-qty-val" id="popular-qty-${item.id}">1</span>
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty(${item.id}, 1, 'popular-qty-')" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="btn-card-action btn-card-order" onclick="event.stopPropagation(); orderItemFromCard(${item.id}, 'popular-qty-')" aria-label="Order ${item.name}">
              <i class="fas fa-bag-shopping"></i> Order Now
            </button>
          </div>
        </div>
      </article>
    `).join("");

    initScrollReveal();
    attach3DTiltEffect(".popular-card");
  }

  /* ==========================================================================
     MAIN MENU ITEMS RENDER
     ========================================================================== */
  function renderMenuItems() {
    let filtered = MENU_ITEMS;

    if (currentCategory !== "all") {
      filtered = filtered.filter((item) => item.category === currentCategory);
    }

    if (currentDietFilter === "veg") {
      filtered = filtered.filter((item) => item.isVeg);
    } else if (currentDietFilter === "nonveg") {
      filtered = filtered.filter((item) => !item.isVeg);
    }

    if (currentSearchQuery.trim() !== "") {
      const query = currentSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.categoryLabel.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      menuGrid.innerHTML = `
        <div class="no-results-box reveal revealed">
          <div class="no-results-icon"><i class="fas fa-utensils-slash"></i></div>
          <h3 style="font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 0.5rem;">No dishes found</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.25rem;">Try adjusting your search query or dietary filter</p>
          <button class="btn btn-outline btn-sm" onclick="resetAllFilters()">
            <i class="fas fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    menuGrid.innerHTML = filtered.map((item, idx) => `
      <article class="menu-card reveal reveal-delay-${(idx % 4) + 1}" id="dish-card-${item.id}">
        <div class="menu-card-img-container">
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" />
          <span class="menu-card-category-badge">${item.categoryLabel}</span>
          <span class="menu-card-diet-badge" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
            <span class="diet-icon-symbol ${item.isVeg ? 'veg' : 'nonveg'}"></span>
          </span>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header-row">
            <h3 class="menu-card-name">${item.name}</h3>
            <span class="menu-card-price-pill">₹${item.price.toFixed(2)}</span>
          </div>
          ${getItemRatingHtml(item)}
          <p class="menu-card-desc">${item.description}</p>
          <div class="menu-card-actions-bar">
            <div class="card-qty-control" onclick="event.stopPropagation();">
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty(${item.id}, -1, 'menu-qty-')" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <span class="card-qty-val" id="menu-qty-${item.id}">1</span>
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty(${item.id}, 1, 'menu-qty-')" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="btn-card-action btn-card-order" onclick="event.stopPropagation(); orderItemFromCard(${item.id}, 'menu-qty-')" aria-label="Order ${item.name}">
              <i class="fas fa-bag-shopping"></i> Order Now
            </button>
          </div>
        </div>
      </article>
    `).join("");

    initScrollReveal();
    attach3DTiltEffect(".menu-card");
  }

  window.changeCardQty = function (itemId, delta, prefix = "") {
    const el = document.getElementById(`${prefix}${itemId}`);
    if (el) {
      let qty = parseInt(el.textContent, 10) || 1;
      qty = Math.max(1, qty + delta);
      el.textContent = qty;
    }
  };

  window.orderItemFromCard = function (itemId, prefix = "") {
    const el = document.getElementById(`${prefix}${itemId}`);
    const qty = el ? Math.max(1, parseInt(el.textContent, 10) || 1) : 1;
    if (typeof CartManager !== "undefined") {
      CartManager.addToCart(itemId, qty);
    } else if (window.CartManager) {
      window.CartManager.addToCart(itemId, qty);
    }
    if (el) {
      el.textContent = "1";
    }
  };

  window.handleCardClick = function (event, itemId) {
    // Card click modal disabled
  };

  /* ==========================================================================
     SEARCH & DIETARY CONTROLS
     ========================================================================== */
  function initSearchAndFilter() {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      clearSearchBtn.classList.toggle("show", currentSearchQuery.length > 0);
      renderMenuItems();
    });

    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      currentSearchQuery = "";
      clearSearchBtn.classList.remove("show");
      renderMenuItems();
    });

    dietFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const diet = btn.dataset.diet;

        if (btn.classList.contains("active")) {
          btn.classList.remove("active");
          currentDietFilter = "all";
        } else {
          dietFilterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          currentDietFilter = diet;
        }

        renderMenuItems();
      });
    });
  }

  window.resetAllFilters = function () {
    currentCategory = "all";
    currentSearchQuery = "";
    currentDietFilter = "all";
    searchInput.value = "";
    clearSearchBtn.classList.remove("show");
    dietFilterBtns.forEach((b) => b.classList.remove("active"));
    renderCategoryTabs();
    renderMenuItems();
  };

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal:not(.revealed)");
    
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(el => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ==========================================================================
     3D TILT EFFECT & MOUSE PARALLAX
     ========================================================================== */
  function initMouseParallaxAndTilt() {
    window.addEventListener("mousemove", (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      document.querySelectorAll(".ambient-blob").forEach((blob, index) => {
        const speed = (index + 1) * 12;
        blob.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
      });

    });

    const heroCard = document.getElementById("hero3DCard");
    if (heroCard) {
      heroCard.addEventListener("mousemove", (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 8;
        const rotateY = (x / (rect.width / 2)) * 8;
        heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      heroCard.addEventListener("mouseleave", () => {
        heroCard.style.transform = "";
      });
    }

    attach3DTiltEffect(".info-card");
    attach3DTiltEffect(".popular-card");
    attach3DTiltEffect(".menu-card");
  }

  function attach3DTiltEffect(selector) {
    document.querySelectorAll(selector).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 6;
        const rotateY = (x / (rect.width / 2)) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ==========================================================================
     ORDER MODAL & GENERAL MODALS
     ========================================================================== */
  function initModals() {
    if (closeOrderModal && orderModal) {
      closeOrderModal.addEventListener("click", () => closeModal(orderModal));

      orderModal.addEventListener("click", (e) => {
        if (e.target === orderModal) closeModal(orderModal);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeModal(orderModal);
        }
      });
    }

    const qtyMinusBtn = document.getElementById("qtyMinusBtn");
    const qtyPlusBtn = document.getElementById("qtyPlusBtn");
    const confirmBtn = document.getElementById("confirmDummyOrderBtn");

    if (qtyMinusBtn) {
      qtyMinusBtn.addEventListener("click", () => {
        if (orderQuantity > 1) {
          orderQuantity--;
          updateOrderModalValues();
        }
      });
    }

    if (qtyPlusBtn) {
      qtyPlusBtn.addEventListener("click", () => {
        if (orderQuantity < 20) {
          orderQuantity++;
          updateOrderModalValues();
        }
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (activeModalItem) {
          if (typeof CartManager !== "undefined") {
            CartManager.addToCart(activeModalItem, orderQuantity);
          } else if (window.CartManager) {
            window.CartManager.addToCart(activeModalItem, orderQuantity);
          }
        }
        closeModal(orderModal);
      });
    }
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("open");
    document.body.style.overflow = "";
  }

  window.openOrderModal = function (itemId) {
    const numericId = Number(itemId);
    const item = MENU_ITEMS.find((i) => i.id === numericId) || (typeof POPULAR_ITEMS !== "undefined" ? POPULAR_ITEMS.find((i) => i.id === numericId) : null);
    if (!item) return;

    activeModalItem = item;
    orderQuantity = 1;

    document.getElementById("orderModalImg").src = item.image;
    document.getElementById("orderModalImg").alt = item.name;
    document.getElementById("orderModalTitle").textContent = item.name;
    document.getElementById("orderModalCategory").textContent = item.categoryLabel;
    document.getElementById("orderModalDesc").textContent = item.description;

    updateOrderModalValues();
    openModal(orderModal);
  };

  function updateOrderModalValues() {
    if (!activeModalItem) return;
    document.getElementById("orderQtyDisplay").textContent = orderQuantity;
    const total = (activeModalItem.price * orderQuantity).toFixed(2);
    document.getElementById("orderModalPrice").textContent = `₹${total}`;
    document.getElementById("orderModalUnitPrice").textContent = `(₹${activeModalItem.price.toFixed(2)} each)`;
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  window.showToast = function (message, icon = "fa-bell") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <i class="fas ${icon}" style="color: var(--secondary);"></i>
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

  window.callRestaurant = function () {
    window.location.href = `tel:${RESTAURANT_INFO.rawPhone}`;
  };

  /* ==========================================================================
     CUSTOMER FEEDBACK & REVIEWS SYSTEM
     ========================================================================== */
  let feedbackList = [];
  let currentFeedbackIndex = 0;
  let feedbackCarouselInterval = null;
  let itemRatingsMap = {};

  function getItemRatingHtml(item) {
    if (!item) return "";
    const key = (item.name || "").toLowerCase().trim();
    const stats = itemRatingsMap[item.id] || itemRatingsMap[item._id] || itemRatingsMap[key];
    if (stats && stats.totalReviews > 0) {
      const avg = Number(stats.averageRating).toFixed(1);
      return `
        <div class="item-card-rating" title="${avg} stars from ${stats.totalReviews} reviews">
          <span class="item-rating-stars"><i class="fas fa-star"></i> ${avg}</span>
          <span class="item-review-count">(${stats.totalReviews} ${stats.totalReviews === 1 ? "review" : "reviews"})</span>
        </div>
      `;
    }
    return `
      <div class="item-card-rating">
        <span class="item-rating-badge-new"><i class="fas fa-sparkles"></i> New</span>
      </div>
    `;
  }

  function initFeedbackSection() {
    initStarRatingPicker();
    initFeedbackForm();
    initCarouselControls();
    populateFeedbackItemDropdown();
    loadFeedbackStats();
    loadFeedbackData();
  }

  // 1. Populate Food Item Dropdown dynamically from menu data
  function populateFeedbackItemDropdown() {
    const select = document.getElementById("feedbackItemSelect");
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = `<option value="overall" selected>Overall Restaurant Experience</option>`;

    const items = (typeof MENU_ITEMS !== "undefined" && Array.isArray(MENU_ITEMS)) ? MENU_ITEMS : [];
    items.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item._id || item.id;
      opt.textContent = `${item.name} (${item.categoryLabel || "Special"})`;
      select.appendChild(opt);
    });

    if (currentVal && select.querySelector(`option[value="${currentVal}"]`)) {
      select.value = currentVal;
    }
  }

  // 2. Load Overall Feedback Stats from MongoDB backend
  async function loadFeedbackStats() {
    const avgScoreEl = document.getElementById("feedbackAvgRating");
    const totalCountEl = document.getElementById("feedbackTotalCount");
    const starsDisplayEl = document.getElementById("overallStarsDisplay");

    try {
      let stats = null;
      if (window.ApiClient && window.ApiClient.getFeedbackStats) {
        const res = await window.ApiClient.getFeedbackStats();
        stats = res.data || res;
      } else {
        const res = await fetch("http://localhost:5000/api/feedback/stats");
        const json = await res.json();
        stats = json.data || json;
      }

      if (stats) {
        const total = stats.totalFeedback !== undefined ? stats.totalFeedback : 3;
        const avg = stats.averageRating !== undefined ? Number(stats.averageRating) : 5.0;
        const roundedAvg = avg.toFixed(1);

        if (avgScoreEl) avgScoreEl.textContent = roundedAvg;
        if (totalCountEl) {
          totalCountEl.textContent = total === 1 ? "1 Customer Review" : `${total} Customer Reviews`;
        }

        // Keep Contact Section Guest Feedback Card synchronized
        const contactRatingEl = document.getElementById("infoFeedbackRating");
        if (contactRatingEl) contactRatingEl.textContent = roundedAvg;
        const contactCountEl = document.getElementById("infoFeedbackReviewCount");
        if (contactCountEl) contactCountEl.textContent = `${total}`;

        // Build star icon HTML based on score
        let starHtml = "";
        const fullStars = Math.floor(avg);
        const hasHalf = avg - fullStars >= 0.4;
        for (let i = 1; i <= 5; i++) {
          if (i <= fullStars) {
            starHtml += '<i class="fas fa-star"></i>';
          } else if (i === fullStars + 1 && hasHalf) {
            starHtml += '<i class="fas fa-star-half-stroke"></i>';
          } else {
            starHtml += '<i class="far fa-star"></i>';
          }
        }

        // Render overall star icons for Feedback Section
        if (starsDisplayEl) {
          starsDisplayEl.innerHTML = starHtml;
        }

        // Render star icons for Contact Section Guest Feedback Card
        const contactStarsEl = document.getElementById("infoFeedbackStarsGroup");
        if (contactStarsEl) {
          contactStarsEl.innerHTML = starHtml;
        }

        // Keep Hero, About, and Footer dynamically synchronized
        const heroRatingEl = document.getElementById("heroRatingDisplay");
        if (heroRatingEl) heroRatingEl.textContent = `${roundedAvg} / 5 Rating`;

        const aboutStatEl = document.getElementById("aboutStatRating");
        if (aboutStatEl) aboutStatEl.textContent = `${roundedAvg} ★ Rating`;

        const footerRatingEl = document.getElementById("footerFeedbackRating");
        if (footerRatingEl) footerRatingEl.innerHTML = `${roundedAvg} / 5.0 Rating <span style="letter-spacing: 2px;">${'★'.repeat(fullStars)}${hasHalf ? '★' : ''}</span>`;

        const footerNotesEl = document.getElementById("footerFeedbackReviewsNote");
        if (footerNotesEl) footerNotesEl.textContent = `Based on ${total} Verified Customer Reviews`;
      }
    } catch (err) {
      console.warn("[Feedback Stats Warning]:", err.message);
      if (totalCountEl) totalCountEl.textContent = "3 Customer Reviews";
    }
  }

  // 3. Load Feedback Reviews from MongoDB backend
  async function loadFeedbackData() {
    const container = document.getElementById("feedbackCarouselContainer");
    if (!container) return;

    try {
      let data = [];
      if (window.ApiClient && window.ApiClient.getFeedback) {
        const res = await window.ApiClient.getFeedback(50);
        data = res.data || (Array.isArray(res) ? res : []);
      } else {
        const res = await fetch("http://localhost:5000/api/feedback");
        const json = await res.json();
        data = json.data || (Array.isArray(json) ? json : []);
      }

      feedbackList = Array.isArray(data) ? data : [];

      // Update breakdown progress bars
      updateRatingBreakdown(feedbackList);

      // Calculate item ratings map from feedback
      calculateItemRatingsMap(feedbackList);

      if (feedbackList.length === 0) {
        container.innerHTML = `
          <div class="feedback-empty-card">
            <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">❤️</div>
            <h4 style="font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 0.35rem;">Be the first to share your experience!</h4>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Tell us what you love about Zion Food Corner using the form below.</p>
          </div>
        `;
        renderCarouselDots();
        return;
      }

      currentFeedbackIndex = 0;
      renderFeedbackSlide(currentFeedbackIndex);
      renderCarouselDots();
      startCarouselAutoPlay();

      // Refresh menu card ratings
      renderPopularItems();
      renderMenuItems();
    } catch (err) {
      console.warn("[Feedback Load Error]:", err.message);
      container.innerHTML = `
        <div class="feedback-empty-card">
          <i class="fas fa-triangle-exclamation" style="font-size: 2rem; color: #DC2626; margin-bottom: 0.75rem;"></i>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.35rem;">Unable to load feedback right now.</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Please try again later or share your review below.</p>
        </div>
      `;
    }
  }

  // Dynamic Rating Breakdown Distribution
  function updateRatingBreakdown(feedbacks) {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const total = feedbacks.length;

    feedbacks.forEach((fb) => {
      const r = Math.round(Number(fb.rating)) || 5;
      if (counts[r] !== undefined) {
        counts[r]++;
      }
    });

    for (let star = 1; star <= 5; star++) {
      const fillEl = document.getElementById(`ratingBarFill${star}`);
      const countEl = document.getElementById(`ratingBarCount${star}`);
      const count = counts[star] || 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : (star === 5 ? 100 : 0);

      if (fillEl) fillEl.style.width = `${pct}%`;
      if (countEl) countEl.textContent = `${count}`;
    }
  }

  // Calculate rating stats per item for menu card badges
  function calculateItemRatingsMap(feedbacks) {
    itemRatingsMap = {};
    feedbacks.forEach((fb) => {
      if (fb.itemName && fb.rating) {
        const nameKey = fb.itemName.toLowerCase().trim();
        if (!itemRatingsMap[nameKey]) {
          itemRatingsMap[nameKey] = { totalReviews: 0, totalRating: 0, averageRating: 0 };
        }
        itemRatingsMap[nameKey].totalReviews += 1;
        itemRatingsMap[nameKey].totalRating += Number(fb.rating);
        itemRatingsMap[nameKey].averageRating = itemRatingsMap[nameKey].totalRating / itemRatingsMap[nameKey].totalReviews;
      }
      if (fb.itemId) {
        const idKey = String(fb.itemId);
        if (!itemRatingsMap[idKey]) {
          itemRatingsMap[idKey] = { totalReviews: 0, totalRating: 0, averageRating: 0 };
        }
        itemRatingsMap[idKey].totalReviews += 1;
        itemRatingsMap[idKey].totalRating += Number(fb.rating);
        itemRatingsMap[idKey].averageRating = itemRatingsMap[idKey].totalRating / itemRatingsMap[idKey].totalReviews;
      }
    });
  }

  // 4. Render Active Feedback Carousel Slide
  function renderFeedbackSlide(index) {
    const container = document.getElementById("feedbackCarouselContainer");
    if (!container || feedbackList.length === 0) return;

    if (index < 0) index = feedbackList.length - 1;
    if (index >= feedbackList.length) index = 0;
    currentFeedbackIndex = index;

    const item = feedbackList[currentFeedbackIndex];
    const initial = (item.name || "Customer").trim().charAt(0).toUpperCase();
    const ratingStars = Array.from({ length: 5 }, (_, i) =>
      i < (item.rating || 5) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
    ).join("");

    const itemBadgeText = item.itemName || "Overall Restaurant Experience";
    const timeAgo = formatTimeAgo(item.createdAt);

    container.innerHTML = `
      <div class="feedback-card" id="activeFeedbackCard">
        <i class="fas fa-quote-right feedback-card-quote-icon"></i>
        
        <div class="feedback-card-header">
          <div class="feedback-card-stars" aria-label="${item.rating} out of 5 stars">
            ${ratingStars}
          </div>
          <span class="feedback-item-pill">
            <i class="fas fa-utensils"></i> ${escapeHtml(itemBadgeText)} &bull; ${item.rating}.0 ★
          </span>
        </div>

        <p class="feedback-card-message">
          "${escapeHtml(item.message)}"
        </p>

        <div class="feedback-card-footer">
          <div class="feedback-author-group">
            <div class="feedback-avatar-circle">${initial}</div>
            <div>
              <div class="feedback-author-name">
                ${escapeHtml(item.name)}
                <i class="fas fa-circle-check feedback-verified-badge" title="Verified Customer"></i>
              </div>
              <span class="feedback-timestamp">${timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    updateCarouselDots();
  }

  // 5. Carousel Dots
  function renderCarouselDots() {
    const dotsContainer = document.getElementById("feedbackCarouselDots");
    if (!dotsContainer) return;

    if (feedbackList.length <= 1) {
      dotsContainer.innerHTML = "";
      return;
    }

    dotsContainer.innerHTML = feedbackList.map((_, idx) => `
      <button 
        type="button" 
        class="carousel-dot ${idx === currentFeedbackIndex ? 'active' : ''}" 
        data-slide-index="${idx}" 
        aria-label="Go to review ${idx + 1}"
      ></button>
    `).join("");

    dotsContainer.querySelectorAll(".carousel-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetIdx = parseInt(dot.dataset.slideIndex, 10);
        renderFeedbackSlide(targetIdx);
        startCarouselAutoPlay();
      });
    });
  }

  function updateCarouselDots() {
    const dotsContainer = document.getElementById("feedbackCarouselDots");
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentFeedbackIndex);
    });
  }

  // 6. Carousel Auto-play & Controls
  function startCarouselAutoPlay() {
    stopCarouselAutoPlay();
    if (feedbackList.length > 1) {
      feedbackCarouselInterval = setInterval(() => {
        nextFeedbackSlide();
      }, 4500);
    }
  }

  function stopCarouselAutoPlay() {
    if (feedbackCarouselInterval) {
      clearInterval(feedbackCarouselInterval);
      feedbackCarouselInterval = null;
    }
  }

  function nextFeedbackSlide() {
    if (feedbackList.length <= 1) return;
    renderFeedbackSlide(currentFeedbackIndex + 1);
  }

  function prevFeedbackSlide() {
    if (feedbackList.length <= 1) return;
    renderFeedbackSlide(currentFeedbackIndex - 1);
  }

  function initCarouselControls() {
    const prevBtn = document.getElementById("feedbackPrevBtn");
    const nextBtn = document.getElementById("feedbackNextBtn");
    const wrapper = document.getElementById("feedbackCarouselWrapper");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevFeedbackSlide();
        startCarouselAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextFeedbackSlide();
        startCarouselAutoPlay();
      });
    }

    if (wrapper) {
      wrapper.addEventListener("mouseenter", stopCarouselAutoPlay);
      wrapper.addEventListener("mouseleave", startCarouselAutoPlay);
    }
  }

  // 7. Interactive 1-5 Star Rating System
  function initStarRatingPicker() {
    const picker = document.getElementById("feedbackStarPicker");
    const ratingInput = document.getElementById("feedbackRatingValue");
    const labelPreview = document.getElementById("ratingLabelPreview");
    const ratingError = document.getElementById("feedbackRatingError");
    if (!picker || !ratingInput) return;

    const ratingLabels = {
      1: "1 Star - Needs Improvement 😞",
      2: "2 Stars - Fair 😐",
      3: "3 Stars - Good 🙂",
      4: "4 Stars - Great! 😋",
      5: "5 Stars - Outstanding! ⭐"
    };

    const starButtons = picker.querySelectorAll(".star-btn");

    function updateStarsDisplay(rating, isHover = false) {
      starButtons.forEach((btn) => {
        const val = parseInt(btn.dataset.rating, 10);
        if (val <= rating) {
          btn.classList.add(isHover ? "hovered" : "active");
          if (!isHover) btn.classList.remove("hovered");
        } else {
          btn.classList.remove("active", "hovered");
        }
      });

      if (labelPreview) {
        labelPreview.textContent = rating ? ratingLabels[rating] || `${rating} Stars` : "Select a rating";
      }
    }

    starButtons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        const hoverVal = parseInt(btn.dataset.rating, 10);
        updateStarsDisplay(hoverVal, true);
      });

      btn.addEventListener("click", () => {
        const selectVal = parseInt(btn.dataset.rating, 10);
        ratingInput.value = selectVal;
        updateStarsDisplay(selectVal, false);
        if (ratingError) ratingError.textContent = "";
      });
    });

    picker.addEventListener("mouseleave", () => {
      const currentVal = parseInt(ratingInput.value, 10) || 0;
      updateStarsDisplay(currentVal, false);
    });
  }

  // 8. Feedback Form Submission & Validation
  function initFeedbackForm() {
    const form = document.getElementById("feedbackForm");
    const nameInput = document.getElementById("feedbackName");
    const itemSelect = document.getElementById("feedbackItemSelect");
    const ratingInput = document.getElementById("feedbackRatingValue");
    const messageInput = document.getElementById("feedbackMessage");
    const submitBtn = document.getElementById("submitFeedbackBtn");
    const alertBox = document.getElementById("feedbackAlert");
    const charCounter = document.getElementById("feedbackCharCounter");

    if (!form) return;

    if (messageInput && charCounter) {
      messageInput.addEventListener("input", () => {
        const len = messageInput.value.length;
        charCounter.textContent = `${len} / 500`;
        if (len > 500) {
          charCounter.style.color = "#DC2626";
        } else {
          charCounter.style.color = "var(--text-muted)";
        }
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameError = document.getElementById("feedbackNameError");
      const ratingError = document.getElementById("feedbackRatingError");
      const messageError = document.getElementById("feedbackMessageError");
      if (nameError) nameError.textContent = "";
      if (ratingError) ratingError.textContent = "";
      if (messageError) messageError.textContent = "";
      if (alertBox) {
        alertBox.style.display = "none";
        alertBox.className = "feedback-alert-box";
      }

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const ratingVal = ratingInput ? parseInt(ratingInput.value, 10) : 0;
      const messageVal = messageInput ? messageInput.value.trim() : "";
      const selectedItemVal = itemSelect ? itemSelect.value : "overall";
      const selectedItemText = itemSelect && itemSelect.selectedIndex >= 0 ? itemSelect.options[itemSelect.selectedIndex].text.split(" (")[0] : "Overall Restaurant Experience";

      let hasError = false;

      // Validate Name
      if (!nameVal || nameVal.length < 2) {
        if (nameError) nameError.textContent = "Please enter your name (at least 2 characters).";
        hasError = true;
      }

      // Validate Rating
      if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
        if (ratingError) ratingError.textContent = "Please select a star rating (1 to 5 stars).";
        hasError = true;
      }

      // Validate Message
      if (!messageVal || messageVal.length < 5) {
        if (messageError) messageError.textContent = "Please write a feedback message (at least 5 characters).";
        hasError = true;
      } else if (messageVal.length > 500) {
        if (messageError) messageError.textContent = "Message cannot exceed 500 characters.";
        hasError = true;
      }

      if (hasError) return;

      const payload = {
        name: nameVal,
        itemId: selectedItemVal === "overall" ? null : selectedItemVal,
        itemName: selectedItemVal === "overall" ? "Overall Restaurant Experience" : selectedItemText,
        rating: ratingVal,
        message: messageVal
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Submitting...</span>';
      }

      try {
        let responseData = null;
        if (window.ApiClient && window.ApiClient.submitFeedback) {
          responseData = await window.ApiClient.submitFeedback(payload);
        } else {
          const res = await fetch("http://localhost:5000/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          responseData = await res.json();
          if (!res.ok) {
            throw new Error(responseData.message || "Failed to submit feedback");
          }
        }

        if (alertBox) {
          alertBox.className = "feedback-alert-box success";
          alertBox.innerHTML = '<i class="fas fa-circle-check"></i> <span>Thank you for your feedback! ❤️</span>';
          alertBox.style.display = "flex";
        }

        // Reset form state
        form.reset();
        if (ratingInput) ratingInput.value = "";
        const starButtons = document.querySelectorAll("#feedbackStarPicker .star-btn");
        starButtons.forEach((b) => b.classList.remove("active", "hovered"));
        const labelPreview = document.getElementById("ratingLabelPreview");
        if (labelPreview) labelPreview.textContent = "Select a rating";
        if (charCounter) charCounter.textContent = "0 / 500";

        // Refresh stats & reviews
        await loadFeedbackStats();
        await loadFeedbackData();

        const carousel = document.getElementById("feedbackCarouselWrapper");
        if (carousel) {
          carousel.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        setTimeout(() => {
          if (alertBox) alertBox.style.display = "none";
        }, 6000);
      } catch (err) {
        console.error("[Feedback Submit Error]:", err);
        if (alertBox) {
          alertBox.className = "feedback-alert-box error";
          alertBox.innerHTML = `<i class="fas fa-circle-exclamation"></i> <span>${err.message || "Unable to submit feedback. Please try again."}</span>`;
          alertBox.style.display = "flex";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Submit Feedback</span>';
        }
      }
    });
  }

  function formatTimeAgo(dateString) {
    if (!dateString) return "Recently";
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now - past;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSec < 60) return "Just now";
      if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? "min" : "mins"} ago`;
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
      if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
      return past.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return "Recently";
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
