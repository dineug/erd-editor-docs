---
sidebar_position: 4
description: erd-editor MCP サーバーが提供するすべてのツール。ドキュメントの 1 ページずつの読み取り、54 個の編集ツール、erd_batch、結果と拒否の形式。
---

# ツール

サーバーは 63 個のツールを提供します。5 個のセッションのツール、3 個の読み取りツール、編集操作ごとに 1 つずつある 54 個の編集ツール、そして複数の編集ツールを 1 つの編集として実行する `erd_batch` です。

`erd_list_documents` 以外のすべてのツールは、最初の引数としてドキュメントの `path` を受け取ります。以下の表では省略しています。
`?` の付いた引数は省略可能です。

## セッションのツール

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_list_documents` | | ERD ドキュメントを `path`、`open`、`active`、`dirty`、`readonly` とともに一覧表示します。作業ディレクトリを扱う VS Code のウィンドウがあればそのウィンドウのドキュメントを、なければ作業ディレクトリ以下の ERD ファイルを表示します。 |
| `erd_open_document` | `create?` | ドキュメントを編集用に開きます。ウィンドウがそのドキュメントを扱っている場合は ERD Editor で開きます。`create` を付けると、ファイルがなければ先に作成し、拡張子のない名前には `.erd.json` が付きます。 |
| `erd_save` | | エディタが保持しているドキュメントを保存します。ヘッドレスではすべての編集がすでに書き込まれているため、何もしません。 |
| `erd_undo` | | このエージェントが行った最後の編集を元に戻します。ユーザーの編集は元に戻しません。Undo の項目を作らなかった呼び出しは飛ばされ、その名前が示されます。 |
| `erd_redo` | | `erd_undo` が最後に元に戻した編集を、再び適用します。 |

各モードで保存と Undo がどう動作するかは、[ライブとヘッドレス](./live-and-headless.md)を参照してください。

## ドキュメントの読み取り {#reading-a-document}

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_list` | `query?`、`offset?`、`limit?`、`namesOnly?` | 設定と件数、続いて 1 ページ分のテーブルを返します。各テーブルには ID、キャンバス上の位置とサイズ、カラム数が付き、そのインデックスとリレーションシップも含まれます。検索でない場合は、テーブルの後にメモが続きます。 |
| `erd_get` | `tableIds?`、`tableNames?`、`relationshipIds?`、`indexIds?`、`memoIds?` | 指定したエンティティの全体を返します。テーブルはカラムとともに、リレーションシップとインデックスはそのカラムとともに、メモは本文とともに返します。 |
| `erd_read` | `format`、`vendor?`、`tableIds?`、`tableNames?` | ドキュメント全体を 3 つの形式のいずれかで一度に返すか、一部のテーブルだけの DDL を返します。 |

エージェントは `erd_list` で ID を見つけ、`erd_get` でカラムなどの詳細を読み取り、それらの ID を編集ツールに渡します。
`erd_list` のテーブルのサイズは、キャンバス上でテーブルが占める矩形です。高さは正確で、幅は概算です。
各リレーションシップは、両端の 2 つのテーブルのどちらか一方とともに、1 回だけ一覧に含まれます。

`erd_read` は次の 3 つの形式のいずれかを受け取ります。

| `format` | 返す内容 |
| --- | --- |
| `snapshot` | すべてのエンティティとその ID を含むコンパクトな JSON です。大きなスキーマでは大きくなります。 |
| `sql` | 8 つのデータベース `Databricks`、`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`Snowflake`、`SQLite` のいずれかの DDL です。`vendor` の既定値は、ドキュメントに設定されているデータベースです。`tableIds` または `tableNames` を指定すると、それらのテーブルだけを、それらが持つ外部キーとともに返します。 |
| `json` | 生の `.erd.json` ドキュメントです。 |

### 大きなスキーマ

数百、数千のテーブルを持つスキーマも扱えます。
1 回の読み取りが返すのは最大 40,000 文字で、Claude Code がツールの結果をファイルに退避させる境目を下回ります。

- `erd_list` は既定で 1 ページ 100 テーブルを返し、次のページの開始位置を `nextOffset` と `note` で示します。その `nextOffset` を `offset` として、同じ `query` とともに渡します。
- `query` は、テーブルやカラムの名前またはコメントに含まれる語でテーブルを探し、大文字と小文字を区別しません。名前に含まれる語が多いテーブルほど先に来ます。
- `namesOnly` はテーブル名だけを一覧表示し、短い名前なら 1 回の応答で約 2,000 件を返します。
- `erd_get` と `erd_read` は ID に加えて `tableNames` も受け取るため、大きなスキーマで SQL クエリを頼まれたエージェントは、必要なテーブルの DDL だけを読み取れます。
- `erd_get` は、何も指していない ID と名前を `missing` に、1 回の応答に収まらなかった ID を `notReturned` に一覧表示するため、後者は改めて要求できます。
- 1 回の応答に収まらない読み取りは `tooLarge` で拒否され、絞り込み方が示されます。

## 編集ツール

ID は `erd_list` と `erd_get`、またはそのエンティティを作った呼び出しの `createdIds` から得ます。
`x` と `y` はキャンバス上の左端と上端の位置をピクセル単位で表し、色は `#3b82f6` のような CSS の 16 進カラーです。

