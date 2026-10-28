---
sidebar_position: 1
description: "@dineug/erd-editor paketini npm'den veya bir CDN'den kurma, düzenleyici ve görüntüleyici öğelerini kaydetme, dosya iletişim kutularını bağlama ve 4.x veya 3.x sürümünden yükseltme."
---

# Kurulum

```sh
npm install @dineug/erd-editor
```

Paket yalnızca ESM biçimindedir (`"type": "module"`) ve yalnızca `dist` klasörünü içerir.
CommonJS derlemesi yoktur, bu yüzden `require('@dineug/erd-editor')` çağrısı çalışmaz.

Paket iki özel öğe içerir: düzenleyici olan `<erd-editor>` ve `5.0.0` sürümünden itibaren bir diyagramı salt okunur gösteren `<erd-viewer>`. [ErdViewerElement](./erd-viewer-element.md) sayfasına bakın.
`5.0.0` sürümünden itibaren paketin kökünü içe aktarmak ikisini de tanımlamaz. Her öğenin onu tanımlayan kendi giriş noktası vardır. [Öğeleri kaydetme](#registering-the-elements) bölümüne bakın.

Çalışma zamanı bağımlılıkları, paketleyicinizin çözümlediği, tekilleştirdiği ve tree-shaking ile ayıkladığı yalın içe aktarma ifadeleri olarak harici bırakılır. `5.0.0` sürümünden itibaren `dist` klasörü modül başına bir dosya içerir, bu yüzden paketleyici yalnızca bir sayfanın eriştiği modülleri tutar. [Giriş noktaları](#entry-points) bölümüne bakın.
Paylaşımlı worker'lar `dist/workers/` altında ayrı giriş dosyaları olarak üretilir ve `new URL('./…', import.meta.url)` ile oluşturulur. Vite, webpack 5 ve Rspack bu yazımı bir worker girişi olarak paketler. [Web Worker'lar](#web-workers) bölümüne bakın.
Arkasında paketleyici olmayan bir sayfa için kendi kendine yeten iki derleme vardır. [Script etiketi](#script-tag) bölümüne bakın.

## Kullanım {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js`, içe aktarıldığı anda `<erd-editor>` öğesini tanımlar. Yalnızca bir diyagram gösteren bir sayfa bunun yerine `@dineug/erd-editor/erd-viewer.js` dosyasını içe aktarır. [ErdViewerElement](./erd-viewer-element.md) sayfasına bakın.

`<erd-editor>` öğesinin kendine ait bir boyutu yoktur. Öğeye (veya kapsayıcısına) açıkça bir genişlik ve yükseklik verin.
`4.1.0` sürümünden itibaren açık bir [Gezgin](../guide/guides/explorer.md), öğenin içinde ERD tuvalinin soluna yerleşir ve tuvali örtmek yerine daraltır. Yeni bir düzenleyici Gezgin kapalı olarak başlar.
Panel `200px` genişliğinden dar çizilmez ve tuvale en az `320px` genişlik bırakır, bu yüzden `520px` genişliğinden dar bir öğede açık bir Gezgin, öğe genişleyene kadar çizilmez. [Tuvalin yanında](../guide/guides/explorer.md#beside-the-canvas) bölümüne bakın.

`setInitialValue('')` çağrısı yeni, boş bir belge başlatır. `value` özelliğine değer atamak ise belgeyi bir düzenleme olarak yükler, bu yüzden yükleme geri alma geçmişine girer.
`4.0.0` sürümünden itibaren `editor.value`, belgenin bir dosyada tutulan biçimidir ve saklanması gereken de budur. `editor.runtimeValue` ise kaldırılmış varlıklar dahil, belgenin düzenleyicide tutulan hâlidir: Bir ortak çalışanı ilk içerikle başlatır ve asla bir dosyaya yazılmaz. [runtimeValue](./erd-editor-element.md#runtimevalue) bölümüne bakın.
`4.0.0` sürümünden itibaren yeni bir belgede her [ayar kilidi](../guide/guides/settings.md#lock) de etkindir: görünüm alanı, sekme, Kod oluşturucu dili, iki ad biçimi, tırnak türü ve `4.2.0` sürümünden itibaren [Ad görünümü](../guide/guides/logical-names.md#name-view). Kaydırmak, yakınlaştırmak, sekmeler arasında geçiş yapmak, Ad görünümünü değiştirmek veya diğer ayarlardan birini değiştirmek `editor.value` değerini olduğu gibi bırakır ve hiçbir `change` olayı tetiklemez. Metinden yüklenen bir belge, içinde belirtilen kilitleri korur. Hiç kilit belirtmeyen bir belge, örneğin `4.0.0` sürümünden önce kaydedilmiş herhangi bir dosya, hangi görünüm alanını ve sekmeyi kaydetmiş olursa olsun tüm kilitler etkin olarak, %100 yakınlaştırmada ve ERD sekmesinde açılır. Görünüm alanı `0, 0` başlangıç noktasında kilitlenir ve diyagramın hiçbir kısmı orada çizilmiyorsa görünüm bunun yerine diyagramın üzerinde açılır. [setInitialValue](./erd-editor-element.md#setinitialvalue) bölümüne bakın.
`4.2.0` sürümünden önce kaydedilmiş bir dosya, diğer tüm kilitleri devre dışı olsa bile, Ad görünümü `Physical Names` görünümünde kilitli hâlde açılır. `4.0.0` veya `4.1.0` sürümünün düzenleyicisi kaydetme sırasında Ad görünümü kilidini olduğu gibi korur, ancak Ad görünümünün değerini atar; bu yüzden Ad görünümü kilidi devre dışıyken kaydedilmiş bir `4.2.0` dosyası kilitsiz kalır, ancak `Physical Names` görünümünde yeniden açılır.
API'nin geri kalanı için [ErdEditorElement](./erd-editor-element.md) sayfasına bakın.

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` paketin harici bağımlılıklarını sizin yerinize çözümler, bu yüzden bu yöntem paketleyici olmadan çalışır.
Her giriş noktasına, sürümden sonraki yolla erişilir: `…/erd-editor.js` düzenleyiciyi, `…/erd-viewer.js` ise görüntüleyiciyi tanımlar; görüntüleyici, bir sayfa istediğinde İngilizce dışındaki her görüntüleme dilini CDN'den getirir. Yalın paket URL'si, `https://esm.run/@dineug/erd-editor@5.0.0`, hiçbir öğe tanımlamayan kökü sunar.
Sürüm belirtilmeyen URL her zaman en son sürümü sunar. Bir ana sürüm yükseltmesinin sayfanıza habersizce ulaşmasını istemiyorsanız yukarıdaki gibi sürümü sabitleyin.
`5.0.0` sürümünün kendisi de böyle bir yükseltmedir: 4.x sürümünde kalması gereken bir sayfa `@4.2.0` sürümünü sabitler. [4.x sürümünden yükseltme](#upgrading-from-4x) bölümüne bakın.

`esm.run` paylaşımlı worker'ları `cdn.jsdelivr.net` üzerinden sunar ve bir tarayıcı, sayfanın kendi kaynağından başka bir kaynaktan paylaşımlı worker başlatmaz. Bu yüzden bu şekilde yüklenen bir düzenleyici, worker'ları engelleyen bir ana uygulamada olduğu gibi worker'ları olmadan çalışır. [Web Worker'lar](#web-workers) bölümüne bakın. [Script etiketi](#script-tag) derlemesi onları kendi dosyasının içinde taşır.

### Script etiketi {#script-tag}

`3.6.0` sürümünden itibaren paket, tüm bağımlılıkları ve tüm paylaşımlı worker'ları tek bir dosyada, `dist/erd-editor.umd.js` dosyasında barındıran bir UMD derlemesi de içerir.
`unpkg` ve `jsdelivr` alanlarının gösterdiği dosya budur, bu yüzden iki CDN'de de paketin yalın URL'si bu derlemeyi sunar ve derleme `window.ErdEditor` nesnesini tanımlar.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Yüklemek `<erd-editor>` öğesini tanımlar. `window.ErdEditor` nesnesi iki dosya geri çağırma işlevini, yani `ErdEditor.setExportFileCallback` ve `ErdEditor.setImportFileCallback` işlevlerini, `3.9.2` sürümünden itibaren `ErdEditor.createKeyBindingMap` işlevini, `4.2.0` sürümünden itibaren `ErdEditor.dictionaryRowChords` işlevini – [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) bölümüne bakın – ve `5.0.0` sürümünden itibaren `ErdEditor.ErdEditorElement` ile `ErdEditor.defineErdEditor` işlevlerini taşır; [Öğeleri kaydetme](#registering-the-elements) bölümüne bakın. [toImage](./to-image.md) işlevini taşımaz.

`5.0.0` sürümünden itibaren ikinci bir dosya, `dist/erd-viewer.umd.js`, `<erd-viewer>` öğesini tanımlar ve `ErdViewerElement` ile `defineErdViewer` işlevlerini `window.ErdViewer` üzerine koyar. Hiçbir worker başlatmaz, 25 görüntüleme dilinin tümünü içerir ve verilen `src` dışında hiçbir şey istemez.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

İki dosyadan hiçbiri diğerinin etiketini tanımlamaz ve her biri sayfada kendi global nesnesi ile `window.Konva` dışında hiçbir global bırakmaz.
Paketin exports eşlemi paketleyiciyi yine ES modüllerine yönlendirir, bu yüzden npm'den yapılan bir kurulum bu dosyalardan hiçbirini asla kullanmaz.
Kendi script'ini yükleyemeyen bir sayfa, bunun yerine barındırılan görüntüleyiciyi erd-editor.io/embed adresinden çerçeveleyebilir. [Gömme](../guide/guides/embedding.md) sayfasına bakın.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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

`4.0.0` sürümünden itibaren `enable-locale-picker` özniteliği araç çubuğuna `Display Language` seçicisini, `enable-welcome-screen` özniteliği de boş bir diyagramın gösterdiği karşılama ekranını ekler. [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) ve [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen) bölümlerine bakın.
[Kullanım](#usage) bölümündeki gibi belge yükleyen bir sayfa, `enableWelcomeScreen` özelliğini HTML işaretlemesinde değil, `setInitialValue()` belgeyi yükledikten sonra açar; böylece ekran, hâlâ yüklenmekte olan bir dosyanın üzerinde asla bir anlığına belirmez.
Düzenleyici 25 görüntüleme dilinin tümünü, ES derlemesinde de script etiketi derlemesinde de taşır, bu yüzden sunulacak bir dil dosyası ve kaydedilecek bir şey yoktur. Seçici de `setLocale()` çağrısı da yoksa düzenleyici İngilizce görünür.

Buraya `readonly` özniteliğini eklemek düzenleyiciyi bir okuyucu olarak açar: `value` özelliğine yapılan atamalar, `clear()` çağrıları ve `setSchemaJSON()` ve ekleme yapan çağrılar dahil her `setSchema*()` çağrısı yok sayılır ve `change` olayı asla tetiklenmez. Sekmeleri, Gezgin ve Hızlı arama okunabilir kalır ve diyagramı düzenleyecek her kontrol kalkar.
`editor.value` ve `editor.runtimeValue` değerlerini okumak yine çalışır ve ikisi de belgenin kendi ayarlarını korur: okuyucunun değiştirdiği bir görünüm ayarı, örneğin yakınlaştırma veya veritabanı, o düzenleyicinin ekranında kalır. Bunun yerine `setInitialValue()` ile yükleyin. [readonly](./erd-editor-element.md#readonly) bölümüne bakın.

### Sunucu tarafında işleme {#server-side-rendering}

`engine.js` ve `peer.js` dışındaki her giriş noktası bir DOM gerektirir, bu yüzden Node'da hata fırlatır. `erd-editor.js` ve `erd-viewer.js` öğelerini modül kapsamında tanımlar; `5.0.0` sürümünden itibaren hiçbir şey tanımlamayan paket kökü ise yüklenirken yine de her iki öğe sınıfını oluşturur.
Next.js, Nuxt, SvelteKit veya Astro'da öğenin giriş noktasına, kökten yapılan adlandırılmış bir içe aktarmaya ise, örneğin `setExportFileCallback` veya `toImage`, aynı yoldan, yalnızca istemcide çalışan bir yoldan erişin.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Geliştirme sırasında, düzenleyicinin düzen worker'ının içe aktardığı ELK paketini Vite'ın ön paketlemesine ekleyin; aksi hâlde o worker'ın yaptığı düzenler başarısız olur: Otomatik düzenin `Flow`, `Tree - vertical` ve `Tree - horizontal` düzenleri, Görselleştirme sekmesinin Akış modu ve Akış ile yerleştirilen bir içe aktarma.
Vite 7 ve daha eskisi ayrıca düzenleyicinin ön paketlemeden çıkarılmasını gerektirir, çünkü bunların ön paketi worker URL'lerini hiç yazmadığı dosyalara yöneltir ve üç worker da başarısız olur. Vite 8'de bu `exclude` satırını eklemeyin; yalnızca geliştirme sunucusunun paketin her dosyasını ayrı ayrı getirmesine yol açar. Üretim derlemesi ikisine de ihtiyaç duymaz.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

`@dineug/erd-editor/erd-editor.js` dosyasını içe aktarmak `erd-editor` öğesini, `@dineug/erd-editor/erd-viewer.js` dosyasını içe aktarmak ise `erd-viewer` öğesini `HTMLElementTagNameMap` arayüzüne ekler, bu yüzden öğenin türü tür dönüştürmeye gerek kalmadan belirlenir. Kökten yapılan her içe aktarma, yalnızca bir tür olsa bile, ikisini de getirir.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement`, kendi değişkenlerinizin ve prop'larınızın türünü belirtmek için dışa aktarılır. `5.0.0` sürümünden itibaren aynı zamanda öğenin sınıfıdır ve `ErdViewerElement` görüntüleyicinin arayüzü ve sınıfıdır. [Öğeleri kaydetme](#registering-the-elements) bölümüne bakın.
`4.0.0` sürümünden itibaren paket `LocaleCode`, `LocaleOption` ve `SchemaSQLOptions` türlerini, `5.0.0` sürümünden itibaren de `ToImageOptions` türünü dışa aktarır. [Giriş noktaları](#entry-points) bölümüne bakın. `setSchema*()` yöntemlerinin aldığı seçeneklerin dışa aktarılan bir adı yoktur; bunları `Parameters<ErdEditorElement['setSchemaSQL']>[1]` biçiminde öğeden okuyun.
`5.0.0` sürümünden itibaren paketin `typesVersions` alanı, exports eşlemini okumayan `moduleResolution: "node10"` altında da her alt yol giriş noktasının türlerini verir.

## Öğeleri kaydetme {#registering-the-elements}

`5.0.0` sürümünden itibaren paket bir etiketi yalnızca bir sayfa istediği yerde tanımlar.

| İçe aktarma | Tanımladığı |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Hiçbir şey |

İki giriş noktasının her biri etiketini değerlendirildiği anda tanımlar ve hiçbir şey dışa aktarmaz, bu yüzden yalnızca etkisi için içe aktarılır; hiçbiri diğerinin etiketini tanımlamaz.
Kök, iki öğe sınıfını, `ErdEditorElement` ve `ErdViewerElement`, ile çağırdığınız yerde etiketlerini tanımlayan `defineErdEditor()` ve `defineErdViewer()` işlevlerini dışa aktarır:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Etiket zaten o sınıfı tutuyorsa çağrı hiçbir şey yapmaz, bu yüzden bir giriş noktası ile bir define çağrısı ya da iki define çağrısı aynı sayfada buluşabilir. Etiketi başka bir sınıf tutuyorsa, örneğin aynı sayfaya paketlenmiş paketin ikinci bir kopyası, etiketin adını içeren bir `Error` fırlatır: `Another element class already defines the custom element name erd-editor`.
Kökün sınıfları, giriş noktalarının tanımladığı sınıflardır, bu yüzden ikisinden biri çalıştıktan sonra `customElements.get('erd-editor') === ErdEditorElement` olur. Etiket tanımlanana kadar `document.createElement('erd-editor')` düzenleyicinin hiçbir üyesi olmayan sade bir `HTMLElement` üretir ve `new ErdEditorElement()` hata fırlatır.

Kendi etiketiniz için sınıfı o etiketin altında kendiniz tanımlayın ve etiketi `HTMLElementTagNameMap` arayüzüne kendiniz ekleyin. Bunu, o öğenin giriş noktasını ya da [script etiketi](#script-tag) derlemesini yüklemeyen ve onun için hiçbir define işlevi çağırmayan bir pencerede yapın, çünkü bir sınıf bir pencerede tek bir ad alır:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Her iki öğeyi de içeren bir paket, Vite ve Rolldown'un İngilizce dışındaki her görüntüleme dili için bir kez `INEFFECTIVE_DYNAMIC_IMPORT` uyarısı vermesine yol açar. Görüntüleyici bunların her birini kendi `import()` çağrısıyla yükler, düzenleyici ise her sözlüğü bir seferde içe aktarır; bu yüzden hepsi düzenleyicinin öbeğinde kalır ve onunla birlikte yüklenir. Hiçbir şey başarısız olmaz, yalnızca görüntüleyiciyi içeren bir paket ise her dili kendi öbeğinde tutar.

## Söz dizimi vurgulama {#syntax-highlighting}

Şema SQL ve Kod oluşturucu panelleri, kendine ait bir paylaşımlı worker içinde çalışan [Shiki](https://shiki.style) ile vurgulanır; `4.0.0` sürümünden itibaren Şema SQL sekmesindeki `Before tables` ve `After tables` betikleri de aynı şekilde vurgulanır.
`3.7.0` sürümünden itibaren kurulacak ya da kaydedilecek bir şey yoktur: Worker, bir kod paneli ilk kez görüntülendiğinde oluşturulur, bu yüzden hiçbir kod paneli açmayan bir sayfa gramer dosyalarını asla indirmez.

| | |
| --- | --- |
| Diller | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temalar | `github-dark` ve `github-light`, düzenleyicinin açık veya koyu görünüşünü izler |

Bunlar tam olarak panellerin ürettiği dillerdir: `JPA` Java olarak, `SQLAlchemy` Python olarak, `TypeORM`, `Sequelize`, `Drizzle` ve `Zod` TypeScript olarak, `Doctrine` PHP olarak, `SeaORM` Rust olarak, `JSON Schema` JSON olarak, `DBML` ve `AML` ise paketteki en yakın gramer olan SQL olarak vurgulanır. [Kod oluşturucu](../guide/guides/code-generator.md) sayfasına bakın.

Normal ifade motoru saf JavaScript'tir, bu yüzden hiçbir ana uygulama politikasının `wasm-unsafe-eval` içermesi gerekmez.
`SharedWorker` desteğinin olmadığı yerlerde – Chrome 148 öncesi Android'de Chrome, 16.4 sürümünden önceki Safari – hata günlüğe kaydedilir ve kod düz metin olarak görünür; betikler yine de düzenlenebilir.

`3.6.0` veya daha eski bir sürümden yükseltirken: `@dineug/erd-editor-shiki-worker` artık yayımlanmıyor ve `setGetShikiServiceCallback` işlevi de onunla birlikte kaldırıldı.
Kurulumu ve kaydı kaldırın; worker'ı bir CDN'den yükleyen bir sayfa o ikinci `<script>` etiketini de kaldırır.

## Web Worker'lar {#web-workers}

Düzenleyici üç işi `SharedWorker` örneklerinde çalıştırır: söz dizimi vurgulama, görüntü dışa aktarma ve [Otomatik düzenin](../guide/guides/table-related-functions.md#auto-layout), Görselleştirme sekmesindeki [Akış modunun](../guide/guides/visualization.md#how-flow-is-placed) ve `4.0.0` sürümünden itibaren içe aktarılan bir şemanın yerleştirilmesinin dayandığı tablo düzeni.
Üçü de `@dineug/erd-editor` paketinin içinde gelir. Hiçbirini sizin kurmanız gerekmez, ancak her birini bir ana uygulama engelleyebilir.
`5.0.0` sürümünden itibaren her worker kendi modülünde oluşturulur, bu yüzden bir paket yalnızca modüllerinin eriştiği worker'ları taşır: [toImage](./to-image.md) işlevini içeren ve hiçbir öğe içermeyen bir paket yalnızca görüntü dışa aktarma worker'ını taşır, `<erd-viewer>` ise hiçbir worker başlatmaz. [Giriş noktaları](#entry-points) bölümüne bakın.
Belgenin çöp toplamasını çalıştıran worker, çöp toplamanın kendisiyle birlikte `4.0.0` sürümünde kaldırıldı.

| Worker | Olmadığında |
| --- | --- |
| Söz dizimi vurgulama | Şema SQL ve Kod oluşturucu panelleri ile Şema SQL betikleri düz metin olarak kalır |
| Görüntü dışa aktarma | PNG, SVG, `Copy to clipboard`, `Export image` iletişim kutusunun önizlemesi ve `5.0.0` sürümünden itibaren [toImage()](./to-image.md) ana iş parçacığında çizilir; bu da çizim sürdükçe sayfayı engeller |
| Tablo düzeni | Otomatik düzenin `Flow`, `Tree - vertical` ve `Tree - horizontal` düzenleri ile Görselleştirme sekmesinin Akış modu `Could not place tables` iletisiyle sona erer; Akış ile yerleştirilen bir içe aktarma – `Import` veya `Import and Add` ile alınan bir SQL, GraphQL, DBML ya da AML dosyası veya `placement: 'auto'` ile yapılan bir `setSchema*()` çağrısı – tablolarını hiçbir ileti göstermeden satırlar hâlinde yerleştirir; `Force` ve Graf modu ise düzenleyicinin içinde çalıştıkları için etkilenmez |

Görüntü dışa aktarma, worker'ının yanıt vermesi için on saniye bekler ve ardından ana iş parçacığında çizer; söz dizimi vurgulama ise worker'ı başarısız olur olmaz kodu düz metin olarak bırakır. Bu yüzden worker'ları engelleyen bir ana uygulama işlev kaybına değil, performans kaybına yol açar.
Tablo düzeni bunun istisnasıdır: Bir düzeni hesaplayan motor düzenleyicinin kendisinden daha büyüktür ve asla aynı süreç içinde yüklenmez; bu yüzden ilk yerleştirmede worker'ı için otuz saniye bekler, worker yanıt verdikten sonra da bir düzenin dönmesi için altmış saniye tanır.
Bu bekleme sürelerinden biri dolarsa yerleştirme, worker olmadığında olduğu gibi sona erer. Otomatik düzen başlar başlamaz `Placing tables` bilgi kutusunu gösterir; Akış modu ve Akış ile yerleştirilen bir içe aktarma ise bunu ancak worker'ın başlatılması dahil bir yerleştirme altı saniye sürdükten sonra gösterir.

Vite, webpack 5 ve Rspack worker'ları paket öbeklerinizin yanında dosyalar olarak üretir. esbuild ve Vite üzerinden değil de tek başına kullanılan Rolldown hiçbirini üretmez, bu yüzden onların derlediği bir sayfa worker'lar olmadan çalışır.
webpack'in deneysel `experiments.outputModule` ayarı altında hiçbir worker başlamaz, çünkü her biri kendisinden ayrılmış ve hiçbir şeyin yüklemediği bir öbeği bekler. webpack'in varsayılan çıktısını kullanın ya da `optimization.splitChunks: false` ayarlayın.

### İçerik Güvenliği Politikası {#content-security-policy}

Katı bir İçerik Güvenliği Politikası altındaki bir sayfa, öğeler için şu yönergelere ihtiyaç duyar:

- Paketlenmiş derleme için `worker-src 'self'`; worker'ları paketin yanındaki dosyalardır ve paketleyicinizin bir worker'ı satır içine gömdüğü durumlarda buna `blob:` de eklenir. [Script etiketi](#script-tag) derlemesinde üçü de dosyanın içinde `data:` URL'leri olarak taşınır, bu yüzden o sayfa bunun yerine `worker-src data:` gerektirir. `<erd-viewer>` hiçbir worker başlatmadığından ikisine de ihtiyaç duymaz.
- `5.0.0` sürümünden itibaren iki öğe de kendilerini, `style-src 'self'` yönergesinin geçirdiği oluşturulmuş stil sayfalarıyla biçimlendirir. Düzenleyicinin kod panelleri metnini yine `style` öznitelikleriyle renklendirir ve `Export image` iletişim kutusunun önizlemesi bir `blob:` URL'sindeki bir görüntüdür, bu yüzden düzenleyici ayrıca bunlar için `style-src 'unsafe-inline'` ve `img-src blob:` gerektirir.
- Oluşturulmuş stil sayfalarını desteklemeyen bir tarayıcı, örneğin 101 öncesi Firefox, bunun yerine her iki öğe için de `style-src 'unsafe-inline'` gerektiren `<style>` öğeleri alır.
- `<erd-viewer>` kendi `src` adresini getirir, bu yüzden o kaynak `connect-src` içine girer. [Bir Sayfaya Ne Ekler](./erd-viewer-element.md#what-it-adds-to-a-page) bölümüne bakın.

## Giriş noktaları {#entry-points}

Paketin beş giriş noktası vardır:

| Giriş noktası | Ne olduğu |
| --- | --- |
| `@dineug/erd-editor` | Kök: aşağıdaki dışa aktarımlar. `5.0.0` sürümünden itibaren hiçbir öğe tanımlamaz, ancak yüklenmek için yine de bir DOM gerektirir |
| `@dineug/erd-editor/erd-editor.js` | `5.0.0` sürümünden itibaren. `<erd-editor>` öğesini tanımlar ve hiçbir şey dışa aktarmaz |
| `@dineug/erd-editor/erd-viewer.js` | `5.0.0` sürümünden itibaren. `<erd-viewer>` öğesini tanımlar ve hiçbir şey dışa aktarmaz |
| `@dineug/erd-editor/engine.js` | DOM'suz belge deposu |
| `@dineug/erd-editor/peer.js` | `3.9.1` sürümünden itibaren. MCP sunucusunun headless eşi |

Kök, iki öğe sınıfını ve define işlevlerini, geri çağırma işlevlerini ayarlayan iki işlevi, `3.9.2` sürümünden itibaren varsayılan tuş bağlamalarını türleriyle birlikte, `4.0.0` sürümünden itibaren görüntüleme dili türlerini ve `getSchemaSQL()` yönteminin seçenek türünü, `4.2.0` sürümünden itibaren Sözlük sekmesinin satır tuş kombinasyonlarını ve `5.0.0` sürümünden itibaren `toImage` işlevini dışa aktarır.

| Dışa aktarım | Açıklama |
| --- | --- |
| `ErdEditorElement` | Öğenin arayüzü. [ErdEditorElement](./erd-editor-element.md) sayfasına bakın. `5.0.0` sürümünden itibaren aynı zamanda `<erd-editor>` öğesinin tanımlandığı sınıftır. [Öğeleri kaydetme](#registering-the-elements) bölümüne bakın. |
| `ErdViewerElement` | `5.0.0` sürümünden itibaren. Görüntüleyicinin arayüzü ve sınıfı. [ErdViewerElement](./erd-viewer-element.md) sayfasına bakın. |
| `defineErdEditor()`, `defineErdViewer()` | `5.0.0` sürümünden itibaren. `<erd-editor>` veya `<erd-viewer>` öğesini kendi sınıfı olarak tanımlar. Etiket o sınıfı tutuyorsa çağrı hiçbir şey yapmaz, başka bir sınıf tutuyorsa bir `Error` fırlatır. [Öğeleri kaydetme](#registering-the-elements) bölümüne bakın. |
| `toImage(value, options)` | `5.0.0` sürümünden itibaren. Bir belgeyi, `Export image` iletişim kutusunun seçenekleriyle, bir PNG `Blob` ya da bir SVG dizesi olarak çizer. [toImage](./to-image.md) sayfasına bakın. |
| `ToImageOptions` (tür) | `5.0.0` sürümünden itibaren. `toImage()` işlevinin aldığı seçenekler: `format`, `background`, `darkMode` ve `scale`. |
| `setExportFileCallback(cb)` | Tarayıcının indirme işleminin yerini alır, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Tarayıcının dosya seçicisinin yerini alır, `({ type, op, accept, mode }) => void`; `mode` alanı `4.0.0` sürümünden itibaren vardır. `4.2.0` sürümünden itibaren Sözlük sekmesindeki `Import CSV`, bir geri çağırma işlevi ayarlı olsa bile tarayıcının seçicisini açar. [Dosya iletişim kutuları](#file-dialogs) bölümüne bakın. |
| `createKeyBindingMap()` | Varsayılan tuş bağlamalarını her çağrıda yeni bir `KeyBindingMap` nesnesi olarak döndürür. [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) bölümüne bakın. |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (türler) | Bir bağlama eşlemi, eşlemdeki komut adlarının birleşim türü ve tek bir bağlama. |
| `dictionaryRowChords(map)` | `4.2.0` sürümünden itibaren. [Sözlük](../guide/guides/dictionary.md#adding-and-deleting-rows) sekmesindeki ızgaranın, verdiğiniz `KeyBindingMap` altında satır ekleyip sildiği tuş kombinasyonlarını her çağrıda yeni bir `ShortcutOption[]` dizisi olarak döndürür. Yukarıya satır ekleyen kombinasyon, varsayılanlarla `Alt+Shift+Enter`, hiçbir bağlamada yer almaz. [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) bölümüne bakın. |
| `LocaleCode`, `LocaleOption` (türler) | `4.0.0` sürümünden itibaren. 25 görüntüleme dili kodu ve `setLocale()` yönteminin aldığı, bu kodlara `'system'` değerinin eklendiği tür. [Görüntüleme dili](./erd-editor-element.md#display-language) bölümüne bakın. |
| `SchemaSQLOptions` (tür) | `4.0.0` sürümünden itibaren. `getSchemaSQL()` yönteminin aldığı seçenekler: `statements`, `header` ve `4.2.0` sürümünden itibaren `logicalNameAsComment`. [getSchemaSQL](./erd-editor-element.md#getschemasql) bölümüne bakın. |

`5.0.0` sürümünden itibaren `dist`, her biri kendi bildiriminin yanında olan, modül başına küçültülmemiş bir dosya içerir ve `package.json` içindeki `sideEffects` yalnızca iki etiket giriş noktasını ve worker dosyalarının ihtiyaç duyduğu iki taslağı adlandırır. Bu yüzden paketleyici bir sayfanın ulaşmadığı her modülü atar ve yalnızca bir kez küçültür:

- Kökten yapılan, örneğin `setExportFileCallback` gibi adlandırılmış bir içe aktarma ne öğeyi ne de bir worker'ı pakete katar.
- `toImage` görüntü dışa aktarma worker'ını getirir, hiçbir öğe getirmez.
- `erd-editor.js` düzenleyiciyi ve üç paylaşımlı worker'ın tümünü getirir.
- `erd-viewer.js` görüntüleyiciyi getirir, worker getirmez; İngilizce içindedir, diğer her görüntüleme dili ise bir sayfa istediğinde yüklenen kendi öbeğindedir.

`@dineug/erd-editor/engine.js` belge deposunu DOM olmadan çalıştırır, bu yüzden bir Web Worker içinde de çalışır. [Uzak depolama](./advanced/remote-storage.md) sayfasına bakın.
Bu giriş noktası `createReplicationStore` işlevini ve `ReplicationStore` türünü dışa aktarır. `3.10.0` sürümünden itibaren, bir replikanın `change` dinleyicisinin aldığı `{ value: string; changed: boolean }` biçimindeki `ReplicationChange` türünü de dışa aktarır. [on@change](./advanced/remote-storage.md#onchange) bölümüne bakın.
`4.0.0` sürümünden itibaren bir `ReplicationStore` nesnesinin `runtimeValue` özelliği de vardır. Nesnenin `value` değeri ve bir `change` olayının ilettiği değer, öğedeki gibi, bir dosyanın tuttuğu depolama biçimindedir. [ReplicationStore](./advanced/remote-storage.md#replicationstore) bölümüne bakın.

`@dineug/erd-editor/peer.js`, yani [MCP sunucusunun](../mcp/introduction.md) bir belgeyi düzenlerken kullandığı headless eş. Bu giriş noktası o sunucu için vardır ve bu sayfalar onu belgelemez.

### Dosya iletişim kutuları {#file-dialogs}

İçe ve dışa aktarma, enjekte edilebilen geri çağırma işlevleri üzerinden yürür, bu yüzden tarayıcı dosya iletişim kutusu olmayan bir ana uygulama – örneğin bir IDE'nin web görünümü – kendi iletişim kutusunu sağlayabilir.
İkisi simetrik değildir: Dışa aktarma size bitmiş dosyayı verir, içe aktarma ise yalnızca bir dosya ister ve içeriği düzenleyiciye kendiniz geri yüklersiniz.
`4.2.0` sürümünden itibaren Sözlük sekmesindeki `Import CSV`, içe aktarma geri çağırma işlevini asla çağırmayan tek içe aktarma işlemidir; bu işlevin `type` alanında CSV için bir değer yoktur. Her zaman tarayıcının kendi dosya seçicisini `.csv` dosyaları için açar. [CSV içe ve dışa aktarma](../guide/guides/dictionary.md#importing-and-exporting-csv) bölümüne bakın.

`op` değeri `set` veya `diff` olur – `diff` değeri, `type` ne olursa olsun `setDiffValue()` yöntemine gider. Aksi hâlde yöntemi `type` seçer ve `accept`, o türün uzantılarını bir ana uygulamanın dosya iletişim kutusuna doğrudan verilebilecek biçimde taşır.
`4.0.0` sürümünden itibaren kullanıcı [İçe aktar ve ekle](../guide/guides/file-import-export.md#import-and-add) seçeneğini seçtiğinde bir `set` isteği `mode: 'append'` taşır, düz bir İçe aktar işleminde ise hiç `mode` taşımaz. Bu değeri aktarın: Onu atlayan bir geri çağırma işlevi, kullanıcının ekleme yapmak istediği diyagramın üzerine yazar.

| `type` | `accept` | Yöntem |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'`, düzenleyicinin kendi İçe aktar işleminin yaptığı gibi, tabloları yerleşmeden önce ilişkilerine göre düzenler ve çağrının bir Promise döndürmesini sağlar. Bu seçenek olmadan tablolar hemen satırlar hâlinde yerleşir. [setSchemaSQL](./erd-editor-element.md#setschemasql) ve [setSchemaJSON](./erd-editor-element.md#setschemajson) bölümlerine bakın.

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

İşlediğiniz her `type` değerine göre dallanın ve gerisini yok sayın.
Değiştirme modundaki bir `setSchemaJSON()` çağrısı, `value` özelliğine değer atamak gibi, ayrıştırmadan önce belgeyi temizler; bu yüzden oraya `.erd.json` belgesi olmayan bir veriyi yönlendirmek – her şeyi yakalayan bir `else` üzerinden ya da sonradan eklenen bir `type` değeri hiçbir dala uymadan aşağı düştüğü için – hiçbir şeyi içe aktarmak yerine diyagramı boşaltır.

Düzenleyicinin oluşturduğu `fileName` değeri, `<database name>-<timestamp>` biçimindeki ada dosyanın uzantısı eklenerek oluşur; burada zaman damgası, `yyyy-MM-dd'T'HH_mm_ss` biçimindeki yerel saattir. Boş bir veritabanı adının yerine `unnamed` kullanılır. Sözlük CSV dosyası, `<database name>-<timestamp>-words.csv` örneğindeki gibi, uzantıdan önce sayfasının adını taşır.
Dışa aktarma geri çağırma işlevi şu dosyaları alır. `4.0.0` sürümünden itibaren SVG ve Kod oluşturucunun dosyaları da bunlar arasındadır ve `.sql` dosyası doğrudan `Export` öğesinden değil, Şema SQL sekmesindeki `Save file` düğmesinden gelir. `4.2.0` sürümünden itibaren Sözlük sekmesinin CSV dosyası da bunlar arasındadır. [toImage()](./to-image.md) iki geri çağırma işlevini de çağırmaz: görüntüsünü size geri verir.

| Dosya | Uzantı | Blob `type` |
| --- | --- | --- |
| JSON dışa aktarma | `.erd.json` | `application/json` |
| Şema SQL sekmesindeki `Save file` ile kaydedilen, sekmenin gösterdiği metni içeren dosya. [Şema SQL](../guide/guides/schema-sql.md) sayfasına bakın | `.sql` | yok |
| [Görüntüyü dışa aktar](../guide/guides/file-import-export.md#image) iletişim kutusu | `.png` veya `.svg` | `image/png` veya `image/svg+xml` |
| Kod oluşturucu sekmesindeki `Save file` ile kaydedilen dosya. [Kod oluşturucu](../guide/guides/code-generator.md) sayfasına bakın | Dilin uzantısı: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` veya `.mmd` | yok |
| Sözlük sekmesindeki `Export CSV` ile kaydedilen, araması neyi listelerse listelesin gösterilen sayfanın her satırını içeren dosya. [CSV içe ve dışa aktarma](../guide/guides/dictionary.md#importing-and-exporting-csv) bölümüne bakın | `.csv` | `text/csv` |

İşleyiciyi uzantıya göre seçen bir ana uygulamanın bunların her biri için bir işleyiciye ihtiyacı vardır.

Ayarlanmadığında düzenleyici, tarayıcının kendi indirme ve dosya seçici davranışını kullanır. Bu davranışa geri dönmek için `null` değerini verin.

## Tarayıcı desteği {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – yayımlanan derlemelerin hedef aldığı ES2022 temel düzeyi.
Pakete hiçbir polyfill dahil değildir. Daha eski tarayıcıları desteklemeniz gerekiyorsa kendi polyfill'lerinizi ekleyin.

## 4.x sürümünden yükseltme {#upgrading-from-4x}

`5.0.0` bir ana sürümdür. Bir sayfayı 4.x sürümünden taşırken aşağıdakilerin her birini kontrol edin:

- `import '@dineug/erd-editor'` artık `<erd-editor>` öğesini tanımlamaz. Bunun yerine `@dineug/erd-editor/erd-editor.js` dosyasını yalnızca etkisi için içe aktarın ya da `defineErdEditor()` çağırın ve kökten yaptığınız adlandırılmış içe aktarmaları olduğu gibi tutun. Yalın içe aktarmada bırakılmış bir sayfayı TypeScript işaretlemez, çünkü kökün bildirimleri etiketi hâlâ `HTMLElementTagNameMap` içinde adlandırır; ancak ürettiği öğe sade bir `HTMLElement` olur, bu yüzden ilk yöntem çağrısı bir `TypeError` fırlatır. [Öğeleri kaydetme](#registering-the-elements) bölümüne bakın.

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Bir CDN'de aynısı `https://esm.run/@dineug/erd-editor` için de geçerlidir; bu URL artık kökü sunar ve hiçbir şey tanımlamaz: `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js` adresini içe aktarın. Yalın jsDelivr ve unpkg URL'leri script etiketi derlemesini sunmaya devam eder, bu derleme `<erd-editor>` öğesini eskisi gibi tanımlar. Sürüm belirtilmeyen bir URL artık en son 5.x sürümünü sunar; 4.x sürümünde kalmak için `@4.2.0` sürümünü sabitleyin. [CDN](#cdn) ve [Script etiketi](#script-tag) bölümlerine bakın.
- Kök hiçbir şey tanımlamaz ama yine de bir DOM gerektirir, bu yüzden sunucu tarafında işlemede kökten yapılan, örneğin `setExportFileCallback` gibi adlandırılmış bir içe aktarma, öğenin giriş noktasının yanında yalnızca istemci yolunda kalır. [Sunucu tarafında işleme](#server-side-rendering) bölümüne bakın.
- `window.ErdEditor` nesnesine `ErdEditorElement` ve `defineErdEditor` eklenir. Görüntüleyicinin script etiketi derlemesi `ErdViewerElement` ve `defineErdViewer` işlevlerini `window.ErdViewer` üzerine koyar ve hiçbir global `toImage` taşımaz.
- Bir `readonly` düzenleyici bir okuyucu olarak açılır. Altı sekmesi, Gezgin, Hızlı arama ve varlık bilgisi kalır; diyagramı düzenleyecek her kontrol devre dışı bırakılmak yerine kalkar: Araç çubuğu veritabanı adını metin olarak gösterir, Ayarlar sekmesi ayarlarını bir `Read only` rozeti altında her kontrolü devre dışı olarak gösterir ve kayan araç çubuğu yalnızca yakınlaştırmayı, Ad görünümünü, Zen modunu ve pusulayı korur; bu yüzden `Hand` ve `Select` kalkar ve sürükleme tuvali kaydırır. Bir basış hiçbir şey seçmez: tek seçim, Gezgin ya da Hızlı aramadan yapılan bir atlamanın ulaştığı öğenin çevresine koyduğu ve hareketsiz bir tıklamanın temizlediği dış çizgidir, hepsini seç kısayolları da hiçbir şey seçmez. `readonly` ayarlamak açık duranları sona erdirir, örneğin seçimi, el aracını, bir hücre düzenleyicisini, bir sürüklemeyi, Map Columns'u, Otomatik düzenin `Force` önizlemesini ve Time Travel'ı; kaydırmayı, yakınlaştırmayı, sekmeyi ve Ad görünümünü ise korur. [readonly](./erd-editor-element.md#readonly) bölümüne bakın.
- Bir `readonly` okuyucunun değiştirdiği ayarlar, kilitleri ne derse desin o düzenleyicinin ekranında kalır: kaydırma ve yakınlaştırma, sekme, Ad görünümü, View Option, veritabanı ve Kod oluşturucunun dili, ad biçimleri ve tırnak türü. `value`, `runtimeValue` ve JSON dışa aktarma belgenin kendi ayarlarını korur; 4.x sürümünde bir okuyucunun değişiklikleri bunlara ulaşabiliyordu, `getSharedStore()` ise bunların hiçbirini diğer düzenleyicilere göndermez. Veritabanı sistemi verilmeden çağrılan `getSchemaSQL()` okuyucunun seçtiği veritabanını yazar. `readonly` özniteliğini kapatmak veritabanını, kod ayarlarını ve View Option değerlerini belgenin değerlerine döndürür; kaydırmayı, yakınlaştırmayı, sekmeyi ve Ad görünümünü okuyucunun bıraktığı yerde bırakır.
- Ayarlar sekmesindeki `Recalculation table width` satırı kalktı. Bir yükleme ve bir yapıştırma her tablonun genişliğini metnine göre yine uydurur.
- Vite 8'de `optimizeDeps` içindeki `exclude: ['@dineug/erd-editor']` satırını kaldırın; yalnızca Vite 7 ve daha eskisi hâlâ buna ihtiyaç duyar. ELK `include` satırını koruyun. [Vite](#vite) bölümüne bakın.

## 3.x sürümünden yükseltme {#upgrading-from-3x}

`4.0.0` bir ana sürümdür. Bir sayfayı 3.x sürümünden taşırken aşağıdakilerin her birini kontrol edin; `5.0.0` için ardından [4.x sürümünden yükseltme](#upgrading-from-4x) bölümündekileri kontrol edin:

- `editor.value`, bir replikanın `value` değeri ve onun `change` olayının ilettiği `value` değeri, bir dosyanın tuttuğu depolama biçimindedir: Kaldırılmış varlıklar, ölçülmüş genişlikler, katman sırası veya ilişki bağlantı noktaları içermez. `value` değerini kaydetmeye devam edin ve bunları `runtimeValue` üzerinden okuyun; varlık zaman damgaları (`meta`) tamamen kaldırıldı. Çalışan bir oturuma katılan bir ortak çalışanı veya replikayı `value` değerinden ya da dosyadan değil, çalışan bir eşin `runtimeValue` değerinden başlatın ve `runtimeValue` değerini asla kaydetmeyin. [value](./erd-editor-element.md#value) ve [runtimeValue](./erd-editor-element.md#runtimevalue) bölümlerine bakın.
- Ayar kilitleri `Save Scroll Information` ve `Save Zoom Information` seçeneklerinin yerini alır. Yeni bir belgede ve `4.0.0` sürümünden önce kaydedilmiş her belgede tüm kilitler etkindir; bu yüzden kaydırma, yakınlaştırma, sekme değiştirme ya da Kod oluşturucu dilinin, bir ad biçiminin veya tırnak türünün değiştirilmesi `value` değerini olduğu gibi bırakır ve hiçbir `change` olayı tetiklemez. Görünümü `change` aracılığıyla saklayan bir sayfa için Ayarlar sekmesinde `Viewport` kilidinin (sekme için de `Canvas Type` kilidinin) açılmış olması ya da `settings.lockSettings` alanı bu bitleri sıfır bırakan bir belge gerekir. [Kilit](../guide/guides/settings.md#lock) bölümüne bakın.
- `settings` nesnesinde artık `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` veya `ignoreSaveSettings` yoktur ve `SaveSettingType` sabitleri kaldırıldı. `LockSettingType` bitleriyle birlikte `settings.lockSettings`, `4.0.0` veya sonraki bir sürümün ne okuduğu ne de yazdığı `ignoreSaveSettings` alanının yerini alır. [Settings](./advanced/schema.md#settings) bölümüne bakın.
- Her dosyanın `$schema` alanında belirttiği [JSON Schema](./advanced/schema.md#json-schema) artık yalnızca depolama biçimini tanımlar ve kapalıdır: Daha eski bir sürümün kaydettiği bir dosyayı, `4.0.0` veya sonraki bir sürümle yapılan bir kayıt onu yeniden yazana kadar reddeder.
- Belgenin çöp toplaması worker'ıyla birlikte kaldırıldı, bu yüzden kaldırılmış bir varlık, belge dosyasından bir sonraki kez açılana kadar `runtimeValue` içinde kalır. Geriye üç paylaşımlı worker kalır. [Web Worker'lar](#web-workers) bölümüne bakın.
- Paylaşılan bir oturumdaki her düzenleyiciyi ve replikayı `4.0.0` veya sonraki bir sürümde tutun. Daha eski bir sürüm yeni eylem türlerini yok sayar: tablo gruplarının, Sütunları eşlemenin, kilitlerin ve Şema SQL betiklerinin eylem türleri. [Sürümleri karıştırma](./advanced/collaborative-editing.md#mixing-releases) bölümüne bakın.
- İçe aktarma geri çağırma işlevi İçe aktar ve ekle için `mode: 'append'` alır ve bir geri çağırma işlevinin bu değeri aktarması gerekir. Dışa aktarma geri çağırma işlevi artık `.svg` ve Kod oluşturucu dosyalarını da alır; `Export` ▸ `Schema SQL` ise kaydetmek yerine Şema SQL sekmesini açar, bu yüzden `.sql` dosyası yalnızca o sekmenin `Save file` düğmesinden gelir. [Dosya iletişim kutuları](#file-dialogs) bölümüne bakın.
- `Delete` ve `Backspace` tuşları yeni `removeSelection` komutuna bağlanmıştır. Düzenleyici bir metin alanının dışında odaktayken tuşun varsayılan davranışı her sekmede engellenir ve ERD sekmesinde seçili öğeler kaldırılır. `KeyBindingName` ve `KeyBindingMap` türlerine bu komut eklenir, `setKeyBindingMap({ removeSelection: [] })` ise iki tuşu da sayfaya bırakır. [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap) bölümüne bakın.
- `ThemeOptions.appearance`, tema oluşturucudaki `System` seçeneğine karşılık gelen ve `systemDarkMode` açıldığında ayarlanan `'system'` değerini de alır. `changePresetTheme` olayı bu seçenek seçili olduğu sürece `'system'` bildirir; bu yüzden değeri olduğu gibi saklayın ve `setPresetTheme` yöntemine geri verin. `systemDarkMode` açıkken `'light'` veya `'dark'` ile yapılan bir `setPresetTheme()` çağrısı artık bir sonraki işletim sistemi değişikliğiyle üzerine yazılmak yerine korunur. [systemDarkMode](./erd-editor-element.md#systemdarkmode) ve [changePresetTheme](./erd-editor-element.md#changepresettheme) bölümlerine bakın.
- `@dineug/erd-editor-mcp` paketinin `1.0.0` veya sonraki bir sürümü, VS Code uzantısının `4.0.0` veya sonraki bir sürümü ile Obsidian ve JetBrains eklentilerinin `1.0.0` veya sonraki bir sürümü hub protokolü 2'yi kullanır. `1.0.0` veya sonraki bir sürümdeki sunucu ile ajanlara hizmet veren daha eski bir düzenleyici sürümü ya da daha eski bir sunucu ile bu düzenleyicilerden biri, güncellenmesi gereken tarafı belirterek birbirini `protocolMismatch` koduyla reddeder. [Güncelleme](../mcp/installation.md#updating) bölümüne bakın.
- Sürüm belirtilmeyen bir CDN URL'si en son sürümü sunar, `5.0.0` sürümünden itibaren 5.x sürümünü. 3.x sürümünde kalmak için `@3.10.0` sürümünü sabitleyin. [CDN](#cdn) bölümüne bakın.
