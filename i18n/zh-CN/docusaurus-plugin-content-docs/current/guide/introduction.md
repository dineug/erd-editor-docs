---
sidebar_position: 1
description: 面向浏览器、Google Drive、VS Code、IntelliJ、Obsidian 以及自有页面的实体关系图编辑器。
---

# 简介

erd-editor 是一款实体关系图（Entity-Relationship Diagram）编辑器。
提供 Web 应用、Google Drive 应用、VS Code 扩展、IntelliJ 插件、Obsidian 插件，以及可嵌入自有页面的 `<erd-editor>` 自定义元素等多种形式。
所有形式都是同一个编辑器，并使用相同的文档格式。

![在网店关系图中悬停连接线、添加列，并在 Flow 中聚焦 orders 表](/img/demo-overview.webp)

## 获取方式

| 平台 | 安装 | 提供内容 |
| --- | --- | --- |
| Web 应用 | [erd-editor.io](https://erd-editor.io) | 可安装的 PWA、支持离线使用、实时协同编辑 |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | 将 ERD Editor 添加到 Drive 的 Open with 和 New 菜单中，并保存回同一个文件 |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | 在自定义编辑器中打开 `.erd.json` 文件 |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | 同一个编辑器，适用于基于 IntelliJ 的 IDE |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | 在仓库的标签页中打开 `.erd` 和 `.erd.json` 文件，仅限桌面端 |
| 自有页面 | `npm install @dineug/erd-editor` | 不依赖框架的 `<erd-editor>` 自定义元素，参见[安装](../api/installation.md) |

若要在 IDE 中试用，创建一个扩展名为 `.erd.json` 的空文件并打开即可。
在 Obsidian 中，可以从命令面板执行 `ERD Editor: Create new diagram`，或者在文件列表中从文件夹的右键菜单选择 `New ERD`。两种方式都会创建一个空的 `.erd` 文件并将其打开。
新建的图既不保存滚动位置，也不保存缩放级别，因此滚动和缩放都不会改动新图的空文件。参见[保存滚动信息](./guides/settings.md#保存滚动信息)。
在 Google Drive 中，选择 New → More → ERD Editor，然后使用 Google 账号登录。ERD Editor 只能访问你用它创建或打开的文件。
更新 Obsidian 插件后，请重启 Obsidian：在此之前，窗口中运行的仍是旧版本加载的编辑器。

## 主要功能

- 在没有边界的画布上绘制表、列和备注，并用 `Zero One`、`Zero N`、`One Only`、`One N` 四种关系类型将它们连接起来。参见[开始编辑](./guides/editing-start.md)。关系还可以设置 ON DELETE 与 ON UPDATE 操作。参见 [ON DELETE 与 ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update)。索引在表的属性面板中定义。由两列或更多列组成的唯一索引即为备用键，开启 `Alternate Key` 显示选项后，图中会将其列标记为 `AK1.1`、`AK1.2` 等。参见[索引](./guides/table-related-functions.md#indexes)和[备用键](./guides/table-related-functions.md#alternate-keys)。
- 支持从 `json`、`Schema SQL`、`GraphQL`、`DBML` 或 `AML` 导入已有的 schema。参见[导入与导出文件](./guides/file-import-export.md)。
- 将图导出为 `json`、`Schema SQL` 或 `png`。
- 按照 Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake 和 SQLite 八种数据库厂商的语法编写 Schema SQL。参见[表相关功能](./guides/table-related-functions.md#databases)。
- 为 C#、Go、Java、Kotlin、Scala、TypeScript、Drizzle、JPA、Sequelize、SQLAlchemy、TypeORM、AML、DBML 和 GraphQL 十四种目标生成代码。参见[代码生成](./guides/code-generator.md)。
- 在[可视化](./guides/visualization.md)中查看 schema，既可以是力导向的 `Graph`，也可以是沿着关系排布表卡片的 `Flow`，悬停在某个表上即可点亮它所触及的一切。在 ERD 标签页中按 `Alt + F`，即可[聚焦选中的表](./guides/visualization.md#focusing-on-tables)以及与它们相关的表。
- 在没有边界的画布上工作：图延伸到哪里就能平移到哪里，可以用 `Ctrl + Wheel`（Mac 上为 `⌘ + Wheel`）、键盘或捏合手势在 `10%` ~ `150%` 之间缩放，禅模式则只留下图本身。参见[浏览画布](./guides/table-related-functions.md#getting-around-the-canvas)。
- 用[自动布局](./guides/table-related-functions.md#auto-layout)一步排布整张图：Force 模拟、从左到右的 Flow，或两个方向的 Tree。
- 通过[快速搜索](./guides/quick-search.md)可以在任意位置执行命令，也可以在搜索开头输入 `#`、`@` 或 `:`，分别跳转到表、列，或者注释或备注。通过 [Undo, Redo](./guides/undo-redo.md) 可以逐步浏览编辑历史。
- 通过[查找与替换](./guides/find-and-replace.md)在表名、列名、注释和备注中查找文本，并替换其中一处匹配或全部匹配。可通过 `Ctrl + F`（Mac 上为 `⌘ + F`）或 `Search` 旁边的工具栏按钮打开。
- 让 Claude Code 或 Codex 等编码智能体通过 [MCP 服务器](../mcp/introduction.md)编辑图：既可以在 VS Code、Obsidian 或 JetBrains IDE 中实时编辑，每处变更都会在发生的同时出现在画布上，也可以直接编辑文件本身。
- 支持在 Web 应用中实时协同编辑（实验性）。会话基于点对点连接并进行端到端加密，因此不会有任何服务器保存 schema，参与者之间可以看到彼此的光标、焦点和选中内容。在自有页面中，[`getSharedStore()`](../api/advanced/collaborative-editing.md) 可以在任意传输方式上提供相同的操作流。

建议从[编辑指南](/docs/category/guides)开始。

## 项目缘起

已有的建模工具没有提供我期望的用户体验。  
因此，我发起了这个项目，希望带来极致的用户体验。  
本项目的首要目标就是用户的编辑体验。  
它将为你带来令人惊喜的编辑体验。
