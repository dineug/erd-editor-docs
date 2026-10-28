---
sidebar_position: 18
description: erd-editor.io/embed adresini çerçeveleyerek bir diyagramı başka bir sitede kodsuz, salt okunur gösterin; URL'sini ve iframe satırını oluşturucuda hazırlayın, tema, dil, Ad görünümü, mini harita, kontroller ve renkleri URL'de ayarlayın; dosyayı GitHub'dan ya da CORS'a izin veren bir sunucudan sunun.
---

# Gömme

[erd-editor.io/embed](https://erd-editor.io/embed), başka bir sitenin çerçevelemesi için sayfayı dolduran bir görüntüleyicide diyagramı salt okunur gösterir: bir wiki, bir blog, bir site oluşturucu ya da kendi script'lerini yükleyemeyen herhangi bir sayfa.  
`src` parametresi belgeyi adlandırır; bu, ERD Editor'un kaydettiği biçimde bir dosyanın, örneğin bir `.erd.json` dosyasının adresidir. URL'nin geri kalanı görüntüleyicinin onu nasıl göstereceğini belirler ve aynı adresteki oluşturucu URL'yi ve iframe satırını sizin için yazar.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Bu çerçeve, erd-editor deposundaki [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) dosyasını gösterir ve onu bir sayfaya koyan satır şudur:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Çerçeve ne gösterir {#what-the-frame-shows}

Çerçeve diyagramın tablolarını, sütunlarını, ilişkilerini, notlarını ve tablo gruplarını gösterir; içinde diyagramı ya da dosyayı düzenleyen hiçbir şey yoktur.  
Diyagram yüklenirken, dosyanın hangi yakınlaştırmayı ve kaydırma konumunu kaydettiğine bakılmaksızın çerçeveye sığdırılır, bu yüzden çerçevenin boyutu hangi yakınlaştırmada açılacağını belirler.

Tuvalin üzerinde şunlar bulunur:

- Diyagramın içeriği olduğu sürece mini harita.
- Altta kontrol çubuğu: `Zoom out`, tıklandığında yakınlaştırmayı sıfırlayan yakınlaştırma düzeyi, `Zoom in`, `Fit`, `Name View` listesi ve diyagramın hiçbir kısmı ekranda değilken `Go to content`.
- Sağ altta, erd-editor.io adresini yeni bir sekmede açan ve ona hiçbir yönlendiren bilgisi göndermeyen `erd-editor.io` bağlantısı; böylece tıklama, çerçevenin gösterdiği belge hakkında siteye hiçbir şey söylemez. Dar bir çerçevede kontrol çubuğunun bir kısmını örtebilir.

Dosya yüklenirken çerçeve `Loading diagram` gösterir. Getirilemezse ya da hiçbir belge tutmuyorsa çerçeve, `Couldn't load the diagram` iletisiyle boş bir diyagram gösterir. [GitHub'daki dosyalar](#files-on-github) ve [Diğer sunuculardaki dosyalar](#files-on-other-servers) bölümlerine bakın.

Çerçeve yalnızca kendi URL'sini ve ziyaretçinin sistemini izler. Bir ziyaretçinin erd-editor.io üzerindeki kendi dili ve teması onda uygulanmaz.

## Oluşturucu {#the-builder}

Oluşturucuyu, `Embed a diagram` başlıklı sayfayı almak için [erd-editor.io/embed](https://erd-editor.io/embed) adresini `src` olmadan açın:

1. Belgenin adresini `Document URL` alanına yapıştırın. `Enter` tuşuna bastığınızda ya da alandan çıktığınızda uygulanır, bu yüzden yazmak hiçbir şey getirmez. Uygulandığında alanın altındaki `Loads from` satırı görüntüleyicinin getirdiği adresi adlandırır: verdiğiniz adres ya da GitHub'daki bir sayfa için GitHub'ın ham ana makinesindeki adresi. [GitHub'daki dosyalar](#files-on-github) bölümüne bakın.
2. Seçenekleri seçin. Her biri önizlemeye, URL'ye ve iframe satırına hemen uygulanır:
   - `Theme`: `System`, `Light` veya `Dark`.
   - `Display Language`: `System`, yanında tarayıcınızda karşılık geldiği dil, ardından 25 dil, her biri kendi adıyla.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` veya `Both Names`. `As Saved`, dosyanın kaydettiği Ad görünümünü gösterir.
   - `Accent color` ve `Gray color`, her biri adıyla ve bir renk örneğiyle listelenir.
   - `Minimap` ve `Controls`, ikisi de açık olan iki anahtar.
   - Piksel cinsinden `Height`, başlangıçta `480`. Pozitif bir tam sayı olmayan yükseklik `480` sayılır.
3. `Preview` alanını denetleyin: görüntüleyici çerçevenin göstereceği gibi, `erd-editor.io` bağlantısıyla, `Height` kadar yüksek bir kutuda. `System` dili, erd-editor.io'nun kendisi hangi dili gösteriyor olursa olsun tarayıcınızın dilidir.
4. Sonucu kopyalayın. `Embed URL` çerçevenin adresidir, `Embed code` ise belirlediğiniz yükseklik ve `100%` genişlikle iframe satırıdır. Her birinin, bir belge URL'si uygulanana kadar devre dışı kalan ve kopyadan sonra kısa bir süre, bir değişiklik kopyaladığını yeniden yazana kadar `Copied` yazan bir `Copy` düğmesi vardır.

`Document URL` alanını temizlemek, uygulandığında önizlemeyi ve iki sonucu boşaltır.

## URL parametreleri {#url-parameters}

| Parametre | Değerler | Varsayılan |
| --- | --- | --- |
| `src` | Belgenin adresi, URL kodlamalı. | Yok: bu parametre olmadan ya da boş olarak verildiğinde sayfa oluşturucudur. |
| `theme` | `light`, `dark` veya `system`. | `system`: ziyaretçinin tarayıcısının bildirdiği açık ya da koyu mod. |
| `locale` | `system` ya da [dil tablosundan](./language-and-theme.md#display-language) bir kod, örneğin `de-DE`. | `system`: ziyaretçinin tarayıcı dilleri, [Sistem](./language-and-theme.md#what-system-follows) seçeneğinin eşleştirdiği gibi eşleştirilir; görüntüleyicinin hiçbirini bilmediği durumda İngilizce. |
| `name-view` | `physical`, `logical` veya `both`. | Dosyanın kaydettiği Ad görünümü. |
| `minimap` | `false` mini haritayı gizler. | Gösterilir. |
| `controls` | `false` kontrol çubuğunu gizler. | Gösterilir. |
| `accent-color` | [Tema oluşturucunun](./language-and-theme.md#theme) 26 vurgu renginden biri, örneğin `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` veya `sand`. | `slate` |

Varsayılanlar görüntüleyicinin kendi varsayılanlarıdır; `jade` ve `olive` ile başlayan web uygulamasının değil.

- Oluşturucu, varsayılanında olan her seçeneği URL'nin dışında bırakır, bu yüzden bir gömme URL'si yalnızca farklı olanı tutar.
- Görüntüleyicinin almadığı bir değer yok sayılır ve seçeneği varsayılanını korur. Değerler listelendiği gibi tam olarak eşleştirilir, bu yüzden `theme=Dark` yok sayılır ve `minimap` ile `controls`, `false` dışındaki her değerde gösterilmeye devam eder.
- İki kez verilen bir parametre ilk değerini alır.
- `src`, oluşturucunun yazdığı gibi URL kodlamalıdır, çünkü kendi `&` ya da `#` karakterini tutan bir adres aksi hâlde kesilir.

## GitHub'daki dosyalar {#files-on-github}

GitHub'daki bir dosya ya da gist, yukarıdaki çerçevede olduğu gibi, sayfasının gösterdiği adresle verilebilir. Görüntüleyici onu bunun yerine, başka bir sitenin isteğini yanıtlayan ve sayfanın kendi adresinin yanıtlamadığı GitHub'ın ham ana makinesinden getirir:

- Bir dosyanın sayfası, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, ya da `raw` adresi, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` adresinden yüklenir. `<ref>` bir dal, bir etiket ya da bir commit'tir: Dal, dosyayı o dalın tuttuğu hâliyle gösterir; etiket ya da commit o sürümü korur.
- Bir gist'in sayfası, `https://gist.github.com/<user>/<id>`, gist'in ilk dosyası olan `https://gist.githubusercontent.com/<user>/<id>/raw` adresinden yüklenir. Diyagramı gist'in tek dosyası olarak tutun.

Gömme URL'si verdiğiniz adresi korur, oluşturucunun `Loads from` satırı ise getirileni gösterir.  
Bu yalnızca herkese açık depolar ve herkese açık gist'ler için çalışır. Ham ana makine her dosyayı beş dakika önbelleğe alır, bu yüzden gönderdiğiniz bir değişikliğin çerçevede görünmesi o kadar sürebilir.

## Diğer sunuculardaki dosyalar {#files-on-other-servers}

erd-editor.io'daki görüntüleyici dosyayı ziyaretçinin tarayıcısından düz bir `GET` ile getirir, bu yüzden onu tutan sunucunun bu çapraz kaynak isteğine (CORS) izin vermesi gerekir: Yanıtının `https://erd-editor.io` adresine izin veren bir `Access-Control-Allow-Origin` başlığı, örneğin `*`, taşıması gerekir.  
İstek hiçbir çerez taşımaz, bu yüzden dosyanın oturum açmadan okunabilir olması gerekir.  
Bu başlık olmadan ya da bir hatayla veya bir ERD Editor belgesi dışında bir şeyle yanıt veren bir adres için çerçeve `Couldn't load the diagram` gösterir.

## Çerçevenin içinde {#in-the-frame}

Çerçeve, bir ziyaretçi ona tıklayana ya da dokunana veya `Tab` ile ulaşana kadar hiçbir tekerleği, hareketi ya da tuşu almaz. O zamana dek tekerlek, kaydırma hareketi ve çimdikleme çevresindeki sayfayı her zamanki gibi kaydırır veya yakınlaştırır.  
Odağı aldıktan sonra tekerlek diyagramı kaydırır, `Ctrl + Wheel` (Windows/Linux) veya `⌘ + Wheel` (Mac) ve çimdikleme onu yakınlaştırır, `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac) ise belge üzerinde, `#` ile bir tablonun, `@` ile bir sütunun, `:` ile bir açıklamanın ya da notun bulunduğu bir arama açar.  
Çerçevenin odağı olsun ya da olmasın sürükleme diyagramı kaydırır, bir tıklama ya da dokunma ise ilişkileri aydınlatır: tıklanan tablonunkileri ya da tıklanan tek ilişkiyi. İmlecin üzerinde durduğu tablo kendi ilişkilerini aydınlatır. Tüm tuşlar için [Odak ve tuşlar](../../api/erd-viewer-element.md#focus-and-keys) bölümüne bakın.

Daha büyük bir diyagramda yakınlaştırıp arayarak denemek için, dokuz tablo ve iki tablo grubundan oluşan [kitabevi örneğini](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json) kendi sayfasında açın.

## Analitik {#analytics}

erd-editor.io, web uygulamasının ziyaretlerini saydığı gibi çerçeveye yapılan ziyaretleri de Google Analytics ile sayar. Bir çerçeve için kaydettiği adres yalnızca `erd-editor.io/embed` adresidir; `src` parametresinin adlandırdığı belge adresi kaydedilmez.  
[Gizlilik Politikası](https://erd-editor.io/privacy) sayfasına bakın.

## Görüntüleyiciyi kendiniz yükleme {#loading-the-viewer-yourself}

Script yükleyebilen bir sayfa, bunun yerine `@dineug/erd-editor` paketindeki [`<erd-viewer>`](../../api/erd-viewer-element.md) öğesiyle bir diyagram gösterebilir. Aynı seçenekleri öznitelikler ve yöntemler olarak alır, erd-editor.io'ya hiçbir istek yapmaz ve CORS gerektirmeden sayfanın kendi sitesinden bir belge yükleyebilir.
