---
sidebar_position: 3
---

# テーブルの編集

テーブルの編集は、基本的に Excel に近い操作感で行えます。  
編集モードは `Enter` で開始します。

![demo-table-edit](/img/demo-table-edit.webp)

## カラムの追加

ショートカット `Alt + Enter` で作成します。  
選択しているすべてのテーブルにカラムが追加されます。

## Tab キー

`Tab` を押すと、次のセルの編集モードにそのまま移動します。  
最後のセルで `Tab` を押すと、新しいカラムを作成します。  
`Shift + Tab` で前のセルの編集モードに移動します。

![demo-table-tab](/img/demo-table-tab.webp)

## カラムの複数選択

次の 4 つの方法に対応しています。

- `Shift + Arrow Up/Down`
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac)
- `Shift + click`
- `Alt + A`: すべて選択

![demo-column-select](/img/demo-column-select.webp)

## カラムの並べ替えと移動

`drag` で動作し、他のテーブルへ移動できます。

![demo-column-move](/img/demo-column-move.webp)

`Ctrl + drag` (Windows/Linux) または `⌘ + drag` (Mac) で複数カラムの移動にも対応しています。

![demo-column-multi-move](/img/demo-column-multi-move.webp)

## カラムの削除

現在選択しているカラムを削除します。  
ショートカット: `Alt + Backspace` または `Alt + Delete`

![demo-column-remove](/img/demo-column-remove.webp)

## カラムのコピー / 貼り付け

表形式のクリップボードとして動作します。  
Shortcuts: `Ctrl + C` (Windows/Linux) or `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) or `⌘ + V` (Mac)

エディタから Excel へ、Excel からエディタへ貼り付けられます。  
次のカラムでは、以下の値を true として扱います（大文字小文字は区別しません）。

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

![demo-copy-column-to-sheet](/img/demo-copy-column-to-sheet.webp)
![demo-copy-sheet-column](/img/demo-copy-sheet-column.webp)

複数テーブルを選択した場合の操作にも対応しています。

![demo-copy-column-multi](/img/demo-copy-column-multi.webp)

## カラムの主キー

テーブルのコンテキストメニュー、またはショートカット `Alt + K` で、選択したカラムを主キーに設定します。

![demo-column-pk](/img/demo-column-pk.webp)
