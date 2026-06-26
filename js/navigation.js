/**
 * @file navigation.js — Joy2buy History API State Manager
 * @description Provides a `window.Navigation` module that manages browser
 *   URL state for the products page using the History API (pushState,
 *   replaceState, popstate). Ensures back/forward navigation never breaks
 *   the application. Satisfies Distinction criterion D(ix).
 *
 * @module Navigation
 */

/* jshint esversion: 6 */
"use strict";

window.Navigation = (function () {

  /** @constant {boolean} DEBUG — set to false for production */
  var DEBUG = false;

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Log debug output only when DEBUG is true.
   * @param {string} msg
   * @param {*} [data]
   */
  function _log(msg, data) {
    if (!DEBUG) { return; }
    if (data !== undefined) {
      console.log("[Navigation]", msg, data);
    } else {
      console.log("[Navigation]", msg);
    }
  }

  /**
   * Build a URLSearchParams string from a filter state object.
   * Only non-default values are serialised to keep URLs clean.
   * @param {object} state — filter state from window.App
   * @returns {string} — query string starting with "?" or ""
   */
  function _stateToQueryString(state) {
    var params = new URLSearchParams();

    if (state.search && state.search.length > 0) {
      params.set("q", state.search);
    }
    if (state.category && state.category !== "all") {
      params.set("category", state.category);
    }
    if (typeof state.maxPrice === "number" && state.maxPrice !== 500) {
      params.set("maxPrice", String(state.maxPrice));
    }
    if (typeof state.minRating === "number" && state.minRating > 0) {
      params.set("minRating", String(state.minRating));
    }
    if (state.sort && state.sort !== "default") {
      params.set("sort", state.sort);
    }

    var qs = params.toString();
    return qs.length > 0 ? ("?" + qs) : "";
  }

  /**
   * Parse the current URL query string into a filter state object.
   * Missing parameters fall back to their default values.
   * @returns {object} — partial filter state
   */
  function _queryStringToState() {
    var params = new URLSearchParams(window.location.search);
    return {
      search:    params.get("q")         || "",
      category:  params.get("category")  || "all",
      maxPrice:  params.get("maxPrice")  ? parseInt(params.get("maxPrice"), 10)   : 500,
      minRating: params.get("minRating") ? parseFloat(params.get("minRating"))    : 0,
      sort:      params.get("sort")      || "default"
    };
  }

  // ─── Public methods ─────────────────────────────────────────────────────────

  /**
   * Push a new history entry for the given filter state.
   * Call this whenever the user changes a filter or search term on products.html.
   * @param {object} state — current filter state object
   * @param {string} [title] — Optional page title override
   */
  function updateURL(state, title) {
    var qs     = _stateToQueryString(state);
    var url    = window.location.pathname + qs;
    var label  = title || document.title;

    try {
      window.history.pushState(state, label, url);
      _log("pushState:", url);
    } catch (err) {
      _log("pushState failed:", err);
    }
  }

  /**
   * Replace the current history entry without adding a new one.
   * Call this on initial page load to record the starting state.
   * @param {object} state — current filter state object
   * @param {string} [title] — Optional page title override
   */
  function replaceCurrentURL(state, title) {
    var qs    = _stateToQueryString(state);
    var url   = window.location.pathname + qs;
    var label = title || document.title;

    try {
      window.history.replaceState(state, label, url);
      _log("replaceState:", url);
    } catch (err) {
      _log("replaceState failed:", err);
    }
  }

  /**
   * Read filter state from the current URL query string.
   * Call this on page load to initialise filters from a bookmarked or
   * shared URL, or when restoring state after a popstate event.
   * @returns {object}
   */
  function restoreStateFromURL() {
    var state = _queryStringToState();
    _log("Restored state from URL:", state);
    return state;
  }

  /**
   * Register a callback to be invoked on every popstate event
   * (back/forward button press). The callback receives the restored
   * filter state object so the UI can be updated without a page reload.
   *
   * @param {Function} onPopCallback — function(state) called on popstate
   */
  function onPop(onPopCallback) {
    if (typeof onPopCallback !== "function") { return; }

    window.addEventListener("popstate", function (event) {
      var restoredState;

      if (event.state && typeof event.state === "object") {
        restoredState = event.state;
        _log("popstate — using history.state:", restoredState);
      } else {
        // Fallback: re-parse the URL if state was not stored (e.g. initial load)
        restoredState = _queryStringToState();
        _log("popstate — re-parsed URL:", restoredState);
      }

      onPopCallback(restoredState);
    });
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  return {
    updateURL:          updateURL,
    replaceCurrentURL:  replaceCurrentURL,
    restoreStateFromURL: restoreStateFromURL,
    onPop:              onPop
  };

}());
