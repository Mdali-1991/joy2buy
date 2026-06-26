/*
 * main.js — Joy2buy Application Logic
 * Unit 2: Interactive Front End Development
 *
 * Responsibilities:
 *  - Product data store (array of objects)
 *  - Render product cards on index.html and products.html
 *  - Live search, category filter, price filter, rating filter, sort
 *  - Toast notification system
 *  - Navbar scroll behaviour
 *  - Newsletter form validation
 *  - Contact form validation & character counter
 *  - Checkout multi-step flow (cart.html)
 *  - Countdown timer (deals banner on index.html)
 *  - Cart page rendering (items list + order summary)
 *  - URL query param reading for pre-selected filter
 */

/* jshint esversion: 6 */
"use strict";

// ============================================================
// PRODUCT DATA STORE
// ============================================================
var PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "electronics",
    price: 89.99,
    oldPrice: 149.99,
    rating: 4.8,
    reviews: 312,
    icon: "fa-headphones",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "Premium over-ear headphones with 40hr battery life, active noise cancellation and deep bass."
  },
  {
    id: 2,
    name: "Smart Watch Pro Series 5",
    category: "electronics",
    price: 199.99,
    oldPrice: 249.99,
    rating: 4.7,
    reviews: 186,
    icon: "fa-clock",
    badge: "New",
    badgeClass: "bg-primary",
    description: "Track fitness, manage notifications and monitor heart rate with a vibrant always-on display."
  },
  {
    id: 3,
    name: "Ultra HD 4K Webcam",
    category: "electronics",
    price: 79.99,
    oldPrice: null,
    rating: 4.5,
    reviews: 94,
    icon: "fa-video",
    badge: null,
    badgeClass: "",
    description: "Crystal-clear 4K video conferencing cam with built-in ring light and noise-cancelling mic."
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    category: "electronics",
    price: 49.99,
    oldPrice: 69.99,
    rating: 4.6,
    reviews: 228,
    icon: "fa-volume-high",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "360° sound, waterproof IPX7 rating and 20-hour playtime in a compact design."
  },
  {
    id: 5,
    name: "Slim Laptop Backpack",
    category: "fashion",
    price: 39.99,
    oldPrice: 59.99,
    rating: 4.4,
    reviews: 155,
    icon: "fa-briefcase",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "Anti-theft waterproof backpack with USB charging port and padded 15.6\" laptop compartment."
  },
  {
    id: 6,
    name: "Classic Oxford Trainers",
    category: "fashion",
    price: 64.99,
    oldPrice: null,
    rating: 4.3,
    reviews: 87,
    icon: "fa-shoe-prints",
    badge: null,
    badgeClass: "",
    description: "Handcrafted leather-upper trainers with memory foam insoles and non-slip soles."
  },
  {
    id: 7,
    name: "Merino Wool Crew Neck Sweater",
    category: "fashion",
    price: 54.99,
    oldPrice: 79.99,
    rating: 4.7,
    reviews: 203,
    icon: "fa-shirt",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "Ethically sourced extra-fine merino wool. Warm, soft and machine washable."
  },
  {
    id: 8,
    name: "Polarised Sunglasses",
    category: "fashion",
    price: 29.99,
    oldPrice: null,
    rating: 4.2,
    reviews: 64,
    icon: "fa-glasses",
    badge: "New",
    badgeClass: "bg-primary",
    description: "UV400 polarised lenses with lightweight TR90 frame. Available in 4 colours."
  },
  {
    id: 9,
    name: "Bamboo Chopping Board Set",
    category: "home",
    price: 24.99,
    oldPrice: 34.99,
    rating: 4.5,
    reviews: 118,
    icon: "fa-kitchen-set",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "Set of 3 sustainably sourced bamboo boards with juice groove and non-slip feet."
  },
  {
    id: 10,
    name: "Scented Soy Candle Collection",
    category: "home",
    price: 18.99,
    oldPrice: null,
    rating: 4.8,
    reviews: 279,
    icon: "fa-fire",
    badge: "Best Seller",
    badgeClass: "bg-warning text-dark",
    description: "Set of 4 hand-poured natural soy candles. Burns for 45 hours each. Vegan-friendly."
  },
  {
    id: 11,
    name: "Smart LED Desk Lamp",
    category: "home",
    price: 44.99,
    oldPrice: 59.99,
    rating: 4.6,
    reviews: 142,
    icon: "fa-lightbulb",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "USB-C charging, 5 colour temperatures, touch dimmer and auto-off timer."
  },
  {
    id: 12,
    name: "Resistance Band Set (5 levels)",
    category: "sports",
    price: 19.99,
    oldPrice: 29.99,
    rating: 4.4,
    reviews: 196,
    icon: "fa-dumbbell",
    badge: "Sale",
    badgeClass: "bg-danger",
    description: "Latex-free resistance bands from light to extra-heavy. Includes carry bag and guide."
  },
  {
    id: 13,
    name: "Yoga Mat — Non-Slip 6mm",
    category: "sports",
    price: 34.99,
    oldPrice: null,
    rating: 4.7,
    reviews: 321,
    icon: "fa-person-praying",
    badge: "Best Seller",
    badgeClass: "bg-warning text-dark",
    description: "Extra-thick 6mm eco TPE mat with alignment lines, carry strap and high grip surface."
  },
  {
    id: 14,
    name: "Insulated Water Bottle 1L",
    category: "sports",
    price: 22.99,
    oldPrice: 32.99,
    rating: 4.9,
    reviews: 508,
    icon: "fa-bottle-water",
    badge: "Top Rated",
    badgeClass: "bg-success",
    description: "Triple-wall stainless steel keeps drinks cold 24hr or hot 12hr. Leak-proof lid."
  }
];

