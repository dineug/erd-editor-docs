---
sidebar_position: 2
description: ダイアグラムを置き換える、またはその下に追加する JSON・Schema SQL・GraphQL・DBML・AML の読み込みと、JSON・Schema SQL の書き出し、および PNG または SVG 画像としてのダイアグラムの書き出し。
---

# ファイルの読み込みと書き出し

## 外部ファイルの読み込み

キャンバスのコンテキストメニューの `Import` サブメニューから、次の 5 つの形式を読み込めます。

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import` のすぐ下にある `Import and Add` は、ダイアグラムを置き換えずに、ファイルをダイアグラムに追加します。[Import and Add](#import-and-add) を参照してください。  
空のダイアグラムに表示されるウェルカム画面にも、同じ 5 つの形式を持つ `Import` の行があります。[ウェルカム画面](./editing-start.md#ウェルカム画面)を参照してください。

拡張子は大文字・小文字を問わず照合されます。選んだ形式と拡張子が一致しないファイルを選ぶと、読み込みは中止され、`Only <format> files can be imported` と表示されます。形式は `json`、`sql`、`graphql`、`dbml`、`aml` のいずれかで書かれ、例えば `Only sql files can be imported` のようになります。

`Import` は、現在のドキュメントに統合するのではなく置き換えます。1 回の Undo で前のダイアグラムに戻ります。  
JSON ファイルは、[ロック](./settings.md#ロック)を含め、自身の設定も一緒に読み込みます。ファイルがタブ、Code Generator の言語、名前のケース、括弧の種類をロックしている場合、画面には読み込む前の値が表示されたままですが、保存されるのはファイルのロックされた値です。表示位置と拡大・縮小は、ロックの有無にかかわらず、ファイルが指定するとおりになります。ロックが導入される前に保存された JSON ファイルは、すべてのロックがオンで、表示が 100% の状態で読み込まれます。  
それ以外の形式は、表示位置と拡大・縮小を除き、ロックを含めて現在の設定を維持します。表示は 100% から始まります。  
GraphQL、DBML、AML のパーサーは失敗しません。読み取れないファイルは、エラーではなく空のダイアグラムになります。

JSON ファイルは、ファイルにある配置をそのまま保持します。Schema SQL、GraphQL、DBML、AML のファイルのテーブルは、ダイアグラムが変わる前に配置されます。

- ファイルに 2 つ以上のテーブルと 1 つ以上のリレーションシップがある場合は、`Flow` の[自動レイアウト](./table-related-functions.md#auto-layout)で、キャンバスの左上からリレーションシップに沿って左から右へ配置されます。テーブルから自分自身へのリレーションシップも数に入ります。
- それ以外の場合は、左上から複数の行に並べて配置され、カラムの少ないテーブルから順に並びます。
- レイアウトが 6 秒を超えて続くと、`Cancel` ボタンの付いた `Placing tables` の通知が表示されます。`Cancel`、または通知が表示されている間の `Escape` でレイアウトを中止し、代わりにテーブルを複数の行に並べます。レイアウトが失敗した場合、60 秒以内にレイアウトが返ってこない場合、ホストが Shared Worker を動かさない場合も、通知なしで複数の行に並べます。[Web Worker](../../api/installation.md#web-workers) を参照してください。

その後、ダイアグラムは 1 回で置き換わるため、途中の状態が表示されることはありません。テーブルの配置中にタブなどの設定を変更した場合、その変更は維持されます。その間に別のファイルを読み込んだ場合は、最後に始めた読み込みが優先されます。

読み取り専用のエディタは `Import` から何も読み込まず、`Import and Add` も表示しません。

### Import and Add

`Import and Add` は、ダイアグラムを残したまま、その下にファイルを追加します。キャンバスのコンテキストメニューと、ERD タブの[クイック検索](./quick-search.md)にあり、`Import` と同じ 5 つの形式を、同じ拡張子の確認とともに提供します。

![Import and Add > Schema SQL で SQL ファイルを追加し、そのテーブルがリレーションシップに沿って配置され、選択された状態でダイアグラムの下に置かれる様子](/img/demo-import-and-add.webp)

ファイルは貼り付けと同じように取り込まれます。ファイルにあるテーブル、カラム、リレーションシップ、インデックス、メモ、[テーブルグループ](./table-groups.md)はすべて新しいものとして追加され、ダイアグラムにすでにあるテーブルは動かず、設定は何も変わらないため、JSON ファイルの設定は読み込まれません。  
ダイアグラムにすでにある名前のテーブルは、統合されずに、同じ名前の 2 つ目のテーブルとして追加されます。リレーションシップとインデックスはファイルからのみ作られるため、ファイルで定義されていないテーブルへの外部キーが、ダイアグラムにすでにあるテーブルにつながることはありません。

追加したまとまりは、ダイアグラムにあるすべてのもののすぐ下に、その左端にそろえて置かれます。ダイアグラムが空の場合は左上に置かれます。[View Option](./table-related-functions.md#table-view-options) で非表示にしたメモやテーブルグループも、その場所に残っているため数に入ります。  
まとまりの中では、JSON ファイルはテーブルグループを含めて自身の配置を保持します。それ以外の形式は、`Import` と同じ規則で `Flow` または複数の行に並べて配置され、各テーブルグループの枠はそのテーブルに合わせて調整されます。追加したテーブルとメモは、すでにあるすべてのものの上に重なります。

まとまりが置かれると、追加したものだけが選択されます。選択されるのは新しいテーブルと、表示されている間は新しいメモとテーブルグループです。その間にほかのタブへ移っていた場合は、まとまりが置かれる前に ERD タブに切り替わります。その後、まとまりがすでに十分に見えている場合を除き、キャンバスは現在の倍率のままそこまでスクロールします。[移動先の表示位置](./table-related-functions.md#where-a-jump-lands)を参照してください。1 回の Undo で追加全体を取り消せます。  
パーサーが読み取れないファイルや、テーブルもメモもないファイルは、何も追加しません。

1 つのファイルを配置している間に追加した複数の Schema SQL、GraphQL、DBML、AML のファイルは、始めた順にすべて置かれます。その間に追加した JSON ファイルは、読み取られるとすぐに、それらより先に置かれます。`Import` や別のドキュメントの読み込みは、まだ配置中のファイルをすべて破棄します。

コーディングエージェントは、MCP の読み込みツールの `append` モードで、同じようにファイルを追加します。このモードは JSON ファイルの配置を保持しますが、それ以外の形式のテーブルは `Flow` を使わず、常に複数の行に並べます。[読み込み](../../mcp/tools.md#読み込み)を参照してください。

### JSON

[エディタで定義したスキーマ形式](../../api/advanced/schema.md)のファイルを読み込めます。
ファイル名は `.json` で終わる必要があるため、`<データベース名>-<時刻>.erd.json` として書き出したファイルはそのまま読み込めます。`.erd` や `.vuerd` ファイルはここでは読み込めません。以前のリリースで保存したファイルも読み込めます。

![Import > json で保存済みのファイルを読み込み、下書きのドキュメントを設定ごと置き換える](/img/demo-import-json.webp)

### Schema SQL

SQL で定義したスキーマファイルも読み込めます。  
データベースベンダーに関係なく、できるだけ柔軟にパースするよう実装していますが、対応していない構文がある場合もあります。  
ファイル名は `.sql` で終わる必要があります。  
[対応している構文はこちらで確認できます。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Import > Schema SQL で SQL ファイルを読み込み、リレーションシップに沿って配置されたテーブルを縮小して見渡す](/img/demo-import-sql.webp)

カラムは `CREATE TABLE` からのみ読み込みます。`ALTER TABLE ... ADD COLUMN` で追加したカラムは読み取りません。  
`CREATE TABLE` の中のカラムではない項目は、カラムとして読み取らずにスキップします。対象は、名前のない `CHECK (...)`、PostgreSQL の `LIKE` と `EXCLUDE`、`INDEX` や `KEY` を付けずに書いた MySQL の `FULLTEXT` と `SPATIAL`、T-SQL の `PERIOD FOR`、Oracle の `SUPPLEMENTAL LOG DATA` です。  
これらと同じ名前のカラムでも、`exclude BOOLEAN` のように名前の後に組み込みの型が続く場合や、`"check" int` のように名前を引用符で囲んだ場合は読み込まれます。`like citext` のように、引用符で囲まない `like` の後に組み込みではない型が続く場合は、PostgreSQL の `LIKE` として読み取られ、スキップされます。  
`CHECK` 制約自体は、エディタに保持する場所がないため読み込みません。

#### データ型 {#data-types}

カラムのデータ型は、どの[対応しているデータベース](./table-related-functions.md#databases)の組み込み型でもない場合も、引数リストを含めてそのまま保持されます。  
これには、`CREATE TYPE` で作成した列挙型や複合型、`CREATE DOMAIN` で作成したドメイン、`hstore`、`citext`、`ltree` のような拡張機能の型、`public.mood` のようなスキーマ修飾された名前、`"MyType"` や `[dbo].[Phone]` のように引用符や角括弧で囲んだ名前が含まれ、引用符や角括弧もそのまま残ります。`CREATE TYPE`、`CREATE DOMAIN`、`CREATE EXTENSION` の各文自体はスキップします。  
組み込みの型は引用符や角括弧が外れるため、`[int]` は `int` として、`[nvarchar](50)` は `nvarchar(50)` として読み込まれます。PostgreSQL の `"char"` と `"bit"` は、`char` や `bit` とは別の型であるため、引用符が残ります。  
配列の接尾辞は、`integer[]`、`text[3][3]`、`integer ARRAY`、`mood[]` のように、どの型でも残ります。SQLite の `UNSIGNED BIG INT` は全体がそのまま読み込まれます。  
型とその引数の直後に書いた MySQL と MariaDB の `UNSIGNED` と `ZEROFILL` は、書いたとおり型の一部として残ります。`INT UNSIGNED`、`SMALLINT(5) UNSIGNED ZEROFILL`、mysqldump の `int unsigned` などです。既定の `SIGNED` は取り除かれるため、`TINYINT SIGNED` は `TINYINT` として読み込まれます。MySQL が受け付けない `INT NOT NULL UNSIGNED` のように、ほかのカラムオプションの後に書いた修飾子は取り除かれます。  
`ENUM(...)` と `SET(...)` の値は引用符が残り、`ENUM('a','it''s')` のように、値の中の引用符は 2 つ重ねた形になります。MySQL のバックスラッシュでエスケープした `'it\'s'` も、同じように重ねた形で読み込まれます。Databricks の `STRUCT<...>` 型では、引用符で囲んだフィールド名とフィールドの `COMMENT` の引用符が残ります。  
型のない SQLite のカラムや `AS` で値を計算するカラムのように、型を書かずに定義したカラムは型のないまま残ります。`NOT`、`NULL`、`DEFAULT`、`PRIMARY`、`REFERENCES` のようなキーワードや、一重引用符で囲んだ文字列は、型として読み取りません。

#### 既定値

カラムの `DEFAULT` は、`now()`、`0.5`、`CURRENT_TIMESTAMP`、`ARRAY[]::text[]` のように、次のカラムオプション、カンマ、閉じ括弧までの式全体を保持します。`CASE ... END` は全体を読み取ります。  
式全体を囲む括弧は外れるため、SQL Server の `((0))` は `0` として、`(getdate())` は `getdate()` として読み込まれます。リテラルのキャストも外れるため、pg_dump の `'draft'::character varying` は `'draft'` として、`NULL::character varying` は `NULL` として読み込まれます。`ARRAY[]::text[]` や `lower('A'::text)` のように、それ以外のキャストは残ります。  
MySQL の `ON UPDATE CURRENT_TIMESTAMP` は、カラムに保持する場所がないため取り除かれ、その前にある既定値は残ります。Oracle の `DEFAULT ON NULL 0` は、`FOR INSERT ONLY` や `FOR INSERT AND UPDATE` の有無にかかわらず `0` として読み込まれます。  
`N'x'`、`E'x'`、`B'0'`、`X'ff'`、`U&'x'`、`_utf8mb4'x'` のようなプレフィックス付きの文字列は、中に括弧を含んでいても 1 つの文字列として読み取ります。

SQL Server Management Studio は、既定値をテーブルの後に `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]` としてスクリプトに出力します。このような文はそのカラムの既定値（ここでは `1`）を設定し、制約名は取り除かれます。

Schema SQL の書き出しでは、既定値の式を括弧の中でしか読み取らないデータベースに対して、括弧を付け直します。[既定値](./schema-sql.md#既定値)を参照してください。

#### Auto Increment

`AUTO_INCREMENT`、`AUTOINCREMENT`、`IDENTITY` は、カラムの `Auto Increment` をオンにします。`GENERATED ALWAYS AS IDENTITY` と `GENERATED BY DEFAULT AS IDENTITY` も同じで、どちらも既定値を残しません。  
serial カラムが持つ既定値である、PostgreSQL の `nextval()` の呼び出し 1 つだけの既定値も同じです。`nextval('s')`、または pg_dump の書き方では `nextval('s'::regclass)` と書かれます。シーケンス名は保持しません。`nextval('s') + 1` や SQL Server の `NEXT VALUE FOR s` のように、シーケンスを使っているだけの既定値は、通常の既定値のまま残ります。  
pg_dump はどちらもテーブルの後に、`ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` と `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY` として書き出します。どちらの文も、そのカラムの `Auto Increment` をオンにし、既定値を消去します。`CREATE SEQUENCE`、`ALTER SEQUENCE`、そのほかのすべての `ALTER COLUMN` のアクションはスキップします。  
インラインで `serial`、`bigserial`、`smallserial` の型を指定したカラムは、その型を保持し、`Auto Increment` はオフになります。

エディタが保持するのは `Auto Increment` フラグだけで、書き出しでは各データベースがそれぞれの形式で書き出します。[Auto Increment](./schema-sql.md#auto-increment) を参照してください。PostgreSQL の書き出しでは、どの形式で読み込んだ場合でも、`smallint`、`integer`、`bigint` のカラムには `GENERATED ALWAYS AS IDENTITY` を書き出し、`INT UNSIGNED` のようなそれ以外の型では、テーブルの後にコメント行を書き出すだけです。`START WITH 100` のようなシーケンスのオプションは失われます。  
serial や identity のカラムを複数持つテーブルは、Auto Increment のカラムを複数持つテーブルとして読み込まれます。MySQL、MariaDB、SQL Server では、その書き出しを実行するとこのようなテーブルは拒否されます。

#### 主キー

テーブルの後に追加した主キー `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)` は、そのカラムを主キーに設定します。  
カラムリストの前にある SQL Server の `CLUSTERED` や `NONCLUSTERED`、MySQL の `USING BTREE` は読み飛ばすため、SQL Server Management Studio がスクリプトに出力する `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` は `Id` を主キーにします。メモリ最適化テーブルの `PRIMARY KEY NONCLUSTERED HASH (...)` は、`ALTER TABLE` でも `CREATE TABLE` でも読み取りません。

#### ユニークキーとインデックス {#unique-keys-and-indexes}

2 つ以上のカラムにまたがる `UNIQUE` は、どの記法でも 1 つのユニークインデックスになります。対象の記法は、`UNIQUE (a, b)`、`UNIQUE KEY n (a, b)`、`UNIQUE INDEX n (a, b)`、`CONSTRAINT n UNIQUE (a, b)`、SQL Server のインラインの `INDEX n UNIQUE (a, b)`、`ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)` です。  
インデックスの名前には、キーのインデックス名を、それがなければ `CONSTRAINT` 名を使い、どちらもなければ名前なしになります。各カラムの並び順も保持されます。このようなインデックスは[代替キー](./table-related-functions.md#alternate-keys)です。  
1 つのカラムだけの `UNIQUE` は、これらのどの記法でも、インデックスを追加せずにそのカラムを Unique に設定します。そのため、書き出しが出力する `UQ_<テーブル名>_<カラム名>` 制約は、その出力の元になった Unique フラグとして読み込まれます。1 つのカラムに対する `CREATE UNIQUE INDEX` はユニークインデックスのままです。

phpMyAdmin が書き出す `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` のように、複数のキーを一度に追加する `ALTER TABLE` では、その中のユニークキーがすべて保持されます。`uq_a` は `uq_a` という名前のユニークインデックスとして、`uq_c` は `c` の Unique フラグとして読み込まれます。`CONSTRAINT` 名が名前を付けるのは、それと同じ句にあるキーだけです。MariaDB の `ADD UNIQUE INDEX IF NOT EXISTS n (...)` や、SQL Server の `ALTER TABLE t WITH CHECK ADD ...` と `WITH NOCHECK ADD ...` も読み取ります。  
`CREATE INDEX` と `CREATE UNIQUE INDEX` は、`public.t` や `[dbo].[t]` のような修飾された名前、SQL Server の `CLUSTERED` と `NONCLUSTERED`、PostgreSQL の `CONCURRENTLY`、`IF NOT EXISTS`、`ON ONLY`、`USING btree` を含む場合も、インデックス名がまったくない場合も読み取ります。SQL Server の `ON [PRIMARY]` ファイルグループは無視します。  
`NULLS NOT DISTINCT` や `USING BTREE` のようなキーのオプションを、キーの名前と取り違えることはありません。キーのカラムリストでは最初の単語だけがカラム名になるため、`b DESC NULLS LAST`、`b text_pattern_ops`、`b COLLATE "C"` はいずれも `b` をキーにし、`DESC` はその並び順として保持されます。`email(191)` のようなプレフィックス長は読み飛ばしますが、`lower(email)` のような式を含むキーは全体をスキップします。

`CREATE UNIQUE INDEX ... WHERE ...` や SQL Server のインラインの `INDEX n UNIQUE (...) WHERE ...` のような部分ユニークインデックスは、同じ名前とカラムを持つ通常のインデックスとして読み込まれます。テーブル全体で一意なキーは、ファイルが宣言している絞り込み付きのキーよりも厳しくなるためです。例外は、キーのカラムに対する `IS NOT NULL` の条件を `AND` でつないだだけの絞り込みです。これは SQL Server でユニークなカラムに複数の NULL を持たせるために必要な絞り込みで、そのキーはユニークのまま残ります。  
`ALTER TABLE ... ADD COLUMN` で追加したカラムのように、テーブルにないカラムを指すユニークキーは、存在するカラムだけに減らさずに全体を破棄します。通常のインデックスは、存在するカラムを残します。

Oracle の SQL Developer と `DBMS_METADATA` は、キー自身のインデックスを別の `CREATE UNIQUE INDEX` として書き出します。その名前はキーの名前か、`USING INDEX` が続く名前のないキーの場合は `SYS_C0012345` のようなシステム名です。読み込みでは、このようなインデックスと、`ADD CONSTRAINT ... USING INDEX` が指定するインデックスを、そのキーの一部として読み取ります。複合ユニークキーは 1 つのユニークインデックスとして、主キーや 1 カラムのユニークキーは余分なインデックスなしでカラムのフラグとして読み込まれます。その後 Oracle 向けに書き出すと、インデックスは 1 回だけ作成されます。

MySQL、MariaDB、MSSQL、Oracle、PostgreSQL、SQLite では、書き出した Schema SQL を読み込むと、同じ Unique フラグとインデックスに戻ります。  
Snowflake にはセカンダリインデックスがないため、書き出したものを読み込んで戻るのはユニークキーだけです。複合ユニークキーはユニークインデックスとして、1 カラムのユニークキーはそのカラムの Unique フラグとして戻ります。Databricks の書き出しは一意性を宣言しないため、何も戻りません。

#### 外部キー

外部キーは、次の記法でリレーションシップになります。

- テーブルレベルの `FOREIGN KEY (...) REFERENCES t (...)`。`CONSTRAINT name` の有無は問いません。
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`。SQL Server Management Studio がスクリプトに出力する `ALTER TABLE t WITH CHECK ADD ...` と `WITH NOCHECK ADD ...` も含みます。
- `user_id INT REFERENCES users (id)` のようなカラムのインラインの `REFERENCES t (col)` と、SQL Server と Snowflake がそこで認めている `FOREIGN KEY REFERENCES t (col)`。複数のカラムを参照するインラインの参照はスキップします。

