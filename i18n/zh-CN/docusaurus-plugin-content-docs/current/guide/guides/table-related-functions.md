---
sidebar_position: 4
description: 选中、移动、复制表与备注并创建其副本，设置颜色与显示选项、定义索引、选择数据库、浏览无限画布以及比较文档。
---

# 表相关功能

表与备注创建之后的所有操作，包括选中、移动、复制、着色，以及设置每个表显示哪些内容，还包括围绕它们的画布控制。  
先是表与备注的相关命令，然后是表属性、聚焦于表、索引、自动布局和数据库厂商，最后是画布本身：画布工具栏、缩放、平移和 Diff Viewer。

## 多选

支持以下三种方式：

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + A` or `Ctrl + Alt + A` (Windows/Linux)，`⌘ + A` or `⌘ + ⌥ + A` (Mac)

备注的选中方式相同，两个全选快捷键都会一次性选中所有表与备注。  
`Ctrl + A` 会让位于光标，因此在编辑单元格时它选中的是文本而不是图。  
选择框覆盖到对象的中心时才会将其选中，仅接触边缘不会选中。

![用 ⌘ + drag 和 ⌘ + click 选中表，再用 ⌘ + A 选中所有表与备注](/img/demo-table-select.webp)

在协同编辑的会话中，每位参与者的选中状态、获得焦点的单元格和选择框都会以该参与者的颜色绘制在画布上。参见[协同编辑](../../api/advanced/collaborative-editing.md)。

## 移动多个表

拖动已经处于选中范围内的表或备注时，无需任何修饰键，整个选中范围都会一起移动。  
拖动选中范围之外的对象时，选中状态会收缩到该对象上，只移动它。无论哪种情况，`Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 都会保留选中状态。

![拖动两个选中表之一时两者一起移动，关系连线随之调整](/img/demo-table-multiple-move.webp)

## 复制/粘贴表与备注 {#copyingpasting-tables-and-memos}

复制选中的表与备注，并将它们作为新的表与备注粘贴出来。  
快捷键：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

复制的表会保留名称、注释、列和颜色，复制的备注会保留文本、尺寸和颜色。副本会保留原有的名称。  
索引和关系也会一并复制：索引会被整条复制到复制出的表上；关系则只有在其连接的两个表都在复制范围内时才会被复制。只有一端在范围内的关系会被丢弃，而不会保留指向原表的连接。  
粘贴出来的副本会成为新的选中对象，重复粘贴同一份内容时每次都会再偏移 `50px`，因此多次粘贴不会相互重叠。

![复制两个通过关系相连的表并粘贴两次，关系也一并复制](/img/demo-table-copy-paste.webp)

当在获得焦点的表中选中了列时，相同的快捷键会改为复制这些列。参见[编辑表](./table-editing.md)。

## 创建表与备注的副本

按住 `Alt` 并用鼠标左键拖动表或备注。  
半透明的预览会跟随指针移动，松开按键后副本会落在预览所在的位置。  
如果拖动的对象已经属于某个选中范围，则整个选中范围都会被复制。否则选中状态会变为指针下的那个对象。  
`Alt + click` 而不移动时，副本会落在右下方 `50px` 处，如果该位置已被占用则继续向后偏移。

副本携带的内容与粘贴相同：名称、注释、列、颜色和备注尺寸，以及完全落在复制范围内的索引和关系。

![用 Alt + drag 创建表的副本，再用 Alt + click 在右下方再放一个副本](/img/demo-table-duplicate.webp)

## 删除表与备注

删除当前选中的表或备注。  
快捷键：`Ctrl + Backspace` (Windows/Linux) 或 `Ctrl + Delete` (Windows/Linux) 或 `⌘ + Backspace` (Mac) 或 `⌘ + Delete` (Mac)

![删除一个表及其关系，然后一次删除一个表和一个备注](/img/demo-table-remove.webp)

## 表与备注的颜色设置

可以指定颜色，以便按类别区分。  
点击表或备注顶部的色条即可打开选色器。颜色会应用到所有选中的表与备注，而不仅仅是被点击的那一个。

![从备注的色条中选择颜色，应用到所有选中的表与备注](/img/demo-table-color.webp)

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

![在画布右键菜单中切换 View Option，表的显示随之变化](/img/demo-view-options.webp)