// Featured products (shown on homepage)
var FEATURED_IDS = [1, 2, 7, 10, 13, 14];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Show a toast notification.
 * @param {string} message - Text to display
 * @param {string} [type='success'] - Bootstrap bg class suffix: success|danger|warning
 */
function showToast(message, type) {
  type = type || "success";
  var toastEl = document.getElementById("toast-notification");
  var msgEl = document.getElementById("toast-message");
  if (!toastEl || !msgEl) { return; }

  // Remove previous type classes
  toastEl.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning", "text-bg-error");
  toastEl.classList.add("text-bg-" + type);

  if (type === "warning") {
    toastEl.classList.add("text-dark");
  } else {
    toastEl.classList.remove("text-dark");
  }

  msgEl.textContent = message;

  var bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
  bsToast.show();
}

/**
 * Format a number as a UK pound price string.
 * @param {number} amount
 * @returns {string} e.g. "£9.99"
 */
function formatPrice(amount) {
  return "£" + amount.toFixed(2);
}

/**
 * Generate star rating HTML.
 * @param {number} rating - 0–5
 * @returns {string} HTML string
 */
function renderStars(rating) {
  var html = "";
  var full = Math.floor(rating);
  var half = rating - full >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;

  for (var i = 0; i < full; i++) {
    html += '<i class="fa-solid fa-star text-warning" aria-hidden="true"></i>';
  }
  if (half) {
    html += '<i class="fa-solid fa-star-half-stroke text-warning" aria-hidden="true"></i>';
  }
  for (var j = 0; j < empty; j++) {
    html += '<i class="fa-regular fa-star text-warning" aria-hidden="true"></i>';
  }
  return html;
}

/**
 * Read URL query parameters.
 * @returns {object} key-value map
 */
function getQueryParams() {
  var params = {};
  var search = window.location.search.substring(1);
  var pairs = search.split("&");
  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i]) { continue; }
    var kv = pairs[i].split("=");
    params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
  }
  return params;
}

// ============================================================
// PRODUCT CARD TEMPLATE
// ============================================================

/**
 * Build HTML for a single product card.
 * @param {object} product
 * @returns {string} HTML string
 */
function buildProductCard(product) {
  var badgeHtml = "";
  if (product.badge) {
    badgeHtml = '<span class="badge product-badge ' + product.badgeClass + '">' + product.badge + '</span>';
  }

  var oldPriceHtml = "";
  if (product.oldPrice) {
    oldPriceHtml = '<span class="product-price-old ms-2">' + formatPrice(product.oldPrice) + '</span>';
  }

  var inCart = Cart.hasItem(product.id);
  var cartBtnText = inCart
    ? '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>In Cart'
    : '<i class="fa-solid fa-cart-shopping me-2" aria-hidden="true"></i>Add to Cart';
  var cartBtnClass = inCart ? "btn-add-to-cart btn btn-success" : "btn-add-to-cart btn";

  return '<div class="col-sm-6 col-xl-4">' +
    '<article class="card h-100 product-card border-0 shadow-sm position-relative">' +
      badgeHtml +
      '<button class="product-wishlist-btn" aria-label="Add ' + product.name + ' to wishlist" data-id="' + product.id + '" title="Add to wishlist">' +
        '<i class="fa-regular fa-heart" aria-hidden="true"></i>' +
      '</button>' +
      '<div class="product-img-placeholder">' +
        '<i class="fa-solid ' + product.icon + ' fs-1 text-muted mb-2" aria-hidden="true"></i>' +
        '<small class="text-muted">' + product.category + '</small>' +
      '</div>' +
      '<div class="card-body d-flex flex-column">' +
        '<p class="text-muted small text-uppercase mb-1" style="font-size:0.7rem;letter-spacing:.08em">' + product.category + '</p>' +
        '<h3 class="card-title h6 fw-bold mb-2">' + product.name + '</h3>' +
        '<div class="d-flex align-items-center gap-2 mb-2">' +
          '<div class="product-rating" aria-label="Rated ' + product.rating + ' out of 5">' + renderStars(product.rating) + '</div>' +
          '<small class="text-muted">(' + product.reviews + ')</small>' +
        '</div>' +
        '<p class="text-muted small mb-3" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + product.description + '</p>' +
        '<div class="mt-auto">' +
          '<div class="d-flex align-items-center mb-3">' +
            '<span class="product-price">' + formatPrice(product.price) + '</span>' +
            oldPriceHtml +
          '</div>' +
          '<button class="' + cartBtnClass + '" data-id="' + product.id + '" aria-label="Add ' + product.name + ' to cart">' +
            cartBtnText +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>' +
  '</div>';
}

