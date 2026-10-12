---
sidebar_position: 11
description: Generate code for twenty-two targets from the diagram, pick the language, database, name case and bracket in the options panel, see which targets write a relationship's ON DELETE and ON UPDATE actions, and save or copy the result.
---

# Code Generator

Switch to the `Code Generator` tab in the toolbar. The tab shows the code for the whole document on the left and, on its right, an options panel headed `Code Generator`, where you pick the language, the database, the name cases and, for some targets, the bracket.  
The panel opens on its own unless the editor is narrower than 640 px when the tab first opens. `Hide options` at the top of the panel folds it away, and `Show options` at the top right of the code brings it back. It stays open or folded across tab switches for as long as the editor is open, independently of the Schema SQL tab's panel, and is never saved in the file.

Right-click the code to open its context menu: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (only for `Doctrine`, `JPA`, and `SeaORM`), each with a submenu that checks the current value, then `Options panel`, which folds or opens the panel and is checked while it shows, and `Save file…`.  
While this tab is open, [Quick Search](./quick-search.md) offers `Database`, `Bracket` (only for `Doctrine`, `JPA`, and `SeaORM`), `Language`, `Table Name Case`, `Column Name Case`, and `Code Generator: Options panel`, which folds or opens the panel.

![Picking TypeScript, then Rust, from the code's context menu, switching column names to Snake in the options panel, and copying the code](/img/demo-code-generator.webp)

The same code view is also the `Code Generator` tab of [Table Properties](./table-related-functions.md#table-properties), where it generates code for that one table instead of the whole document. It has no options panel there, and its context menu changes the same settings but has no `Options panel` or `Save file…`.  
Where the code for the whole document opens with imports or a header, the one table's code opens with those that table needs, such as `<?php` for `PHP`, `import Foundation` for `Swift`, or `$schema` for `JSON Schema`.

The code is written when the tab opens and again whenever the language, the database, a name case, or the bracket changes. An edit made to the diagram while the tab is open, such as a collaborator's or a coding agent's, shows once you leave the tab and come back, or once one of those settings changes.

## Options Panel

Under the caption `Saved in the document`, the panel lists `Language`, `Database`, `Table Name Case`, and `Column Name Case`, followed by `Bracket` while `Doctrine`, `JPA`, or `SeaORM` is the language. Each is a drop-down list, and a change rewrites the code at once.  
When the selected language ignores `Database` or the name cases, they stay in the panel, dimmed, with a note such as `Not used by DBML` under them, and can still be changed.  
`Save file` and `Copy` sit at the foot of the panel — see [Saving or Copying the Result](#saving-or-copying-the-result).

These are the diagram's own settings, the ones the context menu and Quick Search change too. `Database` is saved in the file like any edit.  
`Language`, `Table Name Case`, `Column Name Case`, and `Bracket` are saved only while their lock on the Settings tab is off (`Bracket Type` for `Bracket`), and a new diagram has every lock on. While a lock is on, a change rewrites the code on your screen, but the file keeps the locked value and the diagram reopens with it. The panel shows no sign of a lock; to keep a choice in the file, turn its lock off — see [Lock](./settings.md#lock).

## Language

Twenty-two targets are supported, listed in three groups — languages, ORMs, then schemas — each in alphabetical order. The panel's list and the context menu draw a line between the groups but name none of them:

| Target | Group | Relationships | Indexes | ON DELETE / ON UPDATE | Saved as |
| --- | --- | --- | --- | --- | --- |
| `C#` | Language | — | — | — | `.cs` |
| `Go` | Language | — | — | — | `.go` |
| `Java` | Language | — | — | — | `.java` |
| `Kotlin` | Language | — | — | — | `.kt` |
| `PHP` | Language | — | — | — | `.php` |
| `Rust` | Language | — | — | — | `.rs` |
| `Scala` | Language | — | — | — | `.scala` |
| `Swift` | Language | — | — | — | `.swift` |
| `TypeScript` | Language | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | ON DELETE only | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Unique only | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

The default is `GraphQL`. Every target emits columns; the ✓ marks show what else it emits.  
Tables are emitted in name order rather than in the order they sit on the canvas, and indexes are the ones listed under `Indexes` in [Table Properties](./table-related-functions.md#indexes), not the `Keys` rows above them. `SeaORM` writes only the unique ones, and `Mermaid` marks a unique column `UK` but writes no index.  
Every target but `Java`, `AML`, `DBML`, and `Mermaid` writes a primary key column as not null whether or not `Not Null` is set on it. `Java` marks no column as nullable or not, and `AML`, `DBML`, and `Mermaid` keep the flag as the diagram has it.

What some of the targets write:

- `PHP`: plain classes of typed public properties, opening with `<?php` and `declare(strict_types=1);`.
- `Doctrine`: Doctrine ORM 3 entities with attributes, for DBAL 4.2 or later, each column with its DBAL type and options for the selected database.
- `Rust`: a `pub struct` per table, its types written by full path, such as `chrono::NaiveDateTime` or `rust_decimal::Decimal`, with no `use` line.
- `SeaORM`: SeaORM 2.0 entities in the dense format, each table a `pub mod`, so the whole text compiles as one file.
- `Swift`: a `Codable`, `Hashable`, `Sendable` struct per table, which needs Swift 6.1 or later.
- `TypeScript`: an `export interface` per table that describes the row as JSON, as the `Zod` schema does — a date or a time is a `string`, and a nullable column is `T | null`.
- `Zod`: a Zod 4 row schema per table and the type it infers, with no insert schema and no relations.
- `JSON Schema`: one JSON Schema draft 2020-12 document, with a row schema per table under `$defs`.
- `Mermaid`: an `erDiagram`, the kind GitHub renders, each table an entity listing every column with its type and any `PK`, `FK`, or `UK` mark, and each relationship a line between its two tables.

`AML`, `DBML`, and `GraphQL` are round-trip formats: each is an import source too. See [Importing or Exporting Files](./file-import-export.md). The other schemas, `JSON Schema`, `Mermaid`, and `Zod`, are output only.  
`DBML` writes each table's color as `headercolor` and, in the code for the whole document, a `TableGroup` block after the `Ref`s for each [table group](./table-groups.md) that holds a table. `AML` writes a table's color as the nearest of AML's color names.

## ON DELETE and ON UPDATE

A relationship's ON DELETE and ON UPDATE actions are set from its context menu — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
The targets with a ✓ in the `ON DELETE / ON UPDATE` column of the [Language](#language) table write the actions a relationship sets; an action left at `Not set` writes nothing.  
Which actions the ORM targets keep depends on the selected database, while `AML` and `DBML` keep them all — see [Database](#database).

- `Doctrine` writes only ON DELETE, since Doctrine has no ON UPDATE. It adds `onDelete: 'CASCADE'` to each `#[ORM\JoinColumn]` of the owning side's `ManyToOne` or `OneToOne`, such as `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, and nothing on the inverse side's `OneToMany` or `OneToOne`. A relationship to a unique column that is not the primary key stays plain columns, which Doctrine maps without an association, so it writes no action.
- `Drizzle` writes them in lower case. On `.references()` they are options, such as `{ onDelete: "cascade", onUpdate: "set null" }`; on a `foreignKey()`, which a multi-column key gets, they are chained, such as `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` writes them on the child's `belongs_to` relation, ON UPDATE first, in SeaORM's names `NoAction`, `Cascade`, `SetNull`, `SetDefault`, and `Restrict`, such as `on_update = "Cascade", on_delete = "SetNull"`. The parent's `has_one` or `has_many` gets none.
- `Sequelize` writes `onDelete: "CASCADE"` and `onUpdate` entries into both association calls: `hasMany` or `hasOne`, and `belongsTo`. A multi-column key gets no association calls, so `Sequelize` writes no actions for it.
- `SQLAlchemy` passes `ondelete="CASCADE"` and `onupdate` arguments to `ForeignKey()` for a one-column key, and to `ForeignKeyConstraint()` for a multi-column key.
- `TypeORM` writes `onDelete: "CASCADE"` and `onUpdate` options on the owning side's `@ManyToOne` or `@OneToOne`, never on the inverse side. It always leaves `SET DEFAULT` out, because TypeORM would write it as `DEFAULT`, which no database accepts.
- `DBML` adds settings to the `Ref`, such as `[delete: set null, update: no action]`.
- `AML` writes a relationship that has an action as a standalone `rel` statement with properties, such as `{onDelete: cascade, onUpdate: "set null"}`, rather than inline on its column.

`JPA` writes none: plain JPA has no option for them, and the generator does not use Hibernate's `@OnDelete`. `Mermaid` writes none either, since an `erDiagram` line has no place for them.  
In the `Code Generator` tab of Table Properties, which shows one table, `DBML` writes no `Ref` and `AML` no `rel` statement, so neither shows the actions there; `AML` keeps a one-column relation that has actions inline on its column, as it does one without them. `Mermaid` writes no relationship lines there at all. `Doctrine` and `SeaORM` write the same entity there as in the whole document, actions included.

## Name Case

`Table Name Case` and `Column Name Case` each support `Pascal`, `Camel`, `Snake`, and `None`.  
The defaults are `Pascal` for table names and `Camel` for column names. `None` emits a name as it is written in the diagram.  
Under every case, a name the target's language reserves is escaped where that language can escape it, such as `@class` in `C#` or `r#type` in `Rust`, and renamed where it cannot, such as `class_` in `Java`.

`AML`, `DBML`, and `Mermaid` ignore both settings and always emit the names from the diagram.  
`SeaORM` ignores them too: it names fields and modules in snake case, the form SeaORM reads back, and gives the stored names in `table_name` and, where they differ, `column_name`.  
For these four targets the panel dims both lists, with the `Not used by` note under them.

## Database

Data types are resolved against the selected database — see [Databases](./table-related-functions.md#databases).  
Pick it on this tab from the panel's `Database` list, the context menu's `Database`, or Quick Search, and the code is rewritten at once. It is the diagram's one database setting, the same one the canvas context menu and the [Schema SQL](./schema-sql.md) tab set, so a change here shows there too.  
`Drizzle` takes its dialect from the same setting: `pgTable` for PostgreSQL, `mysqlTable` for MySQL and MariaDB, `sqliteTable` for SQLite, and `pgTable` for every other database.  
`SeaORM` writes a `column_type` where SeaORM would otherwise create a different column type on PostgreSQL, MySQL, MariaDB, or SQLite, and none on MSSQL, Oracle, Snowflake, or Databricks, which SeaORM has no backend for.

The selected database also decides which ON DELETE and ON UPDATE actions the ORM targets write.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy`, and `TypeORM` leave out any action that database's Schema SQL leaves out, such as `SET DEFAULT` on MySQL and MariaDB, `RESTRICT` on MSSQL, or every action but `NO ACTION` on Snowflake and Databricks, so the database's default applies. The full list is in [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` follows the dialect it writes instead: `mysqlTable` code leaves out `SET DEFAULT`, while `pgTable` and `sqliteTable` code keep every action, including the `pgTable` code it writes for MSSQL, Oracle, Snowflake, and Databricks.

`AML`, `DBML`, and `Mermaid` are the exception: they emit each data type as it is written in the diagram, so the database setting does not change their output, and the panel dims `Database` for them. `AML` and `DBML` write every action a relationship sets, and `Mermaid` writes none.

## Bracket

`Bracket` is offered in the panel, the context menu, and Quick Search only while `Doctrine`, `JPA`, or `SeaORM` is the language.  
It is the same setting as the Schema SQL tab's bracket — see [Schema SQL](./schema-sql.md#database-and-bracket) — so a change here also changes how Schema SQL quotes names. It offers `SingleQuote`, `DoubleQuote`, `Backtick`, and `None`, and starts at `None`.

- `Doctrine`: under any bracket but `None`, every table, column, and join column name is wrapped in backticks, which is how Doctrine marks a name to quote, such as ``#[ORM\Table(name: '`order`')]``. Under `None` only a name that needs it is: a word a database reserves, a name that is not a plain ASCII identifier, or a name typed in quotes.
- `JPA`: under any bracket but `None`, a table name that is a reserved word is quoted inside `@Table`, such as `@Table(name = "\"user\"")`. Under `None` it is left bare, as Schema SQL leaves it.
- `SeaORM`: under `None`, names are written as the database stores them: a dotted table name is split into `schema_name` and `table_name`, and on PostgreSQL an unquoted name is folded to lower case. Under any other bracket a name is kept whole, as written.

## Saving or Copying the Result

`Save file` at the foot of the options panel, or `Save file…` in the context menu, saves the code shown as a file.  
It is named like every export, `<database name>-<timestamp>`, followed by the extension in the [Language](#language) table, such as `shop-2026-10-12T04_05_06.ts`, and goes where every export goes in your host — see [Exporting](./file-import-export.md#exporting). `Java` and `JPA` put every class in one `.java` file, as the tab shows them.  
The Export menu has no Code Generator entry, and the `Code Generator` tab of Table Properties cannot save a file.

To copy the code, click `Copy` at the foot of the panel, or hover the code and click the copy button at its top right, the only way in Table Properties.  
A `Copied!` toast with a check mark confirms for two seconds. If the browser or host refuses the clipboard, a `Couldn't copy to the clipboard` toast with a warning sign says so instead. Copying again replaces the toast rather than adding another.  
The text is selectable as well, so you can take only the part you need.
