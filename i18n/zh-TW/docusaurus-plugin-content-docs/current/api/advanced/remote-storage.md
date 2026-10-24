---
sidebar_position: 2
description: 在主執行緒之外將執行中的編輯器複寫到無介面存放區，並將文件序列化以供儲存。
---

# 遠端儲存

每次變更都傳送整個編輯器狀態，效率不佳。  
針對這種情況，編輯器提供了用於即時資料複寫的 API。

## 安裝 {#installation}

```sh
npm install @dineug/erd-editor
```

複寫存放區位於 `@dineug/erd-editor/engine.js` 子路徑，而非套件根目錄。  
該進入點完全不存取 DOM，因此可以在 Web Worker 或主執行緒之外的任何其他地方執行。  
若改為匯入套件根目錄，則會註冊 `<erd-editor>` 自訂元素，而該元素需要 DOM 文件。

## 使用方式 {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## 複寫執行中的編輯器 {#replicating-a-live-editor}

這些動作來自執行中編輯器的共用存放區。  
請參閱[協作編輯](./collaborative-editing.md)。

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

跨越邊界的只有變更本身，絕不會是整份文件。  
複本會在自己這一端套用該變更，並將結果序列化。  
`change` 會以 `value` 提供該結果，而 `changed` 會指出何時值得寫入。

自 `4.0.0` 起，請如上例以編輯器的 `runtimeValue` 初始化複本，而不是以儲存的檔案或編輯器的 `value` 初始化。  
檔案缺少儲存之後所做的編輯，而 `value` 缺少在工作階段中移除的實體。  
以不含某個已移除資料表的內容初始化的複本，在某個編輯器復原該移除時，會帶回一個沒有名稱和欄位的資料表，並照此儲存。  
自 `4.2.0` 起，從[字典](../../guide/guides/dictionary.md)工作表移除的詞彙、術語或定義域也是如此。  
當某個編輯器復原該次移除時，以不含該列的內容初始化的複本會再次列出該列，但內容是空的，而由於 `value` 會省略空的列，複本儲存的文件中便不含該列。  
若是定義域，曾連結到它的欄位和術語在該複本中也會維持未連結，因為該複本從未保有這些連結，而復原也不會送出它們。

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

