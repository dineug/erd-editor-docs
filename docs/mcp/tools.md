---
sidebar_position: 4
description: Every tool the erd-editor MCP server offers — reading a document a page at a time, the 54 edit tools, erd_batch, and what a result and a refusal look like.
---

# Tools

The server offers 63 tools: five session tools, three read tools, 54 edit tools, one per editing operation, and `erd_batch`, which runs several edit tools as one edit.

Every tool but `erd_list_documents` takes the document's `path` as its first argument, and the tables below leave it out.
An argument marked `?` is optional.

## Session Tools

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_list_documents` | | Lists ERD documents with `path`, `open`, `active`, `dirty`, and `readonly`: those of the editor that serves the working directory, which in a JetBrains IDE covers every open project, otherwise the ERD files under the working directory. |
| `erd_open_document` | `create?` | Opens a document for editing, in the ERD Editor of the editor that serves it, if one does. With `create` it makes the file first if it is missing, and a name with no extension gets `.erd.json`. |
| `erd_save` | | Saves a document an editor holds. VS Code keeps the agent's edits unsaved until this is called; Obsidian and a JetBrains IDE save them as they save yours, and this writes them at once. Headless, every edit is already written and this does nothing. |
| `erd_undo` | | Reverts the last edit this agent made, never yours. Calls that made no undo entry are passed over and named. |
| `erd_redo` | | Applies again the edit `erd_undo` last reverted. |

See [Live and Headless](./live-and-headless.md) for what saving and undo do in each mode.

## Reading a Document

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | The settings and counts, then a page of tables with their indexes and relationships, each table with its id, position and size on the canvas, column count, and table group if it is in one. Unless it searches, the table groups and then the memos follow the tables. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | The entities named, in full: tables with their columns and their table group, relationships with their columns and their `onDelete` and `onUpdate`, indexes with their columns, memos with their text, table groups with their tables. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | The whole document at once in one of four formats, or the DDL of just some tables or table groups. |

An agent finds ids with `erd_list`, reads columns and other details with `erd_get`, and passes those ids to the edit tools.
A table's size in `erd_list` is the box it takes on the canvas: the height exact, the width approximate.
A table group is listed by the rect it stores, with its name, its color, and how many tables it holds.
Each relationship is listed once, with one of its two tables.
The settings `erd_list` and `erd_read` report are those the file saves — see [Settings](#settings).

`erd_read` takes one of four formats:

| `format` | What it answers |
| --- | --- |
| `snapshot` | Compact JSON with every entity and its id, table groups included, and the settings with the Schema SQL scripts. It leaves out what differs from one viewer to another: measured widths, the stacking order, the view, and the tab. Large on a big schema. |
| `sql` | DDL for one of the eight databases, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake`, or `SQLite`. `vendor` defaults to the database the document is set to. The DDL of the whole document includes its before and after scripts. With `tableIds`, `tableNames`, or `groupNames`, only those tables, with the foreign keys they hold, and no scripts. Foreign keys carry their ON DELETE and ON UPDATE actions, except those the target database leaves out — see [ON DELETE and ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | The whole document exactly as a save writes the file, any edits the editor has not saved yet included — see [Storage Form and Runtime Value](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | The document's before and after scripts alone, as `{"before":"…","after":"…"}`, each empty when unset, however large the schema. |

Only the `sql` format takes `vendor`, `statements`, `header`, `tableIds`, `tableNames`, and `groupNames`, and another format refuses them.

- `statements`: `create`, the default; `ifNotExists`, which writes `CREATE TABLE IF NOT EXISTS` on MySQL, MariaDB, PostgreSQL, SQLite, and Databricks and plain `CREATE TABLE` on the others; or `recreate`, which drops the tables before creating them, where Snowflake writes `CREATE OR REPLACE TABLE` instead.
- `header`: `none`, the default; `use`, which selects the database or schema the document's database name gives; or `createAndUse`, which creates it first. Oracle has `use` alone, so `createAndUse` writes `use` there, and PostgreSQL has `createAndUse` alone, so `use` writes no header there. SQLite writes none, and no database writes one while the database name is blank or not a plain identifier.
- `groupNames`: the tables of the named table groups, by name in any case, joined with `tableIds` and `tableNames`. A name that matches no group is refused with `notFound`. A group that holds no table adds none, and a read left with no table at all, as when every group named is empty and no table is named, is refused with `invalidArgs`.

`statements` and `header` apply to the DDL of some tables too. They work as the `Statements` and `Header` options of the editor's [Schema SQL](../guide/guides/schema-sql.md#options-panel) tab, though the tab starts at `If not exists` and `CREATE + USE`.
Names are quoted with the bracket type the file saves, the locked one while `Bracket Type` is locked — see [Lock](../guide/guides/settings.md#lock).

### Large Schemas

Schemas of hundreds or thousands of tables work too.
A read answers at most 40,000 characters, under the point where Claude Code sets a tool result aside in a file.

- `erd_list` answers a page of 100 by default, the tables first, then the table groups, then the memos, and says where the next page starts with `nextOffset` and a `note`. Pass that `nextOffset` as `offset`, with the same `query`.
- `query` finds tables by words in a table or column name or comment, in any case. Tables whose names hold more of the words come first. A search lists no table groups or memos.
- `namesOnly` lists the table names alone, about 2,000 short names in one answer.
- `erd_get` and `erd_read` take `tableNames` as well as ids, and `erd_read` takes `groupNames`, so an agent asked for a SQL query on a large schema reads the DDL of just the tables it needs.
- `erd_get` lists ids and names that name nothing under `missing`, and the ids one answer has no room for under `notReturned`, to ask for again.
- A read too large for one answer is refused with `tooLarge`, with how to narrow it.

## Edit Tools

Ids come from `erd_list` and `erd_get`, or from the `createdIds` of the call that made the entity.
A new id is 25 lowercase letters and digits, such as `03h17be2plxpj5n59tqag7ogj`, while an id the document already holds keeps its form, so read nothing into an id's shape.
`x` and `y` are the left and top edges on the canvas, in pixels, and a color is a CSS hex color such as `#3b82f6`, or an empty string, which removes the color.

### Tables

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_table` | | Adds an empty table at a free spot and returns its id in `createdIds`. |
| `erd_remove_table` | `tableId` | Removes a table with its columns, indexes, and every relationship that touches it. |
| `erd_change_table_name` | `tableId`, `value` | Renames a table. |
| `erd_change_table_comment` | `tableId`, `value` | Sets the comment of a table. An empty string clears it. |
| `erd_change_table_color` | `tableId`, `color` | Sets the color of a table. |
| `erd_move_table` | `tableId`, `x`, `y` | Moves a table to a position on the canvas. |
| `erd_move_tables` | `positions` | Moves several tables in one edit, which one `erd_undo` reverts. `positions` holds `{ tableId, x, y }` per table, each table at most once. |
| `erd_sort_tables` | | Places every table in rows across the canvas, fewest columns first, as `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, and `erd_import_aml` place them. The tables of a table group stay together, and each group's box is fitted round them. |

### Columns

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adds an empty column to a table and returns its id in `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Removes columns from one table, with the relationships and index entries that use them. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Renames a column. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Sets the data type, such as `INT` or `VARCHAR(255)`. While [Relationship DataType Sync](../guide/guides/settings.md#relationship-datatype-sync) is on, the change follows relationships both ways, as it does in the editor: a serial type reaches the foreign keys as the integer type it stores, as `erd_add_relationship` copies it, and a serial key keeps its type when one of its foreign keys changes, which stops the change there. The sync is the user's to turn on or off, and `erd_list` reports it as `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Sets the default, as SQL text. An empty string clears it. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Sets the comment. An empty string clears it. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` makes the column part of the primary key, `false` takes it out. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Sets whether the column is unique. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Sets whether the column is `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Sets whether the column auto-increments. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Moves a column within its table to the position of another column. |

### Relationships

`relationshipType` is the cardinality at the child end: `ZeroOne`, `ZeroN`, `OneOnly`, or `OneN`.
The start table is the parent, the referenced side that holds the primary key, and the end table is the child.
`onDelete` and `onUpdate` are the foreign key's ON DELETE and ON UPDATE actions: `none`, `noAction`, `cascade`, `setNull`, `setDefault`, or `restrict`.
`none` writes no clause, so the database's default applies — see [ON DELETE and ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
An action left out of `erd_add_relationship` or `erd_link_columns` is `none`.

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relates two tables. It copies the parent's primary key into the child as foreign key columns, creating a primary key column first if the parent has none. Each foreign key column is named the way drawing a relationship in the editor names it: the key `id` of `users` gives `users_id`, and a key such as `member_id` keeps its name — see [Foreign Key Column Names](../guide/guides/relationship-editing.md#foreign-key-column-names). Each copies its key's data type, except that a serial key gives the integer type it stores, such as `integer` for `serial4`, and a bare `serial` stays `serial` outside PostgreSQL, MySQL, and MariaDB — see [Identifying Relationships](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` holds that new key column if one was made, the foreign key columns, and the relationship id last. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Draws a relationship between columns that already exist, pairing start and end columns by position. It renames no column and changes no data type. |
| `erd_remove_relationship` | `relationshipId` | Removes a relationship line. Its foreign key columns stay in the table. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Changes the cardinality of a relationship. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Sets the ON DELETE action of a relationship: what deleting a parent row does to its child rows. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Sets the ON UPDATE action of a relationship: what changing a parent key does to its child rows. |

`erd_add_relationship` names the foreign key columns when it runs, so name the parent table and its primary key first.

No tool changes the columns of an existing relationship as the editor's [Map Columns](../guide/guides/relationship-editing.md#map-columns) does.
To map one onto other columns, run `erd_remove_relationship`, which leaves its foreign key columns in the table, and `erd_link_columns` with the columns wanted, in one `erd_batch`, which one `erd_undo` reverts.

### Indexes

An index column id is an entry of the index's column list that `erd_get` gives, not the table column's id.

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Adds an empty index to a table and returns its id in `createdIds`. |
| `erd_remove_index` | `indexId` | Removes an index. |
| `erd_change_index_name` | `indexId`, `value` | Renames an index. |
| `erd_set_index_unique` | `indexId`, `value` | Sets whether the index is unique. |
| `erd_add_index_column` | `indexId`, `columnId` | Adds a column of the index's table and returns the new index column id. A column already in the index is left alone. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Removes one column from an index. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Moves a column within an index to the position of another of its columns. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Sets the sort order of one column in an index, `ASC` or `DESC`. |

### Memos

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_memo` | | Adds an empty memo at a free spot and returns its id in `createdIds`. |
| `erd_remove_memo` | `memoId` | Removes a memo. |
| `erd_change_memo_value` | `memoId`, `value` | Replaces the text of a memo. |
| `erd_change_memo_color` | `memoId`, `color` | Sets the color of a memo. |
| `erd_move_memo` | `memoId`, `x`, `y` | Moves a memo to a position on the canvas. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Resizes a memo. The width must be at least about `116` pixels and the height at least `100`. It makes no undo entry, since the editor records a memo resize only from a drag. |

While memos are hidden with [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` still adds one, and it stays hidden until memos are shown again.
`erd_list` and `erd_get` list hidden memos too.

### Table Groups

A table group is a named box drawn behind its tables, and its color shows on the box and across the headers of its tables — see [Table Groups](../guide/guides/table-groups.md).
A table is in one group at most. `erd_move_table`, `erd_move_tables`, and `erd_move_table_group` never change which tables a group holds, wherever they place a table, while in the editor a table joins or leaves a group where it is dropped — see [Adding and Removing Tables](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` and `erd_set_table_group` put tables in a group, and `erd_remove_table_group` leaves its tables in none.
A group stores a rect, at least `160` pixels wide and `100` high, title bar included, and the editor draws the box grown to hold each of its tables.

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Adds a group and returns its id in `createdIds`. Pass either `tableIds` or a rect, `x`, `y`, `width`, and `height` together. With `tableIds`, each table leaves any group it was in, and the rect is fitted round them as [grouping selected tables](../guide/guides/table-groups.md#grouping-selected-tables) fits it. A rect takes in every table in no group whose center lies inside it, as [drawing a group](../guide/guides/table-groups.md#drawing-a-group) does. An empty `name` leaves the group unnamed. One `erd_undo` removes the group and puts each table back in the group it was in. |
| `erd_remove_table_group` | `groupId` | Removes a group. Its tables stay where they are, in no group. |
| `erd_change_table_group_name` | `groupId`, `value` | Renames a group. An empty string leaves it unnamed. |
| `erd_change_table_group_color` | `groupId`, `color` | Sets the color of a group. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Moves a group so its rect starts at that point, with its tables by the same step, as dragging its title bar does. A move under 20 pixels, across and down added together, makes no undo entry. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Sets the rect of a group, its tables staying where they are. `x` and `y` left out keep its corner. A rect that would not hold the group's tables with their padding is refused, with a message naming the box it must hold. |
| `erd_set_table_group` | `tableIds`, `groupId` | Puts tables in a group, each leaving any group it was in. A `groupId` of `null` or an empty string takes them out of every group. |

While groups are hidden with `View Option` → `Table Groups`, these tools still add and change groups, which stay hidden until groups are shown — see [Hiding Groups](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` keeps each group's tables together, `erd_import_dbml` and `erd_import_json` bring groups — see [Import](#import) — and `erd_read` writes the DDL of chosen groups with `groupNames`.
A file the agent writes on disk may lose its groups if an earlier release of ERD Editor saves it — see [Updating](./installation.md#updating).

### Settings

An agent sets the settings of the schema itself: the database, its name, and the [Schema SQL](../guide/guides/schema-sql.md) scripts.
Every other setting the document stores is the user's to set in the editor: the [View Option](../guide/guides/table-related-functions.md#table-view-options) toggles, the options of the [Settings](../guide/guides/settings.md) tab, the Code Generator's language and name cases, the bracket type, and the [locks](../guide/guides/settings.md#lock).
No tool changes them, except the imports in `replace` mode: `erd_import_json` brings the settings and locks of the document it loads, and the other four put the view back at the start of the canvas — see [Import](#import).
Server `1.0.0` removed the tools that set them: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings`, and `erd_set_show`.

`erd_list` and the `snapshot` format of `erd_read` report the settings as the file saves them, with `lockSettings` holding one flag per lock: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, and `bracketType`.
A locked language, name case, or bracket type is reported at its locked value, the one the file keeps and every editor opens on, whatever an editor's screen shows. The view and the tab are not reported.

`erd_set_ddl_script` makes an undo entry. `erd_set_database` and `erd_set_database_name` make none, so `erd_undo` cannot revert them.

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_set_database` | `value` | Sets the database: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks`, or `Snowflake`. It picks the database's data types, and the DDL `erd_read` writes when no `vendor` is given. |
| `erd_set_database_name` | `value` | Sets the database name, which the `use` and `createAndUse` headers of `erd_read` name. |
| `erd_set_ddl_script` | `position`, `sql` | Sets one of the two scripts written around the tables — see [Before and After Scripts](../guide/guides/schema-sql.md#before-and-after-scripts). `position` is `before`, written ahead of the tables, such as `CREATE EXTENSION` or `CREATE SCHEMA`, or `after`, written past them, such as `GRANT` or `CREATE VIEW`. `sql` replaces the whole script, at most 10,000 characters, and an empty string removes it. Read the current one first with the `scripts` format of `erd_read`. |

A script goes as is into the DDL of every database, so write it for the document's database. On MSSQL, a `GO` line is added after a script whose last line is not `GO`.
A file the agent writes on disk may lose its scripts if an earlier release of ERD Editor saves it — see [Updating](./installation.md#updating).

### Import

These tools read a schema the way the editor's Import menu does — see [Importing or Exporting Files](../guide/guides/file-import-export.md).
Each takes the text as `value`, and `mode`: `replace`, the default, or `append`.

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Loads SQL DDL, `CREATE TABLE` statements and the like. |
| `erd_import_graphql` | `value`, `mode?` | Loads a GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Loads DBML. Each `TableGroup` becomes a table group of the tables it names — see [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Loads AML. |
| `erd_import_json` | `value`, `mode?` | Loads an erd-editor JSON document, such as another `.erd.json` file. |

`replace` takes the place of the document, and `erd_undo` restores the one before:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, and `erd_import_aml` replace every table, relationship, index, memo, and table group. They keep the document's settings, its locks included, apart from the view, which goes back to the start of the canvas at 100%.
- `erd_import_json` replaces the whole document, its settings included: the settings and locks of the JSON take this document's place, and a JSON that records no locks turns every lock on and puts the view at the start of the canvas. To keep this document's settings, start from the text the `json` format of `erd_read` gives. An empty text gives a new document, like the one `erd_open_document` makes with `create`.

`append` adds the import to the document, as the editor's [Import and Add](../guide/guides/file-import-export.md#import-and-add) does, and one `erd_undo` takes the whole addition away:

- What the text holds comes in as new entities with new ids, in a block below everything the document holds, hidden memos and table groups included, lined up with its left edge. Every table and setting already there stays, a table of the same name included: nothing is merged by name.
- Relationships and indexes come only between the tables the import brings, so a foreign key to a table the text does not declare is dropped.
- `erd_import_sql`, `erd_import_graphql`, and `erd_import_aml` add tables with their relationships and indexes, and `erd_import_dbml` its table groups too. `erd_import_json` adds tables, relationships, indexes, memos, and table groups, never its settings, and refuses an empty text.

A JSON document keeps its own arrangement, its table groups included: where it places its tables with `replace`, and inside the added block with `append`.
The tables of SQL, GraphQL, DBML, and AML are set out in rows, fewest columns first with each group's tables together, as `erd_sort_tables` places them, never by `Flow` as the editor's own Import lays them out when it can. Those four tools refuse an empty text in either mode.

## erd_batch

`erd_batch` runs several edit tools in order as one edit, all or none.

- `operations` holds up to 100 entries, each `{ tool, as?, args? }`, where `args` are the tool's arguments without `path`.
- The operations are tried on a copy of the document first. A refused one is named, such as `operations[1] erd_remove_table: …`, and nothing is applied.
- One `erd_undo` reverts the whole batch, apart from the operations it cannot revert, which the result's `undoNote` names: those of a tool that makes no undo entry, such as `erd_set_database`, and those that changed the document without making one, such as a short `erd_move_table_group`. A batch that made no undo entry at all is passed over by `erd_undo`. `historyEntries` in the result counts the editor's history entries inside it, not `erd_undo` calls.
- In a live session the editor takes the whole batch or none of it.

An agent cannot know the ids a batch creates before it calls, so an operation named with `as` lets a later one refer to them: `$name` or `$name.0` for its first created id, `$name.1` for its second, and `$name.last` for its last.
A name holds ASCII letters, digits, and underscores, does not start with a digit, and names one operation only.
A reference resolves only where an argument takes an entity id, so a name or comment that reads `$x` stays text.

A table with its columns and a relationship, in one call:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` and its key `id` are named before the relationship, so the foreign key column it adds to `orders` is `users_id`.

## Results

An edit answers one line of JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Field | Meaning |
| --- | --- |
| `mode` | `live` or `headless` — see [Live and Headless](./live-and-headless.md). |
| `createdIds` | The ids of what the call created, in order. |
| `batches`, `historyEntries` | How many change batches the call sent and how many editor history entries it made. |
| `undoable`, `undoNote` | `undoable` is `false` when `erd_undo` will pass over the call, and `undoNote` says why: the tool makes no undo entry, the call changed the document without making one, as an `erd_move_table_group` under 20 pixels does, or the document already held the value. An `erd_batch` result always carries an `undoNote`. When the batch made an undo entry, it says one `erd_undo` reverts the batch and names any operation it leaves in place; when it made none, the result carries `undoable: false` and the note says `erd_undo` passes over it. |
| `mismatch` | Present when the call made a different number of batches or history entries than the tool declares. |
| `notes` | Present when something about the session changed, such as an editor that exited or stopped serving the document, or a file that changed on disk. |

A refusal is an error result carrying a code and a message that says what to do:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Why |
| --- | --- |
| `notFound` | An id names nothing live, or the file does not exist. |
| `invalidArgs` | An argument is missing or has the wrong value. |
| `invalidPath` | The path is not an ERD document. On Windows, also a path with a name Windows does not store as written, or one that reaches a document an editor holds under another path, which the message names. |
| `invalidDocument` | The file is not a document the editor can read. |
| `tooLarge` | A read does not fit in one answer. |
| `blocked` | An editor with its hub off holds the document. The message says how to turn it on: in VS Code, trust the workspace and turn on `dineug.erd-editor.agentHub.enabled`, or reload the window; in Obsidian, turn on Coding agents, or reload Obsidian; in a JetBrains IDE, turn on Coding agents, or restart the IDE if it is on. |
| `hubDisabled` | A JetBrains IDE holds the document only in a project it does not trust. Reads still work; trust the project to let the agent edit. |
| `conflict` | The file changed on disk during the call. Nothing was written. |
| `hubAppeared`, `hubGone` | An editor started serving a document the agent was editing on disk, or the editor that served it still runs but its lock file and connection are gone. Nothing was written. |
| `notSaved` | `erd_save` could not save the editor's document. |
| `readonly` | The editor holds the document read-only, such as a file it cannot write or cannot read as a diagram. With no editor, the file itself is read-only, such as a Perforce or TFVC file that is not checked out. Nothing was written. |
| `protocolMismatch` | The editor's ERD Editor extension or plugin and the server speak different protocol versions, such as server `1.0.0` with an earlier extension or plugin. Reads are refused too, and the message names the side to update — see [Updating](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | An editor's hub did not accept the connection, did not answer within 30 seconds, or hung up during the call. On Windows, `hubUnreachable` also means Windows kept the agent out of the hub: the editor runs with more rights than the agent, as when it was started as administrator and the agent was not, or the agent runs in a sandbox. |

Other codes are rarer, and every refusal carries a message saying what happened.

The edit tools, `erd_batch`, and the three read tools refuse an argument they do not declare, or one of the wrong type, with a JSON-RPC invalid params error (`-32602`) before touching the document, so a misspelled argument is never silently dropped.
The five session tools ignore arguments they do not know.
