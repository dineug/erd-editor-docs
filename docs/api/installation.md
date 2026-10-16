---
sidebar_position: 1
description: Install @dineug/erd-editor from npm or a CDN, mount the custom element, wire up the file dialogs, and upgrade from 3.x.
---

# Install

```sh
npm install @dineug/erd-editor
```

The package is ESM-only (`"type": "module"`) and ships only its `dist` folder.
There is no CommonJS build, so `require('@dineug/erd-editor')` does not work.

Its runtime dependencies are left external, as bare imports your bundler resolves, dedupes, and tree-shakes.
Its shared workers are emitted as separate entry files under `dist/workers/` and constructed with `new URL('./…', import.meta.url)`, the spelling Vite, webpack 5, and Rspack bundle as a worker entry. See [Web Workers](#web-workers).
For a page with no bundler behind it there is a second, self-contained build — see [Script tag](#script-tag).

## Usage

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` has no intrinsic size. Give it (or its container) an explicit width and height.
Since `4.1.0` an open [Explorer](../guide/guides/explorer.md) docks inside the element at the left of the ERD canvas and narrows the canvas rather than covering it. A new editor starts with it closed.
The panel draws no narrower than `200px` and leaves the canvas at least `320px`, so in an element narrower than `520px` an open Explorer is not drawn until the element widens — see [Beside the Canvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` starts a new, empty document. Assigning `value` loads one as an edit instead, so it lands in the undo history.
Since `4.0.0` `editor.value` is the document in the form a file holds, which is what to store. `editor.runtimeValue` is the document as the editor holds it, removed entities included: it seeds a collaborator and never goes to a file — see [runtimeValue](./erd-editor-element.md#runtimevalue).
Since `4.0.0` a new document also has every [setting lock](../guide/guides/settings.md#lock) on: the viewport, the tab, the Code Generator language, both name cases and the bracket type. Scrolling, zooming, switching tabs or changing one of those settings leaves `editor.value` as it was and fires no `change`. A document loaded from text keeps the locks it names. One that names none, such as any file saved before `4.0.0`, opens with every lock on, at 100% zoom and on the ERD tab, whatever view and tab it saved. Its view is locked at origin `0, 0`, and opens on the diagram instead if none of it is drawn there — see [setInitialValue](./erd-editor-element.md#setinitialvalue).
See [ErdEditorElement](./erd-editor-element.md) for the rest of the API.

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` resolves the package's external dependencies for you, so this works without a bundler.
The unversioned URL always serves the latest release. Pin a version — `https://esm.run/@dineug/erd-editor@4.1.0` — if you do not want a major upgrade to reach your page unannounced.
`4.0.0` is itself one: a page that has to stay on 3.x pins `@3.10.0` — see [Upgrading from 3.x](#upgrading-from-3x).

### Script tag

Since `3.6.0` the package also ships a UMD build with every dependency and every shared worker inside one file.
It is what the `unpkg` and `jsdelivr` fields point at, so the bare package URL on either CDN serves it, and it defines `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Importing it registers `<erd-editor>` the same way; `window.ErdEditor` carries the two file callbacks, `ErdEditor.setExportFileCallback` and `ErdEditor.setImportFileCallback`, and, since `3.9.2`, `ErdEditor.createKeyBindingMap`.
The exports map still points a bundler at the ES modules, so an install from npm never picks this file up.

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Since `4.0.0` `enable-locale-picker` adds the toolbar's `Display Language` picker and `enable-welcome-screen` the welcome screen an empty diagram shows — see [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) and [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
A page that loads a document, as [Usage](#usage) does, turns `enableWelcomeScreen` on once `setInitialValue()` has loaded it rather than in the markup, so the screen never flashes over a file that is still loading.
All 25 display languages ship inside the package, in the ES build and the script-tag build alike, so there is no locale file to serve and nothing to register. With neither the picker nor a `setLocale()` call the editor shows English.

Adding `readonly` here blocks editing: assigning `value`, calling `clear()`, and every `setSchema*()` call — `setSchemaJSON()` and an append included — are ignored, and the `change` event never fires. Reading `editor.value` and `editor.runtimeValue` still works. Load with `setInitialValue()` instead.

### Server-side rendering

Importing the package registers the custom element at module scope, so it needs a DOM and throws in Node.
In Next.js, Nuxt, SvelteKit, or Astro, reach it from a client-only path.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript

Importing the package merges `erd-editor` into `HTMLElementTagNameMap`, so the element is typed without a cast.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` is exported for annotating your own variables and props.
Since `4.0.0` the package also exports the types `LocaleCode`, `LocaleOption` and `SchemaSQLOptions` — see [Entry Points](#entry-points). The options the `setSchema*()` methods take have no exported name; read them off the element, as `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Syntax Highlighting

The Schema SQL and Code Generator panels are highlighted by [Shiki](https://shiki.style), in a shared worker of its own, and since `4.0.0` so are the Schema SQL tab's `Before tables` and `After tables` scripts.
Since `3.7.0` there is nothing to install and nothing to register: the worker is built the first time a code panel renders, so a page that opens none never fetches the grammars.

| | |
| --- | --- |
| Languages | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Themes | `github-dark` and `github-light`, following the editor's light or dark appearance |

Those are exactly the languages the panels emit: `JPA` is highlighted as Java, `SQLAlchemy` as Python, `TypeORM`, `Sequelize`, `Drizzle` and `Zod` as TypeScript, `Doctrine` as PHP, `SeaORM` as Rust, `JSON Schema` as JSON, and `DBML` and `AML` as SQL, the closest grammar in the bundle — see [Code Generator](../guide/guides/code-generator.md).

The regex engine is plain JavaScript, so no host policy needs `wasm-unsafe-eval`.
Where `SharedWorker` is missing — Chrome on Android, Safari before 16.4 — the failure is logged and the code shows as plain text; the scripts can still be edited.

Upgrading from `3.6.0` or earlier: `@dineug/erd-editor-shiki-worker` is no longer published, and `setGetShikiServiceCallback` is gone with it.
Drop the install and the registration; a page that loaded the worker from a CDN drops that second `<script>` tag as well.

## Web Workers

The editor runs three jobs in `SharedWorker`s: syntax highlighting, image export, and the table layout behind [Auto Layout](../guide/guides/table-related-functions.md#auto-layout), the Visualization tab's [Flow mode](../guide/guides/visualization.md#how-flow-is-placed) and, since `4.0.0`, an imported schema's placement.
All three ship inside `@dineug/erd-editor`. None of them is something you set up, but each one is something a host can block.
The worker that ran the document's garbage collection was removed in `4.0.0`, along with the collection itself.

| Worker | Without it |
| --- | --- |
| Syntax highlighting | The Schema SQL and Code Generator panels and the Schema SQL scripts stay plain text |
| Image export | The PNG, the SVG, `Copy to clipboard` and the `Export image` dialog's preview are drawn on the main thread, which blocks the page while it draws |
| Table layout | Auto Layout's `Flow`, `Tree - vertical` and `Tree - horizontal` layouts, and the Visualization tab's Flow mode, end in `Could not place tables`; an import placed by Flow — a SQL, GraphQL, DBML or AML file from `Import` or `Import and Add`, or a `setSchema*()` call with `placement: 'auto'` — lands its tables in rows, with no message; `Force` and Graph mode are unaffected, since they run inside the editor |

Image export waits ten seconds for its worker to answer and then draws on the main thread, and syntax highlighting leaves the code as plain text as soon as its worker fails, so a host that blocks workers costs performance rather than function.
Table layout is the exception: the engine that computes a layout outweighs the editor itself and is never loaded in-process, so it waits thirty seconds for its worker on the first placement, and once the worker has answered it gives a layout sixty seconds to come back.
If either wait runs out, the placement ends as it does without the worker. Auto Layout shows `Placing tables` as soon as it starts, while Flow mode and an import placed by Flow show it only once a placement, its worker's start included, has run for six seconds.

In the bundled build all three are emitted as files beside the package, so a strict CSP needs `worker-src 'self'` — plus `blob:` where your bundler inlines a worker.
In the [script-tag](#script-tag) build all three travel inside the file as `data:` URLs, so that page needs `worker-src data:` instead.

## Entry Points

Importing `@dineug/erd-editor` registers `<erd-editor>` as a side effect. Beyond that it exports the element type, two callback setters, since `3.9.2` the default key bindings with their types, and since `4.0.0` the display-language types and the `getSchemaSQL()` options type.

| Export | Description |
| --- | --- |
| `ErdEditorElement` (type) | The element interface — see [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Replaces the browser download, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Replaces the browser file picker, `({ type, op, accept, mode }) => void`; `mode` since `4.0.0`. |
| `createKeyBindingMap()` | Returns the default key bindings as a new `KeyBindingMap` on every call — see [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (types) | A binding map, the union of its command names, and one binding. |
| `LocaleCode`, `LocaleOption` (types) | Since `4.0.0`. The 25 display-language codes, and those codes plus `'system'`, which `setLocale()` takes — see [Display Language](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (type) | Since `4.0.0`. The `statements` and `header` options `getSchemaSQL()` takes — see [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` is a second entry point. It runs the document store with no DOM, so it works in a Web Worker — see [Remote Storage](./advanced/remote-storage.md).
It exports `createReplicationStore` and the `ReplicationStore` type. Since `3.10.0` it also exports the `ReplicationChange` type, `{ value: string; changed: boolean }`, which a replica's `change` listener receives — see [on@change](./advanced/remote-storage.md#onchange).
Since `4.0.0` a `ReplicationStore` also has a `runtimeValue`. Its `value` and the one a `change` hands over are the storage form a file holds, like the element's — see [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Since `3.9.1` there is a third, `@dineug/erd-editor/peer.js`: the headless peer the [MCP server](../mcp/introduction.md) edits a document through. It exists for that server, and these pages do not document it.

### File Dialogs

Import and export go through injectable callbacks, so a host without a browser file dialog — an IDE webview, for example — can supply its own.
The two are not symmetric: export hands you the finished file, while import only asks for one, and you push the content back in yourself.

`op` is `set` or `diff` — a `diff` goes to `setDiffValue()`, whatever the `type`. Otherwise `type` picks the method, and `accept` carries that type's extensions, ready to hand to a host file dialog.
Since `4.0.0` a `set` carries `mode: 'append'` when the user chose [Import and Add](../guide/guides/file-import-export.md#import-and-add), and no `mode` for a plain Import. Pass it on: a callback that drops it replaces the diagram the user asked to add to.

| `type` | `accept` | Method |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` lays the tables out by their relationships before they land, as the editor's own Import does, and makes the call return a Promise. Without it they land in rows at once — see [setSchemaSQL](./erd-editor-element.md#setschemasql) and [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Dispatch on every `type` you handle and ignore the rest.
A replacing `setSchemaJSON()`, like assigning `value`, clears the document before it parses, so routing a payload there that is not an `.erd.json` document — through a catch-all `else`, or because a `type` added later fell through — empties the diagram instead of importing anything.

The `fileName` the editor generates is `<database name>-<timestamp>` plus the file's extension, where the timestamp is the local time formatted `yyyy-MM-dd'T'HH_mm_ss`. A blank database name falls back to `unnamed`.
The export callback receives these files. Since `4.0.0` the SVG and the Code Generator's files are among them, and the `.sql` comes from the Schema SQL tab's `Save file` rather than straight from `Export`.

| File | Extension | Blob `type` |
| --- | --- | --- |
| The JSON export | `.erd.json` | `application/json` |
| The Schema SQL tab's `Save file`, holding the text the tab shows — see [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | none |
| The [Export image](../guide/guides/file-import-export.md#image) dialog | `.png` or `.svg` | `image/png` or `image/svg+xml` |
| The Code Generator tab's `Save file` — see [Code Generator](../guide/guides/code-generator.md) | The language's: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` or `.mmd` | none |

A host that picks a handler by extension needs one for each of them.

Left unset, the editor uses the browser's own download and file-picker behavior. Pass `null` to go back to it.

## Browser Support

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — the ES2022 baseline the published bundles are built against.
No polyfills are bundled. Add your own if you need to reach older browsers.

## Upgrading from 3.x

`4.0.0` is a major release. Check each of these when moving a page from 3.x:

- `editor.value`, a replica's `value` and the `value` its `change` hands over are the storage form a file holds: no removed entities, measured widths, stacking order or relationship anchors. Keep saving `value`, and read those from `runtimeValue`; entity timestamps (`meta`) are gone altogether. Seed a collaborator or a replica that joins a running session from a running peer's `runtimeValue`, not from `value` or the file, and never save `runtimeValue` — see [value](./erd-editor-element.md#value) and [runtimeValue](./erd-editor-element.md#runtimevalue).
- Setting locks replace `Save Scroll Information` and `Save Zoom Information`. A new document, and any document saved before `4.0.0`, has every lock on, so a scroll, a zoom, a tab switch, or a change of the Code Generator language, a name case or the bracket type leaves `value` as it was and fires no `change`. A page that kept the view through `change` needs `Viewport` (and `Canvas Type` for the tab) unlocked on the Settings tab, or a document whose `settings.lockSettings` leaves those bits clear — see [Lock](../guide/guides/settings.md#lock).
- `settings` no longer has `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` or `ignoreSaveSettings`, and the `SaveSettingType` constants are gone. `settings.lockSettings`, with the `LockSettingType` bits, takes the place of `ignoreSaveSettings`, which `4.0.0` or later neither reads nor writes — see [Settings](./advanced/schema.md#settings).
- The [JSON Schema](./advanced/schema.md#json-schema) every file names in `$schema` now describes the storage form alone and is closed: it rejects a file an earlier release saved until a save by `4.0.0` or later rewrites it.
- The document's garbage collection is gone with its worker, so a removed entity stays in `runtimeValue` until the document is next opened from its file. Three shared workers remain — see [Web Workers](#web-workers).
- Keep every editor and replica in a shared session on `4.0.0` or later. An earlier release ignores the new action types: those of table groups, Map Columns, the locks and the Schema SQL scripts — see [Mixing Releases](./advanced/collaborative-editing.md#mixing-releases).
- The import callback gets `mode: 'append'` for Import and Add, which a callback has to pass on. The export callback now also gets `.svg` and Code Generator files, and `Export` ▸ `Schema SQL` opens the Schema SQL tab instead of saving, so the `.sql` arrives only from that tab's `Save file` — see [File Dialogs](#file-dialogs).
- `Delete` and `Backspace` are bound to the new `removeSelection`. While the editor has focus outside a text field, the key's default is prevented on every tab, and on the ERD tab the selection is removed. `KeyBindingName` and `KeyBindingMap` gain it, and `setKeyBindingMap({ removeSelection: [] })` leaves both keys to the page — see [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` also takes `'system'`, the theme builder's `System`, which turning `systemDarkMode` on sets. `changePresetTheme` reports `'system'` while it is picked, so store it as it is and hand it back to `setPresetTheme`. With `systemDarkMode` on, a `setPresetTheme()` with `'light'` or `'dark'` now stays instead of being overwritten by the next OS change — see [systemDarkMode](./erd-editor-element.md#systemdarkmode) and [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0`, the VS Code extension `4.0.0` or later and the Obsidian and JetBrains plugins `1.0.0` or later speak hub protocol 2. Server `1.0.0` and an earlier editor release that serves agents, or an earlier server and one of these editors, refuse each other with `protocolMismatch`, naming the side to update — see [Updating](../mcp/installation.md#updating).
- An unversioned CDN URL now serves the latest 4.x release. Pin `@3.10.0` to stay on 3.x — see [CDN](#cdn).
