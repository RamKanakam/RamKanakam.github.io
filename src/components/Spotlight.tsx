import type { Language, Work } from '../types'
import { isLive, getCategoryLabel } from '../utils/content'
import { WorkMeta } from './WorkMeta'
import { MarkdownBody } from './MarkdownBody'

export function Spotlight({
  work,
  language,
  body,
  prevWork,
  nextWork,
  onSelect,
}: {
  work: Work
  language: Language
  body?: string | null
  prevWork?: Work | null
  nextWork?: Work | null
  onSelect?: (id: string) => void
}) {
  const version = work.versions[language]
  if (!version) return null

  const template =
    work.template ??
    (work.category === 'article' ? 'essay' : work.category === 'story' ? 'story' : 'novel')
  const categoryLabel = getCategoryLabel(work, language)

  const hasPrev = prevWork && prevWork.versions[language]
  const hasNext = nextWork && nextWork.versions[language]

  return (
    <article className={`reading-article reading-article--${template}`}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className={`reading-hero reading-hero--generated cover-art--${work.category}`}>
        <div className="reading-hero__titles">
          <p className="eyebrow">{categoryLabel}</p>
          <h1>{version.title}</h1>
          <span className="reading-hero__ornament" aria-hidden="true">
            <img src="/images/star.png" alt="" />
          </span>
          <WorkMeta work={work} language={language} />
          {work.pullQuote && (
            <blockquote className="reading-pull-quote reading-pull-quote--hero">
              <p>&#8220;{work.pullQuote}&#8221;</p>
            </blockquote>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="reading-body-area">
        <div className="reading-body-shell">

        {body ? (
          <MarkdownBody text={body} language={language} />
        ) : (
          <p className="reading-summary">{version.summary}</p>
        )}

        <div className="reading-end-row">
          <div className="tag-row" aria-label="Tags">
            {work.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a
            aria-disabled={!isLive(work)}
            className={`read-link ${isLive(work) ? '' : 'read-link--disabled'}`}
            href={work.href}
            onClick={(e) => { if (!isLive(work)) e.preventDefault() }}
          >
            {version.cta}{isLive(work) ? ' →' : ''}
          </a>
        </div>

        {/* ── Prev / Next navigation ── */}
        {(hasPrev || hasNext) && onSelect && (
          <nav className="reading-nav" aria-label="Navigate between works">
            {hasPrev ? (
              <button
                className="reading-nav__item reading-nav__item--prev"
                onClick={() => onSelect(prevWork!.id)}
                type="button"
              >
                <span className="reading-nav__direction">
                  ← {language === 'Telugu' ? 'వెనక్కి' : 'Previous'}
                </span>
                <span className="reading-nav__title">
                  {prevWork!.versions[language]?.title}
                </span>
              </button>
            ) : (
              <div />
            )}
            {hasNext && (
              <button
                className="reading-nav__item reading-nav__item--next"
                onClick={() => onSelect(nextWork!.id)}
                type="button"
              >
                <span className="reading-nav__direction">
                  {language === 'Telugu' ? 'తర్వాత' : 'Next'} →
                </span>
                <span className="reading-nav__title">
                  {nextWork!.versions[language]?.title}
                </span>
              </button>
            )}
          </nav>
        )}
      </div>
      </div>
    </article>
  )
}
