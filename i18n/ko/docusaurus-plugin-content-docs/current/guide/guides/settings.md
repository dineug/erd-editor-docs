---
sidebar_position: 16
description: 관계 데이터 타입 동기화와 도메인, 코멘트 최대 너비, 테이블 너비 재계산, 설정 잠금(화면, 탭, 코드 설정, 이름 표시), 컬럼 순서와 단축키 목록.
---

# 설정

툴바의 `Settings` 버튼으로 열거나, [빠른 검색](./quick-search.md)의 `Tab`에서 열 수 있습니다.
설정 화면은 `Preferences`와 `Shortcuts` 2개의 탭으로 구성되며, `Preferences`가 먼저 열립니다. 단, [시작 화면](./editing-start.md#시작-화면)의 `Shortcuts` 행에서 열면 `Shortcuts`가 열립니다.

테마와 표시 언어는 이 화면에 없습니다. 툴바의 `Theme`과 `Display Language` 버튼으로 엽니다. [언어와 테마](./language-and-theme.md) 문서를 참고하세요.

## 관계 데이터 타입 동기화

데이터 타입 동기화 여부를 결정합니다. 기본적으로 켜져 있습니다.
켜져 있을 때 컬럼의 데이터 타입을 변경하면 관계로 연결된 모든 컬럼에 그 타입이 적용되며, 양쪽 끝에서 연결을 따라가므로 foreign key가 참조하는 키와 달라지지 않습니다.
키에서 foreign key로 갈 때는 관계를 그릴 때와 마찬가지로 serial 타입이 그 serial이 저장하는 정수 타입으로 전달됩니다. [식별 관계](./relationship-editing.md#식별-관계) 문서를 참고하세요. 따라서 PostgreSQL에서 키를 `serial`로 바꾸면 그 foreign key는 `integer`가 되며, 변경은 거기서부터 연결을 따라 계속 이어집니다.
foreign key에서 그 키로 거슬러 갈 때는 타입이 작성된 그대로 전달되지만, serial 키는 자신의 타입을 유지하며 변경도 거기서 멈춥니다.
[컬럼 매핑](./relationship-editing.md#컬럼-매핑)도 이 설정을 따릅니다. 켜져 있는 동안에는 매핑하는 기존 컬럼이 각각 부모 키가 foreign key에 주는 타입을 받으며, 변경은 위와 같이 관계를 따라 이어집니다. 꺼져 있거나 키에 데이터 타입이 없으면 컬럼은 자신의 타입을 유지합니다.

[도메인](./dictionary.md#domains-and-data-types)은 자신의 `Data Type`이 바뀔 때와 컬럼이 연결될 때 그 타입을 연결된 컬럼에 적용합니다. 이 설정이 켜져 있는 동안에는 변경이 그 컬럼들 각각에서 위와 같이 관계를 따라 이어지며, 꺼져 있는 동안에는 연결된 컬럼만 바뀝니다. 그 단계에서 도메인의 타입을 받은 컬럼은 serial 키가 foreign key에 주는 정수 타입처럼 동기화가 다른 타입을 주는 경우에도 그 타입을 유지합니다.
동기화나 컬럼 매핑이 연결된 컬럼에 자기 도메인과 다른 타입을 주면, 그 컬럼은 같은 단계에서 그 도메인과의 연결이 해제됩니다. [연결 해제](./dictionary.md#unlinking) 문서를 참고하세요. 어떤 컬럼 붙여넣기도 이 설정을 따라 타입을 전달하지 않으며, 붙여넣기가 연결하는 도메인의 타입도 마찬가지입니다. [Column 복사/붙여넣기](./table-editing.md#column-복사붙여넣기) 문서를 참고하세요. 사전 탭의 `Domains` 시트에 붙여넣은 `Data Type`은 도메인 타입의 다른 모든 변경과 마찬가지로 이 설정을 따라 전달됩니다.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="관계 데이터 타입 동기화 설정" loading="lazy" />

![members.id를 BIGINT UNSIGNED로 변경하면 관계로 연결된 모든 member_id도 함께 바뀌는 모습](/img/demo-relationship-data-type-sync.webp)

## 코멘트 최대 너비

코멘트 컬럼의 최대 너비를 픽셀 단위(`60` ~ `200`)로 지정합니다.
스위치를 끄면 제한이 없어지고, 꺼져 있는 동안에는 입력이 비활성화됩니다.
다시 켜면 `60px`부터 시작합니다. 범위를 벗어난 값을 입력하면 가장 가까운 끝값으로 맞춰집니다.

![코멘트 최대 너비를 켜고 120을 입력한 뒤 ERD 탭에서 그 너비로 잘린 코멘트](/img/demo-settings-comment-width.webp)

## 테이블 너비 재계산

`Sync`를 누르면 모든 테이블과 컬럼 셀의 너비를 현재 텍스트에 맞게 다시 계산하고, 새로운 크기에 맞춰 관계 연결선을 다시 그립니다.
완료되면 `Recalculated table width` 토스트로 알려 줍니다.
문서를 불러올 때마다 너비는 자동으로 다시 계산되므로, 폰트나 렌더링이 바뀌어 너비가 어긋난 경우에만 필요합니다.
너비는 파일에 저장되지 않으므로 `Sync`는 파일을 바꾸지 않습니다.

## 잠금

`Lock` 목록에는 7개의 설정이 있습니다. 설정의 잠금이 켜져 있는 동안 파일은 잠글 때의 값을 유지하므로, 화면에서 그 설정을 바꿔도 파일은 그대로 유지됩니다.

| 행 | 파일이 유지하는 값 | 새 다이어그램의 값 |
| --- | --- | --- |
| `Viewport` | ERD 캔버스의 확대/축소 레벨과 화면 위치(하나의 잠금) | `100% · 0, 0` |
| `Canvas Type` | 다이어그램이 열리는 탭(`ERD`, `Visualization`, `Schema SQL`, `Code Generator`, `Dictionary` 중 하나) | `ERD` |
| `Language` | [Code Generator](./code-generator.md#language) 언어 | `GraphQL` |
| `Table Name Case` | Code Generator의 [테이블 이름 케이스](./code-generator.md#name-case) | `Pascal` |
| `Column Name Case` | Code Generator의 [컬럼 이름 케이스](./code-generator.md#name-case) | `Camel` |
| `Bracket Type` | [Schema SQL](./schema-sql.md#데이터베이스와-bracket) 탭과, 이 옵션을 제공하는 [Code Generator](./code-generator.md#bracket) 대상의 `Bracket` | `None` |
| `Name View` | 다이어그램이 열리는 [이름 표시](./logical-names.md#name-view)(`Physical Names`, `Logical Names`, `Both Names` 중 하나) | `Physical Names` |

각 행에는 값과 잠금 버튼이 표시되며, 버튼을 클릭하면 그 행의 잠금 하나가 켜지거나 꺼집니다.
잠금이 켜져 있는 동안 버튼은 `Unlock Viewport`(다른 행도 같은 방식입니다) 툴팁과 함께 닫힌 자물쇠를 표시하며, `Locked value` 툴팁이 붙은 값은 파일이 유지하는 값입니다.
잠금이 꺼져 있는 동안 버튼은 `Lock Viewport` 툴팁과 함께 열린 자물쇠를 표시하며, `Current value` 툴팁이 붙은 흐린 값은 지금의 설정입니다.
`Viewport`는 `75% · -40, 91`처럼 확대/축소 다음에 화면 위치를 표시합니다. 화면 위치는 다이어그램의 `0, 0`이 놓인 화면상의 지점을 픽셀로 나타낸 것이며, 천 단위 이상인 좌표는 `1.2k`나 `-24k`처럼 줄여 표시됩니다.

잠그면 그 순간의 설정이 잠깁니다.
잠금이 켜져 있는 동안에도 설정은 화면에서 그대로 동작합니다. 스크롤하거나 확대/축소하고, 탭을 전환하고, 메뉴, 옵션 패널, 빠른 검색에서 다른 언어, 이름 케이스, 괄호를 고르고, 이름 표시의 어느 선택기에서든 이름 표시를 전환할 수 있습니다. [보기 전환](./logical-names.md#switching-the-view) 문서를 참고하세요.
하지만 파일은 잠긴 값을 유지하고 행에도 계속 그 값이 표시되므로, 다이어그램은 잠긴 화면과 잠긴 탭에서, 잠긴 이름 표시와 잠긴 언어, 이름 케이스, 괄호로 다시 열립니다. JSON으로 내보낼 때도 잠긴 값이 기록됩니다.
화면에 보이는 것을 저장하려면 잠금을 끄세요. 그때부터 파일이 설정을 따르므로, `Viewport`를 끄면 다이어그램은 마지막으로 보던 위치에서 열립니다. 대신 새 시작 화면처럼 새 값을 잠그려면 잠금을 껐다가 다시 켜세요.
파일을 열 때 잠긴 화면에 다이어그램이 전혀 보이지 않으면 그래도 화면은 다이어그램으로 이동하며, 잠긴 값은 그대로 유지됩니다.
`Canvas Type`은 설정 탭을 유지하지 않습니다. 잠금을 켜면 마지막으로 머물렀던 다른 탭이 잠기며, 꺼져 있는 동안에는 행에 그 탭이 표시됩니다.

![Viewport 잠금을 해제하고 다이어그램을 스크롤하고 확대/축소한 뒤, 행에 표시된 새 화면으로 다시 잠그는 모습](/img/demo-settings-locks.webp)

파일에는 어떤 잠금이 켜져 있는지가 저장되므로 잠금을 켜거나 끄면 파일이 바뀌지만, 설정 탭의 다른 항목과 마찬가지로 [Undo 히스토리](./undo-redo.md#히스토리에-기록되는-내용)에는 기록되지 않습니다. 잠겨 있든 아니든 이름 표시 전환도 마찬가지입니다. 읽기 전용 에디터에서는 잠금 버튼이 아무 동작도 하지 않으며, 이름 표시 전환은 잠금에 상관없이 그 화면만 바꿉니다.
그 밖의 설정은 모두 현재 상태 그대로 저장됩니다. 데이터베이스, [`View Option`](./table-related-functions.md#테이블-보기-옵션) 토글, `Preferences` 탭의 나머지 항목이 여기에 해당합니다.

새 다이어그램, 즉 아무것도 없는 상태에서 시작한 다이어그램에서는 모든 잠금이 켜져 있습니다. VS Code, Obsidian, JetBrains IDE에서 연 빈 파일(Obsidian의 `ERD Editor: Create new diagram`과 `New ERD`가 이런 파일을 만듭니다), 웹 앱의 새 스키마, Google Drive의 New 메뉴로 만든 파일, 값을 지정하지 않은 `<erd-editor>`가 여기에 해당합니다.
웹 앱이 SQL, DBML, AML, GraphQL 파일을 가져와 만드는 스키마나 Google Drive 파일도 모든 잠금이 켜진 상태로 시작합니다. JSON 파일로 만든 경우에는 그 파일에 기록된 잠금을 유지합니다.
여는 파일은 저장될 당시의 잠금을 각각의 잠긴 값과 함께 유지합니다.
잠금이 도입되기 전의 릴리스에서 저장했거나 직접 작성한 파일처럼 잠금이 기록되지 않은 파일은 모든 잠금이 켜진 상태로 열립니다. 저장된 화면과 탭에 상관없이 화면은 `100% · 0, 0`, 탭은 `ERD`로 잠기며, 언어, 이름 케이스, 괄호 타입, 이름 표시는 저장된 값으로 잠깁니다.
이름 표시 잠금이 도입되기 전의 릴리스에서 저장한 파일은, 기록된 다른 잠금이 모두 꺼져 있더라도 `Name View`가 잠긴 상태로 `Physical Names` 보기에서 열립니다.
다이어그램을 대체하는 `Import`도 잠금을 정합니다. JSON 파일은 파일에 기록된 잠금과 그 값을 가져오고, SQL, DBML, AML, GraphQL 파일은 기존 잠금을 유지하되 잠겨 있든 아니든 화면을 `100% · 0, 0`으로 되돌립니다. [외부 파일 가져오기](./file-import-export.md#외부-파일-가져오기) 문서를 참고하세요. 가져오기를 되돌리면 가져오기가 대체한 잠금과 잠긴 값이 돌아옵니다.

잠금 때문에 파일에 기록되지 않는 변경은 변경으로 간주되지 않습니다. VS Code는 탭을 수정됨으로 표시하지 않으며, Obsidian과 JetBrains IDE는 자동으로 저장할 때와 탭이 닫힐 때 모두 파일을 그대로 둡니다.
따라서 모든 잠금이 켜져 있으면 다이어그램을 둘러보거나, 탭을 전환하거나, 다른 언어, 이름 케이스, 괄호를 시험해 보거나, 이름 표시를 전환해도 `git diff`에 나타나지 않습니다.
`Viewport`가 꺼져 있으면 스크롤과 확대/축소가 파일을 바꾸고, `Canvas Type`이 꺼져 있으면 설정 탭으로의 전환을 포함해 탭 전환도 파일을 바꾸며, `Name View`가 꺼져 있으면 이름 표시 전환도 파일을 바꿉니다.
새 다이어그램의 빈 파일은 파일에 기록되는 첫 변경(편집, 잠금이 걸리지 않은 설정의 변경, 잠금 켜기나 끄기)이 있을 때까지 비어 있습니다.
이런 변경 없이 다이어그램을 열었다가 닫으면, 어느 릴리스나 컴퓨터에서 작성한 파일이든 그대로 유지됩니다. 파일에는 다이어그램의 내용만 고정된 순서로 담기며, 이전 형식으로 저장된 파일은 이런 변경이 처음 일어날 때 한 번 이 형식으로 다시 작성됩니다. [저장 형태와 런타임 값](../../api/advanced/schema.md#저장-형태와-런타임-값) 문서를 참고하세요.
VS Code에서 Git 리비전이나 Local History 항목처럼 `Reopen Editor With...`로 다이어그램으로 다시 연 리비전은 읽기 전용이며 수정됨으로 표시되지 않습니다.
Google Drive에서는 잠겨 있든 아니든 스크롤, 확대/축소, 다른 탭으로의 전환만으로는 저장되지 않습니다. `Viewport`가 꺼져 있으면 화면 상태는 다른 변경과 함께일 때만 기록되므로 Drive 파일은 마지막으로 저장했을 때의 화면 위치에서 열리며, `Canvas Type`이 꺼져 있을 때의 탭도 마찬가지입니다. `Name View`가 꺼져 있을 때의 이름 표시 전환은 편집과 마찬가지로 저장되며, 켜져 있을 때나 읽기 전용 에디터에서의 전환은 저장되지 않습니다.

[공동 편집](../../api/advanced/collaborative-editing.md) 세션에서는 잠금을 켜거나 끄면 모든 에디터에 전달되며, 잠금은 그 잠금을 켠 에디터의 값을 유지합니다.
`Language`, 이름 케이스, `Bracket Type`, `Name View`의 잠금을 끄면 잠금을 끈 에디터에 표시된 값이 모든 에디터에 적용되므로, 모든 에디터가 같은 값을 저장합니다. `Viewport`나 `Canvas Type`의 잠금을 꺼도 어느 에디터의 화면이나 탭도 바뀌지 않습니다.
잠금이 켜져 있는 동안 고른 언어, 이름 케이스, 괄호도 모든 에디터에 전달되지만, `Name View`가 켜져 있는 동안 이름 표시는 각 에디터만의 것입니다. 전환은 전환한 에디터에만 보이며, 잠금을 켜도 어느 에디터의 보기도 바뀌지 않습니다. 꺼져 있는 동안에는 읽기 전용이 아닌 어느 에디터에서 전환하든 모든 에디터가 전환됩니다.
MCP 서버로 작업하는 코딩 에이전트에는 잠금이나 잠금이 담는 설정을 다루는 도구가 없으며, 잠긴 언어, 이름 케이스, 괄호 타입은 파일이 유지하는 값으로 읽습니다. 이 값들에 닿는 것은 `Import`와 마찬가지로 `replace` 모드의 가져오기뿐입니다. [설정](../../mcp/tools.md#설정)과 [가져오기](../../mcp/tools.md#가져오기) 문서를 참고하세요. 에이전트의 `erd_list`와 `erd_read`의 `snapshot` 형식에서는 이름 표시가 생략되며, 에이전트는 사람이 어떤 보기로 보고 있든 논리명을 포함한 스키마를 편집합니다.

## 컬럼 순서 조정

테이블에 표출되는 컬럼 순서를 설정합니다.
행을 드래그해 이동하며, 행 전체를 드래그할 수 있고 그립 아이콘이 이를 나타냅니다. 기본 순서의 9개 행은 `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default`, `Comment`입니다.
`Logical Name`은 `Both Names` 보기에서 행에 그려지는 논리명 셀의 위치를 정합니다. `Logical Names` 보기에서는 대신 논리명이 `Name` 행의 자리에 놓이며, `Physical Names` 보기에서는 논리명 셀이 그려지지 않습니다. [이름 표시](./logical-names.md#name-view) 문서를 참고하세요. `Domain`은 View Option → `Domain`이 표시하는 도메인 셀의 위치를 정합니다. [도메인 셀](./logical-names.md#the-domain-cell) 문서를 참고하세요.
[테이블 보기 옵션](./table-related-functions.md#테이블-보기-옵션)으로 숨겨지거나 이름 표시에서 제외된 셀도 목록에서 자리를 유지하므로, 순서는 표출되는 셀에 적용됩니다.
`Logical Name`과 `Domain`이 행이 되기 전에 순서를 정한 다이어그램에서는, `Name`과 `DataType`이 순서의 어디에 있든 `Logical Name`이 `Name` 바로 앞에, `Domain`이 `DataType` 바로 뒤에 들어갑니다.
[대체 키](./table-related-functions.md#대체-키) 표시(`AK1.1` 등)는 이 목록의 행이 아닙니다. 표시는 항상 행의 맨 끝, 이 순서가 마지막에 두는 셀보다 뒤에 놓입니다.

![Column Order까지 스크롤한 뒤 Comment 행을 Name 아래로 드래그해 코멘트가 컬럼 이름 바로 뒤에 표출되는 모습](/img/demo-settings-column-order.webp)

## 단축키

`Shortcuts` 탭은 `Command`와 `Keybinding`으로 구성된 읽기 전용 표이며, 현재 사용 중인 플랫폼의 단축키를 보여 줍니다.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` 다음 `G` | `T` 다음 `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

대부분은 ERD 탭에서만 동작하며, 빠른 검색, 테이블 속성, Diff Viewer, 자동 배치 미리보기, Time Travel, [`Export image`](./file-import-export.md#이미지) 대화 상자, [`Map Columns`](./relationship-editing.md#컬럼-매핑)가 열려 있는 동안에는 동작하지 않습니다.
`Search`, `Toggle Explorer`, `Stop`은 예외입니다. `Search`는 어느 탭에서나 빠른 검색을 열고 닫고, `Toggle Explorer`는 어느 탭에서나 [탐색기](./explorer.md#열기와-닫기)를 검색 상태로 열면서 ERD 탭으로 전환하며, `Stop`은 빠른 검색, 테이블 속성, Diff Viewer, 자동 배치 미리보기, Time Travel, `Export image` 대화 상자, `Map Columns`, 테마 빌더, `Display Language` 선택기, 색상 선택기, `Name View` 버튼이 여는 목록, 열려 있는 컨텍스트 메뉴를 닫습니다.
탐색기가 ERD 탭에서 열려 있고 Zen 모드로 감춰져 있지 않은 동안에는 `Toggle Explorer`가 툴바의 `Explorer` 버튼처럼 탐색기를 다시 닫습니다. 빠른 검색, 테이블 속성, 테마 빌더, `Display Language` 선택기, `Export image` 대화 상자, `Map Columns`가 열려 있으면 탐색기 대신 그것을 닫고 키보드 포커스를 탐색기의 검색으로 옮깁니다.
셀이나 메모를 편집하거나 테이블 그룹의 이름을 편집하는 동안에는 `Toggle Explorer`가 아무 동작도 하지 않습니다. [사전](./dictionary.md) 탭의 셀을 편집하는 동안에는 `Toggle Explorer`와 `Search` 모두 아무 동작도 하지 않으므로, 그곳에 입력한 텍스트가 유지됩니다. Diff Viewer, 자동 배치 미리보기, Time Travel이 열려 있는 동안에는 `Toggle Explorer`가 키를 브라우저나 호스트에 넘깁니다. [브라우저의 찾기 막대](./find-and-replace.md#브라우저의-찾기-막대) 문서를 참고하세요.
ERD 탭에서 `Stop`은 열려 있는 셀이나 메모의 편집모드를 끝내거나, [테이블 그룹](./table-groups.md)의 이름 입력란을 그룹 이름을 바꾸지 않고 닫거나, 그리고 있는 관계나 `New Table Group`을 취소하며, 이때 선택은 그대로 둡니다. 그중 어느 것도 열려 있지 않으면 선택과 포커스된 셀을 해제하고, 같은 입력으로 열려 있는 색상 선택기도 닫습니다. 열려 있는 테마 빌더나 `Display Language` 선택기는 어느 경우든 같은 입력으로 닫힙니다.
용어 목록이 열려 있는 논리명 셀에서는 `Stop`을 처음 누르면 목록만 닫힙니다. [용어명 자동완성](./logical-names.md#completing-term-names) 문서를 참고하세요.
탐색기, 테마 빌더, `Display Language` 선택기가 열려 있어도 캔버스의 단축키는 모두 그대로 동작합니다. `Stop`은 탐색기를 닫지 않습니다. 탐색기 안에서 `Stop`과 다른 키가 하는 일은 [탐색기의 키](./explorer.md#탐색기의-키) 문서를, 선택기 안에서 누르는 키는 [언어 선택](./language-and-theme.md#언어-선택) 문서를 참고하세요.
`Delete Selection`은 선택된 테이블, 메모, 테이블 그룹을 모두 삭제하며, 일부 컬럼이 선택된 테이블 하나만 선택되어 있고 배율이 `70%`보다 크면 대신 그 컬럼을 삭제합니다. [테이블, 메모 삭제](./table-related-functions.md#테이블-메모-삭제) 문서를 참고하세요. `Remove Table, Memo`도 선택된 테이블 그룹을 함께 삭제합니다.
`Add Table Group`은 [캔버스 툴바](./table-related-functions.md#캔버스-툴바)의 `New Table Group` 버튼처럼 [`New Table Group`](./table-groups.md#그룹-그리기) 그리기를 시작하며, 한 번 더 누르면 그리기가 취소됩니다. `Group Selected Tables`는 보조 키 없이 두 번 누르는 단축키로, `T` 다음 `G`를 1초 안에 누릅니다. 테이블 컨텍스트 메뉴의 `Group selected tables`처럼 선택된 테이블을 새 그룹에 넣고 그 그룹의 이름 입력란을 열며, 선택된 테이블이 없으면 아무 동작도 하지 않습니다. [선택한 테이블 그룹화](./table-groups.md#선택한-테이블-그룹화) 문서를 참고하세요. 둘 다 읽기 전용 에디터에서나 그룹이 [숨겨진](./table-groups.md#그룹-숨기기) 동안에는 아무 동작도 하지 않습니다.
`Zoom In`, `Zoom Out`, `Zoom Reset`은 [Visualization](./visualization.md#툴바) 탭에서도 `Graph`와 `Flow` 모두 확대/축소하며, 빠른 검색이 열려 있을 때는 동작하지 않습니다.
`Flow`에서 `Undo`와 `Redo`는 `Previous table`과 `Next table` 버튼처럼 Flow가 좁혀 온 범위를 따라 한 단계 뒤로, 한 단계 앞으로 이동하며, 빠른 검색이 열려 있을 때는 동작하지 않습니다. 그곳에서는 다이어그램을 되돌리지 않으며, `Graph`에서는 아무 동작도 하지 않습니다. [이전 테이블과 다음 테이블](./visualization.md#previous-table-and-next-table) 문서를 참고하세요.
Visualization 탭에서 `Stop`은 [행 표시](./visualization.md#행-표시) 메뉴도 닫고 아직 진행 중인 [Flow 배치](./visualization.md#flow-배치-방식)를 취소하지만, `Focus on this table`로 좁힌 화면을 넓히지는 않습니다.
`Focus on this table`은 선택된 테이블과 그 테이블에 관계 하나로 이어진 모든 테이블로 범위를 좁혀 Visualization 탭을 `Flow`로 열며, 선택된 테이블이 없으면 아무 동작도 하지 않습니다. [테이블 포커스](./visualization.md#테이블-포커스) 문서를 참고하세요.
사전 탭에서 `Undo`와 `Redo`는 다이어그램의 히스토리 대신 표시된 시트의 히스토리에 적용되며, `Checks` 시트에서는 아무 동작도 하지 않습니다. [사전 시트](./undo-redo.md#dictionary-sheets) 문서를 참고하세요. `Domains`, `Words`, `Terms` 시트에서는 `Add Column`이 선택 아래에 행을 삽입하고, 그 키에 `Shift`를 더하면 위에 삽입하며, `Remove Column`은 선택 범위가 걸친 행을 삭제합니다. [행 추가와 삭제](./dictionary.md#adding-and-deleting-rows) 문서를 참고하세요. 이 탭의 다른 키는 [사전 탭의 키](./dictionary.md#keys-on-the-tab) 문서를 참고하세요.
`Select All Table, Memo`, `Hand Tool`, `Delete Selection`, `Group Selected Tables`는 커서에 양보합니다. 셀이나 메모를 편집하거나 탐색기의 Find 입력란 같은 텍스트 입력란에 입력하는 중에는 `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac)가 텍스트를 선택하고, `Space`는 공백을 입력하며, `Delete`와 `Backspace`는 텍스트를 지우고, `T` 다음 `G`는 두 글자를 그대로 입력합니다.
복사/붙여넣기는 브라우저 자체의 `Ctrl + C`와 `Ctrl + V` (Windows/Linux) or `⌘ + C`와 `⌘ + V` (Mac)를 사용하므로 이 목록에는 없습니다. [테이블 편집](./table-editing.md) 문서를 참고하세요.

이 탭에서는 단축키를 변경할 수 없습니다.
에디터를 임베드한 호스트는 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap)으로 단축키를 다시 지정할 수 있으며, `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, `Zoom Reset`은 고정되어 있습니다.
이때 `Shortcuts` 탭에는 호스트가 지정한 단축키가 표시됩니다. 호스트가 다시 지정하지 않은 명령은 기본 단축키를 유지하고, 호스트가 어떤 키에도 지정하지 않은 명령에는 단축키가 표시되지 않습니다.
사전 탭의 행 키는 `Add Column`과 `Remove Column`을 따르므로, 둘 중 하나를 다시 지정하면 행 키도 함께 바뀝니다. [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords) 문서를 참고하세요.

Obsidian에서는 다이어그램의 Obsidian 탭이 활성화되어 있으면 `Alt + Enter`, `Ctrl + K`, `Ctrl + F` (Windows/Linux) or `⌥ + Enter`, `⌘ + K`, `⌘ + F` (Mac)처럼 Obsidian 단축키가 같은 키를 쓰는 경우에도 위 표의 단축키가 에디터로 전달됩니다. 이 목록의 어느 행에도 없는 사전 탭의 `Alt + Shift + Enter` (Windows/Linux) or `⌥ + Shift + Enter` (Mac)도 마찬가지입니다. 그 밖의 Obsidian 단축키는 그 탭에서도 그대로 동작합니다. `Ctrl + F` 또는 `⌘ + F`에 대해서는 [브라우저의 찾기 막대](./find-and-replace.md#브라우저의-찾기-막대) 문서를 참고하세요.
