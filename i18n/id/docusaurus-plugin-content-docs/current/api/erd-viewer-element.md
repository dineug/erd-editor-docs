---
sidebar_position: 3
description: API elemen erd-viewer — diagram hanya baca dari value atau URL src, minimap dan bilah kontrolnya, event load dan error, tema, bahasa tampilan, fokus dan tombol, pemuatan, serta apa yang ditambahkannya ke halaman.
---

# ErdViewerElement

Sejak `5.0.0`, paket ini juga menyertakan `<erd-viewer>`, tampilan hanya baca dari sebuah dokumen: pembaca menggeser, melakukan zoom, mencari, dan menyorot hubungan, dan tidak ada yang mengedit di dalamnya. Elemen ini hanya menggambar kanvas ERD, dengan bilah gulirnya, sebuah [minimap](#minimap), sebuah [bilah kontrol](#controls), dan palet yang mencari di dokumen, serta tidak memiliki bilah alat, tab, Penjelajah, atau menu konteks.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Bingkai di atas adalah elemen ini sebagaimana ditampilkan erd-editor.io/embed, di sini dengan contoh bookstore: klik untuk memfokuskannya, lalu lakukan zoom dan pencarian dengan tombol di [Fokus dan tombol](#focus-and-keys), dan lihat [Menyematkan](../guide/guides/embedding.md) untuk membingkai dokumen Anda sendiri tanpa kode.

Viewer adalah `HTMLElement` biasa.  
Definisi tipenya adalah sebagai berikut.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Mengimpor `@dineug/erd-editor/erd-viewer.js` mendefinisikan `<erd-viewer>` dan membiarkan `<erd-editor>` tidak terdefinisi. Mengimpor root paket tidak mendefinisikan salah satunya: root mengekspor kelas `ErdViewerElement` dan `defineErdViewer()`, yang mendefinisikan tag di tempat Anda memanggilnya, sehingga halaman juga dapat mendefinisikan kelas ini di bawah tag buatannya sendiri — lihat [Mendaftarkan elemen](./installation.md#registering-the-elements).  
Setiap titik masuk kecuali `engine.js` dan `peer.js` memerlukan DOM, titik masuk ini juga, sehingga halaman yang di-render di server mengimpornya di sisi klien — lihat [Rendering sisi server](./installation.md#server-side-rendering).  
Mengimpor titik masuk ini menambahkan `erd-viewer` ke `HTMLElementTagNameMap`, sehingga `document.createElement('erd-viewer')` dan `document.querySelector('erd-viewer')` bertipe `ErdViewerElement` tanpa cast.

Seperti editor, viewer di-render ke dalam shadow root tertutup, sehingga `viewer.shadowRoot` bernilai `null` dan gaya halaman tidak bocor masuk maupun keluar; beri gaya melalui [setTheme](#settheme) dan custom property `--erd-editor-*`. Beberapa viewer dalam satu halaman masing-masing memegang dokumen, tampilan, tema, dan bahasanya sendiri.  
`<erd-viewer>` tidak memiliki ukuran intrinsik. Elemen kustom bersifat inline, jadi beri `display: block` dan tinggi, seperti di atas. Tampilan mengisi kotak elemen dan mengikutinya saat ukurannya berubah, dengan mempertahankan zoom.

`src`, `name-view`, `minimap`, dan `controls` adalah satu-satunya atributnya, masing-masing dengan properti bernama sama, `nameView` untuk `name-view`. [value](#value) hanya berupa properti.  
`value`, `src`, `nameView`, `minimap`, atau `controls` yang ditetapkan pada elemen sebelum tag-nya didefinisikan, misalnya oleh framework yang me-render elemen sebelum titik masuk selesai dimuat, diambil begitu tag didefinisikan, menimpa atribut yang diberikan markup. Nilai-nilai itu diambil menurut urutan halaman pertama kali menuliskan masing-masing, sehingga yang lebih akhir dari `value` dan `src` yang berlaku. `value` yang tidak memuat dokumen lalu tidak memiliki pemanggil untuk dilempari kesalahan: kesalahan itu dilaporkan sebagai kesalahan yang tidak tertangkap, dan viewer tetap kosong.

Build tag script, `dist/erd-viewer.umd.js`, hanya memuat viewer dengan semua dependensinya. Build ini mendefinisikan `<erd-viewer>` dan menaruh `ErdViewerElement` dan `defineErdViewer` di `window.ErdViewer`. URL CDN tanpa path menyajikan build editor sebagai gantinya, jadi sebutkan filenya — lihat [Tag script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

URL dokumen yang diambil dan ditampilkan viewer. Nilai defaultnya `''`, yaitu tidak ada.  
Pengambilannya adalah `fetch()` biasa, sebuah `GET` tanpa opsi tersendiri, sehingga aturan CORS browser berlaku: dokumen di origin lain memerlukan server yang mengizinkan origin halaman, dan cookie hanya dikirim ke origin halaman itu sendiri. URL relatif di-resolve terhadap halaman.  
Respons harus memuat dokumen sebagaimana file `.erd.json` memuatnya, yaitu bentuk penyimpanan yang ditulis [value](./erd-editor-element.md#value) editor dan setiap host resmi. Format lain tidak dibaca: file SQL, GraphQL, DBML, atau AML gagal sebagai teks yang tidak dapat di-parse.  
Dokumen yang berhasil di-parse mendarat dengan disesuaikan ke tampilan dan memancarkan [load](#load). Permintaan yang ditolak jaringan atau CORS, respons yang bukan `ok`, atau teks yang tidak dapat di-parse memancarkan [error](#error) dan meninggalkan diagram kosong — lihat [Memuat](#loading).

Hanya permintaan terakhir yang dihitung. `src` baru membatalkan pengambilan yang masih berjalan, sehingga jawaban yang lambat tidak pernah mendarat di atas dokumen yang lebih baru. Menetapkan [value](#value) juga membatalkannya, begitu pula menghapus `src` atau menetapkannya ke `''`, yang berhenti mengikutinya dan membiarkan dokumen yang ditampilkan seperti semula.  
Mana pun dari `value` dan `src` yang ditetapkan terakhir yang berlaku, baik melalui properti maupun atribut. `src` yang ditulis setelah `value` diambil bahkan ketika menyebut URL yang diambil sebelumnya. Jika ditulis lagi di atas dokumen yang sudah ditampilkannya, tidak ada yang diambil.  
Viewer hanya mengambil selama berada di halaman. Mengeluarkannya membatalkan pengambilan yang masih berjalan, dan memasangkannya kembali mengambil `src` yang belum ditampilkannya, termasuk yang gagal, tidak pernah yang sudah ditampilkannya.  
`src` adalah satu-satunya `fetch()` yang dilakukan paket ini, sehingga Content Security Policy yang ketat mencantumkan origin dokumen di `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Mengambil dokumen yang ditampilkan, baik berasal dari `src` maupun `value`, sebagai string JSON dalam bentuk penyimpanan yang ditulis [value](./erd-editor-element.md#value) editor. Sebelum apa pun ditampilkan, nilainya adalah dokumen baru yang kosong, yang `doc`-nya `{}`.  
Selama [penguncian](../guide/guides/settings.md#lock) `Viewport` dokumen aktif, seperti pada dokumen baru, getter menulis zoom dan guliran tempat dokumen terkunci, di mana pun pembaca telah memindahkan tampilan. Hanya dengan penguncian itu nonaktif ia menulis posisi tampilan saat ini, termasuk penyesuaian yang dibuat sebuah pendaratan.  
Getter menulis Tampilan Nama yang dipegang dokumen, tidak pernah yang ditampilkan [nameView](#nameview) atau bilah kontrol di atasnya, bahkan pada dokumen yang penguncian `Name View`-nya nonaktif.  
Getter masih mengembalikan dokumen setelah [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Menampilkan dokumen dari teksnya, menggantikan yang sedang ditampilkan, dan menyesuaikannya ke tampilan — lihat [Memuat](#loading). Setter menerima teks yang dipegang sebuah file atau `value` editor.  
Teks yang tidak dapat di-parse melempar kesalahan sebelum apa pun berubah, dan dokumen yang ditampilkan tetap: `SyntaxError` untuk teks yang bukan JSON, `TypeError` untuk JSON yang tidak memuat dokumen, seperti `7`. String kosong, atau apa pun yang bukan string, menampilkan diagram kosong.  
Menetapkannya membatalkan pengambilan `src` yang masih berjalan, dan tidak memancarkan `load` maupun `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Menampilkan diagram dalam [Tampilan Nama](../guide/guides/logical-names.md#name-view) di atas yang dipegang dokumen: `'physical'` untuk `Physical Names`, `'logical'` untuk `Logical Names`, atau `'both'` untuk `Both Names`. `null`, nilai default, menampilkan tampilan milik dokumen, dan nilai atribut selain ketiganya dibaca sebagai `null`.  
Nilai ini tetap berlaku atas setiap dokumen yang dimuat sesudahnya, dan [value](#value) tidak pernah menuliskannya. Menghapus atribut kembali ke tampilan milik dokumen.  
Daftar `Name View` di [bilah kontrol](#controls) juga mengganti tampilan, sampai dokumen berikutnya mendarat atau `nameView` berikutnya berubah. Penggantian di sana juga tidak ditulis ke `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Menampilkan minimap di sudut kanan atas, selama dokumen memuat tabel, memo yang ditampilkan, atau grup tabel yang ditampilkan. Nilai default-nya aktif.  
Minimap bekerja seperti milik editor: klik untuk memindahkan tampilan ke sana, atau seret persegi panjang area pandangnya untuk menggeser — lihat [Berkeliling kanvas](../guide/guides/table-related-functions.md#getting-around-the-canvas). Jari di atasnya adalah milik halaman sampai viewer memegang fokus.  
Hanya `minimap="false"` yang mematikannya. Atribut tanpa nilai, nilai lain apa pun, dan tanpa atribut semuanya membiarkannya aktif.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Menampilkan bilah kontrol di tengah tepi bawah kanvas. Nilai default-nya aktif, dan bilah memuat, dari kiri ke kanan:

- Zoom: `Zoom out`, zoom saat ini sebagai persentase, dan `Zoom in`. Kedua tombol melangkahkan zoom seperti tombol zoom, dan mengklik persentase, `Reset zoom`, mengembalikannya ke `100%`. Masing-masing menyebut tombolnya di tooltip.
- `Fit`, yang melakukan zoom dan guliran agar seluruh diagram tampil di tampilan, di tengah.
- `Name View`, tombol yang menyebut tampilan yang berlaku dan membuka daftar `Physical Names`, `Logical Names`, dan `Both Names` di atas bilah — lihat [nameView](#nameview).
- Kompas `Go to content`, yang bergabung di ujung bilah hanya selama tidak ada bagian diagram di layar, dan membawa tampilan ke bagian terdekatnya.

Bilah berdiri dari kiri ke kanan di setiap bahasa.  
Hanya `controls="false"` yang mematikannya, beserta kompas dan daftar `Name View`-nya. Atribut tanpa nilai, nilai lain apa pun, dan tanpa atribut semuanya membiarkannya aktif. Tanpa bilah, roda, cubitan, dan tombol tetap melakukan zoom begitu viewer memegang fokus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Event {#event}

`load` dan `error` adalah satu-satunya dua event, dan keduanya melaporkan `src`. Keduanya tidak menggelembung, jadi dengarkan pada elemen itu sendiri.

### load {#load}

Dipancarkan setelah dokumen yang disebut `src` diambil dan ditampilkan. `event.detail` adalah `null`.  
Menetapkan `value` tidak memancarkannya, begitu pula pengambilan yang dibatalkan oleh `src` berikutnya, `value`, pengeluaran elemen dari halaman, atau [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Dipancarkan ketika pengambilan `src` gagal: jaringan atau CORS menolak permintaan, respons bukan `ok`, atau teksnya tidak dapat di-parse. Viewer lalu menampilkan diagram kosong dan pemberitahuan `Couldn't load the diagram` — lihat [Memuat](#loading).  
`event.detail` adalah penyebabnya: `TypeError` yang ditolak `fetch()`, `Error` yang menyebut status, seperti `GET /missing.erd.json answered 404 Not Found`, atau `SyntaxError` atau `TypeError` dari parser.  
Pengambilan yang dibatalkan oleh sesuatu tidak memancarkan apa pun.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Menetapkan tema preset, dengan `ThemeOptions` milik editor — lihat [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Viewer dimulai pada `appearance: 'system'`, `grayColor: 'slate'`, dan `accentColor: 'indigo'`, sehingga sejak bingkai pertamanya ia menampilkan terang atau gelap yang dilaporkan sistem operasi, dan beralih ketika itu berubah. Editor justru dimulai dengan gelap.  
Setiap field diterapkan sendiri-sendiri, sehingga panggilan parsial membiarkan kedua field lainnya seperti semula. Nilai yang bukan salah satu dari nama yang ada diabaikan, dan panggilan tidak pernah melempar kesalahan.  
Viewer tidak memiliki pembuat tema dan tidak memiliki `systemDarkMode`, serta tidak memancarkan event untuk tema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Menyebut terang atau gelap yang ditampilkan tampilan `'system'`, untuk halaman yang memiliki terang dan gelap sendiri. Selama salah satunya disebut, perubahan sistem operasi diabaikan.  
`null`, atau nilai apa pun selain `'dark'` atau `'light'`, kembali mengikuti sistem operasi.  
Selama tampilannya `'light'` atau `'dark'`, ini tidak mengubah apa pun di layar, tetapi nilainya disimpan dan berlaku begitu tampilannya menjadi `'system'`. Ini tidak memancarkan apa pun.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Menimpa token tema di atas preset, dengan token `Theme` milik editor — lihat [setTheme](./erd-editor-element.md#settheme).  
Setiap panggilan menggantikan seluruh lapisan penimpa, jadi berikan `{}` untuk kembali ke preset. Hanya nama token, dengan nilai string, yang disimpan, dan `setPresetTheme` berikutnya menukar preset di bawahnya sementara penimpaan tetap.  
Custom property CSS `--erd-editor-*` juga sampai ke viewer, ditetapkan pada elemen atau di mana pun di atasnya — lihat [Variabel CSS](./erd-editor-element.md#css-variables). Kanvas, yang tidak dijangkau stylesheet mana pun, membacanya lagi ketika stylesheet di `head` halaman berubah, atau ketika atribut `class` atau `style` elemen atau elemen di atasnya berubah. Aturan yang ditambahkan dengan `insertRule()` tidak mengubah satu pun dari itu, sehingga kanvas mengambilnya pada perubahan semacam itu berikutnya.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Menetapkan bahasa tampilan: `'system'`, nilai default, atau salah satu dari 25 kode yang dicantumkan [Bahasa tampilan](./erd-editor-element.md#display-language) milik editor. Nilai lain apa pun, seperti `'ko'` polos atau nilai yang bukan string, diabaikan.  
Bahasa mengubah tooltip bilah kontrol, daftar `Name View`, palet, pemberitahuan pemuatan, dan kata-kata yang digambar diagram sendiri, seperti `unnamed`. Nama, komentar, dan sisa dokumen tidak pernah diterjemahkan.

Bahasa Inggris menjadi bagian titik masuk viewer dan berlaku sebelum panggilan kembali. Setiap bahasa lain adalah modul tersendiri, yang dihasilkan bundler Anda sebagai chunk di samping viewer dan diambil viewer dari bundel Anda saat halaman pertama kali meminta bahasa itu, satu kali untuk semua viewer di halaman. Sampai modul itu mendarat, viewer terus menampilkan bahasa yang ditampilkannya, bahasa Inggris pada bingkai pertama. Jika gagal dimuat, viewer menampilkan bahasa Inggris, dan meminta bahasa itu lagi mencobanya kembali.  
Build [tag script](./installation.md#script-tag) memuat semua 25 bahasa, jadi tidak mengambil apa pun. Bundel yang juga memuat editor memuat setiap bahasa bersama chunk editor — lihat [Mendaftarkan elemen](./installation.md#registering-the-elements).  
`Promise` yang dikembalikannya selesai begitu bahasa itu mendarat atau gagal mendarat, dan tidak pernah ditolak. Bahasa itu, atau bahasa Inggris setelah kegagalan, kemudian berlaku, kecuali panggilan berikutnya meminta bahasa lain: panggilan yang lebih akhir menang, apa pun urutan bahasa-bahasa itu mendarat.  
Bahasa Ibrani, Arab, dan Persia menata palet dan pemberitahuan pemuatan dari kanan ke kiri. Kanvas, minimap, bilah gulir, dan bilah kontrol beserta kompasnya tetap dari kiri ke kanan, seperti kanvas editor — lihat [Bahasa kanan ke kiri](../guide/guides/language-and-theme.md#right-to-left-languages).  
Viewer menetapkan `lang` dan `dir` pada root-nya sendiri di dalam shadow root tertutup, tidak pernah pada elemen host atau halaman.  
Ini tidak memancarkan apa pun, dan viewer tidak memiliki pemilih bahasa serta tidak menyimpan apa pun.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Menyebut bahasa yang diwakili `'system'`, sebagai tag BCP 47, untuk halaman yang memiliki pengaturan bahasa sendiri.  
Tag dipangkas spasinya. `null`, string kosong, atau nilai yang bukan string kembali ke bahasa halaman.  
Bahasa itu adalah `<html lang>` halaman, lalu `navigator.languages` browser, dibaca satu kali, saat viewer pertama kali tersambung. `'system'` mengambil yang pertama dari bahasa-bahasa itu yang dimiliki viewer, menurut aturan editor di [setSystemLocale](./erd-editor-element.md#setsystemlocale), dan bahasa Inggris jika tidak ada satu pun. Jadi halaman yang `<html lang>`-nya menyebut bahasa yang dimiliki viewer menampilkan bahasa itu apa pun yang disukai browser, dan perubahan `lang` atau bahasa browser berikutnya tidak menggerakkan viewer mana pun.  
Ini hanya berarti selama opsi yang berlaku adalah `'system'`, dan `Promise`-nya selesai seperti milik [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Mengakhiri viewer untuk selamanya. Ia menurunkan tampilan sebelum kembali, baik elemen masih di halaman maupun sudah dikeluarkan lebih dulu, membatalkan pengambilan `src` yang masih berjalan, dan berhenti mengikuti skema warna sistem operasi dan gaya halaman.  
Viewer yang dihancurkan tidak menggambar apa pun lagi, tidak mengambil apa pun, dan tidak meminta bahasa, bahkan ketika ditambahkan ke halaman lagi. Membaca [value](#value) masih mengembalikan dokumen yang dipegangnya.  
Mengeluarkan elemen dari halaman tidak menghancurkannya: dipasang kembali, ia berlanjut, dan mengambil `src` yang belum ditampilkannya — lihat [Memuat](#loading).

```js
viewer.destroy();
```

## Fokus dan tombol {#focus-and-keys}

Viewer tidak mengambil fokus saat dipasang, saat dokumen mendarat, atau saat paletnya ditutup, sehingga tidak pernah menggulir halaman ke dirinya sendiri atau mengambil tombol halaman.  
Klik atau ketukan pada kanvasnya memfokuskannya tanpa menggulir halaman, dan viewer adalah satu perhentian tombol `Tab`. Tidak seperti editor, viewer tidak memiliki anggota `focus()` atau `blur()` sendiri. Penekanan di mana pun di halaman selain itu mengambil fokus kembali.

Sampai viewer memegang fokus, halaman mempertahankan roda, yang menggulir halaman, dan cubitan trackpad. Jari di kanvas menggulir halaman dan tidak menggeser apa pun, dan setiap tombol sampai ke halaman tanpa dicegah.  
Setelah viewer memegang fokus:

- Roda menggeser tampilan, dan `Shift + Wheel` menggesernya ke samping. Di atas memo yang teksnya meluap, roda menggulir memo.
- `Ctrl + Wheel` (Windows/Linux) atau `⌘ + Wheel` (Mac), cubitan trackpad, atau dua jari di layar sentuh melakukan zoom.
- Satu jari menggeser tampilan.
- `Ctrl + Plus` dan `Ctrl + Minus` (Windows/Linux) atau `⌘ + Plus` dan `⌘ + Minus` (Mac) melangkahkan zoom seperti tombol `Zoom in` dan `Zoom out`, dan `Ctrl + 0` (Windows/Linux) atau `⌘ + 0` (Mac) langsung kembali ke `100%`, dengan mempertahankan bagian tengah layar di tempatnya.
- `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac) membuka palet, dan `Esc` menutupnya.

Itulah satu-satunya tombolnya, dan tombol itu tidak dapat dipetakan ulang. Setiap tombol lain sampai ke halaman tanpa dicegah, terfokus atau tidak: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F`, dan setiap kombinasi yang mengedit di editor.

Palet hanya mencari di dokumen dan tidak mencantumkan perintah. Input kosongnya menampilkan awalan: `#` mencari tabel, `@` kolom, `:` komentar dan memo, dan `?` mencantumkan awalan, seperti di editor — lihat [Mencari di diagram](../guide/guides/quick-search.md#searching-the-diagram). Kata tanpa awalan menampilkan `No commands match` di atas baris yang mencari kata itu di diagram.  
Memilih baris memindahkan tampilan menurut aturan editor, [Tempat lompatan berakhir](../guide/guides/table-related-functions.md#where-a-jump-lands), dengan membiarkan zoom seperti semula, dan memberi garis tepi pada apa yang dicapainya, dibawa ke depan: tabel, tabel yang memuat kolom atau komentar itu, atau memo.  
Memilih baris atau menekan `Esc` menutup palet dan membiarkan fokus tanpa elemen, sehingga roda berikutnya menggulir halaman; klik tampilan untuk memberinya roda dan tombol lagi. Selama palet terbuka, roda menggulir daftarnya, dan tombol zoom tidak melakukan apa pun.

Terfokus atau tidak, seretan dengan tombol utama mouse menggeser tampilan dari mana pun di kanvas, di atas tabel juga. Klik atau ketukan yang tidak bergerak menyorot hubungan: pada tabel, hubungan tabel itu; pada garis hubungan, garis itu; di tempat lain, memo termasuk, ia memadamkan sorotan. Klik semacam itu juga menghapus garis tepi yang ditinggalkan lompatan palet. Penunjuk yang berada di atas tabel menyorot hubungannya selama berada di sana.  
Tidak ada penekanan yang memilih, memindahkan, atau mengedit apa pun. Tidak ada pilihan selain garis tepi sebuah lompatan, tidak ada marquee, dan tidak ada klik ganda atau `Enter` yang membuka sel.

## Memuat {#loading}

Selama `src` dimuat, pemberitahuan di tengah kanvas berbunyi `Loading diagram` di samping pemuat yang berputar. Setelah pemuatan gagal, pemberitahuan itu berbunyi `Couldn't load the diagram` di samping tanda peringatan, sampai `src` baru atau `value` menggantikannya atau `src` dihapus. Penekanan menembus pemberitahuan ke kanvas, dan pemberitahuan dibaca dalam bahasa tampilan, dari kanan ke kiri pada bahasa kanan ke kiri.

Setiap dokumen yang mendarat, dari `src` maupun dari `value`, disesuaikan ke kotak viewer: di-zoom dan digulir agar seluruh diagram tampil, di tengah, seperti yang dilakukan `Fit`, dengan zoom dan guliran yang disimpan file diabaikan. Dokumen yang diserahkan sebelum viewer memiliki ukuran, ditetapkan sebelum berada di halaman atau saat kotaknya kosong, disesuaikan begitu viewer memilikinya. Perubahan ukuran berikutnya mempertahankan zoom; `Fit` menyesuaikan lagi.

Viewer mengambil `src` hanya selama berada di halaman. Mengeluarkannya membatalkan pengambilan yang masih berjalan, dan memasangkannya kembali mengambil `src` yang belum ditampilkannya, termasuk yang gagal, tidak pernah yang sudah ditampilkannya. Viewer yang tidak lagi diperlukan diakhiri dengan [destroy](#destroy).

## Apa yang ditambahkannya ke halaman {#what-it-adds-to-a-page}

- Tanpa worker. Viewer tidak menjalankan satu pun, sehingga Content Security Policy tidak memerlukan `worker-src` untuknya.
- Tanpa penyimpanan. Viewer tidak menulis cookie, `localStorage`, `sessionStorage`, maupun IndexedDB.
- Dua jenis permintaan: pengambilan [src](#src), yang origin-nya dicantumkan kebijakan yang ketat di `connect-src`, dan modul bahasa tampilan selain bahasa Inggris, dari bundel Anda sendiri — lihat [setLocale](#setlocale).
- Gaya di stylesheet bentukan (constructed stylesheets), yang diloloskan `style-src` yang ketat. Browser tanpa stylesheet bentukan, seperti Firefox sebelum 101, mendapat elemen `<style>` sebagai gantinya, yang memerlukan `style-src 'unsafe-inline'`.
- Listener pada `window`. Mengimpor titik masuk menambahkan tiga selama halaman hidup, untuk `mousedown`, `touchstart`, dan event `@dineug/erd-editor/internal-forward-move-start` milik paket sendiri. Konva, yang menggambar kanvas, menetapkan `window.Konva` dan, dengan stage pertamanya, menambahkan listener mouse dan sentuh ke `window` serta listener `visibilitychange` ke `document`, yang tidak pernah dihapusnya. Titik masuk editor menambahkan hal yang sama.
- Sampai [destroy](#destroy), setiap viewer mengikuti skema warna sistem operasi dan mengamati gaya halaman untuk custom property yang dijelaskan [setTheme](#settheme).
