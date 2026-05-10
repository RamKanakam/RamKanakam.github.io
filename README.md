# Nakshatra Patham

A bilingual literary site for Telugu and English short stories, novels, and articles. Built with React, TypeScript, and Vite.

---

## Dev setup

```bash
npm install
npm run dev        # starts on http://localhost:5173
npm run build      # production build → dist/
```

---

## Adding a new work

Every piece of content on the site is called a **work**. Adding one requires up to four steps, depending on what the work needs.

### Step 1 — Register the work in `src/data/works.ts`

Add an object to the `works` array. The list is sorted by `date` in the UI, so order in the file doesn't matter.

```ts
{
  // Unique slug. Used in the URL (?work=my-id) and to look up content files.
  id: 'my-work-id',

  // 'article' | 'story' | 'novel'
  category: 'article',

  // ISO date string, newest first in the carousel.
  date: '2026-06-01',

  // Controls the CTA button and card badge:
  //   'Read now'          → link is live; shows "Read article / Read story / Read novel"
  //   'Coming soon'       → link is disabled
  //   'Archive pending'   → link is disabled; shows archiveHost label
  //   'On Internet Archive' → link is live and points to Internet Archive
  status: 'Read now',

  // The URL the CTA button points to. Use '#' while not yet live.
  href: 'https://example.com/my-work',

  // Short descriptive labels shown in the tag row. Mix of English and Telugu is fine.
  tags: ['Philosophy', 'Standalone'],

  // Optional. Shown in the meta row. Format freely ("5 min read", "9 నిమిషాలు").
  readTime: '5 min read',

  // Optional. Only for novels/archive entries. Shown alongside the CTA.
  // archiveHost: 'Internet Archive',

  // Optional. Per-language cover image paths relative to /public/.
  // If omitted, the site generates a typographic cover from the title.
  // covers: {
  //   English: '/images/articles/my-work-id/cover.en.jpg',
  //   Telugu:  '/images/articles/my-work-id/cover.te.jpg',
  // },

  // Optional. The name of the CSS/font theme to apply when reading this work.
  // See "Adding a custom theme" below. Omit entirely for the default warm amber theme.
  // theme: 'my-theme-name',

  // At least one language version is required.
  versions: {
    English: {
      title: 'My Work Title',
      summary: 'One or two sentences shown on the spotlight card when no body text is available.',
      cta: 'Read article',   // text on the CTA button
    },
    Telugu: {
      title: 'నా రచన',
      summary: 'సంక్షిప్త వివరణ.',
      cta: 'వ్యాసం చదవండి',
    },
  },
}
```

**Valid status → CTA button combinations**

| `status`              | `href`       | Button behaviour          |
|-----------------------|--------------|---------------------------|
| `'Read now'`          | live URL     | Clickable link            |
| `'Coming soon'`       | `'#'`        | Disabled, no navigation   |
| `'Archive pending'`   | `'#'`        | Disabled, shows host name |
| `'On Internet Archive'` | Archive URL | Clickable link            |

---

### Step 2 — Add cover images (optional)

If you supply a `covers` field, place the images in:

```
public/images/<category-plural>/<work-id>/cover.en.jpg
public/images/<category-plural>/<work-id>/cover.te.jpg
```

Where `<category-plural>` is `articles`, `stories`, or `novels`.

Images are displayed with `object-fit: cover` cropped to a square. Portrait orientation recommended; at least 680 × 680 px.

If `covers` is omitted the site automatically generates a typographic card with the category icon and title.

---

### Step 3 — Add body content (optional)

If the work is readable inline (status `'Read now'` and content exists), create a Markdown file at:

```
src/content/<category-plural>/<work-id>/en.md   ← English
src/content/<category-plural>/<work-id>/te.md   ← Telugu
```

The file can start with YAML frontmatter — it's stripped automatically at runtime. Only `##` and `###` headings and paragraphs are styled; keep the prose flat.

```md
---
title: My Work Title
lang: en
---

## First section

Body text goes here. Keep paragraphs separated by a blank line.

## Second section

More text.
```

If no content file exists for the active language, the spotlight card shows `version.summary` instead.

---

### Step 4 — Add a custom theme (optional)

Each work can have its own full-site palette, fonts, and carousel mood that activates when the reader opens it. **The entire theme is configured in the article's markdown frontmatter** — no code changes needed for the common case. The home page always uses the default warm amber theme.

#### 4a. Add `theme-*` keys to the article frontmatter

Open the content file (e.g. `src/content/articles/my-work-id/en.md`) and add `theme-*` keys to the YAML frontmatter. Every key is optional — omit any you don't want to change.

