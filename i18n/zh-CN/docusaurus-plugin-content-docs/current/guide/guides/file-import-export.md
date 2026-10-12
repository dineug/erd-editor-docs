---
sidebar_position: 2
description: 导入 JSON、schema SQL、GraphQL、DBML 或 AML 以替换当前的图或添加到图的下方，导出 JSON、schema SQL，或将图导出为 PNG 或 SVG 图片。
---

# 导入与导出文件

## 导入外部文件

可以从画布右键菜单的 `Import` 子菜单导入以下五种格式：

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import` 正下方的 `Import and Add` 会把文件添加到图中，而不是替换图，参见 [Import and Add](#import-and-add)。  
空白的图所显示的欢迎界面中有一个 `Import` 条目，提供同样的五种格式，参见[欢迎界面](./editing-start.md#欢迎界面)。

扩展名的匹配不区分大小写。如果所选文件的扩展名与所选格式不符，导入会被取消并显示 `Only <format> files can be imported`，其中的格式写作 `json`、`sql`、`graphql`、`dbml` 或 `aml`，例如 `Only sql files can be imported`。

`Import` 会替换当前文档，而不是合并到当前文档中，一次 Undo 即可恢复之前的图。  
JSON 文件会带上自身的设置，其中也包括它的[锁定](./settings.md#锁定)。当文件锁定了标签页、Code Generator 的语言、某种名称大小写或括号类型时，你看到的仍是原来的内容，但保存的是文件中锁定的值。无论是否锁定，视图都会移到文件所指定的位置。在锁定功能出现之前保存的 JSON 文件导入后，所有锁定都处于开启状态，视图为 100%。  
其他格式则保留你现有的设置，锁定也包括在内，只有视图除外，视图会从 100% 开始。  
GraphQL、DBML 和 AML 解析器不会失败，无法读取的文件只会生成空白的图，而不会报错。

JSON 文件会保留其中已有的位置。Schema SQL、GraphQL、DBML 或 AML 文件中的表会在图发生变化之前排布好：

- 当文件中有两个或更多表并且至少有一个关系时，这些表会按 `Flow` [自动布局](./table-related-functions.md#auto-layout)从画布左上角开始，沿着关系从左到右排布。指向自身的关系也计算在内。
- 否则会从左上角开始逐行排列，列最少的表排在最前。
- 如果布局耗时超过 6 秒，会出现一条带有 `Cancel` 按钮的 `Placing tables` 提示。按 `Cancel`，或在提示显示期间按 `Escape`，会放弃该布局，改为逐行排列这些表。布局失败、60 秒内没有返回布局，或宿主环境不运行 shared worker 时，也会改为逐行排列，且不显示提示，参见 [Web Worker](../../api/installation.md#web-workers)。

随后图会一步替换完成，因此中间不会显示任何过渡状态。排布期间你更改的设置（例如标签页）会被保留；如果在此期间又导入了另一个文件，则以最后开始的导入为准。

只读编辑器不会从 `Import` 载入任何内容，也不提供 `Import and Add`。

### Import and Add

`Import and Add` 会保留当前的图，并把文件添加到图的下方。它位于画布右键菜单中，也位于 ERD 标签页的[快速搜索](./quick-search.md)中，提供与 `Import` 相同的五种格式和相同的扩展名检查。

![通过 Import and Add > Schema SQL 添加 SQL 文件，其中的表落在图的下方，沿着关系排布并处于选中状态](/img/demo-import-and-add.webp)

文件会像粘贴一样载入：其中的每个表、列、关系、索引、备注和[表分组](./table-groups.md)都会作为新的对象添加，图中已有的表不会移动，任何设置也不会改变，因此 JSON 文件的设置会被忽略。  
名称与图中已有的表相同的表会作为同名的第二个表添加，而不会与其合并。关系和索引只来自该文件，因此指向文件中未定义的表的外键，不会与图中已有的表相连。

添加的内容块会落在图中所有内容的正下方，与其左边缘对齐；图为空白时则落在左上角。通过 [View Option](./table-related-functions.md#table-view-options) 隐藏的备注和表分组同样计算在内，因为它们仍然占据着那里的位置。  
在内容块内部，JSON 文件会保留自身的排列，表分组也包括在内。其他格式则按 `Import` 的方式排布，即按相同的规则用 `Flow` 排布或逐行排列，每个表分组的框都会调整为恰好围住其中的表。添加的表和备注会堆叠在所有已有内容之上。

内容块落下后，只有添加的内容处于选中状态：新的表，以及处于显示状态的新备注和新表分组。如果内容块不在视野中，视图会以当前的缩放滚动到它；如果你在此期间切换到了其他标签页，编辑器会先切换回 ERD 标签页。一次 Undo 即可撤回整个添加。  
解析器无法读取的文件，或者既没有表也没有备注的文件，不会添加任何内容。

在某个文件仍在排布期间添加的多个 Schema SQL、GraphQL、DBML 或 AML 文件都会落下，顺序与开始添加的顺序相同。在此期间添加的 JSON 文件一读取完毕就会落下，排在它们之前。执行 `Import` 或载入另一个文档时，仍在排布中的文件都会被丢弃。

编码智能体通过 MCP 导入工具的 `append` 模式以同样的方式添加文件，该模式会保留 JSON 文件的排列，但会将其他格式的表逐行排列，从不使用 `Flow`，参见[导入](../../mcp/tools.md#导入)。

### JSON

可以导入[编辑器定义的 schema 格式](../../api/advanced/schema.md)文件。
文件名必须以 `.json` 结尾，因此导出的 `<数据库名>-<时间戳>.erd.json` 文件可以原样导入回来，而此处不接受单纯的 `.erd` 或 `.vuerd` 文件。早期版本保存的文件同样可以读取。

![通过 Import > json 导入已保存的文件，连同设置一起替换草稿文档](/img/demo-import-json.webp)

### Schema SQL

也可以导入用 SQL 定义的 schema 文件。  
解析器已尽量做到与数据库厂商无关且足够宽松，但仍可能存在不支持的语法。  
文件名必须以 `.sql` 结尾。  
[支持的语法可在此查看。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![通过 Import > Schema SQL 导入 SQL 文件，其中的表沿着关系排布，再缩小查看这些表](/img/demo-import-sql.webp)

列只从 `CREATE TABLE` 中读取。通过 `ALTER TABLE ... ADD COLUMN` 添加的列不会被读取。  
`CREATE TABLE` 中不是列的项会被跳过，而不会被当作列读取：未命名的 `CHECK (...)`、PostgreSQL 的 `LIKE` 与 `EXCLUDE`、不带 `INDEX` 或 `KEY` 的 MySQL `FULLTEXT` 与 `SPATIAL`、T-SQL 的 `PERIOD FOR`，以及 Oracle 的 `SUPPLEMENTAL LOG DATA`。  
名称与其中某一项相同的列，只要名称后面跟着内置类型（例如 `exclude BOOLEAN`），或名称带有引号（例如 `"check" int`），仍会被导入。未加引号的 `like` 后面跟着非内置类型时（例如 `like citext`），会被当作 PostgreSQL 的 `LIKE` 读取并跳过。  
`CHECK` 约束本身不会被导入，因为编辑器中没有可以存放它们的位置。

#### 数据类型 {#data-types}

列的数据类型会连同参数列表一起被保留，即使它不是任何[支持的数据库](./table-related-functions.md#databases)的内置类型。  
这包括用 `CREATE TYPE` 创建的枚举或复合类型、用 `CREATE DOMAIN` 创建的域、`hstore`、`citext` 和 `ltree` 等扩展类型、`public.mood` 这样带 schema 限定的名称，以及 `"MyType"` 和 `[dbo].[Phone]` 这样带引号或方括号的名称，后者会保留其引号或方括号。`CREATE TYPE`、`CREATE DOMAIN` 和 `CREATE EXTENSION` 语句本身会被跳过。  
内置类型会去掉其引号或方括号，因此 `[int]` 导入为 `int`，`[nvarchar](50)` 导入为 `nvarchar(50)`。PostgreSQL 的 `"char"` 和 `"bit"` 会保留引号，因为它们是与 `char` 和 `bit` 不同的类型。  
任何类型上的数组后缀都会保留：`integer[]`、`text[3][3]`、`integer ARRAY`、`mood[]`。SQLite 的 `UNSIGNED BIG INT` 会被完整导入。  
MySQL 和 MariaDB 中紧跟在类型及其参数之后的 `UNSIGNED` 和 `ZEROFILL` 会按原样保留为类型的一部分：`INT UNSIGNED`、`SMALLINT(5) UNSIGNED ZEROFILL`、mysqldump 的 `int unsigned`。作为默认值的 `SIGNED` 会被去掉，因此 `TINYINT SIGNED` 导入为 `TINYINT`。写在其他列选项之后的修饰符（例如 MySQL 会拒绝的 `INT NOT NULL UNSIGNED`）会被去掉。  
`ENUM(...)` 和 `SET(...)` 的值会保留引号，值内部的引号会双写，例如 `ENUM('a','it''s')`。MySQL 用反斜杠转义的 `'it\'s'` 导入时也会同样改为双写。在 Databricks 的 `STRUCT<...>` 类型中，带引号的字段名和字段的 `COMMENT` 会保留引号。  
没有写类型的列（例如 SQLite 中没有类型的列，或用 `AS` 计算的列）仍保持没有类型：`NOT`、`NULL`、`DEFAULT`、`PRIMARY` 或 `REFERENCES` 等关键字，以及单引号字符串，都不会被当作类型读取。

#### 默认值 {#defaults}

列的 `DEFAULT` 会保留其完整的表达式，例如 `now()`、`0.5`、`CURRENT_TIMESTAMP` 或 `ARRAY[]::text[]`，直到下一个列选项、逗号或右括号为止。`CASE ... END` 会被完整读取。  
包围整个表达式的括号会被去掉，因此 SQL Server 的 `((0))` 导入为 `0`，`(getdate())` 导入为 `getdate()`。对字面量的类型转换同样会被去掉，因此 pg_dump 的 `'draft'::character varying` 导入为 `'draft'`，`NULL::character varying` 导入为 `NULL`；其他类型转换则会保留，例如 `ARRAY[]::text[]` 和 `lower('A'::text)`。  
MySQL 的 `ON UPDATE CURRENT_TIMESTAMP` 会被去掉，因为列中没有可以存放它的位置，其前面的默认值则会保留。Oracle 的 `DEFAULT ON NULL 0`，无论是否带有 `FOR INSERT ONLY` 或 `FOR INSERT AND UPDATE`，都导入为 `0`。  
带前缀的字符串，例如 `N'x'`、`E'x'`、`B'0'`、`X'ff'`、`U&'x'` 或 `_utf8mb4'x'`，会作为一个字符串读取，即使其中含有括号也是如此。

SQL Server Management Studio 生成脚本时会把默认值写在表之后，写作 `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`。这样的语句会设置该列的默认值（此处为 `1`），其约束名会被丢弃。

对于只在括号内读取默认值表达式的数据库，导出的 Schema SQL 会把括号加回去，参见[默认值](./schema-sql.md#defaults)。

#### Auto Increment

`AUTO_INCREMENT`、`AUTOINCREMENT` 和 `IDENTITY` 会开启列的 `Auto Increment`，`GENERATED ALWAYS AS IDENTITY` 和 `GENERATED BY DEFAULT AS IDENTITY` 也会，并且不会留下默认值。  
仅由一个 PostgreSQL `nextval()` 调用构成的默认值同样会开启它，这是 serial 列所得到的默认值，写作 `nextval('s')`，或按 pg_dump 的写法写作 `nextval('s'::regclass)`。序列名不会被保留。只是用到序列的默认值，例如 `nextval('s') + 1` 或 SQL Server 的 `NEXT VALUE FOR s`，仍是普通的默认值。  
pg_dump 会把这两者写在表之后，即 `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` 和 `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`。这两种语句都会开启该列的 `Auto Increment` 并清除其默认值。`CREATE SEQUENCE`、`ALTER SEQUENCE` 以及其他所有 `ALTER COLUMN` 操作都会被跳过。  
以内联方式将类型写为 `serial`、`bigserial` 或 `smallserial` 的列会保留该类型，`Auto Increment` 保持关闭。

编辑器只保留 `Auto Increment` 标志，导出时由各数据库写出自己的形式，参见 [Auto Increment](./schema-sql.md#auto-increment)。无论导入时是哪种形式，PostgreSQL 导出都会在 `smallint`、`integer` 或 `bigint` 列上写出 `GENERATED ALWAYS AS IDENTITY`；对于其他类型（例如 `INT UNSIGNED`），只会在表之后写一行注释。`START WITH 100` 之类的序列选项会丢失。  
带有多个 serial 或 identity 列的表导入后会有多个自动递增列，而运行这样的表的导出结果时，MySQL、MariaDB 和 SQL Server 会拒绝该表。

#### 主键 {#primary-keys}

在表之后添加的主键，即 `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`，会将其列标记为主键。  
列列表之前的 SQL Server 的 `CLUSTERED` 或 `NONCLUSTERED` 以及 MySQL 的 `USING BTREE` 会被略过，因此 SQL Server Management Studio 生成脚本时写出的 `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` 会以 `Id` 作为键。内存优化表的 `PRIMARY KEY NONCLUSTERED HASH (...)` 无论是在 `ALTER TABLE` 还是在 `CREATE TABLE` 中都不会被读取。

#### 唯一键与索引 {#unique-keys-and-indexes}

覆盖两列或更多列的 `UNIQUE` 无论使用哪种写法，都会成为一个唯一索引：`UNIQUE (a, b)`、`UNIQUE KEY n (a, b)`、`UNIQUE INDEX n (a, b)`、`CONSTRAINT n UNIQUE (a, b)`、SQL Server 的内联 `INDEX n UNIQUE (a, b)`，以及 `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`。  
该索引优先使用键的索引名，其次使用其 `CONSTRAINT` 名，两者都没有时不带名称，并保留每一列的排序方向。这样的索引就是[备用键](./table-related-functions.md#alternate-keys)。  
只覆盖一列的 `UNIQUE` 无论使用上述哪种写法，都会改为将该列标记为 Unique，而不添加索引，因此导出时写出的 `UQ_<table name>_<column name>` 约束会还原为写出它的那个标志。只覆盖一列的 `CREATE UNIQUE INDEX` 仍然是唯一索引。

一次添加多个键的 `ALTER TABLE`（例如 phpMyAdmin 写出的 `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`）会保留其中的每一个唯一键：`uq_a` 导入为名为 `uq_a` 的唯一索引，`uq_c` 则导入为 `c` 的 Unique 标志。`CONSTRAINT` 名只为其所在子句中的键命名。MariaDB 的 `ADD UNIQUE INDEX IF NOT EXISTS n (...)`，以及 SQL Server 的 `ALTER TABLE t WITH CHECK ADD ...` 和 `WITH NOCHECK ADD ...` 也会被读取。  
`CREATE INDEX` 和 `CREATE UNIQUE INDEX` 在带有 `public.t`、`[dbo].[t]` 这样的限定名称，带有 SQL Server 的 `CLUSTERED` 与 `NONCLUSTERED`，带有 PostgreSQL 的 `CONCURRENTLY`、`IF NOT EXISTS`、`ON ONLY` 和 `USING btree`，或完全没有索引名时，都能被读取。SQL Server 的 `ON [PRIMARY]` 文件组会被忽略。  
`NULLS NOT DISTINCT` 或 `USING BTREE` 这样的键选项不会被误认为键的名称。在键的列列表中，只有第一个词表示列名，因此 `b DESC NULLS LAST`、`b text_pattern_ops` 和 `b COLLATE "C"` 都以 `b` 作为键的列，其中 `DESC` 会作为其排序方向保留。`email(191)` 这样的前缀长度会被略过，但带有表达式部分的键（例如 `lower(email)`）会被整个跳过。

部分唯一索引，即 `CREATE UNIQUE INDEX ... WHERE ...` 或 SQL Server 的内联 `INDEX n UNIQUE (...) WHERE ...`，会以名称和列都相同的普通索引导入，因为在整张表范围内唯一的键会比文件所声明的带过滤条件的键更严格。例外情况是过滤条件仅由针对键列的 `IS NOT NULL` 判断以 `AND` 连接而成，这是 SQL Server 为了让唯一列能容纳多个 NULL 所需的过滤条件：这样的键仍保持唯一。  
引用了表中不存在的列（例如通过 `ALTER TABLE ... ADD COLUMN` 添加的列）的唯一键会被整个丢弃，而不会缩减为仅包含存在的列。普通索引则会保留存在的列。

Oracle 的 SQL Developer 和 `DBMS_METADATA` 会将键自身的索引写成单独的 `CREATE UNIQUE INDEX`，以键的名称命名；对于未命名且后面跟着 `USING INDEX` 的键，则使用 `SYS_C0012345` 这样的系统名称。导入时会将这样的索引，以及 `ADD CONSTRAINT ... USING INDEX` 所指定的索引，作为其所属键的一部分读取：复合唯一键导入为一个唯一索引，主键或单列唯一键则导入为列的标志，不会额外添加索引。之后再导出为 Oracle 时，该索引只会创建一次。

对于 MySQL、MariaDB、MSSQL、Oracle、PostgreSQL 和 SQLite，导出的 Schema SQL 再导入后会得到相同的 Unique 标志和索引。  
Snowflake 没有二级索引，因此其导出结果只能还原唯一键：复合唯一键还原为唯一索引，单列唯一键还原为该列的 Unique 标志。Databricks 的导出不声明任何唯一性，因此不会还原任何唯一性。

#### 外键 {#foreign-keys}

以下写法的外键会成为关系：

- 表级的 `FOREIGN KEY (...) REFERENCES t (...)`，带或不带 `CONSTRAINT name` 均可。
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`，包括 SQL Server Management Studio 生成脚本时写出的 `ALTER TABLE t WITH CHECK ADD ...` 和 `WITH NOCHECK ADD ...`。
- 列上的内联 `REFERENCES t (col)`（例如 `user_id INT REFERENCES users (id)`），以及 SQL Server 和 Snowflake 允许在该位置使用的 `FOREIGN KEY REFERENCES t (col)`。引用多列的内联引用会被跳过。

