---
sidebar_position: 7
description: 開啟命令選擇區，以切換索引標籤、執行目前索引標籤的命令、開啟或關閉物件總管、變更佈景主題或顯示語言，或輸入前置詞以跳至資料表、欄位、註解或備忘錄。
---

# 快速搜尋

快速搜尋是編輯器的命令選擇區。  
它會列出目前所在索引標籤中可用的命令。在搜尋開頭輸入 `#`、`@` 或 `:`，即可改為搜尋圖表，並跳至資料表、欄位，或是註解或備忘錄。

使用 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 開啟，或按一下工具列中的 `Search`。  
按相同的快速鍵即可將其關閉，按 `Esc` 或在面板外按一下也是如此。開啟時會關閉「資料表屬性」、[佈景主題建立器](./language-and-theme.md#theme)、[`Display Language`](./language-and-theme.md#picking-a-language) 選擇器、[`Export image`](./file-import-export.md#image) 對話方塊和「[對應欄位](./relationship-editing.md#map-columns)」，後者會捨棄其中已選取的內容。編輯資料表儲存格、備忘錄或資料表群組名稱期間，它不會開啟。

工具列中緊接在 `Search` 之後的按鈕是 `Explorer`。它會開啟或關閉[物件總管](./explorer.md)，這是停駐在畫布左側、以樹狀結構呈現圖表的面板，其頂端為尋找與取代。  
開啟命令選擇區時，物件總管會保持開啟，此時 `Esc` 只會關閉命令選擇區。在命令選擇區中按 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 會關閉命令選擇區，並將鍵盤焦點移到物件總管的「尋找」輸入框；若物件總管未顯示，則會將其開啟並進入其搜尋。與 `Toggle Explorer` 項目不同，在命令選擇區中按此按鍵絕不會關閉物件總管，請參閱[開啟與關閉](./explorer.md#opening-and-closing)。差異檢視器、時光旅行或自動版面配置預覽開啟期間，編輯器不會處理此按鍵：命令選擇區會保持開啟，按鍵會繼續傳給瀏覽器或主應用程式，請參閱[瀏覽器的尋找列](./find-and-replace.md#the-browsers-find-bar)。  
嵌入編輯器的主應用程式可以將快速搜尋繫結到其他按鍵，此時 `Search` 的工具提示會顯示該按鍵，請參閱[快速鍵](./settings.md#shortcuts)。

![以 ⌘ + K 開啟命令選擇區，接著以 #pay 跳至資料表、以 @price 跳至欄位，再以 :address 跳至資料表註解](/img/demo-quick-search.webp)

## 搜尋與瀏覽 {#searching-and-navigating}

輸入文字即可篩選清單。每次按鍵都會重新搜尋目前顯示的整個清單，因此刪除字元，或將找不到任何結果的字詞改為輸入新的字詞，都會讓相符的項目重新出現。  
比對採用模糊比對，同時涵蓋項目的名稱和其旁邊顯示的關鍵字。例如在 `Import` 子選單中，`sdl` 可找到 `GraphQL`，`dbdiagram` 可找到 `DBML`，`azimutt` 可找到 `AML`。輕微的拼字錯誤仍能找到對應的項目，例如 `tabel` 可找到 `New Table`，`imprt` 可找到 `Import`，但與輸入內容只是大略相似的項目會被省略：`memo` 只會列出 `New Memo`。名稱或關鍵字包含輸入內容（不區分大小寫）的項目一律會列出，模糊比對遺漏的這類項目則會排在模糊比對的結果之後。項目中凡是包含輸入內容之處都會醒目顯示，不區分大小寫。  
在英文以外的顯示語言中，命令和子選單項目也能以其英文名稱和關鍵字找到，清單不會顯示這些英文名稱和關鍵字，因此無論 `New Table` 以哪種語言顯示，`new table` 都能找到它。  
使用 `↑` 和 `↓` 在清單中移動（到達兩端時會循環），並按 `Enter` 執行醒目顯示的項目。具有專屬快速鍵的命令會在其列的末端顯示該快速鍵：位於右側，在由右至左的顯示語言中則位於左側。輸入法仍在組字時（例如輸入韓文音節到一半時），`↑`、`↓` 和 `Enter` 會交由輸入法處理，既不會移動醒目顯示的位置，也不會執行項目。

例如 `Database`、`Import` 或 `Auto Layout` 等項目會開啟子選單：其項目會取代清單，搜尋輸入框也會清空。`Database`、`Bracket`、`Language`、兩種名稱大小寫、`Schema SQL: Statements`、`Schema SQL: Header`、`Theme` 和 `Display Language` 的子選單會勾選目前的選擇，並在開啟時醒目顯示該項，因此按 `Enter` 即可保留它；其他子選單開啟時不會醒目顯示任何項目。  
篩選永遠只套用於目前顯示的清單，且無法返回上一層，因此要重新開始時，關閉命令選擇區再重新開啟即可。在子選單中，`#`、`@`、`:` 和 `?` 是一般文字，而不是[前置詞](#searching-the-diagram)。

## 命令選擇區列出的項目 {#what-the-palette-lists}

清單內容取決於目前所在的索引標籤。每個索引標籤的清單都以 `Tab` 開頭，用來切換到 `Entity Relationship Diagram`、`Visualization`、`Schema SQL`、`Code Generator` 或 `Settings`，但目前所在的索引標籤不會出現在其中。

在 ERD 索引標籤中：`Database`、`Import`、`Import and Add` 和 `Export`，接著是 `New Table`、`New Memo`、`New Table Group` 和 `Group Selected Tables`，再來是四種關聯類型和 `Auto Layout`。這裡不會列出資料表；輸入 `#` 即可[前往資料表](#searching-the-diagram)。  
唯讀編輯器中不會列出 `Import and Add`；[View Option](./table-related-functions.md#table-view-options) → `Memos` 隱藏備忘錄時，則不會列出 `New Memo`。`New Table Group` 會開始在畫布上繪製[資料表群組](./table-groups.md)，`Group Selected Tables` 則會將所選資料表放入新群組，並開啟其名稱輸入框以供輸入名稱。在唯讀編輯器中，以及 View Option → `Table Groups` 隱藏群組時，兩者都不會列出，而 `Group Selected Tables` 還需要至少選取一個資料表。它們的列會顯示按鍵：[繪製群組](./table-groups.md#drawing-a-group)為 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac)，[將所選資料表組成群組](./table-groups.md#grouping-selected-tables)為先按 `T` 再按 `G`。  
除了 `Group Selected Tables` 對應的是資料表選單的 `Group selected tables` 之外，這些項目執行的命令與畫布的右鍵選單相同；`View Option` 和 `Diff Viewer` 只在右鍵選單中提供。`Export` 提供與右鍵選單相同的 `json`、`Schema SQL` 和 `Image`，在其中輸入 `png` 或 `svg` 即可找到 `Image`。  
關於各格式、[匯入並加入](./file-import-export.md#import-and-add)和[圖片匯出](./file-import-export.md#image)的作用，請參閱[匯入或匯出檔案](./file-import-export.md)；關於資料庫的選擇會影響什麼，請參閱[資料表相關功能](./table-related-functions.md#databases)。

在「結構描述 SQL」索引標籤中：同樣有 `Database`，以及 `Bracket`，用來設定產生的 SQL 中包住資料表、欄位、條件約束和索引名稱的引號字元（`SingleQuote`、`DoubleQuote`、`Backtick`，或表示完全不加引號的 `None`）。接著是 `Schema SQL: Statements` 和 `Schema SQL: Header`（兩者提供與此索引標籤的選項面板相同的選擇，但只列出所選資料庫會寫出的項目），以及可顯示或隱藏該面板的 `Schema SQL: Options panel`。關於各選擇會寫出什麼，請參閱[結構描述 SQL](./schema-sql.md)。

在「程式碼產生器」索引標籤中：`Database`、語言為 `Doctrine`、`JPA` 或 `SeaORM` 時的 `Bracket`，接著是 `Language`、`Table Name Case`、`Column Name Case` 和 `Code Generator: Options panel`，最後一項會顯示或隱藏此索引標籤的選項面板。關於各目標會產生什麼，請參閱[程式碼產生器](./code-generator.md)。

「視覺化」和「設定」索引標籤沒有自己的命令，只有 `Tab` 和下文所述每個索引標籤都會列出的命令。

每個索引標籤的清單接近末尾處都有 `Toggle Explorer`（唯讀編輯器中也是如此），它會顯示其快速鍵 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac)。輸入 `find`、`replace`、`rename`、`tree`、`outline` 或 `objects` 也能找到它。  
執行它會關閉命令選擇區，其效果與在畫布上按此快速鍵相同。當工具列的 `Explorer` 按鈕顯示為按下狀態時，也就是物件總管在 ERD 索引標籤中為開啟狀態且未被禪模式隱藏時，它會關閉物件總管。否則，它會切換到 ERD 索引標籤，開啟物件總管並進入其搜尋，插入點會位於「尋找」輸入框中，請參閱[開啟與關閉](./explorer.md#opening-and-closing)。差異檢視器、時光旅行或自動版面配置預覽開啟期間，它不會出現在清單中。

### 佈景主題與顯示語言 {#theme-and-display-language}

每個索引標籤都會在 `Toggle Explorer` 之後列出 `Theme` 和 `Display Language`，唯讀編輯器中也是如此。兩者都只在編輯器提供其選擇器時才會列出，如工具列的 `Theme` 和 `Display Language` 按鈕所示。網頁應用程式、Google Drive、VS Code、JetBrains IDE 和 Obsidian 都提供兩者，請參閱[在各主應用程式中](./language-and-theme.md#in-each-host)。

`Theme` 會開啟 `System`、`Light` 和 `Dark`，目前的外觀會被勾選。選擇其中一項只會變更外觀，並保留灰色調和強調色，與佈景主題建立器的 `Appearance` 按鈕相同。  
`Display Language` 會開啟 `System`，接著是 25 種語言，每種語言都以其本身的名稱顯示，並依選擇器中的順序排列，目前的選項會被勾選。在這裡也可以用語言的英文名稱或代碼找到該語言：`german` 或 `de-DE` 可找到 `Deutsch`，`korean` 可找到 `한국어`。  
在兩者中所做的選擇都會立即生效、關閉命令選擇區，並與在佈景主題建立器或 `Display Language` 選擇器中所做的選擇一樣儲存下來。若命令選擇區開啟期間顯示語言有所變更，清單會切換為該語言，並保留已輸入的內容和目前所在的子選單。

## 搜尋圖表 {#searching-the-diagram}

以前置詞開始搜尋，即可搜尋圖表而非命令：`#` 表示資料表、`@` 表示欄位、`:` 表示註解和備忘錄，`?` 則會列出前置詞。前置詞在任何索引標籤中都有效。它只有作為第一個字元時才算數，其前方的空格會被忽略。其後的空格可有可無，因此 `#users` 和 `# users` 是相同的搜尋，日文或中文輸入法輸入的全形 `＃`、`＠`、`：` 和 `？` 也同樣有效。  
在頂層且輸入框為空白時，其下方會有一行顯示這四個前置詞；按一下其中一個即可輸入它。前置詞生效期間，輸入框末端會顯示其範圍：`Tables`、`Columns`、`Comments & memos` 或 `Help`。刪除前置詞即可恢復顯示命令。

`#` 會列出資料表，每個資料表旁邊都會顯示 `Table`，名稱空白的資料表會列為 `unnamed`。`#` 之後沒有內容時，資料表會依名稱排序。`#` 之後的文字只會與資料表名稱比對（如上所述為模糊比對），名稱包含該文字的資料表會排在前面。任何前置詞都不會搜尋資料表群組名稱和索引名稱；[尋找與取代](./find-and-replace.md#what-it-searches)則會搜尋兩者。

`@` 會依名稱列出欄位，每個欄位旁邊都會顯示其所在位置，例如 `users.email · Column`。`@` 之後的文字必須出現在欄位名稱中，不區分大小寫；此比對不是模糊比對。第一個 `.` 之前的文字會將搜尋範圍縮小到名稱包含該文字的資料表：`@users.em` 會在名稱包含 `users` 的資料表中列出包含 `em` 的欄位，`@users.` 會列出這些資料表的欄位，`@.em` 則會搜尋所有資料表。`@` 之後沒有內容時，會列出所有欄位而不加篩選。

`:` 會列出資料表註解、欄位註解和備忘錄，絕不列出名稱。每一列會顯示相符處前後文字的摘錄，旁邊顯示 `users · Table comment`、`users.email · Column comment` 或 `Memo`。`:` 之後的文字必須出現在註解或備忘錄中，與 `@` 一樣不區分大小寫。`:` 之後沒有內容時，會列出所有非空白的註解和備忘錄。View Option → `Memos` 隱藏備忘錄時，`:` 不會列出任何備忘錄。

`@` 和 `:` 會依文件中儲存的順序列出各列：逐一列出各資料表，每個資料表的註解排在其欄位之前，欄位依欄位順序排列，備忘錄則排在最後。

`?` 會列出 `Tables`、`Columns` 和 `Comments & memos`，`?` 之後的文字會篩選它們。選擇其中一項會將輸入內容取代為其前置詞，並讓命令選擇區保持開啟。

加上前置詞的清單會包含所有相符項目，無論數量多少。前置詞的搜尋找不到任何結果時，清單會是空的，且不會顯示任何訊息。

選擇資料表、欄位、註解或備忘錄會關閉命令選擇區，若目前位於其他索引標籤，則會切換到 ERD 索引標籤。  
除非該項目已清楚顯示，否則畫布會捲動到該處，請參閱[跳至目標時的落點](./table-related-functions.md#where-a-jump-lands)。資料表接著會被單獨選取並移到最前面，其名稱會取得焦點，除非焦點原本已在該資料表中。  
備忘錄會被單獨選取並移到最前面。對於欄位或註解，其所屬資料表會被單獨選取、移到最前面，並將焦點放在含有該文字的儲存格上；若註解被[資料表檢視選項](./table-related-functions.md#table-view-options)隱藏，則會將焦點放在其旁邊的名稱上。  
任何跳至目標的操作都不會開始或完成正在繪製的關聯。

若要使用 `Match Case`、`Match Whole Word` 或 `Use Regular Expression`，或要取代文字，可使用物件總管頂端的[尋找與取代](./find-and-replace.md)。

## 沒有相符的命令時 {#when-no-command-matches}

在頂層且沒有前置詞時，若列出的命令都不包含輸入的內容（不區分大小寫），命令之後會出現三列：`Search tables for "…"`、`Search columns for "…"` 和 `Search comments & memos for "…"`，每一列都以其前置詞作為圖示。選擇其中一列會在輸入的文字前加上該前置詞，因此 `users` 會變為 `#users`，命令選擇區則會保持開啟並顯示這些結果。  
若搜尋完全找不到任何命令，清單上方會顯示 `No commands match`，此時清單中只有這三列。若只找到不包含該文字的命令，這些命令會排在前面：在 ERD 索引標籤中未選取任何資料表時，`tables` 會在這三列之前列出 `New Table`、`Database`，以及 `New Table Group`（若有提供）。選取資料表時，`Group Selected Tables`（若有提供）包含 `tables`，因此這三列不會出現。  
在子選單中，找不到任何結果的搜尋會讓清單變為空白，且不會顯示任何訊息。

## 以韓文搜尋 {#searching-in-korean}

包含韓文字母的搜尋也會依其字母進行比對，在命令、子選單以及每個前置詞下都是如此。  
韓文輸入法組字過程中的每個階段都會持續找到正要輸入的那一列，因此 `ㅅ`、`사`、`상`、`사요` 和 `사용` 都能找到 `사용자`。只由初聲子音組成的搜尋會比對各音節的初聲子音，並略過空格：`ㅅㅇㅈ` 可找到 `사용자`，`ㅈㅁ` 可找到 `주문 내역`。Windows 輸入法由連續輸入的兩個初聲組成的複合子音（例如 `ㅄ`）會視為那兩個字母（`ㅂㅅ`），而 `ㄲ` 這類雙子音仍算作一個字母。以分解形式儲存的文字（例如 macOS 的檔案名稱）會如同已組合的文字一樣進行比對。  
整段文字逐字母或逐初聲完全拼出搜尋內容的列排在最前面，其次是以搜尋內容開頭的列，然後是包含搜尋內容的列。在 `@` 和 `:` 下，依輸入原樣包含搜尋內容的列會排在上述所有列之前，並依文件順序排列。醒目顯示會涵蓋整個音節，因此 `상` 會醒目顯示 `사용자` 中的 `사용`。
