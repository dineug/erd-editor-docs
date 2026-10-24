---
sidebar_position: 13
description: Menghasilkan kode untuk dua puluh dua target dari diagram, memilih bahasa, database, konvensi penamaan, dan tanda kutip di panel opsi, melihat target mana yang menulis tindakan ON DELETE dan ON UPDATE hubungan, serta menyimpan atau menyalin hasilnya.
---

# Generator Kode

Beralih ke tab `Code Generator` di bilah alat. Tab ini menampilkan kode untuk seluruh dokumen di sebelah kiri dan, di sebelah kanannya, panel opsi berjudul `Code Generator`, tempat Anda memilih bahasa, database, konvensi penamaan, dan, untuk beberapa target, tanda kutip.  
Panel terbuka dengan sendirinya kecuali jika editor lebih sempit dari 640 px saat tab pertama kali dibuka. `Hide options` di bagian atas panel menciutkannya, dan `Show options` di kanan atas kode menampilkannya kembali. Panel tetap terbuka atau terciut meskipun berpindah tab selama editor terbuka, secara terpisah dari panel tab Skema SQL, dan tidak pernah disimpan di file.

Klik kanan kode untuk membuka menu konteksnya: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (hanya untuk `Doctrine`, `JPA`, dan `SeaORM`), masing-masing dengan submenu yang mencentang nilai saat ini, lalu `Options panel`, yang menciutkan atau membuka panel dan dicentang selama panel ditampilkan, serta `Save file`.  
Selama tab ini terbuka, [Pencarian Cepat](./quick-search.md) menawarkan `Database`, `Bracket` (hanya untuk `Doctrine`, `JPA`, dan `SeaORM`), `Language`, `Table Name Case`, `Column Name Case`, dan `Code Generator: Options panel`, yang menciutkan atau membuka panel.

![Memilih TypeScript, lalu Rust, dari menu konteks kode, mengubah nama kolom menjadi Snake di panel opsi, dan menyalin kode](/img/demo-code-generator.webp)

