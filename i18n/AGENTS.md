# i18n

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

Translations of the English site into the other 24 locales of `locales.mjs`: `ar de es eu fa
fr he id it ja ko nl pl pt-BR pt-PT ro ru sk sl sv tr uk zh-CN zh-TW`. Every locale has the
same 35 files: the 31 pages under `docs/`, mirrored path for path, and four JSON files of UI
strings. There is no AGENTS.md inside a locale. This one file covers all of them.

## Key Files

Per locale (`<l>` is a locale code):

| File | Description |
|------|-------------|
| `<l>/docusaurus-plugin-content-docs/current/**.md` | The translated pages. The path must equal the English path under `docs/`, because Docusaurus looks up a translation by the source's path and ignores any other file |
| `<l>/docusaurus-plugin-content-docs/current.json` | The labels and generated-index description of `docs/guide/guides/_category_.json` and `docs/api/advanced/_category_.json`, plus `version.label` in every locale but `ja`. A `_category_.json` placed under `i18n/` is not read |
| `<l>/code.json` | The `homepage.*` strings from `src/`, plus the theme and search strings Docusaurus doesn't ship for that locale. Most locales have 102 keys. `ja` (13) and `zh-CN` (17) hold only the homepage keys and a few theme keys. Their other theme strings come from Docusaurus's bundled translations |
| `<l>/docusaurus-theme-classic/navbar.json` | The navbar title, logo alt, and the `Guide`/`API`/`MCP`/`Editors` item labels |
| `<l>/docusaurus-theme-classic/footer.json` | The footer column titles, link labels and `copyright` |

## For AI Agents

### Working In This Directory

- **Mirror every English change in all 24 locales.** Apply the same edit at the same place in
  each `<l>/docusaurus-plugin-content-docs/current/<path>`. The translations are diffed
  against English at each release, and structural drift makes that diff unreadable
  (README, Translations).
- **Keep the structure equal to English:** the same front matter keys and `sidebar_position`,
  the same headings in the same order and level, the same images, tables (row and column
  counts), list items, admonitions, and the hard breaks (two trailing spaces) at the same
  line ends. Translate the front matter `description`, the prose and the image alt text.
- **Code blocks are byte-equal to English.** Don't translate code comments, identifiers or
  strings inside fences.
- **UI labels stay in English.** Backticked editor labels (`Settings`, `Preferences`,
  `Display Language`), keys (`Alt + M`), option names and API identifiers are copied
  unchanged, as every locale does today. The surrounding words are translated.
- **Anchors depend on the locale group:**
  - In the 21 newer locales (everything except `ko`, `ja` and `zh-CN`), every heading below
    the H1 carries `{#english-anchor}`, so `#welcome-screen` works in every language. Keep
    that true for each heading you add.
  - In `ko`, `ja` and `zh-CN`, older headings have no explicit id, so their anchor is the
    slug of the translated heading (`#시작-화면`). Headings added since then carry
    `{#english-anchor}`. Give a new heading the English anchor. Don't retrofit old headings:
    links in the same locale point to their translated slugs, and a retrofit would break
    those links.
  - A link inside a translated page must use the anchor the target heading has in that
    locale. Check the target file and don't copy the English link blindly.
- **Use the locale's established terms.** Before translating, grep the locale's existing
  pages for the term (e.g. the word chosen for "relationship" or "Quick Search") and reuse
  it. The link text of a page reference is that page's translated H1.
- **RTL locales** (`he`, `ar`, `fa`) get `direction: 'rtl'` from `locales.mjs`. The Markdown
  itself is written the same way as in any other locale.
- **UI strings:** a new `translate()` id in `src/` needs `pnpm write-translations --locale
  <l>` for each locale, and then a real translation in each `code.json`. A new navbar or
  footer item needs the same in `docusaurus-theme-classic/*.json`. A new
  `_category_.json` label needs it in `current.json`.

### Testing Requirements

- Build the locales you changed: `pnpm build en <l> …`. A broken anchor in a translated page
  only warns, so grep that locale's build output for `[WARNING]` and for its page path.
- Parity check per page, against `docs/`: the heading count and levels, image paths, the
  number of code fences and their contents (byte-equal), table rows, and list items. In the
  21 newer locales, the number of headings with `{#…}` equals the heading count below the H1.
- Every locale has 35 tracked files: `git ls-files i18n/<l> | wc -l`.

### Common Patterns

- Translated pages keep the relative file paths of links and the image paths
  (`./quick-search.md`, `/img/demo-*.webp`). Only the link text, the alt text and, in
  `ko`/`ja`/`zh-CN`, the anchors of older headings differ.
- Release updates translate only the changed paragraphs and keep the surrounding text. A new
  page is translated in full.

## Dependencies

### Internal

- `docs/`: the English source every page here mirrors (see `docs/AGENTS.md`).
- `locales.mjs`: the locale list, labels, direction and search language.
- `src/`: the source of the `homepage.*` ids in `code.json`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
