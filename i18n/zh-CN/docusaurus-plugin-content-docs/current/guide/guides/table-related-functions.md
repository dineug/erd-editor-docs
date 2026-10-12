---
sidebar_position: 4
description: 选中、移动、复制、删除表与备注并创建其副本，设置颜色与显示选项、定义索引与备用键、选择数据库、浏览无限画布以及比较文档。
---

# 表相关功能

表与备注创建之后的所有操作，包括选中、移动、复制、删除、着色，以及设置画布显示哪些内容，还包括围绕它们的画布控制。  
先是表与备注的相关命令；然后是表属性、聚焦于表、索引与备用键、自动布局和数据库厂商；最后是画布本身：画布工具栏、缩放、平移和 Diff Viewer。  
表分组是容纳表的框，有单独的一页介绍，参见[表分组](./table-groups.md)。

## 多选

支持以下三种方式：

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + A` or `Ctrl + Alt + A` (Windows/Linux)，`⌘ + A` or `⌘ + ⌥ + A` (Mac)

备注的选中方式相同，两个全选快捷键都会一次性选中所有表与备注。通过 View Option → `Memos` 隐藏的备注既不会被全选，也不会被选择框选中，参见[表显示选项](#table-view-options)。  
在[表分组](./table-groups.md#selecting-groups)的标题栏上 `Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac) 可以将其加入选中范围，但全选从不会选中表分组。  
`Ctrl + A` 会让位于光标，因此在编辑单元格时它选中的是文本而不是图。  
选择框覆盖到表或备注的中心时才会将其选中，仅接触边缘不会选中。只有当选择框包住表分组的整个框时才会选中该分组，因此在分组内部画出的选择框只会选中其中的表，而不会选中分组。  
在已经选中的对象上右键点击时，整个选中范围都会保留，因此 `Color`、`Group selected tables` 和 `Delete selected` 等菜单条目会作用于所有选中的对象。在其他任何表、备注或表分组上右键点击时，即使按住了 `Ctrl` 或 `⌘`，也只会选中该对象；在关系或空白画布上右键点击则会清除选中状态。  
`Escape` 会清除选中状态。当单元格、备注或表分组名称的编辑器处于打开状态，或正在绘制关系或 `New Table Group` 时，第一次按 `Escape` 会结束该操作，第二次才会清除选中状态。

![用 ⌘ + drag 和 ⌘ + click 选中表，再用 ⌘ + A 选中所有表与备注](/img/demo-table-select.webp)

在协同编辑的会话中，每位参与者的选中状态、获得焦点的单元格和选择框都会以该参与者的颜色绘制在画布上。参见[协同编辑](../../api/advanced/collaborative-editing.md)。

## 移动多个表

