---
sidebar_position: 1
description: getSharedStore によるエディタ間の変更の中継、runtimeValue を使った参加するエディタへの初期値の設定、参加者ごとのマウスカーソル、フォーカス、選択、ドラッグボックスの表示。
---

# 共同編集

`getSharedStore()` は、エディタを共同編集セッションのノードにします。  
すべての変更をアクションのストリームとして発行し、他のエディタから送られてきたアクションを適用します。エディタ間をつなぐトランスポート（WebSocket、WebRTC、その他 JSON を運べるもの）は利用者側で用意します。  
[ErdEditorElement](../erd-editor-element.md) のメソッドの 1 つで、中継した変更を保存する必要がある場合は [リモート保存](./remote-storage.md) と組み合わせて使います。

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

アクションはドキュメントへの 1 つの変更を表す単純なシリアライズ可能なオブジェクトであり、トランスポートへ渡す途中で `JSON.stringify` を通しても壊れません。  
アクションはバッチで届き、`subscribe` が渡す配列が 1 つの単位となるため、配列全体をそのまま中継し、受け取り側でも配列全体をそのまま dispatch します。  
アクションが持つ管理情報がエディタ間の同期を支えているため、内容を読んだり書き換えたりせず、不透明な値としてそのまま受け渡します。

エディタで行う操作の中には、そのエディタだけにとどまるものがあります。  
選択したときのようにテーブル、メモ、テーブルグループを前面に移しても、それは送信されません。  
[Schema SQL](../../guide/guides/schema-sql.md) タブの `Statements`、`Header`、`Write logical names into empty comments`（`4.2.0` から）、`Tables` の選択も、それを選んだウィンドウに属するため、送信されません。  
`4.1.0` からは、[エクスプローラー](../../guide/guides/explorer.md)もそのエディタだけにとどまります。開いているかどうか、幅、折りたたんだ行、キーボードの行、ツリーのスクロールの位置、検索とオプションは送信されません。  
外部キーへ移動したときにそのリレーションシップのコネクタに付く[強調表示](../../guide/guides/relationship-editing.md#reading-a-connector)も送信されません。  
`4.2.0` からは、[辞書](../../guide/guides/dictionary.md)タブもそのエディタだけにとどまります。どのシートを表示しているか、各シートの検索、選択、スクロール、列幅は送信されません。辞書タブでの編集、並べ替え、CSV の読み込みは送信されます。  
スクロール、拡大・縮小、タブの切り替えは送信されますが、他のユーザーのビューやタブを動かすことはありません。エクスプローラーからの移動で行われるスクロール、別のタブからエクスプローラーを開いたときの ERD タブへの切り替え、辞書タブの [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) シートからテーブルやカラムへ移動したときのタブの切り替えとスクロールも同じです。そのシートから単語、用語、ドメインへの移動は辞書タブの中にとどまるため、どれも送信されません。

`4.2.0` からは、[名前の表示](../../guide/guides/logical-names.md#switching-the-view)の切り替えも送信され、他のエディタがそれをどう扱うかは、その[ロック](../../guide/guides/settings.md#ロック)で決まります。`Name View` のロックは、新しいダイアグラムと、`4.2.0` より前のすべてのドキュメントでオンになっています。  
ロックがオンの間は、切り替えはそれを行ったエディタにだけ反映されます。切り替え自体は送信されますが、他のすべてのエディタとすべてのレプリカはそれを破棄するため、`value` がロックした表示を保ったまま、ユーザーごとに異なる表示を見ることができます。言語、名前のケース、括弧の種類の変更はこれと異なり、ロックがオンかどうかにかかわらず、すべてのエディタに届きます。  
ロックがオフの間は、編集できるエディタで行った切り替えによって、すべてのエディタとレプリカの名前の表示が変わります。最後に行われた切り替えが有効になり、どのエディタとレプリカもその表示を保存します。  
読み取り専用のエディタ自身の切り替えは常にそのエディタだけにとどまり、そのエディタも、他のエディタから共有される切り替えには引き続き従います。

`5.0.0` からは、[読み取り専用](../erd-editor-element.md#readonly)のエディタは変更をまったく送信しません。その閲覧者が変更するスクロール、拡大・縮小、タブ、名前の表示、データベース、Code Generator の言語、名前のケース、括弧の種類、`View Option` の行は、ロックの状態にかかわらずそのエディタの画面にとどまります。`5.0.0` より前は、そのスクロール、拡大・縮小、タブの切り替え、データベース、コード設定が、編集できるエディタと同じように送信されていました。  
そのストアは、トラッカーが送る閲覧者のカーソル、フォーカス、選択、ドラッグ範囲は引き続き送信し、参加するエディタが求めるレジスターに応答し、他のエディタが送るすべての変更を適用します。データベース、Code Generator の設定、`View Option` の行の変更はそのドキュメントに届き、閲覧者がその画面でその設定を変更していなければ画面にも届きます。共有された名前の表示の切り替えは、どちらの場合も画面に反映されます。  
エディタが読み取り専用になるとき、まずドラッグやスクロールについてストアがまだ保留している分を、[flushStreamBuffers](#flushstreambuffers) と同じように送信するため、他のエディタには最後の状態まで届きます。

[ロック](../../guide/guides/settings.md#ロック)は共有されます。設定ごとに最後に行われたロックまたはロックの解除がすべてのエディタで有効になり、ロックはそれをオンにしたエディタの値を伴うため、すべてのエディタとレプリカが同じ値を保存します。  
そのため、`Viewport` のロックはそれをオンにしたエディタのビューを保存し、`Canvas Type` のロックは、ロックをオンにする設定タブを開く前にそのエディタが最後に開いていたタブを保存します。  
`Language`、`Table Name Case`、`Column Name Case`、`Bracket Type`、または `4.2.0` からは `Name View` のロックをオフにすると、すべてのエディタのその設定も、ロックをオフにしたエディタに表示されている値になるため、引き続き 1 つの値が保存されます。`Viewport` や `Canvas Type` のロックをオフにしても、誰のビューもタブも動きません。

`Before tables` または `After tables` のスクリプトの編集は、そのフィールドがフォーカスを失ったときに全体が送信されます。2 つのスクリプトはそれぞれ別に調停されるため、共同編集者が一方を編集しても、もう一方が上書きされることはありません。

Visualization タブの [Flow モード](../../guide/guides/visualization.md#flow-never-edits-the-document)で行う操作はどれもドキュメントの変更ではないため、Flow を表示しているエディタは他のエディタに変更を送らず、その間も他のエディタから送られてくる変更は引き続き適用されます。  
例外は 2 つあります。Flow から別のタブへ移ることはタブの切り替えであり、他のタブの切り替えと同じように送信されます。`4.2.0` からは、Flow のツールバーにある名前の表示の一覧での選択は名前の表示の切り替えであり、キャンバスで行った切り替えと同じように送信され、適用されます。  
Flow で[ビューを前後にたどる](../../guide/guides/visualization.md#previous-table-and-next-table)`Previous table`、`Next table`、Undo と Redo のキーは送信されません。  
カードの外部リンクボタン、`#`、`@`、`:` の後に選んだ[クイック検索](../../guide/guides/quick-search.md#searching-the-diagram)の結果、[エクスプローラー](../../guide/guides/explorer.md#opening-and-closing)を開く操作は、どれも Flow から ERD タブへ移ります。カードのボタンやクイック検索の結果がそこで行うスクロールも送信されます。

## 1 つのページに 2 つのエディタ

ここでの subscribe から dispatch への接続はネットワークの代わりであり、トランスポートを挟まずにセッションの形を確認できます。

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

ここでは両方のエディタが同じ新しい空のドキュメントから始まるため、どちらにも初期値を設定する必要はありません。  
エディタが 3 つ以上ある場合は、各エディタのバッチを他のすべてのエディタへ送ります。エディタは受け取ったものを他のエディタへ転送しません。

## 参加者への初期値の設定

shared store は変更が行われるたびにそれを中継しますが、その時点のドキュメントを参加者に渡すことはありません。そのため、すでに進行中のセッションに参加するエディタには、先にドキュメントを渡す必要があります。  
`4.0.0` からは、`value` や保存されたファイルではなく、すでにセッションにいるエディタの [`runtimeValue`](../erd-editor-element.md#runtimevalue) で初期値を設定します。

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

ランタイム値には、ドキュメントを開いてから削除されたものも残っているため、後で他のエディタが削除を Undo すると、参加したエディタでもテーブルが名前とカラムを持った状態で戻ります。  
[`value`](../erd-editor-element.md#value) はファイルが保持する形式で、削除されたエンティティを含まないため、`value` やファイルから初期値を設定した参加者では、代わりに名前のない空のテーブルが戻ります。  
`4.2.0` からは、[辞書](../../guide/guides/dictionary.md)のシートから削除した単語、用語、ドメインも同じです。他のエディタが削除を Undo すると、`runtimeValue` から初期値を設定した参加者ではその行が元どおりに表示され、`value` から初期値を設定した参加者では空の行が表示され、その参加者自身の `value` にはその行が含まれません。  
ストレージには引き続き `value` を書き込みます。`runtimeValue` は、別のエディタ、2 つ目のビュー、[replicationStore](./remote-storage.md) に初期値を設定するためだけのものです。  
VS Code、Obsidian、JetBrains IDE、Web アプリのエディタは、開いているドキュメントの 2 つ目のビューにこの方法で初期値を設定します。

`setInitialValue` は中継されないため、参加者に初期値を設定しても他のエディタでは何も変わりません。  
`4.0.0` からは、同時に行われた編集を調停する、エディタの共同編集用のレジスタも破棄します。そのエディタの shared store にすでに購読者がいたことがある場合、store は最初の [subscribe](#subscribe) のときと同じように他のエディタにレジスタを改めて要求するため、セッションの途中で読み込み直したエディタも、他のエディタと同じように編集を調停します。  
`value` への代入はレジスタを保持しますが、`setInitialValue` とは異なり中継されます。エディタが shared store を持つと、セッション内のすべてのエディタが代入したドキュメントを読み込むため、この方法で参加者に初期値を設定しないでください。

## リリースの混在

エディタは自身のリリースが知っているアクションの種類だけを適用するため、リリースが混在するセッションでは、古いエディタは新しい種類のアクションで送られる変更をすべて取りこぼします。

`3.10.0` からは、リレーションシップの [ON DELETE または ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) の変更は、2 つの新しいアクションの種類 `relationship.changeOnDelete` と `relationship.changeOnUpdate` のいずれかとして送られ、`relationship.add` は両方を持つことができます。アクションをそのまま受け渡す中継であれば、これらのために新たに対応する必要はありません。  
`3.10.0` より前のエディタは、これらのアクションの種類とフィールドを無視するため、リレーションシップの ON DELETE も ON UPDATE も伝わらず、そのようなエディタで保存したドキュメントにはどちらも含まれません。古いエディタが追加したリレーションシップはこれらを持たずに届くため、どちらも `Not set` で始まります。

`3.10.0` のエディタが送るそれ以外の変更は、どれも古いエディタがすでに知っているアクションの種類で送られます。  
[検索と置換](../../guide/guides/find-and-replace.md#replacing)の `Replace All` は、手で編集したときと同じ名前の変更、コメント、メモのアクションを 1 つのバッチにまとめて送ります。`Alternate Key` と `Referential Actions` の[表示オプション](../../guide/guides/table-related-functions.md#table-view-options)は、既存の `settings.changeShow` アクションで送られます。

`4.0.0` からは、次の変更が新しいアクションの種類で送られます。アクションをそのまま受け渡す中継であれば、これらのために新たに対応する必要はありません。

- [テーブルグループ](../../guide/guides/table-groups.md)の追加、移動、サイズ変更、名前の変更、色の変更、削除: `tableGroup.add`、`tableGroup.move`、`tableGroup.moveTo`、`tableGroup.resize`、`tableGroup.changeName`、`tableGroup.changeColor`、`tableGroup.remove`。テーブルがグループに加わる、またはグループを離れる変更: `table.changeGroup`。
- 既存のリレーションシップでの [Map Columns](../../guide/guides/relationship-editing.md#map-columns) の `Save`（リレーションシップの両側のカラムのリストを一度に設定します）: `relationship.changeColumns`。
- [ロック](../../guide/guides/settings.md#ロック)のオンとオフ: `settings.changeLockSettings`。
- [Schema SQL](../../guide/guides/schema-sql.md) タブの `Before tables` または `After tables` のスクリプトの編集: `settings.changeDDLScript`。

`Table Groups` と `Memos` の表示オプションは、既存の `settings.changeShow` アクションで送られます。  
ロックに置き換えられる前に `Save Scroll Information` と `Save Zoom Information` のスイッチが送っていた `settings.changeIgnoreSaveSettings` は送信されなくなり、`settings.changeRelationshipOptimization` はなくなりました。`4.0.0` のエディタは、どちらを受け取っても何も変えません。

`4.0.0` より前のエディタは新しいアクションの種類を無視するため、テーブルグループも、どのテーブルがグループに含まれるかも知ることはありません。ただし、グループのドラッグはそのテーブルの `table.move` も送るため、そのエディタでもグループのテーブルは移動します。  
Map Columns の `Save` の後もリレーションシップの古いカラムを保持し、その古い対応付けのカラムがそのエディタで削除されると、リレーションシップはすべてのエディタから消えます。ロックもスクリプトもありません。  
そのようなエディタで保存したドキュメントにはこれらのどれも含まれず、`4.0.0` のエディタはそのドキュメントをすべてのロックがオンの状態で開きます。  
セッション内のすべてのエディタと、そのドキュメントを保存する [replicationStore](./remote-storage.md#dispatch-dispatchsync) には、`4.0.0` 以降を使います。

`4.1.0` のエディタは新しい種類のアクションを送らないため、`4.0.0` と `4.1.0` のエディタとレプリカは、何も取りこぼすことなく 1 つのセッションを共有できます。  
そのエディタの[検索と置換](../../guide/guides/find-and-replace.md#replacing)はインデックス名とテーブルグループ名も検索し、`Replace` と `Replace All` は、`4.0.0` のエディタがすでに適用している `index.changeName` と `tableGroup.changeName` のアクションでそれらの名前を変更します。

`4.2.0` からは、次の変更が新しいアクションの種類で送られます。アクションをそのまま受け渡す中継であれば、これらのために新たに対応する必要はありません。

- テーブルやカラムの[論理名](../../guide/guides/logical-names.md): `table.changeLogicalName` と `column.changeLogicalName`。その名前が[辞書から生成された](../../guide/guides/dictionary.md#deriving-physical-names)ものかどうか: `table.changeNameDerived` と `column.changeNameDerived`。
- カラムの[ドメイン](../../guide/guides/dictionary.md#domains-and-data-types)への紐付けとその解除: `column.changeDomain`。
- [辞書](../../guide/guides/dictionary.md)タブでの単語、用語、ドメインの追加、変更（並べ替えで決まる、シート内での位置を含みます）、削除: `dictionary.add`、`dictionary.update`、`dictionary.remove`。
- [名前の表示](../../guide/guides/logical-names.md#switching-the-view)の切り替え: `settings.changeNameViewMode`。

`Name View` のロックは既存の `settings.changeLockSettings` アクションで、`Domain` の表示オプションは `settings.changeShow` で、[カラム順](../../guide/guides/settings.md#adjusting-column-order)での `Logical Name` または `Domain` の移動は `settings.changeColumnOrder` で送られます。  
`Import` からの Schema SQL、GraphQL、DBML、AML の読み込みが送る `editor.clear` と `editor.loadJson` は `keepDictionaries: true` を持ち、すべてのエディタで単語、用語、ドメインを保ちます。置き換えを行う [setSchemaSQL](../erd-editor-element.md#setschemasql)、`setSchemaGraphQL`、`setSchemaDBML`、`setSchemaAML` が送るものも同じです。  
辞書が生成した物理名は `table.changeName` または `column.changeName` で、ドメインがそのカラムに与えるデータ型は `column.changeDataType` で送られます。どちらも手で編集したときに送られるアクションです。

`4.2.0` より前のエディタは新しいアクションの種類を無視します。そのエディタには論理名、ドメインの紐付け、辞書、名前の表示がありません。そこでは `Name View` のロックやその解除は何も変えず、カラム順での `Logical Name` や `Domain` の移動、またはそのどちらかの位置への移動も同様です。辞書タブから設定タブに来たエディタがオンにした `Canvas Type` のロックも何も変えません。古いエディタはそのタブを知らないため、`Canvas Type` のロックをオフのままにします。辞書が生成した物理名と、ドメインが与えたデータ型は引き続き表示されます。  
そのエディタ自身の編集は論理名、ドメイン、辞書について何も知らないため、新しいエディタには次のような影響があります。

- そのエディタで手で名前を変更したテーブルやカラムは、名前が生成されたものとして記録されたままになるため、後で新しいエディタでそれに論理名を書くと、手で入力した名前を上書きして名前が再び生成されることがあります。
- ドメインに紐付いたカラムにそのエディタでデータ型を与えても紐付けは残るため、`Checks` シートには `Domain type mismatch` が表示され、次にドメインのデータ型を変更すると、カラムには再びドメインのデータ型が与えられます。
- そのエディタで追加したリレーションシップの外部キーのカラムは、参照するキーから論理名もドメインも受け取りません。
- そのエディタで貼り付けたり複製したりしたテーブルは、論理名もドメインの紐付けもない状態で届きます。
- そのエディタでの Schema SQL、GraphQL、DBML、AML の読み込みは `keepDictionaries` を送らないため、すべてのエディタで単語、用語、ドメインが空になります。
- そのエディタでドキュメントの読み込み、ファイルの読み込み、`clear()` を Undo すると、すべてのエディタにそのエディタが持つドキュメントのコピーが読み込まれます。そのコピーには論理名、ドメインの紐付け、辞書がありません。
- そのコピーと、そのエディタで Schema SQL、GraphQL、DBML、AML を読み込んだときに読み込まれるドキュメントは、すべてのエディタの `Name View` のロックも、そのエディタがドキュメントを受け取ったときの状態に戻します。その後、すべてのエディタは名前の表示として `Physical Names` を保存し、ロックがオフの場合は表示も `Physical Names` になります。

そのようなエディタで保存したドキュメントには論理名、ドメインの紐付け、辞書、名前の表示が含まれないため、`4.2.0` のエディタはそのドキュメントを `Physical Names` で開きます。古いエディタは `Name View` のロックを受け取ったときのとおりに保存するため、`4.2.0` のエディタでロックをオフにしたドキュメントはオフのままです。  
セッション内のすべてのエディタと、そのドキュメントを保存する [replicationStore](./remote-storage.md#dispatch-dispatchsync) には、`4.2.0` 以降を使います。

## SharedStoreConfig

### getNickname

他のエディタで、このユーザーのマウスカーソルの横に表示するニックネームを設定します。  
ニックネームが未設定または空の場合、他のユーザーには `user` と表示されます。

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

このユーザーのマウスカーソルを他のエディタへ送信します。既定値は `true` です。  
他のユーザーから送られてきたカーソルは、ERD キャンバスに常に表示されます。

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker

このユーザーが作業している対象を他のエディタへ送信します。既定値は `true` です。  
フォーカスしているテーブルとセル、選択しているテーブル、メモ、テーブルグループ、キャンバス上でドラッグしているボックスが他のエディタへ送られ、そこに描画されます。  
ユーザーごとに固有の色が割り当てられるため、フォーカス中のテーブルの輪郭線、フォーカス中のセルの下線、選択中のテーブル、メモ、テーブルグループを囲む枠線、ドラッグボックスの破線の矩形で、それぞれを見分けられます。  
`4.2.0` からは、名前の表示のロックがオンの間や、読み取り専用のエディタが自分で表示を切り替えた後は、ユーザーごとに異なる[名前の表示](../../guide/guides/logical-names.md#collaborators)を見ていることがあります。自分の表示が描かないセルがフォーカスされている場合は、その代わりに描かれるセルに下線が引かれます。名前と論理名は互いの代わりになり、データ型とドメインも同様です。  
他のユーザーから届いた操作状況は、このオプションの設定にかかわらず常に自分のキャンバスに描画されます。  
Visualization タブの Flow モードでは、他のユーザーのフォーカスと選択はテーブルのカードに描画されますが、ドラッグボックスは描画されません。そこで選択したテーブルは引き続き送信されますが、そこでドラッグしたボックスは送信されません。

```js
editor.getSharedStore({ focusTracker: false });
```

両方のトラッカーを無効にすると、自身の操作状況を一切送信しない単純な中継として shared store を使えます。  
他のエディタから送られてくる操作状況は、引き続き受信して描画します。  
VS Code、Obsidian、JetBrains IDE、Google Drive のエディタはこの方式で動作しています。

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

マウスカーソル、フォーカス、選択、ドラッグボックスは、ドキュメントの変更と同じストリームを流れますが、一時的なものです。  
これらはドキュメント、Undo の履歴、`editor.value` のいずれにも入らないため、トランスポートが破棄しても構わず、replicationStore も無視します。

## SharedStore

### connection, disconnect

現在の接続状態を設定するメソッドです。  
切断されている間は、変更を内部のバッファに保存します。  
再び送信可能な状態になると、バッファに溜まった変更を購読者へ発行します。  
既定の状態は接続済み（`connection`）です。

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

他のエディタインスタンスの変更を、現在のエディタインスタンスに反映します。

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

エディタの変更を購読します。  
購読者が 1 つも存在しない間はエディタから何も送信されず、それまでの変更はバッファに保存されます。  
最初の subscribe では、同時に行われた編集を調停する共同編集用のレジスタも他のエディタに要求するため、後から参加したエディタも同じように編集を調停します。  
ドキュメントは届かないため、後から参加するエディタには先に[初期値を設定](#参加者への初期値の設定)します。  
`4.0.0` からは、最初の subscribe の後に `setInitialValue` がそのエディタにドキュメントを読み込むたびに、store は改めて要求します。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

この store がまだ送信せずに保持しているストリームのバッチを、変更が途切れるのを待たずに今すぐ送信します。  
`3.9.2` からは `getSharedStore` が返す store で動作します。`3.9.1` では型にメソッドはありますが、何もしません。  
テーブル、メモ、テーブルグループの移動、色の変更、メモのサイズ変更、ビューのスクロールや拡大・縮小は、それぞれ小さな変更のストリームとして届きます。テーブルグループのサイズ変更はストリームにならず、ドラッグを終えたときに 1 回だけ送信されます。  
store は各ストリームを 1 つのバッチにまとめ、ストリームの変更が 200ms 途切れるまで保持します。これを 2 段階で行うため、バッチが送信されるのは最後の変更から約 400ms 後です。  
呼び出すと、両方の段階でその待機が終わります。store が接続済みの状態であれば、購読者は呼び出しが戻る前にバッチを受け取ります。保持しているものがない場合は、呼び出しても何も送信されません。  
store 自身の `destroy` もエディタの `destroy` も、まだ保持しているバッチを破棄します。そのため、タブを閉じるときのように、store を手放しても他のエディタに最後の変更を残したい場合は、先にこれを呼び出します。

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy

sharedStore のインスタンスを完全に破棄します。  
エディタ自体はそのまま残るため、セッションから抜けてもドキュメントの編集を続けられます。  
エディタが返した最後の sharedStore が破棄されると、マウスとフォーカスのトラッカーは停止します。  
store がまだ保持しているストリームのバッチも一緒に破棄されます。送信するには、先に [flushStreamBuffers](#flushstreambuffers) を呼び出します。

```js
sharedStore.destroy();
```
