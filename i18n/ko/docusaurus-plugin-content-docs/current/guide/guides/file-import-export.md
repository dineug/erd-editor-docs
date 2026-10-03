---
sidebar_position: 2
description: JSON·스키마 SQL·GraphQL·DBML·AML 가져오기와, JSON·스키마 SQL·PNG 내보내기.
---

# 파일 가져오기와 내보내기

## 외부 파일 가져오기

컨텍스트 메뉴의 `Import` 하위 메뉴에서 5가지 형식을 가져올 수 있습니다.

- json
- Schema SQL
- GraphQL
- DBML
- AML

선택한 형식과 확장자가 맞지 않는 파일을 고르면 가져오기가 취소되고 안내가 표시됩니다.

가져오기는 현재 문서에 병합하지 않고 문서를 대체합니다.  
JSON 파일은 자체 설정을 함께 가져옵니다. 그 외 형식은 화면 위치와 확대/축소 레벨을 제외한 기존 설정을 유지하며, 파일을 읽은 뒤 테이블이 자동으로 배치됩니다.  
GraphQL, DBML, AML 파서는 실패하지 않습니다. 읽을 수 없는 파일은 오류 대신 빈 다이어그램이 됩니다.

### JSON

[에디터에서 정의한 스키마 형식](../../api/advanced/schema.md)의 파일을 가져올 수 있습니다.
파일 이름은 `.json`으로 끝나야 하므로 `<데이터베이스 이름>-<시간>.erd.json`으로 내보낸 파일은 그대로 다시 가져올 수 있고, `.erd`나 `.vuerd` 파일은 여기서 가져올 수 없습니다.

![Import > json으로 저장된 파일을 가져와 초안 문서를 설정과 함께 대체하기](/img/demo-import-json.webp)

### Schema SQL

SQL로 정의한 스키마 파일도 가져올 수 있습니다.  
데이터베이스 벤더에 상관없이 최대한 유연하게 파서를 작성했지만 일부 지원하지 않는 문법이 있을 수 있습니다.  
파일 이름은 `.sql`로 끝나야 합니다.  
[지원하는 문법은 여기에서 확인 가능합니다.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Import > Schema SQL로 SQL 파일을 가져온 뒤, 자동으로 배치된 테이블을 축소해 보기](/img/demo-import-sql.webp)

컬럼은 `CREATE TABLE`에서만 가져옵니다. `ALTER TABLE ... ADD COLUMN`으로 추가한 컬럼은 읽지 않습니다.  
`CREATE TABLE`에서 컬럼이 아닌 항목은 컬럼으로 읽지 않고 건너뜁니다. 이름 없는 `CHECK (...)`, PostgreSQL의 `LIKE`와 `EXCLUDE`, `INDEX`나 `KEY` 없이 쓴 MySQL의 `FULLTEXT`와 `SPATIAL`, T-SQL의 `PERIOD FOR`, Oracle의 `SUPPLEMENTAL LOG DATA`입니다.  
이들과 이름이 같은 컬럼도 `exclude BOOLEAN`처럼 이름 뒤에 내장 타입이 오거나 `"check" int`처럼 이름을 따옴표로 감싸면 그대로 가져옵니다. 따옴표로 감싸지 않은 `like` 뒤에 `like citext`처럼 내장 타입이 아닌 타입이 오면 PostgreSQL의 `LIKE`로 읽어 건너뜁니다.  
`CHECK` 제약 조건 자체는 에디터에 보관할 자리가 없으므로 가져오지 않습니다.

#### 데이터 타입

