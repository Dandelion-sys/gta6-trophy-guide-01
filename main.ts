// Leonida Ledger hand-in: copies the guide (app/) and its screenshots into the
// output directory, then writes dossier.json for the make.fun judge.
// Run:  MAKEFUN_OUTPUT_DIR=out node main.ts   (defaults to /output)
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function copyTree(source: string, target: string): void {
  mkdirSync(target, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(target, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
    } else if (entry.isFile()) {
      copyFileSync(from, to);
    }
  }
}

function copyIfPresent(folder: string): void {
  const source = join(here, folder);
  if (!existsSync(source)) {
    console.log(`skipping ${folder}/ (not present)`);
    return;
  }
  if (!statSync(source).isDirectory()) {
    throw new Error(`${folder} exists but is not a directory`);
  }
  // Drop any stale copy first: without this, files deleted from the repo
  // would linger in a reused output directory and end up in the dossier.
  const target = join(outDir, folder);
  rmSync(target, { recursive: true, force: true });
  copyTree(source, target);
  console.log(`copied ${folder}/`);
}

mkdirSync(outDir, { recursive: true });
copyIfPresent('app');
copyIfPresent('screenshots');

const dossier = buildDossier(outDir, caps);
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`wrote dossier.json (${dossier.length} bytes) into ${outDir}`);
