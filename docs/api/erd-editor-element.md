---
sidebar_position: 2
description: The erd-editor element API — attributes, value, events, theming, key bindings, and schema import and export.
---

# ErdEditorElement

The editor is a plain `HTMLElement`.  
Its type definition is as follows.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  value: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'search'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: (value: string) => void;
  setSchemaGraphQL: (value: string) => void;
  setSchemaDBML: (value: string) => void;
  setSchemaAML: (value: string) => void;
  getSchemaSQL: (databaseVendor?: DatabaseVendor) => string;
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

`readonly`, `system-dark-mode`, and `enable-theme-builder` are the only attributes, and all three default to `false`.

## readonly

Sets the editing capability of the editor.  
While it is set, assigning `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, undo, and redo are all ignored, and the `change` event is never emitted. Load a document with [setInitialValue](#setinitialvalue) instead.  
Viewing still works: zoom, panning, the hand tool, zen mode, the canvas tab, the [Visualization](../guide/guides/visualization.md) tab in both of its modes with focusing on tables included, the database vendor, and the SQL and code generator output settings all still apply, so a read-only viewer can still export SQL for another vendor or read generated code.  
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
Turning it on sets the theme's `appearance` from the operating system, overriding whatever [setPresetTheme](#setpresettheme) had written, and the OS switching mode overwrites it again. A `setPresetTheme` call made in between still applies, until the next OS change. Turning it off freezes the last value.

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

<img src="/img/theme-builder.png" width="400" alt="Theme builder UI" loading="lazy" />

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Changing the preset theme from this panel emits the [changePresetTheme](#changepresettheme) event.

## value

### getter

Retrieves the current editor state as a JSON string, in the [schema](./advanced/schema.md) the editor defines.  
The document's own `ignoreSaveSettings` is applied while serializing: with the scroll bit set the view origin is written as `0, 0`, and with the zoom bit set the zoom level is written as `1`.

```js
const data = editor.value;
```

### setter

Loads a previously saved editor state. It replaces the whole document — the current one is cleared first.  
Like `clear()`, `setInitialValue()`, and the `setSchema*` methods, it also discards the Visualization tab's Flow view: its layout, the tables it is narrowed to, its row display, zoom, and pan.  
It is recorded in the history list, enabling `Undo, Redo`, and it emits `change`.  
A blank string, or anything that is not a string, loads an empty document rather than raising an error, so guard the value before assigning it.  
It is ignored while `readonly` is set; use [setInitialValue](#setinitialvalue) to load into a read-only editor.

```js
editor.value = 'json...';
```

## setInitialValue

Loads a previously saved editor state. It is not recorded in the history list, so `Undo, Redo` is not possible, and no `change` event is emitted.  
A blank string, or anything that is not a string, loads an empty document rather than raising an error, so `setInitialValue('')` starts a blank diagram.  
Unlike assigning `value`, it is not blocked by `readonly`, so it is how you load a document into a read-only viewer.

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

`change` and `changePresetTheme` are the only two public events.  
The element also dispatches internal `@dineug/erd-editor/internal-*` events on itself for its own wiring; those are not part of the API.

### change

When there are changes in the editor, it emits an event.  
The event is debounced by 200ms, and it is not emitted while `readonly` is `true`.  
It fires for any document change — an edit in the UI, assigning `value`, `clear()`, and each of the `setSchema*` methods. `setInitialValue` does not emit it.  
Nothing done inside the Visualization tab's Flow mode emits it — zoom, panning, moving cards, `Tidy Up`, the row display, or narrowing the view from a card — since none of it is a document change. Switching tabs does, so focusing on tables from the ERD tab emits one `change`, and so does the external-link card button that takes you from Flow back to the ERD tab.  
The event carries no `detail` and neither bubbles nor crosses the shadow boundary, so listen on the element itself and read `editor.value` in the handler.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

Emitted when the preset theme is changed from the built-in theme builder.  
Calling [setPresetTheme](#setpresettheme) yourself does not emit it.  
`event.detail` is the fully resolved `ThemeOptions` — `{ appearance, grayColor, accentColor }` — not the partial that was requested.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
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

Resets the editor state.  
It is recorded in the history list, so it can be undone, and it emits `change`. It is ignored while `readonly` is set.

```js
editor.clear();
```

## destroy

Completely destroys the editor instance so that it can no longer be reused.  
It releases the editor's listeners and subscriptions, and destroys every shared store returned by [getSharedStore](#getsharedstore).

```js
editor.destroy();
```

## setKeyBindingMap

Redefines keyboard shortcuts.  
`edit`, `stop`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` and `zoomReset` are fixed and cannot be redefined.  
Only the sixteen names below are written; anything else in the object is ignored, including the fixed names.  
A binding value must be a `ShortcutOption[]`. A bare string is ignored, so write `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` rather than `{ addTable: 'Alt+KeyN' }`.  
The call is a partial merge: names you leave out keep their defaults, and calling it twice keeps the earlier changes. There is no getter for the current bindings.

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
  | 'search'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
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

`selectAllTable` and `handTool` give way to a caret: while the focus is in an input, a textarea, or a `contenteditable`, `$mod + A` selects the text and `Space` types a space instead of reaching the canvas. Whatever you rebind them to behaves the same way.

`focusView` acts on the ERD tab only. With at least one table selected, it opens the Visualization tab in Flow mode, narrowed to those tables and every table one relationship away; with no table selected it does nothing. See [Focusing on Tables](../guide/guides/visualization.md#focusing-on-tables).

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

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light';
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
  tableSelect: string;
  tableBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;

  columnSelect: string;
  columnHover: string;

  relationshipHover: string;

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

  diffInsertBackground: string;
  diffDeleteBackground: string;
  diffCrossBackground: string;
  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffCrossForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

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
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-column-select: #2e3135;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
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
  --erd-editor-diff-insert-background: #113b29;
  --erd-editor-diff-delete-background: #500f1c;
  --erd-editor-diff-cross-background: #003362;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-cross-foreground: #70b8ff;
}
```

</details>

## setSchemaSQL

Loads a Schema SQL file.  
It replaces the current document rather than merging into it. The settings you already have are kept, apart from the view position and the zoom level, and the tables are placed automatically once the file is read.  
It is recorded in the history list, enabling `Undo, Redo`, and it emits `change`. An empty string is ignored, and the call does nothing while `readonly` is set.  
`setSchemaGraphQL`, `setSchemaDBML`, and `setSchemaAML` behave the same way, and their parsers never fail: text they cannot read loads an empty document rather than raising an error.  
See [Importing or Exporting Files](../guide/guides/file-import-export.md) for the syntax each parser accepts.

```js
editor.setSchemaSQL('Schema SQL...');
```

## setSchemaGraphQL

Loads a GraphQL SDL document.  
Object type definitions become tables, and a field whose type is another table becomes a relationship.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

Loads a DBML file, the format used by dbdiagram.io and dbdocs.

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

Loads an AML (Azimutt Markup Language) file. Both the current spelling and the legacy v1 one are accepted.

```js
editor.setSchemaAML('AML...');
```

## getSchemaSQL

Exports the current editor state as Schema SQL.  
If `databaseVendor` is not specified, it operates based on the currently set vendor. A name that is not in the list below is treated the same way, without raising an error.

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

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
```

## getSharedStore

Returns a store for real-time collaborative editing.  
`config` is `{ getNickname?, mouseTracker?, focusTracker? }`. Both trackers default to `true`: `mouseTracker` broadcasts this editor's cursor to the others, and `focusTracker` broadcasts its focused cell, selection, and drag box.  
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

```js
editor.setDiffValue('prev json...');
```
