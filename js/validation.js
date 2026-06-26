/**
 * @file validation.js — Joy2buy Form Validation Module
 * @description Provides a `window.Validation` module that handles all
 *   client-side form validation. Validates individual fields on blur and
 *   entire forms on submit. Covers: contact form, checkout step 1 (delivery),
 *   checkout step 2 (payment), and newsletter form. Satisfies Pass criterion
 *   2.6 (form validation) and Distinction criterion D(v) (clean code).
 *
 * @module Validation
 */

/* jshint esversion: 6 */
"use strict";

window.Validation = (function () {

  /** @constant {boolean} DEBUG — set to false for production */
  var DEBUG = false;

  // ─── Regex constants (no magic strings) ─────────────────────────────────────

  /** RFC-5321 simplified email pattern */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /** UK postcode pattern — covers outward + inward codes */
  var POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;

  /** Card number: 16 digits, optional spaces every 4 */
  var CARD_NUMBER_RE = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;

  /** Expiry: MM/YY */
  var CARD_EXPIRY_RE = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

  /** CVV: 3 or 4 digits */
  var CARD_CVV_RE = /^\d{3,4}$/;

  /** UK phone: optional + prefix, digits/spaces/dashes/parens, 7–15 chars */
  var PHONE_RE = /^[+]?[0-9\s\-() ]{7,15}$/;

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Log a debug message when DEBUG is enabled.
   * @param {string} msg
   * @param {*} [data]
   */
  function _log(msg, data) {
    if (!DEBUG) { return; }
    if (data !== undefined) {
      console.log("[Validation]", msg, data);
    } else {
      console.log("[Validation]", msg);
    }
  }

  /**
   * Mark a field as valid — apply Bootstrap is-valid class and remove is-invalid.
   * @param {HTMLElement} field
   */
  function _markValid(field) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }

  /**
   * Mark a field as invalid — apply Bootstrap is-invalid class and remove is-valid.
   * @param {HTMLElement} field
   */
  function _markInvalid(field) {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  /**
   * Test a card expiry date string to check it has not already passed.
   * @param {string} value — format "MM/YY"
   * @returns {boolean}
   */
  function _isExpiryFuture(value) {
    var parts = value.split("/");
    if (parts.length !== 2) { return false; }
    var month = parseInt(parts[0], 10);
    var year  = parseInt("20" + parts[1], 10);
    var now   = new Date();
    var expiry = new Date(year, month, 1); // first day of the month AFTER expiry
    return expiry > now;
  }

  // ─── Core validation logic ───────────────────────────────────────────────────

  /**
   * Validate a single form field element.
   *
   * Checks applied (in order, short-circuit on first failure):
   *  1. Presence (required attribute + non-empty value)
   *  2. Email format
   *  3. UK postcode format (detected by field ID containing "postcode")
   *  4. Card number format (detected by field ID "card-number")
   *  5. Card expiry format + future date (detected by field ID "card-expiry")
   *  6. CVV format (detected by field ID "card-cvv")
   *  7. Phone format (detected by field type "tel")
   *  8. Pattern attribute (generic HTML5 pattern)
   *  9. Minlength attribute
   * 10. Checkbox checked
   * 11. Select non-empty
   *
   * @param {HTMLElement} field — Any input, select, or textarea element
   * @returns {boolean} true if valid
   */
  function validateField(field) {
    if (!field) { return true; }

    var tag      = field.tagName.toLowerCase();
    var type     = (field.type || "").toLowerCase();
    var value    = (tag === "checkbox") ? "" : field.value.trim();
    var required = field.hasAttribute("required");
    var fieldId  = field.id || "";

    // Checkbox — only check "checked" state
    if (type === "checkbox") {
      if (required && !field.checked) {
        _markInvalid(field);
        _log("Checkbox unchecked:", fieldId);
        return false;
      }
      _markValid(field);
      return true;
    }

    // Select — check non-empty value
    if (tag === "select") {
      if (required && value === "") {
        _markInvalid(field);
        _log("Select empty:", fieldId);
        return false;
      }
      _markValid(field);
      return true;
    }

    // Required presence check
    if (required && value === "") {
      _markInvalid(field);
      _log("Required field empty:", fieldId);
      return false;
    }

    // If not required and empty, skip further checks
    if (!required && value === "") {
      field.classList.remove("is-valid", "is-invalid");
      return true;
    }

    // Email format
    if (type === "email") {
      if (!EMAIL_RE.test(value)) {
        _markInvalid(field);
        _log("Invalid email:", value);
        return false;
      }
    }

    // UK postcode
    if (fieldId.indexOf("postcode") !== -1) {
      if (!POSTCODE_RE.test(value)) {
        _markInvalid(field);
        _log("Invalid postcode:", value);
        return false;
      }
    }

    // Card number
    if (fieldId === "card-number") {
      if (!CARD_NUMBER_RE.test(value)) {
        _markInvalid(field);
        _log("Invalid card number:", value);
        return false;
      }
    }

    // Card expiry
    if (fieldId === "card-expiry") {
      if (!CARD_EXPIRY_RE.test(value) || !_isExpiryFuture(value)) {
        _markInvalid(field);
        _log("Invalid or expired card expiry:", value);
        return false;
      }
    }

    // CVV
    if (fieldId === "card-cvv") {
      if (!CARD_CVV_RE.test(value)) {
        _markInvalid(field);
        _log("Invalid CVV:", value);
        return false;
      }
    }

    // Phone number
    if (type === "tel" && value.length > 0) {
      if (!PHONE_RE.test(value)) {
        _markInvalid(field);
        _log("Invalid phone:", value);
        return false;
      }
    }

    // Generic HTML5 pattern attribute
    var pattern = field.getAttribute("pattern");
    if (pattern && value.length > 0) {
      try {
        var re = new RegExp("^(?:" + pattern + ")$");
        if (!re.test(value)) {
          _markInvalid(field);
          _log("Pattern mismatch on", fieldId, "pattern:", pattern);
          return false;
        }
      } catch (syntaxErr) {
        _log("Invalid pattern regex on", fieldId, syntaxErr);
      }
    }

    // Minlength
    var minLen = field.getAttribute("minlength");
    if (minLen !== null) {
      if (value.length < parseInt(minLen, 10)) {
        _markInvalid(field);
        _log("Too short:", fieldId, "min:", minLen);
        return false;
      }
    }

    _markValid(field);
    return true;
  }

  /**
   * Validate all required (and patterned) fields within a form.
   * Focuses the first invalid field for accessibility.
   *
   * @param {HTMLElement} formEl — The form element to validate
   * @returns {boolean} true only if every field passes
   */
  function validateForm(formEl) {
    if (!formEl) { return true; }

    var allValid = true;
    var fields   = formEl.querySelectorAll("input, select, textarea");

    for (var i = 0; i < fields.length; i++) {
      var fieldValid = validateField(fields[i]);
      if (!fieldValid && allValid) {
        allValid = false;
      }
    }

    if (!allValid) {
      var firstInvalid = formEl.querySelector(".is-invalid");
      if (firstInvalid) { firstInvalid.focus(); }
    }

    return allValid;
  }

  /**
   * Wire up blur-time validation on all fields in a form.
   * Call once on DOMContentLoaded for each form.
   *
   * @param {HTMLElement} formEl
   */
  function wireBlurValidation(formEl) {
    if (!formEl) { return; }

    var fields = formEl.querySelectorAll("input, select, textarea");
    for (var i = 0; i < fields.length; i++) {
      fields[i].addEventListener("blur", function () {
        validateField(this);
      });
    }
    _log("Blur validation wired on form:", formEl.id || formEl);
  }

  /**
   * Validate an email address string directly (without a DOM element).
   * Used for the newsletter quick check.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return EMAIL_RE.test((email || "").trim());
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  return {
    validateField:       validateField,
    validateForm:        validateForm,
    wireBlurValidation:  wireBlurValidation,
    isValidEmail:        isValidEmail
  };

}());
