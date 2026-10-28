---
sidebar_position: 3
description: .erd.json 문서 형식 — 파일에 담기는 저장 형태와 에디터가 가진 런타임 값, TypeScript 타입, 숫자 필드별 상수, 게시된 JSON Schema.
---

# Schema

`.erd.json`은 에디터의 문서 형식입니다. 에디터 밖에서 문서를 생성하거나 검증하거나 마이그레이션해야 한다면 이 문서를 참고하세요.

`4.0.0`부터 문서에는 두 가지 직렬화 형태가 있으며, 둘 다 `version`은 `'3.0.0'`입니다. 저장 형태는 파일에 담기는 형태로, [`editor.value`](../erd-editor-element.md#value)가 반환하고 JSON 내보내기가 기록하며, 게시된 [JSON Schema](#json-schema)가 받아들이는 유일한 형태입니다. 런타임 값은 에디터가 가지고 있는 그대로의 문서 전체이며, [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue)가 반환합니다. `setInitialValue()`, `value` setter, `setSchemaJSON()`은 두 형태와 이전 릴리스가 저장한 모든 파일, v2 `.vuerd` 문서를 모두 읽습니다. `4.0.0` 이전에는 한 가지뿐이었으며, 지금의 `runtimeValue`처럼 `value`가 에디터가 가지고 있는 그대로의 문서 전체를 반환했습니다.

## 저장 형태와 런타임 값

저장 형태에는 삭제되지 않은 엔티티만 담깁니다. `doc.tableIds`에 나열된 각 테이블, 그 테이블들이 나열한 컬럼, 남아 있는 두 테이블 사이의 관계, 남아 있는 테이블의 인덱스와 그 테이블이 아직 나열하고 있는 컬럼을 가리키는 인덱스 컬럼, 나열된 메모와 테이블 그룹, 그리고 `4.2.0`부터는 id 외의 값을 하나라도 가진 나열된 단어, 용어, 도메인입니다. 에디터가 불러올 때 계산하거나 열려 있는 동안에만 가지고 있는 것은 제외됩니다. 삭제된 엔티티, `seqColumnIds`와 `seqIndexColumnIds`, 모든 `zIndex`, 측정된 너비, 컬럼 `ui`, 관계의 `identification`, `startRelationshipType`, 앵커, 그리고 `4.2.0`부터는 각 사전 행의 `order`와 `doc.wordIds`, `doc.termIds`, `doc.domainIds` 목록이 여기에 해당합니다. 아래 타입에서는 이 필드마다 `// runtime only`가 표시되어 있습니다.  
사전을 제외한 모든 컬렉션은 id의 코드 유닛 순서로 키가 정렬되며, 컬럼은 먼저 `tableId`로, 인덱스 컬럼은 먼저 `indexId`로 묶입니다. `4.2.0`부터 `wordEntities`, `termEntities`, `domainEntities`는 다른 모든 컬렉션 뒤에 이 순서로 오며, 각각 헤더와 행으로, 한 줄에 행 하나씩 기록됩니다([사전 행](#dictionary-rows) 참고). 각 엔티티는 정해진 순서로 필드를 기록하며, 텍스트는 공백 두 칸으로 들여쓰고 줄바꿈으로 끝납니다. 따라서 같은 문서는 항상 같은 바이트로 기록되고, 편집은 그 편집이 닿는 부분만 바꾸며, 다른 폰트가 설치된 컴퓨터에서 저장한 파일도 같은 `value`로 다시 열립니다.  
VS Code, Obsidian, JetBrains 플러그인은 편집으로 `value`가 바뀔 때만 파일을 기록하므로, 이전 릴리스가 저장한 파일은 첫 편집 전까지 예전 형태를 유지합니다.

`4.2.0`부터 저장 형태는 아무것도 담지 않은 것도 제외합니다. 엔티티나 그 `ui`가 `''`로 가진 각 텍스트 필드(테이블의 `name`, `comment`, `ui.color`, 컬럼의 `name`, `comment`, `dataType`, `default`, 인덱스의 `name`, 메모의 `value`와 `ui.color`, 테이블 그룹의 `name`과 `color`), 항목이 하나도 없는 각 `doc` 목록과 컬렉션, 그리고 모든 컬렉션이 비면 `collections` 자체가 여기에 해당합니다. 공백만 있는 텍스트는 가진 그대로 기록됩니다. 다만 논리명은 이때 제외되며, id 외의 값이 모두 비어 있거나 공백뿐인 단어, 용어, 도메인은 통째로 제외됩니다. 모든 id, 엔티티 안의 모든 목록, `0`을 포함한 모든 숫자는 여전히 기록됩니다. `doc`은 항상 기록되므로, 새 문서의 파일에는 `$schema`, `version`, 설정, `"doc": {}`이 담깁니다.  
파싱할 때는 모든 v3 릴리스와 마찬가지로 없는 텍스트 필드를 `''`로, 없는 컬렉션을 비어 있는 것으로 읽으며, 저장 형태는 컬렉션에 아무것도 없는 동안에만 `doc` 목록을 제외합니다([Doc](#doc) 참고). 따라서 `4.2.0` 이전 에디터도 이 파일을 열 수 있으며, 파일을 직접 읽는 프로그램도 없는 것을 같은 방식으로 읽어야 합니다. 이전 릴리스가 저장한 파일은 다음 저장에서 비어 있는 텍스트, 목록, 컬렉션이 제외된 형태로 돌아오며, 이 변경은 한 번만 일어나고 그 뒤로는 바이트 단위까지 같게 저장됩니다.

런타임 값은 저장 형태가 제외하는 것, 즉 삭제된 엔티티, 시퀀스, z-index, 너비, 키 표시, 관계 플래그, 앵커, 비어 있는 텍스트 필드를 유지하며, `tableIds`, `relationshipIds`, `indexIds`, `memoIds` 네 목록과 `tableEntities`부터 `memoEntities`까지 여섯 컬렉션은 비어 있어도 유지합니다. `4.2.0`부터는 삭제된 단어, 용어, 도메인, 아무것도 담지 않은 행, 각 행의 `order`, 세 사전 목록, 공백뿐인 논리명, 삭제된 도메인으로의 연결도 유지합니다. 공백 두 칸으로 들여쓰며 끝에 줄바꿈이 없습니다. 런타임 값은 `setInitialValue()`로 공동 편집자나 두 번째 뷰를 초기화하는 데만 사용하세요. 그래야 다른 에디터가 보낸 삭제의 Undo가 그곳에서도 엔티티를 온전히 되살립니다. 파일에는 절대 기록하지 마세요. JSON Schema가 런타임 값을 거부합니다. 삭제된 엔티티는 더 이상 가비지 컬렉션되지 않으므로, 런타임 값은 다음에 파일에서 문서를 열 때까지 삭제된 엔티티를 유지합니다.

두 형태 모두 잠긴 설정은 잠긴 값으로 기록하고([`lockSettings`](#settings) 참고), `settings.ddlScripts`는 스크립트에 텍스트가 있을 때만, 테이블의 `groupId`는 비어 있지 않을 때만 기록합니다. `4.2.0`부터 두 형태는 `settings.nameViewMode`를 기록하는 값이 `'physical'`이 아닐 때만, `settings.columnOrder`를 가능한 경우 7개 항목으로([Settings](#settings) 참고), 테이블의 `nameDerived`를 `true`일 때만 기록합니다.  
저장 형태는 `doc.tableGroupIds`와 `tableGroupEntities`를 테이블 그룹이 있을 때만, `logicalName`을 공백 외의 텍스트가 있을 때만, 컬럼의 `domainId`를 파일이 기록하는 도메인을 가리킬 때만, 각 사전을 파일이 기록하는 행이 있을 때만 기록합니다. 런타임 값은 테이블 그룹 필드를 문서에 그룹이나 삭제된 그룹이 있는 동안, `logicalName`과 `domainId`를 `''`가 아닌 동안, 각 사전을 그 목록과 함께 둘 중 하나에 삭제된 행을 포함해 항목이 있는 동안 기록합니다.

## TypeScript

타입은 런타임 값을 기술합니다. `// runtime only`가 표시된 필드는 저장 형태에서 제외되며, `?`가 표시된 필드는 값이 있을 때만 기록됩니다. `4.2.0`부터 저장 형태가 제외하는 비어 있는 텍스트, 목록, 컬렉션은 따로 표시되어 있지 않습니다.

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

모든 엔티티는 불투명한 문자열인 `id`를 가지며, 이 id가 컬렉션에서 엔티티의 키가 됩니다. 다만 세 사전에서는 id가 행의 첫 번째 값입니다. `4.2.0`부터 파싱할 때 키로 구성된 일곱 컬렉션의 엔티티 중 `id`가 없거나 비어 있거나 문자열이 아닌 것은 그 엔티티가 놓인 키를 id로 삼아 읽으며, 객체가 아닌 항목과 id가 없으면서 키가 `''`인 항목은 버립니다. 사전 행은 배열이 아니거나 `id`가 `''`가 아닌 문자열이 아니면 버려집니다. `4.2.0` 이전 에디터는 `id`가 없거나 비어 있는 엔티티를 버리므로, 저장 형태는 여전히 모든 id를 기록합니다.  
`4.0.0`부터 사전 행의 id를 포함한 모든 새 id는 Uuid25 형식으로 쓴 UUIDv7로, `03gzrxjv20bdlcak89q25d2m7`처럼 소문자 36진수 25자리입니다. 따라서 한 에디터가 만든 id는 만든 순서대로 정렬됩니다. 문서는 이전 릴리스의 nanoid id나 v2 파일의 id처럼 이미 가지고 있는 id를 그대로 유지하므로, id의 모양에 의존해서는 안 됩니다.

`4.0.0`부터 엔티티는 `meta` 객체(`createAt`, `updateAt`)를 가지지 않으며, `EntityMeta`와 `EntityType` 타입은 제거되었습니다. 어디에서도 기록하지 않고, 파싱할 때 예전 파일에 있는 `meta`는 버려지며, JSON Schema는 이를 거부합니다. 이 객체는 삭제된 엔티티의 가비지 컬렉션 시점을 정하는 데만 쓰였으며, 가비지 컬렉션도 함께 사라졌습니다.

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

`originX`와 `originY`는 화면 위치, 즉 씬 좌표 `(0, 0)`이 화면에서 놓이는 지점입니다.  
`zoomLevel`은 `0.1`부터 `1.5`까지입니다. `1`을 넘겨 저장한 문서는 `3.5.0` 이전 에디터에서 `1`로 열립니다.  
`4.0.0`부터 설정에는 `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, `ignoreSaveSettings`가 없습니다. 어디에서도 기록하지 않고 파서는 이 중 어느 것도 유지하지 않으며, JSON Schema는 이 필드가 남아 있는 파일을 거부합니다.

`canvasType`은 문서가 열릴 때 표시되는 탭입니다. Visualization 탭에서 저장한 문서에는 `'@dineug/erd-editor/builtin-visualization'`이 기록되지만 `Graph`와 `Flow` 중 어느 모드가 표시되고 있었는지는 기록되지 않으며, 새로 만든 에디터는 이 탭을 `Graph` 모드로 표시합니다.  
`4.0.0`부터는 새 문서에서처럼 `Canvas Type` 잠금이 켜져 있는 동안 문서는 잠글 때 표시되던 탭을 유지하며, 탭을 전환해도 `value`는 그대로입니다. 설정 탭에서 잠그면 설정 탭으로 오기 전에 있던 탭이 잠기며, 직접 편집해야만 기록할 수 있는 잠긴 `'settings'`는 `'ERD'`로 열립니다.  
`4.2.0`부터 `canvasType`은 [사전](../../guide/guides/dictionary.md) 탭인 `'@dineug/erd-editor/builtin-dictionary'`일 수도 있으며, `Canvas Type` 잠금은 다른 탭과 마찬가지로 이 값을 담습니다. `4.2.0` 이전 에디터는 이 값을 유지하지만, 사용자가 탭을 고를 때까지 툴바 아래에 아무 탭도 표시하지 않습니다.  
`Flow` 모드 자체의 상태는 전혀 직렬화되지 않습니다. 배치, 확대/축소, 화면 이동, 행 표시, 포커스한 테이블은 에디터 안에만 남으며, `4.2.0`부터는 [`Previous table`과 `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table)이 한 단계씩 오가는 좁힌 범위도 마찬가지입니다. 따라서 `originX`, `originY`, `zoomLevel`은 항상 ERD 캔버스를 나타냅니다.

`show`와 `lockSettings`는 비트마스크이므로 플래그를 OR로 결합합니다.  
`columnOrder`는 모든 `ColumnType` 값을 한 번씩 담은 배열이며 표출 순서를 나타냅니다. `4.2.0`부터는 아래의 컬럼 순서 단락에서 설명하듯이 문서가 9개 중 7개 값만으로 이 배열을 기록할 수 있습니다.  
`database`, `language`, `tableNameCase`, `columnNameCase`, `bracketType`은 각각 정확히 하나의 값만 가지며, 결합된 값은 JSON Schema에서 거부됩니다.

새 문서의 `show`는 `431`로, `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull`, `relationship`을 합한 값입니다.  
`3.10.0`부터 `show` 플래그가 2개 더 있으며, 새 문서와 `3.10.0` 이전에 저장된 모든 문서에서 둘 다 꺼져 있습니다.  
`columnAlternateKey`(`512`)는 [`Alternate Key`](../../guide/guides/table-related-functions.md#대체-키) 보기 옵션입니다. 설정하면 두 개 이상의 컬럼으로 이루어진 각 unique 인덱스의 컬럼에 `AK1.1`, `AK1.2`와 같은 표시를 붙입니다. 처음에는 꺼져 있으므로 기존 다이어그램의 너비는 바뀌지 않습니다.  
`hideReferentialAction`(`1024`)는 반대로 동작합니다. 설정하면 연결선의 [ON DELETE와 ON UPDATE 라벨](../../guide/guides/relationship-editing.md#연결선-읽기)을 숨기므로, 기본적으로는 라벨이 표시됩니다. `Referential Actions` 보기 옵션은 이 플래그가 꺼져 있는 동안 체크되어 있습니다. 이 플래그는 테이블 크기를 바꾸지 않습니다.  
`3.10.0` 이전 에디터는 `show`를 숫자 그대로 유지하므로, 그 에디터에서 저장해도 두 플래그가 남아 있습니다.

`4.0.0`부터 `show` 플래그가 2개 더 있으며, 새 문서와 `4.0.0` 이전에 저장된 모든 문서에서 둘 다 꺼져 있습니다. `hideReferentialAction`처럼 두 플래그는 각각 이름이 가리키는 것을 숨기므로, 기본적으로는 테이블 그룹과 메모가 표시됩니다.  
`hideTableGroup`(`2048`)은 [테이블 그룹](../../guide/guides/table-groups.md)을, `hideMemo`(`4096`)는 모든 메모를 숨깁니다. 각각 `Table Groups`와 `Memos` [보기 옵션](../../guide/guides/table-related-functions.md#테이블-보기-옵션)이며, 각 옵션은 해당 플래그가 꺼져 있는 동안 체크되어 있습니다. 두 플래그 모두 테이블 크기를 바꾸지 않습니다.  
`4.0.0` 이전 에디터는 `show`를 숫자 그대로 유지하므로, 그 에디터에서 저장해도 두 플래그가 남아 있습니다.

`4.2.0`부터 `show` 플래그가 하나 더 있습니다. `columnDomain`(`8192`)은 새 문서와 `4.2.0` 이전에 저장된 모든 문서에서 꺼져 있으므로, 새 문서의 `show`는 여전히 `431`입니다. 이 플래그는 `Domain` [보기 옵션](../../guide/guides/table-related-functions.md#테이블-보기-옵션)입니다. 설정하면 각 컬럼 행에 [도메인 셀](../../guide/guides/logical-names.md#the-domain-cell)이 표시되며, 그만큼 테이블이 넓어집니다. 처음에는 꺼져 있으므로 기존 다이어그램의 너비는 바뀌지 않습니다.  
`4.2.0` 이전 에디터는 `show`를 숫자 그대로 유지하므로, 그 에디터에서 저장해도 이 플래그가 남아 있습니다.

`4.2.0`부터 `ColumnType`에는 9개의 값이 있습니다. `columnLogicalName`(`128`)은 컬럼 행이 `Both Names` 보기에서만 그리는 논리명 셀의 위치를, `columnDomain`(`256`)은 도메인 셀의 위치를 정합니다. 둘은 설정 탭 [컬럼 순서](../../guide/guides/settings.md#컬럼-순서-조정)의 `Logical Name`과 `Domain` 행입니다. 에디터는 9개 값을 모두 담은 순서를 가지며, 새 문서의 순서는 `128, 1, 2, 256, 4, 8, 16, 32, 64`입니다.  
두 형태 모두 `128`이 `columnName` 바로 앞에, `256`이 `columnDataType` 바로 뒤에 있는 동안에는 `128`과 `256`을 빼고 7개 항목으로 순서를 기록합니다. 따라서 새 문서는 여전히 `1, 2, 4, 8, 16, 32, 64`를 기록하며, 순서에서 두 값을 한 번도 옮기지 않은 파일은 바이트가 그대로 유지됩니다. 그 밖의 경우에는 9개 항목을 모두 기록합니다.  
파싱할 때는 7개 항목으로 된 순서라면 7개 값이 어떤 순서로 되어 있든 두 값을 그 자리에 넣고, 모든 타입을 담은 9개 항목은 그대로 받습니다.  
`5.0.0`부터는 그 밖의 순서도 받습니다. 알고 있는 `ColumnType`은 주어진 순서대로 한 번씩만 남기고 다른 항목은 모두 버립니다. 어떤 `ColumnType`도 가리키지 않는 값(이후 릴리스가 추가하는 타입 등)과 같은 타입의 두 번째 항목이 그렇습니다. 순서에 빠진 타입은 기본 순서에서 그 앞에 있는 타입 중 순서가 갖고 있는 가장 가까운 타입 바로 뒤에 들어가고, 앞에 있는 것이 없으면 뒤에 있는 가장 가까운 타입 바로 앞에 들어갑니다. 7개 항목에서 `128`과 `256`이 자리를 찾는 방식이 이것입니다. 아는 타입을 하나도 담지 않은 순서나 배열이 아닌 값만 기본 순서로 읽습니다.  
그래서 이후 릴리스가 저장한 파일은 이 릴리스가 아는 타입의 순서로 열리고, 여기서 저장하면 나머지를 뺀 그 순서가 기록됩니다. `5.0.0` 이전에는 그 밖의 순서를 기본 순서로 읽었으므로 그런 파일은 컬럼 순서가 초기화되어 열렸습니다. JSON Schema는 7개 또는 9개의 정수를 받습니다.

`4.0.0`부터 `Language`에는 `Mermaid`부터 `JSONSchema`까지 8개의 [Code Generator](../../guide/guides/code-generator.md) 대상이 더 있습니다. 파서가 알지 못하는 `language`는 `GraphQL`로 읽히므로, `4.0.0` 이전 에디터는 이 중 하나로 저장된 문서를 GraphQL로 열며, 그 에디터에서 저장하면 GraphQL이 기록됩니다.

`4.0.0`부터 `lockSettings`가 `ignoreSaveSettings`를, `LockSettingType`이 제거된 `SaveSettingType`을 대신합니다. `lockSettings`는 문서가 잠글 때의 값 그대로 저장하는 설정을 나타냅니다. 원점을 확대/축소 레벨 없이 저장하면 다른 곳에서 열리므로 `viewport`는 `originX`, `originY`, `zoomLevel`을 함께 다루며, 나머지 비트는 각각 이름과 같은 필드를 다룹니다. 이 비트들은 설정 탭 [`Lock`](../../guide/guides/settings.md#잠금) 목록의 각 행에 해당합니다.  
잠긴 설정은 에디터에 무엇이 표시되든 `value`와 `runtimeValue` 모두에서 잠긴 값으로 기록되며, 나머지 설정은 현재 상태 그대로 기록됩니다. 따라서 해당 잠금이 켜져 있는 동안에는 스크롤하거나 확대/축소하거나, 탭을 전환하거나, Code Generator 언어나 이름 케이스, 괄호 타입을 바꾸거나, 이름 표시를 전환해도 파일은 그대로 유지됩니다. 잠그면 그 순간 설정이 가진 값이 잠기며, 파싱할 때는 저장된 필드에서 잠긴 값을 가져옵니다.  
새 에디터나 복제 store, 또는 `value`에 할당하거나 `setInitialValue()`에 넘긴 빈 값처럼 아무것도 없는 상태에서 시작한 문서는 `lockSettings`가 `63`으로 설정되어 모든 잠금이 켜져 있습니다. `ignoreSaveSettings`와 상관없이 `4.0.0` 이전에 저장된 모든 파일과 모든 v2 문서처럼 `settings`에 `lockSettings`가 없는 문서도 모든 잠금이 켜진 상태로 열립니다. 화면과 탭은 새 문서와 같은 곳(`originX`와 `originY`는 `0`, `zoomLevel`은 `1`, ERD 탭)에 놓이며, 언어, 이름 케이스, 괄호 타입은 저장된 값으로 잠깁니다. 잠금을 명시한 문서는 `0`을 포함해 그 잠금과 저장된 모든 값을 유지합니다.  
파싱할 때 `lockSettings`의 모든 비트는 알 수 없는 비트까지 유지되므로, 이후 릴리스가 추가하는 잠금도 여기서 저장할 때 남아 있습니다. JSON Schema는 정수인지만 검사합니다. `4.0.0` 이전 에디터는 저장할 때 `lockSettings`를 버리고 화면과 탭을 현재 상태 그대로 기록하므로, 그 파일을 여기서 다시 열면 `4.0.0` 이전에 저장된 파일로 열립니다.

`4.2.0`부터 일곱 번째 잠금인 `unlockNameViewMode`(`64`)가 있습니다. `Name View` 행에 해당하며 `nameViewMode`를 다룹니다. 이 비트는 `Show`의 숨기기 비트처럼 다른 잠금 비트와 반대로 읽힙니다. 설정되어 있으면 이름 표시의 잠금이 해제된 것이고, 꺼져 있으면 잠긴 것입니다. 따라서 `63`은 여전히 모든 잠금이 켜져 있다는 뜻이며, 새 문서는 이름 표시가 `'physical'`로 잠긴 상태로 이 값을 가집니다. `4.2.0` 이전에 저장된 파일은 다른 잠금이 어떻든, `0`이더라도 이 비트가 꺼져 있으므로 이름 표시가 `'physical'`로 잠긴 상태로 열립니다. 모든 잠금이 꺼진 문서는 `64`를, 나머지 잠금이 모두 켜져 있고 이름 표시의 잠금만 해제된 문서는 `127`을 가집니다. 이 잠금은 반대로 검사하세요. `(lockSettings & 64) === 0`인 동안 켜져 있습니다.  
이 잠금이 켜져 있는 동안에는 이름 표시를 전환해도 전환한 에디터의 화면만 바뀌며, 문서는 잠긴 보기를 유지합니다. 꺼져 있는 동안에는 편집할 수 있는 에디터에서 한 전환이 문서의 전환이 되며, 모든 공동 편집자가 함께 전환됩니다. 읽기 전용 에디터의 전환은 어느 쪽이든 그 에디터 자신의 화면만 바꿉니다. [`Lock`](../../guide/guides/settings.md#잠금) 문서를 참고하세요.  
`4.0.0`이나 `4.1.0` 에디터는 저장할 때 이 비트는 유지하지만 `nameViewMode`는 버리므로, 그 문서를 여기서 다시 열면 잠금은 그대로인 채 `'physical'`로 열립니다.

`4.0.0`부터 `ddlScripts`는 [Schema SQL](../../guide/guides/schema-sql.md) 탭의 두 스크립트를 담으며, 모든 데이터베이스의 DDL이 이를 작성합니다. `before`는 헤더 다음, 테이블 앞에, `after`는 생성된 DDL 뒤에 놓입니다. [앞뒤 스크립트](../../guide/guides/schema-sql.md#앞뒤-스크립트)에서 설명하듯이 DDL은 각 스크립트를 LF 줄바꿈으로, 앞의 빈 줄과 뒤의 공백을 제거하고, MSSQL에서는 `GO`로 끝맺어 작성합니다. `ddlScripts` 자체는 각 스크립트를 입력한 그대로 유지합니다. 이 키는 둘 중 하나의 스크립트에 텍스트가 있을 때만 기록되며, 그때는 두 스크립트가 모두 기록됩니다. 키가 없거나 스크립트가 문자열이 아니면 `''`로 읽힙니다. 탭의 `Statements`, `Header`, `Tables` 선택과, `4.2.0`부터는 [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) 스위치도 문서에 저장되지 않습니다.  
`4.0.0` 이전 에디터는 문서를 불러올 때 스크립트를 버리므로, 그 에디터에서 저장하면 스크립트가 사라집니다.

`4.2.0`부터 `nameViewMode`는 [이름 표시](../../guide/guides/logical-names.md#name-view), 즉 다이어그램이 그리는 이름입니다. `'physical'`은 각 테이블과 컬럼의 이름을, `'logical'`은 이름 자리에 논리명을, `'both'`는 논리명과 이름을 그립니다. 메뉴에서는 이를 각각 `Physical Names`, `Logical Names`, `Both Names`라고 부릅니다. 두 형태 모두 이 값을 `ddlScripts` 뒤 마지막에, 기록하는 값이 `'physical'`이 아닐 때만 기록합니다. `Name View` 잠금이 켜져 있는 동안 기록하는 값은 화면에 무엇이 표시되든 잠긴 값입니다. 값이 없거나 파서가 알지 못하는 값이면 `'physical'`로 읽히며, JSON Schema는 `"logical"`과 `"both"`만 받습니다.  
`4.2.0` 이전 에디터는 문서를 불러올 때 `nameViewMode`를 버립니다.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType`, `ReferentialAction`은 추가만 가능합니다. 저장된 문서에는 숫자가 기록되므로, 새로운 데이터베이스 벤더, 코드 생성 대상, 플래그, 컬럼 타입, 컬럼 옵션, 잠금, 동작은 중간 자리를 차지하지 않고 다음 비트를 사용합니다.

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

처음 다섯 목록은 각각 한 종류 엔티티의 순서이며, DDL, 테이블 정렬, 그리기 순서가 이 순서를 읽습니다. 저장 형태에서 각 목록에는 남아 있는 엔티티의 id만 나열된 순서대로 한 번씩 담기며, `4.2.0`부터는 아무것도 담지 않은 목록은 제외됩니다. `4.0.0`부터 `tableGroupIds`는 테이블 그룹의 순서입니다.

`4.2.0`부터 `wordIds`, `termIds`, `domainIds`는 각 사전의 삭제되지 않은 행을 나열합니다. 컬렉션에는 있지만 목록에는 없는 행은 삭제된 것입니다. 이 목록은 시트의 순서가 아니며, 시트의 순서는 각 행의 `order`가 정합니다. 이 목록은 런타임 값만 기록하며, 각 목록은 그 목록이나 컬렉션에 항목이 있는 동안 기록됩니다. 파일에서는 행 자체가 구성원과 순서를 나타내며, JSON Schema는 이 목록을 거부합니다.  
`4.2.0`부터 파싱할 때 문서가 생략했거나 배열이 아닌 값으로 가진 목록은 그 컬렉션이 가진 모든 항목을, 각 id를 한 번씩, 담긴 순서대로 나열한 것으로 읽습니다. 빈 배열은 비어 있는 그대로 남으며, 이때 그 컬렉션의 모든 항목은 삭제된 것으로 읽힙니다. `4.2.0` 이전 에디터는 없는 목록을 비어 있는 것으로 읽으므로, 저장 형태는 컬렉션에 엔티티가 있으면 항상 각 목록을 기록합니다.

`4.0.0`부터 쌓임 순서는 저장되지 않습니다. 파싱할 때 나열된 테이블, 메모, 테이블 그룹 중 `zIndex`가 없는 것은 각자의 목록에서의 위치에 따라, 뒤에 있는 것이 앞에 오도록 쌓입니다. 테이블 그룹은 `1`부터, 테이블은 `2`부터 시작하며, 메모는 모든 테이블 위에 놓입니다. 런타임 값이나 `4.0.0` 이전에 저장된 파일처럼 `zIndex`가 있는 엔티티는 그 값을 유지합니다. 따라서 테이블이나 메모를 맨 앞으로 가져온 것은 파일을 다시 열면 사라집니다.

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

`4.0.0`부터 테이블은 자신이 속한 [테이블 그룹](../../guide/guides/table-groups.md)의 id인 `groupId`를 가집니다. `groupId`가 없거나 비어 있거나 `doc.tableGroupIds`에 없는 그룹을 가리키면 그룹이 없는 것이며, 저장 형태는 남아 있는 그룹을 가리킬 때만 이 필드를 기록합니다.  
파싱할 때 `seqColumnIds`가 없거나 나열된 id가 빠져 있으면 `columnIds`로 시작하며, 에디터는 불러올 때마다 자체 폰트로 `widthName`, `widthLogicalName`, `widthComment`를 다시 측정합니다.

`4.2.0`부터 테이블은 `logicalName`과 `nameDerived`를 가집니다. `logicalName`은 `Logical Names`와 `Both Names` [보기](../../guide/guides/logical-names.md#name-view)가 그리는 이름이며, 없으면 `''`입니다. `nameDerived`는 사전이 논리명에서 `name`을 [생성한](../../guide/guides/dictionary.md#deriving-physical-names) 동안 `true`입니다. 이 값이 설정되어 있는 동안에는 새 논리명이 이름을 다시 생성합니다. 설정되어 있지 않으면 이름은 직접 입력한 이름이며, 이름이 비어 있거나 공백뿐인 경우가 아니면 새 논리명은 이름을 그대로 둡니다. 직접 이름을 바꾸면 이 값이 꺼지며, [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again)은 직접 입력한 이름까지 다시 쓰고 논리명이 있는 곳마다 이 값을 켭니다.  
저장 형태는 `logicalName`을 `name` 뒤에 입력한 그대로, 공백 외의 텍스트가 있을 때만 기록하고, `nameDerived`를 `groupId` 뒤에 `true`일 때만 기록합니다. `true`는 JSON Schema가 받는 유일한 값입니다. 없는 `logicalName`은 `''`로, 없는 `nameDerived`는 `false`로 읽히므로, `4.2.0` 이전에 저장된 파일의 모든 이름은 직접 입력한 이름으로 간주됩니다.  
`4.2.0` 이전 에디터는 문서를 불러올 때 둘 다 버리므로, 그 에디터에서 저장하면 모든 테이블의 논리명이 사라집니다.

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

`4.0.0`부터 저장 형태에는 컬럼 `ui`가 기록되지 않습니다. 불러올 때마다 `keys`를 계산하며, primary key 표시는 `options`의 `primaryKey` 비트에서, foreign key 표시는 그 컬럼에서 끝나는 관계에서 가져옵니다. 여섯 가지 너비도 다시 측정합니다.  
`4.0.0` 이전 에디터는 여기서 저장한 파일의 컬럼을 primary key 아이콘 없이 표시합니다.

`4.2.0`부터 컬럼은 테이블과 마찬가지로 `logicalName`을 가지며, 컬럼이 연결한 도메인의 id인 `domainId`도 가집니다. 연결된 도메인이 없으면 `domainId`는 `''`입니다. 한 에디터 안의 편집은 [도메인과 데이터 타입](../../guide/guides/dictionary.md#domains-and-data-types)에서 설명하듯이 연결된 컬럼을 그 도메인의 데이터 타입으로 유지합니다. 하지만 파싱할 때는 어떤 컬럼의 타입도 바꾸지 않으므로, 다른 곳에서 작성한 파일이나 두 공동 편집자의 엇갈린 편집 때문에 연결된 컬럼이 다른 타입으로 남을 수 있습니다. 검사 시트는 이런 컬럼을 각각 [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds)로 나열합니다. 파싱할 때 문서에 없는 도메인을 가리키는 `domainId`는 지워집니다. 삭제된 도메인도 있는 것으로 치므로, 에디터는 Undo로 그 도메인을 되살릴 수 있는 동안 그 도메인으로의 연결을 유지합니다. 저장 형태는 `options` 뒤에 `logicalName`을 테이블과 같은 규칙으로 기록하고, `domainId`는 파일이 기록하는 도메인을 가리킬 때만 기록하므로, 삭제된 도메인으로의 연결은 절대 기록하지 않습니다.  
`ColumnOption.nameDerived`(`16`)는 컬럼의 이름 생성 여부 플래그로, 다른 비트와 함께 `options`에 담기며 테이블의 `nameDerived`와 같은 의미입니다. 예를 들어 사전이 이름을 생성한 NOT NULL primary key는 `options`가 `26`입니다.  
`4.2.0` 이전 에디터는 문서를 불러올 때 `logicalName`과 `domainId`를 버리므로, 그 에디터에서 저장하면 둘이 사라집니다. `options`는 숫자 그대로 유지하므로, 그 에디터에서 저장해도 `nameDerived` 비트는 남아 있습니다.

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

`3.10.0`부터 관계는 [ON DELETE와 ON UPDATE 동작](../../guide/guides/relationship-editing.md#on-delete와-on-update)을 나타내는 `onDelete`와 `onUpdate`를 가집니다. 각각 정확히 하나의 `ReferentialAction` 값을 가집니다. 기본값인 `none`은 절을 작성하지 않으므로 데이터베이스 자체의 기본 동작이 적용됩니다. 나머지 5가지는 각각 `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`를 나타냅니다. Schema SQL은 해당 동작을 받아들이는 데이터베이스에서만 절을 작성합니다.  
저장 형태는 항상 두 필드를 모두 기록하며, `4.0.0`부터 JSON Schema는 두 필드를 필수로 요구하되 각 값이 정수인지만 검사합니다. 파싱할 때는 여전히 `3.10.0` 이전에 저장된 모든 문서처럼 필드가 없으면 `none`으로 읽으며, 목록에 없는 값도 마찬가지입니다.  
`3.10.0` 이전 에디터는 이 필드를 알지 못해 문서를 불러올 때 버리므로, 그 에디터에서 저장하면 모든 동작이 사라집니다.

`4.0.0`부터는 불러올 때마다 저장 형태가 제외하는 것을 계산합니다. 관계가 끝나는 컬럼이 모두 primary key이면 식별 관계이며, 그런 컬럼이 모두 NOT NULL이면 `startRelationshipType`은 `dash`, 아니면 `ring`입니다. 끝나는 컬럼이 하나도 남지 않은 관계는 새 관계가 시작할 때처럼 비식별 관계이며 `dash`입니다. 앵커인 `x`, `y`, `direction`은 다시 배치됩니다.

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

파싱할 때 `seqIndexColumnIds`가 없거나 나열된 id가 빠져 있으면 `indexColumnIds`로 시작합니다.

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

`4.0.0`부터 테이블과 메모는 `zIndex`로 정렬되는 [하나의 쌓임 순서를 공유](../../guide/guides/table-related-functions.md#여러-테이블-이동)하므로, 테이블을 맨 앞으로 가져오면 메모 위에 놓일 수 있습니다. [Doc](#doc)에서 설명하듯이 파싱할 때 `zIndex` 없이 저장된 메모는 모든 테이블 위에 쌓입니다. `4.0.0` 이전에 저장된 파일의 메모는 저장된 `zIndex`를 유지하는데, 이 값은 테이블과 같은 카운터에서 나왔으므로 이전 릴리스가 모든 테이블 위에 그리던 메모가 그 뒤에 맨 앞으로 가져온 테이블 아래에서 열릴 수 있습니다.

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

`4.0.0`부터 문서는 [테이블 그룹](../../guide/guides/table-groups.md), 즉 테이블 뒤에 그려지는 이름과 색상이 있는 박스를 가질 수 있습니다. 테이블은 자신의 `groupId`로 그룹에 속하므로, 그룹은 구성원 목록을 가지지 않습니다. 저장 형태는 `doc.tableGroupIds`와 마찬가지로 그룹이 있을 때만 이 컬렉션을 기록하며, `4.0.0` 이전에 저장된 문서처럼 이 컬렉션이 없는 문서에는 그룹이 없습니다. `Show.hideTableGroup`은 그룹을 숨깁니다.  
`4.0.0` 이전 에디터는 문서를 불러올 때 그룹과 모든 테이블의 `groupId`를 버리므로, 그 에디터에서 저장하면 모든 그룹이 사라집니다.

### 사전 행 {#dictionary-rows}

`4.2.0`부터 문서는 [사전](../../guide/guides/dictionary.md) 탭의 `Words`, `Terms`, `Domains` 시트인 세 사전을 `wordEntities`, `termEntities`, `domainEntities`에 담습니다. 단어, 용어, 도메인의 모든 필드는 문자열이며, 어느 것도 `ui`를 가지지 않습니다. `Checks` 시트는 사전과 다이어그램에서 계산되며 저장되지 않습니다.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

세 사전은 모두 id를 키로 사용하지 않습니다. 각 사전은 헤더와 행으로 기록됩니다. `fields`는 엔티티의 필드를 id부터 한 번씩 나열하며, 각 행은 한 엔티티의 값을 그 순서로 담습니다. 아래 타입은 각 엔티티의 필드를 런타임 값의 헤더 순서로 나열합니다. 행은 항상 id와 이름을 유지하지만 이름 뒤의 값 중 끝에 이어진 빈 값은 생략되므로, 유지되는 값 앞에 있는 빈 값은 `''`로 남으며, 파싱할 때 행에 없는 값은 `''`로 읽힙니다. 두 형태 모두 각 행을 다음 파일의 두 단어처럼 압축된 JSON으로 한 줄에 하나씩 기록합니다.

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

저장 형태는 나열된 행을 시트 순서대로 기록하고 `order`는 제외하므로, 헤더에도 `order`가 없습니다. 추가한 뒤 한 번도 채우지 않았거나 비운 행처럼 id 외의 값이 모두 비어 있거나 공백뿐인 행은 제외되며, 그런 도메인이나 삭제된 도메인으로의 모든 연결도 제외됩니다. 컬럼의 `domainId`는 생략되고, 용어의 `domainId`는 `''`로 기록되며, 그 용어에 다른 값이 없으면 용어 자체가 제외됩니다.  
런타임 값의 헤더에는 `"name"` 바로 뒤에 `"order"`가 있습니다. 런타임 값은 삭제된 행을 포함해 컬렉션이 가진 모든 행을 컬렉션에 담긴 순서대로 기록하므로, 시트의 순서를 얻으려면 `order`를 코드 유닛 순서로 비교해 정렬하세요. 파싱할 때는 파일의 행이 놓인 순서대로 `order` 키를 부여하므로, 행은 파일이 기록한 순서대로 다시 읽힙니다.  
`4.2.0` 이전에 저장된 문서처럼 사전이 기록되지 않은 문서에는 단어, 용어, 도메인이 하나도 없습니다. `4.2.0` 이전 에디터는 문서를 불러올 때 세 사전을 모두 버리므로, 그 에디터에서 저장하면 모든 단어, 용어, 도메인이 사라집니다.

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

단어는 논리명을 이루는 단어 하나이며, `abbreviation`은 물리명에서 그 단어를 대신하는 약어입니다. `synonyms`는 그 단어의 다른 표기를, `forbiddenWords`는 그 단어 대신 써서는 안 되는 단어를 나열하며, 각각 쉼표로 구분합니다.

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

용어는 논리명 전체입니다. `logicalName`이 `name`과 일치하는 테이블이나 컬럼에는 `physicalName`이, 그 값이 비어 있으면 단어의 약어로 조합한 이름이 생성되며, 컬럼은 `domainId`가 가리키는 도메인도 받습니다. 도메인이 없으면 `domainId`는 `''`입니다([물리명 생성](../../guide/guides/dictionary.md#deriving-physical-names) 참고). `synonyms`는 쉼표로 구분합니다. 파싱할 때 컬럼에서와 마찬가지로 없는 도메인을 가리키는 `domainId`는 지워집니다.

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

도메인은 이름이 붙은 데이터 타입이며, `dataType`은 `NUMERIC(10)`처럼 길이를 포함해 컬럼과 같은 방식으로 그 타입을 담습니다. 컬럼이나 용어는 id로 도메인을 연결하며, 에디터는 연결된 모든 컬럼에 그 도메인의 데이터 타입을 지정합니다([도메인과 데이터 타입](../../guide/guides/dictionary.md#domains-and-data-types) 참고).

## JSON Schema

정식 스키마 파일은 [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)에 게시되어 있으며 `$schema`로 직접 참조할 수 있습니다.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

`.erd.json` 파일 맨 위에 `$schema`를 넣으면 VS Code처럼 JSON Schema를 이해하는 에디터가 편집하는 동안 문서를 검증하고 필드를 자동완성합니다.

`4.0.0`부터 스키마는 저장 형태만 기술합니다. 이름이 있는 필드를 가진 모든 객체는 닫혀 있고(`additionalProperties: false`), 저장 형태가 항상 기록하는 필드는 모두 필수이며, 아무것도 담지 않은 동안 저장 형태가 제외하는 필드는 명시되지만 필수는 아니고, 저장 형태가 항상 제외하는 필드는 하나도 명시되지 않습니다. 따라서 런타임 값은 거부됩니다. `4.0.0` 이전에 저장된 파일도 `meta`, 너비, `zIndex`, `ignoreSaveSettings` 등을 가지고 있으므로 `4.0.0` 이상의 에디터가 그 파일을 다시 저장하기 전까지 거부됩니다. `3.2.0` 이상에서 저장한 파일은 `main` 브랜치를 가리키는 이 스키마의 URL을 이미 지정하고 있으므로, 이 스키마로 검증하는 에디터는 이제 그 파일에 오류를 표시합니다. `3.0.0`이나 `3.1.0`에서 저장한 파일과 v2 문서는 `$schema`를 지정하지 않습니다.

`4.2.0`부터 스키마는 엔티티의 텍스트 필드, `doc` 목록, 컬렉션, `collections` 자체를 더 이상 필수로 요구하지 않습니다. 저장 형태는 이들이 아무것도 담지 않은 동안 이들을 제외합니다. `4.0.0`이나 `4.1.0`이 저장한 파일도 여전히 받습니다. 새 필드도 명시합니다. `"logical"`과 `"both"`만 받는 `nameViewMode`, 테이블의 `logicalName`과 `true`만 받는 `nameDerived`, 컬럼의 `logicalName`과 `domainId`, 그리고 각각 헤더와 문자열 행을 가진 세 사전입니다. `canvasType`은 사전 탭을 나열하고, `columnOrder`는 7개 또는 9개의 정수를 받으며, `show`, `columnOrder`, `lockSettings`, `options`의 설명은 새 비트를 명시합니다.

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
