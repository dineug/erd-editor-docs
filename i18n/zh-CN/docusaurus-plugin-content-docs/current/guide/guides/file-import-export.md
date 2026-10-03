---
sidebar_position: 2
description: 导入 JSON、schema SQL、GraphQL、DBML 或 AML，导出 JSON、schema SQL 或 PNG。
---

# 导入与导出文件

## 导入外部文件

可以从右键菜单的 `Import` 子菜单导入以下五种格式：

- json
- Schema SQL
- GraphQL
- DBML
- AML

如果所选文件的扩展名与所选格式不符，导入会被取消并显示提示。

导入会替换当前文档，而不是合并到当前文档中。  
JSON 文件会带上自身的设置。其他格式则保留现有设置，仅视图位置和缩放级别除外，并且文件读取后会自动排列表。  
GraphQL、DBML 和 AML 解析器不会失败，无法读取的文件只会生成空白的图，而不会报错。

### JSON

可以导入[编辑器定义的 schema 格式](../../api/advanced/schema.md)文件。
文件名必须以 `.json` 结尾，因此导出的 `<数据库名>-<时间戳>.erd.json` 文件可以原样导入回来，而此处不接受单纯的 `.erd` 或 `.vuerd` 文件。

![通过 Import > json 导入已保存的文件，连同设置一起替换草稿文档](/img/demo-import-json.webp)

### Schema SQL

