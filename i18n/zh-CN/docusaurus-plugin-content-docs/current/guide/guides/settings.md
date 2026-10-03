---
sidebar_position: 11
description: 关系数据类型同步、视图位置与缩放信息保存、注释最大宽度、重新计算表宽度、列显示顺序以及快捷键列表。
---

# 设置

通过工具栏的 `Settings` 按钮打开，也可以在[快速搜索](./quick-search.md)的 `Tab` 中打开。
设置界面由 `Preferences` 和 `Shortcuts` 两个标签页组成，默认先打开 `Preferences`。

主题颜色不在此界面中。
主题颜色在主题构建器中设置，通过工具栏的 `Theme` 按钮打开，并且仅在宿主通过 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) 启用后才会显示。

在 VS Code、Obsidian 和 JetBrains IDE 中，主题构建器的三个值（外观、灰阶色和强调色）同时也是宿主的设置，在构建器中选择的内容会保存到那里。
VS Code 将它们保存为 `dineug.erd-editor.theme.appearance`、`dineug.erd-editor.theme.grayColor` 和 `dineug.erd-editor.theme.accentColor`，外观默认为 `dark`。
Obsidian 将它们按仓库分别保存在 Settings → ERD Editor 下，JetBrains IDE 则保存在 Settings | Tools | ERD Editor 下，对整个 IDE 生效。两者的默认值均为 `Auto`，它会跟随宿主的浅色或深色主题，并随之切换。
构建器本身只提供 `Light` 和 `Dark`。
在 Obsidian 和 JetBrains IDE 中，除非选择 `Auto` 当前未显示的那种外观，否则设置会一直保持为 `Auto`。
在 VS Code 中，每次选择都会保存全部三个值，因此在外观为 `auto` 时，即使只选择一种颜色，外观也会被替换为 `light` 或 `dark`。

## 关系数据类型同步

决定是否同步数据类型。默认开启。
修改某一列的数据类型后，会将相同的类型应用到通过关系连接的所有列，并从两端沿着连接链传递，因此外键不会与其引用的键产生偏差。

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="关系数据类型同步设置" loading="lazy" />

![将 members.id 改为 BIGINT UNSIGNED 后，通过关系连接的所有 member_id 随之同步](/img/demo-relationship-data-type-sync.webp)

## 保存滚动信息

决定是否将视图位置保存到文档中。该开关本身也保存在文档中：新建的图默认关闭，打开的文件则沿用保存时的设置。
关闭后，文档会以重置的视图原点保存，因此打开时看到的是图本身，而不是你上次停留的位置，滚动也永远不会改动文件。

新建的图是指从零开始的图：在 VS Code、Obsidian 或 JetBrains IDE 中打开的空文件（Obsidian 的 `ERD Editor: Create new diagram` 和 `New ERD` 会创建这样的文件）、Web 应用中新建的 schema、通过 Google Drive 的 New 菜单创建的文件，或未赋值的 `<erd-editor>`。`Save Zoom Information` 在这些情况下同样默认关闭。
Web 应用通过导入 SQL、DBML、AML 或 GraphQL 文件创建的 schema 或 Google Drive 文件，两个开关同样默认关闭。由 JSON 文件创建的则沿用该文件中的开关设置。
未记录这两个开关的文件，例如由早期版本保存或手工编写的文件，打开时两个开关均为开启。

## 保存缩放信息

决定是否将缩放级别保存到文档中。与 `Save Scroll Information` 一样，它在新建的图中默认关闭，打开的文件则沿用保存时的设置。
关闭后，文档会以 `100%` 保存，因此打开时不带缩放。
缩放还会移动视图位置，使缩放所围绕的点保持不动。因此只关闭这一个开关时，缩放仍会通过视图位置改动文件。只有两个开关都关闭时，缩放才会让文件保持原样。

文档不保存的滚动或缩放不算作变更。VS Code 不会将标签页标记为已修改，Obsidian 和 JetBrains IDE 也会让文件保持原样，无论是它们自行保存时还是关闭标签页时。
因此，两个开关都关闭时，在图中四处浏览永远不会出现在 `git diff` 中，即使是由其他版本或在其他机器上写入、一经保存字节就会改变的文件，也是如此。
两个开关都不涉及编辑器当前打开的是哪个标签页。文档会记录离开时停留在 ERD、Visualization、Schema SQL、Code Generator 还是 Settings 标签页，因此在 VS Code、Obsidian 和 JetBrains IDE 中，在这些标签页之间切换仍会改动文件。
新建的图所对应的空文件会一直保持为空，直到第一次编辑，或第一次切换到这些标签页中的另一个。
VS Code 以只读方式打开的图，例如 git 修订版本或合并预览，永远不会被标记为已修改。
在 Google Drive 中，无论这两个开关如何设置，滚动、缩放或切换到其他标签页都不会单独保存。视图只会随其他变更一起写入，因此开启 `Save Scroll Information` 时，Drive 文件打开时的视图位于其上次保存时的位置。

## 注释最大宽度

