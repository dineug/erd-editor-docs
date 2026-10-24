---
sidebar_position: 3
description: 添加、选择、调整顺序与删除列，切换列选项，以及复制粘贴列。
---

# 编辑表

表编辑基本上提供与 Excel 相似的编辑体验。  
[名称显示](./logical-names.md#name-view)决定表在其表头和行中绘制名称、逻辑名还是两者。  
按 `Enter` 或双击单元格进入编辑模式。  
按 `Enter` 或 `Escape` 结束编辑模式。输入的内容会在输入的同时生效，因此 `Escape` 会保留文本，而不是将其还原。[域单元格](./logical-names.md#the-domain-cell)是例外：它只能从其列表中选择，永远不会保留你输入的内容。在逻辑名已更改的情况下关闭[逻辑名单元格](./logical-names.md#writing-a-logical-name)时，还可能会填入物理名。  
`Escape` 会保留单元格的焦点和表的选中状态，再按一次 `Escape` 则会将两者一并清除。逻辑名单元格显示其[术语列表](./logical-names.md#completing-term-names)时，第一次按 `Escape` 只会关闭该列表。  
输入法仍在组字时，`Escape` 不会结束编辑模式。

![使用 Alt + N 添加表并填写两列](/img/demo-table-edit.webp)

## 添加列

使用快捷键 `Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 创建。  
会向所有已选中的表添加一列。

## Tab 键

按 `Tab` 可直接进入下一个单元格的编辑模式。  
在最后一个单元格按 `Tab` 会创建新的列。  
使用 `Shift + Tab` 移动到上一个单元格的编辑模式。  
`Tab` 与 `Shift + Tab` 会按顺序经过表所绘制的单元格，因此逻辑名单元格和域单元格是否在其中，取决于名称显示和 View Option → `Domain`，参见[输入逻辑名](./logical-names.md#writing-a-logical-name)。  
绘制在行的最后一个单元格之后的[备用键](./table-related-functions.md#alternate-keys)标记不是单元格，因此键盘焦点会跳过它们，它们也不会进入编辑模式。

![用 Tab 在单元格间移动，在最后一个单元格添加列，再用 Shift + Tab 返回](/img/demo-table-tab.webp)

## DataType 自动补全

进入 `DataType` 单元格的编辑模式并开始输入，编辑器会推荐所选数据库中匹配的类型，并高亮推荐项中与输入内容完全一致的部分。  
匹配本身是模糊匹配，因此输入 `vch` 也能找到 `VARCHAR`。

- `Arrow Up` 或 `Arrow Down`：在推荐项之间移动
- `Arrow Right`、`Tab` 或 `Enter`：采用当前高亮的推荐项
- `Arrow Left`：回到已输入的文本

也可以直接点击推荐项。  
列表一次最多显示十个推荐项，其余的可以滚动查看。  
推荐并非强制，列表之外的类型也可以自由输入，包括 `VARCHAR(255)` 这样带参数的写法。输入的内容一旦超出一个完整的类型名，例如 `VARCHAR(255)` 或 `BIGINT UNSIGNED`，列表就会关闭。  
推荐项跟随所选数据库，更换数据库会改变推荐内容，已有的列保持不变。

在关联到域的列的 `DataType` 单元格中输入或采用推荐项时，一旦该列的类型与域的类型不同，就会取消该列的关联，参见[域与数据类型](./dictionary.md#domains-and-data-types)。  
在 `Logical Names` 中，View Option → `Domain` 关闭期间，关联到有名称的域的列，其类型单元格会显示该域的名称，编辑它时会打开[域选择器](./logical-names.md#the-domain-cell)，而不是这些推荐项。显示数据类型的类型单元格仍按上述方式编辑。

![使用方向键、Tab 和 Enter 从模糊匹配的推荐项中填写 DataType](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

这三个单元格是开关，而不是文本。  
双击该单元格，或在其获得焦点时按 `Enter`，即可切换状态。

Not Null 单元格在设置后显示 `N-N`，未设置时显示 `NULL`。  
`UQ` 和 `AI` 关闭时变暗显示，开启时高亮显示。

![双击切换 Not Null，按 Enter 切换 Unique 与 Auto Increment](/img/demo-column-options.webp)

被[表显示选项](./table-related-functions.md)隐藏的单元格无法切换。

## 多选列

支持以下五种方式：

- `Shift + Arrow Up/Down`：每次扩展一行选中范围
- `Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac)：添加单个列
- `Shift + click`：选中从上一个获得焦点的列开始的范围
- `Ctrl + Shift + click` (Windows/Linux) 或 `⌘ + Shift + click` (Mac)：将该范围添加到选中范围
- `Alt + A` (Windows/Linux) 或 `⌥ + A` (Mac)：全选

![使用 Shift + Arrow Down、Ctrl/⌘ + click、Shift + click 和 Alt + A 选择列](/img/demo-column-select.webp)

要一起移动选中的列，请拖动焦点所在列旁边的手柄，参见[调整与移动列](#调整与移动列)。

表的右键菜单作用于哪些列，由右键点击的列所在的行决定，与按住的修饰键无关。  
在已经选中的行上右键点击时，选中状态保持不变，焦点移到该行；在其他行上右键点击时，只选中该行。这一点适用于行上的任何位置，包括钥匙图标和[备用键](./table-related-functions.md#alternate-keys)标记。  
因此，要像[列主键](#列主键)或[删除列](#删除列)那样通过菜单对多个列进行操作，请右键点击选中的行之一。  
在 Mac 上，`Ctrl + click` 同样会打开菜单，但它会被视为普通点击，因此在单元格上使用时，会在菜单打开之前只选中该行。

## 调整与移动列

列通过其拖动手柄移动，这是一个带有握把纹路的小按钮，位于表左边缘紧外侧、焦点所在行的旁边。  
将焦点移到该列的任意单元格（点击该单元格，或使用方向键或 `Tab`），手柄就会出现在其所在行的旁边。焦点位于表头时，任何行都没有手柄。  
指针移到手柄上之前，手柄以淡色绘制；指针移到其上后会变成手形。仅按下不会产生任何效果：指针移动后拖动才开始，拖动可以将该列移到所在表中的其他位置，或移到另一个表中。  
在表的行上方时，拖动的行会移到相应位置，放下位置周围的行会向两侧滑开，腾出空间。在画布空白处上方，或在有列的表的表头上方时，行的半透明副本会跟随指针移动，并按每一行在当前[名称显示](./logical-names.md#name-view)下的绘制方式显示其名称单元格和类型单元格。  
在表的最后一行正下方放下，即可将列移动到该表的末尾。没有任何列的表，在其上任意位置都可以放下。表左侧紧邻的窄条（即手柄所在的位置）同样算作表的行，因此沿着手柄笔直向下拖动时，指针无需进入表即可调整列的顺序。  
移到另一个表中的列会保留其逻辑名和域。

![将焦点移到一列并把其所在行旁边的手柄拖到新位置，然后把另一列的手柄拖到另一个表中](/img/demo-column-move.webp)

要一次移动多个列，请先[选中这些列](#多选列)，然后拖动焦点所在列旁边的手柄。焦点所在的列是其所在表中两个或更多选中列之一时，手柄会带动所有选中的列；否则只带动它自己所在的列。  
无需按住任何修饰键。在手柄上按住 `Alt` (Windows/Linux) 或 `⌥` (Mac) 时，会像普通拖动一样移动列，不会创建任何副本。

![选中三列，然后将焦点所在列旁边的手柄拖到另一个表中，其他选中的列随之一起移动](/img/demo-column-multi-move.webp)

从列所在的行而不是从其手柄开始的拖动会移动表，与拖动表头相同，参见[移动多个表](./table-related-functions.md#移动多个表)。在行上 `Alt + drag` (Windows/Linux) 或 `⌥ + drag` (Mac) 会创建表的副本，参见[创建表与备注的副本](./table-related-functions.md#创建表与备注的副本)。  
缩放级别在 `70%` 及以下（表只显示名称）时，以及在只读编辑器中，不会绘制手柄，因此在这些情况下无法调整列的顺序。

## 删除列

删除获得焦点的表中选中的列。点击单元格会选中它所在的列，因此点击一个单元格再按 `Delete`，即可删除这一列。  
快捷键：

- `Delete` 或 `Backspace`。当这些列所在的表是唯一选中的对象时，它们会删除选中的列。没有选中任何列（焦点位于表名、[逻辑名](./logical-names.md#name-view)或注释上）、同时还选中了其他对象，或者缩放级别在 `70%` 及以下、表只显示名称时，它们会改为删除整个选中范围，参见[删除表与备注](./table-related-functions.md#删除表与备注)。
- `Alt + Backspace` 或 `Alt + Delete` (Windows/Linux)，`⌥ + Backspace` 或 `⌥ + Delete` (Mac)。即使同时还选中了其他表或备注，它们也会删除获得焦点的表中选中的列。正在编辑单元格时，或缩放级别在 `70%` 及以下时，它们不会删除任何内容。

![使用 Alt + Backspace 删除一列，再删除选中的两列](/img/demo-column-remove.webp)

表的右键菜单也能执行同样的操作。在只选中了该表时，右键点击某一列所在的行，菜单的最后一个条目会显示为 `Delete column`；当该行是两个或更多选中列之一时，则显示为 `Delete columns`。

正在编辑单元格时，`Delete` 和 `Backspace` 只会删除文本。在单元格编辑器之外按住不放时，它们只会删除一次。  
删除之后，焦点会移到原先获得焦点的列上方最近的剩余列。上方没有剩余的列时，即使下方仍有列，焦点也会移到表名上（在 `Logical Names` 中为在其位置绘制的逻辑名），因此下一次按 `Delete` 或 `Backspace` 删除的是表而不是列。  
使用了被删除列的关系与索引会随之一起删除。删除前不会要求确认，整个删除只算一步 Undo。

## 复制/粘贴列

其工作方式类似于基于表格的剪贴板。  
快捷键：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

复制到电子表格、从电子表格粘贴，以及粘贴到焦点位于列单元格的表时，使用表中显示的单元格，并按它们显示的顺序排列，参见[表显示选项](./table-related-functions.md#table-view-options)、[调整列顺序](./settings.md#adjusting-column-order)和[名称显示](./logical-names.md#name-view)。名称显示会改变其中部分单元格的内容：

- 在 `Logical Names` 中，名称所在的单元格存放逻辑名，逻辑名为空白时则为空。View Option → `Domain` 关闭期间，类型单元格在显示域名称时存放列的域的名称，否则存放数据类型。
- 在 `Both Names` 中，`Logical Name` 单元格会在列顺序所安排的位置被复制和粘贴。
- 显示的域单元格存放域的名称；对于不显示域的列则为空。

在编辑器中复制的列，在选中表头时粘贴，或粘贴到其他选中的表中时，会带上所复制列的全部单元格，包括 Unique 与 Auto Increment 等隐藏的单元格，以及它们的逻辑名。  
只有当这张图中列有同一个域（而不只是同名的域），并且该域的类型仍与所复制列的类型相同时，它们才会保留域关联。否则粘贴后它们不关联任何域，并保留复制时的类型。它们的名称算作你自己填写的名称，除非粘贴的名称为空且由逻辑名生成了名称，参见[生成物理名](./dictionary.md#deriving-physical-names)。  
像 `AK1.1` 这样的[备用键](./table-related-functions.md#alternate-keys)标记不是单元格，因此即使它们处于显示状态，复制与粘贴也不会包含它们。

可以从编辑器粘贴到 Excel，也可以从 Excel 粘贴回编辑器。  
单元格的值会按输入的原样复制出去，因此像 `<label>` 或 `a &amp; b` 这样的值会原封不动地进入电子表格或文档。  
电子表格的列按位置而不是按名称对应到显示的单元格，因此电子表格中列的顺序必须与这些单元格的顺序一致。  
对于下列各项，以下任意值都会被视为 true（不区分大小写）：

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

从编辑器复制出去时，AutoIncrement 与 Unique 写为 `TRUE` 或 `FALSE`，Not Null 写为 `NOT NULL` 或 `NULL`。  
Unique 与 Auto Increment 默认隐藏，因此只有显示这两个单元格后才会写出并读取 `TRUE` 与 `FALSE`。

![将四列粘贴到电子表格，标志写为 TRUE/FALSE 与 NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![将电子表格中的三行作为列粘贴到表中，YES、1 和 NOT NULL 视为 true](/img/demo-copy-sheet-column.webp)

粘贴到哪里取决于焦点所在：

- 选中表头时，粘贴的行会作为新列追加到所有选中的表中。
- 焦点位于列单元格时，该表中选中的行以及最后一个选中行下方的行，会按粘贴的行数依次被覆盖，分开选中的行之间的行会被跳过。被覆盖的行在显示的单元格中写入粘贴的值，隐藏的单元格保持不变，剩余的行则作为新列追加。其他选中的表会把粘贴的行作为新列追加。

![复制两列并一次性粘贴到选中的两个表](/img/demo-copy-column-multi.webp)

粘贴的行按以下方式写入逻辑名和域：

- 来自 `Logical Name` 单元格或 `Logical Names` 中名称所在单元格的逻辑名，算作完整输入。列的名称为空或仍是生成的名称时，[词典](./dictionary.md#deriving-physical-names)会由该逻辑名生成物理名，并关联其术语所提供的域，除非该行自身的域单元格关联了一个域。同一行粘贴的名称会被保留，并算作你自己填写的名称。
- 域单元格，或 View Option → `Domain` 关闭期间 `Logical Names` 中的类型单元格，如果图中列有以其文本为名称的域，就会关联该域。其他任何文本或空单元格都不会关联任何域，并会取消该列的关联，即使所关联的域的类型与粘贴的类型相同也是如此。类型单元格中不是任何域名称的文本会被读取为数据类型。在编辑器中复制的行则改为关联复制时所关联的域，并且只有当这张图中列有该域且其类型与复制时相同时才会关联，与新列相同。
- 关联的域会将其数据类型赋予该列，除非该行粘贴了自己的类型。此时类型不同的域不会被关联，该列采用粘贴的类型。
- 在没有域单元格的行中，粘贴的类型会取消该列与类型不同的域之间的关联，与输入该类型时相同。
- 任何粘贴都不会通过[关系数据类型同步](./settings.md#关系数据类型同步)传递类型。

## 复制/粘贴表与备注

当获得焦点的表内没有选中任何列时，相同的快捷键会复制选中的表与备注本身，参见[表相关功能](./table-related-functions.md)。

## 列主键

切换获得焦点的列的主键状态，该列是获得焦点的单元格所属的列。  
当获得焦点的列是两个或更多选中列之一时，切换会作用于所有选中的列：只要其中有任何一列不是主键，它们就会全部设为主键；如果它们已经全部是主键，则会全部取消。选中范围之外的列保持不变。  
通过表的右键菜单或快捷键 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac) 进行操作。切换作用于两列或更多列时，菜单条目会显示为 `Primary Key on selected columns`，而不是 `Primary Key`。  
行中的钥匙图标仅用于显示，点击它不会设置主键。

要将多个列设为一个复合主键，请先[选中这些列](#多选列)，然后按 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，或者右键点击选中的行之一并选择 `Primary Key on selected columns`。每次切换都算一步 Undo。

![使用 Shift + Arrow Down 选中两列，按 ⌥ + K 将两列都设为主键，再按一次将两者都取消](/img/demo-column-pk.webp)
