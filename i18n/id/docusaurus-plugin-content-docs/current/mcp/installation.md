---
sidebar_position: 2
description: Mendaftarkan server @dineug/erd-editor-mcp ke Claude Code, Codex, atau klien MCP lainnya, serta menyiapkan VS Code, Obsidian, atau IDE JetBrains untuk pengeditan live.
---

# Instalasi

Server ini dipublikasikan ke npm sebagai `@dineug/erd-editor-mcp`.
Server ini berupa satu file mandiri tanpa dependensi runtime, dan `npx` mengunduhnya saat agen pertama kali menjalankannya, sehingga tidak ada hal lain yang perlu diinstal.
Server ini memerlukan Node.js `22.12` atau yang lebih baru.

Agar agen dapat mengedit diagram secara live, siapkan juga editor yang memegang diagram tersebut: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian), atau [IDE JetBrains](#set-up-a-jetbrains-ide).
Jika tidak ada editor yang melayani dokumen, agen mengedit file di disk — lihat [Live dan headless](./live-and-headless.md).

## Claude Code {#claude-code}

Jalankan di folder proyek Anda:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Tambahkan `--scope project` sebelum `--transport` untuk menuliskan server ke `.mcp.json` milik proyek sebagai gantinya, tempat server ini ikut didapatkan oleh setiap orang yang meng-clone proyek tersebut.

## Codex {#codex}

Jalankan sekali. CLI, aplikasi, dan ekstensi IDE Codex berbagi pengaturan ini:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Atau tambahkan server ke `~/.codex/config.toml`, atau ke `.codex/config.toml` di proyek tepercaya:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Klien MCP lainnya {#any-other-mcp-client}

Jalankan `npx -y @dineug/erd-editor-mcp` sebagai server stdio: perintahnya `npx`, dan argumennya `-y` serta `@dineug/erd-editor-mcp`.

Server menafsirkan jalur dokumen relatif berdasarkan direktori kerjanya, karena itu jalankan server di folder proyek Anda.
Server ini mendukung protokol MCP versi `2025-06-18`, `2025-03-26`, dan `2024-11-05`, dan menjawab klien yang menggunakan versi yang lebih baru dengan `2025-06-18`.

## Menyiapkan VS Code {#set-up-vs-code}

Jendela VS Code melayani diagram di folder workspace-nya dan setiap diagram yang terbuka di dalamnya.

1. Instal [ekstensi ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` atau yang lebih baru. Ekstensi ini memerlukan VS Code `1.101.0` atau yang lebih baru.
2. Buka folder proyek dan percayai workspace-nya. Ekstensi hanya melayani agen di workspace tepercaya.
3. Biarkan pengaturan `dineug.erd-editor.agentHub.enabled` tetap aktif. Pengaturan ini aktif secara default.

Ekstensi `3.0.0` hingga `3.1.0` dan server `1.0.0` saling menolak, dan ekstensi sebelum `3.0.0` tidak melayani agen — lihat [Memperbarui](#updating).

Ekstensi mulai berjalan di workspace yang berisi file `.erd`, `.erd.json`, `.vuerd`, atau `.vuerd.json`, sehingga agen dapat menjangkau diagram tersebut sebelum Anda membuka diagram apa pun.
Di workspace yang tidak berisi satu pun file tersebut, ekstensi mulai berjalan saat Anda membuka diagram, dan hingga saat itu agen mengedit di disk.

| Pengaturan | Default | Efek |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Memungkinkan server MCP milik agen mengedit dokumen jendela ini melalui soket lokal, atau named pipe di Windows. Saat dinonaktifkan, atau di workspace yang tidak tepercaya, agen tetap dapat membaca diagram jendela ini dari disk, tetapi tidak pernah menulis diagram tanpa sepengetahuan editornya. |

## Menyiapkan Obsidian {#set-up-obsidian}

Jendela vault Obsidian melayani diagram di vault-nya.

1. Instal [plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` atau yang lebih baru dari Community plugins, dan aktifkan. Plugin ini hanya berjalan di aplikasi desktop, dan memerlukan Obsidian `1.5.7` atau yang lebih baru.
2. Biarkan Settings → ERD Editor → Coding agents tetap aktif. Pengaturan ini aktif secara default, dan setiap vault menyimpan pengaturannya sendiri.

Plugin versi sebelumnya dan server `1.0.0` saling menolak — lihat [Memperbarui](#updating).

Jendela vault melayani agen sejak plugin dimuat, sehingga agen dapat menjangkau diagram vault sebelum Anda membuka diagram apa pun.
Tidak ada langkah pemberian kepercayaan.
File yang tidak dicantumkan vault, seperti file di dalam folder yang namanya diawali titik, tidak dapat dibuka di ERD Editor, sehingga perubahan pada file tersebut ditolak.

Minta agen untuk menamai diagram baru dengan `.erd`.
Nama tanpa ekstensi mendapat `.erd.json`, dan penjelajah file Obsidian hanya mencantumkan file `.erd.json` selama Settings → Files and links → Detect all file extensions aktif.

| Pengaturan | Default | Efek |
| --- | --- | --- |
| Coding agents | Aktif | Memungkinkan server MCP milik agen mengedit diagram vault ini melalui soket lokal, atau named pipe di Windows. Saat dinonaktifkan, agen tetap dapat membaca diagram vault ini dari disk, tetapi tidak pernah menulis diagram tanpa sepengetahuan editornya. |

Obsidian yang diinstal dari Flathub berjalan di sandbox Flatpak, yang tidak dapat dijangkau server.
Dalam kondisi itu, plugin tidak melayani agen dan tidak menyimpan file kunci, sehingga agen mengedit file di disk, bahkan diagram yang sedang Anda buka.
Obsidian memuat ulang diagram, seperti yang dilakukannya setelah setiap perubahan yang dibuat di luar Obsidian, dan perubahan Anda yang belum disimpannya tergantikan oleh perubahan agen.
Plugin memberitahukan hal ini setiap kali vault dibuka, hingga Anda menonaktifkan Coding agents.

## Menyiapkan IDE JetBrains {#set-up-a-jetbrains-ide}

IDE JetBrains melayani diagram dari setiap proyek yang terbuka di dalamnya, serta setiap diagram yang terbuka di ERD Editor miliknya.

1. Instal [plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` atau yang lebih baru. Plugin ini memerlukan IDE berbasis IntelliJ `2025.2` atau yang lebih baru, yang berjalan di JetBrains Runtime.
2. Buka proyek dan percayai proyek tersebut. Di proyek yang tidak dipercayai IDE, seperti proyek yang dibuka dalam mode aman, agen membaca diagram tetapi tidak pernah mengubahnya.
3. Biarkan Settings | Tools | ERD Editor → Coding agents tetap dicentang. Pengaturan ini aktif secara default dan berlaku untuk seluruh IDE.

Plugin `0.9.0` atau `0.10.0` dan server `1.0.0` saling menolak, dan plugin sebelum `0.9.0` tidak melayani agen — lihat [Memperbarui](#updating).

IDE melayani agen sejak proyek pertama dibuka, sehingga agen dapat menjangkau diagram proyek sebelum Anda membuka diagram apa pun.

| Pengaturan | Default | Efek |
| --- | --- | --- |
| Coding agents | Aktif | Memungkinkan server MCP milik agen mengedit diagram IDE ini melalui soket lokal, atau named pipe di Windows. Saat dinonaktifkan, agen tetap dapat membaca diagram proyek yang terbuka dari disk, tetapi tidak pernah mengubah diagram tanpa sepengetahuan editornya. |

Halaman pengaturan memberitahukan saat agen pemrograman tidak tersedia: di IDE tanpa JCEF (tempat ERD Editor juga tidak dapat berjalan), di IDE yang diinstal sebagai Flatpak di Linux, dan saat hub-nya tidak dapat dimulai.
Dalam kondisi itu, IDE tidak menyimpan file kunci, dan agen mengedit file di disk.
ERD Editor tidak memuat ulang diagram yang berubah di disk selama diagram tersebut terbuka, dan perubahan Anda berikutnya di dalamnya menulis kembali seluruh diagram dengan menimpa perubahan agen, karena itu tutup diagram terlebih dahulu.

## Mencobanya {#try-it}

1. Buka folder yang memuat diagram Anda: di VS Code, sebagai workspace yang Anda percayai; di Obsidian, sebagai vault; di IDE JetBrains, sebagai proyek yang Anda percayai.
2. Jalankan agen di folder yang sama dan ajukan permintaan dengan kata-kata biasa, misalnya _"Tambahkan tabel reviews ke schema.erd.json, yang berhubungan dengan users dan products"_.
3. Perhatikan perubahan muncul di kanvas. Di VS Code, simpan dengan `Ctrl + S` (Windows/Linux) atau `⌘ + S` (Mac), atau minta agen untuk menyimpan. Obsidian dan IDE JetBrains menyimpan perubahan tersebut seperti saat menyimpan perubahan Anda sendiri, dan jika agen diminta menyimpan, perubahan itu langsung ditulis.

ERD Editor membuka diagram yang belum terbuka saat agen pertama kali mengeditnya, tanpa mengambil alih fokus keyboard.
Agen membuat dokumen baru dengan `erd_open_document`, dan nama tanpa ekstensi mendapat `.erd.json`.

## Memperbarui {#updating}

Perintah di atas tidak menyebutkan versi, sehingga `npx` memeriksa rilis server yang lebih baru di npm setiap kali agen menjalankan server.
Server yang sudah berjalan tetap menggunakan rilisnya hingga agen menjalankannya kembali.

Server memeriksa versi protokol yang digunakan editor sebelum terhubung.
Jika keduanya berbeda, setiap panggilan yang mencapai editor tersebut ditolak dengan `protocolMismatch`, termasuk pembacaan dan `erd_list_documents`, dan tidak ada yang ditulis.
Pesan tersebut menyebutkan sisi yang perlu diperbarui: server, atau ERD Editor di editor, yaitu ekstensi di VS Code serta plugin di Obsidian dan IDE JetBrains.

Server `1.0.0`, ekstensi VS Code `4.0.0` atau yang lebih baru, plugin Obsidian `1.0.0` atau yang lebih baru, dan plugin JetBrains `1.0.0` atau yang lebih baru menggunakan protokol 2.
Setiap server versi sebelumnya menggunakan protokol 1, begitu pula setiap rilis editor sebelumnya yang melayani agen: ekstensi VS Code `3.0.0` hingga `3.1.0`, plugin Obsidian `0.1.0` dan `0.2.0`, serta plugin JetBrains `0.9.0` dan `0.10.0`.
Editor seperti itu dan server `1.0.0` saling menolak, begitu pula server versi sebelumnya dan editor yang menggunakan protokol 2.
Ekstensi VS Code sebelum `3.0.0` atau plugin JetBrains sebelum `0.9.0` sama sekali tidak melayani agen, sehingga agen mengedit file di disk, bahkan diagram yang terbuka di dalamnya.

| Kombinasi | Akhir pesan |
| --- | --- |
| Server `1.0.0` dengan ekstensi atau plugin yang menggunakan protokol 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Server versi sebelumnya dengan ekstensi atau plugin yang menggunakan protokol 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Perbarui server dan ekstensi atau plugin secara bersamaan.
Perbarui juga ERD Editor di mana pun diagram dibuka.
Ekstensi VS Code sebelum `4.0.0`, plugin Obsidian sebelum `1.0.0`, dan plugin JetBrains sebelum `1.0.0` menampilkan diagram yang disimpan oleh rilis yang lebih baru, atau yang diedit agen di disk, tanpa ikon kunci utamanya.
Saat menyimpan file, rilis tersebut membuang grup tabel dan skrip Skema SQL di dalamnya.
Ekstensi VS Code sebelum `3.1.0`, plugin Obsidian sebelum `0.2.0`, dan plugin JetBrains sebelum `0.10.0` juga membuang tindakan ON DELETE dan ON UPDATE milik diagram saat menyimpan file.
Di Obsidian, mulai ulang aplikasi setelah memperbarui plugin: hingga saat itu, jendela vault tetap menjalankan ERD Editor dari versi plugin yang pertama kali dimuatnya.
