---
sidebar_position: 6
description: Mengumpulkan tabel yang berkaitan dalam kotak bernama dan berwarna di belakangnya; membuat, memberi nama, memberi warna, memindahkan, mengubah ukuran, dan menghapus grup, menuju grup dari Penjelajah, mengubah tabel yang dimuatnya, menyembunyikannya, dan mempertahankannya melalui Tata Letak Otomatis, Skema SQL, dan DBML.
---

# Grup tabel

Grup tabel adalah kotak bernama dan berwarna yang digambar di belakang tabel yang berkaitan di kanvas ERD, untuk menunjukkan tabel mana saja yang termasuk satu kelompok.  
Setiap tabel paling banyak berada di satu grup. Grup disimpan bersama diagram, beserta grup tempat setiap tabel berada.

Kotak ini memiliki bilah judul di sepanjang bagian atasnya, yang memuat ikon grup, nama grup dalam huruf tebal, dan, selama penunjuk berada di atas grup, sebuah `x` yang menghapusnya — lihat [Menghapus grup](#removing-a-group). Grup tanpa nama bertuliskan `unnamed`, dan nama yang terlalu panjang untuk bilah tersebut dipotong dengan `…`.  
Kotak selalu memuat tabelnya: kotak mempertahankan ukuran yang diberikan kepadanya, tetapi meregang agar setiap tabel tetap berada di dalamnya dengan ruang `24px` di sekelilingnya dan bilah judul di atasnya. Tabel yang membesar ikut meregangkan kotak, begitu pula tabel yang dilepaskan di dekat tepi dengan titik tengahnya masih di dalam kotak. Selama tabel sedang diseret, kotak tidak membesar maupun mengecil. Peregangan ini tidak disimpan: kotak kembali ke ukurannya sendiri begitu tabel tidak lagi membutuhkan ruang tersebut.

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
Setiap tabel yang tidak berada di grup mana pun dan titik tengahnya terletak di dalam kotak baru bergabung ke grup tersebut. Tabel yang sudah berada di grup lain tetap di sana.

Tombol tengah mouse tetap menggeser kanvas dan membiarkan penggambaran tetap siap. Hal-hal berikut mengakhiri penggambaran tanpa menambahkan grup:

- `Escape`, atau `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac), sebelum penekanan atau selama seretan. Sebelum penekanan, keduanya membiarkan pilihan apa adanya; penekanan yang memulai kotak sudah mengosongkannya.
- Klik kanan, yang mengosongkan pilihan. Tidak ada menu konteks yang terbuka.
- Beralih ke alat tangan dengan `Space` atau bilah alat kanvas, mengeklik alat penunjuk atau tombol `New Table Group` di bilah alat, atau memulai hubungan.
- Beralih ke tab lain, menyembunyikan grup, atau editor menjadi hanya baca.

### Mengelompokkan tabel yang dipilih {#grouping-selected-tables}

Pilih satu atau beberapa tabel dan tekan `T` lalu `G`, atau pilih `Group selected tables` dari menu konteks tabel atau `Group Selected Tables` dari Pencarian Cepat, yang mencantumkannya selama ada tabel yang dipilih.  
Grup baru digambar mengelilingi tabel yang dipilih dengan ruang `24px` di setiap sisi dan bilah judul di atasnya. Setiap tabel yang dipilih bergabung ke grup ini dan meninggalkan grup mana pun tempatnya berada sebelumnya, dan grup yang ditinggalkannya tetap ada, bahkan jika kini kosong. Memo dalam pilihan dilewati.

`T` lalu `G` adalah dua kali penekanan tanpa tombol pengubah, dengan `G` dalam satu detik setelah `T`. Tanpa tabel yang dipilih, pintasan ini tidak melakukan apa pun, dan di kotak teks, seperti kotak Temukan di Penjelajah, pintasan ini mengetikkan kedua huruf tersebut.

![Mengelompokkan categories dan products dengan T lalu G, menamai grup Catalog, lalu memberinya warna violet dari menunya sehingga kedua header memakai warna tersebut](/img/demo-table-group-selected.webp)

Dengan cara mana pun, grup baru tidak memiliki nama maupun warna. Hanya grup ini yang dipilih, dan editor namanya terbuka di atas bilah judul sehingga Anda dapat langsung mengetikkan nama — lihat [Memberi nama grup](#naming-a-group).  
Grup dan tabel yang dimasukkannya merupakan satu langkah pembatalan, dan nama yang Anda ketik merupakan langkah lain.

## Memberi nama grup {#naming-a-group}

Nama grup diedit di kotak teks yang terbuka di atas bilah judulnya. Kotak ini terbuka dengan sendirinya setelah grup dibuat, saat bilah judul diklik dua kali, dan dari `Rename` di menu konteks grup.  
`Enter`, atau mengeklik di tempat lain, menyimpan nama. `Escape` menutup kotak teks tanpa mengubah nama dan membiarkan grup tetap dipilih, dan `Escape` kedua mengosongkan pilihan.  
Nama yang diubah merupakan satu langkah pembatalan; menyimpan nama tanpa perubahan tidak mencatat apa pun. Nama yang kosong atau hanya berisi spasi ditampilkan sebagai `unnamed`.  
Selama kotak teks terbuka, pintasan kanvas ditahan, dan pintasan Pencarian Cepat serta `Toggle Explorer` tidak melakukan apa pun, seperti saat sel tabel sedang diedit.

[Temukan dan Ganti](./find-and-replace.md#what-it-searches) mencari nama grup di bawah `Table group names` selama grup ditampilkan, dan `Replace` serta `Replace All` di dalamnya mengganti nama grup — lihat [Mengganti](./find-and-replace.md#replacing). [Pencarian Cepat](./quick-search.md#searching-the-diagram) tidak mencari nama grup.

## Memberi warna grup {#coloring-a-group}

Pilih `Color` di menu konteks grup untuk membuka pemilih warna pada warna grup tersebut.  
Seperti pada tabel dan memo, pemilih warna memberi warna pada setiap tabel, memo, dan grup yang dipilih, dan `Remove color` di menu, atau `No color` di pemilih warna, menghapus warna dari semuanya — lihat [Pemberian warna tabel dan memo](./table-related-functions.md#table-and-memo-color-specification). Warna grup juga ditawarkan di bawah `Document colors` di pemilih warna.

Grup berwarna menggambar bilah judul dan garis tepinya dengan warna tersebut dan badannya dengan rona pucat dari warna itu. Grup tanpa warna menggunakan warna abu-abu netral dari tema.  
Setiap tabel di grup berwarna memakai warna grup di seluruh headernya dan mempertahankan warnanya sendiri di tepi kirinya, sehingga keduanya terlihat.  
Teks dan tombol pada header seperti itu berubah menjadi putih, atau hitam pada warna terang yang membuat hitam jauh lebih mudah dibaca, begitu pula nama, ikon, dan `x` di bilah judul grup. Di antara contoh warna prasetel di pemilih warna, Oranye, Ambar, Kuning, dan Hijau limau memakai hitam, dan sisanya memakai putih.  
Tabel mempertahankan headernya sendiri selama grupnya tidak berwarna, selama grup disembunyikan, pada zoom `70%` ke bawah, saat tabel menciut hingga hanya menampilkan namanya, dan di tab Visualisasi.

Perubahan warna dicatat di [riwayat pembatalan](./undo-redo.md#one-gesture-one-step) seperti pada tabel dan memo.

## Memilih grup {#selecting-groups}

Klik bilah judul grup untuk memilih grup itu saja, atau `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac) untuk menambahkannya ke pilihan.  
Menekan bilah judul grup yang sudah dipilih mempertahankan seluruh pilihan, sehingga seretan berikutnya memindahkan semuanya.  
Menekan bilah judul, atau mengeklik kanan grup, membawa grup ke depan grup lain dan tabelnya ke depan setiap tabel dan memo lainnya.

