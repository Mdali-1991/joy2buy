/**
 * @file app.js — Joy2buy Main Application Logic
 * @description Single IIFE module that exports `window.App`. Handles:
 *   - Product data store (14 products / 4 categories)
 *   - Cart state persisted in sessionStorage via a nested IIFE
 *   - DOM rendering of featured products (index.html) and product grid (products.html)
 *   - Live search + category filter + price filter + rating filter + sort
 *   - History API integration via window.Navigation for URL state
 *   - Simulated async product load via window.API
 *   - Toast notification system (no alert() anywhere)
 *   - Countdown timer for deals banner
 *   - Newsletter form handling
 *   - Contact form submit handling
 *   - Cart page rendering + quantity controls + checkout multi-step flow
 *
 * @module App
 */

/* jshint esversion: 6 */
"use strict";

window.App = (function () {

  // ─── Debug flag ─────────────────────────────────────────────────────────────

  /** @constant {boolean} DEBUG — set false for production */
  var DEBUG = false;

  /**
   * Internal log helper — only emits when DEBUG is true.
   * @param {string} msg
   * @param {*} [data]
   */
  function _log(msg, data) {
    if (!DEBUG) { return; }
    if (data !== undefined) {
      console.log("[App]", msg, data);
    } else {
      console.log("[App]", msg);
    }
  }

  // ─── Named constants (no magic numbers) ─────────────────────────────────────

  /** @constant {number} COUNTDOWN_HOURS — deals banner timer duration */
  var COUNTDOWN_HOURS = 8;

  /** @constant {number} COUNTDOWN_MS */
  var COUNTDOWN_MS = COUNTDOWN_HOURS * 60 * 60 * 1000;

  /** @constant {number} DELIVERY_FREE_THRESHOLD — spend needed for free delivery */
  var DELIVERY_FREE_THRESHOLD = 50;

  /** @constant {number} STANDARD_DELIVERY_COST */
  var STANDARD_DELIVERY_COST = 4.99;

  /** @constant {number} MAX_PRICE_FILTER — upper limit on price slider */
  var MAX_PRICE_FILTER = 500;

  /** @constant {number} MESSAGE_MAX_CHARS — max chars in contact textarea */
  var MESSAGE_MAX_CHARS = 500;

  /** @constant {string} STORAGE_KEY — sessionStorage key for cart */
  var STORAGE_KEY = "joy2buy_cart_v2";

  /** @constant {number} CHECKOUT_SIMULATE_MS — delay for fake "processing" */
  var CHECKOUT_SIMULATE_MS = 1500;

  // ─── Product Data Store ──────────────────────────────────────────────────────

  /**
   * @typedef {object} Product
   * @property {number}      id
   * @property {string}      name
   * @property {string}      category    — 'electronics'|'fashion'|'home'|'sports'
   * @property {number}      price
   * @property {number|null} oldPrice    — null if not on sale
   * @property {number}      rating      — 0–5
   * @property {number}      reviews
   * @property {string}      icon        — Font Awesome class e.g. 'fa-headphones'
   * @property {string|null} badge
   * @property {string}      badgeClass  — Bootstrap bg-* class(es)
   * @property {string}      description
   */

  /** @type {Product[]} */
  var PRODUCTS = [
    {
      id: 1, name: "Wireless Noise-Cancelling Headphones",
      category: "electronics", price: 89.99, oldPrice: 149.99,
      rating: 4.8, reviews: 312, icon: "fa-headphones",
      badge: "Sale", badgeClass: "bg-danger",
      description: "Premium over-ear headphones with 40-hour battery life, active noise cancellation and deep bass."
    },
    {
      id: 2, name: "Smart Watch Pro Series 5",
      category: "electronics", price: 199.99, oldPrice: 249.99,
      rating: 4.7, reviews: 186, icon: "fa-clock",
      badge: "New", badgeClass: "bg-primary",
      description: "Track fitness, manage notifications and monitor heart rate with a vibrant always-on display."
    },
    {
      id: 3, name: "Ultra HD 4K Webcam",
      category: "electronics", price: 79.99, oldPrice: null,
      rating: 4.5, reviews: 94, icon: "fa-video",
      badge: null, badgeClass: "",
      description: "Crystal-clear 4K video conferencing camera with built-in ring light and noise-cancelling mic."
    },
    {
      id: 4, name: "Portable Bluetooth Speaker",
      category: "electronics", price: 49.99, oldPrice: 69.99,
      rating: 4.6, reviews: 228, icon: "fa-volume-high",
      badge: "Sale", badgeClass: "bg-danger",
      description: "360-degree sound, waterproof IPX7 rating and 20-hour playtime in a compact design."
    },
    {
      id: 5, name: "Slim Laptop Backpack",
      category: "fashion", price: 39.99, oldPrice: 59.99,
      rating: 4.4, reviews: 155, icon: "fa-briefcase",
      badge: "Sale", badgeClass: "bg-danger",
      description: "Anti-theft waterproof backpack with USB charging port and padded 15.6-inch laptop compartment."
    },
    {
      id: 6, name: "Classic Oxford Trainers",
      category: "fashion", price: 64.99, oldPrice: null,
      rating: 4.3, reviews: 87, icon: "fa-shoe-prints",
      badge: null, badgeClass: "",
      description: "Handcrafted leather-upper trainers with memory foam insoles and non-slip soles."
    },
    {
      id: 7, name: "Merino Wool Crew Neck Sweater",
      category: "fashion", price: 54.99, oldPrice: 79.99,
      rating: 4.7, reviews: 203, icon: "fa-shirt",
      badge: "Sale", badgeClass: "bg-danger",
      description: "Ethically sourced extra-fine merino wool. Warm, soft and machine washable."
    },
    {
      id: 8, name: "Polarised Sunglasses",
      category: "fashion", price: 29.99, oldPrice: null,
      rating: 4.2, reviews: 64, icon: "fa-glasses",
      badge: "New", badgeClass: "bg-primary",
      description: "UV400 polarised lenses with lightweight TR90 frame. Available in four colours."
    },
    {
      id: 9, name: "Bamboo Chopping Board Set",
      category: "home", price: 24.99, oldPrice: 34.99,
      rating: 4.5, reviews: 118, icon: "fa-kitchen-set",
      badge: "Sale", badgeClass: "bg-danger",
      description: "Set of three sustainably sourced bamboo boards with juice groove and non-slip feet."
    },
    {
      id: 10, name: "Scented Soy Candle Collection",
      category: "home", price: 18.99, oldPrice: null,
      rating: 4.8, reviews: 279, icon: "fa-fire",
      badge: "Best Seller", badgeClass: "bg-warning text-dark",
      description: "Set of four hand-poured natural soy candles. Burns for 45 hours each. Vegan-friendly."
    },
    {
      id: 11, name: "Smart LED Desk Lamp",
      category: "home", price: 44.99, oldPrice: 59.99,
      rating: 4.6, reviews: 142, icon: "fa-lightbulb",
      badge: "Sale", badgeClass: "bg-danger",
      description: "USB-C charging, five colour temperatures, touch dimmer and auto-off timer."
    },
    {
      id: 12, name: "Resistance Band Set (5 Levels)",
      category: "sports", price: 19.99, oldPrice: 29.99,
      rating: 4.4, reviews: 196, icon: "fa-dumbbell",
      badge: "Sale", badgeClass: "bg-danger",
      description: "Latex-free resistance bands from light to extra-heavy. Includes carry bag and exercise guide."
    },
    {
      id: 13, name: "Yoga Mat — Non-Slip 6mm",
      category: "sports", price: 34.99, oldPrice: null,
      rating: 4.7, reviews: 321, icon: "fa-person-praying",
      badge: "Best Seller", badgeClass: "bg-warning text-dark",
      description: "Extra-thick 6mm eco TPE mat with alignment lines, carry strap and high-grip surface."
    },
    {
      id: 14, name: "Insulated Water Bottle 1L",
      category: "sports", price: 22.99, oldPrice: 32.99,
      rating: 4.9, reviews: 508, icon: "fa-bottle-water",
      badge: "Top Rated", badgeClass: "bg-success",
      description: "Triple-wall stainless steel keeps drinks cold 24 hours or hot 12 hours. Leak-proof lid."
    }
  ];

  /** @constant {number[]} FEATURED_IDS — product IDs shown on the homepage */
  var FEATURED_IDS = [1, 2, 7, 10, 13, 14];

  // ─── Available promo codes ───────────────────────────────────────────────────

  /** @type {object.<string, number>} */
  var PROMO_CODES = {
    "JOY10":   10,
    "SAVE20":  20,
    "FIRST15": 15
  };

  // ─── Cart sub-module (IIFE) ──────────────────────────────────────────────────

  /**
   * @namespace Cart
   * @description Manages cart state in sessionStorage. Dispatches a
   *   custom "cartUpdated" event on every mutation.
   */
  var Cart = (function () {

    /** @type {{ items: object[], promoCode: string|null, discount: number }} */
    var _state = { items: [], promoCode: null, discount: 0 };

    function _load() {
      try {
        var raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.items)) {
            _state = parsed;
          }
        }
      } catch (e) {
        _state = { items: [], promoCode: null, discount: 0 };
      }
    }

    function _save() {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
      } catch (e) {
        // sessionStorage unavailable — silently degrade
      }
    }

    function _findIdx(id) {
      var sid = String(id);
      for (var i = 0; i < _state.items.length; i++) {
        if (String(_state.items[i].id) === sid) { return i; }
      }
      return -1;
    }

    function _totalQty() {
      var n = 0;
      for (var i = 0; i < _state.items.length; i++) { n += _state.items[i].quantity; }
      return n;
    }

    function _subtotal() {
      var t = 0;
      for (var i = 0; i < _state.items.length; i++) {
        t += _state.items[i].price * _state.items[i].quantity;
      }
      return t;
    }

    function _notify() {
      var sub = _subtotal();
      var disc = Math.min(_state.discount, sub);
      var deliv = (sub >= DELIVERY_FREE_THRESHOLD || sub === 0) ? 0 : STANDARD_DELIVERY_COST;
      var payload = {
        items:     _state.items.slice(),
        itemCount: _totalQty(),
        subtotal:  sub,
        delivery:  deliv,
        discount:  disc,
        total:     Math.max(0, sub - disc + deliv),
        promoCode: _state.promoCode
      };
      document.dispatchEvent(new CustomEvent("cartUpdated", { detail: payload }));
    }

    function _updateBadge() {
      var count = _totalQty();
      var badges = document.querySelectorAll("#cart-count");
      for (var i = 0; i < badges.length; i++) {
        badges[i].textContent = String(count);
        if (count === 0) {
          badges[i].classList.add("d-none");
        } else {
          badges[i].classList.remove("d-none");
        }
      }
    }

    /**
     * Initialise cart from sessionStorage. Call once on DOMContentLoaded.
     */
    function init() {
      _load();
      _updateBadge();
    }

    /**
     * Add a product to the cart. Increments quantity if already present.
     * @param {Product} product
     * @param {number} [qty=1]
     * @returns {'added'|'incremented'}
     */
    function addItem(product, qty) {
      qty = (typeof qty === "number" && qty > 0) ? Math.floor(qty) : 1;
      var idx = _findIdx(product.id);
      if (idx === -1) {
        _state.items.push({
          id:       product.id,
          name:     product.name,
          price:    product.price,
          category: product.category || "",
          icon:     product.icon || "fa-box",
          quantity: qty
        });
        _save(); _notify(); _updateBadge();
        return "added";
      }
      _state.items[idx].quantity += qty;
      _save(); _notify(); _updateBadge();
      return "incremented";
    }

    /**
     * Remove a product from the cart entirely.
     * @param {number|string} id
     */
    function removeItem(id) {
      var idx = _findIdx(id);
      if (idx !== -1) {
        _state.items.splice(idx, 1);
        _save(); _notify(); _updateBadge();
      }
    }

    /**
     * Update the quantity of a cart item. Removes it if qty <= 0.
     * @param {number|string} id
     * @param {number} newQty
     */
    function updateQuantity(id, newQty) {
      var q = parseInt(newQty, 10);
      if (isNaN(q) || q <= 0) { removeItem(id); return; }
      var idx = _findIdx(id);
      if (idx !== -1) {
        _state.items[idx].quantity = q;
        _save(); _notify(); _updateBadge();
      }
    }

    /**
     * Remove all items and reset the promo code.
     */
    function clearCart() {
      _state = { items: [], promoCode: null, discount: 0 };
      _save(); _notify(); _updateBadge();
    }

    /**
     * Apply a promo code.
     * @param {string} code
     * @returns {{ valid: boolean, message: string, discount: number }}
     */
    function applyPromo(code) {
      var upper = String(code).trim().toUpperCase();
      if (Object.prototype.hasOwnProperty.call(PROMO_CODES, upper)) {
        _state.promoCode = upper;
        _state.discount  = PROMO_CODES[upper];
        _save(); _notify();
        return { valid: true, message: upper + " applied — £" + PROMO_CODES[upper] + " off!", discount: PROMO_CODES[upper] };
      }
      return { valid: false, message: "Invalid promo code. Try JOY10, SAVE20, or FIRST15.", discount: 0 };
    }

    /**
     * Return a read-only snapshot of the current cart state.
     * @returns {object}
     */
    function getSummary() {
      var sub  = _subtotal();
      var disc = Math.min(_state.discount, sub);
      var deliv = (sub >= DELIVERY_FREE_THRESHOLD || sub === 0) ? 0 : STANDARD_DELIVERY_COST;
      return {
        items:     _state.items.slice(),
        itemCount: _totalQty(),
        subtotal:  sub,
        delivery:  deliv,
        discount:  disc,
        total:     Math.max(0, sub - disc + deliv),
        promoCode: _state.promoCode
      };
    }

    /**
     * Check if a product is in the cart.
     * @param {number|string} id
     * @returns {boolean}
     */
    function hasItem(id) { return _findIdx(id) !== -1; }

    return { init, addItem, removeItem, updateQuantity, clearCart, applyPromo, getSummary, hasItem };

  }());

  // ─── Utility functions ───────────────────────────────────────────────────────

  /**
   * Show a Bootstrap toast notification.
   * @param {string} message
   * @param {'success'|'danger'|'warning'} [type='success']
   */
  function showToast(message, type) {
    type = type || "success";
    var toastEl = document.getElementById("toast-notification");
    var msgEl   = document.getElementById("toast-message");
    if (!toastEl || !msgEl) { return; }

    toastEl.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
    toastEl.classList.add("text-bg-" + type);

    if (type === "warning") {
      toastEl.classList.add("text-dark");
    } else {
      toastEl.classList.remove("text-dark");
    }

    msgEl.textContent = message;
    var bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
    bsToast.show();
  }

  /**
   * Format a number as a UK pound string.
   * @param {number} amount
   * @returns {string} — e.g. "£12.99"
   */
  function formatPrice(amount) {
    return "£" + Number(amount).toFixed(2);
  }

  /**
   * Generate HTML for star icons representing a rating.
   * @param {number} rating — 0 to 5
   * @returns {string}
   */
  function renderStars(rating) {
    var full  = Math.floor(rating);
    var half  = (rating - full >= 0.5) ? 1 : 0;
    var empty = 5 - full - half;
    var html  = "";
    var i;

    for (i = 0; i < full;  i++) { html += '<i class="fa-solid fa-star text-warning" aria-hidden="true"></i>'; }
    if (half)                    { html += '<i class="fa-solid fa-star-half-stroke text-warning" aria-hidden="true"></i>'; }
    for (i = 0; i < empty; i++) { html += '<i class="fa-regular fa-star text-warning" aria-hidden="true"></i>'; }

    return html;
  }

  /**
   * Find a product in PRODUCTS by its numeric ID.
   * @param {number} id
   * @returns {Product|null}
   */
  function findProductById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) { return PRODUCTS[i]; }
    }
    return null;
  }

  // ─── Product card template ────────────────────────────────────────────────────

  /**
   * Build the HTML string for a single product card.
   * Uses textContent-safe values for user-visible data; product data
   * is a trusted array defined in this file, so template injection is safe.
   * @param {Product} product
   * @returns {string}
   */
  function buildProductCard(product) {
    var badgeHtml = product.badge
      ? '<span class="badge product-badge ' + product.badgeClass + '">' + product.badge + '</span>'
      : "";

    var oldPriceHtml = product.oldPrice
      ? '<span class="product-price-old ms-2">' + formatPrice(product.oldPrice) + '</span>'
      : "";

    var inCart      = Cart.hasItem(product.id);
    var btnLabel    = inCart ? "In Cart" : "Add to Cart";
    var btnIcon     = inCart ? "fa-check" : "fa-cart-shopping";
    var btnClass    = inCart ? "btn-add-to-cart btn btn-success w-100" : "btn-add-to-cart btn btn-primary-custom w-100";

    return (
      '<div class="col-sm-6 col-xl-4">' +
        '<article class="card h-100 product-card border-0 shadow-sm position-relative">' +
          badgeHtml +
          '<button class="product-wishlist-btn" ' +
            'aria-label="Add ' + product.name + ' to wishlist" ' +
            'data-id="' + product.id + '" type="button">' +
            '<i class="fa-regular fa-heart" aria-hidden="true"></i>' +
          '</button>' +
          '<div class="product-img-placeholder" aria-hidden="true">' +
            '<i class="fa-solid ' + product.icon + ' fs-1 text-muted mb-2" aria-hidden="true"></i>' +
            '<small class="text-muted text-capitalize">' + product.category + '</small>' +
          '</div>' +
          '<div class="card-body d-flex flex-column">' +
            '<p class="text-muted small text-uppercase mb-1 product-category-label">' + product.category + '</p>' +
            '<h3 class="card-title h6 fw-bold mb-2">' + product.name + '</h3>' +
            '<div class="d-flex align-items-center gap-2 mb-2">' +
              '<div class="product-rating" aria-label="Rated ' + product.rating + ' out of 5">' +
                renderStars(product.rating) +
              '</div>' +
              '<small class="text-muted">(' + product.reviews + ')</small>' +
            '</div>' +
            '<p class="text-muted small mb-3 product-desc">' + product.description + '</p>' +
            '<div class="mt-auto">' +
              '<div class="d-flex align-items-center mb-3">' +
                '<span class="product-price">' + formatPrice(product.price) + '</span>' +
                oldPriceHtml +
              '</div>' +
              '<button class="' + btnClass + '" data-id="' + product.id + '" type="button" ' +
                'aria-label="' + (inCart ? "Already in cart: " : "Add to cart: ") + product.name + '">' +
                '<i class="fa-solid ' + btnIcon + ' me-2" aria-hidden="true"></i>' + btnLabel +
              '</button>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</div>'
    );
  }

  // ─── Cart button event attachment ────────────────────────────────────────────

  /**
   * Attach click listeners to all "Add to Cart" buttons within a container.
   * @param {Element} container
   */
  function attachCartListeners(container) {
    var buttons = container.querySelectorAll(".btn-add-to-cart");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var id      = parseInt(this.getAttribute("data-id"), 10);
        var product = findProductById(id);
        if (!product) { return; }

        var result = Cart.addItem(product);
        if (result === "added") {
          showToast('"' + product.name + '" added to cart!', "success");
        } else {
          showToast('"' + product.name + '" quantity updated.', "success");
        }

        this.innerHTML = '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>In Cart';
        this.className = "btn-add-to-cart btn btn-success w-100";
        this.setAttribute("aria-label", "Already in cart: " + product.name);
      });
    }
  }

  /**
   * Attach click listeners to all wishlist toggle buttons within a container.
   * @param {Element} container
   */
  function attachWishlistListeners(container) {
    var buttons = container.querySelectorAll(".product-wishlist-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var icon     = this.querySelector("i");
        var isActive = this.classList.contains("active");
        if (isActive) {
          this.classList.remove("active");
          if (icon) { icon.className = "fa-regular fa-heart"; }
          showToast("Removed from wishlist", "warning");
        } else {
          this.classList.add("active");
          if (icon) { icon.className = "fa-solid fa-heart"; }
          showToast("Saved to wishlist!", "success");
        }
      });
    }
  }

  // ─── Homepage: Featured Products ─────────────────────────────────────────────

  /**
   * Render featured products on the homepage using simulated async load.
   */
  function initFeaturedProducts() {
    var grid = document.getElementById("featured-products-grid");
    if (!grid) { return; }

    window.API.simulateFetch({
      loaderId:    "featured-loader",
      containerId: "featured-products-grid",
      errorElId:   "featured-error",
      dataFn: function () {
        return PRODUCTS.filter(function (p) {
          return FEATURED_IDS.indexOf(p.id) !== -1;
        });
      },
      onSuccess: function (products) {
        var html = "";
        for (var i = 0; i < products.length; i++) {
          html += buildProductCard(products[i]);
        }
        grid.innerHTML = html;
        attachCartListeners(grid);
        attachWishlistListeners(grid);
        _log("Featured products rendered:", products.length);
      },
      onError: function (msg) {
        showToast("Could not load featured products. " + msg, "danger");
      }
    });
  }

  // ─── Products Page: Filter / Search / Sort ───────────────────────────────────

  /**
   * @type {{ search: string, category: string, maxPrice: number, minRating: number, sort: string }}
   */
  var _filters = {
    search:    "",
    category:  "all",
    maxPrice:  MAX_PRICE_FILTER,
    minRating: 0,
    sort:      "default"
  };

  /**
   * Apply current filters to PRODUCTS, then re-render the grid.
   * Pushes a new history entry for back/forward support.
   * @param {boolean} [skipHistory=false] — pass true when restoring from popstate
   */
  function applyFilters(skipHistory) {
    var grid      = document.getElementById("products-grid");
    var noResults = document.getElementById("no-results");
    var countEl   = document.getElementById("result-count");
    if (!grid) { return; }

    var filtered = PRODUCTS.filter(function (p) {
      if (_filters.category !== "all" && p.category !== _filters.category) { return false; }
      if (p.price  >  _filters.maxPrice)  { return false; }
      if (p.rating <  _filters.minRating) { return false; }
      if (_filters.search.length > 0) {
        var term = _filters.search.toLowerCase();
        var hit  = (p.name.toLowerCase().indexOf(term) !== -1) ||
                   (p.category.toLowerCase().indexOf(term) !== -1) ||
                   (p.description.toLowerCase().indexOf(term) !== -1);
        if (!hit) { return false; }
      }
      return true;
    });

    if (_filters.sort === "price-asc")  { filtered.sort(function (a, b) { return a.price  - b.price;  }); }
    if (_filters.sort === "price-desc") { filtered.sort(function (a, b) { return b.price  - a.price;  }); }
    if (_filters.sort === "rating-desc"){ filtered.sort(function (a, b) { return b.rating - a.rating; }); }
    if (_filters.sort === "name-asc")   { filtered.sort(function (a, b) { return a.name.localeCompare(b.name); }); }

    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (noResults) { noResults.classList.remove("d-none"); }
    } else {
      if (noResults) { noResults.classList.add("d-none"); }
      var html = "";
      for (var i = 0; i < filtered.length; i++) { html += buildProductCard(filtered[i]); }
      grid.innerHTML = html;
      attachCartListeners(grid);
      attachWishlistListeners(grid);
    }

    if (countEl) { countEl.textContent = String(filtered.length); }

    // History API — push new URL unless this call originated from popstate
    if (!skipHistory && window.Navigation) {
      window.Navigation.updateURL(_filters);
    }

    _log("applyFilters:", _filters, "results:", filtered.length);
  }

  /**
   * Sync the filter UI controls to match a given state object.
   * Called when restoring state from popstate or URL params on load.
   * @param {object} state
   */
  function _syncFiltersUI(state) {
    _filters.search    = state.search    || "";
    _filters.category  = state.category  || "all";
    _filters.maxPrice  = state.maxPrice  || MAX_PRICE_FILTER;
    _filters.minRating = state.minRating || 0;
    _filters.sort      = state.sort      || "default";

    var searchInput  = document.getElementById("product-search");
    var priceRange   = document.getElementById("price-range");
    var priceDisplay = document.getElementById("price-display");
    var sortSelect   = document.getElementById("sort-select");

    if (searchInput)  { searchInput.value  = _filters.search; }
    if (priceRange)   { priceRange.value   = String(_filters.maxPrice); }
    if (priceDisplay) { priceDisplay.textContent = formatPrice(_filters.maxPrice); }
    if (sortSelect)   { sortSelect.value   = _filters.sort; }

    var catRadio = document.querySelector('.filter-category[value="' + _filters.category + '"]');
    if (catRadio)  { catRadio.checked = true; }

    var ratingRadio = document.querySelector('.filter-rating[value="' + _filters.minRating + '"]');
    if (ratingRadio) { ratingRadio.checked = true; }
  }

  /**
   * Initialise the products page: restore URL state, wire controls, load data.
   */
  function initProductsPage() {
    var grid = document.getElementById("products-grid");
    if (!grid) { return; }

    // Restore state from URL (handles direct link, bookmark, page reload)
    if (window.Navigation) {
      var urlState = window.Navigation.restoreStateFromURL();
      _syncFiltersUI(urlState);
      window.Navigation.replaceCurrentURL(_filters);

      // Back/forward button support
      window.Navigation.onPop(function (restoredState) {
        _syncFiltersUI(restoredState);
        applyFilters(true);
      });
    }

    // Render products via simulated async
    window.API.simulateFetch({
      loaderId:    "products-loader",
      containerId: "products-grid",
      errorElId:   "products-error",
      dataFn: function () { return PRODUCTS; },
      onSuccess: function () {
        applyFilters(true);
        _wireProductsPageEvents();
      },
      onError: function (msg) {
        showToast("Could not load products. " + msg, "danger");
      }
    });
  }

  /**
   * Wire all filter/search/sort UI events on the products page.
   * Called once after the initial async load.
   */
  function _wireProductsPageEvents() {
    var searchInput  = document.getElementById("product-search");
    var priceRange   = document.getElementById("price-range");
    var priceDisplay = document.getElementById("price-display");
    var sortSelect   = document.getElementById("sort-select");
    var clearBtn     = document.getElementById("clear-filters");
    var resetSearch  = document.getElementById("reset-search");
    var navForm      = document.getElementById("navSearchForm");

    // Category radio buttons
    var catInputs = document.querySelectorAll(".filter-category");
    for (var c = 0; c < catInputs.length; c++) {
      catInputs[c].addEventListener("change", function () {
        _filters.category = this.value;
        applyFilters();
      });
    }

    // Rating radio buttons
    var ratingInputs = document.querySelectorAll(".filter-rating");
    for (var r = 0; r < ratingInputs.length; r++) {
      ratingInputs[r].addEventListener("change", function () {
        _filters.minRating = parseFloat(this.value);
        applyFilters();
      });
    }

    // Price range slider
    if (priceRange) {
      priceRange.addEventListener("input", function () {
        _filters.maxPrice = parseInt(this.value, 10);
        if (priceDisplay) { priceDisplay.textContent = formatPrice(_filters.maxPrice); }
        applyFilters();
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        _filters.sort = this.value;
        applyFilters();
      });
    }

    // Live search input
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        _filters.search = this.value.trim();
        applyFilters();
      });
      searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); }
      });
    }

    // Navbar search form on products page — update in-page filter
    if (navForm && searchInput) {
      navForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var navQ = document.getElementById("navSearch");
        if (navQ) {
          _filters.search = navQ.value.trim();
          searchInput.value = _filters.search;
          applyFilters();
        }
      });
    }

    // Clear all filters
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        _filters = { search: "", category: "all", maxPrice: MAX_PRICE_FILTER, minRating: 0, sort: "default" };
        _syncFiltersUI(_filters);
        applyFilters();
        showToast("Filters cleared", "success");
      });
    }

    // Reset search (no-results panel)
    if (resetSearch) {
      resetSearch.addEventListener("click", function () {
        _filters.search = "";
        if (searchInput) { searchInput.value = ""; }
        applyFilters();
      });
    }
  }

  // ─── Countdown timer ─────────────────────────────────────────────────────────

  /**
   * Start the deals-banner countdown timer on the homepage.
   */
  function initCountdown() {
    var hoursEl   = document.getElementById("cd-hours");
    var minutesEl = document.getElementById("cd-minutes");
    var secondsEl = document.getElementById("cd-seconds");
    if (!hoursEl || !minutesEl || !secondsEl) { return; }

    var endTime = Date.now() + COUNTDOWN_MS;

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function tick() {
      var remaining = endTime - Date.now();
      if (remaining <= 0) {
        hoursEl.textContent   = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }
      var h = Math.floor(remaining / 3600000);
      var m = Math.floor((remaining % 3600000) / 60000);
      var s = Math.floor((remaining % 60000) / 1000);
      hoursEl.textContent   = pad(h);
      minutesEl.textContent = pad(m);
      secondsEl.textContent = pad(s);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ─── Newsletter form ─────────────────────────────────────────────────────────

  /**
   * Initialise the newsletter signup form on index.html.
   */
  function initNewsletter() {
    var form     = document.getElementById("newsletter-form");
    if (!form) { return; }

    var emailInput = document.getElementById("newsletter-email");
    var feedback   = document.getElementById("newsletter-feedback");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = emailInput ? emailInput.value.trim() : "";

      if (!window.Validation.isValidEmail(email)) {
        if (emailInput) { emailInput.classList.add("is-invalid"); }
        if (feedback)   { feedback.textContent = "Please enter a valid email address."; }
        return;
      }

      if (emailInput) {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
        emailInput.value = "";
      }
      if (feedback) { feedback.textContent = "Thank you! You are now subscribed."; }
      showToast("Successfully subscribed to our newsletter!", "success");
    });
  }

  // ─── Contact form ────────────────────────────────────────────────────────────

  /**
   * Initialise the contact form on contact.html.
   */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) { return; }

    // Character counter for message textarea
    var textarea  = document.getElementById("contact-message");
    var charCount = document.getElementById("char-count");
    if (textarea && charCount) {
      textarea.addEventListener("input", function () {
        var len = this.value.length;
        if (len > MESSAGE_MAX_CHARS) {
          this.value = this.value.substring(0, MESSAGE_MAX_CHARS);
          len = MESSAGE_MAX_CHARS;
        }
        charCount.textContent = String(len);
      });
    }

    // Blur validation
    window.Validation.wireBlurValidation(form);

    // Submit
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = window.Validation.validateForm(form);
      if (!valid) {
        showToast("Please fix the highlighted errors before submitting.", "danger");
        return;
      }

      // Simulate async submission
      var submitBtn = document.getElementById("contact-submit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending…';
      }

      window.API.simulateFetch({
        loaderId: null,
        dataFn:   function () { return { sent: true }; },
        onSuccess: function () {
          var successEl = document.getElementById("form-success");
          if (successEl) {
            successEl.classList.remove("d-none");
            successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
          form.reset();
          if (charCount) { charCount.textContent = "0"; }
          showToast("Message sent successfully!", "success");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2" aria-hidden="true"></i>Send Message';
          }
        },
        onError: function (msg) {
          showToast("Could not send message. " + msg, "danger");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-2" aria-hidden="true"></i>Send Message';
          }
        }
      });
    });
  }

  // ─── Cart page ──────────────────────────────────────────────────────────────

  /**
   * Initialise the cart page: render state, wire interactions.
   */
  function initCartPage() {
    if (!document.getElementById("cart-content") && !document.getElementById("empty-cart")) { return; }

    _renderCartPage();

    document.addEventListener("cartUpdated", function () {
      _renderCartPage();
    });

    // Clear cart button → confirmation modal
    var clearBtn   = document.getElementById("clear-cart-btn");
    var clearModalEl = document.getElementById("clearCartModal");
    var clearModal = clearModalEl ? new bootstrap.Modal(clearModalEl) : null;

    if (clearBtn && clearModal) {
      clearBtn.addEventListener("click", function () { clearModal.show(); });
    }

    var confirmClear = document.getElementById("confirm-clear-cart");
    if (confirmClear) {
      confirmClear.addEventListener("click", function () {
        Cart.clearCart();
        if (clearModal) { clearModal.hide(); }
        showToast("Your cart has been cleared.", "warning");
      });
    }

    // Checkout button
    var checkoutBtn    = document.getElementById("checkout-btn");
    var checkoutModalEl = document.getElementById("checkoutModal");
    var checkoutModal  = checkoutModalEl ? new bootstrap.Modal(checkoutModalEl) : null;

    if (checkoutBtn && checkoutModal) {
      checkoutBtn.addEventListener("click", function () {
        if (Cart.getSummary().items.length === 0) {
          showToast("Your cart is empty.", "warning");
          return;
        }
        _resetCheckoutSteps();
        checkoutModal.show();
      });
    }

    // Promo code
    var applyPromoBtn = document.getElementById("apply-promo");
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener("click", function () {
        var promoInput = document.getElementById("promo-input");
        var promoFeedback = document.getElementById("promo-feedback");
        if (!promoInput) { return; }
        var result = Cart.applyPromo(promoInput.value);
        if (promoFeedback) {
          promoFeedback.textContent = result.message;
          promoFeedback.className   = result.valid ? "form-text text-success" : "form-text text-danger";
        }
        if (result.valid) {
          showToast(result.message, "success");
          promoInput.value = "";
        } else {
          showToast(result.message, "danger");
        }
      });
    }

    // Delivery option change → recalculate summary
    var deliveryOption = document.getElementById("delivery-option");
    if (deliveryOption) {
      deliveryOption.addEventListener("change", function () { _renderOrderSummary(); });
    }

    _initCheckoutFlow();
  }

  /**
   * Render the full cart page based on current cart state.
   */
  function _renderCartPage() {
    var summary    = Cart.getSummary();
    var cartContent = document.getElementById("cart-content");
    var emptyCart   = document.getElementById("empty-cart");

    if (summary.items.length === 0) {
      if (cartContent) { cartContent.classList.add("d-none"); }
      if (emptyCart)   { emptyCart.classList.remove("d-none"); }
    } else {
      if (emptyCart)   { emptyCart.classList.add("d-none"); }
      if (cartContent) { cartContent.classList.remove("d-none"); }
      _renderCartItems(summary);
      _renderOrderSummary();
    }
  }

  /**
   * Render the list of cart items.
   * @param {object} summary — from Cart.getSummary()
   */
  function _renderCartItems(summary) {
    var list    = document.getElementById("cart-items-list");
    var countEl = document.getElementById("item-count");
    if (!list) { return; }

    if (countEl) { countEl.textContent = String(summary.itemCount); }

    var html = "";
    for (var i = 0; i < summary.items.length; i++) {
      var item = summary.items[i];
      html +=
        '<div class="cart-item d-flex align-items-start gap-3" data-item-id="' + item.id + '">' +
          '<div class="cart-item-img-placeholder flex-shrink-0" aria-hidden="true">' +
            '<i class="fa-solid ' + item.icon + '"></i>' +
          '</div>' +
          '<div class="flex-grow-1">' +
            '<div class="d-flex justify-content-between align-items-start gap-2">' +
              '<div>' +
                '<h3 class="h6 fw-bold mb-1">' + item.name + '</h3>' +
                '<p class="small text-muted text-capitalize mb-0">' + item.category + '</p>' +
              '</div>' +
              '<button class="btn btn-sm btn-outline-danger remove-item-btn" ' +
                'data-id="' + item.id + '" type="button" ' +
                'aria-label="Remove ' + item.name + ' from cart">' +
                '<i class="fa-solid fa-trash" aria-hidden="true"></i>' +
              '</button>' +
            '</div>' +
            '<div class="d-flex justify-content-between align-items-center mt-3">' +
              '<div class="quantity-control" role="group" aria-label="Quantity for ' + item.name + '">' +
                '<button class="qty-btn qty-minus" data-id="' + item.id + '" type="button" ' +
                  'aria-label="Decrease quantity" ' + (item.quantity <= 1 ? "disabled" : "") + '>' +
                  '<i class="fa-solid fa-minus" aria-hidden="true"></i>' +
                '</button>' +
                '<span class="qty-value" aria-live="polite" aria-label="Quantity">' + item.quantity + '</span>' +
                '<button class="qty-btn qty-plus" data-id="' + item.id + '" type="button" aria-label="Increase quantity">' +
                  '<i class="fa-solid fa-plus" aria-hidden="true"></i>' +
                '</button>' +
              '</div>' +
              '<span class="fw-bold text-primary-custom">' + formatPrice(item.price * item.quantity) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    list.innerHTML = html;

    // Remove item
    var removeBtns = list.querySelectorAll(".remove-item-btn");
    for (var r = 0; r < removeBtns.length; r++) {
      removeBtns[r].addEventListener("click", function () {
        var id = parseInt(this.getAttribute("data-id"), 10);
        Cart.removeItem(id);
        showToast("Item removed from cart.", "warning");
      });
    }

    // Decrease quantity
    var minusBtns = list.querySelectorAll(".qty-minus");
    for (var m = 0; m < minusBtns.length; m++) {
      minusBtns[m].addEventListener("click", function () {
        var id  = parseInt(this.getAttribute("data-id"), 10);
        var cur = Cart.getSummary().items;
        for (var k = 0; k < cur.length; k++) {
          if (cur[k].id === id) { Cart.updateQuantity(id, cur[k].quantity - 1); break; }
        }
      });
    }

    // Increase quantity
    var plusBtns = list.querySelectorAll(".qty-plus");
    for (var p = 0; p < plusBtns.length; p++) {
      plusBtns[p].addEventListener("click", function () {
        var id  = parseInt(this.getAttribute("data-id"), 10);
        var cur = Cart.getSummary().items;
        for (var k = 0; k < cur.length; k++) {
          if (cur[k].id === id) { Cart.updateQuantity(id, cur[k].quantity + 1); break; }
        }
      });
    }
  }

  /**
   * Render the order summary sidebar and free delivery progress bar.
   */
  function _renderOrderSummary() {
    var summary       = Cart.getSummary();
    var subtotalEl    = document.getElementById("summary-subtotal");
    var deliveryEl    = document.getElementById("summary-delivery");
    var discountEl    = document.getElementById("summary-discount");
    var totalEl       = document.getElementById("summary-total");
    var progressBar   = document.getElementById("delivery-progress-bar");
    var progressText  = document.getElementById("delivery-progress-text");
    var deliveryMsg   = document.getElementById("delivery-message");

    // Calculate extra delivery cost based on the dropdown
    var deliveryOption = document.getElementById("delivery-option");
    var extraDelivery  = 0;
    if (deliveryOption) {
      if (deliveryOption.value === "express")  { extraDelivery = 9.99; }
      if (deliveryOption.value === "next-day") { extraDelivery = 14.99; }
    }

    var totalDelivery = summary.delivery + extraDelivery;
    var grandTotal    = Math.max(0, summary.subtotal - summary.discount + totalDelivery);

    if (subtotalEl) { subtotalEl.textContent = formatPrice(summary.subtotal); }
    if (deliveryEl) { deliveryEl.textContent = totalDelivery === 0 ? "FREE" : formatPrice(totalDelivery); }
    if (discountEl) { discountEl.textContent = "-" + formatPrice(summary.discount); }
    if (totalEl)    { totalEl.textContent    = formatPrice(grandTotal); }

    var progressPct = Math.min(100, (summary.subtotal / DELIVERY_FREE_THRESHOLD) * 100);
    if (progressBar) {
      progressBar.style.width = progressPct + "%";
      progressBar.setAttribute("aria-valuenow", String(Math.round(summary.subtotal)));
    }
    if (progressText) { progressText.textContent = formatPrice(summary.subtotal) + " of " + formatPrice(DELIVERY_FREE_THRESHOLD); }
    if (deliveryMsg) {
      if (summary.subtotal >= DELIVERY_FREE_THRESHOLD) {
        deliveryMsg.textContent = "You qualify for free standard delivery!";
        deliveryMsg.className   = "small text-success mt-1";
      } else {
        var needed = (DELIVERY_FREE_THRESHOLD - summary.subtotal).toFixed(2);
        deliveryMsg.textContent = "Spend £" + needed + " more for free standard delivery.";
        deliveryMsg.className   = "small text-muted mt-1";
      }
    }
  }

  // ─── Checkout multi-step ─────────────────────────────────────────────────────

  /**
   * Initialise the 3-step checkout flow in the checkout modal.
   */
  function _initCheckoutFlow() {
    var step1Next  = document.getElementById("step1-next");
    var step2Back  = document.getElementById("step2-back");
    var step2Next  = document.getElementById("step2-next");
    var step3Back  = document.getElementById("step3-back");
    var placeOrder = document.getElementById("place-order-btn");

    if (step1Next) {
      step1Next.addEventListener("click", function () {
        var form = document.getElementById("delivery-form");
        if (!window.Validation.validateForm(form)) {
          showToast("Please fill in all required delivery fields.", "danger");
          return;
        }
        _goToCheckoutStep(2);
      });
    }
    if (step2Back) { step2Back.addEventListener("click", function () { _goToCheckoutStep(1); }); }

    if (step2Next) {
      step2Next.addEventListener("click", function () {
        var form = document.getElementById("payment-form");
        if (!window.Validation.validateForm(form)) {
          showToast("Please fill in all required payment fields.", "danger");
          return;
        }
        _populateOrderReview();
        _goToCheckoutStep(3);
      });
    }
    if (step3Back) { step3Back.addEventListener("click", function () { _goToCheckoutStep(2); }); }

    if (placeOrder) {
      placeOrder.addEventListener("click", function () {
        placeOrder.disabled = true;
        placeOrder.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Processing…';

        window.API.simulateFetch({
          delay:  CHECKOUT_SIMULATE_MS,
          dataFn: function () {
            return { orderNum: "JOY-" + Math.floor(100000 + Math.random() * 900000) };
          },
          onSuccess: function (result) {
            var numEl = document.getElementById("order-number");
            if (numEl) { numEl.textContent = result.orderNum; }

            ["checkout-step-1", "checkout-step-2", "checkout-step-3"].forEach(function (id) {
              var el = document.getElementById(id);
              if (el) { el.classList.add("d-none"); }
            });

            var successEl = document.getElementById("checkout-success");
            if (successEl) { successEl.classList.remove("d-none"); }

            Cart.clearCart();
            showToast("Order placed! Thank you for shopping with Joy2buy.", "success");
          },
          onError: function (msg) {
            showToast("Order failed. " + msg, "danger");
            placeOrder.disabled = false;
            placeOrder.innerHTML = '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>Place Order';
          }
        });
      });
    }

    // Wire blur validation on checkout forms
    window.Validation.wireBlurValidation(document.getElementById("delivery-form"));
    window.Validation.wireBlurValidation(document.getElementById("payment-form"));

    // Card number formatter (auto-space every 4 digits)
    var cardNumber = document.getElementById("card-number");
    if (cardNumber) {
      cardNumber.addEventListener("input", function () {
        var v = this.value.replace(/\D/g, "").substring(0, 16);
        this.value = v.replace(/(.{4})/g, "$1 ").trim();
      });
    }

    // Expiry formatter (MM/YY)
    var cardExpiry = document.getElementById("card-expiry");
    if (cardExpiry) {
      cardExpiry.addEventListener("input", function () {
        var v = this.value.replace(/\D/g, "").substring(0, 4);
        this.value = (v.length >= 2) ? v.substring(0, 2) + "/" + v.substring(2) : v;
      });
    }

    // CVV — digits only
    var cardCvv = document.getElementById("card-cvv");
    if (cardCvv) {
      cardCvv.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").substring(0, 4);
      });
    }
  }

  /**
   * Show the specified checkout step and update step indicators.
   * @param {number} stepNum — 1, 2, or 3
   */
  function _goToCheckoutStep(stepNum) {
    for (var i = 1; i <= 3; i++) {
      var stepEl      = document.getElementById("checkout-step-" + i);
      var indicatorEl = document.getElementById("step-indicator-" + i);
      if (stepEl) {
        if (i === stepNum) { stepEl.classList.remove("d-none"); }
        else               { stepEl.classList.add("d-none"); }
      }
      if (indicatorEl) {
        indicatorEl.classList.remove("active", "completed");
        if (i === stepNum) {
          indicatorEl.classList.add("active");
          indicatorEl.setAttribute("aria-current", "step");
        } else if (i < stepNum) {
          indicatorEl.classList.add("completed");
          indicatorEl.removeAttribute("aria-current");
        } else {
          indicatorEl.removeAttribute("aria-current");
        }
      }
    }
  }

  /**
   * Reset the checkout modal to step 1.
   */
  function _resetCheckoutSteps() {
    _goToCheckoutStep(1);
    var successEl = document.getElementById("checkout-success");
    if (successEl) { successEl.classList.add("d-none"); }
    var placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.disabled = false;
      placeOrderBtn.innerHTML = '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>Place Order';
    }
  }

  /**
   * Populate the order review panel (step 3) from delivery form values.
   */
  function _populateOrderReview() {
    var reviewEl = document.getElementById("order-review-details");
    if (!reviewEl) { return; }

    var summary     = Cart.getSummary();
    var firstName   = document.getElementById("first-name");
    var lastName    = document.getElementById("last-name");
    var email       = document.getElementById("email");
    var address     = document.getElementById("address");
    var city        = document.getElementById("city");
    var postcode    = document.getElementById("postcode");
    var cardNumber  = document.getElementById("card-number");
    var delivOptEl  = document.getElementById("delivery-option");
    var delivLabel  = delivOptEl ? delivOptEl.options[delivOptEl.selectedIndex].text : "Standard Delivery";

    var maskedCard = (cardNumber && cardNumber.value)
      ? "**** **** **** " + cardNumber.value.replace(/\s/g, "").slice(-4)
      : "**** **** **** ****";

    var itemsHtml = "";
    for (var i = 0; i < summary.items.length; i++) {
      var item = summary.items[i];
      itemsHtml +=
        '<div class="d-flex justify-content-between py-1 border-bottom">' +
          '<span class="small">' + item.name + ' × ' + item.quantity + '</span>' +
          '<span class="small fw-semibold">' + formatPrice(item.price * item.quantity) + '</span>' +
        '</div>';
    }

    // Build address safely using textContent assignment into elements
    var fullName = (firstName ? firstName.value : "") + " " + (lastName ? lastName.value : "");
    var addressLine = (address ? address.value : "") + ", " + (city ? city.value : "");
    var postcodeVal = postcode ? postcode.value : "";
    var emailVal    = email ? email.value : "";

    reviewEl.innerHTML =
      '<div class="row g-3">' +
        '<div class="col-md-6">' +
          '<h4 class="h6 fw-bold text-muted text-uppercase mb-2">Delivery To</h4>' +
          '<p class="mb-0 small">' + fullName + '<br>' + addressLine + '<br>' + postcodeVal + '<br>' + emailVal + '</p>' +
          '<p class="mt-2 small"><strong>Delivery:</strong> ' + delivLabel + '</p>' +
        '</div>' +
        '<div class="col-md-6">' +
          '<h4 class="h6 fw-bold text-muted text-uppercase mb-2">Payment</h4>' +
          '<p class="small mb-0">' + maskedCard + '</p>' +
        '</div>' +
        '<div class="col-12">' +
          '<h4 class="h6 fw-bold text-muted text-uppercase mb-2">Items Ordered</h4>' +
          itemsHtml +
          '<div class="d-flex justify-content-between py-2 fw-bold">' +
            '<span>Total</span>' +
            '<span class="text-primary-custom">' + formatPrice(summary.total) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // ─── DOMContentLoaded bootstrap ─────────────────────────────────────────────

  document.addEventListener("DOMContentLoaded", function () {
    Cart.init();
    initFeaturedProducts();
    initProductsPage();
    initCountdown();
    initNewsletter();
    initContactForm();
    initCartPage();
    _log("App initialised");
  });

  // ─── Public API ─────────────────────────────────────────────────────────────

  return {
    showToast:        showToast,
    formatPrice:      formatPrice,
    findProductById:  findProductById,
    Cart:             Cart
  };

}());
