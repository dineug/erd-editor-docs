---
sidebar_position: 4
description: 為資料表和欄位設定邏輯名稱，透過「名稱顯示」顯示物理名稱、邏輯名稱或兩者，在輸入時自動完成術語名稱，將欄位連結到定義域，並了解還有哪些地方的名稱會依循顯示方式。
---

# 邏輯名稱

資料表及其每個欄位除了名稱之外，還可以有邏輯名稱。邏輯名稱是供人閱讀的名稱，例如 `CUST_NM` 的 `Customer Name`。名稱本身就是物理名稱，也就是[結構描述 SQL](./schema-sql.md) 和[程式碼產生器](./code-generator.md)寫出的名稱。  
「名稱顯示」決定 ERD 畫布要繪製兩者中的哪一個：名稱、邏輯名稱或兩者，請參閱[名稱顯示](#name-view)。  
邏輯名稱也可以為其資料表或欄位提供物理名稱，該名稱由[字典](./dictionary.md)索引標籤上的詞彙和術語產生，請參閱[產生物理名稱](./dictionary.md#deriving-physical-names)。  
欄位可以連結到定義域，也就是保存在「字典」索引標籤的 `Domains` 工作表上、具有名稱的資料類型，例如 `VARCHAR(100)` 的 `Name`，連結後欄位便會採用該定義域的資料類型，請參閱[定義域儲存格](#the-domain-cell)。  
結構描述 SQL 可以將每個邏輯名稱寫入空白註解，請參閱[以邏輯名稱作為註解](./schema-sql.md#logical-names-as-comments)。

## 名稱顯示 {#name-view}

共有三種顯示方式，每種都以自己的方式繪製資料表的表頭和列：

- `Physical Names` 是新圖表的顯示方式，不會繪製任何邏輯名稱。表頭會顯示資料表的名稱，並在 View Option → `Table Comment` 開啟期間顯示其註解，每一列則會依[欄位順序](./settings.md#adjusting-column-order)顯示其儲存格。
- `Logical Names` 會在每個名稱的位置繪製邏輯名稱：在表頭中，以及在每一列中 `Name` 於欄位順序所在的位置。列的類型儲存格可以代為顯示欄位的定義域，如下所述。
- `Both Names` 會在名稱旁繪製邏輯名稱。表頭會依序顯示邏輯名稱、名稱和註解，每一列也會多出一個 `Logical Name` 儲存格，欄位順序預設會將其放在 `Name` 的正前方。

空白的邏輯名稱（包括只由空格組成的邏輯名稱）會顯示淡化的替代文字。在 `Logical Names` 中，替代文字是在其位置繪製的名稱，名稱也是空白時則為 `table` 或 `column` 預留位置文字。在 `Both Names` 中，替代文字是 `logical` 預留位置文字。

在 `Logical Names` 中，連結到「字典」索引標籤的 `Domains` 工作表上某個具有名稱的定義域的欄位，會在其類型儲存格中顯示該定義域的名稱，而不是其資料類型。其他所有欄位則會在該處顯示其資料類型。  
View Option → `Domain` 開啟期間，定義域會有自己的儲存格，類型儲存格則保持顯示資料類型，因此不會有任何一列將定義域顯示兩次，請參閱[定義域儲存格](#the-domain-cell)。

每個資料表的寬度取決於它在該顯示方式下所繪製的儲存格，因此切換會調整資料表的大小，並重新配置其連接線。不會有任何資料表移動。  
在 `70%` 及以下，資料表會收合為只顯示名稱，請參閱[放大/縮小](./table-related-functions.md#zoom-inout)。在 `Logical Names` 中會顯示邏輯名稱，沒有邏輯名稱時則顯示淡化的名稱。在 `Both Names` 中會顯示邏輯名稱，並在其下方的一行顯示名稱，沒有邏輯名稱時則只顯示名稱。

字典的檢查可以將其標出的邏輯名稱或名稱以紅色或琥珀色顯示，請參閱[畫布上的標示](./dictionary.md#marks-on-the-canvas)。

## 切換顯示方式 {#switching-the-view}

有四個地方可以切換顯示方式，每處都會列出 `Physical Names`、`Logical Names` 和 `Both Names`，並勾選目前的顯示方式：

- [畫布工具列](./table-related-functions.md#canvas-toolbar)上的 `Name View` 按鈕，位於四種關聯表示法與禪模式之間。它會顯示目前顯示方式的名稱和一個向下箭頭，其工具提示為 `Name View`。按一下會在工具列上方開啟清單，選擇一項後清單就會關閉。
- 畫布的右鍵選單中緊接在 `View Option` 之後的 `Name View`：列出三種顯示方式的子選單。選擇之後選單會保持開啟。
- 「視覺化」索引標籤在 `Flow` 模式下的工具列上的同一份清單，位於列顯示選單之後，請參閱[工具列](./visualization.md#toolbar)。
- [快速搜尋](./quick-search.md#what-the-palette-lists)中緊接在 `Tab` 之後的 `Name View`，只會在 ERD 索引標籤中列出。其子選單開啟時，醒目顯示的項目會位於目前的顯示方式上。

![從畫布工具列將「名稱顯示」切換為 Logical Names，再從畫布選單切換為 Both Names，然後切回 Physical Names，沒有邏輯名稱的 ordered_at 先淡化顯示，之後顯示為 logical 預留位置文字](/img/demo-name-view.webp)

這四處設定的是同一個顯示方式。頂端工具列沒有對應的按鈕。

切換會保留選取範圍，且不會記錄在[復原歷程記錄](./undo-redo.md#what-the-history-records)中。  
若焦點儲存格在新的顯示方式下不會繪製，焦點會移至在其位置繪製的儲存格：名稱與邏輯名稱會互相替代，類型與定義域也是如此。在該儲存格上開啟的儲存格編輯器會關閉。開啟或關閉 View Option → `Domain` 時，焦點也會以相同的方式移動。  
`Name View` 鎖定開啟期間（新圖表即是如此），切換只會變更您自己的畫面，檔案會保留鎖定時的顯示方式。鎖定關閉時，檔案會儲存您切換到的顯示方式，請參閱[鎖定](./settings.md#lock)。

## 輸入邏輯名稱 {#writing-a-logical-name}

`Physical Names` 不會繪製邏輯名稱，因此切換為 `Logical Names` 或 `Both Names` 即可在畫布上輸入邏輯名稱：

- 在 `Logical Names` 中，表頭和各列的名稱儲存格存放的是邏輯名稱，因此在此顯示方式下無法在畫布上編輯物理名稱。
- 在 `Both Names` 中，邏輯名稱儲存格存放邏輯名稱，名稱儲存格則存放物理名稱。

邏輯名稱儲存格的編輯方式與其他儲存格相同：按 `Enter` 或按兩下即可開始編輯，請參閱[編輯資料表](./table-editing.md)。在空白的邏輯名稱上開啟時，編輯器會將該儲存格原本繪製的內容顯示為預留位置文字：在 `Logical Names` 中是名稱，在 `Both Names` 中是 `logical`。  
輸入只會寫入邏輯名稱。編輯器在邏輯名稱已變更的狀態下關閉時（按 `Enter`、`Tab`、`Escape` 或按一下其他地方），會依邏輯名稱產生物理名稱，並在您的輸入之後算作一個獨立的復原步驟。自行撰寫的物理名稱會保持不變，請參閱[產生物理名稱](./dictionary.md#deriving-physical-names)。

`Tab` 和 `Shift + Tab` 會依序走訪該顯示方式所繪製的儲存格，請參閱 [Tab 鍵](./table-editing.md#tab-key)：

- 在 `Logical Names` 中，先是表頭的邏輯名稱，接著是其註解，然後依欄位順序走訪每一列的儲存格，邏輯名稱位於名稱的位置。
- 在 `Both Names` 中，先是表頭的邏輯名稱、名稱和註解，然後依欄位順序走訪每一列的儲存格，預設以其 `Logical Name` 儲存格為第一個。

`Alt + Enter` (Windows/Linux) 或 `⌥ + Enter` (Mac) 會新增欄位，並將焦點移至其資料列所繪製的第一個儲存格。在預設的欄位順序下，那是其名稱儲存格，在 `Logical Names` 中即為其邏輯名稱，在 `Both Names` 中則是其 `Logical Name` 儲存格，因此您可以從邏輯名稱開始，請參閱[新增欄位](./table-editing.md#adding-columns)。

關聯所加入的外鍵欄位會複製其鍵的邏輯名稱和定義域，以及其類型，請參閱[識別關聯](./relationship-editing.md#identifying-relationships)。  
將欄位複製到試算表，以及從試算表貼上欄位時，會使用該顯示方式所繪製的儲存格，包括邏輯名稱儲存格和定義域儲存格，請參閱[複製/貼上欄位](./table-editing.md#copyingpasting-columns)。

## 術語名稱自動完成 {#completing-term-names}

在邏輯名稱儲存格（表頭的或某一列的）中輸入時，儲存格下方的清單會提供名稱以所輸入文字開頭的術語，不區分大小寫，並忽略文字前的空格。術語是保存在「字典」索引標籤的 `Terms` 工作表上的完整邏輯名稱，並附有它所提供的物理名稱和定義域。清單最多顯示八個，依名稱排序，所輸入的文字會醒目顯示。沒有任何術語以該文字開頭時，不會顯示清單。

![在 Both Names 中以 ⌥ + Enter 新增欄位，從其邏輯名稱下方的術語清單中選擇 Order Amount，填入 ORD_AMT、DECIMAL(10,2) 和 Amount 定義域，接著輸入 Order Date，按 Enter 關閉編輯器時，詞彙會為其提供名稱 ORD_DT](/img/demo-logical-names.webp)

- 一開始沒有任何項目醒目顯示。`↑` 和 `↓` 會移動醒目顯示，到達兩端時會循環，醒目顯示的術語會顯示 `Enter` 鍵。
- 在醒目顯示的術語上按 `Enter`，會將其名稱寫入為邏輯名稱並結束編輯。除非物理名稱是您自行撰寫的，否則同一個復原步驟會立即依該術語產生物理名稱，若為欄位，也會賦予其該術語的定義域。沒有醒目顯示任何項目時按 `Enter`，會結束編輯並保留所輸入的內容。
- 按一下術語會以相同的方式寫入，並讓編輯器保持開啟。
- 清單顯示時按 `Escape` 只會關閉清單，再按一次 `Escape` 才會結束編輯。
- `Tab` 會保留所輸入的文字並繼續移動，編輯器關閉時會依該文字產生物理名稱。
- 輸入法正在組字時，方向鍵和 `Enter` 會用於組字。

術語為資料表或欄位提供的內容，在[產生物理名稱](./dictionary.md#deriving-physical-names)中說明。

## 定義域儲存格 {#the-domain-cell}

View Option → `Domain` 預設為關閉，開啟後會在每種顯示方式下為每一列加上定義域儲存格，位於 `Domain` 在欄位順序中的位置，預設緊接在 `DataType` 之後，請參閱[資料表檢視選項](./table-related-functions.md#table-view-options)。  
此儲存格會顯示欄位所連結的定義域的名稱；欄位未連結到 `Domains` 工作表所列出的任何定義域時，則顯示淡化的 `domain` 預留位置文字。

![開啟 View Option → Domain，以 amo 縮小清單後在 PAY_AMT 的定義域儲存格中選擇 Amount，在「字典」索引標籤上將 Amount 的 Data Type 變更為 DECIMAL(12,2)，可見該欄位隨之變更，接著在該欄位中輸入 NUMERIC(12,2)，使其解除連結](/img/demo-domains.webp)

按 `Enter` 或按兩下會在儲存格上方開啟選擇器：一個以儲存格文字為預留位置文字的空白輸入框，其下方先是 `None`，接著依工作表的順序列出 `Domains` 工作表中每個具有名稱的定義域。醒目顯示的項目一開始位於已連結的定義域上，或位於 `None` 上。

- 輸入時只會列出名稱包含該文字的定義域（不區分大小寫），並移除 `None`，醒目顯示第一個。`↑` 和 `↓` 會移動醒目顯示。
- `Enter` 會連結醒目顯示的定義域，按一下則會連結所按的定義域。兩者都會將該定義域的資料類型賦予欄位，算作一個復原步驟，並結束編輯。`None` 會解除欄位的連結，並保留其資料類型。
- 所輸入的內容永遠不會寫入欄位。`Domains` 工作表中沒有任何具有名稱的定義域時，不會顯示清單，按 `Enter` 會結束編輯而不寫入任何內容。

在 `Logical Names` 中且 View Option → `Domain` 關閉時，顯示定義域名稱的類型儲存格會開啟此選擇器，顯示資料類型的類型儲存格則會開啟資料類型編輯器，請參閱[資料類型自動完成](./table-editing.md#datatype-autocomplete)。若要將沒有定義域的欄位連結到定義域，開啟定義域儲存格即可。  
已連結的欄位會採用其定義域的資料類型，並在定義域的類型變更時隨之變更，在其 DataType 儲存格中輸入其他類型則會解除連結，請參閱[定義域與資料類型](./dictionary.md#domains-and-data-types)。

## 畫布以外的地方 {#beyond-the-canvas}

其他大多數顯示資料表或欄位名稱的地方也會依循「名稱顯示」：

- `Physical Names` 會顯示名稱。
- `Logical Names` 會顯示邏輯名稱；邏輯名稱為空白時則顯示名稱，在能夠淡化顯示的地方會淡化顯示。
- `Both Names` 會顯示邏輯名稱，並在其後顯示名稱：在文字列中以次要色彩顯示，在關係圖的標籤中顯示在第二行，在必須以一段文字容納兩者的地方則放在括號中，例如 `Member (member)`。沒有邏輯名稱的資料表或欄位只會顯示其名稱。

依名稱排序的清單，例如物件總管中的資料表或快速搜尋的 `#` 列，在每種顯示方式下都會保持依名稱排序，永遠不會依邏輯名稱排序。

依循顯示方式的地方：

- 「視覺化」索引標籤上，流程模式的卡片（請參閱[卡片上的名稱](./visualization.md#names-on-the-cards)），以及關係圖的標籤和懸停預覽，請參閱[解讀關係圖](./visualization.md#reading-the-graph)和[懸停預覽](./visualization.md#hover-preview)。
- 「[資料表屬性](./table-related-functions.md#table-properties)」：其中的標籤，以及 `Indexes` 索引標籤中的 `Columns` 列和 `Index order` 清單，請參閱[索引](./table-related-functions.md#indexes)。
- [物件總管](./explorer.md#the-tree)的資料表列和欄位列，以及每個資料表群組下列出的資料表。
- 快速搜尋的 `#` 列，請參閱[搜尋圖表](./quick-search.md#searching-the-diagram)。
- [差異檢視器](./table-related-functions.md#diff-viewer)的變更樹狀結構及其兩側。
- 「[對應欄位](./relationship-editing.md#map-columns)」，以及繪製關聯時 `Create new columns` 可能顯示的 `<parent> has no primary key to copy` 工具提示，請參閱[建立關聯](./editing-start.md#relationship-creation)。
- 拖曳欄位經過畫布空白處時所帶的列副本，它會依每一列的繪製方式顯示其名稱儲存格和類型儲存格，請參閱[重新排列與移動欄位](./table-editing.md#rearranging-and-moving-columns)。
- 「字典」索引標籤的 `Checks` 工作表的 `Target` 欄，請參閱[「檢查」工作表](./dictionary.md#the-checks-sheet)。
- [匯出的圖片](./file-import-export.md#image)。

少數地方無論顯示方式為何都會保持顯示名稱：物件總管的索引列和外鍵列、「資料表屬性」的 `Indexes` 索引標籤中的 `Keys`、「對應欄位」的 `New column: <name>`，以及快速搜尋 `@` 或 `:` 列旁寫出的位置。

差異檢視器、[時光旅行](./undo-redo.md#time-travel)、[自動版面配置](./table-related-functions.md#auto-layout)的 `Force` 預覽和 `Export image` 對話方塊，都會以您目前看到的「名稱顯示」開啟，無論檔案保存的是哪種顯示方式。它們在開啟期間都會保持該顯示方式。  
每次自動版面配置，以及結構描述 SQL、GraphQL、DBML 或 AML 的 `Import` 或 `Import and Add`，都會依資料表在您的顯示方式下所佔的寬度來排列資料表。

## 依邏輯名稱尋找 {#finding-by-logical-name}

在每種顯示方式下都能找到邏輯名稱，包括畫布不會繪製任何邏輯名稱的 `Physical Names`：

- [尋找與取代](./find-and-replace.md#what-it-searches)會將其作為一種文字 `Logical names` 來搜尋，資料表和欄位皆適用，且搜尋首次開啟時此項目為開啟狀態。取代邏輯名稱時，會依其產生物理名稱，與輸入邏輯名稱時相同。
- 在[快速搜尋](./quick-search.md#searching-the-diagram)中，`#` 會依名稱或邏輯名稱尋找資料表，`@` 會依兩者之一尋找欄位，依邏輯名稱相符的項目旁會顯示 `Logical name`。`@` 中位於 `.` 之前的資料表部分，也會比對資料表的名稱或邏輯名稱。

切換「名稱顯示」只會變更結果的命名方式，永遠不會變更找到的內容。

## 協作者 {#collaborators}

在[協作工作階段](../../api/advanced/collaborative-editing.md)中，邏輯名稱和定義域連結會像其他任何編輯一樣傳送到每個編輯器。  
`Name View` 鎖定開啟期間，每個編輯器都會保留自己的顯示方式，切換只會在執行切換的編輯器中呈現。鎖定關閉期間，在任何非唯讀編輯器中切換，都會切換所有編輯器，請參閱[鎖定](./settings.md#lock)，其中也說明了開啟或關閉鎖定對每個編輯器的顯示方式有何影響。  
當參與者的焦點儲存格是您的顯示方式不會繪製的儲存格時，其顏色會顯示在您的顯示方式於該位置繪製的儲存格上：`Physical Names` 中的名稱儲存格會顯示在您 `Logical Names` 中的邏輯名稱儲存格上，反之亦然，類型儲存格與代替它顯示的定義域也以相同的方式對應。

透過 MCP 伺服器工作的程式碼代理程式，無論您正在看的是哪種顯示方式，都會設定邏輯名稱並連結定義域，且沒有任何可切換「名稱顯示」的工具，請參閱[字典](../../mcp/tools.md#dictionaries)和[設定](../../mcp/tools.md#settings)。

## 唯讀編輯器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 編輯器中，每個「名稱顯示」選擇器都能使用：畫布工具列的 `Name View` 按鈕、畫布右鍵選單和快速搜尋中的 `Name View`，以及流程模式工具列上的清單。  
在那裡的切換只會變更該畫面，無論鎖定如何設定：檔案、協作者和復原歷程記錄都會保留原來的顯示方式。編輯器再次轉為可寫入後，所挑選的顯示方式會留在該畫面上，直到下一次在該處切換，或者在鎖定關閉期間，直到協作者切換它或重新載入文件為止。  
在其中無法編輯邏輯名稱和定義域，因此不會開啟儲存格編輯器、術語清單或定義域選擇器，也不會提供 `Derive Physical Name Again` 和 `Derive Physical Names Again` 項目。  
View Option → `Domain` 會只在該畫面上顯示或隱藏「定義域」儲存格，在那裡所有[檢視選項](./table-related-functions.md#table-view-options)都是如此，而編輯器再次轉為可寫入後，會恢復文件所持有的檢視選項。
