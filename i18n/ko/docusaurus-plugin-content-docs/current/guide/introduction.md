---
sidebar_position: 1
description: erd-editor는 브라우저, Google Drive, VS Code, IntelliJ, Obsidian, 직접 만든 페이지에서 동작하는 ERD 에디터이며, 어느 사이트에서나 다이어그램을 보여 주는 읽기 전용 뷰어도 있습니다.
---

# 소개

erd-editor는 ERD(Entity-Relationship Diagram) 에디터입니다.
웹 앱, Google Drive 앱, VS Code 확장, IntelliJ 플러그인, Obsidian 플러그인, 그리고 직접 만든 페이지에 삽입할 수 있는 `<erd-editor>` 커스텀 엘리먼트로 제공되며, 그 옆의 `<erd-viewer>`는 다이어그램을 읽기 전용으로 보여 줍니다.
자체 스크립트를 불러오지 않는 사이트는 대신 erd-editor.io/embed로 읽기 전용 다이어그램을 프레임으로 넣을 수 있습니다.
모두 동일한 에디터이며 동일한 문서 형식을 사용합니다.

![쇼핑몰 다이어그램에서 관계에 마우스 올리기, 컬럼 추가, Flow에서 orders 테이블 포커스](/img/demo-overview.webp)

## 받을 수 있는 곳

