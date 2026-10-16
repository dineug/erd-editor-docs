---
sidebar_position: 2
description: Claude Code, Codex를 비롯한 MCP 클라이언트에 @dineug/erd-editor-mcp 서버를 등록하고, 라이브 편집을 위해 VS Code, Obsidian, JetBrains IDE를 설정하는 방법.
---

# 설치

서버는 npm에 `@dineug/erd-editor-mcp`로 배포되어 있습니다.
런타임 의존성이 없는 자립형 파일 하나이며, 에이전트가 처음 실행할 때 `npx`가 내려받으므로 따로 설치할 것이 없습니다.
Node.js `22.12` 이상이 필요합니다.

에이전트가 다이어그램을 라이브로 편집하게 하려면, 그 다이어그램을 담고 있는 에디터인 [VS Code](#vs-code-설정), [Obsidian](#obsidian-설정), [JetBrains IDE](#jetbrains-ide-설정) 중 하나도 설정하세요.
문서를 담당하는 에디터가 없으면 에이전트는 디스크의 파일을 편집합니다. [라이브와 헤드리스](./live-and-headless.md) 문서를 참고하세요.

## Claude Code

프로젝트 폴더에서 실행합니다.

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

`--transport` 앞에 `--scope project`를 추가하면 서버가 대신 프로젝트의 `.mcp.json`에 기록되어, 프로젝트를 clone하는 모든 사람이 함께 사용하게 됩니다.

## Codex

한 번 실행합니다. Codex CLI, 앱, IDE 확장이 이 설정을 공유합니다.

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

또는 `~/.codex/config.toml`이나, 신뢰하는 프로젝트의 `.codex/config.toml`에 서버를 추가합니다.

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

VS Code 창은 워크스페이스 폴더에 있는 다이어그램과, 그 창에서 열린 모든 다이어그램을 담당합니다.

1. [ERD Editor 확장](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` 이상을 설치합니다. VS Code `1.101.0` 이상이 필요합니다.
2. 프로젝트 폴더를 열고 워크스페이스를 신뢰합니다. 확장은 신뢰하는 워크스페이스에서만 에이전트를 지원합니다.
3. `dineug.erd-editor.agentHub.enabled` 설정을 켜 둔 채로 둡니다. 기본적으로 켜져 있습니다.

`3.0.0`부터 `3.1.0`까지의 확장과 서버 `1.0.0`은 서로를 거부하며, `3.0.0` 이전의 확장은 에이전트를 지원하지 않습니다. [업데이트](#업데이트) 항목을 참고하세요.

확장은 `.erd`, `.erd.json`, `.vuerd`, `.vuerd.json` 파일이 있는 워크스페이스에서 시작되므로, 사용자가 다이어그램을 열기 전에도 에이전트가 그 다이어그램에 닿을 수 있습니다.
그런 파일이 없는 워크스페이스에서는 다이어그램을 열 때 시작되며, 그 전까지 에이전트는 디스크의 파일을 편집합니다.

| 설정 | 기본값 | 효과 |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | 에이전트의 MCP 서버가 로컬 소켓(Windows에서는 명명된 파이프)을 통해 이 창의 문서를 편집할 수 있게 합니다. 꺼져 있거나 신뢰하지 않는 워크스페이스에서는 에이전트가 창의 다이어그램을 디스크에서 읽을 수는 있지만, 에디터 모르게 파일을 쓰는 일은 없습니다. |

## Obsidian 설정

Obsidian 볼트 창은 그 볼트에 있는 다이어그램을 담당합니다.

1. Community plugins에서 [ERD Editor 플러그인](https://community.obsidian.md/plugins/erd-editor) `1.0.0` 이상을 설치하고 켭니다. 데스크톱 앱에서만 동작하며, Obsidian `1.5.7` 이상이 필요합니다.
2. Settings → ERD Editor → Coding agents를 켜 둔 채로 둡니다. 기본적으로 켜져 있으며, 볼트마다 설정을 따로 가집니다.

이전 버전의 플러그인과 서버 `1.0.0`은 서로를 거부합니다. [업데이트](#업데이트) 항목을 참고하세요.

볼트 창은 플러그인이 로드되는 순간부터 에이전트를 지원하므로, 사용자가 다이어그램을 열기 전에도 에이전트가 볼트의 다이어그램에 닿을 수 있습니다.
신뢰 단계는 없습니다.
이름이 점으로 시작하는 폴더 안의 파일처럼 볼트가 목록에 올리지 않는 파일은 ERD Editor에서 열 수 없으므로, 그 파일에 대한 편집은 거부됩니다.

새 다이어그램 이름에는 `.erd`를 붙이도록 에이전트에게 요청하세요.
확장자가 없는 이름에는 `.erd.json`이 붙는데, Obsidian의 파일 탐색기는 Settings → Files and links → Detect all file extensions가 켜져 있을 때에만 `.erd.json` 파일을 표시합니다.

| 설정 | 기본값 | 효과 |
| --- | --- | --- |
| Coding agents | 켜짐 | 에이전트의 MCP 서버가 로컬 소켓(Windows에서는 명명된 파이프)을 통해 이 볼트의 다이어그램을 편집할 수 있게 합니다. 꺼져 있으면 에이전트가 볼트의 다이어그램을 디스크에서 읽을 수는 있지만, 에디터 모르게 파일을 쓰는 일은 없습니다. |

Flathub에서 설치한 Obsidian은 서버가 닿을 수 없는 Flatpak 샌드박스 안에서 실행됩니다.
이때 플러그인은 에이전트를 지원하지 않고 잠금 파일도 남기지 않으므로, 에이전트는 사용자가 열어 둔 다이어그램이라도 디스크의 파일을 편집합니다.
Obsidian은 외부에서 일어난 다른 변경과 마찬가지로 다이어그램을 다시 불러오며, 아직 저장되지 않은 사용자의 편집은 에이전트의 편집에 밀려납니다.
플러그인은 Coding agents를 끌 때까지 볼트가 열릴 때마다 이 사실을 알립니다.

## JetBrains IDE 설정

JetBrains IDE는 그 안에서 열린 모든 프로젝트의 다이어그램과, 그 IDE의 ERD Editor에서 열린 모든 다이어그램을 담당합니다.

1. [ERD Editor 플러그인](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` 이상을 설치합니다. JetBrains Runtime에서 실행되는 IntelliJ 기반 IDE `2025.2` 이상이 필요합니다.
2. 프로젝트를 열고 신뢰합니다. 안전 모드로 연 프로젝트처럼 IDE가 신뢰하지 않는 프로젝트에서는 에이전트가 다이어그램을 읽기만 하고 절대 바꾸지 않습니다.
3. Settings | Tools | ERD Editor → Coding agents를 체크한 채로 둡니다. 기본적으로 켜져 있으며, IDE 전체에 적용됩니다.

플러그인 `0.9.0` 또는 `0.10.0`과 서버 `1.0.0`은 서로를 거부하며, `0.9.0` 이전의 플러그인은 에이전트를 지원하지 않습니다. [업데이트](#업데이트) 항목을 참고하세요.

IDE는 첫 프로젝트가 열리는 순간부터 에이전트를 지원하므로, 사용자가 다이어그램을 열기 전에도 에이전트가 프로젝트의 다이어그램에 닿을 수 있습니다.

| 설정 | 기본값 | 효과 |
| --- | --- | --- |
| Coding agents | 켜짐 | 에이전트의 MCP 서버가 로컬 소켓(Windows에서는 명명된 파이프)을 통해 이 IDE의 다이어그램을 편집할 수 있게 합니다. 꺼져 있으면 에이전트가 열린 프로젝트의 다이어그램을 디스크에서 읽을 수는 있지만, 에디터 모르게 바꾸는 일은 없습니다. |

코딩 에이전트를 사용할 수 없을 때는 설정 페이지에 그 사실이 표시됩니다. JCEF가 없는 IDE(ERD Editor도 실행할 수 없는 환경), Linux에서 Flatpak으로 설치한 IDE, 그리고 허브가 시작하지 못했을 때입니다.
이때 IDE는 잠금 파일을 남기지 않으며, 에이전트는 디스크의 파일을 편집합니다.
ERD Editor는 열려 있는 동안 디스크에서 바뀐 다이어그램을 다시 불러오지 않고, 그 뒤 사용자가 편집하면 다이어그램 전체를 다시 써서 에이전트의 변경을 덮어쓰므로, 먼저 다이어그램을 닫아 두세요.

## 사용해 보기

1. 다이어그램이 있는 폴더를 엽니다. VS Code에서는 신뢰하는 워크스페이스로, Obsidian에서는 볼트로, JetBrains IDE에서는 신뢰하는 프로젝트로 엽니다.
2. 같은 폴더에서 에이전트를 실행하고 평소 말하듯 요청합니다. 예를 들면 _"schema.erd.json에 users, products와 관계를 맺는 reviews 테이블을 추가해 줘"_.
3. 변경이 캔버스에 반영되는 것을 확인합니다. VS Code에서는 `Ctrl + S` (Windows/Linux) or `⌘ + S` (Mac)로 저장하거나, 에이전트에게 저장을 요청합니다. Obsidian과 JetBrains IDE는 사용자의 편집을 저장하듯 변경을 저장하며, 에이전트에게 저장을 요청하면 곧바로 파일에 씁니다.

아직 열려 있지 않은 다이어그램은 에이전트가 처음 편집할 때 키보드 포커스를 가져가지 않은 채 ERD Editor에서 열립니다.
에이전트는 `erd_open_document`로 새 문서를 만들며, 확장자가 없는 이름에는 `.erd.json`이 붙습니다.

## 업데이트

위의 명령에는 버전이 없으므로, 에이전트가 서버를 실행할 때마다 `npx`가 npm에서 서버의 새 릴리스가 있는지 확인합니다.
이미 실행 중인 서버는 에이전트가 다시 실행할 때까지 그 릴리스를 유지합니다.

서버는 연결하기 전에 에디터가 사용하는 프로토콜 버전을 확인합니다.
둘이 다르면 그 에디터에 닿는 모든 호출이 읽기와 `erd_list_documents`를 포함해 `protocolMismatch`로 거부되며, 아무것도 쓰이지 않습니다.
메시지에는 업데이트할 쪽이 표시됩니다. 서버이거나 에디터의 ERD Editor이며, ERD Editor는 VS Code에서는 확장, Obsidian과 JetBrains IDE에서는 플러그인입니다.

서버 `1.0.0`, VS Code 확장 `4.0.0` 이상, Obsidian 플러그인 `1.0.0` 이상, JetBrains 플러그인 `1.0.0` 이상은 프로토콜 2를 사용합니다.
그보다 이전의 모든 서버는 프로토콜 1을 사용하며, 에이전트를 지원하는 그보다 이전의 모든 에디터 릴리스도 마찬가지입니다. VS Code 확장 `3.0.0`부터 `3.1.0`까지, Obsidian 플러그인 `0.1.0`과 `0.2.0`, JetBrains 플러그인 `0.9.0`과 `0.10.0`입니다.
이런 에디터와 서버 `1.0.0`은 서로를 거부하며, 이전 서버와 프로토콜 2를 사용하는 에디터도 서로를 거부합니다.
`3.0.0` 이전의 VS Code 확장이나 `0.9.0` 이전의 JetBrains 플러그인은 에이전트를 전혀 지원하지 않으므로, 에이전트는 그 안에서 열린 다이어그램이라도 디스크의 파일을 편집합니다.

| 조합 | 메시지의 끝부분 |
| --- | --- |
| 서버 `1.0.0`과 프로토콜 1을 사용하는 확장 또는 플러그인 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| 이전 서버와 프로토콜 2를 사용하는 확장 또는 플러그인 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

서버와 확장 또는 플러그인을 함께 업데이트하세요.
다이어그램을 여는 모든 곳의 ERD Editor도 업데이트하세요.
`4.0.0` 이전의 VS Code 확장, `1.0.0` 이전의 Obsidian 플러그인, `1.0.0` 이전의 JetBrains 플러그인은 그 이후의 릴리스가 저장했거나 에이전트가 디스크에서 편집한 다이어그램을 primary key 아이콘 없이 표시합니다.
이 릴리스들은 파일을 저장할 때 그 다이어그램의 테이블 그룹과 Schema SQL 스크립트를 버립니다.
`3.1.0` 이전의 VS Code 확장, `0.2.0` 이전의 Obsidian 플러그인, `0.10.0` 이전의 JetBrains 플러그인은 파일을 저장할 때 다이어그램의 ON DELETE와 ON UPDATE 동작도 버립니다.
Obsidian에서는 플러그인을 업데이트한 뒤 앱을 다시 시작하세요. 그때까지 볼트 창은 처음 불러온 플러그인 버전의 ERD Editor를 계속 실행합니다.
