# src

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

The only React code on the site: the landing page at `/` (and `/<locale>/`), its three feature
cards, and the global stylesheet. Every documentation page comes from `docs/` through the
classic theme. Nothing here renders docs.

## Key Files

| File | Description |
|------|-------------|
| `pages/index.tsx` | Landing page: the hero (site title, translated tagline, `static/img/erd-editor-vscode.png` screenshot at 1279×881), the "Editing Guide — 5 min ⏱️" button to `/docs/category/guides`, and `<HomepageFeatures />`. It also sets the page's `<title>` and meta description |
| `pages/index.module.css` | Hero banner, screenshot and button layout |
| `components/HomepageFeatures/index.tsx` | The three cards: Easy to Use, Editing Experience, Portability |
| `components/HomepageFeatures/styles.module.css` | Card section and title styles |
| `css/custom.css` | Global Infima overrides (the template's green primary palette in light and dark) and the `header-github-link` navbar icon used by `docusaurus.config.ts` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `pages/` | Routes from files. It can't hold an AGENTS.md: the pages plugin would publish a `.md` file there as a page |
| `components/` | `HomepageFeatures/`, used only by `pages/index.tsx` |
| `css/` | `custom.css`, loaded as the theme's `customCss` |

## For AI Agents

### Working In This Directory

- Every user-visible string goes through `translate({ id, message, description })` or
  `<Translate id=…>`, with a `homepage.*` id. The tagline is a string of its own because
  `siteConfig.tagline` can't be translated through `code.json`, as the comment in
  `index.tsx` says.
- When you add or rename a string id, run `pnpm write-translations --locale <code>` for all
  24 non-English locales, then translate the new entries in each `i18n/<locale>/code.json`.
  `write-translations` adds the English message as a placeholder, and a placeholder left
  there shows English on a translated homepage. See `i18n/AGENTS.md`.
- The button links to the route `/docs/category/guides`, the generated index of
  `docs/guide/guides/_category_.json`. Its slug comes from the category label, so if the label
  changes, the route changes too, and `onBrokenLinks: 'throw'` fails the build.
- Import images through `require('@site/static/img/…').default`, as the hero does, so the
  build fingerprints them.
- Don't add a `.md` or `.mdx` file under `pages/`. It would become a route.

### Testing Requirements

- `pnpm typecheck` (tsc with `@docusaurus/tsconfig`).
- `pnpm dev` hot-reloads the homepage. For a translated homepage, check one LTR and one RTL
  locale (`pnpm docusaurus start --locale ar`), because `he`, `ar` and `fa` render the hero
  mirrored.

### Common Patterns

- Function components return `ReactNode`. Styling uses CSS modules plus Infima utility
  classes (`hero`, `container`, `row`, `col col--4`), with `clsx` for joining classes.
- Imports are sorted by specifier (`@docusaurus/*`, `@site/*`, `@theme/*`, packages), with
  relative imports last.

## Dependencies

### Internal

- `static/img/erd-editor-vscode.png` (hero image).
- `i18n/<locale>/code.json`: the translations of every `homepage.*` id.
- `docusaurus.config.ts`: `customCss: './src/css/custom.css'` and the navbar item with
  `className: 'header-github-link'`.

### External

- `@docusaurus/Link`, `@docusaurus/Translate`, `@docusaurus/useDocusaurusContext`,
  `@theme/Layout`, `@theme/Heading`, and `clsx`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
