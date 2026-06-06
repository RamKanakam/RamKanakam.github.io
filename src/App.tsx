import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import './App.css'

import type { Category, Language } from './types'
import { works, categoryNames, categoryNamesTelugu } from './data/works'
import { hasLanguage, sortByDate, nextLanguage, getContent, getThemeConfig, getCategoryLabel } from './utils/content'
import { CoverArt } from './components/CoverArt'
import { EmptyState } from './components/EmptyState'
import { Spotlight } from './components/Spotlight'

const PANELS = [
  {
    cat: 'article' as Exclude<Category, 'all'>,
    labelEn: 'Articles',
    labelTe: 'వ్యాసాలు',
    descEn: 'Essays on writing, life, and the spaces between.',
    descTe: 'రాత, జీవితం, వాటి మధ్య ఉన్న స్థలాల గురించి.',
    bg: '/images/categories/articles-bg.webp',
    featuredPos: '85% 40%',
    browseEn: 'Browse Articles',
    browseTe: 'వ్యాసాలు చదవండి',
  },
  {
    cat: 'story' as Exclude<Category, 'all'>,
    labelEn: 'Stories',
    labelTe: 'కథలు',
    descEn: 'Fleeting worlds. Quiet magic. Strange awakenings.',
    descTe: 'తక్షణ ప్రపంచాలు. నిశ్శబ్ద మాయ. విచిత్ర మేల్కొలుపులు.',
    bg: '/images/categories/stories-bg.webp',
    featuredPos: '30% 15%',
    browseEn: 'Browse Stories',
    browseTe: 'కథలు చదవండి',
  },
  {
    cat: 'novel' as Exclude<Category, 'all'>,
    labelEn: 'Novels',
    labelTe: 'నవలలు',
    descEn: 'Longer journeys. Deeper worlds.',
    descTe: 'సుదీర్ఘ ప్రయాణాలు. లోతైన ప్రపంచాలు.',
    bg: '/images/categories/novels-bg.webp',
    featuredPos: '75% 30%',
    browseEn: 'Browse Novels',
    browseTe: 'నవలలు చదవండి',
  },
]

