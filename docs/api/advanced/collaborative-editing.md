---
sidebar_position: 1
description: Relay editor changes between instances with getSharedStore, seed a joining editor from runtimeValue and the store's registers, settle edits made at the same moment, and show each collaborator's cursor, focus, selection, and drag box.
---

# Collaborative Editing

`getSharedStore()` turns an editor into a node in a collaborative session.  
It emits every change as a stream of actions and applies the actions other editors send back — you supply the transport between them (WebSocket, WebRTC, or anything else that can carry JSON).  
It is one of the [ErdEditorElement](../erd-editor-element.md) methods, and pairs with [Remote Storage](./remote-storage.md) when the relayed changes also have to be stored.  
Since `5.1.0`, to share a diagram through a Yjs document and any of its providers instead of wiring the transport yourself, bind the editor with `@dineug/erd-editor-yjs`; see [Yjs](./yjs.md).

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` exports none of these types by name. TypeScript code reaches them through `ErdEditorElement`, as in `ReturnType<ErdEditorElement['getSharedStore']>`.

An action is a plain serializable object describing one change to the document, so it survives `JSON.stringify` on its way to the transport.  
They arrive in batches: `subscribe` hands you an array, and that array is one unit — relay it whole and dispatch it whole on the other side.  
Treat an action as opaque and pass it through verbatim rather than reading or rewriting it, since the bookkeeping it carries, such as its [version](#concurrent-edits), is what keeps the editors in sync.

Some of what an editor does stays on that editor.  
Bringing a table, memo, or table group to the front, as selecting one does, is not sent.  
Neither are the [Schema SQL](../../guide/guides/schema-sql.md) tab's `Statements`, `Header`, `Write logical names into empty comments` (since `4.2.0`), and `Tables` choices, which belong to the window they are made in.  
Since `4.1.0` the [Explorer](../../guide/guides/explorer.md) stays on its editor too: whether it is open, its width, its folded rows, the row the keyboard is on, where its tree is scrolled, and its search and options are not sent.  
Nor is the [light](../../guide/guides/relationship-editing.md#reading-a-connector) that going to a foreign key puts on its relationship's connector.  
Since `4.2.0` the [Dictionary](../../guide/guides/dictionary.md) tab stays on its editor as well: which sheet shows, and each sheet's search, selection, scroll, and column widths are not sent. Its edits, sorts, and CSV imports are.  
A scroll, a zoom, or a tab switch is sent, but it never moves another user's view or tab. That includes the scroll a jump from the Explorer makes, the switch to the ERD tab when the Explorer opens from another tab, and the tab switch and scroll of a jump from the Dictionary tab's [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) sheet to a table or column. A jump from that sheet to a word, term, or domain stays on the Dictionary tab, so none of it is sent.

Since `4.2.0` a [Name View](../../guide/guides/logical-names.md#switching-the-view) switch is sent too, and its [lock](../../guide/guides/settings.md#lock) decides what the other editors do with it. The `Name View` lock is on in a new diagram and in any document from before `4.2.0`.  
While the lock is on, the switch shows only on the editor that made it: it is still sent, but every other editor and every replica drops it, so each user can look at a different view while `value` keeps the locked one.  
While the lock is off, a switch made in an editor that can edit changes the Name View on every editor and replica, the latest switch winning, and every one of them saves it.  
A read-only editor's own switch always stays on that editor, and the editor still follows the shared switches of the others.

Since `5.1.0` a change of the [Code Generator](../../guide/guides/code-generator.md) language, the table name case, the column name case, or the bracket type follows its own lock (`Language`, `Table Name Case`, `Column Name Case`, or `Bracket Type`) the same way, with one difference: while the lock is on, the change is not sent at all.  
It shows only on the editor that made it, whose Code Generator and Schema SQL tabs follow it, and no other editor or replica sees it. `value` and `runtimeValue` keep the locked value, so a joiner seeded from any editor does not see it either, and each user can look at a different language, name case, or bracket type while the lock is on.  
While the lock is off, a change made in an editor that can edit is sent marked as shared (`shared: true` in its payload). It changes the setting on every editor and replica, the latest change winning, and every one of them saves it. A `5.1.0` editor or replica applies a marked change whatever its own lock says, so a change made right after an unlock lands everywhere, even where it arrives before the unlock.  
Before `5.1.0` such a change reached every editor and replica whether or not its lock was on, while the file kept the locked value.

Since `5.0.0` a [read-only](../erd-editor-element.md#readonly) editor sends no change at all. The scroll, zoom, tab, Name View, database, Code Generator language, name cases, bracket type, and `View Option` rows its reader changes stay on its screen, whatever their locks say; before `5.0.0` its scrolls, zooms, tab switches, database, and code settings were sent like an editable editor's.  
Its store still sends what its trackers send of the reader's cursor, focus, selection, and drag box, answers the registers a joining editor asks for, and applies every change the others send. A change of the database, a Code Generator setting, or a `View Option` row reaches its document, and its screen too unless its reader changed that setting there, and a shared Name View switch shows on its screen either way. Since `5.1.0` it gets a Code Generator setting only when that setting was changed with its lock off or an unlock carries it.  
As the editor turns read-only it first sends what the store still holds back of a drag or a scroll, as [flushStreamBuffers](#flushstreambuffers) does, so the others keep the last of it.

[Locks](../../guide/guides/settings.md#lock) are shared: the latest lock or unlock of a setting wins on every editor, and a lock carries the values of the editor that turned it on, so every editor and replica saves the same value.  
A `Viewport` lock therefore saves the view of the editor that turned it on, and a `Canvas Type` lock the last tab that editor was on before the Settings tab, where locks are turned on.  
Turning off the `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`, or, since `4.2.0`, `Name View` lock also sets that setting on every editor to the value shown on the editor that turned it off, its own change made under the lock included, so they keep saving one value. Turning off `Viewport` or `Canvas Type` moves no one's view or tab.

An edit to the `Before tables` or `After tables` script is sent whole when its field loses focus. The two scripts settle separately, so a collaborator's edit of one never overwrites the other.

Nothing done in the Visualization tab's [Flow mode](../../guide/guides/visualization.md#flow-never-edits-the-document) is a document change, so an editor in Flow sends the others no changes, and the changes they send keep applying while it is there.  
There are two exceptions. Leaving Flow for another tab is a tab switch, sent like any other. Since `4.2.0` a pick in the Flow bar's Name View list is a Name View switch, sent and applied like one made on the canvas.  
`Previous table`, `Next table`, and the undo and redo keys, which [step through the views](../../guide/guides/visualization.md#previous-table-and-next-table) in Flow, are not sent.  
The external-link card button, a [quick search](../../guide/guides/quick-search.md#searching-the-diagram) result chosen after `#`, `@`, or `:`, and opening the [Explorer](../../guide/guides/explorer.md#opening-and-closing) all leave Flow for the ERD tab. A scroll the card button or a quick search result makes there is sent too.

