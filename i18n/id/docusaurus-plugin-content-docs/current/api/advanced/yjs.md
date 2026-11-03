---
sidebar_position: 2
description: "Menjaga elemen <erd-editor> atau peer store headless tetap selaras melalui dokumen Yjs dengan @dineug/erd-editor-yjs, mengisi data awal room, menampilkan kehadiran lewat Awareness, tetap mengedit secara offline, dan meleburkan riwayat room dengan sidecar pemadatan."
---

# Yjs

`@dineug/erd-editor-yjs` menjaga diagram tetap selaras melalui dokumen [Yjs](https://github.com/yjs/yjs). Paket ini berdiri sendiri, dirilis pertama kali sebagai `0.1.0` bersama `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` mengikat elemen `<erd-editor>`, dan `bindPeerStore` mengikat peer store headless dari `@dineug/erd-editor/peer.js`, ke sebuah `Y.Doc`.  
Provider apa pun yang membawa `Y.Doc` membawa diagramnya: server websocket, WebRTC, IndexedDB, atau provider buatan Anda sendiri. Provider dan `Y.Doc` tetap milik Anda: pengikatan tidak pernah menghubungkan, memutus, atau menghancurkannya.

Edit dikirim sebagai batch aksi milik editor sendiri, yang disimpan pengikatan persis seperti yang dikirim store.  
Karena itu, register kolaborasi editor menentukan hasil edit yang dibuat pada saat yang sama seperti pada sesi yang dihubungkan lewat `getSharedStore`, dengan pengecualian yang sama, seperti perubahan warna — lihat [Pengeditan pada saat yang sama](./collaborative-editing.md#concurrent-edits).  
Kursor, fokus, pilihan, dan kotak seret dikirim melalui Awareness milik provider — lihat [Kehadiran](#presence).  
Dibandingkan dengan menghubungkan shared store ke transport sendiri, pengikatan menambahkan:

- Klien yang bergabung membuka diagram yang dipegang room, tanpa [runtimeValue](../erd-editor-element.md#runtimevalue) yang diserahkan dari editor yang sedang berjalan.
- Klien yang terputus tetap mengedit, dan editnya masuk saat tersambung kembali — lihat [Pengeditan offline dan bergabung kembali](#offline-edits-and-rejoins).
- `Y.Doc` yang dikembalikan provider persistensi membuka diagram yang dipegangnya — lihat [Isi room](#what-the-room-holds).
- Sidecar Node opsional meleburkan riwayat room menjadi satu cuplikan — lihat [Memadatkan room](#compacting-a-room).

Pengikatan memerlukan lima metode yang ditambahkan `5.1.0` ke shared store dan peer store — [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer), dan [reseed](./collaborative-editing.md#reseed) — dan melakukan sendiri setiap pemanggilan metode itu yang dibutuhkannya.

## Instalasi {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs`, dan `y-protocols` adalah dependensi peer, sehingga satu halaman hanya memuat satu salinan masing-masing: `@dineug/erd-editor` `5.1.0` atau yang lebih baru dalam `5.x`, `yjs` `13.6` atau yang lebih baru dalam `13.x`, dan `y-protocols` `1.0` atau yang lebih baru dalam `1.x`.  
Paket ini hanya mengambil tipenya dan bekerja pada `Y.Doc` dan `Awareness` yang Anda berikan, sehingga tidak memuat kode Yjs, y-protocols, atau editor sendiri.  
Dua salinan Yjs dalam satu halaman merusak pemeriksaan konstruktor satu sama lain, dan salinan kedua mencatat `Yjs was already imported`. Saat kode Anda dan sebuah provider me-resolve `yjs` dari dua tempat, lakukan dedupe di bundler (Vite: `resolve.dedupe: ['yjs']`).

Paket ini hanya ESM (`"type": "module"`), dengan satu titik masuk, yaitu root paket, dan ditandai bebas efek samping, sehingga bundel yang hanya mengimpor `bindErdEditor` tidak menyertakan pemadat.  
`bindErdEditor` memerlukan DOM, karena mengikat elemen `<erd-editor>` yang sudah terdefinisi. `bindPeerStore` juga berjalan di Node biasa, pada Node.js 22.12 atau yang lebih baru, seperti [sidecar pemadatan](#compacting-a-room).

## Penggunaan {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` dan `my-diagram` mewakili server dan room Anda sendiri.  
Ikat, dan isi data awal, hanya setelah provider tersinkronisasi, seperti yang ditunjukkan event `sync` y-websocket dengan `true`. Pengisian data awal yang dilakukan lebih awal dapat menggantikan diagram room — lihat [Mengisi data awal room](#seeding-a-room).

Saat `Y.Doc` memegang cuplikan sebuah room pada saat pengikatan, pengikatan langsung membukanya di elemen: memuat cuplikan beserta register dan versinya, seperti yang dilakukan [reseed](./collaborative-editing.md#reseed), lalu menerapkan setiap edit yang dicatat sejak itu.  
Pembukaan itu mengosongkan dan menutup apa yang dikosongkan dan ditutup oleh penggabungan kembali — lihat [Pengeditan offline dan bergabung kembali](#offline-edits-and-rejoins) — dan elemen terbuka di tempat yang ditentukan cuplikan. Tidak ada `rejoin` yang dipicu untuk pembukaan pertama ini.  
Saat `Y.Doc` tidak memegang cuplikan, seperti pada room kosong atau sebelum provider tersinkronisasi, elemen mempertahankan dokumennya, dan pengikatan tidak menulis apa pun ke room hingga cuplikan muncul, entah [seed](#seed) miliknya sendiri atau milik klien lain.

`bindErdEditor` mengambil satu shared store dari elemen dengan [getSharedStore](../erd-editor-element.md#getsharedstore), dan [destroy](#destroy) melepaskannya.  
Elemen harus sudah berupa `<erd-editor>`, titik masuknya diimpor atau `defineErdEditor()` dipanggil — lihat [Mendaftarkan elemen](../installation.md#registering-the-elements). Sampai tag didefinisikan, `<erd-editor>` hanyalah `HTMLElement` biasa, yang di-upgrade browser setelah tag didefinisikan dan elemen berada di dokumen. Untuk elemen yang belum di-upgrade, `bindErdEditor` melempar `TypeError`, bukan memicu `error`.

Edit room diterapkan ke elemen, dan memancarkan [change](../erd-editor-element.md#change), seperti edit kolaborator, termasuk edit yang diputar ulang setelah cuplikan dibuka.  
Membuka cuplikan, saat pengikatan atau saat bergabung kembali, tidak membuat entri pembatalan, tidak memancarkan `change`, dan tidak menulis apa pun ke room, kecuali nama fisik yang dihasilkan dari nama logis, yang dijelaskan [Pengeditan offline dan bergabung kembali](#offline-edits-and-rejoins).  
Untuk memuat dokumen lain ke room yang sudah terisi data awal, buat perubahan yang diterapkan setiap klien: tetapkan [value](../erd-editor-element.md#value), panggil [clear](../erd-editor-element.md#clear), atau impor satu dokumen.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) tidak pernah ditulis ke room, karena shared store tidak mengirimnya, sehingga hanya mengubah elemen itu sementara setiap klien lain mempertahankan diagram room. Isi data awal room kosong dengan [seed](#seed) sebagai gantinya.

Satu `Y.Doc` memegang satu diagram. Pengikatan menyimpannya di bawah nama `erd:` milik `Y.Doc` dan menetapkan field `erd` pada state Awareness lokal, serta membiarkan semua nama dan field lain.  
Berikan setiap elemen yang terikat `Y.Doc` dan Awareness tersendiri, seperti yang dimiliki setiap klien sebuah room: dua pengikatan yang berbagi satu Awareness saling menimpa field `erd` masing-masing.

## Mengisi data awal room {#seeding-a-room}

Room tidak memegang diagram sampai sebuah klien [mengisi data awalnya](#seed).  
Apa yang dipegang editor selama itu masuk ke seed-nya sendiri, dan mengalah pada seed klien lain jika seed itu tiba lebih dulu: pengikatan membuka kembali di atasnya dengan `rejoin('snapshot')`, dan dokumen yang dipegang elemen, beserta apa yang diedit di dalamnya sejak pengikatan, hilang.

Saat dua klien mengisi data awal pada saat yang sama, satu seed menang di setiap klien.  
Pengisi data awal yang lain membuka kembali di atasnya dengan `rejoin('seedLost')` dan kehilangan apa yang diedit sejak seed-nya, begitu pula klien yang telah bergabung ke seed yang kalah, dengan `rejoin('snapshot')`. Edit mereka di seed yang kalah tidak sampai ke siapa pun.  
Seed yang dibuat sebelum provider tersinkronisasi dihitung sebagai dibuat pada saat yang sama dengan seed asal diagram room, sehingga dapat menang atasnya dan menggantikan diagram room.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

`Awareness` yang membawa kursor, fokus, pilihan, dan kotak seret, seperti milik provider.  
Dengannya, pengikatan mengaktifkan pelacak mouse dan fokus elemen dan menggambar kehadiran klien lain di elemen — lihat [Kehadiran](#presence).  
Tanpanya hanya diagram yang disinkronkan: elemen tidak mengirim kursor, fokus, atau pilihan dan tidak menggambar milik siapa pun.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Nama yang dilihat orang lain di samping kursor editor ini.  
Shared store elemen membacanya setiap kali mengirim, seperti pada [getSharedStore](./collaborative-editing.md#getnickname), dan pengguna lain melihat `user` saat nama kosong atau tidak ada.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` mengembalikan fungsi yang menghapus listener.

### seed {#seed}

Menulis cuplikan pertama room dari dokumen editor dan mengembalikan `true`.  
Jika diberi `value`, teks dokumen dalam bentuk apa pun yang dibaca [setInitialValue](../erd-editor-element.md#setinitialvalue), metode ini memuatnya ke editor lebih dulu.  
Kemudian melepaskan, tanpa dicatat, seretan, perubahan ukuran, dan perubahan warna yang masih ditahan editor, sehingga tidak ada yang masuk ke room setelah cuplikan. Tanpa `value`, cuplikan sudah menampilkannya, karena mengambil dokumen editor; dengan `value`, semuanya milik dokumen yang digantikan oleh `value`.  
Lalu menulis cuplikan yang dijelaskan [Isi room](#what-the-room-holds).  
Setelah room memegang cuplikan, metode ini mengembalikan `false` dan tidak menulis apa pun, tanpa memuat `value`, sehingga setiap klien dapat memanggilnya setelah pengikatan. Metode ini juga mengembalikan `false` setelah pengikatan dihancurkan atau dihentikan, dan pada pengikatan yang [ditolak](#onerror) saat pengikatan.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Pengikatan membuka kembali editor pada cuplikan room, seperti yang dilakukan [reseed](./collaborative-editing.md#reseed); [Pengeditan offline dan bergabung kembali](#offline-edits-and-rejoins) menjelaskan apa yang dipertahankan dan apa yang hilang.  
`reason` menyebutkan penyebabnya:

- `'snapshot'`: cuplikan memuat edit yang belum diterapkan pengikatan, karena pengikatan sedang tidak ada saat pemadat meleburkannya, atau karena pemadat mengembalikan, dalam peleburan tersendiri, apa yang telah dilebur ke cuplikan yang digantikan oleh cuplikan pemadat lain (lihat [Satu pemadat per room](#one-compactor-per-room)). Ini juga menjadi alasannya saat cuplikan adalah yang pertama sampai ke pengikatan room kosong, dan saat cuplikan itu milik seed lain dan pengikatan ini telah bergabung ke seed yang bukan ditulisnya.
- `'seedLost'`: seed klien lain menang atas seed yang ditulis pengikatan ini.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Pengikatan menolak mengikat, berhenti, atau menolak sebuah opsi. Setiap pesan diawali `erd-editor-yjs: `.

Saat pengikatan, tidak ada yang diikat jika:

- editor atau peer store sudah terikat ke `Y.Doc` ini;
- `@dineug/erd-editor`-nya dibangun sebelum `5.1.0`; pengikatan menghancurkan shared store yang diambilnya dari elemen;
- peer store dihancurkan sebelum diikat;
- room memegang cuplikan dalam struktur yang tidak dibaca rilis ini (lihat [Isi room](#what-the-room-holds)).

Pengikatan seperti itu memicu `error` dalam microtask, sehingga listener yang ditambahkan tepat setelah pemanggilan mendengarnya, dan tidak pernah ada `rejoin` yang dipicu padanya.

Kemudian pengikatan berhenti jika:

- cuplikan room berubah menjadi struktur yang tidak dibaca rilis ini. Setiap pengikatan rilis ini berhenti, setiap editor mempertahankan apa yang telah diterapkannya, dan tidak ada yang diedit sesudahnya yang ditulis;
- peer store-nya dihancurkan di bawahnya, diketahui saat room berubah berikutnya atau saat `seed()` atau `compact()` dipanggil.

Pengikatan yang berhenti melepaskan shared store yang diambilnya, serta store-nya dan `Y.Doc` sebagai pasangan, seperti yang dilakukan [destroy](#destroy), dan mempertahankan listener-nya.

Khusus untuk `bindPeerStore`, hal berikut memicu `error` dan pengikatan terus berjalan:

- `compactAfter` bukan bilangan bulat positif: pengikatan hanya meleburkan saat diminta;
- `electionGraceMs` atau `retainMs` bukan angka dari 0 hingga 2.147.483.647 ms: nilai default-nya menggantikan, karena timer di luar rentang itu menyala seketika;
- `synced` ditolak: pengikatan tidak pernah meleburkan, dan menyerahkan pemilihan kepada pemadat lain (lihat [Satu pemadat per room](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Mengirim seretan, perubahan ukuran, dan perubahan warna yang masih ditahan editor ke room, menetapkan field Awareness `erd` milik pengikatan menjadi `null`, sehingga yang lain langsung menghapus kursor, fokus, dan pilihannya, dan berhenti mengamati `Y.Doc` dan Awareness.  
Untuk elemen, metode ini juga menghancurkan shared store yang diambilnya, dengan membiarkan elemen dan dokumennya apa adanya.  
Pemanggilan kedua tidak melakukan apa pun. Sesudahnya, apa yang diedit editor tidak sampai ke siapa pun.

Peer store, `Y.Doc`, dan provider tetap milik Anda, untuk dihancurkan setelah pengikatan: peer store yang dihancurkan lebih dulu tidak pernah mengirim seretan yang masih ditahannya.  
[destroy](../erd-editor-element.md#destroy) milik elemen menghancurkan setiap shared store yang diberikannya, termasuk milik pengikatan, dan membuang apa yang mereka tahan, jadi hancurkan pengikatan lebih dulu.  
Hancurkan pengikatan sebelum mengikat editor atau peer store yang sama ke `Y.Doc` yang sama lagi; pengikatan yang berhenti dengan `error` sudah melepaskan diri.

```js
binding.destroy();
editor.destroy();
```

## Kehadiran {#presence}

Dengan [awareness](#awareness), kursor, tabel atau sel yang difokuskan, pilihan, dan kotak seret editor dikirim di field `erd` pada state Awareness lokalnya, tidak pernah di `Y.Doc`, sehingga tidak pernah masuk ke riwayat room, cuplikannya, atau `Y.Doc` yang dipersistensikan.  
Yang lain menggambarnya seperti kehadiran kolaborator — lihat [focusTracker](./collaborative-editing.md#focustracker) — dan klien yang bergabung menggambar kehadiran yang sudah ditampilkan room.  
Elemen mengirim ulang fokus dan pilihannya setiap 30 detik dan kotak seretnya setiap detik. Setiap pengiriman ulang itu sampai ke yang lain bahkan saat mengulang yang terakhir, sehingga apa yang masih dipegang pengguna tidak pernah kedaluwarsa.

Klien yang pergi langsung dilupakan.  
Saat Awareness menghapus state-nya, atau field `erd`-nya menjadi `null`, seperti yang ditetapkan [destroy](#destroy), atau menyebut editor lain, pengikatan menghapus kursor, fokus, pilihan, dan kotak seret editor itu dari elemen dengan [forgetPeer](./collaborative-editing.md#forgetpeer), tanpa menunggu kedaluwarsa.  
Pengikatan mempertahankannya selama klien lain masih menampilkan editor yang sama, seperti elemen yang diikat lagi ke `Y.Doc` lain dari room.

## Pengeditan offline dan bergabung kembali {#offline-edits-and-rejoins}

Klien yang terputus dari provider tetap mengedit. Editnya menunggu di `Y.Doc` lokalnya, bukan di shared store, dan sampai ke yang lain saat provider tersambung kembali dan tersinkronisasi.

Saat pemadat meleburkan edit yang belum pernah diterapkan klien selama ia tidak ada, cuplikan memuatnya, sehingga saat tersambung kembali klien membuka kembali di atas cuplikan dengan `rejoin('snapshot')`, setelah mengirim seretan, perubahan ukuran, dan perubahan warna yang masih ditahan editornya. Peleburan yang hanya mencakup apa yang telah diterapkan klien tidak membuka kembali apa pun.  
Penggabungan kembali ke cuplikan dari seed yang diikuti pengikatan memutar ulang setiap edit yang tidak dimuat cuplikan, termasuk edit klien ini sendiri yang dibuat selama ia tidak ada, sehingga tidak ada yang hilang. Penggabungan kembali ke seed lain tidak mempertahankan apa pun, seperti dijelaskan [Mengisi data awal room](#seeding-a-room).

Setiap penggabungan kembali mengosongkan riwayat pembatalan, pilihan, dan fokus, serta menutup tampilan [Alur](../../guide/guides/visualization.md#flow-mode) yang terbuka, [penggambaran hubungan](../../guide/guides/editing-start.md#relationship-creation), dan editor memo, nama grup tabel, atau sel, karena semuanya dapat menyebut sesuatu yang tidak lagi dimuat cuplikan.  
Nama grup tabel yang diketik dan belum dimasukkan dibuang. Sel nama logis yang ditutup menghasilkan nama fisik dari nama logis yang diketik pembacanya, jika dokumen yang dibuka kembali masih memuatnya, seperti setiap penutupan sel itu. Tindakan menghasilkan nama itu merupakan edit biasa: room mencatatnya, dan tindakan itu membuat entri pembatalan serta memancarkan `change` — lihat [reseed](./collaborative-editing.md#reseed).  
Pengikatan yang telah bergabung ke room mempertahankan apa yang dilihat pembacanya: posisi gulir, tingkat zoom, dan tab, serta pengaturan yang diubah pembaca hanya baca.  
Pengikatan juga mempertahankan Tampilan Nama dan pengaturan kode (bahasa Generator Kode, konvensi penamaan, dan tipe tanda kutip) yang ditampilkan pembacanya sendiri, selama [penguncian](../../guide/guides/settings.md#lock) masing-masing aktif sebelum penggabungan kembali dan masih aktif sesudahnya pada nilai terkunci yang sama.  
Tidak satu pun yang dipertahankan itu sampai ke `value`, yang melaporkan pengaturan dokumen yang dibuka kembali — lihat [reseed](./collaborative-editing.md#reseed) dengan `keepScreen`.  
Posisi gulir dan tingkat zoom elemen yang tidak ditampilkan sejak pemuatan terakhirnya, serta seluruh layar pengikatan yang belum bergabung, terbuka di tempat yang ditentukan cuplikan.  
Peer store tidak punya layar, sehingga penggabungan kembalinya tidak mempertahankan apa pun.

## Editor hanya baca {#read-only-editors}

Elemen [hanya baca](../erd-editor-element.md#readonly) yang terikat ke room tidak menulis apa pun ke riwayat room: shared store-nya tidak mengirim perubahan, hanya pelacaknya dan handshake register, dan room [tidak mencatat keduanya](#what-the-room-holds).  
Elemen itu tetap menerapkan setiap edit yang dibawa room, dan dengan [awareness](#awareness) kursor, fokus, pilihan, dan kotak seret pembacanya tetap sampai ke yang lain.  
Pengaturan yang diubah pembacanya tetap berada di layarnya, seperti pada setiap editor hanya baca.  
[seed](#seed) tidak ditolak: elemen hanya baca mengisi data awal room kosong dengan dokumen yang dipegangnya, atau dengan `value` jika diberikan.

## Isi room {#what-the-room-holds}

Pengikatan menyimpan diagram di dua nama `Y.Doc`: `erd:snapshot`, map yang memegang cuplikan dokumen, dan `erd:log`, array batch aksi editor sejak cuplikan itu. Provider persistensi menyimpan keduanya bersama bagian `Y.Doc` lainnya.

Cuplikan memuat [runtimeValue](../erd-editor-element.md#runtimevalue) dokumen, termasuk entitas yang dihapus, register kolaborasi dan versinya, serta seberapa jauh edit setiap penulis telah dilebur ke dalamnya. Seed menulisnya, begitu pula setiap peleburan pemadat.  
Setiap entri log adalah satu batch seperti yang dikirim editor, beserta metanya, yang membawa id editor dan nama panggilan pengirim.  
Guliran, zoom, pergantian tab, kehadiran, dan handshake register tidak pernah dicatat. Setiap perubahan lain yang dikirim editor dicatat, termasuk pergantian Tampilan Nama yang dibuat di bawah [penguncian](../../guide/guides/settings.md#lock)-nya, yang dibuang setiap klien lain.  
Bahasa Generator Kode, konvensi penamaan, atau tipe tanda kutip yang diubah di bawah penguncian tidak pernah dikirim, sehingga tetap berada di layar editor itu dan tidak pernah sampai ke room.

`Y.Doc` yang dikembalikan provider persistensi membuka diagram yang dipegangnya, seperti pengikatan membuka `Y.Doc` apa pun yang memegang cuplikan — lihat [Penggunaan](#usage).

Cuplikan bukan file: nilai runtime-nya membawa entitas yang dihapus, yang tidak boleh ada di file.  
Untuk menulis diagram room ke penyimpanan, simpan [value](../erd-editor-element.md#value) elemen yang terikat setiap kali event [change](../erd-editor-element.md#change)-nya dipicu.  
Simpan juga sekali setelah pengikatan, setelah [seed](#seed) yang diberi `value`, dan di listener [rejoin](#onrejoin), karena tidak satu pun pemuatan itu memancarkan `change`.  
Elemen [hanya baca](../erd-editor-element.md#readonly) tidak pernah memancarkan `change`, jadi simpan dari elemen yang bukan hanya baca, atau baca `value` dari peer store yang terikat, yang menerapkan edit room saat tiba.  
[replicationStore](./remote-storage.md) tidak dapat diikat, karena tidak memiliki metode yang dibutuhkan pengikatan, dan yang diumpankan dari shared store elemen terikat melewatkan edit room — lihat [Mereplikasi editor yang sedang berjalan](./remote-storage.md#replicating-a-live-editor).

Strukturnya privat dan dapat berubah bersama [ERD_YJS_FORMAT](#exports).  
Baca room hanya melalui pengikatan, dan serahkan nama `erd:` serta field Awareness `erd` kepadanya.

## Memadatkan room {#compacting-a-room}

Riwayat room bertambah dengan setiap edit, dan setiap klien yang bergabung memutar ulang semuanya, hingga ada yang meleburnya.  
`bindPeerStore` mengikat peer store headless dari `@dineug/erd-editor/peer.js` dan mengembalikan `ErdYjsPeerBinding`: [seed](#seed), [on](#erdyjsbinding), dan [destroy](#destroy) yang sama, ditambah [compact](#compact).  
Peer store yang diikat di proses Node di samping server, yaitu sidecar, meleburkan riwayat menjadi cuplikan dari diagramnya sendiri.  
Pengikatan elemen tidak pernah meleburkan, dan peer store yang diikat tanpa `compactAfter` dan tanpa pemanggilan `compact()` adalah peer headless biasa.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

Peer store tetap milik Anda: pengikatan tidak pernah menghancurkannya. Nama panggilannya adalah yang diberikan kepada `createPeerStore`, dan `presence: false` mencegahnya mengirim fokusnya sendiri.

Peleburan menulis cuplikan dari nilai runtime, register, dan versi milik peer store sendiri, lalu menghapus entri log yang dicakupnya dan setiap entri seed lain, semuanya dalam satu transaksi.  
Klien yang telah menerapkan semuanya melihat entri itu hilang; klien yang belum membuka kembali di atas cuplikan (lihat [Pengeditan offline dan bergabung kembali](#offline-edits-and-rejoins)).  
Setiap peleburan menulis ulang seluruh diagram ke cuplikan, sehingga masing-masing mengirim ke setiap klien pembaruan yang ukurannya kira-kira setara JSON runtime diagram dan register digabungkan, sedikit apa pun entri yang diambilnya. Atur `compactAfter` cukup tinggi agar entri yang diambil peleburan lebih berat daripada satu salinan diagram.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Opsi | Default | Deskripsi |
| --- | --- | --- |
| `awareness` | Tidak ada | Menampilkan peer store di Awareness room, seperti [awareness](#awareness) pada elemen. Pemadat yang meleburkan sendiri ditandai di sana, sehingga pemadat yang saling melihat memilih satu untuk meleburkan, dan yang tidak melihat klien lain tidak meleburkan apa pun sendiri — lihat [Satu pemadat per room](#one-compactor-per-room). Tanpanya, pemadat meleburkan sendiri tanpa pemilihan dan tanpa masa tunggu. |
| `compactAfter` | Tidak ada | Meleburkan sendiri setelah log memuat sebanyak ini entri yang akan diambil peleburan. Tanpanya, atau tanpa `synced`, hanya `compact()` yang meleburkan, dan peleburan yang mengembalikan (lihat [Satu pemadat per room](#one-compactor-per-room)). |
| `synced` | Tidak ada | Promise yang selesai setelah provider tersinkronisasi. Tidak ada peleburan sebelumnya, termasuk `compact()`. Tanpanya, tidak ada yang meleburkan sendiri dan `compact()` meleburkan seketika. |
| `electionGraceMs` | `3000` | Dengan `awareness`, berapa lama pemadat mengamati room sebelum meleburkan sendiri, setelah `synced` dan lagi setiap kali klien lain muncul setelah sebelumnya tidak ada. |
| `retainMs` | `600000` (sepuluh menit) | Berapa lama entri sebuah peleburan tetap ditahan untuk dikembalikan (lihat [Satu pemadat per room](#one-compactor-per-room)), dihitung dari pembaruan pertama yang dikirim room setelah peleburan. |

Opsi yang tidak valid, atau `synced` yang ditolak, memicu [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Meleburkan seketika, tanpa pemilihan, masa tunggu, atau ambang.  
Metode ini lebih dulu menyerap cuplikan room saat ini, termasuk penggabungan kembali, dan mengirim apa yang masih ditahan peer store-nya.  
Metode ini menjawab `{ compacted: true, generation }`, dengan `generation` menghitung peleburan cuplikan: `0` untuk seed, bertambah satu per peleburan.  
Jika tidak, metode ini menjawab `{ compacted: false, reason }`:

- `'destroyed'` setelah pengikatan dihancurkan atau dihentikan, dan pada pengikatan yang [ditolak](#onerror) saat pengikatan, bahkan sebelum `synced` selesai;
- `'not-synced'` sebelum `synced` selesai;
- `'no-snapshot'` di room yang belum diisi data awal oleh klien mana pun.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Satu pemadat per room {#one-compactor-per-room}

Jalankan tepat satu pemadat per room, dan mulai yang baru hanya setelah yang lama berhenti. Tidak ada yang memaksakan hal ini.  
Di antara pemadat yang saling melihat di Awareness, hanya yang ber-id klien Yjs terkecil yang meleburkan sendiri, dan saat ia pergi, atau `synced`-nya ditolak, pemadat berikutnya langsung mengambil alih.  
Pemadat yang Awareness-nya tidak menampilkan klien lain, seperti saat soketnya sendiri tertutup dan menjatuhkan semuanya, tidak meleburkan apa pun sendiri hingga yang lain muncul lagi dan ia telah mengamati room selama `electionGraceMs`.

Dua pemadat yang terputus satu sama lain, atau restart yang pendahulunya masih berjalan, tetap dapat masing-masing meleburkan.  
Room lalu mempertahankan salah satu dari dua cuplikan, dan pemadat yang cuplikannya kalah mengembalikan apa yang dilebur olehnya yang tidak dipegang pemenang, selama ia menahannya: `retainMs`, dan paling banyak 1.000 entri terbarunya, sebesar apa pun masing-masing.  
Jadi tidak ada yang hilang saat pemadat yang cuplikannya kalah adalah yang tersambung kembali, selama ia meleburkan tidak lebih dari 1.000 entri saat terpisah.  
Saat ia yang tetap online dan tahanannya sudah habis, cuplikan dan riwayat room kekurangan apa yang dilebur olehnya hingga ia meleburkan lagi. Klien yang melewatkan edit itu, atau yang bergabung sementara itu, kekurangannya, dan menahan edit berikutnya dari setiap penulis yang editnya dilebur pemadat. Peleburan berikutnya dari pemadat mengembalikan semuanya, kecuali jika cuplikan pemenang memuat edit yang tidak dimilikinya, yang membuka kembali pemadat pada cuplikan itu dan menghilangkan apa yang dilebur olehnya untuk selamanya.

Pemadat mengembalikan dalam peleburan tersendiri, yang dibuat setelah ia menyusul cuplikan pemenang, tanpa pemilihan, masa tunggu, atau ambang, dan setiap klien membuka kembali pada peleburan itu dengan `rejoin('snapshot')`.  
Edit yang dikembalikannya tidak sampai ke klien mana pun di luar peleburan itu, sehingga klien yang online sepanjang waktu berakhir sama dengan yang lain dan dengan klien yang bergabung kemudian, bahkan saat edit berikutnya dari penulis lain bertumpu pada salah satunya, seperti penggantian nama tabel yang ditambahkan klien lain.  
Setiap pengembalian membuat setiap klien menanggung penggabungan kembali itu, dengan [apa yang hilang saat bergabung kembali](#offline-edits-and-rejoins). Saat dua pemadat mengembalikan pada saat yang sama, setiap klien tetap berakhir sama, meskipun sebuah edit dapat tetap diterapkan mendahului edit yang menjadi tumpuannya.  
Pengikatan yang dihancurkan atau dihentikan sebelum peleburan itu berjalan, seperti saat listener `rejoin` menghancurkannya, mengembalikan edit itu secara terpisah sebagai gantinya. Tidak ada yang hilang, tetapi klien yang online sepanjang waktu dapat menerapkan satu edit setelah edit penulis lain yang bertumpu padanya, dan berakhir berbeda dari klien yang bergabung kemudian.

## Batasan {#limits}

- **Area pandang tetap berada di setiap layar.** Guliran, zoom, dan pergantian tab [tidak pernah dicatat](#what-the-room-holds), meskipun sesi yang dihubungkan lewat `getSharedStore` mengirimkannya (di sana pun semuanya tidak menggerakkan area pandang atau tab pengguna lain). Setiap pembaca mempertahankan miliknya sendiri, dan pengikatan menampilkannya hanya di state Awareness-nya, yang belum dibaca apa pun. Dengan [penguncian](../../guide/guides/settings.md#lock) `Viewport` atau `Canvas Type` nonaktif, `value` setiap klien menyimpan miliknya sendiri; di bawah penguncian, yang aktif pada dokumen baru, setiap klien menyimpan nilai terkunci.
- **Cuplikan bertambah satu entri per pengikatan.** Cuplikan menyimpan, untuk setiap pengikatan yang pernah menulis ke room, seberapa jauh editnya dilebur, dan tidak pernah membuang satu pun. Pengikatan yang dibuat lagi, atau yang pindah ke seed lain, dihitung baru, begitu pula setiap peleburan yang mengembalikan. Satu entri berupa id 32 karakter dan sebuah angka, sehingga sepuluh ribu sesi penulisan menambah beberapa ratus kilobyte ke setiap cuplikan dan setiap peleburan.
- **Hub dan room tidak meneruskan apa pun di antara keduanya.** Elemen yang terikat ke room dan ke [hub](../../mcp/live-and-headless.md#live) agen pemrograman, atau ke transport lain lewat `getSharedStore()`, menerapkan edit keduanya, tetapi masing-masing tidak mendengar edit yang lain, karena shared store tidak pernah meneruskan apa yang diterimanya.
- **Penambahan pada saat yang sama dapat tercantum dalam urutan berbeda.** Tabel atau memo yang ditambahkan dua klien pada saat yang sama dapat berada dalam urutan lain di diagram setiap klien, seperti pada sesi yang dihubungkan lewat `getSharedStore` — lihat [Pengeditan pada saat yang sama](./collaborative-editing.md#concurrent-edits).
- **Warna dan beberapa perubahan lain yang dibuat pada saat yang sama dapat berakhir berbeda.** Perubahan warna dicatat tanpa versi, dan setiap klien memberinya cap versinya sendiri saat menerapkannya. Dua pewarnaan ulang satu tabel, memo, atau grup tabel yang dibuat pada saat yang sama karenanya dapat membuat klien, dan klien yang bergabung kemudian lalu memutar ulang log, berakhir dengan warna berbeda. Begitu pula perubahan lain yang diterapkan setiap klien dalam urutan yang didengarnya, seperti dua pemindahan kolom dalam satu tabel atau indeks, atau dua perubahan database — lihat [Pengeditan pada saat yang sama](./collaborative-editing.md#concurrent-edits).
- **Kursor yang pergi menunggu server.** Pengikatan menghapus kursor peer segera setelah Awareness menjatuhkannya. Server yang, saat soket ditutup, hanya menghapus state Awareness yang pertama kali ditambahkan soket itu membuat klien yang telah tersambung kembali tetap tampil di layar yang lain setelah ia pergi, hingga Awareness menghentikannya karena waktu habis, 30 detik kemudian. Server yang menghapus setiap state yang terakhir ditulis soket, pembaruan sama seperti penambahan, menghapusnya seketika.

## Ekspor {#exports}

| Ekspor | Deskripsi |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Mengikat elemen `<erd-editor>` — lihat [Penggunaan](#usage). Mengembalikan [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Mengikat peer store dari `@dineug/erd-editor/peer.js` — lihat [Memadatkan room](#compacting-a-room). Mengembalikan hal yang sama dengan [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Struktur `Y.Doc` yang ditulis rilis ini, `1`; pengikatan menolak room yang ditulis dalam struktur lain. |

Tipe: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
