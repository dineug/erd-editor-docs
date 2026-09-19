---
sidebar_position: 1
description: 面向浏览器、VS Code、IntelliJ 以及自有页面的实体关系图编辑器。
---

# 简介

erd-editor 是一款实体关系图（Entity-Relationship Diagram）编辑器。
提供 Web 应用、VS Code 扩展、IntelliJ 插件，以及可嵌入自有页面的 `<erd-editor>` 自定义元素等多种形式。
所有形式都是同一个编辑器，并使用相同的文档格式。

![在网店关系图中悬停连接线、添加列，并在 Flow 中聚焦 orders 表](/img/demo-overview.webp)

## 获取方式

| 平台 | 安装 | 提供内容 |
| --- | --- | --- |
| Web 应用 | [erd-editor.io](https://erd-editor.io) | 可安装的 PWA、支持离线使用、实时协同编辑 |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | 在自定义编辑器中打开 `.erd.json` 文件 |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | 同一个编辑器，适用于基于 IntelliJ 的 IDE |
| 自有页面 | `npm install @dineug/erd-editor` | 不依赖框架的 `<erd-editor>` 自定义元素，参见[安装](../api/installation.md) |

若要在 IDE 中试用，创建一个扩展名为 `.erd.json` 的空文件并打开即可。

## 主要功能

- 在没有边界的画布上绘制表、列和备注，并用 `Zero One`、`Zero N`、`One Only`、`One N` 四种关系类型将它们连接起来。参见[开始编辑](./guides/editing-start.md)。索引在表的属性面板中定义。参见 [Indexes](./guides/table-related-functions.md#indexes)。
- 支持从 `JSON`、`Schema SQL`、`GraphQL`、`DBML` 或 `AML` 导入已有的 schema。参见[导入与导出文件](./guides/file-import-export.md)。
- 将图导出为 `JSON`、`Schema SQL` 或 `PNG`。
- 按照 Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake 和 SQLite 八种数据库厂商的语法编写 Schema SQL。参见[表相关功能](./guides/table-related-functions.md#databases)。
- 为 C#、Go、Java、Kotlin、Scala、TypeScript、Drizzle、JPA、Sequelize、SQLAlchemy、TypeORM、AML、DBML 和 GraphQL 十四种目标生成代码。参见[代码生成](./guides/code-generator.md)。
- 在[可视化](./guides/visualization.md)中查看 schema，既可以是力导向的 `Graph`，也可以是沿着关系排布表卡片的 `Flow`，悬停在某个表上即可点亮它所触及的一切。在 ERD 标签页中按 `Alt + F`，即可[聚焦选中的表](./guides/visualization.md#focusing-on-tables)以及与它们相关的表。
- 在没有边界的画布上工作：图延伸到哪里就能平移到哪里，可以用 `Ctrl + Wheel`（Mac 上为 `⌘ + Wheel`）、键盘或捏合手势在 `10%` ~ `150%` 之间缩放，禅模式则只留下图本身。参见[浏览画布](./guides/table-related-functions.md#getting-around-the-canvas)。
- 用[自动布局](./guides/table-related-functions.md#auto-layout)一步排布整张图：Force 模拟、从左到右的 Flow，或两个方向的 Tree。
- 通过[快速搜索](./guides/quick-search.md)可以在任意位置查找表或执行命令，通过 [Undo, Redo](./guides/undo-redo.md) 可以逐步浏览编辑历史。
- 支持实时协同编辑（实验性）。会话基于点对点连接并进行端到端加密，因此不会有任何服务器保存 schema，参与者之间可以看到彼此的光标、焦点和选中内容。在自有页面中，[`getSharedStore()`](../api/advanced/collaborative-editing.md) 可以在任意传输方式上提供相同的操作流。

建议从[编辑指南](/docs/category/guides)开始。

## 项目缘起

已有的建模工具没有提供我期望的用户体验。  
因此，我发起了这个项目，希望带来极致的用户体验。  
本项目的首要目标就是用户的编辑体验。  
它将为你带来令人惊喜的编辑体验。
