---
sidebar_position: 2
description: erd-editor 要素の API。属性、value と runtimeValue、イベント、テーマ、表示言語、ウェルカム画面、キーバインディング、スキーマの読み込みと書き出し。
---

# ErdEditorElement

エディタは単なる `HTMLElement` です。  
型定義は次のとおりです。

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

エディタは closed shadow root にレンダリングされるため、`editor.shadowRoot` は `null` になり、ページのスタイルは内外に漏れません。  
内部の要素はセレクタでは参照できないため、スタイルは [setTheme](#settheme) と `--erd-editor-*` カスタムプロパティで指定します。

属性は `readonly`、`system-dark-mode`、`enable-theme-builder`、`enable-locale-picker`、`enable-welcome-screen` の 5 つだけで、いずれも既定値は `false` です。最後の 2 つは `4.0.0` で追加されました。どの属性も、[readonly](#readonly) で説明するとおりに値を読み取ります。

`4.1.0` からは、ERD タブに[エクスプローラー](../guide/guides/explorer.md)があります。キャンバスの左にドッキングされたダイアグラムのツリーで、上部に検索と置換があります。エクスプローラーを開いたり、閉じたり、その状態を知らせたりする属性、プロパティ、メソッド、イベントはありません。エクスプローラーは、ツールバーの `Explorer` ボタン、クイック検索またはキャンバスのコンテキストメニューの `Toggle Explorer`、または [`findReplace`](#setkeybindingmap) のバインディングで開きます。  
どの要素でも、エクスプローラーは閉じた状態で始まります。開いているかどうか、幅、折りたたみの状態、検索は、要素が存在する間、タブを切り替えても、`setInitialValue` を含むどの読み込みを行っても保たれ、`value`、`runtimeValue`、Undo の履歴、shared store のいずれにも含まれません。

## readonly

エディタの編集可否を設定します。  
設定されている間は、`value` への代入、`clear()`、`setSchemaSQL()`、`setSchemaGraphQL()`、`setSchemaDBML()`、`setSchemaAML()`、`setSchemaJSON()`、undo、redo がすべて無視され、`change` イベントも発行されません。ドキュメントの読み込みには [setInitialValue](#setinitialvalue) を使用します。  
表示は引き続き動作します。拡大・縮小、表示位置の移動、ハンドツール、Zen モード、キャンバスのタブ、テーブルへのフォーカスを含む [Visualization](../guide/guides/visualization.md) タブの両方のモード、データベースベンダー、SQL とコード生成の出力設定はそのまま適用されるため、読み取り専用のビューアーでも別のベンダー向けの SQL を書き出したり、生成されたコードを読んだりできます。  
`4.1.0` からは[エクスプローラー](../guide/guides/explorer.md#read-only-editors)も開き、その行を選ぶと、編集できるエディタと同じように、その行が表す対象へ移動します。上部の[検索と置換](../guide/guides/find-and-replace.md#read-only-editors)は検索だけを行い、`Toggle Replace` の矢印も Replace の行もありません。一致箇所へ移動すると、引き続きその一致箇所が表示され、選択されます。パネルのタイトルは `Explorer` で、ツールバーのボタンのツールチップは、どのエディタでも `Explorer (Ctrl + F)` (Windows/Linux) または `Explorer (⌘ + F)` (Mac) です。`3.10.0` から `4.0.0` までは、検索と置換は、ヘッダーに `Find` と表示される検索専用のフローティングパネルとして開きました。  
テーブルのプロパティも引き続き開きます。`3.10.0` からは、タイトルの横に `Read only` のバッジが表示され、`Indexes` タブでは何も編集できません。[テーブルのプロパティ](../guide/guides/table-related-functions.md#table-properties)を参照してください。  
`4.0.0` からは、読み取り専用のエディタには [`Import and Add`](../guide/guides/file-import-export.md#import-and-add)、`New Table Group`、`Group selected tables`、`Remove from group`（[テーブルグループ](../guide/guides/table-groups.md#読み取り専用のエディタ)を参照してください）、[`Map Columns`](../guide/guides/relationship-editing.md#map-columns) がなく、[ウェルカム画面](#enablewelcomescreen)も表示されません。設定タブのロックのボタンを押しても何も変わらず、Schema SQL タブの `Before tables` と `After tables` のスクリプトは編集できません。  
`4.1.0` からは、[キャンバスツールバー](../guide/guides/table-related-functions.md#canvas-toolbar)にも `New Table`、`New Memo`、`New Table Group` のボタンが表示されず、`addTableGroup` と `groupSelectedTables` のバインディングは何もしません。  
Schema SQL タブの `This window only` の選択、つまり `Statements`、`Header`、`Tables` は保存されることがなく、引き続き適用されます。[`Export image`](../guide/guides/file-import-export.md#画像) ダイアログ、テーマビルダー、Display Language のピッカーも同様です。テーマビルダーや Display Language のピッカーで選ぶと、引き続き [changePresetTheme](#changepresettheme) または [changeLocale](#changelocale) が発行されます。  
属性名のみの指定、`=""`、`="true"` はいずれも `true` として扱われます。`="false"` は `false` として扱われ、HTML の慣用表現である `readonly="readonly"` を含むその他の文字列も同様です。

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

システムのダーク / ライトモードに自動で同期するかどうかを設定します。  
`4.0.0` からは、有効にするとテーマの `appearance` が `'system'` になり、`setPresetTheme({ appearance: 'system' })` と同じ結果になります。エディタは OS が報告するライトまたはダーク、あるいは [setSystemAppearance](#setsystemappearance) で指定したほうで表示し、それが変わると切り替わります。  
その後に `'light'` または `'dark'` を指定して [setPresetTheme](#setpresettheme) を呼び出すか、テーマビルダーやクイック検索で `Light` または `Dark` を選ぶと、`'system'` は置き換えられ、そのまま保たれます。`systemDarkMode` が `true` のままでも、次の OS の切り替えで上書きされることはありません。`4.0.0` より前は、次の OS の切り替えで上書きされていました。  
外観が `'system'` の間に無効にすると、その時点で表示しているライトまたはダークのまま保たれます。外観を `'system'` から変更した後に無効にした場合は、そのまま変わりません。  
変更してもイベントは発行されません。

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

プリセットテーマを簡単に設定できる UI を提供するかどうかを設定します。  
ツールバーに `Theme` ボタンを表示し、このボタンで `Accent color`、`Gray color`、`Appearance` を持つテーマビルダーが開きます。`4.0.0` からは、`Appearance` に `Light` と `Dark` に加えて `System` があり、これが有効な間は、クイック検索に `System`、`Light`、`Dark` を持つ `Theme` が表示されます。[言語とテーマ](../guide/guides/language-and-theme.md)を参照してください。

![ツールバーからテーマビルダーを開き、アクセントカラーとグレーカラーを選んで、外観を Light、続いて System に切り替える様子](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

このパネルまたはクイック検索からプリセットテーマを変更すると、[changePresetTheme](#changepresettheme) イベントを発行します。

## enableLocalePicker

`4.0.0` からは、エディタの表示言語を選ぶ UI を提供するかどうかを設定します。  
ツールバーに `Display Language` ボタンを表示し、両方が表示される場合は `Theme` の後に並びます。このボタンで Display Language のピッカーが開き、クイック検索には `Display Language` が表示されます。どちらも `System` と 25 の言語を提供します。[言語とテーマ](../guide/guides/language-and-theme.md)を参照してください。  
また、[setLocale](#setlocale) を呼び出すか言語を選ぶまでにエディタが何を表示するかも決めます。有効な間は `'system'`、無効な間は英語のため、何も設定しない要素はこれまでどおり英語で表示されます。有効と無効を切り替えると、すぐに両者が切り替わります。言語を一度設定するか選ぶと、どちらに切り替えてもその選択が保たれます。  
要素を追加する前に設定すると、最初のフレームから `'system'` に従います。  
言語を選ぶと [changeLocale](#changelocale) が発行されます。

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen

`4.0.0` からは、空のダイアグラムで[ウェルカム画面](../guide/guides/editing-start.md#ウェルカム画面)を表示するかどうかを設定します。  
ドキュメントにテーブルが 1 つもなく、表示されているメモもテーブルグループもない間、ERD タブの上に表示されます。`readonly` が設定されている間、Zen モードの間、テーブルのプロパティ、Diff Viewer、Time Travel、自動レイアウトのプレビューのいずれかが開いている間は表示されません。最初のテーブル、表示されているメモ、表示されているテーブルグループが加わると消え、Undo でダイアグラムが空に戻ると再び表示されます。  
`New Table`、`New Memo`、`Command Palette` の行には、[setKeyBindingMap](#setkeybindingmap) で設定された状態の `addTable`、`addMemo`、`search` の最初のキーの組み合わせが表示され、空にした名前については何も表示されません。矢印が `Theme` と `Display Language` のボタンを指すのは、`enableThemeBuilder` と `enableLocalePicker` によってそれらが表示されている場合だけです。  
メニューでは、`↑`、`↓`、`Home`、`End` で行の間を移動し、これらの入力では `preventDefault()` が呼び出されて伝播も止められます。`Enter` と `Space` は伝播が止められますが `preventDefault()` は呼び出されないため、フォーカスしている行がそれを受け取ります。`Import` の形式の一覧で押した `Escape` は前に戻り、`preventDefault()` が呼び出されて伝播も止められます。それ以外のキーは、通常どおりエディタとページに届きます。  
ドキュメントは何も変更しないため、`value` はそのままで、`change` も発行されません。  
公式のホストと同じように、[setInitialValue](#setinitialvalue) でドキュメントを読み込んでから有効にすると、読み込み中のファイルの上に画面が一瞬表示されることはありません。

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value

### getter

現在のドキュメントを、エディタが定義する[スキーマ](./advanced/schema.md)の JSON 文字列として取得します。  
`4.0.0` からは、ファイルが保持する形式のドキュメントです。これは `json` の書き出しが書き込む内容であり、公式のホストが保存する内容でもあります。含まれるのは現存するエンティティだけで、削除したエンティティ、重なり順、そして計測した幅、キーのマーク、リレーションシップの接続位置のようにエディタが自分で求めるものは含まれません。エンティティは決まった順序のキーで並び、2 つのスペースでインデントされ、改行で終わるため、同じドキュメントからは常に同じバイト列が得られます。  
[ロック](../guide/guides/settings.md#ロック)がオンの設定は、画面の表示ではなく、ロックされた値で書き出されます。`Viewport` のロックは `originX`、`originY`、`zoomLevel` を保持し、`Canvas Type`、`Language`、`Table Name Case`、`Column Name Case`、`Bracket Type` はそれぞれ自身の設定を保持します。それ以外の設定は現在の値のまま書き出され、`lockSettings` は常に書き出されます。ビットについては [Settings](./advanced/schema.md#settings) を参照してください。  
要素に値を渡す前に表示されるドキュメントでも、空の値から読み込んだドキュメントでも、新しいドキュメントではすべてのロックがオンです。その `value` は、対応するロックをオフにするまで、表示の原点を `0, 0`、拡大・縮小のレベルを `1`、タブを ERD タブ、Code Generator の言語、名前のケース、括弧の種類を既定値のまま保ちます。  
`4.0.0` より前は、`ignoreSaveSettings` を適用した、エディタが保持しているとおりのドキュメント全体を返していました。エディタが保持しているとおりのドキュメントは [runtimeValue](#runtimevalue) になり、`ignoreSaveSettings` は読み取りも書き込みもされなくなりました。

```js
const data = editor.value;
```

### setter

以前に保存したエディタの状態を読み込みます。ドキュメント全体を置き換えるため、現在のドキュメントは先に消去されます。  
`clear()`、`setInitialValue()`、既定の `mode: 'replace'` での `setSchema*` の各メソッドと同様に、Visualization タブの Flow の表示状態、つまりレイアウト、絞り込んでいるテーブル、行の表示、拡大・縮小、表示位置も破棄します。追加（`mode: 'append'`）では破棄しません。  
履歴に記録されるため `Undo, Redo` が可能で、`change` を発行します。  
ファイルが保持する形式、[runtimeValue](#runtimevalue)、以前のリリースで保存したファイルのいずれも受け付けます。  
空文字列や文字列以外の値を指定した場合はエラーにならず、新しいドキュメントを読み込むため、代入する前に値を確認します。  
この新しいドキュメントは `setInitialValue('')` で始まるものと同じで、空で、設定は既定値のまま、`4.0.0` からはすべてのロックがオンです。`3.10.x` では表示位置も拡大・縮小のレベルも保存せず、それより前は両方を保存していました。  
shared store はこの読み込みを、新しいドキュメントの JSON 全体を付けて共同編集の参加者へ中継するため、古いリリースのエディタも含め、すべての参加者が同じドキュメントを読み込みます。  
`4.0.0` からは、読み込んだドキュメントのロックと、その後 `value` が書き出すロックされた値はテキストから取られ、表示はテキストが指定する位置になります。そこにダイアグラムが何も描かれていない場合は、ダイアグラムの上になります。テキストがロックしているそれ以外の設定、つまりタブ、Code Generator の言語、名前のケース、括弧の種類については、エディタは読み込む前に表示していたものを表示し続けます。テキストがロックしていない設定は、テキストの値になります。[setInitialValue](#setinitialvalue) は代わりにテキストが持つすべての値を取ります。ロックを何も指定していないテキストについても、そちらを参照してください。  
マージコンフリクトのマーカーが残ったファイルなど、JSON でないテキストもエラーにはなりません。ドキュメントは空になり、設定はそのまま保たれ、パースエラーがコンソールに出力されます。  
`readonly` が設定されている間は無視されます。読み取り専用のエディタに読み込むには [setInitialValue](#setinitialvalue) を使用します。

```js
editor.value = 'json...';
```

## runtimeValue

`4.0.0` からは、このエディタが保持しているとおりのドキュメントを JSON 文字列として取得します。setter はないため、strict モードのコードで代入すると例外が発生します。  
[value](#value) が含まないもの、つまり削除したエンティティとその順序、重なり順、計測した幅、キーのマーク、リレーションシップの接続位置、シーケンスを含みます。ここでも、ロックされた設定はロックされた値で書き出されます。  
共同編集の参加者や同じドキュメントの 2 つ目のビューのように、すでに進行中のセッションに参加する別のエディタに、その [setInitialValue](#setinitialvalue) で初期値を設定するために使います。後でセッションから削除の Undo が送られてくると、そのエディタではエンティティが元のとおりに戻ります。一方、`value` から初期値を設定したエディタは削除したエンティティを持たないため、代わりに名前のない空のテーブルが戻ります。[共同編集](./advanced/collaborative-editing.md)を参照してください。  
削除したエンティティを回収するものはもうないため、次にドキュメントをファイルから開くまで、それらはここに残ります。  
ファイルには決して書き込まないでください。保存するのは `value` です。[JSON Schema](./advanced/schema.md#json-schema) は `value` を受け付けますが、こちらは受け付けません。

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue

以前に保存したエディタの状態を読み込みます。読み込み自体は履歴に記録されないため Undo できず、`change` イベントも発行されません。  
読み込むときに履歴も消去されるため、読み込む前に行った操作を、読み込んだドキュメントに対して `Undo, Redo` することはできません。  
ファイルが保持する形式、[runtimeValue](#runtimevalue)、以前のリリースで保存したファイルのいずれも受け付け、`value` への代入とは異なり、タブとコードの設定を含め、テキストが持つすべての設定を取ります。  
空文字列や文字列以外の値を指定した場合はエラーにならず、新しいドキュメントを読み込むため、`setInitialValue('')` は空のダイアグラムから始めます。  
`4.0.0` からは、この新しいドキュメントは、要素に値を一度も渡していないときに表示されるドキュメントでもあり、すべてのロックがオンです。スクロール、拡大・縮小、タブの切り替え、Code Generator の言語、名前のケース、括弧の種類の変更をしても、`value` は変わらず、`change` も発行されません。`3.10.x` では表示位置も拡大・縮小のレベルも保存せず、それより前は両方を保存していました。  
テキストから読み込んだドキュメントは、そこに指定されているロックを保ちます。何も指定されていないドキュメント、つまり `ignoreSaveSettings` の内容にかかわらず `4.0.0` より前に保存したすべてのファイルと v2 の `.vuerd` ファイルは、すべてのロックがオンの状態で開きます。`Viewport` は原点 `0, 0`、拡大・縮小のレベル `1` でロックされ、タブは ERD タブで、言語、名前のケース、括弧の種類は保存されたときのままです。  
どちらの場合も、表示はドキュメントの表示位置で開きます。テキストがロックを指定している場合はテキストが保存した表示位置、指定していない場合は拡大・縮小のレベル `1` の原点 `0, 0` です。そこにダイアグラムが何も描かれていない場合は、ダイアグラムの上で開きます。ロックされた `Viewport` は、引き続きロックされた値を `value` に保ちます。  
`4.0.0` からは、それまで保持していたドキュメントの共同編集の状態も破棄し、このエディタの [shared store](#getsharedstore) がすでに購読されている場合は、ほかのエディタにそれぞれの状態を改めて要求するため、進行中のセッションで読み込み直したエディタも追いつきます。そのようなエディタには、別のエディタの [runtimeValue](#runtimevalue) で初期値を設定します。  
JSON でないテキストもエラーにはなりません。ドキュメントは空になり、設定はそのまま保たれ、パースエラーがコンソールに出力されます。  
`value` への代入とは異なり `readonly` の影響を受けないため、読み取り専用のビューアーにドキュメントを読み込む方法になります。

```js
editor.setInitialValue('json...');
```

起動時に読み込み、変更時に保存します。

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event

公開されているイベントは `change`、`changePresetTheme`、`changeLocale` の 3 つだけで、`changeLocale` は `4.0.0` で追加されました。  
要素は内部の処理のために `@dineug/erd-editor/internal-*` イベントも自身に発行しますが、これらは API には含まれません。

### change

エディタに変更があるとイベントを発行します。  
200ms のデバウンスがかかり、`readonly` が `true` の間は発行されません。  
UI での編集、`value` への代入、`clear()`、`setSchema*` の各メソッド、`4.0.0` からは `setSchemaJSON()` と `Import and Add` など、ドキュメントのあらゆる変更で発行されます。`setInitialValue` では発行されません。  
Visualization タブの Flow モード内の操作、つまり拡大・縮小、表示位置の移動、カードの移動、`Tidy Up`、行の表示の変更、カードからの表示の絞り込みは、どれもドキュメントの変更ではないため発行されません。  
`4.0.0` からは、[ロック](../guide/guides/settings.md#ロック)がオンの設定の変更も、画面を動かすだけで `value` を変えることはないため、発行されません。`Viewport` がロックされている間の ERD キャンバスのスクロールや拡大・縮小、`Canvas Type` がロックされている間のタブの切り替え、それぞれのロックがオンの間の Code Generator の言語、テーブル名のケース、カラム名のケース、括弧の種類の変更がこれにあたります。除外されるのはこれらの変更だけのため、ドキュメントの編集も含むバッチでは引き続き発行されます。設定をロックしたりロックを解除したりすると発行されます。  
新しいドキュメントと `4.0.0` より前に保存したすべてのファイルではすべてのロックがオンのため、既定ではスクロール、拡大・縮小、タブの切り替えでは何も発行されません。ERD タブからテーブルにフォーカスする操作、Flow から ERD タブへ戻るカードの外部リンクボタン、エクスプローラーの行や検索の一致箇所への移動、別のタブからエクスプローラーを開く操作やクイック検索の結果へ移動する操作も同様です。これらがそれぞれ `change` を 1 回発行するのは、対象となるロックがオフの間だけです。タブの切り替えには `Canvas Type`、カードのボタン、クイック検索の結果、エクスプローラーの行、検索の一致箇所があわせて行うスクロールには `Viewport` が対象になります。`4.1.0` からは、これらのスクロールはすべて 1 つの規則、[移動先の表示位置](../guide/guides/table-related-functions.md#where-a-jump-lands)に従うため、クイック検索のテーブルの結果で毎回スクロールすることはなくなり、規則によって表示位置が動かない移動ではスクロールが起きないため、発行するものもありません。エクスプローラーを開いたり、閉じたり、サイズを変えたりすると、キャンバスの幅は狭まったり広がったりしますが、その原点は動かないため、これも何も発行しません。`4.0.0` より前は、スクロール、拡大・縮小、タブの切り替えでは、`editor.value` が変わらない場合でも常に発行されていました。  
何も変えない書き込みを省くには、読み込んだファイルではなく、最後に保存した値と `editor.value` を比較します。以前のリリースが書き出したファイル、v2 のファイル、手で編集したファイルは、`value` がファイルが保持する形式で書き出すため、読み込んだ時点で `value` が異なることがあります。`Viewport` のロックがオフで、その原点ではこの画面にダイアグラムが何も描かれないファイルも同様です。読み込みによって表示がダイアグラムの上に移動し、`value` は移動した先を書き出すためです。`4.0.0` からは、`value` が計測した幅を持たないため、計測した幅がこの原因になることはなくなりました。ファイルを書き出すホストは、代わりにレプリケーション用の store の `changed` で、編集と表示の変更を区別することもできます。[on@change](./advanced/remote-storage.md#onchange) を参照してください。  
イベントは `detail` を持たず、バブリングもシャドウ境界の通過もしないため、要素自身で購読し、ハンドラー内で `editor.value` を読み取ります。

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

組み込みのテーマビルダー、または `4.0.0` からはクイック検索の `Theme` でプリセットテーマを変更したときに発行されます。すでに適用されている選択肢を選んだ場合も含め、選ぶたびに発行されます。  
[setPresetTheme](#setpresettheme) や [setSystemAppearance](#setsystemappearance) を自分で呼び出した場合や、[systemDarkMode](#systemdarkmode) を有効または無効にした場合は発行されません。  
`event.detail` は、指定した一部の値ではなく、選んだ後の完全な `ThemeOptions`（`{ appearance, grayColor, accentColor }`）です。`4.0.0` からは、`System` を選んでいる間、その `appearance` は表示しているライトやダークではなく `'system'` になるため、そのまま保存して、そのまま `setPresetTheme` に渡します。

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale

`4.0.0` からは、エディタで言語を選んだときに発行されます。Display Language のピッカーとクイック検索の `Display Language` のどちらで選んだ場合も発行され、どちらも [enableLocalePicker](#enablelocalepicker) で有効になります。  
言語が適用された後に、すでに適用されている選択肢を選んだ場合も含め、選ぶたびに発行されます。[setLocale](#setlocale) と [setSystemLocale](#setsystemlocale) では決して発行されず、ブラウザの言語が変わった場合も発行されません。言語を切り替えても `change` は発行されません。  
`event.detail` は `{ locale }` で、`locale` は `LocaleOption` です。`System` を選んだ場合は `'system'`、それ以外の場合はその言語のコードになります。要素は選んだ内容を記憶しないため、保存して、次に読み込むときに `setLocale` に渡します。  
`change` と同じくバブリングしないため、要素自身で購読します。

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus

エディタにフォーカスを当てます。

```js
editor.focus();
```

## blur

エディタのフォーカスを外します。

```js
editor.blur();
```

## clear

ドキュメントを空にし、すべてのテーブル、カラム、リレーションシップ、インデックス、メモ、そして `4.0.0` からはすべてのテーブルグループを削除します。  
データベース、表示位置、拡大・縮小のレベル、テーブルの表示オプション、保持している値を含む各ロック、Schema SQL タブの `Before tables` と `After tables` のスクリプトを含め、設定はすべてそのまま残るため、消去したファイルはそれまでと同じものを保存し続けます。代わりに新しいドキュメントから始めるには、`value` に `''` を代入するか、`setInitialValue('')` を呼び出します。  
履歴に記録されるため元に戻すことができ、`change` を発行します。Undo すると、ドキュメントはエディタが保持していたとおりに、ロックされた各設定はロックされた値で戻ります。`readonly` が設定されている間は無視されます。

```js
editor.clear();
```

## destroy

エディタのインスタンスを完全に破棄し、再利用できないようにします。  
エディタのリスナーと購読を解放し、[getSharedStore](#getsharedstore) が返したすべての shared store を破棄します。  
shared store がまだ送信せずに保持しているストリームのバッチは一緒に破棄されます。送信するには、先にその store の [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) を呼び出します。

```js
editor.destroy();
```

## setKeyBindingMap

キーボードショートカットを再定義します。  
`edit`、`stop`、`undo`、`redo`、`zoomIn`、`zoomOut`、`zoomReset` は固定で、再定義できません。  
書き込めるのは次の 21 個の名前だけで、固定の名前を含め、オブジェクト内のそれ以外の値は無視されます。  
`3.10.0` から `search` を再定義できるようになり、`findReplace` が追加されました。以前は `search` は固定でした。`4.0.0` から `removeSelection` が追加されました。`4.1.0` から `addTableGroup` と `groupSelectedTables` が追加されました。  
バインディングの値は `ShortcutOption[]` である必要があります。文字列だけの指定は無視されるため、`{ addTable: 'Alt+KeyN' }` ではなく `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` と記述します。  
空の配列も受け付けられ、何も割り当てません。`setKeyBindingMap({ findReplace: [] })` は `Ctrl + F` (Windows/Linux) または `⌘ + F` (Mac) をページに任せ、`{ search: [] }` は `Ctrl + K` (Windows/Linux) または `⌘ + K` (Mac) を同じようにページに任せます。ツールバーの `Search` ボタンからは引き続きクイック検索を開け、ツールバーの `Explorer` ボタンでは引き続きエクスプローラーを開閉でき、クイック検索とキャンバスのコンテキストメニューの `Toggle Explorer` では引き続きエクスプローラーを検索の状態で開くか、閉じることができます。空にした名前のショートカットは、これらのどこにも表示されません。`{ removeSelection: [] }` は `Delete` と `Backspace` をページに任せ、このときテーブル、メモ、テーブルグループのメニューの削除の項目（`Delete`、`Delete selected`、`Delete column`、`Delete columns`）にはショートカットが表示されません。  
`4.1.0` からは、`{ addTableGroup: [] }` は `Alt + G` (Windows/Linux) または `⌥ + G` (Mac) を、`{ groupSelectedTables: [] }` は `T` に続けて `G` をページに任せます。キャンバスツールバー、キャンバスのコンテキストメニュー、クイック検索の `New Table Group`、テーブルのメニューの `Group selected tables`、クイック検索の `Group Selected Tables` は引き続き動作し、ショートカットは表示されません。キャンバスツールバーの `New Table`、`New Memo`、`New Table Group` のボタンのツールチップには、`addTable`、`addMemo`、`addTableGroup` の最初のキーの組み合わせが表示され、空にしたバインディングについてはボタンの名前だけが表示されます。  
呼び出しは部分的なマージです。指定しなかった名前は既定値のまま維持され、2 回呼び出しても以前の変更は保持されます。現在のバインディングを取得する getter はありません。[createKeyBindingMap](#createkeybindingmap) が返すのは既定値であり、`setKeyBindingMap` で変更した内容ではありません。

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`、`handTool`、`removeSelection`、そして `4.1.0` からは `groupSelectedTables` はキャレットに譲ります。フォーカスが input、textarea、`contenteditable` の中にある間は `$mod + A` がテキストを選択し、`Space` は空白を入力し、`Delete` と `Backspace` はテキストを消去し、`T` に続けて `G` はその 2 文字を入力して、キャンバスには届きません。これらの入力では `preventDefault()` は呼び出されません。別のショートカットに再定義しても動作は同じです。

`4.0.0` から、`removeSelection`（`Delete` または `Backspace`）は、ERD タブで選択しているものを確認なしに Undo の 1 ステップとして削除します。選択しているのがフォーカスしているテーブルだけで、そのカラムを 1 つ以上選択していて、拡大・縮小のレベルでその行が描画されている場合は、それらのカラムを削除します。それ以外の場合は、選択しているすべてのテーブル、メモ、テーブルグループを削除し、グループのテーブルは残します。[テーブルとメモの削除](../guide/guides/table-related-functions.md#テーブルとメモの削除)を参照してください。  
キーを押し続けても削除は 1 回だけで、セル、メモ、テーブルグループの名前の編集中は何も削除されません。テキストフィールドと、バインディングをそこで止めるパネル（[createKeyBindingMap](#createkeybindingmap) を参照してください）の外では、エディタにフォーカスがある間はどのタブでも、フォーカスしているツールバーのボタンの上でも、何も削除しない読み取り専用のエディタでも、この入力に対して `preventDefault()` が呼び出されます。

`4.1.0` から、`addTableGroup`（`Alt+KeyG`）は ERD タブで `New Table Group` の描画を準備し、次にキャンバスでマウスの主ボタンを押すと、そこからグループを描きます。キャンバスツールバーの `New Table Group` ボタンと同じように、もう一度押すと描画の準備が解除されます。`groupSelectedTables`（`KeyT KeyG`、`T` に続けて `G`）は、テーブルのコンテキストメニューの `Group selected tables` と同じように、選択しているテーブルを新しいグループに入れて、その名前の入力欄を開きます。テーブルを選択していない場合は何も追加せず、選択しているメモやテーブルグループは数に入りません。[グループの描画](../guide/guides/table-groups.md#グループの描画)と[選択したテーブルのグループ化](../guide/guides/table-groups.md#選択したテーブルのグループ化)を参照してください。  
どちらも、メニューがグループの項目を表示する場合にだけ動作します。`readonly` が設定されている間、`Table Groups` の View Option でグループを非表示にしている間、セル、メモ、テーブルグループの名前の編集中は動作しません。ほかのキャンバスのバインディングと同じように ERD タブでのみ動作し、クイック検索、テーブルのプロパティ、Diff Viewer、Time Travel、自動レイアウトのプレビュー、`Export image`、`Map Columns` のいずれかが開いている間も動作しません。何もしない場合でも、`groupSelectedTables` がキャレットに譲る場合を除き、この入力では `preventDefault()` が呼び出されます。`addTableGroup` は、`focusView` や `zenMode` と同じく伝播も止められるため、ページのバブリングフェーズの `keydown` リスナーには届きません。

`3.10.0` から、`findReplace`（`$mod+KeyF`）は[検索と置換](../guide/guides/find-and-replace.md)を開きます。`4.1.0` からは、検索と置換を収める[エクスプローラー](../guide/guides/explorer.md#opening-and-closing)を開閉し、設定のショートカットタブでは `Toggle Explorer` として表示されます。  
ツールバーの `Explorer` ボタンが押された状態で表示されている間（エクスプローラーが ERD タブで開いていて、Zen モードで隠れていない間）は、クイック検索、テーブルのプロパティ、テーマビルダー、Display Language のピッカー、`Export image` ダイアログ、`Map Columns` のいずれかが開いている場合を除き、エクスプローラーを閉じます。それ以外の場合は、それらのうち開いているものを閉じ、ほかのどのタブからでも ERD タブを表示して、`Find` フィールドにキャレットを置き、検索語を選択した状態でエクスプローラーを開きます。エクスプローラーをキャンバスの横に表示するには幅が足りないエディタでは、エクスプローラーは開いたまま退き、`Widen the window to show the Explorer` のトーストが表示されます。`4.1.0` より前は、フローティングの検索と置換のパネルを開くか、そのフィールドにキーボード操作を戻すだけで、パネルを閉じることはありませんでした。  
キャレットには譲りません。エディタにフォーカスがある間は、どのタブでも、キャンバスからでもエディタ内の入力欄からでもこのキーを受け取ります。`preventDefault()` が呼び出されるためブラウザの検索バーは開かず、伝播も止められるため、ページのバブリングフェーズの `keydown` リスナーには届きません。セルやメモの編集中、または `4.0.0` からはテーブルグループの名前の編集中も、`preventDefault()` が呼び出されて伝播も止められますが、何もしません。  
Diff Viewer、Time Travel、自動レイアウトのプレビューのいずれかが開いている間は、どのタブであっても、また IME の変換中も、`preventDefault()` は呼び出されず伝播も止められないため、ブラウザやホスト自身の検索がこのキーを受け取ります。エクスプローラー内では、変換中の入力はそこで伝播が止められますが、`preventDefault()` は呼び出されません。`findReplace` を別のショートカットに再定義しても動作は同じです。

`focusView` は ERD タブでのみ動作します。テーブルを 1 つ以上選択している場合は、Visualization タブを Flow モードで開き、それらのテーブルと、リレーションシップ 1 つでつながるすべてのテーブルに表示を絞り込みます。選択しているメモやテーブルグループは数に入らず、テーブルを選択していない場合は何もしません。[テーブルへのフォーカス](../guide/guides/visualization.md#focusing-on-tables)を参照してください。

`stop`（`Escape`）は ERD タブで、セルやメモの編集、またはリレーションシップの作成を終了し、選択はそのまま残します。`4.0.0` からは、テーブルグループの名前の編集も名前を書き込まずに終了し、`New Table Group` の描画も終了します。このときエディタは `preventDefault()` を呼び出します。  
そのいずれでもない場合、`Escape` は選択とフォーカスしているセルを解除し、`preventDefault()` は呼び出されません。そのため、編集を抜けて選択も解除するには 2 回押す必要があります。  
エクスプローラー、[ウェルカム画面](#enablewelcomescreen)の `Import` の形式の一覧、後述のピッカーとダイアログを除き、エディタが `Escape` の伝播を止めることはないため、独自のダイアログを閉じるためなど、自分で `Escape` を監視しているページには両方の入力が届き、`defaultPrevented` が `true` のほうを無視できます。  
クイック検索、テーブルのプロパティ、Diff Viewer、自動レイアウトのプレビュー、Time Travel のいずれかが開いている間は、`Escape` は代わりにそれを閉じ、選択はそのまま残します。このときも `preventDefault()` は呼び出されません。  
`4.0.0` からは、開いている [`Export image`](../guide/guides/file-import-export.md#画像) ダイアログや [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) ダイアログも `Escape` を受け取り、自身を閉じて、選択はそのまま残します。どちらも開いたときにキーボード操作を受け取り、この `Escape` では `preventDefault()` が呼び出されて伝播も止められます。  
`4.1.0` からは、[エクスプローラー](../guide/guides/explorer.md#keys-in-the-explorer)内、つまりそのツリー、フィールド、ボタンにフォーカスがある状態で押した `Escape` は、キーボード操作をキャンバスに戻し、エクスプローラーは開いたまま、選択もそのまま残します。エディタはこの入力に対して `preventDefault()` と `stopPropagation()` の両方を呼び出すため、ページのバブリングフェーズの `keydown` リスナーには届きません。  
キャンバスで押した `Escape` でエクスプローラーが閉じることはありません。`4.1.0` より前は、検索と置換のパネル内で押した `Escape` はパネルを閉じ、キャンバスで押した `Escape` は選択を解除するのと同じ 1 回の入力でパネルを閉じていました。  
`4.0.0` からは、Display Language のピッカーとカラーピッカーは `Escape` で閉じます。それらの中で押した `Escape` は `preventDefault()` が呼び出されて伝播も止められ、キャンバスで押した `Escape` は、選択を解除するのと同じ 1 回の入力でそれらを閉じ、`preventDefault()` は呼び出されず、伝播も止められません。  
IME の変換中に押した `Escape` は変換のためのものです。編集は終了せず、`preventDefault()` も呼び出されないため、ページでは `isComposing` が `true`、または `keyCode` が `229` の入力も同じように無視できます。エクスプローラー内では、変換中に押したほかのキーと同じく、この入力の伝播も止められ、キーボード操作はフィールドに残ります。  
`3.9.2` より前は、1 回の `Escape` で編集や作成の終了と選択の解除が同時に行われ、エディタが `preventDefault()` を呼び出すこともありませんでした。

### createKeyBindingMap

`3.9.2` から、パッケージは `createKeyBindingMap()` と、あわせて `KeyBindingMap`、`KeyBindingName`、`ShortcutOption` の型をエクスポートしています。  
固定の名前を含む 28 個すべての名前の既定のキーバインディングを、呼び出すたびに新しいマップとして返すため、返されたマップを変更してもほかには何も影響しません。  
すべてのエディタはこの状態から始まり、`setKeyBindingMap` の呼び出しはここには反映されません。  
ランタイムのエクスポートは `createKeyBindingMap` だけで、残りの 3 つは型です。

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

各 `shortcut` は、キーを `KeyboardEvent.code` で指定する、[tinykeys](https://github.com/jamiebuilds/tinykeys) の構文によるキーの組み合わせで、[`$mod`](#mod) は macOS では `⌘`、それ以外では `Control` です。  
`4.0.0` からは、エディタはこれらのキーの組み合わせを tinykeys を通さずに、同じ構文で自身で読み取ります。キーは `code`、または大文字・小文字を問わない `key` で一致し、入力が一致するのは、指定された修飾キーをちょうどそのとおりに押している場合だけです。`AltGraph` は、Windows では `Control` と `Alt`、macOS では `Alt` として扱われます。スペースで区切った入力はシーケンスになり、1 秒間 keydown がないと最初からやり直しになります。  
`4.1.0` からは、既定値の 1 つがシーケンスです。`groupSelectedTables` は `KeyT KeyG`、つまり `T` に続けて `G` です。シーケンスはそれを完了する入力で実行され、その `preventDefault` と `stopPropagation` が適用されるのもその入力だけのため、既定値では `T` はページに届き、`preventDefault()` が呼び出されるのは `G` だけです。メニュー、クイック検索、ショートカットタブでは、シーケンスは入力ごとに 1 つずつのキーで表示されます。  
固定の名前は `Enter`（`edit`）、`Escape`（`stop`）、`$mod+KeyZ`（`undo`）、`$mod+Shift+KeyZ`（`redo`）、`$mod+Equal`（`zoomIn`）、`$mod+Minus`（`zoomOut`）、`$mod+Digit0`（`zoomReset`）に割り当てられています。`edit` と `stop` にはフラグがなく、残りの 5 つには `preventDefault` と `stopPropagation` が付いています。それ以外は上記の既定値で、`search` と `findReplace` もそこに含まれます。

エディタはこれらを自身の要素で受け取るため、グローバルなホットキーやキャプチャフェーズの `keydown` リスナーでエディタより先にキーを受け取るホストは、エディタにフォーカスがある間はこれらを通す必要があります。  
通すキーの一覧は `createKeyBindingMap()` から作成し、既定値の代わりに `setKeyBindingMap` に渡したバインディングを使います。  
`3.10.0` からは、この一覧にブラウザ自身の検索のキーである `$mod+KeyF` が含まれます。このキーで自身の検索を使い続けたいホストは、`setKeyBindingMap({ findReplace: [] })` を渡します。  
`4.0.0` からは、この一覧には修飾キーなしの `Delete` と `Backspace` も含まれます。これらのキーを使い続けたいホストは、`setKeyBindingMap({ removeSelection: [] })` を渡します。  
`4.1.0` からは、`Alt+KeyG` とシーケンス `KeyT KeyG` も含まれます。シーケンスは 1 つの文字列として含まれるため、スペースで分割し、修飾キーなしの `T` と `G` も含めて、それぞれの入力を通します。入力が 1 つでも欠けたシーケンスは完了しないためです。これらのキーを使い続けたいホストは、`setKeyBindingMap({ addTableGroup: [] })` または `setKeyBindingMap({ groupSelectedTables: [] })` を渡します。

エクスプローラー内、つまりそのツリー、`Find` と `Replace` のフィールド、ボタンにフォーカスがある間は、`findReplace`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut`、`zoomReset` はエディタに届くため、`findReplace` はそこでもキャンバスと同じように動作します。それ以外のバインディングに現在割り当てられているキーはエクスプローラーで止まり、シーケンスはその最後の入力（既定値では修飾キーなしの `G`）で止まります。矢印キー、`Tab`、`Enter`、`Space`、`Home`、`End`、IME の変換中に押したキーも同様です。キーボード操作をキャンバスに戻す `Escape` を除き、これらは `preventDefault()` を呼び出されずに伝播だけが止められるため、エクスプローラーのフィールド、ボタン、ツリーでは通常のキーとして動作し、キャンバスにもページのバブリングフェーズの `keydown` リスナーにも届きません。そこで `Alt + N` を押してもテーブルは追加されず、`Delete` を押しても何も削除されません。ツリーで行の間を移動したり、行を折りたたんだり、行へ移動したりするキーと、`Find` フィールドや `Replace` フィールドで一致箇所を移動したり置換したりする `Enter` では、`preventDefault()` も呼び出されます。  
ホストの保存やコマンドパレットのキーなど、それ以外のキーは通常どおりページに届きます。[エクスプローラー内のキー](../guide/guides/explorer.md#keys-in-the-explorer)を参照してください。`4.1.0` より前は、フローティングの検索と置換のパネルも同じようにキーを扱っていましたが、`Home`、`End`、シーケンスの最後の入力、`handTool` が別のキーに割り当てられている間の `Space` は例外でした。  
`4.0.0` からは、Display Language のピッカーも同じようにキーを扱います。同じ 7 つのバインディングはエディタに届き、それ以外のバインディング（`4.1.0` からは、シーケンスはその最後の入力で止まります）、矢印キー、`Tab` は、IME の変換中に押したキーと同じく、`preventDefault()` を呼び出されずにそこで伝播だけが止められます。行の上で押した `↑`、`↓`、`Home`、`End`、`Enter`、`Space` は行を移動するか行を選び、`preventDefault()` も呼び出されます。

### $mod

環境に応じて `Control` キーを切り替えます。

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### ショートカット表

キーボードイベントの `key, code` プロパティを使用します。  
絶対位置には `code` を、入力値には `key` を使用します。

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Theme

### setPresetTheme

プリセットテーマを設定します。  
既定値は `appearance: 'dark'`、`grayColor: 'slate'`、`accentColor: 'indigo'` です。  
各フィールドは個別に適用されるため、一部だけを指定した場合、残りの 2 つはそのまま維持されます。次の名前以外の値は無視され、エラーは発生しません。  
`4.0.0` からは、`appearance` にテーマビルダーの `System` にあたる `'system'` も指定できます。OS が報告するライトまたはダーク、あるいは [setSystemAppearance](#setsystemappearance) で指定したほうで表示し、それが変わると切り替わります。

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance

`4.0.0` からは、IDE のテーマのように独自のライトとダークを持つホストのために、外観 `'system'` が表示するライトまたはダークを指定します。指定している間は、OS の切り替えは無視されます。  
`null`、または `'dark'` と `'light'` 以外の値を指定すると、再び OS に従います。  
外観が `'light'` または `'dark'` の間は画面上で何も変わりませんが、値は保持され、外観が `'system'` になるとすぐに適用されます。それ以外の場合はすぐに適用されます。何も発行せず、`changePresetTheme` は引き続き `'system'` を報告します。  
VS Code、JetBrains、Obsidian のホストは、それぞれ自身のライトまたはダークを指定してこれを呼び出し、それが変わるたびに再び呼び出します。

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme

テーマをカスタマイズできます。  
呼び出すたびにカスタムのオーバーレイ全体が置き換わるため、既存の上書きに 1 つのトークンを追加する場合もオブジェクト全体を渡し直し、プリセットに戻す場合は `{}` を渡します。  
次のトークン名で値が文字列のものだけが保持され、それ以外はエラーにならずに破棄されます。  
オーバーレイはプリセットの上に重なるため、後から `setPresetTheme` を呼び出すと、上書きした値はそのままでプリセットだけが入れ替わります。

#### JavaScript

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` と `memoShadow` は、ERD キャンバス上でテーブルとメモが落とす影の色です。ダークプリセットではどちらも `transparent` で、`setTheme` に `none` や空文字列を渡したときと同じく影は描画されません。ライトプリセットでは `rgba(0, 0, 0, 0.18)` を使います。

`4.0.0` からは、トークンが 9 つ増えました。

- `tableGroupHeaderBackground`、`tableGroupBackground`、`tableGroupBorder` は、独自の色を持たない[テーブルグループ](../guide/guides/table-groups.md)のタイトルバー、本体、枠線の色です。
- `toastSuccess` と `toastError` は、処理がどう終わったかを伝えるトーストのマークの色です。
- `findReplaceError` と `mapColumnsError` は、検索と置換、および Map Columns のダイアログが表示するエラーの色です。検索と置換では以前は `diffDeleteForeground` を使っていたため、それを上書きしても検索と置換の色は変わらなくなりました。
- `schemaSqlWarningBackground` と `schemaSqlWarningForeground` は、Schema SQL タブのオプションにある警告の色です。

`4.1.0` からは、トークンがさらに 9 つ増えました。

- `treeBackground`、`treeRowHover`、`treeRowCurrent`、`treeMuted`、`treeMatch` は、[エクスプローラー](../guide/guides/explorer.md#the-tree)と [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) が共有するツリーの色です。`treeBackground` はツリーの背景で、エクスプローラーの `Find` と `Replace` のフィールドも塗ります。`treeRowHover` はポインタを重ねた行、ツリーにフォーカスがある間のキーボードの行、エクスプローラーのヘッダーと検索でポインタを重ねたボタン、`treeRowCurrent` は現在の検索の一致箇所の行、`treeMuted` は件数、データ型、折りたたみの矢印のような淡い色のテキスト、`treeMatch` は検索で見つかったテキストの背後のマークの色です。
- `explorerBackground` と `explorerBorder` は、エクスプローラーのパネルとその線の色です。線とは、キャンバスに接する端、検索の下の線、そしてフィールドと `Search In` で展開するボタンの枠線です。`explorerBorder` は、Diff Viewer のツリーの端、その `Filter by name` フィールドの下の線、そのフィールドの枠線も描きます。エクスプローラーのキーのアイコンには `keyPK`、`keyFK`、`keyPFK` が使われます。
- `diffModifyForeground` と `diffRenameForeground` は、Diff Viewer が変更、名前の変更として示すものの、ツリーと両方のドキュメントでの色です。`diffModifyForeground` は、ほかに何が変わったかにかかわらず、移動、サイズの変更、色の変更、グループの変更があったテーブル、メモ、テーブルグループの枠線も描き、変更された外部キーのコネクタも描きます。

`diffInsertForeground` と `diffDeleteForeground` は現在、Diff Viewer が追加、削除として示すものの色で、テキスト、枠線、コネクタのいずれでも、ツリーと、それを持つ側のドキュメントで使われます。`diffInsertBackground`、`diffDeleteBackground`、`diffCrossBackground`、`diffCrossForeground` は、Diff Viewer がセルを塗りつぶさなくなったため、`4.1.0` で削除されました。`setTheme` は `Theme` にないほかの名前と同じようにこれらを破棄し、そのフックである `--erd-editor-diff-insert-background`、`--erd-editor-diff-delete-background`、`--erd-editor-diff-cross-background`、`--erd-editor-diff-cross-foreground` も読み取られなくなりました。

#### CSS Variables

`Theme` のすべてのトークンには、`--erd-editor-` にキーをケバブケースにしたものをつないだ名前の CSS フックが対応します。`grayColor10` は `--erd-editor-gray-color-10`、`keyPK` は `--erd-editor-key-pk`、`keyPFK` は `--erd-editor-key-pfk` です。  
フックはエディタに継承されるため、適用したい場所で設定します。`:root` に設定するとページ上のすべてのエディタに、要素自身に設定するとその 1 つだけにテーマが適用されます。

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

`3.4.0` から、綴りが誤っていた `dargSelect` トークンは `dragSelect` になり、フックも `--erd-editor-darg-select-background` と `--erd-editor-darg-select-border` から `--erd-editor-drag-select-background` と `--erd-editor-drag-select-border` に変わりました。古い名前のままのスタイルシートは無視されます。

<details>
<summary>既定のテーマ値</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Display Language

`4.0.0` からは、エディタ自身のテキスト、つまりメニュー、パネル、ダイアログ、クイック検索、トースト、そして書き出した画像を含めてダイアグラム上に描画する `unnamed` のような語が、25 の言語で表示されます。テーブル名とカラム名、SQL、データ型、生成されたコードが翻訳されることはありません。[言語とテーマ](../guide/guides/language-and-theme.md)を参照してください。  
[setLocale](#setlocale) を呼び出すか言語を選ぶまで、エディタは英語で表示され、[enableLocalePicker](#enablelocalepicker) が有効な間は `'system'` に従います。  
エディタは `lang` と `dir` を、ホスト要素やページではなく、closed shadow root 内の自身のルートに設定するため、右から左に書くページでエディタが左右反転することも、右から左に書く言語でページが左右反転することもありません。ヘブライ語、アラビア語、ペルシア語では、エディタのインターフェースは右から左に配置されますが、ダイアグラム自体が左右反転することはありません。`4.1.0` からは、[エクスプローラー](../guide/guides/explorer.md)はどの言語でもキャンバスの左にとどまり、これら 3 つの言語では、その行が右から左に読む向きになります。  
パッケージは `LocaleCode`（次のいずれかのコード）と `LocaleOption` の型をエクスポートしています。

```ts
type LocaleOption = LocaleCode | 'system';
```

| コード  | 表示名               | 言語                 |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | インドネシア語       |
| `de-DE` | Deutsch              | ドイツ語             |
| `en`    | English              | 英語                 |
| `es-ES` | Español              | スペイン語           |
| `eu-ES` | Euskara              | バスク語             |
| `fr-FR` | Français             | フランス語           |
| `it-IT` | Italiano             | イタリア語           |
| `nl-NL` | Nederlands           | オランダ語           |
| `pl-PL` | Polski               | ポーランド語         |
| `pt-PT` | Português            | ポルトガル語         |
| `pt-BR` | Português Brasileiro | ブラジルポルトガル語 |
| `ro-RO` | Română               | ルーマニア語         |
| `sk-SK` | Slovenčina           | スロバキア語         |
| `sl-SI` | Slovenščina          | スロベニア語         |
| `sv-SE` | Svenska              | スウェーデン語       |
| `tr-TR` | Türkçe               | トルコ語             |
| `ru-RU` | Русский              | ロシア語             |
| `uk-UA` | Українська           | ウクライナ語         |
| `he-IL` | עברית                | ヘブライ語           |
| `ar-SA` | العربية              | アラビア語           |
| `fa-IR` | فارسی                | ペルシア語           |
| `ja-JP` | 日本語               | 日本語               |
| `zh-CN` | 简体中文             | 簡体字中国語         |
| `zh-TW` | 繁體中文             | 繁体字中国語         |
| `ko-KR` | 한국어               | 韓国語               |

### setLocale

表示言語を、`'system'` または上記のいずれかのコードで設定します。`'ko'` だけの指定、未知のコード、文字列以外の値など、それ以外の値はエラーにならずに無視されます。  
呼び出しから戻る前に適用されるため、要素を追加する前に設定した言語は、最初のフレームから表示されます。  
`changeLocale` も `change` も発行せず、`value`、Undo の履歴、shared store のいずれにも影響しません。  
`enableLocalePicker` をどちらに切り替えてもこの選択は保たれ、`setLocale('system')` はピッカーが無効でもシステムに従います。  
エディタは何も保存しません。閲覧者の選択を保持するには、[changeLocale](#changelocale) を購読し、次に読み込むときにその値を渡し直します。

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale

独自の表示言語を持つホストのために、`'system'` が表す言語を BCP 47 のタグで指定します。VS Code、JetBrains、Obsidian のホストは、それぞれ自身の表示言語を指定してこれを呼び出します。  
タグの前後の空白は取り除かれます。`null`、空文字列、文字列以外の値を指定するとブラウザの `navigator.languages` に戻り、エディタはその変化に従います。  
意味を持つのは適用されている選択肢が `'system'` の間だけで、すぐに適用されます。ピッカーの `System` の行には、それが解決された言語が表示されます。  
タグ、またはブラウザの各言語を順に、言語サブタグで、大文字・小文字とアンダースコアを無視して照合し、エディタが持つ最初の言語に解決します。`de-AT` は `de-DE` に、`en-GB` は `en` になります。中国語は文字体系で決まり、`Hant` は `zh-TW` に、`Hans` は `zh-CN` になります。文字体系の指定がない場合は地域で決まり、`TW`、`HK`、`MO` は `zh-TW` に、それ以外は `zh-CN` になります。`pt` は、`BR` 以外の地域が指定されていない限り `pt-BR` になります。どれにも一致しない場合、エディタは英語で表示されます。

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL

Schema SQL ファイルを読み込みます。  
既定では、現在のドキュメントにマージするのではなく、置き換えます。後述の `mode` を参照してください。表示位置と拡大・縮小のレベルを除いて、各ロックとそのロックされた値を含む既存の設定は維持され、ファイルの読み込み後にテーブルが配置されます。後述の `placement` で別の指定をしない限り、複数の行に並べて配置されます。`Viewport` がロックされている場合、その後 `value` は読み込みの開始時の表示、つまり拡大・縮小のレベル `1` の原点 `0, 0` を書き出します。そのため、値を一度も渡していない要素に読み込んだドキュメントは、新しいドキュメントと同じくすべてのロックがオンです。  
履歴に記録されるため `Undo, Redo` が可能で、`change` を発行します。空文字列は無視され、`readonly` が設定されている間は何も行いません。  
`setSchemaGraphQL`、`setSchemaDBML`、`setSchemaAML` も同じように動作し、これらのパーサーは失敗しません。解析できないテキストはエラーにならず、空のドキュメントを読み込みます。  
`4.0.0` からは、4 つとも省略可能な 2 番目の引数 `{ placement, mode }` を受け取ります。

- `placement: 'grid'` は既定値で、これまでどおりテーブルをすぐに複数の行に並べて配置し、呼び出しは何も返しません。
- `placement: 'auto'` は、エディタの `Import` と同じように、まずリレーションシップに沿ってテーブルをレイアウトし、読み込みが Undo の 1 ステップとして反映されると解決される `Promise` を返します。テーブルが 2 つ未満の場合、リレーションシップがない場合、レイアウトが失敗した場合、`SharedWorker` のないページの場合、`Placing tables` の通知で `Cancel` を押した場合は、代わりに複数の行に並べます。その間に別の読み込み、つまり置き換える別の読み込み、`value` への代入、`setInitialValue()`、`clear()`、共同編集の参加者による読み込み、読み込みや `clear()` の Undo または Redo が行われると、この読み込みはそれに取って代わられ、`Promise` は何も読み込まずに解決されます。この方法で配置する読み込みは、始めた順に反映されます。
- `mode: 'replace'` は既定値で、ドキュメントを置き換えます。`mode: 'append'` は、[Import and Add](../guide/guides/file-import-export.md#import-and-add) と同じようにファイルをダイアグラムの下に追加し、すでにあるテーブルと、タブと表示位置以外のすべての設定をそのまま残します。別のタブにいる場合は、先に ERD タブが表示されます。新しいテーブルと、テーブルグループが表示されている間は DBML ファイルが持ち込むテーブルグループが選択され、それらがすでに十分に見えている場合を除き、`4.1.0` からすべての移動が従う規則で、表示がそれらへスクロールします。[移動先の表示位置](../guide/guides/table-related-functions.md#where-a-jump-lands)を参照してください。1 回の Undo で追加全体を取り消せます。読み取れないテキストは何も追加せず、ドキュメントはそのまま残ります。

`readonly` が設定されている間は、置き換えは無視され、追加では何も追加されず、`placement: 'auto'` の呼び出しはすぐに解決されます。  
`3.10.0` から、`setSchemaSQL` はドキュメントで現在選択しているデータベースに合わせてファイルを読み取ります。Databricks を選択している場合、一重引用符で囲んだ文字列は Spark のバックスラッシュによるエスケープに従います。[コメント](../guide/guides/file-import-export.md#comments)を参照してください。  
`3.10.0` から、`setSchemaSQL` は 2 つ以上のカラムにまたがる `UNIQUE` を、各カラムの Unique フラグではなく 1 つのユニークインデックスとして読み取ります。[ユニークキーとインデックス](../guide/guides/file-import-export.md#unique-keys-and-indexes)を参照してください。  
`3.10.0` から、SQL、DBML、AML の読み込みでは、読み取った外部キーの `ON DELETE` と `ON UPDATE` のアクションが保持されます。  
`4.0.0` から、`setSchemaSQL` はカラムの `DEFAULT` の式全体を保持し、SQL Server の `ADD DEFAULT … FOR` とその `MS_Description` のコメントを読み取り、PostgreSQL の serial と identity のカラムを Auto Increment にし、データ型の `UNSIGNED` と `ZEROFILL` を保持し、`ALTER TABLE … ADD PRIMARY KEY` が `CLUSTERED`、`NONCLUSTERED`、`USING BTREE` を付けた主キーも読み取ります。[Schema SQL](../guide/guides/file-import-export.md#schema-sql) を参照してください。  
各パーサーが受け付ける構文については[ファイルの読み込みと書き出し](../guide/guides/file-import-export.md)を参照してください。

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL

GraphQL SDL のドキュメントを読み込みます。  
オブジェクト型の定義がテーブルになり、型が別のテーブルであるフィールドがリレーションシップになります。

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

dbdiagram.io と dbdocs で使われている形式である DBML ファイルを読み込みます。  
`4.0.0` からは、各 `TableGroup` は[テーブルグループ](../guide/guides/table-groups.md)になり、テーブルの `headercolor` はそのテーブルの色になります。[DBML](../guide/guides/file-import-export.md#dbml) を参照してください。

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

AML（Azimutt Markup Language）ファイルを読み込みます。現在の表記と従来の v1 の表記の両方に対応しています。  
`4.0.0` からは、Azimutt の色名または引用符で囲んだ 16 進数の値で指定したエンティティの色が、そのテーブルの色になります。[AML](../guide/guides/file-import-export.md#aml) を参照してください。

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON

`4.0.0` からは、[value](#value) が返すテキストのような `.erd.json` ドキュメントを読み込みます。  
既定の `mode: 'replace'` では、`value` への代入と同じようにドキュメントを読み込みます。履歴に記録され、`change` を発行し、ドキュメントのロックも同じように取り込みます。`value` とは異なり、空文字列や文字列以外の値は、新しいドキュメントを始めるのではなく無視されます。JSON でないテキストは、`value` と同じくドキュメントを空にします。  
`mode: 'append'` は、[Import and Add](../guide/guides/file-import-export.md#import-and-add) が `json` ファイルで行うのと同じように、ドキュメントのテーブル、リレーションシップ、インデックス、メモ、テーブルグループを新しい ID でダイアグラムの下に追加し、互いの相対的な位置を保ち、ドキュメントの設定は取り込みません。読み取れないテキストや、テーブルもメモもないドキュメントは何も追加しません。それ以外の場合は [setSchemaSQL](#setschemasql) の追加と同じように反映され、新しいメモとテーブルグループも、それぞれ表示されている間はテーブルとともに選択されます。  
ドキュメントが反映されてから戻り、`readonly` が設定されている間は無視されます。

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL

現在のエディタの状態を Schema SQL として書き出します。  
`databaseVendor` を指定しない場合は、現在設定されているベンダーに従って動作します。次の一覧にない名前を指定した場合も、エラーにならず同じように動作します。  
名前は、エディタが表示している括弧の種類で囲まれます。`Bracket Type` が[ロック](../guide/guides/settings.md#ロック)されている間は、これが `value` に保存される括弧の種類と異なることがあります。コーディングエージェントの [`erd_read`](../mcp/tools.md#reading-a-document) が名前を囲むのは、`value` に保存されるほうです。  
`4.0.0` からは、省略可能な `options` 引数で、[Schema SQL](../guide/guides/schema-sql.md) タブのオプションと同じようにステートメントとヘッダーを選べます。`SchemaSQLOptions` は型としてエクスポートされています。

- `statements`: 既定値の `'create'`、MySQL、MariaDB、PostgreSQL、SQLite、Databricks では `IF NOT EXISTS` を書き出し、それ以外では `'create'` として扱われる `'ifNotExists'`、テーブルを作成する前に削除する `'recreate'` のいずれかです。`'recreate'` では、Snowflake は代わりに `CREATE OR REPLACE TABLE` を書き出します。
- `header`: 既定値の `'none'`、ドキュメントのデータベースまたはスキーマに切り替える `'use'`、それが存在しない場合は先に作成してから切り替える `'createAndUse'` のいずれかです。指定したものがないデータベースは、タブと同じように別の形式で書き出します。Oracle は `'createAndUse'` に対して `'use'` を書き出し、PostgreSQL は `'use'` に対してヘッダーを書き出さず、SQLite はヘッダーを書き出しません。ヘッダーが書き出されるのは、ドキュメントのデータベース名が単純な識別子、つまり ASCII の英字、数字、`_` からなり、数字で始まらない名前である間だけです。

省略したオプションや未知の値を指定したオプションは既定値として扱われるため、オプションなしで呼び出すと、これまでどおりヘッダーのない通常の `CREATE` 文が書き出されます。  
`4.0.0` からは、出力には常にドキュメントの `Before tables` と `After tables` のスクリプトが含まれ、ヘッダー、前のスクリプト、DROP 文、テーブル、後のスクリプトの順に並びます。Schema SQL タブ自身の `Statements`、`Header`、`Tables` の選択がこの呼び出しに影響することはなく、常にドキュメント全体が書き出されます。  
`3.10.0` からは、各外部キーにリレーションシップの `ON DELETE` 句と `ON UPDATE` 句が付きます。句が書き出されるのは、アクションが設定されていて、そのベンダーが受け付ける場合だけのため、そのベンダーが受け付けないアクションは省かれ、既定の動作が適用されます。`4.0.0` からは、Snowflake が受け付けるのは `NO ACTION` だけです。各データベースが何を書き出すかは、[ON DELETE と ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)を参照してください。  
`3.10.0` からは、テーブルやカラムのコメントの中の一重引用符がエスケープされるため、`it's` のようなコメントで文が壊れることはなくなりました。コメントを文字列リテラルとして書き出すベンダーはいずれも引用符を 2 つ重ねますが、Databricks は例外で、各引用符と各バックスラッシュの前にバックスラッシュを付けます。SQLite は引き続きコメントを `--` 行として書き出します。  
`4.0.0` からは、いくつかのデータベースで、キーの名前、既定値、Auto Increment の書き出し方も変わりました。[DDL が書き出す内容](../guide/guides/schema-sql.md#ddl-が書き出す内容)を参照してください。

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
```

## getSharedStore

リアルタイム共同編集のための store を返します。  
`config` は `{ getNickname?, mouseTracker?, focusTracker? }` です。どちらのトラッカーも既定値は `true` で、`mouseTracker` はこのエディタのマウスカーソルを他のエディタに配信し、`focusTracker` はフォーカスしているセル、選択範囲、ドラッグの範囲を配信します。  
[共同編集](./advanced/collaborative-editing.md)を参照してください。

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue

現在開いているドキュメントと、渡したドキュメントを比較する Diff Viewer を開きます。  
戻り値はなく、ドキュメントも変更しないため、ビューアーを閉じてもエディタは元のままです。  
空の値や文字列以外の値を指定した場合は、空のドキュメントと比較します。  
キャンバスのコンテキストメニューにある [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer) と同じオーバーレイです。  
`4.1.0` からは、2 つのドキュメントが持つ項目をまず ID で対応付け、その後で、テーブルの名前やメモの本文のように、それぞれが変わらずに保っているもので対応付けます。[比較対象](../guide/guides/table-related-functions.md#what-is-compared)を参照してください。そのため、ファイルの Git のリビジョンのような同じドキュメントの以前のバージョンと比較すると、名前の変更は名前を変更した 1 つの項目として表示され、ID が異なるドキュメントと比較すると、1 つの削除と 1 つの追加として表示されます。ビューアーは変更点を 2 つのドキュメントの横のツリーに一覧表示し、セルを塗りつぶす代わりに色で変更を示します。

```js
editor.setDiffValue('prev json...');
```
