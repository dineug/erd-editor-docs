---
sidebar_position: 2
description: Mereplikasi editor yang sedang berjalan ke store headless di luar thread utama, dan menserialisasi dokumen untuk penyimpanan.
---

# Penyimpanan jarak jauh

Mengirim seluruh keadaan editor pada setiap perubahan tidak efisien.  
Untuk kasus tersebut, editor menyediakan API untuk replikasi data waktu nyata.

## Instalasi {#installation}

```sh
npm install @dineug/erd-editor
```

Store replikasi berada di subpath `@dineug/erd-editor/engine.js`, bukan di root paket.  
Titik masuk itu tidak menyentuh DOM, sehingga berjalan di Web Worker atau di mana pun di luar thread utama.  
Sebaliknya, mengimpor root paket mendaftarkan elemen kustom `<erd-editor>`, yang memerlukan dokumen.

## Penggunaan {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## Mereplikasi editor yang sedang berjalan {#replicating-a-live-editor}

Aksi berasal dari shared store milik editor yang sedang berjalan.  
Lihat [Pengeditan kolaboratif](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Hanya perubahan yang melintasi batas, tidak pernah seluruh dokumen.  
Replika menerapkannya dan menserialisasi hasilnya di sisinya sendiri.  
`change` memberikan hasil itu kepada Anda sebagai `value`, dan `changed` memberi tahu kapan hasil itu layak ditulis.

Sejak `4.0.0`, isi data awal replika dari `runtimeValue` milik editor, seperti di atas, bukan dari file yang disimpan atau dari `value` milik editor.  
File tidak memuat perubahan yang dibuat sejak file itu disimpan, dan `value` tidak memuat entitas yang dihapus dalam sesi.  
Replika yang data awalnya diisi tanpa tabel yang telah dihapus memunculkan kembali tabel itu tanpa nama maupun kolomnya saat sebuah editor membatalkan penghapusannya, lalu menyimpannya dalam keadaan demikian.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mengukur string dalam piksel.  
Store tidak memiliki DOM, sehingga tidak dapat mengukur teks sendiri, dan store menghitung ulang lebar kolom dari fungsi ini setiap kali nama, tipe data, nilai default, atau komentar berubah.  
Store juga mengukur ulang setiap tabel dan kolom setiap kali [setInitialValue](#setinitialvalue) memuat dokumen.  
Sejak `4.0.0`, lebar hanya disimpan di [runtimeValue](#runtimevalue-getter), tidak pernah di `value`.  
Jadi, dokumen yang disimpan oleh rilis ini terbaca kembali menjadi `value` yang sama persis byte demi byte, di mana pun dokumen itu disimpan dan bagaimanapun teks diukur di sana.

Ukur dengan cara yang sama seperti editor — `400 12px` dalam font stack editor, dibulatkan, ditambah padding 2px.  
Jika tidak, lebar di `runtimeValue` menyimpang dari lebar yang tampil di layar.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` adalah cadangan saat tidak ada kanvas yang tersedia.  
Cara ini cukup untuk store yang dokumennya hanya disimpan, tidak pernah dirender.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Menserialisasi keadaan editor saat ini.  
Mengembalikan string JSON yang siap disimpan apa adanya — bukan objek yang sudah diurai.

```js
const data = replicationStore.value;
```

Sejak `4.0.0`, `value` adalah bentuk penyimpanan: dokumen sebagaimana tersimpan di file, teks yang sama dengan yang dikembalikan [value](../erd-editor-element.md#value) milik elemen.  
Isinya hanya entitas yang masih ada, dalam urutan tetap, tanpa entitas yang dihapus, urutan tumpukan, atau apa pun yang dihitung kembali oleh pemuatan, seperti lebar yang diukur [toWidth](#towidth).  
Teksnya diindentasi dua spasi dan diakhiri baris baru, sehingga dokumen yang sama selalu menghasilkan byte yang sama.  
Lihat [Bentuk penyimpanan dan nilai runtime](./schema.md#storage-form-and-runtime-value) untuk mengetahui isinya.

Setiap pengaturan dengan [penguncian](../../guide/guides/settings.md#lock) aktif ditulis dengan nilai saat pengaturan itu dikunci, dan setiap pengaturan lain ditulis sebagaimana adanya.  
Penguncian `Viewport` mencakup titik asal area pandang dan tingkat zoom sekaligus, sedangkan tab, bahasa Generator Kode, kedua konvensi penamaan, dan tipe tanda kutip masing-masing memiliki penguncian sendiri.  
Penguncian ini menggantikan `ignoreSaveSettings` milik dokumen, yang tidak dibaca maupun ditulis sejak `4.0.0`.  
Sebelum `4.0.0`, `value` adalah seluruh dokumen sebagaimana adanya di store, dengan bit guliran dan zoom milik field itu diterapkan.

### runtimeValue getter {#runtimevalue-getter}

Sejak `4.0.0`, menserialisasi dokumen sebagaimana adanya di replika, termasuk entitas yang dihapus dan semua yang dihitung kembali oleh pemuatan.  
Di sini pun, setiap pengaturan yang terkunci ditulis dengan nilai terkuncinya.

```js
const snapshot = replicationStore.runtimeValue;
```

Gunakan untuk mengisi data awal editor atau store lain yang bergabung belakangan, melalui `setInitialValue` miliknya; lihat [Pengeditan kolaboratif](./collaborative-editing.md).  
Jangan pernah menyimpannya sebagai file: nilai ini membawa entitas yang dihapus, dan [JSON Schema](./schema.md#json-schema) yang dipublikasikan menolaknya.  
Entitas yang dihapus itulah yang memungkinkan pembatalan sebuah penghapusan, yang dikirim belakangan, mengembalikan entitas secara utuh di store yang data awalnya diisi dari nilai ini.  
Entitas tersebut tetap ada hingga dokumen dibuka lagi dari filenya, yang bentuknya tidak menyertakan entitas itu.

### setInitialValue {#setinitialvalue}

Memuat keadaan editor yang sebelumnya disimpan.

```js
replicationStore.setInitialValue('json...');
```

Metode ini menerima bentuk penyimpanan, nilai runtime, atau dokumen yang disimpan oleh rilis sebelumnya, termasuk dokumen v2.  
String kosong, atau apa pun yang bukan string, memuat dokumen baru yang kosong alih-alih memunculkan kesalahan.  
Store yang belum pernah diberi nilai dimulai sebagai dokumen baru yang sama.  
Sejak `4.0.0`, semua [penguncian](../../guide/guides/settings.md#lock) dokumen tersebut aktif, sehingga `value` dokumen itu mempertahankan area pandang, tab, bahasa Generator Kode, konvensi penamaan, dan tipe tanda kutip awalnya selama editor yang direplikasinya menggulir, melakukan zoom, berpindah tab, atau mengubah pengaturan tersebut. Di `3.10.0`, dokumen itu tidak menyimpan guliran maupun zoom, dan sebelum itu menyimpan keduanya.  
Dokumen yang tersimpan mempertahankan penguncian yang disebutkannya.  
Dokumen yang tidak menyebutkan penguncian apa pun, yaitu setiap dokumen yang disimpan sebelum `4.0.0`, termasuk dokumen v2, dimuat dengan semua penguncian aktif: titik asal area pandangnya di `0, 0`, tingkat zoomnya di `1`, dan tabnya di ERD, apa pun yang disimpannya, serta bahasa Generator Kode, konvensi penamaan, dan tipe tanda kutipnya sebagaimana disimpan.  
Sejak `4.0.0`, `setInitialValue` juga membuang register kolaborasi yang disimpan untuk dokumen sebelumnya, seperti yang dilakukan [setInitialValue](../erd-editor-element.md#setinitialvalue) milik elemen.  
Teks yang bukan JSON, seperti file yang masih berisi penanda konflik merge, juga tidak memunculkan kesalahan: kesalahan penguraian hanya dicatat ke konsol, dokumen dikosongkan, dan pengaturan tetap seperti semula.

Sejak `4.0.0`, pemuatan tidak menjalankan garbage collection, sehingga entitas yang dihapus tetap berada di [runtimeValue](#runtimevalue-getter).  
Sebelumnya, pemuatan membuang entitas yang tidak lagi muncul di `doc` dan tidak disentuh selama empat hari atau lebih.

Penulisan ulang oleh pemuatan sudah tuntas sebelum `setInitialValue` selesai dijalankan: tanda kunci pada kolom, yang dibaca dari opsi setiap kolom dan dari hubungan; setiap lebar tabel dan kolom, yang diukur ulang dengan `toWidth`; titik tempat setiap konektor bertemu tabelnya; serta penanda pengidentifikasi setiap hubungan dan simbol di ujung induknya.  
Tidak satu pun dari semua itu merupakan bagian dari `value`, tetapi `replicationStore.runtimeValue` yang dibaca tepat setelah pemanggilan sudah memuat semuanya.  
Aksi yang tiba tepat setelah pemuatan, seperti guliran yang diputar ulang, diukur terhadap dokumen yang dimuat, sehingga pemuatan itu sendiri tidak pernah dilaporkan sebagai [`changed`](#onchange).

Baik pemuatan maupun penulisan ulang mana pun di atas tidak memancarkan `change`.  
Baca sendiri `replicationStore.value` setelah `setInitialValue` selesai dijalankan jika Anda ingin dokumen yang dimuat ditulis kembali dalam bentuk penyimpanan.

### on@change {#onchange}

Berlangganan perubahan pada keadaan editor.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` di-debounce selama 200ms, sehingga serangkaian aksi beruntun tiba sebagai satu notifikasi.  
Event ini hanya dipicu oleh aksi dari jenis yang dapat mengubah dokumen, ditambah `settings.changeIgnoreSaveSettings` yang mungkin masih dikirim oleh editor lama (lihat [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Aksi kehadiran yang diteruskan atau `editor.mergeLWW` tidak pernah membangunkannya.  
Panggil fungsi yang dikembalikan untuk berhenti berlangganan.

Sejak `3.10.0`, listener menerima `ReplicationChange`, tipe yang diekspor `@dineug/erd-editor/engine.js` di samping `ReplicationStore`.  
Sebelum `3.10.0`, listener tidak menerima apa pun, dan listener yang mengabaikan argumen tersebut tetap berfungsi.  
`value` adalah dokumen yang diserialisasi dalam bentuk penyimpanan, string yang sama dengan yang dikembalikan `replicationStore.value` pada saat itu, sehingga tidak perlu menserialisasinya lagi.  
`changed` bernilai `false` saat aksi sejak `change` sebelumnya, atau sejak pemuatan, membiarkan `value` tetap sama persis byte demi byte.

Perubahan yang tidak dimasukkan ke `value` karena [penguncian](../../guide/guides/settings.md#lock) tetap memicu `change`, dengan `changed` bernilai `false`, jadi tulis hanya saat `changed` bernilai `true`.  
Perubahan tersebut berupa guliran atau zoom selama `Viewport` terkunci, perpindahan tab selama `Canvas Type` terkunci, dan perubahan bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip selama penguncian miliknya sendiri aktif.  
Event [change](../erd-editor-element.md#change) milik elemen tidak menyertakan perubahan semacam itu, tetapi replika tetap melaporkannya.  
Semua penguncian aktif di dokumen baru dan di dokumen yang disimpan sebelum `4.0.0`.  
Saat `Viewport` tidak terkunci, guliran atau zoom mengubah `value`, dan saat `Canvas Type` tidak terkunci, begitu pula membuka tab editor yang lain.  
Mengaktifkan atau menonaktifkan penguncian juga mengubah `value`.

Sejak `4.0.0`, `changed` membandingkan bentuk penyimpanan, yang tidak memuat entitas yang dihapus maupun urutan tumpukan.  
Jadi, tabel yang ditambahkan lalu dihapus lagi dalam satu `change`, perubahan yang mengenai entitas yang telah dihapus kolaborator lain, dan pemuatan yang diteruskan yang hanya mengubah urutan tumpukan semuanya juga menghasilkan `changed` bernilai `false`.

`changed` tidak pernah membandingkan dengan file yang Anda simpan, yang mungkin sudah berbeda dari `value` begitu file itu dimuat: file yang disimpan oleh rilis sebelumnya berbeda, termasuk file v2, begitu pula file yang diawali byte order mark dan file yang diedit secara manual.  
Membandingkan byte dengan file semacam itu akan membuat guliran yang tidak dimasukkan karena penguncian pun terhitung sebagai perubahan.  
`change` pertama dengan `changed` bernilai `true` mengembalikan file semacam itu dalam bentuk penyimpanan, sehingga menuliskannya menulis ulang file tersebut satu kali.  
File yang disimpan oleh rilis ini tidak berbeda, di mana pun file itu disimpan, seperti dijelaskan di [toWidth](#towidth).  
Jika `setInitialValue` dipanggil selama sebuah `change` masih tertunda, dan tidak ada yang dikirim sebelum waktunya tiba, `change` tersebut tetap datang, dengan `value` yang dimuat dan `changed` bernilai `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Menerapkan perubahan dari editor jarak jauh ke replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` menunda penerapan ke microtask, dan `dispatchSync` langsung menerapkan batch tersebut.

Anda dapat meneruskan aliran shared store tanpa difilter.  
Kedua metode hanya mempertahankan aksi dari jenis yang dapat mengubah dokumen, ditambah dua aksi yang dijelaskan di akhir bagian ini, dan membuang sisanya, sehingga data kehadiran yang dibawa sesi kolaboratif — kursor mouse, fokus, pilihan, dan kotak seret setiap pengguna — lewat tanpa efek apa pun.

Sejak `3.10.0`, aksi yang dipertahankan mencakup `relationship.changeOnDelete` dan `relationship.changeOnUpdate`, dan `relationship.add` membawa `onDelete` dan `onUpdate`.  
Store dari rilis sebelumnya membuang aksi tersebut dan mengabaikan field tersebut, sehingga kehilangan tindakan [ON DELETE dan ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) milik hubungan.

Sejak `4.0.0`, aksi yang dipertahankan juga mencakup `table.changeGroup`, tujuh dari delapan aksi `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName`, dan `tableGroup.changeColor`, semuanya kecuali perubahan urutan tumpukan `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings`, dan `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` sudah tidak ada lagi, sehingga kedua metode membuangnya.  
Store dari rilis sebelumnya membuang aksi baru tersebut, sehingga kehilangan [grup tabel](../../guide/guides/table-groups.md), [penguncian](../../guide/guides/settings.md#lock), skrip [Skema SQL](../../guide/guides/schema-sql.md), dan kolom yang diberikan [Petakan Kolom](../../guide/guides/relationship-editing.md#map-columns) ke hubungan yang sudah ada.  
Jalankan replika pada rilis yang sama dengan editor, atau rilis yang lebih baru.

`4.1.0` tidak menambahkan tipe aksi apa pun dan membiarkan `@dineug/erd-editor/engine.js` seperti semula, sehingga replika `4.0.0` mempertahankan setiap perubahan yang dikirim editor `4.1.0`, sama seperti replika `4.1.0`.  
Sejak `4.1.0`, `Replace` dan `Replace All` di [Temukan dan Ganti](../../guide/guides/find-and-replace.md#replacing) juga mengganti nama indeks dan grup tabel, melalui aksi `index.changeName` dan `tableGroup.changeName` yang sudah dipertahankan oleh replika `4.0.0`.  
Keadaan milik [Penjelajah](../../guide/guides/explorer.md) sendiri tidak pernah dikirim, dan perpindahan tab atau guliran yang dilakukannya tiba seperti perpindahan tab atau guliran lainnya; lihat [Pengeditan kolaboratif](./collaborative-editing.md).

Sejak `4.0.0`, kedua metode juga menerapkan `editor.mergeLWW`, yang membawa register kolaborasi yang dikirim sebuah editor sebagai jawaban saat editor lain bergabung ke sesi, sehingga replika menentukan hasil perubahan serentak dengan cara yang sama seperti editor.  
Aksi ini tidak mengubah satu byte pun dari `value` dan tidak memicu `change`.  
`settings.changeIgnoreSaveSettings`, yang mungkin masih dikirim oleh editor yang dirilis sebelum `4.0.0`, dipertahankan tetapi tidak mengubah apa pun: aksi ini memicu `change` dengan `changed` bernilai `false`.

### destroy {#destroy}

Menghancurkan instans replicationStore sepenuhnya.

```js
replicationStore.destroy();
```

Setelah itu, store berhenti memancarkan `change` dan mengabaikan pengiriman berikutnya.  
Dokumen membeku pada nilai terakhirnya alih-alih memunculkan kesalahan.  
Buat store baru untuk memulai lagi.
