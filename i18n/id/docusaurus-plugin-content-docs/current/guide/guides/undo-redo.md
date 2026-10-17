---
sidebar_position: 13
description: Membatalkan dan mengulangi perubahan, apa yang dicatat riwayat, dan menelusurinya dengan Perjalanan Waktu.
---

# Batalkan, Ulangi

Anda dapat kembali ke keadaan pengeditan sebelumnya atau maju ke keadaan berikutnya.  
Riwayat menyimpan hingga `2048` perubahan.

- Batalkan: `Ctrl + Z` (Windows/Linux) atau `⌘ + Z` (Mac)
- Ulangi: `Ctrl + Shift + Z` (Windows/Linux) atau `⌘ + Shift + Z` (Mac)

Bilah alat menyediakan kedua perintah yang sama sebagai tombol `Undo` dan `Redo`, di samping `Time Travel`.  
Keduanya hanya aktif saat ada sesuatu yang dapat dibatalkan atau diulangi. Editor `readonly` menyembunyikan ketiganya, dan pintasannya tidak melakukan apa pun.

Batalkan dan Ulangi hanya berlaku di tab ERD. Keduanya tidak tersedia di tab Visualisasi, Skema SQL, Generator Kode, dan Pengaturan. Di kotak `Before tables` dan `After tables` pada tab Skema SQL, tombol yang sama justru membatalkan dan mengulangi ketikan Anda di kotak tersebut.  
Pintasan juga tidak aktif selama Pencarian Cepat, `Table Properties`, `Diff Viewer`, pratinjau `Auto Layout`, dialog [`Export image`](./file-import-export.md#image), [Petakan Kolom](./relationship-editing.md#map-columns), atau Perjalanan Waktu terbuka.  
Pintasan tetap berfungsi selama fokus keyboard berada di mana pun di [Penjelajah](./explorer.md#keys-in-the-explorer), termasuk pohonnya, dan selama [pemilih warna](./table-related-functions.md#table-and-memo-color-specification) terbuka. Bahkan saat kursor teks berada di salah satu kotak di dalamnya, seperti Temukan, Ganti, atau `Hex`, pintasan membatalkan dan mengulangi perubahan pada diagram, bukan pada teks di kotak tersebut.

Riwayat berada di memori untuk sesi saat ini. Riwayat tidak disimpan di dokumen, sehingga diagram yang dibuka kembali dimulai dengan riwayat kosong.

![Memindahkan tabel dan menghapus kolom dengan ⌥ + Backspace, lalu membatalkan keduanya dengan ⌘ + Z dan mengulanginya dengan ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Apa yang dicatat riwayat {#what-the-history-records}

Dicatat:

- Tabel dan memo: penambahan, penghapusan, pemindahan, warna, nama dan komentar, teks dan ukuran memo.
- Grup tabel: penambahan, penghapusan, pemindahan, pengubahan ukuran, nama, warna, dan grup tempat setiap tabel berada — lihat [Grup tabel](./table-groups.md).
- Kolom: penambahan, penghapusan, perubahan urutan, dan setiap opsi kolom.
- Hubungan: penambahan, penghapusan, perubahan tipe, kolom yang ditetapkan di [Petakan Kolom](./relationship-editing.md#map-columns), dan setiap pilihan dari `On Delete` atau `On Update` — lihat [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Membatalkan penghapusan mengembalikan hubungan beserta tindakan ON DELETE dan ON UPDATE-nya.
- Indeks dan kolomnya.
- Posisi area pandang, tingkat zoom, dan sakelar `View Option`.
- Skrip `Before tables` dan `After tables` di tab Skema SQL, satu langkah untuk setiap perubahan yang Anda terapkan dengan keluar dari kotaknya — lihat [Skrip sebelum dan setelah tabel](./schema-sql.md#before-and-after-scripts).
- Mengimpor file, dan menambahkan file dengan [`Import and Add`](./file-import-export.md#import-and-add).

Tidak dicatat:

- Vendor database dan nama database.
- Bahasa Generator Kode, `Table Name Case`, dan `Column Name Case`.
- Tipe tanda kutip, baik diatur di tab Skema SQL maupun di tab Generator Kode.
- Pilihan `Statements`, `Header`, dan `Tables` di tab Skema SQL, yang dimiliki jendela editor — lihat [Panel opsi](./schema-sql.md#options-panel).
- Semua hal di tab Pengaturan, termasuk baris [`Lock`](./settings.md#lock).
- Tema dan bahasa tampilan — lihat [Bahasa dan tema](./language-and-theme.md).
- Tabel, memo, atau grup mana yang digambar di depan yang lainnya.
- [Penjelajah](./explorer.md): membuka, menutup, atau mengubah ukurannya, menciutkan pohonnya, serta teks dan opsi pencarian. Namun, apa yang diubah oleh `Replace` dan `Replace All` tetap dicatat, begitu pula guliran yang dibuat oleh lompatan — lihat [Satu gerakan, satu langkah](#one-gesture-one-step).
- Zoom dan penggeseran di tab Visualisasi dalam kedua mode, pemindahan simpul graf atau kartu Alur, `Tidy Up`, tampilan baris, dan pemfokusan tabel — lihat [Alur tidak pernah mengedit dokumen](./visualization.md#flow-never-edits-the-document).

Perubahan apa pun pada hal-hal ini tidak dapat dibatalkan.

Perubahan yang datang dari editor lain juga tidak dicatat, sehingga Batalkan hanya mengembalikan perubahan Anda sendiri. Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), setiap editor membatalkan perubahannya sendiri, dan agen pemrograman yang mengedit melalui [server MCP](../../mcp/live-and-headless.md#undo) membatalkan perubahannya sendiri dengan `erd_undo`.

Membatalkan `Import`, yang mengganti seluruh diagram, mengembalikan diagram sebelumnya sebagaimana keadaannya di editor saat Anda mengimpor, dengan setiap [penguncian](./settings.md#lock) aktif atau nonaktif dan setiap nilai terkunci seperti saat itu.  
Jika `Viewport` pada diagram tersebut terkunci, area pandang dan zoom kembali ke area pandang yang terkunci, tempat diagram terbuka, bukan ke tempat Anda berada sebelumnya. Dengan `Viewport` tidak terkunci, keduanya kembali ke tempat Anda berada saat mengimpor. Pengaturan terkunci lainnya, seperti tab yang sedang Anda buka atau bahasa Generator Kode, tetap seperti yang ada di layar Anda.  
Diagram baru dimulai dengan setiap penguncian aktif. Buka kunci `Viewport` sebelum mengimpor agar area pandang Anda tetap sama saat pembatalan semacam itu. Membuka kuncinya setelahnya, atau mengimpor file JSON yang penguncian `Viewport`-nya sendiri nonaktif, tidak mengubah ke mana pembatalan itu membawa Anda.

## Satu gerakan, satu langkah {#one-gesture-one-step}

Semua yang dikirim oleh satu gerakan menjadi satu entri riwayat.  
Menempel beberapa tabel dan memo sekaligus, atau menduplikasinya dengan `Alt + drag`, dibatalkan dalam satu langkah.

Satu kali penekanan `Delete` atau `Backspace`, atau `Delete selected` atau `Delete columns` di menu konteks, merupakan satu langkah, berapa pun banyaknya tabel, memo, grup tabel, atau kolom yang dihapusnya.  
Mengaktifkan atau menonaktifkan kunci utama pada beberapa kolom yang dipilih merupakan satu langkah, baik dengan `Alt + K` (Windows/Linux) atau `⌥ + K` (Mac) maupun dengan `Primary Key on selected columns` di menu konteks tabel.  
Memberi warna pada pilihan, atau menghapus warnanya dengan `No color` atau `Remove color`, merupakan satu langkah, berapa pun banyaknya tabel, memo, dan grup yang dipilih. Memilih warna yang sudah dimiliki semua yang dipilih tidak mencatat langkah apa pun, begitu pula `No color` saat tidak satu pun yang dipilih memiliki warna.  
`Map` atau `Save` di [Petakan Kolom](./relationship-editing.md#map-columns) merupakan satu langkah, bersama kolom kunci asing yang ditambahkannya dan tipe data yang diubahnya.  
`Import and Add` merupakan satu langkah, bersama guliran yang menampilkan blok yang ditambahkan di layar saat blok tersebut memerlukannya.

Membuat [grup tabel](./table-groups.md), dengan menggambarnya atau dengan mengelompokkan tabel yang dipilih melalui `Group selected tables` atau `T` lalu `G`, merupakan satu langkah bersama setiap tabel yang dimasukkannya. Menghapus grup merupakan satu langkah, dan membatalkannya mengembalikan grup beserta tabel di dalamnya.  
Menyeret grup melalui bilah judulnya memindahkan grup dan semua tabelnya dalam satu langkah. Tabel yang dilepaskan ke dalam atau ke luar grup berpindah grup dalam langkah yang sama dengan seretannya jika Anda melepaskan tombol mouse dalam sekitar `200ms` setelah gerakan terakhir, sehingga satu kali pembatalan mengembalikannya ke posisi semula dan ke grup tempatnya berada sebelumnya. Setelah jeda yang lebih lama sebelum melepaskan tombol mouse, perubahan grup menjadi langkah tersendiri, dan pembatalan pertama hanya mengembalikan perubahan itu.  
Mengubah ukuran grup melalui tepi atau sudutnya dicatat satu kali, saat Anda melepaskan tombol mouse.  
Menerapkan [Tata Letak Otomatis](./table-related-functions.md#auto-layout) merupakan satu langkah, termasuk grup yang disesuaikannya agar pas mengelilingi tabelnya.

`Replace All` di [Temukan dan Ganti](./find-and-replace.md#replacing) juga merupakan satu langkah, berapa pun banyaknya nama tabel, nama kolom, nama indeks, nama grup tabel, komentar, dan memo yang diubahnya. Jika tidak ada yang diubahnya, seperti saat `Preserve Case` menulis kembali setiap kecocokan seperti semula, perintah ini tidak mencatat langkah apa pun.  
Satu kali `Replace` merupakan satu langkah, termasuk guliran ke kecocokan berikutnya saat kecocokan itu memerlukannya. Jika `Replace` menulis kembali kecocokannya seperti semula, hanya guliran tersebut yang dicatat, atau tidak ada apa pun jika tidak ada guliran.  
Menuju kecocokan hanya menggulir kanvas jika kecocokan tersebut belum terlihat dengan baik — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands). Guliran tersebut dicatat seperti perubahan posisi area pandang lainnya, sehingga setelah menelusuri kecocokan, Batalkan terlebih dahulu mengembalikan guliran-guliran tersebut, satu per langkah.  
Lompatan lain yang berakhir di kanvas mencatat gulirannya dengan cara yang sama: memilih baris di Penjelajah, hasil Pencarian Cepat, atau [tombol kartu](./visualization.md#card-buttons) tautan eksternal di Alur. Lompatan yang membiarkan area pandang tetap di tempatnya tidak mencatat apa pun. Memilih baris di daftar `Diff Viewer` juga tidak mencatat apa pun, karena tindakan itu hanya menggerakkan kedua sisi hanya baca milik Penampil Perbedaan sendiri.

Seretan, penggeseran kanvas, zoom, gerakan cubit, atau perubahan warna yang berkelanjutan ditampung selama sekitar `200ms` dan juga masuk sebagai satu entri.  
Seretan yang bergerak kurang dari `20px` secara total tidak mencatat pemindahan. Hanya perubahan grup yang dibuatnya, jika ada, yang dicatat.

Pengetikan di sel atau memo dicatat per input, bukan per gerakan: setiap karakter yang diketik, setiap penempelan, dan setiap langkah komposisi IME merupakan langkah tersendiri.  
Nama grup tabel dicatat satu kali, saat `Enter` atau keluar dari kotak teks menyimpannya, sehingga nama yang Anda ketik untuk grup yang baru saja dibuat merupakan langkah terpisah dari pembuatannya. `Esc`, atau nama yang tidak diubah, tidak mencatat apa pun.

## Perjalanan Waktu {#time-travel}

Dibuka dari tombol `Time Travel` di bilah alat, di samping Batalkan dan Ulangi.  
Tombol ini tidak melakukan apa pun hingga sesi memiliki setidaknya satu perubahan yang tercatat.

Perjalanan Waktu membuka salinan diagram yang terpisah dan hanya baca, pada posisi gulir dan tingkat zoom yang sedang ditampilkan kanvas, baik penguncian `Viewport` aktif maupun tidak.  
Seret penggeser, atau klik di mana pun pada jalurnya, untuk menelusuri seluruh riwayat pengeditan dan melihat pratinjau setiap titik. Posisi paling kiri penggeser adalah keadaan satu langkah sebelum perubahan pertama yang tercatat, dan penggeser terbuka dengan kenop di keadaan saat ini.  
Pratinjau ini pasif: pratinjau menggambar minimap, tetapi Anda tidak dapat menggeser, menggulir, atau mengeditnya, dan dokumen yang sebenarnya tetap tidak tersentuh hingga Anda menerapkannya.

Tekan `Apply` untuk memulihkan titik yang dipilih, atau `Cancel` atau `Esc` untuk membiarkan dokumen tidak berubah.

![Membuka Perjalanan Waktu, menyeret penggeser mundur menelusuri sesi, dan menerapkan titik sebelumnya](/img/demo-time-travel.webp)
