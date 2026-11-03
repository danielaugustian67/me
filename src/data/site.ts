// All site content lives here. Everything below is placeholder text:
// replace it with real content and the pages update on their own.

const img = (name: string) => `/img/${name}.webp`;

export const site = {
  brand: 'YourName',
  mark: '®',
  years: '© 2018-26',
  title: 'YourName — Portfolio',
  description: 'Placeholder portfolio: independent designer and developer building brands and digital experiences.',
  intro:
    '— an independent designer and developer crafting brands and digital products through motion, clarity, and careful detail. Working remotely with teams around the world.',
  email: 'hello@example.com',
  phone: '+00 000 000 000',
  address: ['Your Street 00', '00000 Your City', 'Your Country'],
  city: 'JAKARTA, ID',
  timeZone: 'Asia/Jakarta',
  // Set to a form endpoint (e.g. Formspree) to post messages; empty opens the visitor's mail app.
  formEndpoint: '',
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Notes', href: '/notes' },
    { label: 'Contact', href: '/contact' },
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
  ],
  newsletterNote: 'Occasional notes on design, code, and the craft in between — only when there is something worth sharing.',
};

export const home = {
  heroImages: ['hero-1', 'hero-2', 'hero-3', 'hero-4'].map(img),
  statement: 'I bring ideas and design together, turning rough thinking into clarity and detail into something people remember.',
  approach: [
    'This is a placeholder for how you work. Describe your process in a few honest sentences: how a project starts, who you talk to, and how decisions get made along the way.',
    'Use this second paragraph for what makes working with you different. Keep it short and specific. Real examples beat big adjectives, and one clear idea beats five vague ones.',
  ],
  reelText: 'Made to Move.',
  reel: ['reel-1', 'reel-2', 'reel-3'].map(img),
  servicesTitle: 'Services',
  servicesNote: 'Looking for a partner who cares about the details? Here is what I usually help with.',
  services: [
    {
      text: 'I build identity systems that give products a clear voice — considered visuals, tidy structure, and work that ages well.',
      tags: ['Brand Direction', 'Identity Systems', 'Logo Design', 'Type & Color', 'Brand Guidelines'],
    },
    {
      text: 'I design and build expressive digital experiences with strong art direction and smooth interaction on every screen.',
      tags: ['Web Design', 'Front-end Development', 'Motion Design', 'Design Systems', 'Responsive Layouts'],
    },
    {
      text: 'I take ideas from first sketch to launch, keeping the visuals and the story consistent at every touchpoint.',
      tags: ['Art Direction', 'Campaign Ideas', 'Photo & Video Direction', 'Storytelling', 'Style Frames'],
    },
    {
      text: 'I help teams decide with confidence by sharpening positioning and laying groundwork they can keep building on.',
      tags: ['Positioning', 'Audience Research', 'Naming & Messaging', 'UX Audits', 'Roadmaps'],
    },
  ],
  numbersNote: 'A quick look at the milestones behind the work so far.',
  stats: [
    {
      value: '25',
      title: 'Projects\nShipped',
      text: 'Placeholder for what this number means. Every project here started with a real problem and ended with something people could actually use.',
      cta: { label: 'See the Work', href: '/work' },
      image: img('stat-1'),
    },
    {
      value: '42',
      title: 'Happy\nClients',
      text: 'Placeholder for your client story. Long collaborations built on trust, open conversation, and a shared interest in getting the details right.',
      cta: { label: 'About Me', href: '/about' },
      image: img('stat-2'),
    },
    {
      value: '83',
      title: 'Ideas\nExplored',
      text: 'Placeholder for your experiments. Side projects, prototypes, and studies that keep the practice curious and feed the work that follows.',
      cta: { label: 'Read Notes', href: '/notes' },
      image: img('stat-3'),
    },
  ],
  recognitionNote: 'A few moments when the work was noticed by others.',
  recognition: [
    { name: 'Award Name', detail: 'Brand Design', count: 'x3' },
    { name: 'Design Festival', detail: 'Visual Identity', count: 'x1' },
    { name: 'Creative Annual', detail: 'Typography', count: 'x2' },
    { name: 'Web Awards', detail: 'Digital Design', count: 'x3' },
    { name: 'Type Society', detail: 'Type Excellence', count: 'x1' },
    { name: 'Dev Showcase', detail: 'Site of the Day', count: 'x2' },
    { name: 'Motion Awards', detail: 'Honorable Mention', count: 'x3' },
    { name: 'Portfolio Prize', detail: 'Site of the Month', count: 'x1' },
  ],
  aboutTitle: 'About Me',
  aboutText:
    'Placeholder bio. Say who you are, where you come from, and why you do this work. What started as curiosity has grown into a practice built on structure, imagination, and care for every project.',
  aboutImages: [
    { src: img('about-1'), label: 'Your Name', role: 'Designer' },
    { src: img('about-2'), label: 'Your Name', role: 'Developer' },
  ],
  partnersTitle: 'Selected Clients',
  partnersNote: 'Some of the teams I have had the chance to work with.',
  partners: ['Northwind', 'Lumen', 'Atlas', 'Orbit', 'Halo', 'Prisma', 'Vertex', 'Solis', 'Kite', 'Quartz', 'Nova', 'Delta'],
  fullImage: img('full'),
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
  quotesNote: 'What people say after working together.',
  quotes: [
    { text: 'Placeholder testimonial. They understood our goals quickly and shaped a visual language that feels natural to us.', name: 'Client Name', company: 'Company One' },
    { text: 'Placeholder testimonial. A level of clarity we had been missing for years, delivered with a calm and honest process.', name: 'Client Name', company: 'Company Two' },
    { text: 'Placeholder testimonial. Strong ideas, precise execution, and communication that made everything feel easy.', name: 'Client Name', company: 'Company Three' },
    { text: 'Placeholder testimonial. They listened, asked the right questions, and delivered a system that still works today.', name: 'Client Name', company: 'Company Four' },
    { text: 'Placeholder testimonial. The result speaks for itself, and our team still enjoys working with what was built.', name: 'Client Name', company: 'Company Five' },
  ],
  pricingNote: 'Pick a plan that fits your pace and your goals. Every engagement starts with a short, free intro call.',
  yearlyDiscount: '–20%',
  plans: [
    {
      name: 'Starter',
      text: 'For new products that need a clear visual foundation.',
      features: ['Intro session', 'Brand direction', 'Logo design', 'Visual system', 'Color & type', 'Basic guidelines'],
      monthly: 2000,
      yearly: 1600,
    },
    {
      name: 'Studio',
      text: 'For websites, platforms, and digital-first products.',
      features: ['UX & sitemap', 'UI design', 'Component system', 'Responsive layouts', 'Motion direction'],
      monthly: 3500,
      yearly: 2800,
    },
    {
      name: 'Signature',
      text: 'For teams that want everything aligned, from identity to code.',
      features: ['Brand identity', 'Design & build', 'Visual language', 'Motion direction', 'Guidelines'],
      monthly: 5000,
      yearly: 4000,
    },
  ],
  notesTitle: 'Notes',
  notesNote: 'Thoughts on how brands, systems, and stories find their form.',
  contactNote: 'Have a project in mind? I am currently open to new work.',
  faqTitle: 'Questions, answered.',
  faqNote: 'A few things people usually ask before we start.',
  faq: [
    {
      q: 'How do you start\na new project?',
      a: 'Placeholder answer. Most projects begin with a short call about your goals and expectations. From there I outline the direction, the deliverables, and a realistic timeline.',
    },
    {
      q: 'Can you help with\nstrategy, not just design?',
      a: 'Placeholder answer. Yes. Before designing anything I help define the message, the audience, and the positioning, because that foundation shapes every decision after it.',
    },
    {
      q: 'How long does a\ntypical project take?',
      a: 'Placeholder answer. A small website or refresh takes around 4–6 weeks. Larger projects usually need 8–12 weeks. We plan it together so the deadline works for both sides.',
    },
    {
      q: 'What if I don’t know\nexactly what I need?',
      a: 'Placeholder answer. That is completely fine. A short discovery session helps clarify the goal and work out what would make the biggest difference.',
    },
  ],
  faqCta: 'Still have questions? Let’s talk about your project and how I can help.',
};