// ============================================================
// HOMEPAGE: FEATURED PRODUCTS
// ============================================================
function initFeaturedProducts() {
  var grid = document.getElementById("featured-products-grid");
  if (!grid) { return; }

  var html = "";
  for (var i = 0; i < PRODUCTS.length; i++) {
    for (var j = 0; j < FEATURED_IDS.length; j++) {
      if (PRODUCTS[i].id === FEATURED_IDS[j]) {
        html += buildProductCard(PRODUCTS[i]);
        break;
      }
    }
  }
  grid.innerHTML = html;

  // Attach add-to-cart listeners on this grid
  attachAddToCartListeners(grid);
}

// ============================================================
// PRODUCTS PAGE: FILTER / SEARCH / SORT ENGINE
// ============================================================

var _currentFilters = {
  search: "",
  category: "all",
  maxPrice: 500,
  minRating: 0,
  sort: "default"
};

/**
 * Apply current filters and sort, then re-render the grid.
 */
function applyFilters() {
  var grid = document.getElementById("products-grid");
  var noResults = document.getElementById("no-results");
  var countEl = document.getElementById("result-count");
  if (!grid) { return; }

  // Step 1: filter
  var filtered = [];
  for (var i = 0; i < PRODUCTS.length; i++) {
    var p = PRODUCTS[i];

    // Category filter
    if (_currentFilters.category !== "all" && p.category !== _currentFilters.category) {
      continue;
    }

    // Price filter
    if (p.price > _currentFilters.maxPrice) {
      continue;
    }

    // Rating filter
    if (p.rating < _currentFilters.minRating) {
      continue;
    }

    // Search filter (compound condition)
    if (_currentFilters.search.length > 0) {
      var term = _currentFilters.search.toLowerCase();
      var matchName = p.name.toLowerCase().indexOf(term) !== -1;
      var matchCat = p.category.toLowerCase().indexOf(term) !== -1;
      var matchDesc = p.description.toLowerCase().indexOf(term) !== -1;
      if (!matchName && !matchCat && !matchDesc) {
        continue;
      }
    }

    filtered.push(p);
  }

  // Step 2: sort
  if (_currentFilters.sort === "price-asc") {
    filtered.sort(function (a, b) { return a.price - b.price; });
  } else if (_currentFilters.sort === "price-desc") {
    filtered.sort(function (a, b) { return b.price - a.price; });
  } else if (_currentFilters.sort === "rating-desc") {
    filtered.sort(function (a, b) { return b.rating - a.rating; });
  } else if (_currentFilters.sort === "name-asc") {
    filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }

  // Step 3: render
  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (noResults) { noResults.classList.remove("d-none"); }
  } else {
    if (noResults) { noResults.classList.add("d-none"); }
    var html = "";
    for (var k = 0; k < filtered.length; k++) {
      html += buildProductCard(filtered[k]);
    }
    grid.innerHTML = html;
    attachAddToCartListeners(grid);
    attachWishlistListeners(grid);
  }

  if (countEl) { countEl.textContent = filtered.length; }
}

/**
 * Initialise the products page filters.
 */
