---
sidebar_position: 6
description: Mengumpulkan tabel dan memo yang berkaitan dalam kotak bernama dan berwarna di belakangnya; membuat, memberi nama, memberi warna, memindahkan, mengubah ukuran, dan menghapus grup, menuju grup dari Penjelajah, mengubah tabel dan memo yang dimuatnya, menyembunyikannya, dan mempertahankannya melalui Tata Letak Otomatis, Skema SQL, dan DBML.
---

# Grup tabel

Grup tabel adalah kotak bernama dan berwarna yang digambar di belakang tabel dan memo yang berkaitan di kanvas ERD, untuk menunjukkan mana saja yang termasuk satu kelompok.  
Setiap tabel atau memo paling banyak berada di satu grup. Grup disimpan bersama diagram, beserta grup tempat setiap tabel dan memo berada.

Kotak ini memiliki bilah judul di sepanjang bagian atasnya, yang memuat ikon grup, nama grup dalam huruf tebal, dan, selama penunjuk berada di atas grup, sebuah `x` yang menghapusnya — lihat [Menghapus grup](#removing-a-group). Grup tanpa nama bertuliskan `unnamed`, dan nama yang terlalu panjang untuk bilah tersebut dipotong dengan `…`.  
Kotak selalu memuat tabel dan memonya: kotak mempertahankan ukuran yang diberikan kepadanya, tetapi meregang agar setiap tabel dan memo tetap berada di dalamnya dengan ruang `24px` di sekelilingnya dan bilah judul di atasnya. Tabel atau memo yang membesar ikut meregangkan kotak, begitu pula yang dilepaskan di dekat tepi dengan titik tengahnya masih di dalam kotak. Selama tabel atau memo sedang diseret, kotak tidak membesar maupun mengecil. Peregangan ini tidak disimpan: kotak kembali ke ukurannya sendiri begitu tidak ada tabel atau memo yang membutuhkan ruang tersebut.

Memo yang disembunyikan dengan [View Option](./table-related-functions.md#table-view-options) → `Memos` tetap berada di grupnya: memindahkan grup ikut membawanya, menghapus grup mengeluarkannya dari grup itu, dan membatalkan salah satunya mengembalikannya.  
Hanya memo yang ditampilkan yang meregangkan kotak dan menghentikan tepi saat ukuran grup diubah, dan hanya memo itu yang dimasukkan oleh grup yang digambar, dipilih oleh `Select tables`, dan dicantumkan di bawah grup di Penjelajah.

Grup digambar di belakang semua hal lain di kanvas: tabel, memo, dan garis hubungan.  
Saat grup saling tumpang tindih, grup yang terakhir ditekan atau ditambahkan digambar di depan, dan badan grup mana pun tidak pernah menutupi bilah judul grup lain. Urutan ini tidak disimpan, sehingga diagram yang dibuka kembali menumpuk grupnya sesuai urutan penambahannya.  
Grup ditampilkan di kanvas ERD, di minimap, dan di gambar yang diekspor, dan [Penjelajah](./explorer.md) mencantumkannya — lihat [Menuju grup](#going-to-a-group). Tab [Visualisasi](./visualization.md) tidak menggambar grup maupun warna grup di kedua mode.

Agen pemrograman juga dapat membuat dan mengubah grup, serta membaca DDL dari grup yang dipilih — lihat [Grup tabel](../../mcp/tools.md#table-groups) di alat MCP.

![Menyiapkan penggambaran grup dengan ⌥ + G, menggambarnya di atas orders dan payments, menamainya Billing, melepaskan order_items ke dalamnya, lalu memindahkan dan mengubah ukuran grup](/img/demo-table-group.webp)

## Membuat grup {#creating-a-group}

Ada dua cara untuk membuat grup, masing-masing dengan pintasan. Keduanya tidak tersedia di editor hanya baca atau selama grup [disembunyikan](#hiding-groups), dan pintasannya saat itu tidak melakukan apa pun.  
Seperti pintasan kanvas lainnya, keduanya hanya berfungsi di tab ERD dan ditahan selama sel, memo, atau nama grup sedang diedit — lihat [Pintasan](./settings.md#shortcuts).

### Menggambar grup {#drawing-a-group}

Klik tombol `New Table Group` di [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), tekan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac), atau pilih `New Table Group` dari menu konteks kanvas, tempat item ini berada setelah `New Table` dan `New Memo`, atau dari [Pencarian Cepat](./quick-search.md) di tab ERD. Lalu seret sebuah kotak di atas kanvas.  
Tombol dan pintasan tersebut mengaktifkan atau menonaktifkan penggambaran, sehingga menekan salah satunya selama penggambaran siap mengakhirinya, bagaimanapun penggambaran itu dimulai; item menu konteks dan Pencarian Cepat hanya memulainya. Memulai penggambaran menonaktifkan alat tangan dan membatalkan hubungan yang sedang digambar.  
Selama penggambaran siap, kursor berbentuk garis bidik, dan penekanan memulai kotak di mana pun penekanan itu terjadi, bahkan di atas tabel, alih-alih memilih atau memindahkan apa yang ada di bawahnya. Bilah alat kanvas kemudian menandai tombol `New Table Group`, bukan tangan maupun alat penunjuk.

Melepaskan tombol mouse menambahkan grup di kotak tersebut, yang tidak pernah lebih kecil dari lebar `160px` dan tinggi `100px`, termasuk bilah judul, sependek apa pun seretannya. Klik tanpa menyeret menambahkan grup selebar `480px` dan setinggi `320px` dengan sudut kiri atasnya di titik klik.  
Setiap tabel dan memo yang ditampilkan, yang tidak berada di grup mana pun dan titik tengahnya terletak di dalam kotak baru, bergabung ke grup tersebut. Tabel atau memo yang sudah berada di grup lain tetap di sana.

Tombol tengah mouse tetap menggeser kanvas dan membiarkan penggambaran tetap siap. Hal-hal berikut mengakhiri penggambaran tanpa menambahkan grup:

- `Escape`, atau `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac), sebelum penekanan atau selama seretan. Sebelum penekanan, keduanya membiarkan pilihan apa adanya; penekanan yang memulai kotak sudah mengosongkannya.
- Klik kanan, yang mengosongkan pilihan. Tidak ada menu konteks yang terbuka.
- Beralih ke alat tangan dengan `Space` atau bilah alat kanvas, mengeklik alat penunjuk atau tombol `New Table Group` di bilah alat, atau memulai hubungan.
- Beralih ke tab lain, menyembunyikan grup, atau editor menjadi hanya baca.

### Mengelompokkan tabel yang dipilih {#grouping-selected-tables}

Pilih satu atau beberapa tabel, beserta memo yang menyertainya jika ada, dan tekan `T` lalu `G`, atau pilih `Group selected tables` dari menu konteks tabel atau memo, atau `Group Selected Tables` dari Pencarian Cepat. Menu memo dan Pencarian Cepat menawarkannya hanya selama ada tabel yang dipilih.  
Grup baru digambar mengelilingi tabel dan memo yang dipilih dengan ruang `24px` di setiap sisi dan bilah judul di atasnya. Setiap tabel dan memo yang dipilih bergabung ke grup ini dan meninggalkan grup mana pun tempatnya berada sebelumnya, dan grup yang ditinggalkannya tetap ada, bahkan jika kini kosong.

`T` lalu `G` adalah dua kali penekanan tanpa tombol pengubah, dengan `G` dalam satu detik setelah `T`. Tanpa tabel yang dipilih, pintasan ini tidak melakukan apa pun, dan di kotak teks, seperti kotak Temukan di Penjelajah, pintasan ini mengetikkan kedua huruf tersebut.

![Mengelompokkan categories dan products dengan T lalu G, menamai grup Catalog, lalu memberinya warna violet dari menunya sehingga kedua header memakai warna tersebut](/img/demo-table-group-selected.webp)

Dengan cara mana pun, grup baru tidak memiliki nama maupun warna. Hanya grup ini yang dipilih, dan editor namanya terbuka di atas bilah judul sehingga Anda dapat langsung mengetikkan nama — lihat [Memberi nama grup](#naming-a-group).  
Grup dan tabel serta memo yang dimasukkannya merupakan satu langkah pembatalan, dan nama yang Anda ketik merupakan langkah lain.

## Memberi nama grup {#naming-a-group}

Nama grup diedit di kotak teks yang terbuka di atas bilah judulnya. Kotak ini terbuka dengan sendirinya setelah grup dibuat, saat bilah judul diklik dua kali, dan dari `Rename` di menu konteks grup.  
`Enter`, mengeklik di tempat lain, atau menyembunyikan grup, baik Anda yang menyembunyikannya maupun kolaborator, menyimpan nama. `Escape` menutup kotak teks tanpa mengubah nama dan membiarkan grup tetap dipilih, dan `Escape` kedua mengosongkan pilihan.  
Nama yang diubah merupakan satu langkah pembatalan; menyimpan nama tanpa perubahan tidak mencatat apa pun. Nama yang kosong atau hanya berisi spasi ditampilkan sebagai `unnamed`.  
Selama kotak teks terbuka, pintasan kanvas ditahan, dan pintasan Pencarian Cepat serta `Toggle Explorer` tidak melakukan apa pun, seperti saat sel tabel sedang diedit.  
Saat kolaborator atau agen pemrograman mengganti diagram selagi kotak teks terbuka, kotak teks tetap terbuka selama diagram baru masih memiliki grup itu dan menampilkan grup.  
Jika diagram itu tidak lagi memiliki grup tersebut, kotak teks tertutup dan tidak menyimpan apa pun; jika diagram itu memiliki grup tetapi menyembunyikan grup, kotak teks tertutup dan menyimpan nama yang telah berubah.  
Memuat ulang diagram ke editor, seperti yang dilakukan Obsidian saat file berubah di luarnya, menutup kotak teks dan membuang nama yang diketik. Tombol yang ditekan setelah itu tidak diteruskan ke mana pun hingga Anda mengeklik editor, sehingga `Delete` atau `Backspace` yang dimaksudkan untuk nama tidak menghapus apa pun.

[Temukan dan Ganti](./find-and-replace.md#what-it-searches) mencari nama grup di bawah `Table group names` selama grup ditampilkan, dan `Replace` serta `Replace All` di dalamnya mengganti nama grup — lihat [Mengganti](./find-and-replace.md#replacing). [Pencarian Cepat](./quick-search.md#searching-the-diagram) tidak mencari nama grup.

## Memberi warna grup {#coloring-a-group}

Pilih `Color` di menu konteks grup untuk membuka pemilih warna pada warna grup tersebut.  
Seperti pada tabel dan memo, pemilih warna memberi warna pada setiap tabel, memo, dan grup yang dipilih, dan `Remove color` di menu, atau `No color` di pemilih warna, menghapus warna dari semuanya — lihat [Pemberian warna tabel dan memo](./table-related-functions.md#table-and-memo-color-specification). Warna grup juga ditawarkan di bawah `Document colors` di pemilih warna.

Grup berwarna menggambar bilah judul dan garis tepinya dengan warna tersebut dan badannya dengan rona pucat dari warna itu. Grup tanpa warna menggunakan warna abu-abu netral dari tema.  
Setiap tabel di grup berwarna memakai warna grup di seluruh headernya dan mempertahankan warnanya sendiri di tepi kirinya, sehingga keduanya terlihat.  
Setiap memo di grup berwarna memakai warna grup di seluruh bilah header di atas teksnya dan mempertahankan warnanya sendiri pada garis warna di tepi atasnya, sehingga keduanya terlihat.  
Teks dan tombol pada header seperti itu berubah menjadi putih, atau hitam pada warna terang yang membuat hitam jauh lebih mudah dibaca, begitu pula `x` pada memo serta nama, ikon, dan `x` di bilah judul grup. Di antara contoh warna prasetel di pemilih warna, Oranye, Ambar, Kuning, dan Hijau limau memakai hitam, dan sisanya memakai putih.  
Tabel mempertahankan headernya sendiri selama grupnya tidak berwarna, selama grup disembunyikan, pada zoom `70%` ke bawah, saat tabel menciut hingga hanya menampilkan namanya, dan di tab Visualisasi.  
Memo mempertahankan headernya sendiri selama grupnya tidak berwarna atau selama grup disembunyikan. Memo tidak pernah menciut, sehingga memo memakai bilah header tersebut pada setiap zoom.

Perubahan warna dicatat di [riwayat pembatalan](./undo-redo.md#one-gesture-one-step) seperti pada tabel dan memo.

## Memilih grup {#selecting-groups}

Klik bilah judul grup untuk memilih grup itu saja, atau `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac) untuk menambahkannya ke pilihan.  
Menekan bilah judul grup yang sudah dipilih mempertahankan seluruh pilihan, sehingga seretan berikutnya memindahkan semuanya.  
Menekan bilah judul, atau mengeklik kanan grup, membawa grup ke depan grup lain dan tabel serta memonya ke depan setiap tabel dan memo lainnya.

Badan grup, yaitu area di bawah bilah judul, diperlakukan sebagai kanvas oleh tombol kiri mouse: menyeretnya menggeser kanvas, `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac) menggambar kotak seleksi, dan klik mengosongkan pilihan. Tabel, memo, dan garis hubungan di atas badan merespons penunjuk seperti biasa.

Kotak seleksi hanya mengambil grup jika kotak itu melingkupi seluruh kotak grup, sehingga kotak seleksi yang digambar di dalam grup memilih tabel dan memo tanpa grupnya — lihat [Pemilihan jamak](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) atau `⌘ + A` (Mac) tidak pernah memilih grup.

`Select tables` di menu konteks grup mengganti pilihan dengan tabel dan memo yang ditampilkan di grup tersebut, tanpa menyertakan grup itu sendiri, sehingga perintah berikutnya hanya mengenai tabel dan memo tersebut.  
Gunakan item ini sebelum perintah yang melewati grup yang dipilih, seperti menyalin atau [memfokuskan tabel](./table-related-functions.md#focusing-on-tables).

Garis tepi grup yang dipilih berubah menjadi warna seleksi. Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), grup yang dipilih peserta lain dilingkari dengan warna peserta tersebut.

## Menuju grup {#going-to-a-group}

[Penjelajah](./explorer.md#the-tree) mencantumkan grup di folder `Table Groups`, menurut nama, masing-masing dengan tabel dan memo yang ditampilkan di bawahnya. Pencarian Cepat tidak mencantumkan grup.

Memilih baris grup di Penjelajah, kecocokan [Temukan dan Ganti](./find-and-replace.md#going-to-a-match) pada nama grup, atau baris grup di daftar [Penampil Perbedaan](./table-related-functions.md#the-change-tree) menuju grup tersebut.  
Tindakan ini menampilkan kotak grup di layar, dengan berpatokan pada bilah judulnya jika kotak lebih tinggi daripada kanvas — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands). Kemudian tindakan ini memilih grup itu saja dan membawanya ke depan bersama tabel dan memonya, seperti saat bilah judulnya ditekan.  
Selama grup [disembunyikan](#hiding-groups), atau setelah grup dihapus, menuju grup tersebut tidak melakukan apa pun.  
Di Penampil Perbedaan, setiap sisi menuju grup hanya jika dokumennya sendiri memuat dan menampilkan grup tersebut — lihat [Menuju perubahan](./table-related-functions.md#going-to-a-change).

## Memindahkan dan mengubah ukuran grup {#moving-and-resizing-a-group}

Seret grup pada bilah judulnya untuk memindahkannya bersama semua tabel dan memonya.  
Jika grup merupakan bagian dari pilihan yang lebih besar, seluruh pilihan ikut berpindah, dan tabel atau memo yang dipilih sekaligus berada di grup tersebut berpindah satu kali.  
Seretan baru dimulai setelah penunjuk bergerak sedikit, sehingga klik atau klik dua kali pada bilah judul tetap menjadi klik. `Alt + drag` pada bilah judul memindahkan grup seperti seretan biasa; grup tidak pernah diduplikasi.  
Pemindahan ini, beserta setiap tabel dan memo yang dibawanya, merupakan satu langkah pembatalan.

Menyeret tabel atau memo secara terpisah hanya memindahkan tabel atau memo itu, dan dapat memindahkannya ke dalam atau ke luar grup — lihat [Menambahkan dan mengeluarkan tabel](#adding-and-removing-tables).

Setiap grup memiliki pegangan ubah ukuran di keempat sisi dan keempat sudutnya, baik dipilih maupun tidak, seperti memo.  
Seret salah satunya dengan tombol kiri mouse: kotak mengikuti penunjuk, dan ukuran baru disimpan saat Anda melepaskan tombol mouse, sebagai satu langkah pembatalan.  
Grup tidak dapat dibuat lebih kecil dari `160px` kali `100px`, maupun lebih kecil dari tabel dan memo yang ditampilkan di dalamnya beserta ruang `24px` dan bilah judulnya. Tepi kotak berhenti di sana sejauh apa pun penunjuk bergerak.

## Menambahkan dan mengeluarkan tabel {#adding-and-removing-tables}

Tabel atau memo bergabung ke atau keluar dari grup sesuai tempat Anda melepaskannya.  
Saat Anda menyeret tabel atau memo lalu melepaskan tombol mouse, setiap tabel dan memo yang diseret dan tidak dibawa oleh grup yang dipilih dinilai berdasarkan titik tengahnya. Tabel atau memo itu bergabung ke grup teratas yang kotaknya memuat titik tengahnya, atau keluar dari grupnya jika titik tengahnya tidak berada di kotak grup mana pun. Grup teratas adalah grup yang digambar di depan.  
Grup yang tidak dipindahkan oleh seretan mempertahankan kotak yang dimilikinya saat seretan dimulai, sehingga tabel atau memo yang digeser sedikit di dalam grupnya sendiri tetap berada di grup itu, dan harus diseret hingga titik tengahnya berada di luar kotak tersebut agar dapat keluar.  
Selama Anda menyeret, setiap grup yang akan dimasuki tabel atau memo saat dilepaskan diberi garis tepi.

Saat Anda melepaskan tombol mouse dalam sekitar `200ms` setelah gerakan terakhir, perubahan grup menjadi bagian dari langkah pembatalan seretan, sehingga satu kali pembatalan mengembalikan tabel dan memo ke posisi semula dan ke grup tempatnya berada sebelumnya. Setelah jeda yang lebih lama sebelum melepaskan tombol mouse, perubahan grup menjadi langkah tersendiri — lihat [Satu gerakan, satu langkah](./undo-redo.md#one-gesture-one-step).  
Klik, atau seretan sejauh beberapa piksel, tidak mengubah grup, dan tidak ada yang berpindah grup selama grup disembunyikan.

Cara lain untuk mengubah tabel dan memo yang dimuat grup:

- `Remove from group` di menu konteks tabel atau memo mengeluarkan setiap tabel dan memo yang dipilih dari grupnya. Item ini ditampilkan selama ada tabel atau memo yang dipilih yang berada di grup, bahkan selama grup disembunyikan, dan merupakan satu langkah pembatalan.
- `Group selected tables` memindahkan tabel yang dipilih, beserta memo yang dipilih bersamanya, ke grup baru — lihat [Mengelompokkan tabel yang dipilih](#grouping-selected-tables).
- Menghapus grup membuat tabel dan memonya tidak berada di grup mana pun.

Tabel atau memo yang ditempel atau diduplikasi dengan `Alt` tidak berada di grup mana pun, bahkan saat ditempatkan di dalam kotak grup. Menyeretnya setelah itu menerapkan aturan pelepasan.

![Menyeret memo ke grup Billing sehingga headernya memakai warna hijau kebiruan grup dan kotak meregang mengelilinginya, memindahkan grup bersama memo itu, lalu mengeluarkan memo dengan Remove from group di menunya](/img/demo-table-group-memo.webp)

## Menghapus grup {#removing-a-group}

Menghapus grup tidak pernah menghapus tabel dan memonya: keduanya tetap berada di tempatnya, tanpa grup.

- `x` di ujung bilah judul, yang ditampilkan selama penunjuk berada di atas grup, hanya menghapus grup itu.
- `Delete` di menu konteks grup menghapus grup tersebut. Saat grup merupakan salah satu dari beberapa item yang dipilih, item menu ini bertuliskan `Delete selected` dan menghapus semua yang dipilih: tabel, memo, dan grup.
- Saat ada grup yang dipilih, `Delete` atau `Backspace` menghapus grup yang dipilih beserta tabel dan memo yang dipilih, begitu pula `Ctrl + Backspace` dan `Ctrl + Delete` (Windows/Linux) atau `⌘ + Backspace` dan `⌘ + Delete` (Mac) — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion).

Setiap penghapusan merupakan satu langkah pembatalan, yang mengembalikan grup beserta tabel dan memo di dalamnya.

## Menu grup {#the-group-menu}

Klik kanan bilah judul, badan, atau tepi grup untuk membuka menunya. Di Mac, `Ctrl + click` juga membukanya, begitu pula tekan lama di layar sentuh.  
Klik kanan memilih grup terlebih dahulu, hanya grup itu kecuali jika grup sudah menjadi bagian dari pilihan, sehingga `Color` dan `Delete selected` hanya mengenai sisa pilihan jika grup tersebut sudah ada di dalamnya.

- `Select tables`: memilih tabel dan memo yang ditampilkan di grup tersebut saja — lihat [Memilih grup](#selecting-groups).
- `Rename`: membuka editor nama — lihat [Memberi nama grup](#naming-a-group).
- `Color`: membuka pemilih warna — lihat [Memberi warna grup](#coloring-a-group).
- `Remove color`: ditampilkan selama ada item yang dipilih yang memiliki warna.
- `Delete`, atau `Delete selected` saat grup merupakan salah satu dari beberapa item yang dipilih, dengan tombol `Delete` ditampilkan di sebelah kanan — lihat [Menghapus grup](#removing-a-group).

Menu konteks tabel atau memo menambahkan `Group selected tables` dan `Remove from group` setelah `Color` dan `Remove color`, sebelum item penghapusannya, dan menu konteks kanvas menambahkan `New Table Group`.  
`Group selected tables` menampilkan tombolnya, `T` lalu `G`, di sebelah kanan, dan `New Table Group` menampilkan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac).

## Menyembunyikan grup {#hiding-groups}

`View Option` → `Table Groups` di menu konteks kanvas menampilkan atau menyembunyikan semua grup. Opsi ini dicentang secara default — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options).  
Jika tidak dicentang, kotak grup menghilang dari kanvas, minimap, dan gambar yang diekspor, dan bilah gulir serta minimap tidak lagi menyediakan ruang untuk grup. Tabel dan memo kehilangan warna grup pada headernya. Tidak ada yang berpindah atau berubah ukuran, dan setiap tabel dan memo tetap berada di grupnya.  
Menyembunyikan grup membatalkan pilihan grup, mengakhiri penggambaran `New Table Group`, dan menutup editor nama yang sedang terbuka seperti saat mengeklik di tempat lain — lihat [Memberi nama grup](#naming-a-group).

Selama grup disembunyikan:

- `New Table Group` dan `Group selected tables` tidak ditawarkan di menu, begitu pula `New Table Group` dan `Group Selected Tables` di Pencarian Cepat, dan bilah alat kanvas tidak menampilkan tombol `New Table Group`. `Remove from group` tetap ditawarkan.
- `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac) dan `T` lalu `G` tidak melakukan apa pun.
- Menyeret tabel atau memo tidak mengubah grup, dan kotak seleksi tidak mengambil grup.
- Penjelajah tidak menampilkan folder `Table Groups`, dan Temukan dan Ganti tidak menemukan maupun mengganti nama grup, bahkan saat `Table group names` aktif.
- [Tata Letak Otomatis](#auto-layout) masih menjaga tabel dan memo setiap grup tetap bersama, tab Skema SQL masih menawarkan [grup untuk dipilih](#schema-sql-by-group), DBML masih menuliskannya, dan [Impor dan Tambahkan](./file-import-export.md#import-and-add) masih menempatkan hasilnya di bawah kotak yang tersembunyi.

Pilihan ini disimpan di dokumen dan dicatat di [riwayat pembatalan](./undo-redo.md#what-the-history-records), seperti sakelar opsi tampilan lainnya. Di editor hanya baca, pilihan ini tetap berada di layar itu — lihat [Editor hanya baca](#read-only-editors).

## Tata Letak Otomatis {#auto-layout}

Setiap [Tata Letak Otomatis](./table-related-functions.md#auto-layout) menjaga tabel dan memo setiap grup tetap bersama, baik grup ditampilkan maupun tidak.

- `Force` memindahkan setiap grup bersama tabel dan memonya sebagai satu kotak, dengan masing-masing tetap di tempatnya di dalam kotak itu, dan menjaga kotak setiap grup berjarak setidaknya `100px` dari grup lain dan dari tabel yang tidak berada di grup mana pun. Pratinjau menampilkan setiap grup di tempat tujuannya.
- `Flow`, `Tree - vertical`, dan `Tree - horizontal` menata tabel setiap grup di dalam grup tersebut, dengan memo yang ditampilkan dikemas di sampingnya, dan menempatkan grup berdasarkan hubungan di antara grup-grup itu, dengan tabel yang tidak berada di grup mana pun ditata di sekelilingnya.

Setelah itu, setiap grup yang memuat tabel disesuaikan dengan tabel dan memo yang ditampilkan di dalamnya: kotaknya menjadi batas keduanya ditambah ruang `24px` dan bilah judul. Grup tanpa tabel mempertahankan posisi dan ukurannya, dan memo di dalamnya tetap di tempatnya.  
Memo yang disembunyikan ikut berpindah bersama tabel grupnya tetapi tidak memakan ruang.  
Tabel, memo, dan grup ditempatkan sebagai satu langkah pembatalan.

Impor DBML menyesuaikan setiap grup di sekeliling tabelnya dengan cara yang sama, di mana pun tabel itu ditempatkan — lihat [DBML](./file-import-export.md#dbml).

## Skema SQL per grup {#schema-sql-by-group}

Tab [Skema SQL](./schema-sql.md) dapat menuliskan tabel dari grup yang dipilih saja.  
Selama dokumen memuat grup, baik ditampilkan maupun disembunyikan, panel opsinya menampilkan baris `Tables` di bawah `This window only`, dengan kotak centang untuk `All`, satu untuk setiap grup, dan satu untuk `No group`, yaitu tabel yang tidak berada di grup mana pun — lihat [Tabel](./schema-sql.md#tables).  
Pilihan ini milik jendela editor dan tidak disimpan di dokumen.

## Impor, ekspor, dan penyalinan {#import-export-and-copying}

- DBML membawa grup di kedua arah, beserta tabelnya tetapi tidak memonya. Impor DBML mengubah setiap blok `TableGroup` menjadi grup — lihat [DBML](./file-import-export.md#dbml) — dan `DBML` di Generator Kode menuliskan blok `TableGroup` untuk setiap grup yang memuat tabel — lihat [Generator Kode](./code-generator.md#language).
- File JSON mempertahankan grupnya, beserta tabel dan memo di setiap grup. Tidak ada format lain yang membawanya: impor SQL, GraphQL, dan AML tidak membawa grup, dan Skema SQL serta target Generator Kode lainnya tidak menuliskan grup.
- [Impor dan Tambahkan](./file-import-export.md#import-and-add) memasukkan grup dari file sebagai grup baru yang memuat tabel dan memonya, dan memilihnya bersama tabel baru dan memo yang ditampilkan selama grup ditampilkan, sehingga menyeret blok yang ditambahkan ikut membawa grupnya.
- [Gambar yang diekspor](./file-import-export.md#image) menggambar grup yang ditampilkan di belakang tabel dan memo, dengan warna grup pada headernya.
- Menyalin dan menempel, atau menduplikasi dengan `Alt`, tidak pernah menyalin grup — lihat [Menyalin/menempel tabel dan memo](./table-related-functions.md#copyingpasting-tables-and-memos) dan [Menambahkan dan mengeluarkan tabel](#adding-and-removing-tables).

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), grup digambar dan dicantumkan di Penjelajah seperti biasa serta dapat dituju, tetapi tidak dapat diubah:

- [Menuju grup](#going-to-a-group) memilihnya, dan itulah satu-satunya cara grup dipilih di sana. Menekan bilah judul tidak memilih apa pun dan tidak memindahkan apa pun: jika diseret, ia menggeser kanvas, dan klik yang tidak bergerak menghapus pilihan yang ditinggalkan sebuah lompatan.
- Tidak ada pegangan ubah ukuran dan tidak ada `x`, dan klik dua kali pada bilah judul tidak membuka editor nama.
- Klik kanan pada grup atau memo tidak membuka menu apa pun, dan menu tabel hanya berisi `Table Properties`.
- Menu kanvas tidak memiliki `New Table Group`, dan Pencarian Cepat tidak mencantumkan kedua perintah grup tersebut. Penggambaran `New Table Group` berakhir saat editor menjadi hanya baca.
- [Bilah alat kanvas](./table-related-functions.md#canvas-toolbar) hanya mempertahankan kontrol tampilannya, sehingga tidak memiliki tombol `New Table Group`, dan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac) dan `T` lalu `G` tidak melakukan apa pun.
- Seretan tabel, memo, atau grup yang sedang berlangsung saat editor menjadi hanya baca berhenti di tempatnya dan tidak mengubah grup mana pun, dan perubahan ukuran grup yang sedang berlangsung berakhir tanpa mengubah ukurannya.
- `View Option` → `Table Groups` menampilkan atau menyembunyikan grup di layar itu saja, seperti setiap View Option di sana: dokumen, kolaborator, dan riwayat pembatalan mempertahankan pilihan seperti semula, dan saat editor dapat menulis lagi, pilihan dokumen dikembalikan.
- Pilihan `Tables` di tab Skema SQL tetap berfungsi.
