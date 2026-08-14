---
sidebar_position: 4
description: テーブルの複数選択と移動、拡大・縮小、色と表示オプション、データベースの選択、ドキュメントの比較。
---

# テーブル関連機能

## 複数選択

次の 3 つの方法に対応しています。

- `Ctrl + drag` (Windows/Linux) or `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Ctrl + Alt + A` (Windows/Linux) or `⌘ + Alt + A` (Mac)

![demo-table-select](/img/demo-table-select.webp)

## 複数テーブルの移動

mod キーを押しながらドラッグします。`Ctrl + drag` (Windows/Linux) または `⌘ + drag` (Mac)  
mod キーなしでドラッグすると選択が解除され、ドラッグしたテーブルだけが移動します。

![demo-table-multiple-move](/img/demo-table-multiple-move.webp)

## テーブルとメモの削除

現在選択しているテーブルやメモを削除します。  
Shortcuts: `Ctrl + Backspace` (Windows/Linux) or `Ctrl + Delete` (Windows/Linux) or `⌘ + Backspace` (Mac) or `⌘ + Delete` (Mac)

![demo-table-remove](/img/demo-table-remove.webp)

## 拡大・縮小

mod キーを押しながらマウスホイールで拡大・縮小します。`Ctrl + Wheel` (Windows/Linux) または `⌘ + Wheel` (Mac)。ホイールだけを回すとキャンバスがスクロールします。  
ショートカット: `Ctrl + Plus` (Windows/Linux) または `⌘ + Plus` (Mac)、`Ctrl + Minus` (Windows/Linux) または `⌘ + Minus` (Mac)

![demo-zoom](/img/demo-zoom.webp)

## テーブルとメモの色指定

カテゴリごとに区別できるよう、色を指定できます。

![demo-table-color](/img/demo-table-color.webp)

## テーブルの表示オプション

次の表示オプションを提供します。

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Auto Increment
- Relationship

![demo-view-options](/img/demo-view-options.webp)

## テーブルのプロパティ

選択したテーブルのプロパティパネルを開きます。
テーブルのコンテキストメニュー、またはショートカット `Alt + Space` で開きます。
Indexes、Schema SQL、Code Generator の 3 つのタブがあります。
インデックスはここで定義し、書き出す Schema SQL に含まれます。

## テーブルの自動配置

Force Simulation で動作します。  
外部の Schema SQL を読み込んで、テーブル配置の開始位置として利用することもできます。

![demo-automatic-table-placement](/img/demo-automatic-table-placement.webp)

## データベース

対応しているデータベースは次のとおりです。

- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- SQLite

この設定は、書き出す Schema SQL の構文と DataType の自動補完を決定します。

<img src="/img/database-menu.png" width="400" alt="データベース選択メニュー" loading="lazy" />

![demo-data-type-autocomplete](/img/demo-data-type-autocomplete.webp)

## Diff Viewer

以前に保存したドキュメントと現在のドキュメントを比較できます。

<img src="/img/context-menu-diff-viewer.png" width="400" alt="Diff Viewer のコンテキストメニュー" loading="lazy" />

![diff-viewer](/img/diff-viewer.png)