也可以导入用 SQL 定义的 schema 文件。  
解析器已尽量做到与数据库厂商无关且足够宽松，但仍可能存在不支持的语法。  
文件名必须以 `.sql` 结尾。  
[支持的语法可在此查看。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![通过 Import > Schema SQL 导入 SQL 文件，再缩小查看自动排列的表](/img/demo-import-sql.webp)

列只从 `CREATE TABLE` 中读取。通过 `ALTER TABLE ... ADD COLUMN` 添加的列不会被读取。  
`CREATE TABLE` 中不是列的项会被跳过，而不会被当作列读取：未命名的 `CHECK (...)`、PostgreSQL 的 `LIKE` 与 `EXCLUDE`、不带 `INDEX` 或 `KEY` 的 MySQL `FULLTEXT` 与 `SPATIAL`、T-SQL 的 `PERIOD FOR`，以及 Oracle 的 `SUPPLEMENTAL LOG DATA`。  
名称与其中某一项相同的列，只要名称后面跟着内置类型（例如 `exclude BOOLEAN`），或名称带有引号（例如 `"check" int`），仍会被导入。未加引号的 `like` 后面跟着非内置类型时（例如 `like citext`），会被当作 PostgreSQL 的 `LIKE` 读取并跳过。  
`CHECK` 约束本身不会被导入，因为编辑器中没有可以存放它们的位置。

#### 数据类型 {#data-types}

列的数据类型会连同参数列表一起被保留，即使它不是任何[支持的数据库](./table-related-functions.md#databases)的内置类型。  
这包括用 `CREATE TYPE` 创建的枚举或复合类型、用 `CREATE DOMAIN` 创建的域、`hstore`、`citext` 和 `ltree` 等扩展类型、`public.mood` 这样带 schema 限定的名称，以及 `"MyType"` 和 `[dbo].[Phone]` 这样带引号或方括号的名称，后者会保留其引号或方括号。`CREATE TYPE`、`CREATE DOMAIN` 和 `CREATE EXTENSION` 语句本身会被跳过。  
内置类型会去掉其引号或方括号，因此 `[int]` 导入为 `int`，`[nvarchar](50)` 导入为 `nvarchar(50)`。PostgreSQL 的 `"char"` 和 `"bit"` 会保留引号，因为它们是与 `char` 和 `bit` 不同的类型。  
任何类型上的数组后缀都会保留：`integer[]`、`text[3][3]`、`integer ARRAY`、`mood[]`。SQLite 的 `UNSIGNED BIG INT` 会被完整导入。  
`ENUM(...)` 和 `SET(...)` 的值会保留引号，值内部的引号会双写，例如 `ENUM('a','it''s')`。MySQL 用反斜杠转义的 `'it\'s'` 导入时也会同样改为双写。在 Databricks 的 `STRUCT<...>` 类型中，带引号的字段名和字段的 `COMMENT` 会保留引号。  
没有写类型的列（例如 SQLite 中没有类型的列，或用 `AS` 计算的列）仍保持没有类型：`NOT`、`NULL`、`DEFAULT`、`PRIMARY` 或 `REFERENCES` 等关键字，以及单引号字符串，都不会被当作类型读取。

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
导出的 Schema SQL 再导入后，会带回该数据库所写出的操作，因此它省略的操作（例如 MySQL 的 `SET DEFAULT`，或 Oracle 的任何 `ON UPDATE`）会还原为 `Not set`。

#### 注释 {#comments}

表与列的注释会从解析器支持的两种语法中导入：MySQL、MariaDB、Snowflake 和 Databricks 使用的 `COMMENT` 表选项与列属性，以及 PostgreSQL 和 Oracle 使用的 `COMMENT ON TABLE` 与 `COMMENT ON COLUMN` 语句。  
指向文件中未定义的表或列的注释会被忽略。

在注释中，与 `DEFAULT` 值或带引号的名称等任何带引号的文本一样，两个连续的引号表示一个引号，这也是 mysqldump 和 pg_dump 的写法：`'it''s'` 读作 `it's`。  
引号前的反斜杠（MySQL 和 MariaDB 写作 `'it\'s'`）同样会转义该引号。但如果这样的引号后面紧跟空白、`,`、`;`、`)`、`]`、`:`、`|`、`+` 或文件末尾，它仍会结束文本，因此 `'C:\'`、pg_dump 的 `'C:\'::text` 以及 T-SQL 的 `'C:\'+name` 都会保留其反斜杠。  
`DEFAULT` 值会保留其引号，无论文件以何种方式转义，其内部的引号都会以双写形式写回：`'it''s'`。  
如果导入时文档的数据库为 Databricks，单引号文本会改为遵循 Spark 的规则：每个反斜杠都会转义其后的字符，因此 `'C:\\dir'` 读作 `C:\dir`，`\n`、`\t` 和 `\u0041` 等转义序列会被解码，`DEFAULT` 值则保留为 `'it\'s'`。

导出的 Schema SQL 会转义表注释或列注释中的引号：MySQL、MariaDB 和 Snowflake 写为 `COMMENT 'it''s'`，PostgreSQL 和 Oracle 写为 `COMMENT ON TABLE` 与 `COMMENT ON COLUMN ... IS 'it''s'`，MSSQL 的 `sp_addextendedproperty` 调用中也采用同样的双写方式，表名和列名也包括在内。不含引号的注释会原样写出。  
Databricks 则改用反斜杠来转义引号和反斜杠，例如 `COMMENT 'it\'s'`，因此只有在所选数据库为 Databricks 时，其导出结果才能被原样读回。

注释无法在 SQLite 或 MSSQL 的导出与导入往返中保留，SQLite 会将其写成普通的 `--` 行，MSSQL 会将其写成 `sp_addextendedproperty` 调用，而解析器两者都不读取。

### GraphQL

可以导入 GraphQL SDL 文档。  
对象类型定义会变成表，`extend type` 块会合并到它所扩展的类型中，接口字段会被实现该接口的类型继承。  
类型为另一个表的字段会变成关系而不是列，两侧都是列表时会创建一张映射表。  
根类型（`Query`、`Mutation`、`Subscription`）、内省类型，以及 Relay、federation 和 Hasura 的包装类型（例如 `PageInfo`、`*Connection`、`*Edge` 和 `*_aggregate`）会被视为噪声并跳过。  
`@id`、`@primaryKey`、`@unique`、`@autoincrement`、`@default`、`@map`、`@relation`、`@column`、`@table`、`@index` 和 `@db.*` 指令会被识别。  
文件名必须以 `.graphql`、`.gql` 或 `.graphqls` 结尾。Prisma 的 `schema.prisma` 文件不是 GraphQL 文档，无法在此导入。

### DBML

可以导入 DBML 文件，即 dbdiagram.io 和 dbdocs 使用的格式。  
会读取 `Table`、`TablePartial`、`Ref` 和 `Enum` 块。`Project`、`TableGroup` 以及独立的 `Note` 块会被跳过，且不影响周围的表。  
支持所有 ref 写法：`Ref:` 冒号形式、具名 ref、`Ref { }` 块形式，以及内联的 `[ref: > table.column]` 列设置。  
`<>` 多对多 ref 会创建一张以两侧名称命名的映射表。  
独立 ref 的 `delete` 与 `update` 设置会成为关系的 `On Delete` 与 `On Update`，例如 `Ref: users.id < posts.user_id [delete: cascade, update: set null]`。取值为 `cascade`、`restrict`、`set null`、`set default` 和 `no action`，不区分大小写。其他值或未设置时导入为 `Not set`，`color` 等其他设置会被忽略。  
内联的 `[ref: ...]` 设置不带操作，`<>` ref 的设置也不会带到映射表上。同一个外键既以内联方式又以独立 ref 声明时，会保留内联的那个，且不带操作。  
文件名必须以 `.dbml` 结尾。

### AML

可以导入 AML（Azimutt Markup Language）文件。当前写法与旧版 v1 写法均受支持。  
实体会变成表，嵌套属性会被展平为带点的列名，例如 `settings.slug`。  
除非标记为 `nullable`，否则属性均为 `NOT NULL`，而编辑器中没有对应位置的结构（例如 `check`、`view`、`type`、`color` 和 `tags`）会被丢弃，而不会被拒绝。  
独立的 `rel` 语句（旧版写法中为 `fk`）会将其 `onDelete` 与 `onUpdate` 属性保留为关系的 `On Delete` 与 `On Update`，例如 `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`。取值为 `cascade`、`restrict`、`set null`、`set default` 和 `no action`，带不带引号均可，不区分大小写。其他属性会被丢弃。  
在 `user_id int -> users(id) {onDelete: cascade}` 这样的内联关系上，这些属性归属于所在的属性（即该列），因此会被丢弃，关系导入为 `Not set`。  
文件名必须以 `.aml` 结尾。

GraphQL、DBML 和 AML 都是可往返的格式，它们同时也是[代码生成](./code-generator.md)的目标格式。  
DBML 和 AML 在导入与导出两个方向上都会保留每个关系的 ON DELETE 与 ON UPDATE，参见[代码生成](./code-generator.md#on-delete-and-on-update)。GraphQL 两者都不保留，因此导入 GraphQL 时两者均为 `Not set`。

## 导出 {#exporting}

导出支持以下三种格式：

- json：编辑器定义的 schema 文件。保存为 `.erd.json`。
- Schema SQL：按照数据库厂商语法生成的 schema 文件。保存为 `.sql`。
- png：将图导出为图片。保存为 `.png`。

Schema SQL 会在每个关系的 `REFERENCES` 之后写出其 ON DELETE 与 ON UPDATE，ON DELETE 在前。`Not set` 不会写出任何内容，所选数据库不接受的操作会被省略。各数据库接受哪些操作参见[编辑关系](./relationship-editing.md#on-delete-and-on-update)。

无论视图平移到多远，PNG 都会包含整张图：按图本身绘制出的范围加上一圈外边距裁切，并以编辑器当前显示的缩放级别绘制。想要更大的图片，可以在导出前先放大。  
绘制在后台 worker 中进行，因此期间编辑器仍可继续使用；当导出无法在片刻内完成时（例如大型图），会用提示告知正在导出。对于大到浏览器画布无法栅格化的图，编辑器不会因此导不出文件，而是降低分辨率保存，并用提示说明这一点。

每个导出的文件都以 `<数据库名>-<时间戳>` 加上对应的扩展名命名，其中时间戳的格式为 `yyyy-MM-dd'T'HH_mm_ss`，例如 `my-schema-2026-08-29T04_05_06.erd.json`。数据库名为空时会退回为 `unnamed`。

![从 Export 子菜单中选择 png，以及较久的导出会显示的提示](/img/demo-export.webp)

`Import` 与 `Export` 也可以从[快速搜索](./quick-search.md)中使用。其中提供相同的五种导入格式，但导出仅支持 `json` 和 `Schema SQL`，PNG 仅能从右键菜单导出。

在 Obsidian 中不会出现下载或保存对话框：文件会写入仓库中 Obsidian 为该图存放新附件的位置，并显示一条提示告知其路径。  
Obsidian 不允许在文件名中使用的字符 `\ / : * ? " < > |` 会被替换为 `-`。  
只有在 Settings → Files and links → Detect all file extensions 开启时，Obsidian 的文件列表才会列出导出的 `.erd.json` 或 `.sql` 文件。
