import { useMemo, useState } from 'react'
import './App.css'

type Language = 'Telugu' | 'English'
type StoryKind = 'Standalone' | 'Shared universe'

type Article = {
  title: string
  language: Language
  date: string
  theme: string
  description: string
  status: 'Drafting' | 'Idea' | 'Published'
}

type Story = {
  title: string
  language: Language
  kind: StoryKind
  universe?: string
  mood: string
  description: string
  status: 'Seed' | 'Drafting' | 'Complete'
}

type BookLink = {
  title: string
  language: Language | 'Bilingual'
  format: string
  description: string
  href: string
  host: string
}

const articles: Article[] = [
  {
    title: 'A notebook for slow thoughts',
    language: 'English',
    date: 'Planned',
    theme: 'Essay',
    description:
      'A reflective space for craft notes, reading trails, and ideas that need a little room before they become essays.',
    status: 'Idea',
  },
  {
    title: 'చదివిన వెంటనే మిగిలిన వెలుగు',
    language: 'Telugu',
    date: 'Planned',
    theme: 'Reading',
    description:
      'పుస్తకం ముగిసిన తర్వాత మనతో నడిచే వాక్యాలు, జ్ఞాపకాలు, చిన్న చర్చల కోసం.',
    status: 'Idea',
  },
  {
    title: 'Between two languages',
    language: 'English',
    date: 'Planned',
    theme: 'Language',
    description:
      'Notes on writing across Telugu and English without forcing every thought to wear the same shape.',
    status: 'Drafting',
  },
]

const stories: Story[] = [
  {
    title: 'The Blue Courtyard',
    language: 'English',
    kind: 'Standalone',
    mood: 'Quiet mystery',
    description:
      'A single evening, an old house, and a visitor who recognizes a room they have never entered.',
    status: 'Seed',
  },
  {
    title: 'నదికి అవతల ఊరు',
    language: 'Telugu',
    kind: 'Shared universe',
    universe: 'River Town Cycle',
    mood: 'Folkloric',
    description:
      'ఒకే నది చుట్టూ తిరిగే కథల శ్రేణి. ప్రతి కథ ఒంటరిగా నిలబడుతుంది, కానీ పేర్లు, ప్రదేశాలు మళ్లీ కనిపిస్తాయి.',
    status: 'Drafting',
  },
  {
    title: 'Archive of Rain',
    language: 'English',
    kind: 'Shared universe',
    universe: 'River Town Cycle',
    mood: 'Speculative',
    description:
      'A companion story from the same river-bound world, told through records no one remembers writing.',
    status: 'Seed',
  },
]

const books: BookLink[] = [
  {
    title: 'Book project one',
    language: 'Bilingual',
    format: 'PDF / ePub',
    description:
      'A future book entry. Replace this with an Internet Archive, publisher, or download page when ready.',
    href: '#',
    host: 'Link pending',
  },
  {
    title: 'Collected stories',
    language: 'Telugu',
    format: 'Archive link',
    description:
      'A shelf for connected story collections once they are uploaded to Internet Archive or another public host.',
    href: '#',
    host: 'Internet Archive later',
  },
]

const languageFilters = ['All', 'Telugu', 'English'] as const
const storyFilters = ['All', 'Standalone', 'Shared universe'] as const

