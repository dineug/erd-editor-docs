---
sidebar_position: 3
description: Il formato di documento .erd.json — la forma di archiviazione contenuta in un file e il valore di runtime mantenuto da un editor, i tipi TypeScript, le costanti alla base di ogni campo numerico e il JSON Schema pubblicato.
---

# Schema

`.erd.json` è il formato di documento dell’editor. Leggere questa pagina se occorre generare, convalidare o migrare un documento al di fuori dell’editor.

Dalla versione `4.0.0` un documento ha due serializzazioni, entrambe con `version` `'3.0.0'`. La forma di archiviazione è ciò che un file contiene: è ciò che restituisce [`editor.value`](../erd-editor-element.md#value), ciò che scrive l’esportazione JSON e l’unica forma accettata dal [JSON Schema](#json-schema) pubblicato. Il valore di runtime è l’intero documento così come lo mantiene un editor, ed è restituito da [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, il setter `value` e `setSchemaJSON()` leggono entrambe le forme, qualsiasi file salvato da una versione precedente e un documento `.vuerd` v2. Prima della versione `4.0.0` ne esisteva una sola: `value` restituiva l’intero documento così come lo manteneva l’editor, come fa ora `runtimeValue`.

## Forma di archiviazione e valore di runtime {#storage-form-and-runtime-value}

La forma di archiviazione contiene solo le entità attive: ogni tabella elencata in `doc.tableIds`, le colonne elencate da quelle tabelle, le relazioni tra due tabelle conservate, gli indici delle tabelle conservate con le colonne di indice la cui colonna è ancora elencata dalla tabella, e i memo e i gruppi di tabelle elencati. Esclude ciò che un editor ricava al caricamento o mantiene mentre è aperto: le entità rimosse, `seqColumnIds` e `seqIndexColumnIds`, ogni `zIndex`, le larghezze misurate, il campo `ui` delle colonne e, per una relazione, `identification`, `startRelationshipType` e i punti di ancoraggio. I tipi riportati sotto contrassegnano ciascuno di questi campi con `// runtime only`.  
Ogni collezione è indicizzata per id nell’ordine delle unità di codice, con le colonne raggruppate prima per `tableId` e le colonne di indice prima per `indexId`. Ogni entità scrive i propri campi in un ordine fisso, e il testo è indentato con due spazi e termina con un carattere di nuova riga. Così lo stesso documento scrive sempre gli stessi byte, una modifica cambia solo ciò che tocca, e un file salvato su un computer con altri font si riapre con lo stesso `value`.  
VS Code, Obsidian e il plugin JetBrains scrivono un file solo quando una modifica cambia `value`, quindi un file salvato da una versione precedente mantiene la vecchia forma fino alla prima modifica.

Il valore di runtime mantiene ciò che la forma di archiviazione esclude: entità rimosse, sequenze, z-index, larghezze, indicatori di chiave, flag delle relazioni e punti di ancoraggio. È indentato con due spazi, senza carattere di nuova riga finale. Usarlo solo per inizializzare un collaboratore o una seconda vista tramite `setInitialValue()`, in modo che l’annullamento di una rimozione inviato da un altro editor riporti lì l’entità per intero. Non scriverlo mai in un file; il JSON Schema lo rifiuta. Nessun meccanismo raccoglie più le entità rimosse, quindi il valore di runtime le mantiene finché il documento non viene riaperto dal suo file.

Entrambe le forme scrivono ogni impostazione bloccata con il suo valore bloccato (vedere [`lockSettings`](#settings)), `settings.ddlScripts` solo mentre uno script contiene testo, e il `groupId` di una tabella solo mentre non è vuoto. La forma di archiviazione scrive `doc.tableGroupIds` e `tableGroupEntities` solo mentre esiste un gruppo di tabelle; il valore di runtime li scrive mentre il documento contiene un gruppo o un gruppo rimosso.

## TypeScript {#typescript}

I tipi descrivono il valore di runtime. Un campo contrassegnato con `// runtime only` è escluso dalla forma di archiviazione, e un campo contrassegnato con `?` viene scritto solo mentre contiene qualcosa.

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

Ogni entità ha come chiave il proprio `id`, una stringa opaca; l’analisi scarta un’entità il cui `id` è mancante o vuoto. Dalla versione `4.0.0` ogni nuovo id è un UUIDv7 scritto in forma Uuid25, 25 cifre minuscole in base 36 come `03gzrxjv20bdlcak89q25d2m7`, quindi gli id generati da un editor si ordinano nella sequenza in cui li ha creati. Un documento conserva gli id che contiene, come gli id nanoid di una versione precedente o gli id di un file v2, quindi nulla dovrebbe basarsi sulla forma di un id.

Dalla versione `4.0.0` nessuna entità contiene un oggetto `meta` (`createAt`, `updateAt`), e i tipi `EntityMeta` ed `EntityType` sono stati rimossi. Nulla lo scrive, l’analisi scarta il `meta` contenuto in un file meno recente, e il JSON Schema lo rifiuta. Serviva solo a scandire i tempi della garbage collection delle entità rimosse, anch’essa eliminata.

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

`originX` e `originY` sono la vista: il punto dello schermo su cui cadono le coordinate `(0, 0)` della scena.  
`zoomLevel` va da `0.1` a `1.5`. Un documento salvato oltre `1` si apre a `1` in un editor precedente alla versione `3.5.0`.  
Dalla versione `4.0.0` le impostazioni non contengono `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` né `ignoreSaveSettings`. Nulla li scrive, il parser non ne conserva nessuno, e il JSON Schema rifiuta un file che li contiene ancora.

`canvasType` è la scheda su cui si apre un documento. Un documento salvato sulla scheda Visualizzazione contiene `'@dineug/erd-editor/builtin-visualization'` ma non se era visualizzata la modalità `Graph` o `Flow`, e un editor appena creato mostra quella scheda in modalità `Graph`.  
Dalla versione `4.0.0`, mentre il blocco `Canvas Type` è attivo, come in un nuovo documento, il documento conserva la scheda visualizzata al momento del blocco, e il cambio di scheda lascia `value` invariato. Un blocco attivato sulla scheda Impostazioni mantiene la scheda da cui si era arrivati, e un `'settings'` bloccato, che solo una modifica manuale può scrivere, si apre su `'ERD'`.  
Nessuna parte dello stato proprio della modalità `Flow` viene serializzata — posizionamento, zoom, spostamento della vista, visualizzazione righe e tabelle focalizzate restano nell’editor — quindi `originX`, `originY` e `zoomLevel` descrivono sempre l’area di disegno ERD.

`show` e `lockSettings` sono maschere di bit — combinare i flag con OR.  
`columnOrder` è un array che contiene tutti e sette i valori di `ColumnType`, nell’ordine di visualizzazione.  
`database`, `language`, `tableNameCase`, `columnNameCase` e `bracketType` contengono ciascuno esattamente un valore, e il JSON Schema rifiuta un valore combinato.

Lo `show` di un nuovo documento è `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` e `relationship`.  
Dalla versione `3.10.0` ci sono altri due flag `show`, entrambi disattivati in un nuovo documento e in ogni documento salvato prima della versione `3.10.0`.  
`columnAlternateKey` (`512`) è l’opzione di visualizzazione [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Se impostato, contrassegna le colonne di ogni indice univoco su due o più colonne come `AK1.1`, `AK1.2` e così via. È inizialmente disattivato, quindi nessun diagramma esistente cambia larghezza.  
`hideReferentialAction` (`1024`) funziona al contrario: se impostato, nasconde le [etichette ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) sui connettori, che quindi sono visibili per impostazione predefinita. L’opzione di visualizzazione `Referential Actions` è selezionata mentre il flag è disattivato. Non cambia le dimensioni di nessuna tabella.  
Un editor precedente alla versione `3.10.0` conserva `show` come numero intero, quindi entrambi i flag sopravvivono a un salvataggio in quell’editor.

Dalla versione `4.0.0` ci sono altri due flag `show`, entrambi disattivati in un nuovo documento e in ogni documento salvato prima della versione `4.0.0`. Come `hideReferentialAction`, ciascuno nasconde ciò che nomina, quindi gruppi di tabelle e memo sono visibili per impostazione predefinita.  
`hideTableGroup` (`2048`) nasconde i [gruppi di tabelle](../../guide/guides/table-groups.md), e `hideMemo` (`4096`) nasconde ogni memo. Sono le [opzioni di visualizzazione](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` e `Memos`, ciascuna selezionata mentre il suo flag è disattivato. Nessuno dei due cambia le dimensioni di alcuna tabella.  
Un editor precedente alla versione `4.0.0` conserva `show` come numero intero, quindi entrambi i flag sopravvivono a un salvataggio in quell’editor.

Dalla versione `4.0.0` `Language` ha otto destinazioni del [Generatore di codice](../../guide/guides/code-generator.md) in più, da `Mermaid` a `JSONSchema`. Un `language` che il parser non conosce viene letto come `GraphQL`, quindi un editor precedente alla versione `4.0.0` apre su GraphQL un documento salvato con una di esse, e salvando in quell’editor si scrive GraphQL.

Dalla versione `4.0.0` `lockSettings` prende il posto di `ignoreSaveSettings`, e `LockSettingType` quello di `SaveSettingType`, che è stato rimosso. `lockSettings` indica le impostazioni che un documento salva così com’erano al momento del blocco. `viewport` copre insieme `originX`, `originY` e `zoomLevel`, poiché un’origine salvata senza il suo zoom si apre altrove, e ogni altro bit copre il campo di cui porta il nome. Sono le righe [`Lock`](../../guide/guides/settings.md#lock) della scheda Impostazioni.  
Un’impostazione bloccata viene scritta con il suo valore bloccato, qualunque cosa mostri l’editor, sia da `value` sia da `runtimeValue`, e ogni altra impostazione così com’è. Quindi, mentre il blocco corrispondente è attivo, il file resta invariato quando si scorre o si esegue lo zoom, si cambia scheda, o si cambia il linguaggio del Generatore di codice, uno stile dei nomi o il tipo di delimitatore. Il blocco prende il valore che l’impostazione ha in quel momento, e l’analisi prende il valore bloccato dal campo salvato.  
Un documento creato da zero — un nuovo editor o store di replica, o un valore vuoto assegnato a `value` o passato a `setInitialValue()` — ha `lockSettings` impostato a `63`, con tutti i blocchi attivi. Anche un documento le cui `settings` non contengono `lockSettings` — ogni file salvato prima della versione `4.0.0`, qualunque sia il suo `ignoreSaveSettings`, e ogni documento v2 — si apre con tutti i blocchi attivi: vista e scheda dove si trovano quelle di un nuovo documento (`originX` e `originY` a `0`, `zoomLevel` a `1`, la scheda ERD), e linguaggio, stili dei nomi e tipo di delimitatore bloccati sui valori salvati. Un documento che indica i propri blocchi li conserva, `0` compreso, insieme a ogni valore salvato.  
L’analisi conserva ogni bit di `lockSettings`, anche quelli sconosciuti, quindi un blocco aggiunto da una versione successiva sopravvive a un salvataggio in questo editor; il JSON Schema verifica solo che sia un intero. Un editor precedente alla versione `4.0.0` scarta `lockSettings` al salvataggio e scrive vista e scheda così come sono, quindi il file si riapre qui come un file salvato prima della versione `4.0.0`.

Dalla versione `4.0.0` `ddlScripts` contiene i due script della scheda [Schema SQL](../../guide/guides/schema-sql.md), che il DDL di ogni database scrive: `before` dopo l’intestazione e prima delle tabelle, `after` dopo il DDL generato. Il DDL scrive ciascuno con interruzioni di riga LF, senza le righe vuote iniziali né gli spazi finali, e su MSSQL terminato da `GO`, come descritto in [Script prima e dopo le tabelle](../../guide/guides/schema-sql.md#before-and-after-scripts); `ddlScripts` di per sé conserva ogni script così come è stato digitato. La chiave viene scritta solo mentre uno dei due script contiene testo, e in quel caso con entrambi; una chiave mancante, o uno script che non è una stringa, viene letto come `''`. Le scelte `Statements`, `Header` e `Tables` della scheda non vengono salvate nel documento.  
Un editor precedente alla versione `4.0.0` scarta gli script quando carica un documento, quindi salvando in quell’editor vanno persi.

`Database`, `Language`, `Show`, `LockSettingType` e `ReferentialAction` si estendono solo in coda. Un documento salvato memorizza il numero, quindi un nuovo fornitore di database, una nuova destinazione di generazione del codice, un nuovo flag, un nuovo blocco o una nuova azione occupa il bit successivo anziché una posizione intermedia.

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

Ogni elenco è l’ordine di un tipo di entità, letto dal DDL, dall’ordinamento delle tabelle e dall’ordine di disegno. Nella forma di archiviazione ogni elenco contiene solo gli id delle entità conservate, ciascuno una sola volta, nell’ordine elencato. Dalla versione `4.0.0` `tableGroupIds` è l’ordine dei gruppi di tabelle.

Dalla versione `4.0.0` l’ordine di sovrapposizione non viene salvato. L’analisi impila ogni tabella, memo e gruppo di tabelle elencato che non contiene uno `zIndex` in base alla sua posizione nel proprio elenco, con i successivi davanti: i gruppi di tabelle da `1`, le tabelle da `2` e i memo sopra ogni tabella. Un’entità che contiene uno `zIndex`, come in un valore di runtime o in un file salvato prima della versione `4.0.0`, lo conserva. Lo spostamento in primo piano di una tabella o di un memo va quindi perso alla riapertura del file.

### Collezione: tableEntities {#collection-tableentities}

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

Dalla versione `4.0.0` una tabella contiene `groupId`, l’id del [gruppo di tabelle](../../guide/guides/table-groups.md) a cui appartiene. Un `groupId` mancante o vuoto, o che non indica alcun gruppo in `doc.tableGroupIds`, equivale a nessun gruppo, e la forma di archiviazione lo scrive solo mentre indica un gruppo conservato.  
L’analisi inizializza `seqColumnIds` a `columnIds` quando è mancante o non contiene un id elencato, e un editor misura di nuovo `widthName` e `widthComment` con i propri font a ogni caricamento.

### Collezione: tableColumnEntities {#collection-tablecolumnentities}

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

Dalla versione `4.0.0` la forma di archiviazione non scrive il campo `ui` delle colonne. Ogni caricamento ricava `keys`, l’indicatore di chiave primaria dal bit `primaryKey` di `options` e l’indicatore di chiave esterna dalle relazioni che terminano sulla colonna, e misura le quattro larghezze.  
Un editor precedente alla versione `4.0.0` mostra le colonne di un file salvato qui senza le icone di chiave primaria.

### Collezione: relationshipEntities {#collection-relationshipentities}

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

Dalla versione `3.10.0` una relazione contiene `onDelete` e `onUpdate`, le sue [azioni ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Ciascuno contiene esattamente un valore di `ReferentialAction`. `none`, il valore predefinito, non scrive alcuna clausola, quindi si applica il comportamento predefinito del database. Gli altri cinque corrispondono a `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` e `RESTRICT`. Schema SQL scrive una clausola solo per un database che accetta la sua azione.  
La forma di archiviazione li scrive sempre entrambi, e dalla versione `4.0.0` il JSON Schema li richiede, verificando solo che ciascuno sia un intero. L’analisi legge ancora come `none` un campo mancante, come in ogni documento salvato prima della versione `3.10.0`, e lo stesso vale per un valore fuori dall’elenco.  
Un editor precedente alla versione `3.10.0` non conosce questi campi e li scarta quando carica un documento, quindi salvando in quell’editor si perde ogni azione.

Dalla versione `4.0.0` ogni caricamento ricava ciò che la forma di archiviazione esclude. Una relazione è identificante quando ogni colonna su cui termina è una chiave primaria, e il suo `startRelationshipType` è `dash` quando ognuna di queste colonne è NOT NULL e `ring` altrimenti; una relazione a cui non resta alcuna colonna di arrivo è non identificante e `dash`, come una nuova relazione appena creata. I punti di ancoraggio, `x`, `y` e `direction`, vengono posizionati di nuovo.

### Collezione: indexEntities {#collection-indexentities}

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

L’analisi inizializza `seqIndexColumnIds` a `indexColumnIds` quando è mancante o non contiene un id elencato.

### Collezione: indexColumnEntities {#collection-indexcolumnentities}

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

### Collezione: memoEntities {#collection-memoentities}

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

Dalla versione `4.0.0` tabelle e memo [condividono un’unica pila](../../guide/guides/table-related-functions.md#moving-multiple-tables) ordinata per `zIndex`, quindi portare una tabella in primo piano può metterla sopra un memo. L’analisi impila un memo salvato senza `zIndex` sopra ogni tabella, come descritto in [Doc](#doc). Un memo in un file salvato prima della versione `4.0.0` conserva lo `zIndex` salvato, che proveniva dallo stesso contatore di quello delle tabelle, quindi un memo che una versione precedente disegnava sopra ogni tabella può aprirsi sotto una tabella portata in primo piano dopo di esso.

### Collezione: tableGroupEntities {#collection-tablegroupentities}

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

Dalla versione `4.0.0` un documento può contenere [gruppi di tabelle](../../guide/guides/table-groups.md): rettangoli con nome e colore disegnati dietro le tabelle. Una tabella entra in un gruppo tramite il proprio `groupId`, quindi un gruppo non contiene alcun elenco di membri. La forma di archiviazione scrive la collezione, come `doc.tableGroupIds`, solo mentre esiste un gruppo, e un documento che non la contiene, come uno salvato prima della versione `4.0.0`, non ha gruppi. `Show.hideTableGroup` li nasconde.  
Un editor precedente alla versione `4.0.0` scarta i gruppi e il `groupId` di ogni tabella quando carica un documento, quindi salvando in quell’editor si perde ogni gruppo.

## JSON Schema {#json-schema}

Il file canonico dello schema è pubblicato in [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) e può essere referenziato direttamente con `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Inserendo `$schema` all’inizio di un file `.erd.json`, gli editor che supportano JSON Schema, come VS Code, convalidano il documento e ne completano automaticamente i campi durante la modifica.

Dalla versione `4.0.0` lo schema descrive solo la forma di archiviazione. Ogni oggetto con campi denominati è chiuso (`additionalProperties: false`), ogni campo che la forma di archiviazione scrive sempre è obbligatorio, e non vi compare alcun campo che essa esclude. Per questo rifiuta il valore di runtime. Rifiuta anche un file salvato prima della versione `4.0.0`, con il suo `meta`, le larghezze, lo `zIndex`, `ignoreSaveSettings` e il resto, finché un editor della versione `4.0.0` o successiva non salva di nuovo quel file. Un file salvato con la versione `3.2.0` o successiva indica già l’URL di questo schema, che punta al branch `main`, quindi un editor che esegue la convalida rispetto a esso ora segnala il file. Un file salvato con la `3.0.0` o la `3.1.0`, o un documento v2, non indica alcun `$schema`.

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
