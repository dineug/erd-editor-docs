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

- Build or change a schema in conversation: tables, columns and every column option, relationships, indexes, memos, colors, and positions on the canvas.
- Replace the document with a schema parsed from SQL DDL, GraphQL SDL, DBML, or AML, or with another `.erd.json` document.
- Read the diagram back as a list of ids, as whole entities, as DDL for any of the eight databases, or as the raw JSON. On a schema of thousands of tables it reads a page or a few tables at a time. See [Reading a Document](./tools.md#reading-a-document).
- Change the settings the document stores: the database, the Code Generator language and name cases, the bracket type, and which parts of a table are shown.
- Run several edits as one, all or none, which one undo reverts. See [erd_batch](./tools.md#erd_batch).
- Undo and redo its own edits, never yours.

What it does not do:

- Zoom, scroll, or switch tabs. Those belong to each viewer, not to the document, so no tool changes them.
- Run the Code Generator. `erd_read` answers DDL or JSON, and the agent writes code from that itself.

## How It Works

The server is a stdio process your MCP client starts.
For every call it looks for an editor that holds the document: a VS Code window, an Obsidian vault window, or a JetBrains IDE, each with the ERD Editor extension or plugin.

- **Live** — an editor has the document in its workspace, its vault, or one of its open projects, or has it open. The server joins that editor's editing session and the edit lands in the editor: unsaved in VS Code, and saved as your own edits are in Obsidian and a JetBrains IDE.
- **Headless** — no editor. The server loads the file, applies the edit, and writes the file back.
- **Refused** — an editor holds the document but has its hub off. The server reads from disk but writes nothing, since the open editor could overwrite the file on its next save.

See [Live and Headless](./live-and-headless.md) for the details.

## Requirements

| | |
| --- | --- |
| Node.js | `22.12` or later, to run the server |
| An MCP client | Claude Code, Codex, or any client that can start a stdio server |
| VS Code, for live editing | `1.101.0` or later, with the ERD Editor extension `3.0.0` or later, `3.0.1` recommended |
| Obsidian, for live editing | The desktop app, with the ERD Editor plugin `0.1.0` or later |
| A JetBrains IDE, for live editing | An IntelliJ-based IDE `2025.2` or later, with the ERD Editor plugin `0.9.0` or later |

Next: [Install](./installation.md).
