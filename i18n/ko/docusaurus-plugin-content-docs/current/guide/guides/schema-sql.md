---
sidebar_position: 11
description: Schema SQL 탭에서 다이어그램의 DDL 읽기, 옵션 패널에서 데이터베이스·따옴표·구문·헤더·테이블 고르기, 테이블 앞뒤에 직접 작성한 스크립트 추가하기, SQL 저장과 복사.
---

# Schema SQL

`Schema SQL` 탭은 선택한 데이터베이스에 맞춘 다이어그램의 DDL, 즉 테이블을 키, 인덱스, foreign key와 함께 생성하는 SQL을 보여 줍니다.  
툴바에서 `Schema SQL` 탭으로 전환하거나, [빠른 검색](./quick-search.md)의 `Tab` 아래에서 `Schema SQL`을 고릅니다. `Export` 하위 메뉴에서 `Schema SQL`을 골라도 저장할 준비가 된 상태로 이 탭이 열립니다. [SQL 저장과 복사](#sql-저장과-복사) 항목을 참고하세요.

SQL은 왼쪽에 놓이고, 그 오른쪽에는 `Schema SQL`이라는 제목의 옵션 패널이 SQL을 결정하는 선택 항목을 담고 있습니다. [옵션 패널](#옵션-패널) 항목을 참고하세요. 오른쪽에서 왼쪽으로 쓰는 표시 언어에서도 SQL은 왼쪽에 놓이며 왼쪽에서 오른쪽으로 읽힙니다.  
탭을 처음 열 때 에디터의 너비가 640 px보다 좁지 않으면 패널은 자동으로 열립니다. 패널 헤더의 `Hide options`는 패널을 접고, 코드 오른쪽 위의 `Show options`는 패널을 다시 엽니다. 이후 패널은 에디터가 열려 있는 동안 탭을 전환해도 마지막으로 둔 대로 열리거나 접힌 상태를 유지합니다. Code Generator 탭의 패널과는 따로 접히고 열리며, 파일에는 저장되지 않습니다.

![Export > Schema SQL을 열고 구문을 Drop & re-create로, 헤더를 USE로 바꾼 뒤 테이블 앞에 SET NAMES 스크립트를 추가하는 모습](/img/demo-schema-sql-options.webp)

SQL을 마우스 오른쪽 클릭하면 컨텍스트 메뉴가 열립니다.

- `Database`와 `Bracket`. 각각 현재 값에 체크 표시가 되는 하위 메뉴입니다.
- `Statements`와 `Header`. 각각 적용 중인 선택지에 체크 표시가 되는 하위 메뉴입니다. 데이터베이스에 없는 선택지에는 `not in Oracle` 같은 안내 문구가 흐리게 붙으며, 골라도 아무 일도 일어나지 않습니다.
- `Options panel`. 패널이 표시되어 있는 동안 체크 표시가 되며, 패널을 접거나 엽니다.
- `Save file`

이 탭이 열려 있는 동안 빠른 검색에는 `Database`와 `Bracket`, 데이터베이스에 있는 선택지만 나열하는 `Schema SQL: Statements`와 `Schema SQL: Header`, 그리고 패널을 접거나 여는 `Schema SQL: Options panel`이 표시됩니다.

SQL은 탭이 열릴 때 작성되며, 패널의 선택, 데이터베이스 이름, 스크립트 중 하나가 바뀔 때마다 다시 작성됩니다. 탭이 열려 있는 동안 테이블에 가해진 편집은 공동 편집자나 코딩 에이전트의 편집이라도, 탭을 벗어났다가 다시 돌아오거나 위의 항목 중 하나가 바뀌어야 표시됩니다.

[테이블 속성](./table-related-functions.md#테이블-속성)에는 테이블 하나의 DDL을 보여 주는 자체 `Schema SQL` 탭이 있습니다. 이 탭은 항상 헤더나 스크립트 없이 일반 `CREATE` 문을 작성하고, 옵션 패널이 없으며, 컨텍스트 메뉴에는 `Database`와 `Bracket`만 있습니다.

## 옵션 패널

패널에는 각각 캡션 아래에 놓인 세 묶음이 있습니다.

1. `Saved in the document`: `Database`와 `Bracket`. [데이터베이스와 Bracket](#데이터베이스와-bracket) 항목을 참고하세요.
2. `This window only`: `Statements`, `Header`, 그리고 다이어그램에 [테이블 그룹](./table-groups.md)이 있는 동안의 `Tables`. [Statements](#statements), [Header](#header), [Tables](#tables) 항목을 참고하세요.
3. `Saved in the document · written as is for every database`: `Before tables`와 `After tables` 스크립트. [앞뒤 스크립트](#앞뒤-스크립트) 항목을 참고하세요.

패널 맨 아래에는 `Save file`과 `Copy`가 있습니다. [SQL 저장과 복사](#sql-저장과-복사) 항목을 참고하세요.

`This window only` 아래의 선택은 그 선택을 한 에디터 창에 속합니다. 문서에 저장되지도, 공동 편집자와 공유되지도, Undo 히스토리에 기록되지도 않으며, 에디터를 닫거나 다시 불러오면 초기화됩니다. 탭을 전환해도 유지됩니다.  
`Statements`는 `If not exists`에서, `Header`는 `CREATE + USE`에서 시작합니다. 에디터를 임베드한 페이지가 [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql)로 읽는 SQL과 코딩 에이전트가 읽는 SQL은 대신 헤더 없이 `Create`에서 시작합니다.

선택한 데이터베이스에 없는 선택지는 패널에 흐리게 남고 `Not in Oracle`처럼 `Not in <database>` 툴팁이 붙으며, 눌러도 아무 일도 일어나지 않습니다.  
이때 SQL은 데이터베이스에 있는 가장 가까운 형태를 사용하며, 그 형태의 버튼이 눌린 상태로 표시됩니다. `If not exists`는 `Create`로, `CREATE + USE`는 `USE`로, 데이터베이스에 `USE`도 없으면 `None`으로, `USE`는 `None`으로 대체됩니다. 고른 선택은 유지되므로, 그 선택지가 있는 데이터베이스로 바꾸면 다시 적용됩니다.

## 데이터베이스와 Bracket

`Database`는 다이어그램의 데이터베이스로, 캔버스 컨텍스트 메뉴의 `Database`와도, Code Generator의 데이터베이스와도 같은 설정입니다. [데이터베이스](./table-related-functions.md#데이터베이스) 문서를 참고하세요. Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, SQLite를 나열하며, MySQL에서 시작하고, 다른 편집과 마찬가지로 파일에 저장됩니다.

`Bracket`은 테이블, 컬럼, 제약 조건, 인덱스 이름을 감싸는 따옴표를 지정합니다. `SingleQuote`, `DoubleQuote`, `Backtick`, 또는 전혀 감싸지 않는 `None` 중 하나이며, 기본값은 `None`입니다. Code Generator에서 쓰는 것과 같은 설정입니다. [Bracket](./code-generator.md#bracket) 문서를 참고하세요.  
이름을 큰따옴표로만 감싸는 Snowflake는 `None`이 아닌 모든 선택에서 큰따옴표를 사용하며, Databricks는 항상 이름을 백틱으로 감쌉니다.  
`Bracket`은 설정 탭의 `Bracket Type` 잠금이 꺼져 있는 동안에만 파일에 저장되며, 새 다이어그램은 모든 잠금이 켜진 상태입니다. 잠금이 켜져 있는 동안 값을 바꾸면 화면의 SQL은 다시 작성되지만, 파일은 잠긴 값을 유지하고 다이어그램을 다시 열면 그 값으로 돌아옵니다. [잠금](./settings.md#잠금) 문서를 참고하세요.

데이터베이스가 Oracle이고 SQL에 Oracle 12.1 이하가 거부하는 30바이트보다 긴 이름이 있으면, 두 목록 아래의 안내 문구가 `Oracle 12.2+ for names over 30 bytes: <names>`로 그 이름을 하나하나 밝힙니다. 테이블, 컬럼, 스키마, 키, 인덱스, 시퀀스, 트리거 이름을 검사합니다. SQL 자체는 바뀌지 않습니다.

## Statements

`Statements`는 테이블을 생성하는 방식을 정합니다.

- `Create`는 일반 `CREATE` 문을 작성합니다.
- `If not exists`는 이미 있는 테이블과 인덱스를 건너뜁니다. MySQL, MariaDB, PostgreSQL, SQLite, Databricks에 있으며, MSSQL, Oracle, Snowflake는 대신 `Create`로 작성합니다.
  - MySQL은 각 테이블을 unique 제약 조건, 인덱스, foreign key를 안에 담은 `CREATE TABLE IF NOT EXISTS`로 작성하고, 전체를 `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;`과 `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;` 사이에 둡니다.
  - MariaDB는 `CREATE TABLE`, 각 `UNIQUE`와 `FOREIGN KEY` 제약 조건, 각 `CREATE INDEX`까지 모든 구문에 `IF NOT EXISTS`를 붙입니다.
  - PostgreSQL은 `CREATE TABLE IF NOT EXISTS`와 `CREATE INDEX IF NOT EXISTS`를 작성하며, 각 foreign key는 다시 추가하기 전에 `DROP CONSTRAINT IF EXISTS`로 삭제합니다.
  - SQLite는 `CREATE TABLE IF NOT EXISTS`와 `CREATE INDEX IF NOT EXISTS`를 작성합니다.
  - Databricks는 `CREATE TABLE IF NOT EXISTS`를 작성하며, 각 foreign key는 다시 추가하기 전에 `DROP CONSTRAINT IF EXISTS`로 삭제합니다.
- `Drop & re-create`는 Snowflake를 제외하고, 작성하는 모든 테이블을 다시 생성하기 전에 삭제합니다. 모든 데이터베이스에 있습니다.
  - MySQL과 MariaDB는 foreign key 검사를 껐다가 다시 켜는 같은 두 줄 사이에 테이블마다 `DROP TABLE IF EXISTS`를 작성합니다.
  - PostgreSQL은 모든 테이블을 나열한 `DROP TABLE IF EXISTS` 하나를 작성하며, 목록 밖의 테이블이 그중 하나를 참조하면 실패합니다. `CREATE + USE` 헤더에서는 이름에 스키마가 없는 테이블을 `shop.member`처럼 그 스키마에서 삭제합니다.
  - MSSQL은 트랜잭션 하나를 작성하며, 버튼의 툴팁 `SQL Server 2016+`가 알려 주듯 SQL Server 2016 이상이 필요합니다. 작성하는 테이블이 가진 foreign key를 먼저 삭제하고, 이어서 `DROP TABLE IF EXISTS` 하나로 테이블을 삭제하며, 오류가 나면 롤백합니다. 목록 밖의 테이블이 가진 foreign key는 여전히 삭제를 막습니다.
  - SQLite는 `PRAGMA foreign_keys=OFF;`를 작성한 뒤 테이블마다 `DROP TABLE IF EXISTS`를 작성합니다. 이 설정은 해당 연결에서 계속 꺼진 채로 남습니다.
  - Oracle은 테이블마다 `DROP TABLE … CASCADE CONSTRAINTS`를, auto-increment 시퀀스마다 `DROP SEQUENCE`를 작성합니다. 각 구문은 `/` 줄로 끝나는 PL/SQL 블록 안에 놓이며, 없는 테이블이나 시퀀스가 일으키는 오류는 넘어갑니다.
  - Databricks는 테이블마다 `DROP TABLE IF EXISTS`를 작성합니다.
  - Snowflake는 아무것도 삭제하지 않고 대신 `CREATE OR REPLACE TABLE`을 작성합니다.

`Drop & re-create`가 적용 중인 동안에는 패널의 경고가 `Drops <tables> before creating them. Their rows are lost.`로 삭제할 테이블을 밝히며, Snowflake에서는 `Replaces <tables>. Their rows are lost.`로 밝힙니다.  
테이블은 다섯 개까지 모두 이름이 표시됩니다. 다섯 개를 넘으면 `a, b, c, d, and 3 more tables`처럼 처음 네 개의 이름과 나머지 개수를 표시합니다.

## Header

`Header`는 SQL이 실행될 데이터베이스나 스키마를 생성하거나 선택하는 구문으로 SQL을 시작합니다. 이름은 툴바의 `database name` 입력란에 입력한 다이어그램의 데이터베이스 이름이며, `Bracket` 문자로 감싸집니다.

- MySQL과 MariaDB: `USE`는 `USE shop;`을 작성하고, `CREATE + USE`는 그 앞에 `CREATE DATABASE IF NOT EXISTS shop;`을 작성합니다.
- MSSQL: `USE`는 `USE shop`과 `GO`를 작성하고, `CREATE + USE`는 그 앞에 `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop`과 `GO`를 작성합니다.
- PostgreSQL에는 `CREATE + USE`만 있으며, `CREATE SCHEMA IF NOT EXISTS shop;`과 `SET search_path TO shop, public;`을 작성합니다.
- Oracle에는 `USE`만 있으며, `ALTER SESSION SET CURRENT_SCHEMA = shop;`을 작성합니다. `CREATE + USE`는 이것으로 대체되므로, 탭의 기본 헤더에서 Oracle이 작성하는 줄은 이것입니다.
- Snowflake와 Databricks: `USE`는 `USE SCHEMA shop;`을 작성하고, `CREATE + USE`는 그 앞에 `CREATE SCHEMA IF NOT EXISTS shop;`을 작성합니다.
- SQLite에는 둘 다 없으며, 헤더를 작성하지 않습니다.

데이터베이스에 `USE`나 `CREATE + USE`가 있으면, 버튼의 툴팁이 PostgreSQL의 `CREATE SCHEMA + SET search_path`처럼 그 데이터베이스에서 작성하는 내용을 알려 줍니다.

헤더는 데이터베이스 이름이 단순한 식별자일 때만 작성됩니다. 즉 ASCII 문자(`A`–`Z`, `a`–`z`)나 `_`로 시작하고, 그 뒤에 ASCII 문자, 숫자, `_`가 오는 이름입니다.  
빈 이름을 포함해 그 밖의 이름은 헤더를 작성하지 않으며, 이때 PostgreSQL의 `DROP TABLE`도 스키마를 붙이지 않습니다. `None`이 아닌 헤더가 적용 중인 동안에는 `Header` 아래의 안내 문구 `Database name "<name>" is not a valid identifier.`가 이를 알려 줍니다.  
새 다이어그램의 데이터베이스 이름은 비어 있으므로, 이름을 지정하기 전까지 패널에는 `Database name "" is not a valid identifier.`가 표시됩니다.

## Tables

다이어그램에 표시되어 있든 숨겨져 있든 [테이블 그룹](./table-groups.md)이 하나 이상 있는 동안에는 `This window only` 아래에 `Tables`가 나타나며, 선택지마다 체크박스가 있습니다.

- `All`: 모든 체크박스를 체크하거나 해제합니다. 일부만 체크된 동안에는 중간 상태로 표시됩니다.
- 테이블 그룹마다 하나씩 있는 체크박스: 다이어그램의 그룹 순서대로 놓이며, 그룹 이름이나 이름이 없는 그룹이면 `unnamed`로 표시되고, 그룹에 색상이 있으면 그룹 색상의 점 뒤에 표시됩니다.
- `No group`: 어느 그룹에도 속하지 않은 테이블입니다.

모든 체크박스가 체크되어 있으면 탭은 다이어그램 전체를 작성합니다.  
일부만 체크되어 있으면 체크된 체크박스의 테이블을 그 인덱스, 그리고 그 테이블이 가진 foreign key와 함께 작성하며, 제외된 테이블을 참조하는 foreign key도 포함됩니다. 앞뒤 스크립트는 그대로 작성되며, `Drop & re-create`, 그 경고, 긴 이름에 대한 Oracle 안내 문구는 그 테이블에만 적용됩니다.  
아무것도 체크되어 있지 않으면 탭은 아무것도 작성하지 않으며, 코드 위에 `No tables chosen. Check some under Tables.` 안내가 표시됩니다. 이때 `Save file`은 빈 파일을 저장하고, `Copy`는 빈 텍스트를 복사합니다.

`Statements`, `Header`와 마찬가지로 이 선택은 창에 속합니다. [옵션 패널](#옵션-패널) 항목을 참고하세요.  
나중에 추가한 그룹은 그 시점에 모든 체크박스가 체크되어 있었을 때만 체크된 상태로 시작합니다. 그룹을 삭제하면 그 체크박스가 사라지고, 마지막 그룹을 삭제하면 다시 모두 체크됩니다.  
이 선택은 이 탭에만 적용됩니다. 테이블 속성의 `Schema SQL` 탭과 `getSchemaSQL()`은 영향을 받지 않습니다.

## 앞뒤 스크립트

`Before tables`와 `After tables`에는 테이블 앞의 `CREATE EXTENSION`이나 `SET` 구문, 테이블 뒤의 권한 부여, 뷰, 시드 데이터처럼 직접 작성한 SQL을 담습니다.  
두 스크립트는 문서에 저장되며, 데이터베이스와 상관없이 다이어그램 전체에 한 쌍입니다. 각 스크립트는 검사 없이 입력한 그대로 SQL에 작성됩니다. 앞 스크립트는 헤더 다음, `DROP` 문과 테이블 앞에, 뒤 스크립트는 맨 끝에 놓입니다.

줄바꿈은 LF로 작성되며, 스크립트 앞의 빈 줄과 뒤의 공백은 제거됩니다.  
MSSQL에서는 마지막 줄이 `GO`(또는 개수가 붙은 `GO`)가 아닌 스크립트 뒤에 `GO` 줄이 추가되며, 두 입력란 아래의 줄이 이를 알려 줍니다. Oracle에서는 PL/SQL 블록을 끝내는 `/` 줄을 직접 작성하세요.

입력란은 SQL을 강조 표시하며 텍스트에 맞춰 늘어납니다.  
편집은 다른 곳을 클릭하거나 탭을 전환해 입력란을 벗어날 때 적용되며, 그때 비로소 옆의 SQL과 문서가 바뀝니다. 클릭만 하고 벗어난 입력란은 아무것도 바꾸지 않습니다.  
스크립트 편집은 다른 편집과 마찬가지로 다이어그램을 바꿉니다. 파일에 저장되고, 공동 편집자에게 보이며, 적용된 각 편집은 [Undo 히스토리](./undo-redo.md)의 한 단계가 되고, Undo는 ERD 탭에서 합니다.  
입력란에 입력하는 동안에는 에디터 자체의 단축키가 입력란에 양보하므로, `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)는 입력란에서의 입력을 되돌리고, 복사, 잘라내기, 붙여넣기는 다이어그램이 아니라 텍스트에 동작합니다.  
빠른 검색과 [탐색기의 검색](./find-and-replace.md)은 여전히 각각의 단축키인 `Ctrl + K`와 `Ctrl + F` (Windows/Linux) or `⌘ + K`와 `⌘ + F` (Mac)로 열립니다. `Ctrl + F` 또는 `⌘ + F`는 ERD 탭으로 전환하므로, 다른 탭 전환과 마찬가지로 입력란의 편집을 적용합니다.  
키보드 포커스가 없는 입력란은 공동 편집자나 [코딩 에이전트](../../mcp/tools.md#설정)가 스크립트에 가한 변경을 따라갑니다. 포커스가 있는 입력란은 입력하지 않고 벗어날 때 그 변경을 표시합니다. 입력했다면 벗어날 때 입력한 텍스트가 적용되어 그 변경을 대체합니다.

## SQL 저장과 복사

패널 맨 아래나 컨텍스트 메뉴에 있는 `Save file`은 현재 데이터베이스, `Bracket`, 구문, 헤더, 테이블, 스크립트가 반영된, 탭에 표시된 SQL 그대로를 `<데이터베이스 이름>-<시간>.sql`로 저장합니다. 파일 이름과 저장 방식은 다른 모든 내보내기와 같습니다. [내보내기](./file-import-export.md#내보내기) 문서를 참고하세요.

캔버스 컨텍스트 메뉴나 빠른 검색의 `Export` ▸ `Schema SQL`은 그것만으로는 아무것도 저장하지 않습니다.  
고르면 이 탭으로 전환하고, 옵션 패널이 접혀 있었더라도 열고, `Save file`에 키보드 포커스를 두므로 `Enter`를 누르면 파일이 저장됩니다.

패널 맨 아래의 `Copy` 또는 코드에 마우스를 올리는 동안 코드 오른쪽 위에 나타나는 복사 버튼은 SQL을 복사합니다.  
체크 표시가 있는 `Copied!` 토스트가 2초 동안 표시되어 확인해 줍니다. 브라우저나 호스트가 클립보드 사용을 거부하면 대신 경고 표시가 있는 `Couldn't copy to the clipboard` 토스트가 알려 줍니다. 다시 복사하면 토스트가 하나 더 추가되지 않고 기존 토스트를 대체합니다.  
SQL은 선택할 수도 있으므로 필요한 부분만 가져올 수 있습니다.

## DDL이 작성하는 내용

이 규칙은 에디터가 Schema SQL을 작성하는 모든 곳에 적용됩니다. 이 탭과 그 파일, 그리고 에디터를 임베드한 페이지나 코딩 에이전트가 읽는 SQL입니다.  
테이블 속성의 `Schema SQL` 탭도 표시하는 테이블 하나에 대해 이 규칙을 따릅니다. 다만 `CREATE TABLE` 안에 놓이는 SQLite의 foreign key를 제외하면 foreign key를 작성하지 않으며, Oracle의 시퀀스와 트리거도 작성하지 않습니다.

각 부분은 헤더, 앞 스크립트, `DROP` 문, 테이블, 뒤 스크립트 순서로 빈 줄 하나를 사이에 두고 놓입니다. 테이블은 이름순으로 작성됩니다.  
테이블도 스크립트도 없는 다이어그램은 헤더를 골랐더라도 아무것도 작성하지 않습니다.

### Auto Increment

`Auto Increment`로 표시된 컬럼은 각 데이터베이스의 방식대로 작성됩니다. MySQL과 MariaDB는 `AUTO_INCREMENT`, MSSQL은 `IDENTITY(1,1)`, Snowflake는 `AUTOINCREMENT`, PostgreSQL과 Databricks는 `GENERATED ALWAYS AS IDENTITY`입니다.  
Oracle에는 시퀀스 `SEQ_<테이블 이름>`과, 그 시퀀스로 컬럼을 채우는 트리거 `SEQ_TRG_<테이블 이름>`이 작성됩니다. 트리거는 `/` 줄로 끝나므로 SQL\*Plus와 SQLcl에서 실행됩니다.

데이터베이스가 컬럼의 타입에 auto increment를 허용하지 않으면 그 절은 생략되며, 테이블 뒤의 코멘트 줄이 그 컬럼을 밝힙니다.

- PostgreSQL은 `smallint`, `integer`, `bigint`에서만 허용하며, `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4`, `INT8` 중 어느 이름으로 쓰든 마찬가지입니다. 다른 타입의 컬럼은 절도 기본값도 받지 않으며, 코멘트는 예를 들어 `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`입니다.
- Databricks는 `BIGINT`나 `LONG`에서만 허용합니다.
- SQLite는 `INT`, `BIGINT`, `INT8`처럼 정수 타입인, 테이블의 유일한 primary key 컬럼에서만 `AUTOINCREMENT`를 허용하며, 너비가 있든 없든 상관없습니다. 그 컬럼은 `INTEGER`로, 키는 `PRIMARY KEY (id AUTOINCREMENT)`로 작성됩니다. 그 밖의 타입인 단일 키는 `AUTOINCREMENT` 없이 작성됩니다.

### 참조 동작

각 데이터베이스가 어떤 ON DELETE와 ON UPDATE 동작을 작성하는지는 [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서에 나열되어 있습니다.  
Snowflake가 동작을 생략하면, 그 foreign key의 `ALTER TABLE` 위에 `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`처럼 그 동작을 밝히는 코멘트가 놓입니다.

### 스키마 한정 테이블 이름

`Bracket`이 `None`이면 `sales.users`처럼 점이 있는 테이블 이름은 스키마와 테이블로 읽히며, 대괄호나 큰따옴표 밖에 있는 마지막 점에서 나뉩니다.

- MySQL, MariaDB, MSSQL, Oracle, PostgreSQL은 작성하는 자동 이름을 테이블 부분만으로 만듭니다. 다섯 데이터베이스 모두 `FK_users_TO_orders`와 `IDX_users`, PostgreSQL을 제외한 모두 `UQ_users_email`, 그리고 이 중 primary key에 이름을 붙이는 MSSQL과 Oracle은 `PK_users`입니다. 이 두 데이터베이스에서는 `[sales].[users]`와 `"sales"."users"`도 `PK_users`가 되고, `[Order]`는 `PK_Order`가 됩니다.
- SQLite는 제약 조건에 이름을 붙이지 않으므로, 만드는 자동 이름은 `CREATE INDEX sales.IDX_users ON users`처럼 인덱스 이름뿐입니다.
- Oracle은 테이블의 인덱스와 auto-increment 컬럼의 시퀀스와 트리거를 테이블의 스키마에 생성하므로, `sales.IDX_users`, `sales.SEQ_users`, `sales.SEQ_TRG_users`가 됩니다.
- Oracle과 SQLite에서는 직접 스키마를 붙인 인덱스 이름이 그 스키마를 유지합니다.
- 앞선 이름과 대소문자를 무시하고 같은 자동 foreign key 이름이나 인덱스 이름에는 번호가 붙습니다. `orders`가 `sales.users`와 `hr.Users`를 모두 참조하면 두 번째 키는 `FK_Users_TO_orders1`입니다.

그 밖의 `Bracket`에서는 테이블 이름 전체가 하나의 식별자이므로 `"PK_sales.users"`처럼 작성됩니다. Snowflake와 Databricks는 항상 이름 전체를 유지합니다.  
[인덱스](./table-related-functions.md#인덱스) 탭의 `Keys` 행에도 같은 이름이 표시됩니다.

### 기본값

컬럼의 기본값은 입력한 그대로 작성되지만, 데이터베이스가 그 표현식을 괄호 안에서만 읽는 경우에는 괄호로 감쌉니다. 이미 괄호로 감싼 기본값은 그대로 둡니다.

- MySQL은 `(uuid())`처럼 리터럴이나 현재 시각이 아닌 모든 것을 감쌉니다. 또한 `BLOB`, `TEXT`, `JSON`, 공간 타입, `LONG…` 컬럼에서는 `NULL`이 아닌 모든 기본값을, `TIMESTAMP`나 `DATETIME`이 아닌 컬럼에서는 현재 시각을 감쌉니다.
- MariaDB는 리터럴, 현재 시각, 함수 호출, 이름이 아닌 모든 것을 감쌉니다.
- SQLite는 `(datetime('now'))`처럼 리터럴이나 이름이 아닌 모든 것을 감쌉니다.
- PostgreSQL은 `(now() AT TIME ZONE 'utc')`처럼 괄호 밖에 `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE`, `= ANY` 같은 단어가 있는 표현식만 감쌉니다.
- MSSQL, Oracle, Snowflake, Databricks는 모든 기본값을 입력한 그대로 작성합니다.

## 읽기 전용 에디터

`readonly` 에디터에서도 탭은 평소처럼 동작합니다. `Database`와 `Bracket`은 여전히 표시되는 SQL을 바꾸고, `Statements`, `Header`, `Tables`도 여전히 동작하며, `Save file`과 `Copy`도 여전히 SQL을 저장하고 복사합니다.  
두 스크립트 입력란만 읽기 전용입니다.
