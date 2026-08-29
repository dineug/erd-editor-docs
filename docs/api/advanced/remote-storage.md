---
sidebar_position: 2
description: Replicate a live editor into a headless store off the main thread, and serialize the document for storage.
---

# Remote Storage

Sending the entire editor state on every change is inefficient.  
For that case, the editor provides an API for real-time data replication.

## Installation

```sh
npm install @dineug/erd-editor
```

The replication store lives at the `@dineug/erd-editor/engine.js` subpath, not the package root.  
That entry point touches no DOM, so it runs in a Web Worker or anywhere else off the main thread.  
Importing the package root instead registers the `<erd-editor>` custom element, which needs a document.

## Usage

```ts
type ReplicationStore = {
  readonly value: string;
  on: (listeners: Partial<{ change: () => void }>) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
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

## Replicating a Live Editor

The actions come from a live editor's shared store.  
See [Collaborative Editing](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(savedJson);

replicationStore.on({
  change: () => save(replicationStore.value),
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Only the change crosses the boundary, never the whole document.  
The replica applies it and serializes the result on its own side, and `change` tells you when it is worth writing.

## InjectEngineContext

### toWidth

Measures a string in pixels.  
The store has no DOM, so it cannot measure text itself, and it recomputes column widths from this function every time a name, data type, default, or comment changes.

Measure the way the editor does — `400 12px` in the editor's font stack, rounded, plus 2px of padding.  
Otherwise the replicated column widths drift away from the ones on screen.

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

`text.length * 10` is the fallback when no canvas is available.  
It is enough for a store whose document is only stored, never rendered.

## ReplicationStore

### value getter

Serializes the current editor state.  
Returns a JSON string, ready to store as it is — not a parsed object.

```js
const data = replicationStore.value;
```

The document's own `ignoreSaveSettings` is applied while serializing.  
With the scroll bit set the scroll position is written as `0`, and with the zoom bit set the zoom level is written as `1`.  
See [Schema](./schema.md) for those bits.

### setInitialValue

Loads the previously stored editor state.

```js
replicationStore.setInitialValue('json...');
```

A blank string, or anything that is not a string, loads an empty document instead of raising an error.

Loading also runs a garbage collection pass over the document.  
Entities that no longer appear in `doc` and have not been touched for four days or more are dropped, so a collaborator's in-flight change is never collected.  
The pass finishes asynchronously.

Neither the load nor the collection emits `change`.  
Read `replicationStore.value` yourself after loading if you want the collected document written back.

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

`change` is debounced by 200ms, so a burst of actions arrives as one notification.  
It fires only for actions that change the document, so a relayed presence action never wakes it.  
Call the returned function to unsubscribe.

### dispatch, dispatchSync

Applies remote editor changes to the replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` defers to a microtask, and `dispatchSync` applies the batch right away.

You can hand over a shared store's stream unfiltered.  
Both methods keep only the actions that change the document and drop the rest, so the presence a collaborative session carries — each user's mouse cursor, focus, selection, and drag box — passes through as a no-op.

### destroy

Completely destroys the replicationStore instance.

```js
replicationStore.destroy();
```

Afterwards the store stops emitting `change` and ignores further dispatches.  
The document freezes at its last value rather than raising an error.  
Create a new store to start again.