### テーブル

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_table` | | 空いている場所に空のテーブルを追加し、その ID を `createdIds` で返します。 |
| `erd_remove_table` | `tableId` | テーブルを、そのカラム、インデックス、テーブルに接するすべてのリレーションシップとともに削除します。 |
| `erd_change_table_name` | `tableId`、`value` | テーブル名を変更します。 |
| `erd_change_table_comment` | `tableId`、`value` | テーブルのコメントを設定します。空文字列で消去します。 |
| `erd_change_table_color` | `tableId`、`color` | テーブルの色を設定します。 |
| `erd_move_table` | `tableId`、`x`、`y` | テーブルをキャンバス上の位置に移動します。 |
| `erd_move_tables` | `positions` | 複数のテーブルを 1 つの編集で移動し、1 回の `erd_undo` で元に戻せます。`positions` はテーブルごとに `{ tableId, x, y }` を持ち、各テーブルは 1 回までです。 |
| `erd_sort_tables` | | 読み込み時と同じように、カラムの少ないテーブルから順に、すべてのテーブルをキャンバス上に行状に並べます。 |

### カラム

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | テーブルに空のカラムを追加し、その ID を `createdIds` で返します。 |
| `erd_remove_columns` | `tableId`、`columnIds` | 1 つのテーブルからカラムを削除し、それを使うリレーションシップとインデックスの項目も削除します。 |
| `erd_change_column_name` | `tableId`、`columnId`、`value` | カラム名を変更します。 |
| `erd_change_column_data_type` | `tableId`、`columnId`、`value` | `INT` や `VARCHAR(255)` などのデータ型を設定します。[リレーションシップのデータ型同期](../guide/guides/settings.md)がオンの場合は、それをコピーしている外部キーも追従します。 |
| `erd_change_column_default` | `tableId`、`columnId`、`value` | 既定値を SQL のテキストとして設定します。空文字列で消去します。 |
| `erd_change_column_comment` | `tableId`、`columnId`、`value` | コメントを設定します。空文字列で消去します。 |
| `erd_set_column_primary_key` | `tableId`、`columnId`、`value` | `true` でカラムを主キーに含め、`false` で主キーから外します。 |
| `erd_set_column_unique` | `tableId`、`columnId`、`value` | カラムをユニークにするかどうかを設定します。 |
| `erd_set_column_not_null` | `tableId`、`columnId`、`value` | カラムを `NOT NULL` にするかどうかを設定します。 |
| `erd_set_column_auto_increment` | `tableId`、`columnId`、`value` | カラムを自動インクリメントにするかどうかを設定します。 |
| `erd_move_column` | `tableId`、`columnId`、`targetColumnId` | テーブル内でカラムを、別のカラムの位置へ移動します。 |

### リレーションシップ

`relationshipType` は子側の端のカーディナリティで、`ZeroOne`、`ZeroN`、`OneOnly`、`OneN` のいずれかです。
開始テーブルは親、つまり主キーを持つ参照される側で、終了テーブルは子です。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`、`endTableId`、`relationshipType` | 2 つのテーブルをリレーションシップでつなぎます。親の主キーを外部キーカラムとして子にコピーし、親に主キーがない場合は先に主キーカラムを作成します。`createdIds` には、作成された場合はその新しいキーカラム、外部キーカラム、そして最後にリレーションシップの ID が入ります。 |
| `erd_link_columns` | `startTableId`、`startColumnIds`、`endTableId`、`endColumnIds`、`relationshipType` | すでにあるカラムの間にリレーションシップを描き、開始側と終了側のカラムを位置の順に対応付けます。 |
| `erd_remove_relationship` | `relationshipId` | リレーションシップの線を削除します。その外部キーカラムはテーブルに残ります。 |
| `erd_change_relationship_type` | `relationshipId`、`relationshipType` | リレーションシップのカーディナリティを変更します。 |

### インデックス

