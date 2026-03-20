# Ziipstick Landing Page — Agent Instructions

## Mission
Recreate the Ziipstick landing page as a **pixel-perfect 1:1 copy** of the provided Figma section screenshots. Every agent working on this project MUST treat the screenshot PNGs as the **single source of truth**. No guessing, no "close enough."

## Deployment Standards (MANDATORY)

This project blocks all bots and crawlers on every page. These must be present at all times — do NOT remove them:

- **`robots.txt`** at project root:
  ```
  User-agent: *
  Disallow: /
  ```
- **`X-Robots-Tag`** header in `vercel.json` applied to `source: "/(.*)"`:
  ```
  noindex, nofollow, nosnippet, noarchive
  ```

If adding new routes or pages, verify both still apply to all paths.

---

## Critical Rules — READ BEFORE WRITING ANY CODE

### 0. EVERY Outbound Link Gets UTM Parameters
- **Any time you add or change an `<a href="https://...">` link, it MUST be covered by the UTM forwarder JS.**
- The JS selector `a[href^="http"]` already handles this automatically for links present at page load.
- If you add links dynamically via JS after page load, you MUST manually append `getSavedParams()` to the href.
- This applies to: logo links, product links, footer links, CTA links — ANY link pointing to an external URL.
- **No exceptions. No "I'll do it later." Check every outbound link.**

### 1. Pixel-Perfect Means Pixel-Perfect
- Match EXACT font sizes, weights, line-heights, letter-spacing from the screenshots
- Match EXACT spacing (padding, margin, gap) — measure relative to surrounding elements
- Match EXACT colors — use an eyedropper approach on the screenshot, not assumptions
- Match EXACT border-radius values — square corners vs rounded vs pill shapes matter
- Match EXACT element ordering, alignment, and positioning
- If a screenshot shows 12px of space between two elements, do NOT write 16px

### 2. Two Breakpoints: Mobile + Desktop
- Every section has TWO screenshots: `section-N-desktop.png` and `section-N-mobile.png`
- Write mobile-first CSS (base styles = mobile)
- Single breakpoint: `@media (min-width: 768px)` for desktop
- Both versions must be 1:1 matches to their respective screenshots

### 3. Measure Everything From Screenshots
Before writing CSS for any element, determine from the screenshot:
- Font: family, size, weight, style (italic?), line-height, color, letter-spacing
- Spacing: padding (top/right/bottom/left), margin, gap
- Dimensions: width, height, min/max constraints
- Borders: width, style, color, radius
- Background: color, gradient direction/stops, image positioning
- Layout: flex vs grid, direction, alignment, wrapping, gap
- Effects: shadows, opacity, transforms

### 4. Output Format
Each agent must output a **complete code block** containing:
```
<!-- SECTION N: Section Name -->
<!-- CSS -->
<style>
/* Mobile-first base styles */
.zs-sectionname { ... }

@media (min-width: 768px) {
  /* Desktop overrides */
  .zs-sectionname { ... }
}
</style>

<!-- HTML -->
<section class="zs-sectionname">
  ...
</section>
```

### 5. Do NOT Include
- JavaScript (handled separately)
- Styles for other sections
- Generic resets or root styles (handled by Section 0)
- Comments like "adjust as needed" or "approximately" — be exact

## Technical Standards

### CSS Architecture
- All classes prefixed with `zs-` and scoped under `.zs-root`
- BEM-like naming: `.zs-section__element--modifier`
- Mobile-first: base styles are mobile, desktop uses `@media (min-width: 768px)`
- No `!important` unless absolutely necessary
- Use `px` for all sizes (not rem/em) to ensure pixel-perfect rendering
- Prefer `flex` for layout; use `grid` when the screenshot clearly shows a grid

### Fonts
- **TBD** — extract from Figma design once provided
- Google Fonts link to be added after Figma review

### Color Palette
- **TBD** — extract exact hex values from Figma/screenshots once provided

### Images
- All image paths use absolute URLs: `/images/filename.ext`
- Use `loading="lazy"` on all images below the fold
- Use descriptive `alt` text
- For placeholder images not yet provided, use: `<div class="zs-img-placeholder" style="width:Wpx;height:Hpx;background:#e8e6e3;border-radius:Rpx;"></div>`
- When an image is needed but not available, the agent MUST list it in the output as: `<!-- NEEDS IMAGE: description, approximate dimensions WxH -->`

### HTML Structure
- Single root: `<div class="zs-root">`
- Semantic elements: `<section>`, `<nav>`, `<footer>`, `<header>`, `<button>`, `<a>`
- All CTA buttons/links should use `href="#products"` as default target
- Buttons use `<button>` for actions, `<a>` for navigation/links

