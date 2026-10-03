---
sidebar_position: 11
description: 관계 데이터 타입 동기화, 화면 위치와 확대/축소 정보 저장, 코멘트 최대 너비, 테이블 너비 재계산, 컬럼 순서와 단축키 목록.
---

# 설정

툴바의 `Settings` 버튼으로 열거나, [빠른 검색](./quick-search.md)의 `Tab`에서 열 수 있습니다.
설정 화면은 `Preferences`와 `Shortcuts` 2개의 탭으로 구성되며, `Preferences`가 먼저 열립니다.

테마 색상은 이 화면에 없습니다.
테마 색상은 테마 빌더에서 다루며, 툴바의 `Theme` 버튼으로 열리고 호스트가 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder)로 켠 경우에만 표시됩니다.

VS Code, Obsidian, JetBrains IDE에서는 빌더의 세 가지 값(appearance, gray color, accent color)이 호스트의 설정이기도 하며, 빌더에서 고른 값이 그 설정에 저장됩니다.
VS Code는 이 값들을 `dineug.erd-editor.theme.appearance`, `dineug.erd-editor.theme.grayColor`, `dineug.erd-editor.theme.accentColor`로 저장하며, 기본 appearance는 `dark`입니다.
Obsidian은 Settings → ERD Editor에 볼트별로 저장하고, JetBrains IDE는 Settings | Tools | ERD Editor에 IDE 전체 설정으로 저장합니다. 둘 다 기본값은 `Auto`이며, 호스트의 라이트 또는 다크 테마를 따르고 테마가 바뀌면 함께 전환됩니다.
빌더 자체에서는 `Light`와 `Dark`만 고를 수 있습니다.
Obsidian과 JetBrains IDE에서는 현재 화면에 보이는 것과 다른 appearance를 고르지 않는 한 `Auto`가 그대로 유지됩니다.
VS Code에서는 무엇을 고르든 세 값을 모두 저장하므로, appearance가 `auto`인 동안에는 색상 하나만 골라도 `light` 또는 `dark`로 바뀝니다.

## 관계 데이터 타입 동기화

데이터 타입 동기화 여부를 결정합니다. 기본적으로 켜져 있습니다.
컬럼의 데이터 타입을 변경하면 관계로 연결된 모든 컬럼에 같은 타입이 적용되며, 양쪽 끝에서 연결을 따라가므로 foreign key가 참조하는 키와 달라지지 않습니다.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="관계 데이터 타입 동기화 설정" loading="lazy" />

![members.id를 BIGINT UNSIGNED로 변경하면 관계로 연결된 모든 member_id도 함께 바뀌는 모습](/img/demo-relationship-data-type-sync.webp)

## 스크롤 정보 저장

화면 위치를 문서에 저장할지 결정합니다. 이 스위치 자체도 문서에 저장됩니다. 새 다이어그램은 이 스위치가 꺼진 상태로 시작하며, 여는 파일은 저장될 당시의 설정을 유지합니다.
끄면 화면 위치가 초기화된 상태로 문서가 저장되므로, 마지막으로 보던 위치가 아니라 다이어그램이 보이는 위치에서 열리고, 스크롤해도 파일은 바뀌지 않습니다.

새 다이어그램은 아무것도 없는 상태에서 시작한 다이어그램입니다. VS Code, Obsidian, JetBrains IDE에서 연 빈 파일(Obsidian의 `ERD Editor: Create new diagram`과 `New ERD`가 이런 파일을 만듭니다), 웹 앱의 새 스키마, Google Drive의 New 메뉴로 만든 파일, 값을 지정하지 않은 `<erd-editor>`가 여기에 해당합니다. 새 다이어그램에서는 `Save Zoom Information`도 꺼진 상태로 시작합니다.
웹 앱이 SQL, DBML, AML, GraphQL 파일을 가져와 만드는 스키마나 Google Drive 파일도 두 스위치가 모두 꺼진 상태로 시작합니다. JSON 파일로 만든 경우에는 그 파일의 스위치 값을 유지합니다.
초기 릴리스에서 저장했거나 직접 작성한 파일처럼 이 스위치가 기록되지 않은 파일은 두 스위치가 모두 켜진 상태로 열립니다.

## 확대/축소 정보 저장

