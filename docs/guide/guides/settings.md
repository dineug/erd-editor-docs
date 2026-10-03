---
sidebar_position: 11
description: Relationship data type sync, view and zoom saving, maximum comment width, table width recalculation, column display order, and the shortcut list.
---

# Settings

Open it with the `Settings` button in the toolbar, or from [quick search](./quick-search.md) under `Tab`.
The Settings screen has two tabs: `Preferences` and `Shortcuts`. `Preferences` opens first.

Theme colors are not on this screen.
They live in the theme builder, which opens from the `Theme` button in the toolbar and is only there when the host turns it on with [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder).

In VS Code, Obsidian, and a JetBrains IDE, the builder's three values (appearance, gray color, and accent color) are also settings of the host, and what you pick in the builder is saved there.
VS Code keeps them as `dineug.erd-editor.theme.appearance`, `dineug.erd-editor.theme.grayColor`, and `dineug.erd-editor.theme.accentColor`, with `dark` as the default appearance.
Obsidian keeps them under Settings → ERD Editor, per vault, and a JetBrains IDE under Settings | Tools | ERD Editor, for the whole IDE. Both default to `Auto`, which follows the host's light or dark theme and switches with it.
The builder itself offers only `Light` and `Dark`.
In Obsidian and a JetBrains IDE, `Auto` stays set unless you pick the appearance it is not showing.
In VS Code, every pick saves all three values, so while the appearance is `auto`, picking even a color replaces it with `light` or `dark`.

## Relationship DataType Sync

Determines whether to synchronize data types. It is on by default.
Changing a column's data type then applies the same type to every column joined to it by a relationship, following the chain from both ends, so a foreign key never drifts from the key it references.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Relationship data type sync setting" loading="lazy" />

![Changing members.id to BIGINT UNSIGNED, which updates every member_id joined to it](/img/demo-relationship-data-type-sync.webp)

## Save Scroll Information

Determines whether the view position is saved in the document. The switch itself is stored in the document: a new diagram starts with it off, and a file you open keeps the setting it was saved with.
With it off, the document is written with the view origin reset, so it opens on the diagram rather than where you left it, and scrolling never changes the file.

A new diagram is one started from nothing: an empty file opened in VS Code, Obsidian, or a JetBrains IDE (Obsidian's `ERD Editor: Create new diagram` and `New ERD` make one), a new schema in the web app, a file made from Google Drive's New menu, or an `<erd-editor>` given no value. `Save Zoom Information` starts off there too.
A schema or Google Drive file that the web app makes by importing a SQL, DBML, AML, or GraphQL file starts with both switches off as well. One made from a JSON file keeps that file's switches.
A file that does not record these switches, such as one saved by an early release or written by hand, opens with both on.

## Save Zoom Information

Determines whether the zoom level is saved in the document. Like `Save Scroll Information`, it starts off in a new diagram, and a file you open keeps the setting it was saved with.
With it off, the document is written at `100%`, so it opens unzoomed.
A zoom also moves the view position, so that the point it zooms around stays in place. With only this switch off, zooming therefore still changes the file through the view position. Only with both switches off does it leave the file as it was.

A scroll or a zoom that the document does not keep is not counted as a change. VS Code does not mark the tab modified, and Obsidian and a JetBrains IDE leave the file as it was, both when they save on their own and when the tab closes.
So with both switches off, looking around a diagram never shows up in `git diff`, even in a file written by another release or on another machine, whose bytes a save would change.
Neither switch covers which of the editor's tabs is open. The document records whether it was left on the ERD, Visualization, Schema SQL, Code Generator, or Settings tab, so in VS Code, Obsidian, and a JetBrains IDE, switching between these tabs still changes the file.
A new diagram's empty file stays empty until the first edit, or the first switch to another of those tabs.
A diagram VS Code opens read-only, such as a git revision or a merge preview, is never marked modified.
In Google Drive, a scroll, a zoom, or a switch to another tab is never saved on its own, whatever the switches say. The view is written only along with another change, so with `Save Scroll Information` on, a Drive file opens where the view was at its last save.

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
The [alternate key](./table-related-functions.md#alternate-keys) mark (`AK1.1` and so on) is not one of these rows. It always stands last in a row, after whichever cell this order puts last.

![Dragging the Comment row up under Name, which puts each comment right after its column name](/img/demo-settings-column-order.webp)

## Shortcuts

The `Shortcuts` tab is a read-only table of `Command` and `Keybinding`, listing the bindings for the platform you are on.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Find and Replace](./find-and-replace.md) | `Ctrl + F` | `⌘ + F` |
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
`Search`, `Find and Replace`, and `Stop` are the exceptions: `Search` toggles quick search from any tab, `Find and Replace` opens the [Find and Replace panel](./find-and-replace.md#opening-and-closing) from any tab and brings up the ERD tab, and `Stop` is what closes quick search, table properties, the diff viewer, the Auto Layout preview, time travel, the theme builder, and the Find and Replace panel.
While the diff viewer, the Auto Layout preview, or time travel is open, `Find and Replace` leaves its key to the browser or host — see [The Browser's Find Bar](./find-and-replace.md#the-browsers-find-bar).
On the ERD tab, `Stop` ends an open cell or memo editor, or cancels a relationship being drawn, and leaves the selection as it is. With none of those open, it clears the selection and the focused cell and, in the same press, closes an open Find and Replace panel.
An open Find and Replace panel holds none of the shortcuts back on the canvas. For keys pressed inside the panel, see [Keys in the Panel](./find-and-replace.md#keys-in-the-panel).
`Zoom In`, `Zoom Out`, and `Zoom Reset` also zoom the [Visualization](./visualization.md#toolbar) tab, in `Graph` and `Flow` alike, unless quick search is open.
On the Visualization tab, `Stop` also closes the [row display](./visualization.md#row-display) menu and cancels a [Flow layout](./visualization.md#how-flow-is-placed) that is still running; it does not widen a view narrowed with `Focus on this table`.
`Focus on this table` opens the Visualization tab in `Flow`, narrowed to the selected tables and every table one relationship away, and does nothing when no table is selected — see [Focusing on Tables](./visualization.md#focusing-on-tables).
`Select All Table, Memo` and `Hand Tool` give way to a caret: while you are editing a cell or typing in the Find and Replace panel, `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac) selects the text and `Space` types a space.
Copy and paste are the browser's own `Ctrl + C` and `Ctrl + V` (Windows/Linux) or `⌘ + C` and `⌘ + V` (Mac), so they are not in this list — see [Table Editing](./table-editing.md).

Bindings cannot be changed from this tab.
A host embedding the editor remaps them with [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), except `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, and `Zoom Reset`, which are fixed.
The `Shortcuts` tab then lists the host's bindings: a command the host does not remap keeps its default, and one the host binds to no key shows none.

In Obsidian these keys reach the editor whenever the diagram's Obsidian tab is active, even where an Obsidian hotkey uses the same key, such as `Alt + Enter`, `Ctrl + K`, and `Ctrl + F` (Windows/Linux) or `⌥ + Enter`, `⌘ + K`, and `⌘ + F` (Mac). Every other Obsidian hotkey still works there. For `Ctrl + F` or `⌘ + F`, see [The Browser's Find Bar](./find-and-replace.md#the-browsers-find-bar).
