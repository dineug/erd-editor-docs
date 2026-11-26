---
sidebar_position: 4
description: Das Dokumentformat .erd.json – die Speicherform, die eine Datei enthält, ihre TypeScript-Typen, die Konstanten hinter jedem numerischen Feld und das veröffentlichte JSON Schema.
---

# Schema

`.erd.json` ist das Dokumentformat des Editors. Lesen Sie diese Seite, wenn Sie ein Dokument außerhalb des Editors erzeugen, validieren oder migrieren müssen.

Diese Seite beschreibt die Speicherform, das Dokument, wie es eine Datei enthält und wie es jede Version seit `4.0.0` schreibt. Sie ist das, was [`editor.value`](../erd-editor-element.md#value) zurückgibt, was der JSON-Export schreibt, und die einzige Form, die das veröffentlichte [JSON Schema](#json-schema) akzeptiert. Ihr Wert `version` ist `'3.0.0'`, wie in jeder v3-Datei, die eine frühere Version gespeichert hat; `version` unterscheidet daher eine ältere Datei nicht von einer neueren. `setInitialValue()`, der Setter `value` und `setSchemaJSON()` lesen sie, jede Datei, die eine frühere Version gespeichert hat, und ein v2-Dokument im Format `.vuerd`. Vor `4.0.0` gab `value` das gesamte Dokument zurück, wie es im Editor vorlag; eine damals gespeicherte Datei enthält daher mehr (siehe [Speicherform](#storage-form)).  
Der [`runtimeValue`](../erd-editor-element.md#runtimevalue) eines Editors ist eine andere Serialisierung, die diese Seite nicht beschreibt. Er initialisiert einen anderen Editor oder ein Replikat, und ein [Yjs-Raum](./yjs.md#what-the-room-holds) speichert ihn in seinem Snapshot; er gehört nie in eine Datei, und das JSON Schema lehnt jeden ab, der eine Entität enthält.

## Speicherform {#storage-form}

Die Speicherform enthält nur die nicht entfernten Entitäten: jede in `doc.tableIds` aufgeführte Tabelle, die Spalten, die diese Tabellen aufführen, die Beziehungen zwischen zwei verbleibenden Tabellen, die Indizes verbleibender Tabellen mit den Indexspalten, deren Spalte die Tabelle noch aufführt, die aufgeführten Notizen und Tabellengruppen sowie seit `4.2.0` die Wörter, Begriffe und Domänen der Blätter des Wörterbuchs, die über ihre ID hinaus einen Wert enthalten. Sie enthält nichts, was ein Editor beim Laden ermittelt oder nur vorhält, solange er geöffnet ist: keine Stapelreihenfolge, keine gemessenen Breiten und keine Schlüsselmarkierungen, und auch nicht, ob eine Beziehung identifizierend ist, wie ihr Ende an der Elterntabelle dargestellt wird oder wo sie auf ihre Tabellen trifft. Jedes Laden ermittelt dies aus dem, was die Datei enthält, neu.  
Die Einträge jeder Collection außer den Wörterbüchern sind nach ID geschlüsselt und in der Reihenfolge der Codeeinheiten sortiert, wobei Spalten zuerst nach `tableId` und Indexspalten zuerst nach `indexId` gruppiert sind. Seit `4.2.0` folgen `wordEntities`, `termEntities` und `domainEntities` in dieser Reihenfolge auf alle anderen Collections, jeweils als Kopfzeile und Zeilen geschrieben, jede Zeile in einer eigenen Textzeile (siehe [Wörterbuchzeilen](#dictionary-rows)). Jede Entität schreibt ihre Felder in einer festen Reihenfolge, und der Text ist mit zwei Leerzeichen eingerückt und endet mit einem Zeilenumbruch. Dadurch ergibt dasselbe Dokument immer dieselben Bytes, eine Änderung verändert nur, was sie betrifft, und eine Datei, die auf einem Rechner mit anderen Schriftarten gespeichert wurde, wird mit demselben Wert von `value` wieder geöffnet.  
VS Code, Obsidian und das JetBrains-Plugin schreiben eine Datei nur, wenn eine Änderung `value` verändert, sodass eine Datei, die eine frühere Version gespeichert hat, ihre alte Form bis zu ihrer ersten Änderung behält.

Seit `4.2.0` lässt die Speicherform außerdem weg, was nichts enthält: jedes Textfeld, das eine Entität oder ihr `ui` als `''` enthält (bei einer Tabelle `name`, `comment` und `ui.color`, bei einer Spalte `name`, `comment`, `dataType` und `default`, bei einem Index `name`, bei einer Notiz `value` und `ui.color`, bei einer Tabellengruppe `name` und `color`), jede Liste in `doc` und jede Collection, die keinen Eintrag enthält, sowie `collections` selbst, sobald jede Collection leer ist. Text, der nur aus Leerraum besteht, wird so geschrieben, wie er vorliegt, außer bei einem logischen Namen, der dann entfällt; ein Wort, ein Begriff oder eine Domäne, deren Werte nach der ID alle leer sind oder nur aus Leerraum bestehen, entfällt ganz. Jede ID, jede Liste innerhalb einer Entität und jede Zahl, `0` eingeschlossen, wird weiterhin geschrieben. `doc` wird immer geschrieben, daher enthält die Datei eines neuen Dokuments `$schema`, `version`, seine Einstellungen und `"doc": {}`.  
Beim Parsen wird ein fehlendes Textfeld als `''` und eine fehlende Collection als leer gelesen, wie es jede v3-Version tut, und die Speicherform lässt eine Liste in `doc` nur weg, solange ihre Collection nichts enthält (siehe [Doc](#doc)). Daher öffnet auch ein Editor vor `4.2.0` diese Dateien, und ein Programm, das eine Datei selbst liest, muss Fehlendes auf dieselbe Weise lesen. Eine Datei, die eine frühere Version gespeichert hat, kommt aus ihrem nächsten Speichern ohne ihren leeren Text, ihre leeren Listen und Collections zurück, eine einmalige Änderung, und wird von da an Byte für Byte gleich gespeichert.

Die Speicherform schreibt jede gesperrte Einstellung mit ihrem gesperrten Wert (siehe [`lockSettings`](#settings)), `settings.ddlScripts` nur, solange ein Skript Text enthält, und das Feld `groupId` einer Tabelle oder, seit `5.1.1`, einer Notiz nur, solange es eine Tabellengruppe benennt, die die Datei schreibt. Seit `4.2.0` schreibt sie außerdem `settings.nameViewMode` nur, solange der geschriebene Wert nicht `'physical'` ist, `settings.columnOrder` nach Möglichkeit mit sieben Einträgen (siehe [Settings](#settings)) und das Feld `nameDerived` einer Tabelle nur, solange es `true` ist.  
Sie schreibt `doc.tableGroupIds` und `tableGroupEntities` nur, solange eine Tabellengruppe existiert, ein Feld `logicalName` nur, solange es anderen Text als Leerraum enthält, das Feld `domainId` einer Spalte nur, solange es eine Domäne benennt, die die Datei schreibt, und jedes Wörterbuch nur, solange es eine Zeile enthält, die die Datei schreibt.

Eine Datei, die vor `4.0.0` gespeichert wurde, enthält das gesamte Dokument, wie ein Editor es damals hielt, einschließlich seiner entfernten Entitäten und dessen, was jedes Laden ermittelt. Ein Laden liest sie, behält den Platz jeder Tabelle und jeder Notiz in der Stapelreihenfolge (siehe [Doc](#doc)) und ermittelt den Rest neu, und das nächste Speichern schreibt nur die Speicherform.

## TypeScript {#typescript}

Die Typen beschreiben die Speicherform und führen ihre Felder jeweils in der Reihenfolge auf, in der eine Datei sie schreibt. Ein mit `?` markiertes Feld kann die Speicherform weglassen, wie unter [Speicherform](#storage-form) beschrieben, und beim Parsen wird ein fehlendes als leer gelesen: `''`, `false`, keine Tabellengruppe und keine Domäne, eine leere Collection, `'physical'` für `nameViewMode` und zwei leere Skripte für `ddlScripts`. Die Ausnahme ist eine fehlende Liste in `doc`, die beim Parsen aus ihrer Collection gefüllt wird (siehe [Doc](#doc)). In einer Wörterbuchzeile markiert `?` die Werte, vor denen eine Zeile enden kann (siehe [Wörterbuchzeilen](#dictionary-rows)). Jedes andere Feld wird immer geschrieben.

### ERDEditorSchemaV3 {#erdeditorschemav3}

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections?: {
    tableEntities?: Record<string, Table>;
    tableColumnEntities?: Record<string, Column>;
    relationshipEntities?: Record<string, Relationship>;
    indexEntities?: Record<string, Index>;
    indexColumnEntities?: Record<string, IndexColumn>;
    memoEntities?: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Jede Entität hat eine `id`, eine opake Zeichenkette, die als Schlüssel in ihrer Collection dient, außer in den drei Wörterbüchern, wo sie der erste Wert einer Zeile ist. Seit `4.2.0` wird beim Parsen eine Entität der sieben geschlüsselten Collections, deren `id` fehlt, leer oder keine Zeichenkette ist, nach dem Schlüssel gelesen, unter dem sie steht, und ein Eintrag verworfen, der kein Objekt ist, oder einer ohne ID, dessen Schlüssel `''` ist. Eine Wörterbuchzeile wird verworfen, wenn sie kein Array ist oder ihre `id` keine Zeichenkette ungleich `''` ist. Ein Editor vor `4.2.0` verwirft eine Entität, deren `id` fehlt oder leer ist, daher schreibt die Speicherform weiterhin jede ID.  
Seit `4.0.0` ist jede neue ID, auch die einer Wörterbuchzeile, eine UUIDv7 in Uuid25-Form, 25 kleingeschriebene Base-36-Ziffern, etwa `03gzrxjv20bdlcak89q25d2m7`, sodass sich die IDs, die ein Editor erzeugt, in der Reihenfolge sortieren, in der er sie erzeugt hat. Ein Dokument behält die IDs, die es enthält, etwa die nanoid-IDs einer früheren Version oder die IDs einer v2-Datei, daher sollte sich nichts auf die Form einer ID verlassen.

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

`originX` und `originY` sind die Ansicht: der Bildschirmpunkt, auf den der Szenenpunkt `(0, 0)` fällt.  
`zoomLevel` reicht von `0.1` bis `1.5`. Ein Dokument, das mit einem Wert über `1` gespeichert wurde, öffnet sich in einem Editor vor `3.5.0` mit `1`.  
Seit `4.0.0` enthalten die Einstellungen keine Felder `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` oder `ignoreSaveSettings`. Nichts schreibt sie, der Parser behält keines davon, und das JSON Schema lehnt eine Datei ab, die sie noch enthält.

`canvasType` ist die Registerkarte, auf der sich ein Dokument öffnet. Ein auf der Registerkarte Visualisierung gespeichertes Dokument enthält `'@dineug/erd-editor/builtin-visualization'`, aber nicht, ob der Modus `Graph` oder `Flow` angezeigt wurde, und ein neu erstellter Editor zeigt diese Registerkarte im Modus `Graph`.  
Seit `4.0.0` behält das Dokument, solange die Sperre `Canvas Type` eingeschaltet ist, wie es in einem neuen Dokument der Fall ist, die Registerkarte, die beim Sperren angezeigt wurde, und ein Wechsel der Registerkarte lässt `value` unverändert. Eine auf der Registerkarte Einstellungen gesetzte Sperre hält die Registerkarte fest, von der der Leser kam, und ein gesperrtes `'settings'`, das nur eine Bearbeitung von Hand schreiben kann, öffnet sich auf `'ERD'`.  
Seit `4.2.0` kann `canvasType` auch `'@dineug/erd-editor/builtin-dictionary'` sein, die Registerkarte [Wörterbuch](../../guide/guides/dictionary.md), die die Sperre `Canvas Type` wie die anderen festhält. Ein Editor vor `4.2.0` behält diesen Wert, zeigt aber unter seiner Symbolleiste keine Registerkarte an, bis der Leser eine auswählt.  
Vom eigenen Zustand des Modus `Flow` wird nichts serialisiert: Platzierung, Zoom, Verschieben, Zeilenanzeige und fokussierte Tabellen bleiben im Editor, und seit `4.2.0` gilt das auch für die Ansichten, die [`Previous table` und `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) schrittweise durchlaufen. Daher beschreiben `originX`, `originY` und `zoomLevel` immer die ERD-Zeichenfläche.

`show` und `lockSettings` sind Bitmasken – verknüpfen Sie die Flags mit OR.  
`columnOrder` ist ein Array, das jeden Wert von `ColumnType` einmal enthält, in Anzeigereihenfolge; seit `4.2.0` kann ein Dokument es mit sieben der neun Werte schreiben, wie der Absatz zur Spaltenreihenfolge weiter unten beschreibt.  
`database`, `language`, `tableNameCase`, `columnNameCase` und `bracketType` enthalten jeweils genau einen Wert, und das JSON Schema lehnt einen kombinierten Wert ab.

Bei einem neuen Dokument hat `show` den Wert `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` und `relationship`.  
Seit `3.10.0` gibt es zwei weitere Flags in `show`, die in einem neuen Dokument und in jedem vor `3.10.0` gespeicherten Dokument beide ausgeschaltet sind.  
`columnAlternateKey` (`512`) ist die Ansichtsoption [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Ist es gesetzt, markiert es die Spalten jedes eindeutigen Index über zwei oder mehr Spalten als `AK1.1`, `AK1.2` usw. Es ist anfangs ausgeschaltet, sodass kein bestehendes Diagramm seine Breite ändert.  
`hideReferentialAction` (`1024`) wirkt umgekehrt: Ist es gesetzt, blendet es die [Beschriftungen ON DELETE und ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) an Verbindungslinien aus, sodass sie standardmäßig angezeigt werden. Die Ansichtsoption `Referential Actions` ist aktiviert, solange das Flag ausgeschaltet ist. Das Flag ändert die Größe keiner Tabelle.  
Ein Editor vor `3.10.0` behält `show` als ganze Zahl, sodass beide Flags ein Speichern dort überstehen.

Seit `4.0.0` gibt es zwei weitere Flags in `show`, die in einem neuen Dokument und in jedem vor `4.0.0` gespeicherten Dokument beide ausgeschaltet sind. Wie `hideReferentialAction` blendet jedes davon aus, was es benennt, sodass Tabellengruppen und Notizen standardmäßig angezeigt werden.  
`hideTableGroup` (`2048`) blendet die [Tabellengruppen](../../guide/guides/table-groups.md) aus, und `hideMemo` (`4096`) blendet jede Notiz aus. Es sind die [Ansichtsoptionen](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` und `Memos`, die jeweils aktiviert sind, solange ihr Flag ausgeschaltet ist. Keines der beiden ändert die Größe einer Tabelle.  
Ein Editor vor `4.0.0` behält `show` als ganze Zahl, sodass beide Flags ein Speichern dort überstehen.

Seit `4.2.0` gibt es ein weiteres Flag in `show`, `columnDomain` (`8192`), das in einem neuen Dokument und in jedem vor `4.2.0` gespeicherten Dokument ausgeschaltet ist, sodass `show` bei einem neuen Dokument weiterhin den Wert `431` hat. Es ist die [Ansichtsoption](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: Ist es gesetzt, zeigt jede Spaltenzeile eine [Domänenzelle](../../guide/guides/logical-names.md#the-domain-cell), was die Tabellen verbreitert. Es ist anfangs ausgeschaltet, sodass kein bestehendes Diagramm seine Breite ändert.  
Ein Editor vor `4.2.0` behält `show` als ganze Zahl, sodass das Flag ein Speichern dort übersteht.

Seit `4.2.0` hat `ColumnType` neun Werte. `columnLogicalName` (`128`) platziert die Zelle des logischen Namens, die eine Spaltenzeile nur in der Ansicht `Both Names` zeigt, und `columnDomain` (`256`) die Domänenzelle. Es sind die Zeilen `Logical Name` und `Domain` der [Spaltenreihenfolge](../../guide/guides/settings.md#adjusting-column-order) auf der Registerkarte Einstellungen. Ein Editor hält eine Reihenfolge aller neun Werte, und die eines neuen Dokuments ist `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Die Speicherform schreibt die Reihenfolge mit sieben Einträgen und lässt `128` und `256` weg, solange `128` direkt vor `columnName` und `256` direkt nach `columnDataType` stehen. Daher schreibt ein neues Dokument weiterhin `1, 2, 4, 8, 16, 32, 64`, und eine Datei, in deren Reihenfolge die beiden nie verschoben wurden, behält ihre Bytes. Andernfalls schreibt sie alle neun.  
Beim Parsen werden die beiden in eine Reihenfolge mit sieben Einträgen an diesen Stellen eingefügt, unabhängig davon, in welcher Reihenfolge die sieben stehen, und neun Einträge, die jeden Typ enthalten, werden so übernommen, wie sie stehen.  
Seit `5.0.0` nimmt das Parsen auch jede andere Reihenfolge an. Es behält jeden bekannten `ColumnType` einmal, in der angegebenen Reihenfolge, und verwirft jeden anderen Eintrag: einen Wert, den kein `ColumnType` benennt, etwa einen Typ, den eine spätere Version hinzufügt, und einen zweiten Eintrag desselben Typs. Jeder Typ, der in der Reihenfolge fehlt, kommt direkt hinter den nächsten Typ davor in der Standardreihenfolge, den die Reihenfolge enthält, oder, wenn keiner davor steht, direkt vor den nächsten danach; so finden `128` und `256` bei sieben Einträgen ihre Plätze. Nur eine Reihenfolge, die keinen bekannten Typ nennt, oder ein Wert, der kein Array ist, wird als Standardreihenfolge gelesen.  
Eine Datei, die eine spätere Version gespeichert hat, öffnet sich also mit ihrer Reihenfolge der Typen, die diese Version kennt, und ein Speichern hier schreibt diese Reihenfolge ohne die anderen. Vor `5.0.0` las das Parsen jede andere Reihenfolge als Standard, sodass eine solche Datei mit zurückgesetzter Spaltenreihenfolge geöffnet wurde. Das JSON Schema akzeptiert sieben oder neun ganze Zahlen.

Seit `4.0.0` hat `Language` acht weitere Ziele des [Codegenerators](../../guide/guides/code-generator.md), von `Mermaid` bis `JSONSchema`. Ein Wert von `language`, den der Parser nicht kennt, wird als `GraphQL` gelesen, daher öffnet ein Editor vor `4.0.0` ein Dokument, das mit einem davon gespeichert wurde, mit GraphQL, und ein Speichern dort schreibt GraphQL.

Seit `4.0.0` tritt `lockSettings` an die Stelle von `ignoreSaveSettings` und `LockSettingType` an die Stelle von `SaveSettingType`, das entfernt wurde. `lockSettings` benennt die Einstellungen, die ein Dokument so speichert, wie sie beim Sperren standen. `viewport` umfasst `originX`, `originY` und `zoomLevel` zusammen, da sich ein ohne seinen Zoom gespeicherter Ursprung an anderer Stelle öffnet, und jedes andere Bit umfasst das Feld, nach dem es benannt ist. Dies sind die Zeilen unter [`Lock`](../../guide/guides/settings.md#lock) auf der Registerkarte Einstellungen.  
Eine Datei enthält jede gesperrte Einstellung mit ihrem gesperrten Wert, unabhängig davon, was der Editor anzeigt, und jede andere Einstellung so, wie sie gerade steht. Solange die passende Sperre eingeschaltet ist, lassen daher Scrollen und Zoomen, ein Wechsel der Registerkarte, das Ändern der Sprache des Codegenerators, einer Schreibweise oder des Begrenzertyps oder ein Wechsel der Namensansicht die Datei unverändert. Beim Sperren wird der Wert übernommen, den die Einstellung in diesem Moment hat, und beim Parsen wird der gesperrte Wert aus dem gespeicherten Feld übernommen.  
Ein von Grund auf neu begonnenes Dokument – ein neuer Editor oder Replikations-Store oder ein leerer Wert, der `value` zugewiesen oder an `setInitialValue()` übergeben wird – hat `lockSettings` auf `63` gesetzt, also jede Sperre eingeschaltet. Ein Dokument, dessen `settings` kein `lockSettings` enthalten – jede vor `4.0.0` gespeicherte Datei, unabhängig von ihrem Wert für `ignoreSaveSettings`, und jedes v2-Dokument –, öffnet sich ebenfalls mit allen Sperren eingeschaltet: Ansicht und Registerkarte dort, wo sie bei einem neuen Dokument sind (`originX` und `originY` auf `0`, `zoomLevel` auf `1`, die Registerkarte ERD), und Sprache, Schreibweisen und Begrenzertyp auf dem gespeicherten Stand gesperrt. Ein Dokument, das seine Sperren benennt, behält sie, `0` eingeschlossen, sowie jeden gespeicherten Wert.  
Beim Parsen bleibt jedes Bit von `lockSettings` erhalten, auch unbekannte, sodass eine Sperre, die eine spätere Version hinzufügt, ein Speichern hier übersteht; das JSON Schema prüft nur, ob der Wert eine ganze Zahl ist. Ein Editor vor `4.0.0` verwirft `lockSettings` beim Speichern und schreibt Ansicht und Registerkarte so, wie sie gerade stehen, sodass sich die Datei hier wieder wie eine vor `4.0.0` gespeicherte öffnet.

Seit `4.2.0` gibt es eine siebte Sperre, `unlockNameViewMode` (`64`), die Zeile `Name View`, die `nameViewMode` umfasst. Ihr Bit wird umgekehrt zu den anderen Sperrbits gelesen, wie die Ausblende-Bits von `Show`: Ist es gesetzt, ist die Namensansicht entsperrt, ist es nicht gesetzt, ist sie gesperrt. Daher bedeutet `63` weiterhin, dass jede Sperre eingeschaltet ist, und ein neues Dokument enthält diesen Wert, wobei die Namensansicht auf `'physical'` gesperrt ist. Eine vor `4.2.0` gespeicherte Datei hat das Bit nicht gesetzt, unabhängig von ihren anderen Sperren, `0` eingeschlossen, daher öffnet sie sich mit einer auf `'physical'` gesperrten Namensansicht. Ein Dokument, in dem alle Sperren ausgeschaltet sind, enthält `64`, und eines, in dem alle anderen Sperren eingeschaltet sind und die Namensansicht entsperrt ist, enthält `127`. Prüfen Sie diese Sperre umgekehrt: Sie ist eingeschaltet, solange `(lockSettings & 64) === 0` gilt.  
Solange das Bit nicht gesetzt ist, enthält eine Datei `nameViewMode` mit der gesperrten Ansicht, unabhängig davon, was ein Editor zeigt, und solange es gesetzt ist, mit der Ansicht, wie sie gerade steht. Was jeder Editor bei eingeschalteter und bei ausgeschalteter Sperre zeigt, beschreibt [`Lock`](../../guide/guides/settings.md#lock).  
Ein Editor der Version `4.0.0` oder `4.1.0` behält das Bit beim Speichern bei, verwirft aber `nameViewMode`, daher öffnet sich das Dokument hier wieder mit `'physical'`, die Sperre unverändert.

Seit `4.0.0` enthält `ddlScripts` die beiden Skripte der Registerkarte [Schema SQL](../../guide/guides/schema-sql.md), die die DDL jeder Datenbank schreibt: `before` nach dem Vorspann und vor den Tabellen, `after` nach der generierten DDL. Die DDL schreibt jedes Skript mit LF-Zeilenumbrüchen, ohne führende Leerzeilen und ohne abschließenden Leerraum und bei MSSQL mit `GO` abgeschlossen, wie unter [Skripte vor und nach den Tabellen](../../guide/guides/schema-sql.md#before-and-after-scripts) beschrieben; `ddlScripts` selbst behält jedes Skript so, wie es eingegeben wurde. Der Schlüssel wird nur geschrieben, solange eines der beiden Skripte Text enthält, und dann mit beiden; ein fehlender Schlüssel oder ein Skript, das keine Zeichenkette ist, wird als `''` gelesen. Die Auswahl bei `Statements`, `Header` und `Tables` auf der Registerkarte und seit `4.2.0` ihr Schalter [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) werden nicht im Dokument gespeichert.  
Ein Editor vor `4.0.0` verwirft die Skripte, wenn er ein Dokument lädt, sodass sie beim Speichern dort verloren gehen.

Seit `4.2.0` ist `nameViewMode` die [Namensansicht](../../guide/guides/logical-names.md#name-view), also die Namen, die das Diagramm zeigt: `'physical'` den Namen jeder Tabelle und Spalte, `'logical'` ihren logischen Namen an der Stelle des Namens und `'both'` den logischen Namen und den Namen. Die Menüs nennen sie `Physical Names`, `Logical Names` und `Both Names`. Die Speicherform schreibt das Feld zuletzt, nach `ddlScripts`, und nur, solange der geschriebene Wert nicht `'physical'` ist. Ein fehlender Wert oder einer, den der Parser nicht kennt, wird als `'physical'` gelesen, und das JSON Schema akzeptiert nur `"logical"` und `"both"`.  
Ein Editor vor `4.2.0` verwirft `nameViewMode`, wenn er ein Dokument lädt.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` und `ReferentialAction` werden nur am Ende erweitert. Ein gespeichertes Dokument enthält die Zahl, daher erhält ein neues Datenbanksystem, ein neues Ziel der Codegenerierung, ein neues Flag, ein neuer Spaltentyp, eine neue Spaltenoption, eine neue Sperre oder eine neue Aktion das nächste Bit statt eines Platzes in der Mitte.

### Doc {#doc}

```ts
type Doc = {
  tableIds?: string[];
  relationshipIds?: string[];
  indexIds?: string[];
  memoIds?: string[];
  tableGroupIds?: string[];
};
```

Jede Liste ist die Reihenfolge einer Art von Entität, nach der sich die DDL, die Tabellensortierung und die Zeichenreihenfolge richten. Jede enthält nur die IDs der Entitäten, die die Datei schreibt, jeweils einmal, in der aufgeführten Reihenfolge, und seit `4.2.0` entfällt eine Liste, die keine enthält. Seit `4.0.0` ist `tableGroupIds` die Reihenfolge der Tabellengruppen. Die Wörterbücher haben hier keine Liste, da ihre Zeilen in der Reihenfolge ihres Blatts stehen (siehe [Wörterbuchzeilen](#dictionary-rows)), und das JSON Schema akzeptiert in `doc` keinen anderen Schlüssel.

Seit `4.2.0` wird beim Parsen eine Liste, die das Dokument weglässt oder als etwas anderes als ein Array enthält, so gelesen, als enthielte sie jeden Eintrag ihrer Collection, jede ID einmal, in der Reihenfolge, in der die Collection sie enthält; ein leeres Array bleibt leer, und jeder Eintrag seiner Collection gilt dann als entfernt. Ein Editor vor `4.2.0` liest eine fehlende Liste als leer, daher schreibt die Speicherform weiterhin jede Liste, sobald ihre Collection eine Entität enthält.

Seit `4.0.0` enthält eine Datei keine Stapelreihenfolge. Beim Laden werden die aufgeführten Tabellen und Notizen nach ihren Plätzen in ihren Listen gestapelt, spätere weiter vorn und jede Notiz über jeder Tabelle, und die Tabellengruppen ebenso untereinander, hinter den Tabellen. Eine Tabelle oder Notiz in einer vor `4.0.0` gespeicherten Datei trägt in ihrem `ui` einen `zIndex`, den ein Laden als ihren Platz in der Stapelreihenfolge behält und das nächste Speichern weglässt. Wird eine Tabelle oder Notiz in den Vordergrund geholt, geht das daher verloren, wenn die Datei erneut geöffnet wird.

### Collection: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name?: string;
  logicalName?: string;
  comment?: string;
  columnIds: string[];
  groupId?: string;
  nameDerived?: true;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  color?: string;
};
```

Seit `4.0.0` trägt eine Tabelle das Feld `groupId`, die ID der [Tabellengruppe](../../guide/guides/table-groups.md), zu der sie gehört. Ein fehlendes oder leeres Feld `groupId` oder eines, das keine Gruppe in `doc.tableGroupIds` benennt, bedeutet keine Gruppe, und die Speicherform schreibt es nur, solange es eine verbleibende Gruppe benennt.

Seit `4.2.0` trägt eine Tabelle das Feld `logicalName`, den Namen, den die [Ansichten](../../guide/guides/logical-names.md#name-view) `Logical Names` und `Both Names` zeigen, `''` für keinen, und das Feld `nameDerived`, das `true` ist, solange die Wörterbücher `name` aus dem logischen Namen [abgeleitet](../../guide/guides/dictionary.md#deriving-physical-names) haben. Solange es gesetzt ist, leitet ein neuer logischer Name den Namen erneut ab; solange nicht, ist der Name ein eigener Name, und ein neuer logischer Name lässt ihn unverändert, es sei denn, der Name ist leer oder besteht nur aus Leerraum. Eine Umbenennung von Hand schaltet es aus, und [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) schreibt sogar einen Namen neu, den jemand selbst geschrieben hat, und schaltet es überall ein, wo es einen logischen Namen gibt.  
Die Speicherform schreibt `logicalName` nach `name`, so wie eingegeben, nur, solange es anderen Text als Leerraum enthält, und `nameDerived` nach `groupId` nur, solange es `true` ist, der einzige Wert, den das JSON Schema akzeptiert. Ein fehlendes Feld `logicalName` wird als `''` gelesen und ein fehlendes Feld `nameDerived` als `false`, daher gilt jeder Name in einer vor `4.2.0` gespeicherten Datei als eigener Name.  
Ein Editor vor `4.2.0` verwirft beide, wenn er ein Dokument lädt, sodass beim Speichern dort der logische Name jeder Tabelle verloren geht.

### Collection: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name?: string;
  comment?: string;
  dataType?: string;
  default?: string;
  options: number; // Constants: ColumnOption
  logicalName?: string;
  domainId?: string;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;
```

Seit `4.0.0` enthält eine Datei keine Schlüsselmarkierungen: Bei jedem Laden wird eine Spalte als Primärschlüssel markiert, wenn das Bit `primaryKey` von `options` gesetzt ist, und als Fremdschlüssel, solange eine Beziehung in ihrer Tabelle an ihr endet.  
Ein Editor vor `4.0.0` zeigt die Spalten einer hier gespeicherten Datei ohne ihre Primärschlüsselsymbole an.

Seit `4.2.0` trägt eine Spalte wie eine Tabelle das Feld `logicalName` sowie das Feld `domainId`, die ID der Domäne, mit der sie verknüpft ist, `''` für keine. Änderungen in einem Editor halten eine verknüpfte Spalte beim Datentyp ihrer Domäne, wie unter [Domänen und Datentypen](../../guide/guides/dictionary.md#domains-and-data-types) beschrieben. Beim Parsen wird jedoch kein Spaltentyp angepasst, daher kann eine anderswo geschriebene Datei eine verknüpfte Spalte bei einem anderen Typ belassen, ebenso zwei sich überkreuzende Änderungen zweier Mitbearbeiter; das Blatt Prüfungen listet jeden solchen Fall als [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds) auf. Beim Parsen wird ein Feld `domainId` geleert, das keine Domäne benennt, die die Datei enthält. Nach `options` schreibt die Speicherform `logicalName` nach der Regel für eine Tabelle und `domainId` nur, solange es eine Domäne benennt, die die Datei schreibt; eine Spalte, die mit einer entfernten oder mit einer Domäne verknüpft ist, die die Datei weglässt, wird ohne die Verknüpfung und mit dem Datentyp geschrieben, den sie enthält.  
`ColumnOption.nameDerived` (`16`) ist das Kennzeichen der Spalte für einen abgeleiteten Namen, das mit den anderen Bits in `options` gehalten wird und dasselbe bedeutet wie das Feld `nameDerived` einer Tabelle. Ein als Nicht NULL markierter Primärschlüssel, dessen Namen die Wörterbücher abgeleitet haben, hat zum Beispiel in `options` den Wert `26`.  
Ein Editor vor `4.2.0` verwirft `logicalName` und `domainId`, wenn er ein Dokument lädt, sodass sie beim Speichern dort verloren gehen. Er behält `options` als ganze Zahl, sodass das Bit `nameDerived` ein Speichern dort übersteht.

### Collection: relationshipEntities {#collection-relationshipentities}

```ts
type Relationship = {
  id: string;
  relationshipType: number; // Constants: RelationshipType
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;
```

Seit `3.10.0` trägt eine Beziehung `onDelete` und `onUpdate`, ihre [Aktionen für ON DELETE und ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Jedes der beiden Felder enthält genau einen Wert von `ReferentialAction`. `none`, der Standardwert, schreibt keine Klausel, sodass das eigene Standardverhalten der Datenbank gilt. Die anderen fünf stehen für `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` und `RESTRICT`. Schema SQL schreibt eine Klausel nur für eine Datenbank, die ihre Aktion akzeptiert.  
Die Speicherform schreibt immer beide, und seit `4.0.0` verlangt das JSON Schema sie, wobei es nur prüft, ob jedes davon eine ganze Zahl ist. Beim Parsen wird ein fehlendes Feld, wie in jedem vor `3.10.0` gespeicherten Dokument, weiterhin als `none` gelesen, ebenso ein Wert außerhalb der Liste.  
Ein Editor vor `3.10.0` kennt die Felder nicht und verwirft sie, wenn er ein Dokument lädt, sodass beim Speichern dort jede Aktion verloren geht.

Seit `4.0.0` wird bei jedem Laden anhand der Spalten, an denen eine Beziehung endet und die die Kindtabelle noch aufführt, ermittelt, ob sie identifizierend ist und wie ihr Ende an der Elterntabelle gezeichnet wird. Sie ist identifizierend, eine durchgezogene Linie, solange jede solche Spalte ein Primärschlüssel ist, und ihr Ende an der Elterntabelle besteht aus zwei Strichen, solange jede solche Spalte NOT NULL ist, sonst aus einem Kreis und einem Strich. Bleibt keine solche Spalte übrig, ist die Beziehung nicht identifizierend und hat zwei Striche, so wie eine neue Beziehung beginnt. Siehe [Verbindungslinien lesen](../../guide/guides/relationship-editing.md#reading-a-connector).

### Collection: indexEntities {#collection-indexentities}

```ts
type Index = {
  id: string;
  name?: string;
  tableId: string;
  indexColumnIds: string[];
  unique: boolean;
};
```

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
  value?: string;
  groupId?: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};
```

Seit `4.0.0` teilen sich Tabellen und Notizen [einen gemeinsamen Stapel](../../guide/guides/table-related-functions.md#moving-multiple-tables), sodass eine Tabelle, die in den Vordergrund geholt wird, über einer Notiz liegen kann. Beim Laden wird jede Notiz über alle Tabellen gelegt, wie unter [Doc](#doc) beschrieben. Eine Notiz in einer vor `4.0.0` gespeicherten Datei behält ihren gespeicherten `zIndex`, der aus demselben Zähler stammte wie der der Tabellen, sodass eine Notiz, die eine frühere Version über allen Tabellen gezeichnet hat, beim Öffnen unter einer Tabelle liegen kann, die nach ihr in den Vordergrund geholt wurde.

Seit `5.1.1` trägt eine Notiz das Feld `groupId`, die ID der [Tabellengruppe](../../guide/guides/table-groups.md), zu der sie gehört, wie eine Tabelle. Ein fehlendes oder leeres Feld `groupId`, wie in jeder vor `5.1.1` gespeicherten Datei, oder eines, das keine Gruppe in `doc.tableGroupIds` benennt, bedeutet keine Gruppe, und die Speicherform schreibt es nur, solange es eine beibehaltene Gruppe benennt.  
Ein Editor vor `5.1.1` verwirft beim Laden eines Dokuments das Feld `groupId` jeder Notiz, sodass beim Speichern dort jede Notiz aus ihrer Gruppe genommen wird, wobei ein Editor ab `4.0.0` die Gruppen der Tabellen beibehält – siehe [Gemischte Versionen](./collaborative-editing.md#mixing-releases).

### Collection: tableGroupEntities {#collection-tablegroupentities}

```ts
type TableGroup = {
  id: string;
  name?: string;
  color?: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

Seit `4.0.0` kann ein Dokument [Tabellengruppen](../../guide/guides/table-groups.md) enthalten: benannte, farbige Rechtecke, die hinter Tabellen und Notizen gezeichnet werden. Eine Tabelle, seit `5.1.1` auch eine Notiz, tritt einer Gruppe über ihr eigenes Feld `groupId` bei, daher enthält eine Gruppe keine Liste ihrer Mitglieder. Die Speicherform schreibt die Collection, wie `doc.tableGroupIds`, nur, solange eine Gruppe existiert, und ein Dokument ohne sie, etwa eines, das vor `4.0.0` gespeichert wurde, hat keine Gruppen. `Show.hideTableGroup` blendet sie aus.  
Ein Editor vor `4.0.0` verwirft beim Laden eines Dokuments die Gruppen und das Feld `groupId` jeder Tabelle, sodass beim Speichern dort jede Gruppe verloren geht.

### Wörterbuchzeilen {#dictionary-rows}

Seit `4.2.0` enthält ein Dokument drei Wörterbücher, die Blätter `Words`, `Terms` und `Domains` der Registerkarte [Wörterbuch](../../guide/guides/dictionary.md), in `wordEntities`, `termEntities` und `domainEntities`. Jedes Feld eines Worts, eines Begriffs oder einer Domäne ist eine Zeichenkette, und keine dieser Entitäten hat ein Feld `ui`. Das Blatt `Checks` wird aus den Wörterbüchern und dem Diagramm ermittelt und nicht gespeichert.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Keines der drei ist nach ID geschlüsselt. Jedes wird als Kopfzeile und Zeilen geschrieben: `fields` benennt die Felder der Entität einmal, die ID zuerst, und jede Zeile enthält die Werte einer Entität in dieser Reihenfolge. Die Typen unten listen die Felder jeder Entität in dieser Reihenfolge auf. Eine Zeile behält immer ihre ID und ihren Namen, aber ihre leeren Werte am Ende nach dem Namen entfallen, sodass ein leerer Wert vor einem, der erhalten bleibt, `''` bleibt, und beim Parsen wird ein Wert, der einer Zeile fehlt, als `''` gelesen. Jede Zeile wird als kompaktes JSON in eine eigene Textzeile geschrieben, wie in diesen beiden Wörtern aus einer Datei:

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

Die Speicherform schreibt die Zeilen jedes Blatts in der Reihenfolge des Blatts, ohne Feld für die Reihenfolge, daher sind die Zeilen einer Datei die Mitglieder eines Wörterbuchs und ihre Reihenfolge. Sie lässt eine Zeile weg, deren Werte nach der ID alle leer sind oder nur aus Leerraum bestehen, etwa eine, die hinzugefügt und nie ausgefüllt oder die geleert wurde, sowie jede Verknüpfung mit einer solchen oder einer entfernten Domäne: Das Feld `domainId` einer Spalte entfällt, und das eines Begriffs wird als `''` geschrieben, wobei der Begriff selbst entfällt, wenn er sonst nichts enthält.  
Beim Parsen werden die Zeilen in der Reihenfolge gelesen, in der sie stehen, daher listet jedes Blatt sie in der Reihenfolge auf, in der die Datei sie geschrieben hat.  
Ein Dokument ohne die Wörterbücher, etwa eines, das vor `4.2.0` gespeichert wurde, hat keine. Ein Editor vor `4.2.0` verwirft alle drei, wenn er ein Dokument lädt, sodass beim Speichern dort jedes Wort, jeder Begriff und jede Domäne verloren geht.

### Collection: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  abbreviation?: string;
  englishName?: string;
  description?: string;
  synonyms?: string;
  forbiddenWords?: string;
};
```

Ein Wort ist eines der Wörter, aus denen ein logischer Name besteht, und `abbreviation` ist das, was es in einem physischen Namen vertritt. `synonyms` listet andere Schreibweisen des Worts auf und `forbiddenWords` Wörter, die nicht an seiner Stelle verwendet werden dürfen, jeweils durch Kommas getrennt.

### Collection: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  physicalName?: string;
  domainId?: string;
  description?: string;
  synonyms?: string;
};
```

Ein Begriff ist ein vollständiger logischer Name. Eine Tabelle oder Spalte, deren `logicalName` mit `name` übereinstimmt, leitet `physicalName` ab oder, solange dieses Feld leer ist, einen aus den Abkürzungen der Wörter zusammengesetzten Namen, und eine Spalte übernimmt außerdem die Domäne, die `domainId` benennt, `''` für keine (siehe [Physische Namen ableiten](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` ist durch Kommas getrennt. Beim Parsen wird ein Feld `domainId` geleert, das keine Domäne benennt, die die Datei enthält, wie bei einer Spalte.

### Collection: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  category?: string;
  dataType?: string;
  description?: string;
};
```

Eine Domäne ist ein benannter Datentyp, den `dataType` so enthält wie bei einer Spalte, die Länge eingeschlossen, etwa `NUMERIC(10)`. Eine Spalte oder ein Begriff verknüpft eine Domäne über ihre ID, und der Editor gibt jeder verknüpften Spalte den Datentyp der Domäne (siehe [Domänen und Datentypen](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Die kanonische Schemadatei ist unter [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) veröffentlicht und kann mit `$schema` direkt referenziert werden.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Setzen Sie `$schema` an den Anfang einer Datei `.erd.json`, dann validieren Editoren, die JSON Schema verstehen, etwa VS Code, das Dokument und vervollständigen seine Felder automatisch, während Sie es bearbeiten.

Seit `4.0.0` beschreibt das Schema nur die Speicherform. Jedes Objekt mit benannten Feldern ist geschlossen (`additionalProperties: false`), jedes Feld, das die Speicherform immer schreibt, ist erforderlich, jedes oben mit `?` markierte Feld ist aufgeführt, aber nicht erforderlich, und kein anderes Feld ist aufgeführt. Daher lehnt es eine vor `4.0.0` gespeicherte Datei mit ihrem `meta`, ihren Breiten, `zIndex`, `ignoreSaveSettings` und dem Rest ab, bis ein Editor der Version `4.0.0` oder neuer diese Datei erneut speichert. Eine Datei, die von `3.2.0` oder neuer gespeichert wurde, nennt bereits die URL dieses Schemas, die auf den Branch `main` zeigt, sodass ein Editor, der dagegen validiert, die Datei jetzt beanstandet. Eine von `3.0.0` oder `3.1.0` gespeicherte Datei oder ein v2-Dokument nennt kein `$schema`.

Seit `4.2.0` verlangt das Schema weder die Textfelder einer Entität noch eine Liste in `doc`, eine Collection oder `collections` selbst, die die Speicherform weglässt, solange sie nichts enthalten. Es akzeptiert weiterhin eine von `4.0.0` oder `4.1.0` gespeicherte Datei. Es benennt die neuen Felder: `nameViewMode`, das nur `"logical"` und `"both"` annimmt; `logicalName` und `nameDerived` einer Tabelle, wobei `nameDerived` nur `true` annimmt; `logicalName` und `domainId` einer Spalte; und die drei Wörterbücher, jedes mit seiner Kopfzeile und Zeilen aus Zeichenketten. `canvasType` führt die Registerkarte Wörterbuch auf, `columnOrder` akzeptiert sieben oder neun ganze Zahlen, und die Beschreibungen von `show`, `columnOrder`, `lockSettings` und `options` nennen die neuen Bits.

Seit `5.1.1` nennt es außerdem das Feld `groupId` einer Notiz; eine vor `5.1.1` angefertigte Kopie des Schemas lehnt dieses Feld ab.

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
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the memo belongs to; absent means none",
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
      "description": "Named, coloured rectangles drawn behind tables and memos; a table or a memo joins one through its groupId. Written while a group exists; absent means none",
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
