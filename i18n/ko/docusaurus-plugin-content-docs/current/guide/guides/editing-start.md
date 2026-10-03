---
sidebar_position: 1
description: 캔버스 컨텍스트 메뉴에서 테이블, 메모와 관계 생성.
---

# 편집 시작하기

편집은 마우스 오른쪽 클릭으로 컨텍스트 메뉴로 시작합니다.

![캔버스를 마우스 오른쪽 클릭해 Relationship 하위 메뉴를 살펴보고, 테이블을 추가한 뒤 테이블 메뉴 열기](/img/demo-context-menu.webp)

테이블이나 관계에서 마우스 오른쪽 클릭하면 해당 항목의 메뉴가 대신 열립니다.

## 테이블 생성

컨텍스트 메뉴 또는 단축키 `Alt + N`으로 생성 가능합니다.

## 메모 생성

컨텍스트 메뉴 또는 단축키 `Alt + M`으로 생성 가능합니다.

메모는 캔버스에 자유롭게 작성하는 노트입니다. 본문을 클릭해서 입력하면 텍스트가 문서와 함께 저장됩니다.  
`Escape`는 입력한 내용을 유지한 채 메모 편집모드를 끝내고 메모를 선택된 상태로 두며, `Escape`를 한 번 더 누르면 선택이 해제됩니다.  
테두리를 드래그해서 크기를 조절하고, 헤더의 `x`로 삭제합니다.

![Alt + M으로 메모를 추가하고 내용을 입력한 뒤 테두리를 드래그해 크기 조절](/img/demo-memo.webp)

## 관계 생성

컨텍스트 메뉴, 캔버스 아래쪽의 [캔버스 툴바](./table-related-functions.md#캔버스-툴바), 또는 단축키로 시작합니다. 관계 타입마다 단축키가 다릅니다.

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

관계 타입을 선택하면 커서가 바뀝니다. 부모 테이블을 먼저 클릭하고, 그다음 자식 테이블을 클릭합니다.  
부모 테이블에 primary key가 없으면 생성되고, 부모 테이블의 primary key 컬럼마다 데이터 타입, 기본값, 코멘트가 같고 `Not Null`이 설정된 foreign key 컬럼이 자식 테이블에 생성됩니다.  
각 컬럼의 이름은 해당 키의 이름을 따릅니다. `id`처럼 한 단어로 된 이름은 앞에 부모 테이블 이름이 붙고(`user_id`), `member_id`처럼 여러 단어로 된 이름은 그대로 유지되며, 자식 테이블에 이미 있는 이름에는 번호가 붙습니다(`user_id_2`). [Foreign Key 컬럼 이름](./relationship-editing.md#foreign-key-컬럼-이름) 문서를 참고하세요.  
같은 테이블을 두 번 클릭하면 자기 참조 관계가 그려집니다.  
새 관계는 `On Delete`와 `On Update`가 모두 `Not set`인 상태로 시작하며, 관계 컨텍스트 메뉴에서 변경합니다. [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.  
`Escape`를 누르거나 같은 단축키를 다시 누르면 취소됩니다. 취소해도 선택은 그대로 유지되며, 다음 `Escape`가 선택을 해제합니다.

![⌘ + ⌥ + 4로 One N 관계를, 캔버스 툴바에서 Zero N 관계를 그리기](/img/demo-relationship.webp)

## 테이블과 메모 복제

기존 테이블과 메모는 복사, 붙여넣기, `Alt` 드래그로 복제할 수 있습니다. [테이블 관련 기능](./table-related-functions.md#테이블-메모-복사붙여넣기) 문서를 참고하세요.
