---
sidebar_position: 9
description: Generate code for fourteen targets from the diagram, see which targets write a relationship's ON DELETE and ON UPDATE actions, and set the table and column name case.
---

# Code Generator

Switch to the `Code Generator` tab in the toolbar, then right-click inside the code panel to open the context menu.  
The menu offers `Language`, `Table Name Case`, and `Column Name Case`.

![Picking TypeScript and Snake table names from the code panel's context menu, then copying the code](/img/demo-code-generator.webp)

The same panel is also the `Code Generator` tab of [Table Properties](./table-related-functions.md#table-properties), where it generates code for that one table instead of the whole document.  
The three menus are available from [Quick Search](./quick-search.md) as well, while this tab is open.

## Language

Fourteen targets are supported, listed in three runs — languages, ORMs, then schema DSLs — each run in alphabetical order:

| Target | Group | Relationships | Indexes | ON DELETE / ON UPDATE |
| --- | --- | --- | --- | --- |
| `C#` | Language | — | — | — |
| `Go` | Language | — | — | — |
| `Java` | Language | — | — | — |
| `Kotlin` | Language | — | — | — |
| `Scala` | Language | — | — | — |
| `TypeScript` | Language | — | — | — |
| `Drizzle` | ORM | ✓ | ✓ | ✓ |
| `JPA` | ORM | ✓ | — | — |
| `Sequelize` | ORM | ✓ | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ | ✓ |
| `AML` | Schema DSL | ✓ | ✓ | ✓ |
| `DBML` | Schema DSL | ✓ | ✓ | ✓ |
| `GraphQL` | Schema DSL | ✓ | — | — |

The default is `GraphQL`. Every target emits columns; the ✓ marks show what else it emits.  
Tables are emitted in name order rather than in the order they sit on the canvas, and indexes are the ones listed under `Indexes` in [Table Properties](./table-related-functions.md#indexes), not the `Keys` rows above them.

`AML`, `DBML`, and `GraphQL` are round-trip formats: each is an import source too. See [Importing or Exporting Files](./file-import-export.md).

## ON DELETE and ON UPDATE

A relationship's ON DELETE and ON UPDATE actions are set from its context menu — see [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
The targets with a ✓ in the last column write the actions a relationship sets; an action left at `Not set` writes nothing.  
Which actions the ORM targets keep depends on the selected database, while `AML` and `DBML` keep them all — see [Database](#database).

- `Drizzle` writes them in lower case. On `.references()` they are options, such as `{ onDelete: "cascade", onUpdate: "set null" }`; on a `foreignKey()`, which a multi-column key gets, they are chained, such as `.onDelete("restrict").onUpdate("no action")`.
- `Sequelize` writes `onDelete: "CASCADE"` and `onUpdate` entries into both association calls: `hasMany` or `hasOne`, and `belongsTo`. A multi-column key gets no association calls, so `Sequelize` writes no actions for it.
- `SQLAlchemy` passes `ondelete="CASCADE"` and `onupdate` arguments to `ForeignKey()` for a one-column key, and to `ForeignKeyConstraint()` for a multi-column key.
- `TypeORM` writes `onDelete: "CASCADE"` and `onUpdate` options on the owning side's `@ManyToOne` or `@OneToOne`, never on the inverse side. It always leaves `SET DEFAULT` out, because TypeORM would write it as `DEFAULT`, which no database accepts.
- `DBML` adds settings to the `Ref`, such as `[delete: set null, update: no action]`.
- `AML` writes a relationship that has an action as a standalone `rel` statement with properties, such as `{onDelete: cascade, onUpdate: "set null"}`, rather than inline on its column.

`JPA` writes none: plain JPA has no option for them, and the generator does not use Hibernate's `@OnDelete`.  
In the `Code Generator` tab of Table Properties, which shows one table, `DBML` writes no `Ref` and `AML` no `rel` statement, so neither shows the actions there; `AML` keeps a one-column relation that has actions inline on its column, as it does one without them.

## Name Case

`Table Name Case` and `Column Name Case` each support `Pascal`, `Camel`, `Snake`, and `None`.  
The defaults are `Pascal` for table names and `Camel` for column names. `None` emits a name as it is written in the diagram.

`AML` and `DBML` ignore both settings and always emit the names from the diagram.

## Database

Data types are resolved against the selected database, so choose it before you switch to this tab — see [Databases](./table-related-functions.md#databases).  
`Drizzle` takes its dialect from the same setting: `pgTable` for PostgreSQL, `mysqlTable` for MySQL and MariaDB, `sqliteTable` for SQLite, and `pgTable` for every other database.

The selected database also decides which ON DELETE and ON UPDATE actions the ORM targets write.  
`Sequelize`, `SQLAlchemy`, and `TypeORM` leave out any action that database's Schema SQL leaves out, such as `SET DEFAULT` on MySQL and MariaDB or `RESTRICT` on MSSQL, so the database's default applies. The full list is in [ON DELETE and ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` follows the dialect it writes instead: `mysqlTable` code leaves out `SET DEFAULT`, while `pgTable` and `sqliteTable` code keep every action, including the `pgTable` code it writes for MSSQL, Oracle, Snowflake, and Databricks.

`AML` and `DBML` are the exception: they emit each data type as it is written in the diagram and every action a relationship sets, so the database setting does not change their output.

## Copying the Result

Generated code has no file export, so copy it out of the panel.  
Hover the panel and click the copy button at its top right; a `Copied!` toast confirms. The text is selectable as well, so you can take only the part you need.
