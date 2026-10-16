---
sidebar_position: 1
description: 通过 @dineug/erd-editor-mcp MCP 服务器，让 Claude Code 或 Codex 等编码智能体编辑 erd-editor 的图，既可以在 VS Code、Obsidian 或 JetBrains IDE 中实时编辑，也可以直接编辑磁盘上的文件。
---

# 简介

`@dineug/erd-editor-mcp` 是一个让编码智能体编辑 erd-editor 图的 MCP 服务器。
Claude Code、Codex 以及其他任何 [Model Context Protocol](https://modelcontextprotocol.io) 客户端，都会为文档上的每种操作获得一个工具：添加表、重命名列、关联两个表、导入 DDL 转储、以 SQL 形式读回 schema。

当文档在 [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode)、[Obsidian](https://community.obsidian.md/plugins/erd-editor) 或 [JetBrains IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor) 的 ERD Editor 中打开时，智能体会像协作者一样加入编辑器。
每处变更都会在发生的同时出现在画布上，而智能体的 Undo 只会撤回它自己的编辑。
VS Code 会让智能体的变更在智能体或你保存之前一直保持未保存状态，而 Obsidian 和 JetBrains IDE 会像保存你自己的编辑一样保存它们。
没有编辑器持有该文档时，同样的工具会直接编辑文件本身。

![编码智能体向在 VS Code 中打开的图添加表和关系](/img/coding-agents.webp)

## 智能体能做什么

- 在对话中构建或修改 schema：表、列及所有列选项、关系及其基数和 ON DELETE 与 ON UPDATE 操作、索引、备注、颜色，以及在画布上的位置。参见[关系](./tools.md#关系)。
- 将表归入[表分组](../guide/guides/table-groups.md)：围绕它指定的表或在画布的某个区域上添加分组，然后重命名分组、为其着色、连同其中的表一起移动、调整其大小、把表放入或移出分组，或者删除分组，删除后其中的表会留在原处。参见[表分组](./tools.md#表分组)。
- 用从 SQL DDL、GraphQL SDL、DBML 或 AML 解析出的 schema，或者用另一个 `.erd.json` 文档替换当前文档。也可以像编辑器的 [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) 那样，把该 schema 或文档添加到图的下方，并保留图中已有的一切。无论哪种方式，DBML 的 `TableGroup` 都会成为表分组。参见[导入](./tools.md#导入)。
- 以 id 列表、完整实体、保存时写出的 `.erd.json` 文本，或八种数据库中任意一种的 DDL 的形式读回图，DDL 可使用 [Schema SQL](../guide/guides/schema-sql.md) 标签页中的 `Statements` 与 `Header` 选项。在包含数千个表的 schema 上，它每次只读取一页、几个表，或几个表分组中的表。参见[读取文档](./tools.md#reading-a-document)。
- 设置数据库、数据库名称，以及 Schema SQL 中写在各表之前和之后的[脚本](../guide/guides/schema-sql.md#before-and-after-scripts)，例如写在表之前的 `CREATE EXTENSION` 或写在表之后的 `GRANT`。`erd_read` 可以单独给出这些脚本，也可以在整个文档的 DDL 中一并给出。参见[设置](./tools.md#settings)。
- 把多次编辑作为一次编辑执行，要么全部生效，要么全部不生效，一次 Undo 即可撤回。参见 [erd_batch](./tools.md#erd_batch)。
- Undo 与 Redo 它自己的编辑，而绝不会动你的编辑。

它不做的事：

- 缩放、滚动或切换标签页。这些属于每位查看者，因此没有任何工具会这样做。不过，替换文档的导入仍会移动视图，即使 `Viewport` 已锁定也是如此，与编辑器的 `Import` 相同：视图回到画布的起点并恢复为 100%；使用 `erd_import_json` 时，则移到它所加载文档的视图，并且除非该文档锁定了 `Canvas Type`，还会切换到该文档的标签页。参见[导入](./tools.md#导入)。
- 更改 [`View Option`](../guide/guides/table-related-functions.md#table-view-options)、Code Generator 的语言与名称大小写、括号类型，或者 [Settings](../guide/guides/settings.md) 标签页中的 `Relationship DataType Sync`、`Maximum comment width` 和 `Column Order`。这些由你在编辑器中设置，智能体读取到的是文件所保存的值。
- 开启或关闭[锁定](../guide/guides/settings.md#锁定)。只有替换整个文档的 `erd_import_json` 会改变锁定或上述设置，使其变为所加载文档中的值。没有 `lockSettings` 字段的文档（例如由 `4.0.0` 之前的 VS Code 扩展，或由 `1.0.0` 之前的 Obsidian 或 JetBrains 插件保存的文件）会开启所有锁定。对任何替换了文档的导入执行 Undo，都会恢复文档之前的设置和锁定。
- 像 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) 那样把关系重新映射到其他列上。智能体的做法是删除该关系（其外键列会保留在原处），再用 `erd_link_columns` 关联它想要的列，这些都在一次 `erd_batch` 中完成，一次 Undo 即可撤回。
- 运行 Code Generator。`erd_read` 返回 DDL 或 JSON，智能体会据此自行编写代码。

## 工作原理

服务器是由 MCP 客户端启动的 stdio 进程。
每次调用时，它都会查找持有该文档的编辑器：VS Code 窗口、Obsidian 仓库窗口或 JetBrains IDE，且各自安装了 ERD Editor 扩展或插件。

- **实时模式**：某个编辑器的工作区、仓库或某个已打开的项目包含该文档，或者该编辑器已打开该文档。服务器加入该编辑器的编辑会话，编辑落在编辑器中：在 VS Code 中处于未保存状态，在 Obsidian 和 JetBrains IDE 中则像你自己的编辑一样被保存。
- **无头模式**：没有编辑器。服务器加载文件、应用编辑，然后把文件写回。
- **拒绝编辑**：有编辑器持有该文档，但其 hub 已关闭。服务器会从磁盘读取，但不写入任何内容，因为打开的编辑器下次保存时可能会覆盖该文件。hub 已开启的 JetBrains IDE 也会拒绝修改仅由其不信任的项目持有的文档，不过智能体仍然可以读取该文档。如果编辑器的 hub 已开启，但其 ERD Editor 扩展或插件所用的 hub 协议与服务器不同，则针对该文档的每次调用都会以 `protocolMismatch` 被拒绝，读取也不例外，并附带一条指出需要更新哪一方的消息，参见[更新](./installation.md#更新)。

详情参见[实时与无头模式](./live-and-headless.md)。

## 环境要求

| | |
| --- | --- |
| Node.js | `22.12` 或更高版本，用于运行服务器 |
| MCP 客户端 | Claude Code、Codex，或任何能够启动 stdio 服务器的客户端 |
| VS Code（用于实时编辑） | `1.101.0` 或更高版本，并安装 `4.0.0` 或更高版本的 ERD Editor 扩展 |
| Obsidian（用于实时编辑） | `1.5.7` 或更高版本的桌面应用，并安装 `1.0.0` 或更高版本的 ERD Editor 插件 |
| JetBrains IDE（用于实时编辑） | `2025.2` 或更高版本的基于 IntelliJ 的 IDE，并安装 `1.0.0` 或更高版本的 ERD Editor 插件 |

服务器 `1.0.0` 与上面的发布版本使用 hub 协议 2。
为智能体提供服务的更早发布版本使用协议 1：VS Code 扩展 `3.0.0` 至 `3.1.0`、Obsidian 插件 `0.1.0` 和 `0.2.0`，以及 JetBrains 插件 `0.9.0` 和 `0.10.0`。
这类发布版本与服务器 `1.0.0` 会互相拒绝，更早的服务器与上面的发布版本同样会互相拒绝，参见[更新](./installation.md#更新)。
`3.0.0` 之前的 VS Code 扩展或 `0.9.0` 之前的 JetBrains 插件没有 hub，因此服务器看不到它，会直接编辑磁盘上的文件，即使是在其中打开的图也一样。

下一步：[安装](./installation.md)。
