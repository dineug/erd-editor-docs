---
sidebar_position: 1
description: npm と CDN からの @dineug/erd-editor のインストール、エディタ要素とビューアー要素の登録、ファイルダイアログの差し替え、4.x と 3.x からのアップグレード。
---

# インストール

```sh
npm install @dineug/erd-editor
```

このパッケージは ESM 専用（`"type": "module"`）で、`dist` フォルダのみを配布します。
CommonJS ビルドはないため、`require('@dineug/erd-editor')` は動作しません。

2 つのカスタム要素が入っています。エディタの `<erd-editor>` と、`5.0.0` からはダイアグラムを読み取り専用で表示する `<erd-viewer>` です。[ErdViewerElement](./erd-viewer-element.md) を参照してください。
`5.0.0` からは、パッケージのルートを読み込んでもどちらも定義されません。それぞれの要素に、それを定義する専用のエントリーがあります。[要素の登録](#registering-the-elements)を参照してください。

ランタイム依存は、利用側のバンドラーが解決・重複排除・ツリーシェイクできるよう、bare import のまま外部に残しています。`5.0.0` からは `dist` がモジュールごとに 1 つのファイルを持つため、バンドラーはページが到達するモジュールだけを残します。[エントリーポイント](#エントリーポイント)を参照してください。
Shared Worker は `dist/workers/` 以下に別々のエントリーファイルとして出力され、`new URL('./…', import.meta.url)` の形で生成されます。Vite、webpack 5、Rspack がワーカーのエントリーとしてバンドルする書き方です。[Web Worker](#web-workers) を参照してください。
バンドラーのないページ向けには、自己完結したビルドが 2 つあります。[script タグ](#script-タグ)を参照してください。

## 使い方

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` は、読み込まれると `<erd-editor>` を定義します。ダイアグラムを表示するだけのページは、代わりに `@dineug/erd-editor/erd-viewer.js` を読み込みます。[ErdViewerElement](./erd-viewer-element.md) を参照してください。

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
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` がパッケージの外部依存を解決してくれるため、バンドラーなしでも動作します。
各エントリーには、バージョンの後ろのパスで到達します。`…/erd-editor.js` はエディタを、`…/erd-viewer.js` はビューアーを定義し、ビューアーは英語以外の各表示言語を、ページが求めたときに CDN から取得します。パッケージ名だけの URL `https://esm.run/@dineug/erd-editor@5.0.0` はルートを配信し、ルートは要素を定義しません。
バージョンを指定しない URL は常に最新のリリースを配信します。メジャーアップグレードが予告なくページに反映されるのを避けたい場合は、上のようにバージョンを固定します。
`5.0.0` 自体がメジャーアップグレードです。4.x にとどまる必要があるページは `@4.2.0` に固定します。[4.x からのアップグレード](#upgrading-from-4x)を参照してください。

`esm.run` は Shared Worker を `cdn.jsdelivr.net` から配信しますが、ブラウザはページと異なるオリジンから Shared Worker を起動しません。そのため、この方法で読み込んだエディタは、ホストがワーカーを塞いでいる場合と同じように、ワーカーなしで動作します。[Web Worker](#web-workers) を参照してください。[script タグ](#script-タグ)のビルドは、ワーカーをファイルの中に収めています。

### script タグ

`3.6.0` からは、すべての依存とすべての Shared Worker を 1 つのファイル `dist/erd-editor.umd.js` に収めた UMD ビルドも配布しています。
`unpkg` と `jsdelivr` のフィールドがこのファイルを指しているため、どちらの CDN でもパッケージ名だけの URL がこのファイルを配信し、`window.ErdEditor` を定義します。

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

読み込むと `<erd-editor>` が定義されます。`window.ErdEditor` に入っているのは、2 つのファイルコールバック `ErdEditor.setExportFileCallback` と `ErdEditor.setImportFileCallback`、`3.9.2` からは `ErdEditor.createKeyBindingMap`、`4.2.0` からは `ErdEditor.dictionaryRowChords`（[dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) を参照してください）、そして `5.0.0` からは `ErdEditor.ErdEditorElement` と `ErdEditor.defineErdEditor`（[要素の登録](#registering-the-elements)を参照してください）です。[toImage](./to-image.md) は入っていません。

`5.0.0` からは 2 つ目のファイル `dist/erd-viewer.umd.js` が `<erd-viewer>` を定義し、`ErdViewerElement` と `defineErdViewer` を `window.ErdViewer` に置きます。ワーカーは起動せず、25 の表示言語をすべて収めていて、渡された `src` 以外は何も要求しません。

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

どちらのファイルも、もう一方のタグは定義せず、ページに残すグローバルは自身のものと `window.Konva` だけです。
exports マップは引き続き ES モジュールを指しているため、npm からインストールした場合にどちらのファイルも使われることはありません。
独自のスクリプトを読み込めないページは、代わりに erd-editor.io/embed でホストされているビューアーをフレームで表示できます。[埋め込み](../guide/guides/embedding.md)を参照してください。

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
エディタは 25 の表示言語をすべて持っています。ES ビルドにも script タグのビルドにも同じように入っているため、配信するロケールファイルも登録するものもありません。ピッカーも `setLocale()` の呼び出しもない場合、エディタは英語で表示されます。

ここで `readonly` を付けると、エディタは閲覧用として開きます。`value` への代入、`clear()` の呼び出し、`setSchemaJSON()` や追加の読み込みを含むすべての `setSchema*()` の呼び出しは無視され、`change` イベントも発行されません。タブ、エクスプローラー、クイック検索は閲覧用に残り、ダイアグラムを編集するコントロールはなくなります。
`editor.value` と `editor.runtimeValue` の読み取りは引き続き動作し、どちらもドキュメント自身の設定を保ちます。閲覧者が変更する拡大・縮小やデータベースのような表示の設定は、そのエディタの画面にとどまります。読み込みには代わりに `setInitialValue()` を使用します。[readonly](./erd-editor-element.md#readonly) を参照してください。

### サーバーサイドレンダリング

`engine.js` と `peer.js` 以外のエントリーはどれも DOM が必要で、Node では例外が発生します。`erd-editor.js` と `erd-viewer.js` はモジュールスコープで要素を定義し、`5.0.0` から何も定義しないパッケージのルートも、読み込み時に両方の要素クラスを構築します。
Next.js、Nuxt、SvelteKit、Astro では、要素のエントリーをクライアント側でのみ実行される経路から読み込み、ルートからの名前付きインポート（`setExportFileCallback` や `toImage` など）も同じ経路から読み込みます。

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

開発時には、エディタのレイアウトワーカーがインポートする ELK のバンドルを Vite の事前バンドルに加えてください。加えないと、そのワーカーが行うレイアウト、つまり自動レイアウトの `Flow`、`Tree - vertical`、`Tree - horizontal`、Visualization タブの Flow モード、Flow で配置する読み込みが失敗します。
Vite 7 以前では、エディタを事前バンドルから外す設定も必要です。その事前バンドルはワーカーの URL を、書き出されないファイルに向けてしまうため、3 つのワーカーがすべて失敗します。Vite 8 ではこの `exclude` を外してください。残すと、開発サーバーがパッケージのファイルを 1 つずつ取得するだけになります。本番ビルドにはどちらも必要ありません。

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript

`@dineug/erd-editor/erd-editor.js` を読み込むと `erd-editor` が、`@dineug/erd-editor/erd-viewer.js` を読み込むと `erd-viewer` が `HTMLElementTagNameMap` に統合されるため、キャストなしで型が付きます。ルートからのインポートは、型だけのものも含めて、両方を取り込みます。

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` は、独自の変数や props に型を付けるためにエクスポートしています。`5.0.0` からは要素のクラスでもあり、`ErdViewerElement` はビューアーのインターフェースとクラスです。[要素の登録](#registering-the-elements)を参照してください。
`4.0.0` からは、`LocaleCode`、`LocaleOption`、`SchemaSQLOptions` の型、`5.0.0` からは `ToImageOptions` もエクスポートしています。[エントリーポイント](#エントリーポイント)を参照してください。`setSchema*()` メソッドが受け取るオプションにはエクスポートされた名前がないため、`Parameters<ErdEditorElement['setSchemaSQL']>[1]` のように要素から取り出します。
`5.0.0` からは、パッケージの `typesVersions` が、exports マップを読まない `moduleResolution: "node10"` でも、各サブパスのエントリーに型を付けます。

## 要素の登録 {#registering-the-elements}

`5.0.0` からは、パッケージはページが求めた場所でだけタグを定義します。

| インポート | 定義するもの |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | なし |

この 2 つのエントリーはそれぞれ、評価されるときに自身のタグを定義し、何もエクスポートしないため、副作用のためにインポートします。どちらももう一方のタグは定義しません。
ルートは、2 つの要素クラス `ErdEditorElement` と `ErdViewerElement`、そして呼び出した場所でタグを定義する `defineErdEditor()` と `defineErdViewer()` をエクスポートします。

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

呼び出しは、そのタグがすでにそのクラスを持っている間は何もしないため、エントリーと define 関数の呼び出し、または 2 つの define 関数の呼び出しを 1 つのページで併用できます。別のクラスがそのタグを持っている場合、たとえば同じページにバンドルされたパッケージの 2 つ目のコピーが定義していた場合は、タグ名を含む `Error` を投げます。`Another element class already defines the custom element name erd-editor` です。
ルートのクラスはエントリーが定義するクラスと同じため、どちらかが実行された後は `customElements.get('erd-editor') === ErdEditorElement` になります。タグが定義されるまでは、`document.createElement('erd-editor')` はエディタのメンバーを持たない通常の `HTMLElement` を作り、`new ErdEditorElement()` は例外を投げます。

独自のタグを使うには、そのタグでクラスを自分で定義し、タグを `HTMLElementTagNameMap` にも自分で追加します。クラスが 1 つのウィンドウで持てる名前は 1 つだけなので、その要素のエントリーも [script タグ](#script-タグ)のビルドも読み込まず、その要素の define 関数も呼ばないウィンドウで行ってください。

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

両方の要素を含むバンドルでは、Vite と Rolldown が、英語以外の表示言語ごとに 1 回ずつ `INEFFECTIVE_DYNAMIC_IMPORT` の警告を出します。ビューアーはそれぞれを独自の `import()` で読み込みますが、エディタはすべての辞書を一度にインポートするため、それらはエディタのチャンクに残り、エディタと一緒に読み込まれます。失敗することはなく、ビューアーだけのバンドルでは、各言語は独自のチャンクに残ります。

## 構文ハイライト

Schema SQL と Code Generator のパネルは、専用の Shared Worker で動く [Shiki](https://shiki.style) がハイライトします。`4.0.0` からは、Schema SQL タブの `Before tables` と `After tables` のスクリプトも同様です。
`3.7.0` からは、インストールするものも登録するものもありません。ワーカーは最初にコードパネルが描画されたときに作られるため、コードパネルを開かないページが文法定義を取得することはありません。

| | |
| --- | --- |
| 言語 | SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go、Python、PHP、Rust、Swift、JSON、Mermaid |
| テーマ | `github-dark` と `github-light`。エディタのライト / ダークの外観に従います |

これはパネルが実際に出力する言語そのものです。`JPA` は Java、`SQLAlchemy` は Python、`TypeORM`、`Sequelize`、`Drizzle`、`Zod` は TypeScript、`Doctrine` は PHP、`SeaORM` は Rust、`JSON Schema` は JSON としてハイライトされ、`DBML` と `AML` はバンドルにある中で最も近い文法である SQL としてハイライトされます。[コード生成](../guide/guides/code-generator.md)を参照してください。

正規表現エンジンは純粋な JavaScript のため、ホストのポリシーに `wasm-unsafe-eval` は必要ありません。
`SharedWorker` がない環境、つまり Chrome 148 より前の Android の Chrome や 16.4 より前の Safari では、失敗がログに残り、コードはプレーンテキストとして表示されます。スクリプトは引き続き編集できます。

`3.6.0` 以前からの移行について。`@dineug/erd-editor-shiki-worker` は公開されなくなり、`setGetShikiServiceCallback` もなくなりました。
インストールと登録のコードは削除してください。CDN からワーカーを読み込んでいたページは、2 つ目の `<script>` タグも削除します。

## Web Worker {#web-workers}

エディタは 3 つの処理を `SharedWorker` で実行します。構文ハイライト、画像の書き出し、そして[自動レイアウト](../guide/guides/table-related-functions.md#auto-layout)、Visualization タブの [Flow モード](../guide/guides/visualization.md#how-flow-is-placed)、`4.0.0` からは読み込んだスキーマの配置を支えるテーブルのレイアウトです。
3 つとも `@dineug/erd-editor` に入っています。どれも設定するものではありませんが、ホスト側で塞げるものでもあります。
`5.0.0` からは、各ワーカーが専用のモジュールで生成されるため、バンドルにはそのモジュールが到達するワーカーだけが入ります。[toImage](./to-image.md) だけで要素を含まないバンドルには画像の書き出しワーカーだけが入り、`<erd-viewer>` はワーカーをまったく起動しません。[エントリーポイント](#エントリーポイント)を参照してください。
ドキュメントのガベージコレクションを実行していたワーカーは、ガベージコレクション自体とともに `4.0.0` で削除されました。

| ワーカー | ない場合 |
| --- | --- |
| 構文ハイライト | Schema SQL と Code Generator のパネル、Schema SQL のスクリプトがプレーンテキストのままになります |
| 画像の書き出し | PNG、SVG、`Copy to clipboard`、`Export image` ダイアログのプレビュー、そして `5.0.0` からは [toImage()](./to-image.md) をメインスレッドで描画するため、描画中はページが止まります |
| テーブルのレイアウト | 自動レイアウトの `Flow`、`Tree - vertical`、`Tree - horizontal` の配置と、Visualization タブの Flow モードが `Could not place tables` で終わります。Flow で配置する読み込み、つまり `Import` または `Import and Add` からの SQL、GraphQL、DBML、AML のファイルや、`placement: 'auto'` を指定した `setSchema*()` の呼び出しでは、メッセージなしでテーブルが複数の行に並べて配置されます。`Force` と Graph モードはエディタ内で動くため影響を受けません |

画像の書き出しはワーカーの応答を 10 秒待ってからメインスレッドで描画し、構文ハイライトはワーカーが失敗した時点でコードをプレーンテキストのままにするため、ワーカーを塞ぐホストでは機能が失われるのではなく性能だけが落ちます。
テーブルのレイアウトだけは例外です。レイアウトを計算するエンジンがエディタ本体より大きく、インプロセスに載せることはないため、最初の配置ではワーカーを 30 秒待ち、ワーカーが応答した後は、レイアウトが戻ってくるまで 60 秒待ちます。
どちらかの待ち時間が過ぎると、配置はワーカーがない場合と同じように終わります。自動レイアウトは開始するとすぐに `Placing tables` を表示しますが、Flow モードと Flow で配置する読み込みでは、ワーカーの起動を含めて配置が 6 秒続いたときに初めて表示します。

Vite、webpack 5、Rspack は、ワーカーをチャンクの隣のファイルとして出力します。esbuild と、Vite を経由せず単独で使う Rolldown は何も出力しないため、それらでビルドしたページはワーカーなしで動作します。
webpack の実験的な `experiments.outputModule` では、各ワーカーが、そこから分割された、何も読み込まないチャンクを待つため、どのワーカーも起動しません。webpack の既定の出力のままにするか、`optimization.splitChunks: false` を設定してください。

### Content Security Policy {#content-security-policy}

厳しい Content Security Policy のもとにあるページでは、要素のために次のディレクティブが必要です。

- バンドル向けのビルドには `worker-src 'self'` が必要です。ワーカーはパッケージの隣のファイルになるためで、バンドラーがワーカーをインライン化する場合は `blob:` も必要になります。[script タグ](#script-タグ)のビルドでは 3 つとも `data:` URL としてファイルの中に入るため、そのページでは代わりに `worker-src data:` が必要です。`<erd-viewer>` はワーカーを起動しないため、どちらも不要です。
- `5.0.0` からは、どちらの要素も constructed stylesheet で自身のスタイルを設定し、`style-src 'self'` で通ります。エディタのコードパネルは引き続き `style` 属性でテキストに色を付け、`Export image` ダイアログのプレビューは `blob:` URL の画像なので、エディタにはこれらのために `style-src 'unsafe-inline'` と `img-src blob:` も必要です。
- Firefox 101 より前のような constructed stylesheet のないブラウザでは、代わりに `<style>` 要素が使われ、どちらの要素でも `style-src 'unsafe-inline'` が必要です。
- `<erd-viewer>` は `src` を取得するため、そのオリジンを `connect-src` に入れてください。[ページに加わるもの](./erd-viewer-element.md#what-it-adds-to-a-page)を参照してください。

## エントリーポイント

パッケージには 5 つのエントリーがあります。

| エントリー | 内容 |
| --- | --- |
| `@dineug/erd-editor` | ルートです。以下のエクスポートがあります。`5.0.0` からは要素を定義しませんが、読み込むには DOM が必要です |
| `@dineug/erd-editor/erd-editor.js` | `5.0.0` から。`<erd-editor>` を定義し、何もエクスポートしません |
| `@dineug/erd-editor/erd-viewer.js` | `5.0.0` から。`<erd-viewer>` を定義し、何もエクスポートしません |
| `@dineug/erd-editor/engine.js` | DOM のないドキュメントの store です |
| `@dineug/erd-editor/peer.js` | `3.9.1` から。MCP サーバーのヘッドレスなピアです |

ルートは、2 つの要素クラスとその define 関数、2 つのコールバック設定関数、`3.9.2` からは既定のキーバインディングとその型、`4.0.0` からは表示言語の型と `getSchemaSQL()` のオプションの型、`4.2.0` からは辞書タブの行のキーの組み合わせ、そして `5.0.0` からは `toImage` をエクスポートしています。

| エクスポート | 説明 |
| --- | --- |
| `ErdEditorElement` | 要素のインターフェースです。[ErdEditorElement](./erd-editor-element.md) を参照してください。`5.0.0` からは `<erd-editor>` が定義されるクラスでもあります。[要素の登録](#registering-the-elements)を参照してください。 |
| `ErdViewerElement` | `5.0.0` から。ビューアーのインターフェースとクラスです。[ErdViewerElement](./erd-viewer-element.md) を参照してください。 |
| `defineErdEditor()`、`defineErdViewer()` | `5.0.0` から。`<erd-editor>` または `<erd-viewer>` をそのクラスとして定義します。そのタグがそのクラスを持っている間、呼び出しは何もせず、別のクラスが持っている場合は `Error` を投げます。[要素の登録](#registering-the-elements)を参照してください。 |
| `toImage(value, options)` | `5.0.0` から。`Export image` ダイアログと同じオプションで、ドキュメントを PNG の `Blob` または SVG の文字列として描画します。[toImage](./to-image.md) を参照してください。 |
| `ToImageOptions`（型） | `5.0.0` から。`toImage()` が受け取るオプションで、`format`、`background`、`darkMode`、`scale` です。 |
| `setExportFileCallback(cb)` | ブラウザのダウンロードを置き換えます。`(blob, { fileName }) => void` です。 |
| `setImportFileCallback(cb)` | ブラウザのファイル選択を置き換えます。`({ type, op, accept, mode }) => void` です。`mode` は `4.0.0` からです。`4.2.0` からは、辞書タブの `Import CSV` は、コールバックを設定していてもブラウザのファイル選択を開きます。[ファイルダイアログ](#ファイルダイアログ)を参照してください。 |
| `createKeyBindingMap()` | 既定のキーバインディングを、呼び出すたびに新しい `KeyBindingMap` として返します。[createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) を参照してください。 |
| `KeyBindingMap`、`KeyBindingName`、`ShortcutOption`（型） | バインディングのマップ、そのコマンド名のユニオン、1 つのバインディングです。 |
| `dictionaryRowChords(map)` | `4.2.0` から。渡した `KeyBindingMap` のもとで[辞書](../guide/guides/dictionary.md#adding-and-deleting-rows)タブのグリッドが行を挿入・削除するキーの組み合わせを、呼び出すたびに新しい `ShortcutOption[]` として返します。上に行を挿入する組み合わせ（既定では `Alt+Shift+Enter`）は、どのバインディングにも含まれません。[dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) を参照してください。 |
| `LocaleCode`、`LocaleOption`（型） | `4.0.0` から。25 の表示言語のコードと、`setLocale()` が受け取る、そのコードに `'system'` を加えたものです。[Display Language](./erd-editor-element.md#display-language) を参照してください。 |
| `SchemaSQLOptions`（型） | `4.0.0` から。`getSchemaSQL()` が受け取るオプションで、`statements`、`header`、そして `4.2.0` からは `logicalNameAsComment` があります。[getSchemaSQL](./erd-editor-element.md#getschemasql) を参照してください。 |

`5.0.0` からは、`dist` に、モジュールごとにミニファイしていないファイルが 1 つずつ、宣言ファイルと並んで入り、`package.json` の `sideEffects` に挙がるのは 2 つのタグのエントリーとワーカーファイルが必要とする 2 つのスタブだけです。そのため、バンドラーはページが到達しないモジュールをすべて取り除き、ミニファイは 1 回だけ行います。

- ルートからの名前付きインポート（`setExportFileCallback` など）は、どちらの要素もワーカーもバンドルしません。
- `toImage` は画像の書き出しワーカーを取り込み、要素は取り込みません。
- `erd-editor.js` はエディタと 3 つの Shared Worker すべてを取り込みます。
- `erd-viewer.js` はビューアーを取り込み、ワーカーは取り込みません。英語は中に入っていて、ほかの各表示言語は専用のチャンクに入り、ページが求めたときに読み込まれます。

`@dineug/erd-editor/engine.js` は、DOM なしでドキュメントの store を動かすため、Web Worker でも動作します。[リモート保存](./advanced/remote-storage.md)を参照してください。
`createReplicationStore` と `ReplicationStore` 型をエクスポートしています。`3.10.0` からは、レプリカの `change` リスナーが受け取る `ReplicationChange` 型 `{ value: string; changed: boolean }` もエクスポートしています。[on@change](./advanced/remote-storage.md#onchange) を参照してください。
`4.0.0` からは、`ReplicationStore` に `runtimeValue` もあります。その `value` と `change` が渡す `value` は、要素のものと同じく、ファイルが保持する保存形式です。[ReplicationStore](./advanced/remote-storage.md#replicationstore) を参照してください。

`@dineug/erd-editor/peer.js` は、[MCP サーバー](../mcp/introduction.md)がドキュメントを編集するときに経由するヘッドレスなピアです。このサーバーのためのもので、これらのページでは説明していません。

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
書き出しのコールバックは次のファイルを受け取ります。`4.0.0` からは SVG と Code Generator のファイルも含まれ、`.sql` は `Export` から直接ではなく、Schema SQL タブの `Save file` から届きます。`4.2.0` からは辞書タブの CSV も含まれます。[toImage()](./to-image.md) はどちらのコールバックも呼ばず、画像を呼び出し元に返します。

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

## 4.x からのアップグレード {#upgrading-from-4x}

`5.0.0` はメジャーリリースです。ページを 4.x から移行するときは、次の各項目を確認してください。

- `import '@dineug/erd-editor'` は `<erd-editor>` を定義しなくなりました。代わりに `@dineug/erd-editor/erd-editor.js` を副作用のためにインポートするか、`defineErdEditor()` を呼び出し、ルートからの名前付きインポートはそのままにします。ルートの宣言が引き続き `HTMLElementTagNameMap` にタグを挙げているため、TypeScript は、素のインポートのままのページを指摘しませんが、作られる要素は通常の `HTMLElement` なので、最初のメソッド呼び出しで `TypeError` になります。[要素の登録](#registering-the-elements)を参照してください。

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- CDN でも同じです。`https://esm.run/@dineug/erd-editor` はルートを配信するようになり、何も定義しません。`https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js` をインポートしてください。パッケージ名だけの jsDelivr と unpkg の URL は、これまでどおり script タグのビルドを配信し、`<erd-editor>` を定義します。バージョンを指定しない URL は最新の 5.x リリースを配信するようになりました。4.x にとどまるには `@4.2.0` に固定します。[CDN](#cdn) と [script タグ](#script-タグ)を参照してください。
- ルートは何も定義しませんが、引き続き DOM が必要です。そのため、サーバーサイドレンダリングでは、ルートからの名前付きインポート（`setExportFileCallback` など）を、要素のエントリーと並べて、クライアント側でのみ実行される経路に置きます。[サーバーサイドレンダリング](#サーバーサイドレンダリング)を参照してください。
- `window.ErdEditor` に `ErdEditorElement` と `defineErdEditor` が加わりました。ビューアーの script タグのビルドは `ErdViewerElement` と `defineErdViewer` を `window.ErdViewer` に置き、どちらのグローバルにも `toImage` は入っていません。
- `readonly` のエディタは閲覧用として開きます。6 つのタブ、エクスプローラー、クイック検索、他の参加者の表示は残り、ダイアグラムを編集するコントロールは、無効になるのではなく取り除かれます。ツールバーにはデータベース名がテキストで表示され、設定タブは `Read only` のバッジのもとで、すべてのコントロールを無効にして設定を表示し、フローティングツールバーに残るのは拡大・縮小、名前の表示、Zen モード、コンパスだけなので、`Hand` と `Select` はなくなり、ドラッグは表示位置の移動になります。押下は何も選択しません。唯一の選択は、エクスプローラーやクイック検索からの移動が到達先の周りに付ける外枠で、動かさずにクリックすると解除され、すべてを選択するショートカットは何も選択しません。`readonly` をオンにすると、選択、ハンドツール、セルのエディタ、ドラッグ、Map Columns、自動レイアウトの `Force` のプレビュー、Time Travel のように開いていたものが終了し、スクロール、拡大・縮小、タブ、名前の表示は保たれます。[readonly](./erd-editor-element.md#readonly) を参照してください。
- `readonly` の閲覧者が変更する設定は、ロックの状態にかかわらず、そのエディタの画面にとどまります。スクロールと拡大・縮小、タブ、名前の表示、View Option、データベース、Code Generator の言語、名前のケース、括弧の種類です。`value`、`runtimeValue`、JSON の書き出しはドキュメント自身の設定を保ち、4.x では閲覧者の変更がそこに届くことがありました。`getSharedStore()` はそれらを他のエディタに送りません。ベンダーを指定しない `getSchemaSQL()` は、閲覧者が選んだデータベースを書き出します。`readonly` をオフにすると、データベース、コード設定、View Option はドキュメントの値に戻り、スクロール、拡大・縮小、タブ、名前の表示は閲覧者が残した位置のままです。
- 設定タブの `Recalculation table width` の行はなくなりました。読み込みと貼り付けでは、引き続き各テーブルの幅がテキストに合わせて調整されます。
- Vite 8 では、Vite 7 以前だけがまだ必要とする `optimizeDeps` の `exclude: ['@dineug/erd-editor']` を外し、ELK の `include` は残します。[Vite](#vite) を参照してください。

## 3.x からのアップグレード

`4.0.0` はメジャーリリースです。ページを 3.x から移行するときは、次の各項目を確認し、その後 `5.0.0` については [4.x からのアップグレード](#upgrading-from-4x)の各項目を確認してください。

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
- バージョンを指定しない CDN の URL は最新のリリース（`5.0.0` からは 5.x）を配信します。3.x にとどまるには `@3.10.0` に固定します。[CDN](#cdn) を参照してください。
