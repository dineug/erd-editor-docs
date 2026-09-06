---
sidebar_position: 10
description: 관계 데이터 타입 동기화, 화면 위치와 확대/축소 정보 저장, 코멘트 최대 너비, 테이블 너비 재계산, 컬럼 순서와 단축키 목록.
---

# 설정

툴바의 Settings 버튼으로 열거나, [빠른 검색](./quick-search.md)의 `Tab`에서 열 수 있습니다.
설정 화면은 `Preferences`와 `Shortcuts` 2개의 탭으로 구성되며, `Preferences`가 먼저 열립니다.

테마 색상은 이 화면에 없습니다.
테마 색상은 테마 빌더에서 다루며, 툴바의 `Theme` 버튼으로 열리고 호스트가 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder)로 켠 경우에만 표시됩니다.

## 관계 데이터 타입 동기화

데이터 타입 동기화 여부를 결정합니다. 기본적으로 켜져 있습니다.
컬럼의 데이터 타입을 변경하면 관계로 연결된 모든 컬럼에 같은 타입이 적용되며, 양쪽 끝에서 연결을 따라가므로 foreign key가 참조하는 키와 달라지지 않습니다.

<img src="/img/settings-relationship-data-type-sync.png" width="400" alt="관계 데이터 타입 동기화 설정" loading="lazy" />

![demo-relationship-data-type-sync](/img/demo-relationship-data-type-sync.webp)

## 스크롤 정보 저장

화면 위치를 문서에 저장할지 결정합니다. 기본적으로 켜져 있습니다.
끄면 화면 위치가 초기화된 상태로 문서가 저장되어, 마지막으로 보던 위치가 아니라 다이어그램이 보이는 위치에서 열립니다.

## 확대/축소 정보 저장

확대/축소 레벨을 문서에 저장할지 결정합니다. 기본적으로 켜져 있습니다.
끄면 `100%`로 문서가 저장되어, 확대/축소가 적용되지 않은 상태로 열립니다.

## 코멘트 최대 너비

코멘트 컬럼의 최대 너비를 픽셀 단위로 지정합니다 (`60` ~ `200`).
스위치를 끄면 제한이 없어지고, 꺼져 있는 동안에는 입력이 비활성화됩니다.
다시 켜면 `60px`부터 시작합니다. 범위를 벗어난 값을 입력하면 가장 가까운 끝값으로 맞춰집니다.

<img src="/img/settings-comment-width.png" width="400" alt="코멘트 최대 너비 설정" loading="lazy" />
<img src="/img/settings-comment-width-2.png" width="400" alt="다이어그램에 적용된 코멘트 최대 너비" loading="lazy" />

## 테이블 너비 재계산

`Sync`를 누르면 모든 테이블과 컬럼 셀의 너비를 현재 텍스트에 맞게 다시 계산하고, 새로운 크기에 맞춰 관계 연결선을 다시 그립니다.
완료되면 `Recalculated table width` 토스트로 알려줍니다.
문서를 불러올 때마다 너비는 자동으로 다시 계산되므로, 폰트나 렌더링이 바뀌어 너비가 어긋난 경우에만 필요합니다.

## 컬럼 순서 조정

테이블에 표출되는 컬럼 순서를 설정합니다.
행을 드래그해 이동하며, 행 전체를 드래그할 수 있고 그립 아이콘으로 표시됩니다. 기본 순서의 7개 행은 `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default`, `Comment`입니다.
[테이블 보기 옵션](./table-related-functions.md#테이블-보기-옵션)으로 숨겨진 셀도 목록에서 자리를 유지하므로, 순서는 표출되는 셀에 적용됩니다.

![demo-settings-column-order](/img/demo-settings-column-order.webp)

## 단축키

`Shortcuts` 탭은 `Command`와 `Keybinding`으로 구성된 읽기 전용 표이며, 현재 사용 중인 플랫폼의 단축키를 보여줍니다.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
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
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + O` | `⌘ + O` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

대부분은 ERD 탭에서만 동작하며, 빠른 검색, 테이블 속성, Diff Viewer, 테이블 위치 자동 정렬, Time Travel이 열려 있는 동안에는 동작하지 않습니다.
`Search`와 `Stop`은 예외입니다. `Search`는 어느 탭에서나 빠른 검색을 열고 닫으며, `Stop`은 빠른 검색, 테이블 속성, Diff Viewer, 테이블 위치 자동 정렬, Time Travel, 테마 빌더를 닫습니다.
`Select All Table, Memo`와 `Hand Tool`은 커서에 양보합니다. 셀을 편집하는 중에는 `Ctrl + A`가 텍스트를 선택하고 `Space`는 공백을 입력합니다.
복사/붙여넣기는 브라우저 자체의 `Ctrl + C`와 `Ctrl + V` (Windows/Linux) or `⌘ + C`와 `⌘ + V` (Mac)를 사용하므로 이 목록에는 없습니다. [테이블 편집](./table-editing.md) 문서를 참고하세요.

이 탭에서는 단축키를 변경할 수 없습니다.
에디터를 임베드한 호스트는 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap)으로 단축키를 다시 지정할 수 있으며, `Editing`, `Stop`, `Search`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, `Zoom Reset`은 고정되어 있습니다.
