// News-image entry (Node 22, standard library only): writes the image beside this
// file to /output/entry.png. The image is a fixed 1024x1024 PNG summing up the
// world news of Wednesday 18 November 2026, composed before submission; the
// program only copies its bytes, so both grader runs write identical output.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576;
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIG = Buffer.from([0xff, 0xd8, 0xff]);

const here = dirname(fileURLToPath(import.meta.url));
const bytes = readFileSync(join(here, 'entry.png'));

if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (!bytes.subarray(0, 8).equals(PNG_SIG) && !bytes.subarray(0, 3).equals(JPEG_SIG)) {
  throw new Error('entry.png is neither a PNG nor a JPEG');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.png');
writeFileSync(outPath, bytes);
// Read it back: both grader runs must produce byte-identical output, and a
// partial write must fail loudly instead of shipping a corrupt image.
const written = readFileSync(outPath);
if (written.length !== bytes.length || !written.equals(bytes)) {
  throw new Error('entry.png was not written back byte-for-byte');
}
console.log(`wrote entry.png (${bytes.length} bytes)`);
