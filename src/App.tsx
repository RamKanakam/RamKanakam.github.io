import { useMemo, useState } from 'react'
import './App.css'

type Language = 'Telugu' | 'English' | 'Bilingual'
type WorkType = 'Short story' | 'Novel' | 'Article'
type Status = 'Read now' | 'Coming soon' | 'On Internet Archive'
type LanguageFilter = 'All' | 'Telugu' | 'English'

type Work = {
  title: string
  type: WorkType
  language: Language
  status: Status
  description: string
  href: string
  cta: string
  tags: string[]
  featured?: boolean
}

const languageFilters: LanguageFilter[] = ['All', 'Telugu', 'English']

const works: Work[] = [
  {
    title: 'The Blue Courtyard',
    type: 'Short story',
    language: 'English',
    status: 'Coming soon',
    description:
      'A quiet mystery about an old house, a single evening, and a visitor who recognizes a room they have never entered.',
    href: '#',
    cta: 'Story coming soon',
    tags: ['Quiet mystery', 'Standalone'],
    featured: true,
  },
  {
    title: 'నదికి అవతల ఊరు',
    type: 'Short story',
    language: 'Telugu',
    status: 'Coming soon',
    description:
      'ఒకే నది చుట్టూ తిరిగే కథల శ్రేణి. ప్రతి కథ ఒంటరిగా నిలబడుతుంది, కానీ పేర్లు, ప్రదేశాలు మళ్లీ కనిపిస్తాయి.',
    href: '#',
    cta: 'త్వరలో',
    tags: ['జానపద స్వరం', 'Shared world'],
  },
  {
    title: 'Archive of Rain',
    type: 'Short story',
    language: 'English',
    status: 'Coming soon',
    description:
      'A speculative companion story from a river-bound world, told through records no one remembers writing.',
    href: '#',
    cta: 'Story coming soon',
    tags: ['Speculative', 'Shared world'],
  },
  {
    title: 'Novel project one',
    type: 'Novel',
    language: 'Bilingual',
    status: 'On Internet Archive',
    description:
      'A future home for a full-length novel. Add the Internet Archive link here once the PDF, EPUB, and cover art are ready.',
    href: '#',
    cta: 'Archive link pending',
    tags: ['PDF / EPUB', 'Cover art'],
  },
  {
    title: 'Collected stories',
    type: 'Novel',
    language: 'Telugu',
    status: 'On Internet Archive',
    description:
      'A cover-forward catalogue entry for longer Telugu work, collections, or serialized fiction hosted outside this site.',
    href: '#',
    cta: 'Archive link pending',
    tags: ['Telugu', 'Archive'],
  },
  {
    title: 'Between two languages',
    type: 'Article',
    language: 'English',
    status: 'Coming soon',
    description:
      'Notes on writing across Telugu and English without forcing every thought to wear the same shape.',
    href: '#',
    cta: 'Essay coming soon',
    tags: ['Language', 'Craft'],
  },
  {
    title: 'చదివిన వెంటనే మిగిలిన వెలుగు',
    type: 'Article',
    language: 'Telugu',
    status: 'Coming soon',
    description:
      'పుస్తకం ముగిసిన తర్వాత మనతో నడిచే వాక్యాలు, జ్ఞాపకాలు, చిన్న చర్చల కోసం.',
    href: '#',
    cta: 'త్వరలో',
    tags: ['Reading', 'Notes'],
  },
]

function includesLanguage(work: Work, filter: LanguageFilter) {
  return filter === 'All' || work.language === filter || work.language === 'Bilingual'
}

function isLive(work: Work) {
  return work.href !== '#'
}

