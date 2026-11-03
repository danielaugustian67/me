// Generates the abstract placeholder images in public/img.
// Replace those files (or the paths in src/data/site.ts) with real photos later.
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = new URL('../public/img/', import.meta.url);
await mkdir(OUT, { recursive: true });

const palettes = {
  orange: ['#f08a24', '#ffb347', '#c7420f', '#ffe0a8'],
  yellow: ['#f3c623', '#ffe97a', '#d28f00', '#fff6c9'],
  black: ['#0b0b0d', '#2a211c', '#6b4a35', '#0b0b0d'],
  pink: ['#f6c6d0', '#ffe4ea', '#e58aa5', '#fff5f6'],
  lilac: ['#8f8ad6', '#c9c6f2', '#4f4aa6', '#efeeff'],
  blue: ['#2d8cf0', '#7cc4ff', '#0f4fb0', '#dff1ff'],
  green: ['#1f8a5b', '#5fd39a', '#0b4d33', '#c9f5df'],
  coral: ['#ff5a5f', '#ff9a8b', '#b3202a', '#ffd9d2'],
  steel: ['#5b6b78', '#a9b8c4', '#26323c', '#e6edf2'],
  sand: ['#cbb9a4', '#ece2d6', '#8c7762', '#f7f2ec'],
  ink: ['#14161c', '#3a4150', '#8a93a6', '#14161c'],
};

const rand = (seed) => {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

function art({ w, h, palette, seed }) {
  const [base, a, b, c] = palettes[palette];
  const r = rand(seed * 7919 + 13);
  const blob = (fill, size, opacity) =>
    `<ellipse cx="${r() * w}" cy="${r() * h}" rx="${(0.25 + r() * size) * w}" ry="${(0.2 + r() * size) * h}" fill="${fill}" opacity="${opacity}" transform="rotate(${r() * 90 - 45} ${w / 2} ${h / 2})"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${Math.round(w / 14)}"/></filter>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer></filter>
      <filter id="warp"><feTurbulence type="turbulence" baseFrequency="${0.002 + r() * 0.003}" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${w / 5}"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="${base}"/>
    <g filter="url(#soft)">${blob(a, 0.35, 0.95)}${blob(b, 0.3, 0.9)}${blob(c, 0.2, 0.75)}</g>
    <g filter="url(#warp)" opacity="0.55">
      <circle cx="${w * (0.3 + r() * 0.4)}" cy="${h * (0.3 + r() * 0.4)}" r="${Math.min(w, h) * (0.18 + r() * 0.16)}" fill="${c}"/>
      <rect x="${w * r() * 0.5}" y="${h * r() * 0.6}" width="${w * 0.5}" height="${h * 0.12}" fill="${b}" transform="rotate(${r() * 60 - 30} ${w / 2} ${h / 2})"/>
    </g>
    <rect width="100%" height="100%" filter="url(#grain)"/>
  </svg>`;
}

const PORTRAIT = [760, 1014];
const LANDSCAPE = [1000, 750];
const WIDE = [1920, 1200];

const images = [
  // hero stack
  ...['black', 'sand', 'yellow', 'steel', 'orange'].map((palette, i) => [`hero-${i + 1}`, PORTRAIT, palette]),
  // reel frames
  ['reel-1', WIDE, 'lilac'],
  ['reel-2', WIDE, 'ink'],
  ['reel-3', WIDE, 'pink'],
  // masked numbers
  ['stat-1', WIDE, 'steel'],
  ['stat-2', WIDE, 'orange'],
  ['stat-3', WIDE, 'blue'],
  // about
  ['about-1', PORTRAIT, 'ink'],
  ['about-2', PORTRAIT, 'sand'],
  ['full', [2200, 1400], 'steel'],
  // projects
  ...['yellow', 'black', 'blue', 'green', 'coral', 'lilac', 'pink', 'orange', 'ink', 'steel', 'sand', 'blue'].map(
    (palette, i) => [`work-${String(i + 1).padStart(2, '0')}`, i % 3 === 1 ? LANDSCAPE : PORTRAIT, palette],
  ),
  ['work-detail-1', WIDE, 'lilac'],
  ['work-detail-2', WIDE, 'coral'],
  ['work-detail-3', PORTRAIT, 'green'],
  // notes
  ...['sand', 'ink', 'steel', 'pink'].map((palette, i) => [`note-${i + 1}`, PORTRAIT, palette]),
  // about page
  ...['steel', 'sand', 'ink', 'pink', 'blue', 'green'].map((palette, i) => [`gallery-${i + 1}`, PORTRAIT, palette]),
  ['studio-1', WIDE, 'sand'],
  ['studio-2', PORTRAIT, 'steel'],
  ['og', [1200, 630], 'ink'],
];

await Promise.all(
  images.map(([name, [w, h], palette], i) =>
    sharp(Buffer.from(art({ w, h, palette, seed: i + 3 })))
      .webp({ quality: 74 })
      .toFile(fileURLToPath(new URL(`${name}.webp`, OUT))),
  ),
);

console.log(`Generated ${images.length} placeholders in public/img`);
