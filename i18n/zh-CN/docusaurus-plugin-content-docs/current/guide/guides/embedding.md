---
sidebar_position: 18
description: 无需代码，通过嵌入 erd-editor.io/embed 在其他网站上以只读方式显示图；在构建器中生成它的 URL 和 iframe 代码行；在 URL 中设置主题、语言、名称显示、小地图、控制栏和颜色；以及从 GitHub 或允许 CORS 的服务器提供文件。
---

# 嵌入

[erd-editor.io/embed](https://erd-editor.io/embed) 在一个充满整个页面的查看器中以只读方式显示图，供其他网站嵌入框架：wiki、博客、建站工具，或任何无法加载自有脚本的页面。  
它的 `src` 参数指明文档，即 ERD Editor 所保存的文件的地址，例如 `.erd.json` 文件。URL 的其余部分设置查看器如何显示它，而同一地址上的构建器会为你写出 URL 及其 iframe 代码行。

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

这个框架显示的是 erd-editor 仓库中的 [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json)，把它放进页面的代码行如下：

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## 框架显示的内容 {#what-the-frame-shows}

框架显示图中的表、列、关系、备注和表分组，其中没有任何操作能编辑图或文件。  
图在加载时会被适配到框架，无论文件保存的缩放和滚动位置如何，因此框架的大小决定了它打开时的缩放。

画布上方有：

- 小地图，只要图中有内容就会显示。
- 底部的控制栏：`Zoom out`、缩放级别（点击会重置缩放）、`Zoom in`、`Fit`、`Name View` 列表，以及图的任何部分都不在屏幕上时出现的 `Go to content`。
- 右下角的 `erd-editor.io` 链接，它会在新标签页中打开 erd-editor.io，并且不发送 referrer，因此这次点击不会向该网站透露框架所显示的文档。在较窄的框架中，它可能会盖住控制栏的一部分。

文件加载期间，框架显示 `Loading diagram`。如果无法获取文件或文件中没有文档，框架会显示一个空的图和 `Couldn't load the diagram`，参见 [GitHub 上的文件](#files-on-github)和[其他服务器上的文件](#files-on-other-servers)。

框架只跟随其 URL 和访问者的系统。访问者在 erd-editor.io 上自己的语言和主题不适用于它。

## 构建器 {#the-builder}

不带 `src` 打开 [erd-editor.io/embed](https://erd-editor.io/embed) 就会得到构建器，一个标题为 `Embed a diagram` 的页面：

1. 把文档的地址粘贴到 `Document URL`。按 `Enter` 或离开该字段时才会应用，因此输入过程中不会获取任何内容。应用之后，字段下方的 `Loads from` 一行会指明查看器所获取的地址：你给出的地址，或者对于 GitHub 上的页面，它在 GitHub 原始内容主机上的地址，参见 [GitHub 上的文件](#files-on-github)。
2. 选择选项。每个选项都会立即应用到预览、URL 和 iframe 代码行：
   - `Theme`：`System`、`Light` 或 `Dark`。
   - `Display Language`：`System`（旁边显示它在你的浏览器中所代表的语言），然后是 25 种语言，每种都以其自身的名称显示。
   - `Name View`：`As Saved`、`Physical Names`、`Logical Names` 或 `Both Names`。`As Saved` 显示文件所保存的名称显示。
   - `Accent color` 和 `Gray color`，每个都按名称列出并带有色板。
   - `Minimap` 和 `Controls`，两个开关，默认都开启。
   - `Height`，单位为像素，起初是 `480`。不是正整数的高度按 `480` 处理。
3. 检查 `Preview`：查看器在框架中的样子，带有 `erd-editor.io` 链接，位于与 `Height` 等高的盒子中。它的 `System` 语言是你浏览器的语言，无论 erd-editor.io 自己正显示什么语言。
4. 复制结果。`Embed URL` 是框架的地址，`Embed code` 是 iframe 代码行，高度为你设置的值，宽度为 `100%`。每个都有一个 `Copy` 按钮，在文档 URL 生效之前保持禁用，复制之后会在片刻内显示 `Copied`，直到有更改重写了所复制的内容。

清空 `Document URL`，在其生效后会清空预览和两个结果。

## URL 参数 {#url-parameters}

| 参数 | 取值 | 默认值 |
| --- | --- | --- |
| `src` | 文档的地址，经过 URL 编码。 | 无：没有它，或它为空时，该页面就是构建器。 |
| `theme` | `light`、`dark` 或 `system`。 | `system`：访问者浏览器所报告的浅色或深色模式。 |
| `locale` | `system`，或[语言表](./language-and-theme.md#display-language)中的代码，例如 `de-DE`。 | `system`：访问者浏览器的语言，按 [System](./language-and-theme.md#what-system-follows) 匹配它们的方式匹配，查看器一种都没有时则取英语。 |
| `name-view` | `physical`、`logical` 或 `both`。 | 文件所保存的名称显示。 |
| `minimap` | `false` 隐藏小地图。 | 显示。 |
| `controls` | `false` 隐藏控制栏。 | 显示。 |
| `accent-color` | [主题构建器](./language-and-theme.md#theme)的 26 种强调色之一，例如 `jade`。 | `indigo` |
| `gray-color` | `gray`、`mauve`、`slate`、`sage`、`olive` 或 `sand`。 | `slate` |

默认值是查看器自己的，而不是 Web 应用的，后者以 `jade` 和 `olive` 开始。

- 构建器会把保持默认值的选项排除在 URL 之外，因此嵌入 URL 只包含与默认值不同的部分。
- 查看器不接受的值会被忽略，其选项保持默认值。取值按所列的写法精确匹配，因此 `theme=Dark` 会被忽略，而 `minimap` 和 `controls` 除 `false` 之外的任何值都保持显示。
- 重复给出的参数取其第一个值。
- `src` 经过 URL 编码，与构建器的写法一致，因为自带 `&` 或 `#` 的地址否则会被截断。

## GitHub 上的文件 {#files-on-github}

GitHub 上的文件或 gist 可以直接用它的页面所显示的地址给出，上面的框架就是这样。查看器会改为从 GitHub 的原始内容主机获取，它会响应其他网站的请求，而页面自己的地址则不会：

- 文件的页面 `https://github.com/<owner>/<repo>/blob/<ref>/<path>`，或其 `raw` 地址 `https://github.com/<owner>/<repo>/raw/<ref>/<path>`，会从 `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` 加载。`<ref>` 是分支、标签或提交：分支显示该分支当前的文件，标签或提交则保持那个版本。
- gist 的页面 `https://gist.github.com/<user>/<id>` 会从 `https://gist.githubusercontent.com/<user>/<id>/raw` 加载，也就是该 gist 的第一个文件。请让这幅图成为 gist 中唯一的文件。

嵌入 URL 保留你给出的地址，而构建器的 `Loads from` 一行显示实际获取的地址。  
这只适用于公开仓库和公开 gist。原始内容主机会把每个文件缓存五分钟，因此你推送的更改可能要等这么久才会显示在框架中。

## 其他服务器上的文件 {#files-on-other-servers}

erd-editor.io 上的查看器会通过访问者的浏览器，用普通的 `GET` 获取文件，因此保存该文件的服务器必须允许这种跨源请求（CORS）：它的响应需要带有允许 `https://erd-editor.io` 的 `Access-Control-Allow-Origin` 头，例如 `*`。  
请求不带 cookie，因此文件必须无需登录即可读取。  
没有该头，或者地址返回错误或返回的不是 ERD Editor 文档时，框架会显示 `Couldn't load the diagram`。

## 在框架中 {#in-the-frame}

在访问者点击或轻触框架，或用 `Tab` 到达它之前，框架不接收滚轮、手势或按键。在此之前，滚轮、滑动和捏合会像往常一样滚动或缩放它周围的页面。  
一旦它获得焦点，滚轮平移图，`Ctrl + Wheel` (Windows/Linux) 或 `⌘ + Wheel` (Mac) 和捏合会缩放它，`Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 则打开对文档的搜索，其中 `#` 查找表，`@` 查找列，`:` 查找注释或备注。  
无论框架是否获得焦点，拖动都会平移图；点击或轻触会点亮关系：被点击的表的关系，或被点击的那一条关系。指针停留的表会点亮它自己的关系。所有按键参见[焦点与按键](../../api/erd-viewer-element.md#focus-and-keys)。

要在更大的图上试用缩放和搜索，请在单独的页面中打开 [bookstore 示例](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json)，它有九个表和两个表分组。

## 分析 {#analytics}

erd-editor.io 用 Google Analytics 统计对框架的访问，与统计对 Web 应用的访问一样。它为框架记录的地址仅为 `erd-editor.io/embed`，不含 `src` 所指的文档地址。  
参见[隐私政策](https://erd-editor.io/privacy)。

## 自行加载查看器 {#loading-the-viewer-yourself}

能够加载脚本的页面，可以改用 `@dineug/erd-editor` 包中的 [`<erd-viewer>`](../../api/erd-viewer-element.md) 元素来显示图。它以 attribute 和方法的形式接受同样的选项，不会向 erd-editor.io 发出任何请求，并且可以从页面自己的网站加载文档，这不需要 CORS。
