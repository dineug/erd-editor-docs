---
sidebar_position: 2
description: 向 Claude Code、Codex 或其他任何 MCP 用戶端註冊 @dineug/erd-editor-mcp 伺服器，並設定 VS Code、Obsidian 或 JetBrains IDE 以進行即時編輯。
---

# 安裝

此伺服器以 `@dineug/erd-editor-mcp` 為名發佈在 npm 上。
它是單一的獨立檔案，沒有任何執行階段相依套件，而 `npx` 會在代理程式第一次啟動它時將其下載，因此不需要另外安裝任何東西。
它需要 Node.js `22.12` 或更新版本。

若要讓代理程式即時編輯圖表，還要設定持有該圖表的編輯器：[VS Code](#set-up-vs-code)、[Obsidian](#set-up-obsidian) 或 [JetBrains IDE](#set-up-a-jetbrains-ide)。
沒有編輯器為該文件提供服務時，代理程式會編輯磁碟上的檔案，請參閱[即時與無介面](./live-and-headless.md)。

## Claude Code {#claude-code}

在專案資料夾中執行：

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

在 `--transport` 之前加上 `--scope project`，即可改為將伺服器寫入專案的 `.mcp.json`，每個複製該專案的人都會取得它。

## Codex {#codex}

執行一次即可。Codex 的 CLI、應用程式和 IDE 擴充功能共用此設定：

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

或者將伺服器加入 `~/.codex/config.toml`，或受信任專案中的 `.codex/config.toml`：

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## 其他 MCP 用戶端 {#any-other-mcp-client}

以 stdio 伺服器的形式執行 `npx -y @dineug/erd-editor-mcp`：命令為 `npx`，引數為 `-y` 和 `@dineug/erd-editor-mcp`。

伺服器會以其工作目錄為基準解析相對的文件路徑，因此應在專案資料夾中啟動它。
它支援 MCP 協定版本 `2025-06-18`、`2025-03-26` 和 `2024-11-05`，對於使用更新版本的用戶端，則以 `2025-06-18` 回應。

## 設定 VS Code {#set-up-vs-code}

VS Code 視窗會為其工作區資料夾中的圖表，以及在其中開啟的任何圖表提供服務。

1. 安裝 `4.0.0` 或更新版本的 [ERD Editor 擴充功能](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode)。它需要 VS Code `1.101.0` 或更新版本。
2. 開啟專案資料夾並信任該工作區。擴充功能只會在受信任的工作區中為代理程式提供服務。
3. 讓 `dineug.erd-editor.agentHub.enabled` 設定保持開啟。它預設為開啟。

`3.0.0` 到 `3.1.0` 的擴充功能與伺服器 `1.0.0` 或更新版本會互相拒絕，而 `3.0.0` 之前的擴充功能不會為任何代理程式提供服務。
`4.0.0` 或 `4.1.0` 的擴充功能可以連線，但既不會顯示也不會保留代理程式寫入的邏輯名稱、定義域連結和字典列，請參閱[更新](#updating)。

擴充功能會在包含 `.erd`、`.erd.json`、`.vuerd` 或 `.vuerd.json` 檔案的工作區中啟動，因此在您開啟其中任何一個圖表之前，代理程式就能存取這些圖表。
在不含這些檔案的工作區中，擴充功能會在您開啟圖表時啟動，在此之前代理程式會在磁碟上進行編輯。

| 設定 | 預設值 | 作用 |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | 讓代理程式的 MCP 伺服器透過本機通訊端（在 Windows 上為具名管道）編輯此視窗的文件。關閉此設定時，或在不受信任的工作區中，代理程式仍可從磁碟讀取此視窗的圖表，但絕不會繞過其編輯器寫入任何圖表。 |

## 設定 Obsidian {#set-up-obsidian}

Obsidian 儲存庫視窗會為其儲存庫中的圖表提供服務。

1. 從 Community plugins 安裝 `1.0.0` 或更新版本的 [ERD Editor 外掛程式](https://community.obsidian.md/plugins/erd-editor)，並將其開啟。它只在桌面應用程式中執行，且需要 Obsidian `1.5.7` 或更新版本。
2. 讓 Settings → ERD Editor → Coding agents 保持開啟。它預設為開啟，且每個儲存庫各自保留自己的設定。

`1.0.0` 之前的外掛程式與伺服器 `1.0.0` 或更新版本會互相拒絕。
`1.0.0` 或 `1.1.0` 的外掛程式可以連線，但既不會顯示也不會保留代理程式寫入的邏輯名稱、定義域連結和字典列，請參閱[更新](#updating)。

儲存庫視窗從外掛程式載入的那一刻起就會為代理程式提供服務，因此在您開啟其中任何一個圖表之前，代理程式就能存取該儲存庫的圖表。
沒有信任步驟。
儲存庫未列出的檔案（例如名稱以點開頭之資料夾中的檔案）無法在 ERD Editor 中開啟，因此對它的編輯會被拒絕。

要求代理程式為新圖表命名時使用 `.erd`。
沒有副檔名的名稱會加上 `.erd.json`，而 Obsidian 的檔案總管只有在 Settings → Files and links → Detect all file extensions 開啟時，才會列出 `.erd.json` 檔案。

| 設定 | 預設值 | 作用 |
| --- | --- | --- |
| Coding agents | 開啟 | 讓代理程式的 MCP 伺服器透過本機通訊端（在 Windows 上為具名管道）編輯此儲存庫的圖表。關閉時，代理程式仍可從磁碟讀取此儲存庫的圖表，但絕不會繞過其編輯器寫入任何圖表。 |

從 Flathub 安裝的 Obsidian 會在 Flatpak 沙箱中執行，伺服器無法連線至該沙箱。
在這種情況下，外掛程式不會為任何代理程式提供服務，也不會保留鎖定檔案，因此代理程式會編輯磁碟上的檔案，即使是您已開啟的圖表也一樣。
Obsidian 會重新載入該圖表，如同在其外部進行任何變更後一樣，而您所做但 Obsidian 尚未儲存的編輯，會被代理程式的編輯取代。
每次開啟該儲存庫時，外掛程式都會提示這一點，直到您關閉 Coding agents 為止。

## 設定 JetBrains IDE {#set-up-a-jetbrains-ide}

JetBrains IDE 會為其中開啟的每個專案的圖表，以及在其 ERD Editor 中開啟的任何圖表提供服務。

1. 安裝 `1.0.0` 或更新版本的 [ERD Editor 外掛程式](https://plugins.jetbrains.com/plugin/23594-erd-editor)。它需要以 IntelliJ 為基礎、`2025.2` 或更新版本，並在 JetBrains Runtime 上執行的 IDE。
2. 開啟專案並信任它。在 IDE 不信任的專案中（例如以安全模式開啟的專案），代理程式可以讀取圖表，但絕不會變更它們。
3. 讓 Settings | Tools | ERD Editor → Coding agents 保持勾選。它預設為開啟，並套用於整個 IDE。

`0.9.0` 或 `0.10.0` 的外掛程式與伺服器 `1.0.0` 或更新版本會互相拒絕，而 `0.9.0` 之前的外掛程式不會為任何代理程式提供服務。
`1.0.0` 或 `1.1.0` 的外掛程式可以連線，但既不會顯示也不會保留代理程式寫入的邏輯名稱、定義域連結和字典列，請參閱[更新](#updating)。

IDE 從第一個專案開啟的那一刻起就會為代理程式提供服務，因此在您開啟其中任何一個圖表之前，代理程式就能存取專案的圖表。

| 設定 | 預設值 | 作用 |
| --- | --- | --- |
| Coding agents | 開啟 | 讓代理程式的 MCP 伺服器透過本機通訊端（在 Windows 上為具名管道）編輯此 IDE 的圖表。關閉時，代理程式仍可從磁碟讀取已開啟專案的圖表，但絕不會繞過其編輯器變更任何圖表。 |

設定頁面會指出程式碼代理程式無法使用的情況：在沒有 JCEF 的 IDE 中（ERD Editor 在其中也無法執行）、在 Linux 上以 Flatpak 形式安裝的 IDE 中，以及其 hub 無法啟動時。
在這些情況下，IDE 不會保留鎖定檔案，代理程式會編輯磁碟上的檔案。
ERD Editor 在圖表開啟期間不會重新載入在磁碟上變更的該圖表，而您在其中的下一次編輯會將整個圖表寫回，覆蓋代理程式的變更，因此請先關閉該圖表。

## 試用 {#try-it}

1. 開啟存放圖表的資料夾：在 VS Code 中，作為您信任的工作區；在 Obsidian 中，作為儲存庫；在 JetBrains IDE 中，作為您信任的專案。
2. 在同一個資料夾中啟動代理程式，並用平常的話提出要求，例如 *「在 schema.erd.json 中新增一個 reviews 資料表，並與 users 和 products 建立關聯」*。
3. 看著變更出現在畫布上。在 VS Code 中，使用 `Ctrl + S` (Windows/Linux) 或 `⌘ + S` (Mac) 儲存，或要求代理程式儲存。Obsidian 和 JetBrains IDE 會像儲存您自己的編輯一樣儲存此變更，而要求代理程式儲存則會立即寫入。

尚未開啟的圖表會在代理程式第一次編輯時於 ERD Editor 中開啟，且不會奪走鍵盤焦點。
代理程式使用 `erd_open_document` 建立新文件，沒有副檔名的名稱會加上 `.erd.json`。

## 更新 {#updating}

上述命令都未指定版本，因此代理程式每次啟動伺服器時，`npx` 都會到 npm 檢查是否有更新的伺服器版本。
已在執行的伺服器會維持其版本，直到代理程式再次啟動它為止。

伺服器在連線之前會檢查編輯器所使用的協定版本。
兩者不同時，每個到達該編輯器的呼叫都會以 `protocolMismatch` 被拒絕，包括讀取和 `erd_list_documents`，且不會寫入任何內容。
訊息會指出需要更新的一方：伺服器，或是編輯器中的 ERD Editor，也就是 VS Code 中的擴充功能，以及 Obsidian 和 JetBrains IDE 中的外掛程式。

伺服器 `1.0.0` 或更新版本、`4.0.0` 或更新版本的 VS Code 擴充功能、`1.0.0` 或更新版本的 Obsidian 外掛程式和 `1.0.0` 或更新版本的 JetBrains 外掛程式使用協定 2。
所有較早的伺服器都使用協定 1，為代理程式提供服務的所有較早編輯器版本也是如此：`3.0.0` 到 `3.1.0` 的 VS Code 擴充功能、`0.1.0` 和 `0.2.0` 的 Obsidian 外掛程式，以及 `0.9.0` 和 `0.10.0` 的 JetBrains 外掛程式。
這類編輯器與伺服器 `1.0.0` 或更新版本會互相拒絕，較早的伺服器與使用協定 2 的編輯器也會互相拒絕。
`3.0.0` 之前的 VS Code 擴充功能或 `0.9.0` 之前的 JetBrains 外掛程式完全不會為代理程式提供服務，因此代理程式會編輯磁碟上的檔案，即使是在其中開啟的圖表也一樣。

| 組合 | 訊息結尾 |
| --- | --- |
| 伺服器 `1.0.0` 或更新版本搭配使用協定 1 的擴充功能或外掛程式 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| 較早的伺服器搭配使用協定 2 的擴充功能或外掛程式 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

將伺服器和擴充功能或外掛程式一起更新。
使用相同協定的伺服器與編輯器可以連線，無論兩者中哪一個較舊，但只有伺服器 `1.1.0` 或更新版本具備用於邏輯名稱、定義域和字典的工具，請參閱[字典](./tools.md#dictionaries)。
只有 `4.2.0` 或更新版本的 VS Code 擴充功能，以及 `1.2.0` 或更新版本的 Obsidian 和 JetBrains 外掛程式，會顯示並保留這些工具寫入的邏輯名稱、定義域連結和字典列。
可以連線的較早擴充功能或外掛程式會忽略這些內容，不過代理程式的呼叫仍會成功。
它仍會套用字典所產生的物理名稱，以及定義域所賦予的資料類型。
`1.1.0` 之前的伺服器讀取檔案時不會包含其邏輯名稱、定義域連結和字典列，並會在編輯磁碟上的檔案時將其省略，請參閱[無介面](./live-and-headless.md#headless)。

凡是會開啟這些圖表的地方，也都要更新 ERD Editor。
`4.2.0` 之前的 VS Code 擴充功能、`1.2.0` 之前的 Obsidian 外掛程式和 `1.2.0` 之前的 JetBrains 外掛程式在開啟由較新版本儲存、或由代理程式在磁碟上編輯過的圖表時，不會包含其資料表和欄位的邏輯名稱、其欄位的定義域連結，以及其詞彙、術語和定義域。
它們儲存該檔案時，會將這些內容省略。
`4.0.0` 之前的 VS Code 擴充功能、`1.0.0` 之前的 Obsidian 外掛程式和 `1.0.0` 之前的 JetBrains 外掛程式在顯示這類圖表時，也不會顯示其主鍵圖示，並會在儲存該檔案時捨棄其中的資料表群組和結構描述 SQL 指令碼。
`3.1.0` 之前的 VS Code 擴充功能、`0.2.0` 之前的 Obsidian 外掛程式和 `0.10.0` 之前的 JetBrains 外掛程式在儲存檔案時，也會捨棄圖表的 ON DELETE 和 ON UPDATE 動作。
在 Obsidian 中，更新外掛程式後須重新啟動應用程式：在此之前，儲存庫視窗會持續執行其最先載入之外掛程式版本中的 ERD Editor。
