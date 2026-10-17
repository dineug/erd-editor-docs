---
sidebar_position: 2
description: Mengimpor JSON, Skema SQL, GraphQL, DBML, atau AML sebagai pengganti diagram atau sebagai tambahan di bawahnya, serta mengekspor JSON, Skema SQL, atau diagram sebagai gambar PNG atau SVG.
---

# Mengimpor atau mengekspor file

## Mengimpor file eksternal {#importing-external-files}

Lima format dapat diimpor dari submenu `Import` pada menu konteks kanvas:

- json
- Skema SQL
- GraphQL
- DBML
- AML

`Import and Add`, tepat di bawah `Import`, menambahkan file ke diagram alih-alih menggantikannya — lihat [Impor dan Tambahkan](#import-and-add).  
Layar sambutan yang ditampilkan diagram kosong memiliki item `Import` dengan lima format yang sama — lihat [Layar sambutan](./editing-start.md#welcome-screen).

Ekstensi dicocokkan tanpa membedakan huruf besar dan kecil. Memilih file yang ekstensinya tidak sesuai dengan format yang dipilih membatalkan impor dan menampilkan `Only <format> files can be imported`, dengan format ditulis `json`, `sql`, `graphql`, `dbml`, atau `aml`, seperti pada `Only sql files can be imported`.

`Import` menggantikan dokumen saat ini alih-alih menggabungkan file ke dalamnya, dan satu kali pembatalan mengembalikan diagram sebelumnya.  
File JSON membawa pengaturannya sendiri, termasuk [penguncian](./settings.md#lock) di dalamnya. Jika file mengunci tab, bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip, Anda tetap melihat nilai yang Anda miliki sebelumnya, tetapi nilai terkunci dari file itulah yang disimpan. Area pandang, terkunci atau tidak, berpindah ke posisi yang ditetapkan file. File JSON yang disimpan sebelum adanya penguncian masuk dengan semua penguncian aktif dan area pandang pada 100%.  
Format lainnya mempertahankan pengaturan yang sudah Anda miliki, termasuk penguncian, kecuali area pandang, yang dimulai pada 100%.  
Parser GraphQL, DBML, dan AML tidak pernah gagal: file yang tidak dapat dibacanya menghasilkan diagram kosong, bukan kesalahan.

File JSON mempertahankan posisi yang dimilikinya. Tabel dari file Skema SQL, GraphQL, DBML, atau AML ditempatkan sebelum diagram berubah:

- Jika file memiliki dua tabel atau lebih dan setidaknya satu hubungan, tabel ditata dengan [Tata Letak Otomatis](./table-related-functions.md#auto-layout) `Flow`, dari kiri ke kanan mengikuti hubungan, mulai dari kiri atas kanvas. Hubungan dari sebuah tabel ke dirinya sendiri ikut dihitung.
- Jika tidak, tabel disusun dalam baris dari kiri atas, dimulai dari tabel dengan kolom paling sedikit.
- Jika penataan berlangsung lebih dari 6 detik, pemberitahuan `Placing tables` muncul dengan tombol `Cancel`. `Cancel`, atau `Escape` selama pemberitahuan tampil, menghentikan penataan dan menyusun tabel dalam baris sebagai gantinya. Susunan baris juga digunakan, tanpa pemberitahuan, saat penataan gagal, saat tidak ada hasil penataan yang kembali dalam 60 detik, atau saat host tidak menjalankan shared worker — lihat [Web Worker](../../api/installation.md#web-workers).

Diagram kemudian diganti dalam satu langkah, sehingga tidak ada yang terlihat di tengah prosesnya. Pengaturan yang Anda ubah selama tabel ditempatkan, seperti tab, tetap dipertahankan, dan jika Anda mengimpor file lain sementara itu, impor yang dimulai paling akhir yang berlaku.

Editor hanya baca tidak memuat apa pun dari `Import` dan tidak menawarkan `Import and Add`.

### Impor dan Tambahkan {#import-and-add}

`Import and Add` mempertahankan diagram dan menambahkan file di bawahnya. Perintah ini ada di menu konteks kanvas dan di [Pencarian Cepat](./quick-search.md) pada tab ERD, serta menawarkan lima format yang sama dengan pemeriksaan ekstensi yang sama seperti `Import`.

![Menambahkan file SQL dari Import and Add > Schema SQL, tabelnya ditempatkan di bawah diagram, ditata mengikuti hubungannya, dan dipilih](/img/demo-import-and-add.webp)

File masuk seperti saat menempel: setiap tabel, kolom, hubungan, indeks, memo, dan [grup tabel](./table-groups.md) di dalamnya ditambahkan sebagai yang baru, tabel yang sudah ada di diagram tidak berpindah, dan tidak ada pengaturan yang berubah, sehingga pengaturan file JSON tidak disertakan.  
Tabel yang namanya sudah ada di diagram ditambahkan sebagai tabel kedua dengan nama tersebut, bukan digabungkan dengannya. Hubungan dan indeks hanya berasal dari file, sehingga kunci asing ke tabel yang tidak didefinisikan file tidak ditautkan ke tabel yang sudah ada di diagram.

Blok yang ditambahkan ditempatkan tepat di bawah semua isi diagram, sejajar dengan tepi kirinya, atau di kiri atas jika diagram kosong. Memo dan grup tabel yang disembunyikan dengan [opsi tampilan](./table-related-functions.md#table-view-options) juga ikut dihitung, karena keduanya masih berada di tempatnya.  
Di dalam blok, file JSON mempertahankan susunannya sendiri, termasuk grup tabelnya. Format lainnya ditempatkan seperti yang dilakukan `Import`, dengan `Flow` atau dalam baris berdasarkan aturan yang sama, dan kotak setiap grup tabel disesuaikan mengelilingi tabelnya. Tabel dan memo yang ditambahkan ditumpuk di atas semua yang sudah ada.

Begitu blok ditempatkan, hanya yang ditambahkan yang dipilih: tabel baru, serta memo dan grup tabel baru selama keduanya ditampilkan. Jika Anda berpindah ke tab lain sementara itu, editor kembali ke tab ERD sebelum blok ditempatkan. Area pandang kemudian bergulir ke blok pada tingkat zoom saat ini, kecuali jika area pandang sudah menampilkannya dengan baik — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands). Satu kali pembatalan menarik kembali seluruh penambahan.  
File yang tidak dapat dibaca parser, atau file tanpa tabel dan tanpa memo, tidak menambahkan apa pun.

Jika beberapa file Skema SQL, GraphQL, DBML, atau AML ditambahkan selama satu file masih ditempatkan, semuanya ditempatkan sesuai urutan dimulainya. File JSON yang ditambahkan sementara itu ditempatkan segera setelah dibaca, mendahului file-file tersebut. `Import`, atau memuat dokumen lain, membuang file mana pun yang masih ditempatkan.

Agen pemrograman menambahkan file dengan cara yang sama melalui mode `append` pada alat impor MCP, yang mempertahankan susunan file JSON tetapi menyusun tabel dari format lainnya dalam baris, tidak pernah dengan `Flow` — lihat [Impor](../../mcp/tools.md#import).

### JSON {#json}

Anda dapat mengimpor file dalam [format skema yang ditetapkan di editor](../../api/advanced/schema.md).
Nama file harus berakhiran `.json`, sehingga file yang diekspor sebagai `<database name>-<timestamp>.erd.json` dapat diimpor kembali apa adanya; file yang hanya berakhiran `.erd` atau `.vuerd` tidak diterima di sini. File yang disimpan oleh rilis sebelumnya juga dapat dibaca.

![Mengimpor file tersimpan dari Import > json, menggantikan dokumen draf beserta pengaturannya](/img/demo-import-json.webp)

### Skema SQL {#schema-sql}

Anda juga dapat mengimpor file skema yang didefinisikan dalam SQL.  
Meskipun parser telah dibuat sefleksibel mungkin terlepas dari vendor database, mungkin masih ada sintaksis yang tidak didukung.  
Nama file harus berakhiran `.sql`.  
[Sintaksis yang didukung dapat diperiksa di sini.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Mengimpor file SQL dari Import > Schema SQL, tabelnya ditata mengikuti hubungannya, lalu memperkecil zoom untuk melihat semuanya](/img/demo-import-sql.webp)

Kolom hanya berasal dari `CREATE TABLE`. Kolom yang ditambahkan oleh `ALTER TABLE ... ADD COLUMN` tidak dibaca.  
Item `CREATE TABLE` yang bukan kolom dilewati alih-alih dibaca sebagai kolom: `CHECK (...)` tanpa nama, `LIKE` dan `EXCLUDE` milik PostgreSQL, `FULLTEXT` dan `SPATIAL` milik MySQL yang ditulis tanpa `INDEX` atau `KEY`, `PERIOD FOR` milik T-SQL, dan `SUPPLEMENTAL LOG DATA` milik Oracle.  
Kolom yang dinamai sesuai salah satunya tetap diimpor jika tipe bawaan mengikuti namanya, seperti pada `exclude BOOLEAN`, atau jika namanya diberi tanda kutip, seperti pada `"check" int`. `like` tanpa tanda kutip yang diikuti tipe yang bukan bawaan, misalnya `like citext`, dibaca sebagai `LIKE` milik PostgreSQL dan dilewati.  
Constraint `CHECK` itu sendiri tidak diimpor, karena editor tidak memiliki tempat untuk menyimpannya.

#### Tipe data {#data-types}

Tipe data kolom dipertahankan, termasuk daftar argumennya, bahkan saat tipe tersebut bukan tipe bawaan dari [database yang didukung](./table-related-functions.md#databases) mana pun.  
Hal ini mencakup enum atau tipe komposit yang dibuat dengan `CREATE TYPE`, domain yang dibuat dengan `CREATE DOMAIN`, tipe ekstensi seperti `hstore`, `citext`, dan `ltree`, nama berkualifikasi skema seperti `public.mood`, serta nama bertanda kutip atau berkurung siku seperti `"MyType"` dan `[dbo].[Phone]`, yang mempertahankan tanda kutip atau kurung sikunya. Pernyataan `CREATE TYPE`, `CREATE DOMAIN`, dan `CREATE EXTENSION` itu sendiri dilewati.  
Tipe bawaan melepas tanda kutip atau kurung sikunya, sehingga `[int]` masuk sebagai `int` dan `[nvarchar](50)` sebagai `nvarchar(50)`. `"char"` dan `"bit"` milik PostgreSQL mempertahankannya, karena keduanya merupakan tipe yang berbeda dari `char` dan `bit`.  
Akhiran array tetap melekat pada tipe apa pun: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. `UNSIGNED BIG INT` milik SQLite masuk secara utuh.  
`UNSIGNED` dan `ZEROFILL` milik MySQL dan MariaDB, yang ditulis tepat setelah tipe dan argumennya, tetap menjadi bagian dari tipe sebagaimana ditulis: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, `int unsigned` milik mysqldump. `SIGNED`, yang merupakan default, dibuang, sehingga `TINYINT SIGNED` masuk sebagai `TINYINT`. Pengubah yang ditulis setelah opsi kolom lain, seperti pada `INT NOT NULL UNSIGNED`, yang ditolak MySQL, dibuang.  
Nilai `ENUM(...)` dan `SET(...)` mempertahankan tanda kutipnya, dengan tanda kutip di dalam nilai digandakan, seperti pada `ENUM('a','it''s')`. `'it\'s'` milik MySQL, yang di-escape dengan garis miring terbalik, juga masuk dalam bentuk digandakan dengan cara yang sama. Pada tipe `STRUCT<...>` Databricks, nama field yang bertanda kutip dan `COMMENT` sebuah field mempertahankan tanda kutipnya.  
Kolom yang ditulis tanpa tipe, seperti kolom SQLite tanpa tipe atau kolom terhitung `AS`, tetap tanpa tipe: kata kunci seperti `NOT`, `NULL`, `DEFAULT`, `PRIMARY`, atau `REFERENCES`, maupun string bertanda kutip tunggal, tidak dibaca sebagai tipe.

#### Nilai default {#defaults}

`DEFAULT` sebuah kolom mempertahankan seluruh ekspresinya, seperti `now()`, `0.5`, `CURRENT_TIMESTAMP`, atau `ARRAY[]::text[]`, hingga opsi kolom berikutnya, koma, atau tanda kurung penutup. `CASE ... END` dibaca secara utuh.  
Tanda kurung yang mengapit seluruh ekspresi dilepas, sehingga `((0))` milik SQL Server masuk sebagai `0` dan `(getdate())` sebagai `getdate()`. Cast dari sebuah literal juga dilepas, sehingga `'draft'::character varying` milik pg_dump masuk sebagai `'draft'` dan `NULL::character varying` sebagai `NULL`; cast lainnya tetap ada, seperti pada `ARRAY[]::text[]` dan `lower('A'::text)`.  
`ON UPDATE CURRENT_TIMESTAMP` milik MySQL dibuang, karena kolom tidak memiliki tempat untuknya, dan nilai default sebelumnya tetap ada. `DEFAULT ON NULL 0` milik Oracle, dengan atau tanpa `FOR INSERT ONLY` atau `FOR INSERT AND UPDATE`, masuk sebagai `0`.  
String dengan awalan, seperti `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'`, atau `_utf8mb4'x'`, dibaca sebagai satu string, bahkan jika ada tanda kurung di dalamnya.

SQL Server Management Studio menulis nilai default setelah tabel, sebagai `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Pernyataan seperti itu menetapkan nilai default kolom tersebut, di sini `1`, dan nama constraint-nya dibuang.

Ekspor Skema SQL menambahkan kembali tanda kurung untuk database yang hanya membaca ekspresi nilai default di dalam tanda kurung — lihat [Nilai default](./schema-sql.md#defaults).

#### Kenaikan otomatis {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT`, dan `IDENTITY` mengaktifkan `Auto Increment` sebuah kolom, begitu pula `GENERATED ALWAYS AS IDENTITY` dan `GENERATED BY DEFAULT AS IDENTITY`, yang tidak meninggalkan nilai default.  
Hal yang sama berlaku untuk nilai default yang berupa satu panggilan `nextval()` PostgreSQL, yaitu nilai default yang didapat kolom serial, yang ditulis `nextval('s')` atau, seperti yang ditulis pg_dump, `nextval('s'::regclass)`. Nama sequence tidak dipertahankan. Nilai default yang hanya menggunakan sequence, seperti `nextval('s') + 1` atau `NEXT VALUE FOR s` milik SQL Server, tetap menjadi nilai default biasa.  
pg_dump menulis keduanya setelah tabel, sebagai `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` dan `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Masing-masing pernyataan tersebut mengaktifkan `Auto Increment` kolom tersebut dan mengosongkan nilai defaultnya. `CREATE SEQUENCE`, `ALTER SEQUENCE`, dan setiap tindakan `ALTER COLUMN` lainnya dilewati.  
Kolom yang diberi tipe inline `serial`, `bigserial`, atau `smallserial` mempertahankan tipe tersebut, dengan `Auto Increment` nonaktif.

Editor hanya menyimpan penanda `Auto Increment`, dan setiap database menulis bentuknya sendiri saat ekspor — lihat [Kenaikan otomatis](./schema-sql.md#auto-increment). Ekspor PostgreSQL menulis `GENERATED ALWAYS AS IDENTITY` pada kolom `smallint`, `integer`, atau `bigint`, apa pun bentuk yang diimpor, dan pada tipe lainnya, seperti `INT UNSIGNED`, hanya sebuah baris komentar setelah tabel. Opsi sequence seperti `START WITH 100` hilang.  
Tabel dengan beberapa kolom serial atau identity diimpor dengan beberapa kolom kenaikan otomatis, dan MySQL, MariaDB, serta SQL Server menolak tabel seperti itu saat hasil ekspornya dijalankan.

#### Kunci utama {#primary-keys}

Kunci utama yang ditambahkan setelah tabelnya, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, menandai kolom-kolomnya sebagai kunci utama.  
`CLUSTERED` atau `NONCLUSTERED` milik SQL Server dan `USING BTREE` milik MySQL sebelum daftar kolom dilompati saat dibaca, sehingga `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` yang ditulis SQL Server Management Studio menjadikan `Id` sebagai kunci. `PRIMARY KEY NONCLUSTERED HASH (...)` milik tabel yang dioptimalkan untuk memori tidak dibaca, baik di `ALTER TABLE` maupun di `CREATE TABLE`.

#### Kunci unik dan indeks {#unique-keys-and-indexes}

`UNIQUE` atas dua kolom atau lebih menjadi satu indeks unik, dalam setiap bentuk penulisan: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, `INDEX n UNIQUE (a, b)` inline milik SQL Server, dan `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
Indeks tersebut mengambil nama indeks dari kunci, jika tidak ada maka nama `CONSTRAINT`-nya, jika tidak ada juga maka tanpa nama, dan mempertahankan arah pengurutan setiap kolom. Indeks seperti itu merupakan [kunci alternatif](./table-related-functions.md#alternate-keys).  
`UNIQUE` atas satu kolom, dalam bentuk penulisan mana pun di atas, justru menandai kolom tersebut sebagai Unik dan tidak menambahkan indeks, sehingga constraint `UQ_<table name>_<column name>` yang ditulis oleh ekspor dikembalikan menjadi penanda asalnya. `CREATE UNIQUE INDEX` atas satu kolom tetap menjadi indeks unik.

`ALTER TABLE` yang menambahkan beberapa kunci sekaligus, seperti `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` yang ditulis phpMyAdmin, mempertahankan setiap kunci unik di dalamnya: `uq_a` masuk sebagai indeks unik bernama `uq_a`, dan `uq_c` sebagai penanda Unik pada `c`. Nama `CONSTRAINT` hanya menamai kunci dalam klausanya sendiri. `ADD UNIQUE INDEX IF NOT EXISTS n (...)` milik MariaDB serta `ALTER TABLE t WITH CHECK ADD ...` dan `WITH NOCHECK ADD ...` milik SQL Server juga dibaca.  
`CREATE INDEX` dan `CREATE UNIQUE INDEX` dibaca dengan nama berkualifikasi seperti `public.t` dan `[dbo].[t]`, `CLUSTERED` dan `NONCLUSTERED` milik SQL Server, `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY`, dan `USING btree` milik PostgreSQL, serta tanpa nama indeks sama sekali. Filegroup `ON [PRIMARY]` milik SQL Server diabaikan.  
Opsi kunci seperti `NULLS NOT DISTINCT` atau `USING BTREE` tidak disangka sebagai nama kunci. Dalam daftar kolom kunci, hanya kata pertama yang menamai kolom, sehingga `b DESC NULLS LAST`, `b text_pattern_ops`, dan `b COLLATE "C"` semuanya menjadikan `b` sebagai kunci, dengan `DESC` dipertahankan sebagai arah pengurutannya. Panjang awalan seperti `email(191)` dilompati saat dibaca, tetapi kunci dengan bagian ekspresi, seperti `lower(email)`, dilewati seluruhnya.

Indeks unik parsial, `CREATE UNIQUE INDEX ... WHERE ...` atau `INDEX n UNIQUE (...) WHERE ...` inline milik SQL Server, masuk sebagai indeks biasa dengan nama dan kolom yang sama, karena kunci yang unik di seluruh tabel akan lebih ketat daripada kunci terfilter yang dideklarasikan file. Pengecualiannya adalah filter yang hanya terdiri atas uji `IS NOT NULL` pada kolom-kolom kunci yang digabungkan dengan `AND`, yaitu filter yang dibutuhkan SQL Server agar kolom unik dapat menampung lebih dari satu NULL: kunci tersebut tetap unik.  
Kunci unik yang menyebut kolom yang tidak dimiliki tabel, misalnya kolom yang ditambahkan oleh `ALTER TABLE ... ADD COLUMN`, dibuang seluruhnya alih-alih dipangkas menjadi kolom-kolom yang ada. Indeks biasa mempertahankan kolom-kolom yang ada.

SQL Developer dari Oracle dan `DBMS_METADATA` menulis indeks milik kunci sebagai `CREATE UNIQUE INDEX` terpisah, yang dinamai sesuai kunci atau, untuk kunci tanpa nama yang diikuti `USING INDEX`, dengan nama sistem seperti `SYS_C0012345`. Impor membaca indeks seperti itu, dan indeks yang disebut oleh `ADD CONSTRAINT ... USING INDEX`, sebagai bagian dari kuncinya: kunci unik komposit masuk sebagai satu indeks unik, dan kunci utama atau kunci unik satu kolom sebagai penanda kolom tanpa indeks tambahan. Ekspor kembali ke Oracle kemudian membuat indeks tersebut satu kali.

Ekspor Skema SQL diimpor kembali menjadi penanda Unik dan indeks yang sama untuk MySQL, MariaDB, MSSQL, Oracle, PostgreSQL, dan SQLite.  
Snowflake tidak memiliki indeks sekunder, sehingga ekspornya hanya mengembalikan kunci unik: kunci komposit sebagai indeks unik dan kunci satu kolom sebagai penanda Unik pada kolom. Ekspor Databricks tidak mendeklarasikan keunikan, sehingga tidak ada yang kembali.

#### Kunci asing {#foreign-keys}

Kunci asing menjadi hubungan dalam bentuk penulisan berikut:

- `FOREIGN KEY (...) REFERENCES t (...)` tingkat tabel, dengan atau tanpa `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, termasuk `ALTER TABLE t WITH CHECK ADD ...` dan `WITH NOCHECK ADD ...` yang ditulis SQL Server Management Studio.
- `REFERENCES t (col)` inline pada kolom, seperti pada `user_id INT REFERENCES users (id)`, dan `FOREIGN KEY REFERENCES t (col)` yang diizinkan SQL Server dan Snowflake di sana. Referensi inline ke lebih dari satu kolom dilewati.

`ALTER TABLE` menghasilkan paling banyak satu hubungan, dan hanya jika klausa pertamanya menambahkan kunci asing: klausa `FOREIGN KEY` setelah klausa `ADD PRIMARY KEY` atau `ADD UNIQUE` dalam pernyataan yang sama tidak dibaca. Jika satu pernyataan menambahkan beberapa kunci asing, seperti `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` yang ditulis phpMyAdmin, hanya yang terakhir yang dibaca.

`REFERENCES t` tanpa daftar kolom menunjuk ke kunci utama `t` jika kunci tersebut terdiri atas satu kolom. Jika merujuk kunci utama komposit, kunci asing tersebut dilewati.  
Kunci asing dilewati, dan tidak satu pun kolomnya ditandai sebagai kunci asing, jika tidak satu pun kolom yang dirujuknya ditemukan, atau jika jumlah kolom yang ditemukan di kedua tabel berbeda, misalnya saat sebuah kolom hanya tidak ada di salah satunya. Jika jumlah kolom yang tidak ditemukan sama di kedua tabel, kolom-kolom yang ditemukan dipasangkan sesuai urutan penulisan, dan hubungan hanya memuat kolom-kolom tersebut.  
Setiap hubungan yang diimpor bertipe `Zero N`, dan merupakan hubungan pengidentifikasi jika setiap kolom anaknya juga merupakan kunci utama.

Klausa `ON DELETE` dan `ON UPDATE` setiap kunci asing menjadi `On Delete` dan `On Update` hubungan tersebut: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, atau `SET DEFAULT`, tanpa membedakan huruf besar dan kecil serta dalam urutan mana pun. Kunci asing tanpa klausa tersebut diimpor sebagai `Not set`. Lihat [Pengeditan hubungan](./relationship-editing.md#on-delete-and-on-update) untuk mengaturnya di editor.  
Daftar kolom PostgreSQL setelah `SET NULL` atau `SET DEFAULT`, seperti pada `ON DELETE SET NULL (a_id)`, dilompati saat dibaca: tindakan berlaku untuk seluruh kunci, dan `ON UPDATE` setelah daftar tersebut tetap dibaca. `MATCH FULL`, `MATCH PARTIAL`, dan `MATCH SIMPLE` dilewati, dan atribut kolom `ON UPDATE CURRENT_TIMESTAMP` milik MySQL tidak disangka sebagai tindakan.  
Ekspor Skema SQL diimpor kembali dengan tindakan yang ditulis database tersebut, sehingga tindakan yang tidak ditulisnya, seperti `SET DEFAULT` pada MySQL, `ON UPDATE` apa pun pada Oracle, atau apa pun selain `NO ACTION` pada Snowflake, kembali sebagai `Not set`.

#### Komentar {#comments}

Komentar tabel dan kolom diimpor dari tiga sintaksis yang dibaca parser: opsi tabel dan atribut kolom `COMMENT` yang digunakan MySQL, MariaDB, Snowflake, dan Databricks, pernyataan `COMMENT ON TABLE` dan `COMMENT ON COLUMN` yang digunakan PostgreSQL dan Oracle, serta properti yang diperluas `MS_Description` yang ditetapkan SQL Server dengan `EXEC sp_addextendedproperty`.  
Komentar yang menyebut tabel atau kolom yang tidak didefinisikan file diabaikan.

Panggilan SQL Server dibaca dengan argumen bernama, seperti cara SQL Server Management Studio menulis setiap komentar (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), dan dengan argumen posisional, seperti cara ekspor MSSQL editor menulisnya.  
Hanya `MS_Description` pada tabel, atau pada salah satu kolomnya di level 2, yang menghasilkan komentar. Properti lain, view, indeks, atau constraint tidak menghasilkan komentar, begitu pula komentar yang diteruskan dalam variabel atau disusun dengan `+`.

Dalam komentar, seperti dalam teks bertanda kutip apa pun, misalnya nilai `DEFAULT` atau nama bertanda kutip, tanda kutip yang digandakan mewakili satu tanda kutip, sebagaimana mysqldump dan pg_dump menulisnya: `'it''s'` dibaca sebagai `it's`.  
Garis miring terbalik sebelum tanda kutip, seperti `'it\'s'` yang ditulis MySQL dan MariaDB, juga meng-escape tanda kutip tersebut. Tanda kutip seperti itu tetap mengakhiri teks jika diikuti spasi kosong, `,`, `;`, `)`, `]`, `:`, `|`, `+`, atau akhir file, sehingga `'C:\'`, `'C:\'::text` milik pg_dump, dan `'C:\'+name` milik T-SQL mempertahankan garis miring terbaliknya.  
Nilai `DEFAULT` mempertahankan tanda kutipnya, dan tanda kutip di dalamnya ditulis kembali dalam bentuk digandakan, apa pun cara file meng-escape-nya: `'it''s'`.  
Jika database dokumen adalah Databricks saat impor, teks bertanda kutip tunggal mengikuti aturan Spark sebagai gantinya: setiap garis miring terbalik meng-escape karakter sesudahnya, sehingga `'C:\\dir'` dibaca sebagai `C:\dir`, urutan escape seperti `\n`, `\t`, dan `\u0041` didekode, dan nilai `DEFAULT` dipertahankan sebagai `'it\'s'`.

Skema SQL yang diekspor meng-escape tanda kutip di dalam komentar tabel atau kolom: `COMMENT 'it''s'` untuk MySQL, MariaDB, dan Snowflake, `COMMENT ON TABLE` dan `COMMENT ON COLUMN ... IS 'it''s'` untuk PostgreSQL dan Oracle, serta penggandaan yang sama, termasuk nama tabel dan kolom, dalam panggilan `sp_addextendedproperty` MSSQL. Komentar tanpa tanda kutip ditulis apa adanya.  
Databricks justru meng-escape tanda kutip dan garis miring terbalik dengan garis miring terbalik, seperti pada `COMMENT 'it\'s'`, sehingga ekspornya hanya terbaca kembali dengan tepat selama Databricks menjadi database yang dipilih.  
MSSQL menulis setiap komentar sebagai `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`, diikuti `'column', '<column>'` untuk kolom. Dengan `Bracket` pada `None`, tabel bernama `sales.users` menghasilkan skema `sales` dan tabel `users`, dan nama tanpa skema berada di `dbo`. Dengan nilai `Bracket` lainnya, seluruh nama menjadi nama tabel, di `dbo`.

Komentar tidak bertahan dalam siklus ekspor lalu impor SQLite: SQLite menuliskannya sebagai baris `--` biasa, yang tidak dibaca parser. Panggilan `sp_addextendedproperty` dari ekspor MSSQL diimpor kembali sebagai komentar tabel dan kolom yang sama.

### GraphQL {#graphql}

Anda dapat mengimpor dokumen SDL GraphQL.  
Definisi tipe objek menjadi tabel, blok `extend type` digabungkan ke tipe yang diperluasnya, dan field interface diwarisi oleh tipe yang mengimplementasikannya.  
Field yang tipenya adalah tabel lain menjadi hubungan alih-alih kolom, dan list di kedua sisi membuat tabel penghubung.  
Field tunggal seperti `buyer: User` pertama-tama dipasangkan dengan satu-satunya field pada tipe lain yang namanya berakhiran `By` diikuti nama field tersebut, seperti `orderListByBuyer`, tanpa membedakan huruf besar dan kecil serta mengabaikan garis bawah; field bernomor seperti `buyer2` dipasangkan dengan cara yang sama tanpa nomornya. Begitulah keluaran GraphQL dari Generator Kode menamai field saat dua tabel berbagi lebih dari satu hubungan atau sebuah tabel merujuk dirinya sendiri, sehingga keluaran seperti itu diimpor kembali dengan setiap hubungannya.  
Tipe root (`Query`, `Mutation`, `Subscription`), tipe introspeksi, serta pembungkus Relay, federasi, dan Hasura seperti `PageInfo`, `*Connection`, `*Edge`, dan `*_aggregate` dianggap sebagai derau dan dilewati.  
Direktif `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index`, dan `@db.*` diterapkan.  
Nama file harus berakhiran `.graphql`, `.gql`, atau `.graphqls`. File `schema.prisma` Prisma bukan dokumen GraphQL dan tidak dapat diimpor di sini.

### DBML {#dbml}

Anda dapat mengimpor file DBML, format yang digunakan oleh dbdiagram.io dan dbdocs.  
Blok `Table`, `TablePartial`, `Ref`, `Enum`, dan `TableGroup` dibaca. Blok `Project` dan `Note` yang berdiri sendiri dilewati tanpa memengaruhi tabel di sekitarnya.  
Setiap bentuk penulisan ref diterima: bentuk titik dua `Ref:`, ref bernama, bentuk blok `Ref { }`, dan pengaturan kolom inline `[ref: > table.column]`.  
Ref banyak-ke-banyak `<>` membuat tabel penghubung yang dinamai sesuai kedua sisinya.  
Pengaturan `delete` dan `update` pada ref yang berdiri sendiri menjadi `On Delete` dan `On Update` hubungan tersebut, seperti pada `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Nilainya adalah `cascade`, `restrict`, `set null`, `set default`, dan `no action`, tanpa membedakan huruf besar dan kecil. Nilai lain, atau tanpa pengaturan, diimpor sebagai `Not set`, dan pengaturan lain seperti `color` diabaikan.  
Pengaturan inline `[ref: ...]` tidak membawa tindakan, dan pengaturan ref `<>` tidak diteruskan ke tabel penghubung. Jika kunci asing yang sama dideklarasikan baik secara inline maupun sebagai ref yang berdiri sendiri, yang inline dipertahankan, tanpa tindakan.  
Pengaturan `headercolor` sebuah tabel, seperti pada `Table users [headercolor: #3498DB]`, menjadi warnanya jika nilainya berupa hex `#rgb` atau `#rrggbb` yang ditulis tanpa tanda kutip. Nilai lainnya dibuang, dan `headercolor` milik `TablePartial` tidak diteruskan ke tabel yang menggunakannya.  
Setiap `TableGroup` menjadi [grup tabel](./table-groups.md) yang berisi tabel-tabel yang didaftarkannya, satu per baris, dinamai seperti `Ref` menamainya. `[color: ...]` miliknya menjadi warna grup berdasarkan aturan yang sama dengan `headercolor`, dan catatan serta pengaturan lainnya dibuang. Tabel yang didaftarkan oleh dua grup tetap berada di grup pertama. Grup yang tersisa tanpa tabel tidak dibuat, baik karena tidak mendaftarkan satu pun tabel yang dideklarasikan file maupun karena hanya mendaftarkan tabel yang sudah diambil grup sebelumnya. Kotak grup disesuaikan mengelilingi tabelnya di mana pun tabel itu ditempatkan, dan saat tabel disusun dalam baris, tabel-tabel suatu grup tetap berdekatan.  
Nama file harus berakhiran `.dbml`.

### AML {#aml}

Anda dapat mengimpor file AML (Azimutt Markup Language). Baik bentuk penulisan saat ini maupun bentuk lama v1 diterima.  
Entitas menjadi tabel, dan atribut bersarang diratakan menjadi nama kolom bertitik seperti `settings.slug`.  
Atribut bersifat `NOT NULL` kecuali ditandai `nullable`, dan konstruksi yang tidak memiliki tempat di editor, seperti `check`, `type`, dan `tags`, dibuang alih-alih ditolak. Entitas yang ditandai sebagai view masuk sebagai tabel biasa.  
`color` sebuah entitas, seperti pada `users {color: red}`, menjadi warna tabelnya. Nama warna AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, dan `gray`, dibaca tanpa membedakan huruf besar dan kecil, bertanda kutip atau tidak, masing-masing sebagai tingkat 500 dari warna Tailwind dengan nama tersebut, seperti `#ef4444` untuk `red`. Hex bertanda kutip seperti `"#3498db"` dipertahankan sebagaimana ditulis; `#3498db` tanpa tanda kutip tidak dapat dibaca, karena `#` mengawali komentar AML. Nilai lainnya, serta `color` pada atribut atau hubungan, dibuang.  
Pernyataan `rel` yang berdiri sendiri, atau `fk` dalam bentuk penulisan lama, mempertahankan properti `onDelete` dan `onUpdate`-nya sebagai `On Delete` dan `On Update` hubungan tersebut, seperti pada `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Nilainya adalah `cascade`, `restrict`, `set null`, `set default`, dan `no action`, bertanda kutip atau tidak, tanpa membedakan huruf besar dan kecil. Properti lainnya dibuang.  
Pada hubungan inline seperti `user_id int -> users(id) {onDelete: cascade}`, properti tersebut milik atribut, sehingga dibuang dan hubungan diimpor sebagai `Not set`.  
Nama file harus berakhiran `.aml`.

GraphQL, DBML, dan AML adalah format dua arah: masing-masing juga merupakan target [Generator Kode](./code-generator.md).  
DBML dan AML membawa ON DELETE dan ON UPDATE setiap hubungan dalam dua arah — lihat [Generator Kode](./code-generator.md#on-delete-and-on-update). GraphQL tidak membawa keduanya, sehingga impor GraphQL membiarkan keduanya `Not set`.  
DBML juga membawa warna tabel, tanpa transparansinya, dan setiap grup tabel yang berisi tabel, dalam dua arah. Grup tanpa nama kembali sebagai `group_1`, `group_2`, dan seterusnya, dan nama grup yang berulang kembali dengan tambahan `_2`, `_3`, dan seterusnya. AML membawa warna tabel hanya sebagai nama warnanya yang terdekat, sehingga `#FF8800` ditulis sebagai `orange` dan kembali sebagai `#f97316`, dan AML tidak membawa grup. GraphQL tidak membawa warna maupun grup.

## Mengekspor {#exporting}

Submenu `Export` pada menu konteks kanvas memiliki tiga item:

- json: Menyimpan diagram sebagaimana dimuat dalam filenya, sebagai `.erd.json`: tabel beserta kolom dan indeksnya, hubungan, memo, dan grup tabel, serta pengaturan, dengan setiap [pengaturan yang terkunci](./settings.md#lock) pada nilai terkuncinya.
- Skema SQL: Membuka tab [Skema SQL](./schema-sql.md#saving-or-copying-the-sql) dengan panel opsinya terbuka dan tombol `Save file` mendapat fokus, sehingga menekan `Enter` menyimpan SQL yang ditampilkan tab sebagai `.sql`. Tidak ada yang disimpan hingga saat itu.
- Gambar: Membuka dialog `Export image`, yang menyimpan diagram sebagai `.png` atau `.svg`, atau menyalinnya ke papan klip sebagai PNG — lihat [Gambar](#image).

Ketiganya berfungsi di editor hanya baca.

Skema SQL menulis ON DELETE dan ON UPDATE setiap hubungan setelah `REFERENCES`-nya, dengan ON DELETE lebih dulu. `Not set` tidak menulis apa pun, dan tindakan yang tidak diterima database yang dipilih tidak disertakan. Lihat [Pengeditan hubungan](./relationship-editing.md#on-delete-and-on-update) untuk mengetahui database mana yang menerima tindakan mana.

Setiap file yang diekspor dinamai `<database name>-<timestamp>` diikuti ekstensinya, dengan stempel waktu dalam waktu lokal berformat `yyyy-MM-dd'T'HH_mm_ss` — misalnya `my-schema-2026-08-29T04_05_06.erd.json`. Nama database yang kosong diganti dengan `unnamed`.  
`Save file` pada tab Skema SQL dan pada [Generator Kode](./code-generator.md) menamai filenya dengan cara yang sama. Gambar mengambil nama database seperti saat dialog dibuka.

`Import`, `Import and Add`, dan `Export` juga tersedia dari [Pencarian Cepat](./quick-search.md) pada tab ERD, dengan item yang sama seperti menu konteks kanvas.

Di Obsidian, tidak ada unduhan atau dialog simpan yang muncul: file ditulis ke dalam vault, di tempat Obsidian menaruh lampiran baru untuk diagram tersebut, dan sebuah pemberitahuan menyebutkan jalurnya.  
Karakter yang tidak diizinkan Obsidian dalam nama file, `\ / : * ? " < > |`, diganti dengan `-`.  
Penjelajah file Obsidian hanya mencantumkan file `.erd.json` atau `.sql` yang diekspor selama Settings → Files and links → Detect all file extensions aktif.

### Gambar {#image}

`Export` ▸ `Image`, dari menu konteks kanvas atau dari Pencarian Cepat, membuka dialog `Export image`: pratinjau gambar di samping opsinya. [Penjelajah](./explorer.md#dialogs-beside-it) yang terbuka tetap terbuka di bawah area yang diredupkan.

![Membuka Export > Image, menonaktifkan mode gelap dan latar belakang, memilih 3x, lalu menyalin gambar ke papan klip](/img/demo-export.webp)

- `Background`: Aktif secara default. Jika nonaktif, kanvas dibiarkan transparan.
- `Dark mode`: Awalnya sesuai dengan tampilan editor. Selama sesuai dengan tampilan di layar, gambar menggunakan warna kanvas itu sendiri, termasuk perubahan dari [pembuat tema](./language-and-theme.md); tampilan lainnya menggunakan prasetel dengan warna abu-abu dan warna aksen yang sama.
- `Scale`: `1x`, `2x`, atau `3x`, dengan `2x` dipilih secara default. Opsi ini hanya mengatur ukuran PNG dan salinan papan klip, dan baris di bawahnya menunjukkan ukuran tersebut, sebagai `PNG <width> × <height> px`.

Pilihan tersebut dipertahankan hingga editor ditutup dan tidak pernah disimpan di dokumen. Pratinjau dirender dengan cara yang sama seperti gambar, dan dirender ulang saat `Background` atau `Dark mode` berubah.

Gambar memuat diagram sebagaimana keadaannya saat dialog dibuka; tutup lalu buka kembali dialog untuk menyertakan perubahan setelahnya. Gambar memuat seluruh diagram seberapa jauh pun diagram tergulir dari layar, dipangkas sesuai apa yang dirender diagram ditambah margin, dan selalu dirender pada 100%, berapa pun tingkat zoom yang ditampilkan editor, sehingga setiap tabel dirender secara utuh. Apa yang disembunyikan [opsi tampilan](./table-related-functions.md#table-view-options) — hubungan, label ON DELETE dan ON UPDATE-nya, grup tabel, atau memo — tidak dirender dan tidak diberi ruang, dan grup tabel dirender di belakang semua elemen lainnya.

Tiga tombol menulis gambar, dan masing-masing membiarkan dialog tetap terbuka:

- `PNG`: Menyimpan `.png` seukuran diagram pada 100% dikalikan `Scale`. PNG yang terlalu besar untuk kanvas browser ditulis dengan resolusi yang diturunkan alih-alih gagal: dialog memperingatkan sebelumnya dengan `Reduced from <width> × <height> px, past what a browser canvas can hold`, dan pemberitahuan bertuliskan `Exported at a reduced resolution` menyampaikan hal itu sesudahnya.
- `SVG`: Menyimpan `.svg` seukuran diagram pada 100%, berapa pun `Scale`-nya, dan resolusinya tidak pernah diturunkan. Teksnya tetap berupa teks dan fontnya disebutkan namanya alih-alih disematkan, sehingga penampil yang tidak memiliki font editor menampilkan font lain. Bayangan tidak disertakan.
- `Copy to clipboard`: Menaruh PNG di papan klip pada `Scale` yang dipilih, dengan resolusi yang diturunkan seperti PNG yang disimpan saat kanvas browser tidak dapat menampungnya. Tombol ini mengonfirmasi dengan `Copied the image to the clipboard`, atau dengan `Copied at a reduced resolution` jika resolusi gambar diturunkan. Jika penyalinan gagal, karena browser atau host menolak akses papan klip atau gambar tidak dapat dirender, `Couldn't copy the image` menyarankan untuk menyimpan PNG sebagai gantinya.

Gambar dirender di worker latar belakang jika host menjalankannya, sehingga editor tetap dapat digunakan sementara itu. Pemberitahuan bertuliskan `Exporting PNG`, `Exporting SVG`, atau `Copying image` muncul jika prosesnya memakan waktu lebih dari sesaat, dan kegagalan dilaporkan sebagai `Couldn't export the PNG` atau `Couldn't export the SVG`. Menutup dialog selama file masih dirender tidak menghentikan penyimpanan file tersebut.

`PNG` mendapat fokus saat dialog dibuka, dan `Tab` tetap berada di dalam dialog. `Escape`, tombol `x`, atau klik pada area yang diredupkan di sekitarnya menutup dialog.  
Selama dialog terbuka, pintasan kanvas, termasuk Batalkan dan Ulangi, serta salin dan tempel tidak melakukan apa pun. `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac) menutup dialog dan membuka Pencarian Cepat. `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac) menutup dialog dan menempatkan kursor teks di kotak Temukan pada [Penjelajah](./explorer.md#opening-and-closing), dan membuka Penjelajah jika tertutup, tidak pernah menutupnya. Di editor yang terlalu sempit untuk menampilkan Penjelajah, pintasan ini tetap menutup dialog tetapi menampilkan notifikasi alih-alih memindahkan kursor teks.
