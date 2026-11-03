// Makes smaller copies of the large project images in public/img.
// Run after replacing one of them; src/data/site.ts lists the widths in its srcset helpers.
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = new URL('../public/img/', import.meta.url);
const SETS = [
  [/^(reel-[a-z]+|work-[a-z]+-screens)\.webp$/, [640, 960, 1280]],
  [/^work-[a-z]+-tall\.webp$/, [500]],
];

for (const file of await readdir(DIR)) {
  const widths = SETS.find(([pattern]) => pattern.test(file))?.[1] ?? [];
  for (const width of widths) {
    const out = new URL(file.replace('.webp', `-${width}.webp`), DIR);
    await sharp(fileURLToPath(new URL(file, DIR))).resize({ width }).webp({ quality: 78 }).toFile(fileURLToPath(out));
    console.log(fileURLToPath(out).split('/').pop());
  }
}
