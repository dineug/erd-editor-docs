---
sidebar_position: 4
description: Semua alat yang disediakan server MCP erd-editor — membaca dokumen halaman demi halaman, pemeriksaan kamus, 67 alat edit, erd_batch, serta bentuk hasil dan penolakan.
---

# Alat

Server menyediakan 77 alat: lima alat sesi, empat alat baca, 67 alat edit, satu untuk setiap operasi pengeditan, dan `erd_batch`, yang menjalankan beberapa alat edit sebagai satu perubahan.

Setiap alat kecuali `erd_list_documents` menerima `path` dokumen sebagai argumen pertamanya, dan tabel di bawah tidak mencantumkannya.
Argumen yang ditandai `?` bersifat opsional.

## Alat sesi {#session-tools}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_list_documents` | | Mencantumkan dokumen ERD beserta `path`, `open`, `active`, `dirty`, dan `readonly`: dokumen milik editor yang melayani direktori kerja, yang di IDE JetBrains mencakup setiap proyek yang terbuka, atau jika tidak ada, file ERD di dalam direktori kerja. |
| `erd_open_document` | `create?` | Membuka dokumen untuk diedit, di ERD Editor milik editor yang melayaninya, jika ada. Dengan `create`, alat ini membuat file terlebih dahulu jika file belum ada, dan nama tanpa ekstensi mendapat `.erd.json`. |
| `erd_save` | | Menyimpan dokumen yang dipegang editor. VS Code membiarkan perubahan agen tidak tersimpan hingga alat ini dipanggil; Obsidian dan IDE JetBrains menyimpannya seperti menyimpan perubahan Anda, dan alat ini langsung menuliskannya. Dalam mode headless, setiap perubahan sudah ditulis, seperti yang dinyatakan `saved: true` di hasilnya, dan alat ini tidak melakukan apa pun. |
| `erd_undo` | | Mengembalikan perubahan terakhir yang dibuat agen ini, dan tidak pernah mengembalikan perubahan Anda. Panggilan yang tidak membuat entri pembatalan dilewati dan disebutkan namanya. |
| `erd_redo` | | Menerapkan kembali perubahan yang terakhir dikembalikan `erd_undo`. |

Lihat [Live dan headless](./live-and-headless.md) untuk mengetahui apa yang dilakukan penyimpanan dan pembatalan di setiap mode.

## Membaca dokumen {#reading-a-document}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Pengaturan dan jumlah, lalu satu halaman tabel beserta indeks dan hubungannya, setiap tabel dengan id, posisi dan ukurannya di kanvas, jumlah kolom, nama logisnya jika ada, serta grup tabelnya jika tabel berada dalam grup. Kecuali saat melakukan pencarian, grup tabel, memo, lalu domain, istilah, dan kata menyusul setelah tabel. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Entitas yang disebutkan, secara lengkap: tabel beserta kolom dan grup tabelnya, hubungan beserta kolomnya serta `onDelete` dan `onUpdate`, indeks beserta kolomnya, memo beserta teksnya, grup tabel beserta tabelnya, serta kata, istilah, dan domain beserta setiap field-nya. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Seluruh dokumen sekaligus dalam salah satu dari empat format, atau DDL dari beberapa tabel atau grup tabel saja. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Apa yang ditemukan salah oleh kamus kata, istilah, dan domain, seperti yang dicantumkan lembar `Checks` di tab Kamus editor, halaman demi halaman. Alat ini tidak mengubah apa pun — lihat [Pemeriksaan kamus](#dictionary-checks). |

