---
sidebar_position: 10
description: Relationship data type sync, view and zoom saving, maximum comment width, table width recalculation, column display order, and the shortcut list.
---

# Settings

Open it with the `Settings` button in the toolbar, or from [quick search](./quick-search.md) under `Tab`.
The Settings screen has two tabs: `Preferences` and `Shortcuts`. `Preferences` opens first.

Theme colors are not on this screen.
They live in the theme builder, which opens from the `Theme` button in the toolbar and is only there when the host turns it on with [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder).

## Relationship DataType Sync

Determines whether to synchronize data types. It is on by default.
Changing a column's data type then applies the same type to every column joined to it by a relationship, following the chain from both ends, so a foreign key never drifts from the key it references.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Relationship data type sync setting" loading="lazy" />

![Changing members.id to BIGINT UNSIGNED, which updates every member_id joined to it](/img/demo-relationship-data-type-sync.webp)

## Save Scroll Information

Determines whether the view position is saved in the document. It is on by default.
With it off, the document is written with the view origin reset, so it opens on the diagram rather than where you left it.

## Save Zoom Information

Determines whether the zoom level is saved in the document. It is on by default.
With it off, the document is written at `100%`, so it opens unzoomed.

## Maximum Comment Width

Specifies the maximum width of the comment column in pixels (`60` ~ `200`).
Turning the switch off removes the limit, and the input is disabled while it is off.
Turning it on starts at `60px`. A value typed outside the range is clamped to the nearest end.

![Turning on Maximum comment width, entering 120, and the ERD tab showing comments cut to it](/img/demo-settings-comment-width.webp)

## Recalculation Table Width

Press `Sync` to recalculate the width of every table and column cell to fit its current text, and to redraw the relationship connectors around the new sizes.
A `Recalculated table width` toast confirms it.
Widths are recalculated on their own whenever a document is loaded, so this is only needed when a font or rendering change has left them stale.

## Adjusting Column Order

Sets the display order of columns in tables.
Drag a row to move it — the whole row is draggable, and the grip icon marks it. The seven rows, in their default order, are `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default`, and `Comment`.
A cell hidden by a [table view option](./table-related-functions.md#table-view-options) keeps its place in the list, so the order applies to whichever cells are shown.

![Dragging the Comment row up under Name, which puts each comment right after its column name](/img/demo-settings-column-order.webp)

## Shortcuts

The `Shortcuts` tab is a read-only table of `Command` and `Keybinding`, listing the bindings for the platform you are on.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Most of these fire on the ERD tab only, and they are held back while quick search, table properties, the diff viewer, the Auto Layout preview, or time travel is open.
`Search` and `Stop` are the exceptions: `Search` toggles quick search from any tab, and `Stop` is what closes quick search, table properties, the diff viewer, the Auto Layout preview, time travel, and the theme builder.
`Zoom In`, `Zoom Out`, and `Zoom Reset` also zoom the [Visualization](./visualization.md#toolbar) tab, in `Graph` and `Flow` alike, unless quick search is open.
On the Visualization tab, `Stop` also closes the [row display](./visualization.md#row-display) menu and cancels a [Flow layout](./visualization.md#how-flow-is-placed) that is still running; it does not widen a view narrowed with `Focus on this table`.
`Focus on this table` opens the Visualization tab in `Flow`, narrowed to the selected tables and every table one relationship away, and does nothing when no table is selected — see [Focusing on Tables](./visualization.md#focusing-on-tables).
`Select All Table, Memo` and `Hand Tool` give way to a caret: while you are editing a cell, `Ctrl + A` selects the text and `Space` types a space.
Copy and paste are the browser's own `Ctrl + C` and `Ctrl + V` (Windows/Linux) or `⌘ + C` and `⌘ + V` (Mac), so they are not in this list — see [Table Editing](./table-editing.md).

Bindings cannot be changed from this tab.
A host embedding the editor remaps them with [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), except `Editing`, `Stop`, `Search`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, and `Zoom Reset`, which are fixed.
