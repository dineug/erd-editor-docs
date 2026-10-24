---
sidebar_position: 14
description: Menyimpan domain, kata, dan istilah diagram di tab Kamus, menghasilkan nama fisik dari nama logis, membiarkan domain menetapkan tipe data kolomnya, membaca apa yang ditemukan lembar Pemeriksaan, mengedit dan mengurutkan lembar seperti spreadsheet, serta mengimpor dan mengekspornya sebagai file CSV.
---

# Kamus

Tab Kamus memuat standar penamaan diagram dalam tiga kamus, masing-masing di lembar yang Anda edit seperti spreadsheet:

- `Domains`: tipe data bernama, seperti `Name` untuk `VARCHAR(100)`. Kolom yang tertaut ke domain memiliki tipe data domain tersebut.
- `Words`: kata standar yang menyusun nama logis, masing-masing dengan singkatan yang dipakai nama fisik untuknya, seperti `Customer` dan `CUST`.
- `Terms`: nama logis utuh, masing-masing dengan nama fisik dan domain yang diberikannya, seperti `Customer Name` dengan `CUST_NM`.

[Nama logis](./logical-names.md) tabel atau kolom menghasilkan nama fisiknya dari ketiga kamus ini, dan istilah sebuah kolom juga dapat menautkan kolom itu ke domain — lihat [Menghasilkan nama fisik](#deriving-physical-names).  
Lembar keempat, `Checks`, mencantumkan kesalahan yang ditemukan kamus pada nama dan tipe diagram serta pada kamus itu sendiri, seperti kata terlarang dalam nama logis — lihat [Lembar Pemeriksaan](#the-checks-sheet).

## Membuka tab {#opening-the-tab}

Beralih ke tab `Dictionary` di bilah alat, yaitu tombol dengan ikon buku di antara `Code Generator` dan `Settings`, atau pilih `Dictionary` di bawah `Tab` di [Pencarian Cepat](./quick-search.md).  
Tab ini dapat menjadi tab tempat diagram dibuka — lihat `Canvas Type` di [Penguncian](./settings.md#lock).

Tab terbuka pada lembar `Domains` hingga Anda memilih lembar lain.  
Setiap kali tab dibuka, lembar kembali dengan pilihan dan guliran yang Anda tinggalkan, atau dengan sel pertamanya terpilih pada kunjungan pertama. Kisinya menerima fokus keyboard, sehingga ketikan atau tombol panah langsung berlaku.

Lembar yang ditampilkan, serta pencarian, pilihan, guliran, dan lebar kolom setiap lembar, hanya milik Anda.  
Tidak satu pun disimpan di file, dicatat di riwayat pembatalan, atau dibagikan kepada kolaborator. Semuanya dipertahankan selama editor tetap terbuka, saat berpindah tab dan saat dokumen lain dimuat ke editor yang sama.

## Lembar {#the-sheets}

Bilah di bagian atas memuat empat tombol lembar, `Domains`, `Words`, `Terms`, dan `Checks`, dan tombol lembar yang ditampilkan tampak tertekan. Masing-masing menampilkan hitungan di samping namanya: jumlah baris di lembarnya, apa pun yang ditampilkan pencarian, atau pada `Checks` jumlah pemeriksaan, diwarnai menurut tingkatnya — lihat [Lembar Pemeriksaan](#the-checks-sheet).  
Setelahnya terdapat kotak pencarian — lihat [Mencari](#searching). Di ujung bilah, pada `Domains`, `Words`, dan `Terms` tetapi tidak di editor hanya baca, terdapat empat alat: `Add Row`, `Delete Rows`, `Import CSV`, dan `Export CSV` — lihat [Menambahkan dan menghapus baris](#adding-and-deleting-rows) dan [Mengimpor dan mengekspor CSV](#importing-and-exporting-csv).  
Pada panel yang sempit atau bahasa tampilan yang panjang, bilah terlipat ke beberapa baris, sehingga setiap tombol tetap terjangkau.

Di bawah kisi, baris status menghitung baris yang tersisa setelah pencarian, seperti `4 rows`, dan, selama pilihan mencakup baris mana pun, berapa banyak yang dicakupnya, seperti `1 selected`. Baris yang dimiliki bersama oleh dua rentang dihitung sekali, sehingga angka itu adalah jumlah baris yang akan dihapus `Delete Rows`.  
Nomor baris di sisi kiri menghitung baris sesuai urutan tampilannya di lembar, mulai dari 1. Sel hanya baca, yaitu setiap sel di `Checks` dan setiap sel di editor hanya baca, ditampilkan dengan latar abu-abu, kecuali jika pemeriksaan menandainya.  
Lembar `Domains`, `Words`, atau `Terms` yang kosong bertuliskan `Import a CSV file or add a row`, kecuali di editor hanya baca.

Kolom setiap lembar, secara berurutan:

| Lembar | Kolom |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Apa yang dilakukan setiap sel:

- `Data Type` sebuah domain ditulis sebagai tipe kolom, seperti `VARCHAR(100)` atau `NUMERIC(15,2)`, dan setiap kolom yang tertaut ke domain tersebut memilikinya — lihat [Domain dan tipe data](#domains-and-data-types).
- `Abbreviation` sebuah kata adalah apa yang dipakai nama fisik untuk kata tersebut — lihat [Dari kata](#from-the-words).
- `Synonyms` dan `Forbidden Words` sebuah kata mencantumkan kata lain untuk hal yang sama, dipisahkan dengan koma. Spasi di ujung setiap item dipangkas, item kosong dibuang, dan item yang sama dengan kata itu sendiri diabaikan. Nama logis yang memakai salah satunya tidak menyusun nama fisik, dan lembar `Checks` menandainya serta menyebutkan kata yang seharusnya dipakai — lihat [Apa yang ditemukan setiap pemeriksaan](#what-each-check-finds).
- `Term` sebuah istilah adalah nama logis utuh, dan `Physical Name`-nya adalah nama yang diberikan nama logis tersebut — lihat [Dari istilah](#from-a-term).
- `Domain` sebuah istilah menampilkan nama domain yang ditautkannya, dan kosong selama istilah tidak menautkan domain apa pun atau menautkan domain yang sudah dihapus — lihat [Domain istilah](#a-terms-domain).
- `Category`, `English Name`, setiap `Description`, dan `Synonyms` sebuah istilah adalah catatan. Catatan ini tidak mengubah apa pun, dan tidak ada pemeriksaan yang membacanya.

Dalam [bahasa tampilan kanan ke kiri](./language-and-theme.md#right-to-left-languages), bilah, menu kisi, dan baris status dicerminkan, sedangkan lembar dan daftar domain istilah tetap kiri ke kanan.

## Menghasilkan nama fisik {#deriving-physical-names}

Kamus dapat memberi tabel atau kolom nama fisiknya, yaitu nama yang ditulis Skema SQL dan Generator Kode, dari nama logisnya. Istilah yang `Term`-nya sama dengan nama logis dicari terlebih dahulu; jika tidak ada, nama disusun dari singkatan kata.  
Misalnya, dengan kata `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`), dan `Date` (`DT`), serta istilah `Customer Number` dengan nama fisik `CUST_NO` dan domain `Number`, yang tipe datanya `INT`:

- Nama logis `Customer Number` menamai kolom `CUST_NO`, menautkannya ke `Number`, dan memberinya tipe `INT`.
- `Order Date` menyusun `ORD_DT`.
- Tabel dengan nama logis `Customer` dinamai `CUST`.

Dengan lembar `Words` dan lembar `Terms` yang kosong, tidak ada yang dihasilkan.

### Kapan nama dihasilkan {#when-a-name-is-derived}

Nama fisik dihasilkan saat nama logis ditulis:

- Di kanvas, saat editor sel nama logis ditutup dengan nama logis yang berbeda dari saat dibuka, melalui `Enter`, `Tab`, `Escape`, atau klik di tempat lain. Setiap tombol yang Anda ketik hanya menulis nama logis — lihat [Menulis nama logis](./logical-names.md#writing-a-logical-name).
- Seketika, saat Anda memilih istilah dari daftar di bawah sel — lihat [Melengkapi nama istilah](./logical-names.md#completing-term-names).
- Saat penempelan menulis sel nama logis — lihat [Menyalin/menempel kolom](./table-editing.md#copyingpasting-columns).
- Saat [Temukan dan Ganti](./find-and-replace.md#replacing) mengganti nama logis, satu kecocokan atau semuanya.
- Saat agen pemrograman menetapkan nama logis.

Nama fisik hanya dihasilkan selama nama itu kosong atau memang dihasilkan sebelumnya — lihat [Nama buatan Anda sendiri](#names-of-your-own).  
Istilah yang dipilih, penempelan, atau penggantian menulis nama logis beserta apa yang dihasilkannya sebagai satu langkah pembatalan. Di kanvas, nama yang dihasilkan saat editor ditutup merupakan langkah tersendiri setelah pengetikan: pembatalan pertama menarik kembali nama yang dihasilkan, beserta domain dan tipe yang dibawa istilah, dan membiarkan nama logis yang Anda ketik.

Tidak ada yang dihasilkan ulang dengan sendirinya di kemudian hari. `Abbreviation` baru sebuah kata, `Physical Name` atau `Domain` baru sebuah istilah, serta kata atau istilah baru membiarkan nama yang sudah dihasilkan apa adanya; gunakan [Hasilkan ulang nama-nama fisik](#derive-physical-names-again) untuk itu. `Data Type` sebuah domain adalah pengecualiannya: perubahannya langsung sampai ke kolom-kolomnya.

### Dari istilah {#from-a-term}

Lembar `Terms` dicari terlebih dahulu untuk istilah yang `Term`-nya sama dengan nama logis. Spasi di kedua ujung dan komposisi Unicode diabaikan, tetapi huruf besar/kecil diperhitungkan, sehingga `customer number` tidak cocok dengan `Customer Number`. Dari dua istilah dengan nama yang sama, yang berlaku adalah yang pertama di lembar.

- Istilah memberikan `Physical Name`-nya, atau, selama itu kosong, nama yang disusun kata-katanya, seperti dijelaskan di bawah, jika kata-kata itu menyusun nama.
- Untuk kolom, istilah juga menautkan `Domain`-nya selama lembar `Domains` mencantumkannya, sehingga kolom mendapat tipe data domain tersebut — lihat [Menautkan kolom](#linking-a-column). Hal ini tetap terjadi bahkan saat istilah tidak memberikan nama. Istilah tanpa domain tidak melepas tautan apa pun.
- Tabel hanya mengambil nama fisik istilah.

### Dari kata {#from-the-words}

Jika tidak ada istilah yang cocok, kata menyusun nama:

1. Nama logis dipotong pada spasi, `_`, `-`, `·`, dan `/`, dan tidak ada kata yang melintasi potongan.
2. Setiap potongan dibaca dari kiri, dengan mengambil di setiap titik teks terpanjang yang dicantumkan lembar `Words`, sebagai `Word`, sinonim, atau kata terlarang, tanpa pernah mundur. Dengan kata `가입`, `가입일`, dan `일자`, `가입일자` dibaca sebagai `가입일` dan `자`, sehingga `자` tidak terdaftar, sedangkan `가입 일자` dibaca sebagai `가입` dan `일자`. Huruf besar/kecil diperhitungkan: `member` bukan kata `Member`.
3. Nama fisik adalah `Abbreviation` setiap kata persis seperti yang diketik, digabungkan dengan `_`, seperti `ORD_DT`. Dari dua kata dengan nama yang sama, yang pertama di lembar memberikan singkatannya. Tidak ada batas panjang, dan `Table Name Case` serta `Column Name Case` milik Generator Kode tidak berperan.

Aturannya semua atau tidak sama sekali. Jika ada penggalan yang berupa sinonim, kata terlarang, atau teks yang tidak dicantumkan kata mana pun, atau sebuah kata memiliki `Abbreviation` kosong, tidak ada nama yang disusun, dan nama fisik tetap apa adanya.

### Nama buatan Anda sendiri {#names-of-your-own}

Kamus hanya mengisi nama fisik selama nama itu kosong atau memang diisi oleh kamus sebelumnya. Editor mengingat hal ini untuk setiap tabel dan kolom, meskipun tidak ada yang menunjukkannya di kanvas.

- Nama yang Anda tulis menjadi nama buatan Anda sendiri: mengetik di sel nama, mengganti nama tabel atau kolom dengan Temukan dan Ganti, menempel di atas sel nama kolom, dan penggantian nama oleh agen pemrograman. Nama logis yang ditulis kemudian membiarkannya apa adanya, hanya menulis nama logis, dan tidak menautkan domain apa pun.
- Mengosongkan nama mengembalikan nama ke kamus, karena nama kosong selalu dihasilkan.
- Nama logis yang tidak menghasilkan apa pun membiarkan nama fisik dan statusnya seperti semula: nama kosong tetap kosong, dan nama yang dihasilkan mempertahankan namanya dan tetap milik kamus.
- Tabel atau kolom baru dimulai dengan nama kosong, sehingga nama logis pertamanya menghasilkan nama tersebut. Kolom kunci asing yang ditambahkan hubungan dinamai menurut kuncinya dan dianggap nama buatan Anda sendiri — lihat [Nama kolom kunci asing](./relationship-editing.md#foreign-key-column-names).
- Nama yang dibawa masuk oleh `Import` atau `Import and Add` Skema SQL, GraphQL, DBML, atau AML, serta nama pada diagram yang dibuat oleh rilis dari sebelum adanya tab Kamus, dianggap nama buatan Anda sendiri, sehingga nama logis yang kemudian ditulis padanya tidak menghasilkan apa pun.
- [Tabel yang diduplikasi](./table-related-functions.md#duplicating-tables-and-memos), kolom yang [dipindahkan ke tabel lain](./table-editing.md#rearranging-and-moving-columns) dengan pegangan seretnya, penempelan tabel yang disalin, dan `Import and Add` file JSON mempertahankan status setiap nama. Nama kolom yang ditempel ke tabel yang dipilih sebagai kolom baru dianggap nama buatan Anda sendiri, kecuali jika nama yang ditempel kosong dan nama logisnya menghasilkan nama.
- [Hasilkan ulang nama-nama fisik](#derive-physical-names-again) mengembalikan nama buatan Anda sendiri ke kamus, termasuk nama yang diimpor.

### Dua kolom, satu nama {#two-columns-one-name}

Kolom tidak menghasilkan apa pun saat kolom lain di tabelnya sudah memiliki nama yang akan dihasilkannya. Kolom itu mempertahankan namanya, statusnya, dan tautan domainnya, dan hanya nama logisnya yang ditulis. Nama dibandingkan dengan mengabaikan huruf besar/kecil dan spasi di kedua ujung, seperti nama kolom kunci asing.  
Saat satu perubahan akan memberi dua kolom nama yang sama, seperti yang dapat terjadi dengan `Replace All` atau `Derive Physical Names Again` pada sebuah tabel, kolom yang pertama di tabel mendapatkannya.  
Misalnya, hubungan yang merujuk dirinya sendiri pada `members` dengan kunci `MBR_NO` menambahkan `MBR_NO_2`, yang menyalin nama logis `Member Number`. `Derive Physical Names Again` akan menamainya `MBR_NO`, yang sudah dipakai kunci tersebut, sehingga kolom itu mempertahankan `MBR_NO_2`.  
Tabel tidak memiliki aturan seperti itu: dua tabel dapat menghasilkan nama yang sama.

## Hasilkan ulang nama-nama fisik {#derive-physical-names-again}

Gunakan `Derive Physical Names Again` setelah mengubah `Abbreviation` sebuah kata atau `Physical Name` atau `Domain` sebuah istilah, karena perubahan itu tidak mengganti nama apa pun dengan sendirinya. Perintah ini mengembalikan nama yang dicakupnya ke kamus dan menghasilkannya ulang menurut aturan di atas, termasuk nama yang Anda tulis sendiri. Perintah ini hanya tersedia di tab ERD, dan tidak di editor hanya baca:

- Menu konteks tabel, tepat setelah `Focus on this table` atau `Focus on selected tables`. Selama tabel tersebut merupakan salah satu dari dua tabel atau lebih yang dipilih, `Derive Physical Names Again` mencakup semuanya, di mana pun Anda mengklik kanan pada tabel. Jika tidak, klik kanan pada baris kolom memberikan `Derive Physical Name Again`, khusus untuk kolom tersebut, dan klik kanan pada header memberikan `Derive Physical Names Again`, untuk nama tabel dan setiap kolom.
- Menu konteks kanvas, tepat setelah `Name View`: `Derive Physical Names Again`, untuk setiap tabel dan kolom di diagram. Item ini tidak ditampilkan selama diagram tidak memiliki tabel.
- [Pencarian Cepat](./quick-search.md#what-the-palette-lists), sebagai baris untuk kolom yang difokuskan, tabel yang difokuskan, tabel yang dipilih, dan seluruh diagram.

![Mengubah singkatan Number dari NO menjadi NUM di lembar Words, nama fisik tetap MBR_NO dan PAY_NO di diagram, lalu Derive Physical Names Again dari menu kanvas mengubahnya menjadi MBR_NUM dan PAY_NUM, sedangkan ORD_NO, yang diberikan istilahnya, tetap](/img/demo-derive-physical-names.webp)

Setiap tabel dan kolom yang dicakup dan memiliki nama logis dihasilkan ulang. Kolom juga mengambil domain yang diberikan istilahnya, dan bersamanya tipe domain tersebut, yang menyebar di sepanjang hubungan selama [Sinkronisasi tipe data hubungan](./settings.md#relationship-datatype-sync) aktif.  
Perintah ini tidak menyentuh tabel atau kolom tanpa nama logis, serta kolom yang nama barunya sudah dipakai kolom lain di tabelnya — lihat [Dua kolom, satu nama](#two-columns-one-name). Masing-masing mempertahankan nama dan statusnya, buatan Anda sendiri atau milik kamus, dan kolom juga mempertahankan tautan domainnya.  
Nama logis yang kini tidak menghasilkan apa pun membiarkan nama fisik apa adanya, tetapi mengembalikannya ke kamus, sehingga nama logis berikutnya yang Anda tulis menghasilkannya.  
Perintah ini merupakan satu langkah pembatalan, berapa pun banyaknya nama, tautan, dan tipe yang diubahnya. Perintah ini tidak mencatat langkah hanya jika tidak mengubah apa pun, dan mengembalikan nama buatan Anda sendiri ke kamus dihitung sebagai perubahan, bahkan saat nama tersebut sudah berisi apa yang diberikan kamus.

`Physical Name` milik istilah itu sendiri tidak disusun ulang dari kata yang diubah, jadi edit istilahnya sebelum menghasilkan ulang.

## Domain dan tipe data {#domains-and-data-types}

Kolom yang tertaut ke domain memiliki `Data Type` domain tersebut. Menautkan kolom langsung memberinya tipe itu.  
Saat `Data Type` sebuah domain berubah, baik diedit, ditempel, atau diimpor di lembar `Domains` maupun diubah oleh kolaborator atau agen pemrograman, setiap kolom yang tertaut ke domain tersebut mengambil tipe baru dalam langkah yang sama. Selama [Sinkronisasi tipe data hubungan](./settings.md#relationship-datatype-sync) aktif, setiap perubahan itu berlanjut di sepanjang hubungan seperti perubahan yang diketik; selama nonaktif, hanya kolom yang tertaut yang berubah.  
Mengganti nama domain hanya mengubah nama yang ditampilkan di sel Domain kolom-kolomnya.

Perubahan tipe yang dibuat di lembar `Domains` dibatalkan di sana, bersama dengan tipe kolom yang diberikannya — lihat [Lembar kamus](./undo-redo.md#dictionary-sheets).  
Pembatalan atau pengulangan di tab ERD yang menautkan kembali kolom ke domain, atau mengembalikan kolom yang tertaut ke domain, memberi kolom tersebut tipe domain sebagaimana adanya saat ini. Pembatalan atau pengulangan yang mengembalikan tipe lain melepas tautan kolom.

### Menautkan kolom {#linking-a-column}

Kolom ditautkan ke domain melalui:

- Memilih domain di sel Domain kolom, yang ditampilkan View Option → `Domain`, atau, dalam tampilan `Logical Names`, di sel tipe yang menggantikannya — lihat [Sel Domain](./logical-names.md#the-domain-cell).
- Nama logis yang istilahnya memberikan domain — lihat [Dari istilah](#from-a-term). Hal ini hanya terjadi selama nama dihasilkan, jadi tidak untuk nama buatan Anda sendiri atau untuk kolom yang nama hasilnya sudah dipakai kolom lain.
- `Derive Physical Name Again` atau `Derive Physical Names Again`, yang menautkan domain dari istilah setiap kolom yang dicakup.
- Hubungan: kolom kunci asing menyalin domain kuncinya, beserta tipe dan nama logisnya — lihat [Hubungan pengidentifikasi](./relationship-editing.md#identifying-relationships). Kunci yang salinannya mendapat tipe lain, seperti salinan kunci serial, tidak meneruskan domain.
- Menduplikasi tabelnya, atau memindahkannya ke tabel lain dengan pegangan seretnya, yang keduanya mempertahankan tautan. Penempelan tabel atau kolom yang disalin hanya mempertahankannya selama diagram ini mencantumkan domain tersebut dan domain itu masih memiliki tipe kolom yang disalin, sehingga salinan dari diagram lain masuk tanpa tautan — lihat [Menyalin/menempel tabel dan memo](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` tidak menautkan kolom apa pun.
- Nama domain yang ditempel ke sel Domain — lihat [Menyalin/menempel kolom](./table-editing.md#copyingpasting-columns).

### Melepas tautan {#unlinking}

- Mengetik tipe ke sel `DataType` kolom yang tertaut, atau menerima saran, melepas tautan kolom begitu tipenya berbeda dari tipe domainnya, dan kolom mempertahankan tipe yang Anda ketik — lihat [Pelengkapan otomatis tipe data](./table-editing.md#datatype-autocomplete). Mengetik kembali tipe domain tidak menautkannya lagi; pilih domain di sel Domain-nya sebagai gantinya. Penempelan di atas sel `DataType` dan perubahan tipe oleh agen pemrograman melepas tautan dengan cara yang sama.
- Selama Sinkronisasi tipe data hubungan aktif, setiap kolom yang dicapai perubahan tipe dan tipe barunya berbeda dari tipe domainnya sendiri dilepas tautannya dalam langkah yang sama, seperti kunci asing yang tertaut ke domainnya sendiri. [Petakan Kolom](./relationship-editing.md#map-columns) melepas tautan kolom yang tipenya diubahnya dengan cara yang sama.
- `None` di sel Domain melepas tautan kolom dan mempertahankan tipenya.
- Mengubah atau mengosongkan `Domain` sebuah istilah, atau menghapus istilah, tidak mengubah kolom apa pun.

### Menghapus domain {#removing-a-domain}

Menghapus baris domain membiarkan kolom-kolomnya pada tipenya masing-masing, dan tautannya tetap ada. Kolom tersebut tidak menampilkan domain, dan lembar `Checks` mencantumkan `Unknown domain` untuk masing-masing selama lembar `Domains` masih memuat domain. Membatalkan penghapusan di lembar `Domains` menampilkan tautannya lagi.  
Selama domain tersebut tidak ada, mengetik tipe selain tipe domain ke kolom seperti itu melepas tautannya secara permanen, begitu pula `None` di sel Domain-nya.  
File tidak menyertakan tautan tersebut saat disimpan, sehingga diagram dibuka kembali dengan kolom-kolom itu tanpa tautan.

Istilah yang tertaut ke domain yang dihapus menampilkan sel `Domain` kosong, yang ditandai sebagai `Unknown domain`. `Delete` atau `Backspace` pada sel tersebut melepas tautannya — lihat [Domain istilah](#a-terms-domain).

## Lembar Pemeriksaan {#the-checks-sheet}

Lembar `Checks` mencantumkan apa yang ditemukan pemeriksaan kamus di kamus serta di tabel dan kolom diagram. Pemeriksaan hanya membaca: pemeriksaan tidak mengubah apa pun.  
Setiap pemeriksaan hanya berjalan selama lembar yang dibacanya memuat baris, dan pemeriksaan kata hanya selama lembar `Words` memuat kata yang bernama, sehingga diagram dengan kamus kosong tidak mencantumkan apa pun.

![Customer Num ditampilkan merah dan Order Stat kuning dalam Logical Names, lembar Checks mencantumkan tiga pemeriksaannya dengan hitungan merah, klik dua kali pada baris Forbidden word kembali ke Customer Num di diagram, dan mengetik ulang menjadi Member Number, yang menyisakan satu pemeriksaan](/img/demo-dictionary-checks.webp)

Ketiga kolomnya hanya baca:

- `Type` menyebutkan pemeriksaannya — lihat [Apa yang ditemukan setiap pemeriksaan](#what-each-check-finds).
- `Target` menyebutkan kata, istilah, atau domain dengan namanya, tabel dengan namanya, dan kolom sebagai `table.column`, dengan tabel dan kolom dinamai seperti [Tampilan Nama](./logical-names.md#beyond-the-canvas) menamainya, dan `unnamed` jika tampilan tidak menampilkan nama.
- `Detail` menampilkan apa yang ditemukan pemeriksaan dan, setelah `→`, apa yang ditawarkan kamus sebagai gantinya, beberapa digabungkan dengan koma, seperti `멤버 → 회원`. Sisi yang kosong bertuliskan `—`, seperti dalam `— → NUMERIC(15)`.

Pemeriksaan kata muncul lebih dulu, lalu pemeriksaan istilah dan domain, lalu tabel demi tabel, setiap tabel diikuti kolom-kolomnya.  
Daftar mengikuti setiap perubahan begitu diterapkan, termasuk perubahan kolaborator dan agen pemrograman, serta setiap penggantian Tampilan Nama.  
Hitungan pada tombol `Checks` berwarna merah selama ada pemeriksaan yang berupa kesalahan, kuning selama semuanya berupa peringatan, dan redup jika tidak ada.

Barisnya tidak dapat diedit, ditambahkan, dihapus, diurutkan, diimpor, atau diekspor: bilah tidak menampilkan alat apa pun, klik kanan tidak membuka menu kisi, dan Batalkan serta Ulangi tidak melakukan apa pun. Mencari, memilih, dan menyalin berfungsi seperti di lembar lainnya.

`Enter` atau klik dua kali pada baris menuju ke apa yang disebutkannya:

- Kata, istilah, atau domain: tab menampilkan lembarnya dengan sel yang dibaca pemeriksaan terpilih, yaitu nama atau `Domain` istilah, dan barisnya berada paling atas di layar. Pencarian lembar dikosongkan jika menyembunyikan baris tersebut. Baris yang sudah dihapus tidak menuju ke mana pun.
- Tabel atau kolom: tab ERD muncul dengan hanya tabel tersebut yang dipilih dan sel yang dibaca pemeriksaan difokuskan. Sel itu adalah nama, nama logis, atau sel Domain, atau, jika baris tidak menampilkan sel tersebut, sel yang ditampilkan sebagai gantinya. Kanvas menerima fokus keyboard, dan area pandang bergerak menurut aturan di [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands).

Klik dua kali pada header, tepi kolom, bilah gulir, atau di bawah baris tidak menuju ke mana pun.  
Agen pemrograman mencantumkan pemeriksaan yang sama, dalam urutan yang sama, dengan `erd_list_checks` — lihat [Pemeriksaan kamus](../../mcp/tools.md#dictionary-checks).

Tiga lembar lainnya menandai sel yang dibaca pemeriksaan, yaitu nama atau `Domain` istilah, dengan teks merah atau kuning pada latar berwarna:

- Merah: nama yang juga dimiliki baris lain di lembarnya, `Domain` istilah yang menautkan domain yang dihapus, dan `Term` yang memakai kata terlarang.
- Kuning: `Term` yang memakai sinonim atau kata yang tidak terdaftar.

Sel mengikuti tingkatnya yang lebih tinggi. Tanda juga muncul di editor hanya baca, dan lembar `Checks` sendiri tidak diwarnai. Untuk tanda di kanvas ERD, lihat [Tanda di kanvas](#marks-on-the-canvas).

### Apa yang ditemukan setiap pemeriksaan {#what-each-check-finds}

| `Type` | Tingkat | Yang ditemukan | `Detail`, misalnya |
| --- | --- | --- | --- |
| `Duplicate name` | Kesalahan | `Word`, `Term`, atau `Domain` yang juga dimiliki baris lain di lembar yang sama. Setiap baris tersebut dicantumkan. | `Member` |
| `Unknown domain` | Kesalahan | Kolom atau istilah yang masih tertaut ke domain yang dihapus, selama lembar `Domains` memuat domain | Nama domain yang dihapus |
| `Forbidden word` | Kesalahan | Penggalan nama logis atau `Term` yang dicantumkan sebuah kata dalam `Forbidden Words`-nya | `커스터머 → 고객` |
| `Unregistered word` | Peringatan | Penggalan nama logis tabel atau kolom, atau `Term`, yang tidak dicantumkan kata mana pun | `자` |
| `Synonym` | Peringatan | Penggalan yang dicantumkan sebuah kata dalam `Synonyms`-nya | `멤버 → 회원` |
| `Physical name mismatch` | Peringatan | Tabel atau kolom yang nama logisnya cocok dengan sebuah istilah tetapi nama fisiknya bukan nama yang diberikan istilah tersebut | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Peringatan | Kolom yang `DataType`-nya bukan `Data Type` domain yang ditautkannya | `INT → NUMERIC(15)` |

- Nama dibandingkan setelah dipangkas, dengan huruf besar/kecil diperhitungkan, sehingga `Member` dan `member` adalah dua nama, dan nama kosong tidak pernah menjadi duplikat. Lembar menolak perubahan yang akan memberi dua baris satu nama, sehingga `Duplicate name` hanya muncul jika dua perubahan bersilangan, misalnya dua kolaborator menamai baris secara bersamaan, atau di file yang diedit di tempat lain.
- Pemeriksaan kata membaca nama seperti [Dari kata](#from-the-words), dan mencantumkan setiap penggalan yang berbeda sekali per nama. `Forbidden word` dan `Synonym` menawarkan kata yang mencantumkan penggalan tersebut.
- `Physical name mismatch` membandingkan nama, setelah dipangkas, dengan `Physical Name` istilah, atau dengan apa yang disusun kata-katanya selama istilah tidak memilikinya, dan tidak menyatakan apa pun selama istilah tidak memberikan nama. Kolom kunci asing yang menyalin nama logis kuncinya menampilkannya setiap kali namanya sendiri berbeda dari nama istilah, seperti `members_id → MBR_ID`. `Derive Physical Name Again` memperbaikinya, kecuali jika kolom lain sudah memakai nama tersebut.
- `Domain type mismatch` tidak pernah muncul dari perubahan di satu editor, karena kolom yang tertaut selalu berakhir pada tipe domainnya. Pemeriksaan ini dapat muncul saat seorang kolaborator menautkan kolom selama kolaborator lain mengubah tipe domain tersebut, atau di file yang ditulis di tempat lain. Memilih domain lagi di sel Domain kolom memberi kolom tipenya, dan `None` melepas tautannya. Tautan ke domain yang dihapus hanya muncul sebagai `Unknown domain`.

### Tanda di kanvas {#marks-on-the-canvas}

Kanvas ERD menulis nama yang ditandai pemeriksaan dengan warna pemeriksaannya:

- Sel nama logis, di header tabel atau di baris kolom, berwarna merah selama nama logisnya memakai kata terlarang, dan jika tidak, kuning selama nama itu memakai sinonim atau kata yang tidak ada di lembar `Words`.
- Sel nama fisik, di header atau di baris, berwarna kuning selama istilah yang cocok dengan nama logisnya memberikan nama fisik lain.

Hanya kedua jenis sel itu yang ditandai, tidak pernah sel Domain atau `DataType`, sehingga `Unknown domain` dan `Domain type mismatch` milik kolom hanya muncul di lembar `Checks`.  
Sel hanya ditandai untuk apa yang ditampilkannya: `Physical Names` hanya dapat menandai nama fisik, `Logical Names` hanya nama logis, dan `Both Names` setiap sel menurut pemeriksaannya sendiri — lihat [Tampilan Nama](./logical-names.md#name-view). Sel kosong mempertahankan warna placeholder-nya, dan kamus kosong tidak menandai apa pun.  
Pada header tabel di dalam [grup tabel](./table-groups.md) berwarna, tanda hanya mempertahankan warnanya selama tetap terbaca di atas warna grup; jika tidak, nama memakai warna hitam atau putih milik header itu sendiri.

Tanda muncul di kanvas ERD, di [Perjalanan Waktu](./undo-redo.md#time-travel), dan di pratinjau [Tata Letak Otomatis](./table-related-functions.md#auto-layout), juga di editor hanya baca. Tab Visualisasi, kedua sisi [Penampil Perbedaan](./table-related-functions.md#diff-viewer), dan gambar yang diekspor tidak menampilkan tanda apa pun.  
Tanda mengikuti setiap perubahan saat terjadi, baik pada nama maupun pada kata, istilah, atau domain.

## Mencari {#searching}

Kotak pencarian bertuliskan `Search` dan muncul di keempat lembar, juga di editor hanya baca. Setiap lembar memiliki pencariannya sendiri.  
Baris cocok saat salah satu sel yang dicari memuat teks tersebut, dengan mengabaikan huruf besar/kecil, komposisi Unicode, dan spasi di sekitar teks pencarian. Kecocokan tidak pernah melintasi dua sel. Sel yang dicari:

- `Domains`: `Domain`, `Data Type`, dan `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name`, dan `Description`.
- `Terms`: `Term`, `Physical Name`, dan `Description`.
- `Checks`: ketiganya, sebagaimana tertulis dalam bahasa tampilan.

Pencarian baru menempatkan pilihan pada sel pertama dan menggulir ke atas.  
Selama kotak berisi teks, tombol `x` dengan tooltip `Clear search` mengosongkannya dan membiarkan kursor teks tetap di kotak. `Escape` di kotak juga mengosongkannya.  
Di kotak tersebut, `Ctrl + Z` (Windows/Linux) atau `⌘ + Z` (Mac) membatalkan ketikan Anda, bukan lembar, dan tombol baris dari [Menambahkan dan menghapus baris](#adding-and-deleting-rows) berfungsi sebagai tombol teks.  
`Add Row` dan penyisipan mengosongkan pencarian terlebih dahulu, karena baris kosong tidak cocok dengan pencarian apa pun. Impor mempertahankannya.

## Memilih dan berpindah {#selecting-and-moving}

Kisi memilih seperti spreadsheet:

- Klik memilih sel, dan seret memilih rentang, sambil menggulir di tepi lembar. `Shift + click` memperluas pilihan dari sel aktif, dan `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac) menambahkan rentang lain.
- Header kolom memilih kolomnya, nomor baris memilih barisnya, dan sudut kiri atas memilih setiap sel, seperti `Ctrl + A` (Windows/Linux) atau `⌘ + A` (Mac).
- Di Mac, `Ctrl + click` adalah klik kanan — lihat [Menu kisi](#the-grids-menu).

Dengan keyboard:

- Tombol panah berpindah satu sel, dan sambil menahan `Ctrl` (Windows/Linux) atau `⌘` (Mac) menuju tepi lembar ke arah tersebut.
- `Home` dan `End` menuju sel pertama dan terakhir baris, dan sambil menahan `Ctrl` atau `⌘` ke sel pertama dan terakhir lembar.
- `Page Up` dan `Page Down` berpindah sejauh satu layar baris.
- Menahan `Shift` bersama tombol mana pun di atas justru memperluas pilihan.
- `Tab` dan `Shift + Tab` berpindah ke kanan dan ke kiri, dan `Shift + Enter` berpindah ke atas. `Enter` saja mengedit sel — lihat [Mengedit sel](#editing-cells).

Saat baris di bawah pilihan hilang, karena pembatalan atau penghapusan oleh kolaborator, pilihan ditarik kembali ke dalam baris yang tersisa.

Seret tepi kanan header kolom untuk mengubah ukuran kolom, atau klik dua kali tepi tersebut untuk menyesuaikan kolom dengan teks terlebar di baris yang terlihat. Tidak ada tombol yang mengubah ukuran kolom.

## Mengedit sel {#editing-cells}

Mengetik pada sel yang dipilih mengganti nilainya. `Enter`, `F2`, atau klik dua kali mengedit nilai sebagaimana adanya, dengan kursor teks di ujungnya.  
Sel memuat satu baris teks, sehingga tab atau jeda baris yang ditempel ke dalamnya menjadi spasi.

- `Enter` menulis perubahan dan berpindah ke bawah, dan `Tab` menulisnya dan berpindah ke kanan. Dengan `Shift`, keduanya berpindah ke atas atau ke kiri.
- Klik di tempat lain, atau fokus keyboard yang meninggalkan kisi, juga menulisnya.
- `Escape` membatalkannya.

![Mengedit lembar Words: mengetik NUM di atas sel dan menekan Enter, menyisipkan baris dengan ⌥ + Enter dan mengisinya dengan Tab, mengurutkan menurut Word dari menu kisi, lalu mencari ord dan mengosongkan pencarian dengan Esc](/img/demo-dictionary-editing.webp)

Perubahan yang membiarkan nilai seperti semula tidak menulis apa pun, dan perubahan yang ditulis merupakan satu langkah pembatalan di lembarnya, berapa pun banyaknya yang diketik.  
`Delete` atau `Backspace`, tanpa pengeditan yang terbuka, mengosongkan setiap sel yang dipilih, sebagai satu langkah.  
Selama pengeditan terbuka, tombol pembatalan dan pengulangan membatalkan dan mengulangi ketikan Anda di sel, dan tombol baris mengetik sebagai teks — lihat [Tombol di tab](#keys-on-the-tab).  
Setiap sel di `Checks`, dan setiap sel di editor hanya baca, bersifat hanya baca dan tidak membuka pengeditan.

Saat ada baris dari pengeditan, penempelan, atau pengosongan yang ditolak, tidak ada bagiannya yang disimpan, dan notifikasi kesalahan menyebutkan alasannya, dengan menghitung barisnya dan menyebutkan tiga yang pertama:

- Nama yang dimiliki baris lain di lembar, atau yang ditulis baris lain dari penempelan yang sama: `Nothing saved: 1 row shares a name with another row (Member)`, atau `Nothing saved: 2 rows share a name with another row (…)`. Nama dibandingkan setelah dipangkas, dengan huruf besar/kecil diperhitungkan, sehingga `Member` dan `member` berbeda. Nama kosong tidak pernah ditolak.
- `Domain` istilah yang diberikan sebagai teks yang tidak dimiliki domain mana pun di lembar `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Baris yang dihapus kolaborator saat Anda mengeditnya: `Nothing saved: the row was removed`.

Penulisan dapat berdampak di luar selnya:

- Istilah yang diberi `Term` selama `Physical Name`-nya kosong mendapat nama yang disusun kata-katanya, jika kata-kata itu menyusun nama — lihat [Dari kata](#from-the-words). Hal ini terjadi sekali: nama tidak disusun ulang saat kata berubah kemudian.
- `Data Type` baru sebuah domain mengubah tipe setiap kolom yang tertaut ke domain tersebut, dalam langkah pembatalan yang sama — lihat [Domain dan tipe data](#domains-and-data-types).

### Domain istilah {#a-terms-domain}

`Enter`, `F2`, atau klik dua kali pada sel `Domain` istilah membuka daftar di bawah sel, atau di atasnya jika ruangnya lebih luas, dengan kotak pencarian bertuliskan `Domain`.  
Daftar memuat `None`, lalu setiap domain yang bernama sesuai urutan lembar `Domains`, dan sorotan dimulai pada domain yang ditautkan istilah, atau pada `None`. Mengetik karakter pada sel membuka daftar yang sudah dicari dengan karakter tersebut.

- Mengetik mempersempit daftar ke domain yang namanya memuat teks tersebut, tanpa memperhatikan huruf besar/kecil, membuang `None`, dan menyorot kecocokan pertama.
- `↑` dan `↓` memindahkan sorotan, berputar kembali di kedua ujung.
- `Enter` atau `Tab` memilih baris yang disorot, dan klik memilih baris yang diklik, sebagai satu langkah pembatalan. Istilah menautkan domain yang persis dipilih, bahkan salah satu dari dua domain dengan nama yang sama, dan `None` melepas tautannya.
- `Escape` atau klik di luar menutup daftar tanpa menulis apa pun yang diketik.

Jika tidak ada domain bernama di lembar `Domains`, kotak terbuka tanpa daftar.  
Teks yang ditempel menautkan domain pertama yang tercantum dengan nama tersebut, teks kosong melepas tautan, dan teks yang sama dengan yang ditampilkan sel mempertahankan tautan apa adanya. Nama lain apa pun ditolak — lihat [Mengedit sel](#editing-cells). `Delete` atau `Backspace` pada sel melepas tautan istilah, bahkan dari domain yang dihapus.

## Menyalin dan menempel {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) atau `⌘ + C` (Mac) menyalin pilihan sebagai teks yang dipisahkan tab, satu baris teks per baris, seperti cara spreadsheet menulisnya, sehingga teks tersebut ditempel ke spreadsheet sebagai sel. Tab atau jeda baris di dalam nilai menjadi spasi.  
Beberapa rentang hanya disalin bersama jika mencakup baris yang sama, berdampingan, atau kolom yang sama, bertumpuk satu di atas yang lain. Jika tidak, tidak ada yang disalin, dan notifikasi kesalahan `Nothing copied: the ranges share no rows or columns` muncul.

`Ctrl + V` (Windows/Linux) atau `⌘ + V` (Mac) menempel teks yang dipisahkan tab, seperti sel yang disalin dari spreadsheet, mulai dari sel aktif ke bawah dan ke kanan:

- Tanda kutip ditempel sebagai teks, sehingga sel spreadsheet yang memuat jeda baris tidak ditempel sebagai satu sel.
- Satu nilai mengisi setiap rentang yang dipilih.
- Baris yang melewati baris terakhir ditambahkan sebagai baris baru, secara berurutan, sehingga penempelan ke lembar kosong mengisinya.
- Kolom yang melewati kolom terakhir tidak disertakan, dan setelah sisanya disimpan, notifikasi `Columns past the last one weren't pasted` memberitahukannya.
- Penempelan beberapa sel kemudian memilih blok yang ditulisnya.

Penempelan merupakan satu langkah pembatalan, termasuk baris yang ditambahkannya, dan ditolak secara keseluruhan karena nama duplikat atau domain yang tidak dikenal — lihat [Mengedit sel](#editing-cells).  
Penyalinan, penempelan, atau pengosongan pada lebih dari satu juta sel tidak melakukan apa pun, dan notifikasi kesalahan `Nothing done: the selection covers too many cells` muncul.  
Potong, `Ctrl + X` (Windows/Linux) atau `⌘ + X` (Mac), tidak melakukan apa pun pada lembar. Menyalin dan menempel di tab ini tidak pernah sampai ke diagram, dan selama pengeditan sel terbuka, keduanya berlaku pada teks di sel.

## Menambahkan dan menghapus baris {#adding-and-deleting-rows}

`Add Row` menambahkan satu baris kosong di akhir lembar. Tombol ini mengosongkan pencarian, memilih sel pertama baris baru, dan memberi kisi fokus keyboard, sehingga ketikan mengisi sel tersebut.  
`Delete Rows` menghapus setiap baris yang dicakup pilihan, di kolom mana pun, dan satu kali pembatalan mengembalikan semuanya ke tempatnya. Tooltipnya menyebutkan tombol yang melakukan hal yang sama.

Dengan fokus keyboard di kisi dan tidak ada sel yang sedang diedit:

- `Alt + Enter` (Windows/Linux) atau `⌥ + Enter` (Mac) menyisipkan baris kosong di bawah pilihan sebanyak baris yang dicakupnya.
- `Alt + Shift + Enter` (Windows/Linux) atau `⌥ + Shift + Enter` (Mac) menyisipkannya di atas.
- `Alt + Backspace` atau `Alt + Delete` (Windows/Linux), atau `⌥ + Backspace` atau `⌥ + Delete` (Mac), menghapus baris yang dicakup pilihan.

Tombol-tombol ini melakukan hal yang sama dengan item sisipkan dan hapus baris di menu kisi — lihat [Menu kisi](#the-grids-menu). Penyisipan mengosongkan pencarian dan menempatkan baris baru tepat di atas baris pertama yang dicakup pilihan, atau tepat di bawah baris terakhirnya. Penyisipan memilih baris-baris itu di kolom pertama, dengan yang pertama aktif, dan merupakan satu langkah pembatalan.

Tombol-tombol ini adalah kombinasi tombol `Add Column` dan `Remove Column` di tab [Pintasan](./settings.md#shortcuts), sehingga host yang mengubah kombinasi tersebut dengan [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) juga memindahkannya. `Alt + Shift + Enter` adalah tombol `Add Column` dengan tambahan `Shift`, dan tidak memiliki baris tersendiri di sana.  
Dalam pengeditan yang terbuka dan di kotak pencarian, tombol-tombol ini berfungsi sebagai tombol teks, sehingga di Mac `⌥ + Backspace` menghapus satu kata. Di `Checks` dan di editor hanya baca, tombol-tombol ini tidak melakukan apa pun. Di tab ini, tombol-tombol ini tidak pernah menambahkan atau menghapus kolom tabel.  
Di Obsidian, tombol-tombol ini tetap sampai ke tab bahkan saat hotkey Obsidian memakai tombol yang sama.

Baris yang tidak pernah diisi, atau yang dikosongkan dari setiap nilainya, muncul di lembarnya dan sampai ke kolaborator, tetapi file tidak menyertakannya, sehingga baris itu hilang saat diagram dibuka kembali.

## Menu kisi {#the-grids-menu}

Klik kanan sel di `Domains`, `Words`, atau `Terms` untuk membuka menu kisi. Sel di luar pilihan menjadi pilihan terlebih dahulu.  
Klik kanan di bawah baris terakhir atau di kanan kolom terakhir membukanya untuk pilihan sebagaimana adanya, sehingga lembar kosong membukanya di mana pun di bawah header. Tombol menu atau `Shift + F10` membukanya untuk sel aktif.

- `Insert 1 row above`, `Insert 1 row below`, dan `Delete 1 row`, masing-masing menghitung baris yang dicakup pilihan, seperti `Insert 3 rows above`, dengan tombolnya di sebelah kanan — lihat [Menambahkan dan menghapus baris](#adding-and-deleting-rows).
- `Sort by <column>, ascending` dan `Sort by <column>, descending`, yang menyebutkan kolom yang Anda klik kanan, seperti `Sort by Word, ascending` — lihat [Mengurutkan](#sorting). Keduanya tidak ditampilkan di kanan kolom terakhir.
- `Import CSV` dan `Export CSV`, yang melakukan hal yang sama dengan tombol di bilah — lihat [Mengimpor dan mengekspor CSV](#importing-and-exporting-csv).

Jika tidak ada baris yang ditampilkan, di lembar kosong atau di bawah pencarian yang tidak cocok dengan apa pun, hanya `Insert 1 row below`, `Import CSV`, dan `Export CSV` yang muncul.  
`Checks` dan editor hanya baca membuka menu bawaan browser sebagai gantinya, begitu pula klik kanan pada header atau bilah gulir.  
Menu tertutup saat item dipilih, saat `Escape` ditekan, saat penunjuk ditekan di tempat lain di tab, saat pilihan atau lembar berubah, dan saat baris lembar berubah, baik oleh perubahan Anda maupun kolaborator.

## Mengurutkan {#sorting}

`Sort by <column>, ascending` dan `Sort by <column>, descending` mengubah urutan baris lembar itu sendiri, bukan hanya urutan tampilannya. Urutan baru disimpan di file, dilihat oleh kolaborator, dan diikuti oleh `Export CSV`, dan satu kali pembatalan mengembalikan urutan lama.  
Baris dibandingkan menurut teks yang ditampilkan sel, `Domain` istilah menurut nama domainnya, dalam urutan alfabet bahasa tampilan, dengan angka dibandingkan menurut nilainya, sehingga `2` muncul sebelum `10`. Sel kosong ditempatkan terakhir di kedua arah, dan baris yang setara mempertahankan urutannya. Mengurutkan lembar yang sudah dalam urutan tersebut tidak mencatat apa pun.  
Pencarian tetap seperti semula, begitu pula pilihan, yang selnya kini memuat baris lain.

## Mengimpor dan mengekspor CSV {#importing-and-exporting-csv}

Masing-masing `Domains`, `Words`, dan `Terms` diimpor dari file CSV dan diekspor ke file CSV. File ini khusus milik tab Kamus: `Import` dan `Export` di menu konteks kanvas tidak membaca maupun menulisnya — lihat [Mengimpor atau mengekspor file](./file-import-export.md).

### Mengimpor {#importing}

`Import CSV`, di bilah atau di menu kisi, membuka pemilih file bawaan browser untuk file `.csv`, bukan dialog impor milik host. Memilih file yang sama lagi mengimpornya lagi.  
File masuk ke kamus yang disebutkan header-nya, lembar mana pun yang sedang ditampilkan, lalu tab menampilkan lembar tersebut dan memberi kisinya fokus keyboard. Lembar mempertahankan pencarian, pilihan, dan gulirannya, sehingga baris yang disembunyikan pencarian, atau baris yang ditambahkan di bawah area yang terlihat, tetap tidak terlihat.  
File dibaca sebagai UTF-8, dengan atau tanpa byte order mark, atau sebagai EUC-KR jika bukan UTF-8 yang valid, seperti file standar data publik yang lebih lama.

![Membuka tab Kamus dari bilah alat, lalu mengimpor domain, kata dan istilah dengan Import CSV, setiap file mengalihkan tab ke lembarnya sendiri dan melaporkan apa yang ditambahkannya](/img/demo-dictionary-import.webp)

Cara baris diterapkan:

- Setiap baris yang bernama memperbarui baris lembar dengan nama tersebut, pada field yang kolomnya ada di file. Kolom yang tidak ada di file membiarkan field tersebut apa adanya. Nama dibandingkan setelah dipangkas, dengan huruf besar/kecil diperhitungkan.
- Nama yang tidak ada di lembar ditambahkan setelah baris terakhirnya, sesuai urutan di file.
- Impor tidak pernah menghapus baris.
- Baris dengan nama kosong dilewati. Jika file memuat satu nama dua kali, baris yang belakangan yang berlaku dan yang lebih awal dihitung sebagai dilewati. Baris teks yang kosong tidak dihitung sebagai baris.
- Domain sebuah istilah dicari menurut namanya, yaitu domain pertama dengan nama tersebut, dan nama yang tidak dimiliki domain mana pun membuat istilah tidak tertaut, jadi impor domain terlebih dahulu.

Satu impor merupakan satu langkah pembatalan di lembar tersebut.  
Notifikasi kemudian bertuliskan, misalnya, `1 added · 1 updated · 2 skipped`. Baris yang sama dengan baris di lembar tidak dihitung sebagai ditambahkan maupun diperbarui, sehingga mengimpor file yang sama lagi tidak mengubah apa pun dan tidak mencatat langkah.  
Selama istilah dalam file menyebutkan domain yang tidak ada di diagram, baris kedua menyebutkan tiga yang pertama, seperti `4 unknown domains: 연월일, 금액, 번호`.  
File yang header-nya tidak cocok dengan struktur mana pun, atau cocok dengan dua struktur, tidak membawa masuk apa pun, dan notifikasi kesalahan `Couldn't read this file as words, terms or domains` muncul.

### Struktur file {#file-layouts}

Setiap kamus membaca dua struktur. Yang pertama adalah struktur milik editor sendiri, yang ditulis `Export CSV`, dengan nama field sebagai header-nya:

| Kamus | Header | Wajib ada di file |
| --- | --- | --- |
| Kata | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Istilah | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domain | `name,category,dataType,description` | `name`, `dataType` |

Kolom boleh muncul dalam urutan apa pun, `domain` sebuah istilah memuat nama domain, dan kolom lain apa pun diabaikan. Huruf besar/kecil diperhitungkan di header, dan sel dibaca persis seperti yang tertulis, termasuk spasi.

Yang kedua adalah struktur file standar data publik Korea (공통표준):

| Kamus | Wajib ada di file | Juga dibaca |
| --- | --- | --- |
| Kata | `공통표준단어명` | `공통표준단어영문약어명` (singkatan), `공통표준단어 영문명` (nama bahasa Inggris), `공통표준단어 설명` (deskripsi), `이음동의어 목록` (sinonim), `금칙어 목록` (kata terlarang) |
| Istilah | `공통표준용어명` | `공통표준용어영문약어명` (nama fisik), `공통표준도메인명` (domain, menurut nama), `공통표준용어설명` (deskripsi), `용어 이음동의어 목록` (sinonim) |
| Domain | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategori), `공통표준도메인설명` (deskripsi), `데이터길이`, `데이터소수점길이` |

`데이터타입`, `데이터길이`, dan `데이터소수점길이` sebuah domain digabungkan menjadi satu tipe data: `NUMERIC(15,2)`, `CHAR(8)`, tipe saja jika tidak ada panjang, seperti `DATE`, dan skala 0 dihilangkan, seperti dalam `NUMERIC(15)`.  
Dalam file ini, spasi di ujung sel dipangkas, dan kolom lain, seperti riwayat revisi, diabaikan.  
Dalam kedua struktur, spasi dalam nama header tidak berpengaruh.

### Mengekspor {#exporting}

`Export CSV`, di bilah atau di menu kisi, menyimpan lembar yang ditampilkan dalam struktur milik editor sendiri: setiap baris sesuai urutan lembar, apa pun yang ditampilkan pencarian, dengan domain istilah ditulis menurut namanya, atau dibiarkan kosong untuk domain yang dihapus.  
File berformat UTF-8 dengan byte order mark dan akhir baris CRLF, dan hanya field yang memuat tanda kutip, koma, atau jeda baris yang diapit tanda kutip. File ini dapat dibuka di spreadsheet dan diimpor kembali menjadi baris yang sama.  
File dinamai `<database name>-<timestamp>-words.csv`, `-terms.csv`, atau `-domains.csv`, dan disimpan dengan cara yang sama seperti ekspor lain dari editor — lihat [Mengekspor](./file-import-export.md#exporting).

`Checks` tidak memiliki ekspor, dan editor hanya baca tidak menyediakan impor maupun ekspor.

## Batalkan dan Ulangi {#undo-and-redo}

`Domains`, `Words`, dan `Terms` masing-masing menyimpan riwayat pembatalan sendiri, terpisah dari riwayat diagram. Di tab ini, `Ctrl + Z` dan `Ctrl + Shift + Z` (Windows/Linux) atau `⌘ + Z` dan `⌘ + Shift + Z` (Mac), serta `Undo` dan `Redo` di bilah alat, berlaku pada lembar yang ditampilkan, dan bilah alat tidak menampilkan `Time Travel`. Di `Checks`, semuanya tidak melakukan apa pun.  
Batalkan di tab ERD tidak pernah menarik kembali perubahan pada lembar — lihat [Lembar kamus](./undo-redo.md#dictionary-sheets).

## Tombol di tab {#keys-on-the-tab}

Selama fokus keyboard berada di tab, pintasan editor berikut berlaku — lihat [Pintasan](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac), membuka [Pencarian Cepat](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac), beralih ke tab ERD dan membuka [Penjelajah](./explorer.md#opening-and-closing) pada pencariannya.
- `Undo` dan `Redo` berlaku pada lembar yang ditampilkan — lihat [Batalkan dan Ulangi](#undo-and-redo).
- `Add Column` dan `Remove Column` menyisipkan dan menghapus baris — lihat [Menambahkan dan menghapus baris](#adding-and-deleting-rows).

Selama pengeditan sel terbuka, termasuk daftar domain istilah, `Search` dan `Toggle Explorer` tidak melakukan apa pun, sehingga teks yang diketik tidak hilang.

Setiap pintasan editor lainnya tetap berada di tab dan tidak pernah sampai ke kanvas: `Alt + N` (Windows/Linux) atau `⌥ + N` (Mac) tidak menambahkan tabel, dan `Delete` serta `Backspace` tidak menghapus apa pun di kanvas.  
Tombol milik kisi sendiri justru berlaku pada lembar: `Enter` mengedit sel, `Delete` dan `Backspace` mengosongkan sel yang dipilih, `Ctrl + A` (Windows/Linux) atau `⌘ + A` (Mac) memilih setiap sel, dan `Escape` membatalkan pengeditan, menutup menu kisi, atau mengosongkan kotak pencarian. Salin, potong, dan tempel juga tetap berada di tab — lihat [Menyalin dan menempel](#copying-and-pasting).

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), tab terbuka dan menampilkan setiap lembar.  
Berpindah lembar, mencari, memilih, menggulir, mengubah ukuran kolom, dan menyalin berfungsi seperti biasa, begitu pula menuju pemeriksaan dari `Checks` dengan `Enter` atau klik dua kali. Tanda pemeriksaan juga muncul.

Tidak ada sel yang menerima pengeditan, penempelan, atau pengosongan, dan setiap sel yang tidak ditandai pemeriksaan ditampilkan dengan latar abu-abu sel hanya baca.  
`Add Row`, `Delete Rows`, `Import CSV`, dan `Export CSV` disembunyikan, tombol baris tidak melakukan apa pun, dan klik kanan membuka menu browser. Lembar kosong tidak menampilkan petunjuk, dan bilah alat tidak menampilkan `Undo` maupun `Redo`.

## Kolaborator dan file {#collaborators-and-the-file}

File diagram memuat kata, istilah, dan domain sesuai urutan lembarnya, termasuk urutan hasil pengurutan, dan tidak menyertakan baris yang tidak memuat nilai apa pun.  
File juga memuat nama logis setiap tabel dan kolom, apakah setiap nama fisik milik kamus, dan tautan domain setiap kolom selama domainnya tercantum. Pemeriksaan dan tanda dihitung dari data ini dan tidak pernah disimpan.

Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), para editor melihat perubahan kamus satu sama lain begitu diterapkan, termasuk pengurutan dan penyisipan. Masing-masing mempertahankan lembar, pencarian, dan pilihannya sendiri, dan riwayat lembarnya hanya memuat perubahannya sendiri.  
Pengeditan atau penempelan pada baris yang sementara itu dihapus kolaborator tidak menyimpan apa pun, dan notifikasi `Nothing saved: the row was removed` muncul.  
Editor dari rilis sebelum adanya tab Kamus menyimpan diagram tanpa nama logis, tautan domain, dan kamusnya — lihat [Mencampur rilis](../../api/advanced/collaborative-editing.md#mixing-releases).

`Import` Skema SQL, GraphQL, DBML, atau AML mempertahankan kamus, `Import` JSON menggantinya dengan kamus dari file, dan `Import and Add` tidak membawa masuk kamus apa pun — lihat [Mengimpor file eksternal](./file-import-export.md#importing-external-files).  
Agen pemrograman mengedit kata, istilah, dan domain, menetapkan nama logis dan domain, menghasilkan ulang nama fisik, dan mencantumkan pemeriksaan melalui server MCP — lihat [Kamus](../../mcp/tools.md#dictionaries) dan [Pemeriksaan kamus](../../mcp/tools.md#dictionary-checks). Agen tidak memiliki alat untuk file CSV.
