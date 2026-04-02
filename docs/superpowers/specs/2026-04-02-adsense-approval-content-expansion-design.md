# AdSense Approval: Content Expansion Design

**Date:** 2026-04-02
**Status:** Approved by user

---

## Problem

spiritlevel.online was rejected by Google AdSense for "low value content." The site is 5 weeks old with 50–100 daily visits. English and Spanish are the most trafficked pages.

**Root cause analysis:**
- No About page (missing publisher identity / trust signal)
- No Contact page (missing trust signal AdSense reviewers check for)
- Single navigable page structure — all content lives on one URL + privacy.html
- Site reads as a pure utility tool, not a content destination

The content depth on existing pages is substantial (1000+ words, SVG diagrams, FAQ, step-by-step instructions). The problem is structural, not textual.

---

## Solution: Option B — Trust Pages + Blog Articles (English first)

### New Files

| File | Purpose |
|------|---------|
| `/about.html` | Publisher identity and trust signal |
| `/contact.html` | Contact signal with email |
| `/blog/index.html` | Blog landing page listing all articles |
| `/blog/how-to-hang-a-picture-frame-straight.html` | SEO article |
| `/blog/how-to-level-a-tv-on-the-wall.html` | SEO article |
| `/blog/how-to-level-a-pool-table.html` | SEO article |
| `/blog/how-to-use-your-phone-as-a-spirit-level.html` | SEO article |

---

## Technical Approach

### Layout System for New Pages

**Do NOT use the main site's `app-container` layout** (which is a fixed 10/80/10 `100dvh` flex column designed for the tool UI). New pages are long-form content documents requiring standard scrollable layouts.

**Use `privacy.html` as the layout template.** It already establishes the correct pattern:
- Inline `<style>` block in `<head>` (no Tailwind classes)
- Simple `header` → `div.container` → `footer` structure
- Max-width 760px centered container, comfortable padding

This avoids the Tailwind CSS build-scope problem entirely — `tailwind.config.js` only scans `./index.html` and `./js/**/*.js`, so any new HTML file using Tailwind utility classes would silently produce unstyled output.

### SVG Reuse

SVGs from `index.html` use hardcoded dark colors (`#374151`, `#0f172a`, `#38bdf8`, etc.). They are designed for dark backgrounds.

**Wrap each reused SVG in a dark container div:**
```html
<div style="background: #1f2937; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
  <!-- SVG here -->
</div>
```

This requires zero SVG modification and looks intentional (a "dark diagram card" in a light page).

### Robots Meta Tag

All new pages must include:
```html
<meta name="robots" content="index, follow">
```
Do NOT copy the `privacy.html` head block verbatim — it has `noindex, follow`.

---

## Page Designs

### About Page (`/about.html`)

**Layout:** privacy.html pattern

**Content:**
- H1: "About Spirit Level Online"
- Origin story: solo developer, built for personal DIY use, decided to share it free
- What the tool does (2–3 sentences): free browser-based spirit level, no app needed, works on any mobile device
- Privacy commitment: sensor data never leaves the device; GoatCounter for anonymous visit counts only
- Link to contact page

**Tone:** Genuine, personal, not corporate. First person is fine.

---

### Contact Page (`/contact.html`)

**Layout:** privacy.html pattern

**Content:**
- H1: "Contact"
- Brief note: for bug reports, feedback, or general questions
- Email: `contact@pvfreund.com` as a `mailto:` link
- Honest response time note (e.g., "I'll get back to you when I can")

**No contact form** — static GitHub Pages site, email only.

---

### Blog Index (`/blog/index.html`)

**Layout:** privacy.html pattern

**Content:**
- H1: "Leveling Guides & Tips"
- One-sentence intro: practical how-to guides for common leveling tasks using your phone
- 4 article cards (title + 1-sentence description + link)

---

### Blog Articles (4 articles, English only)

**Layout:** privacy.html pattern for all

