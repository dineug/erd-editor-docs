---
sidebar_position: 9
description: 다이어그램에서 14가지 대상의 코드 생성, 관계의 ON DELETE와 ON UPDATE 동작을 작성하는 대상, 테이블과 컬럼 이름 케이스 설정.
---

# 코드 생성

툴바의 `Code Generator` 탭으로 전환한 뒤, 코드 패널 안에서 마우스 오른쪽 클릭으로 컨텍스트 메뉴를 엽니다.  
메뉴는 `Language`, `Table Name Case`, `Column Name Case`를 제공합니다.

![코드 패널의 컨텍스트 메뉴에서 TypeScript와 테이블 이름 Snake를 고른 뒤 코드 복사하기](/img/demo-code-generator.webp)

같은 패널은 [테이블 속성](./table-related-functions.md#테이블-속성)의 `Code Generator` 탭이기도 하며, 여기서는 문서 전체가 아니라 해당 테이블 하나의 코드를 생성합니다.  
이 탭이 열려 있는 동안에는 3개의 메뉴를 [빠른 검색](./quick-search.md)에서도 사용할 수 있습니다.

## Language

14가지 대상을 지원합니다. 언어, ORM, 스키마 DSL 3개의 묶음 순으로 나열되며, 각 묶음 안에서는 알파벳 순서입니다:

| 대상 | 분류 | 관계 | 인덱스 | ON DELETE / ON UPDATE |
| --- | --- | --- | --- | --- |
| `C#` | Language | — | — | — |
| `Go` | Language | — | — | — |
| `Java` | Language | — | — | — |
| `Kotlin` | Language | — | — | — |
| `Scala` | Language | — | — | — |
| `TypeScript` | Language | — | — | — |
| `Drizzle` | ORM | ✓ | ✓ | ✓ |
| `JPA` | ORM | ✓ | — | — |
| `Sequelize` | ORM | ✓ | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ | ✓ |
| `AML` | Schema DSL | ✓ | ✓ | ✓ |
| `DBML` | Schema DSL | ✓ | ✓ | ✓ |
| `GraphQL` | Schema DSL | ✓ | — | — |

기본값은 `GraphQL`입니다. 모든 대상이 컬럼을 생성하며, ✓ 표시는 그 밖에 무엇을 함께 생성하는지 나타냅니다.  
테이블은 캔버스에 놓인 순서가 아니라 이름순으로 생성되며, 인덱스는 [테이블 속성](./table-related-functions.md#인덱스)의 `Indexes` 아래에 나열된 것을 사용하고 그 위의 `Keys` 행은 사용하지 않습니다.

`AML`, `DBML`, `GraphQL`은 왕복 가능한 형식으로, 각각 가져오기 소스이기도 합니다. [파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

## ON DELETE와 ON UPDATE

관계의 ON DELETE와 ON UPDATE 동작은 관계 컨텍스트 메뉴에서 지정합니다. [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.  
표의 마지막 열에 ✓ 표시가 있는 대상은 관계에 지정한 동작을 작성하며, `Not set`으로 둔 동작은 아무것도 작성하지 않습니다.  
ORM 대상이 어떤 동작을 유지하는지는 선택한 데이터베이스에 따라 다르며, `AML`과 `DBML`은 모든 동작을 유지합니다. [데이터베이스](#데이터베이스) 항목을 참고하세요.

- `Drizzle`은 동작을 소문자로 작성합니다. `.references()`에서는 `{ onDelete: "cascade", onUpdate: "set null" }`처럼 옵션으로 작성하고, 여러 컬럼으로 된 키에 생성되는 `foreignKey()`에서는 `.onDelete("restrict").onUpdate("no action")`처럼 체이닝합니다.
- `Sequelize`는 `onDelete: "CASCADE"`와 `onUpdate` 항목을 `hasMany` 또는 `hasOne`, 그리고 `belongsTo` 두 association 호출 모두에 작성합니다. 여러 컬럼으로 된 키에는 association 호출이 생성되지 않으므로, `Sequelize`는 그 키의 동작을 작성하지 않습니다.
- `SQLAlchemy`는 `ondelete="CASCADE"`와 `onupdate` 인자를 컬럼 하나로 된 키에서는 `ForeignKey()`에, 여러 컬럼으로 된 키에서는 `ForeignKeyConstraint()`에 전달합니다.
- `TypeORM`은 `onDelete: "CASCADE"`와 `onUpdate` 옵션을 관계를 소유하는 쪽의 `@ManyToOne` 또는 `@OneToOne`에 작성하며, 반대쪽에는 작성하지 않습니다. `SET DEFAULT`는 항상 제외합니다. TypeORM이 이를 어떤 데이터베이스도 받아들이지 않는 `DEFAULT`로 작성하기 때문입니다.
- `DBML`은 `[delete: set null, update: no action]`처럼 `Ref`에 설정을 추가합니다.
- `AML`은 동작이 있는 관계를 컬럼에 인라인으로 작성하지 않고, `{onDelete: cascade, onUpdate: "set null"}`처럼 속성을 붙인 독립된 `rel` 문으로 작성합니다.

`JPA`는 아무 동작도 작성하지 않습니다. 순수 JPA에는 이 동작을 지정하는 옵션이 없고, 생성기는 Hibernate의 `@OnDelete`를 사용하지 않습니다.  
테이블 하나만 보여 주는 테이블 속성의 `Code Generator` 탭에서는 `DBML`이 `Ref`를, `AML`이 `rel` 문을 작성하지 않으므로 둘 다 그곳에서는 동작을 보여 주지 않습니다. 그곳에서 `AML`은 동작이 있는 컬럼 하나로 된 관계도 동작이 없는 관계와 마찬가지로 컬럼에 인라인으로 작성합니다.

## Name Case

`Table Name Case`와 `Column Name Case`는 각각 `Pascal`, `Camel`, `Snake`, `None`을 지원합니다.  
기본값은 테이블 이름이 `Pascal`, 컬럼 이름이 `Camel`입니다. `None`은 다이어그램에 작성된 이름을 그대로 생성합니다.

`AML`과 `DBML`은 두 설정을 모두 무시하고 항상 다이어그램의 이름을 그대로 생성합니다.

## 데이터베이스

데이터 타입은 선택한 데이터베이스를 기준으로 결정되므로, 이 탭으로 전환하기 전에 먼저 선택합니다. [데이터베이스](./table-related-functions.md#데이터베이스) 문서를 참고하세요.  
`Drizzle`은 같은 설정에서 방언을 결정합니다. PostgreSQL은 `pgTable`, MySQL과 MariaDB는 `mysqlTable`, SQLite는 `sqliteTable`, 그 밖의 데이터베이스는 모두 `pgTable`입니다.

선택한 데이터베이스는 ORM 대상이 어떤 ON DELETE와 ON UPDATE 동작을 작성할지도 결정합니다.  
`Sequelize`, `SQLAlchemy`, `TypeORM`은 MySQL과 MariaDB의 `SET DEFAULT`나 MSSQL의 `RESTRICT`처럼 해당 데이터베이스의 Schema SQL이 제외하는 동작을 똑같이 제외하므로, 데이터베이스의 기본값이 적용됩니다. 전체 목록은 [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서에 있습니다.  
`Drizzle`은 대신 자신이 작성하는 방언을 따릅니다. `mysqlTable` 코드는 `SET DEFAULT`를 제외하고, `pgTable`과 `sqliteTable` 코드는 모든 동작을 유지합니다. MSSQL, Oracle, Snowflake, Databricks에 대해 작성하는 `pgTable` 코드도 마찬가지입니다.

`AML`과 `DBML`은 예외입니다. 데이터 타입을 다이어그램에 작성된 그대로 생성하고 관계에 지정한 동작도 모두 생성하므로, 데이터베이스 설정이 결과를 바꾸지 않습니다.

## 결과 복사

생성된 코드는 파일로 내보낼 수 없으므로 패널에서 복사합니다.  
패널에 마우스를 올린 뒤 오른쪽 위의 복사 버튼을 클릭하면 `Copied!` 토스트로 확인됩니다. 텍스트를 직접 선택할 수도 있어 필요한 부분만 가져올 수 있습니다.
