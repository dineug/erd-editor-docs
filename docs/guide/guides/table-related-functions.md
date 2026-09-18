---
sidebar_position: 4
description: Select, move, copy, and duplicate tables and memos, set colors and view options, define indexes, choose a database, get around the infinite canvas, and compare documents.
---

# Table-related Functions

Everything you do to tables and memos once they exist — selecting, moving, copying, coloring, and setting what each table shows — plus the canvas controls around them.  
The table and memo commands come first, then table properties, focusing on tables, indexes, auto layout, and the database vendor, and the canvas itself last: the canvas toolbar, zoom, panning, and the diff viewer.

## Multiple Selection

Supports three methods:

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + A` or `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` or `⌘ + ⌥ + A` (Mac)

Memos are selected the same way, and either select-all shortcut takes every table and memo at once.  
`Ctrl + A` gives way to a caret, so it selects the text rather than the diagram while you are editing a cell.  
A selection box marks an entity when it covers the middle of it, not when it merely touches an edge.

![Selecting tables with ⌘ + drag and ⌘ + click, then every table and memo with ⌘ + A](/img/demo-table-select.webp)

In a collaborative session, each participant's selection, focused cell, and selection box are drawn on the canvas in that participant's color — see [Collaborative Editing](../../api/advanced/collaborative-editing.md).

## Moving Multiple Tables

Drag any table or memo that is already part of the selection and the whole selection moves with it — no modifier needed.  
Dragging something outside the selection collapses the selection onto it and moves that alone. `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) keeps the selection either way.

![Dragging one of two selected tables moves both, and the relationship follows](/img/demo-table-multiple-move.webp)

## Copying/Pasting Tables and Memos

Copies the selected tables and memos and pastes them back as new ones.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

A copied table keeps its name, comment, columns, and color; a copied memo keeps its text, size, and color. A copy keeps the original name.  
Indexes and relationships come along too: an index is copied whole onto the copied table, and a relationship is copied when both of the tables it joins are in the copied set. Half a relationship is dropped rather than left pointing back at the original.  
The pasted copies become the new selection, and pasting the same copy again offsets it by a further `50px` each time, so repeated pastes do not stack on top of one another.

![Copying two related tables and pasting them twice, relationship included](/img/demo-table-copy-paste.webp)

When columns are selected inside a focused table, the same shortcut copies those columns instead — see [Table Editing](./table-editing.md).

## Duplicating Tables and Memos

Hold `Alt` and drag a table or memo with the left mouse button.  
A translucent preview follows the pointer, and releasing the button drops the copy where the preview sits.  
If what you grab is already part of a selection, the whole selection is duplicated. Otherwise the selection is replaced by the entity under the pointer.  
`Alt + click` without moving drops the copy `50px` down and to the right, stepping further whenever that spot is already taken.

A duplicate carries the same things as a paste: names, comments, columns, colors, memo sizes, and the indexes and relationships that belong entirely to what you copied.

![Duplicating a table with Alt + drag, then Alt + click for another copy down and to the right](/img/demo-table-duplicate.webp)

## Table and Memo Deletion

Deletes the currently selected table or memo.  
Shortcuts: `Ctrl + Backspace` (Windows/Linux) or `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` (Mac) or `⌘ + Delete` (Mac)

![Deleting a table with its relationships, then a table and a memo together](/img/demo-table-remove.webp)

## Table and Memo Color Specification

You can designate colors to differentiate by category.  
Click the color strip along the top of a table or memo to open the picker. The color is applied to every selected table and memo, not only the one you clicked.

