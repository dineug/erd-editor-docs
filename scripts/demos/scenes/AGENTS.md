# scenes

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

One module per recorded output, 72 scenes (70 clips, 2 stills), plus 7 shared
`_*-helpers.mjs`. `run.mjs` loads every `.mjs` here not starting with `_` and flattens its
default export, so a file may export an array of scenes. Today each exports one.

## Key Files

| Helper | Provides | Used by |
|------|----------|---------|
| `_io-settings-helpers.mjs` | `SHOP_SHOW` (423: the default Show, 431, minus `columnDefault`), `seedShopRing(d, { settings = {}, width = 960, zoom = 0.8 } = {})` (5 shop tables in a ring, top-right cell left free for the minimap), `menuItemBox(d, label)`, `waitMenuItem(d, label, timeout = 3000)`, `labelPoint(box)`, `hoverMenuPath(d, labels, { pause = 380, lastPause = pause } = {})` (walks a submenu path without crossing a sibling row and does not click the last item), `cellBox(d, tableName, columnName, cell)`, `settingsRowBox(d, label)` | `demo-code-generator`, `demo-derive-physical-names`, `demo-display-language`, `demo-domains`, `demo-export`, `demo-import-and-add`, `demo-import-json`, `demo-import-sql`, `demo-name-view`, `demo-relationship-data-type-sync`, `demo-schema-sql-logical-names`, `demo-schema-sql-options`, `demo-settings-comment-width`, `demo-settings-locks`, `demo-table-group-selected`, `still-settings-relationship-data-type-sync` |
| `_misc-helpers.mjs` | `waitDom(d, selector, { index = 0, timeout = 3000 } = {})`, `menuItemBox(d, label)`, `waitMenuItem(d, label, timeout = 3000)`, `diffTreeRows(d)` (the tree is virtualized since 4.1.0), `toolbarButtonBox(d, title)`, `timeline()`, `glide(d, waypoints, duration = 700)`, `closeButtonBox(d)`, `themeSwatch(d, group, name)`. Its header also names the social card, which does not import it | `demo-dictionary-import`, `demo-diff-viewer`, `demo-display-language`, `demo-explorer`, `demo-logical-names`, `demo-name-view`, `demo-overview`, `demo-settings-column-order`, `demo-settings-comment-width`, `demo-settings-locks`, `demo-table-group`, `demo-table-group-selected`, `demo-theme-builder`, `demo-welcome-screen`, `relationship.mjs` |
| `_relationship-editing-helpers.mjs` | `SHOW_COMPACT` (`1 \| 4 \| 32 \| 128 \| 256`: the default minus Default and column Comment), `seedShop(d, { settings, ...options })`, `relationshipId(d, parentName, childName)`, `routePoint(d, parentName, childName, fraction = 0.5)`, `hoverPoint(d, parentName, childName, fraction = 0.5)` (3 px off the line, inside its 8 px hit band), `menuItemBox(d, text)`, `curveTo(d, via, to, duration = 800)`, `glideTo(d, to, duration = 800, bend)` | The 8 clips on `relationship-editing.md`, and `demo-explorer` |
| `_table-editing-b-helpers.mjs` | `nameCell(d, table, column, dx = 34)`, `tableHeader(d, table, dx = 40)`, `columnNames(d, table)`, `installSheet(d, { editorWidth, columns, cells = [], active = [0, 0], headerRow = false })` (narrows `#app` and paints a "Sheet1" grid beside it that copies and pastes TSV through the real clipboard), `sheetCell(d, r, c)`, `sheetData(d)`, `keysAt(d, x)` (centres the keycaps on x) | `demo-column-move`, `demo-column-multi-move`, `demo-column-remove`, `demo-copy-column-multi`, `demo-copy-column-to-sheet`, `demo-copy-sheet-column` |
| `_table-related-a-helpers.mjs` | `memo(id, value, { x, y, width = 180, height = 90, color = '' })`, `seedShop(d, { tables, memos = [], settings = {}, patch, sql } = {})` (the keys of `tables` become `only`), `memoBox(d, id)`, `grip(box, dx = 70)`, `easeInOut`, `easeOut`, `curveTo(d, ctrl, to, duration = 900, ease = easeInOut)`, `glideTo(d, to, duration, ease = easeInOut)` (holds the wall-clock duration) | `table-color`, `table-copy-paste`, `table-duplicate`, `table-multiple-move`, `table-remove`, `table-select`, `view-options`, `demo-table-group`, `demo-table-group-selected`, `demo-explorer` |
| `_table-related-b-helpers.mjs` | `textBox(d, selector, text, index = 0)`, `waitFor(d, fn, { timeout = 5000, gap = 50 } = {})`, `glide(d, points, duration = 800)`, `settings(d)`, `timer()`, `menuItemBox(d, name)` | `demo-automatic-table-placement`, `demo-canvas-navigation`, `demo-canvas-toolbar`, `demo-database`, `demo-find-and-replace`, `demo-table-properties`, `demo-zoom`, `view-options` |
| `_vsc-helpers.mjs` | Visualization, search and code generator helpers. DOM: `waitDom` (5000 ms timeout), `clickDom`, `waitMenuItem(d, label, { scope = '', timeout = 4000 } = {})`, `tabSelector(title)`. Graph mode: `graphTables`, `graphDots`, `graphClearPoint`, `graphSafeMoveTo`, `graphRouteMoveTo`, `graphPreviewBox`, `graphDrag`, `graphStepOff`, `watchGraphHovers`, `graphHoverLog`. Canvas: `canvasSafeMoveTo`, `tablePart`. Also `syncPointer(d, x, y)`, `dropStrayColumns(doc)` and `timer()` | `demo-visualization`, `demo-visualization-flow`, `demo-visualization-focus`, `demo-visualization-steps`, `demo-dictionary-import`, `demo-dictionary-editing`, `demo-dictionary-checks`, `demo-derive-physical-names`, `demo-code-generator`, `demo-domains`, `demo-find-and-replace`, `demo-name-view`, `demo-quick-search`, `demo-schema-sql-logical-names`, `demo-schema-sql-options` |

