---
sidebar_position: 4
description: erd-editor MCP 伺服器提供的每個工具：逐頁讀取文件、54 個編輯工具、erd_batch，以及結果與拒絕的樣子。
---

# 工具

伺服器提供 63 個工具：五個工作階段工具、三個讀取工具、54 個編輯工具（每種編輯操作各一個），以及將多個編輯工具當作一次編輯執行的 `erd_batch`。

除了 `erd_list_documents` 之外，每個工具都以文件的 `path` 作為第一個引數，下方的表格會將其省略。
標有 `?` 的引數為選用。

## 工作階段工具 {#session-tools}

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_list_documents` | | 列出 ERD 文件及其 `path`、`open`、`active`、`dirty` 和 `readonly`：若有編輯器為工作目錄提供服務，列出的是該編輯器的文件（在 JetBrains IDE 中涵蓋所有開啟的專案），否則列出工作目錄下的 ERD 檔案。 |
| `erd_open_document` | `create?` | 開啟文件以供編輯，若有編輯器為其提供服務，則在該編輯器的 ERD Editor 中開啟。使用 `create` 時，若檔案不存在會先建立檔案，且沒有副檔名的名稱會加上 `.erd.json`。 |
| `erd_save` | | 儲存編輯器所持有的文件。VS Code 會讓代理程式的編輯保持未儲存，直到呼叫此工具為止；Obsidian 和 JetBrains IDE 會像儲存您的編輯一樣儲存這些編輯，而此工具會立即將其寫入。在無介面模式下，每次編輯都已寫入，此工具不會有任何作用。 |
| `erd_undo` | | 還原此代理程式所做的最後一次編輯，絕不會還原您的編輯。未產生復原步驟的呼叫會被略過並列出。 |
| `erd_redo` | | 重新套用 `erd_undo` 最近一次還原的編輯。 |

關於儲存與復原在各模式下的行為，請參閱[即時與無介面](./live-and-headless.md)。

## 讀取文件 {#reading-a-document}

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | 設定與數量，接著是一頁資料表及其索引與關聯，每個資料表附有其 id、在畫布上的位置與大小、欄位數，以及所屬的資料表群組（若有）。除非是在搜尋，否則資料表之後會依序接著資料表群組和備忘錄。 |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | 所指定實體的完整內容：資料表附有其欄位與所屬資料表群組，關聯附有其欄位及其 `onDelete` 與 `onUpdate`，索引附有其欄位，備忘錄附有其文字，資料表群組附有其資料表。 |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | 以四種格式中的一種一次讀取整份文件，或僅讀取部分資料表或資料表群組的 DDL。 |

代理程式會使用 `erd_list` 找出 id，使用 `erd_get` 讀取欄位和其他詳細資料，再將這些 id 傳給編輯工具。
`erd_list` 中資料表的大小是它在畫布上所佔的方框：高度是精確值，寬度是近似值。
資料表群組以其儲存的矩形列出，並附有其名稱、顏色和所含資料表的數量。
每個關聯只會列出一次，隨其兩個資料表中的一個列出。
`erd_list` 和 `erd_read` 回報的設定是檔案所儲存的設定，請參閱[設定](#settings)。

`erd_read` 接受以下四種格式之一：

| `format` | 傳回內容 |
| --- | --- |
| `snapshot` | 精簡的 JSON，包含每個實體及其 id（含資料表群組），以及設定與結構描述 SQL 指令碼。它會省略因檢視者而異的內容：測量出的寬度、堆疊順序、檢視和索引標籤。結構描述龐大時，內容也會很大。 |
| `sql` | 八種資料庫之一的 DDL：`Databricks`、`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`Snowflake` 或 `SQLite`。`vendor` 預設為文件所設定的資料庫。整份文件的 DDL 包含其前置與後置指令碼。使用 `tableIds`、`tableNames` 或 `groupNames` 時，僅包含這些資料表及其所含的外鍵，且不含指令碼。外鍵會帶有其 ON DELETE 和 ON UPDATE 動作，但目標資料庫會省略的動作除外，請參閱 [ON DELETE 與 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。 |
| `json` | 與儲存時寫入檔案的內容完全相同的整份文件，包含編輯器尚未儲存的任何編輯，請參閱[儲存形式與執行階段值](../api/advanced/schema.md#storage-form-and-runtime-value)。 |
| `scripts` | 僅包含文件的前置與後置指令碼，格式為 `{"before":"…","after":"…"}`，未設定者為空，不論結構描述有多大。 |

只有 `sql` 格式接受 `vendor`、`statements`、`header`、`tableIds`、`tableNames` 和 `groupNames`，其他格式會拒絕這些引數。

- `statements`：`create`（預設值）；`ifNotExists`，在 MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 上寫出 `CREATE TABLE IF NOT EXISTS`，在其他資料庫上寫出一般的 `CREATE TABLE`；或 `recreate`，會先刪除資料表再建立，而 Snowflake 則改為寫出 `CREATE OR REPLACE TABLE`。
- `header`：`none`（預設值）；`use`，會選取文件的資料庫名稱所指定的資料庫或結構描述；或 `createAndUse`，會先建立它。Oracle 只有 `use`，因此 `createAndUse` 在 Oracle 上會寫出 `use`；PostgreSQL 只有 `createAndUse`，因此 `use` 在 PostgreSQL 上不會寫出標頭。SQLite 不會寫出標頭，而當資料庫名稱為空白或不是單純的識別碼時，任何資料庫都不會寫出標頭。
- `groupNames`：所指名資料表群組中的資料表，依名稱指定且不論大小寫，並與 `tableIds` 和 `tableNames` 合併。不符合任何群組的名稱會以 `notFound` 拒絕。不含任何資料表的群組不會加入任何資料表，而最後完全沒有資料表的讀取（例如所指名的每個群組都是空的，且未指名任何資料表時）會以 `invalidArgs` 拒絕。

`statements` 和 `header` 也適用於部分資料表的 DDL。它們的運作方式與編輯器「[結構描述 SQL](../guide/guides/schema-sql.md#options-panel)」索引標籤中的 `Statements` 和 `Header` 選項相同，不過該索引標籤一開始是 `If not exists` 和 `CREATE + USE`。
名稱會使用檔案所儲存的引號類型加上引號，`Bracket Type` 鎖定期間則使用鎖定的引號類型，請參閱[鎖定](../guide/guides/settings.md#lock)。

### 大型結構描述 {#large-schemas}

包含數百或數千個資料表的結構描述也能正常運作。
一次讀取最多回應 40,000 個字元，低於 Claude Code 會將工具結果另存為檔案的門檻。

- `erd_list` 預設每頁回應 100 個項目，先是資料表，接著是資料表群組，然後是備忘錄，並以 `nextOffset` 和 `note` 指出下一頁的起點。將該 `nextOffset` 作為 `offset` 傳入，並搭配相同的 `query`。
- `query` 會依資料表或欄位的名稱或註解中的字詞尋找資料表，不論大小寫。名稱中包含越多這些字詞的資料表排得越前面。搜尋不會列出資料表群組或備忘錄。
- `namesOnly` 只列出資料表名稱，一次回應約可容納 2,000 個簡短名稱。
- `erd_get` 和 `erd_read` 除了 id 之外也接受 `tableNames`，而 `erd_read` 還接受 `groupNames`，因此當代理程式被要求針對大型結構描述撰寫 SQL 查詢時，會只讀取所需資料表的 DDL。
- `erd_get` 會將未指向任何項目的 id 和名稱列在 `missing` 下，並將一次回應容納不下的 id 列在 `notReturned` 下，以便再次要求。
- 單次回應容納不下的讀取會以 `tooLarge` 拒絕，並附上縮小範圍的方法。

## 編輯工具 {#edit-tools}

id 來自 `erd_list` 和 `erd_get`，或來自建立該實體之呼叫的 `createdIds`。
新的 id 由 25 個小寫英文字母和數字組成，例如 `03h17be2plxpj5n59tqag7ogj`，而文件中既有的 id 會保留原本的形式，因此請勿從 id 的形式推斷任何含義。
`x` 和 `y` 是畫布上的左邊緣和上邊緣，以像素為單位；顏色是 CSS 十六進位色碼（例如 `#3b82f6`），或是會移除顏色的空字串。

### 資料表 {#tables}

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_add_table` | | 在空位新增一個空的資料表，並在 `createdIds` 中傳回其 id。 |
| `erd_remove_table` | `tableId` | 移除資料表及其欄位、索引和所有與其相連的關聯。 |
| `erd_change_table_name` | `tableId`, `value` | 重新命名資料表。 |
| `erd_change_table_comment` | `tableId`, `value` | 設定資料表的註解。空字串會清除註解。 |
| `erd_change_table_color` | `tableId`, `color` | 設定資料表的顏色。 |
| `erd_move_table` | `tableId`, `x`, `y` | 將資料表移到畫布上的某個位置。 |
| `erd_move_tables` | `positions` | 以一次編輯移動多個資料表，一次 `erd_undo` 即可還原。`positions` 為每個資料表包含一個 `{ tableId, x, y }`，每個資料表最多出現一次。 |
| `erd_sort_tables` | | 將所有資料表在畫布上排成數列，欄位最少的排在最前面，排列方式與 `erd_import_sql`、`erd_import_graphql`、`erd_import_dbml` 和 `erd_import_aml` 相同。同一資料表群組的資料表會保持在一起，且每個群組的方框會調整為剛好包住這些資料表。 |

### 欄位 {#columns}

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | 在資料表中新增一個空的欄位，並在 `createdIds` 中傳回其 id。 |
| `erd_remove_columns` | `tableId`, `columnIds` | 從一個資料表中移除欄位，以及使用這些欄位的關聯和索引項目。 |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | 重新命名欄位。 |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | 設定資料類型，例如 `INT` 或 `VARCHAR(255)`。當「[關聯資料類型同步](../guide/guides/settings.md#relationship-datatype-sync)」開啟時，變更會如同在編輯器中一樣沿著關聯雙向傳遞：serial 類型會以其所儲存的整數類型傳到外鍵（與 `erd_add_relationship` 複製它的方式相同），而當 serial 鍵的某個外鍵變更時，該鍵會保留其類型，變更也就在此停止。此同步由使用者決定開啟或關閉，`erd_list` 會將其回報為 `relationshipDataTypeSync`。 |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | 以 SQL 文字設定預設值。空字串會清除預設值。 |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | 設定註解。空字串會清除註解。 |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` 會讓欄位成為主鍵的一部分，`false` 會將其從主鍵中移出。 |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | 設定欄位是否唯一。 |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | 設定欄位是否為 `NOT NULL`。 |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | 設定欄位是否自動遞增。 |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | 在欄位所屬的資料表內，將欄位移到另一個欄位的位置。 |

### 關聯 {#relationships}

`relationshipType` 是子端的基數：`ZeroOne`、`ZeroN`、`OneOnly` 或 `OneN`。
起點資料表是父資料表，也就是持有主鍵的被參照端，終點資料表則是子資料表。
`onDelete` 和 `onUpdate` 是外鍵的 ON DELETE 和 ON UPDATE 動作：`none`、`noAction`、`cascade`、`setNull`、`setDefault` 或 `restrict`。
`none` 不會寫出任何子句，因此會套用資料庫的預設行為，請參閱 [ON DELETE 與 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。
`erd_add_relationship` 或 `erd_link_columns` 中省略的動作為 `none`。

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | 為兩個資料表建立關聯。它會將父資料表的主鍵複製到子資料表中作為外鍵欄位，若父資料表沒有主鍵，會先建立一個主鍵欄位。每個外鍵欄位的命名方式與在編輯器中繪製關聯時相同：`users` 的鍵 `id` 會產生 `users_id`，而 `member_id` 這類的鍵會保留其名稱，請參閱[外鍵欄位名稱](../guide/guides/relationship-editing.md#foreign-key-column-names)。每個外鍵欄位都會複製其鍵的資料類型，但 serial 鍵會產生其所儲存的整數類型（例如 `serial4` 會產生 `integer`），而單純的 `serial` 在 PostgreSQL、MySQL 和 MariaDB 以外會維持為 `serial`，請參閱[識別關聯](../guide/guides/relationship-editing.md#identifying-relationships)。`createdIds` 依序包含新建立的鍵欄位（若有建立）、外鍵欄位，最後是關聯 id。 |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | 在現有的欄位之間繪製關聯，依位置配對起點欄位與終點欄位。它不會重新命名任何欄位，也不會變更任何資料類型。 |
| `erd_remove_relationship` | `relationshipId` | 移除關聯線。其外鍵欄位會留在資料表中。 |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | 變更關聯的基數。 |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | 設定關聯的 ON DELETE 動作：刪除父資料列時，對其子資料列的處理方式。 |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | 設定關聯的 ON UPDATE 動作：變更父鍵時，對其子資料列的處理方式。 |

`erd_add_relationship` 會在執行時為外鍵欄位命名，因此請先為父資料表及其主鍵命名。

沒有任何工具能像編輯器的「[對應欄位](../guide/guides/relationship-editing.md#map-columns)」那樣變更現有關聯的欄位。
若要將關聯對應到其他欄位，可在同一個 `erd_batch` 中執行 `erd_remove_relationship`（會將其外鍵欄位留在資料表中）和帶有所需欄位的 `erd_link_columns`，一次 `erd_undo` 即可還原該批次。

### 索引 {#indexes}

索引欄位 id 是 `erd_get` 所提供的索引欄位清單中某個項目的 id，而不是資料表欄位的 id。

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_add_index` | `tableId` | 在資料表中新增一個空的索引，並在 `createdIds` 中傳回其 id。 |
| `erd_remove_index` | `indexId` | 移除索引。 |
| `erd_change_index_name` | `indexId`, `value` | 重新命名索引。 |
| `erd_set_index_unique` | `indexId`, `value` | 設定索引是否唯一。 |
| `erd_add_index_column` | `indexId`, `columnId` | 加入索引所屬資料表中的一個欄位，並傳回新的索引欄位 id。已在索引中的欄位會維持不變。 |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | 從索引中移除一個欄位。 |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | 在索引內將一個欄位移到該索引另一個欄位的位置。 |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | 設定索引中一個欄位的排序順序（`ASC` 或 `DESC`）。 |

### 備忘錄 {#memos}

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_add_memo` | | 在空位新增一個空的備忘錄，並在 `createdIds` 中傳回其 id。 |
| `erd_remove_memo` | `memoId` | 移除備忘錄。 |
| `erd_change_memo_value` | `memoId`, `value` | 取代備忘錄的文字。 |
| `erd_change_memo_color` | `memoId`, `color` | 設定備忘錄的顏色。 |
| `erd_move_memo` | `memoId`, `x`, `y` | 將備忘錄移到畫布上的某個位置。 |
| `erd_resize_memo` | `memoId`, `width`, `height` | 調整備忘錄的大小。寬度至少須約 `116` 像素，高度至少須 `100`。此工具不會產生復原步驟，因為編輯器只會記錄透過拖曳進行的備忘錄大小調整。 |

當備忘錄透過 [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` 隱藏時，`erd_add_memo` 仍會新增備忘錄，且新增的備忘錄會保持隱藏，直到備忘錄再次顯示為止。
`erd_list` 和 `erd_get` 也會列出隱藏的備忘錄。

### 資料表群組 {#table-groups}

資料表群組是繪製在其資料表後方的具名方框，其顏色會顯示在方框上，也會橫跨其資料表的表頭，請參閱[資料表群組](../guide/guides/table-groups.md)。
一個資料表最多只屬於一個群組。無論 `erd_move_table`、`erd_move_tables` 和 `erd_move_table_group` 將資料表放在何處，都不會改變群組所含的資料表；而在編輯器中，資料表會依其放置的位置加入或離開群組，請參閱[加入與移出資料表](../guide/guides/table-groups.md#adding-and-removing-tables)。`erd_add_table_group` 和 `erd_set_table_group` 會將資料表放入群組，而 `erd_remove_table_group` 會使其資料表不屬於任何群組。
群組會儲存一個矩形，寬至少 `160` 像素、高至少 `100`（含標題列），而編輯器繪製的方框會擴大到足以容納其中的每個資料表。

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | 新增群組，並在 `createdIds` 中傳回其 id。傳入 `tableIds` 或矩形（同時傳入 `x`、`y`、`width` 和 `height`），兩者擇一。使用 `tableIds` 時，每個資料表會離開其原本所屬的群組，且矩形會像[將所選資料表組成群組](../guide/guides/table-groups.md#grouping-selected-tables)時一樣調整為包住這些資料表。矩形會納入中心點位於其內、且不屬於任何群組的每個資料表，如同[繪製群組](../guide/guides/table-groups.md#drawing-a-group)時一樣。空的 `name` 會讓群組維持未命名。一次 `erd_undo` 會移除該群組，並將每個資料表放回其原本所屬的群組。 |
| `erd_remove_table_group` | `groupId` | 移除群組。其資料表會留在原處，不屬於任何群組。 |
| `erd_change_table_group_name` | `groupId`, `value` | 重新命名群組。空字串會讓群組變為未命名。 |
| `erd_change_table_group_color` | `groupId`, `color` | 設定群組的顏色。 |
| `erd_move_table_group` | `groupId`, `x`, `y` | 移動群組，使其矩形從該點開始，其資料表也會以相同的位移一起移動，如同拖曳其標題列一樣。水平與垂直位移相加不到 20 像素的移動不會產生復原步驟。 |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | 設定群組的矩形，其資料表會留在原處。省略 `x` 和 `y` 時會保留原本的角落位置。無法容納群組的資料表及其留白的矩形會被拒絕，並附上訊息指出它必須容納的方框。 |
| `erd_set_table_group` | `tableIds`, `groupId` | 將資料表放入群組，每個資料表都會離開其原本所屬的群組。`groupId` 為 `null` 或空字串時，會將這些資料表移出所有群組。 |

當群組透過 `View Option` → `Table Groups` 隱藏時，這些工具仍會新增和變更群組，而這些群組會保持隱藏，直到群組顯示為止，請參閱[隱藏群組](../guide/guides/table-groups.md#hiding-groups)。
`erd_sort_tables` 會讓每個群組的資料表保持在一起，`erd_import_dbml` 和 `erd_import_json` 會帶入群組（請參閱[匯入](#import)），而 `erd_read` 會透過 `groupNames` 寫出所選群組的 DDL。
早於資料表群組推出的 ERD Editor 版本在儲存檔案時會捨棄檔案中的群組，`4.0.0` 之前的 VS Code 擴充功能，以及 `1.0.0` 之前的 Obsidian 和 JetBrains 外掛程式都是如此，請參閱[更新](./installation.md#updating)。

### 設定 {#settings}

代理程式設定的是結構描述本身的設定：資料庫、其名稱和[結構描述 SQL](../guide/guides/schema-sql.md) 指令碼。
文件儲存的其他所有設定都由使用者在編輯器中設定：[檢視選項](../guide/guides/table-related-functions.md#table-view-options)的切換按鈕、「[設定](../guide/guides/settings.md)」索引標籤的選項、程式碼產生器的語言與名稱大小寫、引號類型和[鎖定](../guide/guides/settings.md#lock)。
沒有任何工具會變更這些設定，但 `replace` 模式下的匯入除外：`erd_import_json` 會帶入所載入文件的設定與鎖定，其他四個匯入工具則會將檢視移回畫布的起點，請參閱[匯入](#import)。
伺服器 `1.0.0` 已移除設定這些項目的工具：`erd_set_language`、`erd_set_table_name_case`、`erd_set_column_name_case`、`erd_set_bracket_type`、`erd_set_relationship_data_type_sync`、`erd_set_relationship_optimization`、`erd_set_column_order`、`erd_set_max_width_comment`、`erd_set_ignore_save_settings` 和 `erd_set_show`。

`erd_list` 和 `erd_read` 的 `snapshot` 格式會依檔案儲存的樣子回報設定，其中 `lockSettings` 為每個鎖定各包含一個旗標：`viewport`、`canvasType`、`language`、`tableNameCase`、`columnNameCase` 和 `bracketType`。
已鎖定的語言、名稱大小寫或引號類型會以其鎖定的值回報，也就是檔案所保留、且每個編輯器開啟時使用的值，不論編輯器畫面上顯示的是什麼。檢視和索引標籤不會回報。

`erd_set_ddl_script` 會產生復原步驟。`erd_set_database` 和 `erd_set_database_name` 不會產生復原步驟，因此 `erd_undo` 無法還原它們。

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_set_database` | `value` | 設定資料庫：`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`SQLite`、`Databricks` 或 `Snowflake`。它決定該資料庫的資料類型，以及未指定 `vendor` 時 `erd_read` 寫出的 DDL。 |
| `erd_set_database_name` | `value` | 設定資料庫名稱，也就是 `erd_read` 的 `use` 和 `createAndUse` 標頭中指名的名稱。 |
| `erd_set_ddl_script` | `position`, `sql` | 設定寫在資料表前後的兩個指令碼之一，請參閱[前置與後置指令碼](../guide/guides/schema-sql.md#before-and-after-scripts)。`position` 為 `before`（寫在資料表之前，例如 `CREATE EXTENSION` 或 `CREATE SCHEMA`）或 `after`（寫在資料表之後，例如 `GRANT` 或 `CREATE VIEW`）。`sql` 會取代整個指令碼，最多 10,000 個字元，空字串則會移除指令碼。先使用 `erd_read` 的 `scripts` 格式讀取目前的指令碼。 |

指令碼會原樣寫入每種資料庫的 DDL，因此應針對文件所設定的資料庫撰寫。在 MSSQL 上，若指令碼的最後一行不是 `GO`，會在其後加上一行 `GO`。
早於這些指令碼推出的 ERD Editor 版本在儲存檔案時會捨棄檔案中的指令碼，`4.0.0` 之前的 VS Code 擴充功能，以及 `1.0.0` 之前的 Obsidian 和 JetBrains 外掛程式都是如此，請參閱[更新](./installation.md#updating)。

### 匯入 {#import}

這些工具讀取結構描述的方式與編輯器的「匯入」選單相同，請參閱[匯入或匯出檔案](../guide/guides/file-import-export.md)。
每個工具都以 `value` 接收文字，並接受 `mode`：`replace`（預設值）或 `append`。

| 工具 | 引數 | 作用 |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | 載入 SQL DDL，也就是 `CREATE TABLE` 等陳述式。 |
| `erd_import_graphql` | `value`, `mode?` | 載入 GraphQL SDL。 |
| `erd_import_dbml` | `value`, `mode?` | 載入 DBML。每個 `TableGroup` 都會成為包含其所指名資料表的資料表群組，請參閱 [DBML](../guide/guides/file-import-export.md#dbml)。 |
| `erd_import_aml` | `value`, `mode?` | 載入 AML。 |
| `erd_import_json` | `value`, `mode?` | 載入 erd-editor JSON 文件，例如另一個 `.erd.json` 檔案。 |

`replace` 會取代文件，而 `erd_undo` 會還原先前的文件：

- `erd_import_sql`、`erd_import_graphql`、`erd_import_dbml` 和 `erd_import_aml` 會取代所有資料表、關聯、索引、備忘錄和資料表群組。它們會保留文件的設定（包括鎖定），但檢視除外，檢視會回到畫布的起點，縮放比例為 100%。
- `erd_import_json` 會取代整份文件，包括其設定：JSON 的設定與鎖定會取代此文件的設定與鎖定，而未記錄鎖定的 JSON 會開啟所有鎖定，並將檢視放在畫布的起點。若要保留此文件的設定，可從 `erd_read` 的 `json` 格式所提供的文字著手。空文字會產生新文件，就像 `erd_open_document` 使用 `create` 建立的文件一樣。

`append` 會將匯入的內容加入文件，如同編輯器的[匯入並加入](../guide/guides/file-import-export.md#import-and-add)，而一次 `erd_undo` 即可移除所有加入的內容：

- 文字中的內容會以具有新 id 的新實體加入，放在文件所有內容（包括隱藏的備忘錄和資料表群組）下方的一個區塊中，並與這些內容的左邊緣對齊。既有的每個資料表和設定都會保留，包括同名的資料表：不會依名稱合併任何內容。
- 關聯和索引只會建立在匯入所帶入的資料表之間，因此指向文字中未宣告之資料表的外鍵會被捨棄。
- `erd_import_sql`、`erd_import_graphql` 和 `erd_import_aml` 會加入資料表及其關聯與索引，`erd_import_dbml` 還會加入其資料表群組。`erd_import_json` 會加入資料表、關聯、索引、備忘錄和資料表群組，但絕不會加入其設定，且會拒絕空文字。

JSON 文件會保留其本身的排列方式（包括其資料表群組）：使用 `replace` 時保留其放置資料表的位置，使用 `append` 時則在加入的區塊內保留。
SQL、GraphQL、DBML 和 AML 的資料表會排成數列，欄位最少的排在最前面，且每個群組的資料表會在一起，排列方式與 `erd_sort_tables` 相同，絕不會像編輯器本身的匯入在可行時那樣以 `Flow` 配置。這四個工具在兩種模式下都會拒絕空文字。

## erd_batch {#erd_batch}

`erd_batch` 會依序將多個編輯工具當作一次編輯執行，全部套用或全都不套用。

- `operations` 最多包含 100 個項目，每個項目為 `{ tool, as?, args? }`，其中 `args` 是不含 `path` 的工具引數。
- 這些操作會先在文件的副本上試行。被拒絕的操作會被指出，例如 `operations[1] erd_remove_table: …`，且不會套用任何操作。
- 一次 `erd_undo` 會還原整個批次，但無法還原的操作除外，結果中的 `undoNote` 會列出這些操作：不會產生復原步驟的工具所執行的操作（例如 `erd_set_database`），以及變更了文件卻未產生復原步驟的操作（例如位移很短的 `erd_move_table_group`）。完全沒有產生復原步驟的批次會被 `erd_undo` 略過。結果中的 `historyEntries` 計算的是批次內編輯器歷程記錄的筆數，而非 `erd_undo` 呼叫次數。
- 在即時工作階段中，編輯器會接受整個批次，或完全不接受。

代理程式在呼叫之前無法得知批次會建立哪些 id，因此以 `as` 命名的操作可讓後續操作參照這些 id：`$name` 或 `$name.0` 代表其建立的第一個 id，`$name.1` 代表第二個，`$name.last` 代表最後一個。
名稱由 ASCII 字母、數字和底線組成，不得以數字開頭，且只能命名一個操作。
參照只會在接受實體 id 的引數中解析，因此內容為 `$x` 的名稱或註解會維持為文字。

在一次呼叫中建立資料表及其欄位和一個關聯：

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` 及其鍵 `id` 在建立關聯之前就已命名，因此關聯加入 `orders` 的外鍵欄位為 `users_id`。

## 結果 {#results}

編輯會回應一行 JSON：

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| 屬性 | 意義 |
| --- | --- |
| `mode` | `live` 或 `headless`，請參閱[即時與無介面](./live-and-headless.md)。 |
| `createdIds` | 此呼叫所建立項目的 id，依建立順序排列。 |
| `batches`, `historyEntries` | 此呼叫傳送的變更批次數量，以及其產生的編輯器歷程記錄筆數。 |
| `undoable`, `undoNote` | 當 `erd_undo` 會略過此呼叫時，`undoable` 為 `false`，而 `undoNote` 會說明原因：該工具不會產生復原步驟、此呼叫變更了文件卻未產生復原步驟（如位移不到 20 像素的 `erd_move_table_group`），或文件原本就已是該值。`erd_batch` 的結果一定帶有 `undoNote`。當批次產生了復原步驟時，該說明會指出一次 `erd_undo` 即可還原該批次，並列出其不會還原的操作；未產生時，結果會帶有 `undoable: false`，且該說明會指出 `erd_undo` 會略過它。 |
| `mismatch` | 當此呼叫產生的批次或歷程記錄數量與工具宣告的不同時出現。 |
| `notes` | 當工作階段的某些狀況有所變化時出現，例如編輯器已結束或停止為文件提供服務，或檔案在磁碟上已變更。 |

拒絕是一種錯誤結果，帶有代碼和說明該如何處理的訊息：

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 原因 |
| --- | --- |
| `notFound` | id 未指向任何現存的項目，或檔案不存在。 |
| `invalidArgs` | 缺少引數，或引數的值有誤。 |
| `invalidPath` | 路徑不是 ERD 文件。在 Windows 上，也包括含有 Windows 不會依原樣儲存之名稱的路徑，以及指向某個編輯器以另一個路徑持有之文件的路徑，訊息中會指出該路徑。 |
| `invalidDocument` | 檔案不是編輯器能讀取的文件。 |
| `tooLarge` | 讀取的內容無法在單次回應中容納。 |
| `blocked` | 文件由 hub 已關閉的編輯器持有。訊息會說明如何開啟 hub：在 VS Code 中，信任工作區並開啟 `dineug.erd-editor.agentHub.enabled`，或重新載入視窗；在 Obsidian 中，開啟 Coding agents，或重新載入 Obsidian；在 JetBrains IDE 中，開啟 Coding agents，若已開啟則重新啟動 IDE。 |
| `hubDisabled` | JetBrains IDE 僅在其不信任的專案中持有該文件。讀取仍可運作；信任該專案即可讓代理程式進行編輯。 |
| `conflict` | 呼叫期間檔案在磁碟上被變更。未寫入任何內容。 |
| `hubAppeared`, `hubGone` | 某個編輯器開始為代理程式正在磁碟上編輯的文件提供服務，或為該文件提供服務的編輯器仍在執行，但其鎖定檔案和連線已消失。未寫入任何內容。 |
| `notSaved` | `erd_save` 無法儲存編輯器的文件。 |
| `readonly` | 編輯器以唯讀方式持有該文件，例如無法寫入或無法讀取為圖表的檔案。沒有編輯器時，則是檔案本身為唯讀，例如尚未簽出的 Perforce 或 TFVC 檔案。未寫入任何內容。 |
| `protocolMismatch` | 編輯器的 ERD Editor 擴充功能或外掛程式與伺服器使用不同的協定版本，例如伺服器 `1.0.0` 搭配 `3.x` 的 VS Code 擴充功能。讀取也會被拒絕，且訊息會指出需要更新的一方，請參閱[更新](./installation.md#updating)。 |
| `hubUnreachable`, `timeout`, `disconnected` | 編輯器的 hub 未接受連線、未在 30 秒內回應，或在呼叫期間中斷連線。在 Windows 上，`hubUnreachable` 也表示 Windows 阻止代理程式連上 hub：編輯器以高於代理程式的權限執行（例如編輯器以系統管理員身分啟動，而代理程式不是），或代理程式在沙箱中執行。 |

其他代碼較少見，且每次拒絕都會附帶說明發生了什麼事的訊息。

編輯工具、`erd_batch` 和三個讀取工具會在觸及文件之前，以 JSON-RPC 的 invalid params 錯誤（`-32602`）拒絕未宣告的引數或型別錯誤的引數，因此拼錯的引數絕不會被默默捨棄。
五個工作階段工具會忽略它們無法辨識的引數。
