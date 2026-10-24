---
sidebar_position: 4
description: erd-editor MCP 服务器提供的所有工具：一次一页地读取文档、词典检查、67 个编辑工具、erd_batch，以及结果与拒绝的格式。
---

# 工具

服务器提供 77 个工具：五个会话工具、四个读取工具、67 个编辑工具（每种编辑操作一个），以及把多个编辑工具作为一次编辑执行的 `erd_batch`。

除 `erd_list_documents` 外，每个工具都以文档的 `path` 作为第一个参数，下面的表格中省略了它。
标有 `?` 的参数是可选的。

## 会话工具

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_list_documents` | | 列出 ERD 文档及其 `path`、`open`、`active`、`dirty` 和 `readonly`：有编辑器为工作目录提供服务时列出该编辑器的文档（在 JetBrains IDE 中涵盖每个已打开的项目），否则列出工作目录下的 ERD 文件。 |
| `erd_open_document` | `create?` | 打开文档以便编辑，如果有编辑器为其提供服务，则在该编辑器的 ERD Editor 中打开。带 `create` 时，如果文件不存在会先创建它，没有扩展名的名称会加上 `.erd.json`。 |
| `erd_save` | | 保存编辑器持有的文档。VS Code 会让智能体的编辑在调用它之前一直保持未保存状态；Obsidian 和 JetBrains IDE 会像保存你的编辑一样保存它们，而它会立即写入这些编辑。在无头模式下，每次编辑都已写入（其结果中的 `saved: true` 即表明这一点），因此它什么也不做。 |
| `erd_undo` | | 撤回该智能体所做的最后一次编辑，而绝不会撤回你的编辑。没有产生 Undo 记录的调用会被跳过并列出。 |
| `erd_redo` | | 重新应用 `erd_undo` 最近撤回的编辑。 |

关于保存和 Undo 在每种模式下的行为，参见[实时与无头模式](./live-and-headless.md)。

## 读取文档 {#reading-a-document}

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | 先是设置与数量统计，然后是一页表，并带有它们的索引与关系；每个表附带其 id、在画布上的位置和大小、列数、逻辑名（如果有的话），以及它所属的表分组（如果属于某个分组）。除非是在搜索，否则表之后依次是表分组、备注，然后是域、术语和词根。 |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | 完整返回所指定的实体：表附带其列及其所属的表分组，关系附带其列及其 `onDelete` 和 `onUpdate`，索引附带其列，备注附带其文本，表分组附带其中的表，词根、术语和域则附带其所有字段。 |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | 以四种格式之一一次性返回整个文档，或者只返回部分表或部分表分组的 DDL。 |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | 词根、术语和域这三个词典所发现的问题，与编辑器 Dictionary 标签页的 `Checks` 工作表所列出的相同，一次一页。它不会更改任何内容，参见[词典检查](#dictionary-checks)。 |

智能体用 `erd_list` 查找 id，用 `erd_get` 读取列、词典行及其他详细信息，再把这些 id 传给编辑工具。
`erd_list` 中表的大小是它在画布上占据的方框：高度是精确的，宽度是近似的。
表分组按其存储的矩形列出，并附带其名称、颜色以及其中所含表的数量。
每条关系只列出一次，随其两个表中的一个列出。
词典行按其 id、`name` 以及它为物理名或列提供的内容列出：域的 `dataType`、术语的 `physicalName` 和 `domainId`，以及词根的 `abbreviation`。每个词典都按其工作表中显示的顺序列出各行。
`erd_list` 和 `erd_read` 报告的设置是文件所保存的设置，参见[设置](#settings)。

在 `erd_get` 和 `erd_read` 的 `snapshot` 格式中，每个表和列都带有其 `logicalName`（没有时为空字符串）和 `nameDerived`；名称由词典生成时 `nameDerived` 为 `true`，此时新的逻辑名会重新生成该名称，参见[词典](#dictionaries)。
每个列都带有其 `domainId`，每个术语也是如此：没有域时，或者所关联的域已不在文档中列出时，为空字符串。

`erd_read` 接受以下四种格式之一：

| `format` | 返回内容 |
| --- | --- |
| `snapshot` | 包含每个实体及其 id 的紧凑 JSON，其中包括表分组和词根、术语、域的各行，以及设置和 Schema SQL 脚本。它省略因查看者而异的内容：测量出的宽度、叠放顺序、视图、标签页和名称显示。schema 较大时体积也较大。 |
| `sql` | 八种数据库之一的 DDL：`Databricks`、`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`Snowflake` 或 `SQLite`。`vendor` 默认为文档所设置的数据库。整个文档的 DDL 包含其前置脚本和后置脚本。指定 `tableIds`、`tableNames` 或 `groupNames` 时，只返回这些表，以及它们持有的外键，不包含脚本。外键会带有其 ON DELETE 与 ON UPDATE 操作，目标数据库省略的操作除外，参见 [ON DELETE 与 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。 |
| `json` | 与保存时写出的文件完全相同的整个文档，包括编辑器尚未保存的编辑，参见[存储形式与运行时值](../api/advanced/schema.md#存储形式与运行时值)。 |
| `scripts` | 只返回文档的前置脚本和后置脚本，形式为 `{"before":"…","after":"…"}`，未设置的脚本为空，无论 schema 有多大。 |

只有 `sql` 格式接受 `vendor`、`statements`、`header`、`logicalNameAsComment`、`tableIds`、`tableNames` 和 `groupNames`，其他格式会拒绝它们。

- `statements`：`create`，即默认值；`ifNotExists`，它在 MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 上写出 `CREATE TABLE IF NOT EXISTS`，在其他数据库上写出普通的 `CREATE TABLE`；或者 `recreate`，它会先删除这些表再创建它们，Snowflake 则改为写出 `CREATE OR REPLACE TABLE`。
- `header`：`none`，即默认值；`use`，它会选择文档的数据库名称所指定的数据库或 schema；或者 `createAndUse`，它会先创建该数据库或 schema。Oracle 只具备 `use`，因此 `createAndUse` 在那里写出 `use`；PostgreSQL 只具备 `createAndUse`，因此 `use` 在那里不写出任何头部。SQLite 不写出头部，数据库名称为空或不是普通标识符时，任何数据库都不写出头部。
- `logicalNameAsComment`：`true` 会在表或列的注释为空或只含空白时，把其逻辑名作为注释写出，写出的位置和形式与各数据库写出注释时相同，并保留每条含有文本的注释；`false`，即默认值，不写出任何逻辑名，参见[将逻辑名作为注释](../guide/guides/schema-sql.md#logical-names-as-comments)。
- `groupNames`：所指定的表分组中的表，按名称指定，不区分大小写，并与 `tableIds` 和 `tableNames` 合并。没有匹配任何分组的名称会以 `notFound` 被拒绝。不含任何表的分组不会增加任何表；最终不含任何表的读取（例如所指定的每个分组都为空且没有指定任何表）会以 `invalidArgs` 被拒绝。

`statements`、`header` 和 `logicalNameAsComment` 同样适用于部分表的 DDL。它们的作用与编辑器 [Schema SQL](../guide/guides/schema-sql.md#options-panel) 标签页中的 `Statements` 和 `Header` 选项以及 `Write logical names into empty comments` 开关相同，不过该标签页的初始值为 `If not exists` 和 `CREATE + USE`。该开关初始为关闭，与 `logicalNameAsComment` 相同。
名称会用文件所保存的括号类型加引号，`Bracket Type` 锁定期间则使用锁定的括号类型，参见[锁定](../guide/guides/settings.md#锁定)。

### 大型 schema

包含数百乃至数千个表的 schema 同样可以处理。
一次读取最多返回 40,000 个字符，低于 Claude Code 把工具结果另存到文件中的阈值。

- `erd_list` 默认返回一页 100 项，依次是表、表分组、备注、域、术语和词根，所有这些共用同一个偏移量，并通过 `nextOffset` 和 `note` 说明下一页从哪里开始。把该 `nextOffset` 作为 `offset` 传入，并使用相同的 `query`。
- `query` 按表名、列名、逻辑名或注释中的词查找表，不区分大小写。名称或逻辑名中包含更多这些词的表排在前面。搜索不会列出表分组、备注或词典行。
- `namesOnly` 只列出表名，一次返回约 2,000 个短名称。
- `erd_get` 和 `erd_read` 除了 id 之外也接受 `tableNames`，`erd_read` 还接受 `groupNames`，因此当智能体被要求在大型 schema 上编写 SQL 查询时，只需读取它所需表的 DDL。
- 词典同样可以分部分读取：`erd_list` 在表之后分页列出其各行，`erd_get` 则按 `domainIds`、`termIds` 和 `wordIds` 完整返回各行。
- `erd_get` 会把没有对应任何实体的 id 和名称列在 `missing` 下，把一次返回放不下的 id 列在 `notReturned` 下，以便再次请求。
- `erd_list_checks` 同样一次返回一页，参见[词典检查](#dictionary-checks)。
- 一次返回放不下的读取会以 `tooLarge` 被拒绝，并说明如何缩小范围。

### 词典检查 {#dictionary-checks}

`erd_list_checks` 按相同的顺序列出编辑器 [Checks 工作表](../guide/guides/dictionary.md#the-checks-sheet)中的检查项：先是词根的检查项，然后是术语和域的检查项，每个词典都按其工作表中显示的顺序排列，最后是每个表，其后紧跟它的各列。
与在工作表上一样，只有当某项检查所读取的词典中至少有一行时，该检查才会运行。词典中没有任何词根、术语或域的文档完全不会被检查：`total` 为 `0`，`note` 也会说明这一点。

- `level`：`error` 或 `warning`，只列出该级别；默认两者都列出。
- `tableIds` 和 `tableNames`：只列出这些表及其列的检查项，名称不区分大小写，这样会略去词典自身各行的检查项。没有对应任何表的 id 或名称会以 `notFound` 被拒绝。
- `offset` 和 `limit`：默认每页 100 项检查，一次返回装满时该页也会就此截止。后面还有更多检查项时，`nextOffset` 和 `note` 会说明下一页从哪里开始；把它作为 `offset` 传入，并使用相同的筛选条件。修复部分检查项之后，请从偏移量 `0` 重新列出：已修复的检查项会离开列表，因此继续使用靠后的偏移量会跳过仍未修复的检查项。

返回内容包含 `total`，即筛选条件保留下来的检查项数量；`counts`，即其中每种代码各有多少项，不含数量为零的代码；以及作为 `checks` 的当前页。
每个检查项都给出其 `level`、`code`，以及其目标的 `kind`（`table`、`column`、`word`、`term` 或 `domain`）和 `id`。列的检查项还会附带其 `tableId`，以及作为 `table` 的所属表名称。
`name` 是目标的名称，对于表或列即其物理名，有逻辑名时还会附带其 `logicalName`。`field` 是该检查所读取的字段：`name`、`logicalName` 或 `domainId`。`text` 是在那里发现的内容，`suggestions`（词典提供建议时才有）则是应改用的内容。因此，智能体无需调用 `erd_get` 即可修复检查项：

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | 工作表上的 `Type` | 发现的问题 |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | 同一个词典中两行共用的名称。其中每一行都会被列出。 |
| `unknownDomain` | `error` | `Unknown domain` | 关联了文档已不再列出的域的列或术语。`text` 为该域的名称，名称未知时为其 id。 |
| `forbiddenWord` | `error` | `Forbidden word` | 表或列的逻辑名中或术语名称中，被某个词根列为禁用词的词。`suggestions` 为标准词根。 |
| `unregisteredWord` | `warning` | `Unregistered word` | 出现在相同位置、没有任何词根列出的文本。 |
| `synonymWord` | `warning` | `Synonym` | 出现在相同位置、用来代替标准词根的同义词。`suggestions` 为标准词根。 |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | 表或列的物理名与其逻辑名对应的术语所给出的物理名不同。建议值为该术语的物理名；术语没有物理名时，则为其词根组合出的物理名。 |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | 数据类型与其所关联的域的数据类型不同的列。`text` 为该列的类型，建议值则为该域的类型。 |

每项检查如何读取名称，参见[各项检查发现的问题](../guide/guides/dictionary.md#what-each-check-finds)。

## 编辑工具

id 来自 `erd_list` 和 `erd_get`，或者来自创建该实体的那次调用的 `createdIds`。
新的 id 由 25 个小写字母和数字组成，例如 `03h17be2plxpj5n59tqag7ogj`，而文档中已有的 id 保持其原有形式，因此不要从 id 的形式推断任何含义。
`x` 和 `y` 是在画布上的左边缘和上边缘，以像素为单位；颜色是 CSS 十六进制颜色，例如 `#3b82f6`，或者是表示去掉颜色的空字符串。

### 表

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_table` | | 在空闲位置添加一个空表，并在 `createdIds` 中返回其 id。 |
| `erd_remove_table` | `tableId` | 删除表，连同其列、索引以及与它相连的所有关系。 |
| `erd_change_table_name` | `tableId`, `value` | 重命名表。此后该名称算作手动填写的名称，因此只要它不为空，之后设置的逻辑名就不会改变它，参见[词典](#dictionaries)。 |
| `erd_change_table_comment` | `tableId`, `value` | 设置表的注释。空字符串会清除注释。 |
| `erd_set_table_logical_name` | `tableId`, `value` | 设置表的逻辑名。空字符串会清除逻辑名并保留名称。表名为空或由词典生成时，词典会根据逻辑名生成表名，参见[词典](#dictionaries)。术语不会为表提供域。 |
| `erd_change_table_color` | `tableId`, `color` | 设置表的颜色。 |
| `erd_move_table` | `tableId`, `x`, `y` | 将表移动到画布上的某个位置。 |
| `erd_move_tables` | `positions` | 在一次编辑中移动多个表，一次 `erd_undo` 即可撤回。`positions` 中每个表对应一个 `{ tableId, x, y }`，每个表最多出现一次。 |
| `erd_sort_tables` | | 将所有表按行排列在画布上，列数最少的在前，与 `erd_import_sql`、`erd_import_graphql`、`erd_import_dbml` 和 `erd_import_aml` 放置表的方式相同。表分组中的表会聚在一起，每个分组的框都会调整为恰好围住其中的表。 |

### 列

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | 向表中添加一个空列，并在 `createdIds` 中返回其 id。 |
| `erd_remove_columns` | `tableId`, `columnIds` | 从一个表中删除列，连同使用这些列的关系与索引条目。 |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | 重命名列。此后该名称与表名一样算作手动填写的名称。 |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | 设置数据类型，例如 `INT` 或 `VARCHAR(255)`。[关系数据类型同步](../guide/guides/settings.md#关系数据类型同步)开启期间，该修改会像在编辑器中一样沿着关系双向传递：serial 类型会以其存储的整数类型传到外键，与 `erd_add_relationship` 复制它时相同；而当 serial 类型的键的某个外键发生变化时，该键会保留自己的类型，修改也就在那里停止。该同步由用户开启或关闭，`erd_list` 会将其报告为 `relationshipDataTypeSync`。关联到域的列被设为与该域不同的类型时，会取消与该域的关联；同步所到达的每个列，如果其新类型与它自己所关联的域的类型不同，也会取消关联，参见[取消关联](../guide/guides/dictionary.md#unlinking)。 |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | 以 SQL 文本设置默认值。空字符串会清除默认值。 |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | 设置注释。空字符串会清除注释。 |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | 设置列的逻辑名。空字符串会清除逻辑名并保留名称。列名为空或由词典生成时，词典会生成列名，术语的域则会关联该列并为其设置该域的数据类型，参见[词典](#dictionaries)。 |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | 将列关联到一个域，该域按 id 或按名称指定，两者择一。该列会采用该域的数据类型，关系数据类型同步开启期间，该类型会沿着关系传递，并与 `erd_change_column_data_type` 一样取消关联。`domainId` 为 `null` 或空字符串，或者 `domainName` 为空时，会取消该列的关联并保留其类型。 |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` 将该列加入主键，`false` 将其移出主键。 |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | 设置该列是否唯一。 |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | 设置该列是否为 `NOT NULL`。 |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | 设置该列是否自动递增。 |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | 在表内将列移动到另一列的位置。 |

### 关系

`relationshipType` 是子表一端的基数：`ZeroOne`、`ZeroN`、`OneOnly` 或 `OneN`。
起始表是父表，即持有主键的被引用一方，结束表是子表。
`onDelete` 和 `onUpdate` 是外键的 ON DELETE 与 ON UPDATE 操作：`none`、`noAction`、`cascade`、`setNull`、`setDefault` 或 `restrict`。
`none` 不写出任何子句，因此由数据库的默认行为决定，参见 [ON DELETE 与 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。
`erd_add_relationship` 或 `erd_link_columns` 中省略的操作为 `none`。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | 关联两个表。它会把父表的主键作为外键列复制到子表中，如果父表没有主键，则先创建一个主键列。每个外键列的命名方式与在编辑器中绘制关系时相同：`users` 的键 `id` 会变为 `users_id`，像 `member_id` 这样的键则保持原名，参见[外键列名](../guide/guides/relationship-editing.md#foreign-key-column-names)。每个外键列都沿用其对应键的数据类型，但 serial 类型的键对应其存储的整数类型，例如 `serial4` 对应 `integer`，而单独的 `serial` 在 PostgreSQL、MySQL 和 MariaDB 之外仍为 `serial`，参见[识别关系](../guide/guides/relationship-editing.md#识别关系)。每个外键列还会沿用其对应键的逻辑名，并关联其对应键所关联的域，除非 serial 类型的键为它提供了另一种类型。`createdIds` 依次包含新建的主键列（如果创建了的话）、外键列，最后是关系 id。 |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | 在已存在的列之间绘制关系，按位置将起始列与结束列配对。它不会重命名任何列，不会更改任何数据类型，也不会复制任何逻辑名或域。 |
| `erd_remove_relationship` | `relationshipId` | 删除关系连接线。其外键列会保留在表中。 |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | 修改关系的基数。 |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | 设置关系的 ON DELETE 操作：删除父表中的一行时，如何处理子表中引用它的行。 |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | 设置关系的 ON UPDATE 操作：修改父表中某一行的键时，如何处理子表中引用它的行。 |

`erd_add_relationship` 在运行时为外键列命名，并复制其对应键的逻辑名。之后对键所做的重命名或设置的逻辑名不会传到这些外键列，因此请先为父表及其主键命名，并为该键设置逻辑名。
它给出的名称算作手动填写的名称，因此之后设置的逻辑名不会改变它们，而 `erd_derive_physical_names` 会把它们交还给词典，参见[词典](#dictionaries)。

没有任何工具能像编辑器的[映射列](../guide/guides/relationship-editing.md#map-columns)那样修改已有关系的列。
要把关系映射到其他列上，请在一次 `erd_batch` 中运行 `erd_remove_relationship`（它会把外键列保留在表中）和指定所需列的 `erd_link_columns`，一次 `erd_undo` 即可撤回。

### 索引

索引列 id 是 `erd_get` 给出的索引列列表中的条目，而不是表中列的 id。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_index` | `tableId` | 向表中添加一个空索引，并在 `createdIds` 中返回其 id。 |
| `erd_remove_index` | `indexId` | 删除索引。 |
| `erd_change_index_name` | `indexId`, `value` | 重命名索引。 |
| `erd_set_index_unique` | `indexId`, `value` | 设置索引是否唯一。 |
| `erd_add_index_column` | `indexId`, `columnId` | 添加索引所属表中的一列，并返回新的索引列 id。已在索引中的列保持不变。 |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | 从索引中删除一列。 |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | 在索引内将一列移动到该索引另一列的位置。 |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | 设置索引中某一列的排序方式：`ASC` 或 `DESC`。 |

### 备注

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_memo` | | 在空闲位置添加一个空备注，并在 `createdIds` 中返回其 id。 |
| `erd_remove_memo` | `memoId` | 删除备注。 |
| `erd_change_memo_value` | `memoId`, `value` | 替换备注的文本。 |
| `erd_change_memo_color` | `memoId`, `color` | 设置备注的颜色。 |
| `erd_move_memo` | `memoId`, `x`, `y` | 将备注移动到画布上的某个位置。 |
| `erd_resize_memo` | `memoId`, `width`, `height` | 调整备注的大小。宽度必须至少约为 `116` 像素，高度必须至少为 `100` 像素。它不产生 Undo 记录，因为编辑器只在拖动调整备注大小时才会记录。 |

通过 [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` 隐藏备注期间，`erd_add_memo` 仍会添加备注，该备注会保持隐藏，直到备注再次显示。
`erd_list` 和 `erd_get` 同样会列出隐藏的备注。

### 表分组

表分组是绘制在其中各表后面、带有名称的框，其颜色会显示在框上以及其中各表的表头上，参见[表分组](../guide/guides/table-groups.md)。
一个表最多属于一个分组。无论 `erd_move_table`、`erd_move_tables` 和 `erd_move_table_group` 把表放在哪里，都不会改变分组所容纳的表；而在编辑器中，表在哪里放下，决定了它加入还是离开某个分组，参见[添加与移除表](../guide/guides/table-groups.md#adding-and-removing-tables)。`erd_add_table_group` 和 `erd_set_table_group` 会把表放入分组，`erd_remove_table_group` 则让其中的表不再属于任何分组。
分组存储一个矩形，宽至少 `160` 像素、高至少 `100` 像素（含标题栏），编辑器绘制的框会撑大到足以容纳其中的每个表。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | 添加一个分组，并在 `createdIds` 中返回其 id。请传入 `tableIds`，或者同时传入构成矩形的 `x`、`y`、`width` 和 `height`，两者择一。传入 `tableIds` 时，每个表都会离开其原来所在的分组，矩形会像[为选中的表分组](../guide/guides/table-groups.md#grouping-selected-tables)时那样调整为恰好围住这些表。传入矩形时，中心位于矩形内、且不属于任何分组的每个表都会加入该分组，与[绘制分组](../guide/guides/table-groups.md#drawing-a-group)时相同。`name` 为空时，分组没有名称。一次 `erd_undo` 会删除该分组，并让每个表回到其原来所在的分组。 |
| `erd_remove_table_group` | `groupId` | 删除分组。其中的表留在原处，不再属于任何分组。 |
| `erd_change_table_group_name` | `groupId`, `value` | 重命名分组。空字符串会让分组没有名称。 |
| `erd_change_table_group_color` | `groupId`, `color` | 设置分组的颜色。 |
| `erd_move_table_group` | `groupId`, `x`, `y` | 移动分组，使其矩形从该点开始，其中的表也移动相同的距离，与拖动其标题栏时相同。移动总计不足 20 像素（横向与纵向的距离相加）时不产生 Undo 记录。 |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | 设置分组的矩形，其中的表保持原位。省略 `x` 和 `y` 时保留其左上角的位置。无法连同四周留白容纳分组中各表的矩形会被拒绝，消息会指出矩形必须容纳的范围。 |
| `erd_set_table_group` | `tableIds`, `groupId` | 把表放入分组，每个表都会离开其原来所在的分组。`groupId` 为 `null` 或空字符串时，会把这些表移出所有分组。 |

通过 `View Option` → `Table Groups` 隐藏分组期间，这些工具仍会添加和修改分组，这些分组会保持隐藏，直到分组再次显示，参见[隐藏分组](../guide/guides/table-groups.md#hiding-groups)。
`erd_sort_tables` 会让每个分组中的表聚在一起，`erd_import_dbml` 和 `erd_import_json` 会带入分组（参见[导入](#导入)），`erd_read` 则可以通过 `groupNames` 写出所选分组的 DDL。
支持表分组之前的 ERD Editor 发布版本在保存文件时会丢掉文件中的分组，`4.0.0` 之前的 VS Code 扩展以及 `1.0.0` 之前的 Obsidian 和 JetBrains 插件都是如此，参见[更新](./installation.md#更新)。

### 词典 {#dictionaries}

这些工具用于编辑编辑器 [Dictionary](../guide/guides/dictionary.md) 标签页中的三个词典，表或列的逻辑名会借助它们生成物理名：

- 词根是用来组成逻辑名的标准词根，附带其写入物理名时所用的缩写，例如 `Member` 和 `MBR`。
- 术语是一个完整的逻辑名，附带它所给出的物理名，以及对列而言它所关联的域，例如 `Member Number` 附带 `MBR_NO` 和 `Identifier`。
- 域是带有名称、供列关联的数据类型，例如表示 `INT` 的 `Identifier`。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | 在词根词典的末尾添加一个词根，并在 `createdIds` 中返回其 id。`synonyms` 和 `forbiddenWords` 以逗号分隔，分别为该词根的其他写法，以及不得用来代替它的词。 |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | 更改传入的字段，其余字段保持不变。 |
| `erd_remove_word` | `wordId` | 删除词根。 |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | 在术语词典的末尾添加一个术语，并在 `createdIds` 中返回其 id。未传入 `physicalName` 时，如果词根能够组合出物理名，就会组合出一个，例如为 `Member Number` 组合出 `MBR_NO`。 |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | 更改传入的字段，其余字段保持不变。在术语没有物理名时传入 `name`，或者连同空的 `physicalName` 一起传入 `name` 时，还会写入其词根组合出的物理名（如果能组合出的话）。 |
| `erd_remove_term` | `termId` | 删除术语。 |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | 在域词典的末尾添加一个域，并在 `createdIds` 中返回其 id。`category` 用于为域分类，例如 `Number` 或 `Text`。 |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | 更改传入的字段，其余字段保持不变。新的 `dataType` 会传到关联该域的每个列，关系数据类型同步开启期间还会沿着关系传递，并与 `erd_change_column_data_type` 一样取消关联。 |
| `erd_remove_domain` | `domainId` | 删除域。关联该域的列会保留其数据类型，这些列以及关联该域的术语都不再显示域：它们的 `domainId` 读作空字符串。`erd_undo` 会恢复这些关联，保存时则不会把它们写入文件。 |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | 像编辑器的[重新生成物理名](../guide/guides/dictionary.md#derive-physical-names-again)一样，根据逻辑名重新生成一个列、一个表或整个文档的物理名。 |

- 每个名称在一个词典中只能出现一次，因此同一词典中另一行已有的名称会以 `invalidArgs` 被拒绝。名称在去除首尾空白后进行比较，并区分字母大小写，因此 `Member` 和 `member` 是两个名称。
- 更新操作按 id 指定行，并且至少传入一个字段。与该行现有值相同的值不会改变任何内容，也不产生 Undo 记录；添加或删除则总会产生 Undo 记录。
- 术语的域可以通过 `domainId` 指定（`null` 或空字符串表示无），也可以通过 `domainName` 指定（空字符串表示无）。`domainName` 会按词典中的顺序取第一个同名的域，名称的比较方式与上文相同。同时传入两者，或者传入没有任何域使用的 `domainName`，都会被拒绝。`erd_set_column_domain` 以相同的方式接受域。
- 更改或删除词根或术语不会重命名任何内容，也不会取消任何关联：它所给出的名称和域都保持原样。`erd_derive_physical_names` 会重新生成名称，并关联术语当前给出的域，但当前没有任何术语与之匹配的列，或其术语不提供域的列，会保留其所关联的域。以空的 `domainId` 调用 `erd_set_column_domain` 可以取消该关联。
- 没有任何工具能像 Dictionary 标签页那样以 CSV 导入或导出词典、对词典排序，或者在某个位置插入行。

`erd_list` 列出各行，`erd_get` 给出每个字段，`erd_read` 的 `snapshot` 格式包含全部内容，`erd_list_checks` 则列出词典发现的问题，参见[读取文档](#reading-a-document)。

`erd_set_table_logical_name` 和 `erd_set_column_logical_name` 会像编辑器在写入逻辑名时那样生成物理名，参见[生成物理名](../guide/guides/dictionary.md#deriving-physical-names)：

- 只有当名称为空或本身就是生成的名称时才会生成名称，读取结果会将后者显示为 `nameDerived: true`。不为空且手动填写的名称会保持不变，只写入逻辑名。`erd_change_table_name`、`erd_change_column_name`，SQL、GraphQL、DBML 和 AML 导入，以及 `erd_add_relationship` 为之命名的外键列，写入的都是手动填写的名称。被重命名为空字符串的名称会由下一个逻辑名重新生成。
- 名称与该逻辑名相同的术语优先，比较方式与词典名称相同。它给出其物理名；术语没有物理名时，则给出其词根组合出的物理名。对于列，即使没有生成任何名称，它也会关联该术语的域，列会采用该域的数据类型，关系数据类型同步开启期间还会沿着关系传递。
- 没有这样的术语时，由词根组合出名称，各词根的缩写以下划线连接：`Member Number` 得到 `MBR_NO`。组合是全有或全无的：只要含有同义词、禁用词、没有任何词根列出的文本，或没有缩写的词根，就不会组合出任何名称，名称保持原样。词根不会关联任何域，没有域的术语也不会，因此列会保留其所关联的域。
- 如果生成的名称已被同一表中的另一列使用（不区分大小写），该列会保留其名称、`nameDerived` 和域。
- 清除逻辑名不会改变物理名。如果调用所传入的逻辑名及其生成的内容都已存在，该调用不会改变任何内容，也不产生 Undo 记录。

`erd_derive_physical_names` 接受一个 `scope`：`column`，需带 `tableId` 和 `columnId`，作用于该列；`table`，需带 `tableId`，作用于该表的名称及其每一列；或者 `document`，不带任何 id，作用于每个表及其各列。缺少所需 id，或带有不接受的 id 的 scope 会被拒绝。
范围内每个有逻辑名的名称都会交还给词典（包括手动填写的名称），并采用词典当前给出的内容：术语的物理名，对于列还有其域和类型；否则采用词根的组合结果，此时列的域保持不变。没有生成任何内容的逻辑名会让名称保持原样，但 `nameDerived` 会变为 `true`。没有逻辑名的名称保持不变；新名称已被同一表中另一列使用的列也是如此（例如指向同一个表的第二个外键），它的 `nameDerived` 同样保持不变。一次 `erd_undo` 即可撤回整个调用。
导入的 schema 中的名称属于手动填写的名称，因此要按词典为其命名，请先设置逻辑名，然后调用 `erd_derive_physical_names`。该调用给出的是术语自身的物理名，更改术语的词根并不会重新组合它。因此，更改某个术语的词根之后，请先更新该术语：连同空的 `physicalName` 传入其 `name`，让词根重新组合物理名，或者传入新的 `physicalName`。

Dictionary 标签页出现之前的 ERD Editor 发布版本在保存文件时会丢掉文件中的逻辑名、域关联和词典行，`4.2.0` 之前的 VS Code 扩展以及 `1.2.0` 之前的 Obsidian 和 JetBrains 插件都是如此。其中，`4.0.0` 或 `4.1.0` 的扩展以及 `1.0.0` 或 `1.1.0` 的插件仍能与服务器进行实时编辑，但它们既不会显示也不会保留智能体写入的逻辑名、域关联和词典行，参见[更新](./installation.md#更新)。

### 设置 {#settings}

智能体设置的是 schema 本身的设置：数据库、数据库名称，以及 [Schema SQL](../guide/guides/schema-sql.md) 脚本。
文档存储的其他所有设置都由用户在编辑器中设置：[名称显示](../guide/guides/logical-names.md#name-view)、[View Option](../guide/guides/table-related-functions.md#table-view-options) 开关、[Settings](../guide/guides/settings.md) 标签页中的选项、Code Generator 的语言与名称大小写、括号类型，以及[锁定](../guide/guides/settings.md#锁定)。
没有任何工具会更改它们，以 `replace` 模式进行的导入除外：`erd_import_json` 会带来它所加载文档的设置和锁定，其他四个工具则会把视图移回画布的起点，参见[导入](#导入)。
服务器 `1.0.0` 删除了设置它们的工具：`erd_set_language`、`erd_set_table_name_case`、`erd_set_column_name_case`、`erd_set_bracket_type`、`erd_set_relationship_data_type_sync`、`erd_set_relationship_optimization`、`erd_set_column_order`、`erd_set_max_width_comment`、`erd_set_ignore_save_settings` 和 `erd_set_show`。

`erd_list` 和 `erd_read` 的 `snapshot` 格式会按文件所保存的形式报告设置，其中 `lockSettings` 为每个锁定各包含一个标志：`viewport`、`canvasType`、`language`、`tableNameCase`、`columnNameCase`、`bracketType` 和 `unlockNameViewMode`。
最后一个标志的含义相反：`Name View` 锁定开启期间它为 `false`（新文档以及该锁定出现之前保存的文件都是如此），用户关闭该锁定后则为 `true`。
已锁定的语言、名称大小写或括号类型会以其锁定的值报告，即文件保留、每个编辑器打开时所使用的值，无论编辑器的屏幕上显示的是什么。视图、标签页和名称显示不会被报告。无论当前的名称显示如何，智能体都能读写逻辑名。

`erd_set_ddl_script` 会产生 Undo 记录。`erd_set_database` 和 `erd_set_database_name` 不产生 Undo 记录，因此 `erd_undo` 无法撤回它们。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_set_database` | `value` | 设置数据库：`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`SQLite`、`Databricks` 或 `Snowflake`。它决定该数据库的数据类型，以及未指定 `vendor` 时 `erd_read` 输出的 DDL。 |
| `erd_set_database_name` | `value` | 设置数据库名称，即 `erd_read` 的 `use` 和 `createAndUse` 头部所指定的名称。 |
| `erd_set_ddl_script` | `position`, `sql` | 设置写在各表前后的两段脚本之一，参见[前置与后置脚本](../guide/guides/schema-sql.md#before-and-after-scripts)。`position` 为 `before` 时，脚本写在各表之前，例如 `CREATE EXTENSION` 或 `CREATE SCHEMA`；为 `after` 时，脚本写在各表之后，例如 `GRANT` 或 `CREATE VIEW`。`sql` 会替换整段脚本，最多 10,000 个字符，空字符串会删除该脚本。请先用 `erd_read` 的 `scripts` 格式读取当前的脚本。 |

脚本会按原样写入每种数据库的 DDL，因此请按文档的数据库编写脚本。在 MSSQL 上，如果脚本的最后一行不是 `GO`，会在其后添加一行 `GO`。
支持这些脚本之前的 ERD Editor 发布版本在保存文件时会丢掉文件中的脚本，`4.0.0` 之前的 VS Code 扩展以及 `1.0.0` 之前的 Obsidian 和 JetBrains 插件都是如此，参见[更新](./installation.md#更新)。

### 导入

这些工具以与编辑器 Import 菜单相同的方式读取 schema，参见[导入与导出文件](../guide/guides/file-import-export.md)。
每个工具都以 `value` 接受文本，并接受 `mode`：`replace`（默认值）或 `append`。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | 加载 SQL DDL，即 `CREATE TABLE` 语句之类的内容。 |
| `erd_import_graphql` | `value`, `mode?` | 加载 GraphQL SDL。 |
| `erd_import_dbml` | `value`, `mode?` | 加载 DBML。每个 `TableGroup` 都会成为一个由其列出的表组成的表分组，参见 [DBML](../guide/guides/file-import-export.md#dbml)。 |
| `erd_import_aml` | `value`, `mode?` | 加载 AML。 |
| `erd_import_json` | `value`, `mode?` | 加载 erd-editor 的 JSON 文档，例如另一个 `.erd.json` 文件。 |

`replace` 会取代当前文档，`erd_undo` 可以恢复之前的文档：

- `erd_import_sql`、`erd_import_graphql`、`erd_import_dbml` 和 `erd_import_aml` 会替换所有表、关系、索引、备注和表分组。它们保留文档的设置（包括锁定），只有视图除外，视图会回到画布的起点并恢复为 100%；它们还会保留文档的词根、术语和域词典。它们带来的表没有逻辑名，也不关联任何域。
- `erd_import_json` 会替换整个文档，包括其设置和词典：JSON 中的设置、锁定、词根、术语和域会取代当前文档的这些内容，未记录任何锁定的 JSON 会开启所有锁定，并把视图放在画布的起点。每个查看者都保留自己的名称显示，除非该 JSON 的 `Name View` 锁定处于关闭状态，此时会带入该 JSON 的名称显示。要保留当前文档的设置，请以 `erd_read` 的 `json` 格式给出的文本为基础。空文本会得到一个新文档，与 `erd_open_document` 带 `create` 时创建的文档相同。

`append` 会像编辑器的 [Import and Add](../guide/guides/file-import-export.md#import-and-add) 一样，把导入的内容添加到文档中，一次 `erd_undo` 即可撤回整个添加：

- 文本中的内容会作为带有新 id 的新实体载入，组成一个内容块，落在文档中所有内容（包括隐藏的备注和表分组）的下方，并与其左边缘对齐。已有的每个表和每项设置都会保留，同名的表也不例外：不会按名称合并任何内容。
- 关系和索引只会在导入带来的表之间建立，因此指向文本中未声明的表的外键会被丢弃。
- `erd_import_sql`、`erd_import_graphql` 和 `erd_import_aml` 会添加表及其关系和索引，`erd_import_dbml` 还会添加其表分组。`erd_import_json` 会添加表、关系、索引、备注和表分组，但绝不会添加其设置，并且会拒绝空文本。其中的表和列会带入它们的逻辑名，但没有任何列会关联域，JSON 中的词根、术语和域也都不会载入。

JSON 文档会保留自身的排列，包括其中的表分组：使用 `replace` 时保留其放置表的位置，使用 `append` 时则在添加的内容块内部保留。
SQL、GraphQL、DBML 和 AML 中的表会按行排列，列数最少的在前，每个分组中的表聚在一起，与 `erd_sort_tables` 放置表的方式相同，而绝不会像编辑器自身的 Import 在可行时那样按 `Flow` 排布。这四个工具在两种模式下都会拒绝空文本。

## erd_batch

`erd_batch` 按顺序把多个编辑工具作为一次编辑执行，要么全部生效，要么全部不生效。

- `operations` 最多包含 100 个条目，每个条目为 `{ tool, as?, args? }`，其中 `tool` 是一个编辑工具，`args` 是该工具去掉 `path` 后的参数。读取工具（例如 `erd_list_checks`）会被拒绝。
- 这些操作会先在文档的副本上试运行。被拒绝的操作会被指明，例如 `operations[1] erd_remove_table: …`，并且不会应用任何内容。
- 一次 `erd_undo` 即可撤回整个批处理，但无法撤回的操作除外，结果中的 `undoNote` 会列出它们：所用工具不产生 Undo 记录的操作，例如 `erd_set_database`；以及改变了文档却没有产生 Undo 记录的操作，例如移动距离很短的 `erd_move_table_group`。完全没有产生 Undo 记录的批处理会被 `erd_undo` 跳过。结果中的 `historyEntries` 统计的是其中编辑器历史记录的条数，而不是 `erd_undo` 的调用次数。
- 在实时会话中，编辑器要么接受整个批处理，要么完全不接受。

智能体在调用之前无法知道批处理会创建哪些 id，因此用 `as` 命名的操作可以让后续操作引用它们：`$name` 或 `$name.0` 表示它创建的第一个 id，`$name.1` 表示第二个，`$name.last` 表示最后一个。
名称由 ASCII 字母、数字和下划线组成，不能以数字开头，并且同一个名称只能用于一个操作。
引用只在接受实体 id 的参数（包括 `wordId`、`termId` 和 `domainId`）中才会解析，因此内容为 `$x` 的名称或注释仍然是文本。
`domainName` 同样是文本，但它在其所在的操作运行时才被读取，因此可以指定该批处理中先前某个操作所添加的域。

在一次调用中创建一个带列的表以及一条关系：

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` 及其键 `id` 在关系之前就已命名，因此关系添加到 `orders` 中的外键列为 `users_id`。

先添加词根、域和术语，再添加一个通过逻辑名由它们命名的表：

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

术语由其词根组合出 `MBR_NO`，表则被命名为 `MBR`。列 `Member Number` 采用该术语的 `MBR_NO` 及其域，因此它关联到 `Identifier`，类型为 `INT`；而没有任何术语对应的 `Member Name` 则被组合为 `MBR_NM`。

## 结果

编辑会返回一行 JSON：

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| 字段 | 含义 |
| --- | --- |
| `mode` | `live` 或 `headless`，参见[实时与无头模式](./live-and-headless.md)。 |
| `saved` | 在无头模式下，每次编辑、`erd_batch`、`erd_undo` 和 `erd_redo` 的结果中都为 `true`：调用返回时文件已包含该变更，因此没有需要保存的内容。实时模式的结果没有 `saved`，因为变更由编辑器持有，参见[保存](./live-and-headless.md#saving)。 |
| `createdIds` | 该调用所创建内容的 id，按创建顺序排列。 |
| `batches`, `historyEntries` | 该调用发送了多少批变更，以及产生了多少条编辑器历史记录。 |
| `undoable`, `undoNote` | 当 `erd_undo` 会跳过该调用时，`undoable` 为 `false`，`undoNote` 则说明原因：该工具不产生 Undo 记录；该调用改变了文档却没有产生 Undo 记录，例如移动不足 20 像素的 `erd_move_table_group`；或者文档已持有该值。`erd_batch` 的结果始终带有 `undoNote`。批处理产生了 Undo 记录时，它会说明一次 `erd_undo` 即可撤回该批处理，并列出撤回时保持不变的操作；没有产生时，结果会带有 `undoable: false`，说明则指出 `erd_undo` 会跳过它。 |
| `mismatch` | 当该调用产生的变更批数或历史记录条数与工具声明的不一致时出现。 |
| `notes` | 会话发生某些变化时出现，例如编辑器已退出或已停止为该文档提供服务，或者文件在磁盘上发生了变化。 |

拒绝是一个错误结果，带有代码和一条说明该怎么做的消息：

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 原因 |
| --- | --- |
| `notFound` | 某个 id 没有对应任何现存的实体，或者文件不存在。 |
| `invalidArgs` | 缺少某个参数，或者参数的值不正确。 |
| `invalidPath` | 该路径不是 ERD 文档。在 Windows 上，还包括含有 Windows 无法按原样存储的名称的路径，或者指向某个编辑器以另一条路径持有的文档的路径，消息会指出那条路径。 |
| `invalidDocument` | 该文件不是编辑器可以读取的文档。 |
| `tooLarge` | 一次读取无法放入一次返回中。 |
| `blocked` | 持有该文档的编辑器的 hub 已关闭。消息会说明如何开启它：在 VS Code 中，信任该工作区并开启 `dineug.erd-editor.agentHub.enabled`，或者重新加载窗口；在 Obsidian 中，开启 Coding agents，或者重新加载 Obsidian；在 JetBrains IDE 中，开启 Coding agents，如果它已开启，则重启 IDE。 |
| `hubDisabled` | JetBrains IDE 仅在其不信任的项目中持有该文档。读取仍然有效；信任该项目即可让智能体编辑。 |
| `conflict` | 文件在调用期间在磁盘上发生了变化。未写入任何内容。 |
| `hubAppeared`, `hubGone` | 有编辑器开始为智能体正在磁盘上编辑的文档提供服务，或者为该文档提供服务的编辑器仍在运行，但其锁文件和连接已消失。未写入任何内容。 |
| `notSaved` | `erd_save` 无法保存编辑器中的文档。 |
| `readonly` | 编辑器以只读方式持有该文档，例如它无法写入或无法作为图读取的文件。没有编辑器时，则是文件本身为只读，例如尚未签出的 Perforce 或 TFVC 文件。未写入任何内容。 |
| `protocolMismatch` | 编辑器的 ERD Editor 扩展或插件与服务器所用的协议版本不同，例如服务器 `1.0.0` 或更高版本搭配 VS Code 扩展 `3.x`。读取同样会被拒绝，消息会指出需要更新的一方，参见[更新](./installation.md#更新)。 |
| `hubUnreachable`, `timeout`, `disconnected` | 编辑器的 hub 没有接受连接、没有在 30 秒内应答，或者在调用期间断开了连接。在 Windows 上，`hubUnreachable` 还表示 Windows 不允许智能体访问该 hub：编辑器以高于智能体的权限运行（例如编辑器以管理员身份启动而智能体没有），或者智能体在沙箱中运行。 |

其他代码较为少见，而且每次拒绝都会附带一条说明发生了什么的消息。

编辑工具、`erd_batch` 以及四个读取工具会在接触文档之前，以 JSON-RPC 的 invalid params 错误（`-32602`）拒绝它们未声明的参数或类型错误的参数，因此拼错的参数绝不会被悄悄丢弃。
五个会话工具会忽略它们不认识的参数。
