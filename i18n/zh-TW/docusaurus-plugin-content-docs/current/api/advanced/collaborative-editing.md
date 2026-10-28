---
sidebar_position: 1
description: 使用 getSharedStore 在執行個體之間轉送編輯器的變更，以 runtimeValue 初始化加入的編輯器，並顯示每位協作者的游標、焦點、選取範圍和拖曳框。
---

# 協作編輯

`getSharedStore()` 會將編輯器變成協作工作階段中的一個節點。  
它會將每項變更以動作串流的形式送出，並套用其他編輯器傳回的動作：編輯器之間的傳輸方式（WebSocket、WebRTC，或任何其他能傳送 JSON 的方式）由您自行提供。  
它是 [ErdEditorElement](../erd-editor-element.md) 的方法之一，當轉送的變更也必須儲存時，可與[遠端儲存](./remote-storage.md)搭配使用。

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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

動作是描述文件中一項變更的可序列化一般物件，因此在送往傳輸方式的途中能完整通過 `JSON.stringify`。  
動作會以批次送達：`subscribe` 會交給您一個陣列，而該陣列就是一個單位，要整個轉送，並在另一端整個分派。  
請將動作視為不透明的值並原樣傳遞，而不要讀取或改寫它，因為它所攜帶的內部記錄資訊正是讓各編輯器保持同步的依據。

