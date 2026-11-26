---
sidebar_position: 1
description: getSharedStore ile düzenleyici değişikliklerini örnekler arasında aktarma, katılan bir düzenleyiciyi runtimeValue ve deponun kayıtlarıyla başlatma, aynı anda yapılan düzenlemeleri çözümleme ve her ortak çalışanın imlecini, odağını, seçimini ve sürükleme kutusunu gösterme.
---

# Ortak düzenleme

`getSharedStore()` yöntemi bir düzenleyiciyi ortak düzenleme oturumunda bir düğüme dönüştürür.  
Her değişikliği bir eylem akışı olarak yayımlar ve diğer düzenleyicilerin geri gönderdiği eylemleri uygular – aradaki taşıma katmanını (WebSocket, WebRTC ya da JSON taşıyabilen başka herhangi bir şey) siz sağlarsınız.  
[ErdEditorElement](../erd-editor-element.md) yöntemlerinden biridir ve aktarılan değişikliklerin ayrıca depolanması gerektiğinde [Uzak depolama](./remote-storage.md) ile birlikte kullanılır.  
`5.1.0` sürümünden itibaren, bir diyagramı taşıma katmanını kendiniz kurmak yerine bir Yjs belgesi ve sağlayıcılarından herhangi biri üzerinden paylaşmak için düzenleyiciyi `@dineug/erd-editor-yjs` ile bağlayın. [Yjs](./yjs.md) sayfasına bakın.

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

`@dineug/erd-editor` bu türlerin hiçbirini adıyla dışa aktarmaz. TypeScript kodu bunlara `ErdEditorElement` üzerinden ulaşır, örneğin `ReturnType<ErdEditorElement['getSharedStore']>`.

