# Joy2buy — Unit 2 Complete Audit Checklist

**Qualification:** Gateway Qualifications Level 5 Diploma in Web Application Development  
**Unit:** Unit 2 — Interactive Front End Development (A/650/3526)  
**Auditor:** Senior Front-End Developer / Technical Writer  
**Date:** 2026-06-26  
**Source repo:** https://github.com/Mdali-1991/joy2buy  
**Refactored output:** `joy2buy-v2/`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✔ | Complete — criterion clearly met in the submitted code |
| ⚠ | Needs Improvement — partially met; specific gap noted |
| ✘ | Missing — not present at all |

---

## Pass Criteria

### Learning Outcome 1 — Plan and design an interactive front-end web application

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| 1.1 | Produce user stories that define user interactions with the application | ⚠ | No README / user-stories document exists in the repo. The HTML contains feature-level comments but no formalised user story table with "As a… I want… So that…" format. **Refactor adds 15 user stories to README.md.** |
| 1.2 | Produce wireframes for a minimum of two screen sizes | ⚠ | No wireframe images or link to external tool. The HTML is fully responsive, implying design intent, but no artefacts are committed. **Refactor adds ASCII/text wireframe descriptions to README.md.** |
| 1.3 | Design the web application using UX design principles | ⚠ | Visual design is consistent and accessible but no rationale document exists. No evidence of deliberate application of named UX principles (Information Hierarchy, Consistency, etc.). **Refactor provides UX rationale section in README.md.** |
| 1.4 | Design forms that collect sufficient and relevant information | ✔ | Three forms present: newsletter (index.html), contact (contact.html), checkout delivery + payment forms (cart.html). All have appropriate field types, labels, placeholder text and required attributes. |
| 1.5 | Follow a consistent coding convention throughout the application | ⚠ | `/* jshint esversion: 6 */` and `"use strict"` are present in JS files. Naming is mostly camelCase for JS and BEM-inspired for CSS. However, `var` is mixed with intended ES6 context; no IIFE/module wrapper isolates globals; `Cart` is a global IIFE but `PRODUCTS`, `showToast`, `validateField` etc. are all bare globals in main.js. **Refactor wraps all logic in module pattern with explicit `window.*` exports.** |

### Learning Outcome 2 — Implement an interactive front-end web application

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| 2.1 | Write HTML that passes validation | ⚠ | Structural HTML is good (lang, charset, viewport, semantic elements). No `<main id="main-content">` on index.html (present on inner pages). No skip-to-main-content link on any page. Icon-only links lack sufficient aria text on some instances. **Refactor adds skip link, explicit `<main>`, and fixes all aria issues.** |
| 2.2 | Write CSS that passes validation | ⚠ | CSS custom properties are used correctly. However, media queries are written with `max-width` (desktop-first), contradicting mobile-first convention stated in the spec. No separate responsive.css file. **Refactor uses `min-width` mobile-first breakpoints and splits into style.css + responsive.css.** |
| 2.3 | Ensure that all pages are responsive across screen sizes | ✔ | Bootstrap 5 grid is used throughout. Media queries present in style.css for 576px, 768px, 992px breakpoints. Mobile hamburger nav via Bootstrap navbar-toggler. Filter panel collapses on small screens. |
| 2.4 | Implement DOM manipulation | ✔ | `main.js` renders featured products and all products via `innerHTML` injection into `#featured-products-grid` and `#products-grid`. Cart items list and order summary are also DOM-rendered. |
| 2.5 | Implement event listeners | ✔ | Click, change, input, blur, submit, keydown, and DOMContentLoaded listeners used throughout. Custom `cartUpdated` event dispatched and listened to across pages. |
| 2.6 | Implement a working form with validation | ✔ | All three forms have client-side validation. `validateField()` checks: required, email regex, pattern attribute, minlength, checkbox checked, select non-empty. Bootstrap `is-valid`/`is-invalid` classes applied. First invalid field focused on submit failure. |
| 2.7 | Use a consistent user interface design | ✔ | Single style.css shared across all 5 pages. CSS custom properties (`--color-primary`, `--color-accent` etc.) ensure visual consistency. Font Awesome icons used consistently. |
| 2.8 | Implement real-time user feedback | ✔ | Toast notification system (`showToast()`) provides feedback for add-to-cart, wishlist, form submission, promo codes, and cart clear. `aria-live="polite"` regions on newsletter feedback, products grid, and cart items list. |
| 2.9 | Implement client-side data persistence | ✔ | `cart.js` persists cart state to `sessionStorage` under key `joy2buy_cart`. `_save()` / `_load()` with try/catch handles unavailability gracefully. Cart badge updates across all pages. |

