---
sidebar_position: 3
description: 新增、選取、重新排序與刪除欄位，切換欄位選項，以及複製或貼上欄位。
---

# 編輯資料表

編輯資料表基本上提供類似 Excel 的編輯體驗。  
按 `Enter` 或按兩下儲存格即可進入編輯模式。  
`Enter` 或 `Escape` 會結束編輯模式。輸入的內容會在輸入的同時套用，因此 `Escape` 會保留文字，而不會將其還原。  
`Escape` 會讓儲存格保持焦點、資料表保持選取，再按一次 `Escape` 則會同時清除兩者。  
輸入法仍在組字時，`Escape` 會讓編輯模式保持開啟。

![以 Alt + N 新增資料表並填入兩個欄位](/img/demo-table-edit.webp)

## 新增欄位 {#adding-columns}

使用快速鍵 `Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 建立。  
每個選取的資料表都會新增一個欄位。

## Tab 鍵 {#tab-key}

按 `Tab` 即可直接進入下一個儲存格的編輯模式。  
在最後一個儲存格按 `Tab` 會建立新的欄位。  
使用 `Shift + Tab` 即可移至上一個儲存格的編輯模式。  
繪製在列的最後一個儲存格之後的[替代鍵](./table-related-functions.md#alternate-keys)標記不是儲存格，因此鍵盤焦點會略過它們，它們也永遠不會進入編輯模式。

![以 Tab 在一列的儲存格之間移動、在最後一個儲存格新增欄位，以及以 Shift + Tab 返回](/img/demo-table-tab.webp)

## 資料類型自動完成 {#datatype-autocomplete}

開始編輯 `DataType` 儲存格並輸入。所選資料庫中相符的類型會顯示為建議，建議中字面上包含所輸入內容的部分會醒目顯示。  
比對本身是模糊比對，因此 `vch` 也能找到 `VARCHAR`。

- `Arrow Up` 或 `Arrow Down`：在建議之間移動
- `Arrow Right`、`Tab` 或 `Enter`：接受醒目顯示的建議
- `Arrow Left`：回到所輸入的文字

也可以按一下建議。  
清單一次最多顯示十個建議，其餘的需捲動查看。  
建議不具強制性，因此可以自由輸入清單中沒有的類型，包括引數，例如 `VARCHAR(255)`。輸入的內容一旦超出完整的類型名稱（例如 `VARCHAR(255)` 或 `BIGINT UNSIGNED`），清單就會關閉。  
建議會依所選的資料庫而定。變更資料庫會改變提供的建議，現有的欄位則保持不變。

![以方向鍵、Tab 和 Enter 從模糊比對的建議填入 DataType 儲存格](/img/demo-data-type-autocomplete.webp)

## Not Null、Unique、Auto Increment {#not-null-unique-auto-increment}

這三個儲存格是切換按鈕，而不是文字。  
按兩下其中一個，或在其具有焦點時按 `Enter`，即可切換。

Not Null 儲存格在設定時顯示 `N-N`，未設定時顯示 `NULL`。  
`UQ` 和 `AI` 關閉時會淡化顯示，開啟時會醒目顯示。

![以按兩下切換 Not Null，以 Enter 切換 Unique 和 Auto Increment](/img/demo-column-options.webp)

被[資料表檢視選項](./table-related-functions.md)隱藏的儲存格無法切換。

## 選取多個欄位 {#selecting-multiple-columns}

支援五種方式：

- `Shift + Arrow Up/Down`：一次將選取範圍擴展一列
- `Ctrl + click` (Windows/Linux) 或 `⌘ + click` (Mac)：加入單一欄位
- `Shift + click`：選取從上一個焦點欄位開始的範圍
- `Ctrl + Shift + click` (Windows/Linux) 或 `⌘ + Shift + click` (Mac)：將該範圍加入選取範圍
- `Alt + A` (Windows/Linux) 或 `⌥ + A` (Mac)：全選

![以 Shift + Arrow Down、Ctrl/⌘ + click、Shift + click 和 Alt + A 選取欄位](/img/demo-column-select.webp)

在欄位的列上按滑鼠右鍵，會決定資料表右鍵選單作用於哪些欄位，無論按住的是哪個輔助按鍵。  
在已選取的列上，選取範圍會保留，焦點則會移至該列。在其他任何列上，則只會選取該列。這適用於列上的任何位置，包括鑰匙圖示和[替代鍵](./table-related-functions.md#alternate-keys)標記。  
因此，若要像[欄位主鍵](#column-primary-key)或[刪除欄位](#column-deletion)那樣從選單對多個欄位執行操作，在其中一個已選取的列上按滑鼠右鍵即可。  
在 Mac 上，`Ctrl + click` 也會開啟選單，但它會被視為一般的按一下，因此在儲存格上使用時，它會在選單開啟前只選取該列。

## 重新排列與移動欄位 {#rearranging-and-moving-columns}

透過 `dragging` 運作，也能移動到其他資料表。  
拖曳中的列會跟著指標移動，放置點周圍的列會向旁邊滑開以騰出空間。  
放在資料表最後一列的正下方，即可將欄位移到該資料表的末端。沒有任何欄位的資料表，在其上任何位置皆可放置。

![將欄位拖曳到新位置，再拖曳到另一個資料表中](/img/demo-column-move.webp)

支援使用 `Ctrl + drag` (Windows/Linux) 或 `⌘ + drag` (Mac) 移動多個欄位。

![選取三個欄位，並以 Ctrl/⌘ + drag 將其移到另一個資料表中](/img/demo-column-multi-move.webp)

## 刪除欄位 {#column-deletion}

刪除焦點資料表中選取的欄位。按一下儲存格會選取其所屬的欄位，因此按一下儲存格再按 `Delete`，即可移除這一個欄位。  
快速鍵：

- `Delete` 或 `Backspace`（在 Mac 上為 `⌫`）。當欄位所屬的資料表是唯一選取的項目時，這兩個按鍵會移除選取的欄位。未選取任何欄位（焦點位於資料表名稱或註解上）、同時也選取了其他項目，或在縮放比例為 `70%` 或更低、資料表只顯示名稱時，它們會改為移除整個選取範圍，請參閱[刪除資料表與備忘錄](./table-related-functions.md#table-and-memo-deletion)。
- `Alt + Backspace` 或 `Alt + Delete` (Windows/Linux)，`⌥ + ⌫` 或 `⌥ + Delete` (Mac)。即使同時也選取了其他資料表或備忘錄，這些按鍵也會移除焦點資料表中選取的欄位。在編輯儲存格時，或縮放比例為 `70%` 或更低時，它們不會移除任何內容。

![以 Alt + Backspace 刪除一個欄位，再刪除兩個選取的欄位](/img/demo-column-remove.webp)

資料表的右鍵選單也有相同的作用。在該資料表是唯一選取的項目時，在欄位的列上按滑鼠右鍵：選單的最後一個項目會顯示 `Delete column`，若該列是兩個或更多已選取欄位的其中之一，則會顯示 `Delete columns`。

在編輯儲存格時，`Delete` 和 `Backspace` 只會清除文字。在儲存格編輯器之外按住不放時，它們只會移除一次。  
移除之後，焦點會移至原焦點欄位上方最近的剩餘欄位。上方沒有剩餘的欄位時，即使下方仍有欄位，焦點也會移至資料表名稱，因此下一次按 `Delete` 或 `Backspace` 會移除資料表，而不是欄位。  
使用了被移除欄位的關聯和索引會一併移除。不會要求確認，整個移除操作算作一個復原步驟。

## 複製/貼上欄位 {#copyingpasting-columns}

運作方式如同以表格為基礎的剪貼簿。  
快速鍵：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

複製到試算表、從試算表貼上，以及貼上到欄位儲存格具有焦點的資料表時，會使用資料表所顯示的儲存格，並依其顯示的順序排列，請參閱[資料表檢視選項](./table-related-functions.md#table-view-options)和[調整欄位順序](./settings.md#adjusting-column-order)。  
在編輯器中複製的欄位，在選取表頭時貼上，或貼上到其他選取的資料表中時，會帶有所複製欄位的每個儲存格，包括 Unique 和 Auto Increment 等隱藏的儲存格。  
`AK1.1` 這類[替代鍵](./table-related-functions.md#alternate-keys)標記不是儲存格，因此即使它們正在顯示，複製與貼上也會將其省略。

可以從編輯器貼上到 Excel，也可以從 Excel 貼回編輯器。  
儲存格的值會完全依照輸入的內容複製出去，因此 `<label>` 或 `a &amp; b` 這類的值會原封不動地進入試算表或文件。  
試算表的欄位是依位置而不是依名稱對應到可見的儲存格，因此工作表中欄位的順序必須與這些儲存格的順序一致。  
對於下列欄位，以下任一值都會被讀取為 true（不區分大小寫）：

- AutoIncrement：`TRUE`、`1`、`YES`、`Y`
- Unique：`TRUE`、`1`、`YES`、`Y`
- Not Null：`TRUE`、`1`、`YES`、`Y`、`NOT NULL`

複製出去時，編輯器會為 AutoIncrement 和 Unique 寫入 `TRUE` 或 `FALSE`，為 Not Null 寫入 `NOT NULL` 或 `NULL`。  
Unique 和 Auto Increment 預設為隱藏，因此只有在顯示這些儲存格之後，才會寫入與讀取 `TRUE` 和 `FALSE`。

![將四個欄位貼上到試算表，旗標寫為 TRUE/FALSE 和 NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![將試算表的三列以欄位的形式貼上到資料表，YES、1 和 NOT NULL 讀取為 true](/img/demo-copy-sheet-column.webp)

貼上的位置取決於焦點：

- 選取表頭時，貼上的列會作為新欄位加入每個選取的資料表。
- 欄位儲存格具有焦點時，該資料表中選取的列，以及其中最後一列下方的列，會依序被覆寫，數量與貼上的列數相同。分開的選取範圍之間的列會被略過。被覆寫的列會在可見的儲存格中套用貼上的值，並保留隱藏的儲存格，剩餘的列則會作為新欄位加入。其他每個選取的資料表都會將貼上的列作為新欄位加入。

![複製兩個欄位，並一次貼上到兩個選取的資料表](/img/demo-copy-column-multi.webp)

## 複製/貼上資料表與備忘錄 {#copyingpasting-tables-and-memos}

焦點資料表中未選取任何欄位時，相同的快速鍵會複製選取的資料表與備忘錄本身，請參閱[資料表相關功能](./table-related-functions.md)。

## 欄位主鍵 {#column-primary-key}

切換焦點欄位的主鍵，焦點欄位即焦點儲存格所屬的欄位。  
當焦點欄位是兩個或更多已選取欄位的其中之一時，切換會套用到所有選取的欄位：只要其中有任何一個不是鍵，全部都會變成鍵；如果全部都已經是鍵，則全部都會被清除。選取範圍以外的欄位不受影響。  
使用資料表的右鍵選單，或快速鍵 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)。當切換涉及兩個或更多欄位時，選單項目會顯示 `Primary Key on selected columns`，而不是 `Primary Key`。  
列中的鑰匙圖示僅供顯示，因此按一下它並不會設定鍵。

若要將多個欄位設為一個複合鍵，先[選取這些欄位](#selecting-multiple-columns)，然後按 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，或在其中一個已選取的列上按滑鼠右鍵並選擇 `Primary Key on selected columns`。每次切換都算作一個復原步驟。

![以 Shift + Arrow Down 選取兩個欄位，接著以 ⌥ + K 將兩者都設為主鍵，再按一次將兩者都清除](/img/demo-column-pk.webp)
