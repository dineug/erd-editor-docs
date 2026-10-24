---
sidebar_position: 1
description: Meneruskan perubahan editor antarinstans dengan getSharedStore, mengisi data awal editor yang bergabung dari runtimeValue, dan menampilkan kursor, fokus, pilihan, serta kotak seret setiap kolaborator.
---

# Pengeditan kolaboratif

`getSharedStore()` menjadikan editor sebuah simpul dalam sesi kolaboratif.  
Metode ini memancarkan setiap perubahan sebagai aliran aksi dan menerapkan aksi yang dikirim balik oleh editor lain — Anda yang menyediakan transport di antara editor (WebSocket, WebRTC, atau apa pun yang dapat membawa JSON).  
Metode ini adalah salah satu metode [ErdEditorElement](../erd-editor-element.md), dan berpasangan dengan [Penyimpanan jarak jauh](./remote-storage.md) saat perubahan yang diteruskan juga harus disimpan.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Aksi adalah objek biasa yang dapat diserialisasi dan menggambarkan satu perubahan pada dokumen, sehingga aksi tetap utuh melewati `JSON.stringify` dalam perjalanannya ke transport.  
Aksi tiba dalam batch: `subscribe` memberikan sebuah array kepada Anda, dan array itu merupakan satu unit — teruskan array itu secara utuh dan kirimkan secara utuh di sisi seberang.  
Perlakukan aksi sebagai data opak dan teruskan apa adanya alih-alih membaca atau menulis ulangnya, karena data pencatatan yang dibawanya itulah yang menjaga editor tetap sinkron.