拖动已经处于选中范围内的表或备注时，无需任何修饰键，整个选中范围都会一起移动。  
拖动选中范围之外的对象时，选中状态会收缩到该对象上，只移动它。无论哪种情况，`Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 都会保留选中状态。  
只有鼠标左键可以移动表与备注。右键点击只决定右键菜单作用于哪些对象，不会移动任何内容；用鼠标中键拖动则会平移画布，参见[浏览画布](#getting-around-the-canvas)。

![拖动两个选中表之一时两者一起移动，关系连线随之调整](/img/demo-table-multiple-move.webp)

选中的[表分组](./table-groups.md)也会一起移动，并带着其中的表移动；既被选中、又位于正在移动的分组中的表只会移动一次。  
放下表的位置可能会把它移入或移出某个分组，参见[添加与移除表](./table-groups.md#adding-and-removing-tables)。

表与备注共用同一个堆叠顺序。用左键或右键按下某个表或备注时，它会移到其他所有表与备注的前面；按下表分组的标题栏或右键点击其主体时，该分组中的表会移到最前面。  
该顺序不会被保存：重新打开的图会按文件中列出的顺序堆叠表，所有备注都位于表之上。

## 复制/粘贴表与备注 {#copyingpasting-tables-and-memos}

复制选中的表与备注，并将它们作为新的表与备注粘贴出来。  
快捷键：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

复制的表会保留名称、注释、列和颜色，复制的备注会保留文本、尺寸和颜色。  
索引和关系也会一并复制：索引会被整条复制到复制出的表上；关系则只有在其连接的两个表都在复制范围内时才会被复制，并会带上其类型以及 ON DELETE 与 ON UPDATE 操作。只有一端在范围内的关系会被丢弃，而不会保留指向原表的连接。  
粘贴出来的副本会成为新的选中对象，重复粘贴同一份内容时每次都会再偏移 `50px`，因此多次粘贴不会相互重叠。  
副本不会保留其所属的[表分组](./table-groups.md)：粘贴出来的表不属于任何分组，即使它落在某个分组的框内也是如此；选中的分组也不会被复制。  
当 View Option → `Memos` 隐藏了备注时，粘贴仍会添加其中携带的备注，这些备注处于隐藏且未选中的状态，因此只有粘贴出来的表会成为选中对象。

![复制两个通过关系相连的表并粘贴两次，关系也一并复制](/img/demo-table-copy-paste.webp)

当在获得焦点的表中选中了列时，相同的快捷键会改为复制这些列。参见[编辑表](./table-editing.md)。

## 创建表与备注的副本

按住 `Alt` 并用鼠标左键拖动表或备注。  
半透明的预览会跟随指针移动，松开按键后副本会落在预览所在的位置。  
如果拖动的对象已经属于某个选中范围，则整个选中范围都会被复制。否则选中状态会变为指针下的那个对象。  
`Alt + click` 而不移动时，副本会落在右下方 `50px` 处，如果该位置已被占用则继续向后偏移。

副本携带的内容与粘贴相同：名称、注释、列、颜色和备注尺寸，以及完全落在复制范围内的索引和关系。与粘贴一样，副本不属于任何表分组。  
在表分组的标题栏上 `Alt + drag` 会像普通拖动一样移动该分组；永远不会为分组创建副本。

![用 Alt + drag 创建表的副本，再用 Alt + click 在右下方再放一个副本](/img/demo-table-duplicate.webp)

## 删除表与备注

删除选中的表、备注和[表分组](./table-groups.md)。  
快捷键：

- `Delete` 或 `Backspace`。它们会删除整个选中范围，但当唯一选中的对象是一个表、其中选中了部分列，并且缩放级别高于 `70%` 时除外：此时它们会改为删除这些列，参见[删除列](./table-editing.md#删除列)。
- `Ctrl + Backspace` 或 `Ctrl + Delete` (Windows/Linux)，`⌘ + Backspace` 或 `⌘ + Delete` (Mac)。即使选中了列，它们也总是删除选中的表、备注和表分组。

![用 Delete 键删除一个表及其关系，再通过备注菜单中的 Delete selected 一次删除一个表和一个备注](/img/demo-table-remove.webp)

右键菜单同样可以删除。当某个表或备注是两个或更多选中对象之一时，其菜单的最后一个条目会显示为 `Delete selected`，并删除整个选中范围；否则显示为 `Delete`，只删除该表或备注。在选中的列所在的行上，表的菜单会改为显示 `Delete column` 或 `Delete columns`，参见[删除列](./table-editing.md#删除列)。

删除表时，其关系与索引会随之一起删除。删除表分组时会保留其中的表，这些表将不再属于任何分组，参见[删除分组](./table-groups.md#removing-a-group)。  
删除前不会要求确认，每次删除都只算一步 Undo，在 `readonly` 编辑器中则不会删除任何内容。  
按住 `Delete` 和 `Backspace` 不放时，它们只会删除一次，并且永远不会删除关系，参见[编辑关系](./relationship-editing.md#删除)。在单元格、备注或其他任何文本框中输入时，它们会改为编辑文本。  
设置中以 `Delete Selection` 列出这两个按键，参见[快捷键](./settings.md#快捷键)。

## 表与备注的颜色设置

可以指定颜色，以便按类别区分。  
表的颜色显示在其左侧边缘，备注的颜色则显示在其顶部。用左键点击该边缘或色条，或在表或备注的右键菜单中选择 `Color`，即可在指针处打开选色器。颜色会应用到所有选中的表、备注和表分组，而不仅仅是被点击的那一个。  
表分组通过其自身菜单中的 `Color` 着色。位于已着色分组中的表会在表头上显示分组的颜色，同时在左侧边缘保留自己的颜色，参见[为分组着色](./table-groups.md#coloring-a-group)。

![从备注的色条中为两个选中的表和该备注选择 Blue 预设颜色，再用 No color 去掉颜色](/img/demo-table-color.webp)

选色器从上到下依次包含：

- 饱和度与亮度区域，其下是色相滑块，旁边是颜色的预览。浏览器提供取色器时，滑块前会有一个吸管按钮 `Pick a color from the screen`，可以从屏幕上的任意位置取色。
- `Hex`、`R`、`G` 和 `B` 输入框。`Hex` 接受 3、4、6 或 8 位十六进制数字，带不带 `#` 均可，也可以粘贴 `rgb()`、`hsl()` 或 CSS 颜色名称。完整的 6 位或 8 位值会在输入时立即应用，其他值则在按 `Enter` 或离开输入框时应用。`R`、`G` 和 `B` 接受整数，大于 `255` 的值按 `255` 处理，并在按 `Enter` 或离开输入框时应用。选色器无法识别的文本会被丢弃。
- 十六个预设色块，分为两行，每行八个：Red、Orange、Amber、Yellow、Lime、Green、Teal、Cyan、Blue、Indigo、Violet、Purple、Pink、Crimson、Brown 和 Gray。将指针悬停在色块上会显示其十六进制代码。
- `Document colors`：文档中的表、备注和表分组已经使用的颜色，最多八种，使用最多的排在最前。只有存在这样的颜色时才会显示这一行。
- `No color`。

