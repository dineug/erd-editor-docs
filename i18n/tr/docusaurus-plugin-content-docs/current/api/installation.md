---
sidebar_position: 1
description: "@dineug/erd-editor paketini npm'den veya bir CDN'den kurma, özel öğeyi sayfaya ekleme, dosya iletişim kutularını bağlama ve 3.x sürümünden yükseltme."
---

# Kurulum

```sh
npm install @dineug/erd-editor
```

Paket yalnızca ESM biçimindedir (`"type": "module"`) ve yalnızca `dist` klasörünü içerir.
CommonJS derlemesi yoktur, bu yüzden `require('@dineug/erd-editor')` çağrısı çalışmaz.

Çalışma zamanı bağımlılıkları, paketleyicinizin çözümlediği, tekilleştirdiği ve tree-shaking ile ayıkladığı yalın içe aktarma ifadeleri olarak harici bırakılır.
Paylaşımlı worker'lar `dist/workers/` altında ayrı giriş dosyaları olarak üretilir ve `new URL('./…', import.meta.url)` ile oluşturulur. Vite, webpack 5 ve Rspack bu yazımı bir worker girişi olarak paketler. [Web Worker'lar](#web-workers) bölümüne bakın.
Arkasında paketleyici olmayan bir sayfa için ikinci, kendi kendine yeten bir derleme vardır. [Script etiketi](#script-tag) bölümüne bakın.

## Kullanım {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

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
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` paketin harici bağımlılıklarını sizin yerinize çözümler, bu yüzden bu yöntem paketleyici olmadan çalışır.
Sürüm belirtilmeyen URL her zaman en son sürümü sunar. Bir ana sürüm yükseltmesinin sayfanıza habersizce ulaşmasını istemiyorsanız sürümü `https://esm.run/@dineug/erd-editor@4.2.0` biçiminde sabitleyin.
`4.0.0` sürümünün kendisi de böyle bir yükseltmedir: 3.x sürümünde kalması gereken bir sayfa `@3.10.0` sürümünü sabitler. [3.x sürümünden yükseltme](#upgrading-from-3x) bölümüne bakın.

### Script etiketi {#script-tag}

`3.6.0` sürümünden itibaren paket, tüm bağımlılıkları ve tüm paylaşımlı worker'ları tek bir dosyada barındıran bir UMD derlemesi de içerir.
`unpkg` ve `jsdelivr` alanlarının gösterdiği dosya budur, bu yüzden iki CDN'de de paketin yalın URL'si bu derlemeyi sunar ve derleme `window.ErdEditor` nesnesini tanımlar.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Bu dosyayı içe aktarmak da `<erd-editor>` öğesini aynı şekilde kaydeder; `window.ErdEditor` nesnesi iki dosya geri çağırma işlevini, yani `ErdEditor.setExportFileCallback` ve `ErdEditor.setImportFileCallback` işlevlerini, `3.9.2` sürümünden itibaren de `ErdEditor.createKeyBindingMap` işlevini taşır. `4.2.0` sürümünden itibaren `ErdEditor.dictionaryRowChords` işlevini de taşır. [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) bölümüne bakın.
Paketin exports eşlemi paketleyiciyi yine ES modüllerine yönlendirir, bu yüzden npm'den yapılan bir kurulum bu dosyayı asla kullanmaz.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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
25 görüntüleme dilinin tümü, ES derlemesinde de script etiketi derlemesinde de paketin içinde gelir, bu yüzden sunulacak bir dil dosyası ve kaydedilecek bir şey yoktur. Seçici de `setLocale()` çağrısı da yoksa düzenleyici İngilizce görünür.

Buraya `readonly` özniteliğini eklemek düzenlemeyi engeller: `value` özelliğine yapılan atamalar, `clear()` çağrıları ve `setSchemaJSON()` ve ekleme yapan çağrılar dahil her `setSchema*()` çağrısı yok sayılır ve `change` olayı asla tetiklenmez. `editor.value` ve `editor.runtimeValue` değerlerini okumak yine çalışır. Bunun yerine `setInitialValue()` ile yükleyin.

### Sunucu tarafında işleme {#server-side-rendering}

Paketi içe aktarmak özel öğeyi modül kapsamında kaydeder, bu yüzden paket bir DOM gerektirir ve Node'da hata fırlatır.
Next.js, Nuxt, SvelteKit veya Astro'da pakete yalnızca istemcide çalışan bir yoldan erişin.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Paketi içe aktarmak `erd-editor` öğesini `HTMLElementTagNameMap` arayüzüne ekler, bu yüzden öğenin türü tür dönüştürmeye gerek kalmadan belirlenir.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement`, kendi değişkenlerinizin ve prop'larınızın türünü belirtmek için dışa aktarılır.
`4.0.0` sürümünden itibaren paket `LocaleCode`, `LocaleOption` ve `SchemaSQLOptions` türlerini de dışa aktarır. [Giriş noktaları](#entry-points) bölümüne bakın. `setSchema*()` yöntemlerinin aldığı seçeneklerin dışa aktarılan bir adı yoktur; bunları `Parameters<ErdEditorElement['setSchemaSQL']>[1]` biçiminde öğeden okuyun.

## Söz dizimi vurgulama {#syntax-highlighting}

Şema SQL ve Kod oluşturucu panelleri, kendine ait bir paylaşımlı worker içinde çalışan [Shiki](https://shiki.style) ile vurgulanır; `4.0.0` sürümünden itibaren Şema SQL sekmesindeki `Before tables` ve `After tables` betikleri de aynı şekilde vurgulanır.
`3.7.0` sürümünden itibaren kurulacak ya da kaydedilecek bir şey yoktur: Worker, bir kod paneli ilk kez görüntülendiğinde oluşturulur, bu yüzden hiçbir kod paneli açmayan bir sayfa gramer dosyalarını asla indirmez.

| | |
| --- | --- |
| Diller | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temalar | `github-dark` ve `github-light`, düzenleyicinin açık veya koyu görünüşünü izler |

Bunlar tam olarak panellerin ürettiği dillerdir: `JPA` Java olarak, `SQLAlchemy` Python olarak, `TypeORM`, `Sequelize`, `Drizzle` ve `Zod` TypeScript olarak, `Doctrine` PHP olarak, `SeaORM` Rust olarak, `JSON Schema` JSON olarak, `DBML` ve `AML` ise paketteki en yakın gramer olan SQL olarak vurgulanır. [Kod oluşturucu](../guide/guides/code-generator.md) sayfasına bakın.

Normal ifade motoru saf JavaScript'tir, bu yüzden hiçbir ana uygulama politikasının `wasm-unsafe-eval` içermesi gerekmez.
`SharedWorker` desteğinin olmadığı yerlerde – Android'de Chrome, 16.4 sürümünden önceki Safari – hata günlüğe kaydedilir ve kod düz metin olarak görünür; betikler yine de düzenlenebilir.

`3.6.0` veya daha eski bir sürümden yükseltirken: `@dineug/erd-editor-shiki-worker` artık yayımlanmıyor ve `setGetShikiServiceCallback` işlevi de onunla birlikte kaldırıldı.
Kurulumu ve kaydı kaldırın; worker'ı bir CDN'den yükleyen bir sayfa o ikinci `<script>` etiketini de kaldırır.

## Web Worker'lar {#web-workers}

Düzenleyici üç işi `SharedWorker` örneklerinde çalıştırır: söz dizimi vurgulama, görüntü dışa aktarma ve [Otomatik düzenin](../guide/guides/table-related-functions.md#auto-layout), Görselleştirme sekmesindeki [Akış modunun](../guide/guides/visualization.md#how-flow-is-placed) ve `4.0.0` sürümünden itibaren içe aktarılan bir şemanın yerleştirilmesinin dayandığı tablo düzeni.
Üçü de `@dineug/erd-editor` paketinin içinde gelir. Hiçbirini sizin kurmanız gerekmez, ancak her birini bir ana uygulama engelleyebilir.
Belgenin çöp toplamasını çalıştıran worker, çöp toplamanın kendisiyle birlikte `4.0.0` sürümünde kaldırıldı.

| Worker | Olmadığında |
| --- | --- |
| Söz dizimi vurgulama | Şema SQL ve Kod oluşturucu panelleri ile Şema SQL betikleri düz metin olarak kalır |
| Görüntü dışa aktarma | PNG, SVG, `Copy to clipboard` ve `Export image` iletişim kutusunun önizlemesi ana iş parçacığında çizilir; bu da çizim sürdükçe sayfayı engeller |
| Tablo düzeni | Otomatik düzenin `Flow`, `Tree - vertical` ve `Tree - horizontal` düzenleri ile Görselleştirme sekmesinin Akış modu `Could not place tables` iletisiyle sona erer; Akış ile yerleştirilen bir içe aktarma – `Import` veya `Import and Add` ile alınan bir SQL, GraphQL, DBML ya da AML dosyası veya `placement: 'auto'` ile yapılan bir `setSchema*()` çağrısı – tablolarını hiçbir ileti göstermeden satırlar hâlinde yerleştirir; `Force` ve Graf modu ise düzenleyicinin içinde çalıştıkları için etkilenmez |

Görüntü dışa aktarma, worker'ının yanıt vermesi için on saniye bekler ve ardından ana iş parçacığında çizer; söz dizimi vurgulama ise worker'ı başarısız olur olmaz kodu düz metin olarak bırakır. Bu yüzden worker'ları engelleyen bir ana uygulama işlev kaybına değil, performans kaybına yol açar.
Tablo düzeni bunun istisnasıdır: Bir düzeni hesaplayan motor düzenleyicinin kendisinden daha büyüktür ve asla aynı süreç içinde yüklenmez; bu yüzden ilk yerleştirmede worker'ı için otuz saniye bekler, worker yanıt verdikten sonra da bir düzenin dönmesi için altmış saniye tanır.
Bu bekleme sürelerinden biri dolarsa yerleştirme, worker olmadığında olduğu gibi sona erer. Otomatik düzen başlar başlamaz `Placing tables` bilgi kutusunu gösterir; Akış modu ve Akış ile yerleştirilen bir içe aktarma ise bunu ancak worker'ın başlatılması dahil bir yerleştirme altı saniye sürdükten sonra gösterir.

Paketlenmiş derlemede üçü de paketin yanında ayrı dosyalar olarak üretilir, bu yüzden katı bir CSP `worker-src 'self'` gerektirir; paketleyicinizin bir worker'ı satır içine gömdüğü durumlarda buna `blob:` de eklenir.
[Script etiketi](#script-tag) derlemesinde üçü de dosyanın içinde `data:` URL'leri olarak taşınır, bu yüzden o sayfa bunun yerine `worker-src data:` gerektirir.

## Giriş noktaları {#entry-points}

`@dineug/erd-editor` paketini içe aktarmak, yan etki olarak `<erd-editor>` öğesini kaydeder. Bunun ötesinde paket öğe türünü, geri çağırma işlevlerini ayarlayan iki işlevi, `3.9.2` sürümünden itibaren varsayılan tuş bağlamalarını türleriyle birlikte, `4.0.0` sürümünden itibaren görüntüleme dili türlerini ve `getSchemaSQL()` yönteminin seçenek türünü, `4.2.0` sürümünden itibaren de Sözlük sekmesinin satır tuş kombinasyonlarını dışa aktarır.

| Dışa aktarım | Açıklama |
| --- | --- |
| `ErdEditorElement` (tür) | Öğe arayüzü. [ErdEditorElement](./erd-editor-element.md) sayfasına bakın. |
| `setExportFileCallback(cb)` | Tarayıcının indirme işleminin yerini alır, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Tarayıcının dosya seçicisinin yerini alır, `({ type, op, accept, mode }) => void`; `mode` alanı `4.0.0` sürümünden itibaren vardır. `4.2.0` sürümünden itibaren Sözlük sekmesindeki `Import CSV`, bir geri çağırma işlevi ayarlı olsa bile tarayıcının seçicisini açar. [Dosya iletişim kutuları](#file-dialogs) bölümüne bakın. |
| `createKeyBindingMap()` | Varsayılan tuş bağlamalarını her çağrıda yeni bir `KeyBindingMap` nesnesi olarak döndürür. [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) bölümüne bakın. |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (türler) | Bir bağlama eşlemi, eşlemdeki komut adlarının birleşim türü ve tek bir bağlama. |
| `dictionaryRowChords(map)` | `4.2.0` sürümünden itibaren. [Sözlük](../guide/guides/dictionary.md#adding-and-deleting-rows) sekmesindeki ızgaranın, verdiğiniz `KeyBindingMap` altında satır ekleyip sildiği tuş kombinasyonlarını her çağrıda yeni bir `ShortcutOption[]` dizisi olarak döndürür. Yukarıya satır ekleyen kombinasyon, varsayılanlarla `Alt+Shift+Enter`, hiçbir bağlamada yer almaz. [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) bölümüne bakın. |
| `LocaleCode`, `LocaleOption` (türler) | `4.0.0` sürümünden itibaren. 25 görüntüleme dili kodu ve `setLocale()` yönteminin aldığı, bu kodlara `'system'` değerinin eklendiği tür. [Görüntüleme dili](./erd-editor-element.md#display-language) bölümüne bakın. |
| `SchemaSQLOptions` (tür) | `4.0.0` sürümünden itibaren. `getSchemaSQL()` yönteminin aldığı seçenekler: `statements`, `header` ve `4.2.0` sürümünden itibaren `logicalNameAsComment`. [getSchemaSQL](./erd-editor-element.md#getschemasql) bölümüne bakın. |

`@dineug/erd-editor/engine.js` ikinci bir giriş noktasıdır. Belge deposunu DOM olmadan çalıştırır, bu yüzden bir Web Worker içinde de çalışır. [Uzak depolama](./advanced/remote-storage.md) sayfasına bakın.
Bu giriş noktası `createReplicationStore` işlevini ve `ReplicationStore` türünü dışa aktarır. `3.10.0` sürümünden itibaren, bir replikanın `change` dinleyicisinin aldığı `{ value: string; changed: boolean }` biçimindeki `ReplicationChange` türünü de dışa aktarır. [on@change](./advanced/remote-storage.md#onchange) bölümüne bakın.
`4.0.0` sürümünden itibaren bir `ReplicationStore` nesnesinin `runtimeValue` özelliği de vardır. Nesnenin `value` değeri ve bir `change` olayının ilettiği değer, öğedeki gibi, bir dosyanın tuttuğu depolama biçimindedir. [ReplicationStore](./advanced/remote-storage.md#replicationstore) bölümüne bakın.

`3.9.1` sürümünden itibaren üçüncü bir giriş noktası da vardır: `@dineug/erd-editor/peer.js`, yani [MCP sunucusunun](../mcp/introduction.md) bir belgeyi düzenlerken kullandığı headless eş. Bu giriş noktası o sunucu için vardır ve bu sayfalar onu belgelemez.

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
Dışa aktarma geri çağırma işlevi şu dosyaları alır. `4.0.0` sürümünden itibaren SVG ve Kod oluşturucunun dosyaları da bunlar arasındadır ve `.sql` dosyası doğrudan `Export` öğesinden değil, Şema SQL sekmesindeki `Save file` düğmesinden gelir. `4.2.0` sürümünden itibaren Sözlük sekmesinin CSV dosyası da bunlar arasındadır.

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

## 3.x sürümünden yükseltme {#upgrading-from-3x}

`4.0.0` bir ana sürümdür. Bir sayfayı 3.x sürümünden taşırken aşağıdakilerin her birini kontrol edin:

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
- Sürüm belirtilmeyen bir CDN URL'si artık en son 4.x sürümünü sunar. 3.x sürümünde kalmak için `@3.10.0` sürümünü sabitleyin. [CDN](#cdn) bölümüne bakın.
