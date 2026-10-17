---
sidebar_position: 8
description: Menelusuri tabel diagram beserta kolom, indeks, dan kunci asingnya, grup tabelnya, dan memonya dalam pohon yang tertambat di samping kanvas ERD, serta menuju salah satunya dengan satu klik.
---

# Penjelajah

Penjelajah adalah panel yang tertambat di tepi kiri kanvas ERD dan mencantumkan diagram sebagai pohon: tabel, masing-masing dengan kolom, indeks, dan kunci asingnya, lalu [grup tabel](./table-groups.md), lalu memo. Klik baris untuk menuju apa yang diwakilinya di kanvas.  
Penjelajah mempersempit kanvas alih-alih menutupinya. Penjelajah merupakan bagian dari editor diagram, bukan tampilan Explorer di VS Code atau penjelajah file di Obsidian.

![Membuka Penjelajah dari bilah alat, menuju products, lalu ke kolom status dan kunci asing member_id milik orders, menciutkan dengan Collapse All, melebarkan panel, dan menutupnya](/img/demo-explorer.webp)

[Temukan dan Ganti](./find-and-replace.md) berada di bagian atasnya, di antara bilah judul dan pohon. Selama kotak Temukan berisi teks, pohon hanya menampilkan apa yang cocok — lihat [Hasil](./find-and-replace.md#the-results).  
Pohon itu sendiri tidak pernah mengubah diagram: pohon tidak memiliki fungsi ganti nama, seret, hapus, maupun tampilkan dan sembunyikan. Penggantian adalah satu-satunya perubahan yang dibuat panel ini.

Keadaan Penjelajah itu sendiri hanya milik Anda: apakah Penjelajah terbuka, lebarnya, penciutannya, baris tempat keyboard berada, posisi gulirannya, dan pencariannya.  
Tidak ada satu pun dari keadaan ini yang disimpan di file, dicatat di riwayat pembatalan, dibagikan kepada kolaborator, atau disimpan di browser. Semuanya bertahan selama editor tetap terbuka, baik saat berpindah tab maupun saat dokumen lain dimuat ke editor yang sama. Editor yang baru dibuka dimulai dengan Penjelajah tertutup.

## Membuka dan menutup {#opening-and-closing}

Buka Penjelajah dengan salah satu cara berikut:

- Tombol `Explorer` di bilah alat, tepat setelah `Search`, dengan ikon pohon. Tooltipnya bertuliskan `Explorer (Ctrl + F)` (Windows/Linux) atau `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac), yang bernama `Toggle Explorer` di tab [Pintasan](./settings.md#shortcuts) di Pengaturan.
- `Toggle Explorer` di [Pencarian Cepat](./quick-search.md), yang tercantum di setiap tab. Mengetik `find`, `replace`, `rename`, `tree`, `outline`, atau `objects` memunculkannya.
- `Toggle Explorer` di menu konteks kanvas: klik kanan tempat kosong di kanvas ERD, di luar [grup tabel](./table-groups.md) mana pun. Item ini berada setelah `New Table`, `New Memo`, dan `New Table Group`, sebelum `Relationship`.

Kedua item `Toggle Explorer` menampilkan pintasan di sebelah kanan.  
Tombol bilah alat, pintasan, dan item Pencarian Cepat berfungsi dari setiap tab. Dari tab Visualisasi, Skema SQL, Generator Kode, atau Pengaturan, ketiganya beralih ke tab ERD lebih dahulu, karena Penjelajah hanya tampil di sana.

Tombol bilah alat hanya membuka dan menutup panel. Tombol ini tidak menempatkan kursor teks di kotak Temukan, dan membiarkan Properti Tabel, pembuat tema, dan pemilih `Display Language` tetap terbuka.  
Pintasan dan kedua item `Toggle Explorer` membuka Penjelajah pada pencariannya: kursor teks berpindah ke kotak Temukan dengan teksnya terpilih, dan dialog mana pun dari lima dialog di [Dialog di sampingnya](#dialogs-beside-it) tertutup. Apa yang dipertahankan pencarian di antara pembukaan dijelaskan di [Membuka dan menutup](./find-and-replace.md#opening-and-closing) di Temukan dan Ganti.  
Pintasan tidak melakukan apa pun selama sel tabel, memo, atau nama grup tabel sedang diedit.

Tombol bilah alat tampak tertekan selama Penjelajah terbuka di tab ERD dan tidak disembunyikan oleh [mode Zen](#when-it-stands-aside). Selama tombol tampak demikian, tombol tersebut, pintasan, dan item `Toggle Explorer` mana pun menutup Penjelajah, dan fokus keyboard yang berada di panel kembali ke editor.  
Pintasan tidak pernah menutupnya selama Pencarian Cepat atau salah satu dari lima dialog tersebut terbuka. Sebagai gantinya, pintasan menutup palet atau dialog tersebut dan memindahkan fokus keyboard ke kotak Temukan, dengan teksnya terpilih dan, jika Penjelajah sudah tampil, kecocokan saat ini dipertahankan. Item `Toggle Explorer` di Pencarian Cepat tidak membuat pengecualian semacam itu: menjalankannya menutup palet lalu Penjelajah yang terbuka.

Tombol `x` di bilah judul, yang tooltipnya bertuliskan `Close`, juga menutup Penjelajah dan memberikan fokus keyboard ke kanvas. `Escape` tidak menutupnya — lihat [Tombol di Penjelajah](#keys-in-the-explorer).  
Saat dibuka lagi, Penjelajah kembali dengan lebar yang sama, dengan pohon yang diciutkan dan digulir seperti sebelumnya, serta kueri yang sama. Jika dibuka dengan pintasan atau item `Toggle Explorer`, Penjelajah mencari kueri itu lagi dengan setiap hasil dibentangkan — lihat [Hasil](./find-and-replace.md#the-results).

Saat pintasan atau item `Toggle Explorer` membuka Penjelajah di editor yang terlalu sempit untuknya, muncul notifikasi bertuliskan `Widen the window to show the Explorer`, dan fokus keyboard tetap di tempatnya — lihat [Di samping kanvas](#beside-the-canvas).  
Penjelajah tetap terbuka, dengan tombol bilah alat tertekan, dan muncul, dengan pencarian yang sudah dijalankan, begitu editor cukup lebar, tanpa mengambil fokus keyboard. Membukanya dengan tombol bilah alat tidak menampilkan notifikasi.

## Di samping kanvas {#beside-the-canvas}

Penjelajah membentang di tepi kiri tab ERD, di bawah bilah alat, sepanjang seluruh tinggi kanvas.  
Kanvas menyempit untuk memberinya ruang, sehingga tidak ada bagian diagram yang berada di bawah panel, dan [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), minimap, serta [layar sambutan](./editing-start.md#welcome-screen) semuanya berada di kanvas di sampingnya.  
Membuka, menutup, atau mengubah ukuran Penjelajah tidak menggulir diagram dan tidak mencatat apa pun di [riwayat pembatalan](./undo-redo.md#what-the-history-records).

Di editor yang baru dibuka, lebarnya mula-mula `260px`. Seret tepi kanannya untuk mengatur lebarnya ke nilai berapa pun dari `200px` hingga `480px`, atau klik dua kali tepi tersebut untuk kembali ke `260px`.

Kanvas selalu menyisakan setidaknya `320px` di samping Penjelajah:

- Di editor yang lebih sempit daripada lebar Penjelajah ditambah `320px`, Penjelajah digambar lebih sempit agar muat, hingga `200px`.
- Di editor yang lebih sempit daripada `520px`, Penjelajah menyingkir. Penjelajah tidak digambar, tetapi tetap terbuka, sehingga tombol bilah alat masih tampak tertekan dan menekannya menutup Penjelajah. Begitu editor cukup lebar, Penjelajah kembali dengan lebarnya sendiri.

Yang diperhitungkan adalah lebar editor itu sendiri, bukan lebar jendela browser, meskipun notifikasi di [Membuka dan menutup](#opening-and-closing) menyebut jendela.

Dalam [bahasa tampilan kanan ke kiri](./language-and-theme.md#right-to-left-languages), Penjelajah tetap berada di sebelah kiri kanvas, karena kanvas tidak pernah dicerminkan.  
Isinya dibaca dari kanan ke kiri: bilah judul, pencarian, dan baris dicerminkan, dan baris menjorok dari kanan. Tepi yang diseret tetap berada di sisi kanannya, berbatasan dengan kanvas. Tipe data, kolom indeks, dan teks kunci asing mempertahankan urutan kiri ke kanannya.

## Saat Penjelajah menyingkir {#when-it-stands-aside}

Penjelajah hanya tampil di tab ERD.  
Beralih ke tab lain menyembunyikannya, dan tombol bilah alat tidak lagi tampak tertekan. Saat kembali ke tab ERD, Penjelajah tampil lagi seperti saat Anda meninggalkannya, dengan penciutan dan guliran yang sama.

Selama [Penampil Perbedaan](./table-related-functions.md#diff-viewer), [Perjalanan Waktu](./undo-redo.md#time-travel), atau pratinjau [Tata Letak Otomatis](./table-related-functions.md#auto-layout) terbuka, tidak ada yang dapat membuka atau menutup Penjelajah:

- Penjelajah yang terbuka disembunyikan, dan tampil lagi setelah semuanya ditutup.
- Tombol bilah alat diredupkan dan tidak melakukan apa pun.
- Pencarian Cepat tidak mencantumkan `Toggle Explorer`.
- Pintasan diserahkan kepada browser atau host — lihat [Bilah pencarian browser](./find-and-replace.md#the-browsers-find-bar).

Penampil Perbedaan mencantumkan perubahannya dalam pohon sejenis — lihat [Penampil Perbedaan](./table-related-functions.md#diff-viewer).

Mengaktifkan [mode Zen](./table-related-functions.md#canvas-toolbar) dengan `Alt + Z` (Windows/Linux) atau `⌥ + Z` (Mac) menyembunyikan Penjelajah yang terbuka tanpa menutupnya, dan menonaktifkan mode Zen memunculkan kembali Penjelajah.  
Dalam mode Zen, pintasan dan kedua item `Toggle Explorer` tetap membuka Penjelajah pada pencariannya, dan mode Zen tetap aktif. Penjelajah kemudian membentang sepanjang seluruh tinggi editor, karena bilah alat atas tidak ada, dan tetap tampil saat mode Zen dinonaktifkan. Mengaktifkan mode Zen lagi menyembunyikannya kembali.

Setiap kali panel hilang selama keyboard berada di dalamnya, baik karena ditutup, disembunyikan, maupun menyingkir, fokus keyboard kembali ke editor.

## Pohon {#the-tree}

Bilah judul bertuliskan `Explorer` dan memuat dua tombol: `Collapse All`, dan `x` yang menutup Penjelajah. Di bawahnya terdapat pencarian — lihat [Temukan dan Ganti](./find-and-replace.md) — dan di bawahnya lagi pohon.

Tingkat teratas memuat tiga folder, dalam urutan ini: `Tables`, `Table Groups`, dan `Memos`. Di bawah setiap tabel terdapat folder `Columns`, `Indexes`, dan `Foreign Keys` milik tabel itu sendiri.  
Folder yang tidak berisi apa pun tidak ditampilkan, sehingga diagram kosong tidak menampilkan baris sama sekali. `Table Groups` juga tidak dicantumkan selama [View Option](./table-related-functions.md#table-view-options) → `Table Groups` menyembunyikan grup, begitu pula `Memos` selama View Option → `Memos` menyembunyikan memo.  
Baris folder menampilkan ikon folder, namanya, dan, di ujung terjauh, jumlah baris yang berada langsung di bawahnya, sehingga angka di samping `Tables` adalah jumlah tabel di diagram.

Tabel dicantumkan menurut nama, tanpa membedakan huruf besar dan kecil, dan tabel dengan nama yang sama mempertahankan urutan dokumen. Grup tabel dicantumkan dengan cara yang sama, begitu pula tabel di bawah setiap grup. Kolom tabel mempertahankan urutan tabel itu sendiri, sedangkan indeks dan kunci asingnya, serta memo, mempertahankan urutan dokumen.  
Pohon mengikuti diagram saat diagram berubah, baik karena perubahan di kanvas, pembatalan atau pengulangan, impor, maupun kolaborator atau agen pemrograman, sehingga mengganti nama tabel memindahkan barisnya.

Setiap jenis baris menampilkan:

- Tabel: ikon tabel dan namanya.
- Kolom: ikon kunci untuk kolom kunci utama atau kunci asing, dengan warna yang sama seperti sel kunci tabel itu sendiri mewarnai kunci utama, kunci asing, atau keduanya, dan ikon daftar untuk kolom lainnya. Lalu namanya dan, dengan warna redup, tipe datanya diikuti `PK`, `FK`, atau keduanya, misalnya `id` `BIGINT PK` atau `user_id` `BIGINT FK`.
- Indeks: ikon indeks dan namanya. Lalu, dengan warna redup, `UNIQUE` untuk indeks unik serta kolomnya dalam tanda kurung sesuai urutan indeks, dengan `DESC` setelah kolom yang berurutan turun, misalnya `orders_user_idx` `UNIQUE (user_id DESC, total)`, atau hanya `(total)`.
- Kunci asing: hanya dicantumkan di bawah tabel anak, yaitu tabel yang memuat kolom kunci asing, dan hanya selama tabel induk ada di diagram. Ikon kuncinya mengambil warna konektor: warna kunci utama dan kunci asing untuk [hubungan pengidentifikasi](./relationship-editing.md#identifying-relationships), dan warna kunci asing untuk hubungan lainnya. Baris ini menampilkan kolom kunci tabel anak, dipisahkan koma, lalu, dengan warna redup, `→` beserta tabel induk dan kolomnya, misalnya `user_id` `→ users(id)`.
- Grup tabel: titik berwarna grup, abu-abu untuk grup tanpa warna, dan namanya. Tabel-tabelnya dicantumkan di bawahnya menurut nama, dan masing-masing menuju tabelnya. Grup tanpa tabel tidak memiliki apa pun untuk dibentangkan.
- Memo: ikon catatan tempel dan baris pertama memo.

Nama kosong, atau memo yang baris pertamanya kosong, bertuliskan `unnamed` dalam huruf miring.  
Pada panel yang sempit, teks redup dipotong dengan `…` sebelum namanya dipotong. Arahkan penunjuk ke nama atau teks redupnya untuk melihatnya secara lengkap.

Awalnya hanya `Tables` yang dibentangkan. Klik baris folder, atau tekan `Enter` atau `Space` pada baris tersebut, untuk menciutkan atau membentangkannya.  
Panah di awal baris menciutkan atau membentangkan baris tersebut tanpa menuju ke mana pun. Setiap baris tabel memilikinya, bahkan tabel yang tidak memiliki apa pun di bawahnya. `→` dan `←` juga menciutkan dan membentangkan — lihat [Tombol di Penjelajah](#keys-in-the-explorer).  
`Collapse All` menciutkan satu tingkat setiap kali ditekan: tingkat terdalam dari baris terbentang yang sedang tampil, sehingga penekanan menciutkan dari bawah ke atas. Penekanan yang mencapai tingkat teratas menciutkan setiap baris, termasuk baris di bawah baris yang sudah diciutkan, sehingga hanya folder tingkat teratas yang tersisa.  
Pengeditan, pembatalan dan pengulangan, serta perubahan dari kolaborator atau agen pemrograman membiarkan penciutan apa adanya.

## Menuju baris {#going-to-a-row}

Klik baris, atau tekan `Enter` atau `Space` saat keyboard berada di baris tersebut, untuk menuju apa yang diwakilinya di kanvas ERD. Baris folder hanya menciutkan atau membentangkan, dan tombol panah hanya bergerak di dalam pohon.

- Baris tabel, atau tabel yang dicantumkan di bawah grup, hanya memilih tabel tersebut dan membawanya ke depan. Sel yang difokuskan berpindah ke nama tabel, kecuali jika sel tersebut sudah berada di tabel itu.
- Baris kolom hanya memilih tabelnya dan menempatkan sel yang difokuskan pada nama kolom.
- Baris indeks memilih tabelnya, seperti baris tabel. Indeks itu sendiri tidak ditandai secara khusus; indeks diedit di [Properti Tabel](./table-related-functions.md#indexes).
- Baris kunci asing menampilkan kedua tabel hubungan di layar bersama-sama, atau tabel anak jika keduanya terlalu berjauhan untuk ditampilkan bersama. Baris ini hanya memilih tabel anak beserta kolom kunci asingnya, dengan sel yang difokuskan pada kolom pertamanya, dan menyorot konektor hubungan — lihat [Membaca konektor](./relationship-editing.md#reading-a-connector).
- Baris grup tabel menampilkan kotak grup di layar dengan berpatokan pada bilah judulnya, hanya memilih grup tersebut, dan membawanya ke depan bersama tabelnya.
- Baris memo hanya memilih memo tersebut dan membawanya ke depan.

Area pandang bergerak menurut aturan yang sama untuk setiap perpindahan: zoom tidak pernah berubah, dan kanvas hanya menggulir jika apa yang dituju belum tampil dengan baik — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands).  
Menuju baris menutup Properti Tabel lebih dahulu jika sedang terbuka, dan tidak pernah memulai atau menyelesaikan hubungan yang sedang digambar.  
Selama kotak Temukan berisi teks, baris yang namanya sendiri memuat kecocokan, atau baris yang menampilkan kutipan komentar atau memo, menuju kecocokan tersebut sebagai gantinya — lihat [Menuju kecocokan](./find-and-replace.md#going-to-a-match).

Setelah klik, keyboard tetap berada di pohon, sehingga `Delete`, `Backspace`, dan tombol pengeditan lainnya tidak sampai ke pilihan baru hingga Anda menekan `Escape` atau mengeklik kanvas — lihat [Tombol di Penjelajah](#keys-in-the-explorer).

## Tombol di Penjelajah {#keys-in-the-explorer}

Pohon merupakan satu perhentian `Tab`, yang dilewati selama pohon tidak memiliki baris.  
Berpindah ke pohon dengan Tab menempatkan fokus keyboard di baris tempat keyboard terakhir berada, atau jika tidak ada, di baris kecocokan saat ini, atau di baris pertama yang terlihat seluruhnya, lalu menggulir baris tersebut agar terlihat. Baris tempat keyboard berada digambar seperti baris yang berada di bawah penunjuk.

Di pohon:

- `↑` dan `↓` berpindah satu baris, berhenti di baris pertama dan terakhir alih-alih berputar kembali. `Home` dan `End` menuju baris pertama dan terakhir.
- `→` membentangkan baris yang diciutkan, atau masuk ke anak pertama dari baris yang dibentangkan. `←` menciutkan baris yang dibentangkan, atau keluar ke induknya. Dalam bahasa tampilan kanan ke kiri, keduanya bertukar.
- `Enter` dan `Space` bertindak seperti klik: keduanya menuju baris, atau menciutkan atau membentangkan folder — lihat [Menuju baris](#going-to-a-row).
- Mengetik huruf tidak melompat ke baris.

`Escape` yang ditekan di mana pun di Penjelajah, di pohon, di kotak Temukan atau Ganti, atau pada salah satu tombolnya, mengembalikan fokus keyboard ke kanvas. Penjelajah tetap terbuka dan pilihan tetap apa adanya.  
`Escape` yang mengakhiri penyusunan teks oleh metode input hanya mengakhiri penyusunan tersebut. `Escape` tidak pernah menutup Penjelajah, baik ditekan di dalamnya maupun di kanvas.

Beberapa pintasan editor tetap berfungsi selama keyboard berada di Penjelajah — lihat [Pintasan](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac) berfungsi seperti di kanvas: pintasan ini menutup Penjelajah, atau, selama Properti Tabel terbuka di sampingnya, menutup Properti Tabel dan menempatkan kursor teks di kotak Temukan — lihat [Membuka dan menutup](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac) menampilkan atau menyembunyikan Pencarian Cepat.
- `Undo` dan `Redo` membatalkan dan mengulangi perubahan diagram, bukan teks di kotak.
- `Zoom In`, `Zoom Out`, dan `Zoom Reset` mengubah zoom kanvas.

Setiap pintasan editor lainnya tertahan di Penjelajah, begitu pula tombol panah, `Tab`, `Enter`, `Space`, `Home`, `End`, dan tombol apa pun yang ditekan selama metode input sedang menyusun teks.  
Tidak satu pun dari tombol tersebut sampai ke kanvas: `Delete` dan `Backspace` tidak pernah menghapus pilihan, `Alt + N` (Windows/Linux) atau `⌥ + N` (Mac) tidak menambahkan tabel, dan `T` lalu `G` tidak mengelompokkan apa pun. Di kotak teks, tombol-tombol ini bertindak sebagai tombol teks biasa: `Ctrl + A` (Windows/Linux) atau `⌘ + A` (Mac) memilih teks di kotak, `Delete` dan `Backspace` menghapus teks, dan `Space` mengetikkan spasi. `Tab` berpindah di antara tombol, kotak, dan pohon Penjelajah.  
Tombol di kotak Temukan dan kotak Ganti itu sendiri dibahas di [Tombol di kotak pencarian](./find-and-replace.md#keys-in-the-search-fields).  
Tombol yang tidak diikat oleh editor, seperti penyimpanan atau palet perintah milik host sendiri, sampai ke host seperti biasa.

## Dialog di sampingnya {#dialogs-beside-it}

[Properti Tabel](./table-related-functions.md#table-properties), [pembuat tema](./language-and-theme.md#theme), pemilih [`Display Language`](./language-and-theme.md#picking-a-language), dialog [`Export image`](./file-import-export.md#image), dan [Petakan Kolom](./relationship-editing.md#map-columns) membiarkan Penjelajah tetap terbuka saat kelimanya dibuka.

- Properti Tabel terbuka di tengah kanvas di samping Penjelajah dan hanya meredupkan kanvas. Penjelajah tetap dapat digunakan: memilih baris menutup Properti Tabel, lalu menuju baris tersebut.
- `Export image` dan Petakan Kolom meredupkan seluruh editor, termasuk bilah alat dan Penjelajah. Penjelajah tetap terbuka di bawah area yang diredupkan, dan klik di sana menutup dialog, seperti klik di mana pun pada area yang diredupkan; Petakan Kolom kemudian tertutup tanpa memetakan apa pun.
- Dalam bahasa tampilan kiri ke kanan, pembuat tema dan pemilih `Display Language` terbuka tepat di sebelah Penjelajah alih-alih di atasnya, dan ikut bergeser jika Penjelajah dibuka atau ditutup selama keduanya tampil. Dalam bahasa kanan ke kiri, keduanya tetap di tempatnya di sebelah kanan. Penekanan di Penjelajah menutup keduanya, seperti halnya penekanan apa pun di luar keduanya, kecuali penekanan di bilah alat.

Membuka pencarian dengan pintasan atau item `Toggle Explorer` menutup kelimanya, Petakan Kolom tanpa memetakan apa pun.  
[Pencarian Cepat](./quick-search.md) juga membiarkan Penjelajah tetap terbuka, dan `Escape` kemudian hanya menutup palet.

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), Penjelajah berfungsi seperti di editor lainnya: tombol bilah alat dengan tooltip yang sama, pintasan, kedua item `Toggle Explorer`, pohon, penciutan, `Collapse All`, dan menuju baris, yang memilih apa yang dituju seperti biasa. Judulnya juga bertuliskan `Explorer` di sana.  
Pencariannya hanya menemukan — lihat [Editor hanya baca](./find-and-replace.md#read-only-editors) di Temukan dan Ganti.
