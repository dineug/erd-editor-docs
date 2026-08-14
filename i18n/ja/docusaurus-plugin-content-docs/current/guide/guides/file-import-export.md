---
sidebar_position: 2
description: JSON やスキーマ SQL の読み込みと、JSON・スキーマ SQL・PNG の書き出し。
---

# ファイルの読み込みと書き出し

## 外部ファイルの読み込み

### JSON

[エディタで定義したスキーマ形式](../../api/advanced/schema.md)のファイルを読み込めます。
ファイル名は `.json` で終わる必要があります。`.erd` や `.vuerd` ファイルはここでは読み込めません。

<img src="/img/import-json.png" width="400" alt="JSON 読み込みメニュー" loading="lazy" />

### Schema SQL

SQL で定義したスキーマファイルも読み込めます。  
データベースベンダーに関係なく、できるだけ柔軟にパースするよう実装していますが、対応していない構文がある場合もあります。  
[対応している構文はこちらで確認できます。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

<img src="/img/import-sql.png" width="400" alt="Schema SQL 読み込みメニュー" loading="lazy" />

## 書き出し

書き出しは次の 3 つの形式に対応しています。

- JSON: エディタで定義したスキーマファイルです。`<データベース名>-<時刻>.erd.json` として保存されます。
- Schema SQL: データベースベンダーの構文に合わせて生成したスキーマファイルです。
- PNG: ダイアグラムを画像として生成します。

<img src="/img/export-menu.png" width="400" alt="書き出しメニュー" loading="lazy" />
