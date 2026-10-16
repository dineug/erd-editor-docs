---
sidebar_position: 1
description: 시작 화면에서 편집 시작, 캔버스 컨텍스트 메뉴, 캔버스 툴바, 단축키로 테이블, 메모, 테이블 그룹과 관계 생성.
---

# 편집 시작하기

편집은 마우스 오른쪽 클릭으로 컨텍스트 메뉴로 시작합니다.

![캔버스를 마우스 오른쪽 클릭해 Relationship 하위 메뉴를 살펴보고, 테이블을 추가한 뒤 테이블 메뉴 열기](/img/demo-context-menu.webp)

테이블, 메모, 테이블 그룹이나 관계에서 마우스 오른쪽 클릭하면 해당 항목의 메뉴가 대신 열립니다.  
이미 선택된 테이블, 메모, 테이블 그룹에서 마우스 오른쪽 클릭하면 선택 전체가 유지되므로, `Color`나 `Delete selected` 같은 항목이 선택 전체에 적용됩니다. [다중 선택](./table-related-functions.md#다중-선택) 문서를 참고하세요.

## 시작 화면

웹 앱, Google Drive, VS Code, Obsidian, JetBrains IDE에서는 빈 다이어그램을 열면 ERD 캔버스 위에 시작 화면이 표시됩니다. 직접 만든 페이지의 `<erd-editor>`에서는 페이지가 [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen)으로 켠 경우에만 표시됩니다.  
테이블도, 표시된 메모도, 표시된 테이블 그룹도 없는 동안 다이어그램은 빈 것으로 간주되므로, View Option으로 숨긴 메모와 그룹은 포함되지 않습니다. 다이어그램에 그중 하나라도 생기면 화면이 바로 사라지고, 마지막 테이블을 삭제하거나 첫 테이블 추가를 Undo한 뒤처럼 다이어그램이 다시 비면 언제든 다시 나타납니다.  
읽기 전용 에디터와 Zen 모드에서는 표시되지 않으며, 테이블 속성이 열려 있거나 Diff Viewer, 자동 배치 미리보기, Time Travel이 캔버스를 차지하는 동안에도 표시되지 않습니다.

![빈 다이어그램의 시작 화면에서 Import의 형식 목록을 열고 Esc로 돌아간 뒤, New Table로 테이블을 추가하고 ⌘ + Z로 화면을 다시 불러오기](/img/demo-welcome-screen.webp)

`Right-click the canvas for every action.` 제목 아래에 다음 메뉴가 있습니다.

- `New Table`은 `Alt + N`처럼 테이블을 추가합니다.
- `New Memo`는 `Alt + M`처럼 메모를 추가합니다. 메모가 숨겨져 있는 동안에는 표시되지 않습니다.
- `Import`는 메뉴를 `Back`과 `json`, `Schema SQL`, `GraphQL`, `DBML`, `AML` 형식으로 바꿉니다. 형식을 고르면 그 형식의 파일을 선택하도록 요청하고, 빈 다이어그램 대신 그 파일을 불러옵니다. [파일 가져오기와 내보내기](./file-import-export.md) 문서를 참고하세요. `Back` 또는 `Escape`를 누르면 처음 메뉴로 돌아갑니다.
- `Command Palette`는 `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac)처럼 [빠른 검색](./quick-search.md)을 엽니다.
- `Shortcuts`는 설정을 [`Shortcuts`](./settings.md#단축키) 탭으로 엽니다.

캔버스 너비가 충분하면 `New Table`, `New Memo`, `Command Palette`는 각 명령에 현재 지정된 키를 표시하며, 호스트가 다른 키로 바꾼 경우에도 그 키를 표시합니다.  
키보드 포커스가 항목에 있으면 `↑`와 `↓`로 항목 사이를 이동하며 양 끝에서 순환하고, `Home`과 `End`로 첫 번째와 마지막 항목으로 이동하며, `Enter` 또는 `Space`로 포커스된 항목을 누릅니다. 그 밖의 단축키도 모두 그대로 동작하므로, 이때도 `Alt + N`으로 테이블을 추가할 수 있습니다.  
클릭을 받는 것은 메뉴뿐입니다. 화면의 다른 곳을 누르면 캔버스에 전달되고, 캔버스를 마우스 오른쪽 클릭하면 평소처럼 컨텍스트 메뉴가 열립니다.

캔버스에 공간이 있으면 손으로 그린 화살표가 다음을 가리킵니다.

- 툴바의 `Search` 버튼: `Search commands and tables`
- `Theme` 버튼과 `Display Language` 버튼: `Pick a theme and a language`, 툴바에 둘 중 하나만 표시되면 `Pick a theme` 또는 `Pick a language`. [언어와 테마](./language-and-theme.md) 문서를 참고하세요.
- 아래쪽의 [캔버스 툴바](./table-related-functions.md#캔버스-툴바): `Pan, zoom and draw relationships`

[탐색기](./explorer.md)가 표시되어 있는 동안에는 시작 화면이 탐색기 옆의 캔버스만 덮습니다.  
툴바 버튼이 탐색기 위쪽에 있는 화살표는 표시되지 않습니다. `Theme`과 `Display Language` 화살표는 두 버튼이 모두 탐색기 위쪽에 있을 때만 표시되지 않으며, 그 전까지는 아직 캔버스 위쪽에 있는 버튼을 가리킵니다.  
화살표 옆에 공간이 없는 라벨은 대신 화살표 아래에 표시됩니다.

## 테이블 생성

컨텍스트 메뉴, [캔버스 툴바](./table-related-functions.md#캔버스-툴바)의 `New Table` 버튼, 또는 단축키 `Alt + N`으로 테이블을 생성할 수 있습니다.

## 메모 생성

컨텍스트 메뉴, 캔버스 툴바의 `New Memo` 버튼, 또는 단축키 `Alt + M`으로 메모를 생성할 수 있습니다.  
View Option → `Memos`가 꺼져 있는 동안에는 메모가 숨겨지고, 어디에도 `New Memo`가 표시되지 않으며, `Alt + M`으로도 메모가 추가되지 않습니다. [테이블 보기 옵션](./table-related-functions.md#테이블-보기-옵션) 문서를 참고하세요.

메모는 캔버스에 자유롭게 작성하는 노트입니다. 본문을 클릭해서 입력하면 텍스트가 문서와 함께 저장됩니다.  
`Escape`는 입력한 내용을 유지한 채 메모 편집모드를 끝내고 메모를 선택된 상태로 두며, `Escape`를 한 번 더 누르면 선택이 해제됩니다.  
테두리를 드래그해서 크기를 조절합니다. 포인터가 메모 위에 있는 동안 헤더에 표시되는 `x`로 메모를 삭제합니다.  
메모를 마우스 오른쪽 클릭하면 메모 편집모드가 아니라 메모 메뉴가 열립니다. 메뉴에는 `Color`, 선택된 항목에 색상이 있는 동안 표시되는 `Remove color`, 그리고 `Delete`가 있으며, `Delete`는 메모가 두 개 이상 선택된 항목 중 하나이면 `Delete selected`로 표시됩니다. 선택된 메모는 테이블을 삭제하는 키로도 삭제됩니다. [테이블, 메모 삭제](./table-related-functions.md#테이블-메모-삭제) 문서를 참고하세요.

![Alt + M으로 메모를 추가하고 내용을 입력한 뒤 테두리를 드래그해 크기 조절](/img/demo-memo.webp)

## 테이블 그룹 생성

테이블 그룹은 테이블을 담는 박스이며, 이름과 색상을 지정할 수 있습니다. 다음 두 가지 방법으로 생성합니다.

- 컨텍스트 메뉴 또는 빠른 검색에서 `New Table Group`을 선택하거나, [캔버스 툴바](./table-related-functions.md#캔버스-툴바)의 `New Table Group` 버튼을 클릭하거나, `Alt + G` (Windows/Linux) or `⌥ + G` (Mac)를 누른 뒤 캔버스 위에 박스를 드래그합니다. 중앙이 박스 안에 있는 테이블은 이미 다른 그룹에 속해 있지 않은 한 새 그룹에 들어갑니다. [그룹 그리기](./table-groups.md#그룹-그리기) 문서를 참고하세요.
- 테이블을 선택하고 테이블 컨텍스트 메뉴에서 `Group selected tables`를, 또는 빠른 검색에서 `Group Selected Tables`를 선택하거나, `T` 다음 `G`를 누릅니다. [선택한 테이블 그룹화](./table-groups.md#선택한-테이블-그룹화) 문서를 참고하세요.

이름 지정, 색상 지정, 이동, 크기 조절 등은 [테이블 그룹](./table-groups.md) 문서에서 다룹니다.

## 관계 생성

컨텍스트 메뉴, 캔버스 아래쪽의 [캔버스 툴바](./table-related-functions.md#캔버스-툴바), 또는 단축키로 시작합니다. 관계 타입마다 단축키가 다릅니다.

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

관계 타입을 선택하면 커서가 바뀝니다. 부모 테이블을 먼저 클릭하고, 그다음 자식 테이블을 클릭합니다.  
부모 테이블에 primary key가 없으면 생성되고, 부모 테이블의 primary key 컬럼마다 데이터 타입, 기본값, 코멘트가 같고 `Not Null`이 설정된 foreign key 컬럼이 자식 테이블에 생성됩니다.  
serial 키는 예외로, 그 foreign key는 `serial4`에 대한 `integer`처럼 serial이 저장하는 정수 타입을 사용합니다. [식별 관계](./relationship-editing.md#식별-관계) 문서를 참고하세요.  
각 foreign key 컬럼의 이름은 해당 키의 이름을 따릅니다. `id`처럼 한 단어로 된 이름은 앞에 부모 테이블 이름이 붙고(`user_id`), `member_id`처럼 여러 단어로 된 이름은 그대로 유지되며, 자식 테이블에 이미 있는 이름에는 번호가 붙습니다(`user_id_2`). [Foreign Key 컬럼 이름](./relationship-editing.md#foreign-key-컬럼-이름) 문서를 참고하세요.  
같은 테이블을 두 번 클릭하면 자기 참조 관계가 그려집니다.  
새 관계는 `On Delete`와 `On Update`가 모두 `Not set`인 상태로 시작하며, 관계 컨텍스트 메뉴에서 변경합니다. [ON DELETE와 ON UPDATE](./relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.  
`Escape`를 누르거나 같은 단축키를 다시 누르면 취소됩니다. 취소해도 선택은 그대로 유지되며, 다음 `Escape`가 선택을 해제합니다.

부모 테이블을 고른 뒤 관계를 연결할 수 있는 테이블을 가리키면, 그 테이블에 외곽선이 표시되고 옆에 버튼 두 개가 나타납니다.

- `Create new columns` (`+`)는 테이블을 클릭할 때처럼 새 foreign key 컬럼으로 관계를 그립니다.
- `Map to existing columns` (링크 아이콘)는 관계 그리기를 끝내고 두 테이블의 [컬럼 매핑](./relationship-editing.md#컬럼-매핑)을 열어, 자식 테이블에 이미 있는 컬럼을 관계에 사용할 수 있게 합니다. `Map`을 누르기 전까지는 아무것도 변경되지 않습니다.

포인터가 부모 테이블을 클릭한 지점에서 조금 벗어나면 부모 테이블에도 버튼이 표시되므로, 자기 참조 관계도 기존 컬럼에 매핑할 수 있습니다.  
손가락에는 호버가 없으므로, 손가락으로 그릴 때는 버튼이 표시되지 않고 자식 테이블을 탭하면 곧바로 관계가 그려집니다. 펜은 마우스처럼 버튼을 표시합니다.  
Undo나 공동 편집 참여자의 편집 등으로 자식 테이블에 닿기 전에 부모 테이블의 primary key가 사라지면, `Create new columns`가 `<parent> has no primary key to copy` 툴팁과 함께 흐리게 표시되고, 자식 테이블을 클릭하면 아무것도 그리지 않고 관계 그리기가 끝납니다.

![⌘ + ⌥ + 4로 One N 관계를, 캔버스 툴바에서 Zero N 관계를 그리며 외곽선이 표시된 자식 테이블 옆에 Map to existing columns와 Create new columns 버튼이 나타나는 모습](/img/demo-relationship.webp)

## 테이블과 메모 복제

기존 테이블과 메모는 복사, 붙여넣기, `Alt` 드래그로 복제할 수 있습니다. [테이블 관련 기능](./table-related-functions.md#테이블-메모-복사붙여넣기) 문서를 참고하세요.
