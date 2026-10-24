---
sidebar_position: 1
description: 讓 Claude Code 或 Codex 等程式碼代理程式透過 @dineug/erd-editor-mcp MCP 伺服器編輯 erd-editor 圖表，可在 VS Code、Obsidian 或 JetBrains IDE 中即時編輯，也可直接在磁碟上編輯。
---

# 簡介

`@dineug/erd-editor-mcp` 是一個 MCP 伺服器，可讓程式碼代理程式編輯 erd-editor 圖表。
Claude Code、Codex 和其他任何 [Model Context Protocol](https://modelcontextprotocol.io) 用戶端，都能針對文件上的每種操作取得一個工具：新增資料表、重新命名欄位、為兩個資料表建立關聯、匯入 DDL 傾印、以 SQL 形式讀回結構描述。

當文件在 [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode)、[Obsidian](https://community.obsidian.md/plugins/erd-editor) 或 [JetBrains IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor) 的 ERD Editor 中開啟時，代理程式會像協作者一樣加入編輯器。
每項變更都會在發生的同時顯示在畫布上，而代理程式的復原只會還原它自己的編輯。
VS Code 會讓代理程式的變更保持未儲存，直到代理程式或您儲存為止；Obsidian 和 JetBrains IDE 則會像儲存您自己的編輯一樣儲存這些變更。
沒有編輯器持有該文件時，同樣的工具會編輯檔案本身。

![程式碼代理程式在 VS Code 中開啟的圖表上新增資料表和關聯](/img/coding-agents.webp)

## 代理程式能做什麼 {#what-an-agent-can-do}

- 在對話中建立或變更結構描述：資料表、欄位與每個欄位選項、關聯及其基數與 ON DELETE 和 ON UPDATE 動作、索引、備忘錄、顏色，以及在畫布上的位置。請參閱[關聯](./tools.md#relationships)。
- 將資料表收進[資料表群組](../guide/guides/table-groups.md)：在它所指定的資料表周圍或畫布的某個區域上新增群組，接著為群組重新命名、設定顏色、連同其中的資料表一起移動、調整大小、加入或移出資料表，或移除群組，移除後其中的資料表會留在原處。請參閱[資料表群組](./tools.md#table-groups)。
- 依編輯器[字典](../guide/guides/dictionary.md)索引標籤中的詞彙和術語為資料表和欄位命名，並將欄位連結到其定義域，由定義域為欄位提供資料類型。它會設定資料表和欄位的[邏輯名稱](../guide/guides/logical-names.md)，而字典會像在編輯器中一樣依這些邏輯名稱產生物理名稱，不過手動撰寫的物理名稱除非是空的，否則會保留。它會新增、變更和移除定義域、詞彙和術語，並在詞彙或術語變更後，為一個欄位、一個資料表或整份文件重新產生物理名稱。它會列出此索引標籤的 `Checks` 工作表所找出的問題：禁用詞、未登錄的詞彙和同義詞；同一個字典中兩列共用的名稱；指向文件未列出之定義域的連結；與其術語所提供之名稱不同的物理名稱；以及偏離其定義域資料類型的欄位。請參閱[字典](./tools.md#dictionaries)和[字典檢查](./tools.md#dictionary-checks)。
- 以從 SQL DDL、GraphQL SDL、DBML 或 AML 剖析出的結構描述，或以另一個 `.erd.json` 文件取代該文件。也可以像編輯器的 [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) 一樣，將該結構描述或文件加到圖表下方，並保留原有的所有內容。無論哪種方式，DBML 的 `TableGroup` 都會成為資料表群組。取代該文件的結構描述會保留文件的字典，取代該文件的文件會帶入其自身的字典，而加入則不會帶入任何字典。請參閱[匯入](./tools.md#import)。
- 以 id 清單、完整實體，或儲存時寫出的 `.erd.json` 文字讀回圖表，其中包含其邏輯名稱和字典列。也可以將其讀取為八種資料庫中任一種的 DDL，DDL 可使用「[結構描述 SQL](../guide/guides/schema-sql.md)」索引標籤的 `Statements` 和 `Header` 選項，以及其 [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) 開關。在包含數千個資料表的結構描述上，它一次讀取一頁、幾個資料表，或幾個資料表群組中的資料表。請參閱[讀取文件](./tools.md#reading-a-document)。
- 設定資料庫、資料庫名稱，以及結構描述 SQL 中寫在資料表之前和之後的[指令碼](../guide/guides/schema-sql.md#before-and-after-scripts)，例如寫在資料表之前的 `CREATE EXTENSION` 或寫在資料表之後的 `GRANT`。`erd_read` 可單獨提供這些指令碼，也可在整份文件的 DDL 中提供。請參閱[設定](./tools.md#settings)。
- 將多次編輯當作一次執行，全部套用或完全不套用，且一次復原即可還原。請參閱 [erd_batch](./tools.md#erd_batch)。
- 復原與重做它自己的編輯，絕不包括您的編輯。

它不會做的事：

- 縮放、捲動或切換索引標籤。這些由每位檢視者各自控制，因此沒有任何工具會這麼做。取代文件的匯入仍會移動檢視，即使 `Viewport` 已鎖定也一樣，與編輯器的 `Import` 相同：回到畫布的起點並恢復為 100%；若使用 `erd_import_json`，則移到其所載入文件的檢視，且除非該文件鎖定了 `Canvas Type`，否則也會切換到該文件的索引標籤。請參閱[匯入](./tools.md#import)。
- 在 `Physical Names`、`Logical Names` 和 `Both Names` 之間切換[名稱顯示](../guide/guides/logical-names.md#switching-the-view)。其[鎖定](../guide/guides/settings.md#lock)開啟期間（新圖表即是如此），它由每位檢視者各自控制；鎖定關閉後，則由您在編輯器中選擇，因此沒有任何工具會這麼做。無論顯示方式為何，代理程式都會讀取和寫入邏輯名稱。取代文件的 `erd_import_json`，只有在其所載入的文件關閉了 `Name View` 鎖定時，才會帶入該文件的「名稱顯示」。
- 變更 [`View Option`](../guide/guides/table-related-functions.md#table-view-options)、程式碼產生器的語言與名稱大小寫、引號類型，或「[設定](../guide/guides/settings.md)」索引標籤的 `Relationship DataType Sync`、`Maximum comment width` 和 `Column Order`。這些由您在編輯器中設定，代理程式讀取的是檔案所儲存的值。
- 開啟或關閉[鎖定](../guide/guides/settings.md#lock)。只有以 `erd_import_json` 取代整份文件時，才會將鎖定或上述設定變更為其所載入文件中的值。沒有 `lockSettings` 屬性的文件（例如 `4.0.0` 之前的 VS Code 擴充功能，或 `1.0.0` 之前的 Obsidian 或 JetBrains 外掛程式所儲存的檔案）會開啟所有鎖定。復原任何取代了文件的匯入，都會恢復文件先前的設定與鎖定。
- 像 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) 那樣將關聯重新對應到其他欄位上。代理程式改為移除該關聯（其外鍵欄位會留在原處），再以 `erd_link_columns` 連結它想要的欄位，這些都在一個 `erd_batch` 中完成，一次復原即可還原。
- 像[字典](../guide/guides/dictionary.md)索引標籤那樣以 CSV 匯入或匯出字典、排序工作表，或在某列的上方或下方插入列。代理程式會新增、變更和移除列（可在一個 `erd_batch` 中一次處理多列），新的列會加在其工作表的末端。
- 執行程式碼產生器。`erd_read` 會傳回 DDL 或 JSON，代理程式會據此自行撰寫程式碼。

## 運作方式 {#how-it-works}

伺服器是由您的 MCP 用戶端啟動的 stdio 處理程序。
每次呼叫時，它都會尋找持有該文件的編輯器：VS Code 視窗、Obsidian 儲存庫視窗或 JetBrains IDE，且各自裝有 ERD Editor 擴充功能或外掛程式。

- **即時**：某個編輯器的工作區、儲存庫或其中一個開啟的專案包含該文件，或該編輯器已開啟該文件。伺服器會加入該編輯器的編輯工作階段，編輯會套用到編輯器中：在 VS Code 中為未儲存，在 Obsidian 和 JetBrains IDE 中則會像您自己的編輯一樣被儲存。
- **無介面**：沒有編輯器。伺服器會載入檔案、套用編輯，然後將檔案寫回。
- **拒絕**：某個編輯器持有該文件，但其 hub 已關閉。伺服器會從磁碟讀取，但不寫入任何內容，因為開啟的編輯器下次儲存時可能會覆寫該檔案。hub 已開啟的 JetBrains IDE 也會拒絕變更僅由其不信任的專案所持有的文件，不過代理程式仍可讀取該文件。當編輯器的 hub 已開啟，但其 ERD Editor 擴充功能或外掛程式使用的 hub 協定與伺服器不同時，針對該文件的每次呼叫都會被拒絕（包括讀取），並傳回 `protocolMismatch` 和一則指出需要更新哪一方的訊息，請參閱[更新](./installation.md#updating)。

詳細內容請參閱[即時與無介面](./live-and-headless.md)。

## 系統需求 {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` 或更新版本，用於執行伺服器 |
| MCP 用戶端 | Claude Code、Codex，或任何能啟動 stdio 伺服器的用戶端 |
| VS Code（用於即時編輯） | `1.101.0` 或更新版本，並搭配 `4.0.0` 或更新版本的 ERD Editor 擴充功能 |
| Obsidian（用於即時編輯） | `1.5.7` 或更新版本的桌面應用程式，並搭配 `1.0.0` 或更新版本的 ERD Editor 外掛程式 |
| JetBrains IDE（用於即時編輯） | `2025.2` 或更新版本且以 IntelliJ 為基礎的 IDE，並搭配 `1.0.0` 或更新版本的 ERD Editor 外掛程式 |

伺服器 `1.0.0` 或更新版本和上述版本使用 hub 協定 2。
為代理程式提供服務的較早版本使用協定 1：`3.0.0` 到 `3.1.0` 的 VS Code 擴充功能、`0.1.0` 和 `0.2.0` 的 Obsidian 外掛程式，以及 `0.9.0` 和 `0.10.0` 的 JetBrains 外掛程式。
這類版本與伺服器 `1.0.0` 或更新版本會互相拒絕，較早的伺服器與上述版本也是如此，請參閱[更新](./installation.md#updating)。
`3.0.0` 之前的 VS Code 擴充功能或 `0.9.0` 之前的 JetBrains 外掛程式沒有 hub，因此伺服器看不到它們，而會編輯磁碟上的檔案，即使圖表已在其中開啟也一樣。

用於邏輯名稱、定義域和字典的工具需要伺服器 `1.1.0` 或更新版本，且在文件開啟的任何地方，至少需要 `4.2.0` 的 VS Code 擴充功能，或 `1.2.0` 的 Obsidian 或 JetBrains 外掛程式。
在上述版本中，`4.2.0` 之前的擴充功能或 `1.2.0` 之前的外掛程式因為使用協定 2，仍可讓代理程式即時編輯，但會忽略代理程式寫入的邏輯名稱、定義域連結和字典列，並在儲存檔案時將其省略。
編輯磁碟上檔案的 `1.1.0` 之前的伺服器，寫回檔案時不會包含其邏輯名稱、定義域連結和字典列，請參閱[更新](./installation.md#updating)。

下一步：[安裝](./installation.md)。
