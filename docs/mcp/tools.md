---
sidebar_position: 4
description: Every tool the erd-editor MCP server offers — reading a document a page at a time, the 56 edit tools, erd_batch, and what a result and a refusal look like.
---

# Tools

The server offers 65 tools: five session tools, three read tools, 56 edit tools, one per editing operation, and `erd_batch`, which runs several edit tools as one edit.

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
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | The settings and counts, then a page of tables, each with its id, position and size on the canvas, and column count, with their indexes and relationships, and after the tables, unless it searches, the memos. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?` | The entities named, in full: tables with their columns, relationships with their columns and their `onDelete` and `onUpdate`, indexes with their columns, memos with their text. |
| `erd_read` | `format`, `vendor?`, `tableIds?`, `tableNames?` | The whole document at once in one of three formats, or the DDL of just some tables. |

An agent finds ids with `erd_list`, reads columns and other details with `erd_get`, and passes those ids to the edit tools.
A table's size in `erd_list` is the box it takes on the canvas: the height exact, the width approximate.
Each relationship is listed once, with one of its two tables.

`erd_read` takes one of three formats:

| `format` | What it answers |
| --- | --- |
| `snapshot` | Compact JSON with every entity and its id. Large on a big schema. |
| `sql` | DDL for one of the eight databases, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake`, or `SQLite`. `vendor` defaults to the database the document is set to. With `tableIds` or `tableNames`, only those tables, with the foreign keys they hold. Foreign keys carry their ON DELETE and ON UPDATE actions, except those the target database leaves out — see [ON DELETE and ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | The raw `.erd.json` document. |

### Large Schemas

Schemas of hundreds or thousands of tables work too.
A read answers at most 40,000 characters, under the point where Claude Code sets a tool result aside in a file.

- `erd_list` answers a page of 100 tables by default, and says where the next page starts with `nextOffset` and a `note`. Pass that `nextOffset` as `offset`, with the same `query`.
- `query` finds tables by words in a table or column name or comment, in any case. Tables whose names hold more of the words come first.
- `namesOnly` lists the table names alone, about 2,000 short names in one answer.
- `erd_get` and `erd_read` take `tableNames` as well as ids, so an agent asked for a SQL query on a large schema reads the DDL of just the tables it needs.
- `erd_get` lists ids and names that name nothing under `missing`, and the ids one answer has no room for under `notReturned`, to ask for again.
- A read too large for one answer is refused with `tooLarge`, with how to narrow it.

## Edit Tools

Ids come from `erd_list` and `erd_get`, or from the `createdIds` of the call that made the entity.
`x` and `y` are the left and top edges on the canvas, in pixels, and a color is a CSS hex color such as `#3b82f6`.

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
| `erd_sort_tables` | | Places every table in rows across the canvas, fewest columns first, as an import places them. |

### Columns

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adds an empty column to a table and returns its id in `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Removes columns from one table, with the relationships and index entries that use them. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Renames a column. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Sets the data type, such as `INT` or `VARCHAR(255)`. Foreign keys that copy it follow when [Relationship DataType Sync](../guide/guides/settings.md) is on. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relates two tables. It copies the parent's primary key into the child as foreign key columns, creating a primary key column first if the parent has none. Each foreign key column is named the way drawing a relationship in the editor names it: the key `id` of `users` gives `users_id`, and a key such as `member_id` keeps its name — see [Foreign Key Column Names](../guide/guides/relationship-editing.md#foreign-key-column-names). `createdIds` holds that new key column if one was made, the foreign key columns, and the relationship id last. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Draws a relationship between columns that already exist, pairing start and end columns by position. |
| `erd_remove_relationship` | `relationshipId` | Removes a relationship line. Its foreign key columns stay in the table. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Changes the cardinality of a relationship. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Sets the ON DELETE action of a relationship: what deleting a parent row does to its child rows. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Sets the ON UPDATE action of a relationship: what changing a parent key does to its child rows. |

`erd_add_relationship` names the foreign key columns when it runs, so name the parent table and its primary key first.

An older ERD Editor extension or plugin — the VS Code extension before `3.1.0`, the Obsidian plugin before `0.2.0`, or the JetBrains plugin before `0.10.0` — ignores ON DELETE and ON UPDATE when it serves the document.
The tools that set them still succeed, but the diagram and the file that editor saves never hold them, so update the extension or plugin — see [Updating](./installation.md#updating).
With no editor serving the document, the actions are written to the file like any other edit.

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

### Settings

The settings stored in the document, such as the database, the Code Generator options, and those on the [Settings](../guide/guides/settings.md) tab.
None of them but `erd_set_show` makes an undo entry, so `erd_undo` cannot revert them.

| Tool | Arguments | Values |
| --- | --- | --- |
| `erd_set_database` | `value` | `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks`, `Snowflake`. It picks the database's data types, and the DDL `erd_read` writes when no `vendor` is given. |
| `erd_set_database_name` | `value` | The database name. |
| `erd_set_language` | `value` | The Code Generator language: `GraphQL`, `csharp`, `Java`, `Kotlin`, `TypeScript`, `JPA`, `Scala`, `Go`, `SQLAlchemy`, `TypeORM`, `Sequelize`, `Drizzle`, `DBML`, `AML`. |
| `erd_set_table_name_case` | `value` | The name case of generated table names: `none`, `camelCase`, `pascalCase`, `snakeCase`. |
| `erd_set_column_name_case` | `value` | The same, for column names. |
| `erd_set_bracket_type` | `value` | How generated SQL quotes names: `none`, `doubleQuote`, `singleQuote`, `backtick`. |
| `erd_set_relationship_data_type_sync` | `value` | `true` keeps foreign key columns on the data type of the columns they reference. |
| `erd_set_relationship_optimization` | `value` | The relationship optimization flag stored in the document. |
| `erd_set_column_order` | `columnType`, `targetColumnType` | Moves one part of a table row to the place of another: `columnName`, `columnDataType`, `columnNotNull`, `columnUnique`, `columnAutoIncrement`, `columnDefault`, `columnComment`. |
| `erd_set_max_width_comment` | `value` | The widest a comment is drawn in a table, in pixels, or `-1` for no limit. |
| `erd_set_ignore_save_settings` | `saveSettingType`, `value` | `true` leaves `scroll` or `zoomLevel` out of the saved file. A new document starts with both `true`, as a new diagram in the editor does — see [Save Scroll Information](../guide/guides/settings.md#save-scroll-information). |
| `erd_set_show` | `show`, `value` | Shows or hides one part of the diagram: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnAutoIncrement`, `columnPrimaryKey`, `columnUnique`, `columnNotNull`, `relationship`, `columnAlternateKey`, `hideReferentialAction`. With `columnAlternateKey` shown, the columns of each [alternate key](../guide/guides/table-related-functions.md#alternate-keys) carry marks such as `AK1.1`. `hideReferentialAction` reads the other way round: `true` hides the ON DELETE and ON UPDATE labels on relationship lines, which show by default — see [Reading a Connector](../guide/guides/relationship-editing.md#reading-a-connector). |

### Import

Each of these replaces the whole document, and `erd_undo` restores the one before.
They read a schema the way the editor's Import menu does — see [Importing or Exporting Files](../guide/guides/file-import-export.md).

| Tool | Arguments | What it does |
| --- | --- | --- |
| `erd_import_sql` | `value` | Loads SQL DDL, `CREATE TABLE` statements and the like. |
| `erd_import_graphql` | `value` | Loads a GraphQL SDL. |
| `erd_import_dbml` | `value` | Loads DBML. |
| `erd_import_aml` | `value` | Loads AML. |
| `erd_import_json` | `value` | Loads an erd-editor JSON document, such as another `.erd.json` file. An empty text gives a new document, like the one `erd_open_document` makes with `create`. |

## erd_batch

`erd_batch` runs several edit tools in order as one edit, all or none.

- `operations` holds up to 100 entries, each `{ tool, as?, args? }`, where `args` are the tool's arguments without `path`.
- The operations are tried on a copy of the document first. A refused one is named, such as `operations[1] erd_remove_table: …`, and nothing is applied.
- One `erd_undo` reverts the whole batch. `historyEntries` in the result counts the editor's history entries inside it, not `erd_undo` calls.
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
{"tool":"erd_add_table","mode":"live","createdIds":["b7u59tHkuXTA1hhtWh_bD"],"batches":1,"historyEntries":1}
```

| Field | Meaning |
| --- | --- |
| `mode` | `live` or `headless` — see [Live and Headless](./live-and-headless.md). |
| `createdIds` | The ids of what the call created, in order. |
| `batches`, `historyEntries` | How many change batches the call sent and how many editor history entries it made. |
| `undoable`, `undoNote` | `undoable` is `false` when `erd_undo` will pass over the call, and `undoNote` says why: the tool makes no undo entry, or the document already held the value. An `erd_batch` result always carries an `undoNote`, which says that one `erd_undo` reverts the whole batch. |
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
| `protocolMismatch` | The editor's ERD Editor extension or plugin and the server speak different protocol versions. |
| `hubUnreachable`, `timeout`, `disconnected` | An editor's hub did not accept the connection, did not answer within 30 seconds, or hung up during the call. On Windows, `hubUnreachable` also means Windows kept the agent out of the hub: the editor runs with more rights than the agent, as when it was started as administrator and the agent was not, or the agent runs in a sandbox. |

Other codes are rarer, and every refusal carries a message saying what happened.

The edit tools, `erd_batch`, and the three read tools refuse an argument they do not declare, or one of the wrong type, with a JSON-RPC invalid params error (`-32602`) before touching the document, so a misspelled argument is never silently dropped.
The five session tools ignore arguments they do not know.