## Two Editors on One Page

The subscribe-to-dispatch wiring here stands in for the network, so you can see the shape of a session without a transport in the way.

```js
import '@dineug/erd-editor/erd-editor.js';

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
A room bound with [`@dineug/erd-editor-yjs`](./yjs.md) holds the document itself once a client has [seeded](./yjs.md#seeding-a-room) it, so every editor bound to it opens that document with no `runtimeValue` handed over.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

The runtime value still holds what has been removed since the document was opened, so when another editor later undoes a removal, the joiner brings the table back with its name and columns.  
[`value`](../erd-editor-element.md#value) is the form a file holds, without removed entities, so a joiner seeded from it, or from the file, would bring back an empty, nameless table instead.  
Since `4.2.0` the same goes for a word, term, or domain removed from a [Dictionary](../../guide/guides/dictionary.md) sheet: when another editor undoes the removal, a joiner seeded from `runtimeValue` lists the row again whole, and one seeded from `value` lists an empty row, which its own `value` then leaves out.  
Keep writing `value` to storage: `runtimeValue` is only for seeding another editor, a second view, or a [replicationStore](./remote-storage.md).  
The editors in VS Code, Obsidian, a JetBrains IDE, and the web app seed a second view of an open document this way.

`setInitialValue` is not relayed, so seeding the joiner changes nothing on the others.  
Since `4.0.0` it also drops the editor's collaboration registers, which settle [concurrent edits](#concurrent-edits). If the editor's shared store has already had a subscriber, the store asks the other editors for theirs again, as on its first [subscribe](#subscribe), so an editor loaded again in the middle of a session settles edits the way the others do.  
Assigning `value` keeps the registers, but unlike `setInitialValue` it is relayed: once the editor has a shared store, every editor in the session loads the assigned document, so never seed a joiner that way.

Neither `value` nor `runtimeValue` holds the registers or the version the editor's clock has reached, so a joiner seeded from `runtimeValue` alone takes them from the answer the editors in the session send to its first subscribe.  
Until that answer arrives, an edit the joiner makes can carry a lower version than the others hold, so they refuse it while it stays on the joiner, and an older write still on its way lands over the newer one the seed holds. Where no running editor answers, as when a server or a document store keeps the session's document, the joiner never gets them.  
Since `5.1.0` hand them over with the value. On an editor in the session, call [`flushStreamBuffers()`](#flushstreambuffers), so a drag or a color change it still holds back goes out first, then read `runtimeValue` and its store's [`getLWW()`](#getlww) and [`getVersion()`](#getversion) at the same moment. The joiner loads the value with `setInitialValue`, then takes the rest with its own store's [`mergeLWW`](#mergelww), in that order, since every `setInitialValue` drops the registers. Its next edit then carries a version past every one the seed holds, so it lands with no answer to wait for. On a store that already exists, [`reseed`](#reseed) does both in one call.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

A seed kept this way to open later joiners holds the three together. It is not a file: `value` is still what to write to storage.  
A [replicationStore](./remote-storage.md#runtimevalue-getter) hands over no registers, so a joiner seeded from its `runtimeValue` still takes them from the editors' answer.

## Concurrent Edits

Every editor and replica keeps, for each name and nearly every other field, the version of the write that set it: these are its collaboration registers. A write lands only when its version is not below the one held, so editors that hear the same changes in different orders end on the same document.  
Since `5.1.0` each version carries, beneath its counter, a slot of the writing editor's own, taken from its id. Versions therefore grow in steps of 4,194,304 and outgrow a 32-bit integer once the counter reaches 512. `JSON.stringify` and `JSON.parse` carry them intact, but a relay or store that parses them in another language must keep them as 64-bit numbers, never as 32-bit integers.

Since `5.1.0` two editors that change one name or field at the same moment, apart from the exceptions below, end with the same value on every editor and replica: writing at one counter, they stamp two different versions, and the greater wins everywhere. Before `5.1.0` both could stamp one version, and each editor kept the one it heard last, so they could end apart. Two editors share a slot at odds of 1 in 4,194,304 a pair, and then tie as before.

Since `5.1.0` a table's position, a memo's or table group's position and size, and the view's origin and zoom level are versioned the same way, and what moves them goes out as where it ends:

- a drag as one `table.moveTo`, `memo.moveTo`, or `tableGroup.moveTo` per entity moved, in one batch, so a group drag carries its tables' points with the group's;
- the undo or redo of a drag as the point it puts each entity at;
- a pan as `settings.scrollTo`, and a zoom as `settings.changeZoomLevel`;
- a memo or table group resize as its position and size together.

So two users who move, or move and resize, one table, memo, or table group at the same moment end with it at one point and one size on every editor and replica. The point goes to the write with the greater version, both axes together. A move writes no size, so a resize keeps its size even where a move made at once takes the point.  
Before `5.1.0` a drag went out as the distance moved, so two drags of one table added up, and a move and a resize of one memo or table group made at once could end apart.  
A drag under 20 px, which leaves no undo entry, is sent like any other, so as a point it can override a drag of the same entity that another user made at the same moment. A drag, pan, or zoom batch that a transport delivers twice moves nothing twice.

A color change is one exception. It goes out without a version, and each editor and replica stamps it with its own and keeps the color it heard last, so two users who recolor one table, memo, or table group at the same moment can end with different colors.  
A few changes keep no version at all, so each editor and replica applies them in the order it hears them, and two made at the same moment can end apart too: a column moved within its table or index (`column.move`, `indexColumn.move`), and a change of the [database](../../guide/guides/table-related-functions.md#databases), a [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) row, or the [Settings](../../guide/guides/settings.md) tab's `Relationship DataType Sync`, `Maximum comment width`, or `Column Order`.  
Entities that two users add at the same moment, such as two tables or two columns of one table, can also stand in a different order on each editor and replica, and each one's `value` saves its own order.

All of this holds among editors and replicas of `5.1.0` or later; [Mixing Releases](#mixing-releases) says what an older one changes.

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

An editor from before `4.0.0` ignores the new action types: it never sees a table group or which tables are in it, though a group drag still moves the group's tables there, since it also sends a move of each of those tables.  
It keeps a relationship's old columns after a Map Columns `Save`, and when a column of that old mapping is removed on it, the relationship goes away on every editor. It has no locks and no scripts.  
A document saved from one has none of these, and a `4.0.0` editor opens it with every lock on.  
Keep every editor in a session, and any [replicationStore](./remote-storage.md#dispatch-dispatchsync) that stores its document, on `4.0.0` or later.

A `4.1.0` editor sends no new action type, so `4.0.0` and `4.1.0` editors and replicas share a session with nothing missed.  
Its [Find and Replace](../../guide/guides/find-and-replace.md#replacing) also searches index names and table group names, and `Replace` and `Replace All` rename them on the `index.changeName` and `tableGroup.changeName` actions a `4.0.0` editor already applies.

Since `4.2.0` these changes travel on new action types, and a relay that passes actions through verbatim needs nothing new for them:

- a table's or column's [logical name](../../guide/guides/logical-names.md): `table.changeLogicalName` and `column.changeLogicalName`; whether its name was [derived from the dictionaries](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` and `column.changeNameDerived`;
- a column linked to a [domain](../../guide/guides/dictionary.md#domains-and-data-types) or unlinked: `column.changeDomain`;
- a word, term, or domain added, changed (its place in the sheet included, as a sort sets it), or removed on the [Dictionary](../../guide/guides/dictionary.md) tab: `dictionary.add`, `dictionary.update`, and `dictionary.remove`;
- a [Name View](../../guide/guides/logical-names.md#switching-the-view) switch: `settings.changeNameViewMode`.

The `Name View` lock travels on the existing `settings.changeLockSettings` action, the `Domain` view option on `settings.changeShow`, and a [Column Order](../../guide/guides/settings.md#adjusting-column-order) move of `Logical Name` or `Domain` on `settings.changeColumnOrder`.  
The `editor.clear` and `editor.loadJson` of a Schema SQL, GraphQL, DBML, or AML import from `Import` carry `keepDictionaries: true`, which keeps the words, terms, and domains on every editor. So do those of a replacing [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML`, or `setSchemaAML`.  
A physical name the dictionaries derive travels on `table.changeName` or `column.changeName`, and the data type a domain gives its columns on `column.changeDataType`, the actions an edit by hand sends.

An editor from before `4.2.0` ignores the new action types: it has no logical names, domain links, dictionaries, or Name View. A lock or unlock of `Name View` changes nothing there, and neither does a Column Order move of `Logical Name` or `Domain`, or one onto either of them. Nor does a `Canvas Type` lock turned on by an editor that came to the Settings tab from the Dictionary tab: the older editor does not know that tab, so it keeps `Canvas Type` unlocked. It still shows the physical names the dictionaries derive and the data types domains give.  
Its own edits know nothing of logical names, domains, or the dictionaries, with these effects on the newer editors:

- A table or column it renames by hand keeps its name marked as derived, so a logical name written for it later on a newer editor can derive the name again over the one it typed.
- A data type it gives a column linked to a domain leaves the link, so the `Checks` sheet lists `Domain type mismatch` and the domain's next type change gives the column the domain's type again.
- The foreign key columns of a relationship it adds get no logical name or domain from their key.
- A table it pastes or duplicates arrives with no logical names or domain links.
- A Schema SQL, GraphQL, DBML, or AML import on it sends no `keepDictionaries`, so it empties the words, terms, and domains on every editor.
- Its undo of a load, an import, or `clear()` loads its own copy of the document on every editor, and that copy has no logical names, domain links, or dictionaries.
- That copy, and the document a Schema SQL, GraphQL, DBML, or AML import on it loads, also set the `Name View` lock on every editor back to how that editor found it. Every editor then saves `Physical Names` as the Name View, and shows it too if the lock is off.

A document saved from one has no logical names, domain links, dictionaries, or Name View, so a `4.2.0` editor opens it in `Physical Names`. The older editor does save the `Name View` lock as it found it, so a document unlocked in a `4.2.0` editor stays unlocked.  
Keep every editor in a session, and any [replicationStore](./remote-storage.md#dispatch-dispatchsync) that stores its document, on `4.2.0` or later.

A `5.1.0` editor sends no new action type, so editors and replicas from before `5.1.0` still share a session with it, and a relay that passes actions through verbatim needs nothing new. What [Concurrent Edits](#concurrent-edits) describes, though, holds only among `5.1.0` editors and replicas:

- A `5.1.0` editor's drags travel as points on `table.moveTo`, `memo.moveTo`, and `tableGroup.moveTo`, which older editors already apply, and its pans and zooms as points on `settings.scrollTo` and `settings.changeZoomLevel`, which, like every pan and zoom, no other editor applies and only replicas take. An older editor applies each point of a drag in the order it arrives, outside any register, and an older replica does the same with each point of a drag, pan, or zoom, so two points sent at once for one entity, or for the view, can end apart there.
- An older editor's drag still travels as a distance moved, which every editor and replica adds outside its registers, and its pan or zoom as a distance too, which every replica adds the same way. A distance and a point on one entity made at once can end apart on editors and replicas that hear them in different orders, and a distance that a transport delivers twice is added twice.
- Outside the exceptions [Concurrent Edits](#concurrent-edits) names, a `5.1.0` editor's write of a name or field made at the same moment as an older editor's write of it wins nearly always, the same answer on every editor and replica. Two older editors can still end apart over one field written at once.
- A `5.1.0` editor sends a Code Generator language, name case, or bracket type change only while its lock is off, with the `shared: true` mark, which an older editor ignores, applying the change as before. An older editor still sends one it makes under the lock, unmarked: a `5.1.0` editor or replica drops it while that setting is locked there, and older editors apply it. So under a lock the older editors follow each other's picks while the `5.1.0` editors keep their own, and the file keeps the locked value either way. An unlock made on either release carries the unlocker's value to every editor and replica.
- A load that replaces the document, such as an assigned `value`, `clear()`, or a replacing import, ends a relationship being drawn on every `5.1.0` editor, the one that made it and each one that receives it. An older editor keeps its draw armed through it.

Keep every editor in a session, and any [replicationStore](./remote-storage.md#dispatch-dispatchsync) that stores its document, on `5.1.0` or later, so that edits made at the same moment end alike everywhere, apart from the exceptions [Concurrent Edits](#concurrent-edits) names; `4.2.0` or later is still what keeps logical names and dictionaries. An [MCP server](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) before `1.2.0` counts as an editor before `5.1.0` here, and an editor before `5.1.0` cannot be bound to a [Yjs](./yjs.md) room at all.

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
Since `4.2.0` users can each be looking at a different [Name View](../../guide/guides/logical-names.md#collaborators) while its lock is on, or after a read-only editor's own switch. A focused cell your view does not draw is underlined on the cell it draws in its place: the name and the logical name stand in for each other, as the data type and the domain do.  
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
When a batch holds another editor's request for registers, as a joiner's first [subscribe](#subscribe) sends, the store answers through its subscribers with its registers and its version, unless it holds no registers.  
Since `5.1.0` it first sends every stream batch it still holds back, as [flushStreamBuffers](#flushstreambuffers) does, so each version its answer carries stands on a write the others have been sent. A joiner's arrival therefore makes every editor in the session send at once a drag, pan, zoom, color change, or memo resize it still holds.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

Subscribes to changes in the editor.  
Nothing leaves the editor until there is at least one subscriber, and changes made before that are buffered.  
The first subscribe also asks the other editors for their collaboration registers, which settle [concurrent edits](#concurrent-edits), so a late joiner settles them the same way.  
It does not bring the document, so [seed](#seeding-a-collaborator) a late joiner first; since `5.1.0` the seed can carry the registers too.  
Since `4.0.0` the store asks again each time `setInitialValue`, or since `5.1.0` [reseed](#reseed), loads a document into its editor after that first subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

Sends the stream batches this store is still holding back, now, instead of after their quiet period.  
Since `3.9.2` it works on a store from `getSharedStore`; in `3.9.1` the method is on the type but does nothing.  
Moving a table, memo, or table group, changing its color, resizing a memo, and scrolling or zooming the view are each made as a stream of small changes. Resizing a table group is not: it is sent once, when the drag ends.  
The store gathers each stream into one batch and holds it until the stream has been quiet for 200ms, in two stages. A color change or a memo resize passes both, so it goes out about 400ms after the last change, as every stream did before `5.1.0`. Since `5.1.0` a drag, a pan, or a zoom goes out after the first stage, about 200ms after its last step, as where it ends (see [Concurrent Edits](#concurrent-edits)).  
A call ends that wait in both stages. While the store is connected, a subscriber receives the batch before the call returns. A call with nothing held back sends nothing.  
`destroy`, the store's own or the editor's, drops a batch that is still held back, so call this first when you let a store go and the others should keep the last change, as when a tab closes.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW

Since `5.1.0`, returns a copy of the editor's collaboration registers (see [Concurrent Edits](#concurrent-edits)).  
The copy is made through JSON, so it is a plain object ready for `JSON.stringify`, and a change to it leaves the store's registers as they were.  
Hand it as it is to another store's [mergeLWW](#mergelww) or [reseed](#reseed). Its shape is the editor's own, so read no field of it.  
Read it with [getVersion](#getversion) and the editor's `runtimeValue` at the same moment to [seed a joiner](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW

Since `5.1.0`, takes registers that another store handed out with [getLWW](#getlww) into this store's, keeping the greater version of each, and takes `version` into the editor's clock, which keeps the greater of its own and the one given.  
It changes nothing in the document: no byte of `value` or `runtimeValue`, no undo entry, and no `change` event. It only raises the versions a later write has to beat, so a write older than the registers given is refused afterwards, and the editor's next edit carries a version past `version`.  
It sends nothing and answers nothing. It is what a joiner's first subscribe gets from the others' answer, taken in directly.  
Call it after `setInitialValue`, never before: every `setInitialValue` and every [reseed](#reseed) drops the registers held, and with them what a `mergeLWW` before it took in.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion

Since `5.1.0`, returns the highest version the editor's clock has merged: the greatest of the versions of the changes it made or took in, of the requests for registers and the answers a join exchanges, and of each `version` given to `mergeLWW` or `reseed`.  
Cursors, focus, selections, and drag boxes, its own or another editor's, do not move it.  
Hand it over with [getLWW()](#getlww), read at the same moment, to a joiner's [mergeLWW](#mergelww) or [reseed](#reseed). It is a [version](#concurrent-edits) like those its actions carry.

```js
const version = sharedStore.getVersion();
```

### forgetPeer

Since `5.1.0`, removes at once the cursor, focus, selection, and drag box that the editor with the given id sent, and the expiry each was waiting on. Every other editor's stay.  
The id is the `meta.editorId` carried by every action that editor's shared store sends. An id this editor holds nothing of changes nothing.  
Call it when your transport learns that a peer has left. Otherwise what the peer sent stays drawn until it expires: its cursor 30 seconds after the last one received, its focus and selection 90 seconds after, and its drag box 3 seconds after.

```js
sharedStore.forgetPeer(editorId);
```

### reseed

Since `5.1.0`, opens a session's document in the editor again, as a rejoin does. The [Yjs](./yjs.md) binding calls it to open a room's document when it binds to a room that has been seeded, and again on each rejoin, keeping the screen once it had joined the room.  
It loads `value` as [setInitialValue](../erd-editor-element.md#setinitialvalue) does and takes `lww` and `version` as [mergeLWW](#mergelww) does, so the store then holds exactly the registers given, and its clock the greater of its own version and `version`. It also empties the undo history and, unlike `setInitialValue`, drops the selection and the focus, since they may name what the value no longer holds.  
Apart from the logical-name derive below, it makes no undo entry, emits no `change` event, and sends no change. Once the store has had a subscriber, it sends the request for registers that every such load sends, which a transport that already handed the registers over may drop, and, with the [focusTracker](#focustracker) on, the cleared selection and focus.  
Like `setInitialValue`, it works while [readonly](../erd-editor-element.md#readonly) is set, discards a Flow view, ends a relationship being drawn, and closes the memo, table group name, and cell editors, keeping or dropping what was typed in them the same way; a name that a closing logical name cell derives from what its reader typed is an ordinary edit: sent, undoable, and emitted as a `change` event.

Without `keepScreen` the screen shows what the value holds, as after `setInitialValue`. With `keepScreen: true` the reader's screen is laid back over the loaded document, on that screen alone:

- the scroll position and zoom level, once the element has shown them; one never shown, or loaded while hidden and not shown since, opens where the value puts it, as a late joiner does;
- the tab, when the load moved it, and on the Settings tab also the tab the reader came from, which a `Canvas Type` lock taken there names;
- the Name View and each Code Generator setting that the reader showed of its own under its lock, but only when that lock was on before the load, is still on after it, and holds the same locked value. So when a peer unlocked, changed, and locked a setting again at another value meanwhile, the editor opens on the new locked value, and where the lock is off before or after the load, it shows the loaded value;
- every setting a read-only reader changed on its own screen, whatever the locks say.

None of this is sent, and `value` and `runtimeValue` still report the loaded document. A peer's later unlock replaces a code setting kept this way, as any unlock does.  
The reader's next scroll or zoom made while the editor can edit makes the kept scroll position and zoom level the document's again, and goes out led by where the screen stands, so replicas take that zoom too.

A reseed leaves what the store holds back as it is. A drag, pan, or zoom still held goes out after it, read off the reseeded document; a color change or memo resize goes out as it was made, though the editor no longer shows it; and what `disconnect()` held goes out on `connection()`.  
So call [flushStreamBuffers](#flushstreambuffers) first, send what it emits, and reseed with a value that holds it. Never reseed while disconnected.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy

Completely destroys the sharedStore instance.  
The editor itself is left alone, so leaving a session keeps the document editable.  
The mouse and focus trackers stop once the last sharedStore the editor handed out is destroyed.  
A stream batch the store is still holding back is dropped with it; call [flushStreamBuffers](#flushstreambuffers) first to send it.  
The cursors, focus, selections, and drag boxes that other editors sent stay drawn until they expire; since `5.1.0` [forgetPeer](#forgetpeer) removes one editor's at once.

```js
sharedStore.destroy();
```
