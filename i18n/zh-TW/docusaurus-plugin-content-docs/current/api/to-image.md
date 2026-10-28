---
sidebar_position: 4
description: 以 toImage 從您自己的程式碼將文件繪製為 PNG 或 SVG，使用 Export image 對話方塊的選項，可在瀏覽器中執行，也可在有匯出 worker 的情況下於其中執行。
---

# toImage

自 `5.0.0` 起，套件根目錄會匯出 `toImage()`，它可在頁面上沒有任何編輯器的情況下，將文件繪製為 PNG 或 SVG。  
它寫出的檔案與 [Export image](../guide/guides/file-import-export.md#image) 對話方塊的 `PNG` 和 `SVG` 按鈕所寫出的相同，並且只有對話方塊的三個選項：`Background`、`Dark mode` 和 `Scale`。

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` 會以型別匯出在它旁邊，請參閱[進入點](./installation.md#entry-points)。

## value {#value}

文件的文字：`.erd.json` 檔案所持有的內容、編輯器的 [value](./erd-editor-element.md#value) 或 [runtimeValue](./erd-editor-element.md#runtimevalue)，或 [setInitialValue](./erd-editor-element.md#setinitialvalue) 載入的任何其他文字。  
空文字或僅含空白字元的文字會繪製空白圖表，不含任何文件欄位的 JSON 也一樣，剖析器會為它填入預設值。

## 選項 {#options}

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `format` | 無；必填 | `'png'` 會解析為類型為 `image/png` 的 `Blob`，`'svg'` 則解析為 SVG 標記字串。 |
| `background` | `true` | 在圖表後方繪製畫布顏色。`false` 會讓它保持透明，包括 ON DELETE 或 ON UPDATE 標籤底下的方框。 |
| `darkMode` | `false` | 繪製深色佈景主題，取代淺色佈景主題。 |
| `scale` | `2` | `1`、`2` 或 `3`，即圖表在 100% 時每一單位的影像像素數。它只決定 PNG 的大小；無論縮放為何，SVG 都是圖表的大小。 |

`toImage()` 不會讀取其他任何索引鍵，因此表中沒有列出的索引鍵不會有任何作用。

## 繪製的內容 {#what-it-draws}

圖片就是對話方塊所繪製的那一張：

- 整個圖表，裁剪為其所繪製的範圍加上邊界，且一律以 100% 繪製，無論文件儲存時的縮放比例為何，因此每個資料表都完整繪製。文件中被 [View Option](../guide/guides/table-related-functions.md#table-view-options) 隱藏的內容既不繪製也不保留空間，資料表群組繪製在其他所有內容之後，而[字典檢查](../guide/guides/dictionary.md#marks-on-the-canvas)給予名稱的顏色則不會繪製。
- PNG 的大小是圖表在 100% 時的大小乘以 `scale`。大到瀏覽器畫布無法容納的 PNG 會以降低的解析度寫出，而不是失敗，且 `toImage()` 不會告知這一點。
- SVG 會將其文字保留為文字，並指名其字型而不嵌入字型，因此沒有編輯器字型的檢視器會繪製成另一種字型。陰影會被省略。

對話方塊取用編輯器畫面的地方，`toImage()` 只取用文件，因此文件在每個頁面上的繪製結果都相同：

- 它的顏色是元素預設灰色與強調色（`slate` 和 `indigo`）的預設組合，除非 `darkMode` 為 `true`，否則為淺色。頁面的任何佈景主題、任何 [setTheme](./erd-editor-element.md#settheme) 覆寫和任何[佈景主題建立器](../guide/guides/language-and-theme.md)的變更都不會影響它。
- 它的資料表和欄位依文件所持有的[名稱顯示](../guide/guides/logical-names.md#name-view)命名，對於 `Name View` 鎖定為開啟的檔案，就是鎖定的那一個。
- 圖表自行繪製的文字（例如未命名資料表的預留文字）是英文。

## 執行的位置 {#where-it-runs}

`toImage()` 需要瀏覽器頁面，因為它要在畫布上測量和繪製。它所屬的套件根目錄載入時需要 DOM，因此無法從 Node 或 Web Worker 到達，請參閱[伺服器端轉譯](./installation.md#server-side-rendering)。  
它會等頁面的字型載入完成後才繪製。

在主應用程式有執行圖片匯出的 shared worker 時，它會像對話方塊一樣在其中繪製，因此頁面在此期間仍保持回應；若沒有 worker 或 worker 未及時回應，則改在主執行緒上繪製，請參閱 [Web Worker](./installation.md#web-workers)。  
匯入 `toImage` 但不含任何元素的套件，只會帶有圖片匯出 worker。  
兩個 [script 標籤](./installation.md#script-tag)建置版本都不帶有它：`window.ErdEditor` 和 `window.ErdViewer` 都沒有 `toImage`。

## 拒絕 {#rejections}

在繪製任何東西之前，它所傳回的 Promise 會在下列情況被拒絕：

- 頁面沒有 `document`：`Error`，`toImage needs a browser, since it draws on a canvas`；
- `value` 不是字串，例如已經剖析成物件的文件：`TypeError`；
- 某個選項持有[選項](#options)表中沒有列出的值，包括缺少 `format`，以及與 SVG 一起傳入的 `'2'` 這類 `scale`：指名該選項的 `TypeError`，例如 `toImage: scale cannot be 4`；
- 文字不是剖析器能讀取的文件：剖析器的錯誤，對於不是 JSON 的文字則是 `SyntaxError`。

## Export Image 對話方塊 {#export-image-dialog}

對話方塊和 `toImage()` 透過相同的匯出機制繪製，因此在相同選項下會寫出相同的圖片，但兩者的起點不同：

| | `Export image` 對話方塊 | `toImage()` |
| --- | --- | --- |
| 文件 | 對話方塊開啟時的圖表 | 您傳入的文字 |
| 深色模式 | 一開始與編輯器的外觀一致，一致期間會繪製畫面本身的顏色 | 除非 `darkMode` 為 `true` 否則為關閉，且一律使用預設組合 |
| 名稱顯示 | 編輯器所顯示的那一個 | 文件所持有的那一個 |
| 其自身文字的語言 | 編輯器的顯示語言 | 英文 |
| 結果 | 透過瀏覽器或[匯出回呼函式](./installation.md#file-dialogs)儲存，或複製到剪貼簿 | 交還給您；兩個檔案回呼函式都不會被呼叫 |

`Copy to clipboard` 沒有對應的功能。需要的頁面請自行將 PNG `Blob` 寫入剪貼簿。