| 플랫폼 | 설치 | 제공 내용 |
| --- | --- | --- |
| 웹 앱 | [erd-editor.io](https://erd-editor.io) | 설치 가능한 PWA, 오프라인 동작, 실시간 공동 편집 |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | Drive의 Open with와 New 메뉴에 ERD Editor를 추가하고, 같은 파일에 다시 저장합니다. |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | `.erd.json` 파일을 커스텀 에디터로 엽니다. |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | IntelliJ 기반 IDE에서 동작하는 동일한 에디터 |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | `.erd`와 `.erd.json` 파일을 볼트의 탭에서 엽니다. 데스크톱 전용입니다. |
| 직접 만든 페이지 | `npm install @dineug/erd-editor` | 프레임워크 없이 동작하는 `<erd-editor>` 커스텀 엘리먼트와, 다이어그램을 읽기 전용으로 보여 주는 `<erd-viewer>` — [설치](../api/installation.md)와 [ErdViewerElement](../api/erd-viewer-element.md) 문서를 참고하세요. |
| 모든 사이트 | [erd-editor.io/embed](https://erd-editor.io/embed) | 문서의 URL로 코드 없이 iframe에 넣는 읽기 전용 다이어그램 — [임베드](./guides/embedding.md) 문서를 참고하세요. |
| 코딩 에이전트 | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | Claude Code, Codex 등의 클라이언트가 VS Code, JetBrains IDE, Obsidian에서 라이브로, 또는 파일 자체에서 다이어그램을 편집하게 하는 MCP 서버 |

IDE에서 사용해 보려면 `.erd.json` 확장자로 빈 파일을 만들어 여세요.
Obsidian에서는 명령 팔레트에서 `ERD Editor: Create new diagram`을 실행하거나, 파일 탐색기에서 폴더의 컨텍스트 메뉴에 있는 `New ERD`를 고르세요. 어느 쪽이든 빈 `.erd` 파일을 만들어 엽니다.
Google Drive에서는 New → More → ERD Editor를 고른 뒤 Google 계정으로 로그인하세요. ERD Editor는 이 앱으로 만들거나 연 파일에만 접근합니다.
웹 앱, Google Drive, VS Code, JetBrains IDE, Obsidian에서는 새로 만든 빈 다이어그램이 [시작 화면](./guides/editing-start.md#시작-화면)으로 열립니다. 시작 화면은 `New Table`, `New Memo`, `Import`, `Command Palette`, `Shortcuts`로 첫 단계를 고르는 메뉴입니다.
새 다이어그램에서는 모든 잠금이 켜져 있으므로, 스크롤하거나 확대/축소하거나 탭을 전환하거나 이름 표시를 전환해도 새 다이어그램의 빈 파일은 그대로 유지됩니다. [잠금](./guides/settings.md#잠금) 문서를 참고하세요.
VS Code는 Source Control, Local History, Compare with Saved, VS Code 채팅과 GitHub Copilot, Claude Code 같은 코딩 에이전트의 편집 리뷰, GitLens, GitHub Pull Requests, Git Graph 같은 확장의 리비전 보기에서 ERD 파일을 JSON 텍스트로 열므로, 변경 사항을 줄 단위로 비교할 수 있습니다. `Reopen Editor With...`를 사용하면 Git 리비전을 읽기 전용 다이어그램으로 볼 수 있습니다.

Obsidian 플러그인을 업데이트한 뒤에는 Obsidian을 다시 시작하세요. 그때까지는 창에 이전 버전이 불러온 에디터가 그대로 남아 있습니다.
다이어그램을 공유하는 모든 곳에서 ERD Editor와 `@dineug/erd-editor-mcp`를 업데이트하세요. 사전 탭을 지원하기 전의 릴리스나 디스크의 파일을 편집하는 이전 MCP 서버는 논리명, 도메인 연결, 사전 없이 다이어그램을 저장합니다. 테이블 그룹을 지원하기 전의 릴리스는 또한 현재 릴리스가 저장한 파일에서 primary key 아이콘을 표시하지 않으며, 그곳에서 파일을 저장하면 테이블 그룹과 Schema SQL 스크립트가 사라집니다.
이전 릴리스가 저장한 파일은 파일에 기록되는 첫 변경이 일어날 때 현재 형식으로 다시 작성됩니다. [잠금](./guides/settings.md#잠금) 문서를 참고하세요. 이렇게 저장할 때 이전 릴리스가 기록한 빈 텍스트, 목록, 컬렉션도 제거되므로, 파일은 편집한 것보다 더 많이 바뀝니다. 그때까지는 테이블 그룹을 지원하기 전의 릴리스가 저장한 파일을 `$schema`로 검증하는 JSON 에디터가 그 파일을 유효하지 않다고 보고합니다.

## 주요 기능

- 경계가 없는 캔버스에 테이블, 컬럼, 메모를 그리고 `Zero One`, `Zero N`, `One Only`, `One N` 4가지 관계 타입으로 연결합니다. [편집 시작하기](./guides/editing-start.md) 문서를 참고하세요. 인덱스는 테이블 속성 패널에서 정의합니다. 두 개 이상의 컬럼으로 이루어진 unique 인덱스는 대체 키이며, `Alternate Key` 보기 옵션을 켜면 다이어그램이 해당 컬럼에 `AK1.1`, `AK1.2`처럼 표시합니다. [인덱스](./guides/table-related-functions.md#인덱스)와 [대체 키](./guides/table-related-functions.md#대체-키) 문서를 참고하세요.
- 테이블에 이미 있는 컬럼으로 관계를 연결합니다. 마우스나 펜으로 관계를 그리는 동안, 관계가 끝나는 테이블 옆의 `Map to existing columns`는 부모 테이블의 키를 그 테이블의 컬럼과 짝지어 주고, `Create new columns`는 새 컬럼을 추가합니다. 관계의 컨텍스트 메뉴에 있는 `Map Columns`로 나중에 컬럼을 바꿀 수 있습니다. [컬럼 매핑](./guides/relationship-editing.md#컬럼-매핑) 문서를 참고하세요. 관계에는 ON DELETE와 ON UPDATE 동작도 지정할 수 있습니다. [ON DELETE와 ON UPDATE](./guides/relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.
- 빠르게 편집합니다. `Alt + N`은 테이블을 추가하고, `Alt + Enter`는 컬럼을 추가하며, `Alt + K`는 포커스된 컬럼의 primary key를 전환하고(포커스된 컬럼이 선택된 컬럼 중 하나이면 선택된 컬럼 모두에 적용됩니다), `Delete` 또는 `Backspace`는 선택한 항목을 삭제합니다. 각각이 Undo 한 단계입니다. [단축키](./guides/settings.md#단축키) 문서를 참고하세요. 캔버스 아래쪽의 [캔버스 툴바](./guides/table-related-functions.md#캔버스-툴바)로도 클릭 한 번에 테이블이나 메모를 추가할 수 있습니다.
- 프리셋과 다이어그램에서 이미 사용 중인 색상을 제공하는 색상 선택기로 테이블, 메모, 테이블 그룹에 색상을 지정하고, `No color` 또는 `Remove color`로 색상을 제거합니다. [테이블, 메모 색상 지정](./guides/table-related-functions.md#테이블-메모-색상-지정) 문서를 참고하세요.
- 관련된 테이블을 [테이블 그룹](./guides/table-groups.md)으로 묶습니다. 테이블 그룹은 테이블 뒤에 놓이는 박스로, 이름과 색상을 지정할 수 있습니다. `Alt + G`로, 또는 캔버스 컨텍스트 메뉴, 캔버스 툴바, 빠른 검색의 `New Table Group`으로 그룹을 그리거나, 선택한 테이블에서 `T` 다음 `G`를 누르거나 그 테이블의 컨텍스트 메뉴에 있는 `Group selected tables`를 골라 그룹을 만듭니다. 테이블을 그룹 안에 놓으면 그룹에 들어가고 바깥에 놓으면 그룹에서 빠지며, 그룹의 제목 표시줄을 드래그하면 그 안의 테이블도 함께 이동합니다. DBML은 그룹을 `TableGroup` 블록으로 가져오고 내보냅니다.
- 테이블과 컬럼에 [논리명](./guides/logical-names.md)을 붙입니다. 논리명은 `CUST_NM`에 대한 `Customer Name`처럼 사람이 읽는 이름으로, Schema SQL과 Code Generator가 쓰는 물리명과 함께 둡니다. 이름 표시(`Physical Names`, `Logical Names`, `Both Names`)가 캔버스에 그중 무엇을 그릴지 정하며, 탐색기의 테이블 행과 컬럼 행, Flow, 내보낸 이미지처럼 테이블이나 컬럼의 이름을 표시하는 [다른 곳도 대부분](./guides/logical-names.md#beyond-the-canvas) 이를 따릅니다. 이름 표시는 캔버스 툴바의 `Name View` 버튼, 캔버스 컨텍스트 메뉴, `Flow`의 Visualization 툴바, 빠른 검색에서 고릅니다.
- 다이어그램의 명명 표준을 [사전](./guides/dictionary.md) 탭에 둡니다. `Domains`, `Words`, `Terms` 시트는 스프레드시트처럼 검색하고 정렬하고 편집하며, 시트마다 자체 Undo 히스토리가 있습니다. 시트는 CSV를 가져오고 내보냅니다. 가져오기는 에디터 자체 형식이나 공공데이터 공통표준의 형식을 UTF-8 또는 EUC-KR로 읽고, 내보내기는 에디터 자체 형식으로 씁니다. 논리명 셀은 용어명을 자동완성합니다. 논리명은 이름을 직접 입력하기 전까지, 일치하는 용어나 논리명을 나눈 단어들의 약어로 테이블이나 컬럼에 물리명을 줍니다. 단어나 용어가 바뀐 뒤에는 [`Derive Physical Names Again`](./guides/dictionary.md#derive-physical-names-again)이 직접 입력한 이름을 포함해 이름을 다시 생성합니다. 직접 또는 용어를 통해 도메인에 연결된 컬럼은 [도메인의 데이터 타입을 가지며](./guides/dictionary.md#domains-and-data-types) 그 변경을 따르고, `Domain` 보기 옵션은 각 컬럼의 도메인을 표시합니다. [`Checks`](./guides/dictionary.md#the-checks-sheet) 시트는 금칙어, 미등록 단어, 이음동의어, 이름 중복, 알 수 없는 도메인, 용어와 다른 물리명, 도메인과 다른 컬럼 타입을 나열합니다. 캔버스는 단어와 용어 검사가 지적한 논리명과 물리명에 색을 칠합니다.
- 기존 스키마를 `json`, `Schema SQL`, `GraphQL`, `DBML`, `AML`에서 가져옵니다. [파일 가져오기와 내보내기](./guides/file-import-export.md) 문서를 참고하세요. Schema SQL, GraphQL, DBML, AML 파일은 테이블이 관계를 따라 배치된 상태로 들어오며, 관계가 없으면 여러 행으로 배치됩니다. [`Import and Add`](./guides/file-import-export.md#가져와서-추가)는 다이어그램을 대체하지 않고 파일을 다이어그램 아래에 추가합니다.
- 다이어그램을 `json`으로 내보내고, [Schema SQL](./guides/schema-sql.md#sql-저장과-복사) 탭에서 Schema SQL을 `.sql` 파일로 저장하거나 복사하며, [`Export image`](./guides/file-import-export.md#이미지) 대화 상자에서 PNG나 SVG 이미지로 내보내거나 PNG를 클립보드에 복사합니다.
- 다이어그램을 다른 사이트에 읽기 전용으로 보여 줍니다. GitHub의 파일을 포함해 파일의 URL로 [erd-editor.io/embed](./guides/embedding.md)를 프레임으로 넣거나, 직접 만든 페이지에서 [`<erd-viewer>`](../api/erd-viewer-element.md) 엘리먼트를 불러옵니다. 읽는 사람은 화면을 이동하고, 확대/축소하고, 검색하고, 관계선을 강조할 수 있으며, 어떤 것도 다이어그램을 편집하지 않습니다.
- Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, SQLite 8가지 데이터베이스 벤더의 문법으로 Schema SQL을 작성합니다. [테이블 관련 기능](./guides/table-related-functions.md#데이터베이스) 문서를 참고하세요. [Schema SQL](./guides/schema-sql.md) 탭의 옵션 패널에서는 작성할 구문, 헤더, 테이블 그룹을 고르고, [빈 코멘트에 논리명을 쓸](./guides/schema-sql.md#logical-names-as-comments) 수 있으며, 직접 작성한 SQL을 다이어그램에 저장해 두었다가 테이블 앞뒤에 작성합니다.
- 22가지 대상으로 코드를 생성합니다. 언어로는 C#, Go, Java, Kotlin, PHP, Rust, Scala, Swift, TypeScript, ORM으로는 Doctrine, Drizzle, JPA, SeaORM, Sequelize, SQLAlchemy, TypeORM, 그리고 AML, DBML, GraphQL, JSON Schema, Mermaid, Zod를 지원합니다. Code Generator 탭의 옵션 패널에서 언어, 데이터베이스, 이름 케이스를 고르며, 코드는 언어에 맞는 확장자의 파일로 저장하거나 복사합니다. [코드 생성](./guides/code-generator.md) 문서를 참고하세요.
- [시각화](./guides/visualization.md)에서 스키마를 force-directed `Graph` 또는 관계를 따라 배치된 테이블 카드의 `Flow`로 확인합니다. 테이블에 마우스를 올리면 그 테이블과 닿아 있는 모든 것이 강조됩니다. ERD 탭에서 `Alt + F`를 누르면 선택한 테이블과 그 테이블에 관계로 이어진 테이블에 [포커스](./guides/visualization.md#테이블-포커스)합니다. `Flow`에서는 [`Previous table`과 `Next table`](./guides/visualization.md#previous-table-and-next-table)이 그곳의 Undo 키, Redo 키와 마찬가지로 Flow가 좁혀 온 범위를 따라 한 단계 뒤로, 한 단계 앞으로 이동합니다.
- 경계 없는 캔버스에서 작업합니다. 다이어그램이 뻗어 나가는 곳이면 어디든 이동하고, `Ctrl + Wheel`(Mac에서는 `⌘ + Wheel`), 키보드, 핀치로 `10%`부터 `150%`까지 확대/축소하며, Zen 모드로 다이어그램만 남깁니다. 마우스 가운데 버튼으로 드래그하면 테이블 위를 포함해 캔버스 어디서든 화면이 이동합니다. [캔버스 이동](./guides/table-related-functions.md#캔버스-이동) 문서를 참고하세요.
- [자동 배치](./guides/table-related-functions.md#자동-배치)로 다이어그램 전체를 한 번에 정리합니다. Force 시뮬레이션, 왼쪽에서 오른쪽으로 흐르는 Flow, 두 방향의 Tree 중에서 고르며, 테이블 그룹은 각각 하나로 모여 유지됩니다.
- [빠른 검색](./guides/quick-search.md)으로 어디서든 명령을 실행하거나, 검색어를 `#`, `@`, `:`로 시작해 각각 테이블, 컬럼, 코멘트나 메모로 바로 이동합니다. `#`과 `@`는 논리명도 찾습니다. [Undo, Redo](./guides/undo-redo.md)로 편집 히스토리를 하나씩 오가고, [Time Travel](./guides/undo-redo.md#time-travel)로 이번 세션의 히스토리를 캔버스에서 재생하거나, [Diff Viewer](./guides/table-related-functions.md#diff-viewer)에서 다이어그램을 다른 `.json` 파일과 비교합니다. Diff Viewer의 트리는 두 버전 옆에서 추가, 수정, 삭제되거나 이름이 바뀐 테이블, 컬럼, 인덱스, foreign key, 메모, 테이블 그룹을 나열합니다.
- 캔버스 왼쪽에 도킹되는 트리인 [탐색기](./guides/explorer.md)에서 다이어그램을 둘러봅니다. 테이블과 각 테이블의 컬럼, 인덱스, foreign key가 나열되고, 이어서 테이블 그룹과 메모가 나열됩니다. 행을 클릭하면 캔버스에서 그 행이 나타내는 대상으로 이동하며, foreign key 행은 그 관계도 함께 강조합니다. 툴바에서 `Search` 옆에 있는 `Explorer` 버튼으로 탐색기를 열고 닫습니다.
- 탐색기 맨 위의 [찾기와 바꾸기](./guides/find-and-replace.md)로 텍스트를 찾습니다. 테이블, 컬럼, 인덱스, 테이블 그룹의 이름, 테이블과 컬럼의 논리명, 그리고 켜 두면 코멘트와 메모까지 검색하며, 일치 항목을 탐색기의 트리에 표시합니다. 일치 항목을 하나만 또는 모두 한꺼번에 바꾸며, `Preserve Case`는 바꿔 넣는 각 텍스트에 원래 텍스트의 대소문자를 적용합니다. `Ctrl + F`(Mac에서는 `⌘ + F`)를 누르면 커서가 Find 입력란에 놓인 채로 탐색기가 열리고, 다시 누르면 탐색기가 닫힙니다.
- 툴바의 `Display Language` 버튼이나 빠른 검색에서 고르는 25개 언어로 에디터를 사용합니다. `System`은 브라우저나 호스트 앱의 언어를 따르며, 아랍어, 히브리어, 페르시아어에서는 에디터가 오른쪽에서 왼쪽으로 배치되고 다이어그램은 왼쪽에서 오른쪽 그대로 유지됩니다. 바뀌는 것은 에디터 자체의 텍스트뿐이며, 이름, SQL, 생성된 코드는 작성한 그대로 유지됩니다. 툴바의 테마 빌더에서 외관(`System`, `Light`, `Dark`), 회색 색상, 강조 색상을 고릅니다. [언어와 테마](./guides/language-and-theme.md) 문서를 참고하세요.
- diff를 깔끔하게 유지합니다. 스크롤 위치와 확대/축소, 열린 탭, Code Generator의 언어와 이름 케이스, 괄호 타입, 이름 표시는 기본적으로 [잠겨](./guides/settings.md#잠금) 있으므로, 파일은 잠글 때의 값을 유지하며 스크롤하거나 확대/축소하거나 탭이나 이름 표시를 전환해도 바뀌지 않습니다. 파일은 사전 행마다 한 줄씩 고정된 순서로 작성되며 측정된 너비, 쌓임 순서, 연결선 앵커, 삭제된 항목, 항목의 빈 텍스트, 다이어그램에 하나도 없는 종류의 목록과 컬렉션을 기록하지 않으므로, 다이어그램을 열었다가 편집하지 않고 닫으면 파일은 그대로 유지됩니다.
- Claude Code나 Codex 같은 코딩 에이전트가 [MCP 서버](../mcp/introduction.md)를 통해 다이어그램을 편집하게 합니다. VS Code, Obsidian, JetBrains IDE에서 라이브로 편집하면 모든 변경이 일어나는 즉시 캔버스에 나타나며, 파일 자체를 편집할 수도 있습니다. 논리명과 컬럼의 도메인을 설정하고, [사전을 편집](../mcp/tools.md#dictionaries)하고, 물리명을 다시 생성하고, `Checks` 시트가 찾은 내용을 나열할 수도 있습니다.
- 웹 앱에서 실시간으로 함께 편집합니다(실험적). 세션은 peer-to-peer이며 종단 간 암호화되어 있어 어떤 서버도 스키마를 보관하지 않고, 참여자끼리 서로의 커서, 포커스, 선택 영역을 볼 수 있습니다. 직접 만든 페이지에서는 [`getSharedStore()`](../api/advanced/collaborative-editing.md)로 원하는 전송 수단을 통해 동일한 액션 스트림을 사용할 수 있습니다.

[편집 가이드](/docs/category/guides)부터 시작하세요.

## 이 프로젝트가 탄생한 이유

기존에 있던 모델링 툴들은 제가 원하는 수준의 사용자 경험을 제공해 주지 못했습니다.  
그래서 최고의 사용자 경험을 위해 프로젝트를 시작했습니다.  
프로젝트의 최우선순위는 사용자 편집 경험입니다.  
놀라운 편집 경험을 제공할 것입니다.
