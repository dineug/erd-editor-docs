---
sidebar_position: 2
description: JSON·스키마 SQL·GraphQL·DBML·AML을 다이어그램 대신 가져오거나 다이어그램 아래에 추가하기와, JSON·스키마 SQL·다이어그램의 PNG나 SVG 이미지 내보내기.
---

# 파일 가져오기와 내보내기

## 외부 파일 가져오기

캔버스 컨텍스트 메뉴의 `Import` 하위 메뉴에서 5가지 형식을 가져올 수 있습니다.

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import` 바로 아래의 `Import and Add`는 다이어그램을 대체하지 않고 파일을 다이어그램에 추가합니다. [가져와서 추가](#가져와서-추가) 항목을 참고하세요.  
빈 다이어그램에 표시되는 시작 화면에도 같은 5가지 형식이 있는 `Import` 항목이 있습니다. [시작 화면](./editing-start.md#시작-화면) 문서를 참고하세요.

확장자는 대소문자를 구분하지 않고 확인합니다. 선택한 형식과 확장자가 맞지 않는 파일을 고르면 가져오기가 취소되고 `Only <format> files can be imported`가 표시됩니다. 형식은 `Only sql files can be imported`처럼 `json`, `sql`, `graphql`, `dbml`, `aml` 중 하나로 표시됩니다.

`Import`는 현재 문서에 병합하지 않고 문서를 대체하며, Undo 한 번으로 이전 다이어그램이 돌아옵니다.  
JSON 파일은 [잠금](./settings.md#잠금)을 포함한 자체 설정을 함께 가져옵니다. 파일이 탭, Code Generator 언어, 이름 케이스, 괄호 타입을 잠가 두었다면 화면에는 기존에 보던 것이 계속 표시되지만, 저장되는 값은 파일의 잠긴 값입니다. 화면 위치와 확대/축소는 잠겨 있든 아니든 파일이 지정한 대로 바뀝니다. 잠금이 생기기 전에 저장된 JSON 파일은 모든 잠금이 켜지고 확대/축소가 100%인 상태로 들어옵니다.  
그 외 형식은 잠금을 포함한 기존 설정을 유지하며, 화면만 예외로 확대/축소 100%에서 시작합니다.  
GraphQL, DBML, AML 파서는 실패하지 않습니다. 읽을 수 없는 파일은 오류 대신 빈 다이어그램이 됩니다.

JSON 파일은 파일에 있는 위치를 그대로 유지합니다. Schema SQL, GraphQL, DBML, AML 파일의 테이블은 다이어그램이 바뀌기 전에 다음과 같이 배치됩니다.

- 파일에 테이블이 두 개 이상이고 관계가 하나 이상 있으면, `Flow` [자동 배치](./table-related-functions.md#자동-배치)로 캔버스의 왼쪽 위부터 관계를 따라 왼쪽에서 오른쪽으로 배치됩니다. 테이블이 자기 자신을 가리키는 관계도 관계로 셉니다.
- 그 밖의 경우에는 왼쪽 위부터 여러 행으로 배치되며, 컬럼이 가장 적은 테이블이 먼저 옵니다.
- 배치가 6초 넘게 걸리면 `Cancel` 버튼이 있는 `Placing tables` 알림이 나타납니다. `Cancel`을 누르거나 알림이 떠 있는 동안 `Escape`를 누르면 배치를 포기하고 대신 테이블을 여러 행으로 배치합니다. 배치가 실패하거나, 60초 안에 배치 결과가 돌아오지 않거나, 호스트가 shared worker를 실행하지 않을 때도 알림 없이 여러 행으로 배치합니다. [Web Worker](../../api/installation.md#web-worker) 문서를 참고하세요.

그런 다음 다이어그램이 한 번에 대체되므로 중간 상태는 보이지 않습니다. 테이블이 배치되는 동안 탭처럼 바꾼 설정은 유지되며, 그사이에 다른 파일을 가져오면 마지막에 시작한 가져오기가 적용됩니다.

읽기 전용 에디터는 `Import`로 아무것도 불러오지 않으며 `Import and Add`를 제공하지 않습니다.

### 가져와서 추가

`Import and Add`는 다이어그램을 유지한 채 그 아래에 파일을 추가합니다. 캔버스 컨텍스트 메뉴와 ERD 탭의 [빠른 검색](./quick-search.md)에 있으며, `Import`와 같은 5가지 형식을 같은 확장자 검사와 함께 제공합니다.

![Import and Add > Schema SQL로 SQL 파일을 추가하면, 테이블이 관계를 따라 배치된 채 다이어그램 아래에 놓이고 선택되는 모습](/img/demo-import-and-add.webp)

파일은 붙여넣기와 같은 방식으로 들어옵니다. 파일에 담긴 모든 테이블, 컬럼, 관계, 인덱스, 메모, [테이블 그룹](./table-groups.md)이 새 항목으로 추가되고, 다이어그램에 이미 있던 테이블은 움직이지 않으며, 설정은 바뀌지 않으므로 JSON 파일의 설정은 제외됩니다.  
다이어그램에 이미 있는 이름의 테이블은 기존 테이블과 병합되지 않고 같은 이름의 테이블로 하나 더 추가됩니다. 관계와 인덱스는 파일에서만 오므로, 파일에 정의되지 않은 테이블을 가리키는 foreign key는 다이어그램에 이미 있는 테이블과 연결되지 않습니다.

추가된 블록은 다이어그램에 있는 모든 것의 바로 아래에 그 왼쪽 가장자리에 맞춰 놓이며, 빈 다이어그램이면 왼쪽 위에 놓입니다. [View Option](./table-related-functions.md#테이블-보기-옵션)으로 숨긴 메모와 테이블 그룹도 그 자리에 그대로 있으므로 함께 계산됩니다.  
블록 안에서 JSON 파일은 테이블 그룹을 포함해 자체 배치를 유지합니다. 그 외 형식은 `Import`와 같은 규칙에 따라 `Flow`나 여러 행으로 배치되며, 각 테이블 그룹의 박스는 그 테이블에 맞춰집니다. 추가된 테이블과 메모는 이미 있던 모든 것보다 위에 쌓입니다.

블록이 놓이면 추가된 것만 선택됩니다. 새 테이블, 그리고 메모와 테이블 그룹이 표시되어 있는 경우 새 메모와 테이블 그룹입니다. 블록이 화면에 보이지 않으면 현재 확대/축소 그대로 블록으로 스크롤되며, 그사이에 다른 탭으로 옮겼다면 에디터가 먼저 ERD 탭으로 돌아갑니다. Undo 한 번으로 추가한 내용 전체를 되돌립니다.  
파서가 읽을 수 없는 파일이나 테이블도 메모도 없는 파일은 아무것도 추가하지 않습니다.

파일 하나가 아직 배치되는 동안 추가한 여러 Schema SQL, GraphQL, DBML, AML 파일은 모두 시작한 순서대로 놓입니다. 그사이에 추가한 JSON 파일은 읽히는 즉시 그보다 먼저 놓입니다. `Import`를 실행하거나 다른 문서를 불러오면 아직 배치 중인 파일은 버려집니다.

코딩 에이전트는 MCP 가져오기 도구의 `append` 모드로 같은 방식으로 파일을 추가합니다. 이 모드는 JSON 파일의 배치는 유지하지만, 그 외 형식의 테이블은 `Flow`를 쓰지 않고 항상 여러 행으로 배치합니다. [가져오기](../../mcp/tools.md#가져오기) 문서를 참고하세요.

### JSON

[에디터에서 정의한 스키마 형식](../../api/advanced/schema.md)의 파일을 가져올 수 있습니다.
파일 이름은 `.json`으로 끝나야 하므로 `<데이터베이스 이름>-<시간>.erd.json`으로 내보낸 파일은 그대로 다시 가져올 수 있고, `.erd`나 `.vuerd` 파일은 여기서 가져올 수 없습니다. 이전 릴리스가 저장한 파일도 읽습니다.

![Import > json으로 저장된 파일을 가져와 초안 문서를 설정과 함께 대체하기](/img/demo-import-json.webp)

### Schema SQL

SQL로 정의한 스키마 파일도 가져올 수 있습니다.  
데이터베이스 벤더에 상관없이 최대한 유연하게 파서를 작성했지만 일부 지원하지 않는 문법이 있을 수 있습니다.  
파일 이름은 `.sql`로 끝나야 합니다.  
[지원하는 문법은 여기에서 확인 가능합니다.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Import > Schema SQL로 SQL 파일을 가져온 뒤, 관계를 따라 배치된 테이블을 축소해 보기](/img/demo-import-sql.webp)

컬럼은 `CREATE TABLE`에서만 가져옵니다. `ALTER TABLE ... ADD COLUMN`으로 추가한 컬럼은 읽지 않습니다.  
`CREATE TABLE`에서 컬럼이 아닌 항목은 컬럼으로 읽지 않고 건너뜁니다. 이름 없는 `CHECK (...)`, PostgreSQL의 `LIKE`와 `EXCLUDE`, `INDEX`나 `KEY` 없이 쓴 MySQL의 `FULLTEXT`와 `SPATIAL`, T-SQL의 `PERIOD FOR`, Oracle의 `SUPPLEMENTAL LOG DATA`입니다.  
이들과 이름이 같은 컬럼도 `exclude BOOLEAN`처럼 이름 뒤에 내장 타입이 오거나 `"check" int`처럼 이름을 따옴표로 감싸면 그대로 가져옵니다. 따옴표로 감싸지 않은 `like` 뒤에 `like citext`처럼 내장 타입이 아닌 타입이 오면 PostgreSQL의 `LIKE`로 읽어 건너뜁니다.  
`CHECK` 제약 조건 자체는 에디터에 보관할 자리가 없으므로 가져오지 않습니다.

#### 데이터 타입

컬럼의 데이터 타입은 [지원하는 데이터베이스](./table-related-functions.md#데이터베이스) 중 어느 것의 내장 타입도 아니더라도 인자 목록까지 그대로 유지됩니다.  
`CREATE TYPE`으로 만든 enum이나 composite 타입, `CREATE DOMAIN`으로 만든 domain, `hstore`, `citext`, `ltree` 같은 확장 타입, `public.mood` 같은 스키마로 한정된 이름, 그리고 `"MyType"`, `[dbo].[Phone]`처럼 따옴표나 대괄호로 감싼 이름이 여기에 해당하며, 따옴표나 대괄호도 그대로 유지됩니다. `CREATE TYPE`, `CREATE DOMAIN`, `CREATE EXTENSION` 구문 자체는 건너뜁니다.  
내장 타입은 따옴표나 대괄호가 제거되므로 `[int]`는 `int`로, `[nvarchar](50)`은 `nvarchar(50)`으로 들어옵니다. PostgreSQL의 `"char"`와 `"bit"`는 `char`, `bit`와 다른 타입이므로 따옴표를 유지합니다.  
배열 접미사는 `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`처럼 어떤 타입에서든 유지됩니다. SQLite의 `UNSIGNED BIG INT`는 나뉘지 않고 그대로 들어옵니다.  
타입과 그 인자 바로 뒤에 쓴 MySQL과 MariaDB의 `UNSIGNED`와 `ZEROFILL`은 `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, mysqldump의 `int unsigned`처럼 작성한 그대로 타입의 일부로 유지됩니다. 기본값인 `SIGNED`는 제거되므로 `TINYINT SIGNED`는 `TINYINT`로 들어옵니다. MySQL이 거부하는 `INT NOT NULL UNSIGNED`처럼 다른 컬럼 옵션 뒤에 쓴 수식어는 제거됩니다.  
`ENUM(...)`과 `SET(...)`의 값은 따옴표를 유지하며, 값 안의 따옴표는 `ENUM('a','it''s')`처럼 두 번 겹쳐 씁니다. MySQL에서 백슬래시로 이스케이프한 `'it\'s'`도 같은 방식으로 두 번 겹쳐 쓴 형태로 들어옵니다. Databricks의 `STRUCT<...>` 타입에서는 따옴표로 감싼 필드 이름과 필드의 `COMMENT`가 따옴표를 유지합니다.  
타입 없는 SQLite 컬럼이나 계산된 `AS` 컬럼처럼 타입 없이 작성한 컬럼은 타입 없이 유지됩니다. `NOT`, `NULL`, `DEFAULT`, `PRIMARY`, `REFERENCES` 같은 키워드나 작은따옴표로 감싼 문자열은 타입으로 읽지 않습니다.

