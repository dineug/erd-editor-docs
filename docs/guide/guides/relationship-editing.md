---
sidebar_position: 5
description: Delete a relationship, change its type, set its ON DELETE and ON UPDATE actions, read the connector notation, work with N:M and identifying relationships, and see how new foreign key columns are named.
---

# Relationship Editing

Relationships are drawn from the canvas context menu, the canvas toolbar, [Quick Search](./quick-search.md#what-the-palette-lists), or with a shortcut — see [Editing Start](./editing-start.md).  
This page covers what you can do with one once it exists, and how the foreign key columns it adds are named.

## Deletion

Possible to delete via the relationship context menu.

![Deleting the products-to-reviews relationship from its context menu](/img/demo-relationship-remove.webp)

There is no shortcut for it, because a relationship is not selected the way a table or a memo is.  
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

Set through `On Delete` and `On Update` in the relationship context menu, between `Relationship Type` and `Delete`.  
Each offers the same six items, and the current one is marked with a check:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` writes no clause, so the database's own default applies. A newly drawn relationship starts with both at `Not set`, and choosing `Not set` later clears an action.  
The two are independent: changing one leaves the other as it is.  
The connector shows what is set — see [Reading a Connector](#reading-a-connector).  
A relationship copied and pasted, or duplicated, along with its tables keeps both actions, and importing Schema SQL, DBML, or AML brings in the actions the file declares — see [Importing or Exporting Files](./file-import-export.md).

![Setting ON DELETE CASCADE and ON UPDATE RESTRICT on the orders-to-order_items relationship from its context menu, then hovering the connector to read them back](/img/demo-referential-actions.webp)

Every action can be chosen whatever the database is.  
An action that the selected [database](./table-related-functions.md#databases) leaves out of its Schema SQL carries a muted note beside it, such as `not in MySQL`. `Not set` never carries one, and switching the database updates the notes.  
A noted action is still stored on the relationship: the connector shows it, and JSON, DBML, and AML keep it, but that database's Schema SQL leaves the clause out, so the database's default applies.

Schema SQL writes these actions and leaves out the rest:

| Database | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | none |
| PostgreSQL | all five | all five |
| Snowflake | all five | all five |
| SQLite | all five | all five |

Which actions the Code Generator's ORM targets write depends on the target as well as the selected database — see [Code Generator](./code-generator.md#on-delete-and-on-update).

## N:M Relationships

Because the editor is based on the physical model, an N:M relationship is expressed with a mapping table, as shown below.

![Drawing relationships from products and tags into the product_tags mapping table](/img/demo-relationship-n-m.webp)

Importing GraphQL, DBML, or AML builds the mapping table for you.  
A many-to-many declaration arrives as a table named `<left>_<right>`, commented `Junction table inferred from <left> <-> <right>`, joined to both sides by identifying relationships.  
See [Importing or Exporting Files](./file-import-export.md).

## Identifying Relationships

Drawing a relationship copies each primary key of the parent table onto the child table as a `NOT NULL` foreign key column, so a new relationship starts out non-identifying.  
The copy takes the key's data type, default, and comment, but not `Unique` or `Auto Increment`, and is named as described in [Foreign Key Column Names](#foreign-key-column-names).  
To make it identifying, set those foreign key columns on the child table as primary keys with `Alt + K` or `Primary Key` in the table context menu.

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
Relationships that arrive with their columns already in place — from an import, a paste, or a duplicate — keep the names those columns have.  
A coding agent adding a relationship with `erd_add_relationship` gets the same names — see [Tools](../../mcp/tools.md#relationships).

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

Hide connectors on the ERD canvas with the `Relationship` view option, or only their labels with the `Referential Actions` view option, which is on by default — see [Table View Options](./table-related-functions.md#table-view-options).  
Labels are not drawn at `70%` and below, where tables collapse to their name. A PNG export draws them as the canvas does.  
[Flow mode](./visualization.md#flow-mode) on the Visualization tab draws connectors even with `Relationship` off, each as one smooth solid gray curve with the same end marks, so the dashed line, the labels, the tooltip, and the routing described on this page apply to the ERD canvas only.

## Connector Routing

Connectors are routed orthogonally.  
A route bends around the tables that sit between its two ends instead of crossing them, and its corners are cut at 45 degrees.  
Routes leaving the same side of a table are spread onto separate corridors so they do not run down one another.

There is nothing to configure.  
Routes are recalculated automatically whenever anything on the canvas moves or resizes, so they never need touching by hand.

![Dragging the members table down and back while its connectors re-route around categories](/img/demo-connector-routing.webp)
