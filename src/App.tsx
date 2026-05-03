import './App.css'

const articles = [
  {
    title: 'My First Article',
    date: '2026-05-03',
    description: 'A short introduction to my writing space.',
  },
]

const books = [
  {
    title: 'My First Book',
    description: 'A short description of the book will go here.',
    status: 'Coming soon',
  },
]

function App() {
  return (
    <main className="site">
      <header className="hero">
        <p className="eyebrow">Ram Kanakam</p>
        <h1>Articles, books, and notes</h1>
        <p className="intro">
          I write essays, technical notes, and books. This site collects my
          public writing and future book projects.
        </p>

        <nav className="nav">
          <a href="#articles">Articles</a>
          <a href="#books">Books</a>
          <a href="#newsletter">Newsletter</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section id="articles" className="section">
        <h2>Articles</h2>
        <div className="cards">
          {articles.map((article) => (
            <article className="card" key={article.title}>
              <p className="date">{article.date}</p>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="books" className="section">
        <h2>Books</h2>
        <div className="cards">
          {books.map((book) => (
            <article className="card" key={book.title}>
              <p className="date">{book.status}</p>
              <h3>{book.title}</h3>
              <p>{book.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="newsletter" className="section">
        <h2>Newsletter</h2>
        <p>
          I will add a newsletter signup form here later using Buttondown.
        </p>
      </section>

      <section id="about" className="section">
        <h2>About</h2>
        <p>
          I am Ram Kanakam. This website is my public home for articles,
          books, and experiments.
        </p>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Ram Kanakam. All rights reserved.
      </footer>
    </main>
  )
}

export default App