---
sidebar_position: 9
description: 根据图为十四种目标生成代码，了解哪些目标会写出关系的 ON DELETE 与 ON UPDATE 操作，并设置表名与列名的大小写。
---

# 代码生成

切换到工具栏的 `Code Generator` 标签页，然后在代码区域右键打开菜单。  
菜单中提供 `Language`、`Table Name Case` 和 `Column Name Case`。

![在代码面板的右键菜单中选择 TypeScript 和表名 Snake，然后复制代码](/img/demo-code-generator.webp)

同一个面板也是[表属性](./table-related-functions.md#table-properties)的 `Code Generator` 标签页，在那里生成的是这一张表的代码，而不是整个文档的代码。  
在此标签页打开期间，这三个菜单也可以从[快速搜索](./quick-search.md)中使用。

## 语言

支持十四种目标，按语言、ORM、Schema DSL 三个分组依次列出，每个分组内按字母顺序排列：

| 目标 | 分组 | 关系 | 索引 | ON DELETE / ON UPDATE |
| --- | --- | --- | --- | --- |
| `C#` | 语言 | — | — | — |
| `Go` | 语言 | — | — | — |
| `Java` | 语言 | — | — | — |
| `Kotlin` | 语言 | — | — | — |
| `Scala` | 语言 | — | — | — |
| `TypeScript` | 语言 | — | — | — |
| `Drizzle` | ORM | ✓ | ✓ | ✓ |
| `JPA` | ORM | ✓ | — | — |
| `Sequelize` | ORM | ✓ | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ | ✓ |
| `AML` | Schema DSL | ✓ | ✓ | ✓ |
| `DBML` | Schema DSL | ✓ | ✓ | ✓ |
| `GraphQL` | Schema DSL | ✓ | — | — |

默认值为 `GraphQL`。所有目标都会生成列，✓ 标记表示除此之外还会生成什么。  
表按名称顺序生成，而不是按其在画布上的摆放顺序，索引则使用[表属性](./table-related-functions.md#indexes)中 `Indexes` 下列出的索引，而不是其上方的 `Keys` 行。

`AML`、`DBML` 和 `GraphQL` 都是可往返的格式，它们同时也是导入来源。参见[导入与导出文件](./file-import-export.md)。

## ON DELETE 与 ON UPDATE {#on-delete-and-on-update}

关系的 ON DELETE 与 ON UPDATE 操作通过该关系的右键菜单设置，参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
最后一列带有 ✓ 的目标会写出关系所设置的操作；保持为 `Not set` 的操作不会写出任何内容。  
ORM 目标会保留哪些操作取决于所选的数据库，而 `AML` 和 `DBML` 会全部保留，参见[数据库](#database)。

- `Drizzle` 以小写写出这些操作。在 `.references()` 上，它们以选项的形式写出，例如 `{ onDelete: "cascade", onUpdate: "set null" }`；在多列键所使用的 `foreignKey()` 上，它们以链式调用写出，例如 `.onDelete("restrict").onUpdate("no action")`。
- `Sequelize` 会将 `onDelete: "CASCADE"` 与 `onUpdate` 条目写入两个关联调用：`hasMany` 或 `hasOne`，以及 `belongsTo`。多列键不会生成关联调用，因此 `Sequelize` 不会为其写出任何操作。
- `SQLAlchemy` 会将 `ondelete="CASCADE"` 与 `onupdate` 参数传给单列键的 `ForeignKey()`，以及多列键的 `ForeignKeyConstraint()`。
- `TypeORM` 会将 `onDelete: "CASCADE"` 与 `onUpdate` 选项写在关系拥有方的 `@ManyToOne` 或 `@OneToOne` 上，从不写在反向一方。它总是省略 `SET DEFAULT`，因为 TypeORM 会将其写为 `DEFAULT`，而没有任何数据库接受这种写法。
- `DBML` 会在 `Ref` 上添加设置，例如 `[delete: set null, update: no action]`。
- `AML` 会将设置了操作的关系写成带属性的独立 `rel` 语句，例如 `{onDelete: cascade, onUpdate: "set null"}`，而不是内联写在其列上。

`JPA` 不会写出任何操作：纯 JPA 没有对应的选项，生成器也不使用 Hibernate 的 `@OnDelete`。  
在只显示一张表的表属性 `Code Generator` 标签页中，`DBML` 不会写出 `Ref`，`AML` 也不会写出 `rel` 语句，因此两者都不会在那里显示这些操作；对于设置了操作的单列关系，`AML` 会像对待没有操作的关系一样，将其内联写在列上。

## 名称大小写

`Table Name Case` 与 `Column Name Case` 均支持 `Pascal`、`Camel`、`Snake` 和 `None`。  
默认值为表名 `Pascal`、列名 `Camel`。`None` 会按图中书写的名称原样生成。

`AML` 与 `DBML` 会忽略这两项设置，始终按图中的名称原样生成。

## 数据库 {#database}

数据类型根据所选的数据库解析，因此在切换到此标签页之前先选择数据库。参见[数据库](./table-related-functions.md#databases)。  
`Drizzle` 会根据同一项设置决定方言：PostgreSQL 为 `pgTable`，MySQL 和 MariaDB 为 `mysqlTable`，SQLite 为 `sqliteTable`，其他数据库均为 `pgTable`。

所选的数据库还决定 ORM 目标会写出哪些 ON DELETE 与 ON UPDATE 操作。  
`Sequelize`、`SQLAlchemy` 和 `TypeORM` 会省略该数据库的 Schema SQL 所省略的操作，例如 MySQL 和 MariaDB 的 `SET DEFAULT`，或 MSSQL 的 `RESTRICT`，因此由数据库的默认行为决定。完整列表参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
`Drizzle` 则遵循它所写出的方言：`mysqlTable` 代码会省略 `SET DEFAULT`，而 `pgTable` 和 `sqliteTable` 代码会保留所有操作，包括它为 MSSQL、Oracle、Snowflake 和 Databricks 写出的 `pgTable` 代码。

`AML` 与 `DBML` 是例外，它们会按图中书写的内容原样生成每个数据类型，并写出关系所设置的每个操作，因此数据库设置不会改变其输出。

## 复制结果

生成的代码没有文件导出功能，因此需要从面板中复制。  
将鼠标悬停在面板上，点击右上角的复制按钮，会显示 `Copied!` 提示。文本也可以直接选中，因此可以只取需要的部分。
