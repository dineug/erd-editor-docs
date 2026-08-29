---
sidebar_position: 8
description: 为十四种目标生成代码，设置表名与列名的大小写。
---

# 代码生成

切换到工具栏的 `Code Generator` 标签页，然后在代码区域右键打开菜单。  
菜单中提供 `Language`、`Table Name Case` 和 `Column Name Case`。

<img src="/img/code-generator.png" width="400" alt="代码生成菜单" loading="lazy" />

同一个面板也是[表属性](./table-related-functions.md#table-properties)的 `Code Generator` 标签页，在那里生成的是这一张表的代码，而不是整个文档的代码。  
在此标签页打开期间，这三个菜单也可以从[快速搜索](./quick-search.md)中使用。

## 语言

支持十四种目标，按语言、ORM、Schema DSL 三个分组依次列出，每个分组内按字母顺序排列：

| 目标 | 分组 | 关系 | 索引 |
| --- | --- | --- | --- |
| `C#` | 语言 | — | — |
| `Go` | 语言 | — | — |
| `Java` | 语言 | — | — |
| `Kotlin` | 语言 | — | — |
| `Scala` | 语言 | — | — |
| `TypeScript` | 语言 | — | — |
| `Drizzle` | ORM | ✓ | ✓ |
| `JPA` | ORM | ✓ | — |
| `Sequelize` | ORM | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ |
| `AML` | Schema DSL | ✓ | ✓ |
| `DBML` | Schema DSL | ✓ | ✓ |
| `GraphQL` | Schema DSL | ✓ | — |

默认值为 `GraphQL`。所有目标都会生成列，✓ 标记表示除此之外还会生成什么。  
表按名称顺序生成，而不是按其在画布上的摆放顺序，索引则使用表属性中定义的索引。

`AML`、`DBML` 和 `GraphQL` 都是可往返的格式，它们同时也是导入来源。参见[导入与导出文件](./file-import-export.md)。

## 名称大小写

`Table Name Case` 与 `Column Name Case` 均支持 `Pascal`、`Camel`、`Snake` 和 `None`。  
默认值为表名 `Pascal`、列名 `Camel`。`None` 会按图中书写的名称原样生成。

`AML` 与 `DBML` 会忽略这两项设置，始终按图中的名称原样生成。

## 数据库

数据类型根据所选的数据库解析，因此在切换到此标签页之前先选择数据库。参见[数据库](./table-related-functions.md#databases)。  
`Drizzle` 会根据同一项设置决定方言：PostgreSQL 为 `pgTable`，MySQL 和 MariaDB 为 `mysqlTable`，SQLite 为 `sqliteTable`，其他数据库均为 `pgTable`。

`AML` 与 `DBML` 是例外，它们会按图中书写的内容原样生成每个数据类型，因此数据库设置不会改变其输出。

## 复制结果

生成的代码没有文件导出功能，因此需要从面板中复制。  
将鼠标悬停在面板上，点击右上角的复制按钮，会显示 `Copied!` 提示。文本也可以直接选中，因此可以只取需要的部分。
