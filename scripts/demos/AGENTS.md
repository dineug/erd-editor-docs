# demos

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-26

## Purpose

The recorder behind every `demo-*.webp` clip and both PNG stills in `static/img/`. It
drives the real editor's e2e fixture in Playwright's Chromium and encodes the screencast
with ffmpeg. `README.md` is the human guide (requirements, the four commands, a minimal
scene, the gesture list). This file adds what the code does beyond it.

## Key Files

| File | Description |
|------|-------------|
| `run.mjs` | CLI entry. Loads the scenes, finds or starts the dev server, records the selected scenes one at a time, and stops a server it started |
| `README.md` | Human guide to the recorder. Keep it in step with `run.mjs` and `lib/` |
| `seeds/shop.sql` | The only local seed. MySQL DDL for 8 tables (`members`, `addresses`, `categories`, `products`, `orders`, `order_items`, `payments`, `reviews`) with column and table `COMMENT`s, plus 8 `ALTER TABLE … FOREIGN KEY` relationships. 51 of the 73 scenes seed from it, directly or through a helper's `seedShop`/`seedShopRing` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `lib/` | Recorder, seeding and the injected pointer/keycap overlay (see `lib/AGENTS.md`) |
| `scenes/` | 73 scenes and 7 `_*-helpers.mjs` files (see `scenes/AGENTS.md`) |
| `seeds/` | Seed fixtures for `readSeed`, `shop.sql` only. It has no AGENTS.md; see Key Files |
| `.out/` | Ignored scratch, never committed: `<name>/` per scene, `.capture.lock` while a capture runs, and an optional `bin/ffmpeg` link |

## For AI Agents

### Working In This Directory

- **Don't run a recording unasked.** Every recorded scene overwrites a tracked file in
  `static/img/` (ffmpeg `-y`), and a run with no names re-records all 71 clips and both
  stills. Name the scenes you mean, then check `git status static/img`.
- **CLI.** `node scripts/demos/run.mjs [--debug] [--list] [name …]`, from any directory,
  since paths resolve from the script's own location.
  - Arguments are scene `name`s, not file names (see `scenes/AGENTS.md`). An unknown name
    throws `unknown scene: <name>` before the server starts.
  - Any other `--` argument is dropped without a warning, so a mistyped `--debgu` records.
  - `--list` prints every loaded name and exits, with no server and no browser.
  - A scene file that fails to import is skipped with `skipping scenes/<file>: …`, and its
    name is missing from `--list`. A scene that throws while recording logs
    `[<name>] failed:`, and the run goes on to the next scene and exits 1 at the end.
- **Environment.**

  | Variable | Default | Effect |
  |----------|---------|--------|
  | `DEMO_PORT` | `5231` | Dev server port. Fixture URL: `http://localhost:<port>/e2e/fixture/index.html` |
  | `ERD_EDITOR_DIR` | `../erd-editor` beside the repo | Checkout to serve from. Playwright loads from `<dir>/packages/erd-editor/node_modules/@playwright/test/index.mjs` |
  | `FFMPEG_PATH` | unset | First choice of ffmpeg. Next is `.out/bin/ffmpeg` if it exists, then `ffmpeg` on `PATH` |

  Scene helpers also read `DEMO_TIMING` and `TRB_TIMING` (see `scenes/AGENTS.md`).
- **Dev server.** `run.mjs` reuses a server already answering the fixture URL and leaves it
  running. Otherwise it spawns `pnpm exec vp dev --port <port> --strictPort` in
  `$ERD_EDITOR_DIR/packages/erd-editor`, detached and with output discarded. It polls
  every 500 ms for about 120 s and kills the process group at the end. This skips the
  package's `dev` script, which builds the workspace libraries first, so build them
  before the run (README, Requirements). When the run only reports
  `the dev server did not come up`, run that command yourself in the package to see the
  error.
