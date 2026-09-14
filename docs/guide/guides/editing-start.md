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
Drag its border to resize it, and use the `x` in its header to delete it.

![Adding a memo with Alt + M, typing a note, and dragging its border to resize it](/img/demo-memo.webp)

## Relationship Creation

Start a relationship from the context menu, from the [canvas toolbar](./table-related-functions.md#canvas-toolbar) at the bottom of the canvas, or with a shortcut. Each relationship type has its own:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

Once a type is armed the cursor changes. Click the parent table first, then the child table.  
The parent gets a primary key if it does not have one, and a matching foreign key column — same name, data type, default, and comment, set `Not Null` — is created on the child.  
Clicking one table twice draws a self-referencing relationship.  
Press `Escape`, or press the same shortcut again, to cancel.

![Drawing a One N relationship with ⌘ + ⌥ + 4, then a Zero N one from the canvas toolbar](/img/demo-relationship.webp)

## Duplicating Tables and Memos

Existing tables and memos can be copied, pasted, and `Alt`-dragged into duplicates — see [Table-related Functions](./table-related-functions.md#copyingpasting-tables-and-memos).
