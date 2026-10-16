---
sidebar_position: 4
description: Select, move, copy, duplicate, and delete tables and memos, set colors and view options, define indexes and alternate keys, choose a database, get around the infinite canvas, and compare documents.
---

# Table-related Functions

Everything you do to tables and memos once they exist — selecting, moving, copying, deleting, coloring, and setting what the canvas shows — plus the canvas controls around them.  
The table and memo commands come first; then table properties, focusing on tables, indexes and alternate keys, auto layout, and the database vendor; and last the canvas itself: the canvas toolbar, zoom, panning and where a jump lands, and the diff viewer.  
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
While the picker has the keyboard, undo and redo, the zoom shortcuts, `Search`, and `Toggle Explorer` still reach the editor, and the other editor shortcuts do not: the [deletion](#table-and-memo-deletion) shortcuts remove nothing, and `Delete` and `Backspace` only edit the text of the `Hex`, `R`, `G`, and `B` fields.  
`Escape` closes the picker, and so does a press on the canvas outside it.  
A press in the [Explorer](./explorer.md) is not a press on the canvas, so it leaves the picker open. A row chosen there changes the selection, and the next pick colors the new selection.

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
`Table Groups` shows the [table groups](./table-groups.md) and the group colors on their tables' headers. Turning it off hides them on the canvas, the minimap, and image exports, moves no table, and keeps every table in its group — see [Hiding Groups](./table-groups.md#hiding-groups). It also takes the `Table Groups` folder out of the [Explorer](./explorer.md#the-tree) and `New Table Group` off the [canvas toolbar](#canvas-toolbar), and the Explorer's search stops finding group names.  
`Memos` shows the memos. Turning it off hides every memo on the canvas, the minimap, and image exports, and moves no table or connector. Hidden memos take up no room, so the scrollbars, the minimap, and the `Go to content` compass leave them out.  
Hiding the memos deselects them and closes an open memo editor. The [Explorer](./explorer.md#the-tree) drops its `Memos` folder, and its [Find and Replace](./find-and-replace.md) search and quick search's `:` do not search them. While they are hidden, `New Memo` leaves the context menu, the [canvas toolbar](#canvas-toolbar), quick search, and the [welcome screen](./editing-start.md#welcome-screen), and `Alt + M` adds no memo. A paste or [Import and Add](./file-import-export.md#import-and-add) still adds the memos it carries, hidden and unselected.  
In a `readonly` editor the toggles change nothing.

![Toggling View Option entries as the tables reflow, marking a composite unique index AK1.1 and AK1.2 with Alternate Key, then turning Memos off and on](/img/demo-view-options.webp)

Cards in the Visualization tab's `Flow` mode do not follow these options: they use their own [row display](./visualization.md#row-display), and draw their connectors even with `Relationship` off.

## Table Properties

Opens the property panel of a table.  
Start from `Table Properties` in the table context menu, which opens it for the table you right-clicked, or select a table and press `Alt + Space`.  
The panel opens in the middle of a dimmed canvas. Only the canvas is dimmed, so an open [Explorer](./explorer.md#dialogs-beside-it) stays open and usable beside it. Its header holds the `Table Properties` title, the five most recently opened tables as chips with the current one highlighted, and a close button. Click a chip to move to that table without reopening the panel.  
Below the header are three tabs: `Indexes`, `Schema SQL`, and `Code Generator`. The panel keeps one size for all three, so switching tabs does not move or resize it.  
Close it with the close button, with `Escape`, or by clicking outside it on the canvas.  
Choosing a row other than a folder in the Explorer, or going to a match of its search, closes Table Properties before the jump. So does `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), which opens the Explorer's search, or puts the caret in its Find field when the Explorer is already open. Any other click in the Explorer, a folder row included, or on the toolbar's `Explorer` button, leaves Table Properties open. An `Escape` pressed while the keyboard is in the Explorer only gives the keyboard back to the canvas, so it takes a second `Escape` to close Table Properties.

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

The [Explorer](./explorer.md#the-tree) lists each table's indexes in the table's `Indexes` folder, and choosing one there goes to its table. Its search finds index names too, and can rename them — see [What It Searches](./find-and-replace.md#what-it-searches).

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

A small toolbar floats over the middle of the bottom edge of the canvas, holding, from left to right, the tools that act on the canvas itself and the commands that add to it:

- The hand and the pointer. The pointer is the default; the hand turns every drag into a pan, over tables as well as empty space. `Space` switches between them. While a [`New Table Group`](./table-groups.md#drawing-a-group) draw is armed, the `New Table Group` button is marked instead of either, and clicking either, pressing `Space`, or picking a relationship notation ends the draw without adding a group.
- `New Table`, `New Memo`, and `New Table Group`. `New Table` adds a table as `Alt + N` does, and `New Memo` adds a memo as `Alt + M` does. `New Table Group` arms the [group draw](./table-groups.md#drawing-a-group) as `Alt + G` does and turns the hand off; a second click, like a second `Alt + G`, ends the draw without adding a group. `New Memo` is left out while View Option → `Memos` hides the memos, and `New Table Group` while View Option → `Table Groups` hides the groups. A `readonly` editor shows none of the three.
- The zoom: `Zoom out`, the current zoom as a percentage, and `Zoom in`. The two buttons step the zoom the same way the zoom shortcuts do, and clicking the percentage puts it back to `100%`.
- The four relationship notations, the same four you start a relationship with — see [Editing Start](./editing-start.md). Picking one switches back to the pointer, since a relationship is drawn by clicking two tables.
- Zen mode, `Alt + Z`, which clears everything but the canvas and this toolbar. `Alt + Z` again, or the button, brings the rest back. An open Explorer is hidden with the rest, without being closed, and comes back with it. It can still be opened during zen mode — see [When It Stands Aside](./explorer.md#when-it-stands-aside).
- The `Go to content` compass, which joins the end of the toolbar only while no table, shown memo, or shown table group is on screen — see [Getting Around the Canvas](#getting-around-the-canvas).

Every button with a shortcut names it in its tooltip, such as `New Table (Alt + N)` (Windows/Linux) or `New Table (⌥ + N)` (Mac).  
The toolbar steps aside while the `Force` Auto Layout preview, table properties, time travel, or the diff viewer is open, and comes back once it closes.

![Adding a table and a memo from the toolbar, arming and disarming New Table Group, panning with the hand, stepping the zoom, and toggling zen mode with ⌥ + Z](/img/demo-canvas-toolbar.webp)

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

If a pan leaves no table, shown memo, or shown table group on screen, a `Go to content` compass joins the end of the [canvas toolbar](#canvas-toolbar), with an arrow at the nearest one and how far away it is. Click it to center that one without changing the zoom.

![Panning by dragging empty canvas, a middle-button drag over a table, the minimap, and the wheel, then following the Go to content compass back](/img/demo-canvas-navigation.webp)

### Where a Jump Lands

Every go-to that takes you to something on the canvas moves the view by one rule: the `#`, `@`, and `:` results of [Quick Search](./quick-search.md#searching-the-diagram), the rows of the [Explorer](./explorer.md#going-to-a-row) and the matches of its [Find and Replace](./find-and-replace.md#going-to-a-match) search, the rows of the [Diff Viewer](#going-to-a-change)'s list, the external-link [card button](./visualization.md#card-buttons) in Flow, and the landing of an [Import and Add](./file-import-export.md#import-and-add). Each of those sections says what the go-to selects; this one says where the view goes.

A jump never changes the zoom, and makes one scroll at most. From another tab it switches to the ERD tab first.  
It measures the canvas as it shows: below the top toolbar, or the whole height in zen mode, and right of an open Explorer, which narrows the canvas rather than covering it.

Across and down are judged separately, and a direction in which the target already shows well is left exactly as it is:

- A target no longer than half the canvas in that direction stays put while its middle lies in the middle half of the canvas, between a quarter and three quarters of the way across, or down. Otherwise its middle is brought to the middle of the canvas.
- A longer target that still fits with `40px` to spare at each end stays put while it is wholly in view. Otherwise, across, it is centered; down, its top is brought to `40px` below the top of the canvas.
- A target longer than that stays put while it is wholly in view, or, when it is longer than the canvas, while its key part, listed below, is. Otherwise it is centered if it fits, or else placed as near the middle as keeps both ends of its key part at least `40px` inside the canvas; a key part too long for that has its start kept `40px` in.

So a small table near the left edge of the canvas, halfway down, moves across only.

What a jump brings into view, and the key part that has to show when the whole does not fit:

- A table: the whole table, by the name band across its top, or by its comment cell for a table comment match while View Option → `Table Comment` shows the comments. At `70%` and below, where tables collapse to their name, by the name in the middle of the box.
- A column: its row, by the cell the jump goes to: its name, or the comment a match is in while View Option → `Column Comment` shows the comments. At `70%` and below, a column brings its table into view by the table's rule.
- A cell too wide to show whole, such as a long comment: by the matched text in it.
- A relationship: the box spanning its two tables, by the child table.
- A table group: its box, by its title bar.
- A memo, or the block an Import and Add lands: the whole of it.

When neither direction would move, there is no scroll, so going to the same place twice in a row moves nothing the second time. A jump that scrolls the canvas records the scroll in the [undo history](./undo-redo.md#what-the-history-records) like any other change of view position, and one that moves nothing leaves nothing to undo. For an Import and Add, the scroll is part of the same step as the addition. A row of the Diff Viewer's list moves only the view's read-only sides, so it records nothing.  
No jump starts or finishes a relationship being drawn. The `Go to content` compass is not a jump: it centers what it points at.

## Diff Viewer

You can compare previously saved documents with the current document.  
Choose `Diff Viewer` from the canvas context menu and pick a `.json` document you exported earlier.

The view opens over the canvas: what changed on the left, then the saved document and the current one side by side.  
The current document is compared as it stands when the view opens; changes made after that, a collaborator's included, do not reach the view. An open [Explorer](./explorer.md#when-it-stands-aside) is hidden while the view is open, so the view takes the editor's whole width.  
Each side pans with the wheel, by dragging an empty area or a table group's body, or by dragging with the middle button anywhere over it, and zooms with `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac), or a pinch. At `70%` and below its tables collapse as they do on the canvas — see [Marks on the Two Sides](#marks-on-the-two-sides).  
Both sides are read-only, so nothing in your document is modified. Each keeps its own selection, and a click on a table there selects it on that side alone.  
Close the view with the `Close` button on the `Diff Viewer` notice it opens with, or with `Escape`.

![Opening the Diff Viewer on a saved .json file, clicking rows marked A, M, D, and R in its tree, filtering by name, and closing it](/img/demo-diff-viewer.webp)

### What Is Compared

Tables, columns, indexes, foreign keys, memos, and table groups are all compared.  
Each item is paired first by its id, so against an earlier version of the same file, which keeps the ids, a renamed table, column, index, or table group is still one item, listed as renamed.  
What is left pairs one to one by what it keeps: a table or a table group by its name, case included; a column or an index by its table and its name; a foreign key by its two tables and its column pairs; and a memo by its text, then its position. An index with no name pairs by its columns, their order and direction, and whether it is unique, and a table group with no name by the most tables it shares.  
So against a file from elsewhere, such as a diagram rebuilt by SQL import, a renamed table shows as one removed and one added.

What counts as a change:

- A table: its name, comment, table group, position, and color.
- A column: its name, comment, data type, default, Auto Increment, primary key, Unique, Not Null, and its place in the table. Only the columns outside the order both documents share count as moved, so adding, removing, or moving one column does not mark the others.
- An index: its name, UNIQUE, and its columns, with their order and direction.
- A foreign key: its column pairs, relationship type, and ON DELETE and ON UPDATE actions.
- A memo: its text, position, size, and color.
- A table group: its name, the tables it holds, color, position, and size.

So a table, memo, or group that was only moved, resized, or recolored counts as changed. Positions and sizes are compared in whole pixels, and stacking order and where a connector meets a table never count.

### The Change Tree

The list on the left is drawn as the [Explorer's tree](./explorer.md#the-tree) and holds only what changed: `Tables`, `Table Groups`, and `Memos`, each shown only when it holds a row, and under a table its own `Columns`, `Indexes`, and `Foreign Keys`. A foreign key is listed under its child table, and a table added or removed lists nothing inside it.  
Every folder shows how many rows it holds, and every folder and table starts unfolded.  
Tables and table groups are listed by name, ignoring case. Memos, and a table's columns, indexes, and foreign keys, keep the current document's order, with a removed one put back where it stood. A memo row reads the memo's first line, and a foreign key row reads its child columns, then `→` with the parent table and its columns, such as `user_id → users(id)`. A blank name reads `unnamed` in italics.

Each row ends on a letter, and a row marked `A`, `D`, `M`, or `R` has its name in the letter's color:

- `A`, added, in green: only in the current document.
- `D`, removed, in red and struck through: only in the saved document.
- `M`, modified, in amber: in both, changed.
- `R`, renamed, in blue: in both, with a new name. A rename outranks any other change, which the tooltip still lists.
- `~`, in amber, ends every folder and a table listed only for what changed inside it; their names keep the usual color.

Hover a row's name for its tooltip: the status, `Added`, `Deleted`, `Modified`, `Renamed`, or `Changed inside`, then one line per change, such as `Name: users → members` or `NN: ✗ → ✓`. A text is quoted by its first line, cut after 40 characters, and an empty value reads `—`. An added or removed item's tooltip is its status alone.

`Filter by name`, above the tree, keeps the rows whose current or saved name contains what you type, ignoring case. A table whose name matches keeps all its rows, and one that does not stays with only the rows that match. A filter that matches nothing leaves the tree empty.  
When the two documents do not differ at all, the tree reads `No changes`.

Drag the tree's right edge to make it wider or narrower, from `200px` to `480px`, and double-click the edge to put it back to `260px`. Every diff opens at `260px`, and the two sides share the rest of the width equally.  
The keyboard moves through the tree as through the Explorer's — see [Keys in the Explorer](./explorer.md#keys-in-the-explorer) — but here `Escape`, in the tree or in `Filter by name`, closes the view.

### Going to a Change

Click a row, or press `Enter` or `Space` with the keyboard on it, to go to its item on each side that holds it: an added item on the current side only, a removed one on the saved side only, and anything both hold on both sides. A folder row only folds or unfolds, and so does the arrow at the start of a table row.

- A table, column, or index row selects the table alone.
- A foreign key row brings its two tables into view, or the child table when the two are too far apart to show together, selects the child table with its foreign key columns, and lights the connector — see [Reading a Connector](./relationship-editing.md#reading-a-connector).
- A memo row selects the memo, and a table group row selects the group. A memo or a group that a side's document hides goes nowhere on that side.

Each side moves by the rule in [Where a Jump Lands](#where-a-jump-lands), measured on that side, so clicking the same row again moves nothing.

### Marks on the Two Sides

The two sides color text, outlines, and connectors, and fill nothing. Added is green and shows on the current side only, removed is red and shows on the saved side only, and changed, in amber, and renamed, in blue, show on both sides. Anything unchanged is drawn as usual.

- A table or table group added or removed is outlined in its color, and its name takes the color. A memo added or removed is outlined.
- A column added or removed in a table both documents hold colors its whole row, and a column that moved turns its whole row amber. Nothing inside an added or removed table is marked on its own.
- A changed cell's text turns amber: a table's comment, a column's comment, data type, default, Auto Increment, Unique, or Not Null, or a memo's text. A primary key change turns the column's key icon amber.
- A renamed table, column, or table group has its name in blue.
- A table, memo, or table group with a change that has no cell of its own, such as a move, a new size or color, or a change of group or of a group's tables, is outlined in amber.
- A foreign key added, removed, or changed draws its connector in that color. Hovering it, or a row's light, draws it in the usual hover color instead.
- An index change marks nothing on either side; it shows in the tree only.

Each side follows its own document's View Options. A change in a cell that side does not draw shows on the name instead. A column change in a cell a View Option hides, such as `Unique` or `Auto Increment`, both off by default, turns the column's name amber, and so does a primary key change on a row that shows no key icon. A table comment change while `Table Comment` is off turns the table's name amber. A rename's blue wins over this amber. A memo or table group its document hides is listed in the tree but not drawn on that side.

At `70%` and below, collapsed tables keep their outline. The name keeps the green or red of an added or removed table, or a rename's blue, and otherwise takes the amber of a comment change. Column changes are not drawn until you zoom back in; the tree still lists them.
