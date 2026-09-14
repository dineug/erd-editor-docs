---
sidebar_position: 3
description: Add, select, reorder and delete columns, toggle column options, and copy or paste columns.
---

# Table Editing

Table editing basically offers an editing experience similar to Excel.  
Editing mode starts with `Enter`, or by double-clicking a cell.

![Adding a table with Alt + N and filling in two columns](/img/demo-table-edit.webp)

## Adding Columns

Created using the shortcut `Alt + Enter` (Windows/Linux) or `⌥ + Enter` (Mac).  
A column is added to every selected table.

## Tab Key

Press `Tab` to move straight into the next cell's editing mode.  
Pressing `Tab` in the last cell creates a new column.  
Use `Shift + Tab` to navigate to the previous cell's editing mode.

![Tab moving through a row's cells, adding a column from the last cell, and Shift + Tab going back](/img/demo-table-tab.webp)

## DataType Autocomplete

Start editing a `DataType` cell and type. Matching types from the selected database are suggested, and the part of a suggestion that literally contains what you typed is highlighted.  
The match itself is fuzzy, so `vch` also finds `VARCHAR`.

- `Arrow Up` or `Arrow Down`: move through the suggestions
- `Arrow Right`, `Tab` or `Enter`: accept the highlighted suggestion
- `Arrow Left`: go back to the text you typed

You can also click a suggestion.  
Nothing is forced, so a type that is not in the list can be typed freely, including arguments such as `VARCHAR(255)`.  
The suggestions follow the selected database. Changing the database changes what is offered and leaves existing columns as they are.

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

## Rearranging and Moving Columns

Functions when `dragging`, enabling movement to other tables.

![Dragging a column to a new position, then into another table](/img/demo-column-move.webp)

Supports moving multiple columns with `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac).

![Selecting three columns and moving them into another table with Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Column Deletion

Deletes the currently selected column.  
Shortcut: `Alt + Backspace` or `Alt + Delete` (Windows/Linux), `⌥ + ⌫` or `⌥ + Delete` (Mac)

![Deleting one column, then two selected columns, with Alt + Backspace](/img/demo-column-remove.webp)

## Copying/Pasting Columns

Operates like a table-based clipboard.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

You can paste from the editor into Excel and from Excel back into the editor.  
For the columns below, any of these values is read as true (case insensitive):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

On the way out the editor writes `TRUE` or `FALSE` for AutoIncrement and Unique, and `NOT NULL` or `NULL` for Not Null.

![Pasting four columns into a spreadsheet, with flags written as TRUE/FALSE and NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Pasting three spreadsheet rows into a table as columns, with YES, 1 and NOT NULL read as true](/img/demo-copy-sheet-column.webp)

Supports actions when selecting multiple tables.

![Copying two columns and pasting them into two selected tables at once](/img/demo-copy-column-multi.webp)

## Copying/Pasting Tables and Memos

When no column is selected inside a focused table, the same shortcuts copy the selected tables and memos themselves — see [Table-related Functions](./table-related-functions.md).

## Column Primary Key

Toggles the primary key on the focused column, which is the column the focused cell belongs to, not the whole column selection.  
Use the table context menu or the shortcut `Alt + K` (Windows/Linux) or `⌥ + K` (Mac).  
The key icon in the row is display only, so clicking it does not set the key.

![Turning the primary key on for two columns with Alt + K, then off again for one](/img/demo-column-pk.webp)