颜色始终是不透明的：选色器没有透明度控件，输入或粘贴的值所带的透明度也会被丢弃。  
打开选色器不会改变任何内容，选择选中对象已有的颜色也不会新增一步 Undo。

`No color` 会在一步 Undo 内清除所有选中的表、备注和表分组的颜色，并关闭选色器。只要有任何选中对象带有颜色，表、备注和表分组的右键菜单中 `Color` 的正下方就会出现 `Remove color`，它的作用相同，但不会打开选色器。

选色器打开时会接管键盘，`Tab` 和 `Shift + Tab` 会在其控件之间循环移动。方向键会将区域和色相滑块移动 1，按住 `Shift` 时移动 10；在色块上，方向键会从一个色块移到另一个色块，并随之应用各个颜色。  
选色器接管键盘期间，Undo 与 Redo、缩放快捷键、Search 以及 Find and Replace 仍会作用于编辑器，其他编辑器快捷键则不会：[删除](#删除表与备注)快捷键不会删除任何内容，`Delete` 和 `Backspace` 只会编辑 `Hex`、`R`、`G` 和 `B` 输入框中的文本。  
`Escape` 会关闭选色器，在选色器之外的画布上按下也会将其关闭。

## 表显示选项 {#table-view-options}

提供以下显示选项：

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Unique`、`Alternate Key` 和 `Auto Increment` 默认关闭，其余选项默认开启。  
`Alternate Key` 会标记每个备用键的列，例如 `AK1.1`，参见[备用键](#alternate-keys)。  
`Referential Actions` 显示关系的 ON DELETE 与 ON UPDATE 操作在其连接线子表一端添加的 `D:` 和 `U:` 标签，参见[读懂连接线](./relationship-editing.md#reading-a-connector)。关闭它只会隐藏这些标签，不会移动任何表或连接线。  
`Table Groups` 显示[表分组](./table-groups.md)，以及分组中各表表头上的分组颜色。关闭它会在画布、小地图和导出的图片中隐藏这些内容，不会移动任何表，每个表也仍留在其分组中，参见[隐藏分组](./table-groups.md#hiding-groups)。  
`Memos` 显示备注。关闭它会在画布、小地图和导出的图片中隐藏所有备注，不会移动任何表或连接线。隐藏的备注不占用空间，因此滚动条、小地图和 `Go to content` 指南针都不会将其计算在内。  
隐藏备注时会取消对它们的选中，并关闭已打开的备注编辑器。[查找与替换](./find-and-replace.md)和快速搜索的 `:` 都不会搜索它们。备注隐藏期间，右键菜单、快速搜索和[欢迎界面](./editing-start.md#欢迎界面)中都不再提供 `New Memo`，`Alt + M` 也不会添加备注。粘贴或 [Import and Add](./file-import-export.md#import-and-add) 仍会添加其中携带的备注，这些备注处于隐藏且未选中的状态。  
在 `readonly` 编辑器中，切换这些选项不起作用。

![切换 View Option 中的条目时表的显示随之变化，用 Alternate Key 将复合唯一索引的两列标记为 AK1.1 和 AK1.2，然后关闭再开启 Memos](/img/demo-view-options.webp)

Visualization 标签页 `Flow` 模式中的卡片不遵循这些选项：它们使用自己的[行显示](./visualization.md#row-display)，并且即使关闭了 `Relationship` 也会绘制连接线。

## 表属性 {#table-properties}

打开表的属性面板。  
可以通过表的右键菜单中的 `Table Properties` 打开，此时打开的是你右键点击的表；也可以选中一个表后按 `Alt + Space`。  
面板会在变暗的画布中央打开，打开面板时会关闭已打开的[查找与替换](./find-and-replace.md)面板。面板顶部包含 `Table Properties` 标题、以标签形式列出的最近打开的五个表（当前表会高亮显示），以及一个关闭按钮。点击某个表的标签即可切换到该表，无需重新打开面板。  
顶部下方有三个标签页：`Indexes`、`Schema SQL` 和 `Code Generator`。三个标签页共用同一尺寸的面板，因此切换标签页时面板不会移动，也不会改变大小。  
可以通过关闭按钮、`Escape` 或点击面板外部将其关闭。

`Indexes` 标签页的介绍参见[索引](#indexes)。  
`Schema SQL` 标签页按所选[数据库](#databases)显示该表的 DDL：它的 `CREATE TABLE`、部分数据库为其 Unique 列单独写出的约束，以及它的索引。无论工具栏中的 [Schema SQL](./schema-sql.md) 标签页如何设置，它始终只写出普通的 `CREATE` 语句，不带头部语句，也不带前置或后置脚本。它没有选项面板，其右键菜单只提供 `Database` 和 `Bracket`。  
`Code Generator` 标签页只为这一张表生成代码，参见[代码生成](./code-generator.md)。

在 `readonly` 编辑器中，面板仍然可以打开，标题旁会显示 `Read only` 徽标，但其 `Indexes` 标签页不提供任何编辑功能。

## 聚焦于表 {#focusing-on-tables}

以 `Flow` 模式打开 Visualization 标签页，范围缩小到所选的表以及与它们相隔一条关系的所有表。  
通过表的右键菜单中的 `Focus on this table` 打开，或者选中一个或多个表后按 `Alt + F`。  
当你右键点击的表是多个选中表中的一个时，该条目会显示为 `Focus on selected tables`，并聚焦整个选中范围。在选中范围之外的表上右键，则只聚焦该表。  
快捷键作用于选中的表，不包括备注，没有选中任何表时不起作用。  
选中的[表分组](./table-groups.md)在这里不起任何作用，快捷键和菜单条目都是如此：分组中的表只有在其本身被选中时才会被纳入，分组菜单中的 `Select tables` 可以选中它们。  
缩小后的视图显示哪些内容，以及如何回到整张图，参见[可视化](./visualization.md#focusing-on-tables)。

## 索引 {#indexes}

索引在表属性面板的 `Indexes` 标签页中定义，并会包含在导出的 Schema SQL 中。

左侧分两组列出表的键和索引。  
`Keys` 仅在表中有键时显示，列出由表的列所声明的键：先是覆盖标记为 PK 的列的 `PK_<table name>`，然后按列的顺序，为每个标记为 Unique 的列列出 `UQ_<table name>_<column name>`。这些名称与所选数据库的 Schema SQL 一致，因此当 `Bracket` 为 `None` 时，对于 `sales.users` 这样带 schema 限定的表，除 Databricks 和 Snowflake 外的所有数据库都会列出 `PK_users`，参见[带 schema 限定的表名](./schema-sql.md#schema-qualified-table-names)。每个键都带有 `PK` 或 `UQ` 标记和一个锁形图标。它们在这里是只读的，只会随列的 [PK](./table-editing.md#列主键) 与 [Unique](./table-editing.md#not-null-unique-auto-increment) 标志而变化。  
`Indexes` 按添加的顺序列出表的索引。每个索引都有一个用于设为唯一的 `UQ` 开关、一个名称输入框，以及一个用于删除的 `x`。作为[备用键](#alternate-keys)的索引还会显示其编号，例如 `AK1`。通过列表底部的 `Add Index` 添加索引。

右侧在 `Columns` 下列出表的列，每列各有一个复选框。在左侧选中索引之前，右侧不可编辑。  
勾选某一列会将其添加到选中的索引中，取消勾选则将其移除。选中键时，其列会显示为已勾选，但复选框保持禁用。  
选中索引所包含的列显示在下方的 `Index order` 下。通过拖动手柄可以调整它们的顺序，点击某一行的 `ASC` 或 `DESC` 标记可以切换排序方向。在备用键中，每一行的末尾都带有其 `AK<n>.<m>` 标记。该列表一次显示三行，其余的可以滚动查看。

在 `readonly` 编辑器中，选中键或索引时仍会显示其列，但没有 `Add Index` 和 `x`，标签页中的其他内容也都无法更改。

![为 orders 打开表属性，Indexes 标签页在索引上方列出 PK 和 UQ 键，然后添加一个覆盖 member_id 和 ordered_at DESC 的索引，并在 Schema SQL 标签页中查看](/img/demo-table-properties.webp)

## 备用键 {#alternate-keys}

备用键是由两列或更多列组成的唯一索引，即 `Indexes` 标签页中开启了 `UQ` 开关、并且勾选了表中至少两列的索引。  
只有一列的唯一索引所表达的内容与该列的 Unique 标志并无不同，因此它不是备用键；普通索引、主键以及标记为 Unique 的列也都不是备用键。

在[显示选项](#table-view-options)中开启 `Alternate Key` 后，图会按照 erwin 和 IDEF1X 的写法标记每个备用键的列：`AK1.1`、`AK1.2` 等。该选项默认关闭。

键的编号取决于其列在表中的位置，而不是索引添加的顺序。`Index order` 中第一列在表中位置最靠上的键为 `AK1`。位置相同时，由各键的下一列决定；如果一个键是另一个更长的键的前导部分，则排在后者之前。  
在表中移动列，或调整某个键的 `Index order`，都可能使键重新编号。通过 Undo 恢复被删除的键时，它会取回原来的编号，并且所有协作者看到的编号都相同。

键的每一列都标记为 `AK<n>.<m>`，其中 `n` 是键的编号，`m` 是该列在键的 `Index order` 中的位置。属于多个键的列会带有所有标记，以逗号连接。  
例如，在包含 `a`、`b`、`c` 三列的表中，覆盖 (`c`, `a`) 和 (`b`, `a`) 的两个唯一索引会成为 `AK1` = (`b`, `a`) 和 `AK2` = (`c`, `a`)，因为 `b` 位于 `c` 之上。因此 `b` 显示为 `AK1.1`，`c` 显示为 `AK2.1`，`a` 显示为 `AK1.2,AK2.2`。

该标记绘制在行的最后，位于[列顺序](./settings.md#adjusting-column-order)排在最后的单元格之后。它不是单元格，因此永远不会获得焦点、进入编辑模式或被复制，参见[编辑表](./table-editing.md)。  
主键列或外键列同样可以带有 AK 标记，因为该标记不会取代任何内容：行首的钥匙图标仍然显示 PK 和 FK，Unique 单元格也保留自己的 `UQ`。  
带有备用键的表会在每一行最后一个单元格之后留出足以容纳其最长标记的空间；没有备用键的表则保持原有宽度。  
这些标记显示在 ERD 画布上，但在 `70%` 及以下，表会折叠为名称，此时不显示任何标记；[图片导出](./file-import-export.md#image)中同样会显示这些标记，无论缩放级别如何，导出时每个表都会完整绘制。Visualization 标签页 `Graph` 模式中的[悬停预览](./visualization.md#hover-preview)同样会显示这些标记；`Flow` 卡片则从不显示。

无论该选项是否开启，`Indexes` 标签页都会显示编号，参见[索引](#indexes)。

## 自动布局 {#auto-layout}

替你把所有表排布到画布上。  
在画布的右键菜单或快速搜索中打开 `Auto Layout`，然后从四种布局中选择一种：

| 布局 | 画出的样子 |
| --- | --- |
| `Force` | 一次模拟：关系把表拉到一起，相邻的表相互推开，重叠的表被分开。 |
| `Flow` | 沿着关系从左到右流动，每条连线在表上都有各自的接点。它会尽量减少线条交叉，但也可能留下换一种布局就能避免的交叉。 |
| `Tree - vertical` | 自上而下分层：父表位于持有指向它的外键的表之上。 |
| `Tree - horizontal` | 同样的分层，改为从左到右。 |

`Force` 会在排列稳定之前打开预览，提示信息上提供 `Apply` 和 `Cancel`。  
预览的取景以布局开始时的图为准，因此在排列稳定的过程中，表可能会移出取景范围。预览以 `70%` 或更低的缩放绘制，因此表会折叠为名称和颜色边缘。  
`Apply` 会保留当前时刻的位置。排列自行稳定后，布局也会自动应用。`Cancel` 或 `Escape` 则保持图不变。

其余三种在主线程之外一次算完，没有过程可看：计算期间会显示一条提示，算好的布局会落在图形已经占据的区域中央。`Cancel` 或 `Escape` 会丢弃你不再等待的布局；不运行 shared worker 的宿主环境则会以 `Could not place tables` 收场，参见 [Web Worker](../../api/installation.md#web-workers)。60 秒内仍未返回的布局也会以同样的方式收场。

无论选择哪一种，移动的都是表和表分组，备注留在原处。指向自身的关系会被忽略，同两个表之间的多条关系只算一条。  
无论分组是否显示，每种布局都会让每个分组中的表聚在一起，并调整每个含有表的分组，使其围住这些表，参见[表分组](./table-groups.md#auto-layout)。  
结果只会记录为一条历史记录，因此一次 Undo 就能把所有表和分组恢复原位。

![通过画布右键菜单的 Flow 自动布局整理散乱的表，表沿着关系从左到右排列](/img/demo-automatic-table-placement.webp)

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

可以通过画布右键菜单、Schema SQL 与 Code Generator 标签页的选项面板或右键菜单，或快速搜索中的 `Database` 选择数据库。这些入口修改的都是同一个设置。

该选项决定导出 Schema SQL 的语法、DataType 的自动补全，以及生成的代码和导入的 schema 所解析出的类型。  
该选项也决定 [Schema SQL](./schema-sql.md#options-panel) 标签页可以写出哪些 `Statements` 与 `Header` 选项。数据库不具备的选项仍会留在选项面板中，但会变暗显示，SQL 则会退回到该数据库具备的最接近的选项。  
该选项还决定 Schema SQL 和 Code Generator 的 ORM 目标会写出哪些 ON DELETE 与 ON UPDATE 操作，以及关系菜单会为哪些操作标注 `not in <database>`，参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update) 和[代码生成](./code-generator.md#database)。  
导入 Schema SQL 时，无论编辑器是否列出该类型，列的数据类型都会连同参数列表一起被保留，例如 `TIMESTAMP WITH TIME ZONE`、`public.mood` 或 `integer[]`，参见[数据类型](./file-import-export.md#data-types)。DataType 自动补全只推荐所选数据库列出的类型。

![将数据库切换为 PostgreSQL，然后从自动补全中选择 PostgreSQL 类型](/img/demo-database.webp)

![DataType 自动补全的模糊匹配，用方向键移动候选并用 Right、Tab、Enter 确认](/img/demo-data-type-autocomplete.webp)

## 画布工具栏 {#canvas-toolbar}

画布底部边缘的中间浮着一个小工具栏，集中放置作用于画布本身的工具：

- 抓手与指针。默认是指针；切换到抓手后，无论在空白处还是在表的上方，拖动都会变成平移视图。用 `Space` 在两者之间切换。正在绘制 [`New Table Group`](./table-groups.md#drawing-a-group) 时，两者都不会显示为选中状态，此时点击其中任意一个、按 `Space` 或选择一种关系表示法，都会结束绘制而不添加分组。
- 缩放：`Zoom out`、以百分比显示的当前缩放级别，以及 `Zoom in`。这两个按钮与缩放快捷键一样逐级调整缩放，点击百分比则会把缩放恢复为 `100%`。
- 四种关系表示法，与开始绘制关系时使用的相同。参见[开始编辑](./editing-start.md)。绘制关系需要依次点击两个表，因此选择一种表示法后工具会切回指针。
- 禅模式 `Alt + Z`，只保留画布和这个工具栏，隐藏其余界面。再次按 `Alt + Z` 或点击按钮即可恢复。已打开的[查找与替换](./find-and-replace.md)面板会保留，并上移到顶部工具栏让出的空间中。
- `Go to content` 指南针，仅在屏幕上没有任何表、显示的备注或显示的表分组时才会出现在工具栏末尾。参见[浏览画布](#getting-around-the-canvas)。

每个带有快捷键的按钮都会在提示中标出该快捷键。  
在 `Force` 自动布局预览、表属性、Time Travel 或 Diff Viewer 打开期间，工具栏会暂时隐藏，关闭后再重新出现。

![用抓手在表的上方平移，按 Space 切回指针，逐级缩小再放大，然后用 ⌥ + Z 和对应按钮切换禅模式](/img/demo-canvas-toolbar.webp)

## 缩放

按住 mod 键并滚动鼠标滚轮进行缩放：`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac)。仅滚动滚轮则是平移画布。  
触控板上的捏合手势同样可以缩放，以捏合的位置为中心；触摸屏上的两根手指也可以缩放，并会随手指的移动平移画布。  
快捷键：`Ctrl + Plus` (Windows/Linux) 或 `⌘ + Plus` (Mac)，`Ctrl + Minus` (Windows/Linux) 或 `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 会保持屏幕中心不变，直接回到 `100%`。

[画布工具栏](#canvas-toolbar)上的 `Zoom out` 和 `Zoom in` 按钮与 `Minus`、`Plus` 快捷键一样逐级调整缩放：每按一次调整 4 个百分点，并保持屏幕中心不变。两个按钮之间的百分比显示当前的缩放级别，点击它会像 `Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 一样直接回到 `100%`。

