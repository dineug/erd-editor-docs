---
sidebar_position: 1
description: Let a coding agent such as Claude Code or Codex edit erd-editor diagrams through the @dineug/erd-editor-mcp MCP server, live in VS Code, Obsidian, or a JetBrains IDE, or straight on disk.
---

# Introduction

`@dineug/erd-editor-mcp` is an MCP server that lets a coding agent edit erd-editor diagrams.
Claude Code, Codex, and any other client of the [Model Context Protocol](https://modelcontextprotocol.io) get one tool per operation on a document: add a table, rename a column, relate two tables, import a DDL dump, read the schema back as SQL.

When the document is open in the ERD Editor of [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor), or a [JetBrains IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor), the agent joins the editor like a collaborator.
Each change shows up on the canvas as it happens, and the agent's undo reverts only its own edits.
VS Code keeps the agent's changes unsaved until the agent or you save, while Obsidian and a JetBrains IDE save them as they save your own.
With no editor on the document, the same tools edit the file itself.

![A coding agent adding tables and relationships to a diagram open in VS Code](/img/coding-agents.webp)

## What an Agent Can Do

- Build or change a schema in conversation: tables, columns and every column option, relationships with their cardinality and their ON DELETE and ON UPDATE actions, indexes, memos, colors, and positions on the canvas. See [Relationships](./tools.md#relationships).
- Gather tables in [table groups](../guide/guides/table-groups.md): add a group around the tables it names or over an area of the canvas, then rename it, color it, move it with its tables, resize it, put tables in or take them out, or remove it, which leaves its tables where they are. See [Table Groups](./tools.md#table-groups).
- Replace the document with a schema parsed from SQL DDL, GraphQL SDL, DBML, or AML, or with another `.erd.json` document. Or add that schema or document below the diagram and keep everything already there, as the editor's [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) does. A DBML `TableGroup` arrives as a table group either way. See [Import](./tools.md#import).
- Read the diagram back as a list of ids, as whole entities, as the `.erd.json` text a save writes, or as DDL for any of the eight databases, with the `Statements` and `Header` choices of the [Schema SQL](../guide/guides/schema-sql.md) tab. On a schema of thousands of tables it reads a page, a few tables, or the tables of a few table groups at a time. See [Reading a Document](./tools.md#reading-a-document).
- Set the database, the database name, and the [scripts](../guide/guides/schema-sql.md#before-and-after-scripts) written before and after the tables in the Schema SQL, such as `CREATE EXTENSION` ahead of them or `GRANT` after them. `erd_read` gives the scripts alone, or within the DDL of the whole document. See [Settings](./tools.md#settings).
- Run several edits as one, all or none, which one undo reverts. See [erd_batch](./tools.md#erd_batch).
- Undo and redo its own edits, never yours.

What it does not do:

- Zoom, scroll, or switch tabs. Those belong to each viewer, so no tool does so. An import that replaces the document still moves the view, even with `Viewport` locked, as the editor's `Import` does: back to the start of the canvas at 100%, or, with `erd_import_json`, to the view of the document it loads, and to its tab too unless that document locks `Canvas Type`. See [Import](./tools.md#import).
- Change [`View Option`](../guide/guides/table-related-functions.md#table-view-options), the Code Generator's language and name cases, the bracket type, or the [Settings](../guide/guides/settings.md) tab's `Relationship DataType Sync`, `Maximum comment width`, and `Column Order`. Those are yours to set in the editor, and the agent reads them as the file saves them.
- Turn a [lock](../guide/guides/settings.md#lock) on or off. Only `erd_import_json` replacing the whole document changes the locks or the settings above, to those of the document it loads. A document with no `lockSettings` field, such as a file an earlier release saved, turns every lock on. Undoing any import that replaced the document brings back the settings and locks the document had before.
- Re-map a relationship onto other columns, as [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) does. Instead, the agent removes the relationship, which leaves its foreign key columns in place, and links the columns it wants with `erd_link_columns`, in one `erd_batch` that one undo reverts.
- Run the Code Generator. `erd_read` answers DDL or JSON, and the agent writes code from that itself.

## How It Works

The server is a stdio process your MCP client starts.
For every call it looks for an editor that holds the document: a VS Code window, an Obsidian vault window, or a JetBrains IDE, each with the ERD Editor extension or plugin.

- **Live** — an editor has the document in its workspace, its vault, or one of its open projects, or has it open. The server joins that editor's editing session and the edit lands in the editor: unsaved in VS Code, and saved as your own edits are in Obsidian and a JetBrains IDE.
- **Headless** — no editor. The server loads the file, applies the edit, and writes the file back.
- **Refused** — an editor holds the document but has its hub off. The server reads from disk but writes nothing, since the open editor could overwrite the file on its next save. When the editor's hub is on but its ERD Editor extension or plugin speaks another hub protocol than the server, every call on the document is refused, reads included, with `protocolMismatch` and a message that names the side to update — see [Updating](./installation.md#updating).

See [Live and Headless](./live-and-headless.md) for the details.

## Requirements

| | |
| --- | --- |
| Node.js | `22.12` or later, to run the server |
| An MCP client | Claude Code, Codex, or any client that can start a stdio server |
| VS Code, for live editing | `1.101.0` or later, with the ERD Editor extension `4.0.0` or later |
| Obsidian, for live editing | The desktop app `1.5.7` or later, with the ERD Editor plugin `1.0.0` or later |
| A JetBrains IDE, for live editing | An IntelliJ-based IDE `2025.2` or later, with the ERD Editor plugin `1.0.0` or later |

Server `1.0.0` and the releases above speak hub protocol 2.
The earlier releases that serve agents speak protocol 1: the VS Code extension `3.0.0` to `3.1.0`, the Obsidian plugin `0.1.0` and `0.2.0`, and the JetBrains plugin `0.9.0` and `0.10.0`.
Such a release and server `1.0.0` refuse each other, and so do an earlier server and the releases above — see [Updating](./installation.md#updating).
A VS Code extension before `3.0.0` or a JetBrains plugin before `0.9.0` has no hub, so the server does not see it and edits the file on disk, even a diagram open in it.

Next: [Install](./installation.md).
