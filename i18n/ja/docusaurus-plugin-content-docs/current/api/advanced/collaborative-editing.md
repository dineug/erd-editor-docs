---
sidebar_position: 1
description: getSharedStore によるエディタ間の変更の中継、参加者ごとのマウスカーソル、フォーカス、選択、ドラッグボックスの表示。
---

# 共同編集

`getSharedStore()` は、エディタを共同編集セッションのノードにします。  
すべての変更をアクションのストリームとして発行し、他のエディタから送られてきたアクションを適用します。両者をつなぐトランスポート（WebSocket、WebRTC、その他 JSON を運べるもの）は利用者側で用意します。  
[ErdEditorElement](../erd-editor-element.md) のメソッドの 1 つで、中継した変更を保存する必要がある場合は [リモート保存](./remote-storage.md) と組み合わせて使います。

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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

アクションはドキュメントへの 1 つの変更を表す単純なシリアライズ可能なオブジェクトであり、トランスポートへ渡す途中で `JSON.stringify` を通しても壊れません。  
アクションはバッチで届き、`subscribe` が渡す配列が 1 つの単位となるため、配列全体をそのまま中継し、受け取り側でも配列全体をそのまま dispatch します。  
アクションが持つ管理情報がエディタ間の同期を支えているため、内容を読んだり書き換えたりせず、不透明な値としてそのまま受け渡します。

Visualization タブの [Flow モード](../../guide/guides/visualization.md#flow-never-edits-the-document)で行う操作はどれもドキュメントの変更ではないため、Flow を表示しているエディタは他のエディタに変更を送らず、その間も他のエディタから送られてくる変更は引き続き適用されます。  
唯一の例外は ERD タブへ戻るカードの外部リンクボタンで、そのタブの切り替えとスクロールは他の変更と同じように送信されます。

## 1 つのページに 2 つのエディタ

ここでの subscribe から dispatch への接続はネットワークの代わりであり、トランスポートを挟まずにセッションの形を確認できます。

```js
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

## SharedStoreConfig

### getNickname

他のエディタで、このユーザーのマウスカーソルの横に表示する nickname を設定します。  
nickname が未設定または空の場合、他のユーザーには `user` と表示されます。

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

このユーザーのマウスカーソルを他のエディタへ送信します。既定値は `true` です。  
他のユーザーから送られてきたカーソルは、ERD キャンバスに常に表示されます。

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker

このユーザーが作業している対象を他のエディタへ送信します。既定値は `true` です。  
フォーカスしているテーブルとセル、選択しているテーブルとメモ、キャンバス上でドラッグしているボックスが他のエディタへ送られ、そこに描画されます。  
ユーザーごとに固有の色が割り当てられるため、フォーカス中のテーブルの輪郭線、フォーカス中のセルの下線、選択中のテーブルとメモを囲む枠線、ドラッグボックスの破線の矩形で、それぞれを見分けられます。  
他のユーザーから届いた操作状況は、このオプションの設定にかかわらず常に自分のキャンバスに描画されます。  
Visualization タブの Flow モードでは、他のユーザーのフォーカスと選択はテーブルのカードに描画されますが、ドラッグボックスは描画されません。そこで選択したテーブルは引き続き送信されますが、そこでドラッグしたボックスは送信されません。

```js
editor.getSharedStore({ focusTracker: false });
```

両方のトラッカーを無効にすると、自身の操作状況を一切送信しない単純な中継として shared store を使えます。  
他のエディタから送られてくる操作状況は、引き続き受信して描画します。  
VSCode と IntelliJ のエディタはこの方式で動作しています。

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

マウスカーソル、フォーカス、選択、ドラッグボックスは、ドキュメントの変更と同じストリームを流れますが、一時的なものです。  
これらはドキュメント、Undo の履歴、`editor.value` のいずれにも入らないため、トランスポートが破棄しても構わず、replicationStore も無視します。

## SharedStore

### connection, disconnect

現在の接続状態を設定するメソッドです。  
`disconnect` の状態では、内部で発生した変更をバッファに保存します。  
送信可能な状態になると、バッファに溜まった変更を購読者へ発行します。  
既定の状態は接続済み（`connection`）です。

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

他のエディタインスタンスの変更を、現在のエディタインスタンスに反映します。

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

エディタの変更を購読します。  
購読者が 1 つも存在しない間はエディタから何も送信されず、それまでの変更はバッファに保存されます。  
最初の subscribe では他のエディタに現在の状態を要求するため、後から参加した場合でも追いつけます。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

sharedStore のインスタンスを完全に破棄します。  
エディタ自体はそのまま残るため、セッションから抜けてもドキュメントの編集を続けられます。  
エディタが返した最後の sharedStore が破棄されると、マウスとフォーカスのトラッカーは停止します。

```js
sharedStore.destroy();
```
