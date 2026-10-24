---
sidebar_position: 14
description: Keep the diagram's domains, words, and terms on the Dictionary tab, derive physical names from logical names, let a domain set its columns' data type, read what the Checks sheet finds, edit and sort the sheets as in a spreadsheet, and import and export them as CSV files.
---

# Dictionary

The Dictionary tab holds the diagram's naming standard in three dictionaries, each on a sheet you edit like a spreadsheet:

- `Domains`: named data types, such as `Name` for `VARCHAR(100)`. A column linked to a domain holds its data type.
- `Words`: the standard words logical names are made of, each with the abbreviation a physical name uses for it, such as `Customer` and `CUST`.
- `Terms`: whole logical names, each with the physical name and the domain it gives, such as `Customer Name` with `CUST_NM`.

A table's or a column's [logical name](./logical-names.md) derives its physical name from these dictionaries, and a column's term can also link it to a domain — see [Deriving Physical Names](#deriving-physical-names).  
A fourth sheet, `Checks`, lists what the dictionaries find wrong in the diagram's names and types and in the dictionaries themselves, such as a forbidden word in a logical name — see [The Checks Sheet](#the-checks-sheet).

## Opening the Tab

Switch to the `Dictionary` tab in the toolbar, the button with a book icon between `Code Generator` and `Settings`, or choose `Dictionary` under `Tab` in [Quick Search](./quick-search.md).  
It can be the tab the diagram opens on — see `Canvas Type` in [Lock](./settings.md#lock).

The tab opens on the `Domains` sheet until you pick another.  
Each time it opens, the sheet comes back with the selection and the scroll you left, or with its first cell selected on a first visit. Its grid takes the keyboard, so typing or the arrow keys act at once.

The sheet shown, and each sheet's search, selection, scroll, and column widths, are yours alone.  
None of it is saved in the file, recorded in the undo history, or shared with collaborators. It is kept while the editor stays open, across tab switches and across documents loaded into the same editor.

## The Sheets

The bar across the top holds the four sheet buttons, `Domains`, `Words`, `Terms`, and `Checks`, and the button of the sheet shown looks pressed. Each shows a count beside its name: the rows its sheet holds, whatever the search shows, or on `Checks` the number of checks, colored by their level — see [The Checks Sheet](#the-checks-sheet).  
The search field comes next — see [Searching](#searching). At the bar's end, on `Domains`, `Words`, and `Terms` and not in a read-only editor, come four tools: `Add Row`, `Delete Rows`, `Import CSV`, and `Export CSV` — see [Adding and Deleting Rows](#adding-and-deleting-rows) and [Importing and Exporting CSV](#importing-and-exporting-csv).  
In a narrow pane or a long display language, the bar wraps onto more lines, so every button stays in reach.

Under the grid, a status line counts the rows the search leaves, as in `4 rows`, and, while the selection covers any row, how many it covers, as in `1 selected`. A row two ranges share counts once, so that number is how many rows `Delete Rows` would remove.  
Row numbers down the left count the rows as the sheet shows them, from 1. A read-only cell, which is every cell on `Checks` and every cell in a read-only editor, is drawn on a gray fill, except where a check marks it.  
An empty `Domains`, `Words`, or `Terms` sheet reads `Import a CSV file or add a row`, except in a read-only editor.

Each sheet's columns, in order:

| Sheet | Columns |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

What the cells do:

- A domain's `Data Type` is written as a column type, such as `VARCHAR(100)` or `NUMERIC(15,2)`, and every column linked to the domain holds it — see [Domains and Data Types](#domains-and-data-types).
- A word's `Abbreviation` is what a physical name uses for the word — see [From the Words](#from-the-words).
- A word's `Synonyms` and `Forbidden Words` list other words for the same thing, separated by commas. Each item is trimmed, an empty item is dropped, and an item equal to the word itself is ignored. A logical name that uses one composes no physical name, and the `Checks` sheet flags it and names the word to use instead — see [What Each Check Finds](#what-each-check-finds).
- A term's `Term` is a whole logical name, and its `Physical Name` is the name that logical name gives — see [From a Term](#from-a-term).
- A term's `Domain` shows the name of the domain it links, and is empty while it links none or links a domain since removed — see [A Term's Domain](#a-terms-domain).
- `Category`, `English Name`, each `Description`, and a term's `Synonyms` are notes. They change nothing, and no check reads them.

In a [right-to-left display language](./language-and-theme.md#right-to-left-languages), the bar, the grid's menu, and the status line are mirrored, while the sheets and a term's domain list stay left to right.

## Deriving Physical Names

The dictionaries can give a table or a column its physical name, the name Schema SQL and the Code Generator write, from its logical name. A term whose `Term` is the logical name is looked for first; otherwise the name is composed from the words' abbreviations.  
For example, with the words `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`), and `Date` (`DT`), and the term `Customer Number` with the physical name `CUST_NO` and the domain `Number`, whose data type is `INT`:

- The logical name `Customer Number` names a column `CUST_NO`, links it to `Number`, and gives it the type `INT`.
- `Order Date` composes `ORD_DT`.
- A table with the logical name `Customer` is named `CUST`.

With an empty `Words` sheet and an empty `Terms` sheet, nothing is derived.

### When a Name Is Derived

A physical name is derived as a logical name is written:

- On the canvas, when the logical name cell's editor closes on a logical name other than the one it opened with, by `Enter`, `Tab`, `Escape`, or a click elsewhere. Each key you type writes only the logical name — see [Writing a Logical Name](./logical-names.md#writing-a-logical-name).
- At once, when you pick a term from the list under the cell — see [Completing Term Names](./logical-names.md#completing-term-names).
- When a paste writes a logical name cell — see [Copying/Pasting Columns](./table-editing.md#copyingpasting-columns).
- When [Find and Replace](./find-and-replace.md#replacing) replaces a logical name, one match or all of them.
- When a coding agent sets a logical name.

It is derived only while the physical name is empty or was itself derived — see [Names of Your Own](#names-of-your-own).  
A term picked, a paste, or a replacement writes the logical name and what it derives as one undo step. On the canvas, the name derived as the editor closes is a step of its own after the typing: the first undo takes back the derived name, with the domain and type a term brought, and leaves the logical name you typed.

Nothing is derived again later on its own. A word's new `Abbreviation`, a term's new `Physical Name` or `Domain`, and new words or terms leave the names already derived as they are; use [Derive Physical Names Again](#derive-physical-names-again) for that. A domain's `Data Type` is the exception: it reaches its columns at once.

### From a Term

The `Terms` sheet is searched first for a term whose `Term` equals the logical name. Spaces at either end and the Unicode composition are ignored, but letter case counts, so `customer number` does not match `Customer Number`. Of two terms with one name, the first on the sheet counts.

- The term gives its `Physical Name`, or, while that is empty, the name its words compose, as below, if they compose one.
- For a column, the term also links its `Domain` while the `Domains` sheet lists it, which gives the column the domain's data type — see [Linking a Column](#linking-a-column). It does so even when the term gives no name. A term with no domain unlinks nothing.
- A table takes only the term's physical name.

### From the Words

With no matching term, the words compose the name:

1. The logical name is cut at spaces, `_`, `-`, `·`, and `/`, and no word reaches across a cut.
2. Each piece is read from the left, taking at each point the longest text the `Words` sheet lists, as a `Word`, a synonym, or a forbidden word, and never going back. With the words `가입`, `가입일`, and `일자`, `가입일자` reads as `가입일` and `자`, leaving `자` unregistered, while `가입 일자` reads as `가입` and `일자`. Letter case counts: `member` is not the word `Member`.
3. The physical name is each word's `Abbreviation` as typed, joined with `_`, such as `ORD_DT`. Of two words with one name, the first on the sheet gives the abbreviation. No length limit applies, and the Code Generator's `Table Name Case` and `Column Name Case` play no part.

It is all or nothing. If any stretch is a synonym, a forbidden word, or text no word lists, or a word has an empty `Abbreviation`, no name is composed, and the physical name stays as it is.

### Names of Your Own

The dictionaries fill a physical name only while it is empty or was itself filled by them. The editor remembers this for each table and column, though nothing on the canvas shows it.

- A name you write becomes your own: typing in a name cell, replacing a table or column name with Find and Replace, pasting over a column's name cell, and a coding agent's rename. A logical name written later leaves it as it is, writes only the logical name, and links no domain.
- Clearing the name gives it back to the dictionaries, since an empty name is always derived.
- A logical name that derives nothing leaves the physical name and its state as they were: an empty name stays empty, and a derived name keeps its name and stays the dictionaries'.
- A new table or column starts with an empty name, so its first logical name derives it. A foreign key column a relationship adds is named after its key and counts as your own — see [Foreign Key Column Names](./relationship-editing.md#foreign-key-column-names).
- The names a Schema SQL, GraphQL, DBML, or AML `Import` or `Import and Add` brings in, and the names of a diagram made by a release from before the Dictionary tab, count as your own, so a logical name written on them later derives nothing.
- A [duplicated table](./table-related-functions.md#duplicating-tables-and-memos), a column [moved into another table](./table-editing.md#rearranging-and-moving-columns) by its drag handle, a paste of copied tables, and a JSON file's `Import and Add` keep each name's state. Columns pasted into selected tables as new columns count as your own, unless the pasted name is empty and their logical name derives one.
- [Derive Physical Names Again](#derive-physical-names-again) gives a name of your own back to the dictionaries, an imported one included.

### Two Columns, One Name

A column derives nothing when another column of its table already has the name it would derive. It keeps its name, its state, and its domain link, and only its logical name is written. The names are compared ignoring letter case and spaces at either end, as foreign key column names are.  
When one change would give two columns the same name, as `Replace All` or `Derive Physical Names Again` over a table can, the first in the table takes it.  
For example, a self-reference on `members` keyed by `MBR_NO` adds `MBR_NO_2`, which copies the logical name `Member Number`. `Derive Physical Names Again` would name it `MBR_NO`, which the key holds, so it keeps `MBR_NO_2`.  
Tables have no such rule: two tables can derive the same name.

## Derive Physical Names Again

Use `Derive Physical Names Again` after changing a word's `Abbreviation` or a term's `Physical Name` or `Domain`, since those changes rename nothing on their own. It gives the names it covers back to the dictionaries and derives them again by the rules above, names you wrote yourself included. It is offered on the ERD tab only, and not in a read-only editor:

- The table context menu, right after `Focus on this table` or `Focus on selected tables`. While the table is one of two or more selected tables, `Derive Physical Names Again` covers all of them, wherever on the table you right-click. Otherwise, a right-click on a column's row gives `Derive Physical Name Again`, for that column alone, and one on the header gives `Derive Physical Names Again`, for the table's name and every column.
- The canvas context menu, right after `Name View`: `Derive Physical Names Again`, for every table and column in the diagram. It is left out while the diagram has no table.
- [Quick Search](./quick-search.md#what-the-palette-lists), as rows for the focused column, the focused table, the selected tables, and the whole diagram.

![Changing Number's abbreviation from NO to NUM on the Words sheet, the physical names staying MBR_NO and PAY_NO on the diagram, then Derive Physical Names Again from the canvas menu turning them into MBR_NUM and PAY_NUM while ORD_NO, which its term gives, stays](/img/demo-derive-physical-names.webp)

Each covered table and column that has a logical name is derived again. A column also takes the domain its term gives, and with it the domain's type, which spreads along the relationships while [Relationship DataType Sync](./settings.md#relationship-datatype-sync) is on.  
It leaves alone a table or column with no logical name, and a column whose new name another column of its table holds — see [Two Columns, One Name](#two-columns-one-name). Each of these keeps its name and its state, your own or the dictionaries', and a column also keeps its domain link.  
A logical name that derives nothing now leaves the physical name as it is, but gives it back to the dictionaries, so the next logical name you write derives it.  
It is one undo step, however many names, links, and types it changes. It records no step only when it changes nothing, and giving a name of your own back to the dictionaries counts as a change, even when the name already holds what they give.

A term's own `Physical Name` is not composed again from changed words, so edit the term before deriving again.

## Domains and Data Types

A column linked to a domain holds the domain's `Data Type`. Linking a column gives it that type at once.  
When a domain's `Data Type` changes, whether edited, pasted, or imported on the `Domains` sheet or changed by a collaborator or a coding agent, every column linked to it takes the new type in the same step. While [Relationship DataType Sync](./settings.md#relationship-datatype-sync) is on, each of those changes goes on along the relationships as a typed change does; while it is off, only the linked columns change.  
Renaming a domain changes only the name the columns' Domain cells show.

A type change made on the `Domains` sheet is undone there, together with the column types it gave — see [Dictionary Sheets](./undo-redo.md#dictionary-sheets).  
An undo or redo on the ERD tab that links a column to a domain again, or brings back a column linked to one, gives the column the domain's type as it stands now. One that puts back another type unlinks the column.

### Linking a Column

A column is linked to a domain by:

- Picking the domain in the column's Domain cell, which View Option → `Domain` shows, or, in `Logical Names`, in the type cell that stands for it — see [The Domain Cell](./logical-names.md#the-domain-cell).
- A logical name whose term gives a domain — see [From a Term](#from-a-term). This happens only while the name is derived, so not for a name of your own or for a column whose derived name another column holds.
- `Derive Physical Name Again` or `Derive Physical Names Again`, which links the domain of each covered column's term.
- A relationship: a foreign key column copies its key's domain, along with its type and logical name — see [Identifying Relationships](./relationship-editing.md#identifying-relationships). A key whose copy gets another type, as a serial key's does, hands on no domain.
- Duplicating its table, or moving it into another table by its drag handle, both of which keep the link. A paste of copied tables or columns keeps it only while this diagram lists the domain and the domain still has the copied column's type, so a copy from another diagram lands unlinked — see [Copying/Pasting Tables and Memos](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` links no column.
- A domain's name pasted into a Domain cell — see [Copying/Pasting Columns](./table-editing.md#copyingpasting-columns).

### Unlinking

- Typing a type into a linked column's `DataType` cell, or accepting a suggestion, unlinks the column as soon as its type differs from its domain's, and the column keeps the type you typed — see [DataType Autocomplete](./table-editing.md#datatype-autocomplete). Typing the domain's type back does not link it again; pick the domain in its Domain cell instead. A paste over the `DataType` cell and a coding agent's type change unlink the same way.
- While Relationship DataType Sync is on, every column a type change reaches whose new type differs from its own domain's is unlinked in the same step, such as a foreign key linked to a domain of its own. [Map Columns](./relationship-editing.md#map-columns) unlinks the columns it retypes the same way.
- `None` in the Domain cell unlinks the column and keeps its type.
- Changing or clearing a term's `Domain`, or removing a term, changes no column.

### Removing a Domain

Removing a domain's row leaves its columns at their types, and their links stay. The columns show no domain, and the `Checks` sheet lists `Unknown domain` for each of them while the `Domains` sheet still holds a domain. Undoing the removal on the `Domains` sheet shows the links again.  
While the domain is gone, typing a type other than the domain's into such a column unlinks it for good, and so does `None` in its Domain cell.  
The file leaves those links out when it is saved, so the diagram reopens with those columns unlinked.

A term linked to a removed domain shows an empty `Domain` cell, marked as an `Unknown domain`. `Delete` or `Backspace` on the cell unlinks it — see [A Term's Domain](#a-terms-domain).

## The Checks Sheet

The `Checks` sheet lists what the dictionaries' checks find in the dictionaries and in the diagram's tables and columns. The checks only read: they change nothing.  
Each check runs only while the sheet it reads holds a row, and the word checks only while the `Words` sheet holds a word with a name, so a diagram with empty dictionaries lists nothing.

![Customer Num drawn red and Order Stat amber in Logical Names, the Checks sheet listing their three checks with a red count, a double-click on the Forbidden word row going back to Customer Num on the diagram, and retyping it as Member Number, which leaves one check](/img/demo-dictionary-checks.webp)

Its three columns are read-only:

- `Type` names the check — see [What Each Check Finds](#what-each-check-finds).
- `Target` names a word, term, or domain by its name, a table by its name, and a column as `table.column`, the table and column named as the [Name View](./logical-names.md#beyond-the-canvas) names them, with `unnamed` where the view shows no name.
- `Detail` shows what the check found and, after `→`, what the dictionaries offer instead, several joined by commas, such as `멤버 → 회원`. An empty side reads `—`, as in `— → NUMERIC(15)`.

The words' checks come first, then the terms' and the domains', then table by table, each table followed by its columns.  
The list follows every edit as it lands, a collaborator's and a coding agent's included, and every Name View switch.  
The `Checks` button's count is red while any check is an error, amber while every one is a warning, and muted at none.

The rows cannot be edited, added, deleted, sorted, imported, or exported: the bar shows no tools, a right-click opens no grid menu, and Undo and Redo do nothing. Searching, selecting, and copying work as on the other sheets.

`Enter` or a double-click on a row goes to what it names:

- A word, term, or domain: the tab shows its sheet with the cell the check reads selected, the name or a term's `Domain`, and its row first in view. The sheet's search is cleared if it hides the row. A row since removed goes nowhere.
- A table or a column: the ERD tab comes up with the table selected alone and the cell the check reads focused. That is the name, the logical name, or the Domain cell, or, where the row does not draw that cell, the cell drawn in its place. The canvas takes the keyboard, and the view moves by the rule in [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands).

A double-click on a header, a column edge, a scrollbar, or below the rows goes nowhere.  
A coding agent lists the same checks, in the same order, with `erd_list_checks` — see [Dictionary Checks](../../mcp/tools.md#dictionary-checks).

The other three sheets mark the cells the checks read, a name or a term's `Domain`, in red or amber text on a tinted fill:

- Red: a name another row of its sheet has, a term's `Domain` linking a removed domain, and a `Term` that uses a forbidden word.
- Amber: a `Term` that uses a synonym or an unregistered word.

A cell takes the louder of its levels. The marks show in a read-only editor too, and the `Checks` sheet itself is not colored. For the marks on the ERD canvas, see [Marks on the Canvas](#marks-on-the-canvas).

### What Each Check Finds

| `Type` | Level | Finds | `Detail`, for example |
| --- | --- | --- | --- |
| `Duplicate name` | Error | A `Word`, `Term`, or `Domain` that another row of the same sheet also has. Each of the rows is listed. | `Member` |
| `Unknown domain` | Error | A column or a term still linked to a removed domain, while the `Domains` sheet holds a domain | The removed domain's name |
| `Forbidden word` | Error | A stretch of a logical name or of a `Term` that a word lists in its `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Warning | A stretch of a table's or a column's logical name, or of a `Term`, that no word lists | `자` |
| `Synonym` | Warning | A stretch that a word lists in its `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Warning | A table or a column whose logical name matches a term but whose physical name is not the one the term gives | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Warning | A column whose `DataType` is not the `Data Type` of the domain it links | `INT → NUMERIC(15)` |

- Names are compared trimmed, with letter case counting, so `Member` and `member` are two names, and an empty name is never a duplicate. The sheets refuse an edit that would give two rows one name, so `Duplicate name` shows up only where two edits crossed, such as two collaborators naming rows at once, or in a file edited elsewhere.
- The word checks read a name as [From the Words](#from-the-words) does, and list each different stretch once per name. `Forbidden word` and `Synonym` offer the word that lists the stretch.
- `Physical name mismatch` compares the name, trimmed, with the term's `Physical Name`, or with what its words compose while it has none, and says nothing while the term gives no name. A foreign key column that copied its key's logical name shows it whenever its own name differs from the term's, such as `members_id → MBR_ID`. `Derive Physical Name Again` fixes it, unless another column holds that name.
- `Domain type mismatch` never results from edits in one editor, since a linked column always ends at its domain's type. It can come when a collaborator links a column while another changes that domain's type, or in a file written elsewhere. Picking the domain again in the column's Domain cell gives the column its type, and `None` unlinks it. A link to a removed domain shows only as `Unknown domain`.

### Marks on the Canvas

The ERD canvas writes a name the checks flag in its check's color:

- A logical name cell, in the table header or in a column's row, is red while its logical name uses a forbidden word, and otherwise amber while it uses a synonym or a word the `Words` sheet lacks.
- A physical name cell, in the header or in a row, is amber while the term its logical name matches gives another physical name.

Only those two kinds of cell are marked, never the Domain or `DataType` cell, so a column's `Unknown domain` and `Domain type mismatch` show on the `Checks` sheet alone.  
A cell is marked only for what it draws: `Physical Names` can mark only physical names, `Logical Names` only logical names, and `Both Names` each cell by its own checks — see [Name View](./logical-names.md#name-view). A blank cell keeps its placeholder color, and empty dictionaries mark nothing.  
On the header of a table in a colored [table group](./table-groups.md), a mark keeps its color only while it stays readable on the group's color; otherwise the name takes the header's own black or white.

The marks show on the ERD canvas, in [Time Travel](./undo-redo.md#time-travel), and in the [Auto Layout](./table-related-functions.md#auto-layout) preview, in a read-only editor too. The Visualization tab, the two sides of the [Diff Viewer](./table-related-functions.md#diff-viewer), and an exported image draw none.  
They follow every change as it happens, whether to a name or to a word, term, or domain.

## Searching

The search field reads `Search` and shows on all four sheets, in a read-only editor too. Each sheet has its own search.  
A row matches when one of the cells searched holds the text, ignoring letter case, the Unicode composition, and spaces around the search. A match never runs across two cells. The cells searched:

- `Domains`: `Domain`, `Data Type`, and `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name`, and `Description`.
- `Terms`: `Term`, `Physical Name`, and `Description`.
- `Checks`: all three, as they read in the display language.

A new search puts the selection on the first cell and scrolls to the top.  
While the field holds text, an `x` button with the tooltip `Clear search` empties it and leaves the caret in the field. `Escape` in the field empties it too.  
In the field, `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac) undoes your typing, not the sheet, and the row keys of [Adding and Deleting Rows](#adding-and-deleting-rows) are text keys.  
`Add Row` and the inserts clear the search first, since an empty row matches no search. An import keeps it.

## Selecting and Moving

The grid selects as a spreadsheet does:

- A click selects a cell, and a drag selects a range, scrolling at the sheet's edge. `Shift + click` extends the selection from the active cell, and `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac) adds another range.
- A column header selects its column, a row number its row, and the top-left corner every cell, as `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac) does.
- On a Mac, `Ctrl + click` is a right-click — see [The Grid's Menu](#the-grids-menu).

With the keyboard:

- The arrow keys move one cell, and with `Ctrl` (Windows/Linux) or `⌘` (Mac) held go to the sheet's edge that way.
- `Home` and `End` go to the row's first and last cell, and with `Ctrl` or `⌘` held to the sheet's first and last cell.
- `Page Up` and `Page Down` move a screen of rows.
- Holding `Shift` with any of the keys above extends the selection instead.
- `Tab` and `Shift + Tab` move right and left, and `Shift + Enter` moves up. `Enter` alone edits the cell — see [Editing Cells](#editing-cells).

When rows go away under the selection, by an undo or a collaborator's removal, it is pulled back inside the rows left.

Drag a column header's right edge to resize the column, or double-click the edge to fit the column to the widest text in the rows in view. No key resizes a column.

## Editing Cells

Typing on the selected cell replaces its value. `Enter`, `F2`, or a double-click edits the value as it stands, with the caret at its end.  
A cell holds one line, so a tab or a line break pasted into it becomes a space.

- `Enter` writes the edit and moves down, and `Tab` writes it and moves right. With `Shift`, they move up or left.
- A click elsewhere, or the keyboard leaving the grid, writes it too.
- `Escape` cancels it.

![Editing the Words sheet: typing NUM over a cell and pressing Enter, inserting a row with ⌥ + Enter and filling it with Tab, sorting by Word from the grid's menu, then searching for ord and emptying the search with Esc](/img/demo-dictionary-editing.webp)

An edit that leaves the value as it was writes nothing, and a written edit is one undo step of its sheet, however much it typed.  
`Delete` or `Backspace`, with no edit open, empties every selected cell, as one step.  
While an edit is open, the undo and redo keys undo and redo your typing in the cell, and the row keys type as text — see [Keys on the Tab](#keys-on-the-tab).  
Every cell on `Checks`, and every cell in a read-only editor, is read-only and opens no edit.

When any row of an edit, a paste, or a clear is refused, nothing of it is saved, and an error toast says why, counting the rows and naming the first three:

- A name that another row of the sheet has, or that another row of the same paste writes: `Nothing saved: 1 row shares a name with another row (Member)`, or `Nothing saved: 2 rows share a name with another row (…)`. Names are compared trimmed, with letter case counting, so `Member` and `member` differ. An empty name is never refused.
- A term's `Domain` given as text that no domain on the `Domains` sheet has: `Nothing saved: 1 row names an unknown domain (…)`.
- A row a collaborator removed while you edited it: `Nothing saved: the row was removed`.

A write can reach beyond its cell:

- A term given a `Term` while its `Physical Name` is empty gets the name its words compose, when they compose one — see [From the Words](#from-the-words). This happens once: the name is not composed again when the words change later.
- A domain's new `Data Type` retypes every column linked to the domain, in the same undo step — see [Domains and Data Types](#domains-and-data-types).

### A Term's Domain

`Enter`, `F2`, or a double-click on a term's `Domain` cell opens a list under the cell, or above it where there is more room, with a search field reading `Domain`.  
The list holds `None`, then every named domain in the `Domains` sheet's order, and the highlight starts on the domain the term links, or on `None`. Typing a character on the cell opens the list already searched by it.

- Typing narrows the list to the domains whose names hold the text, ignoring case, drops `None`, and highlights the first match.
- `↑` and `↓` move the highlight, wrapping round at both ends.
- `Enter` or `Tab` picks the highlighted row, and a click the row clicked, as one undo step. The term links the very domain picked, even one of two domains with one name, and `None` unlinks it.
- `Escape` or a click outside closes the list without writing anything typed.

With no named domain on the `Domains` sheet, the field opens with no list.  
Pasted text links the first domain listed with that name, empty text unlinks, and text equal to what the cell shows keeps the link as it is. Any other name is refused — see [Editing Cells](#editing-cells). `Delete` or `Backspace` on the cell unlinks the term, even from a removed domain.

## Copying and Pasting

`Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac) copies the selection as tab-separated text, a line per row, the way spreadsheets write it, so it pastes into a spreadsheet as cells. A tab or a line break inside a value becomes a space.  
Several ranges copy together only when they cover the same rows, side by side, or the same columns, one above another. Otherwise nothing is copied, and the error toast `Nothing copied: the ranges share no rows or columns` appears.

`Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac) pastes tab-separated text, such as cells copied from a spreadsheet, from the active cell down and to the right:

- Quotes are pasted as text, so a spreadsheet cell holding a line break does not paste as one cell.
- A single value fills every selected range.
- Rows past the last row are added as new rows, in order, so pasting into an empty sheet fills it.
- Columns past the last column are left out, and once the rest is saved the toast `Columns past the last one weren't pasted` says so.
- A paste of several cells then selects the block it wrote.

A paste is one undo step, rows it adds included, and is refused as a whole over a duplicate name or an unknown domain — see [Editing Cells](#editing-cells).  
A copy, a paste, or a clear over more than a million cells does nothing, and the error toast `Nothing done: the selection covers too many cells` appears.  
Cut, `Ctrl + X` (Windows/Linux) or `⌘ + X` (Mac), does nothing on a sheet. Copying and pasting on this tab never reach the diagram, and while a cell edit is open they act on the text in the cell.

## Adding and Deleting Rows

`Add Row` adds one empty row at the end of the sheet. It clears the search, selects the new row's first cell, and gives the grid the keyboard, so typing fills that cell.  
`Delete Rows` removes every row the selection covers, in any column, and one undo puts them all back in their places. Its tooltip names the key that does the same.

With the keyboard in the grid and no cell being edited:

- `Alt + Enter` (Windows/Linux) or `⌥ + Enter` (Mac) inserts as many empty rows below the selection as it covers.
- `Alt + Shift + Enter` (Windows/Linux) or `⌥ + Shift + Enter` (Mac) inserts them above.
- `Alt + Backspace` or `Alt + Delete` (Windows/Linux), or `⌥ + Backspace` or `⌥ + Delete` (Mac), deletes the rows the selection covers.

They do what the grid menu's insert and delete rows do — see [The Grid's Menu](#the-grids-menu). An insert clears the search and puts the new rows right above the first row the selection covers, or right below its last. It selects them in the first column, the first of them active, and is one undo step.

These keys are the `Add Column` and `Remove Column` bindings of the [Shortcuts](./settings.md#shortcuts) tab, so a host that rebinds those with [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) moves them too. `Alt + Shift + Enter` is the `Add Column` key with `Shift` added, and has no row of its own there.  
In an open edit and in the search field they are text keys, so on a Mac `⌥ + Backspace` deletes a word. On `Checks` and in a read-only editor they do nothing. On this tab they never add or remove a table's column.  
In Obsidian they reach the tab even where an Obsidian hotkey uses the same key.

A row never filled in, or one emptied of every value, shows on its sheet and reaches collaborators, but the file leaves it out, so it is gone when the diagram is opened again.

## The Grid's Menu

Right-click a cell on `Domains`, `Words`, or `Terms` to open the grid's menu. A cell outside the selection becomes the selection first.  
A right-click below the last row or right of the last column opens it on the selection as it stands, so an empty sheet opens it anywhere under the headers. The menu key or `Shift + F10` opens it for the active cell.

- `Insert 1 row above`, `Insert 1 row below`, and `Delete 1 row`, each counting the rows the selection covers, as in `Insert 3 rows above`, with its key on the right — see [Adding and Deleting Rows](#adding-and-deleting-rows).
- `Sort by <column>, ascending` and `Sort by <column>, descending`, naming the column you right-clicked, as in `Sort by Word, ascending` — see [Sorting](#sorting). They are left out right of the last column.
- `Import CSV` and `Export CSV`, which do what the bar's buttons do — see [Importing and Exporting CSV](#importing-and-exporting-csv).

With no row showing, on an empty sheet or under a search that matches nothing, only `Insert 1 row below`, `Import CSV`, and `Export CSV` show.  
`Checks` and a read-only editor open the browser's own menu instead, and so does a right-click on a header or a scrollbar.  
The menu closes on a pick, on `Escape`, on a press elsewhere in the tab, when the selection or the sheet changes, and when the sheet's rows change, by your edit or a collaborator's.

## Sorting

`Sort by <column>, ascending` and `Sort by <column>, descending` reorder the sheet's rows themselves, not only the view. The new order is saved in the file, seen by collaborators, and followed by `Export CSV`, and one undo puts the old order back.  
Rows compare by the text the cell shows, a term's `Domain` by the domain's name, in the display language's alphabetical order, with numbers compared by value, so `2` comes before `10`. Empty cells go last either way, and rows that compare equal keep their order. Sorting a sheet already in that order records nothing.  
The search stays as it was, and so does the selection, whose cells now hold other rows.

## Importing and Exporting CSV

Each of `Domains`, `Words`, and `Terms` comes in from a CSV file and goes out to one. These files are the Dictionary tab's own: the canvas context menu's `Import` and `Export` neither read nor write them — see [Importing or Exporting Files](./file-import-export.md).

### Importing

`Import CSV`, on the bar or in the grid's menu, opens the browser's own file picker for `.csv` files, not the host's import dialog. Picking the same file again imports it again.  
The file goes into the dictionary its header names, whichever sheet shows, and the tab then shows that sheet and gives its grid the keyboard. The sheet keeps its search, selection, and scroll, so rows the search hides, or rows added below the view, stay out of sight.  
The file is read as UTF-8, with or without a byte order mark, or as EUC-KR when it is not valid UTF-8, as older public data standard files are.

![Opening the Dictionary tab from the toolbar, then importing domains, words and terms with Import CSV, each file switching the tab to its own sheet and reporting what it added](/img/demo-dictionary-import.webp)

How the rows land:

- Each row with a name updates the sheet's row of that name, in the fields the file has columns for. Columns the file lacks leave those fields as they are. Names are compared trimmed, with letter case counting.
- Names the sheet lacks are added after its last row, in the file's order.
- An import never removes a row.
- A row with an empty name is skipped. When the file holds a name twice, the later row wins and the earlier counts as skipped. Blank lines are not rows.
- A term's domain is found by its name, the first domain of that name, and a name no domain has leaves the term unlinked, so import the domains first.

One import is one undo step of that sheet.  
The toast then reads, for example, `1 added · 1 updated · 2 skipped`. A row the same as the sheet's counts as neither added nor updated, so importing the same file again changes nothing and records no step.  
While the file's terms name domains the diagram lacks, a second line names the first three, as in `4 unknown domains: 연월일, 금액, 번호`.  
A file whose header matches no layout, or two, brings nothing in, and the error toast `Couldn't read this file as words, terms or domains` appears.

### File Layouts

Each dictionary reads two layouts. The first is the editor's own, which `Export CSV` writes, with the field names as its header:

| Dictionary | Header | A file needs |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

The columns may come in any order, a term's `domain` holds the domain's name, and any other column is ignored. Letter case counts in the header, and the cells are read exactly as written, spaces included.

The second is the layout of the files of Korea's public data standard (공통표준):

| Dictionary | A file needs | Also read |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (abbreviation), `공통표준단어 영문명` (English name), `공통표준단어 설명` (description), `이음동의어 목록` (synonyms), `금칙어 목록` (forbidden words) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (physical name), `공통표준도메인명` (domain, by name), `공통표준용어설명` (description), `용어 이음동의어 목록` (synonyms) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (category), `공통표준도메인설명` (description), `데이터길이`, `데이터소수점길이` |

A domain's `데이터타입`, `데이터길이`, and `데이터소수점길이` join into one data type: `NUMERIC(15,2)`, `CHAR(8)`, the type alone where there is no length, such as `DATE`, and a scale of 0 left out, as in `NUMERIC(15)`.  
In these files the cells are trimmed, and other columns, such as the revision history, are ignored.  
In either layout, spaces in a header name do not matter.

### Exporting

`Export CSV`, on the bar or in the grid's menu, saves the sheet shown in the editor's own layout: every row in sheet order, whatever the search shows, with a term's domain written by its name, or left empty for a removed domain.  
The file is UTF-8 with a byte order mark and CRLF line ends, and only a field holding a quote, a comma, or a line break is quoted. It opens in a spreadsheet and imports back to the same rows.  
It is named `<database name>-<timestamp>-words.csv`, `-terms.csv`, or `-domains.csv`, and saved the way the editor's other exports are — see [Exporting](./file-import-export.md#exporting).

`Checks` has no export, and a read-only editor offers no import or export.

## Undo and Redo

`Domains`, `Words`, and `Terms` each keep an undo history of their own, apart from the diagram's. On this tab, `Ctrl + Z` and `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Z` and `⌘ + Shift + Z` (Mac), and the toolbar's `Undo` and `Redo`, act on the sheet shown, and the toolbar shows no `Time Travel`. On `Checks` they do nothing.  
The ERD tab's Undo never takes back a sheet's edit — see [Dictionary Sheets](./undo-redo.md#dictionary-sheets).

## Keys on the Tab

While the keyboard is in the tab, these editor shortcuts act — see [Shortcuts](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac), opens [Quick Search](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), switches to the ERD tab and opens the [Explorer](./explorer.md#opening-and-closing) on its search.
- `Undo` and `Redo` act on the sheet shown — see [Undo and Redo](#undo-and-redo).
- `Add Column` and `Remove Column` insert and delete rows — see [Adding and Deleting Rows](#adding-and-deleting-rows).

While a cell edit is open, a term's domain list included, `Search` and `Toggle Explorer` do nothing, so the text typed is not lost.

Every other editor shortcut stays in the tab and never reaches the canvas: `Alt + N` (Windows/Linux) or `⌥ + N` (Mac) adds no table, and `Delete` and `Backspace` delete nothing on the canvas.  
The grid's own keys act on the sheet instead: `Enter` edits the cell, `Delete` and `Backspace` clear the selected cells, `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac) selects every cell, and `Escape` cancels an edit, closes the grid's menu, or empties the search field. Copy, cut, and paste stay on the tab as well — see [Copying and Pasting](#copying-and-pasting).

## Read-only Editors

In a [`readonly`](../../api/erd-editor-element.md#readonly) editor the tab opens and shows every sheet.  
Switching sheets, searching, selecting, scrolling, resizing columns, and copying work as usual, and so does going to a check from `Checks` with `Enter` or a double-click. The checks' marks show too.

No cell takes an edit, a paste, or a clear, and every cell no check marks is drawn on the read-only fill.  
`Add Row`, `Delete Rows`, `Import CSV`, and `Export CSV` are hidden, the row keys do nothing, and a right-click opens the browser's menu. An empty sheet shows no hint, and the toolbar shows no `Undo` or `Redo`.

## Collaborators and the File

The diagram's file holds the words, terms, and domains in their sheet order, a sort's included, and leaves out a row that holds no value.  
It also holds each table's and column's logical name, whether each physical name is the dictionaries', and each column's domain link while the domain is listed. The checks and the marks are worked out from these and never saved.

In a [collaborative session](../../api/advanced/collaborative-editing.md), editors see each other's dictionary edits as they land, sorts and inserts included. Each keeps its own sheet, search, and selection, and its sheet histories hold only its own edits.  
An edit or a paste onto a row a collaborator removed meanwhile saves nothing, and the toast `Nothing saved: the row was removed` appears.  
An editor from a release before the Dictionary tab saves the diagram without its logical names, domain links, and dictionaries — see [Mixing Releases](../../api/advanced/collaborative-editing.md#mixing-releases).

A Schema SQL, GraphQL, DBML, or AML `Import` keeps the dictionaries, a JSON `Import` replaces them with the file's, and `Import and Add` brings in none — see [Importing External Files](./file-import-export.md#importing-external-files).  
A coding agent edits the words, terms, and domains, sets logical names and domains, derives physical names again, and lists the checks through the MCP server — see [Dictionaries](../../mcp/tools.md#dictionaries) and [Dictionary Checks](../../mcp/tools.md#dictionary-checks). It has no tool for CSV files.
