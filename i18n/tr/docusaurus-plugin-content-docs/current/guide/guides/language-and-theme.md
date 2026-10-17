---
sidebar_position: 15
description: Düzenleyicinin 25 görüntüleme dili, sağdan sola düzen, tema oluşturucunun System, Light ve Dark görünüşleri ile renkleri ve her ana uygulamanın bunları nerede sakladığı.
---

# Dil ve tema

Düzenleyicinin kendi metni 25 dilde sunulur, görünümü ise bir temadır: bir görünüş (`System`, `Light` veya `Dark`), bir gri tonu ve bir vurgu rengi.  
İkisi de diyagrama değil, düzenleyiciyi kullanan kişiye aittir. Hiçbiri dosyaya kaydedilmez, [geri alma geçmişine](./undo-redo.md) işlenmez veya ortak çalışanlarla paylaşılmaz, bu nedenle herkes kendi seçimini görür ve ikisinden birini değiştirmek bir dosyayı hiçbir zaman değiştirilmiş olarak işaretlemez.

İkisi de [Ayarlar](./settings.md) sekmesinde bulunmaz. Araç çubuğunda [`Explorer`](./explorer.md) düğmesinden sonra bir `Theme` düğmesi ve hemen onun ardından bir `Display Language` düğmesi bulunur. [Hızlı arama](./quick-search.md), `Theme` ve `Display Language` öğelerini her sekmede listeler.  
Web uygulaması, Google Drive, VS Code, JetBrains IDE'leri ve Obsidian ikisini de sunar ve seçimlerinizi hatırlar. [Her ana uygulamada](#in-each-host) bölümüne bakın. Her ikisi salt okunur bir düzenleyicide de çalışır.

## Görüntüleme dili {#display-language}

