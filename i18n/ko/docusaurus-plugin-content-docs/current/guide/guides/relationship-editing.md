---
sidebar_position: 5
description: 관계 삭제, 관계 타입 변경, 연결선 읽기, N:M 관계와 식별 관계.
---

# 관계 편집

관계는 캔버스 컨텍스트 메뉴 또는 단축키로 생성합니다. [편집 시작하기](./editing-start.md) 문서를 참고하세요.  
이 문서는 생성된 관계로 할 수 있는 작업을 다룹니다.

## 삭제

관계 컨텍스트 메뉴를 통해 삭제 가능합니다.

![관계 컨텍스트 메뉴에서 products와 reviews 사이의 관계 삭제](/img/demo-relationship-remove.webp)

관계는 테이블이나 메모처럼 선택되지 않기 때문에 단축키가 없습니다.  
또한 관계는 연결된 대상과 함께 삭제됩니다. 테이블을 삭제하면 그 테이블에 연결된 모든 관계가 삭제되고, 컬럼을 삭제하면 그 컬럼을 사용하는 모든 관계가 삭제됩니다.

## 타입 변경

관계 컨텍스트 메뉴를 통해 변경 가능합니다.  
4가지 타입을 제공하며, 현재 타입에는 체크 표시가 됩니다.

- Zero One
- Zero N
- One Only
- One N

![관계 컨텍스트 메뉴에서 타입을 Zero N에서 One Only, One N으로 차례로 변경](/img/demo-relationship-type.webp)

관계를 생성할 때 선택하는 4가지 타입과 같으며, 타입마다 단축키가 다릅니다. [편집 시작하기](./editing-start.md) 문서를 참고하세요.

## N:M 관계

물리 기반이기 때문에 N:M 관계는 아래와 같이 매핑 테이블로 표현합니다.

![products와 tags에서 매핑 테이블 product_tags로 각각 관계 생성](/img/demo-relationship-n-m.webp)

GraphQL, DBML, AML을 가져오면 매핑 테이블이 자동으로 생성됩니다.  
다대다 선언은 `<left>_<right>` 이름의 테이블로 만들어지고, `Junction table inferred from <left> <-> <right>` 코멘트가 붙으며, 양쪽과 식별 관계로 연결됩니다.  
[파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요.

## 식별 관계

관계를 생성하면 부모 테이블의 primary key가 각각 자식 테이블에 `NOT NULL` foreign key 컬럼으로 복사되므로, 새로 만든 관계는 비식별 관계로 시작합니다.  
식별 관계로 만들려면 자식 테이블의 해당 foreign key 컬럼을 `Alt + K` 또는 테이블 컨텍스트 메뉴의 `Primary Key`로 primary key로 지정합니다.

![Alt + K로 product_id를 primary key로 지정했다가 해제하며 연결선이 실선과 점선으로 바뀌는 모습](/img/demo-identifying-relationship.webp)

에디터가 이 상태를 자동으로 유지합니다.  
자식 쪽의 모든 컬럼이 primary key인 동안에는 식별 관계이며, 그중 하나라도 primary key가 아니게 되면 비식별 관계가 됩니다.

## 연결선 읽기

- 식별 관계는 실선으로, 비식별 관계는 점선으로 그려집니다.
- 자식 쪽 끝에는 관계 타입의 카디널리티 기호가 표시됩니다. Zero One은 고리와 막대, Zero N은 고리와 까마귀 발, One Only는 막대 2개, One N은 막대와 까마귀 발입니다.
- 부모 쪽 끝은 foreign key 컬럼 중 하나라도 `NULL`을 허용하면 Zero One과 같은 고리와 막대로, 모두 `NOT NULL`이면 One Only와 같은 막대 2개로 표시됩니다.
- 연결선에 마우스를 올리면 연결선과 양쪽 테이블에서 연결된 컬럼이 함께 강조됩니다.

![연결선 3개에 차례로 마우스를 올려 연결된 컬럼과 함께 강조되는 모습](/img/demo-relationship-hover.webp)

`Relationship` 보기 옵션으로 ERD 캔버스의 연결선을 숨길 수 있습니다. [테이블 관련 기능](./table-related-functions.md) 문서를 참고하세요.  
Visualization 탭의 [Flow 모드](./visualization.md#flow-모드)는 이 옵션이 꺼져 있어도 연결선을 그리며, 각 연결선을 끝 기호가 같은 매끄러운 회색 실선 곡선 하나로 표시합니다. 따라서 이 문서에서 설명하는 점선과 연결선 경로는 ERD 캔버스에만 적용됩니다.

## 연결선 경로

연결선은 직각으로 배치됩니다.  
경로는 양 끝 사이에 있는 테이블을 가로지르지 않고 우회하며, 모서리는 45도로 깎입니다.  
테이블의 같은 면에서 나가는 경로는 서로 겹치지 않도록 각각 다른 통로로 분리됩니다.

설정할 항목은 없습니다.  
캔버스에서 무언가 이동하거나 크기가 바뀔 때마다 경로가 자동으로 다시 계산되므로, 직접 손댈 필요가 없습니다.

![members 테이블을 아래로 드래그했다가 되돌리는 동안 categories를 우회하도록 다시 계산되는 연결선 경로](/img/demo-connector-routing.webp)
