---
sidebar_position: 2
description: Import JSON, schema SQL, GraphQL, DBML, or AML into the editor, and export JSON, schema SQL, or a PNG.
---

# Importing or Exporting Files

## Importing External Files

Five formats can be imported, from the `Import` submenu of the context menu:

- json
- Schema SQL
- GraphQL
- DBML
- AML

Picking a file whose extension does not match the chosen format cancels the import and shows a notice.

Importing replaces the current document rather than merging into it.  
A JSON file brings its own settings with it. The other formats keep the settings you already have, apart from the view position and the zoom level, and the tables are placed automatically once the file is read.  
The GraphQL, DBML, and AML parsers never fail: a file they cannot read produces an empty diagram rather than an error.

### JSON

You can import files in the [schema format defined in the editor](../../api/advanced/schema.md).
The file name must end in `.json`, so a file exported as `<database name>-<timestamp>.erd.json` imports back as it is; a bare `.erd` or `.vuerd` file is not accepted here.

![Importing a saved file from Import > json, replacing the draft document along with its settings](/img/demo-import-json.webp)

### Schema SQL

You can also import schema files defined in SQL.  
Although parsers have been made as flexible as possible regardless of the database vendor, there might be some unsupported syntax.  
The file name must end in `.sql`.  
[Supported syntax can be checked here.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importing a SQL file from Import > Schema SQL, then zooming out over the auto-placed tables](/img/demo-import-sql.webp)

Columns come from `CREATE TABLE` only. A column added by `ALTER TABLE ... ADD COLUMN` is not read.  
Items of a `CREATE TABLE` that are not columns are skipped rather than read as columns: an unnamed `CHECK (...)`, PostgreSQL's `LIKE` and `EXCLUDE`, MySQL's `FULLTEXT` and `SPATIAL` written without `INDEX` or `KEY`, T-SQL's `PERIOD FOR`, and Oracle's `SUPPLEMENTAL LOG DATA`.  
A column named after one of them still imports when a built-in type follows the name, as in `exclude BOOLEAN`, or when the name is quoted, as in `"check" int`. An unquoted `like` followed by a type that is not built in, such as `like citext`, is read as PostgreSQL's `LIKE` and skipped.  
`CHECK` constraints themselves are not imported, since the editor has no place to keep them.

#### Data Types

