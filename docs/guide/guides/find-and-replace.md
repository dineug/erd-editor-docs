---
sidebar_position: 8
description: Find text in table and column names, comments, and memos, step through every match on the canvas, and replace one match or all of them.
---

# Find and Replace

Finds text across the whole diagram, takes you to each match on the ERD canvas, and replaces one match or all of them.  
It searches five kinds of text: table names, table comments, column names, column comments, and memo text — see [What It Searches](#what-it-searches).

It is a panel over the top-left corner of the ERD canvas, below the toolbar, or at the top of the canvas in [zen mode](./table-related-functions.md#canvas-toolbar). Its header reads `Find and Replace`, or `Find` in a `readonly` editor — see [Read-only Editors](#read-only-editors).  
On a short canvas the result list gives up its height first, so the fields, the options, and the count stay whole.

![Opening Find and Replace with ⌘ + F, stepping through the four matches of member with Enter and the Next button, then replacing member with user in all four with Replace All (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Opening and Closing

Open it with `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), or with any of these:

- The toolbar button right after `Search`, with a text-search icon. Its tooltip reads `Find and Replace (Ctrl + F)` (Windows/Linux) or `Find and Replace (⌘ + F)` (Mac).
- `Find and Replace` in [Quick Search](./quick-search.md), listed on every tab. Typing `find`, `replace`, or `rename` brings it up.
- `Find and Replace` in the canvas context menu: right-click an empty spot on the ERD canvas, outside any [table group](./table-groups.md). It sits after `New Table`, `New Memo`, and `New Table Group`, before `Relationship`.

The quick search and context menu entries show the shortcut on the right.

The shortcut and the toolbar button work from every tab. Opening from the Visualization, Schema SQL, Code Generator, or Settings tab switches to the ERD tab first, since the matches are shown and edited there.  
Pressed while quick search is open, the shortcut closes the palette and opens the panel. It does nothing while a table cell, a memo, or a table group's name is being edited.  
Opening the panel closes Table Properties, the [theme builder](./language-and-theme.md#theme), the [`Display Language`](./language-and-theme.md#display-language) picker, the [`Export image`](./file-import-export.md#image) dialog, and [Map Columns](./relationship-editing.md#map-columns), so pressing the shortcut in one of them swaps that dialog for the panel. Map Columns closes without mapping anything.  
Opening one of those dialogs closes the panel in turn, and closing the dialog does not bring it back.

With the panel showing, the shortcut, the toolbar button, and the two entries do not close it. They put the caret back in the Find field with its text selected, and the current match stays current.

Switching to another tab only hides the panel, which comes back as you left it when you return to the ERD tab.  
The shortcut, the toolbar button, and the quick search entry bring it back too, but with its query searched again and no match current.  
While the diff viewer, time travel, or the Auto Layout preview is open, the panel cannot open: the toolbar button is dimmed and does nothing, quick search leaves out `Find and Replace`, and the shortcut is left to the browser or host — see [The Browser's Find Bar](#the-browsers-find-bar). A panel that was already open is hidden until they close.

Close it with `Escape`, or with the `x` button in its header, whose tooltip reads `Close (ESC)`. Closing gives the keyboard back to the editor.

- `Escape` pressed in the panel closes it and leaves the selection as it is, so the table or memo of the last match you went to stays selected.
- `Escape` pressed on the canvas closes it too, and in the same press clears the selection and the focused cell, as it does with no panel open — see [Shortcuts](./settings.md#shortcuts).
- An open cell, memo, or table group name editor, a relationship or a [table group](./table-groups.md#drawing-a-group) being drawn, or an open quick search takes the press first, and the panel stays open.

Reopening keeps the last query, selected and searched again, along with the Replace text, the [options](#options), and the [kinds of text](#what-it-searches) that were on.  
They are kept while the editor stays open and are not saved in the document. A newly loaded editor starts with every option off and only `Table names` and `Column names` on.

## The Browser's Find Bar

While the editor has the keyboard focus, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) belongs to it on every tab, in its own text fields as well, so the browser's find bar does not open.  
The key goes on to the browser or host while the diff viewer, time travel, or the Auto Layout preview is open, and while the focus is outside the editor.

- Web app and Google Drive: the browser's find bar opens only in those two cases.
- VS Code: the extension leaves VS Code's own find widget off in the ERD Editor, so the key never opens one there.
- Obsidian: the key reaches the editor whenever the diagram's tab is active, in place of Obsidian's `Search current file`.
- JetBrains IDE: if the IDE's keymap keeps `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) for itself, open the panel from the toolbar button, quick search, or the canvas context menu.

A page that embeds the editor can move or remove the key — see [Changing the Shortcut](#changing-the-shortcut).

## What It Searches

Five buttons under the fields choose the kinds of text searched, in this order: `Table names`, `Table comments`, `Column names`, `Column comments`, and `Memos`.  
A highlighted button is on. Click one to turn it on or off, and the panel searches again. With all five off, nothing is found.

The panel first opens on `Table names` and `Column names` alone, so a rename does not reach comments and memos unless you turn them on.

Nothing else is searched: not data types, default values, index names, [table group](./table-groups.md) names, the database name, the [Schema SQL](./schema-sql.md) with its `Before tables` and `After tables` scripts, or generated code.  
A comment hidden by a [table view option](./table-related-functions.md#table-view-options) is still searched. Memos hidden with View Option → `Memos` are not, even with the `Memos` button on, so `Replace All` never rewrites a memo you cannot see.

## Options

Three toggles to the right of the Find field, named in their tooltips, change how the query matches. All three start off, and changing one searches again.

- `Match Case`: with it off, matching ignores case.
- `Match Whole Word`: a match counts only where it does not run on into a word on either side. Letters, digits, and marks of any script count as word characters, and so does the underscore. `user` therefore matches in `user id` and `user.id`, but not inside `users`, `user_id`, or `superuser`. An end of the query that is not a word character itself, such as the dot in `.id`, needs no boundary there.
- `Use Regular Expression`: the query is a JavaScript regular expression, always in Unicode mode, so `\p{L}` works. `^` and `$` match at the start and end of each line of a multi-line comment or memo, and `.` does not cross a line break. Escapes often typed in names, such as `\_` and `\-`, are accepted.

A regular expression that does not parse, such as `user(`, lists nothing: the count reads `Invalid regular expression` in red, and the Find field is outlined in red.  
`Match Case` and `Match Whole Word` apply to a regular expression too. A match of no length, such as `^` on its own, is never listed.

Plain text is searched as you type. A regular expression is searched once typing pauses, or at once when you press `Enter`, a navigation button, `Replace`, or `Replace All`, or click a row.  
The search has no time limit, so a regular expression that backtracks heavily can leave the editor unresponsive until it finishes.

## The Results

The count line under the kinds of text says where you are. It is empty while the Find field is empty.

| Count | When |
| --- | --- |
| `No results` | Nothing matches. |
| `12 matches` | Before you move to one of them; `1 match` for a single one. |
| `3 of 12` | The third match is current. |
| `Invalid regular expression` | The regular expression does not parse. |
| `Replaced 12 matches` | `Replace All` changed that many matches; `Replaced 1 match` for a single one. |
| `No changes` | `Replace All` changed nothing. |
| `No more matches` | A run of `Replace` has come back to where it began — see [Replacing](#replacing). |

The list below it has one row per occurrence, so a text that holds the query twice gives two rows.  
Rows follow the document rather than the canvas: table by table, the table's name and then its comment, then each of its columns' name and comment in column order, with the memos last.

Each row shows:

- An icon for the kind of text: a table for a table name, columns for a column name, a speech bubble for a table or column comment, and a sticky note for a memo.
- An excerpt of the text with the match highlighted. A long text is cut with `…`, and line breaks show as spaces. Hover the row to see the whole text.
- Where the match is and its kind, such as `orders.user_id · Column`, `users · Table comment`, or just `Memo`. A table or column with a blank name shows as `unnamed`.

The current match's row is highlighted and scrolled into view.  
With more than 200 matches, the list draws 200 rows around the current match and says which part it shows, for example `Showing 1–200 of 523`. The window moves as you move through the matches.

The list follows the document while the panel is open. Any change to a searched text, whether an edit on the canvas, an undo or redo, an import, or an edit by a collaborator or a coding agent, searches again, and the current match stays current if it is still there. So does hiding or showing the memos with View Option → `Memos`, which takes their matches out of the list or brings them back. Selecting, scrolling, and hovering do not.  
Edits made while the panel is hidden are searched as soon as it shows again.

## Going to a Match

`Enter` in the Find field goes to the next match, and `Shift + Enter` to the previous one. The up and down arrow buttons to the right of the count do the same; their tooltips read `Previous Match (Shift+Enter)` and `Next Match (Enter)`. Click a row to go to that match.  
Movement wraps at both ends. No match is current until you first move, so the first `Enter` goes to the first match and the first `Shift + Enter` to the last.

Going to a match switches to the ERD tab if needed, then:

- For a table name or comment, or a column name or comment, it selects the table alone, brings it to the front, and puts the focused cell on the cell that holds the match. A match in a comment hidden by a [table view option](./table-related-functions.md#table-view-options) puts the focused cell on the name beside it instead.
- For a memo, it selects the memo alone and brings it to the front.

The canvas scrolls only when the table, the column's row, or the memo is not already fully in view beside the panel, and then centers it in the part of the canvas the panel leaves clear. On a canvas too narrow to leave room beside the panel, it centers it on the whole canvas instead.  
A table taller than the screen is scrolled to its header, and a cell wider than the screen, such as a long comment, to the matched text. At `70%` zoom and below, where tables collapse to their name, a column match brings its table into view.  
Such a scroll is recorded in the [undo history](./undo-redo.md#what-the-history-records) like any other change of view position.

Moving with `Enter` keeps the caret in the Find field, so what you type next still goes to the panel, not to the selected table.  
Going to a match never starts or finishes a relationship being drawn.

## Replacing

The row under the Find field holds the `Replace` field and two buttons, whose tooltips read `Replace (Enter)` and `Replace All`. Both buttons are disabled while there is no match.

`Replace` runs on `Enter` in the Replace field, or on its button:

- With no match current, the first press only goes to the next match, so you see what it would change before anything changes.
- With a match current, it replaces that one occurrence, leaving any other occurrence in the same text, and goes on to the next match after the text it wrote. What it wrote is skipped even when it contains the query: replacing `user` with `super_user` does not then stop inside `super_user`.
- The replacement and the scroll to the next match are one undo step.

A run of `Replace` presses stops once it comes round to where it began. The count reads `No more matches`, no match is current, and further presses replace nothing.  
`Customer` replaced with `Big Customer` is therefore replaced once, instead of growing into `Big Big Customer`.  
Going to a match, changing the query, an option, or a kind of text, reopening the panel, or `Replace All` starts a new run, and so does an undo or any other edit that changes the text the run began in. Changing the Replace text does not.

`Replace All` runs on `Ctrl + Enter` (Windows/Linux) or `⌘ + Enter` (Mac) in the Replace field, or on its button:

- It replaces every match in the kinds of text that are on and leaves the other kinds alone. With the default kinds, comments and memos are untouched.
- Everything it changes is one undo step — see [One Gesture, One Step](./undo-redo.md#one-gesture-one-step).
- The count reads `Replaced N matches`, counting only the occurrences whose text actually changed. When none did, it reads `No changes` and nothing is recorded in the history, as when replacing the regular expression `(user)` with `$1`.
- The list is then searched again with no match current, so it may list matches that the new text contains.

Both read each text as it is when you press, not as the last search found it.

How the Replace text is used:

- Without `Use Regular Expression`, it is inserted exactly as typed. `$` has no special meaning, and the case of the matched text is not carried over: with `Match Case` off, replacing `user` with `member` turns `Users` into `members`.
- With `Use Regular Expression`, `$1` to `$99`, `$<name>`, `$&`, `` $` ``, `$'`, and `$$` expand as they do in JavaScript's `String.prototype.replace`.
- An empty Replace field deletes the match.

A replacement is an ordinary edit, the same as typing the new table name, comment, column name, or memo text yourself.  
It is recorded in the history and reaches collaborators and a coding agent like any other edit.

## Keys in the Panel

While the caret is in the panel:

- `Enter` and `Shift + Enter` in the Find field move through the matches, `Enter` and `Ctrl + Enter` (Windows/Linux) or `⌘ + Enter` (Mac) in the Replace field replace, and `Escape` closes the panel.
- A few editor shortcuts still work: `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) puts the caret back in the Find field with its text selected, `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac) toggles quick search, `Undo` and `Redo` undo and redo the diagram rather than the text in the field, and `Zoom In`, `Zoom Out`, and `Zoom Reset` zoom the canvas — see [Shortcuts](./settings.md#shortcuts).
- Every other editor shortcut, the arrow keys, and `Tab` stay in the panel and act as ordinary text-field keys: `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac) selects the field's text, `Delete` and `Backspace` erase text and never delete the selection on the canvas, `Space` types a space, and `Tab` moves the focus between the panel's controls.
- Keys the editor does not bind, such as the host's own save, reach the host as usual.

## Read-only Editors

In a [`readonly`](../../api/erd-editor-element.md#readonly) editor the panel only finds. Its header reads `Find`, and it has no Replace field or buttons.  
Searching, the options, the kinds of text, the list, and going to a match all work.  
The toolbar button's tooltip reads `Find (Ctrl + F)` (Windows/Linux) or `Find (⌘ + F)` (Mac), while the quick search and context menu entries keep the name `Find and Replace`.

In VS Code, a revision of a diagram, such as a Git revision or a Local History entry, opens as JSON text. Reopened as a diagram with `Reopen Editor With...`, it is read-only and gets this find-only panel.

## From Quick Search

Under the `#`, `@`, and `:` prefixes, [Quick Search](./quick-search.md) lists at most 100 rows.  
When that cut leaves out text that contains the keyword itself, one more row follows those 100: `Show all N matches in Find and Replace`, or `Show 1 match in Find and Replace`. It opens this panel on the same search:

- The keyword becomes the query, and `Match Case`, `Match Whole Word`, and `Use Regular Expression` are turned off.
- Only the prefix's kinds of text are on: `Table names` for `#`, `Column names` for `@`, and `Table comments`, `Column comments`, and `Memos` for `:`.
- `@table.column` hands over the column part alone, so the panel lists the matching columns of every table.
- N is the number of matches the panel opens on.

The row is not offered while the diff viewer, time travel, or the Auto Layout preview is open.  
The options and kinds of text it sets stay that way for later openings, so after `#` only `Table names` is on until you turn the others back on.

## Changing the Shortcut

A page that embeds the editor can rebind `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac), or remove it, under the name `findReplace` with [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
With it removed, the key is left to the page on every tab. The toolbar button, quick search, and the canvas context menu still open the panel but show no shortcut, and neither does the `Find and Replace` row on the [Shortcuts](./settings.md#shortcuts) tab of Settings.
