---
sidebar_position: 11
description: Read the diagram's DDL on the Schema SQL tab, pick the database, quoting, statements, header, and tables in its options panel, add your own scripts before and after the tables, and save or copy the SQL.
---

# Schema SQL

The `Schema SQL` tab shows the diagram's DDL for the selected database: the SQL that creates its tables with their keys, indexes, and foreign keys.  
Switch to the `Schema SQL` tab in the toolbar, or choose `Schema SQL` under `Tab` in [Quick Search](./quick-search.md). Choosing `Schema SQL` from the `Export` submenu opens it as well, ready to save — see [Saving or Copying the SQL](#saving-or-copying-the-sql).

The SQL sits on the left, and on its right an options panel headed `Schema SQL` holds the choices that shape it — see [Options Panel](#options-panel). In a right-to-left display language too, the SQL stays on the left and reads left to right.  
The panel opens on its own unless the editor is narrower than 640 px when the tab first opens. `Hide options` in the panel's header folds it away, and `Show options` at the top right of the code brings it back. It then stays open or folded as you left it, across tab switches, for as long as the editor is open. It folds and opens independently of the Code Generator tab's panel, and is never saved in the file.

![Opening Export > Schema SQL, switching the statements to Drop & re-create and the header to USE, then adding a SET NAMES script before the tables](/img/demo-schema-sql-options.webp)

Right-click the SQL to open its context menu:

- `Database` and `Bracket`, each a submenu that checks the current value.
- `Statements` and `Header`, each a submenu that checks the choice in effect. A choice the database does not have carries a muted note such as `not in Oracle` and does nothing.
- `Options panel`, checked while the panel shows, which folds or opens it.
- `Save file`

While this tab is open, Quick Search offers `Database` and `Bracket`; `Schema SQL: Statements` and `Schema SQL: Header`, which list only the choices the database has; and `Schema SQL: Options panel`, which folds or opens the panel.

The SQL is written when the tab opens, and again whenever one of the panel's choices, the database name, or a script changes. An edit made to the tables while the tab is open, such as a collaborator's or a coding agent's, shows once you leave the tab and come back, or once one of those changes.

[Table Properties](./table-related-functions.md#table-properties) has a `Schema SQL` tab of its own, which shows one table's DDL. It always writes plain `CREATE` statements with no header or scripts, has no options panel, and its context menu offers only `Database` and `Bracket`.

## Options Panel

The panel holds three groups, each under a caption:

1. `Saved in the document`: `Database` and `Bracket` — see [Database and Bracket](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, and, while the diagram has a [table group](./table-groups.md), `Tables` — see [Statements](#statements), [Header](#header), and [Tables](#tables).
3. `Saved in the document · written as is for every database`: the `Before tables` and `After tables` scripts — see [Before and After Scripts](#before-and-after-scripts).

`Save file` and `Copy` sit at its foot — see [Saving or Copying the SQL](#saving-or-copying-the-sql).

The choices under `This window only` belong to the editor window you make them in. They are not saved in the document, shared with collaborators, or recorded for undo, and they reset when the editor is closed or reloaded; switching tabs keeps them.  
`Statements` starts at `If not exists` and `Header` at `CREATE + USE`. The SQL a page embedding the editor reads with [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), and the SQL a coding agent reads, start at `Create` with no header instead.

A choice the selected database does not have stays in the panel, dimmed, with the tooltip `Not in <database>`, such as `Not in Oracle`, and pressing it does nothing.  
The SQL then uses the nearest form the database has, and that form's button shows pressed: `If not exists` falls back to `Create`, `CREATE + USE` to `USE`, or to `None` where the database has no `USE` either, and `USE` to `None`. Your choice is kept, so switching to a database that has it brings it back.

## Database and Bracket

`Database` is the diagram's database, the same setting as the canvas context menu's `Database` and the Code Generator's — see [Databases](./table-related-functions.md#databases). It lists Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, and SQLite, starts at MySQL, and is saved in the file like any edit.

`Bracket` sets the quote wrapped around table, column, constraint, and index names: `SingleQuote`, `DoubleQuote`, `Backtick`, or `None` for no quoting at all, which is the default. It is the same setting as the Code Generator's — see [Bracket](./code-generator.md#bracket).  
Snowflake, which quotes names only with double quotes, uses them under any choice but `None`, and Databricks always quotes names with backticks.  
`Bracket` is saved in the file only while the `Bracket Type` lock on the Settings tab is off, and a new diagram has every lock on. While the lock is on, a change rewrites the SQL on your screen, but the file keeps the locked value and the diagram reopens with it — see [Lock](./settings.md#lock).

While the database is Oracle and the SQL holds a name longer than 30 bytes, which Oracle 12.1 and older refuse, a note under the two lists names each one: `Oracle 12.2+ for names over 30 bytes: <names>`. It checks table, column, schema, key, index, sequence, and trigger names. The SQL itself does not change.

## Statements

`Statements` decides how the tables are created:

- `Create` writes plain `CREATE` statements.
- `If not exists` skips the tables and indexes that already exist. MySQL, MariaDB, PostgreSQL, SQLite, and Databricks have it; MSSQL, Oracle, and Snowflake write `Create` instead.
  - MySQL writes each table as `CREATE TABLE IF NOT EXISTS` with its unique constraints, indexes, and foreign keys inside it, and puts the whole batch between `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` and `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB puts `IF NOT EXISTS` on each statement: the `CREATE TABLE`, each `UNIQUE` and `FOREIGN KEY` constraint, and each `CREATE INDEX`.
  - PostgreSQL writes `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`, and drops each foreign key with `DROP CONSTRAINT IF EXISTS` before adding it again.
  - SQLite writes `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
  - Databricks writes `CREATE TABLE IF NOT EXISTS`, and drops each foreign key with `DROP CONSTRAINT IF EXISTS` before adding it again.
- `Drop & re-create` drops every table it writes before creating them again, except on Snowflake. Every database has it:
  - MySQL and MariaDB write a `DROP TABLE IF EXISTS` for each table, between the same two lines that turn the foreign key checks off and back on.
  - PostgreSQL writes one `DROP TABLE IF EXISTS` naming every table, which fails if a table outside the list references one of them. Under a `CREATE + USE` header, a table whose name gives no schema is dropped from that schema, such as `shop.member`.
  - MSSQL writes one transaction, which needs SQL Server 2016 or later, as the button's tooltip `SQL Server 2016+` says. It drops the foreign keys the written tables hold, then the tables with one `DROP TABLE IF EXISTS`, and rolls back on an error. A foreign key held by a table outside the list still blocks the drop.
  - SQLite writes `PRAGMA foreign_keys=OFF;`, which stays off for that connection, then a `DROP TABLE IF EXISTS` for each table.
  - Oracle writes `DROP TABLE … CASCADE CONSTRAINTS` for each table and `DROP SEQUENCE` for each auto-increment sequence, each in a PL/SQL block that ends with a `/` line and passes over the error a missing table or sequence raises.
  - Databricks writes a `DROP TABLE IF EXISTS` for each table.
  - Snowflake drops nothing and writes `CREATE OR REPLACE TABLE` instead.

While `Drop & re-create` is in effect, a warning in the panel names the tables it drops: `Drops <tables> before creating them. Their rows are lost.`, or on Snowflake `Replaces <tables>. Their rows are lost.`  
Up to five tables are named in full. Past five, the warning names the first four and counts the rest, such as `a, b, c, d, and 3 more tables`.

## Header

`Header` opens the SQL with the statements that create or select the database, or the schema, it runs in. The name is the diagram's database name, typed in the `database name` field of the toolbar, and is quoted with the `Bracket` character.

- MySQL and MariaDB: `USE` writes `USE shop;`, and `CREATE + USE` writes `CREATE DATABASE IF NOT EXISTS shop;` before it.
- MSSQL: `USE` writes `USE shop` and `GO`, and `CREATE + USE` writes `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` and `GO` before it.
- PostgreSQL has only `CREATE + USE`, which writes `CREATE SCHEMA IF NOT EXISTS shop;` and `SET search_path TO shop, public;`.
- Oracle has only `USE`, which writes `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` falls back to it, so this is the line Oracle writes under the tab's default header.
- Snowflake and Databricks: `USE` writes `USE SCHEMA shop;`, and `CREATE + USE` writes `CREATE SCHEMA IF NOT EXISTS shop;` before it.
- SQLite has neither, and writes no header.

Where the database has `USE` or `CREATE + USE`, the button's tooltip names what it writes there, such as `CREATE SCHEMA + SET search_path` on PostgreSQL.

A header is written only while the database name is a plain identifier: an ASCII letter (`A`–`Z`, `a`–`z`) or `_`, followed by ASCII letters, digits, or `_`.  
Any other name, a blank one included, writes no header, and PostgreSQL's `DROP TABLE` then names no schema. While a header other than `None` is in effect, a note under `Header` says so: `Database name "<name>" is not a valid identifier.`  
A new diagram's database name is blank, so until you name it the panel shows `Database name "" is not a valid identifier.`

## Tables

While the diagram has at least one [table group](./table-groups.md), shown or hidden, `Tables` appears under `This window only` with a checkbox for each choice:

- `All`, which checks or unchecks every box. It shows a mixed state while only some are checked.
- One box per table group, in the diagram's group order, labeled with the group's name, or `unnamed` for a group without one, after a dot in the group's color when it has a color.
- `No group`, for the tables in no group.

With every box checked, the tab writes the whole diagram.  
With only some checked, it writes the tables of the checked boxes with their indexes and the foreign keys they hold, including one that references a table left out. The before and after scripts are still written, and `Drop & re-create`, its warning, and the Oracle note on long names cover only those tables.  
With no box checked, the tab writes nothing, and a hint over the code reads `No tables chosen. Check some under Tables.` `Save file` then saves an empty file, and `Copy` copies empty text.

Like `Statements` and `Header`, the choice belongs to the window — see [Options Panel](#options-panel).  
A group added later starts checked only if every box was checked at that moment. Removing a group drops its box, and removing the last group checks everything again.  
The choice applies to this tab alone. The `Schema SQL` tab of Table Properties and `getSchemaSQL()` are not affected by it.

## Before and After Scripts

`Before tables` and `After tables` hold SQL of your own, such as `CREATE EXTENSION` or `SET` statements before the tables, or grants, views, and seed data after them.  
They are saved in the document, one pair for the whole diagram whatever the database. Each is written into the SQL as you typed it, never checked: the before script after the header and before the `DROP` statements and the tables, the after script at the very end.

Line breaks are written as LF, and the blank lines before a script and the whitespace after it are dropped.  
On MSSQL, a `GO` line is added after a script whose last line is not `GO` (or `GO` with a count), as the line under the two fields says. On Oracle, end a PL/SQL block with its `/` line yourself.

The fields highlight SQL and grow with their text.  
An edit is applied when you leave the field, by clicking elsewhere or switching tabs, and only then do the SQL beside it and the document change. A field you only clicked into changes nothing.  
A script edit changes the diagram like any other edit: it is saved in the file, collaborators see it, and each applied edit is one step in the [undo history](./undo-redo.md), which you undo from the ERD tab.  
While you type in a field, the editor's own shortcuts are left to it, so `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac) undoes your typing there, and copy, cut, and paste act on the text rather than on the diagram.  
Quick Search and the [Explorer's search](./find-and-replace.md) still open from their shortcuts, `Ctrl + K` and `Ctrl + F` (Windows/Linux) or `⌘ + K` and `⌘ + F` (Mac). Because `Ctrl + F` or `⌘ + F` switches to the ERD tab, it applies your edit, as any tab switch does.  
A field without the keyboard focus follows a change a collaborator or a [coding agent](../../mcp/tools.md#settings) makes to its script. A field you are in shows that change when you leave it without having typed. If you typed, your text is applied when you leave and replaces theirs.

## Saving or Copying the SQL

`Save file`, at the foot of the panel or in the context menu, saves exactly the SQL the tab shows, with its current database, bracket, statements, header, tables, and scripts, as `<database name>-<timestamp>.sql`. It is named and saved like every other export — see [Exporting](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, in the canvas context menu or in Quick Search, saves nothing by itself.  
It switches to this tab, opens the options panel even if it was folded, and puts the keyboard focus on `Save file`, so pressing `Enter` saves the file.

`Copy` at the foot of the panel, or the copy button that appears at the top right of the code while you hover it, copies the SQL.  
A `Copied!` toast with a check mark confirms for two seconds. If the browser or host refuses the clipboard, a `Couldn't copy to the clipboard` toast with a warning sign says so instead. Copying again replaces the toast rather than adding another.  
The SQL is selectable as well, so you can take only part of it.

## What the DDL Writes

These rules hold wherever the editor writes Schema SQL: on this tab and in its file, and in the SQL a page embedding the editor or a coding agent reads.  
The `Schema SQL` tab of Table Properties follows them for the one table it shows. It writes no foreign keys, except SQLite's, which sit inside its `CREATE TABLE`, and no Oracle sequence or trigger.

The parts come in this order, one blank line apart: the header, the before script, the `DROP` statements, the tables, and the after script. Tables are written in name order.  
A diagram with no tables and no scripts writes nothing, even with a header chosen.

### Auto Increment

A column marked `Auto Increment` is written as each database writes it: `AUTO_INCREMENT` on MySQL and MariaDB, `IDENTITY(1,1)` on MSSQL, `AUTOINCREMENT` on Snowflake, and `GENERATED ALWAYS AS IDENTITY` on PostgreSQL and Databricks.  
Oracle gets a sequence `SEQ_<table>` and a trigger `SEQ_TRG_<table>` that fills the column from it. The trigger ends with a `/` line, so SQL\*Plus and SQLcl run it.

Where a database does not take auto increment on the column's type, the clause is left out, and a comment line after the table names the column:

- PostgreSQL takes it only on `smallint`, `integer`, or `bigint`, under any of their names: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4`, or `INT8`. A column of another type gets neither the clause nor a default, and the comment reads, for example, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks takes it only on `BIGINT` or `LONG`.
- SQLite takes `AUTOINCREMENT` only on a table's lone primary key column of an integer type, such as `INT`, `BIGINT`, or `INT8`, with or without a width. That column is written as `INTEGER`, and the key as `PRIMARY KEY (id AUTOINCREMENT)`. A lone key of any other type is written without it.

### Referential Actions

Which ON DELETE and ON UPDATE actions each database writes is listed in [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Where Snowflake leaves an action out, a comment above that foreign key's `ALTER TABLE` names it, such as `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Schema-qualified Table Names

With `Bracket` at `None`, a table name with a dot, such as `sales.users`, is read as a schema and a table, split at its last dot outside brackets or double quotes.

- MySQL, MariaDB, MSSQL, Oracle, and PostgreSQL build the automatic names they write from the table part alone: `FK_users_TO_orders` and `IDX_users` on all five, `UQ_users_email` on all but PostgreSQL, and `PK_users` on MSSQL and Oracle, the two of them that name the primary key. On those two, `[sales].[users]` and `"sales"."users"` give `PK_users` too, and `[Order]` gives `PK_Order`.
- SQLite names no constraints, so the only automatic name it builds is the index's: `CREATE INDEX sales.IDX_users ON users`.
- Oracle creates the table's indexes, and an auto-increment column's sequence and trigger, in the table's schema: `sales.IDX_users`, `sales.SEQ_users`, and `sales.SEQ_TRG_users`.
- In Oracle and SQLite, an index name you gave a schema yourself keeps it.
- An automatic foreign key or index name that repeats an earlier one, ignoring case, gets a number. With `sales.users` and `hr.Users` both referenced from `orders`, the second key is `FK_Users_TO_orders1`.

Under any other `Bracket`, the whole table name is one identifier, such as `"PK_sales.users"`. Snowflake and Databricks always keep the whole name.  
The `Keys` rows of the [Indexes](./table-related-functions.md#indexes) tab show the same names.

### Defaults

A column's default is written as you typed it, but in parentheses where the database reads that expression only inside them. A default already in parentheses is left as it is.

- MySQL wraps anything but a literal or the current time, such as `(uuid())`. It also wraps any default but `NULL` on a `BLOB`, `TEXT`, `JSON`, spatial, or `LONG…` column, and the current time on any column but a `TIMESTAMP` or `DATETIME`.
- MariaDB wraps anything but a literal, the current time, a function call, or a name.
- SQLite wraps anything but a literal or a name, such as `(datetime('now'))`.
- PostgreSQL wraps only an expression with a word such as `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE`, or `= ANY` outside parentheses, such as `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake, and Databricks write every default as typed.

## Read-only Editors

In a `readonly` editor the tab works as usual: `Database` and `Bracket` still change the SQL shown, `Statements`, `Header`, and `Tables` still work, and `Save file` and `Copy` still save and copy it.  
Only the two script fields are read-only.
