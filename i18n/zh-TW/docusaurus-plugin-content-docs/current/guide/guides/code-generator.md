---
sidebar_position: 12
description: 從圖表為二十二種目標產生程式碼，在選項面板中選擇語言、資料庫、名稱大小寫和引號，了解哪些目標會寫出關聯的 ON DELETE 和 ON UPDATE 動作，並儲存或複製結果。
---

# 程式碼產生器

在工具列中切換到 `Code Generator` 索引標籤。此索引標籤的左側會顯示整份文件的程式碼，右側則是標題為 `Code Generator` 的選項面板，可在其中選擇語言、資料庫、名稱大小寫，以及部分目標所用的引號。  
除非此索引標籤首次開啟時編輯器的寬度小於 640 px，否則面板會自動開啟。面板頂端的 `Hide options` 會將其摺疊，程式碼右上角的 `Show options` 則會將其重新開啟。只要編輯器保持開啟，即使切換索引標籤，面板也會維持開啟或摺疊狀態，且獨立於「結構描述 SQL」索引標籤的面板，也永遠不會儲存在檔案中。

在程式碼上按滑鼠右鍵即可開啟其右鍵選單：`Language`、`Database`、`Table Name Case`、`Column Name Case` 和 `Bracket`（僅適用於 `Doctrine`、`JPA` 和 `SeaORM`），每一項都附有子選單，其中會勾選目前的值；接著是 `Options panel`，可摺疊或開啟面板，並在面板顯示時呈勾選狀態；最後是 `Save file`。  
此索引標籤開啟期間，[快速搜尋](./quick-search.md)會提供 `Database`、`Bracket`（僅適用於 `Doctrine`、`JPA` 和 `SeaORM`）、`Language`、`Table Name Case`、`Column Name Case`，以及可摺疊或開啟面板的 `Code Generator: Options panel`。

![從程式碼的右鍵選單先選擇 TypeScript 再選擇 Rust，在選項面板中將欄位名稱切換為 Snake，並複製程式碼](/img/demo-code-generator.webp)

