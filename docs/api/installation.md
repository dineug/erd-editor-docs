---
sidebar_position: 1
description: Install @dineug/erd-editor from npm or a CDN, register the editor and viewer elements, wire up the file dialogs, and upgrade from 4.x or 3.x.
---

# Install

```sh
npm install @dineug/erd-editor
```

The package is ESM-only (`"type": "module"`) and ships only its `dist` folder.
There is no CommonJS build, so `require('@dineug/erd-editor')` does not work.

It holds two custom elements: `<erd-editor>`, the editor, and, since `5.0.0`, `<erd-viewer>`, which shows a diagram read-only — see [ErdViewerElement](./erd-viewer-element.md).
Since `5.0.0` importing the package root defines neither. Each element has an entry of its own that defines it — see [Registering the Elements](#registering-the-elements).

Its runtime dependencies are left external, as bare imports your bundler resolves, dedupes, and tree-shakes. Since `5.0.0` its `dist` holds one file per module, so a bundler keeps only the modules a page reaches — see [Entry Points](#entry-points).
Its shared workers are emitted as separate entry files under `dist/workers/` and constructed with `new URL('./…', import.meta.url)`, the spelling Vite, webpack 5, and Rspack bundle as a worker entry. See [Web Workers](#web-workers).
For a page with no bundler behind it there are two self-contained builds — see [Script tag](#script-tag).

## Usage

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` defines `<erd-editor>` as it is imported. A page that only shows a diagram imports `@dineug/erd-editor/erd-viewer.js` instead — see [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` has no intrinsic size. Give it (or its container) an explicit width and height.
Since `4.1.0` an open [Explorer](../guide/guides/explorer.md) docks inside the element at the left of the ERD canvas and narrows the canvas rather than covering it. A new editor starts with it closed.
The panel draws no narrower than `200px` and leaves the canvas at least `320px`, so in an element narrower than `520px` an open Explorer is not drawn until the element widens — see [Beside the Canvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` starts a new, empty document. Assigning `value` loads one as an edit instead, so it lands in the undo history.
Since `4.0.0` `editor.value` is the document in the form a file holds, which is what to store. `editor.runtimeValue` is the document as the editor holds it, removed entities included: it seeds a collaborator and never goes to a file — see [runtimeValue](./erd-editor-element.md#runtimevalue).
Since `4.0.0` a new document also has every [setting lock](../guide/guides/settings.md#lock) on: the viewport, the tab, the Code Generator language, both name cases, the bracket type and, since `4.2.0`, the [Name View](../guide/guides/logical-names.md#name-view). Scrolling, zooming, switching tabs, switching the Name View or changing one of the other settings leaves `editor.value` as it was and fires no `change`. A document loaded from text keeps the locks it names. One that names none, such as any file saved before `4.0.0`, opens with every lock on, at 100% zoom and on the ERD tab, whatever viewport and tab it saved. Its viewport is locked at origin `0, 0`, and the view opens on the diagram instead if none of it is drawn there — see [setInitialValue](./erd-editor-element.md#setinitialvalue).
A file saved before `4.2.0` opens with the Name View locked on `Physical Names`, even one with every other lock off. An editor of `4.0.0` or `4.1.0` keeps the Name View lock as it stands through a save but drops the view, so a `4.2.0` file saved with the Name View unlocked stays unlocked but reopens on `Physical Names`.
See [ErdEditorElement](./erd-editor-element.md) for the rest of the API.

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` resolves the package's external dependencies for you, so this works without a bundler.
Each entry is reached by its path after the version: `…/erd-editor.js` defines the editor, and `…/erd-viewer.js` the viewer, which fetches each display language but English from the CDN once a page asks for it. The bare package URL, `https://esm.run/@dineug/erd-editor@5.0.0`, serves the root, which defines no element.
An unversioned URL always serves the latest release. Pin a version, as above, if you do not want a major upgrade to reach your page unannounced.
`5.0.0` is itself one: a page that has to stay on 4.x pins `@4.2.0` — see [Upgrading from 4.x](#upgrading-from-4x).

`esm.run` serves the shared workers from `cdn.jsdelivr.net`, and a browser starts no shared worker from an origin other than the page's. So an editor loaded this way runs without its workers, as it does on a host that blocks them — see [Web Workers](#web-workers). The [script-tag](#script-tag) build carries them inside its file.

### Script tag

Since `3.6.0` the package also ships a UMD build with every dependency and every shared worker inside one file, `dist/erd-editor.umd.js`.
It is what the `unpkg` and `jsdelivr` fields point at, so the bare package URL on either CDN serves it, and it defines `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Loading it defines `<erd-editor>`. `window.ErdEditor` carries the two file callbacks, `ErdEditor.setExportFileCallback` and `ErdEditor.setImportFileCallback`, since `3.9.2` `ErdEditor.createKeyBindingMap`, since `4.2.0` `ErdEditor.dictionaryRowChords` — see [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — and since `5.0.0` `ErdEditor.ErdEditorElement` and `ErdEditor.defineErdEditor` — see [Registering the Elements](#registering-the-elements). It carries no [toImage](./to-image.md).

Since `5.0.0` a second file, `dist/erd-viewer.umd.js`, defines `<erd-viewer>` and puts `ErdViewerElement` and `defineErdViewer` on `window.ErdViewer`. It starts no worker, holds all 25 display languages, and requests nothing but the `src` it is given.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Neither file defines the other's tag, and each leaves no global on the page but its own and `window.Konva`.
The exports map still points a bundler at the ES modules, so an install from npm never picks either file up.
A page that cannot load a script of its own can frame the hosted viewer at erd-editor.io/embed instead — see [Embedding](../guide/guides/embedding.md).

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
The editor carries all 25 display languages, in the ES build and the script-tag build alike, so there is no locale file to serve and nothing to register. With neither the picker nor a `setLocale()` call the editor shows English.

Adding `readonly` here opens the editor as a reader: assigning `value`, calling `clear()`, and every `setSchema*()` call — `setSchemaJSON()` and an append included — are ignored, and the `change` event never fires. Its tabs, the Explorer and Quick Search stay to read, and every control that would edit the diagram is gone.
Reading `editor.value` and `editor.runtimeValue` still works, and both keep the document's own settings: a view setting the reader changes, such as the zoom or the database, stays on that editor's screen. Load with `setInitialValue()` instead — see [readonly](./erd-editor-element.md#readonly).

### Server-side rendering

Every entry but `engine.js` and `peer.js` needs a DOM, so it throws in Node. `erd-editor.js` and `erd-viewer.js` define their element at module scope, and the package root, which since `5.0.0` defines nothing, still builds both element classes as it loads.
In Next.js, Nuxt, SvelteKit, or Astro, reach the element's entry from a client-only path, and a named import from the root, such as `setExportFileCallback` or `toImage`, from the same path.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite

In development, add the ELK bundle the editor's layout worker imports to Vite's pre-bundling, or the layouts that worker makes fail: Auto Layout's `Flow`, `Tree - vertical` and `Tree - horizontal`, the Visualization tab's Flow mode and an import placed by Flow.
Vite 7 and older also need the editor kept out of pre-bundling, since their pre-bundle points the workers' URLs at files it never writes, so all three workers fail. On Vite 8 leave that `exclude` out, which only makes the dev server fetch each of the package's files on its own. A production build needs neither.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript

Importing `@dineug/erd-editor/erd-editor.js` merges `erd-editor` into `HTMLElementTagNameMap`, and `@dineug/erd-editor/erd-viewer.js` merges `erd-viewer`, so the element is typed without a cast. Any import from the root, a type alone included, brings both.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` is exported for annotating your own variables and props. Since `5.0.0` it is also the element's class, and `ErdViewerElement` is the viewer's interface and class — see [Registering the Elements](#registering-the-elements).
Since `4.0.0` the package also exports the types `LocaleCode`, `LocaleOption` and `SchemaSQLOptions`, and since `5.0.0` `ToImageOptions` — see [Entry Points](#entry-points). The options the `setSchema*()` methods take have no exported name; read them off the element, as `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Since `5.0.0` the package's `typesVersions` types each subpath entry under `moduleResolution: "node10"` too, which reads no exports map.

## Registering the Elements

Since `5.0.0` the package defines a tag only where a page asks it to.

| Import | Defines |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nothing |

Each of the two entries defines its tag as it is evaluated and exports nothing, so it is imported for its effect, and neither defines the other's tag.
The root exports both element classes, `ErdEditorElement` and `ErdViewerElement`, and `defineErdEditor()` and `defineErdViewer()`, which define their tag where you call them:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

A call does nothing while the tag already holds that class, so an entry and a define call, or two define calls, can meet in one page. It throws an `Error` naming the tag when another class holds it, as a second copy of the package bundled into the same page would: `Another element class already defines the custom element name erd-editor`.
The root's classes are the ones the entries define, so `customElements.get('erd-editor') === ErdEditorElement` once either has run. Until the tag is defined, `document.createElement('erd-editor')` makes a plain `HTMLElement` with none of the editor's members, and `new ErdEditorElement()` throws.

For a tag of your own, define the class under it yourself and add the tag to `HTMLElementTagNameMap` yourself. Do it in a window that loads neither that element's entry nor its [script-tag](#script-tag) build and calls no define function for it, since a class takes one name per window:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

A bundle that holds both elements makes Vite and Rolldown warn of an `INEFFECTIVE_DYNAMIC_IMPORT` once for each display language but English. The viewer loads each of those with an `import()` of its own, and the editor imports every dictionary at once, so they stay in the editor's chunk and load with it. Nothing fails, and a bundle with the viewer alone keeps each language in a chunk of its own.

## Syntax Highlighting

The Schema SQL and Code Generator panels are highlighted by [Shiki](https://shiki.style), in a shared worker of its own, and since `4.0.0` so are the Schema SQL tab's `Before tables` and `After tables` scripts.
Since `3.7.0` there is nothing to install and nothing to register: the worker is built the first time a code panel renders, so a page that opens none never fetches the grammars.

| | |
| --- | --- |
| Languages | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Themes | `github-dark` and `github-light`, following the editor's light or dark appearance |

Those are exactly the languages the panels emit: `JPA` is highlighted as Java, `SQLAlchemy` as Python, `TypeORM`, `Sequelize`, `Drizzle` and `Zod` as TypeScript, `Doctrine` as PHP, `SeaORM` as Rust, `JSON Schema` as JSON, and `DBML` and `AML` as SQL, the closest grammar in the bundle — see [Code Generator](../guide/guides/code-generator.md).

The regex engine is plain JavaScript, so no host policy needs `wasm-unsafe-eval`.
Where `SharedWorker` is missing — Chrome on Android before Chrome 148, Safari before 16.4 — the failure is logged and the code shows as plain text; the scripts can still be edited.

Upgrading from `3.6.0` or earlier: `@dineug/erd-editor-shiki-worker` is no longer published, and `setGetShikiServiceCallback` is gone with it.
Drop the install and the registration; a page that loaded the worker from a CDN drops that second `<script>` tag as well.

## Web Workers

The editor runs three jobs in `SharedWorker`s: syntax highlighting, image export, and the table layout behind [Auto Layout](../guide/guides/table-related-functions.md#auto-layout), the Visualization tab's [Flow mode](../guide/guides/visualization.md#how-flow-is-placed) and, since `4.0.0`, an imported schema's placement.
All three ship inside `@dineug/erd-editor`. None of them is something you set up, but each one is something a host can block.
Since `5.0.0` each worker is constructed in a module of its own, so a bundle carries only the workers its modules reach: a bundle of [toImage](./to-image.md) and no element carries the image export worker alone, and `<erd-viewer>` starts no worker at all — see [Entry Points](#entry-points).
The worker that ran the document's garbage collection was removed in `4.0.0`, along with the collection itself.

| Worker | Without it |
| --- | --- |
| Syntax highlighting | The Schema SQL and Code Generator panels and the Schema SQL scripts stay plain text |
| Image export | The PNG, the SVG, `Copy to clipboard`, the `Export image` dialog's preview and, since `5.0.0`, [toImage()](./to-image.md) are drawn on the main thread, which blocks the page while it draws |
| Table layout | Auto Layout's `Flow`, `Tree - vertical` and `Tree - horizontal` layouts, and the Visualization tab's Flow mode, end in `Could not place tables`; an import placed by Flow — a SQL, GraphQL, DBML or AML file from `Import` or `Import and Add`, or a `setSchema*()` call with `placement: 'auto'` — lands its tables in rows, with no message; `Force` and Graph mode are unaffected, since they run inside the editor |

Image export waits ten seconds for its worker to answer and then draws on the main thread, and syntax highlighting leaves the code as plain text as soon as its worker fails, so a host that blocks workers costs performance rather than function.
Table layout is the exception: the engine that computes a layout outweighs the editor itself and is never loaded in-process, so it waits thirty seconds for its worker on the first placement, and once the worker has answered it gives a layout sixty seconds to come back.
If either wait runs out, the placement ends as it does without the worker. Auto Layout shows `Placing tables` as soon as it starts, while Flow mode and an import placed by Flow show it only once a placement, its worker's start included, has run for six seconds.

Vite, webpack 5, and Rspack emit the workers as files beside your chunks. esbuild, and Rolldown used on its own rather than through Vite, emit none, so a page they build runs without the workers.
Under webpack's experimental `experiments.outputModule` no worker starts, since each waits on a chunk split off it that nothing loads. Keep webpack's default output, or set `optimization.splitChunks: false`.

### Content Security Policy

A page under a strict Content Security Policy needs these directives for the elements:

- `worker-src 'self'` for the bundled build, whose workers are files beside the package, plus `blob:` where your bundler inlines a worker. In the [script-tag](#script-tag) build all three travel inside the file as `data:` URLs, so that page needs `worker-src data:` instead. `<erd-viewer>` needs neither, since it starts no worker.
- Since `5.0.0` both elements style themselves with constructed stylesheets, which `style-src 'self'` lets through. The editor's code panels still color their text with `style` attributes, and the `Export image` dialog's preview is an image at a `blob:` URL, so the editor also needs `style-src 'unsafe-inline'` and `img-src blob:` for them.
- A browser without constructed stylesheets, such as Firefox before 101, gets `<style>` elements instead, which need `style-src 'unsafe-inline'` for either element.
- `<erd-viewer>` fetches its `src`, so that origin goes in `connect-src` — see [What It Adds to a Page](./erd-viewer-element.md#what-it-adds-to-a-page).

## Entry Points

The package has five entries:

| Entry | What it is |
| --- | --- |
| `@dineug/erd-editor` | The root: the exports below. Since `5.0.0` it defines no element, though it still needs a DOM to load |
| `@dineug/erd-editor/erd-editor.js` | Since `5.0.0`. Defines `<erd-editor>` and exports nothing |
| `@dineug/erd-editor/erd-viewer.js` | Since `5.0.0`. Defines `<erd-viewer>` and exports nothing |
| `@dineug/erd-editor/engine.js` | The document store with no DOM |
| `@dineug/erd-editor/peer.js` | Since `3.9.1`. The headless peer of the MCP server |

The root exports both element classes and their define functions, two callback setters, since `3.9.2` the default key bindings with their types, since `4.0.0` the display-language types and the `getSchemaSQL()` options type, since `4.2.0` the Dictionary tab's row chords, and since `5.0.0` `toImage`.

| Export | Description |
| --- | --- |
| `ErdEditorElement` | The element's interface — see [ErdEditorElement](./erd-editor-element.md). Since `5.0.0` also its class, the one `<erd-editor>` is defined as — see [Registering the Elements](#registering-the-elements). |
| `ErdViewerElement` | Since `5.0.0`. The viewer's interface and class — see [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Since `5.0.0`. Define `<erd-editor>` or `<erd-viewer>` as its class. A call does nothing while the tag holds that class, and throws an `Error` when another class holds it — see [Registering the Elements](#registering-the-elements). |
| `toImage(value, options)` | Since `5.0.0`. Draws a document as a PNG `Blob` or an SVG string, with the `Export image` dialog's options — see [toImage](./to-image.md). |
| `ToImageOptions` (type) | Since `5.0.0`. The options `toImage()` takes: `format`, `background`, `darkMode` and `scale`. |
| `setExportFileCallback(cb)` | Replaces the browser download, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Replaces the browser file picker, `({ type, op, accept, mode }) => void`; `mode` since `4.0.0`. Since `4.2.0` the Dictionary tab's `Import CSV` opens the browser's picker even with a callback set — see [File Dialogs](#file-dialogs). |
| `createKeyBindingMap()` | Returns the default key bindings as a new `KeyBindingMap` on every call — see [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (types) | A binding map, the union of its command names, and one binding. |
| `dictionaryRowChords(map)` | Since `4.2.0`. Returns, as a new `ShortcutOption[]` on every call, the chords with which the [Dictionary](../guide/guides/dictionary.md#adding-and-deleting-rows) tab's grid inserts and deletes rows under the `KeyBindingMap` you pass. The one that inserts rows above, `Alt+Shift+Enter` with the defaults, is in no binding — see [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (types) | Since `4.0.0`. The 25 display-language codes, and those codes plus `'system'`, which `setLocale()` takes — see [Display Language](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (type) | Since `4.0.0`. The options `getSchemaSQL()` takes: `statements`, `header` and, since `4.2.0`, `logicalNameAsComment` — see [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Since `5.0.0` `dist` holds one unminified file per module, each beside its declaration, and `package.json`'s `sideEffects` names only the two tag entries and two stubs the worker files need. So a bundler drops every module a page does not reach and minifies once:

- A named import from the root, such as `setExportFileCallback`, bundles neither element and no worker.
- `toImage` brings the image export worker and no element.
- `erd-editor.js` brings the editor and all three shared workers.
- `erd-viewer.js` brings the viewer and no worker, with English inside it and each other display language in a chunk of its own, loaded once a page asks for it.

`@dineug/erd-editor/engine.js` runs the document store with no DOM, so it works in a Web Worker — see [Remote Storage](./advanced/remote-storage.md).
It exports `createReplicationStore` and the `ReplicationStore` type. Since `3.10.0` it also exports the `ReplicationChange` type, `{ value: string; changed: boolean }`, which a replica's `change` listener receives — see [on@change](./advanced/remote-storage.md#onchange).
Since `4.0.0` a `ReplicationStore` also has a `runtimeValue`. Its `value` and the one a `change` hands over are the storage form a file holds, like the element's — see [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` is the headless peer the [MCP server](../mcp/introduction.md) edits a document through. It exists for that server, and these pages do not document it.

### File Dialogs

Import and export go through injectable callbacks, so a host without a browser file dialog — an IDE webview, for example — can supply its own.
The two are not symmetric: export hands you the finished file, while import only asks for one, and you push the content back in yourself.
Since `4.2.0` the Dictionary tab's `Import CSV` is the one import that never calls the import callback, whose `type` has no CSV value. It always opens the browser's own file picker, for `.csv` files — see [Importing and Exporting CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

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

The `fileName` the editor generates is `<database name>-<timestamp>` plus the file's extension, where the timestamp is the local time formatted `yyyy-MM-dd'T'HH_mm_ss`. A blank database name falls back to `unnamed`. A Dictionary CSV names its sheet before the extension, as in `<database name>-<timestamp>-words.csv`.
The export callback receives these files. Since `4.0.0` the SVG and the Code Generator's files are among them, and the `.sql` comes from the Schema SQL tab's `Save file` rather than straight from `Export`. Since `4.2.0` the Dictionary tab's CSV is among them too. [toImage()](./to-image.md) calls neither callback: it hands its image back to you.

| File | Extension | Blob `type` |
| --- | --- | --- |
| The JSON export | `.erd.json` | `application/json` |
| The Schema SQL tab's `Save file`, holding the text the tab shows — see [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | none |
| The [Export image](../guide/guides/file-import-export.md#image) dialog | `.png` or `.svg` | `image/png` or `image/svg+xml` |
| The Code Generator tab's `Save file` — see [Code Generator](../guide/guides/code-generator.md) | The language's: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` or `.mmd` | none |
| The Dictionary tab's `Export CSV`, holding every row of the sheet shown, whatever its search lists — see [Importing and Exporting CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

A host that picks a handler by extension needs one for each of them.

Left unset, the editor uses the browser's own download and file-picker behavior. Pass `null` to go back to it.

## Browser Support

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — the ES2022 baseline the published bundles are built against.
No polyfills are bundled. Add your own if you need to reach older browsers.

## Upgrading from 4.x

`5.0.0` is a major release. Check each of these when moving a page from 4.x:

- `import '@dineug/erd-editor'` no longer defines `<erd-editor>`. Import `@dineug/erd-editor/erd-editor.js` for its effect instead, or call `defineErdEditor()`, and keep your named imports from the root as they are. TypeScript does not flag a page left on the bare import, since the root's declarations still name the tag in `HTMLElementTagNameMap`, but the element it makes is a plain `HTMLElement`, so its first method call throws a `TypeError` — see [Registering the Elements](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- On a CDN the same holds for `https://esm.run/@dineug/erd-editor`, which now serves the root and defines nothing: import `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. The bare jsDelivr and unpkg URLs still serve the script-tag build, which defines `<erd-editor>` as before. An unversioned URL now serves the latest 5.x release; pin `@4.2.0` to stay on 4.x — see [CDN](#cdn) and [Script tag](#script-tag).
- The root defines nothing but still needs a DOM, so with server-side rendering a named import from it, such as `setExportFileCallback`, stays on the client-only path beside the element's entry — see [Server-side rendering](#server-side-rendering).
- `window.ErdEditor` gains `ErdEditorElement` and `defineErdEditor`. The viewer's script-tag build puts `ErdViewerElement` and `defineErdViewer` on `window.ErdViewer`, and neither global carries `toImage`.
- A `readonly` editor opens as a reader. Its six tabs, the Explorer, Quick Search and presence stay, and every control that would edit the diagram is gone rather than disabled: the toolbar shows the database name as text, the Settings tab shows its settings with every control disabled under a `Read only` badge, and the floating toolbar keeps only the zoom, the Name View, zen mode and the compass, so `Hand` and `Select` are gone and a drag pans. A press selects nothing: the one selection is the outline a jump from the Explorer or Quick Search puts round what it reaches, which a still click clears, and the select-all shortcuts select nothing. Turning `readonly` on ends what stood open, such as the selection, the hand tool, a cell editor, a drag, Map Columns, Auto Layout's `Force` preview and Time Travel, and keeps the scroll, the zoom, the tab and the Name View — see [readonly](./erd-editor-element.md#readonly).
- The settings a `readonly` reader changes stay on that editor's screen whatever their locks say: the scroll and zoom, the tab, the Name View, View Option, the database, and the Code Generator's language, name cases and bracket type. `value`, `runtimeValue` and the JSON export keep the document's own, which a 4.x reader's changes could reach, and `getSharedStore()` sends none of them to the other editors. `getSchemaSQL()` with no vendor writes the database the reader picked. Turning `readonly` off puts the database, the code settings and View Option back to the document's, and leaves the scroll, zoom, tab and Name View where the reader left them.
- The Settings tab's `Recalculation table width` row is gone. A load and a paste still fit each table's width to its text.
- On Vite 8 drop an `exclude: ['@dineug/erd-editor']` from `optimizeDeps`, which only Vite 7 and older still need, and keep the ELK `include` — see [Vite](#vite).

## Upgrading from 3.x

`4.0.0` is a major release. Check each of these when moving a page from 3.x, and then those of [Upgrading from 4.x](#upgrading-from-4x) for `5.0.0`:

- `editor.value`, a replica's `value` and the `value` its `change` hands over are the storage form a file holds: no removed entities, measured widths, stacking order or relationship anchors. Keep saving `value`, and read those from `runtimeValue`; entity timestamps (`meta`) are gone altogether. Seed a collaborator or a replica that joins a running session from a running peer's `runtimeValue`, not from `value` or the file, and never save `runtimeValue` — see [value](./erd-editor-element.md#value) and [runtimeValue](./erd-editor-element.md#runtimevalue).
- Setting locks replace `Save Scroll Information` and `Save Zoom Information`. A new document, and any document saved before `4.0.0`, has every lock on, so a scroll, a zoom, a tab switch, or a change of the Code Generator language, a name case or the bracket type leaves `value` as it was and fires no `change`. A page that kept the view through `change` needs `Viewport` (and `Canvas Type` for the tab) unlocked on the Settings tab, or a document whose `settings.lockSettings` leaves those bits clear — see [Lock](../guide/guides/settings.md#lock).
- `settings` no longer has `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` or `ignoreSaveSettings`, and the `SaveSettingType` constants are gone. `settings.lockSettings`, with the `LockSettingType` bits, takes the place of `ignoreSaveSettings`, which `4.0.0` or later neither reads nor writes — see [Settings](./advanced/schema.md#settings).
- The [JSON Schema](./advanced/schema.md#json-schema) every file names in `$schema` now describes the storage form alone and is closed: it rejects a file an earlier release saved until a save by `4.0.0` or later rewrites it.
- The document's garbage collection is gone with its worker, so a removed entity stays in `runtimeValue` until the document is next opened from its file. Three shared workers remain — see [Web Workers](#web-workers).
- Keep every editor and replica in a shared session on `4.0.0` or later. An earlier release ignores the new action types: those of table groups, Map Columns, the locks and the Schema SQL scripts — see [Mixing Releases](./advanced/collaborative-editing.md#mixing-releases).
- The import callback gets `mode: 'append'` for Import and Add, which a callback has to pass on. The export callback now also gets `.svg` and Code Generator files, and `Export` ▸ `Schema SQL` opens the Schema SQL tab instead of saving, so the `.sql` arrives only from that tab's `Save file` — see [File Dialogs](#file-dialogs).
- `Delete` and `Backspace` are bound to the new `removeSelection`. While the editor has focus outside a text field, the key's default is prevented on every tab, and on the ERD tab the selection is removed. `KeyBindingName` and `KeyBindingMap` gain it, and `setKeyBindingMap({ removeSelection: [] })` leaves both keys to the page — see [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` also takes `'system'`, the theme builder's `System`, which turning `systemDarkMode` on sets. `changePresetTheme` reports `'system'` while it is picked, so store it as it is and hand it back to `setPresetTheme`. With `systemDarkMode` on, a `setPresetTheme()` with `'light'` or `'dark'` now stays instead of being overwritten by the next OS change — see [systemDarkMode](./erd-editor-element.md#systemdarkmode) and [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` or later, the VS Code extension `4.0.0` or later and the Obsidian and JetBrains plugins `1.0.0` or later speak hub protocol 2. Server `1.0.0` or later and an earlier editor release that serves agents, or an earlier server and one of these editors, refuse each other with `protocolMismatch`, naming the side to update — see [Updating](../mcp/installation.md#updating).
- An unversioned CDN URL serves the latest release, 5.x since `5.0.0`. Pin `@3.10.0` to stay on 3.x — see [CDN](#cdn).
