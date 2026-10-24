---
sidebar_position: 3
description: .erd.json のドキュメント形式、ファイルが保持する保存形式とエディタが保持するランタイム値、TypeScript の型定義、数値フィールドの定数、公開されている JSON Schema。
---

# Schema

`.erd.json` はエディタのドキュメント形式です。エディタの外部でドキュメントを生成・検証・移行する必要がある場合は、このページを参照してください。

`4.0.0` からは、ドキュメントには 2 つのシリアライズ形式があり、どちらも `version` は `'3.0.0'` です。保存形式はファイルが保持する形式で、[`editor.value`](../erd-editor-element.md#value) が返す値であり、JSON の書き出しが書き込む内容であり、公開されている [JSON Schema](#json-schema) が受け付ける唯一の形式です。ランタイム値はエディタが保持しているとおりのドキュメント全体で、[`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) が返します。`setInitialValue()`、`value` の setter、`setSchemaJSON()` は、どちらの形式も、以前のリリースで保存したファイルも、v2 の `.vuerd` ドキュメントも読み込みます。`4.0.0` より前は形式が 1 つだけで、`value` は、現在の `runtimeValue` と同じように、エディタが保持しているとおりのドキュメント全体を返していました。

## 保存形式とランタイム値

保存形式が保持するのは現存するエンティティだけです。つまり、`doc.tableIds` に並ぶ各テーブル、それらのテーブルが列挙するカラム、残る 2 つのテーブルの間のリレーションシップ、残るテーブルのインデックスと、指すカラムをテーブルがまだ列挙しているインデックスカラム、リストに並ぶメモとテーブルグループ、そして `4.2.0` からは、リストに並び、id 以外に値を持つ単語、用語、ドメインです。エディタが読み込むときに導き出すものや、開いている間だけ保持するものは含みません。削除したエンティティ、`seqColumnIds` と `seqIndexColumnIds`、すべての `zIndex`、計測した幅、カラムの `ui`、リレーションシップの `identification`、`startRelationshipType`、接続位置、そして `4.2.0` からは辞書の各行の `order` と、`doc.wordIds`、`doc.termIds`、`doc.domainIds` のリストがこれにあたります。以下の型では、これらの各フィールドに `// runtime only` と記しています。  
辞書を除くすべてのコレクションは id をキーとしてコード単位の順に並び、カラムはまず `tableId` ごとに、インデックスカラムはまず `indexId` ごとにまとめられます。`4.2.0` からは、`wordEntities`、`termEntities`、`domainEntities` がこの順で他のすべてのコレクションの後に置かれ、それぞれヘッダーと行の形で、1 つの行がテキストの 1 行になるように書き出されます（[辞書の行](#dictionary-rows)を参照）。各エンティティはフィールドを決まった順序で書き出し、テキストは 2 つのスペースでインデントされ、改行で終わります。そのため、同じドキュメントからは常に同じバイト列が書き出され、編集は触れた部分だけを変え、別のフォントを持つマシンで保存したファイルも同じ `value` で開き直されます。  
VS Code、Obsidian、JetBrains のプラグインは、編集によって `value` が変わったときにだけファイルを書き込むため、以前のリリースで保存したファイルは、最初の編集まで古い形式のままです。

`4.2.0` からは、保存形式は何も持たないものも含めません。対象は、エンティティまたはその `ui` が `''` として持つ各テキストフィールド（テーブルの `name`、`comment`、`ui.color`、カラムの `name`、`comment`、`dataType`、`default`、インデックスの `name`、メモの `value` と `ui.color`、テーブルグループの `name` と `color`）、エントリーを 1 つも持たない `doc` の各リストと各コレクション、そしてすべてのコレクションが空になったときの `collections` 自体です。空白だけのテキストは保持しているとおりに書き出されます。ただし、空白だけの論理名は含まれず、id 以外の値がすべて空か空白だけの単語、用語、ドメインは行全体が含まれません。すべての id、エンティティ内のすべてのリスト、`0` を含むすべての数値は引き続き書き出されます。`doc` は常に書き出されるため、新しいドキュメントのファイルは `$schema`、`version`、設定、`"doc": {}` を持ちます。  
パースでは、すべての v3 のリリースと同じく、ないテキストフィールドは `''` として、ないコレクションは空として読み込まれます。また、保存形式が `doc` のリストを含めないのは、そのコレクションが何も持たない間だけです（[Doc](#doc) を参照）。そのため、`4.2.0` より前のエディタもこれらのファイルを開けます。ファイルを自分で読み込むプログラムも、ないものを同じように読み取る必要があります。以前のリリースで保存したファイルは、次に保存したときに空のテキスト、リスト、コレクションが取り除かれた形で戻ります。この変化は一度だけで、それ以降は 1 バイトも違わずに保存されます。

ランタイム値は、保存形式が含まないもの、つまり削除したエンティティ、シーケンス、重なり順、幅、キーのマーク、リレーションシップのフラグ、接続位置、空のテキストフィールドを保持し、`tableIds`、`relationshipIds`、`indexIds`、`memoIds` の 4 つのリストと、`tableEntities` から `memoEntities` までの 6 つのコレクションは空の間も保持します。`4.2.0` からは、削除した単語、用語、ドメイン、何も持たない行、各行の `order`、辞書の 3 つのリスト、空白だけの論理名、削除したドメインへの紐付けも保持します。2 つのスペースでインデントされ、末尾に改行はありません。共同編集の参加者や 2 つ目のビューに `setInitialValue()` で初期値を設定するためだけに使います。そうすれば、別のエディタから削除の Undo が送られてきたときに、そこでもエンティティが元のとおりに戻ります。ファイルには決して書き込まないでください。JSON Schema はこれを受け付けません。削除したエンティティを回収するものはもうないため、次にドキュメントをファイルから開くまで、ランタイム値はそれらを保持します。

どちらの形式も、ロックされた設定はそれぞれロックされた値で書き出し（[`lockSettings`](#settings) を参照）、`settings.ddlScripts` はスクリプトにテキストがある間だけ、テーブルの `groupId` は空でない間だけ書き出します。`4.2.0` からは、どちらの形式も、`settings.nameViewMode` は書き出す値が `'physical'` でない間だけ、`settings.columnOrder` は可能な場合は 7 つのエントリーで（[Settings](#settings) を参照）、テーブルの `nameDerived` は `true` の間だけ書き出します。  
保存形式は、`doc.tableGroupIds` と `tableGroupEntities` をテーブルグループが存在する間だけ、`logicalName` を空白以外のテキストを持つ間だけ、カラムの `domainId` をファイルに書き出すドメインを指している間だけ、各辞書をファイルに書き出す行を持つ間だけ書き出します。ランタイム値は、テーブルグループのフィールドをドキュメントがグループか削除したグループを保持している間、`logicalName` と `domainId` を `''` でない間、各辞書とそのリストを、削除した行も含めてどちらかがエントリーを持つ間書き出します。

## TypeScript

型はランタイム値を表します。`// runtime only` と記したフィールドは保存形式には含まれず、`?` を付けたフィールドは何かを保持している間だけ書き出されます。`4.2.0` から保存形式が含めない空のテキスト、リスト、コレクションには、印を付けていません。

### ERDEditorSchemaV3

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections: {
    tableEntities: Record<string, Table>;
    tableColumnEntities: Record<string, Column>;
    relationshipEntities: Record<string, Relationship>;
    indexEntities: Record<string, Index>;
    indexColumnEntities: Record<string, IndexColumn>;
    memoEntities: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

すべてのエンティティは不透明な文字列である `id` を持ち、コレクションではこれがキーになります。ただし 3 つの辞書は例外で、`id` は行の最初の値です。`4.2.0` からは、パースでは、キーを持つ 7 つのコレクションのエンティティで `id` がない、空、または文字列でない場合は、保持されているキーを id として読み込み、オブジェクトでないエントリーと、id がなくキーが `''` のエントリーは取り除きます。辞書の行は、配列でない場合や、`id` が `''` 以外の文字列でない場合に取り除かれます。`4.2.0` より前のエディタは `id` がないか空のエンティティを取り除くため、保存形式は引き続きすべての id を書き出します。  
`4.0.0` からは、辞書の行のものも含め、新しい id はすべて Uuid25 形式で書いた UUIDv7、つまり `03gzrxjv20bdlcak89q25d2m7` のような小文字の 36 進数 25 桁になるため、1 つのエディタが発行した id は作成した順に並びます。ドキュメントは、以前のリリースの nanoid の id や v2 ファイルの id など、保持している id をそのまま保つため、id の形に依存しないでください。

`4.0.0` からは、どのエンティティも `meta` オブジェクト（`createAt`、`updateAt`）を持たず、`EntityMeta` 型と `EntityType` 型は削除されました。`meta` を書き出すものはなく、古いファイルが持つ `meta` はパースで取り除かれ、JSON Schema はこれを受け付けません。`meta` は削除したエンティティのガベージコレクションの時期を決めるためだけのもので、そのガベージコレクションもなくなりました。

### Settings

```ts
type Settings = {
  originX: number;
  originY: number;
  zoomLevel: number;
  show: number; // Constants: Show
  database: number; // Constants: Database
  databaseName: string;
  canvasType: string; // Constants: CanvasType
  language: number; // Constants: Language
  tableNameCase: number; // Constants: NameCase
  columnNameCase: number; // Constants: NameCase
  bracketType: number; // Constants: BracketType
  relationshipDataTypeSync: boolean;
  columnOrder: number[]; // Constants: ColumnType
  maxWidthComment: number;
  lockSettings: number; // Constants: LockSettingType
  ddlScripts?: DDLScripts;
  nameViewMode?: string; // Constants: NameViewMode
};

type DDLScripts = {
  before: string;
  after: string;
};

// Constants
const CanvasType = {
  ERD: 'ERD',
  visualization: '@dineug/erd-editor/builtin-visualization',
  schemaSQL: '@dineug/erd-editor/builtin-schema-sql',
  generatorCode: '@dineug/erd-editor/builtin-generator-code',
  settings: 'settings',
  dictionary: '@dineug/erd-editor/builtin-dictionary',
} as const;

const Show = {
  tableComment: 1,
  columnComment: 2,
  columnDataType: 4,
  columnDefault: 8,
  columnAutoIncrement: 16,
  columnPrimaryKey: 32,
  columnUnique: 64,
  columnNotNull: 128,
  relationship: 256,
  columnAlternateKey: 512,
  hideReferentialAction: 1024,
  hideTableGroup: 2048,
  hideMemo: 4096,
  columnDomain: 8192,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
  columnLogicalName: 128,
  columnDomain: 256,
} as const;

const Database = {
  MariaDB: 1,
  MSSQL: 2,
  MySQL: 4,
  Oracle: 8,
  PostgreSQL: 16,
  SQLite: 32,
  Databricks: 64,
  Snowflake: 128,
} as const;

const Language = {
  GraphQL: 1,
  csharp: 2,
  Java: 4,
  Kotlin: 8,
  TypeScript: 16,
  JPA: 32,
  Scala: 64,
  Go: 128,
  SQLAlchemy: 256,
  TypeORM: 512,
  Sequelize: 1024,
  Drizzle: 2048,
  DBML: 4096,
  AML: 8192,
  Mermaid: 16384,
  PHP: 32768,
  Doctrine: 65536,
  Rust: 131072,
  SeaORM: 262144,
  Swift: 524288,
  Zod: 1048576,
  JSONSchema: 2097152,
} as const;

const NameCase = {
  none: 1,
  camelCase: 2,
  pascalCase: 4,
  snakeCase: 8,
} as const;

const BracketType = {
  none: 1,
  doubleQuote: 2,
  singleQuote: 4,
  backtick: 8,
} as const;

const LockSettingType = {
  viewport: 1, // originX, originY and zoomLevel
  canvasType: 2,
  language: 4,
  tableNameCase: 8,
  columnNameCase: 16,
  bracketType: 32,
  unlockNameViewMode: 64, // nameViewMode; set while unlocked
} as const;

const NameViewMode = {
  physical: 'physical',
  logical: 'logical',
  both: 'both',
} as const;
```

`originX` と `originY` は表示位置、つまりシーン座標 `(0, 0)` が画面上で置かれる点です。  
`zoomLevel` は `0.1` から `1.5` までです。`1` を超えて保存したドキュメントは、`3.5.0` より前のエディタでは `1` で開きます。  
`4.0.0` からは、設定に `width`、`height`、`scrollTop`、`scrollLeft`、`relationshipOptimization`、`ignoreSaveSettings` はありません。これらを書き出すものはなく、パーサーはどれも保持せず、JSON Schema はまだこれらを持つファイルを受け付けません。

`canvasType` はドキュメントを開いたときに表示するタブです。Visualization タブで保存したドキュメントは `'@dineug/erd-editor/builtin-visualization'` を保持しますが、`Graph` モードと `Flow` モードのどちらを表示していたかは保持せず、新しく作成したエディタはそのタブを `Graph` モードで表示します。  
`4.0.0` からは、新しいドキュメントと同じように `Canvas Type` のロックがオンの間、ドキュメントはロックしたときに表示していたタブを保持し、タブを切り替えても `value` は変わりません。設定タブでロックした場合は、設定タブを開く前に表示していたタブを保持します。手で編集した場合にしか書き出されない、ロックされた `'settings'` は `'ERD'` で開きます。  
`4.2.0` からは、`canvasType` は[辞書](../../guide/guides/dictionary.md)タブを表す `'@dineug/erd-editor/builtin-dictionary'` にもなり、`Canvas Type` のロックは他のタブと同じようにこの値を保持します。`4.2.0` より前のエディタはこの値を保ちますが、タブが選ばれるまで、ツールバーの下にタブを何も表示しません。  
`Flow` モード自体の状態は何もシリアライズされません。配置、拡大・縮小、表示位置、行の表示、フォーカスしているテーブルはエディタ内にとどまり、`4.2.0` からは [`Previous table` と `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) でたどるビューも同様です。そのため、`originX`、`originY`、`zoomLevel` は常に ERD キャンバスを表します。

`show` と `lockSettings` はビットマスクです。フラグを OR で結合します。  
`columnOrder` は `ColumnType` の各値を 1 回ずつ表示順で保持する配列です。`4.2.0` からは、後述のカラム順の段落で説明するとおり、ドキュメントは 9 つのうち 7 つの値で書き出すことがあります。  
`database`、`language`、`tableNameCase`、`columnNameCase`、`bracketType` はそれぞれ 1 つの値だけを保持し、組み合わせた値は JSON Schema で拒否されます。

新しいドキュメントの `show` は `431` で、`tableComment`、`columnComment`、`columnDataType`、`columnDefault`、`columnPrimaryKey`、`columnNotNull`、`relationship` が設定されています。  
`3.10.0` からは `show` のフラグが 2 つ増えました。どちらも、新しいドキュメントと、`3.10.0` より前に保存したすべてのドキュメントではオフです。  
`columnAlternateKey`（`512`）は [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) の表示オプションです。設定すると、2 つ以上のカラムにまたがる各ユニークインデックスのカラムに `AK1.1`、`AK1.2` などのマークが付きます。最初はオフのため、既存のダイアグラムの幅が変わることはありません。  
`hideReferentialAction`（`1024`）は逆の働きをします。設定するとコネクタの [ON DELETE と ON UPDATE のラベル](../../guide/guides/relationship-editing.md#reading-a-connector)が非表示になるため、ラベルは既定で表示されます。`Referential Actions` の表示オプションは、このフラグがオフの間チェックが付いた状態になります。このフラグでテーブルのサイズが変わることはありません。  
`3.10.0` より前のエディタは `show` を 1 つの整数のまま保持するため、そのエディタで保存しても両方のフラグは失われません。

`4.0.0` からは `show` のフラグがさらに 2 つ増えました。どちらも、新しいドキュメントと、`4.0.0` より前に保存したすべてのドキュメントではオフです。`hideReferentialAction` と同じく、どちらも名前が示すものを非表示にするため、テーブルグループとメモは既定で表示されます。  
`hideTableGroup`（`2048`）は[テーブルグループ](../../guide/guides/table-groups.md)を、`hideMemo`（`4096`）はすべてのメモを非表示にします。これらは `Table Groups` と `Memos` の[表示オプション](../../guide/guides/table-related-functions.md#table-view-options)で、それぞれ対応するフラグがオフの間チェックが付いた状態になります。どちらのフラグでもテーブルのサイズが変わることはありません。  
`4.0.0` より前のエディタは `show` を 1 つの整数のまま保持するため、そのエディタで保存しても両方のフラグは失われません。

`4.2.0` からは `show` のフラグがさらに 1 つ増えました。`columnDomain`（`8192`）で、新しいドキュメントと、`4.2.0` より前に保存したすべてのドキュメントではオフのため、新しいドキュメントの `show` は引き続き `431` です。これは `Domain` の[表示オプション](../../guide/guides/table-related-functions.md#table-view-options)です。設定すると、各カラムの行に[ドメインのセル](../../guide/guides/logical-names.md#the-domain-cell)が表示され、テーブルの幅が広がります。最初はオフのため、既存のダイアグラムの幅が変わることはありません。  
`4.2.0` より前のエディタは `show` を 1 つの整数のまま保持するため、そのエディタで保存してもこのフラグは失われません。

`4.2.0` からは、`ColumnType` には 9 つの値があります。`columnLogicalName`（`128`）は論理名のセルの位置を決め、このセルはカラムの行が `Both Names` の表示でだけ描画します。`columnDomain`（`256`）はドメインのセルの位置を決めます。これらは設定タブの[カラム順](../../guide/guides/settings.md#adjusting-column-order)の `Logical Name` と `Domain` の行です。エディタは 9 つすべての順序を保持し、新しいドキュメントの順序は `128, 1, 2, 256, 4, 8, 16, 32, 64` です。  
どちらの形式も、`128` が `columnName` の直前に、`256` が `columnDataType` の直後にある間は、`128` と `256` を除いた 7 つのエントリーで順序を書き出します。そのため、新しいドキュメントは引き続き `1, 2, 4, 8, 16, 32, 64` を書き出し、これらを順序の中で動かしたことのないファイルはバイト列が変わりません。それ以外の場合は 9 つすべてを書き出します。  
パースでは、7 つのエントリーの順序には、7 つがどの順に並んでいても、この 2 つをそれらの位置に入れ、すべての種類を持つ 9 つのエントリーはそのまま受け取り、それ以外はすべて既定の順序として読み込みます。JSON Schema は 7 つまたは 9 つの整数を受け付けます。

`4.0.0` からは、`Language` に [Code Generator](../../guide/guides/code-generator.md) の対象が `Mermaid` から `JSONSchema` まで 8 つ増えました。パーサーが知らない `language` は `GraphQL` として読み込まれるため、`4.0.0` より前のエディタでは、これらのいずれかで保存したドキュメントは GraphQL で開き、そのエディタで保存すると GraphQL が書き出されます。

`4.0.0` からは、`ignoreSaveSettings` の代わりに `lockSettings` が、削除された `SaveSettingType` の代わりに `LockSettingType` が使われます。`lockSettings` は、ドキュメントがロックした時点の値で保存する設定を示します。拡大・縮小のレベルなしで保存した原点は別の位置で開くため、`viewport` は `originX`、`originY`、`zoomLevel` をまとめて扱い、ほかの各ビットはその名前のフィールドを扱います。これらは設定タブの [`Lock`](../../guide/guides/settings.md#ロック) の各行です。  
ロックされた設定は、エディタの表示にかかわらず、`value` でも `runtimeValue` でもロックされた値で書き出され、それ以外の設定は現在の値のまま書き出されます。そのため、対応するロックがオンの間は、スクロールや拡大・縮小、タブの切り替え、Code Generator の言語、名前のケース、括弧の種類の変更、名前の表示の切り替えをしても、ファイルは変わりません。ロックすると、その時点で設定が持つ値がロックされた値になり、パースでは保存されたフィールドからロックされた値を取ります。  
何もないところから始めたドキュメント、つまり新しいエディタやレプリケーション用の store、あるいは `value` や `setInitialValue()` に空の値を渡したドキュメントでは、`lockSettings` が `63` になり、すべてのロックがオンです。`settings` に `lockSettings` がないドキュメント、つまり `ignoreSaveSettings` の内容にかかわらず `4.0.0` より前に保存したすべてのファイルと、すべての v2 ドキュメントも、すべてのロックがオンの状態で開きます。表示位置とタブは新しいドキュメントと同じ（`originX` と `originY` は `0`、`zoomLevel` は `1`、ERD タブ）になり、言語、名前のケース、括弧の種類は保存されていた値でロックされます。ロックを指定しているドキュメントは、`0` の場合も含めてそのロックを保ち、保存したすべての値を保ちます。  
パースでは、未知のビットも含めて `lockSettings` のすべてのビットが保たれるため、後のリリースで追加されたロックも、ここで保存して失われることはありません。JSON Schema が確認するのは、整数であることだけです。`4.0.0` より前のエディタは保存するときに `lockSettings` を取り除き、表示位置とタブを現在の状態のまま書き出すため、そのファイルはここでは再び `4.0.0` より前に保存したファイルとして開きます。

`4.2.0` からは 7 つ目のロック `unlockNameViewMode`（`64`）があります。`nameViewMode` を扱う `Name View` の行です。このビットは、`Show` の非表示のビットと同じく、他のロックのビットとは逆の意味を持ちます。設定されていると名前の表示はロックされておらず、設定されていないとロックされています。そのため、`63` は引き続きすべてのロックがオンであることを表し、新しいドキュメントはこの値を持ち、名前の表示は `'physical'` でロックされています。`4.2.0` より前に保存したファイルは、`0` の場合も含め、他のロックにかかわらずこのビットが設定されていないため、名前の表示が `'physical'` でロックされた状態で開きます。すべてのロックがオフのドキュメントは `64` を持ち、他のロックがすべてオンで名前の表示のロックだけがオフのドキュメントは `127` を持ちます。このロックは反転して判定します。`(lockSettings & 64) === 0` の間はオンです。  
このロックがオンの間は、名前の表示の切り替えはそれを行ったエディタの画面だけを変え、ドキュメントはロックした表示を保ちます。オフの間は、編集できるエディタでの切り替えはドキュメントの切り替えになり、すべての共同編集者がそれに合わせて切り替わります。読み取り専用のエディタでの切り替えは、どちらの場合も自分の画面だけを変えます。[`Lock`](../../guide/guides/settings.md#ロック) を参照してください。  
`4.0.0` または `4.1.0` のエディタは、保存してもこのビットを保ちますが、`nameViewMode` を取り除くため、そのドキュメントはここでは、ロックの状態はそのままで `'physical'` で開き直されます。

`4.0.0` からは、`ddlScripts` が [Schema SQL](../../guide/guides/schema-sql.md) タブの 2 つのスクリプトを保持し、すべてのデータベースの DDL がこれらを書き出します。`before` はヘッダーの後、テーブルの前に、`after` は生成された DDL の後に書き出されます。[前後のスクリプト](../../guide/guides/schema-sql.md#前後のスクリプト)で説明しているとおり、DDL はそれぞれを LF の改行で、前の空行と後ろの空白を取り除いて書き出し、MSSQL では `GO` で終えます。`ddlScripts` 自体は、各スクリプトを入力したとおりに保持します。このキーはどちらかのスクリプトにテキストがある間だけ、両方のスクリプトとともに書き出されます。キーがない場合や、スクリプトが文字列でない場合は `''` として読み込まれます。タブの `Statements`、`Header`、`Tables` の選択と、`4.2.0` からは [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) のスイッチは、ドキュメントに保存されません。  
`4.0.0` より前のエディタはドキュメントを読み込むときにスクリプトを取り除くため、そのエディタで保存するとスクリプトは失われます。

`4.2.0` からは、`nameViewMode` は[名前の表示](../../guide/guides/logical-names.md#name-view)、つまりダイアグラムが描く名前です。`'physical'` は各テーブルとカラムの名前を、`'logical'` は名前の位置に論理名を、`'both'` は論理名と名前を描きます。メニューではそれぞれ `Physical Names`、`Logical Names`、`Both Names` と呼びます。どちらの形式も、`ddlScripts` の後の最後に、書き出す値が `'physical'` でない間だけ書き出します。`Name View` のロックがオンの間は、画面の表示にかかわらず、書き出す値はロックした値です。値がない場合や、パーサーが知らない値の場合は `'physical'` として読み込まれ、JSON Schema は `"logical"` と `"both"` だけを受け付けます。  
`4.2.0` より前のエディタは、ドキュメントを読み込むときに `nameViewMode` を取り除きます。

`Database`、`Language`、`Show`、`ColumnType`、`ColumnOption`、`LockSettingType`、`ReferentialAction` は追加専用です。保存したドキュメントには数値が格納されるため、新しいベンダー、コード生成のターゲット、フラグ、カラムの種類、カラムのオプション、ロック、アクションは中間の位置ではなく次のビットを使用します。

### Doc

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
  wordIds?: string[]; // runtime only
  termIds?: string[]; // runtime only
  domainIds?: string[]; // runtime only
};
```

最初の 5 つの各リストは 1 種類のエンティティの順序で、DDL、テーブルの並べ替え、描画の順序がこれを読み取ります。保存形式では、各リストは残るエンティティの id だけを、それぞれ 1 回ずつ、並んでいる順に保持し、`4.2.0` からは、何も持たないリストは含まれません。`4.0.0` からは、`tableGroupIds` がテーブルグループの順序です。

`4.2.0` からは、`wordIds`、`termIds`、`domainIds` が各辞書の現存する行を列挙します。コレクションが保持していてもリストにない行は、削除された行です。これらはシートの順序ではなく、シートの順序は各行の `order` が決めます。これらを書き出すのはランタイム値だけで、それぞれリストかそのコレクションがエントリーを持つ間書き出します。ファイルでは行そのものがメンバーと順序を表し、JSON Schema はこれらのリストを受け付けません。  
`4.2.0` からは、パースでは、ドキュメントに含まれないリストや、配列以外の値として保持されているリストを、そのコレクションが保持するすべてのエントリーとして、各 id を 1 回ずつ、保持されている順に読み込みます。空の配列は空のままで、その場合はコレクションのすべてのエントリーが削除されたものとして読み込まれます。`4.2.0` より前のエディタはないリストを空として読み込むため、保存形式は引き続き、コレクションがエンティティを持つ間は各リストを書き出します。

`4.0.0` からは、重なり順は保存されません。パースでは、`zIndex` を持たない、リストに並ぶ各テーブル、メモ、テーブルグループを、リスト内の位置に従って、後のものほど前面になるように重ねます。テーブルグループは `1` から、テーブルは `2` から始まり、メモはすべてのテーブルの上に重なります。ランタイム値や `4.0.0` より前に保存したファイルのように `zIndex` を持つエンティティは、その値を保ちます。そのため、テーブルやメモを最前面に移したことは、ファイルを開き直すと失われます。

### Collection: tableEntities

```ts
type Table = {
  id: string;
  name: string;
  logicalName?: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  nameDerived?: boolean;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthLogicalName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

`4.0.0` からは、テーブルは、属する[テーブルグループ](../../guide/guides/table-groups.md)の id である `groupId` を持ちます。`groupId` がないか空の場合や、`doc.tableGroupIds` にないグループを指している場合はグループに属していないことを表し、保存形式は、残るグループを指している間だけ `groupId` を書き出します。  
パースでは、`seqColumnIds` がないか、`columnIds` に並ぶ id が欠けている場合は、`seqColumnIds` を `columnIds` から始めます。また、エディタは読み込むたびに、自身のフォントで `widthName`、`widthLogicalName`、`widthComment` を計測し直します。

`4.2.0` からは、テーブルは `logicalName` と `nameDerived` を持ちます。`logicalName` は `Logical Names` と `Both Names` の[表示](../../guide/guides/logical-names.md#name-view)が描く名前で、ない場合は `''` です。`nameDerived` は、辞書が論理名から `name` を[生成した](../../guide/guides/dictionary.md#deriving-physical-names)間は `true` です。設定されている間は、新しい論理名によって名前が再び生成されます。設定されていない間は、名前は誰かが自分で付けた名前で、名前が空か空白だけでない限り、新しい論理名はその名前を変えません。手で名前を変更するとオフになり、[`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) は誰かが書いた名前でも書き換え、論理名があるところではどこでもこれをオンにします。  
保存形式は、`logicalName` を `name` の後に、入力したとおりに、空白以外のテキストを持つ間だけ書き出し、`nameDerived` を `groupId` の後に、`true` の間だけ書き出します。`true` は JSON Schema が受け付ける唯一の値です。`logicalName` がない場合は `''`、`nameDerived` がない場合は `false` として読み込まれるため、`4.2.0` より前に保存したファイルの名前はすべて、自分で付けた名前として扱われます。  
`4.2.0` より前のエディタは、ドキュメントを読み込むときに両方を取り除くため、そのエディタで保存するとすべてのテーブルの論理名が失われます。

### Collection: tableColumnEntities

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  logicalName?: string;
  domainId?: string;
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthLogicalName: number;
  widthComment: number;
  widthDataType: number;
  widthDomain: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

`4.0.0` からは、保存形式はカラムの `ui` を書き出しません。読み込むたびに、主キーのマークを `options` の `primaryKey` ビットから、外部キーのマークをそのカラムで終わるリレーションシップから求めて `keys` を導き出し、6 つの幅を計測します。  
`4.0.0` より前のエディタでは、ここで保存したファイルのカラムは主キーのアイコンなしで表示されます。

`4.2.0` からは、カラムはテーブルと同じく `logicalName` を持ち、さらに紐付けているドメインの id である `domainId` を持ちます。ない場合は `''` です。[ドメインとデータ型](../../guide/guides/dictionary.md#domains-and-data-types)で説明しているとおり、1 つのエディタでの編集では、紐付いたカラムはそのドメインのデータ型に保たれます。ただし、パースはどのカラムのデータ型も変更しないため、他の場所で書き出したファイルでは、紐付いたカラムが別のデータ型のままになることがあり、2 人の共同編集者の編集が行き違った場合も同様です。`Checks` シートはそれぞれを [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds) として表示します。パースでは、ドキュメントが保持するどのドメインも指していない `domainId` は消去されます。削除したドメインも保持しているドメインに数えられるため、Undo でドメインを戻せる間、エディタはそのドメインへの紐付けを保ちます。保存形式は `options` の後に、`logicalName` をテーブルと同じ規則で書き出し、`domainId` をファイルに書き出すドメインを指している間だけ書き出すため、削除したドメインへの紐付けを書き出すことはありません。  
`ColumnOption.nameDerived`（`16`）は、カラムの名前が生成されたものかどうかを表すフラグで、他のビットとともに `options` に保持され、テーブルの `nameDerived` と同じ意味を持ちます。例えば、辞書が名前を生成した NOT NULL の主キーは、`options` に `26` を持ちます。  
`4.2.0` より前のエディタは、ドキュメントを読み込むときに `logicalName` と `domainId` を取り除くため、そのエディタで保存するとこれらは失われます。`options` は 1 つの整数のまま保持するため、そのエディタで保存しても `nameDerived` のビットは失われません。

### Collection: relationshipEntities

```ts
type Relationship = {
  id: string;
  identification: boolean; // runtime only
  relationshipType: number; // Constants: RelationshipType
  startRelationshipType: number; // Constants: StartRelationshipType; runtime only
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
  x: number; // runtime only
  y: number; // runtime only
  direction: number; // Constants: Direction; runtime only
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const StartRelationshipType = {
  ring: 1,
  dash: 2,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;

const Direction = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
} as const;
```

`3.10.0` からは、リレーションシップは [ON DELETE と ON UPDATE のアクション](../../guide/guides/relationship-editing.md#on-delete-and-on-update)である `onDelete` と `onUpdate` を持ちます。それぞれ `ReferentialAction` の値を 1 つだけ保持します。既定値の `none` は句を書き出さないため、データベース自体の既定の動作が適用されます。残りの 5 つは `NO ACTION`、`CASCADE`、`SET NULL`、`SET DEFAULT`、`RESTRICT` を表します。Schema SQL は、そのアクションを受け付けるデータベースの場合にだけ句を書き出します。  
保存形式は常に両方を書き出し、`4.0.0` からは JSON Schema も両方を必須とします。JSON Schema が確認するのは、それぞれが整数であることだけです。パースでは引き続き、`3.10.0` より前に保存したすべてのドキュメントのようにフィールドがない場合は `none` として読み込まれ、一覧にない値も同様です。  
`3.10.0` より前のエディタはこれらのフィールドを認識せず、ドキュメントを読み込むときに取り除くため、そのエディタで保存するとすべてのアクションが失われます。

`4.0.0` からは、保存形式が含まないものは読み込むたびに導き出されます。リレーションシップは、終点のカラムがすべて主キーであれば識別リレーションシップになり、`startRelationshipType` は、それらのカラムがすべて NOT NULL であれば `dash`、そうでなければ `ring` になります。終点のカラムが 1 つも残っていないリレーションシップは、新しいリレーションシップの開始時と同じく、非識別リレーションシップで `dash` になります。接続位置、つまり `x`、`y`、`direction` は配置し直されます。

### Collection: indexEntities

```ts
type Index = {
  id: string;
  name: string;
  tableId: string;
  indexColumnIds: string[];
  seqIndexColumnIds: string[]; // runtime only
  unique: boolean;
};
```

パースでは、`seqIndexColumnIds` がないか、`indexColumnIds` に並ぶ id が欠けている場合は、`seqIndexColumnIds` を `indexColumnIds` から始めます。

### Collection: indexColumnEntities

```ts
type IndexColumn = {
  id: string;
  indexId: string;
  columnId: string;
  orderType: number; // Constants: OrderType
};

// Constants
const OrderType = {
  ASC: 1,
  DESC: 2,
} as const;
```

### Collection: memoEntities

```ts
type Memo = {
  id: string;
  value: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
  color: string;
};
```

`4.0.0` からは、テーブルとメモは `zIndex` で順序付けられる [1 つの重なり順を共有する](../../guide/guides/table-related-functions.md#複数テーブルの移動)ため、テーブルを前面に移すとメモの上に重なることがあります。[Doc](#doc) で説明しているとおり、パースでは、`zIndex` なしで保存したメモをすべてのテーブルの上に重ねます。`4.0.0` より前に保存したファイルのメモは、保存した `zIndex` を保ちます。この値はテーブルと同じカウンタから振られていたため、以前のリリースですべてのテーブルの上に描かれていたメモが、その後に前面に移したテーブルの下で開くことがあります。

### Collection: tableGroupEntities

```ts
type TableGroup = {
  id: string;
  name: string;
  color: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
};
```

`4.0.0` からは、ドキュメントは[テーブルグループ](../../guide/guides/table-groups.md)、つまりテーブルの背後に描かれる、名前と色の付いた枠を保持できます。テーブルは自身の `groupId` によってグループに加わるため、グループはメンバーのリストを持ちません。保存形式は、`doc.tableGroupIds` と同じく、グループが存在する間だけこのコレクションを書き出します。`4.0.0` より前に保存したドキュメントのように、このコレクションがないドキュメントにはグループはありません。`Show.hideTableGroup` はグループを非表示にします。  
`4.0.0` より前のエディタは、ドキュメントを読み込むときにグループとすべてのテーブルの `groupId` を取り除くため、そのエディタで保存するとすべてのグループが失われます。

### 辞書の行 {#dictionary-rows}

`4.2.0` からは、ドキュメントは 3 つの辞書、つまり[辞書](../../guide/guides/dictionary.md)タブの `Words`、`Terms`、`Domains` のシートを、`wordEntities`、`termEntities`、`domainEntities` に保持します。単語、用語、ドメインのフィールドはすべて文字列で、どれも `ui` を持ちません。`Checks` シートは辞書とダイアグラムから求められ、保存されません。

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

3 つとも id をキーとしません。それぞれヘッダーと行の形で書き出されます。`fields` はエンティティのフィールドを id から順に 1 回ずつ示し、各行は 1 つのエンティティの値をその順に保持します。以下の型は、各エンティティのフィールドをランタイム値のヘッダーの順に並べています。行は常に id と名前を保ちますが、名前より後ろの末尾にある空の値は含まれません。そのため、残される値より前にある空の値は `''` のままで、パースでは行にない値は `''` として読み込まれます。どちらの形式も、ファイルから取った次の 2 つの単語のように、各行をそれぞれ 1 行に、空白を入れない JSON として書き出します。

```json
"wordEntities": {
  "fields": [
    "id",
    "name",
    "abbreviation",
    "englishName",
    "description",
    "synonyms",
    "forbiddenWords"
  ],
  "rows": [
    ["w1","Customer","CUST","customer"],
    ["w2","Number","NO","number","","No, Num","Nbr"]
  ]
}
```

保存形式は、リストに並ぶ行をシートの順に書き出し、`order` は含めないため、ヘッダーにも `order` はありません。id 以外の値がすべて空か空白だけの行、例えば追加したまま何も入力していない行や空にした行は含まれず、そのようなドメインや削除したドメインへの紐付けもすべて含まれません。カラムの `domainId` は含まれず、用語の `domainId` は `''` として書き出され、用語自体も他に何も持たなければ含まれません。  
ランタイム値のヘッダーでは、`"name"` の直後に `"order"` があります。ランタイム値は、削除した行も含め、コレクションが保持するすべての行を、コレクションが保持している順に書き出します。そのため、シートの順序を得るには、`order` をコード単位の順で比較して並べ替えます。パースでは、ファイルの行に、行が並んでいる順に `order` のキーを与えるため、行はファイルが書き出した順に読み込まれます。  
`4.2.0` より前に保存したドキュメントのように、これらの辞書がないドキュメントには、単語も用語もドメインもありません。`4.2.0` より前のエディタは、ドキュメントを読み込むときに 3 つすべてを取り除くため、そのエディタで保存するとすべての単語、用語、ドメインが失われます。

### Collection: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  order: string; // runtime only
  abbreviation: string;
  englishName: string;
  description: string;
  synonyms: string;
  forbiddenWords: string;
};
```

単語は論理名を構成する単語の 1 つで、`abbreviation` は物理名の中でその単語を表すものです。`synonyms` はその単語の別の表記を、`forbiddenWords` はその単語の代わりに使ってはならない語を、それぞれカンマ区切りで列挙します。

### Collection: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  order: string; // runtime only
  physicalName: string;
  domainId: string;
  description: string;
  synonyms: string;
};
```

用語は論理名の全体です。`logicalName` が `name` と一致するテーブルやカラムは、`physicalName` を、それが空の間は単語の英略語から組み立てた名前を物理名として生成し、カラムはさらに `domainId` が指すドメインも受け取ります。`domainId` は、ない場合は `''` です（[物理名の生成](../../guide/guides/dictionary.md#deriving-physical-names)を参照）。`synonyms` はカンマ区切りです。パースでは、カラムの場合と同じく、どのドメインも指していない `domainId` は消去されます。

### Collection: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  order: string; // runtime only
  category: string;
  dataType: string;
  description: string;
};
```

ドメインは名前の付いたデータ型で、`dataType` は `NUMERIC(10)` のように、カラムと同じく長さも含めてデータ型を保持します。カラムや用語はドメインを id で紐付け、エディタは紐付いたすべてのカラムにドメインのデータ型を与えます（[ドメインとデータ型](../../guide/guides/dictionary.md#domains-and-data-types)を参照）。

## JSON Schema

正式なスキーマファイルは [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) で公開しており、`$schema` から直接参照できます。

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

`.erd.json` ファイルの先頭に `$schema` を記述すると、VS Code など JSON Schema に対応したエディタがドキュメントを検証し、編集中にフィールドを自動補完します。

`4.0.0` からは、スキーマは保存形式だけを表します。名前付きのフィールドを持つオブジェクトはすべて閉じられ（`additionalProperties: false`）、保存形式が常に書き出すフィールドはすべて必須で、保存形式が何も持たない間だけ含めないフィールドは定義されていますが必須ではなく、保存形式が常に含めないフィールドはどれも定義されていません。そのため、ランタイム値は受け付けません。`4.0.0` より前に保存したファイルも、`meta`、幅、`zIndex`、`ignoreSaveSettings` などを持つため、`4.0.0` 以降のエディタで保存し直すまで受け付けません。`3.2.0` 以降で保存したファイルはすでにこのスキーマの URL を指定しており、その URL は `main` ブランチを指しているため、このスキーマで検証するエディタでは、そのファイルに問題が報告されるようになりました。`3.0.0` や `3.1.0` で保存したファイルと v2 のドキュメントは `$schema` を指定していません。

`4.2.0` からは、スキーマはエンティティのテキストフィールド、`doc` のリスト、コレクション、`collections` 自体を必須としなくなりました。保存形式は、これらが何も持たない間は含めません。`4.0.0` や `4.1.0` で保存したファイルも引き続き受け付けます。新しいフィールドも定義しています。`"logical"` と `"both"` だけを受け付ける `nameViewMode`、テーブルの `logicalName` と、`true` だけを受け付ける `nameDerived`、カラムの `logicalName` と `domainId`、そしてそれぞれヘッダーと文字列の行を持つ 3 つの辞書です。`canvasType` には辞書タブが加わり、`columnOrder` は 7 つまたは 9 つの整数を受け付け、`show`、`columnOrder`、`lockSettings`、`options` の説明には新しいビットが記されています。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order but the dictionaries, a header and one row per entry in document order, without what an editor derives on load or keeps while it is open, without an entity's text field while it is empty, which reads as the empty string, and without an empty list or collection, which reads as none",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "version": {
      "description": "Version of the schema",
      "const": "3.0.0"
    },
    "settings": {
      "$ref": "#/$defs/settings"
    },
    "doc": {
      "$ref": "#/$defs/doc"
    },
    "collections": {
      "description": "The entities of each kind, a kind with none left out",
      "type": "object",
      "properties": {
        "tableEntities": {
          "$ref": "#/$defs/tableEntities"
        },
        "tableColumnEntities": {
          "$ref": "#/$defs/tableColumnEntities"
        },
        "relationshipEntities": {
          "$ref": "#/$defs/relationshipEntities"
        },
        "indexEntities": {
          "$ref": "#/$defs/indexEntities"
        },
        "indexColumnEntities": {
          "$ref": "#/$defs/indexColumnEntities"
        },
        "memoEntities": {
          "$ref": "#/$defs/memoEntities"
        },
        "tableGroupEntities": {
          "$ref": "#/$defs/tableGroupEntities"
        },
        "wordEntities": {
          "$ref": "#/$defs/wordEntities"
        },
        "termEntities": {
          "$ref": "#/$defs/termEntities"
        },
        "domainEntities": {
          "$ref": "#/$defs/domainEntities"
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc"],
  "additionalProperties": false,
  "$defs": {
    "settings": {
      "type": "object",
      "properties": {
        "originX": {
          "type": "number"
        },
        "originY": {
          "type": "number"
        },
        "zoomLevel": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 1.5
        },
        "show": {
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096) | (columnDomain: 8192); the three hide bits hide what they name while set",
          "type": "integer"
        },
        "database": {
          "description": "bit value (MariaDB: 1) | (MSSQL: 2) | (MySQL: 4) | (Oracle: 8) | (PostgreSQL: 16) | (SQLite: 32) | (Databricks: 64) | (Snowflake: 128)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128]
        },
        "databaseName": {
          "type": "string"
        },
        "canvasType": {
          "enum": [
            "ERD",
            "@dineug/erd-editor/builtin-visualization",
            "@dineug/erd-editor/builtin-schema-sql",
            "@dineug/erd-editor/builtin-generator-code",
            "settings",
            "@dineug/erd-editor/builtin-dictionary"
          ]
        },
        "language": {
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64) | (Go: 128) | (SQLAlchemy: 256) | (TypeORM: 512) | (Sequelize: 1024) | (Drizzle: 2048) | (DBML: 4096) | (AML: 8192) | (Mermaid: 16384) | (PHP: 32768) | (Doctrine: 65536) | (Rust: 131072) | (SeaORM: 262144) | (Swift: 524288) | (Zod: 1048576) | (JSONSchema: 2097152)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152]
        },
        "tableNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "columnNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "bracketType": {
          "description": "bit value (none: 1) | (doubleQuote: 2) | (singleQuote: 4) | (backtick: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "relationshipDataTypeSync": {
          "type": "boolean"
        },
        "columnOrder": {
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64) | (columnLogicalName: 128) | (columnDomain: 256); seven entries without the last two while the logical name stands just before the name and the domain just after the data type, all nine otherwise",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "anyOf": [
            { "minItems": 7, "maxItems": 7 },
            { "minItems": 9, "maxItems": 9 }
          ]
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32) | (unlockNameViewMode: 64); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel. The last bit reads the other way round: set, the name view mode is unlocked, and clear, as in a file saved before it, locked",
          "type": "integer"
        },
        "ddlScripts": {
          "description": "SQL the Schema SQL writes as is for every database: before after the header and ahead of the tables, after past the generated DDL. Absent while both are empty",
          "type": "object",
          "properties": {
            "before": { "type": "string" },
            "after": { "type": "string" }
          },
          "required": ["before", "after"],
          "additionalProperties": false
        },
        "nameViewMode": {
          "description": "The names the diagram shows: the logical ones, or both the physical and the logical. Absent while it shows the physical names, the default",
          "enum": ["logical", "both"]
        }
      },
      "required": [
        "originX",
        "originY",
        "zoomLevel",
        "show",
        "database",
        "databaseName",
        "canvasType",
        "language",
        "tableNameCase",
        "columnNameCase",
        "bracketType",
        "relationshipDataTypeSync",
        "columnOrder",
        "maxWidthComment",
        "lockSettings"
      ],
      "additionalProperties": false
    },
    "doc": {
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read, a kind with none left out. A list goes out whenever its collection holds an entity, since a reader that finds none lists none",
      "type": "object",
      "properties": {
        "tableIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "relationshipIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "indexIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "memoIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "tableGroupIds": {
          "description": "Order of the table groups. Written while a group exists; absent means none",
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "tableEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "columnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the table belongs to; absent means none",
            "type": "string"
          },
          "nameDerived": {
            "description": "The dictionaries filled the name, so a new logical name derives it again; absent means a name someone wrote",
            "type": "boolean",
            "const": true
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y"],
            "additionalProperties": false
          }
        },
        "required": ["id", "columnIds", "ui"],
        "additionalProperties": false
      }
    },
    "tableColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "dataType": {
            "type": "string"
          },
          "default": {
            "type": "string"
          },
          "options": {
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8) | (nameDerived: 16); nameDerived is set while the dictionaries filled the name",
            "type": "integer"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "domainId": {
            "description": "Id of the domain in domainEntities that governs the data type; absent means none",
            "type": "string"
          }
        },
        "required": ["id", "tableId", "options"],
        "additionalProperties": false
      }
    },
    "relationshipEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "relationshipType": {
            "description": "bit value (ZeroOne: 2) | (ZeroN: 4) | (OneOnly: 8) | (OneN: 16)",
            "type": "integer"
          },
          "onDelete": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON DELETE clause",
            "type": "integer"
          },
          "onUpdate": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON UPDATE clause",
            "type": "integer"
          },
          "start": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "end": {
            "$ref": "#/$defs/RelationshipPoint"
          }
        },
        "required": [
          "id",
          "relationshipType",
          "onDelete",
          "onUpdate",
          "start",
          "end"
        ],
        "additionalProperties": false
      }
    },
    "indexEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "indexColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "unique": {
            "type": "boolean"
          }
        },
        "required": ["id", "tableId", "indexColumnIds", "unique"],
        "additionalProperties": false
      }
    },
    "indexColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "indexId": {
            "type": "string"
          },
          "columnId": {
            "type": "string"
          },
          "orderType": {
            "description": "bit value (ASC: 1) | (DESC: 2)",
            "type": "integer"
          }
        },
        "required": ["id", "indexId", "columnId", "orderType"],
        "additionalProperties": false
      }
    },
    "memoEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "value": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "tableGroupEntities": {
      "description": "Named, coloured rectangles drawn behind tables; a table joins one through its groupId. Written while a group exists; absent means none",
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "wordEntities": {
      "description": "The words of the dictionary, the parts a logical name is composed of, each with its abbreviation in a physical name. Written while a word exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "abbreviation", "englishName", "description", "synonyms", "forbiddenWords"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "termEntities": {
      "description": "The terms of the dictionary, logical names a column matches by its text, each with its physical name and domain id. Written while a term exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "physicalName", "domainId", "description", "synonyms"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "domainEntities": {
      "description": "The domains of the dictionary, named data types a column or a term links to by id. Written while a domain exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "category", "dataType", "description"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "RelationshipPoint": {
      "type": "object",
      "properties": {
        "tableId": {
          "type": "string"
        },
        "columnIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["tableId", "columnIds"],
      "additionalProperties": false
    }
  }
}
```
