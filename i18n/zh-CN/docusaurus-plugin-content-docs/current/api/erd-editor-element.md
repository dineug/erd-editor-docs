---
sidebar_position: 2
description: erd-editor 元素的 API：注册元素、属性、value 与 runtimeValue、事件、主题、显示语言、欢迎界面、按键绑定，以及 schema 的导入与导出。
---

# ErdEditorElement

编辑器就是一个普通的 `HTMLElement`，即导入 `@dineug/erd-editor/erd-editor.js` 所定义的 `<erd-editor>` 标签。  
从 `5.0.0` 起，导入包的根入口不会定义任何标签。根入口导出的 `ErdEditorElement` 既是元素的类型也是它的类，另外还导出 `defineErdEditor()`，它在你调用的位置定义该标签，参见[注册元素](./installation.md#registering-the-elements)。  
对于只显示图的页面，[`<erd-viewer>`](./erd-viewer-element.md) 是另一个独立的只读元素。

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

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

从 `4.1.0` 起，ERD 标签页中有一个[资源管理器](../guide/guides/explorer.md)：它以树形列出整张图，停靠在画布左侧，顶部是查找与替换。任何 HTML 属性、元素属性、方法或事件都无法打开或关闭它，也无法报告其状态：它通过工具栏的 `Explorer` 按钮、快速搜索或画布右键菜单中的 `Toggle Explorer`，或 [`findReplace`](#setkeybindingmap) 绑定打开。  
每个元素中的资源管理器初始都处于关闭状态。它是否打开、宽度、折叠状态以及搜索会在元素的整个生命周期内一直保留，切换标签页和每一次加载（包括 `setInitialValue`）都不会改变它们，并且永远不会出现在 `value`、`runtimeValue`、Undo 历史记录或 shared store 中。

从 `4.2.0` 起，表和列除名称外还可以有[逻辑名](../guide/guides/logical-names.md)，名称显示（与标签页一样是一项文档设置）决定画布绘制它们的名称、逻辑名还是两者。  
工具栏中还有一个 [Dictionary](../guide/guides/dictionary.md) 标签页，位于 `Code Generator` 和 `Settings` 之间，容纳文档的词根、术语和域，以及一个 `Checks` 工作表。它与其他标签页一样：其 `canvasType` 为 `'@dineug/erd-editor/builtin-dictionary'`，由 `Canvas Type` 锁定掌管，因此停留在该标签页时保存的文本，通过 [setInitialValue](#setinitialvalue) 加载时也会在该标签页打开；而只有在该锁定关闭期间，切换到该标签页才会写入 `value` 并发出 [change](#change)。没有任何专属于它的 HTML 属性、元素属性、方法或事件能够打开它或报告其状态。在其中所做的编辑都是文档变更：它们会出现在 `value` 中、发出 [change](#change) 并传到协作者那里，但其 Undo 和 Redo 在每个工作表自己的历史记录上进行，而不是在文档的历史记录上进行。  
该标签页自身的状态（显示哪个工作表，初始为 `Domains`，以及每个工作表的搜索、选中范围、滚动位置和列宽）会在元素的整个生命周期内一直保留，切换标签页和每一次加载都不会改变它们，并且永远不会出现在 `value`、`runtimeValue`、任何 Undo 历史记录或 shared store 中。  
`ErdEditorElement` 接口没有新增任何成员。API 新增的是 [getSchemaSQL](#getschemasql) 选项中的 `logicalNameAsComment`、十二个[主题 token](#settheme)，以及导出的 [dictionaryRowChords](#dictionaryrowchords)。

## readonly

设置编辑器是否可编辑。  
在其生效期间，为 `value` 赋值、`clear()`、`setSchemaSQL()`、`setSchemaGraphQL()`、`setSchemaDBML()`、`setSchemaAML()`、`setSchemaJSON()`、Undo 和 Redo（从 `4.2.0` 起也包括词典工作表的 Undo 和 Redo）都会被忽略，并且不会发出 `change` 事件。此时改用 [setInitialValue](#setinitialvalue) 加载文档。  
从 `5.0.0` 起，只读编辑器是阅读者，而不是控件被禁用的编辑器。它保留六个标签页、[资源管理器](../guide/guides/explorer.md#read-only-editors)、小地图、快速搜索、表属性、[Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer)、`Export`、禅模式，以及协作者的光标、焦点和选中状态；所有会编辑图的控件都被直接去掉，而不是绘制成禁用状态。在 `5.0.0` 之前，它仍会绘制许多编辑控件，并丢弃这些控件发出的内容。

在 ERD 标签页上，无论从哪里开始，拖动都会平移，在表上拖动也一样，按下不会选中、移动或打开任何内容。指针停在表上会点亮它的关系；在表或关系上静止点击会保持这一点亮，在其他任何位置静止点击则会将其熄灭，与 [`<erd-viewer>`](./erd-viewer-element.md) 相同。唯一的选中是跳转留下的轮廓：跳转到资源管理器中的一行、其查找的某个匹配项，或 `#`、`@`、`:` 之后的快速搜索结果，会选中其所到达的对象，下一次静止点击会将其清除。复制会复制该选中所包含的内容。  
[画布工具栏](../guide/guides/table-related-functions.md#canvas-toolbar)保留 `Zoom out`、缩放级别（`Reset zoom`）、`Zoom in`、名称显示列表、`Zen Mode` 和指南针，没有 `Hand` 或 `Select`，没有 `New Table`、`New Memo` 或 `New Table Group`，也没有关系按钮。画布菜单保留 `View Option`、`Name View`、`Export` 和 `Diff Viewer`，表菜单保留 `Table Properties`，备忘录、关系或表分组都不会弹出菜单。ERD 标签页上的快速搜索不列出任何会写入图的行：它保留 `Tab`、`Name View`、`Database`、`Export`、`Toggle Explorer`、由 [enableThemeBuilder](#enablethemebuilder) 和 [enableLocalePicker](#enablelocalepicker) 开启的 `Theme` 与 `Display Language` 行，以及 `#`、`@` 和 `:` 搜索。在其他标签页上，它列出的内容与可编辑的编辑器相同。工具栏把数据库名显示为文本，没有 `Undo`、`Redo` 或 `Time Travel` 按钮。  
没有任何地方提供 `Import`、[`Import and Add`](../guide/guides/file-import-export.md#import-and-add)、`Auto Layout`、表分组行（参见[表分组](../guide/guides/table-groups.md#read-only-editors)）或 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns)，也不显示[欢迎界面](#enablewelcomescreen)。  
添加、删除或编辑的绑定都不起作用：`edit`、`addTable`、`addColumn`、`addMemo`、`addTableGroup`、`groupSelectedTables`、`removeTable`、`removeColumn`、`removeSelection`、`primaryKey`、`selectAllTable`、`selectAllColumn`、四个关系绑定和 `handTool`，各自仍按其选项所述阻止默认行为。粘贴和 `Tab` 同样不起作用，并且会不被阻止地交给页面。缩放绑定、`zenMode`、`focusView`、对跳转所选中的表生效的 `tableProperties`、`search`、`findReplace`、复制、`Escape` 和方向键仍然有效。不会打开任何单元格、备忘录或表分组名称编辑器，也不会绘制任何关系。

资源管理器顶部的[查找与替换](../guide/guides/find-and-replace.md#read-only-editors)只能查找，没有 `Toggle Replace` 箭头，也没有 Replace 行。在任何编辑器中，该面板的标题都是 `Explorer`，工具栏按钮的提示都是 `Explorer (Ctrl + F)` (Windows/Linux) 或 `Explorer (⌘ + F)` (Mac)。资源管理器从 `4.1.0` 起就可以在只读编辑器中打开；从 `3.10.0` 到 `4.0.0`，查找与替换在那里以标题为 `Find`、只能查找的浮动面板形式打开。  
表属性可以从表菜单或 `tableProperties` 绑定打开，并且从 `3.10.0` 起，其标题旁会显示 `Read only` 徽标，其 `Indexes` 标签页也不提供任何编辑功能，参见[表属性](../guide/guides/table-related-functions.md#table-properties)。  
Settings 标签页带有同样的 `Read only` 徽标，并且以不接受按下的控件显示每项设置：两个开关、`Maximum comment width` 字段和七个 `Lock` 按钮都被禁用，`Column Order` 的各行也不能拖动。Schema SQL 标签页的 `Before tables` 和 `After tables` 脚本不接受输入。[Visualization](../guide/guides/visualization.md) 标签页的工作方式与可编辑的编辑器相同，因为那里的任何操作都不会编辑文档；Flow 中的 `Previous table` 和 `Next table` 仍可通过其按钮或 Undo 与 Redo 的按键后退和前进。  
[Dictionary](../guide/guides/dictionary.md#read-only-editors) 标签页仍然可以打开：可以切换、搜索、选中和滚动其工作表，也可以从中复制，`Checks` 工作表中的行也仍会跳转到它所指的对象。任何单元格都不接受编辑、粘贴或清除，该标签页不显示 `Add Row`、`Delete Rows`、`Import CSV` 或 `Export CSV` 工具，网格上也没有菜单，其行组合键既不会插入也不会删除任何行。表菜单、画布菜单和快速搜索都不提供 [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) 或 `Derive Physical Name Again`。

从 `5.0.0` 起，阅读者仍可更改的设置只保留在该编辑器的屏幕上：滚动和缩放、标签页、数据库、Code Generator 的语言、两种名称大小写、括号类型、`View Option` 各行，以及通过其每个选择器切换的[名称显示](../guide/guides/logical-names.md#read-only-editors)，后者从 `4.2.0` 起就一直只保留在屏幕上。无论它们的[锁定](../guide/guides/settings.md#锁定)如何，其中任何一项都不会传到 `value`、`runtimeValue`、`json` 导出、Undo 历史记录、[change](#change) 事件或共享 store，因此无论阅读者如何查看，`value` 都保持文档的设置。设置了 `readonly` 期间，[Schema SQL](../guide/guides/schema-sql.md#read-only-editors) 与 Code Generator 选项面板把这些设置标注为 `This window only`，而可编辑的编辑器中标注的是 `Saved in the document`。这两个标签页所显示、复制和保存的内容跟随屏幕，不带厂商调用的 [getSchemaSQL](#getschemasql) 也一样。  
在 `5.0.0` 之前，阅读者的滚动、缩放、标签页切换、数据库和代码设置，在没有锁定掌管它们时会进入 `value`（数据库从来没有锁定），共享 store 还会把它们发给其他编辑器。  
Schema SQL 标签页自身 `This window only` 下的选择，即 `Statements`、`Header`、从 `4.2.0` 起的 `Write logical names into empty comments` 和 `Tables`，在任何编辑器中都从不保存，并且仍然生效；[`Export image`](../guide/guides/file-import-export.md#image) 对话框、主题构建器和 Display Language 选择器也同样可用。在主题构建器或 Display Language 选择器中做出选择时，仍会发出 [changePresetTheme](#changepresettheme) 或 [changeLocale](#changelocale)。

设置了 `readonly` 期间，任何内容都不会进入 Undo 历史记录，滚动或缩放也不例外；编辑器的[共享 store](#getsharedstore) 也不发出任何更改，只发出它的 tracker 发出的阅读者的光标、焦点、选中状态和拖动框，以及另一个编辑器加入时所请求的寄存器（参见[协同编辑](./advanced/collaborative-editing.md)）。它仍会应用其他编辑器发来的每项更改。数据库、Code Generator 设置或 `View Option` 某行的变化会到达文档，除非阅读者在该屏幕上更改了该设置，否则也会到达屏幕；共享的名称显示切换则无论如何都会显示在屏幕上。

开启它会结束正在打开的内容：单元格、备忘录或表分组的名称编辑器、正在绘制的关系、表、备忘录、表分组或列的拖动、Alt 拖动的副本、备忘录或表分组的调整大小、仍在进行的自动布局预览或排布、`Map Columns`、Time Travel 和取色器。它会清除选中状态，放下手形工具，并首先发出每个共享 store 仍扣留的拖动或滚动内容，与 [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) 的做法相同。已变为只读的表属性、Diff Viewer 和 `Export image` 对话框保持打开，滚动、缩放、标签页和名称显示保持原样。首次挂载时就是只读的元素以同样的方式启动，被宿主在页面中移动的元素则保留跳转留下的轮廓。  
关闭它会让编辑控件回来，且没有任何内容被选中或打开。数据库、Code Generator 的语言、两种名称大小写、括号类型和 `View Option` 各行会恢复为文档的值，而滚动、缩放、标签页和名称显示保持在阅读者离开时的位置，`value` 也保持文档的设置，直到阅读者再次更改它们。两种切换都不会发出 `change`。  
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
从 `4.2.0` 起，它还会省略空的内容：空的 `doc` 列表、空的集合、不含任何内容的词典行，以及实体中为空的文本字段，例如名称、注释、数据类型、默认值或颜色。实体内部的列表（例如表的 `columnIds`）即使为空也仍会写出。新文档的 `doc` 为 `{}`，并且没有 `collections`，因此应把缺失的字段、列表或集合读作空。它包含表和列的逻辑名以及标明名称是否由词典生成的标记、列的域关联，以及词根、术语和域；每个词典都先写出一个由字段名组成的标题行，再按工作表中的顺序写出其各行，每行占一行。参见[存储形式与运行时值](./advanced/schema.md#存储形式与运行时值)。  
[锁定](../guide/guides/settings.md#锁定)处于开启状态的每项设置，都按其锁定的值写出，而不是按屏幕上显示的值写出。`Viewport` 锁定掌管 `originX`、`originY` 和 `zoomLevel`，`Canvas Type`、`Language`、`Table Name Case`、`Column Name Case`、`Bracket Type` 以及从 `4.2.0` 起的 `Name View` 则各自掌管对应的设置。名称显示写为 `nameViewMode`，并且只在其不为 `'physical'` 时才写出。其他所有设置都按其当前的值写出，`lockSettings` 总会写出。各个位的说明参见 [Settings](./advanced/schema.md#settings)；`Name View` 锁定的位含义相反。  
从 `5.0.0` 起，[只读](#readonly)编辑器的阅读者所更改的设置，无论是否锁定，也都按文档的值写出，因为它们只保留在该屏幕上。  
新文档的所有锁定都处于开启状态，无论是元素在被赋予值之前显示的文档，还是从空白值加载的文档。在相应的锁定关闭之前，其 `value` 会一直把原点写为 `0, 0`、缩放级别写为 `1`、标签页写为 ERD 标签页，写出默认的 Code Generator 语言、名称大小写和括号类型，并且从 `4.2.0` 起把名称显示写为 `Physical Names`。  
在 `4.0.0` 之前，它返回的是编辑器所持有形式的完整文档，并应用了 `ignoreSaveSettings`。编辑器所持有形式的文档现在是 [runtimeValue](#runtimevalue)，`ignoreSaveSettings` 也已不再被读取或写入。

```js
const data = editor.value;
```

### setter

加载此前保存的编辑器状态。它会替换整个文档，先清空当前文档。从 `4.2.0` 起，这也包括词根、术语和域：文档会采用文本中的词根、术语和域，文本中没有时则一个都没有，并且每个词典工作表自己的 Undo 历史记录都会被清空。  
与 `clear()`、`setInitialValue()` 以及处于默认 `mode: 'replace'` 的各个 `setSchema*` 方法一样，它也会丢弃 Visualization 标签页的 Flow 视图：包括它的布局、视图范围所缩小到的表、行显示、缩放和平移，以及从 `4.2.0` 起其 `Previous table` 和 `Next table` 所依次经过的表。追加（`mode: 'append'`）则不会丢弃它。  
会记录到 Undo 历史记录中，因此可以 `Undo, Redo`，并且会发出 `change`。  
它接受存储形式、[runtimeValue](#runtimevalue)，或较早发布版本保存的文件。  
空字符串或非字符串的值不会报错，而是加载一个新文档，因此赋值前需要先做好校验。  
该新文档就是 `setInitialValue('')` 所开始的文档：内容为空、采用默认设置，并且从 `4.0.0` 起所有锁定都处于开启状态。在 `3.10.x` 中，它既不保存滚动位置也不保存缩放级别；在此之前，两者都会保存。  
shared store 会把这次加载连同新文档的完整 JSON 一起中继给协作者，因此每个协作者（包括使用较旧发布版本的协作者）都会加载它，不过 `4.2.0` 之前的编辑器会丢掉它不认识的内容，例如逻辑名、域关联和词典，参见[混用不同版本](./advanced/collaborative-editing.md#mixing-releases)。  
从 `4.0.0` 起，所加载文档的锁定，以及 `value` 随后写出的锁定值，都来自文本；视图会落在文本所指定的位置，如果那里没有绘制图的任何部分，则落在图上。对于文本锁定的其他各项设置（标签页、Code Generator 的语言、名称大小写、括号类型，以及从 `4.2.0` 起的名称显示），编辑器会继续显示加载之前所显示的内容。文本未锁定的设置则采用文本中的值。`4.2.0` 之前保存的文件不会写明 `Name View` 锁定，除非有 `4.2.0` 的编辑器在其中关闭了该锁定，因此这样的文件加载后，名称显示锁定在 `Physical Names`，编辑器则保持其原先显示的名称显示。[setInitialValue](#setinitialvalue) 则会采用文本中的每一个值；一个锁定都没有写明的文本，也请参见该节。  
不是 JSON 的文本（例如残留合并冲突标记的文件）同样不会报错：文档会被清空，设置保持原样，解析错误则会输出到控制台。  
在 `readonly` 生效期间会被忽略，要在只读编辑器中加载文档需使用 [setInitialValue](#setinitialvalue)。

```js
editor.value = 'json...';
```

## runtimeValue

从 `4.0.0` 起，以 JSON 字符串的形式获取该编辑器所持有形式的文档。它没有 setter，因此在严格模式的代码中为其赋值会抛出错误。  
它包含 [value](#value) 所省略的内容：已删除的实体及其顺序、叠放顺序、测量得到的宽度、键标记、关系的连接线锚点以及序列，并且从 `4.2.0` 起还包括空的文本字段、`doc` 列表和集合；从词典工作表中删除的行以及不含任何内容的行；每个词典行的排序键；词根、术语和域的 `doc` 列表；以及指向已删除的域的关联。锁定的设置在这里同样按其锁定的值写出。  
可以用它通过 [setInitialValue](#setinitialvalue)，为加入已在进行中的会话的另一个编辑器（例如协作者，或同一文档的第二个视图）载入初始文档。这样，会话之后发来的对删除操作的 Undo 会在那里完整地恢复该实体；而用 `value` 载入初始文档的编辑器不持有任何已删除的实体，恢复出来的会是一个空的、没有名称的表，或者从 `4.2.0` 起是一个空的词典行。参见[协同编辑](./advanced/collaborative-editing.md)。  
已不再有任何机制回收已删除的实体，因此它们会一直留在其中，直到下次从文件打开该文档。  
切勿将它写入文件：请保存 `value`，[JSON Schema](./advanced/schema.md#json-schema) 接受 `value`，而不接受它。

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue

加载此前保存的编辑器状态。加载本身不会记录到 Undo 历史记录中，因此无法 Undo，也不会发出 `change` 事件。  
加载时还会清空 Undo 历史记录，因此加载之前所做的操作无法在加载后的文档上撤回或重做；从 `4.2.0` 起，每个词典工作表自己的历史记录也会一并清空。  
它接受存储形式、[runtimeValue](#runtimevalue)，或较早发布版本保存的文件，并且与为 `value` 赋值不同，它会采用文本中的每一项设置，包括标签页和代码相关的设置。  
空字符串或非字符串的值不会报错，而是加载一个新文档，因此 `setInitialValue('')` 会以空白的图开始。  
从 `4.0.0` 起，该新文档（也就是元素在被赋予任何值之前显示的文档）的所有锁定都处于开启状态。滚动、缩放、切换标签页，以及更改 Code Generator 的语言、名称大小写、括号类型或（从 `4.2.0` 起）名称显示，都会让 `value` 保持原样，也不会发出 `change`。在 `3.10.x` 中，它既不保存滚动位置也不保存缩放级别；在此之前，两者都会保存。  
从文本加载的文档会沿用其中写明的锁定。一个锁定都没有写明的文档（`4.0.0` 之前保存的任何文件，无论其 `ignoreSaveSettings` 写的是什么，以及 v2 的 `.vuerd` 文件）打开时所有锁定都处于开启状态，其 `Viewport` 锁定在原点 `0, 0` 和缩放级别 `1`，停留在 ERD 标签页，语言、名称大小写和括号类型则保持其保存时的值。  
从 `4.2.0` 起，写明了锁定但没有写明 `Name View` 锁定的文本，打开时该锁定同样处于开启状态，即使其他所有锁定都处于关闭状态。`4.2.0` 之前保存的文件就是这样的文本，除非有 `4.2.0` 的编辑器在其中关闭了该锁定（参见 [Settings](./advanced/schema.md#settings)）。它会以 `Physical Names` 打开，与一个锁定都没有写明的文本相同。  
无论哪种情况，视图都会在文档的视图处打开（文本写明了锁定时为它保存的视图，一个都没有写明时为原点 `0, 0`、缩放级别 `1`）；如果那里没有绘制图的任何部分，则在图上打开。锁定的 `Viewport` 仍会在 `value` 中保留其锁定的值。  
从 `4.0.0` 起，它还会丢弃此前所持有文档的协同状态，并且该编辑器已经订阅的 [shared store](#getsharedstore) 会再次向其他编辑器请求它们的协同状态，因此在进行中的会话里重新加载的编辑器能够跟上进度。请用另一个编辑器的 [runtimeValue](#runtimevalue) 为这样的编辑器载入初始文档。  
不是 JSON 的文本同样不会报错：文档会被清空，设置保持原样，解析错误则会输出到控制台。  
与为 `value` 赋值不同，它不受 `readonly` 限制，因此可以用它把文档加载到只读编辑器中。只读编辑器随后会显示所加载文本中的设置，丢弃阅读者在屏幕上更改过的那些。

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
从 `4.2.0` 起，这包括 [Dictionary](../guide/guides/dictionary.md) 标签页上的每次编辑及其每次 Undo 或 Redo、逻辑名或域关联的更改、`Derive Physical Names Again`，以及 `Name View` 锁定关闭期间的名称显示切换。  
在 Visualization 标签页的 Flow 模式中所做的任何操作都不会触发它，包括缩放、平移、移动卡片、`Tidy Up`、行显示、从卡片缩小视图范围，以及从 `4.2.0` 起通过 `Previous table` 和 `Next table` 或 Undo 与 Redo 的按键后退和前进，因为这些都不是文档变更。其 `Name View` 列表是例外：在 `Name View` 锁定关闭期间，在那里切换会触发它，与在 ERD 标签页上切换相同。  
从 `4.0.0` 起，对[锁定](../guide/guides/settings.md#锁定)处于开启状态的设置所做的更改也不会触发它，因为这类更改只会移动屏幕，而永远不会改变 `value`：在 `Viewport` 锁定期间滚动或缩放 ERD 画布，在 `Canvas Type` 锁定期间切换标签页，在各自的锁定开启期间更改 Code Generator 的语言、表名大小写、列名大小写或括号类型，以及从 `4.2.0` 起在 `Name View` 锁定期间切换名称显示。只有这些更改会被排除，因此同时编辑了文档的批次仍会触发它。锁定或解锁某项设置会触发它。  
新文档以及 `4.0.0` 之前保存的任何文件的所有锁定都处于开启状态，`4.2.0` 之前保存的任何文件的 `Name View` 锁定也处于开启状态（除非有 `4.2.0` 的编辑器在其中关闭了它），因此默认情况下，滚动、缩放、切换标签页和切换名称显示都不会发出任何事件。这包括从 ERD 标签页聚焦于表、把你从 Flow 带回 ERD 标签页的外部链接卡片按钮、跳转到资源管理器中的行或搜索的匹配项、从其他标签页打开资源管理器或跳转到快速搜索的结果，以及从 `4.2.0` 起，由 Dictionary 标签页 `Checks` 工作表中的行跳转到表或列。只有在覆盖相应操作的锁定关闭时，它们才会各发出一次 `change`：标签页切换对应 `Canvas Type`，卡片按钮、快速搜索结果、资源管理器中的行、搜索的匹配项或 `Checks` 工作表的行同时造成的滚动对应 `Viewport`。从 `4.1.0` 起，这些滚动都遵循同一条规则，即[跳转的落点](../guide/guides/table-related-functions.md#where-a-jump-lands)，因此快速搜索的表结果不再每次都会滚动，而该规则判定无需移动的跳转不会产生滚动，也就没有可发出的事件。打开、关闭资源管理器或调整其宽度会让画布变窄或变宽，但不会移动其原点，同样不会发出任何事件。在 `4.0.0` 之前，滚动、缩放和切换标签页总会触发它，即使 `editor.value` 并未改变。  
要跳过不改变任何内容的写入，应将 `editor.value` 与你上一次存储的值进行比较，而不是与你加载的文件比较：由较早发布版本写出的文件、v2 文件或手动编辑过的文件，一经加载，其 `value` 就可能与文件不同，因为 `value` 会以存储形式写出它。`Viewport` 锁定关闭、并且其原点在当前屏幕上没有绘制图的任何部分的文件也是如此：加载会把视图移到图上，`value` 则写出视图落下的位置。从 `4.0.0` 起，测量得到的宽度不再造成这种情况，因为 `value` 中不包含宽度。从 `4.2.0` 起，`4.0.0` 或 `4.1.0` 保存的文件也可能不同，因为 `value` 现在会省略其中为空的文本字段、列表和集合，因此这样的文件会在下一次保存时被重写一次。写入文件的宿主也可以改为借助用于数据复制的 store 提供的 `changed` 来区分编辑与视图变化，参见 [on@change](./advanced/remote-storage.md#onchange)。  
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

清空文档，移除所有表、列、关系、索引和备注，从 `4.0.0` 起还会移除所有表分组，从 `4.2.0` 起还会移除 Dictionary 标签页的词根、术语和域，并清空每个工作表自己的 Undo 历史记录。  
所有设置都会保留，包括数据库、视图位置、缩放级别、表显示选项、每个锁定及其持有的值，以及 Schema SQL 标签页的 `Before tables` 和 `After tables` 脚本，因此清空后的文件仍会保存它原先保存的那些信息。如果想改为开始一个新文档，请为 `value` 赋值 `''`，或调用 `setInitialValue('')`。  
会记录到 Undo 历史记录中，因此可以 Undo，并且会发出 `change`。Undo 会按编辑器所持有的形式恢复文档（包括其词根、术语和域），每项锁定的设置都处于其锁定的值。在 `readonly` 生效期间会被忽略。

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
只有下面这二十一个名称会被写入，对象中的其他内容都会被忽略，包括那些固定的名称。  
从 `3.10.0` 起，`search` 可以重新定义，并新增了 `findReplace`。在此之前，`search` 是固定的。从 `4.0.0` 起，新增了 `removeSelection`。从 `4.1.0` 起，新增了 `addTableGroup` 和 `groupSelectedTables`。  
绑定的值必须是 `ShortcutOption[]`。单纯的字符串会被忽略，因此要写成 `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`，而不是 `{ addTable: 'Alt+KeyN' }`。  
空数组也会被接受，并且不绑定任何按键：`setKeyBindingMap({ findReplace: [] })` 会把 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 留给页面处理，`{ search: [] }` 对 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 也是如此。工具栏的 `Search` 按钮仍可打开快速搜索，工具栏的 `Explorer` 按钮仍可打开和关闭资源管理器，快速搜索和画布右键菜单中的 `Toggle Explorer` 也仍可打开其搜索或将其关闭；对于留空的名称，这些位置都不会显示快捷键。`{ removeSelection: [] }` 会把 `Delete` 和 `Backspace` 留给页面处理，此时表、备注和表分组菜单中的删除条目（`Delete`、`Delete selected`、`Delete column`、`Delete columns`）都不会显示快捷键。  
从 `4.1.0` 起，`{ addTableGroup: [] }` 会把 `Alt + G` (Windows/Linux) 或 `⌥ + G` (Mac) 留给页面处理，`{ groupSelectedTables: [] }` 则会把先按 `T` 再按 `G` 留给页面处理。画布工具栏、画布右键菜单和快速搜索中的 `New Table Group`，表菜单中的 `Group selected tables`，以及快速搜索中的 `Group Selected Tables` 仍然可用，只是不显示快捷键。画布工具栏的 `New Table`、`New Memo` 和 `New Table Group` 按钮的提示会标出 `addTable`、`addMemo` 和 `addTableGroup` 的第一个组合键；对于留空的绑定，则只显示按钮名称。  
从 `4.2.0` 起，`addColumn` 和 `removeColumn` 还为 Dictionary 标签页的网格提供行组合键（见下文），因此改绑其中任何一个，这些组合键也会随之改变。`{ addColumn: [] }` 会让网格没有用于插入行的组合键，此时网格菜单中的两个插入条目都不显示快捷键；`{ removeColumn: [] }` 会让网格没有用于删除行的组合键，此时该菜单中的删除条目和 `Delete Rows` 的提示都不显示快捷键。  
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

`selectAllTable`、`handTool`、`removeSelection`，以及从 `4.1.0` 起的 `groupSelectedTables`，都会让位于光标：只要焦点位于 input、textarea 或 `contenteditable` 中，`$mod + A` 就会选中文本，`Space` 就会输入空格，`Delete` 和 `Backspace` 就会删除文本，先按 `T` 再按 `G` 就会输入这两个字母，都不会传到画布上。这些按键的默认行为都不会被阻止。改绑到其他快捷键后行为同样如此。

从 `4.0.0` 起，`removeSelection`（`Delete` 或 `Backspace`）会在 ERD 标签页上删除选中的对象，算作一步 Undo，并且不会要求确认。当唯一选中的对象是获得焦点的表、其中选中了一列或多列，并且当前缩放会绘制其各行时，它会删除这些列；否则它会删除所有选中的表、备注和表分组，分组中的表会保留。参见[删除表与备注](../guide/guides/table-related-functions.md#删除表与备注)。  
按住按键不放时只会删除一次，单元格、备注或表分组名称编辑器打开期间不会删除任何内容。在文本框以及会拦下绑定的面板和标签页（参见 [createKeyBindingMap](#createkeybindingmap)）之外，只要编辑器获得焦点，这次按键在每个标签页上都会被阻止默认行为，焦点位于工具栏按钮上时也是如此；在只读编辑器中同样会被阻止，但不会删除任何内容。

从 `4.1.0` 起，`addTableGroup`（`Alt+KeyG`）会在 ERD 标签页上进入 `New Table Group` 绘制状态，此后在画布上按下鼠标左键即会绘制分组；再按一次则结束绘制状态，与画布工具栏的 `New Table Group` 按钮相同。`groupSelectedTables`（`KeyT KeyG`，即先按 `T` 再按 `G`）会把选中的表放入一个新分组并打开其名称编辑器，与表右键菜单中的 `Group selected tables` 相同。没有选中任何表时它不会添加任何内容；选中的备注或表分组不计算在内。参见[绘制分组](../guide/guides/table-groups.md#drawing-a-group)和[为选中的表分组](../guide/guides/table-groups.md#grouping-selected-tables)。  
两者只在菜单提供分组的情况下起作用：在 `readonly` 生效期间、View Option 中的 `Table Groups` 隐藏分组期间，或单元格、备注或表分组名称编辑器打开期间，它们都不起作用。与其他画布绑定一样，它们仅作用于 ERD 标签页，并且在快速搜索、表属性、Diff Viewer、Time Travel、自动布局预览、`Export image` 或 `Map Columns` 打开期间不起作用。在它们不起作用的地方，这次按键仍会被阻止默认行为，`groupSelectedTables` 让位于光标时除外。`addTableGroup` 还会像 `focusView` 和 `zenMode` 一样被停止传播，因此页面中冒泡阶段的 `keydown` 监听器永远收不到它。

从 `4.2.0` 起，在 [Dictionary](../guide/guides/dictionary.md#adding-and-deleting-rows) 标签页上，`addColumn` 的每个单次按键组合键都会在选中范围下方插入与选中范围所覆盖行数相同的行，同时再按住 `Shift` 的同一组合键会在上方插入这些行，`removeColumn` 的每个单次按键组合键则会删除选中范围所覆盖的行：在默认设置下分别为 `Alt+Enter`、`Alt+Shift+Enter`，以及 `Alt+Backspace` 或 `Alt+Delete`。它们在 `Domains`、`Words` 和 `Terms` 工作表的网格中、没有打开任何单元格编辑时起作用。本身已包含 `Shift` 的 `addColumn` 组合键不会产生在上方插入的组合键，绑定到这两个名称之一的序列也不会为网格提供任何组合键。  
每次这样的按键都会按其选项的规定被阻止默认行为，并且总会被停止传播，因此它不会在 ERD 标签页上添加或删除任何列。在 `Checks` 工作表上以及只读编辑器中，它不起作用，但仍会被阻止默认行为并停止传播。在打开的单元格编辑或该标签页的搜索输入框中，这些组合键交给文本处理：它们在那里会被停止传播，但不会被阻止默认行为，因此输入框会像在其他任何地方一样响应它们（在 Mac 上，`⌥ + Backspace` 会删除一个单词）。[dictionaryRowChords](#dictionaryrowchords) 列出了这些组合键。

从 `3.10.0` 起，`findReplace`（`$mod+KeyF`）会打开[查找与替换](../guide/guides/find-and-replace.md)。从 `4.1.0` 起，它用于开关容纳查找与替换的[资源管理器](../guide/guides/explorer.md#opening-and-closing)，Shortcuts 标签页将其列为 `Toggle Explorer`。  
工具栏的 `Explorer` 按钮显示为按下状态期间（即资源管理器在 ERD 标签页中处于打开状态且未被禅模式隐藏），它会关闭资源管理器，除非快速搜索、表属性、主题构建器、Display Language 选择器、`Export image` 对话框或 `Map Columns` 处于打开状态。其他情况下，它会关闭上述已打开的那一个，在其他任何标签页中按下时先切换到 ERD 标签页，然后打开资源管理器，把光标放到其 `Find` 输入框中并选中查询内容。编辑器过窄、无法在画布旁显示资源管理器时，资源管理器仍保持打开，但会让位、不再绘制，并显示 `Widen the window to show the Explorer` 提示。在 `4.1.0` 之前，它会打开浮动的查找与替换面板，或把键盘焦点交还给其输入框，并且从不关闭该面板。  
它不会让位于光标：只要编辑器获得焦点，无论在哪个标签页，也无论焦点位于画布上还是编辑器内部的输入框中，该按键都会被它截获。这次按键的默认行为会被阻止，因此浏览器不会打开查找栏；它也会被停止传播，因此页面上冒泡阶段的 `keydown` 监听器都收不到它。单元格或备注编辑器处于打开状态时，从 `4.0.0` 起表分组名称编辑器处于打开状态时，或者从 `4.2.0` 起 Dictionary 标签页的网格中有单元格编辑处于打开状态时，它仍会被阻止默认行为并停止传播，但不起任何作用。在最后这种情况下，`search` 同样不起作用，因此已输入的文本会保留下来。  
Diff Viewer、Time Travel 或自动布局预览打开期间（无论在哪个标签页），或输入法仍在组字时，它既不会被阻止默认行为，也不会被停止传播，因此会交给浏览器或宿主自己的查找功能。在资源管理器中，仍在组字的按键会在资源管理器处被停止传播，但其默认行为不会被阻止。把 `findReplace` 改绑到其他快捷键后行为同样如此。

`focusView` 仅作用于 ERD 标签页。至少选中一个表时，它会以 Flow 模式打开 Visualization 标签页，范围缩小到这些表以及与它们相隔一条关系的所有表；选中的备注或表分组不计算在内，没有选中任何表时它不起作用。参见[聚焦于表](../guide/guides/visualization.md#focusing-on-tables)。

`undo` 和 `redo` 的作用因标签页而异。在 ERD 标签页上，它们撤回和重做文档的历史记录。从 `4.2.0` 起，在 Dictionary 标签页上，它们撤回和重做当前显示的工作表自己的历史记录，在 `Checks` 工作表上则不起作用，参见[词典工作表](../guide/guides/undo-redo.md#dictionary-sheets)。在 Visualization 标签页的 Flow 模式中，它们会像 [`Previous table` 和 `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) 那样后退和前进，不触及文档的历史记录。在其他标签页上以及 Graph 模式中，它们不会撤回任何内容。

在 ERD 标签页上，`stop`（`Escape`）会关闭已打开的单元格或备注编辑器，或取消正在绘制的关系，并保持选中状态不变。从 `4.0.0` 起，它还会关闭表分组名称编辑器（不写入任何名称），并取消正在进行的 `New Table Group` 绘制。编辑器会对这次按键调用 `preventDefault()`。  
没有上述任何一项处于打开状态时，`Escape` 会清除选中状态和单元格焦点，并且其默认行为不会被阻止。因此，结束编辑并清除选中状态需要按两次。  
从 `4.2.0` 起，逻辑名单元格的术语列表显示期间（参见[补全术语名称](../guide/guides/logical-names.md#completing-term-names)），第一次按下的 `Escape` 只会关闭该列表，编辑器保持打开。这次按键会在该单元格处被阻止默认行为并停止传播，因此 `stop` 和页面中冒泡阶段的 `keydown` 监听器都收不到它。  
除了资源管理器、[欢迎界面](#enablewelcomescreen)中 `Import` 的各种格式、逻辑名单元格的术语列表、[Dictionary](../guide/guides/dictionary.md#keys-on-the-tab) 标签页，以及下面所述的选择器和对话框之外，编辑器从不阻止 `Escape` 继续传播，因此自行监听它的页面（例如用来关闭自己的对话框）会收到这两次按键，并可以跳过 `defaultPrevented` 为 `true` 的那一次。  
快速搜索、表属性、Diff Viewer、自动布局预览或 Time Travel 打开期间，`Escape` 会改为关闭它们，并保持选中状态不变。这次按键的默认行为同样不会被阻止。  
从 `4.0.0` 起，已打开的 [`Export image`](../guide/guides/file-import-export.md#image) 或 [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) 对话框也会接收 `Escape`，关闭自身并保持选中状态不变。它们打开时都会接管键盘，这次 `Escape` 会同时被阻止默认行为并停止传播。  
从 `4.1.0` 起，焦点位于[资源管理器](../guide/guides/explorer.md#keys-in-the-explorer)中（无论在其树、输入框还是按钮上）时按下的 `Escape`，会把键盘焦点交还给画布，资源管理器保持打开，选中状态也保持不变。编辑器会对这次按键同时调用 `preventDefault()` 和 `stopPropagation()`，因此它永远不会到达页面中冒泡阶段的 `keydown` 监听器。  
在画布上按下的 `Escape` 永远不会关闭资源管理器。在 `4.1.0` 之前，在查找与替换面板中按下的 `Escape` 会关闭面板，在画布上按下的 `Escape` 则会在清除选中状态的同一次按键中关闭面板。  
从 `4.0.0` 起，Display Language 选择器和选色器会在按下 `Escape` 时关闭：在它们内部，`Escape` 会被阻止默认行为并停止传播；在画布上，它会在清除选中状态的同一次按键中关闭它们，既不会被阻止默认行为，也不会被停止传播。  
在输入法仍在组字时按下的 `Escape` 属于组字过程。它会让打开的编辑器保持原样，并且其默认行为不会被阻止，因此页面同样可以跳过 `isComposing` 为 `true` 或 `keyCode` 为 `229` 的按键。在资源管理器中，这样的按键与组字过程中在其中按下的任何按键一样，还会被停止传播，键盘焦点也会留在输入框中。  
在 `3.9.2` 之前，按一次 `Escape` 既会结束编辑或绘制，又会清除选中状态，并且编辑器从不阻止其默认行为。

### createKeyBindingMap

从 `3.9.2` 起，该包导出 `createKeyBindingMap()`，并一同导出 `KeyBindingMap`、`KeyBindingName` 和 `ShortcutOption` 类型。  
它返回默认的按键绑定，包含全部 28 个名称（固定名称也在其中），并且每次调用都返回一个新的映射，因此修改它返回的映射不会影响其他任何内容。  
每个编辑器都以它为起点，而 `setKeyBindingMap` 的调用不会反映在其中。  
这四者中只有 `createKeyBindingMap` 是运行时导出，其余三个都是类型。从 `4.2.0` 起，[dictionaryRowChords](#dictionaryrowchords) 也与它一同导出。

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

每个 `shortcut` 都是一个采用 [tinykeys](https://github.com/jamiebuilds/tinykeys) 语法的组合键，以 `KeyboardEvent.code` 指定按键，其中 [`$mod`](#mod) 在 macOS 上为 `⌘`，在其他环境中为 `Control`。  
从 `4.0.0` 起，编辑器以相同的语法自行解析这些组合键，而不再通过 tinykeys。按键通过其 `code` 匹配，或通过其 `key`（不区分字母大小写）匹配，并且只有恰好按住组合键所写明的修饰键时，这次按键才会匹配。`AltGraph` 在 Windows 上算作 `Control` 和 `Alt`，在 macOS 上算作 `Alt`。以空格分隔的多次按键构成一个序列，一秒内没有 keydown 时序列会重新开始。  
从 `4.1.0` 起，有一个默认值是序列：`groupSelectedTables` 为 `KeyT KeyG`，即先按 `T` 再按 `G`。序列在完成它的那次按键时执行，并且只有这次按键会应用其 `preventDefault` 和 `stopPropagation`，因此在默认设置下，`T` 会传到页面，只有 `G` 会被阻止默认行为。菜单、快速搜索和 Shortcuts 标签页会为序列中的每次按键各显示一个按键。  
固定名称分别绑定到 `Enter`（`edit`）、`Escape`（`stop`）、`$mod+KeyZ`（`undo`）、`$mod+Shift+KeyZ`（`redo`）、`$mod+Equal`（`zoomIn`）、`$mod+Minus`（`zoomOut`）和 `$mod+Digit0`（`zoomReset`）。`edit` 和 `stop` 不带任何标志，其余五个带有 `preventDefault` 和 `stopPropagation`。其余名称的绑定即上面的默认值，`search` 和 `findReplace` 也在其中。

编辑器在自身元素上监听这些按键，因此通过全局热键或捕获阶段的 `keydown` 监听器先于编辑器截获按键的宿主，需要在编辑器获得焦点期间放行这些按键。  
要放行的按键列表可以基于 `createKeyBindingMap()` 构建，并用传给 `setKeyBindingMap` 的绑定替换相应的默认值。  
从 `3.10.0` 起，该列表包含浏览器自身的查找组合键 `$mod+KeyF`。希望在该组合键上保留自己的查找功能的宿主，可以传入 `setKeyBindingMap({ findReplace: [] })`。  
从 `4.0.0` 起，该列表还包含不带修饰键的 `Delete` 和 `Backspace`。希望保留这两个按键的宿主，可以传入 `setKeyBindingMap({ removeSelection: [] })`。  
从 `4.1.0` 起，该列表还包含 `Alt+KeyG` 和序列 `KeyT KeyG`，后者是一个字符串：请在空格处将其拆开，并放行其中的每次按键，包括不带修饰键的 `T` 和 `G`，因为缺少任何一次按键的序列永远无法完成。希望保留这些按键的宿主，可以传入 `setKeyBindingMap({ addTableGroup: [] })` 或 `setKeyBindingMap({ groupSelectedTables: [] })`。  
从 `4.2.0` 起，还需向该列表中加入 [dictionaryRowChords](#dictionaryrowchords) 针对同一映射返回的组合键，其中包括 `Alt+Shift+Enter`。希望保留这些按键的宿主，可以传入 `setKeyBindingMap({ addColumn: [] })` 或 `setKeyBindingMap({ removeColumn: [] })`，这样也会让这些按键不再用于在 ERD 标签页上添加和删除列。

焦点位于资源管理器中时，无论是在其树、`Find` 和 `Replace` 输入框还是按钮上，`findReplace`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut` 和 `zoomReset` 都会传给编辑器，因此 `findReplace` 在那里的作用与在画布上相同。其他所有绑定（以当前的设置为准）都止于资源管理器，序列则止于其最后一次按键（在默认设置下为不带修饰键的 `G`），方向键、`Tab`、`Enter`、`Space`、`Home`、`End` 以及输入法仍在组字时按下的任何按键也是如此。除了把键盘焦点交还给画布的 `Escape` 之外，这些按键只会被停止传播而不会被阻止默认行为，因此它们在资源管理器的输入框、按钮和树中作为普通按键使用，既不会到达画布，也不会到达页面中冒泡阶段的 `keydown` 监听器：在那里按 `Alt + N` 不会添加表，按 `Delete` 也不会删除任何内容。用于在树中移动、折叠或跳转到行的按键，以及在 `Find` 或 `Replace` 输入框中用于在匹配项之间移动或执行替换的 `Enter`，同样会被阻止默认行为。  
其他任何按键，例如宿主的保存或命令面板组合键，都会照常传给页面。参见[资源管理器中的按键](../guide/guides/explorer.md#keys-in-the-explorer)。在 `4.1.0` 之前，浮动的查找与替换面板也以相同的方式处理按键，但 `Home`、`End`、序列的最后一次按键，以及 `handTool` 绑定到其他按键时的 `Space` 除外。  
从 `4.0.0` 起，Display Language 选择器也以相同的方式处理按键：同样的七个绑定会传给编辑器，其他所有绑定（从 `4.1.0` 起，序列以其最后一次按键为准）、方向键和 `Tab` 都会在那里被停止传播而不会被阻止默认行为，输入法仍在组字时按下的任何按键也是如此。在其中某一行上按下的 `↑`、`↓`、`Home`、`End`、`Enter` 和 `Space` 会在各行之间移动或选择该行，并且同样会被阻止默认行为。

从 `4.2.0` 起，[Dictionary](../guide/guides/dictionary.md#keys-on-the-tab) 标签页也会拦下按键，只有 `search`、`findReplace`、`undo` 和 `redo` 会传给编辑器。`undo` 和 `redo` 作用于当前显示的工作表自己的历史记录；有单元格编辑处于打开状态或焦点位于该标签页的搜索输入框中时，它们交给文本处理，在那里会被停止传播，但不会被阻止默认行为。如上文所述，单元格编辑处于打开状态时，`search` 和 `findReplace` 不起作用。行组合键在网格中起作用，如上文 `addColumn` 和 `removeColumn` 部分所述。  
其他所有绑定（以当前的设置为准）都止于该标签页，序列则止于其最后一次按键，方向键、`Tab`、`Enter`、`Space`、`Home`、`End` 以及输入法仍在组字时按下的任何按键也是如此。它们都不会到达画布，也不会到达页面中冒泡阶段的 `keydown` 监听器：在那里按 `Alt + N` 不会添加表，按 `Delete` 也不会从图中删除任何内容。该标签页中的复制、剪切和粘贴事件同样止于那里，因此图永远不会把它们当作自己的事件读取。其他任何按键都会照常传给页面。

### dictionaryRowChords {#dictionaryrowchords}

从 `4.2.0` 起，该包导出 `dictionaryRowChords()`。它返回在你传入的按键绑定映射下，Dictionary 标签页的网格用于插入或删除行的所有组合键，每次调用都返回一个新的 `ShortcutOption[]`。  
它们依次为：`addColumn` 的单次按键组合键，用于在选中范围下方插入行；这些组合键各自再按住 `Shift` 的形式，用于在上方插入行，本身已包含 `Shift` 的组合键则没有对应项；以及 `removeColumn` 的单次按键组合键，用于删除行。每个组合键都保留其来源绑定的 `preventDefault` 和 `stopPropagation`，序列则被省略。参见[添加与删除行](../guide/guides/dictionary.md#adding-and-deleting-rows)。  
在上方插入行的组合键（在默认设置下为 `Alt+Shift+Enter`）不属于任何绑定，因此严格匹配修饰键、并且只基于 [createKeyBindingMap](#createkeybindingmap) 构建放行按键列表的宿主永远不会放行它。请像 Obsidian 插件那样，同时放行这两个列表。  
它只读取传给它的映射，而不读取元素的绑定，因此请把你构建按键列表时所依据的映射传给它。

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

`tableShadow` 和 `memoShadow` 是表与备注在 ERD 画布上投下的阴影的颜色。深色预设将它们设为 `transparent`，即不投下阴影，与向 `setTheme` 传入 `none` 或空字符串的效果相同；浅色预设则使用 `rgba(0, 0, 0, 0.18)`。

从 `4.0.0` 起，新增了九个 token：

- `tableGroupHeaderBackground`、`tableGroupBackground` 和 `tableGroupBorder` 用于为没有自身颜色的[表分组](../guide/guides/table-groups.md)设置标题栏、主体和轮廓的颜色。
- `toastSuccess` 和 `toastError` 用于设置报告某项操作结果的提示中标记的颜色。
- `findReplaceError` 和 `mapColumnsError` 用于设置查找与替换以及映射列对话框所显示错误的颜色。查找与替换此前使用的是 `diffDeleteForeground`，因此覆盖该 token 已不会再改变它的颜色。
- `schemaSqlWarningBackground` 和 `schemaSqlWarningForeground` 用于设置 Schema SQL 标签页选项中警告的颜色。

从 `4.1.0` 起，又新增了九个 token：

- `treeBackground`、`treeRowHover`、`treeRowCurrent`、`treeMuted` 和 `treeMatch` 用于设置[资源管理器](../guide/guides/explorer.md#the-tree)与 [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) 共用的树的颜色，依次为：树的背景，它同时也填充资源管理器的 `Find` 和 `Replace` 输入框；指针下方的行、树拥有焦点时键盘焦点所在的行，以及资源管理器标题栏和搜索区域中指针下方的按钮；当前搜索匹配项所在的行；计数、数据类型和折叠箭头等淡色文本；以及搜索找到的文本背后的标记。
- `explorerBackground` 和 `explorerBorder` 用于设置资源管理器面板及其线条的颜色：紧贴画布的边缘、搜索下方的分隔线，以及其输入框和 `Search In` 展开的按钮的边框。`explorerBorder` 还用于绘制 Diff Viewer 树的边缘、其 `Filter by name` 输入框下方的分隔线以及该输入框的边框。资源管理器中的钥匙图标使用 `keyPK`、`keyFK` 和 `keyPFK`。
- `diffModifyForeground` 和 `diffRenameForeground` 用于设置 Diff Viewer 在其树中以及两侧文档上标记为已变更和已重命名的内容的颜色。`diffModifyForeground` 还用于为被移动、调整了大小、更改了颜色或更换了分组的表、备注或表分组描出轮廓（无论其中还有哪些其他变更），并绘制已变更外键的连接线。

`diffInsertForeground` 和 `diffDeleteForeground` 现在用于设置 Diff Viewer 标记为已添加和已删除的内容的颜色，在其树中以及包含该内容的文档上，文本、轮廓和连接线都使用它们。`diffInsertBackground`、`diffDeleteBackground`、`diffCrossBackground` 和 `diffCrossForeground` 已在 `4.1.0` 中移除，因为 Diff Viewer 不再填充单元格。`setTheme` 会像丢弃其他任何不在 `Theme` 中的名称一样丢弃它们，它们的钩子 `--erd-editor-diff-insert-background`、`--erd-editor-diff-delete-background`、`--erd-editor-diff-cross-background` 和 `--erd-editor-diff-cross-foreground` 也不再被读取。

从 `4.2.0` 起，又新增了十二个 token：

- `columnHandleBackground` 和 `columnHandleBorder` 用于设置[列的拖动手柄](../guide/guides/table-editing.md#调整与移动列)的填充色和轮廓颜色，该手柄绘制在表的左边缘外侧、获得焦点的列行旁边；指针位于其上方时，则改用 `columnHandleHoverBackground` 和 `columnHandleHoverBorder`。手柄上的握把图标使用 `foreground`，指针位于其上方时使用 `active`。
- `dictionaryErrorForeground` 和 `dictionaryWarningForeground` 用于设置[词典的检查](../guide/guides/dictionary.md#what-each-check-finds)所发现的错误或警告的颜色：ERD 画布上被标出的名称（参见[画布上的标记](../guide/guides/dictionary.md#marks-on-the-canvas)）、`Domains`、`Words` 和 `Terms` 工作表中被标出的单元格的文本，以及 `Checks` 的计数。`dictionaryErrorBackground` 和 `dictionaryWarningBackground` 用于填充这样的单元格。`dictionaryErrorForeground` 还用于设置指针下方的 `Delete Rows` 工具的颜色。
- `dictionaryBackground`、`dictionaryHeaderBackground`、`dictionaryGridLine` 和 `dictionaryHeaderSelect` 用于设置 [Dictionary](../guide/guides/dictionary.md#the-sheets) 标签页中工作表的颜色，依次为：单元格，它同时也填充该标签页的搜索输入框和术语的域列表；列标题和行号；单元格之间的线条，它同时也用于绘制该标签页的顶部栏以及其中各输入框的边框；以及所在行或列与选中范围相交的标题。工作表的其余部分使用共用的 token：标题文字使用 `foreground`，单元格文本使用 `active`，把列标题和行号与单元格分隔开的线条使用 `grayColor7`，活动单元格的边缘使用 `focus`，选中区域的边缘使用 `accentColor9`，其填充则使用 20% 不透明度的 `accentColor9`，整行或整列被选中时的标题使用 `accentColor6`，只读单元格使用 `grayColor3`，此外还使用滚动条的 token。`accentColor9` 不是以 `#rgb` 或 `#rrggbb` 形式写出时，选中区域不会被填充。

#### CSS Variables

`Theme` 中的每个 token 都有对应的 CSS 钩子，其名称为 `--erd-editor-` 加上 kebab-case 形式的键名：`grayColor10` 对应 `--erd-editor-gray-color-10`，`keyPK` 对应 `--erd-editor-key-pk`，`keyPFK` 对应 `--erd-editor-key-pfk`。  
这些钩子会继承到编辑器内部，因此可以在任何希望其生效的位置设置。设置在 `:root` 上会作用于页面中的所有编辑器，设置在元素本身上则只作用于该编辑器。

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

从 `3.4.0` 起，拼写有误的 `dargSelect` token 更正为 `dragSelect`，其钩子也从 `--erd-editor-darg-select-background` 和 `--erd-editor-darg-select-border` 变为 `--erd-editor-drag-select-background` 和 `--erd-editor-drag-select-border`。仍在使用旧名称的样式表会被忽略。

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

从 `4.0.0` 起，编辑器自身的文本（菜单、面板、对话框、快速搜索、提示，以及它在图上绘制的文字，例如 `unnamed`，导出的图片也包括在内）提供 25 种语言。表名和列名、SQL、数据类型以及生成的代码永远不会被翻译。参见[语言与主题](../guide/guides/language-and-theme.md)。  
在调用 [setLocale](#setlocale) 或选择语言之前，编辑器显示英语；[enableLocalePicker](#enablelocalepicker) 开启期间则跟随 `'system'`。  
编辑器会在封闭的 shadow root 内部自身的根元素上设置 `lang` 和 `dir`，从不设置在宿主元素或页面上，因此从右到左的页面不会翻转编辑器，从右到左的语言也不会翻转页面。希伯来语、阿拉伯语和波斯语会让编辑器的界面从右到左排布，图本身则永远不会镜像。从 `4.1.0` 起，[资源管理器](../guide/guides/explorer.md)在每种语言中都位于画布左侧，在这三种语言中其自身的各行从右到左阅读。  
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
从 `4.2.0` 起，替换还会保留文档的词根、术语和域（文本无法容纳它们），连同每个词典工作表的 Undo 历史记录，对该导入的 Undo 或 Redo 也会保留它们。以替换方式调用的 [setSchemaJSON](#setschemajson) 以及为 `value` 赋值，则会改为采用其文档所含的词根、术语和域。  
会记录到 Undo 历史记录中，因此可以 `Undo, Redo`，并且会发出 `change`。空字符串会被忽略，在 `readonly` 生效期间调用不会有任何效果。  
`setSchemaGraphQL`、`setSchemaDBML` 和 `setSchemaAML` 的行为相同，它们的解析器不会失败，无法读取的文本只会加载空白文档，而不会报错。  
从 `4.0.0` 起，这四个方法都接受可选的第二个参数 `{ placement, mode }`：

- `placement: 'grid'` 为默认值，会与以前一样立即将表逐行排列，调用不返回任何值。
- `placement: 'auto'` 会像编辑器中的 `Import` 那样，先按关系排布这些表，并返回一个 `Promise`，该 `Promise` 会在导入作为一步 Undo 落下之后 resolve。表少于两个、没有关系、布局失败、页面没有 `SharedWorker`，或在 `Placing tables` 提示上按下 `Cancel` 时，会改为逐行排列。在此期间发生的加载（另一个替换式导入、为 `value` 赋值、`setInitialValue()`、`clear()`、协作者的加载，或对某次加载或 `clear()` 的 Undo 或 Redo）会取代它，此时 `Promise` 会 resolve，且不加载任何内容。以这种方式排布的多个导入，会按开始的顺序落下。
- `mode: 'replace'` 为默认值，会替换文档。`mode: 'append'` 会像 [Import and Add](../guide/guides/file-import-export.md#import-and-add) 那样把文件添加到图的下方，图中已有的每个表都保持原样，除标签页和视图位置之外的所有设置也保持原样。在其他标签页中调用时，会先切换到 ERD 标签页。新的表，以及表分组处于显示状态时 DBML 文件带来的表分组，会成为选中对象；除非它们已经显示得足够清楚，否则视图会滚动到它们，这遵循从 `4.1.0` 起所有跳转共用的规则，参见[跳转的落点](../guide/guides/table-related-functions.md#where-a-jump-lands)。一次 Undo 即可撤回整个添加。无法读取的文本不会添加任何内容，文档保持原样。

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
在默认的 `mode: 'replace'` 下，它会像为 `value` 赋值那样加载文档：记录到 Undo 历史记录中，发出 `change`，以相同的方式采用文档的锁定，并且从 `4.2.0` 起用文档中的词根、术语和域取代编辑器中的词根、术语和域。与 `value` 不同，空字符串或非字符串的值会被忽略，而不是开始一个新文档。不是 JSON 的文本会清空文档，与 `value` 相同。  
`mode: 'append'` 会以新的 id 把文档中的表、关系、索引、备注和表分组添加到图的下方，保持它们彼此之间的相对位置，并略去文档的设置，与 [Import and Add](../guide/guides/file-import-export.md#import-and-add) 对 `json` 文件的处理相同。从 `4.2.0` 起，它会保留表和列的逻辑名以及标明名称是否由词典生成的标记，但不会带入文档的词根、术语和域，因此其中的列都不会关联任何域。无法读取的文本，或既没有表也没有备注的文档，不会添加任何内容。否则，它会像 [setSchemaSQL](#setschemasql) 的追加那样落下，其中新的备注和表分组会与表一同成为选中对象，二者各自仅在处于显示状态时才会被选中。  
它会在文档落下之后返回，并且在 `readonly` 生效期间会被忽略。

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL

将当前编辑器状态导出为 Schema SQL。  
若未指定 `databaseVendor`，则按编辑器所显示的数据库写出：即文档的数据库，除非[只读](#readonly)编辑器的阅读者选了另一个，该选择从 `5.0.0` 起只保留在那个屏幕上，也是其 Schema SQL 标签页所显示的。不在下面列表中的名称也按相同方式处理，不会报错。  
名称会使用编辑器所显示的括号类型加引号。`Bracket Type` [锁定](../guide/guides/settings.md#锁定)期间，或者从 `5.0.0` 起在阅读者选了另一种括号类型的只读编辑器中，它可能与 `value` 保存的括号类型不同，而编码智能体的 [`erd_read`](../mcp/tools.md#reading-a-document) 使用的是后者。写出的名称始终是物理名，无论名称显示如何。  
从 `4.0.0` 起，可选的 `options` 参数会像 [Schema SQL](../guide/guides/schema-sql.md) 标签页的选项那样，选择语句和头部，从 `4.2.0` 起还可以选择是否用逻辑名填充空注释。`SchemaSQLOptions` 作为类型导出。

- `statements`：`'create'` 为默认值；`'ifNotExists'` 会在 MySQL、MariaDB、PostgreSQL、SQLite 和 Databricks 上写出 `IF NOT EXISTS`，在其他数据库上退回为 `'create'`；`'recreate'` 会先删除表再创建，Snowflake 则改为写出 `CREATE OR REPLACE TABLE`。
- `header`：`'none'` 为默认值；`'use'` 会切换到文档的数据库或 schema；`'createAndUse'` 会在其不存在时先创建，再切换到它。数据库不具备所请求的头部时，会像该标签页那样退回：Oracle 对 `'createAndUse'` 写出 `'use'`，PostgreSQL 对 `'use'` 不写出头部，SQLite 不写出任何头部。只有当文档的数据库名是普通标识符（由 ASCII 字母、数字和 `_` 组成，且不以数字开头）时，才会写出头部。
- `logicalNameAsComment`（从 `4.2.0` 起）：`true` 会在表或列自身的注释为空或只含空白、而其逻辑名不为空时，把逻辑名作为注释写出，写法与该数据库写出注释的形式相同。含有文本的注释照旧写出。只有 `true` 才会开启它：省略、`false` 或其他任何值（例如 `'true'` 或 `1`）都不会写出逻辑名。它的作用与该标签页的 [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) 开关相同。

省略的选项或值未知的选项会按其默认值读取，因此不带选项的调用会与以前一样，写出普通的 `CREATE` 语句且不带头部。  
从 `4.0.0` 起，输出总会包含文档的 `Before tables` 和 `After tables` 脚本，顺序为：头部、前置脚本、删除语句、表、后置脚本。Schema SQL 标签页自身的 `Statements`、`Header`、`Write logical names into empty comments` 和 `Tables` 选择永远不会影响该调用，它总是写出整个文档。  
从 `3.10.0` 起，每个外键都会带上关系的 `ON DELETE` 和 `ON UPDATE` 子句。只有在设置了操作且该厂商支持时才会写出子句，因此该厂商不支持的操作会被省略，并由其默认行为决定。从 `4.0.0` 起，Snowflake 只接受 `NO ACTION`。各数据库写出的内容参见 [ON DELETE 与 ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)。  
从 `3.10.0` 起，表注释或列注释中的单引号会被转义，因此 `it's` 这样的注释不会再破坏语句。所有以字符串字面量写出注释的厂商都会将单引号双写，Databricks 除外，它会在每个单引号和每个反斜杠前加上反斜杠。SQLite 仍以 `--` 行写出注释。  
从 `4.2.0` 起，SQL Server 会把每条注释写为带 N 前缀的 Unicode 字面量 `N'…'`，因此数据库代码页之外的文本（例如韩文）得以保留。Oracle 会把注释中每一段连续的空行写为一个换行，SQLite 则会把注释中的换行写为空格，使注释保持在其 `--` 行上。参见[注释](../guide/guides/schema-sql.md#comments)。  
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

返回用于实时协同编辑的 store。  
`config` 为 `{ getNickname?, mouseTracker?, focusTracker? }`。两个 tracker 的默认值均为 `true`：`mouseTracker` 会把当前编辑器的鼠标光标广播给其他编辑器，`focusTracker` 会广播它获得焦点的单元格、选中状态和选择框。  
从 `5.0.0` 起，设置了 [readonly](#readonly) 期间，该 store 不发出任何更改，只发出它的 tracker 发出的内容和加入的编辑器所请求的寄存器，并且仍会应用其他编辑器发来的内容。  
参见[协同编辑](./advanced/collaborative-editing.md)。

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue

打开 Diff Viewer，将当前打开的文档与传入的文档进行比较。  
它没有返回值，也不会修改文档，因此关闭该查看器后编辑器与之前完全相同。  
空值或非字符串的值会与空白文档进行比较。  
它与画布右键菜单中的 [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) 是同一个视图。  
从 `4.1.0` 起，它首先按 id 为两个文档中的内容配对，然后才按各自保留下来的内容配对，例如表的名称或备注的文本，参见[比较的内容](../guide/guides/table-related-functions.md#what-is-compared)。因此，与同一文档的较早版本（例如其文件的某个 Git 修订版本）比较时，重命名会显示为一个已重命名的项；与 id 不同的文档比较时，则会显示为一次删除和一次添加。该查看器会在两个文档旁边以树的形式列出变更内容，并以颜色标记变更，而不是填充单元格。  
从 `4.2.0` 起，两个文档都会以该编辑器当前的名称显示打开，无论传入的文档保存的是哪一种，树也按该名称显示来称呼表和列，参见[画布之外](../guide/guides/logical-names.md#beyond-the-canvas)。逻辑名、域关联和词典不参与比较，因此只对它们做出的更改不会显示为任何变更。

```js
editor.setDiffValue('prev json...');
```
