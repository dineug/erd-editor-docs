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

# any other locale
pnpm docusaurus start --locale ja
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

`build` runs `scripts/build.mjs`, which runs one `docusaurus build --locale <locale>` per
locale in `locales.mjs` instead of a single all-locale build. This is required by the search
plugin — see [Search index](#search-index) — so a full build takes about as long as 25
single-locale builds. `pnpm build ko fa` builds only the locales named (with `en` first if
named, since its build empties `build/`).

## Project structure

| Path | Contents |
| --- | --- |
| `docs/guide`, `docs/api`, `docs/mcp` | Documentation source (English, the default locale) |
| `locales.mjs` | Every locale: code, label in the locale menu, text direction, search `language` |
| `i18n/<locale>/docusaurus-plugin-content-docs/current` | Translations, mirroring the layout of `docs/` |
| `i18n/<locale>/docusaurus-plugin-content-docs/current.json` | Sidebar category labels (`_category_.json` under `i18n/` is **not** read) |
| `i18n/<locale>/code.json` | Strings for React components under `src/`, the search UI, and theme strings Docusaurus does not translate itself |
| `i18n/<locale>/docusaurus-theme-classic` | Navbar and footer labels |
| `sidebars.ts` | Sidebar structure for the Guide, API, and MCP sections |
| `src/pages`, `src/components` | Landing page and its components |
| `src/css/custom.css` | Global theme overrides |
| `static/img` | Images referenced from the docs |
| `docusaurus.config.ts` | Site config: navbar, i18n, presets, search |

## Translations

`en` is the default locale. The other 24 locales, the editor's own display languages, are
translations of it; `locales.mjs` lists them in the order of the locale menu, which is the
editor's Display Language order. To translate a page, copy the English file to the matching
path under `i18n/<locale>/docusaurus-plugin-content-docs/current/` — for example
`docs/guide/introduction.md` becomes
`i18n/ja/docusaurus-plugin-content-docs/current/guide/introduction.md`.

Keep the structure identical to the English source: same headings, same code blocks, same
images. The translated files are diffed against English when the docs change, and a
structural drift is what makes that diff unreadable.

Translated headings change their anchors. Give each translated heading below the page title
an explicit ID equal to the English heading's anchor, so links keep the English anchors:
`## Sperre {#lock}` for `## Lock`. The `ko` pages and some `ja` and `zh-CN` pages predate
this and link to translated anchors instead; keep each page consistent with itself.

To add a locale, add it to `locales.mjs`, then write its translation scaffolding. Do the
same for every locale after adding new UI strings in `src/`:

```bash
pnpm write-translations --locale ko
```

### Search index

Search is per-locale, and each locale needs a different `language` value for
`@easyops-cn/docusaurus-search-local`:

| Locale | `language` | Why |
| --- | --- | --- |
| `en` | `['en']` | default |
| `ko` | `['en', 'ko']` | Korean is space-separated, so the default tokenizer is fine |
| `ja` | `['ja']` | the plugin only enables its Japanese tokenizer when `language` is **exactly** `['ja']` |
| `zh-CN`, `zh-TW` | `['en', 'zh']` | `zh` switches the plugin to jieba segmentation |
| `de`, `es`, `fr`, `it`, `nl`, `pl`, `pt-PT`, `pt-BR`, `ro`, `sv`, `tr`, `ru`, `he`, `ar` | `['en', '<language>']` | lunr-languages has the language (`pt` for both Portuguese locales) |
| `id`, `eu`, `sk`, `sl` | `['en']` | lunr-languages has no Indonesian, Basque, Slovak or Slovenian; their Latin-script words survive the default trimmer |
| `uk` | `['en', 'ru']` | no Ukrainian in lunr-languages, and the default trimmer drops every word written wholly outside ASCII; Russian's word characters keep Cyrillic |
| `fa` | `['en', 'ar']` | no Persian in lunr-languages; Arabic's word characters keep Arabic script |

These cannot be merged into one list. Any `language` containing `zh` forces
`lunr.zh.tokenizer` onto *every* index, and that tokenizer matches only
`/\w+|\p{Unified_Ideograph}+/u` — it silently drops kana and hangul, which breaks Japanese
and Korean search.

The plugin caches its lunr setup in module state, so a locale's `language` is fixed by
whichever locale is built first in a process. That is why `pnpm build` runs one
`docusaurus build --locale <locale>` per locale, and why `localeConfigs` sets an explicit
`baseUrl` — a single-locale build otherwise flattens the site to `/`.

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
