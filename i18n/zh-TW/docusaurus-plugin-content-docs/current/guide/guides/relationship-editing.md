---
sidebar_position: 6
description: 刪除關聯、變更其類型、設定其 ON DELETE 和 ON UPDATE 動作、使用「對應欄位」將其對應到現有欄位、解讀連接線的表示法、處理 N:M 關聯和識別關聯，以及了解新外鍵欄位的命名方式。
---

# 編輯關聯

關聯可從畫布的右鍵選單、畫布工具列、[快速搜尋](./quick-search.md#what-the-palette-lists)或使用快速鍵繪製，請參閱[開始編輯](./editing-start.md)。  
本頁說明關聯建立後可以對其進行哪些操作、「[對應欄位](#map-columns)」如何讓關聯連接到子資料表已有的欄位，以及關聯所加入的外鍵欄位如何命名。

## 刪除 {#deletion}

可透過關聯的右鍵選單刪除。

![從右鍵選單刪除 products 到 reviews 的關聯](/img/demo-relationship-remove.webp)

此操作沒有快速鍵，因為關聯不會像資料表或備忘錄那樣被選取：用來移除所選內容的 `Delete` 和 `Backspace` 永遠不會單獨移除關聯，請參閱[刪除資料表與備忘錄](./table-related-functions.md#table-and-memo-deletion)。  
關聯也會隨其所連接的項目一併移除：刪除資料表會移除與其相連的所有關聯，刪除欄位則會移除使用該欄位的所有關聯。

## 變更類型 {#type-change}

可透過關聯右鍵選單中的 `Relationship Type` 變更。  
提供四種類型，目前的類型會標上勾號：

- Zero One
- Zero N
- One Only
- One N

![在右鍵選單中將關聯從 Zero N 變更為 One Only，再變更為 One N](/img/demo-relationship-type.webp)

這四種類型與開始建立關聯時所用的類型相同，各有其快速鍵，請參閱[開始編輯](./editing-start.md)。

## ON DELETE 與 ON UPDATE {#on-delete-and-on-update}

透過關聯右鍵選單中的 `On Delete` 和 `On Update` 設定，這兩個項目位於 `Relationship Type` 與 `Map Columns` 之間。  
兩者提供相同的六個項目，目前的項目會標上勾號：

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` 不會寫出任何子句，因此會套用資料庫本身的預設行為。新的關聯無論是繪製的，還是在「[對應欄位](#map-columns)」中建立的，其兩個動作一開始都是 `Not set`，之後選擇 `Not set` 即可清除動作。  
兩者彼此獨立：變更其中一個時，另一個會保持不變。  
連接線會顯示已設定的內容，請參閱[解讀連接線](#reading-a-connector)。  
與其資料表一起被複製並貼上或建立副本的關聯會保留這兩個動作，匯入結構描述 SQL、DBML 或 AML 時則會帶入檔案中所宣告的動作，請參閱[匯入或匯出檔案](./file-import-export.md)。

![從右鍵選單為 orders 到 order_items 的關聯設定 ON DELETE CASCADE 和 ON UPDATE RESTRICT，其標籤顯示為 D:C U:R，接著將指標停留在其上讀回這兩個動作](/img/demo-referential-actions.webp)

無論使用哪種資料庫，都可以選擇任何動作。  
所選[資料庫](./table-related-functions.md#databases)的結構描述 SQL 會省略的動作，旁邊會帶有一則淡色的註記，例如 `not in MySQL`。`Not set` 永遠不會帶有註記，切換資料庫時則會更新這些註記。  
帶有註記的動作仍會儲存在關聯上：連接線會顯示它，JSON、DBML 和 AML 也會保留它，但該資料庫的結構描述 SQL 會省略此子句，因此會套用資料庫的預設行為。

[結構描述 SQL](./schema-sql.md) 會寫出以下動作，並省略其餘動作：

| 資料庫 | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | 無 |
| PostgreSQL | 全部五種 | 全部五種 |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | 全部五種 | 全部五種 |

Snowflake 的結構描述 SQL 還會寫出一則註解，列出其省略的每個動作，請參閱[參照動作](./schema-sql.md#referential-actions)。

程式碼產生器的 ORM 目標會寫出哪些動作，除了取決於所選的資料庫，也取決於目標本身，請參閱[程式碼產生器](./code-generator.md#on-delete-and-on-update)。

## 對應欄位 {#map-columns}

「對應欄位」會將父資料表的鍵與子資料表的欄位配對，鍵的每個欄位各佔一列。  
每一列會使用子資料表已有的欄位，或加入一個新的外鍵欄位，因此關聯可以連接到現有的欄位上。

![從 members 到 orders 繪製 Zero N 關聯，選擇 Map to existing columns，並將 id 對應到現有的 member_id 欄位](/img/demo-map-columns.webp)

有兩種開啟方式：

- 繪製關聯時，從子資料表旁的 `Map to existing columns` 開啟，請參閱[建立關聯](./editing-start.md#relationship-creation)。此時 `Map` 會加入一個所繪製類型的關聯。
- 從關聯右鍵選單中的 `Map Columns` 開啟，用來變更現有關聯的欄位。此時 `Save` 會寫入變更。唯讀編輯器中不會出現此項目。

對話方塊的副標題會列出兩個資料表和關聯類型，例如 `users → posts · One N`。類型在此只會顯示，無法在此變更，請使用[變更類型](#type-change)。

`References` 用來選擇關聯所指向的鍵：先是 `Primary Key`（其欄位依資料表中的順序排列），接著是每個標示為 `Unique` 的欄位各自的 `Unique: <column>`。只有在有多個選項時才會顯示。  
唯一索引在此不算作鍵，而本身就是整個主鍵的 `Unique` 欄位也不會重複列出。  
選擇另一個鍵會重建各列。只要所選的欄位仍在子資料表中，該列就會保留其選擇。

在 `Referenced column` 和 `Foreign key column` 標題下，每一列會顯示鍵的一個欄位及其資料類型，以及可與其配對的子資料表欄位清單：

- `Pick a column` 會讓該列保持空白。
- `New column: <name>` 會加入一個新的外鍵欄位。顯示的名稱就是該欄位將取得的名稱，如[外鍵欄位名稱](#foreign-key-column-names)所述，編號時會一併考量子資料表的欄位，以及其他加入新欄位的列。名稱會是空白時（例如鍵沒有名稱時），不會提供此選項。
- 子資料表的每個欄位，顯示為 `<name> (<data type>)`。已被另一列選取的欄位會顯示為 `<name> (<data type>) · in use`，且無法選取，因此不會有兩列共用同一個欄位。已被另一個關聯使用的欄位仍可選取，因此像共用的 `tenant_id` 這類欄位可以用於多個關聯。

使用 `Map` 時，只有在子資料表中恰好有一個欄位的名稱（不區分大小寫）等於為該列新建的外鍵欄位在加上任何 `_2` 編號之前會取得的名稱時，該列一開始才會填好，例如 `users` 上的 `id` 對應 `users_id`，`member_id` 對應 `member_id`。當 [`Bracket`](./schema-sql.md#database-and-bracket) 為預設值 `None` 時，以結構描述限定的資料表名稱中，由資料表部分所建構的名稱也算數，因此 `public.users` 上的 `id` 會與 `public.users_id` 或 `users_id` 配對。對於 `Unique` 鍵，鍵欄位本身的名稱也算數，因此 `vin` 會與 `vin` 配對。其他每一列一開始都是 `Pick a column`。  
使用 `Save` 時，每一列一開始都是關聯目前使用的欄位。無論使用哪一個，在 `References` 中選擇另一個鍵時，都會以相同的名稱比對方式填入該鍵的空白列。

當所選欄位的資料類型與父欄位賦予外鍵的資料類型不同時，該列下方會有一則註記指出這一點。  
當「[關聯資料類型同步](./settings.md#relationship-datatype-sync)」開啟且父欄位設有資料類型時，註記會顯示 `<column> becomes <type>`，也就是此對應關係將寫入的類型。否則會顯示 `Types differ: <parent type> and <child type>`，且該欄位會保留其類型。

有任何阻礙時，`Map` 或 `Save` 會保持停用，並在各列下方以一行文字說明原因：

- `Pick a foreign key column for every referenced column`：仍有某一列是空白的。
- `At least one column must reference a different column`：自我參照關聯中，每一列都選取了其自身的父欄位。
- `These columns are already linked by another relationship`：相同兩個資料表之間的另一個關聯恰好連結了這些欄位。
- `<parent> has no key to reference`：使用 `Map` 時，父資料表既沒有主鍵，也沒有 `Unique` 欄位。

在對應關係與關聯目前的對應關係不同之前，`Save` 也會保持停用。  
使用 `Save` 時，若某一列的欄位已離開其資料表，該列會顯示 `(removed)`。請選取另一個子資料表欄位；若消失的是父欄位，則請在 `References` 中選擇一個鍵。使用 `Map` 時，所選欄位被移除的列會回到 `Pick a column`。

若關聯的父欄位並非恰好是父資料表的某個鍵，對話方塊開啟時，`References` 會選取末尾的一個額外選項 `Current columns (not a key)`，此選項會讓這些欄位保持原樣。當父資料表完全沒有鍵時，這就是唯一的選項，且不會顯示 `References`。  
此時的 `The referenced columns are not a key of <parent>` 這行文字（父資料表完全沒有鍵時則為 `<parent> has no key to reference`）是一則通知，而不是錯誤：`Save` 仍可使用，因此可以變更子資料表的欄位並保留此參照。  
若關聯的兩組欄位清單無法配對（例如兩者長度不同），對話方塊會顯示 `(invalid)` 列，並讓 `Save` 保持停用，直到在 `References` 中選擇一個鍵，或為沒有鍵的父資料表加入主鍵或 `Unique` 欄位為止。

對話方塊開啟期間會跟隨圖表的變化，包括協作者或程式碼代理程式所做的編輯，並保留已選取的項目。  
若在此期間關聯的欄位或開啟時所用的鍵有所變更，對話方塊會加入一行 `This relationship changed while the dialog was open`。

`Map` 和 `Save` 寫入的內容：

- `Map` 會加入關聯，其 `On Delete` 和 `On Update` 皆為 `Not set`。`Save` 只會變更關聯的欄位，將其父端指向在 `References` 中選擇的鍵，並保留其類型及其 ON DELETE 和 ON UPDATE。
- `New column` 列會像繪製時一樣，在子資料表的末尾加入一個欄位：此欄位為 `NOT NULL`，以其鍵命名，並採用該鍵的資料類型、預設值和註解，請參閱[識別關聯](#identifying-relationships)。
- 所選欄位永遠不會被重新命名，其 `Not Null`、主鍵、`Unique`、預設值和註解也都保持不變。只有在 `Relationship DataType Sync` 開啟且父欄位設有資料類型時，其資料類型才會變更：它會採用父欄位賦予外鍵的類型（serial 鍵則與新欄位一樣採用整數類型），且此變更會像同步一樣沿著關聯繼續傳遞。
- 對應關係不再使用的欄位會留在子資料表中，且除非仍有另一個關聯連接到它，否則不再標示為外鍵。
- 一次 `Map` 或 `Save` 所寫入的所有內容（包括新欄位和類型變更）算作一個復原步驟。

與任何關聯一樣，關聯是否為識別關聯以及其父端如何繪製，都由對應的子資料表欄位決定。對應到子資料表的主鍵欄位會使其立即成為識別關聯，對應到允許 `NULL` 的欄位則會在父端繪製圓圈，請參閱[解讀連接線](#reading-a-connector)。  
結構描述 SQL 的外鍵會參照所選擇的鍵，例如 `Unique` 鍵會寫成 `REFERENCES vehicle (vin)`。

若按下 `Map` 或 `Save` 時圖表已包含此對應關係（因為協作者或程式碼代理程式已先完成），則不會寫入任何內容。  
若圖表已變更，使此對應關係不再適用，則不會寫入任何內容，並會顯示 `Couldn't map columns: the diagram changed` 快顯通知。

`Cancel`、`x` 按鈕、`Escape` 或按一下對話方塊外的變暗區域，都會關閉對話方塊，而不寫入任何內容。  
變暗區域會覆蓋整個編輯器（包括工具列），已開啟的[物件總管](./explorer.md#dialogs-beside-it)會在其下方保持開啟。  
開啟快速搜尋也會關閉對話方塊，離開 ERD 索引標籤或編輯器變為唯讀時也是如此。  
`Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 也會關閉對話方塊，並將插入點放在物件總管[搜尋](./find-and-replace.md#opening-and-closing)的「尋找」輸入框中，若物件總管已關閉則會將其開啟。在窄到無法顯示物件總管的編輯器中，此按鍵仍會關閉對話方塊，但會顯示快顯通知，而不會移動插入點，請參閱[開啟與關閉](./explorer.md#opening-and-closing)。  
若對話方塊開啟期間其中一個資料表或該關聯被移除，對話方塊會關閉並顯示快顯通知，例如 `Map Columns closed: the relationship was removed`。  
對話方塊開啟期間，畫布快速鍵、復原與重做，以及複製與貼上都不會有任何作用。

程式碼代理程式沒有「對應欄位」工具。它會在一個 `erd_batch` 中，先以 `erd_remove_relationship` 移除關聯（此工具會保留其外鍵欄位），再以 `erd_link_columns` 在現有欄位上重新繪製該關聯，藉此重新對應關聯，請參閱[工具](../../mcp/tools.md#relationships)。

## N:M 關聯 {#nm-relationships}

由於編輯器以實體模型為基礎，N:M 關聯會如下所示，以對應資料表來表示。

![使用 ⌘ + ⌥ + 2 先從 products、再從 tags 繪製關聯到空的 product_tags 資料表，依序加入 product_id 和 tag_id](/img/demo-relationship-n-m.webp)

若對應資料表已有其鍵欄位，例如 `product_tags` 上的 `product_id` 和 `tag_id`，可使用 `Map to existing columns` 繪製每個關聯並選取這些欄位，而不加入新欄位，請參閱[對應欄位](#map-columns)。若這些欄位是對應資料表的主鍵，每個關聯都會立即成為識別關聯。

匯入 GraphQL、DBML 或 AML 時，會自動建立對應資料表。  
多對多宣告會成為名為 `<left>_<right>` 的資料表，其註解為 `Junction table inferred from <left> <-> <right>`，並透過識別關聯與兩側相連。  
請參閱[匯入或匯出檔案](./file-import-export.md)。

## 識別關聯 {#identifying-relationships}

以按一下子資料表或使用 `Create new columns` 的方式繪製關聯時，父資料表的每個主鍵都會以 `NOT NULL` 外鍵欄位的形式複製到子資料表上，因此新的關聯一開始是非識別關聯。  
複製出的欄位會採用該鍵的資料類型、預設值和註解，但不會採用 `Unique` 或 `Auto Increment`，其命名方式如[外鍵欄位名稱](#foreign-key-column-names)所述。  
serial 鍵是資料類型的例外：其複製出的欄位會採用該 serial 所儲存的整數類型。在任何資料庫下，`smallserial` 和 `serial2` 會得到 `smallint`，`serial4` 會得到 `integer`，`bigserial` 和 `serial8` 會得到 `bigint`。單獨的 `serial` 在 PostgreSQL 下會得到 `integer`，在 MySQL 和 MariaDB 下會得到 `bigint unsigned`，在其他任何資料庫下則維持為 `serial`。  
只有完整的類型名稱才算數（不區分大小寫），因此 `serial(4)` 會依原樣複製。以大寫字母書寫的類型會得到大寫的結果：在 PostgreSQL 下，`SERIAL` 會得到 `INTEGER`。已儲存的圖表中類型已是 `serial` 的外鍵欄位會保留該類型。  
若要讓關聯成為識別關聯，可將子資料表上的這些外鍵欄位設為主鍵：全部選取後按一次 `Alt + K` (Windows/Linux) 或 `⌥ + K` (Mac)，或在資料表的右鍵選單中選擇 `Primary Key`，選取兩個以上的欄位時此項目會顯示為 `Primary Key on selected columns`，請參閱[欄位主鍵](./table-editing.md#column-primary-key)。

![使用 Alt + K 切換 product_id 的主鍵設定，其連接線先變為實線，再變為虛線](/img/demo-identifying-relationship.webp)

編輯器會自動保持此狀態同步。  
當子端的每個欄位都是主鍵時，關聯即為識別關聯；只要其中一個不是主鍵，就會立即變為非識別關聯。

## 外鍵欄位名稱 {#foreign-key-column-names}

繪製關聯時，所加入的每個外鍵欄位都會依其所複製的父資料表鍵來命名：

- 由一個單字組成的鍵名稱，例如 `id`、`ID` 或 `uuid`，會在前面加上父資料表的名稱和一個底線：`products` 上的 `id` 會變為 `products_id`。
- 由多個單字組成的鍵名稱，例如 `member_id`、`userId` 或 `UserID`，會保持原樣。
- 由一個單字組成且與資料表本身名稱相同（不區分大小寫）的鍵名稱也會保持原樣：`currency` 上的 `currency` 仍為 `currency`。僅僅包含資料表名稱的鍵仍會加上前置詞：`user` 上的 `username` 會變為 `user_username`。

當名稱只包含字母和數字，且沒有大小寫的轉換時，就是一個單字。  
任何其他字元都會將其拆分，因此 `_id`、`order no` 和 `order-no` 都是多個單字。  
大小寫的轉換也會將其拆分，判斷方式與 camelCase 相同：小寫字母後接大寫字母（`userId`）、兩個大寫字母後接小寫字母（`IDCard`、`IDs`），或韓文字母、假名或漢字等沒有大小寫之分的文字與有大小寫之分的字母相鄰（`회원ID`）。  
數字不會拆分單字，因此 `id2` 和 `SHA256` 都是一個單字。以同一種大小寫書寫的複合字也是一個單字：`members` 上的 `memberid` 會變為 `members_memberid`。

除了前後的空格之外，資料表名稱會依其書寫方式使用：保留其大小寫、內部的空格和點，不會轉為單數，且程式碼產生器的 `Table Name Case` 和 `Column Name Case` 不會有任何影響。鍵為 `ID` 的 `Users` 會得到 `Users_ID`。  
複合鍵的每個欄位都會各自命名：鍵為 (`tenant_id`, `id`) 的 `orders` 會加入 `tenant_id` 和 `orders_id`。

子資料表中已有的名稱（不區分大小寫）會加上 `_2`、`_3` 等編號，並採用第一個未被使用的編號。  
從鍵為 `id` 的 `users` 到同一個資料表的第二個關聯會加入 `users_id_2`，而在鍵為 `member_id` 的 `members` 上的自我參照則會加入 `member_id_2`。  
同一個複合鍵的各欄位之間也以相同方式編號，且保持原樣的名稱會優先佔用其位置：鍵為 (`id`, `user_id`) 的 `user` 會為 `user_id` 加入 `user_id`，為 `id` 加入 `user_id_2`。

沒有名稱的父資料表會讓鍵名稱保持原樣，發生衝突時則與其他名稱一樣加上編號。  
沒有名稱的鍵會產生沒有名稱的外鍵欄位。  
這也包括編輯器為沒有主鍵的父資料表所加入的主鍵，除非在按一下子資料表之前先為其命名。

這些名稱會在繪製關聯時決定。之後重新命名父資料表或其鍵，並不會重新命名這些欄位。  
「[對應欄位](#map-columns)」中的 `New column` 列也依相同規則命名，且清單會在選擇之前顯示每個名稱。  
欄位已經就位的關聯（來自匯入、貼上、建立副本，或在「對應欄位」中與現有欄位配對）會保留這些欄位原有的名稱。  
程式碼代理程式以 `erd_add_relationship` 加入關聯時，也會得到相同的名稱和資料類型，請參閱[工具](../../mcp/tools.md#relationships)。

## 解讀連接線 {#reading-a-connector}

- 識別關聯以實線繪製，非識別關聯則以虛線繪製。
- 子端帶有關聯類型的基數符號：Zero One 為一個圓圈和一條短線，Zero N 為一個圓圈和鴉爪，One Only 為兩條短線，One N 為一條短線和鴉爪。
- 當任一外鍵欄位允許 `NULL` 時，父端與 Zero One 一樣是一個圓圈和一條短線；當外鍵欄位全部為 `NOT NULL` 時，則與 One Only 一樣是兩條短線。
- 將指標停留在連接線上時，會醒目顯示該連接線，以及它在兩個資料表中所連結的欄位。

![依序將指標停留在三條連接線上，每條連接線都與其所連結的欄位一起亮起](/img/demo-relationship-hover.webp)

設定了 [ON DELETE 或 ON UPDATE](#on-delete-and-on-update) 的關聯，會在其子端旁帶有一個標籤，例如 `D:C U:R`：先是 `D:` 和 ON DELETE 動作，接著是 `U:` 和 ON UPDATE 動作，各自只在有設定時顯示。  
動作的縮寫沿用 erwin 的表示法：`C` 代表 CASCADE，`R` 代表 RESTRICT，`SN` 代表 SET NULL，`SD` 代表 SET DEFAULT，`NA` 代表 NO ACTION。兩者都未設定的關聯沒有標籤。  
標籤位於遠離子資料表的一側：連接線從該資料表的左側或右側離開時位於線的上方，從頂端或底部離開時位於線的右側，且不會與基數符號重疊。  
標籤以連接線的顏色繪製在一個畫布背景色的小方框上，並與其連接線一起亮起。標籤會繪製在所有連接線之上，因此穿過標籤的線會從其下方經過。  
無論所選資料庫會寫出什麼，標籤顯示的都是儲存在關聯上的動作，因此在 MySQL 上，ON DELETE SET DEFAULT 仍會顯示為 `D:SD`。

將指標停留在設定了任一動作的連接線上時，也會顯示一個工具提示，完整寫出各子句，每行一個，例如 `ON DELETE CASCADE` 和 `ON UPDATE RESTRICT`。  
即使標籤已隱藏，工具提示仍會出現。

前往關聯時會使其亮起：在[物件總管](./explorer.md#going-to-a-row)中選擇資料表的 `Foreign Keys` 資料夾下的一列，或在[差異檢視器](./table-related-functions.md#going-to-a-change)中選擇外鍵列，都會以懸停色繪製其連接線和標籤。在差異檢視器中，它會在包含該關聯的每一側亮起連接線，因此已新增的外鍵只會亮起目前的一側，已移除的外鍵只會亮起已儲存的一側。  
跳至目標時只會選取子資料表及其外鍵欄位，焦點儲存格位於其中第一個欄位上；關聯本身仍永遠不會被選取。關於檢視的移動位置，請參閱[跳至目標時的落點](./table-related-functions.md#where-a-jump-lands)。  
下一次在畫布上按下滑鼠左鍵或右鍵時，亮顯就會熄滅，無論按在空白處、資料表、備忘錄、資料表群組或連接線上，即使該次按下並未改變選取範圍也是如此。在物件總管中前往另一列或另一個搜尋相符項目也會使其熄滅；在差異檢視器中前往另一列時，該列所前往的每一側也是如此。  
以滑鼠中鍵或手形工具平移不會使亮顯熄滅；在物件總管或差異檢視器中摺疊或展開一列、以 `Escape` 清除選取範圍，以及從[快速搜尋](./quick-search.md)或流程模式的外部連結[卡片按鈕](./visualization.md#card-buttons)跳至目標時也是如此。  
亮顯不會被儲存，也不在復原歷程記錄中，且協作者看不到它。

使用 `Relationship` 檢視選項可隱藏 ERD 畫布上的連接線，使用預設為開啟的 `Referential Actions` 檢視選項則可只隱藏其標籤，請參閱[資料表檢視選項](./table-related-functions.md#table-view-options)。  
在資料表收合為只顯示名稱的 `70%` 及以下比例時，不會繪製標籤。  
[圖片匯出](./file-import-export.md#image)一律以 100% 繪製，因此無論畫布的縮放比例為何都會繪製標籤，除非檢視選項將其隱藏。`Background` 關閉時，每個標籤背後的方框也會是透明的。  
「視覺化」索引標籤上的[流程模式](./visualization.md#flow-mode)即使在 `Relationship` 關閉時也會繪製連接線，每條都是一條平滑的灰色實線曲線，端點標記相同，因此本頁所述的虛線、標籤、工具提示、跳至目標後的亮顯和正交路徑只適用於 ERD 畫布。在流程模式中，從資料表連到其本身的關聯同樣會繞過右上角形成曲線，請參閱[連接線路徑](#connector-routing)。

## 連接線路徑 {#connector-routing}

連接線會以正交方式規劃路徑。  
路徑會繞過位於其兩端之間的資料表，而不是穿過它們，且其轉角為圓角。  
每一端都會先從其資料表直線延伸一小段，然後才轉彎，因此相距不遠、連接線兩端對齊的兩個資料表會以一條直線相連，而不會繞路。  
從資料表同一側離開的路徑會分散到不同的通道上，以免彼此重疊。  
只有資料表會被避開：連接線可能會穿過備忘錄或資料表群組的方框，並繪製在資料表群組之上、資料表和備忘錄之下。

從資料表連到其本身的關聯會繪製為一條繞過該資料表右上角的曲線，在父端從頂端離開，在子端從右側進入。  
同一個資料表上的其他自我參照會以巢狀方式位於第一條曲線的外側，因此它們的曲線不會彼此交叉，也不會穿過該資料表。

沒有任何需要設定的項目。  
每當畫布上的任何項目移動或調整大小時，路徑都會自動重新計算，因此永遠不需要手動調整。

![將 members 資料表向下拖曳再拖回時，來自 orders 的連接線在從 categories 右側經過與繞過其左側之間切換，每個轉角都是圓角](/img/demo-connector-routing.webp)