function initProductsPage() {
  var grid = document.getElementById("products-grid");
  if (!grid) { return; }

  // Read URL params to pre-set filters
  var params = getQueryParams();
  if (params.category && params.category !== "") {
    _currentFilters.category = params.category;
    var catRadio = document.querySelector('.filter-category[value="' + params.category + '"]');
    if (catRadio) { catRadio.checked = true; }
  }
  if (params.q && params.q !== "") {
    _currentFilters.search = params.q;
    var searchInput = document.getElementById("product-search");
    if (searchInput) { searchInput.value = params.q; }
  }

  applyFilters();

  // Category filter change
  var catInputs = document.querySelectorAll(".filter-category");
  for (var i = 0; i < catInputs.length; i++) {
    catInputs[i].addEventListener("change", function () {
      _currentFilters.category = this.value;
      applyFilters();
    });
  }

  // Price range
  var priceRange = document.getElementById("price-range");
  var priceDisplay = document.getElementById("price-display");
  if (priceRange) {
    priceRange.addEventListener("input", function () {
      _currentFilters.maxPrice = parseInt(this.value, 10);
      if (priceDisplay) { priceDisplay.textContent = "£" + this.value; }
      applyFilters();
    });
  }

  // Rating filter
  var ratingInputs = document.querySelectorAll(".filter-rating");
  for (var j = 0; j < ratingInputs.length; j++) {
    ratingInputs[j].addEventListener("change", function () {
      _currentFilters.minRating = parseFloat(this.value);
      applyFilters();
    });
  }

  // Sort select
  var sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      _currentFilters.sort = this.value;
      applyFilters();
    });
  }

  // Live search (in-page)
  var searchInput = document.getElementById("product-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      _currentFilters.search = this.value.trim();
      applyFilters();
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); }
    });
  }

  // Navbar search form on products page
  var navForm = document.getElementById("navSearchForm");
  if (navForm) {
    navForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = document.getElementById("navSearch");
      if (q) {
        _currentFilters.search = q.value.trim();
        var pageSearch = document.getElementById("product-search");
        if (pageSearch) { pageSearch.value = q.value.trim(); }
        applyFilters();
      }
    });
  }

  // Clear filters
  var clearBtn = document.getElementById("clear-filters");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      _currentFilters = { search: "", category: "all", maxPrice: 500, minRating: 0, sort: "default" };
      var allCat = document.querySelector('.filter-category[value="all"]');
      if (allCat) { allCat.checked = true; }
      var allRating = document.querySelector('.filter-rating[value="0"]');
      if (allRating) { allRating.checked = true; }
      if (priceRange) { priceRange.value = 500; }
      if (priceDisplay) { priceDisplay.textContent = "£500"; }
      if (sortSelect) { sortSelect.value = "default"; }
      if (searchInput) { searchInput.value = ""; }
      applyFilters();
      showToast("Filters cleared", "success");
    });
  }

  // Reset search button (no results panel)
  var resetSearch = document.getElementById("reset-search");
  if (resetSearch) {
    resetSearch.addEventListener("click", function () {
      _currentFilters.search = "";
      if (searchInput) { searchInput.value = ""; }
      applyFilters();
    });
  }
}

// ============================================================
// ADD TO CART — EVENT HANDLERS
// ============================================================

/**
 * Attach click listeners to all "Add to Cart" buttons in a container.
 * @param {Element} container
 */
function attachAddToCartListeners(container) {
  var buttons = container.querySelectorAll(".btn-add-to-cart");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-id"), 10);
      var product = findProductById(id);
      if (!product) { return; }

      var result = Cart.addItem(product);
      if (result === "added") {
        showToast('"' + product.name + '" added to cart!', "success");
      } else {
        showToast('"' + product.name + '" quantity updated.', "success");
      }

      // Update this button's appearance
      this.innerHTML = '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>In Cart';
      this.classList.remove("btn-add-to-cart");
      this.classList.add("btn", "btn-success");
    });
  }
}

/**
 * Attach wishlist button listeners.
 * @param {Element} container
 */
function attachWishlistListeners(container) {
  var buttons = container.querySelectorAll(".product-wishlist-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      var icon = this.querySelector("i");
      var isActive = this.classList.contains("active");
      if (isActive) {
        this.classList.remove("active");
        if (icon) {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
        }
        showToast("Removed from wishlist", "warning");
      } else {
        this.classList.add("active");
        if (icon) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        }
        showToast("Added to wishlist!", "success");
      }
    });
  }
}

/**
 * Find a product in the PRODUCTS array by id.
 * @param {number} id
 * @returns {object|null}
 */
function findProductById(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) { return PRODUCTS[i]; }
  }
  return null;
}

