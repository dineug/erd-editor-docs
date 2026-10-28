---
sidebar_position: 7
description: 删除关系、修改关系类型、设置 ON DELETE 与 ON UPDATE 操作、通过映射列将关系映射到已有的列上、读懂连接线的表示法及其绕过表的走线方式、处理 N:M 关系与识别关系，以及了解新外键列会从其键复制哪些内容以及其命名方式。
---

# 编辑关系

关系通过画布右键菜单、画布工具栏、[快速搜索](./quick-search.md#what-the-palette-lists)或快捷键创建，参见[开始编辑](./editing-start.md)。  
本页介绍关系创建之后可以进行的操作、如何通过[映射列](#map-columns)让关系连接到子表中已有的列上，以及关系所添加的外键列如何命名。

## 删除

可通过关系的右键菜单删除。

![通过关系的右键菜单删除 products 与 reviews 之间的关系](/img/demo-relationship-remove.webp)

由于关系不像表或备注那样会被选中，因此没有对应的快捷键：用于删除选中内容的 `Delete` 和 `Backspace` 永远不会单独删除关系，参见[删除表与备注](./table-related-functions.md#删除表与备注)。  
关系还会随它连接的对象一起被删除：删除表会删除与该表相连的所有关系，删除列会删除使用该列的所有关系。

## 修改类型

可通过关系右键菜单中的 `Relationship Type` 修改。  
提供以下四种类型，当前类型会带有勾选标记：

- Zero One
- Zero N
- One Only
- One N

![通过关系的右键菜单将类型从 Zero N 依次改为 One Only 和 One N](/img/demo-relationship-type.webp)

这与创建关系时选择的四种类型相同，每种类型都有各自的快捷键，参见[开始编辑](./editing-start.md)。

## ON DELETE 与 ON UPDATE {#on-delete-and-on-update}

通过关系右键菜单中的 `On Delete` 与 `On Update` 设置，这两项位于 `Relationship Type` 与 `Map Columns` 之间。  
两者提供相同的六个选项，当前选项会带有勾选标记：

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` 不会写出任何子句，因此由数据库自身的默认行为决定。新建的关系，无论是绘制的还是在[映射列](#map-columns)中创建的，两项初始均为 `Not set`，之后选择 `Not set` 即可清除已设置的操作。  
两者互相独立：修改其中一项不会影响另一项。  
连接线会显示已设置的内容，参见[读懂连接线](#reading-a-connector)。  
关系随其连接的表一起被复制粘贴或创建副本时，会保留这两项操作；导入 Schema SQL、DBML 或 AML 时，会带入文件中声明的操作，参见[导入与导出文件](./file-import-export.md)。

![通过关系的右键菜单为 orders 与 order_items 之间的关系设置 ON DELETE CASCADE 和 ON UPDATE RESTRICT，其标签显示为 D:C U:R，再悬停查看这两项设置](/img/demo-referential-actions.webp)

无论使用哪种数据库，所有操作都可以选择。  
所选[数据库](./table-related-functions.md#databases)的 Schema SQL 不会写出的操作，旁边会带有一条淡色的说明，例如 `not in MySQL`。`Not set` 从不带有说明，切换数据库时说明会随之更新。  
带有说明的操作仍会保存在关系上：连接线会显示它，JSON、DBML 和 AML 也会保留它，但该数据库的 Schema SQL 会省略这条子句，因此由数据库的默认行为决定。

[Schema SQL](./schema-sql.md) 会写出以下操作，其余操作则会省略：

| 数据库 | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | 无 |
| PostgreSQL | 全部五种 | 全部五种 |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | 全部五种 | 全部五种 |

Snowflake 的 Schema SQL 还会写出一条注释，列出它省略的每个操作，参见[参照操作](./schema-sql.md#referential-actions)。

Code Generator 的 ORM 目标会写出哪些操作，不仅取决于所选数据库，还取决于目标本身，参见[代码生成](./code-generator.md#on-delete-and-on-update)。

## 映射列 {#map-columns}

映射列会将父表的键与子表的列配对，键的每一列对应一行。  
每一行要么使用子表中已有的列，要么添加一个新的外键列，因此关系可以连接到已经存在的列上。

![从 members 向 orders 绘制 Zero N 关系，选择 Map to existing columns，并将 id 映射到已有的 member_id 列](/img/demo-map-columns.webp)

有两种打开方式：

- 绘制关系时，通过子表旁边的 `Map to existing columns` 打开，参见[创建关系](./editing-start.md#创建关系)。此时 `Map` 会添加一条所绘制类型的关系。
- 通过关系右键菜单中的 `Map Columns` 打开，用于修改已有关系的列。此时 `Save` 会写入修改。只读编辑器不会打开关系右键菜单，因此在那里无法打开映射列。

对话框的副标题会写出两个表和关系类型，例如 `users → posts · One N`。类型在这里只显示而不能修改，要修改请参见[修改类型](#修改类型)。

在整个对话框中，包括各行下方的说明和文字以及对话框关闭时显示的提示，表和列都按[名称显示](./logical-names.md#beyond-the-canvas)的方式命名。  
以下三项保持物理形式：每个数据类型，它始终是列自身的数据类型，而不是其域的名称；`New column: <name>`，它显示新列将获得的名称；以及 `Map` 一开始就填好的各行，它们按名称配对，永远不会按逻辑名配对。

`References` 用于选择关系所指向的键：先是 `Primary Key`，其列按表中的顺序排列，然后是每个标记为 `Unique` 的列对应的 `Unique: <column>`。只有在可选项多于一个时才会显示。  
唯一索引在这里不算作键，本身就是整个主键的 `Unique` 列也不会重复列出。  
选择另一个键会重建各行。一行所选的列只要仍在子表中，该行就会保留这一选择。

在 `Referenced column` 与 `Foreign key column` 两个标题下，每一行显示键的一列及其数据类型，以及一个可与之配对的子表列的列表：

- `Pick a column` 会让该行保持为空。
- `New column: <name>` 会添加一个新的外键列。显示的名称就是该列将得到的名称，命名方式参见[外键列名](#foreign-key-column-names)，编号时会将子表的列以及其他添加新列的行一并考虑在内。名称为空时不提供这一项，例如键没有名称时。
- 子表的每一列，显示为 `<name> (<data type>)`。已被另一行选中的列显示为 `<name> (<data type>) · in use`，并且无法选择，因此不会有两行共用同一列。已被另一条关系使用的列仍然可以选择，因此像共用的 `tenant_id` 这样的列可以服务于多条关系。

使用 `Map` 时，只有当子表中恰好有一列的名称（不区分大小写）与为该行新建的外键列在加上 `_2` 等编号之前的名称相同时，该行一开始才会被填好，例如 `users` 上的 `id` 对应 `users_id`，`member_id` 对应 `member_id`。当 [`Bracket`](./schema-sql.md#database-and-bracket) 为默认的 `None` 时，由带 schema 限定的表名中的表名部分构成的名称也计算在内，因此 `public.users` 上的 `id` 会与 `public.users_id` 或 `users_id` 配对。对于 `Unique` 键，键列自身的名称也计算在内，因此 `vin` 会与 `vin` 配对。其他各行一开始都为 `Pick a column`。  
使用 `Save` 时，每一行一开始都是关系当前使用的列。无论哪种情况，在 `References` 中选择另一个键时，都会按相同的名称填充该键的空行。

当所选列的数据类型与父列赋予外键的数据类型不同时，该行下方会有一条说明指出这一点。  
在[关系数据类型同步](./settings.md#关系数据类型同步)开启且父列设有数据类型时，说明为 `<column> becomes <type>`，即映射将写入的类型。否则说明为 `Types differ: <parent type> and <child type>`，该列保留其原有类型。

存在阻碍时，`Map` 或 `Save` 会保持禁用，各行下方会有一行文字说明原因：

- `Pick a foreign key column for every referenced column`：仍有某一行为空。
- `At least one column must reference a different column`：自引用关系中，每一行选择的都是其自身对应的父列。
- `These columns are already linked by another relationship`：同样这两个表之间的另一条关系连接的恰好就是这些列。
- `<parent> has no key to reference`：使用 `Map` 时，父表既没有主键，也没有 `Unique` 列。

在映射与关系当前的映射不同之前，`Save` 也会保持禁用。  
使用 `Save` 时，某一行的列已离开其所在的表时，该行显示为 `(removed)`。此时请选择子表中的其他列；如果消失的是父列，则在 `References` 中选择一个键。使用 `Map` 时，所选列被删除的行会恢复为 `Pick a column`。

如果关系的父列并不恰好是父表的某个键，打开时会选中 `References` 末尾的一个额外选项 `Current columns (not a key)`，它会保持这些列不变。父表完全没有键时，这是唯一的选项，`References` 不会显示。  
此时出现的 `The referenced columns are not a key of <parent>` 这一行（父表完全没有键时为 `<parent> has no key to reference`）只是一条说明，而不是错误：`Save` 仍然可用，因此可以修改子表的列并保留原有的引用。  
如果关系的两组列无法配对，例如两者长度不同，则会显示 `(invalid)` 行，并且 `Save` 会保持禁用，直到在 `References` 中选择一个键；如果父表没有主键或 `Unique` 列，则需先为其添加一个。

对话框打开期间会跟随图的变化，包括协作者或编码智能体所做的编辑，同时保留已做的选择。  
如果在此期间关系的列或打开时所用的键发生变化，对话框会添加一行 `This relationship changed while the dialog was open`。

`Map` 与 `Save` 写入的内容：

- `Map` 添加的关系的 `On Delete` 与 `On Update` 均为 `Not set`。`Save` 只修改关系的列，使其父表一侧指向在 `References` 中选择的键，并保留其类型以及 ON DELETE 与 ON UPDATE。
- `New column` 行会像绘制关系时一样，在子表末尾添加一列：该列为 `NOT NULL`，以其对应的键命名，并沿用该键的数据类型、默认值、注释、逻辑名和域，参见[识别关系](#识别关系)。
- 所选的列永远不会被重命名，也不会关联到该键的域，其 `Not Null`、主键、`Unique`、默认值、注释和逻辑名也都保持不变。只有在 `Relationship DataType Sync` 开启且父列设有数据类型时，其数据类型才会改变：它会采用父列赋予外键的类型，serial 类型的键与新列一样对应其整数类型，并且该修改会像同步时一样沿着关系继续传递。所有因此修改类型的列，无论是所选的列还是沿着关系传递到的列，只要其新类型与其[域](./dictionary.md#domains-and-data-types)的类型不同，就会取消与该域的关联。
- 映射不再使用的列会保留在子表中，除非仍有另一条关系连接到它，否则它不再被标记为外键。
- 一次 `Map` 或 `Save` 写入的所有内容，包括新列、类型修改和域关联的取消，都只算一步 Undo。

与其他关系一样，关系是否为识别关系、其父表一端如何绘制，都由映射到的子表列决定。映射到子表的主键列会使其立即成为识别关系，映射到允许 `NULL` 的列则会在父表一端绘制圆环，参见[读懂连接线](#reading-a-connector)。  
Schema SQL 中的外键会引用所选择的键，例如 `Unique` 键对应 `REFERENCES vehicle (vin)`。

如果按下 `Map` 或 `Save` 时图中已经存在该映射（因为协作者或编码智能体已抢先完成），则不会写入任何内容。  
如果图已发生变化，导致该映射不再适用，则不会写入任何内容，并会显示 `Couldn't map columns: the diagram changed` 提示。

按 `Cancel`、点击 `x` 按钮、按 `Escape` 或点击对话框外变暗的区域，都会关闭对话框而不写入任何内容。  
变暗的区域覆盖整个编辑器，包括工具栏，已打开的[资源管理器](./explorer.md#dialogs-beside-it)会在其下方保持打开。  
打开快速搜索同样会关闭对话框，离开 ERD 标签页或编辑器变为只读时也是如此。  
`Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 也会关闭对话框，并把光标放到资源管理器[搜索](./find-and-replace.md#opening-and-closing)的查找输入框中；资源管理器处于关闭状态时会将其打开。在过窄、容不下资源管理器的编辑器中，该按键仍会关闭对话框，但会显示一条提示，而不是移动光标，参见[打开与关闭](./explorer.md#opening-and-closing)。  
如果在对话框打开期间其中某个表或该关系被删除，对话框会关闭并显示一条提示，例如 `Map Columns closed: the relationship was removed`。  
对话框打开期间，画布快捷键、Undo 与 Redo 以及复制和粘贴都不起作用。

编码智能体没有与映射列对应的工具。它会在一个 `erd_batch` 中先用 `erd_remove_relationship` 删除关系（该工具会保留其外键列），再用 `erd_link_columns` 在已有的列上重新绘制该关系，以此重新映射关系，参见[工具](../../mcp/tools.md#关系)。

## N:M 关系

由于编辑器基于物理模型，N:M 关系会如下图所示，用一张映射表来表达。

![用 ⌘ + ⌥ + 2 先后从 products 和 tags 向空的 product_tags 表创建关系，依次添加 product_id 和 tag_id](/img/demo-relationship-n-m.webp)

如果映射表中已经有了键列，例如 `product_tags` 上的 `product_id` 和 `tag_id`，请使用 `Map to existing columns` 绘制每条关系并选择这些列，而不是添加新列，参见[映射列](#map-columns)。如果这些列是映射表的主键，每条关系都会立即成为识别关系。

导入 GraphQL、DBML 或 AML 时会自动生成映射表。  
多对多声明会生成名为 `<left>_<right>` 的表，并带有 `Junction table inferred from <left> <-> <right>` 注释，通过识别关系与两侧相连。  
参见[导入与导出文件](./file-import-export.md)。

## 识别关系

通过点击子表或使用 `Create new columns` 创建关系时，父表的每个主键都会以 `NOT NULL` 外键列的形式复制到子表上，因此新建的关系起初是非识别关系。  
复制出的列会沿用该键的数据类型、默认值、注释和逻辑名，但不会沿用 `Unique` 或 `Auto Increment`，其命名方式参见[外键列名](#foreign-key-column-names)。  
serial 类型的键在数据类型上是例外：复制出的列会采用该 serial 所存储的整数类型。在任何数据库下，`smallserial` 和 `serial2` 都对应 `smallint`，`serial4` 对应 `integer`，`bigserial` 和 `serial8` 对应 `bigint`。单独的 `serial` 在 PostgreSQL 下对应 `integer`，在 MySQL 和 MariaDB 下对应 `bigint unsigned`，在其他任何数据库下则仍为 `serial`。  
只有完整的类型名称才算数（不区分大小写），因此 `serial(4)` 会按原样复制。以大写字母写成的类型会得到大写的结果：在 PostgreSQL 下，`SERIAL` 对应 `INTEGER`。已保存的图中类型已为 `serial` 的外键列会保留该类型。  
复制出的列还会关联到该键的[域](./dictionary.md#domains-and-data-types)，前提是复制时 `Domains` 工作表中列有该域，且复制出的列保留了该键的数据类型。因此，serial 类型的键复制出的列若采用了整数类型，就不会关联任何域，而单独的 `serial` 若仍保留为 `serial`，则会关联该域。  
若要使关系成为识别关系，可将子表上的这些外键列设为主键：选中所有这些列后按一次 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，或者在表右键菜单中选择 `Primary Key`，选中两列或更多列时该条目会显示为 `Primary Key on selected columns`，参见[列主键](./table-editing.md#列主键)。

![用 Alt + K 将 product_id 设为主键再取消，连接线随之先变为实线、再变为虚线](/img/demo-identifying-relationship.webp)

编辑器会自动保持该状态同步。  
子表一侧的所有列都是主键时为识别关系，其中任意一列不再是主键时就会变为非识别关系。

## 外键列名 {#foreign-key-column-names}

创建关系时，所添加的每个外键列都会以它所复制的父表键命名：

- 由一个单词组成的键名，例如 `id`、`ID` 或 `uuid`，会在前面加上父表的名称和一个下划线：`products` 上的 `id` 会变为 `products_id`。
- 由多个单词组成的键名，例如 `member_id`、`userId` 或 `UserID`，保持不变。
- 由一个单词组成且与表名相同（不区分大小写）的键名同样保持不变：`currency` 上的 `currency` 仍为 `currency`。仅仅包含表名的键仍会加上前缀：`user` 上的 `username` 会变为 `user_username`。

名称只包含字母和数字、且大小写没有发生切换时，视为一个单词。  
其他任何字符都会将其拆分，因此 `_id`、`order no` 和 `order-no` 都由多个单词组成。  
大小写的切换同样会将其拆分，判断方式与 camelCase 相同：小写字母后跟大写字母（`userId`），两个大写字母后跟小写字母（`IDCard`、`IDs`），或者韩文、假名、汉字等没有大小写之分的文字与有大小写之分的字母相邻（`회원ID`）。  
数字不会拆分单词，因此 `id2` 和 `SHA256` 都是一个单词。以同一种大小写写成的复合词也是一个单词：`members` 上的 `memberid` 会变为 `members_memberid`。

表名除去首尾空格外按原样使用：保留其大小写、中间的空格和点，不会转为单数形式，Code Generator 的 `Table Name Case` 与 `Column Name Case` 也不起作用。键为 `ID` 的 `Users` 会得到 `Users_ID`。  
复合键的每一列都单独命名：键为 (`tenant_id`, `id`) 的 `orders` 会添加 `tenant_id` 和 `orders_id`。

子表中已有的名称（不区分大小写）会加上 `_2`、`_3` 等编号，取第一个未被占用的编号。  
从键为 `id` 的 `users` 向同一张表再创建一条关系时，会添加 `users_id_2`；在键为 `member_id` 的 `members` 上创建自引用关系时，会添加 `member_id_2`。  
同一个复合键的各列之间也按同样的方式编号，并且保持原样的名称优先占位：键为 (`id`, `user_id`) 的 `user` 会为 `user_id` 添加 `user_id`，为 `id` 添加 `user_id_2`。

父表没有名称时，键名保持不变，发生冲突时与其他名称一样加上编号。  
没有名称的键会生成没有名称的外键列。  
这也包括编辑器为没有主键的父表添加的主键，除非在点击子表之前为其命名。

这些名称在创建关系时确定。之后重命名父表或其键，不会随之重命名这些列。  
[映射列](#map-columns)中的 `New column` 行也按相同的规则命名，列表会在选择之前显示每个名称。  
通过导入、粘贴、创建副本或在映射列中与已有的列配对得到的关系，其列已经存在，因此会保留这些列原有的名称。  
编码智能体通过 `erd_add_relationship` 添加关系时，得到的名称、数据类型、逻辑名和域与此相同，参见[工具](../../mcp/tools.md#关系)。

外键列以其对应的键命名，永远不会以它所复制的逻辑名命名，并且其名称算作你自己填写的名称：之后在该列上输入的逻辑名不会改变该名称，除非该名称为空，参见[自行填写的名称](./dictionary.md#names-of-your-own)。  
因此，当复制来的逻辑名与某个提供其他名称的术语匹配时，`Checks` 工作表会将该列列在 [`Physical name mismatch`](./dictionary.md#what-each-check-finds) 下。重新生成其物理名会按词典为其重命名，除非子表中的另一列已经使用了词典所给出的名称（不区分大小写），参见[重新生成物理名](./dictionary.md#derive-physical-names-again)。

## 读懂连接线 {#reading-a-connector}

- 识别关系以实线绘制，非识别关系以虚线绘制。
- 子表一端带有关系类型对应的基数符号：Zero One 为圆环和竖线，Zero N 为圆环和鸦爪，One Only 为两条竖线，One N 为竖线和鸦爪。
- 当任意外键列允许 `NULL` 时，父表一端与 Zero One 相同，为圆环和竖线；当所有外键列均为 `NOT NULL` 时则与 One Only 相同，为两条竖线。
- 鼠标悬停在连接线上时，会同时高亮该连接线以及它在两个表中连接的列。

![依次悬停在三条连接线上，每条都与它连接的列一起点亮](/img/demo-relationship-hover.webp)

设置了 [ON DELETE 或 ON UPDATE](#on-delete-and-on-update) 的关系，会在其子表一端旁边带有一个标签，例如 `D:C U:R`：先是 `D:` 和 ON DELETE 操作，然后是 `U:` 和 ON UPDATE 操作，每一项都只在已设置时显示。  
操作的缩写沿用 erwin 的表示法：`C` 表示 CASCADE，`R` 表示 RESTRICT，`SN` 表示 SET NULL，`SD` 表示 SET DEFAULT，`NA` 表示 NO ACTION。两项都未设置的关系没有标签。  
标签位于远离子表的一侧：连接线从该表的左侧或右侧引出时，标签在线的上方；从顶部或底部引出时，标签在线的右侧，并且不会与基数符号重叠。  
标签以连接线的颜色绘制在一个画布背景色的小方框上，并与其连接线一起点亮。标签绘制在所有连接线之上，因此穿过标签的线会从其下方经过。  
无论所选数据库会写出什么，标签显示的都是保存在关系上的操作，因此在 MySQL 下，ON DELETE SET DEFAULT 仍然显示为 `D:SD`。

悬停在设置了任一操作的连接线上时，还会显示一个提示，逐行写出完整的子句，例如 `ON DELETE CASCADE` 和 `ON UPDATE RESTRICT`。  
即使标签被隐藏，该提示也会出现。

跳转到关系时会将其点亮：在[资源管理器](./explorer.md#going-to-a-row)中选择表的 `Foreign Keys` 文件夹下的行，或在 [Diff Viewer](./table-related-functions.md#going-to-a-change) 中选择外键行，都会以悬停颜色绘制其连接线及其标签。在 Diff Viewer 中，它会在包含该关系的每一侧点亮连接线，因此已添加的外键只点亮当前文档一侧，已删除的外键只点亮保存的文档一侧。  
跳转会单独选中子表及其外键列，单元格焦点位于其中第一列上；关系本身仍然永远不会被选中。视图会移到哪里，参见[跳转的落点](./table-related-functions.md#where-a-jump-lands)。  
下一次在画布上按下鼠标左键或右键时，点亮状态就会解除，无论按下的位置是空白处、表、备注、表分组还是连接线，即使这次按下没有改变选中状态也是如此。在资源管理器中跳转到其他行或搜索匹配项同样会解除点亮；在 Diff Viewer 中跳转到其他行时，该行所跳转到的每一侧上的点亮也会解除。  
用鼠标中键或抓手工具平移不会解除点亮，在资源管理器或 Diff Viewer 中折叠或展开某一行、用 `Escape` 清除选中状态，以及从[快速搜索](./quick-search.md)或 Flow 中的外部链接[卡片按钮](./visualization.md#card-buttons)跳转，也都不会解除点亮。  
点亮状态不会被保存，也不会记录到 Undo 历史记录中，协作者也看不到它。

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，指针也会点亮连接线，取代跳转留下的点亮。停在表上时，它会以悬停颜色点亮该表的每条连接线，直到指针移出该表。  
不移动的点击会让点亮一直保持到下一次这样的点击：点在表上会点亮该表的连接线，点在连接线上会点亮那条连接线，点在其他任何位置则什么也不点亮。在那里拖动会平移画布，并保持点亮状态不变。

通过 `Relationship` 显示选项可以隐藏 ERD 画布上的连接线，通过默认开启的 `Referential Actions` 显示选项则可以只隐藏其标签，参见[表显示选项](./table-related-functions.md#table-view-options)。  
缩放级别在 `70%` 及以下时，表会折叠为名称，此时不绘制标签。  
[导出图片](./file-import-export.md#image)时始终以 100% 绘制，因此无论画布的缩放级别如何都会绘制标签，除非显示选项将其隐藏。关闭 `Background` 时，每个标签背后的方框也是透明的。  
Visualization 标签页的 [Flow 模式](./visualization.md#flow-mode)即使在 `Relationship` 关闭时也会绘制连接线，每条都是一根平滑的灰色实线曲线，端点符号与 ERD 画布相同，因此本页介绍的虚线、标签、提示、跳转后的点亮与正交路径只适用于 ERD 画布。在 Flow 中，从表连接到其自身的关系同样会以曲线绕过右上角，参见[连接线路径](#连接线路径)。

## 连接线路径

连接线按正交方式走线，拐角为圆角。  
路径会绕开挡在途中的表，而不是从表上穿过。如果两端之间所有只有几个拐弯的路径都会穿过某个表（例如在拥挤的图中），连接线会选择拐弯数不限的绕行路线。只有找不到绕行路线时，它才仍会穿过表。  
只要存在彼此正对的一对边，连接线就会从这样的一对边离开它的两个表，并且每一端都会先从其所在的表笔直引出一小段再转弯，因此相距不远、连接线两端对齐的两个表会以一条直线相连，而不会绕行。  
即使相距不到 `40px`，彼此正对的两个表也会保持各自正对的边；两端不对齐时，连接线会在它们之间的空隙中横向错开，而不是从任何一个表的下方穿过。  
从表的同一侧引出的路径会被分到各自独立的通道上，以免相互重叠。  
只会绕开表：连接线可以穿过备注或表分组的框，并且绘制在表分组之上、表和备注之下。

从表连接到其自身的关系会绘制为一条绕过该表右上角的曲线，在父表一端从顶部引出，在子表一端从右侧进入。  
同一张表上的其他自引用关系会依次嵌套在第一条的外侧，因此它们的曲线既不会相互交叉，也不会穿过该表。

没有可配置的项目。  
画布上有任何元素移动或改变大小时，路径都会自动重新计算，因此无需手动调整。  
拖动时，你所移动的表的连接线会跟随它们，而其他每条连接线都保持拖动开始时的路径。松开后，每条因这次移动而改变路径的连接线都会被重新绘制，例如现在要绕过落在途中的表的连接线，或者在某个表离开其路径后变直的连接线。

在相同的名称显示下，每个显示该图的窗口绘制的路径都相同：一直开着、表在其间移动的窗口，刚刚打开该图的窗口，以及协作者的窗口，[导出的图片](./file-import-export.md#image)绘制的也是它们。名称显示之所以重要，是因为它会改变表的宽度，参见[名称显示](./logical-names.md#name-view)。

![将 members 表向下拖动再拖回时，来自 orders 的连接线在从 categories 右侧经过与绕过其左侧之间切换，每个拐角都是圆角](/img/demo-connector-routing.webp)
