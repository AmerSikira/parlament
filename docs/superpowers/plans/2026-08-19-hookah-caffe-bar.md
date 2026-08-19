# Hookah Caffe Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive static hookah caffe bar website matching the supplied dark editorial reference.

**Architecture:** A single static HTML document provides semantic sections and form controls. CSS owns all layout, responsive behavior, typography, animation, and visual treatment. Vanilla JavaScript owns menu state, smooth scrolling, form feedback, scroll reveal, active nav state, and back-to-top behavior.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in modules for smoke testing.

**Spec:** `docs/superpowers/specs/2026-08-19-hookah-caffe-bar-design.md`

## Global Constraints

- HTML5, CSS3, and vanilla JavaScript only.
- No frameworks or runtime dependencies.
- Use CSS Grid and Flexbox.
- Responsive for desktop, tablet, and mobile.
- Keep files semantic and easy to inspect.
- Use local image assets derived from the supplied reference image so the site runs offline.

---

### Task 1: Smoke Test And Asset Preparation

**Files:**
- Create: `tests/smoke.test.js`
- Create: `assets/hero.jpg`
- Create: `assets/lounge.jpg`
- Create: `assets/atmosphere.jpg`
- Create: `assets/recommend.jpg`
- Create: `assets/promo-left.jpg`
- Create: `assets/map.jpg`
- Create: `assets/promo-right.jpg`

**Interfaces:**
- Consumes: reference image at `d:/Downloads/3972f3c7a53000559a8ea89b8c00604e.jpg`.
- Produces: local JPEG assets referenced by `index.html` and `styles.css`; test command `node tests/smoke.test.js`.

- [x] **Step 1: Write the failing smoke test**

Create `tests/smoke.test.js` with checks for the final DOM contract, local image references, and JavaScript interaction hooks.

- [x] **Step 2: Run the test to verify it fails**

Run: `node tests/smoke.test.js`
Expected: FAIL because `index.html` does not exist yet.

- [x] **Step 3: Create local image crops**

Crop the supplied reference screenshot into local assets named in the files list.

- [x] **Step 4: Re-run the test**

Run: `node tests/smoke.test.js`
Expected: FAIL until the HTML, CSS, and JavaScript are implemented.

### Task 2: Static Site Implementation

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Modify: `tests/smoke.test.js` only if test setup has an environment error unrelated to product behavior.

**Interfaces:**
- Consumes: local JPEG assets from Task 1.
- Produces: a browser-openable static site at `index.html`.

- [x] **Step 1: Implement semantic HTML**

Create sections for navigation, hero, reservations, hours, atmosphere, recommendations, promos, and footer. Use accessible labels and local image paths.

- [x] **Step 2: Implement responsive CSS**

Create the dark editorial layout with Grid and Flexbox, thin borders, serif hierarchy, hover states, mobile navigation, and responsive section stacking.

- [x] **Step 3: Implement JavaScript interactions**

Implement mobile menu toggling, smooth anchor scrolling, booking feedback, reveal animation, active nav updates, and back-to-top behavior.

- [x] **Step 4: Run the smoke test**

Run: `node tests/smoke.test.js`
Expected: PASS.

### Task 3: Final Verification

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `assets/*`

**Interfaces:**
- Consumes: finished static site.
- Produces: verified deliverable and final user instructions.

- [x] **Step 1: Inspect generated file list**

Run: `Get-ChildItem -Recurse`
Expected: site files, docs, tests, and assets are present.

- [x] **Step 2: Re-run smoke test**

Run: `node tests/smoke.test.js`
Expected: PASS with no warnings.

- [x] **Step 3: Confirm browser launch path**

Report that the user can open `index.html` directly; no dev server is required.
