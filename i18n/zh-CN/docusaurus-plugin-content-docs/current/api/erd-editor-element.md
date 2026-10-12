---
sidebar_position: 2
description: erd-editor 元素的 API：属性、value 与 runtimeValue、事件、主题、显示语言、欢迎界面、按键绑定，以及 schema 的导入与导出。
---

# ErdEditorElement

编辑器就是一个普通的 `HTMLElement`。  
其类型定义如下。

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

编辑器渲染在封闭的 shadow root 中，因此 `editor.shadowRoot` 为 `null`，页面样式不会流入也不会流出。  
内部的任何内容都无法通过选择器访问，样式需改用 [setTheme](#settheme) 和 `--erd-editor-*` 自定义属性来设置。

`readonly`、`system-dark-mode`、`enable-theme-builder`、`enable-locale-picker` 和 `enable-welcome-screen` 是仅有的五个属性，默认值均为 `false`。后两个是 `4.0.0` 新增的。每个属性都按 [readonly](#readonly) 中所述的方式读取其值。

## readonly

设置编辑器是否可编辑。  
在其生效期间，为 `value` 赋值、`clear()`、`setSchemaSQL()`、`setSchemaGraphQL()`、`setSchemaDBML()`、`setSchemaAML()`、`setSchemaJSON()`、undo 和 redo 都会被忽略，并且不会发出 `change` 事件。此时改用 [setInitialValue](#setinitialvalue) 加载文档。  
查看功能仍然可用：缩放、平移、抓手工具、禅模式、画布标签页、[Visualization](../guide/guides/visualization.md) 标签页的两种模式（包括聚焦于表）、数据库厂商，以及 SQL 与代码生成的输出设置都仍然生效，因此只读的查看者依然可以导出其他厂商的 SQL 或阅读生成的代码。  
从 `3.10.0` 起，[查找与替换](../guide/guides/find-and-replace.md#read-only-editors)也可以打开，此时它是一个标题为 `Find`、只能查找的面板，没有替换输入框和按钮。跳转到匹配项时，仍会将其带入视野并选中它。  
表属性仍然可以打开，并且从 `3.10.0` 起，其标题旁会显示 `Read only` 徽标，其 `Indexes` 标签页也不提供任何编辑功能，参见[表属性](../guide/guides/table-related-functions.md#table-properties)。  
从 `4.0.0` 起，只读编辑器不提供 [`Import and Add`](../guide/guides/file-import-export.md#import-and-add)、`New Table Group`、`Group selected tables`、`Remove from group`（参见[表分组](../guide/guides/table-groups.md#read-only-editors)）以及 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns)，也不显示[欢迎界面](#enablewelcomescreen)。Settings 标签页上的锁定按钮不会改变任何内容，Schema SQL 标签页的 `Before tables` 和 `After tables` 脚本也无法编辑。  
Schema SQL 标签页中 `This window only` 下的选择，即 `Statements`、`Header` 和 `Tables`，从不保存，并且仍然生效；[`Export image`](../guide/guides/file-import-export.md#image) 对话框、主题构建器和 Display Language 选择器也同样可用。在主题构建器或 Display Language 选择器中做出选择时，仍会发出 [changePresetTheme](#changepresettheme) 或 [changeLocale](#changelocale)。  
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
从 `4.0.0` 起，开启它会把主题的 `appearance` 设为 `'system'`，与 `setPresetTheme({ appearance: 'system' })` 的效果相同。此时编辑器会显示操作系统报告的浅色或深色，或 [setSystemAppearance](#setsystemappearance) 所指定的那一种，并在其变化时随之切换。  
之后以 `'light'` 或 `'dark'` 调用的 [setPresetTheme](#setpresettheme)，或在主题构建器或快速搜索中选择 `Light` 或 `Dark`，都会取代 `'system'` 并保持生效：即使 `systemDarkMode` 仍为 `true`，操作系统的下一次变更也不会再覆盖它。在 `4.0.0` 之前，操作系统的下一次变更会覆盖它。  
在外观为 `'system'` 时关闭它，会保留此刻显示的浅色或深色。在外观已从 `'system'` 改为其他值之后关闭它，则会让外观保持原样。  
更改它不会发出任何事件。

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
它会显示工具栏的 `Theme` 按钮，该按钮会打开包含 `Accent color`、`Gray color` 和 `Appearance` 的主题构建器。从 `4.0.0` 起，`Appearance` 在 `Light` 和 `Dark` 之外还提供 `System`，并且在该属性开启期间，快速搜索会列出带有 `System`、`Light` 和 `Dark` 的 `Theme`。参见[语言与主题](../guide/guides/language-and-theme.md)。

![从工具栏打开主题构建器，选择强调色和灰阶色，再将外观切换为 Light，然后切换为 System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

从该面板或快速搜索更改预设主题时，会发出 [changePresetTheme](#changepresettheme) 事件。

## enableLocalePicker

从 `4.0.0` 起，设置是否提供用于选择编辑器显示语言的 UI。  
它会显示工具栏的 `Display Language` 按钮，两个按钮都显示时，它位于 `Theme` 之后。该按钮会打开 Display Language 选择器，快速搜索也会列出 `Display Language`。两者都提供 `System` 和 25 种语言，参见[语言与主题](../guide/guides/language-and-theme.md)。  
它还决定了在调用 [setLocale](#setlocale) 或选择语言之前编辑器显示什么：开启时为 `'system'`，关闭时为英语，因此不做任何配置的元素仍会显示它一直以来显示的英语。开启或关闭它会立即在两者之间切换。一旦设置或选择了语言，之后无论如何开关该属性，该选择都会保持不变。  
要让第一帧就跟随 `'system'`，需在元素被添加到页面之前设置它。  
选择语言时会发出 [changeLocale](#changelocale)。

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen

从 `4.0.0` 起，设置空白的图是否以[欢迎界面](../guide/guides/editing-start.md#欢迎界面)迎接读者。  
当文档中没有任何表、没有显示的备注，也没有显示的表分组时，它会覆盖在 ERD 标签页之上。在 `readonly` 生效期间、禅模式下，以及表属性、Diff Viewer、Time Travel 或自动布局预览打开期间，都不会显示它。第一个表、显示的备注或显示的表分组出现时它就会消失，通过 Undo 回到空白的图时它又会重新出现。  
其 `New Table`、`New Memo` 和 `Command Palette` 行会按 [setKeyBindingMap](#setkeybindingmap) 设置后的状态，显示 `addTable`、`addMemo` 和 `search` 的第一个组合键；对于留空的名称则不显示。其箭头只会指向 `enableThemeBuilder` 和 `enableLocalePicker` 所显示出来的 `Theme` 和 `Display Language` 按钮。  
在其菜单中，`↑`、`↓`、`Home` 和 `End` 会在各行之间移动，并且会被阻止默认行为并停止传播。`Enter` 和 `Space` 会被停止传播但不会被阻止默认行为，因此由获得焦点的行接收它们；在 `Import` 的各种格式之间按下的 `Escape` 会返回上一级，并且会被阻止默认行为并停止传播。其他所有按键都会照常传给编辑器和页面。  
它不会改变文档中的任何内容，因此 `value` 保持原样，也不会发出 `change`。  
请像官方宿主那样，在 [setInitialValue](#setinitialvalue) 加载完文档之后再开启它，这样欢迎界面就不会在仍在加载的文件上一闪而过。

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

以 JSON 字符串的形式获取当前文档，采用编辑器定义的 [schema](./advanced/schema.md)。  
从 `4.0.0` 起，它是存储形式，即文件所保存形式的文档，也就是 `json` 导出写出的内容以及官方宿主保存的内容。它只包含现存的实体，不含已删除的实体、叠放顺序，以及编辑器自行推算的内容，例如测量得到的宽度、键标记和关系的连接线锚点。其中的实体按固定顺序排列键，以两个空格缩进，并以换行符结尾，因此同一个文档总是得到相同的字节。  
[锁定](../guide/guides/settings.md#锁定)处于开启状态的每项设置，都按其锁定的值写出，而不是按屏幕上显示的值写出。`Viewport` 锁定掌管 `originX`、`originY` 和 `zoomLevel`，`Canvas Type`、`Language`、`Table Name Case`、`Column Name Case` 和 `Bracket Type` 则各自掌管对应的设置。其他所有设置都按其当前的值写出，`lockSettings` 总会写出。各个位的说明参见 [Settings](./advanced/schema.md#settings)。  
新文档的所有锁定都处于开启状态，无论是元素在被赋予值之前显示的文档，还是从空白值加载的文档。在相应的锁定关闭之前，其 `value` 会一直把原点写为 `0, 0`、缩放级别写为 `1`、标签页写为 ERD 标签页，并写出默认的 Code Generator 语言、名称大小写和括号类型。  
在 `4.0.0` 之前，它返回的是编辑器所持有形式的完整文档，并应用了 `ignoreSaveSettings`。编辑器所持有形式的文档现在是 [runtimeValue](#runtimevalue)，`ignoreSaveSettings` 也已不再被读取或写入。

```js
const data = editor.value;
```

### setter

加载此前保存的编辑器状态。它会替换整个文档，先清空当前文档。  
与 `clear()`、`setInitialValue()` 以及处于默认 `mode: 'replace'` 的各个 `setSchema*` 方法一样，它也会丢弃 Visualization 标签页的 Flow 视图：包括它的布局、视图范围所缩小到的表、行显示、缩放和平移。追加（`mode: 'append'`）则不会丢弃它。  
会记录到历史列表中，因此可以 `Undo, Redo`，并且会发出 `change`。  
它接受存储形式、[runtimeValue](#runtimevalue)，或较早发布版本保存的文件。  
空字符串或非字符串的值不会报错，而是加载一个新文档，因此赋值前需要先做好校验。  
该新文档就是 `setInitialValue('')` 所开始的文档：内容为空、采用默认设置，并且从 `4.0.0` 起所有锁定都处于开启状态。在 `3.10.x` 中，它既不保存滚动位置也不保存缩放级别；在此之前，两者都会保存。  
shared store 会把这次加载连同新文档的完整 JSON 一起中继给协作者，因此每个协作者（包括使用较旧发布版本的协作者）都会加载同一个文档。  
从 `4.0.0` 起，所加载文档的锁定，以及 `value` 随后写出的锁定值，都来自文本；视图会落在文本所指定的位置，如果那里没有绘制图的任何部分，则落在图上。对于文本锁定的其他各项设置（标签页、Code Generator 的语言、名称大小写和括号类型），编辑器会继续显示加载之前所显示的内容。文本未锁定的设置则采用文本中的值。[setInitialValue](#setinitialvalue) 则会采用文本中的每一个值；一个锁定都没有写明的文本，也请参见该节。  
不是 JSON 的文本（例如残留合并冲突标记的文件）同样不会报错：文档会被清空，设置保持原样，解析错误则会输出到控制台。  
在 `readonly` 生效期间会被忽略，要在只读编辑器中加载文档需使用 [setInitialValue](#setinitialvalue)。

```js
editor.value = 'json...';
```

## runtimeValue

从 `4.0.0` 起，以 JSON 字符串的形式获取该编辑器所持有形式的文档。它没有 setter，因此在严格模式的代码中为其赋值会抛出错误。  
它包含 [value](#value) 所省略的内容：已删除的实体及其顺序、叠放顺序、测量得到的宽度、键标记、关系的连接线锚点以及序列。锁定的设置在这里同样按其锁定的值写出。  
可以用它通过 [setInitialValue](#setinitialvalue)，为加入已在进行中的会话的另一个编辑器（例如协作者，或同一文档的第二个视图）载入初始文档。这样，会话之后发来的对删除操作的 Undo 会在那里完整地恢复该实体；而用 `value` 载入初始文档的编辑器不持有任何已删除的实体，恢复出来的会是一个空的、没有名称的表。参见[协同编辑](./advanced/collaborative-editing.md)。  
已不再有任何机制回收已删除的实体，因此它们会一直留在其中，直到下次从文件打开该文档。  
切勿将它写入文件：请保存 `value`，[JSON Schema](./advanced/schema.md#json-schema) 接受 `value`，而不接受它。

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue

加载此前保存的编辑器状态。加载本身不会记录到历史列表中，因此无法 Undo，也不会发出 `change` 事件。  
加载时还会清空历史记录，因此加载之前所做的操作无法在加载后的文档上 `Undo, Redo`。  
它接受存储形式、[runtimeValue](#runtimevalue)，或较早发布版本保存的文件，并且与为 `value` 赋值不同，它会采用文本中的每一项设置，包括标签页和代码相关的设置。  
空字符串或非字符串的值不会报错，而是加载一个新文档，因此 `setInitialValue('')` 会以空白的图开始。  
从 `4.0.0` 起，该新文档（也就是元素在被赋予任何值之前显示的文档）的所有锁定都处于开启状态。滚动、缩放、切换标签页，以及更改 Code Generator 的语言、名称大小写或括号类型，都会让 `value` 保持原样，也不会发出 `change`。在 `3.10.x` 中，它既不保存滚动位置也不保存缩放级别；在此之前，两者都会保存。  
从文本加载的文档会沿用其中写明的锁定。一个锁定都没有写明的文档（`4.0.0` 之前保存的任何文件，无论其 `ignoreSaveSettings` 写的是什么，以及 v2 的 `.vuerd` 文件）打开时所有锁定都处于开启状态，其 `Viewport` 锁定在原点 `0, 0` 和缩放级别 `1`，停留在 ERD 标签页，语言、名称大小写和括号类型则保持其保存时的值。  
无论哪种情况，视图都会在文档的视图处打开（文本写明了锁定时为它保存的视图，一个都没有写明时为原点 `0, 0`、缩放级别 `1`）；如果那里没有绘制图的任何部分，则在图上打开。锁定的 `Viewport` 仍会在 `value` 中保留其锁定的值。  
从 `4.0.0` 起，它还会丢弃此前所持有文档的协同状态，并且该编辑器已经订阅的 [shared store](#getsharedstore) 会再次向其他编辑器请求它们的协同状态，因此在进行中的会话里重新加载的编辑器能够跟上进度。请用另一个编辑器的 [runtimeValue](#runtimevalue) 为这样的编辑器载入初始文档。  
不是 JSON 的文本同样不会报错：文档会被清空，设置保持原样，解析错误则会输出到控制台。  
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

`change`、`changePresetTheme` 和 `changeLocale` 是仅有的三个公开事件，其中 `changeLocale` 是 `4.0.0` 新增的。  
该元素还会在自身上派发内部的 `@dineug/erd-editor/internal-*` 事件用于内部衔接，它们不属于 API。

### change

编辑器发生变更时会发出事件。  
该事件有 200ms 的防抖，并且在 `readonly` 为 `true` 期间不会发出。  
任何文档变更都会触发它：在 UI 中编辑、为 `value` 赋值、`clear()`、各个 `setSchema*` 方法，以及从 `4.0.0` 起的 `setSchemaJSON()` 和 `Import and Add`。`setInitialValue` 不会触发它。  
在 Visualization 标签页的 Flow 模式中所做的任何操作都不会触发它，包括缩放、平移、移动卡片、`Tidy Up`、行显示，以及从卡片缩小视图范围，因为这些都不是文档变更。  
从 `4.0.0` 起，对[锁定](../guide/guides/settings.md#锁定)处于开启状态的设置所做的更改也不会触发它，因为这类更改只会移动屏幕，而永远不会改变 `value`：在 `Viewport` 锁定期间滚动或缩放 ERD 画布，在 `Canvas Type` 锁定期间切换标签页，以及在各自的锁定开启期间更改 Code Generator 的语言、表名大小写、列名大小写或括号类型。只有这些更改会被排除，因此同时编辑了文档的批次仍会触发它。锁定或解锁某项设置会触发它。  
新文档以及 `4.0.0` 之前保存的任何文件的所有锁定都处于开启状态，因此默认情况下，滚动、缩放和切换标签页都不会发出任何事件。这包括从 ERD 标签页聚焦于表、把你从 Flow 带回 ERD 标签页的外部链接卡片按钮，以及从其他标签页打开查找与替换或跳转到快速搜索的结果。只有在覆盖相应操作的锁定关闭时，它们才会各发出一次 `change`：标签页切换对应 `Canvas Type`，卡片按钮或快速搜索结果同时造成的滚动对应 `Viewport`。在 `4.0.0` 之前，滚动、缩放和切换标签页总会触发它，即使 `editor.value` 并未改变。  
要跳过不改变任何内容的写入，应将 `editor.value` 与你上一次存储的值进行比较，而不是与你加载的文件比较：由较早发布版本写出的文件、v2 文件或手动编辑过的文件，一经加载，其 `value` 就可能与文件不同，因为 `value` 会以存储形式写出它。`Viewport` 锁定关闭、并且其原点在当前屏幕上没有绘制图的任何部分的文件也是如此：加载会把视图移到图上，`value` 则写出视图落下的位置。从 `4.0.0` 起，测量得到的宽度不再造成这种情况，因为 `value` 中不包含宽度。写入文件的宿主也可以改为借助用于数据复制的 store 提供的 `changed` 来区分编辑与视图变化，参见 [on@change](./advanced/remote-storage.md#onchange)。  
该事件不携带 `detail`，既不冒泡也不跨越 shadow 边界，因此需要在元素自身上监听，并在处理函数中读取 `editor.value`。

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

从内置的主题构建器，或从 `4.0.0` 起从快速搜索的 `Theme` 更改预设主题时发出。每次选择都会发出它，包括选择当前已生效的选项。  
自行调用 [setPresetTheme](#setpresettheme) 或 [setSystemAppearance](#setsystemappearance)，或者开启或关闭 [systemDarkMode](#systemdarkmode)，都不会发出该事件。  
`event.detail` 是选择之后完整的 `ThemeOptions`，即 `{ appearance, grayColor, accentColor }`，而不是请求时传入的那部分内容。从 `4.0.0` 起，选中 `System` 期间其 `appearance` 为 `'system'`，而不是它所显示的浅色或深色，因此请原样存储，并原样传回给 `setPresetTheme`。

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale

从 `4.0.0` 起，在编辑器中选择语言时发出，无论是从 Display Language 选择器，还是从快速搜索的 `Display Language` 选择，两者都由 [enableLocalePicker](#enablelocalepicker) 开启。  
它在语言应用之后触发，每次选择都会触发，包括选择当前已生效的选项。[setLocale](#setlocale) 和 [setSystemLocale](#setsystemlocale) 永远不会发出它，浏览器语言的变化也不会。切换语言不会发出 `change`。  
`event.detail` 为 `{ locale }`，是一个 `LocaleOption`：选择 `System` 时为 `'system'`，否则为该语言的代码。该元素不会记住所做的选择，因此请将其存储，并在下次加载时传给 `setLocale`。  
与 `change` 一样，它不会冒泡，因此需要在元素自身上监听。

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
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

清空文档，移除所有表、列、关系、索引和备注，并且从 `4.0.0` 起还会移除所有表分组。  
所有设置都会保留，包括数据库、视图位置、缩放级别、表显示选项、每个锁定及其持有的值，以及 Schema SQL 标签页的 `Before tables` 和 `After tables` 脚本，因此清空后的文件仍会保存它原先保存的那些信息。如果想改为开始一个新文档，请为 `value` 赋值 `''`，或调用 `setInitialValue('')`。  
会记录到历史列表中，因此可以 Undo，并且会发出 `change`。Undo 会按编辑器所持有的形式恢复文档，每项锁定的设置都处于其锁定的值。在 `readonly` 生效期间会被忽略。

```js
editor.clear();
```

## destroy

彻底销毁编辑器实例，使其无法再被复用。  
它会释放编辑器的监听器和订阅，并彻底销毁 [getSharedStore](#getsharedstore) 返回的所有 shared store。  
shared store 仍在暂存的流批次会随之一并丢弃；要将其发送出去，需先调用该 store 的 [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers)。

```js
editor.destroy();
```

## setKeyBindingMap

重新定义键盘快捷键。  
`edit`、`stop`、`undo`、`redo`、`zoomIn`、`zoomOut` 和 `zoomReset` 是固定的，无法重新定义。  
只有下面这十九个名称会被写入，对象中的其他内容都会被忽略，包括那些固定的名称。  
从 `3.10.0` 起，`search` 可以重新定义，并新增了 `findReplace`。在此之前，`search` 是固定的。从 `4.0.0` 起，新增了 `removeSelection`。  
绑定的值必须是 `ShortcutOption[]`。单纯的字符串会被忽略，因此要写成 `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`，而不是 `{ addTable: 'Alt+KeyN' }`。  
空数组也会被接受，并且不绑定任何按键：`setKeyBindingMap({ findReplace: [] })` 会把 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 留给页面处理，`{ search: [] }` 对 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 也是如此。工具栏的 `Search` 按钮仍可打开快速搜索，查找与替换也仍可通过其工具栏按钮、快速搜索中的对应行和画布右键菜单打开；对于留空的名称，这些位置都不会显示快捷键。`{ removeSelection: [] }` 会把 `Delete` 和 `Backspace` 留给页面处理，此时表、备注和表分组菜单中的删除条目（`Delete`、`Delete selected`、`Delete column`、`Delete columns`）都不会显示快捷键。  
该调用是部分合并：未写出的名称保持默认值，调用两次也会保留先前的更改。没有用于读取当前绑定的 getter：[createKeyBindingMap](#createkeybindingmap) 返回的是默认值，而不是经 `setKeyBindingMap` 更改后的内容。

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

`selectAllTable`、`handTool` 和 `removeSelection` 会让位于光标：只要焦点位于 input、textarea 或 `contenteditable` 中，`$mod + A` 就会选中文本，`Space` 就会输入空格，`Delete` 和 `Backspace` 就会删除文本，都不会传到画布上。改绑到其他快捷键后行为同样如此。

从 `4.0.0` 起，`removeSelection`（`Delete` 或 `Backspace`）会在 ERD 标签页上删除选中的对象，算作一步 Undo，并且不会要求确认。当唯一选中的对象是获得焦点的表、其中选中了一列或多列，并且当前缩放会绘制其各行时，它会删除这些列；否则它会删除所有选中的表、备注和表分组，分组中的表会保留。参见[删除表与备注](../guide/guides/table-related-functions.md#删除表与备注)。  
按住按键不放时只会删除一次，单元格、备注或表分组名称编辑器打开期间不会删除任何内容。在文本框之外，只要编辑器获得焦点，这次按键在每个标签页上都会被阻止默认行为，焦点位于工具栏按钮上时也是如此；在只读编辑器中同样会被阻止，但不会删除任何内容。

从 `3.10.0` 起，`findReplace`（`$mod+KeyF`）会打开[查找与替换](../guide/guides/find-and-replace.md)，在其他任何标签页中按下时都会先切换到 ERD 标签页。  
它不会让位于光标：只要编辑器获得焦点，无论在哪个标签页，也无论焦点位于画布上还是编辑器内部的输入框中，该按键都会被它截获。这次按键的默认行为会被阻止，因此浏览器不会打开查找栏；它也会被停止传播，因此页面上冒泡阶段的 `keydown` 监听器都收不到它。单元格或备注编辑器处于打开状态时，或者从 `4.0.0` 起表分组名称编辑器处于打开状态时，它仍会被阻止默认行为并停止传播，但不会打开任何内容。  
Diff Viewer、Time Travel 或自动布局预览打开期间（无论在哪个标签页），或输入法仍在组字时，它既不会被阻止默认行为，也不会被停止传播，因此会交给浏览器或宿主自己的查找功能。在查找与替换面板中，仍在组字的按键会在面板处被停止传播，但其默认行为不会被阻止。把 `findReplace` 改绑到其他快捷键后行为同样如此。

`focusView` 仅作用于 ERD 标签页。至少选中一个表时，它会以 Flow 模式打开 Visualization 标签页，范围缩小到这些表以及与它们相隔一条关系的所有表；选中的备注或表分组不计算在内，没有选中任何表时它不起作用。参见[聚焦于表](../guide/guides/visualization.md#focusing-on-tables)。

在 ERD 标签页上，`stop`（`Escape`）会关闭已打开的单元格或备注编辑器，或取消正在绘制的关系，并保持选中状态不变。从 `4.0.0` 起，它还会关闭表分组名称编辑器（不写入任何名称），并取消正在进行的 `New Table Group` 绘制。编辑器会对这次按键调用 `preventDefault()`。  
没有上述任何一项处于打开状态时，`Escape` 会清除选中状态和单元格焦点，并且其默认行为不会被阻止。因此，结束编辑并清除选中状态需要按两次。  
在查找与替换面板之外，编辑器从不阻止 `Escape` 继续传播，因此自行监听它的页面（例如用来关闭自己的对话框）会收到这两次按键，并可以跳过 `defaultPrevented` 为 `true` 的那一次。  
快速搜索、表属性、Diff Viewer、自动布局预览或 Time Travel 打开期间，`Escape` 会改为关闭它们，并保持选中状态不变。这次按键的默认行为同样不会被阻止。  
从 `4.0.0` 起，已打开的 [`Export image`](../guide/guides/file-import-export.md#image) 或 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) 对话框也会接收 `Escape`，关闭自身并保持选中状态不变。它们打开时都会接管键盘，这次 `Escape` 会同时被阻止默认行为并停止传播。  
从 `3.10.0` 起，焦点位于查找与替换面板中时按下的 `Escape` 会关闭面板，并保持选中状态不变。编辑器会对这次按键同时调用 `preventDefault()` 和 `stopPropagation()`，因此它永远不会到达页面中冒泡阶段的 `keydown` 监听器。  
面板打开期间在画布上按下的 `Escape`，如果没有被上述任何一项处理，会在清除选中状态的同一次按键中关闭面板。这次按键既不会被阻止默认行为，也不会被停止传播。  
从 `4.0.0` 起，Display Language 选择器和选色器的关闭方式与查找与替换面板相同：在它们内部，`Escape` 会被阻止默认行为并停止传播；在画布上，它会在清除选中状态的同一次按键中关闭它们。  
在输入法仍在组字时按下的 `Escape` 属于组字过程。它会让打开的编辑器保持原样，并且其默认行为不会被阻止，因此页面同样可以跳过 `isComposing` 为 `true` 或 `keyCode` 为 `229` 的按键。在查找与替换面板中，这样的按键与组字过程中在面板里按下的任何按键一样，还会被停止传播。  
在 `3.9.2` 之前，按一次 `Escape` 既会结束编辑或绘制，又会清除选中状态，并且编辑器从不阻止其默认行为。

### createKeyBindingMap

从 `3.9.2` 起，该包导出 `createKeyBindingMap()`，并一同导出 `KeyBindingMap`、`KeyBindingName` 和 `ShortcutOption` 类型。  
它返回默认的按键绑定，包含全部 26 个名称（固定名称也在其中），并且每次调用都返回一个新的映射，因此修改它返回的映射不会影响其他任何内容。  
每个编辑器都以它为起点，而 `setKeyBindingMap` 的调用不会反映在其中。  
只有 `createKeyBindingMap` 是运行时导出，其余三个都是类型。

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

每个 `shortcut` 都是一个采用 [tinykeys](https://github.com/jamiebuilds/tinykeys) 语法的组合键，以 `KeyboardEvent.code` 指定按键，其中 [`$mod`](#mod) 在 macOS 上为 `⌘`，在其他环境中为 `Control`。  
从 `4.0.0` 起，编辑器以相同的语法自行解析这些组合键，而不再通过 tinykeys。按键通过其 `code` 匹配，或通过其 `key`（不区分字母大小写）匹配，并且只有恰好按住组合键所写明的修饰键时，这次按键才会匹配。`AltGraph` 在 Windows 上算作 `Control` 和 `Alt`，在 macOS 上算作 `Alt`。以空格分隔的多次按键构成一个序列，一秒内没有 keydown 时序列会重新开始。  
固定名称分别绑定到 `Enter`（`edit`）、`Escape`（`stop`）、`$mod+KeyZ`（`undo`）、`$mod+Shift+KeyZ`（`redo`）、`$mod+Equal`（`zoomIn`）、`$mod+Minus`（`zoomOut`）和 `$mod+Digit0`（`zoomReset`）。`edit` 和 `stop` 不带任何标志，其余五个带有 `preventDefault` 和 `stopPropagation`。其余名称的绑定即上面的默认值，`search` 和 `findReplace` 也在其中。

编辑器在自身元素上监听这些按键，因此通过全局热键或捕获阶段的 `keydown` 监听器先于编辑器截获按键的宿主，需要在编辑器获得焦点期间放行这些按键。  
要放行的按键列表可以基于 `createKeyBindingMap()` 构建，并用传给 `setKeyBindingMap` 的绑定替换相应的默认值。  
从 `3.10.0` 起，该列表包含浏览器自身的查找组合键 `$mod+KeyF`。希望在该组合键上保留自己的查找功能的宿主，可以传入 `setKeyBindingMap({ findReplace: [] })`。  
从 `4.0.0` 起，该列表还包含不带修饰键的 `Delete` 和 `Backspace`。希望保留这两个按键的宿主，可以传入 `setKeyBindingMap({ removeSelection: [] })`。

焦点位于查找与替换面板中时，`findReplace`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut` 和 `zoomReset` 会传给编辑器。其他所有绑定（以当前的设置为准）都止于面板，方向键和 `Tab` 也是如此。除了关闭面板的 `Escape`，以及在查找或替换输入框中用于在匹配项之间移动或执行替换的 `Enter` 之外，这些按键只会被停止传播而不会被阻止默认行为，因此它们在面板的输入框和按钮中作为普通按键使用，既不会到达画布，也不会到达页面中冒泡阶段的 `keydown` 监听器。  
其他任何按键，例如宿主的保存或命令面板组合键，都会照常传给页面。参见[面板中的按键](../guide/guides/find-and-replace.md#keys-in-the-panel)。  
从 `4.0.0` 起，Display Language 选择器也以相同的方式处理按键：同样的七个绑定会传给编辑器，其他所有绑定、方向键和 `Tab` 都会在那里被停止传播而不会被阻止默认行为，输入法仍在组字时按下的任何按键也是如此。在其中某一行上按下的 `↑`、`↓`、`Home`、`End`、`Enter` 和 `Space` 会在各行之间移动或选择该行，并且同样会被阻止默认行为。

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
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
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
从 `4.0.0` 起，`appearance` 还接受 `'system'`，即主题构建器中的 `System`。它会显示操作系统报告的浅色或深色，或 [setSystemAppearance](#setsystemappearance) 所指定的那一种，并在其变化时随之切换。

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

从 `4.0.0` 起，为拥有自己的浅色和深色的宿主（例如 IDE 主题）指定 `'system'` 外观所显示的浅色或深色。指定期间，操作系统的变化会被忽略。  
`null`，或 `'dark'` 和 `'light'` 以外的任何值，会恢复为跟随操作系统。  
外观为 `'light'` 或 `'dark'` 期间，它不会改变屏幕上的任何内容，但该值会被保留，并在外观变为 `'system'` 时立即生效；其他情况下它会立即生效。它不会发出任何事件，`changePresetTheme` 也仍然报告 `'system'`。  
VS Code、JetBrains 和 Obsidian 宿主会以它们自己的浅色或深色调用它，并在其变化时再次调用。

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
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

从 `4.0.0` 起，新增了九个 token：

- `tableGroupHeaderBackground`、`tableGroupBackground` 和 `tableGroupBorder` 用于为没有自身颜色的[表分组](../guide/guides/table-groups.md)设置标题栏、主体和轮廓的颜色。
- `toastSuccess` 和 `toastError` 用于设置报告某项操作结果的提示中标记的颜色。
- `findReplaceError` 和 `mapColumnsError` 用于设置查找与替换以及映射列对话框所显示错误的颜色。查找与替换此前使用的是 `diffDeleteForeground`，因此覆盖该 token 已不会再改变它的颜色。
- `schemaSqlWarningBackground` 和 `schemaSqlWarningForeground` 用于设置 Schema SQL 标签页选项中警告的颜色。

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
  --erd-editor-diff-insert-background: #113b29;
  --erd-editor-diff-delete-background: #500f1c;
  --erd-editor-diff-cross-background: #003362;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-cross-foreground: #70b8ff;
}
```

</details>

## Display Language

从 `4.0.0` 起，编辑器自身的文本（菜单、面板、对话框、快速搜索、提示，以及它在图上绘制的文字，例如 `unnamed`，导出的图片也包括在内）提供 25 种语言。表名和列名、SQL、数据类型以及生成的代码永远不会被翻译。参见[语言与主题](../guide/guides/language-and-theme.md)。  
在调用 [setLocale](#setlocale) 或选择语言之前，编辑器显示英语；[enableLocalePicker](#enablelocalepicker) 开启期间则跟随 `'system'`。  
编辑器会在封闭的 shadow root 内部自身的根元素上设置 `lang` 和 `dir`，从不设置在宿主元素或页面上，因此从右到左的页面不会翻转编辑器，从右到左的语言也不会翻转页面。希伯来语、阿拉伯语和波斯语会让编辑器的界面从右到左排布，图本身则永远不会镜像。  
该包导出 `LocaleCode`（下列代码之一）和 `LocaleOption` 类型。

```ts
type LocaleOption = LocaleCode | 'system';
```

| 代码    | 显示名称             | 语言         |
| ------- | -------------------- | ------------ |
| `id-ID` | Bahasa Indonesia     | 印度尼西亚语 |
| `de-DE` | Deutsch              | 德语         |
| `en`    | English              | 英语         |
| `es-ES` | Español              | 西班牙语     |
| `eu-ES` | Euskara              | 巴斯克语     |
| `fr-FR` | Français             | 法语         |
| `it-IT` | Italiano             | 意大利语     |
| `nl-NL` | Nederlands           | 荷兰语       |
| `pl-PL` | Polski               | 波兰语       |
| `pt-PT` | Português            | 葡萄牙语     |
| `pt-BR` | Português Brasileiro | 巴西葡萄牙语 |
| `ro-RO` | Română               | 罗马尼亚语   |
| `sk-SK` | Slovenčina           | 斯洛伐克语   |
| `sl-SI` | Slovenščina          | 斯洛文尼亚语 |
| `sv-SE` | Svenska              | 瑞典语       |
| `tr-TR` | Türkçe               | 土耳其语     |
| `ru-RU` | Русский              | 俄语         |
| `uk-UA` | Українська           | 乌克兰语     |
| `he-IL` | עברית                | 希伯来语     |
| `ar-SA` | العربية              | 阿拉伯语     |
| `fa-IR` | فارسی                | 波斯语       |
| `ja-JP` | 日本語               | 日语         |
| `zh-CN` | 简体中文             | 简体中文     |
| `zh-TW` | 繁體中文             | 繁体中文     |
| `ko-KR` | 한국어               | 韩语         |

### setLocale

设置显示语言：`'system'`，或上表中的某个代码。其他任何值，例如单独的 `'ko'`、未知的代码或非字符串的值，都会被忽略且不报错。  
它在返回之前就会生效，因此在元素被添加到页面之前设置的语言，在其第一帧中就已生效。  
它不会发出任何事件，既不发出 `changeLocale` 也不发出 `change`，也不会触及 `value`、Undo 历史记录或 shared store。  
无论 `enableLocalePicker` 如何切换，该选择都会保持不变；即使选择器关闭，`setLocale('system')` 也会跟随系统。  
编辑器不会存储任何内容。要保留读者的选择，请监听 [changeLocale](#changelocale)，并在下次加载时将其传回。

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale

以 BCP 47 标签指定 `'system'` 所代表的语言，供拥有自己显示语言的宿主使用。VS Code、JetBrains 和 Obsidian 宿主会以它们自己的显示语言调用它。  
标签会去除首尾空白。`null`、空字符串或非字符串的值会恢复为浏览器的 `navigator.languages`，编辑器会随其变化而跟随。  
它只在当前生效的选项为 `'system'` 时才起作用，并且会立即生效。选择器的 `System` 行会显示它解析得到的语言。  
该标签，或按顺序排列的浏览器各语言，会按其语言子标签解析为编辑器所具备的第一种语言，忽略字母大小写和下划线：`de-AT` 得到 `de-DE`，`en-GB` 得到 `en`。中文按其文字解析，`Hant` 得到 `zh-TW`，`Hans` 得到 `zh-CN`；未指明文字时按地区解析，`TW`、`HK` 和 `MO` 得到 `zh-TW`，其他地区得到 `zh-CN`。`pt` 得到 `pt-BR`，除非指明了 `BR` 以外的地区。没有任何匹配时，编辑器显示英语。

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL

加载 Schema SQL 文件。  
默认情况下，它会替换当前文档，而不是合并到当前文档中，参见下文的 `mode`。现有的设置（包括每个锁定及其锁定的值）会保留，仅视图位置和缩放级别除外，并且文件读取后会排布表：除非下文的 `placement` 另有要求，否则逐行排列。`Viewport` 锁定时，`value` 随后会写出导入开始时的视图，即原点 `0, 0`、缩放级别 `1`。因此，导入到从未被赋予过值的元素中的文档，会像新文档一样所有锁定都处于开启状态。  
会记录到历史列表中，因此可以 `Undo, Redo`，并且会发出 `change`。空字符串会被忽略，在 `readonly` 生效期间调用不会有任何效果。  
`setSchemaGraphQL`、`setSchemaDBML` 和 `setSchemaAML` 的行为相同，它们的解析器不会失败，无法读取的文本只会加载空白文档，而不会报错。  
从 `4.0.0` 起，这四个方法都接受可选的第二个参数 `{ placement, mode }`：

- `placement: 'grid'` 为默认值，会与以前一样立即将表逐行排列，调用不返回任何值。
- `placement: 'auto'` 会像编辑器中的 `Import` 那样，先按关系排布这些表，并返回一个 `Promise`，该 `Promise` 会在导入作为一步 Undo 落下之后 resolve。表少于两个、没有关系、布局失败、页面没有 `SharedWorker`，或在 `Placing tables` 提示上按下 `Cancel` 时，会改为逐行排列。在此期间发生的加载（另一个替换式导入、为 `value` 赋值、`setInitialValue()`、`clear()`、协作者的加载，或对某次加载或 `clear()` 的 Undo 或 Redo）会取代它，此时 `Promise` 会 resolve，且不加载任何内容。以这种方式排布的多个导入，会按开始的顺序落下。
- `mode: 'replace'` 为默认值，会替换文档。`mode: 'append'` 会像 [Import and Add](../guide/guides/file-import-export.md#import-and-add) 那样把文件添加到图的下方，图中已有的每个表都保持原样，除标签页和视图位置之外的所有设置也保持原样。在其他标签页中调用时，会先切换到 ERD 标签页。新的表，以及表分组处于显示状态时 DBML 文件带来的表分组，会成为选中对象，视图也会滚动以显示它们。一次 Undo 即可撤回整个添加。无法读取的文本不会添加任何内容，文档保持原样。

在 `readonly` 生效期间，替换会被忽略，追加不会添加任何内容，`placement: 'auto'` 的调用会立即 resolve。  
从 `3.10.0` 起，`setSchemaSQL` 会按文档当前的数据库读取文件：选择 Databricks 时，单引号字符串遵循 Spark 的反斜杠转义规则。参见[注释](../guide/guides/file-import-export.md#comments)。  
从 `3.10.0` 起，`setSchemaSQL` 会把覆盖两列或更多列的 `UNIQUE` 读作一个唯一索引，而不是在每一列上设置 Unique 标志。参见[唯一键与索引](../guide/guides/file-import-export.md#unique-keys-and-indexes)。  
从 `3.10.0` 起，SQL、DBML 和 AML 导入会保留所读取外键的 `ON DELETE` 和 `ON UPDATE` 操作。  
从 `4.0.0` 起，`setSchemaSQL` 会保留列的完整 `DEFAULT` 表达式，读取 SQL Server 的 `ADD DEFAULT … FOR` 及其 `MS_Description` 注释，把 PostgreSQL 的 serial 列和 identity 列转为 Auto Increment，在数据类型中保留 `UNSIGNED` 和 `ZEROFILL`，并读取由 `ALTER TABLE … ADD PRIMARY KEY` 标为 `CLUSTERED`、`NONCLUSTERED` 或 `USING BTREE` 的主键。参见 [Schema SQL](../guide/guides/file-import-export.md#schema-sql)。  
各个解析器支持的语法参见[导入与导出文件](../guide/guides/file-import-export.md)。

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

加载 GraphQL SDL 文档。  
对象类型定义会变成表，类型为另一个表的字段会变成关系。

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

加载 DBML 文件，即 dbdiagram.io 和 dbdocs 使用的格式。  
从 `4.0.0` 起，每个 `TableGroup` 都会成为一个[表分组](../guide/guides/table-groups.md)，表的 `headercolor` 会成为该表的颜色。参见 [DBML](../guide/guides/file-import-export.md#dbml)。

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

加载 AML（Azimutt Markup Language）文件。当前写法与旧版 v1 写法均受支持。  
从 `4.0.0` 起，实体的颜色（Azimutt 的颜色名称之一，或加引号的十六进制值）会成为其表的颜色。参见 [AML](../guide/guides/file-import-export.md#aml)。

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON

从 `4.0.0` 起，加载 `.erd.json` 文档，例如 [value](#value) 返回的文本。  
在默认的 `mode: 'replace'` 下，它会像为 `value` 赋值那样加载文档：记录到历史列表中，发出 `change`，并以相同的方式采用文档的锁定。与 `value` 不同，空字符串或非字符串的值会被忽略，而不是开始一个新文档。不是 JSON 的文本会清空文档，与 `value` 相同。  
`mode: 'append'` 会以新的 id 把文档中的表、关系、索引、备注和表分组添加到图的下方，保持它们彼此之间的相对位置，并略去文档的设置，与 [Import and Add](../guide/guides/file-import-export.md#import-and-add) 对 `json` 文件的处理相同。无法读取的文本，或既没有表也没有备注的文档，不会添加任何内容。否则，它会像 [setSchemaSQL](#setschemasql) 的追加那样落下，其中新的备注和表分组会与表一同成为选中对象，二者各自仅在处于显示状态时才会被选中。  
它会在文档落下之后返回，并且在 `readonly` 生效期间会被忽略。

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL

将当前编辑器状态导出为 Schema SQL。  
若未指定 `databaseVendor`，则按当前已设置的厂商执行。不在下面列表中的名称也按相同方式处理，不会报错。  
名称会使用编辑器所显示的括号类型加引号。`Bracket Type` [锁定](../guide/guides/settings.md#锁定)期间，它可能与 `value` 保存的括号类型不同，而编码智能体的 [`erd_read`](../mcp/tools.md#reading-a-document) 使用的是后者。  
从 `4.0.0` 起，可选的 `options` 参数会像 [Schema SQL](../guide/guides/schema-sql.md) 标签页的选项那样，选择语句和头部。`SchemaSQLOptions` 作为类型导出。

- `statements`：`'create'` 为默认值；`'ifNotExists'` 会在 MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 上写出 `IF NOT EXISTS`，在其他数据库上退回为 `'create'`；`'recreate'` 会先删除表再创建，Snowflake 则改为写出 `CREATE OR REPLACE TABLE`。
- `header`：`'none'` 为默认值；`'use'` 会切换到文档的数据库或 schema；`'createAndUse'` 会在其不存在时先创建，再切换到它。数据库不具备所请求的头部时，会像该标签页那样退回：Oracle 对 `'createAndUse'` 写出 `'use'`，PostgreSQL 对 `'use'` 不写出头部，SQLite 不写出任何头部。只有当文档的数据库名是普通标识符（由 ASCII 字母、数字和 `_` 组成，且不以数字开头）时，才会写出头部。

省略的选项或值未知的选项会按其默认值读取，因此不带选项的调用会与以前一样，写出普通的 `CREATE` 语句且不带头部。  
从 `4.0.0` 起，输出总会包含文档的 `Before tables` 和 `After tables` 脚本，顺序为：头部、前置脚本、删除语句、表、后置脚本。Schema SQL 标签页自身的 `Statements`、`Header` 和 `Tables` 选择永远不会影响该调用，它总是写出整个文档。  
从 `3.10.0` 起，每个外键都会带上关系的 `ON DELETE` 和 `ON UPDATE` 子句。只有在设置了操作且该厂商支持时才会写出子句，因此该厂商不支持的操作会被省略，并由其默认行为决定。从 `4.0.0` 起，Snowflake 只接受 `NO ACTION`。各数据库写出的内容参见 [ON DELETE 与 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。  
从 `3.10.0` 起，表注释或列注释中的单引号会被转义，因此 `it's` 这样的注释不会再破坏语句。所有以字符串字面量写出注释的厂商都会将单引号双写，Databricks 除外，它会在每个单引号和每个反斜杠前加上反斜杠。SQLite 仍以 `--` 行写出注释。  
从 `4.0.0` 起，若干数据库写出键名、默认值和 Auto Increment 的方式也有所不同。参见 [DDL 写出的内容](../guide/guides/schema-sql.md#what-the-ddl-writes)。

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
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
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
