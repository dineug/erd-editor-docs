---
sidebar_position: 3
description: .erd.json 文档格式：文件所保存的存储形式与编辑器所持有的运行时值、TypeScript 类型、各数值字段背后的常量，以及发布的 JSON Schema。
---

# Schema

`.erd.json` 是编辑器的文档格式。如果需要在编辑器之外生成、校验或迁移文档，可以阅读本页。

从 `4.0.0` 起，文档有两种序列化形式，两者的 `version` 都是 `'3.0.0'`。存储形式是文件所保存的形式：它是 [`editor.value`](../erd-editor-element.md#value) 返回的内容、JSON 导出写入的内容，也是所发布的 [JSON Schema](#json-schema) 唯一接受的形式。运行时值是编辑器所持有的完整文档，由 [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) 返回。`setInitialValue()`、`value` 的 setter 和 `setSchemaJSON()` 都能读取这两种形式、较早发布版本保存的任何文件，以及 v2 的 `.vuerd` 文档。在 `4.0.0` 之前只有一种形式：`value` 返回编辑器所持有的完整文档，就像现在的 `runtimeValue` 一样。

## 存储形式与运行时值

存储形式只包含现存的实体：`doc.tableIds` 中列出的每个表、这些表所列出的列、两端的表都被保留的关系、被保留的表的索引及其所指的列仍由该表列出的索引列、列出的备注和表分组，以及从 `4.2.0` 起列出的、在 id 之外还有值的词根、术语和域。它不包含编辑器在加载时推算出的内容或在打开期间保留的内容：已删除的实体、`seqColumnIds` 和 `seqIndexColumnIds`、所有 `zIndex`、测量得到的宽度、列的 `ui`、关系的 `identification`、`startRelationshipType` 和锚点，以及从 `4.2.0` 起每个词典行的 `order` 和列表 `doc.wordIds`、`doc.termIds` 与 `doc.domainIds`。下面的类型将这些字段都标注为 `// runtime only`。  
除词典外，每个集合都以 id 为键，按码元（code unit）顺序排列，其中列先按 `tableId` 分组，索引列先按 `indexId` 分组。从 `4.2.0` 起，`wordEntities`、`termEntities` 和 `domainEntities` 依次排在所有其他集合之后，每个都写成一个标题行和若干数据行，每个数据行单独占一行（参见[词典行](#dictionary-rows)）。每个实体都按固定顺序写出其字段，文本以两个空格缩进，并以换行符结尾。因此，同一个文档总是写出相同的字节，一次编辑只会改变它所涉及的内容，在字体不同的机器上保存的文件重新打开后也会得到相同的 `value`。  
VS Code、Obsidian 和 JetBrains 插件只在编辑改变了 `value` 时才写入文件，因此较早发布版本保存的文件会一直保持其旧形式，直到第一次编辑为止。

从 `4.2.0` 起，存储形式还会省略不含任何内容的部分：实体或其 `ui` 中值为 `''` 的每个文本字段（表的 `name`、`comment` 和 `ui.color`，列的 `name`、`comment`、`dataType` 和 `default`，索引的 `name`，备注的 `value` 和 `ui.color`，表分组的 `name` 和 `color`）、不含任何条目的每个 `doc` 列表和集合，以及所有集合都为空时的 `collections` 本身。只含空白的文本按原样写出，但逻辑名除外，此时它会被省略；在 id 之外的值全部为空或只含空白的词根、术语或域也除外，它会被整个省略。每个 id、实体内的每个列表以及每个数字（包括 `0`）仍会写出。`doc` 总会写出，因此新文档的文件包含 `$schema`、`version`、其设置和 `"doc": {}`。  
与每个 v3 版本一样，解析时会把缺失的文本字段读作 `''`，把缺失的集合读作空集合；而存储形式只在 `doc` 列表所对应的集合不含任何内容时才省略该列表（参见 [Doc](#doc)）。因此，`4.2.0` 之前的编辑器也能打开这些文件，而自行读取文件的程序也必须以同样的方式读取缺失的内容。较早发布版本保存的文件在下次保存后，其空文本、空列表和空集合都会被省略，这一变化只发生一次，此后每次保存的字节都完全相同。

运行时值保留了存储形式所省略的内容：已删除的实体、序列、z-index、宽度、键标记、关系标志和锚点、空的文本字段，以及即使为空也会保留的四个列表 `tableIds`、`relationshipIds`、`indexIds` 和 `memoIds` 与六个集合 `tableEntities` 至 `memoEntities`。从 `4.2.0` 起，它还保留已删除的词根、术语和域、不含任何内容的行、每行的 `order`、三个词典列表、只含空白的逻辑名，以及指向已删除的域的关联。它以两个空格缩进，末尾没有换行符。它只应用于通过 `setInitialValue()` 为协作者或第二个视图载入初始文档，这样，另一个编辑器发来的对删除操作的 Undo 就能在那里完整地恢复该实体。切勿将它写入文件，JSON Schema 会拒绝它。已不再有任何机制回收已删除的实体，因此运行时值会一直保留它们，直到下次从文件打开该文档。

两种形式都会把每项锁定的设置按其锁定的值写出（参见 [`lockSettings`](#settings)），只在有脚本包含文本时写出 `settings.ddlScripts`，并且只在表的 `groupId` 不为空时写出它。从 `4.2.0` 起，两者还只在所写的值不是 `'physical'` 时写出 `settings.nameViewMode`，在可能时以七个条目写出 `settings.columnOrder`（参见 [Settings](#settings)），并且只在表的 `nameDerived` 为 `true` 时写出它。  
存储形式只在存在表分组时写出 `doc.tableGroupIds` 和 `tableGroupEntities`，只在 `logicalName` 含有空白以外的文本时写出它，只在列的 `domainId` 指向文件会写出的域时写出它，并且只在每个词典含有文件会写出的行时写出该词典。运行时值则在文档持有分组或已删除的分组时写出表分组的字段，在 `logicalName` 和 `domainId` 不为 `''` 时写出它们，并在每个词典或其列表含有条目（包括已删除的行）时写出该词典及其列表。

## TypeScript

这些类型描述的是运行时值。标注为 `// runtime only` 的字段不包含在存储形式中，标注为 `?` 的字段只在有内容时才会写出。从 `4.2.0` 起存储形式所省略的空文本、空列表和空集合没有标注。

### ERDEditorSchemaV3

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections: {
    tableEntities: Record<string, Table>;
    tableColumnEntities: Record<string, Column>;
    relationshipEntities: Record<string, Relationship>;
    indexEntities: Record<string, Index>;
    indexColumnEntities: Record<string, IndexColumn>;
    memoEntities: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

每个实体都有一个 `id`，它是一个不透明的字符串，在所属集合中作为该实体的键；三个词典例外，在其中 `id` 是行的第一个值。从 `4.2.0` 起，对于七个以键索引的集合中 `id` 缺失、为空或不是字符串的实体，解析时会以它所在的键作为其 id，并丢弃不是对象的条目，以及没有 id 且键为 `''` 的条目。词典行不是数组，或者其 `id` 不是 `''` 以外的字符串时，会被丢弃。`4.2.0` 之前的编辑器会丢弃 `id` 缺失或为空的实体，因此存储形式仍会写出每个 id。  
从 `4.0.0` 起，每个新 id（包括词典行的 id）都是以 Uuid25 形式写出的 UUIDv7，即 25 位小写的 36 进制数字，例如 `03gzrxjv20bdlcak89q25d2m7`，因此同一个编辑器生成的 id 会按其生成的顺序排序。文档会保留它所持有的 id，例如较早发布版本的 nanoid id 或 v2 文件的 id，因此任何代码都不应依赖 id 的形状。

从 `4.0.0` 起，实体不再带有 `meta` 对象（`createAt`、`updateAt`），`EntityMeta` 和 `EntityType` 类型也已移除。不再有任何地方写入它，解析时会丢弃旧文件中带有的 `meta`，JSON Schema 也会拒绝它。它唯一的用途是为已删除实体的垃圾回收计时，而垃圾回收也已一并移除。

### Settings

```ts
type Settings = {
  originX: number;
  originY: number;
  zoomLevel: number;
  show: number; // Constants: Show
  database: number; // Constants: Database
  databaseName: string;
  canvasType: string; // Constants: CanvasType
  language: number; // Constants: Language
  tableNameCase: number; // Constants: NameCase
  columnNameCase: number; // Constants: NameCase
  bracketType: number; // Constants: BracketType
  relationshipDataTypeSync: boolean;
  columnOrder: number[]; // Constants: ColumnType
  maxWidthComment: number;
  lockSettings: number; // Constants: LockSettingType
  ddlScripts?: DDLScripts;
  nameViewMode?: string; // Constants: NameViewMode
};

type DDLScripts = {
  before: string;
  after: string;
};

// Constants
const CanvasType = {
  ERD: 'ERD',
  visualization: '@dineug/erd-editor/builtin-visualization',
  schemaSQL: '@dineug/erd-editor/builtin-schema-sql',
  generatorCode: '@dineug/erd-editor/builtin-generator-code',
  settings: 'settings',
  dictionary: '@dineug/erd-editor/builtin-dictionary',
} as const;

const Show = {
  tableComment: 1,
  columnComment: 2,
  columnDataType: 4,
  columnDefault: 8,
  columnAutoIncrement: 16,
  columnPrimaryKey: 32,
  columnUnique: 64,
  columnNotNull: 128,
  relationship: 256,
  columnAlternateKey: 512,
  hideReferentialAction: 1024,
  hideTableGroup: 2048,
  hideMemo: 4096,
  columnDomain: 8192,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
  columnLogicalName: 128,
  columnDomain: 256,
} as const;

const Database = {
  MariaDB: 1,
  MSSQL: 2,
  MySQL: 4,
  Oracle: 8,
  PostgreSQL: 16,
  SQLite: 32,
  Databricks: 64,
  Snowflake: 128,
} as const;

const Language = {
  GraphQL: 1,
  csharp: 2,
  Java: 4,
  Kotlin: 8,
  TypeScript: 16,
  JPA: 32,
  Scala: 64,
  Go: 128,
  SQLAlchemy: 256,
  TypeORM: 512,
  Sequelize: 1024,
  Drizzle: 2048,
  DBML: 4096,
  AML: 8192,
  Mermaid: 16384,
  PHP: 32768,
  Doctrine: 65536,
  Rust: 131072,
  SeaORM: 262144,
  Swift: 524288,
  Zod: 1048576,
  JSONSchema: 2097152,
} as const;

const NameCase = {
  none: 1,
  camelCase: 2,
  pascalCase: 4,
  snakeCase: 8,
} as const;

const BracketType = {
  none: 1,
  doubleQuote: 2,
  singleQuote: 4,
  backtick: 8,
} as const;

const LockSettingType = {
  viewport: 1, // originX, originY and zoomLevel
  canvasType: 2,
  language: 4,
  tableNameCase: 8,
  columnNameCase: 16,
  bracketType: 32,
  unlockNameViewMode: 64, // nameViewMode; set while unlocked
} as const;

const NameViewMode = {
  physical: 'physical',
  logical: 'logical',
  both: 'both',
} as const;
```

`originX` 和 `originY` 表示视图，也就是场景坐标 `(0, 0)` 落在屏幕上的位置。  
`zoomLevel` 的范围是 `0.1` ~ `1.5`。保存时超过 `1` 的文档在 `3.5.0` 之前的编辑器中会以 `1` 打开。  
从 `4.0.0` 起，settings 中不再带有 `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization` 和 `ignoreSaveSettings`。不再有任何地方写入它们，解析器也不保留其中任何一个，JSON Schema 会拒绝仍带有它们的文件。

`canvasType` 是文档打开时所在的标签页。在 Visualization 标签页中保存的文档会保存 `'@dineug/erd-editor/builtin-visualization'`，但不会记录当时显示的是 `Graph` 模式还是 `Flow` 模式，新创建的编辑器会以 `Graph` 模式显示该标签页。  
从 `4.0.0` 起，当 `Canvas Type` 锁定开启时（新文档中即是如此），文档会保留锁定时所显示的标签页，切换标签页时 `value` 保持原样。在 Settings 标签页上开启的锁定保留的是读者进入该页之前所在的标签页；而锁定的 `'settings'`（只有手工编辑才能写入）会以 `'ERD'` 打开。  
从 `4.2.0` 起，`canvasType` 还可以是 `'@dineug/erd-editor/builtin-dictionary'`，即 [Dictionary](../../guide/guides/dictionary.md) 标签页，`Canvas Type` 锁定会像保留其他标签页一样保留它。`4.2.0` 之前的编辑器会保留该值，但在读者选择一个标签页之前，其工具栏下方不显示任何标签页。  
`Flow` 模式自身的状态都不会被序列化：它的布局、缩放、平移、行显示和聚焦的表都只保留在编辑器中，从 `4.2.0` 起，[`Previous table` 和 `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) 所逐个切换的视图也是如此。因此，`originX`、`originY` 和 `zoomLevel` 始终描述的是 ERD 画布。

`show` 和 `lockSettings` 是位掩码，将各标志位通过 OR 运算组合。  
`columnOrder` 是一个数组，按显示顺序将每个 `ColumnType` 值各保存一次；从 `4.2.0` 起，文档可以只写出九个值中的七个，如下文关于列顺序的段落所述。  
`database`、`language`、`tableNameCase`、`columnNameCase` 和 `bracketType` 各自只保存一个值，JSON Schema 会拒绝组合后的值。

新文档的 `show` 为 `431`：`tableComment`、`columnComment`、`columnDataType`、`columnDefault`、`columnPrimaryKey`、`columnNotNull` 和 `relationship`。  
从 `3.10.0` 起新增了两个 `show` 标志位，在新文档以及 `3.10.0` 之前保存的所有文档中都处于关闭状态。  
`columnAlternateKey`（`512`）对应 [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) 显示选项。设置后，每个由两列或更多列组成的唯一索引，其列都会被标记为 `AK1.1`、`AK1.2` 等。它默认关闭，因此现有的图都不会改变宽度。  
`hideReferentialAction`（`1024`）则正好相反：设置后，它会隐藏连接线上的 [ON DELETE 与 ON UPDATE 标签](../../guide/guides/relationship-editing.md#reading-a-connector)，因此这些标签默认显示。该标志位关闭时，`Referential Actions` 显示选项处于勾选状态。它不会改变任何表的尺寸。  
`3.10.0` 之前的编辑器会原样保留整个 `show` 数值，因此在其中保存后，这两个标志位依然存在。

从 `4.0.0` 起又新增了两个 `show` 标志位，在新文档以及 `4.0.0` 之前保存的所有文档中都处于关闭状态。与 `hideReferentialAction` 一样，它们各自隐藏其所指的内容，因此表分组和备注默认显示。  
`hideTableGroup`（`2048`）隐藏[表分组](../../guide/guides/table-groups.md)，`hideMemo`（`4096`）隐藏所有备注。它们对应 `Table Groups` 和 `Memos` 两个[显示选项](../../guide/guides/table-related-functions.md#table-view-options)，各自在对应的标志位关闭时处于勾选状态。两者都不会改变任何表的尺寸。  
`4.0.0` 之前的编辑器会原样保留整个 `show` 数值，因此在其中保存后，这两个标志位依然存在。

从 `4.2.0` 起又新增了一个 `show` 标志位 `columnDomain`（`8192`），在新文档以及 `4.2.0` 之前保存的所有文档中都处于关闭状态，因此新文档的 `show` 仍为 `431`。它对应 `Domain` [显示选项](../../guide/guides/table-related-functions.md#table-view-options)：设置后，每一列所在的行都会显示一个[域单元格](../../guide/guides/logical-names.md#the-domain-cell)，这会让表变宽。它初始为关闭状态，因此现有的图都不会改变宽度。  
`4.2.0` 之前的编辑器会原样保留整个 `show` 数值，因此在其中保存后，该标志位依然存在。

从 `4.2.0` 起，`ColumnType` 有九个值。`columnLogicalName`（`128`）决定逻辑名单元格的位置，列所在的行只在 `Both Names` 显示方式下绘制该单元格；`columnDomain`（`256`）决定域单元格的位置。它们就是 Settings 标签页[列顺序](../../guide/guides/settings.md#adjusting-column-order)中的 `Logical Name` 和 `Domain` 两行。编辑器持有全部九个值的顺序，新文档的顺序为 `128, 1, 2, 256, 4, 8, 16, 32, 64`。  
当 `128` 紧挨在 `columnName` 之前、`256` 紧挨在 `columnDataType` 之后时，两种形式都会省略 `128` 和 `256`，以七个条目写出该顺序。因此，新文档仍写出 `1, 2, 4, 8, 16, 32, 64`，顺序中从未移动过这两项的文件会保持其字节不变。否则，两种形式会写出全部九个值。  
解析时，无论七个条目的顺序如何，都会把这两项放入七个条目的顺序中的上述位置；包含每种类型的九个条目会按原样采用。  
从 `5.0.0` 起，它也接受其他任何顺序。它对已知的每个 `ColumnType` 只保留一次，并按给定的顺序排列，其余条目全部丢弃：没有任何 `ColumnType` 对应的值（例如后续版本新增的类型），以及同一类型的第二个条目。顺序中缺少的每个类型，会放在顺序所含的、在默认顺序中位于它之前的最近一个类型之后；前面没有任何类型时，则放在位于它之后的最近一个类型之前，`128` 和 `256` 在七个条目中就是这样找到各自的位置的。只有一个不包含任何已知类型的顺序，或者不是数组的值，才会读作默认顺序。  
因此，后续版本保存的文件打开时，会采用其中本版本所认识的类型的顺序，而在此处保存时会写出不含其余类型的顺序。在 `5.0.0` 之前，解析会把其他任何顺序读作默认顺序，因此这样的文件打开时列顺序会被重置。JSON Schema 接受七个或九个整数。

从 `4.0.0` 起，`Language` 新增了八个 [Code Generator](../../guide/guides/code-generator.md) 目标，即从 `Mermaid` 到 `JSONSchema`。解析器不认识的 `language` 会读作 `GraphQL`，因此 `4.0.0` 之前的编辑器打开以其中某个目标保存的文档时会显示 GraphQL，在其中保存则会写出 GraphQL。

从 `4.0.0` 起，`lockSettings` 取代了 `ignoreSaveSettings`，`LockSettingType` 则取代了已被移除的 `SaveSettingType`。`lockSettings` 指明文档按锁定时的状态保存哪些设置。`viewport` 同时涵盖 `originX`、`originY` 和 `zoomLevel`，因为不带缩放级别保存的原点会在别处打开；其他每个位则涵盖与其同名的字段。它们就是 Settings 标签页中的 [`Lock`](../../guide/guides/settings.md#锁定) 各行。  
锁定的设置无论编辑器显示的是什么，都按其锁定的值写出，`value` 和 `runtimeValue` 都是如此；其他所有设置则按其当前状态写出。因此，在相应的锁定开启期间，滚动和缩放、切换标签页、更改 Code Generator 的语言、某种名称大小写或括号类型，或者切换名称显示，都会让文件保持原样。锁定时取的是该设置在那一刻的值，解析时则从所保存的字段中取得锁定的值。  
从零开始创建的文档（新的编辑器或用于数据复制的 store，或者赋给 `value` 或 `setInitialValue()` 的空白值）的 `lockSettings` 为 `63`，即所有锁定都处于开启状态。`settings` 中不带 `lockSettings` 的文档（`4.0.0` 之前保存的所有文件，无论其 `ignoreSaveSettings` 是什么，以及所有 v2 文档）打开时同样所有锁定都处于开启状态：其视图和标签页与新文档相同（`originX` 和 `originY` 为 `0`，`zoomLevel` 为 `1`，ERD 标签页），其语言、名称大小写和括号类型则锁定为保存时的值。写明了锁定的文档会保留这些锁定（包括 `0`），以及它保存的每一个值。  
解析时会保留 `lockSettings` 的每一个位，包括未知的位，因此之后的版本新增的锁定在这里保存后依然存在；JSON Schema 只检查它是否为整数。`4.0.0` 之前的编辑器保存时会丢弃 `lockSettings`，并按当前状态写出视图和标签页，因此该文件再次在这里打开时，会被当作 `4.0.0` 之前保存的文件。

从 `4.2.0` 起新增了第七项锁定 `unlockNameViewMode`（`64`），即 `Name View` 行，它涵盖 `nameViewMode`。与 `Show` 的各个隐藏位一样，它的位与其他锁定位的含义相反：设置时名称显示处于未锁定状态，清除时则处于锁定状态。因此 `63` 仍表示所有锁定都处于开启状态，新文档持有该值，其名称显示锁定为 `'physical'`。`4.2.0` 之前保存的文件无论其他锁定如何（包括 `0`），该位都处于清除状态，因此打开时名称显示锁定为 `'physical'`。所有锁定都关闭的文档持有 `64`，其他锁定都开启而名称显示未锁定的文档持有 `127`。检测此锁定时要取反：当 `(lockSettings & 64) === 0` 时它处于开启状态。  
该锁定开启期间，切换名称显示只会改变执行切换的编辑器的屏幕，文档保留锁定的显示方式。该锁定关闭期间，在可编辑的编辑器中进行的切换属于文档，每个协作者都会随之切换。只读编辑器的切换无论如何都只会改变它自己的屏幕。参见 [`Lock`](../../guide/guides/settings.md#锁定)。  
`4.0.0` 或 `4.1.0` 的编辑器保存时会保留该位，但会丢弃 `nameViewMode`，因此该文档在这里重新打开时为 `'physical'`，其锁定保持原样。

从 `4.0.0` 起，`ddlScripts` 保存 [Schema SQL](../../guide/guides/schema-sql.md) 标签页的两段脚本，每种数据库的 DDL 都会写出它们：`before` 写在头部之后、各表之前，`after` 写在生成的 DDL 之后。DDL 写出每段脚本时使用 LF 换行符，去掉其前面的空行和后面的空白，在 MSSQL 上还会以 `GO` 结尾，如[前置与后置脚本](../../guide/guides/schema-sql.md#before-and-after-scripts)所述；`ddlScripts` 本身则按输入的原样保存每段脚本。只有在任一段脚本包含文本时才会写出该键，并且此时两段都会写出；缺少该键，或者脚本不是字符串时，读作 `''`。该标签页中 `Statements`、`Header` 和 `Tables` 的选择，以及从 `4.2.0` 起其 [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) 开关，都不会保存在文档中。  
`4.0.0` 之前的编辑器会在加载文档时丢弃这些脚本，因此在其中保存会丢失它们。

从 `4.2.0` 起，`nameViewMode` 即[名称显示](../../guide/guides/logical-names.md#name-view)，也就是图所绘制的名称：`'physical'` 绘制每个表和列的名称，`'logical'` 在名称的位置绘制其逻辑名，`'both'` 则绘制逻辑名和名称。菜单中分别称之为 `Physical Names`、`Logical Names` 和 `Both Names`。两种形式都会把它写在最后，即 `ddlScripts` 之后，并且只在所写的值不是 `'physical'` 时写出；`Name View` 锁定开启期间，所写的值就是锁定的值，无论屏幕上显示的是什么。缺少该值，或者解析器不认识该值时，读作 `'physical'`；JSON Schema 只接受 `"logical"` 和 `"both"`。  
`4.2.0` 之前的编辑器会在加载文档时丢弃 `nameViewMode`。

`Database`、`Language`、`Show`、`ColumnType`、`ColumnOption`、`LockSettingType` 和 `ReferentialAction` 只会追加新值。已保存的文档中存储的是数字，因此新增的数据库厂商、代码生成目标、标志位、列类型、列选项、锁定或操作会占用下一个比特位，而不是中间的某个位置。

### Doc

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
  wordIds?: string[]; // runtime only
  termIds?: string[]; // runtime only
  domainIds?: string[]; // runtime only
};
```

前五个列表各自是某一类实体的顺序，DDL、表的排序和绘制顺序都会读取它。在存储形式中，每个列表只包含被保留的实体的 id，每个 id 只出现一次，并按所列出的顺序排列；从 `4.2.0` 起，不含任何 id 的列表会被省略。从 `4.0.0` 起，`tableGroupIds` 是表分组的顺序。

从 `4.2.0` 起，`wordIds`、`termIds` 和 `domainIds` 列出每个词典中现存的行：集合中持有而列表中没有的行即为已删除的行。它们不是工作表的顺序，工作表的顺序由每行的 `order` 给出。只有运行时值会写出它们，并且每个列表只在它自身或其集合含有条目时写出。在文件中，行本身就决定了哪些行属于词典以及它们的顺序，JSON Schema 会拒绝这些列表。  
从 `4.2.0` 起，对于文档中省略的列表，或者以数组以外的形式保存的列表，解析时会将其读作其集合所持有的每个条目，每个 id 一次，按持有的顺序排列；空数组仍为空，此时其集合中的每个条目都读作已删除。`4.2.0` 之前的编辑器会把缺失的列表读作空列表，因此只要集合中含有实体，存储形式就仍会写出对应的列表。

从 `4.0.0` 起，叠放顺序不再保存。解析时，对于列表中列出的、不带 `zIndex` 的每个表、备注和表分组，会按其在所属列表中的位置叠放，排在后面的位于前方：表分组从 `1` 开始，表从 `2` 开始，备注位于所有表之上。带有 `zIndex` 的实体（例如运行时值中的实体，或 `4.0.0` 之前保存的文件中的实体）会保留它。因此，将表或备注移到最前面的操作，在重新打开文件后就会丢失。

### Collection: tableEntities

```ts
type Table = {
  id: string;
  name: string;
  logicalName?: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  nameDerived?: boolean;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthLogicalName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

从 `4.0.0` 起，表带有 `groupId`，即它所属的[表分组](../../guide/guides/table-groups.md)的 id。`groupId` 缺失或为空，或者它所指的分组不在 `doc.tableGroupIds` 中，都表示不属于任何分组；存储形式只在它指向被保留的分组时才写出它。  
解析时，如果 `seqColumnIds` 缺失或缺少列出的某个 id，会以 `columnIds` 作为其初始值；编辑器每次加载时都会用自己的字体重新测量 `widthName`、`widthLogicalName` 和 `widthComment`。

从 `4.2.0` 起，表带有 `logicalName` 和 `nameDerived`：`logicalName` 是 `Logical Names` 和 `Both Names` 两种[显示方式](../../guide/guides/logical-names.md#name-view)所绘制的名称，`''` 表示没有；`nameDerived` 在词典根据逻辑名[生成](../../guide/guides/dictionary.md#deriving-physical-names)了 `name` 时为 `true`。设置该标志时，新的逻辑名会重新生成名称；未设置时，名称算作自行填写的名称，新的逻辑名不会改动它，除非名称为空或只含空白。手动重命名会关闭该标志，而 [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) 甚至会改写自行填写的名称，并在有逻辑名的地方开启该标志。  
存储形式只在 `logicalName` 含有空白以外的文本时，按输入的原样将它写在 `name` 之后；只在 `nameDerived` 为 `true` 时将它写在 `groupId` 之后，这也是 JSON Schema 唯一接受的值。缺少 `logicalName` 时读作 `''`，缺少 `nameDerived` 时读作 `false`，因此 `4.2.0` 之前保存的文件中的每个名称都算作自行填写的名称。  
`4.2.0` 之前的编辑器会在加载文档时丢弃这两个字段，因此在其中保存会丢失每个表的逻辑名。

### Collection: tableColumnEntities

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  logicalName?: string;
  domainId?: string;
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthLogicalName: number;
  widthComment: number;
  widthDataType: number;
  widthDomain: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

从 `4.0.0` 起，存储形式不写出列的 `ui`。每次加载时都会推算出 `keys`（主键标记取自 `options` 的 `primaryKey` 位，外键标记取自以该列为终点的关系），并测量六个宽度。  
`4.0.0` 之前的编辑器显示在这里保存的文件时，其中的列不带主键图标。

从 `4.2.0` 起，列与表一样带有 `logicalName`，还带有 `domainId`，即该列所关联的域的 id，`''` 表示没有。在一个编辑器中进行的编辑会让已关联的列保持其域的数据类型，如[域与数据类型](../../guide/guides/dictionary.md#domains-and-data-types)所述。不过，解析时不会更改任何列的类型，因此在别处写入的文件可能让已关联的列处于其他类型，两个协作者交错的编辑也可能如此；Checks 工作表会将每一处列为 [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds)。解析时会清除指向文档中不存在的域的 `domainId`。已删除的域仍算作文档所持有的域，因此只要 Undo 还能恢复该域，编辑器就会保留指向它的关联。存储形式在 `options` 之后按表的规则写出 `logicalName`，并且只在 `domainId` 指向文件会写出的域时写出它，因此绝不会写出指向已删除的域的关联。  
`ColumnOption.nameDerived`（`16`）是列的名称生成标志，与其他位一起保存在 `options` 中，含义与表的 `nameDerived` 相同。例如，名称由词典生成的 NOT NULL 主键，其 `options` 为 `26`。  
`4.2.0` 之前的编辑器会在加载文档时丢弃 `logicalName` 和 `domainId`，因此在其中保存会丢失它们。它会原样保留整个 `options` 数值，因此在其中保存后，`nameDerived` 位依然存在。

### Collection: relationshipEntities

```ts
type Relationship = {
  id: string;
  identification: boolean; // runtime only
  relationshipType: number; // Constants: RelationshipType
  startRelationshipType: number; // Constants: StartRelationshipType; runtime only
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
  x: number; // runtime only
  y: number; // runtime only
  direction: number; // Constants: Direction; runtime only
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const StartRelationshipType = {
  ring: 1,
  dash: 2,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;

const Direction = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
} as const;
```

从 `3.10.0` 起，关系带有 `onDelete` 和 `onUpdate`，即它的 [ON DELETE 与 ON UPDATE 操作](../../guide/guides/relationship-editing.md#on-delete-and-on-update)。两者各自只保存一个 `ReferentialAction` 值。默认值 `none` 不会写出任何子句，因此由数据库自身的默认行为决定。其余五个值分别对应 `NO ACTION`、`CASCADE`、`SET NULL`、`SET DEFAULT` 和 `RESTRICT`。Schema SQL 只会为支持该操作的数据库写出对应的子句。  
存储形式总会写出这两个字段，并且从 `4.0.0` 起 JSON Schema 要求必须包含它们，但只检查两者是否为整数。解析时，缺少该字段（`3.10.0` 之前保存的所有文档都是如此）仍读作 `none`，不在列表中的值同样读作 `none`。  
`3.10.0` 之前的编辑器不认识这两个字段，会在加载文档时将其丢弃，因此在其中保存会丢失所有操作。

从 `4.0.0` 起，每次加载时都会推算出存储形式所省略的内容。当关系的每个终点列都是主键时，该关系为识别关系；当所有这些列都为 NOT NULL 时，其 `startRelationshipType` 为 `dash`，否则为 `ring`；已没有任何终点列的关系则为非识别关系且为 `dash`，与新建关系的初始状态相同。锚点 `x`、`y` 和 `direction` 会重新放置。

### Collection: indexEntities

```ts
type Index = {
  id: string;
  name: string;
  tableId: string;
  indexColumnIds: string[];
  seqIndexColumnIds: string[]; // runtime only
  unique: boolean;
};
```

解析时，如果 `seqIndexColumnIds` 缺失或缺少列出的某个 id，会以 `indexColumnIds` 作为其初始值。

### Collection: indexColumnEntities

```ts
type IndexColumn = {
  id: string;
  indexId: string;
  columnId: string;
  orderType: number; // Constants: OrderType
};

// Constants
const OrderType = {
  ASC: 1,
  DESC: 2,
} as const;
```

### Collection: memoEntities

```ts
type Memo = {
  id: string;
  value: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
  color: string;
};
```

从 `4.0.0` 起，表与备注[共用同一个叠放顺序](../../guide/guides/table-related-functions.md#移动多个表)，按 `zIndex` 排序，因此把表移到最前面可能会让它位于备注之上。解析时，不带 `zIndex` 保存的备注会叠放在所有表之上，如 [Doc](#doc) 所述。`4.0.0` 之前保存的文件中的备注会保留其保存的 `zIndex`，该值与表的 `zIndex` 来自同一个计数器，因此较早发布版本绘制在所有表之上的备注，打开时可能会位于在它之后被移到最前面的表之下。

### Collection: tableGroupEntities

```ts
type TableGroup = {
  id: string;
  name: string;
  color: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
};
```

从 `4.0.0` 起，文档可以包含[表分组](../../guide/guides/table-groups.md)：绘制在表后面、带有名称和颜色的矩形。表通过自身的 `groupId` 加入分组，因此分组不保存成员列表。与 `doc.tableGroupIds` 一样，存储形式只在存在分组时才写出该集合，不带该集合的文档（例如 `4.0.0` 之前保存的文档）没有任何分组。`Show.hideTableGroup` 会隐藏它们。  
`4.0.0` 之前的编辑器会在加载文档时丢弃分组以及每个表的 `groupId`，因此在其中保存会丢失所有分组。

### 词典行 {#dictionary-rows}

从 `4.2.0` 起，文档在 `wordEntities`、`termEntities` 和 `domainEntities` 中保存三个词典，即 [Dictionary](../../guide/guides/dictionary.md) 标签页的 `Words`、`Terms` 和 `Domains` 工作表。词根、术语或域的每个字段都是字符串，它们都没有 `ui`。`Checks` 工作表是根据词典和图推算出来的，不会保存。

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

这三个词典都不以 id 为键。每个都写成一个标题行和若干数据行：`fields` 列出实体的各个字段，每个字段一次，id 在最前，每个数据行按该顺序保存一个实体的值。下面的类型按运行时值标题行中的顺序列出每种实体的字段。数据行总会保留其 id 和名称，但会省略名称之后末尾的空值，因此位于某个被保留的值之前的空值仍为 `''`，解析时会把数据行中缺少的值读作 `''`。两种形式都会把每个数据行以紧凑 JSON 的形式单独写在一行中，例如文件中的这两个词根：

```json
"wordEntities": {
  "fields": [
    "id",
    "name",
    "abbreviation",
    "englishName",
    "description",
    "synonyms",
    "forbiddenWords"
  ],
  "rows": [
    ["w1","Customer","CUST","customer"],
    ["w2","Number","NO","number","","No, Num","Nbr"]
  ]
}
```

存储形式按工作表顺序写出列出的行，并省略 `order`，因此其标题行中不含该字段。它会省略 id 之外的值全部为空或只含空白的行（例如添加后从未填写的行，或已被清空的行），以及指向这种域或已删除的域的每个关联：列的 `domainId` 会被省略，术语的则写作 `''`，如果该术语不含其他内容，则整个术语都会被省略。  
运行时值的标题行在 `"name"` 之后紧接着列出 `"order"`。它会按集合持有的顺序写出集合中的每一行，包括已删除的行，因此要得到工作表的顺序，请按 `order` 排序，并按码元顺序比较。解析时会按文件中各行的排列顺序为其赋予 `order` 键，因此读回时的顺序与文件写出的顺序相同。  
不带这些词典的文档（例如 `4.2.0` 之前保存的文档）没有任何词典。`4.2.0` 之前的编辑器会在加载文档时丢弃这三个词典，因此在其中保存会丢失所有词根、术语和域。

### Collection: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  order: string; // runtime only
  abbreviation: string;
  englishName: string;
  description: string;
  synonyms: string;
  forbiddenWords: string;
};
```

词根是构成逻辑名的词之一，`abbreviation` 是它在物理名中所用的缩写。`synonyms` 列出该词根的其他写法，`forbiddenWords` 列出不得代替它使用的词，两者都以逗号分隔。

### Collection: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  order: string; // runtime only
  physicalName: string;
  domainId: string;
  description: string;
  synonyms: string;
};
```

术语是一个完整的逻辑名。`logicalName` 与 `name` 匹配的表或列会生成 `physicalName` 作为名称，`physicalName` 为空时则生成由各词根的缩写组合出的名称；列还会采用 `domainId` 所指的域，`''` 表示没有（参见[生成物理名](../../guide/guides/dictionary.md#deriving-physical-names)）。`synonyms` 以逗号分隔。与列一样，解析时会清除不指向任何域的 `domainId`。

### Collection: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  order: string; // runtime only
  category: string;
  dataType: string;
  description: string;
};
```

域是一个有名称的数据类型，`dataType` 以与列相同的方式保存该类型，包括长度，例如 `NUMERIC(10)`。列或术语通过域的 id 关联该域，编辑器会让每个已关联的列采用该域的数据类型（参见[域与数据类型](../../guide/guides/dictionary.md#domains-and-data-types)）。

## JSON Schema

规范的 schema 文件发布在 [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)，可通过 `$schema` 直接引用。

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

在 `.erd.json` 文件顶部写入 `$schema`，VS Code 等支持 JSON Schema 的编辑器就会校验该文档，并在编辑时自动补全其字段。

从 `4.0.0` 起，该 schema 只描述存储形式。每个带命名字段的对象都是封闭的（`additionalProperties: false`），存储形式总会写出的每个字段都是必需的，它在不含内容时才省略的字段会列出但不是必需的，它总会省略的字段则一个都没有列出。因此它会拒绝运行时值。它也会拒绝 `4.0.0` 之前保存的文件（带有 `meta`、宽度、`zIndex`、`ignoreSaveSettings` 等内容），直到 `4.0.0` 或更高版本的编辑器再次保存该文件为止。由 `3.2.0` 或更高版本保存的文件已经写明了此 schema 的 URL，该 URL 指向 `main` 分支，因此按它进行校验的编辑器现在就会将该文件标记出来。`3.0.0` 或 `3.1.0` 保存的文件，以及 v2 文档，都没有写明 `$schema`。

从 `4.2.0` 起，schema 不再要求实体的文本字段、任何 `doc` 列表、任何集合或 `collections` 本身，存储形式会在它们不含任何内容时将其省略。它仍接受 `4.0.0` 或 `4.1.0` 保存的文件。它列出了新字段：`nameViewMode`，只接受 `"logical"` 和 `"both"`；表的 `logicalName` 和 `nameDerived`，后者只接受 `true`；列的 `logicalName` 和 `domainId`；以及三个词典，每个都带有其标题行和由字符串组成的行。`canvasType` 列出了 Dictionary 标签页，`columnOrder` 接受七个或九个整数，`show`、`columnOrder`、`lockSettings` 和 `options` 的描述中列出了新的位。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order but the dictionaries, a header and one row per entry in document order, without what an editor derives on load or keeps while it is open, without an entity's text field while it is empty, which reads as the empty string, and without an empty list or collection, which reads as none",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "version": {
      "description": "Version of the schema",
      "const": "3.0.0"
    },
    "settings": {
      "$ref": "#/$defs/settings"
    },
    "doc": {
      "$ref": "#/$defs/doc"
    },
    "collections": {
      "description": "The entities of each kind, a kind with none left out",
      "type": "object",
      "properties": {
        "tableEntities": {
          "$ref": "#/$defs/tableEntities"
        },
        "tableColumnEntities": {
          "$ref": "#/$defs/tableColumnEntities"
        },
        "relationshipEntities": {
          "$ref": "#/$defs/relationshipEntities"
        },
        "indexEntities": {
          "$ref": "#/$defs/indexEntities"
        },
        "indexColumnEntities": {
          "$ref": "#/$defs/indexColumnEntities"
        },
        "memoEntities": {
          "$ref": "#/$defs/memoEntities"
        },
        "tableGroupEntities": {
          "$ref": "#/$defs/tableGroupEntities"
        },
        "wordEntities": {
          "$ref": "#/$defs/wordEntities"
        },
        "termEntities": {
          "$ref": "#/$defs/termEntities"
        },
        "domainEntities": {
          "$ref": "#/$defs/domainEntities"
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc"],
  "additionalProperties": false,
  "$defs": {
    "settings": {
      "type": "object",
      "properties": {
        "originX": {
          "type": "number"
        },
        "originY": {
          "type": "number"
        },
        "zoomLevel": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 1.5
        },
        "show": {
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096) | (columnDomain: 8192); the three hide bits hide what they name while set",
          "type": "integer"
        },
        "database": {
          "description": "bit value (MariaDB: 1) | (MSSQL: 2) | (MySQL: 4) | (Oracle: 8) | (PostgreSQL: 16) | (SQLite: 32) | (Databricks: 64) | (Snowflake: 128)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128]
        },
        "databaseName": {
          "type": "string"
        },
        "canvasType": {
          "enum": [
            "ERD",
            "@dineug/erd-editor/builtin-visualization",
            "@dineug/erd-editor/builtin-schema-sql",
            "@dineug/erd-editor/builtin-generator-code",
            "settings",
            "@dineug/erd-editor/builtin-dictionary"
          ]
        },
        "language": {
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64) | (Go: 128) | (SQLAlchemy: 256) | (TypeORM: 512) | (Sequelize: 1024) | (Drizzle: 2048) | (DBML: 4096) | (AML: 8192) | (Mermaid: 16384) | (PHP: 32768) | (Doctrine: 65536) | (Rust: 131072) | (SeaORM: 262144) | (Swift: 524288) | (Zod: 1048576) | (JSONSchema: 2097152)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152]
        },
        "tableNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "columnNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "bracketType": {
          "description": "bit value (none: 1) | (doubleQuote: 2) | (singleQuote: 4) | (backtick: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "relationshipDataTypeSync": {
          "type": "boolean"
        },
        "columnOrder": {
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64) | (columnLogicalName: 128) | (columnDomain: 256); seven entries without the last two while the logical name stands just before the name and the domain just after the data type, all nine otherwise",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "anyOf": [
            { "minItems": 7, "maxItems": 7 },
            { "minItems": 9, "maxItems": 9 }
          ]
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32) | (unlockNameViewMode: 64); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel. The last bit reads the other way round: set, the name view mode is unlocked, and clear, as in a file saved before it, locked",
          "type": "integer"
        },
        "ddlScripts": {
          "description": "SQL the Schema SQL writes as is for every database: before after the header and ahead of the tables, after past the generated DDL. Absent while both are empty",
          "type": "object",
          "properties": {
            "before": { "type": "string" },
            "after": { "type": "string" }
          },
          "required": ["before", "after"],
          "additionalProperties": false
        },
        "nameViewMode": {
          "description": "The names the diagram shows: the logical ones, or both the physical and the logical. Absent while it shows the physical names, the default",
          "enum": ["logical", "both"]
        }
      },
      "required": [
        "originX",
        "originY",
        "zoomLevel",
        "show",
        "database",
        "databaseName",
        "canvasType",
        "language",
        "tableNameCase",
        "columnNameCase",
        "bracketType",
        "relationshipDataTypeSync",
        "columnOrder",
        "maxWidthComment",
        "lockSettings"
      ],
      "additionalProperties": false
    },
    "doc": {
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read, a kind with none left out. A list goes out whenever its collection holds an entity, since a reader that finds none lists none",
      "type": "object",
      "properties": {
        "tableIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "relationshipIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "indexIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "memoIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "tableGroupIds": {
          "description": "Order of the table groups. Written while a group exists; absent means none",
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "tableEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "columnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the table belongs to; absent means none",
            "type": "string"
          },
          "nameDerived": {
            "description": "The dictionaries filled the name, so a new logical name derives it again; absent means a name someone wrote",
            "type": "boolean",
            "const": true
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y"],
            "additionalProperties": false
          }
        },
        "required": ["id", "columnIds", "ui"],
        "additionalProperties": false
      }
    },
    "tableColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "dataType": {
            "type": "string"
          },
          "default": {
            "type": "string"
          },
          "options": {
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8) | (nameDerived: 16); nameDerived is set while the dictionaries filled the name",
            "type": "integer"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "domainId": {
            "description": "Id of the domain in domainEntities that governs the data type; absent means none",
            "type": "string"
          }
        },
        "required": ["id", "tableId", "options"],
        "additionalProperties": false
      }
    },
    "relationshipEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "relationshipType": {
            "description": "bit value (ZeroOne: 2) | (ZeroN: 4) | (OneOnly: 8) | (OneN: 16)",
            "type": "integer"
          },
          "onDelete": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON DELETE clause",
            "type": "integer"
          },
          "onUpdate": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON UPDATE clause",
            "type": "integer"
          },
          "start": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "end": {
            "$ref": "#/$defs/RelationshipPoint"
          }
        },
        "required": [
          "id",
          "relationshipType",
          "onDelete",
          "onUpdate",
          "start",
          "end"
        ],
        "additionalProperties": false
      }
    },
    "indexEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "indexColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "unique": {
            "type": "boolean"
          }
        },
        "required": ["id", "tableId", "indexColumnIds", "unique"],
        "additionalProperties": false
      }
    },
    "indexColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "indexId": {
            "type": "string"
          },
          "columnId": {
            "type": "string"
          },
          "orderType": {
            "description": "bit value (ASC: 1) | (DESC: 2)",
            "type": "integer"
          }
        },
        "required": ["id", "indexId", "columnId", "orderType"],
        "additionalProperties": false
      }
    },
    "memoEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "value": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "tableGroupEntities": {
      "description": "Named, coloured rectangles drawn behind tables; a table joins one through its groupId. Written while a group exists; absent means none",
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "wordEntities": {
      "description": "The words of the dictionary, the parts a logical name is composed of, each with its abbreviation in a physical name. Written while a word exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "abbreviation", "englishName", "description", "synonyms", "forbiddenWords"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "termEntities": {
      "description": "The terms of the dictionary, logical names a column matches by its text, each with its physical name and domain id. Written while a term exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "physicalName", "domainId", "description", "synonyms"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "domainEntities": {
      "description": "The domains of the dictionary, named data types a column or a term links to by id. Written while a domain exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "category", "dataType", "description"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "RelationshipPoint": {
      "type": "object",
      "properties": {
        "tableId": {
          "type": "string"
        },
        "columnIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["tableId", "columnIds"],
      "additionalProperties": false
    }
  }
}
```
