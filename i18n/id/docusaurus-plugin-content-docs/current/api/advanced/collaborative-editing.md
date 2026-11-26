---
sidebar_position: 1
description: Meneruskan perubahan editor antarinstans dengan getSharedStore, mengisi data awal editor yang bergabung dari runtimeValue dan register store, menentukan hasil edit yang dibuat pada saat yang sama, dan menampilkan kursor, fokus, pilihan, serta kotak seret setiap kolaborator.
---

# Pengeditan kolaboratif

`getSharedStore()` menjadikan editor sebuah simpul dalam sesi kolaboratif.  
Metode ini memancarkan setiap perubahan sebagai aliran aksi dan menerapkan aksi yang dikirim balik oleh editor lain — Anda yang menyediakan transport di antara editor (WebSocket, WebRTC, atau apa pun yang dapat membawa JSON).  
Metode ini adalah salah satu metode [ErdEditorElement](../erd-editor-element.md), dan berpasangan dengan [Penyimpanan jarak jauh](./remote-storage.md) saat perubahan yang diteruskan juga harus disimpan.  
Sejak `5.1.0`, untuk membagikan diagram melalui dokumen Yjs dan provider mana pun alih-alih menyiapkan transport sendiri, ikat editor dengan `@dineug/erd-editor-yjs`; lihat [Yjs](./yjs.md).

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` tidak mengekspor satu pun tipe ini dengan namanya. Kode TypeScript menjangkaunya melalui `ErdEditorElement`, seperti pada `ReturnType<ErdEditorElement['getSharedStore']>`.

Aksi adalah objek biasa yang dapat diserialisasi dan menggambarkan satu perubahan pada dokumen, sehingga aksi tetap utuh melewati `JSON.stringify` dalam perjalanannya ke transport.  
Aksi tiba dalam batch: `subscribe` memberikan sebuah array kepada Anda, dan array itu merupakan satu unit — teruskan array itu secara utuh dan kirimkan secara utuh di sisi seberang.  
Perlakukan aksi sebagai data opak dan teruskan apa adanya alih-alih membaca atau menulis ulangnya, karena data pencatatan yang dibawanya, seperti [versinya](#concurrent-edits), itulah yang menjaga editor tetap sinkron.

Sebagian dari apa yang dilakukan sebuah editor tetap berada di editor itu.  
Membawa tabel, memo, atau grup tabel ke depan, seperti yang terjadi saat memilihnya, tidak dikirim.  
Pilihan `Statements`, `Header`, `Write logical names into empty comments` (sejak `4.2.0`), dan `Tables` di tab [Skema SQL](../../guide/guides/schema-sql.md) juga tidak dikirim, karena pilihan itu milik jendela tempat pilihan tersebut dibuat.  
Sejak `4.1.0`, [Penjelajah](../../guide/guides/explorer.md) juga tetap berada di editornya: apakah panel itu terbuka, lebarnya, baris yang diciutkan, baris tempat fokus keyboard berada, posisi guliran pohonnya, serta pencarian dan opsinya tidak dikirim.  
[Sorotan](../../guide/guides/relationship-editing.md#reading-a-connector) yang diberikan pada konektor hubungan saat menuju sebuah kunci asing juga tidak dikirim.  
Sejak `4.2.0`, tab [Kamus](../../guide/guides/dictionary.md) juga tetap berada di editornya: lembar mana yang ditampilkan, serta pencarian, pilihan, guliran, dan lebar kolom setiap lembar tidak dikirim. Perubahan, pengurutan, dan impor CSV di tab itu dikirim.  
Guliran, zoom, atau perpindahan tab dikirim, tetapi tidak pernah memindahkan area pandang atau tab pengguna lain. Hal ini termasuk guliran yang dibuat oleh lompatan dari Penjelajah, perpindahan ke tab ERD saat Penjelajah dibuka dari tab lain, serta perpindahan tab dan guliran yang dibuat oleh lompatan dari lembar [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) di tab Kamus ke tabel atau kolom. Lompatan dari lembar itu ke kata, istilah, atau domain tetap berada di tab Kamus, sehingga tidak ada bagiannya yang dikirim.

Sejak `4.2.0`, penggantian [Tampilan Nama](../../guide/guides/logical-names.md#switching-the-view) juga dikirim, dan [penguncian](../../guide/guides/settings.md#lock) Tampilan Nama menentukan apa yang dilakukan editor lain terhadap penggantian itu. Penguncian `Name View` aktif di diagram baru dan di dokumen apa pun dari sebelum `4.2.0`.  
Selama penguncian itu aktif, penggantian hanya tampil di editor yang melakukannya: penggantian tetap dikirim, tetapi setiap editor lain dan setiap replika membuangnya, sehingga setiap pengguna dapat melihat tampilan yang berbeda sementara `value` mempertahankan tampilan yang terkunci.  
Selama penguncian itu nonaktif, penggantian yang dilakukan di editor yang dapat mengedit mengubah Tampilan Nama di setiap editor dan replika, dengan penggantian terakhir yang berlaku, dan semuanya menyimpannya.  
Penggantian yang dilakukan sendiri oleh editor hanya baca selalu tetap berada di editor itu, dan editor tersebut tetap mengikuti penggantian bersama dari editor lain.

Sejak `5.1.0`, perubahan bahasa [Generator Kode](../../guide/guides/code-generator.md), konvensi penamaan tabel, konvensi penamaan kolom, atau tipe tanda kutip mengikuti penguncian masing-masing (`Language`, `Table Name Case`, `Column Name Case`, atau `Bracket Type`) dengan cara yang sama, dengan satu perbedaan: selama penguncian aktif, perubahan itu tidak dikirim sama sekali.  
Perubahan itu hanya tampil di editor yang membuatnya, yang tab Generator Kode dan Skema SQL-nya mengikutinya, dan tidak ada editor atau replika lain yang melihatnya. `value` dan `runtimeValue` mempertahankan nilai yang terkunci, sehingga editor yang bergabung dan diisi data awal dari editor mana pun juga tidak melihatnya, dan setiap pengguna dapat melihat bahasa, konvensi penamaan, atau tipe tanda kutip yang berbeda selama penguncian aktif.  
Selama penguncian nonaktif, perubahan yang dilakukan di editor yang dapat mengedit dikirim dengan tanda dibagikan (`shared: true` di payload-nya). Perubahan itu mengubah pengaturan di setiap editor dan replika, dengan perubahan terakhir yang berlaku, dan semuanya menyimpannya. Editor atau replika `5.1.0` menerapkan perubahan bertanda apa pun penguncian miliknya, sehingga perubahan yang dibuat tepat setelah pembukaan kunci mendarat di mana-mana, bahkan di tempat perubahan itu tiba sebelum pembukaan kunci.  
Sebelum `5.1.0`, perubahan seperti itu mencapai setiap editor dan replika baik penguncian miliknya aktif maupun tidak, sementara file mempertahankan nilai yang terkunci.

Sejak `5.0.0`, editor [hanya baca](../erd-editor-element.md#readonly) tidak mengirim perubahan sama sekali. Guliran, zoom, tab, Tampilan Nama, database, bahasa Generator Kode, konvensi penamaan, tipe tanda kutip, dan baris `View Option` yang diubah pembacanya tetap berada di layarnya, apa pun penguncian miliknya; sebelum `5.0.0`, guliran, zoom, perpindahan tab, database, dan pengaturan kodenya dikirim seperti pada editor yang dapat diedit.  
Store-nya tetap mengirim apa yang dikirim pelacaknya tentang kursor, fokus, pilihan, dan kotak seret pembaca, menjawab register yang diminta editor yang baru bergabung, dan menerapkan setiap perubahan yang dikirim editor lain. Perubahan database, pengaturan Generator Kode, atau baris `View Option` mencapai dokumennya, dan layarnya juga kecuali pembacanya telah mengubah pengaturan itu di sana, sedangkan penggantian Tampilan Nama bersama tampil di layarnya dalam kedua kasus. Sejak `5.1.0`, editor itu menerima pengaturan Generator Kode hanya saat pengaturan itu diubah dengan penguncian nonaktif atau dibawa oleh pembukaan kunci.  
Saat editor menjadi hanya baca, editor lebih dulu mengirim apa yang masih ditahan store dari sebuah seretan atau guliran, seperti yang dilakukan [flushStreamBuffers](#flushstreambuffers), sehingga editor lain mempertahankan bagian terakhirnya.

[Penguncian](../../guide/guides/settings.md#lock) dibagikan: penguncian atau pembukaan kunci terakhir pada sebuah pengaturan berlaku di setiap editor, dan penguncian membawa nilai dari editor yang mengaktifkannya, sehingga setiap editor dan replika menyimpan nilai yang sama.  
Karena itu, penguncian `Viewport` menyimpan area pandang editor yang mengaktifkannya, dan penguncian `Canvas Type` menyimpan tab terakhir yang dibuka editor tersebut sebelum tab Pengaturan, tempat penguncian diaktifkan.  
Menonaktifkan penguncian `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`, atau, sejak `4.2.0`, `Name View` juga menetapkan pengaturan itu di setiap editor ke nilai yang ditampilkan di editor yang menonaktifkannya, termasuk perubahannya sendiri yang dibuat saat penguncian aktif, sehingga semua editor tetap menyimpan satu nilai. Menonaktifkan `Viewport` atau `Canvas Type` tidak memindahkan area pandang atau tab siapa pun.

Perubahan pada skrip `Before tables` atau `After tables` dikirim secara utuh saat kotaknya kehilangan fokus. Hasil kedua skrip ditentukan secara terpisah, sehingga perubahan seorang kolaborator pada salah satunya tidak pernah menimpa yang lain.

Apa pun yang dilakukan di [mode Alur](../../guide/guides/visualization.md#flow-never-edits-the-document) pada tab Visualisasi bukanlah perubahan dokumen, sehingga editor yang berada di Alur tidak mengirim perubahan apa pun ke editor lain, dan perubahan yang dikirim editor lain tetap diterapkan selama editor itu berada di sana.  
Ada dua pengecualian. Meninggalkan Alur menuju tab lain merupakan perpindahan tab, yang dikirim seperti perpindahan tab lainnya. Sejak `4.2.0`, pilihan di daftar Tampilan Nama pada bilah Alur merupakan penggantian Tampilan Nama, yang dikirim dan diterapkan seperti penggantian yang dilakukan di kanvas.  
`Previous table`, `Next table`, serta tombol Batalkan dan Ulangi, yang [melangkah mundur dan maju](../../guide/guides/visualization.md#previous-table-and-next-table) di Alur, tidak dikirim.  
Tombol tautan eksternal pada kartu, hasil [Pencarian Cepat](../../guide/guides/quick-search.md#searching-the-diagram) yang dipilih setelah `#`, `@`, atau `:`, serta membuka [Penjelajah](../../guide/guides/explorer.md#opening-and-closing) semuanya meninggalkan Alur menuju tab ERD. Guliran yang dibuat tombol kartu atau hasil Pencarian Cepat di sana juga dikirim.

