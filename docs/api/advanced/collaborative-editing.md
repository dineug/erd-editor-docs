---
sidebar_position: 1
---

# Collaborative Editing

It supports a real-time collaborative editing API.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (config?: SharedStoreConfig) => SharedStore;
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

## Simple Mirroring Example

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

Sets the displayed user nickname.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

## SharedStore

### connection, disconnect

Indicates the current connection status.  
Upon disconnection, it saves the changes internally in a buffer.  
Emits an event when it becomes ready for transmission.  
The default state is `connection`.

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

Applies changes from other editor instances to the current editor instance.

```js
sharedStore.dispatch(actions...); // async
sharedStore.dispatchSync(actions...); // sync
```

### subscribe

Subscribes to changes in the editor.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

Completely destroys the sharedStore instance.

```js
sharedStore.destroy();
```
