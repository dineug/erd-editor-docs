---
sidebar_position: 3
description: 컬럼 추가와 다중 선택, 순서 변경, 삭제, 컬럼 옵션 토글과 복사/붙여넣기.
---

# 테이블 편집

기본적으로 엑셀과 유사한 편집 경험을 제공합니다.  
편집모드는 `Enter` 또는 셀 더블 클릭으로 시작합니다.

![demo-table-edit](/img/demo-table-edit.webp)

## Column 추가

단축키 `Alt + Enter` (Windows/Linux) or `⌥ + Enter` (Mac)로 생성합니다.  
선택된 모든 테이블에 컬럼이 추가됩니다.

## Tab 키

`Tab`으로 바로 다음 셀 편집모드로 들어갈 수 있습니다.  
마지막 셀에서 `Tab`을 누르면 새로운 컬럼을 생성합니다.  
`Shift + Tab`으로 이전 셀 편집모드로 이동합니다.

![demo-table-tab](/img/demo-table-tab.webp)

## DataType 자동완성

`DataType` 셀을 편집모드로 열고 입력하면 선택된 데이터베이스의 일치하는 타입을 제안하며, 제안 항목에서 입력한 문자열이 그대로 포함된 부분을 강조합니다.  
매칭은 fuzzy 방식이라 `vch`로도 `VARCHAR`를 찾습니다.

- `Arrow Up` or `Arrow Down`: 제안 목록 이동
- `Arrow Right`, `Tab` or `Enter`: 강조된 제안 적용
- `Arrow Left`: 입력한 문자열로 되돌아가기

제안 항목을 클릭해도 됩니다.  
강제되지 않으므로 목록에 없는 타입도 `VARCHAR(255)`처럼 인자를 포함해 자유롭게 입력할 수 있습니다.  
제안 목록은 선택된 데이터베이스를 따릅니다. 데이터베이스를 변경하면 제안 항목이 바뀌고 기존 컬럼은 그대로 유지됩니다.

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

이 3개의 셀은 텍스트가 아니라 토글입니다.  
더블 클릭하거나 포커스된 상태에서 `Enter`를 누르면 값이 전환됩니다.

Not Null 셀은 설정되면 `N-N`, 해제되면 `NULL`로 표시됩니다.  
`UQ`와 `AI`는 꺼져 있으면 흐리게, 켜져 있으면 강조되어 표시됩니다.

[테이블 보기 옵션](./table-related-functions.md)으로 숨겨진 셀은 토글할 수 없습니다.

## Column 다중 선택

5가지 방법을 지원하고 있습니다.

- `Shift + Arrow Up/Down`: 한 행씩 선택 확장
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac): 단일 컬럼 추가
- `Shift + click`: 마지막으로 포커스된 컬럼부터 범위 선택
- `Ctrl + Shift + click` (Windows/Linux) or `⌘ + Shift + click` (Mac): 해당 범위를 선택에 추가
- `Alt + A` (Windows/Linux) or `⌥ + A` (Mac): 전체 선택

![demo-column-select](/img/demo-column-select.webp)

## Column 순서 변경 및 이동

드래그할 때 동작하며 다른 테이블로 이동할 수 있습니다.

![demo-column-move](/img/demo-column-move.webp)

`Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)로 다중 컬럼 이동도 지원합니다.

![demo-column-multi-move](/img/demo-column-multi-move.webp)

## Column 삭제

현재 선택된 컬럼을 삭제합니다.  
단축키 `Alt + Backspace` or `Alt + Delete` (Windows/Linux), `⌥ + ⌫` or `⌥ + Delete` (Mac)

![demo-column-remove](/img/demo-column-remove.webp)

## Column 복사/붙여넣기

테이블 형식의 클립보드로 동작합니다.  
단축키 `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

에디터에서 엑셀로, 엑셀에서 다시 에디터로 붙여넣기 가능합니다.  
아래 컬럼은 다음 값 중 어느 것이든 true로 읽습니다(대소문자 구분하지 않음).

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

반대로 에디터에서 복사할 때는 AutoIncrement와 Unique는 `TRUE` 또는 `FALSE`로, Not Null은 `NOT NULL` 또는 `NULL`로 기록합니다.

![demo-copy-column-to-sheet](/img/demo-copy-column-to-sheet.webp)
![demo-copy-sheet-column](/img/demo-copy-sheet-column.webp)

테이블 다중 선택 시 동작도 지원합니다.

![demo-copy-column-multi](/img/demo-copy-column-multi.webp)

## 테이블과 메모 복사/붙여넣기

포커스된 테이블 안에서 선택된 컬럼이 없으면 같은 단축키로 선택된 테이블과 메모 자체를 복사합니다. [테이블 관련 기능](./table-related-functions.md) 문서를 참고하세요.

## Column Primary Key

포커스된 셀이 속한 컬럼의 primary key를 전환하며, 선택된 컬럼 전체가 대상이 아닙니다.  
테이블 컨텍스트 메뉴 또는 단축키 `Alt + K` (Windows/Linux) or `⌥ + K` (Mac)로 가능합니다.  
행에 표시되는 키 아이콘은 표시 전용이라 클릭해도 primary key가 설정되지 않습니다.

![demo-column-pk](/img/demo-column-pk.webp)
