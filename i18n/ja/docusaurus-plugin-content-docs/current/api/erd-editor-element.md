---
sidebar_position: 2
---

# ErdEditorElement

エディタは単なる `HTMLElement` です。  
型定義は次のとおりです。

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
  setKeyBindingMap: (keyBindingMap: Partial<KeyBindingMap>) => void;
  setSchemaSQL: (value: string) => void;
  getSchemaSQL: (databaseVendor?: DatabaseVendor) => string;
  getSharedStore: (
    config?: SharedStoreConfig & { mouseTracker?: boolean }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

## readonly

エディタを編集可能にするかどうかを設定します。

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

システムのダーク / ライトモードに自動で同期するかどうかを設定します。

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

プリセットテーマを簡単に設定できる UI を提供するかどうかを設定します。

<img src="/img/theme-builder.png" width="400" alt="テーマビルダーの UI" loading="lazy" />

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

プリセットテーマの変更時に `changePresetTheme` イベントを発行します。

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

## value

### getter

現在のエディタの状態を JSON データとして取得します。

```js
const data = editor.value;
```

### setter

以前に保存したエディタの状態を読み込みます。履歴に記録されるため `Undo, Redo` が可能です。

```js
editor.value = 'json...';
```

## setInitialValue

以前に保存したエディタの状態を読み込みます。履歴に記録されないため `Undo, Redo` はできません。

```js
editor.setInitialValue('json...');
```

## Event

### change

エディタに変更があるとイベントを発行します。  
200ms のデバウンスがかかり、`readonly` が `true` の間は発行されません。  
`value` への代入では発行されますが、`setInitialValue` では発行されません。

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

## focus

エディタにフォーカスを当てます。

```js
editor.focus();
```

## blur

エディタのフォーカスを外します。

```js
editor.blur();
```

## clear

エディタの状態を初期化します。

```js
editor.clear();
```

## destroy

エディタのインスタンスを完全に破棄し、再利用できないようにします。

```js
editor.destroy();
```

## setKeyBindingMap

キーボードショートカットを再定義します。  
`edit`、`stop`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut` は固定で、再定義できません。

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: KeyBindingMap = {
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
  selectAllTable: [{ shortcut: '$mod+Alt+KeyA', preventDefault: true }],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

### $mod

環境に応じて `Control` キーを切り替えます。

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### ショートカット表

キーボードイベントの `key, code` プロパティを使用します。  
絶対位置には `code` を、入力値には `key` を使用します。

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

プリセットテーマを設定します。

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

テーマをカスタマイズできます。

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

  dargSelectBackground: string;
  dargSelectBorder: string;

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
editor.setTheme({...});
```

#### CSS Variables

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
  --erd-editor-darg-select-background: #253974;
  --erd-editor-darg-select-border: #435db1;
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

## setSchemaSQL

Schema SQL ファイルを読み込みます。

```js
editor.setSchemaSQL('Schema SQL...');
```

## getSchemaSQL

現在のエディタの状態を Schema SQL として書き出します。  
`databaseVendor` を指定しない場合は、現在設定されているベンダーに従って動作します。

```ts
type DatabaseVendor =
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'SQLite';

const schemaSQL = editor.getSchemaSQL();
```

## getSharedStore

リアルタイム共同編集のための store を返します。  
[共同編集](./advanced/collaborative-editing.md)を参照してください。

## setDiffValue

現在のエディタの状態と以前の状態を比較します。

```js
editor.setDiffValue('prev json...');
```
