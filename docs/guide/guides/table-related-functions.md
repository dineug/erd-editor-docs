---
sidebar_position: 4
description: Select, move, copy, duplicate, and delete tables and memos, set colors and view options, define indexes and alternate keys, choose a database, get around the infinite canvas, and compare documents.
---

# Table-related Functions

Everything you do to tables and memos once they exist — selecting, moving, copying, deleting, coloring, and setting what the canvas shows — plus the canvas controls around them.  
The table and memo commands come first; then table properties, focusing on tables, indexes and alternate keys, auto layout, and the database vendor; and last the canvas itself: the canvas toolbar, zoom, panning, and the diff viewer.  
Table groups, the boxes that gather tables, have a page of their own — see [Table Groups](./table-groups.md).

## Multiple Selection

Supports three methods:

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + A` or `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` or `⌘ + ⌥ + A` (Mac)

Memos are selected the same way, and either select-all shortcut takes every table and memo at once. Memos hidden with View Option → `Memos` are left out of select all and of a selection box — see [Table View Options](#table-view-options).  
[Table groups](./table-groups.md#selecting-groups) are added to the selection with `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac) on their title bar, but select all never takes one.  
`Ctrl + A` gives way to a caret, so it selects the text rather than the diagram while you are editing a cell.  
A selection box marks a table or memo when it covers the middle of it, not when it merely touches an edge. It takes a table group only when it encloses the group's whole box, so a box drawn inside a group picks out tables without the group.  
A right-click on something already selected keeps the whole selection, so menu rows such as `Color`, `Group selected tables`, and `Delete selected` act on all of it. A right-click on any other table, memo, or table group selects that alone, even with `Ctrl` or `⌘` held, and a right-click on a relationship or on empty canvas clears the selection.  
`Escape` clears the selection. While a cell, memo, or table group name editor is open, or a relationship or a `New Table Group` is being drawn, the first `Escape` ends that and a second one clears the selection.

![Selecting tables with ⌘ + drag and ⌘ + click, then every table and memo with ⌘ + A](/img/demo-table-select.webp)

In a collaborative session, each participant's selection, focused cell, and selection box are drawn on the canvas in that participant's color — see [Collaborative Editing](../../api/advanced/collaborative-editing.md).

## Moving Multiple Tables

