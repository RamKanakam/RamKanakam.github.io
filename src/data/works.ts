import type { Category, Work } from '../types'

export const categoryOptions: Array<{
  value: Category
  icon: string
  label: string
}> = [
  { value: 'all', icon: '✦', label: 'All' },
  { value: 'article', icon: '✍', label: 'Articles' },
  { value: 'story', icon: '☾', label: 'Short stories' },
  { value: 'novel', icon: '▣', label: 'Novels' },
]

export const categoryNames: Record<Exclude<Category, 'all'>, string> = {
  article: 'Article',
  story: 'Short story',
  novel: 'Novel',
}

export const categoryNamesTelugu: Record<Exclude<Category, 'all'>, string> = {
  article: 'వ్యాసం',
  story: 'చిన్న కథ',
  novel: 'నవల',
}

export const works: Work[] = [
  {
    id: 'blue-courtyard',
    category: 'story',
    template: 'story',
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
    template: 'story',
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
    template: 'essay',
    pullQuote: 'Good and bad begin not in the event itself, but in the being to whom the event matters.',
    date: '2026-04-28',
    status: 'Read now',
    href: '#',
    tags: ['Philosophy', 'Rationality'],
    readTime: '5 min read',
    covers: {
      English: '/images/articles/when-nature-doesnt-care/cover.en.webp',
      Telugu: '/images/articles/when-nature-doesnt-care/cover.en.webp',
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
    template: 'essay',
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
    template: 'essay',
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
    template: 'novel',
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
    template: 'story',
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
    template: 'novel',
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