Badan grup, yaitu area di bawah bilah judul, diperlakukan sebagai kanvas oleh tombol kiri mouse: menyeretnya menggeser kanvas, `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac) menggambar kotak seleksi, dan klik mengosongkan pilihan. Tabel, memo, dan garis hubungan di atas badan merespons penunjuk seperti biasa.

Kotak seleksi hanya mengambil grup jika kotak itu melingkupi seluruh kotak grup, sehingga kotak seleksi yang digambar di dalam grup memilih tabel tanpa grupnya — lihat [Pemilihan jamak](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) atau `⌘ + A` (Mac) tidak pernah memilih grup.

`Select tables` di menu konteks grup mengganti pilihan dengan tabel di grup tersebut, tanpa menyertakan grup itu sendiri, sehingga perintah berikutnya hanya mengenai tabel.  
Gunakan item ini sebelum perintah yang hanya bekerja pada tabel, seperti menyalin atau [memfokuskan tabel](./table-related-functions.md#focusing-on-tables), yang melewati grup yang dipilih.

Garis tepi grup yang dipilih berubah menjadi warna seleksi. Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), grup yang dipilih peserta lain dilingkari dengan warna peserta tersebut.

## Menuju grup {#going-to-a-group}

[Penjelajah](./explorer.md#the-tree) mencantumkan grup di folder `Table Groups`, menurut nama, masing-masing dengan tabelnya di bawahnya. Pencarian Cepat tidak mencantumkan grup.

Memilih baris grup di Penjelajah, kecocokan [Temukan dan Ganti](./find-and-replace.md#going-to-a-match) pada nama grup, atau baris grup di daftar [Penampil Perbedaan](./table-related-functions.md#the-change-tree) menuju grup tersebut.  
Tindakan ini menampilkan kotak grup di layar, dengan berpatokan pada bilah judulnya jika kotak lebih tinggi daripada kanvas — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands). Kemudian tindakan ini memilih grup itu saja dan membawanya ke depan bersama tabelnya, seperti saat bilah judulnya ditekan.  
Selama grup [disembunyikan](#hiding-groups), atau setelah grup dihapus, menuju grup tersebut tidak melakukan apa pun.  
Di Penampil Perbedaan, setiap sisi menuju grup hanya jika dokumennya sendiri memuat dan menampilkan grup tersebut — lihat [Menuju perubahan](./table-related-functions.md#going-to-a-change).

## Memindahkan dan mengubah ukuran grup {#moving-and-resizing-a-group}

Seret grup pada bilah judulnya untuk memindahkannya bersama semua tabelnya.  
Jika grup merupakan bagian dari pilihan yang lebih besar, seluruh pilihan ikut berpindah, dan tabel yang dipilih sekaligus berada di grup tersebut berpindah satu kali.  
Seretan baru dimulai setelah penunjuk bergerak sedikit, sehingga klik atau klik dua kali pada bilah judul tetap menjadi klik. `Alt + drag` pada bilah judul memindahkan grup seperti seretan biasa; grup tidak pernah diduplikasi.  
Pemindahan ini, beserta setiap tabel yang dibawanya, merupakan satu langkah pembatalan.

Menyeret tabel secara terpisah hanya memindahkan tabel itu, dan dapat memindahkannya ke dalam atau ke luar grup — lihat [Menambahkan dan mengeluarkan tabel](#adding-and-removing-tables).

Setiap grup memiliki pegangan ubah ukuran di keempat sisi dan keempat sudutnya, baik dipilih maupun tidak, seperti memo.  
Seret salah satunya dengan tombol kiri mouse: kotak mengikuti penunjuk, dan ukuran baru disimpan saat Anda melepaskan tombol mouse, sebagai satu langkah pembatalan.  
Grup tidak dapat dibuat lebih kecil dari `160px` kali `100px`, maupun lebih kecil dari tabelnya beserta ruang `24px` dan bilah judulnya. Tepi kotak berhenti di sana sejauh apa pun penunjuk bergerak.

## Menambahkan dan mengeluarkan tabel {#adding-and-removing-tables}

Tabel bergabung ke atau keluar dari grup sesuai tempat Anda melepaskannya.  
Saat Anda menyeret tabel lalu melepaskan tombol mouse, setiap tabel yang diseret dan tidak dibawa oleh grup yang dipilih dinilai berdasarkan titik tengahnya. Tabel bergabung ke grup teratas yang kotaknya memuat titik tengahnya, atau keluar dari grupnya jika titik tengahnya tidak berada di kotak grup mana pun. Grup teratas adalah grup yang digambar di depan.  
Grup yang tidak dipindahkan oleh seretan mempertahankan kotak yang dimilikinya saat seretan dimulai, sehingga tabel yang digeser sedikit di dalam grupnya sendiri tetap berada di grup itu, dan harus diseret hingga titik tengahnya berada di luar kotak tersebut agar dapat keluar.  
Selama Anda menyeret, setiap grup yang akan dimasuki tabel saat dilepaskan diberi garis tepi.

Saat Anda melepaskan tombol mouse dalam sekitar `200ms` setelah gerakan terakhir, perubahan grup menjadi bagian dari langkah pembatalan seretan, sehingga satu kali pembatalan mengembalikan tabel ke posisi semula dan ke grup tempatnya berada sebelumnya. Setelah jeda yang lebih lama sebelum melepaskan tombol mouse, perubahan grup menjadi langkah tersendiri — lihat [Satu gerakan, satu langkah](./undo-redo.md#one-gesture-one-step).  
Klik, atau seretan sejauh beberapa piksel, tidak mengubah grup, dan tidak ada yang berpindah grup selama grup disembunyikan.

Cara lain untuk mengubah tabel yang dimuat grup:

- `Remove from group` di menu konteks tabel mengeluarkan setiap tabel yang dipilih dari grupnya. Item ini ditampilkan selama ada tabel yang dipilih yang berada di grup, bahkan selama grup disembunyikan, dan merupakan satu langkah pembatalan.
- `Group selected tables` memindahkan tabel yang dipilih ke grup baru — lihat [Mengelompokkan tabel yang dipilih](#grouping-selected-tables).
- Menghapus grup membuat tabelnya tidak berada di grup mana pun.

Tabel yang ditempel atau diduplikasi dengan `Alt` tidak berada di grup mana pun, bahkan saat tabel itu ditempatkan di dalam kotak grup. Menyeretnya setelah itu menerapkan aturan pelepasan.

## Menghapus grup {#removing-a-group}

Menghapus grup tidak pernah menghapus tabelnya: tabel tetap berada di tempatnya, tanpa grup.

- `x` di ujung bilah judul, yang ditampilkan selama penunjuk berada di atas grup, hanya menghapus grup itu.
- `Delete` di menu konteks grup menghapus grup tersebut. Saat grup merupakan salah satu dari beberapa item yang dipilih, item menu ini bertuliskan `Delete selected` dan menghapus semua yang dipilih: tabel, memo, dan grup.
- Saat ada grup yang dipilih, `Delete` atau `Backspace` menghapus grup yang dipilih beserta tabel dan memo yang dipilih, begitu pula `Ctrl + Backspace` dan `Ctrl + Delete` (Windows/Linux) atau `⌘ + Backspace` dan `⌘ + Delete` (Mac) — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion).

Setiap penghapusan merupakan satu langkah pembatalan, yang mengembalikan grup beserta tabel di dalamnya.

## Menu grup {#the-group-menu}

Klik kanan bilah judul, badan, atau tepi grup untuk membuka menunya. Di Mac, `Ctrl + click` juga membukanya, begitu pula tekan lama di layar sentuh.  
Klik kanan memilih grup terlebih dahulu, hanya grup itu kecuali jika grup sudah menjadi bagian dari pilihan, sehingga `Color` dan `Delete selected` hanya mengenai sisa pilihan jika grup tersebut sudah ada di dalamnya.

- `Select tables`: memilih tabel di grup tersebut saja — lihat [Memilih grup](#selecting-groups).
- `Rename`: membuka editor nama — lihat [Memberi nama grup](#naming-a-group).
- `Color`: membuka pemilih warna — lihat [Memberi warna grup](#coloring-a-group).
- `Remove color`: ditampilkan selama ada item yang dipilih yang memiliki warna.
- `Delete`, atau `Delete selected` saat grup merupakan salah satu dari beberapa item yang dipilih, dengan tombol `Delete` ditampilkan di sebelah kanan — lihat [Menghapus grup](#removing-a-group).

Menu konteks tabel menambahkan `Group selected tables` dan `Remove from group` setelah `Color` dan `Remove color`, sebelum item penghapusannya, dan menu konteks kanvas menambahkan `New Table Group`.  
`Group selected tables` menampilkan tombolnya, `T` lalu `G`, di sebelah kanan, dan `New Table Group` menampilkan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac).

## Menyembunyikan grup {#hiding-groups}

`View Option` → `Table Groups` di menu konteks kanvas menampilkan atau menyembunyikan semua grup. Opsi ini dicentang secara default — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options).  
Jika tidak dicentang, kotak grup dan warna grup pada header tabel menghilang dari kanvas, minimap, dan gambar yang diekspor, dan bilah gulir serta minimap tidak lagi menyediakan ruang untuk grup. Tidak ada yang berpindah atau berubah ukuran, dan setiap tabel tetap berada di grupnya.  
Menyembunyikan grup membatalkan pilihan grup, mengakhiri penggambaran `New Table Group`, dan menutup editor nama yang sedang terbuka.

Selama grup disembunyikan:

- `New Table Group` dan `Group selected tables` tidak ditawarkan di menu, begitu pula `New Table Group` dan `Group Selected Tables` di Pencarian Cepat, dan bilah alat kanvas tidak menampilkan tombol `New Table Group`. `Remove from group` tetap ditawarkan.
- `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac) dan `T` lalu `G` tidak melakukan apa pun.
- Menyeret tabel tidak mengubah grup, dan kotak seleksi tidak mengambil grup.
- Penjelajah tidak menampilkan folder `Table Groups`, dan Temukan dan Ganti tidak menemukan maupun mengganti nama grup, bahkan saat `Table group names` aktif.
- [Tata Letak Otomatis](#auto-layout) masih menjaga tabel setiap grup tetap bersama, tab Skema SQL masih menawarkan [grup untuk dipilih](#schema-sql-by-group), DBML masih menuliskannya, dan [Impor dan Tambahkan](./file-import-export.md#import-and-add) masih menempatkan hasilnya di bawah kotak yang tersembunyi.

Pilihan ini disimpan di dokumen dan dicatat di [riwayat pembatalan](./undo-redo.md#what-the-history-records), seperti sakelar opsi tampilan lainnya.

## Tata Letak Otomatis {#auto-layout}

Setiap [Tata Letak Otomatis](./table-related-functions.md#auto-layout) menjaga tabel setiap grup tetap bersama, baik grup ditampilkan maupun tidak.

- `Force` memindahkan setiap grup bersama tabelnya sebagai satu kotak, dengan tabel tetap di tempatnya di dalam kotak itu, dan menjaga kotak setiap grup berjarak setidaknya `100px` dari grup lain dan dari tabel yang tidak berada di grup mana pun. Pratinjau menampilkan setiap grup di tempat tujuannya.
- `Flow`, `Tree - vertical`, dan `Tree - horizontal` menata tabel setiap grup di dalam grup tersebut dan menempatkan grup berdasarkan hubungan di antara grup-grup itu, dengan tabel yang tidak berada di grup mana pun ditata di sekelilingnya.

Setelah itu, setiap grup yang memuat tabel disesuaikan dengan tabelnya: kotaknya menjadi batas tabel tersebut ditambah ruang `24px` dan bilah judul. Grup tanpa tabel mempertahankan posisi dan ukurannya.  
Tabel dan grup ditempatkan sebagai satu langkah pembatalan.

Impor DBML menyesuaikan setiap grup di sekeliling tabelnya dengan cara yang sama, di mana pun tabel itu ditempatkan — lihat [DBML](./file-import-export.md#dbml).

## Skema SQL per grup {#schema-sql-by-group}

Tab [Skema SQL](./schema-sql.md) dapat menuliskan tabel dari grup yang dipilih saja.  
Selama dokumen memuat grup, baik ditampilkan maupun disembunyikan, panel opsinya menampilkan baris `Tables` di bawah `This window only`, dengan kotak centang untuk `All`, satu untuk setiap grup, dan satu untuk `No group`, yaitu tabel yang tidak berada di grup mana pun — lihat [Tabel](./schema-sql.md#tables).  
Pilihan ini milik jendela editor dan tidak disimpan di dokumen.

## Impor, ekspor, dan penyalinan {#import-export-and-copying}

- DBML membawa grup di kedua arah. Impor DBML mengubah setiap blok `TableGroup` menjadi grup — lihat [DBML](./file-import-export.md#dbml) — dan `DBML` di Generator Kode menuliskan blok `TableGroup` untuk setiap grup yang memuat tabel — lihat [Generator Kode](./code-generator.md#language).
- File JSON mempertahankan grupnya. Tidak ada format lain yang membawanya: impor SQL, GraphQL, dan AML tidak membawa grup, dan Skema SQL serta target Generator Kode lainnya tidak menuliskan grup.
- [Impor dan Tambahkan](./file-import-export.md#import-and-add) memasukkan grup dari file sebagai grup baru yang memuat tabelnya, dan memilihnya bersama tabel baru selama grup ditampilkan, sehingga menyeret blok yang ditambahkan ikut membawa grupnya.
- [Gambar yang diekspor](./file-import-export.md#image) menggambar grup yang ditampilkan di belakang tabel, dengan warna grup pada header tabel.
- Menyalin dan menempel, atau menduplikasi dengan `Alt`, tidak pernah menyalin grup — lihat [Menyalin/menempel tabel dan memo](./table-related-functions.md#copyingpasting-tables-and-memos) dan [Menambahkan dan mengeluarkan tabel](#adding-and-removing-tables).

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), grup digambar dan dicantumkan di Penjelajah seperti biasa serta dapat dipilih dan dituju, tetapi tidak dapat diubah:

- Menekan bilah judul memilih grup dan tidak memindahkan apa pun. Tidak ada pegangan ubah ukuran dan tidak ada `x`.
- Klik dua kali pada bilah judul tidak membuka editor nama, dan menu grup hanya berisi `Select tables`.
- Menu kanvas tidak memiliki `New Table Group`, menu tabel tidak memiliki `Group selected tables` maupun `Remove from group`, dan Pencarian Cepat tidak mencantumkan kedua perintah grup tersebut. Penggambaran `New Table Group` berakhir saat editor menjadi hanya baca.
- [Bilah alat kanvas](./table-related-functions.md#canvas-toolbar) tidak menampilkan satu pun tombol tambahnya, termasuk `New Table Group`, dan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac) dan `T` lalu `G` tidak melakukan apa pun.
- Opsi tampilan `Table Groups` tidak mengubah apa pun, seperti halnya semua opsi tampilan.
- Pilihan `Tables` di tab Skema SQL tetap berfungsi.
