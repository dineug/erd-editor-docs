---
sidebar_position: 2
description: Canlı bir düzenleyiciyi ana iş parçacığı dışında headless bir depoya replike etme ve belgeyi depolama için serileştirme.
---

# Uzak depolama

Her değişiklikte düzenleyicinin tüm durumunu göndermek verimsizdir.  
Bu durum için düzenleyici, gerçek zamanlı veri replikasyonu sağlayan bir API sunar.

## Kurulum {#installation}

```sh
npm install @dineug/erd-editor
```

Replikasyon deposu paketin kökünde değil, `@dineug/erd-editor/engine.js` alt yolunda bulunur.  
Bu giriş noktası DOM'a hiç dokunmaz; bu yüzden bir Web Worker'da ya da ana iş parçacığı dışındaki herhangi bir yerde çalışır.  
Bunun yerine paketin kökünü içe aktarmak bir belge gerektirir: `5.0.0` sürümünden itibaren hiçbir öğe tanımlamaz, ancak değerlendirilirken her iki öğe sınıfını da oluşturur. `5.0.0` sürümünden önce `<erd-editor>` özel öğesini kaydediyordu.

## Kullanım {#usage}

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

## Canlı bir düzenleyiciyi replike etme {#replicating-a-live-editor}

Eylemler canlı bir düzenleyicinin paylaşılan deposundan gelir.  
[Ortak düzenleme](./collaborative-editing.md) sayfasına bakın.

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

Sınırı yalnızca değişiklik geçer, hiçbir zaman belgenin tamamı geçmez.  
Replika değişikliği uygular ve sonucu kendi tarafında serileştirir.  
`change` bu sonucu `value` olarak iletir, `changed` ise sonucun ne zaman yazılmaya değer olduğunu bildirir.

