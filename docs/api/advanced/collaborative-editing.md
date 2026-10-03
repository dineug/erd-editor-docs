---
sidebar_position: 1
description: Relay editor changes between instances with getSharedStore, and show each collaborator's cursor, focus, selection, and drag box.
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

Since `3.10.0` a change to a relationship's [ON DELETE or ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) travels as one of two new action types, `relationship.changeOnDelete` and `relationship.changeOnUpdate`, and `relationship.add` can carry both. A relay that passes actions through verbatim needs nothing new for them.  
An editor from before `3.10.0` ignores those action types and fields. In a session that mixes releases, the older editors never learn a relationship's ON DELETE or ON UPDATE, and a document saved from one of them has neither. A relationship an older editor adds arrives without them, so both start at `Not set`.  
Keep every editor in a session, and any [replicationStore](./remote-storage.md#dispatch-dispatchsync) that stores its document, on `3.10.0` or later.

Every other change a `3.10.0` editor sends travels on action types older editors already know.  
`Replace All` in [Find and Replace](../../guide/guides/find-and-replace.md#replacing) sends its edits as one batch of the same rename, comment, and memo actions an edit by hand sends. The `Alternate Key` and `Referential Actions` [view options](../../guide/guides/table-related-functions.md#table-view-options) travel on the existing `settings.changeShow` action.

Nothing done in the Visualization tab's [Flow mode](../../guide/guides/visualization.md#flow-never-edits-the-document) is a document change, so an editor in Flow sends the others no changes, and the changes they send keep applying while it is there.  
The one exception is leaving Flow for another tab: that tab switch is sent like any other.  
The external-link card button, a [quick search](../../guide/guides/quick-search.md#searching-the-diagram) result chosen after `#`, `@`, or `:`, and opening [Find and Replace](../../guide/guides/find-and-replace.md#opening-and-closing) all leave Flow for the ERD tab. A scroll the card button or a quick search result makes there is sent too.

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
The table and cell you have focused, the tables and memos you have selected, and the box you drag on the canvas are sent to the other editors and drawn there.  
Each user gets a color of their own, so you can tell them apart: an outline on the focused table, an underline on the focused cell, a ring around the selected tables and memos, and a dashed rectangle for the drag box.  
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
The first subscribe also asks the other editors for their current state, so a late joiner catches up.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

Sends the stream batches this store is still holding back, now, instead of after their quiet period.  
Since `3.9.2` it works on a store from `getSharedStore`; in `3.9.1` the method is on the type but does nothing.  
Moving a table or memo, changing its color, resizing a memo, and scrolling or zooming the view each arrive as a stream of small changes.  
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
