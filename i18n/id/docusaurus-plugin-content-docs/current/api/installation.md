---
sidebar_position: 1
description: Menginstal @dineug/erd-editor dari npm atau CDN, memasang elemen kustom, menghubungkan dialog file, dan meningkatkan versi dari 3.x.
---

# Instalasi

```sh
npm install @dineug/erd-editor
```

Paket ini khusus ESM (`"type": "module"`) dan hanya menyertakan folder `dist`.
Tidak ada build CommonJS, sehingga `require('@dineug/erd-editor')` tidak berfungsi.

Dependensi runtime-nya dibiarkan eksternal, sebagai bare import yang di-resolve, dideduplikasi, dan di-tree-shake oleh bundler Anda.
Shared worker-nya dihasilkan sebagai file titik masuk terpisah di bawah `dist/workers/` dan dibuat dengan `new URL('./…', import.meta.url)`, bentuk penulisan yang dibundel oleh Vite, webpack 5, dan Rspack sebagai titik masuk worker. Lihat [Web Worker](#web-workers).
Untuk halaman tanpa bundler di belakangnya, tersedia build kedua yang mandiri — lihat [Tag script](#script-tag).

## Penggunaan {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` tidak memiliki ukuran intrinsik. Beri elemen ini (atau kontainernya) lebar dan tinggi yang eksplisit.
Sejak `4.1.0`, [Penjelajah](../guide/guides/explorer.md) yang terbuka menempel di dalam elemen, di sebelah kiri kanvas ERD, dan mempersempit kanvas alih-alih menutupinya. Editor baru dimulai dengan Penjelajah tertutup.
Panel ini tidak digambar lebih sempit dari `200px` dan menyisakan setidaknya `320px` untuk kanvas, sehingga pada elemen yang lebih sempit dari `520px`, Penjelajah yang terbuka tidak digambar hingga elemen melebar — lihat [Di samping kanvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` memulai dokumen baru yang kosong. Menetapkan `value` justru memuat dokumen sebagai perubahan, sehingga dokumen itu masuk ke riwayat pembatalan.
Sejak `4.0.0`, `editor.value` adalah dokumen dalam bentuk yang tersimpan di file, dan bentuk itulah yang perlu disimpan. `editor.runtimeValue` adalah dokumen sebagaimana dipegang editor, termasuk entitas yang dihapus: nilai ini mengisi data awal kolaborator dan tidak pernah masuk ke file — lihat [runtimeValue](./erd-editor-element.md#runtimevalue).
Sejak `4.0.0`, dokumen baru juga memiliki setiap [penguncian pengaturan](../guide/guides/settings.md#lock) dalam keadaan aktif: area pandang, tab, bahasa Generator Kode, kedua konvensi penamaan, dan tipe tanda kutip. Menggulir, melakukan zoom, berpindah tab, atau mengubah salah satu pengaturan tersebut membiarkan `editor.value` seperti semula dan tidak memicu `change`. Dokumen yang dimuat dari teks mempertahankan penguncian yang disebutkannya. Dokumen yang tidak menyebutkan penguncian apa pun, misalnya file apa pun yang disimpan sebelum `4.0.0`, dibuka dengan setiap penguncian aktif, pada zoom 100% dan di tab ERD, apa pun area pandang dan tab yang disimpannya. Area pandangnya dikunci pada titik asal `0, 0`, dan justru dibuka pada diagram jika tidak ada bagian diagram yang digambar di sana — lihat [setInitialValue](./erd-editor-element.md#setinitialvalue).
Lihat [ErdEditorElement](./erd-editor-element.md) untuk bagian API lainnya.

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` me-resolve dependensi eksternal paket untuk Anda, sehingga cara ini berfungsi tanpa bundler.
URL tanpa versi selalu menyajikan rilis terbaru. Sematkan versi — `https://esm.run/@dineug/erd-editor@4.1.0` — jika Anda tidak ingin peningkatan versi mayor sampai ke halaman Anda tanpa pemberitahuan.
`4.0.0` sendiri merupakan peningkatan versi mayor: halaman yang harus tetap di 3.x menyematkan `@3.10.0` — lihat [Migrasi dari 3.x](#upgrading-from-3x).

### Tag script {#script-tag}

Sejak `3.6.0`, paket ini juga menyertakan build UMD dengan setiap dependensi dan setiap shared worker di dalam satu file.
Build inilah yang dirujuk oleh field `unpkg` dan `jsdelivr`, sehingga URL paket polos di kedua CDN tersebut menyajikannya, dan build ini mendefinisikan `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Mengimpornya mendaftarkan `<erd-editor>` dengan cara yang sama; `window.ErdEditor` membawa dua callback file, `ErdEditor.setExportFileCallback` dan `ErdEditor.setImportFileCallback`, serta, sejak `3.9.2`, `ErdEditor.createKeyBindingMap`.
Peta exports tetap mengarahkan bundler ke modul ES, sehingga instalasi dari npm tidak pernah mengambil file ini.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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
Ke-25 bahasa tampilan disertakan di dalam paket, baik di build ES maupun di build tag script, sehingga tidak ada file bahasa yang perlu disajikan dan tidak ada yang perlu didaftarkan. Tanpa pemilih maupun panggilan `setLocale()`, editor menampilkan bahasa Inggris.

Menambahkan `readonly` di sini memblokir pengeditan: menetapkan `value`, memanggil `clear()`, dan setiap panggilan `setSchema*()` — termasuk `setSchemaJSON()` dan panggilan penambahan — diabaikan, dan event `change` tidak pernah terpicu. Membaca `editor.value` dan `editor.runtimeValue` tetap berfungsi. Sebagai gantinya, muat dengan `setInitialValue()`.

### Rendering sisi server {#server-side-rendering}

Mengimpor paket ini mendaftarkan elemen kustom di cakupan modul, sehingga paket ini memerlukan DOM dan melempar kesalahan di Node.
Di Next.js, Nuxt, SvelteKit, atau Astro, akses paket ini dari jalur khusus klien.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Mengimpor paket ini menggabungkan `erd-editor` ke dalam `HTMLElementTagNameMap`, sehingga elemen ini memiliki tipe tanpa cast.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` diekspor untuk menganotasi variabel dan props Anda sendiri.
Sejak `4.0.0`, paket ini juga mengekspor tipe `LocaleCode`, `LocaleOption`, dan `SchemaSQLOptions` — lihat [Titik masuk](#entry-points). Opsi yang diterima metode `setSchema*()` tidak memiliki nama yang diekspor; ambil dari elemen dalam bentuk `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Penyorotan sintaksis {#syntax-highlighting}

Panel Skema SQL dan Generator Kode disorot oleh [Shiki](https://shiki.style), di shared worker tersendiri, dan sejak `4.0.0` begitu pula skrip `Before tables` dan `After tables` di tab Skema SQL.
Sejak `3.7.0`, tidak ada yang perlu diinstal dan tidak ada yang perlu didaftarkan: worker dibuat saat panel kode pertama kali di-render, sehingga halaman yang tidak membuka panel kode apa pun tidak pernah mengambil grammar.

| | |
| --- | --- |
| Bahasa | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Tema | `github-dark` dan `github-light`, mengikuti tampilan terang atau gelap editor |

Itulah tepatnya bahasa yang dihasilkan panel: `JPA` disorot sebagai Java, `SQLAlchemy` sebagai Python, `TypeORM`, `Sequelize`, `Drizzle`, dan `Zod` sebagai TypeScript, `Doctrine` sebagai PHP, `SeaORM` sebagai Rust, `JSON Schema` sebagai JSON, serta `DBML` dan `AML` sebagai SQL, grammar terdekat di dalam bundel — lihat [Generator Kode](../guide/guides/code-generator.md).

Mesin regex-nya berupa JavaScript murni, sehingga tidak ada kebijakan host yang memerlukan `wasm-unsafe-eval`.
Di browser yang tidak menyediakan `SharedWorker` — Chrome di Android, Safari sebelum 16.4 — kegagalan dicatat di log dan kode ditampilkan sebagai teks biasa; skrip tetap dapat diedit.

Jika meningkatkan versi dari `3.6.0` atau yang lebih lama: `@dineug/erd-editor-shiki-worker` tidak lagi dipublikasikan, dan `setGetShikiServiceCallback` ikut dihapus bersamanya.
Hapus instalasi dan pendaftarannya; halaman yang memuat worker dari CDN juga menghapus tag `<script>` kedua tersebut.

## Web Worker {#web-workers}

Editor menjalankan tiga pekerjaan di `SharedWorker`: penyorotan sintaksis, ekspor gambar, dan tata letak tabel di balik [Tata Letak Otomatis](../guide/guides/table-related-functions.md#auto-layout), [mode Alur](../guide/guides/visualization.md#how-flow-is-placed) di tab Visualisasi, dan, sejak `4.0.0`, penempatan skema yang diimpor.
Ketiganya disertakan di dalam `@dineug/erd-editor`. Tidak satu pun perlu Anda siapkan, tetapi masing-masing dapat diblokir oleh host.
Worker yang menjalankan garbage collection dokumen dihapus di `4.0.0`, bersama dengan garbage collection itu sendiri.

| Worker | Tanpa worker ini |
| --- | --- |
| Penyorotan sintaksis | Panel Skema SQL dan Generator Kode serta skrip Skema SQL tetap berupa teks biasa |
| Ekspor gambar | PNG, SVG, `Copy to clipboard`, dan pratinjau dialog `Export image` digambar di thread utama, yang memblokir halaman selama proses menggambar |
| Tata letak tabel | Tata letak `Flow`, `Tree - vertical`, dan `Tree - horizontal` di Tata Letak Otomatis, serta mode Alur di tab Visualisasi, berakhir dengan `Could not place tables`; impor yang ditempatkan oleh Alur — file SQL, GraphQL, DBML, atau AML dari `Import` atau `Import and Add`, atau panggilan `setSchema*()` dengan `placement: 'auto'` — menempatkan tabelnya dalam baris, tanpa pesan; `Force` dan mode Graf tidak terpengaruh, karena keduanya berjalan di dalam editor |

Ekspor gambar menunggu jawaban worker-nya selama sepuluh detik, lalu menggambar di thread utama, dan penyorotan sintaksis membiarkan kode sebagai teks biasa begitu worker-nya gagal, sehingga host yang memblokir worker mengorbankan performa, bukan fungsi.
Tata letak tabel adalah pengecualiannya: mesin yang menghitung tata letak lebih besar daripada editor itu sendiri dan tidak pernah dimuat di dalam proses, sehingga tata letak tabel menunggu worker-nya selama tiga puluh detik pada penempatan pertama, dan setelah worker menjawab, tata letak diberi waktu enam puluh detik untuk kembali.
Jika salah satu waktu tunggu habis, penempatan berakhir seperti saat tanpa worker. Tata Letak Otomatis menampilkan `Placing tables` begitu dimulai, sedangkan mode Alur dan impor yang ditempatkan oleh Alur baru menampilkannya setelah penempatan, termasuk waktu memulai worker-nya, berjalan selama enam detik.

Di build yang dibundel, ketiganya dihasilkan sebagai file di samping paket, sehingga CSP yang ketat memerlukan `worker-src 'self'` — ditambah `blob:` jika bundler Anda menyisipkan worker secara inline.
Di build [tag script](#script-tag), ketiganya dibawa di dalam file sebagai URL `data:`, sehingga halaman tersebut memerlukan `worker-src data:` sebagai gantinya.

## Titik masuk {#entry-points}

Mengimpor `@dineug/erd-editor` mendaftarkan `<erd-editor>` sebagai efek samping. Selain itu, paket ini mengekspor tipe elemen, dua setter callback, sejak `3.9.2` kombinasi tombol default beserta tipenya, dan sejak `4.0.0` tipe bahasa tampilan serta tipe opsi `getSchemaSQL()`.

| Ekspor | Deskripsi |
| --- | --- |
| `ErdEditorElement` (tipe) | Antarmuka elemen — lihat [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Menggantikan unduhan browser, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Menggantikan pemilih file browser, `({ type, op, accept, mode }) => void`; `mode` sejak `4.0.0`. |
| `createKeyBindingMap()` | Mengembalikan kombinasi tombol default sebagai `KeyBindingMap` baru pada setiap panggilan — lihat [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipe) | Peta kombinasi tombol, union dari nama perintahnya, dan satu kombinasi tombol. |
| `LocaleCode`, `LocaleOption` (tipe) | Sejak `4.0.0`. 25 kode bahasa tampilan, dan kode-kode tersebut ditambah `'system'`, yang diterima `setLocale()` — lihat [Bahasa tampilan](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipe) | Sejak `4.0.0`. Opsi `statements` dan `header` yang diterima `getSchemaSQL()` — lihat [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` adalah titik masuk kedua. Titik masuk ini menjalankan store dokumen tanpa DOM, sehingga berfungsi di Web Worker — lihat [Penyimpanan jarak jauh](./advanced/remote-storage.md).
Titik masuk ini mengekspor `createReplicationStore` dan tipe `ReplicationStore`. Sejak `3.10.0`, titik masuk ini juga mengekspor tipe `ReplicationChange`, `{ value: string; changed: boolean }`, yang diterima listener `change` milik replika — lihat [on@change](./advanced/remote-storage.md#onchange).
Sejak `4.0.0`, `ReplicationStore` juga memiliki `runtimeValue`. `value`-nya dan `value` yang diserahkan oleh `change` berupa bentuk penyimpanan sebagaimana tersimpan di file, sama seperti milik elemen — lihat [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Sejak `3.9.1`, ada titik masuk ketiga, `@dineug/erd-editor/peer.js`: peer headless yang digunakan [server MCP](../mcp/introduction.md) untuk mengedit dokumen. Titik masuk ini ada untuk server tersebut, dan halaman-halaman ini tidak mendokumentasikannya.

### Dialog file {#file-dialogs}

Impor dan ekspor melewati callback yang dapat diinjeksi, sehingga host tanpa dialog file browser — misalnya webview IDE — dapat menyediakan dialognya sendiri.
Keduanya tidak simetris: ekspor menyerahkan file yang sudah jadi kepada Anda, sedangkan impor hanya meminta file, dan Anda sendiri yang memasukkan kembali isinya.

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

`fileName` yang dihasilkan editor adalah `<database name>-<timestamp>` ditambah ekstensi file, dengan stempel waktu berupa waktu lokal berformat `yyyy-MM-dd'T'HH_mm_ss`. Nama database yang kosong diganti dengan `unnamed`.
Callback ekspor menerima file berikut. Sejak `4.0.0`, SVG dan file Generator Kode termasuk di antaranya, dan `.sql` berasal dari `Save file` di tab Skema SQL, bukan langsung dari `Export`.

| File | Ekstensi | `type` Blob |
| --- | --- | --- |
| Ekspor JSON | `.erd.json` | `application/json` |
| `Save file` di tab Skema SQL, yang berisi teks yang ditampilkan tab tersebut — lihat [Skema SQL](../guide/guides/schema-sql.md) | `.sql` | tidak ada |
| Dialog [Ekspor gambar](../guide/guides/file-import-export.md#image) | `.png` atau `.svg` | `image/png` atau `image/svg+xml` |
| `Save file` di tab Generator Kode — lihat [Generator Kode](../guide/guides/code-generator.md) | Ekstensi bahasanya: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` atau `.mmd` | tidak ada |

Host yang memilih handler berdasarkan ekstensi memerlukan satu handler untuk masing-masing file tersebut.

Jika tidak diatur, editor menggunakan perilaku unduhan dan pemilih file bawaan browser. Berikan `null` untuk kembali ke perilaku tersebut.

## Dukungan browser {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — baseline ES2022 yang menjadi target build bundel yang dipublikasikan.
Tidak ada polyfill yang dibundel. Tambahkan polyfill sendiri jika Anda perlu menjangkau browser yang lebih lama.

## Migrasi dari 3.x {#upgrading-from-3x}

`4.0.0` adalah rilis mayor. Periksa setiap poin berikut saat memindahkan halaman dari 3.x:

- `editor.value`, `value` milik replika, dan `value` yang diserahkan oleh `change`-nya berupa bentuk penyimpanan sebagaimana tersimpan di file: tanpa entitas yang dihapus, lebar terukur, urutan tumpukan, atau jangkar hubungan. Tetap simpan `value`, dan baca informasi tersebut dari `runtimeValue`; stempel waktu entitas (`meta`) dihapus sepenuhnya. Isi data awal kolaborator atau replika yang bergabung ke sesi yang sedang berjalan dari `runtimeValue` milik peer yang sedang berjalan, bukan dari `value` atau file, dan jangan pernah menyimpan `runtimeValue` — lihat [value](./erd-editor-element.md#value) dan [runtimeValue](./erd-editor-element.md#runtimevalue).
- Penguncian pengaturan menggantikan `Save Scroll Information` dan `Save Zoom Information`. Dokumen baru, dan dokumen apa pun yang disimpan sebelum `4.0.0`, memiliki setiap penguncian dalam keadaan aktif, sehingga guliran, zoom, perpindahan tab, atau perubahan bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip membiarkan `value` seperti semula dan tidak memicu `change`. Halaman yang menyimpan area pandang melalui `change` memerlukan `Viewport` (dan `Canvas Type` untuk tab) dalam keadaan tidak terkunci di tab Pengaturan, atau dokumen yang `settings.lockSettings`-nya tidak menyetel bit-bit tersebut — lihat [Penguncian](../guide/guides/settings.md#lock).
- `settings` tidak lagi memiliki `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, atau `ignoreSaveSettings`, dan konstanta `SaveSettingType` telah dihapus. `settings.lockSettings`, dengan bit `LockSettingType`, menggantikan `ignoreSaveSettings`, yang tidak dibaca maupun ditulis oleh `4.0.0` atau yang lebih baru — lihat [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema) yang disebutkan setiap file di `$schema` kini hanya mendeskripsikan bentuk penyimpanan dan bersifat tertutup: skema ini menolak file yang disimpan oleh rilis sebelumnya hingga penyimpanan oleh `4.0.0` atau yang lebih baru menulis ulang file tersebut.
- Garbage collection dokumen dihapus bersama worker-nya, sehingga entitas yang dihapus tetap berada di `runtimeValue` hingga dokumen dibuka lagi dari filenya. Tersisa tiga shared worker — lihat [Web Worker](#web-workers).
- Pastikan setiap editor dan replika dalam sesi bersama menggunakan `4.0.0` atau yang lebih baru. Rilis sebelumnya mengabaikan tipe aksi baru: tipe aksi untuk grup tabel, Petakan Kolom, penguncian, dan skrip Skema SQL — lihat [Mencampur rilis](./advanced/collaborative-editing.md#mixing-releases).
- Callback impor menerima `mode: 'append'` untuk Impor dan Tambahkan, yang harus diteruskan oleh callback. Callback ekspor kini juga menerima file `.svg` dan file Generator Kode, dan `Export` ▸ `Schema SQL` membuka tab Skema SQL alih-alih menyimpan, sehingga `.sql` hanya datang dari `Save file` di tab tersebut — lihat [Dialog file](#file-dialogs).
- `Delete` dan `Backspace` diikat ke `removeSelection` yang baru. Selama editor memiliki fokus di luar kotak teks, perilaku default tombol tersebut dicegah di setiap tab, dan di tab ERD, item yang dipilih dihapus. `KeyBindingName` dan `KeyBindingMap` mendapatkan perintah ini, dan `setKeyBindingMap({ removeSelection: [] })` menyerahkan kedua tombol ke halaman — lihat [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` juga menerima `'system'`, yaitu `System` di pembuat tema, yang disetel saat `systemDarkMode` diaktifkan. `changePresetTheme` melaporkan `'system'` selama opsi itu dipilih, sehingga nilainya perlu disimpan apa adanya dan diserahkan kembali ke `setPresetTheme`. Dengan `systemDarkMode` aktif, `setPresetTheme()` dengan `'light'` atau `'dark'` kini tetap bertahan alih-alih ditimpa oleh perubahan sistem operasi berikutnya — lihat [systemDarkMode](./erd-editor-element.md#systemdarkmode) dan [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0`, ekstensi VS Code `4.0.0` atau yang lebih baru, serta plugin Obsidian dan JetBrains `1.0.0` atau yang lebih baru menggunakan protokol hub 2. Server `1.0.0` dan rilis editor sebelumnya yang melayani agen, atau server sebelumnya dan salah satu editor ini, saling menolak dengan `protocolMismatch`, sambil menyebutkan sisi yang perlu diperbarui — lihat [Memperbarui](../mcp/installation.md#updating).
- URL CDN tanpa versi kini menyajikan rilis 4.x terbaru. Sematkan `@3.10.0` untuk tetap di 3.x — lihat [CDN](#cdn).
