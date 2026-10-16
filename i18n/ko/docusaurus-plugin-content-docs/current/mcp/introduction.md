---
sidebar_position: 1
description: Claude Code, Codex 같은 코딩 에이전트가 @dineug/erd-editor-mcp MCP 서버로 erd-editor 다이어그램을 VS Code, Obsidian, JetBrains IDE에서 라이브로, 또는 디스크에서 직접 편집하는 방법.
---

# 소개

`@dineug/erd-editor-mcp`는 코딩 에이전트가 erd-editor 다이어그램을 편집할 수 있게 해 주는 MCP 서버입니다.
Claude Code, Codex를 비롯한 모든 [Model Context Protocol](https://modelcontextprotocol.io) 클라이언트는 문서를 다루는 작업마다 도구를 하나씩 사용할 수 있습니다. 테이블 추가, 컬럼 이름 변경, 두 테이블 사이의 관계 생성, DDL 덤프 가져오기, 스키마를 SQL로 다시 읽기 같은 작업입니다.

문서가 [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor), [JetBrains IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor)의 ERD Editor에서 열려 있으면 에이전트는 참여자처럼 에디터에 합류합니다.
모든 변경은 일어나는 즉시 캔버스에 나타나며, 에이전트의 Undo는 에이전트 자신의 편집만 되돌립니다.
VS Code는 에이전트나 사용자가 저장할 때까지 에이전트의 변경을 저장되지 않은 상태로 두고, Obsidian과 JetBrains IDE는 사용자의 편집을 저장하듯 에이전트의 변경도 저장합니다.
문서를 담고 있는 에디터가 없으면 같은 도구가 파일 자체를 편집합니다.

![VS Code에서 열린 다이어그램에 코딩 에이전트가 테이블과 관계를 추가하는 모습](/img/coding-agents.webp)

## 에이전트가 할 수 있는 일

- 대화로 스키마를 만들거나 바꿉니다. 테이블, 컬럼과 모든 컬럼 옵션, 카디널리티와 ON DELETE, ON UPDATE 동작을 포함한 관계, 인덱스, 메모, 색상, 캔버스 위의 위치까지 다룹니다. [관계](./tools.md#관계) 문서를 참고하세요.
- [테이블 그룹](../guide/guides/table-groups.md)으로 테이블을 묶습니다. 지정한 테이블을 둘러싸거나 캔버스의 한 영역을 덮는 그룹을 추가하고, 그 그룹의 이름을 바꾸거나, 색상을 지정하거나, 테이블과 함께 옮기거나, 크기를 조절하거나, 테이블을 넣고 빼거나, 그룹을 삭제합니다. 그룹을 삭제해도 그 테이블은 있던 자리에 그대로 남습니다. [테이블 그룹](./tools.md#테이블-그룹) 문서를 참고하세요.
- SQL DDL, GraphQL SDL, DBML, AML에서 파싱한 스키마나 다른 `.erd.json` 문서로 문서를 대체합니다. 또는 에디터의 [`Import and Add`](../guide/guides/file-import-export.md#가져와서-추가)처럼, 이미 있는 것을 모두 유지한 채 그 스키마나 문서를 다이어그램 아래에 추가합니다. 어느 쪽이든 DBML `TableGroup`은 테이블 그룹으로 들어옵니다. [가져오기](./tools.md#가져오기) 문서를 참고하세요.
- 다이어그램을 id 목록, 엔티티 전체, 저장할 때 기록되는 `.erd.json` 텍스트, 또는 8가지 데이터베이스 중 어느 것의 DDL로 다시 읽으며, DDL에는 [Schema SQL](../guide/guides/schema-sql.md) 탭의 `Statements`와 `Header` 선택지를 적용할 수 있습니다. 테이블이 수천 개인 스키마에서는 한 페이지, 테이블 몇 개, 또는 테이블 그룹 몇 개의 테이블씩 나눠 읽습니다. [문서 읽기](./tools.md#문서-읽기) 문서를 참고하세요.
- 데이터베이스, 데이터베이스 이름, 그리고 테이블 앞의 `CREATE EXTENSION`이나 테이블 뒤의 `GRANT`처럼 Schema SQL에서 테이블 앞뒤에 작성되는 [스크립트](../guide/guides/schema-sql.md#앞뒤-스크립트)를 설정합니다. `erd_read`는 스크립트만 따로 돌려주거나, 문서 전체의 DDL 안에 담아 돌려줍니다. [설정](./tools.md#설정) 문서를 참고하세요.
- 여러 편집을 전부 적용하거나 전혀 적용하지 않는 하나의 편집으로 실행하며, Undo 한 번으로 되돌립니다. [erd_batch](./tools.md#erd_batch) 문서를 참고하세요.
- 자신의 편집을 Undo, Redo하며, 사용자의 편집은 절대 건드리지 않습니다.

하지 않는 일:

- 확대/축소, 스크롤, 탭 전환. 이것들은 보는 사람 각자에게 속하므로, 그렇게 하는 도구는 없습니다. 다만 문서를 대체하는 가져오기는 에디터의 `Import`와 마찬가지로 `Viewport`가 잠겨 있어도 화면을 옮깁니다. 확대/축소 100%로 캔버스의 시작 위치로 돌아가거나, `erd_import_json`이면 불러오는 문서의 화면으로 옮기며, 그 문서가 `Canvas Type`을 잠그지 않았다면 그 문서의 탭으로도 옮깁니다. [가져오기](./tools.md#가져오기) 문서를 참고하세요.
- [`View Option`](../guide/guides/table-related-functions.md#테이블-보기-옵션), Code Generator의 언어와 이름 케이스, 괄호 타입, [설정](../guide/guides/settings.md) 탭의 `Relationship DataType Sync`, `Maximum comment width`, `Column Order` 변경. 이것들은 사용자가 에디터에서 설정하는 항목이며, 에이전트는 파일에 저장된 대로 읽습니다.
- [잠금](../guide/guides/settings.md#잠금) 켜기와 끄기. 잠금이나 위의 설정을 바꾸는 것은 문서 전체를 대체하는 `erd_import_json`뿐이며, 불러오는 문서의 잠금과 설정으로 바꿉니다. `4.0.0` 이전의 VS Code 확장이나 `1.0.0` 이전의 Obsidian 또는 JetBrains 플러그인이 저장한 파일처럼 `lockSettings` 필드가 없는 문서는 모든 잠금을 켭니다. 문서를 대체한 가져오기는 어느 것이든 되돌리면 문서가 그 전에 가졌던 설정과 잠금이 돌아옵니다.
- [`Map Columns`](../guide/guides/relationship-editing.md#컬럼-매핑)처럼 관계를 다른 컬럼에 다시 매핑하기. 대신 에이전트는 관계를 삭제한 뒤 원하는 컬럼을 `erd_link_columns`로 연결하며, 이를 Undo 한 번으로 되돌리는 하나의 `erd_batch`로 실행합니다. 관계를 삭제해도 그 foreign key 컬럼은 그대로 남습니다.
- Code Generator 실행. `erd_read`가 DDL이나 JSON을 돌려주면, 에이전트가 그것을 바탕으로 직접 코드를 작성합니다.

## 동작 방식

서버는 MCP 클라이언트가 실행하는 stdio 프로세스입니다.
서버는 호출마다 문서를 담고 있는 에디터를 찾습니다. ERD Editor 확장이나 플러그인이 설치된 VS Code 창, Obsidian 볼트 창, JetBrains IDE입니다.

- **라이브** — 워크스페이스, 볼트, 열려 있는 프로젝트 중 하나에 문서가 포함되어 있거나 문서를 열어 둔 에디터가 있습니다. 서버가 그 에디터의 편집 세션에 참여하고, 편집이 에디터에 반영됩니다. VS Code에서는 저장되지 않은 상태로 남고, Obsidian과 JetBrains IDE에서는 사용자의 편집처럼 저장됩니다.
- **헤드리스** — 에디터가 없습니다. 서버가 파일을 불러와 편집을 적용하고, 파일에 다시 씁니다.
- **거부** — 문서를 담고 있는 에디터가 있지만 허브가 꺼져 있습니다. 열려 있는 에디터가 다음 저장 때 파일을 덮어쓸 수 있으므로, 서버는 디스크에서 읽기만 하고 아무것도 쓰지 않습니다. 허브가 켜져 있는 JetBrains IDE도 신뢰하지 않는 프로젝트에서만 담고 있는 문서를 바꾸는 것은 거부하지만, 에이전트는 그 문서를 여전히 읽을 수 있습니다. 에디터의 허브가 켜져 있더라도 그 ERD Editor 확장이나 플러그인이 서버와 다른 허브 프로토콜을 사용하면, 문서에 대한 모든 호출이 읽기를 포함해 `protocolMismatch`로 거부되며, 메시지에 업데이트할 쪽이 표시됩니다. [업데이트](./installation.md#업데이트) 문서를 참고하세요.

자세한 내용은 [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요.

## 요구 사항

| | |
| --- | --- |
| Node.js | 서버 실행에 `22.12` 이상 |
| MCP 클라이언트 | Claude Code, Codex, 또는 stdio 서버를 실행할 수 있는 모든 클라이언트 |
| 라이브 편집용 VS Code | `1.101.0` 이상, ERD Editor 확장 `4.0.0` 이상 |
| 라이브 편집용 Obsidian | 데스크톱 앱 `1.5.7` 이상, ERD Editor 플러그인 `1.0.0` 이상 |
| 라이브 편집용 JetBrains IDE | IntelliJ 기반 IDE `2025.2` 이상, ERD Editor 플러그인 `1.0.0` 이상 |

서버 `1.0.0`과 위의 릴리스는 허브 프로토콜 2를 사용합니다.
에이전트를 지원하는 그보다 이전의 릴리스는 프로토콜 1을 사용합니다. VS Code 확장 `3.0.0`부터 `3.1.0`까지, Obsidian 플러그인 `0.1.0`과 `0.2.0`, JetBrains 플러그인 `0.9.0`과 `0.10.0`입니다.
이런 릴리스와 서버 `1.0.0`은 서로를 거부하며, 이전 서버와 위의 릴리스도 서로를 거부합니다. [업데이트](./installation.md#업데이트) 문서를 참고하세요.
`3.0.0` 이전의 VS Code 확장이나 `0.9.0` 이전의 JetBrains 플러그인에는 허브가 없으므로, 서버는 그 에디터를 보지 못하고 그 안에서 열린 다이어그램이라도 디스크의 파일을 편집합니다.

다음: [설치](./installation.md).
