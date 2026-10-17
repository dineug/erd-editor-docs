---
sidebar_position: 3
description: Cara server MCP memutuskan antara mengedit secara live di editor (VS Code, Obsidian, atau IDE JetBrains) dan mengedit file di disk, serta apa yang dilakukan penyimpanan, pembatalan, dan editor yang ditutup di setiap mode.
---

# Live dan headless

Pada setiap panggilan, server mencari editor yang memegang dokumen melalui file kunci yang disimpan editor di `~/.erd-editor/ide/`.
Setiap jendela VS Code dan setiap jendela vault Obsidian yang memiliki ERD Editor menyimpan satu file kunci, sedangkan IDE JetBrains menyimpan satu untuk seluruh IDE, yang mencantumkan setiap proyek yang terbuka di dalamnya.
Editor menghapus file kuncinya saat ditutup.
Apa yang ditemukan server menentukan ke mana perubahan diarahkan.

| Yang ditemukan | Yang dilakukan perubahan |
| --- | --- |
| Editor yang workspace, vault, atau proyek terbukanya memuat dokumen, atau yang sedang membuka dokumen tersebut | **Live.** Membuka dokumen di ERD Editor jika perlu, bergabung ke sesi pengeditan, dan menerapkan perubahan di sana. Perubahan langsung muncul dan disimpan seperti editor menyimpan perubahan Anda sendiri — lihat [Menyimpan](#saving). |
| Tidak ada editor | **Headless.** Memuat file, menerapkan perubahan, dan mengganti file. `erd_save` tidak perlu melakukan apa pun. |
| Editor dengan hub nonaktif | **Ditolak.** Pembacaan tetap berfungsi, dari disk. Perubahan yang ditulis ke file selagi editor terbuka dapat ditimpa oleh penyimpanan berikutnya dari editor tersebut, sehingga server tidak menulis apa pun. |
| Editor yang hub-nya aktif tetapi menggunakan protokol yang berbeda dari protokol server: dengan server `1.0.0`, ekstensi VS Code `3.x`, plugin Obsidian `0.x`, atau plugin JetBrains `0.9.0` atau `0.10.0`; dengan server sebelum `1.0.0`, ekstensi `4.0.0` atau yang lebih baru, atau plugin `1.0.0` atau yang lebih baru | **Ditolak**, termasuk pembacaan, dengan `protocolMismatch`. Pesan menyebutkan sisi yang perlu diperbarui: ekstensi atau plugin, atau server — lihat [Memperbarui](./installation.md#updating). |
| Di Windows, editor yang memegang dokumen melalui jalur lain ke file yang sama: agen menyebutnya melalui folder berbagi jaringan atau drive yang dipetakan di komputer ini, seperti `\\localhost\C$\…`, sedangkan editor memegangnya melalui jalur drive-nya, atau sebaliknya | **Ditolak**, termasuk pembacaan, dengan `invalidPath`. Pesan menyebutkan jalur yang digunakan editor untuk memegang dokumen; panggil lagi dengan jalur tersebut. |
| Di Windows, editor yang tidak dapat diakses agen karena dihalangi Windows: editor yang dijalankan sebagai administrator sedangkan agen tidak, atau editor mana pun saat agen berjalan di sandbox | **Ditolak**, termasuk pembacaan, dengan `hubUnreachable` dan pesan yang menjelaskan alasannya. Jalankan editor dan agen dengan hak akses yang sama, misalnya dengan menjalankan kembali editor tanpa hak administrator. |

Hasil perubahan menyebutkan mode tempat perubahan dijalankan, `live` atau `headless`, dan perubahan yang ditolak menyebutkan alasannya.
Pencarian dijalankan lagi pada setiap panggilan, sehingga panggilan berikutnya ikut berpindah saat editor dibuka atau ditutup.

Saat lebih dari satu editor memegang dokumen, editor yang membukanya diutamakan daripada editor yang hanya melayani folder yang memuatnya, dan di antara editor yang melayani folder, editor yang foldernya paling dalam diutamakan.
Jika seri, seperti saat dua editor sama-sama membukanya, yang diutamakan adalah editor yang file kuncinya paling akhir berubah.
Jadi, dokumen di vault Obsidian yang berada di dalam folder workspace VS Code diarahkan ke Obsidian, kecuali jika VS Code membukanya sedangkan Obsidian tidak.

Panggilan pada satu dokumen dijalankan satu per satu, sesuai urutan kedatangannya di server. Panggilan pada dokumen yang berbeda dijalankan secara bersamaan.

## Live {#live}

Agen bergabung ke editor seperti satu kolaborator tambahan.
Perubahannya langsung sampai ke setiap editor yang membuka dokumen, dan fokusnya digambar pada tabel dan sel yang sedang dieditnya, seperti fokus kolaborator — lihat [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Pembacaan tidak pernah membuka editor. Perubahan membuka dokumen di ERD Editor saat dokumen belum terbuka, tanpa mengambil alih fokus keyboard.

### Menyimpan {#saving}

Setiap editor menyimpan perubahan agen dengan cara yang sama seperti menyimpan perubahan Anda.

Di VS Code, perubahan agen menandai tab sebagai diubah seperti perubahan Anda, dan baru sampai ke disk saat dokumen disimpan.
`erd_save` menyimpannya melalui VS Code, seperti yang dilakukan perintah simpan milik VS Code sendiri. Sebagai gantinya, Anda dapat menyimpan dengan `Ctrl + S` (Windows/Linux) atau `⌘ + S` (Mac).
Menutup editor dengan perubahan agen yang belum disimpan memunculkan pertanyaan apakah perubahan itu ingin disimpan, seperti halnya perubahan lain yang belum disimpan.

Obsidian menyimpan perubahan agen sekitar dua detik setelah pengeditan berhenti, dan menutup tab menyimpannya tanpa bertanya.
IDE JetBrains menuliskannya sepersekian detik setelah pengeditan berhenti, dan menutup tab menuliskan apa yang masih tertunda; tab tidak pernah ditampilkan sebagai diubah.
Di keduanya, `erd_save` langsung menuliskannya.

`erd_save` terlebih dahulu menunggu paling lama dua detik hingga editor memuat setiap perubahan yang dibuat agen.
Alat ini ditolak dengan `notSaved` saat editor tidak dapat memastikannya, atau tidak menulis file: VS Code membiarkan tab tidak tersimpan saat file berubah di disk, dan IDE JetBrains tidak dapat menuliskannya, misalnya selama sebuah dialog terbuka atau saat file tidak dapat ditulis.

Di VS Code dan IDE JetBrains, `erd_save` pada dokumen yang tidak memiliki apa pun lagi untuk disimpan berhasil dan membiarkan file apa adanya.
Hal ini berlaku begitu setiap perubahan tersimpan, yang dilakukan IDE JetBrains dengan sendirinya, dan tetap berlaku selama setiap perubahan berikutnya merupakan perubahan yang dicegah masuk ke file oleh [penguncian](../guide/guides/settings.md#lock), seperti menggulir atau melakukan zoom saat `Viewport` terkunci, atau berpindah tab saat `Canvas Type` terkunci. Setiap penguncian aktif secara default.
File yang tidak dapat ditulis IDE JetBrains tetap ditolak, bahkan dalam keadaan tersebut.

Saat editor menutup dokumen setelah perubahan terakhir agen, panggilan agen berikutnya membawa catatan bahwa perubahan tersebut hanya ada di file jika disimpan sebelum editor ditutup.

### Pembatalan {#undo}

`erd_undo` mengembalikan perubahan terakhir yang dibuat agen, tidak pernah perubahan Anda, dan `erd_redo` menerapkannya kembali.
Perintah [Batalkan](../guide/guides/undo-redo.md) milik editor sendiri bekerja sebaliknya: perintah ini mengembalikan perubahan Anda dan tidak pernah perubahan agen, karena perubahan yang datang dari editor lain tidak dicatat dalam riwayat Anda.

Beberapa perubahan tidak membuat entri pembatalan di editor: `erd_set_database` dan `erd_set_database_name` di antara [alat pengaturan](./tools.md#settings), serta `erd_resize_memo`.
`erd_move_table_group` yang memindahkan grup kurang dari 20 piksel secara total, dengan jarak horizontal dan vertikal dijumlahkan, juga tidak membuatnya, meskipun grup tetap berada di posisi barunya.
Panggilan yang tidak mengubah apa pun juga tidak membuatnya: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique`, atau `erd_set_index_column_order` yang mengatur nilai yang sudah dimiliki dokumen; `erd_add_index_column` dengan kolom yang sudah ada di indeks; `erd_set_table_group` dengan tabel yang sudah berada di grup tersebut (atau yang sudah tidak berada di grup mana pun, dengan `groupId` `null`); `erd_move_table_group` ke titik tempat grup sudah berada; `erd_resize_table_group` ke persegi panjang yang sudah dimiliki grup; `erd_sort_tables` pada dokumen tanpa tabel; atau impor dengan `mode` `append` yang tidak membawa tabel (untuk `erd_import_json`, tidak membawa tabel maupun memo).
`erd_undo` melewati perubahan ini dan menyebutkannya dalam hasilnya.
Perubahan lain, seperti `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color`, dan `erd_set_ddl_script`, membuat entri bahkan saat mengatur nilai yang sudah dimiliki dokumen.

Riwayat pembatalan agen berakhir, dengan catatan dalam hasil, saat:

- Agen bergabung kembali ke dokumen, misalnya setelah editor mengeluarkan agen dari dokumen tersebut.
- Editor keluar, atau menutup dokumen dan berhenti melayaninya, dan agen melanjutkan pengeditan file di disk.
- Editor mengambil alih dokumen yang sedang diedit agen di disk.

Server juga menutup dokumen yang tidak dipanggil agen selama 30 menit, dan riwayat pembatalan ikut hilang bersamanya, tanpa catatan.

### Saat editor ditutup {#when-the-editor-goes-away}

Selama editor memegang dokumen, server tidak pernah beralih ke file dengan sendirinya.
Jika koneksi terputus, server menyambung kembali.
Server baru mengedit file saat editor sudah keluar, atau sudah menutup dokumen dan tidak lagi mencantumkan dokumen tersebut atau folder yang memuatnya, dan server menyebutkan hal itu dalam hasil.
Hal itu terjadi saat Anda menutup diagram yang berada di luar setiap folder yang dilayani editor (di VS Code, diagram yang dibuka dari luar workspace), saat Anda menonaktifkan plugin ERD Editor di Obsidian, dan saat Anda menutup proyek yang memuat dokumen di IDE JetBrains atau menonaktifkan plugin di sana.
Diagram tertutup yang berada di dalam folder yang dilayani editor tetap ditangani editor, dan perubahan agen berikutnya membukanya kembali.

Editor yang masih berjalan, tetapi file kuncinya hilang dan koneksinya tertutup tanpa editor menutup dokumen, menolak perubahan berikutnya dengan `hubGone`.
Pesan menjelaskan apa yang membebaskan dokumen: di VS Code, muat ulang jendela tersebut, atau tutup jendela itu agar agen dapat mengedit file secara langsung; di Obsidian, aktifkan kembali plugin ERD Editor, atau tutup jendela tersebut; di IDE JetBrains, aktifkan kembali plugin, atau keluar dari IDE.

Sebagai gantinya, pembacaan diarahkan ke file di disk, dengan catatan bahwa perubahan yang belum disimpan di editor tidak disertakan, dalam dua kasus: saat editor yang memegang dokumen memiliki hub nonaktif, dan dalam kasus `hubGone` di atas.
Pembacaan yang tidak dapat terhubung ke hub editor ditolak dengan `hubUnreachable`, sama seperti perubahan.

## Headless {#headless}

Saat tidak ada editor yang melayani dokumen, setiap pengeditan memuat file, menerapkan perubahan, dan menulis file kembali.
Penulisan dilakukan ke file sementara di samping dokumen, bernama `.<name>.<id>.tmp`, yang kemudian menggantikan dokumen tersebut, sehingga dokumen tidak pernah tertinggal dalam keadaan setengah tertulis, kecuali di Windows dalam kasus penulisan di tempat yang dijelaskan di bawah.

Sebelum langkah terakhir itu, server memeriksa apakah file berubah di disk selama panggilan.
Jika ya, tidak ada yang ditulis, file dimuat ulang, dan panggilan ditolak dengan `conflict`. Agen memanggil lagi.
File yang berubah di antara dua panggilan cukup dimuat ulang, dan riwayat pembatalan agen sebelum itu dibuang.

File hanya baca dibiarkan apa adanya, dan perubahan ditolak dengan `readonly`: file tanpa izin tulis untuk pemiliknya, atau dengan atribut hanya baca di Windows, seperti file Perforce atau TFVC yang belum di-checkout.
Jadikan file dapat ditulis, lalu panggil lagi. Pembacaan tetap berfungsi.

Jika editor mulai melayani dokumen selama agen mengeditnya di disk, satu perubahan itu ditolak dengan `hubAppeared` dan tidak ada yang ditulis. Panggilan berikutnya mengedit melalui editor.

Di Windows, dua aturan tambahan berlaku:

- Dokumen yang memiliki izin sendiri, berbeda dari izin foldernya, ditulis di tempat alih-alih diganti, agar izin tersebut tetap terjaga, dan file sementara dihapus sesudahnya. Program yang membaca dokumen selama penulisan itu dapat menemukan teks yang tidak dapat diurai.
- File yang sedang dibuka oleh program lain tidak dapat diganti, sehingga server mencoba lagi hingga dua detik. Setiap percobaan terlebih dahulu mencari editor lagi, dan editor yang mulai melayani dokumen sementara itu menolak penulisan dengan `hubAppeared`, atau dengan `blocked` saat hub-nya nonaktif. Jika file masih dibuka setelah dua detik, tidak ada yang ditulis, file dimuat ulang, dan panggilan gagal dengan pesan yang mengutip kesalahan sistem.

## Ditolak {#refused}

Jendela VS Code tetap menyimpan file kuncinya bahkan saat hub-nya nonaktif: saat `dineug.erd-editor.agentHub.enabled` nonaktif, saat workspace tidak dipercaya, atau saat hub-nya tidak dapat mendengarkan koneksi.
Jendela vault Obsidian menyimpan file kuncinya dengan hub nonaktif saat Coding agents dinonaktifkan, dan saat hub-nya tidak dapat mendengarkan koneksi.
IDE JetBrains menyimpan file kuncinya dengan hub nonaktif saat Coding agents dinonaktifkan, saat hub-nya tidak dapat mendengarkan koneksi, dan selama IDE sedang ditutup.

Perubahan pada dokumen seperti itu ditolak dengan `blocked`, karena editor yang terbuka dapat menimpa perubahan yang ditulis ke file pada penyimpanan berikutnya.
Pembacaan tetap berfungsi, dari file di disk.

Agar agen dapat mengedit, aktifkan kembali hub, seperti yang dijelaskan pesan untuk editor tersebut: di VS Code, percayai workspace dan aktifkan pengaturan tersebut, atau muat ulang jendela; di Obsidian, aktifkan Coding agents, atau muat ulang Obsidian; di IDE JetBrains, aktifkan Coding agents, atau mulai ulang IDE jika sudah aktif.

IDE JetBrains juga menolak, dengan `hubDisabled`, untuk mengubah dokumen yang hanya dipegang oleh proyek yang tidak dipercayainya.
Agen tetap dapat membaca dokumen seperti itu, dan `erd_list_documents` mencantumkannya sebagai `readonly`. Percayai proyek tersebut, lalu panggil lagi.

Editor yang tidak menyimpan file kunci tidak melindungi apa pun, dan agen mengedit file di disk bahkan selama diagram terbuka di editor tersebut.
Hal ini berlaku untuk Obsidian atau IDE JetBrains yang diinstal sebagai Flatpak di Linux, IDE JetBrains tanpa JCEF, dan IDE JetBrains yang hub-nya tidak dapat dimulai — lihat [Menyiapkan Obsidian](./installation.md#set-up-obsidian) dan [Menyiapkan IDE JetBrains](./installation.md#set-up-a-jetbrains-ide).
Ekstensi VS Code sebelum `3.0.0` dan plugin JetBrains sebelum `0.9.0` juga tidak menyimpannya, karena keduanya tidak memiliki hub.

## Dokumen {#documents}

Dokumen disebutkan melalui `path`, berupa jalur absolut atau relatif terhadap direktori kerja server.

- Dokumen baru berformat `.erd.json`. `erd_open_document` dengan `create` membuat file, dengan menambahkan `.erd.json` pada nama yang tidak memiliki ekstensi. Seperti diagram baru di editor, dokumen baru memiliki setiap [penguncian](../guide/guides/settings.md#lock) dalam keadaan aktif, sehingga menggulir, melakukan zoom, berpindah tab, atau memilih bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip yang lain di editor tidak pernah mengubah file. Tidak ada alat yang mengaktifkan atau menonaktifkan satu penguncian: Anda melakukannya di tab Pengaturan editor. `erd_import_json` dalam mode `replace` mengganti semuanya dengan penguncian dari dokumen yang dimuatnya — lihat [Impor](./tools.md#import).
- File `.erd`, `.vuerd`, dan `.vuerd.json` yang sudah ada juga dapat dibuka. Jalur dengan ekstensi lain ditolak dengan `invalidPath`.
- Di Windows, jalur yang memuat nama yang tidak disimpan Windows persis seperti yang ditulis ditolak dengan `invalidPath` sebelum dokumen dibaca atau ditulis, termasuk pembacaan: nama dengan titik dua atau karakter lain yang ditolak Windows, seperti `orders:v2.erd`; nama perangkat seperti `NUL.erd` atau `CON.erd`, dalam huruf besar maupun kecil; atau nama yang diakhiri titik atau spasi. Ganti namanya, misalnya dengan `-` sebagai pengganti `:`.
- File yang bukan dokumen yang dapat dibaca editor, seperti file yang masih berisi penanda konflik merge, ditolak dengan `invalidDocument` dan dibiarkan apa adanya. File tersebut tidak pernah dimuat sebagai diagram kosong lalu ditulis kembali.

Agen mengubah dokumen hanya melalui alat dan diinstruksikan untuk tidak pernah menulis file secara langsung.

`erd_list_documents` mencantumkan dokumen beserta `path`, `open`, `active`, `dirty`, dan `readonly`.
Alat ini menanyakan editor yang melayani direktori kerja, yang dipilih dengan cara yang sama seperti untuk dokumen, lalu mencantumkan diagram yang terbuka di editor tersebut, kemudian file ERD yang dilayaninya: file di folder workspace jendela VS Code, di vault Obsidian, atau di setiap proyek yang terbuka di IDE JetBrains.
Jika tidak ada, alat ini mencantumkan file ERD di dalam direktori kerja, dengan file hanya baca ditandai `readonly` dan, di Windows, nama yang tidak disimpan Windows persis seperti yang ditulis tidak disertakan.