Drag any table or memo that is already part of the selection and the whole selection moves with it — no modifier needed.  
Dragging something outside the selection collapses the selection onto it and moves that alone. `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) keeps the selection either way.  
Only the left mouse button moves tables and memos. A right-click picks what the context menu acts on and moves nothing, and a middle drag pans the canvas instead — see [Getting Around the Canvas](#getting-around-the-canvas).

![Dragging one of two selected tables moves both, and the relationship follows](/img/demo-table-multiple-move.webp)

A selected [table group](./table-groups.md) moves too, carrying its tables, and a table that is both selected and in a moving group moves once.  
Where you drop a table can move it into or out of a group — see [Adding and Removing Tables](./table-groups.md#adding-and-removing-tables).

Tables and memos share one stacking order. Pressing a table or memo, with the left or the right button, brings it in front of every other table and memo, and pressing a table group's title bar, or right-clicking its body, brings its tables to the front.  
The order is not saved: a reopened diagram stacks its tables in the order the file lists them, with every memo above them.

## Copying/Pasting Tables and Memos

Copies the selected tables and memos and pastes them back as new ones.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

A copied table keeps its name, comment, columns, and color; a copied memo keeps its text, size, and color.  
Indexes and relationships come along too: an index is copied whole onto the copied table, and a relationship is copied with its type and its ON DELETE and ON UPDATE actions when both of the tables it joins are in the copied set. Half a relationship is dropped rather than left pointing back at the original.  
The pasted copies become the new selection, and pasting the same copy again offsets it by a further `50px` each time, so repeated pastes do not stack on top of one another.  
A copy does not keep its [table group](./table-groups.md): the pasted table is in no group, even when it lands inside a group's box, and a selected group is not copied.  
While View Option → `Memos` hides the memos, a paste still adds the memos it carries, hidden and unselected, so only the pasted tables become the selection.

![Copying two related tables and pasting them twice, relationship included](/img/demo-table-copy-paste.webp)

When columns are selected inside a focused table, the same shortcut copies those columns instead — see [Table Editing](./table-editing.md).

## Duplicating Tables and Memos

Hold `Alt` and drag a table or memo with the left mouse button.  
A translucent preview follows the pointer, and releasing the button drops the copy where the preview sits.  
If what you grab is already part of a selection, the whole selection is duplicated. Otherwise the selection is replaced by the entity under the pointer.  
`Alt + click` without moving drops the copy `50px` down and to the right, stepping further whenever that spot is already taken.

A duplicate carries the same things as a paste: names, comments, columns, colors, memo sizes, and the indexes and relationships that belong entirely to what you copied. Like a paste, it lands in no table group.  
`Alt + drag` on a table group's title bar moves the group as a plain drag does; a group is never duplicated.

![Duplicating a table with Alt + drag, then Alt + click for another copy down and to the right](/img/demo-table-duplicate.webp)

## Table and Memo Deletion

Deletes the selected tables, memos, and [table groups](./table-groups.md).  
Shortcuts:

- `Delete` or `Backspace`. These remove the whole selection, except when the only thing selected is a table with some of its columns selected and the zoom is above `70%`: then they remove those columns instead — see [Column Deletion](./table-editing.md#column-deletion).
- `Ctrl + Backspace` or `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` or `⌘ + Delete` (Mac). These always remove the selected tables, memos, and table groups, even while columns are selected.

![Deleting a table and its relationships with the Delete key, then a table and a memo together with Delete selected from the memo's menu](/img/demo-table-remove.webp)

The context menus delete too. The last row of a table's or a memo's menu reads `Delete selected` while that table or memo is one of two or more selected items, and removes the whole selection. Otherwise it reads `Delete` and removes that table or memo alone. Over the row of a selected column, a table's menu reads `Delete column` or `Delete columns` instead, as in [Column Deletion](./table-editing.md#column-deletion).

Removing a table removes its relationships and indexes with it. Removing a table group keeps its tables, in no group — see [Removing a Group](./table-groups.md#removing-a-group).  
There is no confirmation, each removal is one undo step, and in a `readonly` editor nothing is removed.  
Held down, `Delete` and `Backspace` remove only once, and they never remove a relationship — see [Relationship Editing](./relationship-editing.md#deletion). While you type in a cell, a memo, or any other text field, they edit the text instead.  
Settings lists the two keys as `Delete Selection` — see [Shortcuts](./settings.md#shortcuts).

## Table and Memo Color Specification

You can designate colors to differentiate by category.  
A table wears its color down its left edge, and a memo along its top. Click that edge or strip with the left button, or choose `Color` in the table's or memo's context menu, to open the color picker at the pointer. The color is applied to every selected table, memo, and table group, not only the one you clicked.  
A table group is colored from `Color` in its own menu, and a table in a colored group wears the group's color across its header while keeping its own color on its left edge — see [Coloring a Group](./table-groups.md#coloring-a-group).

![Picking the Blue preset from a memo's color strip for two selected tables and the memo, then taking the color off with No color](/img/demo-table-color.webp)

The picker holds, from top to bottom:

- A saturation and brightness area, then the hue slider with a preview of the color beside it. Where the browser offers an eyedropper, a pipette button before the slider, `Pick a color from the screen`, takes a color from anywhere on the screen.
- `Hex`, `R`, `G`, and `B` fields. `Hex` takes 3, 4, 6, or 8 hex digits, with or without `#`, or a pasted `rgb()`, `hsl()`, or CSS color name. A full 6- or 8-digit value applies as you type, and anything else on `Enter` or when you leave the field. `R`, `G`, and `B` take whole numbers, reading anything above `255` as `255`, and apply on `Enter` or when you leave the field. Text the picker cannot read is dropped.
- Sixteen preset swatches in two rows of eight: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown, and Gray. Hovering a swatch shows its hex code.
- `Document colors`: up to eight colors that the document's tables, memos, and table groups already use, most used first. The row shows only when there are some.
- `No color`.

A color is always solid: the picker has no transparency control, and drops any transparency a typed or pasted value carries.  
Opening the picker changes nothing, and picking the color the selection already has adds no undo step.

`No color` clears the color of every selected table, memo, and table group in one undo step, and closes the picker. `Remove color`, right under `Color` in the table, memo, and table group context menus while any selected item has a color, does the same without opening the picker.

