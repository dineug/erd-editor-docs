---
sidebar_position: 12
description: Undo 与 Redo、历史记录的内容，以及通过 Time Travel 浏览编辑历史。
---

# Undo, Redo

可以回到之前的编辑状态，也可以前进到之后的状态。  
历史记录最多保留 `2048` 条变更。

- Undo: `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac)

工具栏中同样提供这两个命令，即 `Time Travel` 旁边的 `Undo` 与 `Redo` 按钮。  
只有在存在可 Undo 或 Redo 的内容时按钮才会亮起。`readonly` 编辑器会隐藏这三个按钮，快捷键也不起作用。

Undo 与 Redo 仅在 ERD 标签页生效。在 Visualization、Schema SQL、Code Generator 和 Settings 标签页中不可用。在 Schema SQL 标签页的 `Before tables` 和 `After tables` 输入框中，同样的按键会改为对你在输入框中输入的内容执行 Undo 与 Redo。  
快速搜索、`Table Properties`、`Diff Viewer`、自动布局预览、[`Export image`](./file-import-export.md#image) 对话框、[映射列](./relationship-editing.md#map-columns)或 Time Travel 打开时，快捷键同样不生效。  
[查找与替换](./find-and-replace.md#keys-in-the-panel)或[选色器](./table-related-functions.md#表与备注的颜色设置)打开时，快捷键仍然有效。即使光标位于它们的某个输入框中，例如查找输入框、替换输入框或 `Hex` 输入框，快捷键 Undo 与 Redo 的对象也是图，而不是输入框中的文本。

历史记录保存在当前会话的内存中。它不会存入文档，因此重新打开图时历史记录为空。

![移动表并用 ⌥ + Backspace 删除列后，用 ⌘ + Z 将两者依次 Undo，再用 ⌘ + Shift + Z 将它们 Redo](/img/demo-undo-redo.webp)

## 历史记录的内容 {#what-the-history-records}

会记录以下内容：

- 表与备注：添加、删除、移动、颜色、名称与注释、备注文本与大小。
- 表分组：添加、删除、移动、调整大小、名称、颜色，以及每个表所属的分组。参见[表分组](./table-groups.md)。
- 列：添加、删除、调整顺序，以及所有列选项。
- 关系：添加、删除、类型修改、在[映射列](./relationship-editing.md#map-columns)中设置的列，以及在 `On Delete` 或 `On Update` 中的每一次选择。参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。对删除执行 Undo 时，关系会连同其 ON DELETE 与 ON UPDATE 操作一起恢复。
- 索引及其列。
- 视图位置、缩放级别，以及 `View Option` 开关。
- Schema SQL 标签页的 `Before tables` 和 `After tables` 脚本，每次通过离开输入框而生效的编辑各算一步。参见[前置与后置脚本](./schema-sql.md#before-and-after-scripts)。
- 导入文件，以及通过 [`Import and Add`](./file-import-export.md#import-and-add) 添加文件。

不会记录以下内容：

- 数据库厂商与数据库名称。
- Code Generator 的语言、`Table Name Case` 与 `Column Name Case`。
- 括号类型，无论是在 Schema SQL 标签页还是在 Code Generator 标签页中设置的。
- Schema SQL 标签页中 `Statements`、`Header` 与 `Tables` 的选择，它们属于编辑器窗口。参见[选项面板](./schema-sql.md#options-panel)。
- Settings 标签页中的全部内容，包括 [`Lock`](./settings.md#锁定) 中的各行。
- 主题与显示语言。参见[语言与主题](./language-and-theme.md)。
- 哪个表、备注或分组绘制在其他对象的前面。
- Visualization 标签页中两种模式下的缩放与平移、移动图的节点或 Flow 卡片、`Tidy Up`、行显示，以及聚焦于表。参见 [Flow 从不编辑文档](./visualization.md#flow-never-edits-the-document)。

这些内容的变更无法 Undo。

从其他编辑器到达的变更同样不会被记录，因此 Undo 只会撤回你自己的变更。在[协同编辑会话](../../api/advanced/collaborative-editing.md)中，每个编辑器各自 Undo 自己的变更，而通过 [MCP 服务器](../../mcp/live-and-headless.md#undo)进行编辑的编码智能体则用 `erd_undo` 撤回它自己的变更。

对替换整张图的 `Import` 执行 Undo 时，之前的图会按导入时编辑器所持有的样子恢复，每个[锁定](./settings.md#锁定)的开启或关闭状态以及每个锁定的值也都恢复为当时的样子。  
如果该图锁定了 `Viewport`，视图和缩放会回到锁定的视图，即打开该图时显示的位置，而不是你原先所在的位置。如果该图的 `Viewport` 未锁定，它们会回到你导入时所在的位置。其他锁定的设置，例如当前所在的标签页或 Code Generator 的语言，则保持你屏幕上的样子。  
新建的图中所有锁定都处于开启状态。在导入之前关闭 `Viewport` 的锁定，即可在这类 Undo 之后保留当前视图。导入之后才关闭其锁定，或导入一个自身 `Viewport` 锁定处于关闭状态的 JSON 文件，都不会改变 Undo 带你回到的位置。

## 一次操作一条记录

单次操作触发的全部变更会合并为一条历史记录。  
一次性粘贴多个表与备注，或通过 `Alt + drag` 复制它们，都只需一步即可 Undo。

按一次 `Delete` 或 `Backspace`，或者在右键菜单中选择 `Delete selected` 或 `Delete columns`，都只算一步，无论删除了多少表、备注、表分组或列。  
在多个选中的列上切换主键算一步，无论是通过 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，还是通过表的右键菜单中的 `Primary Key on selected columns`。  
为选中范围设置颜色，或用 `No color` 或 `Remove color` 清除颜色，都只算一步，无论选中了多少表、备注和分组。选择所有选中对象都已具有的颜色不会记录任何一步，在没有任何选中对象带有颜色时使用 `No color` 也是如此。  
[映射列](./relationship-editing.md#map-columns)中的 `Map` 或 `Save` 算一步，它添加的外键列和修改的数据类型也包含在这一步中。  
`Import and Add` 算一步，把添加的内容块带入视野的滚动也包含在这一步中。

创建[表分组](./table-groups.md)（无论是绘制分组还是使用 `Group selected tables`）连同其纳入的每个表算一步。删除分组算一步，对其执行 Undo 时，分组会连同其中的表一起恢复。  
拖动分组的标题栏会在一步中移动该分组及其中所有的表。如果在最后一次移动后约 `200ms` 内松开，被拖入或拖出分组的表会在其拖动的同一步中改变所属分组，因此一次 Undo 就能让它们回到原来的位置和原来所在的分组。如果松开前停顿得更久，分组的变化会单独算一步，第一次 Undo 只会撤回这一变化。  
通过边缘或角调整分组大小时，只在松开时记录一次。  
应用[自动布局](./table-related-functions.md#auto-layout)算一步，它为贴合各自的表而调整的分组也包含在内。

[查找与替换](./find-and-replace.md#replacing)中的 `Replace All` 同样只算一步，无论它修改了多少表名、注释、列名和备注。没有修改任何内容时，它不会记录任何一步。  
单次 `Replace` 算一步，跳转到下一个匹配项时如果需要滚动，该滚动也包含在这一步中。  
跳转到尚未完全显示在面板旁视野中的匹配项时，画布会滚动，该滚动会像其他视图位置变更一样被记录，参见[跳转到匹配项](./find-and-replace.md#going-to-a-match)。在匹配项之间移动之后，Undo 会先撤回这些滚动，每一步撤回一次。

连续的拖动、画布平移、缩放、捏合或颜色修改会经过约 `200ms` 的缓冲，同样只记录为一条。  
总移动距离不足 `20px` 的拖动不会记录任何移动。只有它造成的分组变化（如果有）会被记录。

在单元格或备注中输入的内容按每次输入记录，而不是按操作记录：每输入一个字符、每次粘贴、输入法组字的每一步都各自是一条记录。  
表分组的名称只在按 `Enter` 或离开输入框将其保存时记录一次，因此在刚创建的分组中输入的名称与创建分组是分开的两步。按 `Esc` 或名称未改变时，不会记录任何内容。

## Time Travel

从工具栏中 Undo 与 Redo 旁边的 `Time Travel` 按钮打开。  
在当前会话至少记录一条变更之前，该按钮不会有任何反应。

Time Travel 会以画布当前显示的滚动位置和缩放级别打开图的一份独立只读副本，无论 `Viewport` 锁定是否开启。  
拖动滑块，或在滑轨上任意位置点击，即可浏览完整的编辑历史并预览每个时间点。滑块的最左端是第一条记录变更之前的状态，打开时滑块位于当前状态。  
预览是静止的：它会绘制小地图，但无法平移、滚动或编辑，在应用之前实际文档不会发生任何变化。

按 `Apply` 恢复到所选时间点，或按 `Cancel` 或 `Esc` 保持文档不变。

![打开 Time Travel，拖动滑块回溯编辑历史，并应用较早的时间点](/img/demo-time-travel.webp)
