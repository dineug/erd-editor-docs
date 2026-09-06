---
sidebar_position: 9
description: Undo 与 Redo、历史记录的内容，以及通过 Time Travel 浏览编辑历史。
---

# Undo, Redo

可以回到之前的编辑状态，也可以前进到之后的状态。  
历史记录最多保留 `2048` 条变更。

- Undo: `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac)

工具栏中同样提供这两个命令，即 `Time Travel` 旁边的 `Undo` 与 `Redo` 按钮。  
只有在存在可 Undo 或 Redo 的内容时按钮才会亮起。`readonly` 编辑器会隐藏这三个按钮，快捷键也不起作用。

Undo 与 Redo 仅在 ERD 标签页生效。在 Visualization、Schema SQL、Code Generator 和 Settings 标签页中不可用。  
快速搜索、`Table Properties`、`Diff Viewer`、`Automatic Table Placement` 或 Time Travel 打开时，快捷键同样不生效。

历史记录保存在当前会话的内存中。它不会存入文档，因此重新打开图时历史记录为空。

## 历史记录的内容

会记录以下内容：

- 表与备注：添加、删除、移动、颜色、名称与注释、备注文本与大小。
- 列：添加、删除、调整顺序，以及所有列选项。
- 关系：添加、删除与类型修改。
- 索引及其列。
- 视图位置、缩放级别，以及 `View Option` 开关。
- 导入文件。

不会记录以下内容：

- 数据库厂商与数据库名称。
- Code Generator 的语言、`Table Name Case` 与 `Column Name Case`。
- Schema SQL 的括号类型。
- 设置标签页中的全部内容。

这些内容的变更无法 Undo。

## 一次操作一条记录

单次操作触发的全部变更会合并为一条历史记录。  
一次性粘贴多个表与备注，或通过 `Alt + drag` 复制它们，都只需一步即可 Undo。

连续的拖动、画布平移、缩放或颜色修改会经过约 `200ms` 的缓冲，同样只记录为一条。  
总移动距离不足 `20px` 的拖动完全不会被记录。

## Time Travel

从工具栏中 Undo 与 Redo 旁边的 `Time Travel` 按钮打开。  
在当前会话至少记录一条变更之前，该按钮不会有任何反应。

Time Travel 会打开图的一份独立只读副本。  
拖动滑块，或在滑轨上任意位置点击，即可浏览完整的编辑历史并预览每个时间点。滑块的最左端是第一条记录变更之前的状态，打开时滑块位于当前状态。  
预览是静止的：它会绘制小地图，但无法平移、滚动或编辑，在应用之前实际文档不会发生任何变化。

按 `Apply` 恢复到所选时间点，或按 `Cancel` 或 `Esc` 保持文档不变。