1 つの `ALTER TABLE` から作られるリレーションシップは最大 1 つで、それも最初の句が外部キーを追加する場合に限ります。同じ文の中で `ADD PRIMARY KEY` や `ADD UNIQUE` の句の後にある `FOREIGN KEY` 句は読み取りません。phpMyAdmin が書き出す `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` のように 1 つの文で複数の外部キーを追加する場合は、最後の 1 つだけを読み取ります。

カラムリストのない `REFERENCES t` は、`t` の主キーが 1 つのカラムの場合にその主キーを指します。複合主キーに対しては、その外部キーをスキップします。  
参照先のカラムが 1 つも見つからない場合や、一方のテーブルにだけカラムがない場合のように 2 つのテーブルで見つかったカラムの数が異なる場合は、その外部キーをスキップし、どのカラムも外部キーとして設定しません。見つからないカラムの数が両方のテーブルで同じ場合は、見つかったカラムを書かれた順に組み合わせ、リレーションシップにはそれらのカラムだけが含まれます。  
読み込んだリレーションシップはすべて `Zero N` で、子側のカラムがすべて主キーでもある場合は識別リレーションシップになります。

各外部キーの `ON DELETE` 句と `ON UPDATE` 句は、リレーションシップの `On Delete` と `On Update` になります。値は `NO ACTION`、`RESTRICT`、`CASCADE`、`SET NULL`、`SET DEFAULT` のいずれかで、大文字・小文字も 2 つの句の順序も問いません。これらの句のない外部キーは `Not set` として読み込まれます。エディタでの設定方法は、[リレーションシップの編集](./relationship-editing.md#on-delete-and-on-update)を参照してください。  
`ON DELETE SET NULL (a_id)` のような、PostgreSQL で `SET NULL` や `SET DEFAULT` の後に書くカラムリストは読み飛ばします。アクションはキー全体に適用され、リストの後にある `ON UPDATE` も読み取ります。`MATCH FULL`、`MATCH PARTIAL`、`MATCH SIMPLE` はスキップし、MySQL の `ON UPDATE CURRENT_TIMESTAMP` カラム属性をアクションと取り違えることはありません。  
書き出した Schema SQL を読み込むと、そのデータベースが書き出すアクションで戻るため、MySQL の `SET DEFAULT`、Oracle のすべての `ON UPDATE`、Snowflake の `NO ACTION` 以外のすべてのアクションのように省かれるアクションは `Not set` に戻ります。

#### コメント {#comments}

テーブルとカラムのコメントは、パーサーが読み取る 3 つの構文から読み込みます。MySQL、MariaDB、Snowflake、Databricks が使う `COMMENT` テーブルオプションおよびカラム属性、PostgreSQL、Oracle が使う `COMMENT ON TABLE` および `COMMENT ON COLUMN` 文、SQL Server が `EXEC sp_addextendedproperty` で設定する `MS_Description` 拡張プロパティです。  
ファイルに定義されていないテーブルやカラムを指すコメントは無視されます。

SQL Server の呼び出しは、SQL Server Management Studio がすべてのコメントをスクリプトに出力するときの名前付き引数（`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`）でも、エディタの MSSQL の書き出しが書く位置指定の引数でも読み取ります。  
コメントになるのは、テーブル、またはレベル 2 にあるそのカラムの `MS_Description` だけです。ほかのプロパティ、ビュー、インデックス、制約に対するものはコメントにならず、変数で渡したコメントや `+` で組み立てたコメントも同様です。

コメントの中では、`DEFAULT` の値や引用符で囲んだ名前など、引用符で囲んだほかのテキストと同じように、2 つ重ねた引用符が 1 つの引用符を表します。これは mysqldump や pg_dump の書き方で、`'it''s'` は `it's` として読み取ります。  
MySQL や MariaDB が `'it\'s'` と書くように、引用符の前のバックスラッシュも引用符をエスケープします。ただし、そのような引用符でも、後に空白、`,`、`;`、`)`、`]`、`:`、`|`、`+`、またはファイルの終わりが続く場合はテキストの終わりになるため、`'C:\'`、pg_dump の `'C:\'::text`、T-SQL の `'C:\'+name` ではバックスラッシュが残ります。  
`DEFAULT` の値は引用符が残り、値の中の引用符は、ファイルでどのようにエスケープされていても `'it''s'` のように 2 つ重ねた形で書き戻されます。  
読み込む時点でドキュメントのデータベースが Databricks の場合は、一重引用符で囲んだテキストは代わりに Spark の規則に従います。すべてのバックスラッシュが直後の文字をエスケープするため、`'C:\\dir'` は `C:\dir` として読み取られ、`\n`、`\t`、`\u0041` のようなエスケープはデコードされ、`DEFAULT` の値は `'it\'s'` として保持されます。

書き出す Schema SQL では、テーブルやカラムのコメントの中の引用符をエスケープします。MySQL、MariaDB、Snowflake では `COMMENT 'it''s'`、PostgreSQL と Oracle では `COMMENT ON TABLE` と `COMMENT ON COLUMN ... IS 'it''s'` となり、MSSQL の `sp_addextendedproperty` の呼び出しでも、テーブル名とカラム名を含めて同じように 2 つ重ねます。引用符を含まないコメントはそのまま書き出します。  
Databricks は代わりに、`COMMENT 'it\'s'` のように引用符とバックスラッシュをバックスラッシュでエスケープするため、その書き出しを正確に読み戻せるのは、Databricks を選択している間だけです。  
MSSQL は各コメントを `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'` として書き出し、カラムの場合はその後に `'column', '<column>'` が続きます。`Bracket` が `None` の場合、`sales.users` という名前のテーブルはスキーマ `sales`、テーブル `users` になり、スキーマのない名前は `dbo` に入ります。それ以外の `Bracket` では、名前全体がテーブル名になり、`dbo` に入ります。

SQLite では、書き出してから読み込むとコメントが失われます。SQLite はコメントを単純な `--` 行として書き出しますが、パーサーはこれを読み取りません。MSSQL の書き出しの `sp_addextendedproperty` の呼び出しは、同じテーブルとカラムのコメントとして読み込まれます。

### GraphQL

GraphQL SDL ドキュメントを読み込めます。  
オブジェクト型の定義はテーブルになり、`extend type` ブロックは拡張元の型に統合され、インターフェースのフィールドはそれを実装する型に継承されます。  
型が別のテーブルであるフィールドはカラムではなくリレーションシップになり、両側がリストの場合はマッピングテーブルが作成されます。  
`buyer: User` のような単数のフィールドは、まず相手の型にあるフィールドのうち、名前が `By` とそのフィールド名で終わる 1 つのフィールド（`orderListByBuyer` など）と、大文字・小文字とアンダースコアを無視して組み合わされます。`buyer2` のように番号の付いたフィールドは、番号を除いて同じように組み合わされます。これは、2 つのテーブルの間に複数のリレーションシップがある場合や、テーブルが自分自身を参照する場合に、Code Generator の GraphQL 出力がフィールドに付ける名前の形です。そのため、そのような出力はすべてのリレーションシップを保ったまま読み込まれます。  
ルート型（`Query`、`Mutation`、`Subscription`）、イントロスペクション型、`PageInfo`、`*Connection`、`*Edge`、`*_aggregate` のような Relay、フェデレーション、Hasura のラッパーは、ノイズとして扱いスキップします。  
`@id`、`@primaryKey`、`@unique`、`@autoincrement`、`@default`、`@map`、`@relation`、`@column`、`@table`、`@index`、`@db.*` の各ディレクティブに対応しています。  
ファイル名は `.graphql`、`.gql`、`.graphqls` のいずれかで終わる必要があります。Prisma の `schema.prisma` ファイルは GraphQL ドキュメントではないため、ここでは読み込めません。

### DBML

dbdiagram.io や dbdocs で使われている形式の DBML ファイルを読み込めます。  
`Table`、`TablePartial`、`Ref`、`Enum`、`TableGroup` の各ブロックを読み込みます。`Project` と単独の `Note` ブロックは、周囲のテーブルに影響を与えずにスキップします。  
ref の記法はすべて読み込めます。コロンを使う `Ref:` 形式、名前付きの ref、`Ref { }` のブロック形式、カラム設定にインラインで書く `[ref: > table.column]` に対応しています。  
`<>` の多対多 ref では、両側の名前を組み合わせたマッピングテーブルが作成されます。  
独立した ref の `delete` と `update` の設定は、`Ref: users.id < posts.user_id [delete: cascade, update: set null]` のように、リレーションシップの `On Delete` と `On Update` になります。値は `cascade`、`restrict`、`set null`、`set default`、`no action` で、大文字・小文字は問いません。それ以外の値や設定がない場合は `Not set` として読み込まれ、`color` のようなほかの設定は無視します。  
インラインの `[ref: ...]` 設定はアクションを持たず、`<>` の ref の設定はマッピングテーブルに引き継がれません。同じ外部キーがインラインと独立した ref の両方で宣言されている場合は、インラインのほうがアクションなしで残ります。  
`Table users [headercolor: #3498DB]` のようなテーブルの `headercolor` 設定は、値が引用符なしで書いた `#rgb` または `#rrggbb` の 16 進数の場合に、そのテーブルの色になります。それ以外の値は破棄し、`TablePartial` の `headercolor` は、それを使うテーブルには引き継がれません。  
各 `TableGroup` は、1 行に 1 つずつ、`Ref` と同じ書き方で名前を挙げたテーブルを含む[テーブルグループ](./table-groups.md)になります。その `[color: ...]` は `headercolor` と同じ規則でグループの色になり、note やその他の設定は破棄します。2 つのグループに挙げられたテーブルは、最初のグループに入ります。ファイルで宣言されたテーブルを 1 つも挙げていない場合も、先のグループが取ったテーブルしか挙げていない場合も、テーブルが残らないグループは作成されません。グループの枠は、テーブルがどこに配置されてもそのテーブルに合わせて調整され、テーブルを複数の行に並べる場合も、グループのテーブルはまとまったまま配置されます。  
ファイル名は `.dbml` で終わる必要があります。

### AML

AML（Azimutt Markup Language）ファイルを読み込めます。現在の記法と、以前の v1 の記法の両方に対応しています。  
エンティティはテーブルになり、ネストした属性は `settings.slug` のようにドットでつないだカラム名に平坦化されます。  
属性は `nullable` が指定されていない限り `NOT NULL` になり、`check`、`type`、`tags` のようにエディタに対応する項目がない構文は、エラーにせず破棄します。ビューとして指定したエンティティは、通常のテーブルとして読み込まれます。  
`users {color: red}` のようなエンティティの `color` は、そのテーブルの色になります。AML の色名 `red`、`orange`、`amber`、`yellow`、`lime`、`green`、`emerald`、`teal`、`cyan`、`sky`、`blue`、`indigo`、`violet`、`purple`、`fuchsia`、`pink`、`rose`、`gray` は、大文字・小文字も引用符の有無も問わずに読み取り、それぞれ同じ名前の Tailwind の色の 500 の濃さとして読み込みます。例えば `red` は `#ef4444` になります。`"#3498db"` のように引用符で囲んだ 16 進数は書いたとおりに保持しますが、引用符のない `#3498db` は、`#` が AML のコメントの始まりになるため読み取れません。それ以外の値と、属性やリレーションに付けた `color` は破棄します。  
独立した `rel` 文（以前の記法では `fk`）は、`rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}` のように、`onDelete` と `onUpdate` のプロパティをリレーションシップの `On Delete` と `On Update` として保持します。値は `cascade`、`restrict`、`set null`、`set default`、`no action` で、引用符の有無も大文字・小文字も問いません。それ以外のプロパティは破棄します。  
`user_id int -> users(id) {onDelete: cascade}` のようなインラインのリレーションでは、プロパティは属性に属するため破棄され、リレーションシップは `Not set` として読み込まれます。  
ファイル名は `.aml` で終わる必要があります。

GraphQL、DBML、AML は往復できる形式です。いずれも[コード生成](./code-generator.md)の出力対象でもあります。  
DBML と AML は、各リレーションシップの ON DELETE と ON UPDATE を読み込みと書き出しの両方向で保持します。[コード生成](./code-generator.md#on-delete-and-on-update)を参照してください。GraphQL はどちらも保持しないため、GraphQL を読み込むと両方とも `Not set` になります。  
DBML はさらに、透明度を除いたテーブルの色と、テーブルを含む各テーブルグループも、読み込みと書き出しの両方向で保持します。名前のないグループは `group_1`、`group_2` のように戻り、重複したグループ名には `_2`、`_3` などが付いて戻ります。AML はテーブルの色を最も近い色名としてのみ保持するため、`#FF8800` は `orange` として書き出され、`#f97316` として戻ります。また、グループは保持しません。GraphQL は色もグループも保持しません。

## 書き出し {#exporting}

キャンバスのコンテキストメニューの `Export` サブメニューには、次の 3 つの項目があります。

- json: ダイアグラムをファイルが保持するとおりに `.erd.json` として保存します。カラムとインデックスを含むテーブル、リレーションシップ、メモ、テーブルグループ、そして設定が含まれ、[ロックした設定](./settings.md#ロック)はロックした値で保存されます。
- Schema SQL: オプションパネルを開き、`Save file` ボタンにフォーカスした状態で [Schema SQL](./schema-sql.md#sql-の保存とコピー) タブを開きます。`Enter` を押すと、タブに表示されている SQL が `.sql` として保存されます。それまでは何も保存されません。
- Image: `Export image` ダイアログを開きます。このダイアログは、ダイアグラムを `.png` または `.svg` として保存するか、PNG としてクリップボードにコピーします。[画像](#画像)を参照してください。

3 つとも、読み取り専用のエディタでも使えます。

Schema SQL は、各リレーションシップの ON DELETE と ON UPDATE を `REFERENCES` の後に、ON DELETE を先にして書き出します。`Not set` は何も書き出さず、選択しているデータベースが受け付けないアクションは省きます。どのデータベースがどのアクションを受け付けるかは、[リレーションシップの編集](./relationship-editing.md#on-delete-and-on-update)を参照してください。

書き出したファイルの名前は、いずれも `<データベース名>-<時刻>` に拡張子を付けたものになり、時刻はローカル時刻で `yyyy-MM-dd'T'HH_mm_ss` の形式です。例えば `my-schema-2026-08-29T04_05_06.erd.json` のようになります。データベース名が空の場合は `unnamed` になります。  
Schema SQL タブと[コード生成](./code-generator.md)の `Save file` も、同じ方法でファイルに名前を付けます。画像には、ダイアログを開いた時点のデータベース名が使われます。

`Import`、`Import and Add`、`Export` は、ERD タブの[クイック検索](./quick-search.md)からも、キャンバスのコンテキストメニューと同じ項目で利用できます。

Obsidian では、ダウンロードや保存のダイアログは表示されません。ファイルは保管庫の中の、Obsidian がそのダイアグラムの新しい添付ファイルを置く場所に書き込まれ、そのパスが通知に表示されます。  
Obsidian でファイル名に使えない文字 `\ / : * ? " < > |` は `-` に置き換えられます。  
Obsidian のファイルエクスプローラーに、書き出した `.erd.json` や `.sql` ファイルが表示されるのは、Settings → Files and links → Detect all file extensions がオンの間だけです。

### 画像

キャンバスのコンテキストメニューまたはクイック検索の `Export` ▸ `Image` は、`Export image` ダイアログを開きます。ダイアログには、画像のプレビューとその横にオプションが表示されます。開いている[エクスプローラー](./explorer.md#dialogs-beside-it)は、暗くなった部分の下で開いたままです。

![Export > Image を開き、ダークモードと背景をオフにして 3x を選び、画像をクリップボードにコピーする](/img/demo-export.webp)

- `Background`: 既定でオンです。オフにするとキャンバスが透明になります。
- `Dark mode`: 最初はエディタの外観に合わせた状態になります。画面の外観と一致している間は、[テーマビルダー](./language-and-theme.md)での変更を含め、画像はキャンバスそのものの色になります。もう一方の外観では、同じグレーカラーとアクセントカラーのプリセットを使います。
- `Scale`: `1x`、`2x`、`3x` のいずれかで、既定では `2x` が選ばれています。設定するのは PNG とクリップボードへのコピーのサイズだけで、その下の行に `PNG <width> × <height> px` の形でそのサイズが表示されます。

選んだ内容はエディタを閉じるまで保持され、ドキュメントに保存されることはありません。プレビューは画像と同じ方法で描画され、`Background` や `Dark mode` を変えると描画し直されます。

画像には、ダイアログを開いた時点のダイアグラムが収まります。その後の変更を反映するには、ダイアログを閉じて開き直します。画像には、表示位置がどれだけ離れていてもダイアグラム全体が収まり、ダイアグラムが描く範囲に余白を加えて切り取られます。エディタが表示している倍率にかかわらず常に 100% で描画されるため、すべてのテーブルが省略されずに描画されます。[View Option](./table-related-functions.md#table-view-options) で非表示にしたもの（リレーションシップ、その ON DELETE と ON UPDATE のラベル、テーブルグループ、メモ）は描画されず、そのための領域も確保されません。テーブルグループはほかのすべてのものの背後に描画されます。

画像を書き出すボタンは 3 つあり、どれを押してもダイアログは開いたままです。

- `PNG`: 100% のダイアグラムのサイズに `Scale` を掛けたサイズの `.png` を保存します。ブラウザのキャンバスで扱えないほど大きな PNG は、失敗する代わりに解像度を落として書き出されます。ダイアログは事前に `Reduced from <width> × <height> px, past what a browser canvas can hold` と警告し、書き出した後には `Exported at a reduced resolution` という通知でその旨を伝えます。
- `SVG`: `Scale` にかかわらず、100% のダイアグラムのサイズの `.svg` を保存し、解像度が落とされることはありません。テキストはテキストのまま残り、フォントは埋め込まずに名前で指定されるため、エディタのフォントがないビューアーでは別のフォントで描画されます。影は含まれません。
- `Copy to clipboard`: 選んだ `Scale` の PNG をクリップボードに置きます。ブラウザのキャンバスで扱えない場合は、保存する PNG と同じように解像度が落とされます。完了すると `Copied the image to the clipboard` と表示され、解像度を落とした場合は `Copied at a reduced resolution` と表示されます。ブラウザやホストがクリップボードを拒否した場合や、画像を描画できなかった場合のようにコピーに失敗すると、`Couldn't copy the image` と表示され、代わりに PNG を保存するよう案内します。

ホストがバックグラウンドのワーカーを動かしている場合、画像はそのワーカーで描画されるため、その間もエディタは操作できます。一瞬で終わらない場合は `Exporting PNG`、`Exporting SVG`、`Copying image` のいずれかの通知が表示され、失敗した場合は `Couldn't export the PNG` または `Couldn't export the SVG` と通知されます。ファイルの描画中にダイアログを閉じても、そのファイルの保存は止まりません。

ダイアログを開くと `PNG` にフォーカスがあり、`Tab` によるフォーカスの移動はダイアログの中にとどまります。`Escape`、`x` ボタン、またはダイアログの周りの暗くなった部分のクリックで閉じます。  
開いている間は、Undo と Redo を含むキャンバスのショートカットや、コピーと貼り付けは何もしません。`Ctrl + K` (Windows/Linux) または `⌘ + K` (Mac) を押すとダイアログが閉じてクイック検索が開きます。`Ctrl + F` (Windows/Linux) または `⌘ + F` (Mac) を押すとダイアログが閉じ、[エクスプローラー](./explorer.md#opening-and-closing)の検索フィールドにキャレットが移ります。エクスプローラーが閉じている場合は開き、閉じることはありません。エクスプローラーを表示するには幅が足りないエディタでもダイアログは閉じますが、キャレットを移す代わりにトーストが表示されます。
