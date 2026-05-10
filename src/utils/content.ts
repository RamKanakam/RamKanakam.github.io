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