Tampilan kode yang sama juga menjadi tab `Code Generator` di [Properti Tabel](./table-related-functions.md#table-properties), tempat tampilan tersebut menghasilkan kode untuk satu tabel itu saja, bukan untuk seluruh dokumen. Di sana tidak ada panel opsi, dan menu konteksnya mengubah pengaturan yang sama tetapi tidak memiliki `Options panel` maupun `Save file`.  
Jika kode untuk seluruh dokumen diawali dengan impor atau header, kode satu tabel diawali dengan impor atau header yang dibutuhkan tabel tersebut, seperti `<?php` untuk `PHP`, `import Foundation` untuk `Swift`, atau `$schema` untuk `JSON Schema`.

Kode ditulis saat tab dibuka, dan ditulis lagi setiap kali bahasa, database, salah satu konvensi penamaan, atau tanda kutip berubah. Perubahan yang dilakukan pada diagram selama tab terbuka, seperti perubahan dari kolaborator atau agen pemrograman, baru terlihat setelah Anda meninggalkan tab lalu kembali, atau setelah salah satu pengaturan tersebut berubah.

## Panel opsi {#options-panel}

Di bawah keterangan `Saved in the document`, panel mencantumkan `Language`, `Database`, `Table Name Case`, dan `Column Name Case`, diikuti `Bracket` selama bahasanya adalah `Doctrine`, `JPA`, atau `SeaORM`. Masing-masing berupa daftar tarik-turun, dan perubahan langsung menulis ulang kode.  
Saat bahasa yang dipilih mengabaikan `Database` atau konvensi penamaan, pengaturan tersebut tetap ada di panel, diredupkan, dengan catatan seperti `Not used by DBML` di bawahnya, dan tetap dapat diubah.  
`Save file` dan `Copy` berada di bagian bawah panel — lihat [Menyimpan atau menyalin hasil](#saving-or-copying-the-result).

Semua ini adalah pengaturan milik diagram itu sendiri, yang juga diubah oleh menu konteks dan Pencarian Cepat. `Database` disimpan di file seperti perubahan lainnya.  
`Language`, `Table Name Case`, `Column Name Case`, dan `Bracket` hanya disimpan selama penguncian masing-masing di tab Pengaturan nonaktif (`Bracket Type` untuk `Bracket`), dan diagram baru memiliki semua penguncian dalam keadaan aktif. Selama penguncian aktif, perubahan menulis ulang kode di layar Anda, tetapi file mempertahankan nilai terkunci dan diagram dibuka kembali dengan nilai tersebut. Panel tidak menampilkan tanda penguncian apa pun; untuk mempertahankan suatu pilihan di file, nonaktifkan penguncian pilihan tersebut — lihat [Penguncian](./settings.md#lock).

## Bahasa {#language}

Dua puluh dua target didukung, dicantumkan dalam tiga kelompok — bahasa, ORM, lalu skema — masing-masing dalam urutan abjad. Daftar di panel dan menu konteks menarik garis di antara kelompok tetapi tidak menamai satu pun di antaranya:

| Target | Kelompok | Hubungan | Indeks | ON DELETE / ON UPDATE | Disimpan sebagai |
| --- | --- | --- | --- | --- | --- |
| `C#` | Bahasa | — | — | — | `.cs` |
| `Go` | Bahasa | — | — | — | `.go` |
| `Java` | Bahasa | — | — | — | `.java` |
| `Kotlin` | Bahasa | — | — | — | `.kt` |
| `PHP` | Bahasa | — | — | — | `.php` |
| `Rust` | Bahasa | — | — | — | `.rs` |
| `Scala` | Bahasa | — | — | — | `.scala` |
| `Swift` | Bahasa | — | — | — | `.swift` |
| `TypeScript` | Bahasa | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Hanya ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Hanya unik | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Skema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Skema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Skema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Skema | — | — | — | `.json` |
| `Mermaid` | Skema | ✓ | — | — | `.mmd` |
| `Zod` | Skema | — | — | — | `.ts` |

Nilai defaultnya adalah `GraphQL`. Setiap target menghasilkan kolom; tanda ✓ menunjukkan apa lagi yang dihasilkannya.  
Tabel dihasilkan dalam urutan nama, bukan dalam urutan letaknya di kanvas, dan indeks yang digunakan adalah yang tercantum di bawah `Indexes` di [Properti Tabel](./table-related-functions.md#indexes), bukan baris `Keys` di atasnya. `SeaORM` hanya menulis indeks unik, dan `Mermaid` menandai kolom unik dengan `UK` tetapi tidak menulis indeks apa pun.  
Setiap target kecuali `Java`, `AML`, `DBML`, dan `Mermaid` menulis kolom kunci utama sebagai tidak boleh NULL, baik `Not Null` diatur padanya maupun tidak. `Java` tidak menandai kolom mana pun sebagai boleh NULL atau tidak, dan `AML`, `DBML`, serta `Mermaid` mempertahankan penanda tersebut sebagaimana adanya di diagram.

Yang ditulis oleh beberapa target:

- `PHP`: kelas biasa berisi properti publik bertipe, diawali dengan `<?php` dan `declare(strict_types=1);`.
- `Doctrine`: entitas Doctrine ORM 3 dengan atribut, untuk DBAL 4.2 atau yang lebih baru, setiap kolom dengan tipe DBAL dan opsinya untuk database yang dipilih.
- `Rust`: satu `pub struct` per tabel, dengan tipe yang ditulis menggunakan path lengkap, seperti `chrono::NaiveDateTime` atau `rust_decimal::Decimal`, tanpa baris `use`.
- `SeaORM`: entitas SeaORM 2.0 dalam format dense, setiap tabel berupa `pub mod`, sehingga seluruh teks dapat dikompilasi sebagai satu file.
- `Swift`: satu struct `Codable`, `Hashable`, `Sendable` per tabel, yang memerlukan Swift 6.1 atau yang lebih baru.
- `TypeScript`: satu `export interface` per tabel yang mendeskripsikan baris sebagai JSON, seperti yang dilakukan skema `Zod` — tanggal atau waktu berupa `string`, dan kolom yang boleh NULL berupa `T | null`.
- `Zod`: satu skema baris Zod 4 per tabel beserta tipe yang diinferensikannya, tanpa skema insert dan tanpa hubungan.
- `JSON Schema`: satu dokumen JSON Schema draft 2020-12, dengan satu skema baris per tabel di bawah `$defs`.
- `Mermaid`: sebuah `erDiagram`, jenis yang dirender GitHub, dengan setiap tabel berupa entitas yang mencantumkan setiap kolom beserta tipenya dan tanda `PK`, `FK`, atau `UK` yang dimilikinya, serta setiap hubungan berupa garis di antara kedua tabelnya.

`AML`, `DBML`, dan `GraphQL` adalah format dua arah: masing-masing juga merupakan sumber impor. Lihat [Mengimpor atau mengekspor file](./file-import-export.md). Skema lainnya, `JSON Schema`, `Mermaid`, dan `Zod`, hanya berupa keluaran.  
`DBML` menulis warna setiap tabel sebagai `headercolor` dan, dalam kode untuk seluruh dokumen, satu blok `TableGroup` setelah `Ref` untuk setiap [grup tabel](./table-groups.md) yang memuat tabel. `AML` menulis warna tabel sebagai nama warna AML yang paling mendekati.

## ON DELETE dan ON UPDATE {#on-delete-and-on-update}

Tindakan ON DELETE dan ON UPDATE hubungan diatur dari menu konteksnya — lihat [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Target dengan ✓ di kolom `ON DELETE / ON UPDATE` pada tabel [Bahasa](#language) menulis tindakan yang diatur hubungan; tindakan yang dibiarkan `Not set` tidak menulis apa pun.  
Tindakan mana yang dipertahankan target ORM bergantung pada database yang dipilih, sedangkan `AML` dan `DBML` mempertahankan semuanya — lihat [Database](#database).

- `Doctrine` hanya menulis ON DELETE, karena Doctrine tidak memiliki ON UPDATE. Target ini menambahkan `onDelete: 'CASCADE'` ke setiap `#[ORM\JoinColumn]` pada `ManyToOne` atau `OneToOne` di sisi pemilik, seperti `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, dan tidak menambahkan apa pun pada `OneToMany` atau `OneToOne` di sisi invers. Hubungan ke kolom unik yang bukan kunci utama tetap berupa kolom biasa, yang dipetakan Doctrine tanpa asosiasi, sehingga tidak ada tindakan yang ditulis.
- `Drizzle` menulisnya dalam huruf kecil. Pada `.references()`, tindakan tersebut berupa opsi, seperti `{ onDelete: "cascade", onUpdate: "set null" }`; pada `foreignKey()`, yang digunakan untuk kunci multikolom, tindakan tersebut dirangkai, seperti `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` menulisnya pada hubungan `belongs_to` milik tabel anak, dengan ON UPDATE lebih dulu, menggunakan nama SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault`, dan `Restrict`, seperti `on_update = "Cascade", on_delete = "SetNull"`. `has_one` atau `has_many` milik tabel induk tidak mendapatkan satu pun.
- `Sequelize` menulis entri `onDelete: "CASCADE"` dan `onUpdate` ke dalam kedua panggilan asosiasi: `hasMany` atau `hasOne`, dan `belongsTo`. Kunci multikolom tidak mendapatkan panggilan asosiasi, sehingga `Sequelize` tidak menulis tindakan apa pun untuknya.
- `SQLAlchemy` meneruskan argumen `ondelete="CASCADE"` dan `onupdate` ke `ForeignKey()` untuk kunci satu kolom, dan ke `ForeignKeyConstraint()` untuk kunci multikolom.
- `TypeORM` menulis opsi `onDelete: "CASCADE"` dan `onUpdate` pada `@ManyToOne` atau `@OneToOne` di sisi pemilik, tidak pernah di sisi invers. Target ini selalu menghilangkan `SET DEFAULT`, karena TypeORM akan menuliskannya sebagai `DEFAULT`, yang tidak diterima database mana pun.
- `DBML` menambahkan pengaturan ke `Ref`, seperti `[delete: set null, update: no action]`.
- `AML` menulis hubungan yang memiliki tindakan sebagai pernyataan `rel` tersendiri dengan properti, seperti `{onDelete: cascade, onUpdate: "set null"}`, alih-alih secara inline pada kolomnya.

`JPA` tidak menulis satu pun: JPA biasa tidak memiliki opsi untuk tindakan tersebut, dan generator tidak menggunakan `@OnDelete` milik Hibernate. `Mermaid` juga tidak menulis satu pun, karena garis `erDiagram` tidak memiliki tempat untuknya.  
Di tab `Code Generator` pada Properti Tabel, yang menampilkan satu tabel, `DBML` tidak menulis `Ref` dan `AML` tidak menulis pernyataan `rel`, sehingga keduanya tidak menampilkan tindakan di sana; `AML` mempertahankan hubungan satu kolom yang memiliki tindakan secara inline pada kolomnya, sama seperti hubungan tanpa tindakan. `Mermaid` sama sekali tidak menulis garis hubungan di sana. `Doctrine` dan `SeaORM` menulis entitas yang sama di sana seperti dalam seluruh dokumen, termasuk tindakannya.

## Konvensi penamaan {#name-case}

`Table Name Case` dan `Column Name Case` masing-masing mendukung `Pascal`, `Camel`, `Snake`, dan `None`.  
Nilai defaultnya adalah `Pascal` untuk nama tabel dan `Camel` untuk nama kolom. `None` menghasilkan nama sebagaimana tertulis di diagram.  
Pada setiap konvensi, nama yang dicadangkan oleh bahasa target di-escape jika bahasa tersebut dapat meng-escape-nya, seperti `@class` di `C#` atau `r#type` di `Rust`, dan diganti namanya jika tidak dapat, seperti `class_` di `Java`.

`AML`, `DBML`, dan `Mermaid` mengabaikan kedua pengaturan tersebut dan selalu menghasilkan nama dari diagram.  
`SeaORM` juga mengabaikannya: target ini menamai field dan modul dalam snake case, bentuk yang dibaca kembali oleh SeaORM, dan menuliskan nama yang disimpan di `table_name` dan, jika berbeda, di `column_name`.  
Untuk keempat target ini, panel meredupkan kedua daftar, dengan catatan `Not used by` di bawahnya.

Setiap target menulis nama fisik, apa pun yang ditampilkan [Tampilan Nama](./logical-names.md#name-view).  
Tidak ada target yang menulis nama logis, bahkan ke dalam komentar kosong: tab ini tidak memiliki padanan untuk [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) di tab Skema SQL.  
Tidak ada pula target yang menulis domain: kolom yang tertaut ke domain ditulis dengan tipe datanya, seperti kolom lainnya.

## Database {#database}

Tipe data ditentukan berdasarkan database yang dipilih — lihat [Database](./table-related-functions.md#databases).  
Pilih database di tab ini dari daftar `Database` di panel, `Database` di menu konteks, atau Pencarian Cepat, dan kode langsung ditulis ulang. Ini adalah satu-satunya pengaturan database milik diagram, pengaturan yang sama yang diatur oleh menu konteks kanvas dan tab [Skema SQL](./schema-sql.md), sehingga perubahan di sini juga terlihat di sana.  
`Drizzle` mengambil dialeknya dari pengaturan yang sama: `pgTable` untuk PostgreSQL, `mysqlTable` untuk MySQL dan MariaDB, `sqliteTable` untuk SQLite, dan `pgTable` untuk setiap database lainnya.  
`SeaORM` menulis `column_type` jika tanpanya SeaORM akan membuat tipe kolom yang berbeda pada PostgreSQL, MySQL, MariaDB, atau SQLite, dan tidak menulis satu pun pada MSSQL, Oracle, Snowflake, atau Databricks, yang tidak memiliki backend di SeaORM.

Database yang dipilih juga menentukan tindakan ON DELETE dan ON UPDATE mana yang ditulis target ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy`, dan `TypeORM` menghilangkan setiap tindakan yang dihilangkan Skema SQL untuk database tersebut, seperti `SET DEFAULT` pada MySQL dan MariaDB, `RESTRICT` pada MSSQL, atau setiap tindakan selain `NO ACTION` pada Snowflake dan Databricks, sehingga perilaku default database yang berlaku. Daftar lengkapnya ada di [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` justru mengikuti dialek yang ditulisnya: kode `mysqlTable` menghilangkan `SET DEFAULT`, sedangkan kode `pgTable` dan `sqliteTable` mempertahankan setiap tindakan, termasuk kode `pgTable` yang ditulisnya untuk MSSQL, Oracle, Snowflake, dan Databricks.

`AML`, `DBML`, dan `Mermaid` adalah pengecualian: ketiganya menghasilkan setiap tipe data sebagaimana tertulis di diagram, sehingga pengaturan database tidak mengubah keluarannya, dan panel meredupkan `Database` untuk ketiganya. `AML` dan `DBML` menulis setiap tindakan yang diatur hubungan, dan `Mermaid` tidak menulis satu pun.

## Tanda kutip {#bracket}

`Bracket` hanya ditawarkan di panel, menu konteks, dan Pencarian Cepat selama bahasanya adalah `Doctrine`, `JPA`, atau `SeaORM`.  
Pengaturan ini sama dengan tanda kutip di tab Skema SQL — lihat [Skema SQL](./schema-sql.md#database-and-bracket) — sehingga perubahan di sini juga mengubah cara Skema SQL mengapit nama dengan tanda kutip. Pengaturan ini menawarkan `SingleQuote`, `DoubleQuote`, `Backtick`, dan `None`, serta dimulai pada `None`.

- `Doctrine`: pada tanda kutip apa pun selain `None`, setiap nama tabel, kolom, dan kolom join diapit backtick, yang merupakan cara Doctrine menandai nama yang perlu dikutip, seperti ``#[ORM\Table(name: '`order`')]``. Pada `None`, hanya nama yang memerlukannya yang diapit: kata yang dicadangkan database, nama yang bukan pengenal ASCII biasa, atau nama yang diketik di dalam tanda kutip.
- `JPA`: pada tanda kutip apa pun selain `None`, nama tabel yang merupakan kata yang dicadangkan diapit tanda kutip di dalam `@Table`, seperti `@Table(name = "\"user\"")`. Pada `None`, nama tersebut dibiarkan tanpa tanda kutip, seperti yang dilakukan Skema SQL.
- `SeaORM`: pada `None`, nama ditulis sebagaimana database menyimpannya: nama tabel bertitik dipecah menjadi `schema_name` dan `table_name`, dan pada PostgreSQL nama tanpa tanda kutip diubah menjadi huruf kecil. Pada tanda kutip lainnya, nama dipertahankan utuh, sebagaimana tertulis.

## Menyimpan atau menyalin hasil {#saving-or-copying-the-result}

`Save file`, di bagian bawah panel opsi atau di menu konteks, menyimpan kode yang ditampilkan sebagai file.  
File tersebut dinamai seperti setiap ekspor, `<database name>-<timestamp>`, diikuti ekstensi dalam tabel [Bahasa](#language), seperti `shop-2026-10-12T04_05_06.ts`, dan disimpan di tempat yang sama dengan setiap ekspor di host Anda — lihat [Mengekspor](./file-import-export.md#exporting). `Java` dan `JPA` menempatkan setiap kelas dalam satu file `.java`, sebagaimana tab menampilkannya.  
Menu Ekspor tidak memiliki item Generator Kode, dan tab `Code Generator` di Properti Tabel tidak dapat menyimpan file.

Untuk menyalin kode, klik `Copy` di bagian bawah panel, atau arahkan penunjuk ke kode lalu klik tombol salin di kanan atasnya, satu-satunya cara di Properti Tabel.  
Notifikasi `Copied!` dengan tanda centang mengonfirmasinya selama dua detik. Jika browser atau host menolak akses ke papan klip, notifikasi `Couldn't copy to the clipboard` dengan tanda peringatan memberitahukannya sebagai gantinya, selama lima detik. Menyalin lagi menggantikan notifikasi tersebut alih-alih menambahkan notifikasi lain.  
Teks juga dapat dipilih, sehingga Anda dapat mengambil hanya bagian yang dibutuhkan.
