---
sidebar_position: 4
description: Export image iletişim kutusunun seçeneklerini kullanarak, kendi kodunuzdan toImage ile bir belgeyi PNG veya SVG olarak çizin; tarayıcıda ve varsa dışa aktarma worker'ında.
---

# toImage

`5.0.0` sürümünden itibaren paket kökü, sayfada hiçbir düzenleyici olmadan bir belgeyi PNG veya SVG olarak çizen `toImage()` işlevini dışa aktarır.  
[Export image](../guide/guides/file-import-export.md#image) iletişim kutusundaki `PNG` ve `SVG` düğmelerinin yazdığı dosyaları, iletişim kutusunun üç seçeneğiyle, yani `Background`, `Dark mode` ve `Scale` ile, başka seçenek olmadan yazar.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` yanında bir tür olarak dışa aktarılır. [Giriş noktaları](./installation.md#entry-points) bölümüne bakın.

## value {#value}

Belgenin metni: bir `.erd.json` dosyasının tuttuğu, bir düzenleyicinin [value](./erd-editor-element.md#value) veya [runtimeValue](./erd-editor-element.md#runtimevalue) değeri ya da [setInitialValue](./erd-editor-element.md#setinitialvalue) işlevinin yüklediği başka bir metin.  
Boş metin ya da yalnızca boşluklardan oluşan metin boş bir diyagram çizer; bir belgenin alanlarından hiçbirini tutmayan ve ayrıştırıcının varsayılanlarla doldurduğu JSON da öyle.

## Seçenekler {#options}

| Seçenek | Varsayılan | Açıklama |
| --- | --- | --- |
| `format` | Yok; zorunludur | `'png'`, `image/png` türünde bir `Blob` ile, `'svg'` ise SVG'nin işaretlemesini bir dize olarak çözümlenir. |
| `background` | `true` | Diyagramın arkasına tuval rengini boyar. `false` onu saydam bırakır; bir ON DELETE veya ON UPDATE etiketinin altındaki kutu da buna dahildir. |
| `darkMode` | `false` | Açık temanın yerine koyu temayı çizer. |
| `scale` | `2` | Diyagramın %100'deki her birimi için `1`, `2` veya `3` görüntü pikseli. Yalnızca PNG'nin boyutunu belirler; bir SVG, ölçek ne olursa olsun diyagramın boyutundadır. |

`toImage()` başka hiçbir anahtarı okumaz, bu yüzden tabloda listelenmeyen bir anahtar hiçbir şeyi değiştirmez.

## Ne çizer {#what-it-draws}

Görüntü, iletişim kutusunun çizdiği görüntüdür:

- Diyagramın tamamı, çizdiği alana bir kenar boşluğu eklenerek kırpılmış ve belge hangi yakınlaştırmada kaydedilmiş olursa olsun her zaman %100'de, bu yüzden her tablo bütünüyle çizilir. Belgede [View Option](../guide/guides/table-related-functions.md#table-view-options) ile gizlenen şey ne çizilir ne de ona yer ayrılır, tablo grupları diğer her şeyin arkasına çizilir ve [sözlük denetimlerinin](../guide/guides/dictionary.md#marks-on-the-canvas) adlara verdiği renkler çizilmez.
- Bir PNG'nin boyutu, diyagramın %100'deki boyutunun `scale` ile çarpımıdır. Bir tarayıcı tuvaline sığmayacak kadar büyük olan, başarısız olmak yerine düşürülmüş bir çözünürlükte yazılır ve `toImage()` bunu bildirmez.
- Bir SVG metnini metin olarak tutar ve yazı tiplerini gömmek yerine adlandırır, bu yüzden düzenleyicinin yazı tipine sahip olmayan bir görüntüleyici başka bir yazı tipi çizer. Gölgeler dışarıda bırakılır.

İletişim kutusu düzenleyicinin ekranını aldığı yerde `toImage()` yalnızca belgeyi alır, böylece bir belge her sayfada aynı çizilir:

- Renkleri, öğenin varsayılan gri ve vurgu renklerinin, `slate` ve `indigo`, ön ayarıdır; `darkMode` `true` olmadıkça açıktır. Sayfanın hiçbir teması, hiçbir [setTheme](./erd-editor-element.md#settheme) geçersiz kılması ve hiçbir [tema oluşturucu](../guide/guides/language-and-theme.md) değişikliği ona ulaşmaz.
- Tabloları ve sütunları, belgenin tuttuğu [Ad görünümüyle](../guide/guides/logical-names.md#name-view) adlandırılır; `Name View` kilidi etkin bir dosyada bu, kilitli olan görünümdür.
- Diyagramın kendisinin yazdığı sözcükler, örneğin adsız bir tablonun yer tutucusu, İngilizcedir.

## Nerede çalışır {#where-it-runs}

`toImage()` bir tarayıcı sayfası gerektirir, çünkü bir tuval üzerinde ölçüm ve çizim yapar. Geldiği paket kökü yüklenmek için bir DOM gerektirir, bu yüzden Node'dan ya da bir Web Worker'dan erişilemez. [Sunucu tarafında işleme](./installation.md#server-side-rendering) bölümüne bakın.  
Çizmeden önce sayfanın yazı tiplerinin yüklenmesini bekler.

İletişim kutusunun yaptığı gibi, ana uygulama bir tane çalıştırıyorsa görüntü dışa aktarmanın paylaşımlı worker'ında çizer; böylece sayfa o sırada yanıt vermeye devam eder. Worker yoksa ya da zamanında yanıt vermezse ana iş parçacığında çizer. [Web Worker'lar](./installation.md#web-workers) bölümüne bakın.  
`toImage` içe aktaran ve hiçbir öğe içermeyen bir paket yalnızca görüntü dışa aktarma worker'ını taşır.  
İki [script etiketi](./installation.md#script-tag) derlemesinden hiçbiri onu taşımaz: `window.ErdEditor` ve `window.ErdViewer` nesnelerinde `toImage` yoktur.

## Ret durumları {#rejections}

Döndürdüğü Promise, hiçbir şey çizilmeden önce şu durumlarda reddedilir:

- sayfada `document` yoksa: bir `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` bir dize değilse, örneğin zaten bir nesneye ayrıştırılmış bir belgeyse: bir `TypeError`;
- bir seçenek [Seçenekler](#options) tablosunun listelemediği bir değer tutuyorsa, eksik bir `format` dahil, bir SVG ile verilen `'2'` biçimindeki bir `scale` da buna dahildir: seçeneği adlandıran bir `TypeError`, örneğin `toImage: scale cannot be 4`;
- metin ayrıştırıcının okuyabileceği bir belge değilse: ayrıştırıcının hatası, JSON olmayan bir metin için bir `SyntaxError`.

## Export image iletişim kutusu {#export-image-dialog}

İletişim kutusu ve `toImage()` aynı dışa aktarma üzerinden çizer, bu yüzden aynı seçeneklerle aynı görüntüyü yazarlar, ancak farklı yerlerden başlarlar:

| | `Export image` iletişim kutusu | `toImage()` |
| --- | --- | --- |
| Belge | İletişim kutusu açıldığında diyagramın bulunduğu hâl | Verdiğiniz metin |
| Koyu mod | Düzenleyicinin görünüşüne uyarak başlar ve uyduğu sürece ekranın kendi renklerini çizer | `darkMode` `true` olmadıkça kapalıdır ve her zaman ön ayardır |
| Ad görünümü | Düzenleyicinin gösterdiği | Belgenin tuttuğu |
| Kendi sözcüklerinin dili | Düzenleyicinin görüntüleme dili | İngilizce |
| Sonuç | Tarayıcı ya da [dışa aktarma geri çağırma işlevi](./installation.md#file-dialogs) üzerinden kaydedilir veya panoya kopyalanır | Size geri verilir; iki dosya geri çağırma işlevinden hiçbiri çağrılmaz |

`Copy to clipboard` seçeneğinin bir karşılığı yoktur. Bir tane isteyen sayfa, PNG `Blob` nesnesini panoya kendisi yazar.
