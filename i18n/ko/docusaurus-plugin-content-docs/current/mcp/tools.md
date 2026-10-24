---
sidebar_position: 4
description: erd-editor MCP 서버가 제공하는 모든 도구. 문서를 한 페이지씩 읽는 방법, 사전 검사, 67개의 편집 도구, erd_batch, 결과와 거부의 형태.
---

# 도구

서버는 77개의 도구를 제공합니다. 세션 도구 5개, 읽기 도구 4개, 편집 작업마다 하나씩인 편집 도구 67개, 그리고 여러 편집 도구를 하나의 편집으로 실행하는 `erd_batch`입니다.

`erd_list_documents`를 제외한 모든 도구는 첫 번째 인자로 문서의 `path`를 받으며, 아래 표에서는 생략합니다.
`?`가 붙은 인자는 선택 사항입니다.

## 세션 도구

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_list_documents` | | ERD 문서를 `path`, `open`, `active`, `dirty`, `readonly`와 함께 나열합니다. 작업 디렉터리를 담당하는 에디터가 있으면 그 에디터의 문서를(JetBrains IDE에서는 열린 모든 프로젝트의 문서를), 없으면 작업 디렉터리 아래의 ERD 파일을 나열합니다. |
| `erd_open_document` | `create?` | 편집할 문서를 엽니다. 문서를 담당하는 에디터가 있으면 그 에디터의 ERD Editor에서 엽니다. `create`를 주면 파일이 없을 때 먼저 만들며, 확장자가 없는 이름에는 `.erd.json`이 붙습니다. |
| `erd_save` | | 에디터가 담고 있는 문서를 저장합니다. VS Code는 이 도구가 호출될 때까지 에이전트의 편집을 저장되지 않은 상태로 두고, Obsidian과 JetBrains IDE는 사용자의 편집을 저장하듯 저장하며 이 도구는 곧바로 파일에 씁니다. 헤드리스에서는 각 편집 결과의 `saved: true`가 알려 주듯 모든 편집이 이미 파일에 쓰여 있으므로 아무것도 하지 않습니다. |
| `erd_undo` | | 이 에이전트가 마지막으로 한 편집을 되돌리며, 사용자의 편집은 절대 되돌리지 않습니다. Undo 항목을 만들지 않은 호출은 건너뛰고 그 이름을 알려 줍니다. |
| `erd_redo` | | `erd_undo`가 마지막으로 되돌린 편집을 다시 적용합니다. |

각 모드에서 저장과 Undo가 어떻게 동작하는지는 [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요.

## 문서 읽기

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | 설정과 개수, 그다음 테이블 한 페이지를 인덱스, 관계와 함께 돌려줍니다. 각 테이블에는 id, 캔버스 위의 위치와 크기, 컬럼 수, 논리명이 있다면 그 논리명, 그리고 그룹에 속해 있다면 그 테이블 그룹이 함께 나옵니다. 검색 중이 아니라면 테이블 뒤에 테이블 그룹, 메모, 그다음 도메인, 용어, 단어가 나옵니다. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | 지정한 엔티티 전체를 돌려줍니다. 테이블은 컬럼, 테이블 그룹과 함께, 관계는 그 컬럼과 `onDelete`, `onUpdate`와 함께, 인덱스는 그 컬럼과 함께, 메모는 텍스트와 함께, 테이블 그룹은 그 테이블과 함께, 단어, 용어, 도메인은 모든 필드와 함께 나옵니다. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | 문서 전체를 네 가지 형식 중 하나로 한 번에 돌려주거나, 일부 테이블이나 테이블 그룹의 DDL만 돌려줍니다. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | 단어 사전, 용어 사전, 도메인 사전이 찾아낸 문제를 에디터 사전 탭의 `Checks` 시트가 나열하는 대로 한 페이지씩 돌려줍니다. 아무것도 바꾸지 않습니다. [사전 검사](#dictionary-checks) 항목을 참고하세요. |

에이전트는 `erd_list`로 id를 찾고, `erd_get`으로 컬럼, 사전 행, 그 밖의 세부 내용을 읽은 뒤, 그 id를 편집 도구에 넘깁니다.
`erd_list`의 테이블 크기는 캔버스에서 차지하는 상자의 크기입니다. 높이는 정확하고 너비는 근삿값입니다.
테이블 그룹은 그룹이 저장하는 영역으로 나열되며, 이름, 색상, 담고 있는 테이블 수가 함께 나옵니다.
각 관계는 두 테이블 중 한쪽에 한 번만 나열됩니다.
사전 행은 id, `name`, 그리고 물리명이나 컬럼에 주는 값과 함께 나열됩니다. 도메인은 `dataType`, 용어는 `physicalName`과 `domainId`, 단어는 `abbreviation`입니다. 각 사전은 그 시트가 보여 주는 순서대로 행을 나열합니다.
`erd_list`와 `erd_read`가 알려 주는 설정은 파일이 저장하는 설정입니다. [설정](#설정) 항목을 참고하세요.

`erd_get`과 `erd_read`의 `snapshot` 형식에서 모든 테이블과 컬럼은 `logicalName`(없으면 빈 문자열)과 `nameDerived`를 담습니다. `nameDerived`는 이름이 사전이 생성한 것일 때 `true`이며, 이때 새 논리명을 주면 이름이 다시 생성됩니다. [사전](#dictionaries) 항목을 참고하세요.
모든 컬럼과 모든 용어는 `domainId`를 담습니다. 도메인이 없거나 문서에 더 이상 없는 도메인이면 빈 문자열입니다.

`erd_read`는 네 가지 형식 중 하나를 받습니다.

| `format` | 응답 내용 |
| --- | --- |
| `snapshot` | 테이블 그룹과 단어, 용어, 도메인 행을 포함한 모든 엔티티와 그 id, 그리고 Schema SQL 스크립트를 포함한 설정을 담은 간결한 JSON입니다. 측정된 너비, 쌓임 순서, 화면, 탭, 이름 표시처럼 보는 사람마다 달라지는 것은 빠집니다. 스키마가 크면 커집니다. |
| `sql` | 8가지 데이터베이스 `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake`, `SQLite` 중 하나의 DDL입니다. `vendor`의 기본값은 문서에 설정된 데이터베이스입니다. 문서 전체의 DDL에는 문서의 앞뒤 스크립트가 포함됩니다. `tableIds`, `tableNames`, `groupNames`를 주면 해당 테이블만, 그 테이블이 가진 foreign key와 함께, 스크립트 없이 돌려줍니다. foreign key에는 ON DELETE와 ON UPDATE 동작이 함께 작성되며, 대상 데이터베이스가 생략하는 동작은 빠집니다. [ON DELETE와 ON UPDATE](../guide/guides/relationship-editing.md#on-delete와-on-update) 문서를 참고하세요. |
| `json` | 저장할 때 파일에 쓰이는 그대로의 문서 전체이며, 에디터가 아직 저장하지 않은 편집도 포함됩니다. [저장 형태와 런타임 값](../api/advanced/schema.md#저장-형태와-런타임-값) 문서를 참고하세요. |
| `scripts` | 스키마의 크기와 상관없이 문서의 앞뒤 스크립트만 `{"before":"…","after":"…"}` 형태로 돌려주며, 설정되지 않은 스크립트는 비어 있습니다. |

`vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames`, `groupNames`는 `sql` 형식만 받으며, 다른 형식은 이 인자를 거부합니다.

- `statements`: 기본값인 `create`, MySQL, MariaDB, PostgreSQL, SQLite, Databricks에서는 `CREATE TABLE IF NOT EXISTS`를, 그 밖의 데이터베이스에서는 일반 `CREATE TABLE`을 작성하는 `ifNotExists`, 또는 테이블을 생성하기 전에 삭제하는 `recreate` 중 하나입니다. `recreate`에서 Snowflake는 대신 `CREATE OR REPLACE TABLE`을 작성합니다.
- `header`: 기본값인 `none`, 문서의 데이터베이스 이름이 가리키는 데이터베이스나 스키마를 선택하는 `use`, 또는 그것을 먼저 생성하는 `createAndUse` 중 하나입니다. Oracle에는 `use`만 있으므로 Oracle에서 `createAndUse`는 `use`를 작성하고, PostgreSQL에는 `createAndUse`만 있으므로 PostgreSQL에서 `use`는 헤더를 작성하지 않습니다. SQLite는 헤더를 작성하지 않으며, 데이터베이스 이름이 비어 있거나 단순한 식별자가 아닌 동안에는 어느 데이터베이스도 헤더를 작성하지 않습니다.
- `logicalNameAsComment`: `true`는 테이블이나 컬럼의 코멘트가 비어 있거나 공백뿐인 동안 그 논리명을 코멘트로 작성하며, 각 데이터베이스가 코멘트를 작성하는 위치와 형식을 따르고, 텍스트가 있는 코멘트는 모두 그대로 둡니다. 기본값인 `false`는 논리명을 작성하지 않습니다. [논리명을 코멘트로 쓰기](../guide/guides/schema-sql.md#logical-names-as-comments) 문서를 참고하세요.
- `groupNames`: 이름을 지정한 테이블 그룹의 테이블입니다. 이름은 대소문자를 구분하지 않으며, `tableIds`와 `tableNames`의 테이블과 합쳐집니다. 어느 그룹과도 일치하지 않는 이름은 `notFound`로 거부됩니다. 테이블이 없는 그룹은 아무 테이블도 더하지 않으며, 지정한 그룹이 모두 비어 있고 테이블을 지정하지 않은 경우처럼 남는 테이블이 하나도 없는 읽기는 `invalidArgs`로 거부됩니다.

`statements`, `header`, `logicalNameAsComment`는 일부 테이블의 DDL에도 적용됩니다. 에디터의 [Schema SQL](../guide/guides/schema-sql.md#옵션-패널) 탭의 `Statements`, `Header` 옵션과 `Write logical names into empty comments` 스위치와 같이 동작하지만, 탭은 `If not exists`와 `CREATE + USE`에서 시작합니다. 스위치는 `logicalNameAsComment`와 마찬가지로 꺼진 상태에서 시작합니다.
이름은 파일이 저장하는 괄호 타입으로 감싸며, `Bracket Type`이 잠겨 있는 동안에는 잠긴 괄호 타입을 사용합니다. [잠금](../guide/guides/settings.md#잠금) 문서를 참고하세요.

### 대규모 스키마

테이블이 수백, 수천 개인 스키마에서도 동작합니다.
한 번의 읽기는 최대 40,000자까지 응답하며, 이는 Claude Code가 도구 결과를 파일로 따로 빼 두는 기준보다 작습니다.

- `erd_list`는 기본적으로 테이블, 테이블 그룹, 메모, 도메인, 용어, 단어 순으로 100개를 한 페이지로 응답하며 하나의 offset이 이들 전체에 걸쳐 이어지고, 다음 페이지가 시작하는 위치를 `nextOffset`과 `note`로 알려 줍니다. 그 `nextOffset`을 같은 `query`와 함께 `offset`으로 넘기세요.
- `query`는 테이블이나 컬럼의 이름, 논리명 또는 코멘트에 들어 있는 단어로, 대소문자를 구분하지 않고 테이블을 찾습니다. 이름이나 논리명에 단어가 더 많이 들어 있는 테이블이 먼저 나옵니다. 검색하면 테이블 그룹, 메모, 사전 행은 나열되지 않습니다.
- `namesOnly`는 테이블 이름만 나열하며, 짧은 이름이라면 한 번의 응답에 약 2,000개를 담습니다.
- `erd_get`과 `erd_read`는 id뿐 아니라 `tableNames`도 받고 `erd_read`는 `groupNames`도 받으므로, 큰 스키마에서 SQL 쿼리를 요청받은 에이전트는 필요한 테이블의 DDL만 읽을 수 있습니다.
- 사전도 나누어 받을 수 있습니다. `erd_list`는 테이블 뒤에 사전의 행을 페이지 단위로 넘기며, `erd_get`은 `domainIds`, `termIds`, `wordIds`로 행 전체를 돌려줍니다.
- `erd_get`은 아무것도 가리키지 않는 id와 이름을 `missing`에, 한 번의 응답에 담지 못한 id를 `notReturned`에 나열하므로 다시 요청할 수 있습니다.
- `erd_list_checks`도 같은 방식으로 한 페이지씩 응답합니다. [사전 검사](#dictionary-checks) 항목을 참고하세요.
- 한 번의 응답에 담기에 너무 큰 읽기는 범위를 좁히는 방법과 함께 `tooLarge`로 거부됩니다.

### 사전 검사 {#dictionary-checks}

`erd_list_checks`는 에디터의 [검사 시트](../guide/guides/dictionary.md#the-checks-sheet)가 담은 검사를 같은 순서로 나열합니다. 먼저 단어의 검사, 그다음 용어와 도메인의 검사가 각 사전의 시트가 보여 주는 순서대로 나오고, 그 뒤에 테이블마다 테이블의 검사와 이어서 그 컬럼의 검사가 나옵니다.
시트에서와 마찬가지로 검사는 그 검사가 읽는 사전에 행이 있는 동안에만 실행됩니다. 사전에 단어, 용어, 도메인이 하나도 없는 문서는 전혀 검사되지 않습니다. 이때 `total`은 `0`이고, `note`가 그렇게 알려 줍니다.

- `level`: `error` 또는 `warning`이면 그 수준만 나열합니다. 기본값은 둘 다입니다.
- `tableIds`와 `tableNames`: 해당 테이블과 그 컬럼의 검사만 나열하며, 사전 자체의 행은 제외됩니다. 이름은 대소문자를 구분하지 않습니다. 어느 테이블도 가리키지 않는 id나 이름은 `notFound`로 거부됩니다.
- `offset`과 `limit`: 기본적으로 검사 100개를 한 페이지로 응답하며, 한 번의 응답이 가득 차는 곳에서도 멈춥니다. 뒤에 검사가 더 있는 동안에는 `nextOffset`과 `note`가 다음 페이지가 시작하는 위치를 알려 주므로, 그 값을 같은 필터와 함께 `offset`으로 넘기세요. 검사 몇 개를 고친 뒤에는 offset `0`부터 다시 나열하세요. 고친 검사는 목록에서 빠지므로, 뒤쪽 offset을 쓰면 아직 고치지 않은 검사를 건너뛰게 됩니다.

응답에는 필터가 남긴 검사 수인 `total`, 그중 각 코드에 해당하는 수인 `counts`(해당하는 검사가 없는 코드는 제외), 그리고 페이지인 `checks`가 담깁니다.
각 검사는 `level`, `code`, 그리고 대상의 `kind`와 `id`를 알려 줍니다. `kind`는 `table`, `column`, `word`, `term`, `domain` 중 하나입니다. 컬럼의 검사에는 `tableId`와, `table`로 그 테이블의 이름이 더해집니다.
`name`은 대상의 이름이며, 테이블이나 컬럼이면 물리명이고, 논리명이 있으면 `logicalName`이 함께 나옵니다. `field`는 검사가 읽는 필드로, `name`, `logicalName`, `domainId` 중 하나입니다. `text`는 검사가 그 필드에서 찾은 내용이며, `suggestions`는 사전이 제안하는 것이 있을 때 대신 쓸 값입니다. 따라서 에이전트는 `erd_get` 없이도 검사를 고칠 수 있습니다.

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | 시트의 `Type` | 찾는 내용 |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | 한 사전에서 두 행이 같이 가진 이름입니다. 그 행이 각각 나열됩니다. |
| `unknownDomain` | `error` | `Unknown domain` | 문서에 더 이상 없는 도메인에 연결된 컬럼이나 용어입니다. `text`는 그 도메인의 이름이며, 이름을 알 수 없으면 id입니다. |
| `forbiddenWord` | `error` | `Forbidden word` | 테이블이나 컬럼의 논리명 또는 용어의 이름에 들어 있는, 어떤 단어가 금칙어로 나열한 단어입니다. `suggestions`는 표준 단어입니다. |
| `unregisteredWord` | `warning` | `Unregistered word` | 같은 위치에 있는, 어느 단어에도 나열되지 않은 텍스트입니다. |
| `synonymWord` | `warning` | `Synonym` | 같은 위치에서 표준 단어 대신 쓰인 이음동의어입니다. `suggestions`는 표준 단어입니다. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | 논리명에 해당하는 용어가 주는 물리명과 다른, 테이블이나 컬럼의 물리명입니다. 제안은 그 용어의 물리명이며, 용어에 물리명이 없으면 그 단어들이 조합하는 물리명입니다. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | 연결된 도메인의 데이터 타입과 다른 데이터 타입을 가진 컬럼입니다. `text`는 컬럼의 타입이고, 제안은 도메인의 타입입니다. |

각 검사가 이름을 읽는 방식은 [검사별로 찾는 내용](../guide/guides/dictionary.md#what-each-check-finds) 문서를 참고하세요.

## 편집 도구

id는 `erd_list`와 `erd_get`에서, 또는 엔티티를 만든 호출의 `createdIds`에서 얻습니다.
새 id는 `03h17be2plxpj5n59tqag7ogj`처럼 영문 소문자와 숫자 25자로 이루어지지만, 문서에 이미 있는 id는 원래 형태를 유지하므로 id의 모양으로 아무것도 판단하지 마세요.
`x`와 `y`는 캔버스 위의 왼쪽 가장자리와 위쪽 가장자리를 픽셀 단위로 나타내며, 색상은 `#3b82f6`과 같은 CSS hex 색상이거나, 색상을 지우는 빈 문자열입니다.

