---
sidebar_position: 10
description: 关系数据类型同步、滚动与缩放信息保存、注释最大宽度、重新计算表宽度、列显示顺序以及快捷键列表。
---

# 设置

通过工具栏的 `Settings` 按钮打开，也可以在[快速搜索](./quick-search.md)的 `Tab` 中打开。
设置界面由 `Preferences` 和 `Shortcuts` 两个标签页组成，默认先打开 `Preferences`。

主题颜色不在此界面中。
主题颜色在主题构建器中设置，通过工具栏的 `Theme` 按钮打开，并且仅在宿主通过 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) 启用后才会显示。

## 关系数据类型同步

决定是否同步数据类型。默认开启。
修改某一列的数据类型后，会将相同的类型应用到通过关系连接的所有列，并从两端沿着连接链传递，因此外键不会与其引用的键产生偏差。

<img src="/img/settings-relationship-data-type-sync.png" width="400" alt="关系数据类型同步设置" loading="lazy" />

![demo-relationship-data-type-sync](/img/demo-relationship-data-type-sync.webp)

## 保存滚动信息

决定是否将滚动位置保存到文档中。默认开启。
关闭后，文档会以重置的滚动位置保存，因此打开时显示在左上角。

## 保存缩放信息

决定是否将缩放级别保存到文档中。默认开启。
关闭后，文档会以 `100%` 保存，因此打开时不带缩放。

## 注释最大宽度

以像素为单位指定注释列的最大宽度（`60` ~ `200`）。
关闭开关则不再限制，关闭期间输入框不可用。
重新开启时从 `60px` 开始。输入超出范围的值会被调整为最接近的端值。

<img src="/img/settings-comment-width.png" width="400" alt="注释最大宽度设置" loading="lazy" />
<img src="/img/settings-comment-width-2.png" width="400" alt="应用到图上的注释最大宽度" loading="lazy" />

## 重新计算表宽度

按 `Sync` 会根据当前文本重新计算所有表和列单元格的宽度，并按照新的尺寸重新绘制关系连接线。
完成后会显示 `Recalculated table width` 提示。
每次加载文档时都会自动重新计算宽度，因此只有在字体或渲染发生变化导致宽度过时时才需要使用。

## 调整列顺序 {#adjusting-column-order}

设置表中列的显示顺序。
拖动行即可移动，整行都可以拖动，并以拖动手柄图标标识。默认顺序下的七行依次为 `Name`、`DataType`、`Not Null`、`Unique`、`Auto Increment`、`Default` 和 `Comment`。
被[表显示选项](./table-related-functions.md#table-view-options)隐藏的单元格仍会在列表中保留位置，因此该顺序适用于实际显示的单元格。

![demo-settings-column-order](/img/demo-settings-column-order.webp)

## 快捷键

`Shortcuts` 标签页是一个由 `Command` 与 `Keybinding` 组成的只读表格，列出当前所用平台的按键绑定。

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + Alt + A` | `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |

其中大多数仅在 ERD 标签页生效，并且在快速搜索、表属性、Diff Viewer、自动排列表或 Time Travel 打开期间不会触发。
`Search` 与 `Stop` 是例外。`Search` 可以在任意标签页中开关快速搜索，`Stop` 则用于关闭快速搜索、表属性、Diff Viewer、自动排列表、Time Travel 和主题构建器。
复制与粘贴使用浏览器自身的 `Ctrl + C` 与 `Ctrl + V` (Windows/Linux) 或 `⌘ + C` 与 `⌘ + V` (Mac)，因此不在此列表中，参见[编辑表](./table-editing.md)。

在此标签页中无法更改按键绑定。
嵌入编辑器的宿主可以通过 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) 重新映射，但 `Editing`、`Stop`、`Search`、`Undo`、`Redo`、`Zoom In` 和 `Zoom Out` 是固定的。
