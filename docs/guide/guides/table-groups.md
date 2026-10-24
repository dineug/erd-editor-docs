---
sidebar_position: 6
description: Gather related tables in a named, colored box behind them; create, name, color, move, resize, and remove groups, go to them from the Explorer, change which tables they hold, hide them, and carry them through Auto Layout, Schema SQL, and DBML.
---

# Table Groups

A table group is a named, colored box drawn behind related tables on the ERD canvas, to show which tables belong together.  
A table is in one group at most. Groups are saved with the diagram, along with which group each table is in.

The box has a title bar along its top, holding a group icon, the group's name in bold, and, while the pointer is over the group, an `x` that removes it — see [Removing a Group](#removing-a-group). A group with no name reads `unnamed`, and a name too long for the bar is cut short with `…`.  
The box always holds its tables: it keeps the size it was given, but stretches to keep each table inside with `24px` of room around it and the title bar above. A table that grows stretches the box with it, and so does a table dropped near an edge with its center still inside the box. While tables are being dragged, the box neither grows nor shrinks. The stretch is not saved: the box goes back to its own size once the table no longer needs the room.

Groups are drawn behind everything else on the canvas: tables, memos, and relationship lines.  
Where groups overlap, the one pressed or added last is drawn in front, and no group's body ever covers another group's title bar. The order is not saved, so a reopened diagram stacks its groups in the order they were added.  
Groups show on the ERD canvas, in the minimap, and in an exported image, and the [Explorer](./explorer.md) lists them — see [Going to a Group](#going-to-a-group). The [Visualization](./visualization.md) tab draws no groups and no group colors in either mode.

A coding agent can create and change groups too, and read the DDL of chosen groups — see [Table Groups](../../mcp/tools.md#table-groups) in the MCP tools.

![Arming a group draw with ⌥ + G, drawing it over orders and payments, naming it Billing, dropping order_items into it, then moving and resizing the group](/img/demo-table-group.webp)

## Creating a Group

There are two ways to create a group, each with a shortcut. Neither is offered in a read-only editor or while groups are [hidden](#hiding-groups), and their shortcuts then do nothing.  
Like the other canvas shortcuts, they work on the ERD tab only and are held back while a cell, a memo, or a group's name is being edited — see [Shortcuts](./settings.md#shortcuts).

### Drawing a Group

Click the `New Table Group` button on the [canvas toolbar](./table-related-functions.md#canvas-toolbar), press `Alt + G` (Windows/Linux) or `⌥ + G` (Mac), or choose `New Table Group` from the canvas context menu, where it follows `New Table` and `New Memo`, or from [Quick Search](./quick-search.md) on the ERD tab. Then drag a box over the canvas.  
The button and the shortcut toggle the draw, so pressing either while it is armed ends it, however it was started; the context menu row and Quick Search only start it. Starting it switches off the hand tool and cancels a relationship being drawn.  
While the draw is armed, the cursor is a crosshair, and a press starts the box wherever it lands, even over a table, rather than selecting or moving what is under it. The canvas toolbar then marks its `New Table Group` button, and neither the hand nor the pointer.

Releasing adds a group in that box, never smaller than `160px` wide and `100px` tall, title bar included, however short the drag. A click without dragging adds a group `480px` wide and `320px` tall with its top-left corner at the click.  
Every table in no group whose center lies inside the new box joins the group. A table already in another group stays there.

The middle mouse button still pans the canvas and leaves the draw armed. These end the draw without adding a group:

- `Escape`, or `Alt + G` (Windows/Linux) or `⌥ + G` (Mac), before the press or during the drag. Before the press they leave the selection as it is; the press that starts the box has already cleared it.
- A right-click, which clears the selection. No context menu opens.
- Switching to the hand tool with `Space` or the canvas toolbar, clicking the toolbar's pointer or its `New Table Group` button, or starting a relationship.
- Switching to another tab, hiding the groups, or the editor turning read-only.

### Grouping Selected Tables

Select one or more tables and press `T` then `G`, or choose `Group selected tables` from a table's context menu or `Group Selected Tables` from Quick Search, which lists it while a table is selected.  
The new group is drawn round the selected tables with `24px` of room on every side and the title bar above. Every selected table joins it, leaving any group it was in, and the group it left stays, even if it is now empty. Memos in the selection are passed over.

`T` then `G` is two presses with no modifier, `G` within a second of `T`. With no table selected it does nothing, and in a text field, such as the Explorer's Find field, it types the two letters.

![Grouping categories and products with T then G, naming the group Catalog, then coloring it violet from its menu so both headers take the color](/img/demo-table-group-selected.webp)

Either way, the new group has no name and no color. It is selected on its own, and its name editor opens over the title bar so you can type a name at once — see [Naming a Group](#naming-a-group).  
The group and the tables it takes in are one undo step, and the name you type is another.

## Naming a Group

A group's name is edited in a field that opens over its title bar. It opens on its own once a group is created, on a double-click on the title bar, and from `Rename` in the group's context menu.  
`Enter`, or clicking elsewhere, saves the name. `Escape` closes the field without changing the name and leaves the group selected, and a second `Escape` clears the selection.  
A changed name is one undo step; saving the name unchanged records nothing. An empty or blank name shows as `unnamed`.  
While the field is open, the canvas shortcuts are held back, and the Quick Search and `Toggle Explorer` shortcuts do nothing, as while a table cell is edited.

[Find and Replace](./find-and-replace.md#what-it-searches) searches group names under `Table group names` while groups are shown, and its `Replace` and `Replace All` rename groups — see [Replacing](./find-and-replace.md#replacing). [Quick Search](./quick-search.md#searching-the-diagram) does not search group names.

## Coloring a Group

Choose `Color` in the group's context menu to open the color picker on the group's color.  
As with tables and memos, the picker colors every selected table, memo, and group, and `Remove color` in the menu, or the picker's `No color`, takes the color off all of them — see [Table and Memo Color Specification](./table-related-functions.md#table-and-memo-color-specification). A group's color is also offered under the picker's `Document colors`.

A colored group draws its title bar and outline in the color and its body in a pale tint of it. A group with no color uses the theme's neutral grays.  
Every table in a colored group wears the group's color across its header and keeps its own color on its left edge, so both show.  
The text and buttons on such a header turn white, or black on a light color where black reads far better, as do the name, icon, and `x` on the group's title bar. Among the picker's preset swatches, Orange, Amber, Yellow, and Lime take black, and the rest take white.  
A table keeps its own header while its group has no color, while groups are hidden, at `70%` zoom and below, where tables collapse to their name, and on the Visualization tab.

A color change is recorded in the [undo history](./undo-redo.md#one-gesture-one-step) as it is for tables and memos.

## Selecting Groups

Click a group's title bar to select the group on its own, or `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac) to add it to the selection.  
Pressing the title bar of a group that is already selected keeps the whole selection, so a drag then moves all of it.  
Pressing the title bar, or right-clicking the group, brings the group in front of the other groups and its tables in front of every other table and memo.

The body, the area under the title bar, is the canvas to the left mouse button: dragging it pans, `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) draws a selection box, and a click clears the selection. The tables, memos, and relationship lines over the body answer to the pointer as usual.

A selection box takes a group only when it encloses the group's whole box, so a box drawn inside a group picks out tables without the group — see [Multiple Selection](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac) never selects a group.

`Select tables` in the group's context menu replaces the selection with the group's tables, leaving the group itself out, so the next command reaches only the tables.  
Use it before commands that act on tables alone, such as copying or [focusing on tables](./table-related-functions.md#focusing-on-tables), which pass over a selected group.

A selected group's outline turns the selection color. In a [collaborative session](../../api/advanced/collaborative-editing.md), a group another participant selects is ringed in that participant's color.

## Going to a Group

The [Explorer](./explorer.md#the-tree) lists the groups in its `Table Groups` folder, by name, each with its tables under it. Quick Search lists no groups.

Choosing a group row in the Explorer, a [Find and Replace](./find-and-replace.md#going-to-a-match) match in a group's name, or a group row in the [Diff Viewer](./table-related-functions.md#the-change-tree)'s list goes to that group.  
It brings the group's box into view, going by its title bar when the box is taller than the canvas — see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands). It then selects the group alone and brings it to the front with its tables, as pressing its title bar does.  
While groups are [hidden](#hiding-groups), or once the group has been removed, going to it does nothing.  
In the Diff Viewer each side goes to the group only where its own document holds and shows it — see [Going to a Change](./table-related-functions.md#going-to-a-change).

## Moving and Resizing a Group

Drag a group by its title bar to move it with all of its tables.  
If the group is part of a larger selection, the whole selection moves with it, and a table that is both selected and in the group moves once.  
The drag starts only once the pointer has moved a short way, so a click or double-click on the title bar stays a click. `Alt + drag` on a title bar moves the group as a plain drag does; a group is never duplicated.  
The move, with every table it carries, is one undo step.

Dragging a table on its own moves only that table, and can move it into or out of a group — see [Adding and Removing Tables](#adding-and-removing-tables).

Every group has resize handles on its four edges and four corners, selected or not, as a memo does.  
Drag one with the left mouse button: the box follows the pointer, and the new size is saved when you let go, as one undo step.  
A group cannot be made smaller than `160px` by `100px`, nor smaller than its tables with their `24px` of room and the title bar. The edge stops there however far the pointer goes.

## Adding and Removing Tables

A table joins or leaves a group where you drop it.  
When you drag tables and let go, each dragged table that is not carried by a selected group is judged by its center. It joins the topmost group whose box holds its center, or leaves its group if its center lies in no group's box. The topmost group is the one drawn in front.  
A group the drag leaves in place keeps the box it had when the drag began, so a table nudged within its own group stays in it, and has to be dragged until its center is outside that box to leave.  
While you drag, each group the drop would put a table in is outlined.

When you let go within about `200ms` of the last movement, the change of group is part of the drag's undo step, so one undo puts the tables back where they were and in the groups they were in. After a longer pause before letting go, the change of group is a step of its own — see [One Gesture, One Step](./undo-redo.md#one-gesture-one-step).  
A click, or a drag of a few pixels, changes no group, and nothing changes group while groups are hidden.

The other ways to change which tables a group holds:

- `Remove from group` in a table's context menu takes every selected table out of its group. It shows while a selected table is in a group, even while groups are hidden, and is one undo step.
- `Group selected tables` moves the selected tables into a new group — see [Grouping Selected Tables](#grouping-selected-tables).
- Removing a group leaves its tables in no group.

A table pasted or duplicated with `Alt` is in no group, even when it lands inside a group's box. Dragging it afterwards applies the drop rule.

## Removing a Group

Removing a group never removes its tables: they stay where they are, in no group.

- The `x` at the end of the title bar, which shows while the pointer is over the group, removes that group alone.
- `Delete` in the group's context menu removes the group. When the group is one of several selected items, the row reads `Delete selected` and removes everything selected: tables, memos, and groups.
- With groups selected, `Delete` or `Backspace` removes the selected groups along with any selected tables and memos, as do `Ctrl + Backspace` and `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` and `⌘ + Delete` (Mac) — see [Table and Memo Deletion](./table-related-functions.md#table-and-memo-deletion).

Each removal is one undo step, which brings the group back with its tables in it.

## The Group Menu

Right-click a group's title bar, body, or edge to open its menu. On a Mac, `Ctrl + click` opens it too, and so does a long press on a touch screen.  
The right-click selects the group first, alone unless it is already part of the selection, so `Color` and `Delete selected` reach the rest of the selection only when the group was in it.

- `Select tables`: selects the group's tables alone — see [Selecting Groups](#selecting-groups).
- `Rename`: opens the name editor — see [Naming a Group](#naming-a-group).
- `Color`: opens the color picker — see [Coloring a Group](#coloring-a-group).
- `Remove color`: shown while something selected has a color.
- `Delete`, or `Delete selected` when the group is one of several selected items, with the `Delete` key shown on the right — see [Removing a Group](#removing-a-group).

A table's context menu adds `Group selected tables` and `Remove from group` after `Color` and `Remove color`, before its Delete row, and the canvas context menu adds `New Table Group`.  
`Group selected tables` shows its keys, `T` then `G`, on the right, and `New Table Group` shows `Alt + G` (Windows/Linux) or `⌥ + G` (Mac).

## Hiding Groups

`View Option` → `Table Groups` in the canvas context menu shows or hides every group. It is checked by default — see [Table View Options](./table-related-functions.md#table-view-options).  
Unchecked, the group boxes and the group colors on table headers disappear from the canvas, the minimap, and exported images, and the scrollbars and minimap no longer make room for the groups. Nothing moves or resizes, and every table stays in its group.  
Hiding the groups deselects them, ends a `New Table Group` draw, and closes an open name editor.

While groups are hidden:

- `New Table Group` and `Group selected tables` are not offered in the menus, nor `New Table Group` and `Group Selected Tables` in Quick Search, and the canvas toolbar leaves out its `New Table Group` button. `Remove from group` is still offered.
- `Alt + G` (Windows/Linux) or `⌥ + G` (Mac) and `T` then `G` do nothing.
- Dragging tables changes no group, and a selection box takes no group.
- The Explorer leaves out its `Table Groups` folder, and Find and Replace neither finds nor replaces group names, even with `Table group names` on.
- [Auto Layout](#auto-layout) still keeps each group's tables together, the Schema SQL tab still offers the [groups to choose from](#schema-sql-by-group), DBML still writes them, and [Import and Add](./file-import-export.md#import-and-add) still lands below the hidden boxes.

The choice is saved in the document and recorded in the [undo history](./undo-redo.md#what-the-history-records), like the other View Option toggles.

## Auto Layout

Every [Auto Layout](./table-related-functions.md#auto-layout) keeps each group's tables together, whether or not groups are shown.

- `Force` moves each group with its tables as one box, the tables keeping their places inside it, and keeps each group's box at least `100px` from other groups and from tables in no group. The preview shows each group where it is going.
- `Flow`, `Tree - vertical`, and `Tree - horizontal` lay out each group's tables inside the group and place the groups by the relationships between them, with the tables in no group laid out around them.

Afterwards each group that holds tables is fitted to them: its box becomes their bounds with `24px` of room and the title bar. A group with no tables keeps its place and size.  
The tables and groups land as one undo step.

A DBML import fits each group round its tables in the same way, wherever they are placed — see [DBML](./file-import-export.md#dbml).

## Schema SQL by Group

The [Schema SQL](./schema-sql.md) tab can write the tables of chosen groups alone.  
While the document holds a group, shown or hidden, its options panel shows a `Tables` row under `This window only`, with a box for `All`, one for each group, and one for `No group`, the tables in no group — see [Tables](./schema-sql.md#tables).  
The choice belongs to the editor window and is not saved in the document.

## Import, Export, and Copying

- DBML carries groups both ways. A DBML import turns each `TableGroup` block into a group — see [DBML](./file-import-export.md#dbml) — and the Code Generator's `DBML` writes a `TableGroup` block for each group that holds a table — see [Code Generator](./code-generator.md#language).
- A JSON file keeps its groups. No other format carries them: SQL, GraphQL, and AML imports bring none, and Schema SQL and the other Code Generator targets write none.
- [Import and Add](./file-import-export.md#import-and-add) brings a file's groups in as new groups holding their tables, and selects them with the new tables while groups are shown, so dragging the added block carries its groups along.
- An [exported image](./file-import-export.md#image) draws the shown groups behind the tables, with the group colors on their headers.
- Copying and pasting, or duplicating with `Alt`, never copies a group — see [Copying/Pasting Tables and Memos](./table-related-functions.md#copyingpasting-tables-and-memos) and [Adding and Removing Tables](#adding-and-removing-tables).

## Read-only Editors

In a [`readonly`](../../api/erd-editor-element.md#readonly) editor, groups are drawn and listed in the Explorer as usual and can be selected and gone to, but not changed:

- A press on a title bar selects the group and moves nothing. There are no resize handles and no `x`.
- A double-click on the title bar opens no name editor, and the group menu holds `Select tables` alone.
- The canvas menu has no `New Table Group`, the table menu has no `Group selected tables` or `Remove from group`, and Quick Search lists neither group command. A `New Table Group` draw ends when the editor turns read-only.
- The [canvas toolbar](./table-related-functions.md#canvas-toolbar) shows none of its add buttons, `New Table Group` included, and `Alt + G` (Windows/Linux) or `⌥ + G` (Mac) and `T` then `G` do nothing.
- The `Table Groups` view option changes nothing, as with every View Option.
- The Schema SQL tab's `Tables` choice still works.
