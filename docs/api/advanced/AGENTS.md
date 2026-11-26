# advanced

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-03 · **Updated:** 2026-11-26

## Purpose

The `Advanced` category of the `api` sidebar. Its pages are for code that moves a document
between editors or stores it outside one: collaboration, the Yjs binding, the headless replica, and
the `.erd.json` format. In Key Files, a source path is under `../erd-editor/packages/` unless the
row says otherwise.

## Key Files

| File | Description |
|------|-------------|
| `_category_.json` | Label `Advanced`, `position: 5` (after `../to-image.md`'s 4), a `generated-index` with no `description`, so `current.json` holds only the key `sidebar.api.category.Advanced`. Its route, `/docs/category/advanced`, is linked from no page |
| `collaborative-editing.md` | 1 · `getSharedStore()`: Two Editors on One Page, Seeding a Collaborator, Concurrent Edits (what settles the same everywhere, and the exceptions), Mixing Releases (what a `5.1.0` editor changes for older ones, then a `5.1.1` block: `memo.changeGroup` and what an older editor does to memos' table groups), `SharedStoreConfig` (getNickname, mouseTracker, focusTracker), and `SharedStore` with one H3 per method, from `connection, disconnect` to `reseed` and `destroy`. Source: `erd-editor/src/engine/shared-store.ts`, `presence.ts` and `clock.ts` beside it |
| `yjs.md` | 2 · The `@dineug/erd-editor-yjs` package (`0.1.0`): Installation (peer ranges), Usage, Seeding a Room, `BindOptions`, `ErdYjsBinding` (seed, on@rejoin, on@error, destroy), Presence, Offline Edits and Rejoins, Read-only Editors, What the Room Holds, Compacting a Room (`PeerBindOptions`, compact), One Compactor per Room, Limits, Exports. Source: `erd-editor-yjs/src/` (`binding.ts`, `awareness.ts`, `compact.ts`), and `erd-editor/src/peer/` for `@dineug/erd-editor/peer.js` |
| `remote-storage.md` | 3 · `createReplicationStore` from `@dineug/erd-editor/engine.js`: Installation, Usage, Replicating a Live Editor, `InjectEngineContext` (`toWidth`), and `ReplicationStore` (value getter, runtimeValue getter, setInitialValue, on@change, `dispatch, dispatchSync`, destroy). Source: `erd-editor/src/engine/replication-store.ts`, `context.ts` (`InjectEngineContext`) and `to-width.ts`. The hosts use the store through `replication-store-worker/`, a private package |
| `schema.md` | 4 · The `.erd.json` format: Storage Form (what a file holds and what it leaves out), TypeScript (`ERDEditorSchemaV3`, Settings, Doc, one H3 per collection, Dictionary Rows), and JSON Schema, which reproduces the whole schema file. Since `5.1.1` a memo carries `groupId` as a table does: the Storage Form rule, the `Memo` type with the note under the `memoEntities` block, the `tableGroupEntities` intro, the JSON Schema intro and the block's memo entity all name it. Source: `erd-editor-schema/src/storageForm.ts` (the writer), `erd-editor-schema/src/v3/schema/` (one file per entity type), and `../erd-editor/json-schema/schema.json` at the repo root |

## For AI Agents

### Working In This Directory

- **`schema.md` has a copy of a source file.** Its second `json` block is byte-equal to
  `../erd-editor/json-schema/schema.json`, which is 584 lines at `v5.1.1`. When the schema changes,
  replace the whole block from the file rather than editing it by hand. The TypeScript blocks list
  each type's fields "in the order a file writes them", so they follow `storageForm.ts`.
- **Release mixing is described in four pages.** `collaborative-editing.md#mixing-releases` is the
  home. `remote-storage.md` repeats the `5.1.0` and `5.1.1` rules for a replica under
  `dispatch, dispatchSync`. `yjs.md` names the five store methods `5.1.0` added, and each links its
  H3 in `collaborative-editing.md`: `#getlww`, `#mergelww`, `#getversion`, `#forgetpeer`, `#reseed`.
  Renaming one of those methods renames its anchor and breaks the link. `yjs.md`'s What the Room
  Holds and `schema.md`'s note under `memoEntities` each give the `5.1.1` memo groups one sentence and
  link the home.
- **Version floors are not pins.** `yjs.md`'s "`@dineug/erd-editor` `5.1.0` or later within `5.x`",
  `yjs` `13.6` and `y-protocols` `1.0` are the published peer ranges of `@dineug/erd-editor-yjs`.
  A release bump doesn't move them with the pins: `5.1.1` shipped no new `erd-editor-yjs` (still
  `0.1.0`), so the floor stays `5.1.0`. `yjs` and `y-protocols` are literal in
  `../erd-editor/packages/erd-editor-yjs/package.json` (`^13.6`, `^1.0`). `@dineug/erd-editor`
  is `workspace:^` there, which becomes `^<erd-editor version>` when the package is
  published. So the floor rises whenever a new `erd-editor-yjs` ships beside a new
  `erd-editor`, even though package.json doesn't change. Check the published range with
  `npm view @dineug/erd-editor-yjs@<version> peerDependencies`.
- **Anchors from punctuated headings.** `### on@change` is `#onchange`, `### dispatch, dispatchSync`
  is `#dispatch-dispatchsync`, and `### runtimeValue getter` is `#runtimevalue-getter`. Other pages
  link all three. The most linked anchors here are `schema.md#storage-form` (5 pages),
  `collaborative-editing.md#mixing-releases` (6), `schema.md#json-schema` (3), `#getlww` (3),
  `#getversion` (3) and `#concurrent-edits` (3).

### Testing Requirements

- After any change to `schema.md`'s JSON Schema block, this must print nothing:

  ~~~sh
  awk '/^## JSON Schema/{f=1} f' docs/api/advanced/schema.md \
    | awk '/^```json/{n++; if(n==2){p=1; next}} /^```$/{if(p) exit} p' \
    | diff - ../erd-editor/json-schema/schema.json
  ~~~

- Check concurrency claims, such as what settles the same everywhere and what "a `5.1.0` editor
  sends", against `../erd-editor/packages/erd-editor/src/engine/` at `v5.1.1`. Its `peer-store.*.test.ts` and
  `shared-store.test.ts` files test that behavior.

### Common Patterns

- An API object gets an H2, and each of its members an H3 in code spelling. A listener is written
  `on@<event>`, as in `### on@change` and `### on@rejoin`.
- `schema.md` explains in prose when the storage form leaves a field out, as in
  "`settings.ddlScripts` only while a script holds text". The types mark such a field `?`, so a
  new optional field needs both.

## Dependencies

### Internal

- `../erd-editor/packages/erd-editor-schema/`, `../erd-editor/packages/erd-editor-yjs/`,
  `../erd-editor/packages/erd-editor/src/engine/`: the code these pages describe.
- `../erd-editor/json-schema/schema.json`: the file `schema.md` reproduces and links by its raw
  GitHub URL.

### External

- Yjs, y-protocols and a provider such as `y-websocket`, all installed by `yjs.md`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
