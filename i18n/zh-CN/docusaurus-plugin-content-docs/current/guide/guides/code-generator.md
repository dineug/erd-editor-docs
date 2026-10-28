---
sidebar_position: 13
description: 根据图为二十二种目标生成代码，在选项面板中选择语言、数据库、名称大小写与括号，了解哪些目标会写出关系的 ON DELETE 与 ON UPDATE 操作，并保存或复制结果。
---

# 代码生成

切换到工具栏的 `Code Generator` 标签页。该标签页左侧显示整个文档的代码，右侧是标题为 `Code Generator` 的选项面板，可在其中选择语言、数据库、名称大小写，以及部分目标所用的括号。  
除非标签页首次打开时编辑器的宽度小于 640 px，否则面板会自动展开。面板顶部的 `Hide options` 可将其收起，代码右上角的 `Show options` 可将其重新展开。只要编辑器保持打开，面板在切换标签页后仍会保持展开或收起的状态，这与 Schema SQL 标签页的面板相互独立，并且永远不会保存到文件中。

右键点击代码即可打开其右键菜单：`Language`、`Database`、`Table Name Case`、`Column Name Case`、`Bracket`（仅用于 `Doctrine`、`JPA` 和 `SeaORM`），每一项都带有一个勾选当前值的子菜单；然后是 `Options panel`，用于收起或展开面板，面板显示期间处于勾选状态；最后是 `Save file`。  
在此标签页打开期间，[快速搜索](./quick-search.md)提供 `Database`、`Bracket`（仅用于 `Doctrine`、`JPA` 和 `SeaORM`）、`Language`、`Table Name Case`、`Column Name Case` 以及 `Code Generator: Options panel`，后者用于收起或展开面板。

![在代码的右键菜单中先选择 TypeScript 再选择 Rust，在选项面板中将列名切换为 Snake，然后复制代码](/img/demo-code-generator.webp)