// ============================================================
// HOMEPAGE: COUNTDOWN TIMER
// ============================================================
function initCountdown() {
  var hoursEl = document.getElementById("cd-hours");
  var minutesEl = document.getElementById("cd-minutes");
  var secondsEl = document.getElementById("cd-seconds");
  if (!hoursEl || !minutesEl || !secondsEl) { return; }

  // Set a target time 8 hours from page load
  var endTime = Date.now() + (8 * 60 * 60 * 1000);

  function tick() {
    var remaining = endTime - Date.now();
    if (remaining <= 0) {
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    var h = Math.floor(remaining / 3600000);
    var m = Math.floor((remaining % 3600000) / 60000);
    var s = Math.floor((remaining % 60000) / 1000);

    hoursEl.textContent = h < 10 ? "0" + h : String(h);
    minutesEl.textContent = m < 10 ? "0" + m : String(m);
    secondsEl.textContent = s < 10 ? "0" + s : String(s);
  }

  tick();
  setInterval(tick, 1000);
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
function initNewsletter() {
  var form = document.getElementById("newsletter-form");
  if (!form) { return; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var emailInput = document.getElementById("newsletter-email");
    var feedback = document.getElementById("newsletter-feedback");
    var email = emailInput ? emailInput.value.trim() : "";

    // Simple email validation using regex
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (feedback) { feedback.textContent = "Please enter a valid email address."; }
      if (emailInput) { emailInput.classList.add("is-invalid"); }
      return;
    }

    if (emailInput) { emailInput.classList.remove("is-invalid"); }
    if (feedback) { feedback.textContent = "Thank you! You're now subscribed."; }
    emailInput.value = "";
    showToast("You've subscribed successfully!", "success");
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) { return; }

  // Character counter for message textarea
  var textarea = document.getElementById("contact-message");
  var charCount = document.getElementById("char-count");
  if (textarea && charCount) {
    textarea.addEventListener("input", function () {
      var len = this.value.length;
      if (len > 500) {
        this.value = this.value.substring(0, 500);
        len = 500;
      }
      charCount.textContent = len;
    });
  }

  // Real-time field validation
  var inputs = form.querySelectorAll("input, textarea, select");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("blur", function () {
      validateField(this);
    });
  }

  // Form submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    var fields = form.querySelectorAll("input[required], textarea[required], select[required]");

    for (var j = 0; j < fields.length; j++) {
      if (!validateField(fields[j])) {
        valid = false;
      }
    }

    if (!valid) {
      showToast("Please fix the errors above before submitting.", "danger");
      // Focus first invalid field for accessibility
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) { firstInvalid.focus(); }
      return;
    }

    // Simulate successful submission
    var successEl = document.getElementById("form-success");
    if (successEl) { successEl.classList.remove("d-none"); }
    form.reset();
    if (charCount) { charCount.textContent = "0"; }
    showToast("Message sent successfully!", "success");
    if (successEl) { successEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  });
}

/**
 * Validate a single form field and toggle Bootstrap classes.
 * @param {Element} field
 * @returns {boolean}
 */
function validateField(field) {
  if (!field.hasAttribute("required") && !field.getAttribute("pattern")) {
    return true;
  }

  var valid = true;
  var value = field.value.trim();

  if (field.hasAttribute("required") && value === "") {
    valid = false;
  }

  if (valid && field.type === "email") {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value)) { valid = false; }
  }

  if (valid && field.getAttribute("pattern")) {
    var re = new RegExp("^" + field.getAttribute("pattern") + "$");
    if (!re.test(value)) { valid = false; }
  }

  if (valid && field.hasAttribute("minlength")) {
    if (value.length < parseInt(field.getAttribute("minlength"), 10)) {
      valid = false;
    }
  }

  if (field.type === "checkbox") {
    valid = field.checked;
  }

  if (field.tagName.toLowerCase() === "select" && field.hasAttribute("required")) {
    valid = field.value !== "";
  }

  if (valid) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  return valid;
}

// ============================================================
// CART PAGE
// ============================================================
function initCartPage() {
  var cartContent = document.getElementById("cart-content");
  var emptyCart = document.getElementById("empty-cart");
  if (!cartContent && !emptyCart) { return; }

  renderCartPage();

  // Listen for cart updates
  document.addEventListener("cartUpdated", function () {
    renderCartPage();
  });

  // Clear cart button
  var clearBtn = document.getElementById("clear-cart-btn");
  var clearModal = document.getElementById("clearCartModal")
    ? new bootstrap.Modal(document.getElementById("clearCartModal"))
    : null;

  if (clearBtn && clearModal) {
    clearBtn.addEventListener("click", function () {
      clearModal.show();
    });
  }

  var confirmClear = document.getElementById("confirm-clear-cart");
  if (confirmClear) {
    confirmClear.addEventListener("click", function () {
      Cart.clearCart();
      if (clearModal) { clearModal.hide(); }
      showToast("Cart cleared.", "warning");
    });
  }

  // Checkout button
  var checkoutBtn = document.getElementById("checkout-btn");
  var checkoutModal = document.getElementById("checkoutModal")
    ? new bootstrap.Modal(document.getElementById("checkoutModal"))
    : null;

  if (checkoutBtn && checkoutModal) {
    checkoutBtn.addEventListener("click", function () {
      var summary = Cart.getSummary();
      if (summary.items.length === 0) {
        showToast("Your cart is empty!", "warning");
        return;
      }
      checkoutModal.show();
      resetCheckoutSteps();
    });
  }

  // Promo code
  var applyPromoBtn = document.getElementById("apply-promo");
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", function () {
      var input = document.getElementById("promo-input");
      var feedback = document.getElementById("promo-feedback");
      if (!input) { return; }
      var result = Cart.applyPromo(input.value);
      if (feedback) {
        feedback.textContent = result.message;
        feedback.className = result.valid ? "form-text text-success" : "form-text text-danger";
      }
      if (result.valid) {
        showToast(result.message, "success");
        input.value = "";
      }
    });
  }

  // Delivery option change
  var deliveryOption = document.getElementById("delivery-option");
  if (deliveryOption) {
    deliveryOption.addEventListener("change", function () {
      renderOrderSummary();
    });
  }

  initCheckoutFlow();
}

