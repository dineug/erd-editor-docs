---
sidebar_position: 2
description: メインスレッド外のヘッドレスな store へのライブエディタのレプリケーション、保存用のドキュメントのシリアライズ。
---

# リモート保存

変更のたびにエディタの状態全体を送信するのは非効率です。  
そのような場合のために、リアルタイムデータレプリケーションの API を提供します。

## インストール

```sh
npm install @dineug/erd-editor
```

レプリケーション用の store は、パッケージのルートではなく `@dineug/erd-editor/engine.js` のサブパスにあります。  
このエントリーポイントは DOM に触れないため、Web Worker をはじめとするメインスレッド外のどこでも動作します。  
パッケージのルートを読み込んだ場合は `<erd-editor>` カスタム要素が登録され、こちらは document を必要とします。

## 使い方

```ts
type ReplicationStore = {
  readonly value: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## ライブエディタのレプリケーション

アクションはライブエディタの shared store から流れてきます。  
[共同編集](./collaborative-editing.md)を参照してください。

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(savedJson);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

境界を越えるのは変更だけで、ドキュメント全体が送られることはありません。  
レプリカ側で変更を適用して結果をシリアライズします。  
`change` はその結果を `value` として渡し、`changed` が書き込むべきタイミングを知らせます。

## InjectEngineContext

### toWidth

文字列の幅をピクセル単位で計測します。  
store には DOM がないためテキストを自身で計測できず、名前、データ型、既定値、コメントが変わるたびに、この関数でカラム幅を再計算します。  
また、[setInitialValue](#setinitialvalue) がドキュメントを読み込むたびに、すべてのテーブルとカラムを計測し直します。  
そのため、別のマシンや別のリリースなど、テキストの計測結果が異なる環境で保存されたドキュメントはこの store の幅で読み込まれ、何も編集しないうちから `value` が保存されているテキストと異なります。  
[on@change](#onchange) が `changed` をファイルではなく読み込んだ時点を基準に判定するのはこのためです。

エディタと同じ方法で計測します。エディタのフォントスタックの `400 12px` で計測し、四捨五入した値に 2px のパディングを加えます。  
そうしないと、レプリケーションされたカラム幅が画面上の幅からずれていきます。

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` は canvas が利用できない場合のフォールバックです。  
ドキュメントを保存するだけで描画しない store には、これで十分です。

## ReplicationStore

### value getter

現在のエディタの状態をシリアライズします。  
パース済みのオブジェクトではなく、そのまま保存できる JSON 文字列を返します。

```js
const data = replicationStore.value;
```

シリアライズの際には、ドキュメント自身の `ignoreSaveSettings` が適用されます。  
スクロールのビットが立っている場合は表示の原点が `0, 0` として、拡大・縮小のビットが立っている場合は拡大・縮小のレベルが `1` として書き出されます。  
各ビットについては [Schema](./schema.md) を参照してください。

### setInitialValue

以前に保存したエディタの状態を読み込みます。

```js
replicationStore.setInitialValue('json...');
```

