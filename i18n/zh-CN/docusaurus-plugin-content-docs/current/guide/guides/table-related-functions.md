---
sidebar_position: 4
description: 选中、移动、复制表与备注并创建其副本，设置颜色与显示选项、定义索引、选择数据库、浏览画布以及比较文档。
---

# 表相关功能

表与备注创建之后的所有操作，包括选中、移动、复制、着色，以及设置每个表显示哪些内容，还包括围绕它们的画布控制。  
先是表与备注的相关命令，然后是表属性、索引、自动排列和数据库厂商，最后是画布本身：缩放、平移和 Diff Viewer。

## 多选

支持以下三种方式：

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + Alt + A` (Windows/Linux) or `⌘ + ⌥ + A` (Mac)

备注的选中方式相同，该快捷键会一次性选中所有表与备注。  
选择框覆盖到对象的中心时才会将其选中，仅接触边缘不会选中。

![demo-table-select](/img/demo-table-select.webp)

在协同编辑的会话中，每位参与者的选中状态、获得焦点的单元格和选择框都会以该参与者的颜色绘制在画布上。参见[协同编辑](../../api/advanced/collaborative-editing.md)。

## 移动多个表

使用 `Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 拖动。  
不按该键直接拖动会取消选中状态，只移动被拖动的表。

![demo-table-multiple-move](/img/demo-table-multiple-move.webp)

## 复制/粘贴表与备注 {#copyingpasting-tables-and-memos}

复制选中的表与备注，并将它们作为新的表与备注粘贴出来。  
快捷键：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

复制的表会保留名称、注释、列和颜色，复制的备注会保留文本、尺寸和颜色。  
索引和关系不会被复制，副本会保留原有的名称。  
粘贴出来的副本会成为新的选中对象，重复粘贴同一份内容时每次都会再偏移 `50px`，因此多次粘贴不会相互重叠。

当在获得焦点的表中选中了列时，相同的快捷键会改为复制这些列。参见[编辑表](./table-editing.md)。

## 创建表与备注的副本

按住 `Alt` 并用鼠标左键拖动表或备注。  
半透明的预览会跟随指针移动，松开按键后副本会落在预览所在的位置。  
如果拖动的对象已经属于某个选中范围，则整个选中范围都会被复制。否则选中状态会变为指针下的那个对象。  
`Alt + click` 而不移动时，副本会落在右下方 `50px` 处，如果该位置已被占用则继续向后偏移。

副本携带的内容与粘贴相同：名称、注释、列、颜色和备注尺寸，但不包括索引和关系。

## 删除表与备注

删除当前选中的表或备注。  
快捷键：`Ctrl + Backspace` (Windows/Linux) 或 `Ctrl + Delete` (Windows/Linux) 或 `⌘ + Backspace` (Mac) 或 `⌘ + Delete` (Mac)

![demo-table-remove](/img/demo-table-remove.webp)

## 表与备注的颜色设置

可以指定颜色，以便按类别区分。  
点击表或备注顶部的色条即可打开选色器。颜色会应用到所有选中的表与备注，而不仅仅是被点击的那一个。

![demo-table-color](/img/demo-table-color.webp)

## 表显示选项 {#table-view-options}

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

## 表属性 {#table-properties}

打开选中表的属性面板。
通过表的右键菜单或快捷键 `Alt + Space` 打开。
包含 Indexes、Schema SQL、Code Generator 三个标签页。
面板顶部会保留最近打开的五个表，因此无需重新打开即可在它们之间切换。

## 索引 {#indexes}

索引在表属性面板的 `Indexes` 标签页中定义，并会包含在导出的 Schema SQL 中。

左侧列出表上的索引，通过 `+` 添加。  
每个索引都有一个用于设为唯一的 `UQ` 开关、一个名称输入框，以及一个用于删除的 `x`。

右侧列出表的列，每列各有一个复选框。在左侧选中索引之前，右侧不可编辑。  
勾选某一列会将其添加到选中的索引中，取消勾选则将其移除。  
选中索引所包含的列显示在下方。通过拖动手柄可以调整它们的顺序，点击某一行的 `ASC` 或 `DESC` 标记可以切换排序方向。

## 自动排列表

将所有表铺开在画布上，使有关系连接的表彼此靠近，重叠的表被推开。  
通过画布的右键菜单或快速搜索运行。

排列过程中会打开整个画布的预览，提示信息上提供 `Stop` 和 `Cancel`。  
`Stop` 会保留当前时刻的位置。排列自行稳定后，布局也会自动应用。`Cancel` 或 `Escape` 则保持图不变。  
结果只会记录为一条历史记录，因此一次 Undo 就能把所有表恢复原位。

其原理是在图上运行 Force Simulation：关系会把表拉到一起，相邻的表则相互推开。

![demo-automatic-table-placement](/img/demo-automatic-table-placement.webp)

## 数据库 {#databases}

支持的数据库如下：

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

该选项决定导出 Schema SQL 的语法、DataType 的自动补全，以及生成的代码和导入的 schema 所解析出的类型。  
导入 Schema SQL 时，`TIMESTAMP WITH TIME ZONE` 和 `INTERVAL DAY TO SECOND` 这类由多个单词组成的类型名会被完整保留，包括参数列表。

<img src="/img/database-menu.png" width="400" alt="数据库选择菜单" loading="lazy" />

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## 缩放

按住 mod 键并滚动鼠标滚轮进行缩放：`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac)。仅滚动滚轮则是滚动画布。  
快捷键：`Ctrl + Plus` (Windows/Linux) 或 `⌘ + Plus` (Mac)，`Ctrl + Minus` (Windows/Linux) 或 `⌘ + Minus` (Mac)

缩放范围为 `10%` ~ `100%`。  
在 `70%` 及以下时，表会折叠为色条和名称，单元格编辑、单元格快捷键以及复制粘贴都会停止工作，直到重新放大为止。

![demo-zoom](/img/demo-zoom.webp)

## 浏览画布

拖动画布的空白区域即可平移视图，也可以按住 `Space` 在任意位置拖动，包括在表的上方。  
右上角的小地图始终显示整个画布。点击小地图可以将视图移动到该位置，拖动其中的视口矩形则可以滚动。  
如果表或备注跑到了画布之外，对应的边缘上会出现一个定位标记。点击它可以把该对象移回到点击的位置并选中。

## Diff Viewer

可以将以前保存的文档与当前文档进行比较。  
在画布的右键菜单中选择 `Diff Viewer`，然后选择之前导出的 `.json` 文档。

<img src="/img/context-menu-diff-viewer.png" width="400" alt="Diff Viewer 右键菜单" loading="lazy" />

该视图会覆盖在画布之上：左侧显示变更内容，右侧并排显示保存的文档与当前文档。  
两侧都是只读的，不会修改文档中的任何内容。可以通过打开时出现的提示上的 `Close` 按钮或 `Escape` 关闭该视图。

![diff-viewer](/img/diff-viewer.png)
