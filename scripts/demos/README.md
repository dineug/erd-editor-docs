# Demo recorder

Scripted screen recordings of the editor for the docs. Each scene drives the
real `<erd-editor>` through Playwright and is written to `static/img/` as an
animated WebP at 2x (30fps), or as a PNG still.

## Requirements

- An erd-editor checkout with dependencies installed and its workspace
  libraries built, next to this repo (`../erd-editor`) or at `ERD_EDITOR_DIR`.
  Playwright and its Chromium come from that checkout.
- An `ffmpeg` built with the `libwebp_anim` encoder: on `PATH`, at
  `FFMPEG_PATH`, or linked at `scripts/demos/.out/bin/ffmpeg`. Homebrew's
  `ffmpeg` may lack it (check `ffmpeg -encoders | grep webp`); the binary the
  `ffmpeg-static` npm package installs has it.

## Usage

```bash
node scripts/demos/run.mjs                     # record every scene
node scripts/demos/run.mjs demo-table-edit     # record some scenes
node scripts/demos/run.mjs --debug demo-zoom   # run without recording, step screenshots only
node scripts/demos/run.mjs --list
```

The run uses the erd-editor dev server on `DEMO_PORT` (default `5231`) when one
is up, and starts one for the run otherwise. Scratch output — frames, step
screenshots and a one-tile-per-second `review.png` — goes to
`scripts/demos/.out/<scene>/`, which is ignored.

## Scenes

One file per output in `scenes/`; files starting with `_` are shared helpers
and are not loaded as scenes.

```js
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';

export default {
  name: 'demo-table-color', // output: static/img/demo-table-color.webp
  width: 800, // viewport in CSS pixels, captured at 2x
  height: 450,
  async setup(d) {
    // Not recorded. Seed the document and get the page into its first state.
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      tables: { members: { x: 60, y: 60 }, orders: { x: 460, y: 220 } },
      settings: { databaseName: 'shop' },
    });
  },
  async scenario(d) {
    // Recorded from the first call to the last.
    const header = await d.tableBox('members');
    await d.click(header.x + 40, header.y + 4);
    await d.press('Alt+KeyK');
    await d.sleep(1200);
  },
};
```

`d` carries the page and the gestures a person makes: `moveTo`, `click`,
`dblclick`, `rightClick`, `drag`, `press` (shows the keys as keycaps),
`holding` (holds modifiers with their keycaps up), `keys`, `type`, `wheel`,
`chooseFile`. Scene geometry comes from `tableBox`, `columnBox`, `nodeBox`
(any Konva node on the `canvas`, `minimap` or `visualization` stage) and
`domBox` (an element in the editor's shadow root). `still(file, clip)` saves a
PNG; a scene that only takes stills sets `stillOnly: true`.

Seeds live in `seeds/`; `readSeed` falls back to erd-editor's own `data/`
fixtures, so `readSeed('sakila.sql')` works too.
