---
sidebar_position: 14
description: Sinkronisasi tipe data hubungan, lebar komentar maksimum, penghitungan ulang lebar tabel, penguncian pengaturan (area pandang, tab, dan pengaturan kode), urutan tampilan kolom, dan daftar pintasan.
---

# Pengaturan

Buka Pengaturan dengan tombol `Settings` di bilah alat, atau dari [Pencarian Cepat](./quick-search.md) di bagian `Tab`.
Layar Pengaturan memiliki dua tab: `Preferences` dan `Shortcuts`. `Preferences` terbuka lebih dulu, kecuali dari baris `Shortcuts` di [layar sambutan](./editing-start.md#welcome-screen), yang membuka `Shortcuts`.

Tema dan bahasa tampilan tidak ada di layar ini. Tombol `Theme` dan `Display Language` di bilah alat membukanya — lihat [Bahasa dan tema](./language-and-theme.md).

## Sinkronisasi tipe data hubungan {#relationship-datatype-sync}

Menentukan apakah tipe data disinkronkan. Pengaturan ini aktif secara default.
Dengan begitu, mengubah tipe data kolom menerapkan tipe tersebut ke setiap kolom yang terhubung dengannya melalui hubungan, dengan mengikuti rantai dari kedua ujung, sehingga kunci asing tidak pernah menyimpang dari kunci yang dirujuknya.
Dari kunci ke kunci asingnya, tipe serial diteruskan sebagai tipe integer yang disimpannya, seperti saat hubungan digambar — lihat [Hubungan pengidentifikasi](./relationship-editing.md#identifying-relationships). Jadi, mengubah kunci menjadi `serial` memberi kunci asingnya `integer` di PostgreSQL, dan perubahan berlanjut menyusuri rantai dari sana.
Dari kunci asing kembali ke kuncinya, tipe diteruskan sebagaimana tertulis, kecuali bahwa kunci serial mempertahankan tipenya dan perubahan berhenti di sana.
[Petakan Kolom](./relationship-editing.md#map-columns) juga mengikuti pengaturan ini: selama pengaturan aktif, setiap kolom yang sudah ada dan dipetakannya menerima tipe yang diberikan kunci induknya kepada kunci asing, dan perubahan berlanjut di sepanjang hubungan seperti di atas. Selama pengaturan nonaktif, atau saat kunci tidak memiliki tipe data, kolom mempertahankan tipenya sendiri.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Pengaturan sinkronisasi tipe data hubungan" loading="lazy" />

![Mengubah members.id menjadi BIGINT UNSIGNED, yang memperbarui setiap member_id yang terhubung dengannya](/img/demo-relationship-data-type-sync.webp)

## Lebar komentar maksimum {#maximum-comment-width}

Menentukan lebar maksimum kolom komentar dalam piksel (`60` ~ `200`).
Menonaktifkan sakelar menghapus batasnya, dan kotak input dinonaktifkan selama sakelar nonaktif.
Saat sakelar diaktifkan, nilainya dimulai dari `60px`. Nilai yang diketik di luar rentang dibatasi ke ujung terdekat.

![Mengaktifkan Maximum comment width, memasukkan 120, dan tab ERD yang menampilkan komentar terpotong sesuai lebar itu](/img/demo-settings-comment-width.webp)

## Hitung ulang lebar tabel {#recalculation-table-width}

Tekan `Sync` untuk menghitung ulang lebar setiap tabel dan sel kolom agar sesuai dengan teksnya saat ini, serta untuk menggambar ulang konektor hubungan mengikuti ukuran yang baru.
Notifikasi `Recalculated table width` mengonfirmasinya.
Lebar dihitung ulang dengan sendirinya setiap kali dokumen dimuat, sehingga hal ini hanya diperlukan saat perubahan font atau rendering membuat lebar tersebut tidak lagi sesuai.
Lebar tidak disimpan di file, sehingga `Sync` tidak pernah mengubah file.

## Penguncian {#lock}

Daftar `Lock` memuat enam pengaturan. Selama penguncian suatu pengaturan aktif, file mempertahankan nilai yang dimiliki pengaturan itu saat dikunci, sehingga mengubahnya di layar membiarkan file tetap seperti semula.

| Baris | Yang dipertahankan file | Di diagram baru |
| --- | --- | --- |
| `Viewport` | Tingkat zoom dan posisi area pandang kanvas ERD, sebagai satu penguncian | `100% · 0, 0` |
| `Canvas Type` | Tab tempat diagram dibuka: `ERD`, `Visualization`, `Schema SQL`, atau `Code Generator` | `ERD` |
| `Language` | Bahasa [Generator Kode](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | [Konvensi penamaan tabel](./code-generator.md#name-case) Generator Kode | `Pascal` |
| `Column Name Case` | [Konvensi penamaan kolom](./code-generator.md#name-case) Generator Kode | `Camel` |
| `Bracket Type` | `Bracket` di tab [Skema SQL](./schema-sql.md#database-and-bracket) dan di target [Generator Kode](./code-generator.md#bracket) yang menyediakannya | `None` |

Setiap baris menampilkan nilai dan tombol penguncian, dan klik pada tombol itu mengaktifkan atau menonaktifkan penguncian tersebut saja.
Selama penguncian aktif, tombol menampilkan gembok tertutup dengan tooltip `Unlock Viewport` (dan seterusnya untuk setiap baris), dan nilainya, dengan tooltip `Locked value`, adalah nilai yang dipertahankan file.
Selama penguncian nonaktif, tombol menampilkan gembok terbuka dengan tooltip `Lock Viewport`, dan nilainya, yang diredupkan, dengan tooltip `Current value`, adalah pengaturan sebagaimana adanya saat ini.
`Viewport` ditampilkan sebagai zoom lalu posisi area pandang, misalnya `75% · -40, 91`. Posisi area pandang adalah titik di layar, dalam piksel, tempat `0, 0` diagram berada, dan koordinat bernilai seribu atau lebih disingkat, seperti `1.2k` atau `-24k`.

Penguncian mengambil pengaturan sebagaimana adanya pada saat itu.
Selama penguncian aktif, pengaturan tetap berfungsi di layar: Anda dapat menggulir dan memperbesar/memperkecil, berpindah tab, serta memilih bahasa, konvensi penamaan, atau tanda kutip lain dari menu, panel opsi, atau Pencarian Cepat.
Namun, file mempertahankan nilai terkunci, dan baris tetap menampilkannya, sehingga diagram dibuka kembali pada area pandang terkunci, di tab terkunci, dengan bahasa, konvensi penamaan, dan tanda kutip yang terkunci. Ekspor JSON juga menulis nilai terkunci.
Untuk menyimpan apa yang ditampilkan layar, nonaktifkan penguncian, dan file mengikuti pengaturan sejak saat itu: dengan `Viewport` nonaktif, diagram terbuka di tempat Anda meninggalkannya. Untuk mengunci nilai baru sebagai gantinya, misalnya area pandang awal yang baru, nonaktifkan lalu aktifkan kembali penguncian.
Jika area pandang terkunci tidak menampilkan bagian mana pun dari diagram saat file dibuka, layar tetap berpindah ke diagram, dan nilai terkunci tetap apa adanya.
`Canvas Type` tidak pernah mempertahankan tab Pengaturan. Mengaktifkannya mengunci tab lain tempat Anda terakhir berada, dan selama penguncian ini nonaktif, barisnya menyebutkan tab tersebut.

![Membuka kunci Viewport, menggulir dan memperbesar/memperkecil diagram, dan menguncinya kembali pada area pandang baru yang ditampilkan barisnya](/img/demo-settings-locks.webp)

Mengaktifkan atau menonaktifkan penguncian mengubah file, karena file menyimpan penguncian mana yang aktif, tetapi seperti bagian lain tab Pengaturan, hal ini tidak dicatat dalam [riwayat pembatalan](./undo-redo.md#what-the-history-records). Di editor hanya baca, tombol penguncian tidak melakukan apa pun.
Setiap pengaturan lain disimpan sebagaimana adanya: database, sakelar [`View Option`](./table-related-functions.md#table-view-options), dan bagian lain tab `Preferences`.

Setiap penguncian aktif di diagram baru, yaitu diagram yang dimulai dari nol: file kosong yang dibuka di VS Code, Obsidian, atau IDE JetBrains (`ERD Editor: Create new diagram` dan `New ERD` di Obsidian membuatnya), skema baru di aplikasi web, file yang dibuat dari menu New di Google Drive, atau `<erd-editor>` yang tidak diberi nilai.
Skema atau file Google Drive yang dibuat aplikasi web dengan mengimpor file SQL, DBML, AML, atau GraphQL juga dimulai dengan setiap penguncian aktif. Yang dibuat dari file JSON mempertahankan penguncian yang dicatat file tersebut.
File yang Anda buka mempertahankan penguncian yang tersimpan bersamanya, masing-masing pada nilai terkuncinya.
File yang tidak mencatat penguncian, seperti file yang disimpan oleh rilis dari sebelum adanya penguncian atau yang ditulis secara manual, dibuka dengan setiap penguncian aktif: area pandang pada `100% · 0, 0` dan tab pada `ERD`, apa pun area pandang dan tab yang disimpannya, serta bahasa, konvensi penamaan, dan tipe tanda kutipnya terkunci sebagaimana disimpannya.
`Import` yang mengganti diagram juga mengatur penguncian: file JSON membawa penguncian yang dicatatnya beserta nilai yang dipegangnya, dan file SQL, DBML, AML, atau GraphQL mempertahankan penguncian Anda tetapi mengembalikan area pandang ke `100% · 0, 0`, terkunci atau tidak — lihat [Mengimpor file eksternal](./file-import-export.md#importing-external-files). Membatalkan impor mengembalikan penguncian dan nilai terkunci yang digantikannya.

Perubahan yang ditahan penguncian agar tidak masuk ke file tidak dihitung sebagai perubahan. VS Code tidak menandai tab sebagai diubah, dan Obsidian serta IDE JetBrains membiarkan file seperti semula, baik saat keduanya menyimpan dengan sendirinya maupun saat tab ditutup.
Jadi, dengan setiap penguncian aktif, melihat-lihat diagram, berpindah tab, dan mencoba bahasa, konvensi penamaan, atau tanda kutip lain tidak pernah muncul di `git diff`.
Dengan `Viewport` nonaktif, menggulir dan memperbesar/memperkecil mengubah file, dan dengan `Canvas Type` nonaktif, begitu pula berpindah tab, termasuk ke tab Pengaturan.
File kosong dari diagram baru tetap kosong hingga perubahan pertama yang dipertahankan file: pengeditan, perubahan pada pengaturan yang tidak ditahan oleh penguncian mana pun, atau penguncian yang diaktifkan atau dinonaktifkan.
Membuka diagram lalu menutupnya tanpa perubahan seperti itu membiarkan file seperti semula, rilis atau komputer mana pun yang menulisnya. File hanya memuat isi diagram, dalam urutan yang tetap, dan file yang disimpan dalam bentuk lama ditulis ulang ke bentuk ini satu kali, pada perubahan pertamanya yang seperti itu — lihat [Bentuk penyimpanan dan nilai runtime](../../api/advanced/schema.md#storage-form-and-runtime-value).
Di VS Code, revisi yang dibuka kembali sebagai diagram dengan `Reopen Editor With...`, seperti revisi Git atau entri Local History, bersifat hanya baca dan tidak pernah ditandai sebagai diubah.
Di Google Drive, guliran, zoom, atau perpindahan ke tab lain tidak pernah disimpan secara tersendiri, terkunci atau tidak. Dengan `Viewport` nonaktif, area pandang hanya ditulis bersama perubahan lain, sehingga file Drive terbuka di posisi area pandang saat terakhir disimpan, dan hal yang sama berlaku untuk tab dengan `Canvas Type` nonaktif.

Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), mengaktifkan atau menonaktifkan penguncian sampai ke setiap editor, dan penguncian mempertahankan nilai dari editor yang mengaktifkannya.
Menonaktifkan `Language`, konvensi penamaan, atau `Bracket Type` memberi setiap editor nilai yang ditampilkan di editor yang menonaktifkannya, sehingga semuanya menyimpan satu nilai. Menonaktifkan `Viewport` atau `Canvas Type` tidak memindahkan area pandang atau tab siapa pun.
Agen pemrograman yang bekerja melalui server MCP tidak memiliki alat untuk penguncian maupun untuk pengaturan yang ditahannya, dan agen membaca bahasa, konvensi penamaan, atau tipe tanda kutip yang terkunci pada nilai yang dipertahankan file. Hanya impornya dalam mode `replace` yang menjangkaunya, seperti halnya `Import` — lihat [Pengaturan](../../mcp/tools.md#settings) dan [Impor](../../mcp/tools.md#import).

## Mengatur urutan kolom {#adjusting-column-order}

Mengatur urutan tampilan kolom di tabel.
Seret baris untuk memindahkannya — seluruh baris dapat diseret, dan ikon pegangan seret menandainya. Ketujuh baris tersebut, dalam urutan default, adalah `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default`, dan `Comment`.
Sel yang disembunyikan oleh [opsi tampilan tabel](./table-related-functions.md#table-view-options) tetap menempati posisinya di daftar, sehingga urutan berlaku untuk sel mana pun yang ditampilkan.
Tanda [kunci alternatif](./table-related-functions.md#alternate-keys) (`AK1.1` dan seterusnya) bukan salah satu dari baris ini. Tanda ini selalu berada paling akhir dalam baris, setelah sel mana pun yang ditempatkan terakhir oleh urutan ini.

![Menggulir ke bawah ke Column Order dan menyeret baris Comment ke atas di bawah Name, yang menempatkan setiap komentar tepat setelah nama kolomnya](/img/demo-settings-column-order.webp)

## Pintasan {#shortcuts}

Tab `Shortcuts` adalah tabel hanya baca berisi `Command` dan `Keybinding`, yang mencantumkan kombinasi tombol untuk platform yang Anda gunakan.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` lalu `G` | `T` lalu `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Sebagian besar pintasan ini hanya berfungsi di tab ERD, dan ditahan selama Pencarian Cepat, Properti Tabel, Penampil Perbedaan, pratinjau Tata Letak Otomatis, Perjalanan Waktu, dialog [`Export image`](./file-import-export.md#image), atau [`Map Columns`](./relationship-editing.md#map-columns) terbuka.
`Search`, `Toggle Explorer`, dan `Stop` adalah pengecualiannya: `Search` membuka atau menutup Pencarian Cepat dari tab mana pun, `Toggle Explorer` membuka [Penjelajah](./explorer.md#opening-and-closing) pada pencariannya dari tab mana pun dan menampilkan tab ERD, dan `Stop` adalah pintasan yang menutup Pencarian Cepat, Properti Tabel, Penampil Perbedaan, pratinjau Tata Letak Otomatis, Perjalanan Waktu, dialog `Export image`, `Map Columns`, pembuat tema, pemilih `Display Language`, pemilih warna, dan menu konteks yang terbuka.
`Toggle Explorer` menutup kembali Penjelajah selama Penjelajah terbuka di tab ERD dan tidak disembunyikan oleh mode Zen, seperti yang dilakukan tombol `Explorer` di bilah alat. Saat Pencarian Cepat, Properti Tabel, pembuat tema, pemilih `Display Language`, dialog `Export image`, atau `Map Columns` terbuka, pintasan ini menutupnya sebagai gantinya dan memindahkan fokus keyboard ke pencarian Penjelajah.
`Toggle Explorer` tidak melakukan apa pun selama sel, memo, atau nama grup tabel sedang diedit. Selama Penampil Perbedaan, pratinjau Tata Letak Otomatis, atau Perjalanan Waktu terbuka, pintasan ini menyerahkan tombolnya ke browser atau host — lihat [Bilah pencarian browser](./find-and-replace.md#the-browsers-find-bar).
Di tab ERD, `Stop` mengakhiri editor sel atau memo yang terbuka, menutup editor nama [grup tabel](./table-groups.md) tanpa mengganti nama grup, atau membatalkan hubungan atau `New Table Group` yang sedang digambar, dan membiarkan pilihan apa adanya. Jika tidak ada satu pun dari hal tersebut yang terbuka, pintasan ini mengosongkan pilihan dan sel yang difokuskan serta, dalam penekanan yang sama, menutup pemilih warna yang terbuka. Pembuat tema atau pemilih `Display Language` yang terbuka, bagaimanapun keadaannya, tertutup dalam penekanan yang sama.
Penjelajah, pembuat tema, atau pemilih `Display Language` yang terbuka tidak menahan satu pun pintasan di kanvas. `Stop` tidak pernah menutup Penjelajah. Untuk apa yang dilakukan `Stop` dan tombol lain di dalam Penjelajah, lihat [Tombol di Penjelajah](./explorer.md#keys-in-the-explorer), dan di dalam pemilih, lihat [Memilih bahasa](./language-and-theme.md#picking-a-language).
`Delete Selection` menghapus setiap tabel, memo, dan grup tabel yang dipilih, atau, saat satu tabel dipilih bersama beberapa kolomnya dan zoom di atas `70%`, kolom-kolom tersebut — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` juga menghapus grup tabel yang dipilih.
`Add Table Group` mulai menggambar [`New Table Group`](./table-groups.md#drawing-a-group), seperti yang dilakukan tombol `New Table Group` di [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), dan penekanan kedua membatalkan penggambaran. `Group Selected Tables` terdiri atas dua penekanan tanpa tombol pengubah, `T` lalu `G` dalam satu detik. Pintasan ini memasukkan tabel yang dipilih ke grup baru dan membuka editor namanya, seperti yang dilakukan `Group selected tables` di menu konteks tabel, dan tidak melakukan apa pun saat tidak ada tabel yang dipilih — lihat [Mengelompokkan tabel yang dipilih](./table-groups.md#grouping-selected-tables). Keduanya tidak melakukan apa pun di editor hanya baca atau selama grup [disembunyikan](./table-groups.md#hiding-groups).
`Zoom In`, `Zoom Out`, dan `Zoom Reset` juga mengubah zoom tab [Visualisasi](./visualization.md#toolbar), baik di `Graph` maupun `Flow`, kecuali jika Pencarian Cepat terbuka.
Di tab Visualisasi, `Stop` juga menutup menu [tampilan baris](./visualization.md#row-display) dan membatalkan [tata letak Alur](./visualization.md#how-flow-is-placed) yang masih berjalan; pintasan ini tidak memperluas area pandang yang dipersempit dengan `Focus on this table`.
`Focus on this table` membuka tab Visualisasi dalam `Flow`, dipersempit ke tabel yang dipilih dan setiap tabel yang berjarak satu hubungan darinya, dan tidak melakukan apa pun saat tidak ada tabel yang dipilih — lihat [Memfokuskan tabel](./visualization.md#focusing-on-tables).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection`, dan `Group Selected Tables` mengalah pada kursor teks: selama Anda mengedit sel atau memo atau mengetik di kotak teks seperti kotak Temukan di Penjelajah, `Ctrl + A` (Windows/Linux) atau `⌘ + A` (Mac) memilih teks, `Space` mengetik spasi, `Delete` dan `Backspace` menghapus teks, dan `T` lalu `G` mengetik kedua huruf tersebut.
Menyalin dan menempel menggunakan `Ctrl + C` dan `Ctrl + V` (Windows/Linux) atau `⌘ + C` dan `⌘ + V` (Mac) milik browser sendiri, sehingga keduanya tidak ada dalam daftar ini — lihat [Pengeditan tabel](./table-editing.md).

Kombinasi tombol tidak dapat diubah dari tab ini.
Host yang menyematkan editor memetakan ulang kombinasi tersebut dengan [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), kecuali `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, dan `Zoom Reset`, yang bersifat tetap.
Tab `Shortcuts` kemudian mencantumkan kombinasi tombol dari host: perintah yang tidak dipetakan ulang oleh host mempertahankan kombinasi default, dan perintah yang tidak diikat host ke tombol mana pun tidak menampilkan kombinasi apa pun.

Di Obsidian, tombol-tombol ini sampai ke editor setiap kali tab Obsidian milik diagram aktif, bahkan saat hotkey Obsidian menggunakan tombol yang sama, seperti `Alt + Enter`, `Ctrl + K`, dan `Ctrl + F` (Windows/Linux) atau `⌥ + Enter`, `⌘ + K`, dan `⌘ + F` (Mac). Setiap hotkey Obsidian lainnya tetap berfungsi di sana. Untuk `Ctrl + F` atau `⌘ + F`, lihat [Bilah pencarian browser](./find-and-replace.md#the-browsers-find-bar).