Scenes that deviate from the README skeleton:

| File | Why it is unusual |
|------|-------------------|
| `still-social-card.mjs` | `stillOnly`, `scale: 1`, 1200×630. Writes `social-card.png`, the site's `og:image` (`image` in `docusaurus.config.ts`). No docs page embeds it |
| `still-settings-relationship-data-type-sync.mjs` | `stillOnly`. Writes `settings-relationship-data-type-sync.png`, a clip 290 px wide. `settings.md` and its 24 translations embed it as `<img … width="290">`, so change the width in all of them together |
| `demo-visualization.mjs` | The only lossy clip (`lossless: false`, `quality: 80`): the graph moves for most of the clip, and lossless came to about 9 MB. It seeds `sakila.sql` from erd-editor's `data/` and runs `dropStrayColumns` on it |
| `demo-theme-builder.mjs`, `demo-display-language.mjs`, `demo-welcome-screen.mjs` | Turn on `enableThemeBuilder`, `enableLocalePicker` or `enableWelcomeScreen` in `setup`. The fixture (`e2e/fixture/main.ts`) turns all three off |
| `demo-copy-column-to-sheet.mjs`, `demo-copy-sheet-column.mjs` | `installSheet` puts a spreadsheet beside a narrowed editor at 1040×585 |
| `demo-settings-column-order.mjs` | A native drag sends no mouse moves, so the scene feeds the painted pointer from `dragover` and sets `__demoCursorLock = 'grabbing'` |
| `context-menu.mjs`, `table-edit.mjs`, `demo-welcome-screen.mjs` | Keep the fixture's empty document: the first two change only its settings through `setInitialValue`, and the third seeds nothing |

## For AI Agents