Visualization 标签页 `Flow` 模式中的卡片不遵循这些选项：它们使用自己的[行显示](./visualization.md#row-display)，并且即使关闭了 `Relationship` 也会绘制连接线。

## 表属性 {#table-properties}

打开选中表的属性面板。
通过表的右键菜单或快捷键 `Alt + Space` 打开。
包含 Indexes、Schema SQL、Code Generator 三个标签页。
面板顶部会保留最近打开的五个表，因此无需重新打开即可在它们之间切换。

## 聚焦于表 {#focusing-on-tables}

以 `Flow` 模式打开 Visualization 标签页，范围缩小到所选的表以及与它们相隔一条关系的所有表。  
通过表的右键菜单中的 `Focus on this table` 打开，或者选中一个或多个表后按 `Alt + F`。  
当你右键点击的表是多个选中表中的一个时，该条目会显示为 `Focus on selected tables`，并聚焦整个选中范围。在选中范围之外的表上右键，则只聚焦该表。  
快捷键作用于选中的表，不包括备注，没有选中任何表时不起作用。  
缩小后的视图显示哪些内容，以及如何回到整张图，参见[可视化](./visualization.md#focusing-on-tables)。

## 索引 {#indexes}

索引在表属性面板的 `Indexes` 标签页中定义，并会包含在导出的 Schema SQL 中。

左侧列出表上的索引，通过 `+` 添加。  
每个索引都有一个用于设为唯一的 `UQ` 开关、一个名称输入框，以及一个用于删除的 `x`。

右侧列出表的列，每列各有一个复选框。在左侧选中索引之前，右侧不可编辑。  
勾选某一列会将其添加到选中的索引中，取消勾选则将其移除。  
选中索引所包含的列显示在下方。通过拖动手柄可以调整它们的顺序，点击某一行的 `ASC` 或 `DESC` 标记可以切换排序方向。

![在表属性面板中添加索引，并在 Schema SQL 标签页中查看](/img/demo-table-properties.webp)

## 自动布局 {#auto-layout}

替你把所有表排布到画布上。  
在画布的右键菜单或快速搜索中打开 `Auto Layout`，然后从四种布局中选择一种：

| 布局 | 画出的样子 |
| --- | --- |
| `Force` | 一次模拟：关系把表拉到一起，相邻的表相互推开，重叠的表被分开。 |
| `Flow` | 沿着关系从左到右流动，每条连线在表上都有各自的接点，因此线条是展开而不是交叉的。 |
| `Tree - vertical` | 自上而下分层：父表位于持有指向它的外键的表之上。 |
| `Tree - horizontal` | 同样的分层，改为从左到右。 |

`Force` 会在排列稳定之前打开整张图的预览，提示信息上提供 `Apply` 和 `Cancel`。  
`Apply` 会保留当前时刻的位置。排列自行稳定后，布局也会自动应用。`Cancel` 或 `Escape` 则保持图不变。

其余三种在主线程之外一次算完，没有过程可看：计算期间会显示一条提示，算好的布局会落在图形已经占据的区域中央。`Cancel` 或 `Escape` 会丢弃你不再等待的布局；不运行 shared worker 的宿主环境则会以 `Could not place tables` 收场，参见 [Web Worker](../../api/installation.md#web-workers)。60 秒内仍未返回的布局也会以同样的方式收场。

无论选择哪一种，移动的都只有表，备注留在原处。指向自身的关系会被忽略，同两个表之间的多条关系只算一条。  
结果只会记录为一条历史记录，因此一次 Undo 就能把所有表恢复原位。

![通过画布右键菜单的 Flow 自动布局整理散乱的表](/img/demo-automatic-table-placement.webp)

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

![将数据库切换为 PostgreSQL，然后从自动补全中选择 PostgreSQL 类型](/img/demo-database.webp)

![DataType 自动补全的模糊匹配，用方向键移动候选并用 Right、Tab、Enter 确认](/img/demo-data-type-autocomplete.webp)

## 画布工具栏 {#canvas-toolbar}

画布底部边缘的中间浮着一个小工具栏，集中放置作用于画布本身的工具：

- 抓手与指针。默认是指针；切换到抓手后，无论在空白处还是在表的上方，拖动都会变成平移视图。用 `Space` 在两者之间切换。
- 缩放：`Zoom out`、以百分比显示的当前缩放级别，以及 `Zoom in`。这两个按钮与缩放快捷键一样逐级调整缩放。
- 四种关系表示法，与开始绘制关系时使用的相同。参见[开始编辑](./editing-start.md)。绘制关系需要依次点击两个表，因此选择一种表示法后工具会切回指针。
- 禅模式 `Alt + Z`，只保留画布和这个工具栏，隐藏其余界面。再次按 `Alt + Z` 或点击按钮即可恢复。
- `Go to content` 指南针，仅在屏幕上没有任何表或备注时才会出现在工具栏末尾。参见[浏览画布](#getting-around-the-canvas)。

每个带有快捷键的按钮都会在提示中标出该快捷键。  
在 `Force` 自动布局预览、表属性、Time Travel 或 Diff Viewer 打开期间，工具栏会暂时隐藏，关闭后再重新出现。

![在画布工具栏上用抓手平移、逐级缩放并切换禅模式](/img/demo-canvas-toolbar.webp)

## 缩放

按住 mod 键并滚动鼠标滚轮进行缩放：`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac)。仅滚动滚轮则是平移画布。  
快捷键：`Ctrl + Plus` (Windows/Linux) 或 `⌘ + Plus` (Mac)，`Ctrl + Minus` (Windows/Linux) 或 `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 会保持屏幕中心不变，直接回到 `100%`。

[画布工具栏](#canvas-toolbar)上的 `Zoom out` 和 `Zoom in` 按钮与 `Minus`、`Plus` 快捷键一样逐级调整缩放：每按一次调整 4 个百分点，并保持屏幕中心不变。两个按钮之间的百分比显示当前的缩放级别。

缩放范围为 `10%` ~ `150%`。  
在 `70%` 及以下时，表会折叠为色条和名称，单元格编辑、单元格快捷键以及复制粘贴都会停止工作，直到重新放大为止。

这三个快捷键同样可以缩放 Visualization 标签页，`Graph` 模式与 `Flow` 模式均适用，各自在自己的范围内缩放。参见[可视化](./visualization.md#toolbar)。

![用 ⌘ + Wheel 缩小到表折叠为色条和名称，再用缩放快捷键调回](/img/demo-zoom.webp)

## 浏览画布 {#getting-around-the-canvas}

画布没有边界，也没有可设置的尺寸。表与备注就停在你放下它们的地方，下面这些都以图本身为准，而不是一张固定大小的页面。

拖动画布的空白区域即可平移视图，也可以用 `Space` 切换到抓手工具后在任意位置拖动，包括在表的上方。滚轮同样可以平移，`Shift + Wheel` 则是左右平移。  
平移没有边界：滚轮、拖动和抓手工具都会让视图随你移动到任意远处，在任何一侧都可以越过表继续平移。

右上角的小地图显示图所占的范围，并留出一圈外边距。点击小地图可以将视图移动到该位置，拖动其中的视口矩形则可以平移。缩小时，视口矩形会随之变大，覆盖小地图上更大的区域。  
右侧和底部的滚动条表示的是同一段范围。只有当某个方向上还有可移动的空间时，对应的滚动条才会出现，因此空文档既没有滚动条也没有小地图。  
拖动滚动条滑块或小地图中的视口矩形是唯一会停下的平移：它最远只能平移到表刚好移出屏幕的位置；如果拖动开始时的位置比这更远，则最远只能到拖动开始的位置。

如果平移之后屏幕上没有留下任何表或备注，[画布工具栏](#canvas-toolbar)末尾会出现一个 `Go to content` 指南针，用箭头指出最近的对象在哪个方向、有多远。点击它即可在不改变缩放的情况下把该对象移到屏幕中央。

![通过拖动、滚轮和小地图平移视图，再跟随 Go to content 指南针返回](/img/demo-canvas-navigation.webp)

## Diff Viewer

可以将以前保存的文档与当前文档进行比较。  
在画布的右键菜单中选择 `Diff Viewer`，然后选择之前导出的 `.json` 文档。

该视图会覆盖在画布之上：左侧显示变更内容，右侧并排显示保存的文档与当前文档。  
两侧都是只读的，不会修改文档中的任何内容。可以通过打开时出现的提示上的 `Close` 按钮或 `Escape` 关闭该视图。

![用保存的 .json 文件打开 Diff Viewer，并逐项查看变更](/img/demo-diff-viewer.webp)