- **ffmpeg must have `libwebp_anim`.** Check with
  `<ffmpeg> -hide_banner -encoders | grep webp_anim`. Homebrew's `ffmpeg-full` has it.
  `.out/bin/ffmpeg` is a symlink you make yourself, and deleting `.out/` removes it.
- **Output.** A clip goes to `static/img/<output>.webp` (`output` defaults to `name`). A
  still goes to the file name its scene passes to `d.still()`. Every run of a scene,
  `--debug` included, first deletes `.out/<name>/`. A recording then leaves
  `frames/00000.png…`, `concat.txt` (per-frame durations for ffmpeg's concat demuxer) and
  `review.png`, and a debug run leaves `shot-NN-<label>.png`.
- **Check steps with `--debug <name>` first.** It runs `setup` and `scenario` but does not
  capture, encode or write to `static/img/` (`d.still()` turns into a shot). It still needs
  the dev server. Its timing is not the recording's, because shots pause and pointer
  travel runs slower while the screencast is on. Judge pacing only from a recording.
- **Review every recording through `.out/<name>/review.png`** before you accept it. It is
  one 480 px tile per second, 4 per row. Also read the console: page errors never fail a
  scene and only print `[<name>] pageerror: …`. The summary line gives frames, seconds
  and KB.
- **Re-record when the editor's chrome or an English UI string changes.** The fixture
  fills the viewport, so nearly every clip frames the top toolbar and the floating
  toolbar, and scenes park the pointer by the toolbars' extents (`undo-redo.mjs`: "it
  reaches x 752 since 4.2.0"). The 3.9.0, 4.2.0 and 5.0.0 updates re-recorded every
  clip. The 5.1.0 commit recorded none: "no UI chrome or English string changed". The 5.1.1
  update changed neither, but a memo's menu over a selection that holds a table gained
  `Group selected tables`, so it re-recorded `demo-table-remove` (its scene now also keeps the
  pointer off the memo's text and moves down the menu's left padding) and added
  `demo-table-group-memo`. Check the menus a clip opens, too.
- **Record from the version the docs describe.** A clip shows whatever the checkout
  serves. Before recording, check that `git -C ../erd-editor diff --stat vX.Y.Z --
  packages/erd-editor ':!*.md'` prints nothing for the documented tag. `describe --tags`
  alone isn't enough: once the checkout is ahead of the tag it prints `vX.Y.Z-N-g…`, even when
  the commits after the tag changed only Markdown.
- **Editing `seeds/shop.sql` restages 51 scenes.** They pin tables and reach columns by
  name (`d.columnBox('members', 'created_at')`), so a renamed or reordered column moves
  boxes and breaks lookups. Debug every affected scene after a change.

### Testing Requirements

- No test suite. Check a change in this order: `--list` (73 names, or more if you added
  scenes), then `--debug <name>` and its shots, then a recording and its `review.png`,
  then the docs page that embeds the clip in `pnpm dev`.
- After a change to `run.mjs` or `lib/`, debug one canvas scene and one DOM-heavy scene,
  for example `demo-zoom` and `demo-export`.

### Common Patterns

- Scenes record one after another, in the order named or else in file-name order. Run
  a second `run.mjs` beside the first only when you started the dev server yourself. A run
  that started the server kills it when it ends (`ensureServer`'s `process.kill(-server.pid)`),
  which strands any other run using it. The capture lock then keeps their captures one at a
  time (see `lib/AGENTS.md`).
- The browser always comes from the checkout. Nothing here installs Playwright or
  Chromium.

## Dependencies

### Internal

- `lib/recorder.mjs`: `record` and the path, port and URL constants `run.mjs` imports.
- `../../static/img/`: where clips and stills land. The docs embed them as `/img/<file>`.
- `$ERD_EDITOR_DIR/packages/erd-editor/e2e/fixture/index.html`: the page every scene opens.

### External

- `@playwright/test` and its Chromium, from the erd-editor checkout.
- ffmpeg with the `libwebp_anim` encoder.
- pnpm and `vp` (vite-plus) in the checkout, for the dev server.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
