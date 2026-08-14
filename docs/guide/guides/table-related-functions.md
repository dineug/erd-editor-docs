---
sidebar_position: 4
description: Select and move multiple tables, zoom, set colors and view options, choose a database, and compare documents.
---

# Table-related Functions

## Multiple Selection

Supports three methods:

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + Alt + A` (Windows/Linux) or `⌘ + Alt + A` (Mac)

![demo-table-select](/img/demo-table-select.webp)

## Moving Multiple Tables

Drag while holding the mod key: `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac).  
Dragging without it clears the selection and moves only the dragged table.

![demo-table-multiple-move](/img/demo-table-multiple-move.webp)

## Table and Memo Deletion

Deletes the currently selected table or memo.  
Shortcuts: `Ctrl + Backspace` (Windows/Linux) or `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` (Mac) or `⌘ + Delete` (Mac)

![demo-table-remove](/img/demo-table-remove.webp)

## Zoom In/Out

Zooms with the mouse wheel while holding the mod key: `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac). The wheel alone scrolls the canvas.  
Shortcuts: `Ctrl + Plus` (Windows/Linux) or `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) or `⌘ + Minus` (Mac)

![demo-zoom](/img/demo-zoom.webp)

## Table and Memo Color Specification

You can designate colors to differentiate by category.

![demo-table-color](/img/demo-table-color.webp)

## Table View Options

Offers the following view options:

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Auto Increment
- Relationship

![demo-view-options](/img/demo-view-options.webp)

## Table Properties

Opens the property panel of the selected table.
Start from the table context menu or by using the shortcut `Alt + Space`.
It provides three tabs: Indexes, Schema SQL, and Code Generator.
Indexes are defined here and are included in the exported Schema SQL.

## Automatic Table Placement

Operates using Force Simulation.  
You can also import external Schema SQL and use it as the starting point for table placement.

![demo-automatic-table-placement](/img/demo-automatic-table-placement.webp)

## Databases

Supported databases include:

- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- SQLite

These options determine the Schema SQL syntax for exporting and DataType autocomplete.

<img src="/img/database-menu.png" width="400" alt="Database selection menu" loading="lazy" />

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Diff Viewer

You can compare previously saved documents with the current document.

<img src="/img/context-menu-diff-viewer.png" width="400" alt="Diff viewer context menu" loading="lazy" />

![diff-viewer](/img/diff-viewer.png)
