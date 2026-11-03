import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initForms } from './forms';
import { initPan } from './pan';

gsap.registerPlugin(ScrollTrigger);

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPhone = () => matchMedia('(max-width: 809px)').matches;
const EASE = 'expo.out';
// Not `once: true`: a trigger that kills itself while being created breaks ScrollTrigger
// when the page loads already scrolled past it (reloads, back navigation).
const PLAY_ONCE = { toggleActions: 'play none none none' };

function initLenis() {
  if (reduced || document.documentElement.dataset.lenis === 'off') return null;
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Shrinks one-line display text so long names fit; short names keep the design's maximum size. */
function fitText() {
  for (const el of $$('[data-fit]')) {
    const box = el.parentElement!;
    const target = box.clientWidth * Number(el.dataset.fit);
    el.style.fontSize = '100px';
    el.style.display = 'inline-block';
    const size = (100 * target) / el.getBoundingClientRect().width;
    el.style.display = '';
    el.style.fontSize = `${Math.min(size, innerWidth * 0.1667)}px`;
  }
}

/** The hero intro starts right after the fixed logo, whatever the name's length. */
function alignIntro() {
  const intro = document.querySelector<HTMLElement>('.hero__intro');
  const logo = document.querySelector<HTMLElement>('.chrome__logo');
  if (intro && logo) intro.style.textIndent = `${logo.offsetWidth + 12}px`;
}

function splitWords(el: HTMLElement, wrap: (word: string) => HTMLElement) {
  const nodes = [...el.childNodes];
  el.textContent = '';
  const out: HTMLElement[] = [];
  for (const node of nodes) {
    if (node.nodeType !== Node.TEXT_NODE) {
      el.append(node);
      continue;
    }
    for (const part of (node.textContent ?? '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        el.append(part.includes('\n') ? document.createElement('br') : ' ');
        continue;
      }
      const span = wrap(part);
      el.append(span);
      out.push(span);
    }
  }
  return out;
}

const maskedWord = (word: string) => {
  const outer = document.createElement('span');
  outer.className = 'w';
  const inner = document.createElement('span');
  inner.className = 'w__i';
  inner.textContent = word;
  outer.append(inner);
  return outer;
};

function initReveals() {
  if (reduced) return;
  for (const el of $$('[data-words]')) {
    const words = splitWords(el, maskedWord).map((w) => w.firstElementChild);
    gsap.from(words, {
      yPercent: 115,
      duration: 1.1,
      ease: EASE,
      stagger: Math.min(0.03, 0.5 / words.length),
      scrollTrigger: { trigger: el, start: 'top 88%', ...PLAY_ONCE },
    });
  }
  for (const el of $$('[data-fade]')) {
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 1,
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 92%', ...PLAY_ONCE },
    });
  }
  for (const list of $$('[data-stagger]')) {
    gsap.from(list.children, {
      y: 22,
      autoAlpha: 0,
      duration: 0.9,
      ease: EASE,
      stagger: 0.05,
      scrollTrigger: { trigger: list, start: 'top 90%', ...PLAY_ONCE },
    });
  }
  for (const el of $$('[data-clip]')) {
    const inner = el.querySelector('img,video');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', ...PLAY_ONCE } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' });
    if (inner) tl.from(inner, { scale: 1.25, duration: 1.6, ease: EASE }, 0);
  }
  for (const frame of $$('[data-parallax]')) {
    const inner = frame.querySelector('img,video');
    if (!inner) continue;
    gsap.fromTo(
      inner,
      { yPercent: -7 },
      { yPercent: 0, ease: 'none', scrollTrigger: { trigger: frame, scrub: true, start: 'top bottom', end: 'bottom top' } },
    );
  }
}

function initHero() {
  const stack = document.querySelector<HTMLElement>('.hero__stack');
  if (!stack) return;
  const images = $$('.hero__img', stack);
  const rotations = [-20, 14, -9, 7, -4];
  images.forEach((img, i) => gsap.set(img, { rotate: rotations[i % rotations.length] }));
  if (reduced) {
    gsap.set(images, { autoAlpha: 1 });
    return;
  }
  const letters = splitWords(document.querySelector<HTMLElement>('.hero__word')!, maskedWord);
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.fromTo(
    images,
    { autoAlpha: 0, y: '55vh', rotate: 0, scale: 0.85 },
    { autoAlpha: 1, y: 0, rotate: (i) => rotations[i % rotations.length], scale: 1, duration: 1.4, stagger: 0.17 },
    0.1,
  );
  tl.from(letters.map((w) => w.firstElementChild), { yPercent: 110, duration: 1.3 }, 0.25);
  tl.from('.hero__intro, .hero__years', { autoAlpha: 0, y: 14, duration: 1 }, 0.5);

  if (isPhone()) return;
  gsap.to(stack, {
    y: '-62vh',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__intro', {
    autoAlpha: 0,
    y: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '30% top', scrub: true },
  });
}

