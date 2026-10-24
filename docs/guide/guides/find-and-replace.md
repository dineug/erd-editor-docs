---
sidebar_position: 10
description: Search table, column, index, and table group names, logical names, comments, and memos from the top of the Explorer, step through the matches in its tree and on the canvas, and replace one match or all of them.
---

# Find and Replace

Finds text across the whole diagram, takes you to each match on the ERD canvas, and replaces one match or all of them.  
It searches eight kinds of text: table names, table comments, column names, column comments, memos, index names, table group names, and the [logical names](./logical-names.md) of tables and columns — see [What It Searches](#what-it-searches).

It sits at the top of the [Explorer](./explorer.md), the panel docked left of the ERD canvas, between the Explorer's title bar and its tree. It has no title of its own. From top to bottom it holds:

- The Find field, with the three [options](#options) inside it at its end, and the `Toggle Replace` arrow before it.
- The `Replace` row, folded away at first — see [Replacing](#replacing).
- The count, then the up and down arrows that step through the matches, and the three-dots `Search In` button.
- The [kinds of text](#what-it-searches), which `Search In` unfolds.

While the Find field holds text, the Explorer's tree shows the matches — see [The Results](#the-results).  
The search keeps its full height on a short canvas, and the tree below it takes what is left and scrolls.

![Opening Find and Replace in the Explorer with ⌘ + F, stepping through the six matches of member, then, with Preserve Case on, replacing all six with user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Opening and Closing

`Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), and `Toggle Explorer` in [Quick Search](./quick-search.md) or in the canvas context menu, open the Explorer on its search. The caret goes to the Find field with its text selected, and the query is searched again with no match current.  
The toolbar's `Explorer` button only opens or closes the panel. It does not put the caret in the Find field, and it leaves the query and the current match as they were.  
When the key only brings the caret back to an Explorer already showing, as it does while Quick Search or one of the five dialogs in [Dialogs Beside It](./explorer.md#dialogs-beside-it) is open, the current match stays current.

Closing the Explorer, what the key and the two `Toggle Explorer` entries do while it is open, and the dialogs they close are covered in [Opening and Closing](./explorer.md#opening-and-closing) on the Explorer page.  
[When It Stands Aside](./explorer.md#when-it-stands-aside) covers how another tab and zen mode hide it, and how the diff viewer, time travel, and the Auto Layout preview hide it and keep it from opening. [Beside the Canvas](./explorer.md#beside-the-canvas) covers an editor too narrow for it.

Reopening keeps the last query, along with the Replace text, the [options](#options), the [kinds of text](#what-it-searches) that were on, and whether the `Replace` row and the kinds of text were unfolded.  
They are kept while the editor stays open and are not saved in the document. A newly opened editor starts with every option off, the `Replace` row and the kinds of text folded, and only the four kinds of name and `Logical names` on — see [What It Searches](#what-it-searches).

## The Browser's Find Bar

While the editor has the keyboard focus, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) belongs to it on every tab, in its own text fields as well, so the browser's find bar does not open.  
The key goes on to the browser or host while the diff viewer, time travel, or the Auto Layout preview is open, and while the focus is outside the editor.

- Web app and Google Drive: the browser's find bar opens only in those two cases.
- VS Code: the extension leaves VS Code's own find widget off in the ERD Editor, so the key never opens one there.
- Obsidian: the key reaches the editor whenever the diagram's tab is active, in place of Obsidian's `Search current file`.
- JetBrains IDE: if the IDE's keymap keeps `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) for itself, open the search from `Toggle Explorer` in Quick Search or in the canvas context menu, or open the Explorer with the toolbar's `Explorer` button and click in the Find field.

A page that embeds the editor can move or remove the key — see [Changing the Shortcut](#changing-the-shortcut).

## What It Searches

Eight buttons choose the kinds of text searched, in this order: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names`, and `Logical names`.  
They are folded away at first. The `Search In` button at the end of the count's row unfolds them below that row and folds them again, and is highlighted while they show.  
A highlighted kind button is on. Click one to turn it on or off, and the search runs again. With all eight off, nothing is found.

The search first opens on the four kinds of name, `Table names`, `Column names`, `Index names`, and `Table group names`, and on `Logical names`, so a rename does not reach comments and memos unless you turn them on.  
`Logical names` is one kind for the logical names of tables and of columns alike.  
Index names are the names of the indexes in the `Indexes` tab of [Table Properties](./table-related-functions.md#indexes), not the `PK_` and `UQ_` keys listed above them.

Nothing else is searched: not data types, a column's domain, default values, an index's columns, the database name, the [Schema SQL](./schema-sql.md) with its `Before tables` and `After tables` scripts, generated code, or the [Dictionary](./dictionary.md) tab's sheets, which have a [search of their own](./dictionary.md#searching).  
Logical names are searched whatever the [Name View](./logical-names.md#name-view) draws, `Physical Names` included, where the canvas shows none. A comment hidden by a [table view option](./table-related-functions.md#table-view-options) is still searched too. Memos hidden with View Option → `Memos`, and [table groups](./table-groups.md#hiding-groups) hidden with View Option → `Table Groups`, are not, even with their button on, so `Replace All` never rewrites a memo or renames a group you cannot see.

## Options

Three toggles inside the Find field, at its end, change how the query matches. They are named in their tooltips and highlighted while on. All three start off, and changing one searches again.

- `Match Case`: with it off, matching ignores case.
- `Match Whole Word`: a match counts only where it does not run on into a word on either side. Letters, digits, and marks of any script count as word characters, and so does the underscore. `user` therefore matches in `user id` and `user.id`, but not inside `users`, `user_id`, or `superuser`. An end of the query that is not a word character itself, such as the dot in `.id`, needs no boundary there.
- `Use Regular Expression`: the query is a JavaScript regular expression, always in Unicode mode, so `\p{L}` works. `^` and `$` match at the start and end of each line of a multi-line comment or memo, and `.` does not cross a line break. Escapes often typed in names, such as `\_` and `\-`, are accepted.

A regular expression that does not parse, such as `user(`, finds nothing: the count reads `Invalid regular expression` in red, and the Find field is outlined in red.  
`Match Case` and `Match Whole Word` apply to a regular expression too. A match of no length, such as `^` on its own, is never listed.

Plain text is searched as you type. A regular expression is searched once typing pauses, or at once when you press `Enter`, a navigation button, `Replace`, or `Replace All`, or choose a row that holds a match.  
The search has no time limit, so a regular expression that backtracks heavily can leave the editor unresponsive until it finishes.

A fourth toggle, `Preserve Case`, sits inside the `Replace` field at its end, so it shows only while the `Replace` row is unfolded. It starts off. It changes nothing that is found, only how `Replace` and `Replace All` write the replacement — see [Replacing](#replacing). Turning it on or off searches nothing, and the current match stays current.

## The Results

The count, at the start of the row under the fields, says where you are. It is empty while the Find field is empty.

| Count | When |
| --- | --- |
| `No results` | Nothing matches. |
| `12 matches` | Before you move to one of them; `1 match` for a single one. |
| `3 of 12` | The third match is current. |
| `Invalid regular expression` | The regular expression does not parse. |
| `Replaced 12 matches` | `Replace All` changed that many matches; `Replaced 1 match` for a single one. |
| `No changes` | `Replace All` changed nothing. |
| `No more matches` | A run of `Replace` has come back to where it began — see [Replacing](#replacing). |

`Replaced …`, `No changes`, and `No more matches` give way to the count at the next search or move, including the search that an edit or an undo starts.

While the Find field holds text, the Explorer's [tree](./explorer.md#the-tree) shows the results instead of the whole diagram: only the rows that hold a match and the rows above them. When nothing matches, or the regular expression does not parse, it is empty. Deleting the query brings back the whole tree, folded as it was before.

- `Tables`, `Table Groups`, and `Memos` show only when they hold a match, and each folder's count is the number of rows directly under it in the results.
- Under `Tables` come the tables that hold a match, by name, never by logical name. Under each table come a row for each match in its comment, then a `Columns` folder with the columns that hold a match, in column order, each with a row for each match in its comment, then an `Indexes` folder with the indexes whose name matches. There is no `Foreign Keys` folder.
- Under `Table Groups` come the groups whose name matches, by name, without their tables. A table found shows under `Tables`.
- Under `Memos` come the memos that hold a match, in document order, each shown by its first line and with a row for each match in it.

A match in a name is highlighted in that name's own row, so a name that holds the query twice is one row with two highlights. A match in a table's or column's logical name goes on that table's or column's row as well, never on a row of its own.  
Those rows name the table or column as the [Name View](./logical-names.md#beyond-the-canvas) shows it, and each of the two names a row may show highlights only its own matches. A row found only in the name its view leaves out, the logical name in `Physical Names` or the name in `Logical Names`, adds that name after the one it shows, muted as in `Both Names`, with the match highlighted. When the name it shows holds a match as well, the row shows that name alone, so the matches in the name its view leaves out are counted and stepped through but not highlighted.  
A match in a comment or a memo has a row of its own: a speech bubble for a table or column comment, or a sticky note for a memo, then an excerpt of the text with the match highlighted. A long text is cut with `…`, and line breaks show as spaces. Hover the row to see the whole text.  
Every other row looks as it does outside a search: a column shows its data type, an index its columns, and a blank name reads `unnamed`.

Every row with rows under it shows unfolded when a search starts. A row you fold, or one `Collapse All` folds, stays folded until a match under it becomes current, or until the query, `Match Case`, `Match Whole Word`, `Use Regular Expression`, or a kind of text changes, or the search is opened again with the key or a `Toggle Explorer` entry.  
The current match's row is highlighted and scrolled into view. The tree lists every match, however many there are.  
The matches are stepped through in the tree's order: table by table, the table's logical name, name, and comment, then each of its columns' logical name, name, and comment in column order, then its index names; then the table group names; then the memos.

The results follow the document while the Explorer shows. Once edits pause, any change to the searched texts searches again, and the current match stays current if it is still there. That covers a name, logical name, comment, or memo text edited, a table, column, index, memo, or table group added or removed, a column moved, and the memos or table groups hidden or shown with View Option, which takes their matches out of the tree or brings them back. An edit on the canvas, an undo or redo, an import, and an edit by a collaborator or a coding agent all count. Selecting, moving tables, memos, or groups on the canvas, scrolling, zooming, and hovering do not.  
Nor does switching the Name View, which changes no text the search reads: the same matches stay, and the rows take the names the new view shows.  
Edits made while the Explorer is closed or out of sight are searched as soon as it shows again.

## Going to a Match

`Enter` in the Find field goes to the next match, and `Shift + Enter` to the previous one. The up and down arrow buttons after the count do the same; their tooltips read `Previous Match (Shift+Enter)` and `Next Match (Enter)`, and they are disabled while there is no match.  
Movement wraps at both ends. No match is current until you first move, so the first `Enter` goes to the first match and the first `Shift + Enter` to the last.

A click on a row of the results, or `Enter` or `Space` with the keyboard on it, does one of these:

- A row whose own name or logical name holds a match goes to its first match, the logical name's before the name's.
- A row that shows an excerpt of a comment or memo goes to that match.
- Any other row, such as a table whose name and logical name do not match or a memo's own row, goes to what the row stands for and leaves the current match as it is — see [Going to a Row](./explorer.md#going-to-a-row).
- A folder folds or unfolds.

Whenever a match becomes current, the tree unfolds any folded rows above it and moves the keyboard's row there, so the arrow keys in the tree go on from it.

Going to a match closes Table Properties if it is open, then:

- For a table's or column's name, logical name, or comment, it selects the table alone, brings it to the front, and puts the focused cell on the cell that holds the match. A match in a comment hidden by a [table view option](./table-related-functions.md#table-view-options) puts the focused cell on the name beside it instead. Where the [Name View](./logical-names.md#name-view) draws no cell for the name or the logical name, the focused cell goes on the one drawn in its place: the name in `Physical Names`, the logical name in `Logical Names`.
- For an index name, it selects the index's table alone and brings it to the front, with the focused cell on the table's name, or its logical name in `Logical Names` and `Both Names`, unless it is already in that table. Index names are not drawn on the canvas.
- For a table group name, it selects the group alone and brings it to the front with its tables.
- For a memo, it selects the memo alone and brings it to the front.

The canvas scrolls only when what it goes to does not already show well, and the zoom never changes — see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands).

After `Enter` in the Find field the caret stays there, and after a row is chosen the keyboard stays in the tree, so what you type next does not reach the selected table.  
Going to a match never starts or finishes a relationship being drawn.

## Replacing

The `Replace` row is folded away at first. The arrow before the Find field, whose tooltip reads `Toggle Replace`, unfolds and folds it. Folding it keeps the Replace text.  
The row holds the `Replace` field, with the `Preserve Case` toggle inside it at its end, and two buttons, whose tooltips read `Replace (Enter)` and `Replace All`. Both buttons are disabled while there is no match.

`Replace` runs on `Enter` in the Replace field, with or without `Shift`, or on its button:

- With no match current, the first press only goes to the next match, so you see what it would change before anything changes.
- With a match current, it replaces that one occurrence, leaving any other occurrence in the same text, and goes on to the next match after the text it wrote. What it wrote is skipped even when it contains the query: replacing `user` with `super_user` does not then stop inside `super_user`.
- A match the replacement would write back exactly as it was is left as it is, and the press only goes on to the next match.
- The replacement and the scroll to the next match are one undo step.

A run of `Replace` presses stops once it comes round to where it began. The count reads `No more matches`, no match is current, and further presses replace nothing.  
`Customer` replaced with `Big Customer` is therefore replaced once, instead of growing into `Big Big Customer`.  
Going to a match, changing the query, `Match Case`, `Match Whole Word`, `Use Regular Expression`, or a kind of text, opening the search with the key or a `Toggle Explorer` entry, or `Replace All` starts a new run, and so does an undo or any other edit that changes the text the run began in. Changing the Replace text or `Preserve Case` does not, and neither does the key when it only brings the caret back to an Explorer already showing.  
While a run lasts, a table or table group it renames keeps its place in the tree and in the order of the matches, so a rename that would sort it later is not met again. The next run puts the tree back in name order, and the renamed row moves to its new place.

`Replace All` runs on `Ctrl + Enter` (Windows/Linux) or `⌘ + Enter` (Mac) in the Replace field, or on its button:

- It replaces every match in the kinds of text that are on and leaves the other kinds alone, apart from the physical names that a replaced logical name derives, which it writes even while `Table names` and `Column names` are off — see below. With the default kinds, it renames tables, columns, indexes, and table groups, and rewrites the logical names of tables and columns; comments and memos are untouched.
- Everything it changes is one undo step — see [One Gesture, One Step](./undo-redo.md#one-gesture-one-step).
- The count reads `Replaced N matches`, counting only the occurrences whose text actually changed. When none did, it reads `No changes` and nothing is recorded in the history, as when replacing the regular expression `(user)` with `$1`.
- The results are then searched again with no match current, so they may list matches that the new text contains.

Both read each text as it is when you press, not as the last search found it.

How the Replace text is used:

- Without `Use Regular Expression`, `$` has no special meaning, and the Replace text is used as typed, apart from the casing `Preserve Case` gives it.
- With `Use Regular Expression`, `$1` to `$99`, `$<name>`, `$&`, `` $` ``, `$'`, and `$$` expand as they do in JavaScript's `String.prototype.replace`.
- Without `Preserve Case`, the case of the matched text is not carried over: with `Match Case` off, replacing `user` with `member` turns `Users` into `members`.
- With `Preserve Case`, each replacement is cased after the text it replaces, once `$1` and the rest are expanded, so the same replacement turns `Users` into `Members`:
  - A match all in upper case gets the replacement all in upper case, and a match all in lower case gets it all in lower case: `USER` with `account` gives `ACCOUNT`, and `user` with `Account` gives `account`.
  - Any other match gives the replacement's first character the case of the match's first character, and leaves the rest as typed: `UserId` with `accountKey` gives `AccountKey`, and `uSER` with `AccountKey` gives `accountKey`. When the match's first character has no case, the replacement is left as typed: `_Ab` with `xyz` gives `xyz`.
  - When the match and the replacement both contain `-`, or both contain `_`, and that separator splits them into the same number of pieces, each piece is cased after the matching piece: `USER_id` with `account_key` gives `ACCOUNT_key`, and `User-Name` with `account-key` gives `Account-Key`. When `-` and `_` both split them that way, the whole is cased as one.
  - A match with no letters that have case, such as `123`, leaves the replacement as typed.
  - A match written back as it was counts for none: with `Match Case` off, replacing `customer` with `Customer` writes `customer`, `Customer`, and `CUSTOMER` back as they were, and none of them is counted.
- An empty Replace field deletes the match.

A replacement is an ordinary edit, the same as typing the new table name, column name, logical name, comment, or memo text yourself, renaming the index in Table Properties, or renaming the table group.  
It is recorded in the history and reaches collaborators and a coding agent like any other edit.

So a table or column name a replacement writes becomes a name of your own, which a logical name written later leaves as it is until [Derive Physical Names Again](./dictionary.md#derive-physical-names-again) gives it back to the dictionaries. A name a replacement leaves empty goes back to the dictionaries instead, as any cleared name does — see [Names of Your Own](./dictionary.md#names-of-your-own).  
While a table's or column's physical name is empty or was itself derived, a replaced logical name derives it from the dictionaries, as closing the logical name cell on a new logical name does — see [Deriving Physical Names](./dictionary.md#deriving-physical-names). In that case, a column whose new logical name is a term also takes the term's domain, and with it the domain's data type. What it derives is part of the replacement's undo step and is not counted in `Replaced N matches`.  
When one `Replace All` rewrites both the logical name and the name of the same table or column, the name it writes wins over the one the new logical name would derive.

## Keys in the Search Fields

- In the Find field, `Enter` goes to the next match and `Shift + Enter` to the previous one.
- In the Replace field, `Enter` replaces, with or without `Shift`, and `Ctrl + Enter` (Windows/Linux) or `⌘ + Enter` (Mac) replaces all.
- While an input method is composing in either field, `Enter` belongs to the composition and neither moves nor replaces.

What `Escape`, the editor shortcuts that still work, and every other key do in these fields is covered in [Keys in the Explorer](./explorer.md#keys-in-the-explorer).

## Read-only Editors

In a [`readonly`](../../api/erd-editor-element.md#readonly) editor the search only finds. There is no `Toggle Replace` arrow and no `Replace` row, so no Replace field, `Preserve Case`, `Replace`, or `Replace All`.  
The Find field, its three options, the kinds of text, the count, the results, and going to a match all work. The Explorer around it works as in any other editor — see [Read-only Editors](./explorer.md#read-only-editors).

In VS Code, a revision of a diagram, such as a Git revision or a Local History entry, opens as JSON text. Reopened as a diagram with `Reopen Editor With...`, it is read-only and gets this find-only search.

## Changing the Shortcut

A page that embeds the editor can rebind `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), or remove it, under the name `findReplace` with [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
With it removed, the key is left to the page on every tab. The toolbar's `Explorer` button still opens and closes the Explorer, and `Toggle Explorer` in Quick Search and in the canvas context menu still opens the search or closes the Explorer, but none of them shows a shortcut, so the button's tooltip reads just `Explorer`. The `Toggle Explorer` row on the [Shortcuts](./settings.md#shortcuts) tab of Settings shows no key either. Rebound, they all show the new key.
