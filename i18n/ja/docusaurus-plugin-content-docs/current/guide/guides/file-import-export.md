---
sidebar_position: 2
description: JSON・スキーマ SQL・GraphQL・DBML・AML の読み込みと、JSON・スキーマ SQL・PNG の書き出し。
---

# ファイルの読み込みと書き出し

## 外部ファイルの読み込み

コンテキストメニューの `Import` サブメニューから、次の 5 つの形式を読み込めます。

- json
- Schema SQL
- GraphQL
- DBML
- AML

選んだ形式と拡張子が一致しないファイルを選ぶと、読み込みは中止され、通知が表示されます。

読み込みは、現在のドキュメントに統合するのではなく置き換えます。  
JSON ファイルは自身の設定も一緒に読み込みます。それ以外の形式は、表示位置と拡大・縮小のレベルを除いて現在の設定を維持し、読み込み後にテーブルを自動配置します。  
GraphQL、DBML、AML のパーサーは失敗しません。読み取れないファイルは、エラーではなく空のダイアグラムになります。

### JSON

[エディタで定義したスキーマ形式](../../api/advanced/schema.md)のファイルを読み込めます。
ファイル名は `.json` で終わる必要があるため、`<データベース名>-<時刻>.erd.json` として書き出したファイルはそのまま読み込めます。`.erd` や `.vuerd` ファイルはここでは読み込めません。

![Import > json で保存済みのファイルを読み込み、下書きのドキュメントを設定ごと置き換える](/img/demo-import-json.webp)

### Schema SQL

SQL で定義したスキーマファイルも読み込めます。  
データベースベンダーに関係なく、できるだけ柔軟にパースするよう実装していますが、対応していない構文がある場合もあります。  
ファイル名は `.sql` で終わる必要があります。  
[対応している構文はこちらで確認できます。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Import > Schema SQL で SQL ファイルを読み込み、自動配置されたテーブルを縮小して見渡す](/img/demo-import-sql.webp)

カラムは `CREATE TABLE` からのみ読み込みます。`ALTER TABLE ... ADD COLUMN` で追加したカラムは読み取りません。  
`CREATE TABLE` の中のカラムではない項目は、カラムとして読み取らずにスキップします。対象は、名前のない `CHECK (...)`、PostgreSQL の `LIKE` と `EXCLUDE`、`INDEX` や `KEY` を付けずに書いた MySQL の `FULLTEXT` と `SPATIAL`、T-SQL の `PERIOD FOR`、Oracle の `SUPPLEMENTAL LOG DATA` です。  
これらと同じ名前のカラムでも、`exclude BOOLEAN` のように名前の後に組み込みの型が続く場合や、`"check" int` のように名前を引用符で囲んだ場合は読み込まれます。`like citext` のように、引用符で囲まない `like` の後に組み込みではない型が続く場合は、PostgreSQL の `LIKE` として読み取られ、スキップされます。  
`CHECK` 制約自体は、エディタに保持する場所がないため読み込みません。

#### データ型 {#data-types}

