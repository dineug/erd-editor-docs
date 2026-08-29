---
sidebar_position: 2
description: JSON·스키마 SQL·GraphQL·DBML·AML 가져오기와, JSON·스키마 SQL·PNG 내보내기.
---

# 파일 가져오기와 내보내기

## 외부 파일 가져오기

컨텍스트 메뉴의 `Import` 하위 메뉴에서 5가지 형식을 가져올 수 있습니다.

- JSON
- Schema SQL
- GraphQL
- DBML
- AML

선택한 형식과 확장자가 맞지 않는 파일을 고르면 가져오기가 취소되고 안내가 표시됩니다.

가져오기는 현재 문서에 병합하지 않고 문서를 대체합니다.  
JSON 파일은 자체 설정을 함께 가져옵니다. 그 외 형식은 캔버스 크기, 스크롤 위치, 확대/축소 레벨을 제외한 기존 설정을 유지하며, 파일을 읽은 뒤 테이블이 자동으로 배치됩니다.  
GraphQL, DBML, AML 파서는 실패하지 않습니다. 읽을 수 없는 파일은 오류 대신 빈 다이어그램이 됩니다.

### JSON

[에디터에서 정의한 스키마 형식](../../api/advanced/schema.md)의 파일을 가져올 수 있습니다.
파일 이름은 `.json`으로 끝나야 하므로 `<데이터베이스 이름>-<시간>.erd.json`으로 내보낸 파일은 그대로 다시 가져올 수 있고, `.erd`나 `.vuerd` 파일은 여기서 가져올 수 없습니다.

<img src="/img/import-json.png" width="400" alt="JSON 가져오기 메뉴" loading="lazy" />

### Schema SQL

SQL로 정의한 스키마 파일도 가져올 수 있습니다.  
데이터베이스 벤더에 상관없이 최대한 유연하게 파서를 작성했지만 일부 지원하지 않는 문법이 있을 수 있습니다.  
파일 이름은 `.sql`로 끝나야 합니다.  
[지원하는 문법은 여기에서 확인 가능합니다.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

<img src="/img/import-sql.png" width="400" alt="Schema SQL 가져오기 메뉴" loading="lazy" />

#### 코멘트

테이블과 컬럼 코멘트는 파서가 읽는 두 가지 문법에서 가져옵니다. MySQL, MariaDB, Snowflake, Databricks가 사용하는 `COMMENT` 테이블 옵션과 컬럼 속성, 그리고 PostgreSQL과 Oracle이 사용하는 `COMMENT ON TABLE`, `COMMENT ON COLUMN` 구문입니다.  
파일에 정의되지 않은 테이블이나 컬럼을 가리키는 코멘트는 무시합니다.

SQLite와 MSSQL은 내보내기와 가져오기를 왕복하면 코멘트가 유지되지 않습니다. SQLite는 코멘트를 단순한 `--` 줄로 쓰고 MSSQL은 `sp_addextendedproperty` 호출로 쓰는데, 파서는 둘 다 읽지 않습니다.

### GraphQL

GraphQL SDL 문서를 가져올 수 있습니다.  
object type 정의는 테이블이 되고, `extend type` 블록은 확장 대상 타입에 병합되며, interface 필드는 이를 구현하는 타입에 상속됩니다.  
타입이 다른 테이블인 필드는 컬럼 대신 관계가 되고, 양쪽이 모두 목록이면 매핑 테이블이 생성됩니다.  
루트 타입(`Query`, `Mutation`, `Subscription`), introspection 타입, 그리고 `PageInfo`, `*Connection`, `*Edge`, `*_aggregate` 같은 Relay, federation, Hasura 래퍼는 노이즈로 보고 건너뜁니다.  
`@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index`, `@db.*` 디렉티브를 인식합니다.  
파일 이름은 `.graphql`, `.gql`, `.graphqls`로 끝나야 합니다. Prisma의 `schema.prisma` 파일은 GraphQL 문서가 아니므로 여기서 가져올 수 없습니다.

### DBML

dbdiagram.io와 dbdocs에서 사용하는 형식인 DBML 파일을 가져올 수 있습니다.  
`Table`, `TablePartial`, `Ref`, `Enum` 블록을 읽습니다. `Project`, `TableGroup`, 단독 `Note` 블록은 주변 테이블에 영향을 주지 않고 건너뜁니다.  
`Ref:` 콜론 형식, 이름이 있는 ref, `Ref { }` 블록 형식, 인라인 `[ref: > table.column]` 컬럼 설정까지 모든 ref 표기를 지원합니다.  
`<>` 다대다 ref는 양쪽 이름을 딴 매핑 테이블을 생성합니다.  
파일 이름은 `.dbml`로 끝나야 합니다.

### AML

AML(Azimutt Markup Language) 파일을 가져올 수 있습니다. 현재 표기와 예전 v1 표기를 모두 지원합니다.  
엔티티는 테이블이 되고, 중첩 속성은 `settings.slug`처럼 점으로 이어진 컬럼 이름으로 평탄화됩니다.  
속성은 `nullable`로 표시하지 않으면 `NOT NULL`이며, `check`, `view`, `type`, `color`, `tags`, `onDelete`처럼 에디터에 대응하는 자리가 없는 구성 요소는 거부하지 않고 버립니다.  
파일 이름은 `.aml`로 끝나야 합니다.

GraphQL, DBML, AML은 왕복 가능한 형식으로, 각각 [코드 생성](./code-generator.md) 대상이기도 합니다.

## 내보내기

내보내기 형식에는 다음과 같이 3가지를 지원하고 있습니다.

- JSON: 에디터에서 정의한 스키마 파일입니다. `.erd.json`으로 저장됩니다.
- Schema SQL: 데이터베이스 벤더에 따라 문법을 생성한 스키마 파일입니다. `.sql`로 저장됩니다.
- PNG: 다이어그램을 이미지로 생성합니다. `.png`로 저장됩니다.

내보낸 파일은 모두 `<데이터베이스 이름>-<시간>` 뒤에 해당 확장자가 붙은 이름이며, 시간 형식은 `yyyy-MM-dd'T'HH_mm_ss`입니다. 예를 들면 `my-schema-2026-08-29T04_05_06.erd.json`입니다. 데이터베이스 이름이 비어 있으면 `unnamed`가 사용됩니다.

<img src="/img/export-menu.png" width="400" alt="내보내기 메뉴" loading="lazy" />

가져오기와 내보내기는 [빠른 검색](./quick-search.md)에서도 사용 가능합니다. 가져오기는 동일한 5가지 형식을 제공하지만 내보내기는 `json`과 `Schema SQL`만 제공하며, PNG는 컨텍스트 메뉴에서만 사용 가능합니다.
