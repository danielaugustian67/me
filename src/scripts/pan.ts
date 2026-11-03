import gsap from 'gsap';

type Placed = { el: HTMLElement; x: number; y: number; w: number; h: number };
type Layout = { items: Placed[]; worldW: number; worldH: number };

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scattered tiles on a wrapping world, so the gallery never runs out in any direction. */
function layoutWork(root: HTMLElement): Layout {
  const els = [...root.querySelectorAll<HTMLElement>('.pan__item')];
  const phone = innerWidth < 810;
  const cols = phone ? 3 : 4;
  const scale = phone ? 0.56 : Math.min(1, innerWidth / 1440);
  const cellW = phone ? 300 : 620 * scale;
  const cellH = phone ? 340 : 620 * scale;
  const rows = Math.ceil(els.length / cols);
  // Fixed offsets keep the arrangement stable between visits and resizes.
  const items = els.map((el, i) => {
    const landscape = el.dataset.landscape === 'true';
    const w = (landscape ? 500 : 380) * scale;
    const h = (landscape ? 375 : 507) * scale;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = ((i * 137) % 100) / 100;
    const jy = ((i * 251) % 100) / 100;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    return { el, w, h, x: col * cellW + jx * Math.max(0, cellW - w), y: row * cellH + jy * Math.max(0, cellH - h) };
  });
  return { items, worldW: cols * cellW, worldH: rows * cellH };
}

export function initPan() {
  const root = document.querySelector<HTMLElement>('[data-pan]');
  if (!root) return;
  let layout = layoutWork(root);

  let x = 0;
  let y = 0;
  let tx = -layout.worldW * 0.08;
  let ty = -layout.worldH * 0.04;
  x = tx;
  y = ty;

  const render = () => {
    const vw = innerWidth;
    const vh = innerHeight;
    for (const it of layout.items) {
      let px = it.x;
      if (layout.worldW) px = gsap.utils.wrap(-it.w - 80, layout.worldW - it.w - 80, it.x + x);
      const py = gsap.utils.wrap(-it.h - 80, layout.worldH - it.h - 80, it.y + y);
      it.el.style.transform = `translate3d(${px}px,${py}px,0)`;
      it.el.style.visibility = px > vw + 40 || py > vh + 40 ? 'hidden' : 'visible';
    }
  };

  gsap.ticker.add(() => {
    const k = reduced ? 1 : 0.1;
    x += (tx - x) * k;
    y += (ty - y) * k;
    render();
  });

  root.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      tx -= e.deltaX;
      ty -= e.deltaY;
    },
    { passive: false },
  );

  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  root.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = 0;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (moved > 4) root.classList.add('is-dragging');
    const speed = e.pointerType === 'touch' ? 1.6 : 1.2;
    tx += dx * speed;
    ty += dy * speed;
  });
  const end = () => {
    dragging = false;
    root.classList.remove('is-dragging');
  };
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);
  // A drag that ends over a tile must not open it.
  root.addEventListener(
    'click',
    (e) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
  root.addEventListener('dragstart', (e) => e.preventDefault());

  // Keep keyboard focus on screen.
  root.addEventListener('focusin', (e) => {
    const item = layout.items.find((it) => it.el === e.target);
    if (!item) return;
    if (layout.worldW) tx = innerWidth / 2 - item.w / 2 - item.x;
    ty = innerHeight / 2 - item.h / 2 - item.y;
  });

  addEventListener('keydown', (e) => {
    const step = 120;
    if (e.key === 'ArrowDown') ty -= step;
    else if (e.key === 'ArrowUp') ty += step;
    else if (e.key === 'ArrowLeft') tx += step;
    else if (e.key === 'ArrowRight') tx -= step;
  });

  addEventListener('resize', () => {
    layout = layoutWork(root);
  });

  render();
  if (!reduced) {
    gsap.from(layout.items.map((it) => it.el.firstElementChild), {
      scale: 0.7,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.04,
      delay: 0.25,
    });
    gsap.from('.pan__title h1', { autoAlpha: 0, y: 40, duration: 1.2, ease: 'expo.out' });
  }
}
