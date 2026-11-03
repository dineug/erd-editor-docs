# lib

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

The recorder's runtime. `recorder.mjs` runs one scene and encodes it, `seed.mjs` loads
the starting document, and `overlay.js` paints the pointer and keycaps that headless
Chromium does not draw.

## Key Files

| File | Description |
|------|-------------|
| `recorder.mjs` | `record(scene, { debug = false } = {})`, the `d` object it hands to `setup` and `scenario`, and the helpers and constants below |
| `seed.mjs` | `readSeed(file)`, `seedSQL(demo, sql, { tables = {}, settings = {}, only, patch } = {})`, `seedDoc(demo, doc)`. `readDoc` is module-private |
| `overlay.js` | A plain script, not a module, read as text and passed to `page.addInitScript` so it runs before the editor loads |

## For AI Agents

### Working In This Directory

- **`recorder.mjs` exports.** The path constants are `DEMOS_DIR`, `ROOT`, `OUT_DIR` and
  `IMG_DIR`. `ERD_EDITOR_DIR`, `PACKAGE_DIR`, `PORT` and `FIXTURE_URL` come from the
  environment (see `../AGENTS.md`). The functions are `sleep(ms)`, `center(box)`,
  `record`, and these two:
  - `labelsOf(combo)` turns `'Alt+KeyN'` into `['⌥', 'N']` through `KEY_LABEL`.
    `ControlOrMeta` shows as `⌘` on macOS and `Ctrl` elsewhere.
  - `withLists(doc)` fills in, in place, the five `doc.*Ids` lists and the seven
    `collections.*Entities` maps. The storage form leaves them out when they are empty
    (since erd-editor 4.2.0), so without it `doc.doc.tableIds.find(…)` throws on an empty
    diagram. `d.value()` and `seed.mjs` both apply it.
- **What `record()` does.** It loads Playwright from `PACKAGE_DIR` and opens a context
  with viewport `width`×`height`, `deviceScaleFactor: scale`, `colorScheme: 'dark'`,
  clipboard read/write and `locale: 'en-US'`. The locale is pinned because the editor
  follows `navigator.languages` once a scene turns on the locale picker, and the clips
  must match the docs' English labels. Next it adds the overlay, opens
  `scene.url ?? FIXTURE_URL` and waits for `window.__erdStages.canvas`. It runs `setup(d)`
  and `whenDrawn()`, moves the real pointer to `d.mouse` and waits 400 ms. None of this
  is recorded. The clip is a CDP `Page.startScreencast` from its first frame until
  `scenario` resolves. Frames keep their real timestamps, and ffmpeg resamples them to
  30 fps `libwebp_anim` (the scene's `lossless`/`quality`, `-compression_level 6`,
  `-loop 0`), then tiles `review.png`. With `debug` or `stillOnly` there is no capture,
  only `shot('start')`, `scenario`, `shot('end')`.
- **One capture at a time.** A capture holds the `.out/.capture.lock` directory, because a
  second browser encoding frames beside it drops frames from both. Debug runs, stills and
  encodes don't take it. A lock older than 4 minutes is removed as stale, so a killed run
  blocks the others for up to 4 minutes. Delete it only when no `run.mjs` is running.
