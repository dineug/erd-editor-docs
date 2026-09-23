---
sidebar_position: 4
description: erd-editor MCP 服务器提供的所有工具：一次一页地读取文档、54 个编辑工具、erd_batch，以及结果与拒绝的格式。
---

# 工具

服务器提供 63 个工具：五个会话工具、三个读取工具、54 个编辑工具（每种编辑操作一个），以及把多个编辑工具作为一次编辑执行的 `erd_batch`。

除 `erd_list_documents` 外，每个工具都以文档的 `path` 作为第一个参数，下面的表格中省略了它。
标有 `?` 的参数是可选的。

## 会话工具

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_list_documents` | | 列出 ERD 文档及其 `path`、`open`、`active`、`dirty` 和 `readonly`：有 VS Code 窗口为工作目录提供服务时列出该窗口的文档，否则列出工作目录下的 ERD 文件。 |
| `erd_open_document` | `create?` | 打开文档以便编辑，有窗口为其提供服务时在 ERD Editor 中打开。带 `create` 时，如果文件不存在会先创建它，没有扩展名的名称会加上 `.erd.json`。 |
| `erd_save` | | 保存编辑器持有的文档。在无头模式下，每次编辑都已写入，因此它什么也不做。 |
| `erd_undo` | | 撤回该智能体所做的最后一次编辑，而绝不会撤回你的编辑。没有产生 Undo 记录的调用会被跳过并列出。 |
| `erd_redo` | | 重新应用 `erd_undo` 最近撤回的编辑。 |

关于保存和 Undo 在每种模式下的行为，参见[实时与无头模式](./live-and-headless.md)。

## 读取文档 {#reading-a-document}

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | 先是设置与数量统计，然后是一页表，每个表附带其 id、在画布上的位置和大小以及列数，并带有它们的索引与关系；在表之后是备注，搜索时除外。 |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?` | 完整返回所指定的实体：表附带其列，关系与索引附带其列，备注附带其文本。 |
| `erd_read` | `format`, `vendor?`, `tableIds?`, `tableNames?` | 以三种格式之一一次性返回整个文档，或者只返回部分表的 DDL。 |

智能体用 `erd_list` 查找 id，用 `erd_get` 读取列及其他详细信息，再把这些 id 传给编辑工具。
`erd_list` 中表的大小是它在画布上占据的方框：高度是精确的，宽度是近似的。
每条关系只列出一次，随其两个表中的一个列出。

`erd_read` 接受以下三种格式之一：

| `format` | 返回内容 |
| --- | --- |
| `snapshot` | 包含每个实体及其 id 的紧凑 JSON。schema 较大时体积也较大。 |
| `sql` | 八种数据库之一的 DDL：`Databricks`、`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`Snowflake` 或 `SQLite`。`vendor` 默认为文档所设置的数据库。指定 `tableIds` 或 `tableNames` 时，只返回这些表，以及它们持有的外键。 |
| `json` | 原始的 `.erd.json` 文档。 |

### 大型 schema

包含数百乃至数千个表的 schema 同样可以处理。
一次读取最多返回 40,000 个字符，低于 Claude Code 把工具结果另存到文件中的阈值。

- `erd_list` 默认返回一页 100 个表，并通过 `nextOffset` 和 `note` 说明下一页从哪里开始。把该 `nextOffset` 作为 `offset` 传入，并使用相同的 `query`。
- `query` 按表名、列名或注释中的词查找表，不区分大小写。名称中包含更多这些词的表排在前面。
- `namesOnly` 只列出表名，一次返回约 2,000 个短名称。
- `erd_get` 和 `erd_read` 除了 id 之外也接受 `tableNames`，因此当智能体被要求在大型 schema 上编写 SQL 查询时，只需读取它所需表的 DDL。
- `erd_get` 会把没有对应任何实体的 id 和名称列在 `missing` 下，把一次返回放不下的 id 列在 `notReturned` 下，以便再次请求。
- 一次返回放不下的读取会以 `tooLarge` 被拒绝，并说明如何缩小范围。

## 编辑工具

id 来自 `erd_list` 和 `erd_get`，或者来自创建该实体的那次调用的 `createdIds`。
`x` 和 `y` 是在画布上的左边缘和上边缘，以像素为单位；颜色是 CSS 十六进制颜色，例如 `#3b82f6`。

