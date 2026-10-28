---
sidebar_position: 9
description: Browse the diagram's tables with their columns, indexes, and foreign keys, its table groups, and its memos in a tree docked beside the ERD canvas, and go to any of them with a click.
---

# Explorer

The Explorer is a panel docked at the left edge of the ERD canvas that lists the diagram as a tree: its tables, each with its columns, indexes, and foreign keys, then its [table groups](./table-groups.md), then its memos. Click a row to go to what it stands for on the canvas.  
The Explorer narrows the canvas rather than covering it. It is part of the diagram editor, not VS Code's Explorer view or Obsidian's file explorer.

![Opening the Explorer from the toolbar, going to products, then to the status column and member_id foreign key of orders, folding with Collapse All, widening the panel, and closing it](/img/demo-explorer.webp)

[Find and Replace](./find-and-replace.md) sits at its top, between its title bar and the tree. While the Find field holds text, the tree shows only what matches — see [The Results](./find-and-replace.md#the-results).  
The tree itself never changes the diagram: it has no rename, drag, delete, or show and hide. A replacement is the only edit the panel makes.

The Explorer's own state is yours alone: whether it is open, its width, its folding, the row the keyboard is on, where it is scrolled, and the search.  
None of it is saved in the file, recorded in the undo history, shared with collaborators, or stored in the browser. It is kept while the editor stays open, across tab switches and across documents loaded into the same editor. A newly opened editor starts with the Explorer closed.

## Opening and Closing

Open it with any of these:

- The toolbar's `Explorer` button, right after `Search`, with a tree icon. Its tooltip reads `Explorer (Ctrl + F)` (Windows/Linux) or `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), named `Toggle Explorer` on the [Shortcuts](./settings.md#shortcuts) tab of Settings.
- `Toggle Explorer` in [Quick Search](./quick-search.md), listed on every tab. Typing `find`, `replace`, `rename`, `tree`, `outline`, or `objects` brings it up.
- `Toggle Explorer` in the canvas context menu: right-click an empty spot on the ERD canvas, outside any [table group](./table-groups.md). It sits after `New Table`, `New Memo`, and `New Table Group`, before `Relationship`. A read-only editor's canvas menu has no such row — see [Read-only Editors](#read-only-editors).

The two `Toggle Explorer` entries show the shortcut on the right.  
The toolbar button, the shortcut, and the Quick Search entry work from every tab. From the Visualization, Schema SQL, Code Generator, Dictionary, or Settings tab they switch to the ERD tab first, since the Explorer shows only there.

The toolbar button only opens and closes the panel. It does not put the caret in the Find field, and it leaves Table Properties, the theme builder, and the `Display Language` picker open.  
The shortcut and the two `Toggle Explorer` entries open the Explorer on its search: the caret goes to the Find field with its text selected, and any of the five dialogs in [Dialogs Beside It](#dialogs-beside-it) closes. What the search keeps between openings is in [Opening and Closing](./find-and-replace.md#opening-and-closing) in Find and Replace.  
The shortcut does nothing while a table cell, a memo, or a table group's name is being edited, or while a cell edit is open on the [Dictionary](./dictionary.md#keys-on-the-tab) tab, a term's domain list included.

The toolbar button looks pressed while the Explorer is open on the ERD tab and not hidden by [zen mode](#when-it-stands-aside). While it does, the button, the shortcut, and either `Toggle Explorer` entry close the Explorer, and a keyboard that was in the panel goes back to the editor.  
The shortcut never closes it while Quick Search or one of the five dialogs is open. It closes the palette or the dialog instead and takes the keyboard to the Find field, with its text selected and, if the Explorer was already showing, the current match kept. The `Toggle Explorer` entry in Quick Search makes no such exception: running it closes the palette and then an open Explorer.

The `x` button in the title bar, whose tooltip reads `Close`, closes the Explorer too and gives the keyboard to the canvas. `Escape` does not close it — see [Keys in the Explorer](#keys-in-the-explorer).  
Reopened, the Explorer comes back at the same width, with the tree folded and scrolled as it was and the same query. Opened by the shortcut or a `Toggle Explorer` entry, it searches that query again with every result unfolded — see [The Results](./find-and-replace.md#the-results).

When the shortcut or a `Toggle Explorer` entry opens the Explorer in an editor too narrow for it, a toast reads `Widen the window to show the Explorer`, and the keyboard stays where it was — see [Beside the Canvas](#beside-the-canvas).  
The Explorer is open all the same, with the toolbar button pressed, and appears, already searched, once the editor is wide enough, without taking the keyboard. Opening it with the toolbar button shows no toast.

## Beside the Canvas

The Explorer runs down the left edge of the ERD tab, below the toolbar, for the full height of the canvas.  
The canvas narrows to make room for it, so no part of the diagram lies under the panel, and the [canvas toolbar](./table-related-functions.md#canvas-toolbar), the minimap, and the [welcome screen](./editing-start.md#welcome-screen) all sit in the canvas beside it.  
Opening, closing, or resizing the Explorer does not scroll the diagram and records nothing in the [undo history](./undo-redo.md#what-the-history-records).

It starts `260px` wide in a newly opened editor. Drag its right edge to set it anywhere from `200px` to `480px`, or double-click the edge to go back to `260px`.

The canvas always keeps at least `320px` beside the Explorer:

- In an editor narrower than the Explorer's width plus `320px`, the Explorer draws narrower to fit, down to `200px`.
- In an editor narrower than `520px`, it stands aside. It is not drawn, but it stays open, so the toolbar button still looks pressed and a press closes it. Once the editor is wide enough, it comes back at its own width.

What counts is the width of the editor itself, not of the browser window, even though the toast in [Opening and Closing](#opening-and-closing) speaks of the window.

In a [right-to-left display language](./language-and-theme.md#right-to-left-languages), the Explorer stays at the left of the canvas, since the canvas is never mirrored.  
Its contents read right to left: the title bar, the search, and the rows are mirrored, and rows indent from the right. The edge you drag stays on its right side, against the canvas. Data types, index columns, and foreign key text keep their left-to-right order.

## When It Stands Aside

The Explorer shows only on the ERD tab.  
Switching to another tab hides it, and the toolbar button no longer looks pressed. Back on the ERD tab it shows again as you left it, folded and scrolled the same way.

While the [diff viewer](./table-related-functions.md#diff-viewer), [time travel](./undo-redo.md#time-travel), or the [Auto Layout](./table-related-functions.md#auto-layout) preview is open, nothing opens or closes the Explorer:

- An open Explorer is hidden, and shows again once they close.
- The toolbar button is dimmed and does nothing.
- Quick Search leaves out `Toggle Explorer`.
- The shortcut is left to the browser or host — see [The Browser's Find Bar](./find-and-replace.md#the-browsers-find-bar).

The diff viewer lists its changes in a tree of the same kind — see [Diff Viewer](./table-related-functions.md#diff-viewer).

Turning on [zen mode](./table-related-functions.md#canvas-toolbar) with `Alt + Z` (Windows/Linux) or `⌥ + Z` (Mac) hides an open Explorer without closing it, and turning zen mode off brings the Explorer back.  
In zen mode the shortcut and the two `Toggle Explorer` entries still open the Explorer on its search, and zen mode stays on. The Explorer then runs the full height of the editor, since the top toolbar is gone, and stays shown when zen mode is turned off. Turning zen mode on again hides it again.

Whenever the panel goes away with the keyboard in it, whether closed, hidden, or stood aside, the keyboard goes back to the editor.

## The Tree

The title bar reads `Explorer` and holds two buttons: `Collapse All`, and the `x` that closes the Explorer. Below it is the search — see [Find and Replace](./find-and-replace.md) — and below that the tree.

The top level holds three folders, in this order: `Tables`, `Table Groups`, and `Memos`. Under each table are its own `Columns`, `Indexes`, and `Foreign Keys` folders.  
A folder with nothing in it is not shown, so an empty diagram shows no rows at all. `Table Groups` is also left out while [View Option](./table-related-functions.md#table-view-options) → `Table Groups` hides the groups, and `Memos` while View Option → `Memos` hides the memos.  
A folder row shows a folder icon, its name, and at the far end a count of the rows directly under it, so the count beside `Tables` is the number of tables in the diagram. The count groups its thousands as the display language does, always in the digits 0 to 9, such as `1,234` in English and `1.234` in German.

Tables are listed by name, ignoring case, and tables with the same name keep the document's order. Table groups are listed the same way, and so are the tables under each group. A table's columns keep the table's own order, and its indexes, its foreign keys, and the memos keep the document's.  
The tree follows the diagram as it changes, whether by an edit on the canvas, an undo or redo, an import, or a collaborator or a coding agent, so renaming a table moves its row.  
The order goes by name in every [Name View](./logical-names.md#name-view), never by logical name. Switching the view relabels the table and column rows without moving any of them, and so does giving a table or column a logical name in `Logical Names` or `Both Names`. A physical name [derived](./dictionary.md#deriving-physical-names) from a new logical name is a rename like any other, though, so it can move a table's row.

Each kind of row shows:

- A table: a table icon and its name.
- A column: a key icon for a primary key or foreign key column, colored as the table's own key cell colors a primary key, a foreign key, or both, and a list icon for any other column. Then its name and, muted, its data type followed by `PK`, `FK`, or both, such as `id` `BIGINT PK` or `user_id` `BIGINT FK`. The type it shows is always the column's data type, never its [domain](./logical-names.md#the-domain-cell), whatever the Name View.
- An index: an index icon and its name. Then, muted, `UNIQUE` for a unique index and its columns in parentheses in index order, with `DESC` after a descending one, such as `orders_user_idx` `UNIQUE (user_id DESC, total)`, or just `(total)`.
- A foreign key: listed only under the child table, the one holding the foreign key columns, and only while the parent table is in the diagram. Its key icon takes the connector's color: the primary key and foreign key color for an [identifying relationship](./relationship-editing.md#identifying-relationships), the foreign key color otherwise. It shows the child's key columns, comma-separated, then, muted, `→` with the parent table and its columns, such as `user_id` `→ users(id)`.
- A table group: a dot in the group's color, grey for a group with no color, and its name. Its tables are listed under it by name, and each goes to its table. A group with no tables has nothing to unfold.
- A memo: a sticky-note icon and the memo's first line.

Table rows, the tables listed under a group, and column rows follow the Name View — see [Beyond the Canvas](./logical-names.md#beyond-the-canvas). In `Both Names`, for example, a column row reads `Total Amount` `total` `NUMERIC`: the logical name, then the name and the data type, both muted.  
In every view, index and foreign key rows show their columns by name, and a foreign key row shows its parent table by name too.  
While the Find field holds text, a row found only in the name its view leaves out also shows that name, muted — see [The Results](./find-and-replace.md#the-results).

A blank name, or a memo whose first line is blank, reads `unnamed` in italics. In `Logical Names` and `Both Names`, a table or column reads `unnamed` only when its logical name is blank too.  
On a narrow panel, the muted text is cut short with `…` before the name the row leads with is. Hover a name or its muted text to see it in full.

Only `Tables` is unfolded at first. Click a folder row, or press `Enter` or `Space` on it, to fold or unfold it.  
The arrow at the start of a row folds or unfolds that row without going anywhere. Every table row has one, even a table with nothing under it. `→` and `←` fold and unfold too — see [Keys in the Explorer](#keys-in-the-explorer).  
`Collapse All` folds one level at each press: the deepest level of unfolded rows on show, so presses fold from the bottom up. The press that reaches the top level folds every row, those under an already folded row included, leaving only the top-level folders.  
Edits, undo and redo, and changes from collaborators or a coding agent leave the folding as it is.

## Going to a Row

Click a row, or press `Enter` or `Space` with the keyboard on it, to go to what it stands for on the ERD canvas. A folder row only folds or unfolds, and the arrow keys only move within the tree.

- A table row, or a table listed under a group, selects that table alone and brings it to the front. Unless the focused cell is already in that table, it goes to the first cell of the table's header: the name, or the logical name in `Logical Names` and `Both Names`.
- A column row selects its table alone and puts the focused cell on the column's name, or in `Logical Names` on the logical name drawn in its place.
- An index row selects its table, as a table row does. The index itself is not singled out; indexes are edited in [Table Properties](./table-related-functions.md#indexes).
- A foreign key row brings both tables of the relationship into view together, or the child table when the two are too far apart to show together. It selects the child table alone with its foreign key columns, the focused cell on the first of them, and lights the relationship's connector — see [Reading a Connector](./relationship-editing.md#reading-a-connector).
- A table group row brings the group's box into view by its title bar, selects the group alone, and brings it to the front with its tables.
- A memo row selects the memo alone and brings it to the front.

The view moves by the rule every go-to shares: the zoom never changes, and the canvas scrolls only when what you go to does not already show well — see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands).  
Going to a row closes Table Properties first if it is open, and never starts or finishes a relationship being drawn.  
While the Find field holds text, a row whose name or logical name holds a match, or one that shows an excerpt of a comment or memo, goes to its first match instead — see [Going to a Match](./find-and-replace.md#going-to-a-match).

After a click, the keyboard stays in the tree, so `Delete`, `Backspace`, and the other editing keys do not reach the new selection until you press `Escape` or click the canvas — see [Keys in the Explorer](#keys-in-the-explorer).

## Keys in the Explorer

The tree is one `Tab` stop, skipped while it has no rows.  
Tabbing into it lands on the row the keyboard was last on, or failing that on the current match's row, or on the first row wholly in view, and scrolls that row into view. The keyboard's row is drawn like a row under the pointer.

In the tree:

- `↑` and `↓` move one row, stopping at the first and the last row rather than wrapping. `Home` and `End` go to the first and the last row.
- `→` unfolds a folded row, or moves into an unfolded row's first child. `←` folds an unfolded row, or moves out to its parent. In a right-to-left display language the two swap.
- `Enter` and `Space` act as a click: they go to the row, or fold or unfold a folder — see [Going to a Row](#going-to-a-row).
- Typing a letter does not jump to a row.

`Escape` pressed anywhere in the Explorer, in the tree, in the Find or Replace field, or on one of its buttons, gives the keyboard back to the canvas. The Explorer stays open and the selection stays as it is.  
An `Escape` that ends an input-method composition only ends the composition. `Escape` never closes the Explorer, whether pressed in it or on the canvas.

A few editor shortcuts still work while the keyboard is in the Explorer — see [Shortcuts](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) works as it does on the canvas: it closes the Explorer, or, while Table Properties is open beside it, closes Table Properties and puts the caret in the Find field — see [Opening and Closing](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac) toggles Quick Search.
- `Undo` and `Redo` undo and redo the diagram rather than the text in a field.
- `Zoom In`, `Zoom Out`, and `Zoom Reset` zoom the canvas.

Every other editor shortcut stays in the Explorer, and so do the arrow keys, `Tab`, `Enter`, `Space`, `Home`, `End`, and any key pressed while an input method is composing.  
None of them reaches the canvas: `Delete` and `Backspace` never delete the selection, `Alt + N` (Windows/Linux) or `⌥ + N` (Mac) adds no table, and `T` then `G` groups nothing. In a field they act as ordinary text keys: `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac) selects the field's text, `Delete` and `Backspace` erase text, and `Space` types a space. `Tab` moves between the Explorer's buttons, fields, and tree.  
The keys of the Find and Replace fields themselves are covered in [Keys in the Search Fields](./find-and-replace.md#keys-in-the-search-fields).  
Keys the editor does not bind, such as the host's own save or command palette, reach the host as usual.

## Dialogs Beside It

[Table Properties](./table-related-functions.md#table-properties), the [theme builder](./language-and-theme.md#theme), the [`Display Language`](./language-and-theme.md#picking-a-language) picker, the [`Export image`](./file-import-export.md#image) dialog, and [Map Columns](./relationship-editing.md#map-columns) leave the Explorer open as they open.

- Table Properties opens in the middle of the canvas beside the Explorer and dims only the canvas. The Explorer stays usable: choosing a row closes Table Properties, then goes to the row.
- `Export image` and Map Columns dim the whole editor, the toolbar and the Explorer included. The Explorer stays open under the dimmed area, and a click there closes the dialog, as a click anywhere on the dimmed area does; Map Columns then closes without mapping anything.
- In a left-to-right display language, the theme builder and the `Display Language` picker open just past the Explorer instead of over it, and move along if it opens or closes while they are up. In a right-to-left language they keep their place at the right. A press in the Explorer closes them, as any press outside them does other than one on the toolbar.

Opening the search with the shortcut or a `Toggle Explorer` entry closes all five, Map Columns without mapping anything.  
[Quick Search](./quick-search.md) leaves the Explorer open too, and `Escape` then closes only the palette.

## Read-only Editors

In a [`readonly`](../../api/erd-editor-element.md#readonly) editor the Explorer works as in any other: the toolbar button with the same tooltip, the shortcut, the `Toggle Explorer` entry in Quick Search, the tree, folding, and `Collapse All`. Its title reads `Explorer` there too. The canvas context menu has no `Toggle Explorer` there, since it keeps only the rows that read — see [Read-only Editors](./table-related-functions.md#read-only-editors).

Going to a row works as in [Going to a Row](#going-to-a-row): the view moves by the same rule, and the row's table, table group, or memo is selected, outlined on the canvas, with the focused cell where the row puts it.  
That is the only way a read-only editor selects anything. A press on the canvas selects nothing, and a click that does not move clears the selection a row left. A table it selected opens in [Table Properties](./table-related-functions.md#table-properties) with `Alt + Space` (Windows/Linux) or `⌥ + Space` (Mac), read only, and `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac) copies what it selected as in any editor.  
Its search only finds — see [Read-only Editors](./find-and-replace.md#read-only-editors) in Find and Replace.