### 테이블

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_table` | | 빈 테이블을 비어 있는 자리에 추가하고 그 id를 `createdIds`로 돌려줍니다. |
| `erd_remove_table` | `tableId` | 테이블을 그 컬럼, 인덱스, 그리고 테이블에 연결된 모든 관계와 함께 삭제합니다. |
| `erd_change_table_name` | `tableId`, `value` | 테이블 이름을 바꿉니다. 이후 이 이름은 직접 입력한 이름이 되므로, 비어 있지 않은 동안에는 나중에 준 논리명이 이 이름을 그대로 둡니다. [사전](#dictionaries) 항목을 참고하세요. |
| `erd_change_table_comment` | `tableId`, `value` | 테이블 코멘트를 설정합니다. 빈 문자열을 주면 지웁니다. |
| `erd_set_table_logical_name` | `tableId`, `value` | 테이블의 논리명을 설정합니다. 빈 문자열을 주면 논리명을 지우고 이름은 그대로 둡니다. 테이블의 이름이 비어 있거나 생성된 이름인 동안에는 사전이 논리명에서 이름을 생성합니다. [사전](#dictionaries) 항목을 참고하세요. 용어는 테이블에 도메인을 주지 않습니다. |
| `erd_change_table_color` | `tableId`, `color` | 테이블 색상을 설정합니다. |
| `erd_move_table` | `tableId`, `x`, `y` | 테이블을 캔버스의 한 위치로 옮깁니다. |
| `erd_move_tables` | `positions` | 여러 테이블을 한 번의 편집으로 옮기며, `erd_undo` 한 번으로 되돌립니다. `positions`에는 테이블마다 `{ tableId, x, y }`를 담으며, 각 테이블은 한 번만 올 수 있습니다. |
| `erd_sort_tables` | | `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, `erd_import_aml`이 테이블을 배치하는 방식대로, 컬럼이 적은 테이블부터 모든 테이블을 캔버스에 여러 줄로 배치합니다. 테이블 그룹의 테이블은 한데 모이고, 각 그룹의 박스는 그 테이블에 맞춰집니다. |

