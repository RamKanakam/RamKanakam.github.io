import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Language = 'Telugu' | 'English'
type Category = 'all' | 'article' | 'story' | 'novel'
type SortDirection = 'newest' | 'oldest'
type WorkStatus = 'Read now' | 'Coming soon' | 'Archive pending' | 'On Internet Archive'

type WorkVersion = {
  title: string
  summary: string
  cta: string
}

type Work = {
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

const categoryOptions: Array<{
  value: Category
  icon: string
  label: string
}> = [
  { value: 'all', icon: '✦', label: 'All' },
  { value: 'article', icon: '✍', label: 'Articles' },
  { value: 'story', icon: '☾', label: 'Short stories' },
  { value: 'novel', icon: '▣', label: 'Novels' },
]

const categoryNames: Record<Exclude<Category, 'all'>, string> = {
  article: 'Article',
  story: 'Short story',
  novel: 'Novel',
}

const categoryNamesTelugu: Record<Exclude<Category, 'all'>, string> = {
  article: 'వ్యాసం',
  story: 'చిన్న కథ',
  novel: 'నవల',
}

const works: Work[] = [
  {
    id: 'blue-courtyard',
    category: 'story',
    date: '2026-05-05',
    status: 'Coming soon',
    href: '#',
    tags: ['Quiet mystery', 'Standalone'],
    readTime: '8 min read',
    versions: {
      English: {
        title: 'The Blue Courtyard',
        summary:
          'A quiet mystery about an old house, a single evening, and a visitor who recognizes a room they have never entered.',
        cta: 'Story coming soon',
      },
    },
  },
  {
    id: 'nadiki-avatala-ooru',
    category: 'story',
    date: '2026-05-03',
    status: 'Coming soon',
    href: '#',
    tags: ['జానపద స్వరం', 'Shared world'],
    readTime: '10 నిమిషాలు',
    versions: {
      Telugu: {
        title: 'నదికి అవతల ఊరు',
        summary:
          'ఒకే నది చుట్టూ తిరిగే కథల శ్రేణి. ప్రతి కథ ఒంటరిగా నిలబడుతుంది, కానీ పేర్లు, ప్రదేశాలు మళ్లీ కనిపిస్తాయి.',
        cta: 'త్వరలో',
      },
    },
  },
  {
    id: 'when-nature-doesnt-care',
    category: 'article',
    date: '2026-04-28',
    status: 'Read now',
    href: '#',
    tags: ['Philosophy', 'Rationality'],
    readTime: '5 min read',
    covers: {
      English: '/images/articles/when-nature-doesnt-care/cover.en.jpg',
      Telugu: '/images/articles/when-nature-doesnt-care/cover.te.jpg',
    },
    versions: {
      English: {
        title: "When Nature Doesn't Care",
        summary:
          'When a volcano erupts or a flood sweeps through, nature offers no apology. An essay on indifferent forces and what rationality asks of us when the universe simply doesn\u2019t care.',
        cta: 'Read article',
      },
      Telugu: {
        title: 'ప్రకృతికి పట్టని గోల',
        summary:
          'అగ్నిపర్వతం పేలినప్పుడు, నదులు పొంగినప్పుడు — ప్రకృతి క్షమాపణ చెప్పదు. విశ్వం పట్టించుకోనప్పుడు మనం ఎలా అర్థం వెతుకుతామో చెప్పే వ్యాసం.',
        cta: 'వ్యాసం చదవండి',
      },
    },
  },
  {
    id: 'between-two-languages',
    category: 'article',
    date: '2026-04-28',
    status: 'Coming soon',
    href: '#',
    tags: ['Language', 'Craft'],
    readTime: '5 min read',
    versions: {
      English: {
        title: 'Between two languages',
        summary:
          'Notes on writing across Telugu and English without forcing every thought to wear the same shape.',
        cta: 'Essay coming soon',
      },
    },
  },
  {
    id: 'chadivina-ventane',
    category: 'article',
    date: '2026-04-24',
    status: 'Coming soon',
    href: '#',
    tags: ['Reading', 'Notes'],
    readTime: '6 నిమిషాలు',
    versions: {
      Telugu: {
        title: 'చదివిన వెంటనే మిగిలిన వెలుగు',
        summary: 'పుస్తకం ముగిసిన తర్వాత మనతో నడిచే వాక్యాలు, జ్ఞాపకాలు, చిన్న చర్చల కోసం.',
        cta: 'త్వరలో',
      },
    },
  },
  {
    id: 'novel-project-one',
    category: 'novel',
    date: '2026-04-12',
    status: 'Archive pending',
    href: '#',
    tags: ['PDF / EPUB', 'Cover art'],
    archiveHost: 'Internet Archive',
    versions: {
      English: {
        title: 'Novel project one',
        summary:
          'A future full-length novel entry. Add cover art, a short synopsis, and the Internet Archive link when the upload is ready.',
        cta: 'Archive link pending',
      },
      Telugu: {
        title: 'మొదటి నవల ప్రాజెక్ట్',
        summary:
          'పూర్తి నవల కోసం భవిష్యత్ ప్రవేశం. కవర్ ఆర్ట్, సంక్షిప్త పరిచయం, Internet Archive లింక్ సిద్ధమైన తర్వాత ఇక్కడ జోడించండి.',
        cta: 'ఆర్కైవ్ లింక్ తరువాత',
      },
    },
  },
  {
    id: 'archive-of-rain',
    category: 'story',
    date: '2026-04-08',
    status: 'Coming soon',
    href: '#',
    tags: ['Speculative', 'Shared world'],
    readTime: '9 min read',
    versions: {
      English: {
        title: 'Archive of Rain',
        summary:
          'A speculative companion story from a river-bound world, told through records no one remembers writing.',
        cta: 'Story coming soon',
      },
    },
  },
  {
    id: 'collected-stories',
    category: 'novel',
    date: '2026-03-30',
    status: 'Archive pending',
    href: '#',
    tags: ['Telugu', 'Collection'],
    archiveHost: 'Internet Archive',
    versions: {
      Telugu: {
        title: 'కథల సంపుటి',
        summary:
          'Internet Archive లో ఉంచే కథా సంపుటాలు, దీర్ఘ రచనలు, లేదా సీరియలైజ్డ్ ఫిక్షన్ కోసం కవర్-ఆధారిత ప్రవేశం.',
        cta: 'ఆర్కైవ్ లింక్ తరువాత',
      },
    },
  },
]

function hasLanguage(work: Work, language: Language) {
  return Boolean(work.versions[language])
}

function sortByDate(direction: SortDirection) {
  return (a: Work, b: Work) => {
    const left = new Date(a.date).getTime()
    const right = new Date(b.date).getTime()

    return direction === 'newest' ? right - left : left - right
  }
}

function formatDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'Telugu' ? 'te-IN' : 'en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function nextLanguage(language: Language) {
  return language === 'Telugu' ? 'English' : 'Telugu'
}

