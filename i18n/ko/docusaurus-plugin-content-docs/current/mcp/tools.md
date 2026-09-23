---
sidebar_position: 4
description: erd-editor MCP 서버가 제공하는 모든 도구. 문서를 한 페이지씩 읽는 방법, 54개의 편집 도구, erd_batch, 결과와 거부의 형태.
---

# 도구

서버는 63개의 도구를 제공합니다. 세션 도구 5개, 읽기 도구 3개, 편집 작업마다 하나씩인 편집 도구 54개, 그리고 여러 편집 도구를 하나의 편집으로 실행하는 `erd_batch`입니다.

`erd_list_documents`를 제외한 모든 도구는 첫 번째 인자로 문서의 `path`를 받으며, 아래 표에서는 생략합니다.
`?`가 붙은 인자는 선택 사항입니다.

## 세션 도구

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_list_documents` | | ERD 문서를 `path`, `open`, `active`, `dirty`, `readonly`와 함께 나열합니다. 작업 디렉터리를 담당하는 VS Code 창이 있으면 그 창의 문서를, 없으면 작업 디렉터리 아래의 ERD 파일을 나열합니다. |
| `erd_open_document` | `create?` | 편집할 문서를 엽니다. 문서를 담당하는 창이 있으면 ERD Editor에서 엽니다. `create`를 주면 파일이 없을 때 먼저 만들며, 확장자가 없는 이름에는 `.erd.json`이 붙습니다. |
| `erd_save` | | 에디터가 가진 문서를 저장합니다. 헤드리스에서는 모든 편집이 이미 파일에 쓰여 있으므로 아무것도 하지 않습니다. |
| `erd_undo` | | 이 에이전트가 마지막으로 한 편집을 되돌리며, 사용자의 편집은 절대 되돌리지 않습니다. Undo 항목을 만들지 않은 호출은 건너뛰고 그 이름을 알려 줍니다. |
| `erd_redo` | | `erd_undo`가 마지막으로 되돌린 편집을 다시 적용합니다. |

각 모드에서 저장과 Undo가 어떻게 동작하는지는 [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요.

## 문서 읽기

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | 설정과 개수, 그다음 테이블 한 페이지를 돌려줍니다. 각 테이블에는 id, 캔버스 위의 위치와 크기, 컬럼 수, 그리고 인덱스와 관계가 함께 나오며, 테이블 뒤에는 검색 중이 아니라면 메모가 나옵니다. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?` | 지정한 엔티티를 빠짐없이 돌려줍니다. 테이블은 컬럼과 함께, 관계와 인덱스는 그 컬럼과 함께, 메모는 텍스트와 함께 나옵니다. |
| `erd_read` | `format`, `vendor?`, `tableIds?`, `tableNames?` | 문서 전체를 세 가지 형식 중 하나로 한 번에 돌려주거나, 일부 테이블의 DDL만 돌려줍니다. |

에이전트는 `erd_list`로 id를 찾고, `erd_get`으로 컬럼과 그 밖의 세부 내용을 읽은 뒤, 그 id를 편집 도구에 넘깁니다.
`erd_list`의 테이블 크기는 캔버스에서 차지하는 상자의 크기입니다. 높이는 정확하고 너비는 근삿값입니다.
각 관계는 두 테이블 중 한쪽에 한 번만 나열됩니다.

`erd_read`는 세 가지 형식 중 하나를 받습니다.

| `format` | 응답 내용 |
| --- | --- |
| `snapshot` | 모든 엔티티와 그 id를 담은 간결한 JSON입니다. 스키마가 크면 커집니다. |
| `sql` | 8가지 데이터베이스 `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake`, `SQLite` 중 하나의 DDL입니다. `vendor`의 기본값은 문서에 설정된 데이터베이스입니다. `tableIds`나 `tableNames`를 주면 해당 테이블만, 그 테이블이 가진 foreign key와 함께 돌려줍니다. |
| `json` | 원본 `.erd.json` 문서입니다. |

### 대규모 스키마

