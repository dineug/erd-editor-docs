---
sidebar_position: 12
description: Schema SQL タブでのダイアグラムの DDL の確認、オプションパネルでのデータベース、引用符、ステートメント、ヘッダー、空のコメントへの論理名、テーブルの選択、テーブルの前後に書き出す独自のスクリプトの追加、SQL の保存とコピー。
---

# Schema SQL

`Schema SQL` タブには、選択しているデータベース向けのダイアグラムの DDL が表示されます。キー、インデックス、外部キーを含めてテーブルを作成する SQL です。  
ツールバーで `Schema SQL` タブに切り替えるか、[クイック検索](./quick-search.md)の `Tab` から `Schema SQL` を選びます。`Export` サブメニューから `Schema SQL` を選んでも、保存できる状態で開きます。[SQL の保存とコピー](#sql-の保存とコピー)を参照してください。

SQL は左側に表示され、その右側にある `Schema SQL` という見出しのオプションパネルに、SQL の内容を決める選択肢が並びます。[オプションパネル](#オプションパネル)を参照してください。右から左に書く表示言語でも、SQL は左側に置かれたまま、左から右に読む向きで表示されます。  
タブを最初に開いたときにエディタの幅が 640 px 未満でなければ、パネルは自動で開きます。パネルのヘッダーにある `Hide options` で折りたたみ、コードの右上にある `Show options` で再び開きます。その後は、エディタを開いている間、タブを切り替えても、開いたまま、または折りたたんだままの状態が保たれます。この状態は Code Generator タブのパネルとは連動せず、ファイルに保存されることもありません。

![Export > Schema SQL を開き、ステートメントを Drop & re-create に、ヘッダーを USE に切り替えてから、テーブルの前に SET NAMES のスクリプトを追加する様子](/img/demo-schema-sql-options.webp)

SQL を右クリックすると、次の項目を持つコンテキストメニューが開きます。

- `Database` と `Bracket`。どちらもサブメニューで、現在の値にチェックが付きます。
- `Statements` と `Header`。どちらもサブメニューで、適用されている選択肢にチェックが付きます。データベースにない選択肢には `not in Oracle` のような淡い色の注記が付き、選んでも何も起きません。
- `Options panel`。パネルが表示されている間はチェックが付き、パネルを折りたたむか開きます。
- `Save file`

このタブを開いている間、クイック検索には `Database` と `Bracket`、データベースにある選択肢だけを一覧表示する `Schema SQL: Statements` と `Schema SQL: Header`、そしてパネルを折りたたむか開く `Schema SQL: Options panel` が表示されます。  
`Write logical names into empty comments` はオプションパネルにしかなく、コンテキストメニューにもクイック検索にも表示されません。[コメントとしての論理名](#logical-names-as-comments)を参照してください。

SQL はタブを開いたときに書き出され、その後はパネルの選択肢、データベース名、スクリプトのいずれかが変わるたびに書き出し直されます。共同編集者やコーディングエージェントによる編集など、タブを開いている間にテーブルに加えられた編集は、タブを離れて戻ってきたとき、またはそれらのいずれかが変わったときに表示されます。

[テーブルのプロパティ](./table-related-functions.md#table-properties)にも独自の `Schema SQL` タブがあり、1 つのテーブルの DDL を表示します。このタブは常にヘッダーもスクリプトもない通常の `CREATE` 文を書き出し、空のコメントに論理名を書き出すことはありません。オプションパネルはなく、コンテキストメニューには `Database` と `Bracket` しかありません。

## オプションパネル

パネルには、それぞれ見出しの付いた 3 つのグループがあります。

1. `Saved in the document`: `Database` と `Bracket`。[データベースと Bracket](#データベースと-bracket) を参照してください。
2. `This window only`: `Statements`、`Header`、`Write logical names into empty comments`、そしてダイアグラムに[テーブルグループ](./table-groups.md)がある間は `Tables`。[ステートメント](#ステートメント)、[ヘッダー](#ヘッダー)、[コメントとしての論理名](#logical-names-as-comments)、[テーブル](#テーブル)を参照してください。
3. `Saved in the document · written as is for every database`: `Before tables` と `After tables` のスクリプト。[前後のスクリプト](#前後のスクリプト)を参照してください。

パネルの下部には `Save file` と `Copy` があります。[SQL の保存とコピー](#sql-の保存とコピー)を参照してください。

`This window only` の下の選択は、それを選んだエディタのウィンドウに属します。ドキュメントに保存されることも、共同編集者と共有されることも、Undo のために記録されることもなく、エディタを閉じるか再読み込みするとリセットされます。タブを切り替えても保持されます。  
`Statements` は `If not exists`、`Header` は `CREATE + USE` から始まり、`Write logical names into empty comments` はオフで始まります。一方、エディタを組み込むページが [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) で読み取る SQL と、[コーディングエージェントが読み取る](../../mcp/tools.md#reading-a-document) SQL は、`Create` でヘッダーなしの状態から始まり、指定しない限り論理名を書き出しません。

選択しているデータベースにない選択肢は、`Not in Oracle` のような `Not in <database>` というツールチップが付いた淡い色の状態でパネルに残り、押しても何も起きません。  
このとき SQL はそのデータベースにある最も近い形式を使い、その形式のボタンが押された状態で表示されます。`If not exists` は `Create` に、`CREATE + USE` は `USE`（データベースに `USE` もない場合は `None`）に、`USE` は `None` に置き換わります。選んだ内容は保持されるため、それがあるデータベースに切り替えると元に戻ります。

## データベースと Bracket

`Database` はダイアグラムのデータベースで、キャンバスのコンテキストメニューの `Database` や Code Generator のものと同じ設定です。[データベース](./table-related-functions.md#databases)を参照してください。Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake、SQLite が並び、既定値は MySQL で、ほかの編集と同じようにファイルに保存されます。

`Bracket` は、テーブル名、カラム名、制約名、インデックス名を囲む引用符を設定します。`SingleQuote`、`DoubleQuote`、`Backtick`、または引用符をまったく付けない `None` から選び、既定値は `None` です。Code Generator のものと同じ設定です。[Bracket](./code-generator.md#bracket) を参照してください。  
名前を二重引用符でしか囲まない Snowflake は、`None` 以外のどれを選んでも二重引用符を使い、Databricks は常に名前をバッククォートで囲みます。  
`Bracket` がファイルに保存されるのは、設定タブの `Bracket Type` のロックがオフの間だけで、新しいダイアグラムではすべてのロックがオンです。ロックがオンの間に変更すると、画面上の SQL は書き換わりますが、ファイルはロックされた値を保持し、ダイアグラムはその値で開き直されます。[ロック](./settings.md#ロック)を参照してください。

データベースが Oracle で、Oracle 12.1 以前が受け付けない 30 バイトを超える名前が SQL に含まれている間は、2 つのリストの下に注記が表示され、`Oracle 12.2+ for names over 30 bytes: <names>` の形でそれぞれの名前を挙げます。対象はテーブル名、カラム名、スキーマ名、キー名、インデックス名、シーケンス名、トリガー名です。SQL 自体は変わりません。

## ステートメント

`Statements` は、テーブルをどのように作成するかを決めます。

- `Create` は通常の `CREATE` 文を書き出します。
- `If not exists` は、すでに存在するテーブルとインデックスをスキップします。MySQL、MariaDB、PostgreSQL、SQLite、Databricks にあり、MSSQL、Oracle、Snowflake では代わりに `Create` を書き出します。
  - MySQL は、各テーブルをユニーク制約、インデックス、外部キーを内側に含めた `CREATE TABLE IF NOT EXISTS` として書き出し、全体を `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` と `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;` で挟みます。
  - MariaDB は、`CREATE TABLE`、各 `UNIQUE` 制約と `FOREIGN KEY` 制約、各 `CREATE INDEX` のそれぞれの文に `IF NOT EXISTS` を付けます。
  - PostgreSQL は `CREATE TABLE IF NOT EXISTS` と `CREATE INDEX IF NOT EXISTS` を書き出し、各外部キーは追加し直す前に `DROP CONSTRAINT IF EXISTS` で削除します。
  - SQLite は `CREATE TABLE IF NOT EXISTS` と `CREATE INDEX IF NOT EXISTS` を書き出します。
  - Databricks は `CREATE TABLE IF NOT EXISTS` を書き出し、各外部キーは追加し直す前に `DROP CONSTRAINT IF EXISTS` で削除します。
- `Drop & re-create` は、Snowflake を除き、書き出すすべてのテーブルを作成し直す前に削除します。すべてのデータベースにあり、次のように書き出します。
  - MySQL と MariaDB は、外部キーのチェックをオフにしてから元に戻す同じ 2 行の間に、テーブルごとに `DROP TABLE IF EXISTS` を書き出します。
  - PostgreSQL は、すべてのテーブルを挙げた 1 つの `DROP TABLE IF EXISTS` を書き出します。リストにないテーブルがそのいずれかを参照している場合、この文は失敗します。`CREATE + USE` のヘッダーでは、名前にスキーマを含まないテーブルは、`shop.member` のようにそのスキーマから削除されます。
  - MSSQL は 1 つのトランザクションを書き出します。ボタンのツールチップ `SQL Server 2016+` が示すとおり、SQL Server 2016 以降が必要です。書き出すテーブルが持つ外部キーを削除してから、1 つの `DROP TABLE IF EXISTS` でテーブルを削除し、エラーが起きるとロールバックします。リストにないテーブルが持つ外部キーは、それでも削除の妨げになります。
  - SQLite は、その接続ではオフのままになる `PRAGMA foreign_keys=OFF;` を書き出し、続いてテーブルごとに `DROP TABLE IF EXISTS` を書き出します。
  - Oracle は、テーブルごとに `DROP TABLE … CASCADE CONSTRAINTS` を、Auto Increment のシーケンスごとに `DROP SEQUENCE` を書き出します。それぞれ `/` の行で終わる PL/SQL ブロックに入っており、テーブルやシーケンスが存在しない場合に発生するエラーを無視します。
  - Databricks は、テーブルごとに `DROP TABLE IF EXISTS` を書き出します。
  - Snowflake は何も削除せず、代わりに `CREATE OR REPLACE TABLE` を書き出します。

`Drop & re-create` が適用されている間は、パネルの警告が削除するテーブルを挙げます。`Drops <tables> before creating them. Their rows are lost.`、Snowflake では `Replaces <tables>. Their rows are lost.` と表示されます。  
5 つまではすべてのテーブルの名前を挙げます。5 つを超えると、最初の 4 つを挙げて残りの数を示し、`a, b, c, d, and 3 more tables` のようになります。

## ヘッダー

`Header` は、SQL を実行するデータベースまたはスキーマを作成または選択する文で SQL を始めます。名前にはツールバーの `database name` フィールドに入力したダイアグラムのデータベース名を使い、`Bracket` の文字で囲みます。

- MySQL と MariaDB: `USE` は `USE shop;` を書き出し、`CREATE + USE` はその前に `CREATE DATABASE IF NOT EXISTS shop;` を書き出します。
- MSSQL: `USE` は `USE shop` と `GO` を書き出し、`CREATE + USE` はその前に `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` と `GO` を書き出します。
- PostgreSQL には `CREATE + USE` しかなく、`CREATE SCHEMA IF NOT EXISTS shop;` と `SET search_path TO shop, public;` を書き出します。
- Oracle には `USE` しかなく、`ALTER SESSION SET CURRENT_SCHEMA = shop;` を書き出します。`CREATE + USE` はこれに置き換わるため、タブの既定のヘッダーで Oracle が書き出すのはこの行です。
- Snowflake と Databricks: `USE` は `USE SCHEMA shop;` を書き出し、`CREATE + USE` はその前に `CREATE SCHEMA IF NOT EXISTS shop;` を書き出します。
- SQLite にはどちらもなく、ヘッダーを書き出しません。

データベースに `USE` または `CREATE + USE` がある場合、ボタンのツールチップはそのデータベースで書き出す内容を示します。PostgreSQL では `CREATE SCHEMA + SET search_path` のようになります。

ヘッダーが書き出されるのは、データベース名が単純な識別子である間だけです。単純な識別子とは、ASCII の英字（`A`–`Z`、`a`–`z`）または `_` で始まり、その後に ASCII の英字、数字、`_` が続くものです。  
空の名前を含め、それ以外の名前ではヘッダーは書き出されず、PostgreSQL の `DROP TABLE` もスキーマを指定しません。`None` 以外のヘッダーが適用されている間は、`Header` の下の注記がそのことを `Database name "<name>" is not a valid identifier.` と伝えます。  
新しいダイアグラムのデータベース名は空のため、名前を付けるまでパネルには `Database name "" is not a valid identifier.` と表示されます。

## コメントとしての論理名 {#logical-names-as-comments}

`This window only` の下にあるスイッチ `Write logical names into empty comments` は、どのデータベースでも、コメントが空のテーブルやカラムについて、その[論理名](./logical-names.md)を DDL に書き出します。

![Schema SQL のパネルで Write logical names into empty comments をオンにすると、order_items の各カラムの論理名が空の COMMENT に書き出され、members のコメントはそのまま残る様子](/img/demo-schema-sql-logical-names.webp)

- テキストのあるコメントが常に優先されます。論理名がそのコメントを置き換えることも、コメントに追加されることもありません。
- 空白だけのコメントは空として扱われるため、その代わりに論理名が書き出されます。空または空白だけの論理名は何も書き出さず、そのテーブルやカラムにはコメントが付かないままです。
- 論理名は、そのデータベースがコメントを書き出す位置と形式で書き出され、引用符も同じようにエスケープされます。[コメント](#comments)を参照してください。

例えば MySQL では、論理名が `Member ID` でコメントのないカラム `id` は `COMMENT 'Member ID'` 付きで書き出され、論理名が `Email` でコメントが `Sign-in address` のカラム `email` は `COMMENT 'Sign-in address'` のままです。

`Statements` や `Header` と同じく、このスイッチはウィンドウに属し、オフで始まります。[オプションパネル](#オプションパネル)を参照してください。  
読み込みで、このようなコメントが論理名として読み戻されることはありません。[コメント](./file-import-export.md#comments)を参照してください。

## テーブル

ダイアグラムに[テーブルグループ](./table-groups.md)が 1 つ以上ある間は、表示しているか非表示かにかかわらず、`This window only` の下に `Tables` が表示され、次の選択肢ごとにチェックボックスが並びます。

- `All`。すべてのボックスにチェックを付けるか、外します。一部だけにチェックが付いている間は、中間の状態で表示されます。
- テーブルグループごとに 1 つのボックス。ダイアグラムでのグループの順に並び、グループの名前（名前のないグループは `unnamed`）がラベルになり、グループに色がある場合はその色の点がラベルの前に付きます。
- `No group`。どのグループにも属さないテーブルを表します。

すべてのボックスにチェックが付いている場合、タブはダイアグラム全体を書き出します。  
一部だけにチェックが付いている場合は、チェックしたボックスのテーブルを、そのインデックスと、そのテーブルが持つ外部キーとともに書き出します。外部キーには、対象から外れたテーブルを参照するものも含まれます。前後のスクリプトは引き続き書き出され、`Drop & re-create`、その警告、長い名前に関する Oracle の注記は、それらのテーブルだけを対象にします。  
どのボックスにもチェックが付いていない場合、タブは何も書き出さず、コードの上に `No tables chosen. Check some under Tables.` というヒントが表示されます。このとき `Save file` は空のファイルを保存し、`Copy` は空のテキストをコピーします。

`Statements` や `Header` と同じく、この選択はウィンドウに属します。[オプションパネル](#オプションパネル)を参照してください。  
後から追加したグループは、その時点ですべてのボックスにチェックが付いていた場合にだけ、チェックが付いた状態で始まります。グループを削除するとそのボックスもなくなり、最後のグループを削除すると、再びすべてにチェックが付きます。  
この選択はこのタブだけに適用されます。テーブルのプロパティの `Schema SQL` タブと `getSchemaSQL()` は影響を受けません。

## 前後のスクリプト

`Before tables` と `After tables` には、テーブルの前に置く `CREATE EXTENSION` や `SET` の文、テーブルの後に置く権限の付与、ビュー、初期データなど、独自の SQL を書きます。  
これらはドキュメントに保存され、データベースにかかわらず、ダイアグラム全体で 1 組です。どちらも検証されることなく、入力したとおりに SQL に書き出されます。前のスクリプトはヘッダーの後、`DROP` 文とテーブルの前に、後のスクリプトは最後に書き出されます。

改行は LF で書き出され、スクリプトの前の空行と後ろの空白は取り除かれます。  
MSSQL では、2 つのフィールドの下の行に記載されているとおり、最後の行が `GO`（または回数付きの `GO`）ではないスクリプトの後に `GO` の行が追加されます。Oracle では、PL/SQL ブロックの終わりの `/` の行を自分で書きます。

フィールドは SQL を構文ハイライトし、テキストに合わせて広がります。  
編集は、ほかの場所をクリックするかタブを切り替えてフィールドを離れたときに適用され、そのとき初めて横の SQL とドキュメントが変わります。フィールドをクリックしただけでは、何も変わりません。  
スクリプトの編集は、ほかの編集と同じようにダイアグラムを変更します。ファイルに保存され、共同編集者にも表示され、適用された各編集は [Undo の履歴](./undo-redo.md)の 1 ステップになり、ERD タブから Undo できます。  
フィールドに入力している間は、エディタ自身のショートカットはフィールドに任されるため、`Ctrl + Z` (Windows/Linux) または `⌘ + Z` (Mac) はそこでの入力を取り消し、コピー、切り取り、貼り付けはダイアグラムではなくテキストに対して動作します。  
クイック検索と[エクスプローラーの検索](./find-and-replace.md)は、引き続きそれぞれのショートカットである `Ctrl + K` と `Ctrl + F` (Windows/Linux) または `⌘ + K` と `⌘ + F` (Mac) で開きます。`Ctrl + F` または `⌘ + F` を押すと ERD タブに切り替わるため、タブを切り替えたときと同じように、入力した編集が適用されます。  
キーボードフォーカスのないフィールドは、共同編集者や[コーディングエージェント](../../mcp/tools.md#settings)がそのスクリプトに加えた変更に追従します。フォーカスのあるフィールドでは、何も入力せずに離れたときにその変更が表示されます。入力していた場合は、離れたときに自分のテキストが適用され、相手の変更を置き換えます。

## SQL の保存とコピー

パネルの下部またはコンテキストメニューにある `Save file` は、現在のデータベース、括弧の種類、ステートメント、ヘッダー、論理名のコメント、テーブル、スクリプトを反映した、タブに表示されているとおりの SQL を `<database name>-<timestamp>.sql` として保存します。ほかの書き出しと同じ方法で名前が付けられ、保存されます。[書き出し](./file-import-export.md#exporting)を参照してください。

キャンバスのコンテキストメニューまたはクイック検索の `Export` ▸ `Schema SQL` は、それだけでは何も保存しません。  
このタブに切り替え、オプションパネルを折りたたんでいた場合でも開き、`Save file` にキーボードフォーカスを置くため、`Enter` を押すとファイルが保存されます。

パネルの下部にある `Copy`、またはコードにマウスを重ねている間にその右上に表示されるコピーボタンで、SQL をコピーします。  
チェックマークの付いた `Copied!` のトーストが 2 秒間表示され、コピーされたことを伝えます。ブラウザやホストがクリップボードを拒否した場合は、代わりに警告マークの付いた `Couldn't copy to the clipboard` のトーストが 5 秒間表示され、そのことを伝えます。もう一度コピーすると、トーストが増えるのではなく置き換わります。  
SQL は選択もできるため、一部だけを取り出すこともできます。

## DDL が書き出す内容

これらの規則は、エディタが Schema SQL を書き出すすべての場所に当てはまります。このタブとそのファイル、そしてエディタを組み込むページやコーディングエージェントが読み取る SQL です。  
テーブルのプロパティの `Schema SQL` タブも、表示する 1 つのテーブルについてこれらに従います。ただし、Oracle のシーケンスとトリガーは書き出さず、外部キーも書き出しません（`CREATE TABLE` の中に置かれる SQLite の外部キーを除く）。PostgreSQL、Oracle、MSSQL がテーブルの後に置くコメントの文も書き出さないため、この 3 つではコメントが表示されません。

各部分は、空行 1 つを挟んで、ヘッダー、前のスクリプト、`DROP` 文、テーブル、後のスクリプトの順に並びます。テーブルは名前順に書き出されます。  
テーブルもスクリプトもないダイアグラムは、ヘッダーを選んでいても何も書き出しません。

テーブルとカラムは、[名前の表示](./logical-names.md#name-view)が何を表示しているかにかかわらず、物理名で書き出されます。ドメインに紐付いたカラムは、ドメインが設定したカラム自身のデータ型で書き出されます。[ドメインとデータ型](./dictionary.md#domains-and-data-types)を参照してください。

### Auto Increment

`Auto Increment` を付けたカラムは、各データベースの書き方で書き出されます。MySQL と MariaDB では `AUTO_INCREMENT`、MSSQL では `IDENTITY(1,1)`、Snowflake では `AUTOINCREMENT`、PostgreSQL と Databricks では `GENERATED ALWAYS AS IDENTITY` です。  
Oracle では、シーケンス `SEQ_<table>` と、そのシーケンスからカラムに値を入れるトリガー `SEQ_TRG_<table>` が作成されます。トリガーは `/` の行で終わるため、SQL\*Plus と SQLcl で実行できます。

データベースがそのカラムの型で Auto Increment を受け付けない場合は句が省かれ、テーブルの後のコメント行がそのカラムを示します。

- PostgreSQL が受け付けるのは `smallint`、`integer`、`bigint` だけで、`INT`、`INTEGER`、`BIGINT`、`SMALLINT`、`INT2`、`INT4`、`INT8` のどの名前で書いても構いません。それ以外の型のカラムには句も既定値も付かず、コメントは例えば `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.` となります。
- Databricks が受け付けるのは `BIGINT` または `LONG` だけです。
- SQLite が `AUTOINCREMENT` を受け付けるのは、`INT`、`BIGINT`、`INT8` のような整数型の、テーブルで唯一の主キーカラムだけで、幅の指定の有無は問いません。そのカラムは `INTEGER` として、キーは `PRIMARY KEY (id AUTOINCREMENT)` として書き出されます。それ以外の型の唯一のキーは、`AUTOINCREMENT` なしで書き出されます。

### 参照アクション

各データベースがどの ON DELETE と ON UPDATE のアクションを書き出すかは、[ON DELETE と ON UPDATE](./relationship-editing.md#on-delete-and-on-update) に一覧があります。  
Snowflake がアクションを省く場合は、その外部キーの `ALTER TABLE` の上にあるコメントがそのアクションを示します。例えば `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.` のようになります。

### スキーマ修飾されたテーブル名

`Bracket` が `None` の場合、`sales.users` のようにドットを含むテーブル名は、角括弧や二重引用符の外にある最後のドットで分割され、スキーマとテーブルとして読み取られます。

- MySQL、MariaDB、MSSQL、Oracle、PostgreSQL は、書き出す自動の名前をテーブルの部分だけから作ります。5 つすべてで `FK_users_TO_orders` と `IDX_users`、PostgreSQL 以外で `UQ_users_email`、そしてこの中で主キーに名前を付ける 2 つである MSSQL と Oracle で `PK_users` となります。この 2 つでは、`[sales].[users]` と `"sales"."users"` も `PK_users` になり、`[Order]` は `PK_Order` になります。
- SQLite は制約に名前を付けないため、作る自動の名前はインデックスの名前だけです。`CREATE INDEX sales.IDX_users ON users` のようになります。
- Oracle は、テーブルのインデックスと、Auto Increment のカラムのシーケンスとトリガーを、テーブルのスキーマに作成します。`sales.IDX_users`、`sales.SEQ_users`、`sales.SEQ_TRG_users` のようになります。
- Oracle と SQLite では、自分でスキーマを付けたインデックス名はそのスキーマを保ちます。
- 大文字・小文字を区別せずに比べて前の名前と重複する、外部キーやインデックスの自動の名前には番号が付きます。`sales.users` と `hr.Users` の両方が `orders` から参照されている場合、2 つ目のキーは `FK_Users_TO_orders1` になります。

それ以外の `Bracket` では、`"PK_sales.users"` のように、テーブル名全体が 1 つの識別子になります。Snowflake と Databricks は常に名前全体を保ちます。  
[Indexes](./table-related-functions.md#indexes) タブの `Keys` の行にも、同じ名前が表示されます。

### 既定値

カラムの既定値は入力したとおりに書き出されますが、データベースがその式を括弧の中でしか読み取らない場合は括弧で囲みます。すでに括弧で囲まれている既定値はそのまま残ります。

- MySQL は、リテラルと現在時刻以外のすべてを `(uuid())` のように囲みます。また、`BLOB`、`TEXT`、`JSON`、空間データ型、`LONG…` のカラムでは `NULL` 以外のすべての既定値を、`TIMESTAMP` と `DATETIME` 以外のカラムでは現在時刻を囲みます。
- MariaDB は、リテラル、現在時刻、関数呼び出し、名前以外のすべてを囲みます。
- SQLite は、リテラルと名前以外のすべてを `(datetime('now'))` のように囲みます。
- PostgreSQL が囲むのは、`(now() AT TIME ZONE 'utc')` のように、`AT TIME ZONE`、`AND`、`OR`、`IS`、`IN`、`LIKE`、`COLLATE`、`= ANY` のような語を括弧の外に含む式だけです。
- MSSQL、Oracle、Snowflake、Databricks は、すべての既定値を入力したとおりに書き出します。

### コメント {#comments}

空でも空白だけでもないテーブルやカラムのコメント、またはその代わりに [`Write logical names into empty comments`](#logical-names-as-comments) が書き出す論理名は、各データベースのコメントの書き方で書き出されます。

- MySQL と MariaDB はインラインで書き出します。カラムは `COMMENT 'Member ID'` で終わり、テーブルは `) COMMENT 'Members';` で閉じます。MySQL の `If not exists` の一括の文でも同じです。
- Snowflake は、カラムのコメントを `COMMENT 'Member ID'` としてインラインで、テーブルのコメントを閉じ括弧の後の独立した行に `COMMENT = 'Members';` として書き出します。
- Databricks は、カラムのコメントをインラインで、テーブルのコメントを `USING DELTA` の後に `COMMENT 'Members';` として書き出します。
- PostgreSQL は、テーブルの `CREATE TABLE` の直後に `COMMENT ON TABLE member IS 'Members';` と `COMMENT ON COLUMN member.id IS 'Member ID';` を書き出します。Oracle は同じ文を、テーブル、そのユニーク制約、Auto Increment のシーケンスとトリガーの後に書き出します。
- MSSQL は、テーブルとそのユニーク制約の後に、テーブルごと、カラムごとに 1 つの呼び出しを書き出し、それぞれの後に `GO` を付けます。`EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'` のような形で、カラムでは `'column', 'id'` が加わります。  
  テキストは国別文字リテラル `N'…'` のため、SQL Server は韓国語のようにデータベースのコードページにないテキストも、疑問符に置き換えずに保存します。  
  `Bracket` が `None` の場合、`sales.users` という名前のテーブルはスキーマ `sales` とテーブル `users` になり、`[sales].[users]` と `"sales"."users"` も、角括弧と二重引用符が外されて同じになります。スキーマのない名前は `dbo` に属します。`shop.sales.users` のようにスキーマの前に部分がある場合は、そのデータベースのプロシージャ `shop.sys.sp_addextendedproperty` を実行します。それ以外の `Bracket` では、名前全体が `dbo` のテーブルになります。
- SQLite はコメントを保持しないため、それぞれを、説明する対象の上に `--` の行として書き出します。`CREATE TABLE member` の上に `-- Members`、カラムの上に `-- Member ID` のようになります。

引用符で囲まれたコメントの中の引用符は、`'it''s'` や `N'it''s'` のように二重にされ、MSSQL の呼び出しが渡す名前の中の引用符も同様です。Databricks は代わりに引用符とバックスラッシュをバックスラッシュでエスケープし、`'it\'s'` のように、どの Spark のリリースでも読み取れる形にします。SQLite の `--` の行は引用符で囲まれないため、引用符は `-- it's` のように入力したとおりに残ります。  
それ以外は、改行も含めて入力したとおりに書き出されますが、次の 2 つのデータベースは例外です。

- Oracle は空行を省きます（スペースやタブだけの行も空行として扱います）。SQL\*Plus は空行で文を終え、その残りを読み飛ばすためです。`Members`、空行、`Active only` からなるテーブルのコメントは、`COMMENT ON TABLE member IS 'Members` と、次の行の `Active only';` として書き出されます。
- SQLite は、改行が連続する箇所をそれぞれ 1 つのスペースとして書き出します。改行があると `--` の行が終わり、残りが SQL として実行されてしまうためです。同じコメントは `-- Members Active only` として書き出されます。

これらのコメントが読み込みでどのように読み戻されるかについては、[コメント](./file-import-export.md#comments)を参照してください。

## 読み取り専用のエディタ

`readonly` のエディタでも、タブは通常どおり動作します。`Database` と `Bracket` は表示される SQL を変え、`Statements`、`Header`、`Write logical names into empty comments`、`Tables` も機能し、`Save file` と `Copy` で SQL を保存、コピーできます。  
読み取り専用になるのは、2 つのスクリプトのフィールドだけです。
