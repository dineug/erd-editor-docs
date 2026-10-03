---
sidebar_position: 1
description: erd-editor is an Entity-Relationship Diagram editor for the browser, Google Drive, VS Code, IntelliJ, Obsidian, and your own page.
---

# Introduction

erd-editor is an Entity-Relationship Diagram editor.
It is available as a web app, a Google Drive app, a VS Code extension, an IntelliJ plugin, an Obsidian plugin, and as an `<erd-editor>` custom element you can embed in your own page.
It is one editor and one document format across all of them.

![A shop diagram: hovering a relationship, adding a column, and focusing on orders in Flow](/img/demo-overview.webp)

## Where to Get It

| Platform | Install | What you get |
| --- | --- | --- |
| Web app | [erd-editor.io](https://erd-editor.io) | Installable PWA, works offline, real-time collaboration |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | Adds ERD Editor to Drive's Open with and New menus, and saves back to the same file |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | Opens `.erd.json` files in a custom editor |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | The same editor, for IntelliJ-based IDEs |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | Opens `.erd` and `.erd.json` files in a vault tab, desktop only |
| Your page | `npm install @dineug/erd-editor` | The framework-free `<erd-editor>` custom element — see [Install](../api/installation.md) |

To try it in an IDE, create an empty file with a `.erd.json` extension and open it.
In Obsidian, run `ERD Editor: Create new diagram` from the command palette, or choose `New ERD` from a folder's context menu in the file explorer. Either one creates an empty `.erd` file and opens it.
Scrolling and zooming leave a new diagram's empty file as it is, since a new diagram saves neither the scroll position nor the zoom level. See [Save Scroll Information](./guides/settings.md#save-scroll-information).
In Google Drive, choose New → More → ERD Editor, then sign in with Google. ERD Editor reaches only the files you create or open with it.
After updating the Obsidian plugin, restart Obsidian: until then, the window keeps the editor that the earlier version loaded.

## What It Does

- Draw tables, columns, and memos on an unbounded canvas, and connect them with four relationship types: `Zero One`, `Zero N`, `One Only`, `One N`. See [Editing Start](./guides/editing-start.md). A relationship can also carry ON DELETE and ON UPDATE actions. See [ON DELETE and ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update). Indexes are defined in the table's property panel. A unique index over two or more columns is an alternate key, and with the `Alternate Key` view option on, the diagram marks its columns `AK1.1`, `AK1.2`, and so on. See [Indexes](./guides/table-related-functions.md#indexes) and [Alternate Keys](./guides/table-related-functions.md#alternate-keys).
- Import an existing schema from `json`, `Schema SQL`, `GraphQL`, `DBML`, or `AML`. See [Importing or Exporting Files](./guides/file-import-export.md).
- Export the diagram as `json`, `Schema SQL`, or `png`.
- Write Schema SQL in the syntax of eight database vendors: Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, and SQLite. See [Table-related Functions](./guides/table-related-functions.md#databases).
- Generate code for fourteen targets: C#, Go, Java, Kotlin, Scala, TypeScript, Drizzle, JPA, Sequelize, SQLAlchemy, TypeORM, AML, DBML, and GraphQL. See [Code Generator](./guides/code-generator.md).
- Read the schema in [Visualization](./guides/visualization.md), as a force-directed `Graph` or as a `Flow` of table cards laid out along their relationships, where hovering a table lights up everything it touches. Press `Alt + F` on the ERD tab to [focus on the selected tables](./guides/visualization.md#focusing-on-tables) and the tables related to them.
- Work on a canvas with no edges: pan wherever the diagram goes, zoom from `10%` to `150%` with `Ctrl + Wheel` (`⌘ + Wheel` on Mac), the keyboard, or a pinch, and clear everything but the diagram with zen mode. See [Getting Around the Canvas](./guides/table-related-functions.md#getting-around-the-canvas).
- Arrange a whole diagram in one step with [Auto Layout](./guides/table-related-functions.md#auto-layout): a force simulation, a left-to-right flow, or a tree in either direction.
- Run a command from anywhere with [Quick Search](./guides/quick-search.md), or start the search with `#`, `@`, or `:` to jump to a table, a column, or a comment or memo. Step through the edit history with [Undo, Redo](./guides/undo-redo.md).
- Find text in table and column names, comments, and memos with [Find and Replace](./guides/find-and-replace.md), and replace one match or all of them. Open it with `Ctrl + F` (`⌘ + F` on Mac) or the toolbar button next to `Search`.
- Let a coding agent such as Claude Code or Codex edit the diagram through the [MCP server](../mcp/introduction.md): live in VS Code, Obsidian, or a JetBrains IDE, where each change shows up on the canvas as it happens, or in the file itself.
- Edit together in real time in the web app (experimental). Sessions are peer-to-peer and end-to-end encrypted, so no server holds your schema, and peers see each other's cursors, focus, and selections. In your own page, [`getSharedStore()`](../api/advanced/collaborative-editing.md) gives you the same action stream over the transport of your choice.

Start with the [Editing Guide](/docs/category/guides).

## Reason Behind This Project

Existing modeling tools didn't provide the level of user experience I desired.  
Hence, I initiated this project to deliver the ultimate user experience.  
The project's top priority is the user's editing experience.  
It will offer you an astounding experience in editing.