**Common structure per article:**
1. H1 targeting a specific long-tail keyword
2. Introduction paragraph (why this task matters, 2–3 sentences)
3. Step-by-step instructions (3–6 steps, each with a `<strong>` label)
4. SVG diagram in dark container (see SVG reuse above)
5. Natural in-context call-to-action linking back to homepage (e.g., "You can use [Spirit Level Online](/) directly in your browser — no app needed.")
6. Closing paragraph or tips

**Word count:** 500–600 words per article (lean toward 550–600 for AdSense resubmission safety).

---

**Article 1: `how-to-hang-a-picture-frame-straight.html`**
- H1: "How to Hang a Picture Frame Perfectly Straight"
- Keyword: "how to find if my photo is straight"
- Content: measuring the wall, using a level before drilling, adjusting after hanging, checking at eye level
- SVG: wall mode component diagram (from index.html ~line 376)

**Article 2: `how-to-level-a-tv-on-the-wall.html`**
- H1: "How to Level a TV on the Wall"
- Keyword: "how to find if my tv is straight"
- Content: checking the mount before fixing, leveling the TV after hanging, compensating for uneven walls
- SVG: wall mode component diagram

**Article 3: `how-to-level-a-pool-table.html`**
- H1: "How to Level a Pool Table (Billiard Table)"
- Keyword: "how to level a billiard table"
- Content: why leveling matters for gameplay, checking the slate, adjusting legs/shims, re-checking after adjustment
- SVG: surface mode component diagram (from index.html ~line 297)

**Article 4: `how-to-use-your-phone-as-a-spirit-level.html`**
- H1: "How to Use Your Phone as a Spirit Level"
- Keyword: "use phone as spirit level"
- Content: how phone accelerometers work, what the app does, surface mode vs wall mode, calibration tips, accuracy expectations
- SVG: both surface and wall mode diagrams (stacked vertically in dark containers)

---

## Navigation Updates

### Footer additions on existing app pages

Add to the footer section of these files (inside the existing `app-footer` or equivalent):
- `index.html`
- `es/index.html`
- `de/index.html`
- `it/index.html`
- `fr/index.html`
- `pt/index.html`

Footer links (English labels are acceptable on all language pages for now — About/Contact/Blog are English-only):
```
About | Contact | Blog | Privacy
```

### Footer update on `privacy.html`

`privacy.html` has a separate inline-CSS `<footer>` tag. Update its existing footer line to add links:
```html
<footer>
  © 2026 spiritlevel.online — 
  <a href="/">Back to App</a> · 
  <a href="/about.html">About</a> · 
  <a href="/contact.html">Contact</a> · 
  <a href="/blog/">Blog</a>
</footer>
```

### `privacy.html` robots tag

Keep `noindex, follow` on privacy.html — it is a legal/policy page, not a content page. Do not change it.

---

## Sitemap Update

After all new pages are created, update `sitemap.xml` to include:
- `/about.html`
- `/contact.html`
- `/blog/`
- `/blog/how-to-hang-a-picture-frame-straight.html`
- `/blog/how-to-level-a-tv-on-the-wall.html`
- `/blog/how-to-level-a-pool-table.html`
- `/blog/how-to-use-your-phone-as-a-spirit-level.html`

Use `<changefreq>monthly</changefreq>` and `<priority>0.6</priority>` for blog/about/contact. Higher priority (0.8) for blog index.

---

## Success Criteria

- [ ] `about.html`, `contact.html`, `blog/index.html`, and 4 blog articles exist and are accessible
- [ ] All new pages use `index, follow` robots meta
- [ ] Footer on all existing pages (including privacy.html) links to About, Contact, Blog
- [ ] Each blog article is 500–600 words with a natural tool link
- [ ] SVGs wrapped in dark containers, visually consistent
- [ ] `sitemap.xml` updated with all new URLs
- [ ] All pages consistent in style with `privacy.html` layout pattern
- [ ] Ready to resubmit to Google AdSense
