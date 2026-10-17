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
| `erd_list_documents` | | ERD ドキュメントを `path`、`open`、`active`、`dirty`、`readonly` とともに一覧表示します。作業ディレクトリを扱うエディタがあればそのエディタのドキュメント（JetBrains IDE では開いているすべてのプロジェクトが対象）を、なければ作業ディレクトリ以下の ERD ファイルを表示します。 |
| `erd_open_document` | `create?` | ドキュメントを編集用に開きます。そのドキュメントを扱うエディタがある場合は、そのエディタの ERD Editor で開きます。`create` を付けると、ファイルがなければ先に作成し、拡張子のない名前には `.erd.json` が付きます。 |
| `erd_save` | | エディタが保持しているドキュメントを保存します。VS Code はこれが呼び出されるまでエージェントの編集を未保存のままにします。Obsidian と JetBrains IDE はユーザーの編集と同じようにそれらを保存し、これを呼び出すとすぐに書き込まれます。ヘッドレスではすべての編集がすでに書き込まれているため、何もしません。 |
| `erd_undo` | | このエージェントが行った最後の編集を元に戻します。ユーザーの編集は元に戻しません。Undo の項目を作らなかった呼び出しは飛ばされ、その名前が示されます。 |
| `erd_redo` | | `erd_undo` が最後に元に戻した編集を、再び適用します。 |

各モードで保存と Undo がどう動作するかは、[ライブとヘッドレス](./live-and-headless.md)を参照してください。

