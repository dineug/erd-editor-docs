---
sidebar_position: 4
description: 在你自己的代码中用 toImage 把文档绘制为 PNG 或 SVG，使用 Export image 对话框的选项，在浏览器中以及（若有）导出 worker 中运行。
---

# toImage

从 `5.0.0` 起，包的根入口导出 `toImage()`，它无需页面上有编辑器，就能把文档绘制为 PNG 或 SVG。  
它写出的文件与 [Export image](../guide/guides/file-import-export.md#image) 对话框的 `PNG` 和 `SVG` 按钮写出的相同，使用对话框的三个选项 `Background`、`Dark mode` 和 `Scale`，没有其他选项。

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` 作为类型与它一起导出，参见[入口点](./installation.md#入口点)。

## value {#value}

文档的文本：`.erd.json` 文件所包含的内容、编辑器的 [value](./erd-editor-element.md#value) 或 [runtimeValue](./erd-editor-element.md#runtimevalue)，或 [setInitialValue](./erd-editor-element.md#setinitialvalue) 所加载的任何其他文本。  
空文本或只有空白的文本会绘制一个空的图，不含任何文档字段的 JSON 也一样，解析器会为它填入默认值。

## 选项 {#options}

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `format` | 无；必填 | `'png'` 解析为类型为 `image/png` 的 `Blob`，`'svg'` 解析为 SVG 标记字符串。 |
| `background` | `true` | 在图后面铺上画布颜色。`false` 则保持透明，ON DELETE 或 ON UPDATE 标签下的方框也是如此。 |
| `darkMode` | `false` | 绘制深色主题，取代浅色主题。 |
| `scale` | `2` | 图在 100% 时每个单位对应 `1`、`2` 或 `3` 个图像像素。它只决定 PNG 的大小；无论缩放如何，SVG 的大小都是图的大小。 |

`toImage()` 不读取其他键，因此表中没有列出的键不起任何作用。

## 它绘制什么 {#what-it-draws}

图像就是对话框所绘制的那一幅：

- 整个图，裁剪到它所绘制的内容外加边距，并且始终以 100% 绘制，无论文档保存时的缩放如何，因此每个表都完整绘制。文档中被 [View Option](../guide/guides/table-related-functions.md#table-view-options) 隐藏的内容既不绘制也不留出空间，表分组绘制在其他所有内容之后，而[词典检查](../guide/guides/dictionary.md#marks-on-the-canvas)给名称加上的颜色则不绘制。
- PNG 的大小是图在 100% 时的大小乘以 `scale`。对浏览器画布来说过大的图会以降低的分辨率写出，而不是失败，`toImage()` 也不会对此作任何说明。
- SVG 的文字保持为文字，并且只写出字体名称而不嵌入字体，因此没有编辑器字体的查看环境会用另一种字体绘制。阴影被略去。

对话框取用编辑器的屏幕，而 `toImage()` 只取用文档本身，因此同一个文档在每个页面上绘制的结果都相同：

- 它的颜色是元素默认灰阶色和强调色 `slate` 和 `indigo` 的预设，除非 `darkMode` 为 `true`，否则是浅色。页面的任何主题、任何 [setTheme](./erd-editor-element.md#settheme) 覆盖，以及[主题构建器](../guide/guides/language-and-theme.md)的任何更改都不会对它产生影响。
- 它的表和列按文档所持有的[名称显示](../guide/guides/logical-names.md#name-view)命名，对于 `Name View` 锁定处于开启状态的文件，就是被锁定的那一种。
- 图自己绘制的文字（例如未命名表的占位符）为英语。

## 它在哪里运行 {#where-it-runs}

`toImage()` 需要浏览器页面，因为它要在画布上测量和绘制。它所在的包根入口需要 DOM 才能加载，所以无法在 Node 或 Web Worker 中使用，参见[服务端渲染](./installation.md#服务端渲染)。  
它会等待页面的字体加载完毕后再绘制。

在宿主运行图片导出 shared worker 的情况下，它与对话框一样在该 worker 中绘制，因此页面在此期间保持响应；没有 worker，或 worker 没有及时响应时，则在主线程上绘制，参见 [Web Worker](./installation.md#web-workers)。  
导入 `toImage` 而不含任何元素的构建，只带上图片导出 worker。  
两份 [script 标签](./installation.md#script-标签)构建都不带它：`window.ErdEditor` 和 `window.ErdViewer` 上都没有 `toImage`。

## 拒绝 {#rejections}

它返回的 Promise 在绘制任何内容之前，于以下情况拒绝：

- 页面没有 `document`：一个 `Error`，`toImage needs a browser, since it draws on a canvas`；
- `value` 不是字符串，例如已经解析成对象的文档：一个 `TypeError`；
- 某个选项的值不在[选项](#options)表所列之中，包括缺少 `format`，以及对 SVG 传入 `'2'` 这样的 `scale`：一个指明该选项的 `TypeError`，例如 `toImage: scale cannot be 4`；
- 文本不是解析器能读取的文档：解析器的错误，对于不是 JSON 的文本则是 `SyntaxError`。

## Export Image 对话框 {#export-image-dialog}

对话框和 `toImage()` 通过同一个导出来绘制，因此选项相同时写出的图像也相同，但它们的出发点不同：

| | `Export image` 对话框 | `toImage()` |
| --- | --- | --- |
| 文档 | 对话框打开时图的样子 | 你传入的文本 |
| 深色模式 | 起初与编辑器的外观一致，一致期间绘制屏幕自己的颜色 | 除非 `darkMode` 为 `true` 否则关闭，并且始终使用预设 |
| 名称显示 | 编辑器所显示的那一种 | 文档所持有的那一种 |
| 它自己文字的语言 | 编辑器的显示语言 | 英语 |
| 结果 | 通过浏览器或[导出回调](./installation.md#文件对话框)保存，或复制到剪贴板 | 交还给你；两个文件回调都不会被调用 |

`Copy to clipboard` 没有对应项。需要它的页面请自行把 PNG `Blob` 写入剪贴板。
