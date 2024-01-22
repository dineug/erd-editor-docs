---
sidebar_position: 2
---

# ErdEditorElement

에디터는 단순한 HTMLElement 입니다.  
타입정의는 다음과 같습니다.

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
  getSharedStore: (config?: SharedStoreConfig) => SharedStore;
}
```

## readonly

에디터 편집 가능여부를 설정합니다.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

시스템에 다크/라이트 모드를 자동으로 동기화할지 설정합니다.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('systemDarkMode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

preset 테마를 쉽게 사용자 설정할 수 있는 UI를 제공할지 여부입니다.

<img src="/img/theme-builder.png" width="400" />

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enableThemeBuilder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

preset 테마 변경에 대한 `changePresetTheme` 이벤트를 발생시킵니다.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

## value

### getter

현재 에디터 상태를 json 데이터로 받아옵니다.

```js
const data = editor.value;
```

### setter

이전에 저장했던 에디터 상태를 불러옵니다.  
History 목록에 기록되어 `Undo, Redo`가 가능합니다.

```js
editor.value = 'json...';
```

## setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다.  
History 목록에 기록되지 않아 `Undo, Redo`가 불가능합니다.

```js
editor.setInitialValue('json...');
```

## Event

### change

에디터에 변경이 있을때 이벤트를 발행합니다.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

## focus

에디터에 포커스를 줍니다.

```js
editor.focus();
```

## blur

에디터에 포커스를 제거합니다.

```js
editor.blur();
```

## clear

에디터 상태를 초기화합니다.

```js
editor.clear();
```

## destroy

에디터 인스턴스를 재사용 불가능하게 완전히 파괴합니다.

```js
editor.destroy();
```

## setKeyBindingMap

단축키를 재정의합니다.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: KeyBindingMap = {
  addTable: [{ shortcut: 'Alt+KeyN' }],
  addColumn: [{ shortcut: 'Alt+Enter' }],
  addMemo: [{ shortcut: 'Alt+KeyM' }],
  removeTable: [{ shortcut: '$mod+Backspace' }, { shortcut: '$mod+Delete' }],
  removeColumn: [{ shortcut: 'Alt+Backspace' }, { shortcut: 'Alt+Delete' }],
  primaryKey: [{ shortcut: 'Alt+KeyK' }],
  selectAllTable: [{ shortcut: '$mod+Alt+KeyA' }],
  selectAllColumn: [{ shortcut: 'Alt+KeyA' }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1' }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2' }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3' }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4' }],
  tableProperties: [{ shortcut: 'Alt+Space' }],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }];
});
```

### $mod

Control키를 환경에 따라 분기합니다.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Shortcut Table

키보드 이벤트 `key, code` 프로퍼티를 사용합니다.  
절대 위치로는 `code`를 사용합니다.  
입력값은 `key`를 사용합니다.

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
| `+`           | `+`             | `+`           | `Equal`\*                      |

## Theme

### setPresetTheme

preset 테마를 설정합니다.

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

테마 사용자 정의가 가능합니다.

#### javascript

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
}
```

## setSchemaSQL

스키마 SQL 파일을 불러옵니다.

```js
editor.setSchemaSQL('Schema SQL...');
```

## getSchemaSQL

현재 에디터 상태를 스키마 SQL로 추출합니다.  
`databaseVendor`가 없으면 현재 에디터에 설정된 Vendor로 동작합니다.

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
