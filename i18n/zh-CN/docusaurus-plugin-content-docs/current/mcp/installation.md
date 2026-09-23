---
sidebar_position: 2
description: 在 Claude Code、Codex 或其他任何 MCP 客户端中注册 @dineug/erd-editor-mcp 服务器，并为实时编辑配置 VS Code。
---

# 安装

该服务器以 `@dineug/erd-editor-mcp` 的名称发布在 npm 上。
它是一个没有运行时依赖的自包含文件，`npx` 会在智能体首次启动它时下载，因此无需另外安装任何东西。
它需要 Node.js `22.12` 或更高版本。

## Claude Code

在项目文件夹中运行：

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

在 `--transport` 之前加上 `--scope project`，即可改为把服务器写入项目的 `.mcp.json`，所有克隆该项目的人都会用上它。

## Codex

添加到 `~/.codex/config.toml`，或者受信任项目中的 `.codex/config.toml`：

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## 其他 MCP 客户端

以 stdio 服务器的形式运行 `npx -y @dineug/erd-editor-mcp`：命令为 `npx`，参数为 `-y` 和 `@dineug/erd-editor-mcp`。

服务器以自身的工作目录为基准解析相对的文档路径，因此请在项目文件夹中启动它。
它支持 MCP 协议版本 `2025-06-18`、`2025-03-26` 和 `2024-11-05`，对使用更新版本的客户端则以 `2025-06-18` 应答。

## 配置 VS Code

智能体只能通过 VS Code 扩展实时编辑图。没有该扩展，或者没有窗口打开文档所在的文件夹时，它会编辑磁盘上的文件，参见[实时与无头模式](./live-and-headless.md)。

1. 安装 `3.0.0` 或更高版本的 [ERD Editor 扩展](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode)。它需要 VS Code `1.101.0` 或更高版本。
2. 打开项目文件夹并信任该工作区。扩展只在受信任的工作区中为智能体提供服务。
3. 保持 `dineug.erd-editor.agentHub.enabled` 设置开启。该设置默认开启。

扩展会在包含 `.erd`、`.erd.json`、`.vuerd` 或 `.vuerd.json` 文件的工作区中启动，因此在你打开任何一个图之前，智能体就能访问这些图。
在不包含这些文件的工作区中，扩展会在你打开图时启动，在此之前智能体会编辑磁盘上的文件。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | 允许智能体的 MCP 服务器通过本地管道编辑该窗口的文档。关闭该设置，或者在不受信任的工作区中，智能体仍然可以从磁盘读取该窗口的图，但绝不会绕过其编辑器写入任何一个图。 |

## 试用

1. 在 VS Code 中打开项目文件夹并信任该工作区。
2. 在同一文件夹中启动智能体，用平常的话提出要求，例如 _“在 schema.erd.json 中添加一个 reviews 表，并与 users 和 products 建立关系”_。
3. 看着变更落到画布上，然后用 `Ctrl + S` (Windows/Linux) 或 `⌘ + S` (Mac) 保存，或者让智能体保存。

尚未打开的图会在智能体首次编辑时于 ERD Editor 中打开。
智能体用 `erd_open_document` 创建新文档，没有扩展名的名称会加上 `.erd.json`。

## 更新

上面的命令都没有指定版本，因此智能体每次启动服务器时，`npx` 都会到 npm 检查是否有更新的发布版本。

服务器在连接之前会检查扩展所用的协议版本。
两者不一致时，调用会以 `protocolMismatch` 被拒绝，并附带一条指出需要更新哪一方的消息：VS Code 中的 ERD Editor 扩展，或者服务器。
