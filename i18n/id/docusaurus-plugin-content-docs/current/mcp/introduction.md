---
sidebar_position: 1
description: Memungkinkan agen pemrograman seperti Claude Code atau Codex mengedit diagram erd-editor melalui server MCP @dineug/erd-editor-mcp, secara live di VS Code, Obsidian, atau IDE JetBrains, atau langsung di disk.
---

# Pengantar

`@dineug/erd-editor-mcp` adalah server MCP yang memungkinkan agen pemrograman mengedit diagram erd-editor.
Claude Code, Codex, dan klien [Model Context Protocol](https://modelcontextprotocol.io) lainnya mendapatkan satu alat untuk setiap operasi pada dokumen: menambahkan tabel, mengganti nama kolom, menghubungkan dua tabel, mengimpor dump DDL, membaca kembali skema sebagai SQL.

Saat dokumen terbuka di ERD Editor pada [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor), atau [IDE JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), agen bergabung dengan editor layaknya seorang kolaborator.
Setiap perubahan muncul di kanvas saat terjadi, dan pembatalan oleh agen hanya mengembalikan perubahan yang dibuatnya sendiri.
VS Code membiarkan perubahan agen tidak tersimpan hingga agen atau Anda menyimpannya, sedangkan Obsidian dan IDE JetBrains menyimpannya seperti menyimpan perubahan Anda sendiri.
Jika tidak ada editor yang memuat dokumen, alat yang sama mengedit file itu sendiri.

![Agen pemrograman menambahkan tabel dan hubungan ke diagram yang terbuka di VS Code](/img/coding-agents.webp)

## Apa yang dapat dilakukan agen {#what-an-agent-can-do}

- Membangun atau mengubah skema melalui percakapan: tabel, kolom beserta setiap opsi kolom, hubungan beserta kardinalitas serta tindakan ON DELETE dan ON UPDATE-nya, indeks, memo, warna, dan posisi di kanvas. Lihat [Hubungan](./tools.md#relationships).
- Mengumpulkan tabel dalam [grup tabel](../guide/guides/table-groups.md): menambahkan grup di sekeliling tabel yang disebutkan agen atau di atas suatu area kanvas, lalu mengganti namanya, memberinya warna, memindahkannya bersama tabelnya, mengubah ukurannya, memasukkan atau mengeluarkan tabel, atau menghapusnya, yang membiarkan tabelnya tetap di tempatnya. Lihat [Grup tabel](./tools.md#table-groups).
- Menamai tabel dan kolom dari kata dan istilah di tab [Kamus](../guide/guides/dictionary.md) milik editor, dan menautkan kolom ke domain di tab tersebut, yang memberi kolom tipe datanya. Agen mengatur [nama logis](../guide/guides/logical-names.md) tabel dan kolom, dan kamus menghasilkan nama fisik darinya seperti di editor, meskipun nama fisik yang ditulis secara manual tetap dipertahankan kecuali jika kosong. Agen menambahkan, mengubah, dan menghapus domain, kata, dan istilah, dan setelah kata atau istilah berubah, menghasilkan ulang nama fisik untuk satu kolom, satu tabel, atau seluruh dokumen. Agen mencantumkan apa yang ditemukan lembar `Checks` di tab tersebut: kata terlarang, kata tidak terdaftar, dan sinonim; nama yang dipakai bersama oleh dua baris dalam satu kamus; tautan ke domain yang tidak tercantum di dokumen; nama fisik yang berbeda dari nama yang diberikan istilahnya; dan kolom yang menyimpang dari tipe data domainnya. Lihat [Kamus](./tools.md#dictionaries) dan [Pemeriksaan kamus](./tools.md#dictionary-checks).
- Mengganti dokumen dengan skema yang diurai dari SQL DDL, GraphQL SDL, DBML, atau AML, atau dengan dokumen `.erd.json` lain. Atau menambahkan skema atau dokumen tersebut di bawah diagram dan mempertahankan semua yang sudah ada, seperti yang dilakukan [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) di editor. Dengan kedua cara itu, `TableGroup` DBML masuk sebagai grup tabel. Skema yang mengganti dokumen mempertahankan kamus dokumen, dokumen yang menggantinya membawa kamusnya sendiri, dan penambahan tidak membawa kamus apa pun. Lihat [Impor](./tools.md#import).
- Membaca kembali diagram, beserta nama logis dan baris kamusnya, sebagai daftar id, sebagai entitas utuh, atau sebagai teks `.erd.json` yang ditulis saat penyimpanan. Atau membacanya sebagai DDL untuk salah satu dari delapan database, dengan pilihan `Statements` dan `Header` dari tab [Skema SQL](../guide/guides/schema-sql.md) serta sakelar [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) di tab tersebut. Pada skema dengan ribuan tabel, agen membaca satu halaman, beberapa tabel, atau tabel dari beberapa grup tabel dalam sekali baca. Lihat [Membaca dokumen](./tools.md#reading-a-document).
- Mengatur database, nama database, serta [skrip](../guide/guides/schema-sql.md#before-and-after-scripts) yang ditulis sebelum dan setelah tabel di Skema SQL, seperti `CREATE EXTENSION` sebelum tabel atau `GRANT` setelahnya. `erd_read` memberikan skrip saja, atau skrip di dalam DDL seluruh dokumen. Lihat [Pengaturan](./tools.md#settings).
- Menjalankan beberapa perubahan sebagai satu kesatuan, semua atau tidak sama sekali, yang dikembalikan oleh satu kali pembatalan. Lihat [erd_batch](./tools.md#erd_batch).
- Membatalkan dan mengulangi perubahannya sendiri, tidak pernah perubahan Anda.

Yang tidak dilakukan agen:

- Melakukan zoom, menggulir, atau berpindah tab. Hal-hal tersebut milik setiap orang yang melihat diagram, sehingga tidak ada alat yang melakukannya. Impor yang mengganti dokumen tetap memindahkan area pandang, bahkan saat `Viewport` terkunci, seperti yang dilakukan `Import` di editor: kembali ke awal kanvas pada 100%, atau, dengan `erd_import_json`, ke area pandang dokumen yang dimuatnya, dan juga ke tab dokumen tersebut kecuali jika dokumen itu mengunci `Canvas Type`. Lihat [Impor](./tools.md#import).
- Mengganti [Tampilan Nama](../guide/guides/logical-names.md#switching-the-view) di antara `Physical Names`, `Logical Names`, dan `Both Names`. Tampilan Nama milik setiap orang yang melihat diagram selama [penguncian](../guide/guides/settings.md#lock) Tampilan Nama aktif, seperti pada diagram baru, dan menjadi pilihan Anda di editor setelah penguncian tersebut dinonaktifkan, sehingga tidak ada alat yang melakukannya. Agen membaca dan menulis nama logis apa pun tampilannya. `erd_import_json` yang mengganti dokumen membawa Tampilan Nama dari dokumen yang dimuatnya hanya jika penguncian `Name View` dokumen tersebut nonaktif.
- Mengubah [`View Option`](../guide/guides/table-related-functions.md#table-view-options), bahasa dan konvensi penamaan Generator Kode, tipe tanda kutip, atau `Relationship DataType Sync`, `Maximum comment width`, dan `Column Order` di tab [Pengaturan](../guide/guides/settings.md). Semua itu Anda atur sendiri di editor, dan agen membacanya sebagaimana tersimpan di file.
- Mengaktifkan atau menonaktifkan [penguncian](../guide/guides/settings.md#lock). Penguncian atau pengaturan di atas hanya diubah oleh `erd_import_json` yang mengganti seluruh dokumen, menjadi penguncian dan pengaturan dokumen yang dimuatnya. Dokumen tanpa field `lockSettings`, seperti file yang disimpan oleh ekstensi VS Code sebelum `4.0.0` atau oleh plugin Obsidian atau JetBrains sebelum `1.0.0`, mengaktifkan setiap penguncian. Membatalkan impor apa pun yang mengganti dokumen mengembalikan pengaturan dan penguncian yang dimiliki dokumen sebelumnya.
- Memetakan ulang hubungan ke kolom lain, seperti yang dilakukan [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). Sebagai gantinya, agen menghapus hubungan, yang membiarkan kolom kunci asingnya tetap di tempatnya, lalu menghubungkan kolom yang diinginkannya dengan `erd_link_columns`, dalam satu `erd_batch` yang dikembalikan oleh satu kali pembatalan.
- Mengimpor atau mengekspor kamus sebagai CSV, mengurutkan lembar, atau menyisipkan baris di atas atau di bawah suatu baris, seperti yang dilakukan tab [Kamus](../guide/guides/dictionary.md). Agen menambahkan, mengubah, dan menghapus baris, banyak sekaligus dalam satu `erd_batch`, dan baris baru ditempatkan di akhir lembarnya.
- Menjalankan Generator Kode. `erd_read` memberikan DDL atau JSON, dan agen sendiri yang menulis kode dari hasil tersebut.

## Cara kerjanya {#how-it-works}

Server ini adalah proses stdio yang dijalankan klien MCP Anda.
Pada setiap panggilan, server mencari editor yang memegang dokumen: jendela VS Code, jendela vault Obsidian, atau IDE JetBrains, masing-masing dengan ekstensi atau plugin ERD Editor.

- **Live** — ada editor yang memiliki dokumen di workspace, vault, atau salah satu proyeknya yang terbuka, atau sedang membukanya. Server bergabung dengan sesi pengeditan editor tersebut dan perubahan masuk ke editor: tidak tersimpan di VS Code, dan tersimpan seperti perubahan Anda sendiri di Obsidian dan IDE JetBrains.
- **Headless** — tidak ada editor. Server memuat file, menerapkan perubahan, lalu menulis kembali file tersebut.
- **Ditolak** — ada editor yang memegang dokumen, tetapi hub-nya nonaktif. Server membaca dari disk tetapi tidak menulis apa pun, karena editor yang terbuka dapat menimpa file pada penyimpanan berikutnya. IDE JetBrains yang hub-nya aktif juga menolak mengubah dokumen yang hanya dipegang oleh proyek yang tidak dipercayainya, meskipun agen tetap dapat membacanya. Saat hub editor aktif tetapi ekstensi atau plugin ERD Editor pada editor tersebut menggunakan protokol hub yang berbeda dari server, setiap panggilan pada dokumen ditolak, termasuk pembacaan, dengan `protocolMismatch` dan pesan yang menyebutkan sisi yang perlu diperbarui — lihat [Memperbarui](./installation.md#updating).

Lihat [Live dan headless](./live-and-headless.md) untuk detailnya.

## Persyaratan {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` atau yang lebih baru, untuk menjalankan server |
| Klien MCP | Claude Code, Codex, atau klien apa pun yang dapat menjalankan server stdio |
| VS Code, untuk pengeditan live | `1.101.0` atau yang lebih baru, dengan ekstensi ERD Editor `4.0.0` atau yang lebih baru |
| Obsidian, untuk pengeditan live | Aplikasi desktop `1.5.7` atau yang lebih baru, dengan plugin ERD Editor `1.0.0` atau yang lebih baru |
| IDE JetBrains, untuk pengeditan live | IDE berbasis IntelliJ `2025.2` atau yang lebih baru, dengan plugin ERD Editor `1.0.0` atau yang lebih baru |

Server `1.0.0` atau yang lebih baru dan rilis di atas menggunakan protokol hub 2.
Rilis sebelumnya yang melayani agen menggunakan protokol 1: ekstensi VS Code `3.0.0` hingga `3.1.0`, plugin Obsidian `0.1.0` dan `0.2.0`, serta plugin JetBrains `0.9.0` dan `0.10.0`.
Rilis semacam itu dan server `1.0.0` atau yang lebih baru saling menolak, begitu pula server versi sebelumnya dan rilis di atas — lihat [Memperbarui](./installation.md#updating).
Ekstensi VS Code sebelum `3.0.0` atau plugin JetBrains sebelum `0.9.0` tidak memiliki hub, sehingga server tidak melihatnya dan mengedit file di disk, bahkan diagram yang terbuka di dalamnya.

Alat untuk nama logis, domain, dan kamus memerlukan server `1.1.0` atau yang lebih baru dan, di mana pun dokumen dibuka, setidaknya ekstensi VS Code `4.2.0` atau plugin Obsidian atau JetBrains `1.2.0`.
Di antara rilis di atas, ekstensi sebelum `4.2.0` atau plugin sebelum `1.2.0` tetap memungkinkan agen mengedit secara live, karena menggunakan protokol 2, tetapi mengabaikan nama logis, tautan domain, dan baris kamus yang ditulis agen, dan tidak menyertakannya saat menyimpan file.
Server sebelum `1.1.0` yang mengedit file di disk menulis kembali file tersebut tanpa nama logis, tautan domain, dan baris kamusnya — lihat [Memperbarui](./installation.md#updating).

Berikutnya: [Instalasi](./installation.md).
