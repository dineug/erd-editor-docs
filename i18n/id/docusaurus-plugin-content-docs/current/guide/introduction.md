---
sidebar_position: 1
description: erd-editor adalah editor diagram hubungan entitas untuk browser, Google Drive, VS Code, IntelliJ, Obsidian, dan halaman Anda sendiri.
---

# Pengantar

erd-editor adalah editor diagram hubungan entitas.
Editor ini tersedia sebagai aplikasi web, aplikasi Google Drive, ekstensi VS Code, plugin IntelliJ, plugin Obsidian, serta sebagai elemen kustom `<erd-editor>` yang dapat Anda sematkan di halaman Anda sendiri.
Semuanya menggunakan satu editor dan satu format dokumen yang sama.

![Diagram toko: mengarahkan penunjuk ke hubungan, menambahkan kolom, dan memfokuskan orders di Alur](/img/demo-overview.webp)

## Tempat mendapatkannya {#where-to-get-it}

| Platform | Instalasi | Yang Anda dapatkan |
| --- | --- | --- |
| Aplikasi web | [erd-editor.io](https://erd-editor.io) | PWA yang dapat diinstal, berfungsi secara offline, kolaborasi waktu nyata |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | Menambahkan ERD Editor ke menu Open with dan New di Drive, serta menyimpan kembali ke file yang sama |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | Membuka file `.erd.json` di editor kustom |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | Editor yang sama, untuk IDE berbasis IntelliJ |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | Membuka file `.erd` dan `.erd.json` di tab vault, khusus desktop |
| Halaman Anda | `npm install @dineug/erd-editor` | Elemen kustom `<erd-editor>` tanpa framework — lihat [Instalasi](../api/installation.md) |
| Agen pemrograman | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | Server MCP yang memungkinkan Claude Code, Codex, atau klien lain mengedit diagram secara live di VS Code, IDE JetBrains, atau Obsidian, atau di file itu sendiri |

Untuk mencobanya di IDE, buat file kosong dengan ekstensi `.erd.json`, lalu buka file tersebut.
Di Obsidian, jalankan `ERD Editor: Create new diagram` dari palet perintah, atau pilih `New ERD` dari menu konteks folder di penjelajah file. Keduanya membuat file `.erd` kosong lalu membukanya.
Di Google Drive, pilih New → More → ERD Editor, lalu masuk dengan Google. ERD Editor hanya mengakses file yang Anda buat atau buka dengannya.
Di aplikasi web, Google Drive, VS Code, IDE JetBrains, dan Obsidian, diagram baru yang kosong terbuka pada [layar sambutan](./guides/editing-start.md#welcome-screen), yaitu menu langkah awal: `New Table`, `New Memo`, `Import`, `Command Palette`, dan `Shortcuts`.
Menggulir, memperbesar/memperkecil, dan berpindah tab membiarkan file kosong diagram baru tetap seperti semula, karena setiap penguncian aktif di diagram baru. Lihat [Penguncian](./guides/settings.md#lock).
VS Code membuka file ERD sebagai teks JSON di Source Control, Local History, Compare with Saved, tinjauan perubahan dari obrolan VS Code dan dari agen pemrograman seperti GitHub Copilot dan Claude Code, serta tampilan revisi dari ekstensi seperti GitLens, GitHub Pull Requests, dan Git Graph, sehingga perubahan dibandingkan baris demi baris. `Reopen Editor With...` menampilkan revisi Git sebagai diagram hanya baca.

Setelah memperbarui plugin Obsidian, mulai ulang Obsidian: hingga saat itu, jendela tetap mempertahankan editor yang dimuat oleh versi sebelumnya.
Perbarui ERD Editor di mana pun Anda berbagi diagram: rilis dari sebelum adanya grup tabel tidak menampilkan ikon kunci utama pada file yang disimpan oleh rilis saat ini, dan menyimpan file di sana menghilangkan grup tabel serta skrip Skema SQL di dalamnya.
File yang disimpan oleh rilis semacam itu ditulis ulang dalam bentuk saat ini pada perubahan pertama yang dipertahankan file — lihat [Penguncian](./guides/settings.md#lock). Hingga saat itu, editor JSON yang memvalidasinya terhadap `$schema` miliknya melaporkannya sebagai tidak valid.

## Apa yang dapat dilakukannya {#what-it-does}

- Gambar tabel, kolom, dan memo di kanvas tanpa batas, lalu hubungkan dengan empat tipe hubungan: `Zero One`, `Zero N`, `One Only`, `One N`. Lihat [Memulai pengeditan](./guides/editing-start.md). Indeks didefinisikan di panel Properti Tabel. Indeks unik atas dua kolom atau lebih merupakan kunci alternatif, dan dengan opsi tampilan `Alternate Key` aktif, diagram menandai kolom-kolomnya dengan `AK1.1`, `AK1.2`, dan seterusnya. Lihat [Indeks](./guides/table-related-functions.md#indexes) dan [Kunci alternatif](./guides/table-related-functions.md#alternate-keys).
- Akhiri hubungan pada kolom yang sudah dimiliki tabel: selama Anda menggambarnya dengan mouse atau pena, `Map to existing columns` di samping tabel tempat hubungan berakhir memasangkan kunci tabel induk dengan kolom tabel tersebut, dan `Create new columns` menambahkan kolom baru. `Map Columns` di menu konteks hubungan mengubah kolomnya nanti. Lihat [Petakan Kolom](./guides/relationship-editing.md#map-columns). Hubungan juga dapat memiliki tindakan ON DELETE dan ON UPDATE. Lihat [ON DELETE dan ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update).
- Edit dengan cepat: `Alt + N` menambahkan tabel; `Alt + Enter` menambahkan kolom; `Alt + K` mengaktifkan atau menonaktifkan kunci utama pada kolom yang difokuskan, atau pada setiap kolom yang dipilih jika kolom tersebut termasuk di antaranya; dan `Delete` atau `Backspace` menghapus pilihan. Masing-masing merupakan satu langkah pembatalan. Lihat [Pintasan](./guides/settings.md#shortcuts). [Bilah alat kanvas](./guides/table-related-functions.md#canvas-toolbar) di bagian bawah kanvas juga menambahkan tabel atau memo dengan satu klik.
- Beri warna pada tabel, memo, atau grup tabel dari pemilih warna dengan prasetel dan warna yang sudah digunakan diagram, dan hapus warna dengan `No color` atau `Remove color`. Lihat [Pemberian warna tabel dan memo](./guides/table-related-functions.md#table-and-memo-color-specification).
- Kumpulkan tabel yang saling terkait ke dalam [grup tabel](./guides/table-groups.md): kotak di belakang tabel-tabel tersebut yang dapat Anda beri nama dan warna. Gambar grup dengan `Alt + G` atau dengan `New Table Group` dari menu konteks kanvas, bilah alat kanvas, atau Pencarian Cepat, atau buat grup dari tabel yang dipilih dengan `T` lalu `G` atau `Group selected tables` di menu konteks tabel tersebut. Tabel bergabung ke grup saat Anda melepaskannya di dalam grup dan keluar saat Anda melepaskannya di luar, dan menyeret grup pada bilah judulnya ikut memindahkan tabel-tabelnya. DBML membawa grup di kedua arah, sebagai blok `TableGroup`.
- Impor skema yang sudah ada dari `json`, `Schema SQL`, `GraphQL`, `DBML`, atau `AML`. Lihat [Mengimpor atau mengekspor file](./guides/file-import-export.md). File Skema SQL, GraphQL, DBML, atau AML masuk dengan tabel-tabelnya tertata mengikuti hubungannya, atau dalam baris jika file tidak memiliki hubungan. [`Import and Add`](./guides/file-import-export.md#import-and-add) menambahkan file di bawah diagram alih-alih menggantikannya.
- Ekspor diagram sebagai `json`; sebagai Skema SQL dari tab [Skema SQL](./guides/schema-sql.md#saving-or-copying-the-sql), disimpan sebagai file `.sql` atau disalin; atau dari dialog [`Export image`](./guides/file-import-export.md#image) sebagai gambar PNG atau SVG, atau PNG di papan klip.
- Tulis Skema SQL dalam sintaksis delapan vendor database: Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake, dan SQLite. Lihat [Fungsi terkait tabel](./guides/table-related-functions.md#databases). Panel opsi tab [Skema SQL](./guides/schema-sql.md) memilih pernyataan, pembuka, dan grup tabel yang ditulis, serta memuat SQL Anda sendiri, yang tersimpan di diagram, untuk ditulis sebelum dan setelah tabel.
- Hasilkan kode untuk dua puluh dua target: bahasa C#, Go, Java, Kotlin, PHP, Rust, Scala, Swift, dan TypeScript; ORM Doctrine, Drizzle, JPA, SeaORM, Sequelize, SQLAlchemy, dan TypeORM; serta AML, DBML, GraphQL, JSON Schema, Mermaid, dan Zod. Panel opsi tab Generator Kode memilih bahasa, database, dan konvensi penamaan, dan kode disimpan sebagai file dengan ekstensi bahasa tersebut atau disalin. Lihat [Generator Kode](./guides/code-generator.md).
- Baca skema di [Visualisasi](./guides/visualization.md), sebagai `Graph` berbasis gaya atau sebagai `Flow` berisi kartu tabel yang tertata mengikuti hubungannya, dan di sana, saat penunjuk diarahkan ke sebuah tabel, semua yang terhubung dengannya disorot. Tekan `Alt + F` di tab ERD untuk [memfokuskan tabel yang dipilih](./guides/visualization.md#focusing-on-tables) beserta tabel yang terkait dengannya.
- Bekerja di kanvas tanpa tepi: geser ke mana pun diagram membentang, perbesar/perkecil dari `10%` hingga `150%` dengan `Ctrl + Wheel` (`⌘ + Wheel` di Mac), keyboard, atau gerakan cubit, dan singkirkan segala sesuatu selain diagram dengan mode Zen. Menyeret dengan tombol tengah mouse menggeser area pandang dari mana pun di kanvas, bahkan di atas tabel. Lihat [Navigasi di kanvas](./guides/table-related-functions.md#getting-around-the-canvas).
- Tata seluruh diagram dalam satu langkah dengan [Tata Letak Otomatis](./guides/table-related-functions.md#auto-layout): simulasi gaya, alur dari kiri ke kanan, atau pohon ke salah satu arah, dengan setiap grup tabel tetap menyatu.
- Jalankan perintah dari mana pun dengan [Pencarian Cepat](./guides/quick-search.md), atau awali pencarian dengan `#`, `@`, atau `:` untuk melompat ke tabel, ke kolom, atau ke komentar atau memo. Telusuri riwayat pengeditan langkah demi langkah dengan [Batalkan, Ulangi](./guides/undo-redo.md), putar ulang riwayat sesi ini di kanvas dengan [Perjalanan Waktu](./guides/undo-redo.md#time-travel), atau bandingkan diagram dengan file `.json` lain di [Penampil Perbedaan](./guides/table-related-functions.md#diff-viewer). Pohonnya, di samping kedua versi, mencantumkan tabel, kolom, indeks, kunci asing, memo, dan grup tabel yang ditambahkan, diubah, dihapus, atau diganti namanya.
- Telusuri diagram di [Penjelajah](./guides/explorer.md), pohon yang tertambat di sisi kiri kanvas: tabel, masing-masing dengan kolom, indeks, dan kunci asingnya, lalu grup tabel dan memo. Klik baris untuk menuju apa yang diwakilinya di kanvas; baris kunci asing juga menyorot hubungannya. Tombol `Explorer` di bilah alat, di sebelah `Search`, membuka dan menutupnya.
- Temukan teks dengan [Temukan dan Ganti](./guides/find-and-replace.md) di bagian atas Penjelajah. Fitur ini mencari nama tabel, kolom, indeks, dan grup tabel, serta komentar dan memo setelah Anda mengaktifkannya, lalu menampilkan kecocokan di pohon Penjelajah. Ganti satu kecocokan atau semuanya; `Preserve Case` memberi setiap penggantian huruf besar-kecil dari teks yang digantikannya. `Ctrl + F` (`⌘ + F` di Mac) membuka Penjelajah dengan kursor teks di kotak Temukan, dan menekannya lagi menutup Penjelajah.
- Gunakan editor dalam 25 bahasa, yang dipilih dari tombol `Display Language` di bilah alat atau dari Pencarian Cepat. `System` mengikuti bahasa browser atau aplikasi host, dan bahasa Arab, Ibrani, dan Persia menata editor dari kanan ke kiri sementara diagram tetap dari kiri ke kanan. Hanya teks editor itu sendiri yang berubah: nama, SQL, dan kode yang dihasilkan tetap seperti yang ditulis. Pembuat tema di bilah alat memilih tampilan (`System`, `Light`, atau `Dark`), warna abu-abu, dan warna aksen. Lihat [Bahasa dan tema](./guides/language-and-theme.md).
- Jaga diff tetap bersih: posisi gulir dan zoom, tab yang terbuka, bahasa dan konvensi penamaan Generator Kode, serta tipe tanda kutip [dikunci](./guides/settings.md#lock) secara default, sehingga file mempertahankan nilai yang dimiliki pengaturan tersebut saat dikunci, dan menggulir, memperbesar/memperkecil, atau berpindah tab tidak pernah mengubahnya. File ditulis dalam urutan tetap dan tidak memuat lebar hasil pengukuran, urutan tumpukan, jangkar konektor, maupun item yang dihapus, sehingga membuka diagram lalu menutupnya tanpa perubahan membiarkan file tetap seperti semula.
- Biarkan agen pemrograman seperti Claude Code atau Codex mengedit diagram melalui [server MCP](../mcp/introduction.md): secara live di VS Code, Obsidian, atau IDE JetBrains, dengan setiap perubahan muncul di kanvas saat itu juga, atau di file itu sendiri.
- Edit bersama dalam waktu nyata di aplikasi web (eksperimental). Sesi bersifat peer-to-peer dan terenkripsi end-to-end, sehingga tidak ada server yang menyimpan skema Anda, dan para peer saling melihat kursor, fokus, dan pilihan masing-masing. Di halaman Anda sendiri, [`getSharedStore()`](../api/advanced/collaborative-editing.md) memberi Anda aliran aksi yang sama melalui transport pilihan Anda.

Mulai dari [Panduan pengeditan](/docs/category/guides).

## Alasan di balik proyek ini {#reason-behind-this-project}

Alat pemodelan yang ada tidak memberikan tingkat pengalaman pengguna yang saya inginkan.  
Karena itu, saya memulai proyek ini untuk menghadirkan pengalaman pengguna terbaik.  
Prioritas utama proyek ini adalah pengalaman pengeditan pengguna.  
Proyek ini akan memberi Anda pengalaman pengeditan yang luar biasa.
