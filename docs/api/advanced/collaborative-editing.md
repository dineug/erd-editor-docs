---
sidebar_position: 1
description: Relay editor changes between instances with getSharedStore, seed a joining editor from runtimeValue, and show each collaborator's cursor, focus, selection, and drag box.
---

# Collaborative Editing

`getSharedStore()` turns an editor into a node in a collaborative session.  
It emits every change as a stream of actions and applies the actions other editors send back — you supply the transport between them (WebSocket, WebRTC, or anything else that can carry JSON).  
It is one of the [ErdEditorElement](../erd-editor-element.md) methods, and pairs with [Remote Storage](./remote-storage.md) when the relayed changes also have to be stored.

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
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

An action is a plain serializable object describing one change to the document, so it survives `JSON.stringify` on its way to the transport.  
They arrive in batches: `subscribe` hands you an array, and that array is one unit — relay it whole and dispatch it whole on the other side.  
Treat an action as opaque and pass it through verbatim rather than reading or rewriting it, since the bookkeeping it carries is what keeps the editors in sync.

Some of what an editor does stays on that editor.  
Bringing a table, memo, or table group to the front, as selecting one does, is not sent.  
Neither are the [Schema SQL](../../guide/guides/schema-sql.md) tab's `Statements`, `Header`, and `Tables` choices, which belong to the window they are made in.  
Since `4.1.0` the [Explorer](../../guide/guides/explorer.md) stays on its editor too: whether it is open, its width, its folded rows, the row the keyboard is on, where its tree is scrolled, and its search and options are not sent.  
Nor is the [light](../../guide/guides/relationship-editing.md#reading-a-connector) that going to a foreign key puts on its relationship's connector.  
A scroll, a zoom, or a tab switch is sent, but it never moves another user's view or tab. That includes the scroll a jump from the Explorer makes and the switch to the ERD tab when the Explorer opens from another tab.

[Locks](../../guide/guides/settings.md#lock) are shared: the latest lock or unlock of a setting wins on every editor, and a lock carries the values of the editor that turned it on, so every editor and replica saves the same value.  
A `Viewport` lock therefore saves the view of the editor that turned it on, and a `Canvas Type` lock the last tab that editor was on before the Settings tab, where locks are turned on.  
Turning off the `Language`, `Table Name Case`, `Column Name Case`, or `Bracket Type` lock also sets that setting on every editor to the value shown on the editor that turned it off, so they keep saving one value. Turning off `Viewport` or `Canvas Type` moves no one's view or tab.

An edit to the `Before tables` or `After tables` script is sent whole when its field loses focus. The two scripts settle separately, so a collaborator's edit of one never overwrites the other.

Nothing done in the Visualization tab's [Flow mode](../../guide/guides/visualization.md#flow-never-edits-the-document) is a document change, so an editor in Flow sends the others no changes, and the changes they send keep applying while it is there.  
The one exception is leaving Flow for another tab: that tab switch is sent like any other.  
The external-link card button, a [quick search](../../guide/guides/quick-search.md#searching-the-diagram) result chosen after `#`, `@`, or `:`, and opening the [Explorer](../../guide/guides/explorer.md#opening-and-closing) all leave Flow for the ERD tab. A scroll the card button or a quick search result makes there is sent too.

## Two Editors on One Page

The subscribe-to-dispatch wiring here stands in for the network, so you can see the shape of a session without a transport in the way.

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

Both editors here start from the same new, empty document, so neither has to be seeded.  
With three or more editors, send each one's batches to every other: an editor never passes on what it received.

## Seeding a Collaborator

A shared store relays changes as they are made and never hands a joiner the document as it stands, so an editor that joins a session already running has to be given the document first.  
Since `4.0.0` seed it with [`runtimeValue`](../erd-editor-element.md#runtimevalue) from an editor already in the session, not with `value` or the saved file.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

The runtime value still holds what has been removed since the document was opened, so when another editor later undoes a removal, the joiner brings the table back with its name and columns.  
[`value`](../erd-editor-element.md#value) is the form a file holds, without removed entities, so a joiner seeded from it, or from the file, would bring back an empty, nameless table instead.  
Keep writing `value` to storage: `runtimeValue` is only for seeding another editor, a second view, or a [replicationStore](./remote-storage.md).  
The editors in VS Code, Obsidian, a JetBrains IDE, and the web app seed a second view of an open document this way.

`setInitialValue` is not relayed, so seeding the joiner changes nothing on the others.  
Since `4.0.0` it also drops the editor's collaboration registers, which settle concurrent edits. If the editor's shared store has already had a subscriber, the store asks the other editors for theirs again, as on its first [subscribe](#subscribe), so an editor loaded again in the middle of a session settles edits the way the others do.  
Assigning `value` keeps the registers, but unlike `setInitialValue` it is relayed: once the editor has a shared store, every editor in the session loads the assigned document, so never seed a joiner that way.

## Mixing Releases

An editor applies only the action types its own release knows, so in a session that mixes releases the older editors miss whatever travels on a newer type.

Since `3.10.0` a change to a relationship's [ON DELETE or ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) travels as one of two new action types, `relationship.changeOnDelete` and `relationship.changeOnUpdate`, and `relationship.add` can carry both. A relay that passes actions through verbatim needs nothing new for them.  
An editor from before `3.10.0` ignores those action types and fields: it never learns a relationship's ON DELETE or ON UPDATE, and a document saved from one has neither. A relationship an older editor adds arrives without them, so both start at `Not set`.

Every other change a `3.10.0` editor sends travels on action types older editors already know.  
`Replace All` in [Find and Replace](../../guide/guides/find-and-replace.md#replacing) sends its edits as one batch of the same rename, comment, and memo actions an edit by hand sends. The `Alternate Key` and `Referential Actions` [view options](../../guide/guides/table-related-functions.md#table-view-options) travel on the existing `settings.changeShow` action.

Since `4.0.0` these changes travel on new action types, and a relay that passes actions through verbatim needs nothing new for them:

- a [table group](../../guide/guides/table-groups.md) added, moved, resized, renamed, recolored, or removed: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor`, and `tableGroup.remove`; a table joining or leaving a group: `table.changeGroup`;
- a [Map Columns](../../guide/guides/relationship-editing.md#map-columns) `Save` on an existing relationship, which sets both of its column lists at once: `relationship.changeColumns`;
- a [lock](../../guide/guides/settings.md#lock) turned on or off: `settings.changeLockSettings`;
- an edit to the [Schema SQL](../../guide/guides/schema-sql.md) tab's `Before tables` or `After tables` script: `settings.changeDDLScript`.

The `Table Groups` and `Memos` view options travel on the existing `settings.changeShow` action.  
`settings.changeIgnoreSaveSettings`, which the `Save Scroll Information` and `Save Zoom Information` switches sent before the locks replaced them, is no longer sent, and `settings.changeRelationshipOptimization` is gone. A `4.0.0` editor that receives either changes nothing.

An editor from before `4.0.0` ignores the new action types: it never sees a table group or which tables are in it, though a group drag still moves the group's tables there, since it also sends their `table.move`.  
It keeps a relationship's old columns after a Map Columns `Save`, and when a column of that old mapping is removed on it, the relationship goes away on every editor. It has no locks and no scripts.  
A document saved from one has none of these, and a `4.0.0` editor opens it with every lock on.  
Keep every editor in a session, and any [replicationStore](./remote-storage.md#dispatch-dispatchsync) that stores its document, on `4.0.0` or later.

A `4.1.0` editor sends no new action type, so `4.0.0` and `4.1.0` editors and replicas share a session with nothing missed.  
Its [Find and Replace](../../guide/guides/find-and-replace.md#replacing) also searches index names and table group names, and `Replace` and `Replace All` rename them on the `index.changeName` and `tableGroup.changeName` actions a `4.0.0` editor already applies.

## SharedStoreConfig

### getNickname

Sets the nickname shown next to this user's mouse cursor on the other editors.  
Other users see `user` when the nickname is missing or blank.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

Broadcasts this user's mouse cursor to the other editors. Default is `true`.  
Cursors sent by other users are always shown on the ERD canvas.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker

Broadcasts what this user is working on. Default is `true`.  
The table and cell you have focused, the tables, memos, and table groups you have selected, and the box you drag on the canvas are sent to the other editors and drawn there.  
Each user gets a color of their own, so you can tell them apart: an outline on the focused table, an underline on the focused cell, a ring around the selected tables, memos, and table groups, and a dashed rectangle for the drag box.  
Presence arriving from other users is always drawn on your canvas, whether or not this option is on.  
In the Visualization tab's Flow mode, other users' focus and selection are drawn on the table cards but their drag boxes are not. The tables you select there are still sent; the box you drag there is not.

```js
editor.getSharedStore({ focusTracker: false });
```

Turn off both trackers to use the shared store as a plain relay that publishes no presence of its own.  
Presence sent by other editors is still received and drawn.  
This is what the editors in VS Code, Obsidian, a JetBrains IDE, and Google Drive do.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

The cursor, focus, selection, and drag box travel on the same stream as the document changes, but they are ephemeral.  
They never enter the document, the undo history, or `editor.value`, so a transport is free to drop them and a replicationStore ignores them.

## SharedStore

### connection, disconnect

These methods set the current connection state.  
While disconnected, changes are buffered internally.  
The buffered changes are emitted to subscribers once transmission is possible again.  
The default state is connected (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

Applies changes from other editor instances to the current editor instance.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

Subscribes to changes in the editor.  
Nothing leaves the editor until there is at least one subscriber, and changes made before that are buffered.  
The first subscribe also asks the other editors for their collaboration registers, which settle concurrent edits, so a late joiner settles them the same way.  
It does not bring the document, so [seed](#seeding-a-collaborator) a late joiner first.  
Since `4.0.0` the store asks again each time `setInitialValue` loads a document into its editor after that first subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

Sends the stream batches this store is still holding back, now, instead of after their quiet period.  
Since `3.9.2` it works on a store from `getSharedStore`; in `3.9.1` the method is on the type but does nothing.  
Moving a table, memo, or table group, changing its color, resizing a memo, and scrolling or zooming the view each arrive as a stream of small changes. Resizing a table group does not: it is sent once, when the drag ends.  
The store gathers each stream into one batch and holds it until the stream has been quiet for 200ms. It does this in two stages, so the batch goes out about 400ms after the last change.  
A call ends that wait in both stages. While the store is connected, a subscriber receives the batch before the call returns. A call with nothing held back sends nothing.  
`destroy`, the store's own or the editor's, drops a batch that is still held back, so call this first when you let a store go and the others should keep the last change, as when a tab closes.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy

Completely destroys the sharedStore instance.  
The editor itself is left alone, so leaving a session keeps the document editable.  
The mouse and focus trackers stop once the last sharedStore the editor handed out is destroyed.  
A stream batch the store is still holding back is dropped with it; call [flushStreamBuffers](#flushstreambuffers) first to send it.

```js
sharedStore.destroy();
```
