---
sidebar_position: 10
description: Relationship data type sync, scroll and zoom saving, maximum comment width, table width recalculation, column display order, and the shortcut list.
---

# Settings

Open it with the `Settings` button in the toolbar, or from [quick search](./quick-search.md) under `Tab`.
The Settings screen has two tabs: `Preferences` and `Shortcuts`. `Preferences` opens first.

Theme colors are not on this screen.
They live in the theme builder, which opens from the `Theme` button in the toolbar and is only there when the host turns it on with [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder).

## Relationship DataType Sync

Determines whether to synchronize data types. It is on by default.
Changing a column's data type then applies the same type to every column joined to it by a relationship, following the chain from both ends, so a foreign key never drifts from the key it references.

<img src="/img/settings-relationship-data-type-sync.png" width="400" alt="Relationship data type sync setting" loading="lazy" />

![demo-relationship-data-type-sync](/img/demo-relationship-data-type-sync.webp)

## Save Scroll Information

Determines whether the scroll position is saved in the document. It is on by default.
With it off, the document is written with the scroll position reset, so it opens at the top left.

## Save Zoom Information

Determines whether the zoom level is saved in the document. It is on by default.
With it off, the document is written at `100%`, so it opens unzoomed.

## Maximum Comment Width

Specifies the maximum width of the comment column in pixels (`60` ~ `200`).
Turning the switch off removes the limit, and the input is disabled while it is off.
Turning it on starts at `60px`. A value typed outside the range is clamped to the nearest end.

<img src="/img/settings-comment-width.png" width="400" alt="Maximum comment width setting" loading="lazy" />
<img src="/img/settings-comment-width-2.png" width="400" alt="Maximum comment width applied to a diagram" loading="lazy" />

## Recalculation Table Width

Press `Sync` to recalculate the width of every table and column cell to fit its current text, and to redraw the relationship connectors around the new sizes.
A `Recalculated table width` toast confirms it.
Widths are recalculated on their own whenever a document is loaded, so this is only needed when a font or rendering change has left them stale.

## Adjusting Column Order

Sets the display order of columns in tables.
Drag a row to move it — the whole row is draggable, and the grip icon marks it. The seven rows, in their default order, are `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default`, and `Comment`.
A cell hidden by a [table view option](./table-related-functions.md#table-view-options) keeps its place in the list, so the order applies to whichever cells are shown.

![demo-settings-column-order](/img/demo-settings-column-order.webp)

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
| Select All Table, Memo | `Ctrl + Alt + A` | `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |

Most of these fire on the ERD tab only, and they are held back while quick search, table properties, the diff viewer, automatic table placement, or time travel is open.
`Search` and `Stop` are the exceptions: `Search` toggles quick search from any tab, and `Stop` is what closes quick search, table properties, the diff viewer, automatic table placement, time travel, and the theme builder.
Copy and paste are the browser's own `Ctrl + C` and `Ctrl + V` (Windows/Linux) or `⌘ + C` and `⌘ + V` (Mac), so they are not in this list — see [Table Editing](./table-editing.md).

Bindings cannot be changed from this tab.
A host embedding the editor remaps them with [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), except `Editing`, `Stop`, `Search`, `Undo`, `Redo`, `Zoom In`, and `Zoom Out`, which are fixed.