확대/축소 레벨을 문서에 저장할지 결정합니다. `Save Scroll Information`과 마찬가지로 새 다이어그램에서는 꺼진 상태로 시작하며, 여는 파일은 저장될 당시의 설정을 유지합니다.
끄면 `100%`로 문서가 저장되어, 확대/축소가 적용되지 않은 상태로 열립니다.
확대/축소는 그 중심이 되는 지점이 제자리에 머물도록 화면 위치도 함께 이동시킵니다. 따라서 이 스위치만 끄면 확대/축소는 화면 위치를 통해 여전히 파일을 바꿉니다. 두 스위치를 모두 꺼야만 파일이 그대로 유지됩니다.

문서에 저장되지 않는 스크롤이나 확대/축소는 변경으로 간주되지 않습니다. VS Code는 탭을 수정됨으로 표시하지 않으며, Obsidian과 JetBrains IDE는 자동으로 저장할 때와 탭이 닫힐 때 모두 파일을 그대로 둡니다.
따라서 두 스위치를 모두 끄면 다이어그램을 둘러보기만 한 것은 `git diff`에 나타나지 않으며, 다른 릴리스나 다른 컴퓨터에서 작성되어 저장하면 바이트가 바뀌는 파일에서도 마찬가지입니다.
에디터의 어느 탭이 열려 있는지는 어느 스위치에도 해당하지 않습니다. 문서에는 ERD, Visualization, Schema SQL, Code Generator, 설정 탭 중 어느 탭에서 마지막으로 머물렀는지가 기록되므로, VS Code, Obsidian, JetBrains IDE에서는 이 탭 사이를 전환하면 여전히 파일이 바뀝니다.
새 다이어그램의 빈 파일은 첫 편집이나, 이 탭 중 다른 탭으로의 첫 전환이 있을 때까지 비어 있습니다.
git 리비전이나 병합 미리보기처럼 VS Code가 읽기 전용으로 여는 다이어그램은 수정됨으로 표시되지 않습니다.
Google Drive에서는 스위치 설정과 상관없이 스크롤, 확대/축소, 다른 탭으로의 전환만으로는 저장되지 않습니다. 화면 상태는 다른 변경과 함께일 때만 기록되므로, `Save Scroll Information`이 켜져 있으면 Drive 파일은 마지막으로 저장했을 때의 화면 위치에서 열립니다.

## 코멘트 최대 너비

코멘트 컬럼의 최대 너비를 픽셀 단위로 지정합니다 (`60` ~ `200`).
스위치를 끄면 제한이 없어지고, 꺼져 있는 동안에는 입력이 비활성화됩니다.
다시 켜면 `60px`부터 시작합니다. 범위를 벗어난 값을 입력하면 가장 가까운 끝값으로 맞춰집니다.

![코멘트 최대 너비를 켜고 120을 입력한 뒤 ERD 탭에서 그 너비로 잘린 코멘트](/img/demo-settings-comment-width.webp)

## 테이블 너비 재계산

`Sync`를 누르면 모든 테이블과 컬럼 셀의 너비를 현재 텍스트에 맞게 다시 계산하고, 새로운 크기에 맞춰 관계 연결선을 다시 그립니다.
완료되면 `Recalculated table width` 토스트로 알려줍니다.
문서를 불러올 때마다 너비는 자동으로 다시 계산되므로, 폰트나 렌더링이 바뀌어 너비가 어긋난 경우에만 필요합니다.

## 컬럼 순서 조정