export const contactForm = {
  budgets: ['$1,000 - $3,000', '$3,000 - $6,000', '$6,000 +'],
  timeframes: ['As soon as possible', 'Next month', 'Whenever you’re available'],
};

const projectNames = [
  'Project One', 'Project Two', 'Project Three', 'Project Four', 'Project Five', 'Project Six',
  'Project Seven', 'Project Eight', 'Project Nine', 'Project Ten', 'Project Eleven', 'Project Twelve',
];

export const projects = projectNames.map((name, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    year: `'${25 - (i % 3)}`,
    image: img(`work-${n}`),
    landscape: i % 3 === 1,
    summary:
      'Placeholder project summary. Say what the project was, who it was for, and the one idea that shaped it, in two or three short sentences.',
    scope: 'Brand Identity, Visual Language, Web Design, Front-end Development.',
    challenge:
      'Placeholder for the challenge. Explain what made this project difficult, which needs were pulling against each other, and what mattered most.',
    statement: 'The goal was simple: make something that feels clear, works everywhere, and still holds up years from now.',
    approach: [
      'Placeholder for the approach. Walk through how you explored the problem, what you tried, and why the final direction won.',
      'Placeholder for the execution. Mention the tools, the collaboration, and any detail you are particularly proud of.',
    ],
    gallery: [img('work-detail-1'), img('work-detail-2')],
    results: [
      { value: '+62%', label: 'Placeholder metric one' },
      { value: '+40%', label: 'Placeholder metric two' },
      { value: '+78%', label: 'Placeholder metric three' },
      { value: '+16%', label: 'Placeholder metric four' },
    ],
    credits: 'Your Name (Design & Code), Collaborator Name (Copywriting), Collaborator Name (Photography).',
    liveUrl: 'https://example.com',
  };
});

