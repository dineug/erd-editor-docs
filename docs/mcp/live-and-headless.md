---
sidebar_position: 3
description: How the MCP server decides between editing live in a VS Code window and editing the file on disk, and what saving, undo, and a closed window do in each.
---

# Live and Headless

For every call the server looks for a VS Code window that holds the document, through the lock files the extension keeps in `~/.erd-editor/ide/`.
What it finds decides where the edit goes.

| What it finds | What an edit does |
| --- | --- |
| A window whose workspace contains the document, or that has it open | **Live.** Opens the document in the ERD Editor if needed, joins the editing session, and applies the change there. Edits appear at once and stay unsaved until the agent calls `erd_save` or you save. |
| No window | **Headless.** Loads the file, applies the change, and replaces the file. `erd_save` has nothing to do. |
| A window with its hub off | **Refused.** Reads still work, from disk. A change written to the file under an open editor would be overwritten by its next save, so the server writes nothing. |

An edit's result names the mode it ran in, `live` or `headless`, and a refused edit says why.
The search runs again on every call, so opening or closing a window moves the next call with it.

Calls on one document run one at a time, in the order they reached the server. Calls on different documents run side by side.

## Live

The agent joins the editor like one more collaborator.
Its edits reach every editor open on the document at once, and its focus is drawn on the table and cell it is editing, as a collaborator's is — see [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

A read never opens an editor. An edit opens the document in the ERD Editor when it is not open yet.

### Saving

The agent's edits mark the tab dirty like your own, and reach the disk only when the document is saved.
`erd_save` saves it through VS Code, as its own save command does. You can save instead, with `Ctrl + S` (Windows/Linux) or `⌘ + S` (Mac).

`erd_save` is refused with `notSaved` when the editor could not confirm that every edit reached it, or when VS Code kept the tab unsaved, for example because the file changed on disk.

Closing the editor on unsaved agent edits asks whether to save them, as for any other unsaved change.
The agent's next call then carries a note that its edits are in the file only if they were saved before the editor closed.

### Undo

`erd_undo` reverts the last edit the agent made, never yours, and `erd_redo` applies it again.
The editor's own [Undo](../guide/guides/undo-redo.md) works the other way round: it reverts your edits and never the agent's, since changes that arrive from another editor are not recorded in your history.

A few edits make no undo entry in the editor: the [settings tools](./tools.md#settings) other than `erd_set_show`, and `erd_resize_memo`. An edit that sets a value the document already held changes nothing and makes none either.
`erd_undo` passes over these and names them in its result.

The agent's undo history ends, with a note in the result, when:

- The agent joins the document again, for example after the editor dropped the agent from it.
- The window exits and the agent goes on editing the file on disk.
- A window takes over a document the agent was editing on disk.

The server also closes a document the agent has not called on for 30 minutes, and the undo history goes with it, without a note.

### When the Window Goes Away

While a window holds a document, the server never falls back to the file on its own.
If the connection drops, it reconnects. Only when the window has exited does it edit the file, and it says so in the result.

A window that still runs but whose lock file is gone refuses the edit with `hubGone`. Reload that window, or close it to let the agent edit the file directly.

A read that cannot reach the window reads the file on disk instead, with a note that edits not yet saved in the editor are missing.

## Headless

With no window on the document, each edit loads the file, applies the change, and writes the file back.
The write goes to a temporary file beside the document, named `.<name>.<id>.tmp`, which then replaces it, so the document is never left half written.

Before that last step the server checks whether the file changed on disk during the call.
If it did, nothing is written, the file is loaded again, and the call is refused with `conflict`. The agent calls again.
A file that changed between two calls is simply loaded again, and the agent's undo history before that is dropped.

If a VS Code window starts serving the document while the agent edits it on disk, that one edit is refused with `hubAppeared` and nothing is written. The next call edits through the window.

## Refused

A window keeps its lock file even when its hub is off: when `dineug.erd-editor.agentHub.enabled` is off, when the workspace is not trusted, or when the hub failed to start.
An edit to such a document is refused with `blocked`, because the open editor would overwrite a change written to the file on its next save.
Reads still work, from the file on disk.

To let the agent edit, trust the workspace and turn the setting on, or reload the window.

## Documents

A document is named by `path`, absolute or relative to the server's working directory.

- New documents are `.erd.json`. `erd_open_document` with `create` makes the file, adding `.erd.json` to a name that has no extension.
- Existing `.erd`, `.vuerd`, and `.vuerd.json` files open too. A path with any other extension is refused with `invalidPath`.
- A file that is not a document the editor can read, such as one left with merge conflict markers, is refused with `invalidDocument` and left as it is. It is never loaded as an empty diagram and written back.

The agent changes a document only through the tools and is told never to write the file itself.

`erd_list_documents` lists the documents with `path`, `open`, `active`, `dirty`, and `readonly`.
With a VS Code window serving the working directory it lists that window's documents, and otherwise the ERD files under the working directory.
