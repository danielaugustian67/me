// All site content lives here: edit it and the pages update on their own.

const img = (name: string) => `/img/${name}.webp`;

/** Months worked, counting both the first and the last month ('2024-08' to '2024-12' is 5). No end means up to now. */
const monthsBetween = (from: string, to?: string) => {
  const [fy, fm] = from.split('-').map(Number);
  const now = new Date();
  const [ty, tm] = to ? to.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  return (ty - fy) * 12 + (tm - fm) + 1;
};
// Every stat needs the same number of digits, because the rolling digit columns are shared.
const pad = (n: number) => String(n).padStart(2, '0');

export const site = {
  brand: 'danielaugustian',
  mark: '',
  title: 'danielaugustian — Portfolio',
  description: 'Daniel Augustian, a developer from Jakarta building web apps, automation, and everything in between.',
  intro:
    '— a developer who likes building things people actually enjoy using. Web apps, automation, and everything in between, from Jakarta.',
  email: 'danielgirsang67@gmail.com',
  location: 'Jakarta, Indonesia',
  city: 'JAKARTA, ID',
  timeZone: 'Asia/Jakarta',
  // Set to a form endpoint (e.g. Formspree) to post messages; empty opens the visitor's mail app.
  formEndpoint: '',
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  socials: [{ label: 'GitHub', href: 'https://github.com/danielaugustian67' }],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
  ],
  newsletterNote: 'Occasional notes on design, code, and the craft in between — only when there is something worth sharing.',
};