インデックスのカラム ID は、`erd_get` が返すインデックスのカラム一覧の項目の ID であり、テーブルのカラムの ID ではありません。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_index` | `tableId` | テーブルに空のインデックスを追加し、その ID を `createdIds` で返します。 |
| `erd_remove_index` | `indexId` | インデックスを削除します。 |
| `erd_change_index_name` | `indexId`、`value` | インデックス名を変更します。 |
| `erd_set_index_unique` | `indexId`、`value` | インデックスをユニークにするかどうかを設定します。 |
| `erd_add_index_column` | `indexId`、`columnId` | インデックスのテーブルのカラムを追加し、新しいインデックスのカラム ID を返します。すでにインデックスにあるカラムはそのままです。 |
| `erd_remove_index_column` | `indexId`、`indexColumnId` | インデックスからカラムを 1 つ削除します。 |
| `erd_move_index_column` | `indexId`、`indexColumnId`、`targetIndexColumnId` | インデックス内でカラムを、そのインデックスの別のカラムの位置へ移動します。 |
| `erd_set_index_column_order` | `indexId`、`indexColumnId`、`orderType` | インデックス内の 1 つのカラムの並び順を `ASC` または `DESC` に設定します。 |

### メモ

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_memo` | | 空いている場所に空のメモを追加し、その ID を `createdIds` で返します。 |
| `erd_remove_memo` | `memoId` | メモを削除します。 |
| `erd_change_memo_value` | `memoId`、`value` | メモの本文を置き換えます。 |
| `erd_change_memo_color` | `memoId`、`color` | メモの色を設定します。 |
| `erd_move_memo` | `memoId`、`x`、`y` | メモをキャンバス上の位置に移動します。 |
| `erd_resize_memo` | `memoId`、`width`、`height` | メモのサイズを変更します。幅は約 `116` ピクセル以上、高さは `100` ピクセル以上である必要があります。エディタはメモのサイズ変更をドラッグによるものしか記録しないため、Undo の項目は作りません。 |

### 設定 {#settings}

データベース、Code Generator のオプション、[設定](../guide/guides/settings.md)タブの項目など、ドキュメントに保存される設定です。
`erd_set_show` 以外はどれも Undo の項目を作らないため、`erd_undo` では元に戻せません。

| ツール | 引数 | 値 |
| --- | --- | --- |
| `erd_set_database` | `value` | `MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`SQLite`、`Databricks`、`Snowflake`。そのデータベースのデータ型と、`vendor` を指定しないときに `erd_read` が出力する DDL を決めます。 |
| `erd_set_database_name` | `value` | データベース名。 |
| `erd_set_language` | `value` | Code Generator の言語。`GraphQL`、`csharp`、`Java`、`Kotlin`、`TypeScript`、`JPA`、`Scala`、`Go`、`SQLAlchemy`、`TypeORM`、`Sequelize`、`Drizzle`、`DBML`、`AML`。 |
| `erd_set_table_name_case` | `value` | 生成されるテーブル名のケース。`none`、`camelCase`、`pascalCase`、`snakeCase`。 |
| `erd_set_column_name_case` | `value` | カラム名について、同じ設定。 |
| `erd_set_bracket_type` | `value` | 生成される SQL での名前の囲み方。`none`、`doubleQuote`、`singleQuote`、`backtick`。 |
| `erd_set_relationship_data_type_sync` | `value` | `true` にすると、外部キーカラムを、参照するカラムのデータ型に合わせ続けます。 |
| `erd_set_relationship_optimization` | `value` | ドキュメントに保存される、リレーションシップ最適化のフラグ。 |
| `erd_set_column_order` | `columnType`、`targetColumnType` | テーブルの行の 1 つの要素を、別の要素の位置へ移動します。`columnName`、`columnDataType`、`columnNotNull`、`columnUnique`、`columnAutoIncrement`、`columnDefault`、`columnComment`。 |
| `erd_set_max_width_comment` | `value` | テーブル内でコメントを描画する最大幅（ピクセル単位）。`-1` で制限なし。 |
| `erd_set_ignore_save_settings` | `saveSettingType`、`value` | `true` にすると、保存するファイルから `scroll` または `zoomLevel` を除きます。 |
| `erd_set_show` | `show`、`value` | ダイアグラムの 1 つの要素を表示または非表示にします。`tableComment`、`columnComment`、`columnDataType`、`columnDefault`、`columnAutoIncrement`、`columnPrimaryKey`、`columnUnique`、`columnNotNull`、`relationship`。 |

### 読み込み

どれもドキュメント全体を置き換え、`erd_undo` で前のドキュメントに戻せます。
エディタの Import メニューと同じ方法でスキーマを読み込みます。[ファイルの読み込みと書き出し](../guide/guides/file-import-export.md)を参照してください。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_import_sql` | `value` | `CREATE TABLE` 文などの SQL DDL を読み込みます。 |
| `erd_import_graphql` | `value` | GraphQL SDL を読み込みます。 |
| `erd_import_dbml` | `value` | DBML を読み込みます。 |
| `erd_import_aml` | `value` | AML を読み込みます。 |
| `erd_import_json` | `value` | 別の `.erd.json` ファイルなど、erd-editor の JSON ドキュメントを読み込みます。空のテキストでは空のドキュメントになります。 |

