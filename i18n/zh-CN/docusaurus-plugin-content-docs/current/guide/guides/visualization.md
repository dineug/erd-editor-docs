---
sidebar_position: 11
description: 以力导向的 Graph 或由表卡片组成的 Flow 浏览 schema，可缩放、可平移，能点亮一个表的相关表，能一次只聚焦于少数几个表，并能回退到之前的聚焦。
---

# 可视化

以两种模式之一展示整个文档，让它一目了然：

- `Graph`，由所有表、列以及它们之间的关系构成的力导向图，参见 [Graph 模式](#graph-mode)。
- `Flow`，每个表都绘制为一张卡片，并沿着关系排布，参见 [Flow 模式](#flow-mode)。

从顶部工具栏的 `Visualization` 标签页打开，也可以在[快速搜索](./quick-search.md)的 `Tab` 中打开。  
在 ERD 标签页中，`Alt + F` (Windows/Linux) 或 `⌥ + F` (Mac) 以及表右键菜单中的 `Focus on this table` 条目会直接以 `Flow` 打开它，范围缩小到你选取的表以及与它们相隔一条关系的表，参见[聚焦于表](#focusing-on-tables)。

通过[工具栏](#toolbar)左端的 `Graph` 与 `Flow` 按钮切换模式。  
新打开的编辑器从 `Graph` 开始。所选的模式在编辑器打开期间一直保持，切换到其他标签页再回来也不会改变，但不会保存到文档中。

## 工具栏 {#toolbar}

标签页底部边缘的中间浮着一个工具栏，从左到右依次为：

- `Graph` 与 `Flow`，当前模式会高亮显示。
- `Previous table` 与 `Next table`，仅在 `Flow` 中出现：一个向左的箭头和一个向右的箭头，用于在 Flow 先后缩小到的表之间后退和前进，参见[上一个表与下一个表](#previous-table-and-next-table)。朝某个方向没有可前往的步骤时，对应的按钮会变暗显示。
- `Zoom out`、以百分比表示的当前缩放（例如 `100%`）以及 `Zoom in`。每按一次，缩放变化 4 个百分点，并保持屏幕中心不变。百分比显示的是当前所在模式的缩放，点击它会把该缩放恢复为 `100%`。
- `Fit`，将该模式显示的全部内容纳入视野：在 `Graph` 中是所有节点，在 `Flow` 中是所有卡片。
- `Tidy Up`，仅在 `Flow` 中出现，用于重新排布卡片，参见 [Flow 的排布方式](#how-flow-is-placed)。
- 行显示菜单，仅在 `Flow` 中出现，以当前选项作为标签，参见[行显示](#row-display)。
- `Name View` 列表，仅在 `Flow` 中出现，以当前的显示方式作为标签，参见[卡片上的名称](#names-on-the-cards)。
- `Show all`，仅在 `Flow` 中且仅在视图范围缩小期间出现，用于回到整张图，参见[聚焦于表](#focusing-on-tables)。
- `Go to content` 指南针，仅在屏幕上没有任何节点或卡片时才会出现在工具栏末尾。它用箭头指向最近的节点或卡片，并显示距离，例如 `1.2k`。点击它即可在不改变缩放的情况下把该节点或卡片移到屏幕中央。

缩放按钮和两个箭头会在提示中标出自己的快捷键，例如 `Zoom in (Ctrl + Plus)` (Windows/Linux) 或 `Zoom in (⌘ + Plus)` (Mac)，以及 `Previous table (Ctrl + Z)` (Windows/Linux) 或 `Previous table (⌘ + Z)` (Mac)。  
在两种模式下，`Ctrl + Plus` 与 `Ctrl + Minus` (Windows/Linux) 或 `⌘ + Plus` 与 `⌘ + Minus` (Mac) 都会像按钮一样逐级缩放，`Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 则直接回到 `100%`。在 `Flow` 中，`Ctrl + Z` 与 `Ctrl + Shift + Z` (Windows/Linux) 或 `⌘ + Z` 与 `⌘ + Shift + Z` (Mac) 会像两个箭头一样后退和前进。  
点击百分比的效果与 `Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 相同，它的提示中也会标出该快捷键。在快速搜索打开期间，这些快捷键不起作用。

## Graph 模式 {#graph-mode}

将整个文档绘制为力导向图，从而一眼看清表与表之间的关系，以及哪些表处于领域的核心位置。

![打开 Graph 模式，悬停预览表、拖动节点，再缩小并放大回来](/img/demo-visualization.webp)

### 图的解读 {#reading-the-graph}

每个表和每个列都是一个节点，两类节点以不同颜色绘制。备注与[表分组](./table-groups.md)不会被绘制。  
每个列节点与其所属的表相连，通过关系连接的两个表之间也会相连。  
在同一方向上存在多条关系的表之间只连接一次，起点和终点为同一个表的关系不会绘制连线。

放大时图上会浮现表名，在 `50%` 到 `100%` 之间逐渐显现，超过 15 个字符的名称会被截断。列节点在任何缩放级别下都不带标签。  
这些标签遵循名称显示，参见[画布之外](./logical-names.md#beyond-the-canvas)。在 `Both Names` 下，标签会把逻辑名放在一行，把名称放在其下一行，每一行各自截断。

### 浏览图 {#getting-around-the-graph}

滚轮以指针所指的位置为中心缩放，范围为 `10%` ~ `400%`。  
触控板上的捏合手势也以同样的方式缩放；触摸屏上的两根手指则以两指之间的位置为中心缩放，并随手指的移动平移。  
拖动背景即可平移，也可以按住鼠标中键从任意位置拖动（包括节点上），与 [ERD 画布](./table-related-functions.md#getting-around-the-canvas)上相同。中键拖动只会平移：它永远不会拉动节点。

[工具栏](#toolbar)上的缩放按钮和缩放快捷键则会保持屏幕中心不动，缩放范围相同，`Fit` 会将所有节点纳入视野。

### 悬停预览 {#hover-preview}

将鼠标悬停在表节点上，可在光标旁预览该表。  
悬停在列节点上时，只会在它周围绘制一个圆环，不会打开预览。

预览中显示的列和单元格与 ERD 画布相同，顺序也相同，所显示的名称也与画布在你当前的名称显示下相同，参见[表显示选项](./table-related-functions.md#table-view-options)、[调整列顺序](./settings.md#adjusting-column-order)和[名称显示](./logical-names.md#name-view)。  
开启 `Alternate Key` 显示选项后，[备用键](./table-related-functions.md#alternate-keys)的每一列都会在行的最后带上其标记，例如 `AK1.1`，预览也会像 ERD 画布上的表那样为此加宽。  
与 ERD 画布上的表不同，它的表头永远不会显示该表所属[分组](./table-groups.md#coloring-a-group)的颜色，它的名称也永远不会带有词典的检查在画布上添加的[标记](./dictionary.md#marks-on-the-canvas)。  
预览仅用于显示，并且在拖动节点或平移时会隐藏。

### 点亮邻域 {#highlighting-a-neighbourhood}

将鼠标悬停在某个表上时，它的邻域也会一并点亮：表本身、它自己的列、通过关系与它相连的表（两个方向都算），以及它们之间的连线。  
图上其余部分会淡出，于是这个表所触及的范围一目了然。

### 移动节点 {#moving-nodes}

用鼠标左键拖动节点，可以将它以及与之相连的所有节点带到新的位置。  
按住期间节点会被固定在指针上，周围的布局也会重新活跃起来。  
松开后布局会重新稳定下来，节点不会固定在放开的位置。  
在节点上用右键按下或右键拖动，既不会拉动它，也不会平移。

### 图是快照 {#the-graph-is-a-snapshot}

图基于打开该标签页时的文档内容生成，每次重新进入都会从头重新生成。  
从 `Flow` 切换到 `Graph` 时同样会重新生成，并且每次重新生成都会从 `100%` 开始。

## Flow 模式 {#flow-mode}

将每个表绘制为一张卡片，并沿着关系排布这些卡片。备注与[表分组](./table-groups.md)不会被绘制。  
它不是[自动布局](./table-related-functions.md#auto-layout)中的 `Flow` 布局，后者移动的是 ERD 标签页上的表本身。

每张卡片的绘制方式与 ERD 标签页上的表相同：左侧边缘是表的颜色，顶部是带有表图标和按[名称显示](#names-on-the-cards)显示的表名称的标题栏，下方是其[行显示](#row-display)所要求的行。与 ERD 标签页上的表不同，卡片还会在行与行之间画线分隔，其标题栏也永远不会显示该表所属[分组](./table-groups.md#coloring-a-group)的颜色。卡片在任何缩放级别下都保持这一外观，不会像 ERD 标签页上的表那样在 `70%` 及以下折叠为名称。卡片上的任何内容都无法编辑。

连接线是从表到表的一条平滑曲线，绘制在卡片下方，因此可能从某张卡片背后穿过。指向自身的关系会以曲线绕过卡片的右上角，与 ERD 标签页上相同，参见[连接线路径](./relationship-editing.md#连接线路径)。无论是否为识别关系，所有连接线都绘制为同样的灰色实线，两端的符号与 ERD 标签页上的相同，参见[读懂连接线](./relationship-editing.md#reading-a-connector)。即使关闭了 `Relationship` [显示选项](./table-related-functions.md#table-view-options)，Flow 也会绘制连接线。无论 `Referential Actions` 显示选项如何设置，它都不会绘制关系的 ON DELETE 与 ON UPDATE 操作的 `D:` 和 `U:` 标签，也不会显示将这些操作完整写出的提示。

在整张图中，没有通过关系与其他表相连的表会集中到一个区块中，而不会散落在其余表之间。

![切换到 Flow，悬停在 orders 上点亮它及其相邻的表，固定点亮状态，选择 Keys only，再用 ⌘ + Wheel 放大并按下 Fit](/img/demo-visualization-flow.webp)

### 行显示 {#row-display}

[工具栏](#toolbar)上的行显示菜单决定每张卡片绘制多少内容。它的标签就是当前选项，提示内容形如 `Row display: Name only`。  
菜单在工具栏上方打开，当前选项旁带有勾选标记。选择一项、再次点击标签、点击编辑器中的其他任意位置、按 `Escape` 或切换到 `Graph` 时，菜单都会关闭。

| 行显示 | 每张卡片显示的内容 |
| --- | --- |
| `Name only` | 仅标题栏。 |
| `Keys only` | 主键列与外键列，以及关系所连接到的其他任何列。 |
| `All fields` | 所有列。 |

行按表中列的顺序排列。每行显示列名，当该列是主键、外键或两者兼是时，列名前带有钥匙图标；右侧显示数据类型，无论卡片是否[点亮](#lighting-related-tables)。[名称显示](#names-on-the-cards)决定每行显示哪些名称，以及是否显示该列的域。  
不会绘制其他单元格或备用键标记，[表显示选项](./table-related-functions.md#table-view-options)以及用于调整行内单元格顺序的[调整列顺序](./settings.md#adjusting-column-order)都不适用于卡片。

Flow 首次打开时从 `Name only` 开始，如果是通过[聚焦于表](#focusing-on-tables)打开的，则从 `Keys only` 开始。此后只有在你选择其他选项时行显示才会改变，缩小或扩大视图范围时都会保持不变。  
更改行显示会改变卡片的尺寸，因此 Flow 会重新排布卡片并使其适应屏幕。

### 卡片上的名称 {#names-on-the-cards}

卡片按名称显示来显示其表和列的名称，与 ERD 标签页绘制时所用的是同一个名称显示，参见[名称显示](./logical-names.md#name-view)。  
在这里可以通过[工具栏](#toolbar)上的 `Name View` 列表切换它。该列表的按钮显示当前的显示方式，即 `Physical Names`、`Logical Names` 或 `Both Names`，其提示为 `Name View`。列表在工具栏上方打开，当前的显示方式旁带有勾选标记，关闭方式与[行显示](#row-display)菜单相同。所做的选择会切换整个编辑器（包括 ERD 标签页），与在其他任何位置切换相同，参见[切换显示方式](./logical-names.md#switching-the-view)。

卡片仅按名称显示来排布其单元格。任何[显示选项](./table-related-functions.md#table-view-options)都不会改变它们，包括 `Domain`：

| 名称显示 | 标题栏 | 每一行 |
| --- | --- | --- |
| `Physical Names` | 表名。 | 列名，然后是数据类型。 |
| `Logical Names` | 表的逻辑名。 | 列的逻辑名，然后是其[域](./dictionary.md#domains-and-data-types)的名称；没有域时则是其数据类型。 |
| `Both Names` | 逻辑名，然后是以淡色显示的表名。 | 逻辑名、名称、域和数据类型。 |

逻辑名为空时，`Logical Names` 会在其位置变暗显示名称，名称也为空时则显示 `table` 或 `column` 占位文字；`Both Names` 则显示变暗的 `logical` 占位文字。在 `Both Names` 下，没有域的列会显示变暗的 `domain` 占位文字。  
卡片永远不会带有词典的检查在 ERD 标签页上为名称添加的[标记](./dictionary.md#marks-on-the-canvas)。  
切换名称显示会改变卡片的尺寸，因此 Flow 会重新排布卡片，参见 [Flow 的排布方式](#how-flow-is-placed)。

### 浏览 Flow {#getting-around-the-flow}

滚轮用于平移，`Shift + Wheel` 则是左右平移。`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac) 用于缩放，并保持屏幕中心不变。  
触控板上的捏合手势以捏合的位置为中心缩放；触摸屏上的两根手指则以两指之间的位置为中心缩放，并随手指的移动平移。  
拖动背景即可平移，也可以按住鼠标中键从任意位置拖动（包括卡片上）。中键拖动只会平移，并保持选中状态不变。与 [ERD 画布](./table-related-functions.md#getting-around-the-canvas)一样，平移没有边界。  
缩放范围为 `10%` ~ `150%`。Flow 拥有独立于 ERD 标签页的缩放与平移，两者都不会保存到文档中。

在背景上按下会清除选中状态，在背景上 `Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 则会绘制选择框。  
Flow 没有小地图，也没有滚动条。如果平移之后屏幕上没有留下任何卡片，可以使用[工具栏](#toolbar)上的 `Go to content` 指南针。

### 点亮相关表 {#lighting-related-tables}

将鼠标悬停在卡片上，会点亮该卡片、与它相隔一条关系的表，以及将它与这些表相连的连接线。这些表彼此之间的连接线不会点亮。  
点亮的卡片会带上强调色的边框和光晕，关系所连接到的行会被着色。点亮的连接线会变为强调色。  
与 [Graph](#highlighting-a-neighbourhood) 不同，其余部分不会淡出；没有悬停或固定的卡片时，则不会点亮任何内容。

点击卡片可以固定其点亮状态，指针移开后它仍保持点亮。再次点击同一张卡片或点击背景即可解除固定；点击另一张卡片则会把固定转移到那张卡片上。悬停的卡片与固定的卡片会同时点亮。  
拖动、`Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac)、平移以及[卡片按钮](#card-buttons)都不会固定或解除固定卡片。

每条点亮的连接线上都有粒子流动，从主键所在的父表一端流向子表一端。同时点亮的连接线超过 60 条时，粒子会停止，点亮状态则保持不变。

### 卡片按钮 {#card-buttons}

指针位于卡片上方时，其标题栏右端会出现两个图标按钮，两者都没有提示：

- 航点图标（与 `Flow` 按钮上的图标相同）会将 Flow 的范围缩小到该表以及与它相隔一条关系的表，参见[聚焦于表](#focusing-on-tables)。按一次 `Previous table` 即可回到 Flow 之前显示的内容，参见[上一个表与下一个表](#previous-table-and-next-table)。
- 外部链接图标会切换到 ERD 标签页，只选中该表并将其移到最前面，表名会获得焦点（在 `Logical Names` 和 `Both Names` 下则是其逻辑名），除非焦点原本就在该表的某个单元格中。只有当该表没有显示得足够清楚时，画布才会滚动到它，参见[跳转的落点](./table-related-functions.md#where-a-jump-lands)。它永远不会开始或完成正在绘制的关系。

按下任一按钮都只作用于按钮本身：与按下卡片的其他部位不同，它不会选中卡片，也不会把它移到最前面。因此航点按钮会保留你原有的选中状态；外部链接按钮只是在切换到 ERD 标签页的过程中选中该表。两个按钮都只响应鼠标左键点击。

### 移动卡片 {#moving-cards}

除两个卡片按钮之外，用鼠标左键拖动卡片的任意部位都可以移动它；右键拖动不会移动任何内容。  
按下卡片会将其选中，`Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac) 会将其加入选中范围，拖动已选中的卡片会移动所有选中的卡片。这里的选中状态与 ERD 标签页共用，因此在这里选中的内容回到 ERD 标签页后仍处于选中状态。

卡片只在 Flow 中移动：它对应的表在 ERD 标签页上仍留在原处。  
移动过的卡片在平移、缩放和 `Fit` 之后都会保持原位。离开该标签页或切换到 `Graph` 再回来时，以及 `Show all` 或一次[后退或前进](#previous-table-and-next-table)回到 Flow 已有的布局时，它会回到布局原先安排的位置。新的布局会重新放置它，并将你放下它的位置考虑在内，参见 [Flow 的排布方式](#how-flow-is-placed)。

### 聚焦于表 {#focusing-on-tables}

在 ERD 标签页中选中一个或多个表后按 `Alt + F` (Windows/Linux) 或 `⌥ + F` (Mac)，或者右键点击某个表并选择 `Focus on this table`。  
Visualization 标签页会以 `Flow` 打开，范围缩小到这些表以及与其中任意一个表相隔一条关系的所有表（两个方向都算）。只会绘制所显示的表之间的连接线。

当右键点击的表是多个选中表之一时，该条目显示为 `Focus on selected tables`，并聚焦于整个选中范围。右键点击选中范围之外的表时，只聚焦于该表。  
`Alt + F` 取用选中的表，不包括备注和[表分组](./table-groups.md)。没有选中任何表时它不起作用，即使选中了分组也是如此：请先在分组的右键菜单中选择 `Select tables`，参见[选中分组](./table-groups.md#selecting-groups)。  
在编辑单元格、备注或表分组的名称期间，键盘焦点位于[资源管理器](./explorer.md#keys-in-the-explorer)中时，或者快速搜索、表属性、Diff Viewer、自动布局预览、Time Travel、[`Export image`](./file-import-export.md#image) 对话框或 [`Map Columns`](./relationship-editing.md#map-columns) 打开期间，它都会被忽略。

在 Flow 内部，航点[卡片按钮](#card-buttons)会以同样的方式缩小视图范围，只是针对那一个表。[工具栏](#toolbar)上的 `Show all` 会回到整张图。工具栏上的 `Previous table` 与 `Next table` 或其按键，会在 Flow 先后缩小到的范围之间后退和前进，参见[上一个表与下一个表](#previous-table-and-next-table)。  
缩小范围后的视图会单独排布并适应屏幕。离开该标签页或切换到 `Graph` 再回来时，它仍保持缩小后的范围，`Escape` 也不会将其扩大。

![按 ⌥ + F 聚焦于 orders，用 members 卡片上的航点按钮缩小到 members，再用 Show all 回到整张图](/img/demo-visualization-focus.webp)

### 上一个表与下一个表 {#previous-table-and-next-table}

Flow 会像浏览器的历史记录一样，记住它先后缩小到的范围。每当视图转到其他表时，无论是在 ERD 标签页中[聚焦于表](#focusing-on-tables)、使用航点[卡片按钮](#card-buttons)，还是使用 `Show all`，之前显示的内容都会作为后退的一步保留下来，无论那是几个表还是整张图。

![按 ⌥ + F 将 Flow 缩小到 orders，再缩小到 members，用 Previous table 后退，用 ⌘ + Shift + Z 前进，再用 ⌘ + Z 后退，最后按 Show all](/img/demo-visualization-steps.webp)

- [工具栏](#toolbar)上的 `Previous table` 会后退一步，`Next table` 则会再次前进到 `Previous table` 离开的内容。
- 在 `Flow` 中，`Ctrl + Z` (Windows/Linux) 或 `⌘ + Z` (Mac) 会像 `Previous table` 一样后退，`Ctrl + Shift + Z` (Windows/Linux) 或 `⌘ + Shift + Z` (Mac) 会像 `Next table` 一样前进。它们在那里永远不会撤回或重做对图的编辑。在 `Graph` 中以及快速搜索打开期间，它们不起作用。
- 后退之后缩小视图范围或按 `Show all`，会丢弃前进方向的步骤。再次聚焦于 Flow 当前已缩小到的完全相同的表，不会添加步骤，也不会丢弃任何步骤。
- 后退方向最多保留最近的 100 步，最早的一步会最先被丢弃。

每一步会显示其中仍在图中的表，以及与它们相隔一条关系的所有表，与聚焦相同。其中的表已全部被删除的步骤会被跳过并丢弃；会让 Flow 停在原处的步骤也是如此：即正好落在 Flow 当前已缩小到的那些表上，或在 Flow 已显示整张图时落在整张图上。  
朝某个方向没有剩余的步骤时，对应的按钮会变暗显示，并且不起作用。Flow 首次打开时，无论显示的是整张图还是打开它的聚焦所指定的表，两个按钮都会变暗显示。Flow 打开过之后，再从 ERD 标签页进行聚焦时，会把你离开时 Flow 显示的内容保留为后退的一步。  
每一步都会像聚焦一样排布并适应屏幕（参见 [Flow 的排布方式](#how-flow-is-placed)），行显示保持不变。

这些步骤只属于 Flow。它们在编辑器打开期间一直保留，切换到其他标签页或 `Graph` 再回来也不会丢失，但不会保存到文档中，也不会发送给协作者，并且不会向 Undo 历史记录中添加任何内容。替换整个文档时，它们会与 Flow 的其余状态一起被丢弃。

在从右到左书写的显示语言中，工具栏保持原有顺序，两个箭头的作用则会互换，因此 `Previous table` 是向右的箭头。按键保持不变，参见[从右到左书写的语言](./language-and-theme.md#right-to-left-languages)。

### Flow 的排布方式 {#how-flow-is-placed}

首次显示 `Flow` 时，它所显示的表会在主线程之外完成排布，结果会适应屏幕。  
布局在编辑器打开期间一直保留。离开该标签页或切换到 `Graph` 再回来时，Flow 会重用该布局，缩放与平移也保持在你离开时的状态。  
Flow 为整张图和最近一次缩小到的表各保留一份布局，因此只要生成整张图布局所依据的内容没有变化，`Show all` 就会回到该布局并使其适应屏幕，而无需重新计算。[后退或前进](#previous-table-and-next-table)到整张图或 Flow 最近一次缩小到的表时，也会以同样的方式重用相应的布局。

在以下情况下，Flow 会重新排布卡片：

- 按下 `Tidy Up`。结果会适应屏幕。
- 更改行显示、将视图范围缩小到其他表，或通过 `Previous table` 或 `Next table` 转到其他表。结果会适应屏幕。
- 在 `Name View` 列表中选择另一种显示方式。结果会适应屏幕。
- 添加或删除了表或关系，或切换了名称显示，无论是在你离开 Flow 期间进行的（回来时生效），还是你在 Flow 中时由协作者进行的。缩放与平移保持不变。

每次排布都会考虑卡片当前所在的位置，因此 `Tidy Up` 不一定能恢复之前的排列。  
仅改变卡片尺寸的变更（例如重命名表、输入逻辑名或添加列）不会重新排布卡片。如果卡片最终相互重叠，请按 `Tidy Up`。

排布耗时超过 6 秒时，会显示 `Placing tables` 提示，并带有旋转的加载图标和 `Cancel`。  
`Cancel`，或在排布进行期间随时按 `Escape`，都会丢弃这次排布；按 `Tidy Up` 或回到 `Flow` 时会再次请求排布。  
如果排布失败（宿主环境不运行 shared worker、worker 启动失败，或 60 秒内没有返回布局），Flow 会显示带有警告标志的 `Could not place tables` 提示，按 `Tidy Up` 可以重试。参见 [Web Worker](../../api/installation.md#web-workers)。  
无论是整张图还是缩小范围后的视图，Flow 都只绘制最近一次布局所放置的表，因此首次显示时，在排布成功之前可能一张卡片都没有。  
每当 Flow 重新排布卡片（例如将视图范围缩小到其他表）时，之前的排列会一直留在屏幕上，直到新的布局完成；如果这次排布被取消或失败，之前的排列也会保持不变。

当整个文档被替换时（例如导入文件），Flow 的布局、聚焦、`Previous table` 与 `Next table` 的步骤、行显示、缩放和平移都会被丢弃，下次打开 Flow 时会像第一次那样重新开始：显示整张图，如果是通过[聚焦于表](#focusing-on-tables)打开的，则显示缩小后的范围。

### Flow 从不编辑文档 {#flow-never-edits-the-document}

Flow 只读取图。缩放、平移、移动卡片、`Tidy Up`、行显示、固定、聚焦，以及通过 `Previous table` 和 `Next table` 后退和前进，都不会向 [Undo 历史记录](./undo-redo.md#what-the-history-records)中添加任何内容。  
它们也不会改变图中的任何内容。按下卡片确实会把对应的表移到最前面，就像在 ERD 标签页上点击表一样，因此该表在 ERD 标签页上也会位于最前面，但叠放顺序不会被保存，参见[移动多个表](./table-related-functions.md#移动多个表)。`Graph` 同样不会改动图。  
`Name View` 列表是一个例外，但仅限于 `Name View` [锁定](./settings.md#锁定)关闭期间：此时所做的选择会切换图的名称显示，该名称显示会被保存，协作者也会随之切换。锁定开启时（默认如此），所做的选择只会改变你自己的屏幕。无论哪种情况，它都不会向 Undo 历史记录中添加任何内容。  
按下卡片永远不会添加关系。如果你在绘制关系的过程中离开了 ERD 标签页，那么在尚未选取起点表时，按下卡片会将其表选为起点，否则会结束这次绘制。  
外部链接[卡片按钮](#card-buttons)则更进一步，因为它会把你带出 Flow：当 ERD 标签页需要滚动到该表时，这次滚动会像其他任何视图位置变化一样被记录。

你在 Flow 中时，协作者的编辑仍会反映到图上，卡片也会随他们添加或删除的表与关系而变化，参见 [Flow 的排布方式](#how-flow-is-placed)。  
他们的选中与焦点环形边框会绘制在卡片上，但他们的光标和选择框不会，参见[协同编辑](../../api/advanced/collaborative-editing.md)。

两种模式（包括聚焦以及后退和前进）在 `readonly` 编辑器中同样可用，`Name View` 列表也是如此，在那里它只会切换你自己的屏幕。