/**
 * Render the full cart page state.
 */
function renderCartPage() {
  var summary = Cart.getSummary();
  var cartContent = document.getElementById("cart-content");
  var emptyCart = document.getElementById("empty-cart");

  if (summary.items.length === 0) {
    if (cartContent) { cartContent.classList.add("d-none"); }
    if (emptyCart) { emptyCart.classList.remove("d-none"); }
  } else {
    if (emptyCart) { emptyCart.classList.add("d-none"); }
    if (cartContent) { cartContent.classList.remove("d-none"); }
    renderCartItems(summary);
    renderOrderSummary();
  }
}

/**
 * Render the cart items list.
 * @param {object} summary
 */
function renderCartItems(summary) {
  var list = document.getElementById("cart-items-list");
  var countEl = document.getElementById("item-count");
  if (!list) { return; }

  if (countEl) { countEl.textContent = summary.itemCount; }

  var html = "";
  for (var i = 0; i < summary.items.length; i++) {
    var item = summary.items[i];
    html += '<div class="cart-item d-flex align-items-start gap-3" data-item-id="' + item.id + '">' +
      '<div class="cart-item-img-placeholder flex-shrink-0" aria-hidden="true">' +
        '<i class="fa-solid ' + item.icon + '"></i>' +
      '</div>' +
      '<div class="flex-grow-1">' +
        '<div class="d-flex justify-content-between align-items-start gap-2">' +
          '<div>' +
            '<h3 class="h6 fw-bold mb-1">' + item.name + '</h3>' +
            '<p class="small text-muted text-capitalize mb-0">' + item.category + '</p>' +
          '</div>' +
          '<button class="btn btn-sm btn-outline-danger remove-item-btn" data-id="' + item.id + '" aria-label="Remove ' + item.name + ' from cart">' +
            '<i class="fa-solid fa-trash" aria-hidden="true"></i>' +
          '</button>' +
        '</div>' +
        '<div class="d-flex justify-content-between align-items-center mt-3">' +
          '<div class="quantity-control" role="group" aria-label="Quantity for ' + item.name + '">' +
            '<button class="qty-btn qty-minus" data-id="' + item.id + '" aria-label="Decrease quantity" ' + (item.quantity <= 1 ? 'disabled' : '') + '>' +
              '<i class="fa-solid fa-minus" aria-hidden="true"></i>' +
            '</button>' +
            '<span class="qty-value" aria-live="polite" aria-label="Quantity">' + item.quantity + '</span>' +
            '<button class="qty-btn qty-plus" data-id="' + item.id + '" aria-label="Increase quantity">' +
              '<i class="fa-solid fa-plus" aria-hidden="true"></i>' +
            '</button>' +
          '</div>' +
          '<span class="fw-bold text-primary-custom">' + formatPrice(item.price * item.quantity) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  list.innerHTML = html;

  // Attach quantity and remove listeners
  var removeButtons = list.querySelectorAll(".remove-item-btn");
  for (var r = 0; r < removeButtons.length; r++) {
    removeButtons[r].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-id"), 10);
      Cart.removeItem(id);
      showToast("Item removed from cart.", "warning");
    });
  }

  var minusButtons = list.querySelectorAll(".qty-minus");
  for (var m = 0; m < minusButtons.length; m++) {
    minusButtons[m].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-id"), 10);
      var summary = Cart.getSummary();
      for (var k = 0; k < summary.items.length; k++) {
        if (summary.items[k].id === id) {
          Cart.updateQuantity(id, summary.items[k].quantity - 1);
          break;
        }
      }
    });
  }

  var plusButtons = list.querySelectorAll(".qty-plus");
  for (var p = 0; p < plusButtons.length; p++) {
    plusButtons[p].addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-id"), 10);
      var summary = Cart.getSummary();
      for (var k = 0; k < summary.items.length; k++) {
        if (summary.items[k].id === id) {
          Cart.updateQuantity(id, summary.items[k].quantity + 1);
          break;
        }
      }
    });
  }
}

/**
 * Render the order summary sidebar.
 */
