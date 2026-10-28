---
sidebar_position: 4
description: toImage で、Export image ダイアログのオプションを使って、自分のコードからドキュメントを PNG または SVG として描画します。ブラウザ上で、書き出しワーカーがある場合はその中で動作します。
---

# toImage

`5.0.0` からは、パッケージのルートが `toImage()` をエクスポートします。ページにエディタがなくても、ドキュメントを PNG または SVG として描画します。  
[Export image](../guide/guides/file-import-export.md#画像) ダイアログの `PNG` と `SVG` のボタンが書き出すファイルを、ダイアログの 3 つのオプション `Background`、`Dark mode`、`Scale` だけで書き出します。

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` は型として並べてエクスポートされています。[エントリーポイント](./installation.md#エントリーポイント)を参照してください。

## value {#value}

ドキュメントのテキストです。`.erd.json` ファイルが持つ内容、エディタの [value](./erd-editor-element.md#value) や [runtimeValue](./erd-editor-element.md#runtimevalue)、または [setInitialValue](./erd-editor-element.md#setinitialvalue) が読み込めるそれ以外のテキストです。  
空のテキストや空白だけのテキストは空のダイアグラムを描画し、ドキュメントのフィールドを 1 つも持たない JSON も同じで、パーサーが既定値で補います。

## オプション {#options}

| オプション | 既定値 | 説明 |
| --- | --- | --- |
| `format` | なし。必須です | `'png'` は型が `image/png` の `Blob` に、`'svg'` は SVG のマークアップの文字列に解決されます。 |
| `background` | `true` | ダイアグラムの背後にキャンバスの色を塗ります。`false` にすると透明のままで、ON DELETE や ON UPDATE のラベルの下の箱も透明です。 |
| `darkMode` | `false` | ライトのテーマの代わりにダークのテーマで描画します。 |
| `scale` | `2` | 100% のダイアグラムの 1 単位あたりの画像のピクセル数で、`1`、`2`、`3` のいずれかです。PNG のサイズだけを決め、SVG はスケールにかかわらずダイアグラムのサイズです。 |

`toImage()` はほかのキーを読み取らないため、表にないキーを指定しても何も変わりません。

## 描画される内容 {#what-it-draws}

画像は、ダイアログが描画するものと同じです。

- ダイアグラム全体を、描画される範囲に余白を加えて切り取り、ドキュメントが保存されたときの拡大・縮小にかかわらず常に 100% で描画するため、すべてのテーブルが完全に描画されます。ドキュメントの [View Option](../guide/guides/table-related-functions.md#table-view-options) で非表示にしたものは描画も余白の確保もされず、テーブルグループはほかのすべての背後に描画され、[辞書のチェック](../guide/guides/dictionary.md#marks-on-the-canvas)が名前に付ける色は描画されません。
- PNG のサイズは、100% のダイアグラムのサイズに `scale` を掛けたものです。ブラウザのキャンバスには大きすぎる場合は、失敗せずに解像度を下げて書き出され、`toImage()` はそのことを知らせません。
- SVG はテキストをテキストのまま保持し、フォントは埋め込まず名前で指定するため、エディタのフォントがないビューアーでは別のフォントで描画されます。影は含まれません。

ダイアログがエディタの画面を基にするのに対し、`toImage()` はドキュメントだけを基にするため、ドキュメントはどのページでも同じように描画されます。

- 色は、要素の既定のグレーとアクセントである `slate` と `indigo` のプリセットで、`darkMode` が `true` でなければライトです。ページのテーマ、[setTheme](./erd-editor-element.md#settheme) の上書き、[テーマビルダー](../guide/guides/language-and-theme.md)での変更は反映されません。
- テーブルとカラムは、ドキュメントが保持している[名前の表示](../guide/guides/logical-names.md#name-view)で表記されます。`Name View` のロックがオンのファイルでは、ロックされている表示です。
- 名前のないテーブルのプレースホルダーのように、ダイアグラムが自分で描く言葉は英語です。

## 動作する場所 {#where-it-runs}

`toImage()` はキャンバスで計測と描画を行うため、ブラウザのページが必要です。それが含まれるパッケージのルートは読み込みに DOM が必要なので、Node や Web Worker からは使えません。[サーバーサイドレンダリング](./installation.md#サーバーサイドレンダリング)を参照してください。  
描画の前に、ページのフォントの読み込みが終わるのを待ちます。

ホストが画像の書き出しの Shared Worker を動かしている場合は、ダイアログと同じようにその中で描画するため、その間もページは応答し続けます。ない場合や、ワーカーが時間内に応答しない場合は、メインスレッドで描画します。[Web Worker](./installation.md#web-workers)を参照してください。  
`toImage` をインポートして要素を含まないバンドルには、画像の書き出しワーカーだけが入ります。  
どちらの [script タグ](./installation.md#script-タグ)のビルドにも入っていません。`window.ErdEditor` と `window.ErdViewer` に `toImage` はありません。

## 拒否される場合 {#rejections}

返される Promise は、何かを描画する前に、次の場合に拒否されます。

- ページに `document` がない場合: `toImage needs a browser, since it draws on a canvas` という `Error`。
- `value` が文字列でない場合（すでにオブジェクトにパースされたドキュメントなど）: `TypeError`。
- オプションが [オプション](#options) の表にない値を持つ場合（`format` がない場合を含み、SVG とともに渡した `'2'` という `scale` も同じです）: `toImage: scale cannot be 4` のようにオプション名を含む `TypeError`。
- テキストがパーサーの読めるドキュメントでない場合: パーサーのエラーで、JSON でないテキストには `SyntaxError`。

## Export image ダイアログ {#export-image-dialog}

ダイアログと `toImage()` は同じ書き出しを通して描画するため、同じオプションなら同じ画像を書き出しますが、出発点は異なります。

| | `Export image` ダイアログ | `toImage()` |
| --- | --- | --- |
| ドキュメント | ダイアログを開いた時点のダイアグラム | 渡したテキスト |
| ダークモード | エディタの外観に合わせた状態で始まり、合っている間は画面そのものの色で描画します | `darkMode` が `true` でなければオフで、常にプリセットです |
| 名前の表示 | エディタが表示しているもの | ドキュメントが保持しているもの |
| 画像自身の言葉の言語 | エディタの表示言語 | 英語 |
| 結果 | ブラウザまたは[書き出しコールバック](./installation.md#ファイルダイアログ)で保存されるか、クリップボードにコピーされます | 呼び出し元に返されます。どちらのファイルのコールバックも呼ばれません |

`Copy to clipboard` に相当するものはありません。必要なページは、PNG の `Blob` を自分でクリップボードに書き込みます。
