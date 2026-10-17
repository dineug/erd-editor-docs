---
sidebar_position: 14
description: 關聯資料類型同步、註解寬度上限、重新計算資料表寬度、設定鎖定（檢視、索引標籤和程式碼設定）、欄位顯示順序和快速鍵清單。
---

# 設定

使用工具列中的 `Settings` 按鈕開啟，或從[快速搜尋](./quick-search.md)的 `Tab` 下開啟。
「設定」畫面有兩個索引標籤：`Preferences` 和 `Shortcuts`。一開始會開啟 `Preferences`，但從[歡迎畫面](./editing-start.md#welcome-screen)的 `Shortcuts` 列開啟時，會開啟 `Shortcuts`。

佈景主題和顯示語言不在此畫面中。它們由工具列的 `Theme` 和 `Display Language` 按鈕開啟，請參閱[語言與佈景主題](./language-and-theme.md)。

## 關聯資料類型同步 {#relationship-datatype-sync}

決定是否同步資料類型。預設為開啟。
開啟時，變更某個欄位的資料類型，會將該類型套用到透過關聯與其相連的每個欄位，並從兩端沿著關聯鏈傳遞，因此外鍵永遠不會與其所參照的鍵產生差異。
從鍵傳到其外鍵時，serial 類型會以其所儲存的整數類型傳遞，與繪製關聯時相同，請參閱[識別關聯](./relationship-editing.md#identifying-relationships)。因此，在 PostgreSQL 下將鍵變更為 `serial` 時，其外鍵會得到 `integer`，變更再從那裡沿著關聯鏈繼續往下傳遞。
從外鍵反向傳回其鍵時，類型會依其寫法原樣傳遞，但 serial 鍵會保留其類型，變更也就此停止。
「[對應欄位](./relationship-editing.md#map-columns)」也遵循此設定：此設定開啟期間，它所對應的每個現有欄位都會採用其父鍵賦予外鍵的類型，且此變更會如上所述沿著關聯繼續傳遞。此設定關閉期間，或鍵沒有資料類型時，該欄位會保留自身的類型。

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="關聯資料類型同步設定" loading="lazy" />

![將 members.id 變更為 BIGINT UNSIGNED，透過關聯與其相連的每個 member_id 隨之更新](/img/demo-relationship-data-type-sync.webp)

## 註解寬度上限 {#maximum-comment-width}

以像素為單位指定註解欄位的寬度上限（`60` ~ `200`）。
關閉開關會取消限制，且開關關閉期間，輸入框會停用。
開啟時會從 `60px` 開始。輸入超出範圍的值時，會被限制為最接近的端點值。

![開啟 Maximum comment width 並輸入 120，ERD 索引標籤中的註解隨之截斷為該寬度](/img/demo-settings-comment-width.webp)

## 重新計算資料表寬度 {#recalculation-table-width}

按 `Sync` 即可依目前的文字重新計算每個資料表和欄位儲存格的寬度，並依新的大小重新繪製關聯連接線。
完成後會顯示 `Recalculated table width` 快顯通知加以確認。
每次載入文件時，寬度都會自動重新計算，因此只有在字型或轉譯方式的變更使寬度不再正確時，才需要執行此操作。
寬度不會儲存在檔案中，因此 `Sync` 永遠不會變更檔案。

## 鎖定 {#lock}

`Lock` 清單包含六項設定。某項設定的鎖定開啟期間，檔案會保留鎖定時的值，因此在畫面上變更該設定時，檔案會保持原樣。

| 列 | 檔案保留的內容 | 新圖表中的值 |
| --- | --- | --- |
| `Viewport` | ERD 畫布的縮放比例和檢視位置，兩者共用一個鎖定 | `100% · 0, 0` |
| `Canvas Type` | 圖表開啟時所在的索引標籤：`ERD`、`Visualization`、`Schema SQL` 或 `Code Generator` | `ERD` |
| `Language` | [程式碼產生器](./code-generator.md#language)的語言 | `GraphQL` |
| `Table Name Case` | 程式碼產生器的[資料表名稱大小寫](./code-generator.md#name-case) | `Pascal` |
| `Column Name Case` | 程式碼產生器的[欄位名稱大小寫](./code-generator.md#name-case) | `Camel` |
| `Bracket Type` | 「[結構描述 SQL](./schema-sql.md#database-and-bracket)」索引標籤以及提供此選項的[程式碼產生器](./code-generator.md#bracket)目標所使用的 `Bracket` | `None` |

每一列都會顯示一個值和一個鎖定按鈕，按一下該按鈕即可開啟或關閉該列的鎖定。
鎖定開啟期間，按鈕會顯示上鎖的鎖頭，並帶有工具提示 `Unlock Viewport`（其他各列依此類推），而帶有工具提示 `Locked value` 的值，就是檔案保留的值。
鎖定關閉期間，按鈕會顯示打開的鎖頭，並帶有工具提示 `Lock Viewport`，而以淡色顯示、帶有工具提示 `Current value` 的值，則是該設定目前的狀態。
`Viewport` 會依序顯示縮放比例和檢視位置，例如 `75% · -40, 91`。檢視位置是圖表的 `0, 0` 在畫面上所在的點，以像素為單位，一千以上的座標會以縮寫顯示，例如 `1.2k` 或 `-24k`。

鎖定時，會採用該設定在當下的狀態。
鎖定開啟期間，該設定在畫面上仍照常運作：可以捲動和縮放、切換索引標籤，以及從選單、選項面板或快速搜尋中選擇其他語言、名稱大小寫或引號。
不過，檔案會保留鎖定的值，該列也會持續顯示此值，因此重新開啟圖表時，會回到鎖定的檢視和鎖定的索引標籤，並使用鎖定的語言、名稱大小寫和引號。JSON 匯出寫入的也是鎖定的值。
關閉鎖定即可儲存畫面上顯示的內容，此後檔案會依循該設定：`Viewport` 關閉時，圖表會在上次離開時的位置開啟。若要改為鎖定新的值，例如新的起始檢視，先關閉鎖定再重新開啟即可。
若檔案開啟時，鎖定的檢視中看不到圖表的任何部分，畫面仍會移到圖表上，而鎖定的值則維持不變。
`Canvas Type` 永遠不會保留「設定」索引標籤。開啟此鎖定時，會鎖定最後所在的其他索引標籤，而在其關閉期間，該列會顯示該索引標籤的名稱。

![解除鎖定 Viewport、捲動並縮放圖表，再以其列所顯示的新檢視重新鎖定](/img/demo-settings-locks.webp)

開啟或關閉鎖定會變更檔案，因為檔案會儲存哪些鎖定是開啟的；但與「設定」索引標籤中的其他項目一樣，這項操作不會記錄在[復原歷程記錄](./undo-redo.md#what-the-history-records)中。在唯讀編輯器中，鎖定按鈕不會有任何作用。
其他所有設定都會依目前狀態儲存：資料庫、[`View Option`](./table-related-functions.md#table-view-options) 的切換按鈕，以及 `Preferences` 索引標籤中的其餘設定。

新圖表（也就是從無到有建立的圖表）的所有鎖定都是開啟的：在 VS Code、Obsidian 或 JetBrains IDE 中開啟的空白檔案（Obsidian 的 `ERD Editor: Create new diagram` 和 `New ERD` 會建立這種檔案）、網頁應用程式中的新結構描述、從 Google Drive 的 New 選單建立的檔案，或未被賦予值的 `<erd-editor>`。
網頁應用程式透過匯入 SQL、DBML、AML 或 GraphQL 檔案所建立的結構描述或 Google Drive 檔案，一開始也是所有鎖定都開啟。從 JSON 檔案建立的則會保留該檔案所記錄的鎖定。
開啟的檔案會保留其儲存時的鎖定，每個鎖定都維持其鎖定的值。
未記錄任何鎖定的檔案（例如由鎖定功能推出之前的版本所儲存，或手動撰寫的檔案）開啟時，所有鎖定都是開啟的：無論其儲存的是哪種檢視和哪個索引標籤，檢視都為 `100% · 0, 0`、索引標籤都為 `ERD`，而其語言、名稱大小寫和引號類型則依其儲存的值鎖定。
取代圖表的 `Import` 也會設定鎖定：JSON 檔案會帶入其所記錄的鎖定及其保存的值，而 SQL、DBML、AML 或 GraphQL 檔案則會保留現有的鎖定，但無論是否鎖定，都會將檢視恢復為 `100% · 0, 0`，請參閱[匯入外部檔案](./file-import-export.md#importing-external-files)。復原該次匯入時，會還原被它取代的鎖定和鎖定的值。

被鎖定排除在檔案之外的變更不算作變更。VS Code 不會將分頁標示為已修改，而 Obsidian 和 JetBrains IDE 無論是自動儲存時還是分頁關閉時，都會讓檔案保持原樣。
因此，所有鎖定都開啟時，在圖表中四處瀏覽、切換索引標籤，以及嘗試其他語言、名稱大小寫或引號，都永遠不會出現在 `git diff` 中。
`Viewport` 關閉時，捲動和縮放會變更檔案；`Canvas Type` 關閉時，切換索引標籤（包括切換到「設定」索引標籤）也會變更檔案。
新圖表的空白檔案會一直保持空白，直到出現第一個由檔案保留的變更：一次編輯、對不受任何鎖定約束之設定所做的變更，或開啟或關閉某個鎖定。
開啟圖表後未做任何此類變更就關閉，檔案會保持原樣，無論它是由哪個版本或哪台電腦寫入的。檔案只會依固定順序保存圖表本身的內容，而以較舊形式儲存的檔案，會在其第一次發生此類變更時以此形式重寫一次，請參閱[儲存形式與執行階段值](../../api/advanced/schema.md#storage-form-and-runtime-value)。
在 VS Code 中，使用 `Reopen Editor With...` 以圖表形式重新開啟的修訂版本（例如 Git 修訂版本或 Local History 項目）是唯讀的，且永遠不會被標示為已修改。
在 Google Drive 中，無論是否鎖定，捲動、縮放或切換到其他索引標籤都永遠不會單獨儲存。`Viewport` 關閉時，檢視只會隨其他變更一起寫入，因此 Drive 檔案會在上次儲存時的檢視位置開啟；`Canvas Type` 關閉時，索引標籤也是如此。

在[協作工作階段](../../api/advanced/collaborative-editing.md)中，開啟或關閉鎖定會傳達到每個編輯器，而鎖定會保留開啟它的那個編輯器上的值。
關閉 `Language`、某個名稱大小寫或 `Bracket Type` 的鎖定時，每個編輯器都會得到關閉它的那個編輯器上所顯示的值，因此所有編輯器都會儲存同一個值。關閉 `Viewport` 或 `Canvas Type` 的鎖定不會移動任何人的檢視或索引標籤。
透過 MCP 伺服器運作的程式碼代理程式沒有可操作鎖定或其所保存之設定的工具，而它讀取已鎖定的語言、名稱大小寫或引號類型時，得到的是檔案所保留的值。只有它在 `replace` 模式下的匯入會觸及這些內容，就像 `Import` 一樣，請參閱[設定](../../mcp/tools.md#settings)和[匯入](../../mcp/tools.md#import)。

## 調整欄位順序 {#adjusting-column-order}

設定資料表中欄位的顯示順序。
拖曳一列即可移動：整列都可以拖曳，並以拖曳控點圖示標示。依預設順序，這七列分別是 `Name`、`DataType`、`Not Null`、`Unique`、`Auto Increment`、`Default` 和 `Comment`。
被[資料表檢視選項](./table-related-functions.md#table-view-options)隱藏的儲存格仍會保留其在清單中的位置，因此此順序會套用至實際顯示的儲存格。
[替代鍵](./table-related-functions.md#alternate-keys)標記（`AK1.1` 等）不屬於這些列。它在每一列中一律排在最後，位於此順序排在最後的儲存格之後。

![向下捲動到 Column Order，將 Comment 列向上拖曳到 Name 下方，讓每個註解緊接在其欄位名稱之後](/img/demo-settings-column-order.webp)

## 快速鍵 {#shortcuts}

`Shortcuts` 索引標籤是一個由 `Command` 和 `Keybinding` 組成的唯讀表格，列出目前所用平台的按鍵繫結。

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | 先按 `T` 再按 `G` | 先按 `T` 再按 `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

其中大多數只在 ERD 索引標籤中觸發，且在快速搜尋、「資料表屬性」、差異檢視器、自動版面配置預覽、時光旅行、[`Export image`](./file-import-export.md#image) 對話方塊或 [`Map Columns`](./relationship-editing.md#map-columns) 開啟期間會暫時停用。
`Search`、`Toggle Explorer` 和 `Stop` 是例外：`Search` 可在任何索引標籤中切換快速搜尋，`Toggle Explorer` 可在任何索引標籤中開啟[物件總管](./explorer.md#opening-and-closing)並進入其搜尋，同時切換到 ERD 索引標籤，而 `Stop` 則用來關閉快速搜尋、「資料表屬性」、差異檢視器、自動版面配置預覽、時光旅行、`Export image` 對話方塊、`Map Columns`、佈景主題建立器、`Display Language` 選擇器、顏色選擇器和已開啟的右鍵選單。
物件總管在 ERD 索引標籤中開啟且未被禪模式隱藏時，`Toggle Explorer` 會再次將其關閉，與工具列的 `Explorer` 按鈕相同。快速搜尋、「資料表屬性」、佈景主題建立器、`Display Language` 選擇器、`Export image` 對話方塊或 `Map Columns` 開啟時，它會改為關閉該項目，並將鍵盤焦點移至物件總管的搜尋。
正在編輯儲存格、備忘錄或資料表群組的名稱時，`Toggle Explorer` 不會有任何作用。差異檢視器、自動版面配置預覽或時光旅行開啟期間，它會將其按鍵交給瀏覽器或主應用程式處理，請參閱[瀏覽器的尋找列](./find-and-replace.md#the-browsers-find-bar)。
在 ERD 索引標籤中，`Stop` 會結束儲存格或備忘錄的編輯、關閉[資料表群組](./table-groups.md)的名稱輸入框而不重新命名群組，或取消正在繪製的關聯或 `New Table Group`，並保持選取範圍不變。以上皆未開啟時，它會清除選取範圍和焦點儲存格，並在同一次按鍵中關閉已開啟的顏色選擇器。無論哪種情況，已開啟的佈景主題建立器或 `Display Language` 選擇器都會在同一次按鍵中關閉。
開啟中的物件總管、佈景主題建立器或 `Display Language` 選擇器不會讓畫布上的任何快速鍵暫時停用。`Stop` 永遠不會關閉物件總管。關於 `Stop` 和其他按鍵在物件總管中的作用，請參閱[物件總管中的按鍵](./explorer.md#keys-in-the-explorer)；關於在選擇器中的作用，請參閱[選擇語言](./language-and-theme.md#picking-a-language)。
`Delete Selection` 會移除所有選取的資料表、備忘錄和資料表群組；若只選取了一個資料表及其部分欄位，且縮放比例高於 `70%`，則會移除這些欄位，請參閱[刪除資料表與備忘錄](./table-related-functions.md#table-and-memo-deletion)。`Remove Table, Memo` 也會移除選取的資料表群組。
`Add Table Group` 會開始繪製 [`New Table Group`](./table-groups.md#drawing-a-group)，與[畫布工具列](./table-related-functions.md#canvas-toolbar)的 `New Table Group` 按鈕相同，再按一次則會取消繪製。`Group Selected Tables` 是兩次不帶輔助按鍵的按鍵：先按 `T`，並在一秒內再按 `G`。它會將選取的資料表放入新群組並開啟其名稱輸入框，與資料表右鍵選單中的 `Group selected tables` 相同，未選取任何資料表時則不會有任何作用，請參閱[將所選資料表組成群組](./table-groups.md#grouping-selected-tables)。在唯讀編輯器中或群組被[隱藏](./table-groups.md#hiding-groups)期間，兩者都不會有任何作用。
`Zoom In`、`Zoom Out` 和 `Zoom Reset` 也可以縮放「[視覺化](./visualization.md#toolbar)」索引標籤，`Graph` 和 `Flow` 皆適用，但快速搜尋開啟時除外。
在「視覺化」索引標籤中，`Stop` 也會關閉[列顯示](./visualization.md#row-display)選單，並取消仍在執行中的[流程模式版面配置](./visualization.md#how-flow-is-placed)；但它不會讓以 `Focus on this table` 縮小範圍的檢視恢復完整範圍。
`Focus on this table` 會以 `Flow` 開啟「視覺化」索引標籤，並將範圍縮小到選取的資料表以及與其相隔一個關聯的每個資料表，未選取任何資料表時則不會有任何作用，請參閱[聚焦資料表](./visualization.md#focusing-on-tables)。
`Select All Table, Memo`、`Hand Tool`、`Delete Selection` 和 `Group Selected Tables` 會讓位給插入點：編輯儲存格或備忘錄，或在輸入框（例如物件總管的「尋找」輸入框）中輸入時，`Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 會選取文字，`Space` 會輸入空格，`Delete` 和 `Backspace` 會清除文字，而先按 `T` 再按 `G` 則會輸入這兩個字母。
複製和貼上使用瀏覽器本身的 `Ctrl + C` 和 `Ctrl + V` (Windows/Linux) 或 `⌘ + C` 和 `⌘ + V` (Mac)，因此不在此清單中，請參閱[編輯資料表](./table-editing.md)。

無法在此索引標籤中變更按鍵繫結。
嵌入編輯器的主應用程式可以使用 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) 重新對應這些按鍵繫結，但 `Editing`、`Stop`、`Undo`、`Redo`、`Zoom In`、`Zoom Out` 和 `Zoom Reset` 除外，這些是固定的。
此時 `Shortcuts` 索引標籤會列出主應用程式的按鍵繫結：主應用程式未重新對應的命令會保留其預設按鍵，而主應用程式未繫結任何按鍵的命令則不會顯示任何按鍵。

在 Obsidian 中，只要圖表所在的 Obsidian 分頁處於作用中，這些按鍵就會傳到編輯器，即使 Obsidian 的某個快速鍵使用相同的按鍵也是如此，例如 `Alt + Enter`、`Ctrl + K` 和 `Ctrl + F` (Windows/Linux) 或 `⌥ + Enter`、`⌘ + K` 和 `⌘ + F` (Mac)。在該分頁中，其他所有 Obsidian 快速鍵仍然有效。關於 `Ctrl + F` 或 `⌘ + F`，請參閱[瀏覽器的尋找列](./find-and-replace.md#the-browsers-find-bar)。
