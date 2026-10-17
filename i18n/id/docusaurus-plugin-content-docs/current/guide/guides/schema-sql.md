---
sidebar_position: 11
description: Membaca DDL diagram di tab Skema SQL, memilih database, tanda kutip, pernyataan, pembuka, dan tabel di panel opsinya, menambahkan skrip Anda sendiri sebelum dan setelah tabel, serta menyimpan atau menyalin SQL.
---

# Skema SQL

Tab `Schema SQL` menampilkan DDL diagram untuk database yang dipilih: SQL yang membuat tabelnya beserta kunci, indeks, dan kunci asingnya.  
Beralih ke tab `Schema SQL` di bilah alat, atau pilih `Schema SQL` di bawah `Tab` di [Pencarian Cepat](./quick-search.md). Memilih `Schema SQL` dari submenu `Export` juga membukanya, siap untuk disimpan — lihat [Menyimpan atau menyalin SQL](#saving-or-copying-the-sql).

SQL berada di sebelah kiri, dan di sebelah kanannya panel opsi berjudul `Schema SQL` memuat pilihan yang membentuknya — lihat [Panel opsi](#options-panel). Dalam bahasa tampilan kanan ke kiri pun, SQL tetap berada di sebelah kiri dan dibaca dari kiri ke kanan.  
Panel terbuka dengan sendirinya kecuali jika editor lebih sempit dari 640 px saat tab pertama kali dibuka. `Hide options` di header panel menciutkannya, dan `Show options` di kanan atas kode menampilkannya kembali. Setelah itu panel tetap terbuka atau terciut seperti yang Anda tinggalkan, meskipun berpindah tab, selama editor terbuka. Panel ini menciut dan terbuka secara terpisah dari panel tab Generator Kode, dan tidak pernah disimpan di file.

![Membuka Export > Schema SQL, mengubah pernyataan menjadi Drop & re-create dan pembuka menjadi USE, lalu menambahkan skrip SET NAMES sebelum tabel](/img/demo-schema-sql-options.webp)

Klik kanan SQL untuk membuka menu konteksnya:

- `Database` dan `Bracket`, masing-masing berupa submenu yang mencentang nilai saat ini.
- `Statements` dan `Header`, masing-masing berupa submenu yang mencentang pilihan yang berlaku. Pilihan yang tidak dimiliki database disertai catatan redup seperti `not in Oracle` dan tidak melakukan apa pun.
- `Options panel`, dicentang selama panel ditampilkan, yang menciutkan atau membuka panel.
- `Save file`

Selama tab ini terbuka, Pencarian Cepat menawarkan `Database` dan `Bracket`; `Schema SQL: Statements` dan `Schema SQL: Header`, yang hanya mencantumkan pilihan yang dimiliki database; serta `Schema SQL: Options panel`, yang menciutkan atau membuka panel.

SQL ditulis saat tab dibuka, dan ditulis lagi setiap kali salah satu pilihan panel, nama database, atau skrip berubah. Perubahan yang dilakukan pada tabel selama tab terbuka, seperti perubahan dari kolaborator atau agen pemrograman, baru terlihat setelah Anda meninggalkan tab lalu kembali, atau setelah salah satu hal tersebut berubah.

[Properti Tabel](./table-related-functions.md#table-properties) memiliki tab `Schema SQL` sendiri, yang menampilkan DDL satu tabel. Tab tersebut selalu menulis pernyataan `CREATE` biasa tanpa pembuka atau skrip, tidak memiliki panel opsi, dan menu konteksnya hanya menawarkan `Database` dan `Bracket`.

## Panel opsi {#options-panel}

Panel memuat tiga kelompok, masing-masing di bawah sebuah keterangan:

1. `Saved in the document`: `Database` dan `Bracket` — lihat [Database dan tanda kutip](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, dan, selama diagram memiliki [grup tabel](./table-groups.md), `Tables` — lihat [Pernyataan](#statements), [Pembuka](#header), dan [Tabel](#tables).
3. `Saved in the document · written as is for every database`: skrip `Before tables` dan `After tables` — lihat [Skrip sebelum dan setelah tabel](#before-and-after-scripts).

`Save file` dan `Copy` berada di bagian bawahnya — lihat [Menyimpan atau menyalin SQL](#saving-or-copying-the-sql).

Pilihan di bawah `This window only` terikat pada jendela editor tempat Anda membuatnya. Pilihan tersebut tidak disimpan di dokumen, tidak dibagikan dengan kolaborator, dan tidak dicatat untuk pembatalan, serta kembali ke nilai awal saat editor ditutup atau dimuat ulang; berpindah tab tetap mempertahankannya.  
`Statements` dimulai pada `If not exists` dan `Header` pada `CREATE + USE`. SQL yang dibaca halaman yang menyematkan editor dengan [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), dan SQL yang dibaca agen pemrograman, justru dimulai pada `Create` tanpa pembuka.

Pilihan yang tidak dimiliki database yang dipilih tetap ada di panel, diredupkan, dengan tooltip `Not in <database>`, seperti `Not in Oracle`, dan menekannya tidak melakukan apa pun.  
SQL kemudian menggunakan bentuk terdekat yang dimiliki database, dan tombol bentuk tersebut tampil tertekan: `If not exists` beralih ke `Create`, `CREATE + USE` ke `USE`, atau ke `None` jika database juga tidak memiliki `USE`, dan `USE` ke `None`. Pilihan Anda tetap dipertahankan, sehingga beralih ke database yang memilikinya mengembalikan pilihan tersebut.

## Database dan tanda kutip {#database-and-bracket}

`Database` adalah database diagram, pengaturan yang sama dengan `Database` di menu konteks kanvas dan database di Generator Kode — lihat [Database](./table-related-functions.md#databases). Pengaturan ini mencantumkan Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, dan SQLite, dimulai pada MySQL, dan disimpan di file seperti perubahan lainnya.

`Bracket` mengatur tanda kutip yang mengapit nama tabel, kolom, constraint, dan indeks: `SingleQuote`, `DoubleQuote`, `Backtick`, atau `None` untuk tanpa tanda kutip sama sekali, yang merupakan nilai default. Pengaturan ini sama dengan yang ada di Generator Kode — lihat [Tanda kutip](./code-generator.md#bracket).  
Snowflake, yang mengapit nama hanya dengan tanda kutip ganda, menggunakannya pada pilihan apa pun selain `None`, dan Databricks selalu mengapit nama dengan backtick.  
`Bracket` disimpan di file hanya selama penguncian `Bracket Type` di tab Pengaturan nonaktif, dan diagram baru memiliki semua penguncian dalam keadaan aktif. Selama penguncian aktif, perubahan menulis ulang SQL di layar Anda, tetapi file mempertahankan nilai terkunci dan diagram dibuka kembali dengan nilai tersebut — lihat [Penguncian](./settings.md#lock).

Selama database adalah Oracle dan SQL memuat nama yang lebih panjang dari 30 byte, yang ditolak oleh Oracle 12.1 dan versi yang lebih lama, sebuah catatan di bawah kedua daftar menyebutkan masing-masing nama tersebut: `Oracle 12.2+ for names over 30 bytes: <names>`. Catatan ini memeriksa nama tabel, kolom, skema, kunci, indeks, sequence, dan trigger. SQL itu sendiri tidak berubah.

## Pernyataan {#statements}

`Statements` menentukan cara tabel dibuat:

- `Create` menulis pernyataan `CREATE` biasa.
- `If not exists` melewati tabel dan indeks yang sudah ada. MySQL, MariaDB, PostgreSQL, SQLite, dan Databricks memilikinya; MSSQL, Oracle, dan Snowflake menulis `Create` sebagai gantinya.
  - MySQL menulis setiap tabel sebagai `CREATE TABLE IF NOT EXISTS` dengan constraint unik, indeks, dan kunci asingnya di dalamnya, dan menempatkan seluruh rangkaian pernyataan di antara `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` dan `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB menempatkan `IF NOT EXISTS` pada setiap pernyataan: `CREATE TABLE`, setiap constraint `UNIQUE` dan `FOREIGN KEY`, serta setiap `CREATE INDEX`.
  - PostgreSQL menulis `CREATE TABLE IF NOT EXISTS` dan `CREATE INDEX IF NOT EXISTS`, serta menghapus setiap kunci asing dengan `DROP CONSTRAINT IF EXISTS` sebelum menambahkannya kembali.
  - SQLite menulis `CREATE TABLE IF NOT EXISTS` dan `CREATE INDEX IF NOT EXISTS`.
  - Databricks menulis `CREATE TABLE IF NOT EXISTS`, dan menghapus setiap kunci asing dengan `DROP CONSTRAINT IF EXISTS` sebelum menambahkannya kembali.
- `Drop & re-create` menghapus setiap tabel yang ditulisnya sebelum membuatnya kembali, kecuali di Snowflake. Setiap database memilikinya:
  - MySQL dan MariaDB menulis `DROP TABLE IF EXISTS` untuk setiap tabel, di antara dua baris yang sama yang menonaktifkan pemeriksaan kunci asing lalu mengaktifkannya kembali.
  - PostgreSQL menulis satu `DROP TABLE IF EXISTS` yang menyebutkan setiap tabel, yang gagal jika sebuah tabel di luar daftar merujuk salah satunya. Di bawah pembuka `CREATE + USE`, tabel yang namanya tidak menyebutkan skema dihapus dari skema tersebut, misalnya `shop.member`.
  - MSSQL menulis satu transaksi, yang membutuhkan SQL Server 2016 atau yang lebih baru, seperti yang tertera pada tooltip tombolnya, `SQL Server 2016+`. Transaksi ini menghapus kunci asing yang dimiliki tabel yang ditulis, lalu tabelnya dengan satu `DROP TABLE IF EXISTS`, dan melakukan rollback jika terjadi kesalahan. Kunci asing yang dimiliki tabel di luar daftar tetap menghalangi penghapusan.
  - SQLite menulis `PRAGMA foreign_keys=OFF;`, yang tetap nonaktif untuk koneksi tersebut, lalu `DROP TABLE IF EXISTS` untuk setiap tabel.
  - Oracle menulis `DROP TABLE … CASCADE CONSTRAINTS` untuk setiap tabel dan `DROP SEQUENCE` untuk setiap sequence kenaikan otomatis, masing-masing dalam blok PL/SQL yang diakhiri baris `/` dan mengabaikan kesalahan yang muncul karena tabel atau sequence tidak ada.
  - Databricks menulis `DROP TABLE IF EXISTS` untuk setiap tabel.
  - Snowflake tidak menghapus apa pun dan menulis `CREATE OR REPLACE TABLE` sebagai gantinya.

Selama `Drop & re-create` berlaku, sebuah peringatan di panel menyebutkan tabel yang dihapusnya: `Drops <tables> before creating them. Their rows are lost.`, atau di Snowflake `Replaces <tables>. Their rows are lost.`  
Paling banyak lima tabel disebutkan secara lengkap. Jika lebih dari lima, peringatan menyebutkan empat tabel pertama dan menghitung sisanya, misalnya `a, b, c, d, and 3 more tables`.

## Pembuka {#header}

`Header` membuka SQL dengan pernyataan yang membuat atau memilih database, atau skema, tempat SQL tersebut dijalankan. Namanya adalah nama database diagram, yang diketik di kotak `database name` pada bilah alat, dan diapit dengan karakter `Bracket`.

- MySQL dan MariaDB: `USE` menulis `USE shop;`, dan `CREATE + USE` menulis `CREATE DATABASE IF NOT EXISTS shop;` sebelumnya.
- MSSQL: `USE` menulis `USE shop` dan `GO`, dan `CREATE + USE` menulis `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` dan `GO` sebelumnya.
- PostgreSQL hanya memiliki `CREATE + USE`, yang menulis `CREATE SCHEMA IF NOT EXISTS shop;` dan `SET search_path TO shop, public;`.
- Oracle hanya memiliki `USE`, yang menulis `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` beralih ke `USE`, sehingga inilah baris yang ditulis Oracle di bawah pembuka default tab ini.
- Snowflake dan Databricks: `USE` menulis `USE SCHEMA shop;`, dan `CREATE + USE` menulis `CREATE SCHEMA IF NOT EXISTS shop;` sebelumnya.
- SQLite tidak memiliki keduanya, dan tidak menulis pembuka.

Jika database memiliki `USE` atau `CREATE + USE`, tooltip tombolnya menyebutkan apa yang ditulisnya di sana, misalnya `CREATE SCHEMA + SET search_path` di PostgreSQL.

Pembuka hanya ditulis selama nama database merupakan pengenal biasa: huruf ASCII (`A`–`Z`, `a`–`z`) atau `_`, diikuti huruf ASCII, angka, atau `_`.  
Dengan nama lain apa pun, termasuk nama kosong, pembuka tidak ditulis, dan `DROP TABLE` milik PostgreSQL kemudian tidak menyebutkan skema. Selama pembuka selain `None` berlaku, sebuah catatan di bawah `Header` menyatakannya: `Database name "<name>" is not a valid identifier.`  
Nama database diagram baru kosong, sehingga sebelum Anda menamainya, panel menampilkan `Database name "" is not a valid identifier.`

## Tabel {#tables}

Selama diagram memiliki setidaknya satu [grup tabel](./table-groups.md), baik ditampilkan maupun disembunyikan, `Tables` muncul di bawah `This window only` dengan kotak centang untuk setiap pilihan:

- `All`, yang mencentang atau menghapus centang semua kotak. Kotak ini menampilkan status campuran selama hanya sebagian yang dicentang.
- Satu kotak per grup tabel, sesuai urutan grup di diagram, berlabel nama grup, atau `unnamed` untuk grup tanpa nama, setelah titik berwarna grup tersebut jika grup memiliki warna.
- `No group`, untuk tabel yang tidak berada di grup mana pun.

Dengan semua kotak dicentang, tab menulis seluruh diagram.  
Dengan hanya sebagian yang dicentang, tab menulis tabel dari kotak yang dicentang beserta indeksnya dan kunci asing yang dimilikinya, termasuk kunci asing yang merujuk tabel yang tidak disertakan. Skrip sebelum dan setelah tabel tetap ditulis, dan `Drop & re-create`, peringatannya, serta catatan Oracle tentang nama panjang hanya mencakup tabel-tabel tersebut.  
Tanpa kotak yang dicentang, tab tidak menulis apa pun, dan petunjuk di atas kode bertuliskan `No tables chosen. Check some under Tables.` `Save file` kemudian menyimpan file kosong, dan `Copy` menyalin teks kosong.

Seperti `Statements` dan `Header`, pilihan ini terikat pada jendela — lihat [Panel opsi](#options-panel).  
Grup yang ditambahkan kemudian hanya dimulai dalam keadaan dicentang jika semua kotak dicentang pada saat itu. Menghapus grup menghilangkan kotaknya, dan menghapus grup terakhir mencentang semuanya kembali.  
Pilihan ini hanya berlaku untuk tab ini. Tab `Schema SQL` di Properti Tabel dan `getSchemaSQL()` tidak terpengaruh olehnya.

## Skrip sebelum dan setelah tabel {#before-and-after-scripts}

`Before tables` dan `After tables` memuat SQL Anda sendiri, misalnya pernyataan `CREATE EXTENSION` atau `SET` sebelum tabel, atau pemberian hak akses, view, dan data awal setelahnya.  
Keduanya disimpan di dokumen, satu pasang untuk seluruh diagram apa pun databasenya. Masing-masing ditulis ke dalam SQL persis seperti yang Anda ketik, tanpa pernah diperiksa: skrip sebelum tabel diletakkan setelah pembuka dan sebelum pernyataan `DROP` serta tabel, dan skrip setelah tabel di bagian paling akhir.

Pemisah baris ditulis sebagai LF, dan baris kosong sebelum skrip serta karakter spasi setelahnya dibuang.  
Di MSSQL, baris `GO` ditambahkan setelah skrip yang baris terakhirnya bukan `GO` (atau `GO` dengan hitungan), seperti yang disebutkan baris di bawah kedua kotak. Di Oracle, akhiri sendiri blok PL/SQL dengan baris `/`-nya.

Kedua kotak menyorot sintaksis SQL dan membesar mengikuti teksnya.  
Perubahan diterapkan saat Anda meninggalkan kotak, dengan mengeklik di tempat lain atau berpindah tab, dan baru saat itulah SQL di sebelahnya dan dokumen berubah. Kotak yang hanya Anda klik tidak mengubah apa pun.  
Perubahan skrip mengubah diagram seperti perubahan lainnya: disimpan di file, terlihat oleh kolaborator, dan setiap perubahan yang diterapkan merupakan satu langkah dalam [riwayat pembatalan](./undo-redo.md), yang Anda batalkan dari tab ERD.  
Selama Anda mengetik di kotak, pintasan milik editor diserahkan kepada kotak tersebut, sehingga `Ctrl + Z` (Windows/Linux) atau `⌘ + Z` (Mac) membatalkan ketikan Anda di sana, dan menyalin, memotong, serta menempel bekerja pada teks, bukan pada diagram.  
Pencarian Cepat dan [pencarian Penjelajah](./find-and-replace.md) tetap dapat dibuka melalui pintasannya, `Ctrl + K` dan `Ctrl + F` (Windows/Linux) atau `⌘ + K` dan `⌘ + F` (Mac). Karena `Ctrl + F` atau `⌘ + F` beralih ke tab ERD, pintasan ini menerapkan perubahan Anda, seperti halnya setiap perpindahan tab.  
Kotak yang tidak memiliki fokus keyboard mengikuti perubahan yang dibuat kolaborator atau [agen pemrograman](../../mcp/tools.md#settings) pada skripnya. Kotak yang sedang Anda gunakan menampilkan perubahan itu saat Anda meninggalkannya tanpa mengetik apa pun. Jika Anda mengetik, teks Anda diterapkan saat Anda meninggalkannya dan menggantikan teks mereka.

## Menyimpan atau menyalin SQL {#saving-or-copying-the-sql}

`Save file`, di bagian bawah panel atau di menu konteks, menyimpan persis SQL yang ditampilkan tab, dengan database, tanda kutip, pernyataan, pembuka, tabel, dan skrip saat ini, sebagai `<database name>-<timestamp>.sql`. File tersebut dinamai dan disimpan seperti setiap ekspor lainnya — lihat [Mengekspor](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, di menu konteks kanvas atau di Pencarian Cepat, tidak menyimpan apa pun dengan sendirinya.  
Item ini beralih ke tab ini, membuka panel opsi meskipun sebelumnya terciut, dan menempatkan fokus keyboard pada `Save file`, sehingga menekan `Enter` menyimpan file.

`Copy` di bagian bawah panel, atau tombol salin yang muncul di kanan atas kode selama penunjuk berada di atasnya, menyalin SQL.  
Notifikasi `Copied!` dengan tanda centang mengonfirmasinya selama dua detik. Jika browser atau host menolak akses ke papan klip, notifikasi `Couldn't copy to the clipboard` dengan tanda peringatan memberitahukannya sebagai gantinya. Menyalin lagi menggantikan notifikasi tersebut alih-alih menambahkan notifikasi lain.  
SQL juga dapat dipilih, sehingga Anda dapat mengambil sebagiannya saja.

## Apa yang ditulis DDL {#what-the-ddl-writes}

Aturan ini berlaku di mana pun editor menulis Skema SQL: di tab ini dan di filenya, serta di SQL yang dibaca halaman yang menyematkan editor atau agen pemrograman.  
Tab `Schema SQL` di Properti Tabel mengikutinya untuk satu tabel yang ditampilkannya. Tab tersebut tidak menulis kunci asing, kecuali milik SQLite, yang berada di dalam `CREATE TABLE`-nya, dan tidak menulis sequence atau trigger Oracle.

Bagian-bagiannya muncul dalam urutan ini, dipisahkan satu baris kosong: pembuka, skrip sebelum tabel, pernyataan `DROP`, tabel, dan skrip setelah tabel. Tabel ditulis menurut urutan nama.  
Diagram tanpa tabel dan tanpa skrip tidak menulis apa pun, bahkan saat pembuka dipilih.

### Kenaikan otomatis {#auto-increment}

Kolom yang ditandai `Auto Increment` ditulis sesuai cara setiap database menulisnya: `AUTO_INCREMENT` di MySQL dan MariaDB, `IDENTITY(1,1)` di MSSQL, `AUTOINCREMENT` di Snowflake, dan `GENERATED ALWAYS AS IDENTITY` di PostgreSQL dan Databricks.  
Oracle mendapatkan sequence `SEQ_<table>` dan trigger `SEQ_TRG_<table>` yang mengisi kolom dari sequence tersebut. Trigger diakhiri baris `/`, sehingga SQL\*Plus dan SQLcl menjalankannya.

Jika sebuah database tidak menerima kenaikan otomatis pada tipe kolom tersebut, klausanya dihilangkan, dan sebuah baris komentar setelah tabel menyebutkan kolom tersebut:

- PostgreSQL hanya menerimanya pada `smallint`, `integer`, atau `bigint`, dengan nama mana pun dari ketiganya: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4`, atau `INT8`. Kolom bertipe lain tidak mendapatkan klausa maupun nilai default, dan komentarnya bertuliskan, misalnya, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks hanya menerimanya pada `BIGINT` atau `LONG`.
- SQLite hanya menerima `AUTOINCREMENT` pada satu-satunya kolom kunci utama sebuah tabel yang bertipe bilangan bulat, seperti `INT`, `BIGINT`, atau `INT8`, dengan atau tanpa lebar. Kolom tersebut ditulis sebagai `INTEGER`, dan kuncinya sebagai `PRIMARY KEY (id AUTOINCREMENT)`. Kunci tunggal bertipe lain ditulis tanpanya.

### Tindakan referensial {#referential-actions}

Tindakan ON DELETE dan ON UPDATE yang ditulis setiap database tercantum di [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Jika Snowflake menghilangkan suatu tindakan, komentar di atas `ALTER TABLE` kunci asing tersebut menyebutkannya, misalnya `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nama tabel berkualifikasi skema {#schema-qualified-table-names}

Dengan `Bracket` pada `None`, nama tabel yang mengandung titik, seperti `sales.users`, dibaca sebagai skema dan tabel, dipisahkan pada titik terakhirnya di luar kurung siku atau tanda kutip ganda.

- MySQL, MariaDB, MSSQL, Oracle, dan PostgreSQL menyusun nama otomatis yang ditulisnya hanya dari bagian tabel: `FK_users_TO_orders` dan `IDX_users` di kelima database tersebut, `UQ_users_email` di semuanya kecuali PostgreSQL, dan `PK_users` di MSSQL dan Oracle, dua di antara kelimanya yang menamai kunci utama. Di kedua database tersebut, `[sales].[users]` dan `"sales"."users"` juga menghasilkan `PK_users`, dan `[Order]` menghasilkan `PK_Order`.
- SQLite tidak menamai constraint, sehingga satu-satunya nama otomatis yang disusunnya adalah nama indeks: `CREATE INDEX sales.IDX_users ON users`.
- Oracle membuat indeks tabel, serta sequence dan trigger kolom kenaikan otomatis, di skema tabel tersebut: `sales.IDX_users`, `sales.SEQ_users`, dan `sales.SEQ_TRG_users`.
- Di Oracle dan SQLite, nama indeks yang Anda beri skema sendiri tetap mempertahankan skema tersebut.
- Nama kunci asing atau indeks otomatis yang mengulang nama sebelumnya, tanpa membedakan huruf besar dan kecil, diberi angka. Dengan `sales.users` dan `hr.Users` yang sama-sama dirujuk dari `orders`, kunci kedua menjadi `FK_Users_TO_orders1`.

Pada `Bracket` lainnya, seluruh nama tabel merupakan satu pengenal, seperti `"PK_sales.users"`. Snowflake dan Databricks selalu mempertahankan seluruh nama.  
Baris `Keys` pada tab [Indeks](./table-related-functions.md#indexes) menampilkan nama yang sama.

### Nilai default {#defaults}

Nilai default kolom ditulis seperti yang Anda ketik, tetapi dalam tanda kurung jika database hanya membaca ekspresi tersebut di dalamnya. Nilai default yang sudah berada dalam tanda kurung dibiarkan apa adanya.

- MySQL membungkus apa pun selain literal atau waktu saat ini, seperti `(uuid())`. MySQL juga membungkus nilai default apa pun selain `NULL` pada kolom `BLOB`, `TEXT`, `JSON`, spasial, atau `LONG…`, dan waktu saat ini pada kolom apa pun selain `TIMESTAMP` atau `DATETIME`.
- MariaDB membungkus apa pun selain literal, waktu saat ini, pemanggilan fungsi, atau nama.
- SQLite membungkus apa pun selain literal atau nama, seperti `(datetime('now'))`.
- PostgreSQL hanya membungkus ekspresi yang memuat kata seperti `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE`, atau `= ANY` di luar tanda kurung, seperti `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake, dan Databricks menulis setiap nilai default seperti yang diketik.

## Editor hanya baca {#read-only-editors}

Di editor `readonly`, tab bekerja seperti biasa: `Database` dan `Bracket` tetap mengubah SQL yang ditampilkan, `Statements`, `Header`, dan `Tables` tetap berfungsi, serta `Save file` dan `Copy` tetap menyimpan dan menyalinnya.  
Hanya kedua kotak skrip yang bersifat hanya baca.
