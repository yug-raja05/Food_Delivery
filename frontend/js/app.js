/**
 * Zion Food Corner - Full-Stack Interactive Frontend Application
 * Seamlessly connects to MongoDB backend APIs via ApiClient
 */

document.addEventListener("DOMContentLoaded", async () => {
  // State
  let currentCategory = "all";
  let currentSearchQuery = "";
  let currentDietFilter = "all"; // 'all', 'veg', 'nonveg'
  let allMenuItems = [];
  let popularMenuItems = [];
  let activeCookingItem = null;
  let currentCookingStep = 0;
  let cookingAutoPlayTimer = null;

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

  // Cooking & Video Modal Elements
  const cookingModal = document.getElementById("cookingModal");
  const closeCookingModal = document.getElementById("closeCookingModal");
  const realtimeVideo = document.getElementById("cookingRealtimeVideo");
  const videoPlayPauseBtn = document.getElementById("videoPlayPauseBtn");
  const playPauseIcon = document.getElementById("playPauseIcon");
  const videoMuteBtn = document.getElementById("videoMuteBtn");
  const muteIcon = document.getElementById("muteIcon");
  const videoScrubberBar = document.getElementById("videoScrubberBar");
  const videoScrubberFill = document.getElementById("videoScrubberFill");
  const videoTimeDisplay = document.getElementById("videoTimeDisplay");

  // 1. Initial UI Setup
  initNavbarScroll();
  initMobileDrawer();
  initVideoControls();
  initModals();
  initMouseParallaxAndTilt();
  initAuthUI();
  initScrollReveal();
  initFeedbackSection();

  function initAuthUI() {
    if (window.ApiClient && window.ApiClient.renderNavbarAuth) {
      window.ApiClient.renderNavbarAuth("navAuthContainer");

      const user = window.ApiClient.getStoredUser();
      const drawerAuth = document.getElementById("drawerAuthContainer");
      if (drawerAuth && user && user.email) {
        drawerAuth.innerHTML = `
          <div class="drawer-nav-link" style="background: var(--bg-main); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <i class="fas fa-circle-user" style="color: var(--primary); font-size: 1.2rem;"></i>
              <div>
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--dark-charcoal);">${user.name || 'User'}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${user.email}</div>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline" style="padding: 2px 8px; font-size: 0.75rem; color: #DC2626;" onclick="window.ApiClient.logoutUser()">Sign Out</button>
          </div>
        `;
      }
    }
  }

  // 2. Fetch Data from Backend API in background
  loadRestaurantData();
  loadCategoriesData();
  loadMenuData();

  /* ==========================================================================
     API DATA LOADERS
     ========================================================================== */
  async function loadRestaurantData() {
    try {
      if (!window.ApiClient) return;
      const res = await window.ApiClient.getRestaurant();
      if (res && res.data) {
        const info = res.data;
        // Update phone links
        document.querySelectorAll("a[href^='tel:']").forEach((link) => {
          if (info.rawPhone) link.href = `tel:${info.rawPhone}`;
          if (link.id === "nav-btn-call" || link.id === "hero-btn-call") {
            // Keep styled buttons
          }
        });

        // Update status hours / status note if elements exist
        const statusHourEl = document.getElementById("topStatusHours");
        if (statusHourEl && info.statusHours) {
          statusHourEl.textContent = info.statusHours;
        }

        // Update feedback card rating and reviews if present
        const feedbackRatingEl = document.getElementById("infoFeedbackRating");
        if (feedbackRatingEl && info.rating) {
          feedbackRatingEl.textContent = Number(info.rating).toFixed(1);
        }
        const feedbackReviewCountEl = document.getElementById("infoFeedbackReviewCount");
        if (feedbackReviewCountEl && info.reviewCount) {
          feedbackReviewCountEl.textContent = `${info.reviewCount}`;
        }
      }
    } catch (e) {
      console.warn("Could not load restaurant metadata from backend:", e.message);
    }
  }

  async function loadCategoriesData() {
    try {
      if (!window.ApiClient) return;
      const res = await window.ApiClient.getCategories();
      if (res && res.data && res.data.length > 0) {
        renderCategoryTabs(res.data);
      }
    } catch (e) {
      console.warn("Could not load categories from backend:", e.message);
    }
  }

  async function loadMenuData() {
    // 1. Initialize immediately with fallback data if available
    if (window.MENU_ITEMS && Array.isArray(window.MENU_ITEMS) && window.MENU_ITEMS.length > 0) {
      if (allMenuItems.length === 0) {
        allMenuItems = [...window.MENU_ITEMS];
        popularMenuItems = allMenuItems.filter((i) => i.isPopular);
        renderPopularItems();
        renderMenuItems();
        initSearchAndFilter();
        populateFeedbackItemDropdown();
      }
    }

    try {
      if (window.ApiClient) {
        const [menuRes, popularRes] = await Promise.allSettled([
          window.ApiClient.getMenu(),
          window.ApiClient.getPopularItems()
        ]);

        if (menuRes.status === "fulfilled" && menuRes.value && menuRes.value.data && menuRes.value.data.length > 0) {
          allMenuItems = menuRes.value.data;
          window.__ALL_MENU_ITEMS = allMenuItems;
        }

        if (popularRes.status === "fulfilled" && popularRes.value && popularRes.value.data && popularRes.value.data.length > 0) {
          popularMenuItems = popularRes.value.data;
        } else if (allMenuItems.length > 0) {
          popularMenuItems = allMenuItems.filter((i) => i.isPopular);
        }
      }

      renderPopularItems();
      renderMenuItems();
      initSearchAndFilter();
      populateFeedbackItemDropdown();
    } catch (e) {
      console.warn("Could not fetch menu from backend API, using cached/local menu data:", e.message);
      if (allMenuItems.length === 0 && window.MENU_ITEMS) {
        allMenuItems = [...window.MENU_ITEMS];
        popularMenuItems = allMenuItems.filter((i) => i.isPopular);
        renderPopularItems();
        renderMenuItems();
        initSearchAndFilter();
        populateFeedbackItemDropdown();
      }
    }
  }

  /* ==========================================================================
     CATEGORY TABS RENDER
     ========================================================================== */
  function renderCategoryTabs(categories = []) {
    if (!categoryTabsContainer) return;

    const allTabs = [
      { slug: "all", name: "All Items", icon: "fas fa-utensils" },
      ...categories
    ];

    categoryTabsContainer.innerHTML = allTabs
      .map(
        (cat) => `
      <button 
        class="category-tab-btn ${cat.slug === currentCategory ? "active" : ""}" 
        data-category="${cat.slug}"
        id="tab-${cat.slug}"
      >
        <i class="${cat.icon || "fas fa-bowl-food"}"></i>
        <span>${cat.name}</span>
      </button>
    `
      )
      .join("");

    categoryTabsContainer.querySelectorAll(".category-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryTabsContainer.querySelectorAll(".category-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        renderMenuItems();
      });
    });
  }

  /* ==========================================================================
     POPULAR ITEMS RENDER
     ========================================================================== */
  function renderPopularItems() {
    if (!popularGrid) return;
    const items = popularMenuItems.length > 0 ? popularMenuItems : allMenuItems.filter((i) => i.isPopular);

    popularGrid.innerHTML = items
      .map(
        (item, idx) => `
      <article class="popular-card reveal reveal-delay-${(idx % 4) + 1}" id="popular-item-${item.id || item._id}">
        <div class="popular-card-image-wrap" onclick="openCookingModal('${item.id || item._id}')" style="cursor: pointer;" title="Click to view recipe & video">
          <img src="${item.image}" alt="${item.name}" class="popular-card-image" loading="lazy" />
          <span class="popular-badge">
            <i class="fas fa-fire"></i> Popular
          </span>
          <span class="menu-card-diet-badge" title="${item.isVeg ? "Vegetarian" : "Non-Vegetarian"}">
            <span class="diet-icon-symbol ${item.isVeg ? "veg" : "nonveg"}"></span>
          </span>
        </div>
        <div class="popular-card-body">
          <div class="popular-card-header-row">
            <h3 class="popular-card-title">${item.name}</h3>
            <span class="popular-card-price-pill">₹${Number(item.price).toFixed(2)}</span>
          </div>
          ${getItemRatingHtml(item)}
          <p class="popular-card-desc">${item.description || ""}</p>
          <div class="popular-card-actions-bar">
            <div class="card-qty-control" onclick="event.stopPropagation();">
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty('${item.id || item._id}', -1, 'popular-qty-')" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <span class="card-qty-val" id="popular-qty-${item.id || item._id}">1</span>
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty('${item.id || item._id}', 1, 'popular-qty-')" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="btn-card-action btn-card-order" onclick="event.stopPropagation(); orderItemFromCard('${item.id || item._id}', 'popular-qty-')" aria-label="Order ${item.name}">
              <i class="fas fa-bag-shopping"></i> Order Now
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    initScrollReveal();
    attach3DTiltEffect(".popular-card");
  }

  /* ==========================================================================
     MAIN MENU ITEMS RENDER
     ========================================================================== */
  function renderMenuItems() {
    if (!menuGrid) return;
    let filtered = [...allMenuItems];

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
          (item.name && item.name.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.categoryLabel && item.categoryLabel.toLowerCase().includes(query)) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
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

    menuGrid.innerHTML = filtered
      .map(
        (item, idx) => `
      <article class="menu-card reveal reveal-delay-${(idx % 4) + 1}" id="dish-card-${item.id || item._id}">
        <div class="menu-card-img-container" onclick="openCookingModal('${item.id || item._id}')" style="cursor: pointer;" title="Click to view recipe & video">
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" />
          <span class="menu-card-category-badge">${item.categoryLabel || ""}</span>
          <span class="menu-card-diet-badge" title="${item.isVeg ? "Vegetarian" : "Non-Vegetarian"}">
            <span class="diet-icon-symbol ${item.isVeg ? "veg" : "nonveg"}"></span>
          </span>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-header-row">
            <h3 class="menu-card-name">${item.name}</h3>
            <span class="menu-card-price-pill">₹${Number(item.price).toFixed(2)}</span>
          </div>
          ${getItemRatingHtml(item)}
          <p class="menu-card-desc">${item.description || ""}</p>
          <div class="menu-card-actions-bar">
            <div class="card-qty-control" onclick="event.stopPropagation();">
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty('${item.id || item._id}', -1, 'menu-qty-')" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <span class="card-qty-val" id="menu-qty-${item.id || item._id}">1</span>
              <button type="button" class="card-qty-btn" onclick="event.stopPropagation(); changeCardQty('${item.id || item._id}', 1, 'menu-qty-')" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="btn-card-action btn-card-order" onclick="event.stopPropagation(); orderItemFromCard('${item.id || item._id}', 'menu-qty-')" aria-label="Order ${item.name}">
              <i class="fas fa-bag-shopping"></i> Order Now
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    initScrollReveal();
    attach3DTiltEffect(".menu-card");
  }

  /* ==========================================================================
     GLOBAL CARD INTERACTIONS & HELPERS
     ========================================================================== */
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

    let targetItem = allMenuItems.find((i) => i.id === Number(itemId) || i._id === itemId || String(i.id) === String(itemId));
    if (!targetItem && window.__ALL_MENU_ITEMS) {
      targetItem = window.__ALL_MENU_ITEMS.find((i) => i.id === Number(itemId) || i._id === itemId);
    }

    if (window.CartManager) {
      window.CartManager.addToCart(targetItem || itemId, qty);
    }
    if (el) {
      el.textContent = "1";
    }
  };

  window.resetAllFilters = function () {
    currentCategory = "all";
    currentSearchQuery = "";
    currentDietFilter = "all";
    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.classList.remove("show");

    document.querySelectorAll(".category-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === "all");
    });
    document.querySelectorAll(".diet-toggle-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.diet === "all");
    });

    renderMenuItems();
  };

  /* ==========================================================================
     SEARCH & DIETARY CONTROLS
     ========================================================================== */
  function initSearchAndFilter() {
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle("show", currentSearchQuery.length > 0);
        }
        renderMenuItems();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentSearchQuery = "";
        clearSearchBtn.classList.remove("show");
        renderMenuItems();
      });
    }

    dietFilterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        dietFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentDietFilter = btn.dataset.diet;
        renderMenuItems();
      });
    });
  }

  /* ==========================================================================
     REAL-TIME VIDEO PLAYER & COOKING MODAL
     ========================================================================== */
  window.openCookingModal = function (itemId) {
    if (!cookingModal) return;

    let item = allMenuItems.find((i) => i.id === Number(itemId) || i._id === itemId || String(i.id) === String(itemId));
    if (!item && window.__ALL_MENU_ITEMS) {
      item = window.__ALL_MENU_ITEMS.find((i) => i.id === Number(itemId) || i._id === itemId);
    }
    if (!item) return;

    activeCookingItem = item;
    currentCookingStep = 0;

    // Load Video Stream
    if (realtimeVideo) {
      realtimeVideo.poster = item.videoPoster || item.image || "";
      realtimeVideo.src = item.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-43407-large.mp4";
      realtimeVideo.load();
      realtimeVideo.play().catch(() => {
        realtimeVideo.muted = true;
        realtimeVideo.play();
      });
    }

    // Modal Header Meta
    const titleEl = document.getElementById("cookingModalTitle");
    if (titleEl) titleEl.textContent = `Realtime Cooking: ${item.name}`;

    const priceEl = document.getElementById("cookingModalPrice");
    if (priceEl) priceEl.textContent = `₹${Number(item.price).toFixed(2)}`;

    const catEl = document.getElementById("cookingModalCategory");
    if (catEl) catEl.textContent = item.categoryLabel || "";

    const dietSymbol = document.getElementById("cookingModalDietSymbol");
    if (dietSymbol) {
      dietSymbol.className = `diet-icon-symbol ${item.isVeg ? "veg" : "nonveg"}`;
    }

    // Meta Grid Values
    const timeVal = document.getElementById("cookingTimeVal");
    if (timeVal) timeVal.textContent = item.cookingTime || "15 mins";

    const techVal = document.getElementById("cookingTechniqueVal");
    if (techVal) techVal.textContent = item.technique || "Traditional High Flame";

    const spiceVal = document.getElementById("cookingSpiceVal");
    if (spiceVal) spiceVal.textContent = item.spiceLevel || "Medium Spicy 🔥";

    // Ingredients Chips
    const ingRow = document.getElementById("cookingIngredientsRow");
    if (ingRow) {
      ingRow.innerHTML = (item.ingredients || [])
        .map(
          (ing) => `
        <span class="ingredient-chip">
          <span>${ing.icon || "🌿"}</span> <span>${ing.name}</span>
        </span>
      `
        )
        .join("");
    }

    // Direct Add to Cart inside Cooking Modal
    const orderBtn = document.getElementById("cookingOrderBtn");
    if (orderBtn) {
      orderBtn.onclick = () => {
        if (window.CartManager) {
          window.CartManager.addToCart(item, 1);
        }
        closeModal(cookingModal);
      };
    }

    updateCookingStepView();
    openModal(cookingModal);
    startCookingAutoPlay();
  };

  function updateCookingStepView() {
    if (!activeCookingItem || !activeCookingItem.cookingSteps || activeCookingItem.cookingSteps.length === 0) return;

    const steps = activeCookingItem.cookingSteps;
    const stepData = steps[currentCookingStep] || steps[0];

    const actionText = document.getElementById("videoActionText");
    if (actionText) actionText.textContent = stepData.actionText || "Sizzling in the kitchen...";

    const stepIndicator = document.getElementById("cookingStepIndicator");
    if (stepIndicator) stepIndicator.textContent = `Phase ${currentCookingStep + 1} of ${steps.length}`;

    // Timeline Progress Bar
    const progressEl = document.getElementById("cookingTimelineProgress");
    if (progressEl) {
      const progressPct = (currentCookingStep / Math.max(1, steps.length - 1)) * 80;
      progressEl.style.width = `${progressPct}%`;
    }

    [1, 2, 3].forEach((num, idx) => {
      const node = document.getElementById(`stepNode${num}`);
      if (!node) return;
      node.className = "timeline-step-node";
      if (idx === currentCookingStep) {
        node.classList.add("active");
      } else if (idx < currentCookingStep) {
        node.classList.add("completed");
      }
    });

    const stepCard = document.getElementById("cookingStepCard");
    if (stepCard) {
      stepCard.style.animation = "none";
      void stepCard.offsetHeight;
      stepCard.style.animation = "fadeInStep 0.35s ease";
    }

    const titleEl = document.getElementById("stepCardTitle");
    if (titleEl) titleEl.textContent = `${stepData.step || currentCookingStep + 1}. ${stepData.title || ""}`;

    const descEl = document.getElementById("stepCardDesc");
    if (descEl) descEl.textContent = stepData.desc || "";

    const prevBtn = document.getElementById("cookingPrevBtn");
    if (prevBtn) {
      prevBtn.disabled = currentCookingStep === 0;
      prevBtn.style.opacity = currentCookingStep === 0 ? "0.5" : "1";
    }

    const nextBtn = document.getElementById("cookingNextBtn");
    if (nextBtn) {
      nextBtn.innerHTML =
        currentCookingStep === steps.length - 1
          ? `Replay Video <i class="fas fa-rotate-right"></i>`
          : `Next Phase <i class="fas fa-chevron-right"></i>`;
    }
  }

  function startCookingAutoPlay() {
    clearInterval(cookingAutoPlayTimer);
    if (!activeCookingItem || !activeCookingItem.cookingSteps) return;
    cookingAutoPlayTimer = setInterval(() => {
      if (!cookingModal || !cookingModal.classList.contains("open") || !activeCookingItem) {
        clearInterval(cookingAutoPlayTimer);
        return;
      }
      currentCookingStep = (currentCookingStep + 1) % activeCookingItem.cookingSteps.length;
      updateCookingStepView();
    }, 6000);
  }

  window.jumpToCookingStep = function (stepIdx) {
    currentCookingStep = stepIdx;
    updateCookingStepView();
    startCookingAutoPlay();
  };

  window.nextCookingStep = function () {
    if (!activeCookingItem || !activeCookingItem.cookingSteps) return;
    currentCookingStep = (currentCookingStep + 1) % activeCookingItem.cookingSteps.length;
    updateCookingStepView();
    startCookingAutoPlay();
  };

  window.prevCookingStep = function () {
    if (!activeCookingItem || currentCookingStep === 0) return;
    currentCookingStep--;
    updateCookingStepView();
    startCookingAutoPlay();
  };

  function initVideoControls() {
    if (!realtimeVideo) return;

    if (videoPlayPauseBtn) {
      videoPlayPauseBtn.addEventListener("click", () => {
        if (realtimeVideo.paused) realtimeVideo.play();
        else realtimeVideo.pause();
      });
    }

    if (videoMuteBtn) {
      videoMuteBtn.addEventListener("click", () => {
        realtimeVideo.muted = !realtimeVideo.muted;
        if (muteIcon) {
          muteIcon.className = realtimeVideo.muted ? "fas fa-volume-xmark" : "fas fa-volume-high";
        }
      });
    }

    realtimeVideo.addEventListener("timeupdate", () => {
      if (realtimeVideo.duration && videoScrubberFill && videoTimeDisplay) {
        const pct = (realtimeVideo.currentTime / realtimeVideo.duration) * 100;
        videoScrubberFill.style.width = `${pct}%`;

        const curM = Math.floor(realtimeVideo.currentTime / 60).toString().padStart(2, "0");
        const curS = Math.floor(realtimeVideo.currentTime % 60).toString().padStart(2, "0");
        const durM = Math.floor(realtimeVideo.duration / 60).toString().padStart(2, "0");
        const durS = Math.floor(realtimeVideo.duration % 60).toString().padStart(2, "0");
        videoTimeDisplay.textContent = `${curM}:${curS} / ${durM}:${durS}`;
      }
    });

    if (videoScrubberBar) {
      videoScrubberBar.addEventListener("click", (e) => {
        const rect = videoScrubberBar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (realtimeVideo.duration) {
          realtimeVideo.currentTime = clickPos * realtimeVideo.duration;
        }
      });
    }

    realtimeVideo.addEventListener("play", () => {
      if (playPauseIcon) playPauseIcon.className = "fas fa-pause";
    });

    realtimeVideo.addEventListener("pause", () => {
      if (playPauseIcon) playPauseIcon.className = "fas fa-play";
    });
  }

  function initModals() {
    if (closeCookingModal && cookingModal) {
      closeCookingModal.addEventListener("click", () => closeModal(cookingModal));
      cookingModal.addEventListener("click", (e) => {
        if (e.target === cookingModal) closeModal(cookingModal);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cookingModal && cookingModal.classList.contains("open")) {
        closeModal(cookingModal);
      }
    });
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
    clearInterval(cookingAutoPlayTimer);
    if (realtimeVideo) realtimeVideo.pause();
  }

  /* ==========================================================================
     NAVBAR, DRAWER & SCROLL SPY
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

  function initMobileDrawer() {
    if (!mobileToggle || !mobileDrawer) return;

    mobileToggle.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
      document.body.style.overflow = mobileDrawer.classList.contains("open") ? "hidden" : "";
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        document.body.style.overflow = "";
      });
    }

    drawerNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal:not(.revealed)");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

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

    const items = (allMenuItems && allMenuItems.length > 0) ? allMenuItems : (typeof MENU_ITEMS !== "undefined" ? MENU_ITEMS : []);
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
