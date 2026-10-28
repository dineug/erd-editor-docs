---
sidebar_position: 4
description: Draw a document as a PNG or an SVG from your own code with toImage, using the Export image dialog's options, in a browser and in the export worker where there is one.
---

# toImage

Since `5.0.0` the package root exports `toImage()`, which draws a document as a PNG or an SVG with no editor on the page.  
It writes the files the [Export image](../guide/guides/file-import-export.md#image) dialog's `PNG` and `SVG` buttons write, with the dialog's three options, `Background`, `Dark mode` and `Scale`, and no other.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` is exported as a type beside it — see [Entry Points](./installation.md#entry-points).

## value

The document's text: what an `.erd.json` file holds, an editor's [value](./erd-editor-element.md#value) or [runtimeValue](./erd-editor-element.md#runtimevalue), or any other text [setInitialValue](./erd-editor-element.md#setinitialvalue) loads.  
Empty text, or whitespace alone, draws an empty diagram, and so does JSON that holds none of a document's fields, which the parser fills with defaults.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `format` | None; it is required | `'png'` resolves to a `Blob` of type `image/png`, `'svg'` to the SVG's markup as a string. |
| `background` | `true` | Paints the canvas color behind the diagram. `false` leaves it transparent, the box under an ON DELETE or ON UPDATE label included. |
| `darkMode` | `false` | Draws the dark theme in place of the light one. |
| `scale` | `2` | `1`, `2`, or `3` image pixels per unit of the diagram at 100%. It sizes the PNG alone; an SVG is the diagram's size whatever the scale. |

`toImage()` reads no other key, so a key the table does not list changes nothing.

## What It Draws

The image is the one the dialog draws:

- The whole diagram, cropped to what it draws plus a margin and always at 100%, whatever zoom the document was saved at, so every table is drawn in full. What [View Option](../guide/guides/table-related-functions.md#table-view-options) hides in the document is neither drawn nor given room, table groups are drawn behind everything else, and the colors the [dictionary checks](../guide/guides/dictionary.md#marks-on-the-canvas) give names are not drawn.
- A PNG is the size of the diagram at 100% times `scale`. One too large for a browser canvas is written at a reduced resolution rather than failing, and `toImage()` does not say so.
- An SVG keeps its text as text and names its fonts rather than embedding them, so a viewer without the editor's font draws another. Shadows are left out.

Where the dialog takes the editor's screen, `toImage()` takes the document alone, so a document draws alike on every page:

- Its colors are the preset of the element's default gray and accent, `slate` and `indigo`, light unless `darkMode` is `true`. No theme of the page's, no [setTheme](./erd-editor-element.md#settheme) override and no [theme builder](../guide/guides/language-and-theme.md) change reaches it.
- Its tables and columns are named in the [Name View](../guide/guides/logical-names.md#name-view) the document holds, which for a file with its `Name View` lock on is the locked one.
- The words the diagram draws itself, such as an unnamed table's placeholder, are in English.

## Where It Runs

`toImage()` needs a browser page, since it measures and draws on a canvas. The package root it comes from needs a DOM to load, so it is not reached from Node or a Web Worker — see [Server-side rendering](./installation.md#server-side-rendering).  
It waits for the page's fonts to finish loading before it draws.

It draws in the image export's shared worker where the host runs one, as the dialog does, so the page stays responsive meanwhile, and on the main thread where there is none or the worker does not answer in time — see [Web Workers](./installation.md#web-workers).  
A bundle that imports `toImage` and no element carries the image export worker alone.  
Neither [script-tag](./installation.md#script-tag) build carries it: `window.ErdEditor` and `window.ErdViewer` have no `toImage`.

## Rejections

The Promise it returns rejects, before anything is drawn, when:

- the page has no `document`: an `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` is not a string, such as a document already parsed into an object: a `TypeError`;
- an option holds a value the [Options](#options) table does not list, a missing `format` included, and so does a `scale` of `'2'` passed with an SVG: a `TypeError` naming the option, as in `toImage: scale cannot be 4`;
- the text is not a document the parser can read: the parser's error, a `SyntaxError` for text that is not JSON.

## Export Image Dialog

The dialog and `toImage()` draw through the same export, so with the same options they write the same image, but they start from different places:

| | `Export image` dialog | `toImage()` |
| --- | --- | --- |
| Document | The diagram as it stood when the dialog opened | The text you pass |
| Dark mode | Starts out matching the editor's appearance, and while it matches draws the screen's own colors | Off unless `darkMode` is `true`, and always the preset |
| Name View | The one the editor shows | The one the document holds |
| Language of its own words | The editor's display language | English |
| Result | Saved through the browser or the [export callback](./installation.md#file-dialogs), or copied to the clipboard | Handed back to you; neither file callback is called |

`Copy to clipboard` has no counterpart. A page that wants one writes the PNG `Blob` to the clipboard itself.