#### 기본값

컬럼의 `DEFAULT`는 다음 컬럼 옵션, 쉼표, 닫는 괄호 전까지 `now()`, `0.5`, `CURRENT_TIMESTAMP`, `ARRAY[]::text[]` 같은 표현식 전체를 유지합니다. `CASE ... END`는 통째로 읽습니다.  
표현식 전체를 감싼 괄호는 제거되므로 SQL Server의 `((0))`은 `0`으로, `(getdate())`는 `getdate()`로 들어옵니다. 리터럴의 캐스트도 제거되므로 pg_dump의 `'draft'::character varying`은 `'draft'`로, `NULL::character varying`은 `NULL`로 들어옵니다. `ARRAY[]::text[]`와 `lower('A'::text)`처럼 그 밖의 캐스트는 유지됩니다.  
MySQL의 `ON UPDATE CURRENT_TIMESTAMP`는 컬럼에 보관할 자리가 없으므로 제거되며, 그 앞의 기본값은 유지됩니다. Oracle의 `DEFAULT ON NULL 0`은 `FOR INSERT ONLY`나 `FOR INSERT AND UPDATE`가 있든 없든 `0`으로 들어옵니다.  
`N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'`, `_utf8mb4'x'`처럼 접두사가 붙은 문자열은 안에 괄호가 있어도 하나의 문자열로 읽습니다.

