import type { Language } from '../types'

export function EmptyState({ language }: { language: Language }) {
  return (
    <div className="empty-state">
      <p className="eyebrow">No pieces here yet</p>
      <h2>{language === 'Telugu' ? 'ఈ షెల్ఫ్ ఇంకా ఖాళీగా ఉంది.' : 'This shelf is still empty.'}</h2>
      <p>
        {language === 'Telugu'
          ? 'మరో భాష లేదా మరో విభాగాన్ని ప్రయత్నించండి.'
          : 'Try another category or switch the language.'}
      </p>
    </div>
  )
}
