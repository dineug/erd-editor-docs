# guide

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

The `docs` sidebar, which the navbar's `Guide` item opens. It holds the introduction and the
`Guides` category in `guides/`. It describes the editor as a user meets it in a host: the web app,
Google Drive, VS Code, a JetBrains IDE, or Obsidian. The element API a page's own code calls is in
`../api/`.

## Key Files

| File | Description |
|------|-------------|
| `introduction.md` | `sidebar_position: 1`. What erd-editor is. `## Where to Get It` has a table row for each host (web app, Google Drive, VS Code, IntelliJ, Obsidian, your page, `erd-editor.io/embed`, coding agents) with its store or install link. The paragraphs after the table cover a new diagram (the welcome screen, every lock on), VS Code's JSON diffs, and which releases to update. `## What It Does` has 22 bullets, one per feature, each linking the guide page and the anchor that covers it. Its last line links `/docs/category/guides`. `## Reason Behind This Project` is the author's note, written with hard breaks. Embeds `/img/demo-overview.webp` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `guides/` | The 18 task pages of the `Guides` category (see `guides/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- **No version numbers.** Guide pages describe the current release.
  `grep -rnoE '\b[0-9]+\.[0-9]+\.[0-9]+\b' docs/guide --exclude=AGENTS.md` finds none. An older
  release is named by the feature it lacks: "a release from before the Dictionary tab"
  (`introduction.md`, `guides/settings.md`, `guides/dictionary.md`). Version history belongs in
  `../api/` ("Since `X.Y.Z`") and `../mcp/` (release floors).
- **The introduction summarizes the guides.** Each `## What It Does` bullet restates its guide page
  in one or two sentences. When a page's behavior changes, find its bullet with
  `grep -n "guides/<page>.md" docs/guide/introduction.md`. The bullets also carry numbers: four
  relationship types, zoom from `10%` to `150%`, and "twenty-two targets", which
  `guides/code-generator.md`'s `description` repeats.
- **Each clip comes from one recorder scene.** `/img/demo-<name>.webp` is written by the scene whose
  `name` is `'demo-<name>'`. Find its file with
  `grep -l "name: 'demo-<name>'" scripts/demos/scenes/*.mjs`. Newer files are `demo-<name>.mjs` and
  older ones `<name>.mjs` (`relationship.mjs` writes `demo-relationship`). The `<img>` still in
  `guides/settings.md`, `/img/settings-relationship-data-type-sync.png`, comes from
  `still-settings-relationship-data-type-sync.mjs`. `node scripts/demos/run.mjs --list` prints every
  scene name. Recording is covered in `scripts/demos/README.md` and `scripts/demos/AGENTS.md`.
- **Alt text narrates the clip step by step.** A scene re-recorded with other steps needs new alt
  text in English and in each translation.

### Testing Requirements

- Check what a page says against the editor source. `guides/AGENTS.md` names the directories for
  each page. For the introduction's host rows, check the host packages under Dependencies.
- After you change a clip's scene, re-record only that scene: `node scripts/demos/run.mjs
  demo-<name>` (the argument is the scene's `name`, not its file name). Review it as
  `scripts/demos/AGENTS.md` says.

### Common Patterns

- A clip follows the prose it shows, inside the same section. No image sits directly under a
  heading.
- Guide pages hold one code fence in all, the `html` iframe line in `guides/embedding.md`. They
  show UI, not code.

## Dependencies

### Internal

- `../erd-editor/packages/erd-editor/`: the editor UI that every page describes.
- Host packages for the introduction's rows, all under `../erd-editor/packages/`: `app/` (the web
  app, with Google Drive in `src/services/gdrive/`), `vscode-extension/`, `intellij-plugin/`,
  `obsidian-plugin/` and `mcp-server/`.
- `scripts/demos/`: records the `static/img/demo-*.webp` clips these pages embed.
- `src/pages/index.tsx`: also links `/docs/category/guides`, the index route of
  `guides/_category_.json`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
