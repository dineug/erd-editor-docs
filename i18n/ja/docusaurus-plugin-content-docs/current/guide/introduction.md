---
sidebar_position: 1
description: ブラウザ、Google Drive、VS Code、IntelliJ、Obsidian、自分のページで動作する ER 図エディタ。
---

# はじめに

erd-editor は ER 図（Entity-Relationship Diagram）エディタです。
Web アプリ、Google Drive アプリ、VS Code 拡張機能、IntelliJ プラグイン、Obsidian プラグイン、そして自分のページに埋め込める `<erd-editor>` カスタム要素として提供しています。
どれも同じエディタで、ドキュメント形式も共通です。

![ショップのダイアグラムでリレーションシップの強調、カラムの追加、Flow での orders へのフォーカス](/img/demo-overview.webp)

## 入手方法

| プラットフォーム | インストール | 提供内容 |
| --- | --- | --- |
| Web アプリ | [erd-editor.io](https://erd-editor.io) | インストール可能な PWA、オフライン動作、リアルタイム共同編集 |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | Drive の Open with と New のメニューに ERD Editor を追加し、同じファイルに保存し直す |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | `.erd.json` ファイルを開く専用エディタ |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | IntelliJ ベースの IDE で使える同じエディタ |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | `.erd` と `.erd.json` ファイルを保管庫のタブで開く（デスクトップ版のみ） |
| 自分のページ | `npm install @dineug/erd-editor` | フレームワークに依存しない `<erd-editor>` カスタム要素 — [インストール](../api/installation.md)を参照 |
| コーディングエージェント | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | Claude Code、Codex などのクライアントが、VS Code、JetBrains IDE、Obsidian でライブで、またはファイルそのものに対して、ダイアグラムを編集できるようにする MCP サーバー |

IDE で試すには、拡張子が `.erd.json` の空ファイルを作成して開きます。
Obsidian では、コマンドパレットから `ERD Editor: Create new diagram` を実行するか、ファイルエクスプローラーでフォルダのコンテキストメニューから `New ERD` を選びます。どちらも空の `.erd` ファイルを作成して開きます。
Google Drive では、New → More → ERD Editor を選び、Google でサインインします。ERD Editor がアクセスできるのは、ERD Editor で作成したり開いたりしたファイルだけです。
Web アプリ、Google Drive、VS Code、JetBrains IDE、Obsidian では、新しい空のダイアグラムは[ウェルカム画面](./guides/editing-start.md#ウェルカム画面)で開きます。ウェルカム画面は最初の操作を並べたメニューで、`New Table`、`New Memo`、`Import`、`Command Palette`、`Shortcuts` があります。
新しいダイアグラムではすべてのロックがオンになっているため、スクロール、拡大・縮小、タブの切り替えをしても、新しいダイアグラムの空のファイルはそのまま変わりません。[ロック](./guides/settings.md#ロック)を参照してください。
VS Code は、Source Control、Local History、Compare with Saved、VS Code のチャットや GitHub Copilot、Claude Code などのコーディングエージェントによる編集のレビュー、GitLens、GitHub Pull Requests、Git Graph などの拡張機能のリビジョン表示では、ERD ファイルを JSON テキストとして開くため、変更を行単位の差分で確認できます。`Reopen Editor With...` を使うと、Git のリビジョンを読み取り専用のダイアグラムとして表示できます。

Obsidian プラグインを更新したら、Obsidian を再起動してください。再起動するまでは、以前のバージョンが読み込んだエディタがウィンドウに残ります。
ダイアグラムを共有するすべての環境で ERD Editor を更新してください。テーブルグループが導入される前のリリースでは、現在のリリースで保存したファイルに主キーのアイコンが表示されず、そこでファイルを保存するとテーブルグループと Schema SQL のスクリプトが失われます。
そのようなリリースで保存したファイルは、ファイルに保存される最初の変更の時点で現在の形式に書き直されます。[ロック](./guides/settings.md#ロック)を参照してください。それまでは、`$schema` に照らしてファイルを検証する JSON エディタで、無効なファイルとして報告されます。

## できること

- 端のないキャンバスにテーブル、カラム、メモを描き、`Zero One`、`Zero N`、`One Only`、`One N` の 4 種類のリレーションシップでつなぎます。[編集を始める](./guides/editing-start.md)を参照してください。インデックスはテーブルのプロパティパネルで定義します。2 つ以上のカラムにまたがるユニークインデックスは代替キーで、`Alternate Key` の表示オプションがオンのとき、ダイアグラムはそのカラムに `AK1.1`、`AK1.2` などのマークを付けます。[インデックス](./guides/table-related-functions.md#indexes)と[代替キー](./guides/table-related-functions.md#alternate-keys)を参照してください。
- リレーションシップの終点を、テーブルにすでにあるカラムにできます。マウスやペンでリレーションシップを作成している間、終点のテーブルの横にある `Map to existing columns` は親テーブルのキーをそのテーブルのカラムに対応付け、`Create new columns` は新しいカラムを追加します。リレーションシップのコンテキストメニューの `Map Columns` で、後からカラムを変更できます。[Map Columns](./guides/relationship-editing.md#map-columns)を参照してください。リレーションシップには ON DELETE と ON UPDATE のアクションも設定できます。[ON DELETE と ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update)を参照してください。
- すばやく編集できます。`Alt + N` はテーブルを追加し、`Alt + Enter` はカラムを追加し、`Alt + K` はフォーカスしているカラムの主キーを切り替え（そのカラムが選択しているカラムの 1 つであれば、選択しているすべてのカラムが対象です）、`Delete` または `Backspace` は選択しているものを削除します。どれも Undo の 1 ステップです。[ショートカット](./guides/settings.md#ショートカット)を参照してください。キャンバスの下端にある[キャンバスツールバー](./guides/table-related-functions.md#canvas-toolbar)でも、1 回のクリックでテーブルやメモを追加できます。
- テーブル、メモ、テーブルグループに、プリセットとダイアグラムですでに使われている色が並ぶカラーピッカーから色を付け、`No color` または `Remove color` で色を外せます。[テーブルとメモの色指定](./guides/table-related-functions.md#テーブルとメモの色指定)を参照してください。
- 関連するテーブルを[テーブルグループ](./guides/table-groups.md)にまとめられます。テーブルグループはテーブルの背後に置かれる枠で、名前と色を付けられます。`Alt + G` を押すか、キャンバスのコンテキストメニュー、キャンバスツールバー、クイック検索の `New Table Group` を使って描くか、選択しているテーブルから、`T` に続けて `G` を押すか、テーブルのコンテキストメニューの `Group selected tables` を選んで作成します。テーブルは枠の内側にドロップするとグループに加わり、外側にドロップするとグループから外れます。グループをタイトルバーでドラッグすると、そのテーブルも一緒に移動します。DBML は `TableGroup` ブロックとして、読み込みと書き出しの両方向でグループを保持します。
- 既存のスキーマを `json`、`Schema SQL`、`GraphQL`、`DBML`、`AML` から読み込めます。[ファイルの読み込みと書き出し](./guides/file-import-export.md)を参照してください。Schema SQL、GraphQL、DBML、AML のファイルは、テーブルがリレーションシップに沿って配置された状態で読み込まれ、リレーションシップがない場合は複数の行に並べて配置されます。[`Import and Add`](./guides/file-import-export.md#import-and-add) は、ダイアグラムを置き換えずに、ダイアグラムの下にファイルを追加します。
- ダイアグラムを `json` として書き出せるほか、[Schema SQL](./guides/schema-sql.md#sql-の保存とコピー) タブから Schema SQL を `.sql` ファイルとして保存またはコピーでき、[`Export image`](./guides/file-import-export.md#画像) ダイアログから PNG または SVG の画像として、あるいはクリップボードへの PNG として書き出せます。
- Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake、SQLite の 8 つのデータベースベンダーの構文で Schema SQL を記述します。[テーブル関連機能](./guides/table-related-functions.md#databases)を参照してください。[Schema SQL](./guides/schema-sql.md) タブのオプションパネルでは、書き出すステートメント、ヘッダー、テーブルグループを選べるほか、テーブルの前後に書き出す独自の SQL をダイアグラムに保存しておけます。
- 22 種類のターゲット向けにコードを生成します。言語は C#、Go、Java、Kotlin、PHP、Rust、Scala、Swift、TypeScript、ORM は Doctrine、Drizzle、JPA、SeaORM、Sequelize、SQLAlchemy、TypeORM、そのほかに AML、DBML、GraphQL、JSON Schema、Mermaid、Zod があります。Code Generator タブのオプションパネルでは言語、データベース、名前のケースを選び、コードはその言語の拡張子を付けたファイルとして保存するか、コピーします。[コード生成](./guides/code-generator.md)を参照してください。
- [可視化](./guides/visualization.md)では、スキーマを力学モデルの `Graph` として、またはリレーションシップに沿って並べたテーブルのカードの `Flow` として読み取れます。テーブルにマウスを重ねると、そのテーブルが接しているものが一目で分かります。ERD タブで `Alt + F` を押すと、[選択しているテーブルにフォーカス](./guides/visualization.md#focusing-on-tables)し、それに関連するテーブルと合わせて表示できます。
- 端のないキャンバスで作業します。ダイアグラムが伸びていく先へどこまでも移動でき、`Ctrl + Wheel`（Mac では `⌘ + Wheel`）、キーボード、ピンチで `10%` から `150%` まで拡大・縮小し、Zen モードでダイアグラムだけを残せます。マウスの中ボタンでドラッグすると、テーブルの上を含めてキャンバスのどこからでも表示位置を移動できます。[キャンバスの移動](./guides/table-related-functions.md#getting-around-the-canvas)を参照してください。
- [自動レイアウト](./guides/table-related-functions.md#auto-layout)で、ダイアグラム全体を一度に並べ替えます。Force のシミュレーション、左から右へ流れる Flow、縦横 2 方向の Tree から選べ、どれでも各テーブルグループはまとまったまま配置されます。
- [クイック検索](./guides/quick-search.md)を使うと、どこからでもコマンドを実行できます。検索を `#`、`@`、`:` で始めると、それぞれテーブル、カラム、コメントまたはメモへ移動できます。[Undo, Redo](./guides/undo-redo.md) では編集履歴をたどれ、[Time Travel](./guides/undo-redo.md#time-travel) ではこのセッションの履歴をキャンバス上で再生でき、[Diff Viewer](./guides/table-related-functions.md#diff-viewer) ではダイアグラムを別の `.json` ファイルと比較できます。Diff Viewer のツリーは 2 つのバージョンの横にあり、追加、変更、削除、名前の変更があったテーブル、カラム、インデックス、外部キー、メモ、テーブルグループを一覧表示します。
- キャンバスの左側にドッキングされたツリーである[エクスプローラー](./guides/explorer.md)で、ダイアグラムを見渡せます。ツリーには、テーブルとそれぞれのカラム、インデックス、外部キーが並び、その後にテーブルグループとメモが並びます。行をクリックすると、その行が表すキャンバス上の対象へ移動し、外部キーの行ではそのリレーションシップも強調表示されます。ツールバーで `Search` の隣にある `Explorer` ボタンで開閉します。
- エクスプローラーの上部にある[検索と置換](./guides/find-and-replace.md)でテキストを検索できます。検索するのはテーブル名、カラム名、インデックス名、テーブルグループ名で、オンにすればコメントとメモも検索し、一致した箇所をエクスプローラーのツリーに表示します。一致した箇所を 1 つだけ、またはすべてまとめて置換でき、`Preserve Case` を使うと、置換後のテキストが、置き換えられるテキストの大文字と小文字の使い方に合わせられます。`Ctrl + F`（Mac では `⌘ + F`）を押すと、検索フィールドにキャレットを置いた状態でエクスプローラーが開き、もう一度押すとエクスプローラーが閉じます。
- エディタを 25 の言語で使えます。言語はツールバーの `Display Language` ボタンまたはクイック検索から選びます。`System` はブラウザまたはホストアプリの言語に従い、アラビア語、ヘブライ語、ペルシア語ではエディタが右から左のレイアウトになりますが、ダイアグラムは左から右のままです。変わるのはエディタ自身のテキストだけで、名前、SQL、生成したコードは書いたとおりのままです。ツールバーのテーマビルダーでは、外観（`System`、`Light`、`Dark`）、グレーカラー、アクセントカラーを選びます。[言語とテーマ](./guides/language-and-theme.md)を参照してください。
- 差分をきれいに保てます。表示位置と拡大・縮小、開いているタブ、Code Generator の言語と名前のケース、括弧の種類は既定で[ロック](./guides/settings.md#ロック)されているため、ファイルにはロックした時点の値が残り、スクロール、拡大・縮小、タブの切り替えでファイルが変わることはありません。ファイルは決まった順序で書き込まれ、計測した幅、重なり順、コネクタの接続位置、削除した項目を含まないため、ダイアグラムを開いて編集せずに閉じれば、ファイルは元のまま変わりません。
- Claude Code や Codex などのコーディングエージェントに、[MCP サーバー](../mcp/introduction.md)を通じてダイアグラムを編集させられます。VS Code、Obsidian、JetBrains IDE ではライブで編集し、変更がその場でキャンバスに現れます。ファイルそのものを編集させることもできます。
- Web アプリでは、リアルタイムで一緒に編集できます（実験的機能）。セッションはピアツーピアかつエンドツーエンドで暗号化されるため、スキーマがサーバーに保持されることはなく、参加者は互いのマウスカーソル、フォーカス、選択範囲を確認できます。自分のページでは、[`getSharedStore()`](../api/advanced/collaborative-editing.md) が同じアクションストリームを任意のトランスポート上で提供します。

まずは[編集ガイド](/docs/category/guides)から始めてください。

## このプロジェクトを始めた理由

既存のモデリングツールは、私が求めていた水準のユーザー体験を提供してくれませんでした。  
そこで、最高のユーザー体験を届けるためにこのプロジェクトを立ち上げました。  
このプロジェクトの最優先事項は、ユーザーの編集体験です。  
編集において、驚くような体験をお届けします。
