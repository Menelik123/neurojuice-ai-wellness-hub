

## Plan: Add Home Navigation & Fix Footer Quick Links

### Problem
1. **No Home button** on sub-pages like `/fuel`, `/dr-vital`, `/menu`, `/vitalpass`, `/juice/:slug`, `/bundle/:slug` — users can't easily get back to the homepage.
2. **Footer quick links** (`#menu`, `#bundles`, `#delivery`, `#faq`) use anchor hrefs that only work on the homepage. On other pages like `/fuel`, they do nothing.

### Changes

#### 1. Add Home Button to Fuel Page Hero
Add a "Home" link/button at the top of `FuelHero.tsx` (above the headline) using a simple `Link to="/"` with an arrow-left icon. Keeps it minimal and clean.

#### 2. Add Home Navigation to Pages Without It
Pages that already use `Header` (DrVital, Menu, VitalPass, etc.) have a nav with a logo that links home — these are fine. The **Fuel page** and **BundleDetail page** are the ones missing a clear home link:
- **Fuel**: Add a small top bar or home link in `FuelHero`
- **BundleDetail**: Already has a "Back to Bundles" button — will update to go Home or add a Home link alongside it

#### 3. Fix ComplianceFooter Quick Links
The `ComplianceFooter` (used on `/fuel`) has anchor links like `#menu` and `#bundles` that only work on the homepage. Fix by converting these to proper route links:
- `#menu` → `Link to="/#menu"` or `Link to="/"` with scroll
- `#bundles` → `Link to="/#bundles"`
- `#delivery` → `Link to="/#delivery"`
- `#faq` → `Link to="/#faq"`

Since hash-based navigation from another page requires navigating to `/` first, these will be changed to `Link to="/"` with appropriate hash, or simply link to `/` for cross-page use.

#### 4. Fix LandingFooter Quick Links (same issue)
The `LandingFooter` used on `BundleDetail` and `JuiceDetail` pages doesn't have quick links, but verify it works correctly on those pages.

### Files to Edit
- `src/components/fuel/FuelHero.tsx` — Add Home link
- `src/components/landing/ComplianceFooter.tsx` — Fix quick links to use `Link to="/..."` with hash navigation
- `src/pages/BundleDetail.tsx` — Add Home link alongside "Back to Bundles"

