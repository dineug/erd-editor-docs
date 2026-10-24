---
sidebar_position: 5
description: Memilih, memindahkan, menyalin, menduplikasi, dan menghapus tabel dan memo, mengatur warna dan opsi tampilan, mendefinisikan indeks dan kunci alternatif, memilih database, bernavigasi di kanvas tanpa batas, dan membandingkan dokumen.
---

# Fungsi terkait tabel

Semua yang Anda lakukan pada tabel dan memo setelah keduanya ada — memilih, memindahkan, menyalin, menghapus, memberi warna, dan mengatur apa yang ditampilkan kanvas — beserta kontrol kanvas di sekitarnya.  
Perintah tabel dan memo dibahas lebih dahulu; lalu Properti Tabel, memfokuskan tabel, indeks dan kunci alternatif, Tata Letak Otomatis, dan vendor database; dan terakhir kanvas itu sendiri: bilah alat kanvas, zoom, penggeseran dan tempat lompatan berakhir, serta Penampil Perbedaan.  
Grup tabel, yaitu kotak yang menghimpun tabel, memiliki halamannya sendiri — lihat [Grup tabel](./table-groups.md).  
Begitu pula nama logis dan Tampilan Nama, yang menentukan nama yang ditampilkan tabel — lihat [Nama logis](./logical-names.md).

## Pemilihan jamak {#multiple-selection}

Mendukung tiga cara:

- `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac)
- `Ctrl + A` atau `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` atau `⌘ + ⌥ + A` (Mac)

Memo dipilih dengan cara yang sama, dan kedua pintasan pilih semua sama-sama mengambil semua tabel dan memo sekaligus. Memo yang disembunyikan dengan View Option → `Memos` tidak ikut dalam pilih semua maupun kotak seleksi — lihat [Opsi tampilan tabel](#table-view-options).  
[Grup tabel](./table-groups.md#selecting-groups) ditambahkan ke pilihan dengan `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac) pada bilah judulnya, tetapi pilih semua tidak pernah mengambil grup.  
`Ctrl + A` mengalah pada kursor teks, sehingga pintasan ini memilih teks, bukan diagram, selama Anda mengedit sel.  
Kotak seleksi menandai tabel atau memo saat kotak itu menutupi bagian tengahnya, bukan saat hanya menyentuh tepinya. Kotak seleksi mengambil grup tabel hanya jika melingkupi seluruh kotak grup, sehingga kotak yang digambar di dalam grup memilih tabel tanpa grupnya.  
Klik kanan pada sesuatu yang sudah dipilih mempertahankan seluruh pilihan, sehingga item menu seperti `Color`, `Group selected tables`, dan `Delete selected` berlaku pada semuanya. Klik kanan pada tabel, memo, atau grup tabel lain memilih objek itu saja, bahkan saat `Ctrl` atau `⌘` ditahan, dan klik kanan pada hubungan atau pada area kanvas yang kosong mengosongkan pilihan.  
`Escape` mengosongkan pilihan. Selama editor sel, memo, atau nama grup tabel terbuka, atau hubungan maupun `New Table Group` sedang digambar, `Escape` pertama mengakhirinya dan `Escape` kedua mengosongkan pilihan.

![Memilih tabel dengan ⌘ + drag dan ⌘ + click, lalu semua tabel dan memo dengan ⌘ + A](/img/demo-table-select.webp)

