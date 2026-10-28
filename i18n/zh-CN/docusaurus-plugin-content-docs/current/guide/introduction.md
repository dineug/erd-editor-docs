---
sidebar_position: 1
description: erd-editor 是一款面向浏览器、Google Drive、VS Code、IntelliJ、Obsidian 以及自有页面的实体关系图编辑器，另有一个用于在任何网站上显示图的只读查看器。
---

# 简介

erd-editor 是一款实体关系图（Entity-Relationship Diagram）编辑器。
提供 Web 应用、Google Drive 应用、VS Code 扩展、IntelliJ 插件、Obsidian 插件，以及可嵌入自有页面的 `<erd-editor>` 自定义元素等多种形式，旁边还有以只读方式显示图的 `<erd-viewer>`。
不加载任何自有脚本的网站，可以改为从 erd-editor.io/embed 嵌入只读的图。
所有形式都是同一个编辑器，并使用相同的文档格式。

![在网店关系图中悬停在关系上、添加列，并在 Flow 中聚焦 orders 表](/img/demo-overview.webp)

## 获取方式

| 平台 | 安装 | 提供内容 |
| --- | --- | --- |
| Web 应用 | [erd-editor.io](https://erd-editor.io) | 可安装的 PWA、支持离线使用、实时协同编辑 |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | 将 ERD Editor 添加到 Drive 的 Open with 和 New 菜单中，并保存回同一个文件 |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | 在自定义编辑器中打开 `.erd.json` 文件 |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | 同一个编辑器，适用于基于 IntelliJ 的 IDE |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | 在仓库的标签页中打开 `.erd` 和 `.erd.json` 文件，仅限桌面端 |
| 自有页面 | `npm install @dineug/erd-editor` | 不依赖框架的 `<erd-editor>` 自定义元素，以及以只读方式显示图的 `<erd-viewer>`，参见[安装](../api/installation.md)和 [ErdViewerElement](../api/erd-viewer-element.md) |
| 任何网站 | [erd-editor.io/embed](https://erd-editor.io/embed) | 在 iframe 中根据文档的 URL 显示只读的图，无需代码，参见[嵌入](./guides/embedding.md) |
| 编码智能体 | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | 一个 MCP 服务器，让 Claude Code、Codex 或其他客户端在 VS Code、JetBrains IDE 或 Obsidian 中实时编辑图，或者直接编辑文件本身 |

若要在 IDE 中试用，创建一个扩展名为 `.erd.json` 的空文件并打开即可。
在 Obsidian 中，可以从命令面板执行 `ERD Editor: Create new diagram`，或者在文件列表中从文件夹的右键菜单选择 `New ERD`。两种方式都会创建一个空的 `.erd` 文件并将其打开。
在 Google Drive 中，选择 New → More → ERD Editor，然后使用 Google 账号登录。ERD Editor 只能访问你用它创建或打开的文件。
在 Web 应用、Google Drive、VS Code、JetBrains IDE 和 Obsidian 中，新建的空白图会在[欢迎界面](./guides/editing-start.md#欢迎界面)上打开，这是一个列出入门操作的菜单：`New Table`、`New Memo`、`Import`、`Command Palette` 和 `Shortcuts`。
新建的图中所有锁定都处于开启状态，因此滚动、缩放、切换标签页和切换名称显示都不会改动新图的空文件。参见[锁定](./guides/settings.md#锁定)。
VS Code 在 Source Control、Local History、Compare with Saved 中，在 VS Code 聊天以及 GitHub Copilot、Claude Code 等编码智能体的编辑审阅中，以及在 GitLens、GitHub Pull Requests、Git Graph 等扩展的修订视图中，都会将 ERD 文件作为 JSON 文本打开，因此变更会逐行显示差异。`Reopen Editor With...` 可以将 Git 修订版本显示为只读的图。

更新 Obsidian 插件后，请重启 Obsidian：在此之前，窗口中运行的仍是旧版本加载的编辑器。
请在所有共享图的地方都更新 ERD Editor 和 `@dineug/erd-editor-mcp`。Dictionary 标签页出现之前的版本，或编辑磁盘上文件的旧版 MCP 服务器，在保存图时会丢失其中的逻辑名、域关联和词典。表分组功能推出之前的版本打开当前版本保存的文件时还不会显示主键图标，而在这样的版本中保存该文件会丢失其中的表分组和 Schema SQL 脚本。
旧版本保存的文件会在第一次有变更写入该文件时以当前格式重写，参见[锁定](./guides/settings.md#锁定)。这次保存还会去掉旧版本写入的空文本、空列表和空集合，因此它对文件的改动会多于该编辑本身。在此之前，对于表分组功能推出之前的版本所保存的文件，按照其 `$schema` 进行校验的 JSON 编辑器会将其报告为无效。

## 主要功能

- 在没有边界的画布上绘制表、列和备注，并用 `Zero One`、`Zero N`、`One Only`、`One N` 四种关系类型将它们连接起来。参见[开始编辑](./guides/editing-start.md)。索引在表的属性面板中定义。由两列或更多列组成的唯一索引即为备用键，开启 `Alternate Key` 显示选项后，图中会将其列标记为 `AK1.1`、`AK1.2` 等。参见[索引](./guides/table-related-functions.md#indexes)和[备用键](./guides/table-related-functions.md#alternate-keys)。
- 让关系连接到表中已有的列上：用鼠标或触控笔绘制关系时，关系所指向的表旁边的 `Map to existing columns` 会将父表的键与该表的列配对，`Create new columns` 则会添加新的列。之后可以通过关系右键菜单中的 `Map Columns` 修改其列。参见[映射列](./guides/relationship-editing.md#map-columns)。关系还可以设置 ON DELETE 与 ON UPDATE 操作。参见 [ON DELETE 与 ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update)。
- 快速编辑：`Alt + N` 添加表；`Alt + Enter` 添加列；`Alt + K` 切换获得焦点的列的主键，如果该列是选中的列之一，则切换所有选中列的主键；`Delete` 或 `Backspace` 删除选中的对象。每项操作都只算一步 Undo。参见[快捷键](./guides/settings.md#快捷键)。画布底部的[画布工具栏](./guides/table-related-functions.md#canvas-toolbar)也可以一键添加表或备注。
- 通过带有预设颜色和图中已用颜色的选色器为表、备注或表分组着色，并用 `No color` 或 `Remove color` 去掉颜色。参见[表与备注的颜色设置](./guides/table-related-functions.md#表与备注的颜色设置)。
- 将相关的表归入[表分组](./guides/table-groups.md)：表分组是位于这些表后面、可以命名和着色的框。可以按 `Alt + G`，或者通过画布右键菜单、画布工具栏或快速搜索中的 `New Table Group` 绘制分组，也可以先按 `T` 再按 `G`，或在选中的表的右键菜单中选择 `Group selected tables`，由这些表创建分组。把表放到分组内即加入该分组，放到分组外即离开该分组；拖动分组的标题栏时，其中的表会随之移动。DBML 的导入与导出都会以 `TableGroup` 块的形式保留分组。
- 为表和列设置[逻辑名](./guides/logical-names.md)，即供人阅读的名称，例如 `CUST_NM` 对应的 `Customer Name`，与 Schema SQL 和 Code Generator 写出的物理名并列。名称显示（`Physical Names`、`Logical Names` 或 `Both Names`）决定画布绘制其中哪一种，[其他大多数显示表名或列名的地方](./guides/logical-names.md#beyond-the-canvas)也会跟随它，例如资源管理器的表行和列行、Flow 以及导出的图片。可以通过画布工具栏的 `Name View` 按钮、画布右键菜单、`Flow` 中的 Visualization 工具栏或快速搜索进行选择。
- 在 [Dictionary](./guides/dictionary.md) 标签页中维护图的命名标准。其 `Domains`、`Words` 和 `Terms` 工作表可以像电子表格一样搜索、排序和编辑，每个工作表都有各自的 Undo 历史记录。这些工作表可以导入和导出 CSV：导入时可以读取编辑器自身的格式或韩国公共数据标准的格式，编码为 UTF-8 或 EUC-KR，导出时写出编辑器自身的格式。逻辑名单元格会补全术语名称。逻辑名会根据匹配的术语，或根据其切分出的各个词根的缩写，为其表或列提供物理名，直到你自己填写该名称为止。词根或术语更改后，[`Derive Physical Names Again`](./guides/dictionary.md#derive-physical-names-again) 会重新生成这些名称，包括你自己填写的名称。关联到域的列（无论是手动关联还是通过其术语关联）会[采用该域的数据类型](./guides/dictionary.md#domains-and-data-types)并跟随其更改，`Domain` 显示选项会显示每一列的域。[`Checks`](./guides/dictionary.md#the-checks-sheet) 工作表会列出禁用词、未登记的词根和同义词、重复的名称、未知的域、与其术语不一致的物理名，以及与其域不一致的列类型。画布会为词根检查和术语检查所标出的逻辑名和物理名着色。
- 支持从 `json`、`Schema SQL`、`GraphQL`、`DBML` 或 `AML` 导入已有的 schema。参见[导入与导出文件](./guides/file-import-export.md)。导入 Schema SQL、GraphQL、DBML 或 AML 文件时，其中的表会沿着关系排布；没有关系时则逐行排列。[`Import and Add`](./guides/file-import-export.md#import-and-add) 会把文件添加到图的下方，而不是替换当前的图。
- 将图导出为 `json`；在 [Schema SQL](./guides/schema-sql.md#saving-or-copying-the-sql) 标签页中导出 Schema SQL，可保存为 `.sql` 文件或复制；或者通过 [`Export image`](./guides/file-import-export.md#image) 对话框导出为 PNG 或 SVG 图片，或以 PNG 复制到剪贴板。
- 在其他网站上以只读方式显示图：用文件的 URL（包括 GitHub 上的文件）嵌入 [erd-editor.io/embed](./guides/embedding.md)，或者在自己的页面中加载 [`<erd-viewer>`](../api/erd-viewer-element.md) 元素。阅读者可以平移、缩放、搜索并点亮关系，但无法编辑图。
- 按照 Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake 和 SQLite 八种数据库厂商的语法编写 Schema SQL。参见[表相关功能](./guides/table-related-functions.md#databases)。[Schema SQL](./guides/schema-sql.md) 标签页的选项面板可以选择要写出的语句、头部和表分组，可以[将逻辑名写入空注释](./guides/schema-sql.md#logical-names-as-comments)，还可以保存你自己编写的 SQL，这些 SQL 保存在图中，会写在各表之前和之后。
- 为二十二种目标生成代码：语言 C#、Go、Java、Kotlin、PHP、Rust、Scala、Swift 和 TypeScript；ORM Doctrine、Drizzle、JPA、SeaORM、Sequelize、SQLAlchemy 和 TypeORM；以及 AML、DBML、GraphQL、JSON Schema、Mermaid 和 Zod。Code Generator 标签页的选项面板可以选择语言、数据库和名称大小写，生成的代码可以保存为带有该语言扩展名的文件，也可以复制。参见[代码生成](./guides/code-generator.md)。
- 在[可视化](./guides/visualization.md)中查看 schema，既可以是力导向的 `Graph`，也可以是沿着关系排布表卡片的 `Flow`，悬停在某个表上即可点亮它所触及的一切。在 ERD 标签页中按 `Alt + F`，即可[聚焦选中的表](./guides/visualization.md#focusing-on-tables)以及与它们相关的表。在 `Flow` 中，[`Previous table` 和 `Next table`](./guides/visualization.md#previous-table-and-next-table) 会在 Flow 曾缩小到的各个范围之间后退和前进，与 Undo 和 Redo 按键在那里的作用相同。
- 在没有边界的画布上工作：图延伸到哪里就能平移到哪里，可以用 `Ctrl + Wheel`（Mac 上为 `⌘ + Wheel`）、键盘或捏合手势在 `10%` ~ `150%` 之间缩放，禅模式则只留下图本身。按住鼠标中键拖动可以从画布上的任意位置平移，即使在表的上方也可以。参见[浏览画布](./guides/table-related-functions.md#getting-around-the-canvas)。
- 用[自动布局](./guides/table-related-functions.md#auto-layout)一步排布整张图：Force 模拟、从左到右的 Flow，或任一方向的 Tree，每个表分组都会保持在一起。
- 通过[快速搜索](./guides/quick-search.md)可以在任意位置执行命令，也可以在搜索开头输入 `#`、`@` 或 `:`，分别跳转到表、列，或者注释或备注；`#` 和 `@` 也会匹配逻辑名。通过 [Undo, Redo](./guides/undo-redo.md) 可以逐步浏览编辑历史，通过 [Time Travel](./guides/undo-redo.md#time-travel) 可以在画布上重放本次会话的历史，也可以在 [Diff Viewer](./guides/table-related-functions.md#diff-viewer) 中将图与另一个 `.json` 文件进行比较。Diff Viewer 的树位于两个版本旁边，列出新增、修改、删除或重命名的表、列、索引、外键、备注和表分组。
- 在[资源管理器](./guides/explorer.md)中浏览图，这是一棵停靠在画布左侧的树：先列出各个表，每个表下有其列、索引和外键，然后是表分组和备注。点击某一行即可跳转到该行在画布上所代表的对象；外键行还会点亮其关系。工具栏中位于 `Search` 旁边的 `Explorer` 按钮用于打开和关闭资源管理器。
- 通过资源管理器顶部的[查找与替换](./guides/find-and-replace.md)查找文本。它会搜索表、列、索引和表分组的名称，表和列的逻辑名，以及开启相应选项后的注释和备注，并在资源管理器的树中显示匹配项。可以替换其中一处匹配或全部匹配；`Preserve Case` 会让每处替换沿用被替换文本的大小写形式。`Ctrl + F`（Mac 上为 `⌘ + F`）会打开资源管理器，并将光标置于查找输入框中，再按一次则会关闭资源管理器。
- 以 25 种语言使用编辑器，可从工具栏的 `Display Language` 按钮或快速搜索中选择。`System` 跟随浏览器或宿主应用的语言；阿拉伯语、希伯来语和波斯语会让编辑器从右到左排布，而图仍保持从左到右。只有编辑器自身的文本会改变：名称、SQL 和生成的代码都保持原样。工具栏的主题构建器可以选择外观（`System`、`Light` 或 `Dark`）、灰阶色和强调色。参见[语言与主题](./guides/language-and-theme.md)。
- 让 diff 保持干净：滚动位置与缩放、当前打开的标签页、Code Generator 的语言与名称大小写、括号类型以及名称显示，默认都处于[锁定](./guides/settings.md#锁定)状态，因此文件会保留它们被锁定时的值，滚动、缩放、切换标签页或切换名称显示都不会改变文件。文件按固定顺序写出，每个词典行占一行，并且不包含测量得到的宽度、叠放顺序、连接线锚点、已删除的项、项的空文本，以及图中没有任何该类内容的列表和集合，因此打开图后不做任何编辑就关闭，文件会保持原样。
- 让 Claude Code 或 Codex 等编码智能体通过 [MCP 服务器](../mcp/introduction.md)编辑图：既可以在 VS Code、Obsidian 或 JetBrains IDE 中实时编辑，每处变更都会在发生的同时出现在画布上，也可以直接编辑文件本身。它还可以设置逻辑名和列的域、[编辑词典](../mcp/tools.md#dictionaries)、重新生成物理名，以及列出 `Checks` 工作表发现的问题。
- 支持在 Web 应用中实时协同编辑（实验性）。会话基于点对点连接并进行端到端加密，因此不会有任何服务器保存 schema，参与者之间可以看到彼此的光标、焦点和选中内容。在自有页面中，[`getSharedStore()`](../api/advanced/collaborative-editing.md) 可以在任意传输方式上提供相同的操作流。

建议从[编辑指南](/docs/category/guides)开始。

## 项目缘起

已有的建模工具没有提供我期望的用户体验。  
因此，我发起了这个项目，希望带来极致的用户体验。  
本项目的首要目标就是用户的编辑体验。  
它将为你带来令人惊喜的编辑体验。
