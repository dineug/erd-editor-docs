---
sidebar_position: 1
description: Install @dineug/erd-editor from npm or a CDN, mount the custom element, add syntax highlighting, and wire up the file dialogs.
---

# Install

```sh
npm install @dineug/erd-editor
```

The package is ESM-only (`"type": "module"`) and ships only its `dist` folder.
There is no CommonJS build, so `require('@dineug/erd-editor')` does not work.

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

`setInitialValue('')` starts an empty document. Assigning `value` loads one as an edit instead, so it lands in the undo history.
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

The unversioned URL always serves the latest release. Pin a version — `https://esm.run/@dineug/erd-editor@3.4.0` — if you do not want a major upgrade to reach your page unannounced.

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder></erd-editor>
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

Adding `readonly` here blocks editing: assigning `value`, calling `clear()` and every `setSchema*()` are ignored, and the `change` event never fires. Reading `editor.value` still works. Load with `setInitialValue()` instead.

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

## Syntax Highlighting

The Schema SQL and Code Generator panels render as plain text unless you supply a highlighter.
[`@dineug/erd-editor-shiki-worker`](https://www.npmjs.com/package/@dineug/erd-editor-shiki-worker) runs one in a shared worker.
It is a separate install, because Shiki and its grammars build out to well over a megabyte.

```sh
npm install @dineug/erd-editor-shiki-worker
```

```js
import { setGetShikiServiceCallback } from '@dineug/erd-editor';

// deferred, so the highlighter never lands in your main chunk
import('@dineug/erd-editor-shiki-worker').then(({ getShikiService }) => {
  setGetShikiServiceCallback(getShikiService);
});
```

From a CDN:

```html
<script type="module">
  import { setGetShikiServiceCallback } from 'https://esm.run/@dineug/erd-editor';
  import { getShikiService } from 'https://esm.run/@dineug/erd-editor-shiki-worker';

  setGetShikiServiceCallback(getShikiService);
</script>
```

Register it once, before or after the editor mounts. Panels already on screen re-render when the highlighter arrives.
It covers SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, and Python. The `AML` and `DBML` [Code Generator](../guide/guides/code-generator.md) targets have no grammar in the bundle, so those panels stay plain text.

Two things can stop it. A page with a strict CSP needs `worker-src data:`, since the worker is inlined as a `data:` URI.
Where `SharedWorker` is missing — Chrome on Android, Safari before 16.4 — no highlighter is returned and the panels stay plain text.

## Entry Points

Importing `@dineug/erd-editor` registers `<erd-editor>` as a side effect. Beyond that it exports the element type and three callback setters.

| Export | Description |
| --- | --- |
| `ErdEditorElement` (type) | The element interface — see [ErdEditorElement](./erd-editor-element.md). |
| `setGetShikiServiceCallback(cb)` | Supplies the syntax highlighter, `() => ShikiService \| null`. |
| `setExportFileCallback(cb)` | Replaces the browser download, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Replaces the browser file picker, `({ type, op, accept }) => void`. |

`@dineug/erd-editor/engine.js` is a second entry point. It runs the document store with no DOM, so it works in a Web Worker — see [Remote Storage](./advanced/remote-storage.md).

### File Dialogs

Import and export go through injectable callbacks, so a host without a browser file dialog — an IDE webview, for example — can supply its own.
The two are not symmetric: export hands you the finished file, while import only asks for one, and you push the content back in yourself.

`op` is `set` or `diff` — a `diff` goes to `setDiffValue()`, whatever the `type`. Otherwise `type` picks the method, and `accept` carries that type's extensions, ready to hand to a host file dialog.

| `type` | `accept` | Method |
| --- | --- | --- |
| `json` | `.json` | `editor.value = text` |
| `sql` | `.sql` | `editor.setSchemaSQL(text)` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text)` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text)` |
| `aml` | `.aml` | `editor.setSchemaAML(text)` |

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.value = text;
  } else if (type === 'sql') {
    editor.setSchemaSQL(text);
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text);
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text);
  } else if (type === 'aml') {
    editor.setSchemaAML(text);
  }
});
```

Dispatch on every `type` you handle and ignore the rest.
Assigning `value` clears the document before it parses, so routing a payload there that is not an `.erd.json` document — through a catch-all `else`, or because a `type` added later fell through — empties the diagram instead of importing anything.

The `fileName` the editor generates is `<database name>-<timestamp>` plus `.erd.json`, `.sql`, or `.png`, where the timestamp is formatted `yyyy-MM-dd'T'HH_mm_ss`. A blank database name falls back to `unnamed`.

Left unset, the editor uses the browser's own download and file-picker behavior. Pass `null` to go back to it.

## Browser Support

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — the ES2022 baseline the published bundles are built against.
No polyfills are bundled. Add your own if you need to reach older browsers.
