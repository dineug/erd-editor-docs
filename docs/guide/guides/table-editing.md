---
sidebar_position: 3
description: Add, select, reorder and delete columns, toggle column options, and copy or paste columns.
---

# Table Editing

Table editing basically offers an editing experience similar to Excel.  
Editing mode starts with `Enter`, or by double-clicking a cell.

![demo-table-edit](/img/demo-table-edit.webp)

## Adding Columns

Created using the shortcut `Alt + Enter` (Windows/Linux) or `⌥ + Enter` (Mac).  
A column is added to every selected table.

## Tab Key

Press `Tab` to move straight into the next cell's editing mode.  
Pressing `Tab` in the last cell creates a new column.  
Use `Shift + Tab` to navigate to the previous cell's editing mode.

![demo-table-tab](/img/demo-table-tab.webp)

## DataType Autocomplete

Start editing a `DataType` cell and type. Matching types from the selected database are suggested, and the part of a suggestion that literally contains what you typed is highlighted.  
The match itself is fuzzy, so `vch` also finds `VARCHAR`.

- `Arrow Up` or `Arrow Down`: move through the suggestions
- `Arrow Right`, `Tab` or `Enter`: accept the highlighted suggestion
- `Arrow Left`: go back to the text you typed

You can also click a suggestion.  
Nothing is forced, so a type that is not in the list can be typed freely, including arguments such as `VARCHAR(255)`.  
The suggestions follow the selected database. Changing the database changes what is offered and leaves existing columns as they are.

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

These three cells are toggles rather than text.  
Double-click one, or press `Enter` while it is focused, to flip it.

The Not Null cell reads `N-N` when it is set and `NULL` when it is not.  
`UQ` and `AI` are dimmed when off and highlighted when on.

Cells hidden by the [table view options](./table-related-functions.md) cannot be toggled.

## Selecting Multiple Columns

Supports five methods:

- `Shift + Arrow Up/Down`: extend the selection one row at a time
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac): add a single column
- `Shift + click`: select the range from the last focused column
- `Ctrl + Shift + click` (Windows/Linux) or `⌘ + Shift + click` (Mac): add that range to the selection
- `Alt + A` (Windows/Linux) or `⌥ + A` (Mac): Select All

![demo-column-select](/img/demo-column-select.webp)

## Rearranging and Moving Columns

Functions when `dragging`, enabling movement to other tables.

![demo-column-move](/img/demo-column-move.webp)

Supports moving multiple columns with `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac).

![demo-column-multi-move](/img/demo-column-multi-move.webp)

## Column Deletion

Deletes the currently selected column.  
Shortcut: `Alt + Backspace` or `Alt + Delete` (Windows/Linux), `⌥ + ⌫` or `⌥ + Delete` (Mac)

![demo-column-remove](/img/demo-column-remove.webp)

## Copying/Pasting Columns

Operates like a table-based clipboard.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

You can paste from the editor into Excel and from Excel back into the editor.  
For the columns below, any of these values is read as true (case insensitive):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

On the way out the editor writes `TRUE` or `FALSE` for AutoIncrement and Unique, and `NOT NULL` or `NULL` for Not Null.

![demo-copy-column-to-sheet](/img/demo-copy-column-to-sheet.webp)
![demo-copy-sheet-column](/img/demo-copy-sheet-column.webp)

Supports actions when selecting multiple tables.

![demo-copy-column-multi](/img/demo-copy-column-multi.webp)

## Copying/Pasting Tables and Memos

When no column is selected inside a focused table, the same shortcuts copy the selected tables and memos themselves — see [Table-related Functions](./table-related-functions.md).

## Column Primary Key

Toggles the primary key on the focused column, which is the column the focused cell belongs to, not the whole column selection.  
Use the table context menu or the shortcut `Alt + K` (Windows/Linux) or `⌥ + K` (Mac).  
The key icon in the row is display only, so clicking it does not set the key.

![demo-column-pk](/img/demo-column-pk.webp)
