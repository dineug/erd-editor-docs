---
sidebar_position: 11
description: リレーションシップのデータ型同期、表示位置と拡大・縮小の保存、コメントの最大幅、テーブル幅の再計算、カラムの表示順、ショートカット一覧。
---

# 設定

ツールバーの `Settings` ボタン、または[クイック検索](./quick-search.md)の `Tab` から開きます。
設定画面は `Preferences` と `Shortcuts` の 2 つのタブで構成されています。最初に `Preferences` が開きます。

テーマの色はこの画面にはありません。
テーマビルダーで扱い、ツールバーの `Theme` ボタンから開きます。テーマビルダーは、ホストが [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) で有効にした場合にのみ表示されます。

VS Code、Obsidian、JetBrains IDE では、テーマビルダーの 3 つの値（外観、グレーカラー、アクセントカラー）はホストの設定でもあり、テーマビルダーで選んだ値はそこに保存されます。
VS Code では `dineug.erd-editor.theme.appearance`、`dineug.erd-editor.theme.grayColor`、`dineug.erd-editor.theme.accentColor` として保持し、外観の既定値は `dark` です。
Obsidian では Settings → ERD Editor に保管庫ごとに、JetBrains IDE では Settings | Tools | ERD Editor に IDE 全体で保持します。どちらも既定値は `Auto` で、ホストのライト / ダークのテーマに従い、テーマが切り替わるとそれに合わせて変わります。
テーマビルダー自体には `Light` と `Dark` しかありません。
Obsidian と JetBrains IDE では、`Auto` がいま表示していない方の外観を選ばない限り、`Auto` のまま変わりません。
VS Code では、選ぶたびに 3 つの値がすべて保存されるため、外観が `auto` の間に色を選んだだけでも、外観は `light` または `dark` に置き換わります。

## リレーションシップのデータ型同期

データ型を同期するかどうかを設定します。既定で有効です。
カラムのデータ型を変更すると、リレーションシップでつながっているすべてのカラムに同じ型を適用します。両端から連鎖をたどるため、外部キーが参照先のキーとずれることはありません。

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="リレーションシップのデータ型同期の設定" loading="lazy" />

![members.id を BIGINT UNSIGNED に変更すると、つながっているすべての member_id も同じ型に変わる様子](/img/demo-relationship-data-type-sync.webp)

## スクロール情報の保存

表示位置をドキュメントに保存するかどうかを設定します。このスイッチ自体もドキュメントに保存されます。新しいダイアグラムではオフで始まり、開いたファイルでは保存されたときの設定が保たれます。
オフにすると、表示位置をリセットした状態でドキュメントに保存されるため、最後に見ていた位置ではなくダイアグラムが見える位置で開き、スクロールによってファイルが変わることはありません。

新しいダイアグラムとは、何もない状態から始めたダイアグラムのことです。VS Code、Obsidian、JetBrains IDE で開いた空のファイル（Obsidian の `ERD Editor: Create new diagram` と `New ERD` はこれを作成します）、Web アプリの新しいスキーマ、Google Drive の New メニューから作成したファイル、値を渡していない `<erd-editor>` がこれにあたります。`Save Zoom Information` もここではオフで始まります。
Web アプリが SQL、DBML、AML、GraphQL のファイルを読み込んで作成するスキーマや Google Drive のファイルも、両方のスイッチがオフで始まります。JSON ファイルから作成したものは、そのファイルのスイッチを保ちます。
初期のリリースで保存したファイルや手で書いたファイルのように、これらのスイッチを記録していないファイルは、両方がオンの状態で開きます。

## 拡大・縮小情報の保存

拡大・縮小のレベルをドキュメントに保存するかどうかを設定します。`Save Scroll Information` と同じく、新しいダイアグラムではオフで始まり、開いたファイルでは保存されたときの設定が保たれます。
オフにすると `100%` の状態でドキュメントに保存されるため、拡大・縮小されていない状態で開きます。
拡大・縮小すると、その中心となる点がその場にとどまるように、表示位置も移動します。そのため、このスイッチだけをオフにしても、拡大・縮小は表示位置を通じてファイルを変更します。両方のスイッチをオフにした場合にだけ、ファイルはそのまま変わりません。

ドキュメントに保存されないスクロールや拡大・縮小は、変更として扱われません。VS Code はタブを未保存の状態にせず、Obsidian と JetBrains IDE は、自動で保存するときもタブを閉じるときも、ファイルをそのまま残します。
そのため、両方のスイッチをオフにしておけば、ダイアグラムを見て回っても `git diff` に表れることはありません。別のリリースや別のマシンで書き込まれ、保存するとバイトが変わってしまうファイルでも同じです。
どちらのスイッチも、エディタのどのタブが開いているかは対象にしません。ドキュメントには、ERD、Visualization、Schema SQL、Code Generator、設定のどのタブで離れたかが記録されるため、VS Code、Obsidian、JetBrains IDE では、これらのタブを切り替えるとやはりファイルが変わります。
新しいダイアグラムの空のファイルは、最初の編集か、それらのタブのうち別のタブへの最初の切り替えまで、空のままです。
git のリビジョンやマージのプレビューのように、VS Code が読み取り専用で開くダイアグラムが、未保存の状態になることはありません。
Google Drive では、スイッチの設定にかかわらず、スクロール、拡大・縮小、別のタブへの切り替えだけで保存されることはありません。表示状態はほかの変更と一緒にだけ書き込まれるため、`Save Scroll Information` がオンの場合、Drive のファイルは最後に保存されたときの表示位置で開きます。

