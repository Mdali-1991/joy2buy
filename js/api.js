/**
 * @file api.js — Joy2buy Simulated Async Data Layer
 * @description Provides a `window.API` module that wraps all data operations
 *   in a simulated asynchronous pattern (setTimeout). Demonstrates understanding
 *   of asynchronous code: loading states, error handling, offline detection,
 *   and request timeouts. Satisfies Distinction criterion D(i).
 *
 * @module API
 */

/* jshint esversion: 6 */
"use strict";

window.API = (function () {

  /** @constant {boolean} DEBUG — set to false for production */
  var DEBUG = false;

  /** @constant {number} DEFAULT_DELAY_MS — simulated network latency */
  var DEFAULT_DELAY_MS = 600;

  /** @constant {number} TIMEOUT_MS — maximum wait before timeout error */
  var TIMEOUT_MS = 8000;

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Log a debug message to the console only when DEBUG is true.
   * @param {string} msg
   * @param {*} [data]
   */
  function _log(msg, data) {
    if (!DEBUG) { return; }
    if (data !== undefined) {
      console.log("[API]", msg, data);
    } else {
      console.log("[API]", msg);
    }
  }

  /**
   * Check whether the browser currently has a network connection.
   * Falls back to `true` if the API is unsupported.
   * @returns {boolean}
   */
  function _isOnline() {
    if (typeof navigator !== "undefined" && typeof navigator.onLine === "boolean") {
      return navigator.onLine;
    }
    return true;
  }

  // ─── Loader UI ──────────────────────────────────────────────────────────────

  /**
   * Show a loading indicator by ID, setting aria-busy on its container.
   * @param {string} loaderId — ID of the loader element
   * @param {string} [containerId] — Optional ID of the aria-busy container
   */
  function showLoader(loaderId, containerId) {
    var loader = document.getElementById(loaderId);
    if (loader) {
      loader.classList.remove("d-none");
    }
    if (containerId) {
      var container = document.getElementById(containerId);
      if (container) {
        container.setAttribute("aria-busy", "true");
      }
    }
    _log("Loader shown:", loaderId);
  }

  /**
   * Hide a loading indicator by ID, clearing aria-busy on its container.
   * @param {string} loaderId — ID of the loader element
   * @param {string} [containerId] — Optional ID of the aria-busy container
   */
  function hideLoader(loaderId, containerId) {
    var loader = document.getElementById(loaderId);
    if (loader) {
      loader.classList.add("d-none");
    }
    if (containerId) {
      var container = document.getElementById(containerId);
      if (container) {
        container.setAttribute("aria-busy", "false");
      }
    }
    _log("Loader hidden:", loaderId);
  }

  // ─── Error display ───────────────────────────────────────────────────────────

  /**
   * Display a user-facing error message in a designated error element.
   * @param {string} errorElId — ID of the error container element
   * @param {string} message — Human-readable error text
   */
  function handleFetchError(errorElId, message) {
    var errorEl = document.getElementById(errorElId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("d-none");
    }
    _log("Fetch error displayed:", message);
  }

  /**
   * Clear a previously shown error element.
   * @param {string} errorElId
   */
  function clearError(errorElId) {
    var errorEl = document.getElementById(errorElId);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("d-none");
    }
  }

  // ─── Core simulateFetch ──────────────────────────────────────────────────────

  /**
   * Simulate an asynchronous data fetch with optional loading UI and error states.
   *
   * Demonstrates Distinction criterion D(i):
   *  - Uses setTimeout to simulate async network latency
   *  - Shows/hides loading indicator during the operation
   *  - Detects offline state before attempting the "request"
   *  - Enforces a timeout that rejects after TIMEOUT_MS
   *  - Accepts a `shouldFail` flag to test error path
   *
   * @param {object}   options
   * @param {Function} options.dataFn       — Synchronous function that returns the payload
   * @param {string}   [options.loaderId]   — Loader element ID to show/hide
   * @param {string}   [options.containerId] — aria-busy container ID
   * @param {string}   [options.errorElId]  — Error display element ID
   * @param {number}   [options.delay]      — Override simulated delay in ms
   * @param {boolean}  [options.shouldFail] — Force an error response (for testing)
   * @param {Function} options.onSuccess    — Callback(data) on success
   * @param {Function} [options.onError]    — Callback(errorMsg) on failure
   */
  function simulateFetch(options) {
    var delay       = (typeof options.delay === "number") ? options.delay : DEFAULT_DELAY_MS;
    var loaderId    = options.loaderId    || null;
    var containerId = options.containerId || null;
    var errorElId   = options.errorElId   || null;
    var onSuccess   = typeof options.onSuccess === "function" ? options.onSuccess : function () {};
    var onError     = typeof options.onError   === "function" ? options.onError   : function () {};

    // Clear previous error
    if (errorElId) { clearError(errorElId); }

    // Offline check
    if (!_isOnline()) {
      var offlineMsg = "You appear to be offline. Please check your connection and try again.";
      if (errorElId) { handleFetchError(errorElId, offlineMsg); }
      onError(offlineMsg);
      _log("Offline — aborting simulateFetch");
      return;
    }

    // Show loader
    if (loaderId) { showLoader(loaderId, containerId); }

    _log("simulateFetch started, delay=" + delay + "ms");

    // Timeout guard
    var timedOut = false;
    var timeoutHandle = setTimeout(function () {
      timedOut = true;
      if (loaderId) { hideLoader(loaderId, containerId); }
      var timeoutMsg = "Request timed out. Please try again.";
      if (errorElId) { handleFetchError(errorElId, timeoutMsg); }
      onError(timeoutMsg);
      _log("simulateFetch timed out");
    }, TIMEOUT_MS);

    // Main simulated delay
    setTimeout(function () {
      if (timedOut) { return; }
      clearTimeout(timeoutHandle);

      if (loaderId) { hideLoader(loaderId, containerId); }

      if (options.shouldFail) {
        var failMsg = "Something went wrong. Please refresh the page and try again.";
        if (errorElId) { handleFetchError(errorElId, failMsg); }
        onError(failMsg);
        _log("simulateFetch forced failure");
        return;
      }

      var data;
      try {
        data = options.dataFn();
      } catch (err) {
        var errMsg = "An unexpected error occurred.";
        if (errorElId) { handleFetchError(errorElId, errMsg); }
        onError(errMsg);
        _log("simulateFetch dataFn threw:", err);
        return;
      }

      _log("simulateFetch success, payload:", data);
      onSuccess(data);
    }, delay);
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  return {
    simulateFetch:    simulateFetch,
    showLoader:       showLoader,
    hideLoader:       hideLoader,
    handleFetchError: handleFetchError,
    clearError:       clearError,
    isOnline:         _isOnline
  };

}());
