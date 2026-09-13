---
sidebar_position: 1
description: 从 npm 或 CDN 安装 @dineug/erd-editor，挂载自定义元素，以及接管文件对话框。
---

# 安装

```sh
npm install @dineug/erd-editor
```

该包仅支持 ESM（`"type": "module"`），并且只发布 `dist` 目录。
没有 CommonJS 构建，因此 `require('@dineug/erd-editor')` 无法使用。

运行时依赖都以 bare import 的形式留在外部，交由你的打包器解析、去重和 tree-shaking。
其中的 shared worker 会作为独立的入口文件输出到 `dist/workers/` 下，并通过 `new URL('./…', import.meta.url)` 构造——这正是 Vite、webpack 5 和 Rspack 识别为 worker 入口的写法。参见 [Web Worker](#web-workers)。
对于没有打包器的页面，还提供了一份自包含的构建，参见 [script 标签](#script-标签)。

## 使用

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` 没有固有尺寸。请为该元素或其容器显式指定 width 和 height。

`setInitialValue('')` 会以空文档开始。为 `value` 赋值则会把加载当作一次编辑，因此会记录到历史列表中。
其余 API 参见 [ErdEditorElement](./erd-editor-element.md)。

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` 会替你解析该包的外部依赖，因此无需打包器也能工作。
不带版本号的 URL 始终提供最新的发布版本。如果不希望大版本升级在毫无预告的情况下进入页面，可以像 `https://esm.run/@dineug/erd-editor@3.8.0` 这样固定版本。

### script 标签

从 `3.6.0` 起，该包还会发布一份 UMD 构建，把所有依赖和四个 shared worker 都装进同一个文件。
`unpkg` 与 `jsdelivr` 字段指向的就是它，因此这两个 CDN 上该包的基础 URL 提供的都是这个文件，它会定义 `window.ErdEditor`。

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@3.8.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

引入它同样会注册 `<erd-editor>`，`window.ErdEditor` 上带有两个文件回调 `ErdEditor.setExportFileCallback` 与 `ErdEditor.setImportFileCallback`。
exports 映射仍然指向 ES 模块，因此从 npm 安装时打包器不会用到这个文件。

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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

在此加上 `readonly` 会禁止编辑：为 `value` 赋值、调用 `clear()` 以及所有 `setSchema*()` 都会被忽略，`change` 事件也不会发出。读取 `editor.value` 仍然有效。加载时改用 `setInitialValue()`。

### 服务端渲染

导入该包会在模块作用域中注册自定义元素，因此需要 DOM，在 Node 中会抛出错误。
在 Next.js、Nuxt、SvelteKit 或 Astro 中，应从仅在客户端执行的路径导入。

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript

导入该包会把 `erd-editor` 合并到 `HTMLElementTagNameMap` 中，因此无需类型断言即可获得元素的类型。

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` 已导出，可用于为自己的变量和 props 标注类型。

## 语法高亮

Schema SQL 与 Code Generator 面板由 [Shiki](https://shiki.style) 高亮，它运行在自己的 shared worker 中。
从 `3.7.0` 起，既不需要安装也不需要注册：worker 会在第一个代码面板渲染时创建，因此从不打开代码面板的页面永远不会去取语法文件。

| | |
| --- | --- |
| 语言 | SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go、Python |
| 主题 | `github-dark` 与 `github-light`，跟随编辑器的浅色 / 深色外观 |

这正是面板实际输出的语言：`JPA` 按 Java 高亮，`SQLAlchemy` 按 Python 高亮，`TypeORM`、`Sequelize` 与 `Drizzle` 按 TypeScript 高亮，`DBML` 与 `AML` 则按包中最接近的语法 SQL 高亮。参见[代码生成](../guide/guides/code-generator.md)。

正则引擎是纯 JavaScript，因此宿主的策略不需要 `wasm-unsafe-eval`。
在没有 `SharedWorker` 的环境中（Android 上的 Chrome、16.4 之前的 Safari），失败会被记录下来，面板以纯文本渲染，其余一切不受影响。

从 `3.6.0` 及更早版本升级时：`@dineug/erd-editor-shiki-worker` 不再发布，`setGetShikiServiceCallback` 也随之移除。
删掉那次安装和注册即可；如果页面此前从 CDN 加载该 worker，第二个 `<script>` 标签也一并删除。

## Web Worker {#web-workers}

编辑器会在 `SharedWorker` 中运行四件事：语法高亮、PNG 导出、支撑[自动布局](../guide/guides/table-related-functions.md#auto-layout)与 Visualization 标签页 [Flow 模式](../guide/guides/visualization.md#how-flow-is-placed)的表布局，以及文档自身的垃圾回收。
四者都包含在 `@dineug/erd-editor` 中。它们都不需要你来配置，但都可能被宿主环境阻止。

| Worker | 缺少时 |
| --- | --- |
| 语法高亮 | Schema SQL 与 Code Generator 面板保持纯文本 |
| PNG 导出 | 改在主线程绘制，绘制期间页面会卡住 |
| 表布局 | 自动布局的 `Flow`、`Tree - vertical` 与 `Tree - horizontal` 布局，以及 Visualization 标签页的 Flow 模式，都会以 `Could not place tables` 收场；`Force` 与 Graph 模式在编辑器内运行，不受影响 |
| Schema 垃圾回收 | 改为进程内运行 |

PNG 导出与 Schema 垃圾回收最多等待十秒，之后便不再依赖 worker 继续执行，语法高亮则会在其 worker 失败时立即让面板保持纯文本，因此阻止 worker 的宿主环境损失的是性能而不是功能。
表布局是例外：计算布局的引擎比编辑器本身还大，从不放进进程内运行，因此首次布局时最多等待三十秒，若无响应则报告失败。
worker 响应之后，六十秒内仍未返回的布局同样会被放弃，并以同样的 `Could not place tables` 收场。自动布局一开始就会显示 `Placing tables…`，而 Flow 模式只有在一次布局（包括其 worker 的启动）持续了六秒之后才会显示。

在打包构建中，四个 worker 都会作为独立文件一同发布，因此 CSP 严格的页面需要 `worker-src 'self'`；如果你的打包器把 worker 内联，还需要加上 `blob:`。
在 [script 标签](#script-标签)构建中，四个 worker 都以 `data:` URL 的形式装在文件里，因此这类页面需要的是 `worker-src data:`。

## 入口点

导入 `@dineug/erd-editor` 会作为副作用注册 `<erd-editor>`。除此之外，它还导出元素的类型和两个回调 setter。

| 导出 | 说明 |
| --- | --- |
| `ErdEditorElement`（类型） | 元素的接口，参见 [ErdEditorElement](./erd-editor-element.md)。 |
| `setExportFileCallback(cb)` | 替换浏览器的下载行为，`(blob, { fileName }) => void`。 |
| `setImportFileCallback(cb)` | 替换浏览器的文件选择框，`({ type, op, accept }) => void`。 |

`@dineug/erd-editor/engine.js` 是第二个入口点。它在没有 DOM 的情况下运行文档 store，因此也可以在 Web Worker 中使用。参见[远程存储](./advanced/remote-storage.md)。

### 文件对话框

导入与导出都会经过可注入的回调，因此没有浏览器文件对话框的宿主（例如 IDE 的 webview）也可以提供自己的实现。
两者并不对称：导出会直接交出已经生成好的文件，而导入只是请求一个文件，其内容需要自行放回编辑器。

`op` 为 `set` 或 `diff`。为 `diff` 时无论 `type` 是什么都会交给 `setDiffValue()`。其余情况由 `type` 决定使用哪个方法，`accept` 中是该类型的扩展名，可以直接传给宿主的文件对话框。

| `type` | `accept` | 方法 |
| --- | --- | --- |
| `json` | `.json` | `editor.value = text` |
| `sql` | `.sql` | `editor.setSchemaSQL(text)` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text)` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text)` |
| `aml` | `.aml` | `editor.setSchemaAML(text)` |

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.value = text;
  } else if (type === 'sql') {
    editor.setSchemaSQL(text);
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text);
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text);
  } else if (type === 'aml') {
    editor.setSchemaAML(text);
  }
});
```

对需要处理的每个 `type` 分别分支，其余的忽略即可。
为 `value` 赋值会在解析之前先清空文档，因此把并非 `.erd.json` 文档的内容送到那里（例如写了兜底的 `else`，或者后来新增的 `type` 漏掉了处理），结果不是导入任何内容，而是把图清空。

编辑器生成的 `fileName` 为 `<数据库名>-<时间戳>` 加上 `.erd.json`、`.sql` 或 `.png`，其中时间戳的格式为 `yyyy-MM-dd'T'HH_mm_ss`。数据库名为空时会退回为 `unnamed`。

不设置时，编辑器会使用浏览器自身的下载与文件选择行为。传入 `null` 可以恢复为该行为。

## 浏览器支持

支持 Chrome 91+、Edge 94+、Firefox 93+、Safari 16.4+，这是所发布的包构建时所基于的 ES2022 基准。
包中不包含 polyfill。如果需要支持更旧的浏览器，需要自行添加。
