---
sidebar_position: 8
description: 14 種類の対象へのコード生成、テーブル名とカラム名のケース設定。
---

# コード生成

ツールバーの `Code Generator` タブに切り替え、コードパネルで右クリックしてコンテキストメニューを開きます。  
メニューには `Language`、`Table Name Case`、`Column Name Case` があります。

<img src="/img/code-generator.png" width="400" alt="コード生成メニュー" loading="lazy" />

同じパネルは[テーブルのプロパティ](./table-related-functions.md#table-properties)の `Code Generator` タブでもあり、そこではドキュメント全体ではなくそのテーブル 1 つ分のコードを生成します。  
このタブを開いている間は、3 つのメニューを[クイック検索](./quick-search.md)からも利用できます。

## 言語

対応している対象は 14 種類で、言語、ORM、スキーマ DSL の 3 つのまとまりに分け、それぞれのまとまりをアルファベット順に並べています。

| 対象 | グループ | リレーションシップ | インデックス |
| --- | --- | --- | --- |
| `C#` | 言語 | — | — |
| `Go` | 言語 | — | — |
| `Java` | 言語 | — | — |
| `Kotlin` | 言語 | — | — |
| `Scala` | 言語 | — | — |
| `TypeScript` | 言語 | — | — |
| `Drizzle` | ORM | ✓ | ✓ |
| `JPA` | ORM | ✓ | — |
| `Sequelize` | ORM | ✓ | ✓ |
| `SQLAlchemy` | ORM | ✓ | ✓ |
| `TypeORM` | ORM | ✓ | ✓ |
| `AML` | スキーマ DSL | ✓ | ✓ |
| `DBML` | スキーマ DSL | ✓ | ✓ |
| `GraphQL` | スキーマ DSL | ✓ | — |

既定値は `GraphQL` です。どの対象もカラムを出力し、✓ はそれ以外に何を出力するかを示します。  
テーブルはキャンバス上の並びではなく名前順に出力し、インデックスはテーブルのプロパティで定義したものを使います。

`AML`、`DBML`、`GraphQL` は往復できる形式です。いずれも読み込み元にもなります。[ファイルの読み込みと書き出し](./file-import-export.md)を参照してください。

## 名前のケース

`Table Name Case` と `Column Name Case` は、それぞれ `Pascal`、`Camel`、`Snake`、`None` に対応しています。  
既定値はテーブル名が `Pascal`、カラム名が `Camel` です。`None` はダイアグラムに書かれているとおりの名前を出力します。

`AML` と `DBML` はどちらの設定も無視し、常にダイアグラムの名前をそのまま出力します。

## データベース

データ型は選択しているデータベースに合わせて解決されるため、このタブに切り替える前にデータベースを選びます。[データベース](./table-related-functions.md#databases)を参照してください。  
`Drizzle` は同じ設定から方言を決定します。PostgreSQL では `pgTable`、MySQL と MariaDB では `mysqlTable`、SQLite では `sqliteTable`、それ以外のデータベースでは `pgTable` を使います。

`AML` と `DBML` は例外です。データ型をダイアグラムに書かれているとおりに出力するため、データベースの設定は出力を変えません。

## 結果のコピー

生成したコードにはファイルの書き出しがないため、パネルからコピーします。  
パネルにマウスを重ねて右上のコピーボタンをクリックすると、`Copied!` の通知が表示されます。テキストは選択もできるため、必要な部分だけを取り出せます。
