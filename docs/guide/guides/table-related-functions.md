---
sidebar_position: 4
description: Select, move, copy, and duplicate tables and memos, set colors and view options, define indexes, choose a database, get around the infinite canvas, and compare documents.
---

# Table-related Functions

Everything you do to tables and memos once they exist — selecting, moving, copying, coloring, and setting what each table shows — plus the canvas controls around them.  
The table and memo commands come first, then table properties, indexes, automatic placement, and the database vendor, and the canvas itself last: the canvas toolbar, zoom, panning, and the diff viewer.

## Multiple Selection

Supports three methods:

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + A` or `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` or `⌘ + ⌥ + A` (Mac)

Memos are selected the same way, and either select-all shortcut takes every table and memo at once.  
`Ctrl + A` gives way to a caret, so it selects the text rather than the diagram while you are editing a cell.  
A selection box marks an entity when it covers the middle of it, not when it merely touches an edge.

![demo-table-select](/img/demo-table-select.webp)

In a collaborative session, each participant's selection, focused cell, and selection box are drawn on the canvas in that participant's color — see [Collaborative Editing](../../api/advanced/collaborative-editing.md).

## Moving Multiple Tables

Drag any table or memo that is already part of the selection and the whole selection moves with it — no modifier needed.  
Dragging something outside the selection collapses the selection onto it and moves that alone. `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) keeps the selection either way.

![demo-table-multiple-move](/img/demo-table-multiple-move.webp)

## Copying/Pasting Tables and Memos

Copies the selected tables and memos and pastes them back as new ones.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

A copied table keeps its name, comment, columns, and color; a copied memo keeps its text, size, and color. A copy keeps the original name.  
Indexes and relationships come along too: an index is copied whole onto the copied table, and a relationship is copied when both of the tables it joins are in the copied set. Half a relationship is dropped rather than left pointing back at the original.  
The pasted copies become the new selection, and pasting the same copy again offsets it by a further `50px` each time, so repeated pastes do not stack on top of one another.

When columns are selected inside a focused table, the same shortcut copies those columns instead — see [Table Editing](./table-editing.md).

## Duplicating Tables and Memos

Hold `Alt` and drag a table or memo with the left mouse button.  
A translucent preview follows the pointer, and releasing the button drops the copy where the preview sits.  
If what you grab is already part of a selection, the whole selection is duplicated. Otherwise the selection is replaced by the entity under the pointer.  
`Alt + click` without moving drops the copy `50px` down and to the right, stepping further whenever that spot is already taken.

A duplicate carries the same things as a paste: names, comments, columns, colors, memo sizes, and the indexes and relationships that belong entirely to what you copied.

## Table and Memo Deletion

Deletes the currently selected table or memo.  
Shortcuts: `Ctrl + Backspace` (Windows/Linux) or `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` (Mac) or `⌘ + Delete` (Mac)

![demo-table-remove](/img/demo-table-remove.webp)

## Table and Memo Color Specification

You can designate colors to differentiate by category.  
Click the color strip along the top of a table or memo to open the picker. The color is applied to every selected table and memo, not only the one you clicked.

![demo-table-color](/img/demo-table-color.webp)

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

![demo-view-options](/img/demo-view-options.webp)

## Table Properties

Opens the property panel of the selected table.
Start from the table context menu or by using the shortcut `Alt + Space`.
It provides three tabs: Indexes, Schema SQL, and Code Generator.
The panel keeps the five most recently opened tables along the top, so you can move between them without reopening it.

## Indexes

Indexes are defined in the `Indexes` tab of the table property panel and are included in the exported Schema SQL.

The left side lists the indexes on the table. Add one with `+`.  
Each index has a `UQ` toggle that makes it unique, a name field, and an `x` that removes it.

The right side lists the table's columns with a checkbox each. Nothing is editable until an index is selected on the left.  
Tick a column to add it to the selected index, and untick it to remove it.  
The columns of the selected index are listed below. Drag them by the grip handle to reorder them, and click the `ASC` or `DESC` chip on a row to flip its sort order.

## Automatic Table Placement

Spreads every table across the canvas so that connected tables sit near each other and overlapping ones are pulled apart.  
Run it from the canvas context menu or from quick search.

A preview of the whole diagram opens while the layout settles, with `Apply` and `Cancel` on the notice it shows.  
`Apply` keeps the positions as they stand at that moment, and the layout is applied on its own once it comes to rest. `Cancel` or `Escape` leaves the diagram as it was.  
The result lands as a single history entry, so one undo puts every table back where it was.

It works by running a force simulation over the diagram: relationships pull tables together, and neighbors push each other apart.

![demo-automatic-table-placement](/img/demo-automatic-table-placement.webp)

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

<img src="/img/database-menu.png" width="400" alt="Database selection menu" loading="lazy" />

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Canvas Toolbar

A small toolbar floats in the top-left corner of the canvas, holding the tools that act on the canvas itself:

- The hand and the pointer. The pointer is the default; the hand turns every drag into a pan, over tables as well as empty space. `Space` switches between them.
- The four relationship notations, the same four you start a relationship with — see [Editing Start](./editing-start.md). Picking one switches back to the pointer, since a relationship is drawn by clicking two tables.
- Zen mode, `Alt + Z`, which clears everything but the canvas and this toolbar. `Alt + Z` again, or the button, brings the rest back.

Every button names its shortcut in its tooltip.

## Zoom In/Out

Zooms with `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac). The wheel alone pans the canvas.  
Shortcuts: `Ctrl + Plus` (Windows/Linux) or `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) or `⌘ + Minus` (Mac)  
`Ctrl + O` (Windows/Linux) or `⌘ + O` (Mac) goes straight back to `100%`, keeping the middle of the screen where it is.

Zoom ranges from `10%` to `150%`.  
At `70%` and below, tables collapse to a color bar and their name, and cell editing, the cell shortcuts, and copy and paste stop working until you zoom back in.

![demo-zoom](/img/demo-zoom.webp)

## Getting Around the Canvas

The canvas has no edges and no size to set. Tables and memos sit wherever you put them, and everything below describes the diagram rather than a fixed page.

Drag an empty area of the canvas to pan, or switch to the hand tool with `Space` and drag anywhere, including over a table. The wheel pans too, and `Shift + Wheel` pans sideways.  
Panning is bounded by the diagram: you can push the tables just off screen on any side, but not into empty space beyond that.

The minimap in the top-right corner maps the diagram's own extent, with a margin around it. Click it to move the view to that point, or drag the viewport rectangle to pan. As you zoom out, the viewport rectangle grows to cover more of the map.  
The scrollbars along the right and bottom edges describe the same travel. Each one appears only when there is something to scroll on that axis, so an empty document shows neither, and neither a minimap.

If a pan leaves no table or memo on screen, a pill appears at the bottom edge with an arrow at the nearest one and how far away it is. Click it to centre that entity.

## Diff Viewer

You can compare previously saved documents with the current document.  
Choose `Diff Viewer` from the canvas context menu and pick a `.json` document you exported earlier.

<img src="/img/context-menu-diff-viewer.png" width="400" alt="Diff viewer context menu" loading="lazy" />

The view opens over the canvas: what changed on the left, then the saved document and the current one side by side.  
Both sides are read-only, so nothing in your document is modified. Close the view with the `Close` button on the notice it opens with, or with `Escape`.

![diff-viewer](/img/diff-viewer.png)
