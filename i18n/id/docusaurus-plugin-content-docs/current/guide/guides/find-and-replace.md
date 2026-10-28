---
sidebar_position: 10
description: Mencari nama tabel, kolom, indeks, dan grup tabel, nama logis, komentar, serta memo dari bagian atas Penjelajah, menelusuri kecocokan satu per satu di pohon dan di kanvas, lalu mengganti satu kecocokan atau semuanya.
---

# Temukan dan Ganti

Menemukan teks di seluruh diagram, membawa Anda ke setiap kecocokan di kanvas ERD, dan mengganti satu kecocokan atau semuanya.  
Fitur ini mencari delapan jenis teks: nama tabel, komentar tabel, nama kolom, komentar kolom, memo, nama indeks, nama grup tabel, dan [nama logis](./logical-names.md) tabel dan kolom — lihat [Apa yang dicari](#what-it-searches).

Fitur ini berada di bagian atas [Penjelajah](./explorer.md), panel yang tertambat di sebelah kiri kanvas ERD, di antara bilah judul Penjelajah dan pohonnya. Fitur ini tidak memiliki judul sendiri. Dari atas ke bawah, fitur ini memuat:

- Kotak Temukan, dengan tiga [opsi](#options) di dalamnya di bagian ujung, dan panah `Toggle Replace` di depannya.
- Baris `Replace`, yang awalnya diciutkan — lihat [Mengganti](#replacing).
- Penghitung, lalu panah atas dan bawah untuk menelusuri kecocokan satu per satu, serta tombol tiga titik `Search In`.
- [Jenis teks](#what-it-searches), yang dibentangkan oleh `Search In`.

Selama kotak Temukan berisi teks, pohon Penjelajah menampilkan kecocokan — lihat [Hasil](#the-results).  
Pada kanvas yang pendek, area pencarian tetap setinggi penuh, dan pohon di bawahnya mengambil sisa ruang dan bergulir.

![Membuka Temukan dan Ganti di Penjelajah dengan ⌘ + F, menelusuri enam kecocokan member satu per satu, lalu, dengan Preserve Case aktif, mengganti keenamnya dengan user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Membuka dan menutup {#opening-and-closing}

`Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac), serta `Toggle Explorer` di [Pencarian Cepat](./quick-search.md) atau di menu konteks kanvas, membuka Penjelajah pada pencariannya. Kursor teks berpindah ke kotak Temukan dengan teksnya terpilih, dan kueri dicari ulang tanpa kecocokan saat ini.  
Tombol `Explorer` di bilah alat hanya membuka atau menutup panel. Tombol ini tidak menempatkan kursor teks di kotak Temukan, dan membiarkan kueri serta kecocokan saat ini seperti semula.  
Saat tombol pintasan hanya mengembalikan kursor teks ke Penjelajah yang sudah tampil, seperti yang terjadi selama Pencarian Cepat atau salah satu dari lima dialog di [Dialog di sampingnya](./explorer.md#dialogs-beside-it) terbuka, kecocokan saat ini tetap dipertahankan.

Cara menutup Penjelajah, apa yang dilakukan tombol pintasan dan dua item `Toggle Explorer` selama Penjelajah terbuka, serta dialog yang ditutupnya dibahas di [Membuka dan menutup](./explorer.md#opening-and-closing) pada halaman Penjelajah.  
[Saat Penjelajah menyingkir](./explorer.md#when-it-stands-aside) membahas cara tab lain dan mode Zen menyembunyikannya, serta cara Penampil Perbedaan, Perjalanan Waktu, dan pratinjau Tata Letak Otomatis menyembunyikannya dan mencegahnya terbuka. [Di samping kanvas](./explorer.md#beside-the-canvas) membahas editor yang terlalu sempit untuknya.

Membuka kembali mempertahankan kueri terakhir, beserta teks Ganti, [opsi](#options), [jenis teks](#what-it-searches) yang aktif, dan apakah baris `Replace` serta jenis teks dalam keadaan terbentang.  
Semua itu dipertahankan selama editor tetap terbuka dan tidak disimpan di dokumen. Editor yang baru dibuka dimulai dengan semua opsi nonaktif, baris `Replace` dan jenis teks diciutkan, dan hanya empat jenis nama serta `Logical names` yang aktif — lihat [Apa yang dicari](#what-it-searches).

## Bilah pencarian browser {#the-browsers-find-bar}

Selama editor memiliki fokus keyboard, `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac) ditangani oleh editor di setiap tab, termasuk di kotak teksnya sendiri, sehingga bilah pencarian browser tidak terbuka.  
Tombol ini diteruskan ke browser atau host selama Penampil Perbedaan, Perjalanan Waktu, atau pratinjau Tata Letak Otomatis terbuka, dan selama fokus berada di luar editor.

- Aplikasi web dan Google Drive: bilah pencarian browser hanya terbuka dalam dua kasus tersebut.
- VS Code: ekstensi menonaktifkan widget pencarian milik VS Code di ERD Editor, sehingga tombol ini tidak pernah membukanya di sana.
- Obsidian: tombol ini sampai ke editor setiap kali tab diagram aktif, menggantikan `Search current file` milik Obsidian.
- IDE JetBrains: jika keymap IDE menahan `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac) untuk dirinya sendiri, buka pencarian dari `Toggle Explorer` di Pencarian Cepat atau di menu konteks kanvas, atau buka Penjelajah dengan tombol `Explorer` di bilah alat lalu klik di kotak Temukan.

Halaman yang menyematkan editor dapat memindahkan atau menghapus tombol ini — lihat [Mengubah pintasan](#changing-the-shortcut).

## Apa yang dicari {#what-it-searches}

Delapan tombol memilih jenis teks yang dicari, dengan urutan berikut: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names`, dan `Logical names`.  
Awalnya tombol-tombol ini diciutkan. Tombol `Search In` di ujung baris penghitung membentangkannya di bawah baris tersebut dan menciutkannya kembali, serta disorot selama tombol-tombol itu tampil.  
Tombol jenis yang disorot berarti aktif. Klik salah satunya untuk mengaktifkan atau menonaktifkannya, dan pencarian dijalankan ulang. Jika kedelapannya nonaktif, tidak ada yang ditemukan.

Pencarian pertama kali terbuka dengan empat jenis nama, yaitu `Table names`, `Column names`, `Index names`, dan `Table group names`, serta dengan `Logical names`, sehingga penggantian nama tidak menjangkau komentar dan memo kecuali jika Anda mengaktifkannya.  
`Logical names` merupakan satu jenis untuk nama logis tabel maupun kolom.  
Nama indeks adalah nama indeks di tab `Indexes` pada [Properti Tabel](./table-related-functions.md#indexes), bukan kunci `PK_` dan `UQ_` yang tercantum di atasnya.

Tidak ada hal lain yang dicari: bukan tipe data, domain kolom, nilai default, kolom suatu indeks, nama database, [Skema SQL](./schema-sql.md) beserta skrip `Before tables` dan `After tables`, kode yang dihasilkan, ataupun lembar di tab [Kamus](./dictionary.md), yang memiliki [pencariannya sendiri](./dictionary.md#searching).  
Nama logis dicari apa pun yang ditampilkan [Tampilan Nama](./logical-names.md#name-view), termasuk tampilan `Physical Names`, yang kanvasnya tidak menampilkan nama logis sama sekali. Komentar yang disembunyikan oleh [opsi tampilan tabel](./table-related-functions.md#table-view-options) juga tetap dicari. Memo yang disembunyikan dengan View Option → `Memos`, dan [grup tabel](./table-groups.md#hiding-groups) yang disembunyikan dengan View Option → `Table Groups`, tidak dicari, bahkan saat tombolnya aktif, sehingga `Replace All` tidak pernah menulis ulang memo atau mengganti nama grup yang tidak dapat Anda lihat.

## Opsi {#options}

Tiga tombol alih di dalam kotak Temukan, di bagian ujungnya, mengubah cara kueri dicocokkan. Namanya tertera di tooltip masing-masing, dan tombol disorot selama aktif. Ketiganya awalnya nonaktif, dan mengubah salah satunya menjalankan pencarian ulang.

- `Match Case`: jika nonaktif, pencocokan tidak membedakan huruf besar dan kecil.
- `Match Whole Word`: kecocokan hanya dihitung jika tidak bersambung ke dalam kata di sisi mana pun. Huruf, angka, dan tanda dari aksara apa pun dihitung sebagai karakter kata, begitu pula garis bawah. Karena itu, `user` cocok di `user id` dan `user.id`, tetapi tidak di dalam `users`, `user_id`, atau `superuser`. Ujung kueri yang sendirinya bukan karakter kata, seperti titik pada `.id`, tidak memerlukan batas di sana.
- `Use Regular Expression`: kueri adalah ekspresi reguler JavaScript, selalu dalam mode Unicode, sehingga `\p{L}` berfungsi. `^` dan `$` cocok di awal dan akhir setiap baris dari komentar atau memo multibaris, dan `.` tidak melintasi jeda baris. Urutan escape yang sering diketik dalam nama, seperti `\_` dan `\-`, diterima.

Ekspresi reguler yang tidak dapat diurai, seperti `user(`, tidak menemukan apa pun: penghitung bertuliskan `Invalid regular expression` berwarna merah, dan kotak Temukan diberi garis tepi merah.  
`Match Case` dan `Match Whole Word` juga berlaku untuk ekspresi reguler. Kecocokan tanpa panjang, seperti `^` saja, tidak pernah dicantumkan.

Teks biasa dicari selagi Anda mengetik. Ekspresi reguler dicari begitu pengetikan berhenti sejenak, atau seketika saat Anda menekan `Enter`, tombol navigasi, `Replace`, atau `Replace All`, atau memilih baris yang memuat kecocokan.  
Pencarian tidak memiliki batas waktu, sehingga ekspresi reguler yang melakukan backtracking berlebihan dapat membuat editor tidak responsif hingga pencarian selesai.

Tombol alih keempat, `Preserve Case`, berada di dalam kotak `Replace` di bagian ujungnya, sehingga hanya tampil selama baris `Replace` terbentang. Awalnya tombol ini nonaktif. Tombol ini tidak mengubah apa pun yang ditemukan, hanya cara `Replace` dan `Replace All` menuliskan teks pengganti — lihat [Mengganti](#replacing). Mengaktifkan atau menonaktifkannya tidak menjalankan pencarian, dan kecocokan saat ini tetap dipertahankan.

## Hasil {#the-results}

Penghitung, di awal baris di bawah kotak-kotak tersebut, menunjukkan posisi Anda. Penghitung kosong selama kotak Temukan kosong.

| Penghitung | Kapan |
| --- | --- |
| `No results` | Tidak ada yang cocok. |
| `12 matches` | Sebelum Anda berpindah ke salah satunya; `1 match` untuk satu kecocokan. |
| `3 of 12` | Kecocokan ketiga adalah kecocokan saat ini. |
| `Invalid regular expression` | Ekspresi reguler tidak dapat diurai. |
| `Replaced 12 matches` | `Replace All` mengubah kecocokan sebanyak itu; `Replaced 1 match` untuk satu kecocokan. |
| `No changes` | `Replace All` tidak mengubah apa pun. |
| `No more matches` | Rangkaian `Replace` telah kembali ke titik awalnya — lihat [Mengganti](#replacing). |

`Replaced …`, `No changes`, dan `No more matches` digantikan oleh penghitung pada pencarian atau perpindahan berikutnya, termasuk pencarian yang dipicu oleh perubahan atau pembatalan.

Selama kotak Temukan berisi teks, [pohon](./explorer.md#the-tree) Penjelajah menampilkan hasil alih-alih seluruh diagram: hanya baris yang memuat kecocokan dan baris di atasnya. Saat tidak ada yang cocok, atau ekspresi reguler tidak dapat diurai, pohon kosong. Menghapus kueri mengembalikan seluruh pohon, dengan keadaan ciut seperti sebelumnya.

- `Tables`, `Table Groups`, dan `Memos` hanya tampil jika memuat kecocokan, dan angka pada setiap folder adalah jumlah baris tepat di bawahnya dalam hasil.
- Di bawah `Tables` tercantum tabel yang memuat kecocokan, menurut nama, tidak pernah menurut nama logis. Di bawah setiap tabel tercantum satu baris untuk setiap kecocokan di komentarnya, lalu folder `Columns` berisi kolom yang memuat kecocokan, sesuai urutan kolom, masing-masing dengan satu baris untuk setiap kecocokan di komentarnya, lalu folder `Indexes` berisi indeks yang namanya cocok. Tidak ada folder `Foreign Keys`.
- Di bawah `Table Groups` tercantum grup yang namanya cocok, menurut nama, tanpa tabel-tabelnya. Tabel yang ditemukan tampil di bawah `Tables`.
- Di bawah `Memos` tercantum memo yang memuat kecocokan, sesuai urutan dokumen, masing-masing ditampilkan dengan baris pertamanya dan dengan satu baris untuk setiap kecocokan di dalamnya.

Kecocokan dalam nama disorot di baris nama itu sendiri, sehingga nama yang memuat kueri dua kali menjadi satu baris dengan dua sorotan. Kecocokan dalam nama logis tabel atau kolom juga ditempatkan pada baris tabel atau kolom tersebut, tidak pernah pada barisnya sendiri.  
Baris-baris tersebut menamai tabel atau kolom seperti yang ditampilkan [Tampilan Nama](./logical-names.md#beyond-the-canvas), dan masing-masing dari dua nama yang dapat ditampilkan sebuah baris hanya menyorot kecocokannya sendiri. Baris yang hanya ditemukan pada nama yang dihilangkan tampilannya, yaitu nama logis dalam tampilan `Physical Names` atau nama dalam tampilan `Logical Names`, menambahkan nama itu setelah nama yang ditampilkannya, dengan warna redup seperti dalam tampilan `Both Names`, dan kecocokannya disorot. Jika nama yang ditampilkannya juga memuat kecocokan, baris hanya menampilkan nama itu, sehingga kecocokan pada nama yang dihilangkan tampilannya dihitung dan ditelusuri tetapi tidak disorot.  
Kecocokan dalam komentar atau memo memiliki barisnya sendiri: gelembung ucapan untuk komentar tabel atau kolom, atau catatan tempel untuk memo, lalu kutipan teks dengan kecocokan yang disorot. Teks yang panjang dipotong dengan `…`, dan jeda baris ditampilkan sebagai spasi. Arahkan penunjuk ke baris tersebut untuk melihat seluruh teks.  
Setiap baris lainnya tampak seperti di luar pencarian: kolom menampilkan tipe datanya, indeks menampilkan kolom-kolomnya, dan nama kosong bertuliskan `unnamed`.

Setiap baris yang memiliki baris di bawahnya tampil terbentang saat pencarian dimulai. Baris yang Anda ciutkan, atau yang diciutkan oleh `Collapse All`, tetap diciutkan hingga kecocokan di bawahnya menjadi kecocokan saat ini, atau hingga kueri, `Match Case`, `Match Whole Word`, `Use Regular Expression`, atau jenis teks berubah, atau pencarian dibuka lagi dengan tombol pintasan atau item `Toggle Explorer`.  
Baris kecocokan saat ini disorot dan digulir hingga terlihat. Pohon mencantumkan setiap kecocokan, berapa pun jumlahnya.  
Kecocokan ditelusuri sesuai urutan pohon: tabel demi tabel, nama logis, nama, dan komentar tabel, lalu nama logis, nama, dan komentar setiap kolomnya sesuai urutan kolom, lalu nama indeksnya; lalu nama grup tabel; lalu memo.

Hasil mengikuti dokumen selama Penjelajah tampil. Begitu pengeditan berhenti sejenak, setiap perubahan pada teks yang dicari menjalankan pencarian ulang, dan kecocokan saat ini tetap dipertahankan jika masih ada. Ini mencakup nama, nama logis, komentar, atau teks memo yang diedit, tabel, kolom, indeks, memo, atau grup tabel yang ditambahkan atau dihapus, kolom yang dipindahkan, serta memo atau grup tabel yang disembunyikan atau ditampilkan dengan View Option, yang mengeluarkan kecocokannya dari pohon atau mengembalikannya. Perubahan di kanvas, pembatalan atau pengulangan, impor, dan perubahan oleh kolaborator atau agen pemrograman semuanya ikut dihitung. Memilih, memindahkan tabel, memo, atau grup di kanvas, menggulir, memperbesar/memperkecil, dan mengarahkan penunjuk tidak dihitung.  
Penggantian Tampilan Nama juga tidak dihitung karena tidak mengubah teks apa pun yang dibaca pencarian: kecocokan yang sama tetap ada, dan baris-baris mengambil nama yang ditampilkan dalam tampilan baru.  
Perubahan yang dibuat selama Penjelajah tertutup atau tidak terlihat dicari begitu Penjelajah tampil kembali.

## Menuju kecocokan {#going-to-a-match}

`Enter` di kotak Temukan menuju kecocokan berikutnya, dan `Shift + Enter` menuju kecocokan sebelumnya. Tombol panah atas dan bawah setelah penghitung melakukan hal yang sama; tooltipnya bertuliskan `Previous Match (Shift+Enter)` dan `Next Match (Enter)`, dan keduanya dinonaktifkan selama tidak ada kecocokan.  
Perpindahan berputar di kedua ujung. Tidak ada kecocokan saat ini hingga Anda pertama kali berpindah, sehingga `Enter` pertama menuju kecocokan pertama dan `Shift + Enter` pertama menuju kecocokan terakhir.

Klik pada baris hasil, atau `Enter` atau `Space` saat keyboard berada di baris itu, melakukan salah satu hal berikut:

- Baris yang nama atau nama logisnya sendiri memuat kecocokan menuju kecocokan pertamanya, dengan kecocokan nama logis lebih dulu daripada kecocokan nama.
- Baris yang menampilkan kutipan komentar atau memo menuju kecocokan tersebut.
- Baris lain apa pun, seperti tabel yang nama dan nama logisnya tidak cocok atau baris memo itu sendiri, menuju apa yang diwakili baris tersebut dan membiarkan kecocokan saat ini apa adanya — lihat [Menuju baris](./explorer.md#going-to-a-row).
- Folder diciutkan atau dibentangkan.

Setiap kali sebuah kecocokan menjadi kecocokan saat ini, pohon membentangkan baris yang diciutkan di atasnya dan memindahkan baris fokus keyboard ke sana, sehingga tombol panah di pohon melanjutkan dari baris itu.

Menuju kecocokan menutup Properti Tabel jika sedang terbuka, lalu:

- Untuk nama, nama logis, atau komentar tabel atau kolom, tindakan ini hanya memilih tabel tersebut, membawanya ke depan, dan menempatkan sel yang difokuskan pada sel yang memuat kecocokan. Kecocokan dalam komentar yang disembunyikan oleh [opsi tampilan tabel](./table-related-functions.md#table-view-options) menempatkan sel yang difokuskan pada nama di sebelahnya sebagai gantinya. Jika [Tampilan Nama](./logical-names.md#name-view) tidak menampilkan sel untuk nama atau nama logis, sel yang difokuskan ditempatkan pada sel yang ditampilkan di tempatnya: nama dalam tampilan `Physical Names`, nama logis dalam tampilan `Logical Names`.
- Untuk nama indeks, tindakan ini hanya memilih tabel indeks tersebut dan membawanya ke depan, dengan sel yang difokuskan pada nama tabel, atau nama logisnya dalam tampilan `Logical Names` dan `Both Names`, kecuali jika sel itu sudah berada di tabel tersebut. Nama indeks tidak digambar di kanvas.
- Untuk nama grup tabel, tindakan ini hanya memilih grup tersebut dan membawanya ke depan bersama tabel-tabelnya.
- Untuk memo, tindakan ini hanya memilih memo tersebut dan membawanya ke depan.

Kanvas hanya bergulir jika tujuannya belum tampil dengan baik, dan zoom tidak pernah berubah — lihat [Tempat lompatan berakhir](./table-related-functions.md#where-a-jump-lands).

Setelah `Enter` di kotak Temukan, kursor teks tetap di sana, dan setelah baris dipilih, keyboard tetap berada di pohon, sehingga apa yang Anda ketik berikutnya tidak sampai ke tabel yang dipilih.  
Menuju kecocokan tidak pernah memulai atau menyelesaikan hubungan yang sedang digambar.

## Mengganti {#replacing}

Baris `Replace` awalnya diciutkan. Panah di depan kotak Temukan, yang tooltipnya bertuliskan `Toggle Replace`, membentangkan dan menciutkannya. Menciutkannya tetap mempertahankan teks Ganti.  
Baris ini memuat kotak `Replace`, dengan tombol alih `Preserve Case` di dalamnya di bagian ujung, dan dua tombol yang tooltipnya bertuliskan `Replace (Enter)` dan `Replace All`. Kedua tombol dinonaktifkan selama tidak ada kecocokan.

`Replace` dijalankan dengan `Enter` di kotak Ganti, dengan atau tanpa `Shift`, atau dengan tombolnya:

- Jika tidak ada kecocokan saat ini, penekanan pertama hanya menuju kecocokan berikutnya, sehingga Anda melihat apa yang akan diubahnya sebelum ada yang berubah.
- Jika ada kecocokan saat ini, tindakan ini mengganti kemunculan itu saja, membiarkan kemunculan lain dalam teks yang sama, dan melanjutkan ke kecocokan berikutnya setelah teks yang ditulisnya. Teks yang ditulisnya dilewati bahkan saat teks itu memuat kueri: mengganti `user` dengan `super_user` tidak lantas berhenti di dalam `super_user`.
- Kecocokan yang akan ditulis ulang oleh penggantian persis seperti semula dibiarkan apa adanya, dan penekanan tersebut hanya melanjutkan ke kecocokan berikutnya.
- Penggantian dan guliran ke kecocokan berikutnya merupakan satu langkah pembatalan.

Rangkaian penekanan `Replace` berhenti begitu kembali ke titik awalnya. Penghitung bertuliskan `No more matches`, tidak ada kecocokan saat ini, dan penekanan selanjutnya tidak mengganti apa pun.  
Karena itu, `Customer` yang diganti dengan `Big Customer` diganti satu kali, alih-alih bertambah menjadi `Big Big Customer`.  
Menuju kecocokan, mengubah kueri, `Match Case`, `Match Whole Word`, `Use Regular Expression`, atau jenis teks, membuka pencarian dengan tombol pintasan atau item `Toggle Explorer`, atau `Replace All` memulai rangkaian baru, begitu pula pembatalan atau perubahan lain apa pun yang mengubah teks tempat rangkaian dimulai. Mengubah teks Ganti atau `Preserve Case` tidak memulai rangkaian baru, begitu pula tombol pintasan saat hanya mengembalikan kursor teks ke Penjelajah yang sudah tampil.  
Selama rangkaian berlangsung, tabel atau grup tabel yang diganti namanya oleh rangkaian tersebut tetap berada di tempatnya di pohon dan dalam urutan kecocokan, sehingga penggantian nama yang akan memindahkannya ke urutan lebih belakang tidak membuatnya dijumpai lagi. Rangkaian berikutnya mengembalikan pohon ke urutan nama, dan baris yang diganti namanya berpindah ke tempat barunya.

`Replace All` dijalankan dengan `Ctrl + Enter` (Windows/Linux) atau `⌘ + Enter` (Mac) di kotak Ganti, atau dengan tombolnya:

- Tindakan ini mengganti setiap kecocokan dalam jenis teks yang aktif dan membiarkan jenis lainnya, kecuali nama fisik yang dihasilkan dari nama logis yang diganti, yang tetap ditulisnya bahkan selama `Table names` dan `Column names` nonaktif — lihat di bawah. Dengan jenis default, tindakan ini mengganti nama tabel, kolom, indeks, dan grup tabel, serta menulis ulang nama logis tabel dan kolom; komentar dan memo tidak tersentuh.
- Semua yang diubahnya merupakan satu langkah pembatalan — lihat [Satu gerakan, satu langkah](./undo-redo.md#one-gesture-one-step).
- Penghitung bertuliskan `Replaced N matches`, yang hanya menghitung kemunculan yang teksnya benar-benar berubah. Jika tidak ada yang berubah, penghitung bertuliskan `No changes` dan tidak ada yang dicatat di riwayat, seperti saat mengganti ekspresi reguler `(user)` dengan `$1`.
- Hasil kemudian dicari ulang tanpa kecocokan saat ini, sehingga hasil dapat mencantumkan kecocokan yang terdapat dalam teks baru.

Keduanya membaca setiap teks sebagaimana adanya saat Anda menekan, bukan sebagaimana ditemukan oleh pencarian terakhir.

Cara teks Ganti digunakan:

- Tanpa `Use Regular Expression`, `$` tidak memiliki arti khusus, dan teks Ganti digunakan sebagaimana diketik, kecuali bentuk huruf besar-kecil yang diberikan oleh `Preserve Case`.
- Dengan `Use Regular Expression`, `$1` hingga `$99`, `$<name>`, `$&`, `` $` ``, `$'`, dan `$$` dijabarkan seperti di `String.prototype.replace` milik JavaScript.
- Tanpa `Preserve Case`, bentuk huruf besar-kecil teks yang cocok tidak dibawa: dengan `Match Case` nonaktif, mengganti `user` dengan `member` mengubah `Users` menjadi `members`.
- Dengan `Preserve Case`, bentuk huruf besar-kecil setiap teks pengganti mengikuti teks yang digantikannya, setelah `$1` dan lainnya dijabarkan, sehingga penggantian yang sama mengubah `Users` menjadi `Members`:
  - Kecocokan yang seluruhnya huruf besar menghasilkan teks pengganti yang seluruhnya huruf besar, dan kecocokan yang seluruhnya huruf kecil menghasilkan teks pengganti yang seluruhnya huruf kecil: `USER` dengan `account` menghasilkan `ACCOUNT`, dan `user` dengan `Account` menghasilkan `account`.
  - Kecocokan lainnya memberi karakter pertama teks pengganti bentuk huruf yang sama dengan karakter pertama kecocokan, dan membiarkan sisanya sebagaimana diketik: `UserId` dengan `accountKey` menghasilkan `AccountKey`, dan `uSER` dengan `AccountKey` menghasilkan `accountKey`. Saat karakter pertama kecocokan tidak memiliki bentuk besar-kecil, teks pengganti dibiarkan sebagaimana diketik: `_Ab` dengan `xyz` menghasilkan `xyz`.
  - Saat kecocokan dan teks pengganti sama-sama memuat `-`, atau sama-sama memuat `_`, dan pemisah tersebut membagi keduanya menjadi jumlah bagian yang sama, bentuk huruf setiap bagian mengikuti bagian yang bersesuaian: `USER_id` dengan `account_key` menghasilkan `ACCOUNT_key`, dan `User-Name` dengan `account-key` menghasilkan `Account-Key`. Saat `-` dan `_` sama-sama membagi keduanya dengan cara itu, bentuk huruf keseluruhannya ditentukan sebagai satu kesatuan.
  - Kecocokan tanpa huruf yang memiliki bentuk besar-kecil, seperti `123`, membiarkan teks pengganti sebagaimana diketik.
  - Kecocokan yang ditulis ulang seperti semula tidak dihitung: dengan `Match Case` nonaktif, mengganti `customer` dengan `Customer` menulis ulang `customer`, `Customer`, dan `CUSTOMER` seperti semula, dan tidak satu pun yang dihitung.
- Kotak Ganti yang kosong menghapus kecocokan.

Penggantian adalah perubahan biasa, sama seperti mengetik sendiri nama tabel, nama kolom, nama logis, komentar, atau teks memo yang baru, mengganti nama indeks di Properti Tabel, atau mengganti nama grup tabel.  
Penggantian dicatat di riwayat dan sampai ke kolaborator serta agen pemrograman seperti perubahan lainnya.

Karena itu, nama tabel atau kolom yang ditulis oleh penggantian menjadi nama buatan Anda sendiri, yang dibiarkan apa adanya oleh nama logis yang ditulis kemudian hingga [Hasilkan ulang nama-nama fisik](./dictionary.md#derive-physical-names-again) mengembalikannya ke kamus. Sebaliknya, nama yang dikosongkan oleh penggantian kembali menjadi milik kamus, seperti nama lain yang dikosongkan — lihat [Nama buatan Anda sendiri](./dictionary.md#names-of-your-own).  
Selama nama fisik tabel atau kolom kosong atau merupakan nama yang dihasilkan, nama logis yang diganti menghasilkan nama fisik itu dari kamus, seperti saat sel nama logis ditutup dengan nama logis baru — lihat [Menghasilkan nama fisik](./dictionary.md#deriving-physical-names). Dalam hal itu, kolom yang nama logis barunya merupakan istilah juga mengambil domain istilah tersebut, beserta tipe data domain itu. Apa yang dihasilkannya merupakan bagian dari langkah pembatalan penggantian dan tidak dihitung dalam `Replaced N matches`.  
Saat satu kali `Replace All` menulis ulang nama logis sekaligus nama tabel atau kolom yang sama, nama yang ditulisnya diutamakan atas nama yang akan dihasilkan nama logis baru.

## Tombol di kotak pencarian {#keys-in-the-search-fields}

- Di kotak Temukan, `Enter` menuju kecocokan berikutnya dan `Shift + Enter` menuju kecocokan sebelumnya.
- Di kotak Ganti, `Enter` mengganti, dengan atau tanpa `Shift`, dan `Ctrl + Enter` (Windows/Linux) atau `⌘ + Enter` (Mac) mengganti semua.
- Selama metode input sedang menyusun teks di salah satu kotak, `Enter` ditangani oleh penyusunan tersebut dan tidak berpindah maupun mengganti.

Apa yang dilakukan `Escape`, pintasan editor yang tetap berfungsi, dan setiap tombol lainnya di kotak-kotak ini dibahas di [Tombol di Penjelajah](./explorer.md#keys-in-the-explorer).

## Editor hanya baca {#read-only-editors}

Di editor [`readonly`](../../api/erd-editor-element.md#readonly), pencarian hanya menemukan. Tidak ada panah `Toggle Replace` dan tidak ada baris `Replace`, sehingga tidak ada kotak Ganti, `Preserve Case`, `Replace`, maupun `Replace All`.  
Kotak Temukan, tiga opsinya, jenis teks, penghitung, hasil, dan menuju kecocokan semuanya berfungsi. Menuju kecocokan memilih apa yang didaratinya, seperti pada [Menuju kecocokan](#going-to-a-match), dan pilihan itu adalah satu-satunya yang dibuat editor hanya baca: klik di kanvas yang tidak bergerak menghapusnya.  
Buka pencarian dengan tombolnya atau dengan `Toggle Explorer` di Pencarian Cepat, karena menu konteks kanvas tidak memiliki `Toggle Explorer` di sana. Bagian Penjelajah lainnya dibahas di [Editor hanya baca](./explorer.md#read-only-editors) pada halaman Penjelajah.

Di VS Code, revisi diagram, seperti revisi Git atau entri Local History, terbuka sebagai teks JSON. Jika dibuka kembali sebagai diagram dengan `Reopen Editor With...`, revisi tersebut hanya baca dan mendapatkan pencarian ini, yang hanya menemukan.

## Mengubah pintasan {#changing-the-shortcut}

Halaman yang menyematkan editor dapat mengubah kombinasi tombol `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac), atau menghapusnya, dengan nama `findReplace` melalui [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Jika pintasan dihapus, tombol tersebut diserahkan kepada halaman di setiap tab. Tombol `Explorer` di bilah alat tetap membuka dan menutup Penjelajah, dan `Toggle Explorer` di Pencarian Cepat dan di menu konteks kanvas tetap membuka pencarian atau menutup Penjelajah, tetapi tidak satu pun yang menampilkan pintasan, sehingga tooltip tombol tersebut hanya bertuliskan `Explorer`. Baris `Toggle Explorer` pada tab [Pintasan](./settings.md#shortcuts) di Pengaturan juga tidak menampilkan tombol apa pun. Jika kombinasi tombolnya diubah, semuanya menampilkan tombol baru.