- **The `d` object.** Properties: `page`, `sleep`, `width`, `height`, and `mouse`, a copy
  of the tracked pointer position. Every gesture moves through `moveTo`, which tracks where
  the next one starts, so after a raw `page.mouse.move` the next glide jumps
  (`syncPointer` in `_vsc-helpers.mjs` re-syncs it).
  - Gestures: `moveTo(x, y, duration = 600)` (cubic ease, one move per ~16 ms),
    `click(x, y, { button = 'left', modifiers = [], duration, clickCount = 1 } = {})`,
    `dblclick(x, y, options = {})`, `rightClick(x, y, options = {})`,
    `drag(from, to, { duration = 900, modifiers = [], holdBefore = 120, holdAfter = 90 } = {})`,
    `type(text, delay = 80)` (plus 0–35 ms jitter a character),
    `wheel(deltaY, { deltaX = 0, steps = 1, gap = 60 } = {})` and
    `chooseFile(trigger, { name, content, mimeType = 'application/octet-stream' })`, which
    has no caller (the five file-picker scenes, `demo-dictionary-import`, `demo-diff-viewer`,
    `demo-import-and-add`, `demo-import-json` and `demo-import-sql`, inline the same
    `filechooser` pattern).
  - Keys: `press(combo, { badge = true, hold = 950 } = {})` shows the keycaps 130 ms before
    the key goes down. `keys(labels, hold = 950)` shows keycaps and presses nothing.
    `holding(modifiers, fn, { label } = {})` releases the keys and hides the keycaps even
    when `fn` throws.
  - Output: `still(file, clip)` writes `static/img/<file>` at device scale with
    `#demo-cursor` hidden. `shot(label)` runs only in debug: it waits 250 ms, then writes
    `.out/<name>/shot-NN-<label>.png` at CSS scale. While recording it does nothing, so
    scenes keep their shots.
  - Document: `value()` reads the element's `value` through `withLists`.
    `tableId(name)` and `columnId(tableName, columnName)` throw when the name is absent.
  - Geometry, in viewport CSS px: `nodeBox(selector, stageName = 'canvas', index = 0)`
    (`#id` through `findOne`, `.name` through `find`), `tableBox(name)`,
    `columnBox(tableName, columnName)` and `domBox(selector, index = 0)` (queries
    `window.__erdShadowRoot`). All four return `null` when the node is not drawn, so
    check the result. `tableBox` and `columnBox` throw first when the name is not in the
    document.
  - `whenDrawn()` awaits `window.__erdWhenDrawn?.()` and then two animation frames. The
    fixture defines `__erdWhenDrawn` only with `?sceneMirror=1`, and `FIXTURE_URL` has no
    query, so here it waits two frames and no tweens. After an animation, wait for the
    state you need.
- **`seed.mjs`.** `readSeed(file)` reads `../seeds/<file>`, or else
  `$ERD_EDITOR_DIR/data/<file>`. `seedSQL` runs the element's `setSchemaSQL` and polls every
  300 ms until two reads give the same table layout. It then keeps only the `only` tables
  (with their relationships and indexes) and merges `tables[name]` into each `ui`
  (position, `color`). It sets `originX`/`originY` to 0 and `zoomLevel` to 1, which
  `settings` can override. Next it calls `patch(doc, byName)` and loads the result with
  `seedDoc`, whose `setInitialValue` clears the undo history, so a scene opens with nothing
  to undo. An unknown name in `tables` throws, while one in `only` is silently ignored.
  SQL with no table throws `seedSQL: the imported tables never settled`.
- **`overlay.js`.** It injects three things:
  - `#demo-cursor`, an SVG pointer shaped by the computed `cursor` of
    `composedPath()[0]`, which works because the fixture reopens the editor's shadow root.
    It re-reads the shape every frame, since the editor changes the cursor without the
    pointer moving. `window.__demoCursorLock` overrides the shape.
  - A `.demo-ripple` on every mousedown.
  - The `#demo-keys` keycap bar, driven by `window.__demoKeys(labels, holdMs)` and
    `window.__demoHideKeys()`. Its CSS variable `--demo-keys-bottom` defaults to `72px`.

### Testing Requirements

- After an edit here, `--debug` a scene that uses the changed code, then record one and
  read its `review.png` (commands in `../AGENTS.md`).

### Common Patterns

- Non-obvious values carry their reason in a comment beside them: the lossless default,
  the `en-US` pin, the lock. Update the comment when you change the value.

## Dependencies

### Internal

- `seed.mjs` imports from `recorder.mjs`, and `recorder.mjs` reads `overlay.js` at import.
- The fixture's globals `__erdStages` (`canvas`, `minimap`, `visualization`),
  `__erdShadowRoot` and the optional `__erdWhenDrawn` are documented in
  `$ERD_EDITOR_DIR/packages/erd-editor/e2e/README.md` ("Reaching the stage directly").

### External

- Playwright's `chromium` and a CDP session, from the checkout. ffmpeg runs through
  `execFileSync`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
