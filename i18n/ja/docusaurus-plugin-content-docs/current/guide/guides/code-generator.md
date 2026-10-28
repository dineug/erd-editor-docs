---
sidebar_position: 13
description: 22 種類の対象へのコード生成、オプションパネルでの言語、データベース、名前のケース、括弧の種類の選択、リレーションシップの ON DELETE と ON UPDATE のアクションを出力する対象、結果の保存とコピー。
---

# コード生成

ツールバーの `Code Generator` タブに切り替えます。タブの左側にはドキュメント全体のコードが、その右側には `Code Generator` という見出しのオプションパネルが表示され、そこで言語、データベース、名前のケース、一部の対象では括弧の種類を選びます。  
タブを最初に開いたときにエディタの幅が 640 px 未満でなければ、パネルは自動的に開きます。パネル上部の `Hide options` で折りたたみ、コードの右上の `Show options` で再び表示します。開いているか折りたたんでいるかは、エディタを開いている間はタブを切り替えても保たれ、Schema SQL タブのパネルとは別に扱われ、ファイルに保存されることはありません。

コードを右クリックすると、コンテキストメニューが開きます。`Language`、`Database`、`Table Name Case`、`Column Name Case`、`Bracket`（`Doctrine`、`JPA`、`SeaORM` のみ）があり、それぞれ現在の値にチェックが付いたサブメニューを開きます。続いて、パネルを折りたたむか開き、パネルが表示されている間はチェックが付く `Options panel` と、`Save file` があります。  
このタブを開いている間は、[クイック検索](./quick-search.md)に `Database`、`Bracket`（`Doctrine`、`JPA`、`SeaORM` のみ）、`Language`、`Table Name Case`、`Column Name Case`、そしてパネルを折りたたむか開く `Code Generator: Options panel` が表示されます。

![コードのコンテキストメニューで TypeScript、続いて Rust を選び、オプションパネルでカラム名を Snake に切り替えて、コードをコピーする](/img/demo-code-generator.webp)