以像素為單位測量字串。  
存放區沒有 DOM，因此無法自行測量文字，每當名稱、資料類型、預設值或註解變更時，它都會透過此函式重新計算欄位寬度。  
自 `4.2.0` 起，這也包括資料表或欄位的[邏輯名稱](../../guide/guides/logical-names.md)。  
每當欄位連結或解除連結定義域，以及每當該定義域被新增、重新命名或移除時，它都會測量欄位的定義域儲存格，該儲存格顯示欄位所連結的定義域名稱。  
每當 [setInitialValue](#setinitialvalue) 載入文件時，它也會重新測量每個資料表和欄位。  
自 `4.0.0` 起，寬度只保留在 [runtimeValue](#runtimevalue-getter) 中，絕不會出現在 `value` 中。  
因此，由此版本儲存的文件，不論是在何處儲存、當地的文字測量結果如何，讀回後都會得到逐位元組相同的 `value`。

依照編輯器的方式測量：使用編輯器字型堆疊中的 `400 12px`，四捨五入後再加上 2px 的內距。  
否則 `runtimeValue` 中的寬度會與螢幕上的寬度產生偏差。

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` 是沒有可用的 canvas 時的後備方案。  
對於文件只會被儲存、從不轉譯的存放區而言，這樣就足夠了。

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

序列化目前的編輯器狀態。  
傳回可直接原樣儲存的 JSON 字串，而非已剖析的物件。

```js
const data = replicationStore.value;
```

自 `4.0.0` 起，`value` 是儲存形式：也就是文件在檔案中的樣貌，與元素的 [value](../erd-editor-element.md#value) 傳回的文字相同。  
它只包含現存的實體，並依固定順序排列，不包含已移除的實體、堆疊順序，或任何在載入時會重新推算的內容，例如 [toWidth](#towidth) 測量的寬度。  
自 `4.2.0` 起，它也包含邏輯名稱、每個名稱是否由字典產生、定義域連結，以及[字典](../../guide/guides/dictionary.md)索引標籤的詞彙、術語和定義域。  
自 `4.2.0` 起，它也會省略實體中每個空的文字屬性、每個沒有任何內容的 `doc` 清單和集合，以及在每個集合都為空時的 `collections` 本身。  
它以兩個空格縮排，每個字典列各自佔一行，並以換行字元結尾，因此同一份文件一律會產生相同的位元組。  
關於它包含的內容，請參閱[儲存形式與執行階段值](./schema.md#storage-form-and-runtime-value)。

[鎖定](../../guide/guides/settings.md#lock)為開啟的每項設定，都會以鎖定時的值寫出，其他所有設定則以目前的值寫出。  
`Viewport` 鎖定同時涵蓋檢視原點和縮放比例，而索引標籤、程式碼產生器的語言、兩種名稱大小寫和引號類型則各有自己的鎖定。  
自 `4.2.0` 起，[名稱顯示](../../guide/guides/logical-names.md#name-view)也有自己的鎖定，也就是在新文件中為開啟的 `Name View` 鎖定。  
這些鎖定取代了文件的 `ignoreSaveSettings`，後者自 `4.0.0` 起既不會被讀取，也不會被寫入。  
在 `4.0.0` 之前，`value` 是存放區所保存的整份文件，並套用了 `ignoreSaveSettings` 中的捲動與縮放位元。

### runtimeValue getter {#runtimevalue-getter}

自 `4.0.0` 起，依複本所保存的樣貌序列化文件，包括已移除的實體和載入時推算出的所有內容。  
每項已鎖定的設定在這裡同樣會以其鎖定的值寫出。

```js
const snapshot = replicationStore.runtimeValue;
```

將它傳給稍後加入的編輯器或另一個存放區的 `setInitialValue`，以初始化對方；請參閱[協作編輯](./collaborative-editing.md)。  
請勿將它儲存為檔案：它帶有已移除的實體，且已發佈的 [JSON Schema](./schema.md#json-schema) 會拒絕它。  
正因為有這些已移除的實體，稍後傳來的移除復原，才能在以它初始化的存放區中將該實體完整帶回。  
它們會一直保留，直到下次從檔案開啟該文件為止，因為檔案的形式不包含它們。

### setInitialValue {#setinitialvalue}

載入先前儲存的編輯器狀態。

```js
replicationStore.setInitialValue('json...');
```

它接受儲存形式、執行階段值，或較早版本儲存的文件（包括 v2 文件）。  
空白字串或任何非字串的值，都會載入一份新的空白文件，而不會引發錯誤。  
從未獲得任何值的存放區，也會以同樣的新文件開始。  
自 `4.0.0` 起，該文件的每個[鎖定](../../guide/guides/settings.md#lock)都為開啟，因此在它所複寫的編輯器捲動、縮放、切換索引標籤或變更這些設定時，其 `value` 會保留開始時的檢視、索引標籤、程式碼產生器的語言、名稱大小寫和引號類型。在 `3.10.0` 中，它既不會儲存捲動位置，也不會儲存縮放比例，而在那之前兩者都會儲存。  
自 `4.2.0` 起，在編輯器切換其「名稱顯示」時，它也會保留自己的「名稱顯示」，也就是 `Physical Names`。  
已儲存的文件會保留其中指定的鎖定。  
未指定任何鎖定的文件（也就是在 `4.0.0` 之前儲存的任何文件，包括 v2 文件）載入時每個鎖定都為開啟：不論它儲存了什麼，其檢視原點都為 `0, 0`、縮放比例為 `1`、索引標籤為 ERD，而其程式碼產生器的語言、名稱大小寫和引號類型則維持儲存時的設定。  
在 `4.2.0` 之前儲存的文件不會指定 `Name View` 鎖定，因此載入時該鎖定為開啟，且顯示方式為 `Physical Names`，即使是儲存時其他所有鎖定都為關閉的文件也是如此。  
自 `4.0.0` 起，`setInitialValue` 也會捨棄為前一份文件保留的協作暫存器，與元素的 [setInitialValue](../erd-editor-element.md#setinitialvalue) 相同。  
不是 JSON 的文字（例如殘留合併衝突標記的檔案）同樣不會引發錯誤：剖析錯誤只會記錄到主控台，文件會被清空，而設定則維持原樣。

自 `4.0.0` 起，載入時不會執行垃圾回收，因此已移除的實體會保留在 [runtimeValue](#runtimevalue-getter) 中。  
在此之前，載入時會捨棄不再出現在 `doc` 中、且已有四天以上未被變動的實體。

載入時的重寫會在 `setInitialValue` 傳回之前完成：欄位上的鍵標記，依每個欄位的選項和關聯讀出；每個資料表和欄位的寬度，以 `toWidth` 重新測量；每條連接線與其資料表相接的點；以及每個關聯的識別旗標和其父端的符號。  
這些都不屬於 `value`，但在呼叫後立即讀取的 `replicationStore.runtimeValue` 已包含了它們全部。  
緊接在載入之後到達的動作（例如重播的捲動），會以載入後的文件為基準來比較，因此載入本身絕不會被回報為 [`changed`](#onchange)。

載入本身和這些重寫都不會觸發 `change`。  
若要將載入的文件以儲存形式寫回，在 `setInitialValue` 傳回後自行讀取 `replicationStore.value` 即可。

### on@change {#onchange}

訂閱編輯器狀態的變更。

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` 會以 200ms 防彈跳，因此一連串密集的動作會合併為一次通知送達。  
它只會因可能變更文件的那類動作，以及較舊的編輯器可能仍會傳送的 `settings.changeIgnoreSaveSettings` 而觸發（請參閱 [dispatch, dispatchSync](#dispatch-dispatchsync)）。  
轉送的在線狀態動作或 `editor.mergeLWW` 絕不會喚醒它。  
呼叫傳回的函式即可取消訂閱。

自 `3.10.0` 起，監聽器會收到一個 `ReplicationChange`，這是 `@dineug/erd-editor/engine.js` 與 `ReplicationStore` 一併匯出的型別。  
在 `3.10.0` 之前，監聽器不會收到任何引數，而忽略該引數的監聽器仍可繼續運作。  
`value` 是以儲存形式序列化的文件，與當下 `replicationStore.value` 傳回的字串相同，因此不需要再次序列化。  
若自上一次 `change`（或自載入）以來的動作讓 `value` 逐位元組維持原樣，`changed` 即為 `false`。

被[鎖定](../../guide/guides/settings.md#lock)排除在 `value` 之外的變更仍會觸發 `change`，且 `changed` 為 `false`，因此只在 `changed` 為 `true` 時寫入。  
也就是 `Viewport` 鎖定時的捲動或縮放、`Canvas Type` 鎖定時的索引標籤切換，以及在各自的鎖定開啟時，對程式碼產生器的語言、某種名稱大小寫或引號類型的變更。  
自 `4.2.0` 起，`Name View` 鎖定時的「名稱顯示」切換也是如此：編輯器仍會送出它，但複本會像其他編輯器一樣捨棄它。  
在唯讀編輯器中做出的「名稱顯示」切換，無論其鎖定為何，都會以同樣的方式被捨棄。  
元素的 [change](../erd-editor-element.md#change) 事件會略過這類變更，但複本仍會回報它。  
在新文件和在 `4.0.0` 之前儲存的文件中，每個鎖定都為開啟，而在 `4.2.0` 之前儲存的任何文件中，`Name View` 都是鎖定的。  
`Viewport` 未鎖定時，捲動或縮放會變更 `value`；`Canvas Type` 未鎖定時，開啟編輯器的另一個索引標籤也會變更 `value`；而 `Name View` 未鎖定時，來自非唯讀編輯器的「名稱顯示」切換也會變更 `value`。  
開啟或關閉鎖定同樣會變更 `value`。

自 `4.0.0` 起，`changed` 比較的是儲存形式，其中既不包含已移除的實體，也不包含堆疊順序。  
因此，在一次 `change` 內新增後又移除的資料表、落在另一位協作者已移除之實體上的編輯，以及只變更堆疊順序的轉送載入，其結果的 `changed` 也都會是 `false`。  
自 `4.2.0` 起，新增到字典工作表後保持空白的列也是如此，因為儲存形式會省略沒有任何內容的列。

`changed` 絕不會與您儲存的檔案比較，因為該檔案在載入後就可能已與 `value` 不同：較早版本儲存的檔案（包括 v2 檔案）會如此，以位元組順序標記開頭的檔案和手動編輯過的檔案也會如此。  
自 `4.2.0` 起，這也包括由 `4.0.0` 或 `4.1.0` 儲存的檔案，因為 `value` 會省略這種檔案中實體的空文字屬性，以及其中空的 `doc` 清單和集合。  
若與這樣的檔案逐位元組比較，就連被鎖定排除在外的捲動也會被算作一次編輯。  
第一個 `changed` 為 `true` 的 `change`，會以儲存形式交回這樣的檔案，因此寫入它會將該檔案重寫一次。  
如 [toWidth](#towidth) 所述，由此版本儲存的檔案不論在何處儲存，都不會有差異。  
若 `setInitialValue` 在某個 `change` 尚未送出時執行，且在其到期前沒有分派任何動作，該 `change` 仍會送達，並帶有載入後的 `value`，且 `changed` 為 `false`。

### dispatch, dispatchSync {#dispatch-dispatchsync}

將遠端編輯器的變更套用到 replicationStore。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` 會延後到微任務中執行，而 `dispatchSync` 會立即套用該批次。

可以將共用存放區的動作串流不經篩選直接交給它們。  
這兩個方法只會保留可能變更文件的那類動作，以及本節末尾說明的兩種動作，並捨棄其餘動作，因此協作工作階段所帶有的在線狀態（每位使用者的滑鼠游標、焦點、選取範圍和拖曳框）通過時不會有任何作用。

自 `3.10.0` 起，保留的動作包括 `relationship.changeOnDelete` 和 `relationship.changeOnUpdate`，且 `relationship.add` 會帶有 `onDelete` 和 `onUpdate`。  
較早版本的存放區會捨棄這些動作並忽略這些屬性，因此會遺失關聯的 [ON DELETE 與 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) 動作。

自 `4.0.0` 起，保留的動作還包括 `table.changeGroup`、八個 `tableGroup` 動作中的七個（`tableGroup.add`、`tableGroup.move`、`tableGroup.moveTo`、`tableGroup.remove`、`tableGroup.resize`、`tableGroup.changeName` 和 `tableGroup.changeColor`，也就是除了變更堆疊順序的 `tableGroup.changeZIndex` 之外的全部）、`relationship.changeColumns`、`settings.changeLockSettings` 和 `settings.changeDDLScript`。  
`settings.changeRelationshipOptimization` 已不復存在，因此這兩個方法都會捨棄它。  
較早版本的存放區會捨棄這些新動作，因此會遺失[資料表群組](../../guide/guides/table-groups.md)、[鎖定](../../guide/guides/settings.md#lock)、[結構描述 SQL](../../guide/guides/schema-sql.md) 指令碼，以及透過「[對應欄位](../../guide/guides/relationship-editing.md#map-columns)」為現有關聯指定的欄位。  
請讓複本在與編輯器相同或更新的版本上執行。

`4.1.0` 沒有新增任何動作類型，也未變更 `@dineug/erd-editor/engine.js`，因此 `4.0.0` 的複本與 `4.1.0` 的複本一樣，會保留 `4.1.0` 編輯器傳送的每一項變更。  
自 `4.1.0` 起，[尋找與取代](../../guide/guides/find-and-replace.md#replacing)中的 `Replace` 和 `Replace All` 也會重新命名索引和資料表群組，所使用的是 `4.0.0` 的複本原本就會保留的 `index.changeName` 和 `tableGroup.changeName` 動作。  
[物件總管](../../guide/guides/explorer.md)本身的狀態絕不會傳送，而它造成的索引標籤切換或捲動，會像其他任何索引標籤切換或捲動一樣送達；請參閱[協作編輯](./collaborative-editing.md)。

自 `4.2.0` 起，保留的動作還包括 `table.changeLogicalName`、`table.changeNameDerived`、`column.changeLogicalName`、`column.changeDomain`、`column.changeNameDerived`、`settings.changeNameViewMode`，以及承載[字典](../../guide/guides/dictionary.md)工作表上每一次編輯、排序和匯入 CSV 的 `dictionary.add`、`dictionary.update` 和 `dictionary.remove`。  
在「名稱顯示」切換中，複本只會套用非唯讀編輯器在 `Name View` 未鎖定期間所做的切換，並捨棄其餘切換（請參閱 [on@change](#onchange)）。  
較早版本的存放區會捨棄所有這些動作，因此會遺失[邏輯名稱](../../guide/guides/logical-names.md)、定義域連結、各名稱是否由字典產生的資訊、詞彙、術語和定義域，以及「名稱顯示」。  
工作階段中 `4.2.0` 之前的編輯器，仍可能讓 `4.2.0` 的複本失去其中一部分內容。  
在該編輯器上以 `Import` 匯入結構描述 SQL、GraphQL、DBML 或 AML（但 `Import and Add` 不會）時，會清空複本的詞彙、術語和定義域。  
它對載入、`Import` 或 `clear()` 的復原，會將它自己的文件副本載入複本，其中不含邏輯名稱、定義域連結或字典；請參閱[混用不同版本](./collaborative-editing.md#mixing-releases)。  
`@dineug/erd-editor/engine.js` 匯出的 `createReplicationStore`、`ReplicationStore` 和 `ReplicationChange` 與先前相同，而 `createReplicationStore` 接受的 context 物件也與先前相同。

自 `4.0.0` 起，這兩個方法也會套用 `editor.mergeLWW`，其中帶有另一個編輯器加入工作階段時、某個編輯器作為回應所傳送的協作暫存器，因此複本會以與編輯器相同的方式裁定並行編輯。  
它不會變更 `value` 的任何位元組，也不會觸發 `change`。  
`4.0.0` 之前發佈的編輯器可能仍會傳送的 `settings.changeIgnoreSaveSettings` 會被保留，但不會變更任何內容：它會觸發 `change`，且 `changed` 為 `false`。

### destroy {#destroy}

完全銷毀 replicationStore 執行個體。

```js
replicationStore.destroy();
```

之後，存放區會停止觸發 `change`，並忽略後續的分派。  
文件會凍結在最後的值，而不會引發錯誤。  
建立新的存放區即可重新開始。