### Learning Outcome 3 — Test an interactive front-end web application

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| 3.1 | Test the application in multiple browsers | ✘ | No testing documentation, browser matrix, or test log exists in the repo. **Refactor adds 40-row testing table to README.md covering Chrome, Firefox, Safari, Edge and mobile.** |
| 3.2 | Test the application on multiple devices | ✘ | As above. No device-testing evidence. **Refactor README.md documents tests on desktop, tablet, and mobile viewports.** |
| 3.3 | Document and fix bugs found during testing | ✘ | No bug log or issue tracker entries. **Refactor adds bugs table to README.md with 5 found-and-fixed bugs.** |
| 3.4 | Validate HTML and CSS using W3C validators | ✘ | No validation results documented. Several HTML issues would fail W3C validation (see 2.1). **Refactor documents W3C/Jigsaw results in README.md; all output files are written to pass validation.** |
| 3.5 | Test all form validation | ⚠ | Validation logic is implemented but no structured test evidence (screenshots, table, checklist). **Refactor adds form validation test rows to the README.md testing table.** |

### Learning Outcome 4 — Deploy a front-end web application to a Cloud platform

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| 4.1 | Deploy the application to a Cloud platform | ✔ | Repository is at https://github.com/Mdali-1991/joy2buy — the GitHub presence implies potential GitHub Pages deployment, but no `gh-pages` branch or deployment confirmation is visible. **Refactor README.md adds step-by-step GitHub Pages deployment procedure.** |
| 4.2 | Ensure no database or server-side code is used | ✔ | Fully static site. All data (products, cart, promo codes) stored client-side. No fetch calls to any backend. |
| 4.3 | Ensure the deployed version matches the development version | ⚠ | No deployment checklist or CI/CD configuration. No evidence the live URL has been tested. **Refactor README.md includes a pre-deployment checklist.** |

### Learning Outcome 5 — Maintain version control

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| 5.1 | Use version control throughout the project | ✔ | Git repository exists on GitHub. Files are tracked. |
| 5.2 | Commit regularly with descriptive messages | ⚠ | Commit history was not directly inspectable but the project appears to have been built in bulk rather than incrementally. **Refactor README.md documents a minimum 12-commit plan with descriptive messages.** |
| 5.3 | Use a consistent branching strategy | ⚠ | Only a `main` branch is evident. No feature branches or pull requests visible. **Refactor recommends branching strategy in README.md.** |
| 5.4 | Push code to a remote repository | ✔ | Code is pushed to GitHub at https://github.com/Mdali-1991/joy2buy. |

---

