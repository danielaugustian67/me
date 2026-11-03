// Turns a photo on a plain black background into the portrait cards.
// Usage: node scripts/make-portrait.mjs <photo>
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../public/img/', import.meta.url));
const CARD = { width: 900, height: 1200 };
const PERSON_HEIGHT = 900; // How much of the card the person fills.
const PERSON_TOP = 190;
const OPACITY = 0.5; // How much of the person shows through; the rest is card color.
const BLACK = 16; // Background pixels are at most this bright.

const cards = [
  ['portrait', '#ddcfb6', '#c2b091'],
  ['portrait-about', '#7d8fa0', '#566675'],
];

const source = process.argv[2];
if (!source) throw new Error('Pass the path of the photo.');

const { width: srcW, height: srcH } = await sharp(source).metadata();
const W = srcW * 2;
const H = srcH * 2;
const rgb = await sharp(source).resize(W, H, { kernel: 'lanczos3' }).removeAlpha().raw().toBuffer();

// Flood fill from the edges, so dark hair and bags inside the person survive.
const isBg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const i = stack.pop();
  if (isBg[i] || Math.max(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]) > BLACK) continue;
  isBg[i] = 1;
  const x = i % W;
  if (x > 0) stack.push(i - 1);
  if (x < W - 1) stack.push(i + 1);
  if (i >= W) stack.push(i - W);
  if (i < W * (H - 1)) stack.push(i + W);
}

// Eat into the edge to lose the dark fringe left by the old background.
for (let pass = 0; pass < 5; pass++) {
  const next = isBg.slice();
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      if (!isBg[i] && (isBg[i - 1] || isBg[i + 1] || isBg[i - W] || isBg[i + W])) next[i] = 1;
    }
  }
  isBg.set(next);
}

// Keep the largest shape only, which drops stray specks.
const label = new Int32Array(W * H);
let keep = 0;
let keepSize = 0;
let id = 0;
for (let start = 0; start < W * H; start++) {
  if (isBg[start] || label[start]) continue;
  id++;
  let size = 0;
  label[start] = id;
  stack.push(start);
  while (stack.length) {
    const i = stack.pop();
    size++;
    const x = i % W;
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i >= W ? i - W : -1, i < W * (H - 1) ? i + W : -1]) {
      if (j >= 0 && !isBg[j] && !label[j]) {
        label[j] = id;
        stack.push(j);
      }
    }
  }
  if (size > keepSize) {
    keepSize = size;
    keep = id;
  }
}

// Find where the person actually ends, then feather the edge and fade the whole person.
let bottom = 0;
for (let i = 0; i < W * H; i++) if (label[i] === keep) bottom = Math.floor(i / W);
const mask = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) mask[i] = label[i] === keep ? 255 : 0;
const soft = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).blur(5).extractChannel(0).raw().toBuffer();
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  rgba[i * 4] = rgb[i * 3];
  rgba[i * 4 + 1] = rgb[i * 3 + 1];
  rgba[i * 4 + 2] = rgb[i * 3 + 2];
  rgba[i * 4 + 3] = soft[i] * OPACITY;
}

const person = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .resize({ height: Math.round((PERSON_HEIGHT * H) / bottom) })
  .png()
  .toBuffer();
const { width: personW } = await sharp(person).metadata();

const gradient = (from, to) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.width}" height="${CARD.height}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  );

for (const [name, from, to] of cards) {
  await sharp(gradient(from, to))
    .composite([{ input: person, left: Math.round((CARD.width - personW) / 2), top: PERSON_TOP }])
    .webp({ quality: 82 })
    .toFile(`${OUT}${name}.webp`);
}
console.log('Portrait cards written to public/img');
