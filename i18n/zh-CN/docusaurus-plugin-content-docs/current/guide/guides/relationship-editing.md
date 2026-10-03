---
sidebar_position: 5
description: 删除关系、修改关系类型、设置 ON DELETE 与 ON UPDATE 操作、读懂连接线、处理 N:M 关系与识别关系，以及了解新外键列的命名方式。
---

# 编辑关系

关系通过画布右键菜单、画布工具栏、[快速搜索](./quick-search.md#what-the-palette-lists)或快捷键创建，参见[开始编辑](./editing-start.md)。  
本页介绍关系创建之后可以进行的操作，以及关系所添加的外键列如何命名。

## 删除

可通过关系的右键菜单删除。

![通过关系的右键菜单删除 products 与 reviews 之间的关系](/img/demo-relationship-remove.webp)

由于关系不像表或备注那样会被选中，因此没有对应的快捷键。  
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

通过关系右键菜单中的 `On Delete` 与 `On Update` 设置，这两项位于 `Relationship Type` 与 `Delete` 之间。  
两者提供相同的六个选项，当前选项会带有勾选标记：

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` 不会写出任何子句，因此由数据库自身的默认行为决定。新绘制的关系两项均为 `Not set`，之后选择 `Not set` 即可清除已设置的操作。  
两者互相独立：修改其中一项不会影响另一项。  
连接线会显示已设置的内容，参见[读懂连接线](#reading-a-connector)。  
关系随其连接的表一起被复制粘贴或创建副本时，会保留这两项操作；导入 Schema SQL、DBML 或 AML 时，会带入文件中声明的操作，参见[导入与导出文件](./file-import-export.md)。

![通过关系的右键菜单为 orders 与 order_items 之间的关系设置 ON DELETE CASCADE 和 ON UPDATE RESTRICT，再悬停在连接线上查看这两项设置](/img/demo-referential-actions.webp)

无论使用哪种数据库，所有操作都可以选择。  
所选[数据库](./table-related-functions.md#databases)的 Schema SQL 不会写出的操作，旁边会带有一条淡色的说明，例如 `not in MySQL`。`Not set` 从不带有说明，切换数据库时说明会随之更新。  
带有说明的操作仍会保存在关系上：连接线会显示它，JSON、DBML 和 AML 也会保留它，但该数据库的 Schema SQL 会省略这条子句，因此由数据库的默认行为决定。

Schema SQL 会写出以下操作，其余操作则会省略：

| 数据库 | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | 无 |
| PostgreSQL | 全部五种 | 全部五种 |
| Snowflake | 全部五种 | 全部五种 |
| SQLite | 全部五种 | 全部五种 |

代码生成中的 ORM 目标会写出哪些操作，不仅取决于所选的数据库，还取决于目标本身，参见[代码生成](./code-generator.md#on-delete-and-on-update)。

## N:M 关系

由于编辑器基于物理模型，N:M 关系会如下图所示，用一张映射表来表达。

![从 products 和 tags 分别向映射表 product_tags 创建关系](/img/demo-relationship-n-m.webp)

导入 GraphQL、DBML 或 AML 时会自动生成映射表。  
多对多声明会生成名为 `<left>_<right>` 的表，并带有 `Junction table inferred from <left> <-> <right>` 注释，通过识别关系与两侧相连。  
参见[导入与导出文件](./file-import-export.md)。

## 识别关系

创建关系时，父表的每个主键都会以 `NOT NULL` 外键列的形式复制到子表上，因此新建的关系起初是非识别关系。  
复制出的列会沿用该键的数据类型、默认值和注释，但不会沿用 `Unique` 或 `Auto Increment`，其命名方式参见[外键列名](#foreign-key-column-names)。  
若要使其成为识别关系，可通过 `Alt + K` 或表右键菜单中的 `Primary Key`，将子表上的这些外键列设为主键。

![用 Alt + K 将 product_id 设为主键再取消，连接线随之在实线与虚线之间切换](/img/demo-identifying-relationship.webp)

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

表名除去首尾空格外按原样使用：保留其大小写、中间的空格和点，不会转为单数形式，代码生成的 `Table Name Case` 与 `Column Name Case` 也不起作用。键为 `ID` 的 `Users` 会得到 `Users_ID`。  
复合键的每一列都单独命名：键为 (`tenant_id`, `id`) 的 `orders` 会添加 `tenant_id` 和 `orders_id`。

子表中已有的名称（不区分大小写）会加上 `_2`、`_3` 等编号，取第一个未被占用的编号。  
从键为 `id` 的 `users` 向同一张表再创建一条关系时，会添加 `users_id_2`；在键为 `member_id` 的 `members` 上创建自引用关系时，会添加 `member_id_2`。  
同一个复合键的各列之间也按同样的方式编号，并且保持原样的名称优先占位：键为 (`id`, `user_id`) 的 `user` 会为 `user_id` 添加 `user_id`，为 `id` 添加 `user_id_2`。

父表没有名称时，键名保持不变，发生冲突时与其他名称一样加上编号。  
没有名称的键会生成没有名称的外键列。  
这也包括编辑器为没有主键的父表添加的主键，除非在点击子表之前为其命名。

这些名称在创建关系时确定。之后重命名父表或其键，不会随之重命名这些列。  
通过导入、粘贴或创建副本得到的关系，其列已经存在，因此会保留这些列原有的名称。  
编码智能体通过 `erd_add_relationship` 添加关系时，得到的名称与此相同，参见[工具](../../mcp/tools.md#关系)。

## 读懂连接线 {#reading-a-connector}

- 识别关系以实线绘制，非识别关系以虚线绘制。
- 子表一端带有关系类型对应的基数符号：Zero One 为圆环和竖线，Zero N 为圆环和鸦爪，One Only 为两条竖线，One N 为竖线和鸦爪。
- 当任意外键列允许 `NULL` 时，父表一端与 Zero One 相同，为圆环和竖线；当所有外键列均为 `NOT NULL` 时则与 One Only 相同，为两条竖线。
- 鼠标悬停在连接线上时，会同时高亮该连接线以及它在两个表中连接的列。

![依次悬停在三条连接线上，每条都与它连接的列一起高亮](/img/demo-relationship-hover.webp)

设置了 [ON DELETE 或 ON UPDATE](#on-delete-and-on-update) 的关系，会在其子表一端旁边带有一个标签，例如 `D:C U:R`：先是 `D:` 和 ON DELETE 操作，然后是 `U:` 和 ON UPDATE 操作，每一项都只在已设置时显示。  
操作的缩写沿用 erwin 的表示法：`C` 表示 CASCADE，`R` 表示 RESTRICT，`SN` 表示 SET NULL，`SD` 表示 SET DEFAULT，`NA` 表示 NO ACTION。两项都未设置的关系没有标签。  
标签位于远离子表的一侧：连接线从该表的左侧或右侧引出时，标签在线的上方；从顶部或底部引出时，标签在线的右侧，并且不会与基数符号重叠。  
标签以连接线的颜色绘制在一个画布背景色的小方框上，并与其连接线一起高亮。标签绘制在所有连接线之上，因此穿过标签的线会从其下方经过。  
无论所选数据库会写出什么，标签显示的都是保存在关系上的操作，因此在 MySQL 下，ON DELETE SET DEFAULT 仍然显示为 `D:SD`。

悬停在设置了任一操作的连接线上时，还会显示一个提示，逐行写出完整的子句，例如 `ON DELETE CASCADE` 和 `ON UPDATE RESTRICT`。  
即使标签被隐藏，该提示也会出现。

通过 `Relationship` 显示选项可以隐藏 ERD 画布上的连接线，通过默认开启的 `Referential Actions` 显示选项则可以只隐藏其标签，参见[表显示选项](./table-related-functions.md#table-view-options)。  
在 `70%` 及以下，表会折叠为名称，此时不绘制标签。导出 PNG 时，标签的绘制方式与画布相同。  
Visualization 标签页的 [Flow 模式](./visualization.md#flow-mode)即使在 `Relationship` 关闭时也会绘制连接线，每条都是一根平滑的灰色实线曲线，端点符号与 ERD 画布相同，因此本页介绍的虚线、标签、提示与连接线路径只适用于 ERD 画布。

## 连接线路径

连接线按正交方式布置。  
路径会绕开位于两端之间的表，而不是从表上穿过，拐角以 45 度切除。  
从表的同一侧引出的路径会被分到各自独立的通道上，以免相互重叠。

没有可配置的项目。  
画布上有任何元素移动或改变大小时，路径都会自动重新计算，因此无需手动调整。

![将 members 表向下拖动再拖回时，连接线路径随之重新计算并绕开 categories](/img/demo-connector-routing.webp)