function WorkCard({ work, compact = false }: { work: Work; compact?: boolean }) {
  const content = (
    <>
      <div className="work-card__topline">
        <span>{work.type}</span>
        <span>{work.language}</span>
        <span>{work.status}</span>
      </div>
      <h3>{work.title}</h3>
      <p>{work.description}</p>
      <div className="tag-row" aria-label="Tags">
        {work.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <span className="text-link">{work.cta}</span>
    </>
  )

  if (!isLive(work)) {
    return <article className={`work-card ${compact ? 'work-card--compact' : ''}`}>{content}</article>
  }

  return (
    <a className={`work-card ${compact ? 'work-card--compact' : ''}`} href={work.href}>
      {content}
    </a>
  )
}

function App() {
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('All')

  const visibleWorks = useMemo(
    () => works.filter((work) => includesLanguage(work, languageFilter)),
    [languageFilter],
  )

  const featuredWork = works.find((work) => work.featured) ?? works[0]
  const latestWorks = visibleWorks.slice(0, 4)
  const shortStories = visibleWorks.filter((work) => work.type === 'Short story')
  const novels = visibleWorks.filter((work) => work.type === 'Novel')
  const articles = visibleWorks.filter((work) => work.type === 'Article')

  return (
    <div className="site-shell" id="top">
      <header className="hero">
        <nav className="topbar" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Nakshatra Patham home">
            <span className="brand__telugu">నక్షత్రపథం</span>
            <span className="brand__english">Nakshatra Patham</span>
          </a>
          <div className="nav-links">
            <a href="#stories">Stories</a>
            <a href="#novels">Novels</a>
            <a href="#articles">Articles</a>
            <a href="#about">About</a>
          </div>
        </nav>

        <section className="hero-grid" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Telugu & English writing</p>
            <h1 id="hero-title">A quiet path for stories, novels, and essays.</h1>
            <p className="intro">
              Read short fiction and articles directly here. Full-length novels live on Internet
              Archive, with cover art, summaries, and reading links collected in one calm place.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#stories">
                Start with stories
              </a>
              <a className="button button--secondary" href="#novels">
                Browse novels
              </a>
            </div>
          </div>

          <aside className="featured-card" aria-label="Featured work">
            <p className="panel-label">Featured</p>
            <WorkCard work={featuredWork} compact />
          </aside>
        </section>
      </header>

      <main>
        <section className="section section--latest" aria-labelledby="latest-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Latest</p>
              <h2 id="latest-title">Start reading here.</h2>
              <p>
                A small front shelf for new pieces, upcoming translations, and long-form work that
                points to Internet Archive.
              </p>
            </div>
            <div className="segmented" aria-label="Filter by language">
              {languageFilters.map((filter) => (
                <button
                  className={languageFilter === filter ? 'active' : ''}
                  key={filter}
                  onClick={() => setLanguageFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="latest-grid">
            {latestWorks.map((work) => (
              <WorkCard key={`${work.type}-${work.title}`} work={work} />
            ))}
          </div>
        </section>

        <section className="section section--stories" id="stories" aria-labelledby="stories-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Short stories</p>
              <h2 id="stories-title">Standalone pieces and connected worlds.</h2>
            </div>
          </div>
          <div className="work-grid work-grid--three">
            {shortStories.map((work) => (
              <WorkCard key={work.title} work={work} />
            ))}
          </div>
        </section>

        <section className="section" id="novels" aria-labelledby="novels-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Novels</p>
              <h2 id="novels-title">Cover art, summaries, and archive links.</h2>
              <p>
                These cards are designed for Internet Archive entries: add a cover image later, then
                replace the pending link with the public archive URL.
              </p>
            </div>
          </div>
          <div className="novel-grid">
            {novels.map((work) => (
              <WorkCard key={work.title} work={work} />
            ))}
          </div>
        </section>

        <section className="section section--articles" id="articles" aria-labelledby="articles-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Articles</p>
              <h2 id="articles-title">Essays, notes, and reading trails.</h2>
            </div>
          </div>
          <div className="article-list">
            {articles.map((work) => (
              <WorkCard key={work.title} work={work} compact />
            ))}
          </div>
        </section>

        <section className="section about-panel" id="about" aria-labelledby="about-title">
          <p className="section-kicker">About this site</p>
          <h2 id="about-title">A bilingual literary archive for quiet reading.</h2>
          <p>
            Nakshatra Patham is arranged for Telugu and English readers. Short stories and articles
            can be published directly on the site, while novels can be displayed here as visual
            entries that lead readers to Internet Archive.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>Nakshatra Patham · నక్షత్రపథం</p>
        <a href="#top">Back to top</a>
      </footer>
    </div>
  )
}

export default App
