---
sidebar_position: 2
---

# Remote Storage

Sending the entire state every time there's a change in the editor is inefficient.  
It supports a real-time data replication API.

## Installation

```sh
npm install @dineug/erd-editor
```

## Usage

```ts
type ReplicationStore = {
  readonly value: string;
  on: (reducers: Partial<{ change: () => void }>) => Unsubscribe;
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

Used to calculate the width of text.

```js
const toWidth = text => text.length * 10;
const replicationStore = createReplicationStore({ toWidth });
```

## ReplicationStore

### value getter

Retrieves the current editor state as JSON data.

```js
const data = replicationStore.value;
```

### setInitialValue

Loads the previously stored editor state.

```js
replicationStore.setInitialValue('json...');
```

### on@change

Subscribes to changes in the editor's state.

```js
const unsubscribe = replicationStore.on({
  change: () => {
    const data = replicationStore.value;
    // save...
  },
});
```

### dispatch, dispatchSync

Applies remote editor changes to the replicationStore.

```js
replicationStore.dispatch(actions...); // async
replicationStore.dispatchSync(actions...); // sync
```

### destroy

Completely destroys the replicationStore instance.

```js
replicationStore.destroy();
```
