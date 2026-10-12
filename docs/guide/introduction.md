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
| Coding agents | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | An MCP server that lets Claude Code, Codex, or another client edit a diagram live in VS Code, a JetBrains IDE, or Obsidian, or in the file itself |

To try it in an IDE, create an empty file with a `.erd.json` extension and open it.
In Obsidian, run `ERD Editor: Create new diagram` from the command palette, or choose `New ERD` from a folder's context menu in the file explorer. Either one creates an empty `.erd` file and opens it.
In Google Drive, choose New → More → ERD Editor, then sign in with Google. ERD Editor reaches only the files you create or open with it.
In the web app, Google Drive, VS Code, a JetBrains IDE, and Obsidian, a new, empty diagram opens on the [welcome screen](./guides/editing-start.md#welcome-screen), a menu of first steps: `New Table`, `New Memo`, `Import`, `Command Palette`, and `Shortcuts`.
Scrolling, zooming, and switching tabs leave a new diagram's empty file as it is, since every lock is on in a new diagram. See [Lock](./guides/settings.md#lock).
VS Code opens an ERD file as JSON text in Source Control, Local History, Compare with Saved, the edit reviews of VS Code's chat and of coding agents such as GitHub Copilot and Claude Code, and the revision views of extensions such as GitLens, GitHub Pull Requests, and Git Graph, so a change diffs line by line. `Reopen Editor With...` shows a Git revision as a read-only diagram.

After updating the Obsidian plugin, restart Obsidian: until then, the window keeps the editor that the earlier version loaded.
Update ERD Editor wherever you share diagrams: an earlier release shows no primary key icons in a file the current release saved, and saving the file there drops its table groups and Schema SQL scripts.
A file an earlier release saved is rewritten in the current form on the first change the file keeps — see [Lock](./guides/settings.md#lock). Until then, a JSON editor that validates it against its `$schema` reports it as invalid.

## What It Does

- Draw tables, columns, and memos on an unbounded canvas, and connect them with four relationship types: `Zero One`, `Zero N`, `One Only`, `One N`. See [Editing Start](./guides/editing-start.md). Indexes are defined in the table's property panel. A unique index over two or more columns is an alternate key, and with the `Alternate Key` view option on, the diagram marks its columns `AK1.1`, `AK1.2`, and so on. See [Indexes](./guides/table-related-functions.md#indexes) and [Alternate Keys](./guides/table-related-functions.md#alternate-keys).
- End a relationship on columns a table already has: while you draw one with a mouse or a pen, `Map to existing columns` beside the table it ends on pairs the parent's key with that table's columns, and `Create new columns` adds new ones. `Map Columns` in a relationship's context menu changes its columns later. See [Map Columns](./guides/relationship-editing.md#map-columns). A relationship can also carry ON DELETE and ON UPDATE actions. See [ON DELETE and ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update).
- Edit quickly: `Alt + N` adds a table; `Alt + Enter` adds a column; `Alt + K` toggles the primary key on the focused column, or on every selected column when it is one of them; and `Delete` or `Backspace` deletes the selection. Each is one undo step. See [Shortcuts](./guides/settings.md#shortcuts).
- Color a table, memo, or table group from a picker with presets and the colors the diagram already uses, and take a color off with `No color` or `Remove color`. See [Table and Memo Color Specification](./guides/table-related-functions.md#table-and-memo-color-specification).
- Gather related tables into [table groups](./guides/table-groups.md): a box behind them that you can name and color, drawn with `New Table Group` from the canvas context menu or Quick Search, or made from the selected tables with `Group selected tables` in their context menu. A table joins a group when you drop it inside and leaves when you drop it outside, and dragging a group by its title bar moves its tables with it. DBML carries groups both ways, as `TableGroup` blocks.
- Import an existing schema from `json`, `Schema SQL`, `GraphQL`, `DBML`, or `AML`. See [Importing or Exporting Files](./guides/file-import-export.md). A Schema SQL, GraphQL, DBML, or AML file arrives with its tables laid out along their relationships, or in rows when it has none. [`Import and Add`](./guides/file-import-export.md#import-and-add) adds a file below the diagram instead of replacing it.
- Export the diagram as `json`; as Schema SQL from the [Schema SQL](./guides/schema-sql.md#saving-or-copying-the-sql) tab, saved as a `.sql` file or copied; or from the [`Export image`](./guides/file-import-export.md#image) dialog as a PNG or SVG image, or a PNG on the clipboard.
- Write Schema SQL in the syntax of eight database vendors: Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, and SQLite. See [Table-related Functions](./guides/table-related-functions.md#databases). The [Schema SQL](./guides/schema-sql.md) tab's options panel picks the statements, the header, and the table groups to write, and keeps SQL of your own, saved in the diagram, to write before and after the tables.
- Generate code for twenty-two targets: the languages C#, Go, Java, Kotlin, PHP, Rust, Scala, Swift, and TypeScript; the ORMs Doctrine, Drizzle, JPA, SeaORM, Sequelize, SQLAlchemy, and TypeORM; and AML, DBML, GraphQL, JSON Schema, Mermaid, and Zod. The Code Generator tab's options panel picks the language, the database, and the name cases, and the code is saved as a file with the language's extension or copied. See [Code Generator](./guides/code-generator.md).
- Read the schema in [Visualization](./guides/visualization.md), as a force-directed `Graph` or as a `Flow` of table cards laid out along their relationships, where hovering a table lights up everything it touches. Press `Alt + F` on the ERD tab to [focus on the selected tables](./guides/visualization.md#focusing-on-tables) and the tables related to them.
- Work on a canvas with no edges: pan wherever the diagram goes, zoom from `10%` to `150%` with `Ctrl + Wheel` (`⌘ + Wheel` on Mac), the keyboard, or a pinch, and clear everything but the diagram with zen mode. A drag with the middle mouse button pans from anywhere on the canvas, even over a table. See [Getting Around the Canvas](./guides/table-related-functions.md#getting-around-the-canvas).
- Arrange a whole diagram in one step with [Auto Layout](./guides/table-related-functions.md#auto-layout): a force simulation, a left-to-right flow, or a tree in either direction, each table group kept together.
- Run a command from anywhere with [Quick Search](./guides/quick-search.md), or start the search with `#`, `@`, or `:` to jump to a table, a column, or a comment or memo. Step through the edit history with [Undo, Redo](./guides/undo-redo.md), replay this session's history on the canvas with [Time Travel](./guides/undo-redo.md#time-travel), or compare the diagram with another `.json` file in the [Diff Viewer](./guides/table-related-functions.md#diff-viewer).
- Find text in table and column names, comments, and memos with [Find and Replace](./guides/find-and-replace.md), and replace one match or all of them. Open it with `Ctrl + F` (`⌘ + F` on Mac) or the toolbar button next to `Search`.
- Use the editor in 25 languages, picked from the toolbar's `Display Language` button or from Quick Search. `System` follows the language of the browser or the host app, and Arabic, Hebrew, and Persian lay the editor out right to left while the diagram stays left to right. Only the editor's own text changes: names, SQL, and generated code stay as written. The toolbar's theme builder picks the appearance (`System`, `Light`, or `Dark`), a gray color, and an accent color. See [Language and Theme](./guides/language-and-theme.md).
- Keep diffs clean: the scroll position and zoom, the open tab, the Code Generator's language and name cases, and the bracket type are [locked](./guides/settings.md#lock) by default, so the file keeps the values they had when locked, and scrolling, zooming, or switching tabs never changes it. The file is written in a fixed order and leaves out measured widths, the stacking order, connector anchors, and removed items, so opening a diagram and closing it without an edit leaves the file as it was.
- Let a coding agent such as Claude Code or Codex edit the diagram through the [MCP server](../mcp/introduction.md): live in VS Code, Obsidian, or a JetBrains IDE, where each change shows up on the canvas as it happens, or in the file itself.
- Edit together in real time in the web app (experimental). Sessions are peer-to-peer and end-to-end encrypted, so no server holds your schema, and peers see each other's cursors, focus, and selections. In your own page, [`getSharedStore()`](../api/advanced/collaborative-editing.md) gives you the same action stream over the transport of your choice.

Start with the [Editing Guide](/docs/category/guides).

## Reason Behind This Project

Existing modeling tools didn't provide the level of user experience I desired.  
Hence, I initiated this project to deliver the ultimate user experience.  
The project's top priority is the user's editing experience.  
It will offer you an astounding experience in editing.
