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

#### Comments

Table and column comments are imported from the two syntaxes the parser reads: the `COMMENT` table option and column attribute used by MySQL, MariaDB, Snowflake, and Databricks, and the `COMMENT ON TABLE` and `COMMENT ON COLUMN` statements used by PostgreSQL and Oracle.  
A comment naming a table or column the file does not define is ignored.

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
The file name must end in `.dbml`.

### AML

You can import an AML (Azimutt Markup Language) file. Both the current spelling and the legacy v1 one are accepted.  
Entities become tables, and nested attributes are flattened into a dotted column name such as `settings.slug`.  
Attributes are `NOT NULL` unless marked `nullable`, and constructs the editor has no slot for, such as `check`, `view`, `type`, `color`, `tags`, and `onDelete`, are dropped rather than rejected.  
The file name must end in `.aml`.

GraphQL, DBML, and AML are round-trip formats: each is also a [Code Generator](./code-generator.md) target.

## Exporting

Three formats are supported for exporting:

- json: Schema file defined in the editor. Saved as `.erd.json`.
- Schema SQL: Schema file generated based on the syntax of the database vendor. Saved as `.sql`.
- png: Generates the diagram as an image. Saved as `.png`.

The PNG holds the whole diagram however far it is scrolled away, cropped to what the diagram itself draws plus a margin, and drawn at the zoom the editor is showing — zoom in before exporting for a larger image.  
It is drawn in a background worker, so the editor stays usable while it runs, and a notice says the export is running. A diagram too large for a browser canvas to raster is written at a reduced resolution, with a notice saying so, rather than producing no file.

Every exported file is named `<database name>-<timestamp>` followed by that extension, with the timestamp formatted as `yyyy-MM-dd'T'HH_mm_ss` — for example `my-schema-2026-08-29T04_05_06.erd.json`. A blank database name falls back to `unnamed`.

![Choosing png from the Export submenu, with a notice that the export is running](/img/demo-export.webp)

Import and Export are also available from [Quick Search](./quick-search.md). It offers the same five import formats, but only `json` and `Schema SQL` for export; PNG is available from the context menu only.
