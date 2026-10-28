---
sidebar_position: 16
description: リレーションシップのデータ型同期とドメイン、コメントの最大幅、設定のロック（表示、タブ、コードの設定、名前の表示）、カラムの表示順、ショートカット一覧、読み取り専用のエディタの設定タブ。
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

[ドメイン](./dictionary.md#domains-and-data-types)は、その `Data Type` が変わったときと、カラムが紐付けられたときに、紐付いているカラムにその `Data Type` を与えます。この設定がオンの間は、変更はそれらの各カラムから上と同じようにリレーションシップをたどって伝わり、オフの間は、紐付いているカラムだけが変わります。その変更でドメインの型になったカラムは、serial のキーがその外部キーに与える整数型のように、同期によって別の型が与えられる場合でも、その型を保持します。
紐付いているカラムに、同期や Map Columns によって自身のドメインとは異なる型が与えられると、そのカラムは同じ操作の中でそのドメインとの紐付けが解除されます。[紐付けの解除](./dictionary.md#unlinking)を参照してください。カラムの貼り付けでは、貼り付けによって紐付くドメインの型であっても、この設定に沿って型が伝わることはありません。[カラムのコピー / 貼り付け](./table-editing.md#カラムのコピー--貼り付け)を参照してください。辞書タブの `Domains` シートに貼り付けた `Data Type` は、ドメインの型の変更がすべてそうであるように、この設定に沿って伝わります。

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="リレーションシップのデータ型同期の設定" loading="lazy" />

![members.id を BIGINT UNSIGNED に変更すると、つながっているすべての member_id も同じ型に変わる様子](/img/demo-relationship-data-type-sync.webp)

## コメントの最大幅

コメントカラムの最大幅をピクセル単位で指定します（`60` ~ `200`）。
スイッチをオフにすると制限がなくなり、オフの間は入力欄が無効になります。
オンにすると `60px` から始まります。範囲外の値を入力すると、近い方の端の値に丸められます。

![コメントの最大幅をオンにして 120 を入力し、ERD タブでコメントがその幅で切り詰められる様子](/img/demo-settings-comment-width.webp)

## ロック

`Lock` のリストには 7 つの設定が並びます。設定のロックがオンの間は、ファイルにはロックした時点の値が残るため、画面上で変更してもファイルは変わりません。

| 行 | ファイルに残る値 | 新しいダイアグラムでの値 |
| --- | --- | --- |
| `Viewport` | ERD キャンバスの拡大・縮小のレベルと表示位置（1 つのロックで扱います） | `100% · 0, 0` |
| `Canvas Type` | ダイアグラムを開いたときのタブ: `ERD`、`Visualization`、`Schema SQL`、`Code Generator`、`Dictionary` のいずれか | `ERD` |
| `Language` | [Code Generator](./code-generator.md#言語) の言語 | `GraphQL` |
| `Table Name Case` | Code Generator の[テーブル名のケース](./code-generator.md#名前のケース) | `Pascal` |
| `Column Name Case` | Code Generator の[カラム名のケース](./code-generator.md#名前のケース) | `Camel` |
| `Bracket Type` | [Schema SQL](./schema-sql.md#データベースと-bracket) タブと、それを備える [Code Generator](./code-generator.md#bracket) の対象の `Bracket` | `None` |
| `Name View` | ダイアグラムを開いたときの[名前の表示](./logical-names.md#name-view): `Physical Names`、`Logical Names`、`Both Names` のいずれか | `Physical Names` |

各行には値とロックのボタンが表示され、ボタンをクリックすると、その行のロックだけがオンまたはオフになります。
ロックがオンの間は、ボタンに閉じたロックのアイコンと `Unlock Viewport`（ほかの行も同様）というツールチップが表示され、`Locked value` というツールチップが付いた値は、ファイルに残る値です。
オフの間は、ボタンに開いたロックのアイコンと `Lock Viewport` というツールチップが表示され、`Current value` というツールチップが付いて淡い色で表示される値は、現在の設定です。
`Viewport` の値は、`75% · -40, 91` のように、拡大・縮小のレベル、続いて表示位置の順に表示されます。表示位置は、ダイアグラムの `0, 0` が位置する画面上の点をピクセル単位で表したもので、絶対値が 1000 以上の座標は `1.2k` や `-24k` のように短縮されます。

ロックをオンにすると、その時点の設定がロックした値になります。
ロックがオンの間も、設定は画面上では通常どおり機能します。スクロールや拡大・縮小、タブの切り替えができ、メニュー、オプションパネル、クイック検索から別の言語、名前のケース、括弧を選ぶことも、名前の表示をどのピッカーからでも切り替えることもできます。[表示の切り替え](./logical-names.md#switching-the-view)を参照してください。
ただし、ファイルにはロックした値が残り、行にもその値が表示され続けるため、ダイアグラムはロックした表示位置で、ロックしたタブに、ロックした名前の表示で、ロックした言語、名前のケース、括弧の状態で開き直されます。JSON の書き出しにも、ロックした値が書き込まれます。
画面に表示されている状態を保存するには、ロックをオフにします。それ以降、ファイルは設定に従うため、`Viewport` がオフであれば、ダイアグラムは最後に見ていた位置で開きます。代わりに新しい開始時の表示位置のような新しい値をロックするには、ロックをオフにしてから再びオンにします。
ファイルを開いたときに、ロックした表示位置ではダイアグラムが何も見えない場合でも、画面はダイアグラムが見える位置へ移動し、ロックした値はそのまま変わりません。
`Canvas Type` が設定タブを保持することはありません。オンにすると、設定タブ以外で最後に開いていたタブがロックされ、オフの間は、その行にそのタブの名前が表示されます。

![Viewport のロックを解除してダイアグラムをスクロール、拡大・縮小し、行に表示される新しい表示位置で再びロックする様子](/img/demo-settings-locks.webp)

どのロックがオンかはファイルに保存されるため、ロックのオンとオフを切り替えるとファイルが変わりますが、設定タブのほかの項目と同じく、[Undo の履歴](./undo-redo.md#what-the-history-records)には記録されません。名前の表示の切り替えも、ロックの有無にかかわらず記録されません。
それ以外の設定は、そのときの状態のまま保存されます。データベース、[`View Option`](./table-related-functions.md#table-view-options) の切り替え、`Preferences` タブのほかの項目がこれにあたります。
読み取り専用のエディタは、ロックの状態にかかわらず、そのどれを通してもファイルを変更しません。ロックのボタンと `Preferences` のほかのコントロールは無効になり、引き続き変更できる設定はその画面にとどまります。[読み取り専用のエディタ](#read-only-editors)を参照してください。

新しいダイアグラム、つまり何もない状態から始めたダイアグラムでは、すべてのロックがオンです。VS Code、Obsidian、JetBrains IDE で開いた空のファイル（Obsidian の `ERD Editor: Create new diagram` と `New ERD` はこれを作成します）、Web アプリの新しいスキーマ、Google Drive の New メニューから作成したファイル、値を渡していない `<erd-editor>` がこれにあたります。
Web アプリが SQL、DBML、AML、GraphQL のファイルを読み込んで作成するスキーマや Google Drive のファイルも、すべてのロックがオンで始まります。JSON ファイルから作成したものは、そのファイルが記録しているロックを保ちます。
開いたファイルでは、保存されたときのロックが、それぞれロックした値のまま保たれます。
ロックが導入される前のリリースで保存したファイルや手で書いたファイルのように、ロックを記録していないファイルは、すべてのロックがオンの状態で開きます。保存されていた表示位置とタブにかかわらず、表示位置は `100% · 0, 0`、タブは `ERD` になり、言語、名前のケース、括弧の種類、名前の表示は保存されていたとおりの値でロックされます。
名前の表示のロックが導入される前のリリースで保存したファイルは、記録しているほかのロックがすべてオフでも、`Name View` がロックされた状態で、`Physical Names` で開きます。
ダイアグラムを置き換える `Import` もロックを設定します。JSON ファイルは、記録しているロックとそのロックした値を持ち込みます。SQL、DBML、AML、GraphQL のファイルは現在のロックを保ちますが、ロックの有無にかかわらず、表示位置を `100% · 0, 0` に戻します。[外部ファイルの読み込み](./file-import-export.md#外部ファイルの読み込み)を参照してください。読み込みを Undo すると、置き換えられたロックとロックした値が戻ります。

ロックによってファイルに反映されない変更は、変更として扱われません。VS Code はタブを未保存の状態にせず、Obsidian と JetBrains IDE は、自動で保存するときもタブを閉じるときも、ファイルをそのまま残します。
そのため、すべてのロックがオンであれば、ダイアグラムを見て回っても、タブを切り替えても、別の言語、名前のケース、括弧を試しても、名前の表示を切り替えても、`git diff` に表れることはありません。
`Viewport` がオフの場合はスクロールと拡大・縮小でファイルが変わり、`Canvas Type` がオフの場合は、設定タブへの切り替えも含め、タブの切り替えでもファイルが変わり、`Name View` がオフの場合は、名前の表示の切り替えでもファイルが変わります。
新しいダイアグラムの空のファイルは、ファイルに反映される最初の変更まで空のままです。編集、どのロックも保持していない設定の変更、ロックのオンとオフの切り替えがこれにあたります。
そのような変更をせずにダイアグラムを開いて閉じた場合、どのリリースやマシンで書き込まれたファイルでも、ファイルはそのまま変わりません。ファイルにはダイアグラムの内容だけが決まった順序で保持され、古い形式で保存されたファイルは、最初のそのような変更の時点で一度だけこの形式に書き直されます。[保存形式とランタイム値](../../api/advanced/schema.md#保存形式とランタイム値)を参照してください。
VS Code で、Git のリビジョンや Local History のエントリーのように、`Reopen Editor With...` でダイアグラムとして開き直したリビジョンは読み取り専用で、未保存の状態になることはありません。
Google Drive では、ロックの有無にかかわらず、スクロール、拡大・縮小、別のタブへの切り替えだけで保存されることはありません。`Viewport` がオフの場合、表示位置はほかの変更と一緒にだけ書き込まれるため、Drive のファイルは最後に保存されたときの表示位置で開きます。`Canvas Type` がオフの場合のタブも同様です。`Name View` がオフの状態で名前の表示を切り替えると、編集と同じように保存されます。オンの間や読み取り専用のエディタで切り替えた場合は、保存されることはありません。

[共同編集のセッション](../../api/advanced/collaborative-editing.md)では、ロックのオンとオフはすべてのエディタに伝わり、ロックはそれをオンにしたエディタの値を保持します。
`Language`、名前のケース、`Bracket Type`、`Name View` のロックをオフにすると、すべてのエディタの設定が、ロックをオフにしたエディタに表示されている値になるため、すべてのエディタが 1 つの値を保存します。`Viewport` や `Canvas Type` のロックをオフにしても、誰の表示位置もタブも動きません。
ロックがオンの間に選んだ言語、名前のケース、括弧は、それでもすべてのエディタに伝わりますが、`Name View` がオンの間は、名前の表示はエディタごとのものになります。切り替えは切り替えたエディタにだけ反映され、ロックをオンにしても誰の表示も変わりません。オフの間は、読み取り専用ではないどのエディタで切り替えても、すべてのエディタが切り替わります。
MCP サーバーを通じて編集するコーディングエージェントには、ロックや、ロックが保持する設定を扱うツールはなく、ロックされた言語、名前のケース、括弧の種類は、ファイルに残る値として読み取ります。これらに影響するのは、`Import` と同じく、`replace` モードでの読み込みだけです。[設定](../../mcp/tools.md#settings)と[読み込み](../../mcp/tools.md#読み込み)を参照してください。エージェントの `erd_list` と `erd_read` の `snapshot` 形式には名前の表示が含まれず、エージェントは、人がどの表示で見ているかにかかわらず、論理名も含めてスキーマを編集します。

## カラム順の調整 {#adjusting-column-order}

テーブルに表示するカラムの順序を設定します。
行をドラッグして移動します。行全体がドラッグでき、グリップアイコンが目印になります。既定の順序は `Logical Name`、`Name`、`DataType`、`Domain`、`Not Null`、`Unique`、`Auto Increment`、`Default`、`Comment` の 9 行です。
`Logical Name` は、`Both Names` で各行に表示される論理名のセルの位置を決めます。`Logical Names` では、代わりに論理名が `Name` 行の位置に表示され、`Physical Names` では論理名のセルは表示されません。[名前の表示](./logical-names.md#name-view)を参照してください。`Domain` は、View Option → `Domain` で表示されるドメインのセルの位置を決めます。[ドメインのセル](./logical-names.md#the-domain-cell)を参照してください。
[テーブルの表示オプション](./table-related-functions.md#table-view-options)で非表示にしたセルや、名前の表示によって表示されないセルもリスト上の位置は保持されるため、順序は表示されているセルに対して適用されます。
`Logical Name` と `Domain` が行として加わる前に順序を設定したダイアグラムでは、`Name` と `DataType` が順序のどこにあっても、`Logical Name` は `Name` の直前に、`Domain` は `DataType` の直後に入ります。
後のリリースが保存したダイアグラムも、そのリリースにこのリリースにはない行があっても、順序を保ちます。このリリースにある行はファイルが示す順序に並び、知らない行は除かれます。ここでダイアグラムを保存すると、その行を除いた順序が書き出され、後のリリースは、その行を自身の既定の順序での隣の行の隣に戻します。
[代替キー](./table-related-functions.md#alternate-keys)のマーク（`AK1.1` など）は、これらの行には含まれません。マークは常に行の最後、この順序で最後になるセルのさらに後ろに表示されます。

![Column Order までスクロールして Comment 行を Name の下へドラッグし、コメントがカラム名のすぐ後に表示される様子](/img/demo-settings-column-order.webp)

## ショートカット

`Shortcuts` タブは `Command` と `Keybinding` の読み取り専用の表で、使用中のプラットフォームのキー割り当てを一覧表示します。

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` に続けて `G` | `T` に続けて `G` |
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
`Search`、`Toggle Explorer`、`Stop` は例外です。`Search` はどのタブからでもクイック検索を開閉し、`Toggle Explorer` はどのタブからでも[エクスプローラー](./explorer.md#opening-and-closing)を検索の状態で開いて ERD タブを表示し、`Stop` はクイック検索、テーブルのプロパティ、Diff Viewer、自動レイアウトのプレビュー、Time Travel、`Export image` ダイアログ、`Map Columns`、テーマビルダー、`Display Language` のピッカー、カラーピッカー、`Name View` ボタンで開く一覧、開いているコンテキストメニューを閉じます。
エクスプローラーが ERD タブで開いていて Zen モードで隠れていない間は、ツールバーの `Explorer` ボタンと同じように、`Toggle Explorer` はエクスプローラーを再び閉じます。クイック検索、テーブルのプロパティ、テーマビルダー、`Display Language` のピッカー、`Export image` ダイアログ、`Map Columns` のいずれかが開いている場合は、代わりにそれを閉じて、キーボード操作をエクスプローラーの検索に移します。
セル、メモ、テーブルグループの名前を編集している間は、`Toggle Explorer` は何もしません。[辞書](./dictionary.md)タブのセルを編集している間は、`Toggle Explorer` も `Search` も何もしないため、そこで入力したテキストは保持されます。Diff Viewer、自動レイアウトのプレビュー、Time Travel のいずれかが開いている間は、`Toggle Explorer` はそのキーをブラウザまたはホストに渡します。[ブラウザの検索バー](./find-and-replace.md#the-browsers-find-bar)を参照してください。
ERD タブでは、`Stop` は開いているセルやメモの編集を終了するか、[テーブルグループ](./table-groups.md)の名前の編集をグループの名前を変えずに閉じるか、作成中のリレーションシップや描画中の `New Table Group` をキャンセルし、選択はそのまま残します。いずれも開いていない場合は、選択とフォーカスしているセルを解除し、同じ 1 回の押下で、開いているカラーピッカーも閉じます。開いているテーマビルダーや `Display Language` のピッカーは、どちらの場合も同じ 1 回の押下で閉じます。
用語の候補一覧が開いている論理名のセルでは、最初に `Stop` を押すと一覧だけが閉じます。[用語名の補完](./logical-names.md#completing-term-names)を参照してください。
エクスプローラー、テーマビルダー、`Display Language` のピッカーが開いていても、キャンバス上のショートカットが無効になることはありません。`Stop` がエクスプローラーを閉じることはありません。エクスプローラー内で `Stop` やほかのキーが何をするかについては[エクスプローラー内のキー](./explorer.md#keys-in-the-explorer)を、ピッカー内で押したキーについては[言語の選択](./language-and-theme.md#言語の選択)を参照してください。
`Delete Selection` は、選択しているすべてのテーブル、メモ、テーブルグループを削除します。ただし、選択しているのがテーブル 1 つだけで、そのテーブルのカラムをいくつか選択していて、拡大・縮小のレベルが `70%` より大きい場合は、そのカラムを削除します。[テーブルとメモの削除](./table-related-functions.md#テーブルとメモの削除)を参照してください。`Remove Table, Memo` も、選択しているテーブルグループを削除します。
`Add Table Group` は、[キャンバスツールバー](./table-related-functions.md#canvas-toolbar)の `New Table Group` ボタンと同じように [`New Table Group`](./table-groups.md#グループの描画) の描画を始め、もう一度押すと描画をキャンセルします。`Group Selected Tables` は修飾キーを使わずに 2 回押すキーで、`T` に続けて 1 秒以内に `G` を押します。テーブルのコンテキストメニューの `Group selected tables` と同じように、選択しているテーブルを新しいグループに入れてその名前の入力欄を開き、テーブルを選択していない場合は何もしません。[選択したテーブルのグループ化](./table-groups.md#選択したテーブルのグループ化)を参照してください。どちらも、読み取り専用のエディタや、グループを[非表示](./table-groups.md#グループの非表示)にしている間は何もしません。
読み取り専用のエディタで動作するのは、読み取るキーだけです。`Search`、`Toggle Explorer`、`Stop`、移動で選択されたテーブルに対する `Table Properties` と `Focus on this table`、3 つの拡大・縮小のキー、`Zen Mode`、コピー、そしてフォーカスしたセルを動かす矢印キーです。`Editing`、`Add` と `Remove` のすべてのキー、`Delete Selection`、`Primary Key`、2 つのすべて選択のキー、4 つのリレーションシップのキー、`Add Table Group`、`Group Selected Tables`、`Hand Tool`、貼り付けは何もせず、`Undo` と `Redo` は何も元に戻さず、やり直しません。[読み取り専用のエディタ](./table-related-functions.md#read-only-editors)を参照してください。
`Zoom In`、`Zoom Out`、`Zoom Reset` は、クイック検索が開いていなければ [Visualization](./visualization.md#toolbar) タブでも、`Graph` と `Flow` のどちらでも拡大・縮小します。
`Flow` では、クイック検索が開いていなければ、`Undo` と `Redo` は、Flow の `Previous table` ボタンと `Next table` ボタンと同じように、Flow がこれまでに絞り込んだ表示の間を、1 つ戻ったり 1 つ進んだりします。そこでダイアグラムを Undo することはなく、`Graph` では何もしません。[前のテーブルと次のテーブル](./visualization.md#previous-table-and-next-table)を参照してください。
Visualization タブでは、`Stop` は[行の表示](./visualization.md#row-display)のメニューも閉じ、実行中の [Flow のレイアウト](./visualization.md#how-flow-is-placed)をキャンセルします。`Focus on this table` で絞り込んだビューは広げません。
`Focus on this table` は Visualization タブを `Flow` で開き、選択しているテーブルと、そこからリレーションシップ 1 つでつながるすべてのテーブルに絞り込みます。テーブルを選択していない場合は何もしません。[テーブルへのフォーカス](./visualization.md#focusing-on-tables)を参照してください。
辞書タブでは、`Undo` と `Redo` はダイアグラムの履歴ではなく、表示しているシートの履歴に対して働き、`Checks` では何もしません。[辞書のシート](./undo-redo.md#dictionary-sheets)を参照してください。`Domains`、`Words`、`Terms` シートでは、`Add Column` は選択範囲の下に行を挿入し、そのキーに `Shift` を加えると上に挿入し、`Remove Column` は選択範囲にかかる行を削除します。[行の追加と削除](./dictionary.md#adding-and-deleting-rows)を参照してください。タブのほかのキーについては[タブ内のキー](./dictionary.md#keys-on-the-tab)を参照してください。
`Select All Table, Memo`、`Hand Tool`、`Delete Selection`、`Group Selected Tables` はキャレットに譲ります。セルやメモの編集中や、エクスプローラーの検索フィールドのようなテキスト入力欄で入力している間は、`Ctrl + A` (Windows/Linux) または `⌘ + A` (Mac) がテキストを選択し、`Space` は空白を入力し、`Delete` と `Backspace` はテキストを消去し、`T` に続けて `G` を押すとその 2 文字が入力されます。
コピーと貼り付けはブラウザ標準の `Ctrl + C` と `Ctrl + V` (Windows/Linux) または `⌘ + C` と `⌘ + V` (Mac) のため、この一覧には含まれていません。[テーブルの編集](./table-editing.md)を参照してください。

このタブからキー割り当てを変更することはできません。
エディタを組み込むホストは [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) で変更できますが、`Editing`、`Stop`、`Undo`、`Redo`、`Zoom In`、`Zoom Out`、`Zoom Reset` は固定です。
その場合、`Shortcuts` タブにはホストのキー割り当てが表示されます。ホストが変更していないコマンドには既定のキーが表示され、ホストがどのキーにも割り当てていないコマンドにはキーが表示されません。
辞書タブの行のキーは `Add Column` と `Remove Column` に従うため、どちらかの割り当てを変更すると行のキーも移ります。[`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords) を参照してください。

Obsidian では、ダイアグラムの Obsidian タブがアクティブな間、`Alt + Enter`、`Ctrl + K`、`Ctrl + F` (Windows/Linux) または `⌥ + Enter`、`⌘ + K`、`⌘ + F` (Mac) のように Obsidian のホットキーが同じキーを使っている場合でも、これらのキーはエディタに届きます。この一覧のどの行にもない、辞書タブの `Alt + Shift + Enter` (Windows/Linux) または `⌥ + Shift + Enter` (Mac) も同様です。それ以外の Obsidian のホットキーは、そのタブでも引き続き使えます。`Ctrl + F` または `⌘ + F` については、[ブラウザの検索バー](./find-and-replace.md#the-browsers-find-bar)を参照してください。

## 読み取り専用のエディタ {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) のエディタでは、設定タブはダイアグラムの設定を表示し、そのどれも変更しません。`Preferences` と `Shortcuts` の各ページの見出しの横に、`Read only` のバッジが表示されます。
`Relationship DataType Sync` と `Maximum comment width` のスイッチと幅のフィールドは無効になり、すべてのロックのボタンも同様です。`Column Order` の行にはグリップが表示されず、ドラッグできません。
各 `Lock` の行は引き続きその値を表示します。ロックされた行にはファイルが保持する値が、ロックされていない行にはその画面での設定が表示され、次のとおり、ファイルの値と異なることがあります。

画面に何を表示するかを決める設定は、そこでも変更できます。表示位置と拡大・縮小、タブ、名前の表示、データベース、Code Generator の言語、2 つの名前のケース、括弧の種類、[`View Option`](./table-related-functions.md#table-view-options) の切り替えです。
どれも、ロックにかかわらず、その画面だけを変えます。ファイルに保存されることも、JSON の書き出しに書き込まれることも、Undo の履歴に記録されることも、変更として数えられることもなく、共同編集者に届くこともありません。[Schema SQL](./schema-sql.md#オプションパネル) と [Code Generator](./code-generator.md#オプションパネル) のオプションパネルは、これらの選択に、`Saved in the document` の代わりに `This window only` と表示します。
エディタが再び編集可能になると、データベース、言語、名前のケース、括弧の種類、View Option の切り替えはファイルの値に戻ります。表示、タブ、名前の表示は残したままで、ファイルは、ロックが許す範囲で、それぞれを次にその設定を変更したときに取り込みます。
