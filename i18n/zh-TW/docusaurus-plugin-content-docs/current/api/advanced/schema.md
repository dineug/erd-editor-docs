---
sidebar_position: 3
description: .erd.json 文件格式：檔案所保存的儲存形式與編輯器所持有的執行階段值、TypeScript 型別、各數值屬性背後的常數和已發佈的 JSON Schema。
---

# 結構描述

`.erd.json` 是編輯器的文件格式。若需要在編輯器之外產生、驗證或移轉文件，可閱讀本頁。

自 `4.0.0` 起，文件有兩種序列化形式，兩者的 `version` 都是 `'3.0.0'`。儲存形式是檔案所保存的內容：它是 [`editor.value`](../erd-editor-element.md#value) 傳回的內容、JSON 匯出所寫入的內容，也是已發佈的 [JSON Schema](#json-schema) 唯一接受的形式。執行階段值是編輯器所持有的完整文件，由 [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) 傳回。`setInitialValue()`、`value` 的 setter 和 `setSchemaJSON()` 都能讀取這兩種形式、較早版本所儲存的任何檔案和 v2 的 `.vuerd` 文件。在 `4.0.0` 之前只有一種：`value` 傳回編輯器所持有的完整文件，就像現在的 `runtimeValue` 一樣。

## 儲存形式與執行階段值 {#storage-form-and-runtime-value}

儲存形式只保存現存的實體：`doc.tableIds` 中列出的每個資料表、這些資料表所列出的欄位、連接兩個保留下來的資料表的關聯、保留下來的資料表的索引及其所指欄位仍列在該資料表中的索引欄位、列出的備忘錄和資料表群組，以及自 `4.2.0` 起，已列出且在 id 之外還有其他值的詞彙、術語和定義域。它會省略編輯器在載入時推導出或在開啟期間保留的內容：已移除的實體、`seqColumnIds` 和 `seqIndexColumnIds`、所有 `zIndex`、測量出的寬度、欄位的 `ui`、關聯的 `identification`、`startRelationshipType` 和錨點，以及自 `4.2.0` 起每個字典列的 `order` 和 `doc.wordIds`、`doc.termIds`、`doc.domainIds` 這三個清單。下方的型別將這些屬性都標示為 `// runtime only`。  
除了字典之外，每個集合都以 id 為鍵，並依碼元順序排列，其中欄位先依 `tableId` 分組，索引欄位先依 `indexId` 分組。自 `4.2.0` 起，`wordEntities`、`termEntities` 和 `domainEntities` 會依此順序排在其他所有集合之後，每個都寫成一個標頭和多列，每列佔一行（請參閱[字典列](#dictionary-rows)）。每個實體都以固定順序寫出其屬性，文字以兩個空格縮排，並以換行字元結尾。因此，同一份文件一律寫出相同的位元組，一次編輯只會變更它所涉及的內容，而在字型不同的電腦上儲存的檔案，重新開啟後也會得到相同的 `value`。  
VS Code、Obsidian 和 JetBrains 外掛程式只有在編輯變更了 `value` 時才會寫入檔案，因此較早版本所儲存的檔案會保持其舊形式，直到第一次編輯為止。

自 `4.2.0` 起，儲存形式也會省略沒有任何內容的部分：實體或其 `ui` 以 `''` 保存的每個文字屬性（資料表的 `name`、`comment` 和 `ui.color`，欄位的 `name`、`comment`、`dataType` 和 `default`，索引的 `name`，備忘錄的 `value` 和 `ui.color`，資料表群組的 `name` 和 `color`）、沒有任何項目的每個 `doc` 清單和集合，以及在每個集合都為空時的 `collections` 本身。只有空白字元的文字會依保存的原樣寫出，但邏輯名稱例外，此時會被省略；而 id 之外的值全都為空或只有空白字元的詞彙、術語或定義域，則會整個被省略。每個 id、實體中的每個清單，以及每個數字（包括 `0`）仍會寫出。`doc` 一律會寫出，因此新文件的檔案包含 `$schema`、`version`、其設定和 `"doc": {}`。  
剖析時會將缺少的文字屬性讀作 `''`，將缺少的集合讀作空的，每個 v3 版本都是如此，而儲存形式只在 `doc` 清單的集合沒有任何內容時才會省略該清單（請參閱 [Doc](#doc)）。因此，`4.2.0` 之前的編輯器也能開啟這些檔案，而自行讀取檔案的程式也必須以相同方式讀取缺少的部分。較早版本儲存的檔案在下一次儲存時，其空的文字、清單和集合會被省略，這項變更只會發生一次，此後每次儲存都會逐位元組相同。

執行階段值會保留儲存形式所省略的內容：已移除的實體、序列、z-index、寬度、鍵標記、關聯旗標和錨點、空的文字屬性，以及即使為空也會保留的 `tableIds`、`relationshipIds`、`indexIds` 和 `memoIds` 這四個清單與 `tableEntities` 到 `memoEntities` 這六個集合。自 `4.2.0` 起，它也會保留已移除的詞彙、術語和定義域、沒有任何內容的列、每列的 `order`、三個字典清單、只有空白字元的邏輯名稱，以及指向已移除定義域的連結。它以兩個空格縮排，結尾沒有換行字元。只將它用於透過 `setInitialValue()` 初始化協作者或第二個檢視，讓另一個編輯器送來的移除復原能在那裡完整地還原該實體。請勿將它寫入檔案；JSON Schema 會拒絕它。已不再有任何機制回收已移除的實體，因此執行階段值會一直保留它們，直到下次從檔案開啟該文件為止。

兩種形式都會將每個鎖定的設定以其鎖定的值寫出（請參閱 [`lockSettings`](#settings)），只在有指令碼包含文字時寫出 `settings.ddlScripts`，並且只在資料表的 `groupId` 不為空時寫出它。自 `4.2.0` 起，兩者也只在所寫出的值不是 `'physical'` 時寫出 `settings.nameViewMode`，在可行時以七個項目寫出 `settings.columnOrder`（請參閱 [Settings](#settings)），並且只在資料表的 `nameDerived` 為 `true` 時寫出它。  
儲存形式只在有資料表群組存在時寫出 `doc.tableGroupIds` 和 `tableGroupEntities`，只在 `logicalName` 包含空白字元以外的文字時寫出它，只在欄位的 `domainId` 指向檔案會寫出的定義域時寫出它，並且只在字典包含檔案會寫出的列時寫出該字典。執行階段值則在文件包含群組或已移除的群組時寫出資料表群組的屬性，在 `logicalName` 和 `domainId` 不為 `''` 時寫出它們，並在字典或其清單任一個包含項目（包括已移除的列）時，寫出該字典及其清單。

## TypeScript {#typescript}

這些型別描述的是執行階段值。標示為 `// runtime only` 的屬性不會出現在儲存形式中，標示為 `?` 的屬性只在有內容時才會寫出。自 `4.2.0` 起儲存形式所省略的空文字、清單和集合並未標示。

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
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

每個實體都有一個 `id`，這是一個不透明的字串，用作它在其集合中的鍵，但三個字典例外，在字典中 `id` 是一列的第一個值。自 `4.2.0` 起，若七個以鍵索引的集合中某個實體的 `id` 不存在、為空或不是字串，剖析時會以它所在的鍵作為其 id 來讀取，並捨棄不是物件的項目，或沒有 id 且其鍵為 `''` 的項目。字典列若不是陣列，或其 `id` 不是 `''` 以外的字串，就會被捨棄。`4.2.0` 之前的編輯器會捨棄 `id` 不存在或為空的實體，因此儲存形式仍會寫出每個 id。  
自 `4.0.0` 起，每個新的 id（包括字典列的 id）都是以 Uuid25 形式寫出的 UUIDv7，也就是 25 個小寫的 36 進位數字，例如 `03gzrxjv20bdlcak89q25d2m7`，因此同一個編輯器產生的 id 會依其產生的順序排序。文件會保留它所包含的 id，例如較早版本的 nanoid id 或 v2 檔案的 id，因此任何程式都不應依賴 id 的形式。

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

`originX` 和 `originY` 是檢視：場景的 `(0, 0)` 落在螢幕上的那個點。  
`zoomLevel` 的範圍為 `0.1` 到 `1.5`。儲存時超過 `1` 的文件，在 `3.5.0` 之前的編輯器中會以 `1` 開啟。  
自 `4.0.0` 起，設定不再帶有 `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization` 或 `ignoreSaveSettings`。不會有任何地方寫出它們，剖析器不會保留其中任何一個，JSON Schema 也會拒絕仍帶有它們的檔案。

`canvasType` 是文件開啟時所在的索引標籤。在「視覺化」索引標籤上儲存的文件會保存 `'@dineug/erd-editor/builtin-visualization'`，但不會保存當時顯示的是 `Graph` 還是 `Flow` 模式，而新建立的編輯器會以 `Graph` 模式顯示該索引標籤。  
自 `4.0.0` 起，當 `Canvas Type` 鎖定開啟時（新文件即是如此），文件會保留鎖定時所顯示的索引標籤，切換索引標籤時 `value` 也會維持原樣。在「設定」索引標籤上進行的鎖定，會保留讀者進入該索引標籤之前所在的索引標籤，而鎖定的 `'settings'`（只有手動編輯才能寫入）會以 `'ERD'` 開啟。  
自 `4.2.0` 起，`canvasType` 也可以是 `'@dineug/erd-editor/builtin-dictionary'`，也就是[字典](../../guide/guides/dictionary.md)索引標籤，`Canvas Type` 鎖定會像保留其他索引標籤一樣保留它。`4.2.0` 之前的編輯器會保留該值，但在讀者選擇一個索引標籤之前，其工具列下方不會顯示任何索引標籤。  
`Flow` 模式自身的狀態都不會序列化：其排列、縮放、平移、列顯示和聚焦的資料表都只保留在編輯器中，而自 `4.2.0` 起，[`Previous table` 和 `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) 逐步瀏覽的各個檢視也是如此。因此，`originX`、`originY` 和 `zoomLevel` 一律描述 ERD 畫布。

`show` 和 `lockSettings` 是位元遮罩：將各旗標以 OR 組合。  
`columnOrder` 是一個陣列，依顯示順序保存每個 `ColumnType` 值各一次；自 `4.2.0` 起，文件可以只以九個值中的七個寫出它，如下方關於欄位順序的段落所述。  
`database`、`language`、`tableNameCase`、`columnNameCase` 和 `bracketType` 各自只保存一個值，JSON Schema 會拒絕組合後的值。

新文件的 `show` 為 `431`：`tableComment`、`columnComment`、`columnDataType`、`columnDefault`、`columnPrimaryKey`、`columnNotNull` 和 `relationship`。  
自 `3.10.0` 起，`show` 新增了兩個旗標，在新文件和 `3.10.0` 之前儲存的每份文件中都是關閉的。  
`columnAlternateKey`（`512`）是 [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) 檢視選項。設定後，每個涵蓋兩個或以上欄位的唯一索引，其欄位會標示為 `AK1.1`、`AK1.2`，依此類推。它預設為關閉，因此現有的圖表都不會改變寬度。  
`hideReferentialAction`（`1024`）的作用正好相反：設定後，它會隱藏連接線上的 [ON DELETE 與 ON UPDATE 標籤](../../guide/guides/relationship-editing.md#reading-a-connector)，因此這些標籤預設會顯示。此旗標關閉時，`Referential Actions` 檢視選項為勾選狀態。它不會改變任何資料表的大小。  
`3.10.0` 之前的編輯器會將 `show` 當作一個完整的數字保留，因此在其中儲存後，這兩個旗標仍會保留。

自 `4.0.0` 起，`show` 又新增了兩個旗標，在新文件和 `4.0.0` 之前儲存的每份文件中都是關閉的。與 `hideReferentialAction` 一樣，每個旗標都會隱藏其名稱所指的內容，因此資料表群組和備忘錄預設會顯示。  
`hideTableGroup`（`2048`）會隱藏[資料表群組](../../guide/guides/table-groups.md)，`hideMemo`（`4096`）會隱藏所有備忘錄。它們就是 `Table Groups` 和 `Memos` [檢視選項](../../guide/guides/table-related-functions.md#table-view-options)，各自在其旗標關閉時為勾選狀態。兩者都不會改變任何資料表的大小。  
`4.0.0` 之前的編輯器會將 `show` 當作一個完整的數字保留，因此在其中儲存後，這兩個旗標仍會保留。

自 `4.2.0` 起，`show` 又新增了一個旗標 `columnDomain`（`8192`），在新文件和 `4.2.0` 之前儲存的每份文件中都是關閉的，因此新文件的 `show` 仍為 `431`。它就是 `Domain` [檢視選項](../../guide/guides/table-related-functions.md#table-view-options)：設定後，每個欄位列都會顯示一個[定義域儲存格](../../guide/guides/logical-names.md#the-domain-cell)，讓資料表變寬。它預設為關閉，因此現有的圖表都不會改變寬度。  
`4.2.0` 之前的編輯器會將 `show` 當作一個完整的數字保留，因此在其中儲存後，該旗標仍會保留。

自 `4.2.0` 起，`ColumnType` 有九個值。`columnLogicalName`（`128`）決定邏輯名稱儲存格的位置，欄位列只在 `Both Names` 顯示方式下繪製該儲存格，而 `columnDomain`（`256`）決定定義域儲存格的位置。它們就是「設定」索引標籤[欄位順序](../../guide/guides/settings.md#adjusting-column-order)中的 `Logical Name` 和 `Domain` 列。編輯器保存的是全部九個值的順序，而新文件的順序為 `128, 1, 2, 256, 4, 8, 16, 32, 64`。  
當 `128` 緊接在 `columnName` 之前、`256` 緊接在 `columnDataType` 之後時，兩種形式都會省略 `128` 和 `256`，以七個項目寫出順序。因此，新文件仍會寫出 `1, 2, 4, 8, 16, 32, 64`，而順序中從未移動過這兩者的檔案會保持其位元組不變。否則，兩種形式都會寫出全部九個值。  
剖析時，無論那七個值的順序為何，都會將這兩個值放入七個項目之順序中的上述位置；若是包含每種類型的九個項目，則依原樣採用；其他任何內容則讀作預設順序。JSON Schema 接受七個或九個整數。

自 `4.0.0` 起，`Language` 新增了八種[程式碼產生器](../../guide/guides/code-generator.md)目標，從 `Mermaid` 到 `JSONSchema`。剖析器不認得的 `language` 會讀作 `GraphQL`，因此 `4.0.0` 之前的編輯器會以 GraphQL 開啟以其中某種目標儲存的文件，而在其中儲存則會寫出 GraphQL。

自 `4.0.0` 起，`lockSettings` 取代了 `ignoreSaveSettings`，`LockSettingType` 則取代了已移除的 `SaveSettingType`。`lockSettings` 指定文件要以鎖定當時的狀態儲存哪些設定。`viewport` 同時涵蓋 `originX`、`originY` 和 `zoomLevel`，因為未連同縮放比例一起儲存的原點會在別處開啟；其他每個位元則涵蓋與其同名的屬性。這些就是「設定」索引標籤中的 [`Lock`](../../guide/guides/settings.md#lock) 各列。  
無論編輯器顯示的是什麼，鎖定的設定都會以其鎖定的值寫出，`value` 和 `runtimeValue` 皆是如此；其他所有設定則依其目前的狀態寫出。因此，在對應的鎖定開啟期間，捲動和縮放、切換索引標籤、變更程式碼產生器的語言、某種名稱大小寫或引號類型，或切換「名稱顯示」，都會讓檔案維持原樣。鎖定時會取用該設定在當下的值，而剖析時會從已儲存的屬性中取得鎖定的值。  
從無到有建立的文件（新的編輯器或複寫存放區，或指定給 `value` 或 `setInitialValue()` 的空白值）的 `lockSettings` 會設為 `63`，也就是所有鎖定都開啟。`settings` 未帶有 `lockSettings` 的文件（`4.0.0` 之前儲存的每個檔案，無論其 `ignoreSaveSettings` 為何，以及每份 v2 文件）開啟時同樣會開啟所有鎖定：其檢視和索引標籤與新文件相同（`originX` 和 `originY` 為 `0`、`zoomLevel` 為 `1`、ERD 索引標籤），其語言、名稱大小寫和引號類型則鎖定為它所儲存的值。指定了鎖定的文件會保留這些鎖定（包括 `0`），以及它所儲存的每個值。  
剖析時會保留 `lockSettings` 的每個位元，包括未知的位元，因此較新版本新增的鎖定在這裡儲存後仍會保留；JSON Schema 只會檢查它是否為整數。`4.0.0` 之前的編輯器在儲存時會捨棄 `lockSettings`，並依目前的狀態寫出檢視和索引標籤，因此該檔案在這裡再次開啟時，會被視為在 `4.0.0` 之前儲存的檔案。

自 `4.2.0` 起有第七個鎖定 `unlockNameViewMode`（`64`），也就是 `Name View` 列，它涵蓋 `nameViewMode`。它的位元與其他鎖定位元的意義相反，就像 `Show` 的隱藏位元一樣：設定時，「名稱顯示」為解除鎖定，清除時則為鎖定。因此 `63` 仍表示所有鎖定都開啟，而新文件保存的就是這個值，其「名稱顯示」鎖定在 `'physical'`。在 `4.2.0` 之前儲存的檔案，無論其他鎖定為何（包括 `0`），此位元都是清除的，因此開啟時「名稱顯示」會鎖定在 `'physical'`。所有鎖定都關閉的文件保存的是 `64`，而其他所有鎖定都開啟、「名稱顯示」解除鎖定的文件保存的是 `127`。請以相反的方式判斷此鎖定：它在 `(lockSettings & 64) === 0` 時為開啟。  
此鎖定開啟期間，「名稱顯示」的切換只會變更做出切換的編輯器的畫面，而文件會保留鎖定的顯示方式。此鎖定關閉期間，在可編輯的編輯器中所做的切換就是文件的切換，每位協作者都會隨之切換。無論哪種情況，唯讀編輯器的切換都只會變更它自己的畫面。請參閱 [`Lock`](../../guide/guides/settings.md#lock)。  
`4.0.0` 或 `4.1.0` 的編輯器在儲存時會保留此位元，但會捨棄 `nameViewMode`，因此文件在這裡重新開啟時會是 `'physical'`，而其鎖定維持原樣。

自 `4.0.0` 起，`ddlScripts` 保存「[結構描述 SQL](../../guide/guides/schema-sql.md)」索引標籤的兩段指令碼，每種資料庫的 DDL 都會寫出它們：`before` 寫在標頭之後、資料表之前，`after` 寫在產生的 DDL 之後。DDL 寫出每段指令碼時會使用 LF 換行，去除其開頭的空白行和結尾的空白字元，並在 MSSQL 上以 `GO` 結尾，如[前置與後置指令碼](../../guide/guides/schema-sql.md#before-and-after-scripts)所述；`ddlScripts` 本身則會依輸入的原樣保存每段指令碼。只有在任一段指令碼包含文字時才會寫出此鍵，而且此時兩段都會寫出；缺少此鍵，或指令碼不是字串時，會讀作 `''`。該索引標籤中 `Statements`、`Header` 和 `Tables` 的選擇，以及自 `4.2.0` 起的 [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) 開關，都不會儲存在文件中。  
`4.0.0` 之前的編輯器在載入文件時會捨棄這些指令碼，因此在其中儲存會遺失它們。

自 `4.2.0` 起，`nameViewMode` 就是[名稱顯示](../../guide/guides/logical-names.md#name-view)，也就是圖表所繪製的名稱：`'physical'` 為每個資料表和欄位的名稱，`'logical'` 為在名稱的位置顯示其邏輯名稱，`'both'` 則為邏輯名稱和名稱。選單將它們稱為 `Physical Names`、`Logical Names` 和 `Both Names`。兩種形式都會將它寫在最後，在 `ddlScripts` 之後，而且只在所寫出的值不是 `'physical'` 時寫出；`Name View` 鎖定開啟期間，該值就是鎖定的值，無論畫面顯示的是什麼。缺少的值，或剖析器不認得的值，會讀作 `'physical'`，而 JSON Schema 只接受 `"logical"` 和 `"both"`。  
`4.2.0` 之前的編輯器在載入文件時會捨棄 `nameViewMode`。

`Database`、`Language`、`Show`、`ColumnType`、`ColumnOption`、`LockSettingType` 和 `ReferentialAction` 只會附加新值。已儲存的文件保存的是數字，因此新的資料庫廠商、程式碼產生目標、旗標、欄位類型、欄位選項、鎖定或動作會使用下一個位元，而不會佔用中間的位置。

### Doc {#doc}

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

前五個清單各自是某一種實體的順序，DDL、資料表排序和繪製順序都會讀取它。在儲存形式中，每個清單只包含保留下來的實體的 id，每個 id 只出現一次，並依列出的順序排列，而自 `4.2.0` 起，不包含任何 id 的清單會被省略。自 `4.0.0` 起，`tableGroupIds` 是資料表群組的順序。

自 `4.2.0` 起，`wordIds`、`termIds` 和 `domainIds` 列出每個字典中現存的列：集合中有但清單中沒有的列即為已移除。它們不是工作表的順序，工作表的順序由每列的 `order` 決定。只有執行階段值會寫出它們，且各自只在它本身或其集合包含項目時寫出。檔案中的列本身就決定了哪些列存在以及其順序，而 JSON Schema 會拒絕這些清單。  
自 `4.2.0` 起，若文件省略某個清單，或以陣列以外的形式保存它，剖析時會將該清單讀作其集合所包含的每個項目，每個 id 一次，並依保存的順序排列；空陣列則維持為空，此時其集合中的每個項目都會讀作已移除。`4.2.0` 之前的編輯器會將缺少的清單讀作空的，因此只要集合包含實體，儲存形式仍會寫出對應的清單。

自 `4.0.0` 起，堆疊順序不會儲存。剖析時，每個列出且未帶有 `zIndex` 的資料表、備忘錄和資料表群組，會依其在所屬清單中的位置堆疊，越後面的越在前方：資料表群組從 `1` 開始，資料表從 `2` 開始，備忘錄則位於所有資料表之上。帶有 `zIndex` 的實體（例如執行階段值中，或 `4.0.0` 之前儲存的檔案中的實體）會保留它。因此，將資料表或備忘錄移到最前面的操作，會在重新開啟檔案時遺失。

### 集合：tableEntities {#collection-tableentities}

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

自 `4.0.0` 起，資料表會帶有 `groupId`，也就是它所屬[資料表群組](../../guide/guides/table-groups.md)的 id。缺少或為空的 `groupId`，或未指向 `doc.tableGroupIds` 中任何群組的 `groupId`，都表示不屬於任何群組，而儲存形式只在它指向保留下來的群組時才會寫出它。  
當 `seqColumnIds` 不存在或缺少某個列出的 id 時，剖析會以 `columnIds` 作為其初始值，而編輯器每次載入時都會以自己的字型重新測量 `widthName`、`widthLogicalName` 和 `widthComment`。

自 `4.2.0` 起，資料表會帶有 `logicalName`，也就是 `Logical Names` 和 `Both Names` [顯示方式](../../guide/guides/logical-names.md#name-view)所繪製的名稱，沒有時為 `''`；以及 `nameDerived`，在字典依邏輯名稱[產生](../../guide/guides/dictionary.md#deriving-physical-names) `name` 時為 `true`。它設定時，新的邏輯名稱會重新產生名稱；它未設定時，名稱是自行撰寫的名稱，新的邏輯名稱不會更動它，除非名稱為空或只有空白字元。手動重新命名會將它關閉，而 [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) 即使是自行撰寫的名稱也會重寫，並在有邏輯名稱的每個地方將它開啟。  
儲存形式會依輸入的原樣，在 `name` 之後寫出 `logicalName`，但只在它包含空白字元以外的文字時寫出；並在 `groupId` 之後寫出 `nameDerived`，但只在它為 `true` 時寫出，這也是 JSON Schema 唯一接受的值。缺少的 `logicalName` 會讀作 `''`，缺少的 `nameDerived` 會讀作 `false`，因此在 `4.2.0` 之前儲存的檔案中，每個名稱都算作自行撰寫的名稱。  
`4.2.0` 之前的編輯器在載入文件時會捨棄這兩者，因此在其中儲存會遺失每個資料表的邏輯名稱。

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

自 `4.0.0` 起，儲存形式不會寫出欄位的 `ui`。每次載入時都會推導出 `keys`（主鍵標記取自 `options` 的 `primaryKey` 位元，外鍵標記取自以該欄位為終點的關聯），並測量六個寬度。  
`4.0.0` 之前的編輯器在顯示這裡儲存的檔案時，其中的欄位不會帶有主鍵圖示。

自 `4.2.0` 起，欄位會像資料表一樣帶有 `logicalName`，以及 `domainId`，也就是它所連結的定義域的 id，沒有時為 `''`。如[定義域與資料類型](../../guide/guides/dictionary.md#domains-and-data-types)所述，單一編輯器中的編輯會讓已連結的欄位維持其定義域的資料類型。不過，剖析時不會變更任何欄位的類型，因此在別處寫出的檔案可能會讓已連結的欄位維持其他類型，兩位協作者交錯的編輯也可能如此；「檢查」工作表會將每一種情況列為 [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds)。剖析時會清除未指向文件中任何定義域的 `domainId`。已移除的定義域仍算在內，因此只要復原還能帶回該定義域，編輯器就會保留指向它的連結。在 `options` 之後，儲存形式會依資料表的規則寫出 `logicalName`，並只在 `domainId` 指向檔案會寫出的定義域時寫出它，因此絕不會寫出指向已移除定義域的連結。  
`ColumnOption.nameDerived`（`16`）是欄位的「名稱由字典產生」旗標，與其他位元一起保存在 `options` 中，意義與資料表的 `nameDerived` 相同。例如，名稱由字典產生且設為 Not Null 的主鍵，其 `options` 為 `26`。  
`4.2.0` 之前的編輯器在載入文件時會捨棄 `logicalName` 和 `domainId`，因此在其中儲存會遺失它們。它會將 `options` 當作一個完整的數字保留，因此在其中儲存後，`nameDerived` 位元仍會保留。

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

### 字典列 {#dictionary-rows}

自 `4.2.0` 起，文件保存三個字典，也就是[字典](../../guide/guides/dictionary.md)索引標籤的 `Words`、`Terms` 和 `Domains` 工作表，分別位於 `wordEntities`、`termEntities` 和 `domainEntities` 中。詞彙、術語或定義域的每個屬性都是字串，而且都沒有 `ui`。`Checks` 工作表是根據字典和圖表推算出來的，不會儲存。

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

這三者都不以 id 為鍵。每個都寫成一個標頭和多列：`fields` 列出實體的屬性名稱各一次，id 在最前面，而每一列依該順序保存一個實體的值。下方的型別依執行階段值的標頭順序列出每種實體的屬性。一列一律會保留其 id 和名稱，但名稱之後位於結尾的空值會被省略，因此位於某個保留值之前的空值仍為 `''`，而剖析時會將一列所缺少的值讀作 `''`。兩種形式都會將每一列以精簡的 JSON 各自寫成一行，如以下檔案中的兩個詞彙所示：

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

儲存形式會依工作表的順序寫出列出的列，並省略 `order`，因此其標頭不會列出它。它會省略 id 之外的值全都為空或只有空白字元的列（例如新增後從未填寫，或已被清空的列），以及指向這類定義域或已移除定義域的每個連結：欄位的 `domainId` 會被省略，術語的 `domainId` 則會寫成 `''`，而若該術語沒有其他內容，術語本身也會被省略。  
執行階段值的標頭會在 `"name"` 之後緊接著列出 `"order"`。它會依集合保存的順序寫出集合中的每一列（包括已移除的列），因此要取得工作表的順序，就依 `order` 排序，並以碼元順序比較。剖析時會依檔案中各列的排列順序為其指定 `order` 鍵，因此讀回時的順序與檔案寫出的順序相同。  
沒有字典的文件（例如在 `4.2.0` 之前儲存的文件）就沒有任何詞彙、術語或定義域。`4.2.0` 之前的編輯器在載入文件時會捨棄這三個字典，因此在其中儲存會遺失每個詞彙、術語和定義域。

### 集合：wordEntities {#collection-wordentities}

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

詞彙是組成邏輯名稱的其中一個詞，而 `abbreviation` 是在物理名稱中代表它的英文縮寫。`synonyms` 列出該詞彙的其他寫法，`forbiddenWords` 則列出不得用來代替它的詞，兩者都以逗號分隔。

### 集合：termEntities {#collection-termentities}

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

術語是一個完整的邏輯名稱。若資料表或欄位的 `logicalName` 與 `name` 相符，便會產生 `physicalName` 作為其名稱，若 `physicalName` 為空，則產生由各詞彙的英文縮寫組成的名稱，而欄位也會採用 `domainId` 所指向的定義域，沒有時為 `''`（請參閱[產生物理名稱](../../guide/guides/dictionary.md#deriving-physical-names)）。`synonyms` 以逗號分隔。剖析時會清除未指向任何定義域的 `domainId`，與欄位相同。

### 集合：domainEntities {#collection-domainentities}

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

定義域是具名的資料類型，`dataType` 以與欄位相同的方式保存它（包括長度），例如 `NUMERIC(10)`。欄位或術語會以 id 連結定義域，而編輯器會將定義域的資料類型賦予每個已連結的欄位（請參閱[定義域與資料類型](../../guide/guides/dictionary.md#domains-and-data-types)）。

## JSON Schema {#json-schema}

標準的結構描述檔案發佈在 [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)，並可透過 `$schema` 直接參照。

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

在 `.erd.json` 檔案的最上方加入 `$schema`，支援 JSON Schema 的編輯器（例如 VS Code）就會在編輯時驗證文件並自動完成其屬性。

自 `4.0.0` 起，此結構描述只描述儲存形式。每個具有具名屬性的物件都是封閉的（`additionalProperties: false`），儲存形式一律會寫出的每個屬性都是必要的，它在沒有內容時會省略的屬性會列出但不是必要的，而它一律省略的屬性一個都不會列出。因此，它會拒絕執行階段值。它也會拒絕 `4.0.0` 之前儲存的檔案（其中帶有 `meta`、寬度、`zIndex`、`ignoreSaveSettings` 等），直到 `4.0.0` 或更新版本的編輯器重新儲存該檔案為止。`3.2.0` 或更新版本所儲存的檔案已經指定了此結構描述的 URL，而該 URL 指向 `main` 分支，因此依據它進行驗證的編輯器現在就會標示出該檔案的問題。`3.0.0` 或 `3.1.0` 所儲存的檔案，或 v2 文件，都不會指定 `$schema`。

自 `4.2.0` 起，此結構描述不再將實體的文字屬性、任何 `doc` 清單、任何集合或 `collections` 本身列為必要，這些在沒有內容時都會被儲存形式省略。它仍接受 `4.0.0` 或 `4.1.0` 所儲存的檔案。它列出了新的屬性：只接受 `"logical"` 和 `"both"` 的 `nameViewMode`；資料表的 `logicalName` 和只接受 `true` 的 `nameDerived`；欄位的 `logicalName` 和 `domainId`；以及三個字典，每個都有其標頭和由字串組成的列。`canvasType` 列出了「字典」索引標籤，`columnOrder` 接受七個或九個整數，而 `show`、`columnOrder`、`lockSettings` 和 `options` 的說明也列出了新的位元。

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
