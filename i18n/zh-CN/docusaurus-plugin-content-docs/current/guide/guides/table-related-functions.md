---
sidebar_position: 4
description: 多选与移动表、缩放、颜色与显示选项、选择数据库、比较文档。
---

# 表相关功能

## 多选

支持以下三种方式：

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + Alt + A` (Windows/Linux) or `⌘ + Alt + A` (Mac)

![demo-table-select](/img/demo-table-select.webp)

## 移动多个表

按住 mod 键拖动：`Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac)  
不按该键直接拖动会取消选中状态，只移动被拖动的表。

![demo-table-multiple-move](/img/demo-table-multiple-move.webp)

## 删除表与备注

删除当前选中的表或备注。  
Shortcuts: `Ctrl + Backspace` (Windows/Linux) or `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` (Mac) or `⌘ + Delete` (Mac)

![demo-table-remove](/img/demo-table-remove.webp)

## 缩放

按住 mod 键并滚动鼠标滚轮进行缩放：`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac)。仅滚动滚轮则是滚动画布。  
快捷键：`Ctrl + Plus` (Windows/Linux) 或 `⌘ + Plus` (Mac)，`Ctrl + Minus` (Windows/Linux) 或 `⌘ + Minus` (Mac)

![demo-zoom](/img/demo-zoom.webp)

## 表与备注的颜色设置

可以指定颜色，以便按类别区分。

![demo-table-color](/img/demo-table-color.webp)

## 表显示选项

提供以下显示选项：

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Auto Increment
- Relationship

![demo-view-options](/img/demo-view-options.webp)

## 表属性

打开选中表的属性面板。
通过表的右键菜单或快捷键 `Alt + Space` 打开。
包含 Indexes、Schema SQL、Code Generator 三个标签页。
索引在此定义，并会包含在导出的 Schema SQL 中。

## 自动排列表

基于 Force Simulation 运行。  
也可以导入外部 Schema SQL，将其作为表排列的起点。

![demo-automatic-table-placement](/img/demo-automatic-table-placement.webp)

## 数据库

支持的数据库如下：

- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- SQLite

该选项决定导出 Schema SQL 的语法以及 DataType 的自动补全。

<img src="/img/database-menu.png" width="400" alt="数据库选择菜单" loading="lazy" />

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Diff Viewer

可以将以前保存的文档与当前文档进行比较。

<img src="/img/context-menu-diff-viewer.png" width="400" alt="Diff Viewer 右键菜单" loading="lazy" />

![diff-viewer](/img/diff-viewer.png)
