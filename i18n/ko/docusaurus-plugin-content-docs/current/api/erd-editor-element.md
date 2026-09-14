---
sidebar_position: 2
description: erd-editor 엘리먼트 API의 속성, value, 이벤트, 테마, 단축키와 스키마 가져오기, 내보내기.
---

# ErdEditorElement

에디터는 단순한 `HTMLElement`입니다.  
타입 정의는 다음과 같습니다.

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

에디터는 closed shadow root에 렌더링되므로 `editor.shadowRoot`는 `null`이고 페이지 스타일이 안팎으로 새지 않습니다.  
내부 요소는 선택자로 접근할 수 없기 때문에, 스타일은 [setTheme](#settheme)과 `--erd-editor-*` 커스텀 프로퍼티로 지정하세요.

속성은 `readonly`, `system-dark-mode`, `enable-theme-builder` 3개뿐이며, 셋 다 기본값은 `false`입니다.

## readonly

에디터 편집 가능 여부를 설정합니다.  
설정된 동안에는 `value` 할당, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, Undo, Redo가 모두 무시되고 `change` 이벤트도 발행되지 않습니다. 문서를 불러올 때는 [setInitialValue](#setinitialvalue)를 사용하세요.  
보기는 그대로 동작합니다. 확대/축소, 화면 이동, 손 도구, Zen 모드, 캔버스 탭, 두 모드와 테이블 포커스를 포함한 [Visualization](../guide/guides/visualization.md) 탭, 데이터베이스 벤더, SQL과 코드 생성 출력 설정이 모두 적용되므로, `readonly` 상태에서도 다른 벤더의 SQL을 내보내거나 생성된 코드를 확인할 수 있습니다.  
속성만 쓰거나 `=""`, `="true"`는 모두 `true`로 읽힙니다. `="false"`는 `false`로 읽히고, HTML 관용 표기인 `readonly="readonly"`를 포함해 그 밖의 문자열도 마찬가지입니다.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

시스템의 다크/라이트 모드를 자동으로 동기화할지 설정합니다.  
켜면 테마의 `appearance`를 운영체제 설정으로 지정하며, [setPresetTheme](#setpresettheme)으로 지정했던 값을 덮어씁니다. 운영체제가 모드를 전환하면 다시 덮어씁니다. 그 사이에 호출한 `setPresetTheme`은 다음 운영체제 변경 전까지 그대로 적용됩니다. 끄면 마지막 값이 그대로 유지됩니다.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

preset 테마를 쉽게 사용자 정의할 수 있는 UI를 제공할지 여부입니다.

![테마 빌더를 열어 액센트 색상과 그레이 색상 변경](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

이 패널에서 preset 테마를 변경하면 [changePresetTheme](#changepresettheme) 이벤트를 발행합니다.

## value

### getter

현재 에디터 상태를 에디터가 정의한 [스키마](./advanced/schema.md) 형식의 JSON 문자열로 받아옵니다.  
직렬화할 때 해당 문서의 `ignoreSaveSettings`가 적용되어, 스크롤 비트가 설정되어 있으면 화면 원점이 `0, 0`으로, 확대/축소 비트가 설정되어 있으면 확대/축소 레벨이 `1`로 기록됩니다.

```js
const data = editor.value;
```

### setter

이전에 저장했던 에디터 상태를 불러옵니다. 문서 전체를 교체하며, 현재 문서는 먼저 비워집니다.  
`clear()`, `setInitialValue()`, `setSchema*` 메서드와 마찬가지로 Visualization 탭의 Flow 뷰도 버립니다. 배치, 범위를 좁혀 둔 테이블, 행 표시, 확대/축소, 화면 이동 상태가 모두 해당합니다.  
히스토리 목록에 기록되어 `Undo, Redo`가 가능하고, `change` 이벤트를 발행합니다.  
빈 문자열이나 문자열이 아닌 값은 에러가 아니라 빈 문서로 불러오므로, 할당하기 전에 값을 확인하세요.  
`readonly`가 설정된 동안에는 무시되며, `readonly` 에디터에 문서를 불러올 때는 [setInitialValue](#setinitialvalue)를 사용하세요.

```js
editor.value = 'json...';
```

## setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다. 불러오기 자체는 히스토리 목록에 기록되지 않아 되돌릴 수 없고, `change` 이벤트도 발행되지 않습니다.  
불러올 때 Undo 기록도 비우므로, 불러오기 전에 한 작업을 불러온 문서 위에서 `Undo, Redo`할 수 없습니다.  
빈 문자열이나 문자열이 아닌 값은 에러가 아니라 빈 문서로 불러오므로, `setInitialValue('')`는 빈 다이어그램으로 시작합니다.  
`value` 할당과 달리 `readonly`에 막히지 않기 때문에, `readonly` 에디터에 문서를 불러오는 방법입니다.

```js
editor.setInitialValue('json...');
```

시작할 때 불러오고, 변경될 때 저장합니다.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event

공개 이벤트는 `change`와 `changePresetTheme` 2개뿐입니다.  
엘리먼트는 내부 연결을 위해 자기 자신에게 `@dineug/erd-editor/internal-*` 이벤트도 발행하지만, 이는 API가 아닙니다.

### change

에디터에 변경이 있을 때 이벤트를 발행합니다.  
200ms 디바운스되며, `readonly`가 `true`인 동안에는 발행되지 않습니다.  
UI 편집, `value` 할당, `clear()`, 각 `setSchema*` 메서드 등 문서가 변경되는 모든 경우에 발행됩니다. `setInitialValue`는 발행하지 않습니다.  
Visualization 탭의 Flow 모드 안에서 하는 확대/축소, 화면 이동, 카드 이동, `Tidy Up`, 행 표시 변경, 카드에서 뷰 범위 좁히기는 모두 문서 변경이 아니므로 어느 것도 이벤트를 발행하지 않습니다. 탭 전환은 발행하므로, ERD 탭에서 테이블 포커스를 실행하면 `change`가 한 번 발행되고, Flow에서 ERD 탭으로 돌아가는 외부 링크 카드 버튼도 마찬가지입니다.  
이벤트에는 `detail`이 없고 버블링되거나 shadow 경계를 넘지도 않으므로, 엘리먼트 자체에서 수신하고 핸들러에서 `editor.value`를 읽으세요.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

내장 테마 빌더에서 preset 테마를 변경할 때 발행합니다.  
직접 [setPresetTheme](#setpresettheme)을 호출한 경우에는 발행되지 않습니다.  
`event.detail`은 요청한 일부 값이 아니라 모두 채워진 `ThemeOptions`(`{ appearance, grayColor, accentColor }`)입니다.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

## focus

에디터에 포커스를 줍니다.

```js
editor.focus();
```

## blur

에디터의 포커스를 제거합니다.

```js
editor.blur();
```

## clear

에디터 상태를 초기화합니다.  
히스토리 목록에 기록되어 Undo가 가능하고, `change` 이벤트를 발행합니다. `readonly`가 설정된 동안에는 무시됩니다.

```js
editor.clear();
```

## destroy

에디터 인스턴스를 재사용 불가능하게 완전히 파괴합니다.  
에디터의 리스너와 구독을 해제하고, [getSharedStore](#getsharedstore)로 반환된 모든 shared store를 파괴합니다.

```js
editor.destroy();
```

## setKeyBindingMap

단축키를 재정의합니다.  
`edit`, `stop`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut`, `zoomReset`은 고정이며 재정의할 수 없습니다.  
아래 16개 이름만 적용되고, 고정된 이름을 포함해 객체의 나머지 값은 무시됩니다.  
값은 `ShortcutOption[]`이어야 합니다. 문자열만 전달하면 무시되므로 `{ addTable: 'Alt+KeyN' }`이 아니라 `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`으로 작성하세요.  
호출은 부분 병합이라 생략한 이름은 기본값을 유지하고, 두 번 호출해도 앞선 변경이 유지됩니다. 현재 설정을 읽는 getter는 없습니다.

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

`selectAllTable`과 `handTool`은 커서에 양보합니다. 포커스가 input, textarea, `contenteditable` 안에 있는 동안에는 `$mod + A`가 텍스트를 선택하고 `Space`는 공백을 입력하며, 캔버스까지 전달되지 않습니다. 다른 단축키로 재정의해도 동작은 같습니다.

`focusView`는 ERD 탭에서만 동작합니다. 테이블이 하나 이상 선택되어 있으면 Visualization 탭을 Flow 모드로 열어, 선택한 테이블과 그 테이블에 관계 하나로 이어진 모든 테이블로 범위를 좁힙니다. 선택한 테이블이 없으면 아무 동작도 하지 않습니다. [테이블 포커스](../guide/guides/visualization.md#테이블-포커스) 문서를 참고하세요.

### $mod

Control키를 환경에 따라 분기합니다.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Shortcut Table

키보드 이벤트 `key, code` 프로퍼티를 사용합니다.  
절대 위치에는 `code`를, 입력값에는 `key`를 사용합니다.

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

preset 테마를 설정합니다.  
기본값은 `appearance: 'dark'`, `grayColor: 'slate'`, `accentColor: 'indigo'`입니다.  
각 필드는 개별로 적용되므로 일부만 전달하면 나머지 두 개는 그대로 유지됩니다. 아래 목록에 없는 값은 무시되며, 호출이 에러를 발생시키지 않습니다.

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
호출할 때마다 사용자 정의 오버레이 전체가 교체되므로, 이미 재정의한 값 위에 토큰 하나만 바꾸려면 전체 객체를 다시 전달하고, preset으로 되돌리려면 `{}`를 전달하세요.  
아래 토큰 이름에 문자열 값을 지정한 것만 유지되고, 그 밖의 값은 에러 없이 버려집니다.  
오버레이는 preset 위에 놓이기 때문에, 이후에 `setPresetTheme`을 호출하면 아래쪽 preset만 바뀌고 재정의한 값은 그대로 유지됩니다.

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

`Theme`의 모든 토큰은 `--erd-editor-`에 케밥 케이스 키를 붙인 CSS 훅을 가집니다. `grayColor10`은 `--erd-editor-gray-color-10`, `keyPK`는 `--erd-editor-key-pk`, `keyPFK`는 `--erd-editor-key-pfk`입니다.  
훅은 에디터로 상속되므로 적용하려는 위치 어디에나 지정할 수 있습니다. `:root`에 지정하면 페이지의 모든 에디터에, 엘리먼트에 지정하면 해당 에디터에만 적용됩니다.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

`3.4.0`부터 잘못 표기되어 있던 `dargSelect` 토큰이 `dragSelect`로 바뀌었고, 훅도 `--erd-editor-darg-select-background`, `--erd-editor-darg-select-border`에서 `--erd-editor-drag-select-background`, `--erd-editor-drag-select-border`로 변경되었습니다. 예전 이름을 그대로 쓰는 스타일시트는 무시됩니다.

<details>
<summary>기본 테마 값</summary>

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

Schema SQL 파일을 불러옵니다.  
현재 문서에 병합하지 않고 교체합니다. 화면 위치와 확대/축소 레벨을 제외한 기존 설정은 유지되며, 파일을 읽고 나면 테이블이 자동으로 배치됩니다.  
히스토리 목록에 기록되어 `Undo, Redo`가 가능하고, `change` 이벤트를 발행합니다. 빈 문자열은 무시되고, `readonly`가 설정된 동안에는 아무 동작도 하지 않습니다.  
`setSchemaGraphQL`, `setSchemaDBML`, `setSchemaAML`도 동일하게 동작하며, 각 파서는 실패하지 않습니다. 읽을 수 없는 텍스트는 에러가 아니라 빈 문서로 불러옵니다.  
각 파서가 지원하는 문법은 [파일 가져오기와 내보내기](../guide/guides/file-import-export.md) 문서를 참고하세요.

```js
editor.setSchemaSQL('Schema SQL...');
```

## setSchemaGraphQL

GraphQL SDL 문서를 불러옵니다.  
오브젝트 타입 정의는 테이블이 되고, 다른 테이블을 타입으로 갖는 필드는 관계가 됩니다.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

dbdiagram.io와 dbdocs에서 사용하는 형식인 DBML 파일을 불러옵니다.

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

AML(Azimutt Markup Language) 파일을 불러옵니다. 현재 표기와 예전 v1 표기를 모두 지원합니다.

```js
editor.setSchemaAML('AML...');
```

## getSchemaSQL

현재 에디터 상태를 Schema SQL로 추출합니다.  
`databaseVendor`가 없으면 현재 에디터에 설정된 벤더로 동작합니다. 아래 목록에 없는 이름도 에러 없이 동일하게 처리됩니다.

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

실시간 공동 편집을 위한 store를 반환합니다.  
`config`는 `{ getNickname?, mouseTracker?, focusTracker? }`입니다. 두 tracker의 기본값은 모두 `true`이며, `mouseTracker`는 이 에디터의 커서를, `focusTracker`는 포커스된 셀, 선택 영역, 드래그 박스를 다른 참여자에게 전송합니다.  
[공동 편집](./advanced/collaborative-editing.md) 문서를 참고하세요.

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue

전달한 문서와 현재 열려 있는 문서를 비교하는 Diff Viewer를 엽니다.  
반환값이 없고 문서를 변경하지 않기 때문에, 뷰어를 닫으면 에디터는 그대로 유지됩니다.  
빈 값이나 문자열이 아닌 값은 빈 문서와 비교합니다.  
캔버스 컨텍스트 메뉴의 [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer)와 동일한 화면입니다.

```js
editor.setDiffValue('prev json...');
```
