---
sidebar_position: 2
description: API elemen erd-editor — atribut, value dan runtimeValue, event, tema, bahasa tampilan, layar sambutan, kombinasi tombol, serta impor dan ekspor skema.
---

# ErdEditorElement

Editor adalah `HTMLElement` biasa.  
Definisi tipenya adalah sebagai berikut.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Editor dirender ke dalam shadow root tertutup, sehingga `editor.shadowRoot` bernilai `null` dan gaya halaman tidak bocor masuk maupun keluar.  
Tidak ada apa pun di dalamnya yang dapat dijangkau dengan selektor — sebagai gantinya, beri gaya melalui [setTheme](#settheme) dan properti kustom `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker`, dan `enable-welcome-screen` adalah satu-satunya atribut, dan kelimanya bernilai default `false`. Dua yang terakhir baru di `4.0.0`. Masing-masing membaca nilainya seperti yang dijelaskan di [readonly](#readonly).

Sejak `4.1.0`, tab ERD memiliki [Penjelajah](../guide/guides/explorer.md), pohon diagram yang tertambat di kiri kanvas dengan Temukan dan Ganti di bagian atasnya. Tidak ada atribut, properti, metode, atau event yang membuka, menutup, atau melaporkannya: Penjelajah dibuka dari tombol `Explorer` di bilah alat, dari `Toggle Explorer` di Pencarian Cepat atau menu konteks kanvas, atau dengan kombinasi tombol [`findReplace`](#setkeybindingmap).  
Setiap elemen dimulai dengan Penjelajah tertutup. Status terbukanya, lebarnya, penciutannya, dan pencariannya bertahan selama elemen itu ada, melewati perpindahan tab dan setiap pemuatan, termasuk `setInitialValue`, dan tidak pernah masuk ke `value`, `runtimeValue`, riwayat pembatalan, atau shared store.

## readonly {#readonly}

Mengatur kemampuan pengeditan editor.  
Selama atribut ini aktif, penetapan `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, pembatalan, dan pengulangan semuanya diabaikan, dan event `change` tidak pernah dipancarkan. Sebagai gantinya, muat dokumen dengan [setInitialValue](#setinitialvalue).  
Fungsi melihat tetap berjalan: zoom, penggeseran, alat tangan, mode Zen, tab kanvas, tab [Visualisasi](../guide/guides/visualization.md) dalam kedua modenya termasuk memfokuskan tabel, vendor database, serta pengaturan keluaran SQL dan Generator Kode semuanya tetap berlaku, sehingga penampil hanya baca tetap dapat mengekspor SQL untuk vendor lain atau membaca kode yang dihasilkan.  
Sejak `4.1.0`, [Penjelajah](../guide/guides/explorer.md#read-only-editors) juga terbuka, dan memilih salah satu barisnya membawa ke apa yang diwakili baris itu, seperti pada editor yang dapat diedit. [Temukan dan Ganti](../guide/guides/find-and-replace.md#read-only-editors) di bagian atasnya hanya mencari, tanpa panah `Toggle Replace` dan tanpa baris Ganti, dan menuju kecocokan tetap menampilkannya di layar dan memilihnya. Panel ini berjudul `Explorer`, dan tooltip tombol bilah alatnya bertuliskan `Explorer (Ctrl + F)` (Windows/Linux) atau `Explorer (⌘ + F)` (Mac) di setiap editor. Dari `3.10.0` hingga `4.0.0`, Temukan dan Ganti terbuka sebagai panel mengambang khusus pencarian yang berjudul `Find`.  
Properti Tabel tetap terbuka, dan sejak `3.10.0` menampilkan lencana `Read only` di samping judulnya, sementara tab `Indexes` di dalamnya tidak menawarkan pengeditan — lihat [Properti Tabel](../guide/guides/table-related-functions.md#table-properties).  
Sejak `4.0.0`, editor hanya baca tidak menawarkan [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (lihat [Grup tabel](../guide/guides/table-groups.md#read-only-editors)), atau [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), dan tidak menampilkan [layar sambutan](#enablewelcomescreen). Tombol penguncian di tab Pengaturan tidak mengubah apa pun, dan skrip `Before tables` dan `After tables` di tab Skema SQL tidak dapat diedit.  
Sejak `4.1.0`, editor ini juga tidak menampilkan tombol `New Table`, `New Memo`, atau `New Table Group` di [bilah alat kanvas](../guide/guides/table-related-functions.md#canvas-toolbar), dan kombinasi tombol `addTableGroup` serta `groupSelectedTables` tidak melakukan apa pun.  
Pilihan `This window only` di tab Skema SQL, yaitu `Statements`, `Header`, dan `Tables`, tidak pernah disimpan dan tetap berlaku, begitu pula dialog [`Export image`](../guide/guides/file-import-export.md#image), pembuat tema, dan pemilih bahasa. Pilihan di pembuat tema atau pemilih bahasa tetap memancarkan [changePresetTheme](#changepresettheme) atau [changeLocale](#changelocale).  
Atribut tanpa nilai, `=""`, dan `="true"` semuanya dibaca sebagai `true`. `="false"` dibaca sebagai `false`, begitu pula string lain apa pun — termasuk idiom HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Menentukan apakah editor otomatis menyinkronkan diri dengan mode gelap/terang sistem.  
Sejak `4.0.0`, mengaktifkannya menyetel `appearance` tema ke `'system'`, seperti yang dilakukan `setPresetTheme({ appearance: 'system' })`. Editor lalu menampilkan mode terang atau gelap yang dilaporkan sistem operasi, atau yang disebutkan [setSystemAppearance](#setsystemappearance), dan beralih saat nilai itu berubah.  
[setPresetTheme](#setpresettheme) berikutnya dengan `'light'` atau `'dark'`, atau pilihan `Light` atau `Dark` di pembuat tema atau Pencarian Cepat, menggantikan `'system'` dan bertahan: perubahan OS berikutnya tidak lagi menimpanya, meskipun `systemDarkMode` masih `true`. Sebelum `4.0.0`, perubahan OS berikutnya menimpanya.  
Menonaktifkannya saat tampilan bernilai `'system'` mempertahankan mode terang atau gelap yang ditampilkan saat itu. Menonaktifkannya setelah tampilan diubah dari `'system'` membiarkannya seperti apa adanya.  
Mengubahnya tidak memancarkan event apa pun.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Menentukan apakah UI untuk menyetel tema prasetel dengan mudah disediakan.  
Atribut ini menampilkan tombol `Theme` di bilah alat, yang membuka pembuat tema dengan `Accent color`, `Gray color`, dan `Appearance`. Sejak `4.0.0`, `Appearance` menawarkan `System` di samping `Light` dan `Dark`, dan selama atribut ini aktif, Pencarian Cepat mencantumkan `Theme` dengan `System`, `Light`, dan `Dark`. Lihat [Bahasa dan tema](../guide/guides/language-and-theme.md).

![Membuka pembuat tema dari bilah alat, memilih warna aksen dan warna abu-abu, lalu mengganti tampilan ke Light dan kemudian ke System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Mengubah tema prasetel dari panel ini, atau dari Pencarian Cepat, memancarkan event [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Sejak `4.0.0`, menentukan apakah UI untuk memilih bahasa tampilan editor disediakan.  
Atribut ini menampilkan tombol `Display Language` di bilah alat, setelah `Theme` saat keduanya ditampilkan. Tombol ini membuka pemilih bahasa, dan Pencarian Cepat mencantumkan `Display Language`. Keduanya menawarkan `System` dan 25 bahasa — lihat [Bahasa dan tema](../guide/guides/language-and-theme.md).  
Atribut ini juga menentukan apa yang ditampilkan editor sebelum [setLocale](#setlocale) dipanggil atau sebuah bahasa dipilih: `'system'` selama aktif, bahasa Inggris selama nonaktif, sehingga elemen yang tidak mengonfigurasi apa pun tetap menampilkan bahasa Inggris seperti selama ini. Mengaktifkan atau menonaktifkannya langsung beralih di antara keduanya. Setelah sebuah bahasa disetel atau dipilih, pilihan itu bertahan, baik atribut ini diaktifkan maupun dinonaktifkan.  
Setel atribut ini sebelum elemen ditambahkan ke DOM agar frame pertama mengikuti `'system'`.  
Pemilihan bahasa memancarkan [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Sejak `4.0.0`, menentukan apakah diagram kosong menyambut pembaca dengan [layar sambutan](../guide/guides/editing-start.md#welcome-screen).  
Layar ini tampil di atas tab ERD selama dokumen tidak memiliki tabel, memo yang ditampilkan, maupun grup tabel yang ditampilkan. Layar ini tidak ditampilkan selama `readonly` aktif, dalam mode Zen, atau selama Properti Tabel, Penampil Perbedaan, Perjalanan Waktu, atau pratinjau Tata Letak Otomatis terbuka. Tabel pertama, memo yang ditampilkan, atau grup tabel yang ditampilkan menghilangkannya, dan pembatalan yang kembali ke diagram kosong memunculkannya lagi.  
Baris `New Table`, `New Memo`, dan `Command Palette` di layar ini menampilkan kombinasi tombol pertama dari `addTable`, `addMemo`, dan `search` sebagaimana ditetapkan [setKeyBindingMap](#setkeybindingmap), dan tidak menampilkan apa pun untuk nama yang dibiarkan kosong. Panahnya menunjuk ke tombol `Theme` dan `Display Language` hanya jika `enableThemeBuilder` dan `enableLocalePicker` menampilkannya.  
Di menunya, `↑`, `↓`, `Home`, dan `End` berpindah antarbaris serta dicegah dan dihentikan. `Enter` dan `Space` dihentikan, tidak dicegah, sehingga baris yang difokuskan menerimanya, dan `Escape` di antara format `Import` kembali ke menu sebelumnya, dicegah dan dihentikan. Setiap tombol lain sampai ke editor dan halaman seperti biasa.  
Layar ini tidak mengubah apa pun di dokumen, sehingga `value` tetap seperti semula dan tidak ada `change` yang dipancarkan.  
Aktifkan atribut ini setelah [setInitialValue](#setinitialvalue) memuat dokumen, seperti yang dilakukan host resmi, agar layar ini tidak pernah berkedip di atas file yang masih dimuat.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Mengambil dokumen saat ini sebagai string JSON, dalam [skema](./advanced/schema.md) yang didefinisikan editor.  
Sejak `4.0.0`, nilai ini berupa bentuk penyimpanan, yaitu dokumen sebagaimana tersimpan di file, yang juga ditulis oleh ekspor `json` dan disimpan oleh host resmi. Isinya hanya entitas yang aktif, tanpa entitas yang telah dihapus, urutan tumpukan, atau apa yang dihitung editor sendiri, seperti lebar yang diukur, tanda kunci, dan jangkar hubungan. Entitasnya disusun dalam urutan tetap, diindentasi dua spasi, dan diakhiri baris baru, sehingga dokumen yang sama selalu menghasilkan byte yang sama.  
Setiap pengaturan dengan [penguncian](../guide/guides/settings.md#lock) aktif ditulis dengan nilai terkuncinya, bukan seperti yang ditampilkan layar. Penguncian `Viewport` mencakup `originX`, `originY`, dan `zoomLevel`, sedangkan `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, dan `Bracket Type` masing-masing mencakup pengaturannya sendiri. Setiap pengaturan lain ditulis apa adanya, dan `lockSettings` selalu ditulis. Lihat [Settings](./advanced/schema.md#settings) untuk rincian bitnya.  
Dokumen baru memiliki semua penguncian aktif, baik dokumen yang ditampilkan elemen sebelum diberi nilai maupun dokumen yang dimuat dari nilai kosong. `value` dokumen itu mempertahankan titik asal di `0, 0`, tingkat zoom di `1`, tab ERD, serta bahasa Generator Kode, konvensi penamaan, dan tipe tanda kutip default hingga penguncian yang sesuai dinonaktifkan.  
Sebelum `4.0.0`, getter ini mengembalikan seluruh dokumen sebagaimana dipegang editor, dengan `ignoreSaveSettings` diterapkan. Dokumen sebagaimana dipegang editor kini adalah [runtimeValue](#runtimevalue), dan `ignoreSaveSettings` tidak lagi dibaca atau ditulis.

```js
const data = editor.value;
```

### setter {#setter}

Memuat keadaan editor yang disimpan sebelumnya. Setter ini menggantikan seluruh dokumen — dokumen saat ini dikosongkan terlebih dahulu.  
Seperti `clear()`, `setInitialValue()`, dan metode `setSchema*` dengan `mode: 'replace'` default, setter ini juga membuang tampilan Alur di tab Visualisasi: tata letaknya, tabel yang menjadi fokusnya, tampilan barisnya, zoom, dan geserannya. Penambahan (`mode: 'append'`) tidak membuangnya.  
Setter ini dicatat dalam daftar riwayat, sehingga `Undo, Redo` dapat dilakukan, dan memancarkan `change`.  
Setter ini menerima bentuk penyimpanan, [runtimeValue](#runtimevalue), atau file yang disimpan rilis sebelumnya.  
String kosong, atau apa pun yang bukan string, memuat dokumen baru alih-alih memunculkan kesalahan, jadi periksa nilainya sebelum menetapkannya.  
Dokumen baru itu sama dengan yang dimulai `setInitialValue('')`: kosong, dengan pengaturan default, dan sejak `4.0.0` dengan semua penguncian aktif. Di `3.10.x`, dokumen ini tidak menyimpan posisi guliran maupun tingkat zoom, dan sebelumnya menyimpan keduanya.  
Shared store meneruskan pemuatan itu ke kolaborator dengan JSON lengkap dokumen baru, sehingga setiap peer, termasuk yang memakai rilis lama, memuat dokumen yang sama.  
Sejak `4.0.0`, penguncian dokumen yang dimuat, dan nilai terkunci yang kemudian ditulis `value`, berasal dari teks, dan area pandang mendarat di posisi yang ditetapkan teks, atau di diagram jika tidak ada bagian diagram yang tergambar di sana. Untuk setiap pengaturan lain yang dikunci teks — tab, bahasa Generator Kode, konvensi penamaan, dan tipe tanda kutip — editor tetap menampilkan apa yang ditampilkannya sebelum pemuatan. Pengaturan yang dibiarkan tidak terkunci oleh teks mengambil nilai dari teks. Sebaliknya, [setInitialValue](#setinitialvalue) mengambil setiap nilai yang ada di teks; lihat juga bagian itu untuk teks yang tidak menyebutkan penguncian apa pun.  
Teks yang bukan JSON, seperti file yang masih berisi penanda konflik merge, juga tidak memunculkan kesalahan: dokumen dikosongkan, pengaturannya tetap seperti semula, dan kesalahan parsing dicatat ke konsol.  
Setter ini diabaikan selama `readonly` aktif; gunakan [setInitialValue](#setinitialvalue) untuk memuat ke editor hanya baca.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Sejak `4.0.0`, mengambil dokumen sebagaimana dipegang editor ini, sebagai string JSON. Properti ini tidak memiliki setter, sehingga menetapkannya melempar kesalahan dalam kode strict mode.  
Properti ini memuat apa yang dihilangkan [value](#value): entitas yang dihapus beserta urutannya, urutan tumpukan, lebar yang diukur, tanda kunci, jangkar hubungan, dan sequence. Pengaturan yang terkunci juga ditulis dengan nilai terkuncinya di sini.  
Gunakan properti ini untuk mengisi data awal editor lain yang bergabung ke sesi yang sudah berjalan, seperti kolaborator atau tampilan kedua dari dokumen yang sama, melalui [setInitialValue](#setinitialvalue) milik editor itu. Pembatalan penghapusan yang kemudian dikirim sesi itu lalu memulihkan entitas tersebut secara utuh di sana, sedangkan editor yang diisi dari `value` tidak memegang entitas yang dihapus dan malah memulihkan tabel kosong tanpa nama. Lihat [Pengeditan kolaboratif](./advanced/collaborative-editing.md).  
Tidak ada lagi yang membersihkan entitas yang dihapus, sehingga entitas itu tetap ada di dalamnya hingga dokumen dibuka lagi dari filenya.  
Jangan pernah menulisnya ke file: simpan `value`, yang diterima oleh [JSON Schema](./advanced/schema.md#json-schema), sedangkan nilai ini tidak.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Memuat keadaan editor yang disimpan sebelumnya. Pemuatan itu sendiri tidak dicatat dalam daftar riwayat, sehingga tidak dapat dibatalkan, dan tidak ada event `change` yang dipancarkan.  
Metode ini juga mengosongkan riwayat pembatalan, sehingga tidak ada yang dilakukan sebelum pemuatan yang dapat dibatalkan atau diulangi ke dokumen yang dimuat.  
Metode ini menerima bentuk penyimpanan, [runtimeValue](#runtimevalue), atau file yang disimpan rilis sebelumnya, dan tidak seperti penetapan `value`, metode ini mengambil setiap pengaturan yang ada di teks, termasuk tab dan pengaturan kode.  
String kosong, atau apa pun yang bukan string, memuat dokumen baru alih-alih memunculkan kesalahan, sehingga `setInitialValue('')` memulai diagram kosong.  
Sejak `4.0.0`, dokumen baru itu, yang juga ditampilkan elemen sebelum diberi nilai apa pun, memiliki semua penguncian aktif. Menggulir, melakukan zoom, berpindah tab, dan mengubah bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip membiarkan `value` seperti semula dan tidak memancarkan `change`. Di `3.10.x`, dokumen ini tidak menyimpan posisi guliran maupun tingkat zoom, dan sebelumnya menyimpan keduanya.  
Dokumen yang dimuat dari teks mempertahankan penguncian yang disebutkannya. Dokumen yang tidak menyebutkan penguncian apa pun — file apa pun yang disimpan sebelum `4.0.0`, apa pun nilai `ignoreSaveSettings` di dalamnya, dan file `.vuerd` v2 — terbuka dengan semua penguncian aktif, dengan `Viewport` terkunci di titik asal `0, 0` dan tingkat zoom `1`, di tab ERD, dengan bahasa, konvensi penamaan, dan tipe tanda kutip seperti yang disimpannya.  
Dalam kedua kasus, area pandang terbuka di area pandang dokumen — yang disimpan teks jika teks menyebutkan penguncian, titik asal `0, 0` pada tingkat zoom `1` jika tidak menyebutkannya — atau di diagram jika tidak ada bagian diagram yang tergambar di sana. `Viewport` yang terkunci tetap mempertahankan nilai terkuncinya di `value`.  
Sejak `4.0.0`, metode ini juga membuang keadaan kolaborasi dokumen yang dipegang sebelumnya, dan [shared store](#getsharedstore) editor ini yang sudah berlangganan meminta ulang keadaan milik editor lain, sehingga editor yang dimuat ulang dalam sesi yang sedang berjalan dapat menyusul. Isi data awal editor seperti itu dengan [runtimeValue](#runtimevalue) milik editor lain.  
Teks yang bukan JSON juga tidak memunculkan kesalahan: dokumen dikosongkan, pengaturannya tetap seperti semula, dan kesalahan parsing dicatat ke konsol.  
Tidak seperti penetapan `value`, metode ini tidak diblokir oleh `readonly`, sehingga inilah cara memuat dokumen ke penampil hanya baca.

```js
editor.setInitialValue('json...');
```

Muat saat mulai, simpan saat berubah.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event {#event}

Event publik hanya ada tiga, yaitu `change`, `changePresetTheme`, dan `changeLocale`; `changeLocale` baru di `4.0.0`.  
Elemen ini juga mengirim event internal `@dineug/erd-editor/internal-*` pada dirinya sendiri untuk penghubungan internalnya; event tersebut bukan bagian dari API.

### change {#change}

Saat ada perubahan di editor, elemen memancarkan event ini.  
Event ini di-debounce selama 200ms, dan tidak dipancarkan selama `readonly` bernilai `true`.  
Event ini terpicu untuk setiap perubahan dokumen — perubahan di UI, penetapan `value`, `clear()`, setiap metode `setSchema*`, dan sejak `4.0.0`, `setSchemaJSON()` serta `Import and Add`. `setInitialValue` tidak memancarkannya.  
Tidak ada tindakan di mode Alur pada tab Visualisasi yang memancarkannya — zoom, penggeseran, memindahkan kartu, `Tidy Up`, tampilan baris, atau mempersempit area pandang dari kartu — karena tidak satu pun merupakan perubahan dokumen.  
Sejak `4.0.0`, perubahan pada pengaturan dengan [penguncian](../guide/guides/settings.md#lock) aktif juga tidak memancarkannya, karena perubahan itu hanya menggerakkan layar dan tidak pernah `value`: guliran atau zoom kanvas ERD selama `Viewport` terkunci, perpindahan tab selama `Canvas Type` terkunci, dan perubahan bahasa Generator Kode, konvensi penamaan tabel, konvensi penamaan kolom, atau tipe tanda kutip selama penguncian miliknya aktif. Hanya perubahan tersebut yang dikecualikan, sehingga batch yang juga mengedit dokumen tetap memancarkannya. Mengunci atau membuka kunci pengaturan memancarkannya.  
Semua penguncian aktif di dokumen baru dan di file apa pun yang disimpan sebelum `4.0.0`, sehingga secara default menggulir, melakukan zoom, dan berpindah tab tidak memancarkan apa pun. Hal ini mencakup memfokuskan tabel dari tab ERD, tombol kartu tautan eksternal yang membawa Anda dari Alur kembali ke tab ERD, menuju baris Penjelajah atau kecocokan pencarian, serta membuka Penjelajah atau menuju hasil Pencarian Cepat dari tab lain. Masing-masing memancarkan satu `change` hanya selama penguncian yang mencakupnya nonaktif: `Canvas Type` untuk perpindahan tab, dan `Viewport` untuk guliran yang juga dilakukan oleh tombol kartu, hasil Pencarian Cepat, baris Penjelajah, atau kecocokan pencarian. Sejak `4.1.0`, setiap guliran tersebut mengikuti satu aturan, [Tempat lompatan berakhir](../guide/guides/table-related-functions.md#where-a-jump-lands), sehingga hasil tabel Pencarian Cepat tidak lagi selalu menggulir, dan lompatan yang dibiarkan di tempat oleh aturan itu tidak menghasilkan guliran untuk dipancarkan. Membuka, menutup, atau mengubah ukuran Penjelajah mempersempit atau memperlebar kanvas tanpa memindahkan titik asalnya, dan juga tidak memancarkan apa pun. Sebelum `4.0.0`, menggulir, melakukan zoom, dan berpindah tab selalu memancarkannya, bahkan saat `editor.value` tetap sama.  
Untuk melewati penulisan yang tidak mengubah apa pun, bandingkan `editor.value` dengan nilai yang terakhir Anda simpan, bukan dengan file yang Anda muat: file yang ditulis rilis sebelumnya, file v2, atau file yang diedit manual dapat menghasilkan `value` yang berbeda begitu dimuat, karena `value` menuliskannya dalam bentuk penyimpanan. Begitu pula file yang penguncian `Viewport` miliknya nonaktif dan titik asalnya tidak menggambar bagian diagram mana pun di layar ini: pemuatan memindahkan area pandang ke diagram, dan `value` menulis posisi tempat area pandang itu mendarat. Sejak `4.0.0`, lebar yang diukur tidak lagi menyebabkan hal ini, karena `value` tidak memuatnya. Sebagai gantinya, host yang menulis file dapat membedakan perubahan dokumen dari perubahan area pandang dengan `changed` milik store replikasi — lihat [on@change](./advanced/remote-storage.md#onchange).  
Event ini tidak membawa `detail` dan tidak melakukan bubbling maupun melintasi batas shadow, jadi pasang listener pada elemen itu sendiri dan baca `editor.value` di handler.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Dipancarkan saat tema prasetel diubah dari pembuat tema bawaan, atau sejak `4.0.0` dari `Theme` di Pencarian Cepat. Setiap pilihan memancarkannya, termasuk memilih opsi yang sudah berlaku.  
Memanggil sendiri [setPresetTheme](#setpresettheme) atau [setSystemAppearance](#setsystemappearance), atau mengaktifkan atau menonaktifkan [systemDarkMode](#systemdarkmode), tidak memancarkannya.  
`event.detail` adalah `ThemeOptions` lengkap setelah pemilihan — `{ appearance, grayColor, accentColor }` — bukan bagian parsial yang diminta. Sejak `4.0.0`, `appearance` di dalamnya bernilai `'system'` selama `System` dipilih, bukan mode terang atau gelap yang ditampilkannya, jadi simpan apa adanya dan berikan kembali ke `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Sejak `4.0.0`, dipancarkan saat sebuah bahasa dipilih di editor, dari pemilih bahasa atau dari `Display Language` di Pencarian Cepat, yang keduanya diaktifkan oleh [enableLocalePicker](#enablelocalepicker).  
Event ini terpicu setelah bahasa diterapkan, pada setiap pemilihan, termasuk memilih opsi yang sudah berlaku. [setLocale](#setlocale) dan [setSystemLocale](#setsystemlocale) tidak pernah memancarkannya, begitu pula perubahan bahasa browser. Pergantian bahasa tidak memancarkan `change`.  
`event.detail` adalah `{ locale }`, sebuah `LocaleOption`: `'system'` saat `System` dipilih, selain itu kode bahasa tersebut. Elemen tidak mengingat pilihan itu, jadi simpan dan teruskan ke `setLocale` pada pemuatan berikutnya.  
Seperti `change`, event ini tidak melakukan bubbling, jadi pasang listener pada elemen itu sendiri.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Memfokuskan editor.

```js
editor.focus();
```

## blur {#blur}

Menghapus fokus dari editor.

```js
editor.blur();
```

## clear {#clear}

Mengosongkan dokumen, menghapus semua tabel, kolom, hubungan, indeks, dan memo, serta sejak `4.0.0` semua grup tabel.  
Semua pengaturan tetap ada, termasuk database, posisi area pandang, tingkat zoom, opsi tampilan tabel, setiap penguncian beserta nilai terkuncinya, dan skrip `Before tables` serta `After tables` di tab Skema SQL, sehingga file yang dikosongkan tetap menyimpan apa yang disimpannya. Untuk memulai dokumen baru sebagai gantinya, tetapkan `''` ke `value` atau panggil `setInitialValue('')`.  
Metode ini dicatat dalam daftar riwayat, sehingga dapat dibatalkan, dan memancarkan `change`. Pembatalan mengembalikan dokumen seperti yang dipegang editor, dengan setiap pengaturan terkunci pada nilai terkuncinya. Metode ini diabaikan selama `readonly` aktif.

```js
editor.clear();
```

## destroy {#destroy}

Menghancurkan instans editor sepenuhnya sehingga tidak dapat digunakan kembali.  
Metode ini melepaskan listener dan langganan editor, serta menghancurkan setiap shared store yang dikembalikan oleh [getSharedStore](#getsharedstore).  
Batch aliran yang masih ditahan shared store ikut dibuang; panggil [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) milik store itu terlebih dahulu untuk mengirimnya.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Mendefinisikan ulang pintasan keyboard.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` dan `zoomReset` bersifat tetap dan tidak dapat didefinisikan ulang.  
Hanya dua puluh satu nama di bawah ini yang ditulis; apa pun selain itu di dalam objek diabaikan, termasuk nama-nama tetap.  
Sejak `3.10.0`, `search` dapat didefinisikan ulang, dan `findReplace` baru ditambahkan. Sebelumnya, `search` bersifat tetap. Sejak `4.0.0`, `removeSelection` baru ditambahkan. Sejak `4.1.0`, `addTableGroup` dan `groupSelectedTables` baru ditambahkan.  
Nilai kombinasi tombol harus berupa `ShortcutOption[]`. String biasa diabaikan, jadi tulis `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`, bukan `{ addTable: 'Alt+KeyN' }`.  
Array kosong diterima dan tidak mengikat tombol apa pun: `setKeyBindingMap({ findReplace: [] })` menyerahkan `Ctrl + F` (Windows/Linux) atau `⌘ + F` (Mac) kepada halaman, dan `{ search: [] }` melakukan hal yang sama untuk `Ctrl + K` (Windows/Linux) atau `⌘ + K` (Mac). Tombol `Search` di bilah alat tetap membuka Pencarian Cepat, tombol `Explorer` di bilah alat tetap membuka dan menutup Penjelajah, dan `Toggle Explorer` di Pencarian Cepat dan di menu konteks kanvas tetap membuka pencariannya atau menutupnya; tidak satu pun dari ini menampilkan pintasan untuk nama yang dibiarkan kosong. `{ removeSelection: [] }` menyerahkan `Delete` dan `Backspace` kepada halaman, dan item hapus di menu tabel, memo, dan grup tabel (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) lalu tidak menampilkan pintasan.  
Sejak `4.1.0`, `{ addTableGroup: [] }` menyerahkan `Alt + G` (Windows/Linux) atau `⌥ + G` (Mac) kepada halaman, dan `{ groupSelectedTables: [] }` menyerahkan `T` lalu `G`. `New Table Group` di bilah alat kanvas, di menu konteks kanvas, dan di Pencarian Cepat, `Group selected tables` di menu tabel, dan `Group Selected Tables` di Pencarian Cepat tetap berfungsi, tanpa pintasan yang ditampilkan. Tooltip tombol `New Table`, `New Memo`, dan `New Table Group` di bilah alat kanvas menyebutkan kombinasi tombol pertama dari `addTable`, `addMemo`, dan `addTableGroup`, atau hanya nama tombolnya untuk kombinasi tombol yang dibiarkan kosong.  
Panggilan ini merupakan penggabungan parsial: nama yang tidak Anda sertakan mempertahankan nilai defaultnya, dan memanggilnya dua kali mempertahankan perubahan sebelumnya. Tidak ada getter untuk kombinasi tombol saat ini: [createKeyBindingMap](#createkeybindingmap) mengembalikan nilai default, bukan apa yang diubah `setKeyBindingMap`.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection`, dan sejak `4.1.0` `groupSelectedTables` mengalah pada kursor teks: selama fokus berada di input, textarea, atau `contenteditable`, `$mod + A` memilih teks, `Space` mengetik spasi, `Delete` dan `Backspace` menghapus teks, dan `T` lalu `G` mengetik kedua huruf itu, alih-alih sampai ke kanvas. Tidak satu pun dari penekanan tombol itu yang dicegah. Kombinasi tombol apa pun yang Anda tetapkan ulang untuknya berperilaku sama.

Sejak `4.0.0`, `removeSelection` (`Delete` atau `Backspace`) menghapus pilihan di tab ERD sebagai satu langkah pembatalan, tanpa bertanya. Saat tabel yang difokuskan adalah satu-satunya yang dipilih, satu atau beberapa kolomnya dipilih, dan tingkat zoom menggambar barisnya, kombinasi ini menghapus kolom-kolom tersebut; jika tidak, kombinasi ini menghapus setiap tabel, memo, dan grup tabel yang dipilih, dengan tabel di dalam grup tetap dipertahankan. Lihat [Penghapusan tabel dan memo](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Tombol yang ditahan hanya menghapus sekali, dan tidak ada yang dihapus selama editor sel, memo, atau nama grup tabel terbuka. Di luar kotak teks dan panel yang menahan kombinasi tombol (lihat [createKeyBindingMap](#createkeybindingmap)), penekanan tombol ini dicegah di setiap tab selama editor memiliki fokus, juga pada tombol bilah alat yang difokuskan, dan di editor hanya baca, tempat penekanan itu tidak menghapus apa pun.

Sejak `4.1.0`, `addTableGroup` (`Alt+KeyG`) menyiapkan penggambaran `New Table Group` di tab ERD, yang menggambar grup pada penekanan tombol utama mouse berikutnya di kanvas, dan menekannya lagi membatalkan penggambaran itu, seperti yang dilakukan tombol `New Table Group` di bilah alat kanvas. `groupSelectedTables` (`KeyT KeyG`, `T` lalu `G`) memasukkan tabel yang dipilih ke grup baru dan membuka editor namanya, seperti yang dilakukan `Group selected tables` di menu konteks tabel. Tanpa tabel yang dipilih, kombinasi ini tidak menambahkan apa pun; memo atau grup tabel yang dipilih tidak dihitung. Lihat [Menggambar grup](../guide/guides/table-groups.md#drawing-a-group) dan [Mengelompokkan tabel yang dipilih](../guide/guides/table-groups.md#grouping-selected-tables).  
Keduanya hanya bekerja jika menu menawarkan grup: tidak selama `readonly` aktif, selama opsi tampilan `Table Groups` menyembunyikan grup, atau selama editor sel, memo, atau nama grup tabel terbuka. Seperti kombinasi tombol kanvas lainnya, keduanya hanya bekerja di tab ERD, dan tidak selama Pencarian Cepat, Properti Tabel, Penampil Perbedaan, Perjalanan Waktu, pratinjau Tata Letak Otomatis, `Export image`, atau `Map Columns` terbuka. Saat keduanya tidak melakukan apa pun, penekanan tombol tetap dicegah, kecuali jika `groupSelectedTables` mengalah pada kursor teks. `addTableGroup` juga dihentikan, seperti `focusView` dan `zenMode`, sehingga listener `keydown` bubbling milik halaman tidak pernah menerimanya.

Sejak `3.10.0`, `findReplace` (`$mod+KeyF`) membuka [Temukan dan Ganti](../guide/guides/find-and-replace.md). Sejak `4.1.0`, kombinasi ini membuka atau menutup [Penjelajah](../guide/guides/explorer.md#opening-and-closing) yang memuatnya, dan tab Pintasan mencantumkannya sebagai `Toggle Explorer`.  
Selama tombol `Explorer` di bilah alat tampak tertekan (Penjelajah terbuka di tab ERD dan tidak disembunyikan oleh mode Zen), kombinasi ini menutup Penjelajah, kecuali jika Pencarian Cepat, Properti Tabel, pembuat tema, pemilih bahasa, dialog `Export image`, atau `Map Columns` terbuka. Jika tidak, kombinasi ini menutup salah satunya yang sedang terbuka, memunculkan tab ERD dari tab lain mana pun, dan membuka Penjelajah dengan kursor teks di kotak `Find` dan kueri terpilih. Editor yang terlalu sempit untuk menampilkan Penjelajah di samping kanvas tetap membiarkannya terbuka tetapi menyingkir, dan menampilkan notifikasi `Widen the window to show the Explorer`. Sebelum `4.1.0`, kombinasi ini membuka panel mengambang Temukan dan Ganti, atau mengembalikan keyboard ke kotaknya, dan tidak pernah menutupnya.  
Kombinasi ini tidak mengalah pada kursor teks: selama editor difokuskan, kombinasi ini diambil di setiap tab, dari kanvas atau dari input di dalam editor. Penekanan tombol ini dicegah, sehingga browser tidak membuka bilah pencarian, dan dihentikan, sehingga tidak ada listener `keydown` bubbling di halaman yang menerimanya. Saat editor sel atau memo terbuka, atau sejak `4.0.0` editor nama grup tabel, penekanan ini tetap dicegah dan dihentikan, tetapi tidak melakukan apa pun.  
Selama Penampil Perbedaan, Perjalanan Waktu, atau pratinjau Tata Letak Otomatis terbuka, di tab mana pun, atau selama IME masih melakukan komposisi, penekanan ini tidak dicegah maupun dihentikan, sehingga pencarian milik browser atau host sendiri yang menerimanya. Di dalam Penjelajah, penekanan yang masih dalam komposisi dihentikan di sana, meskipun tidak dicegah. Kombinasi tombol apa pun yang Anda tetapkan ulang untuk `findReplace` berperilaku sama.

`focusView` hanya bekerja di tab ERD. Dengan setidaknya satu tabel dipilih, kombinasi ini membuka tab Visualisasi dalam mode Alur, dipersempit ke tabel-tabel itu dan setiap tabel yang berjarak satu hubungan; memo atau grup tabel yang dipilih tidak dihitung, dan tanpa tabel yang dipilih kombinasi ini tidak melakukan apa pun. Lihat [Memfokuskan tabel](../guide/guides/visualization.md#focusing-on-tables).

`stop` (`Escape`) di tab ERD mengakhiri editor sel atau memo yang terbuka, atau hubungan yang sedang digambar, dan membiarkan pilihan seperti apa adanya. Sejak `4.0.0`, kombinasi ini juga mengakhiri editor nama grup tabel, tanpa menulis nama, dan penggambaran `New Table Group`. Editor memanggil `preventDefault()` pada penekanan itu.  
Saat tidak ada satu pun yang terbuka, `Escape` mengosongkan pilihan dan sel yang difokuskan, dan tidak dicegah. Karena itu, keluar dari pengeditan dan mengosongkan pilihan memerlukan dua kali tekan.  
Selain Penjelajah, format `Import` di [layar sambutan](#enablewelcomescreen), serta pemilih dan dialog di bawah, editor tidak pernah menghentikan propagasi `Escape`, sehingga halaman yang mendengarkannya sendiri, misalnya untuk menutup dialognya sendiri, menerima kedua penekanan dan dapat melewati penekanan yang memiliki `defaultPrevented` bernilai `true`.  
Selama Pencarian Cepat, Properti Tabel, Penampil Perbedaan, pratinjau Tata Letak Otomatis, atau Perjalanan Waktu terbuka, `Escape` justru menutupnya dan membiarkan pilihan seperti apa adanya. Penekanan itu juga tidak dicegah.  
Sejak `4.0.0`, dialog [`Export image`](../guide/guides/file-import-export.md#image) atau [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) yang terbuka juga menerima `Escape`, menutup dirinya sendiri dan membiarkan pilihan seperti apa adanya. Masing-masing mengambil keyboard saat terbuka, dan `Escape` itu dicegah sekaligus dihentikan.  
Sejak `4.1.0`, `Escape` yang ditekan saat fokus berada di dalam [Penjelajah](../guide/guides/explorer.md#keys-in-the-explorer), di pohonnya, kotaknya, atau tombolnya, mengembalikan keyboard ke kanvas dan membiarkan Penjelajah tetap terbuka serta pilihan seperti apa adanya. Editor memanggil `preventDefault()` dan `stopPropagation()` sekaligus padanya, sehingga penekanan ini tidak pernah sampai ke listener `keydown` bubbling milik halaman.  
`Escape` di kanvas tidak pernah menutup Penjelajah. Sebelum `4.1.0`, `Escape` di dalam panel Temukan dan Ganti menutup panel itu, dan penekanan di kanvas menutupnya dalam penekanan yang sama yang mengosongkan pilihan.  
Sejak `4.0.0`, pemilih bahasa dan pemilih warna tertutup dengan `Escape`: di dalamnya, penekanan ini dicegah dan dihentikan, dan di kanvas penekanan ini menutupnya dalam penekanan yang sama yang mengosongkan pilihan, tanpa dicegah maupun dihentikan.  
`Escape` yang ditekan selama IME masih melakukan komposisi menjadi milik komposisi itu. Penekanan ini membiarkan editor yang terbuka seperti apa adanya dan tidak dicegah, sehingga halaman juga dapat melewati penekanan dengan `isComposing` bernilai `true`, atau dengan `keyCode` bernilai `229`. Di dalam Penjelajah, penekanan seperti itu, seperti tombol apa pun yang ditekan di sana di tengah komposisi, juga dihentikan, dan keyboard tetap berada di kotak tersebut.  
Sebelum `3.9.2`, satu kali `Escape` sekaligus mengakhiri pengeditan atau penggambaran dan mengosongkan pilihan, dan editor tidak pernah mencegahnya.

### createKeyBindingMap {#createkeybindingmap}

Sejak `3.9.2`, paket ini mengekspor `createKeyBindingMap()`, beserta tipe `KeyBindingMap`, `KeyBindingName`, dan `ShortcutOption`.  
Fungsi ini mengembalikan kombinasi tombol default, seluruh 28 nama termasuk nama-nama tetap, sebagai map baru pada setiap panggilan, sehingga mengubah map yang dikembalikannya tidak mengubah apa pun di tempat lain.  
Inilah titik awal setiap editor, dan panggilan `setKeyBindingMap` tidak tercermin di dalamnya.  
Hanya `createKeyBindingMap` yang merupakan ekspor runtime; tiga lainnya adalah tipe.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Setiap `shortcut` adalah kombinasi tombol dalam sintaks [tinykeys](https://github.com/jamiebuilds/tinykeys) yang menyebut tombolnya dengan `KeyboardEvent.code`, dengan [`$mod`](#mod) berarti `⌘` di macOS dan `Control` di tempat lain.  
Sejak `4.0.0`, editor membaca kombinasi ini sendiri, bukan melalui tinykeys, dengan sintaks yang sama. Sebuah tombol cocok berdasarkan nilai `code`, atau berdasarkan nilai `key` dalam huruf besar maupun kecil, dan sebuah penekanan hanya cocok jika tepat tombol pengubah yang disebutkannya yang ditahan. `AltGraph` dihitung sebagai `Control` dan `Alt` di Windows dan sebagai `Alt` di macOS. Penekanan yang dipisahkan spasi membentuk urutan tombol, yang dimulai ulang setelah satu detik tanpa keydown.  
Sejak `4.1.0`, satu default berupa urutan tombol: `groupSelectedTables` adalah `KeyT KeyG`, `T` lalu `G`. Urutan tombol dijalankan pada penekanan yang melengkapinya, dan hanya penekanan itu yang menerima `preventDefault` dan `stopPropagation` milik urutan itu, sehingga dengan default, `T` sampai ke halaman dan hanya `G` yang dicegah. Menu, Pencarian Cepat, dan tab Pintasan menampilkan urutan tombol sebagai satu tombol per penekanan.  
Nama-nama tetap diikat ke `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`), dan `$mod+Digit0` (`zoomReset`). `edit` dan `stop` tidak membawa flag; lima lainnya membawa `preventDefault` dan `stopPropagation`. Sisanya adalah default di atas, termasuk `search` dan `findReplace`.

Editor mendengarkan kombinasi ini pada elemennya sendiri, sehingga host yang mengambil tombol sebelum editor, dengan hotkey global atau listener `keydown` fase capture, harus meloloskannya selama editor difokuskan.  
Susun daftar yang diloloskan dari `createKeyBindingMap()`, dengan kombinasi tombol yang Anda berikan ke `setKeyBindingMap` menggantikan default.  
Sejak `3.10.0`, daftar itu mencakup `$mod+KeyF`, kombinasi tombol pencarian milik browser sendiri. Host yang ingin mempertahankan pencariannya sendiri pada kombinasi itu memanggil `setKeyBindingMap({ findReplace: [] })`.  
Sejak `4.0.0`, daftar itu juga mencakup `Delete` dan `Backspace` tanpa pengubah. Host yang ingin mempertahankan tombol tersebut memanggil `setKeyBindingMap({ removeSelection: [] })`.  
Sejak `4.1.0`, daftar itu juga mencakup `Alt+KeyG` dan urutan tombol `KeyT KeyG`, yang datang sebagai satu string: pisahkan di spasi dan loloskan setiap penekanan, termasuk `T` dan `G` tanpa pengubah, karena urutan tombol yang kehilangan satu penekanan tidak pernah selesai. Host yang ingin mempertahankan tombol tersebut memanggil `setKeyBindingMap({ addTableGroup: [] })` atau `setKeyBindingMap({ groupSelectedTables: [] })`.

Selama fokus berada di dalam Penjelajah, di pohonnya, kotak `Find` dan `Replace` miliknya, atau tombolnya, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut`, dan `zoomReset` diteruskan ke editor, sehingga `findReplace` bekerja di sana seperti di kanvas. Setiap kombinasi tombol lain, sesuai pengaturannya saat ini, berhenti di Penjelajah, urutan tombol pada penekanan terakhirnya (`G` tanpa pengubah dengan default), begitu pula tombol panah, `Tab`, `Enter`, `Space`, `Home`, `End`, dan tombol apa pun yang ditekan selama IME masih melakukan komposisi. Kecuali `Escape`, yang mengembalikan keyboard ke kanvas, semuanya dihentikan tanpa dicegah, sehingga berfungsi sebagai tombol keyboard biasa di kotak, tombol, dan pohon Penjelajah dan tidak sampai ke kanvas maupun listener `keydown` bubbling milik halaman: `Alt + N` di sana tidak menambahkan tabel, dan `Delete` tidak menghapus apa pun. Tombol yang memindahkan, menciutkan, atau menuju baris pohon, serta `Enter` di kotak `Find` atau `Replace`, yang berpindah antarkecocokan atau mengganti, juga dicegah.  
Tombol lain apa pun, seperti kombinasi tombol simpan atau palet perintah milik host, diteruskan ke halaman seperti biasa. Lihat [Tombol di Penjelajah](../guide/guides/explorer.md#keys-in-the-explorer). Sebelum `4.1.0`, panel mengambang Temukan dan Ganti menahan tombol dengan cara yang sama, kecuali `Home`, `End`, penekanan terakhir urutan tombol, dan `Space` selama `handTool` diikat ke tombol lain.  
Sejak `4.0.0`, pemilih bahasa menahan tombol dengan cara yang sama: tujuh kombinasi tombol yang sama diteruskan, dan setiap kombinasi tombol lain (sejak `4.1.0`, urutan tombol pada penekanan terakhirnya), tombol panah, dan `Tab` dihentikan di sana tanpa dicegah, begitu pula tombol apa pun yang ditekan selama IME masih melakukan komposisi. `↑`, `↓`, `Home`, `End`, `Enter`, dan `Space` pada salah satu barisnya berpindah antarbaris atau memilih salah satunya, dan juga dicegah.

### $mod {#mod}

Mengganti tombol `Control` bergantung pada lingkungan.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabel pintasan {#shortcut-table}

Menggunakan properti `key, code` dari event keyboard.  
Gunakan `code` untuk posisi absolut dan `key` untuk nilai input.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| Tidak ada     | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | Tidak ada     | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, dan seterusnya | `1`, `2`, dan seterusnya | `1`, `2`, dan seterusnya | `Digit1`, `Digit2`, dan seterusnya |
| `a`, `b`, dan seterusnya | `a`, `b`, dan seterusnya | `a`, `b`, dan seterusnya | `KeyA`, `KeyB`, dan seterusnya |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Menyetel tema prasetel.  
Nilai defaultnya adalah `appearance: 'dark'`, `grayColor: 'slate'`, dan `accentColor: 'indigo'`.  
Setiap field diterapkan secara terpisah, sehingga panggilan parsial membiarkan dua field lainnya seperti apa adanya. Nilai yang bukan salah satu nama di bawah ini diabaikan, dan panggilan ini tidak pernah melempar kesalahan.  
Sejak `4.0.0`, `appearance` juga menerima `'system'`, yaitu `System` di pembuat tema. Nilai ini menampilkan mode terang atau gelap yang dilaporkan sistem operasi, atau yang disebutkan [setSystemAppearance](#setsystemappearance), dan beralih saat nilai itu berubah.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Sejak `4.0.0`, menentukan mode terang atau gelap yang ditampilkan oleh tampilan `'system'`, untuk host yang memiliki mode terang dan gelapnya sendiri, seperti tema IDE. Selama salah satunya ditentukan, perubahan dari sistem operasi diabaikan.  
`null`, atau nilai apa pun selain `'dark'` atau `'light'`, kembali mengikuti sistem operasi.  
Selama tampilan bernilai `'light'` atau `'dark'`, metode ini tidak mengubah apa pun di layar, tetapi nilainya disimpan dan berlaku begitu tampilan menjadi `'system'`. Jika tidak, nilainya langsung berlaku. Metode ini tidak memancarkan apa pun, dan `changePresetTheme` tetap melaporkan `'system'`.  
Host VS Code, JetBrains, dan Obsidian memanggilnya dengan mode terang atau gelap miliknya sendiri, dan memanggilnya lagi setiap kali mode itu berubah.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Memungkinkan kustomisasi tema.  
Setiap panggilan menggantikan seluruh lapisan kustom, jadi berikan lagi objek lengkapnya untuk mengubah satu token di atas penimpaan yang sudah ada, dan berikan `{}` untuk kembali ke prasetel.  
Hanya nama token di bawah ini, dengan nilai string, yang dipertahankan; apa pun selain itu dibuang tanpa kesalahan.  
Lapisan ini berada di atas prasetel, sehingga `setPresetTheme` berikutnya menukar prasetel di bawahnya sementara penimpaan Anda tetap ada.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` dan `memoShadow` adalah warna bayangan yang dijatuhkan tabel dan memo di kanvas ERD. Prasetel gelap membiarkannya `transparent`, yang tidak menghasilkan bayangan, sama seperti memberikan `none` atau string kosong ke `setTheme`; prasetel terang menggunakan `rgba(0, 0, 0, 0.18)`.

Sejak `4.0.0`, ada sembilan token tambahan:

- `tableGroupHeaderBackground`, `tableGroupBackground`, dan `tableGroupBorder` mewarnai bilah judul, badan, dan garis luar [grup tabel](../guide/guides/table-groups.md) yang tidak memiliki warnanya sendiri.
- `toastSuccess` dan `toastError` mewarnai tanda pada notifikasi yang melaporkan bagaimana sesuatu berakhir.
- `findReplaceError` dan `mapColumnsError` mewarnai kesalahan yang ditampilkan Temukan dan Ganti serta dialog Petakan Kolom. Sebelumnya Temukan dan Ganti menggunakan `diffDeleteForeground`, sehingga menimpa token itu tidak lagi mengubah warnanya.
- `schemaSqlWarningBackground` dan `schemaSqlWarningForeground` mewarnai peringatan di opsi tab Skema SQL.

Sejak `4.1.0`, ada sembilan token tambahan:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted`, dan `treeMatch` mewarnai pohon yang digunakan bersama oleh [Penjelajah](../guide/guides/explorer.md#the-tree) dan [Penampil Perbedaan](../guide/guides/table-related-functions.md#diff-viewer): latar belakangnya, yang juga mengisi kotak `Find` dan `Replace` di Penjelajah; baris di bawah penunjuk, baris aktif keyboard selama pohon memiliki fokus, dan tombol di bawah penunjuk di header dan pencarian Penjelajah; baris kecocokan pencarian saat ini; teks redup seperti jumlah, tipe data, dan panah penciutan; serta tanda di belakang teks yang ditemukan pencarian.
- `explorerBackground` dan `explorerBorder` mewarnai panel Penjelajah dan garis-garisnya: tepinya di samping kanvas, garis di bawah pencariannya, serta garis batas kotaknya dan tombol yang dibentangkan `Search In`. `explorerBorder` juga menggambar tepi pohon Penampil Perbedaan, garis di bawah kotak `Filter by name` miliknya, dan garis batas kotak itu. Ikon kunci di Penjelajah menggunakan `keyPK`, `keyFK`, dan `keyPFK`.
- `diffModifyForeground` dan `diffRenameForeground` mewarnai apa yang ditandai Penampil Perbedaan sebagai diubah dan diganti namanya, di pohonnya dan di kedua dokumen. `diffModifyForeground` juga memberi garis luar pada tabel, memo, atau grup tabel yang dipindahkan, diubah ukurannya, diubah warnanya, atau dipindah grupnya, apa pun perubahan lain di dalamnya, dan menggambar konektor kunci asing yang berubah.

`diffInsertForeground` dan `diffDeleteForeground` kini mewarnai apa yang ditandai Penampil Perbedaan sebagai ditambahkan dan dihapus, di pohonnya dan di dokumen yang memuatnya, baik pada teks, garis luar, maupun konektor. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground`, dan `diffCrossForeground` dihapus di `4.1.0`, karena Penampil Perbedaan tidak lagi mengisi sel. `setTheme` membuangnya seperti nama lain yang tidak ada di `Theme`, dan hook untuk token tersebut, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background`, dan `--erd-editor-diff-cross-foreground`, tidak lagi dibaca.

#### Variabel CSS {#css-variables}

Setiap token di `Theme` memiliki hook CSS yang sesuai, bernama `--erd-editor-` ditambah nama kuncinya dalam kebab-case: `grayColor10` menjadi `--erd-editor-gray-color-10`, `keyPK` menjadi `--erd-editor-key-pk`, dan `keyPFK` menjadi `--erd-editor-key-pfk`.  
Hook ini diwariskan ke dalam editor, jadi setel di mana pun Anda ingin hook itu berlaku. Pada `:root`, hook ini memberi tema pada setiap editor di halaman; pada elemen itu sendiri, hook ini hanya memberi tema pada editor tersebut.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Sejak `3.4.0`, token `dargSelect` yang salah eja ditulis `dragSelect`, dan hook untuk token itu berubah dari `--erd-editor-darg-select-background` dan `--erd-editor-darg-select-border` menjadi `--erd-editor-drag-select-background` dan `--erd-editor-drag-select-border`. Stylesheet yang masih menggunakan nama lama diabaikan.

<details>
<summary>Nilai tema default</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Bahasa tampilan {#display-language}

Sejak `4.0.0`, teks milik editor sendiri — menu, panel, dialog, Pencarian Cepat, notifikasi, dan kata-kata yang digambarnya di diagram seperti `unnamed`, termasuk pada ekspor gambar — tersedia dalam 25 bahasa. Nama tabel dan kolom, SQL, tipe data, dan kode yang dihasilkan tidak pernah diterjemahkan. Lihat [Bahasa dan tema](../guide/guides/language-and-theme.md).  
Sebelum [setLocale](#setlocale) dipanggil atau sebuah bahasa dipilih, editor menampilkan bahasa Inggris, atau mengikuti `'system'` selama [enableLocalePicker](#enablelocalepicker) aktif.  
Editor menyetel `lang` dan `dir` pada root miliknya sendiri di dalam shadow root tertutup, tidak pernah pada elemen host atau halaman, sehingga halaman kanan ke kiri tidak membalik editor dan bahasa kanan ke kiri tidak membalik halaman. Bahasa Ibrani, Arab, dan Persia menata antarmuka editor dari kanan ke kiri; diagram itu sendiri tidak pernah dicerminkan. Sejak `4.1.0`, [Penjelajah](../guide/guides/explorer.md) tetap berada di kiri kanvas dalam setiap bahasa, dengan barisnya sendiri terbaca dari kanan ke kiri dalam ketiga bahasa tersebut.  
Paket ini mengekspor tipe `LocaleCode` (salah satu kode di bawah) dan `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Kode    | Ditampilkan sebagai  | Bahasa               |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonesia            |
| `de-DE` | Deutsch              | Jerman               |
| `en`    | English              | Inggris              |
| `es-ES` | Español              | Spanyol              |
| `eu-ES` | Euskara              | Basque               |
| `fr-FR` | Français             | Prancis              |
| `it-IT` | Italiano             | Italia               |
| `nl-NL` | Nederlands           | Belanda              |
| `pl-PL` | Polski               | Polandia             |
| `pt-PT` | Português            | Portugis             |
| `pt-BR` | Português Brasileiro | Portugis Brasil      |
| `ro-RO` | Română               | Rumania              |
| `sk-SK` | Slovenčina           | Slowakia             |
| `sl-SI` | Slovenščina          | Slovenia             |
| `sv-SE` | Svenska              | Swedia               |
| `tr-TR` | Türkçe               | Turki                |
| `ru-RU` | Русский              | Rusia                |
| `uk-UA` | Українська           | Ukraina              |
| `he-IL` | עברית                | Ibrani               |
| `ar-SA` | العربية              | Arab                 |
| `fa-IR` | فارسی                | Persia               |
| `ja-JP` | 日本語               | Jepang               |
| `zh-CN` | 简体中文             | Tionghoa Sederhana   |
| `zh-TW` | 繁體中文             | Tionghoa Tradisional |
| `ko-KR` | 한국어               | Korea                |

### setLocale {#setlocale}

Menyetel bahasa tampilan: `'system'`, atau salah satu kode di atas. Apa pun selain itu, seperti `'ko'` saja, kode yang tidak dikenal, atau nilai yang bukan string, diabaikan tanpa kesalahan.  
Bahasa diterapkan sebelum metode ini selesai, sehingga bahasa yang disetel sebelum elemen ditambahkan ke DOM sudah ada di frame pertamanya.  
Metode ini tidak memancarkan apa pun, baik `changeLocale` maupun `change`, dan tidak menyentuh `value`, riwayat pembatalan, maupun shared store.  
Pilihan ini bertahan, baik `enableLocalePicker` diaktifkan maupun dinonaktifkan, dan `setLocale('system')` juga mengikuti sistem saat pemilih bahasa nonaktif.  
Editor tidak menyimpan apa pun. Untuk mempertahankan pilihan pembaca, dengarkan [changeLocale](#changelocale) dan berikan kembali pilihan itu pada pemuatan berikutnya.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Menentukan bahasa yang diwakili `'system'`, sebagai tag BCP 47, untuk host yang memiliki bahasa tampilannya sendiri. Host VS Code, JetBrains, dan Obsidian memanggilnya dengan bahasa tampilan miliknya sendiri.  
Spasi di awal dan akhir tag dipangkas. `null`, string kosong, atau nilai yang bukan string kembali ke `navigator.languages` milik browser, yang diikuti editor saat nilainya berubah.  
Metode ini hanya berpengaruh selama opsi yang berlaku adalah `'system'`, dan langsung diterapkan. Baris `System` di pemilih bahasa menyebutkan bahasa hasil pemetaannya.  
Tag tersebut, atau setiap bahasa browser secara berurutan, dipetakan ke bahasa pertama yang dimiliki editor, berdasarkan subtag bahasanya, tanpa membedakan huruf besar dan kecil serta mengabaikan garis bawah: `de-AT` menghasilkan `de-DE` dan `en-GB` menghasilkan `en`. Bahasa Tionghoa ditentukan oleh aksaranya, `Hant` menghasilkan `zh-TW` dan `Hans` menghasilkan `zh-CN`, dan tanpa aksara ditentukan oleh wilayah, `TW`, `HK`, dan `MO` menghasilkan `zh-TW` dan wilayah lain mana pun `zh-CN`. `pt` menghasilkan `pt-BR` kecuali jika wilayah selain `BR` disebutkan. Jika tidak ada yang cocok, editor menampilkan bahasa Inggris.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Memuat file Skema SQL.  
Secara default, metode ini menggantikan dokumen saat ini alih-alih menggabungkan ke dalamnya; lihat `mode` di bawah. Pengaturan yang sudah Anda miliki dipertahankan, termasuk setiap penguncian beserta nilai terkuncinya, kecuali posisi area pandang dan tingkat zoom, dan tabel ditempatkan setelah file dibaca, berjajar dalam baris kecuali jika `placement` di bawah meminta cara lain. Dengan `Viewport` terkunci, `value` lalu menulis area pandang tempat impor dimulai, yaitu titik asal `0, 0` pada tingkat zoom `1`. Karena itu, dokumen yang diimpor ke elemen yang tidak pernah diberi nilai memiliki semua penguncian aktif, seperti dokumen baru.  
Metode ini dicatat dalam daftar riwayat, sehingga `Undo, Redo` dapat dilakukan, dan memancarkan `change`. String kosong diabaikan, dan panggilan ini tidak melakukan apa pun selama `readonly` aktif.  
`setSchemaGraphQL`, `setSchemaDBML`, dan `setSchemaAML` berperilaku sama, dan parsernya tidak pernah gagal: teks yang tidak dapat dibacanya memuat dokumen kosong alih-alih memunculkan kesalahan.  
Sejak `4.0.0`, keempatnya menerima argumen kedua opsional, `{ placement, mode }`:

- `placement: 'grid'`, default, langsung menempatkan tabel berjajar dalam baris, seperti sebelumnya, dan panggilan ini tidak mengembalikan apa pun.
- `placement: 'auto'` terlebih dahulu menata tabel berdasarkan hubungannya, seperti yang dilakukan `Import` di editor, dan mengembalikan `Promise` yang di-resolve setelah impor ditempatkan sebagai satu langkah pembatalan. Kurang dari dua tabel, tidak ada hubungan, tata letak yang gagal, halaman tanpa `SharedWorker`, atau `Cancel` pada notifikasi `Placing tables` membuat tabel ditempatkan berjajar dalam baris sebagai gantinya. Pemuatan di sela waktu itu — impor pengganti lain, penetapan `value`, `setInitialValue()`, `clear()`, pemuatan oleh kolaborator, atau pembatalan atau pengulangan pemuatan atau `clear()` — menggantikannya, dan `Promise` di-resolve tanpa ada yang dimuat. Impor yang ditempatkan dengan cara ini mendarat sesuai urutan dimulainya.
- `mode: 'replace'`, default, menggantikan dokumen. `mode: 'append'` menambahkan file di bawah diagram seperti yang dilakukan [Impor dan Tambahkan](../guide/guides/file-import-export.md#import-and-add), membiarkan setiap tabel yang sudah ada seperti apa adanya, begitu pula setiap pengaturan kecuali tab dan posisi area pandang. Dari tab lain, tab ERD dimunculkan terlebih dahulu. Tabel baru, dan grup tabel yang dibawa file DBML selama grup tabel ditampilkan, menjadi pilihan, dan area pandang menggulir ke sana kecuali jika semuanya sudah terlihat dengan baik, berdasarkan aturan yang diikuti setiap lompatan sejak `4.1.0` — lihat [Tempat lompatan berakhir](../guide/guides/table-related-functions.md#where-a-jump-lands). Satu kali pembatalan menghapus seluruh tambahan. Teks yang tidak dapat dibacanya tidak menambahkan apa pun dan membiarkan dokumen seperti apa adanya.

Selama `readonly` aktif, penggantian diabaikan, penambahan tidak menambahkan apa pun, dan panggilan `placement: 'auto'` langsung di-resolve.  
Sejak `3.10.0`, `setSchemaSQL` membaca file sesuai database dokumen saat ini: dengan Databricks dipilih, string berkutip tunggal mengikuti escape garis miring terbalik Spark. Lihat [Komentar](../guide/guides/file-import-export.md#comments).  
Sejak `3.10.0`, `setSchemaSQL` membaca `UNIQUE` atas dua kolom atau lebih sebagai satu indeks unik, bukan penanda Unik pada setiap kolom. Lihat [Kunci unik dan indeks](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Sejak `3.10.0`, impor SQL, DBML, dan AML mempertahankan tindakan `ON DELETE` dan `ON UPDATE` dari kunci asing yang dibacanya.  
Sejak `4.0.0`, `setSchemaSQL` mempertahankan seluruh ekspresi `DEFAULT` kolom, membaca `ADD DEFAULT … FOR` dan komentar `MS_Description` milik SQL Server, mengubah kolom serial dan identity PostgreSQL menjadi Kenaikan otomatis, mempertahankan `UNSIGNED` dan `ZEROFILL` dalam tipe data, dan membaca kunci utama yang ditandai `ALTER TABLE … ADD PRIMARY KEY` sebagai `CLUSTERED`, `NONCLUSTERED`, atau `USING BTREE`. Lihat [Skema SQL](../guide/guides/file-import-export.md#schema-sql).  
Lihat [Mengimpor atau mengekspor file](../guide/guides/file-import-export.md) untuk sintaks yang diterima setiap parser.

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Memuat dokumen GraphQL SDL.  
Definisi tipe objek menjadi tabel, dan field yang tipenya adalah tabel lain menjadi hubungan.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Memuat file DBML, format yang digunakan dbdiagram.io dan dbdocs.  
Sejak `4.0.0`, setiap `TableGroup` menjadi [grup tabel](../guide/guides/table-groups.md), dan `headercolor` tabel menjadi warnanya. Lihat [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Memuat file AML (Azimutt Markup Language). Penulisan saat ini maupun penulisan lama v1 sama-sama diterima.  
Sejak `4.0.0`, warna entitas, yaitu salah satu nama warna Azimutt atau nilai hex dalam tanda kutip, menjadi warna tabelnya. Lihat [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Sejak `4.0.0`, memuat dokumen `.erd.json`, seperti teks yang dikembalikan [value](#value).  
Dalam `mode: 'replace'` default, metode ini memuat dokumen seperti penetapan `value`: dicatat dalam daftar riwayat, memancarkan `change`, dan mengambil penguncian dokumen dengan cara yang sama. Tidak seperti `value`, string kosong atau nilai yang bukan string diabaikan alih-alih memulai dokumen baru. Teks yang bukan JSON mengosongkan dokumen, sama seperti pada `value`.  
`mode: 'append'` menambahkan tabel, hubungan, indeks, memo, dan grup tabel dari dokumen di bawah diagram dengan id baru, mempertahankan posisi relatif satu sama lain dan mengabaikan pengaturan dokumen, seperti yang dilakukan [Impor dan Tambahkan](../guide/guides/file-import-export.md#import-and-add) dengan file `json`. Teks yang tidak dapat dibacanya, atau dokumen tanpa tabel dan tanpa memo, tidak menambahkan apa pun. Selain itu, hasilnya ditempatkan seperti penambahan dengan [setSchemaSQL](#setschemasql), dengan memo dan grup tabel barunya dipilih bersama tabelnya, masing-masing jenis selama jenis itu ditampilkan.  
Metode ini selesai setelah dokumen ditempatkan, dan diabaikan selama `readonly` aktif.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Mengekspor keadaan editor saat ini sebagai Skema SQL.  
Jika `databaseVendor` tidak ditentukan, metode ini bekerja berdasarkan vendor yang sedang disetel. Nama yang tidak ada dalam daftar di bawah diperlakukan dengan cara yang sama, tanpa memunculkan kesalahan.  
Nama dikutip dengan tipe tanda kutip yang ditampilkan editor. Selama `Bracket Type` [terkunci](../guide/guides/settings.md#lock), tipe itu dapat berbeda dari yang disimpan `value`, yaitu tipe yang digunakan [`erd_read`](../mcp/tools.md#reading-a-document) milik agen pemrograman untuk mengutip.  
Sejak `4.0.0`, argumen opsional `options` memilih pernyataan dan pembuka, seperti yang dilakukan opsi di tab [Skema SQL](../guide/guides/schema-sql.md). `SchemaSQLOptions` diekspor sebagai tipe.

- `statements`: `'create'`, default; `'ifNotExists'`, yang menulis `IF NOT EXISTS` di MySQL, MariaDB, PostgreSQL, SQLite, dan Databricks dan kembali ke `'create'` di database lain; atau `'recreate'`, yang menghapus tabel sebelum membuatnya, dengan Snowflake menulis `CREATE OR REPLACE TABLE` sebagai gantinya.
- `header`: `'none'`, default; `'use'`, yang beralih ke database atau skema dokumen; atau `'createAndUse'`, yang terlebih dahulu membuatnya jika belum ada lalu beralih ke sana. Database yang tidak mendukung opsi yang diminta beralih ke opsi pengganti seperti yang dilakukan tab: Oracle menulis `'use'` untuk `'createAndUse'`, PostgreSQL tidak menulis pembuka untuk `'use'`, dan SQLite tidak menulis pembuka sama sekali. Pembuka hanya ditulis selama nama database dokumen merupakan pengenal biasa — huruf ASCII, angka, dan `_`, tidak diawali angka.

Opsi yang dihilangkan, atau opsi dengan nilai yang tidak dikenal, dibaca sebagai nilai defaultnya, sehingga panggilan tanpa opsi menulis pernyataan `CREATE` biasa tanpa pembuka, seperti sebelumnya.  
Sejak `4.0.0`, keluarannya selalu menyertakan skrip `Before tables` dan `After tables` dokumen, dengan urutan pembuka, skrip sebelum tabel, pernyataan drop, tabel, skrip setelah tabel. Pilihan `Statements`, `Header`, dan `Tables` milik tab Skema SQL tidak pernah memengaruhi panggilan ini, yang selalu menulis seluruh dokumen.  
Sejak `3.10.0`, setiap kunci asing membawa klausa `ON DELETE` dan `ON UPDATE` dari hubungannya. Klausa hanya ditulis jika tindakannya disetel dan vendor menerimanya, sehingga tindakan yang tidak diterima vendor itu dihilangkan dan nilai defaultnya berlaku. Sejak `4.0.0`, Snowflake hanya menerima `NO ACTION`. Lihat [ON DELETE dan ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) untuk apa yang ditulis setiap database.  
Sejak `3.10.0`, tanda kutip tunggal di dalam komentar tabel atau kolom di-escape, sehingga komentar seperti `it's` tidak lagi merusak pernyataan. Setiap vendor yang menulis komentar sebagai literal string menggandakannya, kecuali Databricks, yang menaruh garis miring terbalik sebelum setiap tanda kutip dan setiap garis miring terbalik. SQLite masih menulis komentar sebagai baris `--`.  
Sejak `4.0.0`, beberapa database juga menulis nama kunci, nilai default, dan kenaikan otomatis secara berbeda. Lihat [Apa yang ditulis DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
```

## getSharedStore {#getsharedstore}

Mengembalikan store untuk pengeditan kolaboratif secara waktu nyata.  
`config` adalah `{ getNickname?, mouseTracker?, focusTracker? }`. Kedua tracker bernilai default `true`: `mouseTracker` menyiarkan kursor editor ini ke editor lain, dan `focusTracker` menyiarkan sel yang difokuskan, pilihan, dan kotak seleksinya.  
Lihat [Pengeditan kolaboratif](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Membuka Penampil Perbedaan, yang membandingkan dokumen yang sedang terbuka dengan dokumen yang Anda berikan.  
Metode ini tidak mengembalikan apa pun dan tidak mengubah dokumen, sehingga menutup penampil membiarkan editor persis seperti semula.  
Nilai kosong, atau apa pun yang bukan string, dibandingkan dengan dokumen kosong.  
Ini adalah overlay yang sama dengan [Penampil Perbedaan](../guide/guides/table-related-functions.md#diff-viewer) di menu konteks kanvas.  
Sejak `4.1.0`, metode ini memasangkan isi kedua dokumen berdasarkan id terlebih dahulu, baru kemudian berdasarkan apa yang disimpan masing-masing, seperti nama tabel atau teks memo — lihat [Apa yang dibandingkan](../guide/guides/table-related-functions.md#what-is-compared). Karena itu, terhadap versi sebelumnya dari dokumen yang sama, seperti revisi Git dari filenya, penggantian nama tampil sebagai satu item yang diganti namanya; terhadap dokumen dengan id yang berbeda, penggantian nama tampil sebagai penghapusan dan penambahan. Penampil mencantumkan apa yang berubah dalam pohon di samping kedua dokumen dan menandai perubahan dengan warna alih-alih mengisi sel.

```js
editor.setDiffValue('prev json...');
```