## コメントの最大幅

コメントカラムの最大幅をピクセル単位で指定します（`60` ~ `200`）。
スイッチをオフにすると制限がなくなり、オフの間は入力欄が無効になります。
オンにすると `60px` から始まります。範囲外の値を入力すると、近い方の端の値に丸められます。

![コメントの最大幅をオンにして 120 を入力し、ERD タブでコメントがその幅で切り詰められる様子](/img/demo-settings-comment-width.webp)

## テーブル幅の再計算

`Sync` を押すと、すべてのテーブルとカラムのセルの幅を現在のテキストに合わせて再計算し、新しいサイズに合わせてリレーションシップの接続線を描き直します。
完了すると `Recalculated table width` のトーストが表示されます。
幅はドキュメントを読み込むたびに自動で再計算されるため、フォントや描画の変更で古い状態になったときにだけ必要になります。

## カラム順の調整 {#adjusting-column-order}

テーブルに表示するカラムの順序を設定します。
行をドラッグして移動します。行全体がドラッグでき、グリップアイコンが目印になります。既定の順序は `Name`、`DataType`、`Not Null`、`Unique`、`Auto Increment`、`Default`、`Comment` の 7 行です。
[テーブルの表示オプション](./table-related-functions.md#table-view-options)で非表示にしたセルもリスト上の位置は保持されるため、順序は表示されているセルに対して適用されます。
[代替キー](./table-related-functions.md#alternate-keys)のマーク（`AK1.1` など）は、これらの行には含まれません。マークは常に行の最後、この順序で最後になるセルのさらに後ろに表示されます。

![Comment 行を Name の下へドラッグし、コメントがカラム名のすぐ後に表示される様子](/img/demo-settings-column-order.webp)

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

これらの多くは ERD タブでのみ動作し、クイック検索、テーブルのプロパティ、Diff Viewer、自動レイアウトのプレビュー、Time Travel が開いている間は無効になります。
`Search`、`Find and Replace`、`Stop` は例外です。`Search` はどのタブからでもクイック検索を開閉し、`Find and Replace` はどのタブからでも[検索と置換のパネル](./find-and-replace.md#opening-and-closing)を開いて ERD タブを表示し、`Stop` はクイック検索、テーブルのプロパティ、Diff Viewer、自動レイアウトのプレビュー、Time Travel、テーマビルダー、検索と置換のパネルを閉じます。
Diff Viewer、自動レイアウトのプレビュー、Time Travel のいずれかが開いている間は、`Find and Replace` はそのキーをブラウザまたはホストに渡します。[ブラウザの検索バー](./find-and-replace.md#the-browsers-find-bar)を参照してください。
ERD タブでは、`Stop` は開いているセルやメモの編集を終了するか、作成中のリレーションシップをキャンセルし、選択はそのまま残します。いずれも開いていない場合は、選択とフォーカスしているセルを解除し、同じ 1 回の押下で、開いている検索と置換のパネルも閉じます。
検索と置換のパネルが開いていても、キャンバス上のショートカットが無効になることはありません。パネル内で押したキーについては、[パネル内のキー](./find-and-replace.md#keys-in-the-panel)を参照してください。
`Zoom In`、`Zoom Out`、`Zoom Reset` は、クイック検索が開いていなければ [Visualization](./visualization.md#toolbar) タブでも、`Graph` と `Flow` のどちらでも拡大・縮小します。
Visualization タブでは、`Stop` は[行の表示](./visualization.md#row-display)のメニューも閉じ、実行中の [Flow のレイアウト](./visualization.md#how-flow-is-placed)をキャンセルします。`Focus on this table` で絞り込んだビューは広げません。
`Focus on this table` は Visualization タブを `Flow` で開き、選択しているテーブルと、そこからリレーションシップ 1 つでつながるすべてのテーブルに絞り込みます。テーブルを選択していない場合は何もしません。[テーブルへのフォーカス](./visualization.md#focusing-on-tables)を参照してください。
`Select All Table, Memo` と `Hand Tool` はキャレットに譲ります。セルの編集中や検索と置換のパネルで入力している間は、`Ctrl + A` (Windows/Linux) または `⌘ + A` (Mac) がテキストを選択し、`Space` は空白を入力します。
コピーと貼り付けはブラウザ標準の `Ctrl + C` と `Ctrl + V` (Windows/Linux) または `⌘ + C` と `⌘ + V` (Mac) のため、この一覧には含まれていません。[テーブルの編集](./table-editing.md)を参照してください。

このタブからキー割り当てを変更することはできません。
エディタを組み込むホストは [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) で変更できますが、`Editing`、`Stop`、`Undo`、`Redo`、`Zoom In`、`Zoom Out`、`Zoom Reset` は固定です。
その場合、`Shortcuts` タブにはホストのキー割り当てが表示されます。ホストが変更していないコマンドには既定のキーが表示され、ホストがどのキーにも割り当てていないコマンドにはキーが表示されません。

Obsidian では、ダイアグラムの Obsidian タブがアクティブな間、`Alt + Enter`、`Ctrl + K`、`Ctrl + F` (Windows/Linux) または `⌥ + Enter`、`⌘ + K`、`⌘ + F` (Mac) のように Obsidian のホットキーが同じキーを使っている場合でも、これらのキーはエディタに届きます。それ以外の Obsidian のホットキーは、そのタブでも引き続き使えます。`Ctrl + F` または `⌘ + F` については、[ブラウザの検索バー](./find-and-replace.md#the-browsers-find-bar)を参照してください。
