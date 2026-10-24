---
sidebar_position: 12
description: 在「結構描述 SQL」索引標籤中查看圖表的 DDL，在其選項面板中選擇資料庫、引號、陳述式、標頭、空白註解中的邏輯名稱和資料表，在資料表之前與之後加入自己的指令碼，並儲存或複製 SQL。
---

# 結構描述 SQL

`Schema SQL` 索引標籤會顯示圖表針對所選資料庫的 DDL：也就是建立其資料表及其鍵、索引和外鍵的 SQL。  
在工具列中切換到 `Schema SQL` 索引標籤，或在[快速搜尋](./quick-search.md)的 `Tab` 下選擇 `Schema SQL`。從 `Export` 子選單選擇 `Schema SQL` 也會開啟此索引標籤，並準備好儲存，請參閱[儲存或複製 SQL](#saving-or-copying-the-sql)。

SQL 位於左側，其右側是標題為 `Schema SQL` 的選項面板，其中包含決定 SQL 樣貌的各個選項，請參閱[選項面板](#options-panel)。在由右至左的顯示語言中，SQL 同樣留在左側，並由左至右閱讀。  
除非此索引標籤首次開啟時編輯器的寬度小於 640 px，否則面板會自動開啟。面板標題列中的 `Hide options` 會將其摺疊，程式碼右上角的 `Show options` 則會將其重新開啟。此後，只要編輯器保持開啟，即使切換索引標籤，面板也會維持離開時的開啟或摺疊狀態。它的摺疊與開啟和「程式碼產生器」索引標籤的面板各自獨立，且永遠不會儲存在檔案中。

![開啟 Export > Schema SQL，將陳述式切換為 Drop & re-create、標頭切換為 USE，接著在資料表之前加入一段 SET NAMES 指令碼](/img/demo-schema-sql-options.webp)

在 SQL 上按滑鼠右鍵即可開啟其右鍵選單：

- `Database` 和 `Bracket`，各為一個子選單，會勾選目前的值。
- `Statements` 和 `Header`，各為一個子選單，會勾選目前生效的選項。資料庫不支援的選項會帶有淡化顯示的註記，例如 `not in Oracle`，且不會有任何作用。
- `Options panel`，面板顯示時為勾選狀態，可摺疊或開啟面板。
- `Save file`

此索引標籤開啟期間，快速搜尋會提供 `Database` 和 `Bracket`；只列出該資料庫所支援選項的 `Schema SQL: Statements` 和 `Schema SQL: Header`；以及可摺疊或開啟面板的 `Schema SQL: Options panel`。  
右鍵選單和快速搜尋都不提供 `Write logical names into empty comments`，此選項只位於選項面板中，請參閱[以邏輯名稱作為註解](#logical-names-as-comments)。

SQL 會在此索引標籤開啟時寫出，之後每當面板中的某個選項、資料庫名稱或某段指令碼變更時，都會再次寫出。此索引標籤開啟期間對資料表所做的編輯（例如協作者或程式碼代理程式所做的編輯），要等到離開此索引標籤再回來，或上述其中一項變更時才會顯示。

「[資料表屬性](./table-related-functions.md#table-properties)」有自己的 `Schema SQL` 索引標籤，會顯示單一資料表的 DDL。它一律寫出單純的 `CREATE` 陳述式，不含標頭或指令碼，永遠不會將邏輯名稱寫入空白註解，沒有選項面板，其右鍵選單也只提供 `Database` 和 `Bracket`。

## 選項面板 {#options-panel}

面板包含三組選項，每組各有一個標題：

1. `Saved in the document`：`Database` 和 `Bracket`，請參閱[資料庫與引號](#database-and-bracket)。
2. `This window only`：`Statements`、`Header`、`Write logical names into empty comments`，以及圖表中有[資料表群組](./table-groups.md)時出現的 `Tables`，請參閱[陳述式](#statements)、[標頭](#header)、[以邏輯名稱作為註解](#logical-names-as-comments)和[資料表](#tables)。
3. `Saved in the document · written as is for every database`：`Before tables` 和 `After tables` 指令碼，請參閱[前置與後置指令碼](#before-and-after-scripts)。

面板底部是 `Save file` 和 `Copy`，請參閱[儲存或複製 SQL](#saving-or-copying-the-sql)。

`This window only` 下的選項屬於做出這些選擇的編輯器視窗。它們不會儲存在文件中、不會與協作者共用，也不會記錄到復原歷程記錄中；編輯器關閉或重新載入時會重設，切換索引標籤則會保留。  
`Statements` 的初始值為 `If not exists`，`Header` 的初始值為 `CREATE + USE`，`Write logical names into empty comments` 則初始為關閉。嵌入編輯器的網頁透過 [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) 讀取的 SQL，以及[程式碼代理程式讀取](../../mcp/tools.md#reading-a-document)的 SQL，則改以 `Create` 為初始值，且不含標頭，除非另有要求，否則也不會寫出邏輯名稱。

所選資料庫不支援的選項會以淡化方式留在面板中，並帶有 `Not in <database>` 工具提示，例如 `Not in Oracle`，按下它不會有任何作用。  
此時 SQL 會改用該資料庫支援的最接近形式，且該形式的按鈕會顯示為按下狀態：`If not exists` 退回 `Create`，`CREATE + USE` 退回 `USE`（若資料庫也不支援 `USE`，則退回 `None`），`USE` 則退回 `None`。所做的選擇會保留，因此切換到支援該選項的資料庫時，該選擇就會恢復。

## 資料庫與引號 {#database-and-bracket}

`Database` 是圖表的資料庫，與畫布右鍵選單和程式碼產生器中的 `Database` 是同一個設定，請參閱[資料庫](./table-related-functions.md#databases)。它列出 Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake 和 SQLite，初始值為 MySQL，並會像任何編輯一樣儲存在檔案中。

`Bracket` 設定包住資料表、欄位、條件約束和索引名稱的引號：`SingleQuote`、`DoubleQuote`、`Backtick`，或表示完全不加引號的 `None`，後者為預設值。它和程式碼產生器使用的是同一個設定，請參閱[引號](./code-generator.md#bracket)。  
只以雙引號括住名稱的 Snowflake，在 `None` 以外的任何選項下都會使用雙引號；Databricks 則一律以反引號括住名稱。  
只有在「設定」索引標籤中的 `Bracket Type` 鎖定為關閉時，`Bracket` 才會儲存在檔案中，而新圖表的所有鎖定都是開啟的。鎖定開啟期間，變更會重寫畫面上的 SQL，但檔案會保留鎖定的值，圖表重新開啟時也會使用該值，請參閱[鎖定](./settings.md#lock)。

當資料庫為 Oracle 且 SQL 中含有超過 30 位元組的名稱（Oracle 12.1 及更早的版本會拒絕這類名稱）時，這兩個清單下方會出現一則註記，列出每個這類名稱：`Oracle 12.2+ for names over 30 bytes: <names>`。它會檢查資料表、欄位、結構描述、鍵、索引、序列和觸發程序的名稱。SQL 本身不會變更。

## 陳述式 {#statements}

`Statements` 決定資料表的建立方式：

- `Create` 會寫出單純的 `CREATE` 陳述式。
- `If not exists` 會略過已存在的資料表和索引。MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 支援此選項；MSSQL、Oracle 和 Snowflake 則改為寫出 `Create`。
  - MySQL 會將每個資料表寫成 `CREATE TABLE IF NOT EXISTS`，並將其唯一條件約束、索引和外鍵寫在其中，再將整批陳述式放在 `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` 與 `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;` 之間。
  - MariaDB 會在每個陳述式加上 `IF NOT EXISTS`：`CREATE TABLE`、每個 `UNIQUE` 和 `FOREIGN KEY` 條件約束，以及每個 `CREATE INDEX`。
  - PostgreSQL 會寫出 `CREATE TABLE IF NOT EXISTS` 和 `CREATE INDEX IF NOT EXISTS`，並在重新加入每個外鍵之前，以 `DROP CONSTRAINT IF EXISTS` 將其刪除。
  - SQLite 會寫出 `CREATE TABLE IF NOT EXISTS` 和 `CREATE INDEX IF NOT EXISTS`。
  - Databricks 會寫出 `CREATE TABLE IF NOT EXISTS`，並在重新加入每個外鍵之前，以 `DROP CONSTRAINT IF EXISTS` 將其刪除。
- `Drop & re-create` 會先刪除它寫出的每個資料表，再重新建立，Snowflake 除外。所有資料庫都支援此選項：
  - MySQL 和 MariaDB 會為每個資料表寫出一個 `DROP TABLE IF EXISTS`，並放在同樣那兩行關閉並重新開啟外鍵檢查的陳述式之間。
  - PostgreSQL 會寫出一個列出所有資料表的 `DROP TABLE IF EXISTS`，若清單以外的資料表參照其中某個資料表，此陳述式就會失敗。在 `CREATE + USE` 標頭下，名稱中未指定結構描述的資料表會從該結構描述中刪除，例如 `shop.member`。
  - MSSQL 會寫出一個交易，如按鈕的工具提示 `SQL Server 2016+` 所示，此交易需要 SQL Server 2016 或更新版本。它會先刪除所寫出資料表持有的外鍵，再以一個 `DROP TABLE IF EXISTS` 刪除這些資料表，並在發生錯誤時回復。清單以外的資料表所持有的外鍵仍會阻止刪除。
  - SQLite 會寫出 `PRAGMA foreign_keys=OFF;`（此設定在該連線中會保持關閉），接著為每個資料表寫出一個 `DROP TABLE IF EXISTS`。
  - Oracle 會為每個資料表寫出 `DROP TABLE … CASCADE CONSTRAINTS`，並為每個自動遞增序列寫出 `DROP SEQUENCE`，每個陳述式都放在以一行 `/` 結尾的 PL/SQL 區塊中，並略過資料表或序列不存在時引發的錯誤。
  - Databricks 會為每個資料表寫出一個 `DROP TABLE IF EXISTS`。
  - Snowflake 不會刪除任何內容，而是改為寫出 `CREATE OR REPLACE TABLE`。

`Drop & re-create` 生效期間，面板中會有一則警告列出它所刪除的資料表：`Drops <tables> before creating them. Their rows are lost.`，在 Snowflake 上則為 `Replaces <tables>. Their rows are lost.`  
最多會完整列出五個資料表。超過五個時，警告會列出前四個，並計算其餘的數量，例如 `a, b, c, d, and 3 more tables`。

## 標頭 {#header}

`Header` 會在 SQL 開頭寫出建立或選取其執行所在之資料庫（或結構描述）的陳述式。名稱為圖表的資料庫名稱，也就是在工具列的 `database name` 輸入框中輸入的名稱，並會以 `Bracket` 字元加上引號。

- MySQL 和 MariaDB：`USE` 會寫出 `USE shop;`，`CREATE + USE` 則會在其前面寫出 `CREATE DATABASE IF NOT EXISTS shop;`。
- MSSQL：`USE` 會寫出 `USE shop` 和 `GO`，`CREATE + USE` 則會在其前面寫出 `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` 和 `GO`。
- PostgreSQL 只支援 `CREATE + USE`，會寫出 `CREATE SCHEMA IF NOT EXISTS shop;` 和 `SET search_path TO shop, public;`。
- Oracle 只支援 `USE`，會寫出 `ALTER SESSION SET CURRENT_SCHEMA = shop;`。`CREATE + USE` 會退回此選項，因此在此索引標籤的預設標頭下，Oracle 寫出的就是這一行。
- Snowflake 和 Databricks：`USE` 會寫出 `USE SCHEMA shop;`，`CREATE + USE` 則會在其前面寫出 `CREATE SCHEMA IF NOT EXISTS shop;`。
- SQLite 兩者都不支援，也不會寫出標頭。

在支援 `USE` 或 `CREATE + USE` 的資料庫上，按鈕的工具提示會說明它在該資料庫中寫出的內容，例如 PostgreSQL 上的 `CREATE SCHEMA + SET search_path`。

只有在資料庫名稱為單純的識別碼時才會寫出標頭：以 ASCII 字母（`A`–`Z`、`a`–`z`）或 `_` 開頭，後面接著 ASCII 字母、數字或 `_`。  
其他任何名稱（包括空白名稱）都不會寫出標頭，此時 PostgreSQL 的 `DROP TABLE` 也不會指定結構描述。當生效的標頭不是 `None` 時，`Header` 下方會有一則註記指出這一點：`Database name "<name>" is not a valid identifier.`  
新圖表的資料庫名稱為空白，因此在為其命名之前，面板會顯示 `Database name "" is not a valid identifier.`

## 以邏輯名稱作為註解 {#logical-names-as-comments}

`Write logical names into empty comments` 是 `This window only` 下的開關，會在每種資料庫上，於資料表或欄位的註解為空時，將其[邏輯名稱](./logical-names.md)寫入 DDL。

![在結構描述 SQL 面板中開啟 Write logical names into empty comments，將 order_items 每個欄位的邏輯名稱寫入其空白的 COMMENT，而 members 的註解則保持不變](/img/demo-schema-sql-logical-names.webp)

- 含有文字的註解一律優先：邏輯名稱永遠不會取代它，也永遠不會附加到其中。
- 只有空白字元的註解會被視為空的，因此會在其位置寫入邏輯名稱。空的或只有空白字元的邏輯名稱不會寫出任何內容，該資料表或欄位仍不會有註解。
- 邏輯名稱會寫在資料庫寫出註解的位置，並採用相同的形式，其中的引號也會以相同的方式逸出，請參閱[註解](#comments)。

例如在 MySQL 上，邏輯名稱為 `Member ID` 且沒有註解的欄位 `id` 會寫出 `COMMENT 'Member ID'`，而邏輯名稱為 `Email`、註解為 `Sign-in address` 的欄位 `email` 則會保留 `COMMENT 'Sign-in address'`。

與 `Statements` 和 `Header` 一樣，此開關屬於視窗，且初始為關閉，請參閱[選項面板](#options-panel)。  
匯入時永遠不會將這類註解讀回為邏輯名稱，請參閱[註解](./file-import-export.md#comments)。

## 資料表 {#tables}

只要圖表中至少有一個[資料表群組](./table-groups.md)（無論顯示或隱藏），`This window only` 下方就會出現 `Tables`，每個選項各有一個核取方塊：

- `All`，可勾選或取消勾選所有核取方塊。只有部分核取方塊被勾選時，它會顯示為混合狀態。
- 每個資料表群組各一個核取方塊，依圖表的群組順序排列，顯示群組名稱，沒有名稱的群組則顯示 `unnamed`；群組有顏色時，名稱前會有一個該顏色的圓點。
- `No group`，代表不屬於任何群組的資料表。

所有核取方塊都勾選時，此索引標籤會寫出整個圖表。  
只勾選部分核取方塊時，會寫出已勾選核取方塊的資料表，連同其索引及其持有的外鍵，包括參照未納入之資料表的外鍵。前置與後置指令碼仍會寫出，而 `Drop & re-create`、其警告以及關於長名稱的 Oracle 註記都只涵蓋這些資料表。  
沒有勾選任何核取方塊時，此索引標籤不會寫出任何內容，程式碼上方會顯示提示 `No tables chosen. Check some under Tables.` 此時 `Save file` 會儲存一個空檔案，`Copy` 則會複製空白文字。

與 `Statements` 和 `Header` 一樣，此選擇屬於視窗，請參閱[選項面板](#options-panel)。  
之後新增的群組，只有在當時所有核取方塊都已勾選時，才會以勾選狀態開始。移除群組會一併移除其核取方塊，而移除最後一個群組則會重新勾選全部。  
此選擇只套用於此索引標籤。「資料表屬性」的 `Schema SQL` 索引標籤和 `getSchemaSQL()` 都不受其影響。

## 前置與後置指令碼 {#before-and-after-scripts}

`Before tables` 和 `After tables` 用來存放自己的 SQL，例如放在資料表之前的 `CREATE EXTENSION` 或 `SET` 陳述式，或放在資料表之後的授權、檢視和初始資料。  
它們會儲存在文件中，無論使用哪種資料庫，整個圖表都只有這一組。每段指令碼都會依輸入的原樣寫入 SQL，且永遠不會經過檢查：前置指令碼寫在標頭之後、`DROP` 陳述式和資料表之前，後置指令碼則寫在最末尾。

換行會寫成 LF，指令碼前面的空白行和後面的空白字元會被移除。  
在 MSSQL 上，若指令碼的最後一行不是 `GO`（或帶有計數的 `GO`），會在其後加上一行 `GO`，如兩個輸入框下方的那行文字所述。在 Oracle 上，請自行以一行 `/` 結束 PL/SQL 區塊。

這兩個輸入框會對 SQL 套用語法醒目提示，並隨文字增加而變高。  
編輯會在離開輸入框時（按一下其他位置或切換索引標籤）套用，旁邊的 SQL 和文件也要到那時才會變更。僅按一下進入的輸入框不會變更任何內容。  
指令碼的編輯和其他任何編輯一樣會變更圖表：它會儲存在檔案中，協作者也會看到，且每次套用的編輯都算作[復原歷程記錄](./undo-redo.md)中的一個步驟，可在 ERD 索引標籤中復原。  
在輸入框中輸入時，編輯器本身的快速鍵會交由輸入框處理，因此 `Ctrl + Z` (Windows/Linux) 或 `⌘ + Z` (Mac) 會復原在其中輸入的內容，而複製、剪下和貼上會作用於文字而非圖表。  
快速搜尋和[物件總管的搜尋](./find-and-replace.md)仍可透過各自的快速鍵開啟，也就是 `Ctrl + K` 和 `Ctrl + F` (Windows/Linux) 或 `⌘ + K` 和 `⌘ + F` (Mac)。由於 `Ctrl + F` 或 `⌘ + F` 會切換到 ERD 索引標籤，因此它會和任何索引標籤切換一樣套用所做的編輯。  
沒有鍵盤焦點的輸入框會跟隨協作者或[程式碼代理程式](../../mcp/tools.md#settings)對其指令碼所做的變更。目前所在的輸入框若在未輸入任何內容的情況下離開，會在離開時顯示該變更。若有輸入，離開時會套用您的文字並取代對方的內容。

## 儲存或複製 SQL {#saving-or-copying-the-sql}

面板底部或右鍵選單中的 `Save file` 會將此索引標籤顯示的 SQL 原樣儲存為 `<database name>-<timestamp>.sql`，包括其目前的資料庫、引號、陳述式、標頭、邏輯名稱註解、資料表和指令碼。其命名與儲存方式和其他所有匯出相同，請參閱[匯出](./file-import-export.md#exporting)。

畫布右鍵選單或快速搜尋中的 `Export` ▸ `Schema SQL` 本身不會儲存任何內容。  
它會切換到此索引標籤，即使選項面板已摺疊也會將其開啟，並將鍵盤焦點放在 `Save file` 上，因此按 `Enter` 即可儲存檔案。

面板底部的 `Copy`，或將指標停留在程式碼上時其右上角出現的複製按鈕，都會複製 SQL。  
帶有勾號的 `Copied!` 快顯通知會顯示兩秒以示確認。若瀏覽器或主應用程式拒絕存取剪貼簿，則會改為顯示帶有警告符號的 `Couldn't copy to the clipboard` 快顯通知，持續五秒。再次複製會取代原本的快顯通知，而不會再新增一則。  
SQL 也可以選取，因此可以只取用其中一部分。

## DDL 寫出的內容 {#what-the-ddl-writes}

無論編輯器在何處寫出結構描述 SQL，以下規則都適用：此索引標籤及其檔案，以及嵌入編輯器的網頁或程式碼代理程式讀取的 SQL。  
「資料表屬性」的 `Schema SQL` 索引標籤也會對其顯示的那一個資料表遵循這些規則。它不會寫出 Oracle 的序列或觸發程序，也不會寫出外鍵（但 SQLite 位於其 `CREATE TABLE` 之內的外鍵除外）。它也不會寫出 PostgreSQL、Oracle 和 MSSQL 放在資料表之後的註解陳述式，因此在這三種資料庫上不會顯示任何註解。

各部分依下列順序排列，彼此間隔一個空白行：標頭、前置指令碼、`DROP` 陳述式、資料表和後置指令碼。資料表依名稱順序寫出。  
沒有資料表也沒有指令碼的圖表不會寫出任何內容，即使選擇了標頭也一樣。

無論[名稱顯示](./logical-names.md#name-view)顯示的是什麼，資料表和欄位都會以其物理名稱寫出。連結到定義域的欄位會以其自身的資料類型寫出，該類型由定義域設定，請參閱[定義域與資料類型](./dictionary.md#domains-and-data-types)。

### Auto Increment {#auto-increment}

標示為 `Auto Increment` 的欄位會依各資料庫的寫法寫出：MySQL 和 MariaDB 為 `AUTO_INCREMENT`，MSSQL 為 `IDENTITY(1,1)`，Snowflake 為 `AUTOINCREMENT`，PostgreSQL 和 Databricks 則為 `GENERATED ALWAYS AS IDENTITY`。  
Oracle 則會得到序列 `SEQ_<table>`，以及從該序列填入欄位值的觸發程序 `SEQ_TRG_<table>`。觸發程序以一行 `/` 結尾，因此 SQL\*Plus 和 SQLcl 會執行它。

若資料庫不接受在該欄位的類型上使用自動遞增，該子句會被省略，並在資料表之後以一行註解指出該欄位：

- PostgreSQL 只在 `smallint`、`integer` 或 `bigint` 上接受它，可使用它們的任何名稱：`INT`、`INTEGER`、`BIGINT`、`SMALLINT`、`INT2`、`INT4` 或 `INT8`。其他類型的欄位既不會加上該子句，也不會加上預設值，註解內容例如 `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks 只在 `BIGINT` 或 `LONG` 上接受它。
- SQLite 只在資料表唯一的主鍵欄位為整數類型（例如 `INT`、`BIGINT` 或 `INT8`，無論是否指定寬度）時接受 `AUTOINCREMENT`。該欄位會寫成 `INTEGER`，鍵則寫成 `PRIMARY KEY (id AUTOINCREMENT)`。其他任何類型的單一鍵寫出時都不會帶有它。

### 參照動作 {#referential-actions}

各資料庫會寫出哪些 ON DELETE 與 ON UPDATE 動作，列於 [ON DELETE 與 ON UPDATE](./relationship-editing.md#on-delete-and-on-update) 中。  
當 Snowflake 省略某個動作時，該外鍵的 `ALTER TABLE` 上方會有一行註解指出該動作，例如 `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### 以結構描述限定的資料表名稱 {#schema-qualified-table-names}

當 `Bracket` 為 `None` 時，含有點的資料表名稱（例如 `sales.users`）會被視為結構描述和資料表，並在方括號或雙引號之外的最後一個點處分割。

- MySQL、MariaDB、MSSQL、Oracle 和 PostgreSQL 只以資料表部分建立其寫出的自動名稱：五者都有 `FK_users_TO_orders` 和 `IDX_users`，PostgreSQL 以外都有 `UQ_users_email`，而 MSSQL 和 Oracle 這兩個會為主鍵命名的資料庫還有 `PK_users`。在這兩者上，`[sales].[users]` 和 `"sales"."users"` 也會得到 `PK_users`，`[Order]` 則會得到 `PK_Order`。
- SQLite 不會為條件約束命名，因此它建立的唯一自動名稱是索引名稱：`CREATE INDEX sales.IDX_users ON users`。
- Oracle 會在資料表所屬的結構描述中建立資料表的索引，以及自動遞增欄位的序列和觸發程序：`sales.IDX_users`、`sales.SEQ_users` 和 `sales.SEQ_TRG_users`。
- 在 Oracle 和 SQLite 中，自行為索引名稱指定的結構描述會予以保留。
- 與先前名稱重複（不區分大小寫）的自動外鍵名稱或索引名稱會加上編號。當 `orders` 同時參照 `sales.users` 和 `hr.Users` 時，第二個鍵為 `FK_Users_TO_orders1`。

在其他任何 `Bracket` 下，整個資料表名稱都是單一識別碼，例如 `"PK_sales.users"`。Snowflake 和 Databricks 一律保留完整名稱。  
「[索引](./table-related-functions.md#indexes)」索引標籤中的 `Keys` 列也會顯示相同的名稱。

### 預設值 {#defaults}

欄位的預設值會依輸入的原樣寫出，但若資料庫只在括號內才會讀取該運算式，則會為其加上括號。已經在括號內的預設值會維持原樣。

- MySQL 會為常值或目前時間以外的任何內容加上括號，例如 `(uuid())`。它也會為 `BLOB`、`TEXT`、`JSON`、空間類型或 `LONG…` 欄位上 `NULL` 以外的任何預設值加上括號，並為 `TIMESTAMP` 或 `DATETIME` 以外任何欄位上的目前時間加上括號。
- MariaDB 會為常值、目前時間、函式呼叫或名稱以外的任何內容加上括號。
- SQLite 會為常值或名稱以外的任何內容加上括號，例如 `(datetime('now'))`。
- PostgreSQL 只會為在括號外含有 `AT TIME ZONE`、`AND`、`OR`、`IS`、`IN`、`LIKE`、`COLLATE` 或 `= ANY` 等字詞的運算式加上括號，例如 `(now() AT TIME ZONE 'utc')`。
- MSSQL、Oracle、Snowflake 和 Databricks 會依輸入的原樣寫出所有預設值。

### 註解 {#comments}

資料表或欄位不是空白的註解，或 [`Write logical names into empty comments`](#logical-names-as-comments) 在其位置寫入的邏輯名稱，會依各資料庫寫出註解的方式寫出：

- MySQL 和 MariaDB 會以內嵌方式寫出：欄位以 `COMMENT 'Member ID'` 結尾，資料表則以 `) COMMENT 'Members';` 結束，在 MySQL 的 `If not exists` 批次中也是如此。
- Snowflake 會以內嵌方式寫出欄位的註解 `COMMENT 'Member ID'`，資料表的註解則在右括號之後獨立成一行：`COMMENT = 'Members';`。
- Databricks 會以內嵌方式寫出欄位的註解，資料表的註解則在 `USING DELTA` 之後寫成 `COMMENT 'Members';`。
- PostgreSQL 會緊接在資料表的 `CREATE TABLE` 之後寫出 `COMMENT ON TABLE member IS 'Members';` 和 `COMMENT ON COLUMN member.id IS 'Member ID';`。Oracle 會在資料表、其唯一條件約束，以及其自動遞增序列和觸發程序之後寫出相同的陳述式。
- MSSQL 會在資料表及其唯一條件約束之後，為每個資料表和每個欄位各寫出一次呼叫，每次呼叫後面都接著 `GO`：`EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`，欄位則會再加上 `'column', 'id'`。  
  文字為國家字元常值 `N'…'`，因此 SQL Server 會保留資料庫字碼頁以外的文字（例如韓文），而不會將其儲存為問號。  
  當 `Bracket` 為 `None` 時，名為 `sales.users` 的資料表會得到結構描述 `sales` 和資料表 `users`，`[sales].[users]` 和 `"sales"."users"` 也是如此，其方括號和雙引號會被移除。沒有結構描述的名稱屬於 `dbo`。位於結構描述之前的部分（例如 `shop.sales.users`）會執行該資料庫的程序 `shop.sys.sp_addextendedproperty`。在其他任何 `Bracket` 下，整個名稱都是資料表，屬於 `dbo`。
- SQLite 不保存註解，因此會將每個註解寫成其所描述內容上方的一行 `--`：`CREATE TABLE member` 上方的 `-- Members`，以及欄位上方的 `-- Member ID`。

加上引號的註解中的引號會重複一次，例如 `'it''s'` 和 `N'it''s'`，MSSQL 呼叫所傳遞的名稱中的引號也是如此。Databricks 則改以反斜線逸出引號和反斜線，例如 `'it\'s'`，這是每個 Spark 版本都能讀取的形式。SQLite 的 `--` 行不加引號，因此會依輸入的原樣保留引號：`-- it's`。  
除此之外，文字會依輸入的原樣寫出（包括換行），但有兩種資料庫例外：

- Oracle 會省略空白行（只有空格或定位字元的行也算作空白行），因為 SQL\*Plus 會在空白行處結束陳述式，並略過其餘部分。由 `Members`、一個空白行和 `Active only` 組成的資料表註解，會寫成 `COMMENT ON TABLE member IS 'Members`，並在下一行寫出 `Active only';`。
- SQLite 會將每段連續的換行寫成一個空格，因為換行會結束 `--` 行，並將其餘部分當作 SQL 執行。同一個註解會寫成 `-- Members Active only`。

這些註解在匯入時如何讀回，在[註解](./file-import-export.md#comments)中說明。

## 唯讀編輯器 {#read-only-editors}

在 `readonly` 編輯器中，此索引標籤會照常運作：`Database` 和 `Bracket` 仍會變更顯示的 SQL，`Statements`、`Header`、`Write logical names into empty comments` 和 `Tables` 仍可使用，`Save file` 和 `Copy` 也仍可儲存和複製 SQL。  
只有兩個指令碼輸入框是唯讀的。
