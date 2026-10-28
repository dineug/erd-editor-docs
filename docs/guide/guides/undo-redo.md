---
sidebar_position: 15
description: Undo and redo edits, what the history records, the Dictionary sheets' own histories, and stepping through the diagram's history with Time Travel.
---

# Undo, Redo

You can move back to a previous editing state or forward to a later one.  
The history keeps up to `2048` changes.

- Undo: `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac)

On the ERD tab, the toolbar carries the same two commands as `Undo` and `Redo` buttons, next to `Time Travel`. On the Dictionary tab it shows `Undo` and `Redo` without `Time Travel`, and no other tab shows them.  
They light up only when there is something to undo or redo. A `readonly` editor hides them and `Time Travel`, and the shortcuts undo and redo nothing.

Undo and Redo act on the diagram's history only on the ERD tab.  
The shortcuts are inactive there while Quick Search, `Table Properties`, `Diff Viewer`, the `Auto Layout` preview, the [`Export image`](./file-import-export.md#image) dialog, [Map Columns](./relationship-editing.md#map-columns), or Time Travel is open.  
They keep working while the keyboard is anywhere in the [Explorer](./explorer.md#keys-in-the-explorer), its tree included, and while the [color picker](./table-related-functions.md#table-and-memo-color-specification) is open. Even with the caret in one of their fields, such as Find, Replace, or `Hex`, they undo and redo the diagram rather than the text in the field.

On the other tabs:

- Dictionary: they undo and redo the edits of the sheet shown, `Domains`, `Words`, or `Terms`, from that sheet's own history, never the diagram's. On `Checks` they do nothing — see [Dictionary Sheets](#dictionary-sheets).
- Visualization: in `Flow`, the same keys step back and forward through what Flow has shown, as `Previous table` and `Next table` do, in a `readonly` editor too. They never undo or redo the diagram there — see [Previous Table and Next Table](./visualization.md#previous-table-and-next-table). In `Graph` they do nothing.
- Schema SQL, Code Generator, and Settings: they are unavailable. In the Schema SQL tab's `Before tables` and `After tables` fields, the same keys undo and redo your typing in the field instead.

The history lives in memory for the current session. It is not stored in the document, so reopening a diagram starts with an empty history.

![Moving a table and removing a column with ⌥ + Backspace, then undoing both with ⌘ + Z and redoing them with ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## What the History Records

Recorded:

- Tables and memos: add, remove, move, and color; a table's name, logical name, and comment; a memo's text and size.
- Table groups: add, remove, move, resize, name, color, and which group each table is in — see [Table Groups](./table-groups.md).
- Columns: add, remove, reorder, logical name, the domain each is linked to, and every column option.
- The physical names the dictionaries derive, and whether each name is your own or the dictionaries': one undo puts a name and that state back together — see [Names of Your Own](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` and `Derive Physical Names Again` — see [Derive Physical Names Again](./dictionary.md#derive-physical-names-again).
- Relationships: add, remove, type change, the columns set in [Map Columns](./relationship-editing.md#map-columns), and each choice from `On Delete` or `On Update` — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Undoing a removal brings a relationship back with its ON DELETE and ON UPDATE actions.
- Indexes and their columns.
- View position, zoom level, and the `View Option` toggles.
- The Schema SQL tab's `Before tables` and `After tables` scripts, one step for each edit you apply by leaving the field — see [Before and After Scripts](./schema-sql.md#before-and-after-scripts).
- Importing a file, and adding one with [`Import and Add`](./file-import-export.md#import-and-add).

Not recorded:

- The database vendor and the database name.
- The Code Generator language, `Table Name Case`, and `Column Name Case`.
- The bracket type, whether set on the Schema SQL tab or the Code Generator tab.
- The Schema SQL tab's `Statements`, `Header`, `Write logical names into empty comments`, and `Tables` choices, which belong to the editor window — see [Options Panel](./schema-sql.md#options-panel).
- Everything on the Settings tab, the [`Lock`](./settings.md#lock) rows included.
- Switching the Name View, from any of its places, whether its lock is on or off — see [Switching the View](./logical-names.md#switching-the-view).
- The theme and the display language — see [Language and Theme](./language-and-theme.md).
- Which table, memo, or group is drawn in front of the others.
- The [Explorer](./explorer.md): opening, closing, or resizing it, folding its tree, and the search text and options. What `Replace` and `Replace All` change is recorded, though, and so is the scroll a go-to makes — see [One Gesture, One Step](#one-gesture-one-step).
- Zoom and pan on the Visualization tab in either mode, moving graph nodes or Flow cards, `Tidy Up`, the row display, focusing on tables, and stepping with `Previous table` and `Next table` — see [Flow Never Edits the Document](./visualization.md#flow-never-edits-the-document).
- The Dictionary tab's sheet shown, and each sheet's search, selection, scroll, and column widths — see [Opening the Tab](./dictionary.md#opening-the-tab).

Changing any of these cannot be undone.

A read-only editor records nothing at all. The view position, the zoom, and the `View Option` toggles still change there, along with the tab, the Name View, the database, and the code settings, but on that screen alone, so there is nothing to undo — see [Read-only Editors](./settings.md#read-only-editors) in Settings.

Edits made on the Dictionary tab can be undone, but they go into the history of their own sheet rather than this one, so Undo on the ERD tab never takes one back, not even a domain's new `Data Type` and the column types it changes — see [Dictionary Sheets](#dictionary-sheets).

Changes that arrive from another editor are not recorded either, so Undo reverts only your own. In a [collaborative session](../../api/advanced/collaborative-editing.md) each editor undoes its own changes, and a coding agent editing through the [MCP server](../../mcp/live-and-headless.md#undo) undoes its own with `erd_undo`.

Undoing an `Import`, which replaces the whole diagram, brings back the earlier diagram as the editor held it when you imported, with each [lock](./settings.md#lock) on or off and each locked value as they were then.  
If that diagram had `Viewport` locked, the view and the zoom go back to the locked view, where the diagram opens, rather than to where you were. With its `Viewport` unlocked, they go back to where you were when you imported. The other locked settings, such as the tab you are on, the Code Generator language, or the Name View, stay as they are on your screen.  
A new diagram starts with every lock on. Unlock `Viewport` before you import to keep your view through such an undo. Unlocking it afterwards, or importing a JSON file whose own `Viewport` lock is off, does not change where the undo takes you.

Undoing the import of a JSON file also brings back the words, terms, and domains the earlier diagram had. A Schema SQL, GraphQL, DBML, or AML import keeps the dictionaries, so its undo and redo leave them as they stand, edits made on the Dictionary tab since included.

An undo or redo on the ERD tab that links a column to a domain again, or brings back a column linked to one, gives the column the domain's data type as it stands now. One that puts back another type on a linked column unlinks it — see [Domains and Data Types](./dictionary.md#domains-and-data-types).

## One Gesture, One Step

Everything a single gesture dispatches becomes one history entry.  
Pasting several tables and memos at once, or duplicating them with `Alt + drag`, is undone in a single step.

A press of `Delete` or `Backspace`, or `Delete selected` or `Delete columns` in a context menu, is one step, however many tables, memos, table groups, or columns it removes.  
Toggling the primary key on several selected columns is one step, whether with `Alt + K` (Windows/Linux) or `⌥ + K` (Mac) or with `Primary Key on selected columns` in a table's context menu.  
Setting the color of the selection, or clearing it with `No color` or `Remove color`, is one step, however many tables, memos, and groups are selected. Picking a color that everything selected already has records no step, and neither does `No color` when nothing selected has a color.  
`Map` or `Save` in [Map Columns](./relationship-editing.md#map-columns) is one step, together with the foreign key columns it adds and the data types it changes.  
`Import and Add` is one step, together with the scroll that brings the added block into view when it needs one.

Picking a term from the list under a logical name cell is one step: the logical name, the physical name it derives, and for a column the term's domain with its data type — see [Completing Term Names](./logical-names.md#completing-term-names).  
Picking a domain in a column's Domain cell is one step, together with the data type it gives the column and what [Relationship DataType Sync](./settings.md#relationship-datatype-sync) carries along the relationships. Picking `None`, which unlinks the column, is one step too — see [The Domain Cell](./logical-names.md#the-domain-cell). Typing a data type other than its domain's into a linked column unlinks the column in the step of that input.  
`Derive Physical Name Again` or `Derive Physical Names Again` is one step, however many names, domain links, and data types it changes. It records no step only when it changes nothing. Giving a name of your own back to the dictionaries is a change, even when the name already holds what they give.

Creating a [table group](./table-groups.md), by drawing it or by grouping the selected tables with `Group selected tables` or `T` then `G`, is one step together with every table it takes in. Removing a group is one step, and undoing it brings the group back with its tables in it.  
Dragging a group by its title bar moves the group and all its tables in one step. Tables dropped into or out of a group change group in the same step as their drag when you let go within about `200ms` of the last movement, so one undo puts them back where they were and in the groups they were in. After a longer pause before letting go, the change of group is a step of its own, and the first undo takes back only that.  
Resizing a group by an edge or a corner is recorded once, when you let go.  
Applying [Auto Layout](./table-related-functions.md#auto-layout) is one step, the groups it fits round their tables included.

`Replace All` in [Find and Replace](./find-and-replace.md#replacing) is one step too, however many table names, column names, logical names, index names, table group names, comments, and memos it changes, the physical names and domain links the logical names derive included. When it changes nothing, as when `Preserve Case` writes every match back as it was, it records no step.  
A single `Replace` is one step, including what a logical name derives and the scroll to the next match when that match needs one. When it writes its match back as it was, it records only that scroll, or nothing when there is none.  
Going to a match scrolls the canvas only when the match does not already show well — see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands). That scroll is recorded like any other change of view position, so after moving through matches, Undo first takes back those scrolls, one per step.  
The other go-tos that land on the canvas record their scrolls the same way: choosing a row in the Explorer, a Quick Search result, a check on the Dictionary tab's `Checks` sheet that names a table or a column, or the external-link [card button](./visualization.md#card-buttons) in Flow. A go-to that leaves the view where it is records nothing. Choosing a row in the `Diff Viewer`'s list records nothing either, since it moves only the Diff Viewer's own read-only sides.

A continuous drag, canvas pan, zoom, pinch, or color change is buffered for about `200ms` and lands as one entry too.  
A drag that moves less than `20px` in total records no move. Only a change of group it makes, if any, is recorded.

Typing in a cell or a memo is recorded per input rather than per gesture: each typed character, each paste, and each step of an IME composition is a step of its own.  
A logical name cell is recorded the same way. When its editor closes on a logical name other than the one it opened with, the physical name the dictionaries derive from it is one more step after the typing. The first undo takes back only that name, with the domain and data type a term brought, and leaves the logical name you typed. When nothing is derived, nothing more is recorded — see [Writing a Logical Name](./logical-names.md#writing-a-logical-name).  
A table group's name is recorded once, when `Enter` or leaving the field saves it, so the name you type into a group you have just created is a step apart from creating it. `Esc`, or a name left unchanged, records nothing.

## Dictionary Sheets

The Dictionary tab's `Domains`, `Words`, and `Terms` sheets each keep a history of their own, apart from the diagram's. Every edit made on the tab goes into the history of the sheet whose rows it writes. Like the diagram's, each history keeps up to `2048` steps and lives in memory for the session.

- With the keyboard in the tab, `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac) undoes the last edit of the sheet shown, and `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac) redoes the last one undone.
- The toolbar's `Undo` and `Redo` do the same, and light up only when the sheet shown has an edit to undo or redo. Pressing them leaves the keyboard where it was, in the grid or the search field. The tab has no `Time Travel`.
- On `Checks`, where nothing is edited, the buttons stay unlit, and neither they nor the keys do anything.
- With a cell edit open, or the caret in the tab's search field, the keys undo and redo your typing there instead.

The histories never cross. Undo on the ERD tab never takes back a sheet's edit, and a sheet's Undo never takes back another sheet's edit or the diagram's. Each sheet keeps its history while you switch sheets or tabs.

Each of these is one step of its sheet:

- A cell edit, recorded once when it is written rather than per typed character, and only when it changes the value — see [Editing Cells](./dictionary.md#editing-cells).
- A paste, the rows it adds included, and clearing the selected cells with `Delete` or `Backspace` — see [Copying and Pasting](./dictionary.md#copying-and-pasting).
- `Add Row`, and each insert or deletion of rows, from the bar, the grid's menu, or the keys, however many rows it covers — see [Adding and Deleting Rows](./dictionary.md#adding-and-deleting-rows).
- A term's domain picked from its list, `None` included — see [A Term's Domain](./dictionary.md#a-terms-domain).
- A sort — see [Sorting](./dictionary.md#sorting).
- One CSV file imported with `Import CSV`, however many rows it adds or updates. It is a step of the sheet the file fills, which the tab then shows, whichever sheet you imported it from — see [Importing](./dictionary.md#importing).

A write that changes nothing, such as the same file imported again or a sort of a sheet already in that order, records no step, and neither does one refused with a `Nothing saved: …` toast. When a term with no `Physical Name` is given a name, the physical name its words compose is part of that edit's step.

A domain's new `Data Type` is one step of the `Domains` sheet, together with the types it gives the columns linked to the domain and those Relationship DataType Sync reaches from them — see [Domains and Data Types](./dictionary.md#domains-and-data-types).  
Undoing or redoing it retypes the columns linked to the domain at that moment, so a column you have since linked to another domain or retyped keeps its type. A column the step unlinked, such as a foreign key the sync took off a domain of its own, is linked again only while it is still unlinked and still holds the type the step left it with.

A `readonly` editor hides the buttons, and the keys undo and redo nothing.  
Changes from collaborators and coding agents are not recorded in a sheet's history either.

Every sheet's history is emptied when the dictionaries are replaced: by an `Import` of a JSON file, yours or a collaborator's, by its undo or redo, and by loading another diagram into the editor. A Schema SQL, GraphQL, DBML, or AML `Import` keeps the dictionaries, and with them every sheet's history, through its undo and redo too.

## Time Travel

Opens from the `Time Travel` button in the toolbar, next to Undo and Redo on the ERD tab.  
The button does nothing until the diagram's history has at least one recorded change. A read-only editor shows no such button, and an editor that turns read-only closes Time Travel without applying it.

Time Travel opens a separate, read-only copy of the diagram, at the scroll position, zoom level, and [Name View](./logical-names.md#name-view) the canvas is showing, whether or not the `Viewport` or `Name View` lock is on.  
It steps through the diagram's history alone, so the Dictionary sheets' edits are not among its points.  
Drag the slider, or click anywhere on its track, to move through the whole edit history and preview each point. The slider's leftmost position is the state one step before the first recorded change, and it opens with the thumb on the current state.  
The preview is inert: it draws a minimap, but you cannot pan, scroll, or edit it, and the real document stays untouched until you apply.

Press `Apply` to restore the selected point, or `Cancel` or `Esc` to leave the document unchanged.

![Opening Time Travel, dragging the slider back through the session, and applying an earlier point](/img/demo-time-travel.webp)
