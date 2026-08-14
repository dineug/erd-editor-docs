---
sidebar_position: 2
---

# リモート保存

変更のたびにエディタの状態全体を送信するのは非効率です。  
そのような場合のために、リアルタイムデータレプリケーションの API を提供します。

## インストール

```sh
npm install @dineug/erd-editor
```

## 使い方

```ts
type ReplicationStore = {
  readonly value: string;
  on: (listeners: Partial<{ change: () => void }>) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type EngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (context: EngineContext) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## EngineContext

### toWidth

テキストの width を計算するために使用します。

```js
const toWidth = text => text.length * 10;
const replicationStore = createReplicationStore({ toWidth });
```

## ReplicationStore

### value getter

現在のエディタの状態を JSON データとして取得します。

```js
const data = replicationStore.value;
```

### setInitialValue

以前に保存したエディタの状態を読み込みます。

```js
replicationStore.setInitialValue('json...');
```

### on@change

エディタの状態変更イベントを購読します。

```js
const unsubscribe = replicationStore.on({
  change: () => {
    const data = replicationStore.value;
    // save...
  },
});
```

### dispatch, dispatchSync

リモートのエディタの変更を replicationStore に反映します。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

### destroy

replicationStore のインスタンスを完全に破棄します。

```js
replicationStore.destroy();
```
