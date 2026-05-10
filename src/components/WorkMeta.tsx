import type { Language, Work } from '../types'
import { formatDate, getCategoryLabel } from '../utils/content'

export function WorkMeta({ work, language }: { work: Work; language: Language }) {
  return (
    <div className="meta-row">
      <span>{getCategoryLabel(work, language)}</span>
      <span>{language === 'Telugu' ? 'తెలుగు' : 'English'}</span>
      <span>{formatDate(work.date, language)}</span>
      {work.readTime ? <span>{work.readTime}</span> : null}
    </div>
  )
}
