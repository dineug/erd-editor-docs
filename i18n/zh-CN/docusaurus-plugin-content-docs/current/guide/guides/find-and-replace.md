---
sidebar_position: 7
description: 在表名、列名、注释和备注中查找文本，在画布上逐一跳转到每个匹配项，并替换其中一处或全部匹配。
---

# 查找与替换

在整张图中查找文本，带你在 ERD 画布上逐一跳转到每个匹配项，并替换其中一处或全部匹配。  
它搜索五类文本：表名、表注释、列名、列注释和备注文本，参见[搜索的内容](#what-it-searches)。

它是一个位于 ERD 画布左上角、工具栏下方的面板，在[禅模式](./table-related-functions.md#canvas-toolbar)中则位于画布顶部。面板标题为 `Find and Replace`，在 `readonly` 编辑器中为 `Find`，参见[只读编辑器](#read-only-editors)。  
画布较矮时，结果列表会最先让出高度，因此输入框、选项和计数始终完整显示。

![用 ⌘ + F 打开查找与替换，用 Enter 和 Next 按钮逐个跳转到 member 的四个匹配项，再用 Replace All (⌘ + Enter) 把这四处 member 全部替换为 user](/img/demo-find-and-replace.webp)

## 打开与关闭 {#opening-and-closing}

通过 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 打开，也可以通过以下任一方式打开：

- 工具栏中紧跟在 `Search` 之后、带有文本搜索图标的按钮。其提示为 `Find and Replace (Ctrl + F)` (Windows/Linux) 或 `Find and Replace (⌘ + F)` (Mac)。
- [快速搜索](./quick-search.md)中的 `Find and Replace`，每个标签页的列表中都有。输入 `find`、`replace` 或 `rename` 即可找到它。
- 画布右键菜单中的 `Find and Replace`：在 ERD 画布的空白处点击右键。它位于 `New Table` 和 `New Memo` 之后、`Relationship` 之前。

快速搜索和右键菜单中的条目会在右侧显示快捷键。

快捷键和工具栏按钮在每个标签页中都有效。在 Visualization、Schema SQL、Code Generator 或 Settings 标签页中打开时，会先切换到 ERD 标签页，因为匹配项是在那里显示和编辑的。  
在快速搜索打开时按下快捷键，会关闭命令面板并打开查找与替换面板。在编辑表的单元格或备注时，快捷键不起作用。  
打开面板会关闭表属性和主题构建器。

面板显示期间，快捷键、工具栏按钮和这两个条目都不会关闭它，而是把光标放回查找输入框并选中其中的文本，当前匹配项保持不变。

打开表属性或主题构建器会隐藏已打开的面板，但不会关闭它，切换到其他标签页时也是如此。对话框关闭或回到 ERD 标签页后，面板会以离开时的状态重新出现。  
快捷键、工具栏按钮和这两个条目同样可以让隐藏的面板重新出现，但此时会重新搜索其查询内容，并且没有当前匹配项。  
Diff Viewer、Time Travel 或自动布局预览打开期间，面板无法打开：工具栏按钮会变暗且不起作用，快速搜索中不会列出 `Find and Replace`，快捷键则交给浏览器或宿主处理，参见[浏览器的查找栏](#the-browsers-find-bar)。已经打开的面板会被隐藏，直到它们关闭为止。

按 `Escape`，或点击面板标题栏中提示为 `Close (ESC)` 的 `x` 按钮即可关闭。关闭后，键盘焦点会交还给编辑器。

- 在面板中按 `Escape` 会关闭面板并保持选中状态不变，因此最后跳转到的匹配项所在的表或备注仍处于选中状态。
- 在画布上按 `Escape` 同样会关闭面板，并且与未打开面板时一样，同一次按键还会清除选中状态和单元格焦点，参见[快捷键](./settings.md#快捷键)。
- 如果单元格或备注编辑器处于打开状态、正在绘制关系，或快速搜索已打开，这次按键会先由它们处理，面板保持打开。

重新打开时会保留上一次的查询内容（处于选中状态并重新搜索），以及替换文本、[选项](#options)和之前开启的[文本类型](#what-it-searches)。  
这些内容在编辑器保持打开期间一直保留，但不会保存到文档中。新加载的编辑器所有选项均为关闭，只开启 `Table names` 和 `Column names`。

## 浏览器的查找栏 {#the-browsers-find-bar}

编辑器拥有键盘焦点时，`Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 在每个标签页中都归编辑器处理，在编辑器自己的文本输入框中也是如此，因此不会打开浏览器的查找栏。  
Diff Viewer、Time Travel 或自动布局预览打开期间，以及焦点位于编辑器之外时，该按键会传给浏览器或宿主。

- Web 应用和 Google Drive：浏览器的查找栏只会在这两种情况下打开。
- VS Code：扩展在 ERD Editor 中关闭了 VS Code 自带的查找小部件，因此该按键在其中永远不会打开它。
- Obsidian：只要图所在的标签页处于活动状态，该按键就会传给编辑器，而不会执行 Obsidian 的 `Search current file`。
- JetBrains IDE：如果 IDE 的按键映射将 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 留给自己使用，请通过工具栏按钮、快速搜索或画布右键菜单打开面板。

嵌入编辑器的页面可以把该快捷键改为其他按键或将其移除，参见[更改快捷键](#changing-the-shortcut)。

## 搜索的内容 {#what-it-searches}

输入框下方的五个按钮用于选择要搜索的文本类型，依次为 `Table names`、`Table comments`、`Column names`、`Column comments` 和 `Memos`。  
高亮的按钮表示已开启。点击按钮可将其开启或关闭，面板会随之重新搜索。五个全部关闭时，不会找到任何内容。

面板首次打开时只开启 `Table names` 和 `Column names`，因此除非你开启注释和备注，否则重命名不会波及它们。

除此之外的内容都不会被搜索：数据类型、默认值、索引名、数据库名称，以及 Schema SQL 和生成的代码都不在搜索范围内。  
被[表显示选项](./table-related-functions.md#table-view-options)隐藏的注释仍会被搜索。

## 选项 {#options}

查找输入框右侧有三个开关，其名称显示在各自的提示中，用于改变查询的匹配方式。三者初始均为关闭，更改任何一个都会重新搜索。

- `Match Case`：关闭时，匹配不区分大小写。
- `Match Whole Word`：只有两侧都不与相邻单词连在一起的匹配才算数。任何文字的字母、数字和组合标记都算作单词字符，下划线也是。因此 `user` 可以在 `user id` 和 `user.id` 中匹配，但不会在 `users`、`user_id` 或 `superuser` 内部匹配。查询的某一端如果本身不是单词字符，例如 `.id` 中的点，则该端不需要边界。
- `Use Regular Expression`：查询内容是一个 JavaScript 正则表达式，并且始终处于 Unicode 模式，因此可以使用 `\p{L}`。`^` 和 `$` 匹配多行注释或备注中每一行的开头和结尾，`.` 不会跨越换行。名称中常会输入的转义，例如 `\_` 和 `\-`，也可以使用。

无法解析的正则表达式（例如 `user(`）不会列出任何结果：计数会以红色显示 `Invalid regular expression`，查找输入框也会显示红色边框。  
`Match Case` 和 `Match Whole Word` 同样适用于正则表达式。长度为零的匹配（例如单独的 `^`）永远不会被列出。

普通文本会随输入即时搜索。正则表达式会在输入停顿后搜索；按下 `Enter`、导航按钮、`Replace` 或 `Replace All`，或点击某一行时，则会立即搜索。  
搜索没有时间限制，因此大量回溯的正则表达式可能会让编辑器在搜索完成之前失去响应。

## 结果 {#the-results}

文本类型下方的计数行显示你当前所处的位置。查找输入框为空时，计数行也为空。

| 计数 | 情况 |
| --- | --- |
| `No results` | 没有任何匹配。 |
| `12 matches` | 尚未移动到其中任何一个匹配项；只有一个匹配项时显示 `1 match`。 |
| `3 of 12` | 当前匹配项为第三个。 |
| `Invalid regular expression` | 正则表达式无法解析。 |
| `Replaced 12 matches` | `Replace All` 修改了这么多处匹配；只修改了一处时显示 `Replaced 1 match`。 |
| `No changes` | `Replace All` 没有修改任何内容。 |
| `No more matches` | 一轮 `Replace` 已回到开始的位置，参见[替换](#replacing)。 |

其下方的列表中每一处出现各占一行，因此包含两次查询内容的文本会显示为两行。  
各行按文档顺序而不是画布上的位置排列：逐个表列出，先是表名，然后是表注释，再按列的顺序列出每一列的列名和列注释，备注排在最后。

每一行显示：

- 表示文本类型的图标：表名为表格图标，列名为列图标，表注释或列注释为对话气泡，备注为便签。
- 文本的摘录，其中匹配处高亮显示。较长的文本会用 `…` 截断，换行显示为空格。将指针悬停在该行上即可查看完整文本。
- 匹配所在的位置及其类型，例如 `orders.user_id · Column`、`users · Table comment`，或者仅显示 `Memo`。名称为空的表或列显示为 `unnamed`。

当前匹配项所在的行会高亮显示，并滚动到可见位置。  
匹配项超过 200 个时，列表只绘制当前匹配项周围的 200 行，并注明显示的是哪一部分，例如 `Showing 1–200 of 523`。在匹配项之间移动时，这一范围会随之移动。

面板打开期间，列表会跟随文档变化。被搜索文本的任何变更，无论是画布上的编辑、Undo 或 Redo、导入，还是协作者或编码智能体的编辑，都会触发重新搜索；如果当前匹配项仍然存在，它会保持为当前匹配项。选中、滚动和悬停则不会触发重新搜索。  
面板隐藏期间所做的编辑，会在面板重新显示时立即搜索。

## 跳转到匹配项 {#going-to-a-match}

在查找输入框中按 `Enter` 跳转到下一个匹配项，按 `Shift + Enter` 跳转到上一个。计数右侧的上、下箭头按钮作用相同，其提示分别为 `Previous Match (Shift+Enter)` 和 `Next Match (Enter)`。点击某一行即可跳转到该匹配项。  
移动到达两端时会循环。在你第一次移动之前没有当前匹配项，因此第一次按 `Enter` 会跳转到第一个匹配项，第一次按 `Shift + Enter` 则跳转到最后一个。

跳转到匹配项时，如有需要会先切换到 ERD 标签页，然后：

- 对于表名或表注释、列名或列注释，会单独选中该表并将其移到最前面，然后把单元格焦点放在包含匹配项的单元格上。如果匹配位于被[表显示选项](./table-related-functions.md#table-view-options)隐藏的注释中，焦点则落在其旁边的名称上。
- 对于备注，会单独选中该备注并将其移到最前面。

只有当表、列所在的行或备注没有完全显示在面板旁的视野中时，画布才会滚动，并将其置于画布中未被面板遮挡区域的中央。如果画布太窄，面板旁没有足够的空间，则会将其置于整个画布的中央。  
高于屏幕的表会滚动到其表头，宽于屏幕的单元格（例如较长的注释）则滚动到匹配的文本处。在 `70%` 及以下的缩放级别，表会折叠为名称，此时列的匹配项会把其所在的表带入视野。  
这种滚动会像其他视图位置变更一样记录到 [Undo 历史记录](./undo-redo.md#what-the-history-records)中。

用 `Enter` 移动时，光标会留在查找输入框中，因此接下来输入的内容仍会进入面板，而不会进入选中的表。  
跳转到匹配项永远不会开始或完成正在绘制的关系。

## 替换 {#replacing}

查找输入框下方的一行包含 `Replace` 输入框和两个按钮，按钮的提示分别为 `Replace (Enter)` 和 `Replace All`。没有任何匹配项时，两个按钮均不可用。

在替换输入框中按 `Enter`，或点击其按钮，即可执行 `Replace`：

- 没有当前匹配项时，第一次按下只会跳转到下一个匹配项，让你在任何内容发生变化之前先看到将要修改的位置。
- 有当前匹配项时，只替换这一处，同一文本中的其他出现保持不变，然后继续跳转到所写入文本之后的下一个匹配项。即使写入的文本包含查询内容也会被跳过：把 `user` 替换为 `super_user` 之后，不会停在 `super_user` 内部。
- 替换以及随后滚动到下一个匹配项只算一步 Undo。

连续按 `Replace` 时，一旦绕回到开始的位置，这一轮就会停止。计数显示 `No more matches`，没有当前匹配项，再按也不会替换任何内容。  
因此，把 `Customer` 替换为 `Big Customer` 只会替换一次，而不会不断变成 `Big Big Customer`。  
跳转到匹配项，更改查询内容、选项或文本类型，重新打开面板，或执行 `Replace All`，都会开始新的一轮；Undo 或其他任何修改了这一轮起始文本的编辑也是如此。更改替换文本则不会。

在替换输入框中按 `Ctrl + Enter` (Windows/Linux) 或 `⌘ + Enter` (Mac)，或点击其按钮，即可执行 `Replace All`：

- 它会替换已开启的文本类型中的所有匹配项，其他类型保持不变。使用默认的文本类型时，注释和备注不会受到影响。
- 它所做的全部修改只算一步 Undo，参见[一次操作一条记录](./undo-redo.md#一次操作一条记录)。
- 计数显示 `Replaced N matches`，只统计文本实际发生变化的出现。如果没有任何变化，则显示 `No changes`，历史记录中也不会记录任何内容，例如用 `$1` 替换正则表达式 `(user)` 时。
- 随后列表会重新搜索，且没有当前匹配项，因此可能会列出新文本中包含的匹配项。

两者都按按下时各文本的实际内容进行处理，而不是按上一次搜索时找到的内容。

替换文本的使用方式：

- 未开启 `Use Regular Expression` 时，替换文本会按输入的原样插入。`$` 没有特殊含义，匹配文本的大小写也不会被沿用：在 `Match Case` 关闭时，把 `user` 替换为 `member` 会将 `Users` 变为 `members`。
- 开启 `Use Regular Expression` 时，`$1` 到 `$99`、`$<name>`、`$&`、`` $` ``、`$'` 和 `$$` 会像在 JavaScript 的 `String.prototype.replace` 中一样展开。
- 替换输入框为空时，会删除匹配的文本。

替换是一次普通的编辑，与你亲自输入新的表名、注释、列名或备注文本相同。  
它会像其他编辑一样记录到历史记录中，并同步给协作者和编码智能体。

## 面板中的按键 {#keys-in-the-panel}

光标位于面板中时：

- 在查找输入框中，`Enter` 和 `Shift + Enter` 用于在匹配项之间移动；在替换输入框中，`Enter` 和 `Ctrl + Enter` (Windows/Linux) 或 `⌘ + Enter` (Mac) 用于替换；`Escape` 关闭面板。
- 少数编辑器快捷键仍然有效：`Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 会把光标放回查找输入框并选中其中的文本，`Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 用于开关快速搜索，`Undo` 和 `Redo` 撤销与重做的是图而不是输入框中的文本，`Zoom In`、`Zoom Out` 和 `Zoom Reset` 用于缩放画布，参见[快捷键](./settings.md#快捷键)。
- 其他所有编辑器快捷键、方向键和 `Tab` 都留在面板中，作为普通文本输入框的按键使用：`Ctrl + A` (Windows/Linux) 或 `⌘ + A` (Mac) 选中输入框中的文本，`Space` 输入空格，`Tab` 在面板的各个控件之间移动焦点。
- 编辑器未绑定的按键，例如宿主自己的保存快捷键，照常传给宿主。

## 只读编辑器 {#read-only-editors}

在 [`readonly`](../../api/erd-editor-element.md#readonly) 编辑器中，面板只能查找。其标题为 `Find`，并且没有替换输入框和按钮。  
搜索、选项、文本类型、列表以及跳转到匹配项均可正常使用。  
工具栏按钮的提示为 `Find (Ctrl + F)` (Windows/Linux) 或 `Find (⌘ + F)` (Mac)，而快速搜索和右键菜单中的条目仍沿用 `Find and Replace` 这一名称。

VS Code 以只读方式打开的图，例如 git 修订版本或合并预览，使用的就是这种只能查找的面板。

## 从快速搜索打开 {#from-quick-search}

在 `#`、`@` 和 `:` 前缀下，[快速搜索](./quick-search.md)最多列出 100 行。  
如果这一上限漏掉了按原样包含关键字的文本，这 100 行之后还会多出一行：`Show all N matches in Find and Replace` 或 `Show 1 match in Find and Replace`。它会以相同的搜索打开此面板：

- 关键字成为查询内容，并关闭 `Match Case`、`Match Whole Word` 和 `Use Regular Expression`。
- 只开启该前缀所对应的文本类型：`#` 对应 `Table names`，`@` 对应 `Column names`，`:` 对应 `Table comments`、`Column comments` 和 `Memos`。
- `@table.column` 只会传递列的部分，因此面板会列出所有表中匹配的列。
- N 是面板打开时的匹配项数量。

Diff Viewer、Time Travel 或自动布局预览打开期间，不会提供这一行。  
它所设置的选项和文本类型会保留到之后的打开中，因此通过 `#` 打开后，在你重新开启其他类型之前，只有 `Table names` 处于开启状态。

## 更改快捷键 {#changing-the-shortcut}

嵌入编辑器的页面可以通过 [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) 以 `findReplace` 为名重新绑定或移除 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac)。  
移除后，该按键在每个标签页中都交给页面处理。工具栏按钮、快速搜索和画布右键菜单仍可打开面板，但不会显示快捷键；设置中[快捷键](./settings.md#快捷键)标签页上的 `Find and Replace` 行同样不显示快捷键。
