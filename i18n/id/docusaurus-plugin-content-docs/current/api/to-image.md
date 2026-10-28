---
sidebar_position: 4
description: Menggambar dokumen sebagai PNG atau SVG dari kode Anda sendiri dengan toImage, memakai opsi dialog Export image, di browser dan di worker ekspor jika ada.
---

# toImage

Sejak `5.0.0`, root paket mengekspor `toImage()`, yang menggambar dokumen sebagai PNG atau SVG tanpa editor di halaman.  
Fungsi ini menulis file yang ditulis tombol `PNG` dan `SVG` pada dialog [Export image](../guide/guides/file-import-export.md#image), dengan ketiga opsi dialog itu, `Background`, `Dark mode`, dan `Scale`, dan tidak ada yang lain.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` diekspor sebagai tipe di sampingnya — lihat [Titik masuk](./installation.md#entry-points).

## value {#value}

Teks dokumen: apa yang dipegang file `.erd.json`, [value](./erd-editor-element.md#value) atau [runtimeValue](./erd-editor-element.md#runtimevalue) sebuah editor, atau teks lain apa pun yang dimuat [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Teks kosong, atau hanya spasi, menggambar diagram kosong, begitu pula JSON yang tidak memuat satu pun field dokumen, yang diisi parser dengan nilai default.

## Opsi {#options}

| Opsi | Default | Deskripsi |
| --- | --- | --- |
| `format` | Tidak ada; wajib | `'png'` menghasilkan `Blob` bertipe `image/png`, `'svg'` menghasilkan markup SVG sebagai string. |
| `background` | `true` | Mengecat warna kanvas di belakang diagram. `false` membiarkannya transparan, termasuk kotak di bawah label ON DELETE atau ON UPDATE. |
| `darkMode` | `false` | Menggambar tema gelap sebagai ganti tema terang. |
| `scale` | `2` | `1`, `2`, atau `3` piksel gambar per unit diagram pada 100%. Hanya menentukan ukuran PNG; SVG berukuran sama dengan diagram, berapa pun skalanya. |

`toImage()` tidak membaca kunci lain, jadi kunci yang tidak tercantum dalam tabel tidak mengubah apa pun.

## Apa yang digambarnya {#what-it-draws}

Gambarnya adalah gambar yang digambar dialog:

- Seluruh diagram, dipotong sebatas yang digambarnya ditambah margin dan selalu pada 100%, berapa pun zoom saat dokumen disimpan, sehingga setiap tabel digambar utuh. Apa yang disembunyikan [View Option](../guide/guides/table-related-functions.md#table-view-options) di dokumen tidak digambar maupun diberi ruang, grup tabel digambar di belakang yang lain, dan warna yang diberikan [pemeriksaan kamus](../guide/guides/dictionary.md#marks-on-the-canvas) pada nama tidak digambar.
- PNG berukuran diagram pada 100% dikalikan `scale`. PNG yang terlalu besar untuk kanvas browser ditulis pada resolusi yang dikurangi alih-alih gagal, dan `toImage()` tidak memberi tahu hal itu.
- SVG mempertahankan teksnya sebagai teks dan menyebut fontnya alih-alih menyematkannya, sehingga viewer tanpa font editor menggambar font lain. Bayangan dihilangkan.

Jika dialog mengambil layar editor, `toImage()` hanya mengambil dokumen, sehingga dokumen tergambar sama di setiap halaman:

- Warnanya adalah preset dari abu-abu dan aksen default elemen, `slate` dan `indigo`, terang kecuali `darkMode` bernilai `true`. Tidak ada tema milik halaman, penimpaan [setTheme](./erd-editor-element.md#settheme), maupun perubahan [pembuat tema](../guide/guides/language-and-theme.md) yang sampai kepadanya.
- Tabel dan kolomnya diberi nama menurut [Tampilan Nama](../guide/guides/logical-names.md#name-view) yang dipegang dokumen, yaitu tampilan yang terkunci untuk file yang penguncian `Name View`-nya aktif.
- Kata-kata yang digambar diagram sendiri, seperti placeholder tabel tanpa nama, berbahasa Inggris.

## Tempat ia berjalan {#where-it-runs}

`toImage()` memerlukan halaman browser, karena mengukur dan menggambar pada kanvas. Root paket tempat ia berasal memerlukan DOM untuk dimuat, sehingga tidak dijangkau dari Node atau Web Worker — lihat [Rendering sisi server](./installation.md#server-side-rendering).  
Fungsi ini menunggu font halaman selesai dimuat sebelum menggambar.

Fungsi ini menggambar di shared worker ekspor gambar jika host menjalankannya, seperti dialog, sehingga halaman tetap responsif selama itu, dan di thread utama jika tidak ada atau worker tidak menjawab tepat waktu — lihat [Web Worker](./installation.md#web-workers).  
Bundel yang mengimpor `toImage` dan tidak ada elemen hanya membawa worker ekspor gambar.  
Tidak satu pun build [tag script](./installation.md#script-tag) membawanya: `window.ErdEditor` dan `window.ErdViewer` tidak memiliki `toImage`.

## Penolakan {#rejections}

`Promise` yang dikembalikannya ditolak, sebelum apa pun digambar, ketika:

- halaman tidak memiliki `document`: sebuah `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` bukan string, seperti dokumen yang sudah di-parse menjadi objek: sebuah `TypeError`;
- sebuah opsi memuat nilai yang tidak tercantum dalam tabel [Opsi](#options), `format` yang hilang termasuk, begitu pula `scale` bernilai `'2'` yang diberikan bersama SVG: sebuah `TypeError` yang menyebut opsi tersebut, seperti `toImage: scale cannot be 4`;
- teks bukan dokumen yang dapat dibaca parser: kesalahan dari parser, `SyntaxError` untuk teks yang bukan JSON.

## Dialog Export image {#export-image-dialog}

Dialog dan `toImage()` menggambar melalui ekspor yang sama, sehingga dengan opsi yang sama keduanya menulis gambar yang sama, tetapi keduanya mulai dari tempat yang berbeda:

| | Dialog `Export image` | `toImage()` |
| --- | --- | --- |
| Dokumen | Diagram sebagaimana adanya saat dialog dibuka | Teks yang Anda berikan |
| Mode gelap | Dimulai sesuai tampilan editor, dan selama sesuai, menggambar warna layar itu sendiri | Nonaktif kecuali `darkMode` bernilai `true`, dan selalu preset |
| Tampilan Nama | Yang ditampilkan editor | Yang dipegang dokumen |
| Bahasa untuk kata-katanya sendiri | Bahasa tampilan editor | Inggris |
| Hasil | Disimpan melalui browser atau [callback ekspor](./installation.md#file-dialogs), atau disalin ke papan klip | Diserahkan kepada Anda; tidak ada callback file yang dipanggil |

`Copy to clipboard` tidak memiliki padanan. Halaman yang menginginkannya menulis `Blob` PNG ke papan klip sendiri.