SQL Server Management Studio는 기본값을 테이블 뒤에 `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`처럼 스크립트로 작성합니다. 이런 구문은 해당 컬럼의 기본값(여기서는 `1`)을 설정하며, 제약 조건 이름은 버립니다.

Schema SQL 내보내기는 기본값의 표현식을 괄호 안에서만 읽는 데이터베이스에서는 괄호를 다시 붙입니다. [기본값](./schema-sql.md#기본값) 문서를 참고하세요.

#### Auto Increment

`AUTO_INCREMENT`, `AUTOINCREMENT`, `IDENTITY`는 컬럼의 `Auto Increment`를 켜며, `GENERATED ALWAYS AS IDENTITY`와 `GENERATED BY DEFAULT AS IDENTITY`도 마찬가지입니다. 이 둘은 기본값을 남기지 않습니다.  
serial 컬럼이 받는 기본값처럼 PostgreSQL의 `nextval()` 호출 하나로 이루어진 기본값도 마찬가지이며, `nextval('s')`로 쓰든 pg_dump처럼 `nextval('s'::regclass)`로 쓰든 같습니다. 시퀀스 이름은 유지하지 않습니다. `nextval('s') + 1`이나 SQL Server의 `NEXT VALUE FOR s`처럼 시퀀스를 사용하기만 하는 기본값은 일반 기본값으로 유지됩니다.  
pg_dump는 둘 다 테이블 뒤에 `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)`와 `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`로 작성합니다. 어느 구문이든 해당 컬럼의 `Auto Increment`를 켜고 기본값을 지웁니다. `CREATE SEQUENCE`, `ALTER SEQUENCE`, 그 밖의 모든 `ALTER COLUMN` 동작은 건너뜁니다.  
`serial`, `bigserial`, `smallserial` 타입으로 인라인 선언한 컬럼은 그 타입을 유지하며, `Auto Increment`는 꺼진 상태입니다.

에디터는 `Auto Increment` 플래그만 보관하며, 내보낼 때 각 데이터베이스가 자신의 형식으로 작성합니다. [Auto Increment](./schema-sql.md#auto-increment) 문서를 참고하세요. PostgreSQL 내보내기는 어떤 형식으로 가져왔든 `smallint`, `integer`, `bigint` 컬럼에는 `GENERATED ALWAYS AS IDENTITY`를 작성하고, `INT UNSIGNED` 같은 그 밖의 타입에는 테이블 뒤에 코멘트 줄만 작성합니다. `START WITH 100` 같은 시퀀스 옵션은 사라집니다.  
serial이나 identity 컬럼이 여럿인 테이블은 auto-increment 컬럼이 여럿인 채로 들어오며, 그 내보내기를 실행하면 MySQL, MariaDB, SQL Server는 이런 테이블을 거부합니다.

#### Primary Key

테이블 뒤에 추가한 primary key, 즉 `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`는 그 컬럼을 primary key로 표시합니다.  
컬럼 목록 앞에 오는 SQL Server의 `CLUSTERED`나 `NONCLUSTERED`, MySQL의 `USING BTREE`는 건너뛰고 읽으므로, SQL Server Management Studio가 스크립트로 작성하는 `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]`는 `Id`를 키로 삼습니다. 메모리 최적화 테이블의 `PRIMARY KEY NONCLUSTERED HASH (...)`는 `ALTER TABLE`에서든 `CREATE TABLE`에서든 읽지 않습니다.

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
Schema SQL 내보내기를 다시 가져오면 해당 데이터베이스가 작성하는 동작만 돌아오므로, MySQL의 `SET DEFAULT`, Oracle의 모든 `ON UPDATE`, Snowflake에서 `NO ACTION`을 제외한 모든 동작처럼 생략된 동작은 `Not set`으로 돌아옵니다.

#### 코멘트

테이블과 컬럼 코멘트는 파서가 읽는 세 가지 문법에서 가져옵니다. MySQL, MariaDB, Snowflake, Databricks가 사용하는 `COMMENT` 테이블 옵션과 컬럼 속성, PostgreSQL과 Oracle이 사용하는 `COMMENT ON TABLE`, `COMMENT ON COLUMN` 구문, 그리고 SQL Server가 `EXEC sp_addextendedproperty`로 설정하는 `MS_Description` 확장 속성입니다.  
파일에 정의되지 않은 테이블이나 컬럼을 가리키는 코멘트는 무시합니다.

SQL Server의 호출은 SQL Server Management Studio가 모든 코멘트를 스크립트로 작성하는 방식인 이름 있는 인자(`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`)로 쓰든, 에디터의 MSSQL 내보내기가 작성하는 방식인 위치 인자로 쓰든 읽습니다.  
테이블, 또는 레벨 2에 있는 그 테이블의 컬럼에 대한 `MS_Description`만 코멘트가 됩니다. 다른 속성, 뷰, 인덱스, 제약 조건에 대한 것은 코멘트가 되지 않으며, 변수로 전달하거나 `+`로 이어 만든 코멘트도 마찬가지입니다.

`DEFAULT` 값이나 따옴표로 감싼 이름처럼 따옴표 안의 다른 텍스트와 마찬가지로, 코멘트에서도 두 번 겹쳐 쓴 따옴표는 따옴표 하나를 뜻합니다. mysqldump와 pg_dump가 작성하는 방식으로, `'it''s'`는 `it's`로 읽습니다.  
MySQL과 MariaDB가 `'it\'s'`처럼 작성하는, 따옴표 앞의 백슬래시도 따옴표를 이스케이프합니다. 다만 이런 따옴표 뒤에 공백, `,`, `;`, `)`, `]`, `:`, `|`, `+`가 오거나 파일이 끝나면 그 따옴표에서 텍스트가 끝나므로, `'C:\'`, pg_dump의 `'C:\'::text`, T-SQL의 `'C:\'+name`은 백슬래시를 유지합니다.  
`DEFAULT` 값은 따옴표를 유지하며, 값 안의 따옴표는 파일에서 어떻게 이스케이프했든 `'it''s'`처럼 두 번 겹쳐 다시 씁니다.  
가져올 때 문서의 데이터베이스가 Databricks이면 작은따옴표로 감싼 텍스트는 대신 Spark의 규칙을 따릅니다. 모든 백슬래시가 뒤의 문자를 이스케이프하므로 `'C:\\dir'`는 `C:\dir`로 읽고, `\n`, `\t`, `\u0041` 같은 이스케이프를 해석하며, `DEFAULT` 값은 `'it\'s'`로 유지됩니다.

내보내는 Schema SQL은 테이블이나 컬럼 코멘트 안의 따옴표를 이스케이프합니다. MySQL, MariaDB, Snowflake는 `COMMENT 'it''s'`, PostgreSQL과 Oracle은 `COMMENT ON TABLE`과 `COMMENT ON COLUMN ... IS 'it''s'`로 작성하며, MSSQL의 `sp_addextendedproperty` 호출에서도 테이블과 컬럼 이름까지 포함해 같은 방식으로 두 번 겹쳐 씁니다. 따옴표가 없는 코멘트는 그대로 작성합니다.  
Databricks는 대신 `COMMENT 'it\'s'`처럼 따옴표와 백슬래시를 백슬래시로 이스케이프하므로, Databricks로 내보낸 결과는 Databricks가 선택된 데이터베이스일 때만 정확히 다시 읽힙니다.  
MSSQL은 각 코멘트를 `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`로 작성하며, 컬럼이면 그 뒤에 `'column', '<column>'`이 붙습니다. `Bracket`이 `None`이면 `sales.users`라는 테이블은 스키마 `sales`와 테이블 `users`가 되고, 스키마가 없는 이름은 `dbo`에 속합니다. 그 밖의 `Bracket`에서는 이름 전체가 테이블이며 `dbo`에 속합니다.

SQLite는 내보내기와 가져오기를 왕복하면 코멘트가 유지되지 않습니다. SQLite는 코멘트를 단순한 `--` 줄로 쓰는데, 파서는 이를 읽지 않습니다. MSSQL 내보내기의 `sp_addextendedproperty` 호출은 같은 테이블과 컬럼 코멘트로 다시 들어옵니다.

### GraphQL

GraphQL SDL 문서를 가져올 수 있습니다.  
object type 정의는 테이블이 되고, `extend type` 블록은 확장 대상 타입에 병합되며, interface 필드는 이를 구현하는 타입에 상속됩니다.  
타입이 다른 테이블인 필드는 컬럼 대신 관계가 되고, 양쪽이 모두 목록이면 매핑 테이블이 생성됩니다.  
`buyer: User` 같은 단수 필드는 먼저 상대 타입에서 `orderListByBuyer`처럼 이름이 `By`와 그 필드 이름으로 끝나는 필드 하나와 짝지어지며, 이때 대소문자와 밑줄은 무시합니다. `buyer2`처럼 번호가 붙은 필드는 번호를 뺀 이름으로 같은 방식으로 짝지어집니다. 두 테이블 사이에 관계가 둘 이상 있거나 테이블이 자기 자신을 참조할 때 Code Generator의 GraphQL 출력이 필드 이름을 이렇게 지으므로, 그런 출력은 모든 관계를 유지한 채 다시 가져옵니다.  
루트 타입(`Query`, `Mutation`, `Subscription`), introspection 타입, 그리고 `PageInfo`, `*Connection`, `*Edge`, `*_aggregate` 같은 Relay, federation, Hasura 래퍼는 노이즈로 보고 건너뜁니다.  
`@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index`, `@db.*` 디렉티브를 인식합니다.  
파일 이름은 `.graphql`, `.gql`, `.graphqls`로 끝나야 합니다. Prisma의 `schema.prisma` 파일은 GraphQL 문서가 아니므로 여기서 가져올 수 없습니다.

### DBML

dbdiagram.io와 dbdocs에서 사용하는 형식인 DBML 파일을 가져올 수 있습니다.  
`Table`, `TablePartial`, `Ref`, `Enum`, `TableGroup` 블록을 읽습니다. `Project`와 단독 `Note` 블록은 주변 테이블에 영향을 주지 않고 건너뜁니다.  
`Ref:` 콜론 형식, 이름이 있는 ref, `Ref { }` 블록 형식, 인라인 `[ref: > table.column]` 컬럼 설정까지 모든 ref 표기를 지원합니다.  
`<>` 다대다 ref는 양쪽 이름을 딴 매핑 테이블을 생성합니다.  
`Ref: users.id < posts.user_id [delete: cascade, update: set null]`처럼 독립된 ref의 `delete`와 `update` 설정은 관계의 `On Delete`와 `On Update`가 됩니다. 값은 `cascade`, `restrict`, `set null`, `set default`, `no action`이며 대소문자는 상관없습니다. 그 밖의 값이거나 설정이 없으면 `Not set`으로 가져오며, `color` 같은 다른 설정은 무시합니다.  
인라인 `[ref: ...]` 설정은 동작을 담지 않으며, `<>` ref의 설정은 매핑 테이블로 옮겨지지 않습니다. 같은 foreign key를 인라인과 독립된 ref로 모두 선언하면 인라인 쪽이 동작 없이 유지됩니다.  
`Table users [headercolor: #3498DB]`처럼 테이블의 `headercolor` 설정은 값이 따옴표 없이 쓴 `#rgb`나 `#rrggbb` 16진수이면 그 테이블의 색상이 됩니다. 그 밖의 값은 버리며, `TablePartial`의 `headercolor`는 그것을 사용하는 테이블에 전달되지 않습니다.  
각 `TableGroup`은 한 줄에 하나씩 `Ref`에서와 같은 방식으로 이름을 적어 나열한 테이블을 담는 [테이블 그룹](./table-groups.md)이 됩니다. 그룹의 `[color: ...]`는 `headercolor`와 같은 규칙으로 그룹의 색상이 되며, 노트와 그 밖의 설정은 버립니다. 두 그룹에 나열된 테이블은 첫 번째 그룹에 남습니다. 파일이 선언한 테이블을 하나도 나열하지 않았든 앞선 그룹이 이미 가져간 테이블만 나열했든, 테이블이 남지 않은 그룹은 만들어지지 않습니다. 그룹의 박스는 테이블이 어디에 배치되든 그 테이블에 맞춰지며, 테이블이 여러 행으로 배치될 때는 한 그룹의 테이블이 함께 모여 있습니다.  
파일 이름은 `.dbml`로 끝나야 합니다.

### AML

AML(Azimutt Markup Language) 파일을 가져올 수 있습니다. 현재 표기와 예전 v1 표기를 모두 지원합니다.  
엔티티는 테이블이 되고, 중첩 속성은 `settings.slug`처럼 점으로 이어진 컬럼 이름으로 평탄화됩니다.  
속성은 `nullable`로 표시하지 않으면 `NOT NULL`이며, `check`, `type`, `tags`처럼 에디터에 대응하는 자리가 없는 구성 요소는 거부하지 않고 버립니다. 뷰로 표시된 엔티티는 일반 테이블로 들어옵니다.  
`users {color: red}`처럼 엔티티의 `color`는 그 테이블의 색상이 됩니다. AML의 색상 이름인 `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `gray`는 따옴표 유무와 대소문자에 상관없이 읽으며, 각각 같은 이름을 가진 Tailwind 색상의 500 단계가 됩니다. 예를 들어 `red`는 `#ef4444`입니다. `"#3498db"`처럼 따옴표로 감싼 16진수는 작성한 그대로 유지되지만, 따옴표 없는 `#3498db`는 `#`이 AML 코멘트를 시작하므로 읽을 수 없습니다. 그 밖의 값, 그리고 속성이나 관계에 쓴 `color`는 버립니다.  
독립된 `rel` 문, 또는 예전 표기의 `fk`는 `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`처럼 `onDelete`와 `onUpdate` 속성을 관계의 `On Delete`와 `On Update`로 유지합니다. 값은 `cascade`, `restrict`, `set null`, `set default`, `no action`이며, 따옴표 유무와 대소문자는 상관없습니다. 그 밖의 속성은 버립니다.  
`user_id int -> users(id) {onDelete: cascade}` 같은 인라인 관계에서는 속성이 관계가 아니라 해당 컬럼에 속하므로 버려지며, 관계는 `Not set`으로 가져옵니다.  
파일 이름은 `.aml`로 끝나야 합니다.

GraphQL, DBML, AML은 왕복 가능한 형식으로, 각각 [코드 생성](./code-generator.md) 대상이기도 합니다.  
DBML과 AML은 각 관계의 ON DELETE와 ON UPDATE를 가져올 때와 생성할 때 모두 유지합니다. [코드 생성](./code-generator.md#on-delete와-on-update) 문서를 참고하세요. GraphQL은 둘 다 유지하지 않으므로, GraphQL을 가져오면 둘 다 `Not set`이 됩니다.  
DBML은 투명도를 제외한 테이블 색상과, 테이블을 담고 있는 각 테이블 그룹도 가져올 때와 생성할 때 모두 유지합니다. 이름 없는 그룹은 `group_1`, `group_2`처럼 돌아오고, 중복된 그룹 이름은 `_2`, `_3` 등이 붙어 돌아옵니다. AML은 테이블 색상을 가장 가까운 색상 이름으로만 유지하므로 `#FF8800`은 `orange`로 작성되어 `#f97316`으로 돌아오며, 그룹은 유지하지 않습니다. GraphQL은 색상도 그룹도 유지하지 않습니다.

## 내보내기

캔버스 컨텍스트 메뉴의 `Export` 하위 메뉴에는 세 가지 항목이 있습니다.

- json: 다이어그램을 파일에 담기는 그대로 `.erd.json`으로 저장합니다. 컬럼과 인덱스를 포함한 테이블, 관계, 메모, 테이블 그룹, 그리고 설정이 저장되며, [잠긴 설정](./settings.md#잠금)은 각각 잠긴 값으로 저장됩니다.
- Schema SQL: 옵션 패널이 열리고 `Save file` 버튼에 포커스가 간 상태로 [Schema SQL](./schema-sql.md#sql-저장과-복사) 탭을 엽니다. 따라서 `Enter`를 누르면 탭에 표시된 SQL이 `.sql`로 저장됩니다. 그 전에는 아무것도 저장되지 않습니다.
- Image: `Export image` 대화 상자를 엽니다. 이 대화 상자는 다이어그램을 `.png`나 `.svg`로 저장하거나 PNG로 클립보드에 복사합니다. [이미지](#이미지) 항목을 참고하세요.

세 가지 모두 읽기 전용 에디터에서도 동작합니다.

Schema SQL은 각 관계의 ON DELETE와 ON UPDATE를 `REFERENCES` 뒤에 ON DELETE부터 작성합니다. `Not set`은 아무것도 작성하지 않으며, 선택한 데이터베이스가 받아들이지 않는 동작은 생략합니다. 어떤 데이터베이스가 어떤 동작을 받아들이는지는 [관계 편집](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.

내보낸 파일은 모두 `<데이터베이스 이름>-<시간>` 뒤에 해당 확장자가 붙은 이름이며, 시간은 현지 시간 기준으로 `yyyy-MM-dd'T'HH_mm_ss` 형식입니다. 예를 들면 `my-schema-2026-08-29T04_05_06.erd.json`입니다. 데이터베이스 이름이 비어 있으면 `unnamed`가 사용됩니다.  
Schema SQL 탭과 [코드 생성](./code-generator.md)의 `Save file`도 같은 방식으로 파일 이름을 짓습니다. 이미지는 대화 상자를 연 시점의 데이터베이스 이름을 사용합니다.

`Import`, `Import and Add`, `Export`는 ERD 탭의 [빠른 검색](./quick-search.md)에서도 캔버스 컨텍스트 메뉴와 같은 항목으로 사용 가능합니다. 빠른 검색에는 모든 탭에 `Export: Schema SQL`도 있으며, `Export` ▸ `Schema SQL`과 마찬가지로 저장할 준비가 된 상태로 Schema SQL 탭을 엽니다. [SQL 저장과 복사](./schema-sql.md#sql-저장과-복사) 문서를 참고하세요.

Obsidian에서는 다운로드나 저장 대화 상자가 나타나지 않습니다. 파일은 볼트 안에서 Obsidian이 해당 다이어그램의 새 첨부 파일을 두는 위치에 저장되며, 알림으로 그 경로를 알려 줍니다.  
Obsidian이 파일 이름에 허용하지 않는 문자 `\ / : * ? " < > |`는 `-`로 바뀝니다.  
내보낸 `.erd.json`이나 `.sql` 파일은 Settings → Files and links → Detect all file extensions가 켜져 있을 때만 Obsidian의 파일 탐색기에 표시됩니다.

### 이미지

캔버스 컨텍스트 메뉴나 빠른 검색의 `Export` ▸ `Image`는 `Export image` 대화 상자를 엽니다. 대화 상자에는 이미지 미리보기와 그 옆의 옵션이 표시됩니다. 대화 상자를 열면 찾기와 바꾸기가 닫힙니다.

![Export > Image를 열고 다크 모드와 배경을 끈 뒤 3x를 골라 이미지를 클립보드에 복사하기](/img/demo-export.webp)

- `Background`: 기본적으로 켜져 있습니다. 끄면 캔버스가 투명하게 남습니다.
- `Dark mode`: 처음에는 에디터의 외관과 일치합니다. 화면의 외관과 일치하는 동안 이미지는 [테마 빌더](./language-and-theme.md)에서 바꾼 내용을 포함해 캔버스 자체의 색상을 사용하며, 다른 외관에서는 같은 회색 색상과 강조 색상의 프리셋을 사용합니다.
- `Scale`: `1x`, `2x`, `3x` 중 하나이며 기본값은 `2x`입니다. PNG와 클립보드 복사본의 크기만 정하며, 그 아래 줄에 `PNG <width> × <height> px` 형태로 그 크기가 표시됩니다.

선택한 값은 에디터가 닫힐 때까지 유지되며 문서에는 저장되지 않습니다. 미리보기는 이미지와 같은 방식으로 그려지며, `Background`나 `Dark mode`가 바뀌면 다시 그려집니다.

이미지는 대화 상자를 연 시점의 다이어그램을 담습니다. 이후의 변경을 반영하려면 대화 상자를 닫았다가 다시 여세요. 화면이 얼마나 멀리 이동해 있든 다이어그램 전체를 담으며, 다이어그램이 그리는 범위에 여백을 더해 잘라내고, 에디터가 표시 중인 배율과 상관없이 항상 100%로 그리므로 모든 테이블이 온전히 그려집니다. [View Option](./table-related-functions.md#테이블-보기-옵션)으로 숨긴 관계, 관계의 ON DELETE와 ON UPDATE 라벨, 테이블 그룹, 메모는 그려지지도 자리를 차지하지도 않으며, 테이블 그룹은 다른 모든 것의 뒤에 그려집니다.

세 버튼이 이미지를 작성하며, 어느 버튼도 대화 상자를 닫지 않습니다.

- `PNG`: 100%에서의 다이어그램 크기에 `Scale`을 곱한 크기의 `.png`를 저장합니다. 브라우저 캔버스가 감당할 수 없을 만큼 큰 PNG는 실패하는 대신 해상도를 낮춰 저장됩니다. 대화 상자가 미리 `Reduced from <width> × <height> px, past what a browser canvas can hold`로 경고하고, 저장한 뒤에는 `Exported at a reduced resolution` 알림이 그 사실을 알려 줍니다.
- `SVG`: `Scale`과 상관없이 100%에서의 다이어그램 크기로 `.svg`를 저장하며, 해상도를 낮추는 일은 없습니다. 텍스트는 텍스트로 남고 글꼴은 포함하지 않고 이름만 지정하므로, 에디터의 글꼴이 없는 뷰어에서는 다른 글꼴로 그려집니다. 그림자는 제외됩니다.
- `Copy to clipboard`: 선택한 `Scale`로 PNG를 클립보드에 넣으며, 브라우저 캔버스가 감당할 수 없으면 저장하는 PNG와 마찬가지로 해상도를 낮춥니다. 복사되면 `Copied the image to the clipboard`를, 해상도를 낮췄다면 `Copied at a reduced resolution`을 표시합니다. 브라우저나 호스트가 클립보드 사용을 거부하거나 이미지를 그리지 못해 복사에 실패하면, `Couldn't copy the image`가 대신 PNG로 저장하도록 안내합니다.

호스트가 백그라운드 워커를 실행하면 이미지는 그 워커에서 그려지므로, 그동안에도 에디터를 계속 사용할 수 있습니다. 잠깐 사이에 끝나지 않으면 `Exporting PNG`, `Exporting SVG`, `Copying image` 중 하나의 알림이 표시되며, 실패하면 `Couldn't export the PNG` 또는 `Couldn't export the SVG`로 알려 줍니다. 파일을 그리는 중에 대화 상자를 닫아도 그 파일은 그대로 저장됩니다.

대화 상자가 열리면 `PNG`에 포커스가 가며, `Tab`은 대화 상자 안에서만 이동합니다. `Escape`, `x` 버튼, 또는 주변의 어두운 영역을 클릭하면 대화 상자가 닫힙니다.  
대화 상자가 열려 있는 동안에는 Undo와 Redo를 포함한 캔버스 단축키와 복사, 붙여넣기가 동작하지 않습니다. `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac)는 대화 상자를 닫고 빠른 검색을 열며, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac)는 대화 상자를 닫고 찾기와 바꾸기를 엽니다.
