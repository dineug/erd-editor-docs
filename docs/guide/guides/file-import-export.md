---
sidebar_position: 2
description: Import JSON, schema SQL, GraphQL, DBML, or AML in place of the diagram or added below it, and export JSON, schema SQL, or the diagram as a PNG or SVG image.
---

# Importing or Exporting Files

## Importing External Files

Five formats can be imported, from the `Import` submenu of the canvas context menu:

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import and Add`, right below `Import`, adds the file to the diagram instead of replacing it — see [Import and Add](#import-and-add).  
The welcome screen an empty diagram shows has an `Import` row with the same five formats — see [Welcome Screen](./editing-start.md#welcome-screen).

Extensions are matched in any letter case. Picking a file whose extension does not match the chosen format cancels the import and shows `Only <format> files can be imported`, with the format written `json`, `sql`, `graphql`, `dbml`, or `aml`, as in `Only sql files can be imported`.

`Import` replaces the current document rather than merging into it, and one undo brings the previous diagram back.  
A JSON file brings its own settings with it, its [locks](./settings.md#lock) included. Where the file locks the tab, the Code Generator language, a name case, or the bracket type, you keep seeing what you had, but the file's locked value is the one saved. The view, locked or not, goes where the file puts it. A JSON file saved before the locks existed comes in with every lock on and the view at 100%.  
The other formats keep the settings you already have, the locks included, apart from the view, which starts at 100%.  
The GraphQL, DBML, and AML parsers never fail: a file they cannot read produces an empty diagram rather than an error.

A JSON file keeps the positions it has. The tables of a Schema SQL, GraphQL, DBML, or AML file are placed before the diagram changes:

- When the file has two or more tables and at least one relationship, they are laid out by the `Flow` [Auto Layout](./table-related-functions.md#auto-layout), left to right along the relationships, from the top left of the canvas. A relationship from a table to itself counts.
- Otherwise they are set out in rows from the top left, the tables with the fewest columns first.
- If the layout runs longer than 6 seconds, a `Placing tables` notice appears with a `Cancel` button. `Cancel`, or `Escape` while the notice is up, gives up the layout and sets the tables out in rows instead. Rows are also used, without a notice, when the layout fails, when no layout comes back within 60 seconds, or when the host runs no shared worker — see [Web Workers](../../api/installation.md#web-workers).

The diagram is then replaced in one step, so nothing shows in between. A setting you change while the tables are being placed, such as the tab, is kept, and if you import another file meanwhile, the import started last wins.

A read-only editor loads nothing from `Import` and does not offer `Import and Add`.

### Import and Add

`Import and Add` keeps the diagram and adds a file below it. It is in the canvas context menu and in [Quick Search](./quick-search.md) on the ERD tab, and offers the same five formats with the same extension check as `Import`.

![Adding a SQL file from Import and Add > Schema SQL, its tables landing below the diagram, laid out along their relationships and selected](/img/demo-import-and-add.webp)

The file comes in the way a paste does: every table, column, relationship, index, memo, and [table group](./table-groups.md) it holds is added as a new one, the tables already in the diagram do not move, and no setting changes, so a JSON file's settings are left out.  
A table whose name the diagram already has is added as a second table with that name, not merged with it. Relationships and indexes come only from the file, so a foreign key to a table the file does not define is not linked to a table already in the diagram.

The added block lands just below everything the diagram holds, lined up with its left edge, or at the top left of an empty diagram. Memos and table groups hidden with [View Option](./table-related-functions.md#table-view-options) count as well, since they still stand there.  
Inside the block, a JSON file keeps its own arrangement, its table groups included. The other formats are placed as `Import` places them, by `Flow` or in rows under the same rules, and each table group's box is fitted round its tables. The added tables and memos stack above everything already there.

Once the block lands, only what was added is selected: the new tables, plus the new memos and table groups while they are shown. If the block is not already in view, the view scrolls to it at the current zoom, and if you have moved to another tab meanwhile, the editor switches back to the ERD tab first. One undo takes back the whole addition.  
A file the parser cannot read, or one with no table and no memo, adds nothing.

Several Schema SQL, GraphQL, DBML, or AML files added while one is still being placed all land, in the order they were started. A JSON file added meanwhile lands as soon as it is read, ahead of them. An `Import`, or loading another document, drops any that are still being placed.

Coding agents add a file the same way with the MCP import tools' `append` mode, which keeps a JSON file's arrangement but sets the tables of the other formats out in rows, never by `Flow` — see [Import](../../mcp/tools.md#import).

### JSON

You can import files in the [schema format defined in the editor](../../api/advanced/schema.md).
The file name must end in `.json`, so a file exported as `<database name>-<timestamp>.erd.json` imports back as it is; a bare `.erd` or `.vuerd` file is not accepted here. Files saved by earlier releases are read too.

![Importing a saved file from Import > json, replacing the draft document along with its settings](/img/demo-import-json.webp)

### Schema SQL

You can also import schema files defined in SQL.  
Although parsers have been made as flexible as possible regardless of the database vendor, there might be some unsupported syntax.  
The file name must end in `.sql`.  
[Supported syntax can be checked here.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importing a SQL file from Import > Schema SQL, its tables laid out along their relationships, then zooming out over them](/img/demo-import-sql.webp)

Columns come from `CREATE TABLE` only. A column added by `ALTER TABLE ... ADD COLUMN` is not read.  
Items of a `CREATE TABLE` that are not columns are skipped rather than read as columns: an unnamed `CHECK (...)`, PostgreSQL's `LIKE` and `EXCLUDE`, MySQL's `FULLTEXT` and `SPATIAL` written without `INDEX` or `KEY`, T-SQL's `PERIOD FOR`, and Oracle's `SUPPLEMENTAL LOG DATA`.  
A column named after one of them still imports when a built-in type follows the name, as in `exclude BOOLEAN`, or when the name is quoted, as in `"check" int`. An unquoted `like` followed by a type that is not built in, such as `like citext`, is read as PostgreSQL's `LIKE` and skipped.  
`CHECK` constraints themselves are not imported, since the editor has no place to keep them.

#### Data Types

A column's data type is kept, argument list included, even when it is not a built-in type of any [supported database](./table-related-functions.md#databases).  
That covers an enum or composite made with `CREATE TYPE`, a domain made with `CREATE DOMAIN`, extension types such as `hstore`, `citext`, and `ltree`, schema-qualified names such as `public.mood`, and quoted or bracketed names such as `"MyType"` and `[dbo].[Phone]`, which keep their quotes or brackets. The `CREATE TYPE`, `CREATE DOMAIN`, and `CREATE EXTENSION` statements themselves are skipped.  
A built-in type drops its quotes or brackets, so `[int]` comes in as `int` and `[nvarchar](50)` as `nvarchar(50)`. PostgreSQL's `"char"` and `"bit"` keep theirs, because they are different types from `char` and `bit`.  
Array suffixes stay on any type: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. SQLite's `UNSIGNED BIG INT` comes in whole.  
MySQL's and MariaDB's `UNSIGNED` and `ZEROFILL`, written right after a type and its arguments, stay part of the type as written: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, mysqldump's `int unsigned`. `SIGNED`, the default, is dropped, so `TINYINT SIGNED` comes in as `TINYINT`. A modifier written after another column option, as in `INT NOT NULL UNSIGNED`, which MySQL refuses, is dropped.  
`ENUM(...)` and `SET(...)` values keep their quotes, with a quote inside a value doubled, as in `ENUM('a','it''s')`. MySQL's backslash-escaped `'it\'s'` comes in doubled the same way. In a Databricks `STRUCT<...>` type, quoted field names and a field's `COMMENT` keep their quotes.  
A column written without a type, such as a typeless SQLite column or a computed `AS` column, stays typeless: a keyword such as `NOT`, `NULL`, `DEFAULT`, `PRIMARY`, or `REFERENCES`, or a single-quoted string, is not read as a type.

#### Defaults

A column's `DEFAULT` keeps its whole expression, such as `now()`, `0.5`, `CURRENT_TIMESTAMP`, or `ARRAY[]::text[]`, up to the next column option, a comma, or the closing parenthesis. A `CASE ... END` is read whole.  
Parentheses around the whole expression come off, so SQL Server's `((0))` comes in as `0` and `(getdate())` as `getdate()`. A cast of a literal comes off too, so pg_dump's `'draft'::character varying` comes in as `'draft'` and `NULL::character varying` as `NULL`; other casts stay, as in `ARRAY[]::text[]` and `lower('A'::text)`.  
MySQL's `ON UPDATE CURRENT_TIMESTAMP` is dropped, since a column has no place for it, and the default before it stays. Oracle's `DEFAULT ON NULL 0`, with or without `FOR INSERT ONLY` or `FOR INSERT AND UPDATE`, comes in as `0`.  
A string with a prefix, such as `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'`, or `_utf8mb4'x'`, is read as one string, even with a parenthesis inside it.

