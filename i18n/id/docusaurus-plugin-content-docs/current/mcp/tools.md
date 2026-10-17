---
sidebar_position: 4
description: Semua alat yang disediakan server MCP erd-editor — membaca dokumen halaman demi halaman, 54 alat edit, erd_batch, serta bentuk hasil dan penolakan.
---

# Alat

Server menyediakan 63 alat: lima alat sesi, tiga alat baca, 54 alat edit, satu untuk setiap operasi pengeditan, dan `erd_batch`, yang menjalankan beberapa alat edit sebagai satu perubahan.

Setiap alat kecuali `erd_list_documents` menerima `path` dokumen sebagai argumen pertamanya, dan tabel di bawah tidak mencantumkannya.
Argumen yang ditandai `?` bersifat opsional.

## Alat sesi {#session-tools}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_list_documents` | | Mencantumkan dokumen ERD beserta `path`, `open`, `active`, `dirty`, dan `readonly`: dokumen milik editor yang melayani direktori kerja, yang di IDE JetBrains mencakup setiap proyek yang terbuka, atau jika tidak ada, file ERD di dalam direktori kerja. |
| `erd_open_document` | `create?` | Membuka dokumen untuk diedit, di ERD Editor milik editor yang melayaninya, jika ada. Dengan `create`, alat ini membuat file terlebih dahulu jika file belum ada, dan nama tanpa ekstensi mendapat `.erd.json`. |
| `erd_save` | | Menyimpan dokumen yang dipegang editor. VS Code membiarkan perubahan agen tidak tersimpan hingga alat ini dipanggil; Obsidian dan IDE JetBrains menyimpannya seperti menyimpan perubahan Anda, dan alat ini langsung menuliskannya. Dalam mode headless, setiap perubahan sudah ditulis dan alat ini tidak melakukan apa pun. |
| `erd_undo` | | Mengembalikan perubahan terakhir yang dibuat agen ini, dan tidak pernah mengembalikan perubahan Anda. Panggilan yang tidak membuat entri pembatalan dilewati dan disebutkan namanya. |
| `erd_redo` | | Menerapkan kembali perubahan yang terakhir dikembalikan `erd_undo`. |

Lihat [Live dan headless](./live-and-headless.md) untuk mengetahui apa yang dilakukan penyimpanan dan pembatalan di setiap mode.

## Membaca dokumen {#reading-a-document}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Pengaturan dan jumlah, lalu satu halaman tabel beserta indeks dan hubungannya, setiap tabel dengan id, posisi dan ukurannya di kanvas, jumlah kolom, serta grup tabelnya jika tabel berada dalam grup. Kecuali saat melakukan pencarian, grup tabel lalu memo menyusul setelah tabel. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Entitas yang disebutkan, secara lengkap: tabel beserta kolom dan grup tabelnya, hubungan beserta kolomnya serta `onDelete` dan `onUpdate`, indeks beserta kolomnya, memo beserta teksnya, grup tabel beserta tabelnya. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Seluruh dokumen sekaligus dalam salah satu dari empat format, atau DDL dari beberapa tabel atau grup tabel saja. |

