---
sidebar_position: 2
description: Claude Code, Codex를 비롯한 MCP 클라이언트에 @dineug/erd-editor-mcp 서버를 등록하고, 라이브 편집을 위해 VS Code를 설정하는 방법.
---

# 설치

서버는 npm에 `@dineug/erd-editor-mcp`로 배포되어 있습니다.
런타임 의존성이 없는 자립형 파일 하나이며, 에이전트가 처음 실행할 때 `npx`가 내려받으므로 따로 설치할 것이 없습니다.
Node.js `22.12` 이상이 필요합니다.

## Claude Code

프로젝트 폴더에서 실행합니다.

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

`--transport` 앞에 `--scope project`를 추가하면 서버가 대신 프로젝트의 `.mcp.json`에 기록되어, 프로젝트를 clone하는 모든 사람이 함께 사용하게 됩니다.

## Codex

`~/.codex/config.toml`이나, 신뢰하는 프로젝트의 `.codex/config.toml`에 추가합니다.

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## 그 밖의 MCP 클라이언트

`npx -y @dineug/erd-editor-mcp`를 stdio 서버로 실행합니다. 명령은 `npx`, 인자는 `-y`와 `@dineug/erd-editor-mcp`입니다.

서버는 문서의 상대 경로를 자신의 작업 디렉터리를 기준으로 해석하므로, 프로젝트 폴더에서 실행하세요.
MCP 프로토콜 버전 `2025-06-18`, `2025-03-26`, `2024-11-05`를 지원하며, 그보다 새로운 버전을 사용하는 클라이언트에는 `2025-06-18`로 응답합니다.

## VS Code 설정

에이전트는 VS Code 확장을 통해서만 다이어그램을 라이브로 편집합니다. 확장이 없거나 문서의 폴더를 연 창이 없으면 디스크의 파일을 편집합니다. [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요.

1. [ERD Editor 확장](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `3.0.0` 이상을 설치합니다. VS Code `1.101.0` 이상이 필요합니다.
2. 프로젝트 폴더를 열고 워크스페이스를 신뢰합니다. 확장은 신뢰하는 워크스페이스에서만 에이전트를 지원합니다.
3. `dineug.erd-editor.agentHub.enabled` 설정을 켜 둔 채로 둡니다. 기본적으로 켜져 있습니다.

확장은 `.erd`, `.erd.json`, `.vuerd`, `.vuerd.json` 파일이 있는 워크스페이스에서 시작되므로, 사용자가 다이어그램을 열기 전에도 에이전트가 그 다이어그램에 닿을 수 있습니다.
그런 파일이 없는 워크스페이스에서는 다이어그램을 열 때 시작되며, 그 전까지 에이전트는 디스크의 파일을 편집합니다.

| 설정 | 기본값 | 효과 |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | 에이전트의 MCP 서버가 로컬 파이프를 통해 이 창의 문서를 편집할 수 있게 합니다. 꺼져 있거나 신뢰하지 않는 워크스페이스에서는 에이전트가 창의 다이어그램을 디스크에서 읽을 수는 있지만, 에디터 모르게 파일을 쓰는 일은 없습니다. |

## 사용해 보기

1. VS Code에서 프로젝트 폴더를 열고 워크스페이스를 신뢰합니다.
2. 같은 폴더에서 에이전트를 실행하고 평소 말하듯 요청합니다. 예를 들면 _"schema.erd.json에 users, products와 관계를 맺는 reviews 테이블을 추가해 줘"_.
3. 변경이 캔버스에 반영되는 것을 확인한 뒤 `Ctrl + S` (Windows/Linux) or `⌘ + S` (Mac)로 저장하거나, 에이전트에게 저장을 요청합니다.

아직 열려 있지 않은 다이어그램은 에이전트가 처음 편집할 때 ERD Editor에서 열립니다.
에이전트는 `erd_open_document`로 새 문서를 만들며, 확장자가 없는 이름에는 `.erd.json`이 붙습니다.

## 업데이트

위의 명령에는 버전이 없으므로, 에이전트가 서버를 실행할 때마다 `npx`가 npm에서 서버의 새 릴리스가 있는지 확인합니다.

서버는 연결하기 전에 확장이 사용하는 프로토콜 버전을 확인합니다.
둘이 다르면 호출이 `protocolMismatch`로 거부되며, 메시지에 업데이트할 쪽이 표시됩니다. VS Code의 ERD Editor 확장이거나 서버입니다.
