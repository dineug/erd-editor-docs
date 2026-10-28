---
sidebar_position: 15
description: Membatalkan dan mengulangi perubahan, apa yang dicatat riwayat, riwayat tersendiri milik lembar kamus, dan menelusuri riwayat diagram dengan Perjalanan Waktu.
---

# Batalkan, Ulangi

Anda dapat kembali ke keadaan pengeditan sebelumnya atau maju ke keadaan berikutnya.  
Riwayat menyimpan hingga `2048` perubahan.

- Batalkan: `Ctrl + Z` (Windows/Linux) atau `⌘ + Z` (Mac)
- Ulangi: `Ctrl + Shift + Z` (Windows/Linux) atau `⌘ + Shift + Z` (Mac)

Di tab ERD, bilah alat menyediakan kedua perintah yang sama sebagai tombol `Undo` dan `Redo`, di samping `Time Travel`. Di tab Kamus, bilah alat menampilkan `Undo` dan `Redo` tanpa `Time Travel`, dan tidak ada tab lain yang menampilkannya.  
Keduanya hanya aktif saat ada sesuatu yang dapat dibatalkan atau diulangi. Editor `readonly` menyembunyikannya dan `Time Travel`, dan pintasannya tidak membatalkan maupun mengulangi apa pun.

Batalkan dan Ulangi bekerja pada riwayat diagram hanya di tab ERD.  
Di sana, pintasan tidak aktif selama Pencarian Cepat, `Table Properties`, `Diff Viewer`, pratinjau `Auto Layout`, dialog [`Export image`](./file-import-export.md#image), [Petakan Kolom](./relationship-editing.md#map-columns), atau Perjalanan Waktu terbuka.  
Pintasan tetap berfungsi selama fokus keyboard berada di mana pun di [Penjelajah](./explorer.md#keys-in-the-explorer), termasuk pohonnya, dan selama [pemilih warna](./table-related-functions.md#table-and-memo-color-specification) terbuka. Bahkan saat kursor teks berada di salah satu kotak di dalamnya, seperti Temukan, Ganti, atau `Hex`, pintasan membatalkan dan mengulangi perubahan pada diagram, bukan pada teks di kotak tersebut.

Di tab lain:

- Kamus: keduanya membatalkan dan mengulangi perubahan pada lembar yang ditampilkan, `Domains`, `Words`, atau `Terms`, dari riwayat lembar itu sendiri, tidak pernah dari riwayat diagram. Di lembar `Checks`, keduanya tidak melakukan apa pun — lihat [Lembar kamus](#dictionary-sheets).
- Visualisasi: di `Flow`, tombol yang sama mundur dan maju melalui apa yang pernah ditampilkan Alur, seperti yang dilakukan `Previous table` dan `Next table`, termasuk di editor `readonly`. Di sana keduanya tidak pernah membatalkan atau mengulangi perubahan pada diagram — lihat [Tabel sebelumnya dan berikutnya](./visualization.md#previous-table-and-next-table). Di `Graph`, keduanya tidak melakukan apa pun.
- Skema SQL, Generator Kode, dan Pengaturan: keduanya tidak tersedia. Di kotak `Before tables` dan `After tables` pada tab Skema SQL, tombol yang sama justru membatalkan dan mengulangi ketikan Anda di kotak tersebut.

Riwayat berada di memori untuk sesi saat ini. Riwayat tidak disimpan di dokumen, sehingga diagram yang dibuka kembali dimulai dengan riwayat kosong.

![Memindahkan tabel dan menghapus kolom dengan ⌥ + Backspace, lalu membatalkan keduanya dengan ⌘ + Z dan mengulanginya dengan ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Apa yang dicatat riwayat {#what-the-history-records}

Dicatat:

- Tabel dan memo: penambahan, penghapusan, pemindahan, dan warna; nama, nama logis, dan komentar tabel; teks dan ukuran memo.
- Grup tabel: penambahan, penghapusan, pemindahan, pengubahan ukuran, nama, warna, dan grup tempat setiap tabel berada — lihat [Grup tabel](./table-groups.md).
- Kolom: penambahan, penghapusan, perubahan urutan, nama logis, domain tempat setiap kolom ditautkan, dan setiap opsi kolom.
- Nama fisik yang dihasilkan kamus, dan apakah setiap nama merupakan nama buatan Anda sendiri atau milik kamus: satu kali pembatalan mengembalikan nama beserta keadaan tersebut bersama-sama — lihat [Nama buatan Anda sendiri](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` dan `Derive Physical Names Again` — lihat [Hasilkan ulang nama-nama fisik](./dictionary.md#derive-physical-names-again).
- Hubungan: penambahan, penghapusan, perubahan tipe, kolom yang ditetapkan di [Petakan Kolom](./relationship-editing.md#map-columns), dan setiap pilihan dari `On Delete` atau `On Update` — lihat [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Membatalkan penghapusan mengembalikan hubungan beserta tindakan ON DELETE dan ON UPDATE-nya.
- Indeks dan kolomnya.
- Posisi area pandang, tingkat zoom, dan sakelar `View Option`.
- Skrip `Before tables` dan `After tables` di tab Skema SQL, satu langkah untuk setiap perubahan yang Anda terapkan dengan keluar dari kotaknya — lihat [Skrip sebelum dan setelah tabel](./schema-sql.md#before-and-after-scripts).
- Mengimpor file, dan menambahkan file dengan [`Import and Add`](./file-import-export.md#import-and-add).

Tidak dicatat:

- Vendor database dan nama database.
- Bahasa Generator Kode, `Table Name Case`, dan `Column Name Case`.
- Tipe tanda kutip, baik diatur di tab Skema SQL maupun di tab Generator Kode.
- Pilihan `Statements`, `Header`, `Write logical names into empty comments`, dan `Tables` di tab Skema SQL, yang dimiliki jendela editor — lihat [Panel opsi](./schema-sql.md#options-panel).
- Semua hal di tab Pengaturan, termasuk baris [`Lock`](./settings.md#lock).
- Penggantian Tampilan Nama, dari tempat mana pun, baik pengunciannya aktif maupun nonaktif — lihat [Mengganti tampilan](./logical-names.md#switching-the-view).
- Tema dan bahasa tampilan — lihat [Bahasa dan tema](./language-and-theme.md).
- Tabel, memo, atau grup mana yang digambar di depan yang lainnya.
- [Penjelajah](./explorer.md): membuka, menutup, atau mengubah ukurannya, menciutkan pohonnya, serta teks dan opsi pencarian. Namun, apa yang diubah oleh `Replace` dan `Replace All` tetap dicatat, begitu pula guliran yang dibuat oleh lompatan — lihat [Satu gerakan, satu langkah](#one-gesture-one-step).
- Zoom dan penggeseran di tab Visualisasi dalam kedua mode, pemindahan simpul graf atau kartu Alur, `Tidy Up`, tampilan baris, pemfokusan tabel, dan langkah mundur atau maju dengan `Previous table` dan `Next table` — lihat [Alur tidak pernah mengedit dokumen](./visualization.md#flow-never-edits-the-document).
- Lembar yang ditampilkan di tab Kamus, serta pencarian, pilihan, guliran, dan lebar kolom setiap lembar — lihat [Membuka tab](./dictionary.md#opening-the-tab).

Perubahan apa pun pada hal-hal ini tidak dapat dibatalkan.

Editor hanya baca tidak mencatat apa pun sama sekali. Posisi tampilan, zoom, dan sakelar `View Option` tetap berubah di sana, bersama tab, Tampilan Nama, database, dan pengaturan kode, tetapi hanya di layar itu, sehingga tidak ada yang dibatalkan — lihat [Editor hanya baca](./settings.md#read-only-editors) di Pengaturan.

Perubahan yang dibuat di tab Kamus dapat dibatalkan, tetapi masuk ke riwayat lembarnya sendiri, bukan riwayat ini, sehingga Batalkan di tab ERD tidak pernah mengembalikannya, bahkan `Data Type` baru suatu domain beserta tipe kolom yang diubahnya pun tidak — lihat [Lembar kamus](#dictionary-sheets).

Perubahan yang datang dari editor lain juga tidak dicatat, sehingga Batalkan hanya mengembalikan perubahan Anda sendiri. Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), setiap editor membatalkan perubahannya sendiri, dan agen pemrograman yang mengedit melalui [server MCP](../../mcp/live-and-headless.md#undo) membatalkan perubahannya sendiri dengan `erd_undo`.

Membatalkan `Import`, yang mengganti seluruh diagram, mengembalikan diagram sebelumnya sebagaimana keadaannya di editor saat Anda mengimpor, dengan setiap [penguncian](./settings.md#lock) aktif atau nonaktif dan setiap nilai terkunci seperti saat itu.  
Jika `Viewport` pada diagram tersebut terkunci, area pandang dan zoom kembali ke area pandang yang terkunci, tempat diagram terbuka, bukan ke tempat Anda berada sebelumnya. Dengan `Viewport` tidak terkunci, keduanya kembali ke tempat Anda berada saat mengimpor. Pengaturan terkunci lainnya, seperti tab yang sedang Anda buka, bahasa Generator Kode, atau Tampilan Nama, tetap seperti yang ada di layar Anda.  
Diagram baru dimulai dengan setiap penguncian aktif. Buka kunci `Viewport` sebelum mengimpor agar area pandang Anda tetap sama saat pembatalan semacam itu. Membuka kuncinya setelahnya, atau mengimpor file JSON yang penguncian `Viewport`-nya sendiri nonaktif, tidak mengubah ke mana pembatalan itu membawa Anda.

Membatalkan impor file JSON juga mengembalikan kata, istilah, dan domain yang dimiliki diagram sebelumnya. Impor Skema SQL, GraphQL, DBML, atau AML mempertahankan kamus, sehingga pembatalan dan pengulangannya membiarkan kamus apa adanya, termasuk perubahan yang dibuat di tab Kamus sejak saat itu.

Pembatalan atau pengulangan di tab ERD yang menautkan kembali kolom ke domain, atau mengembalikan kolom yang tertaut ke domain, memberi kolom tersebut tipe data domain sebagaimana adanya saat ini. Pembatalan atau pengulangan yang mengembalikan tipe lain pada kolom yang tertaut melepas tautan kolom tersebut — lihat [Domain dan tipe data](./dictionary.md#domains-and-data-types).

## Satu gerakan, satu langkah {#one-gesture-one-step}

Semua yang dikirim oleh satu gerakan menjadi satu entri riwayat.  
Menempel beberapa tabel dan memo sekaligus, atau menduplikasinya dengan `Alt + drag`, dibatalkan dalam satu langkah.

Satu kali penekanan `Delete` atau `Backspace`, atau `Delete selected` atau `Delete columns` di menu konteks, merupakan satu langkah, berapa pun banyaknya tabel, memo, grup tabel, atau kolom yang dihapusnya.  
Mengaktifkan atau menonaktifkan kunci utama pada beberapa kolom yang dipilih merupakan satu langkah, baik dengan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac) maupun dengan `Primary Key on selected columns` di menu konteks tabel.  
Memberi warna pada pilihan, atau menghapus warnanya dengan `No color` atau `Remove color`, merupakan satu langkah, berapa pun banyaknya tabel, memo, dan grup yang dipilih. Memilih warna yang sudah dimiliki semua yang dipilih tidak mencatat langkah apa pun, begitu pula `No color` saat tidak satu pun yang dipilih memiliki warna.  
`Map` atau `Save` di [Petakan Kolom](./relationship-editing.md#map-columns) merupakan satu langkah, bersama kolom kunci asing yang ditambahkannya dan tipe data yang diubahnya.  
`Import and Add` merupakan satu langkah, bersama guliran yang menampilkan blok yang ditambahkan di layar saat blok tersebut memerlukannya.

Memilih istilah dari daftar di bawah sel nama logis merupakan satu langkah: nama logis, nama fisik yang dihasilkannya, dan untuk kolom, domain istilah beserta tipe datanya — lihat [Melengkapi nama istilah](./logical-names.md#completing-term-names).  
Memilih domain di sel Domain kolom merupakan satu langkah, bersama tipe data yang diberikannya kepada kolom dan apa yang diteruskan [Sinkronisasi tipe data hubungan](./settings.md#relationship-datatype-sync) di sepanjang hubungan. Memilih `None`, yang melepas tautan kolom, juga merupakan satu langkah — lihat [Sel Domain](./logical-names.md#the-domain-cell). Mengetik tipe data selain tipe domainnya ke kolom yang tertaut melepas tautan kolom tersebut dalam langkah input itu.  
`Derive Physical Name Again` atau `Derive Physical Names Again` merupakan satu langkah, berapa pun banyaknya nama, tautan domain, dan tipe data yang diubahnya. Perintah ini tidak mencatat langkah hanya jika tidak mengubah apa pun. Mengembalikan nama buatan Anda sendiri ke kamus merupakan perubahan, bahkan saat nama tersebut sudah berisi apa yang diberikan kamus.

Membuat [grup tabel](./table-groups.md), dengan menggambarnya atau dengan mengelompokkan tabel yang dipilih melalui `Group selected tables` atau `T` lalu `G`, merupakan satu langkah bersama setiap tabel yang dimasukkannya. Menghapus grup merupakan satu langkah, dan membatalkannya mengembalikan grup beserta tabel di dalamnya.  
Menyeret grup melalui bilah judulnya memindahkan grup dan semua tabelnya dalam satu langkah. Tabel yang dilepaskan ke dalam atau ke luar grup berpindah grup dalam langkah yang sama dengan seretannya jika Anda melepaskan tombol mouse dalam sekitar `200ms` setelah gerakan terakhir, sehingga satu kali pembatalan mengembalikannya ke posisi semula dan ke grup tempatnya berada sebelumnya. Setelah jeda yang lebih lama sebelum melepaskan tombol mouse, perubahan grup menjadi langkah tersendiri, dan pembatalan pertama hanya mengembalikan perubahan itu.  
Mengubah ukuran grup melalui tepi atau sudutnya dicatat satu kali, saat Anda melepaskan tombol mouse.  
Menerapkan [Tata Letak Otomatis](./table-related-functions.md#auto-layout) merupakan satu langkah, termasuk grup yang disesuaikannya agar pas mengelilingi tabelnya.

`Replace All` di [Temukan dan Ganti](./find-and-replace.md#replacing) juga merupakan satu langkah, berapa pun banyaknya nama tabel, nama kolom, nama logis, nama indeks, nama grup tabel, komentar, dan memo yang diubahnya, termasuk nama fisik dan tautan domain yang dihasilkan dari nama logis tersebut. Jika tidak ada yang diubahnya, seperti saat `Preserve Case` menulis kembali setiap kecocokan seperti semula, perintah ini tidak mencatat langkah apa pun.  
Satu kali `Replace` merupakan satu langkah, termasuk apa yang dihasilkan nama logis dan guliran ke kecocokan berikutnya saat kecocokan itu memerlukannya. Jika `Replace` menulis kembali kecocokannya seperti semula, hanya guliran tersebut yang dicatat, atau tidak ada apa pun jika tidak ada guliran.  
Menuju kecocokan hanya menggulir kanvas jika kecocokan tersebut belum terlihat dengan baik — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands). Guliran tersebut dicatat seperti perubahan posisi area pandang lainnya, sehingga setelah menelusuri kecocokan, Batalkan terlebih dahulu mengembalikan guliran-guliran tersebut, satu per langkah.  
Lompatan lain yang berakhir di kanvas mencatat gulirannya dengan cara yang sama: memilih baris di Penjelajah, hasil Pencarian Cepat, pemeriksaan di lembar `Checks` di tab Kamus yang menyebut tabel atau kolom, atau [tombol kartu](./visualization.md#card-buttons) tautan eksternal di Alur. Lompatan yang membiarkan area pandang tetap di tempatnya tidak mencatat apa pun. Memilih baris di daftar `Diff Viewer` juga tidak mencatat apa pun, karena tindakan itu hanya menggerakkan kedua sisi hanya baca milik Penampil Perbedaan sendiri.

Seretan, penggeseran kanvas, zoom, gerakan cubit, atau perubahan warna yang berkelanjutan ditampung selama sekitar `200ms` dan juga masuk sebagai satu entri.  
Seretan yang bergerak kurang dari `20px` secara total tidak mencatat pemindahan. Hanya perubahan grup yang dibuatnya, jika ada, yang dicatat.

Pengetikan di sel atau memo dicatat per input, bukan per gerakan: setiap karakter yang diketik, setiap penempelan, dan setiap langkah komposisi IME merupakan langkah tersendiri.  
Sel nama logis dicatat dengan cara yang sama. Saat editornya tertutup dengan nama logis yang berbeda dari nama logis saat editor dibuka, nama fisik yang dihasilkan kamus darinya menjadi satu langkah tambahan setelah pengetikan. Pembatalan pertama hanya mengembalikan nama tersebut, beserta domain dan tipe data yang dibawa istilah, dan membiarkan nama logis yang Anda ketik. Jika tidak ada yang dihasilkan, tidak ada lagi yang dicatat — lihat [Menulis nama logis](./logical-names.md#writing-a-logical-name).  
Nama grup tabel dicatat satu kali, saat `Enter` atau keluar dari kotak teks menyimpannya, sehingga nama yang Anda ketik untuk grup yang baru saja dibuat merupakan langkah terpisah dari pembuatannya. `Esc`, atau nama yang tidak diubah, tidak mencatat apa pun.

## Lembar kamus {#dictionary-sheets}

Lembar `Domains`, `Words`, dan `Terms` di tab Kamus masing-masing menyimpan riwayatnya sendiri, terpisah dari riwayat diagram. Setiap perubahan yang dibuat di tab ini masuk ke riwayat lembar yang barisnya ditulis oleh perubahan tersebut. Seperti riwayat diagram, setiap riwayat menyimpan hingga `2048` langkah dan berada di memori selama sesi.

- Dengan fokus keyboard di tab ini, `Ctrl + Z` (Windows/Linux) atau `⌘ + Z` (Mac) membatalkan perubahan terakhir pada lembar yang ditampilkan, dan `Ctrl + Shift + Z` (Windows/Linux) atau `⌘ + Shift + Z` (Mac) mengulangi perubahan terakhir yang dibatalkan.
- `Undo` dan `Redo` di bilah alat melakukan hal yang sama, dan hanya aktif saat lembar yang ditampilkan memiliki perubahan yang dapat dibatalkan atau diulangi. Menekannya membiarkan fokus keyboard tetap di tempatnya, di kisi atau di kotak pencarian. Tab ini tidak memiliki `Time Travel`.
- Di lembar `Checks`, tempat tidak ada yang diedit, tombol tetap tidak aktif, dan baik tombol tersebut maupun tombol keyboard tidak melakukan apa pun.
- Saat pengeditan sel terbuka, atau kursor teks berada di kotak pencarian tab ini, tombol keyboard justru membatalkan dan mengulangi ketikan Anda di sana.

Riwayat-riwayat ini tidak pernah bercampur. Batalkan di tab ERD tidak pernah mengembalikan perubahan lembar, dan Batalkan pada suatu lembar tidak pernah mengembalikan perubahan lembar lain atau perubahan diagram. Setiap lembar mempertahankan riwayatnya selama Anda berpindah lembar atau tab.

Setiap hal berikut merupakan satu langkah pada lembarnya:

- Pengeditan sel, yang dicatat satu kali saat ditulis, bukan per karakter yang diketik, dan hanya jika mengubah nilainya — lihat [Mengedit sel](./dictionary.md#editing-cells).
- Penempelan, termasuk baris yang ditambahkannya, dan pengosongan sel yang dipilih dengan `Delete` atau `Backspace` — lihat [Menyalin dan menempel](./dictionary.md#copying-and-pasting).
- `Add Row`, serta setiap penyisipan atau penghapusan baris, dari bilah, menu kisi, atau tombol keyboard, berapa pun banyaknya baris yang dicakupnya — lihat [Menambahkan dan menghapus baris](./dictionary.md#adding-and-deleting-rows).
- Domain istilah yang dipilih dari daftarnya, termasuk `None` — lihat [Domain istilah](./dictionary.md#a-terms-domain).
- Pengurutan — lihat [Mengurutkan](./dictionary.md#sorting).
- Satu file CSV yang diimpor dengan `Import CSV`, berapa pun banyaknya baris yang ditambahkan atau diperbaruinya. Impor ini merupakan langkah dari lembar yang diisi file tersebut, yang kemudian ditampilkan tab, dari lembar mana pun Anda mengimpornya — lihat [Mengimpor](./dictionary.md#importing).

Penulisan yang tidak mengubah apa pun, seperti file yang sama yang diimpor lagi atau pengurutan lembar yang sudah dalam urutan tersebut, tidak mencatat langkah, begitu pula penulisan yang ditolak dengan notifikasi `Nothing saved: …`. Saat istilah tanpa `Physical Name` diberi nama, nama fisik yang disusun kata-katanya menjadi bagian dari langkah pengeditan tersebut.

`Data Type` baru suatu domain merupakan satu langkah lembar `Domains`, bersama tipe yang diberikannya kepada kolom yang tertaut ke domain tersebut dan kolom yang dijangkau Sinkronisasi tipe data hubungan dari kolom-kolom itu — lihat [Domain dan tipe data](./dictionary.md#domains-and-data-types).  
Membatalkan atau mengulanginya mengubah ulang tipe kolom yang tertaut ke domain pada saat itu, sehingga kolom yang sejak itu Anda tautkan ke domain lain atau yang tipenya Anda ubah mempertahankan tipenya. Kolom yang tautannya dilepas oleh langkah tersebut, seperti kunci asing yang dilepas sinkronisasi dari domainnya sendiri, ditautkan kembali hanya selama kolom itu masih tidak tertaut dan masih memiliki tipe yang ditinggalkan langkah tersebut.

Editor `readonly` menyembunyikan tombol, dan tombol keyboard tidak membatalkan maupun mengulangi apa pun.  
Perubahan dari kolaborator dan agen pemrograman juga tidak dicatat dalam riwayat lembar.

Riwayat setiap lembar dikosongkan saat kamus diganti: oleh `Import` file JSON, milik Anda atau milik kolaborator, oleh pembatalan atau pengulangannya, dan oleh pemuatan diagram lain ke editor. `Import` Skema SQL, GraphQL, DBML, atau AML mempertahankan kamus, dan bersamanya riwayat setiap lembar, termasuk selama pembatalan dan pengulangannya.

## Perjalanan Waktu {#time-travel}

Dibuka dari tombol `Time Travel` di bilah alat, di samping Batalkan dan Ulangi di tab ERD.  
Tombol ini tidak melakukan apa pun hingga riwayat diagram memiliki setidaknya satu perubahan yang tercatat. Editor hanya baca tidak menampilkan tombol seperti itu, dan editor yang menjadi hanya baca menutup Perjalanan Waktu tanpa menerapkannya.

Perjalanan Waktu membuka salinan diagram yang terpisah dan hanya baca, pada posisi gulir, tingkat zoom, dan [Tampilan Nama](./logical-names.md#name-view) yang sedang ditampilkan kanvas, baik penguncian `Viewport` atau `Name View` aktif maupun tidak.  
Perjalanan Waktu hanya menelusuri riwayat diagram, sehingga perubahan pada lembar kamus tidak termasuk dalam titik-titiknya.  
Seret penggeser, atau klik di mana pun pada jalurnya, untuk menelusuri seluruh riwayat pengeditan dan melihat pratinjau setiap titik. Posisi paling kiri penggeser adalah keadaan satu langkah sebelum perubahan pertama yang tercatat, dan penggeser terbuka dengan kenop di keadaan saat ini.  
Pratinjau ini pasif: pratinjau menggambar minimap, tetapi Anda tidak dapat menggeser, menggulir, atau mengeditnya, dan dokumen yang sebenarnya tetap tidak tersentuh hingga Anda menerapkannya.

Tekan `Apply` untuk memulihkan titik yang dipilih, atau `Cancel` atau `Esc` untuk membiarkan dokumen tidak berubah.

![Membuka Perjalanan Waktu, menyeret penggeser mundur menelusuri sesi, dan menerapkan titik sebelumnya](/img/demo-time-travel.webp)
