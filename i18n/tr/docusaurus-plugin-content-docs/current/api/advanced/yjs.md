---
sidebar_position: 2
description: "Bir <erd-editor> öğesini veya headless bir eş deposunu @dineug/erd-editor-yjs ile bir Yjs belgesi üzerinden eşzamanlı tutma, odayı başlatma, Awareness ile anlık durum bilgisini gösterme, çevrimdışı düzenlemeye devam etme ve odanın geçmişini bir sıkıştırma yardımcı süreciyle katlama."
---

# Yjs

`@dineug/erd-editor-yjs`, diyagramları bir [Yjs](https://github.com/yjs/yjs) belgesi üzerinden eşzamanlı tutar. Kendi başına bir pakettir ve `@dineug/erd-editor` `5.1.0` ile birlikte `0.1.0` olarak ilk kez yayımlandı.  
`bindErdEditor` bir `<erd-editor>` öğesini, `bindPeerStore` ise `@dineug/erd-editor/peer.js` içindeki headless bir eş deposunu bir `Y.Doc`'a bağlar.  
`Y.Doc`'u taşıyan sağlayıcı diyagramı da taşır: bir websocket sunucusu, WebRTC, IndexedDB veya kendi sağlayıcınız. Sağlayıcı ve `Y.Doc` sizde kalır: bağlama bunların bağlantısını asla kurmaz veya kesmez ve onları asla yok etmez.

Düzenlemeler, bağlamanın deponun gönderdiği hâliyle sakladığı düzenleyicinin kendi eylem paketleri olarak taşınır.  
Bu yüzden düzenleyicinin ortak çalışma kayıtları, aynı anda yapılan düzenlemeleri `getSharedStore` ile bağlanmış bir oturumdaki gibi, renk değişikliği gibi aynı istisnalarla çözümler. [Eşzamanlı düzenlemeler](./collaborative-editing.md#concurrent-edits) bölümüne bakın.  
İmleçler, odak, seçimler ve sürükleme kutuları sağlayıcının Awareness'i üzerinden taşınır. [Anlık durum bilgisi](#presence) bölümüne bakın.  
Bir paylaşılan depoyu bir taşıma katmanına kendiniz bağlamaya kıyasla, bağlama şunları ekler:

- Katılan bir istemci, çalışan bir düzenleyiciden [runtimeValue](../erd-editor-element.md#runtimevalue) devralmadan odanın tuttuğu diyagramı açar.
- Bağlantısı kesilen bir istemci düzenlemeye devam eder ve düzenlemeleri yeniden bağlandığında ulaşır. [Çevrimdışı düzenlemeler ve yeniden katılma](#offline-edits-and-rejoins) bölümüne bakın.
- Kalıcı depolama sağlayıcısının geri verdiği bir `Y.Doc`, tuttuğu diyagramı açar. [Odanın tuttukları](#what-the-room-holds) bölümüne bakın.
- İsteğe bağlı bir Node yardımcı süreci, odanın geçmişini tek bir anlık görüntüye katlar. [Odayı sıkıştırma](#compacting-a-room) bölümüne bakın.

Bağlama, `5.1.0` sürümünün paylaşılan depoya ve eş deposuna eklediği beş yönteme ihtiyaç duyar: [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) ve [reseed](./collaborative-editing.md#reseed). Gereken çağrıların hepsini kendisi yapar.

## Kurulum {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` ve `y-protocols` eş bağımlılıklardır, bu yüzden bir sayfada her birinin tek bir kopyası bulunur: `5.x` içinde `@dineug/erd-editor` `5.1.0` veya sonraki bir sürüm, `13.x` içinde `yjs` `13.6` veya sonraki bir sürüm ve `1.x` içinde `y-protocols` `1.0` veya sonraki bir sürüm.  
Paket bunların yalnızca türlerini alır ve verdiğiniz `Y.Doc` ile `Awareness` üzerinde çalışır, bu yüzden kendi başına Yjs, y-protocols veya düzenleyici kodu yüklemez.  
Bir sayfada iki Yjs kopyası birbirinin oluşturucu denetimlerini bozar ve ikincisi `Yjs was already imported` iletisini günlüğe yazar. Kodunuz ve bir sağlayıcı `yjs`'i iki farklı yerden çözümlediğinde, paketleyicide tekilleştirin (Vite: `resolve.dedupe: ['yjs']`).

Paket yalnızca ESM'dir (`"type": "module"`), tek bir giriş noktası olan paket köküne sahiptir ve yan etkisiz olarak işaretlenmiştir, bu yüzden yalnızca `bindErdEditor` içe aktaran bir paketleyici çıktısı sıkıştırıcıyı dışarıda bırakır.  
`bindErdEditor`, tanımlanmış bir `<erd-editor>` öğesini bağladığı için bir DOM gerektirir. `bindPeerStore` ise [sıkıştırma yardımcı sürecinin](#compacting-a-room) yaptığı gibi düz Node'da, Node.js 22.12 veya sonraki bir sürümde de çalışır.

## Kullanım {#usage}

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

`wss://yjs.example.com` ve `my-diagram`, kendi sunucunuzu ve odanızı temsil eder.  
Bağlamayı ve odayı başlatmayı yalnızca sağlayıcı eşitlendikten sonra yapın; y-websocket'in `true` ile gelen `sync` olayı bunu bildirir. Daha erken yapılan bir başlatma odanın diyagramını değiştirebilir. [Odayı başlatma](#seeding-a-room) bölümüne bakın.

`Y.Doc`, bağlama anında bir odanın anlık görüntüsünü tuttuğunda, bağlama bunu öğede hemen açar: anlık görüntüyü kayıtları ve sürümüyle birlikte [reseed](./collaborative-editing.md#reseed) gibi yükler ve o zamandan beri günlüğe yazılan her düzenlemeyi uygular.  
Bu açılış, yeniden katılmanın yaptığı temizleme ve kapatma işlemlerini yapar ([Çevrimdışı düzenlemeler ve yeniden katılma](#offline-edits-and-rejoins) bölümüne bakın) ve öğe, anlık görüntünün koyduğu yerde açılır. Bu ilk açılış için `rejoin` tetiklenmez.  
`Y.Doc` boş bir odada ya da sağlayıcı eşitlenmeden önce olduğu gibi anlık görüntü tutmadığında, öğe belgesini korur ve bağlama, bir anlık görüntü görünene kadar, yani kendi [seed](#seed) çağrısı veya başka bir istemcinin çağrısı sonucu görünene kadar, odaya hiçbir şey yazmaz.

`bindErdEditor`, öğeden [getSharedStore](../erd-editor-element.md#getsharedstore) ile bir paylaşılan depo alır ve [destroy](#destroy) bunu serbest bırakır.  
Öğe zaten bir `<erd-editor>` olmalıdır: giriş noktası içe aktarılmış ya da `defineErdEditor()` çağrılmış olmalıdır. [Öğeleri kaydetme](../installation.md#registering-the-elements) bölümüne bakın. Etiket tanımlanana kadar bir `<erd-editor>` düz bir `HTMLElement`'tir; tarayıcı etiket tanımlanıp öğe belgede yer aldığında bunu yükseltir. Henüz yükseltilmemiş bir öğe için `bindErdEditor`, `error` tetiklemek yerine bir `TypeError` fırlatır.

Odanın düzenlemeleri, bir ortak çalışanın düzenlemeleri gibi öğeye uygulanır ve [change](../erd-editor-element.md#change) olayını tetikler; bir anlık görüntü açıldıktan sonra yeniden oynatılan düzenlemeler de bunların arasındadır.  
Bir anlık görüntüyü açmak, ister bağlama anında ister yeniden katılmada olsun, geri alma kaydı oluşturmaz, `change` tetiklemez ve odaya hiçbir şey yazmaz; [Çevrimdışı düzenlemeler ve yeniden katılma](#offline-edits-and-rejoins) bölümünde anlatılan mantıksal ad türetmesi bunun dışındadır.  
Başlatılmış bir odaya başka bir belge yüklemek için her istemcinin uyguladığı bir değişiklik yapın: [value](../erd-editor-element.md#value) değerini atayın, [clear](../erd-editor-element.md#clear) yöntemini çağırın veya bir belgeyi içe aktarın.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) odaya asla yazılmaz, çünkü paylaşılan depo bunu göndermez; bu yüzden yalnızca o öğeyi değiştirir, diğer her istemci odanın diyagramını korur. Boş bir odayı bunun yerine [seed](#seed) ile başlatın.

Bir `Y.Doc` tek bir diyagramı tutar. Bağlama diyagramı `Y.Doc`'un `erd:` adları altında tutar ve yerel Awareness durumunun `erd` alanını ayarlar; diğer tüm adlara ve alanlara dokunmaz.  
Her bağlanan öğeye, bir odanın her istemcisinde olduğu gibi kendine ait bir `Y.Doc` ve Awareness verin: tek bir Awareness'i paylaşan iki bağlama birbirinin `erd` alanının üzerine yazar.

## Odayı başlatma {#seeding-a-room}

Bir oda, bir istemci onu [başlatana](#seed) kadar hiçbir diyagram tutmaz.  
Bu sırada bir düzenleyicinin tuttuğu şey kendi başlatmasına girer ve başka bir istemcinin başlatması önce ulaşırsa ona yer bırakır: bağlama bunun üzerine `rejoin('snapshot')` ile yeniden açılır ve öğenin tuttuğu belge, bağlandığından beri içinde yapılan düzenlemelerle birlikte kaybolur.

İki istemci aynı anda başlattığında, her istemcide tek bir başlatma kazanır.  
Diğer başlatan istemci, `rejoin('seedLost')` ile bu başlatmaya yeniden açılır ve kendi başlatmasından beri yaptığı düzenlemeleri kaybeder; kaybeden başlatmaya katılmış olan bir istemci de `rejoin('snapshot')` ile aynı şekilde kaybeder. Kaybeden başlatmadaki düzenlemeleri kimseye ulaşmaz.  
Sağlayıcı eşitlenmeden önce yapılan bir başlatma, odanın diyagramının geldiği başlatmayla aynı anda yapılmış sayılır, bu yüzden onu geçebilir ve odanın diyagramını değiştirebilir.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

Sağlayıcınınki gibi, imleçleri, odağı, seçimleri ve sürükleme kutularını taşıyan `Awareness`.  
Bununla birlikte bağlama, öğenin fare ve odak izleyicilerini açar ve diğer istemcilerin anlık durum bilgisini öğe üzerinde çizer. [Anlık durum bilgisi](#presence) bölümüne bakın.  
Bu olmadan yalnızca diyagram eşitlenir: öğe imleç, odak veya seçim göndermez ve başka kimsenin bilgisini çizmez.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Diğerlerinin bu düzenleyicinin imlecinin yanında gördüğü ad.  
Öğenin paylaşılan deposu bunu, [getSharedStore](./collaborative-editing.md#getnickname) ile olduğu gibi, her gönderişinde okur; ad yoksa veya boşsa diğer kullanıcılar `user` görür.

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

`on(event, listener)`, dinleyiciyi kaldıran bir işlev döndürür.

### seed {#seed}

Odanın ilk anlık görüntüsünü düzenleyicinin belgesinden yazar ve `true` döndürür.  
Bir `value` verilirse, yani [setInitialValue](../erd-editor-element.md#setinitialvalue) yönteminin okuduğu herhangi bir biçimde bir belge metni, önce bunu düzenleyiciye yükler.  
Ardından düzenleyicinin hâlâ beklettiği sürüklemeleri, yeniden boyutlandırmaları ve renk değişikliklerini günlüğe yazılmadan bırakır, böylece hiçbiri anlık görüntüden sonra odaya ulaşmaz. `value` olmadan anlık görüntü bunları zaten gösterir, çünkü düzenleyicinin belgesini alır; `value` ile bunlar, `value` değerinin yerini aldığı belgeye aitti.  
Ardından [Odanın tuttukları](#what-the-room-holds) bölümünde anlatılan anlık görüntüyü yazar.  
Oda bir anlık görüntü tuttuğunda `false` döndürür ve `value` değerini yüklemeden hiçbir şey yazmaz; böylece her istemci bağlandıktan sonra bunu çağırabilir. Bağlama yok edildiğinde veya durdurulduğunda ve bağlama anında [reddedilen](#onerror) bir bağlamada da `false` döndürür.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Bağlama, düzenleyiciyi [reseed](./collaborative-editing.md#reseed) gibi odanın anlık görüntüsüne yeniden açtı; neyi koruyup neyi kaybettiği [Çevrimdışı düzenlemeler ve yeniden katılma](#offline-edits-and-rejoins) bölümünde anlatılır.  
`reason` nedenini bildirir:

- `'snapshot'`: anlık görüntü, bağlamanın uygulamadığı düzenlemeleri tutar; çünkü bir sıkıştırıcı bunları katlarken bağlama uzaktaydı veya bir sıkıştırıcı, başka bir sıkıştırıcının anlık görüntüsünün yerini aldığı bir anlık görüntüye katladığı şeyi kendi katlamasında geri koydu ([Oda başına tek sıkıştırıcı](#one-compactor-per-room) bölümüne bakın). Anlık görüntü boş bir odanın bağlamasına ulaşan ilk anlık görüntü olduğunda ve başka bir başlatmaya aitken bu bağlama kendi yazmadığı bir başlatmaya katılmışsa da neden budur.
- `'seedLost'`: başka bir istemcinin başlatması, bu bağlamanın yazdığı başlatmayı geçti.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Bağlama bağlanmayı reddetti, durdu veya bir seçeneği geri çevirdi. Her ileti `erd-editor-yjs: ` ile başlar.

Bağlama anında şu durumlarda hiçbir şey bağlamaz:

- düzenleyici veya eş deposu bu `Y.Doc`'a zaten bağlıdır;
- `@dineug/erd-editor` sürümü `5.1.0` öncesinde derlenmiştir; bağlama bir öğeden aldığı paylaşılan depoyu yok eder;
- eş deposu bağlanmadan önce yok edilmiştir;
- oda, bu sürümün okumadığı bir düzende anlık görüntü tutar ([Odanın tuttukları](#what-the-room-holds) bölümüne bakın).

Böyle bir bağlama `error` olayını bir mikro görevde tetikler, bu yüzden çağrıdan hemen sonra eklenen bir dinleyici bunu duyar ve bunda hiçbir zaman `rejoin` tetiklenmez.

Sonrasında bağlama şu durumlarda durur:

- odanın anlık görüntüsü bu sürümün okumadığı bir düzene döner. Bu sürümün her bağlaması durur, her düzenleyici uyguladığı şeyi korur ve sonrasında düzenlenen hiçbir şey yazılmaz;
- eş deposu bağlamanın altında yok edilmiştir; bu, oda bir sonraki değiştiğinde veya `seed()` ya da `compact()` çağrıldığında fark edilir.

Duran bir bağlama, [destroy](#destroy) yönteminin yaptığı gibi, aldığı paylaşılan depoyu ve bir çift olarak deposunu ve `Y.Doc`'u serbest bırakır, ancak dinleyicilerini korur.

Yalnızca `bindPeerStore` için şunlar `error` tetikler ve bağlama devam eder:

- `compactAfter` pozitif bir tam sayı değildir: bağlama yalnızca istendiğinde katlar;
- `electionGraceMs` veya `retainMs`, 0 ile 2.147.483.647 ms arasında bir sayı değildir: bunun yerine varsayılan değeri kullanılır, çünkü bu aralığın ötesindeki bir zamanlayıcı hemen tetiklenir;
- `synced` reddedilir: bağlama hiç katlamaz ve seçimi diğer sıkıştırıcılara bırakır ([Oda başına tek sıkıştırıcı](#one-compactor-per-room) bölümüne bakın).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Düzenleyicinin hâlâ beklettiği sürüklemeleri, yeniden boyutlandırmaları ve renk değişikliklerini odaya gönderir, bağlamanın `erd` Awareness alanını `null` yapar (böylece diğerleri imlecini, odağını ve seçimini hemen bırakır) ve `Y.Doc` ile Awareness'i gözlemeyi durdurur.  
Bir öğe için ayrıca aldığı paylaşılan depoyu yok eder; öğe ve belgesi olduğu gibi kalır.  
İkinci çağrı hiçbir şey yapmaz. Sonrasında düzenleyicinin düzenlediği şey kimseye ulaşmaz.

Eş deposu, `Y.Doc` ve sağlayıcı sizde kalır; bunları bağlamadan sonra yok edin: önce yok edilen bir eş deposu, hâlâ beklettiği sürüklemeleri asla göndermez.  
Öğenin kendi [destroy](../erd-editor-element.md#destroy) yöntemi, dağıttığı her paylaşılan depoyu, bağlamanınkini de, yok eder ve beklettiklerini bırakır, bu yüzden önce bağlamayı yok edin.  
Aynı düzenleyiciyi veya eş deposunu aynı `Y.Doc`'a yeniden bağlamadan önce bağlamayı yok edin; `error` ile duran bir bağlama zaten serbest bırakmıştır.

```js
binding.destroy();
editor.destroy();
```

## Anlık durum bilgisi {#presence}

[awareness](#awareness) ile düzenleyicinin imleci, odaktaki tablo veya hücre, seçim ve sürükleme kutusu yerel Awareness durumunun `erd` alanında taşınır, `Y.Doc`'ta asla; bu yüzden odanın geçmişine, anlık görüntüsüne veya kalıcı depolanmış bir `Y.Doc`'a asla girmezler.  
Diğerleri bunları bir ortak çalışanın anlık durum bilgisini çizdiği gibi çizer ([focusTracker](./collaborative-editing.md#focustracker) bölümüne bakın) ve katılan bir istemci odanın zaten gösterdiği anlık durum bilgisini çizer.  
Öğe odağını ve seçimini her 30 saniyede, sürükleme kutusunu ise her saniye yeniden gönderir. Bu yeniden gönderimlerin her biri son gönderimi tekrarlasa bile diğerlerine ulaşır, böylece bir kullanıcının hâlâ tuttuğu şey asla zaman aşımına uğramaz.

Ayrılan bir istemci hemen unutulur.  
Awareness bir istemcinin durumunu bıraktığında veya `erd` alanı [destroy](#destroy) yönteminin yaptığı gibi `null` olduğunda ya da başka bir düzenleyiciyi adlandırdığında, bağlama süre dolmasını beklemek yerine o düzenleyicinin imlecini, odağını, seçimini ve sürükleme kutusunu öğeden [forgetPeer](./collaborative-editing.md#forgetpeer) ile kaldırır.  
Başka bir istemci aynı düzenleyiciyi göstermeye devam ettiği sürece bunları korur; odanın başka bir `Y.Doc`'una yeniden bağlanmış bir öğede olduğu gibi.

## Çevrimdışı düzenlemeler ve yeniden katılma {#offline-edits-and-rejoins}

Sağlayıcıyla bağlantısı kesilen bir istemci düzenlemeye devam eder. Düzenlemeleri paylaşılan depoda değil yerel `Y.Doc`'unda bekler ve sağlayıcı yeniden bağlanıp eşitlendiğinde diğerlerine ulaşır.

Bir sıkıştırıcı, istemci uzaktayken onun hiç uygulamadığı düzenlemeleri katladığında, anlık görüntü bunları tutar; bu yüzden istemci yeniden bağlandığında, düzenleyicisinin hâlâ beklettiği sürüklemeleri, yeniden boyutlandırmaları ve renk değişikliklerini gönderdikten sonra, `rejoin('snapshot')` ile anlık görüntüyü yeniden açar. Yalnızca istemcinin uyguladığı şeyin katlanması hiçbir şeyi yeniden açmaz.  
Bağlamanın katıldığı başlatmanın anlık görüntüsüne yeniden katılma, anlık görüntünün tutmadığı her düzenlemeyi, uzaktayken yapılan bu istemcinin kendi düzenlemeleri de dahil, yeniden oynatır; böylece hiçbiri kaybolmaz. Başka bir başlatmaya yeniden katılma, [Odayı başlatma](#seeding-a-room) bölümünde anlatıldığı gibi hiçbir şeyi korumaz.

Her yeniden katılma geri alma geçmişini, seçimi ve odağı temizler ve anlık görüntünün artık tutmadığı şeyleri adlandırabilecekleri için açık bir [Akış modu](../../guide/guides/visualization.md#flow-mode) görünümünü, bir [ilişki çizimini](../../guide/guides/editing-start.md#relationship-creation) ve bir not, tablo grubu adı veya hücre düzenleyicisini kapatır.  
Yazılmış ama henüz girilmemiş bir tablo grubu adı atılır. Kapanan bir mantıksal ad hücresi, yeniden açılan belge hâlâ tutuyorsa, okuyucusunun yazdığı mantıksal addan fiziksel adı türetir; bu hücrenin her kapanışında olduğu gibi. Bu türetme sıradan bir düzenlemedir: oda bunu günlüğe yazar, bir geri alma kaydı oluşturur ve `change` tetikler. [reseed](./collaborative-editing.md#reseed) bölümüne bakın.  
Odaya katılmış bir bağlama, okuyucusunun gördüğü şeyi korur: kaydırma konumunu, yakınlaştırma düzeyini ve sekmeyi ve salt okunur bir okuyucunun değiştirdiği ayarları.  
Ayrıca okuyucunun kendi gösterdiği Ad görünümünü ve kod ayarlarını (Kod oluşturucu dili, ad biçimleri ve tırnak türü), her birinin [kilidi](../../guide/guides/settings.md#lock) yeniden katılmadan önce etkinse ve sonrasında aynı kilitli değerle hâlâ etkinse korur.  
Koruduğu şeylerin hiçbiri, yeniden açılan belgenin ayarlarını bildiren `value` değerine ulaşmaz. `keepScreen` ile [reseed](./collaborative-editing.md#reseed) bölümüne bakın.  
Son yüklemesinden beri gösterilmemiş bir öğenin kaydırma konumu ve yakınlaştırma düzeyi ile henüz katılmamış bir bağlamanın tüm ekranı, anlık görüntünün koyduğu yerde açılır.  
Bir eş deposunun ekranı yoktur, bu yüzden yeniden katılması hiçbir şeyi korumaz.

## Salt okunur düzenleyiciler {#read-only-editors}

Bir odaya bağlı [salt okunur](../erd-editor-element.md#readonly) bir öğe odanın geçmişine hiçbir şey yazmaz: paylaşılan deposu hiçbir değişiklik göndermez, yalnızca izleyicilerini ve kayıt el sıkışmasını gönderir ve oda bunların [hiçbirini günlüğe yazmaz](#what-the-room-holds).  
Yine de odanın taşıdığı her düzenlemeyi uygular ve [awareness](#awareness) ile okuyucusunun imleci, odağı, seçimi ve sürükleme kutusu diğerlerine yine ulaşır.  
Okuyucusunun değiştirdiği ayarlar, her salt okunur düzenleyicide olduğu gibi ekranında kalır.  
[seed](#seed) reddedilmez: salt okunur bir öğe boş bir odayı tuttuğu belgeyle ya da verilmişse `value` ile başlatır.

## Odanın tuttukları {#what-the-room-holds}

Bağlama diyagramı `Y.Doc`'un iki adında tutar: belgenin anlık görüntüsünü tutan bir eşleme olan `erd:snapshot` ve bundan sonraki düzenleyici eylem paketlerinin bir dizisi olan `erd:log`. Kalıcı depolama sağlayıcısı her ikisini de `Y.Doc`'un geri kalanıyla birlikte saklar.

Anlık görüntü belgenin [runtimeValue](../erd-editor-element.md#runtimevalue) değerini, kaldırılan varlıklar dahil, ortak çalışma kayıtlarını ve sürümünü ve her yazanın düzenlemelerinin ona ne kadar katlandığını tutar. Bir başlatma bunu yazar ve bir sıkıştırıcının her katlaması da yazar.  
`5.1.1` sürümünden önceki bir `@dineug/erd-editor` ile yapılan bir başlatma veya katlama, hiçbir notu hiçbir tablo grubunda olmayan bir anlık görüntü yazar. [Sürümleri karıştırma](./collaborative-editing.md#mixing-releases) bölümüne bakın.  
Her günlük girdisi, düzenleyicinin gönderdiği hâliyle bir pakettir ve göndericinin düzenleyici kimliğini ve takma adını taşıyan meta verisi de dahildir.  
Kaydırmalar, yakınlaştırmalar, sekme geçişleri, anlık durum bilgisi ve kayıt el sıkışması asla günlüğe yazılmaz. Düzenleyicinin gönderdiği diğer her değişiklik yazılır; [kilidi](../../guide/guides/settings.md#lock) altında yapılan ve diğer her istemcinin attığı bir Ad görünümü geçişi de bunların arasındadır.  
Kilidi altında değiştirilen bir Kod oluşturucu dili, ad biçimi veya tırnak türü asla gönderilmez, bu yüzden yalnızca o düzenleyicinin ekranında kalır ve odaya asla ulaşmaz.

Kalıcı depolama sağlayıcısının geri verdiği bir `Y.Doc`, tuttuğu diyagramı açar; bir bağlamanın anlık görüntü tutan herhangi bir `Y.Doc`'u açtığı gibi. [Kullanım](#usage) bölümüne bakın.

Anlık görüntü bir dosya değildir: çalışma zamanı değeri, bir dosyanın tutmaması gereken kaldırılmış varlıkları taşır.  
Odanın diyagramını depolamaya yazmak için, bağlı bir öğenin [change](../erd-editor-element.md#change) olayı her tetiklendiğinde [value](../erd-editor-element.md#value) değerini kaydedin.  
Bunu ayrıca bağlamadan sonra bir kez, `value` verilmiş bir [seed](#seed) çağrısından sonra ve bir [rejoin](#onrejoin) dinleyicisinde kaydedin, çünkü bu yüklemelerin hiçbiri `change` tetiklemez.  
[Salt okunur](../erd-editor-element.md#readonly) bir öğe `change` asla tetiklemez, bu yüzden salt okunur olmayan bir öğeden kaydedin veya odanın düzenlemelerini geldikçe uygulayan bağlı bir eş deposundan `value` değerini okuyun.  
Bir [replicationStore](./remote-storage.md) bağlanamaz, çünkü bağlamanın ihtiyaç duyduğu yöntemlerden yoksundur ve bağlı bir öğenin paylaşılan deposundan beslenen biri odanın düzenlemelerini kaçırır. [Canlı bir düzenleyiciyi replike etme](./remote-storage.md#replicating-a-live-editor) bölümüne bakın.

Düzen özeldir ve [ERD_YJS_FORMAT](#exports) ile değişebilir.  
Bir odayı yalnızca bir bağlama üzerinden okuyun; `erd:` adlarını ve `erd` Awareness alanını ona bırakın.

## Odayı sıkıştırma {#compacting-a-room}

Odanın geçmişi her düzenlemeyle büyür ve katılan her istemci, bir şey onu katlayana kadar hepsini yeniden oynatır.  
`bindPeerStore`, `@dineug/erd-editor/peer.js` içindeki headless bir eş deposunu bağlar ve bir `ErdYjsPeerBinding` döndürür: aynı [seed](#seed), [on](#erdyjsbinding) ve [destroy](#destroy), ayrıca [compact](#compact).  
Sunucunun yanında bir Node sürecinde, yani bir yardımcı süreçte, bağlanan bir eş deposu geçmişi kendi diyagramının anlık görüntüsüne katlar.  
Bir öğenin bağlaması asla katlamaz ve `compactAfter` olmadan ve `compact()` çağrısı yapılmadan bağlanan bir eş deposu sıradan bir headless eştir.

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

Eş deposu sizde kalır: bağlama onu asla yok etmez. Takma adı `createPeerStore` işlevine verilen addır ve `presence: false` kendine ait bir odak göndermesini engeller.

Bir katlama, anlık görüntüyü eş deposunun kendi çalışma zamanı değerinden, kayıtlarından ve sürümünden yazar; kapsadığı günlük girdilerini ve başka bir başlatmaya ait her girdiyi tek bir işlemde siler.  
Her şeyi uygulamış istemciler girdilerin kaybolduğunu görür; uygulamamış bir istemci anlık görüntüyü yeniden açar ([Çevrimdışı düzenlemeler ve yeniden katılma](#offline-edits-and-rejoins) bölümüne bakın).  
Her katlama tüm diyagramı anlık görüntüye yeniden yazar, bu yüzden her biri, ne kadar az girdi alırsa alsın, her istemciye diyagramın çalışma zamanı JSON'unun ve kayıtlarının birlikte boyutuna yakın bir güncelleme gönderir. `compactAfter` değerini, bir katlamanın aldığı girdiler diyagramın bir kopyasından ağır basacak kadar yüksek ayarlayın.

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

| Seçenek | Varsayılan | Açıklama |
| --- | --- | --- |
| `awareness` | Yok | Eş deposunu, [awareness](#awareness) seçeneğinin bir öğeyi gösterdiği gibi odanın Awareness'inde gösterir. Kendi başına katlayan bir sıkıştırıcı orada işaretlenir; böylece birbirini gören sıkıştırıcılar katlamak için birini seçer ve başka istemci görmeyen bir sıkıştırıcı kendi başına hiçbir şey katlamaz. [Oda başına tek sıkıştırıcı](#one-compactor-per-room) bölümüne bakın. Bu olmadan, bir sıkıştırıcı seçim ve bekleme süresi olmadan kendi başına katlar. |
| `compactAfter` | Yok | Günlük, bir katlamanın alacağı bu kadar girdi tuttuğunda kendi başına katlar. Bu olmadan veya `synced` olmadan yalnızca `compact()` ve geri koyan katlama ([Oda başına tek sıkıştırıcı](#one-compactor-per-room) bölümüne bakın) katlar. |
| `synced` | Yok | Sağlayıcı eşitlendiğinde çözülen bir promise. Ondan önce hiçbir katlama yapılmaz, `compact()` de dahil. Bu olmadan hiçbir şey kendi başına katlamaz ve `compact()` hemen katlar. |
| `electionGraceMs` | `3000` | `awareness` ile, sıkıştırıcının kendi başına katlamadan önce odayı ne kadar izlediği; `synced` sonrasında ve hiç istemci görünmezken diğer istemciler göründüğünde yeniden. |
| `retainMs` | `600000` (on dakika) | Bir katlamanın girdilerinin geri koymak için ne kadar süre tutulduğu ([Oda başına tek sıkıştırıcı](#one-compactor-per-room) bölümüne bakın); katlamadan sonra odanın gönderdiği ilk güncellemeden itibaren sayılır. |

Geçersiz bir seçenek veya reddedilen bir `synced`, [error](#onerror) tetikler.

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Seçim, bekleme süresi veya eşik olmadan hemen katlar.  
Önce odanın geçerli anlık görüntüsünü, yeniden katılma dahil, alır ve eş deposunun hâlâ beklettiklerini gönderir.  
`{ compacted: true, generation }` yanıtını verir; burada `generation` anlık görüntünün katlamalarını sayar: bir başlatma için `0`, her katlamada bir fazlası.  
Aksi hâlde `{ compacted: false, reason }` yanıtını verir:

- `'destroyed'`: bağlama yok edildiğinde veya durdurulduğunda ve bağlama anında [reddedilen](#onerror) bir bağlamada, `synced` çözülmeden önce bile;
- `'not-synced'`: `synced` çözülmeden önce;
- `'no-snapshot'`: hiçbir istemcinin başlatmadığı bir odada.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Oda başına tek sıkıştırıcı {#one-compactor-per-room}

Oda başına tam olarak bir sıkıştırıcı çalıştırın ve yenisini ancak eskisi durduktan sonra başlatın. Bunu hiçbir şey zorlamaz.  
Awareness'te birbirini gören sıkıştırıcılar arasında yalnızca en küçük Yjs istemci kimliğine sahip olan kendi başına katlar ve o ayrıldığında ya da `synced` değeri reddedildiğinde sıradaki hemen devralır.  
Awareness'inde başka istemci görünmeyen bir sıkıştırıcı, örneğin kendi soketi kapanıp hepsini düşürdüğünde, diğerleri yeniden görünene ve odayı `electionGraceMs` süresince izleyene kadar kendi başına hiçbir şey katlamaz.

Birbirinden kopmuş iki sıkıştırıcı ya da selefi hâlâ çalışan bir yeniden başlatma yine de her biri katlayabilir.  
Oda bu durumda iki anlık görüntüden birini tutar ve anlık görüntüsü kaybeden sıkıştırıcı, katladığı ve kazananın tutmadığı şeyi, tuttuğu sürece geri koyar: `retainMs` kadar ve her biri ne kadar büyük olursa olsun en fazla son 1.000 girdisi.  
Bu yüzden anlık görüntüsü kaybeden sıkıştırıcı yeniden bağlanan olduğunda, ayrıyken 1.000'den fazla girdi katlamadığı sürece hiçbir şey kaybolmaz.  
Çevrimiçi kalan o olduğunda ve tutma süresi dolduğunda, odanın anlık görüntüsü ve geçmişi, o yeniden katlayana kadar katladığı şeyden yoksun kalır. Bu düzenlemeleri kaçıran bir istemci ya da bu sırada katılan biri bunlardan yoksundur ve sıkıştırıcının düzenlemelerini katladığı her yazanın sonraki düzenlemelerini bekletir. Sıkıştırıcının sonraki katlaması hepsini geri getirir; kazanan anlık görüntü onun tutmadığı düzenlemeleri tutuyorsa bu durum hariçtir, çünkü o zaman onu bu anlık görüntüye yeniden açar ve katladığı şeyi kalıcı olarak kaybeder.

Bir sıkıştırıcı, kazanan anlık görüntüye yetiştikten sonra yapılan, seçim, bekleme süresi veya eşik olmayan kendi katlamasında geri koyar ve her istemci bu katlamaya `rejoin('snapshot')` ile yeniden açılır.  
Geri koyduğu düzenlemeler bu katlamanın dışında hiçbir istemciye ulaşmaz, bu yüzden baştan sona çevrimiçi olan bir istemci, başka bir yazanın sonraki bir düzenlemesi bunlardan birine dayansa bile (örneğin başka bir istemcinin eklediği bir tablonun yeniden adlandırılması), diğerleriyle ve sonradan katılanla aynı sonuca varır.  
Her geri koyma, her istemciye bu yeniden katılmayı [yeniden katılmanın kaybettikleriyle](#offline-edits-and-rejoins) birlikte yaşatır. İki sıkıştırıcı aynı anda geri koyduğunda, bir düzenleme dayandığı düzenlemenin önünde uygulanmış kalabilse de her istemci yine aynı sonuçla biter.  
Bir `rejoin` dinleyicisinin onu yok etmesi gibi, o katlama çalışmadan önce yok edilen veya durdurulan bir bağlama, düzenlemeleri kendi başlarına geri koyar. Hiçbiri kaybolmaz, ancak bu durumda baştan sona çevrimiçi olan bir istemci bir düzenlemeyi, ona dayanan başka bir yazanın düzenlemesinden sonra uygulayabilir ve sonradan katılandan farklı bir sonuca varabilir.

## Sınırlar {#limits}

- **Görünüm alanı her ekranda kalır.** Kaydırmalar, yakınlaştırmalar ve sekme geçişleri [asla günlüğe yazılmaz](#what-the-room-holds); oysa `getSharedStore` ile bağlanmış bir oturum bunları gönderir (orada da başka hiçbir kullanıcının görünümünü veya sekmesini oynatmaz). Her okuyucu kendininkini korur ve bağlama bunu yalnızca henüz hiçbir şeyin okumadığı Awareness durumunda gösterir. `Viewport` veya `Canvas Type` [kilidi](../../guide/guides/settings.md#lock) devre dışıyken her istemcinin `value` değeri kendi değerini kaydeder; yeni bir belgede etkin olan bu kilitler altında her istemci kilitli olanı kaydeder.
- **Anlık görüntü bağlama başına bir girdi büyür.** Odaya hiç yazmış her bağlama için düzenlemelerinin ne kadar katlandığını tutar ve hiçbirini asla bırakmaz. Yeniden yapılan bir bağlama ya da başka bir başlatmaya geçen bir bağlama yeniden sayılır, geri koyan her katlama da öyle. Bir girdi 32 karakterlik bir kimlik ve bir sayıdır, bu yüzden on bin yazan oturum her anlık görüntüye ve her katlamaya birkaç yüz kilobayt ekler.
- **Bir hub ile bir oda aralarında hiçbir şey aktarmaz.** Bir odaya ve bir kodlama ajanının [hub'ına](../../mcp/live-and-headless.md#live) ya da `getSharedStore()` üzerinden başka herhangi bir taşıma katmanına bağlı bir öğe her ikisinin düzenlemelerini uygular, ancak hiçbiri diğerininkini duymaz, çünkü bir paylaşılan depo aldığı şeyi asla iletmez.
- **Aynı anda yapılan eklemeler ayrı sıralanabilir.** İki istemcinin aynı anda eklediği tablolar veya notlar, `getSharedStore` ile bağlanmış bir oturumdaki gibi, her istemcinin diyagramında başka bir sırada durabilir. [Eşzamanlı düzenlemeler](./collaborative-editing.md#concurrent-edits) bölümüne bakın.
- **Renkler ve aynı anda yapılan birkaç başka değişiklik ayrı bitebilir.** Bir renk değişikliği sürümsüz günlüğe yazılır ve her istemci bunu uygularken kendi sürümüyle damgalar. Bu yüzden aynı tablo, not veya tablo grubunun aynı anda yapılan iki yeniden renklendirmesi istemcileri ve sonradan katılıp günlüğü yeniden oynatan bir istemciyi farklı renklerde bırakabilir. Her istemcinin duyduğu sırayla uyguladığı diğer değişiklikler de öyle, örneğin bir tablo veya dizin içindeki iki sütun taşıma ya da veritabanının iki değişikliği. [Eşzamanlı düzenlemeler](./collaborative-editing.md#concurrent-edits) bölümüne bakın.
- **Ayrılan bir imleç sunucuyu bekler.** Bağlama, Awareness bir istemcinin imlecini bıraktığı anda onu temizler. Bir soket kapandığında yalnızca o soketin ilk eklediği Awareness durumlarını kaldıran bir sunucu, yeniden bağlanmış bir istemciyi ayrıldıktan sonra Awareness onu 30 saniye sonra zaman aşımına uğratana kadar diğerlerinin ekranında tutar. Bir soketin en son yazdığı her durumu, eklemeyi olduğu kadar güncellemeyi de, kaldıran bir sunucu onu hemen temizler.

## Dışa aktarılanlar {#exports}

| Dışa aktarılan | Açıklama |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Bir `<erd-editor>` öğesini bağlar. [Kullanım](#usage) bölümüne bakın. Bir [ErdYjsBinding](#erdyjsbinding) döndürür. |
| `bindPeerStore(peer, doc, options?)` | `@dineug/erd-editor/peer.js` içindeki bir eş deposunu bağlar. [Odayı sıkıştırma](#compacting-a-room) bölümüne bakın. Aynısını [compact](#compact) ile döndürür (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Bu sürümün yazdığı `Y.Doc` düzeni, `1`; bir bağlama başka bir düzende yazılmış odayı reddeder. |

Türler: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