테이블이 수백, 수천 개인 스키마에서도 동작합니다.
한 번의 읽기는 최대 40,000자까지 응답하며, 이는 Claude Code가 도구 결과를 파일로 따로 빼 두는 기준보다 작습니다.

- `erd_list`는 기본적으로 테이블 100개를 한 페이지로 응답하고, 다음 페이지가 시작하는 위치를 `nextOffset`과 `note`로 알려 줍니다. 그 `nextOffset`을 같은 `query`와 함께 `offset`으로 넘기세요.
- `query`는 테이블이나 컬럼의 이름 또는 코멘트에 들어 있는 단어로, 대소문자를 구분하지 않고 테이블을 찾습니다. 이름에 단어가 더 많이 들어 있는 테이블이 먼저 나옵니다.
- `namesOnly`는 테이블 이름만 나열하며, 짧은 이름이라면 한 번의 응답에 약 2,000개를 담습니다.
- `erd_get`과 `erd_read`는 id뿐 아니라 `tableNames`도 받으므로, 큰 스키마에서 SQL 쿼리를 요청받은 에이전트는 필요한 테이블의 DDL만 읽을 수 있습니다.
- `erd_get`은 아무것도 가리키지 않는 id와 이름을 `missing`에, 한 번의 응답에 담지 못한 id를 `notReturned`에 나열하므로 다시 요청할 수 있습니다.
- 한 번의 응답에 담기에 너무 큰 읽기는 범위를 좁히는 방법과 함께 `tooLarge`로 거부됩니다.

## 편집 도구

id는 `erd_list`와 `erd_get`에서, 또는 엔티티를 만든 호출의 `createdIds`에서 얻습니다.
`x`와 `y`는 캔버스 위의 왼쪽 가장자리와 위쪽 가장자리를 픽셀 단위로 나타내며, 색상은 `#3b82f6`과 같은 CSS hex 색상입니다.

### 테이블

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_table` | | 빈 테이블을 비어 있는 자리에 추가하고 그 id를 `createdIds`로 돌려줍니다. |
| `erd_remove_table` | `tableId` | 테이블을 그 컬럼, 인덱스, 그리고 테이블에 닿는 모든 관계와 함께 삭제합니다. |
| `erd_change_table_name` | `tableId`, `value` | 테이블 이름을 바꿉니다. |
| `erd_change_table_comment` | `tableId`, `value` | 테이블 코멘트를 설정합니다. 빈 문자열을 주면 지웁니다. |
| `erd_change_table_color` | `tableId`, `color` | 테이블 색상을 설정합니다. |
| `erd_move_table` | `tableId`, `x`, `y` | 테이블을 캔버스의 한 위치로 옮깁니다. |
| `erd_move_tables` | `positions` | 여러 테이블을 한 번의 편집으로 옮기며, `erd_undo` 한 번으로 되돌립니다. `positions`에는 테이블마다 `{ tableId, x, y }`를 담으며, 각 테이블은 한 번만 올 수 있습니다. |
| `erd_sort_tables` | | 가져오기가 테이블을 배치하는 방식대로, 컬럼이 적은 테이블부터 모든 테이블을 캔버스에 여러 줄로 배치합니다. |

### 컬럼

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | 테이블에 빈 컬럼을 추가하고 그 id를 `createdIds`로 돌려줍니다. |
| `erd_remove_columns` | `tableId`, `columnIds` | 한 테이블에서 컬럼을 삭제하며, 그 컬럼을 사용하는 관계와 인덱스 항목도 함께 삭제합니다. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | 컬럼 이름을 바꿉니다. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | `INT`나 `VARCHAR(255)` 같은 데이터 타입을 설정합니다. [관계 데이터 타입 동기화](../guide/guides/settings.md)가 켜져 있으면 이 타입을 복사한 foreign key도 따라 바뀝니다. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | 기본값을 SQL 텍스트로 설정합니다. 빈 문자열을 주면 지웁니다. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | 코멘트를 설정합니다. 빈 문자열을 주면 지웁니다. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true`는 컬럼을 primary key에 포함하고, `false`는 제외합니다. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | 컬럼이 unique인지 설정합니다. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | 컬럼이 `NOT NULL`인지 설정합니다. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | 컬럼이 자동 증가하는지 설정합니다. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | 컬럼을 같은 테이블 안에서 다른 컬럼의 위치로 옮깁니다. |

