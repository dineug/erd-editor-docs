---
sidebar_position: 12
description: Undo and redo edits, what the history records, and stepping through it with Time Travel.
---

# Undo, Redo

You can move back to a previous editing state or forward to a later one.  
The history keeps up to `2048` changes.

- Undo: `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac)

The toolbar carries the same two commands as `Undo` and `Redo` buttons, next to `Time Travel`.  
They light up only when there is something to undo or redo. A `readonly` editor hides all three, and the shortcuts do nothing.

Undo and Redo apply only on the ERD tab. They are unavailable on the Visualization, Schema SQL, Code Generator, and Settings tabs. In the Schema SQL tab's `Before tables` and `After tables` fields, the same keys undo and redo your typing in the field instead.  
The shortcuts are also inactive while Quick Search, `Table Properties`, `Diff Viewer`, the `Auto Layout` preview, the [`Export image`](./file-import-export.md#image) dialog, [Map Columns](./relationship-editing.md#map-columns), or Time Travel is open.  
They keep working while [Find and Replace](./find-and-replace.md#keys-in-the-panel) or the [color picker](./table-related-functions.md#table-and-memo-color-specification) is open. Even with the caret in one of their fields, such as Find, Replace, or `Hex`, they undo and redo the diagram rather than the text in the field.

The history lives in memory for the current session. It is not stored in the document, so reopening a diagram starts with an empty history.

![Moving a table and removing a column with ⌥ + Backspace, then undoing both with ⌘ + Z and redoing them with ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## What the History Records

Recorded:

- Tables and memos: add, remove, move, color, name and comment, memo text and size.
- Table groups: add, remove, move, resize, name, color, and which group each table is in — see [Table Groups](./table-groups.md).
- Columns: add, remove, reorder, and every column option.
- Relationships: add, remove, type change, the columns set in [Map Columns](./relationship-editing.md#map-columns), and each choice from `On Delete` or `On Update` — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Undoing a removal brings a relationship back with its ON DELETE and ON UPDATE actions.
- Indexes and their columns.
- View position, zoom level, and the `View Option` toggles.
- The Schema SQL tab's `Before tables` and `After tables` scripts, one step for each edit you apply by leaving the field — see [Before and After Scripts](./schema-sql.md#before-and-after-scripts).
- Importing a file, and adding one with [`Import and Add`](./file-import-export.md#import-and-add).

Not recorded:

- The database vendor and the database name.
- The Code Generator language, `Table Name Case`, and `Column Name Case`.
- The bracket type, whether set on the Schema SQL tab or the Code Generator tab.
- The Schema SQL tab's `Statements`, `Header`, and `Tables` choices, which belong to the editor window — see [Options Panel](./schema-sql.md#options-panel).
- Everything on the Settings tab, the [`Lock`](./settings.md#lock) rows included.
- The theme and the display language — see [Language and Theme](./language-and-theme.md).
- Which table, memo, or group is drawn in front of the others.
- Zoom and pan on the Visualization tab in either mode, moving graph nodes or Flow cards, `Tidy Up`, the row display, and focusing on tables — see [Flow Never Edits the Document](./visualization.md#flow-never-edits-the-document).

Changing any of these cannot be undone.

Changes that arrive from another editor are not recorded either, so Undo reverts only your own. In a [collaborative session](../../api/advanced/collaborative-editing.md) each editor undoes its own changes, and a coding agent editing through the [MCP server](../../mcp/live-and-headless.md#undo) undoes its own with `erd_undo`.

Undoing an `Import`, which replaces the whole diagram, brings back the earlier diagram as the editor held it when you imported, with each [lock](./settings.md#lock) on or off and each locked value as they were then.  
If that diagram had `Viewport` locked, the view and the zoom go back to the locked view, where the diagram opens, rather than to where you were. With its `Viewport` unlocked, they go back to where you were when you imported. The other locked settings, such as the tab you are on or the Code Generator language, stay as they are on your screen.  
A new diagram starts with every lock on. Unlock `Viewport` before you import to keep your view through such an undo. Unlocking it afterwards, or importing a JSON file whose own `Viewport` lock is off, does not change where the undo takes you.

## One Gesture, One Step

Everything a single gesture dispatches becomes one history entry.  
Pasting several tables and memos at once, or duplicating them with `Alt + drag`, is undone in a single step.

A press of `Delete` or `Backspace`, or `Delete selected` or `Delete columns` in a context menu, is one step, however many tables, memos, table groups, or columns it removes.  
Toggling the primary key on several selected columns is one step, whether with `Alt + K` (Windows/Linux) or `⌥ + K` (Mac) or with `Primary Key on selected columns` in a table's context menu.  
Setting the color of the selection, or clearing it with `No color` or `Remove color`, is one step, however many tables, memos, and groups are selected. Picking a color that everything selected already has records no step, and neither does `No color` when nothing selected has a color.  
`Map` or `Save` in [Map Columns](./relationship-editing.md#map-columns) is one step, together with the foreign key columns it adds and the data types it changes.  
`Import and Add` is one step, together with the scroll that brings the added block into view.

Creating a [table group](./table-groups.md), by drawing it or with `Group selected tables`, is one step together with every table it takes in. Removing a group is one step, and undoing it brings the group back with its tables in it.  
Dragging a group by its title bar moves the group and all its tables in one step. Tables dropped into or out of a group change group in the same step as their drag when you let go within about `200ms` of the last movement, so one undo puts them back where they were and in the groups they were in. After a longer pause before letting go, the change of group is a step of its own, and the first undo takes back only that.  
Resizing a group by an edge or a corner is recorded once, when you let go.  
Applying [Auto Layout](./table-related-functions.md#auto-layout) is one step, the groups it fits round their tables included.

`Replace All` in [Find and Replace](./find-and-replace.md#replacing) is one step too, however many table names, comments, column names, and memos it changes. When it changes nothing, it records no step.  
A single `Replace` is one step, including the scroll to the next match when that match needs one.  
Going to a match that is not already fully in view beside the panel scrolls the canvas, and that scroll is recorded like any other change of view position — see [Going to a Match](./find-and-replace.md#going-to-a-match). After moving through matches, Undo first takes back those scrolls, one per step.

A continuous drag, canvas pan, zoom, pinch, or color change is buffered for about `200ms` and lands as one entry too.  
A drag that moves less than `20px` in total records no move. Only a change of group it makes, if any, is recorded.

Typing in a cell or a memo is recorded per input rather than per gesture: each typed character, each paste, and each step of an IME composition is a step of its own.  
A table group's name is recorded once, when `Enter` or leaving the field saves it, so the name you type into a group you have just created is a step apart from creating it. `Esc`, or a name left unchanged, records nothing.

## Time Travel

Opens from the `Time Travel` button in the toolbar, next to Undo and Redo.  
The button does nothing until the session has at least one recorded change.

Time Travel opens a separate, read-only copy of the diagram, at the scroll position and zoom level the canvas is showing, whether or not the `Viewport` lock is on.  
Drag the slider, or click anywhere on its track, to move through the whole edit history and preview each point. The slider's leftmost position is the state one step before the first recorded change, and it opens with the thumb on the current state.  
The preview is inert: it draws a minimap, but you cannot pan, scroll, or edit it, and the real document stays untouched until you apply.

Press `Apply` to restore the selected point, or `Cancel` or `Esc` to leave the document unchanged.

![Opening Time Travel, dragging the slider back through the session, and applying an earlier point](/img/demo-time-travel.webp)