const noteTitles = [
  ['Notes on Clarity', 'April 26, 2026'],
  ['Precise, Not Perfect', 'March 20, 2026'],
  ['Shapes That Speak', 'February 4, 2026'],
  ['Systems With Feeling', 'December 21, 2025'],
];

export const notes = noteTitles.map(([title, date], i) => ({
  slug: title.toLowerCase().replace(/[^a-z]+/g, '-'),
  title,
  date,
  image: img(`note-${i + 1}`),
  excerpt: 'Placeholder excerpt. One or two sentences that make someone want to read the rest of this note.',
  body: [
    'Placeholder article. Open with the observation or question that made you want to write this note in the first place, then explain why it matters for the work.',
    'Use the middle to develop the idea. A concrete example from a project usually says more than a general rule, so show what you tried and what you learned from it.',
    'Close with what you would do differently next time, or the one thing you hope the reader takes away.',
  ],
}));

export const about = {
  heading: ['Hi, I am', 'Your Name'],
  intro: [
    'This is a placeholder introduction. Describe your practice in a few sentences: what you make, how you think, and who you enjoy working with. Keep it human and specific.',
    'Use this second paragraph for the bigger picture: what you want the work to do, and how you show up for the people you work with, long after launch.',
  ],
  statement: 'I connect the missing pieces — strategy, design, and code — into one continuous system, so nothing feels scattered or out of place.',
  gallery: [
    { src: img('gallery-1'), name: 'Design', role: 'Identity & interface' },
    { src: img('gallery-2'), name: 'Code', role: 'Front-end & motion' },
    { src: img('gallery-3'), name: 'Direction', role: 'Art & storytelling' },
    { src: img('gallery-4'), name: 'Research', role: 'Audience & context' },
    { src: img('gallery-5'), name: 'Writing', role: 'Notes & messaging' },
    { src: img('gallery-6'), name: 'Teaching', role: 'Talks & workshops' },
  ],
  principlesTitle: 'Principles.',
  principlesNote: 'If these feel right to you, let’s build something together.',
  principles: [
    'Remove the unnecessary and focus on what moves the work forward. Simple beats complicated every time.',
    'Say what you mean. Honest conversations early save weeks of polishing the wrong thing later.',
    'Sweat the details people feel but rarely notice: spacing, timing, and how things move.',
    'Build things that last. Good work keeps making sense long after the launch.',
  ],
  wideImages: [img('studio-1'), img('studio-2')],
};
