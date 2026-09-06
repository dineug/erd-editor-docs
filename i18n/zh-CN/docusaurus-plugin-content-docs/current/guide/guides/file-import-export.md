---
sidebar_position: 2
description: 导入 JSON、schema SQL、GraphQL、DBML 或 AML，导出 JSON、schema SQL 或 PNG。
---

# 导入与导出文件

## 导入外部文件

可以从右键菜单的 `Import` 子菜单导入以下五种格式：

- JSON
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

<img src="/img/import-json.png" width="400" alt="导入 JSON 菜单" loading="lazy" />

### Schema SQL

也可以导入用 SQL 定义的 schema 文件。  
解析器已尽量做到与数据库厂商无关且足够宽松，但仍可能存在不支持的语法。  
文件名必须以 `.sql` 结尾。  
[支持的语法可在此查看。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

<img src="/img/import-sql.png" width="400" alt="导入 Schema SQL 菜单" loading="lazy" />

#### 注释

表与列的注释会从解析器支持的两种语法中导入：MySQL、MariaDB、Snowflake 和 Databricks 使用的 `COMMENT` 表选项与列属性，以及 PostgreSQL 和 Oracle 使用的 `COMMENT ON TABLE` 与 `COMMENT ON COLUMN` 语句。  
指向文件中未定义的表或列的注释会被忽略。

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
文件名必须以 `.dbml` 结尾。

### AML

可以导入 AML（Azimutt Markup Language）文件。当前写法与旧版 v1 写法均受支持。  
实体会变成表，嵌套属性会被展平为带点的列名，例如 `settings.slug`。  
除非标记为 `nullable`，否则属性均为 `NOT NULL`，而编辑器中没有对应位置的结构（例如 `check`、`view`、`type`、`color`、`tags` 和 `onDelete`）会被丢弃，而不会被拒绝。  
文件名必须以 `.aml` 结尾。

GraphQL、DBML 和 AML 都是可往返的格式，它们同时也是[代码生成](./code-generator.md)的目标格式。

## 导出 {#exporting}

导出支持以下三种格式：

- JSON：编辑器定义的 schema 文件。保存为 `.erd.json`。
- Schema SQL：按照数据库厂商语法生成的 schema 文件。保存为 `.sql`。
- PNG：将图导出为图片。保存为 `.png`。

无论视图平移到多远，PNG 都会包含整张图：按图本身绘制出的范围加上一圈外边距裁切，并以编辑器当前显示的缩放级别绘制。想要更大的图片，可以在导出前先放大。  
绘制在后台 worker 中进行，因此期间编辑器仍可继续使用，并会用提示告知正在导出。对于大到浏览器画布无法栅格化的图，编辑器不会因此导不出文件，而是降低分辨率保存，并用提示说明这一点。

每个导出的文件都以 `<数据库名>-<时间戳>` 加上对应的扩展名命名，其中时间戳的格式为 `yyyy-MM-dd'T'HH_mm_ss`，例如 `my-schema-2026-08-29T04_05_06.erd.json`。数据库名为空时会退回为 `unnamed`。

<img src="/img/export-menu.png" width="400" alt="导出菜单" loading="lazy" />

`Import` 与 `Export` 也可以从[快速搜索](./quick-search.md)中使用。其中提供相同的五种导入格式，但导出仅支持 `JSON` 和 `Schema SQL`，PNG 仅能从右键菜单导出。
