import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards, Keyboard, Mousewheel, Pagination, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation'
import './App.css'

import type { Category, Language, SortDirection } from './types'
import { works } from './data/works'
import { hasLanguage, sortByDate, nextLanguage, getContent } from './utils/content'
import { FilterTray } from './components/FilterTray'
import { CoverArt } from './components/CoverArt'
import { EmptyState } from './components/EmptyState'
import { Spotlight } from './components/Spotlight'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeWorkId = searchParams.get('work')
  const isReading = activeWorkId !== null

  const [language, setLanguage] = useState<Language>('English')
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [sortDirection, setSortDirection] = useState<SortDirection>('newest')
  const [swiperReady, setSwiperReady] = useState(false)
  const swiperRef = useRef<SwiperClass | null>(null)

  const filteredWorks = useMemo(() => {
    return works
      .filter((work) => hasLanguage(work, language))
      .filter((work) => activeCategory === 'all' || work.category === activeCategory)
      .sort(sortByDate(sortDirection))
  }, [activeCategory, language, sortDirection])

  // When reading and the active work drops out of the filtered list, fall back to the middle work.
  useEffect(() => {
    if (!isReading) return
    if (filteredWorks.some((w) => w.id === activeWorkId)) return
    const fallback = filteredWorks[Math.floor(filteredWorks.length / 2)]?.id ?? null
    if (fallback) setSearchParams({ work: fallback }, { replace: true })
    else setSearchParams({}, { replace: true })
  }, [filteredWorks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync Swiper position whenever the active work, list, or swiper initialisation changes.
  useEffect(() => {
    const sw = swiperRef.current
    if (!sw || !swiperReady || filteredWorks.length === 0) return
    const idx = filteredWorks.findIndex((w) => w.id === activeWorkId)
    if (idx !== -1 && sw.realIndex !== idx) sw.slideTo(idx, swiperReady ? 900 : 0)
  }, [activeWorkId, filteredWorks, swiperReady])

  const activeIndex = Math.max(0, filteredWorks.findIndex((w) => w.id === activeWorkId))
  const activeWork = filteredWorks[activeIndex] ?? null

  function selectIndex(index: number) {
    const newId = filteredWorks[index]?.id ?? null
    if (!newId || (newId === activeWorkId && isReading)) return
    swiperRef.current?.slideTo(index)
    setSearchParams({ work: newId })
  }

  function moveSlide(step: number) {
    if (step > 0) swiperRef.current?.slideNext()
    else swiperRef.current?.slidePrev()
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
        {/* ── Carousel shelf ── always in DOM; shrinks to top strip when reading */}
        <section
          className={`carousel-section${isReading ? ' carousel-section--mini' : ''}`}
          aria-labelledby="carousel-title"
        >
          {/* Filter bar: above carousel always */}
          <FilterTray
            activeCategory={activeCategory}
            sortDirection={sortDirection}
            onCategoryChange={setActiveCategory}
            onSortToggle={() => setSortDirection((d) => (d === 'newest' ? 'oldest' : 'newest'))}
          />

          {!isReading && (
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
          )}

          <div className="carousel-shell">
            {activeWork ? (
              <>
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow--left"
                  aria-label="Previous work"
                  onClick={(e) => { e.stopPropagation(); moveSlide(-1) }}
                >
                  ‹
                </button>
                <Swiper
                  modules={[EffectCards, Keyboard, Mousewheel, Pagination, FreeMode]}
                  effect="cards"
                  cardsEffect={{
                    rotate: false,
                    perSlideRotate: 2,
                    slideShadows: false
                  }}
                  slidesPerView={1}
                  centeredSlides={true}
                  grabCursor={true}
                  slideToClickedSlide={true}
                  loop={false}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  keyboard={{ enabled: true, onlyInViewport: true }}
                  mousewheel={{ forceToAxis: true, sensitivity: 0.7 }}
                  speed={600}
                  onSwiper={(sw) => { swiperRef.current = sw; setSwiperReady(true) }}
                  onSlideChange={(sw) => {
                    if (!isReading) return
                    const newId = filteredWorks[sw.realIndex]?.id ?? null
                    if (newId) setSearchParams({ work: newId }, { replace: true })
                  }}
                  className="coverflow-stage"
                  aria-label="Latest works carousel"
                >
                {filteredWorks.map((work, index) => {
                  const version = work.versions[language]
                  if (!version) return null
                  return (
                    <SwiperSlide key={work.id}>
                      {({ isActive }) => (
                        <button
                          type="button"
                          className="polaroid-slide"
                          aria-current={isActive ? 'true' : undefined}
                          aria-label={`Show ${version.title}`}
                          onClick={(e) => { e.stopPropagation(); selectIndex(index) }}
                        >
                          <CoverArt work={work} language={language} isActive={isActive} />
                        </button>
                      )}
                    </SwiperSlide>
                  )
                })}
              </Swiper>
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow--right"
                  aria-label="Next work"
                  onClick={(e) => { e.stopPropagation(); moveSlide(1) }}
                >
                  ›
                </button>
              </>
            ) : (
              <EmptyState language={language} />
            )}
          </div>
        </section>

        {/* ── Content panel ── slides in when reading */}
        {isReading && activeWork && (
          <section
            className="content-section"
            key={activeWork.id}
            aria-label="Selected work"
          >
            <button
              className="content-close"
              aria-label="Back to shelf"
              onClick={() => setSearchParams({})}
              type="button"
            >
              ← {language === 'Telugu' ? 'తిరిగి' : 'Back to shelf'}
            </button>
            <Spotlight work={activeWork} language={language} body={getContent(activeWork.category, activeWork.id, language)} />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Anonymous for now. Built for Telugu, English, and the worlds between.</p>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  )
}

export default App
