---
sidebar_position: 1
description: ブラウザ、VS Code、IntelliJ、自分のページで動作する ER 図エディタ。
---

# はじめに

erd-editor は ER 図（Entity-Relationship Diagram）エディタです。
Web アプリ、VSCode 拡張機能、IntelliJ プラグイン、そして自分のページに埋め込める `<erd-editor>` カスタム要素として提供しています。
どれも同じエディタで、ドキュメント形式も共通です。

![ショップのダイアグラムでリレーションシップの強調、カラムの追加、Flow での orders へのフォーカス](/img/demo-overview.webp)

## 入手方法

| プラットフォーム | インストール | 提供内容 |
| --- | --- | --- |
| Web アプリ | [erd-editor.io](https://erd-editor.io) | インストール可能な PWA、オフライン動作、リアルタイム共同編集 |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | `.erd.json` ファイルを開く専用エディタ |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | IntelliJ ベースの IDE で使える同じエディタ |
| 自分のページ | `npm install @dineug/erd-editor` | フレームワークに依存しない `<erd-editor>` カスタム要素 — [インストール](../api/installation.md)を参照 |

IDE で試すには、拡張子が `.erd.json` の空ファイルを作成して開きます。

## できること

- 端のないキャンバスにテーブル、カラム、メモを描き、`Zero One`、`Zero N`、`One Only`、`One N` の 4 種類のリレーションシップでつなぎます。[編集を始める](./guides/editing-start.md)を参照してください。インデックスはテーブルのプロパティパネルで定義します。[インデックス](./guides/table-related-functions.md#indexes)を参照してください。
- 既存のスキーマを `json`、`Schema SQL`、`GraphQL`、`DBML`、`AML` から読み込めます。[ファイルの読み込みと書き出し](./guides/file-import-export.md)を参照してください。
- ダイアグラムを `json`、`Schema SQL`、`png` として書き出します。
- Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake、SQLite の 8 つのデータベースベンダーの構文で Schema SQL を記述します。[テーブル関連機能](./guides/table-related-functions.md#databases)を参照してください。
- C#、Go、Java、Kotlin、Scala、TypeScript、Drizzle、JPA、Sequelize、SQLAlchemy、TypeORM、AML、DBML、GraphQL の 14 種類のターゲット向けにコードを生成します。[コード生成](./guides/code-generator.md)を参照してください。
- [可視化](./guides/visualization.md)では、スキーマを力学モデルの `Graph` として、またはリレーションシップに沿って並べたテーブルのカードの `Flow` として読み取れます。テーブルにマウスを重ねると、そのテーブルが接しているものが一目で分かります。ERD タブで `Alt + F` を押すと、[選択しているテーブルにフォーカス](./guides/visualization.md#focusing-on-tables)し、それに関連するテーブルと合わせて表示できます。
- 端のないキャンバスで作業します。ダイアグラムが伸びていく先へどこまでも移動でき、`10%` から `150%` まで拡大・縮小し、Zen モードでダイアグラムだけを残せます。[キャンバスの移動](./guides/table-related-functions.md#getting-around-the-canvas)を参照してください。
- [自動レイアウト](./guides/table-related-functions.md#auto-layout)で、ダイアグラム全体を一度に並べ替えます。Force のシミュレーション、左から右へ流れる Flow、縦横 2 方向の Tree から選べます。
- [クイック検索](./guides/quick-search.md)を使うと、どこからでもテーブルを探したりコマンドを実行したりでき、[Undo, Redo](./guides/undo-redo.md) では編集履歴をたどれます。
- リアルタイムで一緒に編集できます（実験的機能）。セッションはピアツーピアかつエンドツーエンドで暗号化されるため、スキーマがサーバーに保持されることはなく、参加者は互いのマウスカーソル、フォーカス、選択範囲を確認できます。自分のページでは、[`getSharedStore()`](../api/advanced/collaborative-editing.md) が同じアクションストリームを任意のトランスポート上で提供します。

まずは[編集ガイド](/docs/category/guides)から始めてください。

## このプロジェクトを始めた理由

既存のモデリングツールは、私が求めていた水準のユーザー体験を提供してくれませんでした。  
そこで、最高のユーザー体験を届けるためにこのプロジェクトを立ち上げました。  
このプロジェクトの最優先事項は、ユーザーの編集体験です。  
編集において、驚くような体験をお届けします。
