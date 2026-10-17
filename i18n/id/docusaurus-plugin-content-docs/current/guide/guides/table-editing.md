---
sidebar_position: 3
description: Menambahkan, memilih, mengubah urutan, dan menghapus kolom, mengaktifkan atau menonaktifkan opsi kolom, serta menyalin atau menempel kolom.
---

# Pengeditan tabel

Pengeditan tabel pada dasarnya menawarkan pengalaman pengeditan yang mirip dengan Excel.  
Mode pengeditan dimulai dengan `Enter`, atau dengan mengeklik dua kali sebuah sel.  
`Enter` atau `Escape` mengakhirinya. Apa yang Anda ketik langsung diterapkan saat diketik, sehingga `Escape` mempertahankan teks alih-alih mengembalikannya.  
`Escape` membiarkan sel tetap difokuskan dan tabel tetap dipilih, dan `Escape` kedua melepaskan keduanya.  
Selama metode input masih menyusun teks, `Escape` membiarkan mode pengeditan tetap terbuka.

![Menambahkan tabel dengan Alt + N dan mengisi dua kolom](/img/demo-table-edit.webp)

## Menambahkan kolom {#adding-columns}

Dibuat menggunakan pintasan `Alt + Enter` (Windows/Linux) atau `⌥ + Enter` (Mac).  
Kolom ditambahkan ke setiap tabel yang dipilih.

## Tombol Tab {#tab-key}

Tekan `Tab` untuk langsung masuk ke mode pengeditan sel berikutnya.  
Menekan `Tab` di sel terakhir membuat kolom baru.  
Gunakan `Shift + Tab` untuk berpindah ke mode pengeditan sel sebelumnya.  
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

