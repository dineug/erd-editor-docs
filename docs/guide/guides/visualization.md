---
sidebar_position: 11
description: Explore the schema as a force-directed Graph or as a Flow of table cards — zoom and pan, light up a table's related tables, focus on a few tables at a time, and step back through earlier focuses.
---

# Visualization

Shows the whole document at a glance, in one of two modes:

- `Graph`, a force-directed graph of every table, its columns, and the relationships between them — see [Graph Mode](#graph-mode).
- `Flow`, every table drawn as a card and laid out along its relationships — see [Flow Mode](#flow-mode).

Open it from the `Visualization` tab in the toolbar at the top, or from [Quick Search](./quick-search.md) under `Tab`.  
From the ERD tab, `Alt + F` (Windows/Linux) or `⌥ + F` (Mac) and the table context menu entry `Focus on this table` open it straight in `Flow`, narrowed to the tables you picked and the tables one relationship away — see [Focusing on Tables](#focusing-on-tables).

Switch modes with the `Graph` and `Flow` buttons at the left end of the [toolbar](#toolbar).  
A newly opened editor starts on `Graph`. The mode you pick stays while the editor is open, across visits to other tabs, but it is not saved in the document.

## Toolbar

A toolbar floats over the middle of the bottom edge of the tab. From left to right:

- `Graph` and `Flow`, with the current mode highlighted.
- `Previous table` and `Next table`, in `Flow` only: a left arrow and a right arrow that step back and forward through the tables Flow has been narrowed to — see [Previous Table and Next Table](#previous-table-and-next-table). Each is dimmed while there is nothing to step to that way.
- `Zoom out`, the current zoom as a percentage such as `100%`, and `Zoom in`. Each press moves the zoom 4 percentage points, keeping the middle of the screen where it is. The percentage shows the zoom of the mode you are in, and clicking it puts that zoom back to `100%`.
- `Fit`, which brings everything the mode shows into view: every node in `Graph`, every card in `Flow`.
- `Tidy Up`, in `Flow` only, which lays the cards out again — see [How Flow Is Placed](#how-flow-is-placed).
- The row display menu, in `Flow` only, labelled with the current choice — see [Row Display](#row-display).
- The `Name View` list, in `Flow` only, labelled with the view in force — see [Names on the Cards](#names-on-the-cards).
- `Show all`, in `Flow` only and only while the view is narrowed, which goes back to the whole diagram — see [Focusing on Tables](#focusing-on-tables).
- The `Go to content` compass, which joins the end of the toolbar only while no node or card is on screen. It shows an arrow pointing at the nearest node or card and how far away it is, such as `1.2k`. Click it to center that node or card without changing the zoom.

The zoom buttons and the two arrows name their shortcuts in their tooltips, for example `Zoom in (Ctrl + Plus)` (Windows/Linux) or `Zoom in (⌘ + Plus)` (Mac), and `Previous table (Ctrl + Z)` (Windows/Linux) or `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` and `Ctrl + Minus` (Windows/Linux) or `⌘ + Plus` and `⌘ + Minus` (Mac) step the zoom like the buttons, in either mode, and `Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac) goes straight back to `100%`. In `Flow`, `Ctrl + Z` and `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Z` and `⌘ + Shift + Z` (Mac) step like the two arrows.  
Clicking the percentage does the same as `Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac), and names it in its tooltip. The shortcuts do nothing while quick search is open.

## Graph Mode

Draws the whole document as a force-directed graph, so you can see at a glance how tables relate to one another and which ones sit at the center of a domain.

![Opening Graph mode, hovering a table for its preview, dragging a node, and zooming out and back in](/img/demo-visualization.webp)

### Reading the Graph

Every table and every column is a node, and the two kinds are drawn in different colors. Memos and [table groups](./table-groups.md) are not drawn.  
Each column node is linked to the table it belongs to, and two tables joined by a relationship are linked to each other.  
Tables joined by more than one relationship in the same direction are linked only once, and a relationship that starts and ends on the same table draws no link.

Table names appear on the graph as you zoom in, fading in between `50%` and `100%`, and a name longer than 15 characters is cut. Column nodes carry no label at any zoom.  
The labels follow the Name View — see [Beyond the Canvas](./logical-names.md#beyond-the-canvas). In `Both Names`, a label puts the logical name on one line and the name on the line under it, and each line is cut on its own.

### Getting Around the Graph

The wheel zooms, about whatever the pointer is over, from `10%` to `400%`.  
A trackpad pinch zooms the same way, and two fingers on a touch screen zoom about the point between them and pan as they move.  
Drag the background to pan, or drag with the middle mouse button from anywhere, a node included, as on the [ERD canvas](./table-related-functions.md#getting-around-the-canvas). A middle-button drag only pans: it never pulls a node.

The zoom buttons on the [toolbar](#toolbar) and the zoom shortcuts hold the middle of the screen still instead, within the same range, and `Fit` brings every node into view.

### Hover Preview

Hover a table node to preview that table, next to the cursor.  
Hovering a column node only draws a ring around it; no preview opens.

The preview shows the same columns and cells as the ERD canvas, in the same order, and names them as the canvas does in the Name View you are in — see [Table View Options](./table-related-functions.md#table-view-options), [Adjusting Column Order](./settings.md#adjusting-column-order), and [Name View](./logical-names.md#name-view).  
With the `Alternate Key` view option on, each column of an [alternate key](./table-related-functions.md#alternate-keys) carries its mark, such as `AK1.1`, last in its row, and the preview widens for it as the table on the ERD canvas does.  
Unlike a table on the ERD canvas, its header never takes the color of the table's [group](./table-groups.md#coloring-a-group), and its names never wear the [marks](./dictionary.md#marks-on-the-canvas) the dictionary's checks put on the canvas.  
It is display-only, and it is hidden while you drag a node or pan.

### Highlighting a Neighbourhood

Hovering a table also lights up its neighbourhood: the table itself, its own columns, the tables its relationships join in either direction, and the links between them.  
Everything else on the graph fades, so what the table touches reads on its own.

### Moving Nodes

Drag a node with the left mouse button to pull it, and everything linked to it, into a new position.  
The node is pinned under the pointer for as long as you hold it and the layout reheats around it.  
It settles again when you let go — nothing stays pinned where you dropped it.  
A right press or right drag on a node neither pulls it nor pans.

### The Graph Is a Snapshot

The graph is built from the document as it stands the moment you open this tab, and it is rebuilt from scratch every time you come back to it.  
Switching to `Graph` from `Flow` rebuilds it as well, and every rebuild starts again at `100%`.

## Flow Mode

Draws every table as a card and lays the cards out along their relationships. Memos and [table groups](./table-groups.md) are not drawn.  
It is not the `Flow` layout of [Auto Layout](./table-related-functions.md#auto-layout), which moves the tables on the ERD tab itself.

Each card is drawn like a table on the ERD tab: the table's color down its left edge, a header band with a table icon and the table's names as the [Name View](#names-on-the-cards) shows them, then the rows its [row display](#row-display) calls for. Unlike a table on the ERD tab, a card also draws a line between its rows, and its header never takes the color of the table's [group](./table-groups.md#coloring-a-group). Cards keep that look at every zoom, and never collapse to their name the way tables on the ERD tab do at `70%` and below. Nothing on a card can be edited.

A connector is one smooth curve from table to table, drawn beneath the cards, so it can pass behind one. A relationship from a table to itself curves round the card's top-right corner, as on the ERD tab — see [Connector Routing](./relationship-editing.md#connector-routing). Every connector is drawn as the same solid gray line, whether the relationship is identifying or not, with the same end marks as on the ERD tab — see [Reading a Connector](./relationship-editing.md#reading-a-connector). Flow draws connectors even when the `Relationship` [view option](./table-related-functions.md#table-view-options) is off. It never draws the `D:` and `U:` labels of a relationship's ON DELETE and ON UPDATE actions or shows the tooltip that spells them out, whatever the `Referential Actions` view option says.

Over the whole diagram, tables that no relationship joins to another table are gathered into one block rather than scattered among the rest.

![Switching to Flow, hovering orders to light it and its neighbours, pinning the light, picking Keys only, then zooming in with ⌘ + Wheel and pressing Fit](/img/demo-visualization-flow.webp)

### Row Display

The row display menu on the [toolbar](#toolbar) sets how much of each card is drawn. Its label is the current choice, and its tooltip reads, for example, `Row display: Name only`.  
The menu opens above the toolbar with a check beside the current choice. It closes when you pick one, click the label again, click anywhere else in the editor, press `Escape`, or switch to `Graph`.

| Row display | What each card shows |
| --- | --- |
| `Name only` | The header alone. |
| `Keys only` | Primary key and foreign key columns, plus any other column a relationship ends on. |
| `All fields` | Every column. |

Rows are listed in the order of the table's columns. Each row shows the column name, with a key icon before it when the column is a primary key, a foreign key, or both, and the data type on the right, whether the card is [lit](#lighting-related-tables) or not. The [Name View](#names-on-the-cards) decides which names a row shows and whether it shows the column's domain.  
No other cell or alternate key mark is drawn, and neither [Table View Options](./table-related-functions.md#table-view-options) nor [Adjusting Column Order](./settings.md#adjusting-column-order), which orders the cells within a row, applies to cards.

When Flow first opens, it starts on `Name only`, or on `Keys only` if [focusing on tables](#focusing-on-tables) is what opened it. After that, the row display changes only when you pick another, and narrowing or widening the view keeps it.  
Changing the row display resizes the cards, so Flow lays them out again and fits them to the screen.

### Names on the Cards

A card names its table and columns in the Name View, the same one the ERD tab draws in — see [Name View](./logical-names.md#name-view).  
Switch it here with the `Name View` list on the [toolbar](#toolbar). Its button reads the view in force, `Physical Names`, `Logical Names`, or `Both Names`, and its tooltip reads `Name View`. The list opens above the toolbar with a check beside the view in force, and closes as the [row display](#row-display) menu does. A pick switches the whole editor, the ERD tab included, as a switch made anywhere else does — see [Switching the View](./logical-names.md#switching-the-view).

Cards lay out their cells by the Name View alone. No [view option](./table-related-functions.md#table-view-options) changes them, `Domain` included:

| Name View | Header | Each row |
| --- | --- | --- |
| `Physical Names` | The table name. | The column name, then the data type. |
| `Logical Names` | The table's logical name. | The column's logical name, then the name of its [domain](./dictionary.md#domains-and-data-types), or its data type while it has none. |
| `Both Names` | The logical name, then the table name, muted. | The logical name, the name, the domain, and the data type. |

While a logical name is blank, `Logical Names` shows the name in its place, dimmed, or the `table` or `column` placeholder when the name is blank too, and `Both Names` shows the dimmed placeholder `logical`. In `Both Names`, a column with no domain shows the dimmed placeholder `domain`.  
A card never wears the [marks](./dictionary.md#marks-on-the-canvas) the dictionary's checks put on names on the ERD tab.  
Switching the Name View resizes the cards, so Flow lays them out again — see [How Flow Is Placed](#how-flow-is-placed).

### Getting Around the Flow

The wheel pans, and `Shift + Wheel` pans sideways. `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac) zooms, keeping the middle of the screen where it is.  
A trackpad pinch zooms about the point you pinch at, and two fingers on a touch screen zoom about the point between them and pan as they move.  
Drag the background to pan, or drag with the middle mouse button from anywhere, a card included. A middle-button drag only pans and leaves the selection as it is. Panning has no bounds, as on the [ERD canvas](./table-related-functions.md#getting-around-the-canvas).  
Zoom ranges from `10%` to `150%`. Flow keeps a zoom and pan of its own, apart from the ERD tab's, and neither is saved in the document.

Pressing the background clears the selection, and `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) on the background draws a selection box.  
Flow has no minimap and no scrollbars. When a pan leaves no card on screen, use the `Go to content` compass on the [toolbar](#toolbar).

### Lighting Related Tables

Hover a card to light it, the tables one relationship away from it, and the connectors that join it to those tables. A connector between two of those tables stays unlit.  
A lit card gets an accent-colored border and glow, and its rows that a relationship ends on are tinted. A lit connector turns the accent color.  
Nothing else fades, unlike in [Graph](#highlighting-a-neighbourhood), and nothing is lit while no card is hovered or pinned.

Click a card to pin its light, so it stays lit when the pointer moves on. Click the same card again, or click the background, to let it go; clicking another card moves the pin there. The hovered card and the pinned card light up together.  
Dragging, `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac), panning, and the [card buttons](#card-buttons) neither pin nor release a card.

Particles run along every lit connector, from the parent table's end, where the primary key is, to the child table's end. When more than 60 connectors are lit at once, the particles stop and the light stays.

### Card Buttons

While the pointer is over a card, two icon buttons, neither with a tooltip, appear at the right end of its header:

- The waypoints icon, the same one the `Flow` button shows, narrows Flow to that table and the tables one relationship away — see [Focusing on Tables](#focusing-on-tables). What Flow showed before stays one `Previous table` away — see [Previous Table and Next Table](#previous-table-and-next-table).
- The external-link icon switches to the ERD tab, selects only that table, brings it to the front, and puts the focused cell on its name, or on its logical name in `Logical Names` and `Both Names`, unless a cell of that table already has it. The canvas scrolls to the table only if it does not already show well — see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands). It never starts or finishes a relationship being drawn.

A press on either button belongs to the button alone: unlike a press elsewhere on the card, it does not select the card or bring it to the front. The waypoints button therefore leaves the selection you had; the external-link button selects the table only as part of its switch to the ERD tab. Only a left click works either button.

### Moving Cards

Drag a card with the left mouse button by any part of it except the two card buttons; a right drag moves nothing.  
Pressing a card selects it, `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac) adds it to the selection, and dragging a selected card moves every selected card. The selection is the one the ERD tab uses, so what you select here is still selected when you go back.

A card moves only in Flow: its table stays where it is on the ERD tab.  
A moved card stays put through panning, zooming, and `Fit`. It goes back to where the layout placed it when you leave the tab or switch to `Graph` and come back, and when `Show all` or a [step](#previous-table-and-next-table) returns to a layout Flow already has. A new layout places it again, taking into account where you left it — see [How Flow Is Placed](#how-flow-is-placed).

### Focusing on Tables

On the ERD tab, select one or more tables and press `Alt + F` (Windows/Linux) or `⌥ + F` (Mac), or right-click a table and choose `Focus on this table`.  
The Visualization tab opens in `Flow`, narrowed to those tables and every table one relationship away from any of them, in either direction. Only the connectors between the tables it shows are drawn.

When the table you right-click is one of several selected tables, the entry reads `Focus on selected tables` and focuses the whole selection. Right-clicking a table outside the selection focuses that table alone.  
`Alt + F` takes the selected tables and leaves memos and [table groups](./table-groups.md) out. With no table selected it does nothing, even with a group selected: choose `Select tables` in the group's context menu first — see [Selecting Groups](./table-groups.md#selecting-groups).  
It is ignored while a cell, a memo, or a group's name is being edited, while the keyboard is in the [Explorer](./explorer.md#keys-in-the-explorer), or while quick search, table properties, the diff viewer, the Auto Layout preview, time travel, the [`Export image`](./file-import-export.md#image) dialog, or [`Map Columns`](./relationship-editing.md#map-columns) is open.

Inside Flow, the waypoints [card button](#card-buttons) narrows the view the same way, to that one table. `Show all` on the [toolbar](#toolbar) goes back to the whole diagram. `Previous table` and `Next table` on the toolbar, or their keys, step back and forward through what Flow has been narrowed to — see [Previous Table and Next Table](#previous-table-and-next-table).  
A narrowed view is laid out on its own and fitted to the screen. It stays narrowed when you leave the tab or switch to `Graph` and come back, and `Escape` does not widen it.

![Focusing on orders with ⌥ + F, narrowing to members with its card's waypoints button, then Show all](/img/demo-visualization-focus.webp)

### Previous Table and Next Table

Flow remembers what it has been narrowed to, like a browser's history. Each time the view moves to other tables — by [focusing on tables](#focusing-on-tables) from the ERD tab, with the waypoints [card button](#card-buttons), or with `Show all` — what it showed before is kept as a step back, whether that was a few tables or the whole diagram.

![Narrowing Flow to orders with ⌥ + F and then to members, stepping back with Previous table, forward with ⌘ + Shift + Z and back with ⌘ + Z, then Show all](/img/demo-visualization-steps.webp)

- `Previous table` on the [toolbar](#toolbar) goes back a step, and `Next table` goes forward again to what `Previous table` left.
- In `Flow`, `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac) steps back like `Previous table`, and `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac) steps forward like `Next table`. There they never undo or redo an edit of the diagram. In `Graph`, and while quick search is open, they do nothing.
- Narrowing the view or pressing `Show all` after stepping back drops the steps forward. Focusing again on exactly the tables Flow is already narrowed to adds no step and drops none.
- The latest 100 steps back are kept, and the oldest goes first.

A step shows those of its tables that are still in the diagram, with every table one relationship away, as focusing does. A step whose tables have all been removed is skipped and dropped, and so is one that would leave Flow where it stands: on the very tables it is narrowed to now, or over the whole diagram while Flow already shows it.  
A button is dimmed, and does nothing, while there is no step left that way. Both are dimmed when Flow first opens, whether over the whole diagram or on the tables a focus opened it with. Once Flow has opened, a later focus from the ERD tab keeps what Flow showed when you left it as a step back.  
A step is laid out and fitted to the screen as a focus is — see [How Flow Is Placed](#how-flow-is-placed) — and the row display stays as it is.

The steps are Flow's own. They are kept while the editor is open, across visits to other tabs and to `Graph`, but they are not saved in the document or sent to collaborators, and they add nothing to the undo history. Replacing the whole document discards them with the rest of Flow.

In a right-to-left display language the toolbar keeps its order and the two arrows swap what they do, so `Previous table` is the right-pointing arrow. The keys stay the same — see [Right-to-left Languages](./language-and-theme.md#right-to-left-languages).

### How Flow Is Placed

The first time `Flow` is shown, the tables it shows are laid out off the main thread and the result is fitted to the screen.  
The layout is kept while the editor is open. Leave the tab or switch to `Graph` and come back, and Flow reuses it, with the zoom and pan where you left them.  
Flow keeps one layout for the whole diagram and one for the tables it was last narrowed to, so `Show all` goes back to the whole-diagram layout and fits it to the screen without working it out again, as long as nothing that layout was made from has changed. A [step](#previous-table-and-next-table) to the whole diagram, or to the tables Flow was last narrowed to, reuses that layout in the same way.

Flow lays the cards out again when:

- You press `Tidy Up`. The result is fitted to the screen.
- You change the row display, narrow the view to other tables, or step to other tables with `Previous table` or `Next table`. The result is fitted to the screen.
- You pick another view in the `Name View` list. The result is fitted to the screen.
- Tables or relationships are added or removed, or the Name View is switched — while you are away from Flow, picked up when you come back, or by a collaborator while you are in Flow. The zoom and pan stay where they are.

Each layout takes into account where the cards currently stand, so `Tidy Up` does not necessarily restore an earlier arrangement.  
A change that only resizes a card, such as renaming a table, writing a logical name, or adding a column, does not lay the cards out again. Press `Tidy Up` if cards end up overlapping.

A layout that takes longer than 6 seconds shows a `Placing tables` notice, with a spinning loader and `Cancel`.  
`Cancel`, or `Escape` at any point while the layout runs, drops it; `Tidy Up`, or coming back to `Flow`, asks for it again.  
If a layout fails — the host runs no shared worker, the worker fails to start, or no layout comes back within 60 seconds — Flow shows a `Could not place tables` notice with a warning sign, and `Tidy Up` tries again. See [Web Workers](../../api/installation.md#web-workers).  
Flow draws only the tables its last layout placed, over the whole diagram and in a narrowed view alike, so the first time it is shown there may be no cards at all until a layout succeeds.  
Whenever Flow lays the cards out again, such as when you narrow the view to other tables, the previous arrangement stays on screen until the new layout lands, and it stays there if that layout is cancelled or fails.

When the whole document is replaced, for example by importing a file, Flow's layouts, focus, `Previous table` and `Next table` steps, row display, zoom, and pan are discarded, and the next time you open Flow it starts over as it did the first time: over the whole diagram, or narrowed if you open it by [focusing on tables](#focusing-on-tables).

### Flow Never Edits the Document

Flow only reads the diagram. Zooming, panning, moving cards, `Tidy Up`, the row display, pins, focusing, and stepping with `Previous table` and `Next table` add nothing to the [undo history](./undo-redo.md#what-the-history-records).  
They change nothing in the diagram either. Pressing a card does bring its table to the front, just as clicking a table on the ERD tab does, so it is in front there too, but the stacking order is not saved — see [Moving Multiple Tables](./table-related-functions.md#moving-multiple-tables). `Graph` leaves the diagram alone in the same way.  
The `Name View` list is an exception, and only while the `Name View` [lock](./settings.md#lock) is off: a pick then switches the diagram's Name View, which is saved and which collaborators switch with. While the lock is on, as it is by default, a pick changes only your own screen. Either way it adds nothing to the undo history.  
Pressing a card never adds a relationship. If you left the ERD tab while drawing one, a press on a card picks its table to start from when none has been picked yet, and otherwise ends the draw.  
The external-link [card button](#card-buttons) goes further, because it takes you out of Flow: when the ERD tab has to scroll to the table, that scroll is recorded like any other change of view position.

Collaborators' edits still reach the diagram while you are in Flow, and cards follow the tables and relationships they add or remove — see [How Flow Is Placed](#how-flow-is-placed).  
Their selection and focus rings are drawn on the cards, but their cursors and drag boxes are not — see [Collaborative Editing](../../api/advanced/collaborative-editing.md).

Both modes, focusing and stepping included, work in a `readonly` editor too, and so does the `Name View` list, which there switches only your own screen.
