---
sidebar_position: 4
description: Memberi tabel dan kolom nama logis, menampilkan nama fisik, nama logis, atau keduanya dengan Tampilan Nama, melengkapi nama istilah saat mengetik, menautkan kolom ke domain, dan melihat tempat lain yang namanya mengikuti tampilan.
---

# Nama logis

Tabel dan setiap kolomnya dapat memiliki nama logis di samping namanya. Nama logis adalah nama yang dibaca orang, seperti `Customer Name` untuk `CUST_NM`. Nama itu sendiri adalah nama fisik, yaitu nama yang ditulis [Skema SQL](./schema-sql.md) dan [Generator Kode](./code-generator.md).  
Tampilan Nama menentukan mana di antara keduanya yang ditampilkan kanvas ERD: nama, nama logis, atau keduanya — lihat [Tampilan Nama](#name-view).  
Nama logis juga dapat memberikan nama fisik kepada tabel atau kolomnya, yang dihasilkan dari kata dan istilah di tab [Kamus](./dictionary.md) — lihat [Menghasilkan nama fisik](./dictionary.md#deriving-physical-names).  
Kolom dapat ditautkan ke domain, yaitu tipe data bernama seperti `Name` untuk `VARCHAR(100)` yang disimpan di lembar `Domains` di tab Kamus, dan kemudian memiliki tipe data domain tersebut — lihat [Sel Domain](#the-domain-cell).  
Skema SQL dapat menulis setiap nama logis ke dalam komentar kosong — lihat [Nama logis sebagai komentar](./schema-sql.md#logical-names-as-comments).

## Tampilan Nama {#name-view}

Ada tiga tampilan, dan masing-masing menampilkan header dan baris tabel dengan caranya sendiri:

- `Physical Names`, tampilan diagram baru, tidak menampilkan nama logis. Header menampilkan nama tabel dan, selama View Option → `Table Comment` aktif, komentarnya, dan setiap baris menampilkan selnya sesuai [urutan kolom](./settings.md#adjusting-column-order).
- `Logical Names` menampilkan nama logis di tempat setiap nama: di header, dan di setiap baris pada posisi `Name` dalam urutan kolom. Sel tipe sebuah baris dapat mewakili domain kolom, seperti dijelaskan di bawah.
- `Both Names` menampilkan nama logis di samping nama. Header menampilkan nama logis, lalu nama, lalu komentar, dan setiap baris mendapatkan sel `Logical Name`, yang secara default ditempatkan urutan kolom tepat sebelum `Name`.

Nama logis yang kosong, termasuk yang hanya terdiri atas spasi, menampilkan pengganti yang diredupkan. Dalam tampilan `Logical Names`, pengganti itu adalah nama yang ditampilkan di tempatnya, atau placeholder `table` atau `column` jika nama itu juga kosong. Dalam tampilan `Both Names`, pengganti itu adalah placeholder `logical`.

Dalam tampilan `Logical Names`, kolom yang tertaut ke domain yang memiliki nama di lembar `Domains` di tab Kamus menampilkan nama domain itu di sel tipenya, bukan tipe datanya. Setiap kolom lain menampilkan tipe datanya di sana.  
Selama View Option → `Domain` aktif, domain memiliki selnya sendiri dan sel tipe tetap menampilkan tipe data, sehingga tidak ada baris yang menampilkan domain dua kali — lihat [Sel Domain](#the-domain-cell).

Setiap tabel selebar sel yang ditampilkannya dalam tampilan itu, sehingga penggantian tampilan mengubah ukuran tabel dan menata ulang konektornya. Tidak ada tabel yang berpindah.  
Pada `70%` ke bawah, tabel menciut menjadi namanya saja — lihat [Perbesar/perkecil](./table-related-functions.md#zoom-inout). Dalam tampilan `Logical Names`, tabel menampilkan nama logis, atau nama yang diredupkan selama nama logis tidak ada. Dalam tampilan `Both Names`, tabel menampilkan nama logis dengan nama pada baris di bawahnya, atau hanya nama selama tidak ada nama logis.

Pemeriksaan tab Kamus dapat menuliskan nama logis atau nama dengan warna merah atau kuning di tempat pemeriksaan menandainya — lihat [Tanda di kanvas](./dictionary.md#marks-on-the-canvas).

## Mengganti tampilan {#switching-the-view}

Empat tempat dapat mengganti tampilan, dan masing-masing mencantumkan `Physical Names`, `Logical Names`, dan `Both Names` dengan tampilan yang sedang berlaku dicentang:

- Tombol `Name View` di [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), di antara keempat notasi hubungan dan mode Zen. Tombol ini menyebutkan tampilan yang sedang berlaku, dengan panah ke bawah, dan tooltipnya bertuliskan `Name View`. Klik membuka daftar di atas bilah alat, dan memilih salah satu item menutupnya.
- `Name View` di menu konteks kanvas, tepat setelah `View Option`: submenu berisi ketiga tampilan. Menu tetap terbuka setelah sebuah pilihan dibuat.
- Daftar yang sama di bilah alat tab Visualisasi dalam mode `Flow`, setelah menu tampilan baris — lihat [Bilah alat](./visualization.md#toolbar).
- `Name View` di [Pencarian Cepat](./quick-search.md#what-the-palette-lists), tepat setelah `Tab` dan hanya dicantumkan di tab ERD. Submenunya terbuka dengan sorotan pada tampilan yang sedang berlaku.

![Mengganti Tampilan Nama ke Logical Names dari bilah alat kanvas, ke Both Names dari menu kanvas, lalu kembali ke Physical Names, dengan ordered_at, yang tidak memiliki nama logis, diredupkan lalu ditampilkan sebagai placeholder logical](/img/demo-name-view.webp)

Keempatnya mengatur tampilan yang sama. Bilah alat atas tidak memiliki tombol untuknya.

Penggantian tampilan mempertahankan pilihan dan tidak dicatat dalam [riwayat pembatalan](./undo-redo.md#what-the-history-records).  
Fokus pada sel yang tidak ditampilkan dalam tampilan baru berpindah ke sel yang ditampilkan di tempatnya: nama dan nama logis saling menggantikan, seperti halnya tipe dan domain. Editor sel yang terbuka pada sel itu ditutup. Mengaktifkan atau menonaktifkan View Option → `Domain` memindahkan fokus dengan cara yang sama.  
Selama penguncian `Name View` aktif, seperti pada diagram baru, penggantian tampilan hanya mengubah layar Anda sendiri dan file mempertahankan tampilan saat dikunci. Dengan penguncian nonaktif, file menyimpan tampilan yang Anda pilih — lihat [Penguncian](./settings.md#lock).

## Menulis nama logis {#writing-a-logical-name}

Tampilan `Physical Names` tidak menampilkan nama logis, jadi ganti ke tampilan `Logical Names` atau `Both Names` untuk menulisnya di kanvas:

- Dalam tampilan `Logical Names`, sel nama di header dan di baris berisi nama logis, sehingga nama fisik tidak dapat diedit di kanvas dalam tampilan ini.
- Dalam tampilan `Both Names`, sel nama logis berisi nama logis dan sel nama berisi nama fisik.

Sel nama logis diedit seperti sel lainnya: mulai dengan `Enter` atau klik dua kali — lihat [Pengeditan tabel](./table-editing.md). Saat dibuka pada nama logis yang kosong, editor menampilkan apa yang tadinya ditampilkan sel sebagai placeholder-nya: nama dalam tampilan `Logical Names`, `logical` dalam tampilan `Both Names`.  
Mengetik hanya menulis nama logis. Nama fisik dihasilkan darinya begitu editor ditutup (`Enter`, `Tab`, `Escape`, atau klik di tempat lain) dengan nama logis yang telah berubah, sebagai langkah pembatalan tersendiri setelah ketikan Anda. Nama fisik yang Anda tulis sendiri dibiarkan apa adanya — lihat [Menghasilkan nama fisik](./dictionary.md#deriving-physical-names).

`Tab` dan `Shift + Tab` menelusuri sel yang ditampilkan dalam tampilan tersebut, sesuai urutannya — lihat [Tombol Tab](./table-editing.md#tab-key):

- Dalam tampilan `Logical Names`, nama logis header, lalu komentarnya, lalu sel setiap baris sesuai urutan kolom, dengan nama logis di tempat nama.
- Dalam tampilan `Both Names`, nama logis, nama, dan komentar header, lalu sel setiap baris sesuai urutan kolom, dengan sel `Logical Name`-nya lebih dulu secara default.

`Alt + Enter` (Windows/Linux) atau `⌥ + Enter` (Mac) menambahkan kolom dan memfokuskan sel namanya, yang dalam tampilan `Logical Names` adalah nama logisnya.

Kolom kunci asing yang ditambahkan oleh hubungan menyalin nama logis dan domain kuncinya, beserta tipenya — lihat [Hubungan pengidentifikasi](./relationship-editing.md#identifying-relationships).  
Menyalin kolom ke spreadsheet, dan menempel kolom dari spreadsheet, menggunakan sel yang ditampilkan dalam tampilan tersebut, termasuk sel nama logis dan sel Domain — lihat [Menyalin/menempel kolom](./table-editing.md#copyingpasting-columns).

## Melengkapi nama istilah {#completing-term-names}

Selama Anda mengetik di sel nama logis, baik di header maupun di baris, daftar di bawah sel menawarkan istilah yang namanya diawali teks tersebut, tanpa membedakan huruf besar dan kecil dan dengan mengabaikan spasi di depannya. Istilah adalah nama logis utuh yang disimpan di lembar `Terms` di tab Kamus, beserta nama fisik dan domain yang diberikannya. Daftar menampilkan hingga delapan istilah, diurutkan menurut nama, dengan teks yang diketik disorot. Tidak ada daftar selama tidak ada istilah yang diawali seperti itu.

![Menambahkan kolom dengan ⌥ + Enter dalam tampilan Both Names, memilih Order Amount dari daftar istilah di bawah nama logisnya untuk mengisi ORD_AMT, DECIMAL(10,2), dan domain Amount, lalu mengetik Order Date, yang namanya, ORD_DT, diberikan oleh kata-kata saat Enter menutup editor](/img/demo-logical-names.webp)

- Awalnya tidak ada yang disorot. `↑` dan `↓` memindahkan sorotan, berputar kembali di kedua ujungnya, dan istilah yang disorot menampilkan tombol `Enter`.
- `Enter` pada istilah yang disorot menulis namanya sebagai nama logis dan mengakhiri pengeditan. Kecuali jika nama fisiknya adalah nama yang Anda tulis sendiri, langkah pembatalan yang sama langsung menghasilkan nama fisik dari istilah tersebut dan juga memberikan domain istilah itu kepada kolom. `Enter` tanpa ada yang disorot mengakhiri pengeditan dan mempertahankan apa yang Anda ketik.
- Klik pada istilah menuliskannya dengan cara yang sama dan membiarkan editor tetap terbuka.
- `Escape` selama daftar tampil hanya menutup daftar, dan `Escape` berikutnya mengakhiri pengeditan.
- `Tab` berpindah dengan teks seperti yang diketik, dan nama fisik dihasilkan darinya saat editor ditutup.
- Selama metode input sedang menyusun teks, tombol panah dan `Enter` ditangani oleh penyusunan tersebut.

Apa yang diberikan istilah kepada tabel atau kolom dibahas di [Menghasilkan nama fisik](./dictionary.md#deriving-physical-names).

## Sel Domain {#the-domain-cell}

View Option → `Domain`, yang nonaktif secara default, memberi setiap baris sel Domain di setiap tampilan, pada posisi `Domain` dalam urutan kolom, yang secara default tepat setelah `DataType` — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options).  
Sel ini menampilkan nama domain yang ditautkan ke kolom, atau placeholder `domain` yang diredupkan untuk kolom yang tidak tertaut ke domain mana pun yang dicantumkan lembar `Domains`.

![Mengaktifkan View Option → Domain, memilih Amount di sel Domain PAY_AMT setelah mempersempit daftar dengan amo, mengubah Data Type milik Amount menjadi DECIMAL(12,2) di tab Kamus dan mendapati kolom ikut berubah, lalu mengetik NUMERIC(12,2) ke dalam kolom, yang melepas tautannya](/img/demo-domains.webp)

`Enter` atau klik dua kali membuka pemilih di atas sel: kotak kosong dengan teks sel sebagai placeholder-nya, dan di bawahnya `None`, lalu setiap domain yang memiliki nama di lembar `Domains` sesuai urutan lembar. Sorotan dimulai pada domain yang tertaut, atau pada `None`.

- Mengetik hanya mencantumkan domain yang namanya mengandung teks tersebut, tanpa membedakan huruf besar dan kecil, menghilangkan `None`, dan menyorot domain pertama. `↑` dan `↓` memindahkan sorotan.
- `Enter` menautkan domain yang disorot, dan klik menautkan domain yang diklik. Keduanya memberikan tipe data domain kepada kolom, sebagai satu langkah pembatalan, dan mengakhiri pengeditan. `None` melepas tautan kolom dan mempertahankan tipe datanya.
- Apa yang Anda ketik tidak pernah ditulis ke dalam kolom. Selama lembar `Domains` tidak memiliki domain yang bernama, tidak ada daftar, dan `Enter` mengakhiri pengeditan tanpa menulis apa pun.

Dalam tampilan `Logical Names` dengan View Option → `Domain` nonaktif, sel tipe yang menampilkan nama domain membuka pemilih ini, dan sel tipe yang menampilkan tipe data membuka editor tipe data — lihat [Pelengkapan otomatis tipe data](./table-editing.md#datatype-autocomplete). Untuk menautkan domain ke kolom yang belum memilikinya, aktifkan sel Domain.  
Kolom yang tertaut memiliki tipe data domainnya dan mengikutinya saat tipe domain berubah, dan mengetik tipe lain ke dalam sel DataType-nya melepas tautannya — lihat [Domain dan tipe data](./dictionary.md#domains-and-data-types).

## Di luar kanvas {#beyond-the-canvas}

Sebagian besar tempat lain yang menyebut nama tabel atau kolom juga mengikuti Tampilan Nama:

- `Physical Names` menampilkan nama.
- `Logical Names` menampilkan nama logis, atau, selama nama logis kosong, nama, yang diredupkan jika tempat itu dapat meredupkannya.
- `Both Names` menampilkan nama logis dengan nama setelahnya: redup dalam sebaris teks, pada baris kedua dalam label Graf, dan di dalam tanda kurung jika satu teks harus memuat keduanya, seperti `Member (member)`. Tabel atau kolom tanpa nama logis hanya menampilkan namanya.

Daftar yang diurutkan menurut nama, seperti tabel di Penjelajah atau baris `#` di Pencarian Cepat, tetap diurutkan menurut nama di setiap tampilan, tidak pernah menurut nama logis.

Tempat-tempat yang mengikuti tampilan:

- Di tab Visualisasi, kartu Alur — lihat [Nama pada kartu](./visualization.md#names-on-the-cards) — serta label dan pratinjau saat penunjuk diarahkan pada Graf — lihat [Membaca graf](./visualization.md#reading-the-graph) dan [Pratinjau saat penunjuk diarahkan](./visualization.md#hover-preview).
- [Properti Tabel](./table-related-functions.md#table-properties): chip-nya, serta di tab `Indexes`, baris `Columns` dan daftar `Index order` — lihat [Indeks](./table-related-functions.md#indexes).
- Baris tabel dan kolom di [Penjelajah](./explorer.md#the-tree), serta tabel yang dicantumkan di bawah setiap grup tabel.
- Baris `#` di Pencarian Cepat — lihat [Mencari di diagram](./quick-search.md#searching-the-diagram).
- Pohon perubahan [Penampil Perbedaan](./table-related-functions.md#diff-viewer) dan kedua sisinya.
- [Petakan Kolom](./relationship-editing.md#map-columns), serta tooltip `<parent> has no primary key to copy` yang dapat ditampilkan `Create new columns` selama hubungan digambar — lihat [Pembuatan hubungan](./editing-start.md#relationship-creation).
- Salinan baris yang dibawa seretan kolom di atas kanvas kosong, yang menampilkan sel nama dan sel tipe setiap baris seperti yang ditampilkan baris itu — lihat [Mengubah urutan dan memindahkan kolom](./table-editing.md#rearranging-and-moving-columns).
- Kolom `Target` di lembar `Checks` di tab Kamus — lihat [Lembar Pemeriksaan](./dictionary.md#the-checks-sheet).
- [Gambar yang diekspor](./file-import-export.md#image).

Beberapa tempat tetap menggunakan nama apa pun tampilannya: baris indeks dan kunci asing di Penjelajah, `Keys` di tab `Indexes` pada Properti Tabel, `New column: <name>` di Petakan Kolom, dan lokasi yang ditulis di samping baris `@` atau `:` di Pencarian Cepat.

Penampil Perbedaan, [Perjalanan Waktu](./undo-redo.md#time-travel), pratinjau `Force` [Tata Letak Otomatis](./table-related-functions.md#auto-layout), dan dialog `Export image` terbuka dalam Tampilan Nama yang sedang Anda lihat, apa pun tampilan yang dipertahankan file. Masing-masing mempertahankan tampilan itu selama terbuka.  
Setiap Tata Letak Otomatis, serta `Import` atau `Import and Add` Skema SQL, GraphQL, DBML, atau AML, menempatkan tabel dengan lebar yang dimilikinya dalam tampilan Anda.

## Menemukan berdasarkan nama logis {#finding-by-logical-name}

Nama logis ditemukan di setiap Tampilan Nama, termasuk tampilan `Physical Names`, yang kanvasnya tidak menampilkan nama logis sama sekali:

- [Temukan dan Ganti](./find-and-replace.md#what-it-searches) mencarinya sebagai satu jenis teks, `Logical names`, untuk tabel maupun kolom, dan jenis ini aktif saat pencarian pertama kali dibuka. Mengganti nama logis menghasilkan nama fisik darinya, seperti saat menulis nama logis.
- Di [Pencarian Cepat](./quick-search.md#searching-the-diagram), `#` menemukan tabel berdasarkan nama atau nama logisnya, dan `@` menemukan kolom berdasarkan salah satunya, dengan kecocokan nama logis menampilkan `Logical name` di sampingnya. Bagian tabel pada `@`, sebelum `.`, juga mencocokkan nama atau nama logis tabel.

Mengganti Tampilan Nama mengubah cara hasil dinamai, tidak pernah mengubah apa yang ditemukan.

## Kolaborator {#collaborators}

Dalam [sesi kolaboratif](../../api/advanced/collaborative-editing.md), nama logis dan tautan domain sampai ke setiap editor seperti perubahan lainnya.  
Selama penguncian `Name View` aktif, setiap editor mempertahankan tampilannya sendiri, dan penggantian tampilan hanya terlihat di editor yang melakukannya. Selama penguncian nonaktif, penggantian di editor mana pun yang tidak hanya baca mengganti tampilan setiap editor — lihat [Penguncian](./settings.md#lock), yang juga membahas akibat pengaktifan atau penonaktifan penguncian terhadap tampilan setiap editor.  
Jika sel yang difokuskan seorang peserta adalah sel yang tidak ditampilkan dalam tampilan Anda, warna peserta tersebut tampil pada sel yang ditampilkan dalam tampilan Anda di tempatnya: sel nama dalam tampilan `Physical Names` tampil pada sel nama logis Anda dalam tampilan `Logical Names`, dan sebaliknya, dan sel tipe serta domain yang menggantikannya dipasangkan dengan cara yang sama.

Agen pemrograman yang bekerja melalui server MCP menetapkan nama logis dan menautkan domain apa pun tampilan yang sedang Anda lihat, dan tidak memiliki alat yang mengganti Tampilan Nama — lihat [Kamus](../../mcp/tools.md#dictionaries) dan [Pengaturan](../../mcp/tools.md#settings).

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), setiap pemilih Tampilan Nama berfungsi, dan penggantian tampilan hanya mengubah layar itu, apa pun keadaan penguncian.  
Nama logis dan domain tidak dapat diedit di sana, sehingga daftar istilah maupun pemilih domain tidak terbuka, dan tidak satu pun item `Derive Physical Name Again` dan `Derive Physical Names Again` ditawarkan. View Option → `Domain` tidak mengubah apa pun di sana, sebagaimana tidak ada [opsi tampilan](./table-related-functions.md#table-view-options) yang mengubah apa pun.
