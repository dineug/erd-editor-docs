---
sidebar_position: 1
description: 使用 getSharedStore 在執行個體之間轉送編輯器的變更，以 runtimeValue 和存放區的暫存器初始化加入的編輯器，裁定同一時刻進行的編輯，並顯示每位協作者的游標、焦點、選取範圍和拖曳框。
---

# 協作編輯

`getSharedStore()` 會將編輯器變成協作工作階段中的一個節點。  
它會將每項變更以動作串流的形式送出，並套用其他編輯器傳回的動作：編輯器之間的傳輸方式（WebSocket、WebRTC，或任何其他能傳送 JSON 的方式）由您自行提供。  
它是 [ErdEditorElement](../erd-editor-element.md) 的方法之一，當轉送的變更也必須儲存時，可與[遠端儲存](./remote-storage.md)搭配使用。  
自 `5.1.0` 起，若要透過 Yjs 文件及其任何提供者共用圖表，而不是自行串接傳輸方式，請以 `@dineug/erd-editor-yjs` 繫結編輯器；請參閱 [Yjs](./yjs.md)。

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` 並未以名稱匯出這些型別。TypeScript 程式碼可透過 `ErdEditorElement` 取得它們，例如 `ReturnType<ErdEditorElement['getSharedStore']>`。

動作是描述文件中一項變更的可序列化一般物件，因此在送往傳輸方式的途中能完整通過 `JSON.stringify`。  
動作會以批次送達：`subscribe` 會交給您一個陣列，而該陣列就是一個單位，要整個轉送，並在另一端整個分派。  
請將動作視為不透明的值並原樣傳遞，而不要讀取或改寫它，因為它所攜帶的內部記錄資訊（例如它的[版本](#concurrent-edits)）正是讓各編輯器保持同步的依據。

編輯器所做的部分操作只會留在該編輯器上。  
將資料表、備忘錄或資料表群組移到最前面（選取其中之一時就會如此）不會送出。  
同樣不會送出的還有「[結構描述 SQL](../../guide/guides/schema-sql.md)」索引標籤中 `Statements`、`Header`、`Write logical names into empty comments`（自 `4.2.0` 起）和 `Tables` 的選擇，這些選擇屬於做出選擇的那個視窗。  
自 `4.1.0` 起，[物件總管](../../guide/guides/explorer.md)也只會留在其所屬的編輯器上：它是否開啟、它的寬度、摺疊的列、鍵盤所在的列、樹狀結構的捲動位置，以及它的搜尋和選項，都不會送出。  
前往外鍵時為其關聯的連接線加上的[亮顯](../../guide/guides/relationship-editing.md#reading-a-connector)也不會送出。  
自 `4.2.0` 起，[字典](../../guide/guides/dictionary.md)索引標籤也只會留在其所屬的編輯器上：顯示的是哪一個工作表，以及每個工作表的搜尋、選取範圍、捲動位置和欄寬，都不會送出。它的編輯、排序和匯入 CSV 則會送出。  
捲動、縮放或索引標籤切換會送出，但絕不會移動其他使用者的檢視或索引標籤。這也包括從物件總管跳至目標時產生的捲動、從其他索引標籤開啟物件總管時切換到 ERD 索引標籤的動作，以及從「字典」索引標籤的 [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) 工作表跳至資料表或欄位時的索引標籤切換和捲動。從該工作表跳至詞彙、術語或定義域時會停留在「字典」索引標籤上，因此這類跳至目標的操作完全不會送出。

自 `4.2.0` 起，[名稱顯示](../../guide/guides/logical-names.md#switching-the-view)的切換也會送出，而其[鎖定](../../guide/guides/settings.md#lock)決定其他編輯器如何處理它。在新的圖表中，以及在 `4.2.0` 之前的任何文件中，`Name View` 鎖定都是開啟的。  
鎖定開啟期間，切換只會顯示在做出切換的編輯器上：切換仍會送出，但其他每個編輯器和每個複本都會捨棄它，因此每位使用者都可以檢視不同的顯示方式，而 `value` 會保留鎖定的顯示方式。  
鎖定關閉期間，在可編輯的編輯器中做出的切換會變更每個編輯器和複本上的「名稱顯示」，以最後一次切換為準，而且它們每一個都會儲存該設定。  
唯讀編輯器自身的切換一律只會留在該編輯器上，而該編輯器仍會跟隨其他編輯器共用的切換。

自 `5.1.0` 起，[程式碼產生器](../../guide/guides/code-generator.md)的語言、資料表名稱大小寫、欄位名稱大小寫或引號類型的變更，同樣依各自的鎖定（`Language`、`Table Name Case`、`Column Name Case` 或 `Bracket Type`）處理，只有一點不同：鎖定開啟期間，變更完全不會送出。  
它只會顯示在做出變更的編輯器上，該編輯器的「程式碼產生器」和「結構描述 SQL」索引標籤會跟隨它，其他編輯器和複本都看不到。`value` 和 `runtimeValue` 保留鎖定的值，因此從任何編輯器初始化的加入者也看不到它，而鎖定開啟期間，每位使用者都可以查看不同的語言、名稱大小寫或引號類型。  
鎖定關閉期間，在可編輯的編輯器中做出的變更會標記為共用（其承載中的 `shared: true`）後送出。它會變更每個編輯器和複本上的該項設定，以最後一次變更為準，而且它們每一個都會儲存該設定。`5.1.0` 的編輯器或複本無論自身鎖定為何，都會套用標記過的變更，因此解除鎖定之後立即做出的變更會在每處生效，即使它先於解除鎖定送達也一樣。  
`5.1.0` 之前，這類變更無論其鎖定是否開啟都會送達每個編輯器和複本，而檔案保存的是鎖定的值。

自 `5.0.0` 起，[唯讀](../erd-editor-element.md#readonly)編輯器完全不會送出任何變更。其讀者所變更的捲動、縮放、索引標籤、名稱顯示、資料庫、程式碼產生器語言、名稱大小寫、引號類型和 `View Option` 各列，無論其鎖定為何，都只會留在它的畫面上；在 `5.0.0` 之前，其捲動、縮放、索引標籤切換、資料庫和程式碼設定會像可編輯的編輯器一樣送出。  
它的存放區仍會送出其追蹤器所送出的讀者游標、焦點、選取範圍和拖曳框，回應加入的編輯器所要求的暫存器，並套用其他編輯器送來的每一項變更。資料庫、程式碼產生器設定或 `View Option` 列的變更會送達它的文件，也會送達它的畫面（除非其讀者已在該處變更了該設定），而共用的「名稱顯示」切換無論如何都會顯示在它的畫面上。自 `5.1.0` 起，只有在該程式碼產生器設定是於鎖定關閉時變更，或由解除鎖定帶來時，它才會收到。  
編輯器轉為唯讀時，會先送出存放區對拖曳或捲動仍保留未送的部分，如同 [flushStreamBuffers](#flushstreambuffers) 所做的，讓其他編輯器保有最後的內容。

[鎖定](../../guide/guides/settings.md#lock)是共用的：每個編輯器都以對某項設定最後一次的鎖定或解除鎖定為準，而鎖定會攜帶開啟它的那個編輯器上的值，因此每個編輯器和複本都會儲存相同的值。  
因此，`Viewport` 鎖定會儲存開啟它的那個編輯器的檢視，而 `Canvas Type` 鎖定會儲存該編輯器在切換到「設定」索引標籤（鎖定就是在此開啟）之前所在的最後一個索引標籤。  
關閉 `Language`、`Table Name Case`、`Column Name Case`、`Bracket Type` 鎖定，或自 `4.2.0` 起的 `Name View` 鎖定時，也會將每個編輯器上的該項設定改為關閉它的那個編輯器上所顯示的值（包括它在鎖定下自己所做的變更），因此各編輯器仍會儲存同一個值。關閉 `Viewport` 或 `Canvas Type` 的鎖定不會移動任何人的檢視或索引標籤。

對 `Before tables` 或 `After tables` 指令碼的編輯，會在其輸入框失去焦點時整個送出。這兩個指令碼的結果會分別裁定，因此協作者對其中一個的編輯絕不會覆寫另一個。

在「視覺化」索引標籤的[流程模式](../../guide/guides/visualization.md#flow-never-edits-the-document)中所做的任何操作都不是文件變更，因此處於流程模式的編輯器不會向其他編輯器送出任何變更，而其他編輯器送來的變更在它處於該模式期間仍會持續套用。  
例外有兩個。離開流程模式前往其他索引標籤是一次索引標籤切換，會像其他切換一樣送出。自 `4.2.0` 起，在流程模式工具列的「名稱顯示」清單中所做的選擇是一次「名稱顯示」切換，會像在畫布上所做的切換一樣送出並套用。  
在流程模式中用來[逐步瀏覽各個檢視](../../guide/guides/visualization.md#previous-table-and-next-table)的 `Previous table`、`Next table`，以及復原和重做按鍵，都不會送出。  
外部連結卡片按鈕、在 `#`、`@` 或 `:` 之後選擇的[快速搜尋](../../guide/guides/quick-search.md#searching-the-diagram)結果，以及開啟[物件總管](../../guide/guides/explorer.md#opening-and-closing)，都會離開流程模式並前往 ERD 索引標籤。卡片按鈕或快速搜尋結果在那裡產生的捲動也會送出。

