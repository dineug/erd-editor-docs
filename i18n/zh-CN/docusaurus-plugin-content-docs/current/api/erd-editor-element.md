---
sidebar_position: 2
description: erd-editor 元素的 API：属性、value、事件、主题、按键绑定，以及 schema 的导入与导出。
---

# ErdEditorElement

编辑器就是一个普通的 `HTMLElement`。  
其类型定义如下。

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

编辑器渲染在封闭的 shadow root 中，因此 `editor.shadowRoot` 为 `null`，页面样式不会流入也不会流出。  
内部的任何内容都无法通过选择器访问，样式需改用 [setTheme](#settheme) 和 `--erd-editor-*` 自定义属性来设置。

`readonly`、`system-dark-mode` 和 `enable-theme-builder` 是仅有的三个属性，默认值均为 `false`。

## readonly

设置编辑器是否可编辑。  
在其生效期间，为 `value` 赋值、`clear()`、`setSchemaSQL()`、`setSchemaGraphQL()`、`setSchemaDBML()`、`setSchemaAML()`、undo 和 redo 都会被忽略，并且不会发出 `change` 事件。此时改用 [setInitialValue](#setinitialvalue) 加载文档。  
查看功能仍然可用：缩放、平移、抓手工具、禅模式、画布标签页、[Visualization](../guide/guides/visualization.md) 标签页的两种模式（包括聚焦于表）、数据库厂商，以及 SQL 与代码生成的输出设置都仍然生效，因此只读的查看者依然可以导出其他厂商的 SQL 或阅读生成的代码。  
仅写属性名、`=""` 和 `="true"` 都会被读作 `true`。`="false"` 会被读作 `false`，其他任何字符串也一样，包括 HTML 惯用写法 `readonly="readonly"`。

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

设置是否自动跟随系统的深色 / 浅色模式。  
开启后会根据操作系统设置主题的 `appearance`，覆盖 [setPresetTheme](#setpresettheme) 此前写入的值，而操作系统切换模式时又会再次覆盖它。期间调用的 `setPresetTheme` 仍然生效，直到操作系统下一次变更为止。关闭后会冻结最后的值。

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

设置是否提供便于配置预设主题的 UI。

![打开主题构建器，切换强调色和灰阶色](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

从该面板更改预设主题时会发出 [changePresetTheme](#changepresettheme) 事件。

## value

### getter

以 JSON 字符串的形式获取当前编辑器状态，采用编辑器定义的 [schema](./advanced/schema.md)。  
序列化时会应用文档自身的 `ignoreSaveSettings`：设置了 scroll 位时视图原点写为 `0, 0`，设置了 zoom 位时缩放级别写为 `1`。

```js
const data = editor.value;
```

### setter

加载此前保存的编辑器状态。它会替换整个文档，先清空当前文档。  
与 `clear()`、`setInitialValue()` 以及各个 `setSchema*` 方法一样，它也会丢弃 Visualization 标签页的 Flow 视图：包括它的布局、视图范围所缩小到的表、行显示、缩放和平移。  
会记录到历史列表中，因此可以 `Undo, Redo`，并且会发出 `change`。  
空字符串或非字符串的值不会报错，而是加载一个空白文档，因此赋值前需要先做好校验。  
在 `readonly` 生效期间会被忽略，要在只读编辑器中加载文档需使用 [setInitialValue](#setinitialvalue)。

```js
editor.value = 'json...';
```

## setInitialValue

加载此前保存的编辑器状态。加载本身不会记录到历史列表中，因此无法 Undo，也不会发出 `change` 事件。  
加载时还会清空历史记录，因此加载之前所做的操作无法在加载后的文档上 `Undo, Redo`。  
空字符串或非字符串的值不会报错，而是加载一个空白文档，因此 `setInitialValue('')` 会以空白的图开始。  
与为 `value` 赋值不同，它不受 `readonly` 限制，因此可以用它把文档加载到只读的查看器中。

```js
editor.setInitialValue('json...');
```

启动时加载，变更时保存。

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event

`change` 和 `changePresetTheme` 是仅有的两个公开事件。  
该元素还会在自身上派发内部的 `@dineug/erd-editor/internal-*` 事件用于内部衔接，它们不属于 API。

### change

编辑器发生变更时会发出事件。  
该事件有 200ms 的防抖，并且在 `readonly` 为 `true` 期间不会发出。  
任何文档变更都会触发它：在 UI 中编辑、为 `value` 赋值、`clear()`，以及各个 `setSchema*` 方法。`setInitialValue` 不会触发它。  
在 Visualization 标签页的 Flow 模式中所做的任何操作都不会触发它，包括缩放、平移、移动卡片、`Tidy Up`、行显示，以及从卡片缩小视图范围，因为这些都不是文档变更。切换标签页则会触发它，因此从 ERD 标签页聚焦于表会发出一次 `change`，把你从 Flow 带回 ERD 标签页的外部链接卡片按钮也同样如此。  
该事件不携带 `detail`，既不冒泡也不跨越 shadow 边界，因此需要在元素自身上监听，并在处理函数中读取 `editor.value`。

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

从内置的主题构建器更改预设主题时发出。  
自行调用 [setPresetTheme](#setpresettheme) 不会发出该事件。  
`event.detail` 是完全解析后的 `ThemeOptions`，即 `{ appearance, grayColor, accentColor }`，而不是请求时传入的那部分内容。

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

## focus

让编辑器获得焦点。

```js
editor.focus();
```

## blur

移除编辑器的焦点。

```js
editor.blur();
```

## clear

重置编辑器状态。  
会记录到历史列表中，因此可以 Undo，并且会发出 `change`。在 `readonly` 生效期间会被忽略。

```js
editor.clear();
```

## destroy

彻底销毁编辑器实例，使其无法再被复用。  
它会释放编辑器的监听器和订阅，并彻底销毁 [getSharedStore](#getsharedstore) 返回的所有 shared store。

```js
editor.destroy();
```

## setKeyBindingMap

重新定义键盘快捷键。  
`edit`、`stop`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut` 和 `zoomReset` 是固定的，无法重新定义。  
只有下面这十六个名称会被写入，对象中的其他内容都会被忽略，包括那些固定的名称。  
绑定的值必须是 `ShortcutOption[]`。单纯的字符串会被忽略，因此要写成 `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`，而不是 `{ addTable: 'Alt+KeyN' }`。  
该调用是部分合并：未写出的名称保持默认值，调用两次也会保留先前的更改。没有用于读取当前绑定的 getter。

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

`selectAllTable` 与 `handTool` 会让位于光标：只要焦点位于 input、textarea 或 `contenteditable` 中，`$mod + A` 就会选中文本，`Space` 就会输入空格，都不会传到画布上。改绑到其他快捷键后行为同样如此。

`focusView` 仅作用于 ERD 标签页。至少选中一个表时，它会以 Flow 模式打开 Visualization 标签页，范围缩小到这些表以及与它们相隔一条关系的所有表；没有选中任何表时它不起作用。参见[聚焦于表](../guide/guides/visualization.md#focusing-on-tables)。

### $mod

根据运行环境切换 `Control` 键。

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### 快捷键对照表

使用键盘事件的 `key, code` 属性。  
绝对位置使用 `code`，输入值使用 `key`。

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

设置预设主题。  
默认值为 `appearance: 'dark'`、`grayColor: 'slate'` 和 `accentColor: 'indigo'`。  
每个字段各自独立生效，因此只传入部分字段时其余两个保持不变。不在下面列表中的值会被忽略，调用也不会抛出错误。

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

可以自定义主题。  
每次调用都会替换整个自定义覆盖层，因此要在已有覆盖的基础上修改某一个 token，需要再次传入完整对象，传入 `{}` 则回退到预设主题。  
只有下面列出的名称且值为字符串的 token 会被保留，其他内容会被丢弃且不报错。  
该覆盖层位于预设主题之上，因此之后调用 `setPresetTheme` 只会替换下层的预设，自定义的覆盖仍然保留。

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

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

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

`tableShadow` 和 `memoShadow` 是表与备注在 ERD 画布上投下的阴影的颜色。深色预设将它们设为 `transparent`，即不投下阴影，与向 `setTheme` 传入 `none` 或空字符串的效果相同；浅色预设则使用 `rgba(0, 0, 0, 0.18)`。

#### CSS Variables

`Theme` 中的每个 token 都有对应的 CSS 钩子，其名称为 `--erd-editor-` 加上 kebab-case 形式的键名：`grayColor10` 对应 `--erd-editor-gray-color-10`，`keyPK` 对应 `--erd-editor-key-pk`，`keyPFK` 对应 `--erd-editor-key-pfk`。  
这些钩子会继承到编辑器内部，因此可以在任何希望其生效的位置设置。设置在 `:root` 上会作用于页面中的所有编辑器，设置在元素本身上则只作用于该编辑器。

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

自 `3.4.0` 起，拼写有误的 `dargSelect` token 更正为 `dragSelect`，其钩子也从 `--erd-editor-darg-select-background` 和 `--erd-editor-darg-select-border` 变为 `--erd-editor-drag-select-background` 和 `--erd-editor-drag-select-border`。仍在使用旧名称的样式表会被忽略。

<details>
<summary>默认主题值</summary>

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
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
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

加载 Schema SQL 文件。  
它会替换当前文档，而不是合并到当前文档中。现有的设置会保留，仅视图位置和缩放级别除外，并且文件读取后会自动排列表。  
会记录到历史列表中，因此可以 `Undo, Redo`，并且会发出 `change`。空字符串会被忽略，在 `readonly` 生效期间调用不会有任何效果。  
`setSchemaGraphQL`、`setSchemaDBML` 和 `setSchemaAML` 的行为相同，它们的解析器不会失败，无法读取的文本只会加载空白文档，而不会报错。  
各个解析器支持的语法参见[导入与导出文件](../guide/guides/file-import-export.md)。

```js
editor.setSchemaSQL('Schema SQL...');
```

## setSchemaGraphQL

加载 GraphQL SDL 文档。  
对象类型定义会变成表，类型为另一个表的字段会变成关系。

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

加载 DBML 文件，即 dbdiagram.io 和 dbdocs 使用的格式。

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

加载 AML（Azimutt Markup Language）文件。当前写法与旧版 v1 写法均受支持。

```js
editor.setSchemaAML('AML...');
```

## getSchemaSQL

将当前编辑器状态导出为 Schema SQL。  
若未指定 `databaseVendor`，则按当前已设置的厂商执行。不在下面列表中的名称也按相同方式处理，不会报错。

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

返回用于实时协同编辑的 store。  
`config` 为 `{ getNickname?, mouseTracker?, focusTracker? }`。两个 tracker 的默认值均为 `true`：`mouseTracker` 会把当前编辑器的鼠标光标广播给其他编辑器，`focusTracker` 会广播它获得焦点的单元格、选中状态和选择框。  
参见[协同编辑](./advanced/collaborative-editing.md)。

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue

打开 Diff Viewer，将当前打开的文档与传入的文档进行比较。  
它没有返回值，也不会修改文档，因此关闭该视图后编辑器与之前完全相同。  
空值或非字符串的值会与空白文档进行比较。  
它与画布右键菜单中的 [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) 是同一个视图。

```js
editor.setDiffValue('prev json...');
```
