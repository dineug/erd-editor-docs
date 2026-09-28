---
sidebar_position: 3
description: How the MCP server decides between editing live in an editor (VS Code, Obsidian, or a JetBrains IDE) and editing the file on disk, and what saving, undo, and a closed editor do in each.
---

# Live and Headless

For every call the server looks for an editor that holds the document, through the lock files the editors keep in `~/.erd-editor/ide/`.
Each VS Code window and each Obsidian vault window with the ERD Editor keeps one, and a JetBrains IDE keeps one for the whole IDE, listing every project open in it.
An editor removes its lock file when it closes.
What the server finds decides where the edit goes.

| What it finds | What an edit does |
| --- | --- |
| An editor whose workspace, vault, or open project contains the document, or that has it open | **Live.** Opens the document in the ERD Editor if needed, joins the editing session, and applies the change there. Edits appear at once and are saved as the editor saves your own — see [Saving](#saving). |
| No editor | **Headless.** Loads the file, applies the change, and replaces the file. `erd_save` has nothing to do. |
| An editor with its hub off | **Refused.** Reads still work, from disk. A change written to the file under an open editor could be overwritten by its next save, so the server writes nothing. |
| On Windows, an editor that holds the document under another path to the same file: the agent named it through a network share or a mapped drive of this computer, such as `\\localhost\C$\…`, and the editor holds it by its drive path, or the other way round | **Refused**, reads included, with `invalidPath`. The message names the path the editor holds the document by; call again with that path. |
| On Windows, an editor Windows keeps the agent out of: one started as administrator when the agent was not, or any editor when the agent runs in a sandbox | **Refused**, reads included, with `hubUnreachable` and a message that says why. Run the editor and the agent with the same rights, for example by starting the editor again without administrator rights. |

An edit's result names the mode it ran in, `live` or `headless`, and a refused edit says why.
The search runs again on every call, so opening or closing an editor moves the next call with it.

When more than one editor holds the document, one that has it open wins over one that only serves a folder holding it, and among those that serve a folder, the one whose folder lies deepest wins.
A tie, such as two editors that both have it open, goes to the one whose lock file changed last.
So a document in an Obsidian vault inside a VS Code workspace folder goes to Obsidian, unless VS Code has it open and Obsidian does not.

Calls on one document run one at a time, in the order they reached the server. Calls on different documents run side by side.

## Live

The agent joins the editor like one more collaborator.
Its edits reach every editor open on the document at once, and its focus is drawn on the table and cell it is editing, as a collaborator's is — see [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

A read never opens an editor. An edit opens the document in the ERD Editor when it is not open yet, without taking the keyboard focus.

### Saving

Each editor saves the agent's edits the way it saves your own.

In VS Code the agent's edits mark the tab dirty like your own, and reach the disk only when the document is saved.
`erd_save` saves it through VS Code, as its own save command does. You can save instead, with `Ctrl + S` (Windows/Linux) or `⌘ + S` (Mac).
Closing the editor on unsaved agent edits asks whether to save them, as for any other unsaved change.

Obsidian saves the agent's edits about two seconds after editing stops, and closing the tab saves them without asking.
A JetBrains IDE writes them a fraction of a second after editing stops, and closing the tab writes what is still pending; the tab never shows as modified.
In both, `erd_save` writes them at once.

`erd_save` first waits up to two seconds for the editor to hold every edit the agent made.
It is refused with `notSaved` when the editor could not confirm that, or did not write the file: VS Code keeps a tab unsaved when the file changed on disk, and a JetBrains IDE could not write it, such as while a dialog was open or when the file cannot be written.

When the editor closes the document after the agent's last edit, the agent's next call carries a note that those edits are in the file only if they were saved before the editor closed.

### Undo

`erd_undo` reverts the last edit the agent made, never yours, and `erd_redo` applies it again.
The editor's own [Undo](../guide/guides/undo-redo.md) works the other way round: it reverts your edits and never the agent's, since changes that arrive from another editor are not recorded in your history.

A few edits make no undo entry in the editor: the [settings tools](./tools.md#settings) other than `erd_set_show`, and `erd_resize_memo`. An edit that sets a value the document already held changes nothing and makes none either.
`erd_undo` passes over these and names them in its result.

The agent's undo history ends, with a note in the result, when:

- The agent joins the document again, for example after the editor dropped the agent from it.
- The editor exits, or closes the document and stops serving it, and the agent goes on editing the file on disk.
- An editor takes over a document the agent was editing on disk.

The server also closes a document the agent has not called on for 30 minutes, and the undo history goes with it, without a note.

### When the Editor Goes Away

While an editor holds a document, the server never falls back to the file on its own.
If the connection drops, it reconnects.
Only when the editor has exited, or has closed the document and no longer lists it or a folder holding it, does the server edit the file, and it says so in the result.
That happens when you close a diagram that lies outside every folder the editor serves (in VS Code, one opened from outside the workspace), when you turn off the ERD Editor plugin in Obsidian, and when you close the project that holds the document in a JetBrains IDE or turn off the plugin there.
A closed diagram inside a folder the editor serves stays with the editor, and the agent's next edit opens it again.

An editor that still runs, but whose lock file is gone and whose connection closed without its closing the document, refuses the next edit with `hubGone`.
The message says what frees the document: in VS Code, reload that window, or close it to let the agent edit the file directly; in Obsidian, turn the ERD Editor plugin back on, or close that window; in a JetBrains IDE, turn the plugin back on, or quit the IDE.

A read goes to the file on disk instead, with a note that edits not yet saved in the editor are missing, in two cases: when the editor holding the document has its hub off, and in the `hubGone` case above.
A read that cannot connect to an editor's hub is refused with `hubUnreachable`, as an edit is.

## Headless

With no editor serving the document, each edit loads the file, applies the change, and writes the file back.
The write goes to a temporary file beside the document, named `.<name>.<id>.tmp`, which then replaces it, so the document is never left half written, except on Windows in the in-place case described below.

Before that last step the server checks whether the file changed on disk during the call.
If it did, nothing is written, the file is loaded again, and the call is refused with `conflict`. The agent calls again.
A file that changed between two calls is simply loaded again, and the agent's undo history before that is dropped.

A read-only file is left as it is, and the edit is refused with `readonly`: a file without write permission for its owner, or with the read-only attribute on Windows, such as a Perforce or TFVC file that is not checked out.
Make it writable, then call again. Reads still work.

If an editor starts serving the document while the agent edits it on disk, that one edit is refused with `hubAppeared` and nothing is written. The next call edits through the editor.

On Windows two more rules apply:

- A document with permissions of its own, unlike its folder's, is written in place instead of replaced, so that it keeps them, and the temporary file is removed afterwards. A program that reads the document during that write can find text that does not parse.
- A file that another program holds open cannot be replaced, so the server tries again for up to two seconds. Each try first looks for an editor again, and an editor that started serving the document meanwhile refuses the write with `hubAppeared`, or with `blocked` when its hub is off. If the file is still held after two seconds, nothing is written, the file is loaded again, and the call fails with a message that quotes the system error.

## Refused

A VS Code window keeps its lock file even when its hub is off: when `dineug.erd-editor.agentHub.enabled` is off, when the workspace is not trusted, or when its hub could not listen.
An Obsidian vault window keeps its lock file with its hub off when Coding agents is turned off, and when its hub could not listen.
A JetBrains IDE keeps its lock file with its hub off when Coding agents is turned off, when its hub could not listen, and while the IDE exits.

An edit to such a document is refused with `blocked`, because the open editor could overwrite a change written to the file on its next save.
Reads still work, from the file on disk.

To let the agent edit, turn the hub back on, as the message says for that editor: in VS Code, trust the workspace and turn the setting on, or reload the window; in Obsidian, turn Coding agents on, or reload Obsidian; in a JetBrains IDE, turn Coding agents on, or restart the IDE if it is already on.

A JetBrains IDE also refuses, with `hubDisabled`, to change a document held only by projects it does not trust.
Agents can still read such a document, and `erd_list_documents` lists it as `readonly`. Trust the project, then call again.

An editor that keeps no lock file guards nothing, and the agent edits the file on disk even while the diagram is open there.
That is the case for Obsidian or a JetBrains IDE installed as a Flatpak on Linux, a JetBrains IDE without JCEF, and a JetBrains IDE whose hub could not start — see [Set Up Obsidian](./installation.md#set-up-obsidian) and [Set Up a JetBrains IDE](./installation.md#set-up-a-jetbrains-ide).

## Documents

A document is named by `path`, absolute or relative to the server's working directory.

- New documents are `.erd.json`. `erd_open_document` with `create` makes the file, adding `.erd.json` to a name that has no extension.
- Existing `.erd`, `.vuerd`, and `.vuerd.json` files open too. A path with any other extension is refused with `invalidPath`.
- On Windows, a path that holds a name Windows does not store as written is refused with `invalidPath` before the document is read or written, reads included: a name with a colon or another character Windows refuses, such as `orders:v2.erd`; a device name such as `NUL.erd` or `CON.erd`, in any case; or a name ending in a dot or a space. Rename it, for example with `-` in place of `:`.
- A file that is not a document the editor can read, such as one left with merge conflict markers, is refused with `invalidDocument` and left as it is. It is never loaded as an empty diagram and written back.

The agent changes a document only through the tools and is told never to write the file itself.

`erd_list_documents` lists the documents with `path`, `open`, `active`, `dirty`, and `readonly`.
It asks the editor that serves the working directory, chosen as for a document, and lists the diagrams open in it, then the ERD files it serves: those in a VS Code window's workspace folders, in an Obsidian vault, or in every project open in a JetBrains IDE.
Otherwise it lists the ERD files under the working directory, where a read-only file is marked `readonly` and, on Windows, a name Windows does not store as written is left out.
