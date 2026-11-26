# api

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-26

## Purpose

The `api` sidebar, which the navbar's `API` item opens. It documents the `@dineug/erd-editor`
package for a page's own code: four pages here, then the `Advanced` category in `advanced/`. In
Key Files, a source path is under `../erd-editor/packages/erd-editor/`.

## Key Files

| File | Description |
|------|-------------|
| `installation.md` | 1 · Install. The package is ESM-only, then come Usage (CDN, Script tag, HTML, Server-side rendering, Vite, TypeScript), Registering the Elements, Syntax Highlighting, Web Workers (Content Security Policy), Entry Points (the five entries these pages describe, the root-export table, File Dialogs), Browser Support, Upgrading from 4.x, Upgrading from 3.x. Holds 7 of the 8 version pins. Source: `package.json` (`exports`: `.`, `./erd-editor.js`, `./erd-viewer.js`, `./engine.js`, `./peer.js`, and `./svg.js`, which the docs leave out; see For AI Agents), `src/index.ts` (the root exports), `src/umd/`, `src/workers/`, `src/services/shiki/` |
| `erd-editor-element.md` | 2 · The `<erd-editor>` element, at 1,172 lines the longest page. It opens with the `ErdEditorElement` interface block, then has one H2 per member, named as in code (`## readonly`, `## setSchemaSQL`). Members are grouped under `## Event`, `## Theme` (`#### JavaScript`, and `#### CSS Variables` with the `<details>` block of default values) and `## Display Language`. `## setKeyBindingMap` holds the default binding map, `createKeyBindingMap`, `dictionaryRowChords` and the Shortcut Table. Source: `src/components/erd-editor/ErdEditor.tsx` (`interface ErdEditorElement`), `src/components/erd-editor/useErdEditorAttachElement.ts`, `src/utils/keyboard-shortcut/index.ts`, `src/themes/tokens.ts` (`Theme`), `src/i18n/` |
| `erd-viewer-element.md` | 3 · The read-only `<erd-viewer>`: `src`, `value`, `nameView`, `minimap`, `controls`, the `load` and `error` events, the theme and locale setters, `destroy`, Focus and Keys, Loading, What It Adds to a Page. Its intro says every entry these pages describe but `engine.js` and `peer.js` needs a DOM. Embeds a live `<iframe>` of the erd-editor.io/embed bookstore sample and holds the 8th pin (`dist/erd-viewer.umd.js`). Source: `src/components/erd-viewer/ErdViewer.tsx` (`interface ErdViewerElement`), `src/components/erd-viewer/documentSource.ts` (the `src` fetch), `src/umd/erd-viewer.umd.ts` |
| `to-image.md` | 4 · `toImage(value, options)`: value, Options, What It Draws, Where It Runs, Rejections, Export Image Dialog. Its options are the three of the `Export image` dialog in `../guide/guides/file-import-export.md#image`, so a change to the dialog changes this page. No page links its anchors but `#what-it-draws`, which `../mcp/tools.md#svg-export` links. Source: `src/services/export-png/toImage.ts`, `exportOptions.ts` beside it (`assertExportOption`, behind Rejections' `toImage: <name> cannot be <value>`), `exportTheme.ts` (`createPresetExportTheme`, the preset and the background rule behind What It Draws), `src/components/export-image/` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `advanced/` | Collaboration, Yjs, replication and the `.erd.json` format (see `advanced/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- **Release history stays in the text.** What a release added is marked "Since `X.Y.Z`" (221
  times under `docs/api/`), and what it changed is marked "Before `X.Y.Z`". A release update adds
  notes for what is new and leaves the old ones alone. Only the pins move:
  `grep -rn --exclude=AGENTS.md "@dineug/erd-editor@" docs/api` gives 7 lines in `installation.md`
  and 1 in `erd-viewer-element.md`, all `5.1.1`. The `@4.2.0` in `installation.md`'s `## Usage`
  ("a page that has to stay on 4.x pins `@4.2.0`") is a fixed 4.x pin and stays as written.
- **A member's heading is its code name, and its anchor follows.** Renaming the member renames
  the anchor.
  Links from other pages: `erd-editor-element.md#readonly` (16 pages), `#value` (7),
  `#runtimevalue` (5), `#setinitialvalue` (5), `#setkeybindingmap` (4), `#display-language` (3).
  In `installation.md`: `#web-workers` (4), `#registering-the-elements` (3). `## value` has
  `### getter` and `### setter` on both element pages, so `#setter` is a per-page anchor, such as
  the value setter link that `erd-editor-element.md` makes to itself.
- **`svg.js` stays undocumented.** `package.json` exports `./svg.js` (`toSvg`, which the MCP
  server's `erd_export_svg` draws with) since `5.1.1`, and by the owner's decision
  (`../erd-editor/packages/erd-editor/AGENTS.md`, Rules, 2026-11-25) no README documents it, so
  these pages don't either: the Entry Points table keeps its five rows, and no page names
  `svg.js` or `toSvg`. Leave it out; don't "fix" the gap. A sentence about every entry stays
  scoped to the ones the pages describe, as `installation.md`'s Server-side rendering and the
  `erd-viewer-element.md` intro say "Every entry these pages describe but `engine.js` and
  `peer.js` needs a DOM" (the erd-editor README: "Every entry this page describes").
- **Adding a member touches three places.** Add it to the interface block, give it an H2 of its
  own, and, when the package root exports it, add a row to `installation.md`'s root-export table.
  Check `src/index.ts` for the export.
- **Counts that follow the source.** `## setKeyBindingMap` says "the twenty-one names". That is the
  28 `KeyBindingName`s in `src/utils/keyboard-shortcut/index.ts` minus the seven fixed ones
  (`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut`, `zoomReset`).

### Testing Requirements

- No harness runs the code examples. Check each snippet against `package.json` `exports`,
  `src/index.ts`, and the interface in the element's `.tsx` file at `v5.1.1`.
- After a pin bump, check that every pinned URL resolves, as both do at `5.1.1`:
  `curl -s -o /dev/null -w "%{http_code}\n" -L https://esm.run/@dineug/erd-editor@5.1.1/erd-editor.js`
  and `https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.1.1/dist/erd-viewer.umd.js` print `200`.

### Common Patterns

- Both element pages open with a `js` block holding the import that defines the tag
  (`import '@dineug/erd-editor/erd-editor.js';`), then a `ts` block with the element interface,
  and then one section per member. `erd-viewer-element.md` puts an `html` block and a live
  `<iframe>` demo between the two.
- Fences: `js` for usage, `ts` for type declarations, `html` for markup and `<script>` tags, `sh`
  for installs, `css` for the theme variables. The one `diff` is in Upgrading from 4.x.

## Dependencies

### Internal

- `../erd-editor/packages/erd-editor/`: the package these pages document (`package.json`
  `version` `5.1.1`).

### External

- jsDelivr (`cdn.jsdelivr.net/npm/…`) and esm.run (`esm.run/…`): the CDNs the pinned URLs use.
- tinykeys: `### createKeyBindingMap` links it for the chord syntax
  (`github.com/jamiebuilds/tinykeys`).
- Shiki: `installation.md`'s Syntax Highlighting links `shiki.style`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
