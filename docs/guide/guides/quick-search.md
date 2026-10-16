---
sidebar_position: 7
description: Open the command palette to switch tabs, run a command for the current tab, open or close the Explorer, change the theme or display language, or jump to a table, column, comment, or memo by typing a prefix.
---

# Quick Search

Quick Search is the editor's command palette.  
It lists the commands available on the tab you are on. Start the search with `#`, `@`, or `:` to search the diagram instead and jump to a table, a column, or a comment or memo.

Open it with `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac), or click `Search` in the toolbar.  
The same shortcut closes it, as do `Esc` and a click outside the panel. Opening it closes Table Properties, the [theme builder](./language-and-theme.md#theme), the [`Display Language`](./language-and-theme.md#picking-a-language) picker, the [`Export image`](./file-import-export.md#image) dialog, and [Map Columns](./relationship-editing.md#map-columns), which drops what you had picked in it. It does not open while you are editing a table cell, a memo, or a table group's name.

The toolbar button right after `Search` is `Explorer`. It opens or closes the [Explorer](./explorer.md), a tree of the diagram docked at the left of the canvas, with Find and Replace at its top.  
Opening the palette leaves the Explorer open, and `Esc` then closes only the palette. `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) pressed in the palette closes it and takes the keyboard to the Explorer's Find field, opening the Explorer on its search if it is not showing. Unlike the `Toggle Explorer` entry, the key never closes the Explorer from the palette — see [Opening and Closing](./explorer.md#opening-and-closing). While the diff viewer, time travel, or the Auto Layout preview is open, the editor leaves the key alone: the palette stays open and the key goes on to the browser or host — see [The Browser's Find Bar](./find-and-replace.md#the-browsers-find-bar).  
A host embedding the editor can bind Quick Search to another key, which the `Search` tooltip then shows — see [Shortcuts](./settings.md#shortcuts).

![Opening the palette with ⌘ + K, then jumping to a table with #pay, to a column with @price, and to a table comment with :address](/img/demo-quick-search.webp)

## Searching and Navigating

Type to filter the list. Each keystroke searches the whole list in front of you afresh, so deleting characters, or typing a new word over one that found nothing, brings matching entries back.  
The match is fuzzy and covers both the name of an entry and the keywords shown beside it. Inside the `Import` submenu, for example, `sdl` finds `GraphQL`, `dbdiagram` finds `DBML`, and `azimutt` finds `AML`. A near typo still finds its entry, as `tabel` finds `New Table` and `imprt` finds `Import`, but an entry that only loosely resembles what you typed is left out: `memo` lists `New Memo` alone. An entry whose name or keywords contain what you typed, ignoring case, is always listed, and one the fuzzy match misses comes after the fuzzy matches. What you typed is highlighted wherever an entry contains it, ignoring case.  
In a display language other than English, commands and submenu entries are also found by their English names and keywords, which the list does not show, so `new table` finds `New Table` whatever language it is shown in.  
Move through the list with `↑` and `↓` — it wraps at both ends — and run the highlighted entry with `Enter`. A command that has a shortcut of its own shows it at the end of its row: on the right, or on the left in a right-to-left display language. While an input method is still composing, as in the middle of a Korean syllable, `↑`, `↓`, and `Enter` belong to it and neither move the highlight nor run an entry.

An entry such as `Database`, `Import`, or `Auto Layout` opens a submenu: its entries replace the list and the search box is cleared. The submenus of `Database`, `Bracket`, `Language`, the two name cases, `Schema SQL: Statements`, `Schema SQL: Header`, `Theme`, and `Display Language` check the current choice and open with the highlight on it, so `Enter` keeps it; the other submenus open with nothing highlighted.  
Filtering only ever applies to the list in front of you, and there is no way back up a level, so close and reopen the palette to start over. Inside a submenu, `#`, `@`, `:`, and `?` are plain text, not [prefixes](#searching-the-diagram).

## What the Palette Lists

The list depends on the tab you are on. Every tab starts with `Tab`, which switches to `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Code Generator`, or `Settings`, leaving out the tab you are already on.

On the ERD tab: `Database`, `Import`, `Import and Add`, and `Export`, then `New Table`, `New Memo`, `New Table Group`, and `Group Selected Tables`, the four relationship types, and `Auto Layout`. Tables are not listed here; type `#` to [go to one](#searching-the-diagram).  
`Import and Add` is left out in a read-only editor, and `New Memo` while [View Option](./table-related-functions.md#table-view-options) → `Memos` hides the memos. `New Table Group` starts drawing a [table group](./table-groups.md) on the canvas, and `Group Selected Tables` puts the selected tables in a new group and opens its name for typing. Both are left out in a read-only editor and while View Option → `Table Groups` hides the groups, and `Group Selected Tables` also needs at least one table selected. Their rows show the keys: `Alt + G` (Windows/Linux) or `⌥ + G` (Mac) for [drawing a group](./table-groups.md#drawing-a-group), and `T` then `G` for [grouping the selected tables](./table-groups.md#grouping-selected-tables).  
These run the same commands as the canvas context menu, apart from `Group Selected Tables`, which is the table menu's `Group selected tables`; `View Option` and `Diff Viewer` are in the context menu only. `Export` offers the same `json`, `Schema SQL`, and `Image` as the context menu, and typing `png` or `svg` inside it finds `Image`.  
See [Importing or Exporting Files](./file-import-export.md) for what each format, [Import and Add](./file-import-export.md#import-and-add), and the [image export](./file-import-export.md#image) do, and [Table-related Functions](./table-related-functions.md#databases) for what the database choice affects.

On the Schema SQL tab: `Database` again, and `Bracket`, which sets the quote character wrapped around table, column, constraint, and index names in the generated SQL — `SingleQuote`, `DoubleQuote`, `Backtick`, or `None` for no quoting at all. Then `Schema SQL: Statements` and `Schema SQL: Header`, which make the same choices as the tab's options panel but list only those the selected database writes, and `Schema SQL: Options panel`, which shows or hides that panel. See [Schema SQL](./schema-sql.md) for what each choice writes.

On the Code Generator tab: `Database`, `Bracket` while the language is `Doctrine`, `JPA`, or `SeaORM`, then `Language`, `Table Name Case`, `Column Name Case`, and `Code Generator: Options panel`, which shows or hides the tab's options panel. See [Code Generator](./code-generator.md) for what each target produces.

The Visualization and Settings tabs have no commands of their own, only `Tab` and the commands below that every tab lists.

Near the end of every tab's list, in a read-only editor as well, is `Toggle Explorer`, which shows its shortcut, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac). Typing `find`, `replace`, `rename`, `tree`, `outline`, or `objects` also finds it.  
Running it closes the palette and does what the shortcut does on the canvas. While the toolbar's `Explorer` button shows pressed, that is, while the Explorer is open on the ERD tab and not hidden by zen mode, it closes the Explorer. Otherwise it switches to the ERD tab and opens the Explorer on its search, with the caret in the Find field — see [Opening and Closing](./explorer.md#opening-and-closing). It is left out while the diff viewer, time travel, or the Auto Layout preview is open.

### Theme and Display Language

After `Toggle Explorer`, every tab lists `Theme` and `Display Language`, in a read-only editor as well. Each is listed only where the editor offers its picker, as the toolbar's `Theme` and `Display Language` buttons show. The web app, Google Drive, VS Code, JetBrains IDEs, and Obsidian offer both — see [In Each Host](./language-and-theme.md#in-each-host).

`Theme` opens `System`, `Light`, and `Dark`, with the current appearance checked. Choosing one changes the appearance alone and keeps the gray and accent colors, as the theme builder's `Appearance` buttons do.  
`Display Language` opens `System`, then the 25 languages, each in its own name and in the picker's order, with the current option checked. Here a language is also found by its English name or its code: `german` or `de-DE` finds `Deutsch`, and `korean` finds `한국어`.  
A choice in either takes effect at once, closes the palette, and is kept just as one made in the theme builder or the `Display Language` picker is. If the display language changes while the palette is open, the list switches to it, keeping what you typed and the submenu you are in.

## Searching the Diagram

Start the search with a prefix to search the diagram rather than the commands: `#` for tables, `@` for columns, `:` for comments and memos, or `?` to list the prefixes. A prefix works from any tab. It counts only as the first character, ignoring spaces before it. A space after it is optional, so `#users` and `# users` are the same search, and the full-width `＃`, `＠`, `：`, and `？` that a Japanese or Chinese input method types count as well.  
While the input is empty at the top level, a line under it shows the four prefixes; click one to type it. While a prefix is in effect, the end of the input names its scope: `Tables`, `Columns`, `Comments & memos`, or `Help`. Delete the prefix to get the commands back.

`#` lists the tables, each with `Table` beside it, and a table with a blank name is listed as `unnamed`. With nothing after `#`, they are sorted by name. Text after `#` is matched against table names alone, fuzzily as above, and tables whose name contains it come first. Table group names and index names are not searched under any prefix; [Find and Replace](./find-and-replace.md#what-it-searches) searches both.

`@` lists columns by name, each with where it is beside it, such as `users.email · Column`. Text after `@` has to appear in the column name, ignoring case; this match is not fuzzy. Text before the first `.` narrows the search to the tables whose name contains it: `@users.em` lists the columns containing `em` in tables whose name contains `users`, `@users.` lists the columns of those tables, and `@.em` searches every table. With nothing after `@`, the columns are listed unfiltered.

`:` lists table comments, column comments, and memos, never names. Each row shows an excerpt of the text around the match, with `users · Table comment`, `users.email · Column comment`, or `Memo` beside it. Text after `:` has to appear in the comment or memo, ignoring case, as with `@`. With nothing after `:`, the comments and memos that are not empty are listed. While View Option → `Memos` hides the memos, `:` lists no memo.

`@` and `:` list their rows in the order the document holds them: table by table, each table's comment before its columns in column order, and memos last.

`?` lists `Tables`, `Columns`, and `Comments & memos`, and text after `?` filters them. Choosing one replaces the input with its prefix and leaves the palette open.

A prefixed list holds every match, however many there are. A prefix whose search finds nothing leaves the list empty, with no message.

Choosing a table, column, comment, or memo closes the palette and switches to the ERD tab if you are on another one.  
The canvas scrolls to it unless it already shows well — see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands). A table is then selected alone and brought to the front, with its name focused unless the focus was already in that table.  
A memo is selected alone and brought to the front. For a column or a comment, its table is selected alone, brought to the front, and focused on the cell that holds the text, or on the name beside a comment that a [table view option](./table-related-functions.md#table-view-options) hides.  
No jump starts or finishes a relationship being drawn.

For `Match Case`, `Match Whole Word`, or `Use Regular Expression`, or to replace text, use [Find and Replace](./find-and-replace.md) at the top of the Explorer.

## When No Command Matches

At the top level, with no prefix, if no listed command contains what you typed, ignoring case, three rows follow the commands: `Search tables for "…"`, `Search columns for "…"`, and `Search comments & memos for "…"`, each with its prefix as the icon. Choosing one types that prefix before your text, so `users` becomes `#users`, and the palette stays open on those results.  
If the search finds no command at all, `No commands match` appears above the list, which then holds only the three rows. If it finds only commands that do not contain the text, they come first: on the ERD tab with no table selected, `tables` lists `New Table`, `Database`, and, where it is offered, `New Table Group` before the three rows. With a table selected, `Group Selected Tables`, where it is offered, contains `tables`, so the three rows do not appear.  
Inside a submenu, a search that finds nothing leaves the list empty, with no message.

## Searching in Korean

A search that contains Hangul also matches by its letters, in the commands, in submenus, and under every prefix.  
Each step a Korean input method passes through keeps finding the row you are typing toward, so `ㅅ`, `사`, `상`, `사요`, and `사용` all find `사용자`. A search made only of initial consonants matches the initial consonants of the syllables, with spaces skipped: `ㅅㅇㅈ` finds `사용자`, and `ㅈㅁ` finds `주문 내역`. A consonant cluster that a Windows input method composes from two initials typed in a row, such as `ㅄ`, counts as the two (`ㅂㅅ`), while a double consonant such as `ㄲ` stays one letter. Text stored decomposed, as macOS file names are, matches as if it were composed.  
Rows whose whole text spells the search, letter by letter or initial by initial, come first, then rows starting with it, then rows containing it. Under `@` and `:`, rows that contain the search as typed come before all of these, in document order. The highlight covers whole syllables, so `상` lights `사용` in `사용자`.
