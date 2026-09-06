---
sidebar_position: 10
description: リレーションシップのデータ型同期、表示位置と拡大・縮小の保存、コメントの最大幅、テーブル幅の再計算、カラムの表示順、ショートカット一覧。
---

# 設定

ツールバーの Settings ボタン、または[クイック検索](./quick-search.md)の `Tab` から開きます。
設定画面は `Preferences` と `Shortcuts` の 2 つのタブで構成されています。最初に `Preferences` が開きます。

テーマの色はこの画面にはありません。
テーマビルダーで扱い、ツールバーの Theme ボタンから開きます。テーマビルダーは、ホストが [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) で有効にした場合にのみ表示されます。

## リレーションシップのデータ型同期

データ型を同期するかどうかを設定します。既定で有効です。
カラムのデータ型を変更すると、リレーションシップでつながっているすべてのカラムに同じ型を適用します。両端から連鎖をたどるため、外部キーが参照先のキーとずれることはありません。

<img src="/img/settings-relationship-data-type-sync.png" width="400" alt="リレーションシップのデータ型同期の設定" loading="lazy" />

![demo-relationship-data-type-sync](/img/demo-relationship-data-type-sync.webp)

## スクロール情報の保存

表示位置をドキュメントに保存するかどうかを設定します。既定で有効です。
オフにすると、表示位置をリセットした状態でドキュメントに保存されるため、最後に見ていた位置ではなくダイアグラムが見える位置で開きます。

## 拡大・縮小情報の保存

拡大・縮小のレベルをドキュメントに保存するかどうかを設定します。既定で有効です。
オフにすると `100%` の状態でドキュメントに保存されるため、拡大・縮小されていない状態で開きます。

## コメントの最大幅

コメントカラムの最大幅をピクセル単位で指定します（`60` ~ `200`）。
スイッチをオフにすると制限がなくなり、オフの間は入力欄が無効になります。
オンにすると `60px` から始まります。範囲外の値を入力すると、近い方の端の値に丸められます。

<img src="/img/settings-comment-width.png" width="400" alt="コメントの最大幅の設定" loading="lazy" />
<img src="/img/settings-comment-width-2.png" width="400" alt="ダイアグラムに適用されたコメントの最大幅" loading="lazy" />

## テーブル幅の再計算

`Sync` を押すと、すべてのテーブルとカラムのセルの幅を現在のテキストに合わせて再計算し、新しいサイズに合わせてリレーションシップの接続線を描き直します。
完了すると `Recalculated table width` のトーストが表示されます。
幅はドキュメントを読み込むたびに自動で再計算されるため、フォントや描画の変更で古い状態になったときにだけ必要になります。

## カラム順の調整 {#adjusting-column-order}

テーブルに表示するカラムの順序を設定します。
行をドラッグして移動します。行全体がドラッグでき、グリップアイコンが目印になります。既定の順序は `Name`、`DataType`、`Not Null`、`Unique`、`Auto Increment`、`Default`、`Comment` の 7 行です。
[テーブルの表示オプション](./table-related-functions.md#table-view-options)で非表示にしたセルもリスト上の位置は保持されるため、順序は表示されているセルに対して適用されます。

![demo-settings-column-order](/img/demo-settings-column-order.webp)

## ショートカット

`Shortcuts` タブは `Command` と `Keybinding` の読み取り専用の表で、使用中のプラットフォームのキー割り当てを一覧表示します。

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
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + O` | `⌘ + O` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

これらの多くは ERD タブでのみ動作し、クイック検索、テーブルのプロパティ、Diff Viewer、テーブルの自動配置、Time Travel が開いている間は無効になります。
`Search` と `Stop` は例外です。`Search` はどのタブからでもクイック検索を開閉し、`Stop` はクイック検索、テーブルのプロパティ、Diff Viewer、テーブルの自動配置、Time Travel、テーマビルダーを閉じます。
`Select All Table, Memo` と `Hand Tool` はキャレットに譲ります。セルの編集中は `Ctrl + A` がテキストを選択し、`Space` は空白を入力します。
コピーと貼り付けはブラウザ標準の `Ctrl + C` と `Ctrl + V` (Windows/Linux) または `⌘ + C` と `⌘ + V` (Mac) のため、この一覧には含まれていません。[テーブルの編集](./table-editing.md)を参照してください。

このタブからキー割り当てを変更することはできません。
エディタを組み込むホストは [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) で変更できますが、`Editing`、`Stop`、`Search`、`Undo`、`Redo`、`Zoom In`、`Zoom Out`、`Zoom Reset` は固定です。