## ドキュメントの読み取り {#reading-a-document}

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_list` | `query?`、`offset?`、`limit?`、`namesOnly?` | 設定と件数、続いて 1 ページ分のテーブルを、そのインデックスとリレーションシップとともに返します。各テーブルには ID、キャンバス上の位置とサイズ、カラム数、そしてテーブルグループに属している場合はそのテーブルグループが付きます。検索でない場合は、テーブルの後にテーブルグループ、その後にメモが続きます。 |
| `erd_get` | `tableIds?`、`tableNames?`、`relationshipIds?`、`indexIds?`、`memoIds?`、`tableGroupIds?` | 指定したエンティティの全体を返します。テーブルはカラムとテーブルグループとともに、リレーションシップはそのカラムと `onDelete`、`onUpdate` とともに、インデックスはそのカラムとともに、メモは本文とともに、テーブルグループはそのテーブルとともに返します。 |
| `erd_read` | `format`、`vendor?`、`statements?`、`header?`、`tableIds?`、`tableNames?`、`groupNames?` | ドキュメント全体を 4 つの形式のいずれかで一度に返すか、一部のテーブルまたはテーブルグループだけの DDL を返します。 |

エージェントは `erd_list` で ID を見つけ、`erd_get` でカラムなどの詳細を読み取り、それらの ID を編集ツールに渡します。
`erd_list` のテーブルのサイズは、キャンバス上でテーブルが占める矩形です。高さは正確で、幅は概算です。
テーブルグループは、保存されている矩形と、その名前、色、含むテーブルの数とともに一覧に含まれます。
各リレーションシップは、両端の 2 つのテーブルのどちらか一方とともに、1 回だけ一覧に含まれます。
`erd_list` と `erd_read` が返す設定は、ファイルに保存されるとおりのものです。[設定](#settings)を参照してください。

`erd_read` は次の 4 つの形式のいずれかを受け取ります。

| `format` | 返す内容 |
| --- | --- |
| `snapshot` | すべてのエンティティとその ID を含むコンパクトな JSON です。テーブルグループも含まれ、設定も Schema SQL のスクリプトとともに含まれます。閲覧者ごとに異なるもの、つまり計測した幅、重なり順、表示、タブは含まれません。大きなスキーマでは大きくなります。 |
| `sql` | 8 つのデータベース `Databricks`、`MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`Snowflake`、`SQLite` のいずれかの DDL です。`vendor` の既定値は、ドキュメントに設定されているデータベースです。ドキュメント全体の DDL には、その前後のスクリプトが含まれます。`tableIds`、`tableNames`、`groupNames` のいずれかを指定すると、それらのテーブルだけを、それらが持つ外部キーとともに、スクリプトなしで返します。外部キーには ON DELETE と ON UPDATE のアクションが付きますが、対象のデータベースが省くアクションは除きます。[ON DELETE と ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) を参照してください。 |
| `json` | 保存でファイルに書き込まれるとおりのドキュメント全体です。エディタがまだ保存していない編集も含まれます。[保存形式とランタイム値](../api/advanced/schema.md#保存形式とランタイム値)を参照してください。 |
| `scripts` | ドキュメントの前後のスクリプトだけを、`{"before":"…","after":"…"}` の形で返します。設定されていないスクリプトは空になり、スキーマがどれほど大きくても返すのはスクリプトだけです。 |

`vendor`、`statements`、`header`、`tableIds`、`tableNames`、`groupNames` を受け取るのは `sql` 形式だけで、ほかの形式はこれらを拒否します。

- `statements`: 既定値の `create`、MySQL、MariaDB、PostgreSQL、SQLite、Databricks では `CREATE TABLE IF NOT EXISTS` を、それ以外のデータベースでは通常の `CREATE TABLE` を書き出す `ifNotExists`、またはテーブルを作成する前に削除する `recreate` のいずれかです。`recreate` では、Snowflake は代わりに `CREATE OR REPLACE TABLE` を書き出します。
- `header`: 既定値の `none`、ドキュメントのデータベース名が示すデータベースまたはスキーマを選択する `use`、またはそれを先に作成する `createAndUse` のいずれかです。Oracle には `use` しかないため、そこでは `createAndUse` は `use` を書き出し、PostgreSQL には `createAndUse` しかないため、そこでは `use` はヘッダーを書き出しません。SQLite はヘッダーを書き出さず、データベース名が空か単純な識別子でない間は、どのデータベースもヘッダーを書き出しません。
- `groupNames`: 指定したテーブルグループのテーブルです。グループは大文字と小文字を区別せずに名前で指定し、そのテーブルは `tableIds` と `tableNames` のテーブルに加えられます。どのグループにも一致しない名前は `notFound` で拒否されます。テーブルを含まないグループは何も加えず、指定したグループがすべて空でテーブルも指定していない場合のように、テーブルが 1 つも残らない読み取りは `invalidArgs` で拒否されます。

`statements` と `header` は、一部のテーブルの DDL にも適用されます。これらはエディタの [Schema SQL](../guide/guides/schema-sql.md#オプションパネル) タブの `Statements` と `Header` のオプションと同じように働きますが、タブのほうは `If not exists` と `CREATE + USE` から始まります。
名前は、ファイルに保存される括弧の種類で囲まれます。`Bracket Type` がロックされている間は、ロックされた括弧の種類です。[ロック](../guide/guides/settings.md#ロック)を参照してください。

### 大きなスキーマ

数百、数千のテーブルを持つスキーマも扱えます。
1 回の読み取りが返すのは最大 40,000 文字で、Claude Code がツールの結果をファイルに退避させる境目を下回ります。

- `erd_list` は既定で 1 ページ 100 件を、テーブル、テーブルグループ、メモの順に返し、次のページの開始位置を `nextOffset` と `note` で示します。その `nextOffset` を `offset` として、同じ `query` とともに渡します。
- `query` は、テーブルやカラムの名前またはコメントに含まれる語でテーブルを探し、大文字と小文字を区別しません。名前に含まれる語が多いテーブルほど先に来ます。検索では、テーブルグループもメモも一覧に含まれません。
- `namesOnly` はテーブル名だけを一覧表示し、短い名前なら 1 回の応答で約 2,000 件を返します。
- `erd_get` と `erd_read` は ID に加えて `tableNames` も受け取り、`erd_read` は `groupNames` も受け取るため、大きなスキーマで SQL クエリを頼まれたエージェントは、必要なテーブルの DDL だけを読み取れます。
- `erd_get` は、何も指していない ID と名前を `missing` に、1 回の応答に収まらなかった ID を `notReturned` に一覧表示するため、後者は改めて要求できます。
- 1 回の応答に収まらない読み取りは `tooLarge` で拒否され、絞り込み方が示されます。

## 編集ツール

ID は `erd_list` と `erd_get`、またはそのエンティティを作った呼び出しの `createdIds` から得ます。
新しい ID は `03h17be2plxpj5n59tqag7ogj` のような 25 文字の小文字の英字と数字ですが、ドキュメントがすでに持っている ID はその形のままです。そのため、ID の形から何かを読み取らないでください。
`x` と `y` はキャンバス上の左端と上端の位置をピクセル単位で表し、色は `#3b82f6` のような CSS の 16 進カラー、または色を外す空文字列です。

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
| `erd_sort_tables` | | `erd_import_sql`、`erd_import_graphql`、`erd_import_dbml`、`erd_import_aml` が配置するのと同じように、カラムの少ないテーブルから順に、すべてのテーブルをキャンバス上に行状に並べます。テーブルグループのテーブルはまとまったまま配置され、各グループの枠はそのテーブルを囲むように合わせられます。 |

### カラム

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_column` | `tableId` | テーブルに空のカラムを追加し、その ID を `createdIds` で返します。 |
| `erd_remove_columns` | `tableId`、`columnIds` | 1 つのテーブルからカラムを削除し、それを使うリレーションシップとインデックスの項目も削除します。 |
| `erd_change_column_name` | `tableId`、`columnId`、`value` | カラム名を変更します。 |
| `erd_change_column_data_type` | `tableId`、`columnId`、`value` | `INT` や `VARCHAR(255)` などのデータ型を設定します。[リレーションシップのデータ型同期](../guide/guides/settings.md#リレーションシップのデータ型同期)がオンの間は、エディタと同じように、変更はリレーションシップを両方向にたどって伝わります。serial 型は、`erd_add_relationship` がコピーするときと同じく、serial が格納する整数型として外部キーに伝わり、serial のキーは、その外部キーのいずれかが変更されても自身の型を保持して、変更はそこで止まります。この同期をオンまたはオフにするのはユーザーで、`erd_list` はそれを `relationshipDataTypeSync` として返します。 |
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
`onDelete` と `onUpdate` は外部キーの ON DELETE と ON UPDATE のアクションで、`none`、`noAction`、`cascade`、`setNull`、`setDefault`、`restrict` のいずれかです。
`none` は句を書き出さないため、データベースの既定の動作が適用されます。[ON DELETE と ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) を参照してください。
`erd_add_relationship` または `erd_link_columns` で省略したアクションは `none` になります。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`、`endTableId`、`relationshipType`、`onDelete?`、`onUpdate?` | 2 つのテーブルをリレーションシップでつなぎます。親の主キーを外部キーカラムとして子にコピーし、親に主キーがない場合は先に主キーカラムを作成します。各外部キーカラムには、エディタでリレーションシップを描いたときと同じように名前が付けられます。キーが `id` の `users` からは `users_id` ができ、`member_id` のようなキーは名前がそのまま使われます。[外部キーカラムの名前](../guide/guides/relationship-editing.md#foreign-key-column-names)を参照してください。各外部キーカラムはそのキーのデータ型をコピーします。ただし、serial のキーからは `serial4` に対する `integer` のように serial が格納する整数型ができ、単独の `serial` は PostgreSQL、MySQL、MariaDB 以外では `serial` のままです。[識別リレーションシップ](../guide/guides/relationship-editing.md#識別リレーションシップ)を参照してください。`createdIds` には、作成された場合はその新しいキーカラム、外部キーカラム、そして最後にリレーションシップの ID が入ります。 |
| `erd_link_columns` | `startTableId`、`startColumnIds`、`endTableId`、`endColumnIds`、`relationshipType`、`onDelete?`、`onUpdate?` | すでにあるカラムの間にリレーションシップを描き、開始側と終了側のカラムを位置の順に対応付けます。カラムの名前もデータ型も変更しません。 |
| `erd_remove_relationship` | `relationshipId` | リレーションシップの線を削除します。その外部キーカラムはテーブルに残ります。 |
| `erd_change_relationship_type` | `relationshipId`、`relationshipType` | リレーションシップのカーディナリティを変更します。 |
| `erd_change_relationship_on_delete` | `relationshipId`、`onDelete` | リレーションシップの ON DELETE のアクション、つまり親の行を削除したときにその子の行がどうなるかを設定します。 |
| `erd_change_relationship_on_update` | `relationshipId`、`onUpdate` | リレーションシップの ON UPDATE のアクション、つまり親のキーを変更したときにその子の行がどうなるかを設定します。 |

`erd_add_relationship` は実行した時点で外部キーカラムの名前を決めるため、親テーブルとその主キーには先に名前を付けてください。

エディタの [Map Columns](../guide/guides/relationship-editing.md#map-columns) のように、既存のリレーションシップのカラムを変更するツールはありません。
リレーションシップを別のカラムに対応付けるには、外部キーカラムをテーブルに残す `erd_remove_relationship` と、目的のカラムを指定した `erd_link_columns` を、1 回の `erd_undo` で元に戻せる 1 つの `erd_batch` の中で実行します。

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

メモを [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` で非表示にしている間も、`erd_add_memo` はメモを追加し、そのメモはメモが再び表示されるまで非表示のままです。
`erd_list` と `erd_get` は、非表示のメモも一覧に含めます。

### テーブルグループ

テーブルグループは、そのテーブルの背後に描かれる名前付きの枠で、グループの色は枠と、そのテーブルのヘッダー全体に表示されます。[テーブルグループ](../guide/guides/table-groups.md)を参照してください。
テーブルが属するグループは最大 1 つです。`erd_move_table`、`erd_move_tables`、`erd_move_table_group` は、テーブルをどこに置いても、グループがどのテーブルを含むかを変えません。一方、エディタでは、テーブルはドロップした位置によってグループに加わったりグループから外れたりします。[テーブルの追加と削除](../guide/guides/table-groups.md#テーブルの追加と削除)を参照してください。テーブルをグループに入れるのは `erd_add_table_group` と `erd_set_table_group` で、`erd_remove_table_group` はそのテーブルをどのグループにも属さない状態にします。
グループは、タイトルバーを含めて幅 `160` ピクセル以上、高さ `100` ピクセル以上の矩形を保存し、エディタは各テーブルを収めるように広げた枠を描きます。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_add_table_group` | `name`、`color?`、`x?`、`y?`、`width?`、`height?`、`tableIds?` | グループを追加し、その ID を `createdIds` で返します。`tableIds` か、`x`、`y`、`width`、`height` をそろえた矩形のどちらかを渡します。`tableIds` を渡すと、各テーブルはそれまで属していたグループを離れ、矩形は[選択したテーブルのグループ化](../guide/guides/table-groups.md#選択したテーブルのグループ化)と同じようにそれらのテーブルを囲むように合わせられます。矩形を渡すと、[グループの描画](../guide/guides/table-groups.md#グループの描画)と同じように、どのグループにも属しておらず、中心が矩形の内側にあるすべてのテーブルがグループに加わります。`name` が空の場合、グループは名前のないままです。1 回の `erd_undo` でグループが削除され、各テーブルは元のグループに戻ります。 |
| `erd_remove_table_group` | `groupId` | グループを削除します。そのテーブルはその場に残り、どのグループにも属さなくなります。 |
| `erd_change_table_group_name` | `groupId`、`value` | グループ名を変更します。空文字列では名前のないグループになります。 |
| `erd_change_table_group_color` | `groupId`、`color` | グループの色を設定します。 |
| `erd_move_table_group` | `groupId`、`x`、`y` | タイトルバーをドラッグしたときと同じように、矩形がその位置から始まるようにグループを移動し、そのテーブルも同じだけ移動します。横方向と縦方向の移動量の合計が 20 ピクセル未満の移動は、Undo の項目を作りません。 |
| `erd_resize_table_group` | `groupId`、`x?`、`y?`、`width`、`height` | グループの矩形を設定します。そのテーブルはその場に残ります。`x` と `y` を省略すると、矩形の角はそのままです。グループのテーブルを余白とともに収められない矩形は拒否され、収める必要のある範囲がメッセージに示されます。 |
| `erd_set_table_group` | `tableIds`、`groupId` | テーブルをグループに入れます。各テーブルは、それまで属していたグループを離れます。`groupId` が `null` または空文字列の場合は、テーブルをすべてのグループから外します。 |

グループを `View Option` → `Table Groups` で非表示にしている間も、これらのツールはグループを追加、変更し、それらのグループはグループが表示されるまで非表示のままです。[グループの非表示](../guide/guides/table-groups.md#グループの非表示)を参照してください。
`erd_sort_tables` は各グループのテーブルをまとめたまま配置し、`erd_import_dbml` と `erd_import_json` はグループを取り込み（[読み込み](#読み込み)を参照）、`erd_read` は `groupNames` で選んだグループの DDL を書き出します。
テーブルグループが導入される前のリリースの ERD Editor でファイルを保存すると、そのファイルのグループが失われます。`4.0.0` より前の VS Code の拡張機能や、`1.0.0` より前の Obsidian と JetBrains のプラグインがこれに当たります。[アップデート](./installation.md#アップデート)を参照してください。

### 設定 {#settings}

エージェントが設定するのは、スキーマそのものの設定、つまりデータベース、データベース名、[Schema SQL](../guide/guides/schema-sql.md) のスクリプトです。
ドキュメントが保存するそれ以外の設定は、ユーザーがエディタで設定するものです。[View Option](../guide/guides/table-related-functions.md#table-view-options) の切り替え、[設定](../guide/guides/settings.md)タブのオプション、Code Generator の言語と名前のケース、括弧の種類、そして[ロック](../guide/guides/settings.md#ロック)です。
`replace` モードの読み込みを除き、これらを変更するツールはありません。`erd_import_json` は読み込むドキュメントの設定とロックを持ち込み、ほかの 4 つは表示をキャンバスの開始位置に戻します。[読み込み](#読み込み)を参照してください。
サーバー `1.0.0` では、これらを設定するツールが削除されました。`erd_set_language`、`erd_set_table_name_case`、`erd_set_column_name_case`、`erd_set_bracket_type`、`erd_set_relationship_data_type_sync`、`erd_set_relationship_optimization`、`erd_set_column_order`、`erd_set_max_width_comment`、`erd_set_ignore_save_settings`、`erd_set_show` です。

`erd_list` と `erd_read` の `snapshot` 形式は、設定をファイルに保存されるとおりに返します。`lockSettings` には、ロックごとに 1 つずつ、`viewport`、`canvasType`、`language`、`tableNameCase`、`columnNameCase`、`bracketType` のフラグが入ります。
ロックされた言語、名前のケース、括弧の種類は、エディタの画面に何が表示されていても、ロックされた値、つまりファイルが保持し、どのエディタも開くときに使う値として返されます。表示とタブは返されません。

`erd_set_ddl_script` は Undo の項目を作ります。`erd_set_database` と `erd_set_database_name` は作らないため、`erd_undo` では元に戻せません。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_set_database` | `value` | データベースを `MariaDB`、`MSSQL`、`MySQL`、`Oracle`、`PostgreSQL`、`SQLite`、`Databricks`、`Snowflake` のいずれかに設定します。そのデータベースのデータ型と、`vendor` を指定しないときに `erd_read` が出力する DDL を決めます。 |
| `erd_set_database_name` | `value` | データベース名を設定します。`erd_read` の `use` と `createAndUse` のヘッダーは、この名前を使います。 |
| `erd_set_ddl_script` | `position`、`sql` | テーブルの前後に書き出される 2 つのスクリプトのうちの 1 つを設定します。[前後のスクリプト](../guide/guides/schema-sql.md#前後のスクリプト)を参照してください。`position` は、`CREATE EXTENSION` や `CREATE SCHEMA` のようにテーブルの前に書き出される `before`、または `GRANT` や `CREATE VIEW` のようにテーブルの後に書き出される `after` です。`sql` はスクリプト全体を置き換え、最大 10,000 文字で、空文字列ではスクリプトが削除されます。現在のスクリプトは、先に `erd_read` の `scripts` 形式で読み取ってください。 |

スクリプトはどのデータベースの DDL にもそのまま書き出されるため、ドキュメントのデータベース向けに書いてください。MSSQL では、最後の行が `GO` ではないスクリプトの後に `GO` の行が追加されます。
これらのスクリプトが導入される前のリリースの ERD Editor でファイルを保存すると、そのファイルのスクリプトが失われます。`4.0.0` より前の VS Code の拡張機能や、`1.0.0` より前の Obsidian と JetBrains のプラグインがこれに当たります。[アップデート](./installation.md#アップデート)を参照してください。

### 読み込み

これらのツールは、エディタの Import メニューと同じ方法でスキーマを読み込みます。[ファイルの読み込みと書き出し](../guide/guides/file-import-export.md)を参照してください。
どれもテキストを `value` として受け取り、`mode` として既定値の `replace` か、`append` を受け取ります。

| ツール | 引数 | 動作 |
| --- | --- | --- |
| `erd_import_sql` | `value`、`mode?` | `CREATE TABLE` 文などの SQL DDL を読み込みます。 |
| `erd_import_graphql` | `value`、`mode?` | GraphQL SDL を読み込みます。 |
| `erd_import_dbml` | `value`、`mode?` | DBML を読み込みます。各 `TableGroup` は、それが挙げるテーブルを含むテーブルグループになります。[DBML](../guide/guides/file-import-export.md#dbml) を参照してください。 |
| `erd_import_aml` | `value`、`mode?` | AML を読み込みます。 |
| `erd_import_json` | `value`、`mode?` | 別の `.erd.json` ファイルなど、erd-editor の JSON ドキュメントを読み込みます。 |

`replace` はドキュメントを置き換え、`erd_undo` で前のドキュメントに戻せます。

- `erd_import_sql`、`erd_import_graphql`、`erd_import_dbml`、`erd_import_aml` は、すべてのテーブル、リレーションシップ、インデックス、メモ、テーブルグループを置き換えます。ドキュメントの設定はロックも含めて維持しますが、表示だけはキャンバスの開始位置に 100% で戻ります。
- `erd_import_json` は、設定も含めてドキュメント全体を置き換えます。JSON の設定とロックがこのドキュメントのものに代わり、ロックを記録していない JSON では、すべてのロックがオンになり、表示がキャンバスの開始位置に移ります。このドキュメントの設定を保つには、`erd_read` の `json` 形式が返すテキストから始めてください。空のテキストでは、`erd_open_document` が `create` で作成するものと同じ、新しいドキュメントになります。

`append` は、エディタの [Import and Add](../guide/guides/file-import-export.md#import-and-add) と同じように、読み込んだものをドキュメントに追加し、1 回の `erd_undo` で追加全体を取り消せます。

- テキストにあるものは、新しい ID を持つ新しいエンティティとして、1 つのまとまりで入ります。まとまりは、非表示のメモやテーブルグループも含めてドキュメントにあるすべてのものの下に、その左端にそろえて置かれます。すでにあるテーブルと設定はすべてそのまま残り、同じ名前のテーブルも残ります。名前による統合は行われません。
- リレーションシップとインデックスは、読み込みが持ち込むテーブルの間にだけ作られるため、テキストで宣言されていないテーブルへの外部キーは破棄されます。
- `erd_import_sql`、`erd_import_graphql`、`erd_import_aml` はテーブルをそのリレーションシップとインデックスとともに追加し、`erd_import_dbml` はテーブルグループも追加します。`erd_import_json` はテーブル、リレーションシップ、インデックス、メモ、テーブルグループを追加しますが、設定は追加せず、空のテキストは拒否します。

JSON ドキュメントは、テーブルグループも含めて自身の配置を保ちます。`replace` ではテーブルを置く位置として、`append` では追加したまとまりの中での位置として保ちます。
SQL、GraphQL、DBML、AML のテーブルは、`erd_sort_tables` が配置するのと同じように、カラムの少ないテーブルから順に、各グループのテーブルをまとめて行状に並べられます。エディタ自身の Import が可能な場合に使う `Flow` で配置されることはありません。これら 4 つのツールは、どちらのモードでも空のテキストを拒否します。

## erd_batch

`erd_batch` は複数の編集ツールを順に、1 つの編集として実行します。すべて適用されるか、何も適用されないかのどちらかです。

- `operations` には最大 100 件の項目を指定し、各項目は `{ tool, as?, args? }` の形です。`args` は `path` を除いた、そのツールの引数です。
- 操作はまずドキュメントのコピーで試されます。拒否された操作は `operations[1] erd_remove_table: …` のように示され、何も適用されません。
- 1 回の `erd_undo` でバッチ全体が元に戻ります。ただし、元に戻せない操作は除き、結果の `undoNote` がそれらを示します。`erd_set_database` のように Undo の項目を作らないツールの操作と、短い距離の `erd_move_table_group` のように項目を作らずにドキュメントを変更した操作です。Undo の項目をまったく作らなかったバッチは、`erd_undo` に飛ばされます。結果の `historyEntries` はバッチ内のエディタの履歴の件数で、`erd_undo` の呼び出し回数ではありません。
- ライブのセッションでは、エディタはバッチ全体を受け入れるか、まったく受け入れないかのどちらかです。

エージェントは、バッチが作成する ID を呼び出す前に知ることができません。そこで `as` で名前を付けた操作の ID は、後の操作から参照できます。最初に作成された ID は `$name` または `$name.0`、2 番目は `$name.1`、最後は `$name.last` です。
名前に使えるのは ASCII の英字、数字、アンダースコアで、数字で始めることはできず、1 つの名前は 1 つの操作にしか付けられません。
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
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` とそのキー `id` にはリレーションシップより前に名前が付いているため、リレーションシップが `orders` に追加する外部キーカラムは `users_id` になります。

## 結果

編集は 1 行の JSON を返します。

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| フィールド | 意味 |
| --- | --- |
| `mode` | `live` または `headless`。[ライブとヘッドレス](./live-and-headless.md)を参照してください。 |
| `createdIds` | 呼び出しが作成したものの ID を、作成した順に並べたもの。 |
| `batches`、`historyEntries` | 呼び出しが送った変更のバッチの数と、作成したエディタの履歴の件数。 |
| `undoable`、`undoNote` | `erd_undo` がその呼び出しを飛ばす場合は `undoable` が `false` になり、`undoNote` がその理由を示します。理由は、そのツールが Undo の項目を作らないこと、20 ピクセル未満の `erd_move_table_group` のように呼び出しが項目を作らずにドキュメントを変更したこと、またはドキュメントがすでにその値を持っていたことです。`erd_batch` の結果には常に `undoNote` が付きます。バッチが Undo の項目を作った場合、その注記は 1 回の `erd_undo` でバッチが元に戻ることを示し、元に戻らずに残る操作があればその名前を示します。項目を作らなかった場合、結果には `undoable: false` が付き、注記は `erd_undo` がそのバッチを飛ばすことを示します。 |
| `mismatch` | 呼び出しが作成したバッチまたは履歴の件数が、ツールが宣言する数と異なる場合に含まれます。 |
| `notes` | エディタが終了したかドキュメントを扱うのをやめた場合や、ディスク上のファイルが変更された場合など、セッションについて何かが変わったときに含まれます。 |

拒否は、コードと、どうすればよいかを示すメッセージを含むエラーの結果です。

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | 理由 |
| --- | --- |
| `notFound` | ID が指すものが存在しないか、ファイルが存在しません。 |
| `invalidArgs` | 引数がないか、値が正しくありません。 |
| `invalidPath` | パスが ERD ドキュメントではありません。Windows では、Windows が指定どおりに保存しない名前を含むパスや、エディタが別のパスで保持しているドキュメントを指すパスも該当し、その別のパスはメッセージに示されます。 |
| `invalidDocument` | ファイルが、エディタで読めるドキュメントではありません。 |
| `tooLarge` | 読み取りが 1 回の応答に収まりません。 |
| `blocked` | ハブがオフのエディタが、ドキュメントを保持しています。メッセージにはハブをオンにする方法が示されます。VS Code ではワークスペースを信頼して `dineug.erd-editor.agentHub.enabled` をオンにするか、ウィンドウを再読み込みします。Obsidian では Coding agents をオンにするか、Obsidian を再読み込みします。JetBrains IDE では Coding agents をオンにするか、オンなら IDE を再起動します。 |
| `hubDisabled` | JetBrains IDE が、信頼していないプロジェクトでだけドキュメントを保持しています。読み取りは引き続き行えます。エージェントに編集させるには、プロジェクトを信頼してください。 |
| `conflict` | 呼び出しの間にディスク上のファイルが変更されました。何も書き込まれていません。 |
| `hubAppeared`、`hubGone` | エージェントがディスク上で編集していたドキュメントをエディタが扱い始めたか、ドキュメントを扱っていたエディタが動作しているものの、そのロックファイルと接続がなくなりました。何も書き込まれていません。 |
| `notSaved` | `erd_save` がエディタのドキュメントを保存できませんでした。 |
| `readonly` | エディタがドキュメントを読み取り専用で保持しています。例えば、書き込めないファイルや、ダイアグラムとして読めないファイルです。エディタがない場合は、ファイル自体が読み取り専用です。例えば、チェックアウトしていない Perforce や TFVC のファイルです。何も書き込まれていません。 |
| `protocolMismatch` | エディタの ERD Editor 拡張機能またはプラグインと、サーバーのプロトコルのバージョンが異なります。例えば、サーバー `1.0.0` と、VS Code の拡張機能 `3.x` の組み合わせです。読み取りも拒否され、メッセージには更新が必要な側が示されます。[アップデート](./installation.md#アップデート)を参照してください。 |
| `hubUnreachable`、`timeout`、`disconnected` | エディタのハブが接続を受け付けなかったか、30 秒以内に応答しなかったか、呼び出しの途中で接続を切りました。Windows では、`hubUnreachable` は Windows がエージェントをハブに接続させなかったことも意味します。エディタがエージェントより高い権限で動作している場合で、例えばエディタを管理者として起動しエージェントはそうしなかった場合や、エージェントがサンドボックス内で動作している場合です。 |

ほかのコードはまれにしか発生しません。どの拒否にも、何が起きたかを示すメッセージが含まれます。

編集ツール、`erd_batch`、3 つの読み取りツールは、宣言していない引数や型の誤った引数を、ドキュメントに触れる前に JSON-RPC の invalid params エラー（`-32602`）で拒否するため、綴りを誤った引数が黙って無視されることはありません。
5 個のセッションのツールは、知らない引数を無視します。