### 관계

`relationshipType`은 자식 쪽 끝의 카디널리티이며, `ZeroOne`, `ZeroN`, `OneOnly`, `OneN` 중 하나입니다.
시작 테이블은 부모, 즉 primary key를 가진 참조되는 쪽이고, 끝 테이블은 자식입니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType` | 두 테이블을 관계로 연결합니다. 부모의 primary key를 자식에 foreign key 컬럼으로 복사하며, 부모에 primary key가 없으면 primary key 컬럼을 먼저 만듭니다. `createdIds`에는 새로 만든 키 컬럼이 있으면 그 컬럼, foreign key 컬럼, 그리고 마지막으로 관계 id가 담깁니다. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType` | 이미 있는 컬럼 사이에 관계를 그리며, 시작 컬럼과 끝 컬럼을 위치 순서대로 짝짓습니다. |
| `erd_remove_relationship` | `relationshipId` | 관계 연결선을 삭제합니다. foreign key 컬럼은 테이블에 그대로 남습니다. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | 관계의 카디널리티를 바꿉니다. |

### 인덱스

인덱스 컬럼 id는 테이블 컬럼의 id가 아니라, `erd_get`이 알려 주는 인덱스 컬럼 목록의 항목입니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_index` | `tableId` | 테이블에 빈 인덱스를 추가하고 그 id를 `createdIds`로 돌려줍니다. |
| `erd_remove_index` | `indexId` | 인덱스를 삭제합니다. |
| `erd_change_index_name` | `indexId`, `value` | 인덱스 이름을 바꿉니다. |
| `erd_set_index_unique` | `indexId`, `value` | 인덱스가 unique인지 설정합니다. |
| `erd_add_index_column` | `indexId`, `columnId` | 인덱스가 속한 테이블의 컬럼을 추가하고 새 인덱스 컬럼 id를 돌려줍니다. 이미 인덱스에 있는 컬럼은 그대로 둡니다. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | 인덱스에서 컬럼 하나를 제거합니다. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | 인덱스 안에서 컬럼을 그 인덱스의 다른 컬럼 위치로 옮깁니다. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | 인덱스에서 컬럼 하나의 정렬 순서를 `ASC` 또는 `DESC`로 설정합니다. |

### 메모

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_memo` | | 빈 메모를 비어 있는 자리에 추가하고 그 id를 `createdIds`로 돌려줍니다. |
| `erd_remove_memo` | `memoId` | 메모를 삭제합니다. |
| `erd_change_memo_value` | `memoId`, `value` | 메모의 텍스트를 교체합니다. |
| `erd_change_memo_color` | `memoId`, `color` | 메모 색상을 설정합니다. |
| `erd_move_memo` | `memoId`, `x`, `y` | 메모를 캔버스의 한 위치로 옮깁니다. |
| `erd_resize_memo` | `memoId`, `width`, `height` | 메모 크기를 바꿉니다. 너비는 약 `116`픽셀 이상, 높이는 `100` 이상이어야 합니다. 에디터는 드래그로 바꾼 메모 크기만 기록하므로, Undo 항목을 만들지 않습니다. |

### 설정

데이터베이스, Code Generator 옵션, [설정](../guide/guides/settings.md) 탭의 항목처럼 문서에 저장되는 설정입니다.
`erd_set_show`를 제외하면 어느 것도 Undo 항목을 만들지 않으므로, `erd_undo`로 되돌릴 수 없습니다.

