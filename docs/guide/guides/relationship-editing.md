---
sidebar_position: 7
description: Delete a relationship, change its type, set its ON DELETE and ON UPDATE actions, map it onto existing columns with Map Columns, read the connector notation, work with N:M and identifying relationships, and see what new foreign key columns copy from their key and how they are named.
---

# Relationship Editing

Relationships are drawn from the canvas context menu, the canvas toolbar, [Quick Search](./quick-search.md#what-the-palette-lists), or with a shortcut — see [Editing Start](./editing-start.md).  
This page covers what you can do with one once it exists, how [Map Columns](#map-columns) ends one on columns the child table already has, and how the foreign key columns it adds are named.

## Deletion

Possible to delete via the relationship context menu.

![Deleting the products-to-reviews relationship from its context menu](/img/demo-relationship-remove.webp)

There is no shortcut for it, because a relationship is not selected the way a table or a memo is: `Delete` and `Backspace`, which remove what is selected, never remove a relationship on its own — see [Table and Memo Deletion](./table-related-functions.md#table-and-memo-deletion).  
Relationships are also removed together with what they connect: deleting a table removes every relationship touching it, and deleting a column removes every relationship that uses it.

## Type Change

Change available through `Relationship Type` in the relationship context menu.  
Four types are offered, and the current one is marked with a check:

- Zero One
- Zero N
- One Only
- One N

![Changing a relationship from Zero N to One Only and then One N in its context menu](/img/demo-relationship-type.webp)

These are the same four types you start a relationship with, each with its own shortcut — see [Editing Start](./editing-start.md).

## ON DELETE and ON UPDATE

Set through `On Delete` and `On Update` in the relationship context menu, between `Relationship Type` and `Map Columns`.  
Each offers the same six items, and the current one is marked with a check:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` writes no clause, so the database's own default applies. A new relationship, drawn or made in [Map Columns](#map-columns), starts with both at `Not set`, and choosing `Not set` later clears an action.  
The two are independent: changing one leaves the other as it is.  
The connector shows what is set — see [Reading a Connector](#reading-a-connector).  
A relationship copied and pasted, or duplicated, along with its tables keeps both actions, and importing Schema SQL, DBML, or AML brings in the actions the file declares — see [Importing or Exporting Files](./file-import-export.md).

![Setting ON DELETE CASCADE and ON UPDATE RESTRICT on the orders-to-order_items relationship from its context menu, its label reading D:C U:R, then hovering to read both back](/img/demo-referential-actions.webp)

Every action can be chosen whatever the database is.  
An action that the selected [database](./table-related-functions.md#databases) leaves out of its Schema SQL carries a muted note beside it, such as `not in MySQL`. `Not set` never carries one, and switching the database updates the notes.  
A noted action is still stored on the relationship: the connector shows it, and JSON, DBML, and AML keep it, but that database's Schema SQL leaves the clause out, so the database's default applies.

[Schema SQL](./schema-sql.md) writes these actions and leaves out the rest:

| Database | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | none |
| PostgreSQL | all five | all five |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | all five | all five |

Snowflake's Schema SQL also writes a comment naming each action it leaves out — see [Referential Actions](./schema-sql.md#referential-actions).

Which actions the Code Generator's ORM targets write depends on the target as well as the selected database — see [Code Generator](./code-generator.md#on-delete-and-on-update).

## Map Columns

Map Columns pairs the parent table's key with columns of the child table, one row per key column.  
Each row either uses a column the child already has or adds a new foreign key column, so a relationship can end on columns that are already in place.

![Drawing a Zero N relationship from members onto orders, choosing Map to existing columns, and mapping id onto the existing member_id column](/img/demo-map-columns.webp)

It opens in two ways:

- While drawing a relationship, from `Map to existing columns` beside the child table — see [Relationship Creation](./editing-start.md#relationship-creation). `Map` then adds a relationship of the type being drawn.
- From `Map Columns` in the relationship context menu, to change the columns of a relationship that exists. `Save` then writes the change. A read-only editor leaves this item out.

The dialog's subtitle names the two tables and the relationship type, such as `users → posts · One N`. The type is shown here but not changed — use [Type Change](#type-change).

Throughout the dialog, the notes and lines under the rows and the toast it closes with included, tables and columns are named as the [Name View](./logical-names.md#beyond-the-canvas) names them.  
Three things stay physical: each data type, which is the column's own and never its domain's name; `New column: <name>`, which shows the name the new column will get; and the rows `Map` starts filled, which it pairs by name, never by logical name.

`References` chooses the key the relationship points at: `Primary Key`, with its columns in table order, then `Unique: <column>` for each column marked `Unique`. It shows only when there is more than one choice.  
A unique index does not count as a key here, and a `Unique` column that is the whole primary key is not listed twice.  
Choosing another key rebuilds the rows. A row keeps its pick while that column is still in the child table.

Under the headings `Referenced column` and `Foreign key column`, each row shows a column of the key with its data type, and a list of the child's columns to pair it with:

- `Pick a column` leaves the row empty.
- `New column: <name>` adds a new foreign key column. The name shown is the one it will get, as described in [Foreign Key Column Names](#foreign-key-column-names), numbered against the child's columns and the other rows that add a new column. It is not offered when the name would be blank, as for a key without a name.
- Every column of the child table, as `<name> (<data type>)`. A column another row has picked reads `<name> (<data type>) · in use` and cannot be picked, so no two rows share one. A column another relationship already uses can still be picked, so a column such as a shared `tenant_id` can serve several relationships.

With `Map`, a row starts filled only when exactly one child column, ignoring case, has the name a new foreign key column for it would get before any `_2` numbering, such as `users_id` for `id` on `users` and `member_id` for `member_id`. While [`Bracket`](./schema-sql.md#database-and-bracket) is `None`, the default, the name built from the table part of a schema-qualified table name also counts, so `id` on `public.users` is paired with `public.users_id` or `users_id`. For a `Unique` key, the key column's own name counts too, so `vin` is paired with `vin`. Every other row starts at `Pick a column`.  
With `Save`, each row starts on the column the relationship uses now. With either, choosing another key in `References` fills that key's empty rows by the same names.

When a picked column's data type differs from the one the parent column gives a foreign key, a note under the row says so.  
With [Relationship DataType Sync](./settings.md#relationship-datatype-sync) on and a data type on the parent column, it reads `<column> becomes <type>`, the type the mapping will write. Otherwise it reads `Types differ: <parent type> and <child type>`, and the column keeps its type.

`Map` or `Save` stays disabled while something stands in the way, and a line under the rows says what:

- `Pick a foreign key column for every referenced column`: a row is still empty.
- `At least one column must reference a different column`: a self-referencing relationship in which every row picks its own parent column.
- `These columns are already linked by another relationship`: another relationship between the same two tables links exactly these columns.
- `<parent> has no key to reference`: with `Map`, the parent has neither a primary key nor a `Unique` column.

`Save` also stays disabled until the mapping differs from the relationship's current one.  
With `Save`, a row reads `(removed)` when its column has left its table. Pick another child column, or, for a parent column that is gone, choose a key in `References`. With `Map`, a row whose picked column is removed goes back to `Pick a column`.

A relationship whose parent columns are not exactly one of the parent's keys opens on an extra choice at the end of `References`, `Current columns (not a key)`, which keeps those columns as they are. When the parent has no key at all, that is the only choice and `References` is not shown.  
There the line `The referenced columns are not a key of <parent>`, or `<parent> has no key to reference` when the parent has no key at all, is a notice, not an error: `Save` still works, so you can change the child columns and keep the reference.  
A relationship whose two column lists cannot be paired, for example because they differ in length, shows `(invalid)` rows and keeps `Save` disabled until you choose a key in `References`, or add a primary key or `Unique` column to the parent if it has none.

The dialog follows the diagram while it is open, a collaborator's or a coding agent's edits included, and keeps what you picked.  
If the relationship's columns or the key it opened on change meanwhile, it adds the line `This relationship changed while the dialog was open`.

What `Map` and `Save` write:

- `Map` adds the relationship with `On Delete` and `On Update` at `Not set`. `Save` changes only the relationship's columns, pointing its parent side at the key chosen in `References`, and keeps its type and its ON DELETE and ON UPDATE.
- A `New column` row adds a column at the end of the child table, as drawing does: `NOT NULL`, named after its key, with the key's data type, default, comment, logical name, and domain — see [Identifying Relationships](#identifying-relationships).
- A picked column is never renamed or linked to the key's domain, and its `Not Null`, primary key, `Unique`, default, comment, and logical name stay as they are. Its data type changes only while `Relationship DataType Sync` is on and the parent column has a data type: it takes the type the parent column gives a foreign key, the integer type for a serial key as for a new column, and the change carries on along the relationships the way the sync does. Every column the change retypes, picked or reached along the relationships, is unlinked from its [domain](./dictionary.md#domains-and-data-types) when its new type differs from the domain's.
- A column the mapping stops using stays in the child table, and is no longer marked as a foreign key unless another relationship still ends on it.
- Everything one `Map` or `Save` writes — new columns, type changes, and domain unlinks included — is one undo step.

Whether the relationship is identifying, and how its parent end is drawn, are read off the mapped child columns as for any relationship. Mapping onto the child's primary key columns makes it identifying at once, and mapping onto a column that allows `NULL` puts a ring at the parent end — see [Reading a Connector](#reading-a-connector).  
Schema SQL's foreign key references the key you chose, such as `REFERENCES vehicle (vin)` for a `Unique` key.

If the diagram already holds the mapping when you press `Map` or `Save`, because a collaborator or a coding agent got there first, nothing is written.  
If it has changed so that the mapping no longer fits, nothing is written and a toast says `Couldn't map columns: the diagram changed`.

`Cancel`, the `x` button, `Escape`, or a click on the dimmed area outside the dialog closes it without writing anything.  
The dimmed area covers the whole editor, the toolbar included, and an open [Explorer](./explorer.md#dialogs-beside-it) stays open under it.  
Opening Quick Search closes the dialog too, and so does leaving the ERD tab or the editor turning read-only.  
`Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) closes it as well and puts the caret in the Find field of the Explorer's [search](./find-and-replace.md#opening-and-closing), opening the Explorer if it is closed. In an editor too narrow to show the Explorer, it still closes the dialog but shows a toast instead of moving the caret — see [Opening and Closing](./explorer.md#opening-and-closing).  
If one of its tables or the relationship is removed while it is open, it closes with a toast such as `Map Columns closed: the relationship was removed`.  
While it is open, the canvas shortcuts, undo and redo, and copy and paste do nothing.

A coding agent has no Map Columns tool. It re-maps a relationship by removing it with `erd_remove_relationship`, which keeps its foreign key columns, and drawing it again on existing columns with `erd_link_columns`, both in one `erd_batch` — see [Tools](../../mcp/tools.md#relationships).

## N:M Relationships

Because the editor is based on the physical model, an N:M relationship is expressed with a mapping table, as shown below.

![Drawing relationships from products and then tags into the empty product_tags table with ⌘ + ⌥ + 2, adding product_id and then tag_id](/img/demo-relationship-n-m.webp)

When the mapping table already has its key columns, such as `product_id` and `tag_id` on `product_tags`, draw each relationship with `Map to existing columns` and pick those columns instead of adding new ones — see [Map Columns](#map-columns). If they are the mapping table's primary key, each relationship is identifying at once.

Importing GraphQL, DBML, or AML builds the mapping table for you.  
A many-to-many declaration arrives as a table named `<left>_<right>`, commented `Junction table inferred from <left> <-> <right>`, joined to both sides by identifying relationships.  
See [Importing or Exporting Files](./file-import-export.md).

## Identifying Relationships

Drawing a relationship by clicking the child table, or with `Create new columns`, copies each primary key of the parent table onto the child table as a `NOT NULL` foreign key column, so a new relationship starts out non-identifying.  
The copy takes the key's data type, default, comment, and logical name, but not `Unique` or `Auto Increment`, and is named as described in [Foreign Key Column Names](#foreign-key-column-names).  
A serial key is the exception to the data type: its copy takes the integer type the serial stores. Under any database, `smallserial` and `serial2` give `smallint`, `serial4` gives `integer`, and `bigserial` and `serial8` give `bigint`. A bare `serial` gives `integer` under PostgreSQL and `bigint unsigned` under MySQL and MariaDB, and stays `serial` under any other database.  
Only the whole type name counts, ignoring case, so `serial(4)` is copied as written. A type written in capitals gives capitals: `SERIAL` gives `INTEGER` under PostgreSQL. A foreign key column already typed `serial` in a saved diagram keeps that type.  
The copy is also linked to the key's [domain](./dictionary.md#domains-and-data-types), provided the `Domains` sheet lists that domain when the copy is made and the copy keeps the key's data type. So a serial key's copy that takes an integer type links no domain, while a bare `serial` kept as `serial` links it.  
To make the relationship identifying, set those foreign key columns on the child table as primary keys: select them all and press `Alt + K` (Windows/Linux) or `⌥ + K` (Mac) once, or choose `Primary Key` in the table context menu, which reads `Primary Key on selected columns` while two or more are selected — see [Column Primary Key](./table-editing.md#column-primary-key).

![Toggling product_id as a primary key with Alt + K, turning its connector solid, then dashed](/img/demo-identifying-relationship.webp)

The editor keeps this in step on its own.  
A relationship is identifying while every column on its child side is a primary key, and turns non-identifying as soon as one of them is not.

## Foreign Key Column Names

Drawing a relationship names each foreign key column it adds after the parent key that column copies:

- A key name of one word, such as `id`, `ID`, or `uuid`, gets the parent table's name and an underscore in front: `id` on `products` becomes `products_id`.
- A key name of several words, such as `member_id`, `userId`, or `UserID`, is kept as it is.
- A one-word key name that is the table's own name, ignoring case, is kept too: `currency` on `currency` stays `currency`. A key that merely contains the table's name still gets the prefix: `username` on `user` becomes `user_username`.

A name is one word when it holds only letters and digits, with no break in case.  
Any other character splits it, so `_id`, `order no`, and `order-no` are several words.  
So does a break in case, read the way camelCase is: a lowercase letter followed by a capital (`userId`), two capitals followed by a lowercase letter (`IDCard`, `IDs`), or a letter of a script without case, such as Hangul, kana, or Han, next to a letter with case (`회원ID`).  
Digits do not split a word, so `id2` and `SHA256` are one word. A compound written in one case is one word too: `memberid` on `members` becomes `members_memberid`.

The table name is used as it is written, apart from surrounding spaces: its case, inner spaces, and dots are kept, it is not made singular, and the Code Generator's `Table Name Case` and `Column Name Case` play no part. `Users` with the key `ID` gives `Users_ID`.  
Each column of a composite key is named on its own: `orders` with the key (`tenant_id`, `id`) adds `tenant_id` and `orders_id`.

A name the child table already has, ignoring case, is numbered with `_2`, `_3`, and so on, taking the first number that is free.  
A second relationship from `users`, keyed by `id`, into the same table adds `users_id_2`, and a self-reference on `members`, keyed by `member_id`, adds `member_id_2`.  
The columns of one composite key are numbered against each other the same way, and a name kept as it is claims its place first: `user` with the key (`id`, `user_id`) adds `user_id` for `user_id` and `user_id_2` for `id`.

A parent table without a name leaves the key name as it is, numbered like any other on a clash.  
A key without a name gives a foreign key column without a name.  
That includes the primary key the editor adds to a parent that has none, unless you name it before clicking the child table.

The names are set when the relationship is drawn. Renaming the parent table or its key later does not rename them.  
The `New column` rows of [Map Columns](#map-columns) are named by the same rules, and the list shows each name before you choose it.  
Relationships that arrive with their columns already in place — from an import, a paste, a duplicate, or Map Columns pairing existing columns — keep the names those columns have.  
A coding agent adding a relationship with `erd_add_relationship` gets the same names, data types, logical names, and domains — see [Tools](../../mcp/tools.md#relationships).

A foreign key column is named after its key, never after the logical name it copies, and its name counts as one you wrote: a logical name written on the column later leaves the name as it is, unless the name is empty — see [Names of Your Own](./dictionary.md#names-of-your-own).  
While the copied logical name matches a term that gives another name, the `Checks` sheet therefore lists the column under [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Deriving its physical name again renames it from the dictionaries, unless another column of the child table already holds the name they give, ignoring case — see [Derive Physical Names Again](./dictionary.md#derive-physical-names-again).

## Reading a Connector

- An identifying relationship is drawn as a solid line, a non-identifying one as a dashed line.
- The child end carries the cardinality symbol of the relationship type: a ring and a bar for Zero One, a ring and a crow's foot for Zero N, two bars for One Only, and a bar and a crow's foot for One N.
- The parent end is a ring and a bar, like Zero One, when any of the foreign key columns allows `NULL`, and two bars, like One Only, when they are all `NOT NULL`.
- Hovering a connector highlights it along with the columns it links in both tables.

![Hovering three connectors in turn, each lighting up with the columns it links](/img/demo-relationship-hover.webp)

A relationship that sets [ON DELETE or ON UPDATE](#on-delete-and-on-update) carries a label beside its child end, such as `D:C U:R`: `D:` and the ON DELETE action, then `U:` and the ON UPDATE action, each only when it is set.  
The actions are abbreviated after erwin's notation: `C` for CASCADE, `R` for RESTRICT, `SN` for SET NULL, `SD` for SET DEFAULT, and `NA` for NO ACTION. A relationship that sets neither has no label.  
The label sits on the side away from the child table, above the line when the connector leaves that table's left or right side and to its right when it leaves the top or bottom, clear of the cardinality symbol.  
It is drawn in the connector's color on a small box of the canvas background, and lights up together with its connector. Labels are drawn on top of every connector, so a line crossing one runs underneath it.  
It shows the action stored on the relationship whatever the selected database writes, so ON DELETE SET DEFAULT still reads `D:SD` on MySQL.

Hovering a connector that sets either action also shows a tooltip spelling the clauses out, one per line, such as `ON DELETE CASCADE` and `ON UPDATE RESTRICT`.  
The tooltip appears even while the label is hidden.

Going to a relationship lights it: choosing a row under a table's `Foreign Keys` folder in the [Explorer](./explorer.md#going-to-a-row), or a foreign key row in the [Diff Viewer](./table-related-functions.md#going-to-a-change), draws its connector and its label in the hover color. In the Diff Viewer it lights the connector on each side that holds the relationship, so an added foreign key lights the current side only and a removed one the saved side only.  
The jump selects the child table alone with its foreign key columns, the focused cell on the first of them; the relationship itself is still never selected. For where the view goes, see [Where a Jump Lands](./table-related-functions.md#where-a-jump-lands).  
The light goes out at the next left or right press on the canvas, whether on an empty spot, a table, a memo, a table group, or a connector, even a press that leaves the selection as it was. Going to another row or search match in the Explorer puts it out too, and so does going to another row in the Diff Viewer, on each side that row goes to.  
Panning with the middle button or the hand tool leaves it lit, and so do folding or unfolding a row in the Explorer or the Diff Viewer, clearing the selection with `Escape`, and a jump from [Quick Search](./quick-search.md) or Flow's external-link [card button](./visualization.md#card-buttons).  
The light is not saved and is not in the undo history, and collaborators do not see it.

Hide connectors on the ERD canvas with the `Relationship` view option, or only their labels with the `Referential Actions` view option, which is on by default — see [Table View Options](./table-related-functions.md#table-view-options).  
Labels are not drawn at `70%` and below, where tables collapse to their name.  
An [image export](./file-import-export.md#image) is always drawn at 100%, so it draws the labels whatever the canvas zoom, unless a view option hides them. With `Background` off, the box behind each label is transparent too.  
[Flow mode](./visualization.md#flow-mode) on the Visualization tab draws connectors even with `Relationship` off, each as one smooth solid gray curve with the same end marks, so the dashed line, the labels, the tooltip, the light after a jump, and the orthogonal routing described on this page apply to the ERD canvas only. A relationship from a table to itself curves round the top-right corner in Flow too — see [Connector Routing](#connector-routing).

## Connector Routing

Connectors are routed orthogonally.  
A route bends around the tables that sit between its two ends instead of crossing them, and its corners are rounded.  
Each end leaves its table in a short straight run before it turns, so two tables a short way apart whose connector ends line up are joined by one straight line rather than a detour.  
Routes leaving the same side of a table are spread onto separate corridors so they do not run down one another.  
Only tables are avoided: a connector may cross a memo or a table group's box, and is drawn above table groups and below tables and memos.

A relationship from a table to itself is drawn as one curve round the table's top-right corner, leaving the top side at the parent end and entering the right side at the child end.  
Further self-references on the same table nest outside the first, so their curves do not cross one another or the table.

There is nothing to configure.  
Routes are recalculated automatically whenever anything on the canvas moves or resizes, so they never need touching by hand.

![Dragging the members table down and back while the connector from orders swaps between passing right of categories and round its left, every corner rounded](/img/demo-connector-routing.webp)
