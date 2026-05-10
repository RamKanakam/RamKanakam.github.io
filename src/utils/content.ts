import type { Category, Language, SortDirection, Work } from '../types'
import { categoryNames, categoryNamesTelugu } from '../data/works'

// Eagerly load all markdown content files at build time.
// Path is relative to this file (src/utils/), so ../content resolves to src/content/.
const rawFiles = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export function hasLanguage(work: Work, language: Language) {
  return Boolean(work.versions[language])
}

export function sortByDate(direction: SortDirection) {
  return (a: Work, b: Work) => {
    const left = new Date(a.date).getTime()
    const right = new Date(b.date).getTime()
    return direction === 'newest' ? right - left : left - right
  }
}

export function formatDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'Telugu' ? 'te-IN' : 'en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function nextLanguage(language: Language): Language {
  return language === 'Telugu' ? 'English' : 'Telugu'
}

export function isLive(work: Work) {
  return work.href !== '#'
}

export function categoryPath(cat: Exclude<Category, 'all'>): string {
  if (cat === 'story') return 'stories'
  if (cat === 'novel') return 'novels'
  return 'articles'
}

export function getContent(category: Exclude<Category, 'all'>, id: string, language: Language): string | null {
  const langFile = language === 'Telugu' ? 'te' : 'en'
  const key = `../content/${categoryPath(category)}/${id}/${langFile}.md`
  const raw = rawFiles[key]
  if (!raw) return null
  // Strip YAML frontmatter
  const body = raw.replace(/^---[\s\S]*?---\n?/, '').trim()
  return body || null
}

export function getCategoryLabel(work: Work, language: Language) {
  return language === 'Telugu' ? categoryNamesTelugu[work.category] : categoryNames[work.category]
}

// ---------------------------------------------------------------------------
// Theme config — read from markdown frontmatter
// ---------------------------------------------------------------------------

/**
 * Parse YAML frontmatter (flat key: value pairs only) from a raw markdown string.
 * Quoted values have their surrounding quotes stripped.
 */
function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const result: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([\w-]+):\s*(.+)$/)
    if (!m) continue
    result[m[1]] = m[2].replace(/^['"]|['"]$/g, '').trim()
  }
  return result
}

/**
 * Return the merged theme config for a work.
 *
 * Keys prefixed with `theme-` in frontmatter are collected and returned with
 * the prefix stripped, e.g. `theme-paper: "#eceff4"` → `{ paper: "#eceff4" }`.
 *
 * The active language file is read first; any missing keys fall back to the
 * other language's file. This means en.md can hold the canonical palette while
 * te.md only overrides Telugu-specific keys (or vice-versa).
 *
 * Recognised token keys and their effect:
 *   key           → sets data-theme attribute on <html> (enables CSS surface overrides)
 *   paper / ink / soft-ink / muted / rust / sage  → color tokens
 *   serif / sans / serif-te / sans-te             → font-family tokens
 *   carousel-from / carousel-via / carousel-to    → carousel gradient stops
 *   fonts         → pipe-separated Google Fonts URLs to lazy-load
 */
export function getThemeConfig(
  category: Exclude<Category, 'all'>,
  id: string,
  language: Language,
): Record<string, string> {
  const langFile = language === 'Telugu' ? 'te' : 'en'
  const fallbackFile = language === 'Telugu' ? 'en' : 'te'
  const path = (f: string) => `../content/${categoryPath(category)}/${id}/${f}.md`

  const fmActive = parseFrontmatter(rawFiles[path(langFile)] ?? '')
  const fmFallback = parseFrontmatter(rawFiles[path(fallbackFile)] ?? '')
  const merged = { ...fmFallback, ...fmActive }

  const theme: Record<string, string> = {}
  for (const [k, v] of Object.entries(merged)) {
    if (k.startsWith('theme-')) theme[k.slice(6)] = v
  }
  return theme
}
