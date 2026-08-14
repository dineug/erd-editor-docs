---
sidebar_position: 3
---

# Table Editing

Table editing basically offers an editing experience similar to Excel.  
Editing mode starts with `Enter`.

![demo-table-edit](/img/demo-table-edit.webp)

## Adding Columns

Created using the shortcut `Alt + Enter`.  
A column is added to every selected table.

## Tab Key

Press `Tab` to move straight into the next cell's editing mode.  
Pressing `Tab` in the last cell creates a new column.  
Use `Shift + Tab` to navigate to the previous cell's editing mode.

![demo-table-tab](/img/demo-table-tab.webp)

## Selecting Multiple Columns

Supports four methods:

- `Shift + Arrow Up/Down`
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Shift + click`
- `Alt + A`: Select All

![demo-column-select](/img/demo-column-select.webp)

## Rearranging and Moving Columns

Functions when `dragging`, enabling movement to other tables.

![demo-column-move](/img/demo-column-move.webp)

Supports moving multiple columns with `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac).

![demo-column-multi-move](/img/demo-column-multi-move.webp)

## Column Deletion

Deletes the currently selected column.  
Shortcut: `Alt + Backspace` or `Alt + Delete`

![demo-column-remove](/img/demo-column-remove.webp)

## Copying/Pasting Columns

Operates like a table-based clipboard.  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

You can paste from the editor into Excel and from Excel back into the editor.  
For the columns below, any of these values is read as true (case insensitive):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

![demo-copy-column-to-sheet](/img/demo-copy-column-to-sheet.webp)
![demo-copy-sheet-column](/img/demo-copy-sheet-column.webp)

Supports actions when selecting multiple tables.

![demo-copy-column-multi](/img/demo-copy-column-multi.webp)

## Column Primary Key

Set the selected column as a primary key from the table context menu or with the shortcut `Alt + K`.

![demo-column-pk](/img/demo-column-pk.webp)