同一個程式碼檢視也是「[資料表屬性](./table-related-functions.md#table-properties)」的 `Code Generator` 索引標籤，在那裡它會為該資料表產生程式碼，而不是為整份文件產生。它在那裡沒有選項面板，其右鍵選單變更的是相同的設定，但沒有 `Options panel` 或 `Save file`。  
當整份文件的程式碼以匯入陳述式或標頭開頭時，單一資料表的程式碼會以該資料表所需的匯入陳述式或標頭開頭，例如 `PHP` 的 `<?php`、`Swift` 的 `import Foundation` 或 `JSON Schema` 的 `$schema`。

程式碼會在此索引標籤開啟時寫出，之後每當語言、資料庫、某個名稱大小寫或引號變更時，都會再次寫出。此索引標籤開啟期間對圖表所做的編輯（例如協作者或程式碼代理程式所做的編輯），要等到離開此索引標籤再回來，或上述其中一項設定變更時才會顯示。

## 選項面板 {#options-panel}

面板在 `Saved in the document` 標題下列出 `Language`、`Database`、`Table Name Case` 和 `Column Name Case`，語言為 `Doctrine`、`JPA` 或 `SeaORM` 時，其後還會列出 `Bracket`。每一項都是下拉式清單，變更後會立即重寫程式碼。  
當所選語言會忽略 `Database` 或名稱大小寫時，這些項目仍會以淡化方式留在面板中，下方附有 `Not used by DBML` 之類的註記，且仍可變更。  
`Save file` 和 `Copy` 位於面板底部，請參閱[儲存或複製結果](#saving-or-copying-the-result)。

這些是圖表本身的設定，右鍵選單和快速搜尋變更的也是這些設定。`Database` 會像任何編輯一樣儲存在檔案中。  
只有在「設定」索引標籤中對應的鎖定為關閉時，`Language`、`Table Name Case`、`Column Name Case` 和 `Bracket` 才會儲存（`Bracket` 對應的是 `Bracket Type`），而新圖表的所有鎖定都是開啟的。鎖定開啟期間，變更會重寫畫面上的程式碼，但檔案會保留鎖定的值，圖表重新開啟時也會使用該值。面板不會顯示任何鎖定的跡象；若要讓檔案保留某項選擇，須關閉其鎖定，請參閱[鎖定](./settings.md#lock)。

## 語言 {#language}

支援二十二種目標，分為語言、ORM 和結構描述三組依序列出，每組內依字母順序排列。面板的清單和右鍵選單會在各組之間加上分隔線，但不會為任何一組命名：

| 目標 | 分組 | 關聯 | 索引 | ON DELETE / ON UPDATE | 儲存為 |
| --- | --- | --- | --- | --- | --- |
| `C#` | 語言 | — | — | — | `.cs` |
| `Go` | 語言 | — | — | — | `.go` |
| `Java` | 語言 | — | — | — | `.java` |
| `Kotlin` | 語言 | — | — | — | `.kt` |
| `PHP` | 語言 | — | — | — | `.php` |
| `Rust` | 語言 | — | — | — | `.rs` |
| `Scala` | 語言 | — | — | — | `.scala` |
| `Swift` | 語言 | — | — | — | `.swift` |
| `TypeScript` | 語言 | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | 僅 ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | 僅唯一索引 | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | 結構描述 | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | 結構描述 | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | 結構描述 | ✓ | — | — | `.graphql` |
| `JSON Schema` | 結構描述 | — | — | — | `.json` |
| `Mermaid` | 結構描述 | ✓ | — | — | `.mmd` |
| `Zod` | 結構描述 | — | — | — | `.ts` |

預設值為 `GraphQL`。每個目標都會輸出欄位；✓ 標記表示它還會輸出哪些內容。  
資料表會依名稱順序輸出，而不是依其在畫布上的位置順序；索引則是「[資料表屬性](./table-related-functions.md#indexes)」中 `Indexes` 下列出的索引，而不是其上方的 `Keys` 列。`SeaORM` 只會寫出其中的唯一索引，`Mermaid` 則會將唯一欄位標示為 `UK`，但不會寫出任何索引。  
除了 `Java`、`AML`、`DBML` 和 `Mermaid` 以外，每個目標都會將主鍵欄位寫為不可為 null，無論該欄位是否設定了 `Not Null`。`Java` 不會將任何欄位標示為可為 null 或不可為 null，`AML`、`DBML` 和 `Mermaid` 則會依圖表中的設定保留此旗標。

部分目標寫出的內容：

- `PHP`：由具型別的公用屬性構成的單純類別，以 `<?php` 和 `declare(strict_types=1);` 開頭。
- `Doctrine`：使用 attribute 的 Doctrine ORM 3 實體，適用於 DBAL 4.2 或更新版本，每個欄位都帶有其 DBAL 類型，以及適用於所選資料庫的選項。
- `Rust`：每個資料表一個 `pub struct`，其型別以完整路徑寫出，例如 `chrono::NaiveDateTime` 或 `rust_decimal::Decimal`，不含 `use` 行。
- `SeaORM`：採用 dense 格式的 SeaORM 2.0 實體，每個資料表為一個 `pub mod`，因此整段文字可作為單一檔案編譯。
- `Swift`：每個資料表一個遵循 `Codable`、`Hashable`、`Sendable` 的 struct，需要 Swift 6.1 或更新版本。
- `TypeScript`：每個資料表一個 `export interface`，與 `Zod` 結構描述一樣以 JSON 形式描述資料列：日期或時間為 `string`，可為 null 的欄位為 `T | null`。
- `Zod`：每個資料表一個 Zod 4 資料列結構描述及其推斷出的型別，不含插入用的結構描述，也不含關聯。
- `JSON Schema`：一份 JSON Schema draft 2020-12 文件，每個資料表的資料列結構描述位於 `$defs` 下。
- `Mermaid`：一個 `erDiagram`，也就是 GitHub 會轉譯的那種圖表，每個資料表為一個實體，列出每個欄位及其類型，以及任何 `PK`、`FK` 或 `UK` 標記，每個關聯則為其兩個資料表之間的一條線。

`AML`、`DBML` 和 `GraphQL` 是可往返的格式：每一種也都是匯入來源。請參閱[匯入或匯出檔案](./file-import-export.md)。其他結構描述（`JSON Schema`、`Mermaid` 和 `Zod`）僅能輸出。  
`DBML` 會將每個資料表的顏色寫為 `headercolor`，並在整份文件的程式碼中，於各個 `Ref` 之後為每個含有資料表的[資料表群組](./table-groups.md)寫出一個 `TableGroup` 區塊。`AML` 會將資料表的顏色寫為 AML 顏色名稱中最接近的一個。

## ON DELETE 與 ON UPDATE {#on-delete-and-on-update}

關聯的 ON DELETE 和 ON UPDATE 動作是從其右鍵選單設定，請參閱 [ON DELETE 與 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
在[語言](#language)表格的 `ON DELETE / ON UPDATE` 欄中有 ✓ 的目標，會寫出關聯所設定的動作；維持為 `Not set` 的動作不會寫出任何內容。  
ORM 目標會保留哪些動作取決於所選的資料庫，而 `AML` 和 `DBML` 會全部保留，請參閱[資料庫](#database)。

- `Doctrine` 只會寫出 ON DELETE，因為 Doctrine 沒有 ON UPDATE。它會在擁有方的 `ManyToOne` 或 `OneToOne` 的每個 `#[ORM\JoinColumn]` 中加入 `onDelete: 'CASCADE'`，例如 `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`，而反向方的 `OneToMany` 或 `OneToOne` 上則不加入任何內容。指向非主鍵之唯一欄位的關聯會維持為單純的欄位，Doctrine 會在沒有關聯對應的情況下對應這些欄位，因此不會寫出任何動作。
- `Drizzle` 會以小寫寫出這些動作。在 `.references()` 上，它們是選項，例如 `{ onDelete: "cascade", onUpdate: "set null" }`；在多欄位鍵所使用的 `foreignKey()` 上，則以鏈結方式呼叫，例如 `.onDelete("restrict").onUpdate("no action")`。
- `SeaORM` 會將這些動作寫在子資料表的 `belongs_to` 關聯上，ON UPDATE 在前，並使用 SeaORM 的名稱 `NoAction`、`Cascade`、`SetNull`、`SetDefault` 和 `Restrict`，例如 `on_update = "Cascade", on_delete = "SetNull"`。父資料表的 `has_one` 或 `has_many` 則不會帶有任何動作。
- `Sequelize` 會將 `onDelete: "CASCADE"` 和 `onUpdate` 項目寫入兩個關聯呼叫中：`hasMany` 或 `hasOne`，以及 `belongsTo`。多欄位鍵不會有關聯呼叫，因此 `Sequelize` 不會為其寫出任何動作。
- `SQLAlchemy` 會將 `ondelete="CASCADE"` 和 `onupdate` 引數傳給單一欄位鍵的 `ForeignKey()`，以及多欄位鍵的 `ForeignKeyConstraint()`。
- `TypeORM` 會將 `onDelete: "CASCADE"` 和 `onUpdate` 選項寫在擁有方的 `@ManyToOne` 或 `@OneToOne` 上，從不寫在反向方。它一律會省略 `SET DEFAULT`，因為 TypeORM 會將其寫成 `DEFAULT`，而沒有任何資料庫接受這種寫法。
- `DBML` 會在 `Ref` 中加入設定，例如 `[delete: set null, update: no action]`。
- `AML` 會將設有動作的關聯寫成帶有屬性的獨立 `rel` 陳述式，例如 `{onDelete: cascade, onUpdate: "set null"}`，而不是內嵌寫在其欄位上。

`JPA` 不會寫出任何動作：單純的 JPA 沒有對應的選項，產生器也不使用 Hibernate 的 `@OnDelete`。`Mermaid` 也不會寫出任何動作，因為 `erDiagram` 的線沒有可放置它們的位置。  
在「資料表屬性」只顯示一個資料表的 `Code Generator` 索引標籤中，`DBML` 不會寫出 `Ref`，`AML` 也不會寫出 `rel` 陳述式，因此兩者都不會在那裡顯示這些動作；對於設有動作的單一欄位關聯，`AML` 會像對待沒有動作的關聯一樣，將其內嵌寫在欄位上。`Mermaid` 在那裡完全不會寫出關聯線。`Doctrine` 和 `SeaORM` 在那裡寫出的實體與整份文件中的相同，動作也包含在內。

## 名稱大小寫 {#name-case}

`Table Name Case` 和 `Column Name Case` 都支援 `Pascal`、`Camel`、`Snake` 和 `None`。  
資料表名稱的預設值為 `Pascal`，欄位名稱的預設值為 `Camel`。`None` 會依圖表中所寫的原樣輸出名稱。  
無論採用哪種大小寫，目標語言所保留的名稱，在該語言可以逸出時會被逸出，例如 `C#` 中的 `@class` 或 `Rust` 中的 `r#type`；在無法逸出時則會被重新命名，例如 `Java` 中的 `class_`。

`AML`、`DBML` 和 `Mermaid` 會忽略這兩項設定，一律輸出圖表中的名稱。  
`SeaORM` 也會忽略它們：它以 snake case 為欄位和模組命名，這是 SeaORM 讀回時使用的形式，並在 `table_name` 中提供儲存的名稱，兩者不同時也會在 `column_name` 中提供。  
對於這四種目標，面板會將兩個清單都淡化顯示，並在其下方附上 `Not used by` 註記。

## 資料庫 {#database}

資料類型會依所選的資料庫解析，請參閱[資料庫](./table-related-functions.md#databases)。  
在此索引標籤中，可從面板的 `Database` 清單、右鍵選單的 `Database` 或快速搜尋選擇資料庫，程式碼會立即重寫。這是圖表唯一的資料庫設定，與畫布右鍵選單和「[結構描述 SQL](./schema-sql.md)」索引標籤所設定的是同一個，因此在此處的變更也會反映在那裡。  
`Drizzle` 的方言也取自同一個設定：PostgreSQL 為 `pgTable`，MySQL 和 MariaDB 為 `mysqlTable`，SQLite 為 `sqliteTable`，其他所有資料庫則為 `pgTable`。  
在 PostgreSQL、MySQL、MariaDB 或 SQLite 上，凡是 SeaORM 原本會建立不同欄位類型之處，`SeaORM` 都會寫出 `column_type`；在 MSSQL、Oracle、Snowflake 或 Databricks 上則不會寫出，因為 SeaORM 沒有這些資料庫的後端。

所選的資料庫也決定 ORM 目標會寫出哪些 ON DELETE 和 ON UPDATE 動作。  
`Doctrine`、`SeaORM`、`Sequelize`、`SQLAlchemy` 和 `TypeORM` 會省略該資料庫的結構描述 SQL 所省略的任何動作，例如 MySQL 和 MariaDB 上的 `SET DEFAULT`、MSSQL 上的 `RESTRICT`，或 Snowflake 和 Databricks 上 `NO ACTION` 以外的所有動作，因此會套用資料庫的預設行為。完整清單列於 [ON DELETE 與 ON UPDATE](./relationship-editing.md#on-delete-and-on-update) 中。  
`Drizzle` 則改為依循其寫出的方言：`mysqlTable` 程式碼會省略 `SET DEFAULT`，而 `pgTable` 和 `sqliteTable` 程式碼會保留每個動作，包括它為 MSSQL、Oracle、Snowflake 和 Databricks 寫出的 `pgTable` 程式碼。

`AML`、`DBML` 和 `Mermaid` 是例外：它們會依圖表中所寫的原樣輸出每個資料類型，因此資料庫設定不會改變其輸出，面板也會為它們將 `Database` 淡化顯示。`AML` 和 `DBML` 會寫出關聯所設定的每個動作，`Mermaid` 則不會寫出任何動作。

## 引號 {#bracket}

只有在語言為 `Doctrine`、`JPA` 或 `SeaORM` 時，面板、右鍵選單和快速搜尋中才會提供 `Bracket`。  
它與「結構描述 SQL」索引標籤的引號是同一個設定（請參閱[結構描述 SQL](./schema-sql.md#database-and-bracket)），因此在此處的變更也會改變結構描述 SQL 為名稱加上引號的方式。它提供 `SingleQuote`、`DoubleQuote`、`Backtick` 和 `None`，初始值為 `None`。

- `Doctrine`：在 `None` 以外的任何引號下，每個資料表、欄位和聯結欄位名稱都會以反引號括住，這是 Doctrine 標示需加上引號之名稱的方式，例如 ``#[ORM\Table(name: '`order`')]``。在 `None` 下，只有需要括住的名稱才會括住：資料庫的保留字、不是單純 ASCII 識別碼的名稱，或輸入時帶有引號的名稱。
- `JPA`：在 `None` 以外的任何引號下，屬於保留字的資料表名稱會在 `@Table` 中加上引號，例如 `@Table(name = "\"user\"")`。在 `None` 下則不加引號，與結構描述 SQL 的處理方式相同。
- `SeaORM`：在 `None` 下，名稱會依資料庫儲存的形式寫出：含有點的資料表名稱會拆分為 `schema_name` 和 `table_name`，而在 PostgreSQL 上，未加引號的名稱會轉為小寫。在其他任何引號下，名稱都會依所寫的形式完整保留。

## 儲存或複製結果 {#saving-or-copying-the-result}

選項面板底部或右鍵選單中的 `Save file` 會將顯示的程式碼儲存為檔案。  
檔案會和其他所有匯出一樣命名為 `<database name>-<timestamp>`，後面接著[語言](#language)表格中的副檔名，例如 `shop-2026-10-12T04_05_06.ts`，並儲存到主應用程式中所有匯出的儲存位置，請參閱[匯出](./file-import-export.md#exporting)。`Java` 和 `JPA` 會像此索引標籤所顯示的那樣，將所有類別放在同一個 `.java` 檔案中。  
「匯出」選單中沒有程式碼產生器項目，「資料表屬性」的 `Code Generator` 索引標籤也無法儲存檔案。

若要複製程式碼，可按一下面板底部的 `Copy`，或將指標停留在程式碼上，再按一下其右上角的複製按鈕，後者是「資料表屬性」中唯一的方式。  
帶有勾號的 `Copied!` 快顯通知會顯示兩秒以示確認。若瀏覽器或主應用程式拒絕存取剪貼簿，則會改為顯示帶有警告符號的 `Couldn't copy to the clipboard` 快顯通知。再次複製會取代原本的快顯通知，而不會再新增一則。  
文字也可以選取，因此可以只取用需要的部分。
