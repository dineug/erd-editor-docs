---
sidebar_position: 7
description: Menghapus hubungan, mengubah tipenya, mengatur tindakan ON DELETE dan ON UPDATE-nya, memetakannya ke kolom yang sudah ada dengan Petakan Kolom, membaca notasi konektor dan cara konektor dirutekan mengitari tabel, bekerja dengan hubungan N:M dan hubungan pengidentifikasi, serta melihat apa yang disalin kolom kunci asing baru dari kuncinya dan cara kolom tersebut diberi nama.
---

# Pengeditan hubungan

Hubungan digambar dari menu konteks kanvas, bilah alat kanvas, [Pencarian Cepat](./quick-search.md#what-the-palette-lists), atau dengan pintasan — lihat [Memulai pengeditan](./editing-start.md).  
Halaman ini membahas apa yang dapat Anda lakukan dengan sebuah hubungan setelah hubungan itu ada, cara [Petakan Kolom](#map-columns) mengakhiri hubungan pada kolom yang sudah dimiliki tabel anak, dan cara kolom kunci asing yang ditambahkan hubungan diberi nama.

## Penghapusan {#deletion}

Dapat dihapus melalui menu konteks hubungan.

![Menghapus hubungan products ke reviews dari menu konteksnya](/img/demo-relationship-remove.webp)

Tidak ada pintasan untuk ini, karena hubungan tidak dipilih seperti tabel atau memo: `Delete` dan `Backspace`, yang menghapus apa yang dipilih, tidak pernah menghapus sebuah hubungan secara tersendiri — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion).  
Hubungan juga dihapus bersama apa yang dihubungkannya: penghapusan tabel menghapus setiap hubungan yang terhubung dengannya, dan penghapusan kolom menghapus setiap hubungan yang menggunakannya.

## Perubahan tipe {#type-change}

Dapat diubah melalui `Relationship Type` di menu konteks hubungan.  
Empat tipe tersedia, dan tipe yang sedang digunakan ditandai dengan tanda centang:

- Nol atau satu
- Nol hingga N
- Tepat satu
- Satu hingga N

![Mengubah hubungan dari Nol hingga N menjadi Tepat satu lalu Satu hingga N di menu konteksnya](/img/demo-relationship-type.webp)

Keempat tipe ini sama dengan tipe yang Anda gunakan untuk memulai hubungan, masing-masing dengan pintasannya sendiri — lihat [Memulai pengeditan](./editing-start.md).

## ON DELETE dan ON UPDATE {#on-delete-and-on-update}

Diatur melalui `On Delete` dan `On Update` di menu konteks hubungan, di antara `Relationship Type` dan `Map Columns`.  
Masing-masing menawarkan enam item yang sama, dan item yang sedang digunakan ditandai dengan tanda centang:

- Tidak diatur
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` tidak menulis klausa apa pun, sehingga perilaku default database itu sendiri yang berlaku. Hubungan baru, baik yang digambar maupun yang dibuat di [Petakan Kolom](#map-columns), dimulai dengan keduanya bernilai `Not set`, dan memilih `Not set` nanti mengosongkan tindakan yang sudah diatur.  
Keduanya independen: mengubah salah satunya membiarkan yang lain tetap seperti semula.  
Konektor menampilkan apa yang diatur — lihat [Membaca konektor](#reading-a-connector).  
Hubungan yang disalin dan ditempel, atau diduplikasi, bersama tabel-tabelnya mempertahankan kedua tindakan, dan mengimpor Skema SQL, DBML, atau AML membawa masuk tindakan yang dideklarasikan file tersebut — lihat [Mengimpor atau mengekspor file](./file-import-export.md).

![Mengatur ON DELETE CASCADE dan ON UPDATE RESTRICT pada hubungan orders ke order_items dari menu konteksnya, dengan labelnya bertuliskan D:C U:R, lalu mengarahkan penunjuk ke hubungan itu untuk membaca kembali keduanya](/img/demo-referential-actions.webp)

Setiap tindakan dapat dipilih apa pun databasenya.  
Tindakan yang dihilangkan [database](./table-related-functions.md#databases) yang dipilih dari Skema SQL-nya diberi catatan redup di sampingnya, seperti `not in MySQL`. `Not set` tidak pernah diberi catatan, dan mengganti database memperbarui catatan tersebut.  
Tindakan yang diberi catatan tetap disimpan pada hubungan: konektor menampilkannya, dan JSON, DBML, serta AML mempertahankannya, tetapi Skema SQL database tersebut menghilangkan klausanya, sehingga perilaku default database yang berlaku.

[Skema SQL](./schema-sql.md) menulis tindakan berikut dan menghilangkan sisanya:

| Database | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | tidak ada |
| PostgreSQL | kelimanya | kelimanya |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | kelimanya | kelimanya |

Skema SQL untuk Snowflake juga menulis komentar yang menyebutkan setiap tindakan yang dihilangkannya — lihat [Tindakan referensial](./schema-sql.md#referential-actions).

Tindakan mana yang ditulis target ORM Generator Kode bergantung pada target serta database yang dipilih — lihat [Generator Kode](./code-generator.md#on-delete-and-on-update).

## Petakan Kolom {#map-columns}

Petakan Kolom memasangkan kunci tabel induk dengan kolom tabel anak, satu baris per kolom kunci.  
Setiap baris menggunakan kolom yang sudah dimiliki tabel anak atau menambahkan kolom kunci asing baru, sehingga hubungan dapat berakhir pada kolom yang sudah ada.

![Menggambar hubungan Nol hingga N dari members ke orders, memilih Map to existing columns, lalu memetakan id ke kolom member_id yang sudah ada](/img/demo-map-columns.webp)

Dialog ini dibuka dengan dua cara:

- Saat menggambar hubungan, dari `Map to existing columns` di samping tabel anak — lihat [Pembuatan hubungan](./editing-start.md#relationship-creation). `Map` kemudian menambahkan hubungan dengan tipe yang sedang digambar.
- Dari `Map Columns` di menu konteks hubungan, untuk mengubah kolom hubungan yang sudah ada. `Save` kemudian menulis perubahan tersebut. Editor hanya baca tidak membuka menu konteks hubungan, sehingga Petakan Kolom tidak dapat dibuka di sana.

Subjudul dialog menyebutkan kedua tabel dan tipe hubungan, seperti `users → posts · One N`. Tipe ditampilkan di sini tetapi tidak diubah — gunakan [Perubahan tipe](#type-change).

Di seluruh dialog, termasuk keterangan dan baris teks di bawah baris pemetaan serta notifikasi yang muncul saat dialog ditutup, tabel dan kolom dinamai sesuai [Tampilan Nama](./logical-names.md#beyond-the-canvas).  
Tiga hal tetap menggunakan nama fisik: setiap tipe data, yang merupakan tipe milik kolom itu sendiri dan tidak pernah nama domainnya; `New column: <name>`, yang menampilkan nama yang akan didapat kolom baru; dan baris yang sudah terisi saat `Map` dimulai, yang dipasangkan berdasarkan nama, tidak pernah berdasarkan nama logis.

`References` memilih kunci yang dirujuk hubungan: `Primary Key`, dengan kolomnya dalam urutan tabel, lalu `Unique: <column>` untuk setiap kolom yang ditandai `Unique`. Daftar ini hanya muncul saat ada lebih dari satu pilihan.  
Indeks unik tidak dihitung sebagai kunci di sini, dan kolom `Unique` yang merupakan seluruh kunci utama tidak dicantumkan dua kali.  
Memilih kunci lain menyusun ulang baris. Sebuah baris mempertahankan pilihannya selama kolom tersebut masih ada di tabel anak.

Di bawah judul `Referenced column` dan `Foreign key column`, setiap baris menampilkan satu kolom dari kunci beserta tipe datanya, dan daftar kolom tabel anak untuk dipasangkan dengannya:

- `Pick a column` membiarkan baris kosong.
- `New column: <name>` menambahkan kolom kunci asing baru. Nama yang ditampilkan adalah nama yang akan diberikan kepadanya, seperti dijelaskan di [Nama kolom kunci asing](#foreign-key-column-names), dengan penomoran yang memperhitungkan kolom tabel anak dan baris lain yang menambahkan kolom baru. Item ini tidak ditawarkan saat namanya akan kosong, seperti untuk kunci tanpa nama.
- Setiap kolom tabel anak, sebagai `<name> (<data type>)`. Kolom yang telah dipilih baris lain bertuliskan `<name> (<data type>) · in use` dan tidak dapat dipilih, sehingga tidak ada dua baris yang berbagi satu kolom. Kolom yang sudah digunakan hubungan lain tetap dapat dipilih, sehingga kolom seperti `tenant_id` yang digunakan bersama dapat melayani beberapa hubungan.

Dengan `Map`, sebuah baris sudah terisi sejak awal hanya saat tepat satu kolom tabel anak, tanpa membedakan huruf besar dan kecil, memiliki nama yang akan didapat kolom kunci asing baru untuk baris itu sebelum penomoran `_2` apa pun, seperti `users_id` untuk `id` pada `users` dan `member_id` untuk `member_id`. Selama [`Bracket`](./schema-sql.md#database-and-bracket) bernilai `None`, yang merupakan default, nama yang dibentuk dari bagian tabel pada nama tabel berkualifikasi skema juga dihitung, sehingga `id` pada `public.users` dipasangkan dengan `public.users_id` atau `users_id`. Untuk kunci `Unique`, nama kolom kunci itu sendiri juga dihitung, sehingga `vin` dipasangkan dengan `vin`. Semua baris lainnya dimulai pada `Pick a column`.  
Dengan `Save`, setiap baris dimulai pada kolom yang digunakan hubungan saat ini. Pada keduanya, memilih kunci lain di `References` mengisi baris kosong kunci tersebut dengan pencocokan nama yang sama.

Saat tipe data kolom yang dipilih berbeda dari tipe yang diberikan kolom induk kepada kunci asing, sebuah catatan di bawah baris tersebut menyatakannya.  
Saat [Sinkronisasi tipe data hubungan](./settings.md#relationship-datatype-sync) aktif dan kolom induk memiliki tipe data, catatan itu bertuliskan `<column> becomes <type>`, yaitu tipe yang akan ditulis pemetaan. Jika tidak, catatan itu bertuliskan `Types differ: <parent type> and <child type>`, dan kolom mempertahankan tipenya.

`Map` atau `Save` tetap nonaktif selama ada sesuatu yang menghalangi, dan sebuah keterangan di bawah baris-baris tersebut menyebutkan penyebabnya:

- `Pick a foreign key column for every referenced column`: masih ada baris yang kosong.
- `At least one column must reference a different column`: hubungan yang merujuk dirinya sendiri, dengan setiap baris memilih kolom induknya sendiri.
- `These columns are already linked by another relationship`: hubungan lain di antara dua tabel yang sama menautkan tepat kolom-kolom ini.
- `<parent> has no key to reference`: dengan `Map`, tabel induk tidak memiliki kunci utama maupun kolom `Unique`.

`Save` juga tetap nonaktif hingga pemetaan berbeda dari pemetaan hubungan saat ini.  
Dengan `Save`, sebuah baris bertuliskan `(removed)` saat kolomnya telah hilang dari tabelnya. Pilih kolom tabel anak yang lain, atau, untuk kolom induk yang sudah tidak ada, pilih kunci di `References`. Dengan `Map`, baris yang kolom pilihannya dihapus kembali ke `Pick a column`.

Hubungan yang kolom induknya tidak tepat sama dengan salah satu kunci tabel induk dibuka dengan pilihan tambahan di akhir `References`, yaitu `Current columns (not a key)`, yang mempertahankan kolom-kolom tersebut apa adanya. Saat tabel induk sama sekali tidak memiliki kunci, itulah satu-satunya pilihan dan `References` tidak ditampilkan.  
Di sana, keterangan `The referenced columns are not a key of <parent>`, atau `<parent> has no key to reference` saat tabel induk sama sekali tidak memiliki kunci, merupakan pemberitahuan, bukan kesalahan: `Save` tetap berfungsi, sehingga Anda dapat mengubah kolom tabel anak dan mempertahankan rujukannya.  
Hubungan yang kedua daftar kolomnya tidak dapat dipasangkan, misalnya karena panjangnya berbeda, menampilkan baris `(invalid)` dan membuat `Save` tetap nonaktif hingga Anda memilih kunci di `References`, atau menambahkan kunci utama atau kolom `Unique` ke tabel induk jika tabel itu belum memilikinya.

Selama terbuka, dialog mengikuti diagram, termasuk perubahan dari kolaborator atau agen pemrograman, dan mempertahankan apa yang telah Anda pilih.  
Jika kolom hubungan atau kunci yang digunakan saat dialog dibuka berubah sementara itu, dialog menambahkan keterangan `This relationship changed while the dialog was open`.

Apa yang ditulis `Map` dan `Save`:

- `Map` menambahkan hubungan dengan `On Delete` dan `On Update` diatur ke `Not set`. `Save` hanya mengubah kolom hubungan, mengarahkan sisi induknya ke kunci yang dipilih di `References`, serta mempertahankan tipenya dan tindakan ON DELETE dan ON UPDATE-nya.
- Baris `New column` menambahkan kolom di akhir tabel anak, seperti saat menggambar: `NOT NULL`, dinamai menurut kuncinya, dengan tipe data, nilai default, komentar, nama logis, dan domain kunci tersebut — lihat [Hubungan pengidentifikasi](#identifying-relationships).
- Kolom yang dipilih tidak pernah diganti namanya atau ditautkan ke domain kunci, dan `Not Null`, kunci utama, `Unique`, nilai default, komentar, serta nama logisnya tetap seperti semula. Tipe datanya hanya berubah selama `Relationship DataType Sync` aktif dan kolom induk memiliki tipe data: kolom itu mengambil tipe yang diberikan kolom induk kepada kunci asing, yaitu tipe integer untuk kunci serial seperti pada kolom baru, dan perubahan itu berlanjut di sepanjang hubungan seperti yang dilakukan sinkronisasi. Setiap kolom yang tipenya diubah oleh perubahan ini, baik yang dipilih maupun yang dicapai di sepanjang hubungan, dilepas tautannya dari [domain](./dictionary.md#domains-and-data-types) saat tipe barunya berbeda dari tipe domain.
- Kolom yang tidak lagi digunakan pemetaan tetap berada di tabel anak, dan tidak lagi ditandai sebagai kunci asing kecuali jika hubungan lain masih berakhir padanya.
- Semua yang ditulis satu kali `Map` atau `Save` — termasuk kolom baru, perubahan tipe, dan pelepasan tautan domain — merupakan satu langkah pembatalan.

Apakah hubungan bersifat pengidentifikasi, dan bagaimana ujung induknya digambar, ditentukan dari kolom tabel anak yang dipetakan, seperti pada hubungan mana pun. Memetakan ke kolom kunci utama tabel anak langsung menjadikannya hubungan pengidentifikasi, dan memetakan ke kolom yang mengizinkan `NULL` menempatkan lingkaran di ujung induk — lihat [Membaca konektor](#reading-a-connector).  
Kunci asing di Skema SQL merujuk kunci yang Anda pilih, seperti `REFERENCES vehicle (vin)` untuk kunci `Unique`.

Jika diagram sudah memuat pemetaan tersebut saat Anda menekan `Map` atau `Save`, karena kolaborator atau agen pemrograman sudah melakukannya lebih dulu, tidak ada yang ditulis.  
Jika diagram telah berubah sehingga pemetaan tidak lagi sesuai, tidak ada yang ditulis dan muncul notifikasi bertuliskan `Couldn't map columns: the diagram changed`.

`Cancel`, tombol `x`, `Escape`, atau klik pada area redup di luar dialog menutupnya tanpa menulis apa pun.  
Area redup menutupi seluruh editor, termasuk bilah alat, dan [Penjelajah](./explorer.md#dialogs-beside-it) yang terbuka tetap terbuka di bawahnya.  
Membuka Pencarian Cepat juga menutup dialog, begitu pula saat meninggalkan tab ERD atau saat editor menjadi hanya baca.  
`Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac) juga menutupnya dan menempatkan kursor teks di kotak Temukan pada [pencarian](./find-and-replace.md#opening-and-closing) Penjelajah, sambil membuka Penjelajah jika sedang tertutup. Di editor yang terlalu sempit untuk menampilkan Penjelajah, pintasan ini tetap menutup dialog tetapi menampilkan notifikasi alih-alih memindahkan kursor teks — lihat [Membuka dan menutup](./explorer.md#opening-and-closing).  
Jika salah satu tabelnya atau hubungan tersebut dihapus selama dialog terbuka, dialog tertutup dengan notifikasi seperti `Map Columns closed: the relationship was removed`.  
Selama dialog terbuka, pintasan kanvas, pembatalan dan pengulangan, serta penyalinan dan penempelan tidak melakukan apa pun.

Agen pemrograman tidak memiliki alat Petakan Kolom. Agen memetakan ulang hubungan dengan menghapusnya menggunakan `erd_remove_relationship`, yang mempertahankan kolom kunci asingnya, lalu menggambarnya lagi pada kolom yang sudah ada dengan `erd_link_columns`, keduanya dalam satu `erd_batch` — lihat [Alat](../../mcp/tools.md#relationships).

## Hubungan N:M {#nm-relationships}

Karena editor didasarkan pada model fisik, hubungan N:M dinyatakan dengan tabel pemetaan, seperti yang ditunjukkan di bawah ini.

![Menggambar hubungan dari products lalu tags ke tabel product_tags yang kosong dengan ⌘ + ⌥ + 2, sehingga menambahkan product_id lalu tag_id](/img/demo-relationship-n-m.webp)

Saat tabel pemetaan sudah memiliki kolom kuncinya, seperti `product_id` dan `tag_id` pada `product_tags`, gambar setiap hubungan dengan `Map to existing columns` dan pilih kolom-kolom tersebut alih-alih menambahkan kolom baru — lihat [Petakan Kolom](#map-columns). Jika kolom-kolom itu adalah kunci utama tabel pemetaan, setiap hubungan langsung menjadi hubungan pengidentifikasi.

Mengimpor GraphQL, DBML, atau AML membuatkan tabel pemetaan untuk Anda.  
Deklarasi banyak-ke-banyak masuk sebagai tabel bernama `<left>_<right>`, dengan komentar `Junction table inferred from <left> <-> <right>`, yang terhubung ke kedua sisi melalui hubungan pengidentifikasi.  
Lihat [Mengimpor atau mengekspor file](./file-import-export.md).

## Hubungan pengidentifikasi {#identifying-relationships}

Menggambar hubungan dengan mengeklik tabel anak, atau dengan `Create new columns`, menyalin setiap kunci utama tabel induk ke tabel anak sebagai kolom kunci asing `NOT NULL`, sehingga hubungan baru dimulai sebagai hubungan non-pengidentifikasi.  
Salinan tersebut mengambil tipe data, nilai default, komentar, dan nama logis kunci, tetapi tidak `Unique` atau `Auto Increment`, dan diberi nama seperti dijelaskan di [Nama kolom kunci asing](#foreign-key-column-names).  
Kunci serial merupakan pengecualian untuk tipe data: salinannya mengambil tipe integer yang disimpan serial tersebut. Pada database apa pun, `smallserial` dan `serial2` menghasilkan `smallint`, `serial4` menghasilkan `integer`, serta `bigserial` dan `serial8` menghasilkan `bigint`. Tipe `serial` saja menghasilkan `integer` pada PostgreSQL dan `bigint unsigned` pada MySQL dan MariaDB, serta tetap `serial` pada database lainnya.  
Hanya nama tipe secara utuh yang dihitung, tanpa membedakan huruf besar dan kecil, sehingga `serial(4)` disalin sebagaimana tertulis. Tipe yang ditulis dengan huruf kapital menghasilkan huruf kapital: `SERIAL` menghasilkan `INTEGER` pada PostgreSQL. Kolom kunci asing yang sudah bertipe `serial` di diagram yang tersimpan mempertahankan tipe tersebut.  
Salinan tersebut juga ditautkan ke [domain](./dictionary.md#domains-and-data-types) kunci, asalkan lembar `Domains` mencantumkan domain itu saat salinan dibuat dan salinan mempertahankan tipe data kunci. Jadi, salinan kunci serial yang mengambil tipe integer tidak menautkan domain apa pun, sedangkan `serial` saja yang tetap `serial` menautkannya.  
Untuk membuat hubungan menjadi hubungan pengidentifikasi, jadikan kolom kunci asing tersebut di tabel anak sebagai kunci utama: pilih semuanya lalu tekan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac) satu kali, atau pilih `Primary Key` di menu konteks tabel, yang bertuliskan `Primary Key on selected columns` selama dua kolom atau lebih dipilih — lihat [Kunci utama kolom](./table-editing.md#column-primary-key).

![Mengaktifkan lalu menonaktifkan product_id sebagai kunci utama dengan Alt + K, yang membuat konektornya menjadi garis utuh, lalu garis putus-putus](/img/demo-identifying-relationship.webp)

Editor menyelaraskan hal ini dengan sendirinya.  
Hubungan bersifat pengidentifikasi selama setiap kolom di sisi anaknya adalah kunci utama, dan menjadi non-pengidentifikasi begitu salah satunya bukan kunci utama.

## Nama kolom kunci asing {#foreign-key-column-names}

Menggambar hubungan memberi nama setiap kolom kunci asing yang ditambahkannya menurut kunci induk yang disalin kolom tersebut:

- Nama kunci satu kata, seperti `id`, `ID`, atau `uuid`, diberi nama tabel induk dan garis bawah di depannya: `id` pada `products` menjadi `products_id`.
- Nama kunci beberapa kata, seperti `member_id`, `userId`, atau `UserID`, dipertahankan apa adanya.
- Nama kunci satu kata yang sama dengan nama tabel itu sendiri, tanpa membedakan huruf besar dan kecil, juga dipertahankan: `currency` pada `currency` tetap `currency`. Kunci yang hanya mengandung nama tabel tetap diberi awalan: `username` pada `user` menjadi `user_username`.

Sebuah nama dianggap satu kata jika hanya berisi huruf dan angka, tanpa pergantian huruf besar-kecil.  
Karakter lain apa pun memecahnya, sehingga `_id`, `order no`, dan `order-no` terdiri dari beberapa kata.  
Begitu pula pergantian huruf besar-kecil, yang dibaca seperti camelCase: huruf kecil yang diikuti huruf kapital (`userId`), dua huruf kapital yang diikuti huruf kecil (`IDCard`, `IDs`), atau huruf dari aksara tanpa huruf besar-kecil, seperti Hangul, kana, atau Han, yang bersebelahan dengan huruf yang memiliki huruf besar-kecil (`회원ID`).  
Angka tidak memecah kata, sehingga `id2` dan `SHA256` merupakan satu kata. Kata majemuk yang ditulis tanpa pergantian huruf besar-kecil juga merupakan satu kata: `memberid` pada `members` menjadi `members_memberid`.

Nama tabel digunakan sebagaimana tertulis, kecuali spasi di sekelilingnya: huruf besar-kecil, spasi di dalamnya, dan titiknya dipertahankan, nama tersebut tidak diubah menjadi bentuk tunggal, dan `Table Name Case` serta `Column Name Case` dari Generator Kode tidak berperan. `Users` dengan kunci `ID` menghasilkan `Users_ID`.  
Setiap kolom kunci komposit diberi nama secara tersendiri: `orders` dengan kunci (`tenant_id`, `id`) menambahkan `tenant_id` dan `orders_id`.

Nama yang sudah dimiliki tabel anak, tanpa membedakan huruf besar dan kecil, diberi nomor `_2`, `_3`, dan seterusnya, dengan mengambil nomor pertama yang masih tersedia.  
Hubungan kedua dari `users`, dengan kunci `id`, ke tabel yang sama menambahkan `users_id_2`, dan hubungan yang merujuk dirinya sendiri pada `members`, dengan kunci `member_id`, menambahkan `member_id_2`.  
Kolom-kolom dari satu kunci komposit diberi nomor dengan cara yang sama terhadap satu sama lain, dan nama yang dipertahankan apa adanya mendapatkan tempatnya lebih dulu: `user` dengan kunci (`id`, `user_id`) menambahkan `user_id` untuk `user_id` dan `user_id_2` untuk `id`.

Tabel induk tanpa nama membiarkan nama kunci apa adanya, dengan penomoran seperti nama lainnya jika terjadi bentrok.  
Kunci tanpa nama menghasilkan kolom kunci asing tanpa nama.  
Hal ini termasuk kunci utama yang ditambahkan editor ke tabel induk yang tidak memilikinya, kecuali jika Anda memberinya nama sebelum mengeklik tabel anak.

Nama-nama tersebut ditetapkan saat hubungan digambar. Mengganti nama tabel induk atau kuncinya kemudian tidak mengganti nama kolom-kolom tersebut.  
Baris `New column` di [Petakan Kolom](#map-columns) diberi nama dengan aturan yang sama, dan daftarnya menampilkan setiap nama sebelum Anda memilihnya.  
Hubungan yang datang dengan kolom yang sudah tersedia — dari impor, penempelan, duplikasi, atau Petakan Kolom yang memasangkan kolom yang sudah ada — mempertahankan nama yang dimiliki kolom-kolom tersebut.  
Agen pemrograman yang menambahkan hubungan dengan `erd_add_relationship` mendapatkan nama, tipe data, nama logis, dan domain yang sama — lihat [Alat](../../mcp/tools.md#relationships).

Kolom kunci asing dinamai menurut kuncinya, tidak pernah menurut nama logis yang disalinnya, dan namanya dianggap nama buatan Anda sendiri: nama logis yang kemudian ditulis pada kolom itu membiarkan namanya tetap seperti semula, kecuali jika nama itu kosong — lihat [Nama buatan Anda sendiri](./dictionary.md#names-of-your-own).  
Karena itu, selama nama logis yang disalin cocok dengan istilah yang memberikan nama lain, lembar `Checks` mencantumkan kolom tersebut di bawah [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Menghasilkan ulang nama fisiknya mengganti namanya dari kamus, kecuali jika kolom lain di tabel anak sudah memiliki nama yang diberikan kamus, tanpa membedakan huruf besar dan kecil — lihat [Hasilkan ulang nama-nama fisik](./dictionary.md#derive-physical-names-again).

## Membaca konektor {#reading-a-connector}

- Hubungan pengidentifikasi digambar sebagai garis utuh, sedangkan hubungan non-pengidentifikasi sebagai garis putus-putus.
- Ujung anak membawa simbol kardinalitas tipe hubungan: lingkaran dan garis untuk Nol atau satu, lingkaran dan kaki gagak untuk Nol hingga N, dua garis untuk Tepat satu, serta garis dan kaki gagak untuk Satu hingga N.
- Ujung induk berupa lingkaran dan garis, seperti Nol atau satu, saat salah satu kolom kunci asing mengizinkan `NULL`, dan dua garis, seperti Tepat satu, saat semuanya `NOT NULL`.
- Mengarahkan penunjuk ke konektor menyorot konektor tersebut beserta kolom yang ditautkannya di kedua tabel.

![Mengarahkan penunjuk ke tiga konektor secara bergantian, masing-masing tersorot bersama kolom yang ditautkannya](/img/demo-relationship-hover.webp)

Hubungan yang mengatur [ON DELETE atau ON UPDATE](#on-delete-and-on-update) memiliki label di samping ujung anaknya, seperti `D:C U:R`: `D:` dan tindakan ON DELETE, lalu `U:` dan tindakan ON UPDATE, masing-masing hanya saat diatur.  
Tindakan disingkat mengikuti notasi erwin: `C` untuk CASCADE, `R` untuk RESTRICT, `SN` untuk SET NULL, `SD` untuk SET DEFAULT, dan `NA` untuk NO ACTION. Hubungan yang tidak mengatur keduanya tidak memiliki label.  
Label terletak di sisi yang menjauh dari tabel anak, di atas garis saat konektor keluar dari sisi kiri atau kanan tabel tersebut dan di sebelah kanannya saat konektor keluar dari sisi atas atau bawah, tanpa menutupi simbol kardinalitas.  
Label digambar dengan warna konektor di atas kotak kecil berwarna latar kanvas, dan tersorot bersama konektornya. Label digambar di atas setiap konektor, sehingga garis yang melintasi label berada di bawahnya.  
Label menampilkan tindakan yang disimpan pada hubungan, terlepas dari apa yang ditulis database yang dipilih, sehingga ON DELETE SET DEFAULT tetap bertuliskan `D:SD` pada MySQL.

Mengarahkan penunjuk ke konektor yang mengatur salah satu tindakan juga menampilkan tooltip yang menuliskan klausanya secara lengkap, satu per baris, seperti `ON DELETE CASCADE` dan `ON UPDATE RESTRICT`.  
Tooltip tetap muncul bahkan saat label disembunyikan.

Menuju sebuah hubungan menyorotnya: memilih baris di bawah folder `Foreign Keys` sebuah tabel di [Penjelajah](./explorer.md#going-to-a-row), atau baris kunci asing di [Penampil Perbedaan](./table-related-functions.md#going-to-a-change), menggambar konektor dan labelnya dengan warna saat penunjuk diarahkan. Di Penampil Perbedaan, konektor disorot di setiap sisi yang memuat hubungan tersebut, sehingga kunci asing yang ditambahkan hanya menyorot sisi saat ini dan kunci asing yang dihapus hanya menyorot sisi tersimpan.  
Lompatan ini hanya memilih tabel anak beserta kolom kunci asingnya, dengan sel yang difokuskan pada kolom pertama di antaranya; hubungan itu sendiri tetap tidak pernah dipilih. Mengenai ke mana area pandang berpindah, lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands).  
Sorotan padam pada tekanan tombol kiri atau kanan mouse berikutnya di kanvas, baik di area kosong, tabel, memo, grup tabel, maupun konektor, bahkan tekanan yang membiarkan pilihan tetap seperti semula. Menuju baris lain atau kecocokan pencarian lain di Penjelajah juga memadamkannya, begitu pula menuju baris lain di Penampil Perbedaan, di setiap sisi yang dituju baris tersebut.  
Menggeser dengan tombol tengah mouse atau alat tangan membiarkannya tetap tersorot, begitu pula menciutkan atau membentangkan baris di Penjelajah atau Penampil Perbedaan, mengosongkan pilihan dengan `Escape`, dan lompatan dari [Pencarian Cepat](./quick-search.md) atau dari [tombol kartu](./visualization.md#card-buttons) tautan eksternal di Alur.  
Sorotan tidak disimpan dan tidak masuk ke riwayat pembatalan, dan kolaborator tidak melihatnya.

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), penunjuk juga menyorot konektor, menggantikan sorotan yang ditinggalkan sebuah lompatan. Saat berada di atas tabel, penunjuk menyorot setiap konektor tabel itu dengan warna hover sampai bergerak keluar dari tabel.  
Klik yang tidak bergerak membiarkan sorotan menyala sampai klik serupa berikutnya: pada tabel, ia menyorot konektor tabel itu, pada konektor, konektor itu, dan di tempat lain, tidak ada. Seretan di sana menggeser kanvas dan membiarkan sorotan itu seperti semula.

Sembunyikan konektor di kanvas ERD dengan opsi tampilan `Relationship`, atau hanya labelnya dengan opsi tampilan `Referential Actions`, yang aktif secara default — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options).  
Label tidak digambar pada `70%` dan di bawahnya, saat tabel menciut hingga hanya menampilkan namanya.  
[Ekspor gambar](./file-import-export.md#image) selalu digambar pada 100%, sehingga label tetap digambar berapa pun zoom kanvas, kecuali jika opsi tampilan menyembunyikannya. Saat `Background` nonaktif, kotak di belakang setiap label juga transparan.  
[Mode Alur](./visualization.md#flow-mode) di tab Visualisasi menggambar konektor bahkan saat `Relationship` nonaktif, masing-masing sebagai satu kurva abu-abu utuh yang mulus dengan tanda ujung yang sama, sehingga garis putus-putus, label, tooltip, sorotan setelah lompatan, dan perutean ortogonal yang dijelaskan di halaman ini hanya berlaku untuk kanvas ERD. Hubungan dari sebuah tabel ke tabel itu sendiri juga melengkung mengitari sudut kanan atas di Alur — lihat [Perutean konektor](#connector-routing).

## Perutean konektor {#connector-routing}

Konektor dirutekan secara ortogonal, dan sudut-sudutnya dibulatkan.  
Rute mengitari tabel yang menghalanginya alih-alih menembusnya. Jika setiap rute dengan beberapa belokan di antara kedua ujungnya akan melintasi tabel, seperti pada diagram yang padat, konektor mengambil jalan memutar dengan sebanyak mungkin belokan yang diperlukan. Hanya jika tidak ditemukan jalan memutar, konektor tetap melintasi tabel.  
Konektor keluar dari kedua tabelnya melalui sepasang sisi yang saling berhadapan di mana pun ada, dan setiap ujung keluar dari tabelnya dengan ruas lurus pendek sebelum berbelok, sehingga dua tabel yang berjarak dekat dan ujung konektornya sejajar dihubungkan oleh satu garis lurus alih-alih jalan memutar.  
Dua tabel yang berhadapan dan berjarak lebih dekat dari itu, bahkan di bawah `40px`, mempertahankan sisi yang berhadapan, dan jika ujungnya tidak sejajar, konektor berbelok melintasi celah di antara keduanya alih-alih berjalan di bawah salah satu tabel.  
Rute yang keluar dari sisi tabel yang sama disebar ke koridor terpisah agar tidak saling berimpit.  
Hanya tabel yang dihindari: konektor dapat melintasi memo atau kotak grup tabel, dan digambar di atas grup tabel serta di bawah tabel dan memo.

Hubungan dari sebuah tabel ke tabel itu sendiri digambar sebagai satu kurva yang mengitari sudut kanan atas tabel, keluar dari sisi atas di ujung induk dan masuk ke sisi kanan di ujung anak.  
Hubungan berikutnya yang merujuk dirinya sendiri pada tabel yang sama bersarang di luar hubungan pertama, sehingga kurvanya tidak saling bersilangan maupun melintasi tabel.

Tidak ada yang perlu dikonfigurasi.  
Rute dihitung ulang secara otomatis setiap kali sesuatu di kanvas berpindah atau berubah ukuran, sehingga rute tidak pernah perlu disentuh secara manual.  
Selama Anda menyeret, konektor tabel yang Anda pindahkan mengikutinya, dan setiap konektor lain mempertahankan rute yang dimilikinya saat seretan dimulai. Saat Anda melepas, setiap konektor yang rutenya berubah karena perpindahan itu digambar ulang, seperti konektor yang kini mengitari tabel yang dijatuhkan di jalurnya, atau yang menjadi lurus setelah tabel berpindah dari jalurnya.

Diagram menggambar rute yang sama di setiap jendela yang menampilkannya dalam Tampilan Nama yang sama: jendela yang tetap terbuka saat tabel berpindah, jendela yang baru membuka diagram, dan jendela kolaborator, dan [gambar yang diekspor](./file-import-export.md#image) juga menggambarnya. Tampilan Nama berpengaruh karena mengubah lebar tabel — lihat [Tampilan Nama](./logical-names.md#name-view).

![Menyeret tabel members ke bawah lalu kembali sementara konektor dari orders berganti antara melewati sisi kanan categories dan mengitari sisi kirinya, dengan setiap sudut dibulatkan](/img/demo-connector-routing.webp)