### Responsive Behavior
- Max content width: `1440px` (centered with `margin: 0 auto`)
- Mobile padding: `16px` horizontal
- Desktop padding: `160px` horizontal (or as shown in screenshot)
- Images: `max-width: 100%; display: block;`
- No horizontal scroll on any breakpoint

## Section Index
_To be filled in once Figma design is provided._

| # | Section Name | Description |
| --- | --- | --- |
| 0 | Hero | TBD |
| ... | ... | ... |

## Existing Assets (in /images/ directory)
_To be populated as assets are added._

## Deployment
- Repo: `github.com/teamicarusdigital/ziipstick` _(to be created)_
- Deploy: `vercel --prod --yes` from `C:\Users\Srrok\Documents\ziipstick-deploy`
- Vercel Project: `ziipstick-offer`
- URL: `https://app.ziipstick-offer.com`
- Store / Checkout: `https://ziipstick.com`
- Currency: USD

## UTM Parameter Forwarding (REQUIRED on ALL pages)

Every page MUST capture incoming URL parameters and forward them to all outbound links and checkout URLs. This ensures attribution tracking (UTM, gclid, fbclid, coupon codes, etc.) is preserved through the entire funnel.

**SessionStorage key for this project:** `zs_incoming_params`

### Implementation:
1. Capture & persist params on load (early in `<script>`):
```js
var PARAM_KEY = 'zs_incoming_params';
var qs = window.location.search.replace(/^\?/, '');
if (qs) { try { sessionStorage.setItem(PARAM_KEY, qs); } catch(e) {} }
function getSavedParams() {
  var live = window.location.search.replace(/^\?/, '');
  if (live) return live;
  try { return sessionStorage.getItem(PARAM_KEY) || ''; } catch(e) { return ''; }
}
```

2. Append to all outbound `<a>` links after DOM ready:
```js
var saved = getSavedParams();
if (saved) {
  var links = root.querySelectorAll('a[href^="http"]');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    links[i].setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + saved);
  }
}
```

3. Append to any JS-built URLs (checkout, cart redirects):
```js
var saved = getSavedParams();
if (saved) params.push(saved);
```

## Tracklution Pixel (REQUIRED on ALL pages)

Every page in this project MUST include the Tracklution tracking pixel in `<head>` before `</head>`.

```html
<!-- Tracklution Pixel -->
<script>
    !function(t,l,r,o,c,k,s)
    {if(t.tlq)return;c=t.tlq=function(){c.callMethod?
        c.callMethod(arguments):c.queue.push(arguments)};
        if(!t._tlq)t._tlq=c;c.push=c;c.loaded=!0;c.version='1.0';c.src=o;
        c.queue=[];k=l.createElement(r);k.async=!0;c.pd = false;c.tools = null;
        k.src=o;s=l.getElementsByTagName(r)[0];
        s.parentNode.insertBefore(k,s);k.onerror=function(){
        o='https://main-47660.trlution.com/js/script-dynamic.js?version=1773992935582';
        t._tlq.src=o;k=l.createElement(r);k.async=!0;k.src=o;
        s.parentNode.insertBefore(k, s)
        }}(window,document,'script',
        'https://tralut.ziipstick.com/js/script-dynamic.js?version=1773992935582')

    tlq('init', 'LS-78960557-2');
    tlq('track', 'PageView');
    tlq('track', 'ViewContent', {content_name: 'PAGE_NAME_HERE'});
</script>
```

### Required Events
- **PageView** — fires on every page load (included in pixel snippet above)
- **ViewContent** — fires on every page load with `content_name` set to the page name
- **AddToCart** — fires on every add-to-cart action:
  ```js
  if (typeof tlq === 'function') {
    tlq('track', 'AddToCart', {
      content_name: 'Product Name (Variant)',
      content_ids: [variationId],
      value: price,
      currency: 'CAD'
    });
  }
  ```

## Quality Checklist (every agent must verify)
- [ ] Mobile screenshot matched 1:1
- [ ] Desktop screenshot matched 1:1
- [ ] All fonts, sizes, weights, colors extracted from screenshot
- [ ] All spacing (padding, margin, gap) measured from screenshot
- [ ] All border-radius values matched
- [ ] All images listed (available or marked as NEEDS IMAGE)
- [ ] No hardcoded widths that break responsiveness
- [ ] Semantic HTML used
- [ ] Class naming follows zs- prefix + BEM convention
