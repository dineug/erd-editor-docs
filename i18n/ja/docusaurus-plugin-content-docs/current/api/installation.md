---
sidebar_position: 1
description: npm と CDN からの @dineug/erd-editor のインストール、カスタム要素の設置、ファイルダイアログの差し替え、3.x からのアップグレード。
---

# インストール

```sh
npm install @dineug/erd-editor
```

このパッケージは ESM 専用（`"type": "module"`）で、`dist` フォルダのみを配布します。
CommonJS ビルドはないため、`require('@dineug/erd-editor')` は動作しません。

ランタイム依存は、利用側のバンドラーが解決・重複排除・ツリーシェイクできるよう、bare import のまま外部に残しています。
Shared Worker は `dist/workers/` 以下に別々のエントリーファイルとして出力され、`new URL('./…', import.meta.url)` の形で生成されます。Vite、webpack 5、Rspack がワーカーのエントリーとしてバンドルする書き方です。[Web Worker](#web-workers) を参照してください。
バンドラーのないページ向けには、自己完結したビルドも用意しています。[script タグ](#script-タグ)を参照してください。

## 使い方

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` は固有のサイズを持ちません。要素またはコンテナに幅と高さを明示的に指定してください。
`4.1.0` からは、開いている[エクスプローラー](../guide/guides/explorer.md)は要素の内側で ERD キャンバスの左端にドッキングされ、キャンバスを覆うのではなく、キャンバスの幅を狭めます。新しいエディタでは、エクスプローラーは閉じた状態で始まります。
パネルは `200px` より狭くは描画されず、キャンバスには `320px` 以上の幅を残すため、幅が `520px` より狭い要素では、開いているエクスプローラーは要素の幅が広がるまで描画されません。[キャンバスの横](../guide/guides/explorer.md#beside-the-canvas)を参照してください。

`setInitialValue('')` は新しい空のドキュメントから始めます。`value` への代入は読み込みを編集として扱うため、Undo の履歴に記録されます。
`4.0.0` からは、`editor.value` はファイルが保持する形式のドキュメントで、保存するのはこちらです。`editor.runtimeValue` は、削除したエンティティも含めた、エディタが保持しているとおりのドキュメントです。共同編集の参加者に初期値を設定するためのもので、ファイルに書き込むことはありません。[runtimeValue](./erd-editor-element.md#runtimevalue) を参照してください。
`4.0.0` からは、新しいドキュメントではすべての[設定のロック](../guide/guides/settings.md#ロック)もオンになっています。対象は表示位置と拡大・縮小、タブ、Code Generator の言語、2 つの名前のケース、括弧の種類、そして `4.2.0` からは[名前の表示](../guide/guides/logical-names.md#name-view)です。スクロール、拡大・縮小、タブの切り替え、名前の表示の切り替え、その他の設定の変更をしても `editor.value` は変わらず、`change` も発行されません。テキストから読み込んだドキュメントは、そこに指定されているロックを保ちます。`4.0.0` より前に保存したファイルのように何も指定されていないドキュメントは、保存した表示位置とタブにかかわらず、すべてのロックがオンで、拡大・縮小が 100%、ERD タブの状態で開きます。その表示位置は原点 `0, 0` でロックされ、そこにダイアグラムが何も描かれていない場合は、画面は代わりにダイアグラムが見える位置で開きます。[setInitialValue](./erd-editor-element.md#setinitialvalue) を参照してください。
`4.2.0` より前に保存したファイルは、他のロックがすべてオフのものでも、名前の表示が `Physical Names` でロックされた状態で開きます。`4.0.0` または `4.1.0` のエディタは、保存しても名前の表示のロックはそのまま保ちますが、表示そのものは保持しません。そのため、名前の表示のロックをオフにして保存した `4.2.0` のファイルは、ロックはオフのままですが、開き直すと `Physical Names` になります。
残りの API については [ErdEditorElement](./erd-editor-element.md) を参照してください。

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` がパッケージの外部依存を解決してくれるため、バンドラーなしでも動作します。
バージョンを指定しない URL は常に最新のリリースを配信します。メジャーアップグレードが予告なくページに反映されるのを避けたい場合は、`https://esm.run/@dineug/erd-editor@4.2.0` のようにバージョンを固定します。
`4.0.0` 自体がメジャーアップグレードです。3.x にとどまる必要があるページは `@3.10.0` に固定します。[3.x からのアップグレード](#3x-からのアップグレード)を参照してください。

### script タグ

`3.6.0` からは、すべての依存とすべての Shared Worker を 1 つのファイルに収めた UMD ビルドも配布しています。
`unpkg` と `jsdelivr` のフィールドがこのファイルを指しているため、どちらの CDN でもパッケージ名だけの URL がこのファイルを配信し、`window.ErdEditor` を定義します。

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

読み込むと `<erd-editor>` が同じように登録され、`window.ErdEditor` に 2 つのファイルコールバック `ErdEditor.setExportFileCallback` と `ErdEditor.setImportFileCallback`、そして `3.9.2` からは `ErdEditor.createKeyBindingMap` が入っています。`4.2.0` からは `ErdEditor.dictionaryRowChords` も入っています。[dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) を参照してください。
exports マップは引き続き ES モジュールを指しているため、npm からインストールした場合にこのファイルが使われることはありません。

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

`4.0.0` からは、`enable-locale-picker` はツールバーに `Display Language` のピッカーを、`enable-welcome-screen` は空のダイアグラムに表示されるウェルカム画面を追加します。[enableLocalePicker](./erd-editor-element.md#enablelocalepicker) と [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen) を参照してください。
[使い方](#使い方)のようにドキュメントを読み込むページでは、`enableWelcomeScreen` をマークアップではなく、`setInitialValue()` で読み込んだ後に有効にします。そうすれば、読み込み中のファイルの上にウェルカム画面が一瞬表示されることはありません。
25 の表示言語はすべて、ES ビルドにも script タグのビルドにも同じようにパッケージの中に入っているため、配信するロケールファイルも登録するものもありません。ピッカーも `setLocale()` の呼び出しもない場合、エディタは英語で表示されます。

ここで `readonly` を付けると編集できなくなります。`value` への代入、`clear()` の呼び出し、`setSchemaJSON()` や追加の読み込みを含むすべての `setSchema*()` の呼び出しは無視され、`change` イベントも発行されません。`editor.value` と `editor.runtimeValue` の読み取りは引き続き動作します。読み込みには代わりに `setInitialValue()` を使用します。

### サーバーサイドレンダリング

パッケージを読み込むとモジュールスコープでカスタム要素を登録するため、DOM が必要であり、Node では例外が発生します。
Next.js、Nuxt、SvelteKit、Astro では、クライアント側でのみ実行される経路から読み込みます。

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript

パッケージを読み込むと `erd-editor` が `HTMLElementTagNameMap` に統合されるため、キャストなしで型が付きます。

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` は、独自の変数や props に型を付けるためにエクスポートしています。
`4.0.0` からは、`LocaleCode`、`LocaleOption`、`SchemaSQLOptions` の型もエクスポートしています。[エントリーポイント](#エントリーポイント)を参照してください。`setSchema*()` メソッドが受け取るオプションにはエクスポートされた名前がないため、`Parameters<ErdEditorElement['setSchemaSQL']>[1]` のように要素から取り出します。

## 構文ハイライト

Schema SQL と Code Generator のパネルは、専用の Shared Worker で動く [Shiki](https://shiki.style) がハイライトします。`4.0.0` からは、Schema SQL タブの `Before tables` と `After tables` のスクリプトも同様です。
`3.7.0` からは、インストールするものも登録するものもありません。ワーカーは最初にコードパネルが描画されたときに作られるため、コードパネルを開かないページが文法定義を取得することはありません。

| | |
| --- | --- |
| 言語 | SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go、Python、PHP、Rust、Swift、JSON、Mermaid |
| テーマ | `github-dark` と `github-light`。エディタのライト / ダークの外観に従います |

これはパネルが実際に出力する言語そのものです。`JPA` は Java、`SQLAlchemy` は Python、`TypeORM`、`Sequelize`、`Drizzle`、`Zod` は TypeScript、`Doctrine` は PHP、`SeaORM` は Rust、`JSON Schema` は JSON としてハイライトされ、`DBML` と `AML` はバンドルにある中で最も近い文法である SQL としてハイライトされます。[コード生成](../guide/guides/code-generator.md)を参照してください。

正規表現エンジンは純粋な JavaScript のため、ホストのポリシーに `wasm-unsafe-eval` は必要ありません。
`SharedWorker` がない環境、つまり Android の Chrome や 16.4 より前の Safari では、失敗がログに残り、コードはプレーンテキストとして表示されます。スクリプトは引き続き編集できます。

`3.6.0` 以前からの移行について。`@dineug/erd-editor-shiki-worker` は公開されなくなり、`setGetShikiServiceCallback` もなくなりました。
インストールと登録のコードは削除してください。CDN からワーカーを読み込んでいたページは、2 つ目の `<script>` タグも削除します。

## Web Worker {#web-workers}

エディタは 3 つの処理を `SharedWorker` で実行します。構文ハイライト、画像の書き出し、そして[自動レイアウト](../guide/guides/table-related-functions.md#auto-layout)、Visualization タブの [Flow モード](../guide/guides/visualization.md#how-flow-is-placed)、`4.0.0` からは読み込んだスキーマの配置を支えるテーブルのレイアウトです。
3 つとも `@dineug/erd-editor` に入っています。どれも設定するものではありませんが、ホスト側で塞げるものでもあります。
ドキュメントのガベージコレクションを実行していたワーカーは、ガベージコレクション自体とともに `4.0.0` で削除されました。

| ワーカー | ない場合 |
| --- | --- |
| 構文ハイライト | Schema SQL と Code Generator のパネル、Schema SQL のスクリプトがプレーンテキストのままになります |
| 画像の書き出し | PNG、SVG、`Copy to clipboard`、`Export image` ダイアログのプレビューをメインスレッドで描画するため、描画中はページが止まります |
| テーブルのレイアウト | 自動レイアウトの `Flow`、`Tree - vertical`、`Tree - horizontal` の配置と、Visualization タブの Flow モードが `Could not place tables` で終わります。Flow で配置する読み込み、つまり `Import` または `Import and Add` からの SQL、GraphQL、DBML、AML のファイルや、`placement: 'auto'` を指定した `setSchema*()` の呼び出しでは、メッセージなしでテーブルが複数の行に並べて配置されます。`Force` と Graph モードはエディタ内で動くため影響を受けません |

画像の書き出しはワーカーの応答を 10 秒待ってからメインスレッドで描画し、構文ハイライトはワーカーが失敗した時点でコードをプレーンテキストのままにするため、ワーカーを塞ぐホストでは機能が失われるのではなく性能だけが落ちます。
テーブルのレイアウトだけは例外です。レイアウトを計算するエンジンがエディタ本体より大きく、インプロセスに載せることはないため、最初の配置ではワーカーを 30 秒待ち、ワーカーが応答した後は、レイアウトが戻ってくるまで 60 秒待ちます。
どちらかの待ち時間が過ぎると、配置はワーカーがない場合と同じように終わります。自動レイアウトは開始するとすぐに `Placing tables` を表示しますが、Flow モードと Flow で配置する読み込みでは、ワーカーの起動を含めて配置が 6 秒続いたときに初めて表示します。

バンドル向けのビルドでは 3 つとも別ファイルとして一緒に配布されるため、CSP が厳しいページでは `worker-src 'self'` が必要です。バンドラーがワーカーをインライン化する場合は `blob:` も必要になります。
[script タグ](#script-タグ)のビルドでは 3 つとも `data:` URL としてファイルの中に入るため、そのページでは `worker-src data:` が必要です。

## エントリーポイント

`@dineug/erd-editor` を読み込むと、副作用として `<erd-editor>` を登録します。それ以外には、要素の型、2 つのコールバック設定関数、`3.9.2` からは既定のキーバインディングとその型、`4.0.0` からは表示言語の型と `getSchemaSQL()` のオプションの型、そして `4.2.0` からは辞書タブの行のキーの組み合わせをエクスポートしています。

| エクスポート | 説明 |
| --- | --- |
| `ErdEditorElement`（型） | 要素のインターフェースです。[ErdEditorElement](./erd-editor-element.md) を参照してください。 |
| `setExportFileCallback(cb)` | ブラウザのダウンロードを置き換えます。`(blob, { fileName }) => void` です。 |
| `setImportFileCallback(cb)` | ブラウザのファイル選択を置き換えます。`({ type, op, accept, mode }) => void` です。`mode` は `4.0.0` からです。`4.2.0` からは、辞書タブの `Import CSV` は、コールバックを設定していてもブラウザのファイル選択を開きます。[ファイルダイアログ](#ファイルダイアログ)を参照してください。 |
| `createKeyBindingMap()` | 既定のキーバインディングを、呼び出すたびに新しい `KeyBindingMap` として返します。[createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) を参照してください。 |
| `KeyBindingMap`、`KeyBindingName`、`ShortcutOption`（型） | バインディングのマップ、そのコマンド名のユニオン、1 つのバインディングです。 |
| `dictionaryRowChords(map)` | `4.2.0` から。渡した `KeyBindingMap` のもとで[辞書](../guide/guides/dictionary.md#adding-and-deleting-rows)タブのグリッドが行を挿入・削除するキーの組み合わせを、呼び出すたびに新しい `ShortcutOption[]` として返します。上に行を挿入する組み合わせ（既定では `Alt+Shift+Enter`）は、どのバインディングにも含まれません。[dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) を参照してください。 |
| `LocaleCode`、`LocaleOption`（型） | `4.0.0` から。25 の表示言語のコードと、`setLocale()` が受け取る、そのコードに `'system'` を加えたものです。[Display Language](./erd-editor-element.md#display-language) を参照してください。 |
| `SchemaSQLOptions`（型） | `4.0.0` から。`getSchemaSQL()` が受け取るオプションで、`statements`、`header`、そして `4.2.0` からは `logicalNameAsComment` があります。[getSchemaSQL](./erd-editor-element.md#getschemasql) を参照してください。 |

`@dineug/erd-editor/engine.js` は 2 つ目のエントリーポイントです。DOM なしでドキュメントの store を動かすため、Web Worker でも動作します。[リモート保存](./advanced/remote-storage.md)を参照してください。
`createReplicationStore` と `ReplicationStore` 型をエクスポートしています。`3.10.0` からは、レプリカの `change` リスナーが受け取る `ReplicationChange` 型 `{ value: string; changed: boolean }` もエクスポートしています。[on@change](./advanced/remote-storage.md#onchange) を参照してください。
`4.0.0` からは、`ReplicationStore` に `runtimeValue` もあります。その `value` と `change` が渡す `value` は、要素のものと同じく、ファイルが保持する保存形式です。[ReplicationStore](./advanced/remote-storage.md#replicationstore) を参照してください。

`3.9.1` からは 3 つ目のエントリーポイント `@dineug/erd-editor/peer.js` があります。[MCP サーバー](../mcp/introduction.md)がドキュメントを編集するときに経由するヘッドレスなピアです。このサーバーのためのもので、これらのページでは説明していません。

### ファイルダイアログ

読み込みと書き出しは差し替え可能なコールバックを経由するため、ブラウザのファイルダイアログを持たないホスト、例えば IDE の Webview でも独自の実装を渡せます。
2 つは対称ではありません。書き出しは完成したファイルを渡しますが、読み込みはファイルを要求するだけで、内容は自分でエディタに渡します。
`4.2.0` からは、辞書タブの `Import CSV` は、読み込みのコールバックを一切呼ばない唯一の読み込みです。このコールバックの `type` には CSV の値がありません。`Import CSV` は常にブラウザ自身のファイル選択を `.csv` ファイル向けに開きます。[CSV の読み込みと書き出し](../guide/guides/dictionary.md#importing-and-exporting-csv)を参照してください。

`op` は `set` または `diff` です。`diff` の場合は `type` に関係なく `setDiffValue()` に渡します。それ以外では `type` がメソッドを決め、`accept` にはその型の拡張子が入っているため、そのままホストのファイルダイアログに渡せます。
`4.0.0` からは、ユーザーが [Import and Add](../guide/guides/file-import-export.md#import-and-add) を選んだ場合は `set` に `mode: 'append'` が付き、通常の Import では `mode` は付きません。`mode` はそのまま渡してください。渡さないコールバックでは、ユーザーがファイルを追加しようとしたダイアグラムが置き換えられてしまいます。

| `type` | `accept` | メソッド |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` は、エディタ自身の Import と同じように、テーブルを置く前にリレーションシップに沿って配置し、呼び出しが Promise を返すようにします。指定しない場合、テーブルはすぐに複数の行に並べて配置されます。[setSchemaSQL](./erd-editor-element.md#setschemasql) と [setSchemaJSON](./erd-editor-element.md#setschemajson) を参照してください。

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

処理する `type` ごとに分岐し、それ以外は無視します。
置き換えを行う `setSchemaJSON()` は、`value` への代入と同じく、パースの前にドキュメントを消去します。そのため、`.erd.json` ドキュメントではないデータを、包括的な `else` や、後から追加された `type` が漏れたことによってそこに渡すと、何も読み込まれずにダイアグラムが空になります。

エディタが生成する `fileName` は `<database name>-<timestamp>` にファイルの拡張子を付けたもので、タイムスタンプはローカル時刻で `yyyy-MM-dd'T'HH_mm_ss` の形式です。データベース名が空の場合は `unnamed` になります。辞書の CSV では、`<database name>-<timestamp>-words.csv` のように、拡張子の前にシート名が入ります。
書き出しのコールバックは次のファイルを受け取ります。`4.0.0` からは SVG と Code Generator のファイルも含まれ、`.sql` は `Export` から直接ではなく、Schema SQL タブの `Save file` から届きます。`4.2.0` からは辞書タブの CSV も含まれます。

| ファイル | 拡張子 | Blob の `type` |
| --- | --- | --- |
| JSON の書き出し | `.erd.json` | `application/json` |
| タブに表示されているテキストを保存する、Schema SQL タブの `Save file`。[Schema SQL](../guide/guides/schema-sql.md) を参照してください | `.sql` | なし |
| [Export image](../guide/guides/file-import-export.md#画像) ダイアログ | `.png` または `.svg` | `image/png` または `image/svg+xml` |
| Code Generator タブの `Save file`。[コード生成](../guide/guides/code-generator.md)を参照してください | 言語ごとの拡張子。`.cs`、`.go`、`.java`、`.kt`、`.php`、`.rs`、`.scala`、`.swift`、`.ts`、`.py`、`.aml`、`.dbml`、`.graphql`、`.json`、`.mmd` のいずれかです | なし |
| 検索で表示されている行にかかわらず、表示中のシートのすべての行を収めた、辞書タブの `Export CSV`。[CSV の読み込みと書き出し](../guide/guides/dictionary.md#importing-and-exporting-csv)を参照してください | `.csv` | `text/csv` |

拡張子でハンドラーを選ぶホストには、そのそれぞれに対するハンドラーが必要です。

設定しない場合、エディタはブラウザ自身のダウンロードとファイル選択の動作を使用します。`null` を渡すと元の動作に戻ります。

## 対応ブラウザ

Chrome 91+、Edge 94+、Firefox 93+、Safari 16.4+ に対応しています。公開しているバンドルのビルド対象である ES2022 を基準にしています。
ポリフィルは同梱していません。より古いブラウザに対応する必要がある場合は、自分で追加します。

## 3.x からのアップグレード

`4.0.0` はメジャーリリースです。ページを 3.x から移行するときは、次の各項目を確認してください。

- `editor.value`、レプリカの `value`、その `change` が渡す `value` は、ファイルが保持する保存形式です。削除したエンティティ、計測した幅、重なり順、リレーションシップの接続位置は含まれません。引き続き `value` を保存し、これらは `runtimeValue` から読み取ります。エンティティのタイムスタンプ（`meta`）は完全になくなりました。共同編集の参加者や、進行中のセッションに参加するレプリカには、`value` やファイルではなく、すでにセッションにいるピアの `runtimeValue` で初期値を設定し、`runtimeValue` は決して保存しないでください。[value](./erd-editor-element.md#value) と [runtimeValue](./erd-editor-element.md#runtimevalue) を参照してください。
- `Save Scroll Information` と `Save Zoom Information` は設定のロックに置き換わりました。新しいドキュメントと、`4.0.0` より前に保存したすべてのドキュメントではすべてのロックがオンのため、スクロール、拡大・縮小、タブの切り替え、Code Generator の言語、名前のケース、括弧の種類の変更をしても、`value` は変わらず、`change` も発行されません。`change` を通じて表示を保存していたページでは、設定タブで `Viewport`（タブも保存する場合は `Canvas Type` も）のロックをオフにするか、`settings.lockSettings` でそれらのビットが立っていないドキュメントを使う必要があります。[ロック](../guide/guides/settings.md#ロック)を参照してください。
- `settings` から `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization`、`ignoreSaveSettings` がなくなり、`SaveSettingType` の定数も削除されました。`ignoreSaveSettings` の代わりに、`LockSettingType` のビットを持つ `settings.lockSettings` を使います。`4.0.0` 以降は `ignoreSaveSettings` を読み取りも書き込みもしません。[Settings](./advanced/schema.md#settings) を参照してください。
- 各ファイルが `$schema` で指定する [JSON Schema](./advanced/schema.md#json-schema) は、保存形式だけを記述し、それ以外を認めない閉じたスキーマになりました。以前のリリースで保存したファイルは、`4.0.0` 以降で保存して書き直されるまで、このスキーマで拒否されます。
- ドキュメントのガベージコレクションはそのワーカーとともになくなったため、削除したエンティティは、次にドキュメントをファイルから開くまで `runtimeValue` に残ります。残る Shared Worker は 3 つです。[Web Worker](#web-workers) を参照してください。
- 共有セッション内のすべてのエディタとレプリカは `4.0.0` 以降にそろえてください。以前のリリースは、テーブルグループ、Map Columns、ロック、Schema SQL のスクリプトの新しいアクションの種類を無視します。[リリースの混在](./advanced/collaborative-editing.md#リリースの混在)を参照してください。
- 読み込みのコールバックは Import and Add で `mode: 'append'` を受け取るため、コールバックはそれをそのまま渡す必要があります。書き出しのコールバックは `.svg` と Code Generator のファイルも受け取るようになり、`Export` ▸ `Schema SQL` は保存せずに Schema SQL タブを開くため、`.sql` はそのタブの `Save file` からのみ届きます。[ファイルダイアログ](#ファイルダイアログ)を参照してください。
- `Delete` と `Backspace` は新しい `removeSelection` に割り当てられています。エディタにフォーカスがあり、テキストフィールドの外にある間は、どのタブでもキーの既定の動作が抑止され、ERD タブでは選択しているものが削除されます。`KeyBindingName` と `KeyBindingMap` にはこれが加わり、`setKeyBindingMap({ removeSelection: [] })` で両方のキーをページに任せられます。[setKeyBindingMap](./erd-editor-element.md#setkeybindingmap) を参照してください。
- `ThemeOptions.appearance` は `'system'` も受け取ります。テーマビルダーの `System` にあたり、`systemDarkMode` をオンにするとこの値になります。`changePresetTheme` は `System` を選んでいる間 `'system'` を報告するため、そのまま保存し、そのまま `setPresetTheme` に渡します。`systemDarkMode` がオンの間に `'light'` または `'dark'` を指定した `setPresetTheme()` は、次の OS の切り替えで上書きされず、そのまま保たれるようになりました。[systemDarkMode](./erd-editor-element.md#systemdarkmode) と [changePresetTheme](./erd-editor-element.md#changepresettheme) を参照してください。
- `@dineug/erd-editor-mcp` `1.0.0` 以降、VS Code の拡張機能 `4.0.0` 以降、Obsidian と JetBrains のプラグイン `1.0.0` 以降は、ハブのプロトコル 2 を使います。サーバー `1.0.0` 以降とエージェントに対応する以前のエディタのリリース、または以前のサーバーとこれらのエディタは、`protocolMismatch` で互いを拒否し、更新が必要な側を示します。[アップデート](../mcp/installation.md#アップデート)を参照してください。
- バージョンを指定しない CDN の URL は最新の 4.x リリースを配信するようになりました。3.x にとどまるには `@3.10.0` に固定します。[CDN](#cdn) を参照してください。
