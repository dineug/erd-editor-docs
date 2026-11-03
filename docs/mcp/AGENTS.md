# mcp

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-03

## Purpose

The `mcp` sidebar, which the navbar's `MCP` item opens. It documents `@dineug/erd-editor-mcp`, the
stdio MCP server that lets a coding agent edit a diagram. The server works live, through the ERD
Editor of VS Code, Obsidian or a JetBrains IDE, or headless, on the file itself. In Key Files, a
source path is under `../erd-editor/packages/`.

## Key Files

| File | Description |
|------|-------------|
| `introduction.md` | 1 · What an Agent Can Do (and what it does not do), How It Works (Live, Headless and Refused in short), Requirements (Node.js `22.12`, VS Code `1.101.0` with extension `4.0.0`, Obsidian `1.5.7` with plugin `1.0.0`, IntelliJ `2025.2` with plugin `1.0.0`), and the release floors for protocol 2, logical names and simultaneous edits. Embeds `/img/coding-agents.webp`, which no `scripts/demos/` scene records |
| `installation.md` | 2 · Registering the server with Claude Code (`claude mcp add …`), Codex (`codex mcp add …`, or `config.toml`) and Any Other MCP Client. Then Set Up VS Code, Set Up Obsidian and Set Up a JetBrains IDE, each with a settings table. Then Try It, and Updating (protocols 1 and 2, and the `protocolMismatch` message endings). Source: `mcp-server/package.json` (`version` `1.2.0`, `engines.node` `>=22.12.0`), `vscode-extension/package.json` (`dineug.erd-editor.agentHub.enabled`), `agent-hub/src/protocol.ts` (`HUB_PROTOCOL_VERSION`, `protocolMismatchMessage`) |
| `live-and-headless.md` | 3 · How the server picks a mode from the lock files in `~/.erd-editor/ide/` (the opening table). Live (Edits Made at the Same Moment, Saving, Undo, When the Editor Goes Away), Headless, Refused, Documents. Source: `mcp-server/src/session/` (`live.ts`, `headless.ts`, `manager.ts`), `mcp-server/src/hub/discovery.ts`, `agent-hub/src/lock.ts` (the lock directory) |
| `tools.md` | 4 · The 77 tools. Session Tools; Reading a Document (`erd_read` formats, Large Schemas, Dictionary Checks); Edit Tools, with one H3 table per entity (Tables, Columns, Relationships, Indexes, Memos, Table Groups, Dictionaries, Settings, Import); erd_batch; and Results (the result fields and the refusal `code` table). Source: `mcp-server/src/tools/registry/` (one file per H3: `table.ts`, `column.ts`, `relationship.ts`, `indexes.ts`, `memo.ts`, `tableGroup.ts`, `dictionary.ts`, `settings.ts`, `import.ts`), `tools/read.tool.ts`, `tools/checks.ts`, `tools/batch.ts`, `tools/result.ts`, `mcp-server/src/errors.ts` |

## For AI Agents

### Working In This Directory

- **Release floors are restated across all four pages.** They are server `1.0.0`, `1.1.0` and
  `1.2.0`; VS Code extension `4.0.0`, `4.2.0` and `4.3.0`; Obsidian and JetBrains plugins `1.0.0`,
  `1.2.0` and `1.3.0`; and the protocol-1 releases (extension `3.0.0` to `3.1.0`, Obsidian `0.1.0`
  and `0.2.0`, JetBrains `0.9.0` and `0.10.0`). `installation.md#updating` is the home, and 4
  pages link it. When a release adds or moves a floor, update every statement of it.
  `` grep -rn --exclude=AGENTS.md '`4.3.0`' docs/mcp `` finds 8 at `v5.1.0`. The current releases
  are `mcp-server` `1.2.0`, `vscode-extension` `4.3.0`, `obsidian-plugin/manifest.json` `1.3.0`
  and `intellij-plugin/gradle.properties` `pluginVersion = 1.3.0`.
- **Version style.** A requirement reads "`X.Y.Z` or later", for the server or for a host's
  extension or plugin. These pages have no "Since" notes and never pin `@dineug/erd-editor`. Keep
  the install commands without a server version: Updating relies on `npx` fetching the newest
  release each time the agent starts the server.
- **Tool counts.** The `description` and line 8 of `tools.md` both say 67 edit tools, and line 8
  gives 77 in all (5 session, 4 read, 67 edit, and `erd_batch`). A tool added or removed changes
  both lines and a table row.
- **Refusal codes.** The `code` table in `tools.md#results` is the list. `live-and-headless.md`
  explains when each code happens (`blocked`, `hubDisabled`, `hubGone`, `hubAppeared`,
  `conflict`, `readonly`, `invalidPath`, `invalidDocument`, `notSaved`, `hubUnreachable`,
  `protocolMismatch`). A new code needs a row in the table and a sentence in the matching mode
  section.
- **Most-linked anchors:** `tools.md#dictionaries` (6 pages), `tools.md#settings` (5),
  `tools.md#import` (4), `live-and-headless.md#edits-made-at-the-same-moment` (4) and
  `tools.md#reading-a-document` (3). `## erd_batch` keeps its underscore as `#erd_batch`.
- "The eight databases" appear in both `introduction.md` and `tools.md` (the `sql` row). They are
  the eight database files, `Databricks.ts` to `SQLite.ts`, in
  `../erd-editor/packages/erd-editor/src/utils/schema-sql/`.

### Testing Requirements

- After you change the tool list, compare it with the registry. This prints `67` at `v5.1.0`:
  `grep -rhoE "'erd_[a-z_]+'" ../erd-editor/packages/mcp-server/src/tools/registry/*.ts | sort -u | wc -l`.
- Check a tool's arguments in its `registry/` file, and the MCP protocol versions that
  `installation.md` lists (`2025-06-18`, `2025-03-26`, `2024-11-05`) in
  `mcp-server/src/server.test.ts`, which pins them.
- `installation.md` registers the server with `claude mcp add --transport stdio erd-editor -- npx -y
  @dineug/erd-editor-mcp` and `codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp`. They
  are those CLIs' syntax, not the server's, so no erd-editor release changes them.

### Common Patterns

- Tool tables have the columns `| Tool | Arguments | What it does |`. Arguments are in backticks
  with `?` for optional ones, and `path` is left out, since every tool but `erd_list_documents`
  takes it first.
- A host's setting is given in a table (`| Setting | Default | Effect |`), with the host's own
  setting path in the numbered setup step before it.
- A refusal is described with its `code` in backticks and what the agent or user does next, for
  example "Trust the project, then call again."

## Dependencies

### Internal

- `../erd-editor/packages/mcp-server/`, `agent-hub/`, and the hub sides of `vscode-extension/`,
  `obsidian-plugin/` and `intellij-plugin/`, all under `../erd-editor/packages/`.

### External

- The Model Context Protocol (`modelcontextprotocol.io`), and the Claude Code and Codex CLIs, whose
  registration commands `installation.md` gives.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
