---
sidebar_position: 17
description: 编辑器的 25 种显示语言、从右到左排布，主题构建器的 System、Light 和 Dark 外观及其颜色，以及各宿主保存它们的位置。
---

# 语言与主题

编辑器自身的文本提供 25 种语言，其样式则是一个主题：由外观（`System`、`Light` 或 `Dark`）、灰阶色和强调色组成。  
两者都属于使用编辑器的人，而不属于图。它们既不会保存到文件中，也不会记录到 [Undo 历史记录](./undo-redo.md)中，也不会与协作者共享，因此每个人看到的都是自己的选择，更改其中任何一项也永远不会将文件标记为已修改。

两者都不在 [Settings](./settings.md) 标签页中。工具栏中有一个 `Theme` 按钮，紧随其后是 `Display Language` 按钮，两者都位于 [`Explorer`](./explorer.md) 按钮之后。[快速搜索](./quick-search.md)在每个标签页中都会列出 `Theme` 和 `Display Language`。  
Web 应用、Google Drive、VS Code、JetBrains IDE 和 Obsidian 都提供这两者，并会记住你的选择，参见[在各宿主中](#in-each-host)。在只读编辑器中两者同样可用。

## 显示语言 {#display-language}

语言涵盖编辑器自身的文本：工具栏的提示、画布工具栏和 Flow 工具栏上的 [`Name View`](./logical-names.md#switching-the-view) 按钮、Flow 的行显示菜单、右键菜单、快速搜索、面板和对话框、[Dictionary](./dictionary.md) 标签页（其工作表名称、列标题、工具、菜单、状态行以及 `Checks` 工作表所列检查项的种类）、Settings 标签页、[欢迎界面](./editing-start.md#欢迎界面)、弹出提示和消息，以及空的名称、逻辑名、数据类型、域、默认值或注释在画布上和导出的图片中显示的占位文字。  
在任何语言下，以下内容都保持原样：你的表名和列名、[逻辑名](./logical-names.md)、注释和备注；你在 Dictionary 标签页中维护的词根、术语和域；数据库厂商、Code Generator 的语言和文件格式；数据类型、SQL 关键字，以及 `ON DELETE` 与 `ON UPDATE` 操作；Schema SQL 的选项 `Create`、`If not exists`、`Drop & re-create`、`USE` 和 `CREATE + USE`；标记 `PK`、`FK`、`UQ`、`AI`、`NN`、`N-N`、`NULL` 和 `AK1.1`；[Diff Viewer](./table-related-functions.md#diff-viewer) 的状态字母 `A`、`M`、`D`、`R` 和 `~`；名称大小写与 `Bracket` 中除 `None` 以外的选项；键盘按键的名称；主题构建器中的颜色名称；生成的 SQL 和代码；导出的词典 CSV 的标题行；以及导出的文件名。

在 Dictionary 标签页中，排序会按显示语言的字母顺序排列各行，`Checks` 工作表的搜索会按单元格在显示语言中的文字进行匹配，参见[排序](./dictionary.md#sorting)和[搜索](./dictionary.md#searching)。

各语言按选择器中的排列顺序如下：

| 选择器中的名称 | 语言 | 代码 |
| --- | --- | --- |
| Bahasa Indonesia | 印度尼西亚语 | `id-ID` |
| Deutsch | 德语 | `de-DE` |
| English | 英语 | `en` |
| Español | 西班牙语 | `es-ES` |
| Euskara | 巴斯克语 | `eu-ES` |
| Français | 法语 | `fr-FR` |
| Italiano | 意大利语 | `it-IT` |
| Nederlands | 荷兰语 | `nl-NL` |
| Polski | 波兰语 | `pl-PL` |
| Português | 葡萄牙语 | `pt-PT` |
| Português Brasileiro | 巴西葡萄牙语 | `pt-BR` |
| Română | 罗马尼亚语 | `ro-RO` |
| Slovenčina | 斯洛伐克语 | `sk-SK` |
| Slovenščina | 斯洛文尼亚语 | `sl-SI` |
| Svenska | 瑞典语 | `sv-SE` |
| Türkçe | 土耳其语 | `tr-TR` |
| Русский | 俄语 | `ru-RU` |
| Українська | 乌克兰语 | `uk-UA` |
| עברית | 希伯来语 | `he-IL` |
| العربية | 阿拉伯语 | `ar-SA` |
| فارسی | 波斯语 | `fa-IR` |
| 日本語 | 日语 | `ja-JP` |
| 简体中文 | 简体中文 | `zh-CN` |
| 繁體中文 | 繁体中文 | `zh-TW` |
| 한국어 | 韩语 | `ko-KR` |

快速搜索在 Code Generator 标签页中提供的 `Language`，以及 Settings 标签页中[锁定](./settings.md#锁定)列表的 `Language` 行，指的都是 [Code Generator 的目标语言](./code-generator.md#语言)，而不是显示语言。

### 选择语言 {#picking-a-language}

`Display Language` 按钮（语言图标）会打开 `Display Language` 选择器，这是一个位于工具栏下方、标题为 `Display Language` 的面板，覆盖在当前打开的任意标签页之上。  
`System` 排在第一位，旁边显示它当前所代表的语言，列表滚动时它始终保持可见。其后是 25 种语言，每种语言都以其自身的名称显示，当前选项处于勾选状态。

![从工具栏将显示语言切换为 한국어，再切换为 العربية，工具栏随之镜像而图保持不变，最后切回 System](/img/demo-display-language.webp)

面板打开时，键盘焦点位于勾选的行上：

- `↑` 和 `↓` 会在各行之间移动，到达两端时会循环；`Home` 和 `End` 会跳到第一行和最后一行。
- `Enter` 或 `Space` 会选择获得焦点的行，与点击相同。

选择会立即生效，同时关闭面板，并将键盘焦点交还给编辑器。

若不做选择就关闭面板，可以按 `Escape`、点击标题旁边提示为 `Close (ESC)` 的 `x` 按钮、在编辑器中除面板和工具栏以外的任意位置按下，或再次点击 `Display Language` 按钮。  
打开它会关闭主题构建器和表属性。已打开的[资源管理器](./explorer.md#dialogs-beside-it)保持打开；在从左到右书写的语言中，选择器会紧挨着它显示，而不会覆盖在它上面。  
打开快速搜索或主题构建器则会关闭它，按下 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 也是如此。该按键会打开[资源管理器](./explorer.md#opening-and-closing)并定位到其搜索；如果资源管理器已经打开，则保持打开，并将键盘焦点移到其查找输入框。工具栏中的 `Explorer` 按钮则不会关闭选择器。

面板持有键盘焦点期间，仍有几个编辑器快捷键有效：`Search`、`Toggle Explorer`、`Undo`、`Redo`、`Zoom In`、`Zoom Out` 和 `Zoom Reset`，参见[快捷键](./settings.md#快捷键)。其他所有编辑器快捷键、方向键和 `Tab` 都只停留在面板中，因此编辑器不会对它们作出响应。编辑器未绑定的按键，例如宿主自身的保存，会照常传给宿主。

在[快速搜索](./quick-search.md)中，`Display Language` 列出 `System` 和 25 种语言，当前选项处于勾选状态。在这里还可以通过语言的英文名称或代码找到它，因此 `german` 或 `de-DE` 可以找到 `Deutsch`。

### System 跟随的语言 {#what-system-follows}

在 Web 应用、Google Drive、VS Code、JetBrains IDE 和 Obsidian 中，语言初始为 `System`。它跟随宿主的语言：

- 在 Web 应用、Google Drive 和自有页面中：浏览器的首选语言。首选语言发生变化时会立即跟随。
- 在 VS Code 中：VS Code 的显示语言。
- 在 JetBrains IDE 中：IDE 自身界面所用的语言。
- 在 Obsidian 中：Obsidian 的语言。

`System` 会采用这些语言中编辑器提供的第一种，一种都没有时则采用英语。  
地区变体算作其所属的语言，因此 `de-AT` 对应 Deutsch，`fr-CA` 对应 Français。中文按文字区分：繁体字对应繁體中文，其他文字对应简体中文。未指明文字时，台湾、香港或澳门对应繁體中文，其他中文对应简体中文。葡萄牙语对应 Português Brasileiro，除非指明了巴西以外的地区，因此 `pt-PT` 对应 Português；Obsidian 的葡萄牙语同样对应 Português。

### 从右到左书写的语言 {#right-to-left-languages}

עברית（希伯来语）、العربية（阿拉伯语）和 فارسی（波斯语）会让编辑器从右到左排布：工具栏、各菜单、面板和对话框、快速搜索、Dictionary 标签页的顶部栏和状态行以及 Settings 标签页都会镜像显示。右键菜单的子菜单向左展开，工具栏的 Undo 和 Redo 图标也会互换，使 Undo 按照从右到左的阅读方向指向后方。

图本身永远不会镜像。画布及其中的表、列、关系和备注保持从左到右，小地图、滚动条、[画布工具栏](./table-related-functions.md#canvas-toolbar)、[Visualization](./visualization.md) 及其工具栏、数据类型单元格、Dictionary 标签页中的工作表和术语的域列表、Schema SQL 与 Code Generator 标签页中的代码、选色器、Diff Viewer 的两侧、Time Travel 以及自动布局预览也是如此。  
在 Flow 中，Visualization 工具栏上的两个箭头保持各自的位置，但作用互换：指向右侧的箭头是 `Previous table`，指向左侧的箭头是 `Next table`，因此后退的箭头与 Undo 指向同一方向。Undo 和 Redo 按键仍然分别后退和前进，参见[上一个表与下一个表](./visualization.md#previous-table-and-next-table)。  
[资源管理器](./explorer.md#beside-the-canvas)仍位于画布左侧，Diff Viewer 的变更树也仍位于查看器左侧，两者的拖动边缘都在其右侧。两者内部则从右到左阅读：输入框和各行都会镜像显示，各行从右侧缩进；在这两棵树中，`←` 会展开一行或移到其第一个子项，而 `→` 会折叠该行或退回到其父项，参见[资源管理器中的按键](./explorer.md#keys-in-the-explorer)。  
名称、注释以及你输入的其他文本保持其自身的书写方向，因此希伯来语、阿拉伯语或波斯语的名称在画布上同样从右到左阅读。词典提示中列出的每个名称同样保持其自身的书写方向。

## 主题 {#theme}

`Theme` 按钮（对比度图标）会打开主题构建器，这是一个位于工具栏下方、标题为 `Theme` 的面板，覆盖在当前打开的任意标签页之上。它由三部分组成：

- `Accent color`：26 个色块，每个色块的提示显示其名称，例如 `indigo`。
- `Gray color`：6 个色块，即 `gray`、`mauve`、`slate`、`sage`、`olive` 和 `sand`。
- `Appearance`：`System`、`Light` 和 `Dark`。

![从工具栏打开主题构建器，选择强调色和灰阶色，再将外观切换为 Light，然后切换为 System](/img/demo-theme-builder.webp)

每部分中当前的选择都有标记，选择会立即生效，构建器则保持打开。  
选择颜色不会改变外观，因此在 `System` 下选择颜色后，外观仍为 `System`。

`System` 会与宿主一样显示浅色或深色，并在宿主切换时随之切换：

- 在 Web 应用、Google Drive 和自有页面中：浏览器报告的浅色或深色模式，它跟随操作系统。
- 在 VS Code 中：使用浅色颜色主题时为浅色，使用深色颜色主题或任一高对比度主题时为深色。
- 在 JetBrains IDE 中：IDE 的浅色或深色主题。
- 在 Obsidian 中：Obsidian 的浅色或深色主题。

关闭构建器可以按 `Escape`、点击标题旁边提示为 `Close (ESC)` 的 `x` 按钮、在编辑器中除面板和工具栏以外的任意位置按下，或再次点击 `Theme` 按钮。  
打开它会关闭表属性和 `Display Language` 选择器。已打开的[资源管理器](./explorer.md#dialogs-beside-it)保持打开；在从左到右书写的语言中，构建器会紧挨着它显示，而不会覆盖在它上面。  
打开快速搜索或 `Display Language` 选择器则会关闭它，按下 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 也是如此。该按键会打开[资源管理器](./explorer.md#opening-and-closing)并定位到其搜索；如果资源管理器已经打开，则保持打开，并将键盘焦点移到其查找输入框。工具栏中的 `Explorer` 按钮则不会关闭构建器。  
构建器不会拦截任何按键，因此它打开期间编辑器的快捷键照常有效。

在[快速搜索](./quick-search.md)中，`Theme` 列出 `System`、`Light` 和 `Dark`，当前的外观处于勾选状态。选择其中一项只会改变外观，灰阶色和强调色保持不变。

## 在各宿主中 {#in-each-host}

在编辑器中通过工具栏或快速搜索所做的选择，会保存到宿主存放它的位置；无论在哪里做出更改，所有打开的图都会立即跟随。  
在 VS Code、JetBrains IDE 和 Obsidian 中，宿主的 `Auto`（在 VS Code 中为值 `auto`）就是编辑器的 `System`。选择 `System` 会保存 `Auto`，选择 `Light` 或 `Dark` 则会保存该外观，即使 `Auto` 当时已经在显示该外观也是如此。  
无论显示语言是什么，扩展和插件自身的设置与通知都以英语显示。

### Web 应用与 Google Drive {#web-app-and-google-drive}

在 erd-editor.io（包括其协同编辑会话）以及 Google Drive 中，应用及其中的每张图共用同一种语言和同一个主题。  
两者都保存在当前浏览器中，而不是保存在 schema 或 Drive 文件中，并且 erd-editor.io 的所有标签页共享它们：在一个标签页中所做的选择会立即改变其他标签页。

在你选择语言之前，语言为 `System`，跟随浏览器的首选语言。  
应用自身的文本，例如侧边栏、回收站、协同编辑以及 Google Drive 的各个界面，也跟随同一种语言；在希伯来语、阿拉伯语和波斯语中，整个应用从右到左排布。隐私政策、服务条款和支持页面保持英语。  
除了编辑器的面板和快速搜索之外，侧边栏最下方一行在 `Privacy` 和 `Terms` 链接旁边还有一个提示为 `Display Language` 的语言按钮。其菜单先列出 `System` 及其所代表的语言，然后是 25 种语言。

主题初始为 `System`，灰阶色为 `olive`，强调色为 `jade`。  
除了主题构建器和快速搜索之外，侧边栏底部还有 `System`、`Light` 和 `Dark` 三个图标按钮：在 erd-editor.io 中位于 `Trash` 旁边，在 Google Drive 中位于 `Sign out` 旁边。它们设置的外观与构建器相同。

### VS Code

扩展的设置位于 VS Code 的 Settings 中的 ERD Editor 下：

| 设置 | 值 | 默认值 |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`，或[语言表](#display-language)中的代码 | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`、`light`、`dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | 六种灰阶色 | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 种强调色 | `indigo` |

Settings 编辑器将语言设置列为 `Auto`，然后是以各自名称显示的每种语言。`settings.json` 中未指明任何语言的值会被视为 `auto`。  
在编辑器中选择主题会写入全部三个主题设置。选择会写入该设置已有值的位置：优先为工作区文件夹，其次为工作区，否则为用户设置。

### JetBrains IDE {#jetbrains-ides}

Settings | Tools | ERD Editor 中有 `Appearance:`（`Auto`、`Light`、`Dark`）、`Gray color:`、`Accent color:` 和 `Display language:`（`Auto`，然后是以各自名称显示的每种语言），在整个 IDE 范围内统一保存。  
它们的初始值依次为 `Auto`、`Slate`、`Indigo` 和 `Auto`。

### Obsidian

Settings → ERD Editor 中有 `Appearance`（`Auto`、`Light`、`Dark`）、`Gray color`、`Accent color` 和 `Display language`（`Auto`，然后是以各自名称显示的每种语言），按仓库分别保存。  
它们的初始值依次为 `Auto`、`Slate`、`Indigo` 和 `Auto`。  
更改会应用到该仓库的所有 ERD 标签页，包括弹出窗口中的标签页。

### 自有页面 {#your-own-page}

在自有页面中使用的 `<erd-editor>` 不会显示 `Theme` 或 `Display Language` 按钮，快速搜索也不会列出这两者，直到页面通过 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) 和 [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker) 将其开启。  
在页面设置语言或读者选择语言之前，编辑器显示英语；开启 `enableLocalePicker` 时则跟随 `System`。  
除非页面设置了其他主题或开启了 [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode)，主题初始为 `Dark`，灰阶色为 `slate`，强调色为 `indigo`。  
读者的选择会立即生效，但该元素不会保存任何一项选择：由页面设置初始值，并自行保存读者的选择，参见 API 中的 [Theme](../../api/erd-editor-element.md#theme) 和 [Display Language](../../api/erd-editor-element.md#display-language)。