### Working In This Directory

- **The scene contract.** These are the keys `record()` reads:
  - `name`: required and unique. It is the CLI argument, the `.out/<name>/` folder, and the
    default `output`, which names the clip `static/img/<output>.webp`.
  - `width`/`height` default to 800×450 CSS px and `scale` to 2. `setup(d)` is optional
    and not recorded. `scenario(d)` is required and recorded.
  - `stillOnly` defaults to `false`, `lossless` to `true`, and `quality` to 85 (used only
    without `lossless`). `url` defaults to the fixture URL. No scene sets `output` or
    `url`, and the nine that set `lossless: true` repeat the default.
- **The output comes from `name`, not the file name.** 18 files drop the `demo-` prefix
  that their `name` has: `column-options`, `column-pk`, `column-select`, `context-menu`,
  `data-type-autocomplete`, `memo`, `relationship`, `table-color`, `table-copy-paste`,
  `table-duplicate`, `table-edit`, `table-multiple-move`, `table-remove`, `table-select`,
  `table-tab`, `time-travel`, `undo-redo` and `view-options`. So
  `node scripts/demos/run.mjs column-options` throws, and `demo-column-options` works.
  Find a file by its output with `grep -l "name: 'demo-memo'" scripts/demos/scenes/*.mjs`.
- **Keep `name` stable.** A re-recorded clip keeps its file name, so the
  `/img/<name>.webp` links in English and in all 24 translations stay valid.
- **A new clip** needs a file named after its unique `name` (`demo-<feature>.mjs`) and an
  image line on the English page and on the same page in all 24 translations (root
  `AGENTS.md`). `grep -rlF --exclude=AGENTS.md '/img/<name>.webp' docs i18n | wc -l`
  gives 25 per embedding page. The exclude is there because `docs/AGENTS.md` names clips.
- **Check a helper's signature in the file you import from.** `menuItemBox` exists in 4
  helpers, `waitMenuItem` in 3, and `waitDom`, `seedShop`, `curveTo`, `glideTo`, `glide`
  and `timer` in 2 each, with different arguments, defaults or env vars.
- **Wait for state, not time.** `d.whenDrawn()` does not wait for tweens (see
  `../lib/AGENTS.md`). Poll with `waitFor`, `waitDom` or `waitMenuItem`, or with a loop
  like the one in `still-settings-relationship-data-type-sync.mjs`.
- **Keep the pointer and the keycaps clear of the chrome.** Rest points and table
  positions are hand-placed off the floating toolbar, the minimap and the keycaps (see the
  comments in `demo-canvas-toolbar.mjs` and `undo-redo.mjs`). Four scenes raise or lower
  the keycaps with `--demo-keys-bottom`: `demo-welcome-screen`,
  `demo-relationship-data-type-sync`, `demo-visualization-flow` and
  `demo-copy-column-multi`. `table-edit.mjs` moves them sideways with `left`.
- **Timing logs.** `DEMO_TIMING=1` turns on `timeline()` (`_misc-helpers.mjs`), `timer()`
  (`_vsc-helpers.mjs`) and `demo-visualization.mjs`'s logs. `TRB_TIMING=1` turns on `timer()`
  (`_table-related-b-helpers.mjs`) and `demo-canvas-navigation.mjs`'s. Read them from a
  recording, not a debug run (`../AGENTS.md`).

### Testing Requirements

- After you edit a scene, `--debug` it and read its shots, then record it and read
  `review.png` (`../AGENTS.md`). After you edit a helper, `--debug` every scene in its
  "Used by" cell.

### Common Patterns

- A comment above `export default` or at the top of the file names the docs section and
  the clip's steps (`memo.mjs`: "Editing Start > Memo Creation: Alt+M, …"). The docs alt
  text narrates the same steps.
- 66 scenes call `d.shot(label)` at their steps. For seeds, 50 scenes use `shop.sql`, 18
  only an inline `SQL` string, `demo-visualization` uses `sakila.sql`, and the last three
  keep the empty document (table above).
