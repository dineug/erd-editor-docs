---
sidebar_position: 1
---

# 协同编辑

提供实时协同编辑 API。

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

## 简单的镜像示例

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

设置显示的用户 nickname。

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

显示其他用户的鼠标光标。默认值为 `true`。

```js
editor.getSharedStore({ mouseTracker: false });
```

## SharedStore

### connection, disconnect

这些方法用于设置当前的连接状态。  
处于断开状态时，变更会被缓存在内部。  
一旦恢复可发送状态，缓存的变更会发布给订阅者。  
默认状态为已连接（`connection`）。

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

将其他编辑器实例的变更应用到当前编辑器实例。

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

订阅编辑器的变更。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

彻底销毁 sharedStore 实例。

```js
sharedStore.destroy();
```
