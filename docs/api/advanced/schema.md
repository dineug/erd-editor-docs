---
sidebar_position: 3
description: The .erd.json document format — the storage form a file holds and the runtime value an editor holds, the TypeScript types, the constants behind each numeric field, and the published JSON Schema.
---

# Schema

`.erd.json` is the editor's document format. Read this page if you need to generate, validate, or migrate a document outside the editor.

Since `4.0.0` a document has two serializations, both with `version` `'3.0.0'`. The storage form is what a file holds: it is what [`editor.value`](../erd-editor-element.md#value) returns, what the JSON export writes, and the only form the published [JSON Schema](#json-schema) accepts. The runtime value is the whole document as an editor holds it, which [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) returns. `setInitialValue()`, the `value` setter and `setSchemaJSON()` read either form, any file an earlier release saved, and a v2 `.vuerd` document. Before `4.0.0` there was only one: `value` returned the whole document as the editor held it, as `runtimeValue` does now.

## Storage Form and Runtime Value

The storage form holds the live entities alone: each table listed in `doc.tableIds`, the columns those tables list, the relationships between two kept tables, the indexes of kept tables with the index columns whose column the table still lists, and the listed memos and table groups. It leaves out what an editor derives on load or keeps while it is open: removed entities, `seqColumnIds` and `seqIndexColumnIds`, every `zIndex`, the measured widths, the column `ui`, and a relationship's `identification`, `startRelationshipType` and anchors. The types below mark each of these fields `// runtime only`.  
Every collection is keyed by id in code-unit order, columns grouped by `tableId` and index columns by `indexId` first. Each entity writes its fields in a fixed order, and the text is indented two spaces and ends with a newline. So the same document always writes the same bytes, an edit changes only what it touches, and a file saved on a machine with other fonts reopens to the same `value`.  
VS Code, Obsidian and the JetBrains plugin write a file only when an edit changes `value`, so a file an earlier release saved keeps its old form until its first edit.

The runtime value keeps what the storage form leaves out: removed entities, sequences, z-indexes, widths, key marks, relationship flags and anchors. It is indented two spaces with no trailing newline. Use it only to seed a collaborator or a second view through `setInitialValue()`, so that an undo of a removal another editor sends brings the entity back whole there. Never write it to a file; the JSON Schema refuses it. Nothing collects removed entities any more, so the runtime value keeps them until the document is next opened from its file.

Both forms write each locked setting at its locked value (see [`lockSettings`](#settings)), `settings.ddlScripts` only while a script holds text, and a table's `groupId` only while it is not empty. The storage form writes `doc.tableGroupIds` and `tableGroupEntities` only while a table group exists; the runtime value writes them while the document holds a group or a removed one.

## TypeScript

The types describe the runtime value. A field marked `// runtime only` is left out of the storage form, and a field marked `?` is written only while it holds something.

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
  };
};
```

Each entity is keyed by its `id`, an opaque string; a parse drops an entity whose `id` is missing or empty. Since `4.0.0` every new id is a UUIDv7 written in Uuid25 form, 25 lowercase base-36 digits such as `03gzrxjv20bdlcak89q25d2m7`, so the ids one editor mints sort in the order it made them. A document keeps the ids it holds, such as the nanoid ids of an earlier release or a v2 file's ids, so nothing should rely on an id's shape.

Since `4.0.0` no entity carries a `meta` object (`createAt`, `updateAt`), and the `EntityMeta` and `EntityType` types were removed. Nothing writes it, a parse drops the `meta` an older file carries, and the JSON Schema refuses it. It only timed the garbage collection of removed entities, which is gone as well.

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
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
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
} as const;
```

`originX` and `originY` are the view: the screen point scene `(0, 0)` lands on.  
`zoomLevel` runs from `0.1` to `1.5`. A document saved past `1` opens at `1` in an editor before `3.5.0`.  
Since `4.0.0` the settings carry no `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` or `ignoreSaveSettings`. Nothing writes them, the parser keeps none of them, and the JSON Schema refuses a file that still has them.

`canvasType` is the tab a document opens on. A document saved on the Visualization tab holds `'@dineug/erd-editor/builtin-visualization'` but not whether `Graph` or `Flow` mode was showing, and a newly created editor shows that tab in `Graph` mode.  
Since `4.0.0`, while the `Canvas Type` lock is on, as it is in a new document, the document keeps the tab that showed when it was locked, and switching tabs leaves `value` as it was. A lock taken on the Settings tab holds the tab the reader came from, and a locked `'settings'`, which only a hand edit can write, opens on `'ERD'`.  
None of `Flow` mode's own state is serialized — its placement, zoom, pan, row display and focused tables stay in the editor — so `originX`, `originY` and `zoomLevel` always describe the ERD canvas.

`show` and `lockSettings` are bitmasks — OR the flags together.  
`columnOrder` is an array holding all seven `ColumnType` values, in display order.  
`database`, `language`, `tableNameCase`, `columnNameCase` and `bracketType` each hold exactly one value, and the JSON Schema rejects a combined value.

A new document's `show` is `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` and `relationship`.  
Since `3.10.0` there are two more `show` flags, both off in a new document and in every document saved before `3.10.0`.  
`columnAlternateKey` (`512`) is the [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) view option. Set, it marks the columns of each unique index over two or more columns as `AK1.1`, `AK1.2` and so on. It starts off, so no existing diagram changes width.  
`hideReferentialAction` (`1024`) works the other way round: set, it hides the [ON DELETE and ON UPDATE labels](../../guide/guides/relationship-editing.md#reading-a-connector) on connectors, so they show by default. The `Referential Actions` view option is checked while the flag is off. It changes no table's size.  
An editor before `3.10.0` keeps `show` as a whole number, so both flags survive a save there.

Since `4.0.0` there are two more `show` flags, both off in a new document and in every document saved before `4.0.0`. Like `hideReferentialAction`, each hides what it names, so table groups and memos show by default.  
`hideTableGroup` (`2048`) hides the [table groups](../../guide/guides/table-groups.md), and `hideMemo` (`4096`) hides every memo. They are the `Table Groups` and `Memos` [view options](../../guide/guides/table-related-functions.md#table-view-options), each checked while its flag is off. Neither changes any table's size.  
An editor before `4.0.0` keeps `show` as a whole number, so both flags survive a save there.

Since `4.0.0` `Language` has eight more [Code Generator](../../guide/guides/code-generator.md) targets, `Mermaid` through `JSONSchema`. A `language` the parser does not know reads as `GraphQL`, so an editor before `4.0.0` opens a document saved with one of them on GraphQL, and saving there writes GraphQL.

Since `4.0.0` `lockSettings` takes the place of `ignoreSaveSettings`, and `LockSettingType` that of `SaveSettingType`, which was removed. `lockSettings` names the settings a document saves as they stood when they were locked. `viewport` covers `originX`, `originY` and `zoomLevel` together, since an origin saved without its zoom opens elsewhere, and each other bit covers the field it is named after. These are the [`Lock`](../../guide/guides/settings.md#lock) rows of the Settings tab.  
A locked setting is written at its locked value, whatever the editor shows, by `value` and `runtimeValue` alike, and every other setting as it stands. So while the matching lock is on, scrolling and zooming, switching tabs, or changing the Code Generator language, a name case or the bracket type leaves the file as it was. Locking takes the value the setting holds at that moment, and a parse takes the locked value from the saved field.  
A document started from nothing — a new editor or replication store, or a blank value given to `value` or `setInitialValue()` — has `lockSettings` set to `63`, every lock on. A document whose `settings` carry no `lockSettings` — every file saved before `4.0.0`, whatever its `ignoreSaveSettings`, and every v2 document — opens with every lock on as well: its view and tab where a new document's are (`originX` and `originY` `0`, `zoomLevel` `1`, the ERD tab), and its language, name cases and bracket type locked at what it saved. A document that names its locks keeps them, `0` included, and every value it saved.  
A parse keeps every bit of `lockSettings`, unknown ones too, so a lock a later release adds survives a save here; the JSON Schema checks only that it is an integer. An editor before `4.0.0` drops `lockSettings` when it saves and writes the view and tab as they stand, so the file opens here again as one saved before `4.0.0`.

Since `4.0.0` `ddlScripts` holds the [Schema SQL](../../guide/guides/schema-sql.md) tab's two scripts, which the DDL of every database writes: `before` after the header and ahead of the tables, `after` past the generated DDL. The DDL writes each with LF line breaks, without its leading blank lines and trailing whitespace, and on MSSQL ended with `GO`, as [Before and After Scripts](../../guide/guides/schema-sql.md#before-and-after-scripts) describes; `ddlScripts` itself keeps each script as typed. The key is written only while either script holds text, and then with both; a missing key, or a script that is not a string, reads as `''`. The tab's `Statements`, `Header` and `Tables` choices are not saved in the document.  
An editor before `4.0.0` drops the scripts when it loads a document, so saving there loses them.

`Database`, `Language`, `Show`, `LockSettingType` and `ReferentialAction` are append-only. A saved document stores the number, so a new vendor, code-generation target, flag, lock or action takes the next bit instead of a slot in the middle.

### Doc

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
};
```

Each list is the order of one kind of entity, which the DDL, the table sort and the draw order read. In the storage form each list holds only the ids of kept entities, each once, in the order listed. Since `4.0.0` `tableGroupIds` is the order of the table groups.

Since `4.0.0` stacking order is not saved. A parse stacks each listed table, memo and table group that carries no `zIndex` by its place in its list, later ones in front: table groups from `1`, tables from `2`, and memos above every table. An entity that carries a `zIndex`, as in a runtime value or a file saved before `4.0.0`, keeps it. Bringing a table or memo to the front is therefore lost when the file is reopened.

### Collection: tableEntities

```ts
type Table = {
  id: string;
  name: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Since `4.0.0` a table carries `groupId`, the id of the [table group](../../guide/guides/table-groups.md) it belongs to. A missing or empty `groupId`, or one that names no group in `doc.tableGroupIds`, means none, and the storage form writes it only while it names a kept group.  
A parse starts `seqColumnIds` at `columnIds` when it is missing or lacks a listed id, and an editor measures `widthName` and `widthComment` again with its own fonts on every load.

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
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthComment: number;
  widthDataType: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

Since `4.0.0` the storage form writes no column `ui`. Every load derives `keys`, the primary key mark from the `primaryKey` bit of `options` and the foreign key mark from the relationships that end on the column, and measures the four widths.  
An editor before `4.0.0` shows the columns of a file saved here without their primary key icons.

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

Since `3.10.0` a relationship carries `onDelete` and `onUpdate`, its [ON DELETE and ON UPDATE actions](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Each holds exactly one `ReferentialAction` value. `none`, the default, writes no clause, so the database's own default applies. The other five stand for `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` and `RESTRICT`. Schema SQL writes a clause only for a database that accepts its action.  
The storage form always writes both, and since `4.0.0` the JSON Schema requires them, checking only that each is an integer. A parse still reads a missing field, as in every document saved before `3.10.0`, as `none`, and so does a value outside the list.  
An editor before `3.10.0` does not know the fields and drops them when it loads a document, so saving there loses every action.

Since `4.0.0` every load derives what the storage form leaves out. A relationship is identifying when every column it ends on is a primary key, and its `startRelationshipType` is `dash` when every such column is NOT NULL and `ring` otherwise; one with no end column left is non-identifying and `dash`, as a new relationship starts. The anchors, `x`, `y` and `direction`, are placed again.

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

A parse starts `seqIndexColumnIds` at `indexColumnIds` when it is missing or lacks a listed id.

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

Since `4.0.0` tables and memos [share one stack](../../guide/guides/table-related-functions.md#moving-multiple-tables) ordered by `zIndex`, so bringing a table to the front can put it over a memo. A parse stacks a memo saved without a `zIndex` above every table, as [Doc](#doc) describes. A memo in a file saved before `4.0.0` keeps the `zIndex` it saved, which came from the same counter as the tables', so a memo an earlier release drew over every table can open under a table brought to the front after it.

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

Since `4.0.0` a document can hold [table groups](../../guide/guides/table-groups.md): named, colored rectangles drawn behind tables. A table joins one through its own `groupId`, so a group holds no list of members. The storage form writes the collection, like `doc.tableGroupIds`, only while a group exists, and a document without it, such as one saved before `4.0.0`, has no groups. `Show.hideTableGroup` hides them.  
An editor before `4.0.0` drops the groups and every table's `groupId` when it loads a document, so saving there loses every group.

## JSON Schema

The canonical schema file is published at [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) and can be referenced directly with `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Put `$schema` at the top of an `.erd.json` file and editors that understand JSON Schema, such as VS Code, validate the document and autocomplete its fields as you edit.

Since `4.0.0` the schema describes the storage form alone. Every object with named fields is closed (`additionalProperties: false`), every field the storage form always writes is required, and no field it leaves out is named. It therefore refuses the runtime value. It also refuses a file saved before `4.0.0`, with its `meta`, widths, `zIndex`, `ignoreSaveSettings` and the rest, until an editor of `4.0.0` or later saves that file again. A file saved by `3.2.0` or later already names this schema's URL, which points at the `main` branch, so an editor that validates against it flags the file now. A file saved by `3.0.0` or `3.1.0`, or a v2 document, names no `$schema`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order, without what an editor derives on load or keeps while it is open",
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
        }
      },
      "required": [
        "tableEntities",
        "tableColumnEntities",
        "relationshipEntities",
        "indexEntities",
        "indexColumnEntities",
        "memoEntities"
      ],
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc", "collections"],
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
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096); the three hide bits hide what they name while set",
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
            "settings"
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
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64)",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "minItems": 7,
          "maxItems": 7
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel",
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
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read",
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
      "required": ["tableIds", "relationshipIds", "indexIds", "memoIds"],
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
            "required": ["x", "y", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "comment", "columnIds", "ui"],
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
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8)",
            "type": "integer"
          }
        },
        "required": [
          "id",
          "tableId",
          "name",
          "comment",
          "dataType",
          "default",
          "options"
        ],
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
        "required": ["id", "name", "tableId", "indexColumnIds", "unique"],
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
            "required": ["x", "y", "width", "height", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "value", "ui"],
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
        "required": ["id", "name", "color", "ui"],
        "additionalProperties": false
      }
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