缩放范围为 `10%` ~ `150%`。  
在 `70%` 及以下时，表会折叠为名称和颜色边缘，单元格编辑、单元格快捷键以及复制粘贴都会停止工作，直到重新放大为止。

这三个快捷键同样可以缩放 Visualization 标签页，`Graph` 模式与 `Flow` 模式均适用，各自在自己的范围内缩放。参见[可视化](./visualization.md#toolbar)。

![用 ⌘ + Wheel 缩小到表折叠为名称，再用 ⌘ + Plus、⌘ + Minus 和 ⌘ + 0 调回](/img/demo-zoom.webp)

## 浏览画布 {#getting-around-the-canvas}

画布没有边界，也没有可设置的尺寸。表与备注就停在你放下它们的地方，下面这些都以图本身为准，而不是一张固定大小的页面。

拖动画布的空白区域即可平移视图，也可以用 `Space` 切换到抓手工具后在任意位置拖动，包括在表的上方。滚轮同样可以平移，`Shift + Wheel` 则是左右平移。  
对鼠标左键而言，[表分组](./table-groups.md#selecting-groups)的主体（即标题栏下方的区域）相当于空白画布：拖动它会平移视图，`Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 会绘制选择框，点击则会清除选中状态。  
平移没有边界：滚轮、拖动和抓手工具都会让视图随你移动到任意远处，在任何一侧都可以越过表继续平移。

按住鼠标中键（即按下滚轮）拖动，可以从画布上的任意位置平移视图，指针和抓手都适用。即使按下的位置落在表、备注、单元格、图标或关系上也同样有效。  
中键拖动不会选中、移动或点击任何内容，并会保留选中状态。它会关闭已打开的右键菜单和选色器，浏览器自身的中键滚动和中键粘贴也不会启动。  
在滚动条、小地图、画布工具栏或已打开的单元格或备注编辑器上按下中键时，不会平移视图。

右上角的小地图显示的是图本身加上四周各一屏的空间，也就是滚动条可以到达的范围，并向外对齐到较粗的网格，因此缩小得越多，图在小地图中就越小。点击小地图可以将视图移动到该位置，拖动其中的视口矩形则可以平移。缩小时，视口矩形会随之变大，覆盖小地图上更大的区域。  
小地图以每个表的颜色绘制该表，并将每个显示的表分组绘制为一个带有分组颜色的框，位于其中的表之后。  
右侧和底部的滚动条表示的是同一段范围：从图刚好位于屏幕一侧之外，到刚好位于另一侧之外，因此它至少比当前绘制出的图长出一屏，视图停在图之外时还会更长。在禅模式之外，只要文档中有任何表、显示的备注或显示的表分组，即使全部内容都已在屏幕内，两条滚动条也都会显示。没有这些内容的文档，例如其中仅有的备注已通过 View Option → `Memos` 隐藏的文档，既没有滚动条，也没有小地图。  
拖动滚动条滑块或小地图中的视口矩形是唯一会停下的平移：它最远只能平移到表刚好移出屏幕的位置；如果拖动开始时的位置比这更远，则最远只能到拖动开始的位置。

如果平移之后屏幕上没有留下任何表、显示的备注或显示的表分组，[画布工具栏](#canvas-toolbar)末尾会出现一个 `Go to content` 指南针，用箭头指出最近的对象在哪个方向、有多远。点击它即可在不改变缩放的情况下把该对象移到屏幕中央。

![通过拖动空白画布、在表的上方用中键拖动、小地图和滚轮平移视图，再跟随 Go to content 指南针返回](/img/demo-canvas-navigation.webp)

## Diff Viewer

可以将以前保存的文档与当前文档进行比较。  
在画布的右键菜单中选择 `Diff Viewer`，然后选择之前导出的 `.json` 文档。

该视图会覆盖在画布之上：左侧显示变更内容，右侧并排显示保存的文档与当前文档。  
表与列按名称进行匹配。两侧值不同的单元格会在两侧都被着色，保存的文档中为红色，当前文档中为绿色，因此只在一侧存在的表或列会整体着色。  
备注和表分组会在每一侧按该文档中的样子绘制，但不参与比较：它们从不会被着色，左侧的列表也只列出表和列。  
每一侧都可以通过滚轮、拖动空白区域或表分组的主体，或在其上任意位置用中键拖动来平移，并通过 `Ctrl + Wheel` (Windows/Linux)、`⌘ + Wheel` (Mac) 或捏合手势缩放。在 `70%` 及以下，表会像在画布上一样折叠，着色也不再显示。  
两侧都是只读的，不会修改文档中的任何内容。可以通过打开时出现的 `Diff Viewer` 提示上的 `Close` 按钮或 `Escape` 关闭该视图。

![从画布菜单用保存的 .json 文件打开 Diff Viewer，逐项查看变更，然后将其关闭](/img/demo-diff-viewer.webp)
