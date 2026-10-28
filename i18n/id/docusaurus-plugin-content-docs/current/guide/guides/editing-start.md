---
sidebar_position: 1
description: Memulai dari layar sambutan, serta membuat tabel, memo, grup tabel, dan hubungan dari menu konteks kanvas, bilah alat kanvas, atau pintasan.
---

# Memulai pengeditan

Pengeditan dimulai melalui menu konteks dengan klik kanan.

![Mengeklik kanan kanvas, membuka submenu Relationship, menambahkan tabel, lalu menu milik tabel tersebut](/img/demo-context-menu.webp)

Klik kanan pada tabel, memo, grup tabel, atau hubungan justru membuka menu milik item tersebut.  
Klik kanan pada tabel, memo, atau grup tabel yang sudah dipilih mempertahankan seluruh pilihan, sehingga item seperti `Color` dan `Delete selected` berlaku untuk semuanya — lihat [Pemilihan jamak](./table-related-functions.md#multiple-selection).  
Editor hanya baca tidak membuat apa pun, sehingga tidak ada yang dijelaskan halaman ini yang ditawarkan di sana: menu kanvas hanya mempertahankan `View Option`, `Name View`, `Export`, dan `Diff Viewer`, menu tabel hanya `Table Properties`, dan memo, grup tabel, atau hubungan tidak membuka menu — lihat [Editor hanya baca](./table-related-functions.md#read-only-editors).

## Layar sambutan {#welcome-screen}

Di aplikasi web, Google Drive, VS Code, Obsidian, dan IDE JetBrains, diagram kosong terbuka dengan layar sambutan di atas kanvas ERD. `<erd-editor>` di halaman Anda sendiri hanya menampilkannya jika halaman tersebut mengaktifkannya dengan [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Diagram dianggap kosong selama tidak memuat satu pun tabel, memo yang ditampilkan, atau grup tabel yang ditampilkan, sehingga memo dan grup yang disembunyikan dengan opsi tampilan tidak dihitung. Layar ini menghilang begitu diagram memuat salah satunya, dan muncul kembali setiap kali diagram kosong lagi, misalnya setelah Anda menghapus tabel terakhir atau membatalkan penambahan tabel pertama.  
Layar ini tidak ditampilkan di editor hanya baca, dalam mode Zen, selama Properti Tabel terbuka, atau selama Penampil Perbedaan, pratinjau Tata Letak Otomatis, atau Perjalanan Waktu mengambil alih kanvas.

![Layar sambutan pada diagram kosong: membuka format Import, kembali dengan Esc, menambahkan tabel dengan New Table, lalu memunculkan kembali layar tersebut dengan ⌘ + Z](/img/demo-welcome-screen.webp)

Di bawah judul `Right-click the canvas for every action.` terdapat sebuah menu:

- `New Table` menambahkan tabel, seperti `Alt + N`.
- `New Memo` menambahkan memo, seperti `Alt + M`. Item ini dihilangkan selama memo disembunyikan.
- `Import` mengganti menu dengan `Back` dan format `json`, `Schema SQL`, `GraphQL`, `DBML`, dan `AML`. Memilih format meminta file berformat tersebut dan memuatnya sebagai pengganti diagram kosong — lihat [Mengimpor atau mengekspor file](./file-import-export.md). `Back`, atau `Escape`, kembali ke menu pertama.
- `Command Palette` membuka [Pencarian Cepat](./quick-search.md), seperti `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac).
- `Shortcuts` membuka tab [`Shortcuts`](./settings.md#shortcuts) di Pengaturan.

Jika kanvas cukup lebar, `New Table`, `New Memo`, dan `Command Palette` menampilkan tombol yang saat ini ditetapkan untuk perintahnya, termasuk tombol yang telah dipetakan ulang oleh host.  
Begitu sebuah item mendapat fokus keyboard, `↑` dan `↓` berpindah di antara item secara melingkar, `Home` dan `End` melompat ke item pertama dan terakhir, dan `Enter` atau `Space` menekan item yang difokuskan. Semua pintasan lain tetap berfungsi, sehingga `Alt + N` juga menambahkan tabel dari sana.  
Hanya menu yang menerima klik: penekanan di bagian lain mana pun di layar diteruskan ke kanvas, dan klik kanan pada kanvas membuka menu konteks seperti biasa.

Jika kanvas memiliki ruang, panah bergaya gambar tangan menunjuk ke:

- tombol `Search` di bilah alat: `Search commands and tables`
- tombol `Theme` dan `Display Language`: `Pick a theme and a language`, atau `Pick a theme` atau `Pick a language` saat bilah alat hanya menampilkan salah satunya — lihat [Bahasa dan tema](./language-and-theme.md)
- [bilah alat kanvas](./table-related-functions.md#canvas-toolbar) di bagian bawah: `Pan, zoom and draw relationships`

Selama [Penjelajah](./explorer.md) ditampilkan, layar sambutan hanya menutupi kanvas di sampingnya.  
Panah yang tombol bilah alatnya berada di atas Penjelajah dihilangkan. Panah `Theme` dan `Display Language` hanya dihilangkan saat kedua tombolnya berada di atas Penjelajah; hingga saat itu, panah ini menunjuk ke tombol yang masih berada di atas kanvas.  
Label yang tidak memiliki ruang di samping panahnya justru menggantung di bawah panah tersebut.

## Pembuatan tabel {#table-creation}

Buat tabel dari menu konteks, dengan tombol `New Table` di [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), atau dengan pintasan `Alt + N`.

## Pembuatan memo {#memo-creation}

Buat memo dari menu konteks, dengan tombol `New Memo` di bilah alat kanvas, atau dengan pintasan `Alt + M`.  
Selama View Option → `Memos` nonaktif, memo disembunyikan, tidak ada yang menawarkan `New Memo`, dan `Alt + M` tidak menambahkan memo apa pun — lihat [Opsi tampilan tabel](./table-related-functions.md#table-view-options).

Memo adalah catatan teks bebas di kanvas. Klik badannya lalu ketik; teksnya disimpan bersama dokumen.  
`Escape` menutup editor memo, mempertahankan apa yang Anda ketik dan membiarkan memo tetap dipilih, dan `Escape` kedua mengosongkan pilihan.  
Seret tepinya untuk mengubah ukurannya. `x` di headernya, yang ditampilkan selama penunjuk berada di atas memo, menghapusnya.  
Klik kanan pada memo membuka menunya, bukan editor: `Color`, `Remove color` selama item yang dipilih memiliki warna, dan `Delete`, yang bertuliskan `Delete selected` selama memo tersebut merupakan salah satu dari dua item yang dipilih atau lebih. Memo yang dipilih juga dihapus dengan tombol yang menghapus tabel — lihat [Penghapusan tabel dan memo](./table-related-functions.md#table-and-memo-deletion).

![Menambahkan memo dengan Alt + M, mengetik catatan, dan menyeret tepinya untuk mengubah ukurannya](/img/demo-memo.webp)

## Pembuatan grup tabel {#table-group-creation}

Grup tabel adalah kotak yang memuat tabel, dan Anda dapat memberinya nama dan warna. Buat grup dengan salah satu dari dua cara:

- Pilih `New Table Group` dari menu konteks atau Pencarian Cepat, klik tombol `New Table Group` di [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), atau tekan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac), lalu seret sebuah kotak di atas kanvas. Setiap tabel yang titik tengahnya terletak di dalam kotak bergabung ke grup baru, kecuali jika tabel itu sudah berada di grup lain — lihat [Menggambar grup](./table-groups.md#drawing-a-group).
- Pilih tabel, lalu pilih `Group selected tables` dari menu konteks tabel atau `Group Selected Tables` dari Pencarian Cepat, atau tekan `T` lalu `G` — lihat [Mengelompokkan tabel yang dipilih](./table-groups.md#grouping-selected-tables).

Pemberian nama, pemberian warna, pemindahan, pengubahan ukuran, dan lainnya dibahas di [Grup tabel](./table-groups.md).

## Pembuatan hubungan {#relationship-creation}

Mulai hubungan dari menu konteks, dari [bilah alat kanvas](./table-related-functions.md#canvas-toolbar) di bagian bawah kanvas, atau dengan pintasan. Setiap tipe hubungan memiliki pintasannya sendiri:

- Nol atau satu: `Ctrl + Alt + 1` (Windows/Linux) atau `⌘ + ⌥ + 1` (Mac)
- Nol hingga N: `Ctrl + Alt + 2` (Windows/Linux) atau `⌘ + ⌥ + 2` (Mac)
- Tepat satu: `Ctrl + Alt + 3` (Windows/Linux) atau `⌘ + ⌥ + 3` (Mac)
- Satu hingga N: `Ctrl + Alt + 4` (Windows/Linux) atau `⌘ + ⌥ + 4` (Mac)

Setelah suatu tipe disiapkan, kursor berubah. Klik tabel induk terlebih dahulu, lalu tabel anak.  
Tabel induk mendapatkan kunci utama jika belum memilikinya, dan untuk setiap kolom kunci utama tabel induk, tabel anak mendapatkan kolom kunci asing `Not Null` dengan tipe data, nilai default, komentar, [nama logis](./logical-names.md), dan [domain](./dictionary.md#domains-and-data-types) yang sama.  
Kunci serial merupakan pengecualian: kunci asingnya mengambil tipe integer yang disimpan serial tersebut, seperti `integer` untuk `serial4`, sehingga tidak menautkan domain apa pun — lihat [Hubungan pengidentifikasi](./relationship-editing.md#identifying-relationships).  
Setiap kolom kunci asing diberi nama berdasarkan kuncinya: nama satu kata seperti `id` diberi nama tabel induk di depannya (`user_id`), nama beberapa kata seperti `member_id` dipertahankan, dan nama yang sudah dimiliki tabel anak diberi nomor (`user_id_2`) — lihat [Nama kolom kunci asing](./relationship-editing.md#foreign-key-column-names).  
Mengeklik satu tabel dua kali menggambar hubungan yang merujuk dirinya sendiri.  
Hubungan baru dimulai dengan `On Delete` dan `On Update` keduanya bernilai `Not set`; ubah keduanya dari menu konteksnya — lihat [ON DELETE dan ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Tekan `Escape`, atau tekan pintasan yang sama lagi, untuk membatalkan. Setelah dibatalkan, pilihan tetap apa adanya, dan `Escape` berikutnya mengosongkannya.

Setelah tabel induk ditentukan, saat penunjuk diarahkan ke tabel tempat hubungan dapat berakhir, tabel tersebut diberi garis tepi dan dua tombol tampil di sampingnya:

- `Create new columns` (`+`) menggambar hubungan dengan kolom kunci asing baru, seperti saat tabel diklik.
- `Map to existing columns` (ikon tautan) mengakhiri penggambaran dan membuka [Petakan Kolom](./relationship-editing.md#map-columns) untuk kedua tabel, sehingga hubungan dapat menggunakan kolom yang sudah dimiliki tabel anak. Tidak ada yang ditulis hingga Anda menekan `Map`.

Tabel induk juga menampilkan tombol tersebut setelah penunjuk bergerak sedikit menjauh dari titik tempat Anda mengekliknya, sehingga hubungan yang merujuk dirinya sendiri juga dapat dipetakan ke kolom yang sudah ada.  
Jari tidak dapat mengarahkan penunjuk tanpa menyentuh, sehingga saat Anda menggambar dengan jari, tombol tersebut tidak pernah tampil dan mengetuk tabel anak langsung menggambar hubungan; pena menampilkannya seperti mouse.  
Jika tabel induk telah kehilangan kunci utamanya saat Anda mencapai tabel anak, misalnya karena pembatalan atau perubahan dari kolaborator, `Create new columns` diredupkan dengan tooltip `<parent> has no primary key to copy`, dan mengeklik tabel anak mengakhiri penggambaran tanpa menggambar apa pun.  
Tooltip itu menamai tabel induk sesuai [Tampilan Nama](./logical-names.md#beyond-the-canvas).

![Menggambar hubungan Satu hingga N dengan ⌘ + ⌥ + 4, lalu hubungan Nol hingga N dari bilah alat kanvas, dengan tabel anak bergaris tepi beserta tombolnya, Map to existing columns dan Create new columns](/img/demo-relationship.webp)

## Menduplikasi tabel dan memo {#duplicating-tables-and-memos}

Tabel dan memo yang sudah ada dapat disalin, ditempel, dan diseret dengan `Alt` menjadi duplikat — lihat [Fungsi terkait tabel](./table-related-functions.md#copyingpasting-tables-and-memos).