/** Words start scattered across the screen and settle into the sentence on scroll. */
function initScatter() {
  // Seeded so the layout is identical on every visit.
  let seed = 42;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const section of $$('[data-scatter]')) {
    const text = section.querySelector<HTMLElement>('.scatter__text')!;
    if (reduced) {
      section.style.height = 'auto';
      continue;
    }
    const words = splitWords(text, (word) => {
      const s = document.createElement('span');
      s.className = 'sw';
      s.textContent = word;
      return s;
    });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    });
    words.forEach((w) => {
      tl.from(
        w,
        {
          x: `${(rand() - 0.5) * 110}vw`,
          y: `${(rand() - 0.25) * 130}vh`,
          ease: 'power2.out',
          duration: 0.5 + rand() * 0.25,
        },
        0,
      );
    });
    tl.to({}, { duration: 0.22 });
  }
}

function initMarquees() {
  const scroll = { v: 0 };
  ScrollTrigger.create({ onUpdate: (self) => (scroll.v = self.getVelocity()) });
  for (const el of $$('[data-marquee]')) {
    const dir = Number(el.dataset.marquee || 1);
    el.innerHTML = el.innerHTML.repeat(6);
    if (reduced) continue;
    let x = 0;
    gsap.ticker.add((_t, delta) => {
      const unit = el.scrollWidth / 6;
      if (!unit) return;
      const boost = gsap.utils.clamp(0, 6, Math.abs(scroll.v) / 700);
      x -= dir * (0.055 + boost * 0.16) * delta;
      x = gsap.utils.wrap(-unit, 0, x);
      el.style.transform = `translate3d(${x}px,0,0)`;
    });
  }
  gsap.ticker.add(() => (scroll.v *= 0.94));
}

/** Odometer columns that roll between each stat as its panel scrolls in. */
function initNumbers() {
  const root = document.querySelector<HTMLElement>('[data-numbers]');
  if (!root) return;
  const blocks = $$('.digits', root);
  const stage = $$('.numbers__stage .digits__col', root);
  const solos = $$('.digits--solo', root);
  const panels = $$('.numbers__panel', root);
  const FILL = 3;

  const layoutImages = () => {
    for (const digits of blocks) {
      const box = digits.getBoundingClientRect();
      for (const col of $$('.digits__col', digits)) {
        const offset = col.getBoundingClientRect().left - box.left;
        for (const n of $$('.digits__n', col)) {
          n.style.backgroundSize = `${box.width}px auto`;
          n.style.backgroundPosition = `${-offset}px 50%`;
        }
      }
    }
  };
  layoutImages();
  ScrollTrigger.addEventListener('refresh', layoutImages);

  if (reduced) {
    $$('.digits__col', root).forEach((col) => gsap.set(col.firstElementChild, { yPercent: (-100 * FILL) / Number(col.dataset.count) }));
    return;
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 810px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 60%', end: 'bottom bottom', scrub: 0.5 },
    });
    stage.forEach((col, c) => {
      const roll = col.firstElementChild!;
      const count = Number(col.dataset.count);
      const stop = (i: number) => (-100 * (FILL + i * (FILL + 1))) / count;
      const offset = c * 0.04;
      gsap.set(roll, { yPercent: 0 });
      tl.to(roll, { yPercent: stop(0), duration: 1, ease: 'power2.out' }, offset);
      panels.slice(1).forEach((_, i) => {
        tl.to(roll, { yPercent: stop(i + 1), duration: 1, ease: 'power2.inOut' }, 1.5 + i * 1.8 + offset);
      });
    });
    tl.to({}, { duration: 0.6 });

    gsap.from(root.querySelectorAll('.numbers__panel > :not(.digits--solo)'), {
      autoAlpha: 0,
      y: 24,
      duration: 0.8,
      ease: EASE,
      stagger: 0.05,
      scrollTrigger: { trigger: root, start: 'top 55%', ...PLAY_ONCE },
    });
  });

  mm.add('(max-width: 809px)', () => {
    for (const solo of solos) {
      $$('.digits__col', solo).forEach((col, c) => {
        gsap.fromTo(
          col.firstElementChild,
          { yPercent: 0 },
          {
            yPercent: (-100 * FILL) / Number(col.dataset.count),
            ease: 'power2.out',
            scrollTrigger: { trigger: solo, start: 'top 100%', end: `top ${50 - c * 6}%`, scrub: 0.5 },
          },
        );
      });
    }
    for (const panel of panels) {
      gsap.from(panel.querySelectorAll(':scope > :not(.digits--solo)'), {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: EASE,
        stagger: 0.05,
        scrollTrigger: { trigger: panel, start: 'top 45%', ...PLAY_ONCE },
      });
    }
  });
}

