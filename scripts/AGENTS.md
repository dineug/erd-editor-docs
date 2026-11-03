# scripts

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

Node scripts that run beside the site, not inside it: the per-locale build runner behind
`pnpm build`, and the Playwright recorder that makes the clips and stills in `static/img/`.
Nothing here is bundled into the site.

## Key Files

| File | Description |
|------|-------------|
| `build.mjs` | `pnpm build` runs it as `node scripts/build.mjs`. It runs `docusaurus build --locale <code>` once per locale, each in its own child process, in sequence. The reason for one process per locale is the comment above `searchLanguage` in `docusaurus.config.ts` (and README, Search index) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `demos/` | The demo recorder: CLI, recorder library, scenes and seeds (see `demos/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- **`build.mjs` CLI.** With no arguments it builds every `code` in `locales.mjs`. With
  arguments it builds only the codes named: `node scripts/build.mjs ko fa`, or
  `pnpm build ko fa`.
  - `en` is moved to the front whenever it is built. The other codes keep their order:
    `locales.mjs` order for a full build (`id`, `de`, `es`, …), argument order otherwise.
  - An unknown code exits 1 before anything builds, and prints the known codes:
    `Unknown locale: xx. Known: id, de, en, …`.
  - Builds use `execFileSync`, so the first failing locale stops the run with a non-zero
    exit, and the locales after it are not built. After a fix, re-run the failed locale
    and the ones after it, not the whole list.
- **Run it from the repo root.** `build.mjs` resolves the Docusaurus binary from its own
  location (`createRequire(import.meta.url)`), so it runs without `node_modules/.bin` on
  `PATH`. It passes no site directory, though, so Docusaurus builds the current working
  directory. `pnpm build` always runs from the root.
- **A subset build without `en` leaves stale output.** Only the `en` build empties `build/`
  (the comment at the top of `build.mjs`). After `pnpm build ko`, the other locales'
  folders in `build/` are whatever an earlier build left there, so `pnpm serve` mixes
  versions.
- **Adding a locale needs no change here.** `build.mjs` reads the list from `locales.mjs`.
- **Change the CLI and the README together.** README, Build and preview, describes the
  same behavior (`pnpm build ko fa`, `en` first), and so does the comment at the top of
  `build.mjs`.

### Testing Requirements

- After editing `build.mjs`, check argument handling without building:
  `node scripts/build.mjs xx` must print `Unknown locale: xx. Known: …` and exit 1.
- Then build one locale for real, as the root's Testing Requirements say:
  `pnpm build en`, or `pnpm build en ko` to check the ordering and the second process.

### Common Patterns

- ES modules (`.mjs`) on Node built-ins and nothing this repo does not already install:
  `build.mjs` needs only `@docusaurus/core`. This repo's `package.json` has no
  Playwright, so the recorder loads it from the erd-editor checkout (see
  `demos/AGENTS.md`).
- Positional arguments, checked before any work starts: `build.mjs` rejects an unknown
  locale code, and `demos/run.mjs` an unknown scene name, before the first build or
  recording.

## Dependencies

### Internal

- `../locales.mjs`: the `locales` export. `build.mjs` uses only each entry's `code`.
- `../docusaurus.config.ts`: reads `DOCUSAURUS_CURRENT_LOCALE`, which Docusaurus sets in
  each child process, to pick the search `language`.

### External

- `@docusaurus/core`: `bin/docusaurus.mjs`, run with the current Node (`process.execPath`).
- Node built-ins `node:child_process` and `node:module`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
