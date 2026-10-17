---
sidebar_position: 1
description: 從歡迎畫面開始，並透過畫布的右鍵選單、畫布工具列或快速鍵建立資料表、備忘錄、資料表群組和關聯。
---

# 開始編輯

編輯從按滑鼠右鍵開啟的右鍵選單開始。

![在畫布上按滑鼠右鍵、開啟 Relationship 子選單、新增資料表，然後開啟該資料表本身的選單](/img/demo-context-menu.webp)

在資料表、備忘錄、資料表群組或關聯上按滑鼠右鍵，則會改為開啟該項目本身的選單。  
在已選取的資料表、備忘錄或資料表群組上按滑鼠右鍵時，會保留整個選取範圍，因此 `Color` 和 `Delete selected` 等項目會作用於所有選取的項目，請參閱[多重選取](./table-related-functions.md#multiple-selection)。

## 歡迎畫面 {#welcome-screen}

在網頁應用程式、Google Drive、VS Code、Obsidian 和 JetBrains IDE 中，空白的圖表開啟時，ERD 畫布上方會覆蓋一層歡迎畫面。在您自己的網頁中使用的 `<erd-editor>`，只有在網頁使用 [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen) 將其開啟時才會顯示歡迎畫面。  
圖表中沒有任何資料表、沒有顯示中的備忘錄，也沒有顯示中的資料表群組時，就視為空白，因此以檢視選項隱藏的備忘錄和群組不計算在內。圖表中一旦出現其中任何一項，歡迎畫面就會消失；每當圖表再次變為空白時，歡迎畫面又會重新出現，例如刪除最後一個資料表之後，或復原新增第一個資料表的操作之後。  
在唯讀編輯器中、禪模式下、「資料表屬性」開啟期間，以及差異檢視器、自動版面配置預覽或時光旅行接管畫布期間，都不會顯示歡迎畫面。

![空白圖表上的歡迎畫面：開啟 Import 的格式、以 Esc 返回、以 New Table 新增資料表，然後以 ⌘ + Z 讓歡迎畫面重新出現](/img/demo-welcome-screen.webp)

標題 `Right-click the canvas for every action.` 下方有一個選單：

- `New Table` 會新增一個資料表，與 `Alt + N` 相同。
- `New Memo` 會新增一個備忘錄，與 `Alt + M` 相同。備忘錄被隱藏期間，選單中不會出現此項目。
- `Import` 會將選單換成 `Back` 以及 `json`、`Schema SQL`、`GraphQL`、`DBML` 和 `AML` 這幾種格式。選擇一種格式後，會要求選擇該格式的檔案，並將其載入以取代空白的圖表，請參閱[匯入或匯出檔案](./file-import-export.md)。`Back` 或 `Escape` 會返回第一層選單。
- `Command Palette` 會開啟[快速搜尋](./quick-search.md)，與 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 相同。
- `Shortcuts` 會開啟設定，並顯示其中的 [`Shortcuts`](./settings.md#shortcuts) 索引標籤。

畫布夠寬時，`New Table`、`New Memo` 和 `Command Palette` 會顯示目前繫結至其命令的按鍵，包括主應用程式重新對應過的按鍵。  
某個項目取得鍵盤焦點後，`↑` 和 `↓` 會在各項目之間移動並在兩端循環，`Home` 和 `End` 會跳至第一個和最後一個項目，`Enter` 或 `Space` 則會按下具有焦點的項目。其他所有快速鍵仍然有效，因此在此處按 `Alt + N` 也會新增資料表。  
只有選單會回應按一下：在歡迎畫面上其他任何位置按下，都會傳到畫布，在畫布上按滑鼠右鍵也會照常開啟右鍵選單。

畫布有足夠空間時，會有手繪箭頭指向：

- 工具列的 `Search` 按鈕：`Search commands and tables`
- `Theme` 和 `Display Language` 按鈕：`Pick a theme and a language`，工具列只顯示其中一個按鈕時，則為 `Pick a theme` 或 `Pick a language`，請參閱[語言與佈景主題](./language-and-theme.md)
- 底部的[畫布工具列](./table-related-functions.md#canvas-toolbar)：`Pan, zoom and draw relationships`

[物件總管](./explorer.md)顯示期間，歡迎畫面只會覆蓋物件總管旁的畫布。  
若箭頭所指的工具列按鈕位於物件總管上方，該箭頭會被省略。`Theme` 和 `Display Language` 的箭頭只有在其兩個按鈕都位於物件總管上方時才會被省略；在此之前，它會指向仍位於畫布上方的那個按鈕。  
箭頭旁沒有空間放置其文字時，文字會改為顯示在箭頭下方。

## 建立資料表 {#table-creation}

透過右鍵選單、[畫布工具列](./table-related-functions.md#canvas-toolbar)上的 `New Table` 按鈕或快速鍵 `Alt + N` 建立資料表。

## 建立備忘錄 {#memo-creation}

透過右鍵選單、畫布工具列的 `New Memo` 按鈕或快速鍵 `Alt + M` 建立備忘錄。  
View Option → `Memos` 關閉期間，備忘錄會被隱藏，任何地方都不會提供 `New Memo`，`Alt + M` 也不會新增備忘錄，請參閱[資料表檢視選項](./table-related-functions.md#table-view-options)。

備忘錄是畫布上的自由文字筆記。在備忘錄的主體中按一下並輸入文字；文字會隨文件一起儲存。  
`Escape` 會關閉備忘錄編輯器，保留已輸入的內容並讓備忘錄保持選取狀態，再按一次 `Escape` 則會清除選取範圍。  
拖曳其邊框即可調整大小。標題列中的 `x` 會在指標停留在備忘錄上時顯示，可用來刪除備忘錄。  
在備忘錄上按滑鼠右鍵會開啟其選單，而不是編輯器：`Color`、`Remove color`（在某個選取的項目設有顏色時出現）和 `Delete`（當此備忘錄是兩個以上的選取項目之一時，會顯示為 `Delete selected`）。選取的備忘錄也可以使用刪除資料表的按鍵刪除，請參閱[刪除資料表與備忘錄](./table-related-functions.md#table-and-memo-deletion)。

![使用 Alt + M 新增備忘錄、輸入筆記，並拖曳其邊框調整大小](/img/demo-memo.webp)

## 建立資料表群組 {#table-group-creation}

資料表群組是容納資料表的方框，可以為其設定名稱和顏色。以下列兩種方式之一建立群組：

- 從右鍵選單或快速搜尋中選擇 `New Table Group`、按一下[畫布工具列](./table-related-functions.md#canvas-toolbar)上的 `New Table Group` 按鈕，或按 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac)，然後在畫布上拖曳出一個方框。中心位於方框內的每個資料表都會加入新群組，已屬於其他群組的資料表除外，請參閱[繪製群組](./table-groups.md#drawing-a-group)。
- 選取資料表，然後從資料表的右鍵選單中選擇 `Group selected tables`、從快速搜尋中選擇 `Group Selected Tables`，或先按 `T` 再按 `G`，請參閱[將所選資料表組成群組](./table-groups.md#grouping-selected-tables)。

命名、設定顏色、移動、調整大小等其餘操作，都在[資料表群組](./table-groups.md)中說明。

## 建立關聯 {#relationship-creation}

透過右鍵選單、畫布底部的[畫布工具列](./table-related-functions.md#canvas-toolbar)或快速鍵開始建立關聯。每種關聯類型各有其快速鍵：

- Zero One：`Ctrl + Alt + 1` (Windows/Linux) 或 `⌘ + ⌥ + 1` (Mac)
- Zero N：`Ctrl + Alt + 2` (Windows/Linux) 或 `⌘ + ⌥ + 2` (Mac)
- One Only：`Ctrl + Alt + 3` (Windows/Linux) 或 `⌘ + ⌥ + 3` (Mac)
- One N：`Ctrl + Alt + 4` (Windows/Linux) 或 `⌘ + ⌥ + 4` (Mac)

進入某種類型的繪製狀態後，游標會隨之改變。先按一下父資料表，再按一下子資料表。  
父資料表沒有主鍵時會為其加入主鍵，而父資料表的每個主鍵欄位，都會在子資料表上產生一個具有相同資料類型、預設值和註解的 `Not Null` 外鍵欄位。  
serial 鍵是例外：其外鍵會採用該 serial 所儲存的整數類型，例如 `serial4` 對應 `integer`，請參閱[識別關聯](./relationship-editing.md#identifying-relationships)。  
每個外鍵欄位都以其鍵命名：像 `id` 這樣只有一個單字的名稱，前面會加上父資料表的名稱（`user_id`），像 `member_id` 這樣由多個單字組成的名稱會保持不變，子資料表已有的名稱則會加上編號（`user_id_2`），請參閱[外鍵欄位名稱](./relationship-editing.md#foreign-key-column-names)。  
在同一個資料表上按一下兩次，會繪製自我參照關聯。  
新關聯的 `On Delete` 和 `On Update` 一開始都是 `Not set`；從關聯的右鍵選單即可變更，請參閱 [ON DELETE 與 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
按 `Escape` 或再按一次相同的快速鍵即可取消。取消時選取範圍會保持不變，再按一次 `Escape` 才會將其清除。

選定父資料表後，將指標指向可作為關聯終點的資料表時，會以外框標示該資料表，並在其旁邊顯示兩個按鈕：

- `Create new columns`（`+`）會以新的外鍵欄位繪製關聯，與按一下該資料表相同。
- `Map to existing columns`（連結圖示）會結束繪製，並為這兩個資料表開啟「[對應欄位](./relationship-editing.md#map-columns)」，讓關聯可以使用子資料表已有的欄位。在按一下 `Map` 之前，不會寫入任何內容。

指標從按一下父資料表的位置移開一小段距離後，父資料表旁也會顯示這兩個按鈕，因此自我參照關聯也可以對應到現有的欄位。  
手指無法懸停，因此以手指繪製時，這兩個按鈕永遠不會顯示，點一下子資料表就會立即繪製關聯；觸控筆則會像滑鼠一樣顯示這兩個按鈕。  
若到達子資料表時父資料表已失去其主鍵，例如因為復原或協作者的編輯，`Create new columns` 會變暗並顯示工具提示 `<parent> has no primary key to copy`，此時按一下子資料表會結束繪製，而不會繪製任何內容。

![使用 ⌘ + ⌥ + 4 繪製 One N 關聯，再從畫布工具列繪製 Zero N 關聯，子資料表以外框標示，旁邊顯示其 Map to existing columns 和 Create new columns 按鈕](/img/demo-relationship.webp)

## 建立資料表與備忘錄的副本 {#duplicating-tables-and-memos}

現有的資料表和備忘錄可以透過複製、貼上，以及按住 `Alt` 拖曳來建立副本，請參閱[資料表相關功能](./table-related-functions.md#copyingpasting-tables-and-memos)。
