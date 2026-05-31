import type { ReactNode } from 'react'
import type { Language } from '../types'

// ── Inline markdown parser ────────────────────────────────────────────────────
// Handles: **bold**, *italic*, `code`, [text](url), ![alt](src)
const INLINE_RE =
  /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)/g

function parseInline(text: string): ReactNode {
  const nodes: ReactNode[] = []
  let last = 0
  let counter = 0
  let m: RegExpExecArray | null

  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))

    const k = counter++
    if (m[1] !== undefined)      nodes.push(<strong key={k}>{m[1]}</strong>)
    else if (m[2] !== undefined) nodes.push(<em key={k}>{m[2]}</em>)
    else if (m[3] !== undefined) nodes.push(<code key={k}>{m[3]}</code>)
    else if (m[4] !== undefined) nodes.push(<img key={k} src={m[5]} alt={m[4]} className="article-img" />)
    else if (m[6] !== undefined) nodes.push(<a key={k} href={m[7]} target="_blank" rel="noopener noreferrer">{m[6]}</a>)

    last = INLINE_RE.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  if (nodes.length === 0) return text
  return nodes.length === 1 ? nodes[0] : <>{nodes}</>
}

// ── Block parser ─────────────────────────────────────────────────────────────
export function MarkdownBody({ text, language }: { text: string; language: Language }) {
  const isTelugu = language === 'Telugu'
  // Strip HTML comments before parsing so placeholder content isn't rendered
  const cleaned = text.replace(/<!--[\s\S]*?-->/g, '').trim()
  const blocks = cleaned.split(/\n\n+/)
  let i = 0

  const elements = blocks.map((block): ReactNode => {
    const t = block.trim()
    if (!t) return null

    // Headings
    if (t.startsWith('### ')) return <h3 key={i++}>{parseInline(t.slice(4))}</h3>
    if (t.startsWith('## '))  return <h2 key={i++}>{parseInline(t.slice(3))}</h2>
    if (t.startsWith('# '))   return <h2 key={i++}>{parseInline(t.slice(2))}</h2>

    // Thematic break
    if (/^[-*_]{3,}$/.test(t)) return <hr key={i++} className="article-rule" aria-hidden="true" />

    // Blockquote
    if (t.startsWith('> ')) {
      const inner = t.replace(/^> ?/gm, '')
      return (
        <blockquote key={i++} className="article-blockquote">
          <p>{parseInline(inner)}</p>
        </blockquote>
      )
    }

    // Standalone image block
    if (t.startsWith('![')) {
      const imgMatch = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imgMatch) {
        return (
          <figure key={i++} className="article-figure">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="article-img" />
            {imgMatch[1] && <figcaption>{imgMatch[1]}</figcaption>}
          </figure>
        )
      }
    }

    // Paragraph — soft line breaks within a block become <br />
    const lines = t.split('\n')
    if (lines.length > 1) {
      return (
        <p key={i++}>
          {lines.map((line, li) =>
            li < lines.length - 1
              ? <span key={li}>{parseInline(line)}<br /></span>
              : <span key={li}>{parseInline(line)}</span>
          )}
        </p>
      )
    }

    return <p key={i++}>{parseInline(t)}</p>
  }).filter(Boolean)

  return (
    <div className="article-body" lang={isTelugu ? 'te' : 'en'}>
      {elements}
    </div>
  )
}