| 도구 | 인자 | 값 |
| --- | --- | --- |
| `erd_set_database` | `value` | `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks`, `Snowflake`. 그 데이터베이스의 데이터 타입과, `vendor`를 주지 않았을 때 `erd_read`가 쓰는 DDL을 정합니다. |
| `erd_set_database_name` | `value` | 데이터베이스 이름입니다. |
| `erd_set_language` | `value` | Code Generator 언어입니다. `GraphQL`, `csharp`, `Java`, `Kotlin`, `TypeScript`, `JPA`, `Scala`, `Go`, `SQLAlchemy`, `TypeORM`, `Sequelize`, `Drizzle`, `DBML`, `AML`. |
| `erd_set_table_name_case` | `value` | 생성되는 테이블 이름의 Name Case입니다. `none`, `camelCase`, `pascalCase`, `snakeCase`. |
| `erd_set_column_name_case` | `value` | 컬럼 이름에 대한 같은 설정입니다. |
| `erd_set_bracket_type` | `value` | 생성되는 SQL에서 이름을 감싸는 방식입니다. `none`, `doubleQuote`, `singleQuote`, `backtick`. |
| `erd_set_relationship_data_type_sync` | `value` | `true`면 foreign key 컬럼을 참조하는 컬럼의 데이터 타입에 맞춰 유지합니다. |
| `erd_set_relationship_optimization` | `value` | 문서에 저장되는 관계 최적화 플래그입니다. |
| `erd_set_column_order` | `columnType`, `targetColumnType` | 테이블 행의 한 부분을 다른 부분의 자리로 옮깁니다. `columnName`, `columnDataType`, `columnNotNull`, `columnUnique`, `columnAutoIncrement`, `columnDefault`, `columnComment`. |
| `erd_set_max_width_comment` | `value` | 테이블에서 코멘트가 그려지는 최대 너비를 픽셀 단위로 지정하며, `-1`이면 제한이 없습니다. |
| `erd_set_ignore_save_settings` | `saveSettingType`, `value` | `true`면 저장되는 파일에서 `scroll` 또는 `zoomLevel`을 제외합니다. |
| `erd_set_show` | `show`, `value` | 다이어그램의 한 부분을 표시하거나 숨깁니다. `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnAutoIncrement`, `columnPrimaryKey`, `columnUnique`, `columnNotNull`, `relationship`. |

### 가져오기

이 도구들은 모두 문서 전체를 대체하며, `erd_undo`는 그 전의 문서를 복원합니다.
에디터의 Import 메뉴와 같은 방식으로 스키마를 읽습니다. [파일 가져오기와 내보내기](../guide/guides/file-import-export.md) 문서를 참고하세요.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_import_sql` | `value` | `CREATE TABLE` 문 같은 SQL DDL을 불러옵니다. |
| `erd_import_graphql` | `value` | GraphQL SDL을 불러옵니다. |
| `erd_import_dbml` | `value` | DBML을 불러옵니다. |
| `erd_import_aml` | `value` | AML을 불러옵니다. |
| `erd_import_json` | `value` | 다른 `.erd.json` 파일 같은 erd-editor JSON 문서를 불러옵니다. 빈 텍스트를 주면 빈 문서가 됩니다. |

## erd_batch

`erd_batch`는 여러 편집 도구를 순서대로, 전부 적용하거나 전혀 적용하지 않는 하나의 편집으로 실행합니다.

- `operations`에는 최대 100개의 항목을 담으며, 각 항목은 `{ tool, as?, args? }`이고 `args`는 `path`를 뺀 도구의 인자입니다.
- 작업은 먼저 문서의 복사본에서 시도됩니다. 거부된 작업은 `operations[1] erd_remove_table: …`처럼 이름이 표시되며, 아무것도 적용되지 않습니다.
- `erd_undo` 한 번으로 배치 전체를 되돌립니다. 결과의 `historyEntries`는 `erd_undo` 호출 횟수가 아니라 배치 안의 에디터 히스토리 항목 수를 셉니다.
- 라이브 세션에서는 에디터가 배치 전체를 받아들이거나 전혀 받아들이지 않습니다.

에이전트는 호출하기 전에는 배치가 만들 id를 알 수 없으므로, `as`로 이름을 붙인 작업은 뒤의 작업이 그 id를 참조할 수 있게 합니다. 첫 번째로 만든 id는 `$name` 또는 `$name.0`, 두 번째는 `$name.1`, 마지막은 `$name.last`입니다.
참조는 엔티티 id를 받는 인자에서만 해석되므로, `$x`라고 쓴 이름이나 코멘트는 텍스트로 남습니다.

한 번의 호출로 테이블과 컬럼, 관계를 만드는 예입니다.

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN" } }
  ]
}
```

