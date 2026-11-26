---
sidebar_position: 2
description: 透過 @dineug/erd-editor-yjs，讓 <erd-editor> 元素或無介面對等存放區經由 Yjs 文件保持同步，初始化房間，透過 Awareness 顯示在線狀態，離線時繼續編輯，並以壓縮附屬程序合併房間的歷程。
---

# Yjs

`@dineug/erd-editor-yjs` 讓圖表經由 [Yjs](https://github.com/yjs/yjs) 文件保持同步。它是獨立的套件，以 `0.1.0` 與 `@dineug/erd-editor` `5.1.0` 一同首次發行。  
`bindErdEditor` 將 `<erd-editor>` 元素繫結至 `Y.Doc`，`bindPeerStore` 則將來自 `@dineug/erd-editor/peer.js` 的無介面對等存放區繫結至 `Y.Doc`。  
承載 `Y.Doc` 的提供者就會承載圖表：websocket 伺服器、WebRTC、IndexedDB，或您自己的提供者皆可。提供者和 `Y.Doc` 仍由您掌控：繫結不會連線、中斷連線或銷毀它們。

編輯以編輯器自己的動作批次傳送，繫結會保持存放區送出時的原樣。  
因此編輯器的協作暫存器裁定同一時刻進行的編輯的方式，與透過 `getSharedStore` 連接的工作階段相同，例外情況也相同，例如顏色變更，請參閱[同時進行的編輯](./collaborative-editing.md#concurrent-edits)。  
游標、焦點、選取範圍和拖曳框透過提供者的 Awareness 傳送，請參閱[在線狀態](#presence)。  
與自行將共用存放區連接到傳輸層相比，繫結額外提供：

- 加入的用戶端會開啟房間所保存的圖表，不需要從執行中的編輯器交付 [runtimeValue](../erd-editor-element.md#runtimevalue)。
- 斷線的用戶端可以繼續編輯，重新連線時其編輯會送達，請參閱[離線編輯與重新加入](#offline-edits-and-rejoins)。
- 持久化提供者交還的 `Y.Doc` 會開啟其所保存的圖表，請參閱[房間所保存的內容](#what-the-room-holds)。
- 選用的 Node 附屬程序會將房間的歷程合併成一份快照，請參閱[壓縮房間](#compacting-a-room)。

繫結需要 `5.1.0` 新增至共用存放區和對等存放區的五個方法：[getLWW](./collaborative-editing.md#getlww)、[mergeLWW](./collaborative-editing.md#mergelww)、[getVersion](./collaborative-editing.md#getversion)、[forgetPeer](./collaborative-editing.md#forgetpeer) 和 [reseed](./collaborative-editing.md#reseed)，而且會自行完成所有必要的呼叫。

## 安裝 {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`、`yjs` 和 `y-protocols` 是對等相依套件，因此一個頁面各只會有一份：`@dineug/erd-editor` 為 `5.x` 內的 `5.1.0` 或更新版本，`yjs` 為 `13.x` 內的 `13.6` 或更新版本，`y-protocols` 為 `1.x` 內的 `1.0` 或更新版本。  
此套件只取用它們的型別，並在您傳入的 `Y.Doc` 和 `Awareness` 上運作，因此不會載入自己的 Yjs、y-protocols 或編輯器程式碼。  
一個頁面中有兩份 Yjs 會破壞彼此的建構函式檢查，第二份會記錄 `Yjs was already imported`。當您的程式碼和提供者從兩個位置解析 `yjs` 時，請在打包工具中進行去重（Vite：`resolve.dedupe: ['yjs']`）。

此套件僅提供 ESM（`"type": "module"`），只有一個進入點，即套件根目錄，並標記為無副作用，因此只匯入 `bindErdEditor` 的套件組合不會包含壓縮器。  
`bindErdEditor` 需要 DOM，因為它繫結的是已定義的 `<erd-editor>` 元素。`bindPeerStore` 也能在單純的 Node 中執行，需要 Node.js 22.12 或更新版本，[壓縮附屬程序](#compacting-a-room)即是如此。

## 使用方式 {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` 和 `my-diagram` 代表您自己的伺服器和房間。  
請在提供者同步後才進行繫結和初始化，也就是 y-websocket 的 `sync` 事件帶著 `true` 時。過早進行的初始化可能會取代房間的圖表，請參閱[初始化房間](#seeding-a-room)。

繫結時若 `Y.Doc` 保存著房間的快照，繫結會立即在元素中開啟該快照：載入快照及其暫存器和版本，如同 [reseed](./collaborative-editing.md#reseed) 所做的，並套用此後記錄的所有編輯。  
此次開啟會清除並關閉重新加入所做的那些事，請參閱[離線編輯與重新加入](#offline-edits-and-rejoins)，元素會開啟在快照所指定的位置。第一次開啟不會觸發 `rejoin`。  
若 `Y.Doc` 沒有保存快照，例如空房間或提供者尚未同步時，元素會保留其文件，而繫結在快照出現之前不會對房間寫入任何內容，快照可能是它自己的 [seed](#seed)，也可能是其他用戶端的。

`bindErdEditor` 會以 [getSharedStore](../erd-editor-element.md#getsharedstore) 從元素取得一個共用存放區，並以 [destroy](#destroy) 釋放它。  
元素必須已經是 `<erd-editor>`，也就是已匯入其進入點或已呼叫 `defineErdEditor()`，請參閱[註冊元素](../installation.md#registering-the-elements)。在標籤定義之前，`<erd-editor>` 只是一般的 `HTMLElement`，待標籤定義且元素位於文件中，瀏覽器就會將它升級。對於尚未升級的元素，`bindErdEditor` 會擲出 `TypeError`，而不是觸發 `error`。

房間的編輯會套用到元素，並如同協作者的編輯一樣觸發 [change](../erd-editor-element.md#change)，快照開啟之後重播的編輯也包含在內。  
開啟快照，無論是在繫結時還是重新加入時，都不會產生復原步驟、不會觸發 `change`，也不會對房間寫入任何內容，但[離線編輯與重新加入](#offline-edits-and-rejoins)所述依邏輯名稱產生物理名稱的編輯除外。  
若要將另一份文件載入已初始化的房間，請進行每個用戶端都會套用的變更：指派 [value](../erd-editor-element.md#value)、呼叫 [clear](../erd-editor-element.md#clear)，或匯入一份文件。  
[setInitialValue](../erd-editor-element.md#setinitialvalue) 永遠不會寫入房間，因為共用存放區不會傳送它，所以它只會改變該元素，其他所有用戶端仍保有房間的圖表。要初始化空房間，請改用 [seed](#seed)。

一個 `Y.Doc` 保存一份圖表。繫結會將它保存在 `Y.Doc` 以 `erd:` 開頭的名稱之下，並設定本機 Awareness 狀態的 `erd` 欄位，其他所有名稱和欄位則不會動到。  
請為每個繫結的元素提供各自的 `Y.Doc` 和 Awareness，就像房間中的每個用戶端那樣：兩個共用同一個 Awareness 的繫結會互相覆寫對方的 `erd` 欄位。

## 初始化房間 {#seeding-a-room}

在用戶端[初始化](#seed)之前，房間不保存任何圖表。  
在此期間，編輯器所保存的內容會進入它自己的初始快照，而當其他用戶端的初始快照先到達時，它就讓位：繫結會以 `rejoin('snapshot')` 重新開啟該快照，元素原本保存的文件，連同繫結後在其中所做的編輯，都會消失。

兩個用戶端同時初始化時，在每個用戶端上都是同一個初始快照勝出。  
另一個初始化者會以 `rejoin('seedLost')` 重新開啟勝出的快照，並失去自己初始化之後所做的編輯，加入落敗初始快照的用戶端也一樣，並以 `rejoin('snapshot')` 重新開啟。它們在落敗初始快照中的編輯不會送達任何人。  
在提供者同步之前進行的初始化，視為與房間圖表所來自的初始快照在同一時刻進行，因此它可能勝過後者而取代房間的圖表。

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

承載游標、焦點、選取範圍和拖曳框的 `Awareness`，例如提供者的 Awareness。  
有了它，繫結會開啟元素的滑鼠和焦點追蹤器，並在元素上繪製其他用戶端的在線狀態，請參閱[在線狀態](#presence)。  
沒有它時只會同步圖表：元素不會傳送游標、焦點或選取範圍，也不會繪製其他人的。

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

其他人在此編輯器的游標旁看到的名稱。  
元素的共用存放區每次傳送時都會讀取它，與 [getSharedStore](./collaborative-editing.md#getnickname) 相同，缺少或為空白時，其他使用者會看到 `user`。

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` 會傳回一個可移除該監聽器的函式。

### seed {#seed}

以編輯器的文件寫入房間的第一份快照，並傳回 `true`。  
若給定 `value`，即 [setInitialValue](../erd-editor-element.md#setinitialvalue) 可讀取的任何形式的文件文字，會先將它載入編輯器。  
接著它會捨棄編輯器仍保留的拖曳、調整大小和顏色變更，且不予記錄，因此它們都不會在快照之後進入房間。沒有 `value` 時，快照已經包含它們，因為快照取自編輯器的文件；有 `value` 時，它們屬於被 `value` 取代的那份文件。  
然後它會寫入[房間所保存的內容](#what-the-room-holds)所述的快照。  
房間一旦保存了快照，它就會傳回 `false` 且不寫入任何內容，也不載入 `value`，因此每個用戶端都可以在繫結後呼叫它。繫結已銷毀或已停止時，以及繫結時被[拒絕](#onerror)的繫結，它也會傳回 `false`。

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

繫結在房間的快照上重新開啟了編輯器，如同 [reseed](./collaborative-editing.md#reseed) 所做的；[離線編輯與重新加入](#offline-edits-and-rejoins)說明它保留什麼、失去什麼。  
`reason` 說明原因：

- `'snapshot'`：快照包含繫結尚未套用的編輯，原因是它離開期間壓縮器將這些編輯合併了，或是壓縮器在自己的合併中放回了它先前合併、卻被另一個壓縮器的快照取代的內容（請參閱[每個房間一個壓縮器](#one-compactor-per-room)）。當該快照是第一個送達空房間之繫結的快照時，以及當它屬於另一個初始快照、而此繫結先前加入的是一個並非自己寫入的初始快照時，原因也是這個。
- `'seedLost'`：另一個用戶端的初始快照勝過了此繫結所寫入的初始快照。

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

繫結拒絕繫結、已停止，或拒絕了某個選項。每則訊息都以 `erd-editor-yjs: ` 開頭。

繫結時，在下列情況下它不會繫結任何東西：

- 編輯器或對等存放區已經繫結至此 `Y.Doc`；
- 其 `@dineug/erd-editor` 建置於 `5.1.0` 之前；繫結會銷毀它從元素取得的共用存放區；
- 對等存放區在繫結之前已被銷毀；
- 房間保存的快照採用此版本不讀取的版面配置（請參閱[房間所保存的內容](#what-the-room-holds)）。

這樣的繫結會在微任務中觸發 `error`，因此在呼叫之後立即加入的監聽器也能收到，而且它永遠不會觸發 `rejoin`。

之後在下列情況下繫結會停止：

- 房間的快照變成此版本不讀取的版面配置。此版本的每個繫結都會停止，各編輯器保留已套用的內容，之後的編輯都不會寫入；
- 它的對等存放區在繫結期間被銷毀，會在房間下次變更，或呼叫 `seed()` 或 `compact()` 時發現。

停止的繫結會釋放它取得的共用存放區，以及它的存放區和 `Y.Doc` 這一組，如同 [destroy](#destroy) 所做的，並保留它的監聽器。

僅對 `bindPeerStore` 而言，下列情況會觸發 `error`，而繫結會繼續運作：

- `compactAfter` 不是正整數：繫結只在被要求時才合併；
- `electionGraceMs` 或 `retainMs` 不是介於 0 到 2,147,483,647 ms 的數字：改用其預設值，因為超出該範圍的計時器會立即觸發；
- `synced` 被拒絕：繫結永遠不會合併，並把選舉交給其他壓縮器（請參閱[每個房間一個壓縮器](#one-compactor-per-room)）。

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

將編輯器仍保留的拖曳、調整大小和顏色變更送入房間，將繫結的 `erd` Awareness 欄位設為 `null`，讓其他人立即移除它的游標、焦點和選取範圍，並停止觀察 `Y.Doc` 和 Awareness。  
對於元素，它還會銷毀所取得的共用存放區，元素及其文件則維持原樣。  
第二次呼叫不會有任何作用。之後編輯器所做的編輯不會送達任何人。

對等存放區、`Y.Doc` 和提供者仍由您掌控，請在銷毀繫結之後再銷毀它們：先被銷毀的對等存放區永遠不會傳送它仍保留的拖曳。  
元素自己的 [destroy](../erd-editor-element.md#destroy) 會銷毀它發出的每個共用存放區，包括繫結的，並捨棄它們保留的內容，因此請先銷毀繫結。  
請在將同一個編輯器或對等存放區再次繫結至同一個 `Y.Doc` 之前銷毀繫結；因 `error` 而停止的繫結已經釋放了。

```js
binding.destroy();
editor.destroy();
```

## 在線狀態 {#presence}

有了 [awareness](#awareness)，編輯器的游標、焦點所在的資料表或儲存格、選取範圍和拖曳框會透過其本機 Awareness 狀態的 `erd` 欄位傳送，絕不進入 `Y.Doc`，因此不會進入房間的歷程、快照或已持久化的 `Y.Doc`。  
其他人以繪製協作者在線狀態的方式繪製它們，請參閱 [focusTracker](./collaborative-editing.md#focustracker)，而加入的用戶端會繪製房間已經顯示的在線狀態。  
元素每 30 秒重新傳送一次焦點和選取範圍，每秒重新傳送一次拖曳框。每次重新傳送即使與上一次相同，也會送達其他人，因此使用者仍在持有的內容永遠不會失效。

離開的用戶端會立即被遺忘。  
當 Awareness 捨棄其狀態，或其 `erd` 欄位變為 `null`（如同 [destroy](#destroy) 所設定的），或指向另一個編輯器時，繫結會以 [forgetPeer](./collaborative-editing.md#forgetpeer) 從元素移除該編輯器的游標、焦點、選取範圍和拖曳框，而不是等它們過期。  
若另一個用戶端仍顯示同一個編輯器，繫結就會保留它們，例如再次繫結至房間另一個 `Y.Doc` 的元素。

## 離線編輯與重新加入 {#offline-edits-and-rejoins}

與提供者斷線的用戶端可以繼續編輯。它的編輯等在本機 `Y.Doc` 中，而不是共用存放區中，並在提供者重新連線並同步時送達其他人。

當壓縮器合併了用戶端在離開期間從未套用的編輯，快照便保存著這些編輯，因此重新連線時，用戶端會在送出其編輯器仍保留的拖曳、調整大小和顏色變更之後，以 `rejoin('snapshot')` 重新開啟快照。只合併了用戶端已套用內容的合併不會重新開啟任何東西。  
重新加入此繫結所加入之初始快照的快照時，會重播快照未保存的每一項編輯，包括此用戶端在離開期間自己所做的編輯，因此不會遺失任何編輯。重新加入另一個初始快照則不保留任何內容，如[初始化房間](#seeding-a-room)所述。

每次重新加入都會清除復原歷程記錄、選取範圍和焦點，關閉開啟中的[流程](../../guide/guides/visualization.md#flow-mode)檢視，結束[正在繪製的關聯線](../../guide/guides/editing-start.md#relationship-creation)，並關閉備忘錄、資料表群組名稱或儲存格編輯器，因為它們可能指向快照已不再保存的內容。  
已輸入但尚未按下 Enter 的資料表群組名稱會被捨棄。關閉的邏輯名稱儲存格，若重新開啟的文件仍保存該邏輯名稱，會依其讀者輸入的邏輯名稱產生物理名稱，就像該儲存格任何一次關閉時那樣。這次產生物理名稱是一般的編輯：房間會記錄它，它會產生復原步驟，也會觸發 `change`，請參閱 [reseed](./collaborative-editing.md#reseed)。  
已加入房間的繫結會保留其讀者所見的內容：捲動位置、縮放比例和索引標籤，以及唯讀的讀者所變更的設定。  
只要各項的[鎖定](../../guide/guides/settings.md#lock)在重新加入之前為開啟，且之後仍為開啟並維持相同的鎖定值，它也會保留讀者自己顯示的名稱顯示和程式碼設定（程式碼產生器的語言、名稱大小寫和引號類型）。  
它保留的這些內容都不會進入 `value`，`value` 回報的是重新開啟之文件的設定，請參閱帶有 `keepScreen` 的 [reseed](./collaborative-editing.md#reseed)。  
自上次載入後未顯示過的元素的捲動位置和縮放比例，以及尚未加入的繫結的整個畫面，都會開啟在快照所指定的位置。  
對等存放區沒有畫面，因此其重新加入不保留任何畫面。

## 唯讀編輯器 {#read-only-editors}

繫結至房間的[唯讀](../erd-editor-element.md#readonly)元素不會對房間的歷程寫入任何內容：它的共用存放區不會傳送任何變更，只傳送追蹤器和暫存器交握，而房間對這兩者[都不記錄](#what-the-room-holds)。  
它仍會套用房間所承載的每一項編輯，而有了 [awareness](#awareness)，其讀者的游標、焦點、選取範圍和拖曳框仍會送達其他人。  
其讀者所變更的設定只會留在它的畫面上，如同任何唯讀編輯器。  
[seed](#seed) 不會被拒絕：唯讀元素可以用它所保存的文件初始化空房間，若有給定則用 `value`。

## 房間所保存的內容 {#what-the-room-holds}

繫結將圖表保存在 `Y.Doc` 的兩個名稱中：`erd:snapshot` 是保存文件快照的對應，`erd:log` 是自該快照以來編輯器動作批次的陣列。持久化提供者會將兩者與 `Y.Doc` 的其餘內容一同儲存。

快照保存文件的 [runtimeValue](../erd-editor-element.md#runtimevalue)（包括已移除的實體）、其協作暫存器和版本，以及每位寫入者的編輯已合併到什麼程度。初始化會寫入它，壓縮器的每次合併也會。  
在 `5.1.1` 之前的 `@dineug/erd-editor` 上進行的初始化或合併，所寫入的快照中沒有任何備忘錄屬於資料表群組，請參閱[混用不同版本](./collaborative-editing.md#mixing-releases)。  
每筆記錄項目是編輯器送出的一個批次，包括其中繼資料，其中含有傳送者的編輯器 ID 和暱稱。  
捲動、縮放、索引標籤切換、在線狀態和暫存器交握永遠不會被記錄。編輯器送出的其他所有變更都會被記錄，包括在[鎖定](../../guide/guides/settings.md#lock)下進行的名稱顯示切換，其他每個用戶端都會捨棄它。  
在鎖定下變更的程式碼產生器語言、名稱大小寫或引號類型永遠不會被傳送，因此它只會留在該編輯器的畫面上，永遠不會進入房間。

持久化提供者交還的 `Y.Doc` 會開啟其所保存的圖表，如同繫結開啟任何保存著快照的 `Y.Doc` 那樣，請參閱[使用方式](#usage)。

快照不是檔案：它的執行階段值帶有已移除的實體，而檔案不得保存這些內容。  
要將房間的圖表寫入儲存空間，請在繫結元素的 [change](../erd-editor-element.md#change) 事件每次觸發時儲存其 [value](../erd-editor-element.md#value)。  
繫結之後、給定 `value` 的 [seed](#seed) 之後，以及在 [rejoin](#onrejoin) 監聽器中也要儲存一次，因為這些載入都不會觸發 `change`。  
[唯讀](../erd-editor-element.md#readonly)元素永遠不會觸發 `change`，因此請從非唯讀的元素儲存，或從繫結的對等存放區讀取 `value`，它會在房間的編輯到達時套用。  
[replicationStore](./remote-storage.md) 無法繫結，因為它缺少繫結所需的方法，而由繫結元素的共用存放區餵入的複寫存放區會錯過房間的編輯，請參閱[複寫執行中的編輯器](./remote-storage.md#replicating-a-live-editor)。

版面配置是私有的，可能隨 [ERD_YJS_FORMAT](#exports) 而變更。  
請只透過繫結讀取房間，並將 `erd:` 名稱和 Awareness 欄位 `erd` 留給繫結使用。

## 壓縮房間 {#compacting-a-room}

房間的歷程隨每次編輯而增長，加入的每個用戶端都要重播全部歷程，直到有東西將它合併。  
`bindPeerStore` 繫結來自 `@dineug/erd-editor/peer.js` 的無介面對等存放區，並傳回 `ErdYjsPeerBinding`：具有相同的 [seed](#seed)、[on](#erdyjsbinding) 和 [destroy](#destroy)，另加 [compact](#compact)。  
在伺服器旁的 Node 處理序中繫結的對等存放區，即附屬程序，會將歷程合併成其自身圖表的快照。  
元素的繫結永遠不會合併，而在沒有 `compactAfter` 也沒有呼叫 `compact()` 的情況下繫結的對等存放區，只是一般的無介面對等端。

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

對等存放區仍由您掌控：繫結永遠不會銷毀它。它的暱稱是交給 `createPeerStore` 的那一個，而 `presence: false` 使它不傳送自己的焦點。

合併會依對等存放區自己的執行階段值、暫存器和版本寫入快照，並在同一筆交易中刪除它涵蓋的記錄項目，以及另一個初始快照的所有項目。  
已套用全部內容的用戶端會看到這些項目消失；尚未套用的用戶端則會在快照上重新開啟（請參閱[離線編輯與重新加入](#offline-edits-and-rejoins)）。  
每次合併都會將整份圖表重寫進快照，因此每次合併都會對每個用戶端送出一份更新，大小約為圖表的執行階段 JSON 加上暫存器的總和，不論它合併的項目有多少。請將 `compactAfter` 設得夠高，使一次合併所處理的項目總量超過一份圖表副本的大小。

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `awareness` | 無 | 在房間的 Awareness 中顯示對等存放區，如同 [awareness](#awareness) 對元素所做的。自行合併的壓縮器會在其中被標示，因此彼此看得到的壓縮器會選出一個來合併，而看不到其他用戶端的壓縮器不會自行合併任何內容，請參閱[每個房間一個壓縮器](#one-compactor-per-room)。沒有它時，壓縮器會自行合併，不進行選舉，也沒有寬限時間。 |
| `compactAfter` | 無 | 當記錄檔中一次合併會處理的項目達到此數量時自行合併。沒有它，或沒有 `synced` 時，只有 `compact()` 會合併，以及放回內容的合併（請參閱[每個房間一個壓縮器](#one-compactor-per-room)）。 |
| `synced` | 無 | 提供者同步後解析的 Promise。在它之前不會進行任何合併，包括 `compact()`。沒有它時，不會自行合併，而 `compact()` 會立即合併。 |
| `electionGraceMs` | `3000` | 有 `awareness` 時，壓縮器在自行合併之前觀察房間多久，在 `synced` 之後，以及在原本沒有其他用戶端、之後出現時，每次都會重新計算。 |
| `retainMs` | `600000`（十分鐘） | 一次合併的項目要保留多久以便放回（請參閱[每個房間一個壓縮器](#one-compactor-per-room)），從合併之後房間送出的第一個更新起算。 |

無效的選項，或被拒絕的 `synced`，會觸發 [error](#onerror)。

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

立即合併，不進行選舉、寬限時間或門檻檢查。  
它會先納入房間目前的快照（包括重新加入），並送出其對等存放區仍保留的內容。  
它回應 `{ compacted: true, generation }`，其中 `generation` 計算快照的合併次數：初始快照為 `0`，每合併一次加一。  
否則它回應 `{ compacted: false, reason }`：

- `'destroyed'`：繫結已銷毀或已停止，以及繫結時被[拒絕](#onerror)的繫結，即使在 `synced` 解析之前也是如此；
- `'not-synced'`：在 `synced` 解析之前；
- `'no-snapshot'`：在沒有任何用戶端初始化過的房間中。

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## 每個房間一個壓縮器 {#one-compactor-per-room}

每個房間請只執行一個壓縮器，而且要等舊的停止之後才啟動新的。沒有任何機制強制這一點。  
在 Awareness 中彼此看得到的壓縮器之間，只有 Yjs 用戶端 ID 最小的那一個會自行合併，當它離開，或其 `synced` 被拒絕時，下一個會立即接手。  
Awareness 中看不到其他用戶端的壓縮器，例如它自己的通訊端關閉而使所有用戶端都被移除時，在其他用戶端再次出現、而且它觀察房間滿 `electionGraceMs` 之前，不會自行合併任何內容。

互相斷線的兩個壓縮器，或前一個仍在執行的重新啟動，仍可能各自合併。  
房間接著只保留兩份快照之一，而快照落敗的壓縮器會放回它所合併、但勝出者沒有保存的內容，只要它仍持有這些內容：持有 `retainMs` 那麼久，且最多其最新的 1,000 筆項目，不論每筆有多大。  
因此，當快照落敗的壓縮器是重新連線的那一個，只要它在分離期間合併的項目不超過 1,000 筆，就不會遺失任何內容。  
當它是一直在線的那一個，且它的持有已過期時，房間的快照和歷程會缺少它合併的內容，直到它再次合併。錯過這些編輯的用戶端，或這段期間加入的用戶端，會缺少它們，並暫緩該壓縮器已合併其編輯的每位寫入者之後的編輯。壓縮器的下一次合併會把它們全部帶回來，除非勝出的快照保存了它所缺少的編輯，那會使它在該快照上重新開啟，並永久失去它所合併的內容。

壓縮器在自己的合併中放回內容，這次合併在它趕上勝出的快照之後進行，不經選舉、寬限時間或門檻檢查，而每個用戶端都會以 `rejoin('snapshot')` 在該次合併上重新開啟。  
它放回的編輯，除了該次合併之外不會送達任何用戶端，因此全程在線的用戶端最終會與其他用戶端，以及之後加入的用戶端一致，即使另一位寫入者之後的編輯建立在其中某一項之上，例如重新命名另一個用戶端新增的資料表。  
每次放回都會讓每個用戶端承受那次重新加入，以及[重新加入的損失](#offline-edits-and-rejoins)。兩個壓縮器同時放回時，每個用戶端最終仍然一致，不過某項編輯可能先於其所依賴的編輯而保持已套用狀態。  
在該次合併執行之前就被銷毀或停止的繫結，例如由 `rejoin` 監聽器銷毀的繫結，會改為單獨放回這些編輯。不會遺失任何內容，但全程在線的用戶端可能在另一位寫入者所依賴它的編輯之後才套用它，而與之後加入的用戶端結果不同。

## 限制 {#limits}

- **檢視區留在各自的畫面上。** 捲動、縮放和索引標籤切換[永遠不會被記錄](#what-the-room-holds)，儘管透過 `getSharedStore` 連接的工作階段會傳送它們（在那裡它們也不會移動其他使用者的檢視或索引標籤）。每位讀者保有自己的，繫結只在它的 Awareness 狀態中顯示，目前沒有任何東西讀取它。在 `Viewport` 或 `Canvas Type` [鎖定](../../guide/guides/settings.md#lock)為關閉時，每個用戶端的 `value` 儲存的是它自己的；在鎖定下（新文件預設為開啟），每個用戶端儲存的都是鎖定的值。
- **快照每個繫結增長一筆項目。** 它為每個曾寫入房間的繫結保存其編輯已合併到什麼程度，而且永遠不會捨棄任何一筆。重新建立的繫結，或移到另一個初始快照的繫結，會重新計算，放回內容的每次合併也是。一筆項目是一個 32 個字元的 ID 加上一個數字，因此一萬個寫入工作階段會為每份快照和每次合併增加幾百 KB。
- **hub 和房間之間不會互相轉送。** 繫結至房間，同時繫結至程式碼代理程式的 [hub](../../mcp/live-and-headless.md#live)，或經由 `getSharedStore()` 繫結至任何其他傳輸層的元素，會套用兩邊的編輯，但兩邊都聽不到對方的編輯，因為共用存放區不會轉送它所接收到的內容。
- **同時新增的項目可能排列在不同位置。** 兩個用戶端同時新增的資料表或備忘錄，在各用戶端圖表中的順序可能不同，如同透過 `getSharedStore` 連接的工作階段，請參閱[同時進行的編輯](./collaborative-editing.md#concurrent-edits)。
- **同時進行的顏色和其他少數變更可能得到不同結果。** 顏色變更在記錄時不帶版本，每個用戶端在套用時以自己的版本為它加上標記。因此同時對同一個資料表、備忘錄或資料表群組進行兩次重新著色，可能使各用戶端，以及之後加入並重播記錄檔的用戶端，得到不同的顏色。每個用戶端依其收到順序套用的其他變更也是如此，例如同一個資料表或索引內的兩次欄位移動，或資料庫的兩次變更，請參閱[同時進行的編輯](./collaborative-editing.md#concurrent-edits)。
- **離開的游標要等伺服器。** 一旦 Awareness 捨棄某個對等端的游標，繫結就會立即清除它。伺服器在通訊端關閉時，若只移除該通訊端最初新增的 Awareness 狀態，那麼已重新連線的用戶端離開後，仍會留在其他人的畫面上，直到 30 秒後 Awareness 使它逾時。若移除該通訊端最後寫入的每個狀態（更新和新增都算），則會立即清除。

## 匯出項目 {#exports}

| 匯出項目 | 說明 |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | 繫結 `<erd-editor>` 元素，請參閱[使用方式](#usage)。傳回 [ErdYjsBinding](#erdyjsbinding)。 |
| `bindPeerStore(peer, doc, options?)` | 繫結來自 `@dineug/erd-editor/peer.js` 的對等存放區，請參閱[壓縮房間](#compacting-a-room)。傳回同樣的繫結並另加 [compact](#compact)（`ErdYjsPeerBinding`）。 |
| `ERD_YJS_FORMAT` | 此版本寫入的 `Y.Doc` 版面配置，`1`；繫結會拒絕以其他版面配置寫入的房間。 |

型別：`BindOptions`、`PeerBindOptions`、`CompactOptions`、`CompactResult`、`BindingEvents`、`RejoinReason`、`ErdYjsBinding`、`ErdYjsPeerBinding`。