The picker takes the keyboard when it opens, and `Tab` and `Shift + Tab` go round its controls. The arrow keys move the area and the hue slider by 1, or by 10 with `Shift`, and move from swatch to swatch, applying each as they go.  
While the picker has the keyboard, undo and redo, the zoom shortcuts, Search, and Find and Replace still reach the editor, and the other editor shortcuts do not: the [deletion](#table-and-memo-deletion) shortcuts remove nothing, and `Delete` and `Backspace` only edit the text of the `Hex`, `R`, `G`, and `B` fields.  
`Escape` closes the picker, and so does a press on the canvas outside it.

## Table View Options

Offers the following view options:

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Unique`, `Alternate Key`, and `Auto Increment` are off by default, and the rest are on.  
`Alternate Key` marks the columns of each alternate key, such as `AK1.1` — see [Alternate Keys](#alternate-keys).  
`Referential Actions` shows the `D:` and `U:` labels that a relationship's ON DELETE and ON UPDATE actions put at the child end of its connector — see [Reading a Connector](./relationship-editing.md#reading-a-connector). Turning it off hides only those labels and moves no table or connector.  
`Table Groups` shows the [table groups](./table-groups.md) and the group colors on their tables' headers. Turning it off hides them on the canvas, the minimap, and image exports, moves no table, and keeps every table in its group — see [Hiding Groups](./table-groups.md#hiding-groups).  
`Memos` shows the memos. Turning it off hides every memo on the canvas, the minimap, and image exports, and moves no table or connector. Hidden memos take up no room, so the scrollbars, the minimap, and the `Go to content` compass leave them out.  
Hiding the memos deselects them and closes an open memo editor. [Find and Replace](./find-and-replace.md) and quick search's `:` do not search them. While they are hidden, `New Memo` leaves the context menu, quick search, and the [welcome screen](./editing-start.md#welcome-screen), and `Alt + M` adds no memo. A paste or [Import and Add](./file-import-export.md#import-and-add) still adds the memos it carries, hidden and unselected.  
In a `readonly` editor the toggles change nothing.

![Toggling View Option entries as the tables reflow, marking a composite unique index AK1.1 and AK1.2 with Alternate Key, then turning Memos off and on](/img/demo-view-options.webp)

Cards in the Visualization tab's `Flow` mode do not follow these options: they use their own [row display](./visualization.md#row-display), and draw their connectors even with `Relationship` off.

## Table Properties

Opens the property panel of a table.  
Start from `Table Properties` in the table context menu, which opens it for the table you right-clicked, or select a table and press `Alt + Space`.  
The panel opens in the middle of a dimmed canvas, and opening it closes an open [Find and Replace](./find-and-replace.md) panel. Its header holds the `Table Properties` title, the five most recently opened tables as chips with the current one highlighted, and a close button. Click a chip to move to that table without reopening the panel.  
Below the header are three tabs: `Indexes`, `Schema SQL`, and `Code Generator`. The panel keeps one size for all three, so switching tabs does not move or resize it.  
Close it with the close button, with `Escape`, or by clicking outside it.

The `Indexes` tab is covered in [Indexes](#indexes).  
The `Schema SQL` tab shows the table's DDL for the selected [database](#databases): its `CREATE TABLE`, the separate constraints some databases write for its Unique columns, and its indexes. It always writes plain `CREATE` statements, with no header and no before or after script, whatever the toolbar's [Schema SQL](./schema-sql.md) tab is set to. It has no options panel, and its context menu offers only `Database` and `Bracket`.  
The `Code Generator` tab generates code for this table alone — see [Code Generator](./code-generator.md).

In a `readonly` editor the panel still opens, with a `Read only` badge beside its title, but its `Indexes` tab offers no edits.

## Focusing on Tables

Opens the Visualization tab in `Flow` mode, narrowed to the chosen tables and every table one relationship away from them.  
Start from the table context menu with `Focus on this table`, or select one or more tables and press `Alt + F`.  
When the table you right-click is one of several selected tables, the entry reads `Focus on selected tables` and focuses the whole selection. Right-clicking a table outside the selection focuses that table alone.  
The shortcut takes the selected tables, leaves memos out, and does nothing when no table is selected.  
A selected [table group](./table-groups.md) counts for nothing here, in the shortcut and the menu entry alike: its tables are taken only when they are selected themselves, which `Select tables` in the group's menu does.  
What the narrowed view shows, and how to get back to the whole diagram, is covered in [Visualization](./visualization.md#focusing-on-tables).

## Indexes

Indexes are defined in the `Indexes` tab of the table property panel and are included in the exported Schema SQL.

The left side lists the table's keys and indexes in two groups.  
`Keys`, shown when the table has any, lists the keys its columns declare: `PK_<table name>` over the columns marked PK, then `UQ_<table name>_<column name>` for each column marked Unique, in column order. The names follow the selected database's Schema SQL, so with `Bracket` at `None` a schema-qualified table such as `sales.users` lists `PK_users` under every database but Databricks and Snowflake — see [Schema-qualified Table Names](./schema-sql.md#schema-qualified-table-names). Each is tagged `PK` or `UQ` and marked with a lock. They are read-only here and change only with the columns' [PK](./table-editing.md#column-primary-key) and [Unique](./table-editing.md#not-null-unique-auto-increment) flags.  
`Indexes` lists the table's indexes in the order they were added. Each index has a `UQ` toggle that makes it unique, a name field, and an `x` that removes it. An index that is an [alternate key](#alternate-keys) also shows its number, such as `AK1`. Add an index with `Add Index` at the bottom of the list.

The right side lists the table's columns under `Columns`, with a checkbox each. Nothing is editable until an index is selected on the left.  
Tick a column to add it to the selected index, and untick it to remove it. Selecting a key shows its columns ticked, but the boxes stay disabled.  
The columns of the selected index are listed below under `Index order`. Drag them by the grip handle to reorder them, and click the `ASC` or `DESC` chip on a row to flip its sort order. In an alternate key, each row ends in its `AK<n>.<m>` mark. The list shows three rows at a time and scrolls the rest.

In a `readonly` editor, selecting a key or an index still shows its columns, but there is no `Add Index` and no `x`, and nothing else in the tab can be changed.

![Opening Table Properties on orders, where the Indexes tab lists the PK and UQ keys above the indexes, then adding an index over member_id and ordered_at DESC and reading it back in the Schema SQL tab](/img/demo-table-properties.webp)

## Alternate Keys

An alternate key is a unique index over two or more columns: an index in the `Indexes` tab with its `UQ` toggle on and at least two of the table's columns ticked.  
A unique index over one column says no more than that column's Unique flag, so it is not an alternate key, and neither is a plain index, the primary key, or a column marked Unique.

With `Alternate Key` turned on in the [view options](#table-view-options), the diagram marks the columns of each alternate key as erwin and IDEF1X write them: `AK1.1`, `AK1.2`, and so on. The option is off by default.

Keys are numbered by where their columns stand in the table, not by the order the indexes were added. The key whose first column in its `Index order` stands highest in the table is `AK1`. On a tie, the next column of each key decides, and a key that is the leading part of a longer one comes before it.  
Moving a column within the table, or reordering a key's `Index order`, can renumber the keys. Undoing the removal of a key gives it back its number, and every collaborator sees the same numbers.

Each column of a key is marked `AK<n>.<m>`, where `n` is the key's number and `m` the column's place in the key's `Index order`. A column in several keys carries every mark, joined by a comma.  
For example, in a table with columns `a`, `b`, and `c`, unique indexes over (`c`, `a`) and (`b`, `a`) become `AK1` = (`b`, `a`) and `AK2` = (`c`, `a`), because `b` stands above `c`. So `b` reads `AK1.1`, `c` reads `AK2.1`, and `a` reads `AK1.2,AK2.2`.

The mark is drawn last in the row, past whichever cell the [column order](./settings.md#adjusting-column-order) puts last. It is not a cell, so it is never focused, edited, or copied — see [Table Editing](./table-editing.md).  
A primary key or foreign key column can carry an AK mark too, since the mark replaces nothing: the key icon at the start of the row still shows PK and FK, and the Unique cell keeps its own `UQ`.  
A table that has an alternate key keeps room after the last cell of every row for its longest mark; a table without one keeps its width.  
The marks show on the ERD canvas, where a table collapsed to its name at `70%` and below shows none, and in an [image export](./file-import-export.md#image), which draws every table in full whatever the zoom. The Visualization tab's [hover preview](./visualization.md#hover-preview) in `Graph` mode shows them too; `Flow` cards never show them.

The `Indexes` tab shows the numbers whether or not the option is on — see [Indexes](#indexes).

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
The preview is framed on the diagram as it stood when the layout started, so tables can move out of the frame as the layout settles. It is drawn at `70%` or less, so its tables show collapsed to their name and their color edge.  
`Apply` keeps the positions as they stand at that moment, and the layout is applied on its own once it comes to rest. `Cancel` or `Escape` leaves the diagram as it was.

The other three are worked out in one go, off the main thread, so there is nothing to watch: a notice shows while the layout is computed, and the finished arrangement is centered on what the diagram already covers. `Cancel` or `Escape` drops a layout you are no longer waiting for, and a host that runs no shared worker ends in `Could not place tables` — see [Web Workers](../../api/installation.md#web-workers). A layout that has not come back within 60 seconds ends the same way.

Whichever you pick, tables and table groups are moved, and memos stay where they are. A relationship from a table to itself is ignored, and several relationships between the same two tables count once.  
Every layout keeps each group's tables together, whether or not the groups are shown, and fits each group that holds tables around them — see [Table Groups](./table-groups.md#auto-layout).  
The result lands as a single history entry, so one undo puts every table and group back where it was.

![Tidying a heap of tables with the Flow auto layout from the canvas context menu, which lines them up left to right along their relationships](/img/demo-automatic-table-placement.webp)

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

Pick one from `Database` in the canvas context menu, in the options panel or context menu of the Schema SQL and Code Generator tabs, or in quick search. All of them change the same setting.

These options determine the Schema SQL syntax for exporting, the DataType autocomplete, and the types that generated code and imported schemas resolve to.  
They decide which `Statements` and `Header` choices the [Schema SQL](./schema-sql.md#options-panel) tab can write. A choice the database lacks stays in the options panel, dimmed, and the SQL falls back to the nearest one it has.  
They also decide which ON DELETE and ON UPDATE actions Schema SQL and the Code Generator's ORM targets write, and which ones the relationship menus mark `not in <database>` — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update) and [Code Generator](./code-generator.md#database).  
Schema SQL import keeps a column's data type, argument list included, whether or not the editor lists it, such as `TIMESTAMP WITH TIME ZONE`, `public.mood`, or `integer[]` — see [Data Types](./file-import-export.md#data-types). The DataType autocomplete suggests only the types the selected database lists.

![Switching the database to PostgreSQL, then picking a PostgreSQL type in the autocomplete](/img/demo-database.webp)

![Fuzzy DataType autocomplete, moved with the arrow keys and accepted with Right, Tab, or Enter](/img/demo-data-type-autocomplete.webp)

## Canvas Toolbar

A small toolbar floats over the middle of the bottom edge of the canvas, holding the tools that act on the canvas itself:

- The hand and the pointer. The pointer is the default; the hand turns every drag into a pan, over tables as well as empty space. `Space` switches between them. While a [`New Table Group`](./table-groups.md#drawing-a-group) is being drawn neither is marked, and clicking either, pressing `Space`, or picking a relationship notation ends the draw without adding a group.
- The zoom: `Zoom out`, the current zoom as a percentage, and `Zoom in`. The two buttons step the zoom the same way the zoom shortcuts do, and clicking the percentage puts it back to `100%`.
- The four relationship notations, the same four you start a relationship with — see [Editing Start](./editing-start.md). Picking one switches back to the pointer, since a relationship is drawn by clicking two tables.
- Zen mode, `Alt + Z`, which clears everything but the canvas and this toolbar. `Alt + Z` again, or the button, brings the rest back. An open [Find and Replace](./find-and-replace.md) panel stays, moving up into the room the top toolbar leaves.
- The `Go to content` compass, which joins the end of the toolbar only while no table, shown memo, or shown table group is on screen — see [Getting Around the Canvas](#getting-around-the-canvas).

Every button with a shortcut names it in its tooltip.  
The toolbar steps aside while the `Force` Auto Layout preview, table properties, time travel, or the diff viewer is open, and comes back once it closes.

![Panning over a table with the hand, switching back to the pointer with Space, stepping the zoom out and in, and toggling zen mode with ⌥ + Z and its button](/img/demo-canvas-toolbar.webp)

## Zoom In/Out

Zooms with `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac). The wheel alone pans the canvas.  
A trackpad pinch zooms too, about the point you pinch at, and so do two fingers on a touch screen, which also pan as they move.  
Shortcuts: `Ctrl + Plus` (Windows/Linux) or `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) or `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac) goes straight back to `100%`, keeping the middle of the screen where it is.

