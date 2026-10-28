---
sidebar_position: 12
description: 在 Schema SQL 标签页中查看图的 DDL，在其选项面板中选择数据库、引号、语句、头部、空注释中的逻辑名和表，在表之前和之后加入你自己的脚本，并保存或复制 SQL。
---

# Schema SQL

`Schema SQL` 标签页按所选数据库显示图的 DDL：即创建其中各表及其键、索引和外键的 SQL。  
切换到工具栏的 `Schema SQL` 标签页，或在[快速搜索](./quick-search.md)的 `Tab` 中选择 `Schema SQL`。从 `Export` 子菜单中选择 `Schema SQL` 同样会打开该标签页，并做好保存的准备，参见[保存或复制 SQL](#saving-or-copying-the-sql)。

SQL 位于左侧，其右侧是标题为 `Schema SQL` 的选项面板，其中放着决定 SQL 内容的各项选择，参见[选项面板](#options-panel)。在从右到左书写的显示语言中，SQL 同样留在左侧，并从左到右阅读。  
除非该标签页首次打开时编辑器的宽度小于 640 px，否则面板会自动打开。面板标题栏中的 `Hide options` 会将其收起，代码右上角的 `Show options` 则会让它重新出现。此后，只要编辑器保持打开，无论如何切换标签页，面板都会保持你离开时的展开或收起状态。它的收起与展开独立于 Code Generator 标签页的面板，并且从不保存到文件中。

![打开 Export > Schema SQL，将语句切换为 Drop & re-create、头部切换为 USE，再在表之前添加一段 SET NAMES 脚本](/img/demo-schema-sql-options.webp)

在 SQL 上点击右键即可打开其右键菜单：

- `Database` 和 `Bracket`，各为一个子菜单，当前值带有勾选标记。
- `Statements` 和 `Header`，各为一个子菜单，当前生效的选项带有勾选标记。数据库不具备的选项会带有一条淡色的说明，例如 `not in Oracle`，选择它不会有任何作用。
- `Options panel`，面板显示时处于勾选状态，用于收起或展开面板。
- `Save file`

此标签页打开期间，快速搜索会提供 `Database` 和 `Bracket`；只列出该数据库所具备选项的 `Schema SQL: Statements` 和 `Schema SQL: Header`；以及用于收起或展开面板的 `Schema SQL: Options panel`。  
右键菜单和快速搜索都不提供 `Write logical names into empty comments`，该选项只在选项面板中，参见[将逻辑名作为注释](#logical-names-as-comments)。

SQL 在标签页打开时写出，之后每当面板中的某项选择、数据库名或某段脚本发生变化时都会重新写出。标签页打开期间对表所做的编辑，例如协作者或编码智能体所做的编辑，要等你离开该标签页再回来，或上述某一项发生变化后才会显示。

[表属性](./table-related-functions.md#table-properties)有自己的 `Schema SQL` 标签页，显示的是一张表的 DDL。它始终只写出普通的 `CREATE` 语句，不带头部语句或脚本，从不将逻辑名写入空注释，没有选项面板，其右键菜单也只提供 `Database` 和 `Bracket`。

## 选项面板 {#options-panel}

面板包含三组内容，每组各有一个标题：

1. `Saved in the document`：`Database` 和 `Bracket`，参见[数据库与括号](#database-and-bracket)。只读编辑器把它们标注为 `This window only`，参见[只读编辑器](#read-only-editors)。
2. `This window only`：`Statements`、`Header`、`Write logical names into empty comments`，以及图中有[表分组](./table-groups.md)时显示的 `Tables`，参见[语句](#statements)、[头部](#header)、[将逻辑名作为注释](#logical-names-as-comments)和[表](#tables)。
3. `Saved in the document · written as is for every database`：`Before tables` 和 `After tables` 脚本，参见[前置与后置脚本](#before-and-after-scripts)。

面板底部是 `Save file` 和 `Copy`，参见[保存或复制 SQL](#saving-or-copying-the-sql)。

`This window only` 下的选择属于你做出这些选择的编辑器窗口。它们不会保存到文档中，不会与协作者共享，也不会记录到 Undo 历史记录中；编辑器关闭或重新加载时它们会被重置，切换标签页则会保留它们。  
`Statements` 的初始值为 `If not exists`，`Header` 的初始值为 `CREATE + USE`，`Write logical names into empty comments` 初始为关闭。而嵌入编辑器的页面通过 [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) 读取的 SQL，以及[编码智能体读取](../../mcp/tools.md#reading-a-document)的 SQL，则默认为 `Create`，不带头部，并且除非明确要求，否则不写出任何逻辑名。

所选数据库不具备的选项会留在面板中，但会变暗显示，并带有 `Not in <database>` 提示，例如 `Not in Oracle`，按下它不会有任何作用。  
此时 SQL 会使用该数据库具备的最接近的形式，该形式的按钮显示为按下状态：`If not exists` 退回到 `Create`；`CREATE + USE` 退回到 `USE`，数据库连 `USE` 也不具备时退回到 `None`；`USE` 退回到 `None`。你的选择会被保留，因此切换到具备该选项的数据库后，它会重新生效。

## 数据库与括号 {#database-and-bracket}

`Database` 是图的数据库，与画布右键菜单中的 `Database` 以及 Code Generator 中的是同一个设置，参见[数据库](./table-related-functions.md#databases)。它列出 Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake 和 SQLite，初始值为 MySQL，并像任何编辑一样保存到文件中。

`Bracket` 用于设置包裹表名、列名、约束名和索引名的引号：`SingleQuote`、`DoubleQuote`、`Backtick`，或表示完全不加引号的 `None`，后者为默认值。它与 Code Generator 中的是同一个设置，参见[括号](./code-generator.md#bracket)。  
Snowflake 只用双引号为名称加引号，因此在 `None` 以外的任何选择下都使用双引号；Databricks 则始终用反引号为名称加引号。  
只有当 Settings 标签页中的 `Bracket Type` 锁定关闭时，`Bracket` 才会保存到文件中，而新建的图中所有锁定都处于开启状态。锁定开启期间，更改会重写屏幕上的 SQL，但文件保留锁定的值，图重新打开时也使用该值，参见[锁定](./settings.md#锁定)。

当数据库为 Oracle 且 SQL 中含有超过 30 字节的名称（Oracle 12.1 及更早的版本会拒绝这样的名称）时，这两个列表下方会出现一条说明，列出每个这样的名称：`Oracle 12.2+ for names over 30 bytes: <names>`。它会检查表、列、schema、键、索引、序列和触发器的名称。SQL 本身不会改变。

## 语句 {#statements}

`Statements` 决定以何种方式创建表：

- `Create` 写出普通的 `CREATE` 语句。
- `If not exists` 会跳过已经存在的表和索引。MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 具备该选项；MSSQL、Oracle 和 Snowflake 则改为写出 `Create`。
  - MySQL 将每个表写为 `CREATE TABLE IF NOT EXISTS`，其唯一约束、索引和外键都写在其中，并把整批语句放在 `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` 与 `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;` 之间。
  - MariaDB 在每条语句上加上 `IF NOT EXISTS`：`CREATE TABLE`、每个 `UNIQUE` 与 `FOREIGN KEY` 约束，以及每个 `CREATE INDEX`。
  - PostgreSQL 写出 `CREATE TABLE IF NOT EXISTS` 和 `CREATE INDEX IF NOT EXISTS`，并在重新添加每个外键之前用 `DROP CONSTRAINT IF EXISTS` 将其删除。
  - SQLite 写出 `CREATE TABLE IF NOT EXISTS` 和 `CREATE INDEX IF NOT EXISTS`。
  - Databricks 写出 `CREATE TABLE IF NOT EXISTS`，并在重新添加每个外键之前用 `DROP CONSTRAINT IF EXISTS` 将其删除。
- `Drop & re-create` 会先删除它写出的每个表，再重新创建它们，Snowflake 除外。所有数据库都具备该选项：
  - MySQL 和 MariaDB 为每个表写出一条 `DROP TABLE IF EXISTS`，并放在同样那两行关闭和重新开启外键检查的语句之间。
  - PostgreSQL 写出一条列出所有表的 `DROP TABLE IF EXISTS`，如果列表之外的某个表引用了其中某个表，这条语句会失败。在 `CREATE + USE` 头部下，名称中不带 schema 的表会从该 schema 中删除，例如 `shop.member`。
  - MSSQL 写出一个事务，它需要 SQL Server 2016 或更高版本，按钮的提示 `SQL Server 2016+` 也说明了这一点。它会先删除所写出的表所持有的外键，再用一条 `DROP TABLE IF EXISTS` 删除这些表，出错时回滚。列表之外的表所持有的外键仍会阻止删除。
  - SQLite 写出 `PRAGMA foreign_keys=OFF;`（对该连接会一直保持关闭），然后为每个表写出一条 `DROP TABLE IF EXISTS`。
  - Oracle 为每个表写出 `DROP TABLE … CASCADE CONSTRAINTS`，为每个自动递增序列写出 `DROP SEQUENCE`，每条语句都放在一个以 `/` 行结尾的 PL/SQL 块中，并忽略表或序列不存在时引发的错误。
  - Databricks 为每个表写出一条 `DROP TABLE IF EXISTS`。
  - Snowflake 不删除任何内容，而是改为写出 `CREATE OR REPLACE TABLE`。

`Drop & re-create` 生效期间，面板中会有一条警告，列出它要删除的表：`Drops <tables> before creating them. Their rows are lost.`，在 Snowflake 上则为 `Replaces <tables>. Their rows are lost.`  
最多完整列出五个表。超过五个时，警告会列出前四个，并给出其余表的数量，例如 `a, b, c, d, and 3 more tables`。

## 头部 {#header}

`Header` 会在 SQL 的开头写出用于创建或选择其运行所在的数据库或 schema 的语句。名称为图的数据库名，即在工具栏的 `database name` 输入框中输入的名称，并用 `Bracket` 字符加引号。

- MySQL 和 MariaDB：`USE` 写出 `USE shop;`，`CREATE + USE` 则在其前面写出 `CREATE DATABASE IF NOT EXISTS shop;`。
- MSSQL：`USE` 写出 `USE shop` 和 `GO`，`CREATE + USE` 则在其前面写出 `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` 和 `GO`。
- PostgreSQL 只具备 `CREATE + USE`，它写出 `CREATE SCHEMA IF NOT EXISTS shop;` 和 `SET search_path TO shop, public;`。
- Oracle 只具备 `USE`，它写出 `ALTER SESSION SET CURRENT_SCHEMA = shop;`。`CREATE + USE` 会退回到它，因此在该标签页的默认头部下，Oracle 写出的就是这一行。
- Snowflake 和 Databricks：`USE` 写出 `USE SCHEMA shop;`，`CREATE + USE` 则在其前面写出 `CREATE SCHEMA IF NOT EXISTS shop;`。
- SQLite 两者都不具备，不写出任何头部。

数据库具备 `USE` 或 `CREATE + USE` 时，按钮的提示会说明它在该数据库中写出的内容，例如 PostgreSQL 上的 `CREATE SCHEMA + SET search_path`。

只有当数据库名是一个普通标识符时才会写出头部：以 ASCII 字母（`A`–`Z`、`a`–`z`）或 `_` 开头，后面跟着 ASCII 字母、数字或 `_`。  
其他任何名称（包括空白的名称）都不会写出头部，此时 PostgreSQL 的 `DROP TABLE` 也不会带上 schema。当生效的头部不是 `None` 时，`Header` 下方会有一条说明指出这一点：`Database name "<name>" is not a valid identifier.`  
新建的图的数据库名为空，因此在你为其命名之前，面板会显示 `Database name "" is not a valid identifier.`

## 将逻辑名作为注释 {#logical-names-as-comments}

`This window only` 下的开关 `Write logical names into empty comments` 会在任何数据库上，将表或列的[逻辑名](./logical-names.md)写入 DDL 中其注释为空的位置。

![在 Schema SQL 面板中开启 Write logical names into empty comments，order_items 每一列的逻辑名会写入其空的 COMMENT，而 members 的注释保持不变](/img/demo-schema-sql-logical-names.webp)

- 有文本的注释始终优先：逻辑名永远不会替换它，也永远不会附加到它上面。
- 只由空白组成的注释算作空注释，因此会在其位置写入逻辑名。为空或只由空白组成的逻辑名不会写出任何内容，该表或列仍然没有注释。
- 逻辑名的写出位置和形式与该数据库写出注释时相同，其中的引号也以同样的方式转义，参见[注释](#comments)。

例如在 MySQL 上，逻辑名为 `Member ID` 且没有注释的列 `id` 会写出 `COMMENT 'Member ID'`，而逻辑名为 `Email`、注释为 `Sign-in address` 的列 `email` 则保留 `COMMENT 'Sign-in address'`。

与 `Statements` 和 `Header` 一样，该开关属于窗口，初始为关闭，参见[选项面板](#options-panel)。  
导入时永远不会将这样的注释读回为逻辑名，参见[注释](./file-import-export.md#comments)。

## 表 {#tables}

只要图中至少有一个[表分组](./table-groups.md)（无论显示还是隐藏），`This window only` 下就会出现 `Tables`，每个选项各有一个复选框：

- `All`，用于勾选或取消勾选所有复选框。只有部分复选框被勾选时，它显示为混合状态。
- 每个表分组各一个复选框，按图中分组的顺序排列，标签为分组的名称，没有名称的分组则为 `unnamed`；分组带有颜色时，名称前会有一个该颜色的圆点。
- `No group`，代表不属于任何分组的表。

所有复选框都勾选时，该标签页写出整张图。  
只勾选了部分复选框时，它会写出所勾选复选框对应的表，连同这些表的索引及其持有的外键，包括引用了未被纳入的表的外键。前置与后置脚本仍会写出，而 `Drop & re-create`、其警告以及 Oracle 关于长名称的说明都只涉及这些表。  
一个复选框都没有勾选时，该标签页不写出任何内容，代码区域上方会显示提示 `No tables chosen. Check some under Tables.` 此时 `Save file` 会保存一个空文件，`Copy` 会复制空文本。

与 `Statements` 和 `Header` 一样，该选择属于窗口，参见[选项面板](#options-panel)。  
之后添加的分组，只有在添加时所有复选框都已勾选的情况下，才会以勾选状态出现。删除分组会去掉其复选框，删除最后一个分组则会重新勾选全部内容。  
该选择只作用于此标签页。表属性的 `Schema SQL` 标签页和 `getSchemaSQL()` 都不受其影响。

## 前置与后置脚本 {#before-and-after-scripts}

`Before tables` 和 `After tables` 用于存放你自己编写的 SQL，例如写在表之前的 `CREATE EXTENSION` 或 `SET` 语句，或写在表之后的授权、视图和种子数据。  
它们保存在文档中，无论使用哪种数据库，整张图都只有这一对脚本。每段脚本都按你输入的原样写入 SQL，从不经过检查：前置脚本写在头部之后、`DROP` 语句和各表之前，后置脚本写在最末尾。

换行符写为 LF，脚本前面的空行和后面的空白会被去掉。  
在 MSSQL 上，如果脚本的最后一行不是 `GO`（或带计数的 `GO`），会在其后添加一行 `GO`，两个输入框下方的那行文字也说明了这一点。在 Oracle 上，请自行用 `/` 行结束 PL/SQL 块。

这两个输入框会对 SQL 进行语法高亮，并随文本增多而变高。  
编辑会在你离开输入框时（点击其他位置或切换标签页）生效，旁边的 SQL 和文档也直到此时才会改变。只是点进输入框而没有修改时，不会改变任何内容。  
对脚本的编辑与其他任何编辑一样会改变图：它会保存到文件中，协作者可以看到它，每次生效的编辑都是 [Undo 历史记录](./undo-redo.md)中的一步，可以在 ERD 标签页中将其撤回。  
在输入框中输入时，编辑器自身的快捷键会交给输入框处理，因此 `Ctrl + Z` (Windows/Linux) 或 `⌘ + Z` (Mac) 撤回的是你在其中输入的内容，复制、剪切和粘贴作用于文本而不是图。  
快速搜索和[资源管理器的搜索](./find-and-replace.md)仍可通过各自的快捷键打开，即 `Ctrl + K` 和 `Ctrl + F` (Windows/Linux) 或 `⌘ + K` 和 `⌘ + F` (Mac)。由于 `Ctrl + F` 或 `⌘ + F` 会切换到 ERD 标签页，它也会像任何标签页切换一样让你的编辑生效。  
没有键盘焦点的输入框会跟随协作者或[编码智能体](../../mcp/tools.md#settings)对其脚本所做的更改。对于你正在其中的输入框，如果你没有输入任何内容，离开时会显示该更改；如果你输入了内容，离开时会应用你的文本并替换对方的文本。

## 保存或复制 SQL {#saving-or-copying-the-sql}

面板底部或右键菜单中的 `Save file` 会将该标签页显示的 SQL 原样保存为 `<database name>-<timestamp>.sql`，包括其当前的数据库、引号、语句、头部、逻辑名注释、表和脚本。它的命名和保存方式与其他所有导出相同，参见[导出](./file-import-export.md#exporting)。

画布右键菜单或快速搜索中的 `Export` ▸ `Schema SQL` 本身不会保存任何内容。  
它会切换到此标签页，即使选项面板已收起也会将其打开，并把键盘焦点放在 `Save file` 上，因此按 `Enter` 即可保存文件。

面板底部的 `Copy`，或鼠标悬停在代码上时其右上角出现的复制按钮，都会复制 SQL。  
随后会显示带有勾选标记的 `Copied!` 提示，持续两秒。如果浏览器或宿主拒绝访问剪贴板，则会改为显示带有警告标志的 `Couldn't copy to the clipboard` 提示，持续五秒。再次复制会替换该提示，而不是再添加一条。  
SQL 也可以直接选中，因此可以只取其中一部分。

## DDL 写出的内容 {#what-the-ddl-writes}

无论编辑器在哪里写出 Schema SQL，以下规则都适用：此标签页及其保存的文件，以及嵌入编辑器的页面或编码智能体读取的 SQL。  
表属性的 `Schema SQL` 标签页对其显示的那一张表同样遵循这些规则。它不写出 Oracle 的序列或触发器，也不写出外键（SQLite 的外键除外，因为它们位于 `CREATE TABLE` 之内）。它也不写出 PostgreSQL、Oracle 和 MSSQL 放在表之后的注释语句，因此在这三种数据库上它不显示任何注释。

各部分按以下顺序排列，彼此之间隔一个空行：头部、前置脚本、`DROP` 语句、表，以及后置脚本。表按名称顺序写出。  
既没有表也没有脚本的图不会写出任何内容，即使选择了头部也是如此。

无论[名称显示](./logical-names.md#name-view)当前是哪种显示方式，表和列都以其物理名写出。关联到域的列以其自身的数据类型写出，该数据类型由域设定，参见[域与数据类型](./dictionary.md#domains-and-data-types)。

### Auto Increment

标记为 `Auto Increment` 的列按各数据库自己的写法写出：MySQL 和 MariaDB 为 `AUTO_INCREMENT`，MSSQL 为 `IDENTITY(1,1)`，Snowflake 为 `AUTOINCREMENT`，PostgreSQL 和 Databricks 为 `GENERATED ALWAYS AS IDENTITY`。  
Oracle 则会得到一个序列 `SEQ_<table>`，以及一个用该序列填充该列的触发器 `SEQ_TRG_<table>`。触发器以 `/` 行结尾，因此 SQL\*Plus 和 SQLcl 会执行它。

如果数据库不接受在该列的类型上使用自动递增，该子句会被省略，并在表之后写一行注释指明该列：

- PostgreSQL 只在 `smallint`、`integer` 或 `bigint` 上接受它，可以使用它们的任何名称：`INT`、`INTEGER`、`BIGINT`、`SMALLINT`、`INT2`、`INT4` 或 `INT8`。其他类型的列既不会得到该子句，也不会得到默认值，注释的内容例如 `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks 只在 `BIGINT` 或 `LONG` 上接受它。
- SQLite 只在表中唯一的主键列为整数类型（例如 `INT`、`BIGINT` 或 `INT8`，带不带宽度均可）时接受 `AUTOINCREMENT`。该列会写为 `INTEGER`，键则写为 `PRIMARY KEY (id AUTOINCREMENT)`。其他任何类型的单列主键都不带它写出。

### 参照操作 {#referential-actions}

各数据库会写出哪些 ON DELETE 与 ON UPDATE 操作，列在 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update) 中。  
Snowflake 省略某个操作时，会在该外键的 `ALTER TABLE` 上方写一行注释指明它，例如 `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### 带 schema 限定的表名 {#schema-qualified-table-names}

当 `Bracket` 为 `None` 时，带点的表名（例如 `sales.users`）会被读作 schema 和表，在方括号或双引号之外的最后一个点处拆分。

- MySQL、MariaDB、MSSQL、Oracle 和 PostgreSQL 只用名称中的表部分来构建它们写出的自动名称：五者都有 `FK_users_TO_orders` 和 `IDX_users`，除 PostgreSQL 外都有 `UQ_users_email`，MSSQL 和 Oracle 这两个为主键命名的数据库还有 `PK_users`。在这两者上，`[sales].[users]` 和 `"sales"."users"` 同样得到 `PK_users`，`[Order]` 则得到 `PK_Order`。
- SQLite 不为约束命名，因此它构建的唯一自动名称是索引的名称：`CREATE INDEX sales.IDX_users ON users`。
- Oracle 会在表所在的 schema 中创建表的索引，以及自动递增列的序列和触发器：`sales.IDX_users`、`sales.SEQ_users` 和 `sales.SEQ_TRG_users`。
- 在 Oracle 和 SQLite 中，你自己为索引名指定的 schema 会被保留。
- 与之前的名称重复（不区分大小写）的自动外键名或索引名会加上编号。当 `orders` 同时引用 `sales.users` 和 `hr.Users` 时，第二个键为 `FK_Users_TO_orders1`。

`Bracket` 为其他任何值时，整个表名都是一个标识符，例如 `"PK_sales.users"`。Snowflake 和 Databricks 始终保留完整的名称。  
[索引](./table-related-functions.md#indexes)标签页中的 `Keys` 行显示的也是相同的名称。

### 默认值 {#defaults}

列的默认值按你输入的原样写出，但如果数据库只在括号内读取该表达式，则会为其加上括号。已经带括号的默认值保持不变。

- MySQL 会为字面量和当前时间以外的任何内容加上括号，例如 `(uuid())`。它还会为 `BLOB`、`TEXT`、`JSON`、空间类型或 `LONG…` 列上除 `NULL` 以外的任何默认值加上括号，并为 `TIMESTAMP` 或 `DATETIME` 以外的任何列上的当前时间加上括号。
- MariaDB 会为字面量、当前时间、函数调用和名称以外的任何内容加上括号。
- SQLite 会为字面量和名称以外的任何内容加上括号，例如 `(datetime('now'))`。
- PostgreSQL 只为在括号之外含有 `AT TIME ZONE`、`AND`、`OR`、`IS`、`IN`、`LIKE`、`COLLATE` 或 `= ANY` 等词的表达式加上括号，例如 `(now() AT TIME ZONE 'utc')`。
- MSSQL、Oracle、Snowflake 和 Databricks 会按输入的原样写出所有默认值。

### 注释 {#comments}

表或列的非空白注释，或 [`Write logical names into empty comments`](#logical-names-as-comments) 在其位置写入的逻辑名，会按各数据库写出注释的方式写出：

- MySQL 和 MariaDB 以内联方式写出：列以 `COMMENT 'Member ID'` 结尾，表以 `) COMMENT 'Members';` 结束，在 MySQL 的 `If not exists` 整批语句中也是如此。
- Snowflake 以内联方式写出列的注释 `COMMENT 'Member ID'`，表的注释则写在右括号之后的单独一行中：`COMMENT = 'Members';`。
- Databricks 以内联方式写出列的注释，表的注释则在 `USING DELTA` 之后写为 `COMMENT 'Members';`。
- PostgreSQL 在表的 `CREATE TABLE` 之后紧接着写出 `COMMENT ON TABLE member IS 'Members';` 和 `COMMENT ON COLUMN member.id IS 'Member ID';`。Oracle 写出相同的语句，位于表、其唯一约束及其自动递增序列和触发器之后。
- MSSQL 在表及其唯一约束之后，为每个表和每一列各写出一次调用，每次调用后跟 `GO`：`EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`，对于列还会加上 `'column', 'id'`。  
  文本是国家字符字面量 `N'…'`，因此 SQL Server 会保留数据库代码页之外的文本（例如韩文），而不是存储为问号。  
  当 `Bracket` 为 `None` 时，名为 `sales.users` 的表会得到 schema `sales` 和表 `users`，`[sales].[users]` 和 `"sales"."users"` 也是如此，其方括号和双引号会被去掉。不带 schema 的名称位于 `dbo` 中。schema 之前的部分（如 `shop.sales.users` 中）会运行该数据库的存储过程 `shop.sys.sp_addextendedproperty`。在其他任何 `Bracket` 下，整个名称都是表，位于 `dbo` 中。
- SQLite 不保存注释，因此它将每条注释写为其所描述内容上方的一行 `--`：`CREATE TABLE member` 上方的 `-- Members`，以及列上方的 `-- Member ID`。

带引号的注释中的引号会被双写，例如 `'it''s'` 和 `N'it''s'`，MSSQL 的调用所传递的名称中的引号也是如此。Databricks 则改用反斜杠转义引号和反斜杠，例如 `'it\'s'`，这是每个 Spark 版本都能读取的形式。SQLite 的 `--` 行不加引号，因此会按输入的原样保留引号：`-- it's`。  
除以下两种数据库外，文本都按输入的原样写出，包括换行：

- Oracle 会省略空行（只含空格或制表符的行也算作空行），因为 SQL\*Plus 会在空行处结束语句并跳过其余部分。由 `Members`、一个空行和 `Active only` 组成的表注释会写为 `COMMENT ON TABLE member IS 'Members`，下一行为 `Active only';`。
- SQLite 会将每一串连续的换行写为一个空格，因为换行会结束 `--` 行，并将其余部分作为 SQL 执行。同一条注释会写为 `-- Members Active only`。

这些注释在导入时如何读回，参见[注释](./file-import-export.md#comments)。

## 只读编辑器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，该标签页为阅读者工作，并且在其上所做的任何操作都不会到达文档：

- `Database` 和 `Bracket` 仍会重写 SQL，但只作用于该窗口，因此面板同样把它们标注为 `This window only`。无论锁定如何，所选内容都不会保存到文件、与协作者共享或记录到 Undo，并且协作者对你所选设置的更改会让你的选择保留在屏幕上。Code Generator 标签页会显示同样的选择，不带数据库调用的 [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) 写出的也是它。编辑器再次变为可写后，文档的数据库和括号会恢复。
- `Statements`、`Header`、`Write logical names into empty comments` 和 `Tables` 与在任何地方一样工作，因为它们本来就属于该窗口。
- 两个脚本输入框是只读的：它们显示文档的脚本，SQL 仍会写出这些脚本，但不接受输入。
- `Save file` 和 `Copy` 保存和复制的是该标签页所显示的 SQL。