## erd_batch

`erd_batch` は複数の編集ツールを順に、1 つの編集として実行します。すべて適用されるか、何も適用されないかのどちらかです。

- `operations` には最大 100 件の項目を指定し、各項目は `{ tool, as?, args? }` の形です。`args` は `path` を除いた、そのツールの引数です。
- 操作はまずドキュメントのコピーで試されます。拒否された操作は `operations[1] erd_remove_table: …` のように示され、何も適用されません。
- 1 回の `erd_undo` でバッチ全体が元に戻ります。結果の `historyEntries` はバッチ内のエディタの履歴の件数で、`erd_undo` の呼び出し回数ではありません。
- ライブのセッションでは、エディタはバッチ全体を受け入れるか、まったく受け入れないかのどちらかです。

エージェントは、バッチが作成する ID を呼び出す前に知ることができません。そこで `as` で名前を付けた操作の ID は、後の操作から参照できます。最初に作成された ID は `$name` または `$name.0`、2 番目は `$name.1`、最後は `$name.last` です。
参照が解決されるのはエンティティの ID を受け取る引数だけなので、`$x` と書かれた名前やコメントはテキストのままです。

テーブルとそのカラム、リレーションシップを 1 回の呼び出しで作成する例です。

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN" } }
  ]
}
```

## 結果

編集は 1 行の JSON を返します。

```json
{"tool":"erd_add_table","mode":"live","createdIds":["b7u59tHkuXTA1hhtWh_bD"],"batches":1,"historyEntries":1}
```

| フィールド | 意味 |
| --- | --- |
| `mode` | `live` または `headless`。[ライブとヘッドレス](./live-and-headless.md)を参照してください。 |
| `createdIds` | 呼び出しが作成したものの ID を、作成した順に並べたもの。 |
| `batches`、`historyEntries` | 呼び出しが送った変更のバッチの数と、作成したエディタの履歴の件数。 |
| `undoable`、`undoNote` | `erd_undo` がその呼び出しを飛ばす場合は `undoable` が `false` になり、`undoNote` がその理由を示します。理由は、そのツールが Undo の項目を作らないこと、またはドキュメントがすでにその値を持っていたことです。`erd_batch` の結果には常に `undoNote` が付き、1 回の `erd_undo` でバッチ全体が元に戻ることを示します。 |
| `mismatch` | 呼び出しが作成したバッチまたは履歴の件数が、ツールが宣言する数と異なる場合に含まれます。 |
| `notes` | ウィンドウの終了やディスク上のファイルの変更など、セッションについて何かが変わったときに含まれます。 |

拒否は、コードと、どうすればよいかを示すメッセージを含むエラーの結果です。

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 理由 |
| --- | --- |
| `notFound` | ID が指すものが存在しないか、ファイルが存在しません。 |
| `invalidArgs` | 引数がないか、値が正しくありません。 |
| `invalidPath` | パスが ERD ドキュメントではありません。 |
| `invalidDocument` | ファイルが、エディタで読めるドキュメントではありません。 |
| `tooLarge` | 読み取りが 1 回の応答に収まりません。 |
| `blocked` | ハブがオフの VS Code のウィンドウが、ドキュメントを保持しています。 |
| `conflict` | 呼び出しの間にディスク上のファイルが変更されました。何も書き込まれていません。 |
| `hubAppeared`、`hubGone` | 編集の間に、ウィンドウがドキュメントを扱い始めたか、扱うのをやめました。何も書き込まれていません。 |
| `notSaved` | `erd_save` がエディタのドキュメントを保存できませんでした。 |
| `readonly` | ドキュメントが読み取り専用で開かれています。 |
| `protocolMismatch` | 拡張機能とサーバーのプロトコルのバージョンが異なります。 |
| `hubUnreachable`、`timeout`、`disconnected` | ウィンドウのハブが接続を受け付けなかったか、30 秒以内に応答しなかったか、呼び出しの途中で接続を切りました。 |

ほかのコードはまれにしか発生しません。どの拒否にも、何が起きたかを示すメッセージが含まれます。

編集ツール、`erd_batch`、3 つの読み取りツールは、宣言していない引数や型の誤った引数を、ドキュメントに触れる前に JSON-RPC の invalid params エラー（`-32602`）で拒否するため、綴りを誤った引数が黙って無視されることはありません。
5 個のセッションのツールは、知らない引数を無視します。