function renderOrderSummary() {
  var summary = Cart.getSummary();
  var subtotalEl = document.getElementById("summary-subtotal");
  var deliveryEl = document.getElementById("summary-delivery");
  var discountEl = document.getElementById("summary-discount");
  var totalEl = document.getElementById("summary-total");
  var progressBar = document.getElementById("delivery-progress-bar");
  var progressText = document.getElementById("delivery-progress-text");
  var deliveryMsg = document.getElementById("delivery-message");

  var deliveryOption = document.getElementById("delivery-option");
  var deliveryExtra = 0;
  if (deliveryOption) {
    var val = deliveryOption.value;
    if (val === "express") { deliveryExtra = 9.99; }
    else if (val === "next-day") { deliveryExtra = 14.99; }
    else { deliveryExtra = 0; }
  }

  var delivery = summary.delivery + deliveryExtra;
  var total = summary.subtotal - summary.discount + delivery;

  if (subtotalEl) { subtotalEl.textContent = formatPrice(summary.subtotal); }
  if (deliveryEl) { deliveryEl.textContent = delivery === 0 ? "FREE" : formatPrice(delivery); }
  if (discountEl) { discountEl.textContent = "-" + formatPrice(summary.discount); }
  if (totalEl) { totalEl.textContent = formatPrice(Math.max(0, total)); }

  // Delivery progress bar
  var progressPct = Math.min(100, (summary.subtotal / 50) * 100);
  if (progressBar) {
    progressBar.style.width = progressPct + "%";
    progressBar.setAttribute("aria-valuenow", Math.round(summary.subtotal));
    var container = document.getElementById("delivery-progress-bar-container");
    if (container) { container.setAttribute("aria-valuenow", Math.round(summary.subtotal)); }
  }
  if (progressText) { progressText.textContent = formatPrice(summary.subtotal) + " of £50"; }
  if (deliveryMsg) {
    if (summary.subtotal >= 50) {
      deliveryMsg.textContent = "🎉 You qualify for free standard delivery!";
      deliveryMsg.className = "small text-success mt-1";
    } else {
      var remaining = (50 - summary.subtotal).toFixed(2);
      deliveryMsg.textContent = "Spend £" + remaining + " more for free delivery!";
      deliveryMsg.className = "small text-muted mt-1";
    }
  }
}

// ============================================================
// CHECKOUT MULTI-STEP FLOW
// ============================================================
function initCheckoutFlow() {
  var step1Next = document.getElementById("step1-next");
  var step2Next = document.getElementById("step2-next");
  var step2Back = document.getElementById("step2-back");
  var step3Back = document.getElementById("step3-back");
  var placeOrder = document.getElementById("place-order-btn");

  if (step1Next) {
    step1Next.addEventListener("click", function () {
      var form = document.getElementById("delivery-form");
      if (!validateCheckoutForm(form)) { return; }
      goToCheckoutStep(2);
    });
  }

  if (step2Back) {
    step2Back.addEventListener("click", function () { goToCheckoutStep(1); });
  }

  if (step2Next) {
    step2Next.addEventListener("click", function () {
      var form = document.getElementById("payment-form");
      if (!validateCheckoutForm(form)) { return; }
      populateOrderReview();
      goToCheckoutStep(3);
    });
  }

  if (step3Back) {
    step3Back.addEventListener("click", function () { goToCheckoutStep(2); });
  }

  if (placeOrder) {
    placeOrder.addEventListener("click", function () {
      placeOrder.disabled = true;
      placeOrder.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Processing…';

      // Simulate network delay
      setTimeout(function () {
        var orderNum = "JOY-" + Math.floor(100000 + Math.random() * 900000);
        var orderNumEl = document.getElementById("order-number");
        if (orderNumEl) { orderNumEl.textContent = orderNum; }

        // Hide all steps, show success
        var steps = ["checkout-step-1", "checkout-step-2", "checkout-step-3"];
        for (var i = 0; i < steps.length; i++) {
          var el = document.getElementById(steps[i]);
          if (el) { el.classList.add("d-none"); }
        }
        var success = document.getElementById("checkout-success");
        if (success) { success.classList.remove("d-none"); }

        // Clear cart after successful order
        Cart.clearCart();
        showToast("Order placed! Thank you for shopping with Joy2buy.", "success");
      }, 1500);
    });
  }
}

/**
 * Navigate to a checkout step.
 * @param {number} stepNum - 1, 2, or 3
 */
