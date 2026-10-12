---
sidebar_position: 13
description: リレーションシップのデータ型同期、コメントの最大幅、テーブル幅の再計算、設定のロック（表示、タブ、コードの設定）、カラムの表示順、ショートカット一覧。
---

# 設定

ツールバーの `Settings` ボタン、または[クイック検索](./quick-search.md)の `Tab` から開きます。
設定画面は `Preferences` と `Shortcuts` の 2 つのタブで構成されています。最初に `Preferences` が開きますが、[ウェルカム画面](./editing-start.md#ウェルカム画面)の `Shortcuts` の行から開いた場合は `Shortcuts` が開きます。

テーマと表示言語はこの画面にはありません。ツールバーの `Theme` と `Display Language` のボタンから開きます。[言語とテーマ](./language-and-theme.md)を参照してください。

## リレーションシップのデータ型同期

データ型を同期するかどうかを設定します。既定で有効です。
カラムのデータ型を変更すると、リレーションシップでつながっているすべてのカラムにその変更を適用します。両端から連鎖をたどるため、外部キーが参照先のキーとずれることはありません。
キーからその外部キーへは、リレーションシップを作成するときと同じように、serial 型は serial が格納する整数型として伝わります。[識別リレーションシップ](./relationship-editing.md#識別リレーションシップ)を参照してください。そのため、PostgreSQL でキーを `serial` に変更すると、その外部キーは `integer` になり、変更はそこからさらに連鎖をたどって伝わります。
外部キーからそのキーへは、型は書かれているとおりに伝わります。ただし、serial のキーは自身の型を保持し、変更はそこで止まります。
[Map Columns](./relationship-editing.md#map-columns) もこの設定に従います。オンの間は、Map Columns で対応付けた既存の各カラムが、親のキーが外部キーに与える型になり、その変更は上と同じようにリレーションシップをたどって伝わります。オフの間や、キーにデータ型がない場合は、カラムは自身の型を保持します。

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="リレーションシップのデータ型同期の設定" loading="lazy" />

![members.id を BIGINT UNSIGNED に変更すると、つながっているすべての member_id も同じ型に変わる様子](/img/demo-relationship-data-type-sync.webp)

## コメントの最大幅

コメントカラムの最大幅をピクセル単位で指定します（`60` ~ `200`）。
スイッチをオフにすると制限がなくなり、オフの間は入力欄が無効になります。
オンにすると `60px` から始まります。範囲外の値を入力すると、近い方の端の値に丸められます。

![コメントの最大幅をオンにして 120 を入力し、ERD タブでコメントがその幅で切り詰められる様子](/img/demo-settings-comment-width.webp)

## テーブル幅の再計算

`Sync` を押すと、すべてのテーブルとカラムのセルの幅を現在のテキストに合わせて再計算し、新しいサイズに合わせてリレーションシップの接続線を描き直します。
完了すると `Recalculated table width` のトーストが表示されます。
幅はドキュメントを読み込むたびに自動で再計算されるため、フォントや描画の変更で古い状態になったときにだけ必要になります。
幅はファイルに保存されないため、`Sync` でファイルが変わることはありません。

## ロック

`Lock` のリストには 6 つの設定が並びます。設定のロックがオンの間は、ファイルにはロックした時点の値が残るため、画面上で変更してもファイルは変わりません。

| 行 | ファイルに残る値 | 新しいダイアグラムでの値 |
| --- | --- | --- |
| `Viewport` | ERD キャンバスの拡大・縮小のレベルと表示位置（1 つのロックで扱います） | `100% · 0, 0` |
| `Canvas Type` | ダイアグラムを開いたときのタブ: `ERD`、`Visualization`、`Schema SQL`、`Code Generator` のいずれか | `ERD` |
| `Language` | [Code Generator](./code-generator.md#言語) の言語 | `GraphQL` |
| `Table Name Case` | Code Generator の[テーブル名のケース](./code-generator.md#名前のケース) | `Pascal` |
| `Column Name Case` | Code Generator の[カラム名のケース](./code-generator.md#名前のケース) | `Camel` |
| `Bracket Type` | [Schema SQL](./schema-sql.md#データベースと-bracket) タブと、それを備える [Code Generator](./code-generator.md#bracket) の対象の `Bracket` | `None` |

各行には値とロックのボタンが表示され、ボタンをクリックすると、その行のロックだけがオンまたはオフになります。
ロックがオンの間は、ボタンに閉じたロックのアイコンと `Unlock Viewport`（ほかの行も同様）というツールチップが表示され、`Locked value` というツールチップが付いた値は、ファイルに残る値です。
オフの間は、ボタンに開いたロックのアイコンと `Lock Viewport` というツールチップが表示され、`Current value` というツールチップが付いて淡い色で表示される値は、現在の設定です。
`Viewport` の値は、`75% · -40, 91` のように、拡大・縮小のレベル、続いて表示位置の順に表示されます。表示位置は、ダイアグラムの `0, 0` が位置する画面上の点をピクセル単位で表したもので、絶対値が 1000 以上の座標は `1.2k` や `-24k` のように短縮されます。

ロックをオンにすると、その時点の設定がロックした値になります。
ロックがオンの間も、設定は画面上では通常どおり機能します。スクロールや拡大・縮小、タブの切り替えができ、メニュー、オプションパネル、クイック検索から別の言語、名前のケース、括弧を選ぶこともできます。
ただし、ファイルにはロックした値が残り、行にもその値が表示され続けるため、ダイアグラムはロックした表示位置で、ロックしたタブに、ロックした言語、名前のケース、括弧の状態で開き直されます。JSON の書き出しにも、ロックした値が書き込まれます。
画面に表示されている状態を保存するには、ロックをオフにします。それ以降、ファイルは設定に従うため、`Viewport` がオフであれば、ダイアグラムは最後に見ていた位置で開きます。代わりに新しい開始時の表示位置のような新しい値をロックするには、ロックをオフにしてから再びオンにします。
ファイルを開いたときに、ロックした表示位置ではダイアグラムが何も見えない場合でも、画面はダイアグラムが見える位置へ移動し、ロックした値はそのまま変わりません。
`Canvas Type` が設定タブを保持することはありません。オンにすると、設定タブ以外で最後に開いていたタブがロックされ、オフの間は、その行にそのタブの名前が表示されます。

![Viewport のロックを解除してダイアグラムをスクロール、拡大・縮小し、行に表示される新しい表示位置で再びロックする様子](/img/demo-settings-locks.webp)

どのロックがオンかはファイルに保存されるため、ロックのオンとオフを切り替えるとファイルが変わりますが、設定タブのほかの項目と同じく、[Undo の履歴](./undo-redo.md#what-the-history-records)には記録されません。読み取り専用のエディタでは、ロックのボタンは何もしません。
それ以外の設定は、そのときの状態のまま保存されます。データベース、[`View Option`](./table-related-functions.md#table-view-options) の切り替え、`Preferences` タブのほかの項目がこれにあたります。

新しいダイアグラム、つまり何もない状態から始めたダイアグラムでは、すべてのロックがオンです。VS Code、Obsidian、JetBrains IDE で開いた空のファイル（Obsidian の `ERD Editor: Create new diagram` と `New ERD` はこれを作成します）、Web アプリの新しいスキーマ、Google Drive の New メニューから作成したファイル、値を渡していない `<erd-editor>` がこれにあたります。
Web アプリが SQL、DBML、AML、GraphQL のファイルを読み込んで作成するスキーマや Google Drive のファイルも、すべてのロックがオンで始まります。JSON ファイルから作成したものは、そのファイルが記録しているロックを保ちます。
開いたファイルでは、保存されたときのロックが、それぞれロックした値のまま保たれます。
以前のリリースで保存したファイルや手で書いたファイルのように、ロックを記録していないファイルは、すべてのロックがオンの状態で開きます。保存されていた表示位置とタブにかかわらず、表示位置は `100% · 0, 0`、タブは `ERD` になり、言語、名前のケース、括弧の種類は保存されていたとおりの値でロックされます。
ダイアグラムを置き換える `Import` もロックを設定します。JSON ファイルは、記録しているロックとそのロックした値を持ち込みます。SQL、DBML、AML、GraphQL のファイルは現在のロックを保ちますが、ロックの有無にかかわらず、表示位置を `100% · 0, 0` に戻します。[外部ファイルの読み込み](./file-import-export.md#外部ファイルの読み込み)を参照してください。読み込みを Undo すると、置き換えられたロックとロックした値が戻ります。

ロックによってファイルに反映されない変更は、変更として扱われません。VS Code はタブを未保存の状態にせず、Obsidian と JetBrains IDE は、自動で保存するときもタブを閉じるときも、ファイルをそのまま残します。
そのため、すべてのロックがオンであれば、ダイアグラムを見て回っても、タブを切り替えても、別の言語、名前のケース、括弧を試しても、`git diff` に表れることはありません。
`Viewport` がオフの場合はスクロールと拡大・縮小でファイルが変わり、`Canvas Type` がオフの場合は、設定タブへの切り替えも含め、タブの切り替えでもファイルが変わります。
新しいダイアグラムの空のファイルは、ファイルに反映される最初の変更まで空のままです。編集、どのロックも保持していない設定の変更、ロックのオンとオフの切り替えがこれにあたります。
そのような変更をせずにダイアグラムを開いて閉じた場合、どのリリースやマシンで書き込まれたファイルでも、ファイルはそのまま変わりません。ファイルにはダイアグラムの内容だけが決まった順序で保持され、以前のリリースで保存したファイルは、最初のそのような変更の時点で一度だけこの形式に書き直されます。[保存形式とランタイム値](../../api/advanced/schema.md#保存形式とランタイム値)を参照してください。
VS Code で、Git のリビジョンや Local History のエントリのように、`Reopen Editor With...` でダイアグラムとして開き直したリビジョンは読み取り専用で、未保存の状態になることはありません。
Google Drive では、ロックの有無にかかわらず、スクロール、拡大・縮小、別のタブへの切り替えだけで保存されることはありません。`Viewport` がオフの場合、表示位置はほかの変更と一緒にだけ書き込まれるため、Drive のファイルは最後に保存されたときの表示位置で開きます。`Canvas Type` がオフの場合のタブも同様です。

[共同編集のセッション](../../api/advanced/collaborative-editing.md)では、ロックのオンとオフはすべてのエディタに伝わり、ロックはそれをオンにしたエディタの値を保持します。
`Language`、名前のケース、`Bracket Type` のロックをオフにすると、すべてのエディタの設定が、ロックをオフにしたエディタに表示されている値になるため、すべてのエディタが 1 つの値を保存します。`Viewport` や `Canvas Type` のロックをオフにしても、誰の表示位置もタブも動きません。
MCP サーバーを通じて編集するコーディングエージェントには、ロックや、ロックが保持する設定を扱うツールはなく、ロックされた言語、名前のケース、括弧の種類は、ファイルに残る値として読み取ります。これらに影響するのは、`Import` と同じく、`replace` モードでの読み込みだけです。[設定](../../mcp/tools.md#settings)と[読み込み](../../mcp/tools.md#読み込み)を参照してください。

## カラム順の調整 {#adjusting-column-order}

テーブルに表示するカラムの順序を設定します。
行をドラッグして移動します。行全体がドラッグでき、グリップアイコンが目印になります。既定の順序は `Name`、`DataType`、`Not Null`、`Unique`、`Auto Increment`、`Default`、`Comment` の 7 行です。
[テーブルの表示オプション](./table-related-functions.md#table-view-options)で非表示にしたセルもリスト上の位置は保持されるため、順序は表示されているセルに対して適用されます。
[代替キー](./table-related-functions.md#alternate-keys)のマーク（`AK1.1` など）は、これらの行には含まれません。マークは常に行の最後、この順序で最後になるセルのさらに後ろに表示されます。

![Column Order までスクロールして Comment 行を Name の下へドラッグし、コメントがカラム名のすぐ後に表示される様子](/img/demo-settings-column-order.webp)

## ショートカット

`Shortcuts` タブは `Command` と `Keybinding` の読み取り専用の表で、使用中のプラットフォームのキー割り当てを一覧表示します。

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
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
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

これらの多くは ERD タブでのみ動作し、クイック検索、テーブルのプロパティ、Diff Viewer、自動レイアウトのプレビュー、Time Travel、[`Export image`](./file-import-export.md#画像) ダイアログ、[`Map Columns`](./relationship-editing.md#map-columns) が開いている間は無効になります。
`Search`、`Find and Replace`、`Stop` は例外です。`Search` はどのタブからでもクイック検索を開閉し、`Find and Replace` はどのタブからでも[検索と置換のパネル](./find-and-replace.md#opening-and-closing)を開いて ERD タブを表示し、`Stop` はクイック検索、テーブルのプロパティ、Diff Viewer、自動レイアウトのプレビュー、Time Travel、`Export image` ダイアログ、`Map Columns`、テーマビルダー、`Display Language` のピッカー、検索と置換のパネル、カラーピッカー、開いているコンテキストメニューを閉じます。
Diff Viewer、自動レイアウトのプレビュー、Time Travel のいずれかが開いている間は、`Find and Replace` はそのキーをブラウザまたはホストに渡します。[ブラウザの検索バー](./find-and-replace.md#the-browsers-find-bar)を参照してください。
ERD タブでは、`Stop` は開いているセルやメモの編集を終了するか、[テーブルグループ](./table-groups.md)の名前の編集をグループの名前を変えずに閉じるか、作成中のリレーションシップや描画中の `New Table Group` をキャンセルし、選択はそのまま残します。いずれも開いていない場合は、選択とフォーカスしているセルを解除し、同じ 1 回の押下で、開いている検索と置換のパネルやカラーピッカーも閉じます。
検索と置換のパネル、テーマビルダー、`Display Language` のピッカーが開いていても、キャンバス上のショートカットが無効になることはありません。パネル内で押したキーについては[パネル内のキー](./find-and-replace.md#keys-in-the-panel)を、ピッカー内で押したキーについては[言語の選択](./language-and-theme.md#言語の選択)を参照してください。
`Delete Selection` は、選択しているすべてのテーブル、メモ、テーブルグループを削除します。ただし、選択しているのがテーブル 1 つだけで、そのテーブルのカラムをいくつか選択していて、拡大・縮小のレベルが `70%` より大きい場合は、そのカラムを削除します。[テーブルとメモの削除](./table-related-functions.md#テーブルとメモの削除)を参照してください。`Remove Table, Memo` も、選択しているテーブルグループを削除します。
`Zoom In`、`Zoom Out`、`Zoom Reset` は、クイック検索が開いていなければ [Visualization](./visualization.md#toolbar) タブでも、`Graph` と `Flow` のどちらでも拡大・縮小します。
Visualization タブでは、`Stop` は[行の表示](./visualization.md#row-display)のメニューも閉じ、実行中の [Flow のレイアウト](./visualization.md#how-flow-is-placed)をキャンセルします。`Focus on this table` で絞り込んだビューは広げません。
`Focus on this table` は Visualization タブを `Flow` で開き、選択しているテーブルと、そこからリレーションシップ 1 つでつながるすべてのテーブルに絞り込みます。テーブルを選択していない場合は何もしません。[テーブルへのフォーカス](./visualization.md#focusing-on-tables)を参照してください。
`Select All Table, Memo`、`Hand Tool`、`Delete Selection` はキャレットに譲ります。セルやメモの編集中や、検索と置換のパネルのようなテキスト入力欄で入力している間は、`Ctrl + A` (Windows/Linux) または `⌘ + A` (Mac) がテキストを選択し、`Space` は空白を入力し、`Delete` と `Backspace` はテキストを消去します。
コピーと貼り付けはブラウザ標準の `Ctrl + C` と `Ctrl + V` (Windows/Linux) または `⌘ + C` と `⌘ + V` (Mac) のため、この一覧には含まれていません。[テーブルの編集](./table-editing.md)を参照してください。

このタブからキー割り当てを変更することはできません。
エディタを組み込むホストは [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) で変更できますが、`Editing`、`Stop`、`Undo`、`Redo`、`Zoom In`、`Zoom Out`、`Zoom Reset` は固定です。
その場合、`Shortcuts` タブにはホストのキー割り当てが表示されます。ホストが変更していないコマンドには既定のキーが表示され、ホストがどのキーにも割り当てていないコマンドにはキーが表示されません。

Obsidian では、ダイアグラムの Obsidian タブがアクティブな間、`Alt + Enter`、`Ctrl + K`、`Ctrl + F` (Windows/Linux) または `⌥ + Enter`、`⌘ + K`、`⌘ + F` (Mac) のように Obsidian のホットキーが同じキーを使っている場合でも、これらのキーはエディタに届きます。それ以外の Obsidian のホットキーは、そのタブでも引き続き使えます。`Ctrl + F` または `⌘ + F` については、[ブラウザの検索バー](./find-and-replace.md#the-browsers-find-bar)を参照してください。
