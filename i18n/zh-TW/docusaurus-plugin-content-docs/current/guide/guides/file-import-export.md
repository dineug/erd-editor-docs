---
sidebar_position: 2
description: 匯入 JSON、結構描述 SQL、GraphQL、DBML 或 AML 以取代圖表或加入至圖表下方，並匯出 JSON、結構描述 SQL，或將圖表匯出為 PNG 或 SVG 圖片。
---

# 匯入或匯出檔案

## 匯入外部檔案 {#importing-external-files}

可以從畫布右鍵選單的 `Import` 子選單匯入五種格式：

- json
- Schema SQL
- GraphQL
- DBML
- AML

位於 `Import` 正下方的 `Import and Add` 會將檔案加入圖表，而不是取代圖表，請參閱[匯入並加入](#import-and-add)。  
空白圖表所顯示的歡迎畫面中有一個 `Import` 列，提供相同的五種格式，請參閱[歡迎畫面](./editing-start.md#welcome-screen)。  
[字典](./dictionary.md)索引標籤的工作表也會透過該索引標籤自己的 `Import CSV`，從 CSV 檔案匯入詞彙、術語和定義域，請參閱[匯入與匯出 CSV](./dictionary.md#importing-and-exporting-csv)。

副檔名的比對不論大小寫。若選取的檔案副檔名與所選格式不符，匯入會取消並顯示 `Only <format> files can be imported`，其中的格式寫作 `json`、`sql`、`graphql`、`dbml` 或 `aml`，例如 `Only sql files can be imported`。

`Import` 會取代目前的文件，而不是合併到其中，執行一次復原即可恢復先前的圖表。  
JSON 檔案會帶入自己的設定，包括其[鎖定](./settings.md#lock)。若檔案鎖定了索引標籤、程式碼產生器的語言、名稱大小寫、引號類型或[名稱顯示](./logical-names.md#name-view)，畫面上仍會顯示您原本的值，但儲存的是檔案中鎖定的值。無論是否鎖定，縮放比例和檢視位置都會採用檔案所指定的值。在鎖定功能推出之前儲存的 JSON 檔案，匯入後所有鎖定都會開啟，檢視則為 100%。在 `Name View` 鎖定推出之前儲存的檔案，無論其記錄了哪些其他鎖定，匯入後該鎖定都會開啟。  
其他格式會保留您現有的設定（包括鎖定），但檢視除外，檢視會從 100% 開始。  
GraphQL、DBML 和 AML 剖析器永遠不會失敗：無法讀取的檔案會產生空白圖表，而不是錯誤。

JSON 檔案也會帶入其資料表和欄位的邏輯名稱，以及其欄位的定義域連結。其詞彙、術語和定義域會取代[字典](./dictionary.md)索引標籤中原有的內容，因此不含任何這類內容的檔案會讓工作表變為空的，而復原該次匯入則會恢復被取代的內容。  
其他格式不含上述任何內容。其資料表匯入時沒有邏輯名稱，也沒有任何欄位連結到定義域，而您的詞彙、術語和定義域會保持不變。復原或重做該次匯入也會讓它們保持不變，因此匯入後對字典所做的編輯會保留下來。這類匯入也會讓每個工作表自己的復原歷程記錄保持不變，而 JSON 匯入則會清空這些歷程記錄，請參閱[字典工作表](./undo-redo.md#dictionary-sheets)。

JSON 檔案會保留其原有的位置。結構描述 SQL、GraphQL、DBML 或 AML 檔案中的資料表，會在圖表變更之前，依其在您目前看到的[名稱顯示](./logical-names.md#beyond-the-canvas)下所佔的寬度完成排列：

- 當檔案有兩個或更多資料表且至少有一個關聯時，這些資料表會以 `Flow` [自動版面配置](./table-related-functions.md#auto-layout)，從畫布左上角開始，沿著關聯由左至右配置。資料表指向自身的關聯也算在內。
- 否則會從左上角開始逐列排列，欄位最少的資料表排在最前面。
- 若版面配置超過 6 秒，會出現顯示 `Placing tables` 的通知，並附有 `Cancel` 按鈕。按 `Cancel`，或在通知顯示期間按 `Escape`，會放棄版面配置，改為將資料表逐列排列。當版面配置失敗、60 秒內沒有傳回版面配置，或主應用程式未執行 shared worker 時，也會改為逐列排列，且不顯示通知，請參閱 [Web Worker](../../api/installation.md#web-workers)。

接著圖表會一次完成取代，因此中間不會顯示任何過渡狀態。在排列資料表期間變更的設定（例如索引標籤）會保留下來；若在此期間匯入另一個檔案，則以最後開始的匯入為準。

唯讀編輯器不會匯入任何內容。它的畫布右鍵選單和快速搜尋都不提供 `Import` 或 `Import and Add`，也不顯示歡迎畫面，而「字典」索引標籤不提供 `Import CSV`。

### 匯入並加入 {#import-and-add}

`Import and Add` 會保留圖表，並在其下方加入檔案。此項目位於畫布的右鍵選單和 ERD 索引標籤的[快速搜尋](./quick-search.md)中，提供與 `Import` 相同的五種格式和相同的副檔名檢查。

![從 Import and Add > Schema SQL 加入 SQL 檔案，其資料表落在圖表下方，沿著關聯配置並處於選取狀態](/img/demo-import-and-add.webp)

檔案會以貼上的方式加入：其中的每個資料表、欄位、關聯、索引、備忘錄和[資料表群組](./table-groups.md)都會以新項目加入，圖表中既有的資料表不會移動，也不會變更任何設定，因此 JSON 檔案的設定會被省略。  
JSON 檔案的資料表和欄位會保留其邏輯名稱，每個物理名稱也會如同在檔案中一樣，仍由字典產生或仍為自行撰寫的名稱，這決定了之後輸入的邏輯名稱是否會產生新的名稱，請參閱[產生物理名稱](./dictionary.md#deriving-physical-names)。檔案的詞彙、術語和定義域會被省略，因此「字典」索引標籤會保持原樣，且加入的欄位都不會連結到定義域：每個欄位都會保留其原有的資料類型。  
名稱與圖表中既有資料表相同的資料表，會以同名的第二個資料表加入，而不會與其合併。關聯和索引只來自該檔案，因此指向檔案未定義之資料表的外鍵，不會連結到圖表中既有的資料表。

加入的區塊會落在圖表所有內容的正下方，並與其左邊緣對齊；若圖表為空白，則落在左上角。以[檢視選項](./table-related-functions.md#table-view-options)隱藏的備忘錄和資料表群組也算在內，因為它們仍佔據該處。  
在區塊內，JSON 檔案會保留自身的排列方式，包括其資料表群組。其他格式則依 `Import` 的方式排列，依相同規則以 `Flow` 配置或逐列排列，且每個資料表群組的方框都會調整為剛好圍住其資料表。加入的資料表和備忘錄會堆疊在所有既有內容的上方。

區塊落下後，只會選取所加入的內容：新的資料表，以及目前顯示中的新備忘錄和資料表群組。若在此期間切換到其他索引標籤，編輯器會在區塊落下之前切換回 ERD 索引標籤。接著檢視會以目前的縮放比例捲動到該區塊，除非該區塊已清楚顯示，請參閱[跳至目標時的落點](./table-related-functions.md#where-a-jump-lands)。執行一次復原即可撤銷整個加入動作。  
剖析器無法讀取的檔案，或既沒有資料表也沒有備忘錄的檔案，不會加入任何內容。

在某個檔案仍在排列期間加入的多個結構描述 SQL、GraphQL、DBML 或 AML 檔案，都會依開始的順序落下。在此期間加入的 JSON 檔案會在讀取完畢後立即落下，排在它們之前。執行 `Import` 或載入另一份文件時，會捨棄仍在排列中的檔案。

程式碼代理程式會透過 MCP 匯入工具的 `append` 模式以相同方式加入檔案，此模式會保留 JSON 檔案的排列方式，但會將其他格式的資料表逐列排列，從不使用 `Flow`，請參閱[匯入](../../mcp/tools.md#import)。

### JSON {#json}

可以匯入採用[編輯器所定義之結構描述格式](../../api/advanced/schema.md)的檔案。
檔案名稱必須以 `.json` 結尾，因此匯出為 `<database name>-<timestamp>.erd.json` 的檔案可以原樣匯入；此處不接受單純的 `.erd` 或 `.vuerd` 檔案。先前版本儲存的檔案也能讀取。

![從 Import > json 匯入已儲存的檔案，連同設定一併取代草稿文件](/img/demo-import-json.webp)

### 結構描述 SQL {#schema-sql}

也可以匯入以 SQL 定義的結構描述檔案。  
雖然剖析器已盡可能做得靈活，不受資料庫廠商影響，但仍可能有部分語法不受支援。  
檔案名稱必須以 `.sql` 結尾。  
[可在此查看支援的語法。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![從 Import > Schema SQL 匯入 SQL 檔案，其資料表沿著關聯配置，接著縮小檢視以涵蓋這些資料表](/img/demo-import-sql.webp)

欄位只會來自 `CREATE TABLE`。以 `ALTER TABLE ... ADD COLUMN` 加入的欄位不會被讀取。  
`CREATE TABLE` 中不是欄位的項目會被略過，而不會被讀取為欄位：未命名的 `CHECK (...)`、PostgreSQL 的 `LIKE` 和 `EXCLUDE`、未寫上 `INDEX` 或 `KEY` 的 MySQL `FULLTEXT` 和 `SPATIAL`、T-SQL 的 `PERIOD FOR`，以及 Oracle 的 `SUPPLEMENTAL LOG DATA`。  
與其中某一項同名的欄位，若名稱後接內建類型（例如 `exclude BOOLEAN`），或名稱加上引號（例如 `"check" int`），仍會匯入。未加引號的 `like` 後接非內建類型時（例如 `like citext`），會被讀取為 PostgreSQL 的 `LIKE` 並略過。  
`CHECK` 條件約束本身不會匯入，因為編輯器沒有可存放它們的位置。

#### 資料類型 {#data-types}

欄位的資料類型會連同引數清單一併保留，即使它不是任何[支援的資料庫](./table-related-functions.md#databases)的內建類型也一樣。  
這包括以 `CREATE TYPE` 建立的列舉或複合類型、以 `CREATE DOMAIN` 建立的定義域、`hstore`、`citext` 和 `ltree` 等擴充功能類型、`public.mood` 等以結構描述限定的名稱，以及 `"MyType"` 和 `[dbo].[Phone]` 等加上引號或方括號的名稱，這些名稱會保留其引號或方括號。`CREATE TYPE`、`CREATE DOMAIN` 和 `CREATE EXTENSION` 陳述式本身會被略過。  
內建類型會去掉其引號或方括號，因此 `[int]` 會匯入為 `int`，`[nvarchar](50)` 會匯入為 `nvarchar(50)`。PostgreSQL 的 `"char"` 和 `"bit"` 會保留引號，因為它們與 `char` 和 `bit` 是不同的類型。  
任何類型的陣列後置詞都會保留：`integer[]`、`text[3][3]`、`integer ARRAY`、`mood[]`。SQLite 的 `UNSIGNED BIG INT` 會完整匯入。  
MySQL 與 MariaDB 的 `UNSIGNED` 和 `ZEROFILL` 若緊接在類型及其引數之後，會依原樣保留為類型的一部分：`INT UNSIGNED`、`SMALLINT(5) UNSIGNED ZEROFILL`、mysqldump 的 `int unsigned`。預設的 `SIGNED` 會被捨棄，因此 `TINYINT SIGNED` 會匯入為 `TINYINT`。寫在其他欄位選項之後的修飾詞（例如 MySQL 會拒絕的 `INT NOT NULL UNSIGNED`）會被捨棄。  
`ENUM(...)` 和 `SET(...)` 的值會保留引號，值中的引號會寫成兩個，例如 `ENUM('a','it''s')`。MySQL 以反斜線逸出的 `'it\'s'` 也會以相同方式改為兩個引號。在 Databricks 的 `STRUCT<...>` 類型中，加上引號的欄位名稱和欄位的 `COMMENT` 會保留其引號。  
未寫類型的欄位（例如沒有類型的 SQLite 欄位或計算的 `AS` 欄位）會維持無類型：`NOT`、`NULL`、`DEFAULT`、`PRIMARY` 或 `REFERENCES` 等關鍵字，或以單引號括住的字串，都不會被讀取為類型。

#### 預設值 {#defaults}

欄位的 `DEFAULT` 會保留其完整的運算式，例如 `now()`、`0.5`、`CURRENT_TIMESTAMP` 或 `ARRAY[]::text[]`，直到下一個欄位選項、逗號或右括號為止。`CASE ... END` 會整段讀取。  
包住整個運算式的括號會被移除，因此 SQL Server 的 `((0))` 會匯入為 `0`，`(getdate())` 會匯入為 `getdate()`。常值的類型轉換也會被移除，因此 pg_dump 的 `'draft'::character varying` 會匯入為 `'draft'`，`NULL::character varying` 會匯入為 `NULL`；其他類型轉換則會保留，例如 `ARRAY[]::text[]` 和 `lower('A'::text)`。  
MySQL 的 `ON UPDATE CURRENT_TIMESTAMP` 會被捨棄，因為欄位沒有可存放它的位置，而它之前的預設值會保留。Oracle 的 `DEFAULT ON NULL 0` 無論是否帶有 `FOR INSERT ONLY` 或 `FOR INSERT AND UPDATE`，都會匯入為 `0`。  
帶有前置詞的字串（例如 `N'x'`、`E'x'`、`B'0'`、`X'ff'`、`U&'x'` 或 `_utf8mb4'x'`）會讀取為一個字串，即使其中含有括號也一樣。

SQL Server Management Studio 會在資料表之後以指令碼寫出預設值，形式為 `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`。這類陳述式會設定該欄位的預設值（此處為 `1`），其條件約束名稱則會被捨棄。

若資料庫只讀取括號內的預設值運算式，結構描述 SQL 匯出時會將括號加回，請參閱[預設值](./schema-sql.md#defaults)。

#### Auto Increment {#auto-increment}

`AUTO_INCREMENT`、`AUTOINCREMENT` 和 `IDENTITY` 會開啟欄位的 `Auto Increment`，`GENERATED ALWAYS AS IDENTITY` 和 `GENERATED BY DEFAULT AS IDENTITY` 也會，且這兩者不會留下預設值。  
預設值為單一 PostgreSQL `nextval()` 呼叫時也是如此，這是 serial 欄位取得的預設值，寫作 `nextval('s')`，或依 pg_dump 的寫法寫作 `nextval('s'::regclass)`。序列名稱不會保留。僅使用序列的預設值（例如 `nextval('s') + 1` 或 SQL Server 的 `NEXT VALUE FOR s`）會維持為一般預設值。  
pg_dump 會將兩者寫在資料表之後，形式為 `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` 和 `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`。任一陳述式都會開啟該欄位的 `Auto Increment` 並清除其預設值。`CREATE SEQUENCE`、`ALTER SEQUENCE` 和其他所有 `ALTER COLUMN` 動作都會被略過。  
以內嵌方式指定為 `serial`、`bigserial` 或 `smallserial` 類型的欄位會保留該類型，且 `Auto Increment` 為關閉。

編輯器只保留 `Auto Increment` 旗標，匯出時各資料庫會寫出各自的形式，請參閱 [Auto Increment](./schema-sql.md#auto-increment)。PostgreSQL 匯出時，無論匯入的是哪種形式，都會在 `smallint`、`integer` 或 `bigint` 欄位上寫出 `GENERATED ALWAYS AS IDENTITY`，而在其他類型（例如 `INT UNSIGNED`）上，只會在資料表之後寫出一行註解。`START WITH 100` 等序列選項會遺失。  
含有多個 serial 或 identity 欄位的資料表，匯入後會有多個自動遞增欄位，而執行其匯出結果時，MySQL、MariaDB 和 SQL Server 會拒絕這樣的資料表。

#### 主鍵 {#primary-keys}

在資料表之後加入的主鍵 `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`，會將其欄位標記為主鍵。  
欄位清單前的 SQL Server `CLUSTERED` 或 `NONCLUSTERED` 和 MySQL `USING BTREE` 會被跳過，因此 SQL Server Management Studio 以指令碼寫出的 `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` 會以 `Id` 為鍵。記憶體最佳化資料表的 `PRIMARY KEY NONCLUSTERED HASH (...)` 無論在 `ALTER TABLE` 或 `CREATE TABLE` 中都不會被讀取。

#### 唯一鍵與索引 {#unique-keys-and-indexes}

涵蓋兩個或更多欄位的 `UNIQUE`，無論採用哪種寫法，都會成為一個唯一索引：`UNIQUE (a, b)`、`UNIQUE KEY n (a, b)`、`UNIQUE INDEX n (a, b)`、`CONSTRAINT n UNIQUE (a, b)`、SQL Server 的內嵌 `INDEX n UNIQUE (a, b)` 和 `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`。  
索引會採用鍵的索引名稱，若無則採用其 `CONSTRAINT` 名稱，兩者皆無則不具名稱，並保留每個欄位的排序順序。這樣的索引即為[替代鍵](./table-related-functions.md#alternate-keys)。  
只涵蓋一個欄位的 `UNIQUE`，無論採用上述哪種寫法，都會改為將該欄位標記為 Unique，且不會加入索引，因此匯出時寫出的 `UQ_<table name>_<column name>` 條件約束，會還原為當初據以寫出的旗標。只涵蓋一個欄位的 `CREATE UNIQUE INDEX` 會維持為唯一索引。

一次加入多個鍵的 `ALTER TABLE`（例如 phpMyAdmin 寫出的 `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`）會保留其中的每個唯一鍵：`uq_a` 會匯入為名為 `uq_a` 的唯一索引，`uq_c` 則匯入為 `c` 的 Unique 旗標。`CONSTRAINT` 名稱只會命名其所在子句中的鍵。MariaDB 的 `ADD UNIQUE INDEX IF NOT EXISTS n (...)`，以及 SQL Server 的 `ALTER TABLE t WITH CHECK ADD ...` 和 `WITH NOCHECK ADD ...` 也能讀取。  
`CREATE INDEX` 和 `CREATE UNIQUE INDEX` 在帶有 `public.t` 和 `[dbo].[t]` 等限定名稱、SQL Server 的 `CLUSTERED` 和 `NONCLUSTERED`、PostgreSQL 的 `CONCURRENTLY`、`IF NOT EXISTS`、`ON ONLY` 和 `USING btree` 時都能讀取，完全沒有索引名稱時也能讀取。SQL Server 的 `ON [PRIMARY]` 檔案群組會被忽略。  
`NULLS NOT DISTINCT` 或 `USING BTREE` 等鍵選項不會被誤認為鍵的名稱。在鍵的欄位清單中，只有第一個字是欄位名稱，因此 `b DESC NULLS LAST`、`b text_pattern_ops` 和 `b COLLATE "C"` 都以 `b` 為鍵，並保留 `DESC` 作為其排序順序。`email(191)` 等前置詞長度會被跳過，但含有運算式部分的鍵（例如 `lower(email)`）會整個略過。

部分唯一索引（`CREATE UNIQUE INDEX ... WHERE ...` 或 SQL Server 的內嵌 `INDEX n UNIQUE (...) WHERE ...`）會匯入為名稱和欄位都相同的一般索引，因為在整個資料表範圍內唯一的鍵，會比檔案所宣告的有篩選條件的鍵更嚴格。例外是僅由鍵欄位上以 `AND` 連接的 `IS NOT NULL` 檢查所組成的篩選條件，這是 SQL Server 讓唯一欄位能存放多個 NULL 所需的篩選條件：這種鍵會維持唯一。  
指定了資料表中不存在之欄位的唯一鍵（例如以 `ALTER TABLE ... ADD COLUMN` 加入的欄位），會整個被捨棄，而不會縮減為現有的欄位。一般索引則會保留現有的欄位。

Oracle 的 SQL Developer 和 `DBMS_METADATA` 會將鍵本身的索引寫成獨立的 `CREATE UNIQUE INDEX`，並以鍵的名稱命名；若是後接 `USING INDEX` 的無名稱鍵，則使用 `SYS_C0012345` 之類的系統名稱。匯入時會將這類索引，以及 `ADD CONSTRAINT ... USING INDEX` 所指定的索引，讀取為其鍵的一部分：複合唯一鍵會匯入為一個唯一索引，主鍵或單一欄位的唯一鍵則會匯入為欄位旗標，不會額外建立索引。之後匯出回 Oracle 時，只會建立一次該索引。

對於 MySQL、MariaDB、MSSQL、Oracle、PostgreSQL 和 SQLite，結構描述 SQL 的匯出結果再匯入後，會得到相同的 Unique 旗標和索引。  
Snowflake 沒有次要索引，因此其匯出結果只會還原唯一鍵：複合唯一鍵還原為唯一索引，單一欄位的唯一鍵則還原為該欄位的 Unique 旗標。Databricks 的匯出結果不會宣告任何唯一性，因此不會還原任何唯一性。

#### 外鍵 {#foreign-keys}

以下列寫法撰寫的外鍵會成為關聯：

- 資料表層級的 `FOREIGN KEY (...) REFERENCES t (...)`，無論是否帶有 `CONSTRAINT name`。
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`，包括 SQL Server Management Studio 以指令碼寫出的 `ALTER TABLE t WITH CHECK ADD ...` 和 `WITH NOCHECK ADD ...`。
- 欄位的內嵌 `REFERENCES t (col)`（例如 `user_id INT REFERENCES users (id)`），以及 SQL Server 和 Snowflake 允許寫在該處的 `FOREIGN KEY REFERENCES t (col)`。參照多個欄位的內嵌參照會被略過。

一個 `ALTER TABLE` 最多只會產生一個關聯，而且只有在其第一個子句加入外鍵時才會產生：同一陳述式中位於 `ADD PRIMARY KEY` 或 `ADD UNIQUE` 子句之後的 `FOREIGN KEY` 子句不會被讀取。當一個陳述式加入多個外鍵時（例如 phpMyAdmin 寫出的 `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`），只會讀取最後一個。

沒有欄位清單的 `REFERENCES t`，在 `t` 的主鍵為單一欄位時會指向該主鍵。若指向的是複合主鍵，該外鍵會被略過。  
當外鍵的被參照欄位一個都找不到，或在兩個資料表中找到的欄位數量不同時（例如只有其中一個資料表缺少某個欄位），該外鍵會被略過，其欄位也都不會被標記為外鍵。當兩個資料表缺少的欄位數量相同時，找到的欄位會依寫出的順序配對，且關聯只包含這些欄位。  
每個匯入的關聯都是 `Zero N`，且當其在子資料表中的每個欄位也都是主鍵時，即為識別關聯。

每個外鍵的 `ON DELETE` 和 `ON UPDATE` 子句會成為關聯的 `On Delete` 和 `On Update`：`NO ACTION`、`RESTRICT`、`CASCADE`、`SET NULL` 或 `SET DEFAULT`，不論大小寫，順序也不拘。沒有這些子句的外鍵會匯入為 `Not set`。關於如何在編輯器中設定，請參閱[編輯關聯](./relationship-editing.md#on-delete-and-on-update)。  
PostgreSQL 在 `SET NULL` 或 `SET DEFAULT` 之後的欄位清單（例如 `ON DELETE SET NULL (a_id)`）會被跳過：該動作會套用到整個鍵，而清單之後的 `ON UPDATE` 仍會被讀取。`MATCH FULL`、`MATCH PARTIAL` 和 `MATCH SIMPLE` 會被略過，MySQL 的 `ON UPDATE CURRENT_TIMESTAMP` 欄位屬性也不會被誤認為動作。  
結構描述 SQL 的匯出結果再匯入時，會帶有該資料庫所寫出的動作，因此該資料庫省略的動作，例如 MySQL 上的 `SET DEFAULT`、Oracle 上的任何 `ON UPDATE`，或 Snowflake 上 `NO ACTION` 以外的任何動作，都會還原為 `Not set`。

#### 註解 {#comments}

資料表和欄位的註解會從剖析器可讀取的三種語法匯入：MySQL、MariaDB、Snowflake 和 Databricks 使用的 `COMMENT` 資料表選項和欄位屬性；PostgreSQL 和 Oracle 使用的 `COMMENT ON TABLE` 和 `COMMENT ON COLUMN` 陳述式；以及 SQL Server 以 `EXEC sp_addextendedproperty` 設定的 `MS_Description` 擴充屬性。  
指定了檔案中未定義之資料表或欄位的註解會被忽略。

SQL Server 的呼叫無論採用具名引數（如 SQL Server Management Studio 以指令碼寫出每個註解的方式：`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`），或採用位置引數（如編輯器的 MSSQL 匯出的寫法），都能讀取。  
只有位於資料表上，或位於其某個欄位上（層級 2）的 `MS_Description` 才會產生註解。其他屬性、檢視、索引或條件約束都不會產生註解，以變數傳入或以 `+` 組成的註解也不會。

在註解中，就如同 `DEFAULT` 值或加上引號的名稱等任何加上引號的文字，兩個連續的引號代表一個引號，這也是 mysqldump 和 pg_dump 的寫法：`'it''s'` 會讀取為 `it's`。  
引號前的反斜線（例如 MySQL 和 MariaDB 寫出的 `'it\'s'`）也會逸出該引號。當此類引號後面接著空白字元、`,`、`;`、`)`、`]`、`:`、`|`、`+` 或檔案結尾時，仍會結束該文字，因此 `'C:\'`、pg_dump 的 `'C:\'::text` 和 T-SQL 的 `'C:\'+name` 都會保留其反斜線。  
`DEFAULT` 值會保留其引號，且無論檔案如何逸出，其中的引號都會改寫為兩個連續的引號：`'it''s'`。  
若匯入時文件的資料庫為 Databricks，單引號文字則改依 Spark 的規則：每個反斜線都會逸出其後的字元，因此 `'C:\\dir'` 會讀取為 `C:\dir`，`\n`、`\t` 和 `\u0041` 等逸出序列會被解碼，而 `DEFAULT` 值會保留為 `'it\'s'`。

各資料庫在匯出時如何寫出註解，以及如何逸出其中的引號，請參閱結構描述 SQL 頁面中的[註解](./schema-sql.md#comments)。  
匯出到 MySQL、MariaDB、PostgreSQL、Oracle、Snowflake 或 MSSQL 的結果，會再匯入為相同的資料表和欄位註解（包括引號），但 Oracle 匯出時省略的空白行除外。Databricks 的匯出結果會以反斜線逸出引號和反斜線，因此只有在選取的資料庫為 Databricks 時，才能完全照原樣讀回。  
註解無法在 SQLite 的匯出與匯入往返過程中保留：SQLite 會將註解寫成一般的 `--` 行，而剖析器不會讀取這些行。  
除了 SQLite 以外，由 `Write logical names into empty comments` 寫入空白註解的邏輯名稱，會再匯入為該資料表或欄位的註解，而不是其邏輯名稱，請參閱[以邏輯名稱作為註解](./schema-sql.md#logical-names-as-comments)。

### GraphQL {#graphql}

可以匯入 GraphQL SDL 文件。  
物件型別定義會成為資料表，`extend type` 區塊會合併到其所擴充的型別中，而介面的欄位會由實作該介面的型別繼承。  
型別為另一個資料表的欄位會成為關聯，而不會成為資料表的欄位，若兩側都是清單，則會建立中介資料表。  
`buyer: User` 這類單數欄位，會優先與另一個型別上名稱以 `By` 加上該欄位名稱結尾的那一個欄位配對（例如 `orderListByBuyer`），比對時不區分大小寫並忽略底線；`buyer2` 這類帶編號的欄位，會去掉編號後以相同方式配對。當兩個資料表之間有多個關聯，或資料表參照自身時，程式碼產生器的 GraphQL 輸出就是以這種方式命名欄位，因此這類輸出再匯入時能還原每個關聯。  
根型別（`Query`、`Mutation`、`Subscription`）、內省型別，以及 `PageInfo`、`*Connection`、`*Edge` 和 `*_aggregate` 等 Relay、federation 和 Hasura 包裝型別，會被視為雜訊而略過。  
`@id`、`@primaryKey`、`@unique`、`@autoincrement`、`@default`、`@map`、`@relation`、`@column`、`@table`、`@index` 和 `@db.*` 指示詞都會生效。  
檔案名稱必須以 `.graphql`、`.gql` 或 `.graphqls` 結尾。Prisma 的 `schema.prisma` 檔案不是 GraphQL 文件，無法在此匯入。

### DBML {#dbml}

可以匯入 DBML 檔案，這是 dbdiagram.io 和 dbdocs 所使用的格式。  
會讀取 `Table`、`TablePartial`、`Ref`、`Enum` 和 `TableGroup` 區塊。`Project` 和獨立的 `Note` 區塊會被略過，且不會影響其周圍的資料表。  
所有 ref 寫法都能接受：`Ref:` 冒號形式、具名 ref、`Ref { }` 區塊形式，以及內嵌的 `[ref: > table.column]` 欄位設定。  
`<>` 多對多 ref 會建立以兩側名稱命名的中介資料表。  
獨立 ref 的 `delete` 和 `update` 設定會成為關聯的 `On Delete` 和 `On Update`，例如 `Ref: users.id < posts.user_id [delete: cascade, update: set null]`。可用的值為 `cascade`、`restrict`、`set null`、`set default` 和 `no action`，不論大小寫。其他任何值或沒有設定時，都會匯入為 `Not set`，而 `color` 等其他設定會被忽略。  
內嵌的 `[ref: ...]` 設定不帶有任何動作，而 `<>` ref 的設定也不會套用到中介資料表上。當同一個外鍵同時以內嵌方式和獨立 ref 宣告時，會保留內嵌的那一個，且不帶動作。  
資料表的 `headercolor` 設定（例如 `Table users [headercolor: #3498DB]`），在值為未加引號的 `#rgb` 或 `#rrggbb` 十六進位色碼時，會成為該資料表的顏色。其他任何值都會被捨棄，而 `TablePartial` 的 `headercolor` 不會傳遞給使用它的資料表。  
每個 `TableGroup` 都會成為一個[資料表群組](./table-groups.md)，其中包含它所列出的資料表，這些資料表每行一個，名稱寫法與 `Ref` 中相同。其 `[color: ...]` 會依與 `headercolor` 相同的規則成為群組的顏色，而其備註和其他設定則會被捨棄。被兩個群組列出的資料表會留在第一個群組中。沒有任何資料表的群組不會被建立，無論是因為它列出的資料表都不是檔案所宣告的，還是只列出已被先前群組取走的資料表。無論資料表排列在何處，群組的方框都會調整為剛好圍住其資料表；當資料表逐列排列時，同一群組的資料表會排在一起。  
檔案名稱必須以 `.dbml` 結尾。

### AML {#aml}

可以匯入 AML（Azimutt Markup Language）檔案。目前的寫法和舊版 v1 的寫法都能接受。  
實體會成為資料表，而巢狀屬性會攤平成以點分隔的欄位名稱，例如 `settings.slug`。  
除非標記為 `nullable`，否則屬性都是 `NOT NULL`；而編輯器沒有對應位置的語法結構，例如 `check`、`type` 和 `tags`，會被捨棄而不會被拒絕。標記為檢視的實體會匯入為一般資料表。  
實體的 `color`（例如 `users {color: red}`）會成為其資料表的顏色。AML 的顏色名稱 `red`、`orange`、`amber`、`yellow`、`lime`、`green`、`emerald`、`teal`、`cyan`、`sky`、`blue`、`indigo`、`violet`、`purple`、`fuchsia`、`pink`、`rose` 和 `gray`，不論大小寫、是否加上引號都能讀取，每個名稱都會讀取為 Tailwind 同名顏色的 500 色階，例如 `red` 為 `#ef4444`。加上引號的十六進位色碼（例如 `"#3498db"`）會原樣保留；未加引號的 `#3498db` 無法讀取，因為 `#` 是 AML 註解的開頭。其他任何值，以及屬性或關聯上的 `color`，都會被捨棄。  
獨立的 `rel` 陳述式（舊版寫法為 `fk`）會將其 `onDelete` 和 `onUpdate` 屬性保留為關聯的 `On Delete` 和 `On Update`，例如 `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`。可用的值為 `cascade`、`restrict`、`set null`、`set default` 和 `no action`，是否加上引號皆可，不論大小寫。其他屬性會被捨棄。  
在 `user_id int -> users(id) {onDelete: cascade}` 這類內嵌關聯上，這些屬性歸屬於所在的屬性（也就是該欄位），因此會被捨棄，關聯則匯入為 `Not set`。  
檔案名稱必須以 `.aml` 結尾。

GraphQL、DBML 和 AML 都是可往返的格式：每一種也都是[程式碼產生器](./code-generator.md)的目標。  
DBML 和 AML 在匯入與匯出兩個方向都會保留每個關聯的 ON DELETE 和 ON UPDATE，請參閱[程式碼產生器](./code-generator.md#on-delete-and-on-update)。GraphQL 兩者都不保留，因此匯入 GraphQL 時兩者都會是 `Not set`。  
DBML 也會在兩個方向保留資料表顏色（不含任何透明度）和每個包含資料表的資料表群組。沒有名稱的群組會還原為 `group_1`、`group_2` 等，重複的群組名稱還原時則會依序加上 `_2`、`_3` 等。AML 只會將資料表顏色保留為最接近的顏色名稱，因此 `#FF8800` 會寫成 `orange`，並還原為 `#f97316`，且 AML 不保留群組。GraphQL 既不保留顏色，也不保留群組。  
這三種格式在兩個方向都不會保留邏輯名稱、定義域連結或字典：程式碼產生器會寫出每個資料表和欄位的物理名稱和資料類型，永遠不會寫出邏輯名稱或定義域。

## 匯出 {#exporting}

畫布右鍵選單的 `Export` 子選單有三個項目：

- json：將圖表依其檔案所含的內容儲存為 `.erd.json`：包括資料表及其欄位和索引、關聯、備忘錄和資料表群組、邏輯名稱和欄位的定義域連結、[字典](./dictionary.md)索引標籤的詞彙、術語和定義域，以及設定，每個[鎖定的設定](./settings.md#lock)都以其鎖定的值儲存。不含任何內容的項目（例如空白文字或空的字典列）會被省略，請參閱[儲存形式與執行階段值](../../api/advanced/schema.md#storage-form-and-runtime-value)。
- Schema SQL：開啟「[結構描述 SQL](./schema-sql.md#saving-or-copying-the-sql)」索引標籤，同時開啟其選項面板，並讓 `Save file` 按鈕取得焦點，因此按 `Enter` 即可將該索引標籤所顯示的 SQL 儲存為 `.sql`。在此之前不會儲存任何內容。
- Image：開啟 `Export image` 對話方塊，可將圖表儲存為 `.png` 或 `.svg`，或以 PNG 格式複製到剪貼簿，請參閱[圖片](#image)。

這三個項目在唯讀編輯器中都能使用，而 `Export` 是其畫布選單所保留的少數項目之一。在那裡，json 寫出的是檔案所持有的設定，而不是只在該畫面上變更的檢視、索引標籤、名稱顯示、資料庫、程式碼設定或 `View Option` 切換，請參閱設定中的[唯讀編輯器](./settings.md#read-only-editors)。  
「字典」索引標籤自己的 `Export CSV` 不在此子選單中，它會將其 `Domains`、`Words` 或 `Terms` 工作表儲存為 CSV 檔案。與這三個項目不同，唯讀編輯器中不提供此項目，請參閱[匯入與匯出 CSV](./dictionary.md#importing-and-exporting-csv)。

結構描述 SQL 會在每個關聯的 `REFERENCES` 之後寫出其 ON DELETE 和 ON UPDATE，ON DELETE 在前。`Not set` 不會寫出任何內容，而選取的資料庫不接受的動作會被省略。關於各資料庫接受哪些動作，請參閱[編輯關聯](./relationship-editing.md#on-delete-and-on-update)。

每個匯出的檔案都會以 `<database name>-<timestamp>` 加上副檔名命名，其中時間戳記採用當地時間，格式為 `yyyy-MM-dd'T'HH_mm_ss`，例如 `my-schema-2026-08-29T04_05_06.erd.json`。資料庫名稱空白時會改用 `unnamed`。  
「結構描述 SQL」索引標籤和[程式碼產生器](./code-generator.md)的 `Save file` 也以相同方式為檔案命名，`Export CSV` 也是如此，它會在時間戳記之後加上工作表：`-words.csv`、`-terms.csv` 或 `-domains.csv`。圖片則採用對話方塊開啟時的資料庫名稱。

`Import`、`Import and Add` 和 `Export` 也可從 ERD 索引標籤的[快速搜尋](./quick-search.md)中使用，其中的項目與畫布的右鍵選單相同。

在 Obsidian 中不會出現下載或儲存對話方塊：檔案會寫入儲存庫中 Obsidian 存放該圖表新附件的位置，並以通知顯示其路徑。  
Obsidian 不允許用於檔案名稱的字元 `\ / : * ? " < > |` 會被取代為 `-`。  
只有在 Settings → Files and links → Detect all file extensions 開啟時，Obsidian 的檔案總管才會列出匯出的 `.erd.json` 或 `.sql` 檔案。

### 圖片 {#image}

從畫布的右鍵選單或快速搜尋選擇 `Export` ▸ `Image`，會開啟 `Export image` 對話方塊：圖片的預覽位於其選項旁邊。已開啟的[物件總管](./explorer.md#dialogs-beside-it)會在變暗的區域下方保持開啟。

![開啟 Export > Image，關閉深色模式和背景，選擇 3x，再將圖片複製到剪貼簿](/img/demo-export.webp)

- `Background`：預設為開啟。關閉時畫布會維持透明。
- `Dark mode`：初始狀態與編輯器的外觀一致。與螢幕上的外觀一致時，圖片會採用畫布本身的顏色，包括在[佈景主題建立器](./language-and-theme.md)中所做的變更；另一種外觀則會使用灰色調與強調色皆相同的預設集。
- `Scale`：`1x`、`2x` 或 `3x`，預設選取 `2x`。它只會設定 PNG 和剪貼簿副本的大小，其下方的一行會以 `PNG <width> × <height> px` 的形式顯示該大小。

這些選擇會保留到編輯器關閉為止，且永遠不會儲存在文件中。預覽的繪製方式與圖片相同，並會在 `Background` 或 `Dark mode` 變更時重新繪製。

圖片包含的是對話方塊開啟時的圖表；關閉後重新開啟對話方塊即可納入之後的變更。其中的資料表和欄位會以編輯器當時顯示的「名稱顯示」命名，即使是 `Name View` 鎖定讓檔案保留另一種顯示方式、而只在您的畫面上切換的顯示方式也一樣，請參閱[畫布以外的地方](./logical-names.md#beyond-the-canvas)。[字典檢查](./dictionary.md#marks-on-the-canvas)在畫布上為名稱設定的顏色不會繪製出來。無論圖表捲動到多遠，圖片都會包含整個圖表，並裁切為圖表所繪製的範圍再加上邊界；而且無論編輯器目前顯示的縮放比例為何，圖片一律以 100% 繪製，因此每個資料表都會完整繪製。[檢視選項](./table-related-functions.md#table-view-options)所隱藏的內容（關聯、關聯的 ON DELETE 和 ON UPDATE 標籤、資料表群組或備忘錄）既不會繪製，也不會保留空間，而資料表群組會繪製在其他所有內容的後方。

有三個按鈕可寫出圖片，且每個按鈕都會讓對話方塊保持開啟：

- `PNG`：儲存一個 `.png`，其大小為圖表在 100% 時的大小乘以 `Scale`。對於大到瀏覽器畫布無法容納的 PNG，會以較低的解析度寫出，而不會失敗：對話方塊會事先以 `Reduced from <width> × <height> px, past what a browser canvas can hold` 發出警告，事後則會以顯示 `Exported at a reduced resolution` 的通知告知。
- `SVG`：儲存一個 `.svg`，其大小為圖表在 100% 時的大小，與 `Scale` 無關，且永遠不會降低解析度。其中的文字會維持為文字，字型只以名稱指定而不內嵌，因此沒有編輯器字型的檢視器會改用其他字型繪製。陰影會被省略。
- `Copy to clipboard`：以選取的 `Scale` 將 PNG 放到剪貼簿上，當瀏覽器畫布無法容納時，會與儲存的 PNG 一樣降低解析度。完成時會以 `Copied the image to the clipboard` 確認，圖片經過降低解析度時則以 `Copied at a reduced resolution` 確認。若因瀏覽器或主應用程式拒絕使用剪貼簿，或圖片無法繪製而複製失敗，`Couldn't copy the image` 會建議改為儲存 PNG。

若主應用程式有執行背景 worker，圖片會在其中繪製，因此在此期間編輯器仍可繼續使用。當繪製時間超過片刻時，會出現顯示 `Exporting PNG`、`Exporting SVG` 或 `Copying image` 的通知，失敗時則會回報 `Couldn't export the PNG` 或 `Couldn't export the SVG`。在檔案仍在繪製時關閉對話方塊，並不會阻止該檔案被儲存。

對話方塊開啟時，`PNG` 會取得焦點，且 `Tab` 會停留在對話方塊內。按 `Escape`、按一下 `x` 按鈕，或按一下其周圍變暗的區域，即可關閉對話方塊。  
對話方塊開啟期間，畫布快速鍵（包括復原和重做）以及複製和貼上都不會有任何作用。`Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 會關閉對話方塊並開啟快速搜尋。`Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 會關閉對話方塊，並將插入點移到[物件總管](./explorer.md#opening-and-closing)的「尋找」輸入框中；若物件總管為關閉狀態，則會將其開啟，但永遠不會將其關閉。在窄到無法顯示物件總管的編輯器中，此按鍵仍會關閉對話方塊，但會顯示快顯通知，而不會移動插入點。
