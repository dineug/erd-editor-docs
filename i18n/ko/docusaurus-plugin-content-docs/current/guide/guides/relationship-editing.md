---
sidebar_position: 6
description: 관계 삭제, 관계 타입 변경, ON DELETE와 ON UPDATE 동작 설정, 컬럼 매핑으로 기존 컬럼에 관계 매핑, 연결선 읽기, N:M 관계와 식별 관계, 새 foreign key 컬럼의 이름이 정해지는 방식.
---

# 관계 편집

관계는 캔버스 컨텍스트 메뉴, 캔버스 툴바, [빠른 검색](./quick-search.md#팔레트에-표시되는-항목) 또는 단축키로 생성합니다. [편집 시작하기](./editing-start.md) 문서를 참고하세요.  
이 문서는 생성된 관계로 할 수 있는 작업, [컬럼 매핑](#컬럼-매핑)으로 자식 테이블에 이미 있는 컬럼에서 관계가 끝나게 하는 방법, 관계가 추가하는 foreign key 컬럼의 이름이 정해지는 방식을 다룹니다.

## 삭제

관계 컨텍스트 메뉴를 통해 삭제 가능합니다.

![관계 컨텍스트 메뉴에서 products와 reviews 사이의 관계 삭제](/img/demo-relationship-remove.webp)

관계는 테이블이나 메모처럼 선택되지 않기 때문에 단축키가 없습니다. 선택한 것을 삭제하는 `Delete`와 `Backspace`도 관계를 단독으로 삭제하지는 않습니다. [테이블, 메모 삭제](./table-related-functions.md#테이블-메모-삭제) 문서를 참고하세요.  
또한 관계는 연결된 대상과 함께 삭제됩니다. 테이블을 삭제하면 그 테이블에 연결된 모든 관계가 삭제되고, 컬럼을 삭제하면 그 컬럼을 사용하는 모든 관계가 삭제됩니다.

## 타입 변경

관계 컨텍스트 메뉴의 `Relationship Type`을 통해 변경 가능합니다.  
4가지 타입을 제공하며, 현재 타입에는 체크 표시가 됩니다.

- Zero One
- Zero N
- One Only
- One N

![관계 컨텍스트 메뉴에서 타입을 Zero N에서 One Only, One N으로 차례로 변경](/img/demo-relationship-type.webp)

관계를 생성할 때 선택하는 4가지 타입과 같으며, 타입마다 단축키가 다릅니다. [편집 시작하기](./editing-start.md) 문서를 참고하세요.

## ON DELETE와 ON UPDATE

관계 컨텍스트 메뉴에서 `Relationship Type`과 `Map Columns` 사이에 있는 `On Delete`와 `On Update`로 설정합니다.  
둘 다 같은 6가지 항목을 제공하며, 현재 항목에는 체크 표시가 됩니다.

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set`은 절을 작성하지 않으므로 데이터베이스 자체의 기본 동작이 적용됩니다. 그려서 만들었든 [컬럼 매핑](#컬럼-매핑)에서 만들었든 새 관계는 둘 다 `Not set`인 상태로 시작하며, 나중에 `Not set`을 선택하면 설정한 동작이 해제됩니다.  
두 설정은 서로 독립적이므로, 하나를 바꿔도 다른 하나는 그대로 유지됩니다.  
설정된 내용은 연결선에 표시됩니다. [연결선 읽기](#연결선-읽기) 항목을 참고하세요.  
테이블과 함께 복사해 붙여넣거나 복제한 관계는 두 동작을 그대로 유지하며, Schema SQL, DBML, AML을 가져오면 파일에 선언된 동작도 함께 가져옵니다. [파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

![컨텍스트 메뉴에서 orders와 order_items 사이의 관계에 ON DELETE CASCADE와 ON UPDATE RESTRICT를 설정해 라벨이 D:C U:R로 표시된 뒤, 마우스를 올려 두 동작을 다시 확인하는 모습](/img/demo-referential-actions.webp)

데이터베이스와 상관없이 모든 동작을 선택할 수 있습니다.  
선택한 [데이터베이스](./table-related-functions.md#데이터베이스)가 Schema SQL에서 생략하는 동작에는 옆에 `not in MySQL`과 같은 안내 문구가 흐리게 표시됩니다. `Not set`에는 안내 문구가 붙지 않으며, 데이터베이스를 바꾸면 안내 문구도 갱신됩니다.  
안내 문구가 붙은 동작도 관계에는 저장됩니다. 연결선에 표시되고 JSON, DBML, AML에도 유지되지만, 해당 데이터베이스의 Schema SQL에서는 절이 빠지므로 데이터베이스의 기본 동작이 적용됩니다.

[Schema SQL](./schema-sql.md)은 다음 동작을 작성하며, 나머지는 생략합니다.

| 데이터베이스 | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | 없음 |
| PostgreSQL | 5가지 모두 | 5가지 모두 |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | 5가지 모두 | 5가지 모두 |

Snowflake의 Schema SQL은 생략하는 동작마다 그 동작을 밝히는 코멘트도 작성합니다. [참조 동작](./schema-sql.md#참조-동작) 문서를 참고하세요.

코드 생성의 ORM 대상이 어떤 동작을 작성하는지는 선택한 데이터베이스뿐 아니라 대상에 따라서도 달라집니다. [코드 생성](./code-generator.md#on-delete와-on-update) 문서를 참고하세요.

## 컬럼 매핑

컬럼 매핑은 부모 테이블의 키를 자식 테이블의 컬럼과 짝지으며, 키 컬럼마다 행이 하나씩 있습니다.  
각 행은 자식 테이블에 이미 있는 컬럼을 사용하거나 새 foreign key 컬럼을 추가하므로, 이미 갖춰진 컬럼에서 관계가 끝나게 할 수 있습니다.

![members에서 orders로 Zero N 관계를 그리다가 Map to existing columns를 선택하고, id를 기존 member_id 컬럼에 매핑하는 모습](/img/demo-map-columns.webp)

두 가지 방법으로 열 수 있습니다.

- 관계를 그리는 동안 자식 테이블 옆의 `Map to existing columns`에서 엽니다. [관계 생성](./editing-start.md#관계-생성) 문서를 참고하세요. 이때 `Map`은 그리고 있던 타입의 관계를 추가합니다.
- 이미 있는 관계의 컬럼을 바꾸려면 관계 컨텍스트 메뉴의 `Map Columns`에서 엽니다. 이때 `Save`가 변경 내용을 기록합니다. 읽기 전용 에디터에는 이 항목이 없습니다.

대화 상자의 부제목에는 `users → posts · One N`처럼 두 테이블과 관계 타입이 표시됩니다. 타입은 여기에 표시만 되고 바뀌지 않으므로, [타입 변경](#타입-변경)을 사용하세요.

`References`는 관계가 가리킬 키를 고릅니다. 컬럼이 테이블 순서대로 놓인 `Primary Key`가 먼저 오고, 이어서 `Unique`로 지정된 컬럼마다 `Unique: <column>`이 옵니다. 선택지가 두 개 이상일 때만 표시됩니다.  
여기서 unique 인덱스는 키로 치지 않으며, 그 자체로 primary key 전체인 `Unique` 컬럼은 두 번 나열되지 않습니다.  
다른 키를 고르면 행이 다시 만들어집니다. 행에서 고른 컬럼은 그 컬럼이 자식 테이블에 남아 있는 동안 유지됩니다.

`Referenced column`과 `Foreign key column` 제목 아래에서 각 행은 키의 컬럼과 그 데이터 타입, 그리고 짝지을 자식 테이블 컬럼의 목록을 보여 줍니다.

- `Pick a column`은 행을 비워 둡니다.
- `New column: <name>`은 새 foreign key 컬럼을 추가합니다. 표시되는 이름은 [Foreign Key 컬럼 이름](#foreign-key-컬럼-이름)에서 설명하는 대로 그 컬럼이 받게 될 이름이며, 번호는 자식 테이블의 컬럼과 새 컬럼을 추가하는 다른 행을 기준으로 붙습니다. 이름이 없는 키처럼 이름이 비게 되는 경우에는 제공되지 않습니다.
- 자식 테이블의 모든 컬럼이 `<name> (<data type>)` 형식으로 표시됩니다. 다른 행이 고른 컬럼은 `<name> (<data type>) · in use`로 표시되고 고를 수 없으므로, 두 행이 한 컬럼을 함께 쓰는 일은 없습니다. 다른 관계가 이미 사용하는 컬럼은 고를 수 있으므로, 공유하는 `tenant_id` 같은 컬럼이 여러 관계에 쓰일 수 있습니다.

`Map`에서는 그 행에 새 foreign key 컬럼을 만들 때 `_2` 같은 번호가 붙기 전의 이름을 가진 자식 테이블 컬럼이 대소문자를 무시하고 정확히 하나일 때만 행이 채워진 채로 시작합니다. `users`의 `id`에는 `users_id`, `member_id`에는 `member_id`가 해당합니다. [`Bracket`](./schema-sql.md#데이터베이스와-bracket)이 기본값인 `None`인 동안에는 스키마로 한정된 테이블 이름의 테이블 부분으로 만든 이름도 해당하므로, `public.users`의 `id`는 `public.users_id`나 `users_id`와 짝지어집니다. `Unique` 키에서는 키 컬럼 자체의 이름도 해당하므로 `vin`은 `vin`과 짝지어집니다. 나머지 행은 모두 `Pick a column`으로 시작합니다.  
`Save`에서는 각 행이 관계가 현재 사용하는 컬럼으로 시작합니다. 어느 쪽이든 `References`에서 다른 키를 고르면 그 키의 빈 행이 같은 이름 규칙으로 채워집니다.

고른 컬럼의 데이터 타입이 부모 컬럼이 foreign key에 주는 데이터 타입과 다르면 행 아래에 안내 문구가 표시됩니다.  
[관계 데이터 타입 동기화](./settings.md#관계-데이터-타입-동기화)가 켜져 있고 부모 컬럼에 데이터 타입이 있으면, 매핑이 기록할 타입을 담아 `<column> becomes <type>`으로 표시됩니다. 그렇지 않으면 `Types differ: <parent type> and <child type>`으로 표시되고, 컬럼은 자신의 타입을 유지합니다.

걸림돌이 있는 동안에는 `Map`이나 `Save`가 비활성화된 채로 남으며, 행 아래의 한 줄이 그 이유를 알려 줍니다.

- `Pick a foreign key column for every referenced column`: 아직 비어 있는 행이 있습니다.
- `At least one column must reference a different column`: 자기 참조 관계에서 모든 행이 자신의 부모 컬럼을 고른 경우입니다.
- `These columns are already linked by another relationship`: 같은 두 테이블 사이의 다른 관계가 정확히 이 컬럼들을 연결하고 있습니다.
- `<parent> has no key to reference`: `Map`에서 부모 테이블에 primary key도 `Unique` 컬럼도 없습니다.

`Save`는 또한 매핑이 관계의 현재 매핑과 달라질 때까지 비활성화된 채로 남습니다.  
`Save`에서는 행의 컬럼이 테이블에서 사라지면 그 행이 `(removed)`로 표시됩니다. 다른 자식 컬럼을 고르거나, 사라진 것이 부모 컬럼이면 `References`에서 키를 고릅니다. `Map`에서는 고른 컬럼이 삭제된 행이 `Pick a column`으로 돌아갑니다.

부모 쪽 컬럼이 부모 테이블의 키 중 어느 것과도 정확히 일치하지 않는 관계는 `References` 끝에 추가된 선택지 `Current columns (not a key)`가 선택된 채로 열리며, 이 선택지는 그 컬럼들을 그대로 유지합니다. 부모 테이블에 키가 전혀 없으면 이것이 유일한 선택지이며 `References`는 표시되지 않습니다.  
이때 표시되는 `The referenced columns are not a key of <parent>`, 또는 부모 테이블에 키가 전혀 없을 때의 `<parent> has no key to reference`는 오류가 아닌 안내입니다. `Save`는 그대로 동작하므로, 참조는 유지한 채 자식 컬럼을 바꿀 수 있습니다.  
길이가 다른 경우처럼 두 컬럼 목록을 짝지을 수 없는 관계는 `(invalid)` 행을 표시하며, `References`에서 키를 고르거나, 부모 테이블에 키가 없으면 primary key나 `Unique` 컬럼을 추가할 때까지 `Save`를 비활성화된 채로 둡니다.

대화 상자는 열려 있는 동안 공동 편집자나 코딩 에이전트의 편집을 포함해 다이어그램의 변경을 따라가며, 고른 내용은 유지합니다.  
그사이 관계의 컬럼이나 대화 상자를 열 때의 키가 바뀌면 `This relationship changed while the dialog was open` 줄이 추가됩니다.

`Map`과 `Save`가 기록하는 내용은 다음과 같습니다.

- `Map`은 `On Delete`와 `On Update`가 `Not set`인 관계를 추가합니다. `Save`는 관계의 컬럼만 바꾸어 부모 쪽이 `References`에서 고른 키를 가리키게 하며, 타입과 ON DELETE, ON UPDATE는 그대로 유지합니다.
- `New column` 행은 관계를 그릴 때처럼 자식 테이블 끝에 컬럼을 추가합니다. 이 컬럼은 `NOT NULL`이고, 키의 이름을 따라 이름이 정해지며, 키의 데이터 타입, 기본값, 코멘트를 가져옵니다. [식별 관계](#식별-관계) 항목을 참고하세요.
- 고른 컬럼은 이름이 바뀌지 않으며, `Not Null`, primary key, `Unique`, 기본값, 코멘트도 그대로 유지됩니다. 데이터 타입은 `Relationship DataType Sync`가 켜져 있고 부모 컬럼에 데이터 타입이 있을 때만 바뀝니다. 이때 컬럼은 부모 컬럼이 foreign key에 주는 타입을 받으며, serial 키라면 새 컬럼과 마찬가지로 정수 타입을 받고, 변경은 동기화와 같은 방식으로 관계를 따라 이어집니다.
- 매핑이 더 이상 사용하지 않는 컬럼은 자식 테이블에 남으며, 다른 관계가 여전히 그 컬럼에서 끝나지 않는 한 foreign key 표시가 사라집니다.
- `Map`이나 `Save` 한 번이 기록하는 모든 내용은 새 컬럼과 타입 변경을 포함해 Undo 한 단계입니다.

관계가 식별 관계인지, 부모 쪽 끝이 어떻게 그려지는지는 다른 관계와 마찬가지로 매핑된 자식 컬럼으로 정해집니다. 자식 테이블의 primary key 컬럼에 매핑하면 곧바로 식별 관계가 되고, `NULL`을 허용하는 컬럼에 매핑하면 부모 쪽 끝에 고리가 표시됩니다. [연결선 읽기](#연결선-읽기) 항목을 참고하세요.  
Schema SQL의 foreign key는 고른 키를 참조하며, `Unique` 키라면 `REFERENCES vehicle (vin)`과 같이 작성됩니다.

공동 편집자나 코딩 에이전트가 먼저 같은 매핑을 만들어 `Map`이나 `Save`를 누를 때 다이어그램에 이미 그 매핑이 있으면, 아무것도 기록되지 않습니다.  
다이어그램이 바뀌어 매핑이 더 이상 맞지 않으면 아무것도 기록되지 않고 `Couldn't map columns: the diagram changed` 토스트가 표시됩니다.

`Cancel`, `x` 버튼, `Escape`, 또는 대화 상자 바깥의 어두운 영역을 클릭하면 아무것도 기록하지 않고 닫힙니다.  
찾기와 바꾸기나 빠른 검색을 열어도 닫히며, ERD 탭을 벗어나거나 에디터가 읽기 전용으로 바뀌어도 닫힙니다.  
열려 있는 동안 두 테이블 중 하나나 관계가 삭제되면 `Map Columns closed: the relationship was removed`와 같은 토스트와 함께 닫힙니다.  
열려 있는 동안에는 캔버스 단축키, Undo와 Redo, 복사와 붙여넣기가 동작하지 않습니다.

코딩 에이전트에는 컬럼 매핑 도구가 없습니다. 대신 하나의 `erd_batch` 안에서 foreign key 컬럼을 남겨 두는 `erd_remove_relationship`으로 관계를 삭제하고, `erd_link_columns`로 기존 컬럼에 관계를 다시 그려 매핑을 바꿉니다. [도구](../../mcp/tools.md#관계) 문서를 참고하세요.

## N:M 관계

물리 기반이기 때문에 N:M 관계는 아래와 같이 매핑 테이블로 표현합니다.

![⌘ + ⌥ + 2로 products와 tags에서 차례로 빈 product_tags 테이블로 관계를 그려 product_id와 tag_id를 차례로 추가하는 모습](/img/demo-relationship-n-m.webp)

`product_tags`의 `product_id`와 `tag_id`처럼 매핑 테이블에 키 컬럼이 이미 있으면, 각 관계를 `Map to existing columns`로 그리고 새 컬럼을 추가하는 대신 그 컬럼들을 고릅니다. [컬럼 매핑](#컬럼-매핑) 항목을 참고하세요. 그 컬럼들이 매핑 테이블의 primary key이면 각 관계는 곧바로 식별 관계가 됩니다.

GraphQL, DBML, AML을 가져오면 매핑 테이블이 자동으로 생성됩니다.  
다대다 선언은 `<left>_<right>` 이름의 테이블로 만들어지고, `Junction table inferred from <left> <-> <right>` 코멘트가 붙으며, 양쪽과 식별 관계로 연결됩니다.  
[파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

## 식별 관계

자식 테이블을 클릭하거나 `Create new columns`로 관계를 그리면 부모 테이블의 primary key가 각각 자식 테이블에 `NOT NULL` foreign key 컬럼으로 복사되므로, 새로 만든 관계는 비식별 관계로 시작합니다.  
복사된 컬럼은 키의 데이터 타입, 기본값, 코멘트를 가져오지만 `Unique`와 `Auto Increment`는 가져오지 않으며, 이름은 [Foreign Key 컬럼 이름](#foreign-key-컬럼-이름) 항목에서 설명하는 대로 정해집니다.  
serial 키는 데이터 타입의 예외로, 복사된 컬럼은 serial이 저장하는 정수 타입을 가져옵니다. 어느 데이터베이스에서든 `smallserial`과 `serial2`는 `smallint`, `serial4`는 `integer`, `bigserial`과 `serial8`은 `bigint`가 됩니다. 단독 `serial`은 PostgreSQL에서 `integer`, MySQL과 MariaDB에서 `bigint unsigned`가 되며, 그 밖의 데이터베이스에서는 `serial` 그대로입니다.  
대소문자를 무시하고 타입 이름 전체가 일치할 때만 해당하므로 `serial(4)`는 작성된 그대로 복사됩니다. 대문자로 쓴 타입은 대문자가 되므로, PostgreSQL에서 `SERIAL`은 `INTEGER`가 됩니다. 저장된 다이어그램에서 이미 `serial` 타입인 foreign key 컬럼은 그 타입을 유지합니다.  
관계를 식별 관계로 만들려면 자식 테이블의 해당 foreign key 컬럼을 primary key로 지정합니다. 컬럼을 모두 선택하고 `Alt + K` (Windows/Linux) or `⌥ + K` (Mac)를 한 번 누르거나, 테이블 컨텍스트 메뉴에서 `Primary Key`를 선택합니다. 두 개 이상 선택된 동안에는 이 메뉴 항목이 `Primary Key on selected columns`로 표시됩니다. [Column Primary Key](./table-editing.md#column-primary-key) 문서를 참고하세요.

![Alt + K로 product_id를 primary key로 지정했다가 해제하며 연결선이 실선과 점선으로 바뀌는 모습](/img/demo-identifying-relationship.webp)

에디터가 이 상태를 자동으로 유지합니다.  
자식 쪽의 모든 컬럼이 primary key인 동안에는 식별 관계이며, 그중 하나라도 primary key가 아니게 되면 비식별 관계가 됩니다.

## Foreign Key 컬럼 이름

관계를 생성하면 추가되는 각 foreign key 컬럼의 이름은 그 컬럼이 복사하는 부모 키의 이름을 따릅니다.

- `id`, `ID`, `uuid`처럼 한 단어로 된 키 이름은 앞에 부모 테이블 이름과 밑줄이 붙습니다. `products` 테이블의 `id`는 `products_id`가 됩니다.
- `member_id`, `userId`, `UserID`처럼 여러 단어로 된 키 이름은 그대로 유지됩니다.
- 대소문자를 무시하고 테이블 이름과 같은 한 단어 키 이름도 그대로 유지됩니다. `currency` 테이블의 `currency`는 `currency` 그대로입니다. 테이블 이름을 포함하기만 한 키에는 여전히 접두사가 붙습니다. `user` 테이블의 `username`은 `user_username`이 됩니다.

이름이 글자와 숫자로만 이루어져 있고 대소문자가 바뀌는 지점이 없으면 한 단어입니다.  
그 밖의 문자는 단어를 나누므로 `_id`, `order no`, `order-no`는 여러 단어입니다.  
camelCase를 읽는 방식대로 대소문자가 바뀌는 지점도 단어를 나눕니다. 소문자 뒤에 대문자가 오는 경우(`userId`), 대문자 2개 뒤에 소문자가 오는 경우(`IDCard`, `IDs`), 한글, 가나, 한자처럼 대소문자 구분이 없는 문자 체계의 글자가 대소문자가 있는 글자와 붙어 있는 경우(`회원ID`)입니다.  
숫자는 단어를 나누지 않으므로 `id2`와 `SHA256`은 한 단어입니다. 한 가지 대소문자로 쓴 합성어도 한 단어입니다. `members` 테이블의 `memberid`는 `members_memberid`가 됩니다.

테이블 이름은 앞뒤 공백을 제외하면 작성된 그대로 사용됩니다. 대소문자, 중간의 공백과 점은 유지되고, 단수형으로 바뀌지 않으며, 코드 생성의 `Table Name Case`와 `Column Name Case`는 영향을 주지 않습니다. `Users` 테이블의 키 `ID`는 `Users_ID`가 됩니다.  
복합 키의 각 컬럼은 따로 이름이 정해집니다. 키가 (`tenant_id`, `id`)인 `orders`에서는 `tenant_id`와 `orders_id`가 추가됩니다.

대소문자를 무시하고 자식 테이블에 이미 있는 이름에는 `_2`, `_3` 등의 번호가 붙으며, 비어 있는 첫 번째 번호를 사용합니다.  
키가 `id`인 `users`에서 같은 테이블로 두 번째 관계를 생성하면 `users_id_2`가 추가되고, 키가 `member_id`인 `members`의 자기 참조 관계에서는 `member_id_2`가 추가됩니다.  
한 복합 키의 컬럼끼리도 같은 방식으로 번호가 붙으며, 그대로 유지되는 이름이 먼저 자리를 차지합니다. 키가 (`id`, `user_id`)인 `user`에서는 `user_id`에 대해 `user_id`가, `id`에 대해 `user_id_2`가 추가됩니다.

부모 테이블에 이름이 없으면 키 이름이 그대로 유지되며, 이름이 겹치면 다른 이름과 마찬가지로 번호가 붙습니다.  
이름이 없는 키에서는 이름이 없는 foreign key 컬럼이 만들어집니다.  
primary key가 없는 부모에 에디터가 추가하는 primary key도, 자식 테이블을 클릭하기 전에 이름을 지정하지 않으면 여기에 해당합니다.

이름은 관계를 생성할 때 정해집니다. 나중에 부모 테이블이나 키의 이름을 바꿔도 foreign key 컬럼의 이름은 바뀌지 않습니다.  
[컬럼 매핑](#컬럼-매핑)의 `New column` 행도 같은 규칙으로 이름이 정해지며, 고르기 전에 목록에서 각 이름을 확인할 수 있습니다.  
가져오기, 붙여넣기, 복제, 또는 기존 컬럼을 짝짓는 컬럼 매핑처럼 컬럼이 이미 갖춰진 채로 들어오는 관계는 그 컬럼의 이름을 그대로 유지합니다.  
코딩 에이전트가 `erd_add_relationship`으로 관계를 추가해도 같은 이름과 데이터 타입이 적용됩니다. [도구](../../mcp/tools.md#관계) 문서를 참고하세요.

## 연결선 읽기

- 식별 관계는 실선으로, 비식별 관계는 점선으로 그려집니다.
- 자식 쪽 끝에는 관계 타입의 카디널리티 기호가 표시됩니다. Zero One은 고리와 막대, Zero N은 고리와 까마귀 발, One Only는 막대 2개, One N은 막대와 까마귀 발입니다.
- 부모 쪽 끝은 foreign key 컬럼 중 하나라도 `NULL`을 허용하면 Zero One과 같은 고리와 막대로, 모두 `NOT NULL`이면 One Only와 같은 막대 2개로 표시됩니다.
- 연결선에 마우스를 올리면 연결선과 양쪽 테이블에서 연결된 컬럼이 함께 강조됩니다.

![연결선 3개에 차례로 마우스를 올려 연결된 컬럼과 함께 강조되는 모습](/img/demo-relationship-hover.webp)

[ON DELETE나 ON UPDATE](#on-delete와-on-update)를 설정한 관계는 자식 쪽 끝 옆에 `D:C U:R`과 같은 라벨이 표시됩니다. `D:` 뒤에 ON DELETE 동작이, `U:` 뒤에 ON UPDATE 동작이 오며, 각각 설정된 경우에만 표시됩니다.  
동작은 erwin 표기법을 따라 줄여 씁니다. CASCADE는 `C`, RESTRICT는 `R`, SET NULL은 `SN`, SET DEFAULT는 `SD`, NO ACTION은 `NA`입니다. 둘 다 설정하지 않은 관계에는 라벨이 없습니다.  
라벨은 자식 테이블에서 떨어진 쪽에 놓이며, 연결선이 그 테이블의 왼쪽이나 오른쪽 면에서 나가면 선 위에, 위쪽이나 아래쪽 면에서 나가면 선 오른쪽에 카디널리티 기호와 겹치지 않게 놓입니다.  
라벨은 캔버스 배경색의 작은 상자 위에 연결선과 같은 색으로 그려지며, 연결선과 함께 강조됩니다. 라벨은 모든 연결선보다 위에 그려지므로, 라벨을 가로지르는 선은 라벨 아래로 지나갑니다.  
라벨은 선택한 데이터베이스가 무엇을 작성하든 관계에 저장된 동작을 표시하므로, MySQL에서도 ON DELETE SET DEFAULT는 `D:SD`로 표시됩니다.

두 동작 중 하나라도 설정한 연결선에 마우스를 올리면 `ON DELETE CASCADE`, `ON UPDATE RESTRICT`처럼 절을 한 줄에 하나씩 풀어 쓴 툴팁도 표시됩니다.  
라벨이 숨겨져 있어도 툴팁은 표시됩니다.

`Relationship` 보기 옵션으로 ERD 캔버스의 연결선을 숨기거나, 기본으로 켜져 있는 `Referential Actions` 보기 옵션으로 라벨만 숨길 수 있습니다. [테이블 보기 옵션](./table-related-functions.md#테이블-보기-옵션) 문서를 참고하세요.  
테이블이 이름만 남도록 축소되는 `70%` 이하에서는 라벨이 그려지지 않습니다.  
[이미지 내보내기](./file-import-export.md#이미지)는 항상 100%로 그려지므로, 보기 옵션으로 숨기지 않는 한 캔버스 배율과 상관없이 라벨을 그립니다. `Background`를 끄면 각 라벨 뒤의 상자도 투명해집니다.  
Visualization 탭의 [Flow 모드](./visualization.md#flow-모드)는 `Relationship`이 꺼져 있어도 연결선을 그리며, 각 연결선을 끝 기호가 같은 매끄러운 회색 실선 곡선 하나로 표시합니다. 따라서 이 문서에서 설명하는 점선, 라벨, 툴팁, 직각 연결선 경로는 ERD 캔버스에만 적용됩니다. 테이블에서 자기 자신으로 가는 관계는 Flow에서도 오른쪽 위 모서리를 돌아가는 곡선으로 그려집니다. [연결선 경로](#연결선-경로) 항목을 참고하세요.

## 연결선 경로

연결선은 직각으로 배치됩니다.  
경로는 양 끝 사이에 있는 테이블을 가로지르지 않고 우회하며, 모서리는 둥글게 처리됩니다.  
각 끝은 꺾이기 전에 테이블에서 짧게 직선으로 뻗어 나오므로, 가까이 있는 두 테이블의 연결선 끝이 일직선에 놓이면 돌아가는 경로 대신 직선 하나로 이어집니다.  
테이블의 같은 면에서 나가는 경로는 서로 겹치지 않도록 각각 다른 통로로 분리됩니다.  
우회하는 대상은 테이블뿐입니다. 연결선은 메모나 테이블 그룹의 박스를 가로지를 수 있으며, 테이블 그룹보다 위에, 테이블과 메모보다 아래에 그려집니다.

테이블에서 자기 자신으로 가는 관계는 테이블의 오른쪽 위 모서리를 돌아가는 곡선 하나로 그려지며, 부모 쪽 끝은 위쪽 면에서 나가고 자식 쪽 끝은 오른쪽 면으로 들어갑니다.  
같은 테이블의 자기 참조 관계가 더 있으면 첫 번째 곡선의 바깥쪽에 차례로 놓이므로, 곡선끼리 서로 교차하거나 테이블과 교차하지 않습니다.

설정할 항목은 없습니다.  
캔버스에서 무언가 이동하거나 크기가 바뀔 때마다 경로가 자동으로 다시 계산되므로, 직접 손댈 필요가 없습니다.

![members 테이블을 아래로 드래그했다가 되돌리는 동안 orders에서 오는 연결선이 categories의 오른쪽을 지나는 경로와 왼쪽을 돌아가는 경로 사이를 오가며, 모든 모서리가 둥글게 그려지는 모습](/img/demo-connector-routing.webp)
