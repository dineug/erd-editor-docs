---
sidebar_position: 2
description: Import JSON or schema SQL into the editor, and export JSON, schema SQL, or a PNG.
---

# Importing or Exporting Files

## Importing External Files

### JSON

You can import files in the [schema format defined in the editor](../../api/advanced/schema.md).
The file name must end in `.json`; a `.erd` or `.vuerd` file is not accepted here.

<img src="/img/import-json.png" width="400" alt="Import JSON menu" loading="lazy" />

### Schema SQL

You can also import schema files defined in SQL.  
Although parsers have been made as flexible as possible regardless of the database vendor, there might be some unsupported syntax.  
[Supported syntax can be checked here.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

<img src="/img/import-sql.png" width="400" alt="Import Schema SQL menu" loading="lazy" />

## Exporting

Three formats are supported for exporting:

- JSON: Schema file defined in the editor. Saved as `<database name>-<timestamp>.erd.json`.
- Schema SQL: Schema file generated based on the syntax of the database vendor.
- PNG: Generates the diagram as an image.

<img src="/img/export-menu.png" width="400" alt="Export menu" loading="lazy" />
