---
sidebar_position: 18
description: 不需撰寫程式碼，即可嵌入 erd-editor.io/embed，在其他網站上以唯讀方式顯示圖表；在建立器中產生其 URL 和 iframe 程式碼行，在 URL 中設定佈景主題、語言、名稱顯示、小地圖、控制列和顏色，並從 GitHub 或允許 CORS 的伺服器提供檔案。
---

# 嵌入

[erd-editor.io/embed](https://erd-editor.io/embed) 會在一個填滿整個頁面的檢視器中以唯讀方式顯示圖表，供其他網站嵌入：維基、部落格、網站建置工具，或任何無法自行載入 script 的頁面。  
它的 `src` 參數指定文件，也就是 ERD Editor 所儲存之檔案（例如 `.erd.json` 檔案）的位址。URL 的其餘部分設定檢視器如何顯示它，而同一位址上的建立器會為您產生 URL 及其 iframe 程式碼行。

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

此框架顯示的是 erd-editor 儲存庫中的 [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json)，而將它放進頁面的程式碼行如下：

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## 框架顯示的內容 {#what-the-frame-shows}

框架顯示圖表的資料表、欄位、關聯、備忘錄和資料表群組，其中沒有任何東西能編輯圖表或檔案。  
圖表會在載入時符合框架的大小，無論檔案儲存的縮放比例和捲動位置為何，因此框架的大小決定它開啟時的縮放比例。

畫布上方有：

- 小地圖，在圖表有內容時顯示。
- 底部的控制列：`Zoom out`、點擊後會重設縮放的縮放比例、`Zoom in`、`Fit`、`Name View` 清單，以及圖表完全不在畫面上時顯示的 `Go to content`。
- 右下角的 `erd-editor.io` 連結，它會在新分頁中開啟 erd-editor.io，且不傳送任何參照來源，因此這次點擊不會讓該網站得知框架所顯示的文件。在狹窄的框架中，它可能會蓋住控制列的一部分。

檔案載入期間，框架會顯示 `Loading diagram`。若無法擷取檔案，或檔案不含任何文件，框架會顯示空白圖表和 `Couldn't load the diagram`，請參閱 [GitHub 上的檔案](#files-on-github)和[其他伺服器上的檔案](#files-on-other-servers)。

框架只依其 URL 和訪客的系統運作。訪客在 erd-editor.io 上自己的語言和佈景主題不會套用在其中。

## 建立器 {#the-builder}

不帶 `src` 開啟 [erd-editor.io/embed](https://erd-editor.io/embed) 即可取得建立器，這是一個標題為 `Embed a diagram` 的頁面：

1. 將文件的位址貼到 `Document URL`。它會在您按 `Enter` 或離開輸入框時套用，因此輸入時不會擷取任何東西。套用之後，輸入框下方的 `Loads from` 行會指出檢視器所擷取的位址：您所給的位址，或者對於 GitHub 上的頁面，則是其在 GitHub 原始檔案主機上的位址，請參閱 [GitHub 上的檔案](#files-on-github)。
2. 挑選選項。每個選項都會立即套用到預覽、URL 和 iframe 程式碼行：
   - `Theme`：`System`、`Light` 或 `Dark`。
   - `Display Language`：`System`（旁邊附有它在您的瀏覽器中所代表的語言），接著是 25 種語言，每種都以其本身的名稱顯示。
   - `Name View`：`As Saved`、`Physical Names`、`Logical Names` 或 `Both Names`。`As Saved` 會顯示檔案所儲存的「名稱顯示」。
   - `Accent color` 和 `Gray color`，各以名稱列出並附有色票。
   - `Minimap` 和 `Controls`，兩個開關，預設皆為開啟。
   - `Height`，單位為像素，起始值為 `480`。不是正整數的高度會視為 `480`。
3. 檢查 `Preview`：這是框架將顯示的檢視器，附有 `erd-editor.io` 連結，位於高度與 `Height` 相同的方框中。它的 `System` 語言是您瀏覽器的語言，無論 erd-editor.io 本身顯示什麼語言。
4. 複製結果。`Embed URL` 是框架的位址，`Embed code` 是 iframe 程式碼行，帶有您設定的高度和寬度 `100%`。兩者各有一個 `Copy` 按鈕，在文件 URL 套用之前會保持停用，複製後的短暫時間內會顯示 `Copied`，直到有變更重寫了所複製的內容為止。

清除 `Document URL` 並套用後，預覽和兩個結果都會清空。

## URL 參數 {#url-parameters}

| 參數 | 值 | 預設值 |
| --- | --- | --- |
| `src` | 文件的位址，經 URL 編碼。 | 無：沒有它，或它是空的，頁面就是建立器。 |
| `theme` | `light`、`dark` 或 `system`。 | `system`：訪客的瀏覽器所回報的淺色或深色模式。 |
| `locale` | `system`，或[語言表](./language-and-theme.md#display-language)中的代碼，例如 `de-DE`。 | `system`：訪客的瀏覽器語言，依 [System](./language-and-theme.md#what-system-follows) 的比對方式比對，而檢視器沒有其中任何一種時則為英文。 |
| `name-view` | `physical`、`logical` 或 `both`。 | 檔案所儲存的「名稱顯示」。 |
| `minimap` | `false` 會隱藏小地圖。 | 顯示。 |
| `controls` | `false` 會隱藏控制列。 | 顯示。 |
| `accent-color` | [佈景主題建立器](./language-and-theme.md#theme)的 26 種強調色之一，例如 `jade`。 | `indigo` |
| `gray-color` | `gray`、`mauve`、`slate`、`sage`、`olive` 或 `sand`。 | `slate` |

預設值是檢視器自己的預設值，而不是網頁應用程式的預設值，後者從 `jade` 和 `olive` 開始。

- 建立器會將每個保持預設值的選項排除在 URL 之外，因此嵌入 URL 只包含不同於預設值的部分。
- 檢視器不接受的值會被忽略，其選項保持預設值。值必須與所列的完全一致，因此 `theme=Dark` 會被忽略，而 `minimap` 和 `controls` 對於 `false` 以外的任何值都保持顯示。
- 重複給定的參數會採用第一個值。
- `src` 會經過 URL 編碼，如同建立器所寫出的，因為本身含有 `&` 或 `#` 的位址否則會被截斷。

## GitHub 上的檔案 {#files-on-github}

GitHub 上的檔案或 gist，可以用其頁面所顯示的位址來指定，如同上方的框架。檢視器會改為從 GitHub 的原始檔案主機擷取它，該主機會回應其他網站的請求，而頁面本身的位址不會：

- 檔案的頁面 `https://github.com/<owner>/<repo>/blob/<ref>/<path>`，或其 `raw` 位址 `https://github.com/<owner>/<repo>/raw/<ref>/<path>`，會從 `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` 載入。`<ref>` 是分支、標籤或提交：分支會顯示該分支目前的檔案，而標籤或提交則會保留該版本。
- gist 的頁面 `https://gist.github.com/<user>/<id>`，會從 `https://gist.githubusercontent.com/<user>/<id>/raw` 載入，也就是該 gist 的第一個檔案。請讓圖表成為 gist 唯一的檔案。

嵌入 URL 會保留您所給的位址，而建立器的 `Loads from` 行顯示的是實際擷取的位址。  
這只適用於公開儲存庫和公開 gist。原始檔案主機會將每個檔案快取五分鐘，因此您推送的變更可能要等這麼久才會顯示在框架中。

## 其他伺服器上的檔案 {#files-on-other-servers}

erd-editor.io 上的檢視器會從訪客的瀏覽器以單純的 `GET` 擷取檔案，因此存放該檔案的伺服器必須允許這個跨來源請求 (CORS)：其回應需要有允許 `https://erd-editor.io` 的 `Access-Control-Allow-Origin` 標頭，例如 `*`。  
請求不帶任何 cookie，因此檔案必須不需登入即可讀取。  
沒有該標頭，或位址回應的是錯誤或 ERD Editor 文件以外的東西時，框架會顯示 `Couldn't load the diagram`。

## 在框架中 {#in-the-frame}

在訪客點擊或輕觸框架，或以 `Tab` 到達它之前，框架不會接收任何滾輪、手勢或按鍵。在那之前，滾輪、滑動和捏合手勢會照常捲動或縮放其周圍的頁面。  
取得焦點後，滾輪會平移圖表，`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac) 和捏合手勢會縮放圖表，而 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 會開啟對文件的搜尋，其中 `#` 找資料表，`@` 找欄位，`:` 找註解或備忘錄。  
無論框架是否有焦點，拖曳都會平移圖表，而點擊或輕觸會點亮關聯：所點選之資料表的關聯，或所點選的那一條關聯。指標停留的資料表會點亮它自己的關聯。每個按鍵請參閱[焦點與按鍵](../../api/erd-viewer-element.md#focus-and-keys)。

若要在較大的圖表上試用縮放和搜尋，請在單獨的頁面中開啟 [bookstore 範例](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json)，它有九個資料表和兩個資料表群組。

## 分析 {#analytics}

erd-editor.io 以 Google Analytics 計算框架的造訪次數，如同計算網頁應用程式的造訪次數。它為框架所記錄的位址只有 `erd-editor.io/embed`，不含 `src` 所指定的文件位址。  
請參閱[隱私權政策](https://erd-editor.io/privacy)。

## 自行載入檢視器 {#loading-the-viewer-yourself}

可以載入 script 的頁面，可以改用 `@dineug/erd-editor` 套件中的 [`<erd-viewer>`](../../api/erd-viewer-element.md) 元素來顯示圖表。它以屬性和方法接受相同的選項，不會向 erd-editor.io 發出任何請求，並且可以從頁面自己的網站載入文件，這不需要 CORS。