```yaml
---
id: my-work-id
lang: en
title: My Work Title
# ... other frontmatter fields ...

# ── Theme configuration ──────────────────────────────────────────────
# theme-key: triggers a CSS data-theme block for advanced surface overrides
#            (see Step 4b). Omit if you only need palette/font changes.
theme-key: my-theme-name

# Color tokens — all six transition smoothly on open/close
theme-paper: "#f0ede8"       # page background
theme-ink: "#1a1a2e"         # headings, strong text, buttons
theme-soft-ink: "#3a3a5c"    # body text
theme-muted: "#6b6b8a"       # eyebrows, meta labels
theme-rust: "#5c4d8a"        # accent color, CTA button background
theme-sage: "#dddcf5"        # subtle tinted surfaces

# English fonts
theme-serif: "'YourFont', Georgia, serif"
theme-sans: "'YourSansFont', Inter, sans-serif"

# Telugu fonts — configured independently from English.
# Omit either to keep the default Noto Telugu system stack.
theme-serif-te: "'YourTeluguFont', 'Noto Serif Telugu', serif"
theme-sans-te: "'YourTeluguSans', 'Noto Sans Telugu', sans-serif"

# Carousel gradient stops (top of page backdrop)
theme-carousel-from: "#6b4fa0"
theme-carousel-via: "#3d2e6e"
theme-carousel-to: "#1a1228"

# Google Fonts to lazy-load — pipe-separated URLs.
# English and Telugu fonts can be in separate entries.
# These links are injected only while the reader is viewing this work.
theme-fonts: "https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap | https://fonts.googleapis.com/css2?family=YourTeluguFont&display=swap"

# Typography tuning — all optional. These drive CSS custom properties so the
# font characteristics from your chosen typeface are reflected everywhere.
theme-heading-letter-spacing: "-0.02em"  # tighten/loosen display headings
theme-heading-font-weight: "800"         # weight of h1/h2/h3 across the site
theme-body-line-height: "1.9"            # article paragraph leading
theme-body-letter-spacing: "0.01em"      # article paragraph tracking
theme-h2-font-style: "italic"            # style for section headers inside the article
theme-h2-font-weight: "600"              # weight for section headers inside the article
---
```

**How language fallback works:** The active language's file is read first; any missing `theme-*` keys fall back to the other language's file. The recommended approach is to put the full theme config in `en.md` and only add language-specific overrides (if any) to `te.md`. When reading in Telugu, the palette from `en.md` applies automatically, with any `te.md` overrides winning.

#### 4b. CSS surface overrides (optional, advanced)

Glass card surfaces, borders, and dot textures automatically inherit the active palette via `color-mix()` — no CSS needed for those. Add a `html[data-theme='my-theme-name']` block in `src/App.css` only if you need effects that can't be expressed as token values: non-standard background patterns, custom animations, or unique shapes.

Most themes won't need this step at all — palette, font, and typography changes from frontmatter are enough for a strong visual shift.

---

## File map

```
src/
  data/
    works.ts          ← All work metadata. Edit here to add/update works.
  content/
    articles/<id>/    ← Inline readable content for articles
      en.md
      te.md
    stories/<id>/     ← Inline readable content for stories
      en.md
      te.md
    novels/<id>/      ← Inline readable content for novels (rare)
      en.md
  types/
    index.ts          ← TypeScript types (Work, WorkVersion, etc.)
  utils/
    content.ts        ← Helpers: getContent(), formatDate(), isLive(), etc.
  App.tsx             ← Main app shell, theme injection via frontmatter
  App.css             ← All layout, component styles; escape hatch for advanced theme effects
  index.css           ← CSS reset, design tokens, @property registrations

public/
  images/
    articles/<id>/    ← Cover images for articles
    stories/<id>/     ← Cover images for stories
    novels/<id>/      ← Cover images for novels
```

---

## Design tokens (default theme)

| Token        | Value       | Used for                        |
|--------------|-------------|---------------------------------|
| `--paper`    | `#fbf6eb`   | Page background, card fills     |
| `--ink`      | `#241a16`   | Headings, strong text, buttons  |
| `--soft-ink` | `#5f514a`   | Body text                       |
| `--muted`    | `#7c6f67`   | Eyebrows, meta labels, captions |
| `--rust`     | `#9d4630`   | Accent color, CTA button background |
| `--sage`     | `#e8eee2`   | Subtle tinted backgrounds       |
| `--serif`    | Georgia + Noto Serif fallbacks | English display headings, brand name |
| `--sans`     | Inter + system fallbacks | English body text, UI labels |
| `--serif-te` | Noto Serif Telugu + Georgia fallback | Telugu article body and headings |
| `--sans-te`  | Noto Sans Telugu + Inter fallback | Telugu UI elements |
| `--carousel-from` | `#d5bd82` | Carousel backdrop gradient — start |
| `--carousel-via`  | `#a48758` | Carousel backdrop gradient — mid   |
| `--carousel-to`   | `#675436` | Carousel backdrop gradient — end   |
| `--heading-letter-spacing` | `-0.04em` | Letter-spacing for h1/h2/h3 site-wide |
| `--heading-font-weight` | `850` | Font-weight for h1/h2/h3 site-wide |
| `--body-line-height` | `1.8` | Line-height for article body paragraphs |
| `--body-letter-spacing` | `normal` | Letter-spacing for article body paragraphs |
| `--h2-font-style` | `normal` | Font-style for section headings inside the article |
| `--h2-font-weight` | `850` | Font-weight for section headings inside the article |


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
