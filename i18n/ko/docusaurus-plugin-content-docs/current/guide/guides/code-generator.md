---
sidebar_position: 11
description: 다이어그램에서 22가지 대상의 코드 생성, 옵션 패널에서 언어·데이터베이스·이름 케이스·Bracket 선택, 관계의 ON DELETE와 ON UPDATE 동작을 작성하는 대상, 결과 저장과 복사.
---

# 코드 생성

툴바의 `Code Generator` 탭으로 전환합니다. 탭은 왼쪽에 문서 전체의 코드를, 그 오른쪽에 `Code Generator`라는 제목의 옵션 패널을 보여 주며, 이 패널에서 언어, 데이터베이스, 이름 케이스, 그리고 일부 대상에서는 `Bracket`을 고릅니다.  
탭을 처음 열 때 에디터의 너비가 640 px보다 좁지 않으면 패널이 자동으로 열립니다. 패널 위쪽의 `Hide options`는 패널을 접고, 코드 오른쪽 위의 `Show options`는 패널을 다시 엽니다. 패널이 열려 있거나 접혀 있는 상태는 에디터가 열려 있는 동안 탭을 전환해도 유지되며, Schema SQL 탭의 패널과는 따로 유지되고, 파일에는 저장되지 않습니다.

코드에서 마우스 오른쪽 클릭으로 컨텍스트 메뉴를 엽니다. 메뉴에는 `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket`(`Doctrine`, `JPA`, `SeaORM`에서만)이 있으며, 각각 현재 값에 체크 표시가 된 하위 메뉴를 엽니다. 그 뒤로 패널을 접거나 열며 패널이 표시되는 동안 체크 표시가 되는 `Options panel`, 그리고 `Save file…`이 이어집니다.  
이 탭이 열려 있는 동안 [빠른 검색](./quick-search.md)에는 `Database`, `Bracket`(`Doctrine`, `JPA`, `SeaORM`에서만), `Language`, `Table Name Case`, `Column Name Case`, 그리고 패널을 접거나 여는 `Code Generator: Options panel`이 표시됩니다.

![코드의 컨텍스트 메뉴에서 TypeScript에 이어 Rust를 고르고, 옵션 패널에서 컬럼 이름을 Snake로 바꾼 뒤 코드 복사하기](/img/demo-code-generator.webp)

