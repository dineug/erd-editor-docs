---
sidebar_position: 6
description: 打开命令面板，切换标签页、执行当前标签页的命令或跳转到表。
---

# 快速搜索

快速搜索是编辑器的命令面板。  
它会列出当前标签页可用的命令，在 ERD 标签页还会列出所有表，因此可以跳转到指定的表。

通过 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 打开，也可以点击工具栏的 `Search`。  
再次按下同一快捷键即可关闭，按 `Esc` 或点击面板外部也可关闭。打开时会关闭表属性面板和主题构建器，在编辑表的单元格时则无法打开。

![demo-quick-search](/img/demo-quick-search.webp)

## 搜索与导航

输入文字即可过滤列表。匹配为模糊匹配，涵盖条目名称及其旁边显示的关键字。例如在 `Import` 子菜单中，`sdl` 可以找到 `GraphQL`，`dbdiagram` 可以找到 `DBML`，`azimutt` 可以找到 `AML`。  
使用 `↑` 和 `↓` 在列表中移动，到达两端时会循环，按 `Enter` 执行高亮的条目。带有独立快捷键的命令会在右侧显示该快捷键。

`Database`、`Import` 或 `Auto Layout` 之类的条目会打开子菜单，其条目会替换当前列表，搜索框也会被清空。过滤始终只作用于当前显示的列表，并且无法返回上一级，因此需要关闭并重新打开命令面板才能重新开始。

## 命令面板列出的内容

列表内容取决于当前所在的标签页。每个标签页的列表都以 `Tab` 开头，用于切换到 `Entity Relationship Diagram`、`Visualization`、`Schema SQL`、`Generator Code` 或 `Settings`。当前所在的标签页不会出现在其中，`Generator Code` 就是工具栏中标注为 `Code Generator` 的标签页。

在 ERD 标签页中，列表包含数据库厂商、`Import` 与 `Export`、`New Table` 与 `New Memo`、四种关系类型、`Auto Layout`，以及每个表各一个的条目，按名称排序。名称为空的表会显示为 `unnamed`，执行该条目会滚动到该表并将其选中。  
除仅存在于右键菜单中的 `Diff Viewer` 外，这些条目执行的命令与画布右键菜单相同。此处的 `Export` 只提供 `JSON` 和 `Schema SQL`，因此导出 PNG 需要使用[画布右键菜单](./file-import-export.md#exporting)。  
各格式的作用参见[导入与导出文件](./file-import-export.md)，数据库选择的影响参见[表相关功能](./table-related-functions.md#databases)。

在 Schema SQL 标签页中，列表同样包含数据库厂商，以及 `Bracket`。`Bracket` 用于设置生成的 SQL 中包裹表名、列名、约束名和索引名的引号字符，可选 `SingleQuote`、`DoubleQuote`、`Backtick`，或选择 `None` 表示不加任何引号。

在 Code Generator 标签页中，列表包含目标语言、`Table Name Case` 和 `Column Name Case`。各目标生成的内容参见[代码生成](./code-generator.md)。

在 Visualization 和 Settings 标签页中，列表只包含 `Tab`。
