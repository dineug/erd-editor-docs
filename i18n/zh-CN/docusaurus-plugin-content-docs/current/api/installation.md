---
sidebar_position: 1
description: 从 npm 或 CDN 安装 @dineug/erd-editor，挂载自定义元素，添加语法高亮，以及接管文件对话框。
---

# 安装

```sh
npm install @dineug/erd-editor
```

该包仅支持 ESM（`"type": "module"`），并且只发布 `dist` 目录。
没有 CommonJS 构建，因此 `require('@dineug/erd-editor')` 无法使用。

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

不带版本号的 URL 始终提供最新的发布版本。如果不希望大版本升级在毫无预告的情况下进入页面，可以像 `https://esm.run/@dineug/erd-editor@3.4.0` 这样固定版本。

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

如果不提供高亮器，Schema SQL 和 Code Generator 面板会以纯文本显示。
[`@dineug/erd-editor-shiki-worker`](https://www.npmjs.com/package/@dineug/erd-editor-shiki-worker)会在 shared worker 中运行一个高亮器。
由于 Shiki 及其语法文件的构建体积远超 1MB，它需要单独安装。

```sh
npm install @dineug/erd-editor-shiki-worker
```

```js
import { setGetShikiServiceCallback } from '@dineug/erd-editor';

// deferred, so the highlighter never lands in your main chunk
import('@dineug/erd-editor-shiki-worker').then(({ getShikiService }) => {
  setGetShikiServiceCallback(getShikiService);
});
```

从 CDN 使用时：

```html
<script type="module">
  import { setGetShikiServiceCallback } from 'https://esm.run/@dineug/erd-editor';
  import { getShikiService } from 'https://esm.run/@dineug/erd-editor-shiki-worker';

  setGetShikiServiceCallback(getShikiService);
</script>
```

注册一次即可，在编辑器挂载之前或之后都可以。已经显示在屏幕上的面板会在高亮器就绪后重新渲染。
支持 SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go 和 Python。[代码生成](../guide/guides/code-generator.md)的 `AML` 与 `DBML` 目标在包中没有对应的语法文件，因此这些面板仍为纯文本。

有两种情况会让它无法工作。由于 worker 会以 `data:` URI 的形式内联，CSP 严格的页面需要 `worker-src data:`。
在没有 `SharedWorker` 的环境中（Android 上的 Chrome、16.4 之前的 Safari），不会返回高亮器，面板仍为纯文本。

## 入口点

导入 `@dineug/erd-editor` 会作为副作用注册 `<erd-editor>`。除此之外，它还导出元素的类型和三个回调 setter。

| 导出 | 说明 |
| --- | --- |
| `ErdEditorElement`（类型） | 元素的接口，参见 [ErdEditorElement](./erd-editor-element.md)。 |
| `setGetShikiServiceCallback(cb)` | 提供语法高亮器，`() => ShikiService \| null`。 |
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
