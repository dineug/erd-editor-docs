---
sidebar_position: 2
---

# 远程存储

每次变更都发送编辑器的全部状态并不高效。  
为此，编辑器提供了实时数据复制 API。

## 安装

```sh
npm install @dineug/erd-editor
```

## 使用

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

用于计算文本的 width。

```js
const toWidth = text => text.length * 10;
const replicationStore = createReplicationStore({ toWidth });
```

## ReplicationStore

### value getter

以 JSON 数据的形式获取当前编辑器状态。

```js
const data = replicationStore.value;
```

### setInitialValue

加载此前保存的编辑器状态。

```js
replicationStore.setInitialValue('json...');
```

### on@change

订阅编辑器的状态变更事件。

```js
const unsubscribe = replicationStore.on({
  change: () => {
    const data = replicationStore.value;
    // save...
  },
});
```

### dispatch, dispatchSync

将远程编辑器的变更应用到 replicationStore。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

### destroy

彻底销毁 replicationStore 实例。

```js
replicationStore.destroy();
```