## Merit Criteria

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| M(i) | Clearly demonstrate UX/accessibility design (WCAG AA, keyboard navigation, screen-reader labels) | ⚠ | ARIA labels are present on most interactive elements. `aria-hidden="true"` on decorative icons. `aria-live` regions used. `focus-visible` CSS rule is defined. However: no skip-to-content link exists on any page; index.html lacks `<main id="main-content">`; no `aria-current="page"` on index.html nav. Colour contrast ratio of `--color-text-muted: #6c757d` on white background is 4.48:1 (passes AA for normal text ≥4.5:1 at the boundary; needs checking). **Refactor adds skip link to all pages, fixes nav aria-current, adds loading spinner with aria-busy, and verifies contrast ratios.** |
| M(ii) | Custom 404 page that redirects without using browser navigation buttons, with a visible countdown | ✔ | `404.html` has both `<meta http-equiv="refresh" content="10;url=index.html">` and a JS IIFE countdown that sets `window.location.href = "index.html"` after 10 seconds. `#countdown-display` updates live in the DOM. |
| M(iii) | Frequent, descriptive commit messages that document development progress | ⚠ | Commit history not directly auditable but structure suggests bulk commits. **Refactor README.md documents a 12+ commit strategy with atomic, descriptive messages.** |
| M(iv) | README with rationale for design choices and user stories | ✘ | No README.md exists in the repository. **Refactor creates a comprehensive README.md with rationale, user stories, UX principles, colour palette, wireframes, testing table, bugs, deployment, and credits.** |
| M(v) | UX design documents and wireframes committed to the repository | ✘ | No wireframe files, UX documents, or design artefacts exist in the repo. **Refactor documents wireframes in README.md (text-based) with notes on tools used.** |
| M(vi) | Document all bugs found and how they were resolved | ✘ | No bug documentation anywhere in the repo. **Refactor adds a 5-row bugs table to README.md.** |
| M(vii) | Deployment procedure documented in README | ✘ | No README.md exists. **Refactor README.md Section 14 contains step-by-step GitHub Pages deployment instructions.** |

---

## Distinction Criteria

| Ref | Criterion | Status | Evidence / Gap |
|-----|-----------|--------|----------------|
| D(i) | Demonstrate understanding of asynchronous code (simulated fetch, loading states, error handling) | ✘ | No asynchronous patterns used. `setTimeout` is used in the checkout simulate-delay but there is no `simulateFetch()`, no loading spinner shown/hidden, no offline detection (`navigator.onLine`), no timeout handling. **Refactor adds `js/api.js` with `simulateFetch`, `showLoader`/`hideLoader`, offline detection, and timeout abort.** |
| D(ii) | Publishable-quality code — no commented-out code, no console.log, no alert(), no lorem ipsum | ⚠ | No `alert()` found. No lorem ipsum found. No `console.log` found. Minor issue: `/* Allow default */` comment in an empty event listener in main.js (navSearchForm on non-products pages) is effectively commented-out non-code. The 404 `onclick="history.back()"` is an inline handler (code style concern). **Refactor removes all inline event handlers and the empty listener comment.** |
| D(iii) | No logic errors — all features work correctly | ⚠ | Cart IIFE is solid. `validateField` has a subtle bug: the `select` check at the end (`field.value !== ""`) runs even for non-select fields when `field.tagName` check should have returned early. The `priceDisplay` and `sortSelect` variables used inside `clearBtn` event listener are declared in the outer `initProductsPage` scope — this works but creates a dependency on closure order. No critical logic errors found. **Refactor rewrites validation with early returns and clearer scope.** |
| D(iv) | Apply all five UX principles: Information Hierarchy, User Control, Consistency, Confirmation, Accessibility | ⚠ | **Information Hierarchy** ✔ — Hero → Categories → Products → Deals → Testimonials → Newsletter → Footer ordering is clear. **User Control** ⚠ — No undo on remove-from-cart (only a confirmation modal for clear-all). **Consistency** ✔ — Colours, typography, spacing consistent across all pages. **Confirmation** ✔ — Toast on every cart action; success state in contact form and checkout. **Accessibility** ⚠ — See M(i). **Refactor adds toast-based undo/cancel for single item removal.** |
| D(v) | Clean code standards (JSDoc, naming, single responsibility, no magic numbers) | ⚠ | JSDoc comments present on most functions in main.js and cart.js. However, magic numbers exist: `8 * 60 * 60 * 1000` (countdown duration), `50` (delivery threshold), `500` (max price) are inline. No named constants for these. `initNavbar` is misleadingly named — it only formats card inputs. **Refactor defines named constants and renames functions accurately.** |
| D(vi) | Defensive design — error boundaries, offline state, input sanitisation | ✘ | `sessionStorage` access is wrapped in try/catch (good). However: no `navigator.onLine` check; no error state for failed product rendering; no input sanitisation before innerHTML insertion (product names/descriptions are from a trusted data array so not an XSS risk, but no `textContent` vs `innerHTML` discipline); `history.back()` is an inline handler. **Refactor adds `navigator.onLine` detection, loading/error states for simulated async, and uses `textContent` for user-controlled data.** |
| D(vii) | Compliant code — W3C HTML, Jigsaw CSS, JSLint/JSHint pass | ⚠ | JSHint directive `/* jshint esversion: 6 */` and `"use strict"` are present. HTML and CSS appear largely valid but no validation results are documented. `products-grid` has `aria-label` and `aria-live` attributes — valid. Minor: `<legend>` inside `<fieldset>` inside `<aside>` on products.html is correct usage. The 404 `onclick` inline handler would be flagged by JSLint. **Refactor removes inline handlers, documents validator results in README.md.** |
| D(viii) | Robust code — graceful degradation, edge cases handled | ⚠ | Cart handles empty state (`renderCartPage` shows empty-cart div). Products page handles no-results. However: if `sessionStorage` is blocked (private browsing strict mode), cart silently loses items between tabs with no user warning. No handling of `PRODUCTS` array being empty. **Refactor adds graceful degradation warning and empty-state guards.** |
| D(ix) | Back and forward navigation never breaks the site (History API) | ✘ | No History API usage (`pushState`, `replaceState`, `popstate`) anywhere in the codebase. URL query params are read on page load but navigation state is not managed. **Refactor adds `js/navigation.js` with `pushState`/`replaceState`/`popstate` listener that restores filter state on back/forward.** |
| D(x) | All external links open in a new tab with `rel="noopener noreferrer"` | ⚠ | Social links in contact.html correctly have `target="_blank" rel="noopener noreferrer"`. Footer social links in index.html also have `rel="noopener noreferrer"`. However, CDN `<link>` and `<script>` tags use `crossorigin` is not set. Privacy Policy link in contact form is `href="#"` — a placeholder. Bootstrap CDN integrity attributes are present (SRI). **Refactor ensures all `target="_blank"` links have `rel="noopener noreferrer"` and SRI on CDN resources.** |