同じコード表示は[テーブルのプロパティ](./table-related-functions.md#table-properties)の `Code Generator` タブにもあり、そこではドキュメント全体ではなくそのテーブル 1 つ分のコードを生成します。そこにはオプションパネルがなく、コンテキストメニューは同じ設定を変更しますが、`Options panel` と `Save file` はありません。  
ドキュメント全体のコードがインポートやヘッダーで始まる場合、テーブル 1 つ分のコードは、`PHP` の `<?php`、`Swift` の `import Foundation`、`JSON Schema` の `$schema` のように、そのテーブルに必要なものから始まります。

コードはタブを開いたときに生成され、言語、データベース、名前のケース、括弧の種類のいずれかが変わるたびに書き直されます。タブを開いている間に共同編集者やコーディングエージェントなどがダイアグラムに加えた編集は、タブを離れて戻ったとき、またはこれらの設定のいずれかが変わったときに反映されます。

## オプションパネル

パネルには、`Saved in the document` の見出しの下に `Language`、`Database`、`Table Name Case`、`Column Name Case` が並び、言語が `Doctrine`、`JPA`、`SeaORM` のいずれかの間は、その後に `Bracket` が続きます。どれもドロップダウンリストで、変更するとすぐにコードが書き直されます。  
選択している言語が `Database` や名前のケースを使わない場合、それらは `Not used by DBML` のような注記を下に付けて淡い色でパネルに残り、それでも変更できます。  
パネルの下部には `Save file` と `Copy` があります。[結果の保存とコピー](#結果の保存とコピー)を参照してください。

これらはダイアグラム自身の設定で、コンテキストメニューとクイック検索が変更するのも同じ設定です。`Database` は、ほかの編集と同じようにファイルに保存されます。  
`Language`、`Table Name Case`、`Column Name Case`、`Bracket` は、設定タブでそれぞれのロック（`Bracket` の場合は `Bracket Type`）がオフの間だけ保存され、新しいダイアグラムではすべてのロックがオンになっています。ロックがオンの間は、変更すると画面のコードは書き直されますが、ファイルにはロックした値が残り、ダイアグラムはその値で開き直されます。パネルにはロックの状態は表示されません。選んだ値をファイルに残すには、そのロックをオフにします。[ロック](./settings.md#ロック)を参照してください。  
読み取り専用のエディタでは、そこでの変更はそのウィンドウにしか届かないため、代わりに `This window only` と表示されます。[読み取り専用のエディタ](#read-only-editors)を参照してください。

## 言語

対応している対象は 22 種類で、言語、ORM、スキーマの 3 つのグループに分け、それぞれのグループをアルファベット順に並べています。パネルのリストとコンテキストメニューでは、グループの間に区切り線が引かれますが、グループの名前は表示されません。

| 対象 | グループ | リレーションシップ | インデックス | ON DELETE / ON UPDATE | 保存時の拡張子 |
| --- | --- | --- | --- | --- | --- |
| `C#` | 言語 | — | — | — | `.cs` |
| `Go` | 言語 | — | — | — | `.go` |
| `Java` | 言語 | — | — | — | `.java` |
| `Kotlin` | 言語 | — | — | — | `.kt` |
| `PHP` | 言語 | — | — | — | `.php` |
| `Rust` | 言語 | — | — | — | `.rs` |
| `Scala` | 言語 | — | — | — | `.scala` |
| `Swift` | 言語 | — | — | — | `.swift` |
| `TypeScript` | 言語 | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | ON DELETE のみ | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | ユニークのみ | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | スキーマ | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | スキーマ | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | スキーマ | ✓ | — | — | `.graphql` |
| `JSON Schema` | スキーマ | — | — | — | `.json` |
| `Mermaid` | スキーマ | ✓ | — | — | `.mmd` |
| `Zod` | スキーマ | — | — | — | `.ts` |

既定値は `GraphQL` です。どの対象もカラムを出力し、✓ はそれ以外に何を出力するかを示します。  
テーブルはキャンバス上の並びではなく名前順に出力し、インデックスは[テーブルのプロパティ](./table-related-functions.md#indexes)の `Indexes` に一覧表示されたものを使い、その上にある `Keys` の行は使いません。`SeaORM` はユニークなインデックスだけを出力し、`Mermaid` はユニークなカラムに `UK` のマークを付けますが、インデックスは出力しません。  
`Java`、`AML`、`DBML`、`Mermaid` 以外のすべての対象は、主キーのカラムを、`Not Null` が設定されているかどうかにかかわらず null を許容しないカラムとして出力します。`Java` はどのカラムにも null を許容するかどうかを示さず、`AML`、`DBML`、`Mermaid` はダイアグラムにあるとおりのフラグを保持します。

いくつかの対象が出力する内容は次のとおりです。

- `PHP`: 型付きの public プロパティを持つプレーンなクラスで、`<?php` と `declare(strict_types=1);` で始まります。
- `Doctrine`: 属性を使った Doctrine ORM 3 のエンティティで、DBAL 4.2 以降向けです。各カラムには、選択しているデータベースに合わせた DBAL の型とオプションが付きます。
- `Rust`: テーブルごとの `pub struct` で、型は `chrono::NaiveDateTime` や `rust_decimal::Decimal` のように完全なパスで書き、`use` の行はありません。
- `SeaORM`: dense 形式の SeaORM 2.0 のエンティティで、各テーブルを `pub mod` にするため、テキスト全体を 1 つのファイルとしてコンパイルできます。
- `Swift`: テーブルごとの `Codable`、`Hashable`、`Sendable` な struct で、Swift 6.1 以降が必要です。
- `TypeScript`: 行を JSON として表すテーブルごとの `export interface` で、`Zod` のスキーマと同じく、日付や時刻は `string`、null を許容するカラムは `T | null` になります。
- `Zod`: テーブルごとの Zod 4 の行スキーマと、そこから推論される型です。挿入用のスキーマとリレーションはありません。
- `JSON Schema`: JSON Schema draft 2020-12 のドキュメント 1 つで、`$defs` の下にテーブルごとの行スキーマがあります。
- `Mermaid`: GitHub が描画する種類の `erDiagram` です。各テーブルは、すべてのカラムをその型と `PK`、`FK`、`UK` のマークとともに並べるエンティティになり、各リレーションシップはその 2 つのテーブルを結ぶ線になります。

`AML`、`DBML`、`GraphQL` は往復できる形式です。いずれも読み込み元にもなります。[ファイルの読み込みと書き出し](./file-import-export.md)を参照してください。ほかのスキーマである `JSON Schema`、`Mermaid`、`Zod` は出力のみです。  
`DBML` は各テーブルの色を `headercolor` として出力し、ドキュメント全体のコードでは、テーブルを含む各[テーブルグループ](./table-groups.md)について、`Ref` の後に `TableGroup` ブロックを出力します。`AML` はテーブルの色を、AML の色名のうち最も近いものとして出力します。

## ON DELETE と ON UPDATE {#on-delete-and-on-update}

リレーションシップの ON DELETE と ON UPDATE のアクションは、そのリレーションシップのコンテキストメニューから設定します。[ON DELETE と ON UPDATE](./relationship-editing.md#on-delete-and-on-update) を参照してください。  
[言語](#言語)の表の `ON DELETE / ON UPDATE` 列に ✓ がある対象は、リレーションシップに設定したアクションを出力します。`Not set` のままのアクションは何も出力しません。  
ORM の対象がどのアクションを残すかは選択しているデータベースによって決まりますが、`AML` と `DBML` はすべてを残します。[データベース](#database)を参照してください。

- `Doctrine` は ON DELETE だけを出力します。Doctrine には ON UPDATE がないためです。所有側の `ManyToOne` または `OneToOne` の各 `#[ORM\JoinColumn]` に、`#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]` のように `onDelete: 'CASCADE'` を追加し、逆側の `OneToMany` または `OneToOne` には何も出力しません。主キーではないユニークなカラムへのリレーションシップは通常のカラムのままになり、Doctrine はこれを関連付けなしでマッピングするため、アクションを出力しません。
- `Drizzle` は小文字で出力します。`.references()` では `{ onDelete: "cascade", onUpdate: "set null" }` のようなオプションになり、複数カラムのキーに出力される `foreignKey()` では `.onDelete("restrict").onUpdate("no action")` のようにチェーンでつなげます。
- `SeaORM` は子テーブルの `belongs_to` リレーションに、ON UPDATE を先にして、SeaORM の名前 `NoAction`、`Cascade`、`SetNull`、`SetDefault`、`Restrict` で、`on_update = "Cascade", on_delete = "SetNull"` のように出力します。親テーブルの `has_one` または `has_many` には出力しません。
- `Sequelize` は `onDelete: "CASCADE"` と `onUpdate` の項目を、`hasMany` または `hasOne` と、`belongsTo` の両方の関連付けの呼び出しに出力します。複数カラムのキーには関連付けの呼び出しを出力しないため、`Sequelize` はそのキーのアクションを出力しません。
- `SQLAlchemy` は `ondelete="CASCADE"` と `onupdate` の引数を、1 カラムのキーでは `ForeignKey()` に、複数カラムのキーでは `ForeignKeyConstraint()` に渡します。
- `TypeORM` は `onDelete: "CASCADE"` と `onUpdate` のオプションを所有側の `@ManyToOne` または `@OneToOne` に出力し、逆側には出力しません。`SET DEFAULT` は常に省きます。TypeORM ではこれが `DEFAULT` と書き出され、どのデータベースもそれを受け付けないためです。
- `DBML` は `[delete: set null, update: no action]` のような設定を `Ref` に追加します。
- `AML` は、アクションを持つリレーションシップをカラムにインラインで書くのではなく、`{onDelete: cascade, onUpdate: "set null"}` のようなプロパティを付けた独立した `rel` 文として出力します。

`JPA` はアクションを出力しません。標準の JPA にはそのためのオプションがなく、コード生成は Hibernate の `@OnDelete` を使わないためです。`Mermaid` も出力しません。`erDiagram` の線にはアクションを書く場所がないためです。  
テーブル 1 つを表示するテーブルのプロパティの `Code Generator` タブでは、`DBML` は `Ref` を、`AML` は `rel` 文を出力しないため、どちらもそこではアクションを表示しません。`AML` は、アクションを持つ 1 カラムのリレーションシップを、アクションを持たないものと同じようにカラムにインラインで残します。`Mermaid` はそこではリレーションシップの線をまったく出力しません。`Doctrine` と `SeaORM` は、そこでもドキュメント全体と同じエンティティを、アクションも含めて出力します。

## 名前のケース

`Table Name Case` と `Column Name Case` は、それぞれ `Pascal`、`Camel`、`Snake`、`None` に対応しています。  
既定値はテーブル名が `Pascal`、カラム名が `Camel` です。`None` はダイアグラムに書かれているとおりの名前を出力します。  
どのケースでも、対象の言語が予約している名前は、その言語でエスケープできる場合は `C#` の `@class` や `Rust` の `r#type` のようにエスケープし、エスケープできない場合は `Java` の `class_` のように名前を変えます。

`AML`、`DBML`、`Mermaid` はどちらの設定も無視し、常にダイアグラムの名前をそのまま出力します。  
`SeaORM` もこれらを無視します。フィールドとモジュールには、SeaORM が読み戻す形であるスネークケースで名前を付け、保存されている名前を `table_name` と、名前が異なる場合は `column_name` で示します。  
これら 4 つの対象では、パネルの両方のリストが淡い色で表示され、その下に `Not used by` の注記が付きます。

どの対象も、[名前の表示](./logical-names.md#name-view)が何を表示しているかにかかわらず、物理名を出力します。  
論理名はどの対象も出力せず、空のコメントにも書き込みません。このタブには、Schema SQL タブの [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) にあたるものはありません。  
ドメインも、どの対象も出力しません。ドメインに紐付いたカラムは、ほかのカラムと同じようにデータ型で出力されます。

## データベース {#database}

データ型は選択しているデータベースに合わせて解決されます。[データベース](./table-related-functions.md#databases)を参照してください。  
このタブでは、パネルの `Database` のリスト、コンテキストメニューの `Database`、またはクイック検索から選ぶと、すぐにコードが書き直されます。これはダイアグラムの唯一のデータベースの設定で、キャンバスのコンテキストメニューや [Schema SQL](./schema-sql.md) タブが設定するものと同じため、ここで変更するとそちらにも反映されます。  
`Drizzle` は同じ設定から方言を決定します。PostgreSQL では `pgTable`、MySQL と MariaDB では `mysqlTable`、SQLite では `sqliteTable`、それ以外のデータベースでは `pgTable` を使います。  
`SeaORM` は、PostgreSQL、MySQL、MariaDB、SQLite では、SeaORM がそのままでは別のカラムの型を作成する場合に `column_type` を出力し、SeaORM にバックエンドがない MSSQL、Oracle、Snowflake、Databricks では出力しません。

選択しているデータベースは、ORM の対象がどの ON DELETE と ON UPDATE のアクションを出力するかも決定します。  
`Doctrine`、`SeaORM`、`Sequelize`、`SQLAlchemy`、`TypeORM` は、そのデータベースの Schema SQL が省くアクション（例えば MySQL と MariaDB では `SET DEFAULT`、MSSQL では `RESTRICT`、Snowflake と Databricks では `NO ACTION` 以外のすべてのアクション）を省くため、データベースの既定の動作が適用されます。すべての一覧は [ON DELETE と ON UPDATE](./relationship-editing.md#on-delete-and-on-update) にあります。  
`Drizzle` は代わりに、出力する方言に従います。`mysqlTable` のコードは `SET DEFAULT` を省き、`pgTable` と `sqliteTable` のコードはすべてのアクションを残します。MSSQL、Oracle、Snowflake、Databricks 向けに出力する `pgTable` のコードも同様です。

`AML`、`DBML`、`Mermaid` は例外です。データ型をダイアグラムに書かれているとおりに出力するため、データベースの設定は出力を変えず、パネルではこれらの対象の `Database` が淡い色で表示されます。`AML` と `DBML` はリレーションシップに設定したアクションをすべて出力し、`Mermaid` は何も出力しません。

## Bracket

`Bracket` は、言語が `Doctrine`、`JPA`、`SeaORM` のいずれかの間だけ、パネル、コンテキストメニュー、クイック検索に表示されます。  
Schema SQL タブの括弧の種類と同じ設定のため、ここで変更すると Schema SQL での名前の囲み方も変わります。[Schema SQL](./schema-sql.md#データベースと-bracket) を参照してください。選択肢は `SingleQuote`、`DoubleQuote`、`Backtick`、`None` で、最初は `None` です。

- `Doctrine`: `None` 以外の括弧の種類では、すべてのテーブル名、カラム名、結合カラム名をバッククォートで囲みます。これは Doctrine で引用符を付ける名前を示す方法で、``#[ORM\Table(name: '`order`')]`` のようになります。`None` では、データベースの予約語、単純な ASCII の識別子ではない名前、引用符で囲んで入力した名前のように、必要な名前だけを囲みます。
- `JPA`: `None` 以外の括弧の種類では、予約語であるテーブル名を `@Table(name = "\"user\"")` のように `@Table` の中で引用符で囲みます。`None` では、Schema SQL と同じように囲まずにそのまま残します。
- `SeaORM`: `None` では、名前をデータベースが保存するとおりに書きます。ドットを含むテーブル名は `schema_name` と `table_name` に分け、PostgreSQL では引用符のない名前を小文字にします。それ以外の括弧の種類では、名前を書かれたとおりそのまま保ちます。

## 結果の保存とコピー

オプションパネルの下部またはコンテキストメニューにある `Save file` は、表示されているコードをファイルとして保存します。  
ファイルの名前はほかの書き出しと同じく `<database name>-<timestamp>` に[言語](#言語)の表の拡張子を付けたもので、例えば `shop-2026-10-12T04_05_06.ts` のようになり、使っているホストでほかの書き出しと同じ場所に保存されます。[書き出し](./file-import-export.md#exporting)を参照してください。`Java` と `JPA` は、タブに表示されているとおり、すべてのクラスを 1 つの `.java` ファイルに入れます。  
Export メニューには Code Generator の項目はなく、テーブルのプロパティの `Code Generator` タブではファイルを保存できません。

コードをコピーするには、パネルの下部の `Copy` をクリックするか、コードにマウスを重ねて右上のコピーボタンをクリックします。テーブルのプロパティでは、コピーボタンが唯一の方法です。  
チェックマークの付いた `Copied!` のトーストが 2 秒間表示され、コピーされたことを伝えます。ブラウザやホストがクリップボードを拒否した場合は、代わりに警告マークの付いた `Couldn't copy to the clipboard` のトーストが 5 秒間表示され、そのことを伝えます。もう一度コピーすると、トーストが増えるのではなく置き換わります。  
テキストは選択もできるため、必要な部分だけを取り出せます。

## 読み取り専用のエディタ {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) のエディタでも、パネルの一覧、コンテキストメニュー、クイック検索で `Language`、`Database`、`Table Name Case`、`Column Name Case`、`Bracket` を変更できますが、変わるのはそのウィンドウの中だけです。そのため、パネルはそれらに `Saved in the document` ではなく `This window only` と表示します。  
変更するとその画面のコードは書き直されますが、ロックの状態にかかわらず、ファイルには保存されず、共同編集者とも共有されず、Undo にも記録されません。また、自分が選んだ設定を共同編集者が変更しても、画面には自分の選択が残ります。`Database` と `Bracket` は Schema SQL タブの設定でもあるため、ここでの選択は同じウィンドウのそのタブにも反映されます。[読み取り専用のエディタ](./schema-sql.md#読み取り専用のエディタ)を参照してください。  
エディタが再び編集可能になると、ドキュメントの設定が戻り、コードはそれに合わせて書き直されます。  
`Save file` と `Copy` は、表示されているコードを保存し、コピーします。