같은 코드 보기는 [테이블 속성](./table-related-functions.md#테이블-속성)의 `Code Generator` 탭이기도 하며, 여기서는 문서 전체가 아니라 해당 테이블 하나의 코드를 생성합니다. 그곳에는 옵션 패널이 없으며, 컨텍스트 메뉴는 같은 설정을 변경하지만 `Options panel`과 `Save file…`은 없습니다.  
문서 전체의 코드가 import나 헤더로 시작하는 대상에서는 테이블 하나의 코드도 그 테이블에 필요한 것으로 시작합니다. 예를 들어 `PHP`는 `<?php`, `Swift`는 `import Foundation`, `JSON Schema`는 `$schema`로 시작합니다.

코드는 탭을 열 때 작성되고, 언어, 데이터베이스, 이름 케이스, `Bracket` 중 하나가 바뀔 때마다 다시 작성됩니다. 공동 편집자나 코딩 에이전트의 편집처럼 탭이 열려 있는 동안 다이어그램에 일어난 편집은 탭을 떠났다가 돌아오거나 그 설정 중 하나가 바뀌면 표시됩니다.

## 옵션 패널

패널은 `Saved in the document` 캡션 아래에 `Language`, `Database`, `Table Name Case`, `Column Name Case`를 나열하며, 언어가 `Doctrine`, `JPA`, `SeaORM`인 동안에는 그 뒤에 `Bracket`이 이어집니다. 각각 드롭다운 목록이며, 값을 바꾸면 코드가 바로 다시 작성됩니다.  
선택한 언어가 `Database`나 이름 케이스를 무시하면, 해당 항목은 흐리게 패널에 남고 그 아래에 `Not used by DBML` 같은 안내 문구가 표시되며, 값은 그대로 바꿀 수 있습니다.  
패널 아래쪽에는 `Save file`과 `Copy`가 있습니다. [결과 저장과 복사](#결과-저장과-복사) 항목을 참고하세요.

이 값들은 다이어그램 자체의 설정이며, 컨텍스트 메뉴와 빠른 검색이 바꾸는 설정과 같습니다. `Database`는 다른 편집과 마찬가지로 파일에 저장됩니다.  
`Language`, `Table Name Case`, `Column Name Case`, `Bracket`은 설정 탭에서 각각의 잠금(`Bracket`은 `Bracket Type`)이 꺼져 있는 동안에만 저장되며, 새 다이어그램에서는 모든 잠금이 켜져 있습니다. 잠금이 켜져 있는 동안 값을 바꾸면 화면의 코드는 다시 작성되지만, 파일은 잠긴 값을 유지하고 다이어그램도 그 값으로 다시 열립니다. 패널에는 잠금 여부가 표시되지 않습니다. 고른 값을 파일에 남기려면 해당 잠금을 끄세요. [잠금](./settings.md#잠금) 문서를 참고하세요.

## Language

22가지 대상을 지원합니다. 언어, ORM, 스키마 3개의 묶음 순으로 나열되며, 각 묶음 안에서는 알파벳 순서입니다. 패널의 목록과 컨텍스트 메뉴는 묶음 사이에 구분선을 두지만 묶음의 이름은 표시하지 않습니다:

| 대상 | 분류 | 관계 | 인덱스 | ON DELETE / ON UPDATE | 저장 확장자 |
| --- | --- | --- | --- | --- | --- |
| `C#` | Language | — | — | — | `.cs` |
| `Go` | Language | — | — | — | `.go` |
| `Java` | Language | — | — | — | `.java` |
| `Kotlin` | Language | — | — | — | `.kt` |
| `PHP` | Language | — | — | — | `.php` |
| `Rust` | Language | — | — | — | `.rs` |
| `Scala` | Language | — | — | — | `.scala` |
| `Swift` | Language | — | — | — | `.swift` |
| `TypeScript` | Language | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | ON DELETE만 | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Unique만 | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

기본값은 `GraphQL`입니다. 모든 대상이 컬럼을 생성하며, ✓ 표시는 그 밖에 무엇을 함께 생성하는지 나타냅니다.  
테이블은 캔버스에 놓인 순서가 아니라 이름순으로 생성되며, 인덱스는 [테이블 속성](./table-related-functions.md#인덱스)의 `Indexes` 아래에 나열된 것을 사용하고 그 위의 `Keys` 행은 사용하지 않습니다. `SeaORM`은 그중 Unique 인덱스만 작성하며, `Mermaid`는 Unique 컬럼에 `UK`를 표시하지만 인덱스는 작성하지 않습니다.  
`Java`, `AML`, `DBML`, `Mermaid`를 제외한 모든 대상은 primary key 컬럼을 `Not Null` 설정 여부와 상관없이 not null로 작성합니다. `Java`는 어떤 컬럼에도 nullable 여부를 표시하지 않으며, `AML`, `DBML`, `Mermaid`는 다이어그램에 설정된 그대로 유지합니다.

일부 대상이 작성하는 내용은 다음과 같습니다:

- `PHP`: 타입이 지정된 public 속성으로 이루어진 일반 클래스이며, `<?php`와 `declare(strict_types=1);`로 시작합니다.
- `Doctrine`: DBAL 4.2 이상을 위한, attribute를 사용하는 Doctrine ORM 3 엔티티이며, 각 컬럼에는 선택한 데이터베이스에 맞는 DBAL 타입과 옵션이 붙습니다.
- `Rust`: 테이블마다 `pub struct` 하나를 작성하며, 타입은 `chrono::NaiveDateTime`이나 `rust_decimal::Decimal`처럼 전체 경로로 쓰고 `use` 줄은 없습니다.
- `SeaORM`: dense 형식의 SeaORM 2.0 엔티티이며, 각 테이블이 `pub mod` 하나이므로 전체 텍스트가 파일 하나로 컴파일됩니다.
- `Swift`: 테이블마다 `Codable`, `Hashable`, `Sendable` struct 하나를 작성하며, Swift 6.1 이상이 필요합니다.
- `TypeScript`: `Zod` 스키마와 마찬가지로 행을 JSON으로 기술하는 `export interface`를 테이블마다 하나씩 작성합니다. 날짜나 시간은 `string`이고, nullable 컬럼은 `T | null`입니다.
- `Zod`: 테이블마다 Zod 4 행 스키마와 그 스키마가 추론하는 타입을 작성하며, insert 스키마와 relation은 없습니다.
- `JSON Schema`: JSON Schema draft 2020-12 문서 하나이며, `$defs` 아래에 테이블마다 행 스키마가 있습니다.
- `Mermaid`: GitHub가 렌더링하는 종류의 `erDiagram`입니다. 각 테이블은 모든 컬럼을 타입, 그리고 `PK`, `FK`, `UK` 표시와 함께 나열하는 엔티티이고, 각 관계는 두 테이블 사이의 선입니다.

`AML`, `DBML`, `GraphQL`은 왕복 가능한 형식으로, 각각 가져오기 소스이기도 합니다. [파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요. 나머지 스키마인 `JSON Schema`, `Mermaid`, `Zod`는 출력 전용입니다.  
`DBML`은 각 테이블의 색상을 `headercolor`로 작성하며, 문서 전체의 코드에서는 테이블이 들어 있는 각 [테이블 그룹](./table-groups.md)마다 `Ref` 뒤에 `TableGroup` 블록을 작성합니다. `AML`은 테이블 색상을 AML의 색상 이름 중 가장 가까운 것으로 작성합니다.

## ON DELETE와 ON UPDATE

관계의 ON DELETE와 ON UPDATE 동작은 관계 컨텍스트 메뉴에서 지정합니다. [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.  
[Language](#language) 표의 `ON DELETE / ON UPDATE` 열에 ✓ 표시가 있는 대상은 관계에 지정한 동작을 작성하며, `Not set`으로 둔 동작은 아무것도 작성하지 않습니다.  
ORM 대상이 어떤 동작을 유지하는지는 선택한 데이터베이스에 따라 다르며, `AML`과 `DBML`은 모든 동작을 유지합니다. [데이터베이스](#데이터베이스) 항목을 참고하세요.

- `Doctrine`은 Doctrine에 ON UPDATE가 없으므로 ON DELETE만 작성합니다. 관계를 소유하는 쪽의 `ManyToOne` 또는 `OneToOne`에 붙는 각 `#[ORM\JoinColumn]`에 `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`처럼 `onDelete: 'CASCADE'`를 추가하며, 반대쪽의 `OneToMany` 또는 `OneToOne`에는 아무것도 작성하지 않습니다. primary key가 아닌 Unique 컬럼을 참조하는 관계는 일반 컬럼으로 남고 Doctrine은 이를 association 없이 매핑하므로, 동작을 작성하지 않습니다.
- `Drizzle`은 동작을 소문자로 작성합니다. `.references()`에서는 `{ onDelete: "cascade", onUpdate: "set null" }`처럼 옵션으로 작성하고, 여러 컬럼으로 된 키에 생성되는 `foreignKey()`에서는 `.onDelete("restrict").onUpdate("no action")`처럼 체이닝합니다.
- `SeaORM`은 자식의 `belongs_to` relation에 ON UPDATE부터 작성하며, `on_update = "Cascade", on_delete = "SetNull"`처럼 SeaORM의 이름인 `NoAction`, `Cascade`, `SetNull`, `SetDefault`, `Restrict`를 사용합니다. 부모의 `has_one` 또는 `has_many`에는 작성하지 않습니다.
- `Sequelize`는 `onDelete: "CASCADE"`와 `onUpdate` 항목을 `hasMany` 또는 `hasOne`, 그리고 `belongsTo` 두 association 호출 모두에 작성합니다. 여러 컬럼으로 된 키에는 association 호출이 생성되지 않으므로, `Sequelize`는 그 키의 동작을 작성하지 않습니다.
- `SQLAlchemy`는 `ondelete="CASCADE"`와 `onupdate` 인자를 컬럼 하나로 된 키에서는 `ForeignKey()`에, 여러 컬럼으로 된 키에서는 `ForeignKeyConstraint()`에 전달합니다.
- `TypeORM`은 `onDelete: "CASCADE"`와 `onUpdate` 옵션을 관계를 소유하는 쪽의 `@ManyToOne` 또는 `@OneToOne`에 작성하며, 반대쪽에는 작성하지 않습니다. `SET DEFAULT`는 항상 제외합니다. TypeORM이 이를 어떤 데이터베이스도 받아들이지 않는 `DEFAULT`로 작성하기 때문입니다.
- `DBML`은 `[delete: set null, update: no action]`처럼 `Ref`에 설정을 추가합니다.
- `AML`은 동작이 있는 관계를 컬럼에 인라인으로 작성하지 않고, `{onDelete: cascade, onUpdate: "set null"}`처럼 속성을 붙인 독립된 `rel` 문으로 작성합니다.

`JPA`는 아무 동작도 작성하지 않습니다. 순수 JPA에는 이 동작을 지정하는 옵션이 없고, 생성기는 Hibernate의 `@OnDelete`를 사용하지 않습니다. `Mermaid`도 `erDiagram`의 선에는 동작을 둘 자리가 없으므로 아무 동작도 작성하지 않습니다.  
테이블 하나만 보여 주는 테이블 속성의 `Code Generator` 탭에서는 `DBML`이 `Ref`를, `AML`이 `rel` 문을 작성하지 않으므로 둘 다 그곳에서는 동작을 보여 주지 않습니다. 그곳에서 `AML`은 동작이 있는 컬럼 하나로 된 관계도 동작이 없는 관계와 마찬가지로 컬럼에 인라인으로 작성합니다. `Mermaid`는 그곳에서 관계 선을 전혀 작성하지 않습니다. `Doctrine`과 `SeaORM`은 그곳에서도 문서 전체에서와 같은 엔티티를 동작까지 포함해 작성합니다.

## Name Case

`Table Name Case`와 `Column Name Case`는 각각 `Pascal`, `Camel`, `Snake`, `None`을 지원합니다.  
기본값은 테이블 이름이 `Pascal`, 컬럼 이름이 `Camel`입니다. `None`은 다이어그램에 작성된 이름을 그대로 생성합니다.  
어느 케이스에서든 대상 언어가 예약한 이름은 그 언어가 이스케이프할 수 있으면 `C#`의 `@class`나 `Rust`의 `r#type`처럼 이스케이프하고, 그럴 수 없으면 `Java`의 `class_`처럼 이름을 바꿉니다.

`AML`, `DBML`, `Mermaid`는 두 설정을 모두 무시하고 항상 다이어그램의 이름을 그대로 생성합니다.  
`SeaORM`도 두 설정을 무시합니다. 필드와 모듈의 이름은 SeaORM이 다시 읽어 들이는 형태인 snake case로 짓고, 저장되는 이름은 `table_name`에, 그리고 필드 이름과 다를 때는 `column_name`에 적습니다.  
이 네 대상에서는 패널이 두 목록을 흐리게 표시하고 그 아래에 `Not used by` 안내 문구를 표시합니다.

## 데이터베이스

데이터 타입은 선택한 데이터베이스를 기준으로 결정됩니다. [데이터베이스](./table-related-functions.md#데이터베이스) 문서를 참고하세요.  
이 탭에서는 패널의 `Database` 목록, 컨텍스트 메뉴의 `Database`, 또는 빠른 검색에서 고르며, 고르면 코드가 바로 다시 작성됩니다. 이 값은 다이어그램의 유일한 데이터베이스 설정으로, 캔버스 컨텍스트 메뉴와 [Schema SQL](./schema-sql.md) 탭이 지정하는 설정과 같으므로 여기서 바꾸면 그곳에도 반영됩니다.  
`Drizzle`은 같은 설정에서 방언을 결정합니다. PostgreSQL은 `pgTable`, MySQL과 MariaDB는 `mysqlTable`, SQLite는 `sqliteTable`, 그 밖의 데이터베이스는 모두 `pgTable`입니다.  
`SeaORM`은 PostgreSQL, MySQL, MariaDB, SQLite에서 그대로 두면 SeaORM이 다른 컬럼 타입을 만들게 되는 곳에 `column_type`을 작성하며, SeaORM에 백엔드가 없는 MSSQL, Oracle, Snowflake, Databricks에서는 작성하지 않습니다.

선택한 데이터베이스는 ORM 대상이 어떤 ON DELETE와 ON UPDATE 동작을 작성할지도 결정합니다.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy`, `TypeORM`은 MySQL과 MariaDB의 `SET DEFAULT`, MSSQL의 `RESTRICT`, Snowflake와 Databricks에서 `NO ACTION`을 제외한 모든 동작처럼 해당 데이터베이스의 Schema SQL이 제외하는 동작을 똑같이 제외하므로, 데이터베이스의 기본값이 적용됩니다. 전체 목록은 [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서에 있습니다.  
`Drizzle`은 대신 자신이 작성하는 방언을 따릅니다. `mysqlTable` 코드는 `SET DEFAULT`를 제외하고, `pgTable`과 `sqliteTable` 코드는 모든 동작을 유지합니다. MSSQL, Oracle, Snowflake, Databricks에 대해 작성하는 `pgTable` 코드도 마찬가지입니다.

`AML`, `DBML`, `Mermaid`는 예외입니다. 데이터 타입을 다이어그램에 작성된 그대로 생성하므로 데이터베이스 설정이 결과를 바꾸지 않으며, 패널은 이 대상들에서 `Database`를 흐리게 표시합니다. `AML`과 `DBML`은 관계에 지정한 동작을 모두 작성하고, `Mermaid`는 아무 동작도 작성하지 않습니다.

## Bracket

`Bracket`은 언어가 `Doctrine`, `JPA`, `SeaORM`인 동안에만 패널, 컨텍스트 메뉴, 빠른 검색에 표시됩니다.  
Schema SQL 탭의 `Bracket`과 같은 설정이므로, 여기서 바꾸면 Schema SQL이 이름을 감싸는 방식도 바뀝니다. [Schema SQL](./schema-sql.md#데이터베이스와-bracket) 문서를 참고하세요. `SingleQuote`, `DoubleQuote`, `Backtick`, `None`을 제공하며, 처음 값은 `None`입니다.

- `Doctrine`: `None`이 아닌 `Bracket`에서는 ``#[ORM\Table(name: '`order`')]``처럼 모든 테이블, 컬럼, join 컬럼 이름을 백틱으로 감쌉니다. 백틱은 Doctrine이 따옴표로 감쌀 이름을 표시하는 방식입니다. `None`에서는 감쌀 필요가 있는 이름만 감쌉니다. 데이터베이스의 예약어, 일반 ASCII 식별자가 아닌 이름, 따옴표로 감싸 입력한 이름이 해당합니다.
- `JPA`: `None`이 아닌 `Bracket`에서는 예약어인 테이블 이름을 `@Table(name = "\"user\"")`처럼 `@Table` 안에서 따옴표로 감쌉니다. `None`에서는 Schema SQL과 마찬가지로 감싸지 않고 그대로 둡니다.
- `SeaORM`: `None`에서는 이름을 데이터베이스가 저장하는 형태로 작성합니다. 점이 들어간 테이블 이름은 `schema_name`과 `table_name`으로 나뉘고, PostgreSQL에서는 따옴표로 감싸지 않은 이름이 소문자로 바뀝니다. 그 밖의 `Bracket`에서는 이름을 나누지 않고 작성한 그대로 유지합니다.

## 결과 저장과 복사

옵션 패널 아래쪽의 `Save file`이나 컨텍스트 메뉴의 `Save file…`은 표시된 코드를 파일로 저장합니다.  
파일 이름은 다른 모든 내보내기와 마찬가지로 `<데이터베이스 이름>-<시간>` 뒤에 [Language](#language) 표의 확장자가 붙으며, 예를 들면 `shop-2026-10-12T04_05_06.ts`입니다. 파일은 호스트에서 모든 내보내기 파일이 저장되는 곳에 저장됩니다. [내보내기](./file-import-export.md#내보내기) 문서를 참고하세요. `Java`와 `JPA`는 탭에 표시되는 그대로 모든 클래스를 `.java` 파일 하나에 담습니다.  
Export 메뉴에는 Code Generator 항목이 없으며, 테이블 속성의 `Code Generator` 탭에서는 파일을 저장할 수 없습니다.

코드를 복사하려면 패널 아래쪽의 `Copy`를 클릭하거나, 코드에 마우스를 올린 뒤 오른쪽 위의 복사 버튼을 클릭합니다. 테이블 속성에서는 복사 버튼이 유일한 방법입니다.  
체크 표시가 있는 `Copied!` 토스트가 2초 동안 표시되어 복사를 확인해 줍니다. 브라우저나 호스트가 클립보드 사용을 거부하면 대신 경고 표시가 있는 `Couldn't copy to the clipboard` 토스트가 이를 알려 줍니다. 다시 복사하면 토스트가 하나 더 추가되지 않고 기존 토스트를 대체합니다.  
텍스트를 직접 선택할 수도 있어 필요한 부분만 가져올 수 있습니다.
