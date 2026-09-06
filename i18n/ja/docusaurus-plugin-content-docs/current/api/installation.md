---
sidebar_position: 1
description: npm と CDN からの @dineug/erd-editor のインストール、カスタム要素の設置、構文ハイライトの追加、ファイルダイアログの差し替え。
---

# インストール

```sh
npm install @dineug/erd-editor
```

このパッケージは ESM 専用（`"type": "module"`）で、`dist` フォルダのみを配布します。
CommonJS ビルドはないため、`require('@dineug/erd-editor')` は動作しません。

ランタイム依存は、利用側のバンドラーが解決・重複排除・ツリーシェイクできるよう、bare import のまま外部に残しています。
shared worker は `dist/workers/` 以下に別々のエントリーファイルとして出力され、`new URL('./…', import.meta.url)` の形で生成されます。Vite、webpack 5、Rspack がワーカーのエントリーとして解釈する書き方です。[Web Worker](#web-worker) を参照してください。
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

`<erd-editor>` は固有のサイズを持ちません。要素またはコンテナに width と height を明示的に指定してください。

`setInitialValue('')` は空のドキュメントから始めます。`value` への代入は読み込みを編集として扱うため、履歴に記録されます。
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
バージョンを指定しない URL は常に最新のリリースを配信します。メジャーアップグレードが予告なくページに反映されるのを避けたい場合は、`https://esm.run/@dineug/erd-editor@3.6.0` のようにバージョンを固定します。

### script タグ

`3.6.0` からは、すべての依存と 2 つの shared worker を 1 つのファイルに収めた UMD ビルドも配布しています。
`unpkg` と `jsdelivr` のフィールドがこのファイルを指しているため、どちらの CDN でもパッケージのベース URL がこのファイルを配信し、`window.ErdEditor` を定義します。

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@3.6.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

読み込むと `<erd-editor>` が同じように登録され、`window.ErdEditor` に `ErdEditor.setGetShikiServiceCallback` などのコールバック設定関数が入っています。
exports マップは引き続き ES モジュールを指しているため、npm からインストールした場合にこのファイルが使われることはありません。

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder></erd-editor>
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

ここで `readonly` を付けると編集できなくなります。`value` への代入、`clear()` の呼び出し、すべての `setSchema*()` は無視され、`change` イベントも発行されません。`editor.value` の読み取りは引き続き動作します。読み込みには代わりに `setInitialValue()` を使用します。

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

## 構文ハイライト

Schema SQL と Code Generator のパネルは、ハイライターを渡さない限りプレーンテキストとして表示されます。
[`@dineug/erd-editor-shiki-worker`](https://www.npmjs.com/package/@dineug/erd-editor-shiki-worker) は、それを Shared Worker で実行します。
Shiki と文法定義は 1 メガバイトを大きく超えるため、別のパッケージとして提供しています。

```sh
npm install @dineug/erd-editor-shiki-worker
```

```js
import { setGetShikiServiceCallback } from '@dineug/erd-editor';

// deferred, so the highlighter never lands in your main chunk
import('@dineug/erd-editor-shiki-worker').then(({ getShikiService }) => {
  setGetShikiServiceCallback(getShikiService);
});
```

CDN から読み込む場合は次のとおりです。

```html
<script type="module">
  import { setGetShikiServiceCallback } from 'https://esm.run/@dineug/erd-editor';
  import { getShikiService } from 'https://esm.run/@dineug/erd-editor-shiki-worker';

  setGetShikiServiceCallback(getShikiService);
</script>
```

script タグからは、2 つの UMD ビルドが定義するグローバルを使います。

```html
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@3.6.0"></script>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor-shiki-worker@0.3.0"></script>
<script>
  ErdEditor.setGetShikiServiceCallback(ErdEditorShikiWorker.getShikiService);
</script>
```

登録は一度だけで、エディタの設置前でも設置後でも構いません。すでに表示されているパネルは、ハイライターが届いた時点で再描画されます。
対応している言語は SQL、TypeScript、GraphQL、C#、Java、Kotlin、Scala、Go、Python です。[コード生成](../guide/guides/code-generator.md)の `AML` と `DBML` はバンドルに文法定義がないため、これらのパネルはプレーンテキストのままです。

`SharedWorker` がない環境、つまり Android の Chrome や 16.4 より前の Safari では、ハイライターが返されず、パネルはプレーンテキストのままです。

## Web Worker

エディタは 3 つの処理を `SharedWorker` で実行します。構文ハイライト、PNG の書き出し、ドキュメントのガベージコレクションです。
どれも設定するものではありませんが、ホスト側で塞げるものでもあるため、それぞれに代替経路があります。

| ワーカー | 提供元 | ない場合 |
| --- | --- | --- |
| 構文ハイライト | `@dineug/erd-editor-shiki-worker`、自分で登録します | Schema SQL と Code Generator のパネルがプレーンテキストのままになります |
| PNG の書き出し | `@dineug/erd-editor` | メインスレッドで描画するため、描画中はページが止まります |
| スキーマのガベージコレクション | `@dineug/erd-editor` | インプロセスで実行されます |

エディタが持つ 2 つのワーカーは応答を 10 秒待ってからワーカーなしで進むため、ワーカーを塞ぐホストでは機能が失われるのではなく性能だけが落ちます。

バンドル向けのビルドでは、エディタが持つ 2 つのワーカーが別ファイルとして一緒に配布されるため、CSP が厳しいページでは `worker-src 'self'` が必要です。バンドラーがワーカーをインライン化する場合は `blob:` も必要になります。
[script タグ](#script-タグ)のビルドでは 2 つのワーカーが `data:` URL としてファイルの中に入るため、そのページでは `worker-src data:` が必要です。

## エントリーポイント

`@dineug/erd-editor` を読み込むと、副作用として `<erd-editor>` を登録します。それ以外には、要素の型と 3 つのコールバック設定関数をエクスポートしています。

| エクスポート | 説明 |
| --- | --- |
| `ErdEditorElement`（型） | 要素のインターフェースです。[ErdEditorElement](./erd-editor-element.md) を参照してください。 |
| `setGetShikiServiceCallback(cb)` | 構文ハイライターを渡します。`() => ShikiService \| null` です。 |
| `setExportFileCallback(cb)` | ブラウザのダウンロードを置き換えます。`(blob, { fileName }) => void` です。 |
| `setImportFileCallback(cb)` | ブラウザのファイル選択を置き換えます。`({ type, op, accept }) => void` です。 |

`@dineug/erd-editor/engine.js` は 2 つ目のエントリーポイントです。DOM なしでドキュメントの store を動かすため、Web Worker でも動作します。[リモート保存](./advanced/remote-storage.md)を参照してください。

### ファイルダイアログ

読み込みと書き出しは差し替え可能なコールバックを経由するため、ブラウザのファイルダイアログを持たないホスト、例えば IDE の Webview でも独自の実装を渡せます。
2 つは対称ではありません。書き出しは完成したファイルを渡しますが、読み込みはファイルを要求するだけで、内容は自分でエディタに渡します。

`op` は `set` または `diff` です。`diff` の場合は `type` に関係なく `setDiffValue()` に渡します。それ以外では `type` がメソッドを決め、`accept` にはその型の拡張子が入っているため、そのままホストのファイルダイアログに渡せます。

| `type` | `accept` | メソッド |
| --- | --- | --- |
| `json` | `.json` | `editor.value = text` |
| `sql` | `.sql` | `editor.setSchemaSQL(text)` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text)` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text)` |
| `aml` | `.aml` | `editor.setSchemaAML(text)` |

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.value = text;
  } else if (type === 'sql') {
    editor.setSchemaSQL(text);
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text);
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text);
  } else if (type === 'aml') {
    editor.setSchemaAML(text);
  }
});
```

処理する `type` ごとに分岐し、それ以外は無視します。
`value` への代入はパースの前にドキュメントを消去します。そのため、`.erd.json` ドキュメントではないデータを、包括的な `else` や、後から追加された `type` が漏れたことによって `value` に渡すと、何も読み込まれずにダイアグラムが空になります。

エディタが生成する `fileName` は `<データベース名>-<時刻>` に `.erd.json`、`.sql`、`.png` のいずれかを付けたもので、時刻は `yyyy-MM-dd'T'HH_mm_ss` の形式です。データベース名が空の場合は `unnamed` になります。

設定しない場合、エディタはブラウザ自身のダウンロードとファイル選択の動作を使用します。`null` を渡すと元の動作に戻ります。

## 対応ブラウザ

Chrome 91+、Edge 94+、Firefox 93+、Safari 16.4+ に対応しています。公開しているバンドルのビルド対象である ES2022 を基準にしています。
ポリフィルは同梱していません。より古いブラウザに対応する必要がある場合は、自分で追加します。