- `settings.show` is a bitmask of `Show`, defined in the checkout's
  `packages/erd-editor-schema/src/v3/schema/settings.ts`: `tableComment` 1,
  `columnComment` 2, `columnDataType` 4, `columnDefault` 8, `columnPrimaryKey` 32,
  `columnNotNull` 128, `relationship` 256, and more.

## Dependencies

### Internal

- `../lib/recorder.mjs` (`center`), `../lib/seed.mjs` (`readSeed`, `seedSQL`, `seedDoc`),
  and `../seeds/shop.sql`.
- Pages that embed the outputs (all under `docs/guide/` unless shown):

  | Page | Outputs |
  |------|---------|
  | `introduction.md` | `demo-overview` |
  | `guides/editing-start.md` | `demo-welcome-screen`, `demo-context-menu`, `demo-memo`, `demo-relationship` |
  | `guides/table-editing.md` | `demo-table-edit`, `demo-table-tab`, `demo-column-options`, `demo-column-pk`, `demo-column-select`, `demo-column-move`, `demo-column-multi-move`, `demo-column-remove`, `demo-copy-column-multi`, `demo-copy-column-to-sheet`, `demo-copy-sheet-column`, `demo-data-type-autocomplete` |
  | `guides/table-related-functions.md` | `demo-table-select`, `demo-table-multiple-move`, `demo-table-copy-paste`, `demo-table-duplicate`, `demo-table-remove`, `demo-table-color`, `demo-table-properties`, `demo-view-options`, `demo-database`, `demo-zoom`, `demo-canvas-navigation`, `demo-canvas-toolbar`, `demo-automatic-table-placement`, `demo-diff-viewer`, `demo-data-type-autocomplete` |
  | `guides/relationship-editing.md` | `demo-relationship-type`, `demo-relationship-hover`, `demo-relationship-remove`, `demo-relationship-n-m`, `demo-identifying-relationship`, `demo-referential-actions`, `demo-map-columns`, `demo-connector-routing` |
  | `guides/table-groups.md` | `demo-table-group`, `demo-table-group-selected` |
  | `guides/logical-names.md` | `demo-logical-names`, `demo-name-view`, `demo-domains` |
  | `guides/dictionary.md` | `demo-dictionary-import`, `demo-dictionary-editing`, `demo-dictionary-checks`, `demo-derive-physical-names` |
  | `guides/schema-sql.md` | `demo-schema-sql-options`, `demo-schema-sql-logical-names` |
  | `guides/file-import-export.md` | `demo-import-sql`, `demo-import-json`, `demo-import-and-add`, `demo-export` |
  | `guides/code-generator.md`, `guides/quick-search.md`, `guides/find-and-replace.md`, `guides/explorer.md` | `demo-code-generator`, `demo-quick-search`, `demo-find-and-replace`, `demo-explorer`, one each |
  | `guides/visualization.md` | `demo-visualization`, `demo-visualization-flow`, `demo-visualization-focus`, `demo-visualization-steps` |
  | `guides/undo-redo.md` | `demo-undo-redo`, `demo-time-travel` |
  | `guides/settings.md` | `demo-settings-column-order`, `demo-settings-comment-width`, `demo-settings-locks`, `demo-relationship-data-type-sync`, `settings-relationship-data-type-sync.png` |
  | `guides/language-and-theme.md` | `demo-display-language`, `demo-theme-builder` (also on `docs/api/erd-editor-element.md`) |

- Orphans: none. Every output is embedded, or, for `social-card.png`, set in the site
  config. Every `static/img/demo-*` has a scene. `coding-agents.webp`, on
  `docs/mcp/introduction.md`, has no scene.

### External

- The fixture: `$ERD_EDITOR_DIR/packages/erd-editor/e2e/fixture/main.ts` turns the three
  features off and pins `systemDarkMode` off.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
