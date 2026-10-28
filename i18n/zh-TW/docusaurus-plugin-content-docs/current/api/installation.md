---
sidebar_position: 1
description: 從 npm 或 CDN 安裝 @dineug/erd-editor、註冊編輯器與檢視器元素、串接檔案對話方塊，以及從 4.x 或 3.x 升級。
---

# 安裝

```sh
npm install @dineug/erd-editor
```

此套件僅提供 ESM（`"type": "module"`），且只發佈其 `dist` 資料夾。
沒有 CommonJS 建置版本，因此 `require('@dineug/erd-editor')` 無法運作。

它包含兩個自訂元素：編輯器 `<erd-editor>`，以及自 `5.0.0` 起提供、以唯讀方式顯示圖表的 `<erd-viewer>`，請參閱 [ErdViewerElement](./erd-viewer-element.md)。
自 `5.0.0` 起，匯入套件根目錄不會定義其中任何一個。每個元素都有各自的進入點來定義它，請參閱[註冊元素](#registering-the-elements)。

其執行階段相依套件會保留在外部，以 bare import 的形式交由您的打包工具解析、去除重複並進行 tree shaking。自 `5.0.0` 起，其 `dist` 每個模組各有一個檔案，因此打包工具只會保留頁面用到的模組，請參閱[進入點](#entry-points)。
其 shared worker 會輸出為 `dist/workers/` 下的獨立進入點檔案，並以 `new URL('./…', import.meta.url)` 建構，這正是 Vite、webpack 5 和 Rspack 會打包為 worker 進入點的寫法。請參閱 [Web Worker](#web-workers)。
對於背後沒有打包工具的頁面，另有兩種獨立完整的建置版本，請參閱 [script 標籤](#script-tag)。

## 使用方式 {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` 會在匯入時定義 `<erd-editor>`。只需顯示圖表的頁面改為匯入 `@dineug/erd-editor/erd-viewer.js`，請參閱 [ErdViewerElement](./erd-viewer-element.md)。

`<erd-editor>` 沒有固有尺寸。為它（或其容器）指定明確的寬度和高度。
自 `4.1.0` 起，開啟的[物件總管](../guide/guides/explorer.md)會停駐在元素內部、ERD 畫布的左側，並讓畫布變窄，而不是覆蓋在畫布上。在新的編輯器中，它一開始是關閉的。
此面板的繪製寬度不會小於 `200px`，並為畫布保留至少 `320px`，因此在寬度小於 `520px` 的元素中，開啟的物件總管在元素變寬之前不會被繪製，請參閱[位於畫布旁](../guide/guides/explorer.md#beside-the-canvas)。

`setInitialValue('')` 會開始一個新的空白文件。指派 `value` 則會以編輯的方式載入文件，因此會記錄到復原歷程記錄中。
自 `4.0.0` 起，`editor.value` 是以檔案所保存形式呈現的文件，也就是應該儲存的內容。`editor.runtimeValue` 是以編輯器所持有形式呈現的文件，包含已移除的實體：它用來初始化協作者，且絕不會寫入檔案，請參閱 [runtimeValue](./erd-editor-element.md#runtimevalue)。
自 `4.0.0` 起，新文件的每個[設定鎖定](../guide/guides/settings.md#lock)也都是開啟的：檢視區、索引標籤、程式碼產生器的語言、兩種名稱大小寫、引號類型，以及自 `4.2.0` 起的[名稱顯示](../guide/guides/logical-names.md#name-view)。捲動、縮放、切換索引標籤、切換「名稱顯示」或變更其他任一項設定，都不會改變 `editor.value`，也不會觸發 `change`。從文字載入的文件會保留其中指定的鎖定。未指定任何鎖定的文件（例如在 `4.0.0` 之前儲存的任何檔案），開啟後所有鎖定都是開啟的，縮放比例為 100%，並位於 ERD 索引標籤，不論它儲存的是哪種檢視區和哪個索引標籤。其檢視區會鎖定在原點 `0, 0`，若圖表沒有任何部分繪製在該處，檢視則會改為在圖表所在之處開啟，請參閱 [setInitialValue](./erd-editor-element.md#setinitialvalue)。
在 `4.2.0` 之前儲存的檔案開啟時，「名稱顯示」會鎖定在 `Physical Names`，即使是其他所有鎖定都為關閉的檔案也是如此。`4.0.0` 或 `4.1.0` 的編輯器在儲存時會維持「名稱顯示」鎖定的現狀，但會捨棄顯示方式，因此在「名稱顯示」未鎖定時儲存的 `4.2.0` 檔案會維持未鎖定，但重新開啟時會回到 `Physical Names`。
關於其餘的 API，請參閱 [ErdEditorElement](./erd-editor-element.md)。

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` 會為您解析此套件的外部相依套件，因此不需要打包工具也能運作。
每個進入點都以版本之後的路徑取得：`…/erd-editor.js` 定義編輯器，`…/erd-viewer.js` 定義檢視器，檢視器在頁面要求某種顯示語言時，會從 CDN 擷取除英文以外的每種顯示語言。僅含套件名稱的 URL `https://esm.run/@dineug/erd-editor@5.0.0` 提供的是根目錄，它不會定義任何元素。
未指定版本的 URL 一律提供最新版本。若不希望主要版本升級在未事先告知的情況下套用到您的頁面，就如上所示固定版本。
`5.0.0` 本身就是一次主要版本升級：必須停留在 4.x 的頁面則固定為 `@4.2.0`，請參閱[從 4.x 升級](#upgrading-from-4x)。

`esm.run` 從 `cdn.jsdelivr.net` 提供 shared worker，而瀏覽器不會從與頁面不同的來源啟動 shared worker。因此以這種方式載入的編輯器會在沒有其 worker 的情況下執行，就像在封鎖 worker 的主應用程式上一樣，請參閱 [Web Worker](#web-workers)。[script 標籤](#script-tag)建置版本則將它們內含於其檔案中。

### script 標籤 {#script-tag}

自 `3.6.0` 起，此套件也提供一個 UMD 建置版本 `dist/erd-editor.umd.js`，將所有相依套件和所有 shared worker 都包含在單一檔案中。
`unpkg` 和 `jsdelivr` 屬性指向的就是它，因此任一 CDN 上僅含套件名稱的 URL 都會提供它，而且它會定義 `window.ErdEditor`。

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

載入它會定義 `<erd-editor>`。`window.ErdEditor` 帶有兩個檔案回呼函式 `ErdEditor.setExportFileCallback` 和 `ErdEditor.setImportFileCallback`，自 `3.9.2` 起提供的 `ErdEditor.createKeyBindingMap`，自 `4.2.0` 起提供的 `ErdEditor.dictionaryRowChords`（請參閱 [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)），以及自 `5.0.0` 起提供的 `ErdEditor.ErdEditorElement` 和 `ErdEditor.defineErdEditor`，請參閱[註冊元素](#registering-the-elements)。它不帶有 [toImage](./to-image.md)。

自 `5.0.0` 起，第二個檔案 `dist/erd-viewer.umd.js` 會定義 `<erd-viewer>`，並將 `ErdViewerElement` 和 `defineErdViewer` 放到 `window.ErdViewer` 上。它不會啟動任何 worker，內含全部 25 種顯示語言，且除了所給的 `src` 之外不會發出任何請求。

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

兩個檔案都不會定義對方的標籤，且各自除了自己的全域變數和 `window.Konva` 之外，不會在頁面上留下任何全域變數。
exports 對應表仍會讓打包工具指向 ES 模組，因此從 npm 安裝時絕不會用到這兩個檔案。
無法自行載入 script 的頁面，可以改為嵌入託管的檢視器 erd-editor.io/embed，請參閱[嵌入](../guide/guides/embedding.md)。

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

自 `4.0.0` 起，`enable-locale-picker` 會加入工具列的 `Display Language` 選擇器，`enable-welcome-screen` 則會加入空白圖表所顯示的歡迎畫面，請參閱 [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) 和 [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen)。
像[使用方式](#usage)那樣載入文件的頁面，會在 `setInitialValue()` 載入文件之後才開啟 `enableWelcomeScreen`，而不是在標記中開啟，因此歡迎畫面絕不會在仍在載入的檔案上方閃現。
編輯器內含全部 25 種顯示語言，ES 建置版本和 script 標籤建置版本皆然，因此不需要提供任何語系檔案，也不需要註冊任何東西。若既沒有選擇器也沒有呼叫 `setLocale()`，編輯器會顯示英文。

在此加入 `readonly` 會讓編輯器以讀者的身分開啟：指派 `value`、呼叫 `clear()`，以及每一個 `setSchema*()` 呼叫（包括 `setSchemaJSON()` 和以附加模式進行的呼叫）都會被忽略，而且 `change` 事件絕不會觸發。它的索引標籤、物件總管和快速搜尋仍可閱讀，每個會編輯圖表的控制項都已移除。
讀取 `editor.value` 和 `editor.runtimeValue` 仍然有效，且兩者都保有文件本身的設定：讀者變更的檢視設定（例如縮放比例或資料庫）只會留在該編輯器的畫面上。請改用 `setInitialValue()` 載入，請參閱 [readonly](./erd-editor-element.md#readonly)。

### 伺服器端轉譯 {#server-side-rendering}

除了 `engine.js` 和 `peer.js` 之外，每個進入點都需要 DOM，因此在 Node 中會擲回例外狀況。`erd-editor.js` 和 `erd-viewer.js` 會在模組範圍內定義各自的元素，而自 `5.0.0` 起不定義任何東西的套件根目錄，載入時仍會建立兩個元素類別。
在 Next.js、Nuxt、SvelteKit 或 Astro 中，從僅在用戶端執行的路徑載入元素的進入點，並從同一路徑對根目錄進行具名匯入，例如 `setExportFileCallback` 或 `toImage`。

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

在開發期間，請將編輯器的版面配置 worker 所匯入的 ELK 套件加入 Vite 的預先打包，否則該 worker 產生的版面配置會失敗：自動版面配置的 `Flow`、`Tree - vertical` 和 `Tree - horizontal`、「視覺化」索引標籤的流程模式，以及以流程排列的匯入。
Vite 7 及更早版本還需要讓編輯器不被預先打包，因為它們的預先打包會將 worker 的 URL 指向它從未寫出的檔案，使三個 worker 全部失敗。在 Vite 8 上請省略該 `exclude`，它只會讓開發伺服器逐一擷取套件的每個檔案。正式環境的建置兩者都不需要。

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

匯入 `@dineug/erd-editor/erd-editor.js` 會將 `erd-editor` 合併到 `HTMLElementTagNameMap` 中，匯入 `@dineug/erd-editor/erd-viewer.js` 則會合併 `erd-viewer`，因此不需要轉型即可取得元素的型別。從根目錄匯入的任何內容（僅匯入型別也一樣）會帶入兩者。

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` 已匯出，可用來為您自己的變數和 props 加上型別註記。自 `5.0.0` 起，它同時也是元素的類別，而 `ErdViewerElement` 是檢視器的介面與類別，請參閱[註冊元素](#registering-the-elements)。
自 `4.0.0` 起，此套件也會匯出 `LocaleCode`、`LocaleOption` 和 `SchemaSQLOptions` 型別，自 `5.0.0` 起還有 `ToImageOptions`，請參閱[進入點](#entry-points)。`setSchema*()` 方法所接受的選項沒有匯出的名稱；從元素上取得它們，例如 `Parameters<ErdEditorElement['setSchemaSQL']>[1]`。
自 `5.0.0` 起，在 `moduleResolution: "node10"` 下（它不讀取 exports 對應表），此套件的 `typesVersions` 也會為每個子路徑進入點提供型別。

## 註冊元素 {#registering-the-elements}

自 `5.0.0` 起，此套件只會在頁面要求時才定義標籤。

| 匯入 | 定義 |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | 不定義任何東西 |

這兩個進入點各自會在求值時定義其標籤且不匯出任何東西，因此只為其副作用而匯入，且兩者都不會定義對方的標籤。
根目錄匯出兩個元素類別 `ErdEditorElement` 和 `ErdViewerElement`，以及 `defineErdEditor()` 和 `defineErdViewer()`，後者會在您呼叫之處定義各自的標籤：

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

當標籤已持有該類別時，呼叫不會有任何作用，因此一個進入點與一次 define 呼叫，或兩次 define 呼叫，可以同時出現在一個頁面中。當另一個類別持有該標籤時（例如同一頁面中打包了此套件的第二份副本），它會擲回一個指名該標籤的 `Error`：`Another element class already defines the custom element name erd-editor`。
根目錄的類別就是各進入點所定義的類別，因此任一進入點執行後，`customElements.get('erd-editor') === ErdEditorElement`。在該標籤被定義之前，`document.createElement('erd-editor')` 只會建立一個沒有任何編輯器成員的普通 `HTMLElement`，而 `new ErdEditorElement()` 會擲回例外。

若要使用您自己的標籤，請自行在該標籤下定義類別，並自行將該標籤加入 `HTMLElementTagNameMap`。請在不載入該元素的進入點或其 [script 標籤](#script-tag)建置版本，也不呼叫其 define 函式的視窗中進行，因為一個類別在一個視窗中只能取得一個名稱：

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

同時包含兩個元素的套件，會讓 Vite 和 Rolldown 對除英文以外的每種顯示語言各警告一次 `INEFFECTIVE_DYNAMIC_IMPORT`。檢視器會以各自的 `import()` 載入每一種語言，而編輯器會一次匯入所有字典，因此它們會留在編輯器的區塊中並隨之載入。這不會造成任何失敗，而只含檢視器的套件會將每種語言放在各自的區塊中。

## 語法醒目提示 {#syntax-highlighting}

結構描述 SQL 和程式碼產生器面板由 [Shiki](https://shiki.style) 在其專屬的 shared worker 中進行語法醒目提示，而自 `4.0.0` 起，「結構描述 SQL」索引標籤的 `Before tables` 和 `After tables` 指令碼也是如此。
自 `3.7.0` 起，不需要安裝任何東西，也不需要註冊任何東西：worker 會在程式碼面板第一次轉譯時建立，因此從未開啟任何程式碼面板的頁面絕不會擷取這些文法。

| | |
| --- | --- |
| 語言 | SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go、Python、PHP、Rust、Swift、JSON、Mermaid |
| 佈景主題 | `github-dark` 和 `github-light`，依編輯器的淺色或深色外觀而定 |

這些正是各面板所輸出的語言：`JPA` 會以 Java 醒目提示，`SQLAlchemy` 以 Python，`TypeORM`、`Sequelize`、`Drizzle` 和 `Zod` 以 TypeScript，`Doctrine` 以 PHP，`SeaORM` 以 Rust，`JSON Schema` 以 JSON，而 `DBML` 和 `AML` 則以 SQL（套件中最接近的文法）醒目提示，請參閱[程式碼產生器](../guide/guides/code-generator.md)。

規則運算式引擎是純 JavaScript，因此任何主應用程式的原則都不需要 `wasm-unsafe-eval`。
在缺少 `SharedWorker` 的環境中（Chrome 148 之前的 Android 版 Chrome、16.4 之前的 Safari），會記錄此失敗，並將程式碼顯示為純文字；指令碼仍可編輯。

從 `3.6.0` 或更早版本升級時：`@dineug/erd-editor-shiki-worker` 已不再發佈，`setGetShikiServiceCallback` 也隨之移除。
移除該安裝與註冊；從 CDN 載入 worker 的頁面也要移除那第二個 `<script>` 標籤。

## Web Worker {#web-workers}

編輯器會在 `SharedWorker` 中執行三項工作：語法醒目提示、圖片匯出，以及資料表版面配置，後者支撐著[自動版面配置](../guide/guides/table-related-functions.md#auto-layout)、「視覺化」索引標籤的[流程模式](../guide/guides/visualization.md#how-flow-is-placed)，以及自 `4.0.0` 起匯入結構描述時的排列。
這三者都內建於 `@dineug/erd-editor` 中。它們都不需要您自行設定，但每一個都可能被主應用程式封鎖。
自 `5.0.0` 起，每個 worker 都在各自的模組中建構，因此打包的結果只會帶有其模組所用到的 worker：只含 [toImage](./to-image.md) 而不含任何元素的套件只帶有圖片匯出 worker，而 `<erd-viewer>` 完全不啟動任何 worker，請參閱[進入點](#entry-points)。
負責執行文件垃圾回收的 worker 已在 `4.0.0` 中移除，垃圾回收本身也一併移除。

| Worker | 缺少時 |
| --- | --- |
| 語法醒目提示 | 結構描述 SQL 和程式碼產生器面板，以及結構描述 SQL 指令碼都會維持純文字 |
| 圖片匯出 | PNG、SVG、`Copy to clipboard`、`Export image` 對話方塊的預覽，以及自 `5.0.0` 起的 [toImage()](./to-image.md) 都會在主執行緒上繪製，繪製期間會封鎖頁面 |
| 資料表版面配置 | 自動版面配置的 `Flow`、`Tree - vertical` 和 `Tree - horizontal` 版面配置，以及「視覺化」索引標籤的流程模式，都會以 `Could not place tables` 結束；以流程排列的匯入（從 `Import` 或 `Import and Add` 匯入的 SQL、GraphQL、DBML 或 AML 檔案，或帶有 `placement: 'auto'` 的 `setSchema*()` 呼叫）會將其資料表依列排放，且不會顯示任何訊息；`Force` 和關係圖模式不受影響，因為它們在編輯器內部執行 |

圖片匯出會等候其 worker 回應十秒，之後改在主執行緒上繪製；語法醒目提示則會在其 worker 失敗時立即將程式碼保留為純文字，因此封鎖 worker 的主應用程式損失的是效能，而不是功能。
資料表版面配置是例外：計算版面配置的引擎比編輯器本身還要龐大，而且絕不會在同一處理序中載入，因此第一次排列時會等候其 worker 三十秒，而在 worker 回應之後，則會給每次版面配置六十秒的時間傳回結果。
若任一等候逾時，排列就會以沒有 worker 時的方式結束。自動版面配置一開始就會顯示 `Placing tables`，而流程模式和以流程排列的匯入，則只有在一次排列（包括其 worker 的啟動）已執行六秒後才會顯示它。

Vite、webpack 5 和 Rspack 會將 worker 輸出為您的區塊旁的檔案。esbuild，以及單獨使用（而非透過 Vite）的 Rolldown，則不會輸出任何 worker，因此它們建置的頁面會在沒有 worker 的情況下執行。
在 webpack 實驗性的 `experiments.outputModule` 下，沒有任何 worker 會啟動，因為每個 worker 都在等待從它分離出來、卻沒有任何東西載入的區塊。請維持 webpack 的預設輸出，或設定 `optimization.splitChunks: false`。

### 內容安全政策 {#content-security-policy}

處於嚴格內容安全政策下的頁面，需要為這些元素設定下列指令：

- 打包建置版本需要 `worker-src 'self'`，其 worker 是套件旁的檔案，若您的打包工具會內嵌 worker，則還需要加上 `blob:`。在 [script 標籤](#script-tag)建置版本中，這三者都以 `data:` URL 的形式內含於檔案中，因此該頁面改為需要 `worker-src data:`。`<erd-viewer>` 兩者都不需要，因為它不啟動任何 worker。
- 自 `5.0.0` 起，兩個元素都以建構的樣式表來設定自身樣式，`style-src 'self'` 即可放行。編輯器的程式碼面板仍以 `style` 屬性為文字上色，而 `Export image` 對話方塊的預覽是位於 `blob:` URL 的圖片，因此編輯器還需要 `style-src 'unsafe-inline'` 和 `img-src blob:`。
- 不支援建構樣式表的瀏覽器（例如 101 之前的 Firefox）會改用 `<style>` 元素，兩個元素都需要 `style-src 'unsafe-inline'`。
- `<erd-viewer>` 會擷取其 `src`，因此該來源要放進 `connect-src`，請參閱[它加入頁面的內容](./erd-viewer-element.md#what-it-adds-to-a-page)。

## 進入點 {#entry-points}

此套件有五個進入點：

| 進入點 | 說明 |
| --- | --- |
| `@dineug/erd-editor` | 根目錄：下列匯出項目。自 `5.0.0` 起它不定義任何元素，但載入時仍需要 DOM |
| `@dineug/erd-editor/erd-editor.js` | 自 `5.0.0` 起提供。定義 `<erd-editor>`，不匯出任何東西 |
| `@dineug/erd-editor/erd-viewer.js` | 自 `5.0.0` 起提供。定義 `<erd-viewer>`，不匯出任何東西 |
| `@dineug/erd-editor/engine.js` | 沒有 DOM 的文件存放區 |
| `@dineug/erd-editor/peer.js` | 自 `3.9.1` 起提供。MCP 伺服器的無介面對等端 |

根目錄匯出兩個元素類別及其 define 函式、兩個回呼函式的 setter、自 `3.9.2` 起提供的預設按鍵繫結及其型別、自 `4.0.0` 起提供的顯示語言型別和 `getSchemaSQL()` 的選項型別、自 `4.2.0` 起提供的「字典」索引標籤列按鍵組合，以及自 `5.0.0` 起提供的 `toImage`。

| 匯出項目 | 說明 |
| --- | --- |
| `ErdEditorElement` | 元素介面，請參閱 [ErdEditorElement](./erd-editor-element.md)。自 `5.0.0` 起也是其類別，也就是 `<erd-editor>` 所定義的類別，請參閱[註冊元素](#registering-the-elements)。 |
| `ErdViewerElement` | 自 `5.0.0` 起提供。檢視器的介面與類別，請參閱 [ErdViewerElement](./erd-viewer-element.md)。 |
| `defineErdEditor()`、`defineErdViewer()` | 自 `5.0.0` 起提供。將 `<erd-editor>` 或 `<erd-viewer>` 定義為其類別。當標籤已持有該類別時，呼叫不會有任何作用；當另一個類別持有它時，會擲回 `Error`，請參閱[註冊元素](#registering-the-elements)。 |
| `toImage(value, options)` | 自 `5.0.0` 起提供。以 `Export image` 對話方塊的選項，將文件繪製為 PNG `Blob` 或 SVG 字串，請參閱 [toImage](./to-image.md)。 |
| `ToImageOptions`（型別） | 自 `5.0.0` 起提供。`toImage()` 所接受的選項：`format`、`background`、`darkMode` 和 `scale`。 |
| `setExportFileCallback(cb)` | 取代瀏覽器的下載，`(blob, { fileName }) => void`。 |
| `setImportFileCallback(cb)` | 取代瀏覽器的檔案選擇器，`({ type, op, accept, mode }) => void`；`mode` 自 `4.0.0` 起提供。自 `4.2.0` 起，即使已設定回呼函式，「字典」索引標籤的 `Import CSV` 仍會開啟瀏覽器的檔案選擇器，請參閱[檔案對話方塊](#file-dialogs)。 |
| `createKeyBindingMap()` | 每次呼叫都會以新的 `KeyBindingMap` 傳回預設按鍵繫結，請參閱 [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap)。 |
| `KeyBindingMap`、`KeyBindingName`、`ShortcutOption`（型別） | 按鍵繫結對應表、其命令名稱的聯集，以及單一按鍵繫結。 |
| `dictionaryRowChords(map)` | 自 `4.2.0` 起提供。每次呼叫都會以新的 `ShortcutOption[]` 傳回在您所傳入的 `KeyBindingMap` 下，[字典](../guide/guides/dictionary.md#adding-and-deleting-rows)索引標籤的網格用來插入和刪除列的按鍵組合。用來在上方插入列的按鍵組合（預設為 `Alt+Shift+Enter`）不屬於任何按鍵繫結，請參閱 [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)。 |
| `LocaleCode`、`LocaleOption`（型別） | 自 `4.0.0` 起提供。25 個顯示語言代碼，以及這些代碼加上 `'system'`（即 `setLocale()` 所接受的值），請參閱[顯示語言](./erd-editor-element.md#display-language)。 |
| `SchemaSQLOptions`（型別） | 自 `4.0.0` 起提供。`getSchemaSQL()` 所接受的選項：`statements`、`header`，以及自 `4.2.0` 起的 `logicalNameAsComment`，請參閱 [getSchemaSQL](./erd-editor-element.md#getschemasql)。 |

自 `5.0.0` 起，`dist` 每個模組各有一個未壓縮的檔案，各自附帶其宣告檔，而 `package.json` 的 `sideEffects` 只列出兩個標籤進入點和 worker 檔案所需的兩個存根。因此打包工具會捨棄頁面未用到的每個模組，並只壓縮一次：

- 從根目錄進行具名匯入（例如 `setExportFileCallback`）不會打包任何元素，也不會打包任何 worker。
- `toImage` 會帶入圖片匯出 worker，但不帶任何元素。
- `erd-editor.js` 會帶入編輯器和全部三個 shared worker。
- `erd-viewer.js` 會帶入檢視器但不帶任何 worker，其中內含英文，其他每種顯示語言則各在自己的區塊中，於頁面要求時才載入。

`@dineug/erd-editor/engine.js` 在沒有 DOM 的情況下執行文件存放區，因此可以在 Web Worker 中運作，請參閱[遠端儲存](./advanced/remote-storage.md)。
它會匯出 `createReplicationStore` 和 `ReplicationStore` 型別。自 `3.10.0` 起，它也會匯出 `ReplicationChange` 型別 `{ value: string; changed: boolean }`，也就是複本的 `change` 監聽器所收到的內容，請參閱 [on@change](./advanced/remote-storage.md#onchange)。
自 `4.0.0` 起，`ReplicationStore` 也有 `runtimeValue`。它的 `value` 以及 `change` 所傳遞的值，與元素的一樣，都是檔案所保存的儲存形式，請參閱 [ReplicationStore](./advanced/remote-storage.md#replicationstore)。

`@dineug/erd-editor/peer.js` 是 [MCP 伺服器](../mcp/introduction.md)用來編輯文件的無介面對等端。它是為該伺服器而存在的，這些頁面不會說明它。

### 檔案對話方塊 {#file-dialogs}

匯入和匯出都會經過可注入的回呼函式，因此沒有瀏覽器檔案對話方塊的主應用程式（例如 IDE 的 webview）可以提供自己的對話方塊。
這兩者並不對稱：匯出會將完成的檔案交給您，而匯入只會要求一個檔案，內容則由您自行送回。
自 `4.2.0` 起，「字典」索引標籤的 `Import CSV` 是唯一一個絕不會呼叫匯入回呼函式的匯入，該回呼函式的 `type` 也沒有代表 CSV 的值。它一律會開啟瀏覽器本身的檔案選擇器來選取 `.csv` 檔案，請參閱[匯入與匯出 CSV](../guide/guides/dictionary.md#importing-and-exporting-csv)。

`op` 為 `set` 或 `diff`：不論 `type` 為何，`diff` 都會交給 `setDiffValue()`。否則由 `type` 選擇方法，而 `accept` 則帶有該類型的副檔名，可直接交給主應用程式的檔案對話方塊。
自 `4.0.0` 起，當使用者選擇[匯入並加入](../guide/guides/file-import-export.md#import-and-add)時，`set` 會帶有 `mode: 'append'`，而一般的匯入則不帶 `mode`。請將其傳遞下去：捨棄它的回呼函式會取代使用者要求加入內容的那個圖表。

| `type` | `accept` | 方法 |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` 會在資料表放置之前依其關聯進行版面配置（如同編輯器本身的匯入），並讓該呼叫傳回 Promise。若沒有它，資料表會立即依列排放，請參閱 [setSchemaSQL](./erd-editor-element.md#setschemasql) 和 [setSchemaJSON](./erd-editor-element.md#setschemajson)。

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

依您所處理的每一種 `type` 分派，其餘的則忽略。
取代模式的 `setSchemaJSON()` 就像指派 `value` 一樣，會在剖析前清除文件，因此若將不是 `.erd.json` 文件的內容傳送給它（不論是透過涵蓋其餘所有情況的 `else`，或是因為之後新增的 `type` 落入了該分支），都會清空圖表，而不會匯入任何內容。

編輯器產生的 `fileName` 為 `<database name>-<timestamp>` 加上檔案的副檔名，其中時間戳記是以 `yyyy-MM-dd'T'HH_mm_ss` 格式表示的當地時間。資料庫名稱空白時會改用 `unnamed`。字典的 CSV 會在副檔名之前加上其工作表名稱，例如 `<database name>-<timestamp>-words.csv`。
匯出回呼函式會收到下列檔案。自 `4.0.0` 起，其中包括 SVG 和程式碼產生器的檔案，而 `.sql` 則來自「結構描述 SQL」索引標籤的 `Save file`，不再直接來自 `Export`。自 `4.2.0` 起，「字典」索引標籤的 CSV 也在其中。[toImage()](./to-image.md) 兩個回呼函式都不會呼叫：它會將圖片交還給您。

| 檔案 | 副檔名 | Blob `type` |
| --- | --- | --- |
| JSON 匯出 | `.erd.json` | `application/json` |
| 「結構描述 SQL」索引標籤的 `Save file`，內容為該索引標籤所顯示的文字，請參閱[結構描述 SQL](../guide/guides/schema-sql.md) | `.sql` | 無 |
| [匯出圖片](../guide/guides/file-import-export.md#image)對話方塊 | `.png` 或 `.svg` | `image/png` 或 `image/svg+xml` |
| 「程式碼產生器」索引標籤的 `Save file`，請參閱[程式碼產生器](../guide/guides/code-generator.md) | 該語言的副檔名：`.cs`、`.go`、`.java`、`.kt`、`.php`、`.rs`、`.scala`、`.swift`、`.ts`、`.py`、`.aml`、`.dbml`、`.graphql`、`.json` 或 `.mmd` | 無 |
| 「字典」索引標籤的 `Export CSV`，包含所顯示工作表的每一列，不論其搜尋列出了哪些列，請參閱[匯入與匯出 CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

依副檔名選擇處理常式的主應用程式，需要為其中每一種各準備一個處理常式。

若未設定，編輯器會使用瀏覽器本身的下載和檔案選擇器行為。傳入 `null` 即可恢復為該行為。

## 瀏覽器支援 {#browser-support}

Chrome 91+、Edge 94+、Firefox 93+、Safari 16.4+：這是已發佈的打包檔案建置時所依據的 ES2022 基準。
未打包任何 polyfill。若需要支援較舊的瀏覽器，請自行加入。

## 從 4.x 升級 {#upgrading-from-4x}

`5.0.0` 是主要版本。將頁面從 4.x 移轉時，逐一檢查下列各項：

- `import '@dineug/erd-editor'` 不再定義 `<erd-editor>`。請改為匯入 `@dineug/erd-editor/erd-editor.js` 以取得其副作用，或呼叫 `defineErdEditor()`，並保留您從根目錄進行的具名匯入。仍使用單純匯入的頁面，TypeScript 不會報錯，因為根目錄的宣告仍會在 `HTMLElementTagNameMap` 中指名該標籤，但它建立的元素是普通的 `HTMLElement`，因此第一次呼叫其方法就會擲回 `TypeError`，請參閱[註冊元素](#registering-the-elements)。

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- 在 CDN 上同樣如此：`https://esm.run/@dineug/erd-editor` 現在提供的是根目錄，不定義任何東西，請改為匯入 `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`。僅含套件名稱的 jsDelivr 和 unpkg URL 仍提供 script 標籤建置版本，它如先前一樣定義 `<erd-editor>`。未指定版本的 URL 現在提供最新的 5.x 版本；若要停留在 4.x，就固定為 `@4.2.0`，請參閱 [CDN](#cdn) 和 [script 標籤](#script-tag)。
- 根目錄不定義任何東西，但仍需要 DOM，因此在伺服器端轉譯時，從它進行的具名匯入（例如 `setExportFileCallback`）要與元素的進入點一起放在僅在用戶端執行的路徑上，請參閱[伺服器端轉譯](#server-side-rendering)。
- `window.ErdEditor` 新增 `ErdEditorElement` 和 `defineErdEditor`。檢視器的 script 標籤建置版本會將 `ErdViewerElement` 和 `defineErdViewer` 放到 `window.ErdViewer` 上，且兩個全域變數都不帶有 `toImage`。
- `readonly` 編輯器會以讀者的身分開啟。它的六個索引標籤、物件總管、快速搜尋和協作者的游標與選取範圍仍在，而每個會編輯圖表的控制項都直接移除，而不是停用：工具列將資料庫名稱顯示為文字，「設定」索引標籤在 `Read only` 徽章之下顯示其設定且每個控制項都已停用，浮動工具列只保留縮放、「名稱顯示」、禪模式和指南針，因此 `Hand` 和 `Select` 都不見了，而拖曳會平移。按下不會選取任何東西：唯一的選取範圍是從物件總管或快速搜尋跳至目標時，在其到達的項目周圍畫出的外框，單擊（不移動）會將其清除，而全選快速鍵不會選取任何東西。開啟 `readonly` 會結束原本開著的內容，例如選取範圍、手形工具、儲存格編輯器、拖曳、Map Columns、自動版面配置的 `Force` 預覽和 Time Travel，並保留捲動、縮放、索引標籤和「名稱顯示」，請參閱 [readonly](./erd-editor-element.md#readonly)。
- `readonly` 讀者所變更的設定，無論其鎖定為何，都只會留在該編輯器的畫面上：捲動和縮放、索引標籤、「名稱顯示」、View Option、資料庫，以及程式碼產生器的語言、名稱大小寫和引號類型。`value`、`runtimeValue` 和 JSON 匯出保有文件本身的設定，而 4.x 讀者的變更可能會進入其中，且 `getSharedStore()` 不會將它們送給其他編輯器。未指定廠商的 `getSchemaSQL()` 會為讀者挑選的資料庫寫出。關閉 `readonly` 會讓資料庫、程式碼設定和 View Option 回到文件的設定，並讓捲動、縮放、索引標籤和「名稱顯示」維持讀者離開時的狀態。
- 「設定」索引標籤的 `Recalculation table width` 列已移除。載入和貼上仍會讓每個資料表的寬度符合其文字。
- 在 Vite 8 上，請從 `optimizeDeps` 移除 `exclude: ['@dineug/erd-editor']`，只有 Vite 7 及更早版本仍需要它，並保留 ELK 的 `include`，請參閱 [Vite](#vite)。

## 從 3.x 升級 {#upgrading-from-3x}

`4.0.0` 是主要版本。將頁面從 3.x 移轉時，逐一檢查下列各項，然後再檢查 `5.0.0` 的[從 4.x 升級](#upgrading-from-4x)：

- `editor.value`、複本的 `value`，以及其 `change` 所傳遞的 `value`，都是檔案所保存的儲存形式：不含已移除的實體、測量出的寬度、堆疊順序或關聯錨點。繼續儲存 `value`，並從 `runtimeValue` 讀取上述資訊；實體的時間戳記（`meta`）則已完全移除。以執行中對等端的 `runtimeValue` 初始化加入進行中工作階段的協作者或複本，而不是使用 `value` 或檔案，並且絕不要儲存 `runtimeValue`，請參閱 [value](./erd-editor-element.md#value) 和 [runtimeValue](./erd-editor-element.md#runtimevalue)。
- 設定鎖定取代了 `Save Scroll Information` 和 `Save Zoom Information`。新文件以及在 `4.0.0` 之前儲存的任何文件，所有鎖定都是開啟的，因此捲動、縮放、切換索引標籤，或變更程式碼產生器的語言、名稱大小寫或引號類型，都不會改變 `value`，也不會觸發 `change`。透過 `change` 保存檢視的頁面，需要在「設定」索引標籤上解除鎖定 `Viewport`（索引標籤則需解除鎖定 `Canvas Type`），或使用其 `settings.lockSettings` 未設定這些位元的文件，請參閱[鎖定](../guide/guides/settings.md#lock)。
- `settings` 已不再有 `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization` 或 `ignoreSaveSettings`，`SaveSettingType` 常數也已移除。`settings.lockSettings` 搭配 `LockSettingType` 位元，取代了 `ignoreSaveSettings`，`4.0.0` 或更新版本既不會讀取也不會寫入後者，請參閱 [Settings](./advanced/schema.md#settings)。
- 每個檔案在 `$schema` 中指定的 [JSON Schema](./advanced/schema.md#json-schema) 現在只描述儲存形式，而且是封閉式的：它會拒絕舊版本儲存的檔案，直到 `4.0.0` 或更新版本儲存時將其改寫為止。
- 文件的垃圾回收已隨其 worker 一併移除，因此已移除的實體會保留在 `runtimeValue` 中，直到下次從檔案開啟該文件為止。仍保留三個 shared worker，請參閱 [Web Worker](#web-workers)。
- 讓共用工作階段中的每個編輯器和複本都使用 `4.0.0` 或更新版本。較舊的版本會忽略新的動作類型：資料表群組、「對應欄位」、鎖定和結構描述 SQL 指令碼的動作類型，請參閱[混用不同版本](./advanced/collaborative-editing.md#mixing-releases)。
- 匯入回呼函式在使用匯入並加入時會收到 `mode: 'append'`，回呼函式必須將其傳遞下去。匯出回呼函式現在也會收到 `.svg` 和程式碼產生器的檔案，而且 `Export` ▸ `Schema SQL` 會開啟「結構描述 SQL」索引標籤，而不是直接儲存，因此 `.sql` 只會來自該索引標籤的 `Save file`，請參閱[檔案對話方塊](#file-dialogs)。
- `Delete` 和 `Backspace` 已繫結至新的 `removeSelection`。當編輯器在輸入框以外的地方取得焦點時，按鍵的預設行為在每個索引標籤上都會被阻止，而在 ERD 索引標籤上則會移除選取的項目。`KeyBindingName` 和 `KeyBindingMap` 新增了此項目，而 `setKeyBindingMap({ removeSelection: [] })` 會將這兩個按鍵交由頁面處理，請參閱 [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap)。
- `ThemeOptions.appearance` 也接受 `'system'`，也就是佈景主題建立器的 `System`，開啟 `systemDarkMode` 時就會設定為此值。選取該值期間，`changePresetTheme` 會回報 `'system'`，因此原樣儲存它，再將其交回給 `setPresetTheme`。在 `systemDarkMode` 開啟時，以 `'light'` 或 `'dark'` 呼叫的 `setPresetTheme()` 現在會維持不變，而不會被下一次 OS 的變更覆寫，請參閱 [systemDarkMode](./erd-editor-element.md#systemdarkmode) 和 [changePresetTheme](./erd-editor-element.md#changepresettheme)。
- `1.0.0` 或更新版本的 `@dineug/erd-editor-mcp`、`4.0.0` 或更新版本的 VS Code 擴充功能，以及 `1.0.0` 或更新版本的 Obsidian 和 JetBrains 外掛程式，都使用 hub 協定 2。`1.0.0` 或更新版本的伺服器與為代理程式提供服務的較舊編輯器版本，或較舊的伺服器與上述其中一個編輯器，會以 `protocolMismatch` 互相拒絕，並指出需要更新的一方，請參閱[更新](../mcp/installation.md#updating)。
- 未指定版本的 CDN URL 會提供最新版本，自 `5.0.0` 起為 5.x。若要停留在 3.x，就固定為 `@3.10.0`，請參閱 [CDN](#cdn)。
