# erd-editor-docs

Documentation site for [erd-editor](https://github.com/dineug/erd-editor), published at <https://docs.erd-editor.io>.

Built with [Docusaurus](https://docusaurus.io/) 3.

## Prerequisites

- **Node.js** — the version pinned in [`.nvmrc`](./.nvmrc); run `nvm use` to switch
- **[pnpm](https://pnpm.io/)** — this repo is locked with `pnpm-lock.yaml`

## Getting started

```bash
nvm use
pnpm install
pnpm dev        # English, http://localhost:3000
pnpm dev:ko     # Korean
```

The dev server hot-reloads, so most edits appear without a restart.

> **Search does not work on the dev server.** Site search is powered by
> [`@easyops-cn/docusaurus-search-local`](https://github.com/easyops-cn/docusaurus-search-local),
> which builds its index during `pnpm build`. Use `pnpm build && pnpm serve` to test search.

## Build and preview

```bash
pnpm build      # static output in ./build for every locale
pnpm serve      # preview the production build, http://localhost:3000
pnpm typecheck  # tsc, no emit
```

## Project structure

| Path | Contents |
| --- | --- |
| `docs/guide`, `docs/api` | Documentation source (English, the default locale) |
| `i18n/ko/docusaurus-plugin-content-docs/current` | Korean translations, mirroring the layout of `docs/` |
| `i18n/ko/code.json` | Korean strings for React components under `src/` and the search UI |
| `i18n/ko/docusaurus-plugin-content-docs/current.json` | Korean sidebar category labels (`_category_.json` under `i18n/` is **not** read) |
| `sidebars.ts` | Sidebar structure for the Guide and API sections |
| `src/pages`, `src/components` | Landing page and its components |
| `src/css/custom.css` | Global theme overrides |
| `static/img` | Images referenced from the docs |
| `docusaurus.config.ts` | Site config: navbar, i18n, presets, search |

## Translations

`en` is the default locale and `ko` is a translation of it. To translate a page, copy the
English file to the matching path under `i18n/ko/docusaurus-plugin-content-docs/current/` —
for example `docs/guide/introduction.md` becomes
`i18n/ko/docusaurus-plugin-content-docs/current/guide/introduction.md`.

After adding new UI strings in `src/`, regenerate the translation scaffolding:

```bash
pnpm write-translations --locale ko
```

## Other scripts

| Script | Purpose |
| --- | --- |
| `pnpm clear` | Delete the Docusaurus build cache |
| `pnpm swizzle` | Eject a theme component for customization |
| `pnpm write-heading-ids` | Write explicit, stable heading anchors into Markdown |

## Deployment

Deployment happens outside this repository: `pnpm build` produces a self-contained static site
in `build/`, which is published to <https://docs.erd-editor.io>.

> The `deploy` script is the GitHub Pages helper that ships with the Docusaurus template. It
> pushes to the `gh-pages` branch of the `organizationName`/`projectName` pair in
> `docusaurus.config.ts` (`dineug/erd-editor`), which is not where this site is hosted. Don't run it.