### 表

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_table` | | 在空闲位置添加一个空表，并在 `createdIds` 中返回其 id。 |
| `erd_remove_table` | `tableId` | 删除表，连同其列、索引以及与它相连的所有关系。 |
| `erd_change_table_name` | `tableId`, `value` | 重命名表。 |
| `erd_change_table_comment` | `tableId`, `value` | 设置表的注释。空字符串会清除注释。 |
| `erd_change_table_color` | `tableId`, `color` | 设置表的颜色。 |
| `erd_move_table` | `tableId`, `x`, `y` | 将表移动到画布上的某个位置。 |
| `erd_move_tables` | `positions` | 在一次编辑中移动多个表，一次 `erd_undo` 即可撤回。`positions` 中每个表对应一个 `{ tableId, x, y }`，每个表最多出现一次。 |
| `erd_sort_tables` | | 像导入时那样，将所有表按行排列在画布上，列数最少的在前。 |

### 列

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | 向表中添加一个空列，并在 `createdIds` 中返回其 id。 |
| `erd_remove_columns` | `tableId`, `columnIds` | 从一个表中删除列，连同使用这些列的关系与索引条目。 |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | 重命名列。 |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | 设置数据类型，例如 `INT` 或 `VARCHAR(255)`。开启[关系数据类型同步](../guide/guides/settings.md)时，复制了该类型的外键会随之改变。 |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | 以 SQL 文本设置默认值。空字符串会清除默认值。 |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | 设置注释。空字符串会清除注释。 |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` 将该列加入主键，`false` 将其移出主键。 |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | 设置该列是否唯一。 |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | 设置该列是否为 `NOT NULL`。 |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | 设置该列是否自动递增。 |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | 在表内将列移动到另一列的位置。 |

### 关系

`relationshipType` 是子表一端的基数：`ZeroOne`、`ZeroN`、`OneOnly` 或 `OneN`。
起始表是父表，即持有主键的被引用一方，结束表是子表。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType` | 关联两个表。它会把父表的主键作为外键列复制到子表中，如果父表没有主键，则先创建一个主键列。`createdIds` 依次包含新建的主键列（如果创建了的话）、外键列，最后是关系 id。 |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType` | 在已存在的列之间绘制关系，按位置将起始列与结束列配对。 |
| `erd_remove_relationship` | `relationshipId` | 删除关系连接线。其外键列会保留在表中。 |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | 修改关系的基数。 |

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
| `erd_resize_memo` | `memoId`, `width`, `height` | 调整备注的大小。宽度至少约为 `116` 像素，高度至少为 `100` 像素。它不产生 Undo 记录，因为编辑器只在拖动调整备注大小时才会记录。 |

### 设置 {#settings}

存储在文档中的设置，例如数据库、Code Generator 的选项，以及[设置](../guide/guides/settings.md)标签页中的那些设置。
其中除 `erd_set_show` 外都不产生 Undo 记录，因此 `erd_undo` 无法撤回它们。

| 工具 | 参数 | 取值 |
| --- | --- | --- |
| `erd_set_database` | `value` | `MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`SQLite`、`Databricks`、`Snowflake`。它决定该数据库的数据类型，以及未指定 `vendor` 时 `erd_read` 输出的 DDL。 |
| `erd_set_database_name` | `value` | 数据库名称。 |
| `erd_set_language` | `value` | Code Generator 的语言：`GraphQL`、`csharp`、`Java`、`Kotlin`、`TypeScript`、`JPA`、`Scala`、`Go`、`SQLAlchemy`、`TypeORM`、`Sequelize`、`Drizzle`、`DBML`、`AML`。 |
| `erd_set_table_name_case` | `value` | 生成的表名的大小写：`none`、`camelCase`、`pascalCase`、`snakeCase`。 |
| `erd_set_column_name_case` | `value` | 同上，用于列名。 |
| `erd_set_bracket_type` | `value` | 生成的 SQL 如何为名称加引号：`none`、`doubleQuote`、`singleQuote`、`backtick`。 |
| `erd_set_relationship_data_type_sync` | `value` | `true` 使外键列与其引用的列保持相同的数据类型。 |
| `erd_set_relationship_optimization` | `value` | 存储在文档中的关系优化标志。 |
| `erd_set_column_order` | `columnType`, `targetColumnType` | 将表中一行的某一部分移动到另一部分的位置：`columnName`、`columnDataType`、`columnNotNull`、`columnUnique`、`columnAutoIncrement`、`columnDefault`、`columnComment`。 |
| `erd_set_max_width_comment` | `value` | 注释在表中绘制的最大宽度，以像素为单位，`-1` 表示不限制。 |
| `erd_set_ignore_save_settings` | `saveSettingType`, `value` | `true` 使保存的文件中不包含 `scroll` 或 `zoomLevel`。 |
| `erd_set_show` | `show`, `value` | 显示或隐藏图的某一部分：`tableComment`、`columnComment`、`columnDataType`、`columnDefault`、`columnAutoIncrement`、`columnPrimaryKey`、`columnUnique`、`columnNotNull`、`relationship`。 |

### 导入

以下每个工具都会替换整个文档，`erd_undo` 可以恢复之前的文档。
它们以与编辑器 Import 菜单相同的方式读取 schema，参见[导入与导出文件](../guide/guides/file-import-export.md)。

| 工具 | 参数 | 作用 |
| --- | --- | --- |
| `erd_import_sql` | `value` | 加载 SQL DDL，即 `CREATE TABLE` 语句之类的内容。 |
| `erd_import_graphql` | `value` | 加载 GraphQL SDL。 |
| `erd_import_dbml` | `value` | 加载 DBML。 |
| `erd_import_aml` | `value` | 加载 AML。 |
| `erd_import_json` | `value` | 加载 erd-editor 的 JSON 文档，例如另一个 `.erd.json` 文件。空文本会得到一个空文档。 |

## erd_batch

`erd_batch` 按顺序把多个编辑工具作为一次编辑执行，要么全部生效，要么全部不生效。

- `operations` 最多包含 100 个条目，每个条目为 `{ tool, as?, args? }`，其中 `args` 是该工具去掉 `path` 后的参数。
- 这些操作会先在文档的副本上试运行。被拒绝的操作会被指明，例如 `operations[1] erd_remove_table: …`，并且不会应用任何内容。
- 一次 `erd_undo` 即可撤回整个批处理。结果中的 `historyEntries` 统计的是其中编辑器历史记录的条数，而不是 `erd_undo` 的调用次数。
- 在实时会话中，编辑器要么接受整个批处理，要么完全不接受。

智能体在调用之前无法知道批处理会创建哪些 id，因此用 `as` 命名的操作可以让后续操作引用它们：`$name` 或 `$name.0` 表示它创建的第一个 id，`$name.1` 表示第二个，`$name.last` 表示最后一个。
引用只在接受实体 id 的参数中才会解析，因此内容为 `$x` 的名称或注释仍然是文本。

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
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN" } }
  ]
}
```

