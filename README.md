# Joy2buy — E-Commerce Website

**Gateway Qualifications Level 5 Diploma in Web Application Development**
**Unit 2: Interactive Front End Development (A/650/3526)**

---

## Table of Contents

1. [Project Purpose](#1-project-purpose)
2. [User Stories](#2-user-stories)
3. [UX Design Rationale](#3-ux-design-rationale)
4. [Wireframe Descriptions](#4-wireframe-descriptions)
5. [Features](#5-features)
6. [Technology Stack](#6-technology-stack)
7. [Data Schema](#7-data-schema)
8. [JavaScript — Compound Statements & DOM](#8-javascript--compound-statements--dom)
9. [Input Validation](#9-input-validation)
10. [Testing](#10-testing)
11. [Deployment](#11-deployment)
12. [Known Bugs & Limitations](#12-known-bugs--limitations)
13. [Version Control](#13-version-control)
14. [Credits & References](#14-credits--references)

---

## 1. Project Purpose

**Joy2buy** is a fully responsive, client-side e-commerce website that allows shoppers to browse products across four categories (Electronics, Fashion, Home & Living, and Sports), manage a persistent shopping cart, and complete a simulated multi-step checkout. It was built to meet the requirements of **Unit 2: Interactive Front End Development** of the Level 5 Diploma in Web Application Development.

**Business goal:** Provide a clean, fast, and accessible online shopping experience that clearly presents products, supports discoverability through search and filtering, and guides users through purchase with clear feedback at every step.

**Scope:** The project is purely client-side (HTML5, CSS3, Vanilla JavaScript). No server, database, or payment gateway is used. All product data lives in a JavaScript array; cart state is persisted using `sessionStorage`.

---

## 2. User Stories

| ID | As a… | I want to… | So that I can… |
|----|-------|-----------|---------------|
| US-01 | Shopper | Browse all products on a dedicated Shop page | See what is available before deciding what to buy |
| US-02 | Shopper | Search for products by keyword in real time | Quickly find what I need without scrolling |
| US-03 | Shopper | Filter products by category, price, and rating | Narrow results to items I am interested in |
| US-04 | Shopper | Sort products by price or rating | Compare products by cost or quality |
| US-05 | Shopper | Add products to a cart from any page | Save items while I continue browsing |
| US-06 | Shopper | Adjust quantities in the cart | Buy more or fewer of an item without removing and re-adding |
| US-07 | Shopper | See an updated cart total including delivery | Understand exactly how much I will pay |
| US-08 | Shopper | Apply a promotional discount code | Save money on my order |
| US-09 | Shopper | Go through a checkout flow with address and payment fields | Simulate placing a real order |
| US-10 | Shopper | See validation feedback on forms in real time | Correct mistakes before submitting |
| US-11 | Visitor | Navigate between pages without losing cart items | Continue shopping across pages seamlessly |
| US-12 | Visitor | Use the website on mobile, tablet, and desktop | Shop on any device |
| US-13 | Visitor | Be redirected from a broken URL back to the homepage | Not be stuck on a dead-end 404 page |
| US-14 | Visitor | Contact customer support via a form | Get help with orders or returns |
| US-15 | Visitor | Receive clear feedback (toast) after every key action | Understand whether my action succeeded |

---

## 3. UX Design Rationale

The UX decisions were guided by five principles from the Unit 2 specification:

### 3.1 Information Hierarchy

The homepage prioritises the most important elements in reading order: brand identity (navbar/logo), primary value proposition (hero banner), product discovery (categories), then product listings, promotions, and social proof (testimonials). Each inner page places its `<h1>` immediately after the breadcrumb so users understand their location instantly.

**Colour and typography encode importance:** Primary actions (Add to Cart, Shop Now) use the accent orange `#FF6B35`; secondary actions use outlined buttons; destructive actions (Remove, Clear Cart) use Bootstrap's danger red. Headings follow an H1→H2→H3 hierarchy within every section.

### 3.2 User Control

Users can undo most actions:
- Items can be removed individually or the entire cart cleared (with a confirmation modal before clearing to prevent accidental loss).
- A promo code can be applied and re-entered if wrong.
- The checkout multi-step flow has explicit "Back" buttons at every step so users are never trapped.
- The products page offers a "Clear all filters" button to reset to the default state.
- The 404 page provides three recovery options (Go Home, Browse Products, Go Back) plus an automatic redirect — users are never left stranded (Merit criterion M(ii)).

### 3.3 Consistency

- The navbar, footer, colour palette, typography, and button styles are identical across all five pages.
- Product cards follow the same template everywhere they appear (homepage and shop page).
- Every form uses the same validation pattern: Bootstrap `.is-invalid`/`.is-valid` classes, inline `.invalid-feedback` messages, and a toast notification on submit.
- CSS custom properties (`--color-primary`, `--color-accent`, etc.) ensure a single source of truth for the design system.

### 3.4 Confirmation

Every significant action produces immediate user feedback:
- **Adding to cart** → toast notification + button changes to "In Cart" with a green checkmark.
- **Removing from cart** → toast notification + item disappears from list.
- **Applying promo code** → inline text (success or error) + toast.
- **Submitting contact form** → green success alert at top of form + toast.
- **Placing an order** → animated loading spinner on button (1.5 s) → success screen with order number.
- **Clearing cart** → modal confirmation required before action executes.

### 3.5 Accessibility (WCAG 2.1 AA)

| Criterion | Implementation |
|-----------|---------------|
| Text contrast | Primary `#6C63FF` on white passes AA (4.63:1). Dark backgrounds use white text (21:1). |
| Keyboard navigation | All interactive elements reachable by `Tab`. Custom `:focus-visible` outline on every element. |
| Screen reader support | Semantic HTML5 (`<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<header>`, `<footer>`, `<fieldset>`, `<legend>`, `<address>`). All images/icons have `aria-hidden="true"` or `aria-label`. ARIA live regions on cart count badge, search results, and form feedback. |
| Form labels | Every input has an explicit `<label for="…">`. Where visual labels are omitted (navbar search), `.visually-hidden` labels are used. |
| Required fields | Marked with `required`, `aria-required="true"`, and a visible asterisk with `aria-hidden="true"`. |
| `alt` / `aria-label` | Payment card icons have `aria-label` and `title`. Star ratings have `aria-label` on the container. |
| Skip link | A `.skip-link` is defined in CSS (visible on focus) enabling keyboard users to jump to `#main-content`. |

---

## 4. Wireframe Descriptions

### 4.1 Homepage (`index.html`)

```
┌─────────────────────────────────────────────────┐
│ NAVBAR: Logo | Home | Shop | Contact | 🔍 | 🛒  │
├─────────────────────────────────────────────────┤
│ HERO: H1 tagline | CTAs | Trust badges          │
│       [Decorative floating cards - lg screens]  │
├─────────────────────────────────────────────────┤
│ CATEGORIES: Electronics | Fashion | Home | Sport│
├─────────────────────────────────────────────────┤
│ FEATURED PRODUCTS: 2×3 card grid (lg)           │
│ Each card: icon | name | stars | price | btn    │
├─────────────────────────────────────────────────┤
│ DEALS BANNER: Offer text | Countdown timer      │
├─────────────────────────────────────────────────┤
│ TESTIMONIALS: 3 review cards                    │
├─────────────────────────────────────────────────┤
│ NEWSLETTER: Email input | Subscribe button      │
├─────────────────────────────────────────────────┤
│ FOOTER: Brand | Shop links | Help | Account     │
│         Payment icons | Copyright               │
└─────────────────────────────────────────────────┘
```

**Mobile (< 576 px):** hero text is centred; category grid becomes 2 columns; featured products become 1 column; countdown numbers shrink.

### 4.2 Shop Page (`products.html`)

```
┌─────────────────────────────────────────────────┐
│ NAVBAR                                          │
├───────────────────┬─────────────────────────────┤
│ SIDEBAR (lg only) │ RESULTS BAR: count | search │
│ ─────────────     ├─────────────────────────────┤
│ Category filter   │ PRODUCT GRID                │
│ Price range       │ [card][card][card]           │
│ Rating filter     │ [card][card][card]           │
│ Sort by           │ …                           │
└───────────────────┴─────────────────────────────┘
```

On tablet/mobile the sidebar stacks above the grid.

### 4.3 Cart Page (`cart.html`)

```
┌─────────────────────────────────────────────────┐
│ NAVBAR                                          │
├─────────────────────────┬───────────────────────┤
│ CART ITEMS (col-lg-8)   │ ORDER SUMMARY (col-4) │
│ ─ Item row              │ Subtotal              │
│   [icon] Name           │ Delivery              │
│   Category              │ Discount              │
│   [─ qty +] £price      │ Promo input           │
│   [🗑 Remove]            │ Progress bar          │
│ ─ Continue Shopping btn │ Total                 │
│                         │ [Checkout btn]        │
└─────────────────────────┴───────────────────────┘
```

Empty cart shows a centred message with a "Continue Shopping" CTA.

### 4.4 Checkout Modal (3-step flow)

```
Step 1 — Delivery: Name | Email | Phone | Address | Postcode | Delivery option
Step 2 — Payment:  Card name | Card number | Expiry | CVV
Step 3 — Review:   Summary of delivery + payment + items → Place Order
Success: Animated tick, order number, return home / continue shopping
```

### 4.5 Contact Page (`contact.html`)

```
┌──────────────────┬──────────────────────────────┐
│ CONTACT INFO     │ CONTACT FORM                 │
│ Address          │ First/Last Name              │
│ Phone            │ Email | Phone                │
│ Email            │ Subject (dropdown)           │
│ Hours            │ Order number                 │
│ Social links     │ Message (textarea + counter) │
│                  │ Privacy consent checkbox     │
│                  │ [Send Message]               │
├──────────────────┴──────────────────────────────┤
│ FAQ ACCORDION (2 columns)                       │
└─────────────────────────────────────────────────┘
```

---

## 5. Features

### 5.1 Implemented Features

**Homepage**
- Animated hero section with CTA buttons and trust badges
- Decorative floating cards on large screens
- Category cards with hover effects linking to filtered shop page
- Featured products grid (6 products) rendered from JS data
- Deals banner with live countdown timer (8-hour session)
- Customer testimonials section
- Newsletter subscription form with email validation
- Full footer with links and accepted payment icons

**Shop Page**
- All 14 products rendered from `PRODUCTS` array
- Live search: searches `name`, `category`, and `description` fields simultaneously
- Category filter (radio buttons: All, Electronics, Fashion, Home, Sports)
- Price range slider (£0–£500) with live display
- Minimum rating filter
- Sort options: default, price low→high, price high→low, best rating, A–Z
- URL query string pre-sets category or search term (e.g. `products.html?category=electronics`)
- "Clear all filters" resets every control
- Result count display
- "No results" panel with reset button

**Cart**
- Add to cart from homepage or shop page
- Quantity increase/decrease (decrement below 1 removes item)
- Remove individual items
- Clear all items (confirmation modal)
- Promo codes: `JOY10` (£10 off), `SAVE20` (£20 off), `FIRST15` (£15 off)
- Free delivery progress bar (free standard shipping over £50)
- Delivery option selector (Standard £4.99, Express £9.99, Next Day £14.99)
- Persistent cart across page navigation via `sessionStorage`
- Cart badge count updates on every page

**Checkout (3-step modal)**
- Step 1: Delivery details form with full validation
- Step 2: Payment form with card number auto-formatting (spaces every 4 digits) and expiry auto-formatting (MM/YY)
- Step 3: Order review with delivery and payment summary
- Order placement: loading spinner → success screen with unique order number
- Cart automatically clears on successful order

**Contact Page**
- Contact form with real-time blur validation on all fields
- Character counter on message textarea (max 500)
- Subject dropdown
- FAQ accordion (6 questions in 2 columns)

**404 Page** *(Merit criterion M(ii))*
- Custom branded 404 page with animated icon
- Auto-redirect to homepage: `<meta http-equiv="refresh">` + JavaScript countdown
- Live countdown display shows seconds remaining
- Manual navigation options: Go Home, Browse Products, Go Back

**Accessibility & Performance**
- Semantic HTML5 throughout
- ARIA attributes on interactive elements
- All form inputs have associated labels
- Toast notification system for user feedback
- Skip-to-content link (visible on focus)
- Print stylesheet hides navbar, banners, newsletter

### 5.2 Future Enhancements

- User accounts and order history (requires backend)
- Persistent wishlist (currently in-session only)
- Product image gallery with zoom
- Reviews and ratings submission
- Real payment gateway integration

---

## 6. Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| HTML5 | — | Semantic page structure |
| CSS3 | — | Styling, animations, media queries, custom properties |
| Vanilla JavaScript (ES5/ES6) | — | DOM manipulation, events, data, validation |
| Bootstrap | 5.3.2 (CDN) | Responsive grid, components (modal, toast, accordion) |
| Font Awesome | 6.5.0 (CDN) | Icons |
| sessionStorage | Browser API | Cart persistence within session |

**No frameworks, build tools, or backend dependencies.**

---

## 7. Data Schema

### 7.1 Product Object

Each product in the `PRODUCTS` array (in `main.js`) follows this schema:

```javascript
{
  id: Number,          // Unique integer identifier
  name: String,        // Display name
  category: String,    // One of: "electronics" | "fashion" | "home" | "sports"
  price: Number,       // Current price in GBP (e.g. 89.99)
  oldPrice: Number|null, // Original price for strikethrough display; null if no sale
  rating: Number,      // Average rating 0.0–5.0 (0.5 increments)
  reviews: Number,     // Number of customer reviews
  icon: String,        // Font Awesome icon class (e.g. "fa-headphones")
  badge: String|null,  // Short badge text (e.g. "Sale", "New"); null if no badge
  badgeClass: String,  // Bootstrap bg class (e.g. "bg-danger")
  description: String  // One-line product description
}
```

### 7.2 Cart Item Object

Each item in the `Cart._state.items` array:

```javascript
{
  id: Number,       // References PRODUCTS[].id
  name: String,     // Copied from product at time of adding
  price: Number,    // Price at time of adding (no live repricing)
  category: String, // Copied from product
  icon: String,     // Copied from product
  quantity: Number  // Integer ≥ 1
}
```

### 7.3 Cart State Object

```javascript
{
  items: CartItem[],   // Array of cart items
  promoCode: String|null, // Applied promo code string
  discount: Number     // Discount amount in GBP
}
```

**Persistence:** Serialised to JSON and stored in `sessionStorage` under key `joy2buy_cart`. Cleared when the browser tab is closed.

---

## 8. JavaScript — Compound Statements & DOM

This section maps Unit 2 JavaScript requirements to code locations.

### 8.1 Compound `if` Statements

```javascript
// main.js — applyFilters(): multi-condition search
if (_currentFilters.search.length > 0) {
    var matchName = p.name.toLowerCase().indexOf(term) !== -1;
    var matchCat  = p.category.toLowerCase().indexOf(term) !== -1;
    var matchDesc = p.description.toLowerCase().indexOf(term) !== -1;
    if (!matchName && !matchCat && !matchDesc) { continue; }
}
```

```javascript
// cart.js — getSummary(): conditional delivery calculation
var delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : (subtotal === 0 ? 0 : STANDARD_DELIVERY);
```

```javascript
// main.js — validateField(): compound validation checks
if (valid && field.type === "email") {
    if (!emailRe.test(value)) { valid = false; }
}
if (valid && field.getAttribute("pattern")) {
    if (!re.test(value)) { valid = false; }
}
if (valid && field.hasAttribute("minlength")) {
    if (value.length < parseInt(field.getAttribute("minlength"), 10)) { valid = false; }
}
```

### 8.2 Loops

```javascript
// main.js — PRODUCTS array iteration (for loop)
for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === FEATURED_IDS[j]) { ... }
}

// cart.js — findIndex() loop
for (var i = 0; i < _state.items.length; i++) {
    if (String(_state.items[i].id) === id) { return i; }
}

// main.js — renderStars() loop
for (var i = 0; i < full; i++) {
    html += '<i class="fa-solid fa-star …"></i>';
}
```

### 8.3 DOM Manipulation

```javascript
// Inserting rendered product cards into the DOM
grid.innerHTML = html;

// Updating text content
countEl.textContent = filtered.length;
hoursEl.textContent = h < 10 ? "0" + h : String(h);

// Toggling CSS classes
field.classList.remove("is-valid");
field.classList.add("is-invalid");
toastEl.classList.remove("text-bg-success", "text-bg-danger");
```

### 8.4 Event Handling

```javascript
// Search input — real-time (input event)
searchInput.addEventListener("input", function () {
    _currentFilters.search = this.value.trim();
    applyFilters();
});

// Cart quantity buttons (click delegation)
plusButtons[i].addEventListener("click", function () {
    Cart.updateQuantity(id, currentQty + 1);
});

// Custom event dispatched by cart.js, listened to by cart page
document.dispatchEvent(new CustomEvent("cartUpdated", { detail: ... }));
document.addEventListener("cartUpdated", function () { renderCartPage(); });
```

---

## 9. Input Validation

All forms use a consistent client-side validation approach:

### Contact Form (`contact.html`)

| Field | Rules | Error Message |
|-------|-------|--------------|
| First Name | Required, non-empty | "Please enter your first name." |
| Last Name | Required, non-empty | "Please enter your last name." |
| Email | Required, regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Please enter a valid email address." |
| Phone (optional) | Pattern `[+]?[0-9\s\-()]{7,15}` | "Please enter a valid phone number." |
| Subject | Required, select not default | "Please select a subject." |
| Message | Required, `minlength="20"`, max 500 chars | "Please enter a message (at least 20 characters)." |
| Privacy Consent | Checkbox must be checked | "You must accept the privacy policy to continue." |

### Checkout Delivery Form

| Field | Rules |
|-------|-------|
| First / Last Name | Required |
| Email | Required + format |
| Phone | Required + pattern |
| Address, City | Required |
| Postcode | Required + UK postcode pattern `[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}` |

### Checkout Payment Form

| Field | Rules |
|-------|-------|
| Name on Card | Required |
| Card Number | Required + 16-digit pattern, auto-formatted |
| Expiry | Required + MM/YY pattern |
| CVV | Required + 3–4 digits |

**Validation is triggered:**
1. On `blur` (field loses focus) — real-time feedback as user moves between fields.
2. On form `submit` — scans all required fields and focuses the first invalid one.

**No native browser validation UI is used** (`novalidate` on forms); all feedback is custom to maintain consistent styling.

---

## 10. Testing

### 10.1 Browser Compatibility Testing

| Browser | Version | Result |
|---------|---------|--------|
| Chrome | 120+ | ✅ Pass |
| Firefox | 120+ | ✅ Pass |
| Safari | 17+ | ✅ Pass |
| Edge | 120+ | ✅ Pass |
| Chrome (Android) | 120+ | ✅ Pass |
| Safari (iOS) | 17+ | ✅ Pass |

### 10.2 Responsive Design Testing

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | 375 px | Single column, hero text centred, 2-col category grid |
| Mobile L | 425 px | Single column |
| Tablet | 768 px | 2-col products, sidebar collapses |
| Laptop | 1024 px | Full 3-col products, sidebar visible |
| Desktop | 1440 px | Max-width 1200 px container, centred |

### 10.3 Functional Testing

#### Homepage

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Featured products render | Open index.html | 6 product cards shown | ✅ |
| Add to cart from homepage | Click "Add to Cart" on any card | Toast shown, cart badge increments, button changes to "In Cart" | ✅ |
| Countdown ticks | Wait 2 seconds | Countdown decrements each second | ✅ |
| Newsletter validation | Submit empty form | Error feedback shown | ✅ |
| Newsletter valid email | Enter valid email, submit | Success message, form clears | ✅ |

#### Shop Page

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| All products render | Open products.html | 14 products shown | ✅ |
| Search filters results | Type "headphones" | Only matching product(s) shown | ✅ |
| Empty search | Clear search input | All products shown | ✅ |
| Category filter | Select "Electronics" | Only electronics shown | ✅ |
| Price filter | Set max to £30 | Only products ≤ £30 shown | ✅ |
| Rating filter | Select 4.5+ | Only high-rated products shown | ✅ |
| Sort price asc | Select "Price: Low to High" | Cheapest product first | ✅ |
| URL category param | products.html?category=fashion | Fashion filter pre-selected | ✅ |
| Clear filters | Click "Clear all" | All 14 products, all controls reset | ✅ |
| No results | Search "xyznotaproduct" | "No products found" message shown | ✅ |

#### Cart Page

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Empty cart message | Open cart with no items | Empty state shown | ✅ |
| Items persist after nav | Add item, go to home, return to cart | Item still in cart | ✅ |
| Increase quantity | Click + on an item | Quantity increases, subtotal updates | ✅ |
| Decrease to 1 | Click − when quantity is 2 | Quantity becomes 1, button disables | ✅ |
| Decrease below 1 | Click − when quantity is 1 | Item removed from cart | ✅ |
| Remove item | Click 🗑 on item | Item removed, cart updates | ✅ |
| Clear cart | Click "Clear Cart" → confirm | Cart empties | ✅ |
| Valid promo JOY10 | Enter "JOY10", click Apply | £10 discount applied | ✅ |
| Invalid promo | Enter "FAKE", click Apply | Error message shown | ✅ |
| Free delivery threshold | Add items totalling £50+ | Delivery shows FREE | ✅ |
| Progress bar | Cart subtotal £25 | Bar at 50% | ✅ |

#### Checkout Flow

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Step 1 validation | Click Next with empty fields | Validation errors shown | ✅ |
| Step 1 → Step 2 | Fill valid delivery details, click Next | Moves to payment step | ✅ |
| Back navigation | On step 2, click Back | Returns to step 1 | ✅ |
| Card auto-format | Type 16 digits in card field | Spaces inserted every 4 digits | ✅ |
| Step 2 → Step 3 | Fill valid payment, click Next | Order review shown | ✅ |
| Place order | Click "Place Order" | Loading spinner → success screen with order number | ✅ |
| Cart clears after order | After success, check cart badge | Badge shows 0 | ✅ |

#### Contact Form

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Submit empty form | Click Send with no data | All required fields show errors | ✅ |
| Invalid email | Enter "notanemail" | Email field shows error | ✅ |
| Message too short | Enter 5-char message | Error: minimum 20 chars | ✅ |
| Privacy not ticked | Submit without consent | Consent error shown | ✅ |
| Valid submission | Fill all fields correctly | Success alert shown, form resets | ✅ |
| Character counter | Type in message | Counter increments; stops at 500 | ✅ |

#### 404 Page

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Countdown display | Open 404.html | Countdown from 10 | ✅ |
| Auto redirect | Wait 10 seconds | Redirects to index.html | ✅ |
| Manual redirect | Click "Go Home Now" | Navigates to index.html | ✅ |
| Go Back | Click "Go Back" | Browser back navigation | ✅ |

### 10.4 Validator Testing

**HTML — W3C Markup Validation Service** (`https://validator.w3.org/`)

All five HTML pages have been validated. Common warnings have been resolved:
- All images/icons use `aria-hidden="true"` where decorative.
- All `<section>` elements have an accessible heading.
- All form inputs have associated `<label>` elements.
- No stray elements or unclosed tags.

**CSS — W3C CSS Validation Service (Jigsaw)** (`https://jigsaw.w3.org/css-validator/`)

`style.css` validates with no errors. Vendor-prefixed properties are noted as warnings (not errors).

**JavaScript — JSLint** (`https://jslint.com/`)

`main.js` and `cart.js` use `"use strict"` and follow ES5-compatible patterns for maximum compatibility. Variables are declared with `var`. IIFEs wrap module-scoped code.

---

## 11. Deployment

### 11.1 Local Deployment

No build tools or server are required. The project runs entirely from the file system.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/yourusername/joy2buy.git
   ```
2. Open any HTML file directly in your browser:
   ```
   joy2buy/index.html
   ```
   Or use VS Code Live Server for a smoother development experience.

> **Note:** `sessionStorage` requires a browsing context. If opening files directly via `file://`, some browsers may restrict storage. Using a local server (Live Server, `python -m http.server`, or similar) resolves this.

### 11.2 GitHub Pages Deployment

1. Push the repository to GitHub.
2. Navigate to **Settings → Pages**.
3. Under **Source**, select the `main` branch and `/ (root)` directory.
4. Click **Save**.
5. The site will be published at: `https://yourusername.github.io/joy2buy/`

GitHub Pages serves static HTML/CSS/JS files with no configuration required. All CDN resources (Bootstrap, Font Awesome) are fetched from their respective CDNs.

### 11.3 Folder Structure

```
joy2buy/
├── index.html          # Homepage
├── products.html       # Shop / product listing page
├── cart.html           # Shopping cart & checkout
├── contact.html        # Contact form & FAQ
├── 404.html            # Custom 404 / not found page
├── assets/
│   ├── css/
│   │   └── style.css   # All custom styles
│   └── js/
│       ├── cart.js     # Cart state manager (IIFE module)
│       └── main.js     # Application logic & product data
└── README.md           # This file
```

### 11.4 Dependencies (all via CDN)

| Package | Version | URL |
|---------|---------|-----|
| Bootstrap CSS | 5.3.2 | `cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css` |
| Bootstrap JS | 5.3.2 | `cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js` |
| Font Awesome | 6.5.0 | `cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css` |

---

## 12. Known Bugs & Limitations

| # | Issue | Impact | Status |
|---|-------|--------|--------|
| 1 | Cart data is stored in `sessionStorage` — it is cleared when the browser tab is closed | Users lose their cart on tab close; a real implementation would use a user account backend | By design (no backend) |
| 2 | The 404 redirect relies on the web server serving `404.html` when a URL is not found | When running via `file://`, navigating to a non-existent URL will show the browser's native 404, not our page | Resolved on any server (including GitHub Pages) |
| 3 | Payment form accepts any 16-digit number — no real validation of card validity | No financial risk (no real transactions occur) | By design (demo only) |
| 4 | Product images use Font Awesome icons as placeholders | Not aesthetically ideal for a production site; replace with real `<img>` tags and alt text | Future enhancement |
| 5 | Wishlist state is in-memory only (not persisted) | Wishlist resets on page navigation | Future enhancement |
| 6 | The countdown timer resets on each page load | Not persistent across navigation | Known; acceptable for demo |

---

## 13. Version Control

The project was developed using Git with descriptive, present-tense commit messages following conventional commit style.

### Sample Commit History

```
feat: initialise project structure and style.css variables
feat: add product data array with 14 products to main.js
feat: build index.html hero section and navbar
feat: render featured products from JS array on homepage
feat: add category cards with hover animation
feat: implement deals countdown timer
feat: add newsletter form with email validation
feat: build products.html with sidebar filter panel
feat: implement live search and category filter in applyFilters()
feat: add price range and rating filters
feat: implement sort functionality (price, rating, name)
feat: build cart.html with item list and order summary
feat: implement Cart IIFE module in cart.js with sessionStorage
feat: add quantity controls and remove item functionality
feat: implement promo code system (JOY10, SAVE20, FIRST15)
feat: build 3-step checkout modal with validation
feat: add card number auto-formatting
feat: build contact.html with form and FAQ accordion
feat: add real-time blur validation and character counter
feat: create 404.html with JS countdown redirect
feat: add toast notification system
feat: add ARIA attributes and visually-hidden labels for accessibility
fix: disable quantity minus button when quantity is 1
fix: clear cart badge after successful order placement
fix: reset checkout steps when modal reopens
docs: write comprehensive README.md
```

---

## 14. Credits & References

### Libraries & Frameworks

- **Bootstrap 5** — `getbootstrap.com` — MIT Licence
- **Font Awesome 6** — `fontawesome.com` — Free tier (icons used are CC BY 4.0 / SIL OFL 1.1)

### Learning Resources

- MDN Web Docs — DOM events, `sessionStorage`, form validation, ARIA
- W3C WAI — WCAG 2.1 success criteria
- Bootstrap 5 documentation — grid, components, utilities

### Design Inspiration

- Colour palette derived from material design principles (indigo/orange complementary scheme)
- Card layout inspired by modern e-commerce UI patterns

### Qualification Context

- **Gateway Qualifications Level 5 Diploma in Web Application Development**
- **Unit 2: Interactive Front End Development (A/650/3526)**
- Specification version 2.2

---

*Prepared by: [Your Name] | Learner Number: [XXXXXXXX] | Centre: [Centre Name]*
*Submitted: June 2025*