function goToCheckoutStep(stepNum) {
  for (var i = 1; i <= 3; i++) {
    var stepEl = document.getElementById("checkout-step-" + i);
    var indicatorEl = document.getElementById("step-indicator-" + i);
    if (stepEl) {
      if (i === stepNum) {
        stepEl.classList.remove("d-none");
      } else {
        stepEl.classList.add("d-none");
      }
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

function resetCheckoutSteps() {
  goToCheckoutStep(1);
  var success = document.getElementById("checkout-success");
  if (success) { success.classList.add("d-none"); }
  var placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>Place Order';
  }
}

/**
 * Populate the order review panel (step 3).
 */
function populateOrderReview() {
  var reviewEl = document.getElementById("order-review-details");
  if (!reviewEl) { return; }

  var summary = Cart.getSummary();
  var firstName = document.getElementById("first-name");
  var lastName = document.getElementById("last-name");
  var email = document.getElementById("email");
  var address = document.getElementById("address");
  var city = document.getElementById("city");
  var postcode = document.getElementById("postcode");
  var cardNumber = document.getElementById("card-number");

  var deliveryOption = document.getElementById("delivery-option");
  var deliveryLabel = deliveryOption
    ? deliveryOption.options[deliveryOption.selectedIndex].text
    : "Standard Delivery";

  var itemsHtml = "";
  for (var i = 0; i < summary.items.length; i++) {
    var item = summary.items[i];
    itemsHtml += '<div class="d-flex justify-content-between py-1 border-bottom">' +
      '<span class="small">' + item.name + ' × ' + item.quantity + '</span>' +
      '<span class="small fw-semibold">' + formatPrice(item.price * item.quantity) + '</span>' +
    '</div>';
  }

  var maskedCard = cardNumber && cardNumber.value
    ? "**** **** **** " + cardNumber.value.replace(/\s/g, "").slice(-4)
    : "**** **** **** ****";

  reviewEl.innerHTML =
    '<div class="row g-3">' +
      '<div class="col-md-6">' +
        '<h4 class="h6 fw-bold text-muted text-uppercase mb-2">Delivery To</h4>' +
        '<p class="mb-0 small">' +
          (firstName ? firstName.value : "") + ' ' + (lastName ? lastName.value : "") + '<br/>' +
          (address ? address.value : "") + ', ' + (city ? city.value : "") + '<br/>' +
          (postcode ? postcode.value : "") + '<br/>' +
          (email ? email.value : "") +
        '</p>' +
        '<p class="mt-2 small"><strong>Delivery:</strong> ' + deliveryLabel + '</p>' +
      '</div>' +
      '<div class="col-md-6">' +
        '<h4 class="h6 fw-bold text-muted text-uppercase mb-2">Payment</h4>' +
        '<p class="small mb-0">' + maskedCard + '</p>' +
      '</div>' +
      '<div class="col-12">' +
        '<h4 class="h6 fw-bold text-muted text-uppercase mb-2">Order Items</h4>' +
        itemsHtml +
        '<div class="d-flex justify-content-between py-2 fw-bold">' +
          '<span>Total</span>' +
          '<span class="text-primary-custom">' + formatPrice(summary.total) + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
}

/**
 * Validate all required fields in a checkout form step.
 * @param {Element} form
 * @returns {boolean}
 */
function validateCheckoutForm(form) {
  if (!form) { return true; }
  var valid = true;
  var fields = form.querySelectorAll("[required]");

  for (var i = 0; i < fields.length; i++) {
    if (!validateField(fields[i])) {
      valid = false;
    }
  }

  if (!valid) {
    showToast("Please fill in all required fields.", "danger");
    var firstInvalid = form.querySelector(".is-invalid");
    if (firstInvalid) { firstInvalid.focus(); }
  }
  return valid;
}

// ============================================================
// NAVBAR SCROLL BEHAVIOUR
// ============================================================
function initNavbar() {
  // Format card number input (auto-space every 4 digits)
  var cardInput = document.getElementById("card-number");
  if (cardInput) {
    cardInput.addEventListener("input", function () {
      var v = this.value.replace(/\D/g, "").substring(0, 16);
      var formatted = v.replace(/(.{4})/g, "$1 ").trim();
      this.value = formatted;
    });
  }

  // Format card expiry input (MM/YY)
  var expiryInput = document.getElementById("card-expiry");
  if (expiryInput) {
    expiryInput.addEventListener("input", function () {
      var v = this.value.replace(/\D/g, "").substring(0, 4);
      if (v.length >= 2) {
        v = v.substring(0, 2) + "/" + v.substring(2);
      }
      this.value = v;
    });
  }

  // CVV numeric only
  var cvvInput = document.getElementById("card-cvv");
  if (cvvInput) {
    cvvInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").substring(0, 4);
    });
  }
}

// ============================================================
// DOM READY — BOOTSTRAP ALL MODULES
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

  // Attach wishlist and cart listeners on homepage featured products
  var featuredGrid = document.getElementById("featured-products-grid");
  if (featuredGrid) {
    initFeaturedProducts();
    attachWishlistListeners(featuredGrid);
  }

  // Products page
  initProductsPage();

  // Homepage countdown
  initCountdown();

  // Newsletter
  initNewsletter();

  // Contact form
  initContactForm();

  // Cart page
  initCartPage();

  // Navbar card formatting helpers
  initNavbar();

  // Navbar search form (non-products pages redirect to products.html?q=)
  var navSearchForm = document.getElementById("navSearchForm");
  if (navSearchForm && !document.getElementById("products-grid")) {
    navSearchForm.addEventListener("submit", function (e) {
      // Allow default — the action="products.html" will carry q param
    });
  }
});
