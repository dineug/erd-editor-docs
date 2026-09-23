---
sidebar_position: 2
description: Register the @dineug/erd-editor-mcp server with Claude Code, Codex, or any other MCP client, and set up VS Code for live editing.
---

# Install

The server is published to npm as `@dineug/erd-editor-mcp`.
It is one self-contained file with no runtime dependencies, and `npx` downloads it the first time the agent starts it, so there is nothing else to install.
It needs Node.js `22.12` or later.

## Claude Code

Run in your project folder:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Add `--scope project` before `--transport` to write the server to the project's `.mcp.json` instead, where everyone who clones the project picks it up.

## Codex

Add to `~/.codex/config.toml`, or to `.codex/config.toml` in a trusted project:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Any Other MCP Client

Run `npx -y @dineug/erd-editor-mcp` as a stdio server: the command is `npx`, and the arguments are `-y` and `@dineug/erd-editor-mcp`.

The server resolves a relative document path against its working directory, so start it in your project folder.
It speaks the MCP protocol versions `2025-06-18`, `2025-03-26`, and `2024-11-05`, and answers a client on a later version with `2025-06-18`.

## Set Up VS Code

The agent edits a diagram live only through the VS Code extension. Without it, or with no window on the document's folder, it edits the file on disk — see [Live and Headless](./live-and-headless.md).

1. Install the [ERD Editor extension](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `3.0.0` or later. It needs VS Code `1.101.0` or later.
2. Open the project folder and trust the workspace. The extension serves agents only in a trusted workspace.
3. Leave the `dineug.erd-editor.agentHub.enabled` setting on. It is on by default.

The extension starts in a workspace that contains `.erd`, `.erd.json`, `.vuerd`, or `.vuerd.json` files, so an agent reaches those diagrams before you open one.
In a workspace with none of them it starts when you open a diagram, and until then the agent edits on disk.

| Setting | Default | Effect |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Lets an agent's MCP server edit the documents of this window over a local pipe. Turned off, or in an untrusted workspace, agents can still read the window's diagrams from disk, but never write one behind its editor. |

## Try It

1. Open the project folder in VS Code and trust the workspace.
2. Start the agent in the same folder and ask in plain words, for example _"Add a reviews table to schema.erd.json, related to users and products"_.
3. Watch the change land on the canvas, then save with `Ctrl + S` (Windows/Linux) or `⌘ + S` (Mac), or ask the agent to save.

A diagram that is not open yet opens in the ERD Editor on the agent's first edit.
The agent creates a new document with `erd_open_document`, and a name with no extension gets `.erd.json`.

## Updating

The commands above name no version, so `npx` checks npm for a newer release of the server every time the agent starts it.

The server checks the protocol version the extension speaks before it connects.
When the two differ, the call is refused with `protocolMismatch` and a message that names the side to update: the ERD Editor extension in VS Code, or the server.
