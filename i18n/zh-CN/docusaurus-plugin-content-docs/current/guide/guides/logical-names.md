---
sidebar_position: 4
description: 为表和列设置逻辑名，通过名称显示来显示物理名、逻辑名或两者，在输入时补全术语名称，将列关联到域，并了解名称还在哪些地方跟随显示方式。
---

# 逻辑名

表及其每一列除了名称之外，还可以有一个逻辑名。逻辑名是供人阅读的名称，例如 `CUST_NM` 对应的 `Customer Name`。名称本身就是物理名，即 [Schema SQL](./schema-sql.md) 和[代码生成](./code-generator.md)写出的名称。  
名称显示决定 ERD 画布绘制两者中的哪一种：名称、逻辑名，或两者都绘制，参见[名称显示](#name-view)。  
逻辑名还可以为其表或列提供物理名，该物理名由 [Dictionary](./dictionary.md) 标签页上的词根和术语生成，参见[生成物理名](./dictionary.md#deriving-physical-names)。  
列可以关联到域，即保存在 Dictionary 标签页 `Domains` 工作表中的有名称的数据类型，例如代表 `VARCHAR(100)` 的 `Name`，关联后该列就采用该域的数据类型，参见[域单元格](#the-domain-cell)。  
Schema SQL 可以将每个逻辑名写入空注释，参见[将逻辑名作为注释](./schema-sql.md#logical-names-as-comments)。

## 名称显示 {#name-view}

显示方式共有三种，每种以各自的方式绘制表头和行：

- `Physical Names` 是新图的显示方式，不绘制任何逻辑名。表头显示表名，View Option → `Table Comment` 开启时还显示其注释；每一行按[列顺序](./settings.md#adjusting-column-order)显示其单元格。
- `Logical Names` 在每个名称的位置绘制逻辑名：即表头中，以及每一行中 `Name` 在列顺序里所处的位置。行的类型单元格可以代为显示列的域，详见下文。
- `Both Names` 在名称旁边绘制逻辑名。表头依次显示逻辑名、名称和注释；每一行会多出一个 `Logical Name` 单元格，列顺序默认将其放在紧挨 `Name` 之前的位置。

空白的逻辑名（包括仅由空格组成的逻辑名）会显示变暗的替代文字。在 `Logical Names` 中，替代文字是在其位置绘制的名称；若名称也为空白，则为 `table` 或 `column` 占位文字。在 `Both Names` 中，替代文字是 `logical` 占位文字。

在 `Logical Names` 中，关联到 Dictionary 标签页 `Domains` 工作表中某个有名称的域的列，会在其类型单元格中显示该域的名称，而不是其数据类型。其他所有列在该处显示其数据类型。  
View Option → `Domain` 开启期间，域有自己的单元格，类型单元格保持显示数据类型，因此不会有任何一行将域显示两次，参见[域单元格](#the-domain-cell)。

每个表的宽度取决于它在当前显示方式下绘制的单元格，因此切换会调整表的大小并重新排布其连接线。任何表都不会移动。  
缩放级别在 `70%` 及以下时，表会折叠为只显示其名称，参见[缩放](./table-related-functions.md#缩放)。在 `Logical Names` 中显示逻辑名，没有逻辑名时显示变暗的名称。在 `Both Names` 中显示逻辑名，并在其下一行显示名称；没有逻辑名时只显示名称。

词典的检查可以将其标出的逻辑名或名称显示为红色或琥珀色，参见[画布上的标记](./dictionary.md#marks-on-the-canvas)。

## 切换显示方式 {#switching-the-view}

有四个地方可以切换显示方式，每处都会列出 `Physical Names`、`Logical Names` 和 `Both Names`，并勾选当前的显示方式：

- [画布工具栏](./table-related-functions.md#canvas-toolbar)上的 `Name View` 按钮，位于四种关系表示法与禅模式之间。它显示当前显示方式的名称并带有向下箭头，其提示为 `Name View`。点击会在工具栏上方打开列表，选择一项后列表关闭。
- 画布右键菜单中紧跟在 `View Option` 之后的 `Name View`：一个列出三种显示方式的子菜单。选择后菜单保持打开。
- `Flow` 模式下 Visualization 标签页工具栏上的同一列表，位于行显示菜单之后，参见[工具栏](./visualization.md#toolbar)。
- [快速搜索](./quick-search.md#what-the-palette-lists)中紧跟在 `Tab` 之后的 `Name View`，仅在 ERD 标签页的列表中出现。其子菜单打开时，高亮位于当前的显示方式上。

![从画布工具栏将名称显示切换为 Logical Names，再从画布菜单切换为 Both Names，然后切回 Physical Names，其中没有逻辑名的 ordered_at 先变暗显示，随后显示为 logical 占位文字](/img/demo-name-view.webp)

这四处设置的是同一个显示方式。顶部工具栏没有对应的按钮。

切换会保留选中状态，且不会记录到 [Undo 历史记录](./undo-redo.md#what-the-history-records)中。  
如果焦点所在的单元格在新的显示方式下不绘制，焦点会移到在其位置绘制的单元格：名称与逻辑名互相替代，类型与域也是如此。该单元格上打开的单元格编辑器会关闭。开启或关闭 View Option → `Domain` 时，焦点也会以同样的方式移动。  
`Name View` 锁定开启期间（新图中即是如此），切换只会改变你自己的屏幕，文件保留锁定时的显示方式。关闭锁定后，文件会保存你切换到的显示方式，参见[锁定](./settings.md#锁定)。

## 输入逻辑名 {#writing-a-logical-name}

`Physical Names` 不绘制逻辑名，因此切换到 `Logical Names` 或 `Both Names` 即可在画布上输入逻辑名：

- 在 `Logical Names` 中，表头和各行的名称单元格存放的是逻辑名，因此在此显示方式下无法在画布上编辑物理名。
- 在 `Both Names` 中，逻辑名单元格存放逻辑名，名称单元格存放物理名。

逻辑名单元格的编辑方式与其他单元格相同：按 `Enter` 或双击即可开始编辑，参见[编辑表](./table-editing.md)。在空白的逻辑名上打开编辑器时，编辑器会将该单元格原先绘制的内容显示为占位文字：在 `Logical Names` 中是名称，在 `Both Names` 中是 `logical`。  
输入只会写入逻辑名。当编辑器在逻辑名已更改的情况下关闭时（按 `Enter`、`Tab`、`Escape` 或点击其他位置），会由逻辑名生成物理名，这在你的输入之后单独算一步 Undo。你自己填写的物理名会保持原样，参见[生成物理名](./dictionary.md#deriving-physical-names)。

`Tab` 与 `Shift + Tab` 会按顺序遍历当前显示方式所绘制的单元格，参见 [Tab 键](./table-editing.md#tab-键)：

- 在 `Logical Names` 中，先是表头的逻辑名，然后是其注释，再按列顺序依次是每一行的单元格，其中逻辑名位于名称的位置。
- 在 `Both Names` 中，先是表头的逻辑名、名称和注释，再按列顺序依次是每一行的单元格，默认以其 `Logical Name` 单元格为首。

`Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 会添加一列并将焦点移到其行所绘制的第一个单元格。在默认的列顺序下，那就是它的名称单元格，在 `Logical Names` 中即其逻辑名，在 `Both Names` 中则是它的 `Logical Name` 单元格，因此可以从逻辑名开始输入，参见[添加列](./table-editing.md#添加列)。

关系添加的外键列会复制其所引用键的逻辑名和域，以及其类型，参见[识别关系](./relationship-editing.md#识别关系)。  
将列复制到电子表格以及从电子表格粘贴列时，使用的是当前显示方式所绘制的单元格，包括逻辑名单元格和域单元格，参见[复制/粘贴列](./table-editing.md#复制粘贴列)。

## 补全术语名称 {#completing-term-names}

在逻辑名单元格（表头的或行的）中输入时，单元格下方会出现一个列表，列出名称以所输入文本开头的术语，不区分大小写，并忽略文本前的空格。术语是保存在 Dictionary 标签页 `Terms` 工作表中的完整逻辑名，附带它所提供的物理名和域。列表最多显示八个术语，按名称排序，并高亮所输入的文本。没有以该文本开头的术语时，不会显示列表。

![在 Both Names 中用 ⌥ + Enter 添加一列，从其逻辑名下方的术语列表中选择 Order Amount，填入 ORD_AMT、DECIMAL(10,2) 和 Amount 域，然后输入 Order Date，按 Enter 关闭编辑器时由词根生成其名称 ORD_DT](/img/demo-logical-names.webp)

- 起初没有任何高亮项。`↑` 和 `↓` 会移动高亮，到达两端时循环，高亮的术语会显示 `Enter` 键。
- 在高亮的术语上按 `Enter` 会将其名称写为逻辑名并结束编辑。除非物理名是你自己填写的，否则同一步 Undo 会立即由该术语生成物理名，对于列还会赋予该术语的域。没有高亮项时按 `Enter` 会结束编辑并保留你输入的内容。
- 点击某个术语会以同样的方式写入，但编辑器保持打开。
- 列表显示时按 `Escape` 只会关闭列表，再按一次 `Escape` 才会结束编辑。
- `Tab` 会保留所输入的原样文本并移到下一个单元格，编辑器关闭时会由该文本生成物理名。
- 输入法正在组字时，方向键和 `Enter` 归输入法处理。

术语会为表或列提供哪些内容，参见[生成物理名](./dictionary.md#deriving-physical-names)。

## 域单元格 {#the-domain-cell}

View Option → `Domain` 默认关闭，开启后在每种显示方式下都会为每一行添加一个域单元格，位于 `Domain` 在列顺序中所处的位置，默认紧跟在 `DataType` 之后，参见[表显示选项](./table-related-functions.md#table-view-options)。  
该单元格显示列所关联的域的名称；对于未关联到 `Domains` 工作表所列任何域的列，则显示变暗的 `domain` 占位文字。

![开启 View Option → Domain，在 PAY_AMT 的域单元格中输入 amo 缩小列表后选择 Amount，在 Dictionary 标签页中将 Amount 的 Data Type 改为 DECIMAL(12,2)，可见该列随之改变，然后在该列中输入 NUMERIC(12,2)，从而取消关联](/img/demo-domains.webp)

按 `Enter` 或双击会在单元格上方打开一个选择器：一个以该单元格的文本为占位文字的空输入框，其下先是 `None`，然后按工作表中的顺序列出 `Domains` 工作表中每个有名称的域。高亮最初位于已关联的域上，没有时位于 `None` 上。

- 输入后只列出名称包含该文本的域（不区分大小写），不再显示 `None`，并高亮第一个。`↑` 和 `↓` 会移动高亮。
- `Enter` 会关联高亮的域，点击则关联所点击的域。两者都会将该域的数据类型赋予该列，算一步 Undo，并结束编辑。`None` 会取消该列的关联并保留其数据类型。
- 你输入的内容永远不会写入该列。`Domains` 工作表中没有任何有名称的域时不会显示列表，按 `Enter` 会结束编辑而不写入任何内容。

在 `Logical Names` 中且 View Option → `Domain` 关闭时，显示域名称的类型单元格会打开此选择器，显示数据类型的类型单元格则会打开数据类型编辑器，参见 [DataType 自动补全](./table-editing.md#datatype-自动补全)。要为尚未关联域的列关联域，请开启域单元格。  
已关联的列会采用其域的数据类型，并在域的类型更改时随之更改；在其 DataType 单元格中输入其他类型会取消关联，参见[域与数据类型](./dictionary.md#domains-and-data-types)。

## 画布之外 {#beyond-the-canvas}

其他大多数显示表名或列名的地方也会跟随名称显示：

- `Physical Names` 显示名称。
- `Logical Names` 显示逻辑名；逻辑名为空白时显示名称，在能够变暗显示的地方以变暗方式显示。
- `Both Names` 显示逻辑名，并在其后显示名称：在一行文本中以淡色显示，在 Graph 的标签中显示在第二行，在必须用一段文本同时容纳两者的地方则放在括号中，例如 `Member (member)`。没有逻辑名的表或列只显示其名称。

按名称排序的列表，例如资源管理器中的表或快速搜索中的 `#` 行，在每种显示方式下都保持按名称排序，永远不会按逻辑名排序。

跟随显示方式的地方：

- Visualization 标签页中 Flow 的卡片，参见[卡片上的名称](./visualization.md#names-on-the-cards)；以及 Graph 的标签和悬停预览，参见[图的解读](./visualization.md#reading-the-graph)和[悬停预览](./visualization.md#hover-preview)。
- [表属性](./table-related-functions.md#table-properties)：其中的标签，以及 `Indexes` 标签页中的 `Columns` 行和 `Index order` 列表，参见[索引](./table-related-functions.md#indexes)。
- [资源管理器](./explorer.md#the-tree)的表行和列行，以及每个表分组下列出的表。
- 快速搜索中的 `#` 行，参见[搜索图](./quick-search.md#searching-the-diagram)。
- [Diff Viewer](./table-related-functions.md#diff-viewer) 的变更树及其两侧。
- [映射列](./relationship-editing.md#map-columns)，以及绘制关系时 `Create new columns` 可能显示的 `<parent> has no primary key to copy` 提示，参见[创建关系](./editing-start.md#创建关系)。
- 拖动列经过画布空白处时随之移动的行副本，它按每一行的绘制方式显示其名称单元格和类型单元格，参见[调整与移动列](./table-editing.md#调整与移动列)。
- Dictionary 标签页 `Checks` 工作表的 `Target` 列，参见 [Checks 工作表](./dictionary.md#the-checks-sheet)。
- [导出的图片](./file-import-export.md#image)。

少数地方无论显示方式如何都保持显示名称：资源管理器的索引行和外键行、表属性 `Indexes` 标签页中的 `Keys`、映射列中的 `New column: <name>`，以及快速搜索 `@` 或 `:` 行旁边写出的位置。

Diff Viewer、[Time Travel](./undo-redo.md#time-travel)、[自动布局](./table-related-functions.md#auto-layout)的 `Force` 预览以及 `Export image` 对话框，都会在你当前看到的名称显示下打开，无论文件保存的是哪种显示方式。它们在打开期间都保持该显示方式。  
每次自动布局，以及 Schema SQL、GraphQL、DBML 或 AML 的 `Import` 或 `Import and Add`，都会按表在你的显示方式下所占的宽度来放置表。

## 按逻辑名查找 {#finding-by-logical-name}

在每种名称显示下都能找到逻辑名，包括画布不绘制逻辑名的 `Physical Names`：

- [查找与替换](./find-and-replace.md#what-it-searches)将其作为一种文本类型 `Logical names` 进行搜索，表和列都适用，并且搜索首次打开时该项处于开启状态。替换逻辑名会由其生成物理名，与输入逻辑名时相同。
- 在[快速搜索](./quick-search.md#searching-the-diagram)中，`#` 按名称或逻辑名查找表，`@` 按两者之一查找列，按逻辑名匹配的结果旁边会显示 `Logical name`。`@` 中位于 `.` 之前的表部分同样会匹配表的名称或逻辑名。

切换名称显示只会改变结果的命名方式，永远不会改变找到的内容。

## 协作者 {#collaborators}

在[协同编辑会话](../../api/advanced/collaborative-editing.md)中，逻辑名和域关联会像其他任何编辑一样同步到每个编辑器。  
`Name View` 锁定开启期间，每个编辑器各自保留自己的显示方式，切换只在执行切换的编辑器中显示。锁定关闭期间，在任何非只读编辑器中切换都会切换所有编辑器，参见[锁定](./settings.md#锁定)，其中还介绍了开启或关闭锁定对每个编辑器的显示方式有何影响。  
当某个参与者焦点所在的单元格在你的显示方式下不绘制时，其颜色会显示在你的显示方式在该位置绘制的单元格上：`Physical Names` 中的名称单元格会显示在你 `Logical Names` 中的逻辑名单元格上，反之亦然；类型单元格与代替它显示的域也以同样的方式对应。

通过 MCP 服务器工作的编码智能体无论你当前看到的是哪种显示方式，都可以设置逻辑名并关联域，并且没有用于切换名称显示的工具，参见[词典](../../mcp/tools.md#dictionaries)和[设置](../../mcp/tools.md#settings)。

## 只读编辑器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，所有名称显示选择器都可以使用：画布工具栏的 `Name View` 按钮、画布右键菜单和快速搜索中的 `Name View`，以及 Flow 工具栏上的列表。  
无论锁定如何，那里的切换都只会改变该屏幕：文件、协作者和 Undo 历史记录都保持原来的显示方式。编辑器再次变为可写后，所选的显示方式会一直保留在该屏幕上，直到在那里再次切换，或者在锁定关闭时，直到协作者切换它或文档被重新加载。  
在其中无法编辑逻辑名和域，因此不会打开单元格编辑器、术语列表或域选择器，也不会提供 `Derive Physical Name Again` 和 `Derive Physical Names Again` 条目。  
View Option → `Domain` 只在该屏幕上显示或隐藏 Domain 单元格，与那里的所有 [View Option](./table-related-functions.md#table-view-options) 一样，编辑器再次变为可写后，会恢复文档所持有的 View Option。
