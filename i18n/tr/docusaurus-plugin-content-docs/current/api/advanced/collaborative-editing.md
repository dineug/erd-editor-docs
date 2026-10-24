---
sidebar_position: 1
description: getSharedStore ile düzenleyici değişikliklerini örnekler arasında aktarma, katılan bir düzenleyiciyi runtimeValue ile başlatma ve her ortak çalışanın imlecini, odağını, seçimini ve sürükleme kutusunu gösterme.
---

# Ortak düzenleme

`getSharedStore()` yöntemi bir düzenleyiciyi ortak düzenleme oturumunda bir düğüme dönüştürür.  
Her değişikliği bir eylem akışı olarak yayımlar ve diğer düzenleyicilerin geri gönderdiği eylemleri uygular – aradaki taşıma katmanını (WebSocket, WebRTC ya da JSON taşıyabilen başka herhangi bir şey) siz sağlarsınız.  
[ErdEditorElement](../erd-editor-element.md) yöntemlerinden biridir ve aktarılan değişikliklerin ayrıca depolanması gerektiğinde [Uzak depolama](./remote-storage.md) ile birlikte kullanılır.

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

Eylem, belgedeki tek bir değişikliği tanımlayan serileştirilebilir düz bir nesne olduğundan taşıma katmanına giderken `JSON.stringify` çağrısından bozulmadan geçer.  
Eylemler paketler hâlinde gelir: `subscribe` yöntemi bir dizi verir ve bu dizi tek bir birimdir – onu bütün olarak aktarın ve karşı tarafta da bütün olarak dispatch yöntemine verin.  
Eylemi okumak ya da yeniden yazmak yerine içine bakılmayan bir değer olarak ele alın ve olduğu gibi iletin, çünkü düzenleyicilerin eşitlenmiş kalmasını sağlayan şey eylemin taşıdığı iç kayıtlardır.

