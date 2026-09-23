---
sidebar_position: 1
description: 通过 @dineug/erd-editor-mcp MCP 服务器，让 Claude Code 或 Codex 等编码智能体编辑 erd-editor 的图，既可以在 VS Code 中实时编辑，也可以直接编辑磁盘上的文件。
---

# 简介

`@dineug/erd-editor-mcp` 是一个让编码智能体编辑 erd-editor 图的 MCP 服务器。
Claude Code、Codex 以及其他任何 [Model Context Protocol](https://modelcontextprotocol.io) 客户端，都会为文档上的每种操作获得一个工具：添加表、重命名列、关联两个表、导入 DDL 转储、以 SQL 形式读回 schema。

当文档在 [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode)中打开时，智能体会像协作者一样加入编辑器。
每处变更都会在发生的同时出现在画布上，并在智能体或你保存之前一直保持未保存状态，而智能体的 Undo 只会撤回它自己的编辑。
没有 VS Code 窗口打开该文档时，同样的工具会直接编辑文件本身。

![编码智能体向在 VS Code 中打开的图添加表和关系](/img/coding-agents.webp)

## 智能体能做什么

- 在对话中构建或修改 schema：表、列及所有列选项、关系、索引、备注、颜色，以及在画布上的位置。
- 用从 SQL DDL、GraphQL SDL、DBML 或 AML 解析出的 schema，或者用另一个 `.erd.json` 文档替换当前文档。
- 以 id 列表、完整实体、八种数据库中任意一种的 DDL，或原始 JSON 的形式读回图。在包含数千个表的 schema 上，它每次只读取一页或几个表。参见[读取文档](./tools.md#reading-a-document)。
- 修改文档中存储的设置：数据库、Code Generator 的语言与名称大小写、括号类型，以及显示表的哪些部分。
- 把多次编辑作为一次编辑执行，要么全部生效，要么全部不生效，一次 Undo 即可撤回。参见 [erd_batch](./tools.md#erd_batch)。
- Undo 与 Redo 它自己的编辑，而绝不会动你的编辑。

它不做的事：

- 缩放、滚动或切换标签页。这些属于每位查看者，而不属于文档，因此没有任何工具会改变它们。
- 运行 Code Generator。`erd_read` 返回 DDL 或 JSON，智能体会据此自行编写代码。
- 在 IntelliJ 中实时编辑。IntelliJ 插件不保留可供服务器查找的锁文件，因此在那里打开的文档会被视为已关闭，智能体会编辑磁盘上的文件。该插件只在打开文件时读取它，而你在那里的下一次编辑会把整张图写回文件，覆盖智能体的变更，因此在智能体编辑某张图期间，请在 IntelliJ 中关闭该图。

## 工作原理

服务器是由 MCP 客户端启动的 stdio 进程。
每次调用时，它都会查找持有该文档的 VS Code 窗口：

- **实时模式**：某个窗口的工作区包含该文档，或者该窗口已打开该文档。服务器加入该窗口的编辑会话，编辑落在编辑器中，处于未保存状态。
- **无头模式**：没有窗口。服务器加载文件、应用编辑，然后把文件写回。
- **拒绝编辑**：有窗口持有该文档，但其 hub 已关闭。服务器会从磁盘读取，但不写入任何内容，因为打开的编辑器下次保存时会覆盖该文件。

详情参见[实时与无头模式](./live-and-headless.md)。

## 环境要求

| | |
| --- | --- |
| Node.js | `22.12` 或更高版本，用于运行服务器 |
| MCP 客户端 | Claude Code、Codex，或任何能够启动 stdio 服务器的客户端 |
| VS Code（用于实时编辑） | `1.101.0` 或更高版本，并安装 `3.0.0` 或更高版本的 ERD Editor 扩展 |

下一步：[安装](./installation.md)。
