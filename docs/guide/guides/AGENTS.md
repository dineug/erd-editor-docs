# guides

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

The `Guides` category of the `docs` sidebar: 18 task pages, one for each area of the editor UI.
Their `sidebar_position` runs from 1 to 18 with no gaps. In the Source column of Key Files, a
path is under `../erd-editor/packages/erd-editor/src/` unless it starts with `packages/`, which
means `../erd-editor/packages/`.

## Key Files

| File | Description |
|------|-------------|
| `_category_.json` | Label `Guides`, `position: 2` (after `../introduction.md`), a `generated-index` with a `description`. The label sets the index route `/docs/category/guides`, which `../introduction.md` and `src/pages/index.tsx` link. It also sets the translation keys `sidebar.docs.category.Guides` and `sidebar.docs.category.Guides.link.generated-index.description` in each `current.json`. Renaming the label moves the route and orphans 24 translations |
| `editing-start.md` | 1 · Welcome Screen, creating tables, memos and table groups, Relationship Creation (the draw, its target buttons, what ends it), and a Duplicating pointer. Source: `components/erd/welcome-screen/`, `components/erd/erd-context-menu/`, `components/erd/draw-target/` |
| `file-import-export.md` | 2 · Importing External Files (Import and Add, JSON, Schema SQL with H4s from Data Types to Comments, GraphQL, DBML, AML) and Exporting (Image, the `Export image` dialog). Source: `utils/schema-sql-parser/` and `packages/schema-sql-parser/`, `utils/schema-graphql-parser/`, `utils/schema-dbml-parser/`, `utils/schema-aml-parser/`, `components/export-image/` |
| `table-editing.md` | 3 · Columns: adding, the Tab key, DataType Autocomplete, the `Not Null`/`Unique`/`Auto Increment` options, selecting, moving, deleting, Copying/Pasting Columns, Column Primary Key. Source: `engine/modules/table-column/`, `utils/table-clipboard/` |
| `logical-names.md` | 4 · Name View (`Physical Names`, `Logical Names`, `Both Names`), Switching the View, Writing a Logical Name, Completing Term Names, The Domain Cell, Beyond the Canvas (where else names follow the view). Source: `components/erd/nameViewOptions.ts`, `components/erd/readerNameView.ts`, `engine/modules/dictionary/derive.ts` |
| `table-related-functions.md` | 5 · The canvas catch-all: selecting, moving, copying, duplicating, deleting and coloring tables and memos, Table View Options, Table Properties, Indexes, Alternate Keys, Auto Layout, Databases, Canvas Toolbar, Zoom In/Out, Getting Around the Canvas (Where a Jump Lands), Diff Viewer. Source: `components/erd/table-properties/`, `components/erd/automatic-table-placement/` and `services/elk-layout/`, `components/erd/floating-toolbar/` (the canvas toolbar), `components/erd/minimap/`, `components/erd/diff-viewer/` |
| `table-groups.md` | 6 · Creating a group (Drawing a Group, Grouping Selected Tables), naming, coloring, selecting, going to, moving and resizing, adding and removing tables, removing, the group menu, Hiding Groups, and groups in Auto Layout, Schema SQL, DBML and copying. Source: `components/erd/table-group/`, `engine/modules/table-group/` |
| `relationship-editing.md` | 7 · Deletion, Type Change, ON DELETE and ON UPDATE, Map Columns, N:M, Identifying Relationships, Foreign Key Column Names, Reading a Connector, Connector Routing. Source: `components/map-columns/`, `utils/draw-relationship/`, `utils/referentialAction.ts` |
| `quick-search.md` | 8 · The command palette: what it lists per tab (with an H3 `Read-only Editors`), the `#`, `@` and `:` prefixes (Searching the Diagram), Searching in Korean. Source: `components/quick-search/` |
| `explorer.md` | 9 · The tree docked left of the canvas: Opening and Closing, Beside the Canvas, When It Stands Aside, The Tree, Going to a Row, Keys in the Explorer, Dialogs Beside It. Source: `components/explorer/` |
| `find-and-replace.md` | 10 · The search at the top of the Explorer: The Browser's Find Bar, What It Searches, Options, The Results, Going to a Match, Replacing, Changing the Shortcut. Source: `components/explorer/`, `utils/find-replace/` |
| `visualization.md` | 11 · The Visualization tab: Toolbar, Graph Mode, Flow Mode (Focusing on Tables, Previous Table and Next Table, How Flow Is Placed, Flow Never Edits the Document). Source: `components/visualization/`, `components/flowCenters.ts` |
| `schema-sql.md` | 12 · The Schema SQL tab: Options Panel (Database and Bracket, Statements, Header, Logical Names as Comments, Tables), Before and After Scripts, Saving or Copying the SQL, What the DDL Writes. Source: `components/schema-sql/`, `utils/schema-sql/` (one file per database) |
| `code-generator.md` | 13 · The Code Generator tab: Options Panel, Language (the targets), which targets write ON DELETE and ON UPDATE, Name Case, Database, Bracket, Saving or Copying the Result. Source: `components/generator-code/`, `utils/generator-code/` (one file per target) |
| `dictionary.md` | 14 · The Dictionary tab: The Sheets, Deriving Physical Names, Derive Physical Names Again, Domains and Data Types, The Checks Sheet (What Each Check Finds, Marks on the Canvas), editing the grid, CSV import and export, keys, collaborators. Source: `components/dictionary/`, `engine/modules/dictionary/` (`checks.ts`, `derive.ts`), `utils/dictionary-csv/`, `packages/grid/` |
| `undo-redo.md` | 15 · What the History Records, One Gesture One Step, Dictionary Sheets (each sheet's own history), Time Travel. Source: `engine/history.ts`, `engine/modules/dictionary/history.ts`, `components/erd/time-travel/` |
| `settings.md` | 16 · The Settings tab: Relationship DataType Sync, Maximum Comment Width, Lock (seven rows, with their values in a new diagram), Adjusting Column Order, Shortcuts (the full default table). Source: `components/settings/` (`lockSettingRows.ts`, `shortcuts/`), `utils/keyboard-shortcut/index.ts` |
| `language-and-theme.md` | 17 · Display Language (the 25-row language table, System, right-to-left), Theme (the theme builder), In Each Host (web app and Google Drive, VS Code, JetBrains IDEs, Obsidian, your own page). Source: `components/theme-builder/`, `components/locale-picker/`, `i18n/locales.ts`. The VS Code settings table mirrors `packages/vscode-extension/package.json` (`dineug.erd-editor.locale`, `dineug.erd-editor.theme.*`) |
| `embedding.md` | 18 · erd-editor.io/embed: What the Frame Shows, The Builder, URL Parameters, Files on GitHub, Files on Other Servers, In the Frame, Analytics, Loading the Viewer Yourself. Opens with a live `<iframe>` of `data/embed-small.erd.json` from the erd-editor repo. Its URL parameters match `<erd-viewer>`'s options (`../../api/erd-viewer-element.md`). Source: `packages/app/src/components/embed/`, `packages/app/src/utils/embedOptions.ts` (parameters), `packages/app/src/utils/githubRawUrl.ts` |

## For AI Agents

### Working In This Directory

- **Each topic has one owner page.** Other pages keep only a short pointer section. Copying,
  pasting and duplicating tables and memos belong to `table-related-functions.md`, and
  `table-editing.md#copyingpasting-tables-and-memos` and `editing-start.md#duplicating-tables-and-memos`
  only point there. `table-related-functions.md#focusing-on-tables` is the entry point and
  `visualization.md#focusing-on-tables` the owner. `table-related-functions.md#auto-layout` owns
  Auto Layout, and `table-groups.md#auto-layout` covers only what groups add. Edit the owner, and
  keep each pointer to a sentence or two.
- **Anchors other pages depend on.** These are the most linked, counted as distinct linking pages
  at 5.1.0: `settings.md#lock` (19), `logical-names.md#name-view` (19),
  `table-related-functions.md#table-view-options` (16), `relationship-editing.md#map-columns` (15),
  `file-import-export.md#image` (13), `relationship-editing.md#on-delete-and-on-update` (12), and
  `dictionary.md#domains-and-data-types`, `logical-names.md#beyond-the-canvas` and
  `table-related-functions.md#where-a-jump-lands` (11 each). Every page but `embedding.md` has some
  inbound anchor links. Find them with the recipe in `../../AGENTS.md`. Slugs drop `/`:
  `## Copying/Pasting Columns` is `#copyingpasting-columns`, and `## Zoom In/Out` is `#zoom-inout`.
- **`Read-only Editors` sections.** 10 pages have an H2 of that name, and `quick-search.md` has an
  H3. Each links `../../api/erd-editor-element.md#readonly`. What a read-only editor does differently
  goes there, not into the task sections. Six other pages link `settings.md#read-only-editors`.
- **Tables that mirror the source.** In `settings.md#lock`, the "In a new diagram" column is the
  only full list of the lock defaults (`100% · 0, 0`, `ERD`, `GraphQL`, `Pascal`, `Camel`, `None`,
  `Physical Names`), and `code-generator.md#name-case` repeats the `Pascal`/`Camel` defaults. The language table in
  `language-and-theme.md#display-language` follows
  `../erd-editor/packages/erd-editor/src/i18n/locales.ts` in order, label and code.
- **A clip shared by two pages.** `/img/demo-data-type-autocomplete.webp` is embedded in
  `table-editing.md` and in `table-related-functions.md`.

### Testing Requirements

- Read the Source paths in Key Files at `v5.1.0` before you write a behavior, a default or a
  limit.
- After you reorder pages, check that positions still run from 1 to 18:
  `grep -h '^sidebar_position' docs/guide/guides/*.md | sort -t: -k2 -n`.

### Common Patterns

- The page shape is an H1, an intro of a few lines (often with the page's first clip), then an H2
  for each task. Only `file-import-export.md` goes down to H4, under its Schema SQL import.
- A coding agent's side of a feature gets one sentence that links `../../mcp/tools.md#…`, as in
  `table-groups.md` and `dictionary.md`.

## Dependencies

### Internal

Clips each page embeds, written as `<name>` for `/img/demo-<name>.webp`. Each comes from the
scene named `demo-<name>` (recipe in `../AGENTS.md`):

- `editing-start.md`: context-menu, welcome-screen, memo, relationship
- `file-import-export.md`: import-and-add, import-json, import-sql, export
- `table-editing.md`: table-edit, table-tab, data-type-autocomplete, column-options,
  column-select, column-move, column-multi-move, column-remove, copy-column-to-sheet,
  copy-sheet-column, copy-column-multi, column-pk
- `logical-names.md`: name-view, logical-names, domains
- `table-related-functions.md`: table-select, table-multiple-move, table-copy-paste,
  table-duplicate, table-remove, table-color, view-options, table-properties,
  automatic-table-placement, database, data-type-autocomplete, canvas-toolbar, zoom,
  canvas-navigation, diff-viewer
- `table-groups.md`: table-group, table-group-selected
- `relationship-editing.md`: relationship-remove, relationship-type, referential-actions,
  map-columns, relationship-n-m, identifying-relationship, relationship-hover, connector-routing
- `quick-search.md`: quick-search · `explorer.md`: explorer · `find-and-replace.md`:
  find-and-replace · `code-generator.md`: code-generator
- `visualization.md`: visualization, visualization-flow, visualization-focus, visualization-steps
- `schema-sql.md`: schema-sql-options, schema-sql-logical-names
- `dictionary.md`: derive-physical-names, dictionary-checks, dictionary-editing, dictionary-import
- `undo-redo.md`: undo-redo, time-travel
- `settings.md`: relationship-data-type-sync, settings-comment-width, settings-locks,
  settings-column-order, plus the PNG still in its `<img>`
- `language-and-theme.md`: display-language, theme-builder
- `embedding.md`: none. Its frame is live

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
