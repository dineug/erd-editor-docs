---
sidebar_position: 17
description: Ke-25 bahasa tampilan editor, tata letak kanan ke kiri, tampilan Sistem, Terang, dan Gelap pada pembuat tema beserta warnanya, dan tempat setiap host menyimpannya.
---

# Bahasa dan tema

Teks milik editor sendiri tersedia dalam 25 bahasa, dan gaya visualnya berupa tema: tampilan (`System`, `Light`, atau `Dark`), warna abu-abu, dan warna aksen.  
Keduanya milik orang yang menggunakan editor, bukan milik diagram. Keduanya tidak disimpan di file, tidak dicatat di [riwayat pembatalan](./undo-redo.md), dan tidak dibagikan kepada kolaborator, sehingga setiap orang melihat pilihannya sendiri, dan mengubah salah satunya tidak pernah menandai file sebagai diubah.

Keduanya tidak ada di tab [Pengaturan](./settings.md). Bilah alat memiliki tombol `Theme` dan, tepat setelahnya, tombol `Display Language`, keduanya setelah tombol [`Explorer`](./explorer.md). [Pencarian Cepat](./quick-search.md) mencantumkan `Theme` dan `Display Language` di setiap tab.  
Aplikasi web, Google Drive, VS Code, IDE JetBrains, dan Obsidian semuanya menyediakan keduanya dan mengingat pilihan Anda — lihat [Di setiap host](#in-each-host). Keduanya juga berfungsi di editor hanya baca.

## Bahasa tampilan {#display-language}

Bahasa ini mencakup teks milik editor sendiri: tooltip bilah alat, tombol [`Name View`](./logical-names.md#switching-the-view) di bilah alat kanvas dan di bilah alat Alur, menu tampilan baris Alur, menu konteks, Pencarian Cepat, panel dan dialog, tab [Kamus](./dictionary.md) (nama lembar, header kolom, alat, menu, baris status, dan jenis pemeriksaan yang dicantumkan lembar `Checks`), tab Pengaturan, [layar sambutan](./editing-start.md#welcome-screen), notifikasi dan pesan, serta teks placeholder yang ditampilkan untuk nama, nama logis, tipe data, domain, nilai default, atau komentar yang kosong di kanvas dan di gambar yang diekspor.  
Bahasa ini membiarkan hal-hal berikut tetap seperti yang tertulis dalam setiap bahasa: nama tabel dan kolom, [nama logis](./logical-names.md), komentar, dan memo Anda; kata, istilah, dan domain yang Anda simpan di tab Kamus; vendor database, bahasa Generator Kode, dan format file; tipe data, kata kunci SQL, serta tindakan `ON DELETE` dan `ON UPDATE`; opsi Skema SQL `Create`, `If not exists`, `Drop & re-create`, `USE`, dan `CREATE + USE`; tanda `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL`, dan `AK1.1`; huruf status `A`, `M`, `D`, `R`, dan `~` pada [Penampil Perbedaan](./table-related-functions.md#diff-viewer); pilihan konvensi penamaan dan `Bracket` selain `None`; nama tombol keyboard; nama warna di pembuat tema; SQL dan kode yang dihasilkan; baris header file CSV kamus yang diekspor; serta nama file yang diekspor.

Di tab Kamus, pengurutan menyusun baris sesuai urutan abjad bahasa tampilan, dan pencarian lembar `Checks` mencocokkan sel-selnya sebagaimana sel itu terbaca dalam bahasa tampilan — lihat [Mengurutkan](./dictionary.md#sorting) dan [Mencari](./dictionary.md#searching).

Berikut bahasanya, dalam urutan yang dicantumkan pemilih:

| Di pemilih | Bahasa | Kode |
| --- | --- | --- |
| Bahasa Indonesia | Indonesia | `id-ID` |
| Deutsch | Jerman | `de-DE` |
| English | Inggris | `en` |
| Español | Spanyol | `es-ES` |
| Euskara | Basque | `eu-ES` |
| Français | Prancis | `fr-FR` |
| Italiano | Italia | `it-IT` |
| Nederlands | Belanda | `nl-NL` |
| Polski | Polandia | `pl-PL` |
| Português | Portugis | `pt-PT` |
| Português Brasileiro | Portugis Brasil | `pt-BR` |
| Română | Rumania | `ro-RO` |
| Slovenčina | Slowakia | `sk-SK` |
| Slovenščina | Slovenia | `sl-SI` |
| Svenska | Swedia | `sv-SE` |
| Türkçe | Turki | `tr-TR` |
| Русский | Rusia | `ru-RU` |
| Українська | Ukraina | `uk-UA` |
| עברית | Ibrani | `he-IL` |
| العربية | Arab | `ar-SA` |
| فارسی | Persia | `fa-IR` |
| 日本語 | Jepang | `ja-JP` |
| 简体中文 | Tionghoa Sederhana | `zh-CN` |
| 繁體中文 | Tionghoa Tradisional | `zh-TW` |
| 한국어 | Korea | `ko-KR` |

`Language` yang ditawarkan Pencarian Cepat di tab Generator Kode, dan baris `Language` di daftar [Penguncian](./settings.md#lock) di tab Pengaturan, merupakan [bahasa target Generator Kode](./code-generator.md#language), bukan bahasa tampilan.

### Memilih bahasa {#picking-a-language}

Tombol `Display Language` (ikon bahasa) membuka pemilih `Display Language`, yaitu panel berjudul `Display Language` di bawah bilah alat, di atas tab mana pun yang sedang terbuka.  
`System` berada paling atas, dengan bahasa yang diwakilinya saat ini di sampingnya, dan tetap terlihat selama daftar digulir. Ke-25 bahasa menyusul, masing-masing dengan nama dalam bahasanya sendiri, dan tanda centang menandai opsi yang berlaku.

![Mengganti bahasa tampilan dari bilah alat ke 한국어, lalu ke العربية, yang mencerminkan bilah alat tetapi tidak mencerminkan diagram, dan kembali ke System](/img/demo-display-language.webp)

Panel terbuka dengan fokus keyboard pada baris yang dicentang:

- `↑` dan `↓` berpindah antarbaris secara melingkar, serta `Home` dan `End` melompat ke baris pertama dan terakhir.
- `Enter` atau `Space` memilih baris yang difokuskan, sama seperti klik.

Pilihan langsung berlaku, menutup panel, dan mengembalikan fokus keyboard ke editor.

Tutup panel tanpa memilih dengan `Escape`, dengan tombol `x` di samping judul, yang tooltipnya bertuliskan `Close (ESC)`, dengan penekanan di mana pun di editor di luar panel kecuali di bilah alat, atau dengan tombol `Display Language` sekali lagi.  
Membuka panel ini menutup pembuat tema dan Properti Tabel. [Penjelajah](./explorer.md#dialogs-beside-it) yang terbuka tetap terbuka, dan dalam bahasa kiri ke kanan, pemilih berada tepat di sebelahnya alih-alih menutupinya.  
Membuka Pencarian Cepat atau pembuat tema menutupnya, begitu pula `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac). Pintasan itu membuka [Penjelajah](./explorer.md#opening-and-closing) pada pencariannya, atau, jika Penjelajah sudah terbuka, membiarkannya tetap terbuka dan memindahkan fokus keyboard ke kotak Temukan miliknya. Tombol `Explorer` di bilah alat membiarkan pemilih tetap terbuka.

Selama panel memegang fokus keyboard, beberapa pintasan editor tetap berfungsi: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, dan `Zoom Reset` — lihat [Pintasan](./settings.md#shortcuts). Semua pintasan editor lainnya, tombol panah, dan `Tab` tidak diteruskan melewati panel, sehingga editor tidak menindaklanjutinya. Tombol yang tidak dipetakan oleh editor, seperti perintah simpan milik host sendiri, sampai ke host seperti biasa.

Di [Pencarian Cepat](./quick-search.md), `Display Language` mencantumkan `System` dan ke-25 bahasa, dengan tanda centang pada opsi yang berlaku. Bahasa juga dapat ditemukan di sana melalui namanya dalam bahasa Inggris atau kodenya, sehingga `german` atau `de-DE` menemukan `Deutsch`.

### Apa yang diikuti opsi Sistem {#what-system-follows}

`System` adalah bahasa awal di aplikasi web, Google Drive, VS Code, IDE JetBrains, dan Obsidian. Opsi ini mengikuti bahasa host:

- Di aplikasi web, Google Drive, dan halaman Anda sendiri: bahasa yang diutamakan browser. Perubahan pada bahasa tersebut langsung diikuti.
- Di VS Code: bahasa tampilan VS Code.
- Di IDE JetBrains: bahasa yang digunakan IDE untuk antarmukanya sendiri.
- Di Obsidian: bahasa Obsidian.

`System` mengambil bahasa pertama dari bahasa-bahasa tersebut yang dimiliki editor, dan bahasa Inggris jika editor tidak memiliki satu pun di antaranya.  
Varian regional dianggap sebagai bahasa induknya, sehingga `de-AT` menghasilkan Deutsch dan `fr-CA` menghasilkan Français. Bahasa Tionghoa ditentukan oleh aksaranya: aksara Tradisional menghasilkan 繁體中文 dan aksara lain mana pun menghasilkan 简体中文. Jika aksara tidak disebutkan, Taiwan, Hong Kong, atau Makau menghasilkan 繁體中文, dan bahasa Tionghoa lainnya menghasilkan 简体中文. Bahasa Portugis menghasilkan Português Brasileiro kecuali jika disebutkan wilayah selain Brasil, sehingga `pt-PT` menghasilkan Português; bahasa Portugis di Obsidian juga menghasilkan Português.

### Bahasa kanan ke kiri {#right-to-left-languages}

עברית (Ibrani), العربية (Arab), dan فارسی (Persia) menata editor dari kanan ke kiri: bilah alat, menu, panel dan dialog, Pencarian Cepat, bilah dan baris status tab Kamus, serta tab Pengaturan dicerminkan. Submenu menu konteks terbuka ke kiri, dan ikon Batalkan dan Ulangi di bilah alat saling bertukar, sehingga Batalkan menunjuk ke arah mundur bagi pembaca kanan ke kiri.

Diagram itu sendiri tidak pernah dicerminkan. Kanvas beserta tabel, kolom, hubungan, dan memonya tetap dari kiri ke kanan, begitu pula minimap, bilah gulir, [bilah alat kanvas](./table-related-functions.md#canvas-toolbar), [Visualisasi](./visualization.md) dan bilah alatnya, sel tipe data, lembar di tab Kamus dan daftar domain sebuah istilah, kode di tab Skema SQL dan Generator Kode, pemilih warna, kedua sisi Penampil Perbedaan, Perjalanan Waktu, dan pratinjau Tata Letak Otomatis.  
Dalam mode Alur, kedua panah di bilah alat Visualisasi tetap di tempatnya dan bertukar fungsi: panah yang menunjuk ke kanan adalah `Previous table` dan yang menunjuk ke kiri adalah `Next table`, sehingga arah mundur menunjuk ke arah yang sama dengan Batalkan. Tombol pintasan Batalkan dan Ulangi tetap mundur dan maju satu langkah — lihat [Tabel sebelumnya dan berikutnya](./visualization.md#previous-table-and-next-table).  
[Penjelajah](./explorer.md#beside-the-canvas) tetap berada di sebelah kiri kanvas, dan pohon perubahan Penampil Perbedaan di sebelah kiri penampil, masing-masing dengan tepi seretnya di sisi kanan. Di dalamnya, keduanya dibaca dari kanan ke kiri: kotak dan barisnya dicerminkan, baris menjorok dari kanan, dan di kedua pohon `←` membentangkan baris atau melangkah ke anak pertamanya, sedangkan `→` menciutkannya atau keluar ke induknya — lihat [Tombol di Penjelajah](./explorer.md#keys-in-the-explorer).  
Nama, komentar, dan teks lain yang Anda ketik mempertahankan arahnya sendiri, sehingga nama dalam bahasa Ibrani, Arab, atau Persia juga dibaca dari kanan ke kiri di kanvas. Setiap nama yang dicantumkan notifikasi tab Kamus juga mempertahankan arahnya sendiri.

## Tema {#theme}

Tombol `Theme` (ikon kontras) membuka pembuat tema, yaitu panel berjudul `Theme` di bawah bilah alat, di atas tab mana pun yang sedang terbuka. Panel ini memiliki tiga bagian:

- `Accent color`: 26 contoh warna. Tooltip masing-masing menyebutkan namanya, misalnya `indigo`.
- `Gray color`: 6 contoh warna, `gray`, `mauve`, `slate`, `sage`, `olive`, dan `sand`.
- `Appearance`: `System`, `Light`, dan `Dark`.

![Membuka pembuat tema dari bilah alat, memilih warna aksen dan warna abu-abu, lalu mengganti tampilan ke Light dan kemudian ke System](/img/demo-theme-builder.webp)

Opsi yang berlaku di setiap bagian ditandai, dan pilihan langsung berlaku sementara pembuat tema tetap terbuka.  
Memilih warna membiarkan tampilan apa adanya, sehingga warna yang dipilih dengan tampilan `System` tetap mempertahankan `System`.

`System` menampilkan terang atau gelap seperti host, dan beralih saat host beralih:

- Di aplikasi web, Google Drive, dan halaman Anda sendiri: mode terang atau gelap yang dilaporkan browser, yang mengikuti sistem operasi.
- Di VS Code: terang dengan tema warna terang, dan gelap dengan tema warna gelap atau salah satu dari kedua tema kontras tinggi.
- Di IDE JetBrains: tema terang atau gelap IDE.
- Di Obsidian: tema terang atau gelap Obsidian.

Tutup pembuat tema dengan `Escape`, dengan tombol `x` di samping judul, yang tooltipnya bertuliskan `Close (ESC)`, dengan penekanan di mana pun di editor di luar panel kecuali di bilah alat, atau dengan tombol `Theme` sekali lagi.  
Membuka pembuat tema menutup Properti Tabel dan pemilih `Display Language`. [Penjelajah](./explorer.md#dialogs-beside-it) yang terbuka tetap terbuka, dan dalam bahasa kiri ke kanan, pembuat tema berada tepat di sebelahnya alih-alih menutupinya.  
Membuka Pencarian Cepat atau pemilih `Display Language` menutupnya, begitu pula `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac). Pintasan itu membuka [Penjelajah](./explorer.md#opening-and-closing) pada pencariannya, atau, jika Penjelajah sudah terbuka, membiarkannya tetap terbuka dan memindahkan fokus keyboard ke kotak Temukan miliknya. Tombol `Explorer` di bilah alat membiarkan pembuat tema tetap terbuka.  
Pembuat tema tidak menahan tombol apa pun, sehingga pintasan editor berfungsi selama pembuat tema terbuka.

Di [Pencarian Cepat](./quick-search.md), `Theme` mencantumkan `System`, `Light`, dan `Dark`, dengan tanda centang pada tampilan yang berlaku. Memilih salah satunya hanya mengubah tampilan dan membiarkan warna abu-abu dan warna aksen apa adanya.

## Di setiap host {#in-each-host}

Apa yang Anda pilih di editor, dari bilah alat atau Pencarian Cepat, disimpan di tempat host menyimpannya, dan setiap diagram yang terbuka langsung mengikuti perubahannya, di mana pun perubahan itu dibuat.  
Di VS Code, IDE JetBrains, dan Obsidian, `Auto` milik host (nilai `auto` di VS Code) merupakan `System` milik editor. Memilih `System` menyimpan `Auto`, dan memilih `Light` atau `Dark` menyimpan tampilan tersebut, bahkan saat `Auto` sudah menampilkannya.  
Pengaturan dan pemberitahuan milik ekstensi dan plugin itu sendiri berbahasa Inggris, apa pun bahasa tampilannya.

### Aplikasi web dan Google Drive {#web-app-and-google-drive}

Di erd-editor.io, termasuk sesi kolaboratifnya, dan di Google Drive, satu bahasa dan satu tema berlaku untuk aplikasi dan setiap diagram di dalamnya.  
Keduanya disimpan di browser ini, bukan di skema atau file Drive, dan semua tab erd-editor.io menggunakannya bersama: pilihan di satu tab langsung mengubah tab lainnya.

Bahasanya adalah `System`, yang mengikuti bahasa yang diutamakan browser, hingga Anda memilih satu bahasa.  
Teks milik aplikasi sendiri, misalnya bilah sisi, tempat sampah, kolaborasi, dan layar Google Drive, mengikuti bahasa yang sama, dan dalam bahasa Ibrani, Arab, dan Persia seluruh aplikasi ditata dari kanan ke kiri. Kebijakan Privasi, Ketentuan Layanan, dan halaman dukungan tetap dalam bahasa Inggris.  
Selain panel editor dan Pencarian Cepat, baris bawah bilah sisi memiliki tombol bahasa, yang tooltipnya bertuliskan `Display Language`, di samping tautan `Privacy` dan `Terms`. Menunya mencantumkan `System`, dengan bahasa yang diwakilinya, lalu ke-25 bahasa.

Tema dimulai dari `System`, dengan warna abu-abu `olive` dan warna aksen `jade`.  
Selain pembuat tema dan Pencarian Cepat, bagian bawah bilah sisi memiliki tiga tombol ikon, `System`, `Light`, dan `Dark`: di samping `Trash` di erd-editor.io, dan di samping `Sign out` di Google Drive. Ketiganya mengatur tampilan yang sama dengan pembuat tema.

### VS Code {#vs-code}

Pengaturan ekstensi berada di bawah ERD Editor di Settings VS Code:

| Pengaturan | Nilai | Default |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`, atau kode dari [tabel bahasa](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | keenam warna abu-abu | `slate` |
| `dineug.erd-editor.theme.accentColor` | ke-26 warna aksen | `indigo` |

Editor Settings mencantumkan pengaturan bahasa sebagai `Auto` lalu setiap bahasa dengan nama dalam bahasanya sendiri. Nilai di `settings.json` yang tidak menyebut bahasa apa pun dibaca sebagai `auto`.  
Pilihan tema di editor menulis ketiga pengaturan tema. Pilihan ditulis di tempat pengaturannya sudah ditetapkan: folder workspace, jika tidak maka workspace, dan jika tidak juga maka pengaturan pengguna.

### IDE JetBrains {#jetbrains-ides}

Settings | Tools | ERD Editor memiliki `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:`, dan `Display language:` (`Auto`, lalu setiap bahasa dengan nama dalam bahasanya sendiri), yang disimpan untuk seluruh IDE.  
Nilai awalnya adalah `Auto`, `Slate`, `Indigo`, dan `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor memiliki `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color`, dan `Display language` (`Auto`, lalu setiap bahasa dengan nama dalam bahasanya sendiri), yang disimpan per vault.  
Nilai awalnya adalah `Auto`, `Slate`, `Indigo`, dan `Auto`.  
Perubahan berlaku untuk setiap tab ERD di vault, termasuk yang berada di jendela popout.

### Halaman Anda sendiri {#your-own-page}

`<erd-editor>` di halaman Anda sendiri tidak menampilkan tombol `Theme` maupun `Display Language`, dan Pencarian Cepat tidak mencantumkan keduanya, hingga halaman mengaktifkannya dengan [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) dan [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Hingga halaman menetapkan bahasa atau pembaca memilih bahasa, editor menampilkan bahasa Inggris, atau mengikuti `System` selama `enableLocalePicker` aktif.  
Tema dimulai dari `Dark`, dengan warna abu-abu `slate` dan warna aksen `indigo`, kecuali jika halaman menetapkan yang lain atau mengaktifkan [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
Pilihan pembaca langsung berlaku, tetapi elemen tidak menyimpan keduanya: halaman sendiri yang menetapkan nilai awalnya dan menyimpan pilihan pembaca — lihat [Tema](../../api/erd-editor-element.md#theme) dan [Bahasa tampilan](../../api/erd-editor-element.md#display-language) di API.
