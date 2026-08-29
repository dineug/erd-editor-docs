---
sidebar_position: 6
description: コマンドパレットでのタブ切り替え、現在のタブのコマンド実行、テーブルへの移動。
---

# クイック検索

クイック検索はエディタのコマンドパレットです。  
現在のタブで利用できるコマンドを一覧表示します。ERD タブでは、すべてのテーブルも一覧表示するため、目的のテーブルへ移動できます。

`Ctrl + K` (Windows/Linux) または `⌘ + K` (Mac) で開くか、ツールバーの `Search` をクリックして開きます。  
同じショートカットで閉じ、`Esc` やパネルの外側のクリックでも閉じます。開くとテーブルのプロパティパネルとテーマビルダーが閉じます。テーブルのセルを編集している間は開きません。

![demo-quick-search](/img/demo-quick-search.webp)

## 検索と移動

入力すると一覧が絞り込まれます。マッチングはあいまい検索で、項目名と横に表示されるキーワードの両方を対象にします。たとえば `Import` サブメニューでは、`sdl` で `GraphQL`、`dbdiagram` で `DBML`、`azimutt` で `AML` が見つかります。  
一覧の移動は `↑` と `↓` で行い、両端で折り返します。選択中の項目は `Enter` で実行します。独自のショートカットを持つコマンドは、そのショートカットを右側に表示します。

`Database` や `Import` などの項目はサブメニューを開きます。サブメニューの項目が一覧を置き換え、検索ボックスはクリアされます。絞り込みは常に表示中の一覧だけに適用され、上の階層へ戻る方法はありません。最初からやり直すにはパレットを閉じて開き直します。

## パレットに表示される内容

一覧の内容は現在のタブによって変わります。どのタブでも先頭は `Tab` で、`Entity Relationship Diagram`、`Visualization`、`Schema SQL`、`Generator Code`、`Settings` に切り替えます。現在のタブは一覧から除外されます。`Generator Code` は、ツールバーで `Code Generator` と表示されるタブです。

ERD タブでは、データベースベンダー、`Import` と `Export`、`New Table` と `New Memo`、4 種類のリレーションシップ、`Automatic Table Placement`、そして名前順に並んだテーブルごとの項目を表示します。名前が空のテーブルは `unnamed` として表示され、実行するとそのテーブルまでスクロールして選択します。  
これらはキャンバスのコンテキストメニューと同じコマンドを実行します。ただし `Diff Viewer` はコンテキストメニューからのみ実行できます。ここでの `Export` は `json` と `Schema SQL` のみを提供するため、PNG は[キャンバスのコンテキストメニュー](./file-import-export.md#exporting)から書き出します。  
各形式の内容は[ファイルの読み込みと書き出し](./file-import-export.md)を、データベースの選択が何に影響するかは[テーブル関連機能](./table-related-functions.md#databases)を参照してください。

Schema SQL タブでは、再びデータベースベンダーと `Bracket` を表示します。`Bracket` は、生成する SQL でテーブル名、カラム名、制約名、インデックス名を囲む引用符を設定します。`SingleQuote`、`DoubleQuote`、`Backtick`、または引用符を付けない `None` から選びます。

Code Generator タブでは、対象言語、`Table Name Case`、`Column Name Case` を表示します。各対象が生成する内容は[コード生成](./code-generator.md)を参照してください。

Visualization タブと設定タブでは、`Tab` のみを表示します。
