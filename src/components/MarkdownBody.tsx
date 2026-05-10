import type { Language } from '../types'

export function MarkdownBody({ text, language }: { text: string; language: Language }) {
  const blocks = text.split(/\n\n+/).filter((s) => s.trim())
  const isTelugu = language === 'Telugu'
  return (
    <div className="article-body" lang={isTelugu ? 'te' : 'en'}>
      {blocks.map((block, i) => {
        const t = block.trim()
        if (t.startsWith('### ')) return <h3 key={i}>{t.slice(4)}</h3>
        if (t.startsWith('## ')) return <h2 key={i}>{t.slice(3)}</h2>
        if (t.startsWith('# ')) return <h2 key={i}>{t.slice(2)}</h2>
        return <p key={i}>{t}</p>
      })}
    </div>
  )
}
