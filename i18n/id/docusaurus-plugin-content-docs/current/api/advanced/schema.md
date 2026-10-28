---
sidebar_position: 3
description: Format dokumen .erd.json — bentuk penyimpanan yang tersimpan di file dan nilai runtime yang dipegang editor, tipe TypeScript, konstanta di balik setiap field numerik, dan JSON Schema yang dipublikasikan.
---

# Skema

`.erd.json` adalah format dokumen editor. Baca halaman ini jika Anda perlu membuat, memvalidasi, atau memigrasikan dokumen di luar editor.

Sejak `4.0.0`, dokumen memiliki dua bentuk serialisasi, keduanya dengan `version` `'3.0.0'`. Bentuk penyimpanan adalah isi sebuah file: bentuk inilah yang dikembalikan [`editor.value`](../erd-editor-element.md#value), yang ditulis ekspor JSON, dan satu-satunya bentuk yang diterima [JSON Schema](#json-schema) yang dipublikasikan. Nilai runtime adalah seluruh dokumen sebagaimana dipegang editor, yang dikembalikan [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, setter `value`, dan `setSchemaJSON()` membaca kedua bentuk, file apa pun yang disimpan rilis sebelumnya, dan dokumen v2 `.vuerd`. Sebelum `4.0.0`, hanya ada satu: `value` mengembalikan seluruh dokumen sebagaimana dipegang editor, seperti yang kini dilakukan `runtimeValue`.

## Bentuk penyimpanan dan nilai runtime {#storage-form-and-runtime-value}

Bentuk penyimpanan hanya memuat entitas yang masih ada: setiap tabel yang tercantum di `doc.tableIds`, kolom yang dicantumkan tabel-tabel tersebut, hubungan antara dua tabel yang dipertahankan, indeks dari tabel yang dipertahankan beserta kolom indeks yang kolomnya masih dicantumkan tabelnya, memo dan grup tabel yang tercantum, serta, sejak `4.2.0`, kata, istilah, dan domain tercantum yang memiliki nilai selain id-nya. Bentuk ini menghilangkan apa yang dihitung editor saat memuat atau dipegangnya selama terbuka: entitas yang dihapus, `seqColumnIds` dan `seqIndexColumnIds`, setiap `zIndex`, lebar hasil pengukuran, `ui` kolom, `identification`, `startRelationshipType`, dan jangkar sebuah hubungan, serta, sejak `4.2.0`, `order` setiap baris kamus dan daftar `doc.wordIds`, `doc.termIds`, dan `doc.domainIds`. Tipe di bawah menandai setiap field ini dengan `// runtime only`.  
Setiap koleksi kecuali kamus memakai id sebagai kunci, diurutkan menurut unit kode, dengan kolom dikelompokkan lebih dulu menurut `tableId` dan kolom indeks menurut `indexId`. Sejak `4.2.0`, `wordEntities`, `termEntities`, dan `domainEntities` muncul setelah semua koleksi lainnya, dalam urutan tersebut, masing-masing ditulis sebagai header dan baris, satu baris kamus per baris teks (lihat [Baris kamus](#dictionary-rows)). Setiap entitas menulis field-nya dalam urutan tetap, dan teksnya diindentasi dua spasi serta diakhiri baris baru. Jadi, dokumen yang sama selalu ditulis menjadi byte yang sama, sebuah perubahan hanya mengubah apa yang disentuhnya, dan file yang disimpan di mesin dengan font lain dibuka kembali dengan `value` yang sama.  
VS Code, Obsidian, dan plugin JetBrains menulis file hanya saat sebuah perubahan mengubah `value`, sehingga file yang disimpan rilis sebelumnya mempertahankan bentuk lamanya hingga pertama kali diedit.

Sejak `4.2.0`, bentuk penyimpanan juga menghilangkan apa yang tidak berisi apa pun: setiap field teks yang dimiliki entitas atau `ui`-nya sebagai `''` (`name`, `comment`, dan `ui.color` tabel, `name`, `comment`, `dataType`, dan `default` kolom, `name` indeks, `value` dan `ui.color` memo, `name` dan `color` grup tabel), setiap daftar `doc` dan koleksi yang tidak memuat entri apa pun, serta `collections` itu sendiri begitu setiap koleksi kosong. Teks yang hanya berisi spasi ditulis sebagaimana adanya, kecuali nama logis, yang dalam hal itu dihilangkan, dan kata, istilah, atau domain yang semua nilainya selain id kosong atau hanya berisi spasi, yang dihilangkan seluruhnya. Setiap id, setiap daftar di dalam entitas, dan setiap angka, termasuk `0`, tetap ditulis. `doc` selalu ditulis, sehingga file dokumen baru memuat `$schema`, `version`, pengaturannya, dan `"doc": {}`.  
Penguraian membaca field teks yang tidak ada sebagai `''` dan koleksi yang tidak ada sebagai kosong, seperti yang dilakukan setiap rilis v3, dan bentuk penyimpanan hanya menghilangkan daftar `doc` selama koleksinya tidak berisi apa pun (lihat [Doc](#doc)). Jadi, editor sebelum `4.2.0` juga membuka file ini, dan program yang membaca file sendiri harus membaca apa yang tidak ada dengan cara yang sama. File yang disimpan rilis sebelumnya kembali dari penyimpanan berikutnya dengan teks, daftar, dan koleksi kosongnya dihilangkan, sebuah perubahan yang terjadi sekali, lalu disimpan sama persis byte demi byte sejak saat itu.

Nilai runtime mempertahankan apa yang dihilangkan bentuk penyimpanan: entitas yang dihapus, sequence, z-index, lebar, tanda kunci, flag hubungan, dan jangkar, field teks yang kosong, serta keempat daftar `tableIds`, `relationshipIds`, `indexIds`, dan `memoIds` beserta keenam koleksi dari `tableEntities` hingga `memoEntities`, bahkan saat kosong. Sejak `4.2.0`, nilai ini juga mempertahankan kata, istilah, dan domain yang dihapus, baris yang tidak berisi apa pun, `order` setiap baris, ketiga daftar kamus, nama logis yang hanya berisi spasi, dan tautan ke domain yang dihapus. Nilai ini diindentasi dua spasi tanpa baris baru di akhir. Gunakan nilai ini hanya untuk mengisi data awal kolaborator atau tampilan kedua melalui `setInitialValue()`, agar pembatalan penghapusan yang dikirim editor lain mengembalikan entitas itu secara utuh di sana. Jangan pernah menulisnya ke file; JSON Schema menolaknya. Tidak ada lagi yang membersihkan entitas yang dihapus, sehingga nilai runtime menyimpannya hingga dokumen dibuka lagi dari filenya.

Kedua bentuk menulis setiap pengaturan yang terkunci pada nilai terkuncinya (lihat [`lockSettings`](#settings)), `settings.ddlScripts` hanya selama sebuah skrip berisi teks, dan `groupId` sebuah tabel hanya selama tidak kosong. Sejak `4.2.0`, kedua bentuk juga menulis `settings.nameViewMode` hanya selama nilai yang ditulisnya bukan `'physical'`, `settings.columnOrder` dalam tujuh entri jika memungkinkan (lihat [Settings](#settings)), dan `nameDerived` sebuah tabel hanya selama bernilai `true`.  
Bentuk penyimpanan menulis `doc.tableGroupIds` dan `tableGroupEntities` hanya selama ada grup tabel, `logicalName` hanya selama berisi teks selain spasi, `domainId` sebuah kolom hanya selama menunjuk domain yang ditulis file, dan setiap kamus hanya selama memuat baris yang ditulis file. Nilai runtime menulis field grup tabel selama dokumen memuat sebuah grup atau grup yang dihapus, `logicalName` dan `domainId` selama tidak bernilai `''`, dan setiap kamus beserta daftarnya selama salah satunya memuat entri, termasuk baris yang dihapus.

## TypeScript {#typescript}

Tipe berikut menggambarkan nilai runtime. Field yang ditandai `// runtime only` dihilangkan dari bentuk penyimpanan, dan field yang ditandai `?` hanya ditulis selama berisi sesuatu. Teks, daftar, dan koleksi kosong yang dihilangkan bentuk penyimpanan sejak `4.2.0` tidak ditandai.

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
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Setiap entitas memiliki `id`, sebuah string opak, yang menjadi kuncinya di koleksinya, kecuali di ketiga kamus, tempat id merupakan nilai pertama sebuah baris. Sejak `4.2.0`, untuk entitas dari ketujuh koleksi berkunci yang `id`-nya tidak ada, kosong, atau bukan string, penguraian memakai kunci tempat entitas itu disimpan sebagai id-nya, dan membuang entri yang bukan objek, atau entri tanpa id yang kuncinya `''`. Baris kamus dibuang jika bukan array atau `id`-nya bukan string selain `''`. Editor sebelum `4.2.0` membuang entitas yang `id`-nya tidak ada atau kosong, sehingga bentuk penyimpanan tetap menulis setiap id.  
Sejak `4.0.0`, setiap id baru, termasuk id baris kamus, adalah UUIDv7 yang ditulis dalam bentuk Uuid25, 25 digit basis 36 berhuruf kecil seperti `03gzrxjv20bdlcak89q25d2m7`, sehingga id yang dibuat satu editor terurut sesuai urutan pembuatannya. Dokumen mempertahankan id yang dimilikinya, seperti id nanoid dari rilis sebelumnya atau id file v2, sehingga tidak ada yang boleh bergantung pada bentuk sebuah id.

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

`originX` dan `originY` adalah area pandang: titik layar tempat titik `(0, 0)` pada bidang diagram berada.  
`zoomLevel` berkisar dari `0.1` hingga `1.5`. Dokumen yang disimpan dengan nilai di atas `1` dibuka pada `1` di editor sebelum `3.5.0`.  
Sejak `4.0.0`, pengaturan tidak membawa `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, atau `ignoreSaveSettings`. Tidak ada yang menulisnya, parser tidak mempertahankan satu pun darinya, dan JSON Schema menolak file yang masih memilikinya.

`canvasType` adalah tab tempat dokumen dibuka. Dokumen yang disimpan di tab Visualisasi berisi `'@dineug/erd-editor/builtin-visualization'`, tetapi tidak mencatat apakah mode `Graph` atau `Flow` yang sedang ditampilkan, dan editor yang baru dibuat menampilkan tab tersebut dalam mode `Graph`.  
Sejak `4.0.0`, selama penguncian `Canvas Type` aktif, seperti pada dokumen baru, dokumen mempertahankan tab yang ditampilkan saat dikunci, dan berpindah tab membiarkan `value` seperti semula. Penguncian yang dilakukan di tab Pengaturan menyimpan tab yang sebelumnya dibuka pembaca, dan `'settings'` yang terkunci, yang hanya dapat ditulis lewat pengeditan manual, dibuka pada `'ERD'`.  
Sejak `4.2.0`, `canvasType` juga dapat bernilai `'@dineug/erd-editor/builtin-dictionary'`, yaitu tab [Kamus](../../guide/guides/dictionary.md), yang dipertahankan penguncian `Canvas Type` seperti tab lainnya. Editor sebelum `4.2.0` mempertahankan nilai tersebut, tetapi tidak menampilkan tab apa pun di bawah bilah alatnya hingga pembaca memilih salah satu tab.  
Tidak ada keadaan milik mode `Flow` sendiri yang diserialisasi: penempatan, zoom, pergeseran, tampilan baris, dan tabel yang difokuskan tetap berada di editor, dan sejak `4.2.0` begitu pula langkah yang ditelusuri [`Previous table` dan `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Jadi, `originX`, `originY`, dan `zoomLevel` selalu menggambarkan kanvas ERD.

`show` dan `lockSettings` adalah bitmask — gabungkan flag-nya dengan OR.  
`columnOrder` adalah array yang memuat setiap nilai `ColumnType` satu kali, dalam urutan tampilan; sejak `4.2.0`, dokumen dapat menuliskannya dengan tujuh dari kesembilan nilai, seperti dijelaskan paragraf urutan kolom di bawah.  
`database`, `language`, `tableNameCase`, `columnNameCase`, dan `bracketType` masing-masing memuat tepat satu nilai, dan JSON Schema menolak nilai gabungan.

`show` pada dokumen baru adalah `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull`, dan `relationship`.  
Sejak `3.10.0`, ada dua flag `show` tambahan, keduanya nonaktif pada dokumen baru dan pada setiap dokumen yang disimpan sebelum `3.10.0`.  
`columnAlternateKey` (`512`) adalah opsi tampilan [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Saat diaktifkan, flag ini menandai kolom dari setiap indeks unik atas dua kolom atau lebih sebagai `AK1.1`, `AK1.2`, dan seterusnya. Flag ini awalnya nonaktif, sehingga lebar diagram yang sudah ada tidak berubah.  
`hideReferentialAction` (`1024`) bekerja sebaliknya: saat diaktifkan, flag ini menyembunyikan [label ON DELETE dan ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) pada konektor, sehingga label tersebut ditampilkan secara default. Opsi tampilan `Referential Actions` dicentang selama flag ini nonaktif. Flag ini tidak mengubah ukuran tabel mana pun.  
Editor sebelum `3.10.0` mempertahankan `show` sebagai satu bilangan bulat, sehingga kedua flag tetap ada saat disimpan di sana.

Sejak `4.0.0`, ada dua flag `show` tambahan, keduanya nonaktif pada dokumen baru dan pada setiap dokumen yang disimpan sebelum `4.0.0`. Seperti `hideReferentialAction`, masing-masing menyembunyikan apa yang dinamainya, sehingga grup tabel dan memo ditampilkan secara default.  
`hideTableGroup` (`2048`) menyembunyikan [grup tabel](../../guide/guides/table-groups.md), dan `hideMemo` (`4096`) menyembunyikan setiap memo. Keduanya adalah [opsi tampilan](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` dan `Memos`, masing-masing dicentang selama flag-nya nonaktif. Tidak satu pun dari keduanya mengubah ukuran tabel mana pun.  
Editor sebelum `4.0.0` mempertahankan `show` sebagai satu bilangan bulat, sehingga kedua flag tetap ada saat disimpan di sana.

Sejak `4.2.0`, ada satu flag `show` tambahan, `columnDomain` (`8192`), yang nonaktif pada dokumen baru dan pada setiap dokumen yang disimpan sebelum `4.2.0`, sehingga `show` pada dokumen baru tetap `431`. Flag ini adalah [opsi tampilan](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: saat diaktifkan, setiap baris kolom menampilkan [sel Domain](../../guide/guides/logical-names.md#the-domain-cell), yang melebarkan tabel. Flag ini awalnya nonaktif, sehingga lebar diagram yang sudah ada tidak berubah.  
Editor sebelum `4.2.0` mempertahankan `show` sebagai satu bilangan bulat, sehingga flag ini tetap ada saat disimpan di sana.

Sejak `4.2.0`, `ColumnType` memiliki sembilan nilai. `columnLogicalName` (`128`) menempatkan sel nama logis, yang hanya ditampilkan baris kolom dalam tampilan `Both Names`, dan `columnDomain` (`256`) menempatkan sel Domain. Keduanya adalah baris `Logical Name` dan `Domain` di [urutan kolom](../../guide/guides/settings.md#adjusting-column-order) tab Pengaturan. Editor menyimpan urutan berisi kesembilan nilai, dan urutan dokumen baru adalah `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Kedua bentuk menulis urutan dalam tujuh entri, tanpa `128` dan `256`, selama `128` berada tepat sebelum `columnName` dan `256` tepat setelah `columnDataType`. Jadi, dokumen baru tetap menulis `1, 2, 4, 8, 16, 32, 64`, dan file yang urutannya tidak pernah memindahkan keduanya mempertahankan byte-nya. Jika tidak, kedua bentuk menulis kesembilan nilai.  
Penguraian menyisipkan kedua nilai itu ke urutan tujuh entri di posisi tersebut, apa pun urutan ketujuh nilai lainnya, menerima sembilan entri yang memuat setiap tipe sebagaimana adanya.  
Sejak `5.0.0`, penguraian menerima urutan lain apa pun juga. Setiap `ColumnType` yang dikenalnya dipertahankan satu kali, sesuai urutan yang diberikan, dan setiap entri lain dibuang: nilai yang tidak disebut `ColumnType` mana pun, seperti tipe yang ditambahkan rilis yang lebih baru, dan entri kedua dari satu tipe. Setiap tipe yang tidak ada dalam urutan ditempatkan tepat setelah tipe terdekat sebelumnya dalam urutan default yang dimuat urutan itu, atau, jika tidak ada yang mendahuluinya, tepat sebelum tipe terdekat sesudahnya, sebagaimana `128` dan `256` menemukan tempatnya dalam tujuh entri. Hanya urutan yang tidak menyebut tipe yang dikenalnya, atau nilai yang bukan array, dibaca sebagai urutan default.  
Jadi file yang disimpan rilis yang lebih baru terbuka dengan urutan tipe yang dikenal rilis ini, dan penyimpanan di sini menulis urutan itu tanpa tipe lainnya. Sebelum `5.0.0`, penguraian membaca urutan lain apa pun sebagai urutan default, sehingga file seperti itu terbuka dengan urutan kolom yang direset. JSON Schema menerima tujuh atau sembilan bilangan bulat.

Sejak `4.0.0`, `Language` memiliki delapan target [Generator Kode](../../guide/guides/code-generator.md) tambahan, dari `Mermaid` hingga `JSONSchema`. `language` yang tidak dikenal parser dibaca sebagai `GraphQL`, sehingga editor sebelum `4.0.0` membuka dokumen yang disimpan dengan salah satunya pada GraphQL, dan menyimpan di sana menulis GraphQL.

Sejak `4.0.0`, `lockSettings` menggantikan `ignoreSaveSettings`, dan `LockSettingType` menggantikan `SaveSettingType`, yang telah dihapus. `lockSettings` menyebutkan pengaturan yang disimpan dokumen sebagaimana keadaannya saat dikunci. `viewport` mencakup `originX`, `originY`, dan `zoomLevel` sekaligus, karena titik asal yang disimpan tanpa zoomnya terbuka di tempat lain, dan setiap bit lainnya mencakup field yang menjadi asal namanya. Inilah baris [`Lock`](../../guide/guides/settings.md#lock) di tab Pengaturan.  
Pengaturan yang terkunci ditulis pada nilai terkuncinya, apa pun yang ditampilkan editor, baik oleh `value` maupun `runtimeValue`, dan setiap pengaturan lainnya sebagaimana adanya. Jadi, selama penguncian yang sesuai aktif, menggulir dan melakukan zoom, berpindah tab, mengubah bahasa Generator Kode, sebuah konvensi penamaan, atau tipe tanda kutip, atau mengganti Tampilan Nama membiarkan file seperti semula. Mengunci mengambil nilai yang dimiliki pengaturan pada saat itu, dan penguraian mengambil nilai terkunci dari field yang disimpan.  
Dokumen yang dimulai dari nol — editor atau store replikasi baru, atau nilai kosong yang diberikan ke `value` atau `setInitialValue()` — memiliki `lockSettings` bernilai `63`, dengan semua penguncian aktif. Dokumen yang `settings`-nya tidak membawa `lockSettings` — setiap file yang disimpan sebelum `4.0.0`, apa pun `ignoreSaveSettings`-nya, dan setiap dokumen v2 — juga dibuka dengan semua penguncian aktif: area pandang dan tabnya sama dengan milik dokumen baru (`originX` dan `originY` `0`, `zoomLevel` `1`, tab ERD), dan bahasa, konvensi penamaan, serta tipe tanda kutipnya dikunci pada nilai yang disimpannya. Dokumen yang menyebutkan penguncian miliknya mempertahankannya, termasuk `0`, beserta setiap nilai yang disimpannya.  
Penguraian mempertahankan setiap bit `lockSettings`, termasuk yang tidak dikenal, sehingga penguncian yang ditambahkan rilis yang lebih baru tetap ada saat disimpan di sini; JSON Schema hanya memeriksa bahwa nilainya bilangan bulat. Editor sebelum `4.0.0` membuang `lockSettings` saat menyimpan dan menulis area pandang serta tab sebagaimana adanya, sehingga file tersebut dibuka lagi di sini sebagai file yang disimpan sebelum `4.0.0`.

Sejak `4.2.0`, ada penguncian ketujuh, `unlockNameViewMode` (`64`), yaitu baris `Name View`, yang mencakup `nameViewMode`. Bitnya dibaca terbalik dari bit penguncian lainnya, seperti halnya bit penyembunyi pada `Show`: saat disetel, Tampilan Nama tidak terkunci, dan saat tidak disetel, terkunci. Jadi, `63` tetap berarti semua penguncian aktif, dan dokumen baru memuat nilai itu dengan Tampilan Nama terkunci pada `'physical'`. File yang disimpan sebelum `4.2.0` memuat bit ini dalam keadaan tidak disetel, apa pun penguncian lainnya, termasuk `0`, sehingga file itu dibuka dengan Tampilan Nama terkunci pada `'physical'`. Dokumen dengan semua penguncian nonaktif memuat `64`, dan dokumen dengan semua penguncian lain aktif dan Tampilan Nama tidak terkunci memuat `127`. Uji penguncian ini secara terbalik: penguncian aktif selama `(lockSettings & 64) === 0`.  
Selama penguncian ini aktif, penggantian Tampilan Nama hanya mengubah layar editor yang melakukannya, dan dokumen mempertahankan tampilan yang terkunci. Selama penguncian nonaktif, penggantian di editor yang dapat mengedit menjadi milik dokumen, dan setiap kolaborator ikut berganti bersamanya. Penggantian oleh editor hanya baca hanya mengubah layarnya sendiri dalam kedua keadaan. Lihat [`Lock`](../../guide/guides/settings.md#lock).  
Editor `4.0.0` atau `4.1.0` mempertahankan bit ini saat menyimpan, tetapi membuang `nameViewMode`, sehingga dokumen dibuka kembali di sini dalam `'physical'`, dengan penguncian seperti semula.

Sejak `4.0.0`, `ddlScripts` memuat dua skrip tab [Skema SQL](../../guide/guides/schema-sql.md), yang ditulis DDL setiap database: `before` setelah pembuka dan sebelum tabel, `after` setelah DDL yang dihasilkan. DDL menulis masing-masing dengan jeda baris LF, tanpa baris kosong di awal dan spasi kosong di akhir, dan pada MSSQL diakhiri dengan `GO`, seperti yang dijelaskan [Skrip sebelum dan setelah tabel](../../guide/guides/schema-sql.md#before-and-after-scripts); `ddlScripts` sendiri menyimpan setiap skrip sebagaimana diketik. Kunci ini hanya ditulis selama salah satu skrip berisi teks, dan saat itu ditulis bersama kedua skrip; kunci yang tidak ada, atau skrip yang bukan string, dibaca sebagai `''`. Pilihan `Statements`, `Header`, dan `Tables` di tab tersebut, serta, sejak `4.2.0`, sakelar [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) di tab itu, tidak disimpan di dokumen.  
Editor sebelum `4.0.0` membuang skrip tersebut saat memuat dokumen, sehingga menyimpan di sana menghilangkannya.

Sejak `4.2.0`, `nameViewMode` adalah [Tampilan Nama](../../guide/guides/logical-names.md#name-view), yaitu nama yang ditampilkan diagram: `'physical'` menampilkan nama setiap tabel dan kolom, `'logical'` nama logisnya di tempat nama, dan `'both'` nama logis dan nama. Menu menyebutnya `Physical Names`, `Logical Names`, dan `Both Names`. Kedua bentuk menulisnya paling akhir, setelah `ddlScripts`, dan hanya selama nilai yang ditulisnya bukan `'physical'`; selama penguncian `Name View` aktif, nilai itu adalah nilai yang terkunci, apa pun yang ditampilkan layar. Nilai yang tidak ada, atau yang tidak dikenal parser, dibaca sebagai `'physical'`, dan JSON Schema hanya menerima `"logical"` dan `"both"`.  
Editor sebelum `4.2.0` membuang `nameViewMode` saat memuat dokumen.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType`, dan `ReferentialAction` hanya bertambah di akhir. Dokumen yang tersimpan memuat angkanya, sehingga vendor, target pembuatan kode, flag, tipe kolom, opsi kolom, penguncian, atau tindakan baru mengambil bit berikutnya, bukan slot di tengah.

### Doc {#doc}

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

Masing-masing dari lima daftar pertama adalah urutan satu jenis entitas, yang dibaca oleh DDL, pengurutan tabel, dan urutan penggambaran. Dalam bentuk penyimpanan, setiap daftar hanya memuat id entitas yang dipertahankan, masing-masing sekali, dalam urutan tercantum, dan sejak `4.2.0`, daftar yang tidak memuat id apa pun dihilangkan. Sejak `4.0.0`, `tableGroupIds` adalah urutan grup tabel.

Sejak `4.2.0`, `wordIds`, `termIds`, dan `domainIds` mencantumkan baris setiap kamus yang masih ada: baris yang dimuat koleksinya tetapi tidak dimuat daftarnya telah dihapus. Daftar ini bukan urutan lembar, yang diberikan oleh `order` setiap baris. Hanya nilai runtime yang menulisnya, masing-masing selama daftar itu atau koleksinya memuat entri. Baris file itu sendiri merupakan keanggotaan sekaligus urutannya, dan JSON Schema menolak daftar tersebut.  
Sejak `4.2.0`, penguraian membaca daftar yang dihilangkan dokumen, atau yang dimuat sebagai sesuatu selain array, sebagai setiap entri yang dimuat koleksinya, setiap id sekali, dalam urutan penyimpanannya; array kosong tetap kosong, sehingga setiap entri koleksinya dibaca sebagai telah dihapus. Editor sebelum `4.2.0` membaca daftar yang tidak ada sebagai kosong, sehingga bentuk penyimpanan tetap menulis setiap daftar selama koleksinya memuat entitas.

Sejak `4.0.0`, urutan tumpukan tidak disimpan. Penguraian menumpuk setiap tabel, memo, dan grup tabel tercantum yang tidak membawa `zIndex` menurut posisinya dalam daftarnya, dengan yang lebih akhir di depan: grup tabel mulai dari `1`, tabel mulai dari `2`, dan memo di atas setiap tabel. Entitas yang membawa `zIndex`, seperti dalam nilai runtime atau file yang disimpan sebelum `4.0.0`, mempertahankannya. Karena itu, efek membawa tabel atau memo ke depan hilang saat file dibuka kembali.

### Koleksi: tableEntities {#collection-tableentities}

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

Sejak `4.0.0`, tabel membawa `groupId`, yaitu id [grup tabel](../../guide/guides/table-groups.md) tempat tabel itu berada. `groupId` yang tidak ada atau kosong, atau yang tidak menunjuk grup mana pun di `doc.tableGroupIds`, berarti tidak ada grup, dan bentuk penyimpanan hanya menuliskannya selama field itu menunjuk grup yang dipertahankan.  
Penguraian menginisialisasi `seqColumnIds` dengan `columnIds` saat field itu tidak ada atau tidak memuat salah satu id yang tercantum, dan editor mengukur ulang `widthName`, `widthLogicalName`, dan `widthComment` dengan fontnya sendiri pada setiap pemuatan.

Sejak `4.2.0`, tabel membawa `logicalName`, yaitu nama yang ditampilkan [tampilan](../../guide/guides/logical-names.md#name-view) `Logical Names` dan `Both Names`, `''` jika tidak ada, dan `nameDerived`, `true` selama kamus [menghasilkan](../../guide/guides/dictionary.md#deriving-physical-names) `name` dari nama logis. Selama flag ini disetel, nama logis baru menghasilkan nama lagi; selama tidak disetel, nama tersebut adalah nama buatan seseorang sendiri, dan nama logis baru membiarkannya kecuali jika nama itu kosong atau hanya berisi spasi. Penggantian nama secara manual menonaktifkannya, dan [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) menulis ulang bahkan nama yang ditulis seseorang dan mengaktifkannya di mana pun ada nama logis.  
Bentuk penyimpanan menulis `logicalName` setelah `name`, sebagaimana diketik, hanya selama berisi teks selain spasi, dan `nameDerived` setelah `groupId` hanya selama bernilai `true`, satu-satunya nilai yang diterima JSON Schema. `logicalName` yang tidak ada dibaca sebagai `''` dan `nameDerived` yang tidak ada sebagai `false`, sehingga setiap nama di file yang disimpan sebelum `4.2.0` dianggap nama buatan seseorang sendiri.  
Editor sebelum `4.2.0` membuang keduanya saat memuat dokumen, sehingga menyimpan di sana menghilangkan nama logis setiap tabel.

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

Sejak `4.0.0`, bentuk penyimpanan tidak menulis `ui` kolom. Setiap pemuatan menghitung `keys`, yaitu tanda kunci utama dari bit `primaryKey` pada `options` dan tanda kunci asing dari hubungan yang berakhir pada kolom tersebut, serta mengukur keenam lebar.  
Editor sebelum `4.0.0` menampilkan kolom dari file yang disimpan di sini tanpa ikon kunci utamanya.

Sejak `4.2.0`, kolom membawa `logicalName`, seperti tabel, dan `domainId`, yaitu id domain yang ditautkan kolom itu, `''` jika tidak ada. Perubahan di satu editor mempertahankan kolom yang tertaut pada tipe data domainnya, seperti dijelaskan [Domain dan tipe data](../../guide/guides/dictionary.md#domains-and-data-types). Namun, penguraian tidak mengubah tipe kolom mana pun, sehingga file yang ditulis di tempat lain dapat membiarkan kolom yang tertaut pada tipe lain, begitu pula perubahan dua kolaborator yang bersilangan; lembar Pemeriksaan mencantumkan masing-masing sebagai [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). Penguraian mengosongkan `domainId` yang tidak menunjuk domain apa pun yang dimuat dokumen. Domain yang dihapus tetap dihitung, sehingga editor mempertahankan tautan ke domain itu selama pembatalan dapat mengembalikan domain tersebut. Setelah `options`, bentuk penyimpanan menulis `logicalName` menurut aturan untuk tabel, dan `domainId` hanya selama menunjuk domain yang ditulis file, sehingga tidak pernah menulis tautan ke domain yang dihapus.  
`ColumnOption.nameDerived` (`16`) adalah flag nama hasil kamus milik kolom, yang disimpan di `options` bersama bit lainnya dan memiliki arti yang sama dengan `nameDerived` milik tabel. Misalnya, kunci utama yang tidak boleh NULL dan namanya dihasilkan kamus memuat `options` `26`.  
Editor sebelum `4.2.0` membuang `logicalName` dan `domainId` saat memuat dokumen, sehingga menyimpan di sana menghilangkannya. Editor itu mempertahankan `options` sebagai satu bilangan bulat, sehingga bit `nameDerived` tetap ada saat disimpan di sana.

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

### Baris kamus {#dictionary-rows}

Sejak `4.2.0`, dokumen memuat tiga kamus, yaitu lembar `Words`, `Terms`, dan `Domains` di tab [Kamus](../../guide/guides/dictionary.md), dalam `wordEntities`, `termEntities`, dan `domainEntities`. Setiap field kata, istilah, atau domain berupa string, dan tidak satu pun memiliki `ui`. Lembar `Checks` disusun dari kamus dan diagram, dan tidak disimpan.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Tidak satu pun dari ketiganya memakai id sebagai kunci. Masing-masing ditulis sebagai header dan baris: `fields` menyebutkan field entitas satu kali, dimulai dengan id, dan setiap baris memuat nilai satu entitas dalam urutan tersebut. Tipe di bawah mencantumkan field setiap entitas dalam urutan header nilai runtime. Baris selalu mempertahankan id dan namanya, tetapi nilai kosong di bagian akhirnya setelah nama dihilangkan, sehingga nilai kosong sebelum nilai yang dipertahankan tetap `''`, dan penguraian membaca nilai yang tidak dimiliki baris sebagai `''`. Kedua bentuk menulis setiap baris pada baris teksnya sendiri sebagai JSON ringkas, seperti pada dua kata dari sebuah file berikut:

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

Bentuk penyimpanan menulis baris yang tercantum dalam urutan lembar dan menghilangkan `order`, sehingga headernya tidak menyebutkannya. Bentuk ini menghilangkan baris yang semua nilainya selain id kosong atau hanya berisi spasi, seperti baris yang ditambahkan dan tidak pernah diisi, atau yang dikosongkan, beserta setiap tautan ke domain semacam itu atau ke domain yang dihapus: `domainId` kolom dihilangkan, dan `domainId` istilah ditulis `''`, dengan istilah itu sendiri dihilangkan jika tidak memuat apa pun selain itu.  
Header nilai runtime menyebutkan `"order"` tepat setelah `"name"`. Nilai ini menulis setiap baris yang dimuat koleksinya, termasuk yang dihapus, dalam urutan koleksi memuatnya, jadi urutkan menurut `order`, yang dibandingkan dalam urutan unit kode, untuk mendapatkan urutan lembar. Penguraian memberi baris file kunci `order` sesuai urutan letak baris, sehingga baris terbaca kembali dalam urutan file menuliskannya.  
Dokumen tanpa kamus, seperti yang disimpan sebelum `4.2.0`, tidak memiliki kamus apa pun. Editor sebelum `4.2.0` membuang ketiganya saat memuat dokumen, sehingga menyimpan di sana menghilangkan setiap kata, istilah, dan domain.

### Koleksi: wordEntities {#collection-wordentities}

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

Kata adalah salah satu kata penyusun nama logis, dan `abbreviation` adalah yang mewakilinya dalam nama fisik. `synonyms` mencantumkan ejaan lain dari kata tersebut, dan `forbiddenWords` kata yang tidak boleh digunakan sebagai penggantinya, masing-masing dipisahkan koma.

### Koleksi: termEntities {#collection-termentities}

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

Istilah adalah nama logis utuh. Tabel atau kolom yang `logicalName`-nya cocok dengan `name` menghasilkan `physicalName` atau, selama field itu kosong, nama yang disusun dari singkatan kata, dan kolom juga mengambil domain yang ditunjuk `domainId`, `''` jika tidak ada (lihat [Menghasilkan nama fisik](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` dipisahkan koma. Penguraian mengosongkan `domainId` yang tidak menunjuk domain apa pun, seperti pada kolom.

### Koleksi: domainEntities {#collection-domainentities}

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

Domain adalah tipe data bernama, dengan `dataType` memuatnya seperti pada kolom, termasuk panjangnya, misalnya `NUMERIC(10)`. Kolom atau istilah menautkan domain melalui id-nya, dan editor memberi setiap kolom yang tertaut tipe data domain tersebut (lihat [Domain dan tipe data](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

File skema kanonis dipublikasikan di [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) dan dapat dirujuk langsung dengan `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Letakkan `$schema` di bagian atas file `.erd.json`, dan editor yang memahami JSON Schema, seperti VS Code, memvalidasi dokumen dan melengkapi field-nya secara otomatis saat Anda mengedit.

Sejak `4.0.0`, skema hanya menggambarkan bentuk penyimpanan. Setiap objek dengan field bernama bersifat tertutup (`additionalProperties: false`), setiap field yang selalu ditulis bentuk penyimpanan bersifat wajib, field yang dihilangkannya selama tidak berisi apa pun disebutkan tetapi tidak wajib, dan tidak ada field yang selalu dihilangkannya yang disebutkan. Karena itu, skema menolak nilai runtime. Skema juga menolak file yang disimpan sebelum `4.0.0`, dengan `meta`, lebar, `zIndex`, `ignoreSaveSettings`, dan seterusnya, hingga editor `4.0.0` atau yang lebih baru menyimpan file tersebut lagi. File yang disimpan oleh `3.2.0` atau yang lebih baru sudah menyebutkan URL skema ini, yang menunjuk ke cabang `main`, sehingga editor yang memvalidasi terhadapnya kini menandai file tersebut. File yang disimpan oleh `3.0.0` atau `3.1.0`, atau dokumen v2, tidak menyebutkan `$schema`.

Sejak `4.2.0`, skema tidak lagi mewajibkan field teks entitas, daftar `doc` mana pun, koleksi mana pun, atau `collections` itu sendiri, yang dihilangkan bentuk penyimpanan selama tidak berisi apa pun. Skema tetap menerima file yang disimpan oleh `4.0.0` atau `4.1.0`. Skema menyebutkan field baru: `nameViewMode`, yang hanya menerima `"logical"` dan `"both"`; `logicalName` tabel dan `nameDerived`-nya, yang hanya menerima `true`; `logicalName` dan `domainId` kolom; serta ketiga kamus, masing-masing dengan header dan baris string-nya. `canvasType` mencantumkan tab Kamus, `columnOrder` menerima tujuh atau sembilan bilangan bulat, dan deskripsi `show`, `columnOrder`, `lockSettings`, dan `options` menyebutkan bit barunya.

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
