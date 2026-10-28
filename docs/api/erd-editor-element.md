---
sidebar_position: 2
description: The erd-editor element API — registering it, attributes, value and runtimeValue, events, theming, display language, the welcome screen, key bindings, and schema import and export.
---

# ErdEditorElement

The editor is a plain `HTMLElement`, the `<erd-editor>` tag that importing `@dineug/erd-editor/erd-editor.js` defines.  
Since `5.0.0` importing the package root defines no tag. The root exports `ErdEditorElement` as both the element's type and its class, and `defineErdEditor()`, which defines the tag where you call it — see [Registering the Elements](./installation.md#registering-the-elements).  
For a page that only shows a diagram, [`<erd-viewer>`](./erd-viewer-element.md) is a read-only element of its own.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

Its type definition is as follows.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

The editor renders into a closed shadow root, so `editor.shadowRoot` is `null` and page styles do not leak in or out.  
Nothing inside can be reached with a selector — style it through [setTheme](#settheme) and the `--erd-editor-*` custom properties instead.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker`, and `enable-welcome-screen` are the only attributes, and all five default to `false`. The last two are new in `4.0.0`. Each one reads its value as [readonly](#readonly) describes.

Since `4.1.0` the ERD tab has an [Explorer](../guide/guides/explorer.md), a tree of the diagram docked left of the canvas with Find and Replace at its top. No attribute, property, method, or event opens, closes, or reports it: it opens from the toolbar's `Explorer` button, from `Toggle Explorer` in quick search or the canvas context menu, or with the [`findReplace`](#setkeybindingmap) binding.  
Every element starts with it closed. Whether it is open, its width, its folding, and its search last as long as the element does, through tab switches and every load, `setInitialValue` included, and are never in `value`, `runtimeValue`, the undo history, or a shared store.

Since `4.2.0` tables and columns can have [logical names](../guide/guides/logical-names.md) beside their names, and the Name View, a document setting like the tab, decides whether the canvas draws their names, their logical names, or both.  
The toolbar also has a [Dictionary](../guide/guides/dictionary.md) tab, between `Code Generator` and `Settings`, holding the document's words, terms, and domains and a `Checks` sheet. It is a tab like the others: its `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, is held by the `Canvas Type` lock, so a text saved on it opens on it through [setInitialValue](#setinitialvalue), and a switch to it is written to `value` and emits [change](#change) only while that lock is off. No attribute, property, method, or event of its own opens it or reports on it. Its edits are document changes: they are in `value`, emit [change](#change), and reach collaborators, but their undo and redo run on each sheet's own history, not the document's.  
The tab's own place — which sheet shows, `Domains` at first, and each sheet's search, selection, scroll, and column widths — lasts as long as the element does, through tab switches and every load, and is never in `value`, `runtimeValue`, an undo history, or a shared store.  
The `ErdEditorElement` interface gains no member. What the API adds is `logicalNameAsComment` in [getSchemaSQL](#getschemasql)'s options, twelve [theme tokens](#settheme), and the [dictionaryRowChords](#dictionaryrowchords) export.

## readonly

Sets the editing capability of the editor.  
While it is set, assigning `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, undo, and redo, since `4.2.0` a Dictionary sheet's included, are all ignored, and the `change` event is never emitted. Load a document with [setInitialValue](#setinitialvalue) instead.  
Since `5.0.0` a read-only editor is a reader rather than an editor with its controls disabled. It keeps its six tabs, the [Explorer](../guide/guides/explorer.md#read-only-editors), the minimap, quick search, Table Properties, the [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer), `Export`, zen mode, and the cursors, focus, and selections of collaborators, and every control that would edit the diagram is left out instead of drawn disabled. Before `5.0.0` many of its editing controls were still drawn, and the editor dropped what they sent.

On the ERD tab a drag pans wherever it starts, on a table too, and a press selects, moves, and opens nothing. The pointer resting on a table lights its relationships, a still click on a table or a relationship keeps that light, and a still click anywhere else puts it out, as in [`<erd-viewer>`](./erd-viewer-element.md). The only selection is the outline a jump leaves: going to an Explorer row, one of its Find matches, or a quick search result after `#`, `@`, or `:` selects what it reaches, and the next still click clears it. Copying copies what that selection holds.  
The [canvas toolbar](../guide/guides/table-related-functions.md#canvas-toolbar) keeps `Zoom out`, the zoom level (`Reset zoom`), `Zoom in`, the Name View list, `Zen Mode`, and the compass, with no `Hand` or `Select`, no `New Table`, `New Memo`, or `New Table Group`, and no relationship buttons. The canvas menu keeps `View Option`, `Name View`, `Export`, and `Diff Viewer`, the table menu keeps `Table Properties`, and a memo, a relationship, or a table group raises no menu. Quick search on the ERD tab lists no row that writes the diagram: it keeps `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, the `Theme` and `Display Language` rows that [enableThemeBuilder](#enablethemebuilder) and [enableLocalePicker](#enablelocalepicker) turn on, and the `#`, `@`, and `:` searches. On the other tabs it lists what it lists in an editable editor. The toolbar shows the database name as text and no `Undo`, `Redo`, or `Time Travel` button.  
Nothing offers `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, a table group row (see [Table Groups](../guide/guides/table-groups.md#read-only-editors)), or [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), and no [welcome screen](#enablewelcomescreen) shows.  
The bindings that add, remove, or edit do nothing: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, the four relationship bindings, and `handTool`, each still prevented as its option says. A paste and `Tab` do nothing either and reach the page unprevented. The zoom bindings, `zenMode`, `focusView`, `tableProperties` on the table a jump selected, `search`, `findReplace`, copying, `Escape`, and the arrow keys keep working. No cell, memo, or table group name editor opens, and no relationship is drawn.

[Find and Replace](../guide/guides/find-and-replace.md#read-only-editors) at the top of the Explorer finds only, with no `Toggle Replace` arrow and no Replace row. The panel is titled `Explorer`, and the toolbar button's tooltip is `Explorer (Ctrl + F)` (Windows/Linux) or `Explorer (⌘ + F)` (Mac) in every editor. The Explorer has opened in a read-only editor since `4.1.0`; from `3.10.0` to `4.0.0` Find and Replace opened there as a find-only floating panel titled `Find`.  
Table Properties opens from the table menu or the `tableProperties` binding, and since `3.10.0` it shows a `Read only` badge beside its title and its `Indexes` tab offers no edits — see [Table Properties](../guide/guides/table-related-functions.md#table-properties).  
The Settings tab carries the same `Read only` badge and shows every setting in a control that takes no press: its two switches, the `Maximum comment width` field, and the seven `Lock` buttons are disabled, and the `Column Order` rows do not drag. The Schema SQL tab's `Before tables` and `After tables` scripts take no typing. The [Visualization](../guide/guides/visualization.md) tab works as in an editable editor, since nothing there edits the document; Flow's `Previous table` and `Next table` still step, by their buttons or the undo and redo keys.  
The [Dictionary](../guide/guides/dictionary.md#read-only-editors) tab still opens: its sheets can be switched, searched, selected, scrolled, and copied from, and a row of the `Checks` sheet still goes to what it names. No cell takes an edit, a paste, or a clear, the tab shows no `Add Row`, `Delete Rows`, `Import CSV`, or `Export CSV` tool and no menu on the grid, and its row chords insert and delete nothing. The table menu, the canvas menu, and quick search offer no [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) or `Derive Physical Name Again`.

Since `5.0.0` the settings a reader can still change stay on that editor's screen: the scroll and the zoom, the tab, the database, the Code Generator language, both name cases, the bracket type, the `View Option` rows, and the [Name View](../guide/guides/logical-names.md#read-only-editors) from each of its pickers, which has stayed on the screen since `4.2.0`. Whatever their [locks](../guide/guides/settings.md#lock) say, none of them reaches `value`, `runtimeValue`, the `json` export, the undo history, the [change](#change) event, or a shared store, so `value` keeps the document's settings however the reader looks at it. The [Schema SQL](../guide/guides/schema-sql.md#read-only-editors) and Code Generator option panels caption those settings `This window only` while `readonly` is set, where an editable editor's read `Saved in the document`. What the two tabs show, copy, and save follows the screen, and so does [getSchemaSQL](#getschemasql) called without a vendor.  
Before `5.0.0` a reader's scroll, zoom, tab switch, database, and code settings went to `value` while no lock held them, which the database never has, and a shared store sent them to the other editors.  
The Schema SQL tab's own `This window only` choices, `Statements`, `Header`, since `4.2.0` `Write logical names into empty comments`, and `Tables`, are never saved in any editor and still apply, and so do the [`Export image`](../guide/guides/file-import-export.md#image) dialog, the theme builder, and the Display Language picker. A pick in the theme builder or the Display Language picker still emits [changePresetTheme](#changepresettheme) or [changeLocale](#changelocale).

While it is set, nothing enters the undo history, a scroll or a zoom included, and a [shared store](#getsharedstore) of the editor sends no change: only what its trackers send of the reader's cursor, focus, selection, and drag box, and the registers another editor asks for when it joins (see [Collaborative Editing](./advanced/collaborative-editing.md)). It still applies every change the others send. A change of the database, a Code Generator setting, or a `View Option` row reaches the document, and the screen too unless the reader changed that setting there, and a shared Name View switch shows on the screen either way.

Turning it on ends what stood open: a cell, memo, or table group name editor, a relationship being drawn, a drag of a table, memo, table group, or column, an Alt drag's copies, a memo or table group resize, an Auto Layout preview or placement still running, `Map Columns`, Time Travel, and the color picker. It clears the selection, puts the hand tool down, and first sends what each shared store still holds back of a drag or a scroll, as [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) does. Table Properties, now read-only, the Diff Viewer, and the `Export image` dialog stay open, and the scroll, zoom, tab, and Name View stay as they were. An element that is read-only when it first mounts starts the same way, and one a host moves in the page keeps the outline a jump left.  
Turning it off brings the editing controls back with nothing selected or open. The database, the Code Generator language, both name cases, the bracket type, and the `View Option` rows go back to the document's, while the scroll, zoom, tab, and Name View stay where the reader left them and `value` keeps the document's until the reader changes them again. Neither turn emits `change`.  
A bare attribute, `=""`, and `="true"` all read as `true`. `="false"` reads as `false`, and so does any other string — including the HTML idiom `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

Determines whether to automatically synchronize with the system's dark/light mode.  
Since `4.0.0` turning it on sets the theme's `appearance` to `'system'`, as `setPresetTheme({ appearance: 'system' })` does. The editor then shows the light or dark the operating system reports, or the one [setSystemAppearance](#setsystemappearance) names, and switches when that changes.  
A later [setPresetTheme](#setpresettheme) with `'light'` or `'dark'`, or a `Light` or `Dark` pick in the theme builder or quick search, replaces `'system'` and stays: the next OS change no longer overwrites it, even though `systemDarkMode` is still `true`. Before `4.0.0` the next OS change overwrote it.  
Turning it off while the appearance is `'system'` keeps the light or dark shown at that moment. Turning it off after the appearance has been changed away from `'system'` leaves it as it is.  
Changing it emits no event.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

Determines if a UI for easily setting preset themes is provided.  
It shows the toolbar's `Theme` button, which opens the theme builder with `Accent color`, `Gray color`, and `Appearance`. Since `4.0.0` `Appearance` offers `System` beside `Light` and `Dark`, and while this is on, quick search lists `Theme` with `System`, `Light`, and `Dark`. See [Language and Theme](../guide/guides/language-and-theme.md).

![Opening the theme builder from the toolbar, picking accent and gray colors, and switching the appearance to Light and then to System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Changing the preset theme from this panel, or from quick search, emits the [changePresetTheme](#changepresettheme) event.

## enableLocalePicker

Since `4.0.0`, determines if a UI for picking the editor's display language is provided.  
It shows the toolbar's `Display Language` button, after `Theme` when both are shown. The button opens the Display Language picker, and quick search lists `Display Language`. Both offer `System` and the 25 languages — see [Language and Theme](../guide/guides/language-and-theme.md).  
It also decides what an editor shows before [setLocale](#setlocale) is called or a language is picked: `'system'` while it is on, English while it is off, so an element that configures nothing keeps the English it always showed. Turning it on or off switches between the two at once. Once a language has been set or picked, that choice stays whichever way it is turned.  
Set it before the element is appended for the first frame to follow `'system'`.  
A pick emits [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen

Since `4.0.0`, determines if an empty diagram greets the reader with the [welcome screen](../guide/guides/editing-start.md#welcome-screen).  
It stands over the ERD tab while the document has no table, no shown memo, and no shown table group. It is not shown while `readonly` is set, in zen mode, or while Table Properties, the diff viewer, time travel, or the Auto Layout preview is open. The first table, shown memo, or shown table group takes it away, and an undo back to an empty diagram brings it back.  
Its `New Table`, `New Memo`, and `Command Palette` rows show the first chord of `addTable`, `addMemo`, and `search` as [setKeyBindingMap](#setkeybindingmap) left them, and none for a name left empty. Its arrows point at the `Theme` and `Display Language` buttons only where `enableThemeBuilder` and `enableLocalePicker` show them.  
In its menu, `↑`, `↓`, `Home`, and `End` move between the rows and are prevented and stopped. `Enter` and `Space` are stopped, not prevented, so the focused row takes them, and `Escape` among the `Import` formats goes back, prevented and stopped. Every other key reaches the editor and the page as usual.  
It changes nothing in the document, so it leaves `value` as it was and emits no `change`.  
Turn it on once [setInitialValue](#setinitialvalue) has loaded the document, as the official hosts do, so the screen never flashes over a file that is still loading.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value

### getter

Retrieves the current document as a JSON string, in the [schema](./advanced/schema.md) the editor defines.  
Since `4.0.0` it is the storage form, the document as a file holds it, which is also what the `json` export writes and the official hosts save. It holds the live entities alone, without the removed ones, the stacking order, or what the editor works out for itself, such as measured widths, key marks, and relationship anchors. Its entities are keyed in a fixed order, it is indented two spaces, and it ends with a newline, so the same document always gives the same bytes.  
Since `4.2.0` it also leaves out what is empty: an empty `doc` list, an empty collection, a dictionary row that holds nothing, and an entity's empty text field, such as a name, comment, data type, default, or color. A list inside an entity, such as a table's `columnIds`, is still written when empty. A new document's `doc` is `{}`, and it has no `collections`, so read a missing field, list, or collection as empty. It holds the logical names and derived-name flags of tables and columns, the columns' domain links, and the words, terms, and domains, each dictionary written as one header of field names followed by its rows, one row to a line, in the sheet's order. See [Storage Form and Runtime Value](./advanced/schema.md#storage-form-and-runtime-value).  
Each setting whose [lock](../guide/guides/settings.md#lock) is on is written at the value it is locked at, not as the screen shows it. The `Viewport` lock holds `originX`, `originY`, and `zoomLevel`, and `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`, and since `4.2.0` `Name View` each hold their own setting. The Name View is written as `nameViewMode`, and only while it is not `'physical'`. Every other setting is written as it stands, and `lockSettings` is always written. See [Settings](./advanced/schema.md#settings) for the bits; the `Name View` lock's bit reads the other way round.  
Since `5.0.0` the settings a [read-only](#readonly) editor's reader changes are written at the document's values too, locked or not, since they stay on that screen.  
A new document has every lock on, whether it is the one an element shows before it is given a value or one loaded from a blank value. Its `value` keeps the origin at `0, 0`, the zoom level at `1`, the ERD tab, the default Code Generator language, name cases, and bracket type, and since `4.2.0` `Physical Names`, until the matching lock is turned off.  
Before `4.0.0` it returned the whole document as the editor held it, with `ignoreSaveSettings` applied. The document as the editor holds it is now [runtimeValue](#runtimevalue), and `ignoreSaveSettings` is no longer read or written.

```js
const data = editor.value;
```

### setter

Loads a previously saved editor state. It replaces the whole document — the current one is cleared first. Since `4.2.0` that includes the words, terms, and domains: the document takes the ones the text holds, or none, and every Dictionary sheet's own undo history is emptied.  
Like `clear()`, `setInitialValue()`, and the `setSchema*` methods in their default `mode: 'replace'`, it also discards the Visualization tab's Flow view: its layout, the tables it is narrowed to, its row display, zoom, and pan, and since `4.2.0` the tables its `Previous table` and `Next table` step through. An append (`mode: 'append'`) does not discard it.  
It is recorded in the history list, enabling `Undo, Redo`, and it emits `change`.  
It takes the storage form, a [runtimeValue](#runtimevalue), or a file an earlier release saved.  
A blank string, or anything that is not a string, loads a new document rather than raising an error, so guard the value before assigning it.  
That new document is the one `setInitialValue('')` starts: empty, with default settings, and since `4.0.0` with every lock on. In `3.10.x` it saved neither the scroll position nor the zoom level, and before that it saved both.  
A shared store relays that load to collaborators with the new document's full JSON, so every peer, an older release included, loads it, though an editor before `4.2.0` drops what it does not know, such as the logical names, domain links, and dictionaries — see [Mixing Releases](./advanced/collaborative-editing.md#mixing-releases).  
Since `4.0.0` the loaded document's locks, and the locked values `value` then writes, come from the text, and the view lands where the text puts it, or on the diagram when none of it is drawn there. For each other setting the text locks — the tab, the Code Generator language, the name cases, the bracket type, and since `4.2.0` the Name View — the editor keeps showing what it showed before the load. A setting the text leaves unlocked takes the text's value. A file saved before `4.2.0` names no `Name View` lock unless a `4.2.0` editor turned that lock off in it, so it loads with the Name View locked at `Physical Names`, and the editor keeps the Name View it showed. [setInitialValue](#setinitialvalue) instead takes every value the text holds; see it also for a text that names no locks.  
Text that is not JSON, such as a file left with merge-conflict markers, does not raise an error either: the document is emptied, its settings stay as they were, and the parse error is logged to the console.  
It is ignored while `readonly` is set; use [setInitialValue](#setinitialvalue) to load into a read-only editor.

```js
editor.value = 'json...';
```

## runtimeValue

Since `4.0.0`, retrieves the document as this editor holds it, as a JSON string. It has no setter, so assigning it throws in strict-mode code.  
It carries what [value](#value) leaves out: removed entities and their order, stacking order, measured widths, key marks, relationship anchors, and sequences, and since `4.2.0` the empty text fields, `doc` lists, and collections; the rows removed from a Dictionary sheet and those that hold nothing; each dictionary row's order key; the `doc` lists of words, terms, and domains; and a link to a removed domain. Locked settings are written at their locked values here too.  
Use it to seed another editor that joins a session already running, such as a collaborator or a second view of the same document, through its [setInitialValue](#setinitialvalue). An undo of a removal that the session sends later then restores the entity whole there, while an editor seeded from `value` holds no removed entity and restores an empty, nameless table, or since `4.2.0` an empty dictionary row, instead. See [Collaborative Editing](./advanced/collaborative-editing.md).  
Nothing collects removed entities any more, so they stay in it until the document is next opened from its file.  
Never write it to a file: save `value`, which the [JSON Schema](./advanced/schema.md#json-schema) accepts and this does not.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue

Loads a previously saved editor state. The load itself is not recorded in the history list, so it cannot be undone, and no `change` event is emitted.  
It also clears the undo history, so nothing done before the load can be undone or redone onto the loaded document, and since `4.2.0` each Dictionary sheet's own history too.  
It takes the storage form, a [runtimeValue](#runtimevalue), or a file an earlier release saved, and unlike assigning `value` it takes every setting the text holds, the tab and the code settings included.  
A blank string, or anything that is not a string, loads a new document rather than raising an error, so `setInitialValue('')` starts a blank diagram.  
Since `4.0.0` that new document, which is also what an element shows before it is given any value, has every lock on. Scrolling, zooming, switching tabs, and changing the Code Generator language, the name cases, the bracket type, or since `4.2.0` the Name View leave `value` as it was and emit no `change`. In `3.10.x` it saved neither the scroll position nor the zoom level, and before that it saved both.  
A document loaded from text keeps the locks it names. One that names none — any file saved before `4.0.0`, whatever its `ignoreSaveSettings` said, and a v2 `.vuerd` file — opens with every lock on, its `Viewport` locked at origin `0, 0` and zoom level `1`, on the ERD tab, with its language, name cases, and bracket type as it saved them.  
Since `4.2.0` a text that names its locks but not the `Name View` lock opens with that lock on too, even when every other lock is off. A file saved before `4.2.0` is such a text unless a `4.2.0` editor turned that lock off in it (see [Settings](./advanced/schema.md#settings)). It opens in `Physical Names`, as one that names no lock at all does.  
Either way the view opens at the document's view — the one the text saved when it names its locks, origin `0, 0` at zoom level `1` when it names none — or on the diagram when none of it is drawn there. A locked `Viewport` still keeps its locked values in `value`.  
Since `4.0.0` it also drops the collaboration state of the document held before, and a [shared store](#getsharedstore) of this editor that is already subscribed asks the other editors for theirs again, so an editor reloaded in a running session catches up. Seed such an editor with another editor's [runtimeValue](#runtimevalue).  
Text that is not JSON does not raise an error either: the document is emptied, its settings stay as they were, and the parse error is logged to the console.  
Unlike assigning `value`, it is not blocked by `readonly`, so it is how you load a document into a read-only editor. A read-only editor then shows the settings the loaded text holds, dropping the ones its reader had changed on screen.

```js
editor.setInitialValue('json...');
```

Load on start, save on change.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event

`change`, `changePresetTheme`, and `changeLocale` are the only three public events; `changeLocale` is new in `4.0.0`.  
The element also dispatches internal `@dineug/erd-editor/internal-*` events on itself for its own wiring; those are not part of the API.

### change

When there are changes in the editor, it emits an event.  
The event is debounced by 200ms, and it is not emitted while `readonly` is `true`.  
It fires for any document change — an edit in the UI, assigning `value`, `clear()`, each of the `setSchema*` methods, and since `4.0.0` `setSchemaJSON()` and `Import and Add`. `setInitialValue` does not emit it.  
Since `4.2.0` that includes every edit on the [Dictionary](../guide/guides/dictionary.md) tab and every undo or redo of one, a change of a logical name or a domain link, `Derive Physical Names Again`, and a Name View switch while the `Name View` lock is off.  
Nothing done inside the Visualization tab's Flow mode emits it — zoom, panning, moving cards, `Tidy Up`, the row display, narrowing the view from a card, or since `4.2.0` stepping with `Previous table` and `Next table` or the undo and redo keys — since none of it is a document change. Its `Name View` list is the exception: a switch there emits it while the `Name View` lock is off, as one on the ERD tab does.  
Since `4.0.0` a change to a setting whose [lock](../guide/guides/settings.md#lock) is on does not emit it either, because it moves only the screen and never `value`: a scroll or a zoom of the ERD canvas while `Viewport` is locked, a tab switch while `Canvas Type` is locked, a change of the Code Generator language, the table name case, the column name case, or the bracket type while its own lock is on, and since `4.2.0` a Name View switch while `Name View` is locked. Only those changes are left out, so a batch that also edits the document still emits it. Locking or unlocking a setting emits it.  
Every lock is on in a new document and in any file saved before `4.0.0`, and the `Name View` lock is on in any file saved before `4.2.0` unless a `4.2.0` editor turned it off there, so by default scrolling, zooming, switching tabs, and switching the Name View emit nothing. That covers focusing on tables from the ERD tab, the external-link card button that takes you from Flow back to the ERD tab, going to an Explorer row or a search match, opening the Explorer or going to a quick search result from another tab, and since `4.2.0` going to a table or column from a row of the Dictionary tab's `Checks` sheet. Each of those emits one `change` only while a lock that covers it is off: `Canvas Type` for the tab switch, and `Viewport` for the scroll a card button, a quick search result, an Explorer row, a search match, or a `Checks` row also makes. Since `4.1.0` every one of those scrolls follows one rule, [Where a Jump Lands](../guide/guides/table-related-functions.md#where-a-jump-lands), so a quick search table result no longer scrolls every time, and a jump the rule leaves in place makes no scroll to emit. Opening, closing, or resizing the Explorer narrows or widens the canvas without moving its origin, and emits nothing either. Before `4.0.0` scrolling, zooming, and switching tabs always emitted it, even when `editor.value` came out the same.  
To skip writes that change nothing, compare `editor.value` with the value you last stored, not with the file you loaded: a file an earlier release wrote, a v2 file, or a hand-edited one can come out different in `value` as soon as it loads, because `value` writes it in the storage form. So can a file whose `Viewport` lock is off and whose origin draws none of the diagram on this screen: the load moves the view onto the diagram, and `value` writes where it lands. Since `4.0.0` measured widths no longer cause this, because `value` holds none. Since `4.2.0` a file `4.0.0` or `4.1.0` saved can come out different too, as `value` now leaves out its empty text fields, lists, and collections, so such a file is rewritten once, on its next save. A host that writes files can instead tell an edit from a view change with a replication store's `changed` — see [on@change](./advanced/remote-storage.md#onchange).  
The event carries no `detail` and neither bubbles nor crosses the shadow boundary, so listen on the element itself and read `editor.value` in the handler.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

Emitted when the preset theme is changed from the built-in theme builder, or since `4.0.0` from `Theme` in quick search. Every pick emits it, a pick of the option already in force included.  
Calling [setPresetTheme](#setpresettheme) or [setSystemAppearance](#setsystemappearance) yourself, or turning [systemDarkMode](#systemdarkmode) on or off, does not emit it.  
`event.detail` is the complete `ThemeOptions` after the pick — `{ appearance, grayColor, accentColor }` — not the partial that was requested. Since `4.0.0` its `appearance` is `'system'` while `System` is picked, not the light or dark it shows, so store it as it is and hand it back to `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale

Since `4.0.0`, emitted when a language is picked in the editor, from the Display Language picker or from `Display Language` in quick search, both of which [enableLocalePicker](#enablelocalepicker) turns on.  
It fires after the language has been applied, on every pick, a pick of the option already in force included. [setLocale](#setlocale) and [setSystemLocale](#setsystemlocale) never emit it, and neither does a change of the browser's languages. A switch of language emits no `change`.  
`event.detail` is `{ locale }`, a `LocaleOption`: `'system'` when `System` was picked, otherwise the language's code. The element does not remember the pick, so store it and pass it to `setLocale` on the next load.  
Like `change`, it does not bubble, so listen on the element itself.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus

Focuses on the editor.

```js
editor.focus();
```

## blur

Removes focus from the editor.

```js
editor.blur();
```

## clear

Empties the document, removing every table, column, relationship, index, and memo, since `4.0.0` every table group, and since `4.2.0` the Dictionary tab's words, terms, and domains, emptying every sheet's own undo history too.  
Every setting stays, including the database, the view position, the zoom level, the table view options, each lock with the value it holds, and the Schema SQL tab's `Before tables` and `After tables` scripts, so a cleared file keeps saving what it saved. To start a new document instead, assign `''` to `value` or call `setInitialValue('')`.  
It is recorded in the history list, so it can be undone, and it emits `change`. An undo brings the document back as the editor held it, its words, terms, and domains included, each locked setting at its locked value. It is ignored while `readonly` is set.

```js
editor.clear();
```

## destroy

Completely destroys the editor instance so that it can no longer be reused.  
It releases the editor's listeners and subscriptions, and destroys every shared store returned by [getSharedStore](#getsharedstore).  
A stream batch a shared store is still holding back is dropped with it; call that store's [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) first to send it.

```js
editor.destroy();
```

## setKeyBindingMap

Redefines keyboard shortcuts.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` and `zoomReset` are fixed and cannot be redefined.  
Only the twenty-one names below are written; anything else in the object is ignored, including the fixed names.  
Since `3.10.0`, `search` can be redefined, and `findReplace` is new. Before, `search` was fixed. Since `4.0.0`, `removeSelection` is new. Since `4.1.0`, `addTableGroup` and `groupSelectedTables` are new.  
A binding value must be a `ShortcutOption[]`. A bare string is ignored, so write `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` rather than `{ addTable: 'Alt+KeyN' }`.  
An empty array is accepted and binds nothing: `setKeyBindingMap({ findReplace: [] })` leaves `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac) to the page, and `{ search: [] }` does the same for `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac). The toolbar's `Search` button still opens quick search, the toolbar's `Explorer` button still opens and closes the Explorer, and `Toggle Explorer` in quick search and in the canvas context menu still opens its search or closes it; none of these shows a shortcut for a name left empty. `{ removeSelection: [] }` leaves `Delete` and `Backspace` to the page, and the delete rows of the table, memo, and table group menus (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) then show no shortcut.  
Since `4.1.0`, `{ addTableGroup: [] }` leaves `Alt + G` (Windows/Linux) or `⌥ + G` (Mac) to the page, and `{ groupSelectedTables: [] }` leaves `T` then `G`. `New Table Group` on the canvas toolbar, in the canvas context menu, and in quick search, `Group selected tables` in the table menu, and `Group Selected Tables` in quick search still work, with no shortcut shown. The tooltips of the canvas toolbar's `New Table`, `New Memo`, and `New Table Group` buttons name the first chord of `addTable`, `addMemo`, and `addTableGroup`, or only the button for a binding left empty.  
Since `4.2.0`, `addColumn` and `removeColumn` also give the Dictionary tab's grid its row chords, as below, so rebinding either moves those chords with it. `{ addColumn: [] }` leaves the grid no chord to insert rows, and the grid menu's two insert rows then show no shortcut; `{ removeColumn: [] }` leaves it none to delete them, and the menu's delete row and the `Delete Rows` tooltip then show none.  
The call is a partial merge: names you leave out keep their defaults, and calling it twice keeps the earlier changes. There is no getter for the current bindings: [createKeyBindingMap](#createkeybindingmap) returns the defaults, not what `setKeyBindingMap` changed.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection`, and since `4.1.0` `groupSelectedTables` give way to a caret: while the focus is in an input, a textarea, or a `contenteditable`, `$mod + A` selects the text, `Space` types a space, `Delete` and `Backspace` erase text, and `T` then `G` types the two letters, instead of reaching the canvas. None of those presses is prevented. Whatever you rebind them to behaves the same way.

Since `4.0.0`, `removeSelection` (`Delete` or `Backspace`) removes the selection on the ERD tab as one undo step, without asking. When the focused table is the only thing selected, one or more of its columns are selected, and the zoom draws its rows, it removes those columns; otherwise it removes every selected table, memo, and table group, a group's tables kept. See [Table and Memo Deletion](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
A held key removes once, and nothing is removed while a cell, memo, or table group name editor is open. Outside a text field and the panels and tabs that hold bindings back (see [createKeyBindingMap](#createkeybindingmap)), the press is prevented on every tab while the editor has focus, on a focused toolbar button too, and in a read-only editor, where it removes nothing.

Since `4.1.0`, `addTableGroup` (`Alt+KeyG`) arms the `New Table Group` draw on the ERD tab, whose next main-button press on the canvas draws the group, and pressing it again disarms the draw, as the canvas toolbar's `New Table Group` button does. `groupSelectedTables` (`KeyT KeyG`, `T` then `G`) puts the selected tables in a new group and opens its name editor, as `Group selected tables` in a table's context menu does. With no table selected it adds nothing; a selected memo or table group does not count. See [Drawing a Group](../guide/guides/table-groups.md#drawing-a-group) and [Grouping Selected Tables](../guide/guides/table-groups.md#grouping-selected-tables).  
Both act only where the menus offer a group: not while `readonly` is set, while the `Table Groups` view option hides the groups, or while a cell, memo, or table group name editor is open. Like the other canvas bindings, they act only on the ERD tab, and not while quick search, Table Properties, the diff viewer, time travel, the Auto Layout preview, `Export image`, or `Map Columns` is open. Where they do nothing, the press is still prevented, unless `groupSelectedTables` gives way to a caret. `addTableGroup` is also stopped, as `focusView` and `zenMode` are, so a page's bubbling `keydown` listener never hears it.

Since `4.2.0`, on the [Dictionary](../guide/guides/dictionary.md#adding-and-deleting-rows) tab, each one-press chord of `addColumn` inserts as many rows below the selection as the selection covers, the same chord with `Shift` held as well inserts them above, and each one-press chord of `removeColumn` deletes the rows the selection covers: `Alt+Enter`, `Alt+Shift+Enter`, and `Alt+Backspace` or `Alt+Delete` with the defaults. They act in the grid of the `Domains`, `Words`, and `Terms` sheets while no cell edit is open. A chord of `addColumn` that already holds `Shift` gives no chord to insert above, and a sequence bound to either name gives the grid nothing.  
Each such press is prevented as its option says and always stopped, so it adds or removes no column on the ERD tab. On the `Checks` sheet and in a read-only editor it does nothing, though it is still prevented and stopped. In an open cell edit or the tab's search field the chords are left to the text: they are stopped there but not prevented, so the field acts on them as it would anywhere (on a Mac, `⌥ + Backspace` deletes a word). [dictionaryRowChords](#dictionaryrowchords) lists them.

Since `3.10.0`, `findReplace` (`$mod+KeyF`) opens [Find and Replace](../guide/guides/find-and-replace.md). Since `4.1.0` it toggles the [Explorer](../guide/guides/explorer.md#opening-and-closing) that holds it, and the Shortcuts tab lists it as `Toggle Explorer`.  
While the toolbar's `Explorer` button shows pressed (the Explorer open on the ERD tab and not hidden by zen mode), it closes the Explorer, unless quick search, Table Properties, the theme builder, the Display Language picker, the `Export image` dialog, or `Map Columns` is open. Otherwise it closes whichever of those is open, brings the ERD tab up from any other tab, and opens the Explorer with the caret in its `Find` field and the query selected. An editor too narrow to show the Explorer beside the canvas keeps it open but aside, and shows the toast `Widen the window to show the Explorer`. Before `4.1.0` it opened the floating Find and Replace panel, or gave its field the keyboard back, and never closed it.  
It does not give way to a caret: while the editor is focused it is taken on every tab, from the canvas or from an input inside the editor. The press is prevented, so the browser opens no find bar, and stopped, so no bubbling `keydown` listener on the page hears it. With a cell or memo editor open, since `4.0.0` a table group name editor, or since `4.2.0` a cell edit in the Dictionary tab's grid, it is still prevented and stopped, but does nothing. In that last case `search` does nothing either, so the text typed so far stays.  
While the diff viewer, time travel, or the Auto Layout preview is open, on whichever tab, or while an IME is still composing, it is neither prevented nor stopped, so the browser's or the host's own find gets it. Inside the Explorer, a press still composing is stopped there, though not prevented. Whatever you rebind `findReplace` to behaves the same way.

`focusView` acts on the ERD tab only. With at least one table selected, it opens the Visualization tab in Flow mode, narrowed to those tables and every table one relationship away; a selected memo or table group does not count, and with no table selected it does nothing. See [Focusing on Tables](../guide/guides/visualization.md#focusing-on-tables).

`undo` and `redo` act by tab. On the ERD tab they undo and redo the document's history. Since `4.2.0` on the Dictionary tab they undo and redo the shown sheet's own history, and nothing on the `Checks` sheet — see [Dictionary Sheets](../guide/guides/undo-redo.md#dictionary-sheets). In the Visualization tab's Flow mode they step back and forward as [`Previous table` and `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) do, leaving the document's history alone. On the other tabs, and in Graph mode, they undo nothing.

`stop` (`Escape`) on the ERD tab ends an open cell or memo editor, or a relationship being drawn, and leaves the selection as it is. Since `4.0.0` it also ends a table group name editor, writing no name, and a `New Table Group` draw. The editor calls `preventDefault()` on that press.  
With none of those open, `Escape` clears the selection and the focused cell, and is not prevented. Leaving an edit and clearing the selection therefore takes two presses.  
Since `4.2.0`, while a logical name cell's term list shows (see [Completing Term Names](../guide/guides/logical-names.md#completing-term-names)), the first `Escape` closes the list alone and leaves the editor open. That press is prevented and stopped at the cell, so neither `stop` nor a page's bubbling `keydown` listener hears it.  
Apart from the Explorer, the [welcome screen](#enablewelcomescreen)'s `Import` formats, a logical name cell's term list, the [Dictionary](../guide/guides/dictionary.md#keys-on-the-tab) tab, and the pickers and dialogs below, the editor never stops `Escape` from propagating, so a page that listens for it itself, to close a dialog of its own for example, hears both presses and can skip the one whose `defaultPrevented` is `true`.  
While quick search, table properties, the diff viewer, the Auto Layout preview, or time travel is open, `Escape` closes that instead and leaves the selection as it is. That press is not prevented either.  
Since `4.0.0` an open [`Export image`](../guide/guides/file-import-export.md#image) or [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) dialog also takes `Escape`, closing itself and leaving the selection as it is. Each takes the keyboard when it opens, and that `Escape` is both prevented and stopped.  
Since `4.1.0` an `Escape` pressed with the focus inside the [Explorer](../guide/guides/explorer.md#keys-in-the-explorer), in its tree, its fields, or its buttons, gives the keyboard back to the canvas and leaves the Explorer open and the selection as it is. The editor calls both `preventDefault()` and `stopPropagation()` on it, so it never reaches a page's bubbling `keydown` listener.  
An `Escape` on the canvas never closes the Explorer. Before `4.1.0` an `Escape` inside the Find and Replace panel closed it, and one on the canvas closed it in the same press that cleared the selection.  
Since `4.0.0` the Display Language picker and the color picker close on `Escape`: inside them it is prevented and stopped, and on the canvas it closes them in the same press that clears the selection, neither prevented nor stopped.  
An `Escape` pressed while an IME is still composing belongs to the composition. It leaves an open editor as it is and is not prevented, so a page can skip a press whose `isComposing` is `true`, or whose `keyCode` is `229`, as well. Inside the Explorer such a press, like any key pressed there mid-composition, is also stopped, and the keyboard stays in the field.  
Before `3.9.2` a single `Escape` both ended an edit or draw and cleared the selection, and the editor never prevented it.

### createKeyBindingMap

Since `3.9.2` the package exports `createKeyBindingMap()`, and the `KeyBindingMap`, `KeyBindingName`, and `ShortcutOption` types with it.  
It returns the default key bindings, all 28 names with the fixed ones included, as a new map on every call, so changing the map it returns changes nothing else.  
It is what every editor starts from, and a `setKeyBindingMap` call does not show in it.  
Of these four only `createKeyBindingMap` is a runtime export; the other three are types. Since `4.2.0` [dictionaryRowChords](#dictionaryrowchords) is exported beside it.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Each `shortcut` is a chord in [tinykeys](https://github.com/jamiebuilds/tinykeys) syntax that names its key by `KeyboardEvent.code`, where [`$mod`](#mod) is `⌘` on macOS and `Control` elsewhere.  
Since `4.0.0` the editor reads these chords itself rather than through tinykeys, in the same syntax. A key matches by its `code`, or by its `key` in any letter case, and a press matches only with exactly the modifiers it names held. `AltGraph` counts as `Control` and `Alt` on Windows and as `Alt` on macOS. Presses separated by a space form a sequence, which starts over after a second without a keydown.  
Since `4.1.0` one default is a sequence: `groupSelectedTables` is `KeyT KeyG`, `T` then `G`. A sequence runs on the press that completes it, and only that press takes its `preventDefault` and `stopPropagation`, so with the defaults `T` reaches the page and only `G` is prevented. Menus, quick search, and the Shortcuts tab show a sequence as one key per press.  
The fixed names are bound to `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`), and `$mod+Digit0` (`zoomReset`). `edit` and `stop` carry no flags; the other five carry `preventDefault` and `stopPropagation`. The rest are the defaults above, `search` and `findReplace` among them.

The editor listens for these on its own element, so a host that takes keys before the editor does, with global hotkeys or a capture-phase `keydown` listener, has to let them through while the editor is focused.  
Build the list to let through from `createKeyBindingMap()`, with the bindings you passed to `setKeyBindingMap` in place of the defaults.  
Since `3.10.0` that list includes `$mod+KeyF`, the browser's own find chord. A host that wants to keep its own find on that chord passes `setKeyBindingMap({ findReplace: [] })`.  
Since `4.0.0` it also includes bare `Delete` and `Backspace`. A host that wants to keep those keys passes `setKeyBindingMap({ removeSelection: [] })`.  
Since `4.1.0` it also includes `Alt+KeyG` and the sequence `KeyT KeyG`, which comes as one string: split it at the space and let each press through, bare `T` and `G` included, since a sequence missing a press never completes. A host that wants to keep those keys passes `setKeyBindingMap({ addTableGroup: [] })` or `setKeyBindingMap({ groupSelectedTables: [] })`.  
Since `4.2.0` add to it the chords [dictionaryRowChords](#dictionaryrowchords) returns for the same map, `Alt+Shift+Enter` among them. A host that wants to keep those keys passes `setKeyBindingMap({ addColumn: [] })` or `setKeyBindingMap({ removeColumn: [] })`, which also takes them off adding and removing columns on the ERD tab.

While the focus is inside the Explorer, in its tree, its `Find` and `Replace` fields, or its buttons, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut`, and `zoomReset` pass through to the editor, so `findReplace` acts there as it does on the canvas. Every other binding, as currently set, stops at the Explorer, a sequence by its last press (a bare `G` with the defaults), and so do the arrow keys, `Tab`, `Enter`, `Space`, `Home`, `End`, and any key pressed while an IME is still composing. Apart from `Escape`, which gives the keyboard back to the canvas, they are stopped without being prevented, so they act as ordinary keys in the Explorer's fields, buttons, and tree and reach neither the canvas nor a page's bubbling `keydown` listener: `Alt + N` there adds no table, and `Delete` removes nothing. The keys that move, fold, or go to a tree row, and `Enter` in the `Find` or `Replace` field, which moves through the matches or replaces, are prevented as well.  
Any other key, such as a host's save or command palette chord, goes on to the page as usual. See [Keys in the Explorer](../guide/guides/explorer.md#keys-in-the-explorer). Before `4.1.0` the floating Find and Replace panel held keys the same way, apart from `Home`, `End`, the last press of a sequence, and `Space` while `handTool` was bound to another key.  
Since `4.0.0` the Display Language picker holds keys the same way: the same seven bindings pass through, and every other binding (since `4.1.0` a sequence by its last press), the arrow keys, and `Tab` are stopped there without being prevented, as is any key pressed while an IME is still composing. `↑`, `↓`, `Home`, `End`, `Enter`, and `Space` on one of its rows move through the rows or pick one, and are prevented as well.

Since `4.2.0` the [Dictionary](../guide/guides/dictionary.md#keys-on-the-tab) tab holds keys too, with only `search`, `findReplace`, `undo`, and `redo` passing through to the editor. `undo` and `redo` run the shown sheet's own history, and with a cell edit open or the focus in the tab's search field they are left to the text, stopped there but not prevented. `search` and `findReplace` do nothing while a cell edit is open, as above. The row chords run in the grid, as described under `addColumn` and `removeColumn` above.  
Every other binding, as currently set, stops at the tab, a sequence by its last press, and so do the arrow keys, `Tab`, `Enter`, `Space`, `Home`, `End`, and any key pressed while an IME is still composing. None of them reaches the canvas or a page's bubbling `keydown` listener: `Alt + N` there adds no table, and `Delete` removes nothing from the diagram. Copy, cut, and paste events in the tab stop there too, so the diagram never reads them as its own. Any other key goes on to the page as usual.

### dictionaryRowChords

Since `4.2.0` the package exports `dictionaryRowChords()`. It returns, as a new `ShortcutOption[]` on every call, every chord with which the Dictionary tab's grid inserts or deletes rows under the key binding map you pass.  
In order, they are the one-press chords of `addColumn`, which insert rows below the selection; each of those with `Shift` held as well, which insert rows above, none for a chord that already holds `Shift`; and the one-press chords of `removeColumn`, which delete rows. Each keeps the `preventDefault` and `stopPropagation` of the binding it comes from, and a sequence is left out. See [Adding and Deleting Rows](../guide/guides/dictionary.md#adding-and-deleting-rows).  
The chord that inserts rows above, `Alt+Shift+Enter` with the defaults, is in no binding, so a host that matches modifiers exactly and builds its list of keys to let through from [createKeyBindingMap](#createkeybindingmap) alone never lets it through. Let both lists through, as the Obsidian plugin does.  
It reads only the map it is given, not the element's bindings, so pass it the map you built your list of keys from.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod

Switches `Control` key depending on the environment.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Shortcut Table

Uses keyboard event `key, code` properties.  
Use `code` for absolute positions and `key` for input values.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Theme

### setPresetTheme

Sets a preset theme.  
The defaults are `appearance: 'dark'`, `grayColor: 'slate'`, and `accentColor: 'indigo'`.  
Each field is applied on its own, so a partial call leaves the other two as they are. A value that is not one of the names below is ignored, and the call never throws.  
Since `4.0.0` `appearance` also takes `'system'`, the theme builder's `System`. It shows the light or dark the operating system reports, or the one [setSystemAppearance](#setsystemappearance) names, and switches when that changes.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance

Since `4.0.0`, names the light or dark that the `'system'` appearance shows, for a host with a light and dark of its own, such as an IDE theme. While one is named, the operating system's changes are ignored.  
`null`, or any value other than `'dark'` or `'light'`, goes back to following the operating system.  
While the appearance is `'light'` or `'dark'` it changes nothing on screen, but the value is kept and applies as soon as the appearance becomes `'system'`. Otherwise it applies at once. It emits nothing, and `changePresetTheme` keeps reporting `'system'`.  
The VS Code, JetBrains, and Obsidian hosts call it with their own light or dark, and again whenever that changes.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme

Allows customizing the theme.  
Every call replaces the whole custom overlay, so pass the full object again to change one token on top of an existing override, and pass `{}` to drop back to the preset.  
Only the token names below, with string values, are kept; anything else is dropped without error.  
The overlay sits on top of the preset, so a later `setPresetTheme` swaps the preset underneath while your overrides stay.

#### JavaScript

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` and `memoShadow` are the color of the shadow tables and memos cast on the ERD canvas. The dark preset leaves them `transparent`, which casts none, as passing `none` or an empty string to `setTheme` does; the light preset uses `rgba(0, 0, 0, 0.18)`.

Since `4.0.0` there are nine more tokens:

- `tableGroupHeaderBackground`, `tableGroupBackground`, and `tableGroupBorder` color the title bar, the body, and the outline of a [table group](../guide/guides/table-groups.md) that has no color of its own.
- `toastSuccess` and `toastError` color the mark of a toast that reports how something ended.
- `findReplaceError` and `mapColumnsError` color the errors Find and Replace and the Map Columns dialog show. Find and Replace used `diffDeleteForeground` before, so overriding that no longer recolors it.
- `schemaSqlWarningBackground` and `schemaSqlWarningForeground` color the warnings in the Schema SQL tab's options.

Since `4.1.0` there are nine more tokens:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted`, and `treeMatch` color the tree the [Explorer](../guide/guides/explorer.md#the-tree) and the [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) share: its background, which also fills the Explorer's `Find` and `Replace` fields; a row under the pointer, the keyboard's row while the tree has focus, and a button under the pointer in the Explorer's header and search; the row of the current search match; muted text such as counts, data types, and the folding arrows; and the mark behind the text a search found.
- `explorerBackground` and `explorerBorder` color the Explorer panel and its lines: its edge beside the canvas, the line under its search, and the borders of its fields and of the buttons `Search In` unfolds. `explorerBorder` also draws the Diff Viewer tree's edge, the line under its `Filter by name` field, and that field's border. The Explorer's key icons take `keyPK`, `keyFK`, and `keyPFK`.
- `diffModifyForeground` and `diffRenameForeground` color what the Diff Viewer marks changed and renamed, in its tree and on both documents. `diffModifyForeground` also outlines a table, memo, or table group that was moved, resized, recolored, or regrouped, whatever else changed in it, and draws the connector of a foreign key that changed.

`diffInsertForeground` and `diffDeleteForeground` now color what the Diff Viewer marks added and removed, in its tree and on the document that holds it, in text, outlines, and connectors alike. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground`, and `diffCrossForeground` were removed in `4.1.0`, as the Diff Viewer no longer fills cells. `setTheme` drops them like any other name not in `Theme`, and their hooks, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background`, and `--erd-editor-diff-cross-foreground`, are no longer read.

Since `4.2.0` there are twelve more tokens:

- `columnHandleBackground` and `columnHandleBorder` fill and outline the [column drag handle](../guide/guides/table-editing.md#rearranging-and-moving-columns), drawn just outside a table's left edge beside a focused column row, and `columnHandleHoverBackground` and `columnHandleHoverBorder` take over while the pointer is on it. Its grip takes `foreground`, and `active` under the pointer.
- `dictionaryErrorForeground` and `dictionaryWarningForeground` color what the [dictionary checks](../guide/guides/dictionary.md#what-each-check-finds) find, an error or a warning: a flagged name on the ERD canvas (see [Marks on the Canvas](../guide/guides/dictionary.md#marks-on-the-canvas)), the text of a flagged cell on the `Domains`, `Words`, and `Terms` sheets, and the `Checks` count. `dictionaryErrorBackground` and `dictionaryWarningBackground` fill such a cell. `dictionaryErrorForeground` also colors the `Delete Rows` tool under the pointer.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine`, and `dictionaryHeaderSelect` color the [Dictionary](../guide/guides/dictionary.md#the-sheets) tab's sheet: its cells, which also fill the tab's search field and a term's domain list; its column headers and row numbers; the lines between cells, which also draw the tab's bar and the borders of its fields; and a header whose row or column meets the selection. The rest of the sheet takes shared tokens: `foreground` for header labels, `active` for cell text, `grayColor7` for the line that sets the column headers and the row numbers off from the cells, `focus` for the active cell's edge, `accentColor9` for a selected range's edge and, at 20% opacity, its fill, `accentColor6` for the header of a whole selected row or column, `grayColor3` for read-only cells, and the scrollbar tokens. An `accentColor9` not written as `#rgb` or `#rrggbb` leaves a selected range unfilled.

#### CSS Variables

Every token in `Theme` has a matching CSS hook named `--erd-editor-` plus the kebab-cased key: `grayColor10` is `--erd-editor-gray-color-10`, `keyPK` is `--erd-editor-key-pk`, and `keyPFK` is `--erd-editor-key-pfk`.  
The hooks are inherited into the editor, so set them wherever you want them to apply. On `:root` they theme every editor on the page; on the element itself they theme just that one.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Since `3.4.0` the misspelled `dargSelect` tokens are spelled `dragSelect`, and their hooks changed from `--erd-editor-darg-select-background` and `--erd-editor-darg-select-border` to `--erd-editor-drag-select-background` and `--erd-editor-drag-select-border`. A stylesheet still using the old names is ignored.

<details>
<summary>Default theme values</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Display Language

Since `4.0.0` the editor's own text — its menus, panels, dialogs, quick search, toasts, and the words it draws on the diagram such as `unnamed`, image exports included — comes in 25 languages. Table and column names, SQL, data types, and generated code are never translated. See [Language and Theme](../guide/guides/language-and-theme.md).  
Before [setLocale](#setlocale) is called or a language is picked, the editor shows English, or follows `'system'` while [enableLocalePicker](#enablelocalepicker) is on.  
The editor sets `lang` and `dir` on its own root inside the closed shadow root, never on the host element or the page, so a right-to-left page does not flip the editor and a right-to-left language does not flip the page. Hebrew, Arabic, and Persian lay the editor's interface out right to left; the diagram itself is never mirrored. Since `4.1.0` the [Explorer](../guide/guides/explorer.md) stays at the left of the canvas in every language, its own rows reading right to left in those three.  
The package exports the types `LocaleCode` (one of the codes below) and `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Code    | Shown as             | Language             |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonesian           |
| `de-DE` | Deutsch              | German               |
| `en`    | English              | English              |
| `es-ES` | Español              | Spanish              |
| `eu-ES` | Euskara              | Basque               |
| `fr-FR` | Français             | French               |
| `it-IT` | Italiano             | Italian              |
| `nl-NL` | Nederlands           | Dutch                |
| `pl-PL` | Polski               | Polish               |
| `pt-PT` | Português            | Portuguese           |
| `pt-BR` | Português Brasileiro | Brazilian Portuguese |
| `ro-RO` | Română               | Romanian             |
| `sk-SK` | Slovenčina           | Slovak               |
| `sl-SI` | Slovenščina          | Slovenian            |
| `sv-SE` | Svenska              | Swedish              |
| `tr-TR` | Türkçe               | Turkish              |
| `ru-RU` | Русский              | Russian              |
| `uk-UA` | Українська           | Ukrainian            |
| `he-IL` | עברית                | Hebrew               |
| `ar-SA` | العربية              | Arabic               |
| `fa-IR` | فارسی                | Persian              |
| `ja-JP` | 日本語               | Japanese             |
| `zh-CN` | 简体中文             | Simplified Chinese   |
| `zh-TW` | 繁體中文             | Traditional Chinese  |
| `ko-KR` | 한국어               | Korean               |

### setLocale

Sets the display language: `'system'`, or one of the codes above. Anything else, such as a bare `'ko'`, an unknown code, or a value that is not a string, is ignored without an error.  
It applies before it returns, so a language set before the element is appended is in its first frame.  
It emits nothing, neither `changeLocale` nor `change`, and touches none of `value`, the undo history, or a shared store.  
The choice stays whichever way `enableLocalePicker` is turned, and `setLocale('system')` follows the system with the picker off too.  
The editor stores nothing. To keep a reader's choice, listen for [changeLocale](#changelocale) and pass it back on the next load.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale

Names the language `'system'` stands for, as a BCP 47 tag, for a host with a display language of its own. The VS Code, JetBrains, and Obsidian hosts call it with their own display language.  
The tag is trimmed. `null`, a blank string, or a value that is not a string goes back to the browser's `navigator.languages`, which the editor follows as it changes.  
It matters only while the option in force is `'system'`, and it applies at once. The picker's `System` row names the language it resolves to.  
The tag, or each of the browser's languages in order, resolves to the first language the editor has, by its language subtag, with letter case and underscores ignored: `de-AT` gives `de-DE` and `en-GB` gives `en`. Chinese goes by its script, `Hant` giving `zh-TW` and `Hans` giving `zh-CN`, and without one by region, `TW`, `HK`, and `MO` giving `zh-TW` and any other `zh-CN`. `pt` gives `pt-BR` unless a region other than `BR` is named. When nothing matches, the editor shows English.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL

Loads a Schema SQL file.  
By default it replaces the current document rather than merging into it; see `mode` below. The settings you already have are kept, each lock and its locked value included, apart from the view position and the zoom level, and the tables are placed once the file is read, in rows unless `placement` below asks otherwise. With `Viewport` locked, `value` then writes the view the import starts on, origin `0, 0` at zoom level `1`. A document imported into an element never given a value therefore has every lock on, as a new document does.  
Since `4.2.0` a replace also keeps the document's words, terms, and domains, which the text cannot hold, with each Dictionary sheet's undo history, and an undo or redo of the import keeps them too. A replacing [setSchemaJSON](#setschemajson) and assigning `value` take the ones their document holds instead.  
It is recorded in the history list, enabling `Undo, Redo`, and it emits `change`. An empty string is ignored, and the call does nothing while `readonly` is set.  
`setSchemaGraphQL`, `setSchemaDBML`, and `setSchemaAML` behave the same way, and their parsers never fail: text they cannot read loads an empty document rather than raising an error.  
Since `4.0.0` all four take an optional second argument, `{ placement, mode }`:

- `placement: 'grid'`, the default, lands the tables in rows at once, as before, and the call returns nothing.
- `placement: 'auto'` first lays the tables out by their relationships, as `Import` in the editor does, and returns a `Promise` that resolves once the import has landed as one undo step. Fewer than two tables, no relationship, a layout that fails, a page without `SharedWorker`, or `Cancel` on the `Placing tables` toast lands them in rows instead. A load in the meantime — another replacing import, assigning `value`, `setInitialValue()`, `clear()`, a collaborator's load, or an undo or redo of a load or of `clear()` — supersedes it, and the `Promise` resolves with nothing loaded. Imports placed this way land in the order they started.
- `mode: 'replace'`, the default, replaces the document. `mode: 'append'` adds the file below the diagram as [Import and Add](../guide/guides/file-import-export.md#import-and-add) does, leaving every table already there as it is, and every setting apart from the tab and the view position. From another tab the ERD tab comes up first. The new tables, and the table groups a DBML file brings while table groups are shown, become the selection, and the view scrolls to them unless they already show well, by the rule every jump follows since `4.1.0` — see [Where a Jump Lands](../guide/guides/table-related-functions.md#where-a-jump-lands). One undo removes the whole addition. Text it cannot read adds nothing and leaves the document as it is.

While `readonly` is set, a replace is ignored, an append adds nothing, and a `placement: 'auto'` call resolves at once.  
Since `3.10.0`, `setSchemaSQL` reads the file for the document's current database: with Databricks selected, single-quoted strings follow Spark's backslash escapes. See [Comments](../guide/guides/file-import-export.md#comments).  
Since `3.10.0`, `setSchemaSQL` reads a `UNIQUE` over two or more columns as one unique index rather than a Unique flag on each column. See [Unique Keys and Indexes](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Since `3.10.0` SQL, DBML, and AML imports keep the `ON DELETE` and `ON UPDATE` actions of the foreign keys they read.  
Since `4.0.0`, `setSchemaSQL` keeps a column's whole `DEFAULT` expression, reads SQL Server's `ADD DEFAULT … FOR` and its `MS_Description` comments, turns PostgreSQL serial and identity columns into Auto Increment, keeps `UNSIGNED` and `ZEROFILL` in a data type, and reads a primary key that `ALTER TABLE … ADD PRIMARY KEY` marks `CLUSTERED`, `NONCLUSTERED`, or `USING BTREE`. See [Schema SQL](../guide/guides/file-import-export.md#schema-sql).  
See [Importing or Exporting Files](../guide/guides/file-import-export.md) for the syntax each parser accepts.

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL

Loads a GraphQL SDL document.  
Object type definitions become tables, and a field whose type is another table becomes a relationship.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

Loads a DBML file, the format used by dbdiagram.io and dbdocs.  
Since `4.0.0` each `TableGroup` becomes a [table group](../guide/guides/table-groups.md), and a table's `headercolor` becomes its color. See [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

Loads an AML (Azimutt Markup Language) file. Both the current spelling and the legacy v1 one are accepted.  
Since `4.0.0` an entity's color, one of Azimutt's color names or a quoted hex value, becomes its table's color. See [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON

Since `4.0.0`, loads an `.erd.json` document, such as the text [value](#value) returns.  
In its default `mode: 'replace'` it loads the document as assigning `value` does: it is recorded in the history list, emits `change`, and takes the document's locks the same way, and since `4.2.0` the document's words, terms, and domains replace the editor's. Unlike `value`, an empty string or a value that is not a string is ignored rather than starting a new document. Text that is not JSON empties the document, as it does with `value`.  
`mode: 'append'` adds the document's tables, relationships, indexes, memos, and table groups below the diagram under new ids, keeping their places relative to each other and leaving out the document's settings, as [Import and Add](../guide/guides/file-import-export.md#import-and-add) does with a `json` file. Since `4.2.0` it keeps the tables' and columns' logical names and derived-name flags but leaves the document's words, terms, and domains behind, so none of its columns links a domain. Text it cannot read, or a document with no table and no memo, adds nothing. Otherwise it lands as a [setSchemaSQL](#setschemasql) append does, its new memos and table groups selected with its tables, each kind while it is shown.  
It returns once the document has landed, and it is ignored while `readonly` is set.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL

Exports the current editor state as Schema SQL.  
If `databaseVendor` is not specified, it writes for the database the editor shows: the document's, unless a [read-only](#readonly) editor's reader picked another, which since `5.0.0` stays on that screen and is what its Schema SQL tab shows. A name that is not in the list below is treated the same way, without raising an error.  
Names are quoted with the bracket type the editor shows. While `Bracket Type` is [locked](../guide/guides/settings.md#lock), or in a read-only editor whose reader picked another since `5.0.0`, that can differ from the one `value` saves, which is the one a coding agent's [`erd_read`](../mcp/tools.md#reading-a-document) quotes with. The names written are always the physical ones, whatever the Name View.  
Since `4.0.0` an optional `options` argument chooses the statements and the header, as the options of the [Schema SQL](../guide/guides/schema-sql.md) tab do, and since `4.2.0` whether logical names fill empty comments. `SchemaSQLOptions` is exported as a type.

- `statements`: `'create'`, the default; `'ifNotExists'`, which writes `IF NOT EXISTS` on MySQL, MariaDB, PostgreSQL, SQLite, and Databricks and falls back to `'create'` elsewhere; or `'recreate'`, which drops the tables before creating them, Snowflake writing `CREATE OR REPLACE TABLE` instead.
- `header`: `'none'`, the default; `'use'`, which switches to the document's database or schema; or `'createAndUse'`, which first creates it if it does not exist and then switches to it. A database that lacks the one asked for falls back as the tab does: Oracle writes `'use'` for `'createAndUse'`, PostgreSQL writes no header for `'use'`, and SQLite writes none. A header is written only while the document's database name is a plain identifier — ASCII letters, digits, and `_`, not starting with a digit.
- `logicalNameAsComment`, since `4.2.0`: `true` writes a table's or column's logical name as its comment where its own comment is empty or only blanks and the logical name is not, in the form that database writes a comment. A comment with text is written as before. Only `true` turns it on: left out, `false`, or any other value, such as `'true'` or `1`, writes no logical name. It does what the tab's [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) switch does.

An option left out, or one with an unknown value, reads as its default, so a call without options writes plain `CREATE` statements with no header, as before.  
Since `4.0.0` the output always includes the document's `Before tables` and `After tables` scripts, in the order header, before script, drop statements, tables, after script. The Schema SQL tab's own `Statements`, `Header`, `Write logical names into empty comments`, and `Tables` choices never affect this call, which always writes the whole document.  
Since `3.10.0` each foreign key carries the relationship's `ON DELETE` and `ON UPDATE` clauses. A clause is written only when its action is set and the vendor accepts it, so an action that vendor does not take is left out and its default applies. Since `4.0.0` Snowflake accepts only `NO ACTION`. See [ON DELETE and ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) for what each database writes.  
Since `3.10.0` a single quote inside a table or column comment is escaped, so a comment such as `it's` no longer breaks the statement. Every vendor that writes comments as string literals doubles it, except Databricks, which puts a backslash before each quote and each backslash. SQLite still writes comments as `--` lines.  
Since `4.2.0` SQL Server writes each comment as a national literal, `N'…'`, so text outside the database's code page, such as Korean, is kept. Oracle writes each run of blank lines in a comment as one line break, and SQLite writes a comment's line breaks as spaces, so it stays on its `--` line. See [Comments](../guide/guides/schema-sql.md#comments).  
Since `4.0.0` several databases also write key names, defaults, and auto increment differently. See [What the DDL Writes](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore

Returns a store for real-time collaborative editing.  
`config` is `{ getNickname?, mouseTracker?, focusTracker? }`. Both trackers default to `true`: `mouseTracker` broadcasts this editor's cursor to the others, and `focusTracker` broadcasts its focused cell, selection, and drag box.  
Since `5.0.0` the store sends no change while [readonly](#readonly) is set, only what its trackers send and the registers a joining editor asks for, and it still applies what the others send.  
See [Collaborative Editing](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue

Opens the Diff Viewer, comparing the document currently open against the one you pass.  
It returns nothing and does not modify the document, so closing the viewer leaves the editor exactly as it was.  
A blank value, or anything that is not a string, is compared against an empty document.  
It is the same overlay as [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) in the canvas context menu.  
Since `4.1.0` it pairs what the two documents hold by id first and only then by what each keeps, such as a table's name or a memo's text — see [What Is Compared](../guide/guides/table-related-functions.md#what-is-compared). Against an earlier version of the same document, such as a Git revision of its file, a rename therefore shows as one renamed item; against a document whose ids differ, it shows as a removal and an addition. The viewer lists what changed in a tree beside the two documents and marks the changes in color instead of filling cells.  
Since `4.2.0` both documents open in the Name View this editor shows, whatever the document passed saved, and the tree names tables and columns by it too — see [Beyond the Canvas](../guide/guides/logical-names.md#beyond-the-canvas). Logical names, domain links, and the dictionaries are not compared, so a change to them alone shows no change.

```js
editor.setDiffValue('prev json...');
```
