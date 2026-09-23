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

`build` runs one `docusaurus build --locale <locale>` per locale instead of a single
all-locale build. This is required by the search plugin — see
[Search index](#search-index) — so it is roughly four times slower than a single build.

## Project structure

| Path | Contents |
| --- | --- |
| `docs/guide`, `docs/api`, `docs/mcp` | Documentation source (English, the default locale) |
| `i18n/<locale>/docusaurus-plugin-content-docs/current` | Translations, mirroring the layout of `docs/` |
| `i18n/<locale>/docusaurus-plugin-content-docs/current.json` | Sidebar category labels (`_category_.json` under `i18n/` is **not** read) |
| `i18n/ko/code.json` | Korean strings for React components under `src/` and the search UI |
| `sidebars.ts` | Sidebar structure for the Guide, API, and MCP sections |
| `src/pages`, `src/components` | Landing page and its components |
| `src/css/custom.css` | Global theme overrides |
| `static/img` | Images referenced from the docs |
| `docusaurus.config.ts` | Site config: navbar, i18n, presets, search |

## Translations

`en` is the default locale. `ko`, `ja`, and `zh-CN` are translations of it. To translate a
page, copy the English file to the matching path under
`i18n/<locale>/docusaurus-plugin-content-docs/current/` — for example
`docs/guide/introduction.md` becomes
`i18n/ja/docusaurus-plugin-content-docs/current/guide/introduction.md`.

Keep the structure identical to the English source: same headings, same code blocks, same
images. The translated files are diffed against English when the docs change, and a
structural drift is what makes that diff unreadable.

After adding new UI strings in `src/`, regenerate the translation scaffolding:

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
| `zh-CN` | `['en', 'zh']` | `zh` switches the plugin to jieba segmentation |

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