테이블에 표출되는 컬럼 순서를 설정합니다.
행을 드래그해 이동하며, 행 전체를 드래그할 수 있고 그립 아이콘으로 표시됩니다. 기본 순서의 7개 행은 `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default`, `Comment`입니다.
[테이블 보기 옵션](./table-related-functions.md#테이블-보기-옵션)으로 숨겨진 셀도 목록에서 자리를 유지하므로, 순서는 표출되는 셀에 적용됩니다.
[대체 키](./table-related-functions.md#대체-키) 표시(`AK1.1` 등)는 이 목록의 행이 아닙니다. 표시는 항상 행의 맨 끝, 이 순서가 마지막에 두는 셀보다 뒤에 놓입니다.

![Comment 행을 Name 아래로 드래그해 코멘트가 컬럼 이름 바로 뒤에 표출되는 모습](/img/demo-settings-column-order.webp)

## 단축키

`Shortcuts` 탭은 `Command`와 `Keybinding`으로 구성된 읽기 전용 표이며, 현재 사용 중인 플랫폼의 단축키를 보여줍니다.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Find and Replace](./find-and-replace.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
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

대부분은 ERD 탭에서만 동작하며, 빠른 검색, 테이블 속성, Diff Viewer, 자동 배치 미리보기, Time Travel이 열려 있는 동안에는 동작하지 않습니다.
`Search`, `Find and Replace`, `Stop`은 예외입니다. `Search`는 어느 탭에서나 빠른 검색을 열고 닫고, `Find and Replace`는 어느 탭에서나 [찾기와 바꾸기 패널](./find-and-replace.md#열기와-닫기)을 열면서 ERD 탭으로 전환하며, `Stop`은 빠른 검색, 테이블 속성, Diff Viewer, 자동 배치 미리보기, Time Travel, 테마 빌더, 찾기와 바꾸기 패널을 닫습니다.
Diff Viewer, 자동 배치 미리보기, Time Travel이 열려 있는 동안에는 `Find and Replace`가 키를 브라우저나 호스트에 넘깁니다. [브라우저의 찾기 막대](./find-and-replace.md#브라우저의-찾기-막대) 문서를 참고하세요.
ERD 탭에서 `Stop`은 열려 있는 셀이나 메모의 편집모드를 끝내거나 그리고 있는 관계를 취소하며, 이때 선택은 그대로 둡니다. 그중 어느 것도 열려 있지 않으면 선택과 포커스된 셀을 해제하고, 같은 입력으로 열려 있는 찾기와 바꾸기 패널도 닫습니다.
찾기와 바꾸기 패널이 열려 있어도 캔버스의 단축키는 모두 그대로 동작합니다. 패널 안에서 누르는 키는 [패널의 키](./find-and-replace.md#패널의-키) 문서를 참고하세요.
`Zoom In`, `Zoom Out`, `Zoom Reset`은 [Visualization](./visualization.md#툴바) 탭에서도 `Graph`와 `Flow` 모두 확대/축소하며, 빠른 검색이 열려 있을 때는 동작하지 않습니다.
Visualization 탭에서 `Stop`은 [행 표시](./visualization.md#행-표시) 메뉴도 닫고 아직 진행 중인 [Flow 배치](./visualization.md#flow-배치-방식)를 취소하지만, `Focus on this table`로 좁힌 화면을 넓히지는 않습니다.
`Focus on this table`은 선택된 테이블과 그 테이블에 관계 하나로 이어진 모든 테이블로 범위를 좁혀 Visualization 탭을 `Flow`로 열며, 선택된 테이블이 없으면 아무 동작도 하지 않습니다. [테이블 포커스](./visualization.md#테이블-포커스) 문서를 참고하세요.
`Select All Table, Memo`와 `Hand Tool`은 커서에 양보합니다. 셀을 편집하거나 찾기와 바꾸기 패널에 입력하는 중에는 `Ctrl + A` (Windows/Linux) or `⌘ + A` (Mac)가 텍스트를 선택하고 `Space`는 공백을 입력합니다.
복사/붙여넣기는 브라우저 자체의 `Ctrl + C`와 `Ctrl + V` (Windows/Linux) or `⌘ + C`와 `⌘ + V` (Mac)를 사용하므로 이 목록에는 없습니다. [테이블 편집](./table-editing.md) 문서를 참고하세요.

이 탭에서는 단축키를 변경할 수 없습니다.
에디터를 임베드한 호스트는 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap)으로 단축키를 다시 지정할 수 있으며, `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, `Zoom Reset`은 고정되어 있습니다.
이때 `Shortcuts` 탭에는 호스트가 지정한 단축키가 표시됩니다. 호스트가 다시 지정하지 않은 명령은 기본 단축키를 유지하고, 호스트가 어떤 키에도 지정하지 않은 명령에는 단축키가 표시되지 않습니다.

Obsidian에서는 다이어그램의 Obsidian 탭이 활성화되어 있으면 `Alt + Enter`, `Ctrl + K`, `Ctrl + F` (Windows/Linux) or `⌥ + Enter`, `⌘ + K`, `⌘ + F` (Mac)처럼 Obsidian 단축키가 같은 키를 쓰는 경우에도 위 표의 단축키가 에디터로 전달됩니다. 그 밖의 Obsidian 단축키는 그 탭에서도 그대로 동작합니다. `Ctrl + F` 또는 `⌘ + F`에 대해서는 [브라우저의 찾기 막대](./find-and-replace.md#브라우저의-찾기-막대) 문서를 참고하세요.
