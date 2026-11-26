---
sidebar_position: 2
description: "`@dineug/erd-editor-yjs` で `<erd-editor>` 要素やヘッドレスのピア store を Yjs ドキュメント経由で同期させる方法、ルームへの初期値の設定、Awareness によるプレゼンスの表示、オフライン編集、コンパクション用サイドカーによるルームの履歴の畳み込み。"
---

# Yjs

`@dineug/erd-editor-yjs` は、[Yjs](https://github.com/yjs/yjs) のドキュメントを通じてダイアグラムを同期させます。独立したパッケージで、`@dineug/erd-editor` `5.1.0` と並んで `0.1.0` として最初にリリースされました。  
`bindErdEditor` は `<erd-editor>` 要素を、`bindPeerStore` は `@dineug/erd-editor/peer.js` のヘッドレスのピア store を、`Y.Doc` にバインドします。  
`Y.Doc` を運ぶプロバイダが、そのままダイアグラムを運びます。WebSocket サーバー、WebRTC、IndexedDB、または独自のプロバイダのいずれでも構いません。プロバイダと `Y.Doc` は利用する側のものです。バインディングがそれらを接続、切断、破棄することはありません。

編集は、store が送ったとおりにバインディングが保持するエディタ自身のアクションバッチとして伝わります。  
そのため、エディタの共同編集用のレジスタは、`getSharedStore` でつないだセッションと同じように、同時に行われた編集を調停します。色の変更のような例外も同じです。[同時編集](./collaborative-editing.md#concurrent-edits)を参照してください。  
カーソル、フォーカス、選択、ドラッグボックスは、プロバイダの Awareness を通じて伝わります。[プレゼンス](#presence)を参照してください。  
shared store をトランスポートに自分でつなぐ場合と比べて、バインディングは次の機能を加えます。

- 参加したクライアントは、実行中のエディタから [runtimeValue](../erd-editor-element.md#runtimevalue) を渡されなくても、ルームが保持するダイアグラムを開きます。
- 接続が切れたクライアントも編集を続けられ、その編集は再接続したときに反映されます。[オフライン編集と再参加](#offline-edits-and-rejoins)を参照してください。
- 永続化プロバイダが返した `Y.Doc` は、それが保持するダイアグラムを開きます。[ルームが保持するもの](#what-the-room-holds)を参照してください。
- 任意の Node サイドカーが、ルームの履歴を 1 つのスナップショットに畳み込みます。[ルームのコンパクション](#compacting-a-room)を参照してください。

バインディングには、`5.1.0` で shared store とピア store に加わった 5 つのメソッド、[getLWW](./collaborative-editing.md#getlww)、[mergeLWW](./collaborative-editing.md#mergelww)、[getVersion](./collaborative-editing.md#getversion)、[forgetPeer](./collaborative-editing.md#forgetpeer)、[reseed](./collaborative-editing.md#reseed) が必要です。必要な呼び出しはバインディング自身がすべて行います。

## インストール {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`、`yjs`、`y-protocols` はピア依存関係で、ページはそれぞれ 1 つのコピーだけを持ちます。必要なバージョンは、`5.x` の範囲で `@dineug/erd-editor` `5.1.0` 以降、`13.x` の範囲で `yjs` `13.6` 以降、`1.x` の範囲で `y-protocols` `1.0` 以降です。  
このパッケージが取り込むのはそれらの型だけで、渡された `Y.Doc` と `Awareness` に対して動作するため、Yjs、y-protocols、エディタのコードを自分では読み込みません。  
1 つのページに Yjs のコピーが 2 つあると、互いのコンストラクタ検査を壊し、2 つ目が `Yjs was already imported` をログに出力します。自分のコードとプロバイダが `yjs` を別々の場所から解決する場合は、バンドラーで重複を排除してください（Vite: `resolve.dedupe: ['yjs']`）。

このパッケージは ESM 専用（`"type": "module"`）で、エントリーはパッケージルートの 1 つだけです。副作用がないことも宣言しているため、`bindErdEditor` だけをインポートするバンドルにはコンパクタが含まれません。  
`bindErdEditor` は、定義済みの `<erd-editor>` 要素にバインドするため DOM が必要です。`bindPeerStore` は、[コンパクション用サイドカー](#compacting-a-room)と同じく、Node.js 22.12 以降の素の Node でも動作します。

## 使い方 {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` と `my-diagram` は、自分のサーバーとルームを表します。  
バインドと初期値の設定は、プロバイダの同期が済んでから行ってください。y-websocket の `sync` イベントが `true` で届くことで分かります。それより早く初期値を設定すると、ルームのダイアグラムを置き換えてしまうことがあります。[ルームへの初期値の設定](#seeding-a-room)を参照してください。

バインドの時点で `Y.Doc` にルームのスナップショットがある場合、バインディングはそれをすぐに要素で開きます。スナップショットをレジスタとバージョンごと読み込み（[reseed](./collaborative-editing.md#reseed) と同じです）、その後にログへ記録された編集をすべて適用します。  
スナップショットを開くこの処理は、再参加と同じものをクリアし、同じものを閉じます。[オフライン編集と再参加](#offline-edits-and-rejoins)を参照してください。要素はスナップショットが指定する状態で開きます。この最初の読み込みでは `rejoin` は発生しません。  
空のルームや、プロバイダの同期前のように `Y.Doc` にスナップショットがない場合、要素は自分のドキュメントを保持したままになり、バインディングはスナップショットが現れるまでルームに何も書き込みません。スナップショットは、自分の [seed](#seed) か、別のクライアントのものです。

`bindErdEditor` は、[getSharedStore](../erd-editor-element.md#getsharedstore) で要素から shared store を 1 つ取得し、[destroy](#destroy) でそれを手放します。  
要素は、エントリーをインポートするか `defineErdEditor()` を呼ぶかして、すでに `<erd-editor>` になっている必要があります。[要素の登録](../installation.md#registering-the-elements)を参照してください。タグが定義されるまでは、`<erd-editor>` は素の `HTMLElement` で、タグが定義されて要素がドキュメントに入ると、ブラウザがアップグレードします。まだアップグレードされていない要素に対して、`bindErdEditor` は `error` を発生させずに `TypeError` をスローします。

ルームの編集は、共同編集者の編集と同じように要素に適用され、[change](../erd-editor-element.md#change) を発行します。スナップショットを開いた後に再生される編集も同様です。  
バインド時でも再参加時でも、スナップショットを開いても Undo のエントリーは作られず、`change` も発行されず、ルームへの書き込みもありません。ただし、[オフライン編集と再参加](#offline-edits-and-rejoins)で説明する論理名からの生成は除きます。  
初期値が設定済みのルームに別のドキュメントを読み込むには、すべてのクライアントが適用する変更を行います。[value](../erd-editor-element.md#value) への代入、[clear](../erd-editor-element.md#clear) の呼び出し、ドキュメントの読み込みのいずれかです。  
[setInitialValue](../erd-editor-element.md#setinitialvalue) はルームに書き込まれません。shared store がそれを送らないためで、その要素だけが変わり、ほかのクライアントはルームのダイアグラムのままです。空のルームには、代わりに [seed](#seed) で初期値を設定してください。

1 つの `Y.Doc` が保持するダイアグラムは 1 つです。バインディングは、`Y.Doc` の `erd:` で始まる名前の下にダイアグラムを保持し、ローカルの Awareness 状態の `erd` フィールドを設定します。それ以外の名前とフィールドには触れません。  
ルームの各クライアントと同じように、バインドする要素ごとに専用の `Y.Doc` と Awareness を用意してください。1 つの Awareness を共有する 2 つのバインディングは、互いの `erd` フィールドを上書きします。

## ルームへの初期値の設定 {#seeding-a-room}

ルームは、クライアントが[初期値を設定](#seed)するまでダイアグラムを保持しません。  
それまでにエディタが保持していた内容は、そのエディタ自身の初期値になります。別のクライアントの初期値が先に届いた場合はそちらに譲り、バインディングは `rejoin('snapshot')` でそれを開き直します。その結果、要素が保持していたドキュメントと、バインド後にその中で行った編集は失われます。

2 つのクライアントが同時に初期値を設定した場合、すべてのクライアントで同じ 1 つの初期値が勝ちます。  
負けた初期値を書き込んだクライアントは、`rejoin('seedLost')` で勝った初期値を開き直し、自分が初期値を設定した後の編集を失います。負けた初期値で参加していたクライアントも同様で、`rejoin('snapshot')` で開き直します。負けた初期値の上で行ったそれらの編集は、誰にも届きません。  
プロバイダの同期前に設定した初期値は、ルームのダイアグラムの元になった初期値と同時に設定されたものとして扱われます。そのため、それに勝ってルームのダイアグラムを置き換えることがあります。

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

カーソル、フォーカス、選択、ドラッグボックスを運ぶ `Awareness` です。プロバイダのものなどを指定します。  
指定すると、バインディングは要素のマウストラッカーとフォーカストラッカーをオンにし、ほかのクライアントのプレゼンスを要素に描画します。[プレゼンス](#presence)を参照してください。  
指定しない場合はダイアグラムだけが同期されます。要素はカーソル、フォーカス、選択を送らず、ほかの誰のものも描画しません。

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

このエディタのカーソルの横に、ほかのユーザーに表示される名前です。  
要素の shared store は、[getSharedStore](./collaborative-editing.md#getnickname) と同じく、送信のたびにこれを読み取ります。未指定または空白の場合、ほかのユーザーには `user` と表示されます。

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` は、そのリスナーを削除する関数を返します。

### seed {#seed}

エディタのドキュメントからルームの最初のスナップショットを書き込み、`true` を返します。  
`value`（[setInitialValue](../erd-editor-element.md#setinitialvalue) が読み取れる形式のドキュメントのテキスト）を指定すると、まずそれをエディタに読み込みます。  
続いて、エディタがまだ保留しているドラッグ、サイズ変更、色の変更を、ログに残さずに手放します。そのため、スナップショットの後にそれらがルームへ反映されることはありません。`value` がない場合、スナップショットはエディタのドキュメントを取るので、すでにそれらを含んでいます。`value` がある場合、それらは `value` が置き換えたドキュメントのものでした。  
そのうえで、[ルームが保持するもの](#what-the-room-holds)で説明するスナップショットを書き込みます。  
ルームにすでにスナップショットがある場合は、`value` を読み込まず、何も書き込まずに `false` を返します。そのため、すべてのクライアントがバインドの後でこれを呼べます。バインディングが破棄または停止された後や、バインド時に[拒否された](#onerror)バインディングでも `false` を返します。

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

バインディングが、[reseed](./collaborative-editing.md#reseed) と同じ方法で、エディタをルームのスナップショットで開き直したことを表します。保持されるものと失われるものについては、[オフライン編集と再参加](#offline-edits-and-rejoins)を参照してください。  
`reason` が理由を示します。

- `'snapshot'`: スナップショットに、バインディングがまだ適用していない編集が含まれています。バインディングが離れている間にコンパクタがそれらを畳み込んだ場合や、あるコンパクタが、別のコンパクタのスナップショットに置き換えられたスナップショットに畳み込んでいた内容を、自分の畳み込みで戻した場合です（[ルームごとに 1 つのコンパクタ](#one-compactor-per-room)を参照）。空のルームのバインディングに最初に届いたスナップショットの場合や、別の初期値のスナップショットで、このバインディングが自分で書き込んでいない初期値で参加していた場合も、この理由になります。
- `'seedLost'`: このバインディングが書き込んだ初期値に、別のクライアントの初期値が勝ちました。

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

バインディングがバインドを拒否した、停止した、またはオプションを退けたことを表します。メッセージはすべて `erd-editor-yjs: ` で始まります。

バインド時には、次の場合に何もバインドしません。

- エディタまたはピア store が、すでにこの `Y.Doc` にバインドされている。
- その `@dineug/erd-editor` が `5.1.0` より前のビルドである。バインディングは、要素から取得した shared store を破棄します。
- ピア store がバインドされる前に破棄されている。
- ルームのスナップショットが、このリリースでは読み取れないレイアウトである（[ルームが保持するもの](#what-the-room-holds)を参照）。

このようなバインディングはマイクロタスクで `error` を発生させるため、呼び出しの直後に追加したリスナーでも受け取れます。また、`rejoin` が発生することはありません。

後から、次の場合にバインディングは停止します。

- ルームのスナップショットが、このリリースでは読み取れないレイアウトに変わった。このリリースのすべてのバインディングが停止し、各エディタは適用済みの内容を保持し、それ以降の編集は何も書き込まれません。
- ピア store がバインディングの下で破棄された。ルームが次に変化したとき、または `seed()` や `compact()` が呼ばれたときに検出されます。

停止したバインディングは、[destroy](#destroy) と同じように、取得した shared store と、store と `Y.Doc` の組を手放します。リスナーは保持されます。

`bindPeerStore` に限り、次の場合は `error` が発生しますが、バインディングは動作を続けます。

- `compactAfter` が正の整数ではない: バインディングは、求められたときだけ畳み込みます。
- `electionGraceMs` または `retainMs` が 0 から 2,147,483,647 ms までの数値ではない: 既定値が代わりに使われます。この範囲を超えるタイマーはすぐに発火してしまうためです。
- `synced` が reject される: バインディングは畳み込みを行わず、選出はほかのコンパクタに任せます（[ルームごとに 1 つのコンパクタ](#one-compactor-per-room)を参照）。

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

エディタがまだ保留しているドラッグ、サイズ変更、色の変更をルームに送り、バインディングの `erd` Awareness フィールドを `null` にして、ほかのクライアントがそのカーソル、フォーカス、選択をすぐに消せるようにし、`Y.Doc` と Awareness の監視を止めます。  
要素の場合は、取得した shared store も破棄します。要素とそのドキュメントはそのまま残ります。  
2 回目の呼び出しは何もしません。その後にエディタで行った編集は、誰にも届きません。

ピア store、`Y.Doc`、プロバイダは利用する側のもので、バインディングの後に破棄してください。ピア store を先に破棄すると、保留していたドラッグが送られません。  
要素自身の [destroy](../erd-editor-element.md#destroy) は、バインディングのものを含め、渡したすべての shared store を破棄し、それらが保留していたものを捨てます。そのため、先にバインディングを破棄してください。  
同じエディタまたはピア store を同じ `Y.Doc` に再びバインドする前に、バインディングを破棄してください。`error` で停止したバインディングは、すでに手放しています。

```js
binding.destroy();
editor.destroy();
```

## プレゼンス {#presence}

[awareness](#awareness) を指定すると、エディタのカーソル、フォーカスしているテーブルまたはセル、選択、ドラッグボックスは、`Y.Doc` ではなくローカルの Awareness 状態の `erd` フィールドで伝わります。そのため、ルームの履歴にもスナップショットにも、永続化された `Y.Doc` にも入りません。  
ほかのクライアントは、共同編集者のプレゼンスと同じように、それらを描画します。[focusTracker](./collaborative-editing.md#focustracker) を参照してください。参加したクライアントは、ルームがすでに示しているプレゼンスを描画します。  
要素は、フォーカスと選択を 30 秒ごとに、ドラッグボックスを 1 秒ごとに送り直します。これらの再送は直前と同じ内容でもほかのクライアントに届くため、ユーザーが保持している状態が途切れることはありません。

離れたクライアントは、すぐに消えます。  
Awareness がその状態を削除したとき、または `erd` フィールドが（[destroy](#destroy) が設定するように）`null` になったとき、あるいは別のエディタを指したときは、バインディングは期限切れを待たずに、[forgetPeer](./collaborative-editing.md#forgetpeer) で、そのエディタのカーソル、フォーカス、選択、ドラッグボックスを要素から削除します。  
別のクライアントがまだ同じエディタを表示している場合は残します。ルームの別の `Y.Doc` に再びバインドされた要素などがその例です。

## オフライン編集と再参加 {#offline-edits-and-rejoins}

プロバイダから切断されたクライアントも、編集を続けられます。その編集は shared store ではなくローカルの `Y.Doc` に溜まり、プロバイダが再接続して同期したときにほかのクライアントへ届きます。

切断中に、クライアントが一度も適用していない編集をコンパクタが畳み込んだ場合、スナップショットがそれらを保持しています。そのため、クライアントは再接続時に、エディタが保留しているドラッグ、サイズ変更、色の変更を送ってから、`rejoin('snapshot')` でスナップショットを開き直します。クライアントがすでに適用した内容だけを畳み込んだ場合は、何も開き直しません。  
バインディングが参加したときの初期値のスナップショットへの再参加では、スナップショットが保持していないすべての編集が再生されます。切断中にこのクライアント自身が行った編集も含まれるため、失われるものはありません。別の初期値への再参加では、[ルームへの初期値の設定](#seeding-a-room)で説明するとおり、何も保持されません。

再参加のたびに、Undo の履歴、選択、フォーカスがクリアされ、開いている [Flow](../../guide/guides/visualization.md#flow-mode) ビュー、[リレーションシップの描画](../../guide/guides/editing-start.md#リレーションシップの作成)、メモ・テーブルグループ名・セルのエディタが閉じられます。これらはスナップショットにもうない対象を指している可能性があるためです。  
入力したがまだ確定していないテーブルグループ名は破棄されます。閉じる論理名のセルは、閲覧者が入力した論理名が開き直したドキュメントにまだある場合、そのセルを閉じたときと同じように、その論理名から物理名を生成します。この生成は通常の編集です。ルームがログに記録し、Undo のエントリーが作られ、`change` が発行されます。[reseed](./collaborative-editing.md#reseed) を参照してください。  
ルームに参加していたバインディングは、閲覧者が見ているものを保持します。スクロール位置、拡大・縮小のレベル、タブ、そして読み取り専用の閲覧者が変更した設定です。  
名前の表示と、コード設定（Code Generator の言語、名前のケース、括弧の種類）のうち閲覧者自身が表示していたものも、それぞれの[ロック](../../guide/guides/settings.md#ロック)が再参加の前にオンで、再参加の後も同じロックした値でオンのままである限り、保持されます。  
保持されるもののどれも `value` には反映されません。`value` は開き直したドキュメントの設定を返します。`keepScreen` を伴う [reseed](./collaborative-editing.md#reseed) を参照してください。  
最後に読み込まれてから一度も表示されていない要素のスクロール位置と拡大・縮小のレベル、およびまだ参加していなかったバインディングの画面全体は、スナップショットが指定する状態で開きます。  
ピア store には画面がないため、その再参加では何も保持されません。

## 読み取り専用のエディタ {#read-only-editors}

ルームにバインドされた[読み取り専用](../erd-editor-element.md#readonly)の要素は、ルームの履歴に何も書き込みません。その shared store は変更を送らず、トラッカーとレジスタのハンドシェイクだけを送り、ルームはそのどちらも[ログに記録しません](#what-the-room-holds)。  
ルームが運ぶ編集はすべて適用し、[awareness](#awareness) を指定していれば、閲覧者のカーソル、フォーカス、選択、ドラッグボックスも引き続きほかのクライアントに届きます。  
閲覧者が変更した設定は、ほかの読み取り専用のエディタと同じく、その画面にだけ残ります。  
[seed](#seed) は拒否されません。読み取り専用の要素は、自分が保持するドキュメントで、`value` を指定した場合はそれで、空のルームに初期値を設定します。

## ルームが保持するもの {#what-the-room-holds}

バインディングは、ダイアグラムを `Y.Doc` の 2 つの名前に保持します。ドキュメントのスナップショットを持つマップ `erd:snapshot` と、それ以降のエディタのアクションバッチの配列 `erd:log` です。永続化プロバイダは、`Y.Doc` のほかの内容と一緒にこの両方を保存します。

スナップショットが保持するのは、削除されたエンティティを含むドキュメントの [runtimeValue](../erd-editor-element.md#runtimevalue)、共同編集用のレジスタとバージョン、そして各書き込み元の編集がどこまで畳み込まれているかです。初期値の設定でこれが書き込まれ、コンパクタの畳み込みのたびにも書き込まれます。  
`5.1.1` より前の `@dineug/erd-editor` で行った初期値の設定や畳み込みは、どのメモもテーブルグループに属していないスナップショットを書き込みます。[リリースの混在](./collaborative-editing.md#リリースの混在)を参照してください。  
各ログエントリーは、エディタが送ったままの 1 つのバッチで、メタ情報も含みます。メタ情報には送信元のエディタ ID とニックネームが入っています。  
スクロール、拡大・縮小、タブの切り替え、プレゼンス、レジスタのハンドシェイクは、ログに記録されません。エディタが送るそのほかの変更はすべて記録されます。[ロック](../../guide/guides/settings.md#ロック)の下で行った名前の表示の切り替えもその 1 つで、ほかのすべてのクライアントはこれを破棄します。  
ロックの下で変更した Code Generator の言語、名前のケース、括弧の種類は送られないため、そのエディタの画面にだけ残り、ルームには届きません。

永続化プロバイダが返した `Y.Doc` は、スナップショットを持つ任意の `Y.Doc` をバインディングが開くのと同じように、それが保持するダイアグラムを開きます。[使い方](#usage)を参照してください。

スナップショットはファイルではありません。そのランタイム値には削除されたエンティティが含まれますが、ファイルにはそれを含めてはなりません。  
ルームのダイアグラムをストレージに書き出すには、バインドした要素の [change](../erd-editor-element.md#change) イベントが発火するたびに、その [value](../erd-editor-element.md#value) を保存します。  
バインド後に 1 回、`value` を指定した [seed](#seed) の後に、そして [rejoin](#onrejoin) のリスナーでも保存してください。これらの読み込みはどれも `change` を発行しないためです。  
[読み取り専用](../erd-editor-element.md#readonly)の要素は `change` を発行しないため、読み取り専用ではない要素から保存するか、ルームの編集が届くたびに適用するバインド済みのピア store から `value` を読み取ってください。  
[replicationStore](./remote-storage.md) は、バインディングが必要とするメソッドを持たないため、バインドできません。また、バインドした要素の shared store から供給された replicationStore は、ルームの編集を受け取れません。[ライブエディタのレプリケーション](./remote-storage.md#ライブエディタのレプリケーション)を参照してください。

レイアウトは非公開で、[ERD_YJS_FORMAT](#exports) とともに変わることがあります。  
ルームはバインディングを通じてのみ読み取り、`erd:` で始まる名前と Awareness のフィールド `erd` はバインディングに任せてください。

## ルームのコンパクション {#compacting-a-room}

ルームの履歴は編集のたびに増え、何かが畳み込むまで、参加するクライアントはそのすべてを再生します。  
`bindPeerStore` は、`@dineug/erd-editor/peer.js` のヘッドレスのピア store をバインドし、`ErdYjsPeerBinding` を返します。同じ [seed](#seed)、[on](#erdyjsbinding)、[destroy](#destroy) に加えて、[compact](#compact) があります。  
サーバーの隣の Node プロセスにバインドしたピア store、つまりサイドカーは、履歴を自分のダイアグラムのスナップショットに畳み込みます。  
要素のバインディングは畳み込みを行いません。また、`compactAfter` も `compact()` の呼び出しもないピア store のバインディングは、通常のヘッドレスのピアです。

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

ピア store は利用する側のもので、バインディングがそれを破棄することはありません。ニックネームは `createPeerStore` に渡したものが使われ、`presence: false` により、自分のフォーカスは送られません。

畳み込みは、ピア store 自身のランタイム値、レジスタ、バージョンからスナップショットを書き、それが対象とするログエントリーと別の初期値のすべてのエントリーを、1 つのトランザクションで削除します。  
すべてを適用済みのクライアントには、エントリーが消えるだけに見えます。適用していなかったクライアントは、スナップショットで開き直します（[オフライン編集と再参加](#offline-edits-and-rejoins)を参照）。  
畳み込みのたびにダイアグラム全体がスナップショットに書き直されるため、取り込むエントリーがどれほど少なくても、毎回、ダイアグラムのランタイム JSON とレジスタを合わせたほどのサイズの更新がすべてのクライアントに送られます。畳み込みが取り込むエントリーが、ダイアグラム 1 つ分のコピーより大きくなるように、`compactAfter` を十分高く設定してください。

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| オプション | 既定値 | 説明 |
| --- | --- | --- |
| `awareness` | なし | [awareness](#awareness) が要素に対して行うように、ピア store をルームの Awareness に表示します。自分で畳み込むコンパクタはそこでマークされるため、互いが見えるコンパクタ同士で畳み込む 1 つを選出し、ほかのクライアントが見えないコンパクタは自分では何も畳み込みません。[ルームごとに 1 つのコンパクタ](#one-compactor-per-room)を参照してください。指定しない場合、コンパクタは選出も猶予もなく、自分で畳み込みます。 |
| `compactAfter` | なし | 畳み込みが取り込むログエントリーがこの数に達したら、自分で畳み込みます。指定しない場合、または `synced` がない場合に畳み込むのは、`compact()` と、戻す畳み込み（[ルームごとに 1 つのコンパクタ](#one-compactor-per-room)を参照）だけです。 |
| `synced` | なし | プロバイダの同期が済むと resolve される Promise です。`compact()` を含め、これより前には畳み込みません。指定しない場合、自分では何も畳み込まず、`compact()` はすぐに畳み込みます。 |
| `electionGraceMs` | `3000` | `awareness` を指定した場合に、`synced` の後、およびほかのクライアントが 1 つもいない状態から再び現れるたびに、コンパクタが自分で畳み込む前にルームを見守る時間です。 |
| `retainMs` | `600000`（10 分） | 畳み込んだエントリーを戻すために保持しておく時間です（[ルームごとに 1 つのコンパクタ](#one-compactor-per-room)を参照）。畳み込みの後にルームが最初に更新を送った時点から数えます。 |

無効なオプションや reject される `synced` は、[error](#onerror) を発生させます。

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

選出、猶予、しきい値なしで、すぐに畳み込みます。  
まず、再参加を含め、ルームの現在のスナップショットを取り込み、ピア store が保留しているものを送ります。  
畳み込んだ場合は `{ compacted: true, generation }` を返します。`generation` はスナップショットの畳み込み回数で、初期値の設定で書き込まれたものは `0`、畳み込みのたびに 1 ずつ増えます。  
そうでない場合は `{ compacted: false, reason }` を返します。

- `'destroyed'`: バインディングが破棄または停止された後、およびバインド時に[拒否された](#onerror)バインディングの場合です。`synced` が resolve される前でも同じです。
- `'not-synced'`: `synced` が resolve される前です。
- `'no-snapshot'`: どのクライアントも初期値を設定していないルームです。

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## ルームごとに 1 つのコンパクタ {#one-compactor-per-room}

ルームごとにコンパクタをちょうど 1 つ動かし、新しいコンパクタは古いものが停止してから起動してください。これを強制する仕組みはありません。  
Awareness で互いが見えるコンパクタのうち、Yjs のクライアント ID が最小のものだけが自分で畳み込みます。それが離れた場合や、その `synced` が reject された場合は、次のコンパクタがすぐに引き継ぎます。  
Awareness にほかのクライアントが表示されないコンパクタ（自分のソケットが閉じてすべてが消えた場合など）は、ほかが再び現れ、`electionGraceMs` の間ルームを見守るまで、自分では何も畳み込みません。

互いに切り離された 2 つのコンパクタや、前任がまだ動いている再起動では、それぞれが畳み込むことがあります。  
その場合、ルームには 2 つのスナップショットのうち 1 つが残り、スナップショットが負けたコンパクタは、勝った側が保持していない自分の畳み込み内容を、保持している間は戻します。保持するのは `retainMs` の間で、直近の最大 1,000 エントリーまでです。1 つ 1 つの大きさは問いません。  
そのため、スナップショットが負けたコンパクタが再接続した側であれば、離れている間に畳み込んだエントリーが 1,000 以下である限り、失われるものはありません。  
オンラインのままだった側で保持の期限が切れていた場合は、再び畳み込むまで、ルームのスナップショットと履歴にその畳み込み内容がありません。その編集を受け取れなかったクライアントや、その間に参加したクライアントには、それがなく、コンパクタが編集を畳み込んだ書き込み元それぞれの以降の編集も保留されます。コンパクタが次に畳み込むと、すべてが戻ります。ただし、勝ったスナップショットがコンパクタにない編集を保持していた場合は、そのスナップショットで開き直すことになり、畳み込んだ内容は完全に失われます。

コンパクタは、勝ったスナップショットに追いついてから、選出、猶予、しきい値なしで、自分の畳み込みとして戻します。すべてのクライアントがその畳み込みを `rejoin('snapshot')` で開き直します。  
戻された編集は、その畳み込み以外ではどのクライアントにも届きません。そのため、ずっとオンラインだったクライアントも、ほかのクライアントや後から参加するクライアントと同じ結果になります。別の書き込み元の後続の編集がそのうちの 1 つに依存している場合（別のクライアントが追加したテーブルの名前変更など）でも同様です。  
戻すたびに、すべてのクライアントがその再参加を負担し、[再参加で失われるもの](#offline-edits-and-rejoins)も失います。2 つのコンパクタが同時に戻した場合も、すべてのクライアントは同じ結果になりますが、ある編集が、それが依存する編集より先に適用されたままになることがあります。  
戻す畳み込みが実行される前にバインディングが破棄または停止された場合（`rejoin` のリスナーが破棄した場合など）は、代わりに編集だけを戻します。失われるものはありませんが、ずっとオンラインだったクライアントが、別の書き込み元のそれに依存する編集の後にそれを適用して、後から参加するクライアントと異なる結果になることがあります。

## 制限 {#limits}

- **ビューポートは各画面に残ります。** スクロール、拡大・縮小、タブの切り替えは[ログに記録されません](#what-the-room-holds)。ただし、`getSharedStore` でつないだセッションはこれらを送ります（そのセッションでも、ほかのユーザーの表示やタブは動きません）。各閲覧者は自分の状態を保持し、バインディングはそれを Awareness 状態にだけ示しますが、今のところそれを読むものはありません。`Viewport` または `Canvas Type` の[ロック](../../guide/guides/settings.md#ロック)がオフの場合、各クライアントの `value` は自分の状態を保存します。新しいドキュメントではオンになっているロックの下では、すべてのクライアントがロックした値を保存します。
- **スナップショットはバインディングごとに 1 エントリー増えます。** ルームに書き込んだことのあるすべてのバインディングについて、その編集がどこまで畳み込まれているかを保持し、削除することはありません。作り直したバインディングや、別の初期値に移ったバインディング、戻す畳み込みのたびにも、新しく数えられます。1 エントリーは 32 文字の ID と数値なので、1 万の書き込みセッションで、すべてのスナップショットと畳み込みに数百キロバイトが加わります。
- **ハブとルームは互いの間で何も中継しません。** ルームと、コーディングエージェントの[ハブ](../../mcp/live-and-headless.md#ライブ)、または `getSharedStore()` 経由のほかのトランスポートの両方にバインドした要素は、両方の編集を適用しますが、shared store は受け取ったものをさらに送らないため、どちらも相手の編集を聞くことはありません。
- **同時に行われた追加が別々の順序で並ぶことがあります。** 2 つのクライアントが同時に追加したテーブルやメモは、`getSharedStore` でつないだセッションと同じように、各クライアントのダイアグラムで異なる順序で並ぶことがあります。[同時編集](./collaborative-editing.md#concurrent-edits)を参照してください。
- **色や一部の変更を同時に行うと、結果が分かれることがあります。** 色の変更はバージョンなしでログに記録され、各クライアントは適用するときに自分のバージョンを付けます。そのため、1 つのテーブル、メモ、テーブルグループに対して 2 つの色の変更が同時に行われると、クライアントや、後から参加してログを再生するクライアントで、異なる色になることがあります。各クライアントが聞いた順に適用するそのほかの変更、例えば 1 つのテーブルまたはインデックス内での 2 つのカラムの移動や、データベースの 2 つの変更も同様です。[同時編集](./collaborative-editing.md#concurrent-edits)を参照してください。
- **離れるカーソルはサーバー次第です。** バインディングは、Awareness がピアのカーソルを削除するとすぐに消します。ソケットが閉じたときに、そのソケットが最初に追加した Awareness 状態だけを削除するサーバーでは、再接続したクライアントは、離れた後も Awareness がタイムアウトする 30 秒後まで、ほかのユーザーの画面に残ります。ソケットが最後に書き込んだすべての状態を、追加だけでなく更新も含めて削除するサーバーでは、すぐに消えます。

## エクスポート {#exports}

| エクスポート | 説明 |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | `<erd-editor>` 要素をバインドします。[使い方](#usage)を参照してください。[ErdYjsBinding](#erdyjsbinding) を返します。 |
| `bindPeerStore(peer, doc, options?)` | `@dineug/erd-editor/peer.js` のピア store をバインドします。[ルームのコンパクション](#compacting-a-room)を参照してください。同じものに [compact](#compact) を加えたもの（`ErdYjsPeerBinding`）を返します。 |
| `ERD_YJS_FORMAT` | このリリースが書き込む `Y.Doc` のレイアウトで、`1` です。バインディングは、別のレイアウトで書かれたルームを拒否します。 |

型: `BindOptions`、`PeerBindOptions`、`CompactOptions`、`CompactResult`、`BindingEvents`、`RejoinReason`、`ErdYjsBinding`、`ErdYjsPeerBinding`。
