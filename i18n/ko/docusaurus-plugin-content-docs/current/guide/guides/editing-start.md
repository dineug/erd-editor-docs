---
sidebar_position: 1
description: 캔버스 컨텍스트 메뉴에서 테이블, 메모와 관계 생성.
---

# 편집 시작하기

편집은 마우스 오른쪽 클릭으로 컨텍스트 메뉴로 시작합니다.

<img src="/img/context-menu.png" width="400" alt="캔버스 컨텍스트 메뉴" loading="lazy" />

테이블이나 관계에서 마우스 오른쪽 클릭하면 해당 항목의 메뉴가 대신 열립니다.

## 테이블 생성

컨텍스트 메뉴 또는 단축키 `Alt + N`으로 생성 가능합니다.

## 메모 생성

컨텍스트 메뉴 또는 단축키 `Alt + M`으로 생성 가능합니다.

메모는 캔버스에 자유롭게 작성하는 노트입니다. 본문을 클릭해서 입력하면 텍스트가 문서와 함께 저장됩니다.  
테두리를 드래그해서 크기를 조절하고, 헤더의 `x`로 삭제합니다.

## 관계 생성

컨텍스트 메뉴, 왼쪽 위의 [캔버스 툴바](./table-related-functions.md#캔버스-툴바), 또는 단축키로 시작합니다. 관계 타입마다 단축키가 다릅니다.

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

관계 타입을 선택하면 커서가 바뀝니다. 부모 테이블을 먼저 클릭하고, 그다음 자식 테이블을 클릭합니다.  
부모 테이블에 primary key가 없으면 생성되고, 이름, 데이터 타입, 기본값, 코멘트가 같고 `Not Null`이 설정된 foreign key 컬럼이 자식 테이블에 생성됩니다.  
같은 테이블을 두 번 클릭하면 자기 참조 관계가 그려집니다.  
`Escape`를 누르거나 같은 단축키를 다시 누르면 취소됩니다.

![demo-relationship](/img/demo-relationship.webp)

## 테이블과 메모 복제

기존 테이블과 메모는 복사, 붙여넣기, `Alt` 드래그로 복제할 수 있습니다. [테이블 관련 기능](./table-related-functions.md#테이블-메모-복사붙여넣기) 문서를 참고하세요.