空文字列や文字列でない値を渡した場合は、エラーにはならず新しい空のドキュメントを読み込みます。  
一度も値を渡していない store も、同じ新しいドキュメントから始まります。  
`3.10.0` から、このドキュメントは表示位置も拡大・縮小のレベルも保存しません。[`Save Scroll Information`](../../guide/guides/settings.md#スクロール情報の保存) と [`Save Zoom Information`](../../guide/guides/settings.md#拡大縮小情報の保存) をオフにした場合と同じく、`ignoreSaveSettings` の両方のビットが立っています。`3.10.0` より前は両方を保存していました。  
保存されたドキュメントはそこに指定されているスイッチの設定を保ち、何も指定されていないドキュメントは、v2 のドキュメントも含めて両方を保存します。  
マージコンフリクトのマーカーが残ったファイルなど、JSON でないテキストもエラーにはなりません。パースエラーがコンソールに出力されるだけで、ドキュメントは空になり、設定はそのまま保たれます。

読み込み時には、ドキュメントに対するガベージコレクションも実行されます。  
`doc` に現れなくなり、かつ 4 日以上変更されていないエンティティが削除されるため、他のユーザーが編集中の変更が回収されることはありません。  
`3.10.0` から、この処理は `setInitialValue` が戻る前に完了します。  
読み込みに伴うほかの書き換えも同様で、`3.10.0` より前はその後の数ミリ秒の間に行われていました。対象は、リレーションシップから読み直すカラムの外部キーのマーク、`toWidth` で計測し直すすべてのテーブルとカラムの幅、各コネクタがテーブルに接する位置、そして各リレーションシップの識別リレーションシップかどうかのフラグと親側の端の記号です。  
そのため、呼び出しの直後に読み取った `replicationStore.value` は、すでに回収と書き換えをすべて終えたドキュメントです。再生されたスクロールのように読み込みの直後に届いたアクションはこのドキュメントを基準に判定されるため、読み込み自体による書き換えが [`changed`](#onchange) として報告されることはありません。

読み込みも、これらのいずれの書き換えも `change` を発行しません。  
そのドキュメントを書き戻したい場合は、`setInitialValue` が戻ったあとに自分で `replicationStore.value` を読み取ります。

### on@change

エディタの状態変更イベントを購読します。

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` には 200ms のデバウンスが掛かるため、連続したアクションは 1 回の通知としてまとまります。  
ドキュメントを変更しうる種類のアクションに対してのみ発行されるため、中継されたプレゼンスのアクションで発火することはありません。  
購読を解除するには、返された関数を呼び出します。

`3.10.0` から、リスナーは `ReplicationChange` を受け取ります。`@dineug/erd-editor/engine.js` が `ReplicationStore` と並べてエクスポートしている型です。  
`3.10.0` より前は何も受け取りませんでした。引数を無視するリスナーも、引き続き動作します。  
`value` はシリアライズされたドキュメントで、その時点で `replicationStore.value` が返すものと同じ文字列のため、改めてシリアライズする必要はありません。  
`changed` は、前回の `change` 以降、または読み込み以降のアクションによって `value` が 1 バイトも変わらなかった場合に `false` になります。

ドキュメントの保存スイッチによって `value` に含まれないスクロールや拡大・縮小でも `change` は発行され、その場合 `changed` は `false` になります。そのため、書き込むのは `changed` が `true` のときだけにします。  
`Save Scroll Information` がオフの場合、スクロールは何も変えません。  
拡大・縮小は表示の原点も動かすため、何も変えないのは `Save Zoom Information` と `Save Scroll Information` が両方オフの場合だけです。`Save Zoom Information` だけがオフの場合は、`value` が変わります。  
エディタの別のタブを開くと、どちらのスイッチの対象でもないため、`value` は必ず変わります。

`changed` が保存済みのファイルと比較されることはありません。ファイルは読み込んだ時点で、すでに `value` と異なっていることがあるからです。[toWidth](#towidth) で説明したとおりテキストの計測結果が異なる環境で保存されたファイルがそうであり、表示の原点を持たないファイルも同様です。  
ファイルとバイト単位で比較すると、スイッチによって含まれないスクロールまで編集として数えてしまいます。  
`change` が保留されている間に `setInitialValue` が呼ばれ、その発行までに何も dispatch されなかった場合も、その `change` はそのまま届きます。`value` は読み込んだドキュメントで、`changed` は `false` です。

### dispatch, dispatchSync

リモートのエディタの変更を replicationStore に反映します。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` はマイクロタスクに遅延させ、`dispatchSync` はバッチをその場で適用します。

shared store のストリームは、フィルタリングせずにそのまま渡せます。  
どちらのメソッドもドキュメントを変更しうる種類のアクションだけを残して他は破棄するため、共同編集セッションが運ぶプレゼンス（各ユーザーのマウスカーソル、フォーカス、選択、ドラッグボックス）は何もしない処理として通過します。

`3.10.0` から、残されるアクションに `relationship.changeOnDelete` と `relationship.changeOnUpdate` が加わり、`relationship.add` は `onDelete` と `onUpdate` を運びます。  
それより前のリリースの store はこれらのアクションを破棄し、これらのフィールドを無視するため、リレーションシップの [ON DELETE と ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) のアクションが失われます。  
レプリカは、エディタと同じリリースか、それより新しいリリースで実行します。

### destroy

replicationStore のインスタンスを完全に破棄します。

```js
replicationStore.destroy();
```

破棄したあとは `change` の発行を停止し、以降の dispatch を無視します。  
エラーになるのではなく、ドキュメントは最後の値のまま固定されます。  
再び使い始めるには、新しい store を作成します。