Eylem, belgedeki tek bir değişikliği tanımlayan serileştirilebilir düz bir nesne olduğundan taşıma katmanına giderken `JSON.stringify` çağrısından bozulmadan geçer.  
Eylemler paketler hâlinde gelir: `subscribe` yöntemi bir dizi verir ve bu dizi tek bir birimdir – onu bütün olarak aktarın ve karşı tarafta da bütün olarak dispatch yöntemine verin.  
Eylemi okumak ya da yeniden yazmak yerine içine bakılmayan bir değer olarak ele alın ve olduğu gibi iletin, çünkü düzenleyicilerin eşitlenmiş kalmasını sağlayan şey, eylemin taşıdığı [sürüm](#concurrent-edits) gibi iç kayıtlardır.

Bir düzenleyicide yapılanların bir kısmı o düzenleyicide kalır.  
Bir tabloyu, notu veya tablo grubunu öne getirme işlemi gönderilmez; bunlardan birini seçmek de onu öne getirir.  
[Şema SQL](../../guide/guides/schema-sql.md) sekmesindeki `Statements`, `Header`, `Write logical names into empty comments` (`4.2.0` sürümünden itibaren) ve `Tables` seçimleri de yapıldıkları pencereye ait oldukları için gönderilmez.  
`4.1.0` sürümünden itibaren [Gezgin](../../guide/guides/explorer.md) de kendi düzenleyicisinde kalır: Açık olup olmadığı, genişliği, daraltılmış satırları, klavye odağının bulunduğu satır, ağacının kaydırma konumu, araması ve seçenekleri gönderilmez.  
Bir yabancı anahtara gidildiğinde ilişkisinin bağlantı çizgisine uygulanan [vurgu](../../guide/guides/relationship-editing.md#reading-a-connector) da gönderilmez.  
`4.2.0` sürümünden itibaren [Sözlük](../../guide/guides/dictionary.md) sekmesi de kendi düzenleyicisinde kalır: Hangi sayfanın gösterildiği ve her sayfanın araması, seçimi, kaydırma konumu ve sütun genişlikleri gönderilmez. Sekmedeki düzenlemeler, sıralamalar ve CSV içe aktarmaları ise gönderilir.  
Kaydırma, yakınlaştırma veya sekme geçişi gönderilir, ancak hiçbir zaman başka bir kullanıcının görünümünü ya da sekmesini değiştirmez. Gezginden yapılan bir atlamanın oluşturduğu kaydırma, Gezgin başka bir sekmeden açıldığında ERD sekmesine yapılan geçiş ve Sözlük sekmesindeki [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) sayfasından bir tabloya veya sütuna yapılan atlamanın sekme geçişi ile kaydırması da buna dahildir. O sayfadan bir sözcüğe, terime veya değer alanına yapılan atlama Sözlük sekmesinde kalır, bu yüzden bunun hiçbir kısmı gönderilmez.

`4.2.0` sürümünden itibaren bir [Ad görünümü](../../guide/guides/logical-names.md#switching-the-view) değişikliği de gönderilir ve diğer düzenleyicilerin bu değişiklikle ne yapacağına Ad görünümünün [kilidi](../../guide/guides/settings.md#lock) karar verir. `Name View` kilidi yeni bir diyagramda ve `4.2.0` sürümünden önceki her belgede etkindir.  
Kilit etkinken görünüm değişikliği yalnızca onu yapan düzenleyicide görünür: Değişiklik yine gönderilir, ancak diğer her düzenleyici ve her replika onu atar; böylece `value` kilitli görünümü korurken her kullanıcı farklı bir görünüme bakabilir.  
Kilit devre dışıyken düzenleme yapabilen bir düzenleyicide yapılan görünüm değişikliği, her düzenleyicide ve replikada Ad görünümünü değiştirir; en son değişiklik geçerli olur ve hepsi onu kaydeder.  
Salt okunur bir düzenleyicinin kendi görünüm değişikliği her zaman o düzenleyicide kalır ve düzenleyici diğerlerinin paylaşılan değişikliklerini yine izler.

`5.1.0` sürümünden itibaren bir [Kod oluşturucu](../../guide/guides/code-generator.md) dili, tablo adı biçimi, sütun adı biçimi veya tırnak türü değişikliği kendi kilidine (`Language`, `Table Name Case`, `Column Name Case` ya da `Bracket Type`) aynı şekilde bağlıdır, tek bir farkla: Kilit etkinken değişiklik hiç gönderilmez.  
Yalnızca onu yapan düzenleyicide görünür; o düzenleyicinin Kod oluşturucu ve Şema SQL sekmeleri onu izler, başka hiçbir düzenleyici ya da replika görmez. `value` ve `runtimeValue` kilitli değeri korur, bu yüzden herhangi bir düzenleyiciden başlatılan katılan düzenleyici de onu görmez ve kilit etkinken her kullanıcı farklı bir dile, ad biçimine veya tırnak türüne bakabilir.  
Kilit devre dışıyken, düzenleme yapabilen bir düzenleyicide yapılan değişiklik paylaşılan olarak işaretlenerek gönderilir (yükünde `shared: true`). Ayarı her düzenleyicide ve replikada değiştirir, en son değişiklik geçerli olur ve hepsi onu kaydeder. `5.1.0` sürümlü bir düzenleyici veya replika, işaretli bir değişikliği kendi kilidi ne derse desin uygular; bu yüzden bir kilit açmanın hemen ardından yapılan değişiklik, kilit açmadan önce ulaştığı yerde bile her yere ulaşır.  
`5.1.0` sürümünden önce böyle bir değişiklik, kilidi etkin olsun ya da olmasın her düzenleyiciye ve replikaya ulaşıyordu, dosya ise kilitli değeri koruyordu.

`5.0.0` sürümünden itibaren [salt okunur](../erd-editor-element.md#readonly) bir düzenleyici hiçbir değişiklik göndermez. Okuyucusunun değiştirdiği kaydırma, yakınlaştırma, sekme, Ad görünümü, veritabanı, Kod oluşturucu dili, ad biçimleri, tırnak türü ve `View Option` satırları, kilitleri ne derse desin kendi ekranında kalır; `5.0.0` sürümünden önce kaydırmaları, yakınlaştırmaları, sekme geçişleri, veritabanı ve kod ayarları düzenlenebilir bir düzenleyicininkiler gibi gönderiliyordu.  
Yine de deposu, izleyicilerinin okuyucunun imleci, odağı, seçimi ve sürükleme kutusu hakkında gönderdiklerini gönderir, katılan bir düzenleyicinin istediği kayıtları yanıtlar ve diğerlerinin gönderdiği her değişikliği uygular. Veritabanında, bir Kod oluşturucu ayarında veya bir `View Option` satırında yapılan değişiklik belgesine ulaşır; okuyucusu o ayarı orada değiştirmediyse ekranına da ulaşır. Paylaşılan bir Ad görünümü değişikliği ise her iki durumda da ekranında görünür. `5.1.0` sürümünden itibaren bir Kod oluşturucu ayarını yalnızca o ayar kilidi devre dışıyken değiştirildiğinde ya da bir kilit açma onu taşıdığında alır.  
Düzenleyici salt okunur olurken önce, [flushStreamBuffers](#flushstreambuffers) işlevinin yaptığı gibi, deponun bir sürükleme veya kaydırmadan hâlâ elinde tuttuğunu gönderir; böylece diğerleri bunun son kısmını korur.

[Kilitler](../../guide/guides/settings.md#lock) paylaşılır: Bir ayarın en son kilitlenmesi ya da kilidinin açılması her düzenleyicide geçerli olur ve kilit, onu etkinleştiren düzenleyicinin değerlerini taşır, böylece her düzenleyici ve replika aynı değeri kaydeder.  
Bu nedenle `Viewport` kilidi onu etkinleştiren düzenleyicinin görünümünü, `Canvas Type` kilidi ise o düzenleyicinin, kilitlerin etkinleştirildiği Ayarlar sekmesinden önce bulunduğu son sekmeyi kaydeder.  
`Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` veya `4.2.0` sürümünden itibaren `Name View` kilidini devre dışı bırakmak, her düzenleyicideki o ayarı da kilidi devre dışı bırakan düzenleyicide gösterilen değere getirir; kilit altında yapılmış kendi değişikliği de buna dahildir, böylece tümü tek bir değeri kaydetmeye devam eder. `Viewport` veya `Canvas Type` kilidini devre dışı bırakmak kimsenin görünümünü ya da sekmesini değiştirmez.

`Before tables` veya `After tables` betiğinde yapılan bir düzenleme, betiğin alanı odaktan çıktığında bütün olarak gönderilir. İki betik ayrı ayrı çözümlenir, bu yüzden bir ortak çalışanın birinde yaptığı düzenleme asla diğerinin üzerine yazmaz.

Görselleştirme sekmesinin [Akış modunda](../../guide/guides/visualization.md#flow-never-edits-the-document) yapılan hiçbir şey belge değişikliği değildir, bu yüzden Akış modundaki bir düzenleyici diğerlerine hiçbir değişiklik göndermez ve diğerlerinin gönderdiği değişiklikler o Akış modundayken de uygulanmaya devam eder.  
İki istisna vardır. Akış modundan başka bir sekmeye geçmek bir sekme geçişidir ve diğerleri gibi gönderilir. `4.2.0` sürümünden itibaren Akış modunda araç çubuğundaki Ad görünümü listesinden yapılan bir seçim bir Ad görünümü değişikliğidir ve tuvalde yapılan bir değişiklik gibi gönderilip uygulanır.  
Akış modunda [görünümler arasında adım adım ilerleyen](../../guide/guides/visualization.md#previous-table-and-next-table) `Previous table`, `Next table` ile geri alma ve yineleme tuşları gönderilmez.  
Dış bağlantı kart düğmesi, `#`, `@` veya `:` önekinden sonra seçilen bir [Hızlı arama](../../guide/guides/quick-search.md#searching-the-diagram) sonucu ve [Gezginin](../../guide/guides/explorer.md#opening-and-closing) açılması, düzenleyiciyi Akış modundan ERD sekmesine geçirir. Kart düğmesinin ya da bir Hızlı arama sonucunun orada yaptığı kaydırma da gönderilir.

## Tek sayfada iki düzenleyici {#two-editors-on-one-page}

Buradaki subscribe ile dispatch arasındaki bağlantı ağın yerini tutar, böylece araya bir taşıma katmanı girmeden bir oturumun yapısını görebilirsiniz.

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

Buradaki iki düzenleyici de aynı yeni, boş belgeyle başlar, bu yüzden hiçbirinin ilk içerikle başlatılması gerekmez.  
Üç veya daha fazla düzenleyici olduğunda her birinin paketlerini diğerlerinin hepsine gönderin: Bir düzenleyici aldığını asla başkasına iletmez.

## Ortak çalışanı başlatma {#seeding-a-collaborator}

Paylaşılan depo değişiklikleri yapıldıkları anda aktarır ve katılan bir düzenleyiciye belgenin o anki hâlini asla vermez, bu yüzden hâlihazırda süren bir oturuma katılan bir düzenleyiciye önce belgenin verilmesi gerekir.  
`4.0.0` sürümünden itibaren onu `value` değeriyle ya da kaydedilmiş dosyayla değil, oturumda zaten bulunan bir düzenleyicinin [`runtimeValue`](../erd-editor-element.md#runtimevalue) değeriyle başlatın.  
[`@dineug/erd-editor-yjs`](./yjs.md) paketiyle bağlanan bir oda, bir istemci onu [başlattıktan](./yjs.md#seeding-a-room) sonra belgenin kendisini tutar, bu yüzden ona bağlı her düzenleyici o belgeyi hiçbir `runtimeValue` verilmeden açar.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Çalışma zamanı değeri, belge açıldığından beri kaldırılanları hâlâ tutar, bu yüzden başka bir düzenleyici daha sonra bir kaldırmayı geri aldığında, katılan düzenleyici tabloyu adı ve sütunlarıyla geri getirir.  
[`value`](../erd-editor-element.md#value) değeri, bir dosyada saklanan ve kaldırılmış varlıkları içermeyen biçimdir, bu yüzden katılan bir düzenleyici bu değerle ya da dosyayla başlatılırsa bunun yerine boş, adsız bir tablo geri getirirdi.  
`4.2.0` sürümünden itibaren aynı durum bir [Sözlük](../../guide/guides/dictionary.md) sayfasından kaldırılan bir sözcük, terim veya değer alanı için de geçerlidir: Başka bir düzenleyici kaldırmayı geri aldığında, `runtimeValue` değeriyle başlatılan katılan bir düzenleyici satırı yeniden eksiksiz listeler, `value` değeriyle başlatılan ise boş bir satır listeler ve bu satır daha sonra onun kendi `value` değerinde yer almaz.  
Depolamaya `value` değerini yazmaya devam edin: `runtimeValue` değeri yalnızca başka bir düzenleyiciyi, ikinci bir görünümü veya bir [replicationStore](./remote-storage.md) deposunu başlatmak içindir.  
VS Code'daki, Obsidian'daki, bir JetBrains IDE'sindeki ve web uygulamasındaki düzenleyiciler, açık bir belgenin ikinci görünümünü bu şekilde başlatır.

`setInitialValue` çağrısı aktarılmaz, bu yüzden katılan düzenleyiciyi başlatmak diğerlerinde hiçbir şeyi değiştirmez.  
`4.0.0` sürümünden itibaren bu çağrı, düzenleyicinin [eşzamanlı düzenlemeleri](#concurrent-edits) çözümleyen ortak çalışma kayıtlarını da atar. Düzenleyicinin paylaşılan deposunun daha önce bir abonesi olduysa depo, ilk [subscribe](#subscribe) çağrısında olduğu gibi diğer düzenleyicilerden onların kayıtlarını yeniden ister, böylece oturumun ortasında yeniden yüklenen bir düzenleyici düzenlemeleri diğerleriyle aynı şekilde çözümler.  
`value` özelliğine atama yapmak kayıtları korur, ancak `setInitialValue` çağrısının aksine aktarılır: Düzenleyicinin bir paylaşılan deposu olduğu andan itibaren oturumdaki her düzenleyici atanan belgeyi yükler, bu yüzden katılan bir düzenleyiciyi asla bu şekilde başlatmayın.

Ne `value` ne de `runtimeValue` kayıtları ya da düzenleyicinin saatinin ulaştığı sürümü tutar, bu yüzden yalnızca `runtimeValue` ile başlatılan katılan düzenleyici, oturumdaki düzenleyicilerin ilk subscribe çağrısına verdiği yanıttan bunları alır.  
Bu yanıt gelene kadar katılan düzenleyicinin yaptığı bir düzenleme, diğerlerinin elindekinden daha düşük bir sürüm taşıyabilir; bu durumda diğerleri onu reddeder ve düzenleme yalnızca katılan düzenleyicide kalır, yolda olan daha eski bir yazma da başlatma değerinin tuttuğu daha yeni yazmanın üzerine biner. Hiçbir çalışan düzenleyici yanıt vermiyorsa, örneğin oturumun belgesini bir sunucu veya belge deposu tutuyorsa, katılan düzenleyici bunları asla alamaz.  
`5.1.0` sürümünden itibaren bunları değerle birlikte verin. Oturumdaki bir düzenleyicide önce [`flushStreamBuffers()`](#flushstreambuffers) yöntemini çağırın; böylece hâlâ bekletilen bir sürükleme veya renk değişikliği önce gönderilir. Ardından `runtimeValue` değerini ve deposunun [`getLWW()`](#getlww) ile [`getVersion()`](#getversion) sonuçlarını aynı anda okuyun. Katılan düzenleyici değeri `setInitialValue` ile yükler, kalanı ise kendi deposunun [`mergeLWW`](#mergelww) yöntemiyle alır; sırası bu olmalıdır, çünkü her `setInitialValue` kayıtları atar. Böylece bir sonraki düzenlemesi, başlatma değerinin tuttuğu her sürümün ötesinde bir sürüm taşır ve beklenecek bir yanıt olmadan uygulanır. Var olan bir depoda [`reseed`](#reseed) yöntemi ikisini tek çağrıda yapar.

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

Bu şekilde sonradan katılacakları açmak için saklanan bir başlatma değeri üçünü birlikte tutar. Bir dosya değildir: depolamaya yazılacak olan hâlâ `value` değeridir.  
Bir [replicationStore](./remote-storage.md#runtimevalue-getter) hiçbir kayıt vermez, bu yüzden `runtimeValue` değeriyle başlatılan katılan bir düzenleyici kayıtları yine düzenleyicilerin yanıtından alır.

## Eşzamanlı düzenlemeler {#concurrent-edits}

Her düzenleyici ve replika, her ad ve hemen her diğer alan için onu ayarlayan yazmanın sürümünü tutar: bunlar ortak çalışma kayıtlarıdır. Bir yazma yalnızca sürümü tutulandan düşük olmadığında uygulanır, böylece aynı değişiklikleri farklı sırayla duyan düzenleyiciler aynı belgede biter.  
`5.1.0` sürümünden itibaren her sürüm, sayacının altında, yazan düzenleyicinin kimliğinden alınan o düzenleyiciye ait bir yuva taşır. Bu yüzden sürümler 4.194.304'lük adımlarla büyür ve sayaç 512'ye ulaştığında 32 bitlik tam sayıyı aşar. `JSON.stringify` ve `JSON.parse` bunları bozmadan taşır, ancak bunları başka bir dilde ayrıştıran bir aktarıcı ya da depo onları asla 32 bitlik tam sayı olarak değil, 64 bitlik sayı olarak tutmalıdır.

`5.1.0` sürümünden itibaren, aşağıdaki istisnalar dışında, bir adı ya da alanı aynı anda değiştiren iki düzenleyici her düzenleyicide ve replikada aynı değerle biter: aynı sayaçta yazsalar da iki farklı sürüm damgalarlar ve büyük olan her yerde kazanır. `5.1.0` sürümünden önce ikisi de aynı sürümü damgalayabiliyor ve her düzenleyici en son duyduğunu tutuyordu, bu yüzden farklı sonuçlarla bitebiliyorlardı. İki düzenleyici, her çift için 4.194.304'te 1 olasılıkla aynı yuvayı paylaşır ve o zaman eskisi gibi berabere kalır.

`5.1.0` sürümünden itibaren bir tablonun konumu, bir notun veya tablo grubunun konumu ve boyutu ile görünümün başlangıç noktası ve yakınlaştırma düzeyi aynı şekilde sürümlenir ve bunları hareket ettiren şey, vardığı yer olarak gönderilir:

- bir sürükleme, taşınan her varlık için tek bir `table.moveTo`, `memo.moveTo` veya `tableGroup.moveTo` olarak, tek pakette; böylece bir grup sürükleme, grubun noktasıyla birlikte tablolarının ve `5.1.1` sürümünden itibaren notlarının noktalarını da taşır;
- bir sürüklemenin geri alınması veya yinelenmesi, her varlığı yerleştirdiği nokta olarak;
- bir kaydırma `settings.scrollTo`, bir yakınlaştırma `settings.changeZoomLevel` olarak;
- bir not veya tablo grubunun yeniden boyutlandırılması, konumu ve boyutuyla birlikte.

Bu yüzden bir tabloyu, notu veya tablo grubunu aynı anda taşıyan ya da taşıyıp yeniden boyutlandıran iki kullanıcı, onu her düzenleyicide ve replikada tek bir noktada ve tek bir boyutta bırakır. Nokta, iki ekseniyle birlikte, sürümü büyük olan yazmaya gider. Taşıma bir boyut yazmaz, bu yüzden aynı anda yapılan bir taşıma noktayı alsa bile yeniden boyutlandırma boyutunu korur.  
`5.1.0` sürümünden önce bir sürükleme, taşınan mesafe olarak gönderiliyordu; bu yüzden bir tablonun iki sürüklemesi toplanıyor, bir not veya tablo grubunun aynı anda yapılan taşıma ve yeniden boyutlandırması ise farklı sonuçlarla bitebiliyordu.  
Geri alma girdisi bırakmayan 20 pikselden kısa bir sürükleme de diğerleri gibi gönderilir; bu yüzden nokta olarak, başka bir kullanıcının aynı varlıkta aynı anda yaptığı bir sürüklemenin üzerine yazabilir. Bir taşıma katmanının iki kez ilettiği bir sürükleme, kaydırma veya yakınlaştırma paketi hiçbir şeyi iki kez hareket ettirmez.

Renk değişikliği bir istisnadır. Sürümsüz gönderilir, her düzenleyici ve replika onu kendi sürümüyle damgalar ve en son duyduğu rengi tutar; bu yüzden bir tabloyu, notu veya tablo grubunu aynı anda yeniden renklendiren iki kullanıcı farklı renklerle bitebilir.  
Birkaç değişiklik hiç sürüm tutmaz, bu yüzden her düzenleyici ve replika bunları duyduğu sırayla uygular ve aynı anda yapılan ikisi de farklı sonuçlarla bitebilir: bir tablo veya dizin içinde taşınan bir sütun (`column.move`, `indexColumn.move`) ile [veritabanında](../../guide/guides/table-related-functions.md#databases), bir [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) satırında veya [Ayarlar](../../guide/guides/settings.md) sekmesindeki `Relationship DataType Sync`, `Maximum comment width` ya da `Column Order` ayarında yapılan bir değişiklik.  
İki kullanıcının aynı anda eklediği varlıklar, örneğin iki tablo veya bir tablonun iki sütunu da her düzenleyicide ve replikada farklı sırada durabilir ve her birinin `value` değeri kendi sırasını kaydeder.

Bütün bunlar `5.1.0` veya sonraki sürümlerin düzenleyicileri ve replikaları arasında geçerlidir; daha eski bir düzenleyicinin neyi değiştirdiğini [Sürümleri karıştırma](#mixing-releases) bölümü anlatır.

## Sürümleri karıştırma {#mixing-releases}

Bir düzenleyici yalnızca kendi sürümünün bildiği eylem türlerini uygular, bu yüzden farklı sürümlerin bir arada bulunduğu bir oturumda eski düzenleyiciler daha yeni bir türle taşınan her şeyi kaçırır.

`3.10.0` sürümünden itibaren bir ilişkinin [ON DELETE veya ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) ayarında yapılan bir değişiklik, iki yeni eylem türünden biri olan `relationship.changeOnDelete` ya da `relationship.changeOnUpdate` olarak taşınır ve `relationship.add` eylemi ikisini de taşıyabilir. Eylemleri olduğu gibi ileten bir aktarıcı bunlar için yeni hiçbir şeye ihtiyaç duymaz.  
`3.10.0` sürümünden önceki bir düzenleyici bu eylem türlerini ve alanları yok sayar: Bir ilişkinin ON DELETE veya ON UPDATE değerini asla öğrenmez ve böyle bir düzenleyiciden kaydedilen belgede ikisi de bulunmaz. Eski bir düzenleyicinin eklediği ilişki bunlar olmadan gelir, bu yüzden ikisi de `Not set` değeriyle başlar.

`3.10.0` sürümlü bir düzenleyicinin gönderdiği diğer tüm değişiklikler, eski düzenleyicilerin zaten bildiği eylem türleriyle taşınır.  
[Bul ve değiştir](../../guide/guides/find-and-replace.md#replacing) içindeki `Replace All` düğmesi, düzenlemelerini elle yapılan bir düzenlemenin gönderdiği yeniden adlandırma, açıklama ve not eylemlerinin aynısından oluşan tek bir paket olarak gönderir. `Alternate Key` ve `Referential Actions` [görünüm seçenekleri](../../guide/guides/table-related-functions.md#table-view-options) mevcut `settings.changeShow` eylemiyle taşınır.

`4.0.0` sürümünden itibaren şu değişiklikler yeni eylem türleriyle taşınır ve eylemleri olduğu gibi ileten bir aktarıcı bunlar için yeni hiçbir şeye ihtiyaç duymaz:

- eklenen, taşınan, yeniden boyutlandırılan, yeniden adlandırılan, rengi değiştirilen veya kaldırılan bir [tablo grubu](../../guide/guides/table-groups.md): `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` ve `tableGroup.remove`; bir tablonun gruba katılması veya gruptan ayrılması: `table.changeGroup`;
- var olan bir ilişkide [Sütunları eşle](../../guide/guides/relationship-editing.md#map-columns) iletişim kutusunda yapılan ve ilişkinin iki sütun listesini aynı anda ayarlayan `Save` işlemi: `relationship.changeColumns`;
- bir [kilidin](../../guide/guides/settings.md#lock) etkinleştirilmesi veya devre dışı bırakılması: `settings.changeLockSettings`;
- [Şema SQL](../../guide/guides/schema-sql.md) sekmesindeki `Before tables` veya `After tables` betiğinde yapılan bir düzenleme: `settings.changeDDLScript`.

`Table Groups` ve `Memos` görünüm seçenekleri mevcut `settings.changeShow` eylemiyle taşınır.  
Kilitler yerlerini almadan önce `Save Scroll Information` ve `Save Zoom Information` anahtarlarının gönderdiği `settings.changeIgnoreSaveSettings` eylemi artık gönderilmez ve `settings.changeRelationshipOptimization` eylemi kaldırılmıştır. Bunlardan birini alan `4.0.0` sürümlü bir düzenleyici hiçbir şeyi değiştirmez.

`4.0.0` sürümünden önceki bir düzenleyici yeni eylem türlerini yok sayar: Bir tablo grubunu ya da hangi tabloların grupta olduğunu asla görmez, yine de grup sürükleme bu tabloların her birinin taşınmasını da gönderdiği için grubun tabloları orada da taşınır.  
“Sütunları eşle” iletişim kutusundaki `Save` işleminden sonra ilişkinin eski sütunlarını korur ve o eski eşlemenin bir sütunu bu düzenleyicide kaldırıldığında ilişki her düzenleyiciden kaybolur. Bu düzenleyicide kilit de betik de yoktur.  
Böyle bir düzenleyiciden kaydedilen belgede bunların hiçbiri bulunmaz ve `4.0.0` sürümlü bir düzenleyici bu belgeyi tüm ayarlar kilitli hâlde açar.  
Bir oturumdaki her düzenleyiciyi ve oturumun belgesini depolayan her [replicationStore](./remote-storage.md#dispatch-dispatchsync) deposunu `4.0.0` veya sonraki bir sürümde tutun.

`4.1.0` sürümlü bir düzenleyici yeni bir eylem türü göndermez, bu yüzden `4.0.0` ve `4.1.0` sürümlü düzenleyiciler ve replikalar hiçbir şey kaçırmadan aynı oturumu paylaşır.  
Bu sürümde [Bul ve değiştir](../../guide/guides/find-and-replace.md#replacing) dizin adlarında ve tablo grubu adlarında da arama yapar, `Replace` ve `Replace All` düğmeleri de bunları `4.0.0` sürümlü bir düzenleyicinin zaten uyguladığı `index.changeName` ve `tableGroup.changeName` eylemleriyle yeniden adlandırır.

`4.2.0` sürümünden itibaren şu değişiklikler yeni eylem türleriyle taşınır ve eylemleri olduğu gibi ileten bir aktarıcı bunlar için yeni hiçbir şeye ihtiyaç duymaz:

- bir tablonun veya sütunun [mantıksal adı](../../guide/guides/logical-names.md): `table.changeLogicalName` ve `column.changeLogicalName`; adının [sözlüklerden türetilip türetilmediği](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` ve `column.changeNameDerived`;
- bir sütunun bir [değer alanına](../../guide/guides/dictionary.md#domains-and-data-types) bağlanması veya bağlantısının kaldırılması: `column.changeDomain`;
- [Sözlük](../../guide/guides/dictionary.md) sekmesinde eklenen, değiştirilen (bir sıralamanın belirlediği şekliyle sayfadaki yeri dahil) veya kaldırılan bir sözcük, terim ya da değer alanı: `dictionary.add`, `dictionary.update` ve `dictionary.remove`;
- bir [Ad görünümü](../../guide/guides/logical-names.md#switching-the-view) değişikliği: `settings.changeNameViewMode`.

`Name View` kilidi mevcut `settings.changeLockSettings` eylemiyle, `Domain` görünüm seçeneği `settings.changeShow` eylemiyle, [Sütun sırası](../../guide/guides/settings.md#adjusting-column-order) ayarında `Logical Name` veya `Domain` satırının taşınması ise `settings.changeColumnOrder` eylemiyle taşınır.  
`Import` ile yapılan bir Şema SQL, GraphQL, DBML veya AML içe aktarmasının `editor.clear` ve `editor.loadJson` eylemleri, sözcükleri, terimleri ve değer alanlarını her düzenleyicide koruyan `keepDictionaries: true` değerini taşır. Değiştirme modundaki bir [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` veya `setSchemaAML` çağrısının eylemleri de bunu taşır.  
Sözlüklerin türettiği bir fiziksel ad `table.changeName` veya `column.changeName` eylemiyle, bir değer alanının sütunlarına verdiği veri türü ise `column.changeDataType` eylemiyle, yani elle yapılan bir düzenlemenin gönderdiği eylemlerle taşınır.

`4.2.0` sürümünden önceki bir düzenleyici yeni eylem türlerini yok sayar: Bu düzenleyicide mantıksal adlar, değer alanı bağlantıları, sözlükler ve Ad görünümü yoktur. `Name View` kilidinin etkinleştirilmesi veya devre dışı bırakılması orada hiçbir şeyi değiştirmez; Sütun sırası ayarında `Logical Name` veya `Domain` satırının taşınması ya da bir satırın bunlardan birinin üzerine taşınması da değiştirmez. Sözlük sekmesinden Ayarlar sekmesine gelmiş bir düzenleyicinin etkinleştirdiği `Canvas Type` kilidi de hiçbir şeyi değiştirmez: Eski düzenleyici o sekmeyi tanımaz, bu yüzden `Canvas Type` kilidini devre dışı tutar. Yine de sözlüklerin türettiği fiziksel adları ve değer alanlarının verdiği veri türlerini gösterir.  
Kendi düzenlemeleri mantıksal adlardan, değer alanlarından ve sözlüklerden habersizdir ve bu durum daha yeni düzenleyicilerde şu etkileri doğurur:

- Bu düzenleyicinin elle yeniden adlandırdığı bir tablonun veya sütunun adı türetilmiş olarak işaretli kalır, bu yüzden daha sonra daha yeni bir düzenleyicide ona yazılan bir mantıksal ad, eski düzenleyicide yazılan adın üzerine adı yeniden türetebilir.
- Bu düzenleyicinin bir değer alanına bağlı sütuna verdiği veri türü bağlantıyı yerinde bırakır, bu yüzden `Checks` sayfası `Domain type mismatch` denetimini listeler ve değer alanının bir sonraki tür değişikliği sütuna değer alanının türünü yeniden verir.
- Bu düzenleyicinin eklediği bir ilişkinin yabancı anahtar sütunları, anahtarlarından mantıksal ad veya değer alanı almaz.
- Bu düzenleyicinin yapıştırdığı veya çoğalttığı bir tablo, mantıksal adlar ve değer alanı bağlantıları olmadan gelir.
- Bu düzenleyicide yapılan bir Şema SQL, GraphQL, DBML veya AML içe aktarması hiçbir `keepDictionaries` değeri göndermez, bu yüzden her düzenleyicide sözcükleri, terimleri ve değer alanlarını boşaltır.
- Bu düzenleyicinin bir yüklemeyi, bir içe aktarmayı veya `clear()` çağrısını geri alması, belgenin kendi kopyasını her düzenleyiciye yükler ve bu kopyada mantıksal adlar, değer alanı bağlantıları veya sözlükler yoktur.
- Bu kopya ve bu düzenleyicide yapılan bir Şema SQL, GraphQL, DBML veya AML içe aktarmasının yüklediği belge, her düzenleyicideki `Name View` kilidini de bu eski düzenleyicinin bulduğu hâline geri getirir. Ardından her düzenleyici Ad görünümü olarak `Physical Names` görünümünü kaydeder ve kilit devre dışıysa bu görünümü gösterir de.

Böyle bir düzenleyiciden kaydedilen belgede mantıksal adlar, değer alanı bağlantıları, sözlükler veya Ad görünümü bulunmaz, bu yüzden `4.2.0` sürümlü bir düzenleyici bu belgeyi `Physical Names` görünümünde açar. Eski düzenleyici ise `Name View` kilidini bulduğu gibi kaydeder, bu yüzden `4.2.0` sürümlü bir düzenleyicide kilidi açılmış bir belge kilitsiz kalır.  
Bir oturumdaki her düzenleyiciyi ve oturumun belgesini depolayan her [replicationStore](./remote-storage.md#dispatch-dispatchsync) deposunu `4.2.0` veya sonraki bir sürümde tutun.

`5.1.0` sürümlü bir düzenleyici hiçbir yeni eylem türü göndermez, bu yüzden `5.1.0` sürümünden önceki düzenleyiciler ve replikalar onunla yine aynı oturumu paylaşır ve eylemleri olduğu gibi ileten bir aktarıcı yeni hiçbir şeye ihtiyaç duymaz. [Eşzamanlı düzenlemeler](#concurrent-edits) bölümünün anlattıkları ise yalnızca `5.1.0` sürümlü düzenleyiciler ve replikalar arasında geçerlidir:

- `5.1.0` sürümlü bir düzenleyicinin sürüklemeleri, eski düzenleyicilerin zaten uyguladığı `table.moveTo`, `memo.moveTo` ve `tableGroup.moveTo` eylemlerinde nokta olarak, kaydırma ve yakınlaştırmaları ise `settings.scrollTo` ve `settings.changeZoomLevel` eylemlerinde nokta olarak taşınır; her kaydırma ve yakınlaştırma gibi bunları başka hiçbir düzenleyici uygulamaz, yalnızca replikalar alır. Eski bir düzenleyici bir sürüklemenin her noktasını geldiği sırayla, kayıtların dışında uygular; eski bir replika da bir sürüklemenin, kaydırmanın veya yakınlaştırmanın her noktasıyla aynısını yapar, bu yüzden bir varlık ya da görünüm için aynı anda gönderilen iki nokta orada farklı sonuçlarla bitebilir.
- Eski bir düzenleyicinin sürüklemesi hâlâ taşınan mesafe olarak gider; her düzenleyici ve replika bunu kayıtlarının dışında toplar, kaydırması veya yakınlaştırması da mesafe olarak gider ve her replika bunu aynı şekilde toplar. Bir varlıkta aynı anda yapılan bir mesafe ile bir nokta, bunları farklı sırayla duyan düzenleyicilerde ve replikalarda farklı sonuçlarla bitebilir; bir taşıma katmanının iki kez ilettiği bir mesafe de iki kez toplanır.
- [Eşzamanlı düzenlemeler](#concurrent-edits) bölümünün adlandırdığı istisnalar dışında, `5.1.0` sürümlü bir düzenleyicinin bir adı veya alanı eski bir düzenleyicinin yazmasıyla aynı anda yazması hemen her zaman kazanır ve yanıt her düzenleyicide ve replikada aynıdır. İki eski düzenleyici, aynı anda yazılan bir alan üzerinde yine de farklı sonuçlarla bitebilir.
- `5.1.0` sürümlü bir düzenleyici Kod oluşturucu dili, ad biçimi veya tırnak türü değişikliğini yalnızca kilidi devre dışıyken, eski bir düzenleyicinin yok saydığı `shared: true` işaretiyle gönderir; eski düzenleyici değişikliği eskisi gibi uygular. Eski bir düzenleyici kilit altında yaptığı değişikliği hâlâ işaretsiz gönderir: `5.1.0` sürümlü bir düzenleyici veya replika, o ayar orada kilitliyken bunu atar, eski düzenleyiciler ise uygular. Yani kilit altında eski düzenleyiciler birbirlerinin seçimlerini izler, `5.1.0` sürümlü düzenleyiciler kendilerininkini korur ve dosya her iki durumda da kilitli değeri tutar. İki sürümden birinde yapılan bir kilit açma, kilidi açanın değerini her düzenleyiciye ve replikaya taşır.
- Belgeyi değiştiren bir yükleme, örneğin atanan bir `value`, `clear()` ya da değiştiren bir içe aktarma, her `5.1.0` sürümlü düzenleyicide, yani onu yapanda ve alan her düzenleyicide, çizilmekte olan bir ilişkinin çizimini bitirir. Eski bir düzenleyici ilişki çizimini bu yükleme boyunca hazır tutar.

Bir oturumdaki her düzenleyiciyi ve oturumun belgesini depolayan her [replicationStore](./remote-storage.md#dispatch-dispatchsync) deposunu, aynı anda yapılan düzenlemelerin [Eşzamanlı düzenlemeler](#concurrent-edits) bölümünün adlandırdığı istisnalar dışında her yerde aynı sonuçla bitmesi için `5.1.0` veya sonraki bir sürümde tutun; mantıksal adları ve sözlükleri koruyan ise hâlâ `4.2.0` veya sonraki sürümdür. `1.2.0` sürümünden önceki bir [MCP sunucusu](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) burada `5.1.0` sürümünden önceki bir düzenleyici sayılır ve `5.1.0` sürümünden önceki bir düzenleyici bir [Yjs](./yjs.md) odasına hiç bağlanamaz.

`5.1.1` sürümünden itibaren bir notun bir [tablo grubuna](../../guide/guides/table-groups.md) katılması veya gruptan ayrılması yeni bir eylem türüyle, `memo.changeGroup` ile taşınır ve eylemleri olduğu gibi ileten bir aktarıcının bunun için yeni bir şeye ihtiyacı yoktur. Bu eylem şu durumlarda gönderilir: bir grubun içine veya dışına bırakılan not, grubu olmayan gösterilen notların çevresine çizilen yeni grup, tabloların yanında notların da seçili olduğu `Group selected tables`, seçimde notlar varken `Remove from group`, kaldırılan bir grubun her notu, bir kodlama ajanının [MCP sunucusu](../../mcp/tools.md#table-groups) üzerinden yaptığı not grubu çağrıları ve bunların her birinin geri alınması ve yinelenmesi. Grupları not içeren bir `Import and Add` veya `setSchemaJSON` eklemesi de bunu gönderir, yinelenmesi de gönderir; geri alınması ise yalnızca bu notları kaldırır.

`5.1.1` sürümünden önceki bir düzenleyici veya replika `memo.changeGroup` eylemini yok sayar ve ayrıştırması her notun `groupId` alanını atar, bu yüzden hiçbir notu bir grupta görmez; yine de `5.1.1` sürümlü bir düzenleyicinin grup sürüklemesi, her not için bir `memo.moveTo` da gönderdiğinden grubun notlarını orada da taşır. Kendi düzenlemeleri notların gruplarından habersizdir ve bu durum daha yeni düzenleyicilerde şu etkileri doğurur:

- Bir grubun kutusuna sürüklediği not gruptan dışarıda kalır, kutunun dışına sürüklediği gruptaki bir not ise grupta kalır ve kutu onu tutacak şekilde genişler.
- Grup sürüklemesi, `Auto Layout` gibi, grubu ve tablolarını taşır ama grubun notlarını bulundukları yerde bırakır; kutu, gösterilen notları orada tutacak şekilde genişler.
- Üzerinde yapılan bir `Import and Add`, eklediği gruplara hiçbir not koymaz.
- Kaldırdığı bir grup, her notunun `groupId` alanını o grubu adlandırır halde bırakır: notlar grupsuz okunur ve kaldırmanın bu düzenleyicide geri alınması onları gruba geri koyar.
- Bir yüklemenin, bir içe aktarmanın veya `clear()` işleminin bu düzenleyicide geri alınması, belgenin kendi kopyasını her düzenleyicide yükler ve bu kopyada hiçbir not hiçbir grupta değildir.

Bunlardan birinden kaydedilen bir belgede hiçbir not hiçbir grupta değildir, ancak `4.0.0` veya sonraki bir sürümdeki bir düzenleyici tabloların gruplarını korur.  
Notları tablo gruplarında tutmak için bir oturumdaki her düzenleyiciyi ve oturumun belgesini depolayan her [replicationStore](./remote-storage.md#dispatch-dispatchsync) deposunu `5.1.1` veya sonraki bir sürümde tutun; aynı anda yapılan düzenlemeleri çözümleyen ise hâlâ `5.1.0` veya sonraki sürümdür. `1.2.1` sürümünden önceki bir [MCP sunucusu](../../mcp/installation.md#updating) de bir notun hangi tablo grubunda olduğunu benzer şekilde ne görür ne de korur.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Diğer düzenleyicilerde bu kullanıcının fare imlecinin yanında gösterilen takma adı belirler.  
Takma ad yoksa veya boşsa diğer kullanıcılar `user` adını görür.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Bu kullanıcının fare imlecini diğer düzenleyicilere yayınlar. Varsayılan olarak `true` değerini alır.  
Diğer kullanıcıların gönderdiği imleçler ERD tuvalinde her zaman gösterilir.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Bu kullanıcının üzerinde çalıştığı şeyi yayınlar. Varsayılan olarak `true` değerini alır.  
Odakladığınız tablo ve hücre, seçtiğiniz tablolar, notlar ve tablo grupları ile tuvalde sürüklediğiniz kutu diğer düzenleyicilere gönderilir ve orada çizilir.  
Onları birbirinden ayırt edebilmeniz için her kullanıcıya kendine ait bir renk verilir: odaktaki tabloda bir dış çizgi, odaktaki hücrede bir alt çizgi, seçili tabloların, notların ve tablo gruplarının çevresinde bir halka ve sürükleme kutusu için kesikli bir dikdörtgen.  
`4.2.0` sürümünden itibaren, Ad görünümü kilidi etkinken veya salt okunur bir düzenleyicinin kendi görünüm değişikliğinden sonra kullanıcıların her biri farklı bir [Ad görünümüne](../../guide/guides/logical-names.md#collaborators) bakıyor olabilir. Görünümünüzün göstermediği, odaktaki bir hücre, görünümün onun yerine gösterdiği hücrede altı çizili olarak gösterilir: Ad ile mantıksal ad, tıpkı veri türü ile değer alanı gibi birbirinin yerine geçer.  
Diğer kullanıcılardan gelen anlık durum bilgisi, bu seçenek açık olsun ya da olmasın, tuvalinizde her zaman çizilir.  
Görselleştirme sekmesinin Akış modunda diğer kullanıcıların odağı ve seçimi tablo kartlarında çizilir, ancak sürükleme kutuları çizilmez. Orada seçtiğiniz tablolar yine de gönderilir, orada sürüklediğiniz kutu ise gönderilmez.

```js
editor.getSharedStore({ focusTracker: false });
```

Paylaşılan depoyu, kendi anlık durum bilgisini yayımlamayan düz bir aktarıcı olarak kullanmak için iki izleyiciyi de kapatın.  
Diğer düzenleyicilerin gönderdiği anlık durum bilgisi yine de alınır ve çizilir.  
VS Code'daki, Obsidian'daki, bir JetBrains IDE'sindeki ve Google Drive'daki düzenleyiciler de bunu yapar.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

İmleç, odak, seçim ve sürükleme kutusu belge değişiklikleriyle aynı akışta taşınır, ancak bunlar geçicidir.  
Belgeye, geri alma geçmişine ya da `editor.value` değerine asla girmezler, bu yüzden taşıma katmanı bunları dilediği gibi atabilir ve bir replicationStore bunları yok sayar.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Bu yöntemler geçerli bağlantı durumunu ayarlar.  
Bağlantı kesikken değişiklikler dahili olarak arabelleğe alınır.  
Arabelleğe alınan değişiklikler, iletim yeniden mümkün olduğunda abonelere yayımlanır.  
Varsayılan durum bağlıdır (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Diğer düzenleyici örneklerinden gelen değişiklikleri geçerli düzenleyici örneğine uygular.  
Bir paket başka bir düzenleyicinin kayıt isteğini taşıdığında, örneğin katılan bir düzenleyicinin ilk [subscribe](#subscribe) çağrısının gönderdiği istek, depo abonelerine kayıtlarını ve sürümünü göndererek yanıt verir; hiç kayıt tutmuyorsa yanıt vermez.  
`5.1.0` sürümünden itibaren depo önce, [flushStreamBuffers](#flushstreambuffers) yönteminin yaptığı gibi, hâlâ bekletmekte olduğu her akış paketini gönderir; böylece yanıtının taşıdığı her sürüm, diğerlerine gönderilmiş bir yazmaya dayanır. Bu yüzden bir katılan düzenleyicinin gelişi, oturumdaki her düzenleyicinin hâlâ beklettiği bir sürüklemeyi, kaydırmayı, yakınlaştırmayı, renk değişikliğini veya not yeniden boyutlandırmasını aynı anda göndermesine yol açar.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Düzenleyicideki değişikliklere abone olur.  
En az bir abone olana kadar düzenleyiciden hiçbir şey çıkmaz ve o zamana kadar yapılan değişiklikler arabelleğe alınır.  
İlk subscribe çağrısı ayrıca diğer düzenleyicilerden, [eşzamanlı düzenlemeleri](#concurrent-edits) çözümleyen ortak çalışma kayıtlarını ister, böylece sonradan katılan bir düzenleyici bu düzenlemeleri aynı şekilde çözümler.  
Belgeyi getirmez, bu yüzden sonradan katılan bir düzenleyiciyi önce [ilk içerikle başlatın](#seeding-a-collaborator); `5.1.0` sürümünden itibaren başlatma değeri kayıtları da taşıyabilir.  
`4.0.0` sürümünden itibaren depo, bu ilk subscribe çağrısından sonra `setInitialValue` yöntemi, `5.1.0` sürümünden itibaren de [reseed](#reseed) düzenleyicisine her belge yüklediğinde kayıtları yeniden ister.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Bu deponun hâlâ bekletmekte olduğu akış paketlerini, sessiz sürelerinin bitmesini beklemeden hemen gönderir.  
`3.9.2` sürümünden itibaren `getSharedStore` yönteminden alınan bir depoda çalışır. `3.9.1` sürümünde yöntem türde bulunur ancak hiçbir şey yapmaz.  
Bir tabloyu, notu veya tablo grubunu taşıma, rengini değiştirme, bir notu yeniden boyutlandırma ve görünümü kaydırma ya da yakınlaştırma işlemlerinin her biri küçük değişikliklerden oluşan bir akış hâlinde yapılır. Bir tablo grubunu yeniden boyutlandırma ise böyle yapılmaz: Sürükleme bittiğinde tek seferde gönderilir.  
Depo her akışı tek bir pakette toplar ve akış 200 ms boyunca sessiz kalana kadar iki aşamada bekletir. Bir renk değişikliği veya not yeniden boyutlandırması her iki aşamayı da geçer, bu yüzden `5.1.0` sürümünden önce her akışta olduğu gibi son değişiklikten yaklaşık 400 ms sonra gönderilir. `5.1.0` sürümünden itibaren bir sürükleme, kaydırma veya yakınlaştırma, vardığı yer olarak ilk aşamadan sonra, son adımından yaklaşık 200 ms sonra gönderilir ([Eşzamanlı düzenlemeler](#concurrent-edits) bölümüne bakın).  
Bir çağrı bu beklemeyi iki aşamada da sonlandırır. Depo bağlıyken abone, paketi çağrı dönmeden önce alır. Bekletilen bir şey yokken yapılan çağrı hiçbir şey göndermez.  
İster deponun kendisine ister düzenleyiciye ait olsun, `destroy` yöntemi hâlâ bekletilen bir paketi atar, bu yüzden bir sekme kapanırken olduğu gibi, bir depoyu bırakırken diğerlerinin son değişikliği koruması gerekiyorsa önce bu yöntemi çağırın.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

`5.1.0` sürümünden itibaren, düzenleyicinin ortak çalışma kayıtlarının bir kopyasını döndürür ([Eşzamanlı düzenlemeler](#concurrent-edits) bölümüne bakın).  
Kopya JSON üzerinden yapılır, bu yüzden `JSON.stringify` için hazır düz bir nesnedir ve ona yapılan bir değişiklik deponun kayıtlarını olduğu gibi bırakır.  
Onu olduğu gibi başka bir deponun [mergeLWW](#mergelww) veya [reseed](#reseed) yöntemine verin. Şekli düzenleyicinin kendisine aittir, bu yüzden hiçbir alanını okumayın.  
Bir katılan düzenleyiciyi [başlatmak](#seeding-a-collaborator) için onu [getVersion](#getversion) ve düzenleyicinin `runtimeValue` değeriyle aynı anda okuyun.

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

`5.1.0` sürümünden itibaren, başka bir deponun [getLWW](#getlww) ile verdiği kayıtları, her birinin büyük olan sürümünü tutarak bu deponunkilere alır ve `version` değerini düzenleyicinin saatine alır; saat kendi sürümü ile verilenin büyüğünü tutar.  
Belgede hiçbir şeyi değiştirmez: `value` ya da `runtimeValue` değerinde tek bir bayt bile değişmez, geri alma girdisi oluşmaz ve `change` olayı tetiklenmez. Yalnızca sonraki bir yazmanın aşması gereken sürümleri yükseltir; bu yüzden verilen kayıtlardan eski bir yazma sonradan reddedilir ve düzenleyicinin bir sonraki düzenlemesi `version` değerinin ötesinde bir sürüm taşır.  
Hiçbir şey göndermez ve hiçbir şeye yanıt vermez. Katılan bir düzenleyicinin ilk subscribe çağrısının diğerlerinin yanıtından aldığı şeydir, doğrudan alınmış hâliyle.  
Onu `setInitialValue` çağrısından sonra çağırın, asla önce değil: her `setInitialValue` ve her [reseed](#reseed), tutulan kayıtları ve onlarla birlikte ondan önceki bir `mergeLWW` çağrısının aldıklarını atar.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

`5.1.0` sürümünden itibaren, düzenleyicinin saatinin birleştirdiği en yüksek sürümü döndürür: yaptığı veya aldığı değişikliklerin, bir katılımın değiş tokuş ettiği kayıt isteklerinin ve yanıtların ve `mergeLWW` ya da `reseed` yöntemine verilen her `version` değerinin sürümlerinin en büyüğü.  
İmleçler, odaklar, seçimler ve sürükleme kutuları, kendisinin ya da başka bir düzenleyicinin olsun, onu ilerletmez.  
Onu aynı anda okunan [getLWW()](#getlww) ile birlikte, katılan bir düzenleyicinin [mergeLWW](#mergelww) veya [reseed](#reseed) yöntemine verin. Eylemlerinin taşıdığı sürümler gibi bir [yazma sürümüdür](#concurrent-edits).

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

`5.1.0` sürümünden itibaren, verilen kimliğe sahip düzenleyicinin gönderdiği imleci, odağı, seçimi ve sürükleme kutusunu, her birinin beklediği sona erme süresiyle birlikte hemen kaldırır. Diğer her düzenleyicininkiler kalır.  
Kimlik, o düzenleyicinin paylaşılan deposunun gönderdiği her eylemin taşıdığı `meta.editorId` değeridir. Bu düzenleyicinin hakkında hiçbir şey tutmadığı bir kimlik hiçbir şeyi değiştirmez.  
Taşıma katmanınız bir eşin ayrıldığını öğrendiğinde onu çağırın. Aksi hâlde eşin gönderdikleri süreleri dolana kadar çizili kalır: imleci alınan son imleçten 30 saniye sonra, odağı ve seçimi 90 saniye sonra, sürükleme kutusu ise 3 saniye sonra.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

`5.1.0` sürümünden itibaren, bir oturumun belgesini, yeniden katılmada olduğu gibi düzenleyicide yeniden açar. [Yjs](./yjs.md) bağlaması, başlatılmış bir odaya bağlanırken odanın belgesini açmak için ve her yeniden katılmada, odaya katıldıktan sonra ekranı koruyarak bunu çağırır.  
`value` değerini [setInitialValue](../erd-editor-element.md#setinitialvalue) gibi yükler, `lww` ve `version` değerlerini [mergeLWW](#mergelww) gibi alır; böylece depo tam olarak verilen kayıtları tutar, saati ise kendi sürümü ile `version` değerinin büyüğünü. Ayrıca geri alma geçmişini boşaltır ve `setInitialValue` yönteminden farklı olarak seçimi ve odağı atar, çünkü bunlar artık değerin tutmadığı şeyleri gösteriyor olabilir.  
Aşağıdaki mantıksal ad türetmesi dışında geri alma girdisi oluşturmaz, `change` olayı tetiklemez ve hiçbir değişiklik göndermez. Depo bir abone edindikten sonra, bu türden her yüklemenin gönderdiği kayıt isteğini gönderir; kayıtları zaten devretmiş bir taşıma katmanı bunu atabilir. [focusTracker](#focustracker) açıksa, temizlenen seçimi ve odağı da gönderir.  
`setInitialValue` gibi [readonly](../erd-editor-element.md#readonly) ayarlıyken de çalışır, bir Akış modu görünümünü atar, çizilmekte olan bir ilişkinin çizimini bitirir ve not, tablo grubu adı ve hücre düzenleyicilerini kapatır, içlerine yazılanı aynı şekilde korur ya da atar; kapanan bir mantıksal ad hücresinin okuyucusunun yazdığından türettiği bir ad ise sıradan bir düzenlemedir: gönderilir, geri alınabilir ve `change` olayı olarak tetiklenir.

`keepScreen` olmadan ekran, `setInitialValue` sonrasında olduğu gibi değerin tuttuğunu gösterir. `keepScreen: true` ile okuyucunun ekranı, yalnızca o ekranda, yüklenen belgenin üzerine geri yerleştirilir:

- kaydırma konumu ve yakınlaştırma düzeyi, öğe bunları gösterdikten sonra; hiç gösterilmemiş ya da gizliyken yüklenmiş ve sonra gösterilmemiş bir öğe, geç katılan bir düzenleyicide olduğu gibi değerin koyduğu yerde açılır;
- yükleme sekmeyi hareket ettirdiyse sekme ve Ayarlar sekmesinde ayrıca okuyucunun geldiği sekme; orada alınan bir `Canvas Type` kilidi bu sekmeyi adlandırır;
- okuyucunun kilidi altında kendi gösterdiği Ad görünümü ve her Kod oluşturucu ayarı; ancak bu yalnızca o kilit yüklemeden önce etkinse, yüklemeden sonra da etkinse ve aynı kilitli değeri tutuyorsa geçerlidir. Bu yüzden bir eş bu arada bir ayarın kilidini açıp değiştirip başka bir değerde yeniden kilitlediyse düzenleyici yeni kilitli değerde açılır; kilit yüklemeden önce ya da sonra devre dışıysa yüklenen değeri gösterir;
- salt okunur bir okuyucunun kendi ekranında değiştirdiği her ayar, kilitler ne derse desin.

Bunların hiçbiri gönderilmez ve `value` ile `runtimeValue` yine yüklenen belgeyi bildirir. Bir eşin sonradan yaptığı kilit açma, her kilit açmanın yaptığı gibi, bu şekilde korunan bir kod ayarının yerine geçer.  
Düzenleyici düzenleme yapabilirken okuyucunun bir sonraki kaydırması ya da yakınlaştırması, korunan kaydırma konumunu ve yakınlaştırma düzeyini yeniden belgenin yapar ve ekranın bulunduğu yer önde olacak şekilde gönderilir, böylece replikalar da o yakınlaştırmayı alır.

Bir `reseed` çağrısı, deponun beklettiklerini olduğu gibi bırakır. Hâlâ bekletilen bir sürükleme, kaydırma veya yakınlaştırma, yeniden açılan belgeden okunarak ondan sonra gönderilir; bir renk değişikliği veya not yeniden boyutlandırması, düzenleyici artık onu göstermese de yapıldığı gibi gönderilir; `disconnect()` çağrısının beklettiği ise `connection()` çağrısında gönderilir.  
Bu yüzden önce [flushStreamBuffers](#flushstreambuffers) yöntemini çağırın, yayımladığını gönderin ve onu tutan bir değerle `reseed` çağırın. Bağlantı kesikken `reseed` yöntemini asla çağırmayın.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

sharedStore örneğini tamamen yok eder.  
Düzenleyicinin kendisine dokunulmaz, bu yüzden bir oturumdan ayrılmak belgeyi düzenlenebilir bırakır.  
Fare ve odak izleyicileri, düzenleyicinin verdiği son sharedStore yok edildiğinde durur.  
Deponun hâlâ bekletmekte olduğu bir akış paketi de onunla birlikte atılır. Göndermek için önce [flushStreamBuffers](#flushstreambuffers) yöntemini çağırın.  
Diğer düzenleyicilerin gönderdiği imleçler, odaklar, seçimler ve sürükleme kutuları süreleri dolana kadar çizili kalır; `5.1.0` sürümünden itibaren [forgetPeer](#forgetpeer) bir düzenleyicininkileri hemen kaldırır.

```js
sharedStore.destroy();
```
