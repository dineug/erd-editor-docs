---
sidebar_position: 3
description: erd-viewer 元素的 API：根据 value 或 src URL 显示只读的图、小地图与控制栏、load 与 error 事件、主题、显示语言、焦点与按键、加载，以及它给页面带来了什么。
---

# ErdViewerElement

从 `5.0.0` 起，该包还提供 `<erd-viewer>`，一个文档的只读视图：阅读者可以平移、缩放、搜索并点亮关系，但无法在其中编辑任何内容。它只绘制 ERD 画布，带有滚动条、[小地图](#minimap)、[控制栏](#controls)和一个搜索文档的命令面板，没有工具栏、标签页、资源管理器或右键菜单。

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

上面的框架就是 erd-editor.io/embed 所显示的这个元素，这里用的是 bookstore 示例：点击它以获得焦点，然后用[焦点与按键](#focus-and-keys)中的按键缩放和搜索；要无需代码地嵌入你自己的文档，参见[嵌入](../guide/guides/embedding.md)。

查看器是一个普通的 `HTMLElement`。  
其类型定义如下。

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

导入 `@dineug/erd-editor/erd-viewer.js` 会定义 `<erd-viewer>`，而 `<erd-editor>` 仍未定义。导入包的根入口则两者都不定义：它导出类 `ErdViewerElement` 和 `defineErdViewer()`，后者在你调用的位置定义该标签，因此页面也可以用自己的标签来定义这个类，参见[注册元素](./installation.md#registering-the-elements)。  
除 `engine.js` 与 `peer.js` 之外的每个入口都需要 DOM，这个入口也不例外，因此服务端渲染的页面应在客户端导入它，参见[服务端渲染](./installation.md#服务端渲染)。  
导入该入口会把 `erd-viewer` 加入 `HTMLElementTagNameMap`，因此 `document.createElement('erd-viewer')` 和 `document.querySelector('erd-viewer')` 无需类型断言就是 `ErdViewerElement` 类型。

与编辑器一样，查看器渲染在一个封闭的 shadow root 中，因此 `viewer.shadowRoot` 为 `null`，页面样式不会渗入或渗出；请通过 [setTheme](#settheme) 和 `--erd-editor-*` 自定义属性来设置它的样式。同一页面上的多个查看器各自保持自己的文档、视图、主题和语言。  
`<erd-viewer>` 没有固有尺寸。自定义元素默认是行内的，因此请像上面那样为它指定 `display: block` 和高度。视图会填满元素的盒子，并在元素调整大小时跟随，同时保持其缩放。

`src`、`name-view`、`minimap` 和 `controls` 是它仅有的属性，每个属性都有同名的 property，`name-view` 对应的是 `nameView`。[value](#value) 只有 property。  
在其标签被定义之前就设置到元素上的 `value`、`src`、`nameView`、`minimap` 或 `controls`（例如由框架在入口加载完成之前就渲染了该元素），会在标签被定义之后生效，并覆盖标记中给出的属性。它们按页面第一次写入各自的顺序生效，因此 `value` 与 `src` 中靠后的一个生效。此时不含文档的 `value` 已经没有可以抛出错误的调用方：它会作为未捕获的错误上报，而查看器保持为空。

script 标签构建 `dist/erd-viewer.umd.js` 只包含查看器及其全部依赖。它会定义 `<erd-viewer>`，并把 `ErdViewerElement` 和 `defineErdViewer` 放到 `window.ErdViewer` 上。不带路径的 CDN URL 提供的是编辑器的构建，所以请写明文件，参见 [script 标签](./installation.md#script-标签)。

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

供查看器获取并显示的文档的 URL。默认值为 `''`，即没有。  
获取使用的是普通的 `fetch()`，即不带任何自有选项的 `GET`，因此受浏览器的 CORS 规则约束：位于其他源的文档需要一个允许该页面所在源的服务器，而 cookie 只会发往页面自己的源。相对 URL 会相对于页面解析。  
响应必须包含 `.erd.json` 文件那样的文档，即编辑器的 [value](./erd-editor-element.md#value) 以及所有官方宿主所写入的存储形式。不读取其他格式：SQL、GraphQL、DBML 或 AML 文件会因为是无法解析的文本而失败。  
能够解析的文档会被适配到视图并发出 [load](#load)。被网络或 CORS 拒绝的请求、不是 `ok` 的响应，或无法解析的文本，会发出 [error](#error) 并留下一个空的图，参见[加载](#loading)。

只有最新的请求有效。新的 `src` 会中止仍在进行的获取，因此较慢的响应永远不会覆盖后来的文档。为 [value](#value) 赋值也会中止它，移除 `src` 或将其设为 `''` 也一样，这会停止跟随它，并让所显示的文档保持原样。  
`value` 与 `src` 中最后设置的一个生效，无论通过 property 还是 attribute。写在 `value` 之后的 `src`，即使它指向之前已获取过的 URL，也会被获取。在已经显示的文档上再次写入同一个 `src`，则不会获取任何内容。  
查看器只在位于页面中时才会获取。把它从页面中取出会中止仍在进行的获取，放回时会获取尚未显示的 `src`（包括之前失败的），而不会获取已经显示的。  
`src` 是该包发出的唯一一次 `fetch()`，因此严格的内容安全策略需要把文档所在的源列入 `connect-src`。

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

以 JSON 字符串形式取得所显示的文档，无论它来自 `src` 还是 `value`，格式为编辑器的 [value](./erd-editor-element.md#value) 所写出的存储形式。在显示任何内容之前，它是一个新的空文档，其 `doc` 为 `{}`。  
当文档的 `Viewport` [锁定](../guide/guides/settings.md#锁定)处于开启状态（新文档就是如此）时，它写出的是文档锁定的缩放和滚动，无论阅读者把视图移到了哪里。只有该锁定关闭时，它才写出视图所在的位置，包括载入文档时所做的适配。  
它写出的是文档所持有的名称显示，绝不是 [nameView](#nameview) 或控制栏叠加其上显示的那一种，即使文档的 `Name View` 锁定处于关闭状态也是如此。  
在 [destroy](#destroy) 之后它仍会返回该文档。

```js
const data = viewer.value;
```

### setter {#setter}

根据文本显示一个文档，替换当前显示的文档，并将其适配到视图，参见[加载](#loading)。它接受文件或编辑器的 `value` 所包含的文本。  
无法解析的文本会在任何内容改变之前抛出错误，所显示的文档保持不变：不是 JSON 的文本抛出 `SyntaxError`，不包含文档的 JSON（例如 `7`）抛出 `TypeError`。空字符串或任何不是字符串的值会显示一个空的图。  
赋值会中止仍在进行的 `src` 获取，并且既不发出 `load` 也不发出 `error`。

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

在文档所持有的[名称显示](../guide/guides/logical-names.md#name-view)之上，以另一种名称显示来显示图：`'physical'` 对应 `Physical Names`，`'logical'` 对应 `Logical Names`，`'both'` 对应 `Both Names`。默认值 `null` 显示文档自己的名称显示，三者之外的 attribute 值会被读作 `null`。  
它对此后加载的每个文档都保持生效，而 [value](#value) 永远不会写出它。移除该 attribute 会回到文档自己的显示。  
[控制栏](#controls)上的 `Name View` 列表也会切换显示，直到下一个文档载入或 `nameView` 再次改变为止。在那里的切换同样不会写入 `value`。

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

当文档包含表、显示的备注或显示的表分组时，在右上角显示小地图。默认开启。  
它的工作方式与编辑器的小地图相同：点击它可以把视图移到那里，或拖动其视口矩形来平移，参见[浏览画布](../guide/guides/table-related-functions.md#getting-around-the-canvas)。在查看器获得焦点之前，手指在它上面的操作属于页面。  
只有 `minimap="false"` 会将其关闭。仅写属性名、任何其他值，以及没有该 attribute，都会让它保持开启。

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

在画布底边中间显示控制栏。默认开启，从左到右包含：

- 缩放：`Zoom out`、以百分比表示的当前缩放，以及 `Zoom in`。两个按钮与缩放按键一样逐级调整缩放，点击百分比（`Reset zoom`）会把它恢复为 `100%`。每个按钮都在提示中标出其按键。
- `Fit`，它会缩放并滚动，使整个图显示在视图中并居中。
- `Name View`，一个显示当前显示方式的按钮，会在控制栏上方打开由 `Physical Names`、`Logical Names` 和 `Both Names` 组成的列表，参见 [nameView](#nameview)。
- `Go to content` 指南针，只有当图的任何部分都不在屏幕上时才会加入控制栏的末端，并把视图带到图中最近的部分。

控制栏在所有语言中都从左到右排列。  
只有 `controls="false"` 会将其关闭，其指南针和 `Name View` 列表也随之关闭。仅写属性名、任何其他值，以及没有该 attribute，都会让它保持开启。没有控制栏时，一旦查看器获得焦点，滚轮、捏合和按键仍然可以缩放。

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## 事件 {#event}

`load` 和 `error` 是仅有的两个事件，都报告 `src` 的情况。两者都不冒泡，因此请在元素本身上监听。

### load {#load}

在 `src` 所指的文档被获取并显示之后发出。`event.detail` 为 `null`。  
为 `value` 赋值不会发出它，被后来的 `src`、`value`、把元素从页面取出或 [destroy](#destroy) 中止的获取也不会。

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

获取 `src` 失败时发出：网络或 CORS 拒绝了请求、响应不是 `ok`，或其文本无法解析。查看器随后会显示一个空的图和 `Couldn't load the diagram` 提示，参见[加载](#loading)。  
`event.detail` 是原因：`fetch()` 拒绝时的 `TypeError`、指明状态的 `Error`（例如 `GET /missing.erd.json answered 404 Not Found`），或解析器的 `SyntaxError` 或 `TypeError`。  
被其他操作中止的获取不会发出任何内容。

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

设置预设主题，接受编辑器的 `ThemeOptions`，参见 [setPresetTheme](./erd-editor-element.md#setpresettheme)。  
查看器以 `appearance: 'system'`、`grayColor: 'slate'` 和 `accentColor: 'indigo'` 开始，因此从第一帧起它就显示操作系统所报告的浅色或深色，并在其改变时切换。编辑器则以深色开始。  
每个字段都单独应用，因此部分调用会让另外两个保持不变。不是这些名称之一的值会被忽略，调用也永远不会抛出错误。  
查看器没有主题构建器，也没有 `systemDarkMode`，并且不会为主题发出任何事件。

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

指定 `'system'` 外观所显示的浅色或深色，供自带浅色和深色的页面使用。指定期间，操作系统的变化会被忽略。  
`null`，或除 `'dark'` 与 `'light'` 之外的任何值，会回到跟随操作系统。  
当外观为 `'light'` 或 `'dark'` 时，它不会改变屏幕上的任何内容，但该值会被保留，并在外观变为 `'system'` 时立即生效。它不发出任何内容。

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

在预设之上覆盖主题 token，接受编辑器的 `Theme` token，参见 [setTheme](./erd-editor-element.md#settheme)。  
每次调用都会替换整个覆盖层，因此传入 `{}` 可以回到预设。只保留 token 名称及其字符串值，之后的 `setPresetTheme` 会替换下面的预设，而覆盖仍然保留。  
`--erd-editor-*` CSS 自定义属性也会作用于查看器，设置在元素上或其上方的任何位置均可，参见 [CSS Variables](./erd-editor-element.md#css-variables)。画布不受任何样式表影响，因此当页面 `head` 中的样式表发生变化，或者该元素或其上方某个元素的 `class` 或 `style` 属性发生变化时，它会重新读取这些属性。用 `insertRule()` 添加的规则不会引起其中任何一种变化，所以画布要到下一次这样的变化时才会采用它。

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

设置显示语言：`'system'`（默认值），或编辑器的 [Display Language](./erd-editor-element.md#display-language) 所列出的 25 个代码之一。其他任何值（例如单独的 `'ko'` 或不是字符串的值）都会被忽略。  
语言会改变控制栏的提示、`Name View` 列表、命令面板、加载提示，以及图自己绘制的文字（例如 `unnamed`）。名称、注释和文档的其余部分永远不会被翻译。

英语是查看器入口的一部分，在调用返回之前就已生效。其他每种语言都是独立的模块，由你的打包器作为 chunk 输出在查看器旁边，并在页面第一次请求该语言时由查看器从你的构建中获取，页面中的所有查看器只获取一次。在它到达之前，查看器会继续显示原来的语言，第一帧则是英语。如果加载失败，查看器显示英语，再次请求该语言会重试。  
[script 标签](./installation.md#script-标签)构建包含全部 25 种语言，因此不会获取任何语言。同时包含编辑器的构建会随编辑器的 chunk 一起加载每种语言，参见[注册元素](./installation.md#registering-the-elements)。  
它返回的 `Promise` 在该语言到达或加载失败之后解析，并且永远不会拒绝。此后生效的是该语言，或失败后的英语，除非后来的调用请求了另一种：无论各语言以什么顺序到达，都以后来的调用为准。

希伯来语、阿拉伯语和波斯语会让命令面板和加载提示从右到左排布。画布、小地图、滚动条以及带有指南针的控制栏仍然从左到右，与编辑器的画布相同，参见[从右到左书写的语言](../guide/guides/language-and-theme.md#right-to-left-languages)。  
查看器把 `lang` 和 `dir` 设置在封闭 shadow root 内部它自己的根上，绝不设置在宿主元素或页面上。  
它不发出任何内容，查看器也没有语言选择器，并且不存储任何内容。

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

以 BCP 47 标签指定 `'system'` 所代表的语言，供有自己语言设置的页面使用。  
标签会被去除首尾空白。`null`、空白字符串或不是字符串的值会回到页面的语言。  
页面的语言依次是页面的 `<html lang>`，然后是浏览器的 `navigator.languages`，在查看器首次连接时读取一次。`'system'` 取其中查看器有对应语言的第一个，规则与编辑器的 [setSystemLocale](./erd-editor-element.md#setsystemlocale) 相同，一个都没有时则取英语。因此，`<html lang>` 指定了查看器所具备语言的页面，无论浏览器偏好什么，都会显示该语言，而之后 `lang` 或浏览器语言的变化不会移动任何查看器。  
它只在生效的选项为 `'system'` 时才有意义，其 `Promise` 的解析方式与 [setLocale](#setlocale) 的相同。

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

永久结束查看器。它会在返回之前拆除视图，无论元素仍在页面中还是已被先取出，中止仍在进行的 `src` 获取，并停止跟随操作系统的配色方案和页面的样式。  
被销毁的查看器不再绘制任何内容，不再获取任何内容，也不再请求语言，即使再次加入页面也是如此。读取 [value](#value) 仍会返回它所持有的文档。  
把元素从页面取出并不会销毁它：放回后它会继续工作，并获取尚未显示的 `src`，参见[加载](#loading)。

```js
viewer.destroy();
```

## 焦点与按键 {#focus-and-keys}

查看器在挂载、文档载入或命令面板关闭时都不会获得焦点，因此它永远不会把页面滚动到自己这里，也不会占用页面的按键。  
在其画布上点击或轻触会让它获得焦点而不滚动页面，它是 `Tab` 键的一个停靠点。与编辑器不同，它没有自己的 `focus()` 或 `blur()` 成员。在页面上的其他任何位置按下会再次让它失去焦点。

在查看器获得焦点之前，滚轮（会滚动页面）和触控板捏合都由页面处理。手指在画布上的操作会滚动页面而不平移任何内容，所有按键也都会不被阻止地交给页面。  
一旦它获得焦点：

- 滚轮平移视图，`Shift + Wheel` 横向平移。在文字溢出的备注上，滚轮会滚动该备注。
- `Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac)、触控板捏合，或触摸屏上的双指操作会缩放。
- 手指平移视图。
- `Ctrl + Plus` 和 `Ctrl + Minus` (Windows/Linux) 或 `⌘ + Plus` 和 `⌘ + Minus` (Mac) 与 `Zoom in` 和 `Zoom out` 按钮一样逐级调整缩放，`Ctrl + 0` (Windows/Linux) 或 `⌘ + 0` (Mac) 则直接回到 `100%`，并让屏幕中间保持在原处。
- `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 打开命令面板，`Esc` 关闭它。

这些是它仅有的按键，且无法重新绑定。其他每个按键，无论是否获得焦点，都会不被阻止地交给页面：`Delete`、`Backspace`、`Space`、`Enter`、`Tab`、`Ctrl + A`、`Ctrl + F`，以及在编辑器中会编辑的每个组合键。

命令面板只搜索文档，不列出任何命令。它的空输入框显示各前缀：`#` 搜索表，`@` 搜索列，`:` 搜索注释和备注，`?` 列出各前缀，与编辑器相同，参见[搜索图](../guide/guides/quick-search.md#searching-the-diagram)。不带前缀的词会在搜索图中该词的各行上方显示 `No commands match`。  
选择某一行会按编辑器的规则[跳转的落点](../guide/guides/table-related-functions.md#where-a-jump-lands)移动视图，保持缩放不变，并将其所到达的对象绘制轮廓并置于最前：表、包含该列或注释的表，或备注。  
选择某一行或按 `Esc` 会关闭命令面板，并让焦点不在任何元素上，因此下一次滚轮会滚动页面；点击视图可以再次给它滚轮和按键。命令面板打开期间，滚轮滚动它的列表，缩放按键不起作用。

无论是否获得焦点，用鼠标主键拖动都会从画布的任何位置平移视图，在表上也是如此。不移动的点击或轻触会点亮关系：点在表上，点亮该表的关系；点在关系线上，点亮那条线；点在其他任何位置（包括备注），则将点亮熄灭。这样的点击还会清除命令面板跳转留下的轮廓。指针停在表上期间，会点亮该表的关系。  
按下不会选中、移动或编辑任何内容。除了跳转的轮廓之外没有选中，没有选择框，双击或 `Enter` 也不会打开任何单元格。

## 加载 {#loading}

`src` 加载期间，画布中间上方的提示会在旋转的加载图标旁显示 `Loading diagram`。一旦加载失败，它会在警告标志旁显示 `Couldn't load the diagram`，直到新的 `src` 或 `value` 取代它，或 `src` 被移除。按下的操作会穿过提示到达画布，提示以显示语言书写，在从右到左的语言中则从右到左排布。

每个载入的文档，无论来自 `src` 还是 `value`，都会被适配到查看器的盒子：缩放并滚动到整个图都显示出来并居中，与 `Fit` 相同，文件所保存的缩放和滚动则被搁置一旁。在查看器有尺寸之前交给它的文档（在它位于页面中之前设置，或在其盒子为空时设置）会在有尺寸之后再适配。之后的调整大小会保持缩放；`Fit` 会再次适配。

查看器只在位于页面中时才获取 `src`。把它取出会中止仍在进行的获取，放回时会获取尚未显示的 `src`（包括失败的），而不会获取已经显示的。不再需要的查看器请用 [destroy](#destroy) 结束。

## 它给页面带来了什么 {#what-it-adds-to-a-page}

- 没有 worker。它不启动任何 worker，因此内容安全策略无需为它设置 `worker-src`。
- 没有存储。它不写入 cookie、`localStorage`、`sessionStorage` 或 IndexedDB。
- 两种请求：[src](#src) 的获取（严格的策略要在 `connect-src` 中列出其源），以及英语之外的显示语言的模块（来自你自己的构建），参见 [setLocale](#setlocale)。
- 样式位于构造样式表中，严格的 `style-src` 允许这种方式。不支持构造样式表的浏览器（例如 101 之前的 Firefox）会改用 `<style>` 元素，这需要 `style-src 'unsafe-inline'`。
- `window` 上的监听器。导入该入口会在页面的整个生命周期内添加三个监听器，分别用于 `mousedown`、`touchstart` 和该包自己的 `@dineug/erd-editor/internal-forward-move-start` 事件。绘制画布的 Konva 会设置 `window.Konva`，并在其第一个 stage 创建时向 `window` 添加鼠标和触摸监听器，向 `document` 添加 `visibilitychange` 监听器，且永远不会移除它们。编辑器的入口会添加同样的监听器。
- 在 [destroy](#destroy) 之前，每个查看器都会跟随操作系统的配色方案，并监视页面样式中 [setTheme](#settheme) 所描述的自定义属性。