一条 `ALTER TABLE` 最多生成一个关系，而且仅在其第一个子句添加外键时才会生成：同一语句中位于 `ADD PRIMARY KEY` 或 `ADD UNIQUE` 子句之后的 `FOREIGN KEY` 子句不会被读取。一条语句添加多个外键时（例如 phpMyAdmin 写出的 `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`），只会读取最后一个。

不带列列表的 `REFERENCES t` 在 `t` 的主键为单列时指向该主键。指向复合主键时，该外键会被跳过。  
当外键引用的列一个都找不到，或在两张表中找到的列数量不同（例如某一列只在其中一张表中缺失）时，该外键会被跳过，其所有列都不会被标记为外键。当两张表缺失的列数量相同时，找到的列会按书写顺序配对，关系只包含这些列。  
导入的关系一律为 `Zero N`，当其每个子表列同时也是主键时，该关系为识别关系。

每个外键的 `ON DELETE` 与 `ON UPDATE` 子句会成为关系的 `On Delete` 与 `On Update`：`NO ACTION`、`RESTRICT`、`CASCADE`、`SET NULL` 或 `SET DEFAULT`，不区分大小写，两者的先后顺序也不限。没有这些子句的外键导入为 `Not set`。在编辑器中设置它们的方法参见[编辑关系](./relationship-editing.md#on-delete-and-on-update)。  
PostgreSQL 在 `SET NULL` 或 `SET DEFAULT` 之后的列列表（例如 `ON DELETE SET NULL (a_id)`）会被略过：该操作作用于整个键，列表之后的 `ON UPDATE` 仍会被读取。`MATCH FULL`、`MATCH PARTIAL` 和 `MATCH SIMPLE` 会被跳过，MySQL 的 `ON UPDATE CURRENT_TIMESTAMP` 列属性也不会被误认为操作。  
导出的 Schema SQL 再导入后，会带回该数据库所写出的操作，因此它省略的操作（例如 MySQL 的 `SET DEFAULT`、Oracle 的任何 `ON UPDATE`，或 Snowflake 上除 `NO ACTION` 之外的任何操作）会还原为 `Not set`。

#### 注释 {#comments}

表与列的注释会从解析器支持的三种语法中导入：MySQL、MariaDB、Snowflake 和 Databricks 使用的 `COMMENT` 表选项与列属性，PostgreSQL 和 Oracle 使用的 `COMMENT ON TABLE` 与 `COMMENT ON COLUMN` 语句，以及 SQL Server 通过 `EXEC sp_addextendedproperty` 设置的 `MS_Description` 扩展属性。  
指向文件中未定义的表或列的注释会被忽略。

SQL Server 的调用无论使用命名参数（SQL Server Management Studio 生成的脚本中每条注释都这样写：`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`），还是使用位置参数（编辑器的 MSSQL 导出就是这样写的），都能被读取。  
只有表或其某一列（第 2 级）上的 `MS_Description` 才会成为注释。其他属性，或者视图、索引、约束上的属性都不会成为注释，通过变量传入或用 `+` 拼接的注释也不会。

在注释中，与 `DEFAULT` 值或带引号的名称等任何带引号的文本一样，两个连续的引号表示一个引号，这也是 mysqldump 和 pg_dump 的写法：`'it''s'` 读作 `it's`。  
引号前的反斜杠（MySQL 和 MariaDB 写作 `'it\'s'`）同样会转义该引号。但如果这样的引号后面紧跟空白、`,`、`;`、`)`、`]`、`:`、`|`、`+` 或文件末尾，它仍会结束文本，因此 `'C:\'`、pg_dump 的 `'C:\'::text` 以及 T-SQL 的 `'C:\'+name` 都会保留其反斜杠。  
`DEFAULT` 值会保留其引号，无论文件以何种方式转义，其内部的引号都会以双写形式写回：`'it''s'`。  
如果导入时文档的数据库为 Databricks，单引号文本会改为遵循 Spark 的规则：每个反斜杠都会转义其后的字符，因此 `'C:\\dir'` 读作 `C:\dir`，`\n`、`\t` 和 `\u0041` 等转义序列会被解码，`DEFAULT` 值则保留为 `'it\'s'`。

导出的 Schema SQL 会转义表注释或列注释中的引号：MySQL、MariaDB 和 Snowflake 写为 `COMMENT 'it''s'`，PostgreSQL 和 Oracle 写为 `COMMENT ON TABLE` 与 `COMMENT ON COLUMN ... IS 'it''s'`，MSSQL 的 `sp_addextendedproperty` 调用中也采用同样的双写方式，表名和列名也包括在内。不含引号的注释会原样写出。  
Databricks 则改用反斜杠来转义引号和反斜杠，例如 `COMMENT 'it\'s'`，因此只有在所选数据库为 Databricks 时，其导出结果才能被原样读回。  
MSSQL 会将每条注释写为 `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`，列注释还会在其后加上 `'column', '<column>'`。当 `Bracket` 为 `None` 时，名为 `sales.users` 的表会得到 schema `sales` 和表 `users`，不带 schema 的名称则位于 `dbo` 中。`Bracket` 为其他任何值时，整个名称都作为表名，位于 `dbo` 中。

注释无法在 SQLite 的导出与导入往返中保留：SQLite 会将其写成普通的 `--` 行，而解析器不读取这些行。MSSQL 导出的 `sp_addextendedproperty` 调用再导入后，会还原为相同的表注释和列注释。

### GraphQL

可以导入 GraphQL SDL 文档。  
对象类型定义会变成表，`extend type` 块会合并到它所扩展的类型中，接口字段会被实现该接口的类型继承。  
类型为另一个表的字段会变成关系而不是列，两侧都是列表时会创建一张映射表。  
像 `buyer: User` 这样的单数字段，会首先与另一个类型上名称以 `By` 加该字段名结尾的那个字段配对，例如 `orderListByBuyer`，配对时忽略大小写和下划线；像 `buyer2` 这样带编号的字段会去掉编号后以同样的方式配对。当两个表之间有不止一个关系，或某个表引用自身时，代码生成的 GraphQL 输出就是这样命名这些字段的，因此这样的输出再导入后会带回每一个关系。  
根类型（`Query`、`Mutation`、`Subscription`）、内省类型，以及 Relay、federation 和 Hasura 的包装类型（例如 `PageInfo`、`*Connection`、`*Edge` 和 `*_aggregate`）会被视为噪声并跳过。  
`@id`、`@primaryKey`、`@unique`、`@autoincrement`、`@default`、`@map`、`@relation`、`@column`、`@table`、`@index` 和 `@db.*` 指令会被识别。  
文件名必须以 `.graphql`、`.gql` 或 `.graphqls` 结尾。Prisma 的 `schema.prisma` 文件不是 GraphQL 文档，无法在此导入。

### DBML

可以导入 DBML 文件，即 dbdiagram.io 和 dbdocs 使用的格式。  
会读取 `Table`、`TablePartial`、`Ref`、`Enum` 和 `TableGroup` 块。`Project` 以及独立的 `Note` 块会被跳过，且不影响周围的表。  
支持所有 ref 写法：`Ref:` 冒号形式、具名 ref、`Ref { }` 块形式，以及内联的 `[ref: > table.column]` 列设置。  
`<>` 多对多 ref 会创建一张以两侧名称命名的映射表。  
独立 ref 的 `delete` 与 `update` 设置会成为关系的 `On Delete` 与 `On Update`，例如 `Ref: users.id < posts.user_id [delete: cascade, update: set null]`。取值为 `cascade`、`restrict`、`set null`、`set default` 和 `no action`，不区分大小写。其他值或未设置时导入为 `Not set`，`color` 等其他设置会被忽略。  
内联的 `[ref: ...]` 设置不带操作，`<>` ref 的设置也不会带到映射表上。同一个外键既以内联方式又以独立 ref 声明时，会保留内联的那个，且不带操作。  
表的 `headercolor` 设置（例如 `Table users [headercolor: #3498DB]`）在其值为不带引号的 `#rgb` 或 `#rrggbb` 十六进制值时，会成为该表的颜色。其他值会被丢弃，`TablePartial` 的 `headercolor` 也不会传递给使用它的表。  
每个 `TableGroup` 都会成为一个[表分组](./table-groups.md)，其中包含它所列出的表，每行一个，表名的写法与 `Ref` 中相同。其 `[color: ...]` 按与 `headercolor` 相同的规则成为分组的颜色，其 note 和其他设置会被丢弃。被两个分组列出的表留在第一个分组中。最终不含任何表的分组不会被创建，无论它列出的表都不是文件中声明的，还是只列出了已被前面的分组占用的表。无论表被排布在哪里，分组的框都会调整为恰好围住其中的表；当表逐行排列时，同一分组的表会排在一起。  
文件名必须以 `.dbml` 结尾。

### AML

可以导入 AML（Azimutt Markup Language）文件。当前写法与旧版 v1 写法均受支持。  
实体会变成表，嵌套属性会被展平为带点的列名，例如 `settings.slug`。  
除非标记为 `nullable`，否则属性均为 `NOT NULL`，而编辑器中没有对应位置的结构（例如 `check`、`type` 和 `tags`）会被丢弃，而不会被拒绝。标记为视图的实体会作为普通表导入。  
实体的 `color`（例如 `users {color: red}`）会成为其表的颜色。AML 的颜色名称 `red`、`orange`、`amber`、`yellow`、`lime`、`green`、`emerald`、`teal`、`cyan`、`sky`、`blue`、`indigo`、`violet`、`purple`、`fuchsia`、`pink`、`rose` 和 `gray` 不区分大小写，带不带引号均可，每个名称都读作同名 Tailwind 颜色的 500 色阶，例如 `red` 对应 `#ef4444`。带引号的十六进制值（例如 `"#3498db"`）会按原样保留；不带引号的 `#3498db` 无法读取，因为 `#` 在 AML 中表示注释的开始。其他值，以及属性或关系上的 `color`，都会被丢弃。  
独立的 `rel` 语句（旧版写法中为 `fk`）会将其 `onDelete` 与 `onUpdate` 属性保留为关系的 `On Delete` 与 `On Update`，例如 `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`。取值为 `cascade`、`restrict`、`set null`、`set default` 和 `no action`，带不带引号均可，不区分大小写。其他属性会被丢弃。  
在 `user_id int -> users(id) {onDelete: cascade}` 这样的内联关系上，这些属性归属于所在的属性（即该列），因此会被丢弃，关系导入为 `Not set`。  
文件名必须以 `.aml` 结尾。

GraphQL、DBML 和 AML 都是可往返的格式，它们同时也是[代码生成](./code-generator.md)的目标格式。  
DBML 和 AML 在导入与导出两个方向上都会保留每个关系的 ON DELETE 与 ON UPDATE，参见[代码生成](./code-generator.md#on-delete-and-on-update)。GraphQL 两者都不保留，因此导入 GraphQL 时两者均为 `Not set`。  
DBML 还会在两个方向上保留表的颜色（透明度除外）以及每个包含表的表分组。没有名称的分组会还原为 `group_1`、`group_2` 等，重复的分组名则会加上 `_2`、`_3` 等后缀还原。AML 只会把表的颜色保留为与之最接近的颜色名称，因此 `#FF8800` 会写为 `orange`，再还原为 `#f97316`，并且 AML 不保留分组。GraphQL 既不保留颜色，也不保留分组。

## 导出 {#exporting}

画布右键菜单的 `Export` 子菜单中有三个条目：

- json：按图在文件中的保存形式，将图保存为 `.erd.json`：包括表及其列和索引、关系、备注和表分组，以及设置，每个[锁定的设置](./settings.md#锁定)都按其锁定的值保存。
- Schema SQL：打开 [Schema SQL](./schema-sql.md#saving-or-copying-the-sql) 标签页，同时打开其选项面板并让 `Save file` 按钮获得焦点，因此按 `Enter` 即可将该标签页显示的 SQL 保存为 `.sql`。在此之前不会保存任何内容。
- Image：打开 `Export image` 对话框，可将图保存为 `.png` 或 `.svg`，或以 PNG 格式复制到剪贴板，参见[图片](#image)。

三者在只读编辑器中均可使用。

Schema SQL 会在每个关系的 `REFERENCES` 之后写出其 ON DELETE 与 ON UPDATE，ON DELETE 在前。`Not set` 不会写出任何内容，所选数据库不接受的操作会被省略。各数据库接受哪些操作参见[编辑关系](./relationship-editing.md#on-delete-and-on-update)。

每个导出的文件都以 `<数据库名>-<时间戳>` 加上其扩展名命名，其中时间戳采用本地时间，格式为 `yyyy-MM-dd'T'HH_mm_ss`，例如 `my-schema-2026-08-29T04_05_06.erd.json`。数据库名为空时会退回为 `unnamed`。  
Schema SQL 标签页和[代码生成](./code-generator.md)的 `Save file` 也以同样的方式为文件命名。图片使用的是打开对话框时的数据库名。

`Import`、`Import and Add` 与 `Export` 也可以从 ERD 标签页的[快速搜索](./quick-search.md)中使用，其中的条目与画布右键菜单相同。在每个标签页中，快速搜索还提供 `Export: Schema SQL`，它与 `Export` ▸ `Schema SQL` 一样，会打开 Schema SQL 标签页以便保存，参见[保存或复制 SQL](./schema-sql.md#saving-or-copying-the-sql)。

在 Obsidian 中不会出现下载或保存对话框：文件会写入仓库中 Obsidian 为该图存放新附件的位置，并显示一条提示告知其路径。  
Obsidian 不允许在文件名中使用的字符 `\ / : * ? " < > |` 会被替换为 `-`。  
只有在 Settings → Files and links → Detect all file extensions 开启时，Obsidian 的文件列表才会列出导出的 `.erd.json` 或 `.sql` 文件。

### 图片 {#image}

从画布右键菜单或快速搜索中选择 `Export` ▸ `Image`，会打开 `Export image` 对话框：图片的预览位于其选项旁边。打开该对话框会关闭查找与替换。

![打开 Export > Image，关闭深色模式和背景，选择 3x，再将图片复制到剪贴板](/img/demo-export.webp)

- `Background`：默认开启。关闭后画布背景为透明。
- `Dark mode`：初始状态与编辑器的外观一致。当它与屏幕上的外观一致时，图片会采用画布自身的颜色，包括在[主题构建器](./language-and-theme.md)中所做的更改；另一种外观则使用灰阶色和强调色相同的预设。
- `Scale`：`1x`、`2x` 或 `3x`，默认选择 `2x`。它只决定 PNG 和剪贴板副本的尺寸，其下方的一行会以 `PNG <width> × <height> px` 的形式给出该尺寸。

这些选择会一直保留到编辑器关闭，并且从不保存到文档中。预览的绘制方式与图片相同，`Background` 或 `Dark mode` 改变时会重新绘制。

图片包含的是打开对话框时的图；要纳入之后的更改，请关闭并重新打开对话框。无论视图平移到多远，图片都会包含整张图，按图绘制出的范围加上一圈外边距裁切，并且无论编辑器当前显示的缩放级别如何，始终以 100% 绘制，因此每个表都会完整绘制。[View Option](./table-related-functions.md#table-view-options) 隐藏的内容（关系、关系的 ON DELETE 与 ON UPDATE 标签、表分组或备注）既不会被绘制，也不会为其留出空间，表分组则绘制在其他所有内容的后面。

有三个按钮用于写出图片，按下其中任何一个后对话框都会保持打开：

- `PNG`：保存一个 `.png`，其尺寸为图在 100% 时的尺寸乘以 `Scale`。对于大到浏览器画布无法容纳的 PNG，编辑器不会因此失败，而是降低分辨率写出：对话框会事先以 `Reduced from <width> × <height> px, past what a browser canvas can hold` 发出警告，之后还会显示一条 `Exported at a reduced resolution` 提示说明这一点。
- `SVG`：保存一个 `.svg`，其尺寸为图在 100% 时的尺寸，与 `Scale` 无关，并且从不降低分辨率。其中的文本保持为文本，字体只按名称引用而不嵌入，因此没有编辑器所用字体的查看器会改用其他字体绘制。阴影会被省略。
- `Copy to clipboard`：以所选的 `Scale` 将 PNG 放入剪贴板，当浏览器画布无法容纳时，会与保存的 PNG 一样降低分辨率。成功时会以 `Copied the image to the clipboard` 确认，图片被降低分辨率时则显示 `Copied at a reduced resolution`。如果复制失败（因为浏览器或宿主拒绝访问剪贴板，或图片无法绘制），`Couldn't copy the image` 会建议改为保存 PNG。

宿主环境运行后台 worker 时，图片会在其中绘制，因此期间编辑器仍可继续使用。当绘制无法在片刻内完成时，会显示 `Exporting PNG`、`Exporting SVG` 或 `Copying image` 提示；失败时会报告 `Couldn't export the PNG` 或 `Couldn't export the SVG`。在文件仍在绘制时关闭对话框，不会阻止该文件被保存。

对话框打开时 `PNG` 获得焦点，`Tab` 会停留在对话框内。按 `Escape`、点击 `x` 按钮或点击对话框周围变暗的区域即可将其关闭。  
对话框打开期间，画布快捷键（包括 Undo 与 Redo）以及复制和粘贴都不起作用。`Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 会关闭对话框并打开快速搜索，`Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 会关闭对话框并打开查找与替换。
