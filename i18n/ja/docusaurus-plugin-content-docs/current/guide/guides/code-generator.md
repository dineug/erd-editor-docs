---
sidebar_position: 9
description: 14 種類の対象へのコード生成、リレーションシップの ON DELETE と ON UPDATE のアクションを出力する対象、テーブル名とカラム名のケース設定。
---

# コード生成

ツールバーの `Code Generator` タブに切り替え、コードパネルで右クリックしてコンテキストメニューを開きます。  
メニューには `Language`、`Table Name Case`、`Column Name Case` があります。

![コードパネルのコンテキストメニューで TypeScript とテーブル名の Snake を選び、コードをコピーする](/img/demo-code-generator.webp)

同じパネルは[テーブルのプロパティ](./table-related-functions.md#table-properties)の `Code Generator` タブでもあり、そこではドキュメント全体ではなくそのテーブル 1 つ分のコードを生成します。  
このタブを開いている間は、3 つのメニューを[クイック検索](./quick-search.md)からも利用できます。

## 言語

対応している対象は 14 種類で、言語、ORM、スキーマ DSL の 3 つのまとまりに分け、それぞれのまとまりをアルファベット順に並べています。

| 対象 | グループ | リレーションシップ | インデックス | ON DELETE / ON UPDATE |
| --- | --- | --- | --- | --- |
| `C#` | 言語 | — | — | — |
| `Go` | 言語 | — | — | — |
| `Java` | 言語 | — | — | — |
| `Kotlin` | 言語 | — | — | — |
| `Scala` | 言語 | — | — | — |
| `TypeScript` | 言語 | — | — | — |
| `Drizzle` | ORM | ✓ | ✓ | ✓ |
| `JPA` | ORM | ✓ | — | — |
| `Sequelize` | ORM | ✓ | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ | ✓ |
| `AML` | スキーマ DSL | ✓ | ✓ | ✓ |
| `DBML` | スキーマ DSL | ✓ | ✓ | ✓ |
| `GraphQL` | スキーマ DSL | ✓ | — | — |

既定値は `GraphQL` です。どの対象もカラムを出力し、✓ はそれ以外に何を出力するかを示します。  
テーブルはキャンバス上の並びではなく名前順に出力し、インデックスは[テーブルのプロパティ](./table-related-functions.md#indexes)の `Indexes` に一覧表示されたものを使い、その上にある `Keys` の行は使いません。

`AML`、`DBML`、`GraphQL` は往復できる形式です。いずれも読み込み元にもなります。[ファイルの読み込みと書き出し](./file-import-export.md)を参照してください。

## ON DELETE と ON UPDATE {#on-delete-and-on-update}

リレーションシップの ON DELETE と ON UPDATE のアクションは、そのリレーションシップのコンテキストメニューから設定します。[ON DELETE と ON UPDATE](./relationship-editing.md#on-delete-and-on-update) を参照してください。  
最後の列に ✓ がある対象は、リレーションシップに設定したアクションを出力します。`Not set` のままのアクションは何も出力しません。  
ORM の対象がどのアクションを残すかは選択しているデータベースによって決まりますが、`AML` と `DBML` はすべてを残します。[データベース](#database)を参照してください。

- `Drizzle` は小文字で出力します。`.references()` では `{ onDelete: "cascade", onUpdate: "set null" }` のようなオプションになり、複数カラムのキーに出力される `foreignKey()` では `.onDelete("restrict").onUpdate("no action")` のようにチェーンでつなげます。
- `Sequelize` は `onDelete: "CASCADE"` と `onUpdate` の項目を、`hasMany` または `hasOne` と、`belongsTo` の両方の関連付けの呼び出しに出力します。複数カラムのキーには関連付けの呼び出しを出力しないため、`Sequelize` はそのキーのアクションを出力しません。
- `SQLAlchemy` は `ondelete="CASCADE"` と `onupdate` の引数を、1 カラムのキーでは `ForeignKey()` に、複数カラムのキーでは `ForeignKeyConstraint()` に渡します。
- `TypeORM` は `onDelete: "CASCADE"` と `onUpdate` のオプションを所有側の `@ManyToOne` または `@OneToOne` に出力し、逆側には出力しません。`SET DEFAULT` は常に省きます。TypeORM ではこれが `DEFAULT` と書き出され、どのデータベースもそれを受け付けないためです。
- `DBML` は `[delete: set null, update: no action]` のような設定を `Ref` に追加します。
- `AML` は、アクションを持つリレーションシップをカラムにインラインで書くのではなく、`{onDelete: cascade, onUpdate: "set null"}` のようなプロパティを付けた独立した `rel` 文として出力します。

`JPA` はアクションを出力しません。標準の JPA にはそのためのオプションがなく、コード生成は Hibernate の `@OnDelete` を使わないためです。  
テーブル 1 つを表示するテーブルのプロパティの `Code Generator` タブでは、`DBML` は `Ref` を、`AML` は `rel` 文を出力しないため、どちらもそこではアクションを表示しません。`AML` は、アクションを持つ 1 カラムのリレーションシップを、アクションを持たないものと同じようにカラムにインラインで残します。

## 名前のケース

`Table Name Case` と `Column Name Case` は、それぞれ `Pascal`、`Camel`、`Snake`、`None` に対応しています。  
既定値はテーブル名が `Pascal`、カラム名が `Camel` です。`None` はダイアグラムに書かれているとおりの名前を出力します。

`AML` と `DBML` はどちらの設定も無視し、常にダイアグラムの名前をそのまま出力します。

## データベース {#database}

データ型は選択しているデータベースに合わせて解決されるため、このタブに切り替える前にデータベースを選びます。[データベース](./table-related-functions.md#databases)を参照してください。  
`Drizzle` は同じ設定から方言を決定します。PostgreSQL では `pgTable`、MySQL と MariaDB では `mysqlTable`、SQLite では `sqliteTable`、それ以外のデータベースでは `pgTable` を使います。

選択しているデータベースは、ORM の対象がどの ON DELETE と ON UPDATE のアクションを出力するかも決定します。  
`Sequelize`、`SQLAlchemy`、`TypeORM` は、MySQL と MariaDB の `SET DEFAULT` や MSSQL の `RESTRICT` のように、そのデータベースの Schema SQL が省くアクションを省くため、データベースの既定の動作が適用されます。すべての一覧は [ON DELETE と ON UPDATE](./relationship-editing.md#on-delete-and-on-update) にあります。  
`Drizzle` は代わりに、出力する方言に従います。`mysqlTable` のコードは `SET DEFAULT` を省き、`pgTable` と `sqliteTable` のコードはすべてのアクションを残します。MSSQL、Oracle、Snowflake、Databricks 向けに出力する `pgTable` のコードも同様です。

`AML` と `DBML` は例外です。データ型をダイアグラムに書かれているとおりに出力し、リレーションシップに設定したアクションもすべて出力するため、データベースの設定は出力を変えません。

## 結果のコピー

生成したコードにはファイルの書き出しがないため、パネルからコピーします。  
パネルにマウスを重ねて右上のコピーボタンをクリックすると、`Copied!` の通知が表示されます。テキストは選択もできるため、必要な部分だけを取り出せます。