function App() {
  const [articleLanguage, setArticleLanguage] =
    useState<(typeof languageFilters)[number]>('All')
  const [storyKind, setStoryKind] = useState<(typeof storyFilters)[number]>('All')

  const visibleArticles = useMemo(
    () =>
      articleLanguage === 'All'
        ? articles
        : articles.filter((article) => article.language === articleLanguage),
    [articleLanguage],
  )

  const visibleStories = useMemo(
    () =>
      storyKind === 'All'
        ? stories
        : stories.filter((story) => story.kind === storyKind),
    [storyKind],
  )

  return (
    <main className="site-shell">
      <header className="hero" id="top">
        <nav className="topbar" aria-label="Primary navigation">
          <a className="mark" href="#top" aria-label="Home">
            అక్షర
          </a>
          <div className="nav-links">
            <a href="#articles">Articles</a>
            <a href="#stories">Stories</a>
            <a href="#books">Books</a>
          </div>
        </nav>

        <div className="hero-grid">
          <section className="hero-copy" aria-labelledby="site-title">
            <p className="eyebrow">Telugu and English writing</p>
            <h1 id="site-title">A quiet shelf for essays, stories, and books.</h1>
            <p className="intro">
              This site is organized as an anonymous public archive: occasional
              articles, fiction in two languages, connected story worlds, and
              links to book files wherever they eventually live.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#stories">
                Browse stories
              </a>
              <a className="button secondary" href="#articles">
                Read articles
              </a>
            </div>
          </section>

          <aside className="index-panel" aria-label="Site structure">
            <p className="panel-label">Current structure</p>
            <div className="index-row">
              <span>01</span>
              <strong>Articles</strong>
              <small>Telugu / English</small>
            </div>
            <div className="index-row">
              <span>02</span>
              <strong>Short stories</strong>
              <small>Standalone / connected</small>
            </div>
            <div className="index-row">
              <span>03</span>
              <strong>Book links</strong>
              <small>Internet Archive and other hosts</small>
            </div>
          </aside>
        </div>
      </header>

      <section className="section feature-strip" aria-label="Publishing notes">
        <div>
          <span className="section-kicker">Publishing rhythm</span>
          <h2>Built for irregular publishing without looking empty.</h2>
        </div>
        <p>
          Each area can hold drafts, ideas, and finished links, so the site keeps
          its shape even when updates arrive slowly.
        </p>
      </section>

      <section className="section" id="articles">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Articles</span>
            <h2>Essays, notes, and reading trails.</h2>
          </div>
          <div className="segmented" aria-label="Filter articles by language">
            {languageFilters.map((filter) => (
              <button
                className={articleLanguage === filter ? 'active' : ''}
                key={filter}
                onClick={() => setArticleLanguage(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="article-list">
          {visibleArticles.map((article) => (
            <article className="writing-card" key={article.title}>
              <div className="card-meta">
                <span>{article.language}</span>
                <span>{article.theme}</span>
                <span>{article.status}</span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <time>{article.date}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="section story-section" id="stories">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Short stories</span>
            <h2>Standalone pieces and shared worlds.</h2>
          </div>
          <div className="segmented" aria-label="Filter stories by type">
            {storyFilters.map((filter) => (
              <button
                className={storyKind === filter ? 'active' : ''}
                key={filter}
                onClick={() => setStoryKind(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="story-grid">
          {visibleStories.map((story) => (
            <article className="story-card" key={story.title}>
              <div className="story-topline">
                <span>{story.language}</span>
                <span>{story.kind}</span>
              </div>
              <h3>{story.title}</h3>
              {story.universe ? (
                <p className="universe">{story.universe}</p>
              ) : (
                <p className="universe">Single story</p>
              )}
              <p>{story.description}</p>
              <div className="story-footer">
                <span>{story.mood}</span>
                <span>{story.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section books-section" id="books">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Books</span>
            <h2>External links for complete works.</h2>
          </div>
          <p>
            Keep the book files wherever they make sense. This site can act as a
            clean catalogue and point readers to Internet Archive, Gumroad,
            publisher pages, or direct files.
          </p>
        </div>

        <div className="book-shelf">
          {books.map((book) => (
            <a
              className={book.href === '#' ? 'book-card pending' : 'book-card'}
              href={book.href}
              key={book.title}
            >
              <span className="book-spine">{book.language}</span>
              <div>
                <p className="book-host">{book.host}</p>
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                <small>{book.format}</small>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Anonymous for now. Built for Telugu, English, and the worlds between.</p>
        <a href="#top">Back to top</a>
      </footer>
    </main>
  )
}

export default App
