---
sidebar_position: 7
description: 打开命令面板，切换标签页、执行当前标签页的命令、打开查找与替换、更改主题或显示语言，或输入前缀跳转到表、列、注释或备注。
---

# 快速搜索

快速搜索是编辑器的命令面板。  
它会列出当前标签页可用的命令。在搜索开头输入 `#`、`@` 或 `:`，则会改为搜索图，并跳转到表、列，或者注释或备注。

通过 `Ctrl + K` (Windows/Linux) 或 `⌘ + K` (Mac) 打开，也可以点击工具栏的 `Search`。  
再次按下同一快捷键即可关闭，按 `Esc` 或点击面板外部也可关闭。打开时会关闭表属性、[主题构建器](./language-and-theme.md#theme)、[`Display Language`](./language-and-theme.md#picking-a-language) 选择器、[`Export image`](./file-import-export.md#image) 对话框以及[映射列](./relationship-editing.md#map-columns)，在映射列中已做的选择会被丢弃。在编辑表的单元格、备注或表分组的名称时则无法打开。

工具栏中紧跟在 `Search` 之后的按钮打开的是[查找与替换](./find-and-replace.md)面板，而不是命令面板。  
打开命令面板时，查找与替换面板会保持打开，此时按 `Esc` 只会关闭命令面板。在命令面板中按 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac) 会关闭命令面板并打开查找与替换面板，参见[打开与关闭](./find-and-replace.md#opening-and-closing)。  
嵌入编辑器的宿主可以将快速搜索绑定到其他按键，此时 `Search` 的提示会显示该按键，参见[快捷键](./settings.md#快捷键)。

![用 ⌘ + K 打开命令面板，再用 #pay 跳转到表，用 @price 跳转到列，用 :address 跳转到表注释](/img/demo-quick-search.webp)

## 搜索与导航

输入文字即可过滤列表。每次按键都会对当前显示的整个列表重新搜索，因此删除字符，或者用新词替换没有找到任何结果的词，都会让匹配的条目重新出现。  
匹配为模糊匹配，涵盖条目名称及其旁边显示的关键字。例如在 `Import` 子菜单中，`sdl` 可以找到 `GraphQL`，`dbdiagram` 可以找到 `DBML`，`azimutt` 可以找到 `AML`。轻微的拼写错误仍能找到对应的条目，例如 `tabel` 可以找到 `New Table`，`imprt` 可以找到 `Import`；但与输入内容只是大致相似的条目会被排除：`memo` 只会列出 `New Memo`。名称或关键字中包含输入内容（不区分大小写）的条目总会被列出，模糊匹配漏掉的这类条目排在模糊匹配的结果之后。条目中凡是包含输入内容的地方都会高亮显示，不区分大小写。  
当显示语言不是英语时，命令和子菜单条目也可以通过其英文名称和关键字找到，列表中不会显示这些英文名称和关键字，因此无论 `New Table` 以哪种语言显示，`new table` 都能找到它。  
使用 `↑` 和 `↓` 在列表中移动，到达两端时会循环，按 `Enter` 执行高亮的条目。带有独立快捷键的命令会在其所在行的末端显示该快捷键：位于右侧；在从右到左书写的显示语言中则位于左侧。输入法仍在组字时（例如正在输入一个韩文音节），`↑`、`↓` 和 `Enter` 归输入法处理，既不会移动高亮，也不会执行条目。

`Database`、`Import` 或 `Auto Layout` 之类的条目会打开子菜单，其条目会替换当前列表，搜索框也会被清空。`Database`、`Bracket`、`Language`、两种名称大小写、`Schema SQL: Statements`、`Schema SQL: Header`、`Theme` 和 `Display Language` 的子菜单会勾选当前的选择，并在打开时将高亮置于该项上，因此直接按 `Enter` 会保留当前选择；其他子菜单打开时没有任何条目处于高亮状态。  
过滤始终只作用于当前显示的列表，并且无法返回上一级，因此需要关闭并重新打开命令面板才能重新开始。在子菜单中，`#`、`@`、`:` 和 `?` 只是普通文本，而不是[前缀](#searching-the-diagram)。

## 命令面板列出的内容 {#what-the-palette-lists}

列表内容取决于当前所在的标签页。每个标签页的列表都以 `Tab` 开头，用于切换到 `Entity Relationship Diagram`、`Visualization`、`Schema SQL`、`Code Generator` 或 `Settings`，当前所在的标签页不会出现在其中。

在 ERD 标签页中，列表依次包含 `Database`、`Import`、`Import and Add` 与 `Export`，然后是 `New Table`、`New Memo`、`New Table Group` 与 `Group Selected Tables`，以及四种关系类型和 `Auto Layout`。这里不会列出表，输入 `#` 即可[跳转到表](#searching-the-diagram)。  
在只读编辑器中不会列出 `Import and Add`；当 [View Option](./table-related-functions.md#table-view-options) → `Memos` 隐藏了备注时，不会列出 `New Memo`。`New Table Group` 会开始在画布上绘制一个[表分组](./table-groups.md)，`Group Selected Tables` 会把选中的表放入一个新分组，并打开该分组的名称编辑器以便输入名称。在只读编辑器中，以及当 View Option → `Table Groups` 隐藏了表分组时，这两项都不会列出；此外，`Group Selected Tables` 还要求至少选中一个表。  
除 `Group Selected Tables` 对应的是表的右键菜单中的 `Group selected tables` 外，这些条目执行的命令与画布右键菜单相同；`View Option` 和 `Diff Viewer` 仅存在于右键菜单中。此处的 `Export` 提供与右键菜单相同的 `json`、`Schema SQL` 和 `Image`，在其中输入 `png` 或 `svg` 即可找到 `Image`。  
各格式、[Import and Add](./file-import-export.md#import-and-add) 以及[图片导出](./file-import-export.md#image)的作用参见[导入与导出文件](./file-import-export.md)，数据库选择的影响参见[表相关功能](./table-related-functions.md#databases)。

在 Schema SQL 标签页中，列表同样包含 `Database`，以及 `Bracket`。`Bracket` 用于设置生成的 SQL 中包裹表名、列名、约束名和索引名的引号字符，可选 `SingleQuote`、`DoubleQuote`、`Backtick`，或选择 `None` 表示不加任何引号。接着是 `Schema SQL: Statements` 和 `Schema SQL: Header`，它们提供与该标签页选项面板相同的选择，但只列出所选数据库会写出的选项；然后是 `Schema SQL: Options panel`，用于显示或隐藏该面板。各选项会写出什么参见 [Schema SQL](./schema-sql.md)。

在 Code Generator 标签页中，列表包含 `Database`，语言为 `Doctrine`、`JPA` 或 `SeaORM` 时还包含 `Bracket`，然后是 `Language`、`Table Name Case`、`Column Name Case` 以及 `Code Generator: Options panel`，后者用于显示或隐藏该标签页的选项面板。各目标生成的内容参见[代码生成](./code-generator.md)。

Visualization 和 Settings 标签页没有自己专属的命令，只有 `Tab` 以及下文所述每个标签页都会列出的命令。

每个标签页还会列出 `Export: Schema SQL`，它与 `Export` ▸ `Schema SQL` 一样，会切换到 Schema SQL 标签页，打开其选项面板并让 `Save file` 获得焦点，参见[保存或复制 SQL](./schema-sql.md#saving-or-copying-the-sql)。它本身不会保存任何内容。

每个标签页的列表末尾附近都有 `Find and Replace`，它会显示自己的快捷键 `Ctrl + F` (Windows/Linux) 或 `⌘ + F` (Mac)。输入 `find`、`replace` 或 `rename` 都可以找到它。  
执行该条目会关闭命令面板，切换到 ERD 标签页并打开[查找与替换](./find-and-replace.md#opening-and-closing)；如果该面板已经打开，则会把光标放回其查找输入框。Diff Viewer、Time Travel 或自动布局预览打开期间，列表中不会出现该条目。

### 主题与显示语言

每个标签页都会在 `Find and Replace` 之后列出 `Theme` 和 `Display Language`，在只读编辑器中也是如此。两者都只在编辑器提供相应选择器时才会列出，这一点可以从工具栏的 `Theme` 和 `Display Language` 按钮看出。Web 应用、Google Drive、VS Code、JetBrains IDE 和 Obsidian 都提供这两者，参见[在各宿主中](./language-and-theme.md#in-each-host)。

`Theme` 会打开 `System`、`Light` 和 `Dark`，当前的外观处于勾选状态。选择其中一项只会改变外观，灰阶色和强调色保持不变，与主题构建器的 `Appearance` 按钮相同。  
`Display Language` 会打开 `System`，其后是 25 种语言，每种语言都以其自身的名称显示，并按选择器中的顺序排列，当前选项处于勾选状态。在这里还可以通过语言的英文名称或代码找到它：`german` 或 `de-DE` 可以找到 `Deutsch`，`korean` 可以找到 `한국어`。  
在这两者中所做的选择都会立即生效并关闭命令面板，并且与在主题构建器或 `Display Language` 选择器中所做的选择一样被保存下来。如果在命令面板打开期间显示语言发生了变化，列表会切换为该语言，同时保留已输入的内容和当前所在的子菜单。

## 搜索图 {#searching-the-diagram}

在搜索开头输入前缀，即可搜索图而不是命令：`#` 搜索表，`@` 搜索列，`:` 搜索注释和备注，`?` 列出所有前缀。前缀在任意标签页中都有效。只有作为第一个字符时它才算作前缀，其前面的空格会被忽略。前缀后面的空格可有可无，因此 `#users` 和 `# users` 是同一个搜索，日文或中文输入法输入的全角 `＃`、`＠`、`：` 和 `？` 同样有效。  
在顶层且输入框为空时，输入框下方会有一行显示这四个前缀，点击其中一个即可输入它。前缀生效期间，输入框的末端会显示其搜索范围：`Tables`、`Columns`、`Comments & memos` 或 `Help`。删除前缀即可回到命令列表。

`#` 列出所有表，每个表旁边显示 `Table`，名称为空的表会显示为 `unnamed`。`#` 后面没有内容时，表按名称排序。`#` 后面的文本只与表名匹配，与上文一样是模糊匹配，名称中包含该文本的表排在前面。任何前缀都不会搜索表分组的名称。

`@` 按名称列出列，每一列旁边显示它所在的位置，例如 `users.email · Column`。`@` 后面的文本必须出现在列名中，不区分大小写；这种匹配不是模糊匹配。第一个 `.` 之前的文本会把搜索范围缩小到名称中包含该文本的表：`@users.em` 会在名称包含 `users` 的表中列出包含 `em` 的列，`@users.` 会列出这些表的列，`@.em` 则搜索所有表。`@` 后面没有内容时，会列出所有列，不做过滤。

`:` 列出表注释、列注释和备注，从不列出名称。每一行显示匹配处前后的文本摘录，旁边显示 `users · Table comment`、`users.email · Column comment` 或 `Memo`。`:` 后面的文本必须出现在注释或备注中，与 `@` 一样不区分大小写。`:` 后面没有内容时，会列出所有非空的注释和备注。当 View Option → `Memos` 隐藏了备注时，`:` 不会列出任何备注。

`@` 和 `:` 按文档中保存的顺序列出各行：逐个表列出，每个表的注释排在其各列之前，各列按列的顺序排列，备注排在最后。

`?` 列出 `Tables`、`Columns` 和 `Comments & memos`，`?` 后面的文本会对它们进行过滤。选择其中一项会把输入内容替换为对应的前缀，并保持命令面板打开。

带前缀的搜索没有找到任何结果时，列表为空，也不会显示任何提示信息。

选择表、列、注释或备注会关闭命令面板，如果当前位于其他标签页，还会切换到 ERD 标签页。  
表会被滚动到画布左上角附近，如果查找与替换面板已打开，则滚动到紧邻该面板右侧的位置，然后该表会被单独选中并移到最前面，表名会获得焦点，除非焦点原本就在该表中。  
列、注释或备注的显示方式与查找与替换[跳转到匹配项](./find-and-replace.md#going-to-a-match)时相同：只有当表、列所在的行或备注没有完全显示在视野中时，画布才会滚动。随后，备注会被单独选中并移到最前面；表则会被单独选中并移到最前面，焦点落在包含该文本的单元格上，如果注释被[表显示选项](./table-related-functions.md#table-view-options)隐藏，则焦点落在其旁边的名称上。  
任何跳转都不会开始或完成正在绘制的关系。

带前缀的列表最多显示 100 行。如果这一上限漏掉了某个按原样包含所输入文本的匹配项，这 100 行之后还会多出一行：`Show all N matches in Find and Replace` 或 `Show 1 match in Find and Replace`。选择该行会以相同的文本打开查找与替换，并且只开启该前缀所对应的文本类型。`@table.column` 只会传递列的部分，因此面板以及 N 涵盖的是所有表的列，参见[从快速搜索打开](./find-and-replace.md#from-quick-search)。  
前缀之后，或 `@table.` 的 `.` 之后没有输入任何内容时，列表在 100 行处截止，也不会提供这一行。  
如需使用 `Match Case`、`Match Whole Word` 或 `Use Regular Expression`，或者要替换文本，请直接使用[查找与替换](./find-and-replace.md)。

## 没有匹配的命令时

在顶层且没有前缀时，如果列出的命令中没有任何一个包含输入的内容（不区分大小写），命令之后会出现三行：`Search tables for "…"`、`Search columns for "…"` 和 `Search comments & memos for "…"`，每一行都以对应的前缀作为图标。选择其中一行会在输入内容前加上该前缀，例如 `users` 会变为 `#users`，命令面板则保持打开并显示相应的结果。  
如果搜索没有找到任何命令，列表上方会显示 `No commands match`，此时列表中只有这三行。如果只找到了不包含该文本的命令，这些命令会排在前面：在 ERD 标签页中没有选中任何表时，`tables` 会在这三行之前列出 `New Table`、`Database`，以及在提供该条目时列出的 `New Table Group`。选中了表时，如果提供了 `Group Selected Tables`，它包含 `tables`，因此这三行不会出现。  
在子菜单中，没有找到结果的搜索会让列表为空，也不会显示任何提示信息。

## 使用韩文搜索

包含韩文的搜索还会按字母进行匹配，在命令、子菜单以及所有前缀下均是如此。  
韩文输入法组字过程中的每一步都能持续找到你要输入的那一行，因此 `ㅅ`、`사`、`상`、`사요` 和 `사용` 都能找到 `사용자`。只由初声辅音组成的搜索会与各音节的初声匹配，并跳过空格：`ㅅㅇㅈ` 可以找到 `사용자`，`ㅈㅁ` 可以找到 `주문 내역`。Windows 输入法将连续输入的两个初声组合而成的复合辅音（例如 `ㅄ`）会按两个字母（`ㅂㅅ`）计算，而 `ㄲ` 之类的双辅音仍算作一个字母。以分解形式保存的文本（例如 macOS 的文件名）会按组合后的形式进行匹配。  
整段文本逐字母或逐初声完整拼出搜索内容的行排在最前，其次是以搜索内容开头的行，然后是包含它的行。在 `@` 和 `:` 下，按原样包含搜索内容的行排在所有这些行之前，并按文档顺序排列。高亮覆盖整个音节，因此 `상` 会点亮 `사용자` 中的 `사용`。  
查找与替换只按输入的原样匹配文本，因此仅凭字母找到的行（例如 `ㅅㅇㅈ` 和 `사요` 找到的 `사용자`）永远不会带出 `Show all … in Find and Replace` 行。
