---
sidebar_position: 1
description: erd-editor is an Entity-Relationship Diagram editor for the browser, VS Code, IntelliJ, and your own page.
---

# Introduction

erd-editor is an Entity-Relationship Diagram editor.
It is available as a web app, a VS Code extension, an IntelliJ plugin, and as an `<erd-editor>` custom element you can embed in your own page.
It is one editor and one document format across all of them.

<img src="/img/erd-editor-vscode.png" alt="erd-editor running inside VS Code" loading="lazy" />

## Where to Get It

| Platform | Install | What you get |
| --- | --- | --- |
| Web app | [erd-editor.io](https://erd-editor.io) | Installable PWA, works offline, real-time collaboration |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | Opens `.erd.json` files in a custom editor |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | The same editor, for IntelliJ-based IDEs |
| Your page | `npm install @dineug/erd-editor` | The framework-free `<erd-editor>` custom element — see [Install](../api/installation.md) |

To try it in an IDE, create an empty file with a `.erd.json` extension and open it.

## What It Does

- Draw tables, columns, and memos on an unbounded canvas, and connect them with four relationship types: `Zero One`, `Zero N`, `One Only`, `One N`. See [Editing Start](./guides/editing-start.md). Indexes are defined in the table's property panel. See [Indexes](./guides/table-related-functions.md#indexes).
- Import an existing schema from `json`, `Schema SQL`, `GraphQL`, `DBML`, or `AML`. See [Importing or Exporting Files](./guides/file-import-export.md).
- Export the diagram as `json`, `Schema SQL`, or `png`.
- Write Schema SQL in the syntax of eight database vendors: Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, and SQLite. See [Table-related Functions](./guides/table-related-functions.md#databases).
- Generate code for fourteen targets: C#, Go, Java, Kotlin, Scala, TypeScript, Drizzle, JPA, Sequelize, SQLAlchemy, TypeORM, AML, DBML, and GraphQL. See [Code Generator](./guides/code-generator.md).
- Read the schema as a force-directed graph in [Visualization](./guides/visualization.md), where hovering a table lights up everything it touches.
- Work on a canvas with no edges: pan wherever the diagram goes, zoom from `10%` to `150%`, and clear everything but the diagram with zen mode. See [Getting Around the Canvas](./guides/table-related-functions.md#getting-around-the-canvas).
- Find a table or run a command from anywhere with [Quick Search](./guides/quick-search.md), and step through the edit history with [Undo, Redo](./guides/undo-redo.md).
- Edit together in real time (experimental). Sessions are peer-to-peer and end-to-end encrypted, so no server holds your schema, and peers see each other's cursors, focus, and selections. In your own page, [`getSharedStore()`](../api/advanced/collaborative-editing.md) gives you the same action stream over the transport of your choice.

Start with the [Editing Guide](/docs/category/guides).

## Reason Behind This Project

Existing modeling tools didn't provide the level of user experience I desired.  
Hence, I initiated this project to deliver the ultimate user experience.  
The project's top priority is the user's editing experience.  
It will offer you an astounding experience in editing.
