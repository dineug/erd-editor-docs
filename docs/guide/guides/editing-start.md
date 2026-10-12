---
sidebar_position: 1
description: Start from the welcome screen, and create tables, memos, table groups, and relationships from the canvas context menu.
---

# Editing Start

Editing begins through the context menu by right-clicking.

![Right-clicking the canvas, opening the Relationship submenu, adding a table, then its own menu](/img/demo-context-menu.webp)

Right-clicking a table, a memo, a table group, or a relationship opens that item's own menu instead.  
A right-click on a table, memo, or table group that is already selected keeps the whole selection, so rows such as `Color` and `Delete selected` act on all of it — see [Multiple Selection](./table-related-functions.md#multiple-selection).

## Welcome Screen

In the web app, Google Drive, VS Code, Obsidian, and a JetBrains IDE, an empty diagram opens on a welcome screen over the ERD canvas. An `<erd-editor>` in your own page shows it only when the page turns it on with [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
A diagram counts as empty while it holds no table, no shown memo, and no shown table group, so memos and groups hidden with View Option do not count. The screen goes away as soon as the diagram holds one of them, and comes back whenever the diagram is empty again, for example after you delete the last table or undo adding the first.  
It is not shown in a read-only editor, in zen mode, while Table Properties is open, or while the diff viewer, the Auto Layout preview, or time travel takes over the canvas.

![The welcome screen on an empty diagram: opening Import's formats, going back with Esc, adding a table with New Table, then bringing the screen back with ⌘ + Z](/img/demo-welcome-screen.webp)

Under the heading `Right-click the canvas for every action.` is a menu:

- `New Table` adds a table, as `Alt + N` does.
- `New Memo` adds a memo, as `Alt + M` does. It is left out while memos are hidden.
- `Import` swaps the menu for `Back` and the formats `json`, `Schema SQL`, `GraphQL`, `DBML`, and `AML`. Choosing a format asks for a file of that format and loads it in place of the empty diagram — see [Importing or Exporting Files](./file-import-export.md). `Back`, or `Escape`, returns to the first menu.
- `Command Palette` opens [Quick Search](./quick-search.md), as `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac) does.
- `Shortcuts` opens Settings on its [`Shortcuts`](./settings.md#shortcuts) tab.

Where the canvas is wide enough, `New Table`, `New Memo`, and `Command Palette` show the key currently bound to their command, including one a host has remapped.  
Once a row has the keyboard focus, `↑` and `↓` move through the rows and wrap around, `Home` and `End` jump to the first and last, and `Enter` or `Space` presses the focused row. Every other shortcut still works, so `Alt + N` adds a table from there too.  
Only the menu takes clicks: a press anywhere else on the screen reaches the canvas, and right-clicking the canvas opens the context menu as usual.

Where the canvas has room, hand-drawn arrows point at:

- the toolbar's `Search` button: `Search commands and tables`
- the `Theme` and `Display Language` buttons: `Pick a theme and a language`, or `Pick a theme` or `Pick a language` when the toolbar shows only one of them — see [Language and Theme](./language-and-theme.md)
- the [canvas toolbar](./table-related-functions.md#canvas-toolbar) at the bottom: `Pan, zoom and draw relationships`

## Table Creation

Create a table from the context menu or with the shortcut `Alt + N`.

## Memo Creation

Create a memo from the context menu or with the shortcut `Alt + M`.  
While View Option → `Memos` is off, memos are hidden, nothing offers `New Memo`, and `Alt + M` adds none — see [Table View Options](./table-related-functions.md#table-view-options).

A memo is a free-text note on the canvas. Click into its body and type; the text is saved with the document.  
`Escape` closes the memo editor, keeping what you typed and leaving the memo selected, and a second `Escape` clears the selection.  
Drag its border to resize it. The `x` in its header, shown while the pointer is over the memo, deletes it.  
Right-clicking a memo opens its menu rather than the editor: `Color`, `Remove color` while a selected item has a color, and `Delete`, which reads `Delete selected` while the memo is one of two or more selected items. A selected memo is also deleted with the keys that delete tables — see [Table and Memo Deletion](./table-related-functions.md#table-and-memo-deletion).

![Adding a memo with Alt + M, typing a note, and dragging its border to resize it](/img/demo-memo.webp)

## Table Group Creation

A table group is a box that holds tables, and you can give it a name and a color. Create one in either of two ways:

- Choose `New Table Group` from the context menu or Quick Search, then drag a box over the canvas. Each table whose center lies inside the box joins the new group, unless it is already in another group.
- Select tables and choose `Group selected tables` from a table's context menu, or `Group Selected Tables` from Quick Search.

Neither has a shortcut. Naming, coloring, moving, resizing, and the rest are covered in [Table Groups](./table-groups.md).

## Relationship Creation

Start a relationship from the context menu, from the [canvas toolbar](./table-related-functions.md#canvas-toolbar) at the bottom of the canvas, or with a shortcut. Each relationship type has its own:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

Once a type is armed the cursor changes. Click the parent table first, then the child table.  
The parent gets a primary key if it does not have one, and for each of the parent's primary key columns the child gets a `Not Null` foreign key column with the same data type, default, and comment.  
A serial key is the exception: its foreign key takes the integer type the serial stores, such as `integer` for `serial4` — see [Identifying Relationships](./relationship-editing.md#identifying-relationships).  
Each foreign key column is named after its key: a one-word name such as `id` gets the parent table's name in front (`user_id`), a name of several words such as `member_id` is kept, and a name the child already has is numbered (`user_id_2`) — see [Foreign Key Column Names](./relationship-editing.md#foreign-key-column-names).  
Clicking one table twice draws a self-referencing relationship.  
A new relationship starts with `On Delete` and `On Update` both `Not set`; change them from its context menu — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Press `Escape`, or press the same shortcut again, to cancel. Canceling leaves the selection as it is, and the next `Escape` clears it.

Once the parent is picked, pointing at a table the relationship can end on outlines that table and shows two buttons beside it:

- `Create new columns` (`+`) draws the relationship with new foreign key columns, as clicking the table does.
- `Map to existing columns` (a link icon) ends the draw and opens [Map Columns](./relationship-editing.md#map-columns) for the two tables, so the relationship can use columns the child already has. Nothing is written until you press `Map`.

The parent shows the buttons too once the pointer has moved a short way from where you clicked it, so a self-referencing relationship can also be mapped onto existing columns.  
A finger has no hover, so when you draw with one the buttons never show and tapping the child table draws the relationship at once; a pen shows them as a mouse does.  
If the parent has lost its primary key by the time you reach the child, for example to an undo or a collaborator's edit, `Create new columns` is dimmed with the tooltip `<parent> has no primary key to copy`, and clicking the child table ends the draw without drawing anything.

![Drawing a One N relationship with ⌘ + ⌥ + 4, then a Zero N one from the canvas toolbar, the child table outlined with its Map to existing columns and Create new columns buttons](/img/demo-relationship.webp)

## Duplicating Tables and Memos

Existing tables and memos can be copied, pasted, and `Alt`-dragged into duplicates — see [Table-related Functions](./table-related-functions.md#copyingpasting-tables-and-memos).
