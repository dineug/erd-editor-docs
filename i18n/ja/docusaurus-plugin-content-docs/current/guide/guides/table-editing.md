---
sidebar_position: 3
description: カラムの追加、複数選択、並べ替えと削除、カラムオプションの切り替え、コピーと貼り付け。
---

# テーブルの編集

テーブルの編集は、基本的に Excel に近い操作感で行えます。  
編集モードは `Enter`、またはセルのダブルクリックで開始します。

![Alt + N でテーブルを追加し、2 つのカラムを入力](/img/demo-table-edit.webp)

## カラムの追加

ショートカット `Alt + Enter` (Windows/Linux) または `⌥ + Enter` (Mac) で作成します。  
選択しているすべてのテーブルにカラムが追加されます。

## Tab キー

`Tab` を押すと、次のセルの編集モードにそのまま移動します。  
最後のセルで `Tab` を押すと、新しいカラムを作成します。  
`Shift + Tab` で前のセルの編集モードに移動します。

![Tab でセルを移動し、最後のセルでカラムを追加して Shift + Tab で戻る](/img/demo-table-tab.webp)

## DataType の自動補完

`DataType` セルの編集を開始して入力すると、選択しているデータベースに一致する型が候補として表示され、入力した文字列をそのまま含む部分がハイライトされます。  
一致はあいまい検索のため、`vch` でも `VARCHAR` が見つかります。

- `Arrow Up` or `Arrow Down`: 候補を移動します。
- `Arrow Right`, `Tab` or `Enter`: ハイライトされている候補を確定します。
- `Arrow Left`: 入力した文字列に戻ります。

候補はクリックでも選択できます。  
入力は強制されないため、一覧にない型も自由に入力でき、`VARCHAR(255)` のような引数も指定できます。  
候補は選択しているデータベースに従います。データベースを変更すると提示される候補が変わり、既存のカラムはそのまま残ります。

![矢印キー、Tab、Enter であいまい検索の候補から DataType を入力](/img/demo-data-type-autocomplete.webp)

## Not Null, Unique, Auto Increment

この 3 つのセルはテキストではなくトグルです。  
ダブルクリック、またはフォーカスした状態で `Enter` を押すと切り替わります。

Not Null のセルは、設定されているときは `N-N`、設定されていないときは `NULL` と表示されます。  
`UQ` と `AI` は、オフのときは薄く表示され、オンのときはハイライトされます。

![Not Null はダブルクリック、Unique と Auto Increment は Enter で切り替え](/img/demo-column-options.webp)

[テーブルの表示オプション](./table-related-functions.md)で非表示になっているセルは切り替えられません。

## カラムの複数選択

次の 5 つの方法に対応しています。

- `Shift + Arrow Up/Down`: 1 行ずつ選択範囲を広げます。
- `Ctrl + click` (Windows/Linux) or `⌘ + click` (Mac): カラムを 1 つ追加します。
- `Shift + click`: 最後にフォーカスしたカラムからの範囲を選択します。
- `Ctrl + Shift + click` (Windows/Linux) or `⌘ + Shift + click` (Mac): その範囲を選択に追加します。
- `Alt + A` (Windows/Linux) or `⌥ + A` (Mac): すべて選択

![Shift + Arrow Down、Ctrl/⌘ + click、Shift + click、Alt + A でカラムを選択](/img/demo-column-select.webp)

## カラムの並べ替えと移動

`drag` で動作し、他のテーブルへ移動できます。

![カラムをドラッグして並べ替え、別のテーブルへ移動](/img/demo-column-move.webp)

`Ctrl + drag` (Windows/Linux) または `⌘ + drag` (Mac) で複数カラムの移動にも対応しています。

![3 つのカラムを選択し、Ctrl/⌘ + drag で別のテーブルへ移動](/img/demo-column-multi-move.webp)

## カラムの削除

現在選択しているカラムを削除します。  
ショートカット: `Alt + Backspace` または `Alt + Delete` (Windows/Linux)、`⌥ + ⌫` または `⌥ + Delete` (Mac)

![Alt + Backspace でカラムを 1 つ、続けて選択した 2 つのカラムを削除](/img/demo-column-remove.webp)

## カラムのコピー / 貼り付け

表形式のクリップボードとして動作します。  
ショートカット: `Ctrl + C` (Windows/Linux) または `⌘ + C` (Mac)、`Ctrl + V` (Windows/Linux) または `⌘ + V` (Mac)

エディタから Excel へ、Excel からエディタへ貼り付けられます。  
次のカラムでは、以下の値を true として扱います（大文字小文字は区別しません）。

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

書き出すときは、AutoIncrement と Unique は `TRUE` または `FALSE`、Not Null は `NOT NULL` または `NULL` として出力します。

![4 つのカラムをスプレッドシートに貼り付け、フラグは TRUE/FALSE と NOT NULL/NULL で出力](/img/demo-copy-column-to-sheet.webp)

![スプレッドシートの 3 行をカラムとしてテーブルに貼り付け、YES、1、NOT NULL は true として扱う](/img/demo-copy-sheet-column.webp)

複数テーブルを選択した場合の操作にも対応しています。

![2 つのカラムをコピーし、選択した 2 つのテーブルにまとめて貼り付け](/img/demo-copy-column-multi.webp)

## テーブルとメモのコピー / 貼り付け

フォーカスしているテーブル内でカラムを選択していない場合は、同じショートカットで選択中のテーブルとメモ自体をコピーします。[テーブル関連機能](./table-related-functions.md)を参照してください。

## カラムの主キー

フォーカスしているカラムの主キーを切り替えます。対象はフォーカスしているセルが属するカラムであり、選択中のカラム全体ではありません。  
テーブルのコンテキストメニュー、またはショートカット `Alt + K` (Windows/Linux) または `⌥ + K` (Mac) で操作します。  
行に表示されるキーのアイコンは表示専用のため、クリックしても主キーは設定されません。

![Alt + K で 2 つのカラムの主キーをオンにし、1 つを再びオフに切り替え](/img/demo-column-pk.webp)
