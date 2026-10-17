---
sidebar_position: 3
description: Das Dokumentformat .erd.json – die Speicherform, die eine Datei enthält, und der Laufzeitwert, der in einem Editor vorliegt, die TypeScript-Typen, die Konstanten hinter jedem numerischen Feld und das veröffentlichte JSON Schema.
---

# Schema

`.erd.json` ist das Dokumentformat des Editors. Lesen Sie diese Seite, wenn Sie ein Dokument außerhalb des Editors erzeugen, validieren oder migrieren müssen.

Seit `4.0.0` hat ein Dokument zwei Serialisierungen, beide mit dem Wert `'3.0.0'` in `version`. Die Speicherform ist das, was eine Datei enthält: Sie ist das, was [`editor.value`](../erd-editor-element.md#value) zurückgibt, was der JSON-Export schreibt, und die einzige Form, die das veröffentlichte [JSON Schema](#json-schema) akzeptiert. Der Laufzeitwert ist das gesamte Dokument, wie es in einem Editor vorliegt, und wird von [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) zurückgegeben. `setInitialValue()`, der Setter `value` und `setSchemaJSON()` lesen beide Formen, jede Datei, die eine frühere Version gespeichert hat, und ein v2-Dokument im Format `.vuerd`. Vor `4.0.0` gab es nur eine: `value` gab das gesamte Dokument zurück, wie es im Editor vorlag, so wie es jetzt `runtimeValue` tut.

## Speicherform und Laufzeitwert {#storage-form-and-runtime-value}

Die Speicherform enthält nur die nicht entfernten Entitäten: jede in `doc.tableIds` aufgeführte Tabelle, die Spalten, die diese Tabellen aufführen, die Beziehungen zwischen zwei verbleibenden Tabellen, die Indizes verbleibender Tabellen mit den Indexspalten, deren Spalte die Tabelle noch aufführt, sowie die aufgeführten Notizen und Tabellengruppen. Sie lässt weg, was ein Editor beim Laden ableitet oder vorhält, solange er geöffnet ist: entfernte Entitäten, `seqColumnIds` und `seqIndexColumnIds`, jeden `zIndex`, die gemessenen Breiten, das Feld `ui` der Spalten sowie `identification`, `startRelationshipType` und die Ankerpunkte einer Beziehung. Die Typen unten markieren jedes dieser Felder mit `// runtime only`.  
Die Einträge jeder Collection sind nach ID geschlüsselt und in der Reihenfolge der Codeeinheiten sortiert, wobei Spalten zuerst nach `tableId` und Indexspalten zuerst nach `indexId` gruppiert sind. Jede Entität schreibt ihre Felder in einer festen Reihenfolge, und der Text ist mit zwei Leerzeichen eingerückt und endet mit einem Zeilenumbruch. Dadurch ergibt dasselbe Dokument immer dieselben Bytes, eine Änderung verändert nur, was sie betrifft, und eine Datei, die auf einem Rechner mit anderen Schriftarten gespeichert wurde, wird mit demselben Wert von `value` wieder geöffnet.  
VS Code, Obsidian und das JetBrains-Plugin schreiben eine Datei nur, wenn eine Änderung `value` verändert, sodass eine Datei, die eine frühere Version gespeichert hat, ihre alte Form bis zu ihrer ersten Änderung behält.

Der Laufzeitwert behält, was die Speicherform weglässt: entfernte Entitäten, Sequenzen, Z-Indizes, Breiten, Schlüsselmarkierungen, Beziehungs-Flags und Ankerpunkte. Er ist mit zwei Leerzeichen eingerückt und hat keinen abschließenden Zeilenumbruch. Verwenden Sie ihn nur, um über `setInitialValue()` einen Mitbearbeiter oder eine zweite Ansicht zu initialisieren, damit das Rückgängigmachen einer Entfernung, das ein anderer Editor sendet, die Entität dort vollständig wiederherstellt. Schreiben Sie ihn nie in eine Datei; das JSON Schema lehnt ihn ab. Entfernte Entitäten werden nicht mehr aufgeräumt, daher behält der Laufzeitwert sie, bis das Dokument das nächste Mal aus seiner Datei geöffnet wird.

Beide Formen schreiben jede gesperrte Einstellung mit ihrem gesperrten Wert (siehe [`lockSettings`](#settings)), `settings.ddlScripts` nur, solange ein Skript Text enthält, und das Feld `groupId` einer Tabelle nur, solange es nicht leer ist. Die Speicherform schreibt `doc.tableGroupIds` und `tableGroupEntities` nur, solange eine Tabellengruppe existiert; der Laufzeitwert schreibt sie, solange das Dokument eine Gruppe oder eine entfernte Gruppe enthält.

## TypeScript {#typescript}

Die Typen beschreiben den Laufzeitwert. Ein mit `// runtime only` markiertes Feld entfällt in der Speicherform, und ein mit `?` markiertes Feld wird nur geschrieben, solange es etwas enthält.

### ERDEditorSchemaV3 {#erdeditorschemav3}

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

Der Schlüssel jeder Entität ist ihre `id`, eine opake Zeichenkette; beim Parsen wird eine Entität verworfen, deren `id` fehlt oder leer ist. Seit `4.0.0` ist jede neue ID eine UUIDv7 in Uuid25-Form, 25 kleingeschriebene Base-36-Ziffern, etwa `03gzrxjv20bdlcak89q25d2m7`, sodass sich die IDs, die ein Editor erzeugt, in der Reihenfolge sortieren, in der er sie erzeugt hat. Ein Dokument behält die IDs, die es enthält, etwa die nanoid-IDs einer früheren Version oder die IDs einer v2-Datei, daher sollte sich nichts auf die Form einer ID verlassen.

Seit `4.0.0` trägt keine Entität mehr ein Objekt `meta` (`createAt`, `updateAt`), und die Typen `EntityMeta` und `EntityType` wurden entfernt. Nichts schreibt es, beim Parsen wird das Objekt `meta` einer älteren Datei verworfen, und das JSON Schema lehnt es ab. Es diente nur der zeitlichen Steuerung der Garbage Collection entfernter Entitäten, die ebenfalls entfallen ist.

### Settings {#settings}

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

`originX` und `originY` sind die Ansicht: der Bildschirmpunkt, auf den der Szenenpunkt `(0, 0)` fällt.  
`zoomLevel` reicht von `0.1` bis `1.5`. Ein Dokument, das mit einem Wert über `1` gespeichert wurde, öffnet sich in einem Editor vor `3.5.0` mit `1`.  
Seit `4.0.0` enthalten die Einstellungen keine Felder `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` oder `ignoreSaveSettings`. Nichts schreibt sie, der Parser behält keines davon, und das JSON Schema lehnt eine Datei ab, die sie noch enthält.

`canvasType` ist die Registerkarte, auf der sich ein Dokument öffnet. Ein auf der Registerkarte Visualisierung gespeichertes Dokument enthält `'@dineug/erd-editor/builtin-visualization'`, aber nicht, ob der Modus `Graph` oder `Flow` angezeigt wurde, und ein neu erstellter Editor zeigt diese Registerkarte im Modus `Graph`.  
Seit `4.0.0` behält das Dokument, solange die Sperre `Canvas Type` eingeschaltet ist, wie es in einem neuen Dokument der Fall ist, die Registerkarte, die beim Sperren angezeigt wurde, und ein Wechsel der Registerkarte lässt `value` unverändert. Eine auf der Registerkarte Einstellungen gesetzte Sperre hält die Registerkarte fest, von der der Leser kam, und ein gesperrtes `'settings'`, das nur eine Bearbeitung von Hand schreiben kann, öffnet sich auf `'ERD'`.  
Vom eigenen Zustand des Modus `Flow` wird nichts serialisiert – Platzierung, Zoom, Verschieben, Zeilenanzeige und fokussierte Tabellen bleiben im Editor –, daher beschreiben `originX`, `originY` und `zoomLevel` immer die ERD-Zeichenfläche.

`show` und `lockSettings` sind Bitmasken – verknüpfen Sie die Flags mit OR.  
`columnOrder` ist ein Array mit allen sieben Werten von `ColumnType` in Anzeigereihenfolge.  
`database`, `language`, `tableNameCase`, `columnNameCase` und `bracketType` enthalten jeweils genau einen Wert, und das JSON Schema lehnt einen kombinierten Wert ab.

Bei einem neuen Dokument hat `show` den Wert `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` und `relationship`.  
Seit `3.10.0` gibt es zwei weitere Flags in `show`, die in einem neuen Dokument und in jedem vor `3.10.0` gespeicherten Dokument beide ausgeschaltet sind.  
`columnAlternateKey` (`512`) ist die Ansichtsoption [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Ist es gesetzt, markiert es die Spalten jedes eindeutigen Index über zwei oder mehr Spalten als `AK1.1`, `AK1.2` usw. Es ist anfangs ausgeschaltet, sodass kein bestehendes Diagramm seine Breite ändert.  
`hideReferentialAction` (`1024`) wirkt umgekehrt: Ist es gesetzt, blendet es die [Beschriftungen ON DELETE und ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) an Verbindungslinien aus, sodass sie standardmäßig angezeigt werden. Die Ansichtsoption `Referential Actions` ist aktiviert, solange das Flag ausgeschaltet ist. Das Flag ändert die Größe keiner Tabelle.  
Ein Editor vor `3.10.0` behält `show` als ganze Zahl, sodass beide Flags ein Speichern dort überstehen.

Seit `4.0.0` gibt es zwei weitere Flags in `show`, die in einem neuen Dokument und in jedem vor `4.0.0` gespeicherten Dokument beide ausgeschaltet sind. Wie `hideReferentialAction` blendet jedes davon aus, was es benennt, sodass Tabellengruppen und Notizen standardmäßig angezeigt werden.  
`hideTableGroup` (`2048`) blendet die [Tabellengruppen](../../guide/guides/table-groups.md) aus, und `hideMemo` (`4096`) blendet jede Notiz aus. Es sind die [Ansichtsoptionen](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` und `Memos`, die jeweils aktiviert sind, solange ihr Flag ausgeschaltet ist. Keines der beiden ändert die Größe einer Tabelle.  
Ein Editor vor `4.0.0` behält `show` als ganze Zahl, sodass beide Flags ein Speichern dort überstehen.

Seit `4.0.0` hat `Language` acht weitere Ziele des [Codegenerators](../../guide/guides/code-generator.md), von `Mermaid` bis `JSONSchema`. Ein Wert von `language`, den der Parser nicht kennt, wird als `GraphQL` gelesen, daher öffnet ein Editor vor `4.0.0` ein Dokument, das mit einem davon gespeichert wurde, mit GraphQL, und ein Speichern dort schreibt GraphQL.

Seit `4.0.0` tritt `lockSettings` an die Stelle von `ignoreSaveSettings` und `LockSettingType` an die Stelle von `SaveSettingType`, das entfernt wurde. `lockSettings` benennt die Einstellungen, die ein Dokument so speichert, wie sie beim Sperren standen. `viewport` umfasst `originX`, `originY` und `zoomLevel` zusammen, da sich ein ohne seinen Zoom gespeicherter Ursprung an anderer Stelle öffnet, und jedes andere Bit umfasst das Feld, nach dem es benannt ist. Dies sind die Zeilen unter [`Lock`](../../guide/guides/settings.md#lock) auf der Registerkarte Einstellungen.  
Eine gesperrte Einstellung wird von `value` und `runtimeValue` gleichermaßen mit ihrem gesperrten Wert geschrieben, unabhängig davon, was der Editor anzeigt, und jede andere Einstellung so, wie sie gerade steht. Solange die passende Sperre eingeschaltet ist, lassen daher Scrollen und Zoomen, ein Wechsel der Registerkarte oder das Ändern der Sprache des Codegenerators, einer Schreibweise oder des Begrenzertyps die Datei unverändert. Beim Sperren wird der Wert übernommen, den die Einstellung in diesem Moment hat, und beim Parsen wird der gesperrte Wert aus dem gespeicherten Feld übernommen.  
Ein von Grund auf neu begonnenes Dokument – ein neuer Editor oder Replikations-Store oder ein leerer Wert, der `value` zugewiesen oder an `setInitialValue()` übergeben wird – hat `lockSettings` auf `63` gesetzt, also jede Sperre eingeschaltet. Ein Dokument, dessen `settings` kein `lockSettings` enthalten – jede vor `4.0.0` gespeicherte Datei, unabhängig von ihrem Wert für `ignoreSaveSettings`, und jedes v2-Dokument –, öffnet sich ebenfalls mit allen Sperren eingeschaltet: Ansicht und Registerkarte dort, wo sie bei einem neuen Dokument sind (`originX` und `originY` auf `0`, `zoomLevel` auf `1`, die Registerkarte ERD), und Sprache, Schreibweisen und Begrenzertyp auf dem gespeicherten Stand gesperrt. Ein Dokument, das seine Sperren benennt, behält sie, `0` eingeschlossen, sowie jeden gespeicherten Wert.  
Beim Parsen bleibt jedes Bit von `lockSettings` erhalten, auch unbekannte, sodass eine Sperre, die eine spätere Version hinzufügt, ein Speichern hier übersteht; das JSON Schema prüft nur, ob der Wert eine ganze Zahl ist. Ein Editor vor `4.0.0` verwirft `lockSettings` beim Speichern und schreibt Ansicht und Registerkarte so, wie sie gerade stehen, sodass sich die Datei hier wieder wie eine vor `4.0.0` gespeicherte öffnet.

Seit `4.0.0` enthält `ddlScripts` die beiden Skripte der Registerkarte [Schema SQL](../../guide/guides/schema-sql.md), die die DDL jeder Datenbank schreibt: `before` nach dem Vorspann und vor den Tabellen, `after` nach der generierten DDL. Die DDL schreibt jedes Skript mit LF-Zeilenumbrüchen, ohne führende Leerzeilen und ohne abschließenden Leerraum und bei MSSQL mit `GO` abgeschlossen, wie unter [Skripte vor und nach den Tabellen](../../guide/guides/schema-sql.md#before-and-after-scripts) beschrieben; `ddlScripts` selbst behält jedes Skript so, wie es eingegeben wurde. Der Schlüssel wird nur geschrieben, solange eines der beiden Skripte Text enthält, und dann mit beiden; ein fehlender Schlüssel oder ein Skript, das keine Zeichenkette ist, wird als `''` gelesen. Die Auswahl bei `Statements`, `Header` und `Tables` auf der Registerkarte wird nicht im Dokument gespeichert.  
Ein Editor vor `4.0.0` verwirft die Skripte, wenn er ein Dokument lädt, sodass sie beim Speichern dort verloren gehen.

`Database`, `Language`, `Show`, `LockSettingType` und `ReferentialAction` werden nur am Ende erweitert. Ein gespeichertes Dokument enthält die Zahl, daher erhält ein neues Datenbanksystem, ein neues Ziel der Codegenerierung, ein neues Flag, eine neue Sperre oder eine neue Aktion das nächste Bit statt eines Platzes in der Mitte.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
};
```

Jede Liste ist die Reihenfolge einer Art von Entität, nach der sich die DDL, die Tabellensortierung und die Zeichenreihenfolge richten. In der Speicherform enthält jede Liste nur die IDs verbleibender Entitäten, jeweils einmal, in der aufgeführten Reihenfolge. Seit `4.0.0` ist `tableGroupIds` die Reihenfolge der Tabellengruppen.

Seit `4.0.0` wird die Stapelreihenfolge nicht gespeichert. Beim Parsen wird jede aufgeführte Tabelle, Notiz und Tabellengruppe ohne `zIndex` nach ihrem Platz in ihrer Liste gestapelt, spätere weiter vorn: Tabellengruppen ab `1`, Tabellen ab `2` und Notizen über allen Tabellen. Eine Entität mit `zIndex`, wie in einem Laufzeitwert oder einer vor `4.0.0` gespeicherten Datei, behält ihn. Wird eine Tabelle oder Notiz in den Vordergrund geholt, geht das daher verloren, wenn die Datei erneut geöffnet wird.

### Collection: tableEntities {#collection-tableentities}

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

Seit `4.0.0` trägt eine Tabelle das Feld `groupId`, die ID der [Tabellengruppe](../../guide/guides/table-groups.md), zu der sie gehört. Ein fehlendes oder leeres Feld `groupId` oder eines, das keine Gruppe in `doc.tableGroupIds` benennt, bedeutet keine Gruppe, und die Speicherform schreibt es nur, solange es eine verbleibende Gruppe benennt.  
Beim Parsen wird `seqColumnIds` auf `columnIds` gesetzt, wenn es fehlt oder eine aufgeführte ID nicht enthält, und ein Editor misst `widthName` und `widthComment` bei jedem Laden mit seinen eigenen Schriftarten neu.

### Collection: tableColumnEntities {#collection-tablecolumnentities}

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

Seit `4.0.0` schreibt die Speicherform kein Feld `ui` der Spalten. Bei jedem Laden wird `keys` abgeleitet, die Primärschlüsselmarkierung aus dem Bit `primaryKey` von `options` und die Fremdschlüsselmarkierung aus den Beziehungen, die an der Spalte enden, und die vier Breiten werden gemessen.  
Ein Editor vor `4.0.0` zeigt die Spalten einer hier gespeicherten Datei ohne ihre Primärschlüsselsymbole an.

### Collection: relationshipEntities {#collection-relationshipentities}

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

Seit `3.10.0` trägt eine Beziehung `onDelete` und `onUpdate`, ihre [Aktionen für ON DELETE und ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Jedes der beiden Felder enthält genau einen Wert von `ReferentialAction`. `none`, der Standardwert, schreibt keine Klausel, sodass das eigene Standardverhalten der Datenbank gilt. Die anderen fünf stehen für `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` und `RESTRICT`. Schema SQL schreibt eine Klausel nur für eine Datenbank, die ihre Aktion akzeptiert.  
Die Speicherform schreibt immer beide, und seit `4.0.0` verlangt das JSON Schema sie, wobei es nur prüft, ob jedes davon eine ganze Zahl ist. Beim Parsen wird ein fehlendes Feld, wie in jedem vor `3.10.0` gespeicherten Dokument, weiterhin als `none` gelesen, ebenso ein Wert außerhalb der Liste.  
Ein Editor vor `3.10.0` kennt die Felder nicht und verwirft sie, wenn er ein Dokument lädt, sodass beim Speichern dort jede Aktion verloren geht.

Seit `4.0.0` wird bei jedem Laden abgeleitet, was die Speicherform weglässt. Eine Beziehung ist identifizierend, wenn jede Spalte, an der sie endet, ein Primärschlüssel ist, und ihr `startRelationshipType` ist `dash`, wenn jede solche Spalte NOT NULL ist, und sonst `ring`; eine Beziehung ohne verbliebene Endspalte ist nicht identifizierend und `dash`, so wie eine neue Beziehung beginnt. Die Ankerpunkte, `x`, `y` und `direction`, werden neu platziert.

### Collection: indexEntities {#collection-indexentities}

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

Beim Parsen wird `seqIndexColumnIds` auf `indexColumnIds` gesetzt, wenn es fehlt oder eine aufgeführte ID nicht enthält.

### Collection: indexColumnEntities {#collection-indexcolumnentities}

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

### Collection: memoEntities {#collection-memoentities}

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

Seit `4.0.0` teilen sich Tabellen und Notizen [einen gemeinsamen Stapel](../../guide/guides/table-related-functions.md#moving-multiple-tables), der nach `zIndex` geordnet ist, sodass eine Tabelle, die in den Vordergrund geholt wird, über einer Notiz liegen kann. Beim Parsen wird eine ohne `zIndex` gespeicherte Notiz über allen Tabellen gestapelt, wie unter [Doc](#doc) beschrieben. Eine Notiz in einer vor `4.0.0` gespeicherten Datei behält ihren gespeicherten `zIndex`, der aus demselben Zähler stammte wie der der Tabellen, sodass eine Notiz, die eine frühere Version über allen Tabellen gezeichnet hat, beim Öffnen unter einer Tabelle liegen kann, die nach ihr in den Vordergrund geholt wurde.

### Collection: tableGroupEntities {#collection-tablegroupentities}

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

Seit `4.0.0` kann ein Dokument [Tabellengruppen](../../guide/guides/table-groups.md) enthalten: benannte, farbige Rechtecke, die hinter Tabellen gezeichnet werden. Eine Tabelle tritt einer Gruppe über ihr eigenes Feld `groupId` bei, daher enthält eine Gruppe keine Liste ihrer Mitglieder. Die Speicherform schreibt die Collection, wie `doc.tableGroupIds`, nur, solange eine Gruppe existiert, und ein Dokument ohne sie, etwa eines, das vor `4.0.0` gespeichert wurde, hat keine Gruppen. `Show.hideTableGroup` blendet sie aus.  
Ein Editor vor `4.0.0` verwirft beim Laden eines Dokuments die Gruppen und das Feld `groupId` jeder Tabelle, sodass beim Speichern dort jede Gruppe verloren geht.

## JSON Schema {#json-schema}

Die kanonische Schemadatei ist unter [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) veröffentlicht und kann mit `$schema` direkt referenziert werden.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Setzen Sie `$schema` an den Anfang einer Datei `.erd.json`, dann validieren Editoren, die JSON Schema verstehen, etwa VS Code, das Dokument und vervollständigen seine Felder automatisch, während Sie es bearbeiten.

Seit `4.0.0` beschreibt das Schema nur die Speicherform. Jedes Objekt mit benannten Feldern ist geschlossen (`additionalProperties: false`), jedes Feld, das die Speicherform immer schreibt, ist erforderlich, und kein Feld, das sie weglässt, ist aufgeführt. Daher lehnt es den Laufzeitwert ab. Es lehnt auch eine vor `4.0.0` gespeicherte Datei mit ihrem `meta`, ihren Breiten, `zIndex`, `ignoreSaveSettings` und dem Rest ab, bis ein Editor der Version `4.0.0` oder neuer diese Datei erneut speichert. Eine Datei, die von `3.2.0` oder neuer gespeichert wurde, nennt bereits die URL dieses Schemas, die auf den Branch `main` zeigt, sodass ein Editor, der dagegen validiert, die Datei jetzt beanstandet. Eine von `3.0.0` oder `3.1.0` gespeicherte Datei oder ein v2-Dokument nennt kein `$schema`.

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
