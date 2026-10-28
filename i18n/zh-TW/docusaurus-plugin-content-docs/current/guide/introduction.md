---
sidebar_position: 1
description: erd-editor 是實體關聯圖編輯器，可用於瀏覽器、Google Drive、VS Code、IntelliJ、Obsidian 和您自己的網頁，並提供唯讀檢視器，可在任何網站上顯示圖表。
---

# 簡介

erd-editor 是實體關聯圖編輯器。
它以網頁應用程式、Google Drive 應用程式、VS Code 擴充功能、IntelliJ 外掛程式和 Obsidian 外掛程式的形式提供，也可作為 `<erd-editor>` 自訂元素嵌入您自己的網頁，旁邊還有以唯讀方式顯示圖表的 `<erd-viewer>`。
不自行載入任何 script 的網站，則可改為嵌入 erd-editor.io/embed 上的唯讀圖表。
所有形式都使用同一個編輯器和同一種文件格式。

![商店圖表：將指標停留在關聯上、新增欄位，並在流程模式中聚焦 orders](/img/demo-overview.webp)

## 取得方式 {#where-to-get-it}

| 平台 | 安裝 | 提供內容 |
| --- | --- | --- |
| 網頁應用程式 | [erd-editor.io](https://erd-editor.io) | 可安裝的 PWA、可離線運作、即時協作 |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | 將 ERD Editor 加入 Drive 的 Open with 和 New 選單，並儲存回同一個檔案 |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | 在自訂編輯器中開啟 `.erd.json` 檔案 |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | 同一個編輯器，適用於以 IntelliJ 為基礎的 IDE |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | 在儲存庫的分頁中開啟 `.erd` 和 `.erd.json` 檔案，僅限桌面版 |
| 您的網頁 | `npm install @dineug/erd-editor` | 不依賴框架的 `<erd-editor>` 自訂元素，以及以唯讀方式顯示圖表的 `<erd-viewer>`，請參閱[安裝](../api/installation.md)和 [ErdViewerElement](../api/erd-viewer-element.md) |
| 任何網站 | [erd-editor.io/embed](https://erd-editor.io/embed) | 以文件的 URL 在 iframe 中顯示唯讀圖表，不需撰寫程式碼，請參閱[嵌入](./guides/embedding.md) |
| 程式碼代理程式 | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | 一個 MCP 伺服器，可讓 Claude Code、Codex 或其他用戶端在 VS Code、JetBrains IDE 或 Obsidian 中即時編輯圖表，或直接編輯檔案本身 |

若要在 IDE 中試用，建立一個副檔名為 `.erd.json` 的空白檔案並將其開啟。
在 Obsidian 中，從命令選擇區執行 `ERD Editor: Create new diagram`，或在檔案總管中從資料夾的右鍵選單選擇 `New ERD`。兩者都會建立一個空白的 `.erd` 檔案並將其開啟。
在 Google Drive 中，選擇 New → More → ERD Editor，然後使用 Google 帳戶登入。ERD Editor 只能存取以它建立或開啟的檔案。
在網頁應用程式、Google Drive、VS Code、JetBrains IDE 和 Obsidian 中，新的空白圖表開啟時會顯示[歡迎畫面](./guides/editing-start.md#welcome-screen)，這是一個列出入門步驟的選單：`New Table`、`New Memo`、`Import`、`Command Palette` 和 `Shortcuts`。
捲動、縮放、切換索引標籤和切換「名稱顯示」都會讓新圖表的空白檔案維持原樣，因為新圖表中的所有鎖定都已開啟。請參閱[鎖定](./guides/settings.md#lock)。
VS Code 會在 Source Control、Local History 和 Compare with Saved 中，在 VS Code 聊天與 GitHub Copilot 和 Claude Code 等程式碼代理程式的編輯審查中，以及在 GitLens、GitHub Pull Requests 和 Git Graph 等擴充功能的修訂檢視中，將 ERD 檔案以 JSON 文字開啟，因此可逐行比較變更的差異。`Reopen Editor With...` 會將 Git 修訂版本顯示為唯讀圖表。

更新 Obsidian 外掛程式後，請重新啟動 Obsidian：在此之前，視窗會保留先前版本載入的編輯器。
請在所有共用圖表的地方更新 ERD Editor 和 `@dineug/erd-editor-mcp`。推出「字典」索引標籤之前的版本，或編輯磁碟上檔案的較早版本 MCP 伺服器，儲存圖表時不會保留其邏輯名稱、定義域連結和字典。在資料表群組推出之前的版本中，目前版本儲存的檔案也不會顯示主鍵圖示，而在這類版本中儲存該檔案，會捨棄其中的資料表群組和結構描述 SQL 指令碼。
較早版本儲存的檔案，會在檔案第一次保留變更時以目前的格式重新寫入，請參閱[鎖定](./guides/settings.md#lock)。這次儲存也會捨棄較早版本所寫入的空白文字、清單和集合，因此對檔案的變更會比該次編輯本身更多。在此之前，依據其 `$schema` 驗證資料表群組推出之前的版本所儲存之檔案的 JSON 編輯器，會將其回報為無效。

## 主要功能 {#what-it-does}

- 在無邊界的畫布上繪製資料表、欄位和備忘錄，並以四種關聯類型將它們連接起來：`Zero One`、`Zero N`、`One Only`、`One N`。請參閱[開始編輯](./guides/editing-start.md)。索引在資料表的屬性面板中定義。涵蓋兩個或更多欄位的唯一索引即為替代鍵，開啟 `Alternate Key` 檢視選項時，圖表會將其欄位標示為 `AK1.1`、`AK1.2`，依此類推。請參閱[索引](./guides/table-related-functions.md#indexes)和[替代鍵](./guides/table-related-functions.md#alternate-keys)。
- 讓關聯的終點落在資料表現有的欄位上：以滑鼠或觸控筆繪製關聯時，終點資料表旁的 `Map to existing columns` 會將父資料表的鍵與該資料表的欄位配對，`Create new columns` 則會新增欄位。關聯右鍵選單中的 `Map Columns` 可在之後變更其欄位。請參閱[對應欄位](./guides/relationship-editing.md#map-columns)。關聯也可以帶有 ON DELETE 和 ON UPDATE 動作。請參閱 [ON DELETE 與 ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update)。
- 快速編輯：`Alt + N` 會新增資料表；`Alt + Enter` 會新增欄位；`Alt + K` 會切換焦點欄位的主鍵，若焦點欄位是選取的欄位之一，則會切換每個選取欄位的主鍵；`Delete` 或 `Backspace` 則會刪除選取範圍。每一項都算作一個復原步驟。請參閱[快速鍵](./guides/settings.md#shortcuts)。畫布底部的[畫布工具列](./guides/table-related-functions.md#canvas-toolbar)也能按一下就新增資料表或備忘錄。
- 從包含預設集和圖表已使用顏色的選擇器中，為資料表、備忘錄或資料表群組設定顏色，並以 `No color` 或 `Remove color` 移除顏色。請參閱[設定資料表與備忘錄的顏色](./guides/table-related-functions.md#table-and-memo-color-specification)。
- 將相關的資料表收進[資料表群組](./guides/table-groups.md)：位於這些資料表後方、可以命名和設定顏色的方框。使用 `Alt + G`，或使用畫布的右鍵選單、畫布工具列或快速搜尋中的 `New Table Group` 繪製群組；也可以先按 `T` 再按 `G`，或使用所選資料表右鍵選單中的 `Group selected tables`，以所選資料表建立群組。資料表放置在群組內時會加入群組，放置在群組外時會離開群組，而拖曳群組的標題列時，其中的資料表會隨之移動。DBML 的匯入和匯出都會以 `TableGroup` 區塊保留群組。
- 為資料表和欄位設定[邏輯名稱](./guides/logical-names.md)，也就是供人閱讀的名稱，例如 `CUST_NM` 的 `Customer Name`，與結構描述 SQL 和程式碼產生器寫出的物理名稱並列。「名稱顯示」（`Physical Names`、`Logical Names` 或 `Both Names`）決定畫布要繪製其中哪一個，而[其他大多數](./guides/logical-names.md#beyond-the-canvas)顯示資料表或欄位名稱的地方（例如物件總管的資料表列和欄位列、流程模式，以及匯出的圖片）也會依循它。可從畫布工具列的 `Name View` 按鈕、畫布的右鍵選單、視覺化在 `Flow` 中的工具列或快速搜尋選擇。
- 在[字典](./guides/dictionary.md)索引標籤中保存圖表的命名標準。其 `Domains`、`Words` 和 `Terms` 工作表可以像試算表一樣搜尋、排序和編輯，且各有自己的復原歷程記錄。這些工作表可匯入和匯出 CSV：匯入時可讀取編輯器自己的格式或韓國公共資料標準（공통표준）的格式，編碼為 UTF-8 或 EUC-KR，匯出時則寫出編輯器自己的格式。邏輯名稱儲存格會自動完成術語名稱。在您自行撰寫名稱之前，邏輯名稱會依相符的術語，或依其切分出的詞彙的英文縮寫，為其資料表或欄位提供物理名稱。詞彙或術語變更後，[`Derive Physical Names Again`](./guides/dictionary.md#derive-physical-names-again) 會重新產生名稱，包括自行撰寫的名稱。以手動方式或透過其術語連結到定義域的欄位，會[採用該定義域的資料類型](./guides/dictionary.md#domains-and-data-types)並隨其變更，`Domain` 檢視選項則會顯示每個欄位的定義域。[`Checks`](./guides/dictionary.md#the-checks-sheet) 工作表會列出禁用詞、未登錄的詞彙和同義詞、重複的名稱、未知的定義域、與其術語不同的物理名稱，以及與其定義域不同的欄位類型。畫布會為詞彙和術語檢查所標出的邏輯名稱和物理名稱上色。
- 從 `json`、`Schema SQL`、`GraphQL`、`DBML` 或 `AML` 匯入現有的結構描述。請參閱[匯入或匯出檔案](./guides/file-import-export.md)。匯入結構描述 SQL、GraphQL、DBML 或 AML 檔案時，其資料表會沿著關聯配置，沒有關聯時則逐列排列。[`Import and Add`](./guides/file-import-export.md#import-and-add) 會將檔案加到圖表下方，而不是取代圖表。
- 將圖表匯出為 `json`；從「[結構描述 SQL](./guides/schema-sql.md#saving-or-copying-the-sql)」索引標籤匯出為結構描述 SQL，可儲存為 `.sql` 檔案或複製；或從 [`Export image`](./guides/file-import-export.md#image) 對話方塊匯出為 PNG 或 SVG 圖片，或以 PNG 複製到剪貼簿。
- 在其他網站上以唯讀方式顯示圖表：以檔案的 URL（包括 GitHub 上的檔案）嵌入 [erd-editor.io/embed](./guides/embedding.md)，或在您自己的網頁中載入 [`<erd-viewer>`](../api/erd-viewer-element.md) 元素。讀者可以平移、縮放、搜尋並點亮關聯，但沒有任何東西能編輯圖表。
- 以八種資料庫廠商的語法寫出結構描述 SQL：Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake 和 SQLite。請參閱[資料表相關功能](./guides/table-related-functions.md#databases)。「[結構描述 SQL](./guides/schema-sql.md)」索引標籤的選項面板可選擇要寫出的陳述式、標頭和資料表群組，可[將邏輯名稱寫入空白註解](./guides/schema-sql.md#logical-names-as-comments)，並保留您自己的 SQL，這些 SQL 會儲存在圖表中，寫在資料表之前和之後。
- 為二十二種目標產生程式碼：語言有 C#、Go、Java、Kotlin、PHP、Rust、Scala、Swift 和 TypeScript；ORM 有 Doctrine、Drizzle、JPA、SeaORM、Sequelize、SQLAlchemy 和 TypeORM；此外還有 AML、DBML、GraphQL、JSON Schema、Mermaid 和 Zod。「程式碼產生器」索引標籤的選項面板可選擇語言、資料庫和名稱大小寫，程式碼可儲存為使用該語言副檔名的檔案，或加以複製。請參閱[程式碼產生器](./guides/code-generator.md)。
- 在[視覺化](./guides/visualization.md)中檢視結構描述，可呈現為力導向的 `Graph`，或沿著關聯配置資料表卡片的 `Flow`；將指標停留在資料表上時，與其相連的一切都會亮起。在 ERD 索引標籤上按 `Alt + F`，即可[聚焦所選資料表](./guides/visualization.md#focusing-on-tables)以及與其相關的資料表。在 `Flow` 中，[`Previous table` 和 `Next table`](./guides/visualization.md#previous-table-and-next-table) 會在流程模式所縮小到的各個範圍之間返回上一步或前進到下一步，作用與該處的復原和重做按鍵相同。
- 在沒有邊界的畫布上工作：圖表延伸到哪裡就能平移到哪裡，使用 `Ctrl + Wheel`（在 Mac 上為 `⌘ + Wheel`）、鍵盤或雙指縮放，在 `10%` 到 `150%` 之間縮放，並以禪模式隱藏圖表以外的一切。以滑鼠中鍵拖曳可從畫布上的任何位置平移，即使在資料表上方也可以。請參閱[瀏覽畫布](./guides/table-related-functions.md#getting-around-the-canvas)。
- 使用[自動版面配置](./guides/table-related-functions.md#auto-layout)一次排列整個圖表：力導向模擬、由左至右的流程配置，或任一方向的樹狀配置，每個資料表群組都會保持在一起。
- 透過[快速搜尋](./guides/quick-search.md)從任何地方執行命令，或以 `#`、`@` 或 `:` 作為搜尋開頭，跳至資料表、欄位，或註解或備忘錄；`#` 和 `@` 也會比對邏輯名稱。使用[復原、重做](./guides/undo-redo.md)逐步瀏覽編輯歷程記錄，使用[時光旅行](./guides/undo-redo.md#time-travel)在畫布上重播此工作階段的歷程記錄，或在[差異檢視器](./guides/table-related-functions.md#diff-viewer)中將圖表與另一個 `.json` 檔案比較。它的樹狀結構位於兩個版本旁，會列出已新增、已修改、已刪除或已重新命名的資料表、欄位、索引、外鍵、備忘錄和資料表群組。
- 在[物件總管](./guides/explorer.md)中瀏覽圖表，這是停駐在畫布左側的樹狀結構：先是各個資料表，每個資料表都附有其欄位、索引和外鍵，接著是資料表群組和備忘錄。按一下某一列即可前往該列在畫布上代表的項目；外鍵列也會讓其關聯亮起。工具列的 `Explorer` 按鈕位於 `Search` 旁，可開啟和關閉物件總管。
- 使用物件總管頂端的[尋找與取代](./guides/find-and-replace.md)尋找文字。它會搜尋資料表、欄位、索引和資料表群組的名稱，資料表和欄位的邏輯名稱，以及開啟後的註解和備忘錄，並在物件總管的樹狀結構中顯示相符項目。取代一個相符項目或全部相符項目；`Preserve Case` 會讓每個取代內容沿用被取代文字的大小寫。`Ctrl + F`（在 Mac 上為 `⌘ + F`）會開啟物件總管，並將插入點放在「尋找」輸入框中，再按一次則會關閉物件總管。
- 以 25 種語言使用編輯器，可從工具列的 `Display Language` 按鈕或快速搜尋中選擇。`System` 會依循瀏覽器或主應用程式的語言，而阿拉伯文、希伯來文和波斯文會讓編輯器由右至左配置，圖表則維持由左至右。只有編輯器本身的文字會改變：名稱、SQL 和產生的程式碼都會維持原樣。工具列的佈景主題建立器可選擇外觀（`System`、`Light` 或 `Dark`）、灰色調，以及強調色。請參閱[語言與佈景主題](./guides/language-and-theme.md)。
- 保持差異簡潔：捲動位置與縮放比例、開啟中的索引標籤、程式碼產生器的語言與名稱大小寫、引號類型，以及「名稱顯示」，預設都會[鎖定](./guides/settings.md#lock)，因此檔案會保留鎖定時的值，捲動、縮放、切換索引標籤或切換「名稱顯示」都不會變更檔案。檔案會以固定順序寫入，每個字典列各佔一行，並省略測量出的寬度、堆疊順序、連接線錨點、已移除的項目、項目的空白文字，以及圖表中完全沒有的種類的清單和集合，因此開啟圖表後未經編輯就關閉，檔案會維持原樣。
- 讓 Claude Code 或 Codex 等程式碼代理程式透過 [MCP 伺服器](../mcp/introduction.md)編輯圖表：可以在 VS Code、Obsidian 或 JetBrains IDE 中即時編輯，每項變更發生時都會立即顯示在畫布上，也可以直接編輯檔案本身。它也可以設定邏輯名稱和欄位的定義域、[編輯字典](../mcp/tools.md#dictionaries)、重新產生物理名稱，並列出 `Checks` 工作表找出的問題。
- 在網頁應用程式中即時協作編輯（實驗性）。工作階段採用點對點連線並經過端對端加密，因此不會有任何伺服器存放您的結構描述，對等端也能看到彼此的游標、焦點和選取範圍。在您自己的網頁中，[`getSharedStore()`](../api/advanced/collaborative-editing.md) 能透過您選擇的傳輸方式提供相同的動作串流。

請從[編輯指南](/docs/category/guides)開始。

## 開發緣由 {#reason-behind-this-project}

現有的建模工具無法提供我所期望的使用者體驗水準。  
因此，我發起了這個專案，以提供極致的使用者體驗。  
本專案最優先考量的是使用者的編輯體驗。  
它將為您帶來令人驚豔的編輯體驗。
