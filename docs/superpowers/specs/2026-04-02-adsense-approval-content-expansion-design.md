# AdSense Approval: Content Expansion Design

**Date:** 2026-04-02
**Status:** Approved by user

---

## Problem

spiritlevel.online was rejected by Google AdSense for "low value content." The site is 5 weeks old with 50–100 daily visits. English and Spanish are the most trafficked pages.

**Root cause analysis:**
- No About page (missing publisher identity / trust signal)
- No Contact page (missing trust signal AdSense reviewers check for)
- Single navigable page structure — all content on one URL + privacy.html
- Site reads as a pure utility tool, not a content destination

The content depth on individual pages is substantial (1000+ words, SVG diagrams, FAQ, step-by-step instructions). The problem is structural, not textual.

---

## Solution: Option B — Trust Pages + Blog Articles (English first)

### New Pages

| File | Purpose |
|------|---------|
| `/about.html` | Publisher identity and trust signal |
| `/contact.html` | Contact signal with email |
| `/blog/index.html` | Blog landing page listing all articles |
| `/blog/how-to-hang-a-picture-frame-straight.html` | SEO article |
| `/blog/how-to-level-a-tv-on-the-wall.html` | SEO article |
| `/blog/how-to-level-a-pool-table.html` | SEO article |
| `/blog/5-diy-leveling-tips.html` | SEO article |

---

## Page Designs

### About Page (`/about.html`)

**Structure:**
- Same header/footer as main site
- Origin story: solo developer, built for personal DIY use, decided to share for free
- What the tool does (2–3 sentences)
- Privacy commitment: no data collected, all processing in-browser (GoatCounter for analytics only)
- Link to contact page

**Tone:** Genuine, personal, not corporate.

---

### Contact Page (`/contact.html`)

**Structure:**
- Same header/footer as main site
- Brief note: for bug reports, feedback, or general questions
- Email address: contact@pvfreund.com
- Honest response time disclaimer

**No contact form** — static GitHub Pages site, email only.

---

### Blog Index (`/blog/index.html`)

**Structure:**
- Same header/footer as main site
- H1: "Leveling Guides & Tips"
- Card/list of 4 articles with title, short description, and link
- Brief intro paragraph about the blog's purpose

---

### Blog Articles (4 articles, English only)

Each article follows this structure:
- Same header/footer as main site
- H1 targeting a specific long-tail keyword
- Introduction (why this task matters)
- Step-by-step instructions (3–6 steps)
- Relevant SVG diagram reused from `index.html` (surface or wall mode)
- Natural in-context mention of the tool with a link back to homepage
- 400–600 words

**Article 1: `how-to-hang-a-picture-frame-straight.html`**
- Keyword: "how to find if my photo is straight"
- SVG: wall mode component diagram

**Article 2: `how-to-level-a-tv-on-the-wall.html`**
- Keyword: "how to find if my tv is straight"
- SVG: wall mode component diagram

**Article 3: `how-to-level-a-pool-table.html`**
- Keyword: "how to level a billiard/pool table"
- SVG: surface mode component diagram

**Article 4: `5-diy-leveling-tips.html`**
- Keyword: "DIY leveling tips"
- SVG: both surface and wall mode diagrams

---

## Navigation Updates

Add links to About, Contact, and Blog in the **footer of all existing pages**:
- `index.html`
- `es/index.html`
- `de/index.html`
- `it/index.html`
- `fr/index.html`
- `pt/index.html`
- `privacy.html`

This is critical — AdSense reviewers must be able to navigate to these pages during manual review.

---

## Technical Constraints

- Static site on GitHub Pages — no backend, no forms, no server-side rendering
- HTML/CSS/vanilla JS only
- Tailwind CSS via compiled `css/style.css`
- Reuse existing header/footer markup patterns from `index.html`
- Reuse SVG diagrams from `index.html` — do not duplicate JS logic

---

## Success Criteria

- About, Contact, and Blog pages live and accessible
- Footer on all existing pages links to About, Contact, Blog
- Each blog article is 400–600 words with a natural tool mention
- All pages consistent in style with existing site
- Ready to resubmit to Google AdSense
