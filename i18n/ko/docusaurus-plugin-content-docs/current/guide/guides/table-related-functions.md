---
sidebar_position: 4
description: 테이블 다중 선택과 이동, 확대/축소, 색상과 표출 옵션, 데이터베이스 선택, 문서 비교.
---

# 테이블 관련 기능

## 다중 선택

3가지 방법을 지원하고 있습니다.

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + Alt + A` (Windows/Linux) or `⌘ + Alt + A` (Mac)

![demo-table-select](/img/demo-table-select.webp)

## 여러 테이블 이동

mod 키를 누른 채 드래그합니다. `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)  
mod 키 없이 드래그하면 선택이 해제되고 드래그한 테이블만 이동합니다.

![demo-table-multiple-move](/img/demo-table-multiple-move.webp)

## 테이블, 메모 삭제

현재 선택된 테이블, 메모를 삭제합니다.  
단축키 `Ctrl + Backspace` (Windows/Linux) or `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` (Mac) or `⌘ + Delete` (Mac)

![demo-table-remove](/img/demo-table-remove.webp)

## 줌 확대/축소

mod 키를 누른 채 마우스 휠로 확대/축소합니다. `Ctrl + Wheel` (Windows/Linux) or `⌘ + Wheel` (Mac). 휠만 사용하면 캔버스가 스크롤됩니다.  
단축키 `Ctrl + Plus` (Windows/Linux) or `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) or `⌘ + Minus` (Mac)

![demo-zoom](/img/demo-zoom.webp)

## 테이블, 메모 컬러 지정

카테고리별로 구분하기 위해 컬러를 지정할 수 있습니다.

![demo-table-color](/img/demo-table-color.webp)

## 테이블 보기 옵션

다음의 보기 옵션을 제공합니다.

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Auto Increment
- Relationship

![demo-view-options](/img/demo-view-options.webp)

## 테이블 속성

선택한 테이블의 속성 패널을 엽니다.
테이블 컨텍스트 메뉴 또는 단축키 `Alt + Space`로 시작합니다.
Indexes, Schema SQL, Code Generator 3개의 탭을 제공합니다.
인덱스는 여기서 정의하며 내보내는 Schema SQL에 포함됩니다.

## 테이블 위치 자동 정렬

Force Simulation으로 동작합니다.  
외부 Schema SQL을 가져와 테이블 위치의 시작 지점으로 활용할 수 있습니다.

![demo-automatic-table-placement](/img/demo-automatic-table-placement.webp)

## 데이터베이스

지원하는 데이터베이스는 다음과 같습니다.

- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- SQLite

해당 옵션은 내보내기 Schema SQL 문법과 DataType 자동완성을 결정합니다.

<img src="/img/database-menu.png" width="400" alt="데이터베이스 선택 메뉴" loading="lazy" />

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Diff Viewer

이전에 저장했던 문서와 현재 문서를 비교할 수 있습니다.

<img src="/img/context-menu-diff-viewer.png" width="400" alt="Diff Viewer 컨텍스트 메뉴" loading="lazy" />

![diff-viewer](/img/diff-viewer.png)
