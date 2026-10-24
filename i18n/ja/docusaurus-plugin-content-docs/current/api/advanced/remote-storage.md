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
パッケージのルートを読み込んだ場合は `<erd-editor>` カスタム要素が登録され、こちらは DOM のドキュメントを必要とします。

## 使い方

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
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
replicationStore.setInitialValue(editor.runtimeValue);

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

`4.0.0` からは、上の例のように、保存されたファイルやエディタの `value` ではなく、エディタの `runtimeValue` でレプリカに初期値を設定します。  
ファイルには保存したあとに行った編集が含まれず、`value` にはセッション中に削除したエンティティが含まれません。  
削除したテーブルを持たないまま初期値を設定したレプリカでは、エディタがその削除を Undo すると、テーブルは名前もカラムもない状態で戻り、そのまま保存されます。  
`4.2.0` からは、[辞書](../../guide/guides/dictionary.md)のシートから削除した単語、用語、ドメインも同じです。  
エディタがその削除を Undo すると、その行を持たないまま初期値を設定したレプリカでは、行が空の状態で戻ります。`value` は空の行を含めないため、レプリカはその行を含まないドキュメントを保存します。  
ドメインの場合は、そのドメインに紐付いていたカラムと用語も、そのレプリカでは紐付けが解除されたままになります。レプリカは紐付けを一度も保持しておらず、Undo も紐付けを送らないためです。

## InjectEngineContext

### toWidth

