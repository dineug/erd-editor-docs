---
sidebar_position: 6
description: Open the command palette to switch tabs, run a command for the current tab, or jump to a table.
---

# Quick Search

Quick Search is the editor's command palette.  
It lists the commands available on the tab you are on, and on the ERD tab it also lists every table so you can jump to one.

Open it with `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac), or click `Search` in the toolbar.  
The same shortcut closes it, as do `Esc` and a click outside the panel. Opening it closes the table properties panel and the theme builder, and it does not open while you are editing a table cell.

![Jumping to a table with ⌘ + K, then finding GraphQL by typing sdl in the Import submenu](/img/demo-quick-search.webp)

## Searching and Navigating

Type to filter the list. The match is fuzzy and covers both the name of an entry and the keywords shown beside it. Inside the `Import` submenu, for example, `sdl` finds `GraphQL`, `dbdiagram` finds `DBML`, and `azimutt` finds `AML`.  
Move through the list with `↑` and `↓` — it wraps at both ends — and run the highlighted entry with `Enter`. A command that has a shortcut of its own shows it on the right.

An entry such as `Database`, `Import`, or `Auto Layout` opens a submenu: its entries replace the list and the search box is cleared. Filtering only ever applies to the list in front of you, and there is no way back up a level, so close and reopen the palette to start over.

## What the Palette Lists

The list depends on the tab you are on. Every tab starts with `Tab`, which switches to `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Generator Code`, or `Settings`. The tab you are already on is left out, and `Generator Code` is the tab the toolbar labels `Code Generator`.

On the ERD tab: the database vendor, `Import` and `Export`, `New Table` and `New Memo`, the four relationship types, `Auto Layout`, and one entry per table, sorted by name. A table with a blank name is listed as `unnamed`, and running it scrolls to that table and selects it.  
These run the same commands as the canvas context menu, apart from `Diff Viewer`, which is context-menu only. `Export` here offers `json` and `Schema SQL` only, so export a PNG from the [canvas context menu](./file-import-export.md#exporting) instead.  
See [Importing or Exporting Files](./file-import-export.md) for what each format does, and [Table-related Functions](./table-related-functions.md#databases) for what the database choice affects.

On the Schema SQL tab: the database vendor again, and `Bracket`, which sets the quote character wrapped around table, column, constraint, and index names in the generated SQL — `SingleQuote`, `DoubleQuote`, `Backtick`, or `None` for no quoting at all.

On the Code Generator tab: the target language, `Table Name Case`, and `Column Name Case`. See [Code Generator](./code-generator.md) for what each target produces.

On the Visualization and Settings tabs, only `Tab` is listed.