Agen menemukan id dengan `erd_list`, membaca kolom, baris kamus, dan detail lainnya dengan `erd_get`, lalu meneruskan id tersebut ke alat edit.
Ukuran tabel di `erd_list` adalah kotak yang ditempatinya di kanvas: tingginya tepat, lebarnya perkiraan.
Grup tabel dicantumkan menurut persegi panjang yang disimpannya, beserta nama, warna, dan jumlah tabel yang dimuatnya.
Setiap hubungan dicantumkan sekali, bersama salah satu dari kedua tabelnya.
Baris kamus dicantumkan menurut id-nya, `name`-nya, dan apa yang diberikannya kepada nama fisik atau kolom: `dataType` milik domain, `physicalName` dan `domainId` milik istilah, serta `abbreviation` milik kata. Setiap kamus mencantumkan barisnya dalam urutan yang ditampilkan lembarnya.
Pengaturan yang dilaporkan `erd_list` dan `erd_read` adalah pengaturan yang disimpan file — lihat [Pengaturan](#settings).

Di `erd_get` dan format `snapshot` dari `erd_read`, setiap tabel dan kolom membawa `logicalName`-nya, berupa string kosong jika tidak ada, dan `nameDerived`, yang bernilai `true` selama namanya diberikan oleh kamus, sehingga nama logis baru menghasilkannya lagi — lihat [Kamus](#dictionaries).
Setiap kolom membawa `domainId`-nya, begitu pula setiap istilah: string kosong jika tidak ada, atau jika domainnya tidak lagi dicantumkan dokumen.

`erd_read` menerima salah satu dari empat format:

| `format` | Isi jawaban |
| --- | --- |
| `snapshot` | JSON ringkas berisi setiap entitas beserta id-nya, termasuk grup tabel dan baris kata, istilah, dan domain, serta pengaturan beserta skrip Skema SQL. Format ini tidak menyertakan hal yang berbeda dari satu penampil ke penampil lain: lebar terukur, urutan tumpukan, area pandang, tab, dan Tampilan Nama. Ukurannya besar pada skema yang besar. |
| `sql` | DDL untuk salah satu dari delapan database, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake`, atau `SQLite`. `vendor` secara default adalah database yang diatur pada dokumen. DDL seluruh dokumen menyertakan skrip sebelum dan setelah tabel milik dokumen tersebut. Dengan `tableIds`, `tableNames`, atau `groupNames`, hanya tabel tersebut, beserta kunci asing yang dimilikinya, dan tanpa skrip. Kunci asing menyertakan tindakan ON DELETE dan ON UPDATE masing-masing, kecuali tindakan yang dihilangkan oleh database target — lihat [ON DELETE dan ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Seluruh dokumen persis seperti yang ditulis ke file saat disimpan, termasuk perubahan yang belum disimpan editor — lihat [Bentuk penyimpanan dan nilai runtime](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Hanya skrip sebelum dan setelah tabel milik dokumen, sebagai `{"before":"…","after":"…"}`, masing-masing kosong jika belum diatur, sebesar apa pun skemanya. |

Hanya format `sql` yang menerima `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames`, dan `groupNames`, dan format lain menolaknya.

- `statements`: `create`, nilai default; `ifNotExists`, yang menulis `CREATE TABLE IF NOT EXISTS` di MySQL, MariaDB, PostgreSQL, SQLite, dan Databricks serta `CREATE TABLE` biasa di database lainnya; atau `recreate`, yang menghapus tabel sebelum membuatnya, sedangkan Snowflake menulis `CREATE OR REPLACE TABLE` sebagai gantinya.
- `header`: `none`, nilai default; `use`, yang memilih database atau skema yang ditunjuk oleh nama database dokumen; atau `createAndUse`, yang membuatnya terlebih dahulu. Oracle hanya memiliki `use`, sehingga `createAndUse` menulis `use` di sana, dan PostgreSQL hanya memiliki `createAndUse`, sehingga `use` tidak menulis pembuka di sana. SQLite tidak menulis pembuka, dan tidak ada database yang menulisnya selama nama database kosong atau bukan pengenal biasa.
- `logicalNameAsComment`: `true` menulis nama logis tabel atau kolom sebagai komentarnya selama komentar itu kosong atau hanya berisi karakter kosong, di tempat dan dalam bentuk yang digunakan setiap database untuk menulis komentar, dan mempertahankan setiap komentar yang berisi teks; `false`, nilai default, tidak menulis nama logis — lihat [Nama logis sebagai komentar](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: tabel dari grup tabel yang disebutkan, berdasarkan nama tanpa membedakan huruf besar dan kecil, digabungkan dengan `tableIds` dan `tableNames`. Nama yang tidak cocok dengan grup mana pun ditolak dengan `notFound`. Grup yang tidak memuat tabel tidak menambahkan apa pun, dan pembacaan yang tidak menyisakan tabel sama sekali, seperti saat setiap grup yang disebutkan kosong dan tidak ada tabel yang disebutkan, ditolak dengan `invalidArgs`.

`statements`, `header`, dan `logicalNameAsComment` juga berlaku untuk DDL beberapa tabel. Ketiganya bekerja seperti opsi `Statements` dan `Header` serta sakelar `Write logical names into empty comments` di tab [Skema SQL](../guide/guides/schema-sql.md#options-panel) editor, meskipun nilai awal di tab tersebut adalah `If not exists` dan `CREATE + USE`. Sakelar itu awalnya nonaktif, seperti `logicalNameAsComment`.
Nama diapit dengan tipe tanda kutip yang disimpan file, yakni tipe yang terkunci selama `Bracket Type` terkunci — lihat [Penguncian](../guide/guides/settings.md#lock).

### Skema besar {#large-schemas}

Skema dengan ratusan atau ribuan tabel juga dapat ditangani.
Satu pembacaan menjawab paling banyak 40.000 karakter, di bawah batas yang membuat Claude Code menyimpan hasil alat secara terpisah dalam file.

- `erd_list` menjawab satu halaman berisi 100 item secara default, tabel terlebih dahulu, lalu grup tabel, memo, domain, istilah, dan kata, dengan satu offset yang berlaku untuk semuanya, dan memberi tahu awal halaman berikutnya dengan `nextOffset` dan `note`. Berikan `nextOffset` tersebut sebagai `offset`, dengan `query` yang sama.
- `query` menemukan tabel berdasarkan kata dalam nama, nama logis, atau komentar tabel atau kolom, tanpa membedakan huruf besar dan kecil. Tabel yang nama atau nama logisnya memuat lebih banyak kata tersebut muncul lebih dulu. Pencarian tidak mencantumkan grup tabel, memo, atau baris kamus.
- `namesOnly` hanya mencantumkan nama tabel, sekitar 2.000 nama pendek dalam satu jawaban.
- `erd_get` dan `erd_read` menerima `tableNames` selain id, dan `erd_read` menerima `groupNames`, sehingga agen yang diminta membuat kueri SQL pada skema besar hanya membaca DDL tabel yang dibutuhkannya.
- Kamus juga diberikan per bagian: `erd_list` menelusuri barisnya halaman demi halaman setelah tabel, dan `erd_get` memberikan baris secara lengkap menurut `domainIds`, `termIds`, dan `wordIds`.
- `erd_get` mencantumkan id dan nama yang tidak merujuk ke apa pun di bawah `missing`, serta id yang tidak muat dalam satu jawaban di bawah `notReturned`, untuk diminta lagi.
- `erd_list_checks` menjawab halaman demi halaman dengan cara yang sama — lihat [Pemeriksaan kamus](#dictionary-checks).
- Pembacaan yang terlalu besar untuk satu jawaban ditolak dengan `tooLarge`, beserta cara mempersempitnya.

### Pemeriksaan kamus {#dictionary-checks}

`erd_list_checks` mencantumkan pemeriksaan dari [lembar Pemeriksaan](../guide/guides/dictionary.md#the-checks-sheet) editor, dalam urutan yang sama: pemeriksaan kata terlebih dahulu, lalu pemeriksaan istilah dan domain, setiap kamus dalam urutan yang ditampilkan lembarnya, lalu setiap tabel diikuti kolom-kolomnya.
Seperti di lembar itu, pemeriksaan hanya berjalan selama kamus yang dibacanya memuat baris. Dokumen yang kamusnya tidak memuat kata, istilah, atau domain sama sekali tidak diperiksa: `total` bernilai `0`, dan `note` menyatakan hal itu.

- `level`: `error` atau `warning` untuk tingkat itu saja; keduanya secara default.
- `tableIds` dan `tableNames`: hanya pemeriksaan tabel tersebut dan kolomnya, dengan nama tanpa membedakan huruf besar dan kecil, sehingga baris milik kamus itu sendiri tidak disertakan. Id atau nama yang tidak merujuk ke tabel mana pun ditolak dengan `notFound`.
- `offset` dan `limit`: satu halaman berisi 100 pemeriksaan secara default, yang juga berhenti saat satu jawaban sudah penuh. Selama masih ada yang menyusul, `nextOffset` dan `note` memberi tahu awal halaman berikutnya; berikan nilai itu sebagai `offset` dengan filter yang sama. Setelah memperbaiki beberapa pemeriksaan, cantumkan lagi dari offset `0`: pemeriksaan yang telah diperbaiki keluar dari daftar, sehingga offset berikutnya akan melewati pemeriksaan yang belum diperbaiki.

Jawaban memuat `total`, jumlah pemeriksaan yang dipertahankan filter; `counts`, jumlah pemeriksaan tersebut untuk setiap kode, tanpa menyertakan kode yang tidak memilikinya; dan halaman itu sebagai `checks`.
Setiap pemeriksaan memberikan `level`, `code`, serta `kind` dan `id` sasarannya: `table`, `column`, `word`, `term`, atau `domain`. Pemeriksaan kolom menambahkan `tableId` miliknya dan nama tabelnya sebagai `table`.
`name` adalah nama sasaran, yaitu nama fisik tabel atau kolom, beserta `logicalName`-nya jika ada. `field` adalah apa yang dibaca pemeriksaan: `name`, `logicalName`, atau `domainId`. `text` adalah apa yang ditemukannya di sana, dan `suggestions`, jika kamus menawarkannya, adalah apa yang sebaiknya digunakan sebagai gantinya. Jadi, agen dapat memperbaiki pemeriksaan tanpa `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` di lembar | Yang ditemukan |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Nama yang sama-sama dimiliki dua baris dalam satu kamus. Setiap baris tersebut dicantumkan. |
| `unknownDomain` | `error` | `Unknown domain` | Kolom atau istilah yang tertaut ke domain yang tidak lagi dicantumkan dokumen. `text` adalah nama domain itu, atau id-nya jika namanya tidak diketahui. |
| `forbiddenWord` | `error` | `Forbidden word` | Kata yang dicantumkan suatu kata sebagai terlarang, dalam nama logis tabel atau kolom atau dalam nama istilah. `suggestions` adalah kata standarnya. |
| `unregisteredWord` | `warning` | `Unregistered word` | Teks yang tidak dicantumkan kata mana pun, di tempat yang sama. |
| `synonymWord` | `warning` | `Synonym` | Sinonim yang dipakai untuk kata standar, di tempat yang sama. `suggestions` adalah kata standarnya. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Nama fisik tabel atau kolom yang berbeda dari nama yang diberikan istilah dari nama logisnya. Sarannya adalah nama fisik istilah tersebut, atau nama yang disusun kata-katanya selama istilah itu tidak memuat nama fisik. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Kolom yang tipe datanya bukan tipe data domain yang tertaut dengannya. `text` adalah tipe kolom, dan sarannya tipe domain. |

Cara setiap pemeriksaan membaca nama dijelaskan di [Apa yang ditemukan setiap pemeriksaan](../guide/guides/dictionary.md#what-each-check-finds).

## Alat edit {#edit-tools}

Id berasal dari `erd_list` dan `erd_get`, atau dari `createdIds` milik panggilan yang membuat entitas tersebut.
Id baru terdiri dari 25 huruf kecil dan angka, seperti `03h17be2plxpj5n59tqag7ogj`, sedangkan id yang sudah ada di dokumen mempertahankan bentuknya, jadi jangan menyimpulkan apa pun dari bentuk id.
`x` dan `y` adalah tepi kiri dan atas di kanvas, dalam piksel, dan warna adalah warna heksadesimal CSS seperti `#3b82f6`, atau string kosong, yang menghapus warna.

### Tabel {#tables}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_table` | | Menambahkan tabel kosong di posisi yang masih bebas dan mengembalikan id-nya di `createdIds`. |
| `erd_remove_table` | `tableId` | Menghapus tabel beserta kolom, indeks, dan setiap hubungan yang terhubung dengannya. |
| `erd_change_table_name` | `tableId`, `value` | Mengganti nama tabel. Nama itu kemudian dianggap ditulis secara manual, sehingga nama logis berikutnya membiarkannya apa adanya selama nama itu tidak kosong — lihat [Kamus](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Mengatur komentar tabel. String kosong menghapusnya. |
| `erd_set_table_logical_name` | `tableId`, `value` | Mengatur nama logis tabel. String kosong menghapusnya dan membiarkan namanya. Selama nama tabel kosong atau merupakan nama yang dihasilkan, kamus menghasilkannya dari nama logis — lihat [Kamus](#dictionaries). Istilah tidak memberi tabel domain apa pun. |
| `erd_change_table_color` | `tableId`, `color` | Mengatur warna tabel. |
| `erd_move_table` | `tableId`, `x`, `y` | Memindahkan tabel ke suatu posisi di kanvas. |
| `erd_move_tables` | `positions` | Memindahkan beberapa tabel dalam satu perubahan, yang dapat dikembalikan dengan satu `erd_undo`. `positions` memuat `{ tableId, x, y }` per tabel, setiap tabel paling banyak sekali. |
| `erd_sort_tables` | | Menempatkan setiap tabel dalam beberapa baris di kanvas, dimulai dari tabel dengan kolom paling sedikit, seperti cara `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, dan `erd_import_aml` menempatkannya. Tabel dalam satu grup tabel tetap berdekatan, dan kotak setiap grup disesuaikan di sekeliling tabelnya. |

### Kolom {#columns}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Menambahkan kolom kosong ke tabel dan mengembalikan id-nya di `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Menghapus kolom dari satu tabel, beserta hubungan dan entri indeks yang menggunakannya. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Mengganti nama kolom. Nama itu kemudian dianggap ditulis secara manual, seperti nama tabel. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Mengatur tipe data, seperti `INT` atau `VARCHAR(255)`. Selama [Sinkronisasi tipe data hubungan](../guide/guides/settings.md#relationship-datatype-sync) aktif, perubahan mengikuti hubungan ke dua arah, seperti di editor: tipe serial sampai ke kunci asing sebagai tipe integer yang disimpannya, seperti cara `erd_add_relationship` menyalinnya, dan kunci serial mempertahankan tipenya saat salah satu kunci asingnya berubah, sehingga perubahan berhenti di sana. Penggunalah yang mengaktifkan atau menonaktifkan sinkronisasi ini, dan `erd_list` melaporkannya sebagai `relationshipDataTypeSync`. Kolom yang tertaut ke domain dilepas tautannya saat diatur ke tipe selain tipe domain itu, begitu pula setiap kolom yang dicapai sinkronisasi yang tipe barunya berbeda dari tipe domainnya sendiri — lihat [Melepas tautan](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Mengatur nilai default, sebagai teks SQL. String kosong menghapusnya. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Mengatur komentar. String kosong menghapusnya. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Mengatur nama logis kolom. String kosong menghapusnya dan membiarkan namanya. Selama nama kolom kosong atau merupakan nama yang dihasilkan, kamus menghasilkannya, dan domain milik istilah ditautkan ke kolom serta memberinya tipe data domain tersebut — lihat [Kamus](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Menautkan kolom ke domain, yang diberikan menurut id atau menurut nama, salah satu dari keduanya. Kolom mengambil tipe data domain, yang mengikuti hubungan selama Sinkronisasi tipe data hubungan aktif, dengan pelepasan tautan yang sama seperti `erd_change_column_data_type`. `domainId` berupa `null` atau string kosong, atau `domainName` kosong, melepas tautan kolom dan mempertahankan tipenya. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` menjadikan kolom bagian dari kunci utama, `false` mengeluarkannya. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Mengatur apakah kolom bersifat unik. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Mengatur apakah kolom bersifat `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Mengatur apakah kolom menggunakan kenaikan otomatis. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Memindahkan kolom di dalam tabelnya ke posisi kolom lain. |

### Hubungan {#relationships}

`relationshipType` adalah kardinalitas di ujung anak: `ZeroOne`, `ZeroN`, `OneOnly`, atau `OneN`.
Tabel awal adalah induk, yaitu sisi yang dirujuk dan memiliki kunci utama, dan tabel akhir adalah anak.
`onDelete` dan `onUpdate` adalah tindakan ON DELETE dan ON UPDATE milik kunci asing: `none`, `noAction`, `cascade`, `setNull`, `setDefault`, atau `restrict`.
`none` tidak menulis klausa, sehingga perilaku default database yang berlaku — lihat [ON DELETE dan ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Tindakan yang tidak diberikan pada `erd_add_relationship` atau `erd_link_columns` bernilai `none`.

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Menghubungkan dua tabel. Alat ini menyalin kunci utama induk ke anak sebagai kolom kunci asing, dengan membuat kolom kunci utama terlebih dahulu jika induk tidak memilikinya. Setiap kolom kunci asing diberi nama dengan cara yang sama seperti saat menggambar hubungan di editor: kunci `id` milik `users` menghasilkan `users_id`, dan kunci seperti `member_id` mempertahankan namanya — lihat [Nama kolom kunci asing](../guide/guides/relationship-editing.md#foreign-key-column-names). Setiap kolom menyalin tipe data kuncinya, kecuali bahwa kunci serial menghasilkan tipe integer yang disimpannya, seperti `integer` untuk `serial4`, dan `serial` polos tetap `serial` di luar PostgreSQL, MySQL, dan MariaDB — lihat [Hubungan pengidentifikasi](../guide/guides/relationship-editing.md#identifying-relationships). Setiap kolom juga mengambil nama logis kuncinya, dan ditautkan ke domain yang tertaut ke kuncinya kecuali jika kunci serial memberinya tipe lain. `createdIds` memuat kolom kunci baru tersebut jika dibuat, kolom kunci asing, dan id hubungan di urutan terakhir. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Menggambar hubungan di antara kolom yang sudah ada, dengan memasangkan kolom awal dan kolom akhir menurut posisinya. Alat ini tidak mengganti nama kolom apa pun, tidak mengubah tipe data apa pun, dan tidak menyalin nama logis maupun domain. |
| `erd_remove_relationship` | `relationshipId` | Menghapus garis hubungan. Kolom kunci asingnya tetap ada di tabel. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Mengubah kardinalitas hubungan. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Mengatur tindakan ON DELETE suatu hubungan: apa yang terjadi pada baris anak saat baris induknya dihapus. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Mengatur tindakan ON UPDATE suatu hubungan: apa yang terjadi pada baris anak saat kunci induknya diubah. |

`erd_add_relationship` memberi nama kolom kunci asing dan menyalin nama logis kuncinya saat dijalankan. Penggantian nama atau nama logis yang kemudian diberikan pada kunci tidak sampai ke kolom tersebut, jadi beri nama tabel induk dan kunci utamanya, dan beri kunci itu nama logisnya, terlebih dahulu.
Nama yang diberikannya dianggap ditulis secara manual, sehingga nama logis berikutnya membiarkannya apa adanya, sedangkan `erd_derive_physical_names` mengembalikannya ke kamus — lihat [Kamus](#dictionaries).

Tidak ada alat yang mengubah kolom hubungan yang sudah ada seperti yang dilakukan [Petakan Kolom](../guide/guides/relationship-editing.md#map-columns) di editor.
Untuk memetakan hubungan ke kolom lain, jalankan `erd_remove_relationship`, yang membiarkan kolom kunci asingnya tetap di tabel, dan `erd_link_columns` dengan kolom yang diinginkan, dalam satu `erd_batch`, yang dapat dikembalikan dengan satu `erd_undo`.

### Indeks {#indexes}

Id kolom indeks adalah entri dalam daftar kolom indeks yang diberikan `erd_get`, bukan id kolom tabel.

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Menambahkan indeks kosong ke tabel dan mengembalikan id-nya di `createdIds`. |
| `erd_remove_index` | `indexId` | Menghapus indeks. |
| `erd_change_index_name` | `indexId`, `value` | Mengganti nama indeks. |
| `erd_set_index_unique` | `indexId`, `value` | Mengatur apakah indeks bersifat unik. |
| `erd_add_index_column` | `indexId`, `columnId` | Menambahkan kolom dari tabel milik indeks dan mengembalikan id kolom indeks yang baru. Kolom yang sudah ada di indeks dibiarkan apa adanya. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Menghapus satu kolom dari indeks. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Memindahkan kolom di dalam indeks ke posisi kolom lain di indeks tersebut. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Mengatur arah pengurutan satu kolom dalam indeks, `ASC` atau `DESC`. |

### Memo {#memos}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_memo` | | Menambahkan memo kosong di posisi yang masih bebas dan mengembalikan id-nya di `createdIds`. |
| `erd_remove_memo` | `memoId` | Menghapus memo. |
| `erd_change_memo_value` | `memoId`, `value` | Mengganti teks memo. |
| `erd_change_memo_color` | `memoId`, `color` | Mengatur warna memo. |
| `erd_move_memo` | `memoId`, `x`, `y` | Memindahkan memo ke suatu posisi di kanvas. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Mengubah ukuran memo. Lebarnya harus setidaknya sekitar `116` piksel dan tingginya setidaknya `100`. Alat ini tidak membuat entri pembatalan, karena editor hanya mencatat perubahan ukuran memo dari penyeretan. |

Selama memo disembunyikan dengan [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` tetap menambahkan memo, dan memo tersebut tetap tersembunyi hingga memo ditampilkan kembali.
`erd_list` dan `erd_get` juga mencantumkan memo yang tersembunyi.

### Grup tabel {#table-groups}

Grup tabel adalah kotak bernama yang digambar di belakang tabelnya, dan warnanya tampil pada kotak tersebut dan di sepanjang header tabelnya — lihat [Grup tabel](../guide/guides/table-groups.md).
Sebuah tabel paling banyak berada di satu grup. `erd_move_table`, `erd_move_tables`, dan `erd_move_table_group` tidak pernah mengubah tabel mana yang dimuat suatu grup, di mana pun alat tersebut menempatkan tabel, sedangkan di editor, tabel bergabung dengan atau keluar dari grup di tempat tabel itu dilepaskan — lihat [Menambahkan dan mengeluarkan tabel](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` dan `erd_set_table_group` memasukkan tabel ke grup, dan `erd_remove_table_group` membuat tabelnya tidak berada di grup mana pun.
Grup menyimpan persegi panjang, dengan lebar setidaknya `160` piksel dan tinggi setidaknya `100`, termasuk bilah judul, dan editor menggambar kotak yang diperbesar agar memuat setiap tabelnya.

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Menambahkan grup dan mengembalikan id-nya di `createdIds`. Berikan `tableIds` atau persegi panjang, yaitu `x`, `y`, `width`, dan `height` sekaligus. Dengan `tableIds`, setiap tabel keluar dari grup yang sebelumnya ditempatinya, dan persegi panjang disesuaikan di sekeliling tabel-tabel itu seperti saat [mengelompokkan tabel yang dipilih](../guide/guides/table-groups.md#grouping-selected-tables). Persegi panjang mencakup setiap tabel tanpa grup yang titik tengahnya berada di dalamnya, seperti saat [menggambar grup](../guide/guides/table-groups.md#drawing-a-group). `name` kosong membuat grup tidak bernama. Satu `erd_undo` menghapus grup dan mengembalikan setiap tabel ke grup yang sebelumnya ditempatinya. |
| `erd_remove_table_group` | `groupId` | Menghapus grup. Tabelnya tetap di tempatnya, tanpa grup. |
| `erd_change_table_group_name` | `groupId`, `value` | Mengganti nama grup. String kosong membuatnya tidak bernama. |
| `erd_change_table_group_color` | `groupId`, `color` | Mengatur warna grup. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Memindahkan grup sehingga persegi panjangnya dimulai di titik tersebut, dengan tabelnya ikut bergeser sejauh yang sama, seperti saat menyeret bilah judulnya. Perpindahan di bawah 20 piksel, dihitung dari jumlah jarak horizontal dan vertikal, tidak membuat entri pembatalan. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Mengatur persegi panjang grup, sementara tabelnya tetap di tempatnya. Jika `x` dan `y` tidak diberikan, sudutnya tetap. Persegi panjang yang tidak dapat memuat tabel grup beserta padding-nya ditolak, dengan pesan yang menyebutkan kotak yang harus dimuatnya. |
| `erd_set_table_group` | `tableIds`, `groupId` | Memasukkan tabel ke grup, dan setiap tabel keluar dari grup yang sebelumnya ditempatinya. `groupId` berupa `null` atau string kosong mengeluarkan tabel dari semua grup. |

Selama grup disembunyikan dengan `View Option` → `Table Groups`, alat-alat ini tetap menambahkan dan mengubah grup, yang tetap tersembunyi hingga grup ditampilkan — lihat [Menyembunyikan grup](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` menjaga tabel setiap grup tetap berdekatan, `erd_import_dbml` dan `erd_import_json` membawa grup — lihat [Impor](#import) — dan `erd_read` menulis DDL grup yang dipilih dengan `groupNames`.
Rilis ERD Editor dari sebelum adanya grup tabel membuang grup dalam file saat menyimpan file tersebut, seperti ekstensi VS Code sebelum `4.0.0` serta plugin Obsidian dan JetBrains sebelum `1.0.0` — lihat [Memperbarui](./installation.md#updating).

### Kamus {#dictionaries}

Alat-alat ini mengedit ketiga kamus di tab [Kamus](../guide/guides/dictionary.md) editor, yang darinya nama logis tabel atau kolom menghasilkan nama fisiknya:

- Kata adalah kata standar penyusun nama logis, beserta singkatan yang ditulisnya ke dalam nama fisik, misalnya `Member` dan `MBR`.
- Istilah adalah nama logis utuh beserta nama fisik yang diberikannya dan, untuk kolom, domain yang ditautkannya, misalnya `Member Number` dengan `MBR_NO` dan `Identifier`.
- Domain adalah tipe data bernama tempat kolom ditautkan, misalnya `Identifier` untuk `INT`.

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Menambahkan kata di akhir kamus kata dan mengembalikan id-nya di `createdIds`. `synonyms` dan `forbiddenWords` dipisahkan koma: ejaan lain dari kata tersebut, dan kata yang tidak boleh digunakan sebagai penggantinya. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Mengubah field yang diberikan dan membiarkan sisanya. |
| `erd_remove_word` | `wordId` | Menghapus kata. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Menambahkan istilah di akhir kamus istilah dan mengembalikan id-nya di `createdIds`. Tanpa `physicalName`, kata-kata menyusun nama fisik jika memungkinkan, misalnya `MBR_NO` untuk `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Mengubah field yang diberikan dan membiarkan sisanya. `name` yang diberikan selama istilah tidak memuat nama fisik, atau bersama `physicalName` kosong, juga menulis nama fisik yang disusun kata-katanya, jika kata-kata itu dapat menyusunnya. |
| `erd_remove_term` | `termId` | Menghapus istilah. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Menambahkan domain di akhir kamus domain dan mengembalikan id-nya di `createdIds`. `category` mengelompokkan domain, misalnya `Number` atau `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Mengubah field yang diberikan dan membiarkan sisanya. `dataType` baru sampai ke setiap kolom yang tertaut ke domain tersebut, dan mengikuti hubungan selama Sinkronisasi tipe data hubungan aktif, dengan pelepasan tautan yang sama seperti `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Menghapus domain. Kolom yang tertaut ke domain itu mempertahankan tipe datanya, dan kolom serta istilah yang tertaut ke domain itu tidak menampilkan domain: `domainId` miliknya terbaca sebagai string kosong. `erd_undo` mengembalikan tautannya, dan penyimpanan tidak menyertakan tautan itu di file. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Menghasilkan ulang nama fisik dari nama logis, seperti yang dilakukan [Hasilkan ulang nama-nama fisik](../guide/guides/dictionary.md#derive-physical-names-again) di editor, untuk satu kolom, satu tabel, atau seluruh dokumen. |

- Kamus memuat setiap nama hanya sekali, sehingga nama yang sudah dimuat baris lain dalam kamus yang sama ditolak dengan `invalidArgs`. Nama dibandingkan setelah spasi di awal dan akhirnya dipangkas, dengan membedakan huruf besar dan kecil, sehingga `Member` dan `member` adalah dua nama.
- Pembaruan menyebutkan baris menurut id-nya dan memberikan setidaknya satu field. Nilai yang sudah dimuat baris tidak mengubah apa pun dan tidak membuat entri pembatalan; penambahan atau penghapusan selalu membuatnya.
- Domain istilah diberikan melalui `domainId`, dengan `null` atau string kosong untuk tanpa domain, atau melalui `domainName`, dengan string kosong untuk tanpa domain. `domainName` mengambil domain pertama dengan nama tersebut sesuai urutan kamus, yang dibandingkan seperti nama dibandingkan. Memberikan keduanya, atau `domainName` yang tidak dimiliki domain mana pun, ditolak. `erd_set_column_domain` menerima domain dengan cara yang sama.
- Mengubah atau menghapus kata atau istilah tidak mengganti nama apa pun dan tidak melepas tautan apa pun: nama dan domain yang diberikannya tetap seperti semula. `erd_derive_physical_names` menghasilkan ulang nama dan menautkan domain yang kini diberikan istilah, tetapi kolom yang kini tidak cocok dengan istilah mana pun, atau yang istilahnya tidak memberikan domain, mempertahankan domain yang tertaut dengannya. `erd_set_column_domain` dengan `domainId` kosong melepas tautannya.
- Tidak ada alat yang mengimpor atau mengekspor kamus sebagai CSV, mengurutkan kamus, atau menyisipkan baris di posisi tertentu, seperti yang dilakukan tab Kamus.

`erd_list` mencantumkan baris, `erd_get` memberikan setiap field, format `snapshot` dari `erd_read` memuat semuanya, dan `erd_list_checks` mencantumkan apa yang ditemukan salah oleh kamus — lihat [Membaca dokumen](#reading-a-document).

`erd_set_table_logical_name` dan `erd_set_column_logical_name` menghasilkan nama fisik seperti yang dilakukan editor saat nama logis ditulis — lihat [Menghasilkan nama fisik](../guide/guides/dictionary.md#deriving-physical-names):

- Nama hanya dihasilkan selama nama itu kosong atau merupakan nama yang dihasilkan, yang ditampilkan pembacaan sebagai `nameDerived: true`. Nama yang tidak kosong dan ditulis secara manual tetap dipertahankan, dan hanya nama logis yang ditulis. `erd_change_table_name`, `erd_change_column_name`, impor SQL, GraphQL, DBML, dan AML, serta kolom kunci asing yang dinamai `erd_add_relationship` semuanya menulis nama secara manual. Nama yang diganti menjadi string kosong dihasilkan lagi oleh nama logis berikutnya.
- Istilah yang namanya sama dengan nama logis didahulukan, dibandingkan seperti nama kamus dibandingkan. Istilah itu memberikan nama fisiknya, atau nama yang disusun kata-katanya selama istilah itu tidak memuat nama fisik. Untuk kolom, istilah itu juga menautkan domain miliknya, bahkan saat tidak ada nama yang dihasilkan, dan kolom mengambil tipe data domain, yang mengikuti hubungan selama Sinkronisasi tipe data hubungan aktif.
- Tanpa istilah seperti itu, kata-kata menyusun nama, dengan singkatannya digabungkan dengan garis bawah: `Member Number` menghasilkan `MBR_NO`. Prosesnya semua atau tidak sama sekali: sinonim, kata terlarang, teks yang tidak dicantumkan kata mana pun, atau kata tanpa singkatan tidak menyusun apa pun, dan nama tetap seperti semula. Kata-kata tidak menautkan domain, begitu pula istilah tanpa domain, sehingga kolom mempertahankan domain yang tertaut dengannya.
- Kolom yang nama hasilnya sudah dimiliki kolom lain di tabelnya, tanpa membedakan huruf besar dan kecil, mempertahankan namanya, `nameDerived` miliknya, dan domainnya.
- Menghapus nama logis membiarkan nama fisik apa adanya. Panggilan yang nama logisnya, beserta apa yang dihasilkannya, sudah berlaku tidak mengubah apa pun dan tidak membuat entri pembatalan.

`erd_derive_physical_names` menerima `scope`: `column`, dengan `tableId` dan `columnId`, untuk kolom tersebut; `table`, dengan `tableId`, untuk nama tabel dan setiap kolomnya; atau `document`, tanpa id, untuk setiap tabel beserta kolomnya. Cakupan yang tidak memiliki id yang dibutuhkannya, atau diberi id yang tidak diterimanya, ditolak.
Setiap nama yang dicakup dan memiliki nama logis dikembalikan ke kamus, termasuk nama yang ditulis secara manual, dan mengambil apa yang kini diberikan kamus: nama fisik istilah dan, untuk kolom, domain dan tipenya, atau jika tidak, susunan dari kata-kata, yang membiarkan domain kolom apa adanya. Nama logis yang tidak menghasilkan apa pun membiarkan nama apa adanya, dengan `nameDerived` kini bernilai `true`. Nama tanpa nama logis tetap seperti semula, begitu pula kolom yang nama barunya dimiliki kolom lain di tabelnya, misalnya kunci asing kedua ke satu tabel, yang juga mempertahankan `nameDerived` miliknya. Satu `erd_undo` mengembalikan seluruh panggilan.
Nama dalam skema yang diimpor ditulis secara manual, jadi beri nama skema itu dari kamus dengan mengatur nama logis lalu memanggil `erd_derive_physical_names`. Panggilan itu memberikan nama fisik milik istilah itu sendiri, yang tidak disusun ulang oleh perubahan pada kata-kata istilah. Jadi, setelah mengubah kata-kata suatu istilah, perbarui istilah itu terlebih dahulu: berikan `name`-nya dengan `physicalName` kosong agar kata-kata menyusunnya kembali, atau berikan `physicalName` yang baru.

Rilis ERD Editor dari sebelum adanya tab Kamus membuang nama logis, tautan domain, dan baris kamus dalam file saat menyimpan file tersebut, seperti ekstensi VS Code sebelum `4.2.0` serta plugin Obsidian dan JetBrains sebelum `1.2.0`. Dari rilis tersebut, ekstensi `4.0.0` atau `4.1.0` serta plugin `1.0.0` atau `1.1.0` masih mengedit secara live bersama server, tetapi tidak menampilkan maupun mempertahankan nama logis, tautan domain, dan baris kamus yang ditulis agen — lihat [Memperbarui](./installation.md#updating).

### Pengaturan {#settings}

Agen mengatur pengaturan skema itu sendiri: database, namanya, dan skrip [Skema SQL](../guide/guides/schema-sql.md).
Setiap pengaturan lain yang disimpan dokumen diatur oleh pengguna di editor: [Tampilan Nama](../guide/guides/logical-names.md#name-view), sakelar [opsi tampilan](../guide/guides/table-related-functions.md#table-view-options), opsi di tab [Pengaturan](../guide/guides/settings.md), bahasa dan konvensi penamaan Generator Kode, tipe tanda kutip, dan [penguncian](../guide/guides/settings.md#lock).
Tidak ada alat yang mengubahnya, kecuali impor dalam mode `replace`: `erd_import_json` membawa pengaturan dan penguncian dari dokumen yang dimuatnya, dan empat alat lainnya mengembalikan area pandang ke awal kanvas — lihat [Impor](#import).
Server `1.0.0` menghapus alat yang mengaturnya: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings`, dan `erd_set_show`.

`erd_list` dan format `snapshot` dari `erd_read` melaporkan pengaturan sebagaimana disimpan file, dengan `lockSettings` yang memuat satu flag per penguncian: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType`, dan `unlockNameViewMode`.
Flag terakhir dibaca dengan arah sebaliknya: nilainya `false` selama penguncian `Name View` aktif, seperti di dokumen baru dan di file yang disimpan sebelum penguncian itu ada, dan `true` begitu pengguna menonaktifkan penguncian itu.
Bahasa, konvensi penamaan, atau tipe tanda kutip yang terkunci dilaporkan dengan nilai terkuncinya, yaitu nilai yang disimpan file dan dipakai setiap editor saat membuka file, apa pun yang ditampilkan layar editor. Area pandang, tab, dan Tampilan Nama tidak dilaporkan. Agen membaca dan menulis nama logis apa pun yang ditampilkan Tampilan Nama.

`erd_set_ddl_script` membuat entri pembatalan. `erd_set_database` dan `erd_set_database_name` tidak membuatnya, sehingga `erd_undo` tidak dapat mengembalikannya.

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_set_database` | `value` | Mengatur database: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks`, atau `Snowflake`. Pilihan ini menentukan tipe data milik database tersebut, dan DDL yang ditulis `erd_read` saat `vendor` tidak diberikan. |
| `erd_set_database_name` | `value` | Mengatur nama database, yang disebutkan oleh pembuka `use` dan `createAndUse` dari `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Mengatur salah satu dari dua skrip yang ditulis di sekitar tabel — lihat [Skrip sebelum dan setelah tabel](../guide/guides/schema-sql.md#before-and-after-scripts). `position` adalah `before`, yang ditulis sebelum tabel, seperti `CREATE EXTENSION` atau `CREATE SCHEMA`, atau `after`, yang ditulis setelahnya, seperti `GRANT` atau `CREATE VIEW`. `sql` menggantikan seluruh skrip, paling banyak 10.000 karakter, dan string kosong menghapusnya. Baca skrip saat ini terlebih dahulu dengan format `scripts` dari `erd_read`. |

Skrip dimasukkan apa adanya ke DDL setiap database, jadi tulis skrip tersebut untuk database dokumen. Di MSSQL, baris `GO` ditambahkan setelah skrip yang baris terakhirnya bukan `GO`.
Rilis ERD Editor dari sebelum adanya skrip ini membuang skrip dalam file saat menyimpan file tersebut, seperti ekstensi VS Code sebelum `4.0.0` serta plugin Obsidian dan JetBrains sebelum `1.0.0` — lihat [Memperbarui](./installation.md#updating).

### Impor {#import}

Alat-alat ini membaca skema dengan cara yang sama seperti menu Impor di editor — lihat [Mengimpor atau mengekspor file](../guide/guides/file-import-export.md).
Masing-masing menerima teks sebagai `value`, dan `mode`: `replace`, nilai default, atau `append`.

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Memuat DDL SQL, pernyataan `CREATE TABLE` dan sejenisnya. |
| `erd_import_graphql` | `value`, `mode?` | Memuat SDL GraphQL. |
| `erd_import_dbml` | `value`, `mode?` | Memuat DBML. Setiap `TableGroup` menjadi grup tabel yang berisi tabel yang disebutkannya — lihat [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Memuat AML. |
| `erd_import_json` | `value`, `mode?` | Memuat dokumen JSON erd-editor, seperti file `.erd.json` lain. |

`replace` menggantikan dokumen, dan `erd_undo` memulihkan dokumen sebelumnya:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, dan `erd_import_aml` mengganti setiap tabel, hubungan, indeks, memo, dan grup tabel. Keempatnya mempertahankan pengaturan dokumen, termasuk penguncian, kecuali area pandang, yang kembali ke awal kanvas pada 100%, dan mempertahankan kamus kata, istilah, dan domain milik dokumen. Tabel yang dibawanya tidak memiliki nama logis dan tidak tertaut ke domain.
- `erd_import_json` mengganti seluruh dokumen, termasuk pengaturan dan kamusnya: pengaturan, penguncian, kata, istilah, dan domain dari JSON menggantikan milik dokumen ini, dan JSON yang tidak mencatat penguncian mengaktifkan setiap penguncian dan menempatkan area pandang di awal kanvas. Setiap orang yang melihat diagram mempertahankan Tampilan Nama miliknya sendiri, kecuali jika penguncian `Name View` di JSON nonaktif, yang membawa Tampilan Nama milik JSON itu. Untuk mempertahankan pengaturan dokumen ini, mulai dari teks yang diberikan format `json` dari `erd_read`. Teks kosong menghasilkan dokumen baru, seperti dokumen yang dibuat `erd_open_document` dengan `create`.

`append` menambahkan hasil impor ke dokumen, seperti [Impor dan Tambahkan](../guide/guides/file-import-export.md#import-and-add) di editor, dan satu `erd_undo` menghapus seluruh tambahan tersebut:

- Isi teks masuk sebagai entitas baru dengan id baru, dalam satu blok di bawah semua yang ada di dokumen, termasuk memo dan grup tabel yang tersembunyi, sejajar dengan tepi kirinya. Setiap tabel dan pengaturan yang sudah ada tetap dipertahankan, termasuk tabel dengan nama yang sama: tidak ada yang digabungkan berdasarkan nama.
- Hubungan dan indeks hanya masuk di antara tabel yang dibawa impor, sehingga kunci asing ke tabel yang tidak dideklarasikan teks dibuang.
- `erd_import_sql`, `erd_import_graphql`, dan `erd_import_aml` menambahkan tabel beserta hubungan dan indeksnya, dan `erd_import_dbml` juga menambahkan grup tabelnya. `erd_import_json` menambahkan tabel, hubungan, indeks, memo, dan grup tabel, tidak pernah pengaturannya, dan menolak teks kosong. Tabel dan kolomnya membawa nama logisnya, tetapi tidak ada kolom yang tertaut ke domain, dan tidak satu pun kata, istilah, atau domain dari JSON yang masuk.

Dokumen JSON mempertahankan tata letaknya sendiri, termasuk grup tabelnya: di tempat dokumen itu menempatkan tabelnya dengan `replace`, dan di dalam blok yang ditambahkan dengan `append`.
Tabel dari SQL, GraphQL, DBML, dan AML disusun dalam beberapa baris, dimulai dari tabel dengan kolom paling sedikit dan tabel setiap grup tetap berdekatan, seperti cara `erd_sort_tables` menempatkannya, tidak pernah dengan `Flow`, yang dipakai fitur Impor milik editor untuk menata tabel jika memungkinkan. Keempat alat tersebut menolak teks kosong di kedua mode.

## erd_batch {#erd_batch}

`erd_batch` menjalankan beberapa alat edit secara berurutan sebagai satu perubahan, semua atau tidak sama sekali.

- `operations` memuat hingga 100 entri, masing-masing `{ tool, as?, args? }`, dengan `tool` berupa alat edit dan `args` berisi argumen alat tanpa `path`. Alat baca, seperti `erd_list_checks`, ditolak.
- Operasi dicoba terlebih dahulu pada salinan dokumen. Operasi yang ditolak disebutkan, misalnya `operations[1] erd_remove_table: …`, dan tidak ada yang diterapkan.
- Satu `erd_undo` mengembalikan seluruh batch, kecuali operasi yang tidak dapat dikembalikannya, yang disebutkan oleh `undoNote` di hasil: operasi dari alat yang tidak membuat entri pembatalan, seperti `erd_set_database`, dan operasi yang mengubah dokumen tanpa membuatnya, seperti `erd_move_table_group` yang pendek. Batch yang sama sekali tidak membuat entri pembatalan dilewati oleh `erd_undo`. `historyEntries` di hasil menghitung entri riwayat editor di dalamnya, bukan panggilan `erd_undo`.
- Dalam sesi live, editor menerima seluruh batch atau tidak sama sekali.

Agen tidak dapat mengetahui id yang dibuat batch sebelum memanggilnya, sehingga operasi yang diberi nama dengan `as` memungkinkan operasi berikutnya merujuk ke id tersebut: `$name` atau `$name.0` untuk id pertama yang dibuatnya, `$name.1` untuk yang kedua, dan `$name.last` untuk yang terakhir.
Nama terdiri dari huruf ASCII, angka, dan garis bawah, tidak diawali angka, dan hanya menamai satu operasi.
Referensi hanya berlaku di tempat argumen menerima id entitas, termasuk `wordId`, `termId`, dan `domainId`, sehingga nama atau komentar bertuliskan `$x` tetap berupa teks.
`domainName` juga berupa teks, tetapi dibaca saat operasinya dijalankan, sehingga dapat menyebut domain yang ditambahkan operasi sebelumnya dalam batch tersebut.

Tabel beserta kolomnya dan sebuah hubungan, dalam satu panggilan:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` dan kuncinya `id` diberi nama sebelum hubungan, sehingga kolom kunci asing yang ditambahkannya ke `orders` adalah `users_id`.

Kata, domain, dan istilah, lalu tabel yang diberi nama dari ketiganya melalui nama logisnya:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

Istilah menyusun `MBR_NO` dari kata-katanya, dan tabel diberi nama `MBR`. Kolom `Member Number` mengambil `MBR_NO` milik istilah beserta domainnya, sehingga kolom itu tertaut ke `Identifier` dan bertipe `INT`, dan `Member Name`, yang tidak dimiliki istilah mana pun, disusun menjadi `MBR_NM`.

## Hasil {#results}

Perubahan dijawab dengan satu baris JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Field | Arti |
| --- | --- |
| `mode` | `live` atau `headless` — lihat [Live dan headless](./live-and-headless.md). |
| `saved` | `true` pada hasil setiap perubahan, `erd_batch`, `erd_undo`, dan `erd_redo` dalam mode headless: file sudah memuat perubahan saat panggilan menjawab, sehingga tidak ada lagi yang perlu disimpan. Hasil live tidak memiliki `saved`, karena editor yang memegang perubahan — lihat [Menyimpan](./live-and-headless.md#saving). |
| `createdIds` | Id dari apa yang dibuat panggilan, secara berurutan. |
| `batches`, `historyEntries` | Berapa banyak batch perubahan yang dikirim panggilan dan berapa banyak entri riwayat editor yang dibuatnya. |
| `undoable`, `undoNote` | `undoable` bernilai `false` saat `erd_undo` akan melewati panggilan tersebut, dan `undoNote` menjelaskan alasannya: alat tidak membuat entri pembatalan, panggilan mengubah dokumen tanpa membuatnya, seperti `erd_move_table_group` di bawah 20 piksel, atau dokumen sudah memiliki nilai tersebut. Hasil `erd_batch` selalu menyertakan `undoNote`. Saat batch membuat entri pembatalan, catatan itu menyatakan bahwa satu `erd_undo` mengembalikan batch dan menyebutkan operasi apa pun yang dibiarkannya tetap berlaku; saat batch tidak membuatnya, hasil menyertakan `undoable: false` dan catatan menyatakan bahwa `erd_undo` melewatinya. |
| `mismatch` | Ada saat panggilan membuat jumlah batch atau entri riwayat yang berbeda dari yang dideklarasikan alat. |
| `notes` | Ada saat sesuatu tentang sesi berubah, misalnya editor yang keluar atau berhenti melayani dokumen, atau file yang berubah di disk. |

Penolakan adalah hasil kesalahan yang berisi kode dan pesan yang menjelaskan apa yang harus dilakukan:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Alasan |
| --- | --- |
| `notFound` | Id tidak merujuk ke apa pun yang masih ada, atau file tidak ada. |
| `invalidArgs` | Argumen tidak ada atau memiliki nilai yang salah. |
| `invalidPath` | Jalur bukan dokumen ERD. Di Windows, juga jalur dengan nama yang tidak disimpan Windows persis seperti yang ditulis, atau jalur yang mencapai dokumen yang dipegang editor melalui jalur lain, yang disebutkan dalam pesan. |
| `invalidDocument` | File bukan dokumen yang dapat dibaca editor. |
| `tooLarge` | Pembacaan tidak muat dalam satu jawaban. |
| `blocked` | Editor dengan hub nonaktif memegang dokumen tersebut. Pesan menjelaskan cara mengaktifkannya: di VS Code, percayai workspace dan aktifkan `dineug.erd-editor.agentHub.enabled`, atau muat ulang jendela; di Obsidian, aktifkan Coding agents, atau muat ulang Obsidian; di IDE JetBrains, aktifkan Coding agents, atau mulai ulang IDE jika sudah aktif. |
| `hubDisabled` | IDE JetBrains memegang dokumen hanya di proyek yang tidak dipercayainya. Pembacaan tetap berfungsi; percayai proyek agar agen dapat mengedit. |
| `conflict` | File berubah di disk selama panggilan. Tidak ada yang ditulis. |
| `hubAppeared`, `hubGone` | Editor mulai melayani dokumen yang sedang diedit agen di disk, atau editor yang melayaninya masih berjalan tetapi file kunci dan koneksinya hilang. Tidak ada yang ditulis. |
| `notSaved` | `erd_save` tidak dapat menyimpan dokumen editor. |
| `readonly` | Editor memegang dokumen dalam keadaan hanya baca, misalnya file yang tidak dapat ditulisnya atau tidak dapat dibacanya sebagai diagram. Tanpa editor, file itu sendiri bersifat hanya baca, misalnya file Perforce atau TFVC yang belum di-checkout. Tidak ada yang ditulis. |
| `protocolMismatch` | Ekstensi atau plugin ERD Editor di editor dan server menggunakan versi protokol yang berbeda, misalnya server `1.0.0` atau yang lebih baru dengan ekstensi VS Code `3.x`. Pembacaan juga ditolak, dan pesan menyebutkan sisi yang perlu diperbarui — lihat [Memperbarui](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Hub editor tidak menerima koneksi, tidak menjawab dalam 30 detik, atau memutus koneksi selama panggilan. Di Windows, `hubUnreachable` juga berarti Windows menghalangi agen mengakses hub: editor berjalan dengan hak akses lebih tinggi daripada agen, seperti saat editor dijalankan sebagai administrator sedangkan agen tidak, atau agen berjalan di sandbox. |

Kode lain lebih jarang muncul, dan setiap penolakan menyertakan pesan yang menjelaskan apa yang terjadi.

Alat edit, `erd_batch`, dan empat alat baca menolak argumen yang tidak dideklarasikannya, atau argumen dengan tipe yang salah, dengan kesalahan invalid params JSON-RPC (`-32602`) sebelum menyentuh dokumen, sehingga argumen yang salah eja tidak pernah dibuang diam-diam.
Lima alat sesi mengabaikan argumen yang tidak dikenalnya.
