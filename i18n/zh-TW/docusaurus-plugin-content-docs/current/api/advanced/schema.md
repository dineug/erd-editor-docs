---
sidebar_position: 3
description: .erd.json 文件格式：檔案所保存的儲存形式與編輯器所持有的執行階段值、TypeScript 型別、各數值屬性背後的常數和已發佈的 JSON Schema。
---

# 結構描述

`.erd.json` 是編輯器的文件格式。若需要在編輯器之外產生、驗證或移轉文件，可閱讀本頁。

自 `4.0.0` 起，文件有兩種序列化形式，兩者的 `version` 都是 `'3.0.0'`。儲存形式是檔案所保存的內容：它是 [`editor.value`](../erd-editor-element.md#value) 傳回的內容、JSON 匯出所寫入的內容，也是已發佈的 [JSON Schema](#json-schema) 唯一接受的形式。執行階段值是編輯器所持有的完整文件，由 [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) 傳回。`setInitialValue()`、`value` 的 setter 和 `setSchemaJSON()` 都能讀取這兩種形式、較早版本所儲存的任何檔案和 v2 的 `.vuerd` 文件。在 `4.0.0` 之前只有一種：`value` 傳回編輯器所持有的完整文件，就像現在的 `runtimeValue` 一樣。

## 儲存形式與執行階段值 {#storage-form-and-runtime-value}

儲存形式只保存現存的實體：`doc.tableIds` 中列出的每個資料表、這些資料表所列出的欄位、連接兩個保留下來的資料表的關聯、保留下來的資料表的索引及其所指欄位仍列在該資料表中的索引欄位，以及列出的備忘錄和資料表群組。它會省略編輯器在載入時推導出或在開啟期間保留的內容：已移除的實體、`seqColumnIds` 和 `seqIndexColumnIds`、所有 `zIndex`、測量出的寬度、欄位的 `ui`，以及關聯的 `identification`、`startRelationshipType` 和錨點。下方的型別將這些屬性都標示為 `// runtime only`。  
每個集合都以 id 為鍵，並依碼元順序排列，其中欄位先依 `tableId` 分組，索引欄位先依 `indexId` 分組。每個實體都以固定順序寫出其屬性，文字以兩個空格縮排，並以換行字元結尾。因此，同一份文件一律寫出相同的位元組，一次編輯只會變更它所涉及的內容，而在字型不同的電腦上儲存的檔案，重新開啟後也會得到相同的 `value`。  
VS Code、Obsidian 和 JetBrains 外掛程式只有在編輯變更了 `value` 時才會寫入檔案，因此較早版本所儲存的檔案會保持其舊形式，直到第一次編輯為止。

執行階段值會保留儲存形式所省略的內容：已移除的實體、序列、z-index、寬度、鍵標記、關聯旗標和錨點。它以兩個空格縮排，結尾沒有換行字元。只將它用於透過 `setInitialValue()` 初始化協作者或第二個檢視，讓另一個編輯器送來的移除復原能在那裡完整地還原該實體。請勿將它寫入檔案；JSON Schema 會拒絕它。已不再有任何機制回收已移除的實體，因此執行階段值會一直保留它們，直到下次從檔案開啟該文件為止。

兩種形式都會將每個鎖定的設定以其鎖定的值寫出（請參閱 [`lockSettings`](#settings)），只在有指令碼包含文字時寫出 `settings.ddlScripts`，並且只在資料表的 `groupId` 不為空時寫出它。儲存形式只在有資料表群組存在時寫出 `doc.tableGroupIds` 和 `tableGroupEntities`；執行階段值則在文件包含群組或已移除的群組時寫出它們。

## TypeScript {#typescript}

這些型別描述的是執行階段值。標示為 `// runtime only` 的屬性不會出現在儲存形式中，標示為 `?` 的屬性只在有內容時才會寫出。

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

每個實體都以其 `id` 為鍵，這是一個不透明的字串；剖析時會捨棄 `id` 不存在或為空的實體。自 `4.0.0` 起，每個新的 id 都是以 Uuid25 形式寫出的 UUIDv7，也就是 25 個小寫的 36 進位數字，例如 `03gzrxjv20bdlcak89q25d2m7`，因此同一個編輯器產生的 id 會依其產生的順序排序。文件會保留它所包含的 id，例如較早版本的 nanoid id 或 v2 檔案的 id，因此任何程式都不應依賴 id 的形式。

自 `4.0.0` 起，實體不再帶有 `meta` 物件（`createAt`、`updateAt`），`EntityMeta` 和 `EntityType` 型別也已移除。不會有任何地方寫出它，剖析時會捨棄舊檔案所帶有的 `meta`，JSON Schema 也會拒絕它。它原本只用於為已移除實體的垃圾回收計時，而垃圾回收也已一併移除。

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

`originX` 和 `originY` 是檢視：場景的 `(0, 0)` 落在螢幕上的那個點。  
`zoomLevel` 的範圍為 `0.1` 到 `1.5`。儲存時超過 `1` 的文件，在 `3.5.0` 之前的編輯器中會以 `1` 開啟。  
自 `4.0.0` 起，設定不再帶有 `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization` 或 `ignoreSaveSettings`。不會有任何地方寫出它們，剖析器不會保留其中任何一個，JSON Schema 也會拒絕仍帶有它們的檔案。

`canvasType` 是文件開啟時所在的索引標籤。在「視覺化」索引標籤上儲存的文件會保存 `'@dineug/erd-editor/builtin-visualization'`，但不會保存當時顯示的是 `Graph` 還是 `Flow` 模式，而新建立的編輯器會以 `Graph` 模式顯示該索引標籤。  
自 `4.0.0` 起，當 `Canvas Type` 鎖定開啟時（新文件即是如此），文件會保留鎖定時所顯示的索引標籤，切換索引標籤時 `value` 也會維持原樣。在「設定」索引標籤上進行的鎖定，會保留讀者進入該索引標籤之前所在的索引標籤，而鎖定的 `'settings'`（只有手動編輯才能寫入）會以 `'ERD'` 開啟。  
`Flow` 模式自身的狀態都不會序列化（其排列、縮放、平移、列顯示和聚焦的資料表都只保留在編輯器中），因此 `originX`、`originY` 和 `zoomLevel` 一律描述 ERD 畫布。

`show` 和 `lockSettings` 是位元遮罩：將各旗標以 OR 組合。  
`columnOrder` 是一個陣列，依顯示順序保存全部七個 `ColumnType` 值。  
`database`、`language`、`tableNameCase`、`columnNameCase` 和 `bracketType` 各自只保存一個值，JSON Schema 會拒絕組合後的值。

新文件的 `show` 為 `431`：`tableComment`、`columnComment`、`columnDataType`、`columnDefault`、`columnPrimaryKey`、`columnNotNull` 和 `relationship`。  
自 `3.10.0` 起，`show` 新增了兩個旗標，在新文件和 `3.10.0` 之前儲存的每份文件中都是關閉的。  
`columnAlternateKey`（`512`）是 [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) 檢視選項。設定後，每個涵蓋兩個或以上欄位的唯一索引，其欄位會標示為 `AK1.1`、`AK1.2`，依此類推。它預設為關閉，因此現有的圖表都不會改變寬度。  
`hideReferentialAction`（`1024`）的作用正好相反：設定後，它會隱藏連接線上的 [ON DELETE 與 ON UPDATE 標籤](../../guide/guides/relationship-editing.md#reading-a-connector)，因此這些標籤預設會顯示。此旗標關閉時，`Referential Actions` 檢視選項為勾選狀態。它不會改變任何資料表的大小。  
`3.10.0` 之前的編輯器會將 `show` 當作一個完整的數字保留，因此在其中儲存後，這兩個旗標仍會保留。

自 `4.0.0` 起，`show` 又新增了兩個旗標，在新文件和 `4.0.0` 之前儲存的每份文件中都是關閉的。與 `hideReferentialAction` 一樣，每個旗標都會隱藏其名稱所指的內容，因此資料表群組和備忘錄預設會顯示。  
`hideTableGroup`（`2048`）會隱藏[資料表群組](../../guide/guides/table-groups.md)，`hideMemo`（`4096`）會隱藏所有備忘錄。它們就是 `Table Groups` 和 `Memos` [檢視選項](../../guide/guides/table-related-functions.md#table-view-options)，各自在其旗標關閉時為勾選狀態。兩者都不會改變任何資料表的大小。  
`4.0.0` 之前的編輯器會將 `show` 當作一個完整的數字保留，因此在其中儲存後，這兩個旗標仍會保留。

自 `4.0.0` 起，`Language` 新增了八種[程式碼產生器](../../guide/guides/code-generator.md)目標，從 `Mermaid` 到 `JSONSchema`。剖析器不認得的 `language` 會讀作 `GraphQL`，因此 `4.0.0` 之前的編輯器會以 GraphQL 開啟以其中某種目標儲存的文件，而在其中儲存則會寫出 GraphQL。

自 `4.0.0` 起，`lockSettings` 取代了 `ignoreSaveSettings`，`LockSettingType` 則取代了已移除的 `SaveSettingType`。`lockSettings` 指定文件要以鎖定當時的狀態儲存哪些設定。`viewport` 同時涵蓋 `originX`、`originY` 和 `zoomLevel`，因為未連同縮放比例一起儲存的原點會在別處開啟；其他每個位元則涵蓋與其同名的屬性。這些就是「設定」索引標籤中的 [`Lock`](../../guide/guides/settings.md#lock) 各列。  
無論編輯器顯示的是什麼，鎖定的設定都會以其鎖定的值寫出，`value` 和 `runtimeValue` 皆是如此；其他所有設定則依其目前的狀態寫出。因此，在對應的鎖定開啟期間，捲動和縮放、切換索引標籤，或變更程式碼產生器的語言、某種名稱大小寫或引號類型，都會讓檔案維持原樣。鎖定時會取用該設定在當下的值，而剖析時會從已儲存的屬性中取得鎖定的值。  
從無到有建立的文件（新的編輯器或複寫存放區，或指定給 `value` 或 `setInitialValue()` 的空白值）的 `lockSettings` 會設為 `63`，也就是所有鎖定都開啟。`settings` 未帶有 `lockSettings` 的文件（`4.0.0` 之前儲存的每個檔案，無論其 `ignoreSaveSettings` 為何，以及每份 v2 文件）開啟時同樣會開啟所有鎖定：其檢視和索引標籤與新文件相同（`originX` 和 `originY` 為 `0`、`zoomLevel` 為 `1`、ERD 索引標籤），其語言、名稱大小寫和引號類型則鎖定為它所儲存的值。指定了鎖定的文件會保留這些鎖定（包括 `0`），以及它所儲存的每個值。  
剖析時會保留 `lockSettings` 的每個位元，包括未知的位元，因此較新版本新增的鎖定在這裡儲存後仍會保留；JSON Schema 只會檢查它是否為整數。`4.0.0` 之前的編輯器在儲存時會捨棄 `lockSettings`，並依目前的狀態寫出檢視和索引標籤，因此該檔案在這裡再次開啟時，會被視為在 `4.0.0` 之前儲存的檔案。

自 `4.0.0` 起，`ddlScripts` 保存「[結構描述 SQL](../../guide/guides/schema-sql.md)」索引標籤的兩段指令碼，每種資料庫的 DDL 都會寫出它們：`before` 寫在標頭之後、資料表之前，`after` 寫在產生的 DDL 之後。DDL 寫出每段指令碼時會使用 LF 換行，去除其開頭的空白行和結尾的空白字元，並在 MSSQL 上以 `GO` 結尾，如[前置與後置指令碼](../../guide/guides/schema-sql.md#before-and-after-scripts)所述；`ddlScripts` 本身則會依輸入的原樣保存每段指令碼。只有在任一段指令碼包含文字時才會寫出此鍵，而且此時兩段都會寫出；缺少此鍵，或指令碼不是字串時，會讀作 `''`。該索引標籤中 `Statements`、`Header` 和 `Tables` 的選擇不會儲存在文件中。  
`4.0.0` 之前的編輯器在載入文件時會捨棄這些指令碼，因此在其中儲存會遺失它們。

`Database`、`Language`、`Show`、`LockSettingType` 和 `ReferentialAction` 只會附加新值。已儲存的文件保存的是數字，因此新的資料庫廠商、程式碼產生目標、旗標、鎖定或動作會使用下一個位元，而不會佔用中間的位置。

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

每個清單都是某一種實體的順序，DDL、資料表排序和繪製順序都會讀取它。在儲存形式中，每個清單只包含保留下來的實體的 id，每個 id 只出現一次，並依列出的順序排列。自 `4.0.0` 起，`tableGroupIds` 是資料表群組的順序。

自 `4.0.0` 起，堆疊順序不會儲存。剖析時，每個列出且未帶有 `zIndex` 的資料表、備忘錄和資料表群組，會依其在所屬清單中的位置堆疊，越後面的越在前方：資料表群組從 `1` 開始，資料表從 `2` 開始，備忘錄則位於所有資料表之上。帶有 `zIndex` 的實體（例如執行階段值中，或 `4.0.0` 之前儲存的檔案中的實體）會保留它。因此，將資料表或備忘錄移到最前面的操作，會在重新開啟檔案時遺失。

### 集合：tableEntities {#collection-tableentities}

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

自 `4.0.0` 起，資料表會帶有 `groupId`，也就是它所屬[資料表群組](../../guide/guides/table-groups.md)的 id。缺少或為空的 `groupId`，或未指向 `doc.tableGroupIds` 中任何群組的 `groupId`，都表示不屬於任何群組，而儲存形式只在它指向保留下來的群組時才會寫出它。  
當 `seqColumnIds` 不存在或缺少某個列出的 id 時，剖析會以 `columnIds` 作為其初始值，而編輯器每次載入時都會以自己的字型重新測量 `widthName` 和 `widthComment`。

### 集合：tableColumnEntities {#collection-tablecolumnentities}

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

自 `4.0.0` 起，儲存形式不會寫出欄位的 `ui`。每次載入時都會推導出 `keys`（主鍵標記取自 `options` 的 `primaryKey` 位元，外鍵標記取自以該欄位為終點的關聯），並測量四個寬度。  
`4.0.0` 之前的編輯器在顯示這裡儲存的檔案時，其中的欄位不會帶有主鍵圖示。

### 集合：relationshipEntities {#collection-relationshipentities}

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

自 `3.10.0` 起，關聯會帶有 `onDelete` 和 `onUpdate`，也就是它的 [ON DELETE 與 ON UPDATE 動作](../../guide/guides/relationship-editing.md#on-delete-and-on-update)。兩者各自只保存一個 `ReferentialAction` 值。預設值 `none` 不會寫出任何子句，因此會套用資料庫本身的預設行為。其他五個值分別代表 `NO ACTION`、`CASCADE`、`SET NULL`、`SET DEFAULT` 和 `RESTRICT`。結構描述 SQL 只會為接受該動作的資料庫寫出子句。  
儲存形式一律會寫出這兩者，而且自 `4.0.0` 起，JSON Schema 要求必須有這兩者，但只檢查各自是否為整數。剖析時仍會將缺少的屬性（`3.10.0` 之前儲存的每份文件皆是如此）讀作 `none`，不在清單中的值也是如此。  
`3.10.0` 之前的編輯器不認得這兩個屬性，會在載入文件時將其捨棄，因此在其中儲存會遺失所有動作。

自 `4.0.0` 起，每次載入時都會推導出儲存形式所省略的內容。當關聯所連到的每個終點欄位都是主鍵時，該關聯為識別關聯，而當所有這些欄位都是 NOT NULL 時，其 `startRelationshipType` 為 `dash`，否則為 `ring`；已沒有任何終點欄位的關聯則為非識別關聯且為 `dash`，與新關聯的初始狀態相同。錨點 `x`、`y` 和 `direction` 會重新放置。

### 集合：indexEntities {#collection-indexentities}

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

當 `seqIndexColumnIds` 不存在或缺少某個列出的 id 時，剖析會以 `indexColumnIds` 作為其初始值。

### 集合：indexColumnEntities {#collection-indexcolumnentities}

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

### 集合：memoEntities {#collection-memoentities}

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

自 `4.0.0` 起，資料表和備忘錄[共用同一個堆疊](../../guide/guides/table-related-functions.md#moving-multiple-tables)，並依 `zIndex` 排序，因此將資料表移到最前面時，可能會讓它位於備忘錄之上。剖析時，儲存時未帶有 `zIndex` 的備忘錄會堆疊在所有資料表之上，如 [Doc](#doc) 所述。`4.0.0` 之前儲存的檔案中的備忘錄會保留它所儲存的 `zIndex`，該值與資料表的 `zIndex` 來自同一個計數器，因此較早版本繪製在所有資料表之上的備忘錄，開啟時可能會位於在它之後才移到最前面的資料表之下。

### 集合：tableGroupEntities {#collection-tablegroupentities}

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

自 `4.0.0` 起，文件可以包含[資料表群組](../../guide/guides/table-groups.md)：繪製在資料表後方、具有名稱和顏色的矩形。資料表透過自身的 `groupId` 加入群組，因此群組不會保存成員清單。與 `doc.tableGroupIds` 一樣，儲存形式只在有群組存在時才會寫出此集合，而沒有此集合的文件（例如 `4.0.0` 之前儲存的文件）沒有任何群組。`Show.hideTableGroup` 會隱藏它們。  
`4.0.0` 之前的編輯器在載入文件時會捨棄群組和每個資料表的 `groupId`，因此在其中儲存會遺失所有群組。

## JSON Schema {#json-schema}

標準的結構描述檔案發佈在 [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)，並可透過 `$schema` 直接參照。

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

在 `.erd.json` 檔案的最上方加入 `$schema`，支援 JSON Schema 的編輯器（例如 VS Code）就會在編輯時驗證文件並自動完成其屬性。

自 `4.0.0` 起，此結構描述只描述儲存形式。每個具有具名屬性的物件都是封閉的（`additionalProperties: false`），儲存形式一律會寫出的每個屬性都是必要的，而它省略的屬性一個都不會列出。因此，它會拒絕執行階段值。它也會拒絕 `4.0.0` 之前儲存的檔案（其中帶有 `meta`、寬度、`zIndex`、`ignoreSaveSettings` 等），直到 `4.0.0` 或更新版本的編輯器重新儲存該檔案為止。`3.2.0` 或更新版本所儲存的檔案已經指定了此結構描述的 URL，而該 URL 指向 `main` 分支，因此依據它進行驗證的編輯器現在就會標示出該檔案的問題。`3.0.0` 或 `3.1.0` 所儲存的檔案，或 v2 文件，都不會指定 `$schema`。

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