function isLive(work: Work) {
  return work.href !== '#'
}

function getCategoryLabel(work: Work, language: Language) {
  return language === 'Telugu' ? categoryNamesTelugu[work.category] : categoryNames[work.category]
}

function WorkMeta({ work, language }: { work: Work; language: Language }) {
  return (
    <div className="meta-row">
      <span>{getCategoryLabel(work, language)}</span>
      <span>{language === 'Telugu' ? 'తెలుగు' : 'English'}</span>
      <span>{formatDate(work.date, language)}</span>
      {work.readTime ? <span>{work.readTime}</span> : null}
    </div>
  )
}

function EmptyState({ language }: { language: Language }) {
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

function CoverArt({ work, language, isActive = false }: { work: Work; language: Language; isActive?: boolean }) {
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

function CarouselStack({
  works: filteredWorks,
  language,
  activeIndex,
  onSelect,
}: {
  works: Work[]
  language: Language
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const n = filteredWorks.length

  return (
    <div className="coverflow-stage" aria-label="Latest works carousel">
      {filteredWorks.map((work, index) => {
        const version = work.versions[language]
        if (!version) return null

        // Compute position relative to activeIndex: negative = left, positive = right
        let pos = (index - activeIndex + n) % n
        if (pos > Math.floor(n / 2)) pos -= n

        const slotClass =
          Math.abs(pos) > 3
            ? 'slot-out'
            : `slot-${pos < 0 ? 'minus-' + Math.abs(pos) : pos}`

        return (
          <button
            aria-current={pos === 0 ? 'true' : undefined}
            aria-label={`Show ${version.title}`}
            className={`polaroid-slide ${slotClass}`}
            key={work.id}
            onClick={() => onSelect(index)}
            type="button"
          >
            <CoverArt work={work} language={language} isActive={pos === 0} />
          </button>
        )
      })}
    </div>
  )
}

function Spotlight({ work, language }: { work: Work; language: Language }) {
  const version = work.versions[language]

  if (!version) return null

  return (
    <article className="spotlight-card">
      <div>
        <p className="eyebrow">{language === 'Telugu' ? 'తాజా ఎంపిక' : 'Latest selection'}</p>
        <h1>{version.title}</h1>
      </div>

      <WorkMeta work={work} language={language} />
      <p className="spotlight-summary">{version.summary}</p>

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


function App() {
  const [language, setLanguage] = useState<Language>('English')
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [sortDirection, setSortDirection] = useState<SortDirection>('newest')
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null)

  const filteredWorks = useMemo(() => {
    return works
      .filter((work) => hasLanguage(work, language))
      .filter((work) => activeCategory === 'all' || work.category === activeCategory)
      .sort(sortByDate(sortDirection))
  }, [activeCategory, language, sortDirection])

  // When the filtered list changes, keep the same work if it's still present
  // (handles language switch: same work, different cover). Fall back to first.
  useEffect(() => {
    setActiveWorkId((prev) => {
      if (prev && filteredWorks.some((w) => w.id === prev)) return prev
      return filteredWorks[0]?.id ?? null
    })
  }, [filteredWorks])

  const activeIndex = Math.max(0, filteredWorks.findIndex((w) => w.id === activeWorkId))
  const activeWork = filteredWorks[activeIndex] ?? null

  function selectIndex(index: number) {
    setActiveWorkId(filteredWorks[index]?.id ?? null)
  }

  function moveSlide(step: number) {
    if (filteredWorks.length === 0) return
    selectIndex((activeIndex + step + filteredWorks.length) % filteredWorks.length)
  }

  return (
    <div className="site-shell">
      <header className="topbar" id="top">
        <a className="brand" href="#top" aria-label="Nakshatra Patham home">
          <span className="brand__telugu">నక్షత్రపథం</span>
          <span className="brand__english">Nakshatra Patham</span>
        </a>

        <button
          aria-label={`Switch to ${nextLanguage(language)}`}
          className="round-button language-button"
          onClick={() => setLanguage(nextLanguage(language))}
          title={`Switch to ${nextLanguage(language)}`}
          type="button"
        >
          {language === 'Telugu' ? 'తే' : 'En'}
        </button>
      </header>

      <main>
        <section className="carousel-section" aria-labelledby="carousel-title">
          <div className="carousel-title-row">
            <div>
              <p className="eyebrow">{language === 'Telugu' ? 'కొత్తగా షెల్ఫ్‌లో' : 'New on the shelf'}</p>
              <h2 id="carousel-title">{language === 'Telugu' ? 'తాజా రచనలు' : 'Latest works'}</h2>
            </div>
            <p>
              {language === 'Telugu'
                ? 'కథలు, నవలలు, వ్యాసాలు — అందుబాటులో ఉన్న తాజా రచనలు.'
                : 'Stories, novels, and articles arranged like a small rotating shelf.'}
            </p>
          </div>

          <div className="carousel-shell">
            {activeWork ? (
              <>
                <button
                  aria-label="Previous work"
                  className="carousel-arrow carousel-arrow--left"
                  onClick={() => moveSlide(-1)}
                  type="button"
                >
                  ‹
                </button>

                <CarouselStack
                  activeIndex={activeIndex}
                  language={language}
                  onSelect={selectIndex}
                  works={filteredWorks}
                />

                <button
                  aria-label="Next work"
                  className="carousel-arrow carousel-arrow--right"
                  onClick={() => moveSlide(1)}
                  type="button"
                >
                  ›
                </button>

                <div className="carousel-dots" aria-label="Carousel position">
                  {filteredWorks.map((work, index) => (
                    <button
                      aria-label={`Show ${work.versions[language]?.title ?? work.id}`}
                      className={index === activeIndex ? 'active' : ''}
                      key={work.id}
                      onClick={() => selectIndex(index)}
                      type="button"
                    />
                  ))}
                </div>

                {/* <Spotlight key={activeWork.id} work={activeWork} language={language} /> */}
              </>
            ) : (
              <EmptyState language={language} />
            )}
          </div>

          <div className="filter-tray" aria-label="Filter and sort works">
            {categoryOptions.map((option) => (
              <button
                aria-pressed={activeCategory === option.value}
                className={`filter-button ${activeCategory === option.value ? 'active' : ''}`}
                key={option.value}
                onClick={() => setActiveCategory(option.value)}
                type="button"
              >
                <span aria-hidden="true" className="filter-button__icon">
                  {option.icon}
                </span>
                <span>{option.label}</span>
              </button>
            ))}

            <button
              className="filter-button filter-button--sort"
              onClick={() =>
                setSortDirection((current) => (current === 'newest' ? 'oldest' : 'newest'))
              }
              type="button"
            >
              <span aria-hidden="true" className="filter-button__icon">
                {sortDirection === 'newest' ? '↓' : '↑'}
              </span>
              <span>{sortDirection === 'newest' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </section>


      </main>

      <footer className="footer">
        <p>Anonymous for now. Built for Telugu, English, and the worlds between.</p>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  )
}

export default App
