---
sidebar_position: 3
description: Add, select, reorder and delete columns, toggle column options, and copy or paste columns.
---

# Table Editing

Table editing basically offers an editing experience similar to Excel.  
The [Name View](./logical-names.md#name-view) decides whether a table draws the names, the logical names, or both in its header and rows.  
Editing mode starts with `Enter`, or by double-clicking a cell.  
`Enter` or `Escape` ends it. What you type is applied as you type it, so `Escape` keeps the text rather than reverting it. A [Domain cell](./logical-names.md#the-domain-cell) is the exception: it only picks from its list and never keeps what you type. Closing a [logical name cell](./logical-names.md#writing-a-logical-name) on a changed logical name can also fill in the physical name.  
`Escape` leaves the cell focused and the table selected, and a second `Escape` clears both. While a logical name cell shows its [list of terms](./logical-names.md#completing-term-names), the first `Escape` closes only the list.  
While an input method is still composing, `Escape` leaves editing mode open.

![Adding a table with Alt + N and filling in two columns](/img/demo-table-edit.webp)

## Adding Columns

Created using the shortcut `Alt + Enter` (Windows/Linux) or `⌥ + Enter` (Mac).  
A column is added to every selected table.

## Tab Key

Press `Tab` to move straight into the next cell's editing mode.  
Pressing `Tab` in the last cell creates a new column.  
Use `Shift + Tab` to navigate to the previous cell's editing mode.  
`Tab` and `Shift + Tab` pass through the cells the table draws, in their order, so the Name View and View Option → `Domain` decide whether logical name and Domain cells are among them — see [Writing a Logical Name](./logical-names.md#writing-a-logical-name).  
The [alternate key](./table-related-functions.md#alternate-keys) marks drawn after a row's last cell are not cells, so keyboard focus passes over them and they never open for editing.

![Tab moving through a row's cells, adding a column from the last cell, and Shift + Tab going back](/img/demo-table-tab.webp)

## DataType Autocomplete

Start editing a `DataType` cell and type. Matching types from the selected database are suggested, and the part of a suggestion that literally contains what you typed is highlighted.  
The match itself is fuzzy, so `vch` also finds `VARCHAR`.

- `Arrow Up` or `Arrow Down`: move through the suggestions
- `Arrow Right`, `Tab` or `Enter`: accept the highlighted suggestion
- `Arrow Left`: go back to the text you typed

You can also click a suggestion.  
The list shows up to ten suggestions at a time and scrolls for the rest.  
Nothing is forced, so a type that is not in the list can be typed freely, including arguments such as `VARCHAR(255)`. The list closes once what you type runs past a whole type name, as `VARCHAR(255)` or `BIGINT UNSIGNED` does.  
The suggestions follow the selected database. Changing the database changes what is offered and leaves existing columns as they are.

Typing in the `DataType` cell of a column linked to a domain, or accepting a suggestion there, unlinks the column as soon as its type differs from the domain's — see [Domains and Data Types](./dictionary.md#domains-and-data-types).  
In `Logical Names`, while View Option → `Domain` is off, the type cell of a column linked to a named domain shows the domain's name, and editing it opens the [domain picker](./logical-names.md#the-domain-cell) instead of these suggestions. A type cell that shows a data type edits it as above.

![Filling in DataType cells from fuzzy suggestions with the arrow keys, Tab and Enter](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

These three cells are toggles rather than text.  
Double-click one, or press `Enter` while it is focused, to flip it.

The Not Null cell reads `N-N` when it is set and `NULL` when it is not.  
`UQ` and `AI` are dimmed when off and highlighted when on.

![Flipping Not Null with a double-click, and Unique and Auto Increment with Enter](/img/demo-column-options.webp)

Cells hidden by the [table view options](./table-related-functions.md) cannot be toggled.

## Selecting Multiple Columns

Supports five methods:

- `Shift + Arrow Up/Down`: extend the selection one row at a time
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac): add a single column
- `Shift + click`: select the range from the last focused column
- `Ctrl + Shift + click` (Windows/Linux) or `⌘ + Shift + click` (Mac): add that range to the selection
- `Alt + A` (Windows/Linux) or `⌥ + A` (Mac): Select All

![Selecting columns with Shift + Arrow Down, Ctrl/⌘ + click, Shift + click and Alt + A](/img/demo-column-select.webp)

To move the selected columns together, drag the handle beside the focused one — see [Rearranging and Moving Columns](#rearranging-and-moving-columns).

A right-click on a column's row decides which columns the table context menu acts on, whatever modifier key is held.  
On a row that is already selected, the selection stays and the focus moves to that row. On any other row, that row alone is selected. This holds anywhere on the row, including the key icon and an [alternate key](./table-related-functions.md#alternate-keys) mark.  
So to act on several columns from the menu, as in [Column Primary Key](#column-primary-key) or [Column Deletion](#column-deletion), right-click one of the selected rows.  
On a Mac, `Ctrl + click` opens the menu too, but it counts as a plain click, so on a cell it selects that row alone before the menu opens.

## Rearranging and Moving Columns

A column moves by its drag handle, a small button with a grip that stands just outside the table's left edge, beside the focused row.  
Focus any cell of the column, by clicking it or with the arrow keys or `Tab`, and the handle appears beside its row. No row has one while the focus is on the table's header.  
The handle is drawn faintly until the pointer is on it, and the pointer then turns into a hand. A press alone does nothing: the drag starts once the pointer moves, and it can take the column to another place in its table or into another table.  
Over a table's rows, the dragged rows move into place and the rows around the drop point slide aside to make room. Over empty canvas, or over the header of a table that has columns, a translucent copy of the rows follows the pointer, showing each row's name and type cells as the row draws them in the current [Name View](./logical-names.md#name-view).  
Drop just below a table's last row to move the column to the end of that table. A table with no columns takes the drop anywhere on it. The strip just left of a table, where the handle stands, counts as the table's rows too, so a drag straight down along the handle reorders the columns without the pointer entering the table.  
A column moved into another table keeps its logical name and its domain.

![Focusing a column and dragging the handle beside its row to a new position, then dragging another column's handle into another table](/img/demo-column-move.webp)

To move several columns at once, [select them](#selecting-multiple-columns) and drag the handle beside the focused one. While the focused column is one of two or more selected columns of its table, the handle carries all of them; otherwise it carries its own column.  
No modifier key is needed. Holding `Alt` (Windows/Linux) or `⌥` (Mac) on the handle moves the columns as a plain drag does and duplicates nothing.

![Selecting three columns, then dragging the handle beside the focused one into another table, the other selected columns moving with it](/img/demo-column-multi-move.webp)

A drag that starts on a column's row rather than on its handle moves the table, as a drag on its header does — see [Moving Multiple Tables](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) or `⌥ + drag` (Mac) on a row duplicates the table — see [Duplicating Tables and Memos](./table-related-functions.md#duplicating-tables-and-memos).  
No handle is drawn at `70%` zoom and below, where tables show only their names, or in a read-only editor, so columns cannot be reordered there.

## Column Deletion

Deletes the selected columns of the focused table. Clicking a cell selects its column, so clicking a cell and pressing `Delete` removes that one column.  
Shortcuts:

- `Delete` or `Backspace`. These remove the selected columns while their table is the only thing selected. With no column selected (the focus on the table's name, [logical name](./logical-names.md#name-view) or comment), with anything else selected too, or at `70%` zoom and below, where tables show only their names, they remove the whole selection instead — see [Table and Memo Deletion](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` or `Alt + Delete` (Windows/Linux), `⌥ + Backspace` or `⌥ + Delete` (Mac). These remove the focused table's selected columns even while other tables or memos are selected too. They remove nothing while a cell is being edited or at `70%` and below.

![Deleting one column, then two selected columns, with Alt + Backspace](/img/demo-column-remove.webp)

The table context menu does the same. With the table the only thing selected, right-click a column's row: the menu's last row reads `Delete column`, or `Delete columns` when that row is one of two or more selected columns.

While a cell is being edited, `Delete` and `Backspace` only erase text. Held down outside the cell editor, they remove only once.  
After a removal, the focus moves to the nearest remaining column above the focused one. When none is left above it, the focus moves to the table name (in `Logical Names`, the logical name drawn in its place) even if columns remain below, so the next `Delete` or `Backspace` removes the table rather than a column.  
Relationships and indexes that use a removed column are removed with it. There is no confirmation, and the whole removal is one undo step.

## Copying/Pasting Columns

Operates like a table-based clipboard.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

Copying out to a spreadsheet, pasting in from one, and pasting into the table whose column cell is focused use the cells the tables show, in the order they show them — see [Table View Options](./table-related-functions.md#table-view-options), [Adjusting Column Order](./settings.md#adjusting-column-order) and [Name View](./logical-names.md#name-view). The Name View changes what some of those cells hold:

- In `Logical Names`, the name's cell holds the logical name, or nothing while it is blank. While View Option → `Domain` is off, the type cell holds the name of the column's domain where it shows one, and the data type otherwise.
- In `Both Names`, the `Logical Name` cell is copied and pasted where the column order puts it.
- A shown Domain cell holds the domain's name, or nothing for a column that shows no domain.

Columns copied in the editor and pasted with a table header selected, or into the other selected tables, carry every cell of the copied columns, including hidden ones such as Unique and Auto Increment, and their logical names.  
They keep a domain link only while this diagram lists that same domain, not merely one of the same name, and the domain still has the copied column's type. Otherwise they land unlinked, with the type they were copied with. Their names count as written by you, unless a pasted name is empty and the logical name derives one — see [Deriving Physical Names](./dictionary.md#deriving-physical-names).  
[Alternate key](./table-related-functions.md#alternate-keys) marks such as `AK1.1` are not cells, so copying and pasting leave them out even while they are shown.

You can paste from the editor into Excel and from Excel back into the editor.  
Cell values go out exactly as typed, so a value such as `<label>` or `a &amp; b` reaches a spreadsheet or a document unchanged.  
Spreadsheet columns are matched to the visible cells by position, not by name, so the sheet's columns must follow their order.  
For the columns below, any of these values is read as true (case insensitive):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

On the way out the editor writes `TRUE` or `FALSE` for AutoIncrement and Unique, and `NOT NULL` or `NULL` for Not Null.  
Unique and Auto Increment are hidden by default, so `TRUE` and `FALSE` are written and read only once those cells are shown.

![Pasting four columns into a spreadsheet, with flags written as TRUE/FALSE and NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Pasting three spreadsheet rows into a table as columns, with YES, 1 and NOT NULL read as true](/img/demo-copy-sheet-column.webp)

Where a paste lands depends on the focus:

- With a table header selected, the pasted rows are added as new columns to every selected table.
- With a column cell focused, that table's selected rows, and then the rows below the last of them, are overwritten in order, as many as were pasted. Rows between separate selections are skipped. An overwritten row takes the pasted values in its visible cells and keeps its hidden ones, and the rows left over are added as new columns. Every other selected table gets the pasted rows added as new columns.

![Copying two columns and pasting them into two selected tables at once](/img/demo-copy-column-multi.webp)

A pasted row writes logical names and domains this way:

- A logical name, from a `Logical Name` cell or from the name's cell in `Logical Names`, counts as typed in full. While the column's name is empty or still derived, the [dictionaries](./dictionary.md#deriving-physical-names) derive the physical name from it and link the domain its term gives, unless the row's own Domain cell links one. A name the same row pastes is kept and counts as written by you.
- A Domain cell, or the type cell in `Logical Names` while View Option → `Domain` is off, links the domain its text names if the diagram lists one. Any other text, or an empty cell, links none and unlinks the column, even from a domain of the pasted type. Text in the type cell that names no domain is read as a data type. Rows copied in the editor link the domain they were copied with instead, and only while this diagram lists it with the copied type, as new columns do.
- A linked domain gives the column its data type, unless the row pastes a type of its own. Then a domain of another type is not linked, and the column takes the pasted type.
- In a row with no Domain cell, a pasted type unlinks the column from a domain of another type, as typing it does.
- No paste carries a type along [Relationship DataType Sync](./settings.md#relationship-datatype-sync).

## Copying/Pasting Tables and Memos

When no column is selected inside a focused table, the same shortcuts copy the selected tables and memos themselves — see [Table-related Functions](./table-related-functions.md).

## Column Primary Key

Toggles the primary key on the focused column, which is the column the focused cell belongs to.  
When the focused column is one of two or more selected columns, the toggle applies to all of the selected columns: if any of them is not a key, all of them become keys, and if all of them already are, all of them are cleared. Columns outside the selection are left alone.  
Use the table context menu or the shortcut `Alt + K` (Windows/Linux) or `⌥ + K` (Mac). When the toggle reaches two or more columns, the menu row reads `Primary Key on selected columns` instead of `Primary Key`.  
The key icon in the row is display only, so clicking it does not set the key.

To make several columns one composite key, [select them](#selecting-multiple-columns), then press `Alt + K` (Windows/Linux) or `⌥ + K` (Mac), or right-click one of the selected rows and choose `Primary Key on selected columns`. Each toggle is one undo step.

![Selecting two columns with Shift + Arrow Down, then making both the primary key with ⌥ + K and clearing both with a second press](/img/demo-column-pk.webp)