文字列の幅をピクセル単位で計測します。  
store には DOM がないためテキストを自身で計測できず、名前、データ型、既定値、コメントが変わるたびに、この関数でカラム幅を再計算します。  
`4.2.0` からは、テーブルやカラムの[論理名](../../guide/guides/logical-names.md)もこれに含まれます。  
カラムのドメインのセルには、カラムが紐付けているドメインの名前が表示されます。このセルは、カラムがドメインに紐付けられたときや紐付けが解除されたとき、そしてそのドメインが追加されたとき、名前が変更されたとき、削除されたときに計測されます。  
また、[setInitialValue](#setinitialvalue) がドキュメントを読み込むたびに、すべてのテーブルとカラムを計測し直します。  
`4.0.0` からは、幅は [runtimeValue](#runtimevalue-getter) にだけ保持され、`value` に含まれることはありません。  
そのため、このリリースで保存したドキュメントは、どこで保存され、そこでテキストがどのように計測されたかにかかわらず、1 バイトも違わない同じ `value` として読み込まれます。

エディタと同じ方法で計測します。エディタのフォントスタックの `400 12px` で計測し、四捨五入した値に 2px のパディングを加えます。  
そうしないと、`runtimeValue` の幅が画面上の幅からずれていきます。

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

`4.0.0` からは、`value` は保存形式、つまりファイルが保持する形式のドキュメントで、要素の [value](../erd-editor-element.md#value) が返すものと同じテキストです。  
含まれるのは現存するエンティティだけで、決まった順序で並び、削除したエンティティ、重なり順、そして [toWidth](#towidth) が計測する幅のように読み込み時に改めて求めるものは含まれません。  
`4.2.0` からは、論理名、各名前が辞書から生成されたものかどうか、ドメインの紐付け、そして[辞書](../../guide/guides/dictionary.md)タブの単語、用語、ドメインも含まれます。  
また `4.2.0` からは、エンティティの空のテキストフィールド、何も持たない `doc` のリストとコレクション、すべてのコレクションが空の場合の `collections` 自体も含まれません。  
2 つのスペースでインデントされ、辞書の各行がそれぞれ 1 行に書き出され、改行で終わるため、同じドキュメントからは常に同じバイト列が得られます。  
含まれる内容については[保存形式とランタイム値](./schema.md#保存形式とランタイム値)を参照してください。

[ロック](../../guide/guides/settings.md#ロック)がオンの設定はロックした時点の値で書き出され、それ以外の設定は現在の値のまま書き出されます。  
`Viewport` のロックは表示の原点と拡大・縮小のレベルをまとめて扱い、タブ、Code Generator の言語、2 つの名前のケース、括弧の種類には、それぞれ専用のロックがあります。  
`4.2.0` からは[名前の表示](../../guide/guides/logical-names.md#name-view)にも専用のロックがあり、その `Name View` のロックは新しいドキュメントではオンになっています。  
ロックはドキュメントの `ignoreSaveSettings` に代わるもので、`ignoreSaveSettings` は `4.0.0` から読み取りも書き込みもされません。  
`4.0.0` より前の `value` は、store が保持しているとおりのドキュメント全体に、そのフィールドのスクロールと拡大・縮小のビットを適用したものでした。

### runtimeValue getter

`4.0.0` からは、レプリカが保持しているとおりのドキュメントを、削除したエンティティと読み込み時に求めるすべてのものを含めてシリアライズします。  
ここでも、ロックされた設定はロックされた値で書き出されます。

```js
const snapshot = replicationStore.runtimeValue;
```

後から参加するエディタや別の store に、その `setInitialValue` で初期値を設定するために使います。[共同編集](./collaborative-editing.md)を参照してください。  
ファイルとしては決して保存しないでください。削除したエンティティを含むため、公開されている [JSON Schema](./schema.md#json-schema) はこれを受け付けません。  
後から削除の Undo が送られてきたときに、これで初期値を設定した store でエンティティが元のとおりに戻るのは、これらの削除したエンティティがあるからです。  
これらは、次にドキュメントをファイルから開くまで残ります。ファイルの形式には含まれないためです。

### setInitialValue

以前に保存したエディタの状態を読み込みます。

```js
replicationStore.setInitialValue('json...');
```

保存形式、ランタイム値、v2 のドキュメントを含む以前のリリースで保存したドキュメントのいずれも受け付けます。  
空文字列や文字列でない値を渡した場合は、エラーにはならず新しい空のドキュメントを読み込みます。  
一度も値を渡していない store も、同じ新しいドキュメントから始まります。  
`4.0.0` からは、このドキュメントはすべての[ロック](../../guide/guides/settings.md#ロック)がオンのため、レプリケーション元のエディタがスクロール、拡大・縮小、タブの切り替え、これらの設定の変更を行っても、その `value` は開始時の表示、タブ、Code Generator の言語、名前のケース、括弧の種類を保ちます。`3.10.0` では表示位置も拡大・縮小のレベルも保存せず、それより前は両方を保存していました。  
`4.2.0` からは、エディタが名前の表示を切り替えても、自身の名前の表示である `Physical Names` も保ちます。  
保存されたドキュメントは、そこに指定されているロックを保ちます。  
何も指定されていないドキュメント、つまり v2 のドキュメントを含め `4.0.0` より前に保存したすべてのドキュメントは、すべてのロックがオンの状態で読み込まれます。保存されていた内容にかかわらず、表示の原点は `0, 0`、拡大・縮小のレベルは `1`、タブは ERD になり、Code Generator の言語、名前のケース、括弧の種類は保存されたときのままです。  
`4.2.0` より前に保存したドキュメントは `Name View` のロックを指定していないため、他のロックがすべてオフで保存されたものでも、そのロックがオンで `Physical Names` の状態で読み込まれます。  
`4.0.0` からは、`setInitialValue` は、要素の [setInitialValue](../erd-editor-element.md#setinitialvalue) と同じように、それまでのドキュメントのために保持していた共同編集用のレジスタも破棄します。  
マージコンフリクトのマーカーが残ったファイルなど、JSON でないテキストもエラーにはなりません。パースエラーがコンソールに出力されるだけで、ドキュメントは空になり、設定はそのまま保たれます。

`4.0.0` からは、読み込み時にガベージコレクションは実行されないため、削除したエンティティは [runtimeValue](#runtimevalue-getter) に残ります。  
それより前は、`doc` に現れなくなり、かつ 4 日以上変更されていないエンティティを削除していました。

読み込みに伴う書き換えは、`setInitialValue` が戻る前に完了します。対象は、各カラムのオプションとリレーションシップから読み直すカラムのキーのマーク、`toWidth` で計測し直すすべてのテーブルとカラムの幅、各コネクタがテーブルに接する位置、そして各リレーションシップの識別リレーションシップかどうかのフラグと親側の端の記号です。  
どれも `value` には含まれませんが、呼び出しの直後に読み取った `replicationStore.runtimeValue` は、すでにそれらをすべて保持しています。  
再生されたスクロールのように読み込みの直後に届いたアクションは、読み込んだドキュメントを基準に判定されるため、読み込み自体が [`changed`](#onchange) として報告されることはありません。

読み込みも、これらのいずれの書き換えも `change` を発行しません。  
読み込んだドキュメントを保存形式で書き戻したい場合は、`setInitialValue` が戻ったあとに自分で `replicationStore.value` を読み取ります。

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
ドキュメントを変更しうる種類のアクションと、古いエディタが送ってくることのある `settings.changeIgnoreSaveSettings` に対してのみ発行されます（[dispatch, dispatchSync](#dispatch-dispatchsync) を参照してください）。  
中継された操作状況のアクションや `editor.mergeLWW` で発火することはありません。  
購読を解除するには、返された関数を呼び出します。

`3.10.0` からは、リスナーは `ReplicationChange` を受け取ります。`@dineug/erd-editor/engine.js` が `ReplicationStore` と並べてエクスポートしている型です。  
`3.10.0` より前は何も受け取りませんでした。引数を無視するリスナーも、引き続き動作します。  
`value` は保存形式でシリアライズされたドキュメントで、その時点で `replicationStore.value` が返すものと同じ文字列のため、改めてシリアライズする必要はありません。  
`changed` は、前回の `change` 以降、または読み込み以降のアクションによって `value` が 1 バイトも変わらなかった場合に `false` になります。

[ロック](../../guide/guides/settings.md#ロック)によって `value` に含まれない変更でも `change` は発行され、その場合 `changed` は `false` になります。そのため、書き込むのは `changed` が `true` のときだけにします。  
`Viewport` がロックされている間のスクロールや拡大・縮小、`Canvas Type` がロックされている間のタブの切り替え、そして対応するロックがオンの間の Code Generator の言語、名前のケース、括弧の種類の変更がこれにあたります。  
`4.2.0` からは、`Name View` がロックされている間の名前の表示の切り替えもこれにあたります。エディタは切り替えを送信しますが、レプリカは他のエディタと同じようにそれを破棄します。  
読み取り専用のエディタで行った名前の表示の切り替えも、ロックにかかわらず同じように破棄されます。  
要素の [change](../erd-editor-element.md#change) イベントはこのような変更を除外しますが、レプリカは引き続き報告します。  
新しいドキュメントと `4.0.0` より前に保存したドキュメントでは、すべてのロックがオンです。また、`4.2.0` より前に保存したすべてのドキュメントでは `Name View` がロックされています。  
`Viewport` のロックがオフの場合はスクロールや拡大・縮小で `value` が変わり、`Canvas Type` のロックがオフの場合はエディタの別のタブを開いても、`Name View` のロックがオフの場合は読み取り専用でないエディタからの名前の表示の切り替えでも `value` が変わります。  
ロックをオンまたはオフにした場合も、`value` は変わります。

`4.0.0` からは、`changed` は保存形式を比較します。保存形式には、削除したエンティティも重なり順も含まれません。  
そのため、1 回の `change` の間に追加されて再び削除されたテーブル、別の共同編集者が削除したエンティティに対する編集、重なり順だけが変わる中継された読み込みも、すべて `changed` が `false` になります。  
`4.2.0` からは、辞書のシートに追加して空のままにした行も同様です。保存形式は何も持たない行を含めないためです。

`changed` が保存済みのファイルと比較されることはありません。ファイルは読み込んだ時点で、すでに `value` と異なっていることがあるからです。v2 のファイルを含め、以前のリリースで保存したファイルがそうであり、バイトオーダーマークで始まるファイルや手で編集したファイルも同様です。  
`4.2.0` からは、`4.0.0` または `4.1.0` で保存したファイルもこれにあたります。そのようなファイルが持つエンティティの空のテキストフィールドや、空の `doc` のリストとコレクションを、`value` は含めないためです。  
そのようなファイルとバイト単位で比較すると、ロックによって含まれないスクロールまで編集として数えてしまいます。  
`changed` が `true` になる最初の `change` は、そのようなファイルを保存形式で返すため、それを書き込むとファイルは一度だけ書き直されます。  
[toWidth](#towidth) で説明したとおり、このリリースで保存したファイルは、どこで保存されたものでも異なることはありません。  
`change` が保留されている間に `setInitialValue` が呼ばれ、その発行までに何も dispatch されなかった場合も、その `change` はそのまま届きます。`value` は読み込んだドキュメントで、`changed` は `false` です。

### dispatch, dispatchSync

リモートのエディタの変更を replicationStore に反映します。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` は適用をマイクロタスクまで遅らせ、`dispatchSync` はバッチをその場で適用します。

shared store のストリームは、フィルタリングせずにそのまま渡せます。  
どちらのメソッドも、ドキュメントを変更しうる種類のアクションと、この節の最後で説明する 2 つのアクションだけを残して他は破棄するため、共同編集セッションが運ぶ操作状況（各ユーザーのマウスカーソル、フォーカス、選択、ドラッグボックス）は何もしない処理として通過します。

`3.10.0` からは、残されるアクションに `relationship.changeOnDelete` と `relationship.changeOnUpdate` が加わり、`relationship.add` は `onDelete` と `onUpdate` を運びます。  
それより前のリリースの store はこれらのアクションを破棄し、これらのフィールドを無視するため、リレーションシップの [ON DELETE と ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) のアクションが失われます。

`4.0.0` からは、残されるアクションに `table.changeGroup`、8 つの `tableGroup` のアクションのうち 7 つ（重なり順を変える `tableGroup.changeZIndex` を除く `tableGroup.add`、`tableGroup.move`、`tableGroup.moveTo`、`tableGroup.remove`、`tableGroup.resize`、`tableGroup.changeName`、`tableGroup.changeColor`）、`relationship.changeColumns`、`settings.changeLockSettings`、`settings.changeDDLScript` も加わります。  
`settings.changeRelationshipOptimization` はなくなったため、どちらのメソッドも破棄します。  
それより前のリリースの store は新しいアクションを破棄するため、[テーブルグループ](../../guide/guides/table-groups.md)、[ロック](../../guide/guides/settings.md#ロック)、[Schema SQL](../../guide/guides/schema-sql.md) のスクリプト、そして [Map Columns](../../guide/guides/relationship-editing.md#map-columns) が既存のリレーションシップに設定するカラムが失われます。  
レプリカは、エディタと同じリリースか、それより新しいリリースで実行します。

`4.1.0` は新しい種類のアクションを追加せず、`@dineug/erd-editor/engine.js` もそのままにしているため、`4.0.0` のレプリカも、`4.1.0` のレプリカと同じように、`4.1.0` のエディタが送るすべての変更を残します。  
`4.1.0` からは、[検索と置換](../../guide/guides/find-and-replace.md#replacing)の `Replace` と `Replace All` は、`4.0.0` のレプリカがすでに残している `index.changeName` と `tableGroup.changeName` のアクションで、インデックスとテーブルグループの名前も変更します。  
[エクスプローラー](../../guide/guides/explorer.md)自体の状態は送信されることがなく、エクスプローラーが行うタブの切り替えやスクロールは、他のタブの切り替えやスクロールと同じように届きます。[共同編集](./collaborative-editing.md)を参照してください。

`4.2.0` からは、残されるアクションに `table.changeLogicalName`、`table.changeNameDerived`、`column.changeLogicalName`、`column.changeDomain`、`column.changeNameDerived`、`settings.changeNameViewMode`、そして[辞書](../../guide/guides/dictionary.md)のシートでのすべての編集、並べ替え、CSV の読み込みを運ぶ `dictionary.add`、`dictionary.update`、`dictionary.remove` も加わります。  
名前の表示の切り替えのうち、レプリカが適用するのは、`Name View` のロックがオフの間に読み取り専用でないエディタが行ったものだけで、それ以外は破棄します（[on@change](#onchange) を参照してください）。  
それより前のリリースの store はこれらのアクションをすべて破棄するため、[論理名](../../guide/guides/logical-names.md)、ドメインの紐付け、各名前が辞書から生成されたものかどうか、単語、用語、ドメイン、そして名前の表示が失われます。  
セッション内に `4.2.0` より前のエディタがある場合は、`4.2.0` のレプリカからもその一部が失われることがあります。  
そのエディタでの Schema SQL、GraphQL、DBML、AML の `Import` は、`Import and Add` ではない場合、レプリカの単語、用語、ドメインを空にします。  
そのエディタでドキュメントの読み込み、`Import`、`clear()` を Undo すると、そのエディタが持つドキュメントのコピーが、論理名、ドメインの紐付け、辞書のない状態でレプリカに読み込まれます。[リリースの混在](./collaborative-editing.md#リリースの混在)を参照してください。  
`@dineug/erd-editor/engine.js` は以前と同じ `createReplicationStore`、`ReplicationStore`、`ReplicationChange` をエクスポートし、`createReplicationStore` は同じコンテキストを受け取ります。

`4.0.0` からは、両方のメソッドが `editor.mergeLWW` も適用します。これは、別のエディタがセッションに参加したときにエディタが応答として送る共同編集用のレジスタを運ぶアクションで、これによりレプリカはエディタと同じように、同時に行われた編集を調停します。  
`value` を 1 バイトも変えず、`change` も発行しません。  
`4.0.0` より前にリリースされたエディタが送ってくることのある `settings.changeIgnoreSaveSettings` は、残されますが何も変えません。`changed` が `false` の `change` を発行します。

### destroy

replicationStore のインスタンスを完全に破棄します。

```js
replicationStore.destroy();
```

破棄したあとは `change` の発行を停止し、以降の dispatch を無視します。  
エラーになるのではなく、ドキュメントは最後の値のまま固定されます。  
再び使い始めるには、新しい store を作成します。
