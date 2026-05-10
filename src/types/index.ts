export type Language = 'Telugu' | 'English'
export type Category = 'all' | 'article' | 'story' | 'novel'
export type SortDirection = 'newest' | 'oldest'
export type WorkStatus = 'Read now' | 'Coming soon' | 'Archive pending' | 'On Internet Archive'

export type WorkVersion = {
  title: string
  summary: string
  cta: string
}

export type Work = {
  id: string
  category: Exclude<Category, 'all'>
  date: string
  status: WorkStatus
  href: string
  tags: string[]
  readTime?: string
  archiveHost?: string
  covers?: Partial<Record<Language, string>>
  versions: Partial<Record<Language, WorkVersion>>
}
