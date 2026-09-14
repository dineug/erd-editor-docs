---
sidebar_position: 3
description: 添加、多选、调整顺序与删除列，切换列选项，以及复制粘贴列。
---

# 编辑表

表编辑基本上提供与 Excel 相似的编辑体验。  
按 `Enter` 或双击单元格进入编辑模式。

![使用 Alt + N 添加表并填写两列](/img/demo-table-edit.webp)

## 添加列

使用快捷键 `Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 创建。  
会向所有已选中的表添加一列。

## Tab 键

按 `Tab` 可直接进入下一个单元格的编辑模式。  
在最后一个单元格按 `Tab` 会创建新的列。  
使用 `Shift + Tab` 移动到上一个单元格的编辑模式。

![用 Tab 在单元格间移动，在最后一个单元格添加列，再用 Shift + Tab 返回](/img/demo-table-tab.webp)

## DataType 自动补全

进入 `DataType` 单元格的编辑模式并开始输入，编辑器会推荐所选数据库中匹配的类型，并高亮推荐项中与输入内容完全一致的部分。  
匹配本身是模糊匹配，因此输入 `vch` 也能找到 `VARCHAR`。

- `Arrow Up` 或 `Arrow Down`：在推荐项之间移动
- `Arrow Right`、`Tab` 或 `Enter`：采用当前高亮的推荐项
- `Arrow Left`：回到已输入的文本

也可以直接点击推荐项。  
推荐并非强制，列表之外的类型也可以自由输入，包括 `VARCHAR(255)` 这样带参数的写法。  
推荐项跟随所选数据库，更换数据库会改变推荐内容，已有的列保持不变。

![使用方向键、Tab 和 Enter 从模糊匹配的推荐项中填写 DataType](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

这三个单元格是开关，而不是文本。  
双击该单元格，或在其获得焦点时按 `Enter`，即可切换状态。

Not Null 单元格在设置后显示 `N-N`，未设置时显示 `NULL`。  
`UQ` 和 `AI` 在关闭时为暗色，在开启时高亮。

![双击切换 Not Null，按 Enter 切换 Unique 与 Auto Increment](/img/demo-column-options.webp)

被[表显示选项](./table-related-functions.md)隐藏的单元格无法切换。

## 多选列

支持以下五种方式：

- `Shift + Arrow Up/Down`：每次扩展一行选中范围
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)：添加单个列
- `Shift + click`：选中从上一个获得焦点的列开始的范围
- `Ctrl + Shift + click` (Windows/Linux) or `⌘ + Shift + click` (Mac)：将该范围添加到选中范围
- `Alt + A` (Windows/Linux) or `⌥ + A` (Mac)：全选

![使用 Shift + Arrow Down、Ctrl/⌘ + click、Shift + click 和 Alt + A 选择列](/img/demo-column-select.webp)

## 调整与移动列

通过 `drag` 操作，可以移动到其他表。

![拖动列调整顺序，再将其移动到另一个表](/img/demo-column-move.webp)

使用 `Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 也可移动多个列。

![选中三列，使用 Ctrl/⌘ + drag 移动到另一个表](/img/demo-column-multi-move.webp)

## 删除列

删除当前选中的列。  
快捷键：`Alt + Backspace` 或 `Alt + Delete` (Windows/Linux)，`⌥ + ⌫` 或 `⌥ + Delete` (Mac)

![使用 Alt + Backspace 删除一列，再删除选中的两列](/img/demo-column-remove.webp)

## 复制/粘贴列

以表格形式的剪贴板方式工作。  
快捷键：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

复制与粘贴使用表中显示的单元格，并按它们显示的顺序排列，参见[表显示选项](./table-related-functions.md#table-view-options)和[调整列顺序](./settings.md#adjusting-column-order)。

可以从编辑器粘贴到 Excel，也可以从 Excel 粘贴回编辑器。  
电子表格的列按位置而不是按名称对应到这些单元格，因此电子表格中列的顺序必须与显示的单元格顺序一致。  
对于下列各项，以下任意值都会被视为 true（不区分大小写）：

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

从编辑器复制出去时，AutoIncrement 与 Unique 写为 `TRUE` 或 `FALSE`，Not Null 写为 `NOT NULL` 或 `NULL`。  
Unique 与 Auto Increment 默认隐藏，因此只有显示这两个单元格后才会出现 `TRUE` 与 `FALSE`。

![将四列粘贴到电子表格，标志写为 TRUE/FALSE 与 NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![将电子表格中的三行作为列粘贴到表中，YES、1 和 NOT NULL 视为 true](/img/demo-copy-sheet-column.webp)

粘贴到哪里取决于焦点所在：

- 选中表的标题栏时，粘贴的行会作为新列追加到所有选中的表中。
- 焦点位于列单元格时，该表中选中的行以及最后一个选中行下方的行，会按粘贴的行数依次被覆盖，分开选中的行之间的行会被跳过。被覆盖的行在显示的单元格中写入粘贴的值，隐藏的单元格保持不变，剩余的行则作为新列追加。其他选中的表会把粘贴的行作为新列追加。

![复制两列并一次性粘贴到选中的两个表](/img/demo-copy-column-multi.webp)

## 复制/粘贴表与备注

当获得焦点的表内没有选中任何列时，相同的快捷键会复制选中的表与备注本身，参见[表相关功能](./table-related-functions.md)。

## 列主键

切换获得焦点的列的主键状态，该列是获得焦点的单元格所属的列，而不是整个选中的列范围。  
通过表的右键菜单或快捷键 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac) 进行操作。  
行中的钥匙图标仅用于显示，点击它不会设置主键。

![使用 Alt + K 为两列开启主键，再关闭其中一列](/img/demo-column-pk.webp)
