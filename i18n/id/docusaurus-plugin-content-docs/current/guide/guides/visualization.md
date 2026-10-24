---
sidebar_position: 11
description: Menjelajahi skema sebagai Graf berbasis gaya atau sebagai Alur kartu tabel — memperbesar/memperkecil dan menggeser, menyorot tabel yang terkait dengan suatu tabel, memfokuskan beberapa tabel sekaligus, dan mundur menelusuri fokus sebelumnya.
---

# Visualisasi

Menampilkan seluruh dokumen dalam sekali lihat, dengan salah satu dari dua mode:

- `Graph`, graf berbasis gaya dari setiap tabel, kolomnya, dan hubungan di antaranya — lihat [Mode Graf](#graph-mode).
- `Flow`, setiap tabel digambar sebagai kartu dan ditata mengikuti hubungannya — lihat [Mode Alur](#flow-mode).

Buka Visualisasi dari tab `Visualization` di bilah alat bagian atas, atau dari [Pencarian Cepat](./quick-search.md) di bagian `Tab`.  
Dari tab ERD, `Alt + F` (Windows/Linux) atau `⌥ + F` (Mac) dan item menu konteks tabel `Focus on this table` langsung membukanya dalam `Flow`, dipersempit ke tabel yang Anda pilih dan tabel yang berjarak satu hubungan darinya — lihat [Memfokuskan tabel](#focusing-on-tables).

Ganti mode dengan tombol `Graph` dan `Flow` di ujung kiri [bilah alat](#toolbar).  
Editor yang baru dibuka dimulai pada `Graph`. Mode yang Anda pilih tetap bertahan selama editor terbuka, termasuk saat Anda berpindah ke tab lain, tetapi tidak disimpan di dokumen.

## Bilah alat {#toolbar}

Sebuah bilah alat melayang di tengah tepi bawah tab. Dari kiri ke kanan:

- `Graph` dan `Flow`, dengan mode saat ini disorot.
- `Previous table` dan `Next table`, hanya di `Flow`: panah kiri dan panah kanan yang mundur dan maju melalui tabel yang pernah menjadi tujuan penyempitan Alur — lihat [Tabel sebelumnya dan berikutnya](#previous-table-and-next-table). Masing-masing diredupkan selama tidak ada langkah yang dapat dituju ke arah itu.
- `Zoom out`, tingkat zoom saat ini dalam bentuk persentase seperti `100%`, dan `Zoom in`. Setiap tekanan mengubah zoom sebesar 4 poin persentase, dengan bagian tengah layar tetap di tempatnya. Persentase menunjukkan zoom mode yang sedang Anda gunakan, dan mengekliknya mengembalikan zoom tersebut ke `100%`.
- `Fit`, yang menampilkan di layar semua yang ditunjukkan mode tersebut: setiap simpul di `Graph`, setiap kartu di `Flow`.
- `Tidy Up`, hanya di `Flow`, yang menata ulang kartu — lihat [Cara Alur menata kartu](#how-flow-is-placed).
- Menu tampilan baris, hanya di `Flow`, berlabel pilihan saat ini — lihat [Tampilan baris](#row-display).
- Daftar `Name View`, hanya di `Flow`, berlabel tampilan yang sedang berlaku — lihat [Nama pada kartu](#names-on-the-cards).
- `Show all`, hanya di `Flow` dan hanya selama area pandang dipersempit, yang kembali ke seluruh diagram — lihat [Memfokuskan tabel](#focusing-on-tables).
- Kompas `Go to content`, yang muncul di ujung bilah alat hanya selama tidak ada simpul atau kartu di layar. Kompas ini menampilkan panah yang menunjuk ke simpul atau kartu terdekat beserta jaraknya, seperti `1.2k`. Klik kompas untuk memusatkan simpul atau kartu tersebut tanpa mengubah zoom.

Tombol zoom dan kedua panah mencantumkan pintasannya di tooltip, misalnya `Zoom in (Ctrl + Plus)` (Windows/Linux) atau `Zoom in (⌘ + Plus)` (Mac), dan `Previous table (Ctrl + Z)` (Windows/Linux) atau `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` dan `Ctrl + Minus` (Windows/Linux) atau `⌘ + Plus` dan `⌘ + Minus` (Mac) mengubah zoom selangkah demi selangkah seperti tombol tersebut, di kedua mode, dan `Ctrl + 0` (Windows/Linux) atau `⌘ + 0` (Mac) langsung kembali ke `100%`. Di `Flow`, `Ctrl + Z` dan `Ctrl + Shift + Z` (Windows/Linux) atau `⌘ + Z` dan `⌘ + Shift + Z` (Mac) melangkah seperti kedua panah tersebut.  
Mengeklik persentase sama efeknya dengan `Ctrl + 0` (Windows/Linux) atau `⌘ + 0` (Mac), dan tooltipnya mencantumkan pintasan tersebut. Pintasan ini tidak melakukan apa pun selama Pencarian Cepat terbuka.

## Mode Graf {#graph-mode}

Menggambar seluruh dokumen sebagai graf berbasis gaya, sehingga Anda dapat melihat sekilas bagaimana tabel saling berhubungan dan tabel mana yang berada di pusat suatu domain.

![Membuka mode Graf, mengarahkan penunjuk ke tabel untuk melihat pratinjaunya, menyeret simpul, lalu memperkecil dan memperbesar kembali](/img/demo-visualization.webp)

### Membaca graf {#reading-the-graph}

Setiap tabel dan setiap kolom merupakan simpul, dan kedua jenis simpul digambar dengan warna berbeda. Memo dan [grup tabel](./table-groups.md) tidak digambar.  
Setiap simpul kolom ditautkan ke tabel pemiliknya, dan dua tabel yang disambungkan oleh suatu hubungan saling ditautkan.  
Tabel yang disambungkan oleh lebih dari satu hubungan dengan arah yang sama hanya ditautkan sekali, dan hubungan yang berawal dan berakhir pada tabel yang sama tidak menggambar tautan.

Nama tabel muncul di graf saat Anda memperbesar, perlahan tampak antara `50%` dan `100%`, dan nama yang lebih panjang dari 15 karakter dipotong. Simpul kolom tidak memiliki label pada tingkat zoom berapa pun.  
Label mengikuti Tampilan Nama — lihat [Di luar kanvas](./logical-names.md#beyond-the-canvas). Dalam tampilan `Both Names`, label menempatkan nama logis di satu baris dan nama di baris di bawahnya, dan setiap baris dipotong secara terpisah.

### Navigasi di graf {#getting-around-the-graph}

Roda mouse mengubah zoom dengan berpusat pada apa pun yang berada di bawah penunjuk, dari `10%` hingga `400%`.  
Gerakan cubit pada trackpad mengubah zoom dengan cara yang sama, dan dua jari pada layar sentuh mengubah zoom dengan berpusat pada titik di antara keduanya serta menggeser saat jari bergerak.  
Seret latar belakang untuk menggeser, atau seret dengan tombol tengah mouse dari mana saja, termasuk dari simpul, seperti di [kanvas ERD](./table-related-functions.md#getting-around-the-canvas). Seretan tombol tengah hanya menggeser: seretan ini tidak pernah menarik simpul.

Sebaliknya, tombol zoom di [bilah alat](#toolbar) dan pintasan zoom menjaga bagian tengah layar tetap diam, dalam rentang yang sama, dan `Fit` menampilkan setiap simpul di layar.

### Pratinjau saat penunjuk diarahkan {#hover-preview}

Arahkan penunjuk ke simpul tabel untuk melihat pratinjau tabel tersebut, di samping kursor.  
Mengarahkan penunjuk ke simpul kolom hanya menggambar cincin di sekelilingnya; tidak ada pratinjau yang terbuka.

Pratinjau menampilkan kolom dan sel yang sama dengan kanvas ERD, dalam urutan yang sama, dan menamainya seperti yang dilakukan kanvas di Tampilan Nama yang sedang Anda gunakan — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options), [Mengatur urutan kolom](./settings.md#adjusting-column-order), dan [Tampilan Nama](./logical-names.md#name-view).  
Saat opsi tampilan `Alternate Key` aktif, setiap kolom dari [kunci alternatif](./table-related-functions.md#alternate-keys) menampilkan tandanya, seperti `AK1.1`, di posisi terakhir barisnya, dan pratinjau melebar untuk tanda tersebut seperti halnya tabel di kanvas ERD.  
Berbeda dengan tabel di kanvas ERD, header pratinjau tidak pernah mengambil warna [grup](./table-groups.md#coloring-a-group) tabel tersebut, dan nama-namanya tidak pernah diberi [tanda](./dictionary.md#marks-on-the-canvas) yang dipasang pemeriksaan kamus di kanvas.  
Pratinjau ini hanya untuk dilihat, dan disembunyikan selama Anda menyeret simpul atau menggeser.

### Menyorot lingkungan terdekat {#highlighting-a-neighbourhood}

Mengarahkan penunjuk ke tabel juga menyorot lingkungan terdekatnya: tabel itu sendiri, kolomnya sendiri, tabel yang disambungkan oleh hubungannya ke arah mana pun, dan tautan di antara semuanya.  
Semua hal lain di graf memudar, sehingga apa pun yang bersinggungan dengan tabel tersebut terbaca dengan jelas.

### Memindahkan simpul {#moving-nodes}

Seret simpul dengan tombol kiri mouse untuk menariknya, beserta semua yang ditautkan dengannya, ke posisi baru.  
Simpul disematkan di bawah penunjuk selama Anda menahannya, dan tata letak di sekitarnya kembali bergerak.  
Simpul kembali stabil saat Anda melepaskan tombol mouse — tidak ada yang tetap tersemat di tempat Anda melepaskannya.  
Tekanan atau seretan tombol kanan pada simpul tidak menarik simpul tersebut dan tidak pula menggeser.

### Graf hanyalah cuplikan {#the-graph-is-a-snapshot}

Graf dibangun dari dokumen sebagaimana keadaannya pada saat Anda membuka tab ini, dan dibangun ulang dari awal setiap kali Anda kembali ke tab ini.  
Beralih ke `Graph` dari `Flow` juga membangunnya ulang, dan setiap pembangunan ulang dimulai lagi pada `100%`.

## Mode Alur {#flow-mode}

Menggambar setiap tabel sebagai kartu dan menata kartu-kartu tersebut mengikuti hubungannya. Memo dan [grup tabel](./table-groups.md) tidak digambar.  
Mode ini bukan tata letak `Flow` dari [Tata Letak Otomatis](./table-related-functions.md#auto-layout), yang memindahkan tabel di tab ERD itu sendiri.

Setiap kartu digambar seperti tabel di tab ERD: warna tabel di sepanjang tepi kirinya, pita header berisi ikon tabel dan nama-nama tabel sebagaimana ditampilkan oleh [Tampilan Nama](#names-on-the-cards), lalu baris yang ditentukan oleh [tampilan baris](#row-display) kartu tersebut. Berbeda dengan tabel di tab ERD, kartu juga menggambar garis di antara barisnya, dan headernya tidak pernah mengambil warna [grup](./table-groups.md#coloring-a-group) tabel tersebut. Kartu mempertahankan bentuk itu pada setiap tingkat zoom, dan tidak pernah menciut menjadi namanya saja seperti tabel di tab ERD pada `70%` ke bawah. Tidak ada apa pun di kartu yang dapat diedit.

Konektor berupa satu kurva halus dari tabel ke tabel, digambar di bawah kartu, sehingga dapat melintas di belakang kartu. Hubungan dari suatu tabel ke dirinya sendiri melengkung mengitari sudut kanan atas kartu, seperti di tab ERD — lihat [Perutean konektor](./relationship-editing.md#connector-routing). Setiap konektor digambar sebagai garis abu-abu solid yang sama, baik hubungannya pengidentifikasi maupun bukan, dengan tanda ujung yang sama seperti di tab ERD — lihat [Membaca konektor](./relationship-editing.md#reading-a-connector). Alur menggambar konektor bahkan saat [opsi tampilan](./table-related-functions.md#table-view-options) `Relationship` nonaktif. Alur tidak pernah menggambar label `D:` dan `U:` dari tindakan ON DELETE dan ON UPDATE suatu hubungan atau menampilkan tooltip yang menjelaskannya, apa pun pengaturan opsi tampilan `Referential Actions`.

Pada seluruh diagram, tabel yang tidak disambungkan ke tabel lain oleh hubungan apa pun dikumpulkan ke dalam satu blok, alih-alih tersebar di antara tabel lainnya.

![Beralih ke Alur, mengarahkan penunjuk ke orders untuk menyorotnya beserta tabel tetangganya, menyematkan sorotan, memilih Keys only, lalu memperbesar dengan ⌘ + Wheel dan menekan Fit](/img/demo-visualization-flow.webp)

### Tampilan baris {#row-display}

Menu tampilan baris di [bilah alat](#toolbar) mengatur seberapa banyak bagian setiap kartu yang digambar. Labelnya berupa pilihan saat ini, dan tooltipnya bertuliskan, misalnya, `Row display: Name only`.  
Menu terbuka di atas bilah alat dengan tanda centang di samping pilihan saat ini. Menu tertutup saat Anda memilih salah satu pilihan, mengeklik label lagi, mengeklik di tempat lain mana pun di editor, menekan `Escape`, atau beralih ke `Graph`.

| Tampilan baris | Yang ditampilkan setiap kartu |
| --- | --- |
| `Name only` | Header saja. |
| `Keys only` | Kolom kunci utama dan kunci asing, ditambah kolom lain mana pun yang menjadi ujung suatu hubungan. |
| `All fields` | Setiap kolom. |

Baris dicantumkan sesuai urutan kolom tabel. Setiap baris menampilkan nama kolom, dengan ikon kunci di depannya jika kolom tersebut merupakan kunci utama, kunci asing, atau keduanya, serta tipe data di sebelah kanan, baik kartu sedang [disorot](#lighting-related-tables) maupun tidak. [Tampilan Nama](#names-on-the-cards) menentukan nama mana yang ditampilkan baris dan apakah baris menampilkan domain kolom.  
Tidak ada sel lain atau tanda kunci alternatif yang digambar, dan baik [Opsi tampilan tabel](./table-related-functions.md#table-view-options) maupun [Mengatur urutan kolom](./settings.md#adjusting-column-order), yang mengurutkan sel di dalam baris, tidak berlaku untuk kartu.

Saat pertama kali dibuka, Alur dimulai pada `Name only`, atau pada `Keys only` jika Alur dibuka dengan [memfokuskan tabel](#focusing-on-tables). Setelah itu, tampilan baris hanya berubah saat Anda memilih yang lain, dan tampilan baris tetap dipertahankan saat area pandang dipersempit atau diperluas.  
Mengubah tampilan baris mengubah ukuran kartu, sehingga Alur menata ulang kartu dan mengepaskannya ke layar.

### Nama pada kartu {#names-on-the-cards}

Kartu menamai tabel dan kolomnya dalam Tampilan Nama, yaitu tampilan yang sama dengan yang digunakan tab ERD — lihat [Tampilan Nama](./logical-names.md#name-view).  
Ganti tampilan di sini dengan daftar `Name View` di [bilah alat](#toolbar). Tombolnya bertuliskan tampilan yang sedang berlaku, `Physical Names`, `Logical Names`, atau `Both Names`, dan tooltipnya bertuliskan `Name View`. Daftar terbuka di atas bilah alat dengan tanda centang di samping tampilan yang sedang berlaku, dan tertutup seperti menu [tampilan baris](#row-display). Pilihan di daftar ini mengganti tampilan di seluruh editor, termasuk tab ERD, seperti halnya penggantian yang dilakukan di tempat lain — lihat [Mengganti tampilan](./logical-names.md#switching-the-view).

Kartu menata selnya hanya berdasarkan Tampilan Nama. Tidak ada [opsi tampilan](./table-related-functions.md#table-view-options) yang mengubahnya, termasuk `Domain`:

| Tampilan Nama | Header | Setiap baris |
| --- | --- | --- |
| `Physical Names` | Nama tabel. | Nama kolom, lalu tipe data. |
| `Logical Names` | Nama logis tabel. | Nama logis kolom, lalu nama [domain](./dictionary.md#domains-and-data-types) kolom tersebut, atau tipe datanya selama kolom tidak memiliki domain. |
| `Both Names` | Nama logis, lalu nama tabel dalam warna redup. | Nama logis, nama, domain, dan tipe data. |

Selama nama logis kosong, tampilan `Logical Names` menampilkan nama di tempatnya, dalam keadaan diredupkan, atau placeholder `table` atau `column` jika nama juga kosong, dan tampilan `Both Names` menampilkan placeholder `logical` yang diredupkan. Dalam tampilan `Both Names`, kolom tanpa domain menampilkan placeholder `domain` yang diredupkan.  
Kartu tidak pernah menampilkan [tanda](./dictionary.md#marks-on-the-canvas) yang dipasang pemeriksaan kamus pada nama di tab ERD.  
Mengganti Tampilan Nama mengubah ukuran kartu, sehingga Alur menata ulang kartu — lihat [Cara Alur menata kartu](#how-flow-is-placed).

### Navigasi di Alur {#getting-around-the-flow}

Roda mouse menggeser, dan `Shift + Wheel` menggeser ke samping. `Ctrl + Wheel` (Windows/Linux) atau `⌘ + Wheel` (Mac) mengubah zoom, dengan bagian tengah layar tetap di tempatnya.  
Gerakan cubit pada trackpad mengubah zoom dengan berpusat pada titik tempat Anda mencubit, dan dua jari pada layar sentuh mengubah zoom dengan berpusat pada titik di antara keduanya serta menggeser saat jari bergerak.  
Seret latar belakang untuk menggeser, atau seret dengan tombol tengah mouse dari mana saja, termasuk dari kartu. Seretan tombol tengah hanya menggeser dan membiarkan pilihan apa adanya. Penggeseran tidak memiliki batas, seperti di [kanvas ERD](./table-related-functions.md#getting-around-the-canvas).  
Zoom berkisar dari `10%` hingga `150%`. Alur memiliki zoom dan posisi geser sendiri, terpisah dari milik tab ERD, dan keduanya tidak disimpan di dokumen.

Menekan latar belakang mengosongkan pilihan, dan `Ctrl + drag` (Windows/Linux) atau `⌘ + drag` (Mac) pada latar belakang menggambar kotak seleksi.  
Alur tidak memiliki minimap maupun bilah gulir. Saat penggeseran membuat layar tidak menampilkan kartu apa pun, gunakan kompas `Go to content` di [bilah alat](#toolbar).

### Menyorot tabel terkait {#lighting-related-tables}

Arahkan penunjuk ke kartu untuk menyorot kartu tersebut, tabel yang berjarak satu hubungan darinya, dan konektor yang menyambungkannya ke tabel-tabel tersebut. Konektor yang menghubungkan dua di antara tabel-tabel tersebut tetap tidak disorot.  
Kartu yang disorot mendapat batas dan pendar berwarna aksen, dan barisnya yang menjadi ujung suatu hubungan diberi rona warna. Konektor yang disorot berubah menjadi warna aksen.  
Tidak ada hal lain yang memudar, berbeda dengan di [Graf](#highlighting-a-neighbourhood), dan tidak ada yang disorot selama tidak ada kartu yang berada di bawah penunjuk atau disematkan.

Klik kartu untuk menyematkan sorotannya, sehingga kartu tetap disorot saat penunjuk berpindah. Klik kartu yang sama lagi, atau klik latar belakang, untuk melepaskannya; mengeklik kartu lain memindahkan sematan ke kartu tersebut. Kartu yang berada di bawah penunjuk dan kartu yang disematkan tersorot bersamaan.  
Menyeret, `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac), menggeser, dan [tombol kartu](#card-buttons) tidak menyematkan maupun melepaskan kartu.

Partikel mengalir di sepanjang setiap konektor yang disorot, dari ujung tabel induk, tempat kunci utama berada, ke ujung tabel anak. Saat lebih dari 60 konektor disorot sekaligus, partikel berhenti dan sorotan tetap ada.

### Tombol kartu {#card-buttons}

Selama penunjuk berada di atas kartu, dua tombol ikon, keduanya tanpa tooltip, muncul di ujung kanan headernya:

- Ikon titik jalan, ikon yang sama dengan yang ditampilkan tombol `Flow`, mempersempit Alur ke tabel tersebut dan tabel yang berjarak satu hubungan darinya — lihat [Memfokuskan tabel](#focusing-on-tables). Apa yang ditampilkan Alur sebelumnya tetap dapat dicapai dengan satu kali `Previous table` — lihat [Tabel sebelumnya dan berikutnya](#previous-table-and-next-table).
- Ikon tautan eksternal beralih ke tab ERD, memilih hanya tabel tersebut, membawanya ke depan, dan menempatkan sel fokus pada namanya, atau pada nama logisnya dalam tampilan `Logical Names` dan `Both Names`, kecuali jika salah satu sel tabel tersebut sudah memegang fokus. Kanvas digulir ke tabel hanya jika tabel belum terlihat dengan baik — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands). Ikon ini tidak pernah memulai atau menyelesaikan hubungan yang sedang digambar.

Tekanan pada salah satu tombol hanya berlaku untuk tombol itu: berbeda dengan tekanan di bagian lain kartu, tekanan ini tidak memilih kartu atau membawanya ke depan. Karena itu, tombol titik jalan membiarkan pilihan yang sudah Anda miliki; tombol tautan eksternal memilih tabel hanya sebagai bagian dari peralihannya ke tab ERD. Hanya klik kiri yang menjalankan kedua tombol tersebut.

### Memindahkan kartu {#moving-cards}

Seret kartu dengan tombol kiri mouse dari bagian mana pun kecuali kedua tombol kartu; seretan tombol kanan tidak memindahkan apa pun.  
Menekan kartu memilihnya, `Ctrl + click` (Windows/Linux) atau `⌘ + click` (Mac) menambahkannya ke pilihan, dan menyeret kartu yang dipilih memindahkan semua kartu yang dipilih. Pilihan ini sama dengan yang digunakan tab ERD, sehingga apa yang Anda pilih di sini tetap terpilih saat Anda kembali.

Kartu hanya berpindah di Alur: tabelnya tetap di tempatnya di tab ERD.  
Kartu yang dipindahkan tetap di tempatnya selama penggeseran, zoom, dan `Fit`. Kartu kembali ke posisi yang ditentukan tata letak saat Anda meninggalkan tab atau beralih ke `Graph` lalu kembali, dan saat `Show all` atau [langkah](#previous-table-and-next-table) kembali ke tata letak yang sudah dimiliki Alur. Tata letak baru menempatkannya kembali dengan mempertimbangkan posisi tempat Anda meninggalkannya — lihat [Cara Alur menata kartu](#how-flow-is-placed).

### Memfokuskan tabel {#focusing-on-tables}

Di tab ERD, pilih satu atau beberapa tabel lalu tekan `Alt + F` (Windows/Linux) atau `⌥ + F` (Mac), atau klik kanan tabel dan pilih `Focus on this table`.  
Tab Visualisasi terbuka dalam `Flow`, dipersempit ke tabel-tabel tersebut dan setiap tabel yang berjarak satu hubungan dari salah satunya, ke arah mana pun. Hanya konektor di antara tabel yang ditampilkan yang digambar.

Saat tabel yang Anda klik kanan merupakan salah satu dari beberapa tabel yang dipilih, item tersebut bertuliskan `Focus on selected tables` dan memfokuskan seluruh pilihan. Mengeklik kanan tabel di luar pilihan hanya memfokuskan tabel itu.  
`Alt + F` mengambil tabel yang dipilih dan tidak menyertakan memo serta [grup tabel](./table-groups.md). Jika tidak ada tabel yang dipilih, pintasan ini tidak melakukan apa pun, bahkan saat grup dipilih: pilih `Select tables` di menu konteks grup terlebih dahulu — lihat [Memilih grup](./table-groups.md#selecting-groups).  
Pintasan ini diabaikan selama sel, memo, atau nama grup sedang diedit, selama fokus keyboard berada di [Penjelajah](./explorer.md#keys-in-the-explorer), atau selama Pencarian Cepat, Properti Tabel, Penampil Perbedaan, pratinjau Tata Letak Otomatis, Perjalanan Waktu, dialog [`Export image`](./file-import-export.md#image), atau [`Map Columns`](./relationship-editing.md#map-columns) terbuka.

Di dalam Alur, [tombol kartu](#card-buttons) titik jalan mempersempit area pandang dengan cara yang sama, ke satu tabel tersebut. `Show all` di [bilah alat](#toolbar) kembali ke seluruh diagram. `Previous table` dan `Next table` di bilah alat, atau tombol keyboardnya, mundur dan maju melalui apa yang pernah menjadi tujuan penyempitan Alur — lihat [Tabel sebelumnya dan berikutnya](#previous-table-and-next-table).  
Area pandang yang dipersempit ditata tersendiri dan dipaskan ke layar. Area pandang tetap dipersempit saat Anda meninggalkan tab atau beralih ke `Graph` lalu kembali, dan `Escape` tidak memperluasnya.

![Memfokuskan orders dengan ⌥ + F, mempersempit ke members dengan tombol titik jalan pada kartunya, lalu Show all](/img/demo-visualization-focus.webp)

### Tabel sebelumnya dan berikutnya {#previous-table-and-next-table}

Alur mengingat apa yang pernah menjadi tujuan penyempitannya, seperti riwayat browser. Setiap kali area pandang berpindah ke tabel lain — dengan [memfokuskan tabel](#focusing-on-tables) dari tab ERD, dengan [tombol kartu](#card-buttons) titik jalan, atau dengan `Show all` — apa yang ditampilkannya sebelumnya disimpan sebagai langkah mundur, baik itu beberapa tabel maupun seluruh diagram.

![Mempersempit Alur ke orders dengan ⌥ + F lalu ke members, mundur dengan Previous table, maju dengan ⌘ + Shift + Z dan mundur dengan ⌘ + Z, lalu Show all](/img/demo-visualization-steps.webp)

- `Previous table` di [bilah alat](#toolbar) mundur satu langkah, dan `Next table` maju kembali ke apa yang ditinggalkan `Previous table`.
- Di `Flow`, `Ctrl + Z` (Windows/Linux) atau `⌘ + Z` (Mac) mundur seperti `Previous table`, dan `Ctrl + Shift + Z` (Windows/Linux) atau `⌘ + Shift + Z` (Mac) maju seperti `Next table`. Di sana keduanya tidak pernah membatalkan atau mengulangi perubahan pada diagram. Di `Graph`, dan selama Pencarian Cepat terbuka, keduanya tidak melakukan apa pun.
- Mempersempit area pandang atau menekan `Show all` setelah mundur membuang langkah maju. Memfokuskan kembali tepat pada tabel yang sudah menjadi tujuan penyempitan Alur tidak menambah langkah dan tidak membuang langkah apa pun.
- Sebanyak 100 langkah mundur terakhir disimpan, dan yang tertua dibuang lebih dulu.

Langkah menampilkan tabel-tabelnya yang masih ada di diagram, beserta setiap tabel yang berjarak satu hubungan, seperti halnya pemfokusan. Langkah yang semua tabelnya telah dihapus dilewati dan dibuang, begitu pula langkah yang akan membiarkan Alur tetap di tempatnya: pada tabel yang persis sama dengan tujuan penyempitannya saat ini, atau pada seluruh diagram selama Alur sudah menampilkannya.  
Tombol diredupkan, dan tidak melakukan apa pun, selama tidak ada langkah tersisa ke arah itu. Keduanya diredupkan saat Alur pertama kali dibuka, baik pada seluruh diagram maupun pada tabel yang menjadi fokus saat Alur dibuka. Setelah Alur terbuka, fokus berikutnya dari tab ERD menyimpan apa yang ditampilkan Alur saat Anda meninggalkannya sebagai langkah mundur.  
Langkah ditata dan dipaskan ke layar seperti halnya fokus — lihat [Cara Alur menata kartu](#how-flow-is-placed) — dan tampilan baris tetap apa adanya.

Langkah-langkah ini milik Alur sendiri. Langkah disimpan selama editor terbuka, termasuk saat Anda mengunjungi tab lain dan `Graph`, tetapi tidak disimpan di dokumen atau dikirim ke kolaborator, dan tidak menambahkan apa pun ke riwayat pembatalan. Mengganti seluruh dokumen membuangnya bersama bagian lain Alur.

Dalam bahasa tampilan kanan ke kiri, bilah alat mempertahankan urutannya dan kedua panah bertukar fungsi, sehingga `Previous table` adalah panah yang menunjuk ke kanan. Tombol keyboard tetap sama — lihat [Bahasa kanan ke kiri](./language-and-theme.md#right-to-left-languages).

### Cara Alur menata kartu {#how-flow-is-placed}

Saat `Flow` ditampilkan pertama kali, tabel yang ditampilkannya ditata di luar thread utama dan hasilnya dipaskan ke layar.  
Tata letak tersebut dipertahankan selama editor terbuka. Jika Anda meninggalkan tab atau beralih ke `Graph` lalu kembali, Alur menggunakan kembali tata letak itu, dengan zoom dan posisi geser seperti saat Anda meninggalkannya.  
Alur mempertahankan satu tata letak untuk seluruh diagram dan satu untuk tabel yang terakhir menjadi tujuan penyempitannya, sehingga `Show all` kembali ke tata letak seluruh diagram dan mengepaskannya ke layar tanpa menghitungnya ulang, selama tidak ada yang berubah pada hal-hal yang menjadi dasar tata letak tersebut. [Langkah](#previous-table-and-next-table) ke seluruh diagram, atau ke tabel yang terakhir menjadi tujuan penyempitan Alur, menggunakan kembali tata letak tersebut dengan cara yang sama.

Alur menata ulang kartu saat:

- Anda menekan `Tidy Up`. Hasilnya dipaskan ke layar.
- Anda mengubah tampilan baris, mempersempit area pandang ke tabel lain, atau melangkah ke tabel lain dengan `Previous table` atau `Next table`. Hasilnya dipaskan ke layar.
- Anda memilih tampilan lain di daftar `Name View`. Hasilnya dipaskan ke layar.
- Tabel atau hubungan ditambahkan atau dihapus, atau Tampilan Nama diganti — selama Anda meninggalkan Alur, lalu diterapkan saat Anda kembali, atau oleh kolaborator selama Anda berada di Alur. Zoom dan posisi geser tetap seperti semula.

Setiap tata letak mempertimbangkan posisi kartu saat ini, sehingga `Tidy Up` belum tentu mengembalikan susunan sebelumnya.  
Perubahan yang hanya mengubah ukuran kartu, seperti mengganti nama tabel, menulis nama logis, atau menambahkan kolom, tidak menata ulang kartu. Tekan `Tidy Up` jika kartu akhirnya saling tumpang tindih.

Tata letak yang memakan waktu lebih dari 6 detik menampilkan pemberitahuan `Placing tables`, dengan indikator pemuatan yang berputar dan `Cancel`.  
`Cancel`, atau `Escape` kapan saja selama tata letak berjalan, membuangnya; `Tidy Up`, atau kembali ke `Flow`, memintanya lagi.  
Jika tata letak gagal — host tidak menjalankan shared worker, worker gagal dimulai, atau tidak ada tata letak yang dikembalikan dalam 60 detik — Alur menampilkan pemberitahuan `Could not place tables` dengan tanda peringatan, dan `Tidy Up` mencoba lagi. Lihat [Web Worker](../../api/installation.md#web-workers).  
Alur hanya menggambar tabel yang ditempatkan oleh tata letak terakhirnya, baik pada seluruh diagram maupun di area pandang yang dipersempit, sehingga saat pertama kali ditampilkan mungkin tidak ada kartu sama sekali hingga suatu tata letak berhasil.  
Setiap kali Alur menata ulang kartu, misalnya saat Anda mempersempit area pandang ke tabel lain, susunan sebelumnya tetap di layar hingga tata letak baru selesai, dan tetap di sana jika tata letak itu dibatalkan atau gagal.

Saat seluruh dokumen diganti, misalnya dengan mengimpor file, tata letak, fokus, langkah `Previous table` dan `Next table`, tampilan baris, zoom, dan posisi geser Alur dibuang, dan saat berikutnya Anda membuka Alur, Alur dimulai dari awal seperti pertama kali: pada seluruh diagram, atau dipersempit jika Anda membukanya dengan [memfokuskan tabel](#focusing-on-tables).

### Alur tidak pernah mengedit dokumen {#flow-never-edits-the-document}

Alur hanya membaca diagram. Zoom, penggeseran, pemindahan kartu, `Tidy Up`, tampilan baris, sematan, pemfokusan, dan langkah dengan `Previous table` dan `Next table` tidak menambahkan apa pun ke [riwayat pembatalan](./undo-redo.md#what-the-history-records).  
Semua itu juga tidak mengubah apa pun di diagram. Menekan kartu memang membawa tabelnya ke depan, sama seperti mengeklik tabel di tab ERD, sehingga tabel tersebut juga berada di depan di sana, tetapi urutan tumpukan tidak disimpan — lihat [Memindahkan beberapa tabel](./table-related-functions.md#moving-multiple-tables). `Graph` pun tidak mengusik diagram dengan cara yang sama.  
Daftar `Name View` merupakan pengecualian, dan hanya selama [penguncian](./settings.md#lock) `Name View` nonaktif: pilihan di daftar ini kemudian mengganti Tampilan Nama diagram, yang disimpan dan ikut berganti di editor kolaborator. Selama penguncian aktif, seperti secara default, pilihan hanya mengubah layar Anda sendiri. Dalam kedua keadaan, pilihan tersebut tidak menambahkan apa pun ke riwayat pembatalan.  
Menekan kartu tidak pernah menambahkan hubungan. Jika Anda meninggalkan tab ERD saat sedang menggambar hubungan, tekanan pada kartu memilih tabelnya sebagai titik awal jika belum ada tabel yang dipilih, dan jika sudah ada, mengakhiri penggambaran.  
[Tombol kartu](#card-buttons) tautan eksternal bertindak lebih jauh, karena membawa Anda keluar dari Alur: saat tab ERD harus menggulir ke tabel, guliran tersebut dicatat seperti perubahan posisi area pandang lainnya.

Perubahan dari kolaborator tetap sampai ke diagram selama Anda berada di Alur, dan kartu mengikuti tabel dan hubungan yang mereka tambahkan atau hapus — lihat [Cara Alur menata kartu](#how-flow-is-placed).  
Cincin pilihan dan cincin fokus mereka digambar pada kartu, tetapi kursor dan kotak seret mereka tidak — lihat [Pengeditan kolaboratif](../../api/advanced/collaborative-editing.md).

Kedua mode, termasuk pemfokusan dan langkah, juga berfungsi di editor `readonly`, begitu pula daftar `Name View`, yang di sana hanya mengganti tampilan di layar Anda sendiri.
