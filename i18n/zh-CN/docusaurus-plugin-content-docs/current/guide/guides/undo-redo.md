---
sidebar_position: 15
description: Undo 与 Redo、历史记录的内容、词典工作表各自的历史记录，以及通过 Time Travel 浏览图的历史记录。
---

# Undo, Redo

可以回到之前的编辑状态，也可以前进到之后的状态。  
历史记录最多保留 `2048` 条变更。

- Undo: `Ctrl + Z` (Windows/Linux) 或 `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) 或 `⌘ + Shift + Z` (Mac)

在 ERD 标签页中，工具栏同样提供这两个命令，即 `Time Travel` 旁边的 `Undo` 与 `Redo` 按钮。在 Dictionary 标签页中，工具栏显示 `Undo` 与 `Redo`，但不显示 `Time Travel`；其他标签页都不显示它们。  
只有在存在可 Undo 或 Redo 的内容时按钮才会亮起。`readonly` 编辑器会隐藏这些按钮和 `Time Travel`，快捷键也不会撤回或重做任何内容。

Undo 与 Redo 仅在 ERD 标签页中作用于图的历史记录。  
在该标签页中，快速搜索、`Table Properties`、`Diff Viewer`、`Auto Layout` 预览、[`Export image`](./file-import-export.md#image) 对话框、[映射列](./relationship-editing.md#map-columns)或 Time Travel 打开时，快捷键不生效。  
键盘焦点位于[资源管理器](./explorer.md#keys-in-the-explorer)中的任何位置（包括其树）时，以及[选色器](./table-related-functions.md#表与备注的颜色设置)打开时，快捷键仍然有效。即使光标位于它们的某个输入框中，例如查找输入框、替换输入框或 `Hex` 输入框，快捷键 Undo 与 Redo 的对象也是图，而不是输入框中的文本。

在其他标签页中：

- Dictionary 标签页：它们会从当前显示的工作表（`Domains`、`Words` 或 `Terms`）自身的历史记录中撤回和重做该工作表的编辑，永远不会作用于图的历史记录。在 `Checks` 工作表中它们不起作用，参见[词典工作表](#dictionary-sheets)。
- Visualization 标签页：在 `Flow` 中，同样的按键会在 Flow 先后显示过的内容之间后退和前进，与 `Previous table` 和 `Next table` 相同，在 `readonly` 编辑器中也是如此。它们在那里永远不会对图执行 Undo 或 Redo，参见[上一个表与下一个表](./visualization.md#previous-table-and-next-table)。在 `Graph` 中它们不起作用。
- Schema SQL、Code Generator 和 Settings 标签页：它们不可用。在 Schema SQL 标签页的 `Before tables` 和 `After tables` 输入框中，同样的按键会改为对你在输入框中输入的内容执行 Undo 与 Redo。

历史记录保存在当前会话的内存中。它不会存入文档，因此重新打开图时历史记录为空。

![移动表并用 ⌥ + Backspace 删除列后，用 ⌘ + Z 将两者依次 Undo，再用 ⌘ + Shift + Z 将它们 Redo](/img/demo-undo-redo.webp)

## 历史记录的内容 {#what-the-history-records}

会记录以下内容：

- 表与备注：添加、删除、移动与颜色；表的名称、逻辑名与注释；备注的文本与大小。
- 表分组：添加、删除、移动、调整大小、名称、颜色，以及每个表所属的分组。参见[表分组](./table-groups.md)。
- 列：添加、删除、调整顺序、逻辑名、各列所关联的域，以及所有列选项。
- 词典生成的物理名，以及每个名称是自行填写的还是由词典生成的：一次 Undo 会同时恢复名称及其这一状态，参见[自行填写的名称](./dictionary.md#names-of-your-own)。
- `Derive Physical Name Again` 与 `Derive Physical Names Again`，参见[重新生成物理名](./dictionary.md#derive-physical-names-again)。
- 关系：添加、删除、类型修改、在[映射列](./relationship-editing.md#map-columns)中设置的列，以及在 `On Delete` 或 `On Update` 中的每一次选择。参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。对删除执行 Undo 时，关系会连同其 ON DELETE 与 ON UPDATE 操作一起恢复。
- 索引及其列。
- 视图位置、缩放级别，以及 `View Option` 开关。
- Schema SQL 标签页的 `Before tables` 和 `After tables` 脚本，每次通过离开输入框而生效的编辑各算一步。参见[前置与后置脚本](./schema-sql.md#before-and-after-scripts)。
- 导入文件，以及通过 [`Import and Add`](./file-import-export.md#import-and-add) 添加文件。

不会记录以下内容：

- 数据库厂商与数据库名称。
- Code Generator 的语言、`Table Name Case` 与 `Column Name Case`。
- 括号类型，无论是在 Schema SQL 标签页还是在 Code Generator 标签页中设置的。
- Schema SQL 标签页中 `Statements`、`Header`、`Write logical names into empty comments` 与 `Tables` 的选择，它们属于编辑器窗口。参见[选项面板](./schema-sql.md#options-panel)。
- Settings 标签页中的全部内容，包括 [`Lock`](./settings.md#锁定) 中的各行。
- 切换名称显示，无论是在哪个位置切换，也无论其锁定是否开启，参见[切换显示方式](./logical-names.md#switching-the-view)。
- 主题与显示语言。参见[语言与主题](./language-and-theme.md)。
- 哪个表、备注或分组绘制在其他对象的前面。
- [资源管理器](./explorer.md)：打开、关闭资源管理器或调整其宽度，折叠其树，以及搜索文本与选项。不过，`Replace` 与 `Replace All` 所做的修改会被记录，跳转产生的滚动也会被记录。参见[一次操作一条记录](#一次操作一条记录)。
- Visualization 标签页中两种模式下的缩放与平移、移动图的节点或 Flow 卡片、`Tidy Up`、行显示、聚焦于表，以及通过 `Previous table` 和 `Next table` 后退和前进。参见 [Flow 从不编辑文档](./visualization.md#flow-never-edits-the-document)。
- Dictionary 标签页当前显示的工作表，以及每个工作表的搜索、选中范围、滚动位置和列宽，参见[打开标签页](./dictionary.md#opening-the-tab)。

这些内容的变更无法 Undo。

只读编辑器完全不记录任何内容。视图位置、缩放和 `View Option` 开关，以及标签页、名称显示、数据库和代码设置，在那里仍可更改，但只作用于该屏幕，因此没有任何内容可以 Undo，参见设置中的[只读编辑器](./settings.md#read-only-editors)。

在 Dictionary 标签页中所做的编辑可以 Undo，但它们进入的是其所属工作表的历史记录，而不是这里的历史记录，因此 ERD 标签页中的 Undo 永远不会撤回这些编辑，即使是域的新 `Data Type` 及其所修改的列类型也不会，参见[词典工作表](#dictionary-sheets)。

从其他编辑器到达的变更同样不会被记录，因此 Undo 只会撤回你自己的变更。在[协同编辑会话](../../api/advanced/collaborative-editing.md)中，每个编辑器各自 Undo 自己的变更，而通过 [MCP 服务器](../../mcp/live-and-headless.md#undo)进行编辑的编码智能体则用 `erd_undo` 撤回它自己的变更。

对替换整张图的 `Import` 执行 Undo 时，之前的图会按导入时编辑器所持有的样子恢复，每个[锁定](./settings.md#锁定)的开启或关闭状态以及每个锁定的值也都恢复为当时的样子。  
如果该图锁定了 `Viewport`，视图和缩放会回到锁定的视图，即打开该图时显示的位置，而不是你原先所在的位置。如果该图的 `Viewport` 未锁定，它们会回到你导入时所在的位置。其他锁定的设置，例如当前所在的标签页、Code Generator 的语言或名称显示，则保持你屏幕上的样子。  
新建的图中所有锁定都处于开启状态。在导入之前关闭 `Viewport` 的锁定，即可在这类 Undo 之后保留当前视图。导入之后才关闭其锁定，或导入一个自身 `Viewport` 锁定处于关闭状态的 JSON 文件，都不会改变 Undo 带你回到的位置。

对 JSON 文件的导入执行 Undo 时，还会恢复之前的图所拥有的词根、术语和域。Schema SQL、GraphQL、DBML 或 AML 导入会保留词典，因此对其执行 Undo 与 Redo 时，词典保持当前的样子，包括此后在 Dictionary 标签页中所做的编辑。

ERD 标签页中的 Undo 或 Redo 如果让某列重新关联到域，或恢复了一个关联到域的列，会赋予该列该域当前的数据类型。如果它让已关联的列恢复为其他类型，则会取消该列的关联，参见[域与数据类型](./dictionary.md#domains-and-data-types)。

## 一次操作一条记录

单次操作触发的全部变更会合并为一条历史记录。  
一次性粘贴多个表与备注，或通过 `Alt + drag` 复制它们，都只需一步即可 Undo。

按一次 `Delete` 或 `Backspace`，或者在右键菜单中选择 `Delete selected` 或 `Delete columns`，都只算一步，无论删除了多少表、备注、表分组或列。  
在多个选中的列上切换主键算一步，无论是通过 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，还是通过表的右键菜单中的 `Primary Key on selected columns`。  
为选中范围设置颜色，或用 `No color` 或 `Remove color` 清除颜色，都只算一步，无论选中了多少表、备注和分组。选择所有选中对象都已具有的颜色不会记录任何一步，在没有任何选中对象带有颜色时使用 `No color` 也是如此。  
[映射列](./relationship-editing.md#map-columns)中的 `Map` 或 `Save` 算一步，它添加的外键列和修改的数据类型也包含在这一步中。  
`Import and Add` 算一步，如果需要滚动才能把添加的内容块带入视野，该滚动也包含在这一步中。

从逻辑名单元格下方的列表中选择术语算一步：包括逻辑名、由它生成的物理名，以及对于列而言该术语的域及其数据类型，参见[补全术语名称](./logical-names.md#completing-term-names)。  
在列的域单元格中选择域算一步，它赋予该列的数据类型以及[关系数据类型同步](./settings.md#关系数据类型同步)沿着关系传递的修改也包含在这一步中。选择 `None` 会取消该列的关联，同样算一步，参见[域单元格](./logical-names.md#the-domain-cell)。在已关联的列中输入与其域不同的数据类型时，会在该次输入的那一步中取消该列的关联。  
`Derive Physical Name Again` 或 `Derive Physical Names Again` 算一步，无论它修改了多少名称、域关联和数据类型。只有在它没有修改任何内容时，才不会记录任何步骤。把自行填写的名称交还给词典也算一次修改，即使该名称已经与词典给出的名称相同。

创建[表分组](./table-groups.md)（无论是绘制分组，还是通过 `Group selected tables` 或先按 `T` 再按 `G` 为选中的表分组）连同其纳入的每个表算一步。删除分组算一步，对其执行 Undo 时，分组会连同其中的表一起恢复。  
拖动分组的标题栏会在一步中移动该分组及其中所有的表。如果在最后一次移动后约 `200ms` 内松开，被拖入或拖出分组的表会在其拖动的同一步中改变所属分组，因此一次 Undo 就能让它们回到原来的位置和原来所在的分组。如果松开前停顿得更久，分组的变化会单独算一步，第一次 Undo 只会撤回这一变化。  
通过边缘或角调整分组大小时，只在松开时记录一次。  
应用[自动布局](./table-related-functions.md#auto-layout)算一步，它为贴合各自的表而调整的分组也包含在内。

[查找与替换](./find-and-replace.md#replacing)中的 `Replace All` 同样只算一步，无论它修改了多少表名、列名、逻辑名、索引名、表分组名称、注释和备注，由逻辑名生成的物理名和域关联也包含在内。没有修改任何内容时（例如 `Preserve Case` 把每个匹配项都按原样写回时），它不会记录任何一步。  
单次 `Replace` 算一步，逻辑名所生成的内容也包含在这一步中，跳转到下一个匹配项时如果需要滚动，该滚动同样包含在内。如果它把匹配项按原样写回，则只记录这次滚动；没有滚动时，则不记录任何内容。  
只有当匹配项没有显示得足够清楚时，跳转到该匹配项才会滚动画布，参见[跳转的落点](./table-related-functions.md#where-a-jump-lands)。该滚动会像其他视图位置变更一样被记录，因此在匹配项之间移动之后，Undo 会先撤回这些滚动，每一步撤回一次。  
其他落在画布上的跳转也以同样的方式记录其滚动：在资源管理器中选择某一行、选择快速搜索中的结果、选择 Dictionary 标签页 `Checks` 工作表中指明某个表或列的检查项，或点击 Flow 中的外部链接[卡片按钮](./visualization.md#card-buttons)。让视图保持原位的跳转不会记录任何内容。在 `Diff Viewer` 的列表中选择某一行同样不会记录任何内容，因为它只会移动 Diff Viewer 自身的只读两侧。

连续的拖动、画布平移、缩放、捏合或颜色修改会经过约 `200ms` 的缓冲，同样只记录为一条。  
总移动距离不足 `20px` 的拖动不会记录任何移动。只有它造成的分组变化（如果有）会被记录。

在单元格或备注中输入的内容按每次输入记录，而不是按操作记录：每输入一个字符、每次粘贴、输入法组字的每一步都各自是一条记录。  
逻辑名单元格也以同样的方式记录。其编辑器关闭时的逻辑名如果与打开时不同，词典由它生成的物理名会在输入之后再算一步。第一次 Undo 只会撤回该名称以及术语带来的域和数据类型，而保留你输入的逻辑名。没有生成任何内容时，不会再记录其他内容，参见[输入逻辑名](./logical-names.md#writing-a-logical-name)。  
表分组的名称只在按 `Enter` 或离开输入框将其保存时记录一次，因此在刚创建的分组中输入的名称与创建分组是分开的两步。按 `Esc` 或名称未改变时，不会记录任何内容。

## 词典工作表 {#dictionary-sheets}

Dictionary 标签页的 `Domains`、`Words` 和 `Terms` 工作表各自保留独立的历史记录，与图的历史记录分开。在该标签页中所做的每次编辑，都会进入它所写入的行所属工作表的历史记录。与图的历史记录一样，每份历史记录最多保留 `2048` 步，并保存在当前会话的内存中。

- 键盘焦点位于该标签页中时，`Ctrl + Z` (Windows/Linux) 或 `⌘ + Z` (Mac) 会撤回当前显示的工作表的最后一次编辑，`Ctrl + Shift + Z` (Windows/Linux) 或 `⌘ + Shift + Z` (Mac) 则会重做最后一次撤回的编辑。
- 工具栏的 `Undo` 与 `Redo` 作用相同，只有在当前显示的工作表有可撤回或重做的编辑时才会亮起。按下它们时，键盘焦点会留在原处，即网格或搜索输入框中。该标签页没有 `Time Travel`。
- 在不进行任何编辑的 `Checks` 工作表中，按钮保持不亮，按钮和按键都不起作用。
- 单元格编辑处于打开状态，或光标位于该标签页的搜索输入框中时，这些按键会改为对你在其中输入的内容执行 Undo 与 Redo。

这些历史记录永远不会交叉。ERD 标签页中的 Undo 永远不会撤回工作表的编辑，工作表的 Undo 也永远不会撤回其他工作表或图的编辑。切换工作表或标签页时，每个工作表都会保留其历史记录。

以下每项都算其工作表的一步：

- 单元格编辑：在写入时记录一次，而不是按每个输入的字符记录，并且只在值发生改变时记录，参见[编辑单元格](./dictionary.md#editing-cells)。
- 粘贴（包括它所添加的行），以及用 `Delete` 或 `Backspace` 清除选中的单元格，参见[复制与粘贴](./dictionary.md#copying-and-pasting)。
- `Add Row`，以及每次通过顶部栏、网格菜单或按键插入或删除行，无论涉及多少行，参见[添加与删除行](./dictionary.md#adding-and-deleting-rows)。
- 从列表中为术语选择的域，包括 `None`，参见[术语的域](./dictionary.md#a-terms-domain)。
- 一次排序，参见[排序](./dictionary.md#sorting)。
- 通过 `Import CSV` 导入的一个 CSV 文件，无论它添加或更新了多少行。它算该文件所填充的工作表的一步，该标签页随后会显示这个工作表，无论你是从哪个工作表导入的，参见[导入](./dictionary.md#importing)。

没有改变任何内容的写入，例如再次导入同一个文件，或对已按该顺序排列的工作表排序，不会记录任何步骤；被 `Nothing saved: …` 提示拒绝的写入也是如此。为没有 `Physical Name` 的术语填写名称时，由其词根组合出的物理名也属于该次编辑的那一步。

域的新 `Data Type` 算 `Domains` 工作表的一步，它赋予关联到该域的列的类型，以及关系数据类型同步从这些列传递到的类型，也包含在这一步中，参见[域与数据类型](./dictionary.md#domains-and-data-types)。  
对它执行 Undo 或 Redo 时，会重新设置那一刻关联到该域的列的类型，因此此后被你关联到其他域或修改过类型的列会保留其类型。被这一步取消关联的列，例如同步使其脱离了自身所关联的域的外键，只有在它仍未关联、且仍保持这一步留给它的类型时，才会重新关联。

`readonly` 编辑器会隐藏这些按钮，按键也不会撤回或重做任何内容。  
来自协作者和编码智能体的变更同样不会记录在工作表的历史记录中。

词典被替换时，每个工作表的历史记录都会被清空：包括 JSON 文件的 `Import`（无论是你的还是协作者的）、对其执行的 Undo 或 Redo，以及将另一张图加载到编辑器中。Schema SQL、GraphQL、DBML 或 AML 的 `Import` 会保留词典，从而保留每个工作表的历史记录，对其执行 Undo 与 Redo 时也是如此。

## Time Travel

从 ERD 标签页工具栏中 Undo 与 Redo 旁边的 `Time Travel` 按钮打开。  
在图的历史记录中至少有一条记录的变更之前，该按钮不会有任何反应。只读编辑器不显示这个按钮，而变为只读的编辑器会关闭 Time Travel 且不应用它。

Time Travel 会以画布当前显示的滚动位置、缩放级别和[名称显示](./logical-names.md#name-view)打开图的一份独立只读副本，无论 `Viewport` 或 `Name View` 锁定是否开启。  
它只浏览图的历史记录，因此词典工作表的编辑不在其时间点之中。  
拖动滑块，或在滑轨上任意位置点击，即可浏览完整的编辑历史并预览每个时间点。滑块的最左端是第一条记录变更之前的状态，打开时滑块位于当前状态。  
预览不可交互：它会绘制小地图，但无法平移、滚动或编辑，在应用之前实际文档不会发生任何变化。

按 `Apply` 恢复到所选时间点，或按 `Cancel` 或 `Esc` 保持文档不变。

![打开 Time Travel，拖动滑块回溯编辑历史，并应用较早的时间点](/img/demo-time-travel.webp)
