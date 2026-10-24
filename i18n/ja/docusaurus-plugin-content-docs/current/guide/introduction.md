---
sidebar_position: 1
description: ブラウザ、Google Drive、VS Code、IntelliJ、Obsidian、自分のページで動作する ER 図エディタ。
---

# はじめに

erd-editor は ER 図（Entity-Relationship Diagram）エディタです。
Web アプリ、Google Drive アプリ、VS Code 拡張機能、IntelliJ プラグイン、Obsidian プラグイン、そして自分のページに組み込める `<erd-editor>` カスタム要素として提供しています。
どれも同じエディタで、ドキュメント形式も共通です。

![ショップのダイアグラムで、リレーションシップにマウスを重ね、カラムを追加し、Flow で orders にフォーカスする様子](/img/demo-overview.webp)

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
新しいダイアグラムではすべてのロックがオンになっているため、スクロール、拡大・縮小、タブの切り替え、名前の表示の切り替えをしても、新しいダイアグラムの空のファイルはそのまま変わりません。[ロック](./guides/settings.md#ロック)を参照してください。
VS Code は、Source Control、Local History、Compare with Saved、VS Code のチャットや GitHub Copilot、Claude Code などのコーディングエージェントによる編集のレビュー、GitLens、GitHub Pull Requests、Git Graph などの拡張機能のリビジョン表示では、ERD ファイルを JSON テキストとして開くため、変更を行単位の差分で確認できます。`Reopen Editor With...` を使うと、Git のリビジョンを読み取り専用のダイアグラムとして表示できます。

Obsidian プラグインを更新したら、Obsidian を再起動してください。再起動するまでは、以前のバージョンが読み込んだエディタがウィンドウに残ります。
ダイアグラムを共有するすべての環境で ERD Editor と `@dineug/erd-editor-mcp` を更新してください。辞書タブが導入される前のリリースや、ディスク上のファイルを編集する以前の MCP サーバーは、論理名、ドメインの紐付け、辞書を含めずにダイアグラムを保存します。テーブルグループが導入される前のリリースでは、さらに現在のリリースで保存したファイルに主キーのアイコンが表示されず、そこでファイルを保存するとテーブルグループと Schema SQL のスクリプトが失われます。
以前のリリースで保存したファイルは、ファイルに保存される最初の変更の時点で現在の形式に書き直されます。[ロック](./guides/settings.md#ロック)を参照してください。この保存では、以前のリリースが書き込んだ空のテキスト、リスト、コレクションも取り除かれるため、ファイルは編集した分より多く変わります。それまでは、テーブルグループが導入される前のリリースのファイルを `$schema` に照らして検証する JSON エディタで、無効なファイルとして報告されます。

## できること

- 端のないキャンバスにテーブル、カラム、メモを描き、`Zero One`、`Zero N`、`One Only`、`One N` の 4 種類のリレーションシップでつなぎます。[編集を始める](./guides/editing-start.md)を参照してください。インデックスはテーブルのプロパティパネルで定義します。2 つ以上のカラムにまたがるユニークインデックスは代替キーで、`Alternate Key` の表示オプションがオンのとき、ダイアグラムはそのカラムに `AK1.1`、`AK1.2` などのマークを付けます。[インデックス](./guides/table-related-functions.md#indexes)と[代替キー](./guides/table-related-functions.md#alternate-keys)を参照してください。
- リレーションシップの終点を、テーブルにすでにあるカラムにできます。マウスやペンでリレーションシップを作成している間、終点のテーブルの横にある `Map to existing columns` は親テーブルのキーをそのテーブルのカラムに対応付け、`Create new columns` は新しいカラムを追加します。リレーションシップのコンテキストメニューの `Map Columns` で、後からカラムを変更できます。[Map Columns](./guides/relationship-editing.md#map-columns) を参照してください。リレーションシップには ON DELETE と ON UPDATE のアクションも設定できます。[ON DELETE と ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update) を参照してください。
- すばやく編集できます。`Alt + N` はテーブルを追加し、`Alt + Enter` はカラムを追加し、`Alt + K` はフォーカスしているカラムの主キーを切り替え（そのカラムが選択しているカラムの 1 つであれば、選択しているすべてのカラムが対象です）、`Delete` または `Backspace` は選択しているものを削除します。どれも Undo の 1 ステップです。[ショートカット](./guides/settings.md#ショートカット)を参照してください。キャンバスの下端にある[キャンバスツールバー](./guides/table-related-functions.md#canvas-toolbar)でも、1 回のクリックでテーブルやメモを追加できます。
- テーブル、メモ、テーブルグループに、プリセットとダイアグラムですでに使われている色が並ぶカラーピッカーから色を付け、`No color` または `Remove color` で色を外せます。[テーブルとメモの色指定](./guides/table-related-functions.md#テーブルとメモの色指定)を参照してください。
- 関連するテーブルを[テーブルグループ](./guides/table-groups.md)にまとめられます。テーブルグループはテーブルの背後に置かれる枠で、名前と色を付けられます。`Alt + G` を押すか、キャンバスのコンテキストメニュー、キャンバスツールバー、クイック検索の `New Table Group` を使って描くか、選択しているテーブルから、`T` に続けて `G` を押すか、テーブルのコンテキストメニューの `Group selected tables` を選んで作成します。テーブルは枠の内側にドロップするとグループに加わり、外側にドロップするとグループから外れます。グループをタイトルバーでドラッグすると、そのテーブルも一緒に移動します。DBML は `TableGroup` ブロックとして、読み込みと書き出しの両方向でグループを保持します。
- テーブルとカラムに、Schema SQL と Code Generator が書き出す物理名とは別に、`CUST_NM` に対する `Customer Name` のような、人が読むための名前である[論理名](./guides/logical-names.md)を付けられます。名前の表示（`Physical Names`、`Logical Names`、`Both Names`）は、キャンバスがそのどれを描くかを決め、エクスプローラーのテーブルとカラムの行、Flow、書き出した画像など、テーブルやカラムの名前を表示する[ほかの場所のほとんど](./guides/logical-names.md#beyond-the-canvas)もこれに従います。名前の表示は、キャンバスツールバーの `Name View` ボタン、キャンバスのコンテキストメニュー、`Flow` での Visualization のツールバー、クイック検索から選びます。
- ダイアグラムの命名標準を[辞書](./guides/dictionary.md)タブで管理できます。`Domains`、`Words`、`Terms` のシートは、スプレッドシートのように検索、並べ替え、編集でき、それぞれが独自の Undo の履歴を持ちます。シートは CSV の読み込みと書き出しに対応し、読み込みではエディタ独自のレイアウトか韓国の公共データ共通標準のレイアウトを UTF-8 または EUC-KR で読み取り、書き出しではエディタ独自のレイアウトで書き出します。論理名のセルは用語名を補完します。論理名は、自分で名前を付けるまで、一致する用語から、またはそれを分割した単語の英略語から、そのテーブルやカラムの物理名を生成します。単語や用語を変更した後は、[`Derive Physical Names Again`](./guides/dictionary.md#derive-physical-names-again) で、自分で付けた名前も含めて名前を再生成します。手動で、または用語によってドメインに紐付いたカラムは、[ドメインのデータ型を持ち](./guides/dictionary.md#domains-and-data-types)、その変更に従います。`Domain` の表示オプションは各カラムのドメインを表示します。[`Checks`](./guides/dictionary.md#the-checks-sheet) シートは、禁止語、未登録の単語、同義語、名前の重複、不明なドメイン、用語の物理名と異なる物理名、ドメインのデータ型と異なるカラムの型を一覧表示します。キャンバスは、単語と用語のチェックが検出した論理名と物理名に色を付けます。
- 既存のスキーマを `json`、`Schema SQL`、`GraphQL`、`DBML`、`AML` から読み込めます。[ファイルの読み込みと書き出し](./guides/file-import-export.md)を参照してください。Schema SQL、GraphQL、DBML、AML のファイルは、テーブルがリレーションシップに沿って配置された状態で読み込まれ、リレーションシップがない場合は複数の行に並べて配置されます。[`Import and Add`](./guides/file-import-export.md#import-and-add) は、ダイアグラムを置き換えずに、ダイアグラムの下にファイルを追加します。
- ダイアグラムを `json` として書き出せるほか、[Schema SQL](./guides/schema-sql.md#sql-の保存とコピー) タブから Schema SQL を `.sql` ファイルとして保存またはコピーでき、[`Export image`](./guides/file-import-export.md#画像) ダイアログから PNG または SVG の画像として、あるいはクリップボードへの PNG として書き出せます。
- Databricks、MSSQL、MariaDB、MySQL、Oracle、PostgreSQL、Snowflake、SQLite の 8 つのデータベースベンダーの構文で Schema SQL を記述します。[テーブル関連機能](./guides/table-related-functions.md#databases)を参照してください。[Schema SQL](./guides/schema-sql.md) タブのオプションパネルでは、書き出すステートメント、ヘッダー、テーブルグループを選べるほか、[空のコメントに論理名を書き出す](./guides/schema-sql.md#logical-names-as-comments)こともでき、テーブルの前後に書き出す独自の SQL をダイアグラムに保存しておけます。
- 22 種類のターゲット向けにコードを生成します。言語は C#、Go、Java、Kotlin、PHP、Rust、Scala、Swift、TypeScript、ORM は Doctrine、Drizzle、JPA、SeaORM、Sequelize、SQLAlchemy、TypeORM、そのほかに AML、DBML、GraphQL、JSON Schema、Mermaid、Zod があります。Code Generator タブのオプションパネルでは言語、データベース、名前のケースを選び、コードはその言語の拡張子を付けたファイルとして保存するか、コピーします。[コード生成](./guides/code-generator.md)を参照してください。
- [可視化](./guides/visualization.md)では、スキーマを力学モデルの `Graph` として、またはリレーションシップに沿って並べたテーブルのカードの `Flow` として読み取れます。テーブルにマウスを重ねると、そのテーブルにつながっているものがすべて強調表示されます。ERD タブで `Alt + F` を押すと、[選択しているテーブルにフォーカス](./guides/visualization.md#focusing-on-tables)し、それに関連するテーブルと合わせて表示できます。`Flow` では、Flow で絞り込んできた対象を、そこでの Undo と Redo のキーと同じように [`Previous table` と `Next table`](./guides/visualization.md#previous-table-and-next-table) で戻ったり進んだりできます。
- 端のないキャンバスで作業します。ダイアグラムが伸びていく先へどこまでも移動でき、`Ctrl + Wheel`（Mac では `⌘ + Wheel`）、キーボード、ピンチで `10%` から `150%` まで拡大・縮小し、Zen モードでダイアグラムだけを残せます。マウスの中ボタンでドラッグすると、テーブルの上を含めてキャンバスのどこからでも表示位置を移動できます。[キャンバスの移動](./guides/table-related-functions.md#getting-around-the-canvas)を参照してください。
- [自動レイアウト](./guides/table-related-functions.md#auto-layout)で、ダイアグラム全体を一度に並べ替えます。Force のシミュレーション、左から右へ流れる Flow、縦横 2 方向の Tree から選べ、どれでも各テーブルグループはまとまったまま配置されます。
- [クイック検索](./guides/quick-search.md)を使うと、どこからでもコマンドを実行できます。検索を `#`、`@`、`:` で始めると、それぞれテーブル、カラム、コメントまたはメモへ移動できます。`#` と `@` は論理名にも一致します。[Undo, Redo](./guides/undo-redo.md) では編集履歴をたどれ、[Time Travel](./guides/undo-redo.md#time-travel) ではこのセッションの履歴をキャンバス上で再生でき、[Diff Viewer](./guides/table-related-functions.md#diff-viewer) ではダイアグラムを別の `.json` ファイルと比較できます。Diff Viewer のツリーは 2 つのバージョンの横にあり、追加、変更、削除、名前の変更があったテーブル、カラム、インデックス、外部キー、メモ、テーブルグループを一覧表示します。
- キャンバスの左側にドッキングされたツリーである[エクスプローラー](./guides/explorer.md)で、ダイアグラムを見渡せます。ツリーには、テーブルとそれぞれのカラム、インデックス、外部キーが並び、その後にテーブルグループとメモが並びます。行をクリックすると、その行が表すキャンバス上の対象へ移動し、外部キーの行ではそのリレーションシップも強調表示されます。ツールバーで `Search` の隣にある `Explorer` ボタンで開閉します。
- エクスプローラーの上部にある[検索と置換](./guides/find-and-replace.md)でテキストを検索できます。検索するのはテーブル、カラム、インデックス、テーブルグループの名前と、テーブルとカラムの論理名で、オンにすればコメントとメモも検索し、一致した箇所をエクスプローラーのツリーに表示します。一致した箇所を 1 つだけ、またはすべてまとめて置換でき、`Preserve Case` を使うと、置換後のテキストが、置き換えられるテキストの大文字と小文字の使い方に合わせられます。`Ctrl + F`（Mac では `⌘ + F`）を押すと、検索フィールドにキャレットを置いた状態でエクスプローラーが開き、もう一度押すとエクスプローラーが閉じます。
- エディタを 25 の言語で使えます。言語はツールバーの `Display Language` ボタンまたはクイック検索から選びます。`System` はブラウザまたはホストアプリの言語に従い、アラビア語、ヘブライ語、ペルシア語ではエディタが右から左のレイアウトになりますが、ダイアグラムは左から右のままです。変わるのはエディタ自身のテキストだけで、名前、SQL、生成したコードは書いたとおりのままです。ツールバーのテーマビルダーでは、外観（`System`、`Light`、`Dark`）、グレーカラー、アクセントカラーを選びます。[言語とテーマ](./guides/language-and-theme.md)を参照してください。
- 差分をきれいに保てます。表示位置と拡大・縮小、開いているタブ、Code Generator の言語と名前のケース、括弧の種類、名前の表示は既定で[ロック](./guides/settings.md#ロック)されているため、ファイルにはロックした時点の値が残り、スクロール、拡大・縮小、タブの切り替え、名前の表示の切り替えでファイルが変わることはありません。ファイルは決まった順序で、辞書の行ごとに 1 行で書き込まれ、計測した幅、重なり順、コネクタの接続位置、削除した項目、項目の空のテキスト、ダイアグラムに 1 つもない種類のリストとコレクションを含まないため、ダイアグラムを開いて編集せずに閉じれば、ファイルは元のまま変わりません。
- Claude Code や Codex などのコーディングエージェントに、[MCP サーバー](../mcp/introduction.md)を通じてダイアグラムを編集させられます。VS Code、Obsidian、JetBrains IDE ではライブで編集し、変更がその場でキャンバスに現れます。ファイルそのものを編集させることもできます。また、論理名とカラムのドメインを設定し、[辞書を編集](../mcp/tools.md#dictionaries)し、物理名を再生成し、`Checks` シートが検出する内容を一覧表示することもできます。
- Web アプリでは、リアルタイムで一緒に編集できます（実験的機能）。セッションはピアツーピアかつエンドツーエンドで暗号化されるため、スキーマがサーバーに保持されることはなく、参加者は互いのマウスカーソル、フォーカス、選択範囲を確認できます。自分のページでは、[`getSharedStore()`](../api/advanced/collaborative-editing.md) が同じアクションストリームを任意のトランスポート上で提供します。

まずは[編集ガイド](/docs/category/guides)から始めてください。

## このプロジェクトを始めた理由

既存のモデリングツールは、私が求めていた水準のユーザー体験を提供してくれませんでした。  
そこで、最高のユーザー体験を届けるためにこのプロジェクトを立ち上げました。  
このプロジェクトの最優先事項は、ユーザーの編集体験です。  
編集において、驚くような体験をお届けします。
