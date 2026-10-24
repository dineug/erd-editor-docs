---
sidebar_position: 14
description: 在 Dictionary 标签页中维护图的域、词根和术语，由逻辑名生成物理名，让域决定其列的数据类型，查看 Checks 工作表发现的问题，像在电子表格中一样编辑和排序工作表，并以 CSV 文件导入和导出它们。
---

# 词典

Dictionary 标签页用三个词典保存图的命名标准，每个词典位于一个可以像电子表格一样编辑的工作表中：

- `Domains`：有名称的数据类型，例如表示 `VARCHAR(100)` 的 `Name`。关联到域的列会采用该域的数据类型。
- `Words`：构成逻辑名的标准词根，每个词根都带有物理名中代表它的缩写，例如 `Customer` 与 `CUST`。
- `Terms`：完整的逻辑名，每个都带有它所给出的物理名和域，例如 `Customer Name` 对应 `CUST_NM`。

表或列的[逻辑名](./logical-names.md)会根据这些词典生成其物理名，列的术语还可以将该列关联到域，参见[生成物理名](#deriving-physical-names)。  
第四个工作表 `Checks` 列出词典在图的名称和类型中以及在词典自身中发现的问题，例如逻辑名中的禁用词，参见 [Checks 工作表](#the-checks-sheet)。

## 打开标签页 {#opening-the-tab}

在工具栏中切换到 `Dictionary` 标签页，即位于 `Code Generator` 与 `Settings` 之间、带书本图标的按钮，或者在[快速搜索](./quick-search.md)的 `Tab` 下选择 `Dictionary`。  
也可以让图打开时就显示此标签页，参见[锁定](./settings.md#锁定)中的 `Canvas Type`。

在你选择其他工作表之前，此标签页打开时显示 `Domains` 工作表。  
每次打开时，工作表都会恢复你离开时的选中范围和滚动位置；首次打开时则选中其第一个单元格。其网格会获得键盘焦点，因此输入或方向键会立即生效。

当前显示的工作表，以及每个工作表的搜索、选中范围、滚动位置和列宽，都只属于你自己。  
这些内容都不会保存到文件中，不会记录到 Undo 历史记录中，也不会与协作者共享。它们在编辑器保持打开期间一直保留，切换标签页以及在同一编辑器中载入其他文档时也不会丢失。

## 工作表 {#the-sheets}

顶部栏中有四个工作表按钮：`Domains`、`Words`、`Terms` 和 `Checks`，当前显示的工作表的按钮呈按下状态。每个按钮在名称旁显示一个计数：其工作表包含的行数，与搜索显示的内容无关；在 `Checks` 上则是检查项的数量，并按其级别着色，参见 [Checks 工作表](#the-checks-sheet)。  
其后是搜索输入框，参见[搜索](#searching)。在 `Domains`、`Words` 和 `Terms` 上（只读编辑器中除外），顶部栏末端还有四个工具：`Add Row`、`Delete Rows`、`Import CSV` 和 `Export CSV`，参见[添加与删除行](#adding-and-deleting-rows)和[导入与导出 CSV](#importing-and-exporting-csv)。  
在较窄的窗格中或使用文字较长的显示语言时，顶部栏会换行显示，因此每个按钮都始终可用。

网格下方的状态行会统计搜索后剩下的行数，例如 `4 rows`；选中范围覆盖任意行时，还会显示它覆盖的行数，例如 `1 selected`。两个区域共有的行只计一次，因此这个数字就是 `Delete Rows` 会删除的行数。  
左侧的行号按工作表显示的顺序从 1 开始为各行编号。只读单元格，即 `Checks` 上的每个单元格和只读编辑器中的每个单元格，以灰色底色绘制，被检查标记的单元格除外。  
空的 `Domains`、`Words` 或 `Terms` 工作表会显示 `Import a CSV file or add a row`，只读编辑器中除外。

各工作表的列依次为：

| 工作表 | 列 |
| --- | --- |
| `Domains` | `Domain`、`Category`、`Data Type`、`Description` |
| `Words` | `Word`、`Abbreviation`、`English Name`、`Description`、`Synonyms`、`Forbidden Words` |
| `Terms` | `Term`、`Physical Name`、`Domain`、`Description`、`Synonyms` |
| `Checks` | `Type`、`Target`、`Detail` |

各单元格的作用：

- 域的 `Data Type` 按列类型的写法填写，例如 `VARCHAR(100)` 或 `NUMERIC(15,2)`，关联到该域的每个列都会采用它，参见[域与数据类型](#domains-and-data-types)。
- 词根的 `Abbreviation` 是物理名中代表该词根的写法，参见[由词根组合](#from-the-words)。
- 词根的 `Synonyms` 和 `Forbidden Words` 列出表示同一事物的其他词，以逗号分隔。每一项都会去除首尾空格，空项会被丢弃，与该词根本身相同的项会被忽略。使用了其中某一项的逻辑名不会组合出物理名，`Checks` 工作表会将其标出，并给出应当改用的词根，参见[各项检查发现的问题](#what-each-check-finds)。
- 术语的 `Term` 是一个完整的逻辑名，其 `Physical Name` 是该逻辑名所给出的名称，参见[由术语生成](#from-a-term)。
- 术语的 `Domain` 显示它所关联的域的名称；未关联任何域，或所关联的域已被删除时，该单元格为空，参见[术语的域](#a-terms-domain)。
- `Category`、`English Name`、各个 `Description` 以及术语的 `Synonyms` 都只是说明。它们不会改变任何内容，也没有任何检查会读取它们。

使用[从右到左书写的显示语言](./language-and-theme.md#right-to-left-languages)时，顶部栏、网格菜单和状态行会镜像排列，而工作表和术语的域列表仍保持从左到右。

## 生成物理名 {#deriving-physical-names}

词典可以根据表或列的逻辑名为其给出物理名，即 Schema SQL 和 Code Generator 写出的名称。首先查找 `Term` 与该逻辑名相同的术语；找不到时，则由词根的缩写组合出名称。  
例如，有词根 `Customer` (`CUST`)、`Name` (`NM`)、`Number` (`NO`)、`Order` (`ORD`) 和 `Date` (`DT`)，以及物理名为 `CUST_NO`、域为 `Number`（其数据类型为 `INT`）的术语 `Customer Number` 时：

- 逻辑名 `Customer Number` 会将列命名为 `CUST_NO`，将其关联到 `Number`，并赋予它 `INT` 类型。
- `Order Date` 组合出 `ORD_DT`。
- 逻辑名为 `Customer` 的表会被命名为 `CUST`。

`Words` 工作表和 `Terms` 工作表都为空时，不会生成任何名称。

### 何时生成名称 {#when-a-name-is-derived}

物理名会在写入逻辑名时生成：

- 在画布上，逻辑名单元格的编辑器通过 `Enter`、`Tab`、`Escape` 或点击其他位置关闭，且关闭时的逻辑名与打开时不同时。输入的每个按键只会写入逻辑名，参见[输入逻辑名](./logical-names.md#writing-a-logical-name)。
- 从单元格下方的列表中选择术语时，会立即生成，参见[补全术语名称](./logical-names.md#completing-term-names)。
- 粘贴写入逻辑名单元格时，参见[复制/粘贴列](./table-editing.md#复制粘贴列)。
- [查找与替换](./find-and-replace.md#replacing)替换逻辑名时，无论替换的是一处匹配还是全部匹配。
- 编码智能体设置逻辑名时。

只有当物理名为空或其本身就是生成的名称时，才会生成，参见[自行填写的名称](#names-of-your-own)。  
选择术语、粘贴或替换时，写入的逻辑名及其生成的内容算一步 Undo。在画布上，编辑器关闭时生成的名称是输入之后单独的一步：第一次撤回会还原生成的名称以及术语带来的域和类型，而保留你输入的逻辑名。

之后不会自动重新生成任何名称。词根的新 `Abbreviation`、术语的新 `Physical Name` 或 `Domain`，以及新增的词根或术语，都不会改变已经生成的名称；要更新它们，请使用[重新生成物理名](#derive-physical-names-again)。域的 `Data Type` 是例外：它会立即应用到其列。

### 由术语生成 {#from-a-term}

首先在 `Terms` 工作表中查找 `Term` 与逻辑名相同的术语。首尾空格和 Unicode 组合形式会被忽略，但区分大小写，因此 `customer number` 与 `Customer Number` 不匹配。两个术语同名时，以工作表中靠前的那个为准。

- 术语会给出其 `Physical Name`；该值为空时，则给出由其词根组合出的名称（见下文），前提是能组合出名称。
- 对于列，只要 `Domains` 工作表中有该术语的 `Domain`，术语还会将列关联到该域，从而让列采用该域的数据类型，参见[关联列](#linking-a-column)。即使术语没有给出名称，也是如此。没有域的术语不会取消任何关联。
- 表只会采用术语的物理名。

### 由词根组合 {#from-the-words}

没有匹配的术语时，由词根组合出名称：

1. 逻辑名按空格、`_`、`-`、`·` 和 `/` 切分，任何词根都不会跨越切分处。
2. 每个片段从左向右读取，在每个位置取 `Words` 工作表中列出的最长文本（作为 `Word`、同义词或禁用词），且从不回退。有词根 `가입`、`가입일` 和 `일자` 时，`가입일자` 会读作 `가입일` 和 `자`，`자` 成为未登记的片段；而 `가입 일자` 会读作 `가입` 和 `일자`。区分大小写：`member` 不是词根 `Member`。
3. 物理名由每个词根按原样输入的 `Abbreviation` 用 `_` 连接而成，例如 `ORD_DT`。两个词根同名时，由工作表中靠前的那个给出缩写。没有长度限制，Code Generator 的 `Table Name Case` 和 `Column Name Case` 也不起作用。

要么全部组合成功，要么完全不组合。只要有任何片段是同义词、禁用词或未被任何词根列出的文本，或者某个词根的 `Abbreviation` 为空，就不会组合出名称，物理名保持原样。

### 自行填写的名称 {#names-of-your-own}

只有当物理名为空或其本身就是由词典填写的时，词典才会填写它。编辑器会为每个表和列记住这一状态，但画布上不会显示。

- 你写入的名称会算作自行填写的名称：在名称单元格中输入、用查找与替换替换表名或列名、粘贴覆盖列的名称单元格，以及编码智能体的重命名。之后写入的逻辑名不会改变它，只会写入逻辑名，也不会关联任何域。
- 清空名称会将它交还给词典，因为空名称总会被生成。
- 没有生成任何内容的逻辑名会让物理名及其状态保持原样：空名称仍为空，已生成的名称保持不变，并仍算作由词典生成。
- 新建的表或列名称为空，因此为其写入的第一个逻辑名会生成该名称。关系添加的外键列以其键命名，并算作自行填写的名称，参见[外键列名](./relationship-editing.md#foreign-key-column-names)。
- 通过 Schema SQL、GraphQL、DBML 或 AML 的 `Import` 或 `Import and Add` 带入的名称，以及由 Dictionary 标签页出现之前的版本创建的图中的名称，都算作自行填写的名称，因此之后为它们写入的逻辑名不会生成任何内容。
- [表的副本](./table-related-functions.md#创建表与备注的副本)、通过拖动手柄[移到另一个表中](./table-editing.md#调整与移动列)的列、粘贴复制的表，以及 JSON 文件的 `Import and Add`，都会保留每个名称的状态。作为新列粘贴到选中表中的列算作自行填写的名称，除非粘贴的名称为空且其逻辑名生成了名称。
- [重新生成物理名](#derive-physical-names-again)会将自行填写的名称交还给词典，导入的名称也包括在内。

### 两列同名 {#two-columns-one-name}

如果列所在表中的另一个列已经拥有它将要生成的名称，该列不会生成任何内容。它会保留其名称、状态和域关联，只写入逻辑名。名称比较时忽略大小写和首尾空格，与外键列名的比较方式相同。  
当一次更改会让两个列得到相同的名称时（对一个表执行 `Replace All` 或 `Derive Physical Names Again` 就可能如此），由表中靠前的列获得该名称。  
例如，以 `MBR_NO` 为键的 `members` 上的自引用会添加 `MBR_NO_2`，它复制了逻辑名 `Member Number`。`Derive Physical Names Again` 会将其命名为 `MBR_NO`，但该名称已由键占用，因此它保留 `MBR_NO_2`。  
表没有这样的规则：两个表可以生成相同的名称。

## 重新生成物理名 {#derive-physical-names-again}

更改词根的 `Abbreviation` 或术语的 `Physical Name` 或 `Domain` 后，请使用 `Derive Physical Names Again`，因为这些更改本身不会重命名任何内容。它会将其涵盖的名称交还给词典，并按上述规则重新生成，你自己写入的名称也包括在内。它只在 ERD 标签页中提供，只读编辑器中不提供：

- 表的右键菜单，紧接在 `Focus on this table` 或 `Focus on selected tables` 之后。该表是两个或更多选中表之一时，无论右键点击表的哪个位置，`Derive Physical Names Again` 都会涵盖所有选中的表。否则，右键点击列所在的行会提供仅针对该列的 `Derive Physical Name Again`，右键点击表头则会提供针对表名和每个列的 `Derive Physical Names Again`。
- 画布右键菜单，紧接在 `Name View` 之后：`Derive Physical Names Again`，针对图中的每个表和列。图中没有表时，不会列出该条目。
- [快速搜索](./quick-search.md#what-the-palette-lists)，其中分别有针对焦点所在的列、焦点所在的表、选中的表和整张图的行。

![在 Words 工作表中将 Number 的缩写从 NO 改为 NUM，图上的物理名仍为 MBR_NO 和 PAY_NO，随后通过画布菜单中的 Derive Physical Names Again 将它们改为 MBR_NUM 和 PAY_NUM，而由其术语给出的 ORD_NO 保持不变](/img/demo-derive-physical-names.webp)

涵盖范围内每个有逻辑名的表和列都会重新生成。列还会采用其术语给出的域，并随之采用该域的类型；[关系数据类型同步](./settings.md#关系数据类型同步)开启期间，该类型会沿关系传播。  
它不会处理没有逻辑名的表或列，以及新名称已被所在表中另一个列占用的列，参见[两列同名](#two-columns-one-name)。这些表和列都会保留其名称和状态（自行填写或由词典生成），列还会保留其域关联。  
此时没有生成任何内容的逻辑名会让物理名保持原样，但会将其交还给词典，因此你下一次写入的逻辑名会生成它。  
无论它更改了多少名称、关联和类型，都算一步 Undo。只有在没有更改任何内容时，它才不会记录任何步骤；将自行填写的名称交还给词典也算作更改，即使该名称已经与词典给出的名称相同。

术语自身的 `Physical Name` 不会根据更改后的词根重新组合，因此请先编辑术语，再重新生成。

## 域与数据类型 {#domains-and-data-types}

关联到域的列会采用该域的 `Data Type`。关联列时，列会立即获得该类型。  
域的 `Data Type` 发生变化时，无论是在 `Domains` 工作表中编辑、粘贴或导入，还是由协作者或编码智能体更改，关联到该域的每个列都会在同一步中采用新类型。[关系数据类型同步](./settings.md#关系数据类型同步)开启期间，这些更改都会像输入的类型更改一样沿关系继续传播；关闭期间，只有已关联的列会改变。  
重命名域只会改变各列域单元格中显示的名称。

在 `Domains` 工作表中进行的类型更改会在该工作表中撤回，它赋予各列的类型也会一并撤回，参见[词典工作表](./undo-redo.md#dictionary-sheets)。  
在 ERD 标签页中，如果撤回或重做将列重新关联到域，或者恢复了一个关联到域的列，该列会获得该域当前的类型。如果撤回或重做恢复的是其他类型，则会取消该列的关联。

### 关联列 {#linking-a-column}

以下方式会将列关联到域：

- 在列的域单元格（由 View Option → `Domain` 显示）中选择该域，或者在 `Logical Names` 下，在代替它的类型单元格中选择，参见[域单元格](./logical-names.md#the-domain-cell)。
- 其术语给出域的逻辑名，参见[由术语生成](#from-a-term)。这只会在名称被生成时发生，因此不适用于自行填写的名称，也不适用于生成的名称已被另一个列占用的列。
- `Derive Physical Name Again` 或 `Derive Physical Names Again`，它会关联涵盖范围内每个列的术语所给出的域。
- 关系：外键列会复制其键的域，以及键的类型和逻辑名，参见[识别关系](./relationship-editing.md#识别关系)。如果键的副本得到的是其他类型（例如 serial 类型的键），则不会传递域。
- 为其所在的表创建副本，或通过拖动手柄将其移到另一个表中，这两种操作都会保留关联。粘贴复制的表或列时，只有当此图中有该域且该域仍为所复制列的类型时，才会保留关联，因此从另一张图复制的内容粘贴后没有关联，参见[复制/粘贴表与备注](./table-related-functions.md#copyingpasting-tables-and-memos)。`Import and Add` 不会关联任何列。
- 粘贴到域单元格中的域的名称，参见[复制/粘贴列](./table-editing.md#复制粘贴列)。

### 取消关联 {#unlinking}

- 在已关联列的 `DataType` 单元格中输入类型或采用推荐项时，只要其类型与域的类型不同，就会取消该列的关联，列保留你输入的类型，参见 [DataType 自动补全](./table-editing.md#datatype-自动补全)。重新输入域的类型不会恢复关联；请改为在其域单元格中选择该域。粘贴覆盖 `DataType` 单元格以及编码智能体更改类型时，也会以同样的方式取消关联。
- 关系数据类型同步开启期间，类型更改所波及的每个列，只要其新类型与其自身所关联域的类型不同，都会在同一步中取消关联，例如关联到自己的域的外键。[映射列](./relationship-editing.md#map-columns)也会以同样的方式取消其更改类型的列的关联。
- 在域单元格中选择 `None` 会取消列的关联并保留其类型。
- 更改或清空术语的 `Domain`，或删除术语，都不会改变任何列。

### 删除域 {#removing-a-domain}

删除域所在的行后，其列保持各自的类型，关联也会保留。这些列不显示任何域；只要 `Domains` 工作表中仍有域，`Checks` 工作表就会为其中每个列列出 `Unknown domain`。在 `Domains` 工作表中撤回删除后，这些关联会重新显示。  
域被删除期间，在这样的列中输入与该域不同的类型会永久取消其关联，在其域单元格中选择 `None` 也是如此。  
保存文件时不会包含这些关联，因此重新打开图时，这些列没有关联。

关联到已删除域的术语会显示空的 `Domain` 单元格，并标记为 `Unknown domain`。在该单元格上按 `Delete` 或 `Backspace` 会取消其关联，参见[术语的域](#a-terms-domain)。

## Checks 工作表 {#the-checks-sheet}

`Checks` 工作表列出词典的检查在词典中以及图的表和列中发现的问题。检查只读取内容：它们不会改变任何内容。  
每项检查只在其读取的工作表中有行时运行，词根检查只在 `Words` 工作表中有带名称的词根时运行，因此词典为空的图不会列出任何内容。

![在 Logical Names 下 Customer Num 以红色、Order Stat 以琥珀色显示，Checks 工作表列出它们的三项检查并显示红色计数，双击 Forbidden word 行跳转回图上的 Customer Num，再将其改写为 Member Number，只剩一项检查](/img/demo-dictionary-checks.webp)

它的三列都是只读的：

- `Type` 是检查的名称，参见[各项检查发现的问题](#what-each-check-finds)。
- `Target` 以名称表示词根、术语或域，以名称表示表，以 `table.column` 表示列，其中表和列的名称按[名称显示](./logical-names.md#beyond-the-canvas)的方式给出，当前显示方式下没有名称的则显示为 `unnamed`。
- `Detail` 显示检查发现的内容，并在 `→` 之后显示词典给出的替代项，多个替代项以逗号连接，例如 `멤버 → 회원`。为空的一侧显示为 `—`，例如 `— → NUMERIC(15)`。

词根的检查排在最前，然后是术语和域的检查，接着逐表列出，每个表之后是其列。  
列表会随每次编辑的生效而更新，包括协作者和编码智能体的编辑，也会随每次名称显示的切换而更新。  
只要有任何检查项是错误，`Checks` 按钮的计数就显示为红色；所有检查项都是警告时显示为琥珀色；没有检查项时以淡色显示。

这些行不能编辑、添加、删除、排序、导入或导出：顶部栏不显示任何工具，右键点击不会打开网格菜单，Undo 与 Redo 不起作用。搜索、选中和复制的方式与其他工作表相同。

在某一行上按 `Enter` 或双击，即可跳转到该行所指的对象：

- 词根、术语或域：标签页会显示其工作表，选中检查所读取的单元格（名称或术语的 `Domain`），并让其行显示在可见区域的最上方。如果工作表的搜索隐藏了该行，搜索会被清除。已被删除的行不会跳转到任何位置。
- 表或列：会切换到 ERD 标签页，只选中该表，并让检查所读取的单元格获得焦点。该单元格是名称、逻辑名或域单元格；如果该行没有绘制该单元格，则是代替它绘制的单元格。画布会获得键盘焦点，视图按[跳转的落点](./table-related-functions.md#where-a-jump-lands)中的规则移动。

双击列标题、列边缘、滚动条或行下方的空白处不会跳转到任何位置。  
编码智能体可以用 `erd_list_checks` 按相同顺序列出相同的检查项，参见[词典检查](../../mcp/tools.md#dictionary-checks)。

其他三个工作表会以浅色底色上的红色或琥珀色文字标记检查所读取的单元格（名称或术语的 `Domain`）：

- 红色：与所在工作表中另一行相同的名称、关联到已删除域的术语 `Domain`，以及使用了禁用词的 `Term`。
- 琥珀色：使用了同义词或未登记词根的 `Term`。

单元格采用其各级别中较高的级别。只读编辑器中也会显示这些标记，`Checks` 工作表本身则不着色。关于 ERD 画布上的标记，参见[画布上的标记](#marks-on-the-canvas)。

### 各项检查发现的问题 {#what-each-check-finds}

| `Type` | 级别 | 发现的问题 | `Detail` 示例 |
| --- | --- | --- | --- |
| `Duplicate name` | 错误 | 同一工作表中另一行也有的 `Word`、`Term` 或 `Domain`。每一行都会列出。 | `Member` |
| `Unknown domain` | 错误 | `Domains` 工作表中有域时，仍关联到已删除域的列或术语 | 已删除域的名称 |
| `Forbidden word` | 错误 | 逻辑名或 `Term` 中被某个词根列在其 `Forbidden Words` 中的片段 | `커스터머 → 고객` |
| `Unregistered word` | 警告 | 表或列的逻辑名中，或 `Term` 中，未被任何词根列出的片段 | `자` |
| `Synonym` | 警告 | 被某个词根列在其 `Synonyms` 中的片段 | `멤버 → 회원` |
| `Physical name mismatch` | 警告 | 逻辑名与某个术语匹配，但物理名不是该术语给出的名称的表或列 | `mbr_no → MBR_NO` |
| `Domain type mismatch` | 警告 | `DataType` 不是其所关联域的 `Data Type` 的列 | `INT → NUMERIC(15)` |

- 名称在去除首尾空格后进行比较，并区分大小写，因此 `Member` 和 `member` 是两个名称，空名称永远不算重复。工作表会拒绝让两行同名的编辑，因此只有在两次编辑交错时（例如两个协作者同时为行命名），或在别处编辑过的文件中，才会出现 `Duplicate name`。
- 词根检查按[由词根组合](#from-the-words)中的方式读取名称，每个名称中的每个不同片段只列出一次。`Forbidden word` 和 `Synonym` 会给出列出该片段的词根。
- `Physical name mismatch` 将去除首尾空格后的名称与术语的 `Physical Name` 进行比较；术语没有 `Physical Name` 时，则与其词根组合出的名称比较；术语没有给出名称时不会报告。复制了其键的逻辑名的外键列，只要其自身名称与术语给出的名称不同，就会显示此检查，例如 `members_id → MBR_ID`。`Derive Physical Name Again` 可以修正它，除非另一个列已占用该名称。
- 在同一个编辑器中进行的编辑永远不会导致 `Domain type mismatch`，因为已关联的列最终总会采用其域的类型。当一个协作者关联某个列而另一个协作者同时更改该域的类型时，或者在其他地方写入的文件中，就可能出现这种情况。在列的域单元格中重新选择该域会让列获得其类型，选择 `None` 则会取消关联。关联到已删除域的情况只会显示为 `Unknown domain`。

### 画布上的标记 {#marks-on-the-canvas}

ERD 画布会用相应检查的颜色绘制被检查标出的名称：

- 逻辑名单元格（位于表头或列所在的行中）在其逻辑名使用了禁用词时显示为红色；否则，在使用了同义词或 `Words` 工作表中没有的词根时显示为琥珀色。
- 物理名单元格（位于表头或行中）在其逻辑名所匹配的术语给出了其他物理名时显示为琥珀色。

只有这两种单元格会被标记，域单元格和 `DataType` 单元格永远不会，因此列的 `Unknown domain` 和 `Domain type mismatch` 只会显示在 `Checks` 工作表中。  
单元格只会因其绘制的内容而被标记：`Physical Names` 只能标记物理名，`Logical Names` 只能标记逻辑名，`Both Names` 则按各单元格自身的检查进行标记，参见[名称显示](./logical-names.md#name-view)。空白单元格保持其占位文字的颜色，词典为空时不会标记任何内容。  
在带颜色的[表分组](./table-groups.md)中，表头上的标记只有在分组颜色上仍清晰可读时才保留其颜色；否则名称会采用表头自身的黑色或白色。

这些标记会显示在 ERD 画布上、[Time Travel](./undo-redo.md#time-travel) 中以及[自动布局](./table-related-functions.md#auto-layout)预览中，只读编辑器中也是如此。Visualization 标签页、[Diff Viewer](./table-related-functions.md#diff-viewer) 的两侧以及导出的图片都不会绘制标记。  
它们会随每次更改即时更新，无论更改的是名称，还是词根、术语或域。

## 搜索 {#searching}

搜索输入框显示 `Search`，出现在全部四个工作表上，只读编辑器中也是如此。每个工作表都有自己的搜索。  
只要被搜索的某个单元格包含该文本，该行就算匹配；比较时忽略大小写、Unicode 组合形式以及搜索内容前后的空格。匹配永远不会跨越两个单元格。被搜索的单元格：

- `Domains`：`Domain`、`Data Type` 和 `Description`。
- `Words`：`Word`、`Abbreviation`、`English Name` 和 `Description`。
- `Terms`：`Term`、`Physical Name` 和 `Description`。
- `Checks`：全部三列，按其在显示语言中的文字进行搜索。

新的搜索会将选中范围移到第一个单元格，并滚动到顶部。  
输入框中有文本时，带有 `Clear search` 提示的 `x` 按钮会将其清空，并让光标留在输入框中。在输入框中按 `Escape` 也会将其清空。  
在输入框中，`Ctrl + Z` (Windows/Linux) 或 `⌘ + Z` (Mac) 撤回的是你的输入，而不是工作表，[添加与删除行](#adding-and-deleting-rows)中的行按键也只作为文本按键。  
`Add Row` 和插入操作会先清除搜索，因为空行不匹配任何搜索。导入则会保留搜索。

## 选中与移动 {#selecting-and-moving}

网格的选中方式与电子表格相同：

- 点击会选中一个单元格，拖动会选中一个区域，拖到工作表边缘时会自动滚动。`Shift + click` 会从活动单元格开始扩展选中范围，`Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac) 会添加另一个区域。
- 点击列标题会选中该列，点击行号会选中该行，点击左上角则会选中所有单元格，与 `Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 的效果相同。
- 在 Mac 上，`Ctrl + click` 相当于右键点击，参见[网格菜单](#the-grids-menu)。

使用键盘时：

- 方向键移动一个单元格；按住 `Ctrl` (Windows/Linux) 或 `⌘` (Mac) 时，则沿该方向移到工作表的边缘。
- `Home` 和 `End` 移到该行的第一个和最后一个单元格；按住 `Ctrl` 或 `⌘` 时，则移到工作表的第一个和最后一个单元格。
- `Page Up` 和 `Page Down` 移动一屏的行。
- 按住 `Shift` 再按上述任意按键，则会改为扩展选中范围。
- `Tab` 和 `Shift + Tab` 向右和向左移动，`Shift + Enter` 向上移动。单独按 `Enter` 会编辑该单元格，参见[编辑单元格](#editing-cells)。

当选中范围所在的行因撤回或协作者的删除而消失时，选中范围会被收回到剩余的行内。

拖动列标题的右边缘即可调整列宽，双击该边缘即可让列宽适应可见行中最宽的文本。没有调整列宽的按键。

## 编辑单元格 {#editing-cells}

在选中的单元格上输入会替换其值。按 `Enter`、`F2` 或双击会在现有值的基础上编辑，光标位于末尾。  
单元格只容纳一行，因此粘贴进来的制表符或换行符会变为空格。

- `Enter` 会写入编辑并向下移动，`Tab` 会写入编辑并向右移动。按住 `Shift` 时，则分别向上或向左移动。
- 点击其他位置，或键盘焦点离开网格，也会写入编辑。
- `Escape` 会取消编辑。

![编辑 Words 工作表：在单元格上输入 NUM 并按 Enter，用 ⌥ + Enter 插入一行并用 Tab 逐格填写，通过网格菜单按 Word 排序，然后搜索 ord 并用 Esc 清空搜索](/img/demo-dictionary-editing.webp)

没有改变值的编辑不会写入任何内容；写入的编辑无论输入了多少内容，都算其工作表的一步。  
没有打开编辑时，`Delete` 或 `Backspace` 会清空每个选中的单元格，算一步。  
打开编辑期间，撤回和重做按键会撤回和重做你在单元格中的输入，行按键则作为文本输入，参见[此标签页中的按键](#keys-on-the-tab)。  
`Checks` 上的每个单元格，以及只读编辑器中的每个单元格，都是只读的，不会打开编辑。

编辑、粘贴或清空中只要有任何一行被拒绝，就不会保存其中的任何内容，并会出现错误提示说明原因，其中会统计行数并列出前三个名称：

- 名称与工作表中另一行的名称相同，或与同一次粘贴写入的另一行的名称相同：`Nothing saved: 1 row shares a name with another row (Member)`，或 `Nothing saved: 2 rows share a name with another row (…)`。名称在去除首尾空格后进行比较，并区分大小写，因此 `Member` 和 `member` 不同。空名称永远不会被拒绝。
- 术语的 `Domain` 填写的文本不是 `Domains` 工作表中任何域的名称：`Nothing saved: 1 row names an unknown domain (…)`。
- 你编辑期间被协作者删除的行：`Nothing saved: the row was removed`。

写入的影响可能超出其单元格：

- 在 `Physical Name` 为空时为术语填写 `Term`，如果其词根能组合出名称，该术语就会得到组合出的名称，参见[由词根组合](#from-the-words)。这只会发生一次：之后词根变化时，不会重新组合该名称。
- 域的新 `Data Type` 会在同一步 Undo 中更改关联到该域的每个列的类型，参见[域与数据类型](#domains-and-data-types)。

### 术语的域 {#a-terms-domain}

在术语的 `Domain` 单元格上按 `Enter`、`F2` 或双击，会在单元格下方打开一个列表（如果上方空间更大，则在上方打开），其中带有显示 `Domain` 的搜索输入框。  
列表中先是 `None`，然后按 `Domains` 工作表中的顺序列出每个有名称的域，高亮最初位于术语所关联的域上，或位于 `None` 上。在单元格上输入一个字符，会打开已按该字符搜索过的列表。

- 输入内容会将列表缩小为名称包含该文本的域（忽略大小写），去掉 `None`，并高亮第一个匹配项。
- `↑` 和 `↓` 移动高亮，到达两端时会循环。
- `Enter` 或 `Tab` 会选择高亮的行，点击则会选择所点击的行，算一步 Undo。术语会关联所选择的那个域，即使它是两个同名域中的一个也是如此；选择 `None` 则会取消关联。
- `Escape` 或点击外部会关闭列表，不会写入任何已输入的内容。

`Domains` 工作表中没有任何有名称的域时，打开的输入框不带列表。  
粘贴的文本会关联列出的第一个同名域，空文本会取消关联，与单元格显示内容相同的文本则保持关联不变。其他任何名称都会被拒绝，参见[编辑单元格](#editing-cells)。在该单元格上按 `Delete` 或 `Backspace` 会取消术语的关联，即使关联的是已删除的域也是如此。

## 复制与粘贴 {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac) 会按电子表格的写法，将选中范围复制为以制表符分隔的文本，每行对应一行文本，因此可以作为单元格粘贴到电子表格中。值中的制表符或换行符会变为空格。  
多个区域只有在左右并排覆盖相同的行，或上下排列覆盖相同的列时，才能一起复制。否则不会复制任何内容，并会出现错误提示 `Nothing copied: the ranges share no rows or columns`。

`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac) 会从活动单元格开始，向下和向右粘贴以制表符分隔的文本，例如从电子表格中复制的单元格：

- 引号会作为文本粘贴，因此包含换行符的电子表格单元格不会粘贴为一个单元格。
- 单个值会填满每个选中的区域。
- 超出最后一行的行会按顺序添加为新行，因此粘贴到空工作表中会将其填满。
- 超出最后一列的列会被舍弃，其余内容保存后，会出现提示 `Columns past the last one weren't pasted` 说明这一点。
- 粘贴多个单元格后，会选中所写入的区块。

一次粘贴算一步 Undo，其添加的行也包括在内；遇到重复名称或未知域时，整个粘贴都会被拒绝，参见[编辑单元格](#editing-cells)。  
对超过一百万个单元格进行复制、粘贴或清空不会产生任何效果，并会出现错误提示 `Nothing done: the selection covers too many cells`。  
剪切，即 `Ctrl + X` (Windows/Linux) 或 `⌘ + X` (Mac)，在工作表上不起作用。此标签页中的复制和粘贴永远不会影响图；打开单元格编辑期间，它们作用于单元格中的文本。

## 添加与删除行 {#adding-and-deleting-rows}

`Add Row` 会在工作表末尾添加一个空行。它会清除搜索，选中新行的第一个单元格，并让网格获得键盘焦点，因此输入的内容会填入该单元格。  
`Delete Rows` 会删除选中范围在任意列中覆盖的每一行，一次撤回即可将它们全部恢复到原位置。其提示会给出具有相同作用的按键。

键盘焦点位于网格中且没有正在编辑的单元格时：

- `Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 会在选中范围下方插入与其覆盖行数相同数量的空行。
- `Alt + Shift + Enter` (Windows/Linux) 或 `⌥ + Shift + Enter` (Mac) 会将它们插入到上方。
- `Alt + Backspace` 或 `Alt + Delete` (Windows/Linux)，或 `⌥ + Backspace` 或 `⌥ + Delete` (Mac)，会删除选中范围覆盖的行。

它们的作用与网格菜单中的插入行和删除行相同，参见[网格菜单](#the-grids-menu)。插入会清除搜索，并将新行放在选中范围所覆盖的第一行正上方，或最后一行正下方。插入后会在第一列中选中这些新行，以其中第一行的单元格作为活动单元格，并算一步 Undo。

这些按键就是[快捷键](./settings.md#快捷键)标签页中 `Add Column` 和 `Remove Column` 的按键绑定，因此用 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) 重新绑定它们的宿主也会一并改变这些按键。`Alt + Shift + Enter` 是加上 `Shift` 的 `Add Column` 按键，在那里没有单独的一行。  
在打开的编辑中和搜索输入框中，它们只作为文本按键，因此在 Mac 上 `⌥ + Backspace` 会删除一个单词。在 `Checks` 上和只读编辑器中，它们不起作用。在此标签页中，它们永远不会添加或删除表的列。  
在 Obsidian 中，即使某个 Obsidian 快捷键使用了相同的按键，它们也会传给此标签页。

从未填写过的行，或所有值都被清空的行，会显示在其工作表中并同步给协作者，但文件不会包含它，因此重新打开图时它就不见了。

## 网格菜单 {#the-grids-menu}

在 `Domains`、`Words` 或 `Terms` 上右键点击单元格即可打开网格菜单。如果该单元格位于选中范围之外，会先将其设为选中范围。  
在最后一行下方或最后一列右侧右键点击时，会针对当前的选中范围打开菜单，因此空工作表在列标题下方的任意位置都能打开它。菜单键或 `Shift + F10` 会针对活动单元格打开菜单。

- `Insert 1 row above`、`Insert 1 row below` 和 `Delete 1 row`，每个条目都会统计选中范围覆盖的行数，例如 `Insert 3 rows above`，并在右侧显示其按键，参见[添加与删除行](#adding-and-deleting-rows)。
- `Sort by <column>, ascending` 和 `Sort by <column>, descending`，其中会给出你右键点击的列，例如 `Sort by Word, ascending`，参见[排序](#sorting)。在最后一列右侧右键点击时，不会列出这两个条目。
- `Import CSV` 和 `Export CSV`，其作用与顶部栏中的按钮相同，参见[导入与导出 CSV](#importing-and-exporting-csv)。

没有显示任何行时，即在空工作表上或搜索没有匹配任何内容时，只显示 `Insert 1 row below`、`Import CSV` 和 `Export CSV`。  
`Checks` 和只读编辑器会改为打开浏览器自身的菜单，在列标题或滚动条上右键点击时也是如此。  
选择条目、按 `Escape`、在标签页的其他位置点按、选中范围或工作表发生变化，以及工作表的行因你或协作者的编辑而发生变化时，菜单都会关闭。

## 排序 {#sorting}

`Sort by <column>, ascending` 和 `Sort by <column>, descending` 会重新排列工作表中的行本身，而不只是改变显示。新的顺序会保存到文件中，协作者也能看到，`Export CSV` 也会按此顺序导出，一次撤回即可恢复原来的顺序。  
各行按单元格显示的文本进行比较（术语的 `Domain` 按域的名称比较），采用显示语言的字母顺序，数字按数值比较，因此 `2` 排在 `10` 之前。无论升序还是降序，空单元格都排在最后，比较结果相同的行保持原有顺序。对已经是该顺序的工作表排序不会记录任何内容。  
搜索保持不变，选中范围也保持不变，只是其中的单元格现在对应其他行。

## 导入与导出 CSV {#importing-and-exporting-csv}

`Domains`、`Words` 和 `Terms` 都可以从 CSV 文件导入，也可以导出为 CSV 文件。这些文件专属于 Dictionary 标签页：画布右键菜单中的 `Import` 和 `Export` 既不读取也不写入它们，参见[导入与导出文件](./file-import-export.md)。

### 导入 {#importing}

顶部栏或网格菜单中的 `Import CSV` 会打开浏览器自身的 `.csv` 文件选择器，而不是宿主的导入对话框。再次选择同一个文件会再次导入它。  
无论当前显示哪个工作表，文件都会导入其标题行所对应的词典，然后标签页会显示该工作表，并让其网格获得键盘焦点。工作表会保留其搜索、选中范围和滚动位置，因此被搜索隐藏的行，或添加在可见区域下方的行，仍然不可见。  
文件按 UTF-8 读取（无论是否带有字节顺序标记）；如果不是有效的 UTF-8，则按 EUC-KR 读取，较旧的公共数据标准文件就是如此。

![从工具栏打开 Dictionary 标签页，然后用 Import CSV 导入域、词根和术语，每个文件都会将标签页切换到其对应的工作表并报告添加的内容](/img/demo-dictionary-import.webp)

各行的导入方式：

- 每个带名称的行都会更新工作表中同名的行，只更新文件中有对应列的字段。文件中没有的列，其字段保持原样。名称在去除首尾空格后进行比较，并区分大小写。
- 工作表中没有的名称会按文件中的顺序添加到其最后一行之后。
- 导入永远不会删除行。
- 名称为空的行会被跳过。文件中同一名称出现两次时，以后面的行为准，前面的行算作跳过。空白行不算作行。
- 术语的域按名称查找，取第一个同名的域；没有任何域使用的名称会让术语保持未关联，因此请先导入域。

一次导入算该工作表的一步。  
随后会出现提示，例如 `1 added · 1 updated · 2 skipped`。与工作表中相同的行既不算添加也不算更新，因此再次导入同一个文件不会改变任何内容，也不会记录任何步骤。  
如果文件中的术语使用了图中没有的域，第二行会列出其中前三个，例如 `4 unknown domains: 연월일, 금액, 번호`。  
标题行不匹配任何格式或同时匹配两种格式的文件不会导入任何内容，并会出现错误提示 `Couldn't read this file as words, terms or domains`。

### 文件格式 {#file-layouts}

每个词典都能读取两种格式。第一种是编辑器自己的格式，即 `Export CSV` 写出的格式，以字段名作为标题行：

| 词典 | 标题行 | 文件必须包含 |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`、`abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`、`physicalName` |
| Domains | `name,category,dataType,description` | `name`、`dataType` |

各列可以按任意顺序排列，术语的 `domain` 填写域的名称，其他任何列都会被忽略。标题行区分大小写，单元格则完全按原样读取，包括空格。

第二种是韩国公共数据标准（공통표준）文件的格式：

| 词典 | 文件必须包含 | 还会读取 |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명`（缩写）、`공통표준단어 영문명`（英文名）、`공통표준단어 설명`（描述）、`이음동의어 목록`（同义词）、`금칙어 목록`（禁用词） |
| Terms | `공통표준용어명` | `공통표준용어영문약어명`（物理名）、`공통표준도메인명`（域，按名称）、`공통표준용어설명`（描述）、`용어 이음동의어 목록`（同义词） |
| Domains | `공통표준도메인명`、`데이터타입` | `공통표준도메인분류명`（分类）、`공통표준도메인설명`（描述）、`데이터길이`、`데이터소수점길이` |

域的 `데이터타입`、`데이터길이` 和 `데이터소수점길이` 会合并为一个数据类型：`NUMERIC(15,2)`、`CHAR(8)`；没有长度时只有类型本身，例如 `DATE`；小数位数为 0 时省略，例如 `NUMERIC(15)`。  
在这些文件中，单元格会去除首尾空格，其他列（例如修订历史）会被忽略。  
在两种格式中，标题行名称中的空格都不影响识别。

### 导出 {#exporting}

顶部栏或网格菜单中的 `Export CSV` 会以编辑器自己的格式保存当前显示的工作表：无论搜索显示什么，都按工作表中的顺序写出每一行，术语的域写为其名称，已删除的域则留空。  
文件采用带字节顺序标记的 UTF-8 和 CRLF 行尾，只有包含引号、逗号或换行符的字段才会加引号。它可以在电子表格中打开，也可以重新导入为相同的行。  
文件命名为 `<database name>-<timestamp>-words.csv`、`-terms.csv` 或 `-domains.csv`，保存方式与编辑器的其他导出相同，参见[导出](./file-import-export.md#exporting)。

`Checks` 没有导出功能，只读编辑器不提供导入或导出。

## Undo 与 Redo {#undo-and-redo}

`Domains`、`Words` 和 `Terms` 各自保留独立于图的 Undo 历史记录。在此标签页中，`Ctrl + Z` 与 `Ctrl + Shift + Z` (Windows/Linux) 或 `⌘ + Z` 与 `⌘ + Shift + Z` (Mac)，以及工具栏中的 `Undo` 和 `Redo`，都作用于当前显示的工作表，工具栏也不显示 `Time Travel`。在 `Checks` 上它们不起作用。  
ERD 标签页的 Undo 永远不会撤回工作表中的编辑，参见[词典工作表](./undo-redo.md#dictionary-sheets)。

## 此标签页中的按键 {#keys-on-the-tab}

键盘焦点位于此标签页中时，以下编辑器快捷键会生效，参见[快捷键](./settings.md#快捷键)：

- `Search`，即 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac)，会打开[快速搜索](./quick-search.md)。
- `Toggle Explorer`，即 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac)，会切换到 ERD 标签页，打开[资源管理器](./explorer.md#opening-and-closing)并定位到其搜索。
- `Undo` 和 `Redo` 作用于当前显示的工作表，参见 [Undo 与 Redo](#undo-and-redo)。
- `Add Column` 和 `Remove Column` 会插入和删除行，参见[添加与删除行](#adding-and-deleting-rows)。

打开单元格编辑期间（包括术语的域列表），`Search` 和 `Toggle Explorer` 不起作用，因此已输入的文本不会丢失。

其他所有编辑器快捷键都留在此标签页中，永远不会传到画布：`Alt + N` (Windows/Linux) 或 `⌥ + N` (Mac) 不会添加表，`Delete` 和 `Backspace` 也不会删除画布上的任何内容。  
网格自身的按键则作用于工作表：`Enter` 编辑单元格，`Delete` 和 `Backspace` 清空选中的单元格，`Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 选中所有单元格，`Escape` 取消编辑、关闭网格菜单或清空搜索输入框。复制、剪切和粘贴同样留在此标签页中，参见[复制与粘贴](#copying-and-pasting)。

## 只读编辑器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，此标签页可以打开并显示每个工作表。  
切换工作表、搜索、选中、滚动、调整列宽和复制都照常可用，在 `Checks` 中按 `Enter` 或双击跳转到检查项所指的对象也是如此。检查的标记同样会显示。

任何单元格都不接受编辑、粘贴或清空，未被检查标记的每个单元格都以只读底色绘制。  
`Add Row`、`Delete Rows`、`Import CSV` 和 `Export CSV` 会被隐藏，行按键不起作用，右键点击会打开浏览器的菜单。空工作表不显示提示文字，工具栏也不显示 `Undo` 或 `Redo`。

## 协作者与文件 {#collaborators-and-the-file}

图的文件按工作表中的顺序（包括排序后的顺序）保存词根、术语和域，不包含没有任何值的行。  
文件还会保存每个表和列的逻辑名、每个物理名是否由词典生成，以及每个列的域关联（仅限仍然存在的域）。检查项和标记都根据这些内容计算得出，永远不会保存。

在[协同编辑会话](../../api/advanced/collaborative-editing.md)中，各编辑器会在彼此的词典编辑生效时看到这些编辑，包括排序和插入。每个编辑器都保留自己的工作表、搜索和选中范围，其工作表的历史记录只包含它自己的编辑。  
对协作者在此期间删除的行进行编辑或粘贴时，不会保存任何内容，并会出现提示 `Nothing saved: the row was removed`。  
Dictionary 标签页出现之前的版本的编辑器保存图时，不会包含其逻辑名、域关联和词典，参见[混用不同版本](../../api/advanced/collaborative-editing.md#mixing-releases)。

Schema SQL、GraphQL、DBML 或 AML 的 `Import` 会保留词典，JSON 的 `Import` 会用文件中的词典替换它们，`Import and Add` 则不会带入任何词典，参见[导入外部文件](./file-import-export.md#导入外部文件)。  
编码智能体通过 MCP 服务器编辑词根、术语和域，设置逻辑名和域，重新生成物理名，并列出检查项，参见[词典](../../mcp/tools.md#dictionaries)和[词典检查](../../mcp/tools.md#dictionary-checks)。它没有用于 CSV 文件的工具。