export const home = {
  heroImages: ['hero-1', 'hero-2', 'hero-3', 'portrait'].map(img),
  statement: 'I turn rough ideas into things that actually work, and make sure they feel good to use.',
  approach: [
    'Most of my projects start with a small, annoying problem. Forgetting a daily attendance form, wanting a photobooth without renting one, or wishing there was a proper app for the street cats near my place. I build the smallest version that works, use it myself, and let real use decide what comes next.',
    "I work across the whole stack, so nothing gets lost between design and code. On Meowshot I built the Go backend, the mobile app, and the server it runs on. And because I also write test automation for a banking app, I care about the part most people skip: making sure it still works next month.",
  ],
  reelText: 'Made to Move.',
  reel: [
    { src: img('reel-nihondex'), alt: 'Nihondex, an app for learning Japanese and Korean' },
    { src: img('reel-meowshot'), alt: 'Meowshot, an app for collecting street cats on a map' },
    { src: img('reel-camora'), alt: 'Camora, a photobooth that runs in the browser' },
  ],
  servicesTitle: 'Services',
  servicesNote: 'Need something built, or something that already exists to stop breaking? Here is what I usually help with.',
  services: [
    {
      text: 'I build web apps that feel smooth and fun to use, from interactive camera tools to motion-heavy sites that still load fast.',
      tags: ['Web Apps', 'Front-end Development', 'React & TypeScript', 'Motion & Interaction', 'Responsive Layouts'],
    },
    {
      text: 'I build mobile apps for iOS and Android, including offline-first apps that keep working without a signal.',
      tags: ['React Native', 'Flutter', 'Offline-first', 'Mobile UI', 'App Release'],
    },
    {
      text: "I build the part people don't see: APIs, databases, and the servers they run on, set up so they stay up.",
      tags: ['Go APIs', 'PostgreSQL', 'Docker', 'VPS & Deployment', 'Auth & Storage'],
    },
    {
      text: 'I automate the boring and the risky: repetitive daily tasks, and test suites that catch bugs before your users do.',
      tags: ['Test Automation', 'Mobile QA', 'Katalon & Appium', 'Bots & Scripts', 'AI Integration'],
    },
  ],
  numbersNote: 'Where I have worked and learned so far, counted in months. Most recent first.',
  stats: [
    {
      value: pad(monthsBetween('2026-10')),
      title: 'Months at\nBank Mandiri',
      logo: { src: '/img/logos/mandiri.webp', alt: 'Bank Mandiri' },
      text: 'Software Automation Test at PT Bank Mandiri Indonesia. October 2026 to present. Building automated tests for the mobile banking app, so every release is checked before it reaches customers.',
      cta: { label: 'About Me', href: '/about' },
      image: img('stat-yellow'),
    },
    {
      value: pad(monthsBetween('2026-08', '2026-10')),
      title: 'Months at\nSiaga Abdi Utama',
      logo: { src: '/img/logos/siaga.webp', alt: 'PT Siaga Abdi Utama' },
      text: 'IT Quality Assurance at PT Siaga Abdi Utama. August 2026 to October 2026. Testing features end to end and reporting bugs clearly enough that they got fixed the first time.',
      cta: { label: 'See the Work', href: '/work' },
      image: img('stat-blue'),
    },
    {
      value: pad(monthsBetween('2026-01', '2026-03')),
      title: 'Months Learning\nGo Backend',
      logo: { src: '/img/logos/code-id.webp', alt: 'Code Development Indonesia' },
      text: 'Golang Backend Development at PT Code Development Indonesia. January 2026 to March 2026. A learning program on building APIs in Go, which later became the backend behind Meowshot.',
      cta: { label: 'See the Work', href: '/work' },
      image: img('stat-red'),
    },
    {
      value: pad(monthsBetween('2024-08', '2024-12')),
      title: 'Months at\nTelkom Indonesia',
      logo: { src: '/img/logos/telkom.webp', alt: 'Telkom Indonesia' },
      text: 'Software Engineer at PT Telkom Indonesia. August 2024 to December 2024. Building and shipping features as part of a product team.',
      cta: { label: 'About Me', href: '/about' },
      image: img('stat-red'),
    },
    {
      value: pad(monthsBetween('2024-06', '2024-08')),
      title: 'Months at\nSangkuriang',
      logo: { src: '/img/logos/sangkuriang.webp', alt: 'Sangkuriang Internasional' },
      text: 'System Analyst at PT Sangkuriang Internasional. June 2024 to August 2024. Turning business needs into clear requirements and system flows the developers could build from.',
      cta: { label: "Let's Talk", href: '/contact' },
      image: img('stat-gray'),
    },
  ],
  aboutTitle: 'About Me',
  aboutText:
    "I'm Daniel, a developer from Jakarta. By day I write automated tests for Bank Mandiri's mobile banking app. Outside of that I build my own apps, like Nihondex for learning Japanese and Korean, and Meowshot for collecting street cats on a map.",
  processTitle: 'Process',
  processNote: 'How a typical project moves from first call to launch.',
  processWeeks: 11,
  process: [
    { title: 'Discover', from: 0, to: 3, text: 'Listening first: goals, audience, and constraints, so the problem is clear before anything is designed.' },
    { title: 'Define', from: 2, to: 6, text: 'Turning insight into direction: the concept, the structure, and the creative approach for the work.' },
    { title: 'Design & Build', from: 4, to: 9.5, text: 'Ideas take shape: visual identity, interaction, prototypes, and production-ready code.' },
    { title: 'Launch & Care', from: 8, to: 11, text: 'Shipping is the beginning: testing, refining, and supporting the work as it grows.' },
  ],
  quotesTitle: 'Kind Words',
  quote: 'Return to your rest, my soul. For the LORD has been good for you.',
  contactNote: 'Have a project in mind? I am currently open to new work.',
};

export const contactForm = {
  budgets: ['$1,000 - $3,000', '$3,000 - $6,000', '$6,000 +'],
  timeframes: ['As soon as possible', 'Next month', 'Whenever you’re available'],
};