`4.0.0` sürümünden itibaren replikayı, yukarıdaki gibi, depolanan dosyayla ya da düzenleyicinin `value` değeriyle değil, düzenleyicinin `runtimeValue` değeriyle başlatın.  
Dosyada, kaydedildiğinden bu yana yapılan düzenlemeler yoktur; `value` değerinde de oturumda kaldırılan varlıklar yoktur.  
Kaldırılan bir tablo olmadan başlatılan bir replika, bir düzenleyici bu kaldırmayı geri aldığında tabloyu adı ve sütunları olmadan geri getirir ve onu bu hâliyle kaydeder.  
`4.2.0` sürümünden itibaren aynı durum bir [Sözlük](../../guide/guides/dictionary.md) sayfasından kaldırılan bir sözcük, terim veya değer alanı için de geçerlidir.  
Bir düzenleyici kaldırmayı geri aldığında, satır olmadan başlatılan bir replika onu yeniden boş olarak listeler ve `value` boş bir satırı dışarıda bıraktığı için replika belgeyi bu satır olmadan kaydeder.  
Bir değer alanı söz konusu olduğunda, ona bağlanan sütunlar ve terimler de o replikada bağlantısız kalır, çünkü replika bu bağlantıları hiç tutmamıştır ve geri alma işlemi onları göndermez.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Bir dizeyi piksel cinsinden ölçer.  
Deponun DOM'u olmadığından metni kendisi ölçemez; bir ad, veri türü, varsayılan değer veya açıklama her değiştiğinde sütun genişliklerini bu işlevle yeniden hesaplar.  
`4.2.0` sürümünden itibaren buna bir tablonun veya sütunun [mantıksal adı](../../guide/guides/logical-names.md) da dahildir.  
Depo, bir sütunun bağlandığı değer alanının adını gösteren değer alanı hücresini, sütun bir değer alanına bağlandığı ya da bağlantısı kaldırıldığı ve o değer alanı eklendiği, yeniden adlandırıldığı ya da kaldırıldığı her seferde ölçer.  
Depo, [setInitialValue](#setinitialvalue) bir belge yüklediği her seferde tüm tabloları ve sütunları da yeniden ölçer.  
`4.0.0` sürümünden itibaren genişlikler yalnızca [runtimeValue](#runtimevalue-getter) içinde tutulur, hiçbir zaman `value` içinde tutulmaz.  
Bu nedenle bu sürümün kaydettiği bir belge, nerede kaydedilmiş olursa olsun ve orada metin nasıl ölçülmüş olursa olsun, bayt bayt aynı `value` değeri olarak geri okunur.

Düzenleyicinin ölçtüğü gibi ölçün – düzenleyicinin yazı tipi yığınında `400 12px` ile ölçüp yuvarlayın ve 2 px dolgu ekleyin.  
Aksi takdirde `runtimeValue` içindeki genişlikler ekrandakilerden sapar.

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

`text.length * 10`, kullanılabilir bir tuval olmadığında başvurulan yedek yöntemdir.  
Belgesi yalnızca depolanan, hiçbir zaman ekrana çizilmeyen bir depo için bu yeterlidir.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Düzenleyicinin geçerli durumunu serileştirir.  
Ayrıştırılmış bir nesne değil, olduğu gibi depolanmaya hazır bir JSON dizesi döndürür.

```js
const data = replicationStore.value;
```

`4.0.0` sürümünden itibaren `value` depolama biçimidir: belgenin bir dosyada tutulduğu hâli, yani öğenin [value](../erd-editor-element.md#value) özelliğinin döndürdüğü metnin aynısı.  
Yalnızca canlı varlıkları sabit bir sırayla tutar; kaldırılan varlıkları, katman sırasını ve [toWidth](#towidth) işlevinin ölçtüğü genişlikler gibi bir yüklemenin yeniden hesapladığı hiçbir şeyi içermez.  
`4.2.0` sürümünden itibaren mantıksal adları, her adın sözlüklerden türetilip türetilmediğini, değer alanı bağlantılarını ve [Sözlük](../../guide/guides/dictionary.md) sekmesinin sözcüklerini, terimlerini ve değer alanlarını da tutar.  
`4.2.0` sürümünden itibaren bir varlığın her boş metin alanını, hiçbir şey tutmayan her `doc` listesini ve koleksiyonu ve tüm koleksiyonlar boş olduğunda `collections` alanının kendisini de dışarıda bırakır.  
İki boşlukla girintilenir, her sözlük satırını ayrı bir satırda tutar ve bir satır sonuyla biter; böylece aynı belge her zaman aynı baytları verir.  
Neleri tuttuğu için [Depolama biçimi ve çalışma zamanı değeri](./schema.md#storage-form-and-runtime-value) bölümüne bakın.

[Kilidi](../../guide/guides/settings.md#lock) etkin olan her ayar kilitlendiği değerle, diğer her ayar ise o anki hâliyle yazılır.  
`Viewport` kilidi görünümün başlangıç noktasını ve yakınlaştırma düzeyini birlikte kapsar; sekmenin, Kod oluşturucu dilinin, her iki ad biçiminin ve tırnak türünün ise her birinin kendi kilidi vardır.  
`4.2.0` sürümünden itibaren [Ad görünümünün](../../guide/guides/logical-names.md#name-view) de kendi kilidi vardır; bu `Name View` kilidi yeni bir belgede etkindir.  
Kilitler, belgenin `ignoreSaveSettings` alanının yerini alır; bu alan `4.0.0` sürümünden itibaren ne okunur ne de yazılır.  
`4.0.0` sürümünden önce `value`, deponun tuttuğu hâliyle belgenin tamamıydı ve bu alanın kaydırma ve yakınlaştırma bitleri ona uygulanırdı.

### runtimeValue getter {#runtimevalue-getter}

`4.0.0` sürümünden itibaren, belgeyi kaldırılan varlıklar ve bir yüklemenin hesapladığı her şey dahil, replikanın tuttuğu hâliyle serileştirir.  
Burada da kilitli her ayar kilitli değeriyle yazılır.

```js
const snapshot = replicationStore.runtimeValue;
```

Sonradan katılan bir düzenleyiciyi veya başka bir depoyu, onun `setInitialValue` yöntemiyle başlatmak için bunu kullanın. [Ortak düzenleme](./collaborative-editing.md) sayfasına bakın.  
Bunu asla dosya olarak depolamayın: Kaldırılan varlıkları taşır ve yayımlanan [JSON Schema](./schema.md#json-schema) onu reddeder.  
Sonradan gönderilen bir kaldırma geri alma işleminin, bu değerle başlatılan depoda varlığı eksiksiz geri getirmesini sağlayan da bu kaldırılan varlıklardır.  
Bu varlıklar, belge bir sonraki sefer kendi dosyasından açılana kadar kalır; dosyanın biçimi onları içermez.

### setInitialValue {#setinitialvalue}

Daha önce depolanmış düzenleyici durumunu yükler.

```js
replicationStore.setInitialValue('json...');
```

Depolama biçimini, bir çalışma zamanı değerini ya da v2 belgesi dahil daha eski bir sürümün kaydettiği bir belgeyi kabul eder.  
Boş bir dize ya da dize olmayan herhangi bir şey, hata fırlatmak yerine yeni ve boş bir belge yükler.  
Kendisine hiç değer verilmemiş bir depo da aynı yeni belgeyle başlar.  
`4.0.0` sürümünden itibaren bu belgede her [kilit](../../guide/guides/settings.md#lock) etkindir; bu yüzden deponun replike ettiği düzenleyiciler kaydırırken, yakınlaştırırken, sekme değiştirirken veya bu ayarları değiştirirken belgenin `value` değeri başlangıçtaki görünümü, sekmeyi, Kod oluşturucu dilini, ad biçimlerini ve tırnak türünü korur. `3.10.0` sürümünde bu belge ne kaydırmayı ne de yakınlaştırmayı kaydediyordu, ondan önce ise ikisini de kaydediyordu.  
`4.2.0` sürümünden itibaren düzenleyiciler kendi Ad görünümlerini değiştirirken belge de kendi Ad görünümünü, yani `Physical Names` görünümünü korur.  
Depolanmış bir belge, belirttiği kilitleri korur.  
Hiç kilit belirtmeyen bir belge, yani v2 belgesi dahil `4.0.0` sürümünden önce kaydedilmiş her belge, tüm kilitler etkin olarak yüklenir: Ne kaydetmiş olursa olsun görünümün başlangıç noktası `0, 0`, yakınlaştırma düzeyi `1` ve sekmesi ERD olur; Kod oluşturucu dili, ad biçimleri ve tırnak türü ise kaydettiği gibi kalır.  
`4.2.0` sürümünden önce kaydedilmiş bir belge hiçbir `Name View` kilidi belirtmez; bu yüzden diğer tüm kilitleri devre dışı olarak kaydedilmiş olsa bile bu kilit etkin olarak ve `Physical Names` görünümünde yüklenir.  
`4.0.0` sürümünden itibaren `setInitialValue`, öğenin [setInitialValue](../erd-editor-element.md#setinitialvalue) yönteminin yaptığı gibi, önceki belge için tutulan ortak çalışma kayıtlarını da temizler.  
Birleştirme çakışması işaretleriyle kalmış bir dosya gibi JSON olmayan bir metin de hata fırlatmaz: Ayrıştırma hatası yalnızca konsola yazılır, belge boşaltılır ve ayarlar olduğu gibi kalır.

`4.0.0` sürümünden itibaren yükleme sırasında çöp toplama çalışmaz; bu yüzden kaldırılan varlıklar [runtimeValue](#runtimevalue-getter) içinde kalır.  
Önceden yükleme, artık `doc` içinde yer almayan ve dört gün ya da daha uzun süredir dokunulmamış varlıkları atardı.

Yüklemenin yaptığı yeniden yazımlar `setInitialValue` dönmeden önce tamamlanır: sütunlardaki, her sütunun seçeneklerinden ve ilişkilerden okunan anahtar işaretleri; `toWidth` ile yeniden ölçülen her tablo ve sütun genişliği; her bağlantı çizgisinin tablolarına değdiği noktalar; ve her ilişkinin tanımlayıcı bayrağı ile üst tablo ucundaki simge.  
Bunların hiçbiri `value` değerinin parçası değildir, ancak çağrının hemen ardından okunan `replicationStore.runtimeValue` hepsini zaten içerir.  
Yeniden oynatılan bir kaydırma gibi yüklemenin hemen ardından gelen bir eylem, yüklenen belgeye göre ölçülür; bu yüzden yüklemenin kendisi hiçbir zaman [`changed`](#onchange) olarak bildirilmez.

Ne yükleme ne de bu yeniden yazımlardan herhangi biri `change` olayını tetikler.  
Yüklenen belgenin depolama biçiminde geri yazılmasını istiyorsanız, `setInitialValue` döndükten sonra `replicationStore.value` değerini kendiniz okuyun.

### on@change {#onchange}

Düzenleyicinin durumundaki değişikliklere abone olur.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` olayı 200 ms geciktirilir; böylece art arda gelen eylemler tek bir bildirim olarak ulaşır.  
Yalnızca belgeyi değiştirebilecek türdeki eylemler ve ayrıca eski bir düzenleyicinin hâlâ gönderebileceği `settings.changeIgnoreSaveSettings` eylemi için tetiklenir ([dispatch, dispatchSync](#dispatch-dispatchsync) bölümüne bakın).  
Aktarılan bir anlık durum bilgisi eylemi ya da `editor.mergeLWW` eylemi onu asla tetiklemez.  
Aboneliği sonlandırmak için döndürülen işlevi çağırın.

`3.10.0` sürümünden itibaren dinleyici, `@dineug/erd-editor/engine.js` giriş noktasının `ReplicationStore` ile birlikte dışa aktardığı bir tür olan `ReplicationChange` değerini alır.  
`3.10.0` sürümünden önce hiçbir şey almıyordu; argümanı yok sayan bir dinleyici çalışmaya devam eder.  
`value`, depolama biçiminde serileştirilmiş belgedir, yani `replicationStore.value` değerinin o anda döndürdüğü dizenin aynısıdır; bu yüzden onu yeniden serileştirmeye gerek yoktur.  
Önceki `change` olayından ya da yüklemeden bu yana gelen eylemler `value` değerini bayt bayt olduğu gibi bıraktığında `changed` değeri `false` olur.

Bir [kilidin](../../guide/guides/settings.md#lock) `value` dışında bıraktığı bir değişiklik yine de `change` olayını tetikler ve `changed` değeri `false` olur; bu yüzden yalnızca `changed` değeri `true` olduğunda yazın.  
Bunlar `Viewport` kilitliyken yapılan bir kaydırma veya yakınlaştırma, `Canvas Type` kilitliyken yapılan bir sekme değişikliği ve kendi kilidi etkinken Kod oluşturucu dilinin, bir ad biçiminin ya da tırnak türünün değiştirilmesidir.  
`4.2.0` sürümünden itibaren `Name View` kilitliyken yapılan bir Ad görünümü değişikliği de bunlardandır: Düzenleyici onu yine gönderir, ancak replika onu diğer düzenleyicilerin yaptığı gibi atar.  
Salt okunur bir düzenleyicide yapılan bir Ad görünümü değişikliği de, kilidi ne olursa olsun, aynı şekilde atılır.  
Öğenin [change](../erd-editor-element.md#change) olayı böyle bir değişikliği dışarıda bırakır, ancak replika onu yine de bildirir.  
Yeni bir belgede ve `4.0.0` sürümünden önce kaydedilmiş bir belgede tüm kilitler etkindir; `4.2.0` sürümünden önce kaydedilmiş her belgede de `Name View` kilitlidir.  
`Viewport` kilitli değilken bir kaydırma veya yakınlaştırma `value` değerini değiştirir; `Canvas Type` kilitli değilken düzenleyicinin başka bir sekmesini açmak, `Name View` kilitli değilken de salt okunur olmayan bir düzenleyiciden gelen bir Ad görünümü değişikliği aynısını yapar.  
Bir kilidi etkinleştirmek veya devre dışı bırakmak da `value` değerini değiştirir.

`4.0.0` sürümünden itibaren `changed`, ne kaldırılan varlıkları ne de katman sırasını tutan depolama biçimini karşılaştırır.  
Bu nedenle tek bir `change` içinde eklenip yeniden kaldırılan bir tablo, başka bir ortak çalışanın kaldırdığı bir varlığa denk gelen bir düzenleme ve yalnızca katman sırasını değiştiren aktarılmış bir yükleme de `changed` değeri `false` olarak sonuçlanır.  
`4.2.0` sürümünden itibaren bir Sözlük sayfasına eklenip boş bırakılan bir satır da aynı sonucu verir, çünkü depolama biçimi hiçbir şey tutmayan bir satırı dışarıda bırakır.

`changed` hiçbir zaman, yüklendiği anda `value` değerinden zaten farklı olabilecek depoladığınız dosyayla karşılaştırma yapmaz: Daha eski bir sürümün kaydettiği bir dosya, v2 dosyası dahil, farklıdır; bayt sırası işaretiyle başlayan bir dosya ve elle düzenlenmiş bir dosya da öyle.  
`4.2.0` sürümünden itibaren buna `4.0.0` veya `4.1.0` sürümünün kaydettiği bir dosya da dahildir, çünkü `value`, böyle bir dosyanın içerdiği, varlıklarının boş metin alanlarını, boş `doc` listelerini ve koleksiyonlarını dışarıda bırakır.  
Böyle bir dosyayla baytları karşılaştırmak, bir kilidin dışarıda bıraktığı bir kaydırmayı bile düzenleme olarak sayardı.  
`changed` değeri `true` olan ilk `change` olayı böyle bir dosyayı depolama biçiminde geri verir; bu yüzden onu yazmak dosyayı bir kez yeniden yazar.  
[toWidth](#towidth) bölümünde açıklandığı gibi, bu sürümün kaydettiği bir dosya nerede kaydedilmiş olursa olsun farklı olmaz.  
Bir `change` hâlâ beklerken `setInitialValue` çağrısı gelirse ve o `change` zamanı gelmeden hiçbir şey gönderilmezse, bu `change` yine de yüklenen `value` değeriyle ve `changed` değeri `false` olarak gelir.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Uzak düzenleyicilerdeki değişiklikleri replicationStore'a uygular.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` uygulamayı bir mikro göreve erteler, `dispatchSync` ise paketi hemen uygular.

Paylaşılan bir deponun akışını filtrelemeden iletebilirsiniz.  
Her iki yöntem de yalnızca belgeyi değiştirebilecek türdeki eylemleri ve bu bölümün sonunda açıklanan iki eylemi tutar, geri kalanını atar; böylece bir ortak düzenleme oturumunun taşıdığı anlık durum bilgisi – her kullanıcının fare imleci, odağı, seçimi ve sürükleme kutusu – hiçbir etki yapmadan geçip gider.

`3.10.0` sürümünden itibaren tutulan eylemler arasında `relationship.changeOnDelete` ve `relationship.changeOnUpdate` de vardır; `relationship.add` eylemi de `onDelete` ve `onUpdate` alanlarını taşır.  
Daha eski bir sürümden gelen bir depo bu eylemleri atar ve bu alanları yok sayar; bu yüzden bir ilişkinin [ON DELETE ve ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) eylemlerini kaybeder.

`4.0.0` sürümünden itibaren tutulan eylemler arasında ayrıca `table.changeGroup`, sekiz `tableGroup` eyleminden yedisi (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` ve `tableGroup.changeColor`, yani katman sırası değişikliği olan `tableGroup.changeZIndex` dışında hepsi), `relationship.changeColumns`, `settings.changeLockSettings` ve `settings.changeDDLScript` de vardır.  
`settings.changeRelationshipOptimization` artık mevcut değildir; bu yüzden her iki yöntem de onu atar.  
Daha eski bir sürümden gelen bir depo yeni eylemleri atar; bu yüzden [tablo gruplarını](../../guide/guides/table-groups.md), [kilitleri](../../guide/guides/settings.md#lock), [Şema SQL](../../guide/guides/schema-sql.md) betiklerini ve [Sütunları eşle](../../guide/guides/relationship-editing.md#map-columns) iletişim kutusunun mevcut bir ilişkiye verdiği sütunları kaybeder.  
Replikayı düzenleyicilerle aynı sürümde ya da daha yeni bir sürümde çalıştırın.

`4.1.0` sürümü yeni bir eylem türü eklemez ve `@dineug/erd-editor/engine.js` giriş noktasını olduğu gibi bırakır; bu yüzden `4.0.0` sürümlü bir replika, tıpkı `4.1.0` sürümlü bir replika gibi, `4.1.0` sürümlü bir düzenleyicinin gönderdiği her değişikliği tutar.  
`4.1.0` sürümünden itibaren [Bul ve değiştir](../../guide/guides/find-and-replace.md#replacing) içindeki `Replace` ve `Replace All`, `4.0.0` sürümlü bir replikanın zaten tuttuğu `index.changeName` ve `tableGroup.changeName` eylemleri aracılığıyla dizinleri ve tablo gruplarını da yeniden adlandırır.  
[Gezginin](../../guide/guides/explorer.md) kendi durumu asla gönderilmez; onun yaptığı bir sekme değişikliği veya kaydırma da diğer tüm sekme değişiklikleri ve kaydırmalar gibi ulaşır. [Ortak düzenleme](./collaborative-editing.md) sayfasına bakın.

`4.2.0` sürümünden itibaren tutulan eylemler arasında ayrıca `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` ile [Sözlük](../../guide/guides/dictionary.md) sayfalarındaki her düzenlemeyi, sıralamayı ve CSV içe aktarmasını taşıyan `dictionary.add`, `dictionary.update` ve `dictionary.remove` de vardır.  
Ad görünümü değişikliklerinden replika yalnızca salt okunur olmayan bir düzenleyicinin `Name View` kilitli değilken yaptıklarını uygular, geri kalanını atar ([on@change](#onchange) bölümüne bakın).  
Daha eski bir sürümden gelen bir depo bu eylemlerin hepsini atar; bu yüzden [mantıksal adları](../../guide/guides/logical-names.md), değer alanı bağlantılarını, her adın sözlüklerden gelip gelmediğini, sözcükleri, terimleri, değer alanlarını ve Ad görünümünü kaybeder.  
Oturumdaki `4.2.0` sürümünden önceki bir düzenleyici, `4.2.0` sürümlü bir replikadan bunların bir kısmını yine de alıp götürebilir.  
O düzenleyicide Şema SQL, GraphQL, DBML veya AML ile yapılan bir `Import` işlemi – `Import and Add` değil – replikanın sözcüklerini, terimlerini ve değer alanlarını boşaltır.  
Bu düzenleyicinin bir yüklemeyi, bir `Import` işlemini veya `clear()` çağrısını geri alması, belgenin kendi kopyasını mantıksal adlar, değer alanı bağlantıları ve sözlükler olmadan replikaya yükler. [Sürümleri karıştırma](./collaborative-editing.md#mixing-releases) bölümüne bakın.  
`@dineug/erd-editor/engine.js` giriş noktası öncekiyle aynı `createReplicationStore`, `ReplicationStore` ve `ReplicationChange` öğelerini dışa aktarır; `createReplicationStore` de aynı bağlamı alır.

`4.0.0` sürümünden itibaren her iki yöntem, başka bir düzenleyici oturuma katıldığında bir düzenleyicinin yanıt olarak gönderdiği ortak çalışma kayıtlarını taşıyan `editor.mergeLWW` eylemini de uygular; böylece replika eşzamanlı düzenlemeleri düzenleyicilerin yaptığı gibi çözümler.  
Bu eylem `value` değerinin hiçbir baytını değiştirmez ve `change` olayını tetiklemez.  
`4.0.0` sürümünden önce yayımlanmış bir düzenleyicinin hâlâ gönderebileceği `settings.changeIgnoreSaveSettings` eylemi tutulur ancak hiçbir şeyi değiştirmez: `changed` değeri `false` olan bir `change` olayını tetikler.

### destroy {#destroy}

replicationStore örneğini tamamen yok eder.

```js
replicationStore.destroy();
```

Bundan sonra depo `change` olayını tetiklemeyi bırakır ve sonraki gönderimleri yok sayar.  
Belge, hata fırlatmak yerine son değerinde donup kalır.  
Yeniden başlamak için yeni bir depo oluşturun.
