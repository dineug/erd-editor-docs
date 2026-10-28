---
sidebar_position: 1
description: Menginstal @dineug/erd-editor dari npm atau CDN, mendaftarkan elemen editor dan viewer, menghubungkan dialog file, dan meningkatkan versi dari 4.x atau 3.x.
---

# Instalasi

```sh
npm install @dineug/erd-editor
```

Paket ini khusus ESM (`"type": "module"`) dan hanya menyertakan folder `dist`.
Tidak ada build CommonJS, sehingga `require('@dineug/erd-editor')` tidak berfungsi.

Paket ini memuat dua elemen kustom: `<erd-editor>`, yaitu editor, dan, sejak `5.0.0`, `<erd-viewer>`, yang menampilkan diagram secara hanya baca — lihat [ErdViewerElement](./erd-viewer-element.md).
Sejak `5.0.0`, mengimpor root paket tidak mendefinisikan salah satunya. Setiap elemen memiliki titik masuk sendiri yang mendefinisikannya — lihat [Mendaftarkan elemen](#registering-the-elements).

Dependensi runtime-nya dibiarkan eksternal, sebagai bare import yang di-resolve, dideduplikasi, dan di-tree-shake oleh bundler Anda. Sejak `5.0.0`, `dist`-nya berisi satu file per modul, sehingga bundler hanya menyimpan modul yang dijangkau sebuah halaman — lihat [Titik masuk](#entry-points).
Shared worker-nya dihasilkan sebagai file titik masuk terpisah di bawah `dist/workers/` dan dibuat dengan `new URL('./…', import.meta.url)`, bentuk penulisan yang dibundel oleh Vite, webpack 5, dan Rspack sebagai titik masuk worker. Lihat [Web Worker](#web-workers).
Untuk halaman tanpa bundler di belakangnya, tersedia dua build mandiri — lihat [Tag script](#script-tag).

## Penggunaan {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` mendefinisikan `<erd-editor>` saat diimpor. Halaman yang hanya menampilkan diagram mengimpor `@dineug/erd-editor/erd-viewer.js` — lihat [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` tidak memiliki ukuran intrinsik. Beri elemen ini (atau kontainernya) lebar dan tinggi yang eksplisit.
Sejak `4.1.0`, [Penjelajah](../guide/guides/explorer.md) yang terbuka menempel di dalam elemen, di sebelah kiri kanvas ERD, dan mempersempit kanvas alih-alih menutupinya. Editor baru dimulai dengan Penjelajah tertutup.
Panel ini tidak digambar lebih sempit dari `200px` dan menyisakan setidaknya `320px` untuk kanvas, sehingga pada elemen yang lebih sempit dari `520px`, Penjelajah yang terbuka tidak digambar hingga elemen melebar — lihat [Di samping kanvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` memulai dokumen baru yang kosong. Menetapkan `value` justru memuat dokumen sebagai perubahan, sehingga dokumen itu masuk ke riwayat pembatalan.
Sejak `4.0.0`, `editor.value` adalah dokumen dalam bentuk yang tersimpan di file, dan bentuk itulah yang perlu disimpan. `editor.runtimeValue` adalah dokumen sebagaimana dipegang editor, termasuk entitas yang dihapus: nilai ini mengisi data awal kolaborator dan tidak pernah masuk ke file — lihat [runtimeValue](./erd-editor-element.md#runtimevalue).
Sejak `4.0.0`, dokumen baru juga memiliki setiap [penguncian pengaturan](../guide/guides/settings.md#lock) dalam keadaan aktif: area pandang, tab, bahasa Generator Kode, kedua konvensi penamaan, tipe tanda kutip, dan, sejak `4.2.0`, [Tampilan Nama](../guide/guides/logical-names.md#name-view). Menggulir, melakukan zoom, berpindah tab, mengganti Tampilan Nama, atau mengubah salah satu pengaturan lainnya membiarkan `editor.value` seperti semula dan tidak memicu `change`. Dokumen yang dimuat dari teks mempertahankan penguncian yang disebutkannya. Dokumen yang tidak menyebutkan penguncian apa pun, misalnya file apa pun yang disimpan sebelum `4.0.0`, dibuka dengan setiap penguncian aktif, pada zoom 100% dan di tab ERD, apa pun area pandang dan tab yang disimpannya. Area pandangnya dikunci pada titik asal `0, 0`, dan area pandang justru dibuka pada diagram jika tidak ada bagian diagram yang digambar di sana — lihat [setInitialValue](./erd-editor-element.md#setinitialvalue).
File yang disimpan sebelum `4.2.0` dibuka dengan Tampilan Nama terkunci pada `Physical Names`, bahkan file dengan semua penguncian lainnya nonaktif. Editor `4.0.0` atau `4.1.0` mempertahankan penguncian Tampilan Nama apa adanya saat menyimpan, tetapi membuang tampilannya, sehingga file `4.2.0` yang disimpan dengan Tampilan Nama tidak terkunci tetap tidak terkunci, tetapi dibuka kembali pada `Physical Names`.
Lihat [ErdEditorElement](./erd-editor-element.md) untuk bagian API lainnya.

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` me-resolve dependensi eksternal paket untuk Anda, sehingga cara ini berfungsi tanpa bundler.
Setiap titik masuk dijangkau dengan path-nya setelah versi: `…/erd-editor.js` mendefinisikan editor, dan `…/erd-viewer.js` viewer, yang mengambil setiap bahasa tampilan selain bahasa Inggris dari CDN begitu sebuah halaman memintanya. URL paket polos, `https://esm.run/@dineug/erd-editor@5.0.0`, menyajikan root, yang tidak mendefinisikan elemen apa pun.
URL tanpa versi selalu menyajikan rilis terbaru. Sematkan versi, seperti di atas, jika Anda tidak ingin peningkatan versi mayor sampai ke halaman Anda tanpa pemberitahuan.
`5.0.0` sendiri merupakan peningkatan versi mayor: halaman yang harus tetap di 4.x menyematkan `@4.2.0` — lihat [Migrasi dari 4.x](#upgrading-from-4x).

`esm.run` menyajikan shared worker dari `cdn.jsdelivr.net`, dan browser tidak menjalankan shared worker dari origin yang berbeda dengan origin halaman. Jadi editor yang dimuat dengan cara ini berjalan tanpa worker-nya, seperti pada host yang memblokirnya — lihat [Web Worker](#web-workers). Build [tag script](#script-tag) membawanya di dalam file-nya.

### Tag script {#script-tag}

Sejak `3.6.0`, paket ini juga menyertakan build UMD dengan setiap dependensi dan setiap shared worker di dalam satu file, `dist/erd-editor.umd.js`.
Build inilah yang dirujuk oleh field `unpkg` dan `jsdelivr`, sehingga URL paket polos di kedua CDN tersebut menyajikannya, dan build ini mendefinisikan `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Memuatnya mendefinisikan `<erd-editor>`. `window.ErdEditor` membawa dua callback file, `ErdEditor.setExportFileCallback` dan `ErdEditor.setImportFileCallback`, sejak `3.9.2` `ErdEditor.createKeyBindingMap`, sejak `4.2.0` `ErdEditor.dictionaryRowChords` — lihat [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — dan sejak `5.0.0` `ErdEditor.ErdEditorElement` dan `ErdEditor.defineErdEditor` — lihat [Mendaftarkan elemen](#registering-the-elements). Build ini tidak membawa [toImage](./to-image.md).

Sejak `5.0.0`, file kedua, `dist/erd-viewer.umd.js`, mendefinisikan `<erd-viewer>` dan menaruh `ErdViewerElement` dan `defineErdViewer` di `window.ErdViewer`. File ini tidak menjalankan worker apa pun, memuat semua 25 bahasa tampilan, dan tidak meminta apa pun selain `src` yang diberikan kepadanya.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Tidak ada file yang mendefinisikan tag milik file lainnya, dan masing-masing tidak meninggalkan global di halaman selain miliknya sendiri dan `window.Konva`.
Peta exports tetap mengarahkan bundler ke modul ES, sehingga instalasi dari npm tidak pernah mengambil salah satu file ini.
Halaman yang tidak dapat memuat script sendiri dapat membingkai viewer yang di-host di erd-editor.io/embed — lihat [Menyematkan](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Sejak `4.0.0`, `enable-locale-picker` menambahkan pemilih `Display Language` di bilah alat dan `enable-welcome-screen` menambahkan layar sambutan yang ditampilkan diagram kosong — lihat [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) dan [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Halaman yang memuat dokumen, seperti pada [Penggunaan](#usage), mengaktifkan `enableWelcomeScreen` setelah `setInitialValue()` memuat dokumen tersebut, bukan di markup, sehingga layar itu tidak pernah muncul sekilas di atas file yang masih dimuat.
Editor membawa ke-25 bahasa tampilan, baik di build ES maupun di build tag script, sehingga tidak ada file bahasa yang perlu disajikan dan tidak ada yang perlu didaftarkan. Tanpa pemilih maupun panggilan `setLocale()`, editor menampilkan bahasa Inggris.

Menambahkan `readonly` di sini membuka editor sebagai pembaca: menetapkan `value`, memanggil `clear()`, dan setiap panggilan `setSchema*()` — termasuk `setSchemaJSON()` dan panggilan penambahan — diabaikan, dan event `change` tidak pernah terpicu. Tab-tabnya, Penjelajah, dan Pencarian Cepat tetap untuk dibaca, dan setiap kontrol yang akan mengedit diagram dihilangkan.
Membaca `editor.value` dan `editor.runtimeValue` tetap berfungsi, dan keduanya mempertahankan pengaturan dokumen itu sendiri: pengaturan tampilan yang diubah pembaca, seperti zoom atau database, tetap berada di layar editor itu. Sebagai gantinya, muat dengan `setInitialValue()` — lihat [readonly](./erd-editor-element.md#readonly).

### Rendering sisi server {#server-side-rendering}

Setiap titik masuk kecuali `engine.js` dan `peer.js` memerlukan DOM, sehingga melempar kesalahan di Node. `erd-editor.js` dan `erd-viewer.js` mendefinisikan elemennya di cakupan modul, dan root paket, yang sejak `5.0.0` tidak mendefinisikan apa pun, tetap membangun kedua kelas elemen saat dimuat.
Di Next.js, Nuxt, SvelteKit, atau Astro, akses titik masuk elemen dari jalur khusus klien, dan impor bernama dari root, seperti `setExportFileCallback` atau `toImage`, dari jalur yang sama.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Saat pengembangan, tambahkan bundel ELK yang diimpor worker tata letak editor ke pra-bundling Vite, atau tata letak yang dibuat worker itu gagal: `Flow`, `Tree - vertical`, dan `Tree - horizontal` milik Tata Letak Otomatis, mode Alur di tab Visualisasi, dan impor yang ditempatkan oleh Alur.
Vite 7 dan yang lebih lama juga memerlukan editor dikeluarkan dari pra-bundling, karena pra-bundle mereka mengarahkan URL worker ke file yang tidak pernah ditulisnya, sehingga ketiga worker gagal. Di Vite 8, biarkan `exclude` itu tidak ada, yang hanya membuat server pengembangan mengambil setiap file paket satu per satu. Build produksi tidak memerlukan keduanya.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Mengimpor `@dineug/erd-editor/erd-editor.js` menggabungkan `erd-editor` ke dalam `HTMLElementTagNameMap`, dan `@dineug/erd-editor/erd-viewer.js` menggabungkan `erd-viewer`, sehingga elemen memiliki tipe tanpa cast. Impor apa pun dari root, tipe saja sekalipun, membawa keduanya.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` diekspor untuk menganotasi variabel dan props Anda sendiri. Sejak `5.0.0`, ia juga merupakan kelas elemen, dan `ErdViewerElement` adalah antarmuka sekaligus kelas viewer — lihat [Mendaftarkan elemen](#registering-the-elements).
Sejak `4.0.0`, paket ini juga mengekspor tipe `LocaleCode`, `LocaleOption`, dan `SchemaSQLOptions`, dan sejak `5.0.0` `ToImageOptions` — lihat [Titik masuk](#entry-points). Opsi yang diterima metode `setSchema*()` tidak memiliki nama yang diekspor; ambil dari elemen dalam bentuk `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Sejak `5.0.0`, `typesVersions` paket ini memberi tipe pada setiap titik masuk subpath di bawah `moduleResolution: "node10"` juga, yang tidak membaca peta exports.

## Mendaftarkan elemen {#registering-the-elements}

Sejak `5.0.0`, paket ini mendefinisikan tag hanya di tempat halaman memintanya.

| Impor | Mendefinisikan |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Tidak ada |

Masing-masing dari kedua titik masuk mendefinisikan tag-nya saat dievaluasi dan tidak mengekspor apa pun, sehingga diimpor hanya demi efeknya, dan tidak ada yang mendefinisikan tag milik yang lain.
Root mengekspor kedua kelas elemen, `ErdEditorElement` dan `ErdViewerElement`, serta `defineErdEditor()` dan `defineErdViewer()`, yang mendefinisikan tag-nya di tempat Anda memanggilnya:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Panggilan tidak melakukan apa pun selama tag sudah dipegang kelas itu, sehingga sebuah titik masuk dan sebuah panggilan define, atau dua panggilan define, dapat bertemu dalam satu halaman. Panggilan melempar `Error` yang menyebut tag tersebut ketika kelas lain memegangnya, seperti salinan kedua paket yang dibundel ke halaman yang sama: `Another element class already defines the custom element name erd-editor`.
Kelas di root adalah kelas yang didefinisikan oleh titik masuk, sehingga `customElements.get('erd-editor') === ErdEditorElement` setelah salah satunya dijalankan. Sebelum tag didefinisikan, `document.createElement('erd-editor')` membuat `HTMLElement` biasa tanpa anggota editor mana pun, dan `new ErdEditorElement()` melempar kesalahan.

Untuk tag buatan Anda sendiri, definisikan kelasnya di bawah tag itu sendiri dan tambahkan tag ke `HTMLElementTagNameMap` sendiri. Lakukan di jendela yang tidak memuat titik masuk elemen itu maupun build [tag script](#script-tag)-nya dan tidak memanggil fungsi define untuknya, karena satu kelas hanya mendapat satu nama per jendela:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Bundel yang memuat kedua elemen membuat Vite dan Rolldown memperingatkan `INEFFECTIVE_DYNAMIC_IMPORT` satu kali untuk setiap bahasa tampilan selain bahasa Inggris. Viewer memuat masing-masing bahasa itu dengan `import()` miliknya sendiri, sedangkan editor mengimpor semua kamus sekaligus, sehingga bahasa-bahasa itu tetap berada di chunk editor dan dimuat bersamanya. Tidak ada yang gagal, dan bundel yang hanya berisi viewer menyimpan setiap bahasa di chunk-nya sendiri.

## Penyorotan sintaksis {#syntax-highlighting}

Panel Skema SQL dan Generator Kode disorot oleh [Shiki](https://shiki.style), di shared worker tersendiri, dan sejak `4.0.0` begitu pula skrip `Before tables` dan `After tables` di tab Skema SQL.
Sejak `3.7.0`, tidak ada yang perlu diinstal dan tidak ada yang perlu didaftarkan: worker dibuat saat panel kode pertama kali di-render, sehingga halaman yang tidak membuka panel kode apa pun tidak pernah mengambil grammar.

| | |
| --- | --- |
| Bahasa | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Tema | `github-dark` dan `github-light`, mengikuti tampilan terang atau gelap editor |

Itulah tepatnya bahasa yang dihasilkan panel: `JPA` disorot sebagai Java, `SQLAlchemy` sebagai Python, `TypeORM`, `Sequelize`, `Drizzle`, dan `Zod` sebagai TypeScript, `Doctrine` sebagai PHP, `SeaORM` sebagai Rust, `JSON Schema` sebagai JSON, serta `DBML` dan `AML` sebagai SQL, grammar terdekat di dalam bundel — lihat [Generator Kode](../guide/guides/code-generator.md).

Mesin regex-nya berupa JavaScript murni, sehingga tidak ada kebijakan host yang memerlukan `wasm-unsafe-eval`.
Di browser yang tidak menyediakan `SharedWorker` — Chrome di Android sebelum Chrome 148, Safari sebelum 16.4 — kegagalan dicatat di log dan kode ditampilkan sebagai teks biasa; skrip tetap dapat diedit.

Jika meningkatkan versi dari `3.6.0` atau yang lebih lama: `@dineug/erd-editor-shiki-worker` tidak lagi dipublikasikan, dan `setGetShikiServiceCallback` ikut dihapus bersamanya.
Hapus instalasi dan pendaftarannya; halaman yang memuat worker dari CDN juga menghapus tag `<script>` kedua tersebut.

## Web Worker {#web-workers}

Editor menjalankan tiga pekerjaan di `SharedWorker`: penyorotan sintaksis, ekspor gambar, dan tata letak tabel di balik [Tata Letak Otomatis](../guide/guides/table-related-functions.md#auto-layout), [mode Alur](../guide/guides/visualization.md#how-flow-is-placed) di tab Visualisasi, dan, sejak `4.0.0`, penempatan skema yang diimpor.
Ketiganya disertakan di dalam `@dineug/erd-editor`. Tidak satu pun perlu Anda siapkan, tetapi masing-masing dapat diblokir oleh host.
Sejak `5.0.0`, setiap worker dibuat di modulnya sendiri, sehingga bundel hanya membawa worker yang dijangkau modulnya: bundel [toImage](./to-image.md) tanpa elemen apa pun hanya membawa worker ekspor gambar, dan `<erd-viewer>` tidak menjalankan worker sama sekali — lihat [Titik masuk](#entry-points).
Worker yang menjalankan garbage collection dokumen dihapus di `4.0.0`, bersama dengan garbage collection itu sendiri.

| Worker | Tanpa worker ini |
| --- | --- |
| Penyorotan sintaksis | Panel Skema SQL dan Generator Kode serta skrip Skema SQL tetap berupa teks biasa |
| Ekspor gambar | PNG, SVG, `Copy to clipboard`, pratinjau dialog `Export image`, dan, sejak `5.0.0`, [toImage()](./to-image.md) digambar di thread utama, yang memblokir halaman selama proses menggambar |
| Tata letak tabel | Tata letak `Flow`, `Tree - vertical`, dan `Tree - horizontal` di Tata Letak Otomatis, serta mode Alur di tab Visualisasi, berakhir dengan `Could not place tables`; impor yang ditempatkan oleh Alur — file SQL, GraphQL, DBML, atau AML dari `Import` atau `Import and Add`, atau panggilan `setSchema*()` dengan `placement: 'auto'` — menempatkan tabelnya dalam baris, tanpa pesan; `Force` dan mode Graf tidak terpengaruh, karena keduanya berjalan di dalam editor |

Ekspor gambar menunggu jawaban worker-nya selama sepuluh detik, lalu menggambar di thread utama, dan penyorotan sintaksis membiarkan kode sebagai teks biasa begitu worker-nya gagal, sehingga host yang memblokir worker mengorbankan performa, bukan fungsi.
Tata letak tabel adalah pengecualiannya: mesin yang menghitung tata letak lebih besar daripada editor itu sendiri dan tidak pernah dimuat di dalam proses, sehingga tata letak tabel menunggu worker-nya selama tiga puluh detik pada penempatan pertama, dan setelah worker menjawab, tata letak diberi waktu enam puluh detik untuk kembali.
Jika salah satu waktu tunggu habis, penempatan berakhir seperti saat tanpa worker. Tata Letak Otomatis menampilkan `Placing tables` begitu dimulai, sedangkan mode Alur dan impor yang ditempatkan oleh Alur baru menampilkannya setelah penempatan, termasuk waktu memulai worker-nya, berjalan selama enam detik.

Vite, webpack 5, dan Rspack menghasilkan worker sebagai file di samping chunk Anda. esbuild, dan Rolldown yang dipakai sendiri tanpa melalui Vite, tidak menghasilkan apa pun, sehingga halaman yang mereka bangun berjalan tanpa worker.
Di bawah `experiments.outputModule` eksperimental webpack, tidak ada worker yang berjalan, karena masing-masing menunggu chunk yang dipisahkan darinya dan tidak dimuat oleh siapa pun. Pertahankan output default webpack, atau setel `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Halaman dengan Content Security Policy yang ketat memerlukan direktif berikut untuk elemen-elemennya:

- `worker-src 'self'` untuk build yang dibundel, yang worker-nya berupa file di samping paket, ditambah `blob:` jika bundler Anda menyisipkan worker secara inline. Di build [tag script](#script-tag), ketiganya dibawa di dalam file sebagai URL `data:`, sehingga halaman tersebut memerlukan `worker-src data:` sebagai gantinya. `<erd-viewer>` tidak memerlukan keduanya, karena tidak menjalankan worker.
- Sejak `5.0.0`, kedua elemen memberi gaya pada dirinya sendiri dengan stylesheet bentukan (constructed stylesheets), yang diloloskan oleh `style-src 'self'`. Panel kode editor masih mewarnai teksnya dengan atribut `style`, dan pratinjau dialog `Export image` adalah gambar pada URL `blob:`, sehingga editor juga memerlukan `style-src 'unsafe-inline'` dan `img-src blob:` untuk keduanya.
- Browser tanpa stylesheet bentukan, seperti Firefox sebelum 101, mendapat elemen `<style>` sebagai gantinya, yang memerlukan `style-src 'unsafe-inline'` untuk kedua elemen.
- `<erd-viewer>` mengambil `src`-nya, sehingga origin tersebut dimasukkan ke `connect-src` — lihat [Apa yang ditambahkannya ke halaman](./erd-viewer-element.md#what-it-adds-to-a-page).

## Titik masuk {#entry-points}

Paket ini memiliki lima titik masuk:

| Titik masuk | Isinya |
| --- | --- |
| `@dineug/erd-editor` | Root: ekspor di bawah ini. Sejak `5.0.0`, root tidak mendefinisikan elemen apa pun, meskipun masih memerlukan DOM untuk dimuat |
| `@dineug/erd-editor/erd-editor.js` | Sejak `5.0.0`. Mendefinisikan `<erd-editor>` dan tidak mengekspor apa pun |
| `@dineug/erd-editor/erd-viewer.js` | Sejak `5.0.0`. Mendefinisikan `<erd-viewer>` dan tidak mengekspor apa pun |
| `@dineug/erd-editor/engine.js` | Store dokumen tanpa DOM |
| `@dineug/erd-editor/peer.js` | Sejak `3.9.1`. Peer headless untuk server MCP |

Root mengekspor kedua kelas elemen beserta fungsi define-nya, dua setter callback, sejak `3.9.2` kombinasi tombol default beserta tipenya, sejak `4.0.0` tipe bahasa tampilan serta tipe opsi `getSchemaSQL()`, sejak `4.2.0` kombinasi tombol baris di tab Kamus, dan sejak `5.0.0` `toImage`.

| Ekspor | Deskripsi |
| --- | --- |
| `ErdEditorElement` | Antarmuka elemen — lihat [ErdEditorElement](./erd-editor-element.md). Sejak `5.0.0`, juga kelasnya, yang dengannya `<erd-editor>` didefinisikan — lihat [Mendaftarkan elemen](#registering-the-elements). |
| `ErdViewerElement` | Sejak `5.0.0`. Antarmuka dan kelas viewer — lihat [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Sejak `5.0.0`. Mendefinisikan `<erd-editor>` atau `<erd-viewer>` sebagai kelasnya. Panggilan tidak melakukan apa pun selama tag dipegang kelas itu, dan melempar `Error` ketika kelas lain memegangnya — lihat [Mendaftarkan elemen](#registering-the-elements). |
| `toImage(value, options)` | Sejak `5.0.0`. Menggambar dokumen sebagai `Blob` PNG atau string SVG, dengan opsi dialog `Export image` — lihat [toImage](./to-image.md). |
| `ToImageOptions` (tipe) | Sejak `5.0.0`. Opsi yang diterima `toImage()`: `format`, `background`, `darkMode`, dan `scale`. |
| `setExportFileCallback(cb)` | Menggantikan unduhan browser, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Menggantikan pemilih file browser, `({ type, op, accept, mode }) => void`; `mode` sejak `4.0.0`. Sejak `4.2.0`, `Import CSV` di tab Kamus membuka pemilih file browser bahkan saat callback telah ditetapkan — lihat [Dialog file](#file-dialogs). |
| `createKeyBindingMap()` | Mengembalikan kombinasi tombol default sebagai `KeyBindingMap` baru pada setiap panggilan — lihat [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipe) | Peta kombinasi tombol, union dari nama perintahnya, dan satu kombinasi tombol. |
| `dictionaryRowChords(map)` | Sejak `4.2.0`. Mengembalikan, sebagai `ShortcutOption[]` baru pada setiap panggilan, kombinasi tombol yang digunakan kisi tab [Kamus](../guide/guides/dictionary.md#adding-and-deleting-rows) untuk menyisipkan dan menghapus baris menurut `KeyBindingMap` yang Anda berikan. Kombinasi yang menyisipkan baris di atas, `Alt+Shift+Enter` dengan nilai default, tidak terdapat di kombinasi tombol mana pun — lihat [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipe) | Sejak `4.0.0`. 25 kode bahasa tampilan, dan kode-kode tersebut ditambah `'system'`, yang diterima `setLocale()` — lihat [Bahasa tampilan](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipe) | Sejak `4.0.0`. Opsi yang diterima `getSchemaSQL()`: `statements`, `header`, dan, sejak `4.2.0`, `logicalNameAsComment` — lihat [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Sejak `5.0.0`, `dist` berisi satu file tanpa minifikasi per modul, masing-masing di samping deklarasinya, dan `sideEffects` di `package.json` hanya menyebut kedua titik masuk tag dan dua stub yang dibutuhkan file worker. Jadi bundler membuang setiap modul yang tidak dijangkau halaman dan meminifikasi sekali:

- Impor bernama dari root, seperti `setExportFileCallback`, tidak membundel elemen maupun worker.
- `toImage` membawa worker ekspor gambar dan tidak ada elemen.
- `erd-editor.js` membawa editor dan ketiga shared worker.
- `erd-viewer.js` membawa viewer tanpa worker, dengan bahasa Inggris di dalamnya dan setiap bahasa tampilan lain di chunk-nya sendiri, yang dimuat begitu halaman memintanya.

`@dineug/erd-editor/engine.js` menjalankan store dokumen tanpa DOM, sehingga berfungsi di Web Worker — lihat [Penyimpanan jarak jauh](./advanced/remote-storage.md).
Titik masuk ini mengekspor `createReplicationStore` dan tipe `ReplicationStore`. Sejak `3.10.0`, titik masuk ini juga mengekspor tipe `ReplicationChange`, `{ value: string; changed: boolean }`, yang diterima listener `change` milik replika — lihat [on@change](./advanced/remote-storage.md#onchange).
Sejak `4.0.0`, `ReplicationStore` juga memiliki `runtimeValue`. `value`-nya dan `value` yang diserahkan oleh `change` berupa bentuk penyimpanan sebagaimana tersimpan di file, sama seperti milik elemen — lihat [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` adalah peer headless yang digunakan [server MCP](../mcp/introduction.md) untuk mengedit dokumen. Titik masuk ini ada untuk server tersebut, dan halaman-halaman ini tidak mendokumentasikannya.

### Dialog file {#file-dialogs}

Impor dan ekspor melewati callback yang dapat diinjeksi, sehingga host tanpa dialog file browser — misalnya webview IDE — dapat menyediakan dialognya sendiri.
Keduanya tidak simetris: ekspor menyerahkan file yang sudah jadi kepada Anda, sedangkan impor hanya meminta file, dan Anda sendiri yang memasukkan kembali isinya.
Sejak `4.2.0`, `Import CSV` di tab Kamus adalah satu-satunya impor yang tidak pernah memanggil callback impor, yang `type`-nya tidak memiliki nilai CSV. Impor ini selalu membuka pemilih file milik browser sendiri, untuk file `.csv` — lihat [Mengimpor dan mengekspor CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` bernilai `set` atau `diff` — `diff` diteruskan ke `setDiffValue()`, apa pun `type`-nya. Selain itu, `type` menentukan metodenya, dan `accept` membawa ekstensi tipe tersebut, siap diserahkan ke dialog file host.
Sejak `4.0.0`, `set` membawa `mode: 'append'` saat pengguna memilih [Impor dan Tambahkan](../guide/guides/file-import-export.md#import-and-add), dan tidak membawa `mode` untuk Impor biasa. Teruskan nilai ini: callback yang membuangnya mengganti diagram yang ingin ditambahi pengguna.

| `type` | `accept` | Metode |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` menata tabel berdasarkan hubungannya sebelum tabel ditempatkan, seperti yang dilakukan Impor milik editor sendiri, dan membuat panggilan mengembalikan Promise. Tanpa opsi ini, tabel langsung ditempatkan dalam baris — lihat [setSchemaSQL](./erd-editor-element.md#setschemasql) dan [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Buat cabang untuk setiap `type` yang Anda tangani dan abaikan sisanya.
Panggilan `setSchemaJSON()` yang mengganti, seperti menetapkan `value`, mengosongkan dokumen sebelum mem-parsing, sehingga mengarahkan payload yang bukan dokumen `.erd.json` ke sana — melalui `else` penampung semua kasus, atau karena `type` yang ditambahkan kemudian lolos ke cabang tersebut — mengosongkan diagram alih-alih mengimpor apa pun.

`fileName` yang dihasilkan editor adalah `<database name>-<timestamp>` ditambah ekstensi file, dengan stempel waktu berupa waktu lokal berformat `yyyy-MM-dd'T'HH_mm_ss`. Nama database yang kosong diganti dengan `unnamed`. File CSV dari tab Kamus mencantumkan nama lembarnya sebelum ekstensi, seperti pada `<database name>-<timestamp>-words.csv`.
Callback ekspor menerima file berikut. Sejak `4.0.0`, SVG dan file Generator Kode termasuk di antaranya, dan `.sql` berasal dari `Save file` di tab Skema SQL, bukan langsung dari `Export`. Sejak `4.2.0`, file CSV dari tab Kamus juga termasuk di antaranya. [toImage()](./to-image.md) tidak memanggil callback mana pun: ia menyerahkan gambarnya kepada Anda.

| File | Ekstensi | `type` Blob |
| --- | --- | --- |
| Ekspor JSON | `.erd.json` | `application/json` |
| `Save file` di tab Skema SQL, yang berisi teks yang ditampilkan tab tersebut — lihat [Skema SQL](../guide/guides/schema-sql.md) | `.sql` | tidak ada |
| Dialog [Ekspor gambar](../guide/guides/file-import-export.md#image) | `.png` atau `.svg` | `image/png` atau `image/svg+xml` |
| `Save file` di tab Generator Kode — lihat [Generator Kode](../guide/guides/code-generator.md) | Ekstensi bahasanya: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` atau `.mmd` | tidak ada |
| `Export CSV` di tab Kamus, yang berisi setiap baris lembar yang ditampilkan, apa pun yang dicantumkan pencariannya — lihat [Mengimpor dan mengekspor CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Host yang memilih handler berdasarkan ekstensi memerlukan satu handler untuk masing-masing file tersebut.

Jika tidak diatur, editor menggunakan perilaku unduhan dan pemilih file bawaan browser. Berikan `null` untuk kembali ke perilaku tersebut.

## Dukungan browser {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — baseline ES2022 yang menjadi target build bundel yang dipublikasikan.
Tidak ada polyfill yang dibundel. Tambahkan polyfill sendiri jika Anda perlu menjangkau browser yang lebih lama.

## Migrasi dari 4.x {#upgrading-from-4x}

`5.0.0` adalah rilis mayor. Periksa setiap poin berikut saat memindahkan halaman dari 4.x:

- `import '@dineug/erd-editor'` tidak lagi mendefinisikan `<erd-editor>`. Impor `@dineug/erd-editor/erd-editor.js` demi efeknya, atau panggil `defineErdEditor()`, dan biarkan impor bernama Anda dari root apa adanya. TypeScript tidak menandai halaman yang masih memakai impor polos, karena deklarasi root masih menyebut tag di `HTMLElementTagNameMap`, tetapi elemen yang dibuatnya adalah `HTMLElement` biasa, sehingga pemanggilan metode pertamanya melempar `TypeError` — lihat [Mendaftarkan elemen](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Di CDN, hal yang sama berlaku untuk `https://esm.run/@dineug/erd-editor`, yang kini menyajikan root dan tidak mendefinisikan apa pun: impor `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. URL jsDelivr dan unpkg polos tetap menyajikan build tag script, yang mendefinisikan `<erd-editor>` seperti sebelumnya. URL tanpa versi kini menyajikan rilis 5.x terbaru; sematkan `@4.2.0` untuk tetap di 4.x — lihat [CDN](#cdn) dan [Tag script](#script-tag).
- Root tidak mendefinisikan apa pun tetapi tetap memerlukan DOM, sehingga pada rendering sisi server, impor bernama darinya, seperti `setExportFileCallback`, tetap berada di jalur khusus klien di samping titik masuk elemen — lihat [Rendering sisi server](#server-side-rendering).
- `window.ErdEditor` mendapat `ErdEditorElement` dan `defineErdEditor`. Build tag script viewer menaruh `ErdViewerElement` dan `defineErdViewer` di `window.ErdViewer`, dan tidak ada global yang membawa `toImage`.
- Editor `readonly` terbuka sebagai pembaca. Keenam tabnya, Penjelajah, Pencarian Cepat, dan presence tetap ada, dan setiap kontrol yang akan mengedit diagram dihilangkan, bukan dinonaktifkan: bilah alat menampilkan nama database sebagai teks, tab Pengaturan menampilkan pengaturannya dengan setiap kontrol dinonaktifkan di bawah lencana `Read only`, dan bilah alat mengambang hanya mempertahankan zoom, Tampilan Nama, mode Zen, dan kompas, sehingga `Hand` dan `Select` hilang dan seretan menggeser kanvas. Penekanan tidak memilih apa pun: satu-satunya pilihan adalah garis tepi yang diletakkan lompatan dari Penjelajah atau Pencarian Cepat di sekeliling apa yang dicapainya, yang dihapus klik diam, dan kombinasi tombol pilih semua tidak memilih apa pun. Menyalakan `readonly` mengakhiri apa yang sedang terbuka, seperti pilihan, alat tangan, editor sel, seretan, Petakan Kolom, pratinjau `Force` milik Tata Letak Otomatis, dan Perjalanan Waktu, dan mempertahankan guliran, zoom, tab, dan Tampilan Nama — lihat [readonly](./erd-editor-element.md#readonly).
- Pengaturan yang diubah pembaca `readonly` tetap berada di layar editor itu apa pun penguncian miliknya: guliran dan zoom, tab, Tampilan Nama, View Option, database, serta bahasa, konvensi penamaan, dan tipe tanda kutip Code Generator. `value`, `runtimeValue`, dan ekspor JSON mempertahankan pengaturan dokumen itu sendiri, yang pada pembaca 4.x dapat dijangkau perubahannya, dan `getSharedStore()` tidak mengirim satu pun ke editor lain. `getSchemaSQL()` tanpa vendor menulis database yang dipilih pembaca. Mematikan `readonly` mengembalikan database, pengaturan kode, dan View Option ke nilai dokumen, dan membiarkan guliran, zoom, tab, dan Tampilan Nama di tempat pembaca meninggalkannya.
- Baris `Recalculation table width` di tab Pengaturan dihapus. Pemuatan dan penempelan tetap menyesuaikan lebar setiap tabel dengan teksnya.
- Di Vite 8, hapus `exclude: ['@dineug/erd-editor']` dari `optimizeDeps`, yang hanya masih diperlukan Vite 7 dan yang lebih lama, dan pertahankan `include` ELK — lihat [Vite](#vite).

## Migrasi dari 3.x {#upgrading-from-3x}

`4.0.0` adalah rilis mayor. Periksa setiap poin berikut saat memindahkan halaman dari 3.x, lalu poin-poin [Migrasi dari 4.x](#upgrading-from-4x) untuk `5.0.0`:

- `editor.value`, `value` milik replika, dan `value` yang diserahkan oleh `change`-nya berupa bentuk penyimpanan sebagaimana tersimpan di file: tanpa entitas yang dihapus, lebar terukur, urutan tumpukan, atau jangkar hubungan. Tetap simpan `value`, dan baca informasi tersebut dari `runtimeValue`; stempel waktu entitas (`meta`) dihapus sepenuhnya. Isi data awal kolaborator atau replika yang bergabung ke sesi yang sedang berjalan dari `runtimeValue` milik peer yang sedang berjalan, bukan dari `value` atau file, dan jangan pernah menyimpan `runtimeValue` — lihat [value](./erd-editor-element.md#value) dan [runtimeValue](./erd-editor-element.md#runtimevalue).
- Penguncian pengaturan menggantikan `Save Scroll Information` dan `Save Zoom Information`. Dokumen baru, dan dokumen apa pun yang disimpan sebelum `4.0.0`, memiliki setiap penguncian dalam keadaan aktif, sehingga guliran, zoom, perpindahan tab, atau perubahan bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip membiarkan `value` seperti semula dan tidak memicu `change`. Halaman yang menyimpan area pandang melalui `change` memerlukan `Viewport` (dan `Canvas Type` untuk tab) dalam keadaan tidak terkunci di tab Pengaturan, atau dokumen yang `settings.lockSettings`-nya tidak menyetel bit-bit tersebut — lihat [Penguncian](../guide/guides/settings.md#lock).
- `settings` tidak lagi memiliki `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, atau `ignoreSaveSettings`, dan konstanta `SaveSettingType` telah dihapus. `settings.lockSettings`, dengan bit `LockSettingType`, menggantikan `ignoreSaveSettings`, yang tidak dibaca maupun ditulis oleh `4.0.0` atau yang lebih baru — lihat [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema) yang disebutkan setiap file di `$schema` kini hanya mendeskripsikan bentuk penyimpanan dan bersifat tertutup: skema ini menolak file yang disimpan oleh rilis sebelumnya hingga penyimpanan oleh `4.0.0` atau yang lebih baru menulis ulang file tersebut.
- Garbage collection dokumen dihapus bersama worker-nya, sehingga entitas yang dihapus tetap berada di `runtimeValue` hingga dokumen dibuka lagi dari filenya. Tersisa tiga shared worker — lihat [Web Worker](#web-workers).
- Pastikan setiap editor dan replika dalam sesi bersama menggunakan `4.0.0` atau yang lebih baru. Rilis sebelumnya mengabaikan tipe aksi baru: tipe aksi untuk grup tabel, Petakan Kolom, penguncian, dan skrip Skema SQL — lihat [Mencampur rilis](./advanced/collaborative-editing.md#mixing-releases).
- Callback impor menerima `mode: 'append'` untuk Impor dan Tambahkan, yang harus diteruskan oleh callback. Callback ekspor kini juga menerima file `.svg` dan file Generator Kode, dan `Export` ▸ `Schema SQL` membuka tab Skema SQL alih-alih menyimpan, sehingga `.sql` hanya datang dari `Save file` di tab tersebut — lihat [Dialog file](#file-dialogs).
- `Delete` dan `Backspace` diikat ke `removeSelection` yang baru. Selama editor memiliki fokus di luar kotak teks, perilaku default tombol tersebut dicegah di setiap tab, dan di tab ERD, item yang dipilih dihapus. `KeyBindingName` dan `KeyBindingMap` mendapatkan perintah ini, dan `setKeyBindingMap({ removeSelection: [] })` menyerahkan kedua tombol ke halaman — lihat [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` juga menerima `'system'`, yaitu `System` di pembuat tema, yang disetel saat `systemDarkMode` diaktifkan. `changePresetTheme` melaporkan `'system'` selama opsi itu dipilih, sehingga nilainya perlu disimpan apa adanya dan diserahkan kembali ke `setPresetTheme`. Dengan `systemDarkMode` aktif, `setPresetTheme()` dengan `'light'` atau `'dark'` kini tetap bertahan alih-alih ditimpa oleh perubahan sistem operasi berikutnya — lihat [systemDarkMode](./erd-editor-element.md#systemdarkmode) dan [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` atau yang lebih baru, ekstensi VS Code `4.0.0` atau yang lebih baru, serta plugin Obsidian dan JetBrains `1.0.0` atau yang lebih baru menggunakan protokol hub 2. Server `1.0.0` atau yang lebih baru dan rilis editor sebelumnya yang melayani agen, atau server sebelumnya dan salah satu editor ini, saling menolak dengan `protocolMismatch`, sambil menyebutkan sisi yang perlu diperbarui — lihat [Memperbarui](../mcp/installation.md#updating).
- URL CDN tanpa versi menyajikan rilis terbaru, 5.x sejak `5.0.0`. Sematkan `@3.10.0` untuk tetap di 3.x — lihat [CDN](#cdn).
