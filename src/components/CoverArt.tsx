import type { Language, Work } from '../types'
import { categoryOptions } from '../data/works'
import { getCategoryLabel } from '../utils/content'

export function CoverArt({
  work,
  language,
  isActive = false,
}: {
  work: Work
  language: Language
  isActive?: boolean
}) {
  const version = work.versions[language]
  const categoryLabel = getCategoryLabel(work, language)
  const coverSrc = work.covers?.[language]

  if (!version) return null

  return (
    <div className={`cover-art cover-art--${work.category} ${isActive ? 'cover-art--active' : ''}`}>
      {coverSrc ? (
        <>
          <img alt={version.title} className="cover-art__img" src={coverSrc} />
          {isActive && (
            <span className="cover-badge" aria-hidden="true">{categoryLabel}</span>
          )}
        </>
      ) : (
        <div className="cover-art__inner">
          <p className="cover-art__kind">{categoryLabel}</p>
          <div className="cover-art__mark" aria-hidden="true">
            {categoryOptions.find((option) => option.value === work.category)?.icon}
          </div>
          <h3>{version.title}</h3>
          <div className="cover-art__rule" aria-hidden="true" />
          <p>{language === 'Telugu' ? 'నక్షత్రపథం' : 'Nakshatra Patham'}</p>
        </div>
      )}
    </div>
  )
}
