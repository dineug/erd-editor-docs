---
sidebar_position: 2
description: erd-editor 要素の API。属性、value、イベント、テーマ、キーバインディング、スキーマの読み込みと書き出し。
---

# ErdEditorElement

エディタは単なる `HTMLElement` です。  
型定義は次のとおりです。

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  value: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'search'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: (value: string) => void;
  setSchemaGraphQL: (value: string) => void;
  setSchemaDBML: (value: string) => void;
  setSchemaAML: (value: string) => void;
  getSchemaSQL: (databaseVendor?: DatabaseVendor) => string;
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

属性は `readonly`、`system-dark-mode`、`enable-theme-builder` の 3 つだけで、いずれも既定値は `false` です。

## readonly

エディタの編集可否を設定します。  
設定されている間は、`value` への代入、`clear()`、`setSchemaSQL()`、`setSchemaGraphQL()`、`setSchemaDBML()`、`setSchemaAML()`、undo、redo がすべて無視され、`change` イベントも発行されません。ドキュメントの読み込みには [setInitialValue](#setinitialvalue) を使用します。  
表示は引き続き動作します。拡大・縮小、表示位置の移動、ハンドツール、Zen モード、キャンバスのタブ、テーブルへのフォーカスを含む [Visualization](../guide/guides/visualization.md) タブの両方のモード、データベースベンダー、SQL とコード生成の出力設定はそのまま適用されるため、読み取り専用のビューアーでも別のベンダー向けの SQL を書き出したり、生成されたコードを読んだりできます。  
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
有効にすると、テーマの `appearance` は OS の設定から決まり、[setPresetTheme](#setpresettheme) で指定した値を上書きします。OS 側でモードが切り替わると、そのたびに再び上書きされます。その間に呼び出した `setPresetTheme` は、次に OS が切り替わるまで有効です。無効にすると、最後の値のまま固定されます。

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

![テーマビルダーを開いてアクセントカラーとグレーカラーを切り替える](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

このパネルからプリセットテーマを変更すると、[changePresetTheme](#changepresettheme) イベントを発行します。

## value

### getter

現在のエディタの状態を、エディタが定義する[スキーマ](./advanced/schema.md)の JSON 文字列として取得します。  
シリアライズの際にはドキュメントの `ignoreSaveSettings` が適用され、スクロールのビットが設定されている場合は表示の原点が `0, 0`、拡大・縮小のビットが設定されている場合は拡大・縮小のレベルが `1` として書き出されます。

```js
const data = editor.value;
```

### setter

以前に保存したエディタの状態を読み込みます。ドキュメント全体を置き換えるため、現在のドキュメントは先に消去されます。  
`clear()`、`setInitialValue()`、`setSchema*` の各メソッドと同様に、Visualization タブの Flow の表示状態、つまりレイアウト、絞り込んでいるテーブル、行の表示、拡大・縮小、表示位置も破棄します。  
履歴に記録されるため `Undo, Redo` が可能で、`change` を発行します。  
空文字列や文字列以外の値を指定した場合はエラーにならず、空のドキュメントを読み込むため、代入する前に値を確認します。  
`readonly` が設定されている間は無視されます。読み取り専用のエディタに読み込むには [setInitialValue](#setinitialvalue) を使用します。

```js
editor.value = 'json...';
```

## setInitialValue

以前に保存したエディタの状態を読み込みます。読み込み自体は履歴に記録されないため Undo できず、`change` イベントも発行されません。  
読み込むときに履歴も消去されるため、読み込む前に行った操作を、読み込んだドキュメントに対して `Undo, Redo` することはできません。  
空文字列や文字列以外の値を指定した場合はエラーにならず、空のドキュメントを読み込むため、`setInitialValue('')` は空のダイアグラムから始めます。  
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

公開されているイベントは `change` と `changePresetTheme` の 2 つだけです。  
要素は内部の処理のために `@dineug/erd-editor/internal-*` イベントも自身に発行しますが、これらは API には含まれません。

### change

エディタに変更があるとイベントを発行します。  
200ms のデバウンスがかかり、`readonly` が `true` の間は発行されません。  
UI での編集、`value` への代入、`clear()`、`setSchema*` の各メソッドなど、ドキュメントのあらゆる変更で発行されます。`setInitialValue` では発行されません。  
Visualization タブの Flow モード内の操作、つまり拡大・縮小、表示位置の移動、カードの移動、`Tidy Up`、行の表示の変更、カードからの表示の絞り込みは、どれもドキュメントの変更ではないため発行されません。タブの切り替えでは発行されるため、ERD タブからテーブルにフォーカスすると `change` が 1 回発行され、Flow から ERD タブへ戻るカードの外部リンクボタンでも同様に発行されます。  
イベントは `detail` を持たず、バブリングもシャドウ境界の通過もしないため、要素自身で購読し、ハンドラー内で `editor.value` を読み取ります。

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

組み込みのテーマビルダーからプリセットテーマを変更したときに発行されます。  
[setPresetTheme](#setpresettheme) を自分で呼び出した場合は発行されません。  
`event.detail` は、指定した一部の値ではなく、完全に解決された `ThemeOptions`（`{ appearance, grayColor, accentColor }`）です。

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
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

エディタの状態を初期化します。  
履歴に記録されるため元に戻すことができ、`change` を発行します。`readonly` が設定されている間は無視されます。

```js
editor.clear();
```

## destroy

エディタのインスタンスを完全に破棄し、再利用できないようにします。  
エディタのリスナーと購読を解放し、[getSharedStore](#getsharedstore) が返したすべての shared store を破棄します。

```js
editor.destroy();
```

## setKeyBindingMap

キーボードショートカットを再定義します。  
`edit`、`stop`、`search`、`undo`、`redo`、`zoomIn`、`zoomOut`、`zoomReset` は固定で、再定義できません。  
書き込めるのは次の 16 個の名前だけで、固定の名前を含め、オブジェクト内のそれ以外の値は無視されます。  
バインディングの値は `ShortcutOption[]` である必要があります。文字列だけの指定は無視されるため、`{ addTable: 'Alt+KeyN' }` ではなく `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` と記述します。  
呼び出しは部分的なマージです。指定しなかった名前は既定値のまま維持され、2 回呼び出しても以前の変更は保持されます。現在のバインディングを取得する getter はありません。

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
  | 'search'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
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

`selectAllTable` と `handTool` はキャレットに譲ります。フォーカスが input、textarea、`contenteditable` の中にある間は `$mod + A` がテキストを選択し、`Space` は空白を入力して、キャンバスには届きません。別のショートカットに再定義しても動作は同じです。

`focusView` は ERD タブでのみ動作します。テーブルを 1 つ以上選択している場合は、Visualization タブを Flow モードで開き、それらのテーブルと、リレーションシップ 1 つでつながるすべてのテーブルに表示を絞り込みます。テーブルを選択していない場合は何もしません。[テーブルへのフォーカス](../guide/guides/visualization.md#focusing-on-tables)を参照してください。

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

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light';
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
  tableSelect: string;
  tableBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;

  columnSelect: string;
  columnHover: string;

  relationshipHover: string;

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

  diffInsertBackground: string;
  diffDeleteBackground: string;
  diffCrossBackground: string;
  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffCrossForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

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
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-column-select: #2e3135;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
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
  --erd-editor-diff-insert-background: #113b29;
  --erd-editor-diff-delete-background: #500f1c;
  --erd-editor-diff-cross-background: #003362;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-cross-foreground: #70b8ff;
}
```

</details>

## setSchemaSQL

Schema SQL ファイルを読み込みます。  
現在のドキュメントにマージするのではなく、置き換えます。表示位置と拡大・縮小のレベルを除いて既存の設定は維持され、ファイルの読み込み後にテーブルが自動で配置されます。  
履歴に記録されるため `Undo, Redo` が可能で、`change` を発行します。空文字列は無視され、`readonly` が設定されている間は何も行いません。  
`setSchemaGraphQL`、`setSchemaDBML`、`setSchemaAML` も同じように動作し、これらのパーサーは失敗しません。解析できないテキストはエラーにならず、空のドキュメントを読み込みます。  
各パーサーが受け付ける構文については[ファイルの読み込みと書き出し](../guide/guides/file-import-export.md)を参照してください。

```js
editor.setSchemaSQL('Schema SQL...');
```

## setSchemaGraphQL

GraphQL SDL のドキュメントを読み込みます。  
オブジェクト型の定義がテーブルになり、型が別のテーブルであるフィールドがリレーションシップになります。

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

dbdiagram.io と dbdocs で使われている形式である DBML ファイルを読み込みます。

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

AML（Azimutt Markup Language）ファイルを読み込みます。現在の表記と従来の v1 の表記の両方に対応しています。

```js
editor.setSchemaAML('AML...');
```

## getSchemaSQL

現在のエディタの状態を Schema SQL として書き出します。  
`databaseVendor` を指定しない場合は、現在設定されているベンダーに従って動作します。次の一覧にない名前を指定した場合も、エラーにならず同じように動作します。

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

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
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

```js
editor.setDiffValue('prev json...');
```