Klik kanan pada baris kolom menentukan kolom mana yang menjadi sasaran menu konteks tabel, apa pun tombol pengubah yang ditahan.  
Pada baris yang sudah dipilih, pilihan tetap dipertahankan dan fokus berpindah ke baris itu. Pada baris lain, hanya baris itu yang dipilih. Hal ini berlaku di mana pun pada baris tersebut, termasuk ikon kunci dan tanda [kunci alternatif](./table-related-functions.md#alternate-keys).  
Jadi, untuk menjalankan tindakan pada beberapa kolom dari menu, seperti pada [Kunci utama kolom](#column-primary-key) atau [Penghapusan kolom](#column-deletion), klik kanan salah satu baris yang dipilih.  
Di Mac, `Ctrl + click` juga membuka menu, tetapi dihitung sebagai klik biasa, sehingga pada sel, pintasan ini hanya memilih baris itu sebelum menu terbuka.

## Mengubah urutan dan memindahkan kolom {#rearranging-and-moving-columns}

Berfungsi saat `dragging`, dan memungkinkan pemindahan ke tabel lain.  
Baris yang diseret mengikuti penunjuk, dan baris di sekitar titik pelepasan bergeser ke samping untuk memberi ruang.  
Lepaskan tepat di bawah baris terakhir sebuah tabel untuk memindahkan kolom ke akhir tabel itu. Tabel tanpa kolom menerima pelepasan di mana pun pada tabel tersebut.

![Menyeret kolom ke posisi baru, lalu ke tabel lain](/img/demo-column-move.webp)

Mendukung pemindahan beberapa kolom dengan `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac).

![Memilih tiga kolom dan memindahkannya ke tabel lain dengan Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Penghapusan kolom {#column-deletion}

Menghapus kolom yang dipilih pada tabel yang difokuskan. Mengeklik sel memilih kolomnya, sehingga mengeklik sel lalu menekan `Delete` menghapus satu kolom itu.  
Pintasan:

- `Delete` atau `Backspace` (`⌫` di Mac). Kedua tombol ini menghapus kolom yang dipilih selama tabelnya merupakan satu-satunya yang dipilih. Jika tidak ada kolom yang dipilih (fokus berada pada nama atau komentar tabel), jika ada hal lain yang juga dipilih, atau pada zoom `70%` ke bawah, saat tabel hanya menampilkan namanya, keduanya justru menghapus seluruh pilihan — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` atau `Alt + Delete` (Windows/Linux), `⌥ + ⌫` atau `⌥ + Delete` (Mac). Pintasan ini menghapus kolom yang dipilih pada tabel yang difokuskan bahkan selama tabel atau memo lain juga dipilih. Pintasan ini tidak menghapus apa pun selama sel sedang diedit atau pada `70%` ke bawah.

![Menghapus satu kolom, lalu dua kolom yang dipilih, dengan Alt + Backspace](/img/demo-column-remove.webp)

Menu konteks tabel melakukan hal yang sama. Dengan tabel sebagai satu-satunya yang dipilih, klik kanan baris kolom: item terakhir menu bertuliskan `Delete column`, atau `Delete columns` jika baris itu merupakan salah satu dari dua kolom atau lebih yang dipilih.

Selama sel sedang diedit, `Delete` dan `Backspace` hanya menghapus teks. Saat ditahan di luar editor sel, keduanya hanya menghapus satu kali.  
Setelah penghapusan, fokus berpindah ke kolom tersisa terdekat di atas kolom yang difokuskan. Jika tidak ada lagi kolom di atasnya, fokus berpindah ke nama tabel meskipun masih ada kolom di bawahnya, sehingga `Delete` atau `Backspace` berikutnya menghapus tabel, bukan kolom.  
Hubungan dan indeks yang menggunakan kolom yang dihapus ikut terhapus bersamanya. Tidak ada konfirmasi, dan seluruh penghapusan merupakan satu langkah pembatalan.

## Menyalin/menempel kolom {#copyingpasting-columns}

Bekerja seperti papan klip berbasis tabel.  
Pintasan: `Ctrl + C` (Windows/Linux) atau `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) atau `⌘ + V` (Mac)

Menyalin ke spreadsheet, menempel dari spreadsheet, dan menempel ke tabel yang sel kolomnya difokuskan menggunakan sel yang ditampilkan tabel, sesuai urutan tampilannya — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options) dan [Mengatur urutan kolom](./settings.md#adjusting-column-order).  
Kolom yang disalin di editor lalu ditempel saat header tabel dipilih, atau ke tabel lain yang dipilih, membawa setiap sel kolom yang disalin, termasuk sel tersembunyi seperti Unik dan Kenaikan otomatis.  
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

## Menyalin/menempel tabel dan memo {#copyingpasting-tables-and-memos}

Saat tidak ada kolom yang dipilih di dalam tabel yang difokuskan, pintasan yang sama menyalin tabel dan memo yang dipilih itu sendiri — lihat [Fungsi terkait tabel](./table-related-functions.md).

## Kunci utama kolom {#column-primary-key}

Mengaktifkan atau menonaktifkan kunci utama pada kolom yang difokuskan, yaitu kolom tempat sel yang difokuskan berada.  
Jika kolom yang difokuskan merupakan salah satu dari dua kolom atau lebih yang dipilih, tindakan ini berlaku untuk semua kolom yang dipilih: jika ada di antaranya yang bukan kunci, semuanya menjadi kunci, dan jika semuanya sudah merupakan kunci, kunci pada semuanya dihapus. Kolom di luar pilihan tidak diubah.  
Gunakan menu konteks tabel atau pintasan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac). Jika tindakan ini mencakup dua kolom atau lebih, item menu bertuliskan `Primary Key on selected columns`, bukan `Primary Key`.  
Ikon kunci di baris hanya untuk tampilan, sehingga mengekliknya tidak menetapkan kunci.

Untuk menjadikan beberapa kolom satu kunci komposit, [pilih kolom-kolom tersebut](#selecting-multiple-columns), lalu tekan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac), atau klik kanan salah satu baris yang dipilih dan pilih `Primary Key on selected columns`. Setiap pengaktifan atau penonaktifan merupakan satu langkah pembatalan.

![Memilih dua kolom dengan Shift + Arrow Down, lalu menjadikan keduanya kunci utama dengan ⌥ + K dan menghapus kunci keduanya dengan penekanan kedua](/img/demo-column-pk.webp)
