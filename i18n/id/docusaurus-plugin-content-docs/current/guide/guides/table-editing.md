---
sidebar_position: 3
description: Menambahkan, memilih, mengubah urutan, dan menghapus kolom, mengaktifkan atau menonaktifkan opsi kolom, serta menyalin atau menempel kolom.
---

# Pengeditan tabel

Pengeditan tabel pada dasarnya menawarkan pengalaman pengeditan yang mirip dengan Excel.  
[Tampilan Nama](./logical-names.md#name-view) menentukan apakah tabel menampilkan nama, nama logis, atau keduanya di header dan barisnya.  
Mode pengeditan dimulai dengan `Enter`, atau dengan mengeklik dua kali sebuah sel.  
`Enter` atau `Escape` mengakhirinya. Apa yang Anda ketik langsung diterapkan saat diketik, sehingga `Escape` mempertahankan teks alih-alih mengembalikannya. [Sel Domain](./logical-names.md#the-domain-cell) merupakan pengecualian: sel ini hanya memilih dari daftarnya dan tidak pernah mempertahankan apa yang Anda ketik. Menutup [sel nama logis](./logical-names.md#writing-a-logical-name) dengan nama logis yang telah berubah juga dapat mengisi nama fisik.  
`Escape` membiarkan sel tetap difokuskan dan tabel tetap dipilih, dan `Escape` kedua melepaskan keduanya. Selama sel nama logis menampilkan [daftar istilahnya](./logical-names.md#completing-term-names), `Escape` pertama hanya menutup daftar itu.  
Selama metode input masih menyusun teks, `Escape` membiarkan mode pengeditan tetap terbuka.

![Menambahkan tabel dengan Alt + N dan mengisi dua kolom](/img/demo-table-edit.webp)

## Menambahkan kolom {#adding-columns}

Dibuat menggunakan pintasan `Alt + Enter` (Windows/Linux) atau `⌥ + Enter` (Mac), yang menambahkan kolom ke setiap tabel yang dipilih, atau dengan tombol `+` pada header tabel, yang menambahkannya ke tabel itu.  
Sel pertama kolom baru mendapat fokus, yaitu sel pertama yang digambar barisnya dalam [urutan kolom](./settings.md#adjusting-column-order). Dengan urutan default, itu adalah namanya, yang dalam `Logical Names` adalah nama logisnya, dan dalam `Both Names` sel `Logical Name`-nya — lihat [Tampilan Nama](./logical-names.md#name-view).  
Kolom yang ditambahkan dengan `Tab` dari sel terakhir, dan kunci utama yang ditambahkan penggambaran hubungan ke tabel induk yang belum memilikinya, juga dimulai pada sel itu.

## Tombol Tab {#tab-key}

Tekan `Tab` untuk langsung masuk ke mode pengeditan sel berikutnya.  
Menekan `Tab` di sel terakhir membuat kolom baru dan membuka sel pertamanya untuk diedit — lihat [Menambahkan kolom](#adding-columns).  
Gunakan `Shift + Tab` untuk berpindah ke mode pengeditan sel sebelumnya.  
`Tab` dan `Shift + Tab` menelusuri sel yang ditampilkan tabel, sesuai urutannya, sehingga Tampilan Nama dan View Option → `Domain` menentukan apakah sel nama logis dan sel Domain termasuk di antaranya — lihat [Menulis nama logis](./logical-names.md#writing-a-logical-name).  
Tanda [kunci alternatif](./table-related-functions.md#alternate-keys) yang digambar setelah sel terakhir sebuah baris bukanlah sel, sehingga fokus keyboard melewatinya dan tanda itu tidak pernah terbuka untuk diedit.

![Berpindah antarsel sebuah baris dengan Tab, menambahkan kolom dari sel terakhir, dan kembali dengan Shift + Tab](/img/demo-table-tab.webp)

## Pelengkapan otomatis tipe data {#datatype-autocomplete}

Mulai mengedit sel `DataType` lalu ketik. Tipe yang cocok dari database yang dipilih disarankan, dan bagian saran yang secara harfiah memuat apa yang Anda ketik disorot.  
Pencocokannya sendiri bersifat fuzzy, sehingga `vch` juga menemukan `VARCHAR`.

- `Arrow Up` atau `Arrow Down`: berpindah di antara saran
- `Arrow Right`, `Tab`, atau `Enter`: menerima saran yang disorot
- `Arrow Left`: kembali ke teks yang Anda ketik

Anda juga dapat mengeklik saran.  
Daftar menampilkan hingga sepuluh saran sekaligus dan dapat digulir untuk melihat sisanya.  
Tidak ada yang dipaksakan, sehingga tipe yang tidak ada dalam daftar dapat diketik dengan bebas, termasuk argumen seperti `VARCHAR(255)`. Daftar tertutup begitu apa yang Anda ketik melampaui satu nama tipe utuh, seperti yang terjadi pada `VARCHAR(255)` atau `BIGINT UNSIGNED`.  
Saran mengikuti database yang dipilih. Mengganti database mengubah apa yang ditawarkan dan membiarkan kolom yang sudah ada tetap seperti semula.

Mengetik di sel `DataType` kolom yang tertaut ke domain, atau menerima saran di sana, melepas tautan kolom begitu tipenya berbeda dari tipe domain — lihat [Domain dan tipe data](./dictionary.md#domains-and-data-types).  
Dalam tampilan `Logical Names`, selama View Option → `Domain` nonaktif, sel tipe kolom yang tertaut ke domain yang memiliki nama menampilkan nama domain itu, dan mengeditnya membuka [pemilih domain](./logical-names.md#the-domain-cell), bukan saran-saran ini. Sel tipe yang menampilkan tipe data mengedit tipe data itu seperti di atas.

![Mengisi sel DataType dari saran fuzzy dengan tombol panah, Tab, dan Enter](/img/demo-data-type-autocomplete.webp)

## Tidak boleh NULL, Unik, Kenaikan otomatis {#not-null-unique-auto-increment}

Ketiga sel ini berupa sakelar, bukan teks.  
Klik dua kali salah satunya, atau tekan `Enter` selama sel itu difokuskan, untuk membalik nilainya.

Sel Tidak boleh NULL bertuliskan `N-N` saat aktif dan `NULL` saat tidak.  
`UQ` dan `AI` tampak redup saat nonaktif dan disorot saat aktif.

![Membalik Tidak boleh NULL dengan klik dua kali, serta Unik dan Kenaikan otomatis dengan Enter](/img/demo-column-options.webp)

Sel yang disembunyikan oleh [opsi tampilan tabel](./table-related-functions.md) tidak dapat diaktifkan atau dinonaktifkan.

## Memilih beberapa kolom {#selecting-multiple-columns}

Mendukung lima cara:

- `Shift + Arrow Up/Down`: memperluas pilihan satu baris setiap kali
- `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac): menambahkan satu kolom
- `Shift + click`: memilih rentang dari kolom yang terakhir difokuskan
- `Ctrl + Shift + click` (Windows/Linux) atau `⌘ + Shift + click` (Mac): menambahkan rentang tersebut ke pilihan
- `Alt + A` (Windows/Linux) atau `⌥ + A` (Mac): Pilih semua

![Memilih kolom dengan Shift + Arrow Down, Ctrl/⌘ + click, Shift + click, dan Alt + A](/img/demo-column-select.webp)

Untuk memindahkan kolom yang dipilih bersama-sama, seret pegangan di samping kolom yang difokuskan — lihat [Mengubah urutan dan memindahkan kolom](#rearranging-and-moving-columns).

Klik kanan pada baris kolom menentukan kolom mana yang menjadi sasaran menu konteks tabel, apa pun tombol pengubah yang ditahan.  
Pada baris yang sudah dipilih, pilihan tetap dipertahankan dan fokus berpindah ke baris itu. Pada baris lain, hanya baris itu yang dipilih. Hal ini berlaku di mana pun pada baris tersebut, termasuk ikon kunci dan tanda [kunci alternatif](./table-related-functions.md#alternate-keys).  
Jadi, untuk menjalankan tindakan pada beberapa kolom dari menu, seperti pada [Kunci utama kolom](#column-primary-key) atau [Penghapusan kolom](#column-deletion), klik kanan salah satu baris yang dipilih.  
Di Mac, `Ctrl + click` juga membuka menu, tetapi dihitung sebagai klik biasa, sehingga pada sel, pintasan ini hanya memilih baris itu sebelum menu terbuka.

## Mengubah urutan dan memindahkan kolom {#rearranging-and-moving-columns}

Kolom dipindahkan dengan pegangan seretnya, yaitu tombol kecil dengan ikon pegangan seret yang berada tepat di luar tepi kiri tabel, di samping baris yang difokuskan.  
Fokuskan sel mana pun dari kolom itu, dengan mengekliknya atau dengan tombol panah atau `Tab`, dan pegangan muncul di samping barisnya. Tidak ada baris yang memiliki pegangan selama fokus berada pada header tabel.  
Pegangan ditampilkan samar hingga penunjuk berada di atasnya, lalu penunjuk berubah menjadi tangan. Menekan saja tidak melakukan apa pun: penyeretan dimulai begitu penunjuk bergerak, dan dapat membawa kolom ke tempat lain di tabelnya atau ke tabel lain.  
Di atas baris tabel, baris yang diseret berpindah ke tempatnya dan baris di sekitar titik pelepasan bergeser ke samping untuk memberi ruang. Di atas kanvas kosong, atau di atas header tabel yang memiliki kolom, salinan baris yang tembus pandang mengikuti penunjuk dan menampilkan sel nama dan sel tipe setiap baris seperti yang ditampilkan baris itu di [Tampilan Nama](./logical-names.md#name-view) saat ini.  
Lepaskan tepat di bawah baris terakhir sebuah tabel untuk memindahkan kolom ke akhir tabel itu. Tabel tanpa kolom menerima pelepasan di mana pun pada tabel tersebut. Area sempit tepat di sebelah kiri tabel, tempat pegangan berada, juga dihitung sebagai baris tabel, sehingga seretan lurus ke bawah di sepanjang pegangan mengubah urutan kolom tanpa penunjuk masuk ke tabel.  
Kolom yang dipindahkan ke tabel lain mempertahankan nama logis dan domainnya.

![Memfokuskan kolom dan menyeret pegangan di samping barisnya ke posisi baru, lalu menyeret pegangan kolom lain ke tabel lain](/img/demo-column-move.webp)

Untuk memindahkan beberapa kolom sekaligus, [pilih kolom-kolom tersebut](#selecting-multiple-columns) lalu seret pegangan di samping kolom yang difokuskan. Selama kolom yang difokuskan merupakan salah satu dari dua kolom atau lebih yang dipilih di tabelnya, pegangan membawa semuanya; jika tidak, pegangan membawa kolomnya sendiri.  
Tidak diperlukan tombol pengubah. Menahan `Alt` (Windows/Linux) atau `⌥` (Mac) pada pegangan memindahkan kolom seperti seretan biasa dan tidak menduplikasi apa pun.

![Memilih tiga kolom, lalu menyeret pegangan di samping kolom yang difokuskan ke tabel lain, dengan kolom lain yang dipilih ikut berpindah](/img/demo-column-multi-move.webp)

Seretan yang dimulai pada baris kolom, bukan pada pegangannya, memindahkan tabel, seperti seretan pada headernya — lihat [Memindahkan beberapa tabel](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) atau `⌥ + drag` (Mac) pada baris menduplikasi tabel — lihat [Menduplikasi tabel dan memo](./table-related-functions.md#duplicating-tables-and-memos).  
Pegangan tidak ditampilkan pada zoom `70%` ke bawah, saat tabel hanya menampilkan namanya, maupun di editor hanya baca, sehingga urutan kolom tidak dapat diubah di sana.  
Seretan kolom yang sedang berlangsung saat editor menjadi hanya baca berakhir seketika: salinan yang mengikuti penunjuk dan tangan menggenggam hilang, dan melepas tidak memindahkan kolom. Baris yang sudah dipindahkan seretan tetap berada di tempat pemindahannya.

## Penghapusan kolom {#column-deletion}

Menghapus kolom yang dipilih pada tabel yang difokuskan. Mengeklik sel memilih kolomnya, sehingga mengeklik sel lalu menekan `Delete` menghapus satu kolom itu.  
Pintasan:

- `Delete` atau `Backspace`. Kedua tombol ini menghapus kolom yang dipilih selama tabelnya merupakan satu-satunya yang dipilih. Jika tidak ada kolom yang dipilih (fokus berada pada nama, [nama logis](./logical-names.md#name-view), atau komentar tabel), jika ada hal lain yang juga dipilih, atau pada zoom `70%` ke bawah, saat tabel hanya menampilkan namanya, keduanya justru menghapus seluruh pilihan — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` atau `Alt + Delete` (Windows/Linux), `⌥ + Backspace` atau `⌥ + Delete` (Mac). Pintasan ini menghapus kolom yang dipilih pada tabel yang difokuskan bahkan selama tabel atau memo lain juga dipilih. Pintasan ini tidak menghapus apa pun selama sel sedang diedit atau pada `70%` ke bawah.

![Menghapus satu kolom, lalu dua kolom yang dipilih, dengan Alt + Backspace](/img/demo-column-remove.webp)

Menu konteks tabel melakukan hal yang sama. Dengan tabel sebagai satu-satunya yang dipilih, klik kanan baris kolom: item terakhir menu bertuliskan `Delete column`, atau `Delete columns` jika baris itu merupakan salah satu dari dua kolom atau lebih yang dipilih.

Selama sel sedang diedit, `Delete` dan `Backspace` hanya menghapus teks. Saat ditahan di luar editor sel, keduanya hanya menghapus satu kali.  
Setelah penghapusan, fokus berpindah ke kolom tersisa terdekat di atas kolom yang difokuskan. Jika tidak ada lagi kolom di atasnya, fokus berpindah ke nama tabel (dalam tampilan `Logical Names`, nama logis yang ditampilkan di tempatnya) meskipun masih ada kolom di bawahnya, sehingga `Delete` atau `Backspace` berikutnya menghapus tabel, bukan kolom.  
Hubungan dan indeks yang menggunakan kolom yang dihapus ikut terhapus bersamanya. Tidak ada konfirmasi, dan seluruh penghapusan merupakan satu langkah pembatalan.

## Menyalin/menempel kolom {#copyingpasting-columns}

Bekerja seperti papan klip berbasis tabel.  
Pintasan: `Ctrl + C` (Windows/Linux) atau `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) atau `⌘ + V` (Mac)

Menyalin ke spreadsheet, menempel dari spreadsheet, dan menempel ke tabel yang sel kolomnya difokuskan menggunakan sel yang ditampilkan tabel, sesuai urutan tampilannya — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options), [Mengatur urutan kolom](./settings.md#adjusting-column-order), dan [Tampilan Nama](./logical-names.md#name-view). Tampilan Nama mengubah isi beberapa sel tersebut:

- Dalam tampilan `Logical Names`, sel nama berisi nama logis, atau kosong selama nama logis itu kosong. Selama View Option → `Domain` nonaktif, sel tipe berisi nama domain kolom jika sel itu menampilkannya, dan tipe data jika tidak.
- Dalam tampilan `Both Names`, sel `Logical Name` disalin dan ditempel di posisi yang ditentukan urutan kolom.
- Sel Domain yang ditampilkan berisi nama domain, atau kosong untuk kolom yang tidak menampilkan domain.

Kolom yang disalin di editor lalu ditempel saat header tabel dipilih, atau ke tabel lain yang dipilih, membawa setiap sel kolom yang disalin, termasuk sel tersembunyi seperti Unik dan Kenaikan otomatis, serta nama logisnya.  
Kolom tersebut mempertahankan tautan domain hanya selama diagram ini mencantumkan domain yang sama persis, bukan sekadar domain dengan nama yang sama, dan domain itu masih memiliki tipe kolom yang disalin. Jika tidak, kolom ditempel tanpa tautan, dengan tipe yang dimilikinya saat disalin. Namanya dianggap nama buatan Anda sendiri, kecuali jika nama yang ditempel kosong dan nama logis menghasilkan nama untuknya — lihat [Menghasilkan nama fisik](./dictionary.md#deriving-physical-names).  
Tanda [kunci alternatif](./table-related-functions.md#alternate-keys) seperti `AK1.1` bukan sel, sehingga penyalinan dan penempelan tidak menyertakannya bahkan selama tanda itu ditampilkan.

Anda dapat menempel dari editor ke Excel dan dari Excel kembali ke editor.  
Nilai sel dikeluarkan persis seperti yang diketik, sehingga nilai seperti `<label>` atau `a &amp; b` sampai di spreadsheet atau dokumen tanpa perubahan.  
Kolom spreadsheet dicocokkan dengan sel yang terlihat berdasarkan posisi, bukan nama, sehingga kolom lembar kerja harus mengikuti urutan sel tersebut.  
Untuk kolom berikut, nilai mana pun di bawah ini dibaca sebagai benar (tanpa membedakan huruf besar dan kecil):

- Kenaikan otomatis: `TRUE`, `1`, `YES`, `Y`
- Unik: `TRUE`, `1`, `YES`, `Y`
- Tidak boleh NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Saat menyalin keluar, editor menulis `TRUE` atau `FALSE` untuk Kenaikan otomatis dan Unik, serta `NOT NULL` atau `NULL` untuk Tidak boleh NULL.  
Unik dan Kenaikan otomatis disembunyikan secara default, sehingga `TRUE` dan `FALSE` hanya ditulis dan dibaca setelah sel-sel tersebut ditampilkan.

![Menempel empat kolom ke spreadsheet, dengan penanda ditulis sebagai TRUE/FALSE dan NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Menempel tiga baris spreadsheet ke tabel sebagai kolom, dengan YES, 1, dan NOT NULL dibaca sebagai benar](/img/demo-copy-sheet-column.webp)

Posisi hasil tempelan bergantung pada fokus:

- Saat header tabel dipilih, baris yang ditempel ditambahkan sebagai kolom baru ke setiap tabel yang dipilih.
- Saat sel kolom difokuskan, baris yang dipilih pada tabel itu, lalu baris di bawah baris terakhir yang dipilih, ditimpa secara berurutan sebanyak jumlah baris yang ditempel. Baris di antara pilihan yang terpisah dilewati. Baris yang ditimpa menerima nilai tempelan di sel yang terlihat dan mempertahankan nilai di sel yang tersembunyi, dan baris tempelan yang tersisa ditambahkan sebagai kolom baru. Setiap tabel lain yang dipilih mendapatkan baris yang ditempel sebagai kolom baru.

![Menyalin dua kolom dan menempelkannya ke dua tabel yang dipilih sekaligus](/img/demo-copy-column-multi.webp)

Baris yang ditempel menulis nama logis dan domain dengan cara berikut:

- Nama logis, dari sel `Logical Name` atau dari sel nama dalam tampilan `Logical Names`, dianggap diketik secara utuh. Selama nama kolom kosong atau masih berupa nama yang dihasilkan, [kamus](./dictionary.md#deriving-physical-names) menghasilkan nama fisik darinya dan menautkan domain yang diberikan istilahnya, kecuali jika sel Domain milik baris itu sendiri menautkan domain. Nama yang ditempel oleh baris yang sama dipertahankan dan dianggap nama buatan Anda sendiri.
- Sel Domain, atau sel tipe dalam tampilan `Logical Names` selama View Option → `Domain` nonaktif, menautkan domain yang disebut teksnya jika diagram mencantumkan domain itu. Teks lain, atau sel kosong, tidak menautkan domain apa pun dan melepas tautan kolom, bahkan dari domain dengan tipe yang ditempel. Teks di sel tipe yang tidak menyebut domain mana pun dibaca sebagai tipe data. Baris yang disalin di editor justru menautkan domain yang dimilikinya saat disalin, dan hanya selama diagram ini mencantumkan domain itu dengan tipe yang disalin, seperti kolom baru.
- Domain yang ditautkan memberikan tipe datanya kepada kolom, kecuali jika baris itu menempelkan tipenya sendiri. Dalam hal itu, domain dengan tipe lain tidak ditautkan, dan kolom mengambil tipe yang ditempel.
- Pada baris tanpa sel Domain, tipe yang ditempel melepas tautan kolom dari domain dengan tipe lain, seperti saat tipe itu diketik.
- Tidak ada penempelan yang membawa tipe melalui [Sinkronisasi tipe data hubungan](./settings.md#relationship-datatype-sync).

## Menyalin/menempel tabel dan memo {#copyingpasting-tables-and-memos}

Saat tidak ada kolom yang dipilih di dalam tabel yang difokuskan, pintasan yang sama menyalin tabel dan memo yang dipilih itu sendiri — lihat [Fungsi terkait tabel](./table-related-functions.md).

## Kunci utama kolom {#column-primary-key}

Mengaktifkan atau menonaktifkan kunci utama pada kolom yang difokuskan, yaitu kolom tempat sel yang difokuskan berada.  
Jika kolom yang difokuskan merupakan salah satu dari dua kolom atau lebih yang dipilih, tindakan ini berlaku untuk semua kolom yang dipilih: jika ada di antaranya yang bukan kunci, semuanya menjadi kunci, dan jika semuanya sudah merupakan kunci, kunci pada semuanya dihapus. Kolom di luar pilihan tidak diubah.  
Gunakan menu konteks tabel atau pintasan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac). Jika tindakan ini mencakup dua kolom atau lebih, item menu bertuliskan `Primary Key on selected columns`, bukan `Primary Key`.  
Ikon kunci di baris hanya untuk tampilan, sehingga mengekliknya tidak menetapkan kunci.

Untuk menjadikan beberapa kolom satu kunci komposit, [pilih kolom-kolom tersebut](#selecting-multiple-columns), lalu tekan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac), atau klik kanan salah satu baris yang dipilih dan pilih `Primary Key on selected columns`. Setiap pengaktifan atau penonaktifan merupakan satu langkah pembatalan.

![Memilih dua kolom dengan Shift + Arrow Down, lalu menjadikan keduanya kunci utama dengan ⌥ + K dan menghapus kunci keduanya dengan penekanan kedua](/img/demo-column-pk.webp)

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), tidak ada sel yang terbuka untuk diedit dan tidak ada kolom yang berubah.  
Klik pada sel tidak memfokuskan apa pun dan menghapus pilihan yang ditinggalkan sebuah lompatan. `Enter` dan klik ganda tidak membuka editor dan tidak membalik sakelar apa pun, `Tab` diserahkan kepada halaman, dan pintasan yang menambah, memilih semua, atau menghapus kolom, sakelar kunci utama, serta tempel tidak melakukan apa pun.  
Menuju kolom dari [Penjelajah](./explorer.md#going-to-a-row) atau [Pencarian Cepat](./quick-search.md) memfokuskan selnya. Tombol panah kemudian memindahkan fokus dari sel ke sel, dengan kolom yang dicapainya dipilih sendirian, karena `Shift` tidak menambah kolom di sana.  
`Ctrl + C` (Windows/Linux) atau `⌘ + C` (Mac) tetap menyalin kolom yang dipilih, atau tabel yang dipilih sebuah lompatan — lihat [Menyalin/menempel kolom](#copyingpasting-columns).
