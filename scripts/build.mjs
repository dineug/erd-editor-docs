// Builds the site one locale per process, since the search plugin fixes its index language for
// the whole process (see the note above `searchLanguage` in docusaurus.config.ts).
// The default locale goes first, because its build empties build/, where the others land.
// Pass locale codes to build only those: `pnpm build ko fa`.
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

import { locales } from '../locales.mjs';

// Resolved here so the script also runs outside `pnpm build`, without node_modules/.bin on PATH.
const docusaurus = createRequire(import.meta.url).resolve('@docusaurus/core/bin/docusaurus.mjs');

const DEFAULT_LOCALE = 'en';
const all = locales.map(locale => locale.code);
const asked = process.argv.slice(2);
const unknown = asked.filter(code => !all.includes(code));
if (unknown.length) {
  console.error(`Unknown locale: ${unknown.join(', ')}. Known: ${all.join(', ')}`);
  process.exit(1);
}
const codes = asked.length ? asked : all;
const ordered = [
  ...codes.filter(code => code === DEFAULT_LOCALE),
  ...codes.filter(code => code !== DEFAULT_LOCALE),
];

for (const code of ordered) {
  execFileSync(process.execPath, [docusaurus, 'build', '--locale', code], { stdio: 'inherit' });
}