The `Zoom out` and `Zoom in` buttons on the [canvas toolbar](#canvas-toolbar) step the zoom like the `Minus` and `Plus` shortcuts: each press moves it 4 percentage points, keeping the middle of the screen where it is. The percentage between them shows the current zoom, and clicking it goes straight back to `100%` like `Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac).

Zoom ranges from `10%` to `150%`.  
At `70%` and below, tables collapse to their name and their color edge, and cell editing, the cell shortcuts, and copy and paste stop working until you zoom back in.

The same three shortcuts also zoom the Visualization tab, in `Graph` and `Flow` mode alike, each mode within its own range — see [Visualization](./visualization.md#toolbar).

![Zooming out with ⌘ + Wheel until tables collapse to their name, then stepping back with ⌘ + Plus, ⌘ + Minus, and ⌘ + 0](/img/demo-zoom.webp)

## Getting Around the Canvas

The canvas has no edges and no size to set. Tables and memos sit wherever you put them, and everything below describes the diagram rather than a fixed page.

Drag an empty area of the canvas to pan, or switch to the hand tool with `Space` and drag anywhere, including over a table. The wheel pans too, and `Shift + Wheel` pans sideways.  
A [table group](./table-groups.md#selecting-groups)'s body, the area under its title bar, counts as empty canvas to the left button: dragging it pans, `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) draws a selection box, and a click clears the selection.  
Panning has no bounds: the wheel, a drag, and the hand tool carry the view as far as you move it, past the tables on any side.

Drag with the middle mouse button (press the wheel) to pan from anywhere on the canvas, with the pointer or the hand alike. It works even when the press lands on a table, a memo, a cell, an icon, or a relationship.  
A middle drag selects, moves, and clicks nothing, and keeps the selection. It closes an open context menu and the color picker, and the browser's own middle-click scrolling and pasting do not start.  
A middle press on the scrollbars, the minimap, the canvas toolbar, or an open cell or memo editor does not pan.

The minimap in the top-right corner maps the diagram with a screen's worth of room on every side of it, the reach of the scrollbars, snapped outward to a coarse grid, so the further you zoom out, the smaller the diagram sits in it. Click it to move the view to that point, or drag the viewport rectangle to pan. As you zoom out, the viewport rectangle grows to cover more of the map.  
It draws each table in the table's color, and each shown table group as a box in the group's color behind its tables.  
The scrollbars along the right and bottom edges describe the same travel, which runs from the diagram sitting just off one side of the screen to just off the other, so it is at least a screen longer than the diagram as drawn, and longer still while the view stands past it. Outside zen mode, both scrollbars show whenever the document holds a table, a shown memo, or a shown table group, even when all of it fits on screen. A document with none of these, such as one whose only memos are hidden with View Option → `Memos`, shows neither, and no minimap.  
Dragging a scrollbar thumb or the minimap's viewport rectangle is the one pan that stops: it goes no further than the tables just off screen, or than where the drag started if that was further out.

If a pan leaves no table, shown memo, or shown table group on screen, a `Go to content` compass joins the end of the [canvas toolbar](#canvas-toolbar), with an arrow at the nearest one and how far away it is. Click it to centre that one without changing the zoom.

![Panning by dragging empty canvas, a middle-button drag over a table, the minimap, and the wheel, then following the Go to content compass back](/img/demo-canvas-navigation.webp)

## Diff Viewer

You can compare previously saved documents with the current document.  
Choose `Diff Viewer` from the canvas context menu and pick a `.json` document you exported earlier.

The view opens over the canvas: what changed on the left, then the saved document and the current one side by side.  
Tables and columns are matched by name. A cell whose value differs between the two is tinted on both sides, red in the saved document and green in the current one, so a table or column found on one side only is tinted throughout.  
Memos and table groups are drawn on each side as that document holds them, but they are not compared: they are never tinted, and the list on the left names only tables and columns.  
Each side pans with the wheel, by dragging an empty area or a table group's body, or by dragging with the middle button anywhere over it, and zooms with `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac), or a pinch. At `70%` and below its tables collapse as they do on the canvas, and the tint is not shown.  
Both sides are read-only, so nothing in your document is modified. Close the view with the `Close` button on the `Diff Viewer` notice it opens with, or with `Escape`.

![Opening the Diff Viewer from the canvas menu on a saved .json file, running down the listed changes, and closing it](/img/demo-diff-viewer.webp)