### 컬럼

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | 테이블에 빈 컬럼을 추가하고 그 id를 `createdIds`로 돌려줍니다. |
| `erd_remove_columns` | `tableId`, `columnIds` | 한 테이블에서 컬럼을 삭제하며, 그 컬럼을 사용하는 관계와 인덱스 항목도 함께 삭제합니다. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | 컬럼 이름을 바꿉니다. 테이블 이름과 마찬가지로 이후 이 이름은 직접 입력한 이름이 됩니다. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | `INT`나 `VARCHAR(255)` 같은 데이터 타입을 설정합니다. [관계 데이터 타입 동기화](../guide/guides/settings.md#관계-데이터-타입-동기화)가 켜져 있는 동안에는 에디터에서와 마찬가지로 변경이 관계를 따라 양방향으로 이어집니다. serial 타입은 `erd_add_relationship`이 복사할 때처럼 그 serial이 저장하는 정수 타입으로 foreign key에 전달되며, serial 키는 그 foreign key 중 하나가 바뀌어도 자신의 타입을 유지하고 변경도 거기서 멈춥니다. 동기화를 켜고 끄는 것은 사용자의 몫이며, `erd_list`는 이 설정을 `relationshipDataTypeSync`로 알려 줍니다. 도메인에 연결된 컬럼은 도메인의 타입과 다른 타입으로 설정되면 그 도메인과의 연결이 해제되며, 동기화가 이어진 컬럼 중 새 타입이 자기 도메인의 타입과 다른 컬럼도 마찬가지입니다. [연결 해제](../guide/guides/dictionary.md#unlinking) 문서를 참고하세요. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | 기본값을 SQL 텍스트로 설정합니다. 빈 문자열을 주면 지웁니다. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | 코멘트를 설정합니다. 빈 문자열을 주면 지웁니다. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | 컬럼의 논리명을 설정합니다. 빈 문자열을 주면 논리명을 지우고 이름은 그대로 둡니다. 컬럼의 이름이 비어 있거나 생성된 이름인 동안에는 사전이 이름을 생성하며, 용어의 도메인이 컬럼에 연결되어 컬럼에 그 도메인의 데이터 타입을 줍니다. [사전](#dictionaries) 항목을 참고하세요. |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | 컬럼을 도메인에 연결합니다. 도메인은 id나 이름 중 하나로 지정합니다. 컬럼은 도메인의 데이터 타입을 가지며, 이 타입은 관계 데이터 타입 동기화가 켜져 있는 동안 관계를 따라 이어지고, `erd_change_column_data_type`과 같은 방식으로 연결이 해제됩니다. `domainId`를 `null`이나 빈 문자열로 주거나 `domainName`을 빈 문자열로 주면 컬럼의 연결을 해제하고 타입은 유지합니다. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true`는 컬럼을 primary key에 포함하고, `false`는 제외합니다. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | 컬럼이 unique인지 설정합니다. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | 컬럼이 `NOT NULL`인지 설정합니다. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | 컬럼이 자동 증가하는지 설정합니다. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | 컬럼을 같은 테이블 안에서 다른 컬럼의 위치로 옮깁니다. |

### 관계

`relationshipType`은 자식 쪽 끝의 카디널리티이며, `ZeroOne`, `ZeroN`, `OneOnly`, `OneN` 중 하나입니다.
시작 테이블은 부모, 즉 primary key를 가진 참조되는 쪽이고, 끝 테이블은 자식입니다.
`onDelete`와 `onUpdate`는 foreign key의 ON DELETE와 ON UPDATE 동작이며, `none`, `noAction`, `cascade`, `setNull`, `setDefault`, `restrict` 중 하나입니다.
`none`은 절을 작성하지 않으므로 데이터베이스의 기본 동작이 적용됩니다. [ON DELETE와 ON UPDATE](../guide/guides/relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.
`erd_add_relationship`이나 `erd_link_columns`에서 생략한 동작은 `none`입니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | 두 테이블을 관계로 연결합니다. 부모의 primary key를 자식에 foreign key 컬럼으로 복사하며, 부모에 primary key가 없으면 primary key 컬럼을 먼저 만듭니다. 각 foreign key 컬럼의 이름은 에디터에서 관계를 그릴 때와 같은 방식으로 정해집니다. `users`의 키 `id`는 `users_id`가 되고, `member_id` 같은 키는 이름이 그대로 유지됩니다. [Foreign Key 컬럼 이름](../guide/guides/relationship-editing.md#foreign-key-컬럼-이름) 문서를 참고하세요. 각 foreign key 컬럼은 키의 데이터 타입을 복사하지만, serial 키는 `serial4`이면 `integer`처럼 그 serial이 저장하는 정수 타입을 주며, 단독 `serial`은 PostgreSQL, MySQL, MariaDB가 아닌 데이터베이스에서는 `serial` 그대로입니다. [식별 관계](../guide/guides/relationship-editing.md#식별-관계) 문서를 참고하세요. 각 foreign key 컬럼은 키의 논리명도 가져오며, serial 키가 다른 타입을 주는 경우가 아니면 키가 연결된 도메인에 연결됩니다. `createdIds`에는 새로 만든 키 컬럼이 있으면 그 컬럼, foreign key 컬럼, 그리고 마지막으로 관계 id가 담깁니다. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | 이미 있는 컬럼 사이에 관계를 그리며, 시작 컬럼과 끝 컬럼을 위치 순서대로 짝짓습니다. 컬럼 이름도 데이터 타입도 바꾸지 않으며, 논리명이나 도메인도 복사하지 않습니다. |
| `erd_remove_relationship` | `relationshipId` | 관계 연결선을 삭제합니다. foreign key 컬럼은 테이블에 그대로 남습니다. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | 관계의 카디널리티를 바꿉니다. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | 관계의 ON DELETE 동작, 즉 부모 행을 삭제했을 때 자식 행에 일어나는 일을 설정합니다. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | 관계의 ON UPDATE 동작, 즉 부모 키를 변경했을 때 자식 행에 일어나는 일을 설정합니다. |

`erd_add_relationship`은 실행될 때 foreign key 컬럼의 이름을 정하고 키의 논리명을 복사합니다. 나중에 키의 이름이나 논리명을 바꿔도 foreign key 컬럼에는 반영되지 않으므로, 부모 테이블과 그 primary key의 이름을 먼저 지정하고 키에 논리명도 먼저 주세요.
이 도구가 정한 이름은 직접 입력한 이름으로 취급되므로 나중에 준 논리명은 이 이름을 그대로 두지만, `erd_derive_physical_names`는 이 이름을 다시 사전이 생성하는 이름으로 되돌립니다. [사전](#dictionaries) 항목을 참고하세요.

에디터의 [컬럼 매핑](../guide/guides/relationship-editing.md#컬럼-매핑)처럼 기존 관계의 컬럼을 바꾸는 도구는 없습니다.
관계를 다른 컬럼에 매핑하려면 foreign key 컬럼을 테이블에 남겨 두는 `erd_remove_relationship`과 원하는 컬럼을 준 `erd_link_columns`를 하나의 `erd_batch`로 실행하세요. 이 배치는 `erd_undo` 한 번으로 되돌립니다.

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

[View Option](../guide/guides/table-related-functions.md#테이블-보기-옵션) → `Memos`로 메모를 숨긴 동안에도 `erd_add_memo`는 메모를 추가하며, 추가된 메모는 메모를 다시 표시할 때까지 숨겨져 있습니다.
`erd_list`와 `erd_get`은 숨겨진 메모도 나열합니다.

### 테이블 그룹

테이블 그룹은 그 테이블 뒤에 그려지는 이름이 있는 박스이며, 그룹의 색상은 박스와 그 테이블들의 헤더 전체에 표시됩니다. [테이블 그룹](../guide/guides/table-groups.md) 문서를 참고하세요.
테이블은 최대 하나의 그룹에만 속합니다. 에디터에서는 테이블을 놓는 위치에 따라 테이블이 그룹에 들어가거나 빠지지만, `erd_move_table`, `erd_move_tables`, `erd_move_table_group`은 테이블을 어디에 놓든 그룹이 담는 테이블을 절대 바꾸지 않습니다. [테이블 추가와 제거](../guide/guides/table-groups.md#테이블-추가와-제거) 문서를 참고하세요. 테이블을 그룹에 넣는 것은 `erd_add_table_group`과 `erd_set_table_group`이며, `erd_remove_table_group`은 그 테이블을 어느 그룹에도 속하지 않게 둡니다.
그룹은 제목 표시줄을 포함해 너비 `160`픽셀 이상, 높이 `100`픽셀 이상인 영역을 저장하며, 에디터는 그 박스를 각 테이블을 담도록 늘려서 그립니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | 그룹을 추가하고 그 id를 `createdIds`로 돌려줍니다. `tableIds`와 영역 중 하나를 주며, 영역은 `x`, `y`, `width`, `height`를 함께 줍니다. `tableIds`를 주면 각 테이블은 원래 속해 있던 그룹에서 빠지고, 영역은 [선택한 테이블 그룹화](../guide/guides/table-groups.md#선택한-테이블-그룹화)에서처럼 그 테이블에 맞춰집니다. 영역을 주면 [그룹 그리기](../guide/guides/table-groups.md#그룹-그리기)에서처럼 어느 그룹에도 속하지 않은 테이블 중 중앙이 영역 안에 있는 테이블을 모두 담습니다. `name`이 빈 문자열이면 이름이 없는 그룹이 됩니다. `erd_undo` 한 번으로 그룹을 삭제하고 각 테이블을 원래 속해 있던 그룹으로 되돌립니다. |
| `erd_remove_table_group` | `groupId` | 그룹을 삭제합니다. 그 테이블은 어느 그룹에도 속하지 않은 채 제자리에 남습니다. |
| `erd_change_table_group_name` | `groupId`, `value` | 그룹 이름을 바꿉니다. 빈 문자열을 주면 이름이 없는 그룹이 됩니다. |
| `erd_change_table_group_color` | `groupId`, `color` | 그룹 색상을 설정합니다. |
| `erd_move_table_group` | `groupId`, `x`, `y` | 제목 표시줄을 드래그할 때처럼, 그룹의 영역이 그 지점에서 시작하도록 그룹을 옮기며 그 테이블도 같은 거리만큼 옮깁니다. 가로와 세로로 움직인 거리를 합해 20픽셀이 안 되는 이동은 Undo 항목을 만들지 않습니다. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | 그룹의 영역을 설정하며, 그 테이블은 제자리에 남습니다. `x`와 `y`를 생략하면 그룹의 모서리가 유지됩니다. 그룹의 테이블을 여유 공간과 함께 담지 못하는 영역은 거부되며, 메시지에 영역이 담아야 하는 박스가 표시됩니다. |
| `erd_set_table_group` | `tableIds`, `groupId` | 테이블을 그룹에 넣으며, 각 테이블은 원래 속해 있던 그룹에서 빠집니다. `groupId`를 `null`이나 빈 문자열로 주면 테이블을 모든 그룹에서 뺍니다. |

`View Option` → `Table Groups`로 그룹을 숨긴 동안에도 이 도구들은 그룹을 추가하고 변경하며, 그룹은 다시 표시할 때까지 숨겨져 있습니다. [그룹 숨기기](../guide/guides/table-groups.md#그룹-숨기기) 문서를 참고하세요.
`erd_sort_tables`는 각 그룹의 테이블을 한데 모아 두고, `erd_import_dbml`과 `erd_import_json`은 그룹을 가져옵니다. [가져오기](#가져오기) 항목을 참고하세요. `erd_read`는 `groupNames`로 고른 그룹의 DDL을 작성합니다.
`4.0.0` 이전의 VS Code 확장과 `1.0.0` 이전의 Obsidian, JetBrains 플러그인처럼 테이블 그룹이 도입되기 전의 ERD Editor 릴리스는 파일을 저장할 때 그 파일의 그룹을 버립니다. [업데이트](./installation.md#업데이트) 문서를 참고하세요.

### 사전 {#dictionaries}

이 도구들은 에디터의 [사전](../guide/guides/dictionary.md) 탭에 있는 세 사전을 편집합니다. 테이블이나 컬럼의 논리명은 이 사전에서 물리명을 생성합니다.

- 단어는 논리명을 이루는 표준 단어이며, `Member`와 `MBR`처럼 물리명에 쓰이는 약어를 함께 가집니다.
- 용어는 하나의 논리명 전체이며, `MBR_NO`와 `Identifier`를 가진 `Member Number`처럼 그 용어가 주는 물리명과, 컬럼이라면 그 용어가 연결하는 도메인을 함께 가집니다.
- 도메인은 `INT`에 대한 `Identifier`처럼 컬럼이 연결되는, 이름이 있는 데이터 타입입니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | 단어 사전의 끝에 단어를 추가하고 그 id를 `createdIds`로 돌려줍니다. `synonyms`와 `forbiddenWords`는 쉼표로 구분합니다. 각각 그 단어의 다른 표기와, 그 단어 대신 쓰면 안 되는 단어입니다. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | 전달한 필드를 바꾸고 나머지는 그대로 둡니다. |
| `erd_remove_word` | `wordId` | 단어를 삭제합니다. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | 용어 사전의 끝에 용어를 추가하고 그 id를 `createdIds`로 돌려줍니다. `physicalName`이 없으면 `Member Number`에 대한 `MBR_NO`처럼, 가능하다면 단어들이 물리명을 조합합니다. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | 전달한 필드를 바꾸고 나머지는 그대로 둡니다. 용어에 물리명이 없는 동안 `name`을 전달하거나 빈 `physicalName`과 함께 `name`을 전달하면, 단어들이 물리명을 조합할 수 있는 경우 그 물리명도 기록합니다. |
| `erd_remove_term` | `termId` | 용어를 삭제합니다. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | 도메인 사전의 끝에 도메인을 추가하고 그 id를 `createdIds`로 돌려줍니다. `category`는 `Number`나 `Text`처럼 도메인을 분류합니다. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | 전달한 필드를 바꾸고 나머지는 그대로 둡니다. 새 `dataType`은 그 도메인에 연결된 모든 컬럼에 전달되며, 관계 데이터 타입 동기화가 켜져 있는 동안 관계를 따라 이어지고, `erd_change_column_data_type`과 같은 방식으로 연결이 해제됩니다. |
| `erd_remove_domain` | `domainId` | 도메인을 삭제합니다. 그 도메인에 연결된 컬럼은 데이터 타입을 유지하며, 이 컬럼과 그 도메인에 연결된 용어에는 도메인이 표시되지 않습니다. 이들의 `domainId`는 빈 문자열로 읽힙니다. `erd_undo`는 연결을 되돌리며, 저장하면 파일에서 이 연결이 제외됩니다. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | 에디터의 [물리명 다시 생성](../guide/guides/dictionary.md#derive-physical-names-again)처럼 컬럼 하나, 테이블 하나, 또는 문서 전체에 대해 논리명에서 물리명을 다시 생성합니다. |

- 사전은 각 이름을 한 번만 담으므로, 같은 사전의 다른 행이 이미 가진 이름은 `invalidArgs`로 거부됩니다. 이름은 앞뒤 공백을 제거하고 대소문자를 구분해 비교하므로, `Member`와 `member`는 서로 다른 이름입니다.
- 수정은 id로 행을 지정하고 필드를 하나 이상 전달합니다. 행이 이미 가진 값은 아무것도 바꾸지 않으며 Undo 항목을 만들지 않습니다. 추가와 삭제는 항상 Undo 항목을 만듭니다.
- 용어의 도메인은 `domainId`(없음은 `null`이나 빈 문자열) 또는 `domainName`(없음은 빈 문자열)으로 지정합니다. `domainName`은 이름을 비교하는 방식대로 비교해, 사전의 순서에서 그 이름을 가진 첫 번째 도메인을 가져옵니다. 둘 다 전달하거나 어느 도메인도 갖지 않은 `domainName`을 전달하면 거부됩니다. `erd_set_column_domain`도 같은 방식으로 도메인을 받습니다.
- 단어나 용어를 바꾸거나 삭제해도 이름이 바뀌거나 연결이 해제되지는 않습니다. 그 단어나 용어가 준 이름과 도메인은 그대로 남습니다. `erd_derive_physical_names`는 이름을 다시 생성하고 용어가 지금 주는 도메인을 연결하지만, 지금 일치하는 용어가 없거나 용어가 도메인을 주지 않는 컬럼은 연결된 도메인을 유지합니다. 빈 `domainId`를 준 `erd_set_column_domain`이 그 연결을 해제합니다.
- 사전 탭에서처럼 사전을 CSV로 가져오거나 내보내거나, 사전을 정렬하거나, 특정 위치에 행을 삽입하는 도구는 없습니다.

`erd_list`는 행을 나열하고, `erd_get`은 모든 필드를 돌려주며, `erd_read`의 `snapshot` 형식은 모든 행을 담고, `erd_list_checks`는 사전이 찾아낸 문제를 나열합니다. [문서 읽기](#문서-읽기) 항목을 참고하세요.

`erd_set_table_logical_name`과 `erd_set_column_logical_name`은 에디터에서 논리명을 입력할 때와 같은 방식으로 물리명을 생성합니다. [물리명 생성](../guide/guides/dictionary.md#deriving-physical-names) 문서를 참고하세요.

- 이름은 비어 있거나 그 자체가 생성된 이름인 동안에만 생성되며, 읽기 도구는 생성된 이름을 `nameDerived: true`로 보여 줍니다. 비어 있지 않고 직접 입력한 이름은 그대로 남고, 논리명만 기록됩니다. `erd_change_table_name`, `erd_change_column_name`, SQL, GraphQL, DBML, AML 가져오기, 그리고 `erd_add_relationship`이 이름을 정하는 foreign key 컬럼은 모두 직접 입력한 이름을 씁니다. 이름을 빈 문자열로 바꾸면 다음 논리명이 그 이름을 다시 생성합니다.
- 사전의 이름을 비교하는 방식대로 비교해, 이름이 그 논리명인 용어가 우선합니다. 그 용어는 자신의 물리명을, 물리명이 없으면 그 단어들이 조합하는 물리명을 줍니다. 컬럼이라면 이름이 생성되지 않는 경우에도 용어의 도메인을 연결하며, 컬럼은 그 도메인의 데이터 타입을 가지고, 이 타입은 관계 데이터 타입 동기화가 켜져 있는 동안 관계를 따라 이어집니다.
- 그런 용어가 없으면 단어들이 약어를 밑줄로 이어 이름을 조합합니다. `Member Number`는 `MBR_NO`가 됩니다. 조합은 전부 되거나 전혀 되지 않습니다. 이음동의어, 금칙어, 어느 단어에도 나열되지 않은 텍스트, 약어가 없는 단어가 있으면 아무것도 조합하지 않으며, 이름은 원래대로 남습니다. 단어는 도메인을 연결하지 않고, 도메인이 없는 용어도 마찬가지이므로, 컬럼은 연결된 도메인을 유지합니다.
- 생성된 이름을 대소문자와 상관없이 같은 테이블의 다른 컬럼이 이미 가지고 있으면, 그 컬럼은 이름, `nameDerived`, 도메인을 유지합니다.
- 논리명을 지워도 물리명은 그대로 남습니다. 논리명과 그로부터 생성되는 결과가 이미 반영되어 있는 호출은 아무것도 바꾸지 않으며 Undo 항목을 만들지 않습니다.

`erd_derive_physical_names`는 `scope`를 받습니다. `tableId`, `columnId`와 함께 주는 `column`은 그 컬럼을, `tableId`와 함께 주는 `table`은 테이블의 이름과 그 모든 컬럼을, id 없이 주는 `document`는 모든 테이블과 그 컬럼을 대상으로 합니다. 필요한 id가 빠졌거나 받지 않는 id를 준 scope는 거부됩니다.
대상 중 논리명이 있는 이름은 직접 입력한 이름을 포함해 모두 다시 사전이 생성하는 이름으로 돌아가며, 사전이 지금 주는 값을 따릅니다. 용어의 물리명과, 컬럼이라면 그 용어의 도메인과 타입을 따르고, 그렇지 않으면 단어들의 조합을 따르며, 이때 컬럼의 도메인은 그대로 남습니다. 아무것도 생성하지 않는 논리명은 이름을 그대로 두지만, `nameDerived`는 이제 `true`가 됩니다. 논리명이 없는 이름은 그대로 남으며, 한 테이블을 가리키는 두 번째 foreign key처럼 새 이름을 같은 테이블의 다른 컬럼이 가지고 있는 컬럼도 그대로 남고 `nameDerived`도 유지합니다. `erd_undo` 한 번으로 호출 전체를 되돌립니다.
가져온 스키마의 이름은 직접 입력한 이름이므로, 사전으로 이름을 정하려면 논리명을 설정한 뒤 `erd_derive_physical_names`를 호출하세요. 이 호출은 용어 자체의 물리명을 주며, 용어의 단어를 바꿔도 이 물리명은 다시 조합되지 않습니다. 따라서 용어의 단어를 바꾼 뒤에는 먼저 용어를 수정하세요. 빈 `physicalName`과 함께 `name`을 전달해 단어들이 물리명을 새로 조합하게 하거나, 새 `physicalName`을 전달하세요.

`4.2.0` 이전의 VS Code 확장과 `1.2.0` 이전의 Obsidian, JetBrains 플러그인처럼 사전 탭이 도입되기 전의 ERD Editor 릴리스는 파일을 저장할 때 그 파일의 논리명, 도메인 연결, 사전 행을 버립니다. 그중 `4.0.0`이나 `4.1.0` 확장과 `1.0.0`이나 `1.1.0` 플러그인은 여전히 서버와 라이브로 편집하지만, 에이전트가 기록한 논리명, 도메인 연결, 사전 행을 표시하지도 유지하지도 않습니다. [업데이트](./installation.md#업데이트) 문서를 참고하세요.

### 설정

에이전트는 스키마 자체의 설정, 즉 데이터베이스, 데이터베이스 이름, [Schema SQL](../guide/guides/schema-sql.md) 스크립트를 설정합니다.
문서에 저장되는 그 밖의 모든 설정은 사용자가 에디터에서 설정합니다. [이름 표시](../guide/guides/logical-names.md#name-view), [View Option](../guide/guides/table-related-functions.md#테이블-보기-옵션) 토글, [설정](../guide/guides/settings.md) 탭의 옵션, Code Generator의 언어와 이름 케이스, 괄호 타입, [잠금](../guide/guides/settings.md#잠금)이 여기에 해당합니다.
`replace` 모드의 가져오기를 제외하면 어떤 도구도 이 설정을 바꾸지 않습니다. `erd_import_json`은 불러오는 문서의 설정과 잠금을 가져오고, 나머지 네 도구는 화면을 캔버스의 시작 위치로 되돌립니다. [가져오기](#가져오기) 항목을 참고하세요.
서버 `1.0.0`에서 이 설정을 바꾸던 도구가 제거되었습니다. `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings`, `erd_set_show`입니다.

`erd_list`와 `erd_read`의 `snapshot` 형식은 설정을 파일이 저장하는 대로 알려 주며, `lockSettings`는 잠금마다 하나씩 `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType`, `unlockNameViewMode` 플래그를 담습니다.
마지막 플래그는 반대로 읽힙니다. 새 문서와 이 잠금이 생기기 전에 저장한 파일에서처럼 `Name View` 잠금이 켜져 있는 동안에는 `false`이고, 사용자가 잠금을 끄면 `true`가 됩니다.
잠긴 언어, 이름 케이스, 괄호 타입은 에디터 화면에 무엇이 보이든 잠긴 값, 즉 파일이 유지하고 모든 에디터가 열 때 사용하는 값으로 알려 줍니다. 화면, 탭, 이름 표시는 알려 주지 않습니다. 에이전트는 이름 표시가 무엇을 보여 주든 논리명을 읽고 씁니다.

`erd_set_ddl_script`는 Undo 항목을 만듭니다. `erd_set_database`와 `erd_set_database_name`은 Undo 항목을 만들지 않으므로, `erd_undo`로 되돌릴 수 없습니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_set_database` | `value` | 데이터베이스를 설정합니다. `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks`, `Snowflake` 중 하나입니다. 그 데이터베이스의 데이터 타입과, `vendor`를 주지 않았을 때 `erd_read`가 쓰는 DDL을 정합니다. |
| `erd_set_database_name` | `value` | 데이터베이스 이름을 설정합니다. `erd_read`의 `use`와 `createAndUse` 헤더가 이 이름을 사용합니다. |
| `erd_set_ddl_script` | `position`, `sql` | 테이블 앞뒤에 작성되는 두 스크립트 중 하나를 설정합니다. [앞뒤 스크립트](../guide/guides/schema-sql.md#앞뒤-스크립트) 문서를 참고하세요. `position`은 `CREATE EXTENSION`이나 `CREATE SCHEMA`처럼 테이블 앞에 작성되는 `before`, 또는 `GRANT`나 `CREATE VIEW`처럼 테이블 뒤에 작성되는 `after`입니다. `sql`은 최대 10,000자로 스크립트 전체를 대체하며, 빈 문자열을 주면 스크립트를 지웁니다. 먼저 `erd_read`의 `scripts` 형식으로 현재 스크립트를 읽으세요. |

스크립트는 어느 데이터베이스의 DDL에든 그대로 들어가므로, 문서의 데이터베이스에 맞게 작성하세요. MSSQL에서는 마지막 줄이 `GO`가 아닌 스크립트 뒤에 `GO` 줄이 추가됩니다.
`4.0.0` 이전의 VS Code 확장과 `1.0.0` 이전의 Obsidian, JetBrains 플러그인처럼 이 스크립트가 도입되기 전의 ERD Editor 릴리스는 파일을 저장할 때 그 파일의 스크립트를 버립니다. [업데이트](./installation.md#업데이트) 문서를 참고하세요.

### 가져오기

이 도구들은 에디터의 Import 메뉴와 같은 방식으로 스키마를 읽습니다. [파일 가져오기와 내보내기](../guide/guides/file-import-export.md) 문서를 참고하세요.
각 도구는 텍스트를 `value`로 받고, `mode`로 기본값인 `replace` 또는 `append`를 받습니다.

| 도구 | 인자 | 동작 |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | `CREATE TABLE` 문 같은 SQL DDL을 불러옵니다. |
| `erd_import_graphql` | `value`, `mode?` | GraphQL SDL을 불러옵니다. |
| `erd_import_dbml` | `value`, `mode?` | DBML을 불러옵니다. 각 `TableGroup`은 그 블록이 이름을 나열한 테이블을 담는 테이블 그룹이 됩니다. [DBML](../guide/guides/file-import-export.md#dbml) 문서를 참고하세요. |
| `erd_import_aml` | `value`, `mode?` | AML을 불러옵니다. |
| `erd_import_json` | `value`, `mode?` | 다른 `.erd.json` 파일 같은 erd-editor JSON 문서를 불러옵니다. |

`replace`는 문서를 대체하며, `erd_undo`는 그 전의 문서를 복원합니다.

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, `erd_import_aml`은 모든 테이블, 관계, 인덱스, 메모, 테이블 그룹을 대체합니다. 잠금을 포함한 문서의 설정은 유지하지만, 화면은 확대/축소 100%로 캔버스의 시작 위치로 돌아갑니다. 문서의 단어 사전, 용어 사전, 도메인 사전도 유지합니다. 가져온 테이블에는 논리명이 없고 도메인에도 연결되지 않습니다.
- `erd_import_json`은 설정과 사전을 포함해 문서 전체를 대체합니다. JSON의 설정, 잠금, 단어, 용어, 도메인이 이 문서의 것을 대신하며, 잠금이 기록되지 않은 JSON은 모든 잠금을 켜고 화면을 캔버스의 시작 위치에 둡니다. 보는 사람은 각자 자신의 이름 표시를 유지하지만, JSON의 `Name View` 잠금이 꺼져 있으면 JSON의 이름 표시를 가져옵니다. 이 문서의 설정을 유지하려면 `erd_read`의 `json` 형식이 돌려주는 텍스트에서 시작하세요. 빈 텍스트를 주면 `erd_open_document`가 `create`로 만드는 문서와 같은 새 문서가 됩니다.

`append`는 에디터의 [가져와서 추가](../guide/guides/file-import-export.md#가져와서-추가)처럼 가져온 내용을 문서에 추가하며, `erd_undo` 한 번으로 추가한 내용 전체를 되돌립니다.

- 텍스트에 담긴 것은 새 id를 가진 새 엔티티로, 숨겨진 메모와 테이블 그룹을 포함해 문서에 있는 모든 것의 아래에 그 왼쪽 가장자리에 맞춘 블록으로 들어옵니다. 같은 이름의 테이블을 포함해 이미 있던 모든 테이블과 설정은 그대로 남으며, 이름으로 병합되는 것은 없습니다.
- 관계와 인덱스는 가져온 테이블 사이의 것만 들어오므로, 텍스트가 선언하지 않은 테이블을 가리키는 foreign key는 버려집니다.
- `erd_import_sql`, `erd_import_graphql`, `erd_import_aml`은 테이블을 관계, 인덱스와 함께 추가하고, `erd_import_dbml`은 테이블 그룹도 추가합니다. `erd_import_json`은 테이블, 관계, 인덱스, 메모, 테이블 그룹을 추가하지만 설정은 절대 추가하지 않으며, 빈 텍스트는 거부합니다. 테이블과 컬럼은 논리명을 가져오지만, 어떤 컬럼도 도메인에 연결되지 않으며, JSON의 단어, 용어, 도메인은 하나도 들어오지 않습니다.

JSON 문서는 테이블 그룹을 포함해 자체 배치를 유지합니다. `replace`에서는 JSON이 테이블을 놓은 자리 그대로, `append`에서는 추가된 블록 안에서 그 배치를 유지합니다.
SQL, GraphQL, DBML, AML의 테이블은 `erd_sort_tables`가 배치하는 방식대로 컬럼이 적은 테이블부터, 각 그룹의 테이블을 한데 모아 여러 줄로 배치되며, 에디터 자체의 Import가 가능할 때 하는 것처럼 `Flow`로 배치되는 일은 없습니다. 이 네 도구는 어느 모드에서든 빈 텍스트를 거부합니다.

## erd_batch

`erd_batch`는 여러 편집 도구를 순서대로, 전부 적용하거나 전혀 적용하지 않는 하나의 편집으로 실행합니다.

- `operations`에는 최대 100개의 항목을 담으며, 각 항목은 `{ tool, as?, args? }`이고, `tool`은 편집 도구, `args`는 `path`를 뺀 도구의 인자입니다. `erd_list_checks` 같은 읽기 도구는 거부됩니다.
- 작업은 먼저 문서의 복사본에서 시도됩니다. 거부된 작업은 `operations[1] erd_remove_table: …`처럼 이름이 표시되며, 아무것도 적용되지 않습니다.
- `erd_undo` 한 번으로 묶음 전체를 되돌리지만, 되돌릴 수 없는 작업은 예외이며 결과의 `undoNote`가 그 작업의 이름을 알려 줍니다. `erd_set_database`처럼 Undo 항목을 만들지 않는 도구의 작업과, 짧은 `erd_move_table_group`처럼 Undo 항목을 만들지 않고 문서를 바꾼 작업입니다. Undo 항목을 하나도 만들지 않은 묶음은 `erd_undo`가 건너뜁니다. 결과의 `historyEntries`는 `erd_undo` 호출 횟수가 아니라 묶음 안의 에디터 히스토리 항목 수를 셉니다.
- 라이브 세션에서는 에디터가 묶음 전체를 받아들이거나 전혀 받아들이지 않습니다.

에이전트는 호출하기 전에는 묶음이 만들 id를 알 수 없으므로, `as`로 이름을 붙인 작업은 뒤의 작업이 그 id를 참조할 수 있게 합니다. 첫 번째로 만든 id는 `$name` 또는 `$name.0`, 두 번째는 `$name.1`, 마지막은 `$name.last`입니다.
이름은 ASCII 영문자, 숫자, 밑줄로 이루어지고, 숫자로 시작할 수 없으며, 한 작업에만 붙일 수 있습니다.
참조는 `wordId`, `termId`, `domainId`를 포함해 엔티티 id를 받는 인자에서만 해석되므로, `$x`라고 쓴 이름이나 코멘트는 텍스트로 남습니다.
`domainName`도 텍스트이지만 그 작업이 실행될 때 읽히므로, 묶음의 앞선 작업이 추가한 도메인을 가리킬 수 있습니다.

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
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

관계보다 먼저 `users`와 그 키 `id`의 이름을 지정하므로, 관계가 `orders`에 추가하는 foreign key 컬럼은 `users_id`가 됩니다.

단어, 도메인, 용어를 만든 다음, 논리명을 주어 이들로부터 이름을 받는 테이블을 만드는 예입니다.

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

용어는 단어들로 `MBR_NO`를 조합하고, 테이블의 이름은 `MBR`이 됩니다. 컬럼 `Member Number`는 용어의 `MBR_NO`와 그 도메인을 가져오므로 `Identifier`에 연결되고 타입은 `INT`가 되며, 어느 용어에도 없는 `Member Name`은 `MBR_NM`으로 조합됩니다.

## 결과

편집은 한 줄의 JSON으로 응답합니다.

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| 필드 | 의미 |
| --- | --- |
| `mode` | `live` 또는 `headless`입니다. [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요. |
| `saved` | 헤드리스의 모든 편집, `erd_batch`, `erd_undo`, `erd_redo` 결과에서 `true`입니다. 호출이 응답할 때 이미 파일에 변경이 담겨 있으므로 저장할 것이 남지 않습니다. 라이브 결과에는 에디터가 변경을 담고 있으므로 `saved`가 없습니다. [저장](./live-and-headless.md#저장) 문서를 참고하세요. |
| `createdIds` | 호출이 만든 것의 id를 순서대로 담습니다. |
| `batches`, `historyEntries` | 호출이 보낸 변경 묶음 수와, 만든 에디터 히스토리 항목 수입니다. |
| `undoable`, `undoNote` | `erd_undo`가 이 호출을 건너뛸 때 `undoable`은 `false`이고, `undoNote`가 그 이유를 알려 줍니다. 도구가 Undo 항목을 만들지 않거나, 20픽셀이 안 되는 `erd_move_table_group`처럼 호출이 Undo 항목을 만들지 않고 문서를 바꿨거나, 문서가 이미 그 값을 가지고 있던 경우입니다. `erd_batch` 결과에는 항상 `undoNote`가 있습니다. 묶음이 Undo 항목을 만들었다면 `erd_undo` 한 번으로 묶음을 되돌린다고 알려 주고 되돌리지 않는 작업이 있으면 그 이름을 알려 주며, 만들지 않았다면 결과에 `undoable: false`가 담기고 `erd_undo`가 이 묶음을 건너뛴다고 알려 줍니다. |
| `mismatch` | 호출이 만든 묶음 수나 히스토리 항목 수가 도구가 선언한 수와 다를 때 들어 있습니다. |
| `notes` | 에디터가 종료되거나 문서를 더 이상 담당하지 않게 되거나, 디스크의 파일이 바뀌는 등 세션에 변화가 있었을 때 들어 있습니다. |

거부는 코드와, 무엇을 해야 하는지 알려 주는 메시지를 담은 오류 결과입니다.

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 이유 |
| --- | --- |
| `notFound` | id가 가리키는 대상이 현재 문서에 없거나, 파일이 존재하지 않습니다. |
| `invalidArgs` | 인자가 빠졌거나 값이 잘못되었습니다. |
| `invalidPath` | 경로가 ERD 문서가 아닙니다. Windows에서는 Windows가 적힌 그대로 저장하지 않는 이름이 들어간 경로이거나, 에디터가 다른 경로로 담고 있는 문서를 가리키는 경로일 때도 해당하며, 메시지에 그 다른 경로가 표시됩니다. |
| `invalidDocument` | 파일이 에디터가 읽을 수 있는 문서가 아닙니다. |
| `tooLarge` | 읽기 결과가 한 번의 응답에 담기지 않습니다. |
| `blocked` | 허브가 꺼진 에디터가 문서를 담고 있습니다. 메시지에 허브를 켜는 방법이 나옵니다. VS Code에서는 워크스페이스를 신뢰하고 `dineug.erd-editor.agentHub.enabled`를 켜거나 창을 다시 로드하고, Obsidian에서는 Coding agents를 켜거나 Obsidian을 다시 로드하고, JetBrains IDE에서는 Coding agents를 켜거나, 켜져 있다면 IDE를 다시 시작합니다. |
| `hubDisabled` | JetBrains IDE가 신뢰하지 않는 프로젝트에서만 문서를 담고 있습니다. 읽기는 그대로 동작하며, 에이전트가 편집하게 하려면 프로젝트를 신뢰하세요. |
| `conflict` | 호출 중에 디스크의 파일이 바뀌었습니다. 아무것도 쓰지 않았습니다. |
| `hubAppeared`, `hubGone` | 에이전트가 디스크에서 편집하던 문서를 에디터가 담당하기 시작했거나, 문서를 담당하던 에디터가 아직 실행 중이지만 잠금 파일과 연결이 사라졌습니다. 아무것도 쓰지 않았습니다. |
| `notSaved` | `erd_save`가 에디터의 문서를 저장하지 못했습니다. |
| `readonly` | 쓸 수 없거나 다이어그램으로 읽을 수 없는 파일처럼, 에디터가 문서를 읽기 전용으로 담고 있습니다. 에디터가 없으면 체크아웃하지 않은 Perforce 또는 TFVC 파일처럼 파일 자체가 읽기 전용입니다. 아무것도 쓰지 않았습니다. |
| `protocolMismatch` | 서버 `1.0.0` 이상과 `3.x` VS Code 확장처럼, 에디터의 ERD Editor 확장이나 플러그인과 서버가 서로 다른 프로토콜 버전을 사용합니다. 읽기도 거부되며, 메시지에 업데이트할 쪽이 표시됩니다. [업데이트](./installation.md#업데이트) 문서를 참고하세요. |
| `hubUnreachable`, `timeout`, `disconnected` | 에디터의 허브가 연결을 받아들이지 않았거나, 30초 안에 응답하지 않았거나, 호출 중에 연결을 끊었습니다. Windows에서 `hubUnreachable`은 Windows가 에이전트의 허브 접근을 막았다는 뜻이기도 합니다. 에디터를 관리자 권한으로 실행했는데 에이전트는 그렇지 않은 경우처럼 에디터가 에이전트보다 높은 권한으로 실행되거나, 에이전트가 샌드박스에서 실행되는 경우입니다. |

그 밖의 코드는 드물게 나오며, 모든 거부에는 무슨 일이 있었는지 알려 주는 메시지가 담깁니다.

편집 도구, `erd_batch`, 네 가지 읽기 도구는 선언하지 않은 인자나 타입이 잘못된 인자를 문서를 건드리기 전에 JSON-RPC invalid params 오류(`-32602`)로 거부하므로, 철자가 틀린 인자가 조용히 버려지는 일은 없습니다.
세션 도구 5개는 모르는 인자를 무시합니다.
