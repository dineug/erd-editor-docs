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
  readonly runtimeValue: string;
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
replicationStore.setInitialValue(editor.runtimeValue);

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

Since `4.0.0`, seed the replica from the editor's `runtimeValue`, as above, rather than from the stored file or the editor's `value`.  
The file lacks the edits made since it was saved, and `value` lacks the entities removed in the session.  
A replica seeded without a removed table brings it back without its name or columns when an editor undoes the removal, and saves it that way.

## InjectEngineContext

### toWidth

Measures a string in pixels.  
The store has no DOM, so it cannot measure text itself, and it recomputes column widths from this function every time a name, data type, default, or comment changes.  
It also measures every table and column again whenever [setInitialValue](#setinitialvalue) loads a document.  
Since `4.0.0` the widths are kept only in [runtimeValue](#runtimevalue-getter), never in `value`.  
So a document this release saved reads back to the same `value` byte for byte, wherever it was saved and however text measured there.

Measure the way the editor does — `400 12px` in the editor's font stack, rounded, plus 2px of padding.  
Otherwise the widths in `runtimeValue` drift away from the ones on screen.

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

Since `4.0.0`, `value` is the storage form: the document as a file holds it, the same text the element's [value](../erd-editor-element.md#value) returns.  
It holds the live entities alone, in a fixed order, without the removed ones, the stacking order, or anything a load works out again, such as the widths [toWidth](#towidth) measures.  
It is indented two spaces and ends with a newline, so the same document always gives the same bytes.  
See [Storage Form and Runtime Value](./schema.md#storage-form-and-runtime-value) for what it holds.

Each setting whose [lock](../../guide/guides/settings.md#lock) is on is written at the value it was locked at, and every other setting as it stands.  
The `Viewport` lock covers the view origin and the zoom level together, and the tab, the Code Generator language, both name cases and the bracket type each have a lock of their own.  
The locks replace the document's `ignoreSaveSettings`, which is neither read nor written since `4.0.0`.  
Before `4.0.0`, `value` was the whole document as the store held it, with that field's scroll and zoom bits applied.

### runtimeValue getter

Since `4.0.0`, serializes the document as the replica holds it, the removed entities and everything a load works out included.  
Each locked setting is written at its locked value here too.

```js
const snapshot = replicationStore.runtimeValue;
```

Use it to seed an editor or another store that joins later, through its `setInitialValue`; see [Collaborative Editing](./collaborative-editing.md).  
Never store it as the file: it carries the removed entities, and the published [JSON Schema](./schema.md#json-schema) refuses it.  
Those removed entities are what let an undo of a removal, sent later, bring the entity back whole in the store seeded from it.  
They stay until the document is next opened from its file, whose form leaves them out.

### setInitialValue

Loads the previously stored editor state.

```js
replicationStore.setInitialValue('json...');
```

It takes the storage form, a runtime value, or a document an earlier release saved, a v2 document included.  
A blank string, or anything that is not a string, loads a new, empty document instead of raising an error.  
A store that has never been given a value starts as the same new document.  
Since `4.0.0` that document has every [lock](../../guide/guides/settings.md#lock) on, so its `value` keeps the view, the tab, the Code Generator language, the name cases and the bracket type it started with while the editors it replicates scroll, zoom, switch tabs or change those settings. In `3.10.0` it saved neither the scroll nor the zoom, and before that it saved both.  
A stored document keeps the locks it names.  
One that names none, which is any document saved before `4.0.0`, a v2 document included, loads with every lock on: its view origin at `0, 0`, its zoom level at `1` and its tab at ERD, whatever it saved, and its Code Generator language, name cases and bracket type as it saved them.  
Since `4.0.0`, `setInitialValue` also drops the collaboration registers held for the previous document, as the element's [setInitialValue](../erd-editor-element.md#setinitialvalue) does.  
Text that is not JSON, such as a file left with merge-conflict markers, does not raise an error either: the parse error is only logged to the console, the document is emptied, and the settings stay as they were.

Since `4.0.0` loading runs no garbage collection, so removed entities stay in [runtimeValue](#runtimevalue-getter).  
Before, it dropped the entities that no longer appeared in `doc` and had not been touched for four days or more.

The load's rewrites finish before `setInitialValue` returns: the key marks on columns, read off each column's options and the relationships; every table and column width, measured again with `toWidth`; the points where each connector meets its tables; and each relationship's identifying flag and the symbol at its parent end.  
None of them is part of `value`, but `replicationStore.runtimeValue` read right after the call already holds them all.  
An action that arrives right behind the load, such as a replayed scroll, is measured against the loaded document, so the load itself is never reported as [`changed`](#onchange).

Neither the load nor any of these rewrites emits `change`.  
Read `replicationStore.value` yourself once `setInitialValue` returns if you want the loaded document written back in the storage form.

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
It fires only for actions of a kind that can change the document, plus the `settings.changeIgnoreSaveSettings` an older editor may still send (see [dispatch, dispatchSync](#dispatch-dispatchsync)).  
A relayed presence action or `editor.mergeLWW` never wakes it.  
Call the returned function to unsubscribe.

Since `3.10.0` the listener receives a `ReplicationChange`, a type `@dineug/erd-editor/engine.js` exports beside `ReplicationStore`.  
Before `3.10.0` it received nothing, and a listener that ignores the argument keeps working.  
`value` is the serialized document in the storage form, the same string `replicationStore.value` returns at that moment, so there is no need to serialize it again.  
`changed` is `false` when the actions since the previous `change`, or since the load, left `value` byte for byte as it was.

A change that a [lock](../../guide/guides/settings.md#lock) leaves out of `value` still fires `change`, with `changed` set to `false`, so write only when `changed` is `true`.  
That is a scroll or a zoom while `Viewport` is locked, a tab switch while `Canvas Type` is locked, and a change of the Code Generator language, a name case or the bracket type while its own lock is on.  
The element's [change](../erd-editor-element.md#change) event leaves such a change out, but the replica still reports it.  
Every lock is on in a new document and in one saved before `4.0.0`.  
With `Viewport` unlocked a scroll or a zoom changes `value`, and with `Canvas Type` unlocked so does opening another of the editor's tabs.  
Turning a lock on or off changes `value` as well.

Since `4.0.0`, `changed` compares the storage form, which holds neither the removed entities nor the stacking order.  
So a table added and removed again within one `change`, an edit that lands on an entity another collaborator removed, and a relayed load that only changes the stacking order all come out with `changed` set to `false` too.

`changed` never compares with your stored file, which can already differ from `value` once it loads: a file an earlier release saved does, a v2 file included, and so do a file that starts with a byte order mark and one edited by hand.  
Comparing bytes with such a file would count even a scroll a lock leaves out as an edit.  
The first `change` with `changed` set to `true` hands such a file back in the storage form, so writing it rewrites the file once.  
A file this release saved does not differ, wherever it was saved, as [toWidth](#towidth) explains.  
If `setInitialValue` lands while a `change` is still pending, and nothing is dispatched before it is due, that `change` still comes, with the loaded `value` and `changed` set to `false`.

### dispatch, dispatchSync

Applies remote editor changes to the replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` defers to a microtask, and `dispatchSync` applies the batch right away.

You can hand over a shared store's stream unfiltered.  
Both methods keep only the actions of a kind that can change the document, plus the two described at the end of this section, and drop the rest, so the presence a collaborative session carries — each user's mouse cursor, focus, selection, and drag box — passes through as a no-op.

Since `3.10.0` the kept actions include `relationship.changeOnDelete` and `relationship.changeOnUpdate`, and `relationship.add` carries `onDelete` and `onUpdate`.  
A store from an earlier release drops those actions and ignores those fields, so it loses a relationship's [ON DELETE and ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) actions.

Since `4.0.0` the kept actions also include `table.changeGroup`, seven of the eight `tableGroup` actions (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` and `tableGroup.changeColor`, all but the stacking change `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` and `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` no longer exists, so both methods drop it.  
A store from an earlier release drops the new actions, so it loses [table groups](../../guide/guides/table-groups.md), the [locks](../../guide/guides/settings.md#lock), the [Schema SQL](../../guide/guides/schema-sql.md) scripts, and the columns [Map Columns](../../guide/guides/relationship-editing.md#map-columns) gives an existing relationship.  
Run the replica on the same release as the editors, or a newer one.

`4.1.0` adds no action type and leaves `@dineug/erd-editor/engine.js` as it was, so a `4.0.0` replica keeps every change a `4.1.0` editor sends, just as a `4.1.0` replica does.  
Since `4.1.0`, `Replace` and `Replace All` in [Find and Replace](../../guide/guides/find-and-replace.md#replacing) also rename indexes and table groups, through the `index.changeName` and `tableGroup.changeName` actions a `4.0.0` replica already keeps.  
The [Explorer](../../guide/guides/explorer.md)'s own state is never sent, and a tab switch or a scroll it makes arrives as any other tab switch or scroll does; see [Collaborative Editing](./collaborative-editing.md).

Since `4.0.0` both methods also apply `editor.mergeLWW`, which carries the collaboration registers an editor answers with when another one joins the session, so the replica settles concurrent edits the way the editors do.  
It changes no byte of `value` and fires no `change`.  
`settings.changeIgnoreSaveSettings`, which an editor released before `4.0.0` may still send, is kept but changes nothing: it fires `change` with `changed` set to `false`.

### destroy

Completely destroys the replicationStore instance.

```js
replicationStore.destroy();
```

Afterwards the store stops emitting `change` and ignores further dispatches.  
The document freezes at its last value rather than raising an error.  
Create a new store to start again.
