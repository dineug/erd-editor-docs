---
sidebar_position: 3
---

# 编辑表

表编辑基本上提供与 Excel 相似的编辑体验。  
按 `Enter` 进入编辑模式。

![demo-table-edit](/img/demo-table-edit.webp)

## 添加列

使用快捷键 `Alt + Enter` 创建。  
会向所有已选中的表添加一列。

## Tab 键

按 `Tab` 可直接进入下一个单元格的编辑模式。  
在最后一个单元格按 `Tab` 会创建新的列。  
使用 `Shift + Tab` 移动到上一个单元格的编辑模式。

![demo-table-tab](/img/demo-table-tab.webp)

## 多选列

支持以下四种方式：

- `Shift + Arrow Up/Down`
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Shift + click`
- `Alt + A`：全选

![demo-column-select](/img/demo-column-select.webp)

## 调整与移动列

通过 `drag` 操作，可以移动到其他表。

![demo-column-move](/img/demo-column-move.webp)

使用 `Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 也可移动多个列。

![demo-column-multi-move](/img/demo-column-multi-move.webp)

## 删除列

删除当前选中的列。  
快捷键：`Alt + Backspace` 或 `Alt + Delete`

![demo-column-remove](/img/demo-column-remove.webp)

## 复制/粘贴列

以表格形式的剪贴板方式工作。  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

可以从编辑器粘贴到 Excel，也可以从 Excel 粘贴回编辑器。  
对于下列各项，以下任意值都会被视为 true（不区分大小写）：

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

![demo-copy-column-to-sheet](/img/demo-copy-column-to-sheet.webp)
![demo-copy-sheet-column](/img/demo-copy-sheet-column.webp)

选中多个表时同样支持该操作。

![demo-copy-column-multi](/img/demo-copy-column-multi.webp)

## 列主键

通过表的右键菜单或快捷键 `Alt + K`，将选中的列设为主键。

![demo-column-pk](/img/demo-column-pk.webp)