function initPartners() {
  const title = document.querySelector('.partners__title');
  if (!title || reduced) return;
  gsap.to(title, {
    opacity: 0.05,
    ease: 'none',
    scrollTrigger: { trigger: '.partners__grid', start: 'top 80%', end: 'top 25%', scrub: true },
  });
}

function initFullImage() {
  const frame = document.querySelector('.fullimg__frame');
  if (!frame || reduced) return;
  gsap.from(frame, {
    scale: 0.82,
    ease: 'none',
    scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 15%', scrub: true },
  });
  gsap.fromTo(
    frame.querySelector('img'),
    { scale: 1.2 },
    { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
  );
}

function initProcess() {
  const gantt = document.querySelector('.gantt');
  if (!gantt || reduced) return;
  const bars = $$('.gantt__bar', gantt);
  gsap.fromTo(
    bars,
    { scaleX: 0 },
    {
      scaleX: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: gantt, start: 'top 85%', end: 'bottom 55%', scrub: 0.6 },
    },
  );
}

function initQuotes() {
  const root = document.querySelector<HTMLElement>('[data-quotes]');
  if (!root) return;
  const quotes = $$('.quote', root);
  const counter = root.querySelector('.quotes__n')!;
  quotes.forEach((q) => {
    const text = q.querySelector<HTMLElement>('.quote__text')!;
    if (!reduced) splitWords(text, maskedWord);
  });
  let index = 0;
  const show = (next: number, first = false) => {
    quotes[index].classList.remove('is-active');
    index = (next + quotes.length) % quotes.length;
    const q = quotes[index];
    q.classList.add('is-active');
    counter.textContent = `/${index + 1}`;
    if (reduced || first) return;
    gsap.fromTo(q.querySelectorAll('.w__i'), { yPercent: 115 }, { yPercent: 0, duration: 0.95, ease: EASE, stagger: 0.012, overwrite: true });
    gsap.fromTo(q.querySelector('.quote__who'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.25, ease: EASE });
  };
  show(0, true);
  root.querySelector('[data-prev]')!.addEventListener('click', () => show(index - 1));
  root.querySelector('[data-next]')!.addEventListener('click', () => show(index + 1));
  if (!reduced) {
    let seen = false;
    ScrollTrigger.create({
      trigger: root,
      start: 'top 75%',
      onEnter: () => {
        if (!seen) show(index);
        seen = true;
      },
    });
  }
}

function initPricing() {
  const root = document.querySelector<HTMLElement>('[data-pricing]');
  if (!root) return;
  const buttons = $$<HTMLButtonElement>('[data-period]', root);
  const amounts = $$('.plan__amount', root);
  const set = (period: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.period === period)));
    root.classList.toggle('is-monthly', period === 'monthly');
    amounts.forEach((a) => {
      a.textContent = `$${Number(a.dataset[period]).toLocaleString('en-US')}`;
      if (!reduced) gsap.fromTo(a, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE });
    });
  };
  buttons.forEach((b) => b.addEventListener('click', () => set(b.dataset.period!)));
}

function initFaq() {
  for (const item of $$('.faq__item')) {
    const btn = item.querySelector('button')!;
    const panel = item.querySelector<HTMLElement>('.faq__a')!;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      gsap.to(panel, {
        height: open ? 'auto' : 0,
        duration: reduced ? 0 : 0.7,
        ease: 'expo.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  }
}

function initSlits() {
  for (const el of $$('[data-slits]')) {
    if (reduced) {
      el.style.setProperty('--slit', '26');
      continue;
    }
    gsap.fromTo(
      el,
      { '--slit': 2 },
      {
        '--slit': 26,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.4 },
      },
    );
  }
}

function initClock() {
  for (const el of $$('[data-clock]')) {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz });
    const tick = () => (el.textContent = fmt.format(new Date()));
    tick();
    setInterval(tick, 15000);
  }
}

function initMenu(lenis: Lenis | null) {
  const btn = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !menu) return;
  const set = (open: boolean) => {
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
    if (open) lenis?.stop();
    else lenis?.start();
  };
  btn.addEventListener('click', () => set(!menu.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
}

fitText();
alignIntro();
const lenis = initLenis();
initClock();
initMenu(lenis);
initForms();
initHero();
initScatter();
initMarquees();
initReveals();
initNumbers();
initPartners();
initFullImage();
initProcess();
initQuotes();
initPricing();
initFaq();
initSlits();
initPan();

document.fonts?.ready.then(() => {
  fitText();
  alignIntro();
  ScrollTrigger.refresh();
});

let resizeTimer = 0;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    fitText();
    alignIntro();
    ScrollTrigger.refresh();
  }, 150);
});
