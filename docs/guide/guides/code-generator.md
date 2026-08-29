---
sidebar_position: 8
description: Generate code for fourteen targets from the diagram, and set the table and column name case.
---

# Code Generator

Switch to the `Code Generator` tab in the toolbar, then right-click inside the code panel to open the context menu.  
The menu offers `Language`, `Table Name Case`, and `Column Name Case`.

<img src="/img/code-generator.png" width="400" alt="Code generator menu" loading="lazy" />

The same panel is also the `Code Generator` tab of [Table Properties](./table-related-functions.md#table-properties), where it generates code for that one table instead of the whole document.  
The three menus are available from [Quick Search](./quick-search.md) as well, while this tab is open.

## Language

Fourteen targets are supported, listed in three runs — languages, ORMs, then schema DSLs — each run in alphabetical order:

| Target | Group | Relationships | Indexes |
| --- | --- | --- | --- |
| `C#` | Language | — | — |
| `Go` | Language | — | — |
| `Java` | Language | — | — |
| `Kotlin` | Language | — | — |
| `Scala` | Language | — | — |
| `TypeScript` | Language | — | — |
| `Drizzle` | ORM | ✓ | ✓ |
| `JPA` | ORM | ✓ | — |
| `Sequelize` | ORM | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ |
| `AML` | Schema DSL | ✓ | ✓ |
| `DBML` | Schema DSL | ✓ | ✓ |
| `GraphQL` | Schema DSL | ✓ | — |

The default is `GraphQL`. Every target emits columns; the ✓ marks show what else it emits.  
Tables are emitted in name order rather than in the order they sit on the canvas, and indexes are the ones defined in Table Properties.

`AML`, `DBML`, and `GraphQL` are round-trip formats: each is an import source too. See [Importing or Exporting Files](./file-import-export.md).

## Name Case

`Table Name Case` and `Column Name Case` each support `Pascal`, `Camel`, `Snake`, and `None`.  
The defaults are `Pascal` for table names and `Camel` for column names. `None` emits a name as it is written in the diagram.

`AML` and `DBML` ignore both settings and always emit the names from the diagram.

## Database

Data types are resolved against the selected database, so choose it before you switch to this tab — see [Databases](./table-related-functions.md#databases).  
`Drizzle` takes its dialect from the same setting: `pgTable` for PostgreSQL, `mysqlTable` for MySQL and MariaDB, `sqliteTable` for SQLite, and `pgTable` for every other database.

`AML` and `DBML` are the exception: they emit each data type as it is written in the diagram, so the database setting does not change their output.

## Copying the Result

Generated code has no file export, so copy it out of the panel.  
Hover the panel and click the copy button at its top right; a `Copied!` toast confirms. The text is selectable as well, so you can take only the part you need.
