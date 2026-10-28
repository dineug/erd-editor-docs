---
sidebar_position: 18
description: Menampilkan diagram secara hanya baca di situs lain tanpa kode dengan membingkai erd-editor.io/embed, membuat URL dan baris iframe-nya di builder, menetapkan tema, bahasa, Tampilan Nama, minimap, kontrol, dan warna di URL, serta menyajikan file dari GitHub atau server yang mengizinkan CORS.
---

# Menyematkan

[erd-editor.io/embed](https://erd-editor.io/embed) menampilkan diagram secara hanya baca dalam viewer yang mengisi halaman, untuk dibingkai situs lain: wiki, blog, pembuat situs, atau halaman apa pun yang tidak dapat memuat script sendiri.  
Parameter `src`-nya menyebut dokumen, yaitu alamat file sebagaimana disimpan ERD Editor, seperti file `.erd.json`. Sisa URL menentukan cara viewer menampilkannya, dan builder di alamat yang sama menuliskan URL beserta baris iframe-nya untuk Anda.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Bingkai ini menampilkan [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) dari repositori erd-editor, dan ini adalah baris yang memasangnya di halaman:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Apa yang ditampilkan bingkai {#what-the-frame-shows}

Bingkai menampilkan tabel, kolom, hubungan, memo, dan grup tabel diagram, dan tidak ada yang di dalamnya yang mengedit diagram atau file.  
Diagram disesuaikan dengan bingkai saat dimuat, apa pun zoom dan posisi gulir yang disimpan file, sehingga ukuran bingkai menentukan zoom awalnya.

Di atas kanvas terdapat:

- Minimap, selama diagram memiliki isi.
- Bilah kontrol di bagian bawah: `Zoom out`, tingkat zoom, yang mengatur ulang zoom saat diklik, `Zoom in`, `Fit`, daftar `Name View`, dan `Go to content` selama tidak ada bagian diagram di layar.
- Tautan `erd-editor.io` di kanan bawah, yang membuka erd-editor.io di tab baru dan tidak mengirim referrer kepadanya, sehingga klik itu tidak memberi tahu situs apa pun tentang dokumen yang ditampilkan bingkai. Pada bingkai yang sempit, tautan ini dapat menutupi sebagian bilah kontrol.

Selama file dimuat, bingkai menampilkan `Loading diagram`. Jika file tidak dapat diambil atau tidak memuat dokumen, bingkai menampilkan diagram kosong dengan `Couldn't load the diagram` — lihat [File di GitHub](#files-on-github) dan [File di server lain](#files-on-other-servers).

Bingkai hanya mengikuti URL-nya dan sistem pengunjung. Bahasa dan tema pengunjung sendiri di erd-editor.io tidak berlaku di dalamnya.

## Builder {#the-builder}

Buka [erd-editor.io/embed](https://erd-editor.io/embed) tanpa `src` untuk mendapatkan builder, halaman berjudul `Embed a diagram`:

1. Tempel alamat dokumen ke `Document URL`. Alamat berlaku saat Anda menekan `Enter` atau meninggalkan kolom, sehingga mengetik tidak mengambil apa pun. Setelah berlaku, baris `Loads from` di bawah kolom menyebut alamat yang diambil viewer: alamat yang Anda berikan, atau, untuk halaman di GitHub, alamatnya di host raw GitHub — lihat [File di GitHub](#files-on-github).
2. Pilih opsinya. Masing-masing langsung berlaku pada pratinjau, URL, dan baris iframe:
   - `Theme`: `System`, `Light`, atau `Dark`.
   - `Display Language`: `System`, dengan bahasa yang diwakilinya di browser Anda di sampingnya, lalu 25 bahasa, masing-masing dengan namanya sendiri.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names`, atau `Both Names`. `As Saved` menampilkan Tampilan Nama yang disimpan file.
   - `Accent color` dan `Gray color`, masing-masing dicantumkan dengan nama beserta contoh warna.
   - `Minimap` dan `Controls`, dua sakelar, keduanya aktif.
   - `Height`, dalam piksel, `480` pada awalnya. Tinggi yang bukan bilangan bulat positif dianggap `480`.
3. Periksa `Preview`: viewer sebagaimana akan ditampilkan bingkai, dengan tautan `erd-editor.io`, dalam kotak setinggi `Height`. Bahasa `System`-nya adalah bahasa browser Anda, apa pun bahasa yang ditampilkan erd-editor.io sendiri.
4. Salin hasilnya. `Embed URL` adalah alamat bingkai, dan `Embed code` adalah baris iframe, dengan tinggi yang Anda tetapkan dan lebar `100%`. Masing-masing memiliki tombol `Copy`, yang tetap nonaktif sampai URL dokumen berlaku, dan yang berbunyi `Copied` sesaat setelah penyalinan, sampai perubahan menulis ulang apa yang disalinnya.

Mengosongkan `Document URL` mengosongkan pratinjau dan kedua hasil begitu berlaku.

## Parameter URL {#url-parameters}

| Parameter | Nilai | Default |
| --- | --- | --- |
| `src` | Alamat dokumen, dienkode URL. | Tidak ada: tanpa parameter ini, atau dengan yang kosong, halamannya adalah builder. |
| `theme` | `light`, `dark`, atau `system`. | `system`: mode terang atau gelap yang dilaporkan browser pengunjung. |
| `locale` | `system`, atau kode dari [tabel bahasa](./language-and-theme.md#display-language), seperti `de-DE`. | `system`: bahasa browser pengunjung, dicocokkan seperti [System](./language-and-theme.md#what-system-follows) mencocokkannya, dan bahasa Inggris jika viewer tidak memiliki satu pun dari bahasa itu. |
| `name-view` | `physical`, `logical`, atau `both`. | Tampilan Nama yang disimpan file. |
| `minimap` | `false` menyembunyikan minimap. | Ditampilkan. |
| `controls` | `false` menyembunyikan bilah kontrol. | Ditampilkan. |
| `accent-color` | Salah satu dari 26 warna aksen [pembuat tema](./language-and-theme.md#theme), seperti `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive`, atau `sand`. | `slate` |

Default-nya adalah milik viewer sendiri, bukan milik aplikasi web, yang dimulai dengan `jade` dan `olive`.

- Builder tidak menyertakan opsi yang tetap pada defaultnya ke dalam URL, sehingga URL sematan hanya memuat apa yang berbeda.
- Nilai yang tidak diterima viewer diabaikan, dan opsinya mempertahankan defaultnya. Nilai dicocokkan persis seperti yang tercantum, sehingga `theme=Dark` diabaikan, dan `minimap` serta `controls` tetap ditampilkan untuk nilai apa pun selain `false`.
- Parameter yang diberikan dua kali mengambil nilai pertamanya.
- `src` dienkode URL, seperti yang ditulis builder, karena alamat yang memuat `&` atau `#` sendiri jika tidak akan terpotong.

## File di GitHub {#files-on-github}

File atau gist di GitHub dapat diberikan dengan alamat yang ditampilkan halamannya, seperti pada bingkai di atas. Viewer mengambilnya dari host raw GitHub sebagai gantinya, yang menjawab permintaan situs lain sementara alamat halamannya sendiri tidak:

- Halaman file, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, atau alamat `raw`-nya, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, dimuat dari `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` adalah branch, tag, atau commit: branch menampilkan file sebagaimana branch itu memilikinya, dan tag atau commit mempertahankan versi tersebut.
- Halaman gist, `https://gist.github.com/<user>/<id>`, dimuat dari `https://gist.githubusercontent.com/<user>/<id>/raw`, yaitu file pertama gist. Pertahankan diagram sebagai satu-satunya file gist.

URL sematan mempertahankan alamat yang Anda berikan, dan baris `Loads from` milik builder menampilkan alamat yang diambil.  
Ini hanya berlaku untuk repositori publik dan gist publik. Host raw menyimpan cache setiap file selama lima menit, sehingga perubahan yang Anda push dapat memerlukan waktu selama itu untuk tampil di bingkai.

## File di server lain {#files-on-other-servers}

Viewer di erd-editor.io mengambil file dengan `GET` biasa dari browser pengunjung, sehingga server yang menyimpannya harus mengizinkan permintaan lintas origin itu (CORS): jawabannya memerlukan header `Access-Control-Allow-Origin` yang mengizinkan `https://erd-editor.io`, seperti `*`.  
Permintaan tidak membawa cookie, sehingga file harus dapat dibaca tanpa masuk.  
Tanpa header itu, atau untuk alamat yang menjawab dengan kesalahan atau dengan sesuatu selain dokumen ERD Editor, bingkai menampilkan `Couldn't load the diagram`.

## Di dalam bingkai {#in-the-frame}

Bingkai tidak menerima roda, gestur, atau tombol sampai pengunjung mengklik atau mengetuknya atau menjangkaunya dengan `Tab`. Sampai saat itu, roda, usapan, dan cubitan menggulir atau melakukan zoom pada halaman di sekitarnya seperti biasa.  
Setelah memegang fokus, roda menggeser diagram, `Ctrl + Wheel` (Windows/Linux) atau `⌘ + Wheel` (Mac) dan cubitan melakukan zoom padanya, dan `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac) membuka pencarian atas dokumen, tempat `#` menemukan tabel, `@` kolom, dan `:` komentar atau memo.  
Seretan menggeser diagram, bingkai memegang fokus atau tidak, dan klik atau ketukan menyorot hubungan: hubungan tabel yang diklik, atau satu hubungan yang diklik. Tabel tempat penunjuk berada menyorot hubungannya sendiri. Lihat [Fokus dan tombol](../../api/erd-viewer-element.md#focus-and-keys) untuk setiap tombol.

Untuk mencoba diagram yang lebih besar, dengan zoom dan pencarian, buka [contoh bookstore](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), sembilan tabel dan dua grup tabel, di halaman tersendiri.

## Analitik {#analytics}

erd-editor.io menghitung kunjungan ke bingkai dengan Google Analytics, seperti menghitung kunjungan ke aplikasi web. Alamat yang dicatatnya untuk bingkai hanyalah `erd-editor.io/embed`, tanpa alamat dokumen yang disebut `src`.  
Lihat [Kebijakan Privasi](https://erd-editor.io/privacy).

## Memuat viewer sendiri {#loading-the-viewer-yourself}

Halaman yang dapat memuat script dapat menampilkan diagram dengan elemen [`<erd-viewer>`](../../api/erd-viewer-element.md) dari paket `@dineug/erd-editor` sebagai gantinya. Elemen ini menerima opsi yang sama sebagai atribut dan metode, tidak mengirim permintaan ke erd-editor.io, dan dapat memuat dokumen dari situs halaman itu sendiri, yang tidak memerlukan CORS.