Dil, düzenleyicinin kendi metnini kapsar: araç çubuğundaki araç ipuçları, bağlam menüleri, Hızlı arama, paneller ve iletişim kutuları, Ayarlar sekmesi, [karşılama ekranı](./editing-start.md#welcome-screen), bildirimler ve iletiler ile boş bir ad, veri türü, varsayılan değer veya açıklamanın tuvalde ve dışa aktarılan bir görüntüde gösterdiği yer tutucu.  
Şunları her dilde yazıldığı gibi bırakır: tablo ve sütun adlarınız, açıklamalarınız ve notlarınız; veritabanı sistemleri, Kod oluşturucu dilleri ve dosya biçimleri; veri türleri, SQL anahtar sözcükleri ve `ON DELETE` ile `ON UPDATE` eylemleri; Şema SQL seçenekleri `Create`, `If not exists`, `Drop & re-create`, `USE` ve `CREATE + USE`; `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` ve `AK1.1` işaretleri; [Fark görüntüleyicinin](./table-related-functions.md#diff-viewer) `A`, `M`, `D`, `R` ve `~` durum harfleri; `None` dışındaki ad biçimi ve `Bracket` seçenekleri; klavye tuşlarının adları; tema oluşturucunun renk adları; oluşturulan SQL ve kod; dışa aktarılan dosya adları.

Diller, seçicinin listelediği sırayla:

| Seçicide | Dil | Kod |
| --- | --- | --- |
| Bahasa Indonesia | Endonezce | `id-ID` |
| Deutsch | Almanca | `de-DE` |
| English | İngilizce | `en` |
| Español | İspanyolca | `es-ES` |
| Euskara | Baskça | `eu-ES` |
| Français | Fransızca | `fr-FR` |
| Italiano | İtalyanca | `it-IT` |
| Nederlands | Felemenkçe | `nl-NL` |
| Polski | Lehçe | `pl-PL` |
| Português | Portekizce | `pt-PT` |
| Português Brasileiro | Brezilya Portekizcesi | `pt-BR` |
| Română | Rumence | `ro-RO` |
| Slovenčina | Slovakça | `sk-SK` |
| Slovenščina | Slovence | `sl-SI` |
| Svenska | İsveççe | `sv-SE` |
| Türkçe | Türkçe | `tr-TR` |
| Русский | Rusça | `ru-RU` |
| Українська | Ukraynaca | `uk-UA` |
| עברית | İbranice | `he-IL` |
| العربية | Arapça | `ar-SA` |
| فارسی | Farsça | `fa-IR` |
| 日本語 | Japonca | `ja-JP` |
| 简体中文 | Basitleştirilmiş Çince | `zh-CN` |
| 繁體中文 | Geleneksel Çince | `zh-TW` |
| 한국어 | Korece | `ko-KR` |

Hızlı aramanın Kod oluşturucu sekmesinde sunduğu `Language` öğesi ile Ayarlar sekmesindeki [Kilit](./settings.md#lock) listesinin `Language` satırı görüntüleme dili değil, [Kod oluşturucunun hedef dilidir](./code-generator.md#language).

### Dil seçme {#picking-a-language}

`Display Language` düğmesi (dil simgesi) `Display Language` seçicisini açar. Bu, araç çubuğunun altında, hangi sekme açıksa onun üzerinde duran, `Display Language` başlıklı bir paneldir.  
En başta, yanında şu anda karşılık geldiği dille birlikte `System` gelir ve liste kaydırılırken görünür kalır. Ardından her biri kendi adıyla 25 dil gelir ve etkin olan seçeneği bir onay işareti gösterir.

![Görüntüleme dilini araç çubuğundan önce 한국어, ardından araç çubuğunu yansıtan ama diyagramı yansıtmayan العربية olarak değiştirme ve yeniden System seçeneğine dönme](/img/demo-display-language.webp)

Panel, klavye odağı işaretli satırdayken açılır:

- `↑` ve `↓` tuşları satırlar arasında döngüsel olarak gezinir, `Home` ve `End` tuşları ise ilk ve son satıra atlar.
- `Enter` veya `Space` tuşu, bir tıklamanın yaptığı gibi odaktaki satırı seçer.

Bir seçim hemen uygulanır, paneli kapatır ve klavye odağını düzenleyiciye geri verir.

Paneli seçim yapmadan `Escape` tuşuyla, başlığın yanındaki ve araç ipucunda `Close (ESC)` yazan `x` düğmesiyle, düzenleyicide panelin dışında araç çubuğu hariç herhangi bir yere basarak ya da `Display Language` düğmesine yeniden basarak kapatın.  
Seçiciyi açmak tema oluşturucuyu ve Tablo özelliklerini kapatır. Açık bir [Gezgin](./explorer.md#dialogs-beside-it) açık kalır ve soldan sağa yazılan bir dilde seçici, Gezginin üzerinde değil, hemen yanında durur.  
Hızlı aramayı veya tema oluşturucuyu açmak seçiciyi kapatır, `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuşları da öyle. Bu kısayol [Gezgini](./explorer.md#opening-and-closing) arama alanına odaklanmış olarak açar ya da Gezgin zaten açıksa onu açık tutar ve klavye odağını Bul alanına taşır. Araç çubuğundaki `Explorer` düğmesi seçiciyi açık bırakır.

Klavye odağı paneldeyken birkaç düzenleyici kısayolu çalışmaya devam eder: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` ve `Zoom Reset`. [Kısayollar](./settings.md#shortcuts) bölümüne bakın. Diğer tüm düzenleyici kısayolları, ok tuşları ve `Tab` tuşu panelin ötesine geçmez, bu nedenle düzenleyici bunlara tepki vermez. Ana uygulamanın kendi kaydetme işlemi gibi düzenleyicinin bağlamadığı tuşlar her zamanki gibi ana uygulamaya ulaşır.

[Hızlı aramada](./quick-search.md) `Display Language` öğesi, etkin seçenekte bir onay işaretiyle `System` seçeneğini ve 25 dili listeler. Bir dil orada İngilizce adıyla veya koduyla da bulunur, bu nedenle `german` veya `de-DE` araması `Deutsch` seçeneğini bulur.

### Sistem seçeneği neyi izler {#what-system-follows}

Web uygulamasında, Google Drive'da, VS Code'da, JetBrains IDE'lerinde ve Obsidian'da dil `System` seçeneğiyle başlar. Bu seçenek ana uygulamanın dilini izler:

- Web uygulamasında, Google Drive'da ve kendi sayfanızda: tarayıcının tercih edilen dilleri. Bunlardaki bir değişiklik hemen izlenir.
- VS Code'da: VS Code'un görüntüleme dili.
- Bir JetBrains IDE'sinde: IDE'nin kendi arayüzünü gösterdiği dil.
- Obsidian'da: Obsidian'ın dili.

`System`, bu diller arasından düzenleyicide bulunan ilkini alır, hiçbiri yoksa İngilizceyi alır.  
Bölgesel bir varyant kendi dili sayılır, bu nedenle `de-AT` Deutsch, `fr-CA` ise Français olur. Çince yazı sistemine göre belirlenir: Geleneksel yazı sistemi 繁體中文, diğer her yazı sistemi 简体中文 olur. Yazı sistemi belirtilmemişse Tayvan, Hong Kong veya Makao 繁體中文, diğer Çince türleri 简体中文 olur. Portekizce, Brezilya dışında bir bölge belirtilmedikçe Português Brasileiro olur, bu nedenle `pt-PT` Português olur; Obsidian'ın Portekizcesi de Português olur.

### Sağdan sola yazılan diller {#right-to-left-languages}

עברית (İbranice), العربية (Arapça) ve فارسی (Farsça) düzenleyiciyi sağdan sola yerleştirir: Araç çubuğu, menüler, paneller ve iletişim kutuları, Hızlı arama ve Ayarlar sekmesi yansıtılır. Bir bağlam menüsünün alt menüleri sola doğru açılır ve araç çubuğundaki Geri al ile Yinele simgeleri yer değiştirir, böylece Geri al simgesi sağdan sola okuyan birinin ilerleyiş yönüne göre geriyi gösterir.

Diyagramın kendisi asla yansıtılmaz. Tabloları, sütunları, ilişkileri ve notlarıyla tuval soldan sağa kalır; mini harita, kaydırma çubukları, [tuval araç çubuğu](./table-related-functions.md#canvas-toolbar), [Görselleştirme](./visualization.md) ve onun araç çubuğu, veri türü hücreleri, Şema SQL ve Kod oluşturucu sekmelerindeki kod, renk seçici, Fark görüntüleyicinin iki tarafı, Zaman yolculuğu ve Otomatik düzenin önizlemesi de öyle kalır.  
[Gezgin](./explorer.md#beside-the-canvas) tuvalin solunda, Fark görüntüleyicinin değişiklik ağacı da görüntüleyicinin solunda kalır ve ikisinin de sürükleme kenarı sağ tarafındadır. İçeride ise ikisi de sağdan sola okunur: Alanları ve satırları yansıtılır, satırlar sağdan girintilenir ve her iki ağaçta da `←` tuşu bir satırı genişletir veya ilk alt öğesine geçer, `→` tuşu ise satırı daraltır veya üst öğesine çıkar. [Gezgindeki tuşlar](./explorer.md#keys-in-the-explorer) bölümüne bakın.  
Adlar, açıklamalar ve yazdığınız diğer metinler kendi yönlerini korur, bu nedenle İbranice, Arapça veya Farsça bir ad tuvalde de sağdan sola okunur.

## Tema {#theme}

`Theme` düğmesi (kontrast simgesi) tema oluşturucuyu açar. Bu, araç çubuğunun altında, hangi sekme açıksa onun üzerinde duran, `Theme` başlıklı bir paneldir. Üç bölümü vardır:

- `Accent color`: 26 renk örneği. Her birinin adı araç ipucunda yazar, örneğin `indigo`.
- `Gray color`: 6 renk örneği, `gray`, `mauve`, `slate`, `sage`, `olive` ve `sand`.
- `Appearance`: `System`, `Light` ve `Dark`.

![Tema oluşturucuyu araç çubuğundan açma, bir vurgu rengi ve bir gri tonu seçme, görünüşü önce Light, ardından System olarak değiştirme](/img/demo-theme-builder.webp)

Her bölümde etkin olan seçim işaretlidir ve bir seçim, tema oluşturucu açık kalırken hemen uygulanır.  
Bir renk seçmek görünüşü olduğu gibi bırakır, bu nedenle `System` altında seçilen bir renk `System` görünüşünü korur.

`System`, ana uygulama gibi açık veya koyu görünür ve ana uygulama geçiş yaptığında o da geçiş yapar:

- Web uygulamasında, Google Drive'da ve kendi sayfanızda: tarayıcının bildirdiği, işletim sistemini izleyen açık veya koyu mod.
- VS Code'da: açık bir renk temasında açık, koyu bir renk temasında veya iki yüksek kontrast temasından herhangi birinde koyu.
- Bir JetBrains IDE'sinde: IDE'nin açık veya koyu teması.
- Obsidian'da: Obsidian'ın açık veya koyu teması.

Tema oluşturucuyu `Escape` tuşuyla, başlığın yanındaki ve araç ipucunda `Close (ESC)` yazan `x` düğmesiyle, düzenleyicide panelin dışında araç çubuğu hariç herhangi bir yere basarak ya da `Theme` düğmesine yeniden basarak kapatın.  
Tema oluşturucuyu açmak Tablo özelliklerini ve `Display Language` seçicisini kapatır. Açık bir [Gezgin](./explorer.md#dialogs-beside-it) açık kalır ve soldan sağa yazılan bir dilde tema oluşturucu, Gezginin üzerinde değil, hemen yanında durur.  
Hızlı aramayı veya `Display Language` seçicisini açmak tema oluşturucuyu kapatır, `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuşları da öyle. Bu kısayol [Gezgini](./explorer.md#opening-and-closing) arama alanına odaklanmış olarak açar ya da Gezgin zaten açıksa onu açık tutar ve klavye odağını Bul alanına taşır. Araç çubuğundaki `Explorer` düğmesi tema oluşturucuyu açık bırakır.  
Tema oluşturucu hiçbir tuşu alıkoymaz, bu nedenle açıkken düzenleyicinin kısayolları çalışır.

[Hızlı aramada](./quick-search.md) `Theme` öğesi, etkin görünüşte bir onay işaretiyle `System`, `Light` ve `Dark` seçeneklerini listeler. Birini seçmek yalnızca görünüşü değiştirir, gri tonunu ve vurgu rengini olduğu gibi bırakır.

## Her ana uygulamada {#in-each-host}

Düzenleyicide araç çubuğundan veya Hızlı aramadan seçtiğiniz şey, ana uygulamanın onu sakladığı yere kaydedilir ve açık olan her diyagram, nerede yapılırsa yapılsın bu seçimdeki bir değişikliği hemen izler.  
VS Code'da, bir JetBrains IDE'sinde ve Obsidian'da ana uygulamanın `Auto` seçeneği (VS Code'da `auto` değeri), düzenleyicinin `System` seçeneğidir. `System` seçeneğini seçmek `Auto` değerini kaydeder, `Light` veya `Dark` seçeneğini seçmek ise `Auto` bu görünüşü zaten gösteriyor olsa bile o görünüşü kaydeder.  
Uzantının ve eklentilerin kendi ayarları ve bildirimleri, görüntüleme dili ne olursa olsun İngilizcedir.

### Web uygulaması ve Google Drive {#web-app-and-google-drive}

Ortak düzenleme oturumları dahil erd-editor.io üzerinde ve Google Drive'da, uygulama ve içindeki her diyagram için tek bir dil ve tek bir tema geçerlidir.  
İkisi de şemada veya Drive dosyasında değil, bu tarayıcıda saklanır ve her erd-editor.io sekmesi bunları paylaşır: Bir sekmede yapılan seçim diğerlerini hemen değiştirir.

Bir dil seçene kadar dil, tarayıcının tercih edilen dillerini izleyen `System` seçeneğidir.  
Kenar çubuğu, çöp kutusu, ortak düzenleme ve Google Drive ekranları gibi uygulamanın kendi metni de aynı dili izler. İbranice, Arapça ve Farsçada uygulamanın tamamı sağdan sola yerleşir. Gizlilik Politikası, Hizmet Koşulları ve destek sayfaları İngilizce kalır.  
Düzenleyicinin paneli ve Hızlı aramanın yanı sıra kenar çubuğunun alt satırında, `Privacy` ve `Terms` bağlantılarının yanında, araç ipucunda `Display Language` yazan bir dil düğmesi bulunur. Menüsü, karşılık geldiği dille birlikte `System` seçeneğini ve ardından 25 dili listeler.

Tema `System` görünüşüyle, `olive` gri tonu ve `jade` vurgu rengiyle başlar.  
Tema oluşturucu ve Hızlı aramanın yanı sıra kenar çubuğunun altında `System`, `Light` ve `Dark` olmak üzere üç simge düğmesi bulunur: erd-editor.io üzerinde `Trash` öğesinin, Google Drive'da ise `Sign out` öğesinin yanında. Bunlar tema oluşturucuyla aynı görünüşü ayarlar.

### VS Code {#vs-code}

Uzantının ayarları, VS Code'un Settings ekranında ERD Editor altında bulunur:

| Ayar | Değerler | Varsayılan |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` veya [dil tablosundaki](#display-language) bir kod | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | altı gri tonu | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 vurgu rengi | `indigo` |

Settings düzenleyicisi dil ayarında önce `Auto` seçeneğini, ardından her dili kendi adıyla listeler. `settings.json` dosyasında hiçbir dili belirtmeyen bir değer `auto` olarak okunur.  
Düzenleyicide yapılan bir tema seçimi üç tema ayarının üçünü de yazar. Seçim, ilgili ayarın zaten tanımlı olduğu yere yazılır: çalışma alanı klasörü, o yoksa çalışma alanı, o da yoksa kullanıcı ayarları.

### JetBrains IDE'leri {#jetbrains-ides}

Settings | Tools | ERD Editor içinde `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` ve `Display language:` (`Auto`, ardından her dil kendi adıyla) ayarları bulunur ve bunlar IDE'nin tamamı için saklanır.  
Bunlar `Auto`, `Slate`, `Indigo` ve `Auto` değerleriyle başlar.

### Obsidian {#obsidian}

Settings → ERD Editor içinde `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` ve `Display language` (`Auto`, ardından her dil kendi adıyla) ayarları bulunur ve bunlar her kasa için ayrı saklanır.  
Bunlar `Auto`, `Slate`, `Indigo` ve `Auto` değerleriyle başlar.  
Bir değişiklik, ayrı pencerelerdekiler dahil kasanın her ERD sekmesine uygulanır.

### Kendi sayfanız {#your-own-page}

Kendi sayfanızdaki bir `<erd-editor>` öğesi, sayfa bunları [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) ve [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker) özellikleriyle açana kadar `Theme` veya `Display Language` düğmesi göstermez ve Hızlı arama da hiçbirini listelemez.  
Sayfa bir dil ayarlayana veya okuyucu bir dil seçene kadar düzenleyici İngilizce görünür ya da `enableLocalePicker` açıkken `System` seçeneğini izler.  
Sayfa başka bir tema ayarlamadıkça veya [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode) özelliğini açmadıkça tema `Dark` görünüşüyle, `slate` gri tonu ve `indigo` vurgu rengiyle başlar.  
Okuyucunun seçimi hemen uygulanır, ancak öğe iki seçimden hiçbirini kaydetmez: Başlangıç değerlerini sayfa ayarlar ve okuyucunun seçimlerini de sayfanın kendisi kaydeder. API'deki [Tema](../../api/erd-editor-element.md#theme) ve [Görüntüleme dili](../../api/erd-editor-element.md#display-language) bölümlerine bakın.