同一个代码视图也是[表属性](./table-related-functions.md#table-properties)的 `Code Generator` 标签页，在那里生成的是这一张表的代码，而不是整个文档的代码。它在那里没有选项面板，其右键菜单修改的是同样的设置，但没有 `Options panel` 和 `Save file`。  
对于整个文档的代码以导入语句或文件头开头的目标，这一张表的代码会以该表所需的导入语句或文件头开头，例如 `PHP` 的 `<?php`、`Swift` 的 `import Foundation` 或 `JSON Schema` 的 `$schema`。

代码在标签页打开时生成，之后每当语言、数据库、某种名称大小写或括号改变时都会重新生成。在标签页打开期间对图所做的编辑，例如协作者或编码智能体的编辑，要等你离开该标签页再回来，或者上述某项设置改变后才会显示。

## 选项面板 {#options-panel}

面板在标题 `Saved in the document` 下列出 `Language`、`Database`、`Table Name Case` 和 `Column Name Case`，当语言为 `Doctrine`、`JPA` 或 `SeaORM` 时，其后还有 `Bracket`。每一项都是一个下拉列表，更改后会立即重写代码。  
当所选语言不使用 `Database` 或名称大小写时，它们仍会留在面板中，但会变暗显示，下方带有 `Not used by DBML` 之类的说明，并且仍然可以更改。  
`Save file` 和 `Copy` 位于面板底部，参见[保存或复制结果](#saving-or-copying-the-result)。

这些是图本身的设置，右键菜单和快速搜索修改的也是它们。`Database` 与其他编辑一样保存到文件中。  
`Language`、`Table Name Case`、`Column Name Case` 和 `Bracket` 只有在 Settings 标签页上对应的锁定关闭时才会保存（`Bracket` 对应的是 `Bracket Type`），而新建的图中所有锁定都处于开启状态。锁定开启期间，更改会重写屏幕上的代码，但文件保留锁定的值，图再次打开时也使用该值。面板不会显示任何锁定的迹象；要将某项选择保留在文件中，请关闭其锁定，参见[锁定](./settings.md#锁定)。  
在只读编辑器中，标注改为 `This window only`，因为那里的更改只作用于该窗口，参见[只读编辑器](#read-only-editors)。

## 语言

支持二十二种目标，按语言、ORM、Schema 三组依次列出，每组内按字母顺序排列。面板的列表和右键菜单会在各组之间画一条分隔线，但不会为任何一组命名：

| 目标 | 分组 | 关系 | 索引 | ON DELETE / ON UPDATE | 保存为 |
| --- | --- | --- | --- | --- | --- |
| `C#` | 语言 | — | — | — | `.cs` |
| `Go` | 语言 | — | — | — | `.go` |
| `Java` | 语言 | — | — | — | `.java` |
| `Kotlin` | 语言 | — | — | — | `.kt` |
| `PHP` | 语言 | — | — | — | `.php` |
| `Rust` | 语言 | — | — | — | `.rs` |
| `Scala` | 语言 | — | — | — | `.scala` |
| `Swift` | 语言 | — | — | — | `.swift` |
| `TypeScript` | 语言 | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | 仅 ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | 仅唯一索引 | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

默认值为 `GraphQL`。所有目标都会生成列，✓ 标记表示除此之外还会生成什么。  
表按名称顺序生成，而不是按其在画布上的摆放顺序，索引则使用[表属性](./table-related-functions.md#indexes)中 `Indexes` 下列出的索引，而不是其上方的 `Keys` 行。`SeaORM` 只写出其中的唯一索引，`Mermaid` 会将唯一列标记为 `UK`，但不写出任何索引。  
除 `Java`、`AML`、`DBML` 和 `Mermaid` 外，所有目标都会将主键列写为非空，无论该列是否设置了 `Not Null`。`Java` 不会将任何列标记为可空或非空，`AML`、`DBML` 和 `Mermaid` 则按图中的设置保留该标志。

部分目标写出的内容：

- `PHP`：由带类型的公共属性构成的普通类，以 `<?php` 和 `declare(strict_types=1);` 开头。
- `Doctrine`：使用注解（attribute）的 Doctrine ORM 3 实体，适用于 DBAL 4.2 或更高版本，每列都带有其 DBAL 类型以及适用于所选数据库的选项。
- `Rust`：每张表一个 `pub struct`，其类型以完整路径书写，例如 `chrono::NaiveDateTime` 或 `rust_decimal::Decimal`，不含 `use` 行。
- `SeaORM`：采用 dense 格式的 SeaORM 2.0 实体，每张表是一个 `pub mod`，因此整段文本可以作为一个文件编译。
- `Swift`：每张表一个遵循 `Codable`、`Hashable`、`Sendable` 的 struct，需要 Swift 6.1 或更高版本。
- `TypeScript`：每张表一个 `export interface`，与 `Zod` schema 一样将行描述为 JSON：日期或时间为 `string`，可空列为 `T | null`。
- `Zod`：每张表一个 Zod 4 行 schema 及其推断出的类型，不含插入 schema，也不含关系。
- `JSON Schema`：一个 JSON Schema draft 2020-12 文档，每张表的行 schema 位于 `$defs` 下。
- `Mermaid`：一个 `erDiagram`，即 GitHub 能够渲染的那种图，每张表是一个实体，列出每一列及其类型和 `PK`、`FK` 或 `UK` 标记，每个关系是其两张表之间的一条线。

`AML`、`DBML` 和 `GraphQL` 都是可往返的格式，它们同时也是导入来源。参见[导入与导出文件](./file-import-export.md)。其他 Schema 目标，即 `JSON Schema`、`Mermaid` 和 `Zod`，只能输出。  
`DBML` 会将每张表的颜色写为 `headercolor`，并在整个文档的代码中，于各 `Ref` 之后为每个含有表的[表分组](./table-groups.md)写出一个 `TableGroup` 块。`AML` 会将表的颜色写为 AML 颜色名称中最接近的一个。

## ON DELETE 与 ON UPDATE {#on-delete-and-on-update}

关系的 ON DELETE 与 ON UPDATE 操作通过该关系的右键菜单设置，参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
在[语言](#语言)表格的 `ON DELETE / ON UPDATE` 列中带有 ✓ 的目标会写出关系所设置的操作；保持为 `Not set` 的操作不会写出任何内容。  
ORM 目标会保留哪些操作取决于所选数据库，而 `AML` 和 `DBML` 会全部保留，参见[数据库](#database)。

- `Doctrine` 只写出 ON DELETE，因为 Doctrine 没有 ON UPDATE。它会在关系拥有方的 `ManyToOne` 或 `OneToOne` 的每个 `#[ORM\JoinColumn]` 上添加 `onDelete: 'CASCADE'`，例如 `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`，而在反向一方的 `OneToMany` 或 `OneToOne` 上不写任何内容。指向非主键的唯一列的关系仍保持为普通列，Doctrine 会在不建立关联的情况下映射它们，因此不会写出任何操作。
- `Drizzle` 以小写写出这些操作。在 `.references()` 上，它们以选项的形式写出，例如 `{ onDelete: "cascade", onUpdate: "set null" }`；在多列键所使用的 `foreignKey()` 上，它们以链式调用写出，例如 `.onDelete("restrict").onUpdate("no action")`。
- `SeaORM` 会将这些操作写在子表的 `belongs_to` 关系上，ON UPDATE 在前，并使用 SeaORM 的名称 `NoAction`、`Cascade`、`SetNull`、`SetDefault` 和 `Restrict`，例如 `on_update = "Cascade", on_delete = "SetNull"`。父表的 `has_one` 或 `has_many` 不会带有任何操作。
- `Sequelize` 会将 `onDelete: "CASCADE"` 与 `onUpdate` 条目写入两个关联调用：`hasMany` 或 `hasOne`，以及 `belongsTo`。多列键不会生成关联调用，因此 `Sequelize` 不会为其写出任何操作。
- `SQLAlchemy` 会将 `ondelete="CASCADE"` 与 `onupdate` 参数传给单列键的 `ForeignKey()`，以及多列键的 `ForeignKeyConstraint()`。
- `TypeORM` 会将 `onDelete: "CASCADE"` 与 `onUpdate` 选项写在关系拥有方的 `@ManyToOne` 或 `@OneToOne` 上，从不写在反向一方。它总是省略 `SET DEFAULT`，因为 TypeORM 会将其写为 `DEFAULT`，而没有任何数据库接受这种写法。
- `DBML` 会在 `Ref` 上添加设置，例如 `[delete: set null, update: no action]`。
- `AML` 会将设置了操作的关系写成带属性的独立 `rel` 语句，例如 `{onDelete: cascade, onUpdate: "set null"}`，而不是内联写在其列上。

`JPA` 不会写出任何操作：纯 JPA 没有对应的选项，生成器也不使用 Hibernate 的 `@OnDelete`。`Mermaid` 同样不会写出任何操作，因为 `erDiagram` 的连线中没有可以放置它们的位置。  
在只显示一张表的表属性 `Code Generator` 标签页中，`DBML` 不会写出 `Ref`，`AML` 也不会写出 `rel` 语句，因此两者都不会在那里显示这些操作；对于设置了操作的单列关系，`AML` 会像对待没有操作的关系一样，将其内联写在列上。`Mermaid` 在那里完全不会写出关系连线。`Doctrine` 和 `SeaORM` 在那里写出的实体与整个文档中的相同，其中的操作也一样。

## 名称大小写

`Table Name Case` 与 `Column Name Case` 均支持 `Pascal`、`Camel`、`Snake` 和 `None`。  
默认值为表名 `Pascal`、列名 `Camel`。`None` 会按图中书写的名称原样生成。  
无论采用哪种大小写，目标语言保留的名称都会在该语言可以转义时被转义，例如 `C#` 中的 `@class` 或 `Rust` 中的 `r#type`，在无法转义时则会被重命名，例如 `Java` 中的 `class_`。

`AML`、`DBML` 与 `Mermaid` 会忽略这两项设置，始终按图中的名称原样生成。  
`SeaORM` 同样会忽略它们：它以 snake case 命名字段和模块，这是 SeaORM 读回时使用的形式，并在 `table_name` 中给出存储的名称，在两者不同时还会在 `column_name` 中给出。  
对于这四种目标，面板会将两个列表都变暗显示，并在其下方带有 `Not used by` 说明。

无论[名称显示](./logical-names.md#name-view)当前是哪种显示方式，所有目标都会写出物理名。  
没有任何目标会写出逻辑名，即使是写入空注释也不会：此标签页没有与 Schema SQL 标签页的 [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) 相对应的选项。  
也没有任何目标会写出域：关联到域的列会像其他列一样以其数据类型写出。

## 数据库 {#database}

数据类型根据所选数据库解析，参见[数据库](./table-related-functions.md#databases)。  
在此标签页中，可以通过面板的 `Database` 列表、右键菜单的 `Database` 或快速搜索选择数据库，代码会立即重写。这是图唯一的数据库设置，与画布右键菜单和 [Schema SQL](./schema-sql.md) 标签页所设置的是同一个，因此在这里所做的更改也会反映到那里。  
`Drizzle` 会根据同一项设置决定方言：PostgreSQL 为 `pgTable`，MySQL 和 MariaDB 为 `mysqlTable`，SQLite 为 `sqliteTable`，其他数据库均为 `pgTable`。  
在 PostgreSQL、MySQL、MariaDB 或 SQLite 上，凡是 SeaORM 原本会创建出不同列类型的地方，`SeaORM` 都会写出 `column_type`；在 MSSQL、Oracle、Snowflake 或 Databricks 上则不写出，因为 SeaORM 没有这些数据库的后端。

所选数据库还决定 ORM 目标会写出哪些 ON DELETE 与 ON UPDATE 操作。  
`Doctrine`、`SeaORM`、`Sequelize`、`SQLAlchemy` 和 `TypeORM` 会省略该数据库的 Schema SQL 所省略的操作，例如 MySQL 和 MariaDB 的 `SET DEFAULT`、MSSQL 的 `RESTRICT`，或 Snowflake 和 Databricks 上除 `NO ACTION` 以外的所有操作，因此由数据库的默认行为决定。完整列表参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
`Drizzle` 则遵循它所写出的方言：`mysqlTable` 代码会省略 `SET DEFAULT`，而 `pgTable` 和 `sqliteTable` 代码会保留所有操作，包括它为 MSSQL、Oracle、Snowflake 和 Databricks 写出的 `pgTable` 代码。

`AML`、`DBML` 与 `Mermaid` 是例外，它们会按图中书写的内容原样生成每个数据类型，因此数据库设置不会改变其输出，面板也会为它们将 `Database` 变暗显示。`AML` 和 `DBML` 会写出关系所设置的每个操作，`Mermaid` 则不写出任何操作。

## 括号 {#bracket}

只有在语言为 `Doctrine`、`JPA` 或 `SeaORM` 时，面板、右键菜单和快速搜索中才会提供 `Bracket`。  
它与 Schema SQL 标签页的括号是同一个设置，参见 [Schema SQL](./schema-sql.md#database-and-bracket)，因此在这里所做的更改也会改变 Schema SQL 为名称加引号的方式。可选 `SingleQuote`、`DoubleQuote`、`Backtick` 和 `None`，初始为 `None`。

- `Doctrine`：`Bracket` 为 `None` 以外的任何值时，每个表名、列名和连接列名都会用反引号包裹，这是 Doctrine 标记需要加引号的名称的方式，例如 ``#[ORM\Table(name: '`order`')]``。为 `None` 时，只有需要加引号的名称才会被包裹：数据库保留的单词、不是纯 ASCII 标识符的名称，或输入时带有引号的名称。
- `JPA`：`Bracket` 为 `None` 以外的任何值时，作为保留字的表名会在 `@Table` 中加上引号，例如 `@Table(name = "\"user\"")`。为 `None` 时则不加引号，与 Schema SQL 的处理方式相同。
- `SeaORM`：为 `None` 时，名称按数据库存储它们的形式写出：带点的表名会拆分为 `schema_name` 和 `table_name`，在 PostgreSQL 上，不带引号的名称会转为小写。为其他任何值时，名称都会按书写的形式完整保留。

## 保存或复制结果 {#saving-or-copying-the-result}

选项面板底部或右键菜单中的 `Save file` 会将显示的代码保存为文件。  
文件与所有导出一样以 `<database name>-<timestamp>` 命名，后接[语言](#语言)表格中的扩展名，例如 `shop-2026-10-12T04_05_06.ts`，并保存到宿主中所有导出文件的保存位置，参见[导出](./file-import-export.md#exporting)。`Java` 和 `JPA` 会像标签页中显示的那样，将所有类放在一个 `.java` 文件中。  
Export 菜单中没有 Code Generator 条目，表属性的 `Code Generator` 标签页也无法保存文件。

要复制代码，可以点击面板底部的 `Copy`，也可以将鼠标悬停在代码上并点击右上角的复制按钮，后者是表属性中唯一的复制方式。  
带有勾选标记的 `Copied!` 提示会显示两秒以示确认。如果浏览器或宿主拒绝访问剪贴板，则会改为显示带有警告标志的 `Couldn't copy to the clipboard` 提示，持续五秒。再次复制会替换当前提示，而不会再添加一条。  
文本也可以直接选中，因此可以只取需要的部分。

## 只读编辑器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，面板的列表、右键菜单和快速搜索仍可更改 `Language`、`Database`、`Table Name Case`、`Column Name Case` 和 `Bracket`，但只作用于该窗口，因此面板把它们标注为 `This window only`，而不是 `Saved in the document`。  
更改会重写该屏幕上的代码，但无论锁定如何，都不会保存到文件、与协作者共享或记录到 Undo，并且协作者对你所选设置的更改会让你的选择保留在屏幕上。`Database` 和 `Bracket` 同时也是 Schema SQL 标签页的设置，因此在这里的选择会在同一窗口的那里显示，参见[只读编辑器](./schema-sql.md#read-only-editors)。  
编辑器再次变为可写后，文档的设置会恢复，并按这些设置写出代码。  
`Save file` 和 `Copy` 保存和复制的是所显示的代码。