カラムのデータ型は、どの[対応しているデータベース](./table-related-functions.md#databases)の組み込み型でもない場合も、引数リストを含めてそのまま保持されます。  
これには、`CREATE TYPE` で作成した列挙型や複合型、`CREATE DOMAIN` で作成したドメイン、`hstore`、`citext`、`ltree` のような拡張機能の型、`public.mood` のようなスキーマ修飾された名前、`"MyType"` や `[dbo].[Phone]` のように引用符や角括弧で囲んだ名前が含まれ、引用符や角括弧もそのまま残ります。`CREATE TYPE`、`CREATE DOMAIN`、`CREATE EXTENSION` の各文自体はスキップします。  
組み込みの型は引用符や角括弧が外れるため、`[int]` は `int` として、`[nvarchar](50)` は `nvarchar(50)` として読み込まれます。PostgreSQL の `"char"` と `"bit"` は、`char` や `bit` とは別の型であるため、引用符が残ります。  
配列の接尾辞は、`integer[]`、`text[3][3]`、`integer ARRAY`、`mood[]` のように、どの型でも残ります。SQLite の `UNSIGNED BIG INT` は全体がそのまま読み込まれます。  
`ENUM(...)` と `SET(...)` の値は引用符が残り、`ENUM('a','it''s')` のように、値の中の引用符は 2 つ重ねた形になります。MySQL のバックスラッシュでエスケープした `'it\'s'` も、同じように重ねた形で読み込まれます。Databricks の `STRUCT<...>` 型では、引用符で囲んだフィールド名とフィールドの `COMMENT` の引用符が残ります。  
型のない SQLite のカラムや `AS` で値を計算するカラムのように、型を書かずに定義したカラムは型のないまま残ります。`NOT`、`NULL`、`DEFAULT`、`PRIMARY`、`REFERENCES` のようなキーワードや、一重引用符で囲んだ文字列は、型として読み取りません。

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
書き出した Schema SQL を読み込むと、そのデータベースが書き出すアクションで戻るため、MySQL の `SET DEFAULT` や Oracle のすべての `ON UPDATE` のように省かれるアクションは `Not set` に戻ります。

#### コメント {#comments}

テーブルとカラムのコメントは、パーサーが読み取る 2 つの構文から読み込みます。MySQL、MariaDB、Snowflake、Databricks が使う `COMMENT` テーブルオプションおよびカラム属性と、PostgreSQL、Oracle が使う `COMMENT ON TABLE` および `COMMENT ON COLUMN` 文です。  
ファイルに定義されていないテーブルやカラムを指すコメントは無視されます。

コメントの中では、`DEFAULT` の値や引用符で囲んだ名前など、引用符で囲んだほかのテキストと同じように、2 つ重ねた引用符が 1 つの引用符を表します。これは mysqldump や pg_dump の書き方で、`'it''s'` は `it's` として読み取ります。  
MySQL や MariaDB が `'it\'s'` と書くように、引用符の前のバックスラッシュも引用符をエスケープします。ただし、そのような引用符でも、後に空白、`,`、`;`、`)`、`]`、`:`、`|`、`+`、またはファイルの終わりが続く場合はテキストの終わりになるため、`'C:\'`、pg_dump の `'C:\'::text`、T-SQL の `'C:\'+name` ではバックスラッシュが残ります。  
`DEFAULT` の値は引用符が残り、値の中の引用符は、ファイルでどのようにエスケープされていても `'it''s'` のように 2 つ重ねた形で書き戻されます。  
読み込む時点でドキュメントのデータベースが Databricks の場合は、一重引用符で囲んだテキストは代わりに Spark の規則に従います。すべてのバックスラッシュが直後の文字をエスケープするため、`'C:\\dir'` は `C:\dir` として読み取られ、`\n`、`\t`、`\u0041` のようなエスケープはデコードされ、`DEFAULT` の値は `'it\'s'` として保持されます。

書き出す Schema SQL では、テーブルやカラムのコメントの中の引用符をエスケープします。MySQL、MariaDB、Snowflake では `COMMENT 'it''s'`、PostgreSQL と Oracle では `COMMENT ON TABLE` と `COMMENT ON COLUMN ... IS 'it''s'` となり、MSSQL の `sp_addextendedproperty` の呼び出しでも、テーブル名とカラム名を含めて同じように 2 つ重ねます。引用符を含まないコメントはそのまま書き出します。  
Databricks は代わりに、`COMMENT 'it\'s'` のように引用符とバックスラッシュをバックスラッシュでエスケープするため、その書き出しを正確に読み戻せるのは、Databricks を選択している間だけです。

SQLite と MSSQL では、書き出してから読み込むとコメントが失われます。SQLite はコメントを単純な `--` 行として、MSSQL は `sp_addextendedproperty` の呼び出しとして書き出しますが、パーサーはどちらも読み取れません。

### GraphQL

GraphQL SDL ドキュメントを読み込めます。  
オブジェクト型の定義はテーブルになり、`extend type` ブロックは拡張元の型に統合され、インターフェースのフィールドはそれを実装する型に継承されます。  
型が別のテーブルであるフィールドはカラムではなくリレーションシップになり、両側がリストの場合はマッピングテーブルが作成されます。  
ルート型（`Query`、`Mutation`、`Subscription`）、イントロスペクション型、`PageInfo`、`*Connection`、`*Edge`、`*_aggregate` のような Relay、フェデレーション、Hasura のラッパーは、ノイズとして扱いスキップします。  
`@id`、`@primaryKey`、`@unique`、`@autoincrement`、`@default`、`@map`、`@relation`、`@column`、`@table`、`@index`、`@db.*` の各ディレクティブに対応しています。  
ファイル名は `.graphql`、`.gql`、`.graphqls` のいずれかで終わる必要があります。Prisma の `schema.prisma` ファイルは GraphQL ドキュメントではないため、ここでは読み込めません。

### DBML

dbdiagram.io や dbdocs で使われている形式の DBML ファイルを読み込めます。  
`Table`、`TablePartial`、`Ref`、`Enum` の各ブロックを読み込みます。`Project`、`TableGroup`、単独の `Note` ブロックは、周囲のテーブルに影響を与えずにスキップします。  
ref の記法はすべて読み込めます。コロンを使う `Ref:` 形式、名前付きの ref、`Ref { }` のブロック形式、カラム設定にインラインで書く `[ref: > table.column]` に対応しています。  
`<>` の多対多 ref では、両側の名前を組み合わせたマッピングテーブルが作成されます。  
独立した ref の `delete` と `update` の設定は、`Ref: users.id < posts.user_id [delete: cascade, update: set null]` のように、リレーションシップの `On Delete` と `On Update` になります。値は `cascade`、`restrict`、`set null`、`set default`、`no action` で、大文字・小文字は問いません。それ以外の値や設定がない場合は `Not set` として読み込まれ、`color` のようなほかの設定は無視します。  
インラインの `[ref: ...]` 設定はアクションを持たず、`<>` の ref の設定はマッピングテーブルに引き継がれません。同じ外部キーがインラインと独立した ref の両方で宣言されている場合は、インラインのほうがアクションなしで残ります。  
ファイル名は `.dbml` で終わる必要があります。

### AML

AML（Azimutt Markup Language）ファイルを読み込めます。現在の記法と、以前の v1 の記法の両方に対応しています。  
エンティティはテーブルになり、ネストした属性は `settings.slug` のようにドットでつないだカラム名に平坦化されます。  
属性は `nullable` が指定されていない限り `NOT NULL` になり、`check`、`view`、`type`、`color`、`tags` のようにエディタに対応する項目がない構文は、エラーにせず破棄します。  
独立した `rel` 文（以前の記法では `fk`）は、`rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}` のように、`onDelete` と `onUpdate` のプロパティをリレーションシップの `On Delete` と `On Update` として保持します。値は `cascade`、`restrict`、`set null`、`set default`、`no action` で、引用符の有無も大文字・小文字も問いません。それ以外のプロパティは破棄します。  
`user_id int -> users(id) {onDelete: cascade}` のようなインラインのリレーションでは、プロパティは属性に属するため破棄され、リレーションシップは `Not set` として読み込まれます。  
ファイル名は `.aml` で終わる必要があります。

GraphQL、DBML、AML は往復できる形式です。いずれも[コード生成](./code-generator.md)の出力対象でもあります。  
DBML と AML は、各リレーションシップの ON DELETE と ON UPDATE を読み込みと書き出しの両方向で保持します。[コード生成](./code-generator.md#on-delete-and-on-update)を参照してください。GraphQL はどちらも保持しないため、GraphQL を読み込むと両方とも `Not set` になります。

## 書き出し {#exporting}

書き出しは次の 3 つの形式に対応しています。

- json: エディタで定義したスキーマファイルです。`.erd.json` として保存されます。
- Schema SQL: データベースベンダーの構文に合わせて生成したスキーマファイルです。`.sql` として保存されます。
- png: ダイアグラムを画像として生成します。`.png` として保存されます。

Schema SQL は、各リレーションシップの ON DELETE と ON UPDATE を `REFERENCES` の後に、ON DELETE を先にして書き出します。`Not set` は何も書き出さず、選択しているデータベースが受け付けないアクションは省きます。どのデータベースがどのアクションを受け付けるかは、[リレーションシップの編集](./relationship-editing.md#on-delete-and-on-update)を参照してください。

PNG には、表示位置がどれだけ離れていてもダイアグラム全体が収まります。ダイアグラムが実際に描かれている範囲に余白を加えて切り取り、エディタが表示している倍率で描画します。より大きな画像が必要な場合は、書き出す前に拡大してください。  
描画はバックグラウンドのワーカーで行われるため、その間もエディタは操作でき、大きなダイアグラムのように書き出しが一瞬で終わらない場合は、実行中であることが通知に表示されます。ブラウザのキャンバスで扱えないほど大きなダイアグラムは、ファイルを作れないのではなく解像度を落として保存され、その旨が通知されます。

書き出したファイルの名前は、いずれも `<データベース名>-<時刻>` に各拡張子を付けたものになり、時刻は `yyyy-MM-dd'T'HH_mm_ss` の形式です。例えば `my-schema-2026-08-29T04_05_06.erd.json` のようになります。データベース名が空の場合は `unnamed` になります。

![Export サブメニューで png を選ぶ様子と、時間のかかる書き出しで表示される通知](/img/demo-export.webp)

読み込みと書き出しは[クイック検索](./quick-search.md)からも実行できます。読み込みは同じ 5 つの形式に対応していますが、書き出しは `json` と `Schema SQL` のみで、PNG はコンテキストメニューからのみ利用できます。

Obsidian では、ダウンロードや保存のダイアログは表示されません。ファイルは保管庫の中の、Obsidian がそのダイアグラムの新しい添付ファイルを置く場所に書き込まれ、そのパスが通知に表示されます。  
Obsidian でファイル名に使えない文字 `\ / : * ? " < > |` は `-` に置き換えられます。  
Obsidian のファイルエクスプローラーに、書き出した `.erd.json` や `.sql` ファイルが表示されるのは、Settings → Files and links → Detect all file extensions がオンの間だけです。
