---
sidebar_position: 4
description: Give tables and columns logical names, show physical names, logical names, or both with the Name View, complete term names as you type, link columns to domains, and see where else names follow the view.
---

# Logical Names

A table and each of its columns can have a logical name beside its name. The logical name is the one people read, such as `Customer Name` for `CUST_NM`. The name itself is the physical name, the one [Schema SQL](./schema-sql.md) and the [Code Generator](./code-generator.md) write.  
The Name View decides which of the two the ERD canvas draws: the names, the logical names, or both — see [Name View](#name-view).  
A logical name can also give its table or column a physical name, derived from the words and terms on the [Dictionary](./dictionary.md) tab — see [Deriving Physical Names](./dictionary.md#deriving-physical-names).  
A column can be linked to a domain, a named data type such as `Name` for `VARCHAR(100)` kept on the Dictionary tab's `Domains` sheet, and then holds the domain's data type — see [The Domain Cell](#the-domain-cell).  
Schema SQL can write each logical name into an empty comment — see [Logical Names as Comments](./schema-sql.md#logical-names-as-comments).

## Name View

There are three views, and each draws a table's header and rows its own way:

- `Physical Names`, the view of a new diagram, draws no logical name. The header shows the table's name and, while View Option → `Table Comment` is on, its comment, and each row shows its cells in the [column order](./settings.md#adjusting-column-order).
- `Logical Names` draws the logical name in the place of each name: in the header, and in each row where `Name` stands in the column order. A row's type cell can stand for the column's domain, as described below.
- `Both Names` draws the logical name beside the name. The header shows the logical name, then the name, then the comment, and each row gains a `Logical Name` cell, which the column order places just before `Name` by default.

A blank logical name, including one made only of spaces, shows a dimmed stand-in. In `Logical Names` it is the name drawn in its place, or the `table` or `column` placeholder when the name is blank too. In `Both Names` it is the `logical` placeholder.

In `Logical Names`, a column linked to a named domain on the Dictionary tab's `Domains` sheet shows that domain's name in its type cell instead of its data type. Every other column shows its data type there.  
While View Option → `Domain` is on, the domain has a cell of its own and the type cell keeps the data type, so no row shows the domain twice — see [The Domain Cell](#the-domain-cell).

Each table is as wide as the cells it draws in the view, so a switch resizes the tables and lays their connectors out again. No table moves.  
At `70%` and below, a table collapses to its name — see [Zoom In/Out](./table-related-functions.md#zoom-inout). In `Logical Names` it shows the logical name, or the name dimmed while there is none. In `Both Names` it shows the logical name with the name on a line under it, or the name alone while there is no logical name.

The Dictionary's checks can write a logical name or a name in red or amber where they flag it — see [Marks on the Canvas](./dictionary.md#marks-on-the-canvas).

## Switching the View

Four places switch the view, and each lists `Physical Names`, `Logical Names`, and `Both Names` with the view in force checked:

- The `Name View` button on the [canvas toolbar](./table-related-functions.md#canvas-toolbar), between the four relationship notations and zen mode. It names the view in force, with a down arrow, and its tooltip reads `Name View`. A click opens the list above the toolbar, and a pick closes it.
- `Name View` in the canvas context menu, right after `View Option`: a submenu of the three views. The menu stays open after a pick.
- The same list on the Visualization tab's toolbar in `Flow` mode, after the row display menu — see [Toolbar](./visualization.md#toolbar).
- `Name View` in [Quick Search](./quick-search.md#what-the-palette-lists), right after `Tab` and listed on the ERD tab only. Its submenu opens with the highlight on the view in force.

![Switching the Name View to Logical Names from the canvas toolbar, to Both Names from the canvas menu, and back to Physical Names, with ordered_at, which has no logical name, dimmed and then shown as the logical placeholder](/img/demo-name-view.webp)

All four set the same view. The top toolbar has no button for it.

A switch keeps the selection and is not recorded in the [undo history](./undo-redo.md#what-the-history-records).  
A focused cell the new view does not draw moves to the cell drawn in its place: the name and the logical name stand in for each other, as the type and the domain do. A cell editor open on that cell closes. Turning View Option → `Domain` on or off moves the focus the same way.  
While the `Name View` lock is on, as it is in a new diagram, a switch changes only your own screen and the file keeps the view it was locked at. With the lock off, the file saves the view you switch to — see [Lock](./settings.md#lock).

## Writing a Logical Name

`Physical Names` draws no logical name, so switch to `Logical Names` or `Both Names` to write one on the canvas:

- In `Logical Names`, the name cells of the header and the rows hold the logical names, so a physical name cannot be edited on the canvas in this view.
- In `Both Names`, the logical name cells hold the logical names and the name cells the physical names.

A logical name cell edits like any other cell: start with `Enter` or a double-click — see [Table Editing](./table-editing.md). Opened on a blank logical name, the editor shows what the cell drew as its placeholder: the name in `Logical Names`, `logical` in `Both Names`.  
Typing writes only the logical name. The physical name is derived from it once the editor closes (`Enter`, `Tab`, `Escape`, or a click elsewhere) on a changed logical name, as an undo step of its own after your typing. A physical name you wrote yourself is left as it is — see [Deriving Physical Names](./dictionary.md#deriving-physical-names).

`Tab` and `Shift + Tab` walk the cells the view draws, in their order — see [Tab Key](./table-editing.md#tab-key):

- In `Logical Names`, the header's logical name, then its comment, then each row's cells in the column order, with the logical name in the name's place.
- In `Both Names`, the header's logical name, name, and comment, then each row's cells in the column order, its `Logical Name` cell first by default.

`Alt + Enter` (Windows/Linux) or `⌥ + Enter` (Mac) adds a column and focuses its name cell, which in `Logical Names` is its logical name.

A foreign key column that a relationship adds copies its key's logical name and domain, along with its type — see [Identifying Relationships](./relationship-editing.md#identifying-relationships).  
Copying columns to a spreadsheet, and pasting columns from one, use the cells the view draws, logical name and Domain cells included — see [Copying/Pasting Columns](./table-editing.md#copyingpasting-columns).

## Completing Term Names

While you type in a logical name cell, the header's or a row's, a list under the cell offers the terms whose names start with the text, ignoring case and any spaces before it. A term is a whole logical name kept on the Dictionary tab's `Terms` sheet, with the physical name and the domain it gives. The list shows up to eight, sorted by name, with the typed text highlighted. There is no list while no term starts that way.

![Adding a column with ⌥ + Enter in Both Names, picking Order Amount from the term list under its logical name to fill in ORD_AMT, DECIMAL(10,2) and the Amount domain, then typing Order Date, whose name ORD_DT the words give as Enter closes the editor](/img/demo-logical-names.webp)

- Nothing is highlighted at first. `↑` and `↓` move the highlight, wrapping round at both ends, and the highlighted term shows the `Enter` key.
- `Enter` on a highlighted term writes its name as the logical name and ends the edit. Unless the physical name is one you wrote yourself, the same undo step derives the physical name from the term at once and gives a column the term's domain too. `Enter` with nothing highlighted ends the edit and keeps what you typed.
- A click on a term writes it the same way and leaves the editor open.
- `Escape` while the list shows closes only the list, and the next `Escape` ends the edit.
- `Tab` moves on with the text as typed, and the physical name is derived from it as the editor closes.
- While an input method is composing, the arrows and `Enter` belong to the composition.

What a term gives a table or a column is covered in [Deriving Physical Names](./dictionary.md#deriving-physical-names).

## The Domain Cell

View Option → `Domain`, off by default, gives each row a Domain cell in every view, where `Domain` stands in the column order, right after `DataType` by default — see [Table View Options](./table-related-functions.md#table-view-options).  
The cell shows the name of the domain the column is linked to, or the `domain` placeholder, dimmed, for a column linked to no domain the `Domains` sheet lists.

![Turning on View Option → Domain, picking Amount in PAY_AMT's Domain cell after narrowing the list with amo, changing Amount's Data Type to DECIMAL(12,2) on the Dictionary tab and finding the column changed with it, then typing NUMERIC(12,2) into the column, which unlinks it](/img/demo-domains.webp)

`Enter` or a double-click opens a picker over the cell: an empty field with the cell's text as its placeholder, and under it `None`, then every named domain of the `Domains` sheet in the sheet's order. The highlight starts on the linked domain, or on `None`.

- Typing lists only the domains whose names contain the text, ignoring case, drops `None`, and highlights the first. `↑` and `↓` move the highlight.
- `Enter` links the highlighted domain, and a click links the one clicked. Either gives the column the domain's data type, as one undo step, and ends the edit. `None` unlinks the column and keeps its data type.
- What you type is never written into the column. While the `Domains` sheet has no named domain there is no list, and `Enter` ends the edit writing nothing.

In `Logical Names` with View Option → `Domain` off, a type cell that shows a domain's name opens this picker, and one that shows a data type opens the data type editor — see [DataType Autocomplete](./table-editing.md#datatype-autocomplete). To link a domain to a column that has none, turn the Domain cell on.  
A linked column holds its domain's data type and follows it when the domain's type changes, and typing another type into its DataType cell unlinks it — see [Domains and Data Types](./dictionary.md#domains-and-data-types).

## Beyond the Canvas

Most other places that name a table or a column follow the Name View too:

- `Physical Names` shows the name.
- `Logical Names` shows the logical name, or the name, dimmed where the place can dim it, while the logical name is blank.
- `Both Names` shows the logical name with the name after it: muted in a row of text, on a second line in a Graph label, and in brackets where one text has to hold both, such as `Member (member)`. A table or column with no logical name shows its name alone.

A list sorted by name, such as the Explorer's tables or Quick Search's `#` rows, stays sorted by name in every view, never by logical name.

The places that follow the view:

- On the Visualization tab, the Flow cards — see [Names on the Cards](./visualization.md#names-on-the-cards) — and the Graph's labels and hover preview — see [Reading the Graph](./visualization.md#reading-the-graph) and [Hover Preview](./visualization.md#hover-preview).
- [Table Properties](./table-related-functions.md#table-properties): its chips, and in the `Indexes` tab the `Columns` rows and the `Index order` list — see [Indexes](./table-related-functions.md#indexes).
- The [Explorer](./explorer.md#the-tree)'s table and column rows, and the tables listed under each table group.
- Quick Search's `#` rows — see [Searching the Diagram](./quick-search.md#searching-the-diagram).
- The [Diff Viewer](./table-related-functions.md#diff-viewer)'s change tree and both of its sides.
- [Map Columns](./relationship-editing.md#map-columns), and the `<parent> has no primary key to copy` tooltip that `Create new columns` can show while a relationship is drawn — see [Relationship Creation](./editing-start.md#relationship-creation).
- The copy of the rows a column drag carries over empty canvas, which shows each row's name and type cells as the row draws them — see [Rearranging and Moving Columns](./table-editing.md#rearranging-and-moving-columns).
- The `Target` column of the Dictionary tab's `Checks` sheet — see [The Checks Sheet](./dictionary.md#the-checks-sheet).
- An [exported image](./file-import-export.md#image).

A few places keep the names whatever the view: the Explorer's index and foreign key rows, the `Keys` in the `Indexes` tab of Table Properties, Map Columns' `New column: <name>`, and the place written beside a Quick Search `@` or `:` row.

The Diff Viewer, [Time Travel](./undo-redo.md#time-travel), the [Auto Layout](./table-related-functions.md#auto-layout) `Force` preview, and the `Export image` dialog open in the Name View you are looking at, whatever view the file keeps. Each keeps that view while it is open.  
Every Auto Layout, and a Schema SQL, GraphQL, DBML, or AML `Import` or `Import and Add`, places the tables at the widths they take in your view.

## Finding by Logical Name

Logical names are found in every Name View, `Physical Names` included, where the canvas draws none:

- [Find and Replace](./find-and-replace.md#what-it-searches) searches them as one kind of text, `Logical names`, for tables and columns alike, and it is on when the search first opens. Replacing a logical name derives the physical name from it, as writing one does.
- In [Quick Search](./quick-search.md#searching-the-diagram), `#` finds a table by its name or its logical name, and `@` finds a column by either, a logical name match showing `Logical name` beside it. The table part of `@`, before the `.`, matches a table's name or logical name too.

Switching the Name View changes how the results are named, never what is found.

## Collaborators

In a [collaborative session](../../api/advanced/collaborative-editing.md), logical names and domain links reach every editor like any other edit.  
While the `Name View` lock is on, each editor keeps a view of its own, and a switch shows only in the editor that made it. While it is off, a switch in any editor that is not read-only switches every editor — see [Lock](./settings.md#lock), which also covers what turning the lock on or off does to each editor's view.  
When a participant's focused cell is one your view does not draw, their color shows on the cell your view draws in its place: a name cell in `Physical Names` shows on your logical name cell in `Logical Names`, and the other way round, and a type cell and the domain standing in it match the same way.

A coding agent working through the MCP server sets logical names and links domains whatever view you are looking at, and has no tool that switches the Name View — see [Dictionaries](../../mcp/tools.md#dictionaries) and [Settings](../../mcp/tools.md#settings).

## Read-only Editors

In a [`readonly`](../../api/erd-editor-element.md#readonly) editor every Name View picker works, and a switch changes only that screen, whatever the lock.  
Logical names and domains cannot be edited there, so no term list or domain picker opens, and none of the `Derive Physical Name Again` and `Derive Physical Names Again` rows is offered. View Option → `Domain` changes nothing there, as no [view option](./table-related-functions.md#table-view-options) does.
