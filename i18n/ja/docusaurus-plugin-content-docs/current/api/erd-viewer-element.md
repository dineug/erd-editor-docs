---
sidebar_position: 3
description: erd-viewer 要素の API。value または src の URL からの読み取り専用のダイアグラム、ミニマップとコントロールバー、load と error のイベント、テーマ、表示言語、フォーカスとキー、読み込み、ページに加えるもの。
---

# ErdViewerElement

`5.0.0` からは、パッケージに `<erd-viewer>` も含まれます。ドキュメントを読み取り専用で表示する要素で、閲覧者はパン、拡大・縮小、検索、リレーションシップの強調ができ、ダイアグラムを編集するものは何もありません。描画するのは ERD キャンバスだけで、スクロールバー、[ミニマップ](#minimap)、[コントロールバー](#controls)、ドキュメントを検索するパレットを備え、ツールバー、タブ、エクスプローラー、コンテキストメニューはありません。

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

上のフレームは、erd-editor.io/embed が表示するこの要素で、ここでは bookstore のサンプルを表示しています。クリックしてフォーカスを移し、[フォーカスとキー](#focus-and-keys)のキーで拡大・縮小と検索を試してください。自分のドキュメントをコードなしでフレームに表示する方法は[埋め込み](../guide/guides/embedding.md)を参照してください。

ビューアーは単なる `HTMLElement` です。  
型定義は次のとおりです。

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

`@dineug/erd-editor/erd-viewer.js` を読み込むと `<erd-viewer>` が定義され、`<erd-editor>` は未定義のままです。パッケージのルートを読み込んでもどちらも定義されません。ルートはクラス `ErdViewerElement` と、呼び出した場所でタグを定義する `defineErdViewer()` をエクスポートするため、ページは独自のタグでこのクラスを定義することもできます。[要素の登録](./installation.md#registering-the-elements)を参照してください。  
`engine.js` と `peer.js` 以外のエントリーはどれも DOM が必要で、このエントリーも同じです。そのため、サーバーサイドレンダリングのページでは、クライアント側で読み込みます。[サーバーサイドレンダリング](./installation.md#サーバーサイドレンダリング)を参照してください。  
このエントリーを読み込むと `erd-viewer` が `HTMLElementTagNameMap` に追加されるため、`document.createElement('erd-viewer')` と `document.querySelector('erd-viewer')` は、キャストなしで `ErdViewerElement` の型になります。

エディタと同じく、ビューアーは closed shadow root に描画するため、`viewer.shadowRoot` は `null` で、ページのスタイルが内側に入ることも外に漏れることもありません。スタイルは [setTheme](#settheme) と `--erd-editor-*` カスタムプロパティで指定します。1 つのページに複数のビューアーがあっても、それぞれが自分のドキュメント、表示位置、テーマ、言語を保ちます。  
`<erd-viewer>` は固有のサイズを持ちません。カスタム要素はインライン要素なので、上のように `display: block` と高さを指定してください。ビューは要素のボックスいっぱいに広がり、サイズが変わっても拡大・縮小を保ったまま追従します。

属性は `src`、`name-view`、`minimap`、`controls` だけで、それぞれ同じ名前のプロパティがあります（`name-view` は `nameView`）。[value](#value) はプロパティのみです。  
`value`、`src`、`nameView`、`minimap`、`controls` を、タグが定義される前に要素へ設定した場合（たとえばエントリーの読み込み前に要素を描画するフレームワークなど）は、タグが定義された時点で取り込まれ、マークアップが与えた属性より優先されます。ページが最初に書いた順に取り込まれるため、`value` と `src` では後のほうが有効になります。そのとき、ドキュメントを含まない `value` には例外を投げる呼び出し元がもう残っていないため、捕捉されないエラーとして報告され、ビューアーは空のままです。

スクリプトタグのビルド `dist/erd-viewer.umd.js` は、ビューアーだけをすべての依存とともに収めています。`<erd-viewer>` を定義し、`ErdViewerElement` と `defineErdViewer` を `window.ErdViewer` に置きます。パスのない CDN の URL はエディタのビルドを配信するため、ファイル名を指定してください。[script タグ](./installation.md#script-タグ)を参照してください。

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

ビューアーが取得して表示するドキュメントの URL です。既定値は、なしを表す `''` です。  
取得は、独自のオプションを持たない `GET` の単純な `fetch()` なので、ブラウザの CORS の規則に従います。別のオリジンのドキュメントには、ページのオリジンを許可するサーバーが必要で、Cookie が送られるのはページ自身のオリジンに対してだけです。相対 URL はページを基準に解決されます。  
レスポンスは、`.erd.json` ファイルが持つ形式、つまりエディタの [value](./erd-editor-element.md#value) とすべての公式ホストが書き出す保存形式のドキュメントでなければなりません。ほかの形式は読み込まれず、SQL、GraphQL、DBML、AML のファイルはパースできないテキストとして失敗します。  
パースできたドキュメントはビューにフィットして表示され、[load](#load) が発行されます。ネットワークや CORS が拒否したリクエスト、`ok` でないレスポンス、パースできないテキストは、[error](#error) を発行し、空のダイアグラムを残します。[読み込み](#loading)を参照してください。

最新のリクエストだけが有効です。新しい `src` は実行中の取得を中断するため、遅い応答が後のドキュメントの上に表示されることはありません。[value](#value) の代入、`src` の削除、`src` を `''` にすることも取得を中断し、これらは `src` に従うのをやめて、表示中のドキュメントをそのまま残します。  
`value` と `src` は、プロパティでも属性でも、最後に設定したほうが有効になります。`value` の後に書いた `src` は、以前に取得したものと同じ URL でも取得されます。すでに表示しているドキュメントの上に同じ `src` をもう一度書いても、何も取得しません。  
ビューアーが取得するのは、ページの中にある間だけです。取り出すと実行中の取得を中断し、戻すとまだ表示していない `src`（失敗したものを含む）を取得し、すでに表示している `src` は取得しません。  
`src` はこのパッケージが行う唯一の `fetch()` なので、厳しい Content Security Policy では、ドキュメントのオリジンを `connect-src` に挙げます。

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

表示しているドキュメントを、`src` と `value` のどちらから来たものでも、エディタの [value](./erd-editor-element.md#value) が書き出す保存形式の JSON 文字列として取得します。何も表示する前は、`doc` が `{}` の新しい空のドキュメントです。  
ドキュメントの `Viewport` の[ロック](../guide/guides/settings.md#ロック)がオンの間は、新しいドキュメントではオンですが、閲覧者がビューをどこへ動かしても、ドキュメントがロックしている拡大・縮小とスクロールの値を書き出します。そのロックがオフのときにだけ、フィットによる表示を含め、ビューが現在ある位置を書き出します。  
書き出すのはドキュメントが保持している名前の表示で、`Name View` のロックがオフのドキュメントでも、[nameView](#nameview) やコントロールバーがその上に表示しているものは書き出しません。  
[destroy](#destroy) の後でも、ドキュメントを返します。

```js
const data = viewer.value;
```

### setter {#setter}

テキストからドキュメントを表示し、表示中のものを置き換えてビューにフィットさせます。[読み込み](#loading)を参照してください。ファイルまたはエディタの `value` が持つテキストを受け取ります。  
パースできないテキストは、何かが変わる前に例外を投げ、表示中のドキュメントは残ります。JSON でないテキストには `SyntaxError`、`7` のようにドキュメントを含まない JSON には `TypeError` です。空の文字列や文字列でない値は、空のダイアグラムを表示します。  
代入すると、実行中の `src` の取得を中断し、`load` も `error` も発行しません。

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

ドキュメントが保持している[名前の表示](../guide/guides/logical-names.md#name-view)の上に重ねて、ダイアグラムを表示します。`Physical Names` なら `'physical'`、`Logical Names` なら `'logical'`、`Both Names` なら `'both'` です。既定値の `null` はドキュメント自身の表示を使い、この 3 つ以外の属性値は `null` として扱われます。  
その後に読み込むすべてのドキュメントに対して有効なままで、[value](#value) がこれを書き出すことはありません。属性を削除すると、ドキュメント自身の表示に戻ります。  
[コントロールバー](#controls)の `Name View` の一覧でも表示を切り替えられ、それは次のドキュメントが表示されるか、`nameView` が次に変更されるまで続きます。そこでの切り替えも `value` に書き出されません。

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

ドキュメントにテーブル、表示中のメモ、表示中のテーブルグループのいずれかがある間、右上にミニマップを表示します。既定でオンです。  
エディタのミニマップと同じように動作し、クリックするとビューがそこへ移動し、ビューポートの矩形をドラッグするとパンします。[キャンバスの移動](../guide/guides/table-related-functions.md#getting-around-the-canvas)を参照してください。ビューアーがフォーカスを持つまで、その上の指の操作はページのものです。  
オフになるのは `minimap="false"` のときだけです。属性名のみの指定、それ以外の値、属性なしは、どれもオンのままです。

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

キャンバスの下端の中央に、コントロールバーを重ねて表示します。既定でオンで、左から右に次のものが並びます。

- 拡大・縮小: `Zoom out`、現在の拡大・縮小率のパーセント表示、`Zoom in`。2 つのボタンは拡大・縮小のキーと同じように段階的に拡大・縮小し、パーセント表示 `Reset zoom` をクリックすると `100%` に戻ります。それぞれのツールチップにキーが表示されます。
- `Fit`: ダイアグラム全体がビューに収まるように、拡大・縮小とスクロールを行い、中央に置きます。
- `Name View`: 現在の表示を示すボタンで、バーの上に `Physical Names`、`Logical Names`、`Both Names` の一覧を開きます。[nameView](#nameview) を参照してください。
- `Go to content` のコンパス: ダイアグラムがまったく画面に入っていない間だけバーの末尾に加わり、ビューをダイアグラムの最も近い部分へ移動します。

バーはどの言語でも左から右に並びます。  
オフになるのは `controls="false"` のときだけで、コンパスと `Name View` の一覧も一緒に消えます。属性名のみの指定、それ以外の値、属性なしは、どれもオンのままです。バーがなくても、ビューアーがフォーカスを持てば、ホイール、ピンチ、キーで拡大・縮小できます。

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Event {#event}

イベントは `load` と `error` の 2 つだけで、どちらも `src` について報告します。どちらもバブリングしないため、要素自体でリッスンしてください。

### load {#load}

`src` が指すドキュメントの取得と表示が完了したときに発行されます。`event.detail` は `null` です。  
`value` の代入では発行されず、後の `src`、`value`、要素のページからの取り出し、[destroy](#destroy) が中断した取得でも発行されません。

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

`src` の取得に失敗したときに発行されます。ネットワークや CORS がリクエストを拒否した、レスポンスが `ok` でなかった、またはそのテキストをパースできなかった場合です。ビューアーは空のダイアグラムと `Couldn't load the diagram` の通知を表示します。[読み込み](#loading)を参照してください。  
`event.detail` は原因です。`fetch()` が拒否する `TypeError`、`GET /missing.erd.json answered 404 Not Found` のようにステータスを含む `Error`、またはパーサーの `SyntaxError` か `TypeError` です。  
何かが中断した取得は何も発行しません。

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

プリセットのテーマを設定します。エディタの `ThemeOptions` を受け取ります。[setPresetTheme](./erd-editor-element.md#setpresettheme) を参照してください。  
ビューアーは `appearance: 'system'`、`grayColor: 'slate'`、`accentColor: 'indigo'` で始まるため、最初のフレームから、オペレーティングシステムが報告するライトまたはダークで表示し、それが変わると切り替わります。エディタはダークで始まります。  
各フィールドは個別に適用されるため、一部だけを指定した呼び出しは、ほかの 2 つをそのまま残します。名前にない値は無視され、呼び出しが例外を投げることはありません。  
ビューアーにはテーマビルダーも `systemDarkMode` もなく、テーマについてイベントを発行することもありません。

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

`'system'` の外観が表示するライトまたはダークを指定します。独自のライトとダークを持つページ向けです。どちらかを指定している間、オペレーティングシステムの変更は無視されます。  
`null`、または `'dark'` と `'light'` 以外の値は、オペレーティングシステムに従う状態に戻します。  
外観が `'light'` または `'dark'` の間は画面に何も変わりませんが、値は保持され、外観が `'system'` になった時点で適用されます。何も発行しません。

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

プリセットの上にテーマのトークンを上書きします。エディタの `Theme` のトークンを受け取ります。[setTheme](./erd-editor-element.md#settheme) を参照してください。  
呼び出すたびに上書き全体が置き換わるため、プリセットに戻すには `{}` を渡します。保持されるのはトークン名と文字列の値だけで、後から `setPresetTheme` を呼ぶと、上書きはそのままで下のプリセットが入れ替わります。  
`--erd-editor-*` の CSS カスタムプロパティも、要素またはその上の任意の要素に設定すればビューアーに届きます。[CSS Variables](./erd-editor-element.md#css-variables) を参照してください。どのスタイルシートも届かないキャンバスは、ページの `head` のスタイルシートが変わったとき、または要素かその上の要素の `class` や `style` 属性が変わったときに、それらを読み直します。`insertRule()` で追加した規則はこれらのどれも変えないため、キャンバスは次にそのような変更があったときに反映します。

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

表示言語を設定します。既定値の `'system'`、またはエディタの[表示言語](./erd-editor-element.md#display-language)が挙げる 25 のコードのいずれかです。`'ko'` だけのような指定や文字列でない値など、それ以外は無視されます。  
言語が変えるのは、コントロールバーのツールチップ、`Name View` の一覧、パレット、読み込みの通知、そして `unnamed` のようにダイアグラムが自分で描く言葉です。名前、コメント、ドキュメントのそれ以外の部分が翻訳されることはありません。

英語はビューアーのエントリーに含まれ、呼び出しが戻る前に適用されます。ほかの言語はそれぞれ独自のモジュールで、バンドラーがビューアーの隣のチャンクとして出力し、ページがその言語を最初に求めたときに、ビューアーがバンドルから取得します。取得はページのビューアー全体で 1 回だけです。読み込まれるまで、ビューアーはそれまで表示していた言語（最初のフレームでは英語）を表示し続けます。読み込みに失敗すると英語を表示し、その言語をもう一度求めると再試行します。  
[script タグ](./installation.md#script-タグ)のビルドは 25 の言語をすべて持つため、何も取得しません。エディタも含むバンドルでは、すべての言語がエディタのチャンクと一緒に読み込まれます。[要素の登録](./installation.md#registering-the-elements)を参照してください。  
返される `Promise` は、その言語が読み込まれるか失敗した時点で解決し、拒否されることはありません。その後はその言語（失敗した場合は英語）が有効ですが、後の呼び出しが別の言語を求めた場合は、言語が読み込まれる順序にかかわらず、後の呼び出しが優先されます。

ヘブライ語、アラビア語、ペルシア語では、パレットと読み込みの通知が右から左に配置されます。キャンバス、ミニマップ、スクロールバー、コンパス付きのコントロールバーは、エディタのキャンバスと同じく、左から右のままです。[右から左に書く言語](../guide/guides/language-and-theme.md#右から左に書く言語)を参照してください。  
ビューアーが `lang` と `dir` を設定するのは、closed shadow root の内側の自身のルートで、ホスト要素にもページにも設定しません。  
何も発行せず、ビューアーには言語のピッカーがなく、何も保存しません。

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

`'system'` が指す言語を BCP 47 のタグで指定します。独自の言語設定を持つページ向けです。  
タグは前後の空白が取り除かれます。`null`、空白だけの文字列、文字列でない値は、ページの言語に戻します。  
ページの言語とは、ビューアーが最初に接続されたときに一度だけ読み取る、ページの `<html lang>`、続いてブラウザの `navigator.languages` です。`'system'` は、そのうちビューアーが対応している最初の言語を、エディタの [setSystemLocale](./erd-editor-element.md#setsystemlocale) の規則で選び、どれにも対応していなければ英語です。そのため、`<html lang>` がビューアーの対応する言語を指すページは、ブラウザの優先にかかわらずその言語で表示し、その後に `lang` やブラウザの言語が変わっても、どのビューアーも切り替わりません。  
有効なオプションが `'system'` の間だけ意味を持ち、その `Promise` は [setLocale](#setlocale) と同じように解決します。

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

ビューアーを完全に終了します。要素がまだページの中にあっても、先に取り出されていても、戻る前にビューを撤去し、実行中の `src` の取得を中断し、オペレーティングシステムの配色とページのスタイルへの追従をやめます。  
破棄されたビューアーは、ページに再び追加されても、それ以上何も描画せず、何も取得せず、言語も求めません。[value](#value) を読むと、保持していたドキュメントを引き続き返します。  
要素をページから取り出しても破棄されません。戻せば続きから動作し、まだ表示していない `src` を取得します。[読み込み](#loading)を参照してください。

```js
viewer.destroy();
```

## フォーカスとキー {#focus-and-keys}

ビューアーは、マウントされたとき、ドキュメントが表示されたとき、パレットが閉じたときにフォーカスを取らないため、ページを自分のところへスクロールすることも、ページのキーを奪うこともありません。  
キャンバスのクリックまたはタップで、ページをスクロールせずにフォーカスを取り、`Tab` キーの停止位置の 1 つになります。エディタとは異なり、独自の `focus()` や `blur()` のメンバーはありません。ページのほかの場所を押すと、再びフォーカスが外れます。

ビューアーがフォーカスを持つまで、ホイールはページがスクロールするために使い、トラックパッドのピンチもページのものです。キャンバス上の指の操作はページをスクロールし、何もパンせず、すべてのキーは抑止されずにページに届きます。  
フォーカスを持つと、次のようになります。

- ホイールでビューがパンし、`Shift + Wheel` で横にパンします。テキストがあふれているメモの上では、ホイールでメモがスクロールします。
- `Ctrl + Wheel` (Windows/Linux) または `⌘ + Wheel` (Mac)、トラックパッドのピンチ、タッチスクリーンでの 2 本指の操作で拡大・縮小します。
- 指の操作でビューがパンします。
- `Ctrl + Plus` と `Ctrl + Minus` (Windows/Linux)、または `⌘ + Plus` と `⌘ + Minus` (Mac) は、`Zoom in` と `Zoom out` のボタンと同じように拡大・縮小を段階的に行い、`Ctrl + 0` (Windows/Linux) または `⌘ + 0` (Mac) は、画面の中央をそのままに、すぐ `100%` に戻します。
- `Ctrl + K` (Windows/Linux) または `⌘ + K` (Mac) でパレットが開き、`Esc` で閉じます。

キーはこれだけで、割り当てを変更することはできません。それ以外のキーは、フォーカスの有無にかかわらず、抑止されずにページに届きます。`Delete`、`Backspace`、`Space`、`Enter`、`Tab`、`Ctrl + A`、`Ctrl + F`、そしてエディタで編集を行うすべてのキーの組み合わせが該当します。

パレットが検索するのはドキュメントだけで、コマンドは一覧に表示しません。入力が空のときはプレフィックスを表示します。`#` はテーブル、`@` はカラム、`:` はコメントとメモを検索し、`?` はプレフィックスを一覧表示します。エディタと同じです。[ダイアグラムの検索](../guide/guides/quick-search.md#searching-the-diagram)を参照してください。プレフィックスのない語を入力すると、それでダイアグラムを検索する行の上に `No commands match` と表示されます。  
行を選ぶと、エディタの規則である[移動先の表示位置](../guide/guides/table-related-functions.md#where-a-jump-lands)でビューが動き、拡大・縮小はそのままで、到達したもの（テーブル、カラムやコメントを持つテーブル、メモ）が前面に出て外枠が付きます。  
行を選ぶか `Esc` を押すとパレットが閉じてフォーカスはどの要素にもなくなるため、次のホイールはページをスクロールします。ビューをクリックすると、ホイールとキーが再び使えます。パレットが開いている間は、ホイールはその一覧をスクロールし、拡大・縮小のキーは何もしません。

フォーカスの有無にかかわらず、マウスのメインボタンでのドラッグは、テーブルの上でも、キャンバスのどこからでもビューをパンします。動かさずにクリックまたはタップすると、リレーションシップが強調されます。テーブルの上ならそのテーブルのリレーションシップ、リレーションシップの線の上ならその線、それ以外の場所（メモを含む）なら強調が消えます。そのようなクリックは、パレットの移動が残した外枠も消します。ポインターがテーブルの上にある間は、そのテーブルのリレーションシップが強調されます。  
押下では何も選択せず、移動せず、編集もしません。移動の外枠のほかに選択はなく、範囲選択もなく、ダブルクリックや `Enter` でセルが開くこともありません。

## 読み込み {#loading}

`src` を読み込んでいる間は、キャンバスの中央に、回転するローダーとともに `Loading diagram` の通知が表示されます。読み込みに失敗すると、警告マークとともに `Couldn't load the diagram` と表示され、新しい `src` か `value` がそれに代わるか、`src` が削除されるまで続きます。押下は通知を通り抜けてキャンバスに届き、通知は表示言語で表示され、右から左に書く言語では右から左に配置されます。

`src` からでも `value` からでも、表示されるドキュメントはすべて、ビューアーのボックスにフィットします。`Fit` と同じように、ダイアグラム全体が収まり中央に来るように拡大・縮小とスクロールが行われ、ファイルが保存していた拡大・縮小とスクロールは使われません。ビューアーにサイズがない間、つまりページに入る前や、ボックスが空の間に渡されたドキュメントは、サイズを持った時点でフィットします。その後のリサイズでは拡大・縮小が保たれ、`Fit` でもう一度フィットします。

ビューアーが `src` を取得するのは、ページの中にある間だけです。取り出すと実行中の取得を中断し、戻すとまだ表示していない `src`（失敗したものを含む）を取得し、すでに表示している `src` は取得しません。不要になったビューアーは [destroy](#destroy) で終了します。

## ページに加えるもの {#what-it-adds-to-a-page}

- ワーカーなし。ワーカーを起動しないため、Content Security Policy に `worker-src` は必要ありません。
- ストレージなし。Cookie、`localStorage`、`sessionStorage`、IndexedDB に何も書き込みません。
- リクエストは 2 種類です。[src](#src) の取得（厳しいポリシーでは、そのオリジンを `connect-src` に挙げます）と、英語以外の表示言語のモジュール（自分のバンドルから）です。[setLocale](#setlocale) を参照してください。
- スタイルは constructed stylesheet に入れます。厳しい `style-src` でも通ります。Firefox 101 より前のように constructed stylesheet のないブラウザでは、代わりに `<style>` 要素が使われ、`style-src 'unsafe-inline'` が必要です。
- `window` のリスナー。このエントリーを読み込むと、ページが続く間、`mousedown`、`touchstart`、パッケージ独自の `@dineug/erd-editor/internal-forward-move-start` イベントの 3 つが追加されます。キャンバスを描画する Konva は `window.Konva` を設定し、最初のステージとともに `window` にマウスとタッチのリスナーを、`document` に `visibilitychange` のリスナーを追加して、それらを削除することはありません。エディタのエントリーも同じものを追加します。
- [destroy](#destroy) まで、各ビューアーはオペレーティングシステムの配色に追従し、[setTheme](#settheme) が説明するカスタムプロパティについてページのスタイルを監視します。