![Picking a color from a memo's color strip, applied to every selected table and memo](/img/demo-table-color.webp)

## Table View Options

Offers the following view options:

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Auto Increment
- Relationship

![Toggling View Option entries in the canvas context menu as the tables reflow](/img/demo-view-options.webp)

Cards in the Visualization tab's `Flow` mode do not follow these options: they use their own [row display](./visualization.md#row-display), and draw their connectors even with `Relationship` off.

## Table Properties

Opens the property panel of the selected table.
Start from the table context menu or by using the shortcut `Alt + Space`.
It provides three tabs: Indexes, Schema SQL, and Code Generator.
The panel keeps the five most recently opened tables along the top, so you can move between them without reopening it.

## Focusing on Tables

Opens the Visualization tab in `Flow` mode, narrowed to the chosen tables and every table one relationship away from them.  
Start from the table context menu with `Focus on this table`, or select one or more tables and press `Alt + F`.  
When the table you right-click is one of several selected tables, the entry reads `Focus on selected tables` and focuses the whole selection. Right-clicking a table outside the selection focuses that table alone.  
The shortcut takes the selected tables, leaves memos out, and does nothing when no table is selected.  
What the narrowed view shows, and how to get back to the whole diagram, is covered in [Visualization](./visualization.md#focusing-on-tables).

## Indexes

Indexes are defined in the `Indexes` tab of the table property panel and are included in the exported Schema SQL.

The left side lists the indexes on the table. Add one with `+`.  
Each index has a `UQ` toggle that makes it unique, a name field, and an `x` that removes it.

The right side lists the table's columns with a checkbox each. Nothing is editable until an index is selected on the left.  
Tick a column to add it to the selected index, and untick it to remove it.  
The columns of the selected index are listed below. Drag them by the grip handle to reorder them, and click the `ASC` or `DESC` chip on a row to flip its sort order.

![Adding an index in the table property panel and reading it back in the Schema SQL tab](/img/demo-table-properties.webp)

## Auto Layout

Arranges every table on the canvas for you.  
Open `Auto Layout` from the canvas context menu or from quick search, and pick one of four layouts:

| Layout | What it draws |
| --- | --- |
| `Force` | A simulation: relationships pull tables together, neighbors push each other apart, and overlapping tables come apart. |
| `Flow` | Left to right along the relationships, with every connector given its own point of contact on a table. It tries to keep crossings few, but can leave some that another layout would avoid. |
| `Tree - vertical` | Layered downwards: a parent table sits above the tables that carry a foreign key to it. |
| `Tree - horizontal` | The same layering, running left to right. |

`Force` opens a preview while the layout settles, with `Apply` and `Cancel` on the notice it shows.  
The preview is framed on the diagram as it stood when the layout started, so tables can move out of the frame as the layout settles. It is drawn at `70%` or less, so its tables show collapsed to a color bar and their name.  
`Apply` keeps the positions as they stand at that moment, and the layout is applied on its own once it comes to rest. `Cancel` or `Escape` leaves the diagram as it was.

The other three are worked out in one go, off the main thread, so there is nothing to watch: a notice shows while the layout is computed, and the finished arrangement is centered on what the diagram already covers. `Cancel` or `Escape` drops a layout you are no longer waiting for, and a host that runs no shared worker ends in `Could not place tables` — see [Web Workers](../../api/installation.md#web-workers). A layout that has not come back within 60 seconds ends the same way.

Whichever you pick, only tables are moved; memos stay where they are. A relationship from a table to itself is ignored, and several relationships between the same two tables count once.  
The result lands as a single history entry, so one undo puts every table back where it was.

![Tidying a heap of tables with the Flow auto layout from the canvas context menu](/img/demo-automatic-table-placement.webp)

## Databases

Supported databases include:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

These options determine the Schema SQL syntax for exporting, the DataType autocomplete, and the types that generated code and imported schemas resolve to.  
Multi-word type names such as `TIMESTAMP WITH TIME ZONE` and `INTERVAL DAY TO SECOND` are kept intact when Schema SQL is imported, argument list included.

![Switching the database to PostgreSQL, then picking a PostgreSQL type in the autocomplete](/img/demo-database.webp)

![Fuzzy DataType autocomplete, moved with the arrow keys and accepted with Right, Tab, or Enter](/img/demo-data-type-autocomplete.webp)

## Canvas Toolbar

A small toolbar floats over the middle of the bottom edge of the canvas, holding the tools that act on the canvas itself:

- The hand and the pointer. The pointer is the default; the hand turns every drag into a pan, over tables as well as empty space. `Space` switches between them.
- The zoom: `Zoom out`, the current zoom as a percentage, and `Zoom in`. The two buttons step the zoom the same way the zoom shortcuts do.
- The four relationship notations, the same four you start a relationship with — see [Editing Start](./editing-start.md). Picking one switches back to the pointer, since a relationship is drawn by clicking two tables.
- Zen mode, `Alt + Z`, which clears everything but the canvas and this toolbar. `Alt + Z` again, or the button, brings the rest back.
- The `Go to content` compass, which joins the end of the toolbar only while no table or memo is on screen — see [Getting Around the Canvas](#getting-around-the-canvas).

Every button with a shortcut names it in its tooltip.  
The toolbar steps aside while the `Force` Auto Layout preview, table properties, time travel, or the diff viewer is open, and comes back once it closes.

![Panning with the hand, stepping the zoom, and toggling zen mode from the canvas toolbar](/img/demo-canvas-toolbar.webp)

## Zoom In/Out

Zooms with `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac). The wheel alone pans the canvas.  
Shortcuts: `Ctrl + Plus` (Windows/Linux) or `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) or `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac) goes straight back to `100%`, keeping the middle of the screen where it is.

The `Zoom out` and `Zoom in` buttons on the [canvas toolbar](#canvas-toolbar) step the zoom like the `Minus` and `Plus` shortcuts: each press moves it 4 percentage points, keeping the middle of the screen where it is. The percentage between them shows the current zoom.

Zoom ranges from `10%` to `150%`.  
At `70%` and below, tables collapse to a color bar and their name, and cell editing, the cell shortcuts, and copy and paste stop working until you zoom back in.

The same three shortcuts also zoom the Visualization tab, in `Graph` and `Flow` mode alike, each mode within its own range — see [Visualization](./visualization.md#toolbar).

![Zooming out with ⌘ + Wheel until tables collapse, then stepping back with the zoom shortcuts](/img/demo-zoom.webp)

## Getting Around the Canvas

The canvas has no edges and no size to set. Tables and memos sit wherever you put them, and everything below describes the diagram rather than a fixed page.

Drag an empty area of the canvas to pan, or switch to the hand tool with `Space` and drag anywhere, including over a table. The wheel pans too, and `Shift + Wheel` pans sideways.  
Panning has no bounds: the wheel, a drag, and the hand tool carry the view as far as you move it, past the tables on any side.

The minimap in the top-right corner maps the diagram with a screen's worth of room on every side of it, the reach of the scrollbars, snapped outward to a coarse grid, so the further you zoom out, the smaller the diagram sits in it. Click it to move the view to that point, or drag the viewport rectangle to pan. As you zoom out, the viewport rectangle grows to cover more of the map.  
The scrollbars along the right and bottom edges describe the same travel, which runs from the diagram sitting just off one side of the screen to just off the other, so it is at least a screen longer than the diagram as drawn, and longer still while the view stands past it. Outside zen mode, both scrollbars show whenever the document holds a table or memo, even when all of it fits on screen; only an empty document shows neither, and no minimap.  
Dragging a scrollbar thumb or the minimap's viewport rectangle is the one pan that stops: it goes no further than the tables just off screen, or than where the drag started if that was further out.

If a pan leaves no table or memo on screen, a `Go to content` compass joins the end of the [canvas toolbar](#canvas-toolbar), with an arrow at the nearest one and how far away it is. Click it to centre that entity without changing the zoom.

![Panning by drag, wheel, and minimap, then following the Go to content compass back](/img/demo-canvas-navigation.webp)

## Diff Viewer

You can compare previously saved documents with the current document.  
Choose `Diff Viewer` from the canvas context menu and pick a `.json` document you exported earlier.

The view opens over the canvas: what changed on the left, then the saved document and the current one side by side.  
Both sides are read-only, so nothing in your document is modified. Close the view with the `Close` button on the notice it opens with, or with `Escape`.

![Opening the Diff Viewer on a saved .json file and running down the listed changes](/img/demo-diff-viewer.webp)
