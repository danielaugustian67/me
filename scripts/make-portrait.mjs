// Turns a photo on a plain black background into the portrait cards.
// Usage: node scripts/make-portrait.mjs <photo>
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../public/img/', import.meta.url));
const CARD = { width: 900, height: 1200 };
const PERSON_HEIGHT = 1170; // Taller than the card: the photo runs off the bottom like a portrait crop. // How much of the card the person fills.
const PERSON_TOP = 150;
const BLUR = 1.4; // Softens the photo so it reads like part of the card.
const TILT = -4; // Degrees, lines the body up with the card's long edge.
const OPACITY = 0.85; // 1 keeps the photo's own pixels; lower values fade the person into the card.
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
for (let pass = 0; pass < 4; pass++) {
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
const soft = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).blur(2.2).extractChannel(0).raw().toBuffer();
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
  .toBuffer()
  // sharp runs rotate() before resize() inside one pipeline, so rotate in a second pass.
  .then(buf => sharp(buf).rotate(TILT, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer())
  .then(async buf => {
    // Crop to what fits on the card, centred horizontally.
    const m = await sharp(buf).metadata();
    const w = Math.min(m.width, CARD.width);
    return sharp(buf).extract({ left: Math.round((m.width - w) / 2), top: 0, width: w, height: Math.min(m.height, CARD.height - PERSON_TOP) }).blur(BLUR).png().toBuffer();
  });
const { width: personW } = await sharp(person).metadata();

// Card background: diagonal base, a warm light from the top left, and a soft shade at the bottom right.
const gradient = (from, to) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.width}" height="${CARD.height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>
        <radialGradient id="light" cx="0.18" cy="0.1" r="0.75"><stop offset="0" stop-color="#fff8ec" stop-opacity="0.7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <radialGradient id="shade" cx="1" cy="1" r="0.95"><stop offset="0" stop-color="${to}" stop-opacity="1"/><stop offset="0.35" stop-color="${to}" stop-opacity="0.8"/><stop offset="1" stop-color="${to}" stop-opacity="0"/></radialGradient>
        <radialGradient id="deep" cx="0.05" cy="0.95" r="0.6"><stop offset="0" stop-color="#3a2a14" stop-opacity="0.35"/><stop offset="1" stop-color="#3a2a14" stop-opacity="0"/></radialGradient>
        <radialGradient id="glow" cx="0.85" cy="0.3" r="0.45"><stop offset="0" stop-color="${from}" stop-opacity="0.9"/><stop offset="1" stop-color="${from}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <rect width="100%" height="100%" fill="url(#light)"/>
      <rect width="100%" height="100%" fill="url(#shade)"/>
      <rect width="100%" height="100%" fill="url(#deep)"/>
    </svg>`,
  );

// Soft shadow from the cut-out shape, so the person sits on the card instead of floating.
const { data: personPx, info } = await sharp(person).raw().toBuffer({ resolveWithObject: true });
const shadowPx = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < info.width * info.height; i++) shadowPx[i * 4 + 3] = personPx[i * 4 + 3] * 0.28;
const shadow = await sharp(
  await sharp(shadowPx, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extend({ top: 22, left: 14, bottom: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .blur(18)
    .png()
    .toBuffer(),
)
  .extract({ left: 0, top: 0, width: info.width, height: info.height })
  .png()
  .toBuffer();
const left = Math.round((CARD.width - personW) / 2);

for (const [name, from, to] of cards) {
  await sharp(gradient(from, to))
    .composite([
      { input: shadow, left, top: PERSON_TOP },
      { input: person, left, top: PERSON_TOP },
    ])
    .webp({ quality: 82 })
    .toFile(`${OUT}${name}.webp`);
}
console.log('Portrait cards written to public/img');