以像素为单位指定注释列的最大宽度（`60` ~ `200`）。
关闭开关则不再限制，关闭期间输入框不可用。
重新开启时从 `60px` 开始。输入超出范围的值会被调整为最接近的端值。

![开启注释最大宽度并输入 120，回到 ERD 标签页后注释按该宽度截断](/img/demo-settings-comment-width.webp)

## 重新计算表宽度

按 `Sync` 会根据当前文本重新计算所有表和列单元格的宽度，并按照新的尺寸重新绘制关系连接线。
完成后会显示 `Recalculated table width` 提示。
每次加载文档时都会自动重新计算宽度，因此只有在字体或渲染发生变化导致宽度过时时才需要使用。

## 调整列顺序 {#adjusting-column-order}

设置表中列的显示顺序。
拖动行即可移动，整行都可以拖动，并以拖动手柄图标标识。默认顺序下的七行依次为 `Name`、`DataType`、`Not Null`、`Unique`、`Auto Increment`、`Default` 和 `Comment`。
被[表显示选项](./table-related-functions.md#table-view-options)隐藏的单元格仍会在列表中保留位置，因此该顺序适用于实际显示的单元格。
[备用键](./table-related-functions.md#alternate-keys)标记（`AK1.1` 等）不属于这些行。它始终位于行的最后，排在此顺序中最后一个单元格之后。

![将 Comment 行拖到 Name 下方，注释随即显示在列名之后](/img/demo-settings-column-order.webp)

## 快捷键

`Shortcuts` 标签页是一个由 `Command` 与 `Keybinding` 组成的只读表格，列出当前所用平台的按键绑定。

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Find and Replace](./find-and-replace.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

其中大多数仅在 ERD 标签页生效，并且在快速搜索、表属性、Diff Viewer、自动布局预览或 Time Travel 打开期间不会触发。
`Search`、`Find and Replace` 与 `Stop` 是例外。`Search` 可以在任意标签页中开关快速搜索，`Find and Replace` 可以在任意标签页中打开[查找与替换面板](./find-and-replace.md#opening-and-closing)并切换到 ERD 标签页，`Stop` 则用于关闭快速搜索、表属性、Diff Viewer、自动布局预览、Time Travel、主题构建器和查找与替换面板。
Diff Viewer、自动布局预览或 Time Travel 打开期间，`Find and Replace` 会把它的按键交给浏览器或宿主处理，参见[浏览器的查找栏](./find-and-replace.md#the-browsers-find-bar)。
在 ERD 标签页中，`Stop` 会关闭已打开的单元格或备注编辑器，或取消正在绘制的关系，并保持选中状态不变。以上情况都不存在时，它会清除选中状态和单元格焦点，并在同一次按键中关闭已打开的查找与替换面板。
查找与替换面板打开期间，画布上的快捷键仍会照常触发。关于在面板中按下的按键，参见[面板中的按键](./find-and-replace.md#keys-in-the-panel)。
`Zoom In`、`Zoom Out` 与 `Zoom Reset` 同样可以缩放 [Visualization](./visualization.md#toolbar) 标签页，`Graph` 与 `Flow` 均适用，快速搜索打开期间除外。
在 Visualization 标签页中，`Stop` 还会关闭[行显示](./visualization.md#row-display)菜单，并取消仍在进行中的 [Flow 布局](./visualization.md#how-flow-is-placed)；但它不会扩大通过 `Focus on this table` 缩小的视图范围。
`Focus on this table` 会以 `Flow` 打开 Visualization 标签页，范围缩小到选中的表以及与它们相隔一条关系的所有表，没有选中任何表时不起作用。参见[聚焦于表](./visualization.md#focusing-on-tables)。
`Select All Table, Memo` 与 `Hand Tool` 会让位于光标：在编辑单元格或在查找与替换面板中输入时，`Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 选中的是文本，`Space` 输入的是空格。
复制与粘贴使用浏览器自身的 `Ctrl + C` 与 `Ctrl + V` (Windows/Linux) 或 `⌘ + C` 与 `⌘ + V` (Mac)，因此不在此列表中，参见[编辑表](./table-editing.md)。

在此标签页中无法更改按键绑定。
嵌入编辑器的宿主可以通过 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) 重新映射，但 `Editing`、`Stop`、`Undo`、`Redo`、`Zoom In`、`Zoom Out` 和 `Zoom Reset` 是固定的。
此时 `Shortcuts` 标签页列出的是宿主的按键绑定：宿主未重新映射的命令保留默认按键，宿主未绑定任何按键的命令则不显示按键。

在 Obsidian 中，只要该图所在的 Obsidian 标签页处于活动状态，这些按键就会传给编辑器，即使某个 Obsidian 快捷键使用了相同的按键也是如此，例如 `Alt + Enter`、`Ctrl + K` 和 `Ctrl + F` (Windows/Linux) 或 `⌥ + Enter`、`⌘ + K` 和 `⌘ + F` (Mac)。在该标签页中，其他所有 Obsidian 快捷键仍然有效。关于 `Ctrl + F` 或 `⌘ + F`，参见[浏览器的查找栏](./find-and-replace.md#the-browsers-find-bar)。
