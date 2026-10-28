---
sidebar_position: 18
description: Show a diagram read-only on another site without code by framing erd-editor.io/embed, build its URL and iframe line in the builder, set the theme, language, Name View, minimap, controls, and colors in the URL, and serve the file from GitHub or a server that allows CORS.
---

# Embedding

[erd-editor.io/embed](https://erd-editor.io/embed) shows a diagram read-only in a viewer that fills the page, for another site to frame: a wiki, a blog, a site builder, or any page that cannot load scripts of its own.  
Its `src` parameter names the document, the address of a file as ERD Editor saves it, such as an `.erd.json` file. The rest of the URL sets how the viewer shows it, and the builder at the same address writes the URL and its iframe line for you.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

This frame shows [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) from the erd-editor repository, and this is the line that puts it in a page:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## What the Frame Shows

The frame shows the diagram's tables, columns, relationships, memos, and table groups, and nothing in it edits the diagram or the file.  
The diagram is fitted to the frame as it loads, whatever zoom and scroll position the file saved, so the frame's size decides the zoom it opens at.

Over the canvas are:

- The minimap, while the diagram has content.
- The controls bar at the bottom: `Zoom out`, the zoom level, which resets the zoom when clicked, `Zoom in`, `Fit`, the `Name View` list, and `Go to content` while none of the diagram is on screen.
- The `erd-editor.io` link at the bottom right, which opens erd-editor.io in a new tab and sends it no referrer, so the click tells the site nothing of the document the frame shows. In a narrow frame it can cover part of the controls bar.

While the file loads, the frame shows `Loading diagram`. If it cannot be fetched or holds no document, the frame shows an empty diagram with `Couldn't load the diagram` — see [Files on GitHub](#files-on-github) and [Files on Other Servers](#files-on-other-servers).

The frame follows its URL and the visitor's system alone. A visitor's own language and theme on erd-editor.io do not apply in it.

## The Builder

Open [erd-editor.io/embed](https://erd-editor.io/embed) with no `src` to get the builder, a page titled `Embed a diagram`:

1. Paste the document's address into `Document URL`. It applies when you press `Enter` or leave the field, so typing fetches nothing. Once it applies, a `Loads from` line under the field names the address the viewer fetches: the one you gave, or, for a page on GitHub, its address on GitHub's raw host — see [Files on GitHub](#files-on-github).
2. Pick the options. Each one applies at once to the preview, the URL, and the iframe line:
   - `Theme`: `System`, `Light`, or `Dark`.
   - `Display Language`: `System`, with the language it stands for in your browser beside it, then the 25 languages, each in its own name.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names`, or `Both Names`. `As Saved` shows the Name View the file saved.
   - `Accent color` and `Gray color`, each listed by name with a swatch.
   - `Minimap` and `Controls`, two switches, both on.
   - `Height`, in pixels, `480` to start with. A height that is not a positive whole number counts as `480`.
3. Check the `Preview`: the viewer as the frame will show it, with the `erd-editor.io` link, in a box as high as `Height`. Its `System` language is your browser's, whatever language erd-editor.io itself is showing.
4. Copy the result. `Embed URL` is the address of the frame, and `Embed code` the iframe line, with the height you set and the width `100%`. Each has a `Copy` button, which stays disabled until a document URL applies, and which reads `Copied` for a moment after a copy, until a change rewrites what it copied.

Clearing `Document URL` empties the preview and the two results once it applies.

## URL Parameters

| Parameter | Values | Default |
| --- | --- | --- |
| `src` | The document's address, URL-encoded. | None: without it, or with an empty one, the page is the builder. |
| `theme` | `light`, `dark`, or `system`. | `system`: the light or dark mode the visitor's browser reports. |
| `locale` | `system`, or a code from the [language table](./language-and-theme.md#display-language), such as `de-DE`. | `system`: the visitor's browser languages, matched as [System](./language-and-theme.md#what-system-follows) matches them, and English when the viewer has none of them. |
| `name-view` | `physical`, `logical`, or `both`. | The Name View the file saved. |
| `minimap` | `false` hides the minimap. | Shown. |
| `controls` | `false` hides the controls bar. | Shown. |
| `accent-color` | One of the 26 accent colors of the [theme builder](./language-and-theme.md#theme), such as `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive`, or `sand`. | `slate` |

The defaults are the viewer's own, not those of the web app, which starts on `jade` and `olive`.

- The builder leaves each option at its default out of the URL, so an embed URL holds only what differs.
- A value the viewer does not take is ignored, and its option keeps the default. Values are matched exactly as listed, so `theme=Dark` is ignored, and `minimap` and `controls` stay shown for any value but `false`.
- A parameter given twice takes its first value.
- `src` is URL-encoded, as the builder writes it, since an address holding an `&` or a `#` of its own is otherwise cut short.

## Files on GitHub

A file or a gist on GitHub can be given by the address its page shows, as the frame above is. The viewer fetches it from GitHub's raw host instead, which answers another site's request where the page's own address does not:

- A file's page, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, or its `raw` address, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, loads from `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` is a branch, a tag, or a commit: a branch shows the file as that branch has it, and a tag or a commit keeps that version.
- A gist's page, `https://gist.github.com/<user>/<id>`, loads from `https://gist.githubusercontent.com/<user>/<id>/raw`, which is the gist's first file. Keep the diagram as the gist's only file.

The embed URL keeps the address you gave, and the builder's `Loads from` line shows the one fetched.  
This works for public repositories and public gists only. The raw host caches each file for five minutes, so a change you push can take that long to show in the frame.

## Files on Other Servers

The viewer at erd-editor.io fetches the file with a plain `GET` from the visitor's browser, so the server holding it has to allow that cross-origin request (CORS): its answer needs an `Access-Control-Allow-Origin` header that allows `https://erd-editor.io`, such as `*`.  
The request carries no cookies, so the file has to be readable without signing in.  
Without that header, or for an address that answers with an error or with something other than an ERD Editor document, the frame shows `Couldn't load the diagram`.

## In the Frame

The frame takes no wheel, gesture, or key until a visitor clicks or taps it or reaches it with `Tab`. Until then, the wheel, a swipe, and a pinch scroll or zoom the page around it as usual.  
Once it has the focus, the wheel pans the diagram, `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac) and a pinch zoom it, and `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac) opens a search over the document, where `#` finds a table, `@` a column, and `:` a comment or memo.  
A drag pans the diagram whether the frame has the focus or not, and a click or a tap lights relationships: those of the table clicked, or the one relationship clicked. The table the pointer rests on lights its own. See [Focus and Keys](../../api/erd-viewer-element.md#focus-and-keys) for every key.

To try it on a larger diagram, zooming and searching, open the [bookstore sample](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), nine tables and two table groups, in a page of its own.

## Analytics

erd-editor.io counts visits to the frame with Google Analytics, as it counts visits to the web app. The address it records for a frame is `erd-editor.io/embed` alone, without the document address that `src` names.  
See the [Privacy Policy](https://erd-editor.io/privacy).

## Loading the Viewer Yourself

A page that can load scripts can show a diagram with the [`<erd-viewer>`](../../api/erd-viewer-element.md) element from the `@dineug/erd-editor` package instead. It takes the same options as attributes and methods, makes no request to erd-editor.io, and can load a document from the page's own site, which needs no CORS.
