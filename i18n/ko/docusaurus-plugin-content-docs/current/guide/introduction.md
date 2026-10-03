---
sidebar_position: 1
description: 브라우저, Google Drive, VS Code, IntelliJ, Obsidian, 직접 만든 페이지에서 동작하는 ERD 편집기.
---

# 소개

erd-editor는 ERD(Entity-Relationship Diagram) 편집기입니다.
웹 앱, Google Drive 앱, VS Code 확장, IntelliJ 플러그인, Obsidian 플러그인, 그리고 직접 만든 페이지에 삽입할 수 있는 `<erd-editor>` 커스텀 엘리먼트로 제공됩니다.
모두 동일한 에디터이며 동일한 문서 형식을 사용합니다.

![쇼핑몰 다이어그램에서 관계 강조, 컬럼 추가, Flow에서 orders 테이블 포커스](/img/demo-overview.webp)

## 받을 수 있는 곳

| 플랫폼 | 설치 | 제공 내용 |
| --- | --- | --- |
| 웹 앱 | [erd-editor.io](https://erd-editor.io) | 설치 가능한 PWA, 오프라인 동작, 실시간 공동 편집 |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | Drive의 Open with와 New 메뉴에 ERD Editor를 추가하고, 같은 파일에 다시 저장합니다. |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | `.erd.json` 파일을 커스텀 에디터로 엽니다. |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | IntelliJ 기반 IDE에서 동작하는 동일한 에디터 |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | `.erd`와 `.erd.json` 파일을 볼트의 탭에서 엽니다. 데스크톱 전용입니다. |
| 직접 만든 페이지 | `npm install @dineug/erd-editor` | 프레임워크 없이 동작하는 `<erd-editor>` 커스텀 엘리먼트 — [설치](../api/installation.md) 문서를 참고하세요. |

IDE에서 사용해 보려면 `.erd.json` 확장자로 빈 파일을 만들어 여세요.
Obsidian에서는 커맨드 팔레트에서 `ERD Editor: Create new diagram`을 실행하거나, 파일 탐색기에서 폴더의 컨텍스트 메뉴에 있는 `New ERD`를 고르세요. 어느 쪽이든 빈 `.erd` 파일을 만들어 엽니다.
새 다이어그램은 스크롤 위치와 확대/축소 레벨을 저장하지 않으므로, 스크롤하거나 확대/축소해도 새 다이어그램의 빈 파일은 그대로 유지됩니다. [스크롤 정보 저장](./guides/settings.md#스크롤-정보-저장) 문서를 참고하세요.
Google Drive에서는 New → More → ERD Editor를 고른 뒤 Google 계정으로 로그인하세요. ERD Editor는 이 앱으로 만들거나 연 파일에만 접근합니다.
Obsidian 플러그인을 업데이트한 뒤에는 Obsidian을 다시 시작하세요. 그때까지는 창에 이전 버전이 불러온 에디터가 그대로 남아 있습니다.

## 주요 기능

- 경계가 없는 캔버스에 테이블, 컬럼, 메모를 그리고 `Zero One`, `Zero N`, `One Only`, `One N` 4가지 관계 타입으로 연결합니다. [편집 시작하기](./guides/editing-start.md) 문서를 참고하세요. 관계에는 ON DELETE와 ON UPDATE 동작도 지정할 수 있습니다. [ON DELETE와 ON UPDATE](./guides/relationship-editing.md#on-delete와-on-update) 문서를 참고하세요. 인덱스는 테이블 속성 패널에서 정의합니다. 두 개 이상의 컬럼으로 이루어진 unique 인덱스는 대체 키이며, `Alternate Key` 보기 옵션을 켜면 다이어그램이 해당 컬럼에 `AK1.1`, `AK1.2`처럼 표시합니다. [인덱스](./guides/table-related-functions.md#인덱스)와 [대체 키](./guides/table-related-functions.md#대체-키) 문서를 참고하세요.
- 기존 스키마를 `json`, `Schema SQL`, `GraphQL`, `DBML`, `AML`에서 가져옵니다. [파일 가져오기와 내보내기](./guides/file-import-export.md) 문서를 참고하세요.
- 다이어그램을 `json`, `Schema SQL`, `png`로 내보냅니다.
- Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, SQLite 8가지 데이터베이스 벤더의 문법으로 Schema SQL을 작성합니다. [테이블 관련 기능](./guides/table-related-functions.md#데이터베이스) 문서를 참고하세요.
- C#, Go, Java, Kotlin, Scala, TypeScript, Drizzle, JPA, Sequelize, SQLAlchemy, TypeORM, AML, DBML, GraphQL 14가지 대상으로 코드를 생성합니다. [코드 생성](./guides/code-generator.md) 문서를 참고하세요.
- [시각화](./guides/visualization.md)에서 스키마를 force-directed `Graph` 또는 관계를 따라 배치된 테이블 카드의 `Flow`로 확인하고, 테이블에 마우스를 올려 그 테이블이 닿아 있는 것들을 한눈에 봅니다. ERD 탭에서 `Alt + F`를 누르면 선택한 테이블과 그 테이블에 관계로 이어진 테이블에 [포커스](./guides/visualization.md#테이블-포커스)합니다.
- 경계 없는 캔버스에서 작업합니다. 다이어그램이 뻗어 나가는 곳이면 어디든 이동하고, `Ctrl + Wheel`(Mac에서는 `⌘ + Wheel`), 키보드, 핀치로 `10%`부터 `150%`까지 확대/축소하며, Zen 모드로 다이어그램만 남깁니다. [캔버스 이동](./guides/table-related-functions.md#캔버스-이동) 문서를 참고하세요.
- [자동 배치](./guides/table-related-functions.md#자동-배치)로 다이어그램 전체를 한 번에 정리합니다. Force 시뮬레이션, 왼쪽에서 오른쪽으로 흐르는 Flow, 두 방향의 Tree 중에서 고릅니다.
- [빠른 검색](./guides/quick-search.md)으로 어디서든 명령을 실행하거나, 검색어를 `#`, `@`, `:`로 시작해 각각 테이블, 컬럼, 코멘트나 메모로 바로 이동합니다. [Undo, Redo](./guides/undo-redo.md)로 편집 히스토리를 하나씩 오갑니다.
- [찾기와 바꾸기](./guides/find-and-replace.md)로 테이블과 컬럼 이름, 코멘트, 메모에서 텍스트를 찾고, 일치 항목을 하나만 또는 모두 한꺼번에 바꿉니다. `Ctrl + F`(Mac에서는 `⌘ + F`) 또는 툴바의 `Search` 옆 버튼으로 엽니다.
- Claude Code나 Codex 같은 코딩 에이전트가 [MCP 서버](../mcp/introduction.md)를 통해 다이어그램을 편집하게 합니다. VS Code, Obsidian, JetBrains IDE에서 라이브로 편집하면 모든 변경이 일어나는 즉시 캔버스에 나타나며, 파일 자체를 편집할 수도 있습니다.
- 웹 앱에서 실시간으로 함께 편집합니다(실험적). 세션은 peer-to-peer이며 종단간 암호화되어 있어 어떤 서버도 스키마를 보관하지 않고, 참여자끼리 서로의 커서, 포커스, 선택 영역을 볼 수 있습니다. 직접 만든 페이지에서는 [`getSharedStore()`](../api/advanced/collaborative-editing.md)로 원하는 전송 방식 위에서 동일한 액션 스트림을 사용할 수 있습니다.

[편집 가이드](/docs/category/guides)부터 시작하세요.

## 이 프로젝트가 탄생한 이유

기존에 있던 모델링툴들은 제가 원하는 수준의 사용자 경험을 제공해주지 못했습니다.  
그래서 최고의 사용자 경험을 위해 프로젝트를 시작했습니다.  
프로젝트의 최우선순위는 사용자 편집 경험입니다.  
편집에 대해 당신에게 놀라운 경험을 제공해 줄 겁니다.
