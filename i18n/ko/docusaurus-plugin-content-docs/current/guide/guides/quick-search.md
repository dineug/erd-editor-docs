---
sidebar_position: 6
---

# 빠른 검색

빠른 검색은 에디터의 커맨드 팔레트입니다.  
현재 탭에서 사용 가능한 명령을 나열하며, ERD 탭에서는 모든 테이블도 함께 나열해 원하는 테이블로 바로 이동할 수 있습니다.

단축키 `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac)로 열거나, 툴바의 `Search`를 클릭해 엽니다.  
같은 단축키로 닫히며 `Esc`나 패널 바깥 클릭으로도 닫힙니다. 팔레트를 열면 테이블 속성 패널과 테마 빌더가 닫히고, 테이블 셀을 편집하는 중에는 열리지 않습니다.

![⌘ + K로 테이블로 이동한 뒤, Import 하위 메뉴에서 sdl을 입력해 GraphQL 찾기](/img/demo-quick-search.webp)

## 검색과 이동

입력하면 목록이 필터링됩니다. 퍼지 매칭으로 동작하며 항목 이름과 옆에 표시된 키워드를 함께 검색합니다. 예를 들어 `Import` 하위 메뉴에서는 `sdl`로 `GraphQL`을, `dbdiagram`으로 `DBML`을, `azimutt`로 `AML`을 찾을 수 있습니다.  
`↑`와 `↓`로 목록을 이동하며 양 끝에서 순환하고, `Enter`로 선택된 항목을 실행합니다. 자체 단축키가 있는 명령은 오른쪽에 단축키를 표시합니다.

`Database`, `Import`, `Auto Layout` 같은 항목은 하위 메뉴를 엽니다. 하위 메뉴 항목이 기존 목록을 대체하고 검색어는 비워집니다. 필터링은 항상 현재 보이는 목록에만 적용되며 상위 단계로 돌아가는 방법은 없으므로, 처음부터 다시 하려면 팔레트를 닫았다가 다시 엽니다.

## 팔레트에 표시되는 항목

목록은 현재 탭에 따라 달라집니다. 모든 탭에서 목록은 `Tab`으로 시작하며 `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Generator Code`, `Settings`로 전환합니다. 현재 탭은 목록에서 제외되며, `Generator Code`는 툴바에서 `Code Generator`로 표시되는 탭입니다.

ERD 탭에서는 데이터베이스 벤더, `Import`와 `Export`, `New Table`과 `New Memo`, 4가지 관계 타입, `Auto Layout`, 그리고 이름순으로 정렬된 테이블 항목이 테이블마다 하나씩 표시됩니다. 이름이 비어 있는 테이블은 `unnamed`로 표시되며, 실행하면 해당 테이블로 스크롤한 뒤 선택합니다.  
이 항목들은 캔버스 컨텍스트 메뉴와 같은 명령을 실행하지만, `Diff Viewer`는 컨텍스트 메뉴에서만 사용 가능합니다. 여기서 `Export`는 `json`과 `Schema SQL`만 제공하므로, PNG는 [캔버스 컨텍스트 메뉴](./file-import-export.md#내보내기)에서 내보냅니다.  
각 형식의 동작은 [파일 가져오기와 내보내기](./file-import-export.md) 문서를, 데이터베이스 선택이 영향을 주는 범위는 [테이블 관련 기능](./table-related-functions.md#데이터베이스) 문서를 참고하세요.

Schema SQL 탭에서는 데이터베이스 벤더와 `Bracket`이 표시됩니다. `Bracket`은 생성되는 SQL에서 테이블, 컬럼, 제약조건, 인덱스 이름을 감싸는 따옴표 문자를 지정하며 `SingleQuote`, `DoubleQuote`, `Backtick`, 전혀 감싸지 않는 `None`을 지원합니다.

Code Generator 탭에서는 대상 언어와 `Table Name Case`, `Column Name Case`가 표시됩니다. 각 대상이 생성하는 코드는 [코드 생성](./code-generator.md) 문서를 참고하세요.

Visualization과 Settings 탭에서는 `Tab`만 표시됩니다.
