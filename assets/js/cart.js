/*
 * cart.js — Joy2buy Cart State Manager
 * Unit 2: Interactive Front End Development
 *
 * Manages all cart state using a plain JavaScript object (no backend).
 * State is persisted to sessionStorage so it survives page navigation
 * within the same browser session.
 *
 * Exposes a global `Cart` object used by main.js and cart.html.
 */

/* jshint esversion: 6 */
"use strict";

var Cart = (function () {

  // Private cart state object
  var _state = {
    items: [],         // Array of cart item objects
    promoCode: null,   // Applied promo code string
    discount: 0        // Discount amount in pounds
  };

  var STORAGE_KEY = "joy2buy_cart";
  var DELIVERY_THRESHOLD = 50;
  var STANDARD_DELIVERY = 4.99;

  // Available promo codes (for demo purposes)
  var PROMO_CODES = {
    "JOY10": 10,
    "SAVE20": 20,
    "FIRST15": 15
  };

  // --------------------------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------------------------

  /**
   * Load cart state from sessionStorage.
   */
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

  /**
   * Save current cart state to sessionStorage.
   */
  function _save() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    } catch (e) {
      // sessionStorage may be unavailable; degrade gracefully
    }
  }

  /**
   * Find the index of a product in the cart by its ID.
   * @param {number|string} productId
   * @returns {number} index, or -1 if not found
   */
  function _findIndex(productId) {
    var id = String(productId);
    for (var i = 0; i < _state.items.length; i++) {
      if (String(_state.items[i].id) === id) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Calculate the subtotal of all cart items.
   * @returns {number}
   */
  function _calcSubtotal() {
    var total = 0;
    for (var i = 0; i < _state.items.length; i++) {
      total += _state.items[i].price * _state.items[i].quantity;
    }
    return total;
  }

  /**
   * Dispatch a custom DOM event to notify other scripts of cart changes.
   */
  function _notify() {
    var event = new CustomEvent("cartUpdated", { detail: _getPublicState() });
    document.dispatchEvent(event);
  }

  /**
   * Return a safe copy of the public-facing cart summary.
   * @returns {object}
   */
  function _getPublicState() {
    var subtotal = _calcSubtotal();
    var delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : (subtotal === 0 ? 0 : STANDARD_DELIVERY);
    var discountAmount = Math.min(_state.discount, subtotal);
    var total = Math.max(0, subtotal - discountAmount + delivery);

    return {
      items: _state.items.slice(),
      itemCount: _getTotalQuantity(),
      subtotal: subtotal,
      delivery: delivery,
      discount: discountAmount,
      total: total,
      promoCode: _state.promoCode
    };
  }

  /**
   * Calculate total quantity of all items in the cart.
   * @returns {number}
   */
  function _getTotalQuantity() {
    var count = 0;
    for (var i = 0; i < _state.items.length; i++) {
      count += _state.items[i].quantity;
    }
    return count;
  }

  // --------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------

  /**
   * Initialise the cart by loading from sessionStorage.
   * Call once on page load.
   */
  function init() {
    _load();
    _updateCartBadge();
  }

  /**
   * Add a product to the cart. If already present, increment quantity.
   * @param {object} product - { id, name, price, category, icon }
   * @param {number} [qty=1]
   * @returns {string} 'added' | 'incremented'
   */
  function addItem(product, qty) {
    qty = (typeof qty === "number" && qty > 0) ? Math.floor(qty) : 1;
    var idx = _findIndex(product.id);

    if (idx === -1) {
      _state.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category || "",
        icon: product.icon || "fa-box",
        quantity: qty
      });
      _save();
      _notify();
      _updateCartBadge();
      return "added";
    } else {
      _state.items[idx].quantity += qty;
      _save();
      _notify();
      _updateCartBadge();
      return "incremented";
    }
  }

  /**
   * Remove a product from the cart entirely.
   * @param {number|string} productId
   */
  function removeItem(productId) {
    var idx = _findIndex(productId);
    if (idx !== -1) {
      _state.items.splice(idx, 1);
      _save();
      _notify();
      _updateCartBadge();
    }
  }

  /**
   * Update the quantity of an item.
   * If quantity becomes 0 or less, the item is removed.
   * @param {number|string} productId
   * @param {number} newQty
   */
  function updateQuantity(productId, newQty) {
    newQty = parseInt(newQty, 10);
    if (newQty <= 0 || isNaN(newQty)) {
      removeItem(productId);
      return;
    }
    var idx = _findIndex(productId);
    if (idx !== -1) {
      _state.items[idx].quantity = newQty;
      _save();
      _notify();
      _updateCartBadge();
    }
  }

  /**
   * Clear all items and reset promo code.
   */
  function clearCart() {
    _state = { items: [], promoCode: null, discount: 0 };
    _save();
    _notify();
    _updateCartBadge();
  }

  /**
   * Apply a promo code. Returns { valid, message, discount }.
   * @param {string} code
   * @returns {object}
   */
  function applyPromo(code) {
    var upper = String(code).trim().toUpperCase();
    if (PROMO_CODES.hasOwnProperty(upper)) {
      _state.promoCode = upper;
      _state.discount = PROMO_CODES[upper];
      _save();
      _notify();
      return { valid: true, message: upper + " applied — £" + PROMO_CODES[upper] + " off!", discount: PROMO_CODES[upper] };
    }
    return { valid: false, message: "Invalid promo code. Try JOY10, SAVE20, or FIRST15.", discount: 0 };
  }

  /**
   * Remove the current promo code.
   */
  function removePromo() {
    _state.promoCode = null;
    _state.discount = 0;
    _save();
    _notify();
  }

  /**
   * Get current cart summary (read-only copy).
   * @returns {object}
   */
  function getSummary() {
    return _getPublicState();
  }

  /**
   * Get total number of unique product lines in the cart.
   * @returns {number}
   */
  function getItemCount() {
    return _getTotalQuantity();
  }

  /**
   * Check if a product is already in the cart.
   * @param {number|string} productId
   * @returns {boolean}
   */
  function hasItem(productId) {
    return _findIndex(productId) !== -1;
  }

  /**
   * Update the cart badge count in the navbar.
   */
  function _updateCartBadge() {
    var badges = document.querySelectorAll("#cart-count");
    var count = _getTotalQuantity();
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      if (count === 0) {
        badges[i].classList.add("d-none");
      } else {
        badges[i].classList.remove("d-none");
      }
    }
  }

  // Expose public API
  return {
    init: init,
    addItem: addItem,
    removeItem: removeItem,
    updateQuantity: updateQuantity,
    clearCart: clearCart,
    applyPromo: applyPromo,
    removePromo: removePromo,
    getSummary: getSummary,
    getItemCount: getItemCount,
    hasItem: hasItem
  };

}());

// Initialise on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  Cart.init();
});
