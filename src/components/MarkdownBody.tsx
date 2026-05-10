export function MarkdownBody({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter((s) => s.trim())
  return (
    <div className="article-body">
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