Dalam sesi kolaboratif, pilihan, sel yang difokuskan, dan kotak seleksi setiap peserta digambar di kanvas dengan warna peserta tersebut — lihat [Pengeditan kolaboratif](../../api/advanced/collaborative-editing.md).  
Sel yang difokuskan oleh peserta yang melihat Tampilan Nama lain digambar pada sel yang ditampilkan tampilan Anda sebagai gantinya, misalnya sel nama milik peserta itu pada sel nama logis Anda — lihat [Kolaborator](./logical-names.md#collaborators).

## Memindahkan beberapa tabel {#moving-multiple-tables}

Seret tabel atau memo mana pun yang sudah termasuk dalam pilihan, dan seluruh pilihan ikut berpindah — tanpa perlu tombol pengubah.  
Tabel diseret melalui headernya atau melalui baris kolom mana pun, sehingga seretan yang dimulai pada baris kolom memindahkan tabel, bukan kolom. Kolom justru dipindahkan melalui pegangan seret di samping baris yang difokuskan — lihat [Mengubah urutan dan memindahkan kolom](./table-editing.md#rearranging-and-moving-columns).  
Pada sel header atau baris kolom, tabel baru mulai berpindah setelah penunjuk bergerak sedikit, sehingga klik di sana tetap memfokuskan sel dan klik dua kali tetap membuka editornya. Seretan tidak pernah dimulai dari tepi warna tabel, yang membuka pemilih warna, dari tombol `+` dan `x` di headernya, atau dari `x` pada baris kolom.  
Menyeret sesuatu di luar pilihan menyusutkan pilihan menjadi objek itu dan hanya memindahkan objek itu. `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac) mempertahankan pilihan dalam kedua kasus.  
Hanya tombol kiri mouse yang memindahkan tabel dan memo. Klik kanan memilih objek yang menjadi sasaran menu konteks dan tidak memindahkan apa pun, sedangkan seretan dengan tombol tengah justru menggeser kanvas — lihat [Navigasi di kanvas](#getting-around-the-canvas).

![Menyeret salah satu dari dua tabel yang dipilih memindahkan keduanya, dan hubungannya ikut bergerak](/img/demo-table-multiple-move.webp)

[Grup tabel](./table-groups.md) yang dipilih juga ikut berpindah beserta tabel-tabelnya, dan tabel yang dipilih sekaligus berada dalam grup yang berpindah hanya berpindah satu kali.  
Tempat Anda melepaskan tabel dapat memasukkannya ke grup atau mengeluarkannya dari grup — lihat [Menambahkan dan mengeluarkan tabel](./table-groups.md#adding-and-removing-tables).

Tabel dan memo berbagi satu urutan tumpukan. Menekan tabel atau memo, dengan tombol kiri atau kanan, membawanya ke depan semua tabel dan memo lainnya, dan menekan bilah judul grup tabel, atau mengeklik kanan badannya, membawa tabel-tabelnya ke depan.  
Urutan ini tidak disimpan: diagram yang dibuka kembali menumpuk tabelnya sesuai urutan pencantumannya di file, dengan semua memo di atasnya.

## Menyalin/menempel tabel dan memo {#copyingpasting-tables-and-memos}

Menyalin tabel dan memo yang dipilih lalu menempelkannya kembali sebagai tabel dan memo baru.  
Pintasan: `Ctrl + C` (Windows/Linux) atau `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) atau `⌘ + V` (Mac)

Tabel yang disalin mempertahankan nama, nama logis, komentar, kolom, dan warnanya; memo yang disalin mempertahankan teks, ukuran, dan warnanya.  
Setiap kolom yang disalin mempertahankan nama logisnya, dan setiap nama tabel dan kolom mempertahankan keterangan apakah nama itu dihasilkan dari kamus — lihat [Menghasilkan nama fisik](./dictionary.md#deriving-physical-names).  
Kolom yang ditempel mempertahankan tautan domainnya hanya jika dua hal terpenuhi: diagram tujuannya memuat domain yang persis sama, bukan sekadar domain dengan nama yang sama, dan domain tersebut masih memiliki tipe data yang sama seperti saat kolom disalin. Jika tidak, kolom ditempel tanpa domain dan mempertahankan tipe saat disalin — lihat [Menautkan kolom](./dictionary.md#linking-a-column).  
Indeks dan hubungan juga ikut tersalin: indeks disalin utuh ke tabel salinan, dan hubungan disalin beserta tipenya serta tindakan ON DELETE dan ON UPDATE-nya jika kedua tabel yang dihubungkannya termasuk dalam kumpulan yang disalin. Hubungan yang hanya tersalin separuh dibuang alih-alih dibiarkan menunjuk kembali ke aslinya.  
Salinan yang ditempel menjadi pilihan baru, dan menempel salinan yang sama lagi menggesernya `50px` lebih jauh setiap kali, sehingga tempelan berulang tidak bertumpuk satu sama lain.  
Salinan tidak mempertahankan [grup tabel](./table-groups.md) asalnya: tabel yang ditempel tidak berada dalam grup mana pun, bahkan saat mendarat di dalam kotak grup, dan grup yang dipilih tidak disalin.  
Selama View Option → `Memos` menyembunyikan memo, penempelan tetap menambahkan memo yang dibawanya, dalam keadaan tersembunyi dan tidak dipilih, sehingga hanya tabel yang ditempel yang menjadi pilihan.

![Menyalin dua tabel yang saling terhubung dan menempelkannya dua kali, termasuk hubungannya](/img/demo-table-copy-paste.webp)

Saat kolom dipilih di dalam tabel yang difokuskan, pintasan yang sama justru menyalin kolom tersebut — lihat [Pengeditan tabel](./table-editing.md).

## Menduplikasi tabel dan memo {#duplicating-tables-and-memos}

Tahan `Alt` dan seret tabel atau memo dengan tombol kiri mouse.  
Tabel diambil melalui headernya atau baris kolom mana pun, sehingga `Alt + drag` pada baris kolom menduplikasi tabel dan membiarkan urutan kolom apa adanya. `Alt` yang ditahan pada pegangan seret kolom tidak menduplikasi apa pun: kolom berpindah seperti saat pegangan diseret biasa — lihat [Mengubah urutan dan memindahkan kolom](./table-editing.md#rearranging-and-moving-columns).  
Pratinjau tembus pandang mengikuti penunjuk, dan melepaskan tombol menaruh salinan di tempat pratinjau berada.  
Jika yang Anda ambil sudah termasuk dalam pilihan, seluruh pilihan diduplikasi. Jika tidak, pilihan diganti dengan entitas di bawah penunjuk.  
`Alt + click` tanpa menggeser mouse menaruh salinan `50px` ke bawah dan ke kanan, dan bergeser lebih jauh setiap kali posisi itu sudah terisi.

Duplikat membawa hal yang sama seperti [tempelan](#copyingpasting-tables-and-memos): nama dan nama logis, komentar, kolom, warna, ukuran memo, serta indeks dan hubungan yang sepenuhnya milik apa yang Anda salin. Karena tetap berada di diagram yang sama, duplikat mempertahankan tautan domain setiap kolom apa adanya. Seperti tempelan, duplikat tidak masuk ke grup tabel mana pun.  
`Alt + drag` pada bilah judul grup tabel memindahkan grup seperti seretan biasa; grup tidak pernah diduplikasi.

![Menduplikasi tabel dengan Alt + drag, lalu Alt + click untuk satu salinan lagi di kanan bawah](/img/demo-table-duplicate.webp)

## Penghapusan tabel dan memo {#table-and-memo-deletion}

Menghapus tabel, memo, dan [grup tabel](./table-groups.md) yang dipilih.  
Pintasan:

- `Delete` atau `Backspace`. Kedua tombol ini menghapus seluruh pilihan, kecuali jika satu-satunya yang dipilih adalah sebuah tabel dengan beberapa kolomnya dipilih dan zoom di atas `70%`: dalam hal itu, keduanya justru menghapus kolom tersebut — lihat [Penghapusan kolom](./table-editing.md#column-deletion).
- `Ctrl + Backspace` atau `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` atau `⌘ + Delete` (Mac). Pintasan ini selalu menghapus tabel, memo, dan grup tabel yang dipilih, bahkan saat ada kolom yang dipilih.

![Menghapus tabel beserta hubungannya dengan tombol Delete, lalu tabel dan memo sekaligus dengan Delete selected dari menu memo](/img/demo-table-remove.webp)

Menu konteks juga dapat menghapus. Item terakhir di menu tabel atau memo bertuliskan `Delete selected` selama tabel atau memo itu merupakan salah satu dari dua item atau lebih yang dipilih, dan menghapus seluruh pilihan. Jika tidak, item itu bertuliskan `Delete` dan hanya menghapus tabel atau memo tersebut. Di atas baris kolom yang dipilih, menu tabel justru bertuliskan `Delete column` atau `Delete columns`, seperti di [Penghapusan kolom](./table-editing.md#column-deletion).

Menghapus tabel juga menghapus hubungan dan indeksnya. Menghapus grup tabel mempertahankan tabel-tabelnya, tanpa grup — lihat [Menghapus grup](./table-groups.md#removing-a-group).  
Tidak ada konfirmasi, setiap penghapusan merupakan satu langkah pembatalan, dan di editor `readonly` tidak ada yang dihapus.  
Saat ditahan, `Delete` dan `Backspace` hanya menghapus satu kali, dan tidak pernah menghapus hubungan — lihat [Pengeditan hubungan](./relationship-editing.md#deletion). Selama Anda mengetik di sel, memo, atau kotak teks lain, kedua tombol ini justru mengedit teks.  
Pengaturan mencantumkan kedua tombol ini sebagai `Delete Selection` — lihat [Pintasan](./settings.md#shortcuts).

## Pemberian warna tabel dan memo {#table-and-memo-color-specification}

Anda dapat menetapkan warna untuk membedakan menurut kategori.  
Tabel menampilkan warnanya di sepanjang tepi kirinya, dan memo di sepanjang bagian atasnya. Klik tepi atau pita itu dengan tombol kiri, atau pilih `Color` di menu konteks tabel atau memo, untuk membuka pemilih warna di posisi penunjuk. Warna diterapkan ke semua tabel, memo, dan grup tabel yang dipilih, bukan hanya yang Anda klik.  
Grup tabel diberi warna dari `Color` di menunya sendiri, dan tabel di dalam grup berwarna menampilkan warna grup di seluruh headernya sambil tetap mempertahankan warnanya sendiri di tepi kiri — lihat [Memberi warna grup](./table-groups.md#coloring-a-group).

![Memilih prasetel Biru dari pita warna memo untuk dua tabel yang dipilih dan memo tersebut, lalu menghapus warnanya dengan No color](/img/demo-table-color.webp)

Pemilih warna berisi, dari atas ke bawah:

- Area saturasi dan kecerahan, lalu penggeser rona dengan pratinjau warna di sampingnya. Jika browser menyediakan pipet warna, tombol pipet di depan penggeser, `Pick a color from the screen`, mengambil warna dari mana saja di layar.
- Kotak `Hex`, `R`, `G`, dan `B`. `Hex` menerima 3, 4, 6, atau 8 digit heksadesimal, dengan atau tanpa `#`, atau `rgb()`, `hsl()`, maupun nama warna CSS yang ditempel. Nilai lengkap 6 atau 8 digit diterapkan saat Anda mengetik, dan nilai lainnya saat `Enter` ditekan atau saat Anda meninggalkan kotak. `R`, `G`, dan `B` menerima bilangan bulat, membaca nilai di atas `255` sebagai `255`, dan diterapkan saat `Enter` ditekan atau saat Anda meninggalkan kotak. Teks yang tidak dapat dibaca pemilih warna dibuang.
- Enam belas contoh warna prasetel dalam dua baris berisi delapan: Merah, Oranye, Ambar, Kuning, Hijau limau, Hijau, Hijau kebiruan, Sian, Biru, Nila, Violet, Ungu, Merah muda, Merah tua, Cokelat, dan Abu-abu. Mengarahkan penunjuk ke contoh warna menampilkan kode heksnya.
- `Document colors`: hingga delapan warna yang sudah dipakai oleh tabel, memo, dan grup tabel dokumen, dimulai dari yang paling sering dipakai. Baris ini hanya tampil jika ada warna seperti itu.
- `No color`.

Warna selalu solid: pemilih warna tidak memiliki kontrol transparansi, dan membuang transparansi apa pun yang dibawa nilai yang diketik atau ditempel.  
Membuka pemilih warna tidak mengubah apa pun, dan memilih warna yang sudah dimiliki pilihan tidak menambahkan langkah pembatalan.

`No color` menghapus warna semua tabel, memo, dan grup tabel yang dipilih dalam satu langkah pembatalan, lalu menutup pemilih warna. `Remove color`, tepat di bawah `Color` di menu konteks tabel, memo, dan grup tabel selama ada item yang dipilih yang memiliki warna, melakukan hal yang sama tanpa membuka pemilih warna.

Pemilih warna mengambil alih keyboard saat terbuka, dan `Tab` serta `Shift + Tab` berpindah secara melingkar di antara kontrolnya. Tombol panah menggerakkan area dan penggeser rona sebesar 1, atau 10 dengan `Shift`, dan berpindah dari satu contoh warna ke contoh warna lain, sambil menerapkan setiap warna yang dilewati.  
Selama keyboard berada di pemilih warna, Batalkan dan Ulangi, pintasan zoom, `Search`, dan `Toggle Explorer` tetap sampai ke editor, sedangkan pintasan editor lainnya tidak: pintasan [penghapusan](#table-and-memo-deletion) tidak menghapus apa pun, dan `Delete` serta `Backspace` hanya mengedit teks di kotak `Hex`, `R`, `G`, dan `B`.  
`Escape` menutup pemilih warna, begitu pula penekanan di kanvas di luar pemilih warna.  
Penekanan di [Penjelajah](./explorer.md) bukan penekanan di kanvas, sehingga pemilih warna tetap terbuka. Baris yang dipilih di sana mengubah pilihan, dan pemilihan warna berikutnya memberi warna pada pilihan yang baru.

## Opsi tampilan tabel {#table-view-options}

Menyediakan opsi tampilan berikut:

- Komentar tabel
- Komentar kolom
- Tipe data
- Domain
- Nilai default
- Tidak boleh NULL
- Unik
- Kunci alternatif
- Kenaikan otomatis
- Hubungan
- Tindakan referensial
- Grup tabel
- Memo

`Domain`, `Unique`, `Alternate Key`, dan `Auto Increment` nonaktif secara default, dan sisanya aktif.  
Nama yang ditampilkan tabel bukan opsi tampilan: `Name View`, tepat setelah `View Option` di menu konteks kanvas, memilih nama fisik, nama logis, atau keduanya — lihat [Mengganti tampilan](./logical-names.md#switching-the-view).  
`Domain` memberi setiap kolom sebuah sel, yang ditempatkan menurut [urutan kolom](./settings.md#adjusting-column-order), berisi nama domain yang ditautkan kolom tersebut. Kolom yang tidak tertaut ke domain mana pun yang tercantum di lembar `Domains` menampilkan placeholder `domain` di sana, dalam keadaan diredupkan. Sel ini tampil di ketiga tampilan. Selama `Domain` nonaktif, tampilan `Logical Names` justru menampilkan nama domain yang tertaut di sel tipe — lihat [Sel Domain](./logical-names.md#the-domain-cell).  
`Alternate Key` menandai kolom setiap kunci alternatif, misalnya `AK1.1` — lihat [Kunci alternatif](#alternate-keys).  
`Referential Actions` menampilkan label `D:` dan `U:` yang dipasang tindakan ON DELETE dan ON UPDATE suatu hubungan di ujung konektornya pada sisi tabel anak — lihat [Membaca konektor](./relationship-editing.md#reading-a-connector). Menonaktifkannya hanya menyembunyikan label tersebut dan tidak memindahkan tabel maupun konektor.  
`Table Groups` menampilkan [grup tabel](./table-groups.md) dan warna grup di header tabel-tabelnya. Menonaktifkannya menyembunyikan grup di kanvas, minimap, dan ekspor gambar, tidak memindahkan tabel apa pun, dan mempertahankan setiap tabel di grupnya — lihat [Menyembunyikan grup](./table-groups.md#hiding-groups). Opsi ini juga mengeluarkan folder `Table Groups` dari [Penjelajah](./explorer.md#the-tree) dan `New Table Group` dari [bilah alat kanvas](#canvas-toolbar), dan pencarian Penjelajah berhenti menemukan nama grup.  
`Memos` menampilkan memo. Menonaktifkannya menyembunyikan semua memo di kanvas, minimap, dan ekspor gambar, serta tidak memindahkan tabel maupun konektor. Memo yang tersembunyi tidak memakan ruang, sehingga bilah gulir, minimap, dan kompas `Go to content` tidak memperhitungkannya.  
Menyembunyikan memo membatalkan pilihannya dan menutup editor memo yang terbuka. [Penjelajah](./explorer.md#the-tree) menghilangkan folder `Memos`, dan pencarian [Temukan dan Ganti](./find-and-replace.md) di dalamnya serta `:` di Pencarian Cepat tidak mencari memo. Selama memo tersembunyi, `New Memo` hilang dari menu konteks, [bilah alat kanvas](#canvas-toolbar), Pencarian Cepat, dan [layar sambutan](./editing-start.md#welcome-screen), dan `Alt + M` tidak menambahkan memo. Penempelan atau [Impor dan Tambahkan](./file-import-export.md#import-and-add) tetap menambahkan memo yang dibawanya, dalam keadaan tersembunyi dan tidak dipilih.  
Di editor `readonly`, mengaktifkan atau menonaktifkan opsi ini tidak mengubah apa pun.

![Mengaktifkan dan menonaktifkan entri View Option sementara tampilan tabel menyesuaikan diri, menandai indeks unik komposit dengan AK1.1 dan AK1.2 melalui Alternate Key, lalu menonaktifkan dan mengaktifkan kembali Memos](/img/demo-view-options.webp)

Kartu di mode `Flow` pada tab Visualisasi tidak mengikuti opsi ini, termasuk `Domain`: kartu memakai [tampilan baris](./visualization.md#row-display) tersendiri dan menggambar konektornya bahkan saat `Relationship` nonaktif. Sel mana yang ditata kartu hanya bergantung pada Tampilan Nama — lihat [Nama pada kartu](./visualization.md#names-on-the-cards).

## Properti Tabel {#table-properties}

Membuka panel properti sebuah tabel.  
Mulai dari `Table Properties` di menu konteks tabel, yang membukanya untuk tabel yang Anda klik kanan, atau pilih tabel dan tekan `Alt + Space`.  
Panel terbuka di tengah kanvas yang diredupkan. Hanya kanvas yang diredupkan, sehingga [Penjelajah](./explorer.md#dialogs-beside-it) yang terbuka tetap terbuka dan dapat digunakan di sampingnya. Headernya berisi judul `Table Properties`, lima tabel yang paling baru dibuka sebagai chip dengan tabel saat ini disorot, dan tombol tutup. Setiap chip menamai tabelnya seperti yang dilakukan [Tampilan Nama](./logical-names.md#beyond-the-canvas). Klik chip untuk berpindah ke tabel itu tanpa membuka ulang panel.  
Di bawah header terdapat tiga tab: `Indexes`, `Schema SQL`, dan `Code Generator`. Panel mempertahankan satu ukuran untuk ketiganya, sehingga berpindah tab tidak memindahkan atau mengubah ukurannya.  
Tutup panel dengan tombol tutup, dengan `Escape`, atau dengan mengeklik di luar panel pada kanvas.  
Memilih baris selain folder di Penjelajah, atau menuju kecocokan dari pencariannya, menutup Properti Tabel sebelum lompatan. Begitu pula `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac), yang membuka pencarian Penjelajah, atau menempatkan kursor teks di kotak Temukan jika Penjelajah sudah terbuka. Klik lain apa pun di Penjelajah, termasuk pada baris folder, atau pada tombol `Explorer` di bilah alat, membiarkan Properti Tabel tetap terbuka. `Escape` yang ditekan selama keyboard berada di Penjelajah hanya mengembalikan keyboard ke kanvas, sehingga diperlukan `Escape` kedua untuk menutup Properti Tabel.

Tab `Indexes` dibahas di [Indeks](#indexes).  
Tab `Schema SQL` menampilkan DDL tabel untuk [database](#databases) yang dipilih: `CREATE TABLE`-nya, constraint terpisah yang ditulis beberapa database untuk kolom uniknya, dan indeksnya. Tab ini selalu menulis pernyataan `CREATE` biasa, tanpa pembuka, tanpa skrip sebelum atau setelah tabel, dan tanpa nama logis di komentar kosong, apa pun pengaturan tab [Skema SQL](./schema-sql.md) di bilah alat — lihat [Nama logis sebagai komentar](./schema-sql.md#logical-names-as-comments). Tab ini tidak memiliki panel opsi, dan menu konteksnya hanya menawarkan `Database` dan `Bracket`.  
Tab `Code Generator` menghasilkan kode hanya untuk tabel ini — lihat [Generator Kode](./code-generator.md).

Di editor `readonly`, panel tetap terbuka, dengan lencana `Read only` di samping judulnya, tetapi tab `Indexes` tidak menyediakan pengeditan apa pun.

## Memfokuskan tabel {#focusing-on-tables}

Membuka tab Visualisasi dalam mode `Flow`, dipersempit ke tabel yang dipilih dan setiap tabel yang berjarak satu hubungan darinya.  
Mulai dari menu konteks tabel dengan `Focus on this table`, atau pilih satu tabel atau lebih dan tekan `Alt + F`.  
Saat tabel yang Anda klik kanan merupakan salah satu dari beberapa tabel yang dipilih, item itu bertuliskan `Focus on selected tables` dan memfokuskan seluruh pilihan. Klik kanan pada tabel di luar pilihan hanya memfokuskan tabel itu.  
Pintasan ini mengambil tabel yang dipilih, mengabaikan memo, dan tidak melakukan apa pun jika tidak ada tabel yang dipilih.  
[Grup tabel](./table-groups.md) yang dipilih tidak dihitung di sini, baik pada pintasan maupun item menu: tabel-tabelnya hanya diambil jika tabel itu sendiri dipilih, seperti yang dilakukan `Select tables` di menu grup.  
Apa yang ditampilkan area pandang yang dipersempit, dan cara kembali ke seluruh diagram, dibahas di [Visualisasi](./visualization.md#focusing-on-tables), dan cara mundur dan maju melalui apa yang pernah ditampilkan Alur sebelumnya, di [Tabel sebelumnya dan berikutnya](./visualization.md#previous-table-and-next-table).

## Indeks {#indexes}

Indeks didefinisikan di tab `Indexes` pada panel Properti Tabel dan disertakan dalam Skema SQL yang diekspor.

Sisi kiri mencantumkan kunci dan indeks tabel dalam dua kelompok.  
`Keys`, yang tampil jika tabel memilikinya, mencantumkan kunci yang dideklarasikan kolomnya: `PK_<table name>` atas kolom yang ditandai PK, lalu `UQ_<table name>_<column name>` untuk setiap kolom yang ditandai Unik, sesuai urutan kolom. Nama-nama ini adalah nama fisik yang ditulis Skema SQL database yang dipilih, apa pun Tampilan Nama yang berlaku, sehingga dengan `Bracket` pada `None`, tabel berkualifikasi skema seperti `sales.users` mencantumkan `PK_users` di semua database kecuali Databricks dan Snowflake — lihat [Nama tabel berkualifikasi skema](./schema-sql.md#schema-qualified-table-names). Masing-masing diberi tag `PK` atau `UQ` dan ditandai dengan gembok. Kunci ini hanya baca di sini dan hanya berubah mengikuti penanda [PK](./table-editing.md#column-primary-key) dan [Unik](./table-editing.md#not-null-unique-auto-increment) pada kolom.  
`Indexes` mencantumkan indeks tabel sesuai urutan penambahannya. Setiap indeks memiliki sakelar `UQ` yang menjadikannya unik, kotak nama, dan `x` yang menghapusnya. Indeks yang merupakan [kunci alternatif](#alternate-keys) juga menampilkan nomornya, misalnya `AK1`. Tambahkan indeks dengan `Add Index` di bagian bawah daftar.

Sisi kanan mencantumkan kolom tabel di bawah `Columns`, masing-masing dengan kotak centang. Setiap baris menampilkan sel yang sama dengan baris kolom tersebut di kanvas, mengikuti urutan kolom, opsi tampilan, dan [Tampilan Nama](./logical-names.md#beyond-the-canvas). Tidak ada yang dapat diedit hingga sebuah indeks dipilih di sisi kiri.  
Centang kolom untuk menambahkannya ke indeks yang dipilih, dan hapus centangnya untuk mengeluarkannya. Memilih kunci menampilkan kolomnya dalam keadaan tercentang, tetapi kotak centangnya tetap nonaktif.  
Kolom indeks yang dipilih dicantumkan di bawahnya, pada `Index order`, masing-masing dinamai seperti cara Tampilan Nama menamainya, dengan nama di dalam tanda kurung setelah nama logis dalam tampilan `Both Names`, misalnya `Member Number (member_no)`. Seret kolom melalui pegangan seretnya untuk mengubah urutannya, dan klik chip `ASC` atau `DESC` pada baris untuk membalik arah pengurutannya. Pada kunci alternatif, setiap baris diakhiri dengan tandanya, `AK<n>.<m>`. Daftar ini menampilkan tiga baris sekaligus dan sisanya dapat digulir.

Di editor `readonly`, memilih kunci atau indeks tetap menampilkan kolomnya, tetapi tidak ada `Add Index` dan tidak ada `x`, dan tidak ada hal lain di tab ini yang dapat diubah.

[Penjelajah](./explorer.md#the-tree) mencantumkan indeks setiap tabel di folder `Indexes` tabel tersebut, dan memilih salah satunya di sana menuju tabelnya. Pencariannya juga menemukan nama indeks, dan dapat mengganti namanya — lihat [Apa yang dicari](./find-and-replace.md#what-it-searches).

![Membuka Properti Tabel pada orders, tempat tab Indexes mencantumkan kunci PK dan UQ di atas indeks, lalu menambahkan indeks atas member_id dan ordered_at DESC dan membacanya kembali di tab Schema SQL](/img/demo-table-properties.webp)

## Kunci alternatif {#alternate-keys}

Kunci alternatif adalah indeks unik atas dua kolom atau lebih: indeks di tab `Indexes` dengan sakelar `UQ` aktif dan setidaknya dua kolom tabel dicentang.  
Indeks unik atas satu kolom tidak menyatakan lebih dari penanda Unik kolom tersebut, sehingga bukan kunci alternatif, begitu pula indeks biasa, kunci utama, atau kolom yang ditandai Unik.

Dengan `Alternate Key` diaktifkan di [opsi tampilan](#table-view-options), diagram menandai kolom setiap kunci alternatif seperti cara erwin dan IDEF1X menuliskannya: `AK1.1`, `AK1.2`, dan seterusnya. Opsi ini nonaktif secara default.

Kunci diberi nomor berdasarkan letak kolomnya di tabel, bukan berdasarkan urutan penambahan indeks. Kunci yang kolom pertamanya di `Index order` berada paling atas di tabel adalah `AK1`. Jika posisinya sama, kolom berikutnya dari setiap kunci yang menentukan, dan kunci yang merupakan bagian awal dari kunci yang lebih panjang ditempatkan sebelum kunci itu.  
Memindahkan kolom di dalam tabel, atau mengubah urutan `Index order` suatu kunci, dapat mengubah penomoran kunci. Membatalkan penghapusan kunci mengembalikan nomornya, dan setiap kolaborator melihat nomor yang sama.

Setiap kolom suatu kunci ditandai `AK<n>.<m>`, dengan `n` adalah nomor kunci dan `m` posisi kolom di `Index order` kunci tersebut. Kolom yang termasuk dalam beberapa kunci membawa semua tandanya, digabungkan dengan koma.  
Misalnya, pada tabel dengan kolom `a`, `b`, dan `c`, indeks unik atas (`c`, `a`) dan (`b`, `a`) menjadi `AK1` = (`b`, `a`) dan `AK2` = (`c`, `a`), karena `b` berada di atas `c`. Jadi `b` bertuliskan `AK1.1`, `c` bertuliskan `AK2.1`, dan `a` bertuliskan `AK1.2,AK2.2`.

Tanda ini digambar paling akhir di baris, setelah sel mana pun yang ditempatkan terakhir oleh [urutan kolom](./settings.md#adjusting-column-order). Tanda ini bukan sel, sehingga tidak pernah difokuskan, diedit, atau disalin — lihat [Pengeditan tabel](./table-editing.md).  
Kolom kunci utama atau kunci asing juga dapat membawa tanda AK, karena tanda ini tidak menggantikan apa pun: ikon kunci di awal baris tetap menampilkan PK dan FK, dan sel Unik tetap memiliki `UQ` sendiri.  
Tabel yang memiliki kunci alternatif menyisakan ruang setelah sel terakhir setiap baris untuk tandanya yang terpanjang; tabel tanpa kunci alternatif mempertahankan lebarnya.  
Tanda ini tampil di kanvas ERD, tempat tabel yang menciut menjadi namanya pada `70%` ke bawah tidak menampilkan tanda apa pun, dan dalam [ekspor gambar](./file-import-export.md#image), yang menggambar setiap tabel secara utuh berapa pun tingkat zoom. [Pratinjau saat penunjuk diarahkan](./visualization.md#hover-preview) di tab Visualisasi dalam mode `Graph` juga menampilkannya; kartu `Flow` tidak pernah menampilkannya.

Tab `Indexes` menampilkan nomor tersebut, baik opsi ini aktif maupun tidak — lihat [Indeks](#indexes).

## Tata Letak Otomatis {#auto-layout}

Menata semua tabel di kanvas untuk Anda.  
Buka `Auto Layout` dari menu konteks kanvas atau dari Pencarian Cepat, lalu pilih salah satu dari empat tata letak:

| Tata letak | Yang digambarkannya |
| --- | --- |
| `Force` | Simulasi: hubungan menarik tabel agar saling mendekat, tabel yang bertetangga saling mendorong menjauh, dan tabel yang bertumpukan terpisah satu sama lain. |
| `Flow` | Dari kiri ke kanan mengikuti hubungan, dengan setiap konektor mendapat titik sentuhnya sendiri pada tabel. Tata letak ini berusaha menjaga persilangan tetap sedikit, tetapi dapat menyisakan beberapa persilangan yang akan dihindari tata letak lain. |
| `Tree - vertical` | Berlapis ke bawah: tabel induk berada di atas tabel yang membawa kunci asing ke tabel induk itu. |
| `Tree - horizontal` | Pelapisan yang sama, berjalan dari kiri ke kanan. |

`Force` membuka pratinjau selama tata letak menuju keadaan stabil, dengan `Apply` dan `Cancel` pada pemberitahuan yang ditampilkannya.  
Pratinjau dibingkai pada diagram sebagaimana keadaannya saat tata letak dimulai, sehingga tabel dapat bergerak keluar dari bingkai selama tata letak menuju keadaan stabil. Pratinjau digambar pada `70%` atau kurang, sehingga tabelnya tampil menciut menjadi nama dan tepi warnanya. Pratinjau dibuka dalam Tampilan Nama yang sedang Anda lihat, apa pun tampilan yang dipertahankan file — lihat [Di luar kanvas](./logical-names.md#beyond-the-canvas).  
`Apply` mempertahankan posisi sebagaimana adanya saat itu, dan tata letak diterapkan dengan sendirinya setelah berhenti bergerak. `Cancel` atau `Escape` membiarkan diagram seperti semula.

Tiga tata letak lainnya dihitung sekaligus, di luar thread utama, sehingga tidak ada yang perlu diamati: pemberitahuan tampil selama tata letak dihitung, dan susunan yang selesai dipusatkan pada area yang sudah ditempati diagram. `Cancel` atau `Escape` membuang tata letak yang tidak lagi Anda tunggu, dan host yang tidak menjalankan shared worker berakhir dengan `Could not place tables` — lihat [Web Worker](../../api/installation.md#web-workers). Tata letak yang belum kembali dalam 60 detik berakhir dengan cara yang sama.

Apa pun yang Anda pilih, tabel dan grup tabel dipindahkan, sedangkan memo tetap di tempatnya. Tabel ditempatkan dengan lebar yang dimilikinya dalam Tampilan Nama yang sedang Anda lihat. Hubungan dari suatu tabel ke dirinya sendiri diabaikan, dan beberapa hubungan antara dua tabel yang sama dihitung satu kali.  
Setiap tata letak menjaga tabel setiap grup tetap bersama, baik grup ditampilkan maupun tidak, dan menyesuaikan setiap grup yang berisi tabel agar melingkupi tabel-tabelnya — lihat [Grup tabel](./table-groups.md#auto-layout).  
Hasilnya tercatat sebagai satu entri riwayat, sehingga satu kali pembatalan mengembalikan setiap tabel dan grup ke tempat semula.

![Merapikan tumpukan tabel dengan Tata Letak Otomatis Flow dari menu konteks kanvas, yang menjajarkannya dari kiri ke kanan mengikuti hubungannya](/img/demo-automatic-table-placement.webp)

## Database {#databases}

Database yang didukung meliputi:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Pilih salah satu dari `Database` di menu konteks kanvas, di panel opsi atau menu konteks tab Skema SQL dan Generator Kode, atau di Pencarian Cepat. Semuanya mengubah pengaturan yang sama.

Opsi ini menentukan sintaksis Skema SQL untuk ekspor, pelengkapan otomatis tipe data, dan tipe yang digunakan oleh kode yang dihasilkan dan skema yang diimpor.  
Opsi ini menentukan pilihan `Statements` dan `Header` mana yang dapat ditulis tab [Skema SQL](./schema-sql.md#options-panel). Pilihan yang tidak dimiliki database tetap ada di panel opsi, dalam keadaan redup, dan SQL beralih ke pilihan terdekat yang dimiliki database itu.  
Opsi ini juga menentukan tindakan ON DELETE dan ON UPDATE mana yang ditulis Skema SQL dan target ORM Generator Kode, dan mana yang ditandai `not in <database>` oleh menu hubungan — lihat [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update) dan [Generator Kode](./code-generator.md#database).  
Impor Skema SQL mempertahankan tipe data kolom, termasuk daftar argumennya, baik tercantum di editor maupun tidak, misalnya `TIMESTAMP WITH TIME ZONE`, `public.mood`, atau `integer[]` — lihat [Tipe data](./file-import-export.md#data-types). Pelengkapan otomatis tipe data hanya menyarankan tipe yang tercantum untuk database yang dipilih.

![Mengganti database ke PostgreSQL, lalu memilih tipe PostgreSQL di pelengkapan otomatis](/img/demo-database.webp)

![Pelengkapan otomatis tipe data dengan pencocokan fuzzy, dinavigasi dengan tombol panah dan diterima dengan Right, Tab, atau Enter](/img/demo-data-type-autocomplete.webp)

## Bilah alat kanvas {#canvas-toolbar}

Bilah alat kecil melayang di tengah tepi bawah kanvas, berisi, dari kiri ke kanan, alat yang bekerja pada kanvas itu sendiri dan perintah yang menambahkan sesuatu ke kanvas:

- Tangan dan alat penunjuk. Alat penunjuk adalah default; tangan mengubah setiap seretan menjadi penggeseran, di atas tabel maupun ruang kosong. `Space` beralih di antara keduanya. Selama penggambaran [`New Table Group`](./table-groups.md#drawing-a-group) dalam keadaan siap, yang ditandai adalah tombol `New Table Group`, bukan salah satu dari keduanya, dan mengeklik salah satu dari keduanya, menekan `Space`, atau memilih notasi hubungan mengakhiri penggambaran tanpa menambahkan grup.
- `New Table`, `New Memo`, dan `New Table Group`. `New Table` menambahkan tabel seperti `Alt + N`, dan `New Memo` menambahkan memo seperti `Alt + M`. `New Table Group` menyiapkan [penggambaran grup](./table-groups.md#drawing-a-group) seperti `Alt + G` dan menonaktifkan tangan; klik kedua, seperti `Alt + G` kedua, mengakhiri penggambaran tanpa menambahkan grup. `New Memo` tidak ditampilkan selama View Option → `Memos` menyembunyikan memo, begitu pula `New Table Group` selama View Option → `Table Groups` menyembunyikan grup. Editor `readonly` tidak menampilkan satu pun dari ketiganya.
- Zoom: `Zoom out`, zoom saat ini dalam persentase, dan `Zoom in`. Kedua tombol mengubah zoom secara bertahap dengan cara yang sama seperti pintasan zoom, dan mengeklik persentase mengembalikannya ke `100%`.
- Empat notasi hubungan, sama dengan empat notasi yang Anda gunakan untuk memulai hubungan — lihat [Memulai pengeditan](./editing-start.md). Memilih salah satunya beralih kembali ke alat penunjuk, karena hubungan digambar dengan mengeklik dua tabel.
- `Name View`, tombol dengan panah ke bawah yang menyebutkan tampilan yang sedang berlaku: `Physical Names`, `Logical Names`, atau `Both Names`. Lebarnya tetap sama, tampilan mana pun yang disebutkannya, sehingga penggantian tidak pernah menggeser bilah alat. Klik membuka daftar ketiga tampilan tersebut di atas bilah alat, dengan tampilan yang sedang berlaku dicentang. Memilih salah satunya beralih ke tampilan itu dan menutup daftar; klik kedua pada tombol, tekanan di tempat lain mana pun, atau `Escape` menutup daftar tanpa mengganti tampilan. Editor `readonly` juga menampilkannya. Apa yang ditampilkan setiap tampilan dibahas di [Tampilan Nama](./logical-names.md#name-view), dan apakah penggantian disimpan dibahas di [Mengganti tampilan](./logical-names.md#switching-the-view).
- Mode Zen, `Alt + Z`, yang menyembunyikan semuanya kecuali kanvas dan bilah alat ini. `Alt + Z` sekali lagi, atau tombolnya, memunculkan kembali sisanya. Penjelajah yang terbuka ikut disembunyikan bersama sisanya, tanpa ditutup, dan muncul kembali bersamanya. Penjelajah tetap dapat dibuka selama mode Zen — lihat [Saat Penjelajah menyingkir](./explorer.md#when-it-stands-aside).
- Kompas `Go to content`, yang muncul di ujung bilah alat hanya selama tidak ada tabel, memo yang ditampilkan, atau grup tabel yang ditampilkan di layar — lihat [Navigasi di kanvas](#getting-around-the-canvas).

Setiap tombol yang memiliki pintasan menyebutkannya di tooltip, misalnya `New Table (Alt + N)` (Windows/Linux) atau `New Table (⌥ + N)` (Mac).  
Bilah alat menyingkir selama pratinjau Tata Letak Otomatis `Force`, Properti Tabel, Perjalanan Waktu, atau Penampil Perbedaan terbuka, dan kembali setelah ditutup.

![Menambahkan tabel dan memo dari bilah alat, menyiapkan dan membatalkan New Table Group, menggeser dengan tangan, mengubah zoom secara bertahap, dan mengaktifkan atau menonaktifkan mode Zen dengan ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Perbesar/perkecil {#zoom-inout}

Melakukan zoom dengan `Ctrl + Wheel` (Windows/Linux) atau `⌘ + Wheel` (Mac). Roda mouse saja menggeser kanvas.  
Gerakan cubit di trackpad juga melakukan zoom, berpusat pada titik tempat Anda mencubit, begitu pula dua jari di layar sentuh, yang juga menggeser kanvas saat bergerak.  
Pintasan: `Ctrl + Plus` (Windows/Linux) atau `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) atau `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) atau `⌘ + 0` (Mac) langsung kembali ke `100%`, dengan bagian tengah layar tetap di tempatnya.

Tombol `Zoom out` dan `Zoom in` di [bilah alat kanvas](#canvas-toolbar) mengubah zoom secara bertahap seperti pintasan `Minus` dan `Plus`: setiap penekanan mengubahnya sebesar 4 poin persentase, dengan bagian tengah layar tetap di tempatnya. Persentase di antara keduanya menampilkan zoom saat ini, dan mengekliknya langsung kembali ke `100%` seperti `Ctrl + 0` (Windows/Linux) atau `⌘ + 0` (Mac).

Rentang zoom dari `10%` hingga `150%`.  
Pada `70%` ke bawah, tabel menciut menjadi nama dan tepi warnanya, dan pengeditan sel, pintasan sel, serta salin dan tempel berhenti berfungsi hingga Anda memperbesar kembali. Nama yang ditampilkan tabel yang menciut mengikuti Tampilan Nama — lihat [Tampilan Nama](./logical-names.md#name-view).

Tiga pintasan yang sama juga melakukan zoom di tab Visualisasi, baik dalam mode `Graph` maupun `Flow`, masing-masing mode dalam rentangnya sendiri — lihat [Visualisasi](./visualization.md#toolbar).

![Memperkecil dengan ⌘ + Wheel hingga tabel menciut menjadi namanya, lalu kembali secara bertahap dengan ⌘ + Plus, ⌘ + Minus, dan ⌘ + 0](/img/demo-zoom.webp)

## Navigasi di kanvas {#getting-around-the-canvas}

Kanvas tidak memiliki tepi dan tidak memiliki ukuran yang perlu diatur. Tabel dan memo berada di mana pun Anda menaruhnya, dan semua yang dijelaskan di bawah ini menggambarkan diagram, bukan halaman berukuran tetap.

Seret area kosong kanvas untuk menggeser, atau beralih ke alat tangan dengan `Space` lalu seret di mana saja, termasuk di atas tabel. Roda mouse juga menggeser, dan `Shift + Wheel` menggeser ke samping.  
Badan [grup tabel](./table-groups.md#selecting-groups), yaitu area di bawah bilah judulnya, dianggap sebagai kanvas kosong oleh tombol kiri: menyeretnya menggeser kanvas, `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac) menggambar kotak seleksi, dan klik mengosongkan pilihan.  
Penggeseran tidak memiliki batas: roda mouse, seretan, dan alat tangan membawa area pandang sejauh apa pun Anda menggerakkannya, melewati tabel di sisi mana pun.

Seret dengan tombol tengah mouse (tekan roda mouse) untuk menggeser dari mana saja di kanvas, baik dengan alat penunjuk maupun tangan. Cara ini berfungsi bahkan saat penekanan mengenai tabel, memo, sel, ikon, atau hubungan.  
Seretan tombol tengah tidak memilih, memindahkan, atau mengeklik apa pun, dan mempertahankan pilihan. Seretan ini menutup menu konteks yang terbuka dan pemilih warna, dan guliran serta penempelan klik tengah bawaan browser tidak dimulai.  
Penekanan tombol tengah pada bilah gulir, minimap, bilah alat kanvas, atau editor sel atau memo yang terbuka tidak menggeser.

Minimap di sudut kanan atas memetakan diagram dengan ruang selebar satu layar di setiap sisinya, yaitu jangkauan bilah gulir, yang dibulatkan ke luar mengikuti grid kasar, sehingga makin jauh Anda memperkecil, makin kecil diagram di dalamnya. Klik minimap untuk memindahkan area pandang ke titik itu, atau seret persegi area pandang untuk menggeser. Saat Anda memperkecil, persegi area pandang membesar untuk mencakup lebih banyak bagian peta.  
Minimap menggambar setiap tabel dengan warna tabel itu, dan setiap grup tabel yang ditampilkan sebagai kotak dengan warna grup di belakang tabel-tabelnya.  
Bilah gulir di sepanjang tepi kanan dan bawah menggambarkan jangkauan yang sama, yang membentang dari diagram yang berada tepat di luar satu sisi layar hingga tepat di luar sisi lainnya, sehingga jangkauan ini setidaknya satu layar lebih panjang daripada diagram yang digambar, dan lebih panjang lagi selama area pandang berada melewatinya. Di luar mode Zen, kedua bilah gulir tampil setiap kali dokumen berisi tabel, memo yang ditampilkan, atau grup tabel yang ditampilkan, bahkan saat semuanya muat di layar. Dokumen tanpa satu pun dari hal tersebut, misalnya dokumen yang satu-satunya memonya disembunyikan dengan View Option → `Memos`, tidak menampilkan kedua bilah gulir maupun minimap.  
Menyeret kenop bilah gulir atau persegi area pandang minimap adalah satu-satunya penggeseran yang berhenti: penggeseran ini tidak melampaui tabel yang berada tepat di luar layar, atau tempat seretan dimulai jika tempat itu lebih jauh di luar.

Jika penggeseran membuat tidak ada tabel, memo yang ditampilkan, atau grup tabel yang ditampilkan di layar, kompas `Go to content` muncul di ujung [bilah alat kanvas](#canvas-toolbar), dengan panah yang menunjuk ke objek terdekat beserta jaraknya. Klik kompas untuk memusatkan objek itu tanpa mengubah zoom.

![Menggeser dengan menyeret kanvas kosong, dengan roda mouse, dengan seretan tombol tengah di atas tabel, dan dari minimap, lalu Shift + wheel melewati konten dan kembali dengan mengikuti kompas Go to content](/img/demo-canvas-navigation.webp)

### Tempat lompatan berakhir {#where-a-jump-lands}

Setiap perpindahan yang membawa Anda ke sesuatu di kanvas menggerakkan area pandang dengan satu aturan: hasil `#`, `@`, dan `:` dari [Pencarian Cepat](./quick-search.md#searching-the-diagram), baris di [Penjelajah](./explorer.md#going-to-a-row) dan kecocokan pencarian [Temukan dan Ganti](./find-and-replace.md#going-to-a-match) di dalamnya, baris di daftar [Penampil Perbedaan](#going-to-a-change), [tombol kartu](./visualization.md#card-buttons) tautan eksternal di Alur, pemeriksaan yang menyebut tabel atau kolom di [lembar Pemeriksaan](./dictionary.md#the-checks-sheet) di tab Kamus, dan penempatan hasil [Impor dan Tambahkan](./file-import-export.md#import-and-add). Setiap bagian tersebut menjelaskan apa yang dipilih oleh perpindahan itu; bagian ini menjelaskan ke mana area pandang bergerak.

Lompatan tidak pernah mengubah zoom, dan paling banyak melakukan satu guliran. Dari tab lain, lompatan beralih ke tab ERD terlebih dahulu.  
Lompatan mengukur kanvas sebagaimana yang tampil: di bawah bilah alat atas, atau seluruh tingginya dalam mode Zen, dan di sebelah kanan Penjelajah yang terbuka, yang mempersempit kanvas alih-alih menutupinya.

Arah horizontal dan vertikal dinilai secara terpisah, dan arah tempat target sudah tampil dengan baik dibiarkan persis seperti semula:

- Target yang panjangnya tidak lebih dari separuh kanvas pada arah itu tetap di tempatnya selama bagian tengahnya berada di separuh tengah kanvas, antara titik seperempat dan tiga perempat secara horizontal, atau vertikal. Jika tidak, bagian tengahnya dibawa ke tengah kanvas.
- Target yang lebih panjang tetapi masih muat dengan sisa `40px` di setiap ujungnya tetap di tempatnya selama seluruhnya terlihat. Jika tidak, secara horizontal target dipusatkan; secara vertikal, bagian atasnya dibawa ke `40px` di bawah bagian atas kanvas.
- Target yang lebih panjang dari itu tetap di tempatnya selama seluruhnya terlihat, atau, jika lebih panjang daripada kanvas, selama bagian intinya, yang dicantumkan di bawah, terlihat. Jika tidak, target dipusatkan jika muat, atau jika tidak, ditempatkan sedekat mungkin ke tengah dengan tetap menjaga kedua ujung bagian intinya setidaknya `40px` di dalam kanvas; bagian inti yang terlalu panjang untuk itu dijaga agar awalnya tetap `40px` di dalam.

Jadi, tabel kecil di dekat tepi kiri kanvas, di pertengahan tinggi kanvas, hanya bergerak secara horizontal.

Apa yang ditampilkan lompatan di layar, dan bagian inti yang harus tampil jika keseluruhannya tidak muat:

- Tabel: seluruh tabel, berpatokan pada pita nama di bagian atasnya, atau pada sel komentarnya untuk kecocokan komentar tabel selama View Option → `Table Comment` menampilkan komentar. Pada `70%` ke bawah, tempat tabel menciut menjadi namanya, berpatokan pada nama di tengah kotak.
- Kolom: barisnya, berpatokan pada sel yang dituju lompatan: namanya, nama logisnya untuk kecocokan nama logis atau pemeriksaan pada nama logis, sel Domain miliknya untuk pemeriksaan pada domainnya, atau komentar tempat kecocokan berada selama View Option → `Column Comment` menampilkan komentar. Jika baris tidak menampilkan sel tersebut, lompatan menuju sel yang ditampilkan di tempatnya: nama logis untuk nama dalam tampilan `Logical Names`, nama untuk nama logis dalam tampilan `Physical Names`, dan sel tipe untuk sel Domain selama View Option → `Domain` nonaktif, atau baris secara keseluruhan selama `DataType` juga nonaktif. Pada `70%` ke bawah, kolom menampilkan tabelnya di layar menurut aturan tabel.
- Sel yang terlalu lebar untuk ditampilkan utuh, misalnya komentar panjang: berpatokan pada teks yang cocok di dalamnya. Lompatan ke sel yang ditampilkan sebagai pengganti sel tempat kecocokan berada, misalnya nama untuk kecocokan nama logis dalam tampilan `Physical Names`, tidak berpatokan pada teks.
- Hubungan: kotak yang membentang meliputi kedua tabelnya, berpatokan pada tabel anak.
- Grup tabel: kotaknya, berpatokan pada bilah judulnya.
- Memo, atau blok yang ditempatkan Impor dan Tambahkan: seluruhnya.

Jika tidak ada arah yang perlu bergerak, tidak ada guliran, sehingga menuju tempat yang sama dua kali berturut-turut tidak menggerakkan apa pun pada kali kedua. Lompatan yang menggulir kanvas mencatat guliran itu di [riwayat pembatalan](./undo-redo.md#what-the-history-records) seperti perubahan posisi area pandang lainnya, dan lompatan yang tidak menggerakkan apa pun tidak meninggalkan apa pun untuk dibatalkan. Untuk Impor dan Tambahkan, guliran merupakan bagian dari langkah yang sama dengan penambahan. Baris di daftar Penampil Perbedaan hanya menggerakkan sisi-sisi hanya baca milik Penampil Perbedaan, sehingga tidak mencatat apa pun.  
Tidak ada lompatan yang memulai atau menyelesaikan hubungan yang sedang digambar. Kompas `Go to content` bukan lompatan: kompas ini memusatkan apa yang ditunjuknya.

## Penampil Perbedaan {#diff-viewer}

Anda dapat membandingkan dokumen yang disimpan sebelumnya dengan dokumen saat ini.  
Pilih `Diff Viewer` dari menu konteks kanvas, lalu pilih dokumen `.json` yang Anda ekspor sebelumnya.

Penampil Perbedaan terbuka di atas kanvas: apa yang berubah di sebelah kiri, lalu dokumen yang disimpan dan dokumen saat ini berdampingan.  
Dokumen saat ini dibandingkan sebagaimana keadaannya saat penampil terbuka; perubahan yang dibuat setelahnya, termasuk dari kolaborator, tidak sampai ke penampil. Kedua sisi dibuka, dan tetap, dalam Tampilan Nama yang sedang Anda lihat, apa pun tampilan yang dipertahankan masing-masing file — lihat [Di luar kanvas](./logical-names.md#beyond-the-canvas). [Penjelajah](./explorer.md#when-it-stands-aside) yang terbuka disembunyikan selama penampil terbuka, sehingga penampil memakai seluruh lebar editor.  
Setiap sisi digeser dengan roda mouse, dengan menyeret area kosong atau badan grup tabel, atau dengan menyeret menggunakan tombol tengah di mana saja di atasnya, dan di-zoom dengan `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac), atau gerakan cubit. Pada `70%` ke bawah, tabelnya menciut seperti di kanvas — lihat [Tanda di kedua sisi](#marks-on-the-two-sides).  
Kedua sisi hanya baca, sehingga tidak ada yang diubah di dokumen Anda. Masing-masing mempertahankan pilihannya sendiri, dan klik pada tabel di sana memilihnya hanya di sisi itu.  
Tutup penampil dengan tombol `Close` pada pemberitahuan `Diff Viewer` yang muncul saat penampil dibuka, atau dengan `Escape`.

![Membuka Penampil Perbedaan pada file .json yang disimpan, mengeklik baris bertanda A, M, D, dan R di pohonnya, menyaring menurut nama, lalu menutupnya](/img/demo-diff-viewer.webp)

### Apa yang dibandingkan {#what-is-compared}

Tabel, kolom, indeks, kunci asing, memo, dan grup tabel semuanya dibandingkan.  
Setiap item dipasangkan terlebih dahulu berdasarkan id-nya, sehingga terhadap versi sebelumnya dari file yang sama, yang mempertahankan id, tabel, kolom, indeks, atau grup tabel yang diganti namanya tetap menjadi satu item, yang dicantumkan sebagai diganti nama.  
Sisanya dipasangkan satu lawan satu berdasarkan apa yang dipertahankannya: tabel atau grup tabel berdasarkan namanya, termasuk huruf besar-kecilnya; kolom atau indeks berdasarkan tabel dan namanya; kunci asing berdasarkan kedua tabelnya dan pasangan kolomnya; dan memo berdasarkan teksnya, lalu posisinya. Indeks tanpa nama dipasangkan berdasarkan kolomnya, urutan dan arahnya, serta apakah indeks itu unik, dan grup tabel tanpa nama berdasarkan tabel bersama yang paling banyak.  
Jadi, terhadap file dari tempat lain, misalnya diagram yang dibangun ulang melalui impor SQL, tabel yang diganti namanya tampil sebagai satu tabel yang dihapus dan satu tabel yang ditambahkan.

Yang dihitung sebagai perubahan:

- Tabel: nama, komentar, grup tabel, posisi, dan warnanya.
- Kolom: nama, komentar, tipe data, nilai default, Kenaikan otomatis, kunci utama, Unik, Tidak boleh NULL, dan posisinya di tabel. Hanya kolom di luar urutan yang sama-sama dimiliki kedua dokumen yang dihitung sebagai dipindahkan, sehingga menambahkan, menghapus, atau memindahkan satu kolom tidak menandai kolom lainnya.
- Indeks: nama, UNIQUE, dan kolomnya, beserta urutan dan arahnya.
- Kunci asing: pasangan kolom, tipe hubungan, serta tindakan ON DELETE dan ON UPDATE-nya.
- Memo: teks, posisi, ukuran, dan warnanya.
- Grup tabel: nama, tabel yang dikandungnya, warna, posisi, dan ukurannya.

Jadi, tabel, memo, atau grup yang hanya dipindahkan, diubah ukurannya, atau diubah warnanya dihitung sebagai berubah. Posisi dan ukuran dibandingkan dalam piksel bulat, dan urutan tumpukan serta titik pertemuan konektor dengan tabel tidak pernah dihitung.  
Nama logis, tautan domain, serta kata, istilah, dan domain di tab [Kamus](./dictionary.md) tidak dibandingkan, sehingga perubahan yang hanya mengenai hal-hal tersebut tidak dicantumkan maupun ditandai. Tipe data yang diubah oleh domain tetap dihitung, sebagai perubahan tipe data kolom.

### Pohon perubahan {#the-change-tree}

Daftar di sebelah kiri digambar seperti [pohon Penjelajah](./explorer.md#the-tree) dan hanya berisi apa yang berubah: `Tables`, `Table Groups`, dan `Memos`, masing-masing hanya tampil jika berisi baris, dan di bawah tabel, `Columns`, `Indexes`, dan `Foreign Keys` milik tabel itu. Kunci asing dicantumkan di bawah tabel anaknya, dan tabel yang ditambahkan atau dihapus tidak mencantumkan apa pun di dalamnya.  
Setiap folder menampilkan jumlah baris yang dikandungnya, dan setiap folder dan tabel mulai dalam keadaan terbentang.  
Baris tabel atau kolom dinamai dalam Tampilan Nama tempat kedua sisi dibuka. Dalam tampilan `Both Names`, baris bertuliskan nama logis diikuti nama dalam warna redup, dan pada baris yang dihapus, nama yang redup itu ikut dicoret bersama bagian lainnya. Tabel dan grup tabel dicantumkan menurut nama, tanpa membedakan huruf besar dan kecil, apa pun tampilannya. Memo, serta kolom, indeks, dan kunci asing suatu tabel, mengikuti urutan dokumen saat ini, dengan item yang dihapus dikembalikan ke tempat asalnya. Baris memo bertuliskan baris pertama memo, dan baris kunci asing bertuliskan kolom anaknya, lalu `→` dengan tabel induk dan kolomnya, misalnya `user_id → users(id)`. Nama kosong bertuliskan `unnamed` dalam huruf miring.

Setiap baris diakhiri sebuah huruf, dan baris bertanda `A`, `D`, `M`, atau `R` menampilkan namanya dengan warna huruf tersebut:

- `A`, ditambahkan, berwarna hijau: hanya ada di dokumen saat ini.
- `D`, dihapus, berwarna merah dan dicoret: hanya ada di dokumen yang disimpan.
- `M`, diubah, berwarna ambar: ada di keduanya, berubah.
- `R`, diganti nama, berwarna biru: ada di keduanya, dengan nama baru. Penggantian nama mengungguli perubahan lain apa pun, yang tetap dicantumkan di tooltip.
- `~`, berwarna ambar, mengakhiri setiap folder dan tabel yang dicantumkan hanya karena ada yang berubah di dalamnya; namanya tetap berwarna seperti biasa.

Arahkan penunjuk ke nama baris untuk melihat tooltipnya: statusnya, `Added`, `Deleted`, `Modified`, `Renamed`, atau `Changed inside`, lalu satu baris per perubahan, misalnya `Name: users → members` atau `NN: ✗ → ✓`. Teks dikutip dari baris pertamanya, dipotong setelah 40 karakter, dan nilai kosong bertuliskan `—`. Tooltip item yang ditambahkan atau dihapus hanya berisi statusnya.

`Filter by name`, di atas pohon, mempertahankan baris yang nama saat ini atau nama tersimpannya, atau nama logis saat ini atau nama logis tersimpannya, mengandung apa yang Anda ketik, tanpa membedakan huruf besar dan kecil, di Tampilan Nama mana pun. Tabel yang namanya cocok mempertahankan semua barisnya, dan tabel yang namanya tidak cocok tetap ada dengan hanya baris yang cocok. Filter yang tidak cocok dengan apa pun membuat pohon kosong.  
Jika kedua dokumen sama sekali tidak berbeda, pohon bertuliskan `No changes`.

Seret tepi kanan pohon untuk melebarkan atau menyempitkannya, dari `200px` hingga `480px`, dan klik dua kali tepi tersebut untuk mengembalikannya ke `260px`. Setiap perbandingan dibuka pada `260px`, dan kedua sisi membagi sisa lebar secara merata.  
Keyboard bergerak di pohon ini seperti di pohon Penjelajah — lihat [Tombol di Penjelajah](./explorer.md#keys-in-the-explorer) — tetapi di sini `Escape`, di pohon atau di `Filter by name`, menutup penampil.

### Menuju perubahan {#going-to-a-change}

Klik baris, atau tekan `Enter` atau `Space` saat keyboard berada di baris itu, untuk menuju itemnya di setiap sisi yang memilikinya: item yang ditambahkan hanya di sisi saat ini, item yang dihapus hanya di sisi tersimpan, dan apa pun yang dimiliki keduanya di kedua sisi. Baris folder hanya menciutkan atau membentangkan, begitu pula panah di awal baris tabel.

- Baris tabel, kolom, atau indeks hanya memilih tabel itu.
- Baris kunci asing menampilkan kedua tabelnya di layar, atau tabel anak jika keduanya terlalu berjauhan untuk ditampilkan bersama, memilih tabel anak beserta kolom kunci asingnya, dan menyorot konektor — lihat [Membaca konektor](./relationship-editing.md#reading-a-connector).
- Baris memo memilih memo itu, dan baris grup tabel memilih grup itu. Memo atau grup yang disembunyikan oleh dokumen suatu sisi tidak menuju ke mana pun di sisi itu.

Setiap sisi bergerak menurut aturan di [Tempat lompatan berakhir](#where-a-jump-lands), yang diukur pada sisi itu, sehingga mengeklik baris yang sama lagi tidak menggerakkan apa pun.

### Tanda di kedua sisi {#marks-on-the-two-sides}

Kedua sisi mewarnai teks, garis tepi, dan konektor, dan tidak mengisi warna apa pun. Yang ditambahkan berwarna hijau dan hanya tampil di sisi saat ini, yang dihapus berwarna merah dan hanya tampil di sisi tersimpan, sedangkan yang diubah, berwarna ambar, dan yang diganti nama, berwarna biru, tampil di kedua sisi. Apa pun yang tidak berubah digambar seperti biasa.

- Tabel atau grup tabel yang ditambahkan atau dihapus diberi garis tepi dengan warnanya, dan namanya mengambil warna tersebut. Memo yang ditambahkan atau dihapus diberi garis tepi.
- Kolom yang ditambahkan atau dihapus pada tabel yang dimiliki kedua dokumen mewarnai seluruh barisnya, dan kolom yang dipindahkan membuat seluruh barisnya berwarna ambar. Tidak ada isi tabel yang ditambahkan atau dihapus yang ditandai tersendiri.
- Sel yang berubah menampilkan teksnya dengan warna ambar: komentar tabel, komentar kolom, tipe data, nilai default, Kenaikan otomatis, Unik, atau Tidak boleh NULL, atau teks memo. Perubahan kunci utama membuat ikon kunci kolom berwarna ambar.
- Tabel, kolom, atau grup tabel yang diganti namanya menampilkan namanya dengan warna biru.
- Tabel, memo, atau grup tabel dengan perubahan yang tidak memiliki sel tersendiri, misalnya perpindahan, ukuran atau warna baru, atau perubahan grup atau tabel dalam grup, diberi garis tepi berwarna ambar.
- Kunci asing yang ditambahkan, dihapus, atau diubah menggambar konektornya dengan warna tersebut. Mengarahkan penunjuk ke konektor itu, atau sorotan dari baris, justru menggambarnya dengan warna biasa saat penunjuk diarahkan.
- Perubahan indeks tidak menandai apa pun di kedua sisi; perubahan ini hanya tampil di pohon.

Setiap sisi mengikuti opsi tampilan dokumennya sendiri. Perubahan pada sel yang tidak digambar sisi itu justru tampil pada nama. Perubahan kolom pada sel yang disembunyikan suatu opsi tampilan, misalnya `Unique` atau `Auto Increment`, yang keduanya nonaktif secara default, membuat nama kolom berwarna ambar, begitu pula perubahan kunci utama pada baris yang tidak menampilkan ikon kunci. Perubahan komentar tabel selama `Table Comment` nonaktif membuat nama tabel berwarna ambar. Warna biru penggantian nama mengalahkan warna ambar ini. Memo atau grup tabel yang disembunyikan dokumennya dicantumkan di pohon tetapi tidak digambar di sisi itu.

Dalam tampilan `Logical Names`, yang tidak menampilkan sel nama, warna biru penggantian nama dan warna ambar dari perubahan pada sel yang tidak digambar sisi itu ditempatkan pada nama logis yang ditampilkan di tempat nama. Perubahan tipe data membuat sel tipe berwarna ambar di setiap tampilan, bahkan saat sel tersebut menampilkan nama domain. Kedua sisi tidak menggambar warna yang diberikan pemeriksaan tab Kamus pada nama di kanvas — lihat [Tanda di kanvas](./dictionary.md#marks-on-the-canvas).

Pada `70%` ke bawah, tabel yang menciut mempertahankan garis tepinya. Nama tetap berwarna hijau atau merah untuk tabel yang ditambahkan atau dihapus, atau biru untuk penggantian nama, dan jika tidak, mengambil warna ambar dari perubahan komentar. Perubahan kolom tidak digambar hingga Anda memperbesar kembali; pohon tetap mencantumkannya.
