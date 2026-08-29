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
  on: (listeners: Partial<{ change: () => void }>) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
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
  change: () => save(replicationStore.value),
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

境界を越えるのは変更だけで、ドキュメント全体が送られることはありません。  
レプリカ側で変更を適用して結果をシリアライズし、`change` が書き込むべきタイミングを知らせます。

## InjectEngineContext

### toWidth

文字列の幅をピクセル単位で計測します。  
store には DOM がないためテキストを自身で計測できず、名前、データ型、既定値、コメントが変わるたびに、この関数でカラム幅を再計算します。

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
スクロールのビットが立っている場合はスクロール位置が `0` として、拡大・縮小のビットが立っている場合は拡大・縮小のレベルが `1` として書き出されます。  
各ビットについては [Schema](./schema.md) を参照してください。

### setInitialValue

以前に保存したエディタの状態を読み込みます。

```js
replicationStore.setInitialValue('json...');
```

空文字列や文字列でない値を渡した場合は、エラーにはならず空のドキュメントを読み込みます。

読み込み時には、ドキュメントに対するガベージコレクションも実行されます。  
`doc` に現れなくなり、かつ 4 日以上変更されていないエンティティが削除されるため、他のユーザーが編集中の変更が回収されることはありません。  
この処理は非同期で完了します。

読み込みもガベージコレクションも `change` を発行しません。  
回収後のドキュメントを書き戻したい場合は、読み込みのあとに自分で `replicationStore.value` を読み取ります。

### on@change

エディタの状態変更イベントを購読します。

```js
const unsubscribe = replicationStore.on({
  change: () => {
    const data = replicationStore.value;
    // save...
  },
});
```

`change` には 200ms のデバウンスが掛かるため、連続したアクションは 1 回の通知としてまとまります。  
ドキュメントを変更するアクションに対してのみ発行されるため、中継されたプレゼンスのアクションで発火することはありません。  
購読を解除するには、返された関数を呼び出します。

### dispatch, dispatchSync

リモートのエディタの変更を replicationStore に反映します。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` はマイクロタスクに遅延させ、`dispatchSync` はバッチをその場で適用します。

shared store のストリームは、フィルタリングせずにそのまま渡せます。  
どちらのメソッドもドキュメントを変更するアクションだけを残して他は破棄するため、共同編集セッションが運ぶプレゼンス（各ユーザーのマウスカーソル、フォーカス、選択、ドラッグボックス）は何もしない処理として通過します。

### destroy

replicationStore のインスタンスを完全に破棄します。

```js
replicationStore.destroy();
```

破棄したあとは `change` の発行を停止し、以降の dispatch を無視します。  
エラーになるのではなく、ドキュメントは最後の値のまま固定されます。  
再び使い始めるには、新しい store を作成します。