SQL Server Management Studio scripts defaults after the tables, as `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Such a statement sets that column's default, `1` here, and its constraint name is dropped.

A Schema SQL export puts the parentheses back where a database reads a default's expression only inside them — see [Defaults](./schema-sql.md#defaults).

#### Auto Increment

`AUTO_INCREMENT`, `AUTOINCREMENT`, and `IDENTITY` turn a column's `Auto Increment` on, and so do `GENERATED ALWAYS AS IDENTITY` and `GENERATED BY DEFAULT AS IDENTITY`, which leave no default behind.  
So does a default that is a single PostgreSQL `nextval()` call, the default a serial column gets, written `nextval('s')` or, as pg_dump writes it, `nextval('s'::regclass)`. The sequence name is not kept. A default that only uses a sequence, such as `nextval('s') + 1` or SQL Server's `NEXT VALUE FOR s`, stays a plain default.  
pg_dump writes both after the tables, as `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` and `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Either statement turns that column's `Auto Increment` on and clears its default. `CREATE SEQUENCE`, `ALTER SEQUENCE`, and every other `ALTER COLUMN` action are skipped.  
A column typed inline as `serial`, `bigserial`, or `smallserial` keeps that type, with `Auto Increment` off.

The editor keeps only the `Auto Increment` flag, and each database writes its own form on export — see [Auto Increment](./schema-sql.md#auto-increment). A PostgreSQL export writes `GENERATED ALWAYS AS IDENTITY` on a `smallint`, `integer`, or `bigint` column, whichever form was imported, and on any other type, such as `INT UNSIGNED`, only a comment line after the table. Sequence options such as `START WITH 100` are lost.  
A table with several serial or identity columns imports with several auto-increment columns, and MySQL, MariaDB, and SQL Server refuse such a table when its export is run.

#### Primary Keys

A primary key added after its table, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, marks its columns as the primary key.  
SQL Server's `CLUSTERED` or `NONCLUSTERED` and MySQL's `USING BTREE` before the column list are read past, so the `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` that SQL Server Management Studio scripts keys `Id`. A memory-optimized table's `PRIMARY KEY NONCLUSTERED HASH (...)` is not read, in `ALTER TABLE` or in `CREATE TABLE`.

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
A Schema SQL export imports back with the actions that database writes, so an action it leaves out, such as `SET DEFAULT` on MySQL, any `ON UPDATE` on Oracle, or anything but `NO ACTION` on Snowflake, comes back as `Not set`.

#### Comments

Table and column comments are imported from the three syntaxes the parser reads: the `COMMENT` table option and column attribute used by MySQL, MariaDB, Snowflake, and Databricks, the `COMMENT ON TABLE` and `COMMENT ON COLUMN` statements used by PostgreSQL and Oracle, and the `MS_Description` extended property SQL Server sets with `EXEC sp_addextendedproperty`.  
A comment naming a table or column the file does not define is ignored.

SQL Server's calls are read with named arguments, as SQL Server Management Studio scripts every comment (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), and with positional ones, as the editor's MSSQL export writes them.  
Only an `MS_Description` on a table, or on one of its columns at level 2, gives a comment. Another property, a view, an index, or a constraint gives none, and so does a comment passed in a variable or built with `+`.

In a comment, as in any quoted text such as a `DEFAULT` value or a quoted name, a doubled quote stands for one quote, the way mysqldump and pg_dump write it: `'it''s'` reads as `it's`.  
A backslash before a quote, as MySQL and MariaDB write `'it\'s'`, escapes the quote too. Such a quote still ends the text when whitespace, `,`, `;`, `)`, `]`, `:`, `|`, `+`, or the end of the file follows it, so `'C:\'`, pg_dump's `'C:\'::text`, and T-SQL's `'C:\'+name` keep their backslash.  
A `DEFAULT` value keeps its quotes, and a quote inside it is written back doubled however the file escaped it: `'it''s'`.  
When the document's database is Databricks at import time, single-quoted text follows Spark's rules instead: every backslash escapes the character after it, so `'C:\\dir'` reads as `C:\dir`, escapes such as `\n`, `\t`, and `\u0041` are decoded, and a `DEFAULT` value is kept as `'it\'s'`.

Exported Schema SQL escapes a quote inside a table or column comment: `COMMENT 'it''s'` for MySQL, MariaDB, and Snowflake, `COMMENT ON TABLE` and `COMMENT ON COLUMN ... IS 'it''s'` for PostgreSQL and Oracle, and the same doubling, table and column names included, in MSSQL's `sp_addextendedproperty` calls. A comment with no quote is written as it is.  
Databricks escapes a quote and a backslash with a backslash instead, as in `COMMENT 'it\'s'`, so its export reads back exactly only while Databricks is the selected database.  
MSSQL writes each comment as `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`, followed by `'column', '<column>'` for a column. With `Bracket` at `None`, a table named `sales.users` gives schema `sales` and table `users`, and a name without a schema is in `dbo`. Under any other `Bracket` the whole name is the table, in `dbo`.

Comments do not survive a SQLite export and import round trip: SQLite writes them as plain `--` lines, which the parser does not read. An MSSQL export's `sp_addextendedproperty` calls import back as the same table and column comments.

### GraphQL

You can import a GraphQL SDL document.  
Object type definitions become tables, an `extend type` block merges into the type it extends, and interface fields are inherited by the types implementing them.  
A field whose type is another table becomes a relationship instead of a column, and a list on both sides creates a junction table.  
A singular field such as `buyer: User` is first paired with the one field on the other type whose name ends in `By` followed by that field's name, such as `orderListByBuyer`, ignoring case and underscores; a numbered field such as `buyer2` is paired the same way without its number. This is how the Code Generator's GraphQL output names the fields when two tables share more than one relationship or a table refers to itself, so such output imports back with every relationship.  
Root types (`Query`, `Mutation`, `Subscription`), introspection types, and the Relay, federation, and Hasura wrappers such as `PageInfo`, `*Connection`, `*Edge`, and `*_aggregate` are treated as noise and skipped.  
The `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index`, and `@db.*` directives are honored.  
The file name must end in `.graphql`, `.gql`, or `.graphqls`. A Prisma `schema.prisma` file is not a GraphQL document and cannot be imported here.

### DBML

You can import a DBML file, the format used by dbdiagram.io and dbdocs.  
`Table`, `TablePartial`, `Ref`, `Enum`, and `TableGroup` blocks are read. `Project` and standalone `Note` blocks are skipped without affecting the tables around them.  
Every ref spelling is accepted: the `Ref:` colon form, a named ref, the `Ref { }` block form, and the inline `[ref: > table.column]` column setting.  
A `<>` many-to-many ref creates a junction table named after both sides.  
A standalone ref's `delete` and `update` settings become the relationship's `On Delete` and `On Update`, as in `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. The values are `cascade`, `restrict`, `set null`, `set default`, and `no action`, in any letter case. Anything else, or no setting, imports as `Not set`, and other settings such as `color` are ignored.  
The inline `[ref: ...]` setting carries no actions, and a `<>` ref's settings are not carried onto the junction table. When the same foreign key is declared both inline and as a standalone ref, the inline one is kept, without actions.  
A table's `headercolor` setting, as in `Table users [headercolor: #3498DB]`, becomes its color when the value is a `#rgb` or `#rrggbb` hex written without quotes. Any other value is dropped, and a `TablePartial`'s `headercolor` is not passed on to the tables that use it.  
Each `TableGroup` becomes a [table group](./table-groups.md) holding the tables it lists, one per line, named as a `Ref` names them. Its `[color: ...]` becomes the group's color under the same rule as `headercolor`, and its note and other settings are dropped. A table listed by two groups stays in the first. A group left with no table is not created, whether it lists none the file declares or only tables an earlier group took. The group's box is fitted round its tables wherever they are placed, and when the tables are set out in rows, a group's tables stay together.  
The file name must end in `.dbml`.

### AML

You can import an AML (Azimutt Markup Language) file. Both the current spelling and the legacy v1 one are accepted.  
Entities become tables, and nested attributes are flattened into a dotted column name such as `settings.slug`.  
Attributes are `NOT NULL` unless marked `nullable`, and constructs the editor has no slot for, such as `check`, `type`, and `tags`, are dropped rather than rejected. An entity marked as a view comes in as a plain table.  
An entity's `color`, as in `users {color: red}`, becomes its table's color. AML's color names, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, and `gray`, are read in any letter case, quoted or not, each as the 500 shade of the Tailwind color of that name, such as `#ef4444` for `red`. A quoted hex such as `"#3498db"` is kept as written; a bare `#3498db` cannot be read, because `#` starts an AML comment. Any other value, and a `color` on an attribute or a relation, is dropped.  
A standalone `rel` statement, or `fk` in the legacy spelling, keeps its `onDelete` and `onUpdate` properties as the relationship's `On Delete` and `On Update`, as in `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. The values are `cascade`, `restrict`, `set null`, `set default`, and `no action`, quoted or not, in any letter case. Other properties are dropped.  
On an inline relation such as `user_id int -> users(id) {onDelete: cascade}`, the properties belong to the attribute, so they are dropped and the relationship imports as `Not set`.  
The file name must end in `.aml`.

GraphQL, DBML, and AML are round-trip formats: each is also a [Code Generator](./code-generator.md) target.  
DBML and AML carry each relationship's ON DELETE and ON UPDATE both ways — see [Code Generator](./code-generator.md#on-delete-and-on-update). GraphQL carries neither, so a GraphQL import leaves both `Not set`.  
DBML also carries table colors, less any transparency, and each table group that holds a table, both ways. A group with no name comes back as `group_1`, `group_2`, and so on, and a repeated group name comes back with `_2`, `_3`, and so on added. AML carries a table color only as the nearest of its color names, so `#FF8800` is written as `orange` and comes back as `#f97316`, and it carries no groups. GraphQL carries neither colors nor groups.

## Exporting

The `Export` submenu of the canvas context menu has three entries:

- json: Saves the diagram as its file holds it, as `.erd.json`: the tables with their columns and indexes, the relationships, memos, and table groups, and the settings, each [locked setting](./settings.md#lock) at its locked value.
- Schema SQL: Opens the [Schema SQL](./schema-sql.md#saving-or-copying-the-sql) tab with its options panel open and its `Save file` button focused, so pressing `Enter` saves the SQL the tab shows as `.sql`. Nothing is saved until then.
- Image: Opens the `Export image` dialog, which saves the diagram as a `.png` or `.svg`, or copies it to the clipboard as a PNG — see [Image](#image).

All three work in a read-only editor.

Schema SQL writes each relationship's ON DELETE and ON UPDATE after its `REFERENCES`, ON DELETE first. `Not set` writes nothing, and an action the selected database does not accept is left out. See [Relationship Editing](./relationship-editing.md#on-delete-and-on-update) for which database takes which.

Every exported file is named `<database name>-<timestamp>` followed by its extension, with the timestamp in local time formatted as `yyyy-MM-dd'T'HH_mm_ss` — for example `my-schema-2026-08-29T04_05_06.erd.json`. A blank database name falls back to `unnamed`.  
The Schema SQL tab's and the [Code Generator](./code-generator.md)'s `Save file` name their files the same way. An image takes the database name as it was when the dialog opened.

`Import`, `Import and Add`, and `Export` are also available from [Quick Search](./quick-search.md) on the ERD tab, with the same entries as the canvas context menu. On every tab, Quick Search also has `Export: Schema SQL`, which opens the Schema SQL tab ready to save, as `Export` ▸ `Schema SQL` does — see [Saving or Copying the SQL](./schema-sql.md#saving-or-copying-the-sql).

In Obsidian no download or save dialog appears: the file is written into the vault, where Obsidian puts new attachments for that diagram, and a notice names its path.  
Characters Obsidian does not allow in a file name, `\ / : * ? " < > |`, are replaced with `-`.  
Obsidian's file explorer lists an exported `.erd.json` or `.sql` file only while Settings → Files and links → Detect all file extensions is on.

### Image

`Export` ▸ `Image`, from the canvas context menu or from Quick Search, opens the `Export image` dialog: a preview of the image beside its options. Opening it closes Find and Replace.

![Opening Export > Image, turning off dark mode and the background, picking 3x, and copying the image to the clipboard](/img/demo-export.webp)

- `Background`: On by default. Off leaves the canvas transparent.
- `Dark mode`: Starts out matching the editor's appearance. While it matches the appearance on screen, the image takes the canvas's own colors, [theme builder](./language-and-theme.md) changes included; the other appearance uses the preset of the same gray and accent colors.
- `Scale`: `1x`, `2x`, or `3x`, with `2x` selected by default. It sets the size of the PNG and of the clipboard copy only, and the line under it gives that size, as `PNG <width> × <height> px`.

The choices are kept until the editor closes and are never saved in the document. The preview is drawn the way the image is, and is drawn again when `Background` or `Dark mode` changes.

The image holds the diagram as it stood when the dialog opened; close and reopen the dialog to take in later changes. It holds the whole diagram however far it is scrolled away, cropped to what the diagram draws plus a margin, and it is always drawn at 100%, whatever zoom the editor is showing, so every table is drawn in full. What [View Option](./table-related-functions.md#table-view-options) hides — relationships, their ON DELETE and ON UPDATE labels, table groups, or memos — is neither drawn nor given room, and table groups are drawn behind everything else.

Three buttons write the image, and each leaves the dialog open:

- `PNG`: Saves a `.png` the size of the diagram at 100% times the `Scale`. A PNG too large for a browser canvas is written at a reduced resolution rather than failing: the dialog warns beforehand with `Reduced from <width> × <height> px, past what a browser canvas can hold`, and a notice reading `Exported at a reduced resolution` says so afterwards.
- `SVG`: Saves an `.svg` the size of the diagram at 100%, whatever the `Scale`, and never reduced. Its text stays text and its fonts are named rather than embedded, so a viewer without the editor's font draws another. Shadows are left out.
- `Copy to clipboard`: Puts a PNG on the clipboard at the chosen `Scale`, reduced as a saved PNG is when a browser canvas cannot hold it. It confirms with `Copied the image to the clipboard`, or with `Copied at a reduced resolution` when the image was reduced. If the copy fails, because the browser or host refuses the clipboard or the image could not be drawn, `Couldn't copy the image` suggests saving a PNG instead.

The image is drawn in a background worker where the host runs one, so the editor stays usable meanwhile. A notice reading `Exporting PNG`, `Exporting SVG`, or `Copying image` shows when it takes longer than a moment, and a failure is reported as `Couldn't export the PNG` or `Couldn't export the SVG`. Closing the dialog while a file is still being drawn does not stop that file being saved.

`PNG` has the focus when the dialog opens, and `Tab` stays inside the dialog. `Escape`, the `x` button, or a click on the dimmed area around it closes it.  
While it is open, the canvas shortcuts, undo and redo included, and copy and paste do nothing. `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac) closes it and opens Quick Search, and `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) closes it and opens Find and Replace.
