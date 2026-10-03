---
sidebar_position: 6
description: Open the command palette to switch tabs, run a command for the current tab, open Find and Replace, or jump to a table, column, comment, or memo by typing a prefix.
---

# Quick Search

Quick Search is the editor's command palette.  
It lists the commands available on the tab you are on. Start the search with `#`, `@`, or `:` to search the diagram instead and jump to a table, a column, or a comment or memo.

Open it with `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac), or click `Search` in the toolbar.  
The same shortcut closes it, as do `Esc` and a click outside the panel. Opening it closes the table properties panel and the theme builder, and it does not open while you are editing a table cell or a memo.

The toolbar button right after `Search` opens the [Find and Replace](./find-and-replace.md) panel rather than the palette.  
Opening the palette leaves that panel open, and `Esc` then closes only the palette. `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) pressed in the palette closes it and opens the panel — see [Opening and Closing](./find-and-replace.md#opening-and-closing).  
A host embedding the editor can bind Quick Search to another key, which the `Search` tooltip then shows — see [Shortcuts](./settings.md#shortcuts).

![Opening the palette with ⌘ + K, then jumping to a table with #pay, to a column with @price, and to a table comment with :address](/img/demo-quick-search.webp)

## Searching and Navigating

Type to filter the list. Each keystroke searches the whole list in front of you afresh, so deleting characters, or typing a new word over one that found nothing, brings matching entries back.  
The match is fuzzy and covers both the name of an entry and the keywords shown beside it. Inside the `Import` submenu, for example, `sdl` finds `GraphQL`, `dbdiagram` finds `DBML`, and `azimutt` finds `AML`. A near typo still finds its entry, as `tabel` finds `New Table` and `imprt` finds `Import`, but an entry that only loosely resembles what you typed is left out: `memo` lists `New Memo` alone. An entry whose name or keywords contain what you typed, ignoring case, is always listed, and one the fuzzy match misses comes after the fuzzy matches. What you typed is highlighted wherever an entry contains it, ignoring case.  
Move through the list with `↑` and `↓` — it wraps at both ends — and run the highlighted entry with `Enter`. A command that has a shortcut of its own shows it on the right. While an input method is still composing, as in the middle of a Korean syllable, `↑`, `↓`, and `Enter` belong to it and neither move the highlight nor run an entry.

An entry such as `Database`, `Import`, or `Auto Layout` opens a submenu: its entries replace the list and the search box is cleared. Filtering only ever applies to the list in front of you, and there is no way back up a level, so close and reopen the palette to start over. Inside a submenu, `#`, `@`, `:`, and `?` are plain text, not [prefixes](#searching-the-diagram).

## What the Palette Lists

The list depends on the tab you are on. Every tab starts with `Tab`, which switches to `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Generator Code`, or `Settings`. The tab you are already on is left out, and `Generator Code` is the tab the toolbar labels `Code Generator`.

On the ERD tab: the database vendor, `Import` and `Export`, `New Table` and `New Memo`, the four relationship types, and `Auto Layout`. Tables are not listed here; type `#` to [go to one](#searching-the-diagram).  
These run the same commands as the canvas context menu, apart from `Diff Viewer`, which is context-menu only. `Export` here offers `json` and `Schema SQL` only, so export a PNG from the [canvas context menu](./file-import-export.md#exporting) instead.  
See [Importing or Exporting Files](./file-import-export.md) for what each format does, and [Table-related Functions](./table-related-functions.md#databases) for what the database choice affects.

On the Schema SQL tab: the database vendor again, and `Bracket`, which sets the quote character wrapped around table, column, constraint, and index names in the generated SQL — `SingleQuote`, `DoubleQuote`, `Backtick`, or `None` for no quoting at all.

On the Code Generator tab: the target language, `Table Name Case`, and `Column Name Case`. See [Code Generator](./code-generator.md) for what each target produces.

On the Visualization and Settings tabs, `Tab` is the only command apart from `Find and Replace`.

Every tab ends with `Find and Replace`, which shows its shortcut, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), on the right. Typing `find`, `replace`, or `rename` finds it.  
Running it closes the palette, switches to the ERD tab, and opens [Find and Replace](./find-and-replace.md#opening-and-closing), or puts the caret back in its Find field if the panel is already open. It is left out while the diff viewer, time travel, or the Auto Layout preview is open.

## Searching the Diagram

Start the search with a prefix to search the diagram rather than the commands: `#` for tables, `@` for columns, `:` for comments and memos, or `?` to list the prefixes. A prefix works from any tab. It counts only as the first character, ignoring spaces before it. A space after it is optional, so `#users` and `# users` are the same search, and the full-width `＃`, `＠`, `：`, and `？` that a Japanese or Chinese input method types count as well.  
While the input is empty at the top level, a line under it shows the four prefixes; click one to type it. While a prefix is in effect, the right end of the input names its scope: `Tables`, `Columns`, `Comments & memos`, or `Help`. Delete the prefix to get the commands back.

`#` lists the tables, each with `Table` beside it, and a table with a blank name is listed as `unnamed`. With nothing after `#`, they are sorted by name. Text after `#` is matched against table names alone, fuzzily as above, and tables whose name contains it come first.

`@` lists columns by name, each with where it is beside it, such as `users.email · Column`. Text after `@` has to appear in the column name, ignoring case; this match is not fuzzy. Text before the first `.` narrows the search to the tables whose name contains it: `@users.em` lists the columns containing `em` in tables whose name contains `users`, `@users.` lists the columns of those tables, and `@.em` searches every table. With nothing after `@`, the columns are listed unfiltered.

`:` lists table comments, column comments, and memos, never names. Each row shows an excerpt of the text around the match, with `users · Table comment`, `users.email · Column comment`, or `Memo` beside it. Text after `:` has to appear in the comment or memo, ignoring case, as with `@`. With nothing after `:`, the comments and memos that are not empty are listed.

`@` and `:` list their rows in the order the document holds them: table by table, each table's comment before its columns in column order, and memos last.

`?` lists `Tables`, `Columns`, and `Comments & memos`, and text after `?` filters them. Choosing one replaces the input with its prefix and leaves the palette open.

A prefix whose search finds nothing leaves the list empty, with no message.

Choosing a table, column, comment, or memo closes the palette and switches to the ERD tab if you are on another one.  
A table is scrolled near the top-left corner of the canvas, or just right of an open Find and Replace panel, then selected alone and brought to the front, with its name focused unless the focus was already in that table.  
A column, comment, or memo is shown the way Find and Replace [goes to a match](./find-and-replace.md#going-to-a-match): the canvas scrolls only when the table, the column's row, or the memo is not already wholly in view. Then a memo is selected alone and brought to the front, and a table is selected alone, brought to the front, and focused on the cell that holds the text, or on the name beside a comment that a [table view option](./table-related-functions.md#table-view-options) hides.  
No jump starts or finishes a relationship being drawn.

A prefixed list shows at most 100 rows. When that limit leaves out a match that contains your text as typed, one more row follows those 100: `Show all N matches in Find and Replace`, or `Show 1 match in Find and Replace`. Choosing it opens Find and Replace on the same text, with only that prefix's kinds of text turned on. `@table.column` hands over the column part alone, so the panel, and N, cover the columns of every table — see [From Quick Search](./find-and-replace.md#from-quick-search).  
With nothing typed after the prefix, or after the `.` of `@table.`, the list stops at 100 rows and offers no such row.  
For `Match Case`, `Match Whole Word`, or `Use Regular Expression`, or to replace text, use [Find and Replace](./find-and-replace.md) directly.

## When No Command Matches

At the top level, with no prefix, if no listed command contains what you typed, ignoring case, three rows follow the commands: `Search tables for "…"`, `Search columns for "…"`, and `Search comments & memos for "…"`, each with its prefix as the icon. Choosing one types that prefix before your text, so `users` becomes `#users`, and the palette stays open on those results.  
If the search finds no command at all, `No commands match` appears above the list, which then holds only the three rows. If it finds only commands that do not contain the text, they come first: on the ERD tab, `tables` lists `New Table` and `Database` before the three rows.  
Inside a submenu, a search that finds nothing leaves the list empty, with no message.

## Searching in Korean

A search that contains Hangul also matches by its letters, in the commands, in submenus, and under every prefix.  
Each step a Korean input method passes through keeps finding the row you are typing toward, so `ㅅ`, `사`, `상`, `사요`, and `사용` all find `사용자`. A search made only of initial consonants matches the initial consonants of the syllables, with spaces skipped: `ㅅㅇㅈ` finds `사용자`, and `ㅈㅁ` finds `주문 내역`. A consonant cluster that a Windows input method composes from two initials typed in a row, such as `ㅄ`, counts as the two (`ㅂㅅ`), while a double consonant such as `ㄲ` stays one letter. Text stored decomposed, as macOS file names are, matches as if it were composed.  
Rows whose whole text spells the search, letter by letter or initial by initial, come first, then rows starting with it, then rows containing it. Under `@` and `:`, rows that contain the search as typed come before all of these, in document order. The highlight covers whole syllables, so `상` lights `사용` in `사용자`.  
Find and Replace matches text only as typed, so rows found by their letters alone, as `ㅅㅇㅈ` and `사요` find `사용자`, never bring up a `Show all … in Find and Replace` row.
