---
sidebar_position: 3
description: 添加、多选、调整顺序与删除列，切换列选项，以及复制粘贴列。
---

# 编辑表

表编辑基本上提供与 Excel 相似的编辑体验。  
按 `Enter` 或双击单元格进入编辑模式。

![demo-table-edit](/img/demo-table-edit.webp)

## 添加列

使用快捷键 `Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 创建。  
会向所有已选中的表添加一列。

## Tab 键

按 `Tab` 可直接进入下一个单元格的编辑模式。  
在最后一个单元格按 `Tab` 会创建新的列。  
使用 `Shift + Tab` 移动到上一个单元格的编辑模式。

![demo-table-tab](/img/demo-table-tab.webp)

## DataType 自动补全

进入 `DataType` 单元格的编辑模式并开始输入，编辑器会推荐所选数据库中匹配的类型，并高亮推荐项中与输入内容完全一致的部分。  
匹配本身是模糊匹配，因此输入 `vch` 也能找到 `VARCHAR`。

- `Arrow Up` 或 `Arrow Down`：在推荐项之间移动
- `Arrow Right`、`Tab` 或 `Enter`：采用当前高亮的推荐项
- `Arrow Left`：回到已输入的文本

也可以直接点击推荐项。  
推荐并非强制，列表之外的类型也可以自由输入，包括 `VARCHAR(255)` 这样带参数的写法。  
推荐项跟随所选数据库，更换数据库会改变推荐内容，已有的列保持不变。

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

这三个单元格是开关，而不是文本。  
双击该单元格，或在其获得焦点时按 `Enter`，即可切换状态。

Not Null 单元格在设置后显示 `N-N`，未设置时显示 `NULL`。  
`UQ` 和 `AI` 在关闭时为暗色，在开启时高亮。

被[表显示选项](./table-related-functions.md)隐藏的单元格无法切换。

## 多选列

支持以下五种方式：

- `Shift + Arrow Up/Down`：每次扩展一行选中范围
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)：添加单个列
- `Shift + click`：选中从上一个获得焦点的列开始的范围
- `Ctrl + Shift + click` (Windows/Linux) or `⌘ + Shift + click` (Mac)：将该范围添加到选中范围
- `Alt + A` (Windows/Linux) or `⌥ + A` (Mac)：全选

![demo-column-select](/img/demo-column-select.webp)

## 调整与移动列

通过 `drag` 操作，可以移动到其他表。

![demo-column-move](/img/demo-column-move.webp)

使用 `Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 也可移动多个列。

![demo-column-multi-move](/img/demo-column-multi-move.webp)

## 删除列

删除当前选中的列。  
快捷键：`Alt + Backspace` 或 `Alt + Delete` (Windows/Linux)，`⌥ + ⌫` 或 `⌥ + Delete` (Mac)

![demo-column-remove](/img/demo-column-remove.webp)

## 复制/粘贴列

以表格形式的剪贴板方式工作。  
快捷键：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

可以从编辑器粘贴到 Excel，也可以从 Excel 粘贴回编辑器。  
对于下列各项，以下任意值都会被视为 true（不区分大小写）：

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

从编辑器复制出去时，AutoIncrement 与 Unique 写为 `TRUE` 或 `FALSE`，Not Null 写为 `NOT NULL` 或 `NULL`。

![demo-copy-column-to-sheet](/img/demo-copy-column-to-sheet.webp)
![demo-copy-sheet-column](/img/demo-copy-sheet-column.webp)

选中多个表时同样支持该操作。

![demo-copy-column-multi](/img/demo-copy-column-multi.webp)

## 复制/粘贴表与备注

当获得焦点的表内没有选中任何列时，相同的快捷键会复制选中的表与备注本身，参见[表相关功能](./table-related-functions.md)。

## 列主键

切换获得焦点的列的主键状态，该列是获得焦点的单元格所属的列，而不是整个选中的列范围。  
通过表的右键菜单或快捷键 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac) 进行操作。  
行中的钥匙图标仅用于显示，点击它不会设置主键。

![demo-column-pk](/img/demo-column-pk.webp)
