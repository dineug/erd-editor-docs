---
sidebar_position: 3
description: erd-viewer öğesinin API'si – bir value veya src URL'sinden salt okunur diyagram, mini haritası ve kontrol çubuğu, load ve error olayları, temalar, görüntüleme dili, odak ve tuşlar, yükleme ve bir sayfaya ne eklediği.
---

# ErdViewerElement

`5.0.0` sürümünden itibaren paket, bir belgenin salt okunur görünümü olan `<erd-viewer>` öğesini de içerir: Okuyucu kaydırır, yakınlaştırır, arar ve ilişkileri aydınlatır; içinde hiçbir şey düzenleme yapmaz. Yalnızca ERD tuvalini, kaydırma çubukları, bir [mini harita](#minimap), bir [kontrol çubuğu](#controls) ve belgeyi arayan bir paletle birlikte çizer; araç çubuğu, sekmeler, Gezgin ya da bağlam menüsü yoktur.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Yukarıdaki çerçeve, bu öğenin erd-editor.io/embed tarafından gösterilen hâlidir ve burada kitabevi örneğini gösterir: Odaklanmak için tıklayın, ardından [Odak ve tuşlar](#focus-and-keys) bölümündeki tuşlarla yakınlaştırın ve arayın; kendi belgenizi kodsuz çerçevelemek için [Gömme](../guide/guides/embedding.md) sayfasına bakın.

Görüntüleyici sıradan bir `HTMLElement` öğesidir.  
Tür tanımı aşağıdaki gibidir.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

`@dineug/erd-editor/erd-viewer.js` dosyasını içe aktarmak `<erd-viewer>` öğesini tanımlar ve `<erd-editor>` öğesini tanımsız bırakır. Paket kökünü içe aktarmak ikisini de tanımlamaz: `ErdViewerElement` sınıfını ve etiketi çağırdığınız yerde tanımlayan `defineErdViewer()` işlevini dışa aktarır, böylece bir sayfa sınıfı kendi etiketi altında da tanımlayabilir. [Öğeleri kaydetme](./installation.md#registering-the-elements) bölümüne bakın.  
`engine.js` ve `peer.js` dışındaki her giriş noktası bir DOM gerektirir, bu da dahil, bu yüzden sunucu tarafında işlenen bir sayfa onu istemcide içe aktarır. [Sunucu tarafında işleme](./installation.md#server-side-rendering) bölümüne bakın.  
Giriş noktasını içe aktarmak `erd-viewer` öğesini `HTMLElementTagNameMap` arayüzüne ekler, bu yüzden `document.createElement('erd-viewer')` ve `document.querySelector('erd-viewer')` çağrıları tür dönüştürmeye gerek kalmadan `ErdViewerElement` olarak türlenir.

Düzenleyici gibi görüntüleyici de kapalı bir gölge köke (shadow root) çizer, bu yüzden `viewer.shadowRoot` değeri `null` olur ve sayfa stilleri içeri ya da dışarı sızmaz; onu [setTheme](#settheme) ve `--erd-editor-*` özel özellikleriyle biçimlendirin. Bir sayfadaki birkaç görüntüleyicinin her biri kendi belgesini, görünümünü, temasını ve dilini tutar.  
`<erd-viewer>` öğesinin kendine ait bir boyutu yoktur. Özel bir öğe satır içidir, bu yüzden yukarıdaki gibi ona `display: block` ve bir yükseklik verin. Görünüm öğenin kutusunu doldurur ve yakınlaştırmasını koruyarak yeniden boyutlandırıldıkça onu izler.

`src`, `name-view`, `minimap` ve `controls` onun tek özniteliğidir; her birinin aynı adlı bir özelliği vardır, `name-view` için `nameView`. [value](#value) yalnızca bir özelliktir.  
Etiketi tanımlanmadan önce öğe üzerinde ayarlanan bir `value`, `src`, `nameView`, `minimap` veya `controls` değeri, örneğin giriş noktası yüklenmeden önce öğeyi işleyen bir çerçeve tarafından, etiket tanımlandığında, işaretlemenin verdiği özniteliklerin üzerine alınır. Sayfanın her birini ilk yazdığı sıraya göre alınırlar, bu yüzden `value` ile `src` değerlerinden sonraki kazanır. Hiçbir belge tutmayan bir `value` için fırlatılacak bir çağıran kalmaz: yakalanmamış bir hata olarak bildirilir ve görüntüleyici boş kalır.

Script etiketi derlemesi, `dist/erd-viewer.umd.js`, yalnızca görüntüleyiciyi tüm bağımlılıklarıyla birlikte tutar. `<erd-viewer>` öğesini tanımlar ve `ErdViewerElement` ile `defineErdViewer` işlevlerini `window.ErdViewer` üzerine koyar. Yolsuz bir CDN URL'si bunun yerine düzenleyicinin derlemesini sunar, bu yüzden dosyayı adlandırın. [Script etiketi](./installation.md#script-tag) bölümüne bakın.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

Görüntüleyicinin getirip göstereceği bir belgenin URL'si. Varsayılan olarak `''` değeridir, yani yoktur.  
Getirme düz bir `fetch()` çağrısıdır, kendine ait seçenekleri olmayan bir `GET`, bu yüzden tarayıcının CORS kuralları onu yönetir: Başka bir kaynaktaki bir belge, sayfanın kaynağına izin veren bir sunucu gerektirir ve çerezler yalnızca sayfanın kendi kaynağına gider. Göreli bir URL sayfaya göre çözümlenir.  
Yanıtın, bir `.erd.json` dosyasının tuttuğu gibi bir belge tutması gerekir; bu, düzenleyicinin [value](./erd-editor-element.md#value) değerinin ve her resmî ana uygulamanın yazdığı depolama biçimidir. Başka hiçbir biçim okunmaz: Bir SQL, GraphQL, DBML veya AML dosyası ayrıştırılmayan metin olarak başarısız olur.  
Ayrıştırılan bir belge görünüme sığdırılarak yerleşir ve [load](#load) olayını tetikler. Ağın ya da CORS'un reddettiği bir istek, `ok` olmayan bir yanıt veya ayrıştırılmayan metin [error](#error) olayını tetikler ve boş bir diyagram bırakır. [Yükleme](#loading) bölümüne bakın.

Yalnızca en son istek sayılır. Yeni bir `src`, hâlâ süren getirmeyi iptal eder, böylece yavaş bir yanıt asla sonraki bir belgenin üzerine yerleşmez. [value](#value) değerine atama da onu iptal eder; `src` değerini kaldırmak ya da `''` yapmak da öyledir, bu da onu izlemeyi bırakır ve gösterilen belgeyi olduğu gibi bırakır.  
`value` ve `src` değerlerinden en son ayarlanan, özellik üzerinden de öznitelik üzerinden de kazanır. Bir `value` değerinden sonra yazılan `src`, daha önce getirilen URL'yi adlandırsa bile getirilir. Zaten gösterdiği belgenin üzerine yeniden yazıldığında hiçbir şey getirmez.  
Görüntüleyici yalnızca bir sayfadayken getirir. Onu çıkarmak süren bir getirmeyi iptal eder ve geri koymak, başarısız olan dahil, henüz göstermediği bir `src` adresini getirir, zaten gösterdiği adresi asla getirmez.  
`src`, paketin yaptığı tek `fetch()` çağrısıdır, bu yüzden katı bir İçerik Güvenliği Politikası belgenin kaynağını `connect-src` içine yazar.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Gösterilen belgeyi, `src` üzerinden de `value` üzerinden de gelmiş olsa, düzenleyicinin [value](./erd-editor-element.md#value) değerinin yazdığı depolama biçiminde bir JSON dizesi olarak alır. Hiçbir şey gösterilmeden önce yeni, boş bir belgedir; `doc` alanı `{}` olur.  
Belgenin `Viewport` [kilidi](../guide/guides/settings.md#lock) etkinken, yeni bir belgede olduğu gibi, okuyucu görünümü nereye taşımış olursa olsun belgenin kilitlendiği yakınlaştırmayı ve kaydırmayı yazar. Görünümün durduğu yeri, bir yerleşmenin yaptığı sığdırma dahil, yalnızca bu kilit devre dışıyken yazar.  
Belgenin tuttuğu Ad görünümünü yazar; `Name View` kilidi devre dışı olan bir belgede bile, üzerinde [nameView](#nameview) ya da kontrol çubuğunun gösterdiğini asla yazmaz.  
[destroy](#destroy) işleminden sonra da belgeyi döndürür.

```js
const data = viewer.value;
```

### setter {#setter}

Bir belgeyi metninden gösterir, gösterileni değiştirir ve görünüme sığdırır. [Yükleme](#loading) bölümüne bakın. Bir dosyanın ya da düzenleyicinin `value` değerinin tuttuğu metni alır.  
Ayrıştırılmayan metin hiçbir şey değişmeden önce hata fırlatır ve gösterilen belge kalır: JSON olmayan metin için bir `SyntaxError`, `7` gibi hiçbir belge tutmayan JSON için bir `TypeError`. Boş bir dize ya da dize olmayan herhangi bir şey boş bir diyagram gösterir.  
Atama, süren bir `src` getirmesini iptal eder ve ne `load` ne de `error` tetikler.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Diyagramı, belgenin tuttuğu görünümün üzerinde bir [Ad görünümünde](../guide/guides/logical-names.md#name-view) gösterir: `Physical Names` için `'physical'`, `Logical Names` için `'logical'` ya da `Both Names` için `'both'`. Varsayılan `null` belgenin kendi görünümünü gösterir ve üçünün dışındaki bir öznitelik değeri `null` olarak okunur.  
Kendisinden sonra yüklenen her belge üzerinde geçerli kalır ve [value](#value) onu asla yazmaz. Özniteliği kaldırmak belgenin kendi görünümüne döner.  
[Kontrol çubuğundaki](#controls) `Name View` listesi de görünümü, sonraki belge yerleşene ya da `nameView` yeniden değişene kadar değiştirir. Orada yapılan bir değişiklik de `value` içine yazılmaz.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Belge bir tablo, gösterilen bir not ya da gösterilen bir tablo grubu tuttuğu sürece mini haritayı sağ üst köşede gösterir. Varsayılan olarak açıktır.  
Düzenleyicinin mini haritası gibi çalışır: Görünümü oraya taşımak için tıklayın ya da kaydırmak için görünüm penceresi dikdörtgenini sürükleyin. [Tuvalde gezinme](../guide/guides/table-related-functions.md#getting-around-the-canvas) bölümüne bakın. Görüntüleyici odağı alana kadar üzerindeki bir parmak sayfanındır.  
Yalnızca `minimap="false"` onu kapatır. Değer verilmemiş bir öznitelik, başka her değer ve öznitelik olmaması onu açık bırakır.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Kontrol çubuğunu tuvalin alt kenarının ortasının üzerinde gösterir. Varsayılan olarak açıktır ve soldan sağa şunları tutar:

- Yakınlaştırma: `Zoom out`, yüzde olarak geçerli yakınlaştırma ve `Zoom in`. İki düğme yakınlaştırmayı yakınlaştırma tuşlarının yaptığı gibi adımlar ve yüzdeye, `Reset zoom`, tıklamak onu `100%` değerine geri koyar. Her biri araç ipucunda tuşunu adlandırır.
- Tüm diyagram görünümde ortalanmış olarak görünecek şekilde yakınlaştıran ve kaydıran `Fit`.
- Geçerli görünümü adlandıran ve çubuğun üzerinde `Physical Names`, `Logical Names` ve `Both Names` listesini açan `Name View` düğmesi. [nameView](#nameview) bölümüne bakın.
- Çubuğun sonuna yalnızca diyagramın hiçbir kısmı ekranda değilken katılan ve görünümü diyagramın en yakın kısmına götüren `Go to content` pusulası.

Çubuk her dilde soldan sağa dizilir.  
Yalnızca `controls="false"` onu, pusulası ve `Name View` listesiyle birlikte kapatır. Değer verilmemiş bir öznitelik, başka her değer ve öznitelik olmaması onu açık bırakır. Çubuk olmadan da tekerlek, çimdikleme ve tuşlar, görüntüleyici odağı aldıktan sonra yakınlaştırmaya devam eder.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Olay {#event}

`load` ve `error` tek iki olaydır ve ikisi de `src` hakkında bildirim yapar. İkisi de kabarmaz, bu yüzden öğenin kendisini dinleyin.

### load {#load}

`src` değerinin adlandırdığı belge getirilip gösterildiğinde tetiklenir. `event.detail` değeri `null` olur.  
`value` atamak hiçbirini tetiklemez; sonraki bir `src` değerinin, bir `value` değerinin, öğenin sayfadan çıkarılmasının ya da [destroy](#destroy) işleminin iptal ettiği bir getirme de tetiklemez.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

`src` getirilemediğinde tetiklenir: ağ ya da CORS isteği reddetti, yanıt `ok` değildi ya da metni ayrıştırılmadı. Görüntüleyici bu durumda boş bir diyagram ve `Couldn't load the diagram` iletisini gösterir. [Yükleme](#loading) bölümüne bakın.  
`event.detail` nedendir: `fetch()` işlevinin reddedildiği `TypeError`, `GET /missing.erd.json answered 404 Not Found` gibi durumu adlandıran bir `Error` ya da ayrıştırıcının `SyntaxError` veya `TypeError` hatası.  
Bir şeyin iptal ettiği bir getirme hiçbir şey tetiklemez.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Düzenleyicinin `ThemeOptions` değerini alarak bir ön ayar teması ayarlar. [setPresetTheme](./erd-editor-element.md#setpresettheme) bölümüne bakın.  
Görüntüleyici `appearance: 'system'`, `grayColor: 'slate'` ve `accentColor: 'indigo'` ile başlar, bu yüzden ilk karesinden itibaren işletim sisteminin bildirdiği açık ya da koyu görünümü gösterir ve o değiştiğinde geçiş yapar. Düzenleyici ise bunun yerine koyu başlar.  
Her alan kendi başına uygulanır, bu yüzden kısmi bir çağrı diğer ikisini olduğu gibi bırakır. Adlardan biri olmayan bir değer yok sayılır ve çağrı asla hata fırlatmaz.  
Görüntüleyicinin tema oluşturucusu ve `systemDarkMode` özelliği yoktur ve bir tema için hiçbir olay tetiklemez.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

`'system'` görünümünün gösterdiği açık ya da koyu görünümü, kendi açık ve koyu temasına sahip bir sayfa için adlandırır. Biri adlandırılmışken işletim sisteminin değişiklikleri yok sayılır.  
`null` ya da `'dark'` veya `'light'` dışındaki herhangi bir değer işletim sistemini izlemeye geri döner.  
Görünüm `'light'` veya `'dark'` iken ekranda hiçbir şeyi değiştirmez, ancak değer saklanır ve görünüm `'system'` olur olmaz uygulanır. Hiçbir şey tetiklemez.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Düzenleyicinin `Theme` belirteçlerini alarak ön ayarın üzerindeki tema belirteçlerini geçersiz kılar. [setTheme](./erd-editor-element.md#settheme) bölümüne bakın.  
Her çağrı bütün katmanı değiştirir, bu yüzden ön ayara dönmek için `{}` verin. Yalnızca belirteç adları, dize değerleriyle birlikte, tutulur ve sonraki bir `setPresetTheme` ön ayarı altında değiştirirken geçersiz kılmalar kalır.  
`--erd-editor-*` CSS özel özellikleri görüntüleyiciye de ulaşır; öğe üzerinde ya da üzerindeki herhangi bir yerde ayarlanırlar. [CSS değişkenleri](./erd-editor-element.md#css-variables) bölümüne bakın. Hiçbir stil sayfasının ulaşmadığı tuval, sayfanın `head` bölümündeki bir stil sayfası değiştiğinde ya da öğenin veya üzerindeki bir öğenin `class` veya `style` özniteliği değiştiğinde onları yeniden okur. `insertRule()` ile eklenen bir kural bunların hiçbirini değiştirmez, bu yüzden tuval onu bir sonraki böyle bir değişiklikte alır.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Görüntüleme dilini ayarlar: varsayılan `'system'` ya da düzenleyicinin [Görüntüleme dili](./erd-editor-element.md#display-language) bölümünün listelediği 25 koddan biri. Çıplak bir `'ko'` ya da dize olmayan bir değer gibi başka her şey yok sayılır.  
Dil; kontrol çubuğunun araç ipuçlarını, `Name View` listesini, paleti, yükleme bildirimlerini ve diyagramın kendisinin çizdiği sözcükleri, örneğin `unnamed` sözcüğünü değiştirir. Adlar, açıklamalar ve belgenin geri kalanı asla çevrilmez.

İngilizce görüntüleyicinin giriş noktasının parçasıdır ve çağrı dönmeden önce uygulanır. Diğer her dil kendi modülüdür; paketleyiciniz onu görüntüleyicinin yanında bir öbek olarak üretir ve görüntüleyici, bir sayfa o dili ilk kez istediğinde, sayfanın her görüntüleyicisi için bir kez, paketinizden getirir. Yerleşene kadar görüntüleyici gösterdiği dili göstermeye devam eder; ilk karede İngilizceyi. Yüklenemezse görüntüleyici İngilizce gösterir ve o dili yeniden istemek yeniden dener.  
[Script etiketi](./installation.md#script-tag) derlemesi 25 dilin tümünü tutar, bu yüzden hiçbirini getirmez. Düzenleyiciyi de içeren bir paket her dili düzenleyicinin öbeğiyle yükler. [Öğeleri kaydetme](./installation.md#registering-the-elements) bölümüne bakın.  
Döndürdüğü `Promise`, o dil yerleştiğinde ya da yerleşemediğinde çözümlenir ve asla reddedilmez. Sonraki bir çağrı başka bir dil istemedikçe o dil, başarısızlıktan sonra İngilizce, geçerli olur: Diller hangi sırayla yerleşirse yerleşsin sonraki çağrı kazanır.

İbranice, Arapça ve Farsça paleti ve yükleme bildirimlerini sağdan sola dizer. Tuval, mini harita, kaydırma çubukları ve pusulalı kontrol çubuğu, düzenleyicinin tuvali gibi soldan sağa kalır. [Sağdan sola yazılan diller](../guide/guides/language-and-theme.md#right-to-left-languages) bölümüne bakın.  
Görüntüleyici `lang` ve `dir` değerlerini kapalı gölge kökün içindeki kendi köküne koyar, ana öğeye ya da sayfaya asla koymaz.  
Hiçbir şey tetiklemez; görüntüleyicinin dil seçicisi yoktur ve hiçbir şey saklamaz.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

`'system'` değerinin temsil ettiği dili, kendi dil ayarına sahip bir sayfa için BCP 47 etiketi olarak adlandırır.  
Etiket kırpılır. `null`, boş bir dize veya dize olmayan bir değer sayfanın dillerine geri döner.  
Bunlar sayfanın `<html lang>` değeri, ardından görüntüleyici ilk bağlandığında bir kez okunan tarayıcının `navigator.languages` değeridir. `'system'`, bunlardan görüntüleyicinin bir dili olan ilkini, [setSystemLocale](./erd-editor-element.md#setsystemlocale) bölümündeki düzenleyici kuralıyla alır; hiçbirinin dili yoksa İngilizceyi. Bu yüzden `<html lang>` değeri görüntüleyicinin sahip olduğu bir dili adlandıran bir sayfa, tarayıcı neyi tercih ederse etsin o dili gösterir ve `lang` değerinin ya da tarayıcının dillerinin sonraki bir değişikliği hiçbir görüntüleyiciyi taşımaz.  
Yalnızca geçerli seçenek `'system'` iken önemlidir ve döndürdüğü `Promise`, [setLocale](#setlocale) işlevininki gibi çözümlenir.

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Görüntüleyiciyi kalıcı olarak sonlandırır. Öğe hâlâ sayfadayken de önce çıkarılmışken de dönmeden önce görünümü indirir, süren bir `src` getirmesini iptal eder ve işletim sisteminin renk düzenini ve sayfanın stillerini izlemeyi bırakır.  
Yok edilmiş bir görüntüleyici artık hiçbir şey çizmez, hiçbir şey getirmez ve bir sayfaya yeniden eklense bile hiçbir dil istemez. [value](#value) okumak yine tuttuğu belgeyi döndürür.  
Öğeyi sayfadan çıkarmak onu yok etmez: Geri konduğunda devam eder ve henüz göstermediği bir `src` adresini getirir. [Yükleme](#loading) bölümüne bakın.

```js
viewer.destroy();
```

## Odak ve tuşlar {#focus-and-keys}

Görüntüleyici bağlanırken, bir belge yerleşirken ya da paleti kapanırken odak almaz, bu yüzden sayfayı asla kendisine kaydırmaz ve sayfanın tuşlarını almaz.  
Tuvaline tıklamak ya da dokunmak, sayfayı kaydırmadan ona odak verir ve `Tab` tuşunun bir durağıdır. Düzenleyiciden farklı olarak kendi `focus()` ya da `blur()` üyesi yoktur. Sayfanın başka bir yerine basmak odağı yeniden alır.

Görüntüleyici odağı alana kadar sayfa, sayfayı kaydıran tekerleği ve dokunmatik yüzeyin çimdiklemesini tutar. Tuval üzerindeki bir parmak sayfayı kaydırır ve tuvali kaydırmaz, her tuş sayfaya engellenmeden ulaşır.  
Odağı aldıktan sonra:

- Tekerlek görünümü kaydırır, `Shift + Wheel` yana kaydırır. Metni taşan bir notun üzerinde tekerlek notu kaydırır.
- `Ctrl + Wheel` (Windows/Linux) veya `⌘ + Wheel` (Mac), dokunmatik yüzeyin çimdiklemesi veya dokunmatik ekranda iki parmak yakınlaştırır.
- Bir parmak görünümü kaydırır.
- `Ctrl + Plus` ve `Ctrl + Minus` (Windows/Linux) veya `⌘ + Plus` ve `⌘ + Minus` (Mac) yakınlaştırmayı `Zoom in` ve `Zoom out` düğmelerinin yaptığı gibi adımlar, `Ctrl + 0` (Windows/Linux) veya `⌘ + 0` (Mac) ise ekranın ortasını olduğu yerde tutarak doğrudan `100%` değerine döner.
- `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac) paleti açar, `Esc` kapatır.

Bunlar onun tek tuşlarıdır ve yeniden bağlanamazlar. Diğer her tuş, odakta olsun ya da olmasın sayfaya engellenmeden ulaşır: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` ve düzenleyicide düzenleme yapan her kombinasyon.

Palet yalnızca belgeyi arar ve hiçbir komut listelemez. Boş girdisi önekleri gösterir: `#` tabloları, `@` sütunları, `:` açıklamaları ve notları arar, `?` ise önekleri listeler; tıpkı düzenleyicide olduğu gibi. [Diyagramda arama](../guide/guides/quick-search.md#searching-the-diagram) bölümüne bakın. Önek içermeyen bir sözcük, diyagramda onu arayan satırların üstünde `No commands match` gösterir.  
Bir satır seçmek görünümü düzenleyicinin kuralıyla, [Bir atlamanın indiği yer](../guide/guides/table-related-functions.md#where-a-jump-lands) kuralıyla taşır, yakınlaştırmayı olduğu gibi bırakır ve ulaştığı öğenin dış çizgisini çizip öne getirir: tabloyu, sütunu ya da açıklamayı tutan tabloyu veya notu.  
Bir satır seçmek ya da `Esc` tuşuna basmak paleti kapatır ve odağı hiçbir öğede bırakmaz, bu yüzden bir sonraki tekerlek sayfayı kaydırır; tekerleği ve tuşları yeniden vermek için görünüme tıklayın. Palet açıkken tekerlek listesini kaydırır ve yakınlaştırma tuşları hiçbir şey yapmaz.

Odakta olsun ya da olmasın, ana fare düğmesiyle sürükleme, tuval üzerinde nerede olursa olsun, bir tablonun üzerinde de görünümü kaydırır. Hareketsiz bir tıklama ya da dokunma ilişkileri aydınlatır: bir tabloda o tablonun ilişkilerini, bir ilişki çizgisinde o çizgiyi; başka her yerde, bir not dahil, ışığı söndürür. Böyle bir tıklama bir palet atlamasının bıraktığı dış çizgiyi de temizler. İmlecin bir tablonun üzerinde durması, orada olduğu sürece ilişkilerini aydınlatır.  
Hiçbir basış hiçbir şeyi seçmez, taşımaz ya da düzenlemez. Bir atlamanın dış çizgisinden başka seçim yoktur, seçim kutusu yoktur ve hiçbir çift tıklama ya da `Enter` bir hücre açmaz.

## Yükleme {#loading}

`src` yüklenirken tuvalin ortasındaki bir bildirim, dönen bir yükleyicinin yanında `Loading diagram` yazar. Bir yükleme başarısız olduğunda, yeni bir `src` ya da bir `value` onun yerini alana veya `src` kaldırılana kadar, bir uyarı işaretinin yanında `Couldn't load the diagram` yazar. Basışlar bildirimin içinden tuvale geçer ve bildirim görüntüleme dilinde, sağdan sola bir dilde sağdan sola okunur.

`src` üzerinden de `value` üzerinden de yerleşen her belge, görüntüleyicinin kutusuna sığdırılır: `Fit` işlevinin yaptığı gibi tüm diyagram görünecek şekilde yakınlaştırılır ve kaydırılır, ortalanır; dosyanın kaydettiği yakınlaştırma ve kaydırma bir kenara bırakılır. Görüntüleyicinin henüz bir boyutu yokken verilen bir belge, yani bir sayfada değilken ya da kutusu boşken ayarlanan, bir boyutu olduğunda sığdırılır. Sonraki bir yeniden boyutlandırma yakınlaştırmayı korur; `Fit` yeniden sığdırır.

Görüntüleyici bir `src` adresini yalnızca bir sayfadayken getirir. Onu çıkarmak süren bir getirmeyi iptal eder ve geri koymak, başarısız olan dahil, henüz göstermediği bir `src` adresini getirir, zaten gösterdiği adresi asla getirmez. Artık gerekmeyen bir görüntüleyici [destroy](#destroy) ile sonlandırılır.

## Bir sayfaya ne ekler {#what-it-adds-to-a-page}

- Worker yok. Hiçbirini başlatmaz, bu yüzden bir İçerik Güvenliği Politikası onun için `worker-src` gerektirmez.
- Depolama yok. Hiçbir çerez, `localStorage`, `sessionStorage` ya da IndexedDB yazmaz.
- İki tür istek: kaynağı katı bir politikanın `connect-src` içine yazdığı [src](#src) getirmesi ve İngilizce dışındaki bir görüntüleme dilinin kendi paketinizden gelen modülü. [setLocale](#setlocale) bölümüne bakın.
- Katı bir `style-src` politikasının geçirdiği oluşturulmuş stil sayfalarında stiller. Oluşturulmuş stil sayfalarını desteklemeyen bir tarayıcı, örneğin 101 öncesi Firefox, bunun yerine `style-src 'unsafe-inline'` gerektiren `<style>` öğeleri alır.
- `window` üzerinde dinleyiciler. Giriş noktasını içe aktarmak sayfanın ömrü boyunca `mousedown`, `touchstart` ve paketin kendi `@dineug/erd-editor/internal-forward-move-start` olayı için üç dinleyici ekler. Tuvali çizen Konva `window.Konva` değerini ayarlar ve ilk sahnesiyle `window` üzerine fare ve dokunma dinleyicileri, `document` üzerine ise asla kaldırmadığı bir `visibilitychange` dinleyicisi ekler. Düzenleyicinin giriş noktası aynılarını ekler.
- [destroy](#destroy) işlemine kadar her görüntüleyici işletim sisteminin renk düzenini izler ve [setTheme](#settheme) bölümünün anlattığı özel özellikler için sayfanın stillerini gözler.
