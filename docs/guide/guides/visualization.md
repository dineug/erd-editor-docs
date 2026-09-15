---
sidebar_position: 7
description: Explore the schema as a force-directed Graph or as a Flow of table cards — zoom and pan, light up a table's related tables, and focus on a few tables at a time.
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
- `Zoom out`, the current zoom as a percentage such as `100%`, and `Zoom in`. Each press moves the zoom 4 percentage points, keeping the middle of the screen where it is. The percentage is read-only and shows the zoom of the mode you are in.
- `Fit`, which brings everything the mode shows into view: every node in `Graph`, every card in `Flow`.
- `Tidy Up`, in `Flow` only, which lays the cards out again — see [How Flow Is Placed](#how-flow-is-placed).
- The row display menu, in `Flow` only, labelled with the current choice — see [Row Display](#row-display).
- `Show all`, in `Flow` only and only while the view is narrowed, which goes back to the whole diagram — see [Focusing on Tables](#focusing-on-tables).
- The `Go to content` compass, which joins the end of the toolbar only while no node or card is on screen. It shows an arrow pointing at the nearest node or card and how far away it is, such as `1.2k`. Click it to centre that node or card without changing the zoom.

The zoom buttons name their shortcuts in their tooltips, for example `Zoom in (Ctrl + Plus)` (Windows/Linux) or `Zoom in (⌘ + Plus)` (Mac).  
`Ctrl + Plus` and `Ctrl + Minus` (Windows/Linux) or `⌘ + Plus` and `⌘ + Minus` (Mac) step the zoom like the buttons, in either mode, and `Ctrl + 0` (Windows/Linux) or `⌘ + 0` (Mac) goes straight back to `100%`.  
There is no reset button, and the shortcuts do nothing while quick search is open.

## Graph Mode

Draws the whole document as a force-directed graph, so you can see at a glance how tables relate to one another and which ones sit at the center of a domain.

![Opening Graph mode, hovering a table for its preview, dragging a node, and zooming out and back in](/img/demo-visualization.webp)

### Reading the Graph

Every table and every column is a node, and the two kinds are drawn in different colors.  
Each column node is linked to the table it belongs to, and two tables joined by a relationship are linked to each other.  
Tables joined by more than one relationship in the same direction are linked only once, and a relationship that starts and ends on the same table draws no link.

Table names appear on the graph as you zoom in, fading in between `50%` and `100%`, and a name longer than 15 characters is cut. Column nodes carry no label at any zoom.

### Getting Around the Graph

The wheel zooms, about whatever the pointer is over, from `10%` to `400%`.  
Drag the background to pan.

The zoom buttons on the [toolbar](#toolbar) and the zoom shortcuts hold the middle of the screen still instead, within the same range, and `Fit` brings every node into view.

### Hover Preview

Hover a table node to preview that table, next to the cursor.  
Hovering a column node only draws a ring around it; no preview opens.

The preview shows the same columns as the ERD canvas, in the same order — see [Table View Options](./table-related-functions.md#table-view-options) and [Adjusting Column Order](./settings.md#adjusting-column-order).  
It is display-only, and it is hidden while you drag a node or the background.

### Highlighting a Neighbourhood

Hovering a table also lights up its neighbourhood: the table itself, its own columns, the tables its relationships join in either direction, and the links between them.  
Everything else on the graph fades, so what the table touches reads on its own.

### Moving Nodes

Drag a node to pull it, and everything linked to it, into a new position.  
The node is pinned under the pointer for as long as you hold it and the layout reheats around it.  
It settles again when you let go — nothing stays pinned where you dropped it.

### The Graph Is a Snapshot

The graph is built from the document as it stands the moment you open this tab, and it is rebuilt from scratch every time you come back to it.  
Switching to `Graph` from `Flow` rebuilds it as well, and every rebuild starts again at `100%`.

## Flow Mode

Draws every table as a card and lays the cards out along their relationships. Memos are not drawn.  
It is not the `Flow` layout of [Auto Layout](./table-related-functions.md#auto-layout), which moves the tables on the ERD tab itself.

Each card has the table's color along its top edge, then a header with a table icon and the table name, then the rows its [row display](#row-display) calls for. Cards keep that look at every zoom, and never collapse to a color bar the way tables on the ERD tab do at `70%` and below. Nothing on a card can be edited.

A connector is one smooth curve from table to table, drawn beneath the cards, so it can pass behind one. Every connector is drawn as the same solid gray line, whether the relationship is identifying or not, with the same end marks as on the ERD tab — see [Reading a Connector](./relationship-editing.md#reading-a-connector). Flow draws connectors even when the `Relationship` [view option](./table-related-functions.md#table-view-options) is off.

Over the whole diagram, tables that no relationship joins to another table are gathered into one block rather than scattered among the rest.

![Switching to Flow, pinning a lit card, picking Keys only, then zooming in and pressing Fit](/img/demo-visualization-flow.webp)

### Row Display

The row display menu on the [toolbar](#toolbar) sets how much of each card is drawn. Its label is the current choice, and its tooltip reads, for example, `Row display: Name only`.  
The menu opens above the toolbar with a check beside the current choice. It closes when you pick one, click the label again, click anywhere else in the editor, press `Escape`, or switch to `Graph`.

| Row display | What each card shows |
| --- | --- |
| `Name only` | The header alone. |
| `Keys only` | Primary key and foreign key columns, plus any other column a relationship ends on. |
| `All fields` | Every column. |

Rows are listed in the order of the table's columns. Each row shows the column name, with a key icon before it when the column is a primary key, a foreign key, or both, and the data type on the right, which appears only while the card is [lit](#lighting-related-tables).  
No other cell is drawn, and neither [Table View Options](./table-related-functions.md#table-view-options) nor [Adjusting Column Order](./settings.md#adjusting-column-order), which orders the cells within a row, applies to cards.

When Flow first opens, it starts on `Name only`, or on `Keys only` if [focusing on tables](#focusing-on-tables) is what opened it. After that, the row display changes only when you pick another, and narrowing or widening the view keeps it.  
Changing the row display resizes the cards, so Flow lays them out again and fits them to the screen.

### Getting Around the Flow

The wheel pans, and `Shift + Wheel` pans sideways. `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac) zooms, keeping the middle of the screen where it is.  
Drag the background to pan. Panning has no bounds, as on the ERD canvas.  
Zoom ranges from `10%` to `150%`. Flow keeps a zoom and pan of its own, apart from the ERD tab's, and neither is saved in the document.

Pressing the background clears the selection, and `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac) on the background draws a selection box.  
Flow has no minimap and no scrollbars. When a pan leaves no card on screen, use the `Go to content` compass on the [toolbar](#toolbar).

### Lighting Related Tables

Hover a card to light it, the tables one relationship away from it, and the connectors that join it to those tables. A connector between two of those tables stays unlit.  
A lit card gets an accent-colored border and glow, its data types fade in, and its rows that a relationship ends on are tinted. A lit connector turns the accent color.  
Nothing else fades, unlike in [Graph](#highlighting-a-neighbourhood), and nothing is lit while no card is hovered or pinned.

Click a card to pin its light, so it stays lit when the pointer moves on. Click the same card again, or click the background, to let it go; clicking another card moves the pin there. The hovered card and the pinned card light up together.  
Dragging, `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac), panning, and the [card buttons](#card-buttons) neither pin nor release a card.

Particles run along every lit connector, from the parent table's end, where the primary key is, to the child table's end. When more than 60 connectors are lit at once, the particles stop and the light stays.

### Card Buttons

While the pointer is over a card, two icon buttons, neither with a tooltip, appear at the right end of its header:

- The waypoints icon, the same one the `Flow` button shows, narrows Flow to that table and the tables one relationship away — see [Focusing on Tables](#focusing-on-tables).
- The external-link icon switches to the ERD tab and selects only that table, scrolling it to the middle of the screen if it is not already fully in view.

### Moving Cards

Drag a card by any part of it except the two card buttons.  
Pressing a card selects it, `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac) adds it to the selection, and dragging a selected card moves every selected card. The selection is the one the ERD tab uses, so what you select here is still selected when you go back.

A card moves only in Flow: its table stays where it is on the ERD tab.  
A moved card stays put through panning, zooming, and `Fit`. It goes back to where the layout placed it when you leave the tab or switch to `Graph` and come back, and when `Show all` returns to a whole-diagram layout Flow already has. A new layout places it again, taking into account where you left it — see [How Flow Is Placed](#how-flow-is-placed).

### Focusing on Tables

On the ERD tab, select one or more tables and press `Alt + F` (Windows/Linux) or `⌥ + F` (Mac), or right-click a table and choose `Focus on this table`.  
The Visualization tab opens in `Flow`, narrowed to those tables and every table one relationship away from any of them, in either direction. Only the connectors between the tables it shows are drawn.

When the table you right-click is one of several selected tables, the entry reads `Focus on selected tables` and focuses the whole selection. Right-clicking a table outside the selection focuses that table alone.  
`Alt + F` takes the selected tables and leaves memos out. With no table selected it does nothing, and it is ignored while a cell or memo is being edited or while quick search, table properties, the diff viewer, the Auto Layout preview, or time travel is open.

Inside Flow, the waypoints [card button](#card-buttons) narrows the view the same way, to that one table. `Show all` on the [toolbar](#toolbar) goes back to the whole diagram.  
A narrowed view is laid out on its own and fitted to the screen. It stays narrowed when you leave the tab or switch to `Graph` and come back, and `Escape` does not widen it.

![Focusing on orders with ⌥ + F, narrowing to members with its card button, then Show all](/img/demo-visualization-focus.webp)

### How Flow Is Placed

The first time `Flow` is shown, the tables it shows are laid out off the main thread and the result is fitted to the screen.  
The layout is kept while the editor is open. Leave the tab or switch to `Graph` and come back, and Flow reuses it, with the zoom and pan where you left them.  
Flow keeps one layout for the whole diagram and one for the narrowed view, so `Show all` goes back to the whole-diagram layout and fits it to the screen without working it out again, as long as nothing that layout was made from has changed.

Flow lays the cards out again when:

- You press `Tidy Up`. The result is fitted to the screen.
- You change the row display, or narrow the view to other tables. The result is fitted to the screen.
- Tables or relationships are added or removed — on the ERD tab while you are away, picked up when you come back, or by a collaborator while you are in Flow. The zoom and pan stay where they are.

Each layout takes into account where the cards currently stand, so `Tidy Up` does not necessarily restore an earlier arrangement.  
A change that only resizes a card, such as renaming a table or adding a column, does not lay the cards out again. Press `Tidy Up` if cards end up overlapping.

A layout that takes longer than 6 seconds shows a `Placing tables…` notice with `Cancel`.  
`Cancel`, or `Escape` at any point while the layout runs, drops it; `Tidy Up`, or coming back to `Flow`, asks for it again.  
If a layout fails — the host runs no shared worker, the worker fails to start, or no layout comes back within 60 seconds — Flow shows `Could not place tables`, and `Tidy Up` tries again. See [Web Workers](../../api/installation.md#web-workers).  
Flow draws only the tables its last layout placed, over the whole diagram and in a narrowed view alike, so the first time it is shown there may be no cards at all until a layout succeeds.  
Whenever Flow lays the cards out again, such as when you narrow the view to other tables, the previous arrangement stays on screen until the new layout lands, and it stays there if that layout is cancelled or fails.

When the whole document is replaced, for example by importing a file, Flow's layouts, focus, row display, zoom, and pan are discarded, and the next time you open Flow it starts over as it did the first time: over the whole diagram, or narrowed if you open it by [focusing on tables](#focusing-on-tables).

### Flow Never Edits the Document

Flow only reads the diagram. Zooming, panning, moving cards, `Tidy Up`, the row display, pins, and focusing add nothing to the [undo history](./undo-redo.md#what-the-history-records).  
They change nothing in the diagram either, except that pressing a card brings its table to the front, just as clicking a table on the ERD tab does, so it is in front there too. `Graph` leaves the diagram alone in the same way.  
The external-link [card button](#card-buttons) goes further, because it takes you out of Flow: the scroll it makes on the ERD tab is recorded like any other change of view position.

Collaborators' edits still reach the diagram while you are in Flow, and cards follow the tables and relationships they add or remove — see [How Flow Is Placed](#how-flow-is-placed).  
Their selection and focus rings are drawn on the cards, but their cursors and drag boxes are not — see [Collaborative Editing](../../api/advanced/collaborative-editing.md).

Both modes, focusing included, work in a `readonly` editor too.
