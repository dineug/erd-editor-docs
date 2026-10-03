---
sidebar_position: 1
description: Create tables, memos, and relationships from the canvas context menu.
---

# Editing Start

Editing begins through the context menu by right-clicking.

![Right-clicking the canvas, opening the Relationship submenu, adding a table, then its own menu](/img/demo-context-menu.webp)

Right-clicking a table or a relationship opens that item's own menu instead.

## Table Creation

Create a table from the context menu or with the shortcut `Alt + N`.

## Memo Creation

Create a memo from the context menu or with the shortcut `Alt + M`.

A memo is a free-text note on the canvas. Click into its body and type; the text is saved with the document.  
`Escape` closes the memo editor, keeping what you typed and leaving the memo selected, and a second `Escape` clears the selection.  
Drag its border to resize it, and use the `x` in its header to delete it.

![Adding a memo with Alt + M, typing a note, and dragging its border to resize it](/img/demo-memo.webp)

## Relationship Creation

Start a relationship from the context menu, from the [canvas toolbar](./table-related-functions.md#canvas-toolbar) at the bottom of the canvas, or with a shortcut. Each relationship type has its own:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

Once a type is armed the cursor changes. Click the parent table first, then the child table.  
The parent gets a primary key if it does not have one, and for each of the parent's primary key columns the child gets a `Not Null` foreign key column with the same data type, default, and comment.  
Each is named after its key: a one-word name such as `id` gets the parent table's name in front (`user_id`), a name of several words such as `member_id` is kept, and a name the child already has is numbered (`user_id_2`) — see [Foreign Key Column Names](./relationship-editing.md#foreign-key-column-names).  
Clicking one table twice draws a self-referencing relationship.  
A new relationship starts with `On Delete` and `On Update` both `Not set`; change them from its context menu — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Press `Escape`, or press the same shortcut again, to cancel. Canceling leaves the selection as it is, and the next `Escape` clears it.

![Drawing a One N relationship with ⌘ + ⌥ + 4, then a Zero N one from the canvas toolbar](/img/demo-relationship.webp)

## Duplicating Tables and Memos

Existing tables and memos can be copied, pasted, and `Alt`-dragged into duplicates — see [Table-related Functions](./table-related-functions.md#copyingpasting-tables-and-memos).
