---
sidebar_position: 8
---

# 코드 생성

툴바의 `Code Generator` 탭으로 전환한 뒤, 코드 패널 안에서 마우스 오른쪽 클릭으로 컨텍스트 메뉴를 엽니다.  
메뉴는 `Language`, `Table Name Case`, `Column Name Case`를 제공합니다.

<img src="/img/code-generator.png" width="400" alt="코드 생성 메뉴" loading="lazy" />

같은 패널은 [테이블 속성](./table-related-functions.md#테이블-속성)의 `Code Generator` 탭이기도 하며, 여기서는 문서 전체가 아니라 해당 테이블 하나의 코드를 생성합니다.  
이 탭이 열려 있는 동안에는 3개의 메뉴를 [빠른 검색](./quick-search.md)에서도 사용할 수 있습니다.

## Language

14가지 대상을 지원합니다. 언어, ORM, 스키마 DSL 3개의 묶음 순으로 나열되며, 각 묶음 안에서는 알파벳 순서입니다:

| 대상 | 분류 | 관계 | 인덱스 |
| --- | --- | --- | --- |
| `C#` | Language | — | — |
| `Go` | Language | — | — |
| `Java` | Language | — | — |
| `Kotlin` | Language | — | — |
| `Scala` | Language | — | — |
| `TypeScript` | Language | — | — |
| `Drizzle` | ORM | ✓ | ✓ |
| `JPA` | ORM | ✓ | — |
| `Sequelize` | ORM | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ |
| `AML` | Schema DSL | ✓ | ✓ |
| `DBML` | Schema DSL | ✓ | ✓ |
| `GraphQL` | Schema DSL | ✓ | — |

기본값은 `GraphQL`입니다. 모든 대상이 컬럼을 생성하며, ✓ 표시는 그 밖에 무엇을 함께 생성하는지 나타냅니다.  
테이블은 캔버스에 놓인 순서가 아니라 이름순으로 생성되며, 인덱스는 테이블 속성에서 정의한 것을 사용합니다.

`AML`, `DBML`, `GraphQL`은 왕복 가능한 형식으로, 각각 가져오기 소스이기도 합니다. [파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

## Name Case

`Table Name Case`와 `Column Name Case`는 각각 `Pascal`, `Camel`, `Snake`, `None`을 지원합니다.  
기본값은 테이블 이름이 `Pascal`, 컬럼 이름이 `Camel`입니다. `None`은 다이어그램에 작성된 이름을 그대로 생성합니다.

`AML`과 `DBML`은 두 설정을 모두 무시하고 항상 다이어그램의 이름을 그대로 생성합니다.

## 데이터베이스

데이터 타입은 선택한 데이터베이스를 기준으로 결정되므로, 이 탭으로 전환하기 전에 먼저 선택합니다. [데이터베이스](./table-related-functions.md#데이터베이스) 문서를 참고하세요.  
`Drizzle`은 같은 설정에서 방언을 결정합니다. PostgreSQL은 `pgTable`, MySQL과 MariaDB는 `mysqlTable`, SQLite는 `sqliteTable`, 그 밖의 데이터베이스는 모두 `pgTable`입니다.

`AML`과 `DBML`은 예외입니다. 데이터 타입을 다이어그램에 작성된 그대로 생성하므로 데이터베이스 설정이 결과를 바꾸지 않습니다.

## 결과 복사

생성된 코드는 파일로 내보낼 수 없으므로 패널에서 복사합니다.  
패널에 마우스를 올린 뒤 오른쪽 위의 복사 버튼을 클릭하면 `Copied!` 토스트로 확인됩니다. 텍스트를 직접 선택할 수도 있어 필요한 부분만 가져올 수 있습니다.
