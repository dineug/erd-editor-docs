---
sidebar_position: 3
description: 新增、選取、重新排序與刪除欄位，切換欄位選項，以及複製或貼上欄位。
---

# 編輯資料表

編輯資料表基本上提供類似 Excel 的編輯體驗。  
[名稱顯示](./logical-names.md#name-view)決定資料表在其表頭和列中要繪製名稱、邏輯名稱，還是兩者。  
按 `Enter` 或按兩下儲存格即可進入編輯模式。  
`Enter` 或 `Escape` 會結束編輯模式。輸入的內容會在輸入的同時套用，因此 `Escape` 會保留文字，而不會將其還原。[定義域儲存格](./logical-names.md#the-domain-cell)是例外：它只會從清單中選擇，永遠不會保留所輸入的內容。在邏輯名稱已變更的狀態下關閉[邏輯名稱儲存格](./logical-names.md#writing-a-logical-name)時，也可能會填入物理名稱。  
`Escape` 會讓儲存格保持焦點、資料表保持選取，再按一次 `Escape` 則會同時清除兩者。邏輯名稱儲存格顯示其[術語清單](./logical-names.md#completing-term-names)時，第一次按 `Escape` 只會關閉清單。  
輸入法仍在組字時，`Escape` 會讓編輯模式保持開啟。

![以 Alt + N 新增資料表並填入兩個欄位](/img/demo-table-edit.webp)

## 新增欄位 {#adding-columns}

使用快速鍵 `Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 建立，它會為每個選取的資料表新增一個欄位；或使用資料表標題上的 `+` 按鈕，它會為該資料表新增一個。  
新欄位的第一個儲存格會取得焦點，也就是其資料列在[欄位順序](./settings.md#adjusting-column-order)中繪製的第一個儲存格。在預設順序下，那是其名稱，在 `Logical Names` 中即為其邏輯名稱，在 `Both Names` 中則是其 `Logical Name` 儲存格，請參閱[名稱顯示](./logical-names.md#name-view)。  
從最後一個儲存格以 `Tab` 新增的欄位，以及關聯繪製時為沒有主鍵的父資料表新增的主鍵，也都從該儲存格開始。

## Tab 鍵 {#tab-key}

按 `Tab` 即可直接進入下一個儲存格的編輯模式。  
在最後一個儲存格按 `Tab` 會建立新的欄位並開啟其第一個儲存格進行編輯，請參閱[新增欄位](#adding-columns)。  
使用 `Shift + Tab` 即可移至上一個儲存格的編輯模式。  
`Tab` 和 `Shift + Tab` 會依序經過資料表所繪製的儲存格，因此「名稱顯示」和 View Option → `Domain` 會決定其中是否包含邏輯名稱儲存格和定義域儲存格，請參閱[輸入邏輯名稱](./logical-names.md#writing-a-logical-name)。  
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

在連結到定義域的欄位的 `DataType` 儲存格中輸入，或在其中接受建議時，只要欄位的類型與定義域的類型不同，就會立即解除欄位的連結，請參閱[定義域與資料類型](./dictionary.md#domains-and-data-types)。  
在 `Logical Names` 中，View Option → `Domain` 關閉期間，連結到具有名稱的定義域的欄位，其類型儲存格會顯示該定義域的名稱，編輯時會開啟[定義域選擇器](./logical-names.md#the-domain-cell)，而不是這些建議。顯示資料類型的類型儲存格則會如上所述編輯資料類型。

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

若要一起移動選取的欄位，拖曳焦點欄位旁的拖曳控點即可，請參閱[重新排列與移動欄位](#rearranging-and-moving-columns)。

在欄位的列上按滑鼠右鍵，會決定資料表右鍵選單作用於哪些欄位，無論按住的是哪個輔助按鍵。  
在已選取的列上，選取範圍會保留，焦點則會移至該列。在其他任何列上，則只會選取該列。這適用於列上的任何位置，包括鑰匙圖示和[替代鍵](./table-related-functions.md#alternate-keys)標記。  
因此，若要像[欄位主鍵](#column-primary-key)或[刪除欄位](#column-deletion)那樣從選單對多個欄位執行操作，在其中一個已選取的列上按滑鼠右鍵即可。  
在 Mac 上，`Ctrl + click` 也會開啟選單，但它會被視為一般的按一下，因此在儲存格上使用時，它會在選單開啟前只選取該列。

## 重新排列與移動欄位 {#rearranging-and-moving-columns}

欄位是透過其拖曳控點移動的，這是一個帶有拖曳控點圖示的小按鈕，位於資料表左側邊緣的正外側、焦點列的旁邊。  
讓欄位的任一儲存格取得焦點（按一下該儲存格，或使用方向鍵或 `Tab`），拖曳控點就會出現在其所在列的旁邊。焦點位於資料表的表頭時，任何一列都沒有拖曳控點。  
在指標移到拖曳控點上之前，拖曳控點會以淡色繪製，指標移到其上後則會變成手形。只按下不會有任何作用：拖曳會在指標移動後才開始，並可將欄位移到所屬資料表中的其他位置，或移到另一個資料表中。  
在資料表的列上方時，拖曳中的列會移至定位，放置點周圍的列會向旁邊滑開以騰出空間。在畫布空白處上方，或在具有欄位的資料表的表頭上方時，列的半透明副本會跟著指標移動，並依各列在目前的[名稱顯示](./logical-names.md#name-view)下的繪製方式，顯示其名稱儲存格和類型儲存格。  
放在資料表最後一列的正下方，即可將欄位移到該資料表的末端。沒有任何欄位的資料表，在其上任何位置皆可放置。資料表左側緊鄰的長條區域（也就是拖曳控點所在之處）也算作資料表的列，因此沿著拖曳控點直接向下拖曳，指標不必進入資料表即可重新排列欄位。  
移到另一個資料表中的欄位會保留其邏輯名稱和定義域。

![讓欄位取得焦點，並將其所在列旁的拖曳控點拖曳到新位置，再將另一個欄位的拖曳控點拖曳到另一個資料表中](/img/demo-column-move.webp)

若要一次移動多個欄位，先[選取這些欄位](#selecting-multiple-columns)，再拖曳焦點欄位旁的拖曳控點。當焦點欄位是其資料表中兩個或更多已選取欄位的其中之一時，拖曳控點會帶著所有選取的欄位移動；否則只會帶著其自身的欄位。  
不需要任何輔助按鍵。在拖曳控點上按住 `Alt` (Windows/Linux) 或 `⌥` (Mac)，會像一般拖曳一樣移動欄位，不會建立任何副本。

![選取三個欄位，再將焦點欄位旁的拖曳控點拖曳到另一個資料表中，其他選取的欄位也隨之移動](/img/demo-column-multi-move.webp)

從欄位的列上（而不是其拖曳控點上）開始的拖曳，會像在表頭上拖曳一樣移動資料表，請參閱[移動多個資料表](./table-related-functions.md#moving-multiple-tables)。在列上使用 `Alt + drag` (Windows/Linux) 或 `⌥ + drag` (Mac) 會建立資料表的副本，請參閱[建立資料表與備忘錄的副本](./table-related-functions.md#duplicating-tables-and-memos)。  
在縮放比例為 `70%` 或更低、資料表只顯示名稱時，或在唯讀編輯器中，都不會繪製拖曳控點，因此在這些情況下無法重新排列欄位。  
編輯器轉為唯讀時，進行中的欄位拖曳會立即結束：跟隨指標的副本和抓取中的手形都會消失，放開也不會移動任何欄位。拖曳已移動的列會留在其被移動到的位置。

## 刪除欄位 {#column-deletion}

刪除焦點資料表中選取的欄位。按一下儲存格會選取其所屬的欄位，因此按一下儲存格再按 `Delete`，即可移除這一個欄位。  
快速鍵：

- `Delete` 或 `Backspace`。當欄位所屬的資料表是唯一選取的項目時，這兩個按鍵會移除選取的欄位。未選取任何欄位（焦點位於資料表的名稱、[邏輯名稱](./logical-names.md#name-view)或註解上）、同時也選取了其他項目，或在縮放比例為 `70%` 或更低、資料表只顯示名稱時，它們會改為移除整個選取範圍，請參閱[刪除資料表與備忘錄](./table-related-functions.md#table-and-memo-deletion)。
- `Alt + Backspace` 或 `Alt + Delete` (Windows/Linux)，`⌥ + Backspace` 或 `⌥ + Delete` (Mac)。即使同時也選取了其他資料表或備忘錄，這些按鍵也會移除焦點資料表中選取的欄位。在編輯儲存格時，或縮放比例為 `70%` 或更低時，它們不會移除任何內容。

![以 Alt + Backspace 刪除一個欄位，再刪除兩個選取的欄位](/img/demo-column-remove.webp)

資料表的右鍵選單也有相同的作用。在該資料表是唯一選取的項目時，在欄位的列上按滑鼠右鍵：選單的最後一個項目會顯示 `Delete column`，若該列是兩個或更多已選取欄位的其中之一，則會顯示 `Delete columns`。

在編輯儲存格時，`Delete` 和 `Backspace` 只會清除文字。在儲存格編輯器之外按住不放時，它們只會移除一次。  
移除之後，焦點會移至原焦點欄位上方最近的剩餘欄位。上方沒有剩餘的欄位時，即使下方仍有欄位，焦點也會移至資料表名稱（在 `Logical Names` 中為在其位置繪製的邏輯名稱），因此下一次按 `Delete` 或 `Backspace` 會移除資料表，而不是欄位。  
使用了被移除欄位的關聯和索引會一併移除。不會要求確認，整個移除操作算作一個復原步驟。

## 複製/貼上欄位 {#copyingpasting-columns}

運作方式如同以表格為基礎的剪貼簿。  
快速鍵：`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac)，`Ctrl + V` (Windows/Linux) 或 `⌘ + V` (Mac)

複製到試算表、從試算表貼上，以及貼上到欄位儲存格具有焦點的資料表時，會使用資料表所顯示的儲存格，並依其顯示的順序排列，請參閱[資料表檢視選項](./table-related-functions.md#table-view-options)、[調整欄位順序](./settings.md#adjusting-column-order)和[名稱顯示](./logical-names.md#name-view)。「名稱顯示」會改變其中部分儲存格所存放的內容：

- 在 `Logical Names` 中，名稱的儲存格存放的是邏輯名稱，邏輯名稱為空白時則不含任何內容。View Option → `Domain` 關閉期間，類型儲存格在顯示欄位的定義域時存放該定義域的名稱，否則存放資料類型。
- 在 `Both Names` 中，`Logical Name` 儲存格會在欄位順序所安排的位置複製與貼上。
- 顯示中的定義域儲存格存放定義域的名稱，未顯示任何定義域的欄位則不含任何內容。

在編輯器中複製的欄位，在選取表頭時貼上，或貼上到其他選取的資料表中時，會帶有所複製欄位的每個儲存格，包括 Unique 和 Auto Increment 等隱藏的儲存格，以及其邏輯名稱。  
只有在此圖表列出的是同一個定義域（而不只是同名的定義域），且該定義域仍具有所複製欄位的類型時，這些欄位才會保留定義域連結。否則貼上後不會連結任何定義域，並採用複製時的類型。這些欄位的名稱會被視為您自行撰寫的名稱，除非貼上的名稱是空的，且由邏輯名稱產生了名稱，請參閱[產生物理名稱](./dictionary.md#deriving-physical-names)。  
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

貼上的列會以下列方式寫入邏輯名稱和定義域：

- 邏輯名稱（來自 `Logical Name` 儲存格，或來自 `Logical Names` 中名稱的儲存格）會被視為完整輸入的內容。欄位的名稱是空的或仍由字典產生時，[字典](./dictionary.md#deriving-physical-names)會依邏輯名稱產生物理名稱，並連結其術語所提供的定義域，除非該列自己的定義域儲存格連結了某個定義域。同一列所貼上的名稱會被保留，並視為您自行撰寫的名稱。
- 定義域儲存格（或在 `Logical Names` 中、View Option → `Domain` 關閉期間的類型儲存格）會在圖表列出其文字所指名的定義域時，連結該定義域。其他任何文字或空的儲存格都不會連結任何定義域，並會解除欄位的連結，即使原本連結的定義域與貼上的類型相同也一樣。類型儲存格中未指名任何定義域的文字會被讀取為資料類型。在編輯器中複製的列則會改為連結其複製時所連結的定義域，且僅在此圖表以所複製的類型列出該定義域時才會連結，與新欄位相同。
- 連結的定義域會將其資料類型賦予欄位，除非該列貼上了自己的類型。此時不會連結類型不同的定義域，欄位會採用貼上的類型。
- 在沒有定義域儲存格的列中，貼上的類型會解除欄位與類型不同之定義域的連結，與輸入類型時相同。
- 任何貼上都不會沿著[關聯資料類型同步](./settings.md#relationship-datatype-sync)傳遞類型。

## 複製/貼上資料表與備忘錄 {#copyingpasting-tables-and-memos}

焦點資料表中未選取任何欄位時，相同的快速鍵會複製選取的資料表與備忘錄本身，請參閱[資料表相關功能](./table-related-functions.md)。

## 欄位主鍵 {#column-primary-key}

切換焦點欄位的主鍵，焦點欄位即焦點儲存格所屬的欄位。  
當焦點欄位是兩個或更多已選取欄位的其中之一時，切換會套用到所有選取的欄位：只要其中有任何一個不是鍵，全部都會變成鍵；如果全部都已經是鍵，則全部都會被清除。選取範圍以外的欄位不受影響。  
使用資料表的右鍵選單，或快速鍵 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)。當切換涉及兩個或更多欄位時，選單項目會顯示 `Primary Key on selected columns`，而不是 `Primary Key`。  
列中的鑰匙圖示僅供顯示，因此按一下它並不會設定鍵。

若要將多個欄位設為一個複合鍵，先[選取這些欄位](#selecting-multiple-columns)，然後按 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，或在其中一個已選取的列上按滑鼠右鍵並選擇 `Primary Key on selected columns`。每次切換都算作一個復原步驟。

![以 Shift + Arrow Down 選取兩個欄位，接著以 ⌥ + K 將兩者都設為主鍵，再按一次將兩者都清除](/img/demo-column-pk.webp)

## 唯讀編輯器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 編輯器中，不會有任何儲存格開啟編輯，也不會有任何欄位變更。  
在儲存格上按一下不會讓任何東西取得焦點，並會取消跳至目標所留下的選取範圍。`Enter` 和按兩下既不會開啟編輯器，也不會切換任何開關，`Tab` 交由頁面處理，而新增、全選或刪除欄位的快速鍵、主鍵切換和貼上都不會有任何作用。  
從[物件總管](./explorer.md#going-to-a-row)或[快速搜尋](./quick-search.md)前往某個欄位會讓其儲存格取得焦點。方向鍵接著會在儲存格之間移動焦點，到達的欄位會單獨被選取，因為在那裡 `Shift` 不會加選任何欄位。  
`Ctrl + C` (Windows/Linux) 或 `⌘ + C` (Mac) 仍會複製所選的欄位，或跳至目標所選取的資料表，請參閱[複製/貼上欄位](#copyingpasting-columns)。
