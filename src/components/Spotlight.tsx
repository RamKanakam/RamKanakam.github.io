import type { Language, Work } from '../types'
import { isLive } from '../utils/content'
import { WorkMeta } from './WorkMeta'
import { MarkdownBody } from './MarkdownBody'

export function Spotlight({
  work,
  language,
  body,
}: {
  work: Work
  language: Language
  body?: string | null
}) {
  const version = work.versions[language]

  if (!version) return null

  return (
    <article className="spotlight-card">
      <div>
        <p className="eyebrow">{language === 'Telugu' ? 'తాజా ఎంపిక' : 'Latest selection'}</p>
        <h1>{version.title}</h1>
      </div>

      <WorkMeta work={work} language={language} />

      {body ? (
        <MarkdownBody text={body} language={language} />
      ) : (
        <p className="spotlight-summary">{version.summary}</p>
      )}

      <div className="tag-row" aria-label="Tags">
        {work.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <a
        aria-disabled={!isLive(work)}
        className={`read-link ${isLive(work) ? '' : 'read-link--disabled'}`}
        href={work.href}
        onClick={(event) => {
          if (!isLive(work)) event.preventDefault()
        }}
      >
        {version.cta}
      </a>
    </article>
  )
}