## 同一頁面中的兩個編輯器 {#two-editors-on-one-page}

這裡從訂閱到分派的串接代替了網路，因此可以在沒有傳輸方式干擾的情況下看出工作階段的結構。

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

這裡的兩個編輯器都從同一份新的空白文件開始，因此兩者都不需要初始化。  
有三個或更多編輯器時，要將每個編輯器的批次送給其他每一個編輯器：編輯器絕不會轉傳它所收到的內容。

## 初始化協作者 {#seeding-a-collaborator}

共用存放區會在變更發生時轉送變更，但絕不會把文件目前的狀態交給加入者，因此對於加入進行中工作階段的編輯器，必須先將文件交給它。  
自 `4.0.0` 起，請以工作階段中既有編輯器的 [`runtimeValue`](../erd-editor-element.md#runtimevalue) 將它初始化，而不是使用 `value` 或已儲存的檔案。  
以 [`@dineug/erd-editor-yjs`](./yjs.md) 繫結的房間，在有用戶端[初始化](./yjs.md#seeding-a-room)之後會自行保存文件，因此繫結到該房間的每個編輯器都會開啟該文件，無需交付任何 `runtimeValue`。

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

執行階段值仍保有自文件開啟以來已移除的內容，因此當另一個編輯器之後復原某次移除時，加入者會將該資料表連同其名稱和欄位一起還原。  
[`value`](../erd-editor-element.md#value) 是檔案所保存的形式，不含已移除的實體，因此以它或以檔案初始化的加入者，還原出來的反而會是一個沒有名稱的空白資料表。  
自 `4.2.0` 起，從[字典](../../guide/guides/dictionary.md)工作表移除的詞彙、術語或定義域也是如此：當另一個編輯器復原該次移除時，以 `runtimeValue` 初始化的加入者會再次完整列出該列，而以 `value` 初始化的加入者則會列出一個空的列，隨後它自己的 `value` 會省略該列。  
請繼續將 `value` 寫入儲存空間：`runtimeValue` 只用於初始化另一個編輯器、第二個檢視或 [replicationStore](./remote-storage.md)。  
VS Code、Obsidian、JetBrains IDE 和網頁應用程式中的編輯器，就是以這種方式初始化已開啟文件的第二個檢視。

`setInitialValue` 不會被轉送，因此初始化加入者不會改變其他編輯器上的任何內容。  
自 `4.0.0` 起，它也會捨棄該編輯器的協作暫存器，這些暫存器用來裁定[同時進行的編輯](#concurrent-edits)。如果該編輯器的共用存放區已經有過訂閱者，存放區會像第一次 [subscribe](#subscribe) 時一樣，再次向其他編輯器索取它們的暫存器，因此在工作階段中途重新載入的編輯器，會以與其他編輯器相同的方式裁定編輯。  
指派 `value` 會保留這些暫存器，但與 `setInitialValue` 不同，它會被轉送：一旦該編輯器有了共用存放區，工作階段中的每個編輯器都會載入所指派的文件，因此請勿以這種方式初始化加入者。

`value` 和 `runtimeValue` 都不含暫存器，也不含編輯器的時鐘已達到的版本，因此僅以 `runtimeValue` 初始化的加入者，會從工作階段中的編輯器對其第一次訂閱所送出的回應取得它們。  
在該回應送達之前，加入者所做的編輯可能帶有比其他編輯器所持更低的版本，因此其他編輯器會拒絕它，而它只留在加入者身上；仍在途中的較舊寫入也會覆寫初始化內容中較新的寫入。若沒有任何執行中的編輯器回應（例如由伺服器或文件儲存空間保存工作階段的文件時），加入者就永遠無法取得它們。  
自 `5.1.0` 起，請將它們與值一併交付。在工作階段中的某個編輯器上，先呼叫 [`flushStreamBuffers()`](#flushstreambuffers)，讓它仍保留的拖曳或顏色變更先送出，然後在同一時刻讀取 `runtimeValue`，以及其存放區的 [`getLWW()`](#getlww) 和 [`getVersion()`](#getversion)。加入者以 `setInitialValue` 載入該值，再以其自身存放區的 [`mergeLWW`](#mergelww) 取得其餘內容，順序不可對調，因為每次 `setInitialValue` 都會捨棄暫存器。這樣它的下一次編輯所帶的版本就會超過初始化內容所含的每一個版本，因此不必等待任何回應就能生效。對於已存在的存放區，[`reseed`](#reseed) 可一次呼叫完成兩者。

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

以這種方式保留、用來開啟之後加入者的初始化內容，會將這三者一併保存。它不是檔案：寫入儲存空間的仍是 `value`。  
[replicationStore](./remote-storage.md#runtimevalue-getter) 不會交付任何暫存器，因此以其 `runtimeValue` 初始化的加入者，仍會從編輯器的回應取得它們。

## 同時進行的編輯 {#concurrent-edits}

每個編輯器和複本都會為每個名稱和幾乎所有其他欄位，保存設定它的那次寫入的版本：這些就是它的協作暫存器。只有當寫入的版本不低於所持版本時，該寫入才會生效，因此以不同順序收到相同變更的編輯器，最終會得到相同的文件。  
自 `5.1.0` 起，每個版本在其計數器之下，都帶有寫入編輯器自己的槽位，取自該編輯器的 id。因此版本以 4,194,304 為單位增加，計數器達到 512 時就會超出 32 位元整數。`JSON.stringify` 和 `JSON.parse` 會完整保留它們，但以其他語言解析它們的轉送端或存放區，必須將它們保存為 64 位元數字，絕不可存成 32 位元整數。

自 `5.1.0` 起，兩個編輯器在同一時刻變更同一個名稱或欄位時（下列例外除外），每個編輯器和複本上都會得到相同的值：即使以相同的計數器值寫入，它們也會標上兩個不同的版本，而較大的那個在各處勝出。`5.1.0` 之前，兩者可能標上同一個版本，而每個編輯器保留它最後收到的那個，因此最終可能不一致。兩個編輯器共用同一槽位的機率是每一對 1 比 4,194,304，此時它們仍會像以前一樣平手。

自 `5.1.0` 起，資料表的位置、備忘錄或資料表群組的位置和大小，以及檢視的原點和縮放比例，都以同樣方式取得版本，而移動它們的操作會以其終點送出：

- 拖曳會對每個移動的實體各送出一個 `table.moveTo`、`memo.moveTo` 或 `tableGroup.moveTo`，放在同一個批次中，因此拖曳群組時，資料表的點，以及自 `5.1.1` 起備忘錄的點，會與群組的點一併送出；
- 拖曳的復原或重做，以它將每個實體放到的點送出；
- 平移以 `settings.scrollTo` 送出，縮放以 `settings.changeZoomLevel` 送出；
- 備忘錄或資料表群組的調整大小，以其位置和大小一併送出。

因此，兩位使用者在同一時刻對同一個資料表、備忘錄或資料表群組進行移動，或移動並調整大小時，在每個編輯器和複本上，它最終都會位於同一個點，並有相同的大小。該點歸版本較大的寫入所有，兩個軸一起。移動不會寫入大小，因此即使同時進行的移動取得了該點，調整大小仍會保留它的大小。  
`5.1.0` 之前，拖曳是以移動的距離送出，因此對同一個資料表的兩次拖曳會相加，而對同一個備忘錄或資料表群組同時進行的移動和調整大小，最終可能不一致。  
不到 20 px 的拖曳不會留下復原步驟，但與其他拖曳一樣送出，因此以點的形式送出時，它可能覆寫另一位使用者在同一時刻對同一實體所做的拖曳。傳輸方式重複遞送兩次的拖曳、平移或縮放批次，不會移動兩次。

顏色變更是一個例外。它不帶版本送出，每個編輯器和複本以自己的版本標記它，並保留最後收到的顏色，因此兩位使用者在同一時刻為同一個資料表、備忘錄或資料表群組變更顏色，最終可能得到不同的顏色。  
少數變更完全不帶版本，因此每個編輯器和複本依收到的順序套用它們，同一時刻進行的兩個變更也可能最終不一致：在資料表或索引內移動欄位（`column.move`、`indexColumn.move`），以及變更[資料庫](../../guide/guides/table-related-functions.md#databases)、[`View Option`](../../guide/guides/table-related-functions.md#table-view-options) 列，或「[設定](../../guide/guides/settings.md)」索引標籤的 `Relationship DataType Sync`、`Maximum comment width` 或 `Column Order`。  
兩位使用者在同一時刻新增的實體，例如兩個資料表或同一資料表的兩個欄位，在每個編輯器和複本上也可能排列順序不同，而各自的 `value` 會儲存自己的順序。

以上全部適用於 `5.1.0` 或更新版本的編輯器和複本之間；較舊版本會帶來什麼改變，請參閱[混用不同版本](#mixing-releases)。

## 混用不同版本 {#mixing-releases}

編輯器只會套用其本身版本所認得的動作類型，因此在混用不同版本的工作階段中，較舊的編輯器會錯過透過較新類型傳遞的任何內容。

自 `3.10.0` 起，對關聯的 [ON DELETE 或 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) 所做的變更，會以 `relationship.changeOnDelete` 和 `relationship.changeOnUpdate` 這兩種新動作類型之一傳遞，而 `relationship.add` 可以同時攜帶這兩者。原樣傳遞動作的轉送端不需要為此做任何新的處理。  
`3.10.0` 之前的編輯器會忽略這些動作類型和屬性：它永遠不會得知關聯的 ON DELETE 或 ON UPDATE，由它儲存的文件也不含這兩者。較舊的編輯器所新增的關聯在送達時不含這兩者，因此兩者都從 `Not set` 開始。

`3.10.0` 編輯器送出的其他所有變更，都透過較舊編輯器已認得的動作類型傳遞。  
[尋找與取代](../../guide/guides/find-and-replace.md#replacing)中的 `Replace All` 會將其編輯作為一個批次送出，其中的重新命名、註解和備忘錄動作與手動編輯時送出的相同。`Alternate Key` 和 `Referential Actions` [檢視選項](../../guide/guides/table-related-functions.md#table-view-options)透過現有的 `settings.changeShow` 動作傳遞。

自 `4.0.0` 起，以下變更透過新的動作類型傳遞，而原樣傳遞動作的轉送端不需要為此做任何新的處理：

- [資料表群組](../../guide/guides/table-groups.md)的新增、移動、調整大小、重新命名、變更顏色或移除：`tableGroup.add`、`tableGroup.move`、`tableGroup.moveTo`、`tableGroup.resize`、`tableGroup.changeName`、`tableGroup.changeColor` 和 `tableGroup.remove`；資料表加入或離開群組：`table.changeGroup`；
- 對現有關聯在「[對應欄位](../../guide/guides/relationship-editing.md#map-columns)」中執行的 `Save`，它會一次設定該關聯的兩份欄位清單：`relationship.changeColumns`；
- [鎖定](../../guide/guides/settings.md#lock)的開啟或關閉：`settings.changeLockSettings`；
- 對「[結構描述 SQL](../../guide/guides/schema-sql.md)」索引標籤中 `Before tables` 或 `After tables` 指令碼的編輯：`settings.changeDDLScript`。

`Table Groups` 和 `Memos` 檢視選項透過現有的 `settings.changeShow` 動作傳遞。  
在鎖定取代 `Save Scroll Information` 和 `Save Zoom Information` 開關之前由這兩個開關送出的 `settings.changeIgnoreSaveSettings` 已不再送出，而 `settings.changeRelationshipOptimization` 已經移除。收到其中任一個動作的 `4.0.0` 編輯器不會變更任何內容。

`4.0.0` 之前的編輯器會忽略這些新的動作類型：它永遠看不到資料表群組，也不知道哪些資料表屬於群組，不過拖曳群組時，群組中的資料表在它那裡仍會移動，因為拖曳群組也會送出其中每個資料表的移動。  
在「對應欄位」中執行 `Save` 之後，它仍會保留關聯原本的欄位，而當舊對應關係中的某個欄位在它那裡被移除時，該關聯會在每個編輯器上消失。它沒有鎖定，也沒有指令碼。  
由它儲存的文件不含上述任何內容，而 `4.0.0` 編輯器開啟這種文件時，所有鎖定都處於開啟狀態。  
工作階段中的每個編輯器，以及儲存其文件的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都應使用 `4.0.0` 或更新版本。

`4.1.0` 編輯器不會送出任何新的動作類型，因此 `4.0.0` 和 `4.1.0` 的編輯器與複本可以共用同一個工作階段，而不會錯過任何內容。  
它的[尋找與取代](../../guide/guides/find-and-replace.md#replacing)也會搜尋索引名稱和資料表群組名稱，而 `Replace` 和 `Replace All` 會透過 `4.0.0` 編輯器已會套用的 `index.changeName` 和 `tableGroup.changeName` 動作將其重新命名。

自 `4.2.0` 起，以下變更透過新的動作類型傳遞，而原樣傳遞動作的轉送端不需要為此做任何新的處理：

- 資料表或欄位的[邏輯名稱](../../guide/guides/logical-names.md)：`table.changeLogicalName` 和 `column.changeLogicalName`；其名稱是否[由字典產生](../../guide/guides/dictionary.md#deriving-physical-names)：`table.changeNameDerived` 和 `column.changeNameDerived`；
- 欄位連結到[定義域](../../guide/guides/dictionary.md#domains-and-data-types)或解除連結：`column.changeDomain`；
- 在[字典](../../guide/guides/dictionary.md)索引標籤上新增、變更（包括排序所設定的它在工作表中的位置）或移除詞彙、術語或定義域：`dictionary.add`、`dictionary.update` 和 `dictionary.remove`；
- [名稱顯示](../../guide/guides/logical-names.md#switching-the-view)的切換：`settings.changeNameViewMode`。

`Name View` 鎖定透過現有的 `settings.changeLockSettings` 動作傳遞，`Domain` 檢視選項透過 `settings.changeShow` 傳遞，而在[欄位順序](../../guide/guides/settings.md#adjusting-column-order)中移動 `Logical Name` 或 `Domain` 則透過 `settings.changeColumnOrder` 傳遞。  
從 `Import` 匯入結構描述 SQL、GraphQL、DBML 或 AML 時，其 `editor.clear` 和 `editor.loadJson` 會攜帶 `keepDictionaries: true`，以保留每個編輯器上的詞彙、術語和定義域。以取代方式呼叫的 [setSchemaSQL](../erd-editor-element.md#setschemasql)、`setSchemaGraphQL`、`setSchemaDBML` 或 `setSchemaAML` 所送出的這兩個動作也是如此。  
字典產生的物理名稱透過 `table.changeName` 或 `column.changeName` 傳遞，而定義域賦予其欄位的資料類型則透過 `column.changeDataType` 傳遞，這些正是手動編輯時送出的動作。

`4.2.0` 之前的編輯器會忽略這些新的動作類型：它沒有邏輯名稱、定義域連結、字典或「名稱顯示」。`Name View` 的鎖定或解除鎖定在它那裡不會變更任何內容，在欄位順序中移動 `Logical Name` 或 `Domain`，或將其他項目移到其中任一個的位置上，也同樣不會。從「字典」索引標籤前往「設定」索引標籤的編輯器所開啟的 `Canvas Type` 鎖定也是如此：較舊的編輯器不認得該索引標籤，因此會讓 `Canvas Type` 保持解除鎖定。它仍會顯示字典產生的物理名稱和定義域賦予的資料類型。  
它自己的編輯對邏輯名稱、定義域或字典一無所知，因而對較新的編輯器產生以下影響：

- 它手動重新命名的資料表或欄位，其名稱仍會標示為由字典產生，因此之後在較新的編輯器上為其撰寫的邏輯名稱，可能會重新產生名稱，取代它所輸入的名稱。
- 它為連結到定義域的欄位設定的資料類型會保留該連結，因此 `Checks` 工作表會列出 `Domain type mismatch`，而定義域下一次變更類型時，會再次將定義域的類型賦予該欄位。
- 它新增的關聯，其外鍵欄位不會從其鍵取得邏輯名稱或定義域。
- 它貼上或建立副本的資料表在送達時不含邏輯名稱或定義域連結。
- 在它上面匯入結構描述 SQL、GraphQL、DBML 或 AML 時不會送出 `keepDictionaries`，因此會清空每個編輯器上的詞彙、術語和定義域。
- 它對載入、匯入或 `clear()` 的復原，會在每個編輯器上載入它自己的文件副本，而該副本不含邏輯名稱、定義域連結或字典。
- 該副本，以及在它上面匯入結構描述 SQL、GraphQL、DBML 或 AML 時所載入的文件，也會將每個編輯器上的 `Name View` 鎖定恢復成那個較舊的編輯器當初看到的狀態。之後每個編輯器都會將 `Physical Names` 儲存為「名稱顯示」，而若鎖定為關閉，也會顯示它。

由這種編輯器儲存的文件不含邏輯名稱、定義域連結、字典或「名稱顯示」，因此 `4.2.0` 編輯器會以 `Physical Names` 開啟它。不過較舊的編輯器確實會依其當初看到的狀態儲存 `Name View` 鎖定，因此在 `4.2.0` 編輯器中解除鎖定的文件仍會保持解除鎖定。  
工作階段中的每個編輯器，以及儲存其文件的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都應使用 `4.2.0` 或更新版本。

`5.1.0` 編輯器不會送出任何新的動作類型，因此 `5.1.0` 之前的編輯器和複本仍可與它共用工作階段，而原樣傳遞動作的轉送端不需要任何新的處理。不過，[同時進行的編輯](#concurrent-edits)所描述的內容，只在 `5.1.0` 的編輯器和複本之間成立：

- `5.1.0` 編輯器的拖曳，以點的形式透過 `table.moveTo`、`memo.moveTo` 和 `tableGroup.moveTo` 傳遞，較舊的編輯器本來就會套用這些動作；它的平移和縮放，則以點的形式透過 `settings.scrollTo` 和 `settings.changeZoomLevel` 傳遞，這兩者和所有平移與縮放一樣，沒有其他編輯器會套用，只有複本會接收。較舊的編輯器依拖曳的每個點送達的順序套用，不經過任何暫存器，較舊的複本對拖曳、平移或縮放的每個點也是如此，因此同時為同一實體或檢視送出的兩個點，在那裡可能最終不一致。
- 較舊編輯器的拖曳仍以移動的距離傳遞，每個編輯器和複本會在暫存器之外將它相加，而它的平移或縮放同樣是距離，每個複本以同樣方式相加。對同一實體同時做出的距離和點，在以不同順序收到它們的編輯器和複本上，可能最終不一致，而傳輸方式重複遞送兩次的距離會被加兩次。
- 在[同時進行的編輯](#concurrent-edits)所列的例外之外，`5.1.0` 編輯器對某個名稱或欄位的寫入，與較舊編輯器在同一時刻對它的寫入相比，幾乎總是勝出，且每個編輯器和複本得到的答案相同。兩個較舊的編輯器仍可能因同時寫入同一個欄位而最終不一致。
- `5.1.0` 編輯器只在鎖定關閉期間才會送出程式碼產生器的語言、名稱大小寫或引號類型變更，並附上 `shared: true` 標記，較舊的編輯器會忽略該標記，並像以前一樣套用變更。較舊的編輯器在鎖定下做出的變更仍會送出，且不帶標記：`5.1.0` 的編輯器或複本在該設定於其上被鎖定時會捨棄它，而較舊的編輯器會套用它。因此在鎖定下，較舊的編輯器會跟隨彼此的選擇，而 `5.1.0` 的編輯器保持自己的選擇，且無論哪種情況，檔案保存的都是鎖定的值。在任一版本上進行的解除鎖定，都會把解除鎖定者的值帶到每個編輯器和複本。
- 取代文件的載入（例如指派 `value`、`clear()` 或取代式匯入），會結束每個 `5.1.0` 編輯器上正在繪製的關聯線，包括做出該操作的編輯器和每個接收它的編輯器。較舊的編輯器在這之後仍保持繪製已啟動的狀態。

請讓工作階段中的每個編輯器，以及儲存其文件的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都使用 `5.1.0` 或更新版本，讓同一時刻進行的編輯在各處得到相同結果（[同時進行的編輯](#concurrent-edits)所列的例外除外）；要保留邏輯名稱和字典，仍需 `4.2.0` 或更新版本。`1.2.0` 之前的 [MCP 伺服器](../../mcp/live-and-headless.md#edits-made-at-the-same-moment)在這裡視為 `5.1.0` 之前的編輯器，而 `5.1.0` 之前的編輯器完全無法繫結到 [Yjs](./yjs.md) 房間。

自 `5.1.1` 起，備忘錄加入或離開[資料表群組](../../guide/guides/table-groups.md)時，會透過新的動作類型 `memo.changeGroup` 傳遞，而原樣傳遞動作的轉送端不需要為它做任何新的處理。下列情況會送出它：將備忘錄放入或移出群組、圍繞不屬於任何群組的顯示的備忘錄繪製新群組、選取備忘錄與資料表後使用 `Group selected tables`、選取範圍包含備忘錄時使用 `Remove from group`、被移除群組的每個備忘錄、程式碼代理程式透過 [MCP 伺服器](../../mcp/tools.md#table-groups)進行的備忘錄群組相關呼叫，以及上述每一項的復原和重做。群組中含有備忘錄的 `Import and Add` 或 `setSchemaJSON` 附加也會送出它，其重做同樣如此，而其復原只會移除這些備忘錄。

`5.1.1` 之前的編輯器或複本會忽略 `memo.changeGroup`，而且它的解析會捨棄每個備忘錄的 `groupId`，因此它永遠看不到群組中的備忘錄，不過 `5.1.1` 編輯器拖曳群組時，群組的備忘錄在該處仍會跟著移動，因為 `5.1.1` 編輯器也會為每個備忘錄送出一個 `memo.moveTo`。它自己的編輯對備忘錄的群組一無所知，對較新的編輯器造成下列影響：

- 它拖曳到群組方框中的備忘錄不會加入該群組，而它拖曳出方框的成員備忘錄仍留在群組中，方框會延展以容納它。
- 它拖曳群組，以及它的 `Auto Layout`，都會移動群組和群組的資料表，但讓群組的備忘錄留在原處，方框會延展以容納留在該處的顯示的備忘錄。
- 它的 `Import and Add` 不會將任何備忘錄放入所加入的群組中。
- 它移除群組時，該群組每個備忘錄的 `groupId` 仍會指向該群組：這些備忘錄會被讀作不屬於任何群組，而它對該移除的復原會將它們放回群組。
- 它對載入、匯入或 `clear()` 的復原，會在每個編輯器上載入它自己的文件副本，而該副本中沒有任何備忘錄屬於任何群組。

從這類編輯器儲存的文件中，沒有任何備忘錄屬於任何群組，不過 `4.0.0` 或更新版本的編輯器仍會保留資料表的群組。  
請讓工作階段中的每個編輯器，以及儲存其文件的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都使用 `5.1.1` 或更新版本，以讓備忘錄留在其資料表群組中；要裁定同一時刻進行的編輯，仍需 `5.1.0` 或更新版本。`1.2.1` 之前的 [MCP 伺服器](../../mcp/installation.md#updating)同樣既看不到、也不會保留備忘錄屬於哪個資料表群組。

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

設定在其他編輯器上顯示於此使用者滑鼠游標旁的暱稱。  
暱稱未提供或為空白時，其他使用者會看到 `user`。

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

將此使用者的滑鼠游標廣播到其他編輯器。預設為 `true`。  
其他使用者送來的游標一律會顯示在 ERD 畫布上。

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

廣播此使用者正在處理的內容。預設為 `true`。  
取得焦點的資料表和儲存格，選取的資料表、備忘錄和資料表群組，以及在畫布上拖曳的框，都會送到其他編輯器並在那裡繪製。  
每位使用者都有各自的顏色，因此可以加以區分：取得焦點的資料表會有外框，取得焦點的儲存格會有底線，選取的資料表、備忘錄和資料表群組周圍會有一圈框線，拖曳框則是虛線矩形。  
自 `4.2.0` 起，在其鎖定開啟期間，或唯讀編輯器自行切換之後，每位使用者看到的[名稱顯示](../../guide/guides/logical-names.md#collaborators)可能各不相同。若取得焦點的儲存格未在您的顯示方式中繪製，底線會畫在代替它繪製的儲存格上：名稱和邏輯名稱互為替代，資料類型和定義域也是如此。  
無論此選項是否開啟，從其他使用者送達的在線狀態一律會繪製在您的畫布上。  
在「視覺化」索引標籤的流程模式中，其他使用者的焦點和選取範圍會繪製在資料表卡片上，但他們的拖曳框不會。在那裡選取的資料表仍會送出；在那裡拖曳的框則不會。

```js
editor.getSharedStore({ focusTracker: false });
```

關閉這兩個追蹤器，即可將共用存放區當作不發佈自身在線狀態的單純轉送端使用。  
其他編輯器送來的在線狀態仍會接收並繪製。  
VS Code、Obsidian、JetBrains IDE 和 Google Drive 中的編輯器就是這麼做的。

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

游標、焦點、選取範圍和拖曳框與文件變更透過同一個串流傳遞，但它們是暫時性的。  
它們絕不會進入文件、復原歷程記錄或 `editor.value`，因此傳輸方式可以自由捨棄它們，而 replicationStore 會忽略它們。

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

這些方法會設定目前的連線狀態。  
中斷連線期間，變更會在內部緩衝。  
一旦可以再次傳送，緩衝的變更就會送給訂閱者。  
預設狀態為已連線（`connection`）。

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

將其他編輯器執行個體的變更套用到目前的編輯器執行個體。  
當批次中含有其他編輯器對暫存器的請求時（如加入者的第一次 [subscribe](#subscribe) 所送出的），存放區會透過其訂閱者回應它的暫存器和版本，除非它沒有任何暫存器。  
自 `5.1.0` 起，它會先送出仍保留的每個串流批次，如同 [flushStreamBuffers](#flushstreambuffers) 所做的，讓其回應所帶的每個版本，都建立在其他編輯器已收到的寫入之上。因此加入者的到來，會讓工作階段中的每個編輯器同時送出它仍保留的拖曳、平移、縮放、顏色變更或備忘錄調整大小。

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

訂閱編輯器中的變更。  
在至少有一個訂閱者之前，不會有任何內容離開編輯器，而在此之前所做的變更會被緩衝。  
第一次訂閱也會向其他編輯器索取它們的協作暫存器，這些暫存器用來裁定[同時進行的編輯](#concurrent-edits)，因此較晚加入者會以相同的方式裁定這些編輯。  
它不會帶來文件，因此要先[初始化](#seeding-a-collaborator)較晚加入者；自 `5.1.0` 起，初始化內容也可以攜帶暫存器。  
自 `4.0.0` 起，在第一次訂閱之後，每當 `setInitialValue`（或自 `5.1.0` 起的 [reseed](#reseed)）將文件載入其編輯器時，存放區都會再次索取。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

立即送出此存放區仍在保留的串流批次，而不是等到它們的靜止期過後才送出。  
自 `3.9.2` 起，它可用於由 `getSharedStore` 取得的存放區；在 `3.9.1` 中，此方法雖然存在於型別上，但不會有任何作用。  
移動資料表、備忘錄或資料表群組，變更其顏色，調整備忘錄大小，以及捲動或縮放檢視，每一項都是以由細小變更組成的串流進行的。調整資料表群組大小則不是：它只會在拖曳結束時送出一次。  
存放區會將每個串流彙集成一個批次並保留，直到該串流靜止 200ms 為止，分兩個階段進行。顏色變更或備忘錄調整大小會經過兩個階段，因此在最後一次變更後約 400ms 送出，`5.1.0` 之前的每個串流都是如此。自 `5.1.0` 起，拖曳、平移或縮放在第一階段之後送出，也就是最後一步之後約 200ms，以其終點的形式送出（請參閱[同時進行的編輯](#concurrent-edits)）。  
呼叫此方法會結束兩個階段中的這段等待。存放區處於連線狀態時，訂閱者會在呼叫傳回之前收到該批次。沒有任何保留內容時，呼叫不會送出任何東西。  
`destroy`（無論是存放區本身的還是編輯器的）會捨棄仍在保留中的批次，因此在釋放某個存放區、而其他編輯器應保有最後一次變更時（例如關閉分頁時），請先呼叫此方法。

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

自 `5.1.0` 起，傳回編輯器協作暫存器的副本（請參閱[同時進行的編輯](#concurrent-edits)）。  
副本是透過 JSON 製作的，因此是可直接交給 `JSON.stringify` 的一般物件，對它所做的變更不會影響存放區的暫存器。  
請原樣交給另一個存放區的 [mergeLWW](#mergelww) 或 [reseed](#reseed)。它的形狀是編輯器自己的，因此請勿讀取其中任何欄位。  
請在同一時刻將它與 [getVersion](#getversion) 和編輯器的 `runtimeValue` 一併讀取，以[初始化加入者](#seeding-a-collaborator)。

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

自 `5.1.0` 起，將另一個存放區以 [getLWW](#getlww) 交出的暫存器併入此存放區的暫存器，每個暫存器保留較大的版本，並將 `version` 併入編輯器的時鐘，時鐘會保留它自己的版本和所給版本中較大的那個。  
它不會變更文件中的任何內容：`value` 或 `runtimeValue` 沒有任何一個位元組改變，沒有復原步驟，也沒有 `change` 事件。它只會提高之後的寫入必須超過的版本，因此之後比所給暫存器更舊的寫入會被拒絕，而編輯器的下一次編輯所帶的版本會超過 `version`。  
它不會送出任何東西，也不會回應任何東西。它就是加入者的第一次訂閱從其他編輯器的回應所得到的內容，直接併入。  
請在 `setInitialValue` 之後呼叫，絕不可在之前：每次 `setInitialValue` 和每次 [reseed](#reseed) 都會捨棄所持有的暫存器，連同在它之前的 `mergeLWW` 所併入的內容。

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

自 `5.1.0` 起，傳回編輯器的時鐘已合併的最高版本：它所做或收進的變更的版本、加入時交換的暫存器請求和回應的版本，以及交給 `mergeLWW` 或 `reseed` 的每個 `version` 中最大的那個。  
游標、焦點、選取範圍和拖曳框，無論是它自己的還是其他編輯器的，都不會改變它。  
請將它與同一時刻讀取的 [getLWW()](#getlww) 一併交給加入者的 [mergeLWW](#mergelww) 或 [reseed](#reseed)。它和其動作所攜帶的版本一樣，是一個[版本](#concurrent-edits)。

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

自 `5.1.0` 起，立即移除具有所給 id 的編輯器所送出的游標、焦點、選取範圍和拖曳框，以及它們各自等待中的到期計時。其他每個編輯器的內容都會保留。  
該 id 是該編輯器的共用存放區所送出的每個動作所攜帶的 `meta.editorId`。對於此編輯器沒有保存任何內容的 id，不會有任何變更。  
當您的傳輸方式得知某個對等端已離開時，請呼叫它。否則該對等端送出的內容會一直顯示到到期為止：游標在收到最後一個之後 30 秒，焦點和選取範圍在 90 秒之後，拖曳框在 3 秒之後。

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

自 `5.1.0` 起，在編輯器中重新開啟工作階段的文件，如同重新加入一樣。[Yjs](./yjs.md) 繫結在繫結到已初始化的房間時，會呼叫它來開啟房間的文件，並在每次重新加入時再次呼叫，且在加入房間之後保留畫面。  
它如同 [setInitialValue](../erd-editor-element.md#setinitialvalue) 一樣載入 `value`，並如同 [mergeLWW](#mergelww) 一樣取用 `lww` 和 `version`，因此存放區接著恰好持有所給的暫存器，其時鐘則為它自己的版本和 `version` 中較大的那個。它也會清空復原歷程記錄，而且與 `setInitialValue` 不同的是，它會捨棄選取範圍和焦點，因為它們指名的內容可能已不在該值中。  
除了下方所述依邏輯名稱產生物理名稱的編輯之外，它不會產生復原步驟，不會發出 `change` 事件，也不會送出任何變更。存放區一旦有過訂閱者，它會送出每次這類載入都會送出的暫存器請求（已交出暫存器的傳輸方式可以捨棄它），並且在 [focusTracker](#focustracker) 開啟時，送出已清除的選取範圍和焦點。  
如同 `setInitialValue`，它在設定了 [readonly](../erd-editor-element.md#readonly) 時也能運作，會捨棄流程檢視，結束正在繪製的關聯線，並關閉備忘錄、資料表群組名稱和儲存格編輯器，保留或捨棄其中已輸入的內容的方式也相同；關閉中的邏輯名稱儲存格依其讀者所輸入的內容產生的名稱，屬於一般編輯：會送出、可復原，並以 `change` 事件發出。

未使用 `keepScreen` 時，畫面顯示值所保存的內容，如同 `setInitialValue` 之後。使用 `keepScreen: true` 時，讀者的畫面會重新疊回載入的文件上，且僅限該畫面：

- 捲動位置和縮放比例（元素已顯示過之後）；從未顯示過，或在隱藏時載入且之後未顯示過的，會在該值所放置的位置開啟，如同較晚加入者；
- 索引標籤（當載入移動了它時），以及在「設定」索引標籤上，還有讀者來自的索引標籤，在該處開啟的 `Canvas Type` 鎖定會指名它；
- 讀者在其鎖定下自行顯示的「名稱顯示」和每項程式碼產生器設定，但只限該鎖定在載入之前已開啟、在載入之後仍開啟，且保持相同鎖定值的情況。因此當對等端在這段期間解除鎖定、變更並以另一個值再次鎖定某項設定時，編輯器會以新的鎖定值開啟；而鎖定在載入之前或之後為關閉時，它顯示的是載入的值；
- 唯讀的讀者在自己的畫面上變更的每項設定，無論鎖定為何。

這些都不會送出，而 `value` 和 `runtimeValue` 仍會回報載入的文件。對等端之後的解除鎖定，會取代以這種方式保留的程式碼設定，如同任何解除鎖定。  
讀者在編輯器可編輯時所做的下一次捲動或縮放，會讓保留的捲動位置和縮放比例再次成為文件的內容，並以畫面目前所在位置為首送出，因此複本也會採用該縮放。

`reseed` 不會更動存放區所保留的內容。仍在保留的拖曳、平移或縮放會在它之後送出，取自重新初始化後的文件；顏色變更或備忘錄調整大小會照做出時的樣子送出，即使編輯器已不再顯示它；`disconnect()` 所保留的內容會在 `connection()` 時送出。  
因此請先呼叫 [flushStreamBuffers](#flushstreambuffers)，送出它所發出的內容，再以含有這些內容的值呼叫 `reseed`。切勿在中斷連線期間呼叫 `reseed`。

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

完全銷毀 sharedStore 執行個體。  
編輯器本身不受影響，因此離開工作階段後，文件仍可編輯。  
一旦編輯器所提供的最後一個 sharedStore 被銷毀，滑鼠與焦點追蹤器就會停止。  
存放區仍在保留的串流批次會隨之一併捨棄；若要送出該批次，請先呼叫 [flushStreamBuffers](#flushstreambuffers)。  
其他編輯器送出的游標、焦點、選取範圍和拖曳框會一直顯示到到期為止；自 `5.1.0` 起，[forgetPeer](#forgetpeer) 可立即移除某個編輯器的這些內容。

```js
sharedStore.destroy();
```