Sebagian dari apa yang dilakukan sebuah editor tetap berada di editor itu.  
Membawa tabel, memo, atau grup tabel ke depan, seperti yang terjadi saat memilihnya, tidak dikirim.  
Pilihan `Statements`, `Header`, `Write logical names into empty comments` (sejak `4.2.0`), dan `Tables` di tab [Skema SQL](../../guide/guides/schema-sql.md) juga tidak dikirim, karena pilihan itu milik jendela tempat pilihan tersebut dibuat.  
Sejak `4.1.0`, [Penjelajah](../../guide/guides/explorer.md) juga tetap berada di editornya: apakah panel itu terbuka, lebarnya, baris yang diciutkan, baris tempat fokus keyboard berada, posisi guliran pohonnya, serta pencarian dan opsinya tidak dikirim.  
[Sorotan](../../guide/guides/relationship-editing.md#reading-a-connector) yang diberikan pada konektor hubungan saat menuju sebuah kunci asing juga tidak dikirim.  
Sejak `4.2.0`, tab [Kamus](../../guide/guides/dictionary.md) juga tetap berada di editornya: lembar mana yang ditampilkan, serta pencarian, pilihan, guliran, dan lebar kolom setiap lembar tidak dikirim. Perubahan, pengurutan, dan impor CSV di tab itu dikirim.  
Guliran, zoom, atau perpindahan tab dikirim, tetapi tidak pernah memindahkan area pandang atau tab pengguna lain. Hal ini termasuk guliran yang dibuat oleh lompatan dari Penjelajah, perpindahan ke tab ERD saat Penjelajah dibuka dari tab lain, serta perpindahan tab dan guliran yang dibuat oleh lompatan dari lembar [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) di tab Kamus ke tabel atau kolom. Lompatan dari lembar itu ke kata, istilah, atau domain tetap berada di tab Kamus, sehingga tidak ada bagiannya yang dikirim.

Sejak `4.2.0`, penggantian [Tampilan Nama](../../guide/guides/logical-names.md#switching-the-view) juga dikirim, dan [penguncian](../../guide/guides/settings.md#lock) Tampilan Nama menentukan apa yang dilakukan editor lain terhadap penggantian itu. Penguncian `Name View` aktif di diagram baru dan di dokumen apa pun dari sebelum `4.2.0`.  
Selama penguncian itu aktif, penggantian hanya tampil di editor yang melakukannya: penggantian tetap dikirim, tetapi setiap editor lain dan setiap replika membuangnya, sehingga setiap pengguna dapat melihat tampilan yang berbeda sementara `value` mempertahankan tampilan yang terkunci. Perubahan bahasa, konvensi penamaan, atau tipe tanda kutip berbeda: perubahan itu mencapai setiap editor, baik penguncian miliknya aktif maupun tidak.  
Selama penguncian itu nonaktif, penggantian yang dilakukan di editor yang dapat mengedit mengubah Tampilan Nama di setiap editor dan replika, dengan penggantian terakhir yang berlaku, dan semuanya menyimpannya.  
Penggantian yang dilakukan sendiri oleh editor hanya baca selalu tetap berada di editor itu, dan editor tersebut tetap mengikuti penggantian bersama dari editor lain.

[Penguncian](../../guide/guides/settings.md#lock) dibagikan: penguncian atau pembukaan kunci terakhir pada sebuah pengaturan berlaku di setiap editor, dan penguncian membawa nilai dari editor yang mengaktifkannya, sehingga setiap editor dan replika menyimpan nilai yang sama.  
Karena itu, penguncian `Viewport` menyimpan area pandang editor yang mengaktifkannya, dan penguncian `Canvas Type` menyimpan tab terakhir yang dibuka editor tersebut sebelum tab Pengaturan, tempat penguncian diaktifkan.  
Menonaktifkan penguncian `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`, atau, sejak `4.2.0`, `Name View` juga menetapkan pengaturan itu di setiap editor ke nilai yang ditampilkan di editor yang menonaktifkannya, sehingga semua editor tetap menyimpan satu nilai. Menonaktifkan `Viewport` atau `Canvas Type` tidak memindahkan area pandang atau tab siapa pun.

Perubahan pada skrip `Before tables` atau `After tables` dikirim secara utuh saat kotaknya kehilangan fokus. Hasil kedua skrip ditentukan secara terpisah, sehingga perubahan seorang kolaborator pada salah satunya tidak pernah menimpa yang lain.

Apa pun yang dilakukan di [mode Alur](../../guide/guides/visualization.md#flow-never-edits-the-document) pada tab Visualisasi bukanlah perubahan dokumen, sehingga editor yang berada di Alur tidak mengirim perubahan apa pun ke editor lain, dan perubahan yang dikirim editor lain tetap diterapkan selama editor itu berada di sana.  
Ada dua pengecualian. Meninggalkan Alur menuju tab lain merupakan perpindahan tab, yang dikirim seperti perpindahan tab lainnya. Sejak `4.2.0`, pilihan di daftar Tampilan Nama pada bilah Alur merupakan penggantian Tampilan Nama, yang dikirim dan diterapkan seperti penggantian yang dilakukan di kanvas.  
`Previous table`, `Next table`, serta tombol Batalkan dan Ulangi, yang [melangkah mundur dan maju](../../guide/guides/visualization.md#previous-table-and-next-table) di Alur, tidak dikirim.  
Tombol tautan eksternal pada kartu, hasil [Pencarian Cepat](../../guide/guides/quick-search.md#searching-the-diagram) yang dipilih setelah `#`, `@`, atau `:`, serta membuka [Penjelajah](../../guide/guides/explorer.md#opening-and-closing) semuanya meninggalkan Alur menuju tab ERD. Guliran yang dibuat tombol kartu atau hasil Pencarian Cepat di sana juga dikirim.

## Dua editor dalam satu halaman {#two-editors-on-one-page}

Sambungan dari subscribe ke dispatch di sini menggantikan jaringan, sehingga Anda dapat melihat bentuk sebuah sesi tanpa transport yang menghalangi.

```js
const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Kedua editor di sini dimulai dari dokumen baru yang sama dan kosong, sehingga keduanya tidak perlu diisi data awal.  
Dengan tiga editor atau lebih, kirim batch dari setiap editor ke semua editor lainnya: editor tidak pernah meneruskan apa yang diterimanya.

## Mengisi data awal kolaborator {#seeding-a-collaborator}

Shared store meneruskan perubahan saat perubahan itu dibuat dan tidak pernah memberikan dokumen dalam keadaannya saat ini kepada editor yang bergabung, sehingga editor yang bergabung ke sesi yang sudah berjalan harus diberi dokumen terlebih dahulu.  
Sejak `4.0.0`, isi data awalnya dengan [`runtimeValue`](../erd-editor-element.md#runtimevalue) dari editor yang sudah berada di sesi, bukan dengan `value` atau file yang disimpan.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Nilai runtime masih memuat apa yang telah dihapus sejak dokumen dibuka, sehingga saat editor lain kemudian membatalkan sebuah penghapusan, editor yang bergabung mengembalikan tabel itu beserta nama dan kolomnya.  
[`value`](../erd-editor-element.md#value) adalah bentuk yang tersimpan di file, tanpa entitas yang dihapus, sehingga editor yang bergabung dan diisi data awal darinya, atau dari file, justru akan mengembalikan tabel kosong tanpa nama.  
Sejak `4.2.0`, hal yang sama berlaku untuk kata, istilah, atau domain yang dihapus dari lembar di tab [Kamus](../../guide/guides/dictionary.md): saat editor lain membatalkan penghapusannya, editor yang bergabung dan diisi data awal dari `runtimeValue` mencantumkan baris itu kembali secara utuh, sedangkan editor yang diisi dari `value` mencantumkan baris kosong, yang kemudian tidak disertakan oleh `value` miliknya sendiri.  
Tetap tulis `value` ke penyimpanan: `runtimeValue` hanya untuk mengisi data awal editor lain, tampilan kedua, atau [replicationStore](./remote-storage.md).  
Editor di VS Code, Obsidian, IDE JetBrains, dan aplikasi web mengisi data awal tampilan kedua dari dokumen yang terbuka dengan cara ini.

`setInitialValue` tidak diteruskan, sehingga mengisi data awal editor yang bergabung tidak mengubah apa pun di editor lain.  
Sejak `4.0.0`, metode ini juga membuang register kolaborasi editor, yang menentukan hasil perubahan serentak. Jika shared store editor itu sudah pernah memiliki subscriber, store meminta register milik editor lain lagi, seperti pada [subscribe](#subscribe) pertamanya, sehingga editor yang dimuat ulang di tengah sesi menentukan hasil perubahan dengan cara yang sama seperti editor lain.  
Menetapkan `value` mempertahankan register tersebut, tetapi tidak seperti `setInitialValue`, penetapan ini diteruskan: begitu editor memiliki shared store, setiap editor di sesi memuat dokumen yang ditetapkan, jadi jangan pernah mengisi data awal editor yang bergabung dengan cara itu.

## Mencampur rilis {#mixing-releases}

Editor hanya menerapkan tipe aksi yang dikenal rilisnya sendiri, sehingga dalam sesi yang mencampur rilis, editor yang lebih lama melewatkan apa pun yang dibawa oleh tipe yang lebih baru.

Sejak `3.10.0`, perubahan pada [ON DELETE atau ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) sebuah hubungan dibawa oleh salah satu dari dua tipe aksi baru, `relationship.changeOnDelete` dan `relationship.changeOnUpdate`, dan `relationship.add` dapat membawa keduanya. Relai yang meneruskan aksi apa adanya tidak memerlukan apa pun yang baru untuk keduanya.  
Editor rilis sebelum `3.10.0` mengabaikan tipe aksi dan field tersebut: editor itu tidak pernah mengetahui ON DELETE atau ON UPDATE sebuah hubungan, dan dokumen yang disimpan darinya tidak memiliki keduanya. Hubungan yang ditambahkan editor yang lebih lama tiba tanpa keduanya, sehingga keduanya bernilai awal `Not set`.

Setiap perubahan lain yang dikirim editor `3.10.0` dibawa oleh tipe aksi yang sudah dikenal editor yang lebih lama.  
`Replace All` di [Temukan dan Ganti](../../guide/guides/find-and-replace.md#replacing) mengirim perubahannya sebagai satu batch berisi aksi penggantian nama, komentar, dan memo yang sama dengan yang dikirim oleh pengeditan manual. [Opsi tampilan](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` dan `Referential Actions` dibawa oleh aksi `settings.changeShow` yang sudah ada.

Sejak `4.0.0`, perubahan berikut dibawa oleh tipe aksi baru, dan relai yang meneruskan aksi apa adanya tidak memerlukan apa pun yang baru untuk perubahan tersebut:

- [grup tabel](../../guide/guides/table-groups.md) yang ditambahkan, dipindahkan, diubah ukurannya, diganti namanya, diubah warnanya, atau dihapus: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor`, dan `tableGroup.remove`; tabel yang masuk ke atau keluar dari grup: `table.changeGroup`;
- klik `Save` di [Petakan Kolom](../../guide/guides/relationship-editing.md#map-columns) pada hubungan yang sudah ada, yang menetapkan kedua daftar kolomnya sekaligus: `relationship.changeColumns`;
- [penguncian](../../guide/guides/settings.md#lock) yang diaktifkan atau dinonaktifkan: `settings.changeLockSettings`;
- perubahan pada skrip `Before tables` atau `After tables` di tab [Skema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Opsi tampilan `Table Groups` dan `Memos` dibawa oleh aksi `settings.changeShow` yang sudah ada.  
`settings.changeIgnoreSaveSettings`, yang dikirim sakelar `Save Scroll Information` dan `Save Zoom Information` sebelum penguncian menggantikannya, tidak lagi dikirim, dan `settings.changeRelationshipOptimization` sudah dihapus. Editor `4.0.0` yang menerima salah satunya tidak mengubah apa pun.

Editor rilis sebelum `4.0.0` mengabaikan tipe aksi baru: editor itu tidak pernah melihat grup tabel atau tabel mana yang ada di dalamnya, meskipun penyeretan grup tetap memindahkan tabel grup itu di editor tersebut, karena penyeretan juga mengirim `table.move` milik tabel-tabelnya.  
Editor itu mempertahankan kolom lama sebuah hubungan setelah klik `Save` di Petakan Kolom, dan saat sebuah kolom dari pemetaan lama itu dihapus di editor tersebut, hubungan itu hilang di setiap editor. Editor itu tidak memiliki penguncian maupun skrip.  
Dokumen yang disimpan darinya tidak memiliki satu pun dari semua ini, dan editor `4.0.0` membukanya dengan setiap penguncian aktif.  
Pastikan setiap editor dalam sesi, dan setiap [replicationStore](./remote-storage.md#dispatch-dispatchsync) yang menyimpan dokumennya, menggunakan `4.0.0` atau yang lebih baru.

Editor `4.1.0` tidak mengirim tipe aksi baru, sehingga editor dan replika `4.0.0` dan `4.1.0` berbagi sesi tanpa ada yang terlewat.  
[Temukan dan Ganti](../../guide/guides/find-and-replace.md#replacing) di editor itu juga mencari nama indeks dan nama grup tabel, dan `Replace` serta `Replace All` mengganti namanya melalui aksi `index.changeName` dan `tableGroup.changeName` yang sudah diterapkan editor `4.0.0`.

Sejak `4.2.0`, perubahan berikut dibawa oleh tipe aksi baru, dan relai yang meneruskan aksi apa adanya tidak memerlukan apa pun yang baru untuk itu:

- [nama logis](../../guide/guides/logical-names.md) tabel atau kolom: `table.changeLogicalName` dan `column.changeLogicalName`; apakah namanya [dihasilkan dari kamus](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` dan `column.changeNameDerived`;
- kolom yang ditautkan ke [domain](../../guide/guides/dictionary.md#domains-and-data-types) atau dilepas tautannya: `column.changeDomain`;
- kata, istilah, atau domain yang ditambahkan, diubah (termasuk posisinya di lembar, seperti yang ditetapkan pengurutan), atau dihapus di tab [Kamus](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update`, dan `dictionary.remove`;
- penggantian [Tampilan Nama](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Penguncian `Name View` dibawa oleh aksi `settings.changeLockSettings` yang sudah ada, opsi tampilan `Domain` oleh `settings.changeShow`, dan pemindahan `Logical Name` atau `Domain` di [Urutan kolom](../../guide/guides/settings.md#adjusting-column-order) oleh `settings.changeColumnOrder`.  
`editor.clear` dan `editor.loadJson` dari impor Skema SQL, GraphQL, DBML, atau AML melalui `Import` membawa `keepDictionaries: true`, yang mempertahankan kata, istilah, dan domain di setiap editor. Begitu pula aksi tersebut dari panggilan [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML`, atau `setSchemaAML` yang mengganti.  
Nama fisik yang dihasilkan kamus dibawa oleh `table.changeName` atau `column.changeName`, dan tipe data yang diberikan domain kepada kolomnya oleh `column.changeDataType`, yaitu aksi yang dikirim oleh pengeditan manual.

Editor dari sebelum `4.2.0` mengabaikan tipe aksi baru: editor itu tidak memiliki nama logis, tautan domain, kamus, maupun Tampilan Nama. Penguncian atau pembukaan kunci `Name View` tidak mengubah apa pun di sana, begitu pula pemindahan `Logical Name` atau `Domain` di Urutan kolom, atau pemindahan kolom lain ke posisi salah satunya. Begitu pula penguncian `Canvas Type` yang diaktifkan oleh editor yang membuka tab Pengaturan dari tab Kamus: editor lama tidak mengenal tab itu, sehingga membiarkan `Canvas Type` tidak terkunci. Editor lama tetap menampilkan nama fisik yang dihasilkan kamus dan tipe data yang diberikan domain.  
Perubahan yang dibuatnya sendiri tidak mengenal nama logis, domain, maupun kamus, dengan dampak berikut pada editor yang lebih baru:

- Tabel atau kolom yang diganti namanya secara manual di editor itu tetap memiliki nama yang ditandai sebagai dihasilkan, sehingga nama logis yang kemudian ditulis untuknya di editor yang lebih baru dapat menghasilkan nama lagi, menimpa nama yang diketik di editor lama.
- Tipe data yang diberikannya kepada kolom yang tertaut ke domain membiarkan tautan itu, sehingga lembar `Checks` mencantumkan `Domain type mismatch` dan perubahan tipe domain berikutnya memberikan tipe domain itu lagi kepada kolom tersebut.
- Kolom kunci asing dari hubungan yang ditambahkannya tidak mendapatkan nama logis maupun domain dari kuncinya.
- Tabel yang ditempel atau diduplikasinya tiba tanpa nama logis maupun tautan domain.
- Impor Skema SQL, GraphQL, DBML, atau AML di editor itu tidak mengirim `keepDictionaries`, sehingga mengosongkan kata, istilah, dan domain di setiap editor.
- Pembatalan pemuatan, impor, atau `clear()` oleh editor itu memuat salinan dokumennya sendiri di setiap editor, dan salinan itu tidak memiliki nama logis, tautan domain, maupun kamus.
- Salinan itu, dan dokumen yang dimuat oleh impor Skema SQL, GraphQL, DBML, atau AML di editor itu, juga mengembalikan penguncian `Name View` di setiap editor ke keadaan sebagaimana didapati editor lama tersebut. Setiap editor kemudian menyimpan `Physical Names` sebagai Tampilan Nama, dan juga menampilkannya jika penguncian nonaktif.

Dokumen yang disimpan dari editor itu tidak memiliki nama logis, tautan domain, kamus, maupun Tampilan Nama, sehingga editor `4.2.0` membukanya dalam tampilan `Physical Names`. Editor lama memang menyimpan penguncian `Name View` sebagaimana didapatinya, sehingga dokumen yang tidak dikunci di editor `4.2.0` tetap tidak terkunci.  
Pastikan setiap editor dalam sesi, dan setiap [replicationStore](./remote-storage.md#dispatch-dispatchsync) yang menyimpan dokumennya, menggunakan `4.2.0` atau yang lebih baru.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Mengatur nama panggilan yang ditampilkan di samping kursor mouse pengguna ini di editor lain.  
Pengguna lain melihat `user` saat nama panggilan tidak ada atau kosong.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Menyiarkan kursor mouse pengguna ini ke editor lain. Nilai defaultnya `true`.  
Kursor yang dikirim pengguna lain selalu ditampilkan di kanvas ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Menyiarkan apa yang sedang dikerjakan pengguna ini. Nilai defaultnya `true`.  
Tabel dan sel yang Anda fokuskan, tabel, memo, dan grup tabel yang Anda pilih, serta kotak yang Anda seret di kanvas dikirim ke editor lain dan digambar di sana.  
Setiap pengguna mendapat warnanya sendiri agar Anda dapat membedakan mereka: garis tepi pada tabel yang difokuskan, garis bawah pada sel yang difokuskan, cincin di sekeliling tabel, memo, dan grup tabel yang dipilih, serta persegi panjang putus-putus untuk kotak seret.  
Sejak `4.2.0`, setiap pengguna dapat melihat [Tampilan Nama](../../guide/guides/logical-names.md#collaborators) yang berbeda selama penguncian Tampilan Nama aktif, atau setelah editor hanya baca mengganti tampilannya sendiri. Sel terfokus yang tidak ditampilkan oleh tampilan Anda diberi garis bawah pada sel yang ditampilkan sebagai penggantinya: nama dan nama logis saling menggantikan, seperti halnya tipe data dan domain.  
Kehadiran yang datang dari pengguna lain selalu digambar di kanvas Anda, baik opsi ini aktif maupun tidak.  
Di mode Alur pada tab Visualisasi, fokus dan pilihan pengguna lain digambar pada kartu tabel, tetapi kotak seret mereka tidak. Tabel yang Anda pilih di sana tetap dikirim; kotak yang Anda seret di sana tidak.

```js
editor.getSharedStore({ focusTracker: false });
```

Nonaktifkan kedua pelacak untuk menggunakan shared store sebagai relai biasa yang tidak memublikasikan kehadirannya sendiri.  
Kehadiran yang dikirim editor lain tetap diterima dan digambar.  
Inilah yang dilakukan editor di VS Code, Obsidian, IDE JetBrains, dan Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Kursor, fokus, pilihan, dan kotak seret dibawa oleh aliran yang sama dengan perubahan dokumen, tetapi semuanya bersifat sementara.  
Semuanya tidak pernah masuk ke dokumen, riwayat pembatalan, atau `editor.value`, sehingga transport bebas membuangnya dan replicationStore mengabaikannya.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Kedua metode ini mengatur status koneksi saat ini.  
Selama koneksi terputus, perubahan ditampung dalam buffer secara internal.  
Perubahan yang ditampung dalam buffer dipancarkan ke subscriber setelah transmisi kembali memungkinkan.  
Status defaultnya terhubung (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Menerapkan perubahan dari instans editor lain ke instans editor saat ini.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Berlangganan perubahan di editor.  
Tidak ada yang keluar dari editor hingga ada setidaknya satu subscriber, dan perubahan yang dibuat sebelum itu ditampung dalam buffer.  
Subscribe pertama juga meminta register kolaborasi dari editor lain, yang menentukan hasil perubahan serentak, sehingga editor yang terlambat bergabung menentukan hasilnya dengan cara yang sama.  
Subscribe tidak membawa dokumen, jadi [isi data awal](#seeding-a-collaborator) editor yang terlambat bergabung terlebih dahulu.  
Sejak `4.0.0`, store meminta lagi setiap kali `setInitialValue` memuat dokumen ke editornya setelah subscribe pertama itu.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Mengirim batch aliran yang masih ditahan store ini sekarang juga, alih-alih setelah periode senyapnya.  
Sejak `3.9.2`, metode ini berfungsi pada store dari `getSharedStore`; di `3.9.1`, metode ini ada pada tipe tetapi tidak melakukan apa pun.  
Memindahkan tabel, memo, atau grup tabel, mengubah warnanya, mengubah ukuran memo, serta menggulir atau melakukan zoom pada area pandang masing-masing tiba sebagai aliran perubahan kecil. Mengubah ukuran grup tabel tidak demikian: perubahan itu dikirim sekali, saat penyeretan berakhir.  
Store mengumpulkan setiap aliran menjadi satu batch dan menahannya hingga aliran itu senyap selama 200ms. Store melakukannya dalam dua tahap, sehingga batch keluar sekitar 400ms setelah perubahan terakhir.  
Panggilan metode ini mengakhiri penantian itu di kedua tahap. Selama store terhubung, subscriber menerima batch sebelum panggilan itu selesai. Panggilan saat tidak ada yang ditahan tidak mengirim apa pun.  
`destroy`, baik milik store maupun milik editor, membuang batch yang masih ditahan, jadi panggil metode ini terlebih dahulu saat Anda melepaskan store dan editor lain harus tetap menerima perubahan terakhir, seperti saat tab ditutup.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Menghancurkan instans sharedStore sepenuhnya.  
Editor itu sendiri tidak disentuh, sehingga dokumen tetap dapat diedit setelah sesi ditinggalkan.  
Pelacak mouse dan fokus berhenti setelah sharedStore terakhir yang diberikan editor dihancurkan.  
Batch aliran yang masih ditahan store ikut dibuang; panggil [flushStreamBuffers](#flushstreambuffers) terlebih dahulu untuk mengirimnya.

```js
sharedStore.destroy();
```