function App() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams()
  const activeWorkId = searchParams.get('work')
  const isReading = activeWorkId !== null

  const [language, setLanguage] = useState<Language>('English')
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const sortDirection = 'newest'
  const [activeArticleTopic, setActiveArticleTopic] = useState<string>('All')
  const nextLang = nextLanguage(language)

  // ── Derived ───────────────────────────────────────────────────────────────
  const articleTopics = useMemo(() => {
    const topics = new Set<string>()

    works
      .filter((work) => work.category === 'article')
      .forEach((work) => {
        const topic = work.tags[0]
        if (topic) topics.add(topic)
      })

    return ['All', ...Array.from(topics)]
  }, [])

  const filteredWorks = useMemo(() => {
    return works
      .filter((work) => hasLanguage(work, language))
      .filter((work) => activeCategory === 'all' || work.category === activeCategory)
      .filter((work) => activeCategory !== 'article' || activeArticleTopic === 'All' || work.tags[0] === activeArticleTopic)
      .sort(sortByDate(sortDirection))
  }, [activeArticleTopic, activeCategory, language, sortDirection])

  const activeIndex = Math.max(0, filteredWorks.findIndex((w) => w.id === activeWorkId))
  const activeWork = filteredWorks[activeIndex] ?? null
  const prevWork = activeIndex > 0 ? filteredWorks[activeIndex - 1] : null
  const nextWork = activeIndex < filteredWorks.length - 1 ? filteredWorks[activeIndex + 1] : null

  // ── Effects ───────────────────────────────────────────────────────────────

  // If the active work falls out of the filtered list while reading, fall back.
  useEffect(() => {
    if (!isReading) return
    if (filteredWorks.some((w) => w.id === activeWorkId)) return
    const fallback = filteredWorks[Math.floor(filteredWorks.length / 2)]?.id ?? null
    if (fallback) setSearchParams({ work: fallback }, { replace: true })
    else setSearchParams({}, { replace: true })
  }, [filteredWorks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to top whenever the active work changes (entering reading or switching works).
  useEffect(() => {
    if (activeWorkId) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeWorkId])

  useEffect(() => {
    if (activeCategory !== 'article') setActiveArticleTopic('All')
  }, [activeCategory])

  // Update the browser tab title while reading.
  useEffect(() => {
    if (isReading && activeWork) {
      const v = activeWork.versions[language]
      document.title = v ? `${v.title} — Nakshatra Patham` : 'Nakshatra Patham'
    } else {
      document.title = 'Nakshatra Patham'
    }
  }, [isReading, activeWork?.id, language]) // eslint-disable-line react-hooks/exhaustive-deps

  // Apply per-work page theme while reading; revert to defaults on close.
  useEffect(() => {
    const el = document.documentElement
    if (!isReading || !activeWork) {
      el.removeAttribute('data-theme')
      return
    }
    const themeConfig = getThemeConfig(activeWork.category, activeWork.id, language)
    const CSS_TOKENS = [
      'paper', 'ink', 'soft-ink', 'muted', 'rust', 'sage',
      'serif', 'sans', 'serif-te', 'sans-te',
      'carousel-from', 'carousel-via', 'carousel-to',
      'heading-letter-spacing', 'heading-font-weight',
      'body-line-height', 'body-letter-spacing',
      'h2-font-style', 'h2-font-weight',
    ]
    const appliedTokens: string[] = []
    for (const token of CSS_TOKENS) {
      if (themeConfig[token]) {
        el.style.setProperty(`--${token}`, themeConfig[token])
        appliedTokens.push(token)
      }
    }
    if (themeConfig['key']) el.setAttribute('data-theme', themeConfig['key'])
    const fontLinks: HTMLLinkElement[] = []
    const fontsRaw = themeConfig['fonts']
    if (fontsRaw) {
      fontsRaw.split('|').map(s => s.trim()).filter(Boolean).forEach((href, i) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.id = `theme-font-${themeConfig['key'] ?? 'custom'}-${i}`
        document.head.appendChild(link)
        fontLinks.push(link)
      })
    }
    return () => {
      el.removeAttribute('data-theme')
      appliedTokens.forEach(token => el.style.removeProperty(`--${token}`))
      fontLinks.forEach(l => l.remove())
    }
  }, [isReading, activeWork?.id, language])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function selectWork(id: string) {
    setSearchParams({ work: id })
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="site-shell">

      {/* ── Header ── */}
      <nav className="site-nav" id="top">
        <a
          className="site-nav__brand"
          href={isReading ? undefined : '#top'}
          aria-label="Nakshatra Patham home"
          onClick={() => { setActiveCategory('all'); if (isReading) setSearchParams({}) }}
          style={{ cursor: 'pointer' }}
        >
          {language === 'Telugu' ? (
            <span className="site-nav__brand-te">నక్షత్రపథం</span>
          ) : (
            <span className="site-nav__brand-en">Nakshatra Patham</span>
          )}
        </a>
        <ul className="site-nav__links" role="list">
          <li>
            <button
              type="button"
              className={`site-nav__link${!isReading && activeCategory === 'all' ? ' site-nav__link--active' : ''}`}
              onClick={() => { setActiveCategory('all'); if (isReading) setSearchParams({}) }}
            >
              {language === 'Telugu' ? 'ఉద్భవం' : 'HOME'}
            </button>
          </li>
          {PANELS.map(({ cat, labelEn, labelTe }) => (
            <li key={cat}>
              <button
                type="button"
                className={`site-nav__link${(isReading ? activeWork?.category === cat : activeCategory === cat) ? ' site-nav__link--active' : ''}`}
                onClick={() => { setActiveCategory(cat); if (isReading) setSearchParams({}) }}
              >
                {language === 'Telugu' ? labelTe.toUpperCase() : labelEn.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
        <div className="site-nav__actions">
          {isReading && <div className="reading-progress-bar" aria-hidden="true" />}
          <button
            aria-label={`Switch to ${nextLang}`}
            className="round-button"
            onClick={() => setLanguage(nextLang)}
            title={`Switch to ${nextLang}`}
            type="button"
          >
            <img
              src={nextLang === 'Telugu' ? '/images/ui/telugu-button.png' : '/images/ui/english-button.png'}
              alt=""
              className="round-button__image"
            />
          </button>
        </div>
      </nav>

      <main>
        {/* ── Home view: hero + category panels ── */}
        {!isReading && activeCategory === 'all' && (
          <div className="home-canvas">
            <section className="hero">
              <div className="hero__overlay" aria-hidden="true" />
              <div className="hero__content">
                {language === 'Telugu' ? (
                  <h1 className="hero__title">నక్షత్రపథం</h1>
                ) : (
                  <h1 className="hero__title hero__title--en">Nakshatra Patham</h1>
                )}
                <span className="hero__ornament" aria-hidden="true">
                  <img src="/images/star.png" alt="" />
                </span>
                {/* <p className="hero__subtitle">
                  {language === 'Telugu'
                    ? 'పదాలు నక్షత్రాలను కలిసే చోట'
                    : 'Where words meet the stars'}
                </p> */}
              </div>
            </section>

            <section
              className="categories-grid"
              aria-label={language === 'Telugu' ? 'వర్గాల ద్వారా చదవండి' : 'Browse by category'}
            >
              {PANELS.map(({ cat, labelEn, labelTe, descEn, descTe, bg, browseEn, browseTe }) => {
                const catWorks = works
                  .filter(w => w.category === cat && hasLanguage(w, language))
                  .sort(sortByDate('newest'))
                  .slice(0, 3)
                // Pad to always show 3 slots
                const slots: (typeof catWorks[0] | null)[] = [
                  ...catWorks,
                  ...Array(Math.max(0, 3 - catWorks.length)).fill(null),
                ]
                const fallbackPositions = ['20% center', '50% center', '80% center']
                return (
                  <article key={cat} className={`cat-panel cat-panel--${cat}`}>
                    {/* Full-panel background image */}
                    <img
                      src={bg}
                      alt=""
                      className="cat-panel__bg"
                      aria-hidden="true"
                      loading="lazy"
                    />
                    {/* Dark gradient overlay for readability */}
                    <div className="cat-panel__overlay" aria-hidden="true" />

                    {/* All content sits above bg */}
                    <div className="cat-panel__content">
                      <header className="cat-panel__header">
                        <h2 className={`cat-panel__title${language === 'Telugu' ? ' cat-panel__title--te' : ' cat-panel__title--en'}`}>
                          {language === 'Telugu' ? labelTe : labelEn}
                        </h2>
                        <span className="cat-panel__ornament" aria-hidden="true">
                          <img src="/images/star.png" alt="" />
                        </span>
                        <p className="cat-panel__desc">
                          {language === 'Telugu' ? descTe : descEn}
                        </p>
                      </header>

                      {/* Work cards — always 3 slots */}
                      <div className="cat-panel__works">
                        {slots.map((work, idx) => {
                          if (!work) {
                            return (
                              <div key={`empty-${idx}`} className="cat-work-thumb cat-work-thumb--empty">
                                <div className="cat-work-thumb__img-wrap">
                                  <div className="cat-work-thumb__placeholder" />
                                </div>
                                <div className="cat-work-thumb__info">
                                  <span className="cat-work-thumb__label">
                                    {language === 'Telugu' ? 'త్వరలో' : 'Coming soon'}
                                  </span>
                                  <span className="cat-work-thumb__name">—</span>
                                </div>
                              </div>
                            )
                          }
                          const version = work.versions[language]
                          if (!version) return null
                          const coverSrc = work.covers?.[language]
                          const thumbLabel = work.tags?.[0]
                            ?? (language === 'Telugu' ? categoryNamesTelugu[cat] : categoryNames[cat])
                          return (
                            <button
                              key={work.id}
                              type="button"
                              className="cat-work-thumb"
                              aria-label={`Open ${version.title}`}
                              onClick={() => selectWork(work.id)}
                            >
                              <div className="cat-work-thumb__img-wrap">
                                <img
                                  src={coverSrc ?? bg}
                                  alt=""
                                  className="cat-work-thumb__img"
                                  style={coverSrc ? undefined : { objectPosition: fallbackPositions[idx] }}
                                />
                              </div>
                              <div className="cat-work-thumb__info">
                                <span className="cat-work-thumb__label">{thumbLabel}</span>
                                <span className="cat-work-thumb__name">{version.title}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      <button
                        type="button"
                        className="cat-panel__browse"
                        onClick={() => setActiveCategory(cat)}
                      >
                        <span>{language === 'Telugu' ? browseTe : browseEn}</span>
                        <span aria-hidden="true">⟶</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </section>
          </div>
        )}

        {/* ── Browse view: filtered works grid ── */}
        {!isReading && activeCategory !== 'all' && (
          <section
            className="browse-section"
            aria-label={language === 'Telugu'
              ? PANELS.find(p => p.cat === activeCategory)?.labelTe
              : PANELS.find(p => p.cat === activeCategory)?.labelEn}
          >
            <div className="browse-header">
              <div className="browse-header__top">
                <h2 className="browse-header__title">
                  {language === 'Telugu'
                    ? PANELS.find(p => p.cat === activeCategory)?.labelTe
                    : PANELS.find(p => p.cat === activeCategory)?.labelEn}
                </h2>
              </div>
              {activeCategory === 'article' && (
                <div
                  className="article-topic-pills"
                  role="tablist"
                  aria-label={language === 'Telugu' ? 'వ్యాసాల అంశాలు' : 'Article topics'}
                >
                  {articleTopics.map((topic) => {
                    const isActive = activeArticleTopic === topic
                    return (
                      <button
                        key={topic}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`article-topic-pill${isActive ? ' article-topic-pill--active' : ''}`}
                        onClick={() => setActiveArticleTopic(topic)}
                      >
                        {topic}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {filteredWorks.length > 0 ? (
              <div className="works-grid">
                {filteredWorks.map(work => {
                  const version = work.versions[language]
                  if (!version) return null
                  const coverSrc = work.covers?.[language]
                  const articleFrameImage = coverSrc ?? '/images/categories/articles-bg.webp'
                  const storyFrameImage = coverSrc ?? '/images/categories/stories-bg.webp'
                  const novelFrameImage = coverSrc ?? '/images/categories/novels-bg.webp'
                  const isFramedCard = work.category === 'article' || work.category === 'story' || work.category === 'novel'
                  return (
                    <button
                      key={work.id}
                      type="button"
                      className={`work-card work-card--${work.category}`}
                      onClick={() => selectWork(work.id)}
                    >
                      <div className="work-card__cover">
                        {work.category === 'article' ? (
                          <img
                            src={articleFrameImage}
                            alt={version.title}
                            className="work-card__img"
                          />
                        ) : work.category === 'story' ? (
                          <img
                            src={storyFrameImage}
                            alt={version.title}
                            className="work-card__img"
                          />
                        ) : work.category === 'novel' ? (
                          <img
                            src={novelFrameImage}
                            alt={version.title}
                            className="work-card__img"
                          />
                        ) : coverSrc ? (
                          <img
                            src={coverSrc}
                            alt={version.title}
                            className="work-card__img"
                          />
                        ) : (
                          <CoverArt work={work} language={language} />
                        )}
                        {isFramedCard && (
                          <h3 className="work-card__frame-title">{version.title}</h3>
                        )}
                      </div>
                      {isFramedCard ? (
                        <div
                          className="work-card__info work-card__info--tags"
                          aria-label={
                            work.category === 'story'
                              ? 'Story tags'
                              : work.category === 'novel'
                                ? 'Novel tags'
                                : 'Article tags'
                          }
                        >
                          {work.tags.map((tag) => (
                            <span key={tag} className="work-card__tag">{tag}</span>
                          ))}
                        </div>
                      ) : (
                        <div className="work-card__info">
                          <span className="work-card__cat">
                            {getCategoryLabel(work, language)}
                          </span>
                          <h3 className="work-card__title">{version.title}</h3>
                          <p className="work-card__summary">{version.summary}</p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <EmptyState language={language} />
            )}
          </section>
        )}

        {/* ── Full-page reading view ── */}
        {isReading && activeWork && (
          <div className="reading-wrapper" key={activeWork.id}>
            <Spotlight
              work={activeWork}
              language={language}
              body={getContent(activeWork.category, activeWork.id, language)}
              prevWork={prevWork}
              nextWork={nextWork}
              onSelect={selectWork}
            />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer__brand">
          <span className="brand__telugu footer__site-name">నక్షత్రపథం</span>
          {/* <p>Anonymous for now. Built for Telugu, English,<br />and the worlds between.</p> */}
          <p className="footer__attribution">
            <a
              href="https://www.vecteezy.com/free-vector/star"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star Vectors by Vecteezy
            </a>
          </p>
        </div>
        <a
          href={isReading ? undefined : '#top'}
          className="footer__top-link"
          onClick={isReading ? () => setSearchParams({}) : undefined}
        >
          {isReading
            ? (language === 'Telugu' ? '← షెల్ఫ్‌కు' : '← Back to shelf')
            : (language === 'Telugu' ? '↑ పైకి' : '↑ Back to top')}
        </a>
      </footer>
    </div>
  )
}

export default App
