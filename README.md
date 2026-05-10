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

Each work can have its own full-site palette and font pairing that activates when the reader opens it. The home page always uses the default warm amber theme.

#### 4a. Name the theme

Add `theme: 'my-theme-name'` to the work entry in `works.ts`.

#### 4b. Register the font (if using a custom Google Font)

In `src/App.tsx`, add an entry to the `THEME_FONTS` map inside the `useEffect`. Each theme gets an **array** of URLs — keep English and Telugu fonts in separate entries so they can be swapped independently:

```ts
const THEME_FONTS: Record<string, string[]> = {
  'my-theme-name': [
    // English fonts
    'https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap',
    // Telugu fonts (optional — omit if using system Telugu fallbacks)
    'https://fonts.googleapis.com/css2?family=YourTeluguFont&display=swap',
  ],
}
```

All `<link>` tags are injected only while the reader is viewing this work — the home page pays zero loading cost.

#### 4c. Write the CSS theme block

At the bottom of `src/App.css`, add a block scoped to `html[data-theme='my-theme-name']`.

The **minimum** required block overrides the design tokens:

```css
html[data-theme='my-theme-name'] {
  /* Page background color */
  --paper: #f0ede8;
  /* Primary text */
  --ink: #1a1a2e;
  /* Secondary text */
  --soft-ink: #3a3a5c;
  /* De-emphasized text */
  --muted: #6b6b8a;
  /* Border color (as rgba) */
  --line: rgba(26, 26, 46, 0.12);
  /* Accent color */
  --rust: #5c4d8a;
  /* Subtle background tint */
  --sage: #dddcf5;

  /* English fonts — override if using custom ones from THEME_FONTS */
  --serif: 'YourFont', Georgia, serif;
  --sans: 'YourSansFont', Inter, sans-serif;

  /* Telugu fonts — configured independently from English.
     --serif-te is used for Telugu article body and headings.
     --sans-te is used for Telugu UI elements.
     Omit either to fall back to the default Noto Telugu stack. */
  --serif-te: 'YourTeluguFont', 'Noto Serif Telugu', Georgia, serif;
  --sans-te: 'YourTeluguSans', 'Noto Sans Telugu', sans-serif;
}
```

All six color tokens (`--paper`, `--ink`, `--soft-ink`, `--muted`, `--rust`, `--sage`) are registered as typed CSS `<color>` properties and transition globally over 640 ms when the theme activates or resets. Every element on the page that consumes these variables shifts automatically — no extra selectors needed for basic theming.

Font variables (`--serif`, `--sans`, `--serif-te`, `--sans-te`) are applied immediately on theme switch (fonts do not animate — a mid-swap blend would look broken). The article body automatically uses `--serif-te` / `--sans-te` when the active language is Telugu, and `--serif` / `--sans` when English — no additional code required.

**Optional surface overrides** — add these if the defaults don't sit well with your palette:

```css
/* Body grid lines */
html[data-theme='my-theme-name'] body {
  background:
    linear-gradient(rgba(...) 1px, transparent 1px),
    linear-gradient(90deg, rgba(...) 1px, transparent 1px),
    var(--paper);
  background-size: 48px 48px;
}

/* Carousel gradient backdrop */
html[data-theme='my-theme-name'] .carousel-section::before {
  background: linear-gradient(135deg, #aaa 0%, #555 48%, #111 100%);
}

/* Spotlight card surface */
html[data-theme='my-theme-name'] .spotlight-card {
  background: rgba(240, 237, 232, 0.9);
  border-color: rgba(26, 26, 46, 0.14);
}

/* CTA button accent */
html[data-theme='my-theme-name'] .read-link:not(.read-link--disabled) {
  background: #3d2e6e;
}

/* Typography fine-tuning (optional) */
html[data-theme='my-theme-name'] .article-body p {
  font-family: var(--serif); /* English body — --serif-te is applied automatically for Telugu */
  line-height: 1.9;
}

html[data-theme='my-theme-name'] .article-body h2,
html[data-theme='my-theme-name'] .article-body h3 {
  font-style: italic;
}
```

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
  App.tsx             ← Main app shell, theme injection, THEME_FONTS map
  App.css             ← All layout, component, and theme styles
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
| `--rust`     | `#9d4630`   | Accent, links, highlights       |
| `--sage`     | `#e8eee2`   | Subtle tinted backgrounds       |
| `--serif`    | Georgia + Noto Serif fallbacks | English display headings, brand name |
| `--sans`     | Inter + system fallbacks | English body text, UI labels |
| `--serif-te` | Noto Serif Telugu + Georgia fallback | Telugu article body and headings |
| `--sans-te`  | Noto Sans Telugu + Inter fallback | Telugu UI elements |


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