Agen menemukan id dengan `erd_list`, membaca kolom dan detail lainnya dengan `erd_get`, lalu meneruskan id tersebut ke alat edit.
Ukuran tabel di `erd_list` adalah kotak yang ditempatinya di kanvas: tingginya tepat, lebarnya perkiraan.
Grup tabel dicantumkan menurut persegi panjang yang disimpannya, beserta nama, warna, dan jumlah tabel yang dimuatnya.
Setiap hubungan dicantumkan sekali, bersama salah satu dari kedua tabelnya.
Pengaturan yang dilaporkan `erd_list` dan `erd_read` adalah pengaturan yang disimpan file — lihat [Pengaturan](#settings).

`erd_read` menerima salah satu dari empat format:

| `format` | Isi jawaban |
| --- | --- |
| `snapshot` | JSON ringkas berisi setiap entitas beserta id-nya, termasuk grup tabel, serta pengaturan beserta skrip Skema SQL. Format ini tidak menyertakan hal yang berbeda dari satu penampil ke penampil lain: lebar terukur, urutan tumpukan, area pandang, dan tab. Ukurannya besar pada skema yang besar. |
| `sql` | DDL untuk salah satu dari delapan database, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake`, atau `SQLite`. `vendor` secara default adalah database yang diatur pada dokumen. DDL seluruh dokumen menyertakan skrip sebelum dan setelah tabel milik dokumen tersebut. Dengan `tableIds`, `tableNames`, atau `groupNames`, hanya tabel tersebut, beserta kunci asing yang dimilikinya, dan tanpa skrip. Kunci asing menyertakan tindakan ON DELETE dan ON UPDATE masing-masing, kecuali tindakan yang dihilangkan oleh database target — lihat [ON DELETE dan ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Seluruh dokumen persis seperti yang ditulis ke file saat disimpan, termasuk perubahan yang belum disimpan editor — lihat [Bentuk penyimpanan dan nilai runtime](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Hanya skrip sebelum dan setelah tabel milik dokumen, sebagai `{"before":"…","after":"…"}`, masing-masing kosong jika belum diatur, sebesar apa pun skemanya. |

Hanya format `sql` yang menerima `vendor`, `statements`, `header`, `tableIds`, `tableNames`, dan `groupNames`, dan format lain menolaknya.

- `statements`: `create`, nilai default; `ifNotExists`, yang menulis `CREATE TABLE IF NOT EXISTS` di MySQL, MariaDB, PostgreSQL, SQLite, dan Databricks serta `CREATE TABLE` biasa di database lainnya; atau `recreate`, yang menghapus tabel sebelum membuatnya, sedangkan Snowflake menulis `CREATE OR REPLACE TABLE` sebagai gantinya.
- `header`: `none`, nilai default; `use`, yang memilih database atau skema yang ditunjuk oleh nama database dokumen; atau `createAndUse`, yang membuatnya terlebih dahulu. Oracle hanya memiliki `use`, sehingga `createAndUse` menulis `use` di sana, dan PostgreSQL hanya memiliki `createAndUse`, sehingga `use` tidak menulis pembuka di sana. SQLite tidak menulis pembuka, dan tidak ada database yang menulisnya selama nama database kosong atau bukan pengenal biasa.
- `groupNames`: tabel dari grup tabel yang disebutkan, berdasarkan nama tanpa membedakan huruf besar dan kecil, digabungkan dengan `tableIds` dan `tableNames`. Nama yang tidak cocok dengan grup mana pun ditolak dengan `notFound`. Grup yang tidak memuat tabel tidak menambahkan apa pun, dan pembacaan yang tidak menyisakan tabel sama sekali, seperti saat setiap grup yang disebutkan kosong dan tidak ada tabel yang disebutkan, ditolak dengan `invalidArgs`.

`statements` dan `header` juga berlaku untuk DDL beberapa tabel. Keduanya bekerja seperti opsi `Statements` dan `Header` di tab [Skema SQL](../guide/guides/schema-sql.md#options-panel) editor, meskipun nilai awal di tab tersebut adalah `If not exists` dan `CREATE + USE`.
Nama diapit dengan tipe tanda kutip yang disimpan file, yakni tipe yang terkunci selama `Bracket Type` terkunci — lihat [Penguncian](../guide/guides/settings.md#lock).

### Skema besar {#large-schemas}

Skema dengan ratusan atau ribuan tabel juga dapat ditangani.
Satu pembacaan menjawab paling banyak 40.000 karakter, di bawah batas yang membuat Claude Code menyimpan hasil alat secara terpisah dalam file.

- `erd_list` menjawab satu halaman berisi 100 item secara default, tabel terlebih dahulu, lalu grup tabel, lalu memo, dan memberi tahu awal halaman berikutnya dengan `nextOffset` dan `note`. Berikan `nextOffset` tersebut sebagai `offset`, dengan `query` yang sama.
- `query` menemukan tabel berdasarkan kata dalam nama atau komentar tabel atau kolom, tanpa membedakan huruf besar dan kecil. Tabel yang namanya memuat lebih banyak kata tersebut muncul lebih dulu. Pencarian tidak mencantumkan grup tabel atau memo.
- `namesOnly` hanya mencantumkan nama tabel, sekitar 2.000 nama pendek dalam satu jawaban.
- `erd_get` dan `erd_read` menerima `tableNames` selain id, dan `erd_read` menerima `groupNames`, sehingga agen yang diminta membuat kueri SQL pada skema besar hanya membaca DDL tabel yang dibutuhkannya.
- `erd_get` mencantumkan id dan nama yang tidak merujuk ke apa pun di bawah `missing`, serta id yang tidak muat dalam satu jawaban di bawah `notReturned`, untuk diminta lagi.
- Pembacaan yang terlalu besar untuk satu jawaban ditolak dengan `tooLarge`, beserta cara mempersempitnya.

## Alat edit {#edit-tools}

Id berasal dari `erd_list` dan `erd_get`, atau dari `createdIds` milik panggilan yang membuat entitas tersebut.
Id baru terdiri dari 25 huruf kecil dan angka, seperti `03h17be2plxpj5n59tqag7ogj`, sedangkan id yang sudah ada di dokumen mempertahankan bentuknya, jadi jangan menyimpulkan apa pun dari bentuk id.
`x` dan `y` adalah tepi kiri dan atas di kanvas, dalam piksel, dan warna adalah warna heksadesimal CSS seperti `#3b82f6`, atau string kosong, yang menghapus warna.

### Tabel {#tables}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_table` | | Menambahkan tabel kosong di posisi yang masih bebas dan mengembalikan id-nya di `createdIds`. |
| `erd_remove_table` | `tableId` | Menghapus tabel beserta kolom, indeks, dan setiap hubungan yang terhubung dengannya. |
| `erd_change_table_name` | `tableId`, `value` | Mengganti nama tabel. |
| `erd_change_table_comment` | `tableId`, `value` | Mengatur komentar tabel. String kosong menghapusnya. |
| `erd_change_table_color` | `tableId`, `color` | Mengatur warna tabel. |
| `erd_move_table` | `tableId`, `x`, `y` | Memindahkan tabel ke suatu posisi di kanvas. |
| `erd_move_tables` | `positions` | Memindahkan beberapa tabel dalam satu perubahan, yang dapat dikembalikan dengan satu `erd_undo`. `positions` memuat `{ tableId, x, y }` per tabel, setiap tabel paling banyak sekali. |
| `erd_sort_tables` | | Menempatkan setiap tabel dalam beberapa baris di kanvas, dimulai dari tabel dengan kolom paling sedikit, seperti cara `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, dan `erd_import_aml` menempatkannya. Tabel dalam satu grup tabel tetap berdekatan, dan kotak setiap grup disesuaikan di sekeliling tabelnya. |

### Kolom {#columns}

| Alat | Argumen | Fungsi |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Menambahkan kolom kosong ke tabel dan mengembalikan id-nya di `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Menghapus kolom dari satu tabel, beserta hubungan dan entri indeks yang menggunakannya. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Mengganti nama kolom. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Mengatur tipe data, seperti `INT` atau `VARCHAR(255)`. Selama [Sinkronisasi tipe data hubungan](../guide/guides/settings.md#relationship-datatype-sync) aktif, perubahan mengikuti hubungan ke dua arah, seperti di editor: tipe serial sampai ke kunci asing sebagai tipe integer yang disimpannya, seperti cara `erd_add_relationship` menyalinnya, dan kunci serial mempertahankan tipenya saat salah satu kunci asingnya berubah, sehingga perubahan berhenti di sana. Penggunalah yang mengaktifkan atau menonaktifkan sinkronisasi ini, dan `erd_list` melaporkannya sebagai `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Mengatur nilai default, sebagai teks SQL. String kosong menghapusnya. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Mengatur komentar. String kosong menghapusnya. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Menghubungkan dua tabel. Alat ini menyalin kunci utama induk ke anak sebagai kolom kunci asing, dengan membuat kolom kunci utama terlebih dahulu jika induk tidak memilikinya. Setiap kolom kunci asing diberi nama dengan cara yang sama seperti saat menggambar hubungan di editor: kunci `id` milik `users` menghasilkan `users_id`, dan kunci seperti `member_id` mempertahankan namanya — lihat [Nama kolom kunci asing](../guide/guides/relationship-editing.md#foreign-key-column-names). Setiap kolom menyalin tipe data kuncinya, kecuali bahwa kunci serial menghasilkan tipe integer yang disimpannya, seperti `integer` untuk `serial4`, dan `serial` polos tetap `serial` di luar PostgreSQL, MySQL, dan MariaDB — lihat [Hubungan pengidentifikasi](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` memuat kolom kunci baru tersebut jika dibuat, kolom kunci asing, dan id hubungan di urutan terakhir. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Menggambar hubungan di antara kolom yang sudah ada, dengan memasangkan kolom awal dan kolom akhir menurut posisinya. Alat ini tidak mengganti nama kolom apa pun dan tidak mengubah tipe data apa pun. |
| `erd_remove_relationship` | `relationshipId` | Menghapus garis hubungan. Kolom kunci asingnya tetap ada di tabel. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Mengubah kardinalitas hubungan. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Mengatur tindakan ON DELETE suatu hubungan: apa yang terjadi pada baris anak saat baris induknya dihapus. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Mengatur tindakan ON UPDATE suatu hubungan: apa yang terjadi pada baris anak saat kunci induknya diubah. |

`erd_add_relationship` memberi nama kolom kunci asing saat dijalankan, jadi beri nama tabel induk dan kunci utamanya terlebih dahulu.

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

### Pengaturan {#settings}

Agen mengatur pengaturan skema itu sendiri: database, namanya, dan skrip [Skema SQL](../guide/guides/schema-sql.md).
Setiap pengaturan lain yang disimpan dokumen diatur oleh pengguna di editor: sakelar [opsi tampilan](../guide/guides/table-related-functions.md#table-view-options), opsi di tab [Pengaturan](../guide/guides/settings.md), bahasa dan konvensi penamaan Generator Kode, tipe tanda kutip, dan [penguncian](../guide/guides/settings.md#lock).
Tidak ada alat yang mengubahnya, kecuali impor dalam mode `replace`: `erd_import_json` membawa pengaturan dan penguncian dari dokumen yang dimuatnya, dan empat alat lainnya mengembalikan area pandang ke awal kanvas — lihat [Impor](#import).
Server `1.0.0` menghapus alat yang mengaturnya: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings`, dan `erd_set_show`.

`erd_list` dan format `snapshot` dari `erd_read` melaporkan pengaturan sebagaimana disimpan file, dengan `lockSettings` yang memuat satu flag per penguncian: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, dan `bracketType`.
Bahasa, konvensi penamaan, atau tipe tanda kutip yang terkunci dilaporkan dengan nilai terkuncinya, yaitu nilai yang disimpan file dan dipakai setiap editor saat membuka file, apa pun yang ditampilkan layar editor. Area pandang dan tab tidak dilaporkan.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml`, dan `erd_import_aml` mengganti setiap tabel, hubungan, indeks, memo, dan grup tabel. Keempatnya mempertahankan pengaturan dokumen, termasuk penguncian, kecuali area pandang, yang kembali ke awal kanvas pada 100%.
- `erd_import_json` mengganti seluruh dokumen, termasuk pengaturannya: pengaturan dan penguncian dari JSON menggantikan milik dokumen ini, dan JSON yang tidak mencatat penguncian mengaktifkan setiap penguncian dan menempatkan area pandang di awal kanvas. Untuk mempertahankan pengaturan dokumen ini, mulai dari teks yang diberikan format `json` dari `erd_read`. Teks kosong menghasilkan dokumen baru, seperti dokumen yang dibuat `erd_open_document` dengan `create`.

`append` menambahkan hasil impor ke dokumen, seperti [Impor dan Tambahkan](../guide/guides/file-import-export.md#import-and-add) di editor, dan satu `erd_undo` menghapus seluruh tambahan tersebut:

- Isi teks masuk sebagai entitas baru dengan id baru, dalam satu blok di bawah semua yang ada di dokumen, termasuk memo dan grup tabel yang tersembunyi, sejajar dengan tepi kirinya. Setiap tabel dan pengaturan yang sudah ada tetap dipertahankan, termasuk tabel dengan nama yang sama: tidak ada yang digabungkan berdasarkan nama.
- Hubungan dan indeks hanya masuk di antara tabel yang dibawa impor, sehingga kunci asing ke tabel yang tidak dideklarasikan teks dibuang.
- `erd_import_sql`, `erd_import_graphql`, dan `erd_import_aml` menambahkan tabel beserta hubungan dan indeksnya, dan `erd_import_dbml` juga menambahkan grup tabelnya. `erd_import_json` menambahkan tabel, hubungan, indeks, memo, dan grup tabel, tidak pernah pengaturannya, dan menolak teks kosong.

Dokumen JSON mempertahankan tata letaknya sendiri, termasuk grup tabelnya: di tempat dokumen itu menempatkan tabelnya dengan `replace`, dan di dalam blok yang ditambahkan dengan `append`.
Tabel dari SQL, GraphQL, DBML, dan AML disusun dalam beberapa baris, dimulai dari tabel dengan kolom paling sedikit dan tabel setiap grup tetap berdekatan, seperti cara `erd_sort_tables` menempatkannya, tidak pernah dengan `Flow`, yang dipakai fitur Impor milik editor untuk menata tabel jika memungkinkan. Keempat alat tersebut menolak teks kosong di kedua mode.

## erd_batch {#erd_batch}

`erd_batch` menjalankan beberapa alat edit secara berurutan sebagai satu perubahan, semua atau tidak sama sekali.

- `operations` memuat hingga 100 entri, masing-masing `{ tool, as?, args? }`, dengan `args` berisi argumen alat tanpa `path`.
- Operasi dicoba terlebih dahulu pada salinan dokumen. Operasi yang ditolak disebutkan, misalnya `operations[1] erd_remove_table: …`, dan tidak ada yang diterapkan.
- Satu `erd_undo` mengembalikan seluruh batch, kecuali operasi yang tidak dapat dikembalikannya, yang disebutkan oleh `undoNote` di hasil: operasi dari alat yang tidak membuat entri pembatalan, seperti `erd_set_database`, dan operasi yang mengubah dokumen tanpa membuatnya, seperti `erd_move_table_group` yang pendek. Batch yang sama sekali tidak membuat entri pembatalan dilewati oleh `erd_undo`. `historyEntries` di hasil menghitung entri riwayat editor di dalamnya, bukan panggilan `erd_undo`.
- Dalam sesi live, editor menerima seluruh batch atau tidak sama sekali.

Agen tidak dapat mengetahui id yang dibuat batch sebelum memanggilnya, sehingga operasi yang diberi nama dengan `as` memungkinkan operasi berikutnya merujuk ke id tersebut: `$name` atau `$name.0` untuk id pertama yang dibuatnya, `$name.1` untuk yang kedua, dan `$name.last` untuk yang terakhir.
Nama terdiri dari huruf ASCII, angka, dan garis bawah, tidak diawali angka, dan hanya menamai satu operasi.
Referensi hanya berlaku di tempat argumen menerima id entitas, sehingga nama atau komentar bertuliskan `$x` tetap berupa teks.

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

## Hasil {#results}

Perubahan dijawab dengan satu baris JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Field | Arti |
| --- | --- |
| `mode` | `live` atau `headless` — lihat [Live dan headless](./live-and-headless.md). |
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
| `protocolMismatch` | Ekstensi atau plugin ERD Editor di editor dan server menggunakan versi protokol yang berbeda, misalnya server `1.0.0` dengan ekstensi VS Code `3.x`. Pembacaan juga ditolak, dan pesan menyebutkan sisi yang perlu diperbarui — lihat [Memperbarui](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Hub editor tidak menerima koneksi, tidak menjawab dalam 30 detik, atau memutus koneksi selama panggilan. Di Windows, `hubUnreachable` juga berarti Windows menghalangi agen mengakses hub: editor berjalan dengan hak akses lebih tinggi daripada agen, seperti saat editor dijalankan sebagai administrator sedangkan agen tidak, atau agen berjalan di sandbox. |

Kode lain lebih jarang muncul, dan setiap penolakan menyertakan pesan yang menjelaskan apa yang terjadi.

Alat edit, `erd_batch`, dan tiga alat baca menolak argumen yang tidak dideklarasikannya, atau argumen dengan tipe yang salah, dengan kesalahan invalid params JSON-RPC (`-32602`) sebelum menyentuh dokumen, sehingga argumen yang salah eja tidak pernah dibuang diam-diam.
Lima alat sesi mengabaikan argumen yang tidak dikenalnya.