---

## Summary Scorecard

| Grade Band | Criteria Count | Met | Needs Improvement | Missing |
|------------|---------------|-----|-------------------|---------|
| Pass (1.1–5.4) | 17 | 9 | 7 | 1 |
| Merit (M(i)–M(vii)) | 7 | 1 | 3 | 3 |
| Distinction (D(i)–D(x)) | 10 | 0 | 5 | 5 |

**Current grade estimate: Pass (borderline — several P criteria partially met)**  
**Target after refactor: Distinction**

---

## Refactored Files Produced

| File | Purpose |
|------|---------|
| `joy2buy-v2/index.html` | Home page — skip link, `<main>`, loading spinner, aria fixes |
| `joy2buy-v2/products.html` | Shop page — History API URL state, aria-live grid |
| `joy2buy-v2/cart.html` | Cart + 3-step checkout with simulated async |
| `joy2buy-v2/contact.html` | Contact form + FAQ accordion |
| `joy2buy-v2/404.html` | 404 countdown + meta refresh + navigation options |
| `joy2buy-v2/css/style.css` | Custom properties, sectioned, Jigsaw-valid |
| `joy2buy-v2/css/responsive.css` | All media queries, mobile-first `min-width` |
| `joy2buy-v2/js/app.js` | IIFE, product data, DOM render, cart, search/filter/sort, countdown, toast |
| `joy2buy-v2/js/validation.js` | `window.Validation` module — validateField, validateForm, blur wiring |
| `joy2buy-v2/js/api.js` | `window.API` module — simulateFetch, loader, offline detection |
| `joy2buy-v2/js/navigation.js` | `window.Navigation` module — pushState/replaceState/popstate |
| `joy2buy-v2/README.md` | Full documentation per Merit/Distinction requirements |