export const projects = [
  {
    slug: 'nihondex',
    name: 'Nihondex',
    year: "'26",
    tall: img('work-nihondex-tall'),
    wide: img('reel-nihondex'),
    summary:
      'An app for learning Japanese and Korean, with an offline dictionary, daily lessons, and spaced repetition. Built with Flutter for phones and the web.',
    scope: 'Flutter, SQLite, Supabase, Python data pipeline.',
    challenge:
      'A learning app is no use if it stops working when the signal drops. Search had to stay fast with no connection, and progress still had to follow you between devices.',
    statement: 'Once you are signed in, it works with no signal at all.',
    approach: [
      'A Python pipeline builds the dictionary from JMdict and KanjiVG into SQLite, which ships with the app. Search runs on the device, including romaji typed straight into kana.',
      'Lessons run from the first kana up to JLPT N1, with SM-2 scheduling the reviews, stroke order practice, and small games along the way. Supabase handles accounts and sync.',
    ],
    gallery: [img('work-nihondex-screens'), img('reel-nihondex')],
    results: [
      { value: '7,748', label: 'Words sorted by JLPT level' },
      { value: 'N5–N1', label: 'Levels covered' },
      { value: '4', label: 'Kana practice games' },
      { value: '2', label: 'Languages to learn' },
    ],
    credits: 'Design and code by danielaugustian.',
  },
  {
    slug: 'meowshot',
    name: 'Meowshot',
    year: "'26",
    tall: img('work-meowshot-tall'),
    wide: img('reel-meowshot'),
    summary:
      'Instagram meets Pokédex, for street cats. Photograph the cats you meet, keep each one in a cute frame, and see them all on one map.',
    scope: 'React Native, Expo, Go, PostgreSQL, Docker, VPS deployment.',
    challenge:
      'Photos come off a phone with metadata attached, and an app built around location has to handle that with care. It also had to reach both Android and iPhone without going through an app store.',
    statement: 'Every alley has its cat.',
    approach: [
      'The Go API removes EXIF data from each upload, converts it to WebP with a thumbnail, and keeps photos in a private bucket behind short-lived signed URLs. Accounts use email and password or Google Sign-In.',
      'The mobile app is React Native with Expo, and the backend runs in Docker on a VPS. Android users install an APK, and iPhone users add the web app to their Home Screen from Safari.',
    ],
    gallery: [img('work-meowshot-screens'), img('reel-meowshot')],
    credits: 'Design and code by danielaugustian.',
    liveUrl: 'https://web.meowshot.studiodesign.live',
  },
  {
    slug: 'camora',
    name: 'Camora',
    year: "'26",
    tall: img('work-camora-tall'),
    wide: img('reel-camora'),
    summary:
      'A photobooth that runs in the browser on phones and laptops. Pick a frame, set your look, strike a pose, and take the photo strip home.',
    scope: 'React, TypeScript, MediaPipe, Canvas.',
    challenge:
      'I wanted a photobooth without renting one, and without anyone having to sign up or send their face to a server. Virtual backgrounds and face tracking usually lean on one.',
    statement: 'Your photos never leave your device.',
    approach: [
      'Every frame goes through one pipeline on the device: camera, beauty, background, color grade, then accessories that follow your face. The MediaPipe runtime and models ship with the app.',
      'Frames are plain data, so adding a theme takes one line. Layouts cover strips, grids, and polaroids, and the stickers are drawn in code.',
    ],
    gallery: [img('work-camora-screens'), img('reel-camora')],
    results: [{ value: '45+', label: 'Frame themes' }],
    credits: 'Design and code by danielaugustian.',
  },
];

export const about = {
  heading: ['Hi, I am', 'danielaugustian'],
  intro: [
    "I'm Daniel, a developer from Jakarta who works across the whole stack: mobile apps, web apps, Go backends, and the servers they run on.",
    "I started in system analysis at Sangkuriang, moved to software engineering at Telkom Indonesia, then QA at Siaga Abdi Utama. Today I work on test automation for Bank Mandiri's mobile banking app, and build my own apps on the side.",
  ],
  statement: 'I like knowing how the whole thing fits together: the screen, the server behind it, and the test that catches it when it breaks.',
  principlesTitle: 'Principles.',
  principlesNote: 'If these feel right to you, let’s build something together.',
  principles: [
    'Start small. Build the smallest version that works, use it, and let real use decide what comes next.',
    'Own the whole thing. Nothing gets lost between design and code when one person follows it all the way through.',
    'Test it like it matters. Working today is easy. The hard part is making sure it still works next month.',
    'Make it feel good. People notice when something is smooth to use, even if they can’t say why.',
  ],
};
