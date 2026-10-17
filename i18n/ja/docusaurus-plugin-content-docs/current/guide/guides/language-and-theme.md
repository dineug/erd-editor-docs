---
sidebar_position: 15
description: エディタの 25 の表示言語、右から左のレイアウト、テーマビルダーの System、Light、Dark の外観と色、各ホストでの保存先。
---

# 言語とテーマ

エディタ自身のテキストは 25 の言語で表示でき、その見た目はテーマで決まります。テーマは、外観（`System`、`Light`、`Dark`）、グレーカラー、アクセントカラーの組み合わせです。  
どちらもダイアグラムではなく、エディタを使う人に属します。どちらもファイルには保存されず、[Undo の履歴](./undo-redo.md)にも記録されず、共同編集者とも共有されないため、各自が自分の選択で表示し、どちらを変更してもファイルが未保存の状態になることはありません。

どちらも[設定](./settings.md)タブにはありません。ツールバーには `Theme` ボタンと、そのすぐ後に `Display Language` ボタンがあり、どちらも [`Explorer`](./explorer.md) ボタンの後に並びます。[クイック検索](./quick-search.md)には、どのタブでも `Theme` と `Display Language` が表示されます。  
Web アプリ、Google Drive、VS Code、JetBrains IDE、Obsidian はどれも両方を提供し、選んだ内容を記憶します。[各ホストでの設定](#各ホストでの設定)を参照してください。どちらも読み取り専用のエディタでも使えます。

## 表示言語

表示言語が対象にするのはエディタ自身のテキストです。ツールバーのツールチップ、コンテキストメニュー、クイック検索、パネルとダイアログ、設定タブ、[ウェルカム画面](./editing-start.md#ウェルカム画面)、トーストとメッセージ、そして空の名前、データ型、既定値、コメントがキャンバス上や書き出した画像に表示するプレースホルダーが含まれます。  
次のものは、どの言語でも書かれたとおりのままです。自分で付けたテーブル名とカラム名、コメント、メモ、データベースベンダー、Code Generator の言語、ファイル形式、データ型、SQL のキーワード、`ON DELETE` と `ON UPDATE` のアクション、Schema SQL のオプション（`Create`、`If not exists`、`Drop & re-create`、`USE`、`CREATE + USE`）、マーク（`PK`、`FK`、`UQ`、`AI`、`NN`、`N-N`、`NULL`、`AK1.1`）、[Diff Viewer](./table-related-functions.md#diff-viewer) のステータスの文字（`A`、`M`、`D`、`R`、`~`）、`None` 以外の名前のケースと `Bracket` の選択肢、キーボードのキーの名前、テーマビルダーの色の名前、生成された SQL とコード、書き出したファイルの名前です。

言語は、ピッカーに並ぶ順に次のとおりです。

| ピッカーでの表示 | 言語 | コード |
| --- | --- | --- |
| Bahasa Indonesia | インドネシア語 | `id-ID` |
| Deutsch | ドイツ語 | `de-DE` |
| English | 英語 | `en` |
| Español | スペイン語 | `es-ES` |
| Euskara | バスク語 | `eu-ES` |
| Français | フランス語 | `fr-FR` |
| Italiano | イタリア語 | `it-IT` |
| Nederlands | オランダ語 | `nl-NL` |
| Polski | ポーランド語 | `pl-PL` |
| Português | ポルトガル語 | `pt-PT` |
| Português Brasileiro | ブラジルポルトガル語 | `pt-BR` |
| Română | ルーマニア語 | `ro-RO` |
| Slovenčina | スロバキア語 | `sk-SK` |
| Slovenščina | スロベニア語 | `sl-SI` |
| Svenska | スウェーデン語 | `sv-SE` |
| Türkçe | トルコ語 | `tr-TR` |
| Русский | ロシア語 | `ru-RU` |
| Українська | ウクライナ語 | `uk-UA` |
| עברית | ヘブライ語 | `he-IL` |
| العربية | アラビア語 | `ar-SA` |
| فارسی | ペルシア語 | `fa-IR` |
| 日本語 | 日本語 | `ja-JP` |
| 简体中文 | 簡体字中国語 | `zh-CN` |
| 繁體中文 | 繁体字中国語 | `zh-TW` |
| 한국어 | 韓国語 | `ko-KR` |

Code Generator タブでクイック検索が表示する `Language` と、設定タブの[ロック](./settings.md#ロック)の一覧にある `Language` の行は、[Code Generator の対象言語](./code-generator.md#言語)のことで、表示言語ではありません。

### 言語の選択

`Display Language` ボタン（言語のアイコン）を押すと、`Display Language` のピッカーが開きます。これは `Display Language` という見出しのパネルで、ツールバーの下に、開いているどのタブにも重なって表示されます。  
先頭は `System` で、その横には現在それが表す言語が表示され、一覧をスクロールしても表示されたままです。その後に 25 の言語がそれぞれその言語自身の名前で続き、現在の選択にチェックが付きます。

![ツールバーから表示言語を 한국어 に切り替え、続いて العربية に切り替えるとツールバーは左右反転するがダイアグラムは反転せず、最後に System に戻す様子](/img/demo-display-language.webp)

パネルは、チェックの付いた行にキーボードフォーカスがある状態で開きます。

- `↑` と `↓` で行を移動し、両端で折り返します。`Home` と `End` で最初と最後の行へ移動します。
- `Enter` または `Space` で、クリックと同じようにフォーカスしている行を選びます。

選んだ内容はすぐに反映され、パネルが閉じて、キーボード操作はエディタに戻ります。

何も選ばずに閉じるには、`Escape` を押すか、見出しの横にある `x` ボタン（ツールチップには `Close (ESC)` と表示されます）を押すか、エディタ内でパネルの外側（ツールバーを除く）を押すか、`Display Language` ボタンをもう一度押します。  
ピッカーを開くと、テーマビルダーとテーブルのプロパティが閉じます。開いている[エクスプローラー](./explorer.md#dialogs-beside-it)は開いたままで、左から右に書く言語では、ピッカーはエクスプローラーに重ならず、そのすぐ横に表示されます。  
クイック検索かテーマビルダーを開くとピッカーが閉じ、`Ctrl + F` (Windows/Linux) または `⌘ + F` (Mac) を押しても閉じます。このキーは[エクスプローラー](./explorer.md#opening-and-closing)を検索の状態で開くか、エクスプローラーがすでに開いている場合は開いたままにして、キーボード操作をその検索フィールドに移します。ツールバーの `Explorer` ボタンを押しても、ピッカーは開いたままです。

パネルがキーボードフォーカスを持っている間も、いくつかのエディタのショートカットは動作します。`Search`、`Toggle Explorer`、`Undo`、`Redo`、`Zoom In`、`Zoom Out`、`Zoom Reset` です。[ショートカット](./settings.md#ショートカット)を参照してください。それ以外のエディタのショートカット、矢印キー、`Tab` はパネルの中にとどまるため、エディタはそれらに反応しません。ホスト自身の保存のように、エディタが割り当てていないキーは、通常どおりホストに届きます。

[クイック検索](./quick-search.md)では、`Display Language` が `System` と 25 の言語を一覧表示し、現在の選択にチェックが付きます。ここでは英語名やコードでも言語が見つかり、`german` や `de-DE` で `Deutsch` が見つかります。

### System が従うもの

Web アプリ、Google Drive、VS Code、JetBrains IDE、Obsidian では、言語は `System` から始まります。これはホストの言語に従います。

- Web アプリ、Google Drive、自分のページ: ブラウザの優先言語。優先言語を変更すると、すぐにそれに従います。
- VS Code: VS Code の表示言語。
- JetBrains IDE: IDE 自身のインターフェースの表示に使われている言語。
- Obsidian: Obsidian の言語。

`System` は、それらの言語のうちエディタが対応している最初の言語になり、どれにも対応していない場合は英語になります。  
地域による変種はその言語として扱われるため、`de-AT` は Deutsch に、`fr-CA` は Français になります。中国語は文字体系で決まり、繁体字は繁體中文に、それ以外の文字体系は简体中文になります。文字体系の指定がない場合は、台湾、香港、マカオは繁體中文に、それ以外の中国語は简体中文になります。ポルトガル語は、ブラジル以外の地域が指定されていない限り Português Brasileiro になるため、`pt-PT` は Português になります。Obsidian のポルトガル語も Português になります。

### 右から左に書く言語

עברית（ヘブライ語）、العربية（アラビア語）、فارسی（ペルシア語）では、エディタは右から左のレイアウトになり、ツールバー、メニュー、パネルとダイアログ、クイック検索、設定タブが左右反転します。コンテキストメニューのサブメニューは左側に開き、ツールバーの Undo と Redo のアイコンが入れ替わるため、Undo は右から左に読む人にとって戻る方向を指します。

ダイアグラム自体が左右反転することはありません。テーブル、カラム、リレーションシップ、メモを含むキャンバスは左から右のままで、ミニマップ、スクロールバー、[キャンバスツールバー](./table-related-functions.md#canvas-toolbar)、[Visualization](./visualization.md) とそのツールバー、データ型のセル、Schema SQL タブと Code Generator タブのコード、カラーピッカー、Diff Viewer の両側、Time Travel、自動レイアウトのプレビューも同様です。  
[エクスプローラー](./explorer.md#beside-the-canvas)はキャンバスの左に、Diff Viewer の変更のツリーはビューアーの左にとどまり、どちらもドラッグする端は右側にあります。内側はどちらも右から左に読む向きになります。フィールドと行は左右反転し、行は右からインデントされ、どちらのツリーでも `←` で行を展開するか最初の子に移動し、`→` で行を折りたたむか親に移動します。[エクスプローラー内のキー](./explorer.md#keys-in-the-explorer)を参照してください。  
名前、コメントなど、入力したテキストはそれ自身の向きを保つため、ヘブライ語、アラビア語、ペルシア語の名前はキャンバス上でも右から左に読めます。

## テーマ

`Theme` ボタン（コントラストのアイコン）を押すと、テーマビルダーが開きます。これは `Theme` という見出しのパネルで、ツールバーの下に、開いているどのタブにも重なって表示されます。次の 3 つの部分があります。

- `Accent color`: 26 個の色見本。それぞれのツールチップに `indigo` のような名前が表示されます。
- `Gray color`: `gray`、`mauve`、`slate`、`sage`、`olive`、`sand` の 6 個の色見本。
- `Appearance`: `System`、`Light`、`Dark`。

![ツールバーからテーマビルダーを開き、アクセントカラーとグレーカラーを選んで、外観を Light、続いて System に切り替える様子](/img/demo-theme-builder.webp)

各部分では現在の選択に印が付き、選んだ内容はすぐに反映され、テーマビルダーは開いたままです。  
色を選んでも外観はそのまま残るため、`System` のときに選んだ色でも外観は `System` のままです。

`System` はホストと同じようにライトまたはダークで表示し、ホストが切り替わるとそれに合わせて切り替わります。

- Web アプリ、Google Drive、自分のページ: ブラウザが報告するライトモードまたはダークモード。これはオペレーティングシステムに従います。
- VS Code: ライトのカラーテーマではライト、ダークのカラーテーマと、どちらのハイコントラストテーマでもダーク。
- JetBrains IDE: IDE のライトまたはダークのテーマ。
- Obsidian: Obsidian のライトまたはダークのテーマ。

テーマビルダーを閉じるには、`Escape` を押すか、見出しの横にある `x` ボタン（ツールチップには `Close (ESC)` と表示されます）を押すか、エディタ内でパネルの外側（ツールバーを除く）を押すか、`Theme` ボタンをもう一度押します。  
テーマビルダーを開くと、テーブルのプロパティと `Display Language` のピッカーが閉じます。開いている[エクスプローラー](./explorer.md#dialogs-beside-it)は開いたままで、左から右に書く言語では、テーマビルダーはエクスプローラーに重ならず、そのすぐ横に表示されます。  
クイック検索か `Display Language` のピッカーを開くとテーマビルダーが閉じ、`Ctrl + F` (Windows/Linux) または `⌘ + F` (Mac) を押しても閉じます。このキーは[エクスプローラー](./explorer.md#opening-and-closing)を検索の状態で開くか、エクスプローラーがすでに開いている場合は開いたままにして、キーボード操作をその検索フィールドに移します。ツールバーの `Explorer` ボタンを押しても、テーマビルダーは開いたままです。  
テーマビルダーはキーをパネルの中にとどめないため、開いている間もエディタのショートカットが動作します。

[クイック検索](./quick-search.md)では、`Theme` が `System`、`Light`、`Dark` を一覧表示し、現在の外観にチェックが付きます。選ぶと外観だけが変わり、グレーカラーとアクセントカラーはそのまま残ります。

## 各ホストでの設定

ツールバーまたはクイック検索からエディタで選んだ内容は、ホストの保存先に保存されます。どこで変更しても、開いているすべてのダイアグラムがすぐにその変更に従います。  
VS Code、JetBrains IDE、Obsidian では、ホストの `Auto`（VS Code では値 `auto`）がエディタの `System` に当たります。`System` を選ぶと `Auto` が保存され、`Light` または `Dark` を選ぶと、`Auto` ですでにその外観が表示されていた場合でも、その外観が保存されます。  
拡張機能とプラグイン自身の設定と通知は、表示言語にかかわらず英語で表示されます。

### Web アプリと Google Drive

erd-editor.io（共同編集のセッションを含む）と Google Drive では、1 つの言語と 1 つのテーマが、アプリとその中のすべてのダイアグラムに使われます。  
どちらもスキーマや Drive のファイルではなくこのブラウザに保持され、erd-editor.io のすべてのタブで共有されます。1 つのタブで選ぶと、ほかのタブもすぐに変わります。

言語を選ぶまでは、ブラウザの優先言語に従う `System` が使われます。  
サイドバー、ゴミ箱、共同編集、Google Drive の画面など、アプリ自身のテキストも同じ言語に従い、ヘブライ語、アラビア語、ペルシア語ではアプリ全体が右から左のレイアウトになります。プライバシーポリシー、利用規約、サポートのページは英語のままです。  
エディタのパネルとクイック検索のほかに、サイドバーの最下段には `Privacy` と `Terms` のリンクの横に言語のボタンがあり、ツールチップには `Display Language` と表示されます。そのメニューには、`System` とそれが表す言語、続いて 25 の言語が並びます。

テーマは `System` で始まり、グレーカラーは `olive`、アクセントカラーは `jade` です。  
テーマビルダーとクイック検索のほかに、サイドバーの下部には `System`、`Light`、`Dark` の 3 つのアイコンボタンがあります。erd-editor.io では `Trash` の横に、Google Drive では `Sign out` の横にあります。これらはテーマビルダーと同じ外観を設定します。

### VS Code

拡張機能の設定は、VS Code の Settings の ERD Editor にあります。

| 設定 | 値 | 既定値 |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`、または[言語の表](#表示言語)のコード | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`、`light`、`dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | 6 つのグレーカラー | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 のアクセントカラー | `indigo` |

Settings エディタでは、言語の設定に `Auto` と、続いて各言語がその言語自身の名前で表示されます。`settings.json` の値がどの言語も指していない場合は、`auto` として扱われます。  
エディタでテーマを選ぶと、3 つのテーマの設定がすべて書き込まれます。選んだ内容は、その設定がすでに設定されている場所に書き込まれます。ワークスペースフォルダ、なければワークスペース、それもなければユーザー設定です。

### JetBrains IDE

Settings | Tools | ERD Editor には、`Appearance:`（`Auto`、`Light`、`Dark`）、`Gray color:`、`Accent color:`、`Display language:`（`Auto`、続いて各言語をその言語自身の名前で表示）があり、IDE 全体で保持されます。  
最初はそれぞれ `Auto`、`Slate`、`Indigo`、`Auto` です。

### Obsidian

Settings → ERD Editor には、`Appearance`（`Auto`、`Light`、`Dark`）、`Gray color`、`Accent color`、`Display language`（`Auto`、続いて各言語をその言語自身の名前で表示）があり、保管庫ごとに保持されます。  
最初はそれぞれ `Auto`、`Slate`、`Indigo`、`Auto` です。  
変更は、ポップアウトウィンドウにあるものも含め、その保管庫のすべての ERD タブに適用されます。

### 自分のページ

自分のページに置いた `<erd-editor>` では、ページが [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) と [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker) で有効にするまで、`Theme` と `Display Language` のボタンは表示されず、クイック検索にもどちらも表示されません。  
ページが言語を設定するか閲覧者が言語を選ぶまで、エディタは英語で表示され、`enableLocalePicker` がオンの間は `System` に従います。  
ページが別のテーマを設定するか [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode) をオンにしない限り、テーマは `Dark` で始まり、グレーカラーは `slate`、アクセントカラーは `indigo` です。  
閲覧者が選んだ内容はすぐに反映されますが、要素はどちらの選択も保存しません。最初の値はページが設定し、閲覧者が選んだ内容もページ自身が保存します。API の [Theme](../../api/erd-editor-element.md#theme) と [Display Language](../../api/erd-editor-element.md#display-language) を参照してください。
