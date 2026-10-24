---
sidebar_position: 3
description: The .erd.json document format — the storage form a file holds and the runtime value an editor holds, the TypeScript types, the constants behind each numeric field, and the published JSON Schema.
---

# Schema

`.erd.json` is the editor's document format. Read this page if you need to generate, validate, or migrate a document outside the editor.

Since `4.0.0` a document has two serializations, both with `version` `'3.0.0'`. The storage form is what a file holds: it is what [`editor.value`](../erd-editor-element.md#value) returns, what the JSON export writes, and the only form the published [JSON Schema](#json-schema) accepts. The runtime value is the whole document as an editor holds it, which [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) returns. `setInitialValue()`, the `value` setter and `setSchemaJSON()` read either form, any file an earlier release saved, and a v2 `.vuerd` document. Before `4.0.0` there was only one: `value` returned the whole document as the editor held it, as `runtimeValue` does now.

## Storage Form and Runtime Value

The storage form holds the live entities alone: each table listed in `doc.tableIds`, the columns those tables list, the relationships between two kept tables, the indexes of kept tables with the index columns whose column the table still lists, the listed memos and table groups, and since `4.2.0` the listed words, terms and domains that hold a value past their id. It leaves out what an editor derives on load or keeps while it is open: removed entities, `seqColumnIds` and `seqIndexColumnIds`, every `zIndex`, the measured widths, the column `ui`, a relationship's `identification`, `startRelationshipType` and anchors, and since `4.2.0` each dictionary row's `order` and the lists `doc.wordIds`, `doc.termIds` and `doc.domainIds`. The types below mark each of these fields `// runtime only`.  
Every collection but the dictionaries is keyed by id in code-unit order, columns grouped by `tableId` and index columns by `indexId` first. Since `4.2.0` `wordEntities`, `termEntities` and `domainEntities` come after every other collection, in that order, each written as a header and rows, one row to a line (see [Dictionary Rows](#dictionary-rows)). Each entity writes its fields in a fixed order, and the text is indented two spaces and ends with a newline. So the same document always writes the same bytes, an edit changes only what it touches, and a file saved on a machine with other fonts reopens to the same `value`.  
VS Code, Obsidian and the JetBrains plugin write a file only when an edit changes `value`, so a file an earlier release saved keeps its old form until its first edit.

Since `4.2.0` the storage form also leaves out what holds nothing: each text field an entity or its `ui` holds as `''` (a table's `name`, `comment` and `ui.color`, a column's `name`, `comment`, `dataType` and `default`, an index's `name`, a memo's `value` and `ui.color`, a table group's `name` and `color`), each `doc` list and collection that holds no entry, and `collections` itself once every collection is empty. Text of only blanks is written as held, except a logical name, which is then left out, and a word, term or domain whose values past its id are all empty or only blanks, which is left out whole. Every id, every list inside an entity and every number, `0` included, is still written. `doc` is always written, so a new document's file holds `$schema`, `version`, its settings and `"doc": {}`.  
A parse reads a missing text field as `''` and a missing collection as empty, as every v3 release does, and the storage form leaves a `doc` list out only while its collection holds nothing (see [Doc](#doc)). So an editor before `4.2.0` opens these files too, and a program that reads a file itself must read what is missing the same way. A file an earlier release saved comes back from its next save with its empty text, lists and collections left out, a change made once, and saves byte for byte from then on.

The runtime value keeps what the storage form leaves out: removed entities, sequences, z-indexes, widths, key marks, relationship flags and anchors, the empty text fields, and the four lists `tableIds`, `relationshipIds`, `indexIds` and `memoIds` and the six collections `tableEntities` to `memoEntities` even while empty. Since `4.2.0` it also keeps removed words, terms and domains, rows that hold nothing, each row's `order`, the three dictionary lists, a logical name of only blanks and a link to a removed domain. It is indented two spaces with no trailing newline. Use it only to seed a collaborator or a second view through `setInitialValue()`, so that an undo of a removal another editor sends brings the entity back whole there. Never write it to a file; the JSON Schema refuses it. Nothing collects removed entities any more, so the runtime value keeps them until the document is next opened from its file.

Both forms write each locked setting at its locked value (see [`lockSettings`](#settings)), `settings.ddlScripts` only while a script holds text, and a table's `groupId` only while it is not empty. Since `4.2.0` both also write `settings.nameViewMode` only while the value they write is not `'physical'`, `settings.columnOrder` in seven entries where it can be (see [Settings](#settings)), and a table's `nameDerived` only while it is `true`.  
The storage form writes `doc.tableGroupIds` and `tableGroupEntities` only while a table group exists, a `logicalName` only while it holds text other than blanks, a column's `domainId` only while it names a domain the file writes, and each dictionary only while it holds a row the file writes. The runtime value writes the table group fields while the document holds a group or a removed one, `logicalName` and `domainId` while they are not `''`, and each dictionary with its list while either holds an entry, a removed row included.

## TypeScript

The types describe the runtime value. A field marked `// runtime only` is left out of the storage form, and a field marked `?` is written only while it holds something. The empty text, lists and collections the storage form leaves out since `4.2.0` are not marked.

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

Every entity has an `id`, an opaque string, which keys it in its collection, except in the three dictionaries, where it is a row's first value. Since `4.2.0` a parse reads an entity of the seven keyed collections whose `id` is missing, empty or not a string by the key it is held at, and drops an entry that is not an object, or one with no id whose key is `''`. A dictionary row is dropped when it is not an array or its `id` is not a string other than `''`. An editor before `4.2.0` drops an entity whose `id` is missing or empty, so the storage form still writes every id.  
Since `4.0.0` every new id, a dictionary row's included, is a UUIDv7 written in Uuid25 form, 25 lowercase base-36 digits such as `03gzrxjv20bdlcak89q25d2m7`, so the ids one editor mints sort in the order it made them. A document keeps the ids it holds, such as the nanoid ids of an earlier release or a v2 file's ids, so nothing should rely on an id's shape.

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

`originX` and `originY` are the view: the screen point scene `(0, 0)` lands on.  
`zoomLevel` runs from `0.1` to `1.5`. A document saved past `1` opens at `1` in an editor before `3.5.0`.  
Since `4.0.0` the settings carry no `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` or `ignoreSaveSettings`. Nothing writes them, the parser keeps none of them, and the JSON Schema refuses a file that still has them.

`canvasType` is the tab a document opens on. A document saved on the Visualization tab holds `'@dineug/erd-editor/builtin-visualization'` but not whether `Graph` or `Flow` mode was showing, and a newly created editor shows that tab in `Graph` mode.  
Since `4.0.0`, while the `Canvas Type` lock is on, as it is in a new document, the document keeps the tab that showed when it was locked, and switching tabs leaves `value` as it was. A lock taken on the Settings tab holds the tab the reader came from, and a locked `'settings'`, which only a hand edit can write, opens on `'ERD'`.  
Since `4.2.0` `canvasType` can also be `'@dineug/erd-editor/builtin-dictionary'`, the [Dictionary](../../guide/guides/dictionary.md) tab, which the `Canvas Type` lock holds as it holds the others. An editor before `4.2.0` keeps that value but shows no tab under its toolbar until the reader picks one.  
None of `Flow` mode's own state is serialized: its placement, zoom, pan, row display and focused tables stay in the editor, and since `4.2.0` so do the views that [`Previous table` and `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) step through. So `originX`, `originY` and `zoomLevel` always describe the ERD canvas.

`show` and `lockSettings` are bitmasks — OR the flags together.  
`columnOrder` is an array holding every `ColumnType` value once, in display order; since `4.2.0` a document can write it with seven of the nine, as the column order paragraph below describes.  
`database`, `language`, `tableNameCase`, `columnNameCase` and `bracketType` each hold exactly one value, and the JSON Schema rejects a combined value.

A new document's `show` is `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` and `relationship`.  
Since `3.10.0` there are two more `show` flags, both off in a new document and in every document saved before `3.10.0`.  
`columnAlternateKey` (`512`) is the [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) view option. Set, it marks the columns of each unique index over two or more columns as `AK1.1`, `AK1.2` and so on. It starts off, so no existing diagram changes width.  
`hideReferentialAction` (`1024`) works the other way round: set, it hides the [ON DELETE and ON UPDATE labels](../../guide/guides/relationship-editing.md#reading-a-connector) on connectors, so they show by default. The `Referential Actions` view option is checked while the flag is off. It changes no table's size.  
An editor before `3.10.0` keeps `show` as a whole number, so both flags survive a save there.

Since `4.0.0` there are two more `show` flags, both off in a new document and in every document saved before `4.0.0`. Like `hideReferentialAction`, each hides what it names, so table groups and memos show by default.  
`hideTableGroup` (`2048`) hides the [table groups](../../guide/guides/table-groups.md), and `hideMemo` (`4096`) hides every memo. They are the `Table Groups` and `Memos` [view options](../../guide/guides/table-related-functions.md#table-view-options), each checked while its flag is off. Neither changes any table's size.  
An editor before `4.0.0` keeps `show` as a whole number, so both flags survive a save there.

Since `4.2.0` there is one more `show` flag, `columnDomain` (`8192`), off in a new document and in every document saved before `4.2.0`, so a new document's `show` is still `431`. It is the `Domain` [view option](../../guide/guides/table-related-functions.md#table-view-options): set, each column row shows a [domain cell](../../guide/guides/logical-names.md#the-domain-cell), which widens the tables. It starts off, so no existing diagram changes width.  
An editor before `4.2.0` keeps `show` as a whole number, so the flag survives a save there.

Since `4.2.0` `ColumnType` has nine values. `columnLogicalName` (`128`) places the logical name cell, which a column row draws only in the `Both Names` view, and `columnDomain` (`256`) the domain cell. They are the `Logical Name` and `Domain` rows of the Settings tab's [column order](../../guide/guides/settings.md#adjusting-column-order). An editor holds an order of all nine, and a new document's is `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Both forms write the order in seven entries, leaving `128` and `256` out, while `128` stands just before `columnName` and `256` just after `columnDataType`. So a new document still writes `1, 2, 4, 8, 16, 32, 64`, and a file whose order never moved them keeps its bytes. Otherwise they write all nine.  
A parse puts the two into a seven-entry order at those places, whatever order the seven are in, takes nine entries that hold every type as they stand, and reads anything else as the default order. The JSON Schema takes seven or nine integers.

Since `4.0.0` `Language` has eight more [Code Generator](../../guide/guides/code-generator.md) targets, `Mermaid` through `JSONSchema`. A `language` the parser does not know reads as `GraphQL`, so an editor before `4.0.0` opens a document saved with one of them on GraphQL, and saving there writes GraphQL.

Since `4.0.0` `lockSettings` takes the place of `ignoreSaveSettings`, and `LockSettingType` that of `SaveSettingType`, which was removed. `lockSettings` names the settings a document saves as they stood when they were locked. `viewport` covers `originX`, `originY` and `zoomLevel` together, since an origin saved without its zoom opens elsewhere, and each other bit covers the field it is named after. These are the [`Lock`](../../guide/guides/settings.md#lock) rows of the Settings tab.  
A locked setting is written at its locked value, whatever the editor shows, by `value` and `runtimeValue` alike, and every other setting as it stands. So while the matching lock is on, scrolling and zooming, switching tabs, changing the Code Generator language, a name case or the bracket type, or switching the Name View leaves the file as it was. Locking takes the value the setting holds at that moment, and a parse takes the locked value from the saved field.  
A document started from nothing — a new editor or replication store, or a blank value given to `value` or `setInitialValue()` — has `lockSettings` set to `63`, every lock on. A document whose `settings` carry no `lockSettings` — every file saved before `4.0.0`, whatever its `ignoreSaveSettings`, and every v2 document — opens with every lock on as well: its view and tab where a new document's are (`originX` and `originY` `0`, `zoomLevel` `1`, the ERD tab), and its language, name cases and bracket type locked at what it saved. A document that names its locks keeps them, `0` included, and every value it saved.  
A parse keeps every bit of `lockSettings`, unknown ones too, so a lock a later release adds survives a save here; the JSON Schema checks only that it is an integer. An editor before `4.0.0` drops `lockSettings` when it saves and writes the view and tab as they stand, so the file opens here again as one saved before `4.0.0`.

Since `4.2.0` there is a seventh lock, `unlockNameViewMode` (`64`), the `Name View` row, which covers `nameViewMode`. Its bit reads the other way round from the other lock bits, as the hide bits of `Show` do: set, the Name View is unlocked, and clear, locked. So `63` still means every lock on, and a new document holds it with the Name View locked at `'physical'`. A file saved before `4.2.0` holds the bit clear, whatever its other locks, `0` included, so it opens with the Name View locked at `'physical'`. A document with every lock off holds `64`, and one with every other lock on and the Name View unlocked holds `127`. Test this lock inverted: it is on while `(lockSettings & 64) === 0`.  
While it is on, a switch of the Name View changes only the screen of the editor that made it, and the document keeps the locked view. While it is off, a switch in an editor that can edit is the document's, and every collaborator switches with it. A read-only editor's switch changes only its own screen either way. See [`Lock`](../../guide/guides/settings.md#lock).  
An editor of `4.0.0` or `4.1.0` keeps the bit through a save but drops `nameViewMode`, so the document reopens here in `'physical'`, its lock as it was.

Since `4.0.0` `ddlScripts` holds the [Schema SQL](../../guide/guides/schema-sql.md) tab's two scripts, which the DDL of every database writes: `before` after the header and ahead of the tables, `after` past the generated DDL. The DDL writes each with LF line breaks, without its leading blank lines and trailing whitespace, and on MSSQL ended with `GO`, as [Before and After Scripts](../../guide/guides/schema-sql.md#before-and-after-scripts) describes; `ddlScripts` itself keeps each script as typed. The key is written only while either script holds text, and then with both; a missing key, or a script that is not a string, reads as `''`. The tab's `Statements`, `Header` and `Tables` choices, and since `4.2.0` its [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) switch, are not saved in the document.  
An editor before `4.0.0` drops the scripts when it loads a document, so saving there loses them.

Since `4.2.0` `nameViewMode` is the [Name View](../../guide/guides/logical-names.md#name-view), the names the diagram draws: `'physical'` each table's and column's name, `'logical'` its logical name in the name's place, and `'both'` the logical name and the name. The menus call them `Physical Names`, `Logical Names` and `Both Names`. Both forms write it last, after `ddlScripts`, and only while the value they write is not `'physical'`; while the `Name View` lock is on, that is the locked value, whatever the screen shows. A missing value, or one the parser does not know, reads as `'physical'`, and the JSON Schema accepts only `"logical"` and `"both"`.  
An editor before `4.2.0` drops `nameViewMode` when it loads a document.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` and `ReferentialAction` are append-only. A saved document stores the number, so a new vendor, code-generation target, flag, column type, column option, lock or action takes the next bit instead of a slot in the middle.

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

Each of the first five lists is the order of one kind of entity, which the DDL, the table sort and the draw order read. In the storage form each list holds only the ids of kept entities, each once, in the order listed, and since `4.2.0` a list that holds none is left out. Since `4.0.0` `tableGroupIds` is the order of the table groups.

Since `4.2.0` `wordIds`, `termIds` and `domainIds` list each dictionary's live rows: a row its collection holds but its list does not is removed. They are not a sheet's order, which each row's `order` gives. Only the runtime value writes them, each while it or its collection holds an entry. A file's rows are themselves the membership and the order, and the JSON Schema refuses the lists.  
Since `4.2.0` a parse reads a list the document leaves out, or holds as something other than an array, as every entry its collection holds, each id once, in the order held; an empty array stays empty, every entry of its collection then reading as removed. An editor before `4.2.0` reads a missing list as empty, so the storage form still writes each list whenever its collection holds an entity.

Since `4.0.0` stacking order is not saved. A parse stacks each listed table, memo and table group that carries no `zIndex` by its place in its list, later ones in front: table groups from `1`, tables from `2`, and memos above every table. An entity that carries a `zIndex`, as in a runtime value or a file saved before `4.0.0`, keeps it. Bringing a table or memo to the front is therefore lost when the file is reopened.

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

Since `4.0.0` a table carries `groupId`, the id of the [table group](../../guide/guides/table-groups.md) it belongs to. A missing or empty `groupId`, or one that names no group in `doc.tableGroupIds`, means none, and the storage form writes it only while it names a kept group.  
A parse starts `seqColumnIds` at `columnIds` when it is missing or lacks a listed id, and an editor measures `widthName`, `widthLogicalName` and `widthComment` again with its own fonts on every load.

Since `4.2.0` a table carries `logicalName`, the name the `Logical Names` and `Both Names` [views](../../guide/guides/logical-names.md#name-view) draw, `''` for none, and `nameDerived`, `true` while the dictionaries [derived](../../guide/guides/dictionary.md#deriving-physical-names) `name` from the logical name. While it is set, a new logical name derives the name again; while it is not, the name is someone's own, and a new logical name leaves it alone unless the name is empty or only blanks. A rename by hand turns it off, and [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) rewrites even a name someone wrote and turns it on wherever there is a logical name.  
The storage form writes `logicalName` after `name`, as typed, only while it holds text other than blanks, and `nameDerived` after `groupId` only while it is `true`, the only value the JSON Schema accepts. A missing `logicalName` reads as `''` and a missing `nameDerived` as `false`, so every name in a file saved before `4.2.0` counts as someone's own.  
An editor before `4.2.0` drops both when it loads a document, so saving there loses every table's logical name.

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

Since `4.0.0` the storage form writes no column `ui`. Every load derives `keys`, the primary key mark from the `primaryKey` bit of `options` and the foreign key mark from the relationships that end on the column, and measures the six widths.  
An editor before `4.0.0` shows the columns of a file saved here without their primary key icons.

Since `4.2.0` a column carries `logicalName`, as a table does, and `domainId`, the id of the domain it links, `''` for none. Edits in one editor keep a linked column at its domain's data type, as [Domains and Data Types](../../guide/guides/dictionary.md#domains-and-data-types) describes. A parse retypes no column, though, so a file written elsewhere can leave a linked column at another type, and so can two collaborators' crossed edits; the Checks sheet lists each as [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). A parse clears a `domainId` that names no domain the document holds. A removed domain still counts, so the editor keeps a link to it while an undo can bring the domain back. After `options`, the storage form writes `logicalName` by the rule for a table, and `domainId` only while it names a domain the file writes, so never a link to a removed domain.  
`ColumnOption.nameDerived` (`16`) is the column's derived-name flag, kept in `options` with the other bits and meaning what a table's `nameDerived` means. A not-null primary key whose name the dictionaries derived, for example, holds `options` `26`.  
An editor before `4.2.0` drops `logicalName` and `domainId` when it loads a document, so saving there loses them. It keeps `options` as a whole number, so the `nameDerived` bit survives a save there.

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

### Dictionary Rows

Since `4.2.0` a document holds three dictionaries, the `Words`, `Terms` and `Domains` sheets of the [Dictionary](../../guide/guides/dictionary.md) tab, in `wordEntities`, `termEntities` and `domainEntities`. Every field of a word, term or domain is a string, and none has a `ui`. The `Checks` sheet is worked out from the dictionaries and the diagram, and is not saved.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

None of the three is keyed by id. Each is written as a header and rows: `fields` names the entity's fields once, id first, and each row holds one entity's values in that order. The types below list each entity's fields in the runtime value's header order. A row always keeps its id and name, but its trailing empty values past the name are left out, so an empty value before one that is kept stays `''`, and a parse reads a value a row lacks as `''`. Both forms write each row on a line of its own as compact JSON, as in these two words from a file:

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

The storage form writes the listed rows in sheet order and leaves out `order`, so its headers do not name it. It leaves out a row whose values past its id are all empty or only blanks, such as one added and never filled, or emptied, and every link to such a domain or to a removed one: a column's `domainId` is left out, and a term's is written `''`, the term itself left out if it holds nothing else.  
The runtime value's headers name `"order"` right after `"name"`. It writes every row its collection holds, removed ones included, in the order the collection holds them, so sort by `order`, compared in code-unit order, for a sheet's order. A parse gives a file's rows `order` keys in the order the rows stand, so they read back in the order the file wrote them.  
A document without the dictionaries, such as one saved before `4.2.0`, has none. An editor before `4.2.0` drops all three when it loads a document, so saving there loses every word, term and domain.

### Collection: wordEntities

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

A word is one of the words a logical name is made of, and `abbreviation` is what stands for it in a physical name. `synonyms` lists other spellings of the word, and `forbiddenWords` words that must not be used in its place, each comma separated.

### Collection: termEntities

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

A term is a whole logical name. A table or column whose `logicalName` matches `name` derives `physicalName` or, while that is empty, a name composed from the words' abbreviations, and a column also takes the domain `domainId` names, `''` for none (see [Deriving Physical Names](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` is comma separated. A parse clears a `domainId` that names no domain, as on a column.

### Collection: domainEntities

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

A domain is a named data type, `dataType` holding it as a column does, length included, such as `NUMERIC(10)`. A column or a term links a domain by its id, and the editor gives every linked column the domain's data type (see [Domains and Data Types](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema

The canonical schema file is published at [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) and can be referenced directly with `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Put `$schema` at the top of an `.erd.json` file and editors that understand JSON Schema, such as VS Code, validate the document and autocomplete its fields as you edit.

Since `4.0.0` the schema describes the storage form alone. Every object with named fields is closed (`additionalProperties: false`), every field the storage form always writes is required, a field it leaves out while it holds nothing is named but not required, and no field it always leaves out is named. It therefore refuses the runtime value. It also refuses a file saved before `4.0.0`, with its `meta`, widths, `zIndex`, `ignoreSaveSettings` and the rest, until an editor of `4.0.0` or later saves that file again. A file saved by `3.2.0` or later already names this schema's URL, which points at the `main` branch, so an editor that validates against it flags the file now. A file saved by `3.0.0` or `3.1.0`, or a v2 document, names no `$schema`.

Since `4.2.0` the schema no longer requires an entity's text fields, any `doc` list, any collection or `collections` itself, which the storage form leaves out while they hold nothing. It still accepts a file saved by `4.0.0` or `4.1.0`. It names the new fields: `nameViewMode`, which takes only `"logical"` and `"both"`; a table's `logicalName` and `nameDerived`, which takes only `true`; a column's `logicalName` and `domainId`; and the three dictionaries, each with its header and rows of strings. `canvasType` lists the Dictionary tab, `columnOrder` takes seven or nine integers, and the `show`, `columnOrder`, `lockSettings` and `options` descriptions name the new bits.

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
