---
sidebar_position: 5
description: 관계 삭제, 관계 타입 변경, ON DELETE와 ON UPDATE 동작 설정, 연결선 읽기, N:M 관계와 식별 관계, 새 foreign key 컬럼의 이름이 정해지는 방식.
---

# 관계 편집

관계는 캔버스 컨텍스트 메뉴, 캔버스 툴바, [빠른 검색](./quick-search.md#팔레트에-표시되는-항목) 또는 단축키로 생성합니다. [편집 시작하기](./editing-start.md) 문서를 참고하세요.  
이 문서는 생성된 관계로 할 수 있는 작업과, 관계가 추가하는 foreign key 컬럼의 이름이 정해지는 방식을 다룹니다.

## 삭제

관계 컨텍스트 메뉴를 통해 삭제 가능합니다.

![관계 컨텍스트 메뉴에서 products와 reviews 사이의 관계 삭제](/img/demo-relationship-remove.webp)

관계는 테이블이나 메모처럼 선택되지 않기 때문에 단축키가 없습니다.  
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

관계 컨텍스트 메뉴에서 `Relationship Type`과 `Delete` 사이에 있는 `On Delete`와 `On Update`로 설정합니다.  
둘 다 같은 6가지 항목을 제공하며, 현재 항목에는 체크 표시가 됩니다.

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set`은 절을 작성하지 않으므로 데이터베이스 자체의 기본 동작이 적용됩니다. 새로 생성한 관계는 둘 다 `Not set`인 상태로 시작하며, 나중에 `Not set`을 선택하면 설정한 동작이 해제됩니다.  
두 설정은 서로 독립적이므로, 하나를 바꿔도 다른 하나는 그대로 유지됩니다.  
설정된 내용은 연결선에 표시됩니다. [연결선 읽기](#연결선-읽기) 항목을 참고하세요.  
테이블과 함께 복사해 붙여넣거나 복제한 관계는 두 동작을 그대로 유지하며, Schema SQL, DBML, AML을 가져오면 파일에 선언된 동작도 함께 가져옵니다. [파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

![컨텍스트 메뉴에서 orders와 order_items 사이의 관계에 ON DELETE CASCADE와 ON UPDATE RESTRICT를 설정한 뒤, 연결선에 마우스를 올려 다시 확인하는 모습](/img/demo-referential-actions.webp)

데이터베이스와 상관없이 모든 동작을 선택할 수 있습니다.  
선택한 [데이터베이스](./table-related-functions.md#데이터베이스)가 Schema SQL에서 생략하는 동작에는 옆에 `not in MySQL`과 같은 안내 문구가 흐리게 표시됩니다. `Not set`에는 안내 문구가 붙지 않으며, 데이터베이스를 바꾸면 안내 문구도 갱신됩니다.  
안내 문구가 붙은 동작도 관계에는 저장됩니다. 연결선에 표시되고 JSON, DBML, AML에도 유지되지만, 해당 데이터베이스의 Schema SQL에서는 절이 빠지므로 데이터베이스의 기본 동작이 적용됩니다.

Schema SQL은 다음 동작을 작성하며, 나머지는 생략합니다.

| 데이터베이스 | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | 없음 |
| PostgreSQL | 5가지 모두 | 5가지 모두 |
| Snowflake | 5가지 모두 | 5가지 모두 |
| SQLite | 5가지 모두 | 5가지 모두 |

코드 생성의 ORM 대상이 어떤 동작을 작성하는지는 선택한 데이터베이스뿐 아니라 대상에 따라서도 달라집니다. [코드 생성](./code-generator.md#on-delete와-on-update) 문서를 참고하세요.

## N:M 관계

물리 기반이기 때문에 N:M 관계는 아래와 같이 매핑 테이블로 표현합니다.

![products와 tags에서 매핑 테이블 product_tags로 각각 관계 생성](/img/demo-relationship-n-m.webp)

GraphQL, DBML, AML을 가져오면 매핑 테이블이 자동으로 생성됩니다.  
다대다 선언은 `<left>_<right>` 이름의 테이블로 만들어지고, `Junction table inferred from <left> <-> <right>` 코멘트가 붙으며, 양쪽과 식별 관계로 연결됩니다.  
[파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

## 식별 관계

관계를 생성하면 부모 테이블의 primary key가 각각 자식 테이블에 `NOT NULL` foreign key 컬럼으로 복사되므로, 새로 만든 관계는 비식별 관계로 시작합니다.  
복사된 컬럼은 키의 데이터 타입, 기본값, 코멘트를 가져오지만 `Unique`와 `Auto Increment`는 가져오지 않으며, 이름은 [Foreign Key 컬럼 이름](#foreign-key-컬럼-이름) 항목에서 설명하는 대로 정해집니다.  
식별 관계로 만들려면 자식 테이블의 해당 foreign key 컬럼을 `Alt + K` 또는 테이블 컨텍스트 메뉴의 `Primary Key`로 primary key로 지정합니다.

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
가져오기, 붙여넣기, 복제처럼 컬럼이 이미 갖춰진 채로 들어오는 관계는 그 컬럼의 이름을 그대로 유지합니다.  
코딩 에이전트가 `erd_add_relationship`으로 관계를 추가해도 같은 이름이 붙습니다. [도구](../../mcp/tools.md#관계) 문서를 참고하세요.

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
테이블이 이름만 남도록 축소되는 `70%` 이하에서는 라벨이 그려지지 않습니다. PNG 내보내기는 캔버스와 같은 방식으로 라벨을 그립니다.  
Visualization 탭의 [Flow 모드](./visualization.md#flow-모드)는 `Relationship`이 꺼져 있어도 연결선을 그리며, 각 연결선을 끝 기호가 같은 매끄러운 회색 실선 곡선 하나로 표시합니다. 따라서 이 문서에서 설명하는 점선, 라벨, 툴팁, 연결선 경로는 ERD 캔버스에만 적용됩니다.

## 연결선 경로

연결선은 직각으로 배치됩니다.  
경로는 양 끝 사이에 있는 테이블을 가로지르지 않고 우회하며, 모서리는 45도로 깎입니다.  
테이블의 같은 면에서 나가는 경로는 서로 겹치지 않도록 각각 다른 통로로 분리됩니다.

설정할 항목은 없습니다.  
캔버스에서 무언가 이동하거나 크기가 바뀔 때마다 경로가 자동으로 다시 계산되므로, 직접 손댈 필요가 없습니다.

![members 테이블을 아래로 드래그했다가 되돌리는 동안 categories를 우회하도록 다시 계산되는 연결선 경로](/img/demo-connector-routing.webp)