編輯器所做的部分操作只會留在該編輯器上。  
將資料表、備忘錄或資料表群組移到最前面（選取其中之一時就會如此）不會送出。  
同樣不會送出的還有「[結構描述 SQL](../../guide/guides/schema-sql.md)」索引標籤中 `Statements`、`Header`、`Write logical names into empty comments`（自 `4.2.0` 起）和 `Tables` 的選擇，這些選擇屬於做出選擇的那個視窗。  
自 `4.1.0` 起，[物件總管](../../guide/guides/explorer.md)也只會留在其所屬的編輯器上：它是否開啟、它的寬度、摺疊的列、鍵盤所在的列、樹狀結構的捲動位置，以及它的搜尋和選項，都不會送出。  
前往外鍵時為其關聯的連接線加上的[亮顯](../../guide/guides/relationship-editing.md#reading-a-connector)也不會送出。  
自 `4.2.0` 起，[字典](../../guide/guides/dictionary.md)索引標籤也只會留在其所屬的編輯器上：顯示的是哪一個工作表，以及每個工作表的搜尋、選取範圍、捲動位置和欄寬，都不會送出。它的編輯、排序和匯入 CSV 則會送出。  
捲動、縮放或索引標籤切換會送出，但絕不會移動其他使用者的檢視或索引標籤。這也包括從物件總管跳至目標時產生的捲動、從其他索引標籤開啟物件總管時切換到 ERD 索引標籤的動作，以及從「字典」索引標籤的 [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) 工作表跳至資料表或欄位時的索引標籤切換和捲動。從該工作表跳至詞彙、術語或定義域時會停留在「字典」索引標籤上，因此這類跳至目標的操作完全不會送出。

自 `4.2.0` 起，[名稱顯示](../../guide/guides/logical-names.md#switching-the-view)的切換也會送出，而其[鎖定](../../guide/guides/settings.md#lock)決定其他編輯器如何處理它。在新的圖表中，以及在 `4.2.0` 之前的任何文件中，`Name View` 鎖定都是開啟的。  
鎖定開啟期間，切換只會顯示在做出切換的編輯器上：切換仍會送出，但其他每個編輯器和每個複本都會捨棄它，因此每位使用者都可以檢視不同的顯示方式，而 `value` 會保留鎖定的顯示方式。語言、名稱大小寫或引號類型的變更則不同：無論其鎖定是否開啟，都會送達每個編輯器。  
鎖定關閉期間，在可編輯的編輯器中做出的切換會變更每個編輯器和複本上的「名稱顯示」，以最後一次切換為準，而且它們每一個都會儲存該設定。  
唯讀編輯器自身的切換一律只會留在該編輯器上，而該編輯器仍會跟隨其他編輯器共用的切換。

自 `5.0.0` 起，[唯讀](../erd-editor-element.md#readonly)編輯器完全不會送出任何變更。其讀者所變更的捲動、縮放、索引標籤、名稱顯示、資料庫、程式碼產生器語言、名稱大小寫、引號類型和 `View Option` 各列，無論其鎖定為何，都只會留在它的畫面上；在 `5.0.0` 之前，其捲動、縮放、索引標籤切換、資料庫和程式碼設定會像可編輯的編輯器一樣送出。  
它的存放區仍會送出其追蹤器所送出的讀者游標、焦點、選取範圍和拖曳框，回應加入的編輯器所要求的暫存器，並套用其他編輯器送來的每一項變更。資料庫、程式碼產生器設定或 `View Option` 列的變更會送達它的文件，也會送達它的畫面（除非其讀者已在該處變更了該設定），而共用的「名稱顯示」切換無論如何都會顯示在它的畫面上。  
編輯器轉為唯讀時，會先送出存放區對拖曳或捲動仍保留未送的部分，如同 [flushStreamBuffers](#flushstreambuffers) 所做的，讓其他編輯器保有最後的內容。

[鎖定](../../guide/guides/settings.md#lock)是共用的：每個編輯器都以對某項設定最後一次的鎖定或解除鎖定為準，而鎖定會攜帶開啟它的那個編輯器上的值，因此每個編輯器和複本都會儲存相同的值。  
因此，`Viewport` 鎖定會儲存開啟它的那個編輯器的檢視，而 `Canvas Type` 鎖定會儲存該編輯器在切換到「設定」索引標籤（鎖定就是在此開啟）之前所在的最後一個索引標籤。  
關閉 `Language`、`Table Name Case`、`Column Name Case`、`Bracket Type` 鎖定，或自 `4.2.0` 起的 `Name View` 鎖定時，也會將每個編輯器上的該項設定改為關閉它的那個編輯器上所顯示的值，因此各編輯器仍會儲存同一個值。關閉 `Viewport` 或 `Canvas Type` 的鎖定不會移動任何人的檢視或索引標籤。

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
自 `4.0.0` 起，它也會捨棄該編輯器的協作暫存器，這些暫存器用來裁定並行的編輯。如果該編輯器的共用存放區已經有過訂閱者，存放區會像第一次 [subscribe](#subscribe) 時一樣，再次向其他編輯器索取它們的暫存器，因此在工作階段中途重新載入的編輯器，會以與其他編輯器相同的方式裁定編輯。  
指派 `value` 會保留這些暫存器，但與 `setInitialValue` 不同，它會被轉送：一旦該編輯器有了共用存放區，工作階段中的每個編輯器都會載入所指派的文件，因此請勿以這種方式初始化加入者。

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

`4.0.0` 之前的編輯器會忽略這些新的動作類型：它永遠看不到資料表群組，也不知道哪些資料表屬於群組，不過拖曳群組時，群組中的資料表在它那裡仍會移動，因為拖曳群組也會送出這些資料表的 `table.move`。  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

訂閱編輯器中的變更。  
在至少有一個訂閱者之前，不會有任何內容離開編輯器，而在此之前所做的變更會被緩衝。  
第一次訂閱也會向其他編輯器索取它們的協作暫存器，這些暫存器用來裁定並行的編輯，因此較晚加入者會以相同的方式裁定這些編輯。  
它不會帶來文件，因此要先[初始化](#seeding-a-collaborator)較晚加入者。  
自 `4.0.0` 起，在第一次訂閱之後，每當 `setInitialValue` 將文件載入其編輯器時，存放區都會再次索取。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

立即送出此存放區仍在保留的串流批次，而不是等到它們的靜止期過後才送出。  
自 `3.9.2` 起，它可用於由 `getSharedStore` 取得的存放區；在 `3.9.1` 中，此方法雖然存在於型別上，但不會有任何作用。  
移動資料表、備忘錄或資料表群組，變更其顏色，調整備忘錄大小，以及捲動或縮放檢視，每一項都會以由細小變更組成的串流送達。調整資料表群組大小則不會：它只會在拖曳結束時送出一次。  
存放區會將每個串流彙集成一個批次並保留，直到該串流靜止 200ms 為止。它會分兩個階段進行，因此批次會在最後一次變更後約 400ms 送出。  
呼叫此方法會結束兩個階段中的這段等待。存放區處於連線狀態時，訂閱者會在呼叫傳回之前收到該批次。沒有任何保留內容時，呼叫不會送出任何東西。  
`destroy`（無論是存放區本身的還是編輯器的）會捨棄仍在保留中的批次，因此在釋放某個存放區、而其他編輯器應保有最後一次變更時（例如關閉分頁時），請先呼叫此方法。

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

完全銷毀 sharedStore 執行個體。  
編輯器本身不受影響，因此離開工作階段後，文件仍可編輯。  
一旦編輯器所提供的最後一個 sharedStore 被銷毀，滑鼠與焦點追蹤器就會停止。  
存放區仍在保留的串流批次會隨之一併捨棄；若要送出該批次，請先呼叫 [flushStreamBuffers](#flushstreambuffers)。

```js
sharedStore.destroy();
```