## 结果

编辑会返回一行 JSON：

```json
{"tool":"erd_add_table","mode":"live","createdIds":["b7u59tHkuXTA1hhtWh_bD"],"batches":1,"historyEntries":1}
```

| 字段 | 含义 |
| --- | --- |
| `mode` | `live` 或 `headless`，参见[实时与无头模式](./live-and-headless.md)。 |
| `createdIds` | 该调用所创建内容的 id，按创建顺序排列。 |
| `batches`, `historyEntries` | 该调用发送了多少批变更，以及产生了多少条编辑器历史记录。 |
| `undoable`, `undoNote` | 当 `erd_undo` 会跳过该调用时，`undoable` 为 `false`，`undoNote` 则说明原因：该工具不产生 Undo 记录，或者文档已持有该值。`erd_batch` 的结果始终带有 `undoNote`，说明一次 `erd_undo` 即可撤回整个批处理。 |
| `mismatch` | 当该调用产生的变更批数或历史记录条数与工具声明的不一致时出现。 |
| `notes` | 会话发生某些变化时出现，例如窗口已退出，或者文件在磁盘上发生了变化。 |

拒绝是一个错误结果，带有代码和一条说明该怎么做的消息：

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 原因 |
| --- | --- |
| `notFound` | 某个 id 没有对应任何现存的实体，或者文件不存在。 |
| `invalidArgs` | 缺少某个参数，或者参数的值不正确。 |
| `invalidPath` | 该路径不是 ERD 文档。 |
| `invalidDocument` | 该文件不是编辑器可以读取的文档。 |
| `tooLarge` | 一次读取无法放入一次返回中。 |
| `blocked` | 持有该文档的 VS Code 窗口的 hub 已关闭。 |
| `conflict` | 文件在调用期间在磁盘上发生了变化。未写入任何内容。 |
| `hubAppeared`, `hubGone` | 在编辑期间，有窗口开始或停止为该文档提供服务。未写入任何内容。 |
| `notSaved` | `erd_save` 无法保存编辑器中的文档。 |
| `readonly` | 该文档以只读方式打开。 |
| `protocolMismatch` | 扩展与服务器所用的协议版本不同。 |
| `hubUnreachable`, `timeout`, `disconnected` | 窗口的 hub 没有接受连接、没有在 30 秒内应答，或者在调用期间断开了连接。 |

其他代码较为少见，而且每次拒绝都会附带一条说明发生了什么的消息。

编辑工具、`erd_batch` 以及三个读取工具会在接触文档之前，以 JSON-RPC 的 invalid params 错误（`-32602`）拒绝它们未声明的参数或类型错误的参数，因此拼错的参数绝不会被悄悄丢弃。
五个会话工具会忽略它们不认识的参数。
