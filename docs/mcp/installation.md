---
sidebar_position: 2
description: Register the @dineug/erd-editor-mcp server with Claude Code, Codex, or any other MCP client, and set up VS Code, Obsidian, or a JetBrains IDE for live editing.
---

# Install

The server is published to npm as `@dineug/erd-editor-mcp`.
It is one self-contained file with no runtime dependencies, and `npx` downloads it the first time the agent starts it, so there is nothing else to install.
It needs Node.js `22.12` or later.

To let the agent edit a diagram live, also set up the editor that holds it: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian), or [a JetBrains IDE](#set-up-a-jetbrains-ide).
With no editor serving the document, the agent edits the file on disk — see [Live and Headless](./live-and-headless.md).

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

A VS Code window serves the diagrams in its workspace folders and any diagram open in it.

1. Install the [ERD Editor extension](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `3.0.0` or later. It needs VS Code `1.101.0` or later.
2. Open the project folder and trust the workspace. The extension serves agents only in a trusted workspace.
3. Leave the `dineug.erd-editor.agentHub.enabled` setting on. It is on by default.

`3.0.1` or later is recommended.
In a folder opened through a symbolic link, a junction, or a mapped drive, `3.0.0` can open a second tab of a diagram for the agent, whose save can undo the agent's edits.
On Windows, `3.0.0` can leave the agent editing the file on disk behind an open editor: in a window run as administrator, and now and then in a diagram you just opened.

The extension starts in a workspace that contains `.erd`, `.erd.json`, `.vuerd`, or `.vuerd.json` files, so an agent reaches those diagrams before you open one.
In a workspace with none of them it starts when you open a diagram, and until then the agent edits on disk.

| Setting | Default | Effect |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Lets an agent's MCP server edit the documents of this window over a local socket, or a named pipe on Windows. Turned off, or in an untrusted workspace, agents can still read the window's diagrams from disk, but never write one behind its editor. |

## Set Up Obsidian

An Obsidian vault window serves the diagrams in its vault.

1. Install the [ERD Editor plugin](https://community.obsidian.md/plugins/erd-editor) `0.1.0` or later from Community plugins, and turn it on. It runs in the desktop app only.
2. Leave Settings → ERD Editor → Coding agents on. It is on by default, and each vault keeps its own setting.

A vault window serves agents from the moment the plugin loads, so an agent reaches the vault's diagrams before you open one.
There is no trust step.
A file the vault does not list, such as one in a folder whose name starts with a dot, cannot be opened in the ERD Editor, so an edit to it is refused.

Ask the agent to name new diagrams with `.erd`.
A name with no extension gets `.erd.json`, and Obsidian's file explorer lists a `.erd.json` file only while Settings → Files and links → Detect all file extensions is on.

| Setting | Default | Effect |
| --- | --- | --- |
| Coding agents | On | Lets an agent's MCP server edit the diagrams of this vault over a local socket, or a named pipe on Windows. Turned off, agents can still read the vault's diagrams from disk, but never write one behind its editor. |

Obsidian installed from Flathub runs in a Flatpak sandbox, which the server cannot reach.
There the plugin serves no agents and keeps no lock file, so the agent edits the files on disk, even a diagram you have open.
Obsidian reloads the diagram, as it does after any change made outside it, and an edit of yours it has not saved yet gives way to the agent's.
The plugin says so each time the vault opens, until you turn off Coding agents.

## Set Up a JetBrains IDE

A JetBrains IDE serves the diagrams of every project open in it, and any diagram open in its ERD Editor.

1. Install the [ERD Editor plugin](https://plugins.jetbrains.com/plugin/23594-erd-editor) `0.9.0` or later. It needs an IntelliJ-based IDE `2025.2` or later, running on the JetBrains Runtime.
2. Open the project and trust it. In a project the IDE does not trust, such as one opened in safe mode, agents read the diagrams but never change them.
3. Leave Settings | Tools | ERD Editor → Coding agents ticked. It is on by default and applies to the whole IDE.

The IDE serves agents from the moment the first project opens, so an agent reaches a project's diagrams before you open one.

| Setting | Default | Effect |
| --- | --- | --- |
| Coding agents | On | Lets an agent's MCP server edit the diagrams of this IDE over a local socket, or a named pipe on Windows. Turned off, agents can still read the diagrams of the open projects from disk, but never change one behind its editor. |

The settings page says when coding agents are unavailable: in an IDE without JCEF (where the ERD Editor cannot run either), in an IDE installed as a Flatpak on Linux, and when its hub could not start.
There the IDE keeps no lock file, and the agent edits the files on disk.
The ERD Editor does not reload a diagram changed on disk while it is open, and your next edit in it writes the whole diagram back over the agent's changes, so close the diagram first.

## Try It

1. Open the folder that holds your diagrams: in VS Code, as a workspace you trust; in Obsidian, as a vault; in a JetBrains IDE, as a project you trust.
2. Start the agent in the same folder and ask in plain words, for example _"Add a reviews table to schema.erd.json, related to users and products"_.
3. Watch the change land on the canvas. In VS Code, save with `Ctrl + S` (Windows/Linux) or `⌘ + S` (Mac), or ask the agent to save. Obsidian and a JetBrains IDE save the change as they save your own edits, and asking the agent to save writes it at once.

A diagram that is not open yet opens in the ERD Editor on the agent's first edit, without taking the keyboard focus.
The agent creates a new document with `erd_open_document`, and a name with no extension gets `.erd.json`.

## Updating

The commands above name no version, so `npx` checks npm for a newer release of the server every time the agent starts it.

The server checks the protocol version the editor speaks before it connects.
When the two differ, the call is refused with `protocolMismatch` and a message that names the side to update: the server, or the ERD Editor in the editor, which is the extension in VS Code and the plugin in Obsidian and a JetBrains IDE.