Bir düzenleyicide yapılanların bir kısmı o düzenleyicide kalır.  
Bir tabloyu, notu veya tablo grubunu öne getirme işlemi gönderilmez; bunlardan birini seçmek de onu öne getirir.  
[Şema SQL](../../guide/guides/schema-sql.md) sekmesindeki `Statements`, `Header`, `Write logical names into empty comments` (`4.2.0` sürümünden itibaren) ve `Tables` seçimleri de yapıldıkları pencereye ait oldukları için gönderilmez.  
`4.1.0` sürümünden itibaren [Gezgin](../../guide/guides/explorer.md) de kendi düzenleyicisinde kalır: Açık olup olmadığı, genişliği, daraltılmış satırları, klavye odağının bulunduğu satır, ağacının kaydırma konumu, araması ve seçenekleri gönderilmez.  
Bir yabancı anahtara gidildiğinde ilişkisinin bağlantı çizgisine uygulanan [vurgu](../../guide/guides/relationship-editing.md#reading-a-connector) da gönderilmez.  
`4.2.0` sürümünden itibaren [Sözlük](../../guide/guides/dictionary.md) sekmesi de kendi düzenleyicisinde kalır: Hangi sayfanın gösterildiği ve her sayfanın araması, seçimi, kaydırma konumu ve sütun genişlikleri gönderilmez. Sekmedeki düzenlemeler, sıralamalar ve CSV içe aktarmaları ise gönderilir.  
Kaydırma, yakınlaştırma veya sekme geçişi gönderilir, ancak hiçbir zaman başka bir kullanıcının görünümünü ya da sekmesini değiştirmez. Gezginden yapılan bir atlamanın oluşturduğu kaydırma, Gezgin başka bir sekmeden açıldığında ERD sekmesine yapılan geçiş ve Sözlük sekmesindeki [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) sayfasından bir tabloya veya sütuna yapılan atlamanın sekme geçişi ile kaydırması da buna dahildir. O sayfadan bir sözcüğe, terime veya değer alanına yapılan atlama Sözlük sekmesinde kalır, bu yüzden bunun hiçbir kısmı gönderilmez.

`4.2.0` sürümünden itibaren bir [Ad görünümü](../../guide/guides/logical-names.md#switching-the-view) değişikliği de gönderilir ve diğer düzenleyicilerin bu değişiklikle ne yapacağına Ad görünümünün [kilidi](../../guide/guides/settings.md#lock) karar verir. `Name View` kilidi yeni bir diyagramda ve `4.2.0` sürümünden önceki her belgede etkindir.  
Kilit etkinken görünüm değişikliği yalnızca onu yapan düzenleyicide görünür: Değişiklik yine gönderilir, ancak diğer her düzenleyici ve her replika onu atar; böylece `value` kilitli görünümü korurken her kullanıcı farklı bir görünüme bakabilir. Dil, ad biçimi veya tırnak türü değişikliği ise farklıdır: Kilidi etkin olsun ya da olmasın her düzenleyiciye ulaşır.  
Kilit devre dışıyken düzenleme yapabilen bir düzenleyicide yapılan görünüm değişikliği, her düzenleyicide ve replikada Ad görünümünü değiştirir; en son değişiklik geçerli olur ve hepsi onu kaydeder.  
Salt okunur bir düzenleyicinin kendi görünüm değişikliği her zaman o düzenleyicide kalır ve düzenleyici diğerlerinin paylaşılan değişikliklerini yine izler.

[Kilitler](../../guide/guides/settings.md#lock) paylaşılır: Bir ayarın en son kilitlenmesi ya da kilidinin açılması her düzenleyicide geçerli olur ve kilit, onu etkinleştiren düzenleyicinin değerlerini taşır, böylece her düzenleyici ve replika aynı değeri kaydeder.  
Bu nedenle `Viewport` kilidi onu etkinleştiren düzenleyicinin görünümünü, `Canvas Type` kilidi ise o düzenleyicinin, kilitlerin etkinleştirildiği Ayarlar sekmesinden önce bulunduğu son sekmeyi kaydeder.  
`Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` veya `4.2.0` sürümünden itibaren `Name View` kilidini devre dışı bırakmak, her düzenleyicideki o ayarı da kilidi devre dışı bırakan düzenleyicide gösterilen değere getirir, böylece tümü tek bir değeri kaydetmeye devam eder. `Viewport` veya `Canvas Type` kilidini devre dışı bırakmak kimsenin görünümünü ya da sekmesini değiştirmez.

`Before tables` veya `After tables` betiğinde yapılan bir düzenleme, betiğin alanı odaktan çıktığında bütün olarak gönderilir. İki betik ayrı ayrı çözümlenir, bu yüzden bir ortak çalışanın birinde yaptığı düzenleme asla diğerinin üzerine yazmaz.

Görselleştirme sekmesinin [Akış modunda](../../guide/guides/visualization.md#flow-never-edits-the-document) yapılan hiçbir şey belge değişikliği değildir, bu yüzden Akış modundaki bir düzenleyici diğerlerine hiçbir değişiklik göndermez ve diğerlerinin gönderdiği değişiklikler o Akış modundayken de uygulanmaya devam eder.  
İki istisna vardır. Akış modundan başka bir sekmeye geçmek bir sekme geçişidir ve diğerleri gibi gönderilir. `4.2.0` sürümünden itibaren Akış modunda araç çubuğundaki Ad görünümü listesinden yapılan bir seçim bir Ad görünümü değişikliğidir ve tuvalde yapılan bir değişiklik gibi gönderilip uygulanır.  
Akış modunda [görünümler arasında adım adım ilerleyen](../../guide/guides/visualization.md#previous-table-and-next-table) `Previous table`, `Next table` ile geri alma ve yineleme tuşları gönderilmez.  
Dış bağlantı kart düğmesi, `#`, `@` veya `:` önekinden sonra seçilen bir [Hızlı arama](../../guide/guides/quick-search.md#searching-the-diagram) sonucu ve [Gezginin](../../guide/guides/explorer.md#opening-and-closing) açılması, düzenleyiciyi Akış modundan ERD sekmesine geçirir. Kart düğmesinin ya da bir Hızlı arama sonucunun orada yaptığı kaydırma da gönderilir.

## Tek sayfada iki düzenleyici {#two-editors-on-one-page}

Buradaki subscribe ile dispatch arasındaki bağlantı ağın yerini tutar, böylece araya bir taşıma katmanı girmeden bir oturumun yapısını görebilirsiniz.

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

Buradaki iki düzenleyici de aynı yeni, boş belgeyle başlar, bu yüzden hiçbirinin ilk içerikle başlatılması gerekmez.  
Üç veya daha fazla düzenleyici olduğunda her birinin paketlerini diğerlerinin hepsine gönderin: Bir düzenleyici aldığını asla başkasına iletmez.

## Ortak çalışanı başlatma {#seeding-a-collaborator}

Paylaşılan depo değişiklikleri yapıldıkları anda aktarır ve katılan bir düzenleyiciye belgenin o anki hâlini asla vermez, bu yüzden hâlihazırda süren bir oturuma katılan bir düzenleyiciye önce belgenin verilmesi gerekir.  
`4.0.0` sürümünden itibaren onu `value` değeriyle ya da kaydedilmiş dosyayla değil, oturumda zaten bulunan bir düzenleyicinin [`runtimeValue`](../erd-editor-element.md#runtimevalue) değeriyle başlatın.

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
`4.0.0` sürümünden itibaren bu çağrı, düzenleyicinin eşzamanlı düzenlemeleri çözümleyen ortak çalışma kayıtlarını da atar. Düzenleyicinin paylaşılan deposunun daha önce bir abonesi olduysa depo, ilk [subscribe](#subscribe) çağrısında olduğu gibi diğer düzenleyicilerden onların kayıtlarını yeniden ister, böylece oturumun ortasında yeniden yüklenen bir düzenleyici düzenlemeleri diğerleriyle aynı şekilde çözümler.  
`value` özelliğine atama yapmak kayıtları korur, ancak `setInitialValue` çağrısının aksine aktarılır: Düzenleyicinin bir paylaşılan deposu olduğu andan itibaren oturumdaki her düzenleyici atanan belgeyi yükler, bu yüzden katılan bir düzenleyiciyi asla bu şekilde başlatmayın.

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

`4.0.0` sürümünden önceki bir düzenleyici yeni eylem türlerini yok sayar: Bir tablo grubunu ya da hangi tabloların grupta olduğunu asla görmez, yine de grup sürükleme tabloların `table.move` eylemlerini de gönderdiği için grubun tabloları orada da taşınır.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Düzenleyicideki değişikliklere abone olur.  
En az bir abone olana kadar düzenleyiciden hiçbir şey çıkmaz ve o zamana kadar yapılan değişiklikler arabelleğe alınır.  
İlk subscribe çağrısı ayrıca diğer düzenleyicilerden, eşzamanlı düzenlemeleri çözümleyen ortak çalışma kayıtlarını ister, böylece sonradan katılan bir düzenleyici bu düzenlemeleri aynı şekilde çözümler.  
Belgeyi getirmez, bu yüzden sonradan katılan bir düzenleyiciyi önce [ilk içerikle başlatın](#seeding-a-collaborator).  
`4.0.0` sürümünden itibaren depo, bu ilk subscribe çağrısından sonra `setInitialValue` yöntemi düzenleyicisine her belge yüklediğinde kayıtları yeniden ister.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Bu deponun hâlâ bekletmekte olduğu akış paketlerini, sessiz sürelerinin bitmesini beklemeden hemen gönderir.  
`3.9.2` sürümünden itibaren `getSharedStore` yönteminden alınan bir depoda çalışır. `3.9.1` sürümünde yöntem türde bulunur ancak hiçbir şey yapmaz.  
Bir tabloyu, notu veya tablo grubunu taşıma, rengini değiştirme, bir notu yeniden boyutlandırma ve görünümü kaydırma ya da yakınlaştırma işlemlerinin her biri küçük değişikliklerden oluşan bir akış olarak gelir. Bir tablo grubunu yeniden boyutlandırma ise böyle gelmez: Sürükleme bittiğinde tek seferde gönderilir.  
Depo her akışı tek bir pakette toplar ve akış 200 ms boyunca sessiz kalana kadar bekletir. Bunu iki aşamada yaptığı için paket, son değişiklikten yaklaşık 400 ms sonra gönderilir.  
Bir çağrı bu beklemeyi iki aşamada da sonlandırır. Depo bağlıyken abone, paketi çağrı dönmeden önce alır. Bekletilen bir şey yokken yapılan çağrı hiçbir şey göndermez.  
İster deponun kendisine ister düzenleyiciye ait olsun, `destroy` yöntemi hâlâ bekletilen bir paketi atar, bu yüzden bir sekme kapanırken olduğu gibi, bir depoyu bırakırken diğerlerinin son değişikliği koruması gerekiyorsa önce bu yöntemi çağırın.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

sharedStore örneğini tamamen yok eder.  
Düzenleyicinin kendisine dokunulmaz, bu yüzden bir oturumdan ayrılmak belgeyi düzenlenebilir bırakır.  
Fare ve odak izleyicileri, düzenleyicinin verdiği son sharedStore yok edildiğinde durur.  
Deponun hâlâ bekletmekte olduğu bir akış paketi de onunla birlikte atılır. Göndermek için önce [flushStreamBuffers](#flushstreambuffers) yöntemini çağırın.

```js
sharedStore.destroy();
```