## Dua editor dalam satu halaman {#two-editors-on-one-page}

Sambungan dari subscribe ke dispatch di sini menggantikan jaringan, sehingga Anda dapat melihat bentuk sebuah sesi tanpa transport yang menghalangi.

```js
import '@dineug/erd-editor/erd-editor.js';

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
Room yang diikat dengan [`@dineug/erd-editor-yjs`](./yjs.md) menyimpan dokumennya sendiri setelah sebuah klien [mengisi data awalnya](./yjs.md#seeding-a-room), sehingga setiap editor yang terikat padanya membuka dokumen itu tanpa `runtimeValue` yang diserahkan.

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
Sejak `4.0.0`, metode ini juga membuang register kolaborasi editor, yang menentukan hasil [pengeditan serentak](#concurrent-edits). Jika shared store editor itu sudah pernah memiliki subscriber, store meminta register milik editor lain lagi, seperti pada [subscribe](#subscribe) pertamanya, sehingga editor yang dimuat ulang di tengah sesi menentukan hasil perubahan dengan cara yang sama seperti editor lain.  
Menetapkan `value` mempertahankan register tersebut, tetapi tidak seperti `setInitialValue`, penetapan ini diteruskan: begitu editor memiliki shared store, setiap editor di sesi memuat dokumen yang ditetapkan, jadi jangan pernah mengisi data awal editor yang bergabung dengan cara itu.

Baik `value` maupun `runtimeValue` tidak memuat register atau versi yang telah dicapai jam editor, sehingga editor yang bergabung dan diisi data awal dari `runtimeValue` saja mengambilnya dari jawaban yang dikirim editor di sesi atas subscribe pertamanya.  
Hingga jawaban itu tiba, edit yang dibuat editor yang bergabung dapat membawa versi yang lebih rendah daripada yang dipegang editor lain, sehingga mereka menolaknya selama edit itu tetap berada di editor yang bergabung, dan penulisan lebih lama yang masih dalam perjalanan mendarat menimpa yang lebih baru yang dimuat data awal. Jika tidak ada editor yang berjalan yang menjawab, seperti saat server atau penyimpanan dokumen menyimpan dokumen sesi, editor yang bergabung tidak pernah mendapatkannya.  
Sejak `5.1.0`, serahkan register dan versi itu bersama nilai. Di editor dalam sesi, panggil [`flushStreamBuffers()`](#flushstreambuffers), agar seretan atau perubahan warna yang masih ditahannya keluar lebih dulu, lalu baca `runtimeValue` serta [`getLWW()`](#getlww) dan [`getVersion()`](#getversion) store-nya pada saat yang sama. Editor yang bergabung memuat nilai dengan `setInitialValue`, lalu mengambil sisanya dengan [`mergeLWW`](#mergelww) milik store-nya sendiri, dalam urutan itu, karena setiap `setInitialValue` membuang register. Edit berikutnya kemudian membawa versi di atas setiap versi yang dipegang data awal, sehingga mendarat tanpa jawaban yang perlu ditunggu. Pada store yang sudah ada, [`reseed`](#reseed) melakukan keduanya dalam satu panggilan.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

Data awal yang disimpan dengan cara ini untuk membuka editor yang bergabung kemudian memuat ketiganya sekaligus. Itu bukan file: `value` tetap yang harus ditulis ke penyimpanan.  
[replicationStore](./remote-storage.md#runtimevalue-getter) tidak menyerahkan register, sehingga editor yang bergabung dan diisi data awal dari `runtimeValue`-nya tetap mengambilnya dari jawaban editor.

## Pengeditan pada saat yang sama {#concurrent-edits}

Setiap editor dan replika menyimpan, untuk setiap nama dan hampir setiap field lain, versi penulisan yang menetapkannya: inilah register kolaborasinya. Penulisan hanya mendarat jika versinya tidak di bawah versi yang dipegang, sehingga editor yang mendengar perubahan yang sama dalam urutan berbeda berakhir pada dokumen yang sama.  
Sejak `5.1.0`, setiap versi membawa, di bawah penghitungnya, sebuah slot milik editor yang menulis, yang diambil dari id-nya. Karena itu versi bertambah dalam langkah 4.194.304 dan melampaui integer 32-bit begitu penghitung mencapai 512. `JSON.stringify` dan `JSON.parse` membawanya utuh, tetapi relai atau store yang mengurainya dalam bahasa lain harus menyimpannya sebagai angka 64-bit, tidak pernah sebagai integer 32-bit.

Sejak `5.1.0`, dua editor yang mengubah satu nama atau field pada saat yang sama, selain pengecualian di bawah, berakhir dengan nilai yang sama di setiap editor dan replika: menulis pada satu penghitung, keduanya menstempel dua versi berbeda, dan versi yang lebih besar menang di mana-mana. Sebelum `5.1.0`, keduanya dapat menstempel satu versi yang sama, dan setiap editor mempertahankan yang terakhir didengarnya, sehingga mereka dapat berakhir berbeda. Dua editor berbagi slot dengan peluang 1 dari 4.194.304 per pasangan, dan saat itu keduanya seri seperti sebelumnya.

Sejak `5.1.0`, posisi tabel, posisi dan ukuran memo atau grup tabel, serta titik asal dan tingkat zoom area pandang diberi versi dengan cara yang sama, dan apa yang menggerakkannya keluar sebagai titik akhirnya:

- seretan sebagai satu `table.moveTo`, `memo.moveTo`, atau `tableGroup.moveTo` per entitas yang dipindahkan, dalam satu batch, sehingga seretan grup membawa titik tabel-tabelnya, dan sejak `5.1.1` titik memonya, bersama titik grup;
- pembatalan atau pengulangan sebuah seretan sebagai titik tempat aksi itu menempatkan setiap entitas;
- geseran sebagai `settings.scrollTo`, dan zoom sebagai `settings.changeZoomLevel`;
- perubahan ukuran memo atau grup tabel sebagai posisi dan ukurannya bersama.

Jadi dua pengguna yang memindahkan, atau memindahkan dan mengubah ukuran, satu tabel, memo, atau grup tabel pada saat yang sama berakhir dengan entitas itu di satu titik dan satu ukuran di setiap editor dan replika. Titik itu jatuh ke penulisan dengan versi yang lebih besar, kedua sumbu bersama. Pemindahan tidak menulis ukuran, sehingga perubahan ukuran mempertahankan ukurannya bahkan saat pemindahan yang dibuat bersamaan mengambil titiknya.  
Sebelum `5.1.0`, seretan keluar sebagai jarak yang ditempuh, sehingga dua seretan satu tabel dijumlahkan, dan pemindahan serta perubahan ukuran satu memo atau grup tabel yang dibuat bersamaan dapat berakhir berbeda.  
Seretan di bawah 20 px, yang tidak meninggalkan entri pembatalan, dikirim seperti seretan lain, sehingga sebagai titik, seretan itu dapat menimpa seretan entitas yang sama oleh pengguna lain pada saat yang sama. Batch seretan, geseran, atau zoom yang dikirim dua kali oleh transport tidak memindahkan apa pun dua kali.

Perubahan warna merupakan satu pengecualian. Perubahan ini keluar tanpa versi, dan setiap editor dan replika menstempelnya dengan versinya sendiri serta mempertahankan warna yang terakhir didengarnya, sehingga dua pengguna yang mengubah warna satu tabel, memo, atau grup tabel pada saat yang sama dapat berakhir dengan warna berbeda.  
Beberapa perubahan sama sekali tidak diberi versi, sehingga setiap editor dan replika menerapkannya sesuai urutan yang didengarnya, dan dua perubahan yang dibuat pada saat yang sama juga dapat berakhir berbeda: kolom yang dipindahkan dalam tabel atau indeksnya (`column.move`, `indexColumn.move`), serta perubahan pada [database](../../guide/guides/table-related-functions.md#databases), baris [`View Option`](../../guide/guides/table-related-functions.md#table-view-options), atau `Relationship DataType Sync`, `Maximum comment width`, atau `Column Order` di tab [Pengaturan](../../guide/guides/settings.md).  
Entitas yang ditambahkan dua pengguna pada saat yang sama, seperti dua tabel atau dua kolom satu tabel, juga dapat berada dalam urutan berbeda di setiap editor dan replika, dan `value` masing-masing menyimpan urutannya sendiri.

Semua ini berlaku di antara editor dan replika `5.1.0` atau yang lebih baru; [Mencampur rilis](#mixing-releases) menjelaskan apa yang diubah oleh yang lebih lama.

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

Editor rilis sebelum `4.0.0` mengabaikan tipe aksi baru: editor itu tidak pernah melihat grup tabel atau tabel mana yang ada di dalamnya, meskipun penyeretan grup tetap memindahkan tabel grup itu di editor tersebut, karena penyeretan juga mengirim pemindahan setiap tabel itu.  
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

Editor `5.1.0` tidak mengirim tipe aksi baru, sehingga editor dan replika dari sebelum `5.1.0` tetap berbagi sesi dengannya, dan relai yang meneruskan aksi apa adanya tidak memerlukan apa pun yang baru. Namun, apa yang dijelaskan [Pengeditan pada saat yang sama](#concurrent-edits) hanya berlaku di antara editor dan replika `5.1.0`:

- Seretan editor `5.1.0` dibawa sebagai titik pada `table.moveTo`, `memo.moveTo`, dan `tableGroup.moveTo`, yang sudah diterapkan editor lama, dan geseran serta zoomnya sebagai titik pada `settings.scrollTo` dan `settings.changeZoomLevel`, yang, seperti setiap geseran dan zoom, tidak diterapkan editor lain dan hanya diambil replika. Editor lama menerapkan setiap titik seretan menurut urutan tibanya, di luar register mana pun, dan replika lama melakukan hal yang sama dengan setiap titik seretan, geseran, atau zoom, sehingga dua titik yang dikirim bersamaan untuk satu entitas, atau untuk area pandang, dapat berakhir berbeda di sana.
- Seretan editor lama tetap dibawa sebagai jarak yang ditempuh, yang dijumlahkan setiap editor dan replika di luar register-nya, dan geseran atau zoomnya juga sebagai jarak, yang dijumlahkan setiap replika dengan cara yang sama. Jarak dan titik pada satu entitas yang dibuat bersamaan dapat berakhir berbeda pada editor dan replika yang mendengarnya dalam urutan berbeda, dan jarak yang dikirim dua kali oleh transport dijumlahkan dua kali.
- Di luar pengecualian yang disebut [Pengeditan pada saat yang sama](#concurrent-edits), penulisan nama atau field oleh editor `5.1.0` yang dibuat pada saat yang sama dengan penulisan editor lama hampir selalu menang, dengan jawaban yang sama di setiap editor dan replika. Dua editor lama masih dapat berakhir berbeda atas satu field yang ditulis bersamaan.
- Editor `5.1.0` mengirim perubahan bahasa, konvensi penamaan, atau tipe tanda kutip Generator Kode hanya selama penguncian nonaktif, dengan tanda `shared: true`, yang diabaikan editor lama, yang menerapkan perubahan itu seperti sebelumnya. Editor lama tetap mengirim perubahan yang dibuatnya di bawah penguncian, tanpa tanda: editor atau replika `5.1.0` membuangnya selama pengaturan itu terkunci di sana, dan editor lama menerapkannya. Jadi di bawah penguncian, editor lama mengikuti pilihan satu sama lain sementara editor `5.1.0` mempertahankan pilihan mereka sendiri, dan file mempertahankan nilai yang terkunci dalam kedua kasus. Pembukaan kunci pada rilis mana pun membawa nilai pembuka kunci ke setiap editor dan replika.
- Pemuatan yang mengganti dokumen, seperti `value` yang ditetapkan, `clear()`, atau impor yang mengganti, mengakhiri hubungan yang sedang digambar di setiap editor `5.1.0`, baik yang membuatnya maupun setiap yang menerimanya. Editor lama mempertahankan penggambarannya tetap aktif melaluinya.

Pastikan setiap editor dalam sesi, dan setiap [replicationStore](./remote-storage.md#dispatch-dispatchsync) yang menyimpan dokumennya, menggunakan `5.1.0` atau yang lebih baru, agar edit yang dibuat pada saat yang sama berakhir sama di mana-mana, di luar pengecualian yang disebut [Pengeditan pada saat yang sama](#concurrent-edits); `4.2.0` atau yang lebih baru tetap yang mempertahankan nama logis dan kamus. [Server MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) sebelum `1.2.0` dihitung sebagai editor sebelum `5.1.0` di sini, dan editor sebelum `5.1.0` sama sekali tidak dapat diikat ke room [Yjs](./yjs.md).

Sejak `5.1.1`, memo yang bergabung ke atau meninggalkan [grup tabel](../../guide/guides/table-groups.md) dibawa oleh tipe aksi baru, `memo.changeGroup`, dan relay yang meneruskan aksi apa adanya tidak memerlukan apa pun yang baru untuknya. Aksi ini dikirim untuk memo yang dilepaskan ke dalam atau ke luar grup, grup baru yang digambar mengelilingi memo yang ditampilkan dan tidak berada di grup mana pun, `Group selected tables` dengan memo yang dipilih di samping tabel, `Remove from group` dengan memo di dalam pilihan, setiap memo dari grup yang dihapus, panggilan grup memo oleh agen pemrograman lewat [server MCP](../../mcp/tools.md#table-groups), serta pembatalan dan pengulangan masing-masing. Penambahan lewat `Import and Add` atau `setSchemaJSON` yang grupnya memuat memo juga mengirimkannya, begitu pula pengulangannya, sedangkan pembatalannya hanya menghapus memo-memo itu.

Editor atau replika dari sebelum `5.1.1` mengabaikan `memo.changeGroup`, dan penguraiannya membuang `groupId` setiap memo, sehingga tidak pernah melihat memo di dalam grup, meskipun seretan grup di editor `5.1.1` tetap memindahkan memo grup itu di sana, karena editor itu juga mengirim `memo.moveTo` untuk masing-masing memo. Edit-nya sendiri tidak mengetahui grup memo, dengan dampak berikut pada editor yang lebih baru:

- Memo yang diseretnya ke dalam kotak grup tetap berada di luar grup, dan memo anggota yang diseretnya ke luar kotak tetap berada di dalam grup, dengan kotak meregang untuk memuatnya.
- Seretan grupnya, seperti `Auto Layout`-nya, memindahkan grup dan tabelnya tetapi membiarkan memo grup itu di tempatnya, dan kotak meregang untuk memuat memo yang ditampilkan di sana.
- `Import and Add` di editor itu tidak memasukkan memo ke grup yang ditambahkannya.
- Grup yang dihapusnya membuat `groupId` setiap memonya tetap menunjuk grup itu: memo-memo itu terbaca tidak berada di grup mana pun, dan pembatalannya atas penghapusan itu mengembalikan memo-memo itu ke grup.
- Pembatalannya atas pemuatan, impor, atau `clear()` memuat salinan dokumennya sendiri di setiap editor, dan salinan itu tidak memiliki memo di grup mana pun.

Dokumen yang disimpan dari salah satunya tidak memiliki memo di grup mana pun, meskipun editor dari `4.0.0` ke atas tetap mempertahankan grup tempat tabelnya berada.  
Pastikan setiap editor dalam sesi, dan setiap [replicationStore](./remote-storage.md#dispatch-dispatchsync) yang menyimpan dokumennya, menggunakan `5.1.1` atau yang lebih baru agar memo tetap berada di grup tabelnya; `5.1.0` atau yang lebih baru tetap yang menentukan hasil edit yang dibuat pada saat yang sama. [Server MCP](../../mcp/installation.md#updating) sebelum `1.2.1` juga tidak melihat maupun mempertahankan grup tabel mana yang memuat sebuah memo.

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
Saat sebuah batch memuat permintaan register dari editor lain, seperti yang dikirim [subscribe](#subscribe) pertama editor yang bergabung, store menjawab melalui subscriber-nya dengan register dan versinya, kecuali jika store tidak memegang register.  
Sejak `5.1.0`, store lebih dulu mengirim setiap batch aliran yang masih ditahannya, seperti yang dilakukan [flushStreamBuffers](#flushstreambuffers), sehingga setiap versi yang dibawa jawabannya bertumpu pada penulisan yang sudah dikirim ke editor lain. Karena itu kedatangan editor yang bergabung membuat setiap editor di sesi langsung mengirim seretan, geseran, zoom, perubahan warna, atau perubahan ukuran memo yang masih ditahannya.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Berlangganan perubahan di editor.  
Tidak ada yang keluar dari editor hingga ada setidaknya satu subscriber, dan perubahan yang dibuat sebelum itu ditampung dalam buffer.  
Subscribe pertama juga meminta register kolaborasi dari editor lain, yang menentukan hasil [pengeditan serentak](#concurrent-edits), sehingga editor yang terlambat bergabung menentukan hasilnya dengan cara yang sama.  
Subscribe tidak membawa dokumen, jadi [isi data awal](#seeding-a-collaborator) editor yang terlambat bergabung terlebih dahulu; sejak `5.1.0`, data awal itu dapat membawa register juga.  
Sejak `4.0.0`, store meminta lagi setiap kali `setInitialValue`, atau sejak `5.1.0` [reseed](#reseed), memuat dokumen ke editornya setelah subscribe pertama itu.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Mengirim batch aliran yang masih ditahan store ini sekarang juga, alih-alih setelah periode senyapnya.  
Sejak `3.9.2`, metode ini berfungsi pada store dari `getSharedStore`; di `3.9.1`, metode ini ada pada tipe tetapi tidak melakukan apa pun.  
Memindahkan tabel, memo, atau grup tabel, mengubah warnanya, mengubah ukuran memo, serta menggulir atau melakukan zoom pada area pandang masing-masing dibuat sebagai aliran perubahan kecil. Mengubah ukuran grup tabel tidak demikian: perubahan itu dikirim sekali, saat penyeretan berakhir.  
Store mengumpulkan setiap aliran menjadi satu batch dan menahannya hingga aliran itu senyap selama 200ms, dalam dua tahap. Perubahan warna atau perubahan ukuran memo melewati kedua tahap, sehingga keluar sekitar 400ms setelah perubahan terakhir, seperti setiap aliran sebelum `5.1.0`. Sejak `5.1.0`, seretan, geseran, atau zoom keluar setelah tahap pertama, sekitar 200ms setelah langkah terakhirnya, sebagai titik akhirnya (lihat [Pengeditan pada saat yang sama](#concurrent-edits)).  
Panggilan metode ini mengakhiri penantian itu di kedua tahap. Selama store terhubung, subscriber menerima batch sebelum panggilan itu selesai. Panggilan saat tidak ada yang ditahan tidak mengirim apa pun.  
`destroy`, baik milik store maupun milik editor, membuang batch yang masih ditahan, jadi panggil metode ini terlebih dahulu saat Anda melepaskan store dan editor lain harus tetap menerima perubahan terakhir, seperti saat tab ditutup.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Sejak `5.1.0`, mengembalikan salinan register kolaborasi editor (lihat [Pengeditan pada saat yang sama](#concurrent-edits)).  
Salinan dibuat melalui JSON, sehingga berupa objek biasa yang siap untuk `JSON.stringify`, dan perubahan padanya tidak mengubah register store.  
Serahkan apa adanya ke [mergeLWW](#mergelww) atau [reseed](#reseed) store lain. Bentuknya milik editor sendiri, jadi jangan baca field apa pun darinya.  
Baca bersama [getVersion](#getversion) dan `runtimeValue` editor pada saat yang sama untuk [mengisi data awal editor yang bergabung](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Sejak `5.1.0`, memasukkan register yang diserahkan store lain melalui [getLWW](#getlww) ke register store ini, dengan mempertahankan versi yang lebih besar dari masing-masing, dan memasukkan `version` ke jam editor, yang mempertahankan yang lebih besar antara versinya sendiri dan yang diberikan.  
Metode ini tidak mengubah apa pun di dokumen: tidak satu byte pun dari `value` atau `runtimeValue`, tidak ada entri pembatalan, dan tidak ada event `change`. Metode ini hanya menaikkan versi yang harus dikalahkan penulisan berikutnya, sehingga penulisan yang lebih lama daripada register yang diberikan ditolak setelahnya, dan edit berikutnya dari editor membawa versi di atas `version`.  
Metode ini tidak mengirim dan tidak menjawab apa pun. Inilah yang didapat subscribe pertama editor yang bergabung dari jawaban editor lain, diambil langsung.  
Panggil setelah `setInitialValue`, jangan pernah sebelumnya: setiap `setInitialValue` dan setiap [reseed](#reseed) membuang register yang dipegang, dan bersamanya apa yang diambil `mergeLWW` sebelumnya.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Sejak `5.1.0`, mengembalikan versi tertinggi yang telah digabungkan jam editor: yang terbesar di antara versi perubahan yang dibuat atau diambilnya, permintaan register dan jawaban yang dipertukarkan saat editor bergabung, serta setiap `version` yang diberikan ke `mergeLWW` atau `reseed`.  
Kursor, fokus, pilihan, dan kotak seret, milik editor sendiri maupun editor lain, tidak menggesernya.  
Serahkan bersama [getLWW()](#getlww), yang dibaca pada saat yang sama, ke [mergeLWW](#mergelww) atau [reseed](#reseed) editor yang bergabung. Ini adalah [versi](#concurrent-edits) seperti yang dibawa aksinya.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Sejak `5.1.0`, langsung menghapus kursor, fokus, pilihan, dan kotak seret yang dikirim editor dengan id yang diberikan, beserta kedaluwarsa yang ditunggu masing-masing. Milik editor lain tetap ada.  
Id itu adalah `meta.editorId` yang dibawa setiap aksi yang dikirim shared store editor tersebut. Id yang tidak ada datanya di editor ini tidak mengubah apa pun.  
Panggil saat transport Anda mengetahui bahwa sebuah peer telah pergi. Jika tidak, apa yang dikirim peer itu tetap digambar hingga kedaluwarsa: kursornya 30 detik setelah yang terakhir diterima, fokus dan pilihannya 90 detik setelahnya, dan kotak seretnya 3 detik setelahnya.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Sejak `5.1.0`, membuka kembali dokumen sebuah sesi di editor, seperti saat bergabung kembali. Pengikatan [Yjs](./yjs.md) memanggilnya untuk membuka dokumen sebuah room saat terikat ke room yang sudah diisi data awalnya, dan lagi pada setiap penggabungan kembali, dengan mempertahankan layar setelah editor bergabung ke room.  
Metode ini memuat `value` seperti [setInitialValue](../erd-editor-element.md#setinitialvalue) dan mengambil `lww` serta `version` seperti [mergeLWW](#mergelww), sehingga store kemudian memegang tepat register yang diberikan, dan jamnya yang lebih besar antara versinya sendiri dan `version`. Metode ini juga mengosongkan riwayat pembatalan dan, tidak seperti `setInitialValue`, membuang pilihan dan fokus, karena keduanya mungkin menyebut apa yang tidak lagi dimuat nilai itu.  
Selain nama fisik yang dihasilkan dari nama logis seperti disebut di bawah, metode ini tidak membuat entri pembatalan, tidak memancarkan event `change`, dan tidak mengirim perubahan. Setelah store memiliki subscriber, metode ini mengirim permintaan register yang dikirim setiap pemuatan seperti itu, yang boleh dibuang oleh transport yang sudah menyerahkan register, dan, dengan [focusTracker](#focustracker) aktif, pilihan dan fokus yang telah dikosongkan.  
Seperti `setInitialValue`, metode ini berfungsi saat [readonly](../erd-editor-element.md#readonly) ditetapkan, membuang tampilan Alur, mengakhiri hubungan yang sedang digambar, dan menutup editor memo, nama grup tabel, dan sel, dengan mempertahankan atau membuang apa yang diketik di dalamnya dengan cara yang sama; nama yang dihasilkan sel nama logis yang sedang ditutup dari apa yang diketik pembacanya merupakan edit biasa: dikirim, dapat dibatalkan, dan dipancarkan sebagai event `change`.

Tanpa `keepScreen`, layar menampilkan apa yang dimuat nilai itu, seperti setelah `setInitialValue`. Dengan `keepScreen: true`, layar pembaca dikembalikan di atas dokumen yang dimuat, pada layar itu saja:

- posisi guliran dan tingkat zoom, setelah elemen menampilkannya; yang belum pernah ditampilkan, atau dimuat saat tersembunyi dan belum ditampilkan sejak itu, terbuka di tempat nilai menempatkannya, seperti pada editor yang terlambat bergabung;
- tab, saat pemuatan memindahkannya, dan di tab Pengaturan juga tab asal pembaca, yang disebut penguncian `Canvas Type` yang diaktifkan di sana;
- Tampilan Nama dan setiap pengaturan Generator Kode yang ditampilkan pembaca atas pilihannya sendiri di bawah penguncian, tetapi hanya saat penguncian itu aktif sebelum pemuatan, masih aktif sesudahnya, dan memegang nilai terkunci yang sama. Jadi saat peer membuka kunci, mengubah, dan mengunci lagi sebuah pengaturan pada nilai lain di sela-selanya, editor terbuka pada nilai terkunci yang baru, dan jika penguncian nonaktif sebelum atau sesudah pemuatan, editor menampilkan nilai yang dimuat;
- setiap pengaturan yang diubah pembaca hanya baca pada layarnya sendiri, apa pun kata penguncian.

Tidak ada yang dikirim, dan `value` serta `runtimeValue` tetap melaporkan dokumen yang dimuat. Pembukaan kunci peer berikutnya menggantikan pengaturan kode yang dipertahankan dengan cara ini, seperti setiap pembukaan kunci.  
Guliran atau zoom pembaca berikutnya yang dibuat saat editor dapat mengedit menjadikan posisi guliran dan tingkat zoom yang dipertahankan itu milik dokumen lagi, dan keluar dengan didahului posisi layar saat itu, sehingga replika mengambil zoom itu juga.

`reseed` membiarkan apa yang ditahan store apa adanya. Seretan, geseran, atau zoom yang masih ditahan keluar sesudahnya, dibaca dari dokumen yang diisi ulang; perubahan warna atau perubahan ukuran memo keluar sebagaimana dibuat, meskipun editor tidak lagi menampilkannya; dan apa yang ditahan `disconnect()` keluar pada `connection()`.  
Karena itu panggil [flushStreamBuffers](#flushstreambuffers) lebih dulu, kirim apa yang dipancarkannya, dan isi ulang data awal dengan nilai yang memuatnya. Jangan pernah memanggil `reseed` saat terputus.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Menghancurkan instans sharedStore sepenuhnya.  
Editor itu sendiri tidak disentuh, sehingga dokumen tetap dapat diedit setelah sesi ditinggalkan.  
Pelacak mouse dan fokus berhenti setelah sharedStore terakhir yang diberikan editor dihancurkan.  
Batch aliran yang masih ditahan store ikut dibuang; panggil [flushStreamBuffers](#flushstreambuffers) terlebih dahulu untuk mengirimnya.  
Kursor, fokus, pilihan, dan kotak seret yang dikirim editor lain tetap digambar hingga kedaluwarsa; sejak `5.1.0`, [forgetPeer](#forgetpeer) langsung menghapus milik satu editor.

```js
sharedStore.destroy();
```
