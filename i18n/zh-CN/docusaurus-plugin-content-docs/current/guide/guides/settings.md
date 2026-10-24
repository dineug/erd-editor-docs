---
sidebar_position: 16
description: 关系数据类型同步与域、注释最大宽度、重新计算表宽度、设置锁定（视图、标签页、代码设置与名称显示）、列显示顺序以及快捷键列表。
---

# 设置

通过工具栏的 `Settings` 按钮打开，也可以在[快速搜索](./quick-search.md)的 `Tab` 中打开。
设置界面由 `Preferences` 和 `Shortcuts` 两个标签页组成，默认先打开 `Preferences`；但从[欢迎界面](./editing-start.md#欢迎界面)的 `Shortcuts` 条目打开时，会打开 `Shortcuts`。

主题和显示语言不在此界面中。它们由工具栏的 `Theme` 和 `Display Language` 按钮打开，参见[语言与主题](./language-and-theme.md)。

## 关系数据类型同步

决定是否同步数据类型。默认开启。
修改某一列的数据类型后，会将该数据类型应用到通过关系连接的所有列，并从两端沿着连接链传递，因此外键不会与其引用的键产生偏差。
从键传到其外键时，serial 类型会以它所存储的整数类型传递，与绘制关系时相同，参见[识别关系](./relationship-editing.md#识别关系)。因此，在 PostgreSQL 下把键改为 `serial` 时，其外键会得到 `integer`，修改再从那里沿着连接链继续向下传递。
从外键反向传到其键时，类型按书写的原样传递，但 serial 类型的键会保留其类型，修改也就此停止。
[映射列](./relationship-editing.md#map-columns)同样遵循此设置：开启时，它映射的每个已有列都会采用其父键赋予外键的类型，并且该修改会如上所述沿着关系继续传递。关闭时，或者键没有数据类型时，该列保留其自身的类型。

[域](./dictionary.md#domains-and-data-types)会把其 `Data Type` 赋予关联到它的列，在该类型改变时和有列关联到它时都是如此。此设置开启时，修改会如上所述从这些列分别沿着关系继续传递；关闭时，只有已关联的列会改变。在这一步中采用了其域的类型的列会保留该类型，即使同步会赋予它其他类型也是如此，例如 serial 类型的键赋予其外键的整数类型。
已关联的列如果被同步或映射列赋予了与其所属域不同的类型，会在同一步中与该域取消关联，参见[取消关联](./dictionary.md#unlinking)。任何列的粘贴都不会沿此设置传递类型，即使是粘贴所关联的域的类型也不会，参见[复制/粘贴列](./table-editing.md#复制粘贴列)。在 Dictionary 标签页的 `Domains` 工作表中粘贴的 `Data Type` 则会沿此设置传递，与对域类型的任何修改相同。

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="关系数据类型同步设置" loading="lazy" />

![将 members.id 改为 BIGINT UNSIGNED 后，通过关系连接的所有 member_id 随之同步](/img/demo-relationship-data-type-sync.webp)

## 注释最大宽度

以像素为单位指定注释列的最大宽度（`60` ~ `200`）。
关闭开关则不再限制，关闭期间输入框不可用。
重新开启时从 `60px` 开始。输入超出范围的值会被调整为最接近的端值。

![开启注释最大宽度并输入 120，回到 ERD 标签页后注释按该宽度截断](/img/demo-settings-comment-width.webp)

## 重新计算表宽度

按 `Sync` 会根据当前文本重新计算所有表和列单元格的宽度，并按照新的尺寸重新绘制关系连接线。
完成后会显示 `Recalculated table width` 提示。
每次加载文档时都会自动重新计算宽度，因此只有在字体或渲染发生变化导致宽度过时时才需要使用。
宽度不会保存到文件中，因此 `Sync` 永远不会改动文件。

## 锁定

`Lock` 列表包含七项设置。某项设置的锁定开启期间，文件会保留锁定时的值，因此在屏幕上更改该设置不会改动文件。

| 行 | 文件保留的内容 | 新建的图中 |
| --- | --- | --- |
| `Viewport` | ERD 画布的缩放级别和视图位置，两者共用一个锁定 | `100% · 0, 0` |
| `Canvas Type` | 图打开时所在的标签页：`ERD`、`Visualization`、`Schema SQL`、`Code Generator` 或 `Dictionary` | `ERD` |
| `Language` | [Code Generator](./code-generator.md#语言) 的语言 | `GraphQL` |
| `Table Name Case` | Code Generator 的[表名大小写](./code-generator.md#名称大小写) | `Pascal` |
| `Column Name Case` | Code Generator 的[列名大小写](./code-generator.md#名称大小写) | `Camel` |
| `Bracket Type` | [Schema SQL](./schema-sql.md#database-and-bracket) 标签页以及提供该选项的 [Code Generator](./code-generator.md#bracket) 目标所用的 `Bracket` | `None` |
| `Name View` | 图打开时所用的[名称显示](./logical-names.md#name-view)：`Physical Names`、`Logical Names` 或 `Both Names` | `Physical Names` |

每一行显示一个值和一个锁定按钮，点击该按钮即可开启或关闭这一项锁定。
锁定开启时，按钮显示为闭合的锁，提示为 `Unlock Viewport`（其他各行依此类推），提示为 `Locked value` 的值就是文件保留的值。
锁定关闭时，按钮显示为打开的锁，提示为 `Lock Viewport`，变暗显示、提示为 `Current value` 的值则是该设置当前的状态。
`Viewport` 依次显示缩放和视图位置，例如 `75% · -40, 91`。视图位置是图的 `0, 0` 在屏幕上所处的位置，以像素为单位，一千及以上的坐标会被缩写，例如 `1.2k` 或 `-24k`。

开启锁定时，取的是该设置在那一刻的状态。
锁定开启期间，该设置在屏幕上照常生效：你可以滚动和缩放、切换标签页，通过菜单、选项面板或快速搜索选择其他语言、名称大小写或括号，也可以通过名称显示的任意一个选择器切换名称显示，参见[切换显示方式](./logical-names.md#switching-the-view)。
但文件保留的是锁定的值，该行也一直显示这个值，因此图再次打开时会回到锁定的视图和锁定的标签页，采用锁定的名称显示，并使用锁定的语言、名称大小写和括号。JSON 导出写入的同样是锁定的值。
要保存屏幕上显示的内容，请关闭锁定，此后文件会跟随该设置：`Viewport` 关闭时，图会在你离开时的位置打开。如果想改为锁定一个新的值，例如新的起始视图，请将锁定关闭后再重新开启。
如果文件打开时锁定的视图中看不到图的任何部分，屏幕仍会移到图上，而锁定的值保持不变。
`Canvas Type` 永远不会保留 Settings 标签页。开启它时，锁定的是你最后所在的其他标签页；它关闭期间，该行显示的也是那个标签页。

![解锁 Viewport，滚动并缩放图，再以该行显示的新视图重新锁定](/img/demo-settings-locks.webp)

开启或关闭锁定会改动文件，因为文件中记录着哪些锁定处于开启状态；但与 Settings 标签页中的其他内容一样，它不会记录在 [Undo 历史记录](./undo-redo.md#what-the-history-records)中。无论是否锁定，切换名称显示同样不会被记录。在只读编辑器中，锁定按钮不起作用，而无论锁定状态如何，切换名称显示都只会改变该屏幕上的显示。
其他所有设置都按其当前状态保存：数据库、[`View Option`](./table-related-functions.md#table-view-options) 开关，以及 `Preferences` 标签页中的其余设置。

新建的图（即从零开始的图）中所有锁定都处于开启状态：在 VS Code、Obsidian 或 JetBrains IDE 中打开的空文件（Obsidian 的 `ERD Editor: Create new diagram` 和 `New ERD` 会创建这样的文件）、Web 应用中新建的 schema、通过 Google Drive 的 New 菜单创建的文件，或未赋值的 `<erd-editor>`。
Web 应用通过导入 SQL、DBML、AML 或 GraphQL 文件创建的 schema 或 Google Drive 文件，所有锁定同样处于开启状态。由 JSON 文件创建的则沿用该文件中记录的锁定。
打开的文件会沿用保存时的锁定，每个锁定都保持其锁定的值。
未记录任何锁定的文件，例如由锁定功能出现之前的版本保存或手工编写的文件，打开时所有锁定均为开启：无论保存的视图和标签页是什么，视图都为 `100% · 0, 0`，标签页都为 `ERD`，其语言、名称大小写、括号类型和名称显示则按保存时的值锁定。
由名称显示锁定出现之前的版本保存的文件，会以 `Physical Names` 打开并锁定 `Name View`，即使它记录的其他所有锁定都处于关闭状态。
替换整张图的 `Import` 同样会设置锁定：JSON 文件会带来其中记录的锁定及其所保存的值；SQL、DBML、AML 或 GraphQL 文件则保留你的锁定，但无论是否锁定，都会把视图恢复为 `100% · 0, 0`，参见[导入外部文件](./file-import-export.md#导入外部文件)。对该导入执行 Undo 时，会恢复被它替换的锁定和锁定的值。

被锁定挡在文件之外的变更不算作变更。VS Code 不会将标签页标记为已修改，Obsidian 和 JetBrains IDE 也会让文件保持原样，无论是它们自行保存时还是关闭标签页时。
因此，所有锁定都开启时，在图中四处浏览、切换标签页、尝试其他语言、名称大小写或括号，以及切换名称显示，都永远不会出现在 `git diff` 中。
`Viewport` 关闭时，滚动和缩放会改动文件；`Canvas Type` 关闭时，切换标签页（包括切换到 Settings 标签页）也会改动文件；`Name View` 关闭时，切换名称显示同样会改动文件。
新建的图所对应的空文件会一直保持为空，直到出现第一个文件会保留的变更：一次编辑、对不受任何锁定约束的设置的更改，或开启或关闭某个锁定。
打开图后不做此类变更就关闭，文件会保持原样，无论它是由哪个版本或在哪台机器上写入的。文件只按固定顺序保存图本身的内容，以较旧形式保存的文件会在第一次出现此类变更时以这种形式重写一次，参见[存储形式与运行时值](../../api/advanced/schema.md#存储形式与运行时值)。
在 VS Code 中，通过 `Reopen Editor With...` 以图的形式重新打开的修订版本，例如 Git 修订版本或 Local History 条目，是只读的，永远不会被标记为已修改。
在 Google Drive 中，无论是否锁定，滚动、缩放或切换到其他标签页都不会单独保存。`Viewport` 关闭时，视图只会随其他变更一起写入，因此 Drive 文件打开时的视图位于其上次保存时的位置；`Canvas Type` 关闭时，标签页也是如此。`Name View` 关闭时切换名称显示，会像编辑一样被保存；在它开启期间或在只读编辑器中切换，则永远不会被保存。

在[协同编辑会话](../../api/advanced/collaborative-editing.md)中，开启或关闭锁定会传达到每个编辑器，锁定保留的是开启它的那个编辑器上的值。
关闭 `Language`、某种名称大小写、`Bracket Type` 或 `Name View` 的锁定时，每个编辑器都会得到关闭它的那个编辑器上显示的值，因此它们保存的都是同一个值。关闭 `Viewport` 或 `Canvas Type` 不会移动任何人的视图或标签页。
在其锁定开启期间选择的语言、名称大小写或括号仍会传达到每个编辑器，但 `Name View` 开启期间，名称显示由各个编辑器各自决定：切换只会显示在进行切换的那个编辑器中，开启该锁定也不会改变任何人的显示方式。它关闭期间，在任何非只读编辑器中切换，都会切换所有编辑器。
通过 MCP 服务器工作的编码智能体没有用于锁定或锁定所约束设置的工具，它读取到的锁定的语言、名称大小写或括号类型是文件保留的值。只有它以 `replace` 模式进行的导入会触及它们，与 `Import` 相同，参见[设置](../../mcp/tools.md#settings)和[导入](../../mcp/tools.md#导入)。它的 `erd_list` 和 `erd_read` 的 `snapshot` 格式都不包含名称显示，而且无论使用者正以哪种显示方式查看，它编辑的都是 schema，包括逻辑名。

## 调整列顺序 {#adjusting-column-order}

设置表中列的显示顺序。
拖动行即可移动，整行都可以拖动，并以拖动手柄图标标识。默认顺序下的九行依次为 `Logical Name`、`Name`、`DataType`、`Domain`、`Not Null`、`Unique`、`Auto Increment`、`Default` 和 `Comment`。
`Logical Name` 决定 `Both Names` 下每行绘制的逻辑名单元格的位置。在 `Logical Names` 下，逻辑名改为占据 `Name` 行的位置，而 `Physical Names` 不绘制逻辑名，参见[名称显示](./logical-names.md#name-view)。`Domain` 决定 View Option → `Domain` 所显示的域单元格的位置，参见[域单元格](./logical-names.md#the-domain-cell)。
被[表显示选项](./table-related-functions.md#table-view-options)隐藏或被名称显示略去的单元格仍会在列表中保留位置，因此该顺序适用于实际显示的单元格。
在 `Logical Name` 和 `Domain` 成为行之前就已设置过顺序的图，会把 `Logical Name` 紧挨着放在 `Name` 之前，把 `Domain` 紧挨着放在 `DataType` 之后，无论这两者在其顺序中处于什么位置。
[备用键](./table-related-functions.md#alternate-keys)标记（`AK1.1` 等）不属于这些行。它始终位于行的最后，排在此顺序中最后一个单元格之后。

![向下滚动到 Column Order，将 Comment 行拖到 Name 下方，注释随即显示在列名之后](/img/demo-settings-column-order.webp)

## 快捷键

`Shortcuts` 标签页是一个由 `Command` 与 `Keybinding` 组成的只读表格，列出当前所用平台的按键绑定。

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | 先按 `T` 再按 `G` | 先按 `T` 再按 `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

其中大多数仅在 ERD 标签页生效，并且在快速搜索、表属性、Diff Viewer、自动布局预览、Time Travel、[`Export image`](./file-import-export.md#image) 对话框或 [`Map Columns`](./relationship-editing.md#map-columns) 打开期间不会触发。
`Search`、`Toggle Explorer` 与 `Stop` 是例外。`Search` 可以在任意标签页中开关快速搜索，`Toggle Explorer` 可以在任意标签页中打开[资源管理器](./explorer.md#opening-and-closing)并定位到其搜索，同时切换到 ERD 标签页，`Stop` 则用于关闭快速搜索、表属性、Diff Viewer、自动布局预览、Time Travel、`Export image` 对话框、`Map Columns`、主题构建器、`Display Language` 选择器、选色器、`Name View` 按钮打开的列表以及已打开的右键菜单。
资源管理器在 ERD 标签页中处于打开状态且未被禅模式隐藏时，`Toggle Explorer` 会再次将其关闭，与工具栏中的 `Explorer` 按钮相同。快速搜索、表属性、主题构建器、`Display Language` 选择器、`Export image` 对话框或 `Map Columns` 打开期间，它会改为关闭打开的那一个，并将键盘焦点移到资源管理器的搜索中。
正在编辑单元格、备注或表分组的名称时，`Toggle Explorer` 不起作用。正在编辑 [Dictionary](./dictionary.md) 标签页的单元格时，它和 `Search` 都不起作用，因此在那里输入的文本会被保留。Diff Viewer、自动布局预览或 Time Travel 打开期间，`Toggle Explorer` 会把自己的按键交给浏览器或宿主处理，参见[浏览器的查找栏](./find-and-replace.md#the-browsers-find-bar)。
在 ERD 标签页中，`Stop` 会关闭已打开的单元格或备注编辑器、关闭[表分组](./table-groups.md)的名称编辑器而不重命名该分组，或取消正在绘制的关系或 `New Table Group`，并保持选中状态不变。以上情况都不存在时，它会清除选中状态和单元格焦点，并在同一次按键中关闭已打开的选色器。无论哪种情况，已打开的主题构建器或 `Display Language` 选择器都会在同一次按键中关闭。
在已打开术语列表的逻辑名单元格中，第一次按 `Stop` 只会关闭该列表，参见[补全术语名称](./logical-names.md#completing-term-names)。
资源管理器、主题构建器或 `Display Language` 选择器打开期间，画布上的快捷键仍会照常触发。`Stop` 永远不会关闭资源管理器。关于 `Stop` 和其他按键在资源管理器中的作用，参见[资源管理器中的按键](./explorer.md#keys-in-the-explorer)；关于在选择器中按下的按键，参见[选择语言](./language-and-theme.md#picking-a-language)。
`Delete Selection` 会删除所有选中的表、备注和表分组；当单独选中一个表及其中的部分列，并且缩放级别高于 `70%` 时，则会删除这些列，参见[删除表与备注](./table-related-functions.md#删除表与备注)。`Remove Table, Memo` 同样会删除选中的表分组。
`Add Table Group` 会开始绘制 [`New Table Group`](./table-groups.md#drawing-a-group)，与[画布工具栏](./table-related-functions.md#canvas-toolbar)中的 `New Table Group` 按钮相同，再按一次则会取消绘制。`Group Selected Tables` 是不带修饰键的两次按键：在一秒内先按 `T` 再按 `G`。它会把选中的表放入一个新分组并打开该分组的名称编辑器，与表的右键菜单中的 `Group selected tables` 相同；没有选中任何表时不起作用，参见[为选中的表分组](./table-groups.md#grouping-selected-tables)。在只读编辑器中，以及分组被[隐藏](./table-groups.md#hiding-groups)期间，两者都不起作用。
`Zoom In`、`Zoom Out` 与 `Zoom Reset` 同样可以缩放 [Visualization](./visualization.md#toolbar) 标签页，`Graph` 与 `Flow` 均适用，快速搜索打开期间除外。
在 `Flow` 中，`Undo` 与 `Redo` 会在 Flow 先后缩小到的范围之间后退和前进，与其 `Previous table` 和 `Next table` 按钮相同，快速搜索打开期间除外。它们在那里永远不会撤回图的修改，在 `Graph` 中则不起作用，参见[上一个表与下一个表](./visualization.md#previous-table-and-next-table)。
在 Visualization 标签页中，`Stop` 还会关闭[行显示](./visualization.md#row-display)菜单，并取消仍在进行中的 [Flow 布局](./visualization.md#how-flow-is-placed)；但它不会扩大通过 `Focus on this table` 缩小的视图范围。
`Focus on this table` 会以 `Flow` 打开 Visualization 标签页，范围缩小到选中的表以及与它们相隔一条关系的所有表，没有选中任何表时不起作用，参见[聚焦于表](./visualization.md#focusing-on-tables)。
在 Dictionary 标签页中，`Undo` 与 `Redo` 作用于当前显示的工作表的历史记录，而不是图的历史记录，在 `Checks` 工作表中则不起作用，参见[词典工作表](./undo-redo.md#dictionary-sheets)。在 `Domains`、`Words` 和 `Terms` 工作表中，`Add Column` 会在选中范围下方插入行，在其按键上加上 `Shift` 则会在上方插入，`Remove Column` 会删除选中范围所覆盖的行，参见[添加与删除行](./dictionary.md#adding-and-deleting-rows)。关于此标签页的其他按键，参见[此标签页中的按键](./dictionary.md#keys-on-the-tab)。
`Select All Table, Memo`、`Hand Tool`、`Delete Selection` 与 `Group Selected Tables` 会让位于光标：在编辑单元格或备注，或在文本框（例如资源管理器的查找输入框）中输入时，`Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 选中的是文本，`Space` 输入的是空格，`Delete` 和 `Backspace` 删除的是文本，先按 `T` 再按 `G` 输入的则是这两个字母。
复制与粘贴使用浏览器自身的 `Ctrl + C` 与 `Ctrl + V` (Windows/Linux) 或 `⌘ + C` 与 `⌘ + V` (Mac)，因此不在此列表中，参见[编辑表](./table-editing.md)。

在此标签页中无法更改按键绑定。
嵌入编辑器的宿主可以通过 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) 重新映射，但 `Editing`、`Stop`、`Undo`、`Redo`、`Zoom In`、`Zoom Out` 和 `Zoom Reset` 是固定的。
此时 `Shortcuts` 标签页列出的是宿主的按键绑定：宿主未重新映射的命令保留默认按键，宿主未绑定任何按键的命令则不显示按键。
Dictionary 标签页的行按键跟随 `Add Column` 与 `Remove Column`，因此重新映射其中任意一个，这些按键也会随之改变，参见 [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords)。

在 Obsidian 中，只要该图所在的 Obsidian 标签页处于活动状态，这些按键就会传给编辑器，即使某个 Obsidian 快捷键使用了相同的按键也是如此，例如 `Alt + Enter`、`Ctrl + K` 和 `Ctrl + F` (Windows/Linux) 或 `⌥ + Enter`、`⌘ + K` 和 `⌘ + F` (Mac)。Dictionary 标签页的 `Alt + Shift + Enter` (Windows/Linux) 或 `⌥ + Shift + Enter` (Mac) 也是如此，它不在此列表的任何一行中。在该 Obsidian 标签页中，其他所有 Obsidian 快捷键仍然有效。关于 `Ctrl + F` 或 `⌘ + F`，参见[浏览器的查找栏](./find-and-replace.md#the-browsers-find-bar)。
