---
sidebar_position: 17
description: 編輯器的 25 種顯示語言、由右至左的版面配置、佈景主題建立器的 System、Light 和 Dark 外觀及其顏色，以及各主應用程式保存這些設定的位置。
---

# 語言與佈景主題

編輯器本身的文字提供 25 種語言，其樣貌則是一個佈景主題：由一種外觀（`System`、`Light` 或 `Dark`）、一種灰色調和一種強調色構成。  
兩者都屬於使用編輯器的人，而不屬於圖表。兩者都不會儲存在檔案中、記錄在[復原歷程記錄](./undo-redo.md)中，或與協作者共用，因此每個人看到的都是自己的設定，而變更其中任一項也絕不會將檔案標示為已修改。

兩者都不在「[設定](./settings.md)」索引標籤中。工具列有一個 `Theme` 按鈕，緊接其後是一個 `Display Language` 按鈕，兩者都位於 [`Explorer`](./explorer.md) 按鈕之後。[快速搜尋](./quick-search.md)在每個索引標籤中都會列出 `Theme` 和 `Display Language`。  
網頁應用程式、Google Drive、VS Code、JetBrains IDE 和 Obsidian 都提供這兩者，並會記住您的選擇，請參閱[在各主應用程式中](#in-each-host)。兩者在唯讀編輯器中也能使用。

## 顯示語言 {#display-language}

語言涵蓋編輯器本身的文字：工具列的工具提示、畫布工具列和流程模式工具列上的 [`Name View`](./logical-names.md#switching-the-view) 按鈕、流程模式的列顯示選單、右鍵選單、快速搜尋、面板和對話方塊、[字典](./dictionary.md)索引標籤（其工作表名稱、欄標題、工具、選單、狀態列，以及 `Checks` 工作表所列出的檢查種類）、「設定」索引標籤、[歡迎畫面](./editing-start.md#welcome-screen)、快顯通知和訊息，以及空白的名稱、邏輯名稱、資料類型、定義域、預設值或註解在畫布上和匯出的圖片中所顯示的預留位置文字。  
以下內容在任何語言中都會維持原樣：您的資料表和欄位名稱、[邏輯名稱](./logical-names.md)、註解和備忘錄；您在「字典」索引標籤中保存的詞彙、術語和定義域；資料庫廠商、程式碼產生器的語言和檔案格式；資料類型、SQL 關鍵字，以及 `ON DELETE` 和 `ON UPDATE` 的動作；結構描述 SQL 的選項 `Create`、`If not exists`、`Drop & re-create`、`USE` 和 `CREATE + USE`；標記 `PK`、`FK`、`UQ`、`AI`、`NN`、`N-N`、`NULL` 和 `AK1.1`；[差異檢視器](./table-related-functions.md#diff-viewer)的狀態字母 `A`、`M`、`D`、`R` 和 `~`；名稱大小寫和 `Bracket` 中 `None` 以外的選項；鍵盤按鍵的名稱；佈景主題建立器中的顏色名稱；產生的 SQL 和程式碼；匯出的字典 CSV 的標頭列；以及匯出的檔案名稱。

在「字典」索引標籤中，排序會依顯示語言的字母順序排列各列，而 `Checks` 工作表的搜尋會依其儲存格在顯示語言中顯示的文字進行比對，請參閱[排序](./dictionary.md#sorting)和[搜尋](./dictionary.md#searching)。

各語言依選擇器列出的順序如下：

| 選擇器中的名稱 | 語言 | 代碼 |
| --- | --- | --- |
| Bahasa Indonesia | 印尼文 | `id-ID` |
| Deutsch | 德文 | `de-DE` |
| English | 英文 | `en` |
| Español | 西班牙文 | `es-ES` |
| Euskara | 巴斯克文 | `eu-ES` |
| Français | 法文 | `fr-FR` |
| Italiano | 義大利文 | `it-IT` |
| Nederlands | 荷蘭文 | `nl-NL` |
| Polski | 波蘭文 | `pl-PL` |
| Português | 葡萄牙文 | `pt-PT` |
| Português Brasileiro | 巴西葡萄牙文 | `pt-BR` |
| Română | 羅馬尼亞文 | `ro-RO` |
| Slovenčina | 斯洛伐克文 | `sk-SK` |
| Slovenščina | 斯洛維尼亞文 | `sl-SI` |
| Svenska | 瑞典文 | `sv-SE` |
| Türkçe | 土耳其文 | `tr-TR` |
| Русский | 俄文 | `ru-RU` |
| Українська | 烏克蘭文 | `uk-UA` |
| עברית | 希伯來文 | `he-IL` |
| العربية | 阿拉伯文 | `ar-SA` |
| فارسی | 波斯文 | `fa-IR` |
| 日本語 | 日文 | `ja-JP` |
| 简体中文 | 簡體中文 | `zh-CN` |
| 繁體中文 | 繁體中文 | `zh-TW` |
| 한국어 | 韓文 | `ko-KR` |

快速搜尋在「程式碼產生器」索引標籤中提供的 `Language`，以及「設定」索引標籤中[鎖定](./settings.md#lock)清單的 `Language` 列，指的都是[程式碼產生器的目標語言](./code-generator.md#language)，而不是顯示語言。

### 選擇語言 {#picking-a-language}

`Display Language` 按鈕（語言圖示）會開啟 `Display Language` 選擇器，這是一個位於工具列下方、標題為 `Display Language` 的面板，會覆蓋在目前開啟的任何索引標籤上方。  
`System` 排在第一個，旁邊會顯示它目前所代表的語言，且在清單捲動時仍會保持在可見範圍內。接著是 25 種語言，每種都以其本身的名稱顯示，目前生效的選項會以勾號標示。

![從工具列將顯示語言切換為 한국어，再切換為會鏡像翻轉工具列但不會鏡像翻轉圖表的 العربية，最後切回 System](/img/demo-display-language.webp)

面板開啟時，鍵盤焦點會位於已勾選的列上：

- `↑` 和 `↓` 會在各列之間移動並循環，`Home` 和 `End` 則會跳至第一列和最後一列。
- `Enter` 或 `Space` 會選擇具有焦點的列，與按一下的效果相同。

選擇會立即套用、關閉面板，並將鍵盤焦點交還給編輯器。

按 `Escape`、按一下標題旁工具提示為 `Close (ESC)` 的 `x` 按鈕、在編輯器中面板以外的任何位置按下（工具列除外），或再按一次 `Display Language` 按鈕，即可在不做選擇的情況下關閉面板。  
開啟它會關閉佈景主題建立器和「資料表屬性」。已開啟的[物件總管](./explorer.md#dialogs-beside-it)會保持開啟，而在由左至右書寫的語言中，選擇器會緊鄰在它旁邊顯示，而不是覆蓋在它上方。  
開啟快速搜尋或佈景主題建立器會關閉它，按 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 也是如此。該按鍵會開啟[物件總管](./explorer.md#opening-and-closing)並進入其搜尋，或者在物件總管已開啟時，讓它保持開啟並將鍵盤焦點移至其「尋找」輸入框。工具列的 `Explorer` 按鈕則會讓選擇器保持開啟。

面板擁有鍵盤焦點期間，仍有幾個編輯器快速鍵有效：`Search`、`Toggle Explorer`、`Undo`、`Redo`、`Zoom In`、`Zoom Out` 和 `Zoom Reset`，請參閱[快速鍵](./settings.md#shortcuts)。其他所有編輯器快速鍵、方向鍵和 `Tab` 都只會傳到面板為止，因此編輯器不會對其做出反應。編輯器未繫結的按鍵（例如主應用程式本身的儲存）會照常傳到主應用程式。

在[快速搜尋](./quick-search.md)中，`Display Language` 會列出 `System` 和 25 種語言，目前生效的選項會有勾號。在這裡也可以用語言的英文名稱或代碼找到該語言，因此 `german` 或 `de-DE` 都能找到 `Deutsch`。

### System 依循的語言 {#what-system-follows}

在網頁應用程式、Google Drive、VS Code、JetBrains IDE 和 Obsidian 中，語言一開始為 `System`。它會依循主應用程式的語言：

- 在網頁應用程式、Google Drive 和您自己的網頁中：瀏覽器的偏好語言。偏好語言變更時會立即依循。
- 在 VS Code 中：VS Code 的顯示語言。
- 在 JetBrains IDE 中：IDE 顯示其本身介面所用的語言。
- 在 Obsidian 中：Obsidian 的語言。

`System` 會採用這些語言中編輯器所提供的第一種，若編輯器一種都沒有，則採用英文。  
地區變體會視為其所屬的語言，因此 `de-AT` 會對應到 Deutsch，`fr-CA` 會對應到 Français。中文依書寫系統判斷：繁體字書寫系統會對應到繁體中文，其他書寫系統則對應到简体中文。未指定書寫系統時，台灣、香港或澳門會對應到繁體中文，其他中文則對應到简体中文。除非指定了巴西以外的地區，否則葡萄牙文會對應到 Português Brasileiro，因此 `pt-PT` 會對應到 Português；Obsidian 的葡萄牙文也會對應到 Português。

### 由右至左書寫的語言 {#right-to-left-languages}

עברית（希伯來文）、العربية（阿拉伯文）和 فارسی（波斯文）會將編輯器由右至左配置：工具列、各選單、面板和對話方塊、快速搜尋、「字典」索引標籤的功能列和狀態列，以及「設定」索引標籤都會鏡像翻轉。右鍵選單的子選單會向左開啟，工具列的復原和重做圖示也會互換，讓復原圖示依由右至左的閱讀方向指向後方。

圖表本身絕不會鏡像翻轉。畫布及其中的資料表、欄位、關聯和備忘錄會維持由左至右，小地圖、捲軸、[畫布工具列](./table-related-functions.md#canvas-toolbar)、[視覺化](./visualization.md)及其工具列、資料類型儲存格、「字典」索引標籤上的工作表和術語的定義域清單、「結構描述 SQL」和「程式碼產生器」索引標籤中的程式碼、顏色選擇器、差異檢視器的兩側、時光旅行，以及自動版面配置預覽也是如此。  
在流程模式中，視覺化工具列上的兩個箭頭會維持原位，但互換其作用：指向右方的箭頭為 `Previous table`，指向左方的為 `Next table`，讓返回的方向與復原相同。復原和重做按鍵仍會返回上一步和前進到下一步，請參閱[上一個資料表與下一個資料表](./visualization.md#previous-table-and-next-table)。  
[物件總管](./explorer.md#beside-the-canvas)會維持在畫布左側，差異檢視器的變更樹狀結構也會維持在檢視器左側，兩者的拖曳邊緣都位於其右側。兩者內部則由右至左閱讀：其輸入框和列都會鏡像翻轉，列從右側開始縮排，而在任一樹狀結構中，`←` 會展開一列或移至其第一個子項目，`→` 則會摺疊該列或退回其父項目，請參閱[物件總管中的按鍵](./explorer.md#keys-in-the-explorer)。  
名稱、註解和您輸入的其他文字會保有其本身的書寫方向，因此希伯來文、阿拉伯文或波斯文的名稱在畫布上也會由右至左閱讀。字典的快顯通知所列出的每個名稱，也會保有其本身的書寫方向。

## 佈景主題 {#theme}

`Theme` 按鈕（對比圖示）會開啟佈景主題建立器，這是一個位於工具列下方、標題為 `Theme` 的面板，會覆蓋在目前開啟的任何索引標籤上方。它包含三個部分：

- `Accent color`：26 個色塊。每個色塊的工具提示會顯示其名稱，例如 `indigo`。
- `Gray color`：6 個色塊，即 `gray`、`mauve`、`slate`、`sage`、`olive` 和 `sand`。
- `Appearance`：`System`、`Light` 和 `Dark`。

![從工具列開啟佈景主題建立器、選擇強調色和灰色調，並將外觀先切換為 Light 再切換為 System](/img/demo-theme-builder.webp)

每個部分中目前生效的選擇都會有標記，而選擇會立即套用，建立器則會保持開啟。  
選擇顏色不會變更外觀，因此在 `System` 下選擇顏色後，外觀仍為 `System`。

`System` 會與主應用程式一樣顯示淺色或深色，並在主應用程式切換時隨之切換：

- 在網頁應用程式、Google Drive 和您自己的網頁中：瀏覽器回報的淺色或深色模式，此模式會依循作業系統。
- 在 VS Code 中：使用淺色的色彩佈景主題時為淺色，使用深色的色彩佈景主題或任一種高對比佈景主題時為深色。
- 在 JetBrains IDE 中：IDE 的淺色或深色佈景主題。
- 在 Obsidian 中：Obsidian 的淺色或深色佈景主題。

按 `Escape`、按一下標題旁工具提示為 `Close (ESC)` 的 `x` 按鈕、在編輯器中面板以外的任何位置按下（工具列除外），或再按一次 `Theme` 按鈕，即可關閉建立器。  
開啟它會關閉「資料表屬性」和 `Display Language` 選擇器。已開啟的[物件總管](./explorer.md#dialogs-beside-it)會保持開啟，而在由左至右書寫的語言中，建立器會緊鄰在它旁邊顯示，而不是覆蓋在它上方。  
開啟快速搜尋或 `Display Language` 選擇器會關閉它，按 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 也是如此。該按鍵會開啟[物件總管](./explorer.md#opening-and-closing)並進入其搜尋，或者在物件總管已開啟時，讓它保持開啟並將鍵盤焦點移至其「尋找」輸入框。工具列的 `Explorer` 按鈕則會讓建立器保持開啟。  
建立器不會攔下任何按鍵，因此在其開啟期間，編輯器的快速鍵仍可正常使用。

在[快速搜尋](./quick-search.md)中，`Theme` 會列出 `System`、`Light` 和 `Dark`，目前生效的外觀會有勾號。選擇其中一項只會變更外觀，灰色調和強調色則維持不變。

## 在各主應用程式中 {#in-each-host}

在編輯器中從工具列或快速搜尋所做的選擇，會儲存在主應用程式保存它的位置，而無論變更是在何處進行，每個已開啟的圖表都會立即隨之變更。  
在 VS Code、JetBrains IDE 和 Obsidian 中，主應用程式的 `Auto`（在 VS Code 中為值 `auto`）就是編輯器的 `System`。選擇 `System` 會儲存 `Auto`，選擇 `Light` 或 `Dark` 則會儲存該外觀，即使 `Auto` 原本就已顯示該外觀也是如此。  
無論顯示語言為何，擴充功能和外掛程式本身的設定和通知都以英文顯示。

### 網頁應用程式與 Google Drive {#web-app-and-google-drive}

在 erd-editor.io（包括其協作工作階段）和 Google Drive 中，應用程式及其中的每個圖表都共用同一種語言和同一個佈景主題。  
兩者都保存在此瀏覽器中，而不是在結構描述或 Drive 檔案中，且每個 erd-editor.io 分頁都共用它們：在一個分頁中所做的選擇會立即變更其他分頁。

在您選擇語言之前，語言為 `System`，會依循瀏覽器的偏好語言。  
應用程式本身的文字（例如側邊欄、垃圾桶、協作和 Google Drive 畫面）也會依循同一種語言，而在希伯來文、阿拉伯文和波斯文中，整個應用程式都會由右至左配置。隱私權政策、服務條款和支援頁面則維持英文。  
除了編輯器的面板和快速搜尋之外，側邊欄最下方一列在 `Privacy` 和 `Terms` 連結旁還有一個工具提示為 `Display Language` 的語言按鈕。其選單會先列出 `System` 及其所代表的語言，接著列出 25 種語言。

佈景主題一開始為 `System`，灰色調為 `olive`，強調色為 `jade`。  
除了佈景主題建立器和快速搜尋之外，側邊欄底部還有 `System`、`Light` 和 `Dark` 三個圖示按鈕：在 erd-editor.io 上位於 `Trash` 旁，在 Google Drive 中則位於 `Sign out` 旁。它們設定的外觀與建立器相同。

### VS Code {#vs-code}

擴充功能的設定位於 VS Code 設定中的 ERD Editor 底下：

| 設定 | 值 | 預設值 |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`，或[語言表格](#display-language)中的代碼 | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`、`light`、`dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | 六種灰色調 | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 種強調色 | `indigo` |

設定編輯器中的語言設定會列出 `Auto`，接著以各語言本身的名稱列出每種語言。`settings.json` 中未指定任何語言的值會視為 `auto`。  
在編輯器中選擇佈景主題時，會寫入全部三項佈景主題設定。選擇會寫入該設定已有值的位置：工作區資料夾，若無則為工作區，再無則為使用者設定。

### JetBrains IDE {#jetbrains-ides}

Settings | Tools | ERD Editor 中有 `Appearance:`（`Auto`、`Light`、`Dark`）、`Gray color:`、`Accent color:` 和 `Display language:`（`Auto`，接著是以各語言本身名稱顯示的每種語言），以整個 IDE 為單位保存。  
它們的初始值依序為 `Auto`、`Slate`、`Indigo` 和 `Auto`。

### Obsidian {#obsidian}

Settings → ERD Editor 中有 `Appearance`（`Auto`、`Light`、`Dark`）、`Gray color`、`Accent color` 和 `Display language`（`Auto`，接著是以各語言本身名稱顯示的每種語言），以儲存庫為單位分別保存。  
它們的初始值依序為 `Auto`、`Slate`、`Indigo` 和 `Auto`。  
變更會套用到該儲存庫的每個 ERD 分頁，包括彈出式視窗中的分頁。

### 您自己的網頁 {#your-own-page}

在網頁以 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) 和 [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker) 開啟之前，您自己網頁中的 `<erd-editor>` 不會顯示 `Theme` 或 `Display Language` 按鈕，快速搜尋也不會列出兩者。  
在網頁設定語言或讀者選擇語言之前，編輯器會顯示英文，若 `enableLocalePicker` 為開啟，則依循 `System`。  
除非網頁設定了其他佈景主題或開啟 [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode)，否則佈景主題一開始為 `Dark`，灰色調為 `slate`，強調色為 `indigo`。  
讀者的選擇會立即套用，但元素不會儲存任一項選擇：由網頁設定初始值，並自行儲存讀者的選擇，請參閱 API 中的[佈景主題](../../api/erd-editor-element.md#theme)和[顯示語言](../../api/erd-editor-element.md#display-language)。
