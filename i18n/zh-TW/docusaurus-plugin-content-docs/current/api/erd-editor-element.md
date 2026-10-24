---
sidebar_position: 2
description: erd-editor 元素的 API：屬性、value 與 runtimeValue、事件、佈景主題、顯示語言、歡迎畫面、按鍵繫結，以及結構描述的匯入與匯出。
---

# ErdEditorElement

編輯器是一個普通的 `HTMLElement`。  
其型別定義如下。

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

編輯器會轉譯到封閉模式的 shadow root 中，因此 `editor.shadowRoot` 為 `null`，頁面樣式也不會滲入或滲出。  
內部的任何內容都無法以選取器存取，請改用 [setTheme](#settheme) 和 `--erd-editor-*` CSS 自訂屬性來設定樣式。

`readonly`、`system-dark-mode`、`enable-theme-builder`、`enable-locale-picker` 和 `enable-welcome-screen` 是僅有的 HTML 屬性，五者皆預設為 `false`。後兩者是 `4.0.0` 新增的。每個屬性都會如 [readonly](#readonly) 所述讀取其值。

自 `4.1.0` 起，ERD 索引標籤中有[物件總管](../guide/guides/explorer.md)，這是停駐在畫布左側的圖表樹狀結構，頂端為尋找與取代。沒有任何 HTML 屬性、JavaScript 屬性、方法或事件能開啟、關閉或回報它：它可從工具列的 `Explorer` 按鈕、快速搜尋或畫布的右鍵選單中的 `Toggle Explorer`，或使用 [`findReplace`](#setkeybindingmap) 按鍵繫結開啟。  
每個元素一開始時物件總管都是關閉的。它是否開啟、寬度、摺疊狀態和搜尋，會在元素存在期間一直保留，不受索引標籤切換和每次載入（包括 `setInitialValue`）影響，而且絕不會出現在 `value`、`runtimeValue`、復原歷程記錄或共用存放區中。

自 `4.2.0` 起，資料表和欄位除了名稱之外，還可以有[邏輯名稱](../guide/guides/logical-names.md)，而「名稱顯示」（與索引標籤一樣是文件設定）會決定畫布要繪製它們的名稱、邏輯名稱，還是兩者都繪製。  
工具列也有[字典](../guide/guides/dictionary.md)索引標籤，位於 `Code Generator` 和 `Settings` 之間，其中保存文件的詞彙、術語和定義域，以及 `Checks` 工作表。它與其他索引標籤相同：其 `canvasType` 為 `'@dineug/erd-editor/builtin-dictionary'`，由 `Canvas Type` 鎖定保存，因此在該索引標籤上儲存的文字，透過 [setInitialValue](#setinitialvalue) 載入時也會在該索引標籤上開啟，而切換到該索引標籤只有在該鎖定關閉期間，才會寫入 `value` 並觸發 [change](#change)。沒有任何專屬於它的 HTML 屬性、JavaScript 屬性、方法或事件能開啟它或回報其狀態。在其中所做的編輯都是文件變更：它們會出現在 `value` 中、觸發 [change](#change)，並傳到協作者，但其復原和重做是在各工作表自己的歷程記錄上執行，而不是在文件的歷程記錄上。  
該索引標籤自身的狀態，也就是顯示哪個工作表（一開始為 `Domains`），以及各工作表的搜尋、選取範圍、捲動位置和欄寬，會在元素存在期間一直保留，不受索引標籤切換和每次載入影響，而且絕不會出現在 `value`、`runtimeValue`、任何復原歷程記錄或共用存放區中。  
`ErdEditorElement` 介面沒有新增任何成員。API 新增的是 [getSchemaSQL](#getschemasql) 選項中的 `logicalNameAsComment`、十二個[佈景主題 token](#settheme)，以及匯出的 [dictionaryRowChords](#dictionaryrowchords)。

## readonly {#readonly}

設定編輯器是否可編輯。  
設定此屬性期間，指派 `value`、`clear()`、`setSchemaSQL()`、`setSchemaGraphQL()`、`setSchemaDBML()`、`setSchemaAML()`、`setSchemaJSON()`、復原和重做（自 `4.2.0` 起也包括字典工作表的復原和重做）都會被忽略，也絕不會觸發 `change` 事件。請改用 [setInitialValue](#setinitialvalue) 載入文件。  
檢視功能仍可使用：縮放、平移、手形工具、禪模式、畫布索引標籤、[視覺化](../guide/guides/visualization.md)索引標籤的兩種模式（包括聚焦資料表）、資料庫廠商，以及 SQL 與程式碼產生器的輸出設定都仍然有效，因此唯讀檢視器仍可匯出其他廠商的 SQL，或閱讀產生的程式碼。  
自 `4.1.0` 起，[物件總管](../guide/guides/explorer.md#read-only-editors)也能開啟，選擇其中一列會前往該列所代表的項目，與在可編輯的編輯器中相同。其頂端的[尋找與取代](../guide/guides/find-and-replace.md#read-only-editors)只能尋找，沒有 `Toggle Replace` 箭頭，也沒有「取代」列，前往相符項目時仍會將其捲動到可見範圍內並加以選取。在所有編輯器中，此面板的標題都是 `Explorer`，工具列按鈕的工具提示則是 `Explorer (Ctrl + F)` (Windows/Linux) 或 `Explorer (⌘ + F)` (Mac)。從 `3.10.0` 到 `4.0.0`，尋找與取代會以標題為 `Find`、僅供尋找的浮動面板形式開啟。  
「資料表屬性」仍可開啟，且自 `3.10.0` 起，其標題旁會顯示 `Read only` 徽章，其 `Indexes` 索引標籤也不提供任何編輯，請參閱[資料表屬性](../guide/guides/table-related-functions.md#table-properties)。  
自 `4.0.0` 起，唯讀編輯器不提供 [`Import and Add`](../guide/guides/file-import-export.md#import-and-add)、`New Table Group`、`Group selected tables`、`Remove from group`（請參閱[資料表群組](../guide/guides/table-groups.md#read-only-editors)）或 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns)，也不會顯示[歡迎畫面](#enablewelcomescreen)。「設定」索引標籤上的鎖定按鈕不會改變任何內容，「結構描述 SQL」索引標籤的 `Before tables` 和 `After tables` 指令碼也無法編輯。  
自 `4.1.0` 起，它的[畫布工具列](../guide/guides/table-related-functions.md#canvas-toolbar)上也不會顯示 `New Table`、`New Memo` 或 `New Table Group` 按鈕，`addTableGroup` 和 `groupSelectedTables` 按鍵繫結也不會有任何作用。  
自 `4.2.0` 起，[名稱顯示](../guide/guides/logical-names.md#read-only-editors)仍可從其每個選擇器切換，但只會作用於該編輯器自己的畫面：無論其鎖定為何，切換都絕不會傳到協作者。流程模式的 `Previous table` 和 `Next table` 仍可透過其按鈕或復原和重做按鍵逐步移動。  
[字典](../guide/guides/dictionary.md#read-only-editors)索引標籤仍可開啟：其工作表仍可切換、搜尋、選取、捲動和複製，`Checks` 工作表的列也仍會前往其所指的項目。任何儲存格都不接受編輯、貼上或清除，該索引標籤不會顯示 `Add Row`、`Delete Rows`、`Import CSV` 或 `Export CSV` 工具，網格上也沒有選單，其列按鍵組合也不會插入或刪除任何列。資料表選單、畫布選單和快速搜尋都不提供 [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) 或 `Derive Physical Name Again`。  
「結構描述 SQL」索引標籤中標示為 `This window only` 的選項（`Statements`、`Header`、自 `4.2.0` 起的 `Write logical names into empty comments` 和 `Tables`）從不儲存，且仍然有效；[`Export image`](../guide/guides/file-import-export.md#image) 對話方塊、佈景主題建立器和顯示語言選擇器也同樣仍可使用。在佈景主題建立器或顯示語言選擇器中進行選擇，仍會觸發 [changePresetTheme](#changepresettheme) 或 [changeLocale](#changelocale)。  
只寫屬性名稱、`=""` 和 `="true"` 都會讀取為 `true`。`="false"` 會讀取為 `false`，其他任何字串也一樣，包括 HTML 慣用寫法 `readonly="readonly"`。

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

決定是否自動與系統的深色/淺色模式同步。  
自 `4.0.0` 起，開啟此屬性會將佈景主題的 `appearance` 設為 `'system'`，與 `setPresetTheme({ appearance: 'system' })` 的作用相同。接著編輯器會顯示作業系統回報的淺色或深色，或 [setSystemAppearance](#setsystemappearance) 指定的外觀，並在其變更時隨之切換。  
之後以 `'light'` 或 `'dark'` 呼叫 [setPresetTheme](#setpresettheme)，或在佈景主題建立器或快速搜尋中選擇 `Light` 或 `Dark`，都會取代 `'system'` 並保持不變：即使 `systemDarkMode` 仍為 `true`，下一次 OS 變更也不會再覆寫它。在 `4.0.0` 之前，下一次 OS 變更會覆寫它。  
在外觀為 `'system'` 時關閉此屬性，會保留當下顯示的淺色或深色。在外觀已從 `'system'` 改為其他值之後關閉此屬性，外觀則維持原樣。  
變更此屬性不會觸發任何事件。

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

決定是否提供方便設定佈景主題預設集的 UI。  
它會顯示工具列的 `Theme` 按鈕，此按鈕會開啟含有 `Accent color`、`Gray color` 和 `Appearance` 的佈景主題建立器。自 `4.0.0` 起，`Appearance` 除了 `Light` 和 `Dark` 之外還提供 `System`，而此屬性開啟期間，快速搜尋會列出含有 `System`、`Light` 和 `Dark` 的 `Theme`。請參閱[語言與佈景主題](../guide/guides/language-and-theme.md)。

![從工具列開啟佈景主題建立器、選擇強調色和灰色調，並將外觀先切換為 Light 再切換為 System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

從此面板或快速搜尋變更佈景主題預設集時，會觸發 [changePresetTheme](#changepresettheme) 事件。

## enableLocalePicker {#enablelocalepicker}

自 `4.0.0` 起，決定是否提供選擇編輯器顯示語言的 UI。  
它會顯示工具列的 `Display Language` 按鈕，兩者都顯示時位於 `Theme` 之後。此按鈕會開啟顯示語言選擇器，快速搜尋也會列出 `Display Language`。兩者都提供 `System` 和 25 種語言，請參閱[語言與佈景主題](../guide/guides/language-and-theme.md)。  
它也決定在呼叫 [setLocale](#setlocale) 或選擇語言之前，編輯器會顯示什麼：開啟時為 `'system'`，關閉時為英文，因此未做任何設定的元素會維持一直以來顯示的英文。開啟或關閉它會立即在兩者之間切換。一旦設定或選擇了語言，不論此屬性如何切換，該選擇都會保留。  
在附加元素之前設定它，第一個畫面即可依循 `'system'`。  
進行選擇時會觸發 [changeLocale](#changelocale)。

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

自 `4.0.0` 起，決定空白圖表是否以[歡迎畫面](../guide/guides/editing-start.md#welcome-screen)迎接使用者。  
當文件中沒有資料表、沒有顯示中的備忘錄，也沒有顯示中的資料表群組時，它會覆蓋在 ERD 索引標籤上。設定 `readonly` 期間、禪模式中，或「資料表屬性」、差異檢視器、時光旅行或自動版面配置預覽開啟期間，都不會顯示它。第一個資料表、顯示中的備忘錄或顯示中的資料表群組出現後，它就會消失，而復原回空白圖表時，它會再次出現。  
其中的 `New Table`、`New Memo` 和 `Command Palette` 列，會依 [setKeyBindingMap](#setkeybindingmap) 設定後的狀態，顯示 `addTable`、`addMemo` 和 `search` 的第一個按鍵組合，留空的名稱則不顯示。其箭頭只會在 `enableThemeBuilder` 和 `enableLocalePicker` 顯示 `Theme` 和 `Display Language` 按鈕時指向這些按鈕。  
在其選單中，`↑`、`↓`、`Home` 和 `End` 會在各列之間移動，並會被阻止預設動作且停止傳播。`Enter` 和 `Space` 會停止傳播但不會被阻止預設動作，因此由取得焦點的列接收；在 `Import` 的各種格式之間按 `Escape` 會返回上一層，並會被阻止預設動作且停止傳播。其他所有按鍵都會照常傳到編輯器和頁面。  
它不會變更文件中的任何內容，因此 `value` 維持原樣，也不會觸發 `change`。  
比照官方主應用程式的做法，在 [setInitialValue](#setinitialvalue) 載入文件之後再開啟它，歡迎畫面就絕不會在仍在載入的檔案上方閃現。

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

以 JSON 字串取得目前的文件，格式為編輯器所定義的[結構描述](./advanced/schema.md)。  
自 `4.0.0` 起，它是儲存形式，也就是檔案所保存的文件形式，這也是 `json` 匯出所寫出和官方主應用程式所儲存的內容。它只保存現存的實體，不含已移除的實體、堆疊順序，以及編輯器自行計算出的資訊，例如測得的寬度、鍵標記和關聯錨點。其實體的鍵依固定順序排列，以兩個空格縮排，並以換行字元結尾，因此同一份文件一律會產生相同的位元組。  
自 `4.2.0` 起，它也會省略空的內容：空的 `doc` 清單、空的集合、不含任何內容的字典列，以及實體中空的文字屬性，例如名稱、註解、資料類型、預設值或顏色。實體內的清單（例如資料表的 `columnIds`）即使為空也仍會寫出。新文件的 `doc` 為 `{}`，且沒有 `collections`，因此請將缺少的屬性、清單或集合視為空的。它保存資料表和欄位的邏輯名稱與標示名稱是否由字典產生的旗標、欄位的定義域連結，以及詞彙、術語和定義域；每個字典都寫成一個由屬性名稱組成的標頭，後接其各列，每列佔一行，依工作表中的順序排列。請參閱[儲存形式與執行階段值](./advanced/schema.md#storage-form-and-runtime-value)。  
[鎖定](../guide/guides/settings.md#lock)為開啟的每項設定，都會以其鎖定的值寫出，而非畫面上顯示的值。`Viewport` 鎖定保存 `originX`、`originY` 和 `zoomLevel`，`Canvas Type`、`Language`、`Table Name Case`、`Column Name Case`、`Bracket Type`，以及自 `4.2.0` 起的 `Name View`，則各自保存其對應的設定。「名稱顯示」會寫成 `nameViewMode`，且只在其值不是 `'physical'` 時寫出。其他所有設定都會依目前狀態寫出，且一律會寫出 `lockSettings`。關於各個位元，請參閱 [Settings](./advanced/schema.md#settings)；`Name View` 鎖定的位元含義正好相反。  
新文件的所有鎖定都是開啟的，不論是元素在被賦予值之前顯示的文件，或是從空白值載入的文件。在關閉對應的鎖定之前，其 `value` 會將原點保持在 `0, 0`、縮放比例保持在 `1`，並維持 ERD 索引標籤、預設的程式碼產生器語言、名稱大小寫和引號類型，以及自 `4.2.0` 起的 `Physical Names`。  
在 `4.0.0` 之前，它會傳回編輯器所保存的完整文件，並套用 `ignoreSaveSettings`。編輯器所保存的文件現在是 [runtimeValue](#runtimevalue)，且不再讀取或寫入 `ignoreSaveSettings`。

```js
const data = editor.value;
```

### setter {#setter}

載入先前儲存的編輯器狀態。它會取代整份文件：會先清除目前的文件。自 `4.2.0` 起，這也包括詞彙、術語和定義域：文件會採用文字所保存的詞彙、術語和定義域，文字中沒有時則一個也沒有，且每個字典工作表自己的復原歷程記錄都會被清空。  
與 `clear()`、`setInitialValue()`，以及採用預設 `mode: 'replace'` 的 `setSchema*` 方法相同，它也會捨棄「視覺化」索引標籤的流程模式檢視：其版面配置、縮小範圍後的資料表、列顯示、縮放和平移，以及自 `4.2.0` 起其 `Previous table` 和 `Next table` 所逐一經過的資料表。附加（`mode: 'append'`）則不會捨棄它。  
它會記錄在歷程記錄清單中，因此可以 `Undo, Redo`，並會觸發 `change`。  
它接受儲存形式、[runtimeValue](#runtimevalue)，或舊版本儲存的檔案。  
空白字串或任何非字串的值，都會載入新文件，而不會引發錯誤，因此請在指派前先檢查該值。  
該新文件與 `setInitialValue('')` 建立的文件相同：內容為空、使用預設設定，且自 `4.0.0` 起所有鎖定皆為開啟。在 `3.10.x` 中，它既不儲存捲動位置也不儲存縮放比例，更早的版本則兩者都會儲存。  
共用存放區會以新文件的完整 JSON 將這次載入轉送給協作者，因此每個對等端（包括舊版本）都會載入它，不過 `4.2.0` 之前的編輯器會捨棄其無法辨識的內容，例如邏輯名稱、定義域連結和字典，請參閱[混用不同版本](./advanced/collaborative-editing.md#mixing-releases)。  
自 `4.0.0` 起，所載入文件的鎖定，以及 `value` 之後寫出的鎖定的值，都來自該文字，檢視會落在文字所指定的位置，若該處未繪製任何圖表內容，則落在圖表上。對於文字所鎖定的其他各項設定（索引標籤、程式碼產生器語言、名稱大小寫、引號類型，以及自 `4.2.0` 起的「名稱顯示」），編輯器會持續顯示載入前所顯示的內容。文字未鎖定的設定則採用文字中的值。在 `4.2.0` 之前儲存的檔案不會指定 `Name View` 鎖定，除非有 `4.2.0` 的編輯器在其中關閉了該鎖定，因此這類檔案載入時，「名稱顯示」會鎖定在 `Physical Names`，而編輯器會維持其原先顯示的「名稱顯示」。[setInitialValue](#setinitialvalue) 則會採用文字所保存的所有值；關於未指定任何鎖定的文字，也請參閱該節。  
非 JSON 的文字（例如殘留合併衝突標記的檔案）也不會引發錯誤：文件會被清空，其設定維持原樣，剖析錯誤則會記錄到主控台。  
設定 `readonly` 期間它會被忽略；若要載入到唯讀編輯器，請使用 [setInitialValue](#setinitialvalue)。

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

自 `4.0.0` 起，以 JSON 字串取得此編輯器所保存的文件。它沒有 setter，因此在嚴格模式的程式碼中指派它會擲回錯誤。  
它包含 [value](#value) 所省略的內容：已移除的實體及其順序、堆疊順序、測得的寬度、鍵標記、關聯錨點和序列，自 `4.2.0` 起還包括空的文字屬性、`doc` 清單和集合；從字典工作表中移除的列，以及不含任何內容的列；每個字典列的排序鍵；詞彙、術語和定義域的 `doc` 清單；以及指向已移除定義域的連結。鎖定的設定在這裡也會以其鎖定的值寫出。  
透過 [setInitialValue](#setinitialvalue)，以它初始化要加入已在執行中工作階段的另一個編輯器，例如協作者或同一份文件的第二個檢視。如此一來，當工作階段之後傳來某次移除的復原時，就能在該處完整還原該實體，而以 `value` 初始化的編輯器不保存任何已移除的實體，只會改為還原一個空白、未命名的資料表，或自 `4.2.0` 起還原一個空的字典列。請參閱[協作編輯](./advanced/collaborative-editing.md)。  
已移除的實體不再被任何機制回收，因此會一直留在其中，直到下次從檔案開啟該文件為止。  
切勿將它寫入檔案：請儲存 `value`，因為 [JSON Schema](./advanced/schema.md#json-schema) 接受 `value`，而不接受它。

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

載入先前儲存的編輯器狀態。載入本身不會記錄在歷程記錄清單中，因此無法復原，也不會觸發 `change` 事件。  
它也會清除復原歷程記錄，因此載入之前所做的任何操作，都無法在載入的文件上復原或重做；自 `4.2.0` 起，每個字典工作表自己的歷程記錄也會一併清除。  
它接受儲存形式、[runtimeValue](#runtimevalue)，或舊版本儲存的檔案，而且與指派 `value` 不同，它會採用文字所保存的所有設定，包括索引標籤和程式碼設定。  
空白字串或任何非字串的值，都會載入新文件，而不會引發錯誤，因此 `setInitialValue('')` 會建立空白圖表。  
自 `4.0.0` 起，該新文件（也就是元素在被賦予任何值之前顯示的文件）的所有鎖定皆為開啟。捲動、縮放、切換索引標籤，以及變更程式碼產生器語言、名稱大小寫、引號類型或（自 `4.2.0` 起）「名稱顯示」，都會讓 `value` 維持原樣，也不會觸發 `change`。在 `3.10.x` 中，它既不儲存捲動位置也不儲存縮放比例，更早的版本則兩者都會儲存。  
從文字載入的文件會保留其中指定的鎖定。未指定任何鎖定的文件（任何在 `4.0.0` 之前儲存的檔案，不論其 `ignoreSaveSettings` 為何，以及 v2 `.vuerd` 檔案）開啟時所有鎖定皆為開啟，其 `Viewport` 鎖定在原點 `0, 0` 和縮放比例 `1`，位於 ERD 索引標籤，語言、名稱大小寫和引號類型則維持儲存時的設定。  
自 `4.2.0` 起，指定了鎖定但未指定 `Name View` 鎖定的文字，開啟時該鎖定同樣為開啟，即使其他所有鎖定都是關閉的。在 `4.2.0` 之前儲存的檔案就是這類文字，除非有 `4.2.0` 的編輯器在其中關閉了該鎖定（請參閱 [Settings](./advanced/schema.md#settings)）。它會以 `Physical Names` 開啟，與完全未指定任何鎖定的文字相同。  
不論哪種情況，檢視都會開啟在文件的檢視位置（文字指定了鎖定時為文字所儲存的檢視位置，未指定時為原點 `0, 0`、縮放比例 `1`），若該處未繪製任何圖表內容，則開啟在圖表上。鎖定的 `Viewport` 仍會在 `value` 中保留其鎖定的值。  
自 `4.0.0` 起，它也會捨棄先前所保存文件的協作狀態，而此編輯器中已訂閱的[共用存放區](#getsharedstore)會再次向其他編輯器要求它們的狀態，因此在執行中工作階段裡重新載入的編輯器能夠跟上進度。以另一個編輯器的 [runtimeValue](#runtimevalue) 初始化這類編輯器。  
非 JSON 的文字也不會引發錯誤：文件會被清空，其設定維持原樣，剖析錯誤則會記錄到主控台。  
與指派 `value` 不同，它不受 `readonly` 阻擋，因此要將文件載入唯讀檢視器時，就是使用它。

```js
editor.setInitialValue('json...');
```

啟動時載入，變更時儲存。

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## 事件 {#event}

`change`、`changePresetTheme` 和 `changeLocale` 是僅有的三個公開事件；`changeLocale` 是 `4.0.0` 新增的。  
元素也會在自身上觸發內部的 `@dineug/erd-editor/internal-*` 事件，供其內部串接使用；這些事件不屬於 API。

### change {#change}

編輯器中發生變更時，會觸發此事件。  
此事件會以 200ms 防彈跳，且在 `readonly` 為 `true` 期間不會觸發。  
任何文件變更都會觸發它：在 UI 中編輯、指派 `value`、`clear()`、每個 `setSchema*` 方法，以及 `setSchemaJSON()` 和 `Import and Add`（自 `4.0.0` 起）。`setInitialValue` 不會觸發它。  
自 `4.2.0` 起，這也包括[字典](../guide/guides/dictionary.md)索引標籤上的每次編輯及其每次復原或重做、邏輯名稱或定義域連結的變更、`Derive Physical Names Again`，以及 `Name View` 鎖定關閉期間的「名稱顯示」切換。  
在「視覺化」索引標籤的流程模式中所做的任何操作（縮放、平移、移動卡片、`Tidy Up`、列顯示、從卡片縮小檢視範圍，或自 `4.2.0` 起透過 `Previous table` 和 `Next table` 或復原和重做按鍵逐步移動）都不會觸發它，因為這些都不是文件變更。其 `Name View` 清單是例外：`Name View` 鎖定關閉期間，在該處切換會觸發它，與在 ERD 索引標籤上切換相同。  
自 `4.0.0` 起，變更[鎖定](../guide/guides/settings.md#lock)為開啟的設定也不會觸發它，因為這只會改變畫面，絕不會改變 `value`：在 `Viewport` 鎖定期間捲動或縮放 ERD 畫布、在 `Canvas Type` 鎖定期間切換索引標籤、在各自的鎖定開啟期間變更程式碼產生器語言、資料表名稱大小寫、欄位名稱大小寫或引號類型，以及自 `4.2.0` 起在 `Name View` 鎖定期間切換「名稱顯示」。只有這些變更會被排除，因此同時也編輯文件的批次仍會觸發它。鎖定或解除鎖定設定則會觸發它。  
新文件和任何在 `4.0.0` 之前儲存的檔案中，所有鎖定都是開啟的，而任何在 `4.2.0` 之前儲存的檔案中，`Name View` 鎖定也是開啟的，除非有 `4.2.0` 的編輯器在其中將其關閉，因此預設情況下，捲動、縮放、切換索引標籤和切換「名稱顯示」都不會觸發任何事件。這包括從 ERD 索引標籤聚焦資料表、可從流程模式返回 ERD 索引標籤的外部連結卡片按鈕、前往物件總管的某一列或某個搜尋相符項目、從其他索引標籤開啟物件總管或前往快速搜尋結果，以及自 `4.2.0` 起從「字典」索引標籤 `Checks` 工作表的某一列前往資料表或欄位。只有在涵蓋該操作的鎖定關閉時，上述每項操作才會觸發一次 `change`：切換索引標籤對應 `Canvas Type`，而卡片按鈕、快速搜尋結果、物件總管的列、搜尋相符項目或 `Checks` 工作表的列同時造成的捲動則對應 `Viewport`。自 `4.1.0` 起，這些捲動全都依循同一條規則，也就是[跳至目標時的落點](../guide/guides/table-related-functions.md#where-a-jump-lands)，因此快速搜尋的資料表結果不再每次都捲動，而規則判定維持原位的跳至目標也不會產生需要觸發事件的捲動。開啟、關閉物件總管或調整其大小，會讓畫布變窄或變寬而不移動其原點，同樣不會觸發任何事件。在 `4.0.0` 之前，即使 `editor.value` 的結果相同，捲動、縮放和切換索引標籤也一律會觸發它。  
若要略過未改變任何內容的寫入，請將 `editor.value` 與您上次儲存的值比較，而不是與載入的檔案比較：舊版本寫出的檔案、v2 檔案或手動編輯過的檔案，一載入，其 `value` 就可能與檔案不同，因為 `value` 會以儲存形式寫出。`Viewport` 鎖定為關閉、且其原點在此畫面上未顯示任何圖表內容的檔案也是如此：載入會將檢視移到圖表上，而 `value` 會寫出其落點。自 `4.0.0` 起，測得的寬度不再造成這種情況，因為 `value` 不保存任何寬度。自 `4.2.0` 起，`4.0.0` 或 `4.1.0` 儲存的檔案也可能不同，因為 `value` 現在會省略其中空的文字屬性、清單和集合，所以這類檔案會在下次儲存時被重寫一次。寫入檔案的主應用程式也可以改用複寫存放區的 `changed` 區分編輯與檢視變更，請參閱 [on@change](./advanced/remote-storage.md#onchange)。  
此事件不攜帶 `detail`，既不會冒泡，也不會跨越 shadow 邊界，因此請在元素本身上監聽，並在處理常式中讀取 `editor.value`。

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

從內建的佈景主題建立器變更佈景主題預設集時，或自 `4.0.0` 起從快速搜尋中的 `Theme` 變更時，會觸發此事件。每次選擇都會觸發它，包括選擇目前已生效的選項。  
自行呼叫 [setPresetTheme](#setpresettheme) 或 [setSystemAppearance](#setsystemappearance)，或開啟或關閉 [systemDarkMode](#systemdarkmode)，都不會觸發它。  
`event.detail` 是選擇後完整的 `ThemeOptions`（`{ appearance, grayColor, accentColor }`），而不是所要求的部分值。自 `4.0.0` 起，選擇 `System` 時其 `appearance` 為 `'system'`，而不是其顯示的淺色或深色，因此請原樣儲存，再將其交回給 `setPresetTheme`。

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

自 `4.0.0` 起，在編輯器中選擇語言時觸發，可從顯示語言選擇器或快速搜尋中的 `Display Language` 選擇，兩者都由 [enableLocalePicker](#enablelocalepicker) 開啟。  
它會在語言套用後觸發，每次選擇都會觸發，包括選擇目前已生效的選項。[setLocale](#setlocale) 和 [setSystemLocale](#setsystemlocale) 絕不會觸發它，瀏覽器語言的變更也不會。切換語言不會觸發 `change`。  
`event.detail` 為 `{ locale }`，也就是 `LocaleOption`：選擇 `System` 時為 `'system'`，否則為該語言的代碼。元素不會記住所做的選擇，因此請將其儲存，並在下次載入時傳給 `setLocale`。  
與 `change` 相同，它不會冒泡，因此請在元素本身上監聽。

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

讓編輯器取得焦點。

```js
editor.focus();
```

## blur {#blur}

讓編輯器失去焦點。

```js
editor.blur();
```

## clear {#clear}

清空文件，移除所有資料表、欄位、關聯、索引和備忘錄，自 `4.0.0` 起也會移除所有資料表群組，自 `4.2.0` 起還會移除「字典」索引標籤的詞彙、術語和定義域，並清空每個工作表自己的復原歷程記錄。  
所有設定都會保留，包括資料庫、檢視位置、縮放比例、資料表檢視選項、每個鎖定及其保存的值，以及「結構描述 SQL」索引標籤的 `Before tables` 和 `After tables` 指令碼，因此清空後的檔案仍會繼續儲存原先所儲存的設定。若要改為建立新文件，請將 `''` 指派給 `value`，或呼叫 `setInitialValue('')`。  
它會記錄在歷程記錄清單中，因此可以復原，並會觸發 `change`。復原會將文件（包括其詞彙、術語和定義域）還原為編輯器先前所保存的狀態，每項鎖定的設定都維持其鎖定的值。設定 `readonly` 期間它會被忽略。

```js
editor.clear();
```

## destroy {#destroy}

完全銷毀編輯器執行個體，使其無法再重複使用。  
它會釋放編輯器的監聽器和訂閱，並銷毀 [getSharedStore](#getsharedstore) 傳回的所有共用存放區。  
共用存放區仍暫存而未送出的串流批次，會隨之一併被捨棄；若要送出，請先呼叫該存放區的 [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers)。

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

重新定義鍵盤快速鍵。  
`edit`、`stop`、`undo`、`redo`、`zoomIn`、`zoomOut` 和 `zoomReset` 是固定的，無法重新定義。  
只會寫入下方的二十一個名稱；物件中的其他任何內容都會被忽略，包括固定的名稱。  
自 `3.10.0` 起，`search` 可以重新定義，並新增了 `findReplace`。在此之前，`search` 是固定的。自 `4.0.0` 起，新增了 `removeSelection`。自 `4.1.0` 起，新增了 `addTableGroup` 和 `groupSelectedTables`。  
按鍵繫結的值必須是 `ShortcutOption[]`。單純的字串會被忽略，因此請寫成 `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`，而不是 `{ addTable: 'Alt+KeyN' }`。  
空陣列也會被接受，且不會繫結任何按鍵：`setKeyBindingMap({ findReplace: [] })` 會將 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 留給頁面，`{ search: [] }` 對 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 也是如此。工具列的 `Search` 按鈕仍會開啟快速搜尋，工具列的 `Explorer` 按鈕仍會開啟和關閉物件總管，快速搜尋和畫布的右鍵選單中的 `Toggle Explorer` 也仍會開啟其搜尋或將其關閉；對於留空的名稱，這些位置都不會顯示快速鍵。`{ removeSelection: [] }` 會將 `Delete` 和 `Backspace` 留給頁面，此時資料表、備忘錄和資料表群組選單中的刪除項目（`Delete`、`Delete selected`、`Delete column`、`Delete columns`）都不會顯示快速鍵。  
自 `4.1.0` 起，`{ addTableGroup: [] }` 會將 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac) 留給頁面，`{ groupSelectedTables: [] }` 則會將先按 `T` 再按 `G` 留給頁面。畫布工具列、畫布的右鍵選單和快速搜尋中的 `New Table Group`、資料表選單中的 `Group selected tables`，以及快速搜尋中的 `Group Selected Tables` 仍可使用，只是不會顯示快速鍵。畫布工具列的 `New Table`、`New Memo` 和 `New Table Group` 按鈕的工具提示，會列出 `addTable`、`addMemo` 和 `addTableGroup` 的第一個按鍵組合，按鍵繫結留空時則只列出按鈕名稱。  
自 `4.2.0` 起，`addColumn` 和 `removeColumn` 也會為「字典」索引標籤的網格提供其列按鍵組合（如下所述），因此重新對應其中任一個，這些按鍵組合也會隨之改變。`{ addColumn: [] }` 會讓網格沒有插入列的按鍵組合，此時網格選單的兩個插入項目都不會顯示快速鍵；`{ removeColumn: [] }` 會讓網格沒有刪除列的按鍵組合，此時選單的刪除項目和 `Delete Rows` 的工具提示都不會顯示快速鍵。  
此呼叫是部分合併：未指定的名稱會保留預設值，呼叫兩次也會保留先前的變更。目前的按鍵繫結沒有 getter：[createKeyBindingMap](#createkeybindingmap) 傳回的是預設值，而不是 `setKeyBindingMap` 變更後的內容。

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`、`handTool`、`removeSelection` 和 `groupSelectedTables`（自 `4.1.0` 起）都會讓位給插入點：焦點位於輸入框、文字區域或 `contenteditable` 元素中時，`$mod + A` 會選取文字，`Space` 會輸入空格，`Delete` 和 `Backspace` 會清除文字，先按 `T` 再按 `G` 會輸入這兩個字母，而不會傳到畫布。這些按鍵都不會被阻止預設動作。無論將它們重新對應到哪個按鍵，行為都相同。

自 `4.0.0` 起，`removeSelection`（`Delete` 或 `Backspace`）會在 ERD 索引標籤上移除選取範圍，算作一個復原步驟，且不會詢問確認。當只有焦點資料表被選取、其一或多個欄位被選取，且目前的縮放比例會繪製其列時，它會移除這些欄位；否則會移除所有選取的資料表、備忘錄和資料表群組，但保留群組中的資料表。請參閱[刪除資料表與備忘錄](../guide/guides/table-related-functions.md#table-and-memo-deletion)。  
按住不放的按鍵只會移除一次，且儲存格、備忘錄或資料表群組名稱編輯器開啟期間不會移除任何內容。在輸入框和會攔下按鍵繫結的面板與索引標籤（請參閱 [createKeyBindingMap](#createkeybindingmap)）之外，只要編輯器擁有焦點，無論在哪個索引標籤，此按鍵都會被阻止預設動作，焦點位於工具列按鈕上時也是如此，唯讀編輯器中亦然，只是不會移除任何內容。

自 `4.1.0` 起，`addTableGroup`（`Alt+KeyG`）會在 ERD 索引標籤上進入 `New Table Group` 的繪製狀態，之後在畫布上按下滑鼠主要按鍵即可繪製群組，再按一次則會結束繪製狀態，與畫布工具列的 `New Table Group` 按鈕相同。`groupSelectedTables`（`KeyT KeyG`，也就是先按 `T` 再按 `G`）會將選取的資料表放入新群組並開啟其名稱編輯器，與資料表右鍵選單中的 `Group selected tables` 相同。未選取任何資料表時，它不會加入任何內容；選取的備忘錄或資料表群組不列入計算。請參閱[繪製群組](../guide/guides/table-groups.md#drawing-a-group)和[將所選資料表組成群組](../guide/guides/table-groups.md#grouping-selected-tables)。  
兩者只在選單提供群組功能時才會作用：設定 `readonly` 期間、`Table Groups` 檢視選項隱藏群組期間，或儲存格、備忘錄或資料表群組名稱編輯器開啟期間都不會作用。與其他畫布按鍵繫結相同，它們只在 ERD 索引標籤上作用，且在快速搜尋、「資料表屬性」、差異檢視器、時光旅行、自動版面配置預覽、`Export image` 或 `Map Columns` 開啟期間不會作用。在它們不會作用的情況下，按鍵仍會被阻止預設動作，除非 `groupSelectedTables` 讓位給插入點。`addTableGroup` 也會停止傳播（`focusView` 和 `zenMode` 也是如此），因此頁面上冒泡階段的 `keydown` 監聽器絕不會收到它。

自 `4.2.0` 起，在[字典](../guide/guides/dictionary.md#adding-and-deleting-rows)索引標籤上，`addColumn` 的每個單次按鍵組合都會在選取範圍下方插入與選取範圍所涵蓋列數相同的列，同時再按住 `Shift` 的同一按鍵組合會改為在上方插入這些列，而 `removeColumn` 的每個單次按鍵組合會刪除選取範圍所涵蓋的列：預設設定下分別為 `Alt+Enter`、`Alt+Shift+Enter`，以及 `Alt+Backspace` 或 `Alt+Delete`。它們會在 `Domains`、`Words` 和 `Terms` 工作表的網格中、沒有開啟任何儲存格編輯時作用。本身已包含 `Shift` 的 `addColumn` 按鍵組合不會產生在上方插入的按鍵組合，而繫結到這兩個名稱之一的按鍵序列不會為網格提供任何按鍵組合。  
每次這類按鍵都會依其選項的設定被阻止預設動作，且一律會停止傳播，因此不會在 ERD 索引標籤上新增或移除任何欄位。在 `Checks` 工作表上和唯讀編輯器中，它不會有任何作用，但仍會被阻止預設動作並停止傳播。在開啟中的儲存格編輯或該索引標籤的搜尋輸入框中，這些按鍵組合會留給文字處理：它們在該處會停止傳播，但不會被阻止預設動作，因此輸入框會像在其他任何地方一樣回應它們（在 Mac 上，`⌥ + Backspace` 會刪除一個字詞）。[dictionaryRowChords](#dictionaryrowchords) 會列出這些按鍵組合。

自 `3.10.0` 起，`findReplace`（`$mod+KeyF`）會開啟[尋找與取代](../guide/guides/find-and-replace.md)。自 `4.1.0` 起，它會切換包含尋找與取代的[物件總管](../guide/guides/explorer.md#opening-and-closing)，且「快速鍵」索引標籤會將其列為 `Toggle Explorer`。  
當工具列的 `Explorer` 按鈕呈現按下狀態時（物件總管在 ERD 索引標籤上開啟且未被禪模式隱藏），它會關閉物件總管，除非快速搜尋、「資料表屬性」、佈景主題建立器、顯示語言選擇器、`Export image` 對話方塊或 `Map Columns` 已開啟。否則，它會關閉上述任何已開啟的項目，從任何其他索引標籤切換到 ERD 索引標籤，並開啟物件總管，將插入點置於其 `Find` 輸入框中並選取搜尋字串。編輯器太窄而無法在畫布旁顯示物件總管時，會讓物件總管保持開啟但暫時隱藏，並顯示 `Widen the window to show the Explorer` 快顯通知。在 `4.1.0` 之前，它會開啟浮動的尋找與取代面板，或將鍵盤焦點交還給其輸入框，且從不關閉該面板。  
它不會讓位給插入點：只要編輯器擁有焦點，無論在哪個索引標籤，也無論焦點位於畫布或編輯器內的輸入框，此按鍵都會被它接收。此按鍵會被阻止預設動作，所以瀏覽器不會開啟尋找列；也會停止傳播，所以頁面上冒泡階段的 `keydown` 監聽器都不會收到它。儲存格或備忘錄編輯器開啟時、自 `4.0.0` 起資料表群組名稱編輯器開啟時，或自 `4.2.0` 起「字典」索引標籤的網格中有儲存格編輯開啟時，它仍會被阻止預設動作並停止傳播，但不會有任何作用。在最後這種情況下，`search` 也不會有任何作用，因此已輸入的文字會保留下來。  
差異檢視器、時光旅行或自動版面配置預覽開啟期間（無論在哪個索引標籤），或輸入法仍在組字時，它既不會被阻止預設動作，也不會停止傳播，因此會由瀏覽器或主應用程式自己的尋找功能接收。在物件總管內，仍在組字中的按鍵會在該處停止傳播，但不會被阻止預設動作。無論將 `findReplace` 重新對應到哪個按鍵，行為都相同。

`focusView` 只在 ERD 索引標籤上作用。至少選取一個資料表時，它會以流程模式開啟「視覺化」索引標籤，並將範圍縮小到這些資料表，以及與其相隔一個關聯的所有資料表；選取的備忘錄或資料表群組不列入計算，未選取任何資料表時則不會有任何作用。請參閱[聚焦資料表](../guide/guides/visualization.md#focusing-on-tables)。

`undo` 和 `redo` 的作用依索引標籤而定。在 ERD 索引標籤上，它們會復原和重做文件的歷程記錄。自 `4.2.0` 起，在「字典」索引標籤上，它們會復原和重做目前顯示的工作表自己的歷程記錄，在 `Checks` 工作表上則不會有任何作用，請參閱[字典工作表](../guide/guides/undo-redo.md#dictionary-sheets)。在「視覺化」索引標籤的流程模式中，它們會像 [`Previous table` 和 `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) 一樣返回上一步和前進到下一步，不會影響文件的歷程記錄。在其他索引標籤上，以及在關係圖模式中，它們不會復原任何內容。

在 ERD 索引標籤上，`stop`（`Escape`）會結束開啟中的儲存格或備忘錄編輯器，或正在繪製的關聯，並讓選取範圍維持原樣。自 `4.0.0` 起，它也會結束資料表群組名稱編輯器（不寫入任何名稱）和 `New Table Group` 的繪製。編輯器會對該次按鍵呼叫 `preventDefault()`。  
上述項目都未開啟時，`Escape` 會清除選取範圍和焦點儲存格，且不會被阻止預設動作。因此，離開編輯並清除選取範圍需要按兩次。  
自 `4.2.0` 起，邏輯名稱儲存格的術語清單顯示期間（請參閱[術語名稱自動完成](../guide/guides/logical-names.md#completing-term-names)），第一次按 `Escape` 只會關閉該清單，並讓編輯器保持開啟。該次按鍵會在儲存格處被阻止預設動作並停止傳播，因此 `stop` 和頁面上冒泡階段的 `keydown` 監聽器都不會收到它。  
除了物件總管、[歡迎畫面](#enablewelcomescreen)的 `Import` 格式、邏輯名稱儲存格的術語清單、[字典](../guide/guides/dictionary.md#keys-on-the-tab)索引標籤，以及下方所述的選擇器和對話方塊之外，編輯器絕不會阻止 `Escape` 傳播，因此自行監聽它的頁面（例如用來關閉自己的對話方塊）會收到這兩次按鍵，並可略過 `defaultPrevented` 為 `true` 的那一次。  
快速搜尋、「資料表屬性」、差異檢視器、自動版面配置預覽或時光旅行開啟期間，`Escape` 會改為關閉該項目，並讓選取範圍維持原樣。該次按鍵同樣不會被阻止預設動作。  
自 `4.0.0` 起，開啟中的 [`Export image`](../guide/guides/file-import-export.md#image) 或 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) 對話方塊也會接收 `Escape`，關閉自身並讓選取範圍維持原樣。兩者開啟時都會取得鍵盤焦點，而該次 `Escape` 會被阻止預設動作並停止傳播。  
自 `4.1.0` 起，焦點位於[物件總管](../guide/guides/explorer.md#keys-in-the-explorer)內（其樹狀結構、輸入框或按鈕）時按下的 `Escape`，會將鍵盤焦點交還給畫布，並讓物件總管保持開啟、選取範圍維持原樣。編輯器會對它同時呼叫 `preventDefault()` 和 `stopPropagation()`，因此它絕不會傳到頁面上冒泡階段的 `keydown` 監聽器。  
在畫布上按 `Escape` 絕不會關閉物件總管。在 `4.1.0` 之前，在尋找與取代面板內按 `Escape` 會關閉該面板，而在畫布上按則會在清除選取範圍的同一次按鍵中將其關閉。  
自 `4.0.0` 起，顯示語言選擇器和顏色選擇器會在按 `Escape` 時關閉：在其內部按下時會被阻止預設動作並停止傳播，在畫布上按下時則會在清除選取範圍的同一次按鍵中將其關閉，既不會被阻止預設動作，也不會停止傳播。  
輸入法仍在組字時按下的 `Escape` 屬於組字操作。它會讓開啟中的編輯器維持原樣，且不會被阻止預設動作，因此頁面也可以略過 `isComposing` 為 `true` 或 `keyCode` 為 `229` 的按鍵。在物件總管內，這類按鍵就像在該處組字途中按下的任何按鍵一樣，也會停止傳播，鍵盤焦點則會留在輸入框中。  
在 `3.9.2` 之前，按一次 `Escape` 會同時結束編輯或繪製並清除選取範圍，且編輯器從不阻止其預設動作。

### createKeyBindingMap {#createkeybindingmap}

自 `3.9.2` 起，套件會匯出 `createKeyBindingMap()`，並一併匯出 `KeyBindingMap`、`KeyBindingName` 和 `ShortcutOption` 型別。  
它會傳回預設的按鍵繫結，共 28 個名稱（包括固定的名稱），且每次呼叫都會傳回新的對應表，因此變更它所傳回的對應表不會影響其他任何內容。  
這是每個編輯器的起始設定，且 `setKeyBindingMap` 呼叫的結果不會反映在其中。  
這四者中只有 `createKeyBindingMap` 是執行階段匯出；其他三者都是型別。自 `4.2.0` 起，[dictionaryRowChords](#dictionaryrowchords) 也會與它一併匯出。

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

每個 `shortcut` 都是採用 [tinykeys](https://github.com/jamiebuilds/tinykeys) 語法的按鍵組合，以 `KeyboardEvent.code` 指定按鍵，其中 [`$mod`](#mod) 在 macOS 上為 `⌘`，在其他平台上為 `Control`。  
自 `4.0.0` 起，編輯器會以相同的語法自行解析這些按鍵組合，不再透過 tinykeys。按鍵會依其 `code` 比對，或依其 `key`（不論大小寫）比對，且只有在恰好按住所指定的輔助按鍵時，該次按鍵才會相符。`AltGraph` 在 Windows 上視為 `Control` 和 `Alt`，在 macOS 上視為 `Alt`。以空格分隔的多次按鍵會構成按鍵序列，若一秒內沒有 keydown，序列就會重新開始。  
自 `4.1.0` 起，有一個預設值是按鍵序列：`groupSelectedTables` 為 `KeyT KeyG`，也就是先按 `T` 再按 `G`。按鍵序列會在完成它的那次按鍵時執行，且只有該次按鍵會套用其 `preventDefault` 和 `stopPropagation`，因此在預設設定下，`T` 會傳到頁面，只有 `G` 會被阻止預設動作。選單、快速搜尋和「快速鍵」索引標籤會將按鍵序列顯示為每次按鍵各一個按鍵。  
固定的名稱繫結到 `Enter`（`edit`）、`Escape`（`stop`）、`$mod+KeyZ`（`undo`）、`$mod+Shift+KeyZ`（`redo`）、`$mod+Equal`（`zoomIn`）、`$mod+Minus`（`zoomOut`）和 `$mod+Digit0`（`zoomReset`）。`edit` 和 `stop` 不帶任何旗標；其他五個則帶有 `preventDefault` 和 `stopPropagation`。其餘名稱則為上方的預設值，其中包括 `search` 和 `findReplace`。

編輯器會在自己的元素上監聽這些按鍵，因此若主應用程式會比編輯器更早接收按鍵（透過全域快速鍵或擷取階段的 `keydown` 監聽器），就必須在編輯器擁有焦點時讓這些按鍵通過。  
以 `createKeyBindingMap()` 建立要放行的清單，並以傳給 `setKeyBindingMap` 的按鍵繫結取代對應的預設值。  
自 `3.10.0` 起，該清單包含 `$mod+KeyF`，也就是瀏覽器本身的尋找按鍵組合。想在該按鍵組合上保留自身尋找功能的主應用程式，可傳入 `setKeyBindingMap({ findReplace: [] })`。  
自 `4.0.0` 起，它也包含不帶輔助按鍵的 `Delete` 和 `Backspace`。想保留這些按鍵的主應用程式，可傳入 `setKeyBindingMap({ removeSelection: [] })`。  
自 `4.1.0` 起，它也包含 `Alt+KeyG` 和按鍵序列 `KeyT KeyG`，後者是一個字串：請在空格處將其分開，並讓每次按鍵（包括不帶輔助按鍵的 `T` 和 `G`）通過，因為缺少任何一次按鍵的序列永遠無法完成。想保留這些按鍵的主應用程式，可傳入 `setKeyBindingMap({ addTableGroup: [] })` 或 `setKeyBindingMap({ groupSelectedTables: [] })`。  
自 `4.2.0` 起，請再將 [dictionaryRowChords](#dictionaryrowchords) 針對同一個對應表傳回的按鍵組合加入該清單，其中包括 `Alt+Shift+Enter`。想保留這些按鍵的主應用程式，可傳入 `setKeyBindingMap({ addColumn: [] })` 或 `setKeyBindingMap({ removeColumn: [] })`，這也會讓這些按鍵不再用於在 ERD 索引標籤上新增和移除欄位。

焦點位於物件總管內（其樹狀結構、`Find` 和 `Replace` 輸入框或按鈕）時，`findReplace`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut` 和 `zoomReset` 會傳到編輯器，因此 `findReplace` 在該處的作用與在畫布上相同。其他所有按鍵繫結（依目前的設定）都會停在物件總管，按鍵序列則停在其最後一次按鍵（預設設定下為不帶輔助按鍵的 `G`），方向鍵、`Tab`、`Enter`、`Space`、`Home`、`End`，以及輸入法仍在組字時按下的任何按鍵也是如此。除了會將鍵盤焦點交還給畫布的 `Escape` 之外，這些按鍵都會停止傳播，但不會被阻止預設動作，因此它們在物件總管的輸入框、按鈕和樹狀結構中會作為一般按鍵運作，既不會傳到畫布，也不會傳到頁面上冒泡階段的 `keydown` 監聽器：在該處按 `Alt + N` 不會新增資料表，按 `Delete` 也不會移除任何內容。用於移動、摺疊或前往樹狀結構中某一列的按鍵，以及在 `Find` 或 `Replace` 輸入框中用於在相符項目之間移動或執行取代的 `Enter`，也會被阻止預設動作。  
其他任何按鍵（例如主應用程式的儲存或命令選擇區按鍵組合）都會照常傳到頁面。請參閱[物件總管中的按鍵](../guide/guides/explorer.md#keys-in-the-explorer)。在 `4.1.0` 之前，浮動的尋找與取代面板也以相同方式攔下按鍵，但 `Home`、`End`、按鍵序列的最後一次按鍵，以及 `handTool` 繫結到其他按鍵時的 `Space` 除外。  
自 `4.0.0` 起，顯示語言選擇器也以相同方式攔下按鍵：同樣的七個按鍵繫結會通過，其他所有按鍵繫結（自 `4.1.0` 起，按鍵序列依其最後一次按鍵）、方向鍵和 `Tab` 都會在該處停止傳播，但不會被阻止預設動作，輸入法仍在組字時按下的任何按鍵也是如此。在其中某一列上按 `↑`、`↓`、`Home`、`End`、`Enter` 和 `Space`，會在各列之間移動或選擇其中一列，且也會被阻止預設動作。

自 `4.2.0` 起，[字典](../guide/guides/dictionary.md#keys-on-the-tab)索引標籤也會攔下按鍵，只有 `search`、`findReplace`、`undo` 和 `redo` 會傳到編輯器。`undo` 和 `redo` 會作用於目前顯示的工作表自己的歷程記錄；儲存格編輯開啟時或焦點位於該索引標籤的搜尋輸入框中時，它們會留給文字處理，在該處會停止傳播，但不會被阻止預設動作。如上所述，儲存格編輯開啟期間，`search` 和 `findReplace` 不會有任何作用。列按鍵組合會在網格中作用，如上方 `addColumn` 和 `removeColumn` 的說明所述。  
其他所有按鍵繫結（依目前的設定）都會停在該索引標籤，按鍵序列則停在其最後一次按鍵，方向鍵、`Tab`、`Enter`、`Space`、`Home`、`End`，以及輸入法仍在組字時按下的任何按鍵也是如此。它們都不會傳到畫布或頁面上冒泡階段的 `keydown` 監聽器：在該處按 `Alt + N` 不會新增資料表，按 `Delete` 也不會從圖表中移除任何內容。該索引標籤中的複製、剪下和貼上事件也會停在該處，因此圖表絕不會將其當成自己的事件讀取。其他任何按鍵都會照常傳到頁面。

### dictionaryRowChords {#dictionaryrowchords}

自 `4.2.0` 起，套件會匯出 `dictionaryRowChords()`。它會依您傳入的按鍵繫結對應表，傳回「字典」索引標籤的網格用於插入或刪除列的所有按鍵組合，且每次呼叫都會傳回新的 `ShortcutOption[]`。  
其順序依次為：`addColumn` 的單次按鍵組合，用於在選取範圍下方插入列；上述每個按鍵組合再同時按住 `Shift` 的形式，用於在上方插入列，本身已包含 `Shift` 的按鍵組合則沒有對應項目；以及 `removeColumn` 的單次按鍵組合，用於刪除列。每個按鍵組合都會保留其來源按鍵繫結的 `preventDefault` 和 `stopPropagation`，按鍵序列則會被省略。請參閱[新增與刪除列](../guide/guides/dictionary.md#adding-and-deleting-rows)。  
在上方插入列的按鍵組合（預設設定下為 `Alt+Shift+Enter`）不屬於任何按鍵繫結，因此若主應用程式會精確比對輔助按鍵，且只以 [createKeyBindingMap](#createkeybindingmap) 建立要放行的按鍵清單，就永遠不會讓它通過。請像 Obsidian 外掛程式一樣，讓兩份清單都通過。  
它只會讀取傳給它的對應表，而不會讀取元素的按鍵繫結，因此請傳入您建立按鍵清單時所依據的對應表。

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

依執行環境切換 `Control` 鍵。

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### 快速鍵對照表 {#shortcut-table}

使用鍵盤事件的 `key, code` 屬性。  
以 `code` 表示絕對位置，以 `key` 表示輸入值。

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## 佈景主題 {#theme}

### setPresetTheme {#setpresettheme}

設定佈景主題預設集。  
預設值為 `appearance: 'dark'`、`grayColor: 'slate'` 和 `accentColor: 'indigo'`。  
每個屬性會各自套用，因此只傳入部分屬性的呼叫會讓其他兩個屬性維持原樣。不屬於下方名稱的值會被忽略，且此呼叫絕不會擲回錯誤。  
自 `4.0.0` 起，`appearance` 也接受 `'system'`，也就是佈景主題建立器中的 `System`。它會顯示作業系統回報的淺色或深色，或 [setSystemAppearance](#setsystemappearance) 指定的外觀，並在其變更時隨之切換。

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

自 `4.0.0` 起，為擁有自己淺色與深色外觀（例如 IDE 佈景主題）的主應用程式指定 `'system'` 外觀所顯示的淺色或深色。指定期間，作業系統的變更會被忽略。  
`null` 或 `'dark'`、`'light'` 以外的任何值，都會恢復為依循作業系統。  
外觀為 `'light'` 或 `'dark'` 時，它不會改變畫面上的任何內容，但會保留該值，並在外觀變為 `'system'` 時立即套用。否則會立即套用。它不會觸發任何事件，`changePresetTheme` 也會持續回報 `'system'`。  
VS Code、JetBrains 和 Obsidian 主應用程式會以各自的淺色或深色呼叫它，並在其變更時再次呼叫。

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

可自訂佈景主題。  
每次呼叫都會取代整個自訂覆蓋層，因此若要在現有覆寫之上變更某個 token，請再次傳入完整的物件；傳入 `{}` 即可恢復為預設集。  
只會保留下方列出、值為字串的 token 名稱；其他任何內容都會被捨棄，且不會產生錯誤。  
覆蓋層位於預設集之上，因此之後呼叫 `setPresetTheme` 會替換底下的預設集，而您的覆寫會保留。

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` 和 `memoShadow` 是資料表和備忘錄在 ERD 畫布上投射的陰影顏色。深色預設集將其設為 `transparent`，也就是不投射陰影，與將 `none` 或空字串傳給 `setTheme` 的效果相同；淺色預設集則使用 `rgba(0, 0, 0, 0.18)`。

自 `4.0.0` 起，新增了九個 token：

- `tableGroupHeaderBackground`、`tableGroupBackground` 和 `tableGroupBorder` 用於為沒有自訂顏色的[資料表群組](../guide/guides/table-groups.md)的標題列、主體和外框著色。
- `toastSuccess` 和 `toastError` 用於為回報操作結果的快顯通知標記著色。
- `findReplaceError` 和 `mapColumnsError` 用於為尋找與取代和「對應欄位」對話方塊顯示的錯誤著色。尋找與取代先前使用的是 `diffDeleteForeground`，因此覆寫該 token 不再會改變其顏色。
- `schemaSqlWarningBackground` 和 `schemaSqlWarningForeground` 用於為「結構描述 SQL」索引標籤選項中的警告著色。

自 `4.1.0` 起，又新增了九個 token：

- `treeBackground`、`treeRowHover`、`treeRowCurrent`、`treeMuted` 和 `treeMatch` 用於為[物件總管](../guide/guides/explorer.md#the-tree)和[差異檢視器](../guide/guides/table-related-functions.md#diff-viewer)共用的樹狀結構著色：其背景（也會填滿物件總管的 `Find` 和 `Replace` 輸入框）；指標所在的列、樹狀結構擁有焦點時鍵盤所在的列，以及物件總管標頭與搜尋區中指標所在的按鈕；目前搜尋相符項目所在的列；淡化文字，例如計數、資料類型和摺疊箭頭；以及搜尋找到的文字背後的標示。
- `explorerBackground` 和 `explorerBorder` 用於為物件總管面板及其線條著色：面板在畫布旁的邊緣、搜尋區下方的線條，以及其輸入框與 `Search In` 展開的按鈕的邊框。`explorerBorder` 也用於繪製差異檢視器樹狀結構的邊緣、其 `Filter by name` 輸入框下方的線條，以及該輸入框的邊框。物件總管的鑰匙圖示使用 `keyPK`、`keyFK` 和 `keyPFK`。
- `diffModifyForeground` 和 `diffRenameForeground` 用於為差異檢視器在其樹狀結構及兩份文件上標示為已修改和已重新命名的項目著色。`diffModifyForeground` 也會以外框標示已移動、已調整大小、已變更顏色或已變更群組的資料表、備忘錄或資料表群組（不論其中還有哪些其他變更），並繪製已變更之外鍵的連接線。

`diffInsertForeground` 和 `diffDeleteForeground` 現在用於為差異檢視器在其樹狀結構及包含該項目的文件上標示為已新增和已移除的項目著色，文字、外框和連接線皆然。`diffInsertBackground`、`diffDeleteBackground`、`diffCrossBackground` 和 `diffCrossForeground` 已在 `4.1.0` 中移除，因為差異檢視器不再填滿儲存格。`setTheme` 會像對待任何不在 `Theme` 中的名稱一樣捨棄它們，而它們的掛鉤 `--erd-editor-diff-insert-background`、`--erd-editor-diff-delete-background`、`--erd-editor-diff-cross-background` 和 `--erd-editor-diff-cross-foreground` 也不再被讀取。

自 `4.2.0` 起，又新增了十二個 token：

- `columnHandleBackground` 和 `columnHandleBorder` 用於填滿[欄位拖曳控點](../guide/guides/table-editing.md#rearranging-and-moving-columns)並繪製其外框，該控點繪製在資料表左側邊緣外側、焦點欄位列旁；指標停留在控點上時，則改用 `columnHandleHoverBackground` 和 `columnHandleHoverBorder`。其拖曳控點圖示採用 `foreground`，指標停留在其上時則採用 `active`。
- `dictionaryErrorForeground` 和 `dictionaryWarningForeground` 用於為[字典檢查](../guide/guides/dictionary.md#what-each-check-finds)找出的錯誤或警告著色：ERD 畫布上被標出的名稱（請參閱[畫布上的標示](../guide/guides/dictionary.md#marks-on-the-canvas)）、`Domains`、`Words` 和 `Terms` 工作表上被標出的儲存格文字，以及 `Checks` 的計數。`dictionaryErrorBackground` 和 `dictionaryWarningBackground` 用於填滿這類儲存格。指標停留在 `Delete Rows` 工具上時，`dictionaryErrorForeground` 也會為其著色。
- `dictionaryBackground`、`dictionaryHeaderBackground`、`dictionaryGridLine` 和 `dictionaryHeaderSelect` 用於為[字典](../guide/guides/dictionary.md#the-sheets)索引標籤的工作表著色：其儲存格（也會填滿該索引標籤的搜尋輸入框和術語的定義域清單）；其欄標題和列號；儲存格之間的線條（也用於繪製該索引標籤的功能列和其輸入框的邊框）；以及所在列或欄與選取範圍相交的標題。工作表的其他部分則採用共用的 token：標題文字採用 `foreground`，儲存格文字採用 `active`，將欄標題和列號與儲存格區隔開來的線條採用 `grayColor7`，作用中儲存格的邊緣採用 `focus`，選取範圍的邊緣採用 `accentColor9`，其填色則採用不透明度 20% 的 `accentColor9`，整列或整欄被選取時的標題採用 `accentColor6`，唯讀儲存格採用 `grayColor3`，捲軸則採用捲軸的各個 token。若 `accentColor9` 不是以 `#rgb` 或 `#rrggbb` 寫成，選取範圍就不會有填色。

#### CSS 變數 {#css-variables}

`Theme` 中的每個 token 都有對應的 CSS 掛鉤，名稱為 `--erd-editor-` 加上 kebab-case 形式的鍵名：`grayColor10` 對應 `--erd-editor-gray-color-10`，`keyPK` 對應 `--erd-editor-key-pk`，`keyPFK` 對應 `--erd-editor-key-pfk`。  
這些掛鉤會繼承到編輯器內部，因此可以在任何希望其生效的位置設定。設定在 `:root` 上會套用到頁面上的所有編輯器；設定在元素本身上則只套用到該編輯器。

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

自 `3.4.0` 起，拼錯的 `dargSelect` token 已更正為 `dragSelect`，其掛鉤也從 `--erd-editor-darg-select-background` 和 `--erd-editor-darg-select-border` 變更為 `--erd-editor-drag-select-background` 和 `--erd-editor-drag-select-border`。仍使用舊名稱的樣式表會被忽略。

<details>
<summary>預設佈景主題值</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## 顯示語言 {#display-language}

自 `4.0.0` 起，編輯器本身的文字（其選單、面板、對話方塊、快速搜尋、快顯通知，以及在圖表上繪製的文字，例如 `unnamed`，包括圖片匯出中的文字）提供 25 種語言。資料表和欄位名稱、SQL、資料類型和產生的程式碼絕不會被翻譯。請參閱[語言與佈景主題](../guide/guides/language-and-theme.md)。  
在呼叫 [setLocale](#setlocale) 或選擇語言之前，編輯器會顯示英文，若 [enableLocalePicker](#enablelocalepicker) 為開啟，則依循 `'system'`。  
編輯器會在封閉模式的 shadow root 內，於自己的根元素上設定 `lang` 和 `dir`，絕不會設定在宿主元素或頁面上，因此由右至左的頁面不會翻轉編輯器，由右至左的語言也不會翻轉頁面。希伯來文、阿拉伯文和波斯文會將編輯器的介面由右至左配置；圖表本身絕不會鏡像翻轉。自 `4.1.0` 起，[物件總管](../guide/guides/explorer.md)在所有語言中都位於畫布左側，而在這三種語言中，其本身的列由右至左閱讀。  
套件會匯出 `LocaleCode`（下方代碼之一）和 `LocaleOption` 型別。

```ts
type LocaleOption = LocaleCode | 'system';
```

| 代碼    | 顯示名稱             | 語言                 |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | 印尼文 |
| `de-DE` | Deutsch              | 德文 |
| `en`    | English              | 英文 |
| `es-ES` | Español              | 西班牙文 |
| `eu-ES` | Euskara              | 巴斯克文 |
| `fr-FR` | Français             | 法文 |
| `it-IT` | Italiano             | 義大利文 |
| `nl-NL` | Nederlands           | 荷蘭文 |
| `pl-PL` | Polski               | 波蘭文 |
| `pt-PT` | Português            | 葡萄牙文 |
| `pt-BR` | Português Brasileiro | 巴西葡萄牙文 |
| `ro-RO` | Română               | 羅馬尼亞文 |
| `sk-SK` | Slovenčina           | 斯洛伐克文 |
| `sl-SI` | Slovenščina          | 斯洛維尼亞文 |
| `sv-SE` | Svenska              | 瑞典文 |
| `tr-TR` | Türkçe               | 土耳其文 |
| `ru-RU` | Русский              | 俄文 |
| `uk-UA` | Українська           | 烏克蘭文 |
| `he-IL` | עברית                | 希伯來文 |
| `ar-SA` | العربية              | 阿拉伯文 |
| `fa-IR` | فارسی                | 波斯文 |
| `ja-JP` | 日本語               | 日文 |
| `zh-CN` | 简体中文             | 簡體中文 |
| `zh-TW` | 繁體中文             | 繁體中文 |
| `ko-KR` | 한국어               | 韓文 |

### setLocale {#setlocale}

設定顯示語言：`'system'` 或上方的代碼之一。其他任何值（例如單獨的 `'ko'`、未知的代碼或非字串的值）都會被忽略，且不會產生錯誤。  
它會在傳回之前套用，因此在附加元素之前設定的語言，會出現在其第一個畫面中。  
它不會觸發任何事件，既不觸發 `changeLocale` 也不觸發 `change`，且不會影響 `value`、復原歷程記錄或共用存放區。  
不論 `enableLocalePicker` 如何切換，該選擇都會保留，且即使選擇器為關閉，`setLocale('system')` 也會依循系統。  
編輯器不會儲存任何內容。若要保留使用者的選擇，請監聽 [changeLocale](#changelocale)，並在下次載入時再將其傳入。

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

為擁有自己顯示語言的主應用程式，以 BCP 47 標記指定 `'system'` 所代表的語言。VS Code、JetBrains 和 Obsidian 主應用程式會以各自的顯示語言呼叫它。  
標記會去除前後空白。`null`、空白字串或非字串的值，會恢復為使用瀏覽器的 `navigator.languages`，編輯器會隨其變更而依循。  
它只在目前生效的選項為 `'system'` 時才有作用，且會立即套用。選擇器的 `System` 列會顯示其解析出的語言。  
該標記或瀏覽器的各個語言（依序）會依其語言子標記，解析為編輯器所支援的第一個語言，不區分大小寫並忽略底線：`de-AT` 會解析為 `de-DE`，`en-GB` 會解析為 `en`。中文依其書寫系統解析，`Hant` 解析為 `zh-TW`，`Hans` 解析為 `zh-CN`，若沒有書寫系統則依地區解析，`TW`、`HK` 和 `MO` 解析為 `zh-TW`，其他地區則解析為 `zh-CN`。除非指定了 `BR` 以外的地區，否則 `pt` 會解析為 `pt-BR`。沒有任何相符時，編輯器會顯示英文。

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

載入結構描述 SQL 檔案。  
根據預設，它會取代目前的文件，而不是合併到其中；請參閱下方的 `mode`。除了檢視位置和縮放比例之外，現有的設定都會保留，包括每個鎖定及其鎖定的值，而讀取檔案後會排列資料表，除非下方的 `placement` 另有指定，否則會逐列排列。`Viewport` 鎖定時，`value` 接著會寫出匯入開始時的檢視，也就是原點 `0, 0`、縮放比例 `1`。因此，匯入到從未被賦予值之元素中的文件，會與新文件一樣所有鎖定皆為開啟。  
自 `4.2.0` 起，取代也會保留文件的詞彙、術語和定義域（文字無法保存這些內容），以及每個字典工作表的復原歷程記錄，而匯入的復原或重做也同樣會保留它們。進行取代的 [setSchemaJSON](#setschemajson) 和指派 `value` 則會改為採用其文件所保存的詞彙、術語和定義域。  
它會記錄在歷程記錄清單中，因此可以 `Undo, Redo`，並會觸發 `change`。空字串會被忽略，且設定 `readonly` 期間此呼叫不會有任何作用。  
`setSchemaGraphQL`、`setSchemaDBML` 和 `setSchemaAML` 的行為相同，且其剖析器絕不會失敗：無法讀取的文字會載入空白文件，而不會引發錯誤。  
自 `4.0.0` 起，這四個方法都接受選用的第二個引數 `{ placement, mode }`：

- `placement: 'grid'` 為預設值，會與以往一樣立即將資料表逐列排列，且此呼叫不會傳回任何內容。
- `placement: 'auto'` 會先依資料表的關聯配置資料表，與編輯器中的 `Import` 相同，並傳回一個 `Promise`，在匯入以一個復原步驟的形式完成放置後解析。資料表少於兩個、沒有關聯、配置失敗、頁面不支援 `SharedWorker`，或在 `Placing tables` 快顯通知上按 `Cancel` 時，則會改為逐列排列。在此期間發生的載入（另一次取代式匯入、指派 `value`、`setInitialValue()`、`clear()`、協作者的載入，或對載入或 `clear()` 的復原或重做）會使其作廢，而 `Promise` 會在未載入任何內容的情況下解析。以此方式排列的匯入會依開始的順序完成放置。
- `mode: 'replace'` 為預設值，會取代文件。`mode: 'append'` 會像[匯入並加入](../guide/guides/file-import-export.md#import-and-add)一樣，將檔案加到圖表下方，讓已存在的每個資料表維持原樣，除了索引標籤和檢視位置之外的所有設定也維持原樣。若從其他索引標籤呼叫，會先切換到 ERD 索引標籤。新的資料表，以及資料表群組顯示時 DBML 檔案帶入的資料表群組，會成為選取範圍，且檢視會捲動到它們，除非它們已清楚顯示，這依循的是自 `4.1.0` 起每次跳至目標都遵守的規則，請參閱[跳至目標時的落點](../guide/guides/table-related-functions.md#where-a-jump-lands)。一次復原即可移除整個新增內容。無法讀取的文字不會加入任何內容，並讓文件維持原樣。

設定 `readonly` 期間，取代會被忽略，附加不會加入任何內容，`placement: 'auto'` 呼叫則會立即解析。  
自 `3.10.0` 起，`setSchemaSQL` 會依文件目前的資料庫讀取檔案：選取 Databricks 時，單引號字串會依循 Spark 的反斜線跳脫規則。請參閱[註解](../guide/guides/file-import-export.md#comments)。  
自 `3.10.0` 起，`setSchemaSQL` 會將涵蓋兩個或更多欄位的 `UNIQUE` 讀取為一個唯一索引，而不是在每個欄位上設定 Unique 旗標。請參閱[唯一鍵與索引](../guide/guides/file-import-export.md#unique-keys-and-indexes)。  
自 `3.10.0` 起，SQL、DBML 和 AML 匯入會保留所讀取外鍵的 `ON DELETE` 和 `ON UPDATE` 動作。  
自 `4.0.0` 起，`setSchemaSQL` 會保留欄位完整的 `DEFAULT` 運算式、讀取 SQL Server 的 `ADD DEFAULT … FOR` 及其 `MS_Description` 註解、將 PostgreSQL 的 serial 和 identity 欄位轉換為 Auto Increment、在資料類型中保留 `UNSIGNED` 和 `ZEROFILL`，並讀取 `ALTER TABLE … ADD PRIMARY KEY` 標示為 `CLUSTERED`、`NONCLUSTERED` 或 `USING BTREE` 的主鍵。請參閱[結構描述 SQL](../guide/guides/file-import-export.md#schema-sql)。  
關於各剖析器接受的語法，請參閱[匯入或匯出檔案](../guide/guides/file-import-export.md)。

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

載入 GraphQL SDL 文件。  
物件型別定義會成為資料表，型別為另一個資料表的欄位則會成為關聯。

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

載入 DBML 檔案，這是 dbdiagram.io 和 dbdocs 使用的格式。  
自 `4.0.0` 起，每個 `TableGroup` 都會成為[資料表群組](../guide/guides/table-groups.md)，資料表的 `headercolor` 則會成為其顏色。請參閱 [DBML](../guide/guides/file-import-export.md#dbml)。

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

載入 AML（Azimutt Markup Language）檔案。目前的寫法和舊版 v1 的寫法都能接受。  
自 `4.0.0` 起，實體的顏色（Azimutt 的顏色名稱之一，或加上引號的十六進位值）會成為其資料表的顏色。請參閱 [AML](../guide/guides/file-import-export.md#aml)。

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

自 `4.0.0` 起，載入 `.erd.json` 文件，例如 [value](#value) 傳回的文字。  
在預設的 `mode: 'replace'` 下，它會以與指派 `value` 相同的方式載入文件：會記錄在歷程記錄清單中、觸發 `change`，並以相同方式採用文件的鎖定，且自 `4.2.0` 起，文件的詞彙、術語和定義域會取代編輯器原有的詞彙、術語和定義域。與 `value` 不同，空字串或非字串的值會被忽略，而不會建立新文件。非 JSON 的文字會清空文件，與 `value` 相同。  
`mode: 'append'` 會以新的 id 將文件的資料表、關聯、索引、備忘錄和資料表群組加到圖表下方，保留它們彼此之間的相對位置，並省略文件的設定，與[匯入並加入](../guide/guides/file-import-export.md#import-and-add)處理 `json` 檔案的方式相同。自 `4.2.0` 起，它會保留資料表和欄位的邏輯名稱與標示名稱是否由字典產生的旗標，但不會帶入文件的詞彙、術語和定義域，因此其欄位都不會連結到定義域。無法讀取的文字，或沒有任何資料表和備忘錄的文件，都不會加入任何內容。否則，它會以與 [setSchemaSQL](#setschemasql) 附加相同的方式完成放置，新的備忘錄和資料表群組會與其資料表一起被選取，各類型僅在顯示時才會被選取。  
它會在文件完成放置後傳回，且設定 `readonly` 期間會被忽略。

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

將目前的編輯器狀態匯出為結構描述 SQL。  
若未指定 `databaseVendor`，則會依目前設定的廠商運作。不在下方清單中的名稱也會以相同方式處理，且不會引發錯誤。  
名稱會以編輯器顯示的引號類型加上引號。`Bracket Type` [鎖定](../guide/guides/settings.md#lock)期間，這可能與 `value` 儲存的引號類型不同，而程式碼代理程式的 [`erd_read`](../mcp/tools.md#reading-a-document) 使用的是後者。無論「名稱顯示」為何，寫出的名稱一律是物理名稱。  
自 `4.0.0` 起，選用的 `options` 引數可選擇陳述式和標頭，與[結構描述 SQL](../guide/guides/schema-sql.md) 索引標籤的選項相同，自 `4.2.0` 起還可選擇是否以邏輯名稱填入空白註解。`SchemaSQLOptions` 以型別形式匯出。

- `statements`：`'create'` 為預設值；`'ifNotExists'` 會在 MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 上寫出 `IF NOT EXISTS`，在其他資料庫上則退回為 `'create'`；或 `'recreate'`，會在建立資料表之前先刪除資料表，Snowflake 則改為寫出 `CREATE OR REPLACE TABLE`。
- `header`：`'none'` 為預設值；`'use'` 會切換到文件的資料庫或結構描述；或 `'createAndUse'`，會先在其不存在時建立，再切換到它。不支援所要求選項的資料庫，會以與該索引標籤相同的方式退回：Oracle 會針對 `'createAndUse'` 寫出 `'use'`，PostgreSQL 針對 `'use'` 不會寫出標頭，SQLite 則都不會寫出標頭。只有在文件的資料庫名稱為一般識別碼（ASCII 字母、數字和 `_`，且不以數字開頭）時，才會寫出標頭。
- `logicalNameAsComment`（自 `4.2.0` 起）：`true` 會在資料表或欄位本身的註解為空的或只有空白字元、而邏輯名稱不是如此時，將其邏輯名稱寫成註解，並採用該資料庫寫出註解的形式。有文字的註解則與以往一樣寫出。只有 `true` 會開啟此選項：省略、`false` 或任何其他值（例如 `'true'` 或 `1`）都不會寫出邏輯名稱。其作用與該索引標籤的 [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) 開關相同。

省略的選項或值無法辨識的選項，都會視為其預設值，因此不帶選項的呼叫會與以往一樣，寫出不含標頭的一般 `CREATE` 陳述式。  
自 `4.0.0` 起，輸出一律包含文件的 `Before tables` 和 `After tables` 指令碼，順序為標頭、前置指令碼、DROP 陳述式、資料表、後置指令碼。「結構描述 SQL」索引標籤本身的 `Statements`、`Header`、`Write logical names into empty comments` 和 `Tables` 選項絕不會影響此呼叫，此呼叫一律寫出整份文件。  
自 `3.10.0` 起，每個外鍵都會帶有該關聯的 `ON DELETE` 和 `ON UPDATE` 子句。只有在設定了動作且廠商接受該動作時，才會寫出子句，因此該廠商不接受的動作會被省略，並套用其預設值。自 `4.0.0` 起，Snowflake 只接受 `NO ACTION`。關於各資料庫寫出的內容，請參閱 [ON DELETE 與 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。  
自 `3.10.0` 起，資料表或欄位註解中的單引號會被跳脫，因此 `it's` 之類的註解不再會破壞陳述式。所有以字串常值寫出註解的廠商都會將其重複一次，但 Databricks 除外，它會在每個引號和每個反斜線前加上反斜線。SQLite 仍以 `--` 行寫出註解。  
自 `4.2.0` 起，SQL Server 會將每個註解寫成國家字元常值 `N'…'`，因此資料庫字碼頁以外的文字（例如韓文）會被保留。Oracle 會將註解中每段連續的空白行寫成一個換行，而 SQLite 會將註解中的換行寫成空格，讓註解維持在其 `--` 行上。請參閱[註解](../guide/guides/schema-sql.md#comments)。  
自 `4.0.0` 起，有幾種資料庫寫出鍵名稱、預設值和自動遞增的方式也有所不同。請參閱 [DDL 寫出的內容](../guide/guides/schema-sql.md#what-the-ddl-writes)。

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

傳回用於即時協作編輯的存放區。  
`config` 為 `{ getNickname?, mouseTracker?, focusTracker? }`。兩個追蹤器皆預設為 `true`：`mouseTracker` 會將此編輯器的游標廣播給其他人，`focusTracker` 則會廣播其焦點儲存格、選取範圍和拖曳框。  
請參閱[協作編輯](./advanced/collaborative-editing.md)。

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

開啟差異檢視器，將目前開啟的文件與傳入的文件進行比較。  
它不會傳回任何內容，也不會修改文件，因此關閉檢視器後，編輯器會完全維持原樣。  
空白值或任何非字串的值，都會與空白文件進行比較。  
它與畫布右鍵選單中的[差異檢視器](../guide/guides/table-related-functions.md#diff-viewer)是相同的覆疊畫面。  
自 `4.1.0` 起，它會先依 id 配對兩份文件中的內容，之後才依各自保存的內容配對，例如資料表名稱或備忘錄文字，請參閱[比較的內容](../guide/guides/table-related-functions.md#what-is-compared)。因此，與同一份文件的較早版本（例如其檔案的 Git 修訂版本）比較時，重新命名會顯示為一個已重新命名的項目；與 id 不同的文件比較時，則會顯示為一項移除和一項新增。檢視器會在兩份文件旁以樹狀結構列出變更的內容，並以顏色標示變更，而不是填滿儲存格。  
自 `4.2.0` 起，無論傳入的文件儲存的是哪種顯示方式，兩份文件都會以此編輯器所顯示的「名稱顯示」開啟，樹狀結構也會依此顯示資料表和欄位的名稱，請參閱[畫布以外的地方](../guide/guides/logical-names.md#beyond-the-canvas)。邏輯名稱、定義域連結和字典都不會被比較，因此只變更這些內容時，不會顯示任何變更。

```js
editor.setDiffValue('prev json...');
```
