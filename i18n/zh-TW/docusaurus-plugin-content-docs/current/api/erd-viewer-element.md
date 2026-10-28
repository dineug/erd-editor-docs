---
sidebar_position: 3
description: erd-viewer 元素的 API：來自 value 或 src URL 的唯讀圖表、其小地圖和控制列、load 與 error 事件、佈景主題、顯示語言、焦點與按鍵、載入方式，以及它加入頁面的內容。
---

# ErdViewerElement

自 `5.0.0` 起，此套件也提供 `<erd-viewer>`，這是文件的唯讀檢視：讀者可以平移、縮放、搜尋並點亮關聯，但其中沒有任何東西能編輯。它只繪製 ERD 畫布及其捲軸、一個[小地圖](#minimap)、一個[控制列](#controls)，以及一個搜尋文件的命令選擇區，沒有工具列、索引標籤、物件總管或右鍵選單。

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

上方的框架就是 erd-editor.io/embed 所顯示的此元素，這裡顯示的是 bookstore 範例：點擊它以取得焦點，然後用[焦點與按鍵](#focus-and-keys)中的按鍵縮放和搜尋；若要不寫程式碼就嵌入您自己的文件，請參閱[嵌入](../guide/guides/embedding.md)。

檢視器是一個普通的 `HTMLElement`。  
其型別定義如下。

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

匯入 `@dineug/erd-editor/erd-viewer.js` 會定義 `<erd-viewer>`，並讓 `<erd-editor>` 保持未定義。匯入套件根目錄則兩者都不定義：它匯出類別 `ErdViewerElement` 和 `defineErdViewer()`，後者會在您呼叫之處定義該標籤，因此頁面也可以將該類別定義在您自己的標籤下，請參閱[註冊元素](./installation.md#registering-the-elements)。  
除了 `engine.js` 和 `peer.js` 之外，每個進入點都需要 DOM，這一個也不例外，因此伺服器端轉譯的頁面要在用戶端匯入它，請參閱[伺服器端轉譯](./installation.md#server-side-rendering)。  
匯入此進入點會將 `erd-viewer` 加入 `HTMLElementTagNameMap`，因此 `document.createElement('erd-viewer')` 和 `document.querySelector('erd-viewer')` 不需要轉型就具有 `ErdViewerElement` 型別。

與編輯器一樣，檢視器會轉譯到封閉模式的 shadow root 中，因此 `viewer.shadowRoot` 為 `null`，頁面樣式也不會滲入或滲出；請透過 [setTheme](#settheme) 和 `--erd-editor-*` 自訂屬性來設定其樣式。同一頁面上的多個檢視器各自保有自己的文件、檢視、佈景主題和語言。  
`<erd-viewer>` 沒有固有尺寸。自訂元素是行內的，因此如上所示，請指定 `display: block` 和高度。檢視會填滿元素的方框，並在其調整大小時跟隨，同時保持縮放比例。

`src`、`name-view`、`minimap` 和 `controls` 是它僅有的屬性，每個都有同名的屬性（property），其中 `name-view` 對應 `nameView`。[value](#value) 只有屬性（property）。  
在其標籤被定義之前就設定在元素上的 `value`、`src`、`nameView`、`minimap` 或 `controls`（例如由在進入點載入之前就轉譯元素的框架所設定），會在標籤被定義後採用，並優先於標記所給的屬性。它們依頁面第一次寫入各自的順序採用，因此 `value` 和 `src` 中較晚的那一個勝出。此時不含文件的 `value` 已沒有可擲回例外的呼叫端：它會被回報為未捕捉的錯誤，而檢視器保持空白。

script 標籤建置版本 `dist/erd-viewer.umd.js` 只包含檢視器及其所有相依套件。它會定義 `<erd-viewer>`，並將 `ErdViewerElement` 和 `defineErdViewer` 放到 `window.ErdViewer` 上。沒有路徑的 CDN URL 提供的是編輯器的建置版本，因此請指名該檔案，請參閱 [script 標籤](./installation.md#script-tag)。

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

檢視器要擷取並顯示的文件 URL。預設為 `''`，即無。  
擷取是單純的 `fetch()`，也就是不帶任何自有選項的 `GET`，因此由瀏覽器的 CORS 規則決定：另一個來源上的文件需要允許該頁面來源的伺服器，而 cookie 只會送到頁面自己的來源。相對 URL 會依頁面解析。  
回應必須包含一份文件，如同 `.erd.json` 檔案那樣，也就是編輯器的 [value](./erd-editor-element.md#value) 和每個官方主應用程式所寫出的儲存形式。不會讀取其他格式：SQL、GraphQL、DBML 或 AML 檔案會因為是無法剖析的文字而失敗。  
成功剖析的文件會符合檢視區大小並觸發 [load](#load)。網路或 CORS 拒絕的請求、不是 `ok` 的回應，或無法剖析的文字，會觸發 [error](#error) 並留下空白圖表，請參閱[載入](#loading)。

只有最新的請求算數。新的 `src` 會中止仍在執行的擷取，因此緩慢的回應絕不會蓋過較晚的文件。指派 [value](#value) 也會中止它，移除 `src` 或將其設為 `''` 也一樣，這會停止跟隨它，並讓所顯示的文件維持原樣。  
`value` 和 `src` 中最後設定的那一個勝出，無論透過屬性（property）還是屬性（attribute）。寫在 `value` 之後的 `src` 即使指定的是先前擷取過的 URL，也會被擷取。在它已顯示的文件之上再次寫入時，則不會擷取任何東西。  
檢視器只在頁面中時才會擷取。將它移出會中止仍在執行的擷取，而放回時會擷取它尚未顯示的 `src`（包括曾失敗的），但絕不會擷取它已顯示的那個。  
`src` 是此套件發出的唯一一次 `fetch()`，因此嚴格的內容安全政策要在 `connect-src` 中列出該文件的來源。

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

取得所顯示的文件（無論來自 `src` 還是 `value`），為編輯器的 [value](./erd-editor-element.md#value) 所寫出之儲存形式的 JSON 字串。在顯示任何東西之前，它是新的空白文件，其 `doc` 為 `{}`。  
當文件的 `Viewport` [鎖定](../guide/guides/settings.md#lock)為開啟時（新文件即是如此），它會寫出文件所鎖定的縮放比例和捲動位置，無論讀者把檢視移到哪裡。只有該鎖定關閉時，它才會寫出檢視目前所在之處，包括載入時所做的符合大小。  
它寫出的是文件所持有的「名稱顯示」，絕不是 [nameView](#nameview) 或控制列在其上所顯示的那一個，即使文件的 `Name View` 鎖定為關閉也一樣。  
在 [destroy](#destroy) 之後，它仍會傳回該文件。

```js
const data = viewer.value;
```

### setter {#setter}

從文字顯示文件，取代目前所顯示的文件，並使其符合檢視區大小，請參閱[載入](#loading)。它接受檔案或編輯器的 `value` 所持有的文字。  
無法剖析的文字會在任何變更之前擲回例外，而所顯示的文件保持不變：不是 JSON 的文字會擲回 `SyntaxError`，不含文件的 JSON（例如 `7`）會擲回 `TypeError`。空白字串或任何不是字串的值，會顯示空白圖表。  
指派它會中止仍在執行的 `src` 擷取，並且既不觸發 `load` 也不觸發 `error`。

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

在文件所持有的[名稱顯示](../guide/guides/logical-names.md#name-view)之上顯示圖表：`'physical'` 為 `Physical Names`，`'logical'` 為 `Logical Names`，`'both'` 為 `Both Names`。預設的 `null` 會顯示文件自己的顯示方式，而屬性（attribute）值若不是這三者之一，則讀作 `null`。  
它對在其後載入的每份文件都持續生效，而 [value](#value) 絕不會寫出它。移除該屬性（attribute）會回到文件自己的檢視。  
[控制列](#controls)上的 `Name View` 清單也會切換檢視，直到下一份文件載入或 `nameView` 下一次變更為止。在那裡的切換同樣不會寫入 `value`。

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

在文件含有資料表、顯示中的備忘錄或顯示中的資料表群組時，於右上角顯示小地圖。預設為開啟。  
它的運作方式與編輯器的相同：按一下它即可將檢視移到該處，或拖曳其檢視區矩形來平移，請參閱[瀏覽畫布](../guide/guides/table-related-functions.md#getting-around-the-canvas)。在檢視器取得焦點之前，手指在其上的操作屬於頁面。  
只有 `minimap="false"` 會將它關閉。單獨的屬性（attribute）、任何其他值和沒有屬性（attribute），都會讓它保持開啟。

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

在畫布底部邊緣的中央顯示控制列。預設為開啟，由左至右包含：

- 縮放：`Zoom out`、以百分比表示的目前縮放比例，以及 `Zoom in`。這兩個按鈕會像縮放按鍵一樣逐步調整縮放，而按一下百分比 `Reset zoom` 會將它恢復為 `100%`。每個按鈕的工具提示都會指出其按鍵。
- `Fit`，它會縮放並捲動，讓整個圖表置中顯示在檢視中。
- `Name View`，一個指出目前顯示方式的按鈕，並會在控制列上方開啟列出 `Physical Names`、`Logical Names` 和 `Both Names` 的清單，請參閱 [nameView](#nameview)。
- `Go to content` 指南針，只在圖表完全不在畫面上時才會加到控制列末端，並將檢視帶到最近的部分。

控制列在每種語言中都由左至右排列。  
只有 `controls="false"` 會將它關閉，連同其指南針和 `Name View` 清單。單獨的屬性（attribute）、任何其他值和沒有屬性（attribute），都會讓它保持開啟。沒有控制列時，滾輪、捏合手勢和按鍵在檢視器取得焦點後仍會縮放。

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## 事件 {#event}

`load` 和 `error` 是僅有的兩個事件，兩者都回報 `src` 的狀況。兩者都不會冒泡，因此請在元素本身上監聽。

### load {#load}

在 `src` 所指定的文件擷取並顯示完成後觸發。`event.detail` 為 `null`。  
指派 `value` 不會觸發任何一個，被較晚的 `src`、`value`、將元素移出頁面或 [destroy](#destroy) 中止的擷取也不會。

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

在擷取 `src` 失敗時觸發：網路或 CORS 拒絕了請求、回應不是 `ok`，或其文字無法剖析。檢視器接著會顯示空白圖表和通知 `Couldn't load the diagram`，請參閱[載入](#loading)。  
`event.detail` 是原因：`fetch()` 拒絕時的 `TypeError`、指名狀態的 `Error`（例如 `GET /missing.erd.json answered 404 Not Found`），或剖析器的 `SyntaxError` 或 `TypeError`。  
被中止的擷取不會觸發任何事件。

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

設定預設佈景主題，接受編輯器的 `ThemeOptions`，請參閱 [setPresetTheme](./erd-editor-element.md#setpresettheme)。  
檢視器從 `appearance: 'system'`、`grayColor: 'slate'` 和 `accentColor: 'indigo'` 開始，因此從第一個畫面起就會顯示作業系統所回報的淺色或深色，並在其改變時切換。編輯器則改為從深色開始。  
每個欄位都獨立套用，因此部分呼叫會讓另外兩個維持原樣。不屬於名稱的值會被忽略，且呼叫絕不會擲回例外。  
檢視器沒有佈景主題建立器，也沒有 `systemDarkMode`，且不會為佈景主題觸發任何事件。

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

指定 `'system'` 外觀所顯示的淺色或深色，供有自己淺色與深色設定的頁面使用。指定期間，作業系統的變更會被忽略。  
`null`，或任何不是 `'dark'` 或 `'light'` 的值，會回到跟隨作業系統。  
外觀為 `'light'` 或 `'dark'` 期間，它不會改變畫面上的任何東西，但該值會被保留，並在外觀變為 `'system'` 時立即套用。它不會觸發任何事件。

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

在預設佈景主題之上覆寫佈景主題令牌，接受編輯器的 `Theme` 令牌，請參閱 [setTheme](./erd-editor-element.md#settheme)。  
每次呼叫都會取代整個覆寫層，因此傳入 `{}` 即可回到預設佈景主題。只會保留令牌名稱，且其值為字串，而之後的 `setPresetTheme` 會替換底下的預設佈景主題，覆寫則維持不變。  
`--erd-editor-*` CSS 自訂屬性也會作用於檢視器，可設定在元素上或其上方的任何位置，請參閱 [CSS 變數](./erd-editor-element.md#css-variables)。沒有任何樣式表能到達的畫布，會在頁面 `head` 中的樣式表變更，或元素或其上方元素的 `class` 或 `style` 屬性（attribute）變更時，重新讀取它們。以 `insertRule()` 新增的規則不會改變其中任何一項，因此畫布要到下一次這樣的變更才會採用它。

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

設定顯示語言：預設的 `'system'`，或編輯器的[顯示語言](./erd-editor-element.md#display-language)所列出的 25 個代碼之一。其他任何值（例如單獨的 `'ko'` 或不是字串的值）都會被忽略。  
語言會變更控制列的工具提示、`Name View` 清單、命令選擇區、載入通知，以及圖表自行繪製的文字（例如 `unnamed`）。名稱、註解和文件的其餘內容絕不會被翻譯。

英文是檢視器進入點的一部分，在呼叫傳回之前就會套用。其他每種語言都是各自獨立的模組，由您的打包工具輸出為檢視器旁的區塊，並在頁面第一次要求該語言時由檢視器從您的套件中擷取，頁面上的所有檢視器共用一次。在它載入之前，檢視器會繼續顯示它原本所顯示的語言，第一個畫面則是英文。若載入失敗，檢視器會顯示英文，而再次要求該語言會重試。  
[script 標籤](./installation.md#script-tag)建置版本內含全部 25 種語言，因此不擷取任何東西。同時包含編輯器的套件，會隨編輯器的區塊載入每種語言，請參閱[註冊元素](./installation.md#registering-the-elements)。  
它所傳回的 `Promise` 會在該語言載入完成或載入失敗時解析，且絕不會被拒絕。該語言（或失敗後的英文）接著生效，除非較晚的呼叫要求了另一種語言：無論各語言以何種順序載入完成，都以較晚的呼叫為準。

希伯來文、阿拉伯文和波斯文會讓命令選擇區和載入通知由右至左排列。畫布、小地圖、捲軸和附有指南針的控制列則維持由左至右，如同編輯器的畫布，請參閱[由右至左書寫的語言](../guide/guides/language-and-theme.md#right-to-left-languages)。  
檢視器會在封閉 shadow root 內它自己的根元素上設定 `lang` 和 `dir`，絕不會設定在主機元素或頁面上。  
它不會觸發任何事件，檢視器也沒有語言選擇器，且不儲存任何東西。

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

指定 `'system'` 所代表的語言，為 BCP 47 標籤，供有自己語言設定的頁面使用。  
標籤會經過修剪。`null`、空白字串或不是字串的值，會回到頁面的語言。  
頁面的語言是頁面的 `<html lang>`，接著是瀏覽器的 `navigator.languages`，在檢視器第一次連接時讀取一次。`'system'` 會採用其中第一個檢視器有對應語言的，依編輯器在 [setSystemLocale](./erd-editor-element.md#setsystemlocale) 中的規則，而一個都沒有時則為英文。因此，`<html lang>` 指名了檢視器所具備之語言的頁面，無論瀏覽器偏好什麼，都會顯示該語言，而之後 `lang` 或瀏覽器語言的變更不會移動任何檢視器。  
它只在生效的選項為 `'system'` 時才有意義，其 `Promise` 的解析方式與 [setLocale](#setlocale) 相同。

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

永久結束檢視器。無論元素仍在頁面中還是已先被移出，它都會在傳回之前拆除檢視，中止仍在執行的 `src` 擷取，並停止跟隨作業系統的色彩配置和頁面的樣式。  
已銷毀的檢視器不再繪製任何東西、不擷取任何東西，也不要求任何語言，即使再次加入頁面也一樣。讀取 [value](#value) 仍會傳回它所持有的文件。  
將元素移出頁面並不會銷毀它：放回後它會繼續運作，並擷取它尚未顯示的 `src`，請參閱[載入](#loading)。

```js
viewer.destroy();
```

## 焦點與按鍵 {#focus-and-keys}

檢視器在掛載、文件載入或其命令選擇區關閉時都不會取得焦點，因此絕不會把頁面捲動到它自己，也不會取走頁面的按鍵。  
在其畫布上點擊或輕觸會讓它取得焦點而不捲動頁面，且它是 `Tab` 鍵的一個停駐點。與編輯器不同，它沒有自己的 `focus()` 或 `blur()` 成員。在頁面其他任何位置按下，會再次取走焦點。

在檢視器取得焦點之前，頁面保有滾輪（它會捲動頁面）和觸控板的捏合手勢。畫布上的手指會捲動頁面而不平移任何東西，而每個按鍵都會不被阻止地傳到頁面。  
取得焦點後：

- 滾輪會平移檢視，`Shift + Wheel` 會橫向平移。在文字溢出的備忘錄上，滾輪會捲動該備忘錄。
- `Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac)、觸控板的捏合手勢，或觸控螢幕上的兩根手指會縮放。
- 一根手指會平移檢視。
- `Ctrl + Plus` 和 `Ctrl + Minus` (Windows/Linux) 或 `⌘ + Plus` 和 `⌘ + Minus` (Mac) 會像 `Zoom in` 和 `Zoom out` 按鈕一樣逐步調整縮放，而 `Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 會直接回到 `100%`，並讓畫面中央維持原處。
- `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 會開啟命令選擇區，`Esc` 會將它關閉。

這些就是它僅有的按鍵，且無法重新繫結。其他每個按鍵，無論是否有焦點，都會不被阻止地傳到頁面：`Delete`、`Backspace`、`Space`、`Enter`、`Tab`、`Ctrl + A`、`Ctrl + F`，以及編輯器中每個會編輯的按鍵組合。

命令選擇區只搜尋文件，不列出任何命令。它的空輸入會顯示前置字元：`#` 搜尋資料表，`@` 搜尋欄位，`:` 搜尋註解和備忘錄，而 `?` 會列出前置字元，與編輯器相同，請參閱[搜尋圖表](../guide/guides/quick-search.md#searching-the-diagram)。沒有前置字元的字詞，會在為其搜尋圖表的各列上方顯示 `No commands match`。  
選擇某一列會依編輯器的規則[跳至目標時的落點](../guide/guides/table-related-functions.md#where-a-jump-lands)移動檢視，並維持縮放比例不變，然後將它到達的項目加上外框並帶到最前面：資料表、含有該欄位或註解的資料表，或備忘錄。  
選擇某一列或按 `Esc` 會關閉命令選擇區，並讓焦點不在任何元素上，因此下一次滾輪會捲動頁面；請點擊檢視以再次讓它取得滾輪和按鍵。命令選擇區開啟期間，滾輪會捲動其清單，而縮放按鍵不會有任何作用。

無論是否有焦點，以滑鼠主按鈕拖曳都會從畫布上的任何位置平移檢視，在資料表上也一樣。點擊或輕觸（不移動）會點亮關聯：在資料表上會點亮該資料表的關聯；在關聯線上會點亮那條線；在其他任何位置（包括備忘錄）會熄滅亮顯。這樣的點擊也會清除命令選擇區跳至目標所留下的外框。指標停在資料表上時，會點亮其關聯。  
沒有任何按下會選取、移動或編輯任何東西。除了跳至目標的外框之外沒有任何選取範圍，沒有選取框，按兩下或 `Enter` 也不會開啟任何儲存格。

## 載入 {#loading}

`src` 載入期間，畫布中央上方的通知會在旋轉的載入圖示旁顯示 `Loading diagram`。載入一旦失敗，它會在警告符號旁顯示 `Couldn't load the diagram`，直到新的 `src` 或 `value` 取代它，或 `src` 被移除。按下會穿過通知傳到畫布，且它以顯示語言顯示，在由右至左的語言中則由右至左。

每份載入的文件（無論來自 `src` 還是 `value`）都會符合檢視器的方框：縮放並捲動，讓整個圖表置中顯示，如同 `Fit` 所做的，檔案所儲存的縮放比例和捲動位置會被擱置。在檢視器有大小之前交給它的文件（在放入頁面之前設定，或在方框為空時設定），會在它有大小後才符合大小。之後的調整大小會保持縮放比例；`Fit` 會再次符合大小。

檢視器只在頁面中時才會擷取 `src`。將它移出會中止仍在執行的擷取，而放回時會擷取它尚未顯示的 `src`（包括曾失敗的），但絕不會擷取它已顯示的那個。不再需要的檢視器請以 [destroy](#destroy) 結束。

## 它加入頁面的內容 {#what-it-adds-to-a-page}

- 沒有 worker。它不啟動任何 worker，因此內容安全政策不需要為它設定 `worker-src`。
- 沒有儲存。它不寫入 cookie、`localStorage`、`sessionStorage` 或 IndexedDB。
- 兩種請求：[src](#src) 的擷取（嚴格的政策要在 `connect-src` 中列出其來源），以及來自您自己套件的、英文以外之顯示語言的模組，請參閱 [setLocale](#setlocale)。
- 樣式位於建構的樣式表中，嚴格的 `style-src` 可放行。不支援建構樣式表的瀏覽器（例如 101 之前的 Firefox）會改用 `<style>` 元素，這需要 `style-src 'unsafe-inline'`。
- `window` 上的監聽器。匯入此進入點會加入三個在頁面存續期間一直存在的監聽器，分別用於 `mousedown`、`touchstart`，以及套件自己的 `@dineug/erd-editor/internal-forward-move-start` 事件。繪製畫布的 Konva 會設定 `window.Konva`，並隨第一個舞台在 `window` 上加入滑鼠和觸控監聽器，在 `document` 上加入 `visibilitychange` 監聽器，且從不移除它們。編輯器的進入點會加入相同的監聽器。
- 在 [destroy](#destroy) 之前，每個檢視器都會跟隨作業系統的色彩配置，並監看頁面的樣式是否有 [setTheme](#settheme) 所描述的自訂屬性。
