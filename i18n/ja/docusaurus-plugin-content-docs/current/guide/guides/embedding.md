---
sidebar_position: 18
description: erd-editor.io/embed をフレームで表示して、コードなしで別のサイトにダイアグラムを読み取り専用で表示します。ビルダーで URL と iframe の行を作り、テーマ、言語、名前の表示、ミニマップ、コントロール、色を URL で設定し、GitHub または CORS を許可するサーバーからファイルを配信します。
---

# 埋め込み

[erd-editor.io/embed](https://erd-editor.io/embed) は、ページいっぱいに広がるビューアーでダイアグラムを読み取り専用で表示します。別のサイトがフレームで表示するためのもので、wiki、ブログ、サイトビルダー、独自のスクリプトを読み込めないページなどが対象です。  
`src` パラメーターがドキュメント、つまり `.erd.json` ファイルのように ERD Editor が保存するファイルのアドレスを指定します。URL のそれ以外の部分がビューアーの表示方法を決め、同じアドレスのビルダーが URL とその iframe の行を書いてくれます。

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

このフレームは、erd-editor リポジトリの [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) を表示しており、ページに入れる行は次のとおりです。

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## フレームの表示内容 {#what-the-frame-shows}

フレームには、ダイアグラムのテーブル、カラム、リレーションシップ、メモ、テーブルグループが表示され、ダイアグラムもファイルも編集するものは何もありません。  
ダイアグラムは、読み込まれるときにフレームにフィットします。ファイルが保存していた拡大・縮小とスクロール位置にかかわらず、フレームのサイズが最初の拡大・縮小を決めます。

キャンバスの上には次のものがあります。

- ミニマップ。ダイアグラムに内容がある間だけ表示されます。
- 下部のコントロールバー: `Zoom out`、クリックすると拡大・縮小をリセットする拡大・縮小率、`Zoom in`、`Fit`、`Name View` の一覧、そしてダイアグラムがまったく画面に入っていない間の `Go to content`。
- 右下の `erd-editor.io` リンク。erd-editor.io を新しいタブで開き、リファラーを送らないため、クリックしてもフレームが表示しているドキュメントについてサイトには何も伝わりません。幅の狭いフレームでは、コントロールバーの一部に重なることがあります。

ファイルを読み込んでいる間、フレームには `Loading diagram` と表示されます。取得できない場合やドキュメントを含まない場合は、空のダイアグラムと `Couldn't load the diagram` が表示されます。[GitHub 上のファイル](#files-on-github)と[ほかのサーバー上のファイル](#files-on-other-servers)を参照してください。

フレームが従うのは、その URL と訪問者のシステムだけです。訪問者が erd-editor.io で選んだ自分の言語やテーマは、フレームには適用されません。

## ビルダー {#the-builder}

`src` なしで [erd-editor.io/embed](https://erd-editor.io/embed) を開くと、`Embed a diagram` というタイトルのページであるビルダーが表示されます。

1. `Document URL` にドキュメントのアドレスを貼り付けます。`Enter` を押すかフィールドから離れると適用されるため、入力中は何も取得されません。適用されると、フィールドの下の `Loads from` の行に、ビューアーが取得するアドレスが表示されます。指定したアドレス、または GitHub のページなら GitHub の raw ホスト上のアドレスです。[GitHub 上のファイル](#files-on-github)を参照してください。
2. オプションを選びます。どれも、プレビュー、URL、iframe の行にすぐ反映されます。
   - `Theme`: `System`、`Light`、`Dark`。
   - `Display Language`: `System`（ブラウザでそれが指す言語が横に表示されます）と、それぞれ自分の名前で表示された 25 の言語。
   - `Name View`: `As Saved`、`Physical Names`、`Logical Names`、`Both Names`。`As Saved` はファイルが保存した名前の表示を使います。
   - `Accent color` と `Gray color`。どちらも名前とスウォッチで一覧表示されます。
   - `Minimap` と `Controls`。2 つのスイッチで、どちらもオンです。
   - `Height`。ピクセル単位で、最初は `480` です。正の整数でない高さは `480` として扱われます。
3. `Preview` を確認します。フレームが表示するとおりのビューアーを、`erd-editor.io` リンクとともに、`Height` の高さのボックスに表示します。その `System` 言語は、erd-editor.io 自身が表示している言語にかかわらず、ブラウザの言語です。
4. 結果をコピーします。`Embed URL` はフレームのアドレスで、`Embed code` は、設定した高さと幅 `100%` を含む iframe の行です。どちらにも `Copy` ボタンがあり、ドキュメントの URL が適用されるまで無効で、コピーの後はしばらく `Copied` と表示され、変更がコピーした内容を書き換えるまで続きます。

`Document URL` を空にすると、適用された時点でプレビューと 2 つの結果が空になります。

## URL パラメーター {#url-parameters}

| パラメーター | 値 | 既定値 |
| --- | --- | --- |
| `src` | ドキュメントのアドレス（URL エンコード）。 | なし。ない場合や空の場合、ページはビルダーです。 |
| `theme` | `light`、`dark`、`system`。 | `system`: 訪問者のブラウザが報告するライトまたはダークのモード。 |
| `locale` | `system`、または `de-DE` のような[言語の表](./language-and-theme.md#表示言語)のコード。 | `system`: 訪問者のブラウザの言語を、[System](./language-and-theme.md#system-が従うもの)が照合するのと同じ方法で照合し、ビューアーが対応する言語がなければ英語。 |
| `name-view` | `physical`、`logical`、`both`。 | ファイルが保存した名前の表示。 |
| `minimap` | `false` でミニマップを非表示にします。 | 表示。 |
| `controls` | `false` でコントロールバーを非表示にします。 | 表示。 |
| `accent-color` | `jade` のような、[テーマビルダー](./language-and-theme.md#テーマ)の 26 のアクセントカラーのいずれか。 | `indigo` |
| `gray-color` | `gray`、`mauve`、`slate`、`sage`、`olive`、`sand`。 | `slate` |

既定値はビューアー自身のもので、`jade` と `olive` で始まる Web アプリのものとは異なります。

- ビルダーは、既定値のままのオプションを URL に含めないため、埋め込み URL には異なる点だけが入ります。
- ビューアーが受け付けない値は無視され、そのオプションは既定値のままです。値は表のとおりに完全一致で照合されるため、`theme=Dark` は無視され、`minimap` と `controls` は `false` 以外のどの値でも表示のままです。
- 2 回指定したパラメーターは、最初の値が使われます。
- `src` は、ビルダーが書き出すとおりに URL エンコードします。アドレスに独自の `&` や `#` が含まれていると、そこで途切れてしまうためです。

## GitHub 上のファイル {#files-on-github}

GitHub のファイルやギストは、上のフレームのように、ページが表示するアドレスで指定できます。ビューアーは代わりに GitHub の raw ホストから取得します。ページ自身のアドレスが応答しない別のサイトからのリクエストにも、raw ホストは応答します。

- ファイルのページ `https://github.com/<owner>/<repo>/blob/<ref>/<path>` と、その `raw` アドレス `https://github.com/<owner>/<repo>/raw/<ref>/<path>` は、`https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` から読み込まれます。`<ref>` はブランチ、タグ、コミットのいずれかです。ブランチではそのブランチにあるとおりのファイルが表示され、タグとコミットではそのバージョンが保たれます。
- ギストのページ `https://gist.github.com/<user>/<id>` は、ギストの最初のファイルである `https://gist.githubusercontent.com/<user>/<id>/raw` から読み込まれます。ダイアグラムは、ギストの唯一のファイルにしてください。

埋め込み URL には指定したアドレスがそのまま残り、ビルダーの `Loads from` の行には取得されるアドレスが表示されます。  
これは公開リポジトリと公開ギストでのみ動作します。raw ホストは各ファイルを 5 分間キャッシュするため、プッシュした変更がフレームに表示されるまでそれだけかかることがあります。

## ほかのサーバー上のファイル {#files-on-other-servers}

erd-editor.io のビューアーは、訪問者のブラウザから単純な `GET` でファイルを取得するため、ファイルを置くサーバーはそのクロスオリジンのリクエスト（CORS）を許可する必要があります。応答に、`*` のように `https://erd-editor.io` を許可する `Access-Control-Allow-Origin` ヘッダーが必要です。  
リクエストは Cookie を送らないため、サインインなしで読めるファイルでなければなりません。  
そのヘッダーがない場合、エラーを返すアドレスの場合、ERD Editor のドキュメント以外を返すアドレスの場合は、フレームに `Couldn't load the diagram` と表示されます。

## フレームの中 {#in-the-frame}

訪問者がフレームをクリックまたはタップするか、`Tab` で到達するまで、フレームはホイール、ジェスチャー、キーを受け取りません。それまでは、ホイール、スワイプ、ピンチは、これまでどおり周囲のページをスクロールまたは拡大・縮小します。  
フォーカスを持つと、ホイールでダイアグラムがパンし、`Ctrl + Wheel` (Windows/Linux) または `⌘ + Wheel` (Mac) とピンチで拡大・縮小し、`Ctrl + K` (Windows/Linux) または `⌘ + K` (Mac) でドキュメントの検索が開きます。そこでは `#` でテーブル、`@` でカラム、`:` でコメントやメモを検索できます。  
ドラッグは、フレームがフォーカスを持っているかどうかにかかわらず、ダイアグラムをパンし、クリックやタップはリレーションシップを強調します。クリックしたテーブルのリレーションシップ、またはクリックした 1 つのリレーションシップです。ポインターがテーブルの上にあれば、そのテーブルのリレーションシップが強調されます。すべてのキーは[フォーカスとキー](../../api/erd-viewer-element.md#focus-and-keys)を参照してください。

大きめのダイアグラムで拡大・縮小や検索を試すには、9 つのテーブルと 2 つのテーブルグループを持つ[書店のサンプル](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json)を、専用のページで開いてください。

## アナリティクス {#analytics}

erd-editor.io は、Web アプリへの訪問と同じように、Google Analytics でフレームへの訪問を集計します。フレームについて記録されるアドレスは `erd-editor.io/embed` だけで、`src` が指すドキュメントのアドレスは含まれません。  
[プライバシーポリシー](https://erd-editor.io/privacy)を参照してください。

## ビューアーを自分で読み込む {#loading-the-viewer-yourself}

スクリプトを読み込めるページは、代わりに `@dineug/erd-editor` パッケージの [`<erd-viewer>`](../../api/erd-viewer-element.md) 要素でダイアグラムを表示できます。同じオプションを属性とメソッドとして受け取り、erd-editor.io へのリクエストを行わず、ページ自身のサイトからドキュメントを読み込めるため、CORS は不要です。
