---
sidebar_position: 10
description: Undo and redo edits, what the history records, and stepping through it with Time Travel.
---

# Undo, Redo

You can move back to a previous editing state or forward to a later one.  
The history keeps up to `2048` changes.

- Undo: `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac)

The toolbar carries the same two commands as `Undo` and `Redo` buttons, next to `Time Travel`.  
They light up only when there is something to undo or redo. A `readonly` editor hides all three, and the shortcuts do nothing.

Undo and Redo apply only on the ERD tab. They are unavailable on the Visualization, Schema SQL, Code Generator, and Settings tabs.  
The shortcuts are also inactive while Quick Search, `Table Properties`, `Diff Viewer`, the `Auto Layout` preview, or Time Travel is open.  
They keep working while [Find and Replace](./find-and-replace.md#keys-in-the-panel) is open. Even with the caret in its Find or Replace field, they undo and redo the diagram rather than the text in the field.

The history lives in memory for the current session. It is not stored in the document, so reopening a diagram starts with an empty history.

![Moving a table and removing a column, then undoing both with ⌘ + Z and redoing with ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## What the History Records

Recorded:

- Tables and memos: add, remove, move, color, name and comment, memo text and size.
- Columns: add, remove, reorder, and every column option.
- Relationships: add, remove, type change, and each choice from `On Delete` or `On Update` — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Undoing a removal brings a relationship back with its ON DELETE and ON UPDATE actions.
- Indexes and their columns.
- View position, zoom level, and the `View Option` toggles.
- Importing a file.

Not recorded:

- The database vendor and the database name.
- The Code Generator language, `Table Name Case`, and `Column Name Case`.
- The Schema SQL bracket type.
- Everything on the Settings tab.
- Zoom and pan on the Visualization tab in either mode, moving graph nodes or Flow cards, `Tidy Up`, the row display, and focusing on tables — see [Flow Never Edits the Document](./visualization.md#flow-never-edits-the-document).

Changing any of these cannot be undone.

Changes that arrive from another editor are not recorded either, so Undo reverts only your own. In a [collaborative session](../../api/advanced/collaborative-editing.md) each editor undoes its own changes, and a coding agent editing through the [MCP server](../../mcp/live-and-headless.md#undo) undoes its own with `erd_undo`.

Undoing an import brings back the earlier diagram as its file would hold it.  
If that diagram has [`Save Scroll Information`](./settings.md#save-scroll-information) off, the view goes back to where the diagram opens rather than where you were. With [`Save Zoom Information`](./settings.md#save-zoom-information) off, the zoom goes back to `100%`. The edits themselves are restored either way.  
A new diagram starts with both switches off. Turn them on to keep your view through such an undo.

## One Gesture, One Step

Everything a single gesture dispatches becomes one history entry.  
Pasting several tables and memos at once, or duplicating them with `Alt + drag`, is undone in a single step.

`Replace All` in [Find and Replace](./find-and-replace.md#replacing) is one step too, however many table names, comments, column names, and memos it changes. When it changes nothing, it records no step.  
A single `Replace` is one step, including the scroll to the next match when that match needs one.  
Going to a match that is not already fully in view beside the panel scrolls the canvas, and that scroll is recorded like any other change of view position — see [Going to a Match](./find-and-replace.md#going-to-a-match). After moving through matches, Undo first takes back those scrolls, one per step.

A continuous drag, canvas pan, zoom, pinch, or color change is buffered for about `200ms` and lands as one entry too.  
A drag that moves less than `20px` in total is not recorded at all.

Typing in a cell or a memo is recorded per input rather than per gesture: each typed character, each paste, and each step of an IME composition is a step of its own.

## Time Travel

Opens from the `Time Travel` button in the toolbar, next to Undo and Redo.  
The button does nothing until the session has at least one recorded change.

Time Travel opens a separate, read-only copy of the diagram, at the scroll position and zoom level the canvas is showing, whether or not the diagram saves them.  
Drag the slider, or click anywhere on its track, to move through the whole edit history and preview each point. The slider's leftmost position is the state one step before the first recorded change, and it opens with the thumb on the current state.  
The preview is inert: it draws a minimap, but you cannot pan, scroll, or edit it, and the real document stays untouched until you apply.

Press `Apply` to restore the selected point, or `Cancel` or `Esc` to leave the document unchanged.

![Opening Time Travel, dragging the slider back through the session, and applying an earlier point](/img/demo-time-travel.webp)