A column's data type is kept, argument list included, even when it is not a built-in type of any [supported database](./table-related-functions.md#databases).  
That covers an enum or composite made with `CREATE TYPE`, a domain made with `CREATE DOMAIN`, extension types such as `hstore`, `citext`, and `ltree`, schema-qualified names such as `public.mood`, and quoted or bracketed names such as `"MyType"` and `[dbo].[Phone]`, which keep their quotes or brackets. The `CREATE TYPE`, `CREATE DOMAIN`, and `CREATE EXTENSION` statements themselves are skipped.  
A built-in type drops its quotes or brackets, so `[int]` comes in as `int` and `[nvarchar](50)` as `nvarchar(50)`. PostgreSQL's `"char"` and `"bit"` keep theirs, because they are different types from `char` and `bit`.  
Array suffixes stay on any type: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. SQLite's `UNSIGNED BIG INT` comes in whole.  
`ENUM(...)` and `SET(...)` values keep their quotes, with a quote inside a value doubled, as in `ENUM('a','it''s')`. MySQL's backslash-escaped `'it\'s'` comes in doubled the same way. In a Databricks `STRUCT<...>` type, quoted field names and a field's `COMMENT` keep their quotes.  
A column written without a type, such as a typeless SQLite column or a computed `AS` column, stays typeless: a keyword such as `NOT`, `NULL`, `DEFAULT`, `PRIMARY`, or `REFERENCES`, or a single-quoted string, is not read as a type.

#### Unique Keys and Indexes

A `UNIQUE` over two or more columns becomes one unique index, in every spelling: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, SQL Server's inline `INDEX n UNIQUE (a, b)`, and `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
The index takes the key's index name, else its `CONSTRAINT` name, else no name, and keeps each column's sort order. Such an index is an [alternate key](./table-related-functions.md#alternate-keys).  
A `UNIQUE` over one column, in any of those spellings, marks that column Unique instead and adds no index, so the `UQ_<table name>_<column name>` constraint the export writes comes back as the flag it was written from. A `CREATE UNIQUE INDEX` over one column stays a unique index.

An `ALTER TABLE` that adds several keys at once, as phpMyAdmin writes `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, keeps every unique key in it: `uq_a` comes in as a unique index named `uq_a`, and `uq_c` as the Unique flag of `c`. A `CONSTRAINT` name names only the key in its own clause. MariaDB's `ADD UNIQUE INDEX IF NOT EXISTS n (...)` and SQL Server's `ALTER TABLE t WITH CHECK ADD ...` and `WITH NOCHECK ADD ...` are read too.  
`CREATE INDEX` and `CREATE UNIQUE INDEX` are read with qualified names such as `public.t` and `[dbo].[t]`, SQL Server's `CLUSTERED` and `NONCLUSTERED`, PostgreSQL's `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY`, and `USING btree`, and with no index name at all. SQL Server's `ON [PRIMARY]` filegroup is ignored.  
Key options such as `NULLS NOT DISTINCT` or `USING BTREE` are not mistaken for the key's name. In a key's column list only the first word names the column, so `b DESC NULLS LAST`, `b text_pattern_ops`, and `b COLLATE "C"` all key `b`, with `DESC` kept as its sort order. A prefix length such as `email(191)` is read past, but a key with an expression part, such as `lower(email)`, is skipped whole.

A partial unique index, `CREATE UNIQUE INDEX ... WHERE ...` or SQL Server's inline `INDEX n UNIQUE (...) WHERE ...`, comes in as a plain index with the same name and columns, because a key unique across the whole table would be stricter than the filtered one the file declares. The exception is a filter made only of `IS NOT NULL` tests on the key's columns joined by `AND`, the filter SQL Server needs to let a unique column hold more than one NULL: that key stays unique.  
A unique key naming a column the table does not have, such as one added by `ALTER TABLE ... ADD COLUMN`, is dropped whole rather than cut down to the columns that exist. A plain index keeps the columns that exist.

Oracle's SQL Developer and `DBMS_METADATA` write a key's own index as a separate `CREATE UNIQUE INDEX`, named after the key or, for a key with no name that `USING INDEX` follows, with a system name such as `SYS_C0012345`. Import reads such an index, and the one an `ADD CONSTRAINT ... USING INDEX` names, as part of its key: a composite unique key comes in as one unique index, and a primary key or a one-column unique key as the column flags with no extra index. An export back to Oracle then creates the index once.

A Schema SQL export imports back to the same Unique flags and indexes for MySQL, MariaDB, MSSQL, Oracle, PostgreSQL, and SQLite.  
Snowflake has no secondary indexes, so its export brings back only the unique keys: a composite one as a unique index and a one-column one as the column's Unique flag. A Databricks export declares no uniqueness, so none comes back.

#### Foreign Keys

A foreign key becomes a relationship in these spellings:

- A table-level `FOREIGN KEY (...) REFERENCES t (...)`, with or without `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, including the `ALTER TABLE t WITH CHECK ADD ...` and `WITH NOCHECK ADD ...` that SQL Server Management Studio scripts.
- A column's inline `REFERENCES t (col)`, as in `user_id INT REFERENCES users (id)`, and the `FOREIGN KEY REFERENCES t (col)` that SQL Server and Snowflake allow there. An inline reference to more than one column is skipped.

An `ALTER TABLE` gives at most one relationship, and only when its first clause adds a foreign key: a `FOREIGN KEY` clause after an `ADD PRIMARY KEY` or `ADD UNIQUE` clause in the same statement is not read. When one statement adds several foreign keys, as phpMyAdmin writes `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, only the last one is read.

`REFERENCES t` with no column list points at the primary key of `t` when that key is a single column. Against a composite primary key the foreign key is skipped.  
A foreign key is skipped, and none of its columns is marked as a foreign key, when none of its referenced columns is found, or when the columns found in the two tables differ in number, as when a column is missing from only one of them. When both tables lack the same number of its columns, the columns found are paired in the order written, and the relationship holds only those.  
Every imported relationship is `Zero N`, and it is identifying when each of its child columns is also a primary key.

The `ON DELETE` and `ON UPDATE` clauses of each foreign key become the relationship's `On Delete` and `On Update`: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, or `SET DEFAULT`, in any letter case and in either order. A foreign key without them imports as `Not set`. See [Relationship Editing](./relationship-editing.md#on-delete-and-on-update) for setting them in the editor.  
PostgreSQL's column list after `SET NULL` or `SET DEFAULT`, as in `ON DELETE SET NULL (a_id)`, is read past: the action applies to the whole key, and an `ON UPDATE` after the list is still read. `MATCH FULL`, `MATCH PARTIAL`, and `MATCH SIMPLE` are skipped, and MySQL's `ON UPDATE CURRENT_TIMESTAMP` column attribute is not mistaken for an action.  
A Schema SQL export imports back with the actions that database writes, so an action it leaves out, such as `SET DEFAULT` on MySQL or any `ON UPDATE` on Oracle, comes back as `Not set`.

#### Comments

Table and column comments are imported from the two syntaxes the parser reads: the `COMMENT` table option and column attribute used by MySQL, MariaDB, Snowflake, and Databricks, and the `COMMENT ON TABLE` and `COMMENT ON COLUMN` statements used by PostgreSQL and Oracle.  
A comment naming a table or column the file does not define is ignored.

In a comment, as in any quoted text such as a `DEFAULT` value or a quoted name, a doubled quote stands for one quote, the way mysqldump and pg_dump write it: `'it''s'` reads as `it's`.  
A backslash before a quote, as MySQL and MariaDB write `'it\'s'`, escapes the quote too. Such a quote still ends the text when whitespace, `,`, `;`, `)`, `]`, `:`, `|`, `+`, or the end of the file follows it, so `'C:\'`, pg_dump's `'C:\'::text`, and T-SQL's `'C:\'+name` keep their backslash.  
A `DEFAULT` value keeps its quotes, and a quote inside it is written back doubled however the file escaped it: `'it''s'`.  
When the document's database is Databricks at import time, single-quoted text follows Spark's rules instead: every backslash escapes the character after it, so `'C:\\dir'` reads as `C:\dir`, escapes such as `\n`, `\t`, and `\u0041` are decoded, and a `DEFAULT` value is kept as `'it\'s'`.

Exported Schema SQL escapes a quote inside a table or column comment: `COMMENT 'it''s'` for MySQL, MariaDB, and Snowflake, `COMMENT ON TABLE` and `COMMENT ON COLUMN ... IS 'it''s'` for PostgreSQL and Oracle, and the same doubling, table and column names included, in MSSQL's `sp_addextendedproperty` calls. A comment with no quote is written as it is.  
Databricks escapes a quote and a backslash with a backslash instead, as in `COMMENT 'it\'s'`, so its export reads back exactly only while Databricks is the selected database.

Comments do not survive a SQLite or MSSQL export and import round trip: SQLite writes them as plain `--` lines and MSSQL writes them as `sp_addextendedproperty` calls, and the parser reads neither.

### GraphQL

You can import a GraphQL SDL document.  
Object type definitions become tables, an `extend type` block merges into the type it extends, and interface fields are inherited by the types implementing them.  
A field whose type is another table becomes a relationship instead of a column, and a list on both sides creates a junction table.  
Root types (`Query`, `Mutation`, `Subscription`), introspection types, and the Relay, federation, and Hasura wrappers such as `PageInfo`, `*Connection`, `*Edge`, and `*_aggregate` are treated as noise and skipped.  
The `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index`, and `@db.*` directives are honored.  
The file name must end in `.graphql`, `.gql`, or `.graphqls`. A Prisma `schema.prisma` file is not a GraphQL document and cannot be imported here.

### DBML

You can import a DBML file, the format used by dbdiagram.io and dbdocs.  
`Table`, `TablePartial`, `Ref`, and `Enum` blocks are read. `Project`, `TableGroup`, and standalone `Note` blocks are skipped without affecting the tables around them.  
Every ref spelling is accepted: the `Ref:` colon form, a named ref, the `Ref { }` block form, and the inline `[ref: > table.column]` column setting.  
A `<>` many-to-many ref creates a junction table named after both sides.  
A standalone ref's `delete` and `update` settings become the relationship's `On Delete` and `On Update`, as in `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. The values are `cascade`, `restrict`, `set null`, `set default`, and `no action`, in any letter case. Anything else, or no setting, imports as `Not set`, and other settings such as `color` are ignored.  
The inline `[ref: ...]` setting carries no actions, and a `<>` ref's settings are not carried onto the junction table. When the same foreign key is declared both inline and as a standalone ref, the inline one is kept, without actions.  
The file name must end in `.dbml`.

### AML

You can import an AML (Azimutt Markup Language) file. Both the current spelling and the legacy v1 one are accepted.  
Entities become tables, and nested attributes are flattened into a dotted column name such as `settings.slug`.  
Attributes are `NOT NULL` unless marked `nullable`, and constructs the editor has no slot for, such as `check`, `view`, `type`, `color`, and `tags`, are dropped rather than rejected.  
A standalone `rel` statement, or `fk` in the legacy spelling, keeps its `onDelete` and `onUpdate` properties as the relationship's `On Delete` and `On Update`, as in `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. The values are `cascade`, `restrict`, `set null`, `set default`, and `no action`, quoted or not, in any letter case. Other properties are dropped.  
On an inline relation such as `user_id int -> users(id) {onDelete: cascade}`, the properties belong to the attribute, so they are dropped and the relationship imports as `Not set`.  
The file name must end in `.aml`.

GraphQL, DBML, and AML are round-trip formats: each is also a [Code Generator](./code-generator.md) target.  
DBML and AML carry each relationship's ON DELETE and ON UPDATE both ways — see [Code Generator](./code-generator.md#on-delete-and-on-update). GraphQL carries neither, so a GraphQL import leaves both `Not set`.

## Exporting

Three formats are supported for exporting:

- json: Schema file defined in the editor. Saved as `.erd.json`.
- Schema SQL: Schema file generated based on the syntax of the database vendor. Saved as `.sql`.
- png: Generates the diagram as an image. Saved as `.png`.

Schema SQL writes each relationship's ON DELETE and ON UPDATE after its `REFERENCES`, ON DELETE first. `Not set` writes nothing, and an action the selected database does not accept is left out. See [Relationship Editing](./relationship-editing.md#on-delete-and-on-update) for which database takes which.

The PNG holds the whole diagram however far it is scrolled away, cropped to what the diagram itself draws plus a margin, and drawn at the zoom the editor is showing — zoom in before exporting for a larger image.  
It is drawn in a background worker, so the editor stays usable while it runs, and when the export takes longer than a moment, as it does for a large diagram, a notice says the export is running. A diagram too large for a browser canvas to raster is written at a reduced resolution, with a notice saying so, rather than producing no file.

Every exported file is named `<database name>-<timestamp>` followed by that extension, with the timestamp formatted as `yyyy-MM-dd'T'HH_mm_ss` — for example `my-schema-2026-08-29T04_05_06.erd.json`. A blank database name falls back to `unnamed`.

![Choosing png from the Export submenu, with the notice a longer export shows](/img/demo-export.webp)

Import and Export are also available from [Quick Search](./quick-search.md). It offers the same five import formats, but only `json` and `Schema SQL` for export; PNG is available from the context menu only.

In Obsidian no download or save dialog appears: the file is written into the vault, where Obsidian puts new attachments for that diagram, and a notice names its path.  
Characters Obsidian does not allow in a file name, `\ / : * ? " < > |`, are replaced with `-`.  
Obsidian's file explorer lists an exported `.erd.json` or `.sql` file only while Settings → Files and links → Detect all file extensions is on.
