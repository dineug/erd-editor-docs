---
sidebar_position: 3
description: Format dokumen .erd.json — bentuk penyimpanan yang tersimpan di file dan nilai runtime yang dipegang editor, tipe TypeScript, konstanta di balik setiap field numerik, dan JSON Schema yang dipublikasikan.
---

# Skema

`.erd.json` adalah format dokumen editor. Baca halaman ini jika Anda perlu membuat, memvalidasi, atau memigrasikan dokumen di luar editor.

Sejak `4.0.0`, dokumen memiliki dua bentuk serialisasi, keduanya dengan `version` `'3.0.0'`. Bentuk penyimpanan adalah isi sebuah file: bentuk inilah yang dikembalikan [`editor.value`](../erd-editor-element.md#value), yang ditulis ekspor JSON, dan satu-satunya bentuk yang diterima [JSON Schema](#json-schema) yang dipublikasikan. Nilai runtime adalah seluruh dokumen sebagaimana dipegang editor, yang dikembalikan [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, setter `value`, dan `setSchemaJSON()` membaca kedua bentuk, file apa pun yang disimpan rilis sebelumnya, dan dokumen v2 `.vuerd`. Sebelum `4.0.0`, hanya ada satu: `value` mengembalikan seluruh dokumen sebagaimana dipegang editor, seperti yang kini dilakukan `runtimeValue`.

## Bentuk penyimpanan dan nilai runtime {#storage-form-and-runtime-value}

Bentuk penyimpanan hanya memuat entitas yang masih ada: setiap tabel yang tercantum di `doc.tableIds`, kolom yang dicantumkan tabel-tabel tersebut, hubungan antara dua tabel yang dipertahankan, indeks dari tabel yang dipertahankan beserta kolom indeks yang kolomnya masih dicantumkan tabelnya, serta memo dan grup tabel yang tercantum. Bentuk ini menghilangkan apa yang dihitung editor saat memuat atau dipegangnya selama terbuka: entitas yang dihapus, `seqColumnIds` dan `seqIndexColumnIds`, setiap `zIndex`, lebar hasil pengukuran, `ui` kolom, serta `identification`, `startRelationshipType`, dan jangkar sebuah hubungan. Tipe di bawah menandai setiap field ini dengan `// runtime only`.  
Setiap koleksi memakai id sebagai kunci, diurutkan menurut unit kode, dengan kolom dikelompokkan lebih dulu menurut `tableId` dan kolom indeks menurut `indexId`. Setiap entitas menulis field-nya dalam urutan tetap, dan teksnya diindentasi dua spasi serta diakhiri baris baru. Jadi, dokumen yang sama selalu ditulis menjadi byte yang sama, sebuah perubahan hanya mengubah apa yang disentuhnya, dan file yang disimpan di mesin dengan font lain dibuka kembali dengan `value` yang sama.  
VS Code, Obsidian, dan plugin JetBrains menulis file hanya saat sebuah perubahan mengubah `value`, sehingga file yang disimpan rilis sebelumnya mempertahankan bentuk lamanya hingga pertama kali diedit.

Nilai runtime mempertahankan apa yang dihilangkan bentuk penyimpanan: entitas yang dihapus, sequence, z-index, lebar, tanda kunci, flag hubungan, dan jangkar. Nilai ini diindentasi dua spasi tanpa baris baru di akhir. Gunakan nilai ini hanya untuk mengisi data awal kolaborator atau tampilan kedua melalui `setInitialValue()`, agar pembatalan penghapusan yang dikirim editor lain mengembalikan entitas itu secara utuh di sana. Jangan pernah menulisnya ke file; JSON Schema menolaknya. Tidak ada lagi yang membersihkan entitas yang dihapus, sehingga nilai runtime menyimpannya hingga dokumen dibuka lagi dari filenya.

Kedua bentuk menulis setiap pengaturan yang terkunci pada nilai terkuncinya (lihat [`lockSettings`](#settings)), `settings.ddlScripts` hanya selama sebuah skrip berisi teks, dan `groupId` sebuah tabel hanya selama tidak kosong. Bentuk penyimpanan menulis `doc.tableGroupIds` dan `tableGroupEntities` hanya selama ada grup tabel; nilai runtime menulisnya selama dokumen memuat sebuah grup atau grup yang dihapus.

## TypeScript {#typescript}

Tipe berikut menggambarkan nilai runtime. Field yang ditandai `// runtime only` dihilangkan dari bentuk penyimpanan, dan field yang ditandai `?` hanya ditulis selama berisi sesuatu.

### ERDEditorSchemaV3 {#erdeditorschemav3}

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
  };
};
```

Setiap entitas memakai `id`-nya, sebuah string opak, sebagai kunci; penguraian membuang entitas yang `id`-nya tidak ada atau kosong. Sejak `4.0.0`, setiap id baru adalah UUIDv7 yang ditulis dalam bentuk Uuid25, 25 digit basis 36 berhuruf kecil seperti `03gzrxjv20bdlcak89q25d2m7`, sehingga id yang dibuat satu editor terurut sesuai urutan pembuatannya. Dokumen mempertahankan id yang dimilikinya, seperti id nanoid dari rilis sebelumnya atau id file v2, sehingga tidak ada yang boleh bergantung pada bentuk sebuah id.

Sejak `4.0.0`, tidak ada entitas yang membawa objek `meta` (`createAt`, `updateAt`), dan tipe `EntityMeta` serta `EntityType` telah dihapus. Tidak ada yang menulisnya, penguraian membuang `meta` yang dibawa file lama, dan JSON Schema menolaknya. Objek itu hanya mengatur waktu garbage collection entitas yang dihapus, yang kini juga telah ditiadakan.

### Settings {#settings}

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
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
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
} as const;
```

`originX` dan `originY` adalah area pandang: titik layar tempat titik `(0, 0)` pada bidang diagram berada.  
`zoomLevel` berkisar dari `0.1` hingga `1.5`. Dokumen yang disimpan dengan nilai di atas `1` dibuka pada `1` di editor sebelum `3.5.0`.  
Sejak `4.0.0`, pengaturan tidak membawa `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, atau `ignoreSaveSettings`. Tidak ada yang menulisnya, parser tidak mempertahankan satu pun darinya, dan JSON Schema menolak file yang masih memilikinya.

`canvasType` adalah tab tempat dokumen dibuka. Dokumen yang disimpan di tab Visualisasi berisi `'@dineug/erd-editor/builtin-visualization'`, tetapi tidak mencatat apakah mode `Graph` atau `Flow` yang sedang ditampilkan, dan editor yang baru dibuat menampilkan tab tersebut dalam mode `Graph`.  
Sejak `4.0.0`, selama penguncian `Canvas Type` aktif, seperti pada dokumen baru, dokumen mempertahankan tab yang ditampilkan saat dikunci, dan berpindah tab membiarkan `value` seperti semula. Penguncian yang dilakukan di tab Pengaturan menyimpan tab yang sebelumnya dibuka pembaca, dan `'settings'` yang terkunci, yang hanya dapat ditulis lewat pengeditan manual, dibuka pada `'ERD'`.  
Tidak ada keadaan milik mode `Flow` sendiri yang diserialisasi — penempatan, zoom, pergeseran, tampilan baris, dan tabel yang difokuskan tetap berada di editor — sehingga `originX`, `originY`, dan `zoomLevel` selalu menggambarkan kanvas ERD.

`show` dan `lockSettings` adalah bitmask — gabungkan flag-nya dengan OR.  
`columnOrder` adalah array yang memuat ketujuh nilai `ColumnType`, dalam urutan tampilan.  
`database`, `language`, `tableNameCase`, `columnNameCase`, dan `bracketType` masing-masing memuat tepat satu nilai, dan JSON Schema menolak nilai gabungan.

`show` pada dokumen baru adalah `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull`, dan `relationship`.  
Sejak `3.10.0`, ada dua flag `show` tambahan, keduanya nonaktif pada dokumen baru dan pada setiap dokumen yang disimpan sebelum `3.10.0`.  
`columnAlternateKey` (`512`) adalah opsi tampilan [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Saat diaktifkan, flag ini menandai kolom dari setiap indeks unik atas dua kolom atau lebih sebagai `AK1.1`, `AK1.2`, dan seterusnya. Flag ini awalnya nonaktif, sehingga lebar diagram yang sudah ada tidak berubah.  
`hideReferentialAction` (`1024`) bekerja sebaliknya: saat diaktifkan, flag ini menyembunyikan [label ON DELETE dan ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) pada konektor, sehingga label tersebut ditampilkan secara default. Opsi tampilan `Referential Actions` dicentang selama flag ini nonaktif. Flag ini tidak mengubah ukuran tabel mana pun.  
Editor sebelum `3.10.0` mempertahankan `show` sebagai satu bilangan bulat, sehingga kedua flag tetap ada saat disimpan di sana.

Sejak `4.0.0`, ada dua flag `show` tambahan, keduanya nonaktif pada dokumen baru dan pada setiap dokumen yang disimpan sebelum `4.0.0`. Seperti `hideReferentialAction`, masing-masing menyembunyikan apa yang dinamainya, sehingga grup tabel dan memo ditampilkan secara default.  
`hideTableGroup` (`2048`) menyembunyikan [grup tabel](../../guide/guides/table-groups.md), dan `hideMemo` (`4096`) menyembunyikan setiap memo. Keduanya adalah [opsi tampilan](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` dan `Memos`, masing-masing dicentang selama flag-nya nonaktif. Tidak satu pun dari keduanya mengubah ukuran tabel mana pun.  
Editor sebelum `4.0.0` mempertahankan `show` sebagai satu bilangan bulat, sehingga kedua flag tetap ada saat disimpan di sana.

Sejak `4.0.0`, `Language` memiliki delapan target [Generator Kode](../../guide/guides/code-generator.md) tambahan, dari `Mermaid` hingga `JSONSchema`. `language` yang tidak dikenal parser dibaca sebagai `GraphQL`, sehingga editor sebelum `4.0.0` membuka dokumen yang disimpan dengan salah satunya pada GraphQL, dan menyimpan di sana menulis GraphQL.

Sejak `4.0.0`, `lockSettings` menggantikan `ignoreSaveSettings`, dan `LockSettingType` menggantikan `SaveSettingType`, yang telah dihapus. `lockSettings` menyebutkan pengaturan yang disimpan dokumen sebagaimana keadaannya saat dikunci. `viewport` mencakup `originX`, `originY`, dan `zoomLevel` sekaligus, karena titik asal yang disimpan tanpa zoomnya terbuka di tempat lain, dan setiap bit lainnya mencakup field yang menjadi asal namanya. Inilah baris [`Lock`](../../guide/guides/settings.md#lock) di tab Pengaturan.  
Pengaturan yang terkunci ditulis pada nilai terkuncinya, apa pun yang ditampilkan editor, baik oleh `value` maupun `runtimeValue`, dan setiap pengaturan lainnya sebagaimana adanya. Jadi, selama penguncian yang sesuai aktif, menggulir dan melakukan zoom, berpindah tab, atau mengubah bahasa Generator Kode, sebuah konvensi penamaan, atau tipe tanda kutip membiarkan file seperti semula. Mengunci mengambil nilai yang dimiliki pengaturan pada saat itu, dan penguraian mengambil nilai terkunci dari field yang disimpan.  
Dokumen yang dimulai dari nol — editor atau store replikasi baru, atau nilai kosong yang diberikan ke `value` atau `setInitialValue()` — memiliki `lockSettings` bernilai `63`, dengan semua penguncian aktif. Dokumen yang `settings`-nya tidak membawa `lockSettings` — setiap file yang disimpan sebelum `4.0.0`, apa pun `ignoreSaveSettings`-nya, dan setiap dokumen v2 — juga dibuka dengan semua penguncian aktif: area pandang dan tabnya sama dengan milik dokumen baru (`originX` dan `originY` `0`, `zoomLevel` `1`, tab ERD), dan bahasa, konvensi penamaan, serta tipe tanda kutipnya dikunci pada nilai yang disimpannya. Dokumen yang menyebutkan penguncian miliknya mempertahankannya, termasuk `0`, beserta setiap nilai yang disimpannya.  
Penguraian mempertahankan setiap bit `lockSettings`, termasuk yang tidak dikenal, sehingga penguncian yang ditambahkan rilis yang lebih baru tetap ada saat disimpan di sini; JSON Schema hanya memeriksa bahwa nilainya bilangan bulat. Editor sebelum `4.0.0` membuang `lockSettings` saat menyimpan dan menulis area pandang serta tab sebagaimana adanya, sehingga file tersebut dibuka lagi di sini sebagai file yang disimpan sebelum `4.0.0`.

Sejak `4.0.0`, `ddlScripts` memuat dua skrip tab [Skema SQL](../../guide/guides/schema-sql.md), yang ditulis DDL setiap database: `before` setelah pembuka dan sebelum tabel, `after` setelah DDL yang dihasilkan. DDL menulis masing-masing dengan jeda baris LF, tanpa baris kosong di awal dan spasi kosong di akhir, dan pada MSSQL diakhiri dengan `GO`, seperti yang dijelaskan [Skrip sebelum dan setelah tabel](../../guide/guides/schema-sql.md#before-and-after-scripts); `ddlScripts` sendiri menyimpan setiap skrip sebagaimana diketik. Kunci ini hanya ditulis selama salah satu skrip berisi teks, dan saat itu ditulis bersama kedua skrip; kunci yang tidak ada, atau skrip yang bukan string, dibaca sebagai `''`. Pilihan `Statements`, `Header`, dan `Tables` di tab tersebut tidak disimpan di dokumen.  
Editor sebelum `4.0.0` membuang skrip tersebut saat memuat dokumen, sehingga menyimpan di sana menghilangkannya.

`Database`, `Language`, `Show`, `LockSettingType`, dan `ReferentialAction` hanya bertambah di akhir. Dokumen yang tersimpan memuat angkanya, sehingga vendor, target pembuatan kode, flag, penguncian, atau tindakan baru mengambil bit berikutnya, bukan slot di tengah.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
};
```

Setiap daftar adalah urutan satu jenis entitas, yang dibaca oleh DDL, pengurutan tabel, dan urutan penggambaran. Dalam bentuk penyimpanan, setiap daftar hanya memuat id entitas yang dipertahankan, masing-masing sekali, dalam urutan tercantum. Sejak `4.0.0`, `tableGroupIds` adalah urutan grup tabel.

Sejak `4.0.0`, urutan tumpukan tidak disimpan. Penguraian menumpuk setiap tabel, memo, dan grup tabel tercantum yang tidak membawa `zIndex` menurut posisinya dalam daftarnya, dengan yang lebih akhir di depan: grup tabel mulai dari `1`, tabel mulai dari `2`, dan memo di atas setiap tabel. Entitas yang membawa `zIndex`, seperti dalam nilai runtime atau file yang disimpan sebelum `4.0.0`, mempertahankannya. Karena itu, efek membawa tabel atau memo ke depan hilang saat file dibuka kembali.

### Koleksi: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Sejak `4.0.0`, tabel membawa `groupId`, yaitu id [grup tabel](../../guide/guides/table-groups.md) tempat tabel itu berada. `groupId` yang tidak ada atau kosong, atau yang tidak menunjuk grup mana pun di `doc.tableGroupIds`, berarti tidak ada grup, dan bentuk penyimpanan hanya menuliskannya selama field itu menunjuk grup yang dipertahankan.  
Penguraian menginisialisasi `seqColumnIds` dengan `columnIds` saat field itu tidak ada atau tidak memuat salah satu id yang tercantum, dan editor mengukur ulang `widthName` dan `widthComment` dengan fontnya sendiri pada setiap pemuatan.

### Koleksi: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthComment: number;
  widthDataType: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

Sejak `4.0.0`, bentuk penyimpanan tidak menulis `ui` kolom. Setiap pemuatan menghitung `keys`, yaitu tanda kunci utama dari bit `primaryKey` pada `options` dan tanda kunci asing dari hubungan yang berakhir pada kolom tersebut, serta mengukur keempat lebar.  
Editor sebelum `4.0.0` menampilkan kolom dari file yang disimpan di sini tanpa ikon kunci utamanya.

### Koleksi: relationshipEntities {#collection-relationshipentities}

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

Sejak `3.10.0`, hubungan membawa `onDelete` dan `onUpdate`, yaitu [tindakan ON DELETE dan ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) miliknya. Masing-masing memuat tepat satu nilai `ReferentialAction`. `none`, nilai default, tidak menulis klausa apa pun, sehingga nilai default milik database itu sendiri yang berlaku. Lima lainnya mewakili `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT`, dan `RESTRICT`. Skema SQL hanya menulis klausa untuk database yang menerima tindakannya.  
Bentuk penyimpanan selalu menulis keduanya, dan sejak `4.0.0` JSON Schema mewajibkannya, dengan hanya memeriksa bahwa masing-masing adalah bilangan bulat. Penguraian tetap membaca field yang tidak ada, seperti pada setiap dokumen yang disimpan sebelum `3.10.0`, sebagai `none`, begitu pula nilai di luar daftar.  
Editor sebelum `3.10.0` tidak mengenal field ini dan membuangnya saat memuat dokumen, sehingga menyimpan di sana menghilangkan setiap tindakan.

Sejak `4.0.0`, setiap pemuatan menghitung apa yang dihilangkan bentuk penyimpanan. Hubungan menjadi hubungan pengidentifikasi saat setiap kolom tempatnya berakhir adalah kunci utama, dan `startRelationshipType`-nya adalah `dash` saat setiap kolom tersebut NOT NULL dan `ring` jika tidak; hubungan yang tidak lagi memiliki kolom akhir menjadi non-pengidentifikasi dan `dash`, seperti hubungan baru saat dibuat. Jangkar, yaitu `x`, `y`, dan `direction`, ditempatkan ulang.

### Koleksi: indexEntities {#collection-indexentities}

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

Penguraian menginisialisasi `seqIndexColumnIds` dengan `indexColumnIds` saat field itu tidak ada atau tidak memuat salah satu id yang tercantum.

### Koleksi: indexColumnEntities {#collection-indexcolumnentities}

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

### Koleksi: memoEntities {#collection-memoentities}

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

Sejak `4.0.0`, tabel dan memo [berbagi satu tumpukan](../../guide/guides/table-related-functions.md#moving-multiple-tables) yang diurutkan menurut `zIndex`, sehingga membawa tabel ke depan dapat menempatkannya di atas memo. Penguraian menumpuk memo yang disimpan tanpa `zIndex` di atas setiap tabel, seperti yang dijelaskan [Doc](#doc). Memo dalam file yang disimpan sebelum `4.0.0` mempertahankan `zIndex` yang disimpannya, yang berasal dari penghitung yang sama dengan milik tabel, sehingga memo yang digambar rilis sebelumnya di atas setiap tabel dapat terbuka di bawah tabel yang dibawa ke depan setelahnya.

### Koleksi: tableGroupEntities {#collection-tablegroupentities}

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

Sejak `4.0.0`, dokumen dapat memuat [grup tabel](../../guide/guides/table-groups.md): persegi panjang bernama dan berwarna yang digambar di belakang tabel. Tabel bergabung ke sebuah grup melalui `groupId`-nya sendiri, sehingga grup tidak memuat daftar anggota. Bentuk penyimpanan menulis koleksi ini, seperti `doc.tableGroupIds`, hanya selama ada grup, dan dokumen tanpa koleksi ini, seperti yang disimpan sebelum `4.0.0`, tidak memiliki grup. `Show.hideTableGroup` menyembunyikannya.  
Editor sebelum `4.0.0` membuang grup dan `groupId` setiap tabel saat memuat dokumen, sehingga menyimpan di sana menghilangkan setiap grup.

## JSON Schema {#json-schema}

File skema kanonis dipublikasikan di [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) dan dapat dirujuk langsung dengan `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Letakkan `$schema` di bagian atas file `.erd.json`, dan editor yang memahami JSON Schema, seperti VS Code, memvalidasi dokumen dan melengkapi field-nya secara otomatis saat Anda mengedit.

Sejak `4.0.0`, skema hanya menggambarkan bentuk penyimpanan. Setiap objek dengan field bernama bersifat tertutup (`additionalProperties: false`), setiap field yang selalu ditulis bentuk penyimpanan bersifat wajib, dan tidak ada field yang dihilangkannya yang disebutkan. Karena itu, skema menolak nilai runtime. Skema juga menolak file yang disimpan sebelum `4.0.0`, dengan `meta`, lebar, `zIndex`, `ignoreSaveSettings`, dan seterusnya, hingga editor `4.0.0` atau yang lebih baru menyimpan file tersebut lagi. File yang disimpan oleh `3.2.0` atau yang lebih baru sudah menyebutkan URL skema ini, yang menunjuk ke cabang `main`, sehingga editor yang memvalidasi terhadapnya kini menandai file tersebut. File yang disimpan oleh `3.0.0` atau `3.1.0`, atau dokumen v2, tidak menyebutkan `$schema`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order, without what an editor derives on load or keeps while it is open",
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
        }
      },
      "required": [
        "tableEntities",
        "tableColumnEntities",
        "relationshipEntities",
        "indexEntities",
        "indexColumnEntities",
        "memoEntities"
      ],
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc", "collections"],
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
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096); the three hide bits hide what they name while set",
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
            "settings"
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
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64)",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "minItems": 7,
          "maxItems": 7
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel",
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
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read",
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
      "required": ["tableIds", "relationshipIds", "indexIds", "memoIds"],
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
            "required": ["x", "y", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "comment", "columnIds", "ui"],
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
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8)",
            "type": "integer"
          }
        },
        "required": [
          "id",
          "tableId",
          "name",
          "comment",
          "dataType",
          "default",
          "options"
        ],
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
        "required": ["id", "name", "tableId", "indexColumnIds", "unique"],
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
            "required": ["x", "y", "width", "height", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "value", "ui"],
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
        "required": ["id", "name", "color", "ui"],
        "additionalProperties": false
      }
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
