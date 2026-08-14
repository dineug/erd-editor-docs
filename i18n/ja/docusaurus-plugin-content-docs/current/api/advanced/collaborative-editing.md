---
sidebar_position: 1
---

# 共同編集

リアルタイム共同編集の API を提供します。

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & { mouseTracker?: boolean }
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

## シンプルなミラーリングの例

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

表示するユーザーの nickname を設定します。

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

他のユーザーのマウスカーソルを表示します。既定値は `true` です。

```js
editor.getSharedStore({ mouseTracker: false });
```

## SharedStore

### connection, disconnect

接続状態を設定するメソッドです。  
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

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

sharedStore のインスタンスを完全に破棄します。

```js
sharedStore.destroy();
```
