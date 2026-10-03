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
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
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
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Only the change crosses the boundary, never the whole document.  
The replica applies it and serializes the result on its own side.  
`change` hands you that result as `value`, and `changed` tells you when it is worth writing.

## InjectEngineContext

### toWidth

Measures a string in pixels.  
The store has no DOM, so it cannot measure text itself, and it recomputes column widths from this function every time a name, data type, default, or comment changes.  
It also measures every table and column again whenever [setInitialValue](#setinitialvalue) loads a document.  
So a document saved where text measured differently, on another machine or by another release, reads back with this store's widths, and `value` differs from the stored text before any edit.  
That is why [on@change](#onchange) measures `changed` from the load, not from the file.

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
With the scroll bit set the view origin is written as `0, 0`, and with the zoom bit set the zoom level is written as `1`.  
See [Schema](./schema.md) for those bits.

### setInitialValue

Loads the previously stored editor state.

```js
replicationStore.setInitialValue('json...');
```

A blank string, or anything that is not a string, loads a new, empty document instead of raising an error.  
A store that has never been given a value starts as the same new document.  
Since `3.10.0` that document saves neither the scroll nor the zoom: both bits of its `ignoreSaveSettings` are set, as with [`Save Scroll Information`](../../guide/guides/settings.md#save-scroll-information) and [`Save Zoom Information`](../../guide/guides/settings.md#save-zoom-information) turned off. Before `3.10.0` it saved both.  
A stored document keeps the switches it names, and one that names none, a v2 document included, saves both.  
Text that is not JSON, such as a file left with merge-conflict markers, does not raise an error either: the parse error is only logged to the console, the document is emptied, and the settings stay as they were.

Loading also runs a garbage collection pass over the document.  
Entities that no longer appear in `doc` and have not been touched for four days or more are dropped, so a collaborator's in-flight change is never collected.  
Since `3.10.0` the pass finishes before `setInitialValue` returns.  
So do the load's other rewrites, which before `3.10.0` ran over the next few milliseconds: the foreign key marks on columns, read off the relationships again; every table and column width, measured again with `toWidth`; the points where each connector meets its tables; and each relationship's identifying flag and the symbol at its parent end.  
`replicationStore.value` read right after the call is therefore already the collected, settled document. An action that arrives right behind the load, such as a replayed scroll, is measured against that document, so the load's own rewrites are never reported as [`changed`](#onchange).

Neither the load nor any of these rewrites emits `change`.  
Read `replicationStore.value` yourself once `setInitialValue` returns if you want that document written back.

### on@change

Subscribes to changes in the editor's state.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` is debounced by 200ms, so a burst of actions arrives as one notification.  
It fires only for actions of a kind that can change the document, so a relayed presence action never wakes it.  
Call the returned function to unsubscribe.

Since `3.10.0` the listener receives a `ReplicationChange`, a type `@dineug/erd-editor/engine.js` exports beside `ReplicationStore`.  
Before `3.10.0` it received nothing, and a listener that ignores the argument keeps working.  
`value` is the serialized document, the same string `replicationStore.value` returns at that moment, so there is no need to serialize it again.  
`changed` is `false` when the actions since the previous `change`, or since the load, left `value` byte for byte as it was.

A scroll or a zoom that the document's save switches leave out of `value` still fires `change`, with `changed` set to `false`, so write only when `changed` is `true`.  
A scroll changes nothing with `Save Scroll Information` off.  
A zoom also moves the view origin, so it changes nothing only with `Save Zoom Information` and `Save Scroll Information` both off. With only `Save Zoom Information` off it still changes `value`.  
Opening another of the editor's tabs always changes `value`, since neither switch covers it.

`changed` never compares with your stored file, which can already differ from `value` once it loads: a file saved where text measured differently does, as [toWidth](#towidth) explains, and so does any file without the view origin.  
Comparing bytes with the file would count a scroll the switches leave out as an edit.  
If `setInitialValue` lands while a `change` is still pending, and nothing is dispatched before it is due, that `change` still comes, with the loaded `value` and `changed` set to `false`.

### dispatch, dispatchSync

Applies remote editor changes to the replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` defers to a microtask, and `dispatchSync` applies the batch right away.

You can hand over a shared store's stream unfiltered.  
Both methods keep only the actions of a kind that can change the document and drop the rest, so the presence a collaborative session carries — each user's mouse cursor, focus, selection, and drag box — passes through as a no-op.

Since `3.10.0` the kept actions include `relationship.changeOnDelete` and `relationship.changeOnUpdate`, and `relationship.add` carries `onDelete` and `onUpdate`.  
A store from an earlier release drops those actions and ignores those fields, so it loses a relationship's [ON DELETE and ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) actions.  
Run the replica on the same release as the editors, or a newer one.

### destroy

Completely destroys the replicationStore instance.

```js
replicationStore.destroy();
```

Afterwards the store stops emitting `change` and ignores further dispatches.  
The document freezes at its last value rather than raising an error.  
Create a new store to start again.
