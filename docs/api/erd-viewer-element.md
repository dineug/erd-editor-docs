---
sidebar_position: 3
description: The erd-viewer element API — a read-only diagram from a value or a src URL, its minimap and controls bar, the load and error events, theming, display language, focus and keys, loading, and what it adds to a page.
---

# ErdViewerElement

Since `5.0.0` the package also ships `<erd-viewer>`, a read-only view of a document: a reader pans, zooms, searches, and lights relationships, and nothing in it edits. It draws the ERD canvas alone, with its scrollbars, a [minimap](#minimap), a [controls bar](#controls), and a palette that searches the document, and has no toolbar, tabs, Explorer, or context menu.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

The frame above is this element as erd-editor.io/embed shows it, here with the bookstore sample: click it to focus it, then zoom and search with the keys in [Focus and Keys](#focus-and-keys), and see [Embedding](../guide/guides/embedding.md) to frame a document of your own without code.

The viewer is a plain `HTMLElement`.  
Its type definition is as follows.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Importing `@dineug/erd-editor/erd-viewer.js` defines `<erd-viewer>` and leaves `<erd-editor>` undefined. Importing the package root defines neither: it exports the class `ErdViewerElement` and `defineErdViewer()`, which defines the tag where you call it, so a page can also define the class under a tag of its own — see [Registering the Elements](./installation.md#registering-the-elements).  
Every entry but `engine.js` and `peer.js` needs a DOM, this one too, so a server-rendered page imports it on the client — see [Server-side rendering](./installation.md#server-side-rendering).  
Importing the entry adds `erd-viewer` to `HTMLElementTagNameMap`, so `document.createElement('erd-viewer')` and `document.querySelector('erd-viewer')` are typed `ErdViewerElement` without a cast.

Like the editor, the viewer renders into a closed shadow root, so `viewer.shadowRoot` is `null` and page styles do not leak in or out; style it through [setTheme](#settheme) and the `--erd-editor-*` custom properties. Several viewers on one page each keep their own document, view, theme, and language.  
`<erd-viewer>` has no intrinsic size. A custom element is inline, so give it `display: block` and a height, as above. The view fills the element's box and follows it as it resizes, keeping its zoom.

`src`, `name-view`, `minimap`, and `controls` are its only attributes, each with a property of the same name, `nameView` for `name-view`. [value](#value) is a property alone.  
A `value`, `src`, `nameView`, `minimap`, or `controls` set on the element before its tag is defined, for example by a framework that renders the element before the entry has loaded, is taken up once the tag is defined, over the attributes the markup gave it. They are taken up in the order the page first wrote each, so the later of `value` and `src` wins. A `value` that holds no document then has no caller left to throw to: it is reported as an uncaught error, and the viewer stays empty.

The script-tag build, `dist/erd-viewer.umd.js`, holds the viewer alone with every dependency. It defines `<erd-viewer>` and puts `ErdViewerElement` and `defineErdViewer` on `window.ErdViewer`. A CDN URL without a path serves the editor's build instead, so name the file — see [Script tag](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src

The URL of a document for the viewer to fetch and show. It is `''`, none, by default.  
The fetch is a plain `fetch()`, a `GET` with no options of its own, so the browser's CORS rules govern it: a document on another origin needs a server that allows the page's origin, and cookies go only to the page's own origin. A relative URL resolves against the page.  
The response has to hold a document as an `.erd.json` file does, the storage form the editor's [value](./erd-editor-element.md#value) and every official host write. No other format is read: a SQL, GraphQL, DBML, or AML file fails as text that does not parse.  
A document that parses lands fitted to the view and emits [load](#load). A request the network or CORS refused, a response that is not `ok`, or text that does not parse emits [error](#error) and leaves an empty diagram — see [Loading](#loading).

Only the latest request counts. A new `src` aborts the fetch still running, so a slow answer never lands over a later document. Assigning [value](#value) aborts it too, and so does removing `src` or setting it to `''`, which stops following it and leaves the document shown as it was.  
Whichever of `value` and `src` is set last wins, through the property or the attribute alike. A `src` written after a `value` is fetched even when it names the URL fetched before. Written again over the document it already shows, it fetches nothing.  
The viewer fetches only while it is in a page. Taking it out aborts a fetch still running, and putting it back fetches a `src` it has not shown, one that failed included, never one it already shows.  
`src` is the one `fetch()` the package makes, so a strict Content Security Policy lists the document's origin in `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value

### getter

Retrieves the document shown, whether it came from `src` or `value`, as a JSON string in the storage form the editor's [value](./erd-editor-element.md#value) writes. Before anything is shown it is a new, empty document, whose `doc` is `{}`.  
While the document's `Viewport` [lock](../guide/guides/settings.md#lock) is on, as it is in a new document, it writes the zoom and scroll the document is locked at, wherever the reader has moved the view. Only with that lock off does it write where the view stands, the fit a landing makes included.  
It writes the Name View the document holds, never the one [nameView](#nameview) or the controls bar shows over it, even in a document whose `Name View` lock is off.  
It still returns the document after [destroy](#destroy).

```js
const data = viewer.value;
```

### setter

Shows a document from its text, replacing the one shown, and fits it to the view — see [Loading](#loading). It takes the text a file or the editor's `value` holds.  
Text that does not parse throws before anything changes, and the document shown stays: a `SyntaxError` for text that is not JSON, a `TypeError` for JSON that holds no document, such as `7`. A blank string, or anything that is not a string, shows an empty diagram.  
Assigning it aborts a `src` fetch still running, and emits neither `load` nor `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView

Shows the diagram in a [Name View](../guide/guides/logical-names.md#name-view) over the one the document holds: `'physical'` for `Physical Names`, `'logical'` for `Logical Names`, or `'both'` for `Both Names`. `null`, the default, shows the document's own, and an attribute value other than the three reads as `null`.  
It stays in force over every document loaded after it, and [value](#value) never writes it. Removing the attribute goes back to the document's own view.  
The `Name View` list on the [controls bar](#controls) switches the view too, until the next document lands or `nameView` next changes. A switch there is not written to `value` either.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap

Shows the minimap in the top-right corner, while the document holds a table, a shown memo, or a shown table group. It is on by default.  
It works as the editor's does: click it to move the view there, or drag its viewport rectangle to pan — see [Getting Around the Canvas](../guide/guides/table-related-functions.md#getting-around-the-canvas). A finger on it is the page's until the viewer holds the focus.  
Only `minimap="false"` turns it off. A bare attribute, any other value, and no attribute all leave it on.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls

Shows the controls bar over the middle of the bottom edge of the canvas. It is on by default, and holds, from left to right:

- The zoom: `Zoom out`, the current zoom as a percentage, and `Zoom in`. The two buttons step the zoom as the zoom keys do, and clicking the percentage, `Reset zoom`, puts it back to `100%`. Each names its key in its tooltip.
- `Fit`, which zooms and scrolls so the whole diagram shows in the view, centered.
- `Name View`, a button that names the view in force and opens a list of `Physical Names`, `Logical Names`, and `Both Names` above the bar — see [nameView](#nameview).
- The `Go to content` compass, which joins the end of the bar only while none of the diagram is on screen, and takes the view to the nearest part of it.

The bar stands left to right in every language.  
Only `controls="false"` turns it off, its compass and its `Name View` list with it. A bare attribute, any other value, and no attribute all leave it on. Without the bar, the wheel, a pinch, and the keys still zoom once the viewer holds the focus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Event

`load` and `error` are the only two events, and both report on `src`. Neither bubbles, so listen on the element itself.

### load

Emitted once the document `src` names has been fetched and shown. `event.detail` is `null`.  
Assigning `value` emits none, and neither does a fetch that a later `src`, a `value`, taking the element out of the page, or [destroy](#destroy) aborted.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error

Emitted when fetching `src` fails: the network or CORS refused the request, the response was not `ok`, or its text did not parse. The viewer then shows an empty diagram and the notice `Couldn't load the diagram` — see [Loading](#loading).  
`event.detail` is the cause: the `TypeError` that `fetch()` rejects with, an `Error` naming the status, such as `GET /missing.erd.json answered 404 Not Found`, or the parser's `SyntaxError` or `TypeError`.  
A fetch that something aborted emits nothing.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme

Sets a preset theme, taking the editor's `ThemeOptions` — see [setPresetTheme](./erd-editor-element.md#setpresettheme).  
The viewer starts at `appearance: 'system'`, `grayColor: 'slate'`, and `accentColor: 'indigo'`, so from its first frame it shows the light or dark the operating system reports, and switches when that changes. The editor starts dark instead.  
Each field is applied on its own, so a partial call leaves the other two as they are. A value that is not one of the names is ignored, and the call never throws.  
The viewer has no theme builder and no `systemDarkMode`, and emits no event for a theme.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance

Names the light or dark that the `'system'` appearance shows, for a page with a light and dark of its own. While one is named, the operating system's changes are ignored.  
`null`, or any value other than `'dark'` or `'light'`, goes back to following the operating system.  
While the appearance is `'light'` or `'dark'` it changes nothing on screen, but the value is kept and applies as soon as the appearance becomes `'system'`. It emits nothing.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme

Overrides theme tokens on top of the preset, taking the editor's `Theme` tokens — see [setTheme](./erd-editor-element.md#settheme).  
Every call replaces the whole overlay, so pass `{}` to drop back to the preset. Only the token names, with string values, are kept, and a later `setPresetTheme` swaps the preset underneath while the overrides stay.  
The `--erd-editor-*` CSS custom properties reach the viewer too, set on the element or anywhere above it — see [CSS Variables](./erd-editor-element.md#css-variables). The canvas, which no stylesheet reaches, reads them again when a stylesheet in the page's `head` changes, or when the `class` or `style` attribute of the element or of an element above it changes. A rule added with `insertRule()` changes none of these, so the canvas takes it up at the next such change.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale

Sets the display language: `'system'`, the default, or one of the 25 codes the editor's [Display Language](./erd-editor-element.md#display-language) lists. Anything else, such as a bare `'ko'` or a value that is not a string, is ignored.  
The language changes the tooltips of the controls bar, the `Name View` list, the palette, the loading notices, and the words the diagram draws itself, such as `unnamed`. Names, comments, and the rest of the document are never translated.

English is part of the viewer's entry and applies before the call returns. Every other language is a module of its own, which your bundler emits as a chunk beside the viewer and the viewer fetches from your bundle the first time a page asks for that language, once for every viewer of the page. Until it lands, the viewer keeps showing the language it showed, English on a first frame. If it fails to load, the viewer shows English, and asking for that language again tries again.  
The [script-tag](./installation.md#script-tag) build holds all 25 languages, so it fetches none. A bundle that also holds the editor loads every language with the editor's chunk — see [Registering the Elements](./installation.md#registering-the-elements).  
The `Promise` it returns resolves once that language has landed or failed to, and never rejects. That language, or English after a failure, is then in force, unless a later call asked for another: the later call wins, whatever order the languages land in.

Hebrew, Arabic, and Persian lay the palette and the loading notices out right to left. The canvas, the minimap, the scrollbars, and the controls bar with its compass stay left to right, as the editor's canvas does — see [Right-to-left Languages](../guide/guides/language-and-theme.md#right-to-left-languages).  
The viewer sets `lang` and `dir` on its own root inside the closed shadow root, never on the host element or the page.  
It emits nothing, and the viewer has no language picker and stores nothing.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale

Names the language `'system'` stands for, as a BCP 47 tag, for a page with a language setting of its own.  
The tag is trimmed. `null`, a blank string, or a value that is not a string goes back to the page's languages.  
Those are the page's `<html lang>`, then the browser's `navigator.languages`, read once, as the viewer first connects. `'system'` takes the first of them that the viewer has a language for, by the editor's rule in [setSystemLocale](./erd-editor-element.md#setsystemlocale), and English when it has none of them. So a page whose `<html lang>` names a language the viewer has shows that language whatever the browser prefers, and a later change of `lang` or of the browser's languages moves no viewer.  
It matters only while the option in force is `'system'`, and its `Promise` resolves as [setLocale](#setlocale)'s does.

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy

Ends the viewer for good. It takes the view down before it returns, whether the element is still in the page or was taken out first, aborts a `src` fetch still running, and stops following the operating system's color scheme and the page's styles.  
A destroyed viewer draws nothing more, fetches nothing, and asks for no language, even when added to a page again. Reading [value](#value) still returns the document it held.  
Taking the element out of the page does not destroy it: put back, it goes on, and fetches a `src` it has not shown yet — see [Loading](#loading).

```js
viewer.destroy();
```

## Focus and Keys

A viewer takes no focus as it mounts, as a document lands, or as its palette closes, so it never scrolls the page to itself or takes the page's keys.  
A click or a tap on its canvas focuses it without scrolling the page, and it is one stop of the `Tab` key. Unlike the editor, it has no `focus()` or `blur()` member of its own. A press anywhere else on the page takes the focus away again.

Until the viewer holds the focus, the page keeps the wheel, which scrolls the page, and a trackpad pinch. A finger on the canvas scrolls the page and pans nothing, and every key reaches the page unprevented.  
Once it holds the focus:

- The wheel pans the view, and `Shift + Wheel` pans it sideways. Over a memo whose text overflows, the wheel scrolls the memo.
- `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac), a trackpad pinch, or two fingers on a touch screen zoom.
- A finger pans the view.
- `Ctrl + Plus` and `Ctrl + Minus` (Windows/Linux) or `⌘ + Plus` and `⌘ + Minus` (Mac) step the zoom as the `Zoom in` and `Zoom out` buttons do, and `Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac) goes straight back to `100%`, keeping the middle of the screen where it is.
- `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac) opens the palette, and `Esc` closes it.

Those are its only keys, and they cannot be rebound. Every other key reaches the page unprevented, focused or not: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F`, and every chord that edits in the editor.

The palette searches the document alone and lists no command. Its empty input shows the prefixes: `#` searches the tables, `@` the columns, `:` the comments and memos, and `?` lists the prefixes, as in the editor — see [Searching the Diagram](../guide/guides/quick-search.md#searching-the-diagram). A word with no prefix shows `No commands match` above the rows that search the diagram for it.  
Choosing a row moves the view by the editor's rule, [Where a Jump Lands](../guide/guides/table-related-functions.md#where-a-jump-lands), leaving the zoom as it is, and outlines what it reached, brought to the front: the table, the table that holds the column or comment, or the memo.  
Choosing a row or pressing `Esc` closes the palette and leaves the focus with no element, so the next wheel scrolls the page; click the view to give it the wheel and the keys again. While the palette is open, the wheel scrolls its list, and the zoom keys do nothing.

Focused or not, a drag with the main mouse button pans the view from anywhere on the canvas, over a table too. A click or a tap that does not move lights relationships: on a table, that table's relationships; on a relationship line, that line; anywhere else, a memo included, it puts the light out. Such a click also clears the outline a palette jump left. The pointer resting on a table lights its relationships while it is there.  
No press selects, moves, or edits anything. There is no selection but a jump's outline, no marquee, and no double click or `Enter` opens a cell.

## Loading

While `src` loads, a notice over the middle of the canvas reads `Loading diagram` beside a turning loader. Once a load fails, it reads `Couldn't load the diagram` beside a warning sign, until a new `src` or a `value` takes its place or `src` is removed. Presses go through the notice to the canvas, and it reads in the display language, right to left in a right-to-left one.

Every document that lands, from `src` or from `value`, is fitted to the viewer's box: zoomed and scrolled so the whole diagram shows, centered, as `Fit` does, the zoom and scroll the file saved left aside. A document handed over before the viewer has a size, set before it is in a page or while its box is empty, is fitted once it has one. A later resize keeps the zoom; `Fit` fits again.

The viewer fetches a `src` only while it is in a page. Taking it out aborts a fetch still running, and putting it back fetches a `src` it has not shown, one that failed included, never one it already shows. A viewer no longer needed is ended with [destroy](#destroy).

## What It Adds to a Page

- No worker. It starts none, so a Content Security Policy needs no `worker-src` for it.
- No storage. It writes no cookie, `localStorage`, `sessionStorage`, or IndexedDB.
- Two kinds of request: the [src](#src) fetch, whose origin a strict policy lists in `connect-src`, and the module of a display language other than English, from your own bundle — see [setLocale](#setlocale).
- Styles in constructed stylesheets, which a strict `style-src` lets through. A browser without constructed stylesheets, such as Firefox before 101, gets `<style>` elements instead, which need `style-src 'unsafe-inline'`.
- Listeners on `window`. Importing the entry adds three for the life of the page, for `mousedown`, `touchstart`, and the package's own `@dineug/erd-editor/internal-forward-move-start` event. Konva, which draws the canvas, sets `window.Konva` and, with its first stage, adds mouse and touch listeners to `window` and a `visibilitychange` listener to `document`, which it never removes. The editor's entry adds the same.
- Until [destroy](#destroy), each viewer follows the operating system's color scheme and watches the page's styles for the custom properties [setTheme](#settheme) describes.