컬럼의 데이터 타입은 [지원하는 데이터베이스](./table-related-functions.md#데이터베이스) 중 어느 것의 내장 타입도 아니더라도 인자 목록까지 그대로 유지됩니다.  
`CREATE TYPE`으로 만든 enum이나 composite 타입, `CREATE DOMAIN`으로 만든 domain, `hstore`, `citext`, `ltree` 같은 확장 타입, `public.mood` 같은 스키마로 한정된 이름, 그리고 `"MyType"`, `[dbo].[Phone]`처럼 따옴표나 대괄호로 감싼 이름이 여기에 해당하며, 따옴표나 대괄호도 그대로 유지됩니다. `CREATE TYPE`, `CREATE DOMAIN`, `CREATE EXTENSION` 구문 자체는 건너뜁니다.  
내장 타입은 따옴표나 대괄호가 제거되므로 `[int]`는 `int`로, `[nvarchar](50)`은 `nvarchar(50)`으로 들어옵니다. PostgreSQL의 `"char"`와 `"bit"`는 `char`, `bit`와 다른 타입이므로 따옴표를 유지합니다.  
배열 접미사는 `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`처럼 어떤 타입에서든 유지됩니다. SQLite의 `UNSIGNED BIG INT`는 나뉘지 않고 그대로 들어옵니다.  
`ENUM(...)`과 `SET(...)`의 값은 따옴표를 유지하며, 값 안의 따옴표는 `ENUM('a','it''s')`처럼 두 번 겹쳐 씁니다. MySQL에서 백슬래시로 이스케이프한 `'it\'s'`도 같은 방식으로 두 번 겹쳐 쓴 형태로 들어옵니다. Databricks의 `STRUCT<...>` 타입에서는 따옴표로 감싼 필드 이름과 필드의 `COMMENT`가 따옴표를 유지합니다.  
타입 없는 SQLite 컬럼이나 계산된 `AS` 컬럼처럼 타입 없이 작성한 컬럼은 타입 없이 유지됩니다. `NOT`, `NULL`, `DEFAULT`, `PRIMARY`, `REFERENCES` 같은 키워드나 작은따옴표로 감싼 문자열은 타입으로 읽지 않습니다.

#### Unique 키와 인덱스

두 개 이상의 컬럼에 걸친 `UNIQUE`는 어떤 표기로 쓰든 하나의 unique 인덱스가 됩니다. `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, SQL Server의 인라인 `INDEX n UNIQUE (a, b)`, `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`입니다.  
인덱스는 키의 인덱스 이름을, 없으면 `CONSTRAINT` 이름을 사용하고 둘 다 없으면 이름 없이 만들어지며, 각 컬럼의 정렬 순서를 유지합니다. 이런 인덱스는 [대체 키](./table-related-functions.md#대체-키)입니다.  
컬럼 하나에 대한 `UNIQUE`는 위의 어떤 표기로 쓰든 인덱스를 추가하지 않고 대신 그 컬럼을 Unique로 표시하므로, 내보내기가 작성하는 `UQ_<테이블 이름>_<컬럼 이름>` 제약 조건은 그것을 작성한 원래의 플래그로 돌아옵니다. 컬럼 하나에 대한 `CREATE UNIQUE INDEX`는 unique 인덱스로 유지됩니다.

phpMyAdmin이 작성하는 `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`처럼 여러 키를 한 번에 추가하는 `ALTER TABLE`은 그 안의 unique 키를 모두 유지합니다. `uq_a`는 이름이 `uq_a`인 unique 인덱스로, `uq_c`는 `c`의 Unique 플래그로 들어옵니다. `CONSTRAINT` 이름은 자신이 속한 절의 키에만 붙습니다. MariaDB의 `ADD UNIQUE INDEX IF NOT EXISTS n (...)`과 SQL Server의 `ALTER TABLE t WITH CHECK ADD ...`, `WITH NOCHECK ADD ...`도 읽습니다.  
`CREATE INDEX`와 `CREATE UNIQUE INDEX`는 `public.t`, `[dbo].[t]` 같은 한정된 이름, SQL Server의 `CLUSTERED`와 `NONCLUSTERED`, PostgreSQL의 `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY`, `USING btree`가 있거나 인덱스 이름이 아예 없어도 읽습니다. SQL Server의 `ON [PRIMARY]` 파일 그룹은 무시합니다.  
`NULLS NOT DISTINCT`나 `USING BTREE` 같은 키 옵션을 키 이름으로 오인하지 않습니다. 키의 컬럼 목록에서는 첫 단어만 컬럼 이름이므로 `b DESC NULLS LAST`, `b text_pattern_ops`, `b COLLATE "C"`는 모두 `b`를 키로 삼으며, `DESC`는 정렬 순서로 유지됩니다. `email(191)` 같은 접두사 길이는 건너뛰고 읽지만, `lower(email)`처럼 표현식이 포함된 키는 통째로 건너뜁니다.

부분 unique 인덱스인 `CREATE UNIQUE INDEX ... WHERE ...`나 SQL Server의 인라인 `INDEX n UNIQUE (...) WHERE ...`는 이름과 컬럼이 같은 일반 인덱스로 들어옵니다. 테이블 전체에서 unique한 키는 파일이 선언한, 필터가 걸린 키보다 엄격하기 때문입니다. 예외는 키의 컬럼에 대한 `IS NOT NULL` 검사만을 `AND`로 이은 필터입니다. SQL Server에서 unique 컬럼에 NULL을 둘 이상 담으려면 이 필터가 필요하므로, 이런 키는 unique로 유지됩니다.  
`ALTER TABLE ... ADD COLUMN`으로 추가한 컬럼처럼 테이블에 없는 컬럼을 가리키는 unique 키는 있는 컬럼만 남기지 않고 통째로 버립니다. 일반 인덱스는 있는 컬럼을 유지합니다.

Oracle의 SQL Developer와 `DBMS_METADATA`는 키 자체의 인덱스를 별도의 `CREATE UNIQUE INDEX`로 작성합니다. 이 인덱스의 이름은 키 이름을 따르며, 이름이 없고 뒤에 `USING INDEX`가 오는 키라면 `SYS_C0012345` 같은 시스템 이름입니다. 가져오기는 이런 인덱스와 `ADD CONSTRAINT ... USING INDEX`가 가리키는 인덱스를 해당 키의 일부로 읽습니다. 복합 unique 키는 하나의 unique 인덱스로, primary key나 컬럼 하나짜리 unique 키는 추가 인덱스 없이 컬럼 플래그로 들어옵니다. 따라서 다시 Oracle로 내보내면 인덱스를 한 번만 생성합니다.

MySQL, MariaDB, MSSQL, Oracle, PostgreSQL, SQLite에서는 Schema SQL 내보내기를 다시 가져오면 같은 Unique 플래그와 인덱스로 돌아옵니다.  
Snowflake에는 보조 인덱스가 없으므로 내보낸 결과에서는 unique 키만 돌아옵니다. 복합 키는 unique 인덱스로, 컬럼 하나짜리 키는 그 컬럼의 Unique 플래그로 돌아옵니다. Databricks 내보내기는 unique 제약을 전혀 선언하지 않으므로 아무것도 돌아오지 않습니다.

#### Foreign Key

다음 표기로 작성한 foreign key는 관계가 됩니다.

- 테이블 수준의 `FOREIGN KEY (...) REFERENCES t (...)`. `CONSTRAINT name`은 있어도 되고 없어도 됩니다.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`. SQL Server Management Studio가 스크립트로 작성하는 `ALTER TABLE t WITH CHECK ADD ...`와 `WITH NOCHECK ADD ...`도 포함됩니다.
- `user_id INT REFERENCES users (id)`처럼 컬럼에 인라인으로 쓴 `REFERENCES t (col)`, 그리고 SQL Server와 Snowflake가 그 자리에 허용하는 `FOREIGN KEY REFERENCES t (col)`. 둘 이상의 컬럼을 가리키는 인라인 참조는 건너뜁니다.

`ALTER TABLE` 하나에서는 관계가 최대 하나만 만들어지며, 그것도 첫 번째 절이 foreign key를 추가할 때뿐입니다. 같은 구문에서 `ADD PRIMARY KEY`나 `ADD UNIQUE` 절 뒤에 오는 `FOREIGN KEY` 절은 읽지 않습니다. phpMyAdmin이 작성하는 `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`처럼 한 구문이 여러 foreign key를 추가하면 마지막 것만 읽습니다.

컬럼 목록이 없는 `REFERENCES t`는 `t`의 primary key가 컬럼 하나이면 그 primary key를 가리킵니다. primary key가 복합 키이면 그 foreign key는 건너뜁니다.  
참조하는 컬럼을 하나도 찾지 못하거나, 한쪽 테이블에만 컬럼이 빠져 있을 때처럼 두 테이블에서 찾은 컬럼의 수가 다르면 그 foreign key는 건너뛰며, 어떤 컬럼도 foreign key로 표시하지 않습니다. 두 테이블에서 같은 수의 컬럼이 빠져 있으면 찾은 컬럼끼리 작성된 순서대로 짝지으며, 관계에는 그 컬럼만 포함됩니다.  
가져온 관계는 모두 `Zero N`이며, 자식 컬럼이 모두 primary key이기도 하면 식별 관계가 됩니다.

각 foreign key의 `ON DELETE`와 `ON UPDATE` 절은 관계의 `On Delete`와 `On Update`가 됩니다. 값은 `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`이며, 대소문자와 두 절의 순서는 상관없습니다. 이 절이 없는 foreign key는 `Not set`으로 가져옵니다. 에디터에서 설정하는 방법은 [관계 편집](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.  
`ON DELETE SET NULL (a_id)`처럼 `SET NULL`이나 `SET DEFAULT` 뒤에 오는 PostgreSQL의 컬럼 목록은 건너뛰고 읽습니다. 동작은 키 전체에 적용되며, 목록 뒤의 `ON UPDATE`도 그대로 읽습니다. `MATCH FULL`, `MATCH PARTIAL`, `MATCH SIMPLE`은 건너뛰며, MySQL의 `ON UPDATE CURRENT_TIMESTAMP` 컬럼 속성을 동작으로 오인하지 않습니다.  
Schema SQL 내보내기를 다시 가져오면 해당 데이터베이스가 작성하는 동작만 돌아오므로, MySQL의 `SET DEFAULT`나 Oracle의 모든 `ON UPDATE`처럼 생략된 동작은 `Not set`으로 돌아옵니다.

#### 코멘트

테이블과 컬럼 코멘트는 파서가 읽는 두 가지 문법에서 가져옵니다. MySQL, MariaDB, Snowflake, Databricks가 사용하는 `COMMENT` 테이블 옵션과 컬럼 속성, 그리고 PostgreSQL과 Oracle이 사용하는 `COMMENT ON TABLE`, `COMMENT ON COLUMN` 구문입니다.  
파일에 정의되지 않은 테이블이나 컬럼을 가리키는 코멘트는 무시합니다.

`DEFAULT` 값이나 따옴표로 감싼 이름처럼 따옴표 안의 다른 텍스트와 마찬가지로, 코멘트에서도 두 번 겹쳐 쓴 따옴표는 따옴표 하나를 뜻합니다. mysqldump와 pg_dump가 작성하는 방식으로, `'it''s'`는 `it's`로 읽습니다.  
MySQL과 MariaDB가 `'it\'s'`처럼 작성하는, 따옴표 앞의 백슬래시도 따옴표를 이스케이프합니다. 다만 이런 따옴표 뒤에 공백, `,`, `;`, `)`, `]`, `:`, `|`, `+`가 오거나 파일이 끝나면 그 따옴표에서 텍스트가 끝나므로, `'C:\'`, pg_dump의 `'C:\'::text`, T-SQL의 `'C:\'+name`은 백슬래시를 유지합니다.  
`DEFAULT` 값은 따옴표를 유지하며, 값 안의 따옴표는 파일에서 어떻게 이스케이프했든 `'it''s'`처럼 두 번 겹쳐 다시 씁니다.  
가져올 때 문서의 데이터베이스가 Databricks이면 작은따옴표로 감싼 텍스트는 대신 Spark의 규칙을 따릅니다. 모든 백슬래시가 뒤의 문자를 이스케이프하므로 `'C:\\dir'`는 `C:\dir`로 읽고, `\n`, `\t`, `\u0041` 같은 이스케이프를 해석하며, `DEFAULT` 값은 `'it\'s'`로 유지됩니다.

내보내는 Schema SQL은 테이블이나 컬럼 코멘트 안의 따옴표를 이스케이프합니다. MySQL, MariaDB, Snowflake는 `COMMENT 'it''s'`, PostgreSQL과 Oracle은 `COMMENT ON TABLE`과 `COMMENT ON COLUMN ... IS 'it''s'`로 작성하며, MSSQL의 `sp_addextendedproperty` 호출에서도 테이블과 컬럼 이름까지 포함해 같은 방식으로 두 번 겹쳐 씁니다. 따옴표가 없는 코멘트는 그대로 작성합니다.  
Databricks는 대신 `COMMENT 'it\'s'`처럼 따옴표와 백슬래시를 백슬래시로 이스케이프하므로, Databricks로 내보낸 결과는 Databricks가 선택된 데이터베이스일 때만 정확히 다시 읽힙니다.

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
`Ref: users.id < posts.user_id [delete: cascade, update: set null]`처럼 독립된 ref의 `delete`와 `update` 설정은 관계의 `On Delete`와 `On Update`가 됩니다. 값은 `cascade`, `restrict`, `set null`, `set default`, `no action`이며 대소문자는 상관없습니다. 그 밖의 값이거나 설정이 없으면 `Not set`으로 가져오며, `color` 같은 다른 설정은 무시합니다.  
인라인 `[ref: ...]` 설정은 동작을 담지 않으며, `<>` ref의 설정은 매핑 테이블로 옮겨지지 않습니다. 같은 foreign key를 인라인과 독립된 ref로 모두 선언하면 인라인 쪽이 동작 없이 유지됩니다.  
파일 이름은 `.dbml`로 끝나야 합니다.

### AML

AML(Azimutt Markup Language) 파일을 가져올 수 있습니다. 현재 표기와 예전 v1 표기를 모두 지원합니다.  
엔티티는 테이블이 되고, 중첩 속성은 `settings.slug`처럼 점으로 이어진 컬럼 이름으로 평탄화됩니다.  
속성은 `nullable`로 표시하지 않으면 `NOT NULL`이며, `check`, `view`, `type`, `color`, `tags`처럼 에디터에 대응하는 자리가 없는 구성 요소는 거부하지 않고 버립니다.  
독립된 `rel` 문, 또는 예전 표기의 `fk`는 `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`처럼 `onDelete`와 `onUpdate` 속성을 관계의 `On Delete`와 `On Update`로 유지합니다. 값은 `cascade`, `restrict`, `set null`, `set default`, `no action`이며, 따옴표 유무와 대소문자는 상관없습니다. 그 밖의 속성은 버립니다.  
`user_id int -> users(id) {onDelete: cascade}` 같은 인라인 관계에서는 속성이 관계가 아니라 해당 컬럼에 속하므로 버려지며, 관계는 `Not set`으로 가져옵니다.  
파일 이름은 `.aml`로 끝나야 합니다.

GraphQL, DBML, AML은 왕복 가능한 형식으로, 각각 [코드 생성](./code-generator.md) 대상이기도 합니다.  
DBML과 AML은 각 관계의 ON DELETE와 ON UPDATE를 가져올 때와 생성할 때 모두 유지합니다. [코드 생성](./code-generator.md#on-delete와-on-update) 문서를 참고하세요. GraphQL은 둘 다 유지하지 않으므로, GraphQL을 가져오면 둘 다 `Not set`이 됩니다.

## 내보내기

내보내기 형식에는 다음과 같이 3가지를 지원하고 있습니다.

- json: 에디터에서 정의한 스키마 파일입니다. `.erd.json`으로 저장됩니다.
- Schema SQL: 데이터베이스 벤더에 따라 문법을 생성한 스키마 파일입니다. `.sql`로 저장됩니다.
- png: 다이어그램을 이미지로 생성합니다. `.png`로 저장됩니다.

Schema SQL은 각 관계의 ON DELETE와 ON UPDATE를 `REFERENCES` 뒤에 ON DELETE부터 작성합니다. `Not set`은 아무것도 작성하지 않으며, 선택한 데이터베이스가 받아들이지 않는 동작은 생략합니다. 어떤 데이터베이스가 어떤 동작을 받아들이는지는 [관계 편집](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.

PNG는 화면이 얼마나 멀리 이동해 있든 다이어그램 전체를 담으며, 다이어그램이 실제로 그려진 범위에 여백을 더해 잘라내고, 에디터가 표시 중인 배율로 그립니다. 더 큰 이미지가 필요하면 내보내기 전에 확대하세요.  
백그라운드 워커에서 그리므로 그동안에도 에디터를 계속 사용할 수 있고, 큰 다이어그램처럼 내보내기가 잠깐 사이에 끝나지 않으면 진행 중임을 알리는 알림이 표시됩니다. 브라우저 캔버스가 감당할 수 없을 만큼 큰 다이어그램은 파일을 만들지 못하는 대신 해상도를 낮춰 저장하고, 그 사실을 알림으로 알려 줍니다.

내보낸 파일은 모두 `<데이터베이스 이름>-<시간>` 뒤에 해당 확장자가 붙은 이름이며, 시간 형식은 `yyyy-MM-dd'T'HH_mm_ss`입니다. 예를 들면 `my-schema-2026-08-29T04_05_06.erd.json`입니다. 데이터베이스 이름이 비어 있으면 `unnamed`가 사용됩니다.

![Export 하위 메뉴에서 png를 고르는 모습과, 오래 걸리는 내보내기에서 뜨는 안내](/img/demo-export.webp)

가져오기와 내보내기는 [빠른 검색](./quick-search.md)에서도 사용 가능합니다. 가져오기는 동일한 5가지 형식을 제공하지만 내보내기는 `json`과 `Schema SQL`만 제공하며, PNG는 컨텍스트 메뉴에서만 사용 가능합니다.

Obsidian에서는 다운로드나 저장 대화 상자가 나타나지 않습니다. 파일은 볼트 안에서 Obsidian이 해당 다이어그램의 새 첨부 파일을 두는 위치에 저장되며, 알림으로 그 경로를 알려 줍니다.  
Obsidian이 파일 이름에 허용하지 않는 문자 `\ / : * ? " < > |`는 `-`로 바뀝니다.  
내보낸 `.erd.json`이나 `.sql` 파일은 Settings → Files and links → Detect all file extensions가 켜져 있을 때만 Obsidian의 파일 탐색기에 표시됩니다.
