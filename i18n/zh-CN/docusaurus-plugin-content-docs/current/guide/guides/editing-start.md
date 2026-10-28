---
sidebar_position: 1
description: 从欢迎界面开始，并通过画布右键菜单、画布工具栏或快捷键创建表、备注、表分组与关系。
---

# 开始编辑

编辑从右键菜单开始。

![右键点击画布，打开 Relationship 子菜单，新建表后再打开该表自身的菜单](/img/demo-context-menu.webp)

在表、备注、表分组或关系上右键则会打开该项自身的菜单。  
在已经选中的表、备注或表分组上右键点击时，整个选中范围都会保留，因此 `Color` 和 `Delete selected` 等条目会作用于所有选中的对象，参见[多选](./table-related-functions.md#多选)。  
只读编辑器不创建任何内容，因此本页所述的内容在那里都不提供：画布菜单只保留 `View Option`、`Name View`、`Export` 和 `Diff Viewer`，表的菜单只保留 `Table Properties`，备注、表分组或关系都不会打开菜单，参见[只读编辑器](./table-related-functions.md#read-only-editors)。

## 欢迎界面

在 Web 应用、Google Drive、VS Code、Obsidian 和 JetBrains IDE 中，空白的图打开时，ERD 画布上会覆盖一层欢迎界面。在自有页面中使用的 `<erd-editor>` 只有在页面通过 [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen) 启用后才会显示它。  
图中没有任何表、没有显示的备注，也没有显示的表分组时，即视为空白，因此通过 View Option 隐藏的备注和分组不计算在内。图中一出现其中任何一项，欢迎界面就会消失；每当图再次变为空白时，它又会重新出现，例如删除最后一个表之后，或通过 Undo 撤回添加的第一个表之后。  
在只读编辑器中、禅模式下、表属性打开期间，以及 Diff Viewer、自动布局预览或 Time Travel 占据画布期间，都不会显示欢迎界面。

![空白图上的欢迎界面：打开 Import 的格式列表，按 Esc 返回，用 New Table 添加表，再按 ⌘ + Z 让欢迎界面重新出现](/img/demo-welcome-screen.webp)

标题 `Right-click the canvas for every action.` 下方是一个菜单：

- `New Table` 会添加一个表，与 `Alt + N` 相同。
- `New Memo` 会添加一个备注，与 `Alt + M` 相同。备注处于隐藏状态时不显示该条目。
- `Import` 会把菜单换成 `Back` 以及 `json`、`Schema SQL`、`GraphQL`、`DBML` 和 `AML` 这几种格式。选择某种格式后，会要求选择该格式的文件，并将其载入以取代空白的图，参见[导入与导出文件](./file-import-export.md)。`Back` 或 `Escape` 会返回第一级菜单。
- `Command Palette` 会打开[快速搜索](./quick-search.md)，与 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 相同。
- `Shortcuts` 会打开设置，并直接显示其 [`Shortcuts`](./settings.md#快捷键) 标签页。

画布足够宽时，`New Table`、`New Memo` 和 `Command Palette` 会显示其命令当前绑定的按键，宿主重新映射过的按键也是如此。  
某个条目获得键盘焦点后，`↑` 和 `↓` 会在各条目之间移动，到达两端时会循环；`Home` 和 `End` 会跳到第一个和最后一个条目；`Enter` 或 `Space` 会激活获得焦点的条目。其他所有快捷键仍然有效，因此在这里按 `Alt + N` 同样会添加表。  
只有菜单会接收点击：在欢迎界面其他任何位置按下时，操作都会传到画布上，右键点击画布也会照常打开右键菜单。

画布空间足够时，会有手绘箭头指向以下位置：

- 工具栏的 `Search` 按钮：`Search commands and tables`
- `Theme` 和 `Display Language` 按钮：`Pick a theme and a language`；工具栏只显示其中一个按钮时，则为 `Pick a theme` 或 `Pick a language`，参见[语言与主题](./language-and-theme.md)
- 底部的[画布工具栏](./table-related-functions.md#canvas-toolbar)：`Pan, zoom and draw relationships`

[资源管理器](./explorer.md)显示期间，欢迎界面只覆盖其旁边的画布。  
如果箭头所指的工具栏按钮位于资源管理器上方，该箭头不会显示。`Theme` 和 `Display Language` 的箭头只有在这两个按钮都位于资源管理器上方时才不会显示；在此之前，它会指向仍位于画布上方的那一个按钮。  
箭头旁没有空间容纳其文字时，文字会改为显示在箭头下方。

## 创建表

通过右键菜单、[画布工具栏](./table-related-functions.md#canvas-toolbar)中的 `New Table` 按钮或快捷键 `Alt + N` 创建表。

## 创建备注

通过右键菜单、画布工具栏中的 `New Memo` 按钮或快捷键 `Alt + M` 创建备注。  
View Option → `Memos` 关闭期间，备注会被隐藏，任何地方都不会提供 `New Memo`，`Alt + M` 也不会添加备注，参见[表显示选项](./table-related-functions.md#table-view-options)。

备注是画布上的自由文本笔记。在其正文区域点击后即可输入，内容会随文档一起保存。  
`Escape` 会关闭备注编辑器，保留已输入的内容，并让该备注保持选中状态，再按一次 `Escape` 则会清除选中状态。  
拖动边框可调整其大小。标题栏中的 `x` 会在指针位于备注上方时显示，点击即可将其删除。  
右键点击备注打开的是它的菜单，而不是编辑器：其中有 `Color`、`Remove color`（某个选中的对象带有颜色时显示）和 `Delete`（该备注是两个或更多选中对象之一时显示为 `Delete selected`）。选中的备注同样可以用删除表的按键删除，参见[删除表与备注](./table-related-functions.md#删除表与备注)。

![按 Alt + M 添加备注，输入内容后拖动边框调整其大小](/img/demo-memo.webp)

## 创建表分组

表分组是一个容纳表的框，可以为它设置名称和颜色。可以通过以下两种方式之一创建：

- 从右键菜单或快速搜索中选择 `New Table Group`、点击[画布工具栏](./table-related-functions.md#canvas-toolbar)中的 `New Table Group` 按钮，或者按 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac)，然后在画布上拖出一个框。中心位于框内的每个表都会加入新的分组，已属于其他分组的表除外，参见[绘制分组](./table-groups.md#drawing-a-group)。
- 选中若干表，然后在表的右键菜单中选择 `Group selected tables` 或在快速搜索中选择 `Group Selected Tables`，也可以先按 `T` 再按 `G`，参见[为选中的表分组](./table-groups.md#grouping-selected-tables)。

命名、着色、移动、调整大小等其他操作，参见[表分组](./table-groups.md)。

## 创建关系

通过右键菜单、画布底部的[画布工具栏](./table-related-functions.md#canvas-toolbar)或快捷键创建关系。每种关系类型都有各自的快捷键：

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) 或 `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) 或 `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) 或 `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) 或 `⌘ + ⌥ + 4` (Mac)

选定某种类型后光标会随之变化。先点击父表，再点击子表。  
若父表没有主键，则会为其添加主键；父表的每个主键列都会在子表上对应生成一个 `Not Null` 外键列，其数据类型、默认值、注释、[逻辑名](./logical-names.md)和[域](./dictionary.md#domains-and-data-types)均与该主键列相同。  
serial 类型的键是例外：它的外键会采用该 serial 所存储的整数类型，例如 `serial4` 对应 `integer`，此时不关联任何域，参见[识别关系](./relationship-editing.md#识别关系)。  
每个外键列都以其对应的键命名：像 `id` 这样由一个单词组成的名称会在前面加上父表的名称（`user_id`），像 `member_id` 这样由多个单词组成的名称保持不变，子表中已有的名称则会加上编号（`user_id_2`），参见[外键列名](./relationship-editing.md#foreign-key-column-names)。  
对同一张表点击两次会绘制自引用关系。  
新建关系的 `On Delete` 与 `On Update` 起初均为 `Not set`，可通过该关系的右键菜单修改，参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
按 `Escape` 或再次按下相同的快捷键即可取消。取消后选中状态保持不变，再按一次 `Escape` 才会将其清除。

选定父表之后，将指针指向关系可以连接到的表时，该表会显示轮廓，旁边还会出现两个按钮：

- `Create new columns`（`+`）会使用新的外键列绘制关系，与点击该表相同。
- `Map to existing columns`（链接图标）会结束绘制，并为这两个表打开[映射列](./relationship-editing.md#map-columns)，使关系可以使用子表中已有的列。在按下 `Map` 之前不会写入任何内容。

指针从点击父表的位置移开一小段距离后，父表旁也会显示这两个按钮，因此自引用关系同样可以映射到已有的列上。  
手指无法悬停，因此用手指绘制时这两个按钮永远不会出现，轻点子表会立即绘制关系；触控笔则与鼠标一样会显示它们。  
如果指向子表时父表已经失去了主键，例如因为 Undo 或协作者的编辑，`Create new columns` 会变暗并显示提示 `<parent> has no primary key to copy`，此时点击子表会结束绘制，而不会绘制任何关系。  
该提示按[名称显示](./logical-names.md#beyond-the-canvas)来命名父表。

![用 ⌘ + ⌥ + 4 创建 One N 关系，再从画布工具栏创建 Zero N 关系，子表显示轮廓，旁边带有 Map to existing columns 和 Create new columns 按钮](/img/demo-relationship.webp)

## 创建表与备注的副本

现有的表与备注可以通过复制、粘贴以及按住 `Alt` 拖动来生成副本，参见[表相关功能](./table-related-functions.md#copyingpasting-tables-and-memos)。