## 결과

편집은 한 줄의 JSON으로 응답합니다.

```json
{"tool":"erd_add_table","mode":"live","createdIds":["b7u59tHkuXTA1hhtWh_bD"],"batches":1,"historyEntries":1}
```

| 필드 | 의미 |
| --- | --- |
| `mode` | `live` 또는 `headless`입니다. [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요. |
| `createdIds` | 호출이 만든 것의 id를 순서대로 담습니다. |
| `batches`, `historyEntries` | 호출이 보낸 변경 배치 수와, 만든 에디터 히스토리 항목 수입니다. |
| `undoable`, `undoNote` | `erd_undo`가 이 호출을 건너뛸 때 `undoable`은 `false`이고, `undoNote`가 그 이유를 알려 줍니다. 도구가 Undo 항목을 만들지 않거나, 문서가 이미 그 값을 가지고 있던 경우입니다. `erd_batch` 결과에는 항상 `undoNote`가 있으며, `erd_undo` 한 번으로 배치 전체를 되돌린다고 알려 줍니다. |
| `mismatch` | 호출이 만든 배치 수나 히스토리 항목 수가 도구가 선언한 수와 다를 때 들어 있습니다. |
| `notes` | 창이 종료되거나 디스크의 파일이 바뀌는 등 세션에 변화가 있었을 때 들어 있습니다. |

거부는 코드와, 무엇을 해야 하는지 알려 주는 메시지를 담은 오류 결과입니다.

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 이유 |
| --- | --- |
| `notFound` | id가 가리키는 대상이 현재 문서에 없거나, 파일이 존재하지 않습니다. |
| `invalidArgs` | 인자가 빠졌거나 값이 잘못되었습니다. |
| `invalidPath` | 경로가 ERD 문서가 아닙니다. |
| `invalidDocument` | 파일이 에디터가 읽을 수 있는 문서가 아닙니다. |
| `tooLarge` | 읽기 결과가 한 번의 응답에 담기지 않습니다. |
| `blocked` | 허브가 꺼진 VS Code 창이 문서를 담고 있습니다. |
| `conflict` | 호출 중에 디스크의 파일이 바뀌었습니다. 아무것도 쓰지 않았습니다. |
| `hubAppeared`, `hubGone` | 편집 중에 창이 문서를 맡기 시작했거나 그만두었습니다. 아무것도 쓰지 않았습니다. |
| `notSaved` | `erd_save`가 에디터의 문서를 저장하지 못했습니다. |
| `readonly` | 문서가 읽기 전용으로 열려 있습니다. |
| `protocolMismatch` | 확장과 서버가 서로 다른 프로토콜 버전을 사용합니다. |
| `hubUnreachable`, `timeout`, `disconnected` | 창의 허브가 연결을 받아들이지 않았거나, 30초 안에 응답하지 않았거나, 호출 중에 연결을 끊었습니다. |

그 밖의 코드는 드물게 나오며, 모든 거부에는 무슨 일이 있었는지 알려 주는 메시지가 담깁니다.

편집 도구, `erd_batch`, 세 가지 읽기 도구는 선언하지 않은 인자나 타입이 잘못된 인자를 문서를 건드리기 전에 JSON-RPC invalid params 오류(`-32602`)로 거부하므로, 철자가 틀린 인자가 조용히 버려지는 일은 없습니다.
세션 도구 5개는 모르는 인자를 무시합니다.
