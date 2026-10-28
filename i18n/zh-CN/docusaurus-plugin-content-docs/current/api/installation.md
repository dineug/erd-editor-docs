---
sidebar_position: 1
description: 从 npm 或 CDN 安装 @dineug/erd-editor，注册编辑器与查看器元素，接管文件对话框，以及从 4.x 或 3.x 升级。
---

# 安装

```sh
npm install @dineug/erd-editor
```

该包仅支持 ESM（`"type": "module"`），并且只发布 `dist` 目录。
没有 CommonJS 构建，因此 `require('@dineug/erd-editor')` 无法使用。

它包含两个自定义元素：编辑器 `<erd-editor>`，以及从 `5.0.0` 起提供的、以只读方式显示图的 `<erd-viewer>`，参见 [ErdViewerElement](./erd-viewer-element.md)。
从 `5.0.0` 起，导入包的根入口不会定义其中任何一个。每个元素都有各自的入口来定义它，参见[注册元素](#registering-the-elements)。

运行时依赖都以裸模块导入的形式留在外部，交由你的打包器解析、去重和 tree-shaking。从 `5.0.0` 起，其 `dist` 中每个模块一个文件，因此打包器只保留页面用到的模块，参见[入口点](#入口点)。
其中的 shared worker 会作为独立的入口文件输出到 `dist/workers/` 下，并通过 `new URL('./…', import.meta.url)` 构造——这正是 Vite、webpack 5 和 Rspack 识别为 worker 入口的写法。参见 [Web Worker](#web-workers)。
对于没有打包器的页面，还提供了两份自包含的构建，参见 [script 标签](#script-标签)。

## 使用

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` 在被导入时就会定义 `<erd-editor>`。只显示图的页面应改为导入 `@dineug/erd-editor/erd-viewer.js`，参见 [ErdViewerElement](./erd-viewer-element.md)。

`<erd-editor>` 没有固有尺寸。请为该元素或其容器显式指定宽度和高度。
从 `4.1.0` 起，已打开的[资源管理器](../guide/guides/explorer.md)会停靠在该元素内部、ERD 画布的左侧，让画布变窄，而不是覆盖在画布上。新打开的编辑器中，资源管理器初始为关闭状态。
面板最窄绘制为 `200px`，并为画布保留至少 `320px` 的宽度，因此在宽度小于 `520px` 的元素中，已打开的资源管理器在元素变宽之前不会绘制。参见[画布旁边](../guide/guides/explorer.md#beside-the-canvas)。

`setInitialValue('')` 会以一个新的空文档开始。为 `value` 赋值则会把加载当作一次编辑，因此会记录到 Undo 历史记录中。
从 `4.0.0` 起，`editor.value` 是文件所保存形式的文档，也就是应当存储的内容。`editor.runtimeValue` 是编辑器所持有形式的文档，其中包括已删除的实体：它用作协作者的初始文档，从不写入文件。参见 [runtimeValue](./erd-editor-element.md#runtimevalue)。
从 `4.0.0` 起，新文档的所有[设置锁定](../guide/guides/settings.md#锁定)也都处于开启状态：包括视口、标签页、Code Generator 的语言、两种名称大小写、括号类型，以及从 `4.2.0` 起的[名称显示](../guide/guides/logical-names.md#name-view)。滚动、缩放、切换标签页、切换名称显示或更改其他任何一项设置都不会改变 `editor.value`，也不会发出 `change`。从文本加载的文档会沿用其中写明的锁定。一个锁定都没有写明的文档（例如 `4.0.0` 之前保存的任何文件）打开时所有锁定都处于开启状态，缩放为 100%，并停留在 ERD 标签页，无论它保存的是怎样的视口和标签页。其视口锁定在原点 `0, 0`；如果图的任何部分都没有绘制在那里，视图则改为在图所在的位置打开。参见 [setInitialValue](./erd-editor-element.md#setinitialvalue)。
`4.2.0` 之前保存的文件打开时，名称显示锁定为 `Physical Names`，即使其他所有锁定都已关闭也是如此。`4.0.0` 或 `4.1.0` 的编辑器保存时会原样保留名称显示的锁定，但会丢弃显示方式，因此以名称显示未锁定状态保存的 `4.2.0` 文件仍保持未锁定，但重新打开时显示为 `Physical Names`。
其余 API 参见 [ErdEditorElement](./erd-editor-element.md)。

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` 会替你解析该包的外部依赖，因此无需打包器也能工作。
每个入口通过版本号之后的路径访问：`…/erd-editor.js` 定义编辑器，`…/erd-viewer.js` 定义查看器；查看器在页面请求英语以外的显示语言时，会从 CDN 获取该语言。仅含包名的 URL `https://esm.run/@dineug/erd-editor@5.0.0` 提供的是根入口，它不定义任何元素。
不带版本号的 URL 始终提供最新的发布版本。如果不希望大版本升级在毫无预告的情况下进入页面，请像上面那样固定版本。
`5.0.0` 本身就是一次大版本升级：需要停留在 4.x 的页面应固定为 `@4.2.0`，参见[从 4.x 升级](#upgrading-from-4x)。

`esm.run` 从 `cdn.jsdelivr.net` 提供 shared worker，而浏览器不会从与页面不同的源启动 shared worker。因此以这种方式加载的编辑器在没有 worker 的情况下运行，与在阻止 worker 的宿主上一样，参见 [Web Worker](#web-workers)。[script 标签](#script-标签)构建则把它们装在文件内部。

### script 标签

从 `3.6.0` 起，该包还会发布一份 UMD 构建，把所有依赖和所有 shared worker 都装进同一个文件 `dist/erd-editor.umd.js`。
`unpkg` 与 `jsdelivr` 字段指向的就是它，因此这两个 CDN 上仅含包名的 URL 提供的都是这个文件，它会定义 `window.ErdEditor`。

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

加载它会定义 `<erd-editor>`。`window.ErdEditor` 上带有两个文件回调 `ErdEditor.setExportFileCallback` 与 `ErdEditor.setImportFileCallback`，从 `3.9.2` 起提供的 `ErdEditor.createKeyBindingMap`，从 `4.2.0` 起提供的 `ErdEditor.dictionaryRowChords`（参见 [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)），以及从 `5.0.0` 起提供的 `ErdEditor.ErdEditorElement` 与 `ErdEditor.defineErdEditor`（参见[注册元素](#registering-the-elements)）。它不带 [toImage](./to-image.md)。

从 `5.0.0` 起，第二个文件 `dist/erd-viewer.umd.js` 会定义 `<erd-viewer>`，并把 `ErdViewerElement` 与 `defineErdViewer` 放到 `window.ErdViewer` 上。它不启动任何 worker，包含全部 25 种显示语言，除了所给的 `src` 之外不发出任何请求。

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

两个文件都不会定义对方的标签，各自除了自己的全局变量和 `window.Konva` 之外，不在页面上留下任何全局变量。
exports 映射仍然指向 ES 模块，因此从 npm 安装时打包器不会用到这两个文件。
无法加载自己脚本的页面，可以改为嵌入托管在 erd-editor.io/embed 的查看器，参见[嵌入](../guide/guides/embedding.md)。

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

从 `4.0.0` 起，`enable-locale-picker` 会添加工具栏的 `Display Language` 选择器，`enable-welcome-screen` 则会添加空白的图所显示的欢迎界面。参见 [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) 和 [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen)。
像[使用](#使用)中那样加载文档的页面，应在 `setInitialValue()` 加载完文档之后再开启 `enableWelcomeScreen`，而不是写在标记中，这样欢迎界面就不会在仍在加载的文件上一闪而过。
编辑器自带全部 25 种显示语言，ES 构建与 script 标签构建都是如此，因此无需提供语言文件，也无需注册任何内容。既没有选择器、也没有调用 `setLocale()` 时，编辑器显示英语。

在此加上 `readonly` 会让编辑器以阅读者的方式打开：为 `value` 赋值、调用 `clear()` 以及所有 `setSchema*()` 调用（包括 `setSchemaJSON()` 和追加模式的调用）都会被忽略，`change` 事件也不会发出。它的标签页、资源管理器和快速搜索仍可用于阅读，所有会编辑图的控件都已移除。
读取 `editor.value` 和 `editor.runtimeValue` 仍然有效，并且两者都保持文档自身的设置：阅读者更改的视图设置（例如缩放或数据库）只保留在该编辑器的屏幕上。加载时改用 `setInitialValue()`，参见 [readonly](./erd-editor-element.md#readonly)。

### 服务端渲染

除 `engine.js` 与 `peer.js` 之外的每个入口都需要 DOM，因此在 Node 中会抛出错误。`erd-editor.js` 与 `erd-viewer.js` 在模块作用域中定义各自的元素，而从 `5.0.0` 起不定义任何元素的包根入口，在加载时仍会构建两个元素类。
在 Next.js、Nuxt、SvelteKit 或 Astro 中，应从仅在客户端执行的路径导入元素的入口；从根入口按名称导入的内容（例如 `setExportFileCallback` 或 `toImage`）也应放在同一路径中。

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

开发时，请把编辑器的布局 worker 所导入的 ELK 包加入 Vite 的预构建，否则该 worker 生成的布局会失败：自动布局的 `Flow`、`Tree - vertical` 与 `Tree - horizontal`、Visualization 标签页的 Flow 模式，以及由 Flow 排布的导入。
Vite 7 及更早版本还需要让编辑器不参与预构建，因为它们的预构建会把 worker 的 URL 指向从未写出的文件，导致三个 worker 全部失败。在 Vite 8 上请去掉这个 `exclude`，它只会让开发服务器逐个获取该包的文件。生产构建两者都不需要。

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript

导入 `@dineug/erd-editor/erd-editor.js` 会把 `erd-editor` 合并到 `HTMLElementTagNameMap` 中，导入 `@dineug/erd-editor/erd-viewer.js` 则会合并 `erd-viewer`，因此无需类型断言即可获得元素的类型。从根入口导入的任何内容（仅类型也算）会同时带来两者。

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` 已导出，可用于为自己的变量和 props 标注类型。从 `5.0.0` 起它也是元素的类，而 `ErdViewerElement` 是查看器的接口和类，参见[注册元素](#registering-the-elements)。
从 `4.0.0` 起，该包还导出 `LocaleCode`、`LocaleOption` 与 `SchemaSQLOptions` 类型，从 `5.0.0` 起还导出 `ToImageOptions`，参见[入口点](#入口点)。`setSchema*()` 方法所接受的选项没有导出的名称，可以像 `Parameters<ErdEditorElement['setSchemaSQL']>[1]` 这样从元素上取得。
从 `5.0.0` 起，该包的 `typesVersions` 也为 `moduleResolution: "node10"` 下的每个子路径入口提供类型，该解析方式不读取 exports 映射。

## 注册元素 {#registering-the-elements}

从 `5.0.0` 起，该包只在页面要求时才定义标签。

| 导入 | 定义 |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | 不定义任何标签 |

这两个入口在被求值时定义各自的标签，并且不导出任何内容，因此导入它们只是为了其副作用，且两者都不会定义对方的标签。
根入口导出两个元素类 `ErdEditorElement` 与 `ErdViewerElement`，以及 `defineErdEditor()` 与 `defineErdViewer()`，后者在你调用的位置定义各自的标签：

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

当标签已经对应该类时，调用什么也不做，因此入口和 define 调用，或者两次 define 调用，可以出现在同一个页面中。当标签被另一个类占用时（例如同一页面中打包进了该包的第二份副本），它会抛出一个指明该标签的 `Error`：`Another element class already defines the custom element name erd-editor`。
根入口的类就是入口所定义的类，因此任一入口运行之后，`customElements.get('erd-editor') === ErdEditorElement`。在标签被定义之前，`document.createElement('erd-editor')` 创建的是不带任何编辑器成员的普通 `HTMLElement`，而 `new ErdEditorElement()` 会抛出错误。

如果想用自己的标签，请自行用该标签定义这个类，并自行把标签加入 `HTMLElementTagNameMap`。请在没有加载该元素的入口或其 [script 标签](#script-标签)构建、也没有调用其 define 函数的窗口中这样做，因为一个类在一个窗口中只能对应一个名称：

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

同时包含两个元素的构建，会让 Vite 与 Rolldown 对除英语之外的每种显示语言各发出一次 `INEFFECTIVE_DYNAMIC_IMPORT` 警告。查看器用各自的 `import()` 加载这些语言，而编辑器一次性导入所有词典，因此它们留在编辑器的 chunk 中并随之加载。这不会导致任何失败，而只包含查看器的构建会把每种语言放在各自的 chunk 中。

## 语法高亮

Schema SQL 与 Code Generator 面板由 [Shiki](https://shiki.style) 高亮，它运行在自己的 shared worker 中；从 `4.0.0` 起，Schema SQL 标签页的 `Before tables` 与 `After tables` 脚本同样由它高亮。
从 `3.7.0` 起，既不需要安装也不需要注册：worker 会在第一个代码面板渲染时创建，因此从不打开代码面板的页面永远不会获取语法文件。

| | |
| --- | --- |
| 语言 | SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go、Python、PHP、Rust、Swift、JSON、Mermaid |
| 主题 | `github-dark` 与 `github-light`，跟随编辑器的浅色 / 深色外观 |

这正是面板实际输出的语言：`JPA` 按 Java 高亮，`SQLAlchemy` 按 Python 高亮，`TypeORM`、`Sequelize`、`Drizzle` 与 `Zod` 按 TypeScript 高亮，`Doctrine` 按 PHP 高亮，`SeaORM` 按 Rust 高亮，`JSON Schema` 按 JSON 高亮，`DBML` 与 `AML` 则按包中最接近的语法 SQL 高亮。参见[代码生成](../guide/guides/code-generator.md)。

正则引擎是纯 JavaScript，因此宿主的策略不需要 `wasm-unsafe-eval`。
在没有 `SharedWorker` 的环境中（Chrome 148 之前的 Android 版 Chrome、16.4 之前的 Safari），失败会被记录下来，代码以纯文本显示；脚本仍然可以编辑。

从 `3.6.0` 及更早版本升级时：`@dineug/erd-editor-shiki-worker` 不再发布，`setGetShikiServiceCallback` 也随之移除。
删掉那次安装和注册即可；如果页面此前从 CDN 加载该 worker，第二个 `<script>` 标签也一并删除。

## Web Worker {#web-workers}

编辑器会在 `SharedWorker` 中运行三件事：语法高亮、图片导出，以及表布局，后者支撑着[自动布局](../guide/guides/table-related-functions.md#auto-layout)、Visualization 标签页的 [Flow 模式](../guide/guides/visualization.md#how-flow-is-placed)，以及从 `4.0.0` 起导入的 schema 的排布。
三者都包含在 `@dineug/erd-editor` 中。它们都不需要你来配置，但都可能被宿主环境阻止。
从 `5.0.0` 起，每个 worker 都在各自的模块中构造，因此构建只带上其模块所涉及的 worker：只包含 [toImage](./to-image.md) 而不含任何元素的构建只带图片导出 worker，而 `<erd-viewer>` 完全不启动 worker，参见[入口点](#入口点)。
负责文档垃圾回收的 worker 已在 `4.0.0` 中随垃圾回收本身一并移除。

| Worker | 缺少时 |
| --- | --- |
| 语法高亮 | Schema SQL 与 Code Generator 面板以及 Schema SQL 脚本保持纯文本 |
| 图片导出 | PNG、SVG、`Copy to clipboard`、`Export image` 对话框的预览，以及从 `5.0.0` 起的 [toImage()](./to-image.md) 改在主线程绘制，绘制期间页面会卡住 |
| 表布局 | 自动布局的 `Flow`、`Tree - vertical` 与 `Tree - horizontal` 布局，以及 Visualization 标签页的 Flow 模式，都会以 `Could not place tables` 收场；由 Flow 排布的导入（通过 `Import` 或 `Import and Add` 导入的 SQL、GraphQL、DBML 或 AML 文件，或者带 `placement: 'auto'` 的 `setSchema*()` 调用）会将其中的表逐行排列，且不显示任何消息；`Force` 与 Graph 模式在编辑器内运行，不受影响 |

图片导出最多等待其 worker 十秒，之后改在主线程绘制，语法高亮则会在其 worker 失败时立即让代码保持纯文本，因此阻止 worker 的宿主环境损失的是性能而不是功能。
表布局是例外：计算布局的引擎比编辑器本身还大，从不放进进程内运行，因此首次布局时最多等待其 worker 三十秒；worker 响应之后，每次布局最多等待六十秒返回。
任何一次等待超时，布局都会像没有 worker 时那样收场。自动布局一开始就会显示 `Placing tables`，而 Flow 模式和由 Flow 排布的导入只有在一次布局（包括其 worker 的启动）持续了六秒之后才会显示。

Vite、webpack 5 和 Rspack 会把 worker 作为文件输出到你的 chunk 旁边。esbuild，以及不经 Vite 而单独使用的 Rolldown 则不输出任何文件，因此用它们构建的页面在没有 worker 的情况下运行。
在 webpack 实验性的 `experiments.outputModule` 下，没有任何 worker 会启动，因为每个 worker 都在等待一个从它分出去、却没有任何内容加载的 chunk。请保留 webpack 的默认输出，或设置 `optimization.splitChunks: false`。

### 内容安全策略 {#content-security-policy}

处于严格内容安全策略下的页面，需要为这些元素设置以下指令：

- 打包构建需要 `worker-src 'self'`，因为它的 worker 是包旁边的文件；如果你的打包器把 worker 内联，还需要加上 `blob:`。在 [script 标签](#script-标签)构建中，三个 worker 都以 `data:` URL 的形式装在文件里，因此这类页面需要的是 `worker-src data:`。`<erd-viewer>` 两者都不需要，因为它不启动 worker。
- 从 `5.0.0` 起，两个元素都用构造样式表来设置自身样式，`style-src 'self'` 允许这种方式。编辑器的代码面板仍用 `style` 属性为文本着色，`Export image` 对话框的预览是一张位于 `blob:` URL 的图片，因此编辑器还需要 `style-src 'unsafe-inline'` 和 `img-src blob:`。
- 不支持构造样式表的浏览器（例如 101 之前的 Firefox）会改用 `<style>` 元素，对任一元素都需要 `style-src 'unsafe-inline'`。
- `<erd-viewer>` 会获取它的 `src`，因此该源要放进 `connect-src`，参见[它给页面带来了什么](./erd-viewer-element.md#what-it-adds-to-a-page)。

## 入口点

该包有五个入口：

| 入口 | 说明 |
| --- | --- |
| `@dineug/erd-editor` | 根入口：下面列出的导出。从 `5.0.0` 起它不定义任何元素，但仍需要 DOM 才能加载 |
| `@dineug/erd-editor/erd-editor.js` | 从 `5.0.0` 起提供。定义 `<erd-editor>`，不导出任何内容 |
| `@dineug/erd-editor/erd-viewer.js` | 从 `5.0.0` 起提供。定义 `<erd-viewer>`，不导出任何内容 |
| `@dineug/erd-editor/engine.js` | 不需要 DOM 的文档 store |
| `@dineug/erd-editor/peer.js` | 从 `3.9.1` 起提供。MCP 服务器的无头节点 |

根入口导出两个元素类及其 define 函数、两个回调 setter、从 `3.9.2` 起提供的默认按键绑定及其类型、从 `4.0.0` 起提供的显示语言类型和 `getSchemaSQL()` 的选项类型、从 `4.2.0` 起提供的 Dictionary 标签页的行组合键，以及从 `5.0.0` 起提供的 `toImage`。

| 导出 | 说明 |
| --- | --- |
| `ErdEditorElement` | 元素的接口，参见 [ErdEditorElement](./erd-editor-element.md)。从 `5.0.0` 起也是其类，即 `<erd-editor>` 所定义的那个类，参见[注册元素](#registering-the-elements)。 |
| `ErdViewerElement` | 从 `5.0.0` 起提供。查看器的接口和类，参见 [ErdViewerElement](./erd-viewer-element.md)。 |
| `defineErdEditor()`、`defineErdViewer()` | 从 `5.0.0` 起提供。把 `<erd-editor>` 或 `<erd-viewer>` 定义为对应的类。标签已对应该类时调用什么也不做，被另一个类占用时抛出 `Error`，参见[注册元素](#registering-the-elements)。 |
| `toImage(value, options)` | 从 `5.0.0` 起提供。按 `Export image` 对话框的选项，把文档绘制为 PNG `Blob` 或 SVG 字符串，参见 [toImage](./to-image.md)。 |
| `ToImageOptions`（类型） | 从 `5.0.0` 起提供。`toImage()` 所接受的选项：`format`、`background`、`darkMode` 与 `scale`。 |
| `setExportFileCallback(cb)` | 替换浏览器的下载行为，`(blob, { fileName }) => void`。 |
| `setImportFileCallback(cb)` | 替换浏览器的文件选择框，`({ type, op, accept, mode }) => void`；`mode` 从 `4.0.0` 起提供。从 `4.2.0` 起，即使设置了回调，Dictionary 标签页的 `Import CSV` 也会打开浏览器的文件选择框，参见[文件对话框](#文件对话框)。 |
| `createKeyBindingMap()` | 每次调用都以一个新的 `KeyBindingMap` 返回默认按键绑定，参见 [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap)。 |
| `KeyBindingMap`、`KeyBindingName`、`ShortcutOption`（类型） | 绑定映射、由其命令名称组成的联合类型，以及单个绑定。 |
| `dictionaryRowChords(map)` | 从 `4.2.0` 起提供。每次调用都以一个新的 `ShortcutOption[]` 返回在你传入的 `KeyBindingMap` 下，[Dictionary](../guide/guides/dictionary.md#adding-and-deleting-rows) 标签页的网格用于插入和删除行的组合键。其中在上方插入行的组合键（默认为 `Alt+Shift+Enter`）不属于任何绑定，参见 [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)。 |
| `LocaleCode`、`LocaleOption`（类型） | 从 `4.0.0` 起提供。前者是 25 种显示语言的代码，后者是这些代码加上 `'system'`，即 `setLocale()` 所接受的值，参见 [Display Language](./erd-editor-element.md#display-language)。 |
| `SchemaSQLOptions`（类型） | 从 `4.0.0` 起提供。`getSchemaSQL()` 所接受的选项：`statements`、`header`，以及从 `4.2.0` 起提供的 `logicalNameAsComment`，参见 [getSchemaSQL](./erd-editor-element.md#getschemasql)。 |

从 `5.0.0` 起，`dist` 中每个模块一个未压缩的文件，各自带有自己的声明文件，并且 `package.json` 的 `sideEffects` 只列出两个标签入口和 worker 文件所需的两个桩文件。因此打包器会丢弃页面没有用到的所有模块，并且只压缩一次：

- 从根入口按名称导入的内容（例如 `setExportFileCallback`），既不会打包任何元素，也不会打包任何 worker。
- `toImage` 会带上图片导出 worker，不带任何元素。
- `erd-editor.js` 会带上编辑器和全部三个 shared worker。
- `erd-viewer.js` 会带上查看器，不带任何 worker；英语包含在其中，其他每种显示语言各在自己的 chunk 中，页面请求时才加载。

`@dineug/erd-editor/engine.js` 在没有 DOM 的情况下运行文档 store，因此也可以在 Web Worker 中使用。参见[远程存储](./advanced/remote-storage.md)。
它导出 `createReplicationStore` 与 `ReplicationStore` 类型。从 `3.10.0` 起还导出 `ReplicationChange` 类型 `{ value: string; changed: boolean }`，即副本的 `change` 监听器接收到的参数。参见 [on@change](./advanced/remote-storage.md#onchange)。
从 `4.0.0` 起，`ReplicationStore` 还有 `runtimeValue`。它的 `value` 以及 `change` 交出的 `value` 都与元素的 `value` 一样，是文件所保存的存储形式。参见 [ReplicationStore](./advanced/remote-storage.md#replicationstore)。

`@dineug/erd-editor/peer.js` 是 [MCP 服务器](../mcp/introduction.md)用来编辑文档的无头节点。它专为该服务器而存在，这里的文档不对它作说明。

### 文件对话框

导入与导出都会经过可注入的回调，因此没有浏览器文件对话框的宿主（例如 IDE 的 webview）也可以提供自己的实现。
两者并不对称：导出会直接交出已经生成好的文件，而导入只是请求一个文件，其内容需要自行放回编辑器。
从 `4.2.0` 起，Dictionary 标签页的 `Import CSV` 是唯一一个从不调用导入回调的导入，该回调的 `type` 中也没有 CSV 值。它总是打开浏览器自身的文件选择框，用于选择 `.csv` 文件，参见[导入与导出 CSV](../guide/guides/dictionary.md#importing-and-exporting-csv)。

`op` 为 `set` 或 `diff`。为 `diff` 时无论 `type` 是什么都会交给 `setDiffValue()`。其余情况由 `type` 决定使用哪个方法，`accept` 中是该类型的扩展名，可以直接传给宿主的文件对话框。
从 `4.0.0` 起，当用户选择 [Import and Add](../guide/guides/file-import-export.md#import-and-add) 时，`set` 会带有 `mode: 'append'`；普通的 Import 则不带 `mode`。请将它传递下去：丢弃它的回调会替换掉用户想要向其中添加内容的图。

| `type` | `accept` | 方法 |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` 会像编辑器自身的 Import 那样，在表落下之前按其关系排布这些表，并使调用返回一个 Promise。不带该选项时，表会立即落下并逐行排列。参见 [setSchemaSQL](./erd-editor-element.md#setschemasql) 和 [setSchemaJSON](./erd-editor-element.md#setschemajson)。

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

对需要处理的每个 `type` 分别分支，其余的忽略即可。
以替换方式调用的 `setSchemaJSON()` 与为 `value` 赋值一样，会在解析之前先清空文档，因此把并非 `.erd.json` 文档的内容送到那里（例如写了兜底的 `else`，或者后来新增的 `type` 漏掉了处理），结果不是导入任何内容，而是把图清空。

编辑器生成的 `fileName` 为 `<database name>-<timestamp>` 加上文件的扩展名，其中时间戳采用本地时间，格式为 `yyyy-MM-dd'T'HH_mm_ss`。数据库名为空时会退回为 `unnamed`。Dictionary 标签页的 CSV 会在扩展名之前加上其工作表的名称，例如 `<database name>-<timestamp>-words.csv`。
导出回调接收的就是这些文件。从 `4.0.0` 起，其中还包括 SVG 和 Code Generator 的文件，而 `.sql` 来自 Schema SQL 标签页的 `Save file`，不再直接来自 `Export`。从 `4.2.0` 起，其中还包括 Dictionary 标签页的 CSV。[toImage()](./to-image.md) 不调用任何一个回调：它把图片交还给你。

| 文件 | 扩展名 | Blob 的 `type` |
| --- | --- | --- |
| JSON 导出 | `.erd.json` | `application/json` |
| Schema SQL 标签页的 `Save file`，内容为该标签页显示的文本，参见 [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | 无 |
| [Export image](../guide/guides/file-import-export.md#image) 对话框 | `.png` 或 `.svg` | `image/png` 或 `image/svg+xml` |
| Code Generator 标签页的 `Save file`，参见[代码生成](../guide/guides/code-generator.md) | 对应语言的扩展名：`.cs`、`.go`、`.java`、`.kt`、`.php`、`.rs`、`.scala`、`.swift`、`.ts`、`.py`、`.aml`、`.dbml`、`.graphql`、`.json` 或 `.mmd` | 无 |
| Dictionary 标签页的 `Export CSV`，内容为当前显示的工作表中的每一行，与其搜索列出的内容无关，参见[导入与导出 CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

按扩展名选择处理方式的宿主，需要为其中每一种文件都准备好处理方式。

不设置时，编辑器会使用浏览器自身的下载与文件选择行为。传入 `null` 可以恢复为该行为。

## 浏览器支持

支持 Chrome 91+、Edge 94+、Firefox 93+、Safari 16.4+，这是所发布的包构建时所基于的 ES2022 基准。
包中不包含 polyfill。如果需要支持更旧的浏览器，需要自行添加。

## 从 4.x 升级 {#upgrading-from-4x}

`5.0.0` 是一次大版本升级。将页面从 4.x 迁移时，请逐项检查以下内容：

- `import '@dineug/erd-editor'` 不再定义 `<erd-editor>`。请改为导入 `@dineug/erd-editor/erd-editor.js` 来获得其副作用，或者调用 `defineErdEditor()`，并保留从根入口按名称导入的内容。仍然使用裸导入的页面不会被 TypeScript 标出，因为根入口的声明仍然在 `HTMLElementTagNameMap` 中写有该标签，但它创建的元素是普通的 `HTMLElement`，所以第一次调用方法时就会抛出 `TypeError`，参见[注册元素](#registering-the-elements)。

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- 在 CDN 上同样如此：`https://esm.run/@dineug/erd-editor` 现在提供的是根入口，不定义任何内容，请导入 `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`。仅含包名的 jsDelivr 与 unpkg URL 仍提供 script 标签构建，它会像以前一样定义 `<erd-editor>`。不带版本号的 URL 现在提供最新的 5.x 版本；要停留在 4.x，请固定为 `@4.2.0`。参见 [CDN](#cdn) 和 [script 标签](#script-标签)。
- 根入口不定义任何内容，但仍然需要 DOM，因此使用服务端渲染时，从它按名称导入的内容（例如 `setExportFileCallback`）应与元素的入口一起放在仅在客户端执行的路径中，参见[服务端渲染](#服务端渲染)。
- `window.ErdEditor` 新增 `ErdEditorElement` 与 `defineErdEditor`。查看器的 script 标签构建把 `ErdViewerElement` 与 `defineErdViewer` 放到 `window.ErdViewer` 上，两个全局对象都不带 `toImage`。
- `readonly` 编辑器会以阅读者的方式打开。它的六个标签页、资源管理器、快速搜索和协作者的光标与选中状态都保留，所有会编辑图的控件都被移除而不是被禁用：工具栏把数据库名显示为文本，Settings 标签页在 `Read only` 徽章下显示其设置，所有控件均被禁用，浮动工具栏只保留缩放、名称显示、禅模式和指南针，因此 `Hand` 与 `Select` 都没有了，拖动即平移。按下不会选中任何内容：唯一的选中是从资源管理器或快速搜索跳转时在其到达的对象周围绘制的轮廓，一次不移动的点击会清除它，全选快捷键也不选中任何内容。开启 `readonly` 会结束正在进行的操作，例如选中、手形工具、单元格编辑器、拖动、Map Columns、自动布局的 `Force` 预览和 Time Travel，而滚动、缩放、标签页和名称显示保持不变，参见 [readonly](./erd-editor-element.md#readonly)。
- `readonly` 阅读者更改的设置，无论其锁定如何，都只保留在该编辑器的屏幕上：滚动和缩放、标签页、名称显示、View Option、数据库，以及 Code Generator 的语言、名称大小写和括号类型。`value`、`runtimeValue` 与 JSON 导出保持文档自身的设置，而在 4.x 中阅读者的更改可能会影响到它们；`getSharedStore()` 也不会把其中任何一项发给其他编辑器。不带数据库调用 `getSchemaSQL()` 时，写出的是阅读者所选的数据库。关闭 `readonly` 会让数据库、代码设置和 View Option 恢复为文档的值，而滚动、缩放、标签页和名称显示留在阅读者离开时的位置。
- Settings 标签页的 `Recalculation table width` 一行已移除。加载和粘贴仍会让每张表的宽度适应其文本。
- 在 Vite 8 上，请去掉 `optimizeDeps` 中的 `exclude: ['@dineug/erd-editor']`，只有 Vite 7 及更早版本仍然需要它，并保留 ELK 的 `include`，参见 [Vite](#vite)。

## 从 3.x 升级

`4.0.0` 是一次大版本升级。将页面从 3.x 迁移时，请逐项检查以下内容，然后再看 `5.0.0` 对应的[从 4.x 升级](#upgrading-from-4x)：

- `editor.value`、副本的 `value` 以及其 `change` 交出的 `value` 都是文件所保存的存储形式：不包含已删除的实体、测量得到的宽度、叠放顺序和关系的连接线锚点。请继续保存 `value`，需要这些信息时从 `runtimeValue` 读取；实体的时间戳（`meta`）则已完全移除。为加入正在进行的会话的协作者或副本提供初始文档时，应使用会话中正在运行的节点的 `runtimeValue`，而不是 `value` 或文件，并且永远不要保存 `runtimeValue`。参见 [value](./erd-editor-element.md#value) 和 [runtimeValue](./erd-editor-element.md#runtimevalue)。
- 设置锁定取代了 `Save Scroll Information` 与 `Save Zoom Information`。新文档以及 `4.0.0` 之前保存的任何文档的所有锁定都处于开启状态，因此滚动、缩放、切换标签页，或者更改 Code Generator 的语言、某种名称大小写或括号类型，都不会改变 `value`，也不会发出 `change`。通过 `change` 保存视图的页面，需要在 Settings 标签页上解除 `Viewport` 的锁定（要保存标签页还需解除 `Canvas Type` 的锁定），或者使用 `settings.lockSettings` 中这些位未设置的文档。参见[锁定](../guide/guides/settings.md#锁定)。
- `settings` 不再包含 `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization` 或 `ignoreSaveSettings`，`SaveSettingType` 常量也已移除。`settings.lockSettings` 及其 `LockSettingType` 位取代了 `ignoreSaveSettings`，`4.0.0` 或更高版本既不读取也不写入后者。参见 [Settings](./advanced/schema.md#settings)。
- 每个文件在 `$schema` 中指定的 [JSON Schema](./advanced/schema.md#json-schema) 现在只描述存储形式，并且是封闭的：较早版本保存的文件会被它拒绝，直到由 `4.0.0` 或更高版本保存时将其重写为止。
- 文档的垃圾回收已随其 worker 一并移除，因此已删除的实体会一直留在 `runtimeValue` 中，直到下次从文件打开该文档。剩下三个 shared worker，参见 [Web Worker](#web-workers)。
- 共享会话中的每个编辑器和副本都应使用 `4.0.0` 或更高版本。较早的版本会忽略新的操作类型，即表分组、映射列、锁定和 Schema SQL 脚本的操作类型。参见[混用不同版本](./advanced/collaborative-editing.md#mixing-releases)。
- 导入回调会在 Import and Add 时收到 `mode: 'append'`，回调必须将其传递下去。导出回调现在还会收到 `.svg` 和 Code Generator 的文件，并且 `Export` ▸ `Schema SQL` 会打开 Schema SQL 标签页而不是直接保存，因此 `.sql` 只会来自该标签页的 `Save file`。参见[文件对话框](#文件对话框)。
- `Delete` 与 `Backspace` 绑定到新增的 `removeSelection`。编辑器获得焦点且焦点不在文本输入框中时，每个标签页都会阻止该按键的默认行为，在 ERD 标签页中还会删除选中的对象。`KeyBindingName` 与 `KeyBindingMap` 中都加入了它，`setKeyBindingMap({ removeSelection: [] })` 会把这两个按键都交给页面处理。参见 [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap)。
- `ThemeOptions.appearance` 还接受 `'system'`，即主题构建器中的 `System`，开启 `systemDarkMode` 时会设为该值。选中它期间，`changePresetTheme` 报告的是 `'system'`，因此请原样存储，并原样传回给 `setPresetTheme`。开启 `systemDarkMode` 时，以 `'light'` 或 `'dark'` 调用的 `setPresetTheme()` 现在会保持生效，而不会被操作系统的下一次变更覆盖。参见 [systemDarkMode](./erd-editor-element.md#systemdarkmode) 和 [changePresetTheme](./erd-editor-element.md#changepresettheme)。
- `@dineug/erd-editor-mcp` `1.0.0` 或更高版本、VS Code 扩展 `4.0.0` 或更高版本以及 Obsidian 和 JetBrains 插件 `1.0.0` 或更高版本使用 hub 协议 2。服务器 `1.0.0` 或更高版本与为智能体提供服务的较早编辑器版本之间，或者较早的服务器与上述某个编辑器之间，会以 `protocolMismatch` 互相拒绝，并指出需要更新的一方。参见[更新](../mcp/installation.md#更新)。
- 不带版本号的 CDN URL 提供的是最新的版本，自 `5.0.0` 起为 5.x。要停留在 3.x，请固定为 `@3.10.0`。参见 [CDN](#cdn)。
