---
sidebar_position: 5
description: 把相关的表归入位于它们后面、带有名称和颜色的框中；创建、命名、着色、移动、调整大小和删除分组，从资源管理器跳转到分组，更改分组容纳的表，隐藏分组，并在自动布局、Schema SQL 和 DBML 中保留分组。
---

# 表分组

表分组是在 ERD 画布上绘制于相关的表后面、带有名称和颜色的框，用来表明哪些表归为一组。  
一个表最多属于一个分组。分组会随图一起保存，每个表属于哪个分组也会一并保存。

框的顶部有一条标题栏，其中依次是分组图标、以粗体显示的分组名称，以及在指针位于分组上方时出现、用于删除该分组的 `x`，参见[删除分组](#removing-a-group)。没有名称的分组显示为 `unnamed`，名称过长、标题栏放不下时会用 `…` 截断。  
框始终容纳其中的表：它保持被设定的尺寸，但会自动撑大，使每个表都位于框内，四周留有 `24px` 的空间，上方留出标题栏。表变大时框会随之撑大；把表放在靠近边缘的位置、而其中心仍在框内时也是如此。拖动表的过程中，框既不会变大也不会缩小。撑大的尺寸不会被保存：一旦表不再需要这些空间，框就会恢复到它自己的尺寸。

分组绘制在画布上其他所有内容的后面，包括表、备注和关系连接线。  
分组相互重叠时，最后按下或最后添加的分组绘制在前面，并且任何分组的主体都不会遮住其他分组的标题栏。该顺序不会被保存，因此重新打开的图会按分组添加的顺序堆叠它们。  
分组显示在 ERD 画布、小地图和导出的图片中，[资源管理器](./explorer.md)也会列出它们，参见[跳转到分组](#going-to-a-group)。[Visualization](./visualization.md) 标签页在两种模式下都不绘制分组，也不显示分组颜色。

编码智能体同样可以创建和修改分组，并读取所选分组的 DDL，参见 MCP 工具中的[表分组](../../mcp/tools.md#表分组)。

![用 ⌥ + G 进入分组绘制状态，在 orders 和 payments 上绘制分组，将其命名为 Billing，把 order_items 放入其中，然后移动分组并调整其大小](/img/demo-table-group.webp)

## 创建分组 {#creating-a-group}

创建分组有两种方式，每种都有快捷键。在只读编辑器中，以及分组被[隐藏](#hiding-groups)期间，两者都不会提供，其快捷键也不起作用。  
与其他画布快捷键一样，它们仅在 ERD 标签页生效，并且在编辑单元格、备注或分组名称期间会暂停生效，参见[快捷键](./settings.md#快捷键)。

### 绘制分组 {#drawing-a-group}

点击[画布工具栏](./table-related-functions.md#canvas-toolbar)上的 `New Table Group` 按钮，按 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac)，或者在画布右键菜单中选择 `New Table Group`（它位于 `New Table` 和 `New Memo` 之后），或在 ERD 标签页的[快速搜索](./quick-search.md)中选择它，然后在画布上拖出一个框。  
按钮和快捷键用于开关绘制状态，因此在绘制状态下按下其中任意一个都会结束绘制，无论绘制是如何开始的；右键菜单中的条目和快速搜索只能开始绘制。开始绘制会关闭抓手工具，并取消正在绘制的关系。  
进入绘制状态后，光标会变为十字形，无论在哪里按下都会从该处开始画框，即使按在表上也是如此，而不会选中或移动下方的对象。此时画布工具栏会将其 `New Table Group` 按钮显示为选中状态，抓手和指针则都不会显示为选中状态。

松开后会在该框中添加一个分组，无论拖动距离多短，分组都不会小于宽 `160px`、高 `100px`（含标题栏）。只点击而不拖动时，会添加一个宽 `480px`、高 `320px` 的分组，其左上角位于点击处。  
中心位于新框内、且不属于任何分组的每个表都会加入该分组。已经属于其他分组的表则保留在原分组中。

鼠标中键仍然可以平移画布，并且不会结束绘制状态。以下操作会结束绘制而不添加分组：

- 在按下之前或拖动过程中按 `Escape`、`Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac)。在按下之前按时，选中状态保持不变；开始画框的那次按下已经清除了选中状态。
- 右键点击，这会清除选中状态，并且不会打开右键菜单。
- 用 `Space` 或画布工具栏切换到抓手工具、点击工具栏中的指针或其 `New Table Group` 按钮，或者开始绘制关系。
- 切换到其他标签页、隐藏分组，或者编辑器变为只读。

### 为选中的表分组 {#grouping-selected-tables}

选中一个或多个表，然后先按 `T` 再按 `G`，或者在表的右键菜单中选择 `Group selected tables`，或在快速搜索中选择 `Group Selected Tables`（选中了表时才会列出）。  
新分组会围绕选中的表绘制，四周各留出 `24px` 的空间，上方留出标题栏。每个选中的表都会加入新分组并离开原来所在的分组，而被离开的分组仍会保留，即使它已经变空。选中范围中的备注会被忽略。

先按 `T` 再按 `G` 是不带修饰键的两次按键，`G` 须在 `T` 之后一秒内按下。没有选中任何表时它不起作用；在文本框（例如资源管理器的查找输入框）中，它会输入这两个字母。

![先按 T 再按 G，将 categories 和 products 编为分组，将分组命名为 Catalog，再从分组菜单中将其着色为紫色，两个表头都随之显示该颜色](/img/demo-table-group-selected.webp)

无论使用哪种方式，新分组都没有名称和颜色。它会被单独选中，其名称编辑器会在标题栏上打开，以便你立即输入名称，参见[为分组命名](#naming-a-group)。  
添加分组及其纳入的表算一步 Undo，输入的名称则另算一步。

## 为分组命名 {#naming-a-group}

分组的名称在其标题栏上打开的输入框中编辑。创建分组后输入框会自动打开；双击标题栏，或在分组的右键菜单中选择 `Rename`，也会将其打开。  
按 `Enter` 或点击其他位置即可保存名称。`Escape` 会关闭输入框而不更改名称，并让该分组保持选中状态，再按一次 `Escape` 则会清除选中状态。  
更改名称算一步 Undo；名称未改变就保存时不会记录任何内容。名称为空或只有空白时显示为 `unnamed`。  
输入框打开期间，画布快捷键会暂停生效，快速搜索和 `Toggle Explorer` 的快捷键也不起作用，与编辑表的单元格时相同。

分组显示期间，[查找与替换](./find-and-replace.md#what-it-searches)会在 `Table group names` 下搜索分组名称，其 `Replace` 和 `Replace All` 也会重命名分组，参见[替换](./find-and-replace.md#replacing)。[快速搜索](./quick-search.md#searching-the-diagram)不会搜索分组名称。

## 为分组着色 {#coloring-a-group}

在分组的右键菜单中选择 `Color`，即可打开以该分组的颜色为当前颜色的选色器。  
与表和备注一样，选色器会为所有选中的表、备注和分组着色，菜单中的 `Remove color` 或选色器的 `No color` 会去掉它们所有的颜色，参见[表与备注的颜色设置](./table-related-functions.md#表与备注的颜色设置)。分组的颜色同样会出现在选色器的 `Document colors` 中。

已着色的分组会以该颜色绘制标题栏和轮廓，并以该颜色的浅色调绘制主体。没有颜色的分组使用主题的中性灰色。  
已着色分组中的每个表都会在表头上显示分组的颜色，并在左侧边缘保留自己的颜色，因此两者都可见。  
这类表头上的文字和按钮会变为白色；在浅色上黑色明显更易辨认时则变为黑色。分组标题栏上的名称、图标和 `x` 也是如此。选色器的预设色块中，Orange、Amber、Yellow 和 Lime 使用黑色，其余使用白色。  
在以下情况下，表会保留自己的表头：其分组没有颜色时、分组被隐藏期间、缩放级别在 `70%` 及以下（表折叠为名称）时，以及在 Visualization 标签页中。

颜色的修改会像表和备注一样记录到 [Undo 历史记录](./undo-redo.md#一次操作一条记录)中。

## 选中分组 {#selecting-groups}

点击分组的标题栏即可单独选中该分组，`Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac) 则会将其加入选中范围。  
在已经选中的分组的标题栏上按下时，整个选中范围都会保留，因此随后的拖动会移动全部选中对象。  
按下标题栏或右键点击分组时，该分组会移到其他分组的前面，其中的表也会移到其他所有表与备注的前面。

对鼠标左键而言，主体（即标题栏下方的区域）相当于画布：拖动它会平移视图，`Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 会绘制选择框，点击则会清除选中状态。位于主体上方的表、备注和关系连接线照常响应指针操作。

只有当选择框包住分组的整个框时才会选中该分组，因此在分组内部画出的选择框只会选中其中的表，而不会选中分组，参见[多选](./table-related-functions.md#多选)。  
`Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 从不会选中分组。

分组右键菜单中的 `Select tables` 会把选中范围替换为该分组中的表，不包括分组本身，因此下一个命令只会作用于这些表。  
在复制或[聚焦于表](./table-related-functions.md#focusing-on-tables)等只作用于表的命令之前使用它，因为这些命令会忽略选中的分组。

选中的分组的轮廓会变为选中颜色。在[协同编辑的会话](../../api/advanced/collaborative-editing.md)中，其他参与者选中的分组会以该参与者的颜色围出轮廓。

## 跳转到分组 {#going-to-a-group}

[资源管理器](./explorer.md#the-tree)会在其 `Table Groups` 文件夹中按名称列出各个分组，每个分组下方列出其中的表。快速搜索不会列出任何分组。

在资源管理器中选择分组行、选择[查找与替换](./find-and-replace.md#going-to-a-match)中位于分组名称内的匹配项，或在 [Diff Viewer](./table-related-functions.md#the-change-tree) 的列表中选择分组行，都会跳转到该分组。  
这会把该分组的框带入视野，框高于画布时则以其标题栏为准，参见[跳转的落点](./table-related-functions.md#where-a-jump-lands)。随后会单独选中该分组，并把它连同其中的表一起移到最前面，与按下其标题栏时相同。  
分组被[隐藏](#hiding-groups)期间，或者该分组已被删除后，跳转到它不会产生任何效果。  
在 Diff Viewer 中，每一侧只有在其自身的文档包含并显示该分组时才会跳转到它，参见[跳转到变更](./table-related-functions.md#going-to-a-change)。

## 移动分组与调整分组大小 {#moving-and-resizing-a-group}

拖动分组的标题栏，即可连同其中所有的表一起移动该分组。  
如果该分组是更大的选中范围的一部分，整个选中范围都会随之移动；既被选中、又位于该分组中的表只会移动一次。  
指针移动一小段距离后拖动才会开始，因此在标题栏上单击或双击仍然只是点击。在标题栏上 `Alt + drag` 会像普通拖动一样移动该分组；永远不会为分组创建副本。  
这次移动连同其带动的所有表算一步 Undo。

单独拖动表时只会移动该表，并且可能会把它移入或移出某个分组，参见[添加与移除表](#adding-and-removing-tables)。

与备注一样，无论是否选中，每个分组的四条边和四个角都有调整大小的手柄。  
用鼠标左键拖动其中一个：框会跟随指针变化，松开时保存新尺寸，算一步 Undo。  
分组不能小于宽 `160px`、高 `100px`，也不能小于其中的表加上四周 `24px` 的空间和标题栏所占的范围。无论指针移得多远，边缘都会停在那里。

## 添加与移除表 {#adding-and-removing-tables}

表在哪里放下，决定了它加入还是离开某个分组。  
拖动表并松开时，每个被拖动、且不是由选中的分组带动的表都以其中心来判断：它会加入框中包含其中心的最上层分组；如果其中心不在任何分组的框内，则离开其所在的分组。最上层的分组就是绘制在最前面的分组。  
未被这次拖动移动的分组会保持拖动开始时的框，因此在自身分组内轻微挪动的表仍会留在该分组中，必须拖到中心位于该框之外才会离开。  
拖动期间，放下后会接收表的每个分组都会显示轮廓。

如果在最后一次移动后约 `200ms` 内松开，分组的变化会包含在这次拖动的 Undo 步骤中，因此一次 Undo 就能让表回到原来的位置和原来所在的分组。如果松开前停顿得更久，分组的变化会单独算一步，参见[一次操作一条记录](./undo-redo.md#一次操作一条记录)。  
单击或只拖动几个像素都不会改变任何分组；分组隐藏期间，任何表都不会改变所属分组。

更改分组所容纳的表的其他方式：

- 表的右键菜单中的 `Remove from group` 会把每个选中的表移出其所在的分组。只要有选中的表属于某个分组，即使分组处于隐藏状态，它也会显示，并且算一步 Undo。
- `Group selected tables` 会把选中的表移入一个新分组，参见[为选中的表分组](#grouping-selected-tables)。
- 删除分组后，其中的表不再属于任何分组。

粘贴出来的表或用 `Alt` 创建的副本不属于任何分组，即使它落在某个分组的框内也是如此。之后拖动它时，才会按放下规则处理。

## 删除分组 {#removing-a-group}

删除分组永远不会删除其中的表：它们会留在原处，不再属于任何分组。

- 标题栏末端的 `x` 在指针位于分组上方时显示，只会删除该分组。
- 分组右键菜单中的 `Delete` 会删除该分组。当该分组是多个选中对象之一时，该条目显示为 `Delete selected`，并删除所有选中的对象：表、备注和分组。
- 选中了分组时，`Delete` 或 `Backspace` 会删除选中的分组以及所有选中的表和备注，`Ctrl + Backspace` 和 `Ctrl + Delete` (Windows/Linux) 或 `⌘ + Backspace` 和 `⌘ + Delete` (Mac) 也是如此，参见[删除表与备注](./table-related-functions.md#删除表与备注)。

每次删除都算一步 Undo，撤销后分组会连同其中的表一起恢复。

## 分组菜单 {#the-group-menu}

右键点击分组的标题栏、主体或边缘即可打开其菜单。在 Mac 上，`Ctrl + click` 同样会打开菜单，在触摸屏上长按也可以。  
右键点击会先选中该分组：除非它已经在选中范围内，否则只选中它本身，因此只有当该分组原本就在选中范围内时，`Color` 和 `Delete selected` 才会作用于选中范围中的其他对象。

- `Select tables`：只选中该分组中的表，参见[选中分组](#selecting-groups)。
- `Rename`：打开名称编辑器，参见[为分组命名](#naming-a-group)。
- `Color`：打开选色器，参见[为分组着色](#coloring-a-group)。
- `Remove color`：有选中的对象带有颜色时显示。
- `Delete`，该分组是多个选中对象之一时显示为 `Delete selected`，右侧会显示 `Delete` 键，参见[删除分组](#removing-a-group)。

表的右键菜单会在 `Color` 和 `Remove color` 之后、删除条目之前加入 `Group selected tables` 和 `Remove from group`，画布右键菜单则会加入 `New Table Group`。  
`Group selected tables` 会在右侧显示其按键，即先按 `T` 再按 `G`，`New Table Group` 则显示 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac)。

## 隐藏分组 {#hiding-groups}

画布右键菜单中的 `View Option` → `Table Groups` 用于显示或隐藏所有分组，默认处于勾选状态，参见[表显示选项](./table-related-functions.md#table-view-options)。  
取消勾选后，分组的框以及表头上的分组颜色会从画布、小地图和导出的图片中消失，滚动条和小地图也不再为分组留出空间。任何内容都不会移动或改变大小，每个表也仍留在其分组中。  
隐藏分组时会取消对它们的选中，结束正在进行的 `New Table Group` 绘制，并关闭已打开的名称编辑器。

分组隐藏期间：

- 菜单中不再提供 `New Table Group` 和 `Group selected tables`，快速搜索中也不再提供 `New Table Group` 和 `Group Selected Tables`，画布工具栏也不再显示其 `New Table Group` 按钮。`Remove from group` 仍会提供。
- `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac) 以及先按 `T` 再按 `G` 都不起作用。
- 拖动表不会改变任何分组，选择框也不会选中任何分组。
- 资源管理器不再显示其 `Table Groups` 文件夹，查找与替换也不会查找或替换分组名称，即使开启了 `Table group names` 也是如此。
- [自动布局](#auto-layout)仍会让每个分组中的表聚在一起，Schema SQL 标签页仍会提供[可供选择的分组](#schema-sql-by-group)，DBML 仍会写出分组，[Import and Add](./file-import-export.md#import-and-add) 添加的内容仍会落在这些隐藏的框下方。

与其他 View Option 开关一样，该选择会保存在文档中，并记录到 [Undo 历史记录](./undo-redo.md#what-the-history-records)中。

## 自动布局 {#auto-layout}

无论分组是否显示，每种[自动布局](./table-related-functions.md#auto-layout)都会让每个分组中的表聚在一起。

- `Force` 会把每个分组连同其中的表作为一个整体的框来移动，表在框内保持原来的位置，并让每个分组的框与其他分组以及不属于任何分组的表之间至少相距 `100px`。预览会显示每个分组将要移动到的位置。
- `Flow`、`Tree - vertical` 和 `Tree - horizontal` 会在每个分组内部排布其中的表，并根据分组之间的关系放置各个分组，不属于任何分组的表则排布在它们周围。

之后，每个含有表的分组都会贴合其中的表：其框变为这些表的边界范围，加上四周 `24px` 的空间和标题栏。没有表的分组保持原来的位置和大小。  
表和分组的移动只算一步 Undo。

DBML 导入同样会让每个分组围住其中的表，无论这些表被放在哪里，参见 [DBML](./file-import-export.md#dbml)。

## 按分组写出 Schema SQL {#schema-sql-by-group}

[Schema SQL](./schema-sql.md) 标签页可以只写出所选分组中的表。  
只要文档中有分组（无论显示还是隐藏），其选项面板就会在 `This window only` 下显示 `Tables` 一行，其中有 `All` 复选框、每个分组各一个复选框，以及代表不属于任何分组的表的 `No group` 复选框，参见 [Tables](./schema-sql.md#tables)。  
该选择属于编辑器窗口，不会保存到文档中。

## 导入、导出与复制 {#import-export-and-copying}

- DBML 在导入和导出两个方向上都会保留分组。DBML 导入会把每个 `TableGroup` 块变为一个分组，参见 [DBML](./file-import-export.md#dbml)；Code Generator 的 `DBML` 会为每个含有表的分组写出一个 `TableGroup` 块，参见[代码生成](./code-generator.md#语言)。
- JSON 文件会保留其中的分组。其他格式都不会携带分组：SQL、GraphQL 和 AML 导入不会带入分组，Schema SQL 和 Code Generator 的其他目标也不会写出分组。
- [Import and Add](./file-import-export.md#import-and-add) 会把文件中的分组作为容纳其表的新分组带入；分组显示期间，它会把这些分组与新添加的表一起选中，因此拖动添加进来的这一块内容时，其分组也会随之移动。
- [导出的图片](./file-import-export.md#image)会在表的后面绘制显示的分组，表头上也会带有分组颜色。
- 复制粘贴或用 `Alt` 创建副本时，永远不会复制分组，参见[复制/粘贴表与备注](./table-related-functions.md#copyingpasting-tables-and-memos)和[添加与移除表](#adding-and-removing-tables)。

## 只读编辑器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，分组照常绘制，也照常在资源管理器中列出，可以被选中，也可以跳转到它们，但无法修改：

- 在标题栏上按下会选中分组，但不会移动任何内容。没有调整大小的手柄，也没有 `x`。
- 双击标题栏不会打开名称编辑器，分组菜单中只有 `Select tables`。
- 画布菜单中没有 `New Table Group`，表的菜单中没有 `Group selected tables` 和 `Remove from group`，快速搜索也不会列出这两个分组命令。编辑器变为只读时，正在进行的 `New Table Group` 绘制会结束。
- [画布工具栏](./table-related-functions.md#canvas-toolbar)不显示任何添加按钮，包括 `New Table Group`，`Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac) 以及先按 `T` 再按 `G` 也都不起作用。
- 与所有 View Option 一样，`Table Groups` 显示选项不起作用。
- Schema SQL 标签页的 `Tables` 选择仍然有效。
