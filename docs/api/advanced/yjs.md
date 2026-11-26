---
sidebar_position: 2
description: Keep an <erd-editor> element or a headless peer store in step through a Yjs document with @dineug/erd-editor-yjs, seed a room, show presence through Awareness, keep editing offline, and fold the room's history with a compaction sidecar.
---

# Yjs

`@dineug/erd-editor-yjs` keeps diagrams in step through a [Yjs](https://github.com/yjs/yjs) document. It is a package of its own, first released as `0.1.0` beside `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` binds an `<erd-editor>` element, and `bindPeerStore` a headless peer store from `@dineug/erd-editor/peer.js`, to a `Y.Doc`.  
Whatever provider carries the `Y.Doc` carries the diagram: a websocket server, WebRTC, IndexedDB, or your own. The provider and the `Y.Doc` stay yours: the binding never connects, disconnects, or destroys them.

The edits travel as the editor's own action batches, which the binding keeps as the store sent them.  
So the editor's collaboration registers settle edits made at the same moment as they do in a session wired through `getSharedStore`, with the same exceptions, such as a color change — see [Concurrent Edits](./collaborative-editing.md#concurrent-edits).  
Cursors, focus, selections, and drag boxes travel through the provider's Awareness — see [Presence](#presence).  
Compared with wiring a shared store to a transport yourself, the binding adds:

- A client that joins opens the diagram the room holds, with no [runtimeValue](../erd-editor-element.md#runtimevalue) handed over from a running editor.
- A client cut off keeps editing, and its edits land when it reconnects — see [Offline Edits and Rejoins](#offline-edits-and-rejoins).
- A `Y.Doc` a persistence provider hands back opens the diagram it holds — see [What the Room Holds](#what-the-room-holds).
- An optional Node sidecar folds the room's history into one snapshot — see [Compacting a Room](#compacting-a-room).

The binding needs the five methods `5.1.0` added to the shared store and the peer store — [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer), and [reseed](./collaborative-editing.md#reseed) — and makes every call it needs of them itself.

## Installation

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs`, and `y-protocols` are peer dependencies, so a page holds one copy of each: `@dineug/erd-editor` `5.1.0` or later within `5.x`, `yjs` `13.6` or later within `13.x`, and `y-protocols` `1.0` or later within `1.x`.  
The package takes only their types and works on the `Y.Doc` and `Awareness` you pass, so it loads no Yjs, y-protocols, or editor code of its own.  
Two copies of Yjs in one page break each other's constructor checks, and the second logs `Yjs was already imported`. When your code and a provider resolve `yjs` from two places, dedupe it in the bundler (Vite: `resolve.dedupe: ['yjs']`).

The package is ESM-only (`"type": "module"`), with one entry, the package root, and is marked free of side effects, so a bundle that imports only `bindErdEditor` leaves the compactor out.  
`bindErdEditor` needs a DOM, since it binds a defined `<erd-editor>` element. `bindPeerStore` also runs in plain Node, on Node.js 22.12 or later, as the [compaction sidecar](#compacting-a-room) does.

## Usage

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` and `my-diagram` stand for your own server and room.  
Bind, and seed, only once the provider has synced, as y-websocket's `sync` event with `true` tells you. A seed made sooner can replace the room's diagram — see [Seeding a Room](#seeding-a-room).

When the `Y.Doc` holds a room's snapshot at bind time, the binding opens it in the element at once: it loads the snapshot with its registers and version, as [reseed](./collaborative-editing.md#reseed) does, and applies every edit logged since.  
That open clears and closes what a rejoin does — see [Offline Edits and Rejoins](#offline-edits-and-rejoins) — and the element opens where the snapshot puts it. No `rejoin` fires for this first open.  
When the `Y.Doc` holds no snapshot, as in an empty room or before the provider has synced, the element keeps its document, and the binding writes nothing to the room until a snapshot appears, its own [seed](#seed) or another client's.

`bindErdEditor` takes one shared store from the element with [getSharedStore](../erd-editor-element.md#getsharedstore), and [destroy](#destroy) lets it go.  
The element must already be an `<erd-editor>`, its entry imported or `defineErdEditor()` called — see [Registering the Elements](../installation.md#registering-the-elements). Until the tag is defined, an `<erd-editor>` is a plain `HTMLElement`, which the browser upgrades once the tag is defined and the element is in the document. For an element not yet upgraded, `bindErdEditor` throws a `TypeError` rather than raising `error`.

The room's edits apply to the element, and emit [change](../erd-editor-element.md#change), as a collaborator's do, the edits replayed after a snapshot opens among them.  
Opening a snapshot, at bind time or on a rejoin, makes no undo entry, emits no `change`, and writes nothing to the room, apart from the logical-name derive [Offline Edits and Rejoins](#offline-edits-and-rejoins) describes.  
To load another document into a seeded room, make a change every client applies: assign [value](../erd-editor-element.md#value), call [clear](../erd-editor-element.md#clear), or import one.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) is never written to the room, since a shared store does not send it, so it changes only that element while every other client keeps the room's diagram. Seed an empty room with [seed](#seed) instead.

One `Y.Doc` holds one diagram. The binding keeps it under the `Y.Doc`'s `erd:` names and sets the `erd` field of the local Awareness state, and leaves every other name and field alone.  
Give each bound element a `Y.Doc` and an Awareness of its own, as each client of a room has: two bindings that share one Awareness overwrite each other's `erd` field.

## Seeding a Room

A room holds no diagram until a client [seeds](#seed) it.  
What an editor holds meanwhile goes into its own seed, and gives way to another client's seed when that one arrives first: the binding reopens on it with `rejoin('snapshot')`, and the document the element held, with what was edited in it since binding, is gone.

When two clients seed at once, one seed wins on every client.  
The other seeder reopens on it with `rejoin('seedLost')` and loses what it edited since its seed, and so does a client that had joined the losing seed, with `rejoin('snapshot')`. Their edits in the losing seed reach nobody.  
A seed made before the provider has synced counts as made at the same moment as the seed the room's diagram came from, so it can win over it and replace the room's diagram.

## BindOptions

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness

The `Awareness` that carries cursors, focus, selections, and drag boxes, such as the provider's.  
With it, the binding turns on the element's mouse and focus trackers and draws the other clients' presence on the element — see [Presence](#presence).  
Without it only the diagram syncs: the element sends no cursor, focus, or selection and draws no one else's.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname

The name the others see next to this editor's cursor.  
The element's shared store reads it each time it sends, as with [getSharedStore](./collaborative-editing.md#getnickname), and other users see `user` when it is missing or blank.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` returns a function that removes the listener.

### seed

Writes the room's first snapshot from the editor's document and returns `true`.  
Given `value`, a document's text in any form [setInitialValue](../erd-editor-element.md#setinitialvalue) reads, it loads that into the editor first.  
It then lets go, unlogged, of the drags, resizes, and color changes the editor still holds back, so none of them lands in the room after the snapshot. Without `value` the snapshot already shows them, since it takes the editor's document; with `value` they belonged to the document that `value` replaced.  
Then it writes the snapshot [What the Room Holds](#what-the-room-holds) describes.  
Once the room holds a snapshot it returns `false` and writes nothing, without loading `value`, so every client can call it after binding. It also returns `false` once the binding was destroyed or stopped, and on a binding [refused](#onerror) at bind time.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin

The binding reopened the editor on the room's snapshot, as [reseed](./collaborative-editing.md#reseed) does; [Offline Edits and Rejoins](#offline-edits-and-rejoins) says what it keeps and what it loses.  
`reason` tells why:

- `'snapshot'`: the snapshot holds edits the binding had not applied, because it was away while a compactor folded them, or because a compactor put back, in a fold of its own, what it had folded into a snapshot that another compactor's replaced (see [One Compactor per Room](#one-compactor-per-room)). It is also the reason when the snapshot is the first to reach a binding of an empty room, and when it is another seed's and this binding had joined a seed it did not write.
- `'seedLost'`: another client's seed won over the seed this binding wrote.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error

The binding refused to bind, stopped, or turned down an option. Each message starts `erd-editor-yjs: `.

At bind time it binds nothing when:

- the editor or peer store is already bound to this `Y.Doc`;
- its `@dineug/erd-editor` was built before `5.1.0`; the binding destroys the shared store it took from an element;
- the peer store was destroyed before it was bound;
- the room holds a snapshot in a layout this release does not read (see [What the Room Holds](#what-the-room-holds)).

Such a binding raises `error` in a microtask, so a listener added right after the call hears it, and no `rejoin` ever fires on it.

Later the binding stops when:

- the room's snapshot turns to a layout this release does not read. Every binding of this release stops, each editor keeps what it had applied, and nothing edited after is written;
- its peer store was destroyed under it, found the next time the room changes or `seed()` or `compact()` is called.

A binding that stops lets go of the shared store it took, and of its store and `Y.Doc` as a pair, as [destroy](#destroy) does, and keeps its listeners.

For `bindPeerStore` alone, these raise `error` and the binding goes on:

- `compactAfter` is not a positive integer: the binding folds only when asked;
- `electionGraceMs` or `retainMs` is not a number from 0 to 2,147,483,647 ms: its default stands in, since a timer past that range fires at once;
- `synced` rejects: the binding never folds, and leaves the election to the other compactors (see [One Compactor per Room](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy

Sends the drags, resizes, and color changes the editor still holds back into the room, sets the binding's `erd` Awareness field to `null`, so the others drop its cursor, focus, and selection at once, and stops observing the `Y.Doc` and the Awareness.  
For an element it also destroys the shared store it took, leaving the element and its document as they are.  
A second call does nothing. Afterwards what the editor edits reaches nobody.

The peer store, the `Y.Doc`, and the provider stay yours, to destroy after the binding: a peer store destroyed first never sends the drags it still held.  
The element's own [destroy](../erd-editor-element.md#destroy) destroys every shared store it handed out, the binding's included, and drops what they hold back, so destroy the binding first.  
Destroy a binding before binding the same editor or peer store to the same `Y.Doc` again; one that stopped with `error` has already let go.

```js
binding.destroy();
editor.destroy();
```

## Presence

With [awareness](#awareness), the editor's cursor, focused table or cell, selection, and drag box travel in the `erd` field of its local Awareness state, never in the `Y.Doc`, so they never enter the room's history, its snapshot, or a persisted `Y.Doc`.  
The others draw them as they draw a collaborator's presence — see [focusTracker](./collaborative-editing.md#focustracker) — and a client that joins draws the presence the room already shows.  
The element sends its focus and selection again every 30 seconds and its drag box every second. Each of those resends reaches the others even when it repeats the last, so what a user still holds never lapses.

A client that leaves is forgotten at once.  
When Awareness drops its state, or its `erd` field turns `null`, as [destroy](#destroy) sets it, or names another editor, the binding removes that editor's cursor, focus, selection, and drag box from the element with [forgetPeer](./collaborative-editing.md#forgetpeer) rather than wait for them to expire.  
It keeps them while another client still shows the same editor, as an element bound again to another `Y.Doc` of the room does.

## Offline Edits and Rejoins

A client cut off from the provider keeps editing. Its edits wait in its local `Y.Doc`, not in the shared store, and reach the others when the provider reconnects and syncs.

When a compactor folded edits the client never applied while it was away, the snapshot holds them, so on reconnecting the client reopens on the snapshot with `rejoin('snapshot')`, after sending the drags, resizes, and color changes its editor still held back. A fold of only what the client had applied reopens nothing.  
A rejoin onto a snapshot of the seed the binding joined replays every edit the snapshot does not hold, this client's own made while away among them, so none is lost. A rejoin onto another seed keeps nothing, as [Seeding a Room](#seeding-a-room) describes.

Every rejoin clears the undo history, the selection, and the focus, and closes an open [Flow](../../guide/guides/visualization.md#flow-mode) view, a [relationship draw](../../guide/guides/editing-start.md#relationship-creation), and a memo, table group name, or cell editor, since they can name what the snapshot no longer holds.  
A table group name typed and not yet entered is dropped. A logical name cell that closes derives the physical name from a logical name its reader typed, where the reopened document still holds it, as any close of that cell does. That derive is an ordinary edit: the room logs it, it makes an undo entry, and it emits `change` — see [reseed](./collaborative-editing.md#reseed).  
A binding that had joined the room keeps what its reader sees: the scroll position, zoom level, and tab, and the settings a read-only reader changed.  
It also keeps the Name View and the code settings (Code Generator language, name cases, and bracket type) the reader showed of its own, as long as each one's [lock](../../guide/guides/settings.md#lock) was on before the rejoin and is still on after it at the same locked value.  
None of what it keeps reaches `value`, which reports the reopened document's settings — see [reseed](./collaborative-editing.md#reseed) with `keepScreen`.  
The scroll position and zoom level of an element not shown since its last load, and the whole screen of a binding that had not joined yet, open where the snapshot puts them.  
A peer store has no screen, so its rejoin keeps none.

## Read-only Editors

A [read-only](../erd-editor-element.md#readonly) element bound to a room writes nothing to the room's history: its shared store sends no change, only its trackers and the register handshake, and the room [logs neither](#what-the-room-holds).  
It still applies every edit the room carries, and with [awareness](#awareness) its reader's cursor, focus, selection, and drag box still reach the others.  
The settings its reader changes stay on its screen, as on any read-only editor.  
[seed](#seed) is not refused: a read-only element seeds an empty room with the document it holds, or with `value` when given.

## What the Room Holds

The binding keeps the diagram in two names of the `Y.Doc`: `erd:snapshot`, a map that holds a snapshot of the document, and `erd:log`, an array of the editor's action batches since it. A persistence provider stores both with the rest of the `Y.Doc`.

The snapshot holds the document's [runtimeValue](../erd-editor-element.md#runtimevalue), removed entities included, its collaboration registers and version, and how far each writer's edits are folded into it. A seed writes it, and so does every fold of a compactor.  
A seed or a fold made on an `@dineug/erd-editor` before `5.1.1` writes a snapshot with no memo in any table group — see [Mixing Releases](./collaborative-editing.md#mixing-releases).  
Each log entry is one batch as the editor sent it, its meta included, which carries the sender's editor id and nickname.  
Scrolls, zooms, tab switches, presence, and the register handshake are never logged. Every other change the editor sends is, a Name View switch made under its [lock](../../guide/guides/settings.md#lock) among them, which every other client drops.  
A Code Generator language, name case, or bracket type changed under its lock is never sent, so it stays on that editor's screen and never reaches the room.

A `Y.Doc` a persistence provider hands back opens the diagram it holds, as a binding opens any `Y.Doc` that holds a snapshot — see [Usage](#usage).

The snapshot is not a file: its runtime value carries removed entities, which a file must not hold.  
To write the room's diagram to storage, save a bound element's [value](../erd-editor-element.md#value) whenever its [change](../erd-editor-element.md#change) event fires.  
Save it also once after binding, after a [seed](#seed) given a `value`, and in a [rejoin](#onrejoin) listener, since none of those loads emits `change`.  
A [read-only](../erd-editor-element.md#readonly) element never emits `change`, so save from one that is not read-only, or read `value` from a bound peer store, which applies the room's edits as they arrive.  
A [replicationStore](./remote-storage.md) cannot be bound, since it lacks the methods a binding needs, and one fed from a bound element's shared store misses the room's edits — see [Replicating a Live Editor](./remote-storage.md#replicating-a-live-editor).

The layout is private and may change with [ERD_YJS_FORMAT](#exports).  
Read a room only through a binding, and leave the `erd:` names and the Awareness field `erd` to it.

## Compacting a Room

The room's history grows with every edit, and each client that joins replays it all, until something folds it.  
`bindPeerStore` binds a headless peer store from `@dineug/erd-editor/peer.js` and returns an `ErdYjsPeerBinding`: the same [seed](#seed), [on](#erdyjsbinding), and [destroy](#destroy), with [compact](#compact).  
A peer store bound in a Node process beside the server, a sidecar, folds the history into a snapshot of its own diagram.  
An element's binding never folds, and a peer store bound with no `compactAfter` and no `compact()` call is an ordinary headless peer.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

The peer store stays yours: the binding never destroys it. Its nickname is the one `createPeerStore` was given, and `presence: false` keeps it from sending a focus of its own.

A fold writes the snapshot from the peer store's own runtime value, registers, and version, and deletes the log entries it covers and every entry of another seed, all in one transaction.  
Clients that applied everything see the entries go; a client that had not reopens on the snapshot (see [Offline Edits and Rejoins](#offline-edits-and-rejoins)).  
Every fold rewrites the whole diagram into the snapshot, so each one sends every client an update about the size of the diagram's runtime JSON and registers together, however few entries it takes. Set `compactAfter` high enough that the entries a fold takes outweigh one copy of the diagram.

### PeerBindOptions

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Option | Default | Description |
| --- | --- | --- |
| `awareness` | None | Shows the peer store in the room's Awareness, as [awareness](#awareness) does an element. A compactor that folds on its own is marked there, so compactors that see each other elect one to fold, and one that sees no other client folds nothing on its own — see [One Compactor per Room](#one-compactor-per-room). Without it, a compactor folds on its own with no election and no grace. |
| `compactAfter` | None | Fold on its own once the log holds this many entries a fold would take. Without it, or without `synced`, only `compact()` folds, and the fold that puts back (see [One Compactor per Room](#one-compactor-per-room)). |
| `synced` | None | A promise that resolves once the provider has synced. No fold comes before it, `compact()` included. Without it, nothing folds on its own and `compact()` folds at once. |
| `electionGraceMs` | `3000` | With `awareness`, how long the compactor watches the room before it folds on its own, after `synced` and again whenever other clients show after none did. |
| `retainMs` | `600000` (ten minutes) | How long a fold's entries stay held to put back (see [One Compactor per Room](#one-compactor-per-room)), counted from the first update the room sends after the fold. |

An invalid option, or a `synced` that rejects, raises [error](#onerror).

### compact

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Folds at once, with no election, grace, or threshold.  
It first takes in the room's current snapshot, a rejoin included, and sends what its peer store still holds back.  
It answers `{ compacted: true, generation }`, where `generation` counts the snapshot's folds: `0` for a seed, one more per fold.  
Otherwise it answers `{ compacted: false, reason }`:

- `'destroyed'` once the binding was destroyed or stopped, and on a binding [refused](#onerror) at bind time, even before `synced` resolves;
- `'not-synced'` before `synced` resolves;
- `'no-snapshot'` in a room no client has seeded.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## One Compactor per Room

Run exactly one compactor per room, and start a new one only once the old one has stopped. Nothing enforces this.  
Among compactors that see each other in Awareness, only the one with the smallest Yjs client id folds on its own, and when it leaves, or its `synced` rejects, the next one takes over at once.  
A compactor whose Awareness shows no other client, as when its own socket closes and drops them all, folds nothing on its own until others show again and it has watched the room for `electionGraceMs`.

Two compactors cut off from each other, or a restart whose predecessor is still running, can still each fold.  
The room then keeps one of the two snapshots, and the compactor whose snapshot lost puts back what it folded that the winner does not hold, for as long as it holds it: `retainMs`, and at most its latest 1,000 entries, however large each is.  
So nothing is lost when the compactor whose snapshot loses is the one that reconnects, as long as it folded no more than 1,000 entries while apart.  
When it is the one that stayed online and its hold has run out, the room's snapshot and history lack what it folded until it folds again. A client that missed those edits, or one that joins meanwhile, lacks them, and holds back the later edits of each writer whose edits the compactor folded. The compactor's next fold brings them all back, unless the winning snapshot held edits it lacked, which reopens it on that snapshot and loses what it folded for good.

A compactor puts back in a fold of its own, made once it has caught up with the winning snapshot, with no election, grace, or threshold, and every client reopens on that fold with `rejoin('snapshot')`.  
The edits it puts back reach no client apart from that fold, so a client online throughout ends with the others and with one that joins later, even when another writer's later edit builds on one of them, such as a rename of a table another client added.  
Each put-back costs every client that rejoin, with [what a rejoin loses](#offline-edits-and-rejoins). When two compactors put back at once, every client still ends alike, though an edit can stay applied ahead of one it builds on.  
A binding destroyed or stopped before that fold runs, as when a `rejoin` listener destroys it, puts the edits back on their own instead. None is lost, but then a client online throughout can apply one after another writer's edit that builds on it, and end apart from one that joins later.

## Limits

- **The viewport stays on each screen.** Scrolls, zooms, and tab switches are [never logged](#what-the-room-holds), although a session wired through `getSharedStore` sends them (they move no other user's view or tab there either). Each reader keeps their own, and the binding shows it only in its Awareness state, which nothing reads yet. With the `Viewport` or `Canvas Type` [lock](../../guide/guides/settings.md#lock) off, each client's `value` saves its own; under the locks, which a new document has on, every client saves the locked one.
- **The snapshot grows by one entry per binding.** It keeps, for every binding that ever wrote to the room, how far its edits are folded, and never drops one. A binding made again, or one that moved to another seed, counts anew, and so does each fold that puts back. An entry is a 32-character id and a number, so ten thousand writing sessions add a few hundred kilobytes to every snapshot and every fold.
- **A hub and a room relay nothing between them.** An element bound to a room and to a coding agent's [hub](../../mcp/live-and-headless.md#live), or to any other transport through `getSharedStore()`, applies the edits of both, but neither hears the other's, since a shared store never sends on what it received.
- **Adds made at once can be listed apart.** Tables or memos two clients add at once can stand in another order in each client's diagram, as in a session wired through `getSharedStore` — see [Concurrent Edits](./collaborative-editing.md#concurrent-edits).
- **Colors and a few other changes made at once can end apart.** A color change is logged without a version, and each client stamps it with its own as it applies it. Two recolors of one table, memo, or table group made at once can therefore leave clients, and a client that joins later and replays the log, on different colors. So can the other changes each client applies in the order it hears them, such as two column moves within one table or index, or two changes of the database — see [Concurrent Edits](./collaborative-editing.md#concurrent-edits).
- **A leaving cursor waits on the server.** The binding clears a peer's cursor as soon as Awareness drops it. A server that, when a socket closes, removes only the Awareness states that socket first added keeps a client that had reconnected on the others' screens after it leaves, until Awareness times it out, 30 seconds later. One that removes every state a socket last wrote, an update as much as an add, clears it at once.

## Exports

| Export | Description |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Binds an `<erd-editor>` element — see [Usage](#usage). Returns an [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Binds a peer store from `@dineug/erd-editor/peer.js` — see [Compacting a Room](#compacting-a-room). Returns the same with [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | The layout of the `Y.Doc` this release writes, `1`; a binding refuses a room written in another. |

Types: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
