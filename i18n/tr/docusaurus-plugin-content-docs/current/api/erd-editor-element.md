---
sidebar_position: 2
description: erd-editor öğesinin API'si – öznitelikler, value ve runtimeValue, olaylar, temalar, görüntüleme dili, karşılama ekranı, tuş bağlamaları ile şema içe ve dışa aktarma.
---

# ErdEditorElement

Düzenleyici sıradan bir `HTMLElement` öğesidir.  
Tür tanımı aşağıdaki gibidir.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Düzenleyici kapalı bir gölge köke işlenir, bu nedenle `editor.shadowRoot` değeri `null` olur ve stiller ne sayfadan içeri ne de içeriden sayfaya sızar.  
İçerideki hiçbir şeye seçiciyle ulaşılamaz – bunun yerine düzenleyiciyi [setTheme](#settheme) yöntemi ve `--erd-editor-*` CSS özel özellikleriyle biçimlendirin.

Öznitelik olarak yalnızca `readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` ve `enable-welcome-screen` vardır ve beşi de varsayılan olarak `false` değerini alır. Son ikisi `4.0.0` sürümünde eklendi. Her biri değerini [readonly](#readonly) bölümünde anlatıldığı gibi okur.

`4.1.0` sürümünden itibaren ERD sekmesinde, tuvalin soluna yerleşik ve en üstünde Bul ve değiştir yer alan bir diyagram ağacı olan [Gezgin](../guide/guides/explorer.md) bulunur. Hiçbir öznitelik, özellik, yöntem veya olay onu açmaz, kapatmaz ya da durumunu bildirmez: Gezgin araç çubuğundaki `Explorer` düğmesiyle, Hızlı aramadaki veya tuvalin bağlam menüsündeki `Toggle Explorer` öğesiyle ya da [`findReplace`](#setkeybindingmap) bağlamasıyla açılır.  
Her öğe Gezgin kapalı olarak başlar. Gezginin açık olup olmadığı, genişliği, daraltma durumu ve araması, sekme değişiklikleri ve `setInitialValue` dahil her yükleme boyunca öğe var olduğu sürece korunur ve hiçbir zaman `value`, `runtimeValue`, geri alma geçmişi ya da paylaşılan bir depo içinde yer almaz.

`4.2.0` sürümünden itibaren tabloların ve sütunların adlarının yanında [mantıksal adları](../guide/guides/logical-names.md) da olabilir ve sekme gibi bir belge ayarı olan Ad görünümü, tuvalin bunların adlarını mı, mantıksal adlarını mı yoksa her ikisini mi göstereceğine karar verir.  
Araç çubuğunda ayrıca `Code Generator` ile `Settings` arasında, belgenin sözcüklerini, terimlerini, değer alanlarını ve bir `Checks` sayfasını barındıran bir [Sözlük](../guide/guides/dictionary.md) sekmesi bulunur. Bu, diğerleri gibi bir sekmedir: `'@dineug/erd-editor/builtin-dictionary'` olan `canvasType` değerini `Canvas Type` kilidi tutar, bu nedenle bu sekmedeyken kaydedilen bir metin [setInitialValue](#setinitialvalue) ile yine bu sekmede açılır, bu sekmeye geçiş ise yalnızca o kilit devre dışıyken `value` içine yazılır ve [change](#change) olayını tetikler. Onu açan ya da durumunu bildiren kendine ait hiçbir öznitelik, özellik, yöntem veya olay yoktur. Sekmedeki düzenlemeler belge değişiklikleridir: `value` içinde yer alır, [change](#change) olayını tetikler ve ortak çalışanlara ulaşır, ancak geri alınmaları ve yinelenmeleri belgenin geçmişinde değil, her sayfanın kendi geçmişinde yürür.  
Sekmede kaldığınız yer – hangi sayfanın gösterildiği (ilk başta `Domains`) ve her sayfanın araması, seçimi, kaydırma konumu ve sütun genişlikleri – sekme değişiklikleri ve her yükleme boyunca öğe var olduğu sürece korunur ve hiçbir zaman `value`, `runtimeValue`, bir geri alma geçmişi ya da paylaşılan bir depo içinde yer almaz.  
`ErdEditorElement` arayüzüne hiçbir üye eklenmez. API'ye eklenenler, [getSchemaSQL](#getschemasql) yönteminin seçeneklerindeki `logicalNameAsComment`, on iki [tema token'ı](#settheme) ve dışa aktarılan [dictionaryRowChords](#dictionaryrowchords) işlevidir.

## readonly {#readonly}

Düzenleyicinin düzenleme yeteneğini ayarlar.  
Bu öznitelik ayarlıyken `value` değerine atama, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, `4.2.0` sürümünden itibaren bir Sözlük sayfasınınki dahil geri alma ve yinelemenin tümü yok sayılır ve `change` olayı hiçbir zaman tetiklenmez. Belgeyi bunun yerine [setInitialValue](#setinitialvalue) ile yükleyin.  
Görüntüleme yine çalışır: Yakınlaştırma, kaydırma, el aracı, Zen modu, tuval sekmesi, tablolara odaklanma dahil iki modunda da [Görselleştirme](../guide/guides/visualization.md) sekmesi, veritabanı sistemi ve SQL ile Kod oluşturucu çıktı ayarlarının tümü geçerli olmaya devam eder, bu sayede salt okunur bir görüntüleyici yine de başka bir veritabanı sistemi için SQL dışa aktarabilir veya oluşturulan kodu okuyabilir.  
`4.1.0` sürümünden itibaren [Gezgin](../guide/guides/explorer.md#read-only-editors) de açılır ve satırlarından biri seçildiğinde, düzenlenebilir bir düzenleyicide olduğu gibi o satırın temsil ettiği öğeye gidilir. Gezginin en üstündeki [Bul ve değiştir](../guide/guides/find-and-replace.md#read-only-editors) yalnızca bulur, `Toggle Replace` oku ve Değiştir satırı bulunmaz. Bir eşleşmeye gitmek ise eşleşmeyi yine görünüme getirir ve seçer. Panelin başlığı `Explorer` olur ve araç çubuğu düğmesinin araç ipucunda her düzenleyicide `Explorer (Ctrl + F)` (Windows/Linux) veya `Explorer (⌘ + F)` (Mac) yazar. `3.10.0` sürümünden `4.0.0` sürümüne kadar Bul ve değiştir, `Find` başlıklı ve yalnızca bulma yapan kayan bir panel olarak açılıyordu.  
Tablo özellikleri yine açılır ve `3.10.0` sürümünden itibaren başlığının yanında bir `Read only` rozeti gösterir, `Indexes` sekmesi de hiçbir düzenleme sunmaz. [Tablo özellikleri](../guide/guides/table-related-functions.md#table-properties) bölümüne bakın.  
`4.0.0` sürümünden itibaren salt okunur bir düzenleyici [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` ([Tablo grupları](../guide/guides/table-groups.md#read-only-editors) bölümüne bakın) veya [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) öğelerini sunmaz ve [karşılama ekranını](#enablewelcomescreen) göstermez. Ayarlar sekmesindeki kilit düğmeleri hiçbir şeyi değiştirmez ve Şema SQL sekmesinin `Before tables` ve `After tables` betikleri düzenlenemez.  
`4.1.0` sürümünden itibaren [tuval araç çubuğunda](../guide/guides/table-related-functions.md#canvas-toolbar) `New Table`, `New Memo` veya `New Table Group` düğmesini de göstermez ve `addTableGroup` ile `groupSelectedTables` bağlamaları hiçbir şey yapmaz.  
`4.2.0` sürümünden itibaren [Ad görünümü](../guide/guides/logical-names.md#read-only-editors) seçicilerinin her birinden yine değiştirilebilir, ancak yalnızca o düzenleyicinin ekranında: Kilidi ne derse desin, bu değişiklik hiçbir zaman ortak çalışanlara ulaşmaz. Akış modunda `Previous table` ve `Next table`, düğmeleriyle ya da geri alma ve yineleme tuşlarıyla yine birer adım geri ve ileri gider.  
[Sözlük](../guide/guides/dictionary.md#read-only-editors) sekmesi yine açılır: Sayfaları değiştirilebilir, sayfalarda arama, seçim, kaydırma ve kopyalama yapılabilir ve `Checks` sayfasının bir satırı yine belirttiği öğeye gider. Hiçbir hücre düzenleme, yapıştırma veya temizleme kabul etmez, sekme hiçbir `Add Row`, `Delete Rows`, `Import CSV` veya `Export CSV` aracı ve ızgarada hiçbir menü göstermez, satır tuş kombinasyonları da hiçbir şey eklemez ya da silmez. Tablo menüsü, tuval menüsü ve Hızlı arama [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) veya `Derive Physical Name Again` öğelerini sunmaz.  
Şema SQL sekmesinin `This window only` seçimleri olan `Statements`, `Header`, `4.2.0` sürümünden itibaren `Write logical names into empty comments` ve `Tables` hiçbir zaman kaydedilmez ve yine uygulanır. [`Export image`](../guide/guides/file-import-export.md#image) iletişim kutusu, tema oluşturucu ve görüntüleme dili seçicisi de çalışmaya devam eder. Tema oluşturucuda veya görüntüleme dili seçicisinde yapılan bir seçim yine [changePresetTheme](#changepresettheme) veya [changeLocale](#changelocale) olayını tetikler.  
Değer verilmemiş bir öznitelik, `=""` ve `="true"` değerlerinin tümü `true` olarak okunur. `="false"` değeri `false` olarak okunur, HTML'deki yaygın `readonly="readonly"` kalıbı dahil başka her dize de aynı şekilde okunur.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Sistemin koyu/açık moduyla otomatik olarak eşitlenip eşitlenmeyeceğini belirler.  
`4.0.0` sürümünden itibaren bunu açmak, `setPresetTheme({ appearance: 'system' })` çağrısının yaptığı gibi temanın `appearance` değerini `'system'` olarak ayarlar. Düzenleyici bundan sonra işletim sisteminin bildirdiği açık veya koyu görünüşü ya da [setSystemAppearance](#setsystemappearance) yönteminin belirttiğini gösterir ve bu değiştiğinde geçiş yapar.  
Sonradan `'light'` veya `'dark'` ile yapılan bir [setPresetTheme](#setpresettheme) çağrısı ya da tema oluşturucuda veya Hızlı aramada yapılan bir `Light` veya `Dark` seçimi `'system'` değerinin yerini alır ve kalıcı olur: `systemDarkMode` hâlâ `true` olsa da işletim sistemindeki bir sonraki değişiklik artık onun üzerine yazmaz. `4.0.0` sürümünden önce işletim sistemindeki bir sonraki değişiklik onun üzerine yazıyordu.  
Görünüş `'system'` iken bunu kapatmak, o anda gösterilen açık veya koyu görünüşü korur. Görünüş `'system'` dışında bir değere değiştirildikten sonra bunu kapatmak, görünüşü olduğu gibi bırakır.  
Bunu değiştirmek hiçbir olay tetiklemez.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Hazır temaları kolayca ayarlamak için bir arayüz sağlanıp sağlanmayacağını belirler.  
Araç çubuğundaki `Theme` düğmesini gösterir. Bu düğme `Accent color`, `Gray color` ve `Appearance` seçeneklerini içeren tema oluşturucuyu açar. `4.0.0` sürümünden itibaren `Appearance`, `Light` ve `Dark` seçeneklerinin yanında `System` seçeneğini de sunar ve bu ayar açıkken Hızlı arama `Theme` komutunu `System`, `Light` ve `Dark` ile birlikte listeler. [Dil ve tema](../guide/guides/language-and-theme.md) sayfasına bakın.

![Araç çubuğundan tema oluşturucuyu açma, vurgu rengini ve gri tonunu seçme, görünüşü önce Light, ardından System olarak değiştirme](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Hazır temayı bu panelden veya Hızlı aramadan değiştirmek [changePresetTheme](#changepresettheme) olayını tetikler.

## enableLocalePicker {#enablelocalepicker}

`4.0.0` sürümünden itibaren, düzenleyicinin görüntüleme dilini seçmek için bir arayüz sağlanıp sağlanmayacağını belirler.  
Araç çubuğundaki `Display Language` düğmesini, ikisi birden gösterildiğinde `Theme` düğmesinden sonra gösterir. Düğme görüntüleme dili seçicisini açar ve Hızlı arama `Display Language` komutunu listeler. İkisi de `System` seçeneğini ve 25 dili sunar. [Dil ve tema](../guide/guides/language-and-theme.md) sayfasına bakın.  
Ayrıca [setLocale](#setlocale) çağrılmadan veya bir dil seçilmeden önce düzenleyicinin ne göstereceğine de karar verir: açıkken `'system'`, kapalıyken İngilizce, böylece hiçbir şey yapılandırmayan bir öğe her zaman gösterdiği İngilizceyi göstermeye devam eder. Bunu açmak veya kapatmak ikisi arasında hemen geçiş yapar. Bir dil ayarlandıktan veya seçildikten sonra, bu ayar açık da olsa kapalı da olsa o seçim korunur.  
İlk karenin `'system'` seçeneğini izlemesi için bunu öğe sayfaya eklenmeden önce ayarlayın.  
Bir seçim [changeLocale](#changelocale) olayını tetikler.

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

`4.0.0` sürümünden itibaren, boş bir diyagramın okuyucuyu [karşılama ekranıyla](../guide/guides/editing-start.md#welcome-screen) karşılayıp karşılamayacağını belirler.  
Belgede hiç tablo, gösterilen not ve gösterilen tablo grubu olmadığı sürece ERD sekmesinin üzerinde durur. `readonly` ayarlıyken, Zen modunda ya da Tablo özellikleri, Fark görüntüleyici, Zaman yolculuğu veya Otomatik düzenin önizlemesi açıkken gösterilmez. İlk tablo, gösterilen ilk not veya gösterilen ilk tablo grubu onu kaldırır, boş bir diyagrama geri götüren bir geri alma ise onu geri getirir.  
`New Table`, `New Memo` ve `Command Palette` satırları, `addTable`, `addMemo` ve `search` bağlamalarının [setKeyBindingMap](#setkeybindingmap) yönteminin bıraktığı hâliyle ilk tuş kombinasyonunu gösterir, boş bırakılan bir ad için ise hiçbir kısayol göstermez. Ekranın okları `Theme` ve `Display Language` düğmelerini yalnızca `enableThemeBuilder` ve `enableLocalePicker` bu düğmeleri gösterdiğinde işaret eder.  
Menüsünde `↑`, `↓`, `Home` ve `End` satırlar arasında geçiş yapar, engellenir ve durdurulur. `Enter` ve `Space` engellenmez ama durdurulur, böylece odaktaki satır onları alır. `Import` biçimleri arasında ise `Escape` geri döner, engellenir ve durdurulur. Diğer her tuş, her zamanki gibi düzenleyiciye ve sayfaya ulaşır.  
Belgede hiçbir şeyi değiştirmez, bu nedenle `value` değerini olduğu gibi bırakır ve `change` olayını tetiklemez.  
Resmî ana uygulamaların yaptığı gibi bunu [setInitialValue](#setinitialvalue) belgeyi yükledikten sonra açın, böylece ekran hâlâ yüklenmekte olan bir dosyanın üzerinde bir anlığına bile belirmez.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Geçerli belgeyi, düzenleyicinin tanımladığı [şemaya](./advanced/schema.md) uygun bir JSON dizesi olarak alır.  
`4.0.0` sürümünden itibaren bu, depolama biçimi, yani belgenin bir dosyada tutulduğu hâlidir. `json` dışa aktarmanın yazdığı ve resmî ana uygulamaların kaydettiği de budur. Yalnızca canlı varlıkları tutar, kaldırılan varlıkları, katman sırasını ve düzenleyicinin kendi hesapladığı ölçülen genişlikler, anahtar işaretleri ve ilişki bağlantı noktaları gibi şeyleri içermez. Varlıkları sabit bir anahtar sırasıyla yazılır, metin iki boşlukla girintilenir ve bir yeni satır karakteriyle biter, böylece aynı belge her zaman aynı baytları verir.  
`4.2.0` sürümünden itibaren boş olanları da dışarıda bırakır: boş bir `doc` listesi, boş bir koleksiyon, hiçbir şey tutmayan bir sözlük satırı ve bir varlığın ad, açıklama, veri türü, varsayılan değer veya renk gibi boş bir metin alanı. Bir varlığın içindeki, tablonun `columnIds` listesi gibi bir liste ise boşken de yazılır. Yeni bir belgenin `doc` değeri `{}` olur ve belgede hiç `collections` bulunmaz, bu nedenle eksik bir alanı, listeyi veya koleksiyonu boş olarak okuyun. Tabloların ve sütunların mantıksal adlarını ve türetilmiş ad bayraklarını, sütunların değer alanı bağlantılarını ve sözcükleri, terimleri ve değer alanlarını da tutar. Her sözlük, alan adlarından oluşan tek bir başlıkla ve onu izleyen satırlarıyla, her satır ayrı bir satırda ve sayfadaki sırayla yazılır. [Depolama biçimi ve çalışma zamanı değeri](./advanced/schema.md#storage-form-and-runtime-value) bölümüne bakın.  
[Kilitli](../guide/guides/settings.md#lock) olan her ayar, ekranda göründüğü gibi değil, kilitlendiği değerle yazılır. `Viewport` kilidi `originX`, `originY` ve `zoomLevel` değerlerini tutar, `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ve `4.2.0` sürümünden itibaren `Name View` kilitlerinin her biri de kendi ayarını tutar. Ad görünümü `nameViewMode` olarak ve yalnızca `'physical'` değilken yazılır. Diğer her ayar o anki hâliyle yazılır ve `lockSettings` her zaman yazılır. Bitler için [Settings](./advanced/schema.md#settings) bölümüne bakın; `Name View` kilidinin biti ters yönde okunur.  
Yeni bir belgede, ister öğenin kendisine bir değer verilmeden önce gösterdiği belge ister boş bir değerden yüklenen belge olsun, tüm kilitler etkindir. Bu belgenin `value` değeri, ilgili kilit devre dışı bırakılana kadar başlangıç noktasını `0, 0` ve yakınlaştırma düzeyini `1` olarak tutar, ERD sekmesini, varsayılan Kod oluşturucu dilini, ad biçimlerini ve tırnak türünü ve `4.2.0` sürümünden itibaren `Physical Names` görünümünü de korur.  
`4.0.0` sürümünden önce, `ignoreSaveSettings` uygulanmış olarak belgenin tamamını düzenleyicinin tuttuğu hâliyle döndürüyordu. Belgenin düzenleyicideki hâlini artık [runtimeValue](#runtimevalue) verir ve `ignoreSaveSettings` artık okunmaz ya da yazılmaz.

```js
const data = editor.value;
```

### setter {#setter}

Daha önce kaydedilmiş bir düzenleyici durumunu yükler. Belgenin tamamını değiştirir – geçerli belge önce temizlenir. `4.2.0` sürümünden itibaren buna sözcükler, terimler ve değer alanları da dahildir: Belge metnin tuttuklarını alır, metin hiç tutmuyorsa hiçbirini almaz ve her Sözlük sayfasının kendi geri alma geçmişi boşaltılır.  
`clear()`, `setInitialValue()` ve varsayılan `mode: 'replace'` modundaki `setSchema*` yöntemleri gibi, Görselleştirme sekmesinin Akış modu görünümünü de sıfırlar: düzenini, daraltıldığı tabloları, satır görünümünü, yakınlaştırmasını ve kaydırma konumunu ve `4.2.0` sürümünden itibaren `Previous table` ve `Next table` ile adım adım gezilen tabloları. Bir ekleme (`mode: 'append'`) onu sıfırlamaz.  
Geçmiş listesine kaydedilir, böylece `Undo, Redo` kullanılabilir ve `change` olayını tetikler.  
Depolama biçimini, bir [runtimeValue](#runtimevalue) değerini veya önceki bir sürümün kaydettiği bir dosyayı kabul eder.  
Boş bir dize ya da dize olmayan herhangi bir şey hata vermek yerine yeni bir belge yükler, bu nedenle değeri atamadan önce denetleyin.  
Bu yeni belge, `setInitialValue('')` çağrısının başlattığı belgedir: Boştur, varsayılan ayarlara sahiptir ve `4.0.0` sürümünden itibaren tüm kilitleri etkindir. `3.10.x` sürümünde ne kaydırma konumunu ne de yakınlaştırma düzeyini kaydediyordu, ondan önce ise ikisini de kaydediyordu.  
Paylaşılan bir depo bu yüklemeyi yeni belgenin JSON'unun tamamıyla ortak çalışanlara aktarır, böylece daha eski bir sürüm dahil her eş onu yükler, ancak `4.2.0` sürümünden önceki bir düzenleyici mantıksal adlar, değer alanı bağlantıları ve sözlükler gibi tanımadığı şeyleri atar. [Sürümleri karıştırma](./advanced/collaborative-editing.md#mixing-releases) bölümüne bakın.  
`4.0.0` sürümünden itibaren yüklenen belgenin kilitleri ve `value` değerinin ardından yazdığı kilitli değerler metinden gelir, görünüm de metnin belirttiği yere ya da diyagramın hiçbir kısmı orada çizilmiyorsa diyagramın üzerine yerleşir. Metnin kilitlediği diğer her ayar için – sekme, Kod oluşturucu dili, ad biçimleri, tırnak türü ve `4.2.0` sürümünden itibaren Ad görünümü – düzenleyici yüklemeden önce gösterdiğini göstermeye devam eder. Metnin kilitsiz bıraktığı bir ayar metindeki değeri alır. `4.2.0` sürümünden önce kaydedilmiş bir dosya, içinde o kilidi `4.2.0` sürümlü bir düzenleyici devre dışı bırakmadıkça hiçbir `Name View` kilidi belirtmez, bu nedenle Ad görünümü `Physical Names` değerinde kilitli olarak yüklenir ve düzenleyici gösterdiği Ad görünümünü korur. [setInitialValue](#setinitialvalue) ise metnin tuttuğu her değeri alır; hiçbir kilit belirtmeyen bir metin için de o bölüme bakın.  
Birleştirme çakışması işaretleri kalmış bir dosya gibi JSON olmayan bir metin de hata vermez: Belge boşaltılır, ayarları olduğu gibi kalır ve ayrıştırma hatası konsola yazılır.  
`readonly` ayarlıyken yok sayılır; salt okunur bir düzenleyiciye yüklemek için [setInitialValue](#setinitialvalue) kullanın.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

`4.0.0` sürümünden itibaren, belgeyi bu düzenleyicinin tuttuğu hâliyle bir JSON dizesi olarak alır. Setter'ı yoktur, bu nedenle ona atama yapmak katı moddaki (strict mode) kodda hata fırlatır.  
[value](#value) özelliğinin dışarıda bıraktıklarını taşır: kaldırılan varlıklar ve sıraları, katman sırası, ölçülen genişlikler, anahtar işaretleri, ilişki bağlantı noktaları ve diziler, `4.2.0` sürümünden itibaren de boş metin alanları, `doc` listeleri ve koleksiyonlar; bir Sözlük sayfasından kaldırılan satırlar ve hiçbir şey tutmayan satırlar; her sözlük satırının sıralama anahtarı; sözcüklerin, terimlerin ve değer alanlarının `doc` listeleri ve kaldırılmış bir değer alanına giden bağlantı. Kilitli ayarlar burada da kilitli değerleriyle yazılır.  
Zaten süren bir oturuma katılan başka bir düzenleyiciyi, örneğin bir ortak çalışanı veya aynı belgenin ikinci bir görünümünü, onun [setInitialValue](#setinitialvalue) yöntemiyle ilk içerikle başlatmak için kullanın. Oturumun sonradan gönderdiği bir kaldırmanın geri alınması varlığı orada eksiksiz geri getirir, `value` ile başlatılan bir düzenleyici ise hiçbir kaldırılmış varlık tutmadığından bunun yerine boş, adsız bir tablo ya da `4.2.0` sürümünden itibaren boş bir sözlük satırı geri getirir. [Ortak düzenleme](./advanced/collaborative-editing.md) sayfasına bakın.  
Kaldırılan varlıkları artık hiçbir şey toplamaz, bu nedenle belge dosyasından bir sonraki açılışına kadar bu değerde kalırlar.  
Bunu asla bir dosyaya yazmayın: `value` değerini kaydedin, çünkü [JSON Schema](./advanced/schema.md#json-schema) onu kabul eder, bunu ise etmez.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Daha önce kaydedilmiş bir düzenleyici durumunu yükler. Yüklemenin kendisi geçmiş listesine kaydedilmez, bu nedenle geri alınamaz ve `change` olayı tetiklenmez.  
Geri alma geçmişini de temizler, böylece yüklemeden önce yapılan hiçbir şey yüklenen belge üzerinde geri alınamaz veya yinelenemez. `4.2.0` sürümünden itibaren her Sözlük sayfasının kendi geçmişini de temizler.  
Depolama biçimini, bir [runtimeValue](#runtimevalue) değerini veya önceki bir sürümün kaydettiği bir dosyayı kabul eder ve `value` değerine atamadan farklı olarak, sekme ve kod ayarları dahil metnin tuttuğu her ayarı alır.  
Boş bir dize ya da dize olmayan herhangi bir şey hata vermek yerine yeni bir belge yükler, bu nedenle `setInitialValue('')` boş bir diyagram başlatır.  
`4.0.0` sürümünden itibaren, bir öğenin kendisine herhangi bir değer verilmeden önce gösterdiği belge de olan bu yeni belgede tüm kilitler etkindir. Kaydırma, yakınlaştırma, sekme değiştirme ve Kod oluşturucu dilini, ad biçimlerini, tırnak türünü ya da `4.2.0` sürümünden itibaren Ad görünümünü değiştirme `value` değerini olduğu gibi bırakır ve `change` olayını tetiklemez. `3.10.x` sürümünde ne kaydırma konumunu ne de yakınlaştırma düzeyini kaydediyordu, ondan önce ise ikisini de kaydediyordu.  
Metinden yüklenen bir belge, belirttiği kilitleri korur. Hiçbir kilit belirtmeyen bir belge – `ignoreSaveSettings` ne derse desin `4.0.0` sürümünden önce kaydedilmiş her dosya ve v2 `.vuerd` dosyası – tüm kilitleri etkin olarak açılır: `Viewport` başlangıç noktası `0, 0` ve yakınlaştırma düzeyi `1` değerlerinde kilitlidir, belge ERD sekmesinde açılır, dili, ad biçimleri ve tırnak türü de kaydedildiği gibidir.  
`4.2.0` sürümünden itibaren kilitlerini belirten ama `Name View` kilidini belirtmeyen bir metin, diğer tüm kilitler devre dışı olsa bile o kilit de etkin olacak şekilde açılır. `4.2.0` sürümünden önce kaydedilmiş bir dosya, içinde o kilidi `4.2.0` sürümlü bir düzenleyici devre dışı bırakmadıkça böyle bir metindir ([Settings](./advanced/schema.md#settings) bölümüne bakın). Hiç kilit belirtmeyen bir metin gibi `Physical Names` görünümünde açılır.  
Her iki durumda da görünüm belgenin görünümünde açılır – metin kilitlerini belirtiyorsa metnin kaydettiği görünümde, hiçbirini belirtmiyorsa `1` yakınlaştırma düzeyinde `0, 0` başlangıç noktasında – ya da diyagramın hiçbir kısmı orada çizilmiyorsa diyagramın üzerinde açılır. Kilitli bir `Viewport` kilitli değerlerini `value` içinde yine korur.  
`4.0.0` sürümünden itibaren önceden tutulan belgenin ortak çalışma durumunu da siler ve bu düzenleyicinin zaten abone olmuş bir [paylaşılan deposu](#getsharedstore) diğer düzenleyicilerden onların durumunu yeniden ister, böylece süren bir oturumda yeniden yüklenen bir düzenleyici güncel duruma yetişir. Böyle bir düzenleyiciyi başka bir düzenleyicinin [runtimeValue](#runtimevalue) değeriyle başlatın.  
JSON olmayan bir metin de hata vermez: Belge boşaltılır, ayarları olduğu gibi kalır ve ayrıştırma hatası konsola yazılır.  
`value` değerine atamadan farklı olarak `readonly` onu engellemez, bu nedenle salt okunur bir görüntüleyiciye belge yüklemenin yolu budur.

```js
editor.setInitialValue('json...');
```

Başlangıçta yükleyin, değişiklikte kaydedin.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Olaylar {#event}

Herkese açık yalnızca üç olay vardır: `change`, `changePresetTheme` ve `changeLocale`. `changeLocale`, `4.0.0` sürümünde eklendi.  
Öğe kendi iç bağlantıları için kendi üzerinde dahili `@dineug/erd-editor/internal-*` olaylarını da gönderir; bunlar API'nin parçası değildir.

### change {#change}

Düzenleyicide değişiklik olduğunda bir olay tetikler.  
Olay 200 ms geciktirilir ve `readonly` değeri `true` iken tetiklenmez.  
Her belge değişikliğinde tetiklenir – arayüzdeki bir düzenleme, `value` değerine atama, `clear()`, `setSchema*` yöntemlerinin her biri ve `4.0.0` sürümünden itibaren `setSchemaJSON()` ile `Import and Add`. `setInitialValue` onu tetiklemez.  
`4.2.0` sürümünden itibaren buna [Sözlük](../guide/guides/dictionary.md) sekmesindeki her düzenleme ve bunların her geri alınması veya yinelenmesi, bir mantıksal adın veya değer alanı bağlantısının değişmesi, `Derive Physical Names Again` ve `Name View` kilidi devre dışıyken Ad görünümünün değiştirilmesi de dahildir.  
Görselleştirme sekmesinin Akış modunda yapılan hiçbir şey – yakınlaştırma, kaydırma, kartları taşıma, `Tidy Up`, satır görünümü, görünümü bir karttan daraltma ya da `4.2.0` sürümünden itibaren `Previous table` ve `Next table` veya geri alma ve yineleme tuşlarıyla adım adım gezinme – onu tetiklemez, çünkü bunların hiçbiri bir belge değişikliği değildir. Akış modunun `Name View` listesi bunun istisnasıdır: Orada yapılan bir görünüm değişikliği, ERD sekmesindeki gibi, `Name View` kilidi devre dışıyken onu tetikler.  
`4.0.0` sürümünden itibaren [kilitli](../guide/guides/settings.md#lock) bir ayardaki değişiklik de onu tetiklemez, çünkü bu değişiklik yalnızca ekranı değiştirir, `value` değerini asla değiştirmez: `Viewport` kilitliyken ERD tuvalinin kaydırılması veya yakınlaştırılması, `Canvas Type` kilitliyken sekme değiştirme, kendi kilidi etkinken Kod oluşturucu dilinin, tablo adı biçiminin, sütun adı biçiminin veya tırnak türünün değiştirilmesi ve `4.2.0` sürümünden itibaren `Name View` kilitliyken Ad görünümünün değiştirilmesi. Yalnızca bu değişiklikler dışarıda kalır, bu nedenle belgeyi de düzenleyen bir paket onu yine tetikler. Bir ayarı kilitlemek veya kilidini açmak onu tetikler.  
Yeni bir belgede ve `4.0.0` sürümünden önce kaydedilmiş her dosyada tüm kilitler etkindir, `4.2.0` sürümünden önce kaydedilmiş her dosyada da `4.2.0` sürümlü bir düzenleyici orada devre dışı bırakmadıkça `Name View` kilidi etkindir, bu nedenle varsayılan olarak kaydırma, yakınlaştırma, sekme değiştirme ve Ad görünümünü değiştirme hiçbir olay tetiklemez. Buna ERD sekmesinden tablolara odaklanma, Akış modundan ERD sekmesine geri götüren dış bağlantı kart düğmesi, bir Gezgin satırına veya bir arama eşleşmesine gitme, başka bir sekmeden Gezgini açma veya bir Hızlı arama sonucuna gitme ve `4.2.0` sürümünden itibaren Sözlük sekmesindeki `Checks` sayfasının bir satırından bir tabloya veya sütuna gitme de dahildir. Bunların her biri, yalnızca onu kapsayan kilit devre dışıyken tek bir `change` tetikler: sekme değişikliği için `Canvas Type`, bir kart düğmesinin, bir Hızlı arama sonucunun, bir Gezgin satırının, bir arama eşleşmesinin veya bir `Checks` satırının da yaptığı kaydırma için `Viewport`. `4.1.0` sürümünden itibaren bu kaydırmaların her biri tek bir kurala, [Atlamanın varış noktası](../guide/guides/table-related-functions.md#where-a-jump-lands) kuralına uyar, böylece bir Hızlı arama tablo sonucu artık her seferinde kaydırma yapmaz ve kuralın görünümü yerinde bıraktığı bir atlama, olay tetikleyecek bir kaydırma yapmaz. Gezgini açmak, kapatmak veya yeniden boyutlandırmak, tuvalin başlangıç noktasını oynatmadan tuvali daraltır veya genişletir ve o da hiçbir olay tetiklemez. `4.0.0` sürümünden önce kaydırma, yakınlaştırma ve sekme değiştirme, `editor.value` aynı çıksa bile onu her zaman tetikliyordu.  
Hiçbir şeyi değiştirmeyen yazma işlemlerini atlamak için `editor.value` değerini yüklediğiniz dosyayla değil, en son sakladığınız değerle karşılaştırın: Önceki bir sürümün yazdığı bir dosya, bir v2 dosyası veya elle düzenlenmiş bir dosya yüklenir yüklenmez `value` içinde farklı çıkabilir, çünkü `value` onu depolama biçiminde yazar. `Viewport` kilidi devre dışı olan ve başlangıç noktasında bu ekranda diyagramın hiçbir kısmı çizilmeyen bir dosya da öyle: Yükleme görünümü diyagramın üzerine taşır ve `value` görünümün vardığı yeri yazar. `4.0.0` sürümünden itibaren ölçülen genişlikler artık buna neden olmaz, çünkü `value` hiçbirini tutmaz. `4.2.0` sürümünden itibaren `4.0.0` veya `4.1.0` sürümünün kaydettiği bir dosya da farklı çıkabilir, çünkü `value` artık onun boş metin alanlarını, listelerini ve koleksiyonlarını dışarıda bırakır, bu nedenle böyle bir dosya bir sonraki kaydedilişinde bir kez yeniden yazılır. Dosya yazan bir ana uygulama bunun yerine bir replikasyon deposunun `changed` değeriyle bir düzenlemeyi görünüm değişikliğinden ayırt edebilir. [on@change](./advanced/remote-storage.md#onchange) bölümüne bakın.  
Olay hiçbir `detail` taşımaz, kabarcıklanmaz ve gölge DOM sınırını geçmez, bu nedenle doğrudan öğenin kendisini dinleyin ve işleyicide `editor.value` değerini okuyun.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Hazır tema yerleşik tema oluşturucudan veya `4.0.0` sürümünden itibaren Hızlı aramadaki `Theme` komutundan değiştirildiğinde tetiklenir. Zaten geçerli olan seçeneğin seçilmesi dahil her seçim onu tetikler.  
[setPresetTheme](#setpresettheme) veya [setSystemAppearance](#setsystemappearance) yöntemini kendiniz çağırmak ya da [systemDarkMode](#systemdarkmode) ayarını açıp kapatmak onu tetiklemez.  
`event.detail`, istenen kısmi değer değil, seçimden sonraki eksiksiz `ThemeOptions` nesnesidir – `{ appearance, grayColor, accentColor }`. `4.0.0` sürümünden itibaren `System` seçiliyken `appearance` değeri gösterilen açık veya koyu görünüş değil, `'system'` olur, bu nedenle onu olduğu gibi saklayın ve `setPresetTheme` yöntemine geri verin.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

`4.0.0` sürümünden itibaren, düzenleyicide görüntüleme dili seçicisinden veya Hızlı aramadaki `Display Language` komutundan – ikisini de [enableLocalePicker](#enablelocalepicker) açar – bir dil seçildiğinde tetiklenir.  
Dil uygulandıktan sonra, zaten geçerli olan seçeneğin seçilmesi dahil her seçimde tetiklenir. [setLocale](#setlocale) ve [setSystemLocale](#setsystemlocale) onu asla tetiklemez, tarayıcının dillerindeki bir değişiklik de tetiklemez. Dil değişikliği `change` olayını tetiklemez.  
`event.detail`, bir `LocaleOption` olan `{ locale }` nesnesidir: `System` seçildiyse `'system'`, aksi hâlde dilin kodu. Öğe seçimi hatırlamaz, bu nedenle onu saklayın ve bir sonraki yüklemede `setLocale` yöntemine verin.  
`change` gibi bu olay da kabarcıklanmaz, bu nedenle doğrudan öğenin kendisini dinleyin.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Düzenleyiciye odaklanır.

```js
editor.focus();
```

## blur {#blur}

Odağı düzenleyiciden kaldırır.

```js
editor.blur();
```

## clear {#clear}

Her tabloyu, sütunu, ilişkiyi, dizini ve notu, `4.0.0` sürümünden itibaren her tablo grubunu ve `4.2.0` sürümünden itibaren Sözlük sekmesinin sözcüklerini, terimlerini ve değer alanlarını kaldırarak belgeyi boşaltır, her sayfanın kendi geri alma geçmişini de boşaltır.  
Veritabanı, görünüm konumu, yakınlaştırma düzeyi, tablo görünüm seçenekleri, tuttuğu değerle birlikte her kilit ve Şema SQL sekmesinin `Before tables` ve `After tables` betikleri dahil her ayar korunur, böylece temizlenen bir dosya kaydettiklerini kaydetmeye devam eder. Bunun yerine yeni bir belge başlatmak için `value` değerine `''` atayın veya `setInitialValue('')` çağırın.  
Geçmiş listesine kaydedilir, bu nedenle geri alınabilir ve `change` olayını tetikler. Bir geri alma, belgeyi sözcükleri, terimleri ve değer alanları dahil, her kilitli ayar kilitli değerinde olacak şekilde düzenleyicinin tuttuğu hâliyle geri getirir. `readonly` ayarlıyken yok sayılır.

```js
editor.clear();
```

## destroy {#destroy}

Düzenleyici örneğini bir daha kullanılamayacak şekilde tamamen yok eder.  
Düzenleyicinin dinleyicilerini ve aboneliklerini serbest bırakır ve [getSharedStore](#getsharedstore) yönteminin döndürdüğü her paylaşılan depoyu yok eder.  
Paylaşılan bir deponun hâlâ beklettiği bir akış paketi de onunla birlikte kaybolur; göndermek için önce o deponun [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) yöntemini çağırın.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Klavye kısayollarını yeniden tanımlar.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` ve `zoomReset` sabittir ve yeniden tanımlanamaz.  
Yalnızca aşağıdaki yirmi bir ad yazılır; sabit adlar dahil nesnedeki diğer her şey yok sayılır.  
`3.10.0` sürümünden itibaren `search` yeniden tanımlanabilir ve `findReplace` bu sürümde eklendi. Daha önce `search` sabitti. `removeSelection`, `4.0.0` sürümünde eklendi. `addTableGroup` ve `groupSelectedTables`, `4.1.0` sürümünde eklendi.  
Bir bağlama değeri `ShortcutOption[]` olmalıdır. Yalın bir dize yok sayılır, bu nedenle `{ addTable: 'Alt+KeyN' }` yerine `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` yazın.  
Boş bir dizi kabul edilir ve hiçbir şey bağlamaz: `setKeyBindingMap({ findReplace: [] })`, `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuşlarını sayfaya bırakır, `{ search: [] }` de `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac) için aynısını yapar. Araç çubuğundaki `Search` düğmesi Hızlı aramayı yine açar, araç çubuğundaki `Explorer` düğmesi Gezgini yine açıp kapatır, Hızlı aramadaki ve tuvalin bağlam menüsündeki `Toggle Explorer` da Gezginin aramasını yine açar ya da Gezgini kapatır. Bunların hiçbiri boş bırakılan bir ad için kısayol göstermez. `{ removeSelection: [] }`, `Delete` ve `Backspace` tuşlarını sayfaya bırakır ve tablo, not ve tablo grubu menülerindeki silme satırları (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) bu durumda kısayol göstermez.  
`4.1.0` sürümünden itibaren `{ addTableGroup: [] }`, `Alt + G` (Windows/Linux) veya `⌥ + G` (Mac) tuşlarını, `{ groupSelectedTables: [] }` ise `T`, ardından `G` tuşlarını sayfaya bırakır. Tuval araç çubuğundaki, tuvalin bağlam menüsündeki ve Hızlı aramadaki `New Table Group`, tablo menüsündeki `Group selected tables` ve Hızlı aramadaki `Group Selected Tables` kısayol gösterilmeden çalışmaya devam eder. Tuval araç çubuğundaki `New Table`, `New Memo` ve `New Table Group` düğmelerinin araç ipuçları `addTable`, `addMemo` ve `addTableGroup` bağlamalarının ilk tuş kombinasyonunu, boş bırakılan bir bağlama için ise yalnızca düğmenin adını gösterir.  
`4.2.0` sürümünden itibaren `addColumn` ve `removeColumn`, aşağıda anlatıldığı gibi Sözlük sekmesinin ızgarasına satır tuş kombinasyonlarını da verir, bu nedenle ikisinden birini yeniden bağlamak bu tuş kombinasyonlarını da onunla birlikte taşır. `{ addColumn: [] }` ızgaraya satır eklemek için hiçbir tuş kombinasyonu bırakmaz ve ızgara menüsünün iki ekleme satırı bu durumda kısayol göstermez; `{ removeColumn: [] }` satırları silmek için hiçbir tuş kombinasyonu bırakmaz ve menünün silme satırı ile `Delete Rows` araç ipucu bu durumda kısayol göstermez.  
Çağrı kısmi bir birleştirmedir: Dışarıda bıraktığınız adlar varsayılanlarını korur ve iki kez çağırmak önceki değişiklikleri korur. Geçerli bağlamalar için bir getter yoktur: [createKeyBindingMap](#createkeybindingmap), `setKeyBindingMap` yönteminin değiştirdiklerini değil, varsayılanları döndürür.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` ve `4.1.0` sürümünden itibaren `groupSelectedTables` metin imlecine yol verir: Odak bir giriş alanı, textarea veya `contenteditable` öğesi içindeyken tuvale ulaşmak yerine `$mod + A` metni seçer, `Space` bir boşluk yazar, `Delete` ve `Backspace` metni siler, `T`, ardından `G` ise iki harfi yazar. Bu basışların hiçbiri engellenmez. Bunları hangi tuşlara yeniden bağlarsanız bağlayın, aynı şekilde davranır.

`4.0.0` sürümünden itibaren `removeSelection` (`Delete` veya `Backspace`) ERD sekmesinde seçili öğeleri sormadan, tek bir geri alma adımı olarak kaldırır. Odaktaki tablo seçili tek öğeyse, sütunlarından biri veya birkaçı seçiliyse ve yakınlaştırma düzeyi satırlarını çiziyorsa o sütunları kaldırır; aksi hâlde seçili her tabloyu, notu ve tablo grubunu kaldırır, bir grubun tabloları ise korunur. [Tablo ve not silme](../guide/guides/table-related-functions.md#table-and-memo-deletion) bölümüne bakın.  
Basılı tutulan bir tuş yalnızca bir kez kaldırır ve bir hücre düzenleyicisi, not düzenleyicisi veya tablo grubu ad alanı açıkken hiçbir şey kaldırılmaz. Bir metin alanı ve bağlamaları geçirmeyen paneller ve sekmeler ([createKeyBindingMap](#createkeybindingmap) bölümüne bakın) dışında, düzenleyici odaktayken basış her sekmede, odaktaki bir araç çubuğu düğmesinde de ve hiçbir şey kaldırmadığı salt okunur bir düzenleyicide de engellenir.

`4.1.0` sürümünden itibaren `addTableGroup` (`Alt+KeyG`), tuval araç çubuğundaki `New Table Group` düğmesinin yaptığı gibi ERD sekmesinde `New Table Group` çizimini hazırlar. Tuval üzerinde farenin ana düğmesine bir sonraki basış grubu çizer, tuşa yeniden basmak ise çizim hazırlığını iptal eder. `groupSelectedTables` (`KeyT KeyG`, `T`, ardından `G`), bir tablonun bağlam menüsündeki `Group selected tables` öğesinin yaptığı gibi seçili tabloları yeni bir gruba koyar ve grubun ad alanını açar. Hiçbir tablo seçili değilse hiçbir şey eklemez; seçili bir not veya tablo grubu sayılmaz. [Grup çizme](../guide/guides/table-groups.md#drawing-a-group) ve [Seçili tabloları gruplama](../guide/guides/table-groups.md#grouping-selected-tables) bölümlerine bakın.  
İkisi de yalnızca menülerin grup sunduğu yerde çalışır: `readonly` ayarlıyken, `Table Groups` görünüm seçeneği grupları gizlerken veya bir hücre düzenleyicisi, not düzenleyicisi ya da tablo grubu ad alanı açıkken çalışmaz. Diğer tuval bağlamaları gibi yalnızca ERD sekmesinde çalışır ve Hızlı arama, Tablo özellikleri, Fark görüntüleyici, Zaman yolculuğu, Otomatik düzenin önizlemesi, `Export image` veya `Map Columns` açıkken çalışmaz. Hiçbir şey yapmadıkları yerde, `groupSelectedTables` metin imlecine yol vermedikçe basış yine engellenir. `focusView` ve `zenMode` gibi `addTableGroup` da durdurulur, bu nedenle sayfanın kabarcıklanma aşamasındaki `keydown` dinleyicisi onu asla duymaz.

`4.2.0` sürümünden itibaren [Sözlük](../guide/guides/dictionary.md#adding-and-deleting-rows) sekmesinde `addColumn` bağlamasının tek basışlık her tuş kombinasyonu, seçimin kapsadığı kadar satırı seçimin altına ekler, aynı tuş kombinasyonu `Shift` de basılı tutularak kullanıldığında bu satırları seçimin üstüne ekler ve `removeColumn` bağlamasının tek basışlık her tuş kombinasyonu seçimin kapsadığı satırları siler: Varsayılanlarla bunlar `Alt+Enter`, `Alt+Shift+Enter` ve `Alt+Backspace` veya `Alt+Delete` olur. Bunlar, hiçbir hücre düzenlemesi açık değilken `Domains`, `Words` ve `Terms` sayfalarının ızgarasında çalışır. `addColumn` bağlamasının zaten `Shift` içeren bir tuş kombinasyonu üste ekleme için bir tuş kombinasyonu vermez, iki addan birine bağlanan bir tuş dizisi ise ızgaraya hiçbir şey vermez.  
Bu tür her basış, seçeneğinin belirttiği gibi engellenir ve her zaman durdurulur, bu nedenle ERD sekmesinde hiçbir sütun eklemez veya kaldırmaz. `Checks` sayfasında ve salt okunur bir düzenleyicide hiçbir şey yapmaz, ancak yine engellenir ve durdurulur. Açık bir hücre düzenlemesinde veya sekmenin arama alanında tuş kombinasyonları metne bırakılır: Orada durdurulur ama engellenmez, böylece alan onlara başka her yerde olduğu gibi tepki verir (Mac'te `⌥ + Backspace` bir sözcük siler). [dictionaryRowChords](#dictionaryrowchords) bunları listeler.

`3.10.0` sürümünden itibaren `findReplace` (`$mod+KeyF`) [Bul ve değiştir](../guide/guides/find-and-replace.md) panelini açar. `4.1.0` sürümünden itibaren onu barındıran [Gezgini](../guide/guides/explorer.md#opening-and-closing) açıp kapatır ve Kısayollar sekmesi onu `Toggle Explorer` olarak listeler.  
Araç çubuğundaki `Explorer` düğmesi basılı göründüğü sürece (Gezgin ERD sekmesinde açıkken ve Zen modunda gizli değilken), Hızlı arama, Tablo özellikleri, tema oluşturucu, görüntüleme dili seçicisi, `Export image` iletişim kutusu veya `Map Columns` açık değilse Gezgini kapatır. Aksi hâlde bunlardan hangisi açıksa onu kapatır, başka herhangi bir sekmeden ERD sekmesine geçer ve Gezgini, metin imleci `Find` alanında ve arama metni seçili olarak açar. Gezgini tuvalin yanında gösteremeyecek kadar dar bir düzenleyici onu açık tutar ama kenara çeker ve `Widen the window to show the Explorer` bildirimini gösterir. `4.1.0` sürümünden önce kayan Bul ve değiştir panelini açıyor ya da klavyeyi yeniden onun alanına veriyordu ve paneli hiçbir zaman kapatmıyordu.  
Metin imlecine yol vermez: Düzenleyici odaktayken her sekmede, tuvalden veya düzenleyicinin içindeki bir giriş alanından alınır. Basış engellenir, böylece tarayıcı bulma çubuğunu açmaz; ayrıca durdurulur, böylece sayfadaki kabarcıklanma aşamasındaki hiçbir `keydown` dinleyicisi onu duymaz. Bir hücre veya not düzenleyicisi, `4.0.0` sürümünden itibaren bir tablo grubu ad alanı ya da `4.2.0` sürümünden itibaren Sözlük sekmesinin ızgarasında bir hücre düzenlemesi açıkken yine engellenir ve durdurulur, ancak hiçbir şey yapmaz. Bu son durumda `search` de hiçbir şey yapmaz, böylece o ana kadar yazılan metin korunur.  
Hangi sekmede olursa olsun Fark görüntüleyici, Zaman yolculuğu veya Otomatik düzenin önizlemesi açıkken ya da bir IME'de birleştirme hâlâ sürerken ne engellenir ne de durdurulur, böylece onu tarayıcının veya ana uygulamanın kendi bulma özelliği alır. Gezginin içinde, birleştirme sürerken yapılan bir basış orada durdurulur ama engellenmez. `findReplace` bağlamasını hangi tuşa yeniden bağlarsanız bağlayın, aynı şekilde davranır.

`focusView` yalnızca ERD sekmesinde çalışır. En az bir tablo seçiliyken Görselleştirme sekmesini Akış modunda, o tablolara ve onlardan bir ilişki uzaklıktaki her tabloya daraltılmış olarak açar. Seçili bir not veya tablo grubu sayılmaz ve hiçbir tablo seçili değilse hiçbir şey yapmaz. [Tablolara odaklanma](../guide/guides/visualization.md#focusing-on-tables) bölümüne bakın.

`undo` ve `redo` sekmeye göre çalışır. ERD sekmesinde belgenin geçmişini geri alır ve yineler. `4.2.0` sürümünden itibaren Sözlük sekmesinde gösterilen sayfanın kendi geçmişini geri alır ve yineler, `Checks` sayfasında ise hiçbir şey yapmaz. [Sözlük sayfaları](../guide/guides/undo-redo.md#dictionary-sheets) bölümüne bakın. Görselleştirme sekmesinin Akış modunda, belgenin geçmişine dokunmadan [`Previous table` ve `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) düğmelerinin yaptığı gibi bir adım geri ve ileri gider. Diğer sekmelerde ve Graf modunda hiçbir şeyi geri almaz.

ERD sekmesinde `stop` (`Escape`), açık bir hücre veya not düzenleyicisini ya da çizilmekte olan bir ilişkiyi sonlandırır ve seçimi olduğu gibi bırakır. `4.0.0` sürümünden itibaren bir tablo grubu ad alanını hiçbir ad yazmadan ve bir `New Table Group` çizimini de sonlandırır. Düzenleyici bu basışta `preventDefault()` çağırır.  
Bunların hiçbiri açık değilken `Escape` seçimi ve odaktaki hücreyi temizler ve engellenmez. Bu nedenle bir düzenlemeden çıkıp seçimi temizlemek iki basış gerektirir.  
`4.2.0` sürümünden itibaren bir mantıksal ad hücresinin terim listesi görünürken ([Terim adlarını tamamlama](../guide/guides/logical-names.md#completing-term-names) bölümüne bakın) ilk `Escape` yalnızca listeyi kapatır ve düzenleyiciyi açık bırakır. Bu basış hücrede engellenir ve durdurulur, bu nedenle onu ne `stop` ne de sayfanın kabarcıklanma aşamasındaki `keydown` dinleyicisi duyar.  
Gezgin, [karşılama ekranının](#enablewelcomescreen) `Import` biçimleri, bir mantıksal ad hücresinin terim listesi, [Sözlük](../guide/guides/dictionary.md#keys-on-the-tab) sekmesi ve aşağıdaki seçiciler ile iletişim kutuları hariç, düzenleyici `Escape` tuşunun yayılmasını asla durdurmaz, bu nedenle örneğin kendi iletişim kutusunu kapatmak için bu tuşu kendisi dinleyen bir sayfa iki basışı da duyar ve `defaultPrevented` değeri `true` olanı atlayabilir.  
Hızlı arama, Tablo özellikleri, Fark görüntüleyici, Otomatik düzenin önizlemesi veya Zaman yolculuğu açıkken `Escape` bunun yerine onu kapatır ve seçimi olduğu gibi bırakır. Bu basış da engellenmez.  
`4.0.0` sürümünden itibaren açık bir [`Export image`](../guide/guides/file-import-export.md#image) veya [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) iletişim kutusu da `Escape` tuşunu alır, kendini kapatır ve seçimi olduğu gibi bırakır. Her biri açıldığında klavyeyi alır ve bu `Escape` hem engellenir hem durdurulur.  
`4.1.0` sürümünden itibaren odak [Gezginin](../guide/guides/explorer.md#keys-in-the-explorer) içinde, ağacında, alanlarında veya düğmelerindeyken basılan `Escape`, klavyeyi tuvale geri verir, Gezgini açık, seçimi de olduğu gibi bırakır. Düzenleyici onun üzerinde hem `preventDefault()` hem `stopPropagation()` çağırır, bu nedenle sayfanın kabarcıklanma aşamasındaki `keydown` dinleyicisine asla ulaşmaz.  
Tuvalde basılan `Escape` Gezgini asla kapatmaz. `4.1.0` sürümünden önce Bul ve değiştir panelinin içindeki bir `Escape` paneli kapatıyordu, tuvaldeki bir `Escape` ise seçimi temizleyen aynı basışta onu kapatıyordu.  
`4.0.0` sürümünden itibaren görüntüleme dili seçicisi ve renk seçici `Escape` ile kapanır: İçlerinde basıldığında engellenir ve durdurulur, tuvalde ise seçimi temizleyen aynı basışta onları kapatır ve ne engellenir ne de durdurulur.  
Bir IME'de birleştirme hâlâ sürerken basılan `Escape` birleştirmeye aittir. Açık bir düzenleyiciyi olduğu gibi bırakır ve engellenmez, bu nedenle bir sayfa da `isComposing` değeri `true` ya da `keyCode` değeri `229` olan bir basışı atlayabilir. Gezginin içinde böyle bir basış, orada birleştirme sürerken basılan her tuş gibi ayrıca durdurulur ve klavye alanda kalır.  
`3.9.2` sürümünden önce tek bir `Escape` hem bir düzenlemeyi veya çizimi sonlandırıyor hem de seçimi temizliyordu ve düzenleyici onu hiçbir zaman engellemiyordu.

### createKeyBindingMap {#createkeybindingmap}

`3.9.2` sürümünden itibaren paket `createKeyBindingMap()` işlevini ve onunla birlikte `KeyBindingMap`, `KeyBindingName` ve `ShortcutOption` türlerini dışa aktarır.  
Varsayılan tuş bağlamalarını, sabit olanlar dahil 28 adın tamamını, her çağrıda yeni bir nesne olarak döndürür, bu nedenle döndürdüğü nesneyi değiştirmek başka hiçbir şeyi değiştirmez.  
Her düzenleyici bununla başlar ve bir `setKeyBindingMap` çağrısının etkisi bunda görünmez.  
Bu dördü arasında çalışma zamanında dışa aktarılan yalnızca `createKeyBindingMap` işlevidir; diğer üçü türdür. `4.2.0` sürümünden itibaren onun yanında [dictionaryRowChords](#dictionaryrowchords) da dışa aktarılır.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Her `shortcut`, tuşunu `KeyboardEvent.code` ile adlandıran, [tinykeys](https://github.com/jamiebuilds/tinykeys) söz dizimindeki bir tuş kombinasyonudur. Burada [`$mod`](#mod), macOS'ta `⌘`, diğer sistemlerde `Control` olur.  
`4.0.0` sürümünden itibaren düzenleyici bu tuş kombinasyonlarını tinykeys aracılığıyla değil, aynı söz dizimiyle kendisi okur. Bir tuş `code` değeriyle veya büyük/küçük harf ayrımı yapılmadan `key` değeriyle eşleşir ve bir basış yalnızca tam olarak belirttiği değiştirici tuşlar basılı tutulurken eşleşir. `AltGraph`, Windows'ta `Control` ve `Alt`, macOS'ta ise `Alt` sayılır. Boşlukla ayrılan basışlar bir tuş dizisi oluşturur ve bu dizi bir saniye boyunca hiçbir tuşa basılmazsa baştan başlar.  
`4.1.0` sürümünden itibaren varsayılanlardan biri bir tuş dizisidir: `groupSelectedTables` bağlaması `KeyT KeyG`, yani `T`, ardından `G` olur. Bir tuş dizisi onu tamamlayan basışta çalışır ve dizinin `preventDefault` ile `stopPropagation` ayarlarını yalnızca o basış alır, bu nedenle varsayılanlarla `T` sayfaya ulaşır ve yalnızca `G` engellenir. Menüler, Hızlı arama ve Kısayollar sekmesi bir tuş dizisini her basış için bir tuş olarak gösterir.  
Sabit adlar `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) ve `$mod+Digit0` (`zoomReset`) tuşlarına bağlıdır. `edit` ve `stop` hiçbir bayrak taşımaz; diğer beşi `preventDefault` ve `stopPropagation` taşır. Geri kalanlar, `search` ve `findReplace` dahil, yukarıdaki varsayılanlardır.

Düzenleyici bunları kendi öğesi üzerinde dinler, bu nedenle genel kısayol tuşları veya yakalama aşamasındaki bir `keydown` dinleyicisiyle tuşları düzenleyiciden önce alan bir ana uygulama, düzenleyici odaktayken bu tuşları geçirmelidir.  
Geçirilecek tuşların listesini, varsayılanların yerine `setKeyBindingMap` yöntemine verdiğiniz bağlamaları koyarak `createKeyBindingMap()` sonucundan oluşturun.  
`3.10.0` sürümünden itibaren bu liste, tarayıcının kendi bulma tuş kombinasyonu olan `$mod+KeyF` kombinasyonunu içerir. Bu tuş kombinasyonunda kendi bulma özelliğini korumak isteyen bir ana uygulama `setKeyBindingMap({ findReplace: [] })` çağırır.  
`4.0.0` sürümünden itibaren tek başına `Delete` ve `Backspace` tuşlarını da içerir. Bu tuşları korumak isteyen bir ana uygulama `setKeyBindingMap({ removeSelection: [] })` çağırır.  
`4.1.0` sürümünden itibaren `Alt+KeyG` kombinasyonunu ve tek bir dize olarak gelen `KeyT KeyG` tuş dizisini de içerir: Bu dizeyi boşluktan bölün ve tek başına `T` ve `G` dahil her basışı geçirin, çünkü bir basışı eksik olan tuş dizisi asla tamamlanmaz. Bu tuşları korumak isteyen bir ana uygulama `setKeyBindingMap({ addTableGroup: [] })` veya `setKeyBindingMap({ groupSelectedTables: [] })` çağırır.  
`4.2.0` sürümünden itibaren listeye, [dictionaryRowChords](#dictionaryrowchords) işlevinin aynı nesne için döndürdüğü, aralarında `Alt+Shift+Enter` da bulunan tuş kombinasyonlarını ekleyin. Bu tuşları korumak isteyen bir ana uygulama `setKeyBindingMap({ addColumn: [] })` veya `setKeyBindingMap({ removeColumn: [] })` çağırır; bu, onları ERD sekmesindeki sütun ekleme ve kaldırma işlemlerinden de alır.

Odak Gezginin içinde, ağacında, `Find` ve `Replace` alanlarında veya düğmelerindeyken `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` ve `zoomReset` düzenleyiciye geçer, böylece `findReplace` orada da tuvaldeki gibi çalışır. Geçerli ayarıyla diğer her bağlama Gezginde durur, bir tuş dizisi ise son basışında (varsayılanlarla tek başına bir `G`) durur. Ok tuşları, `Tab`, `Enter`, `Space`, `Home`, `End` ve bir IME'de birleştirme hâlâ sürerken basılan her tuş da öyle. Klavyeyi tuvale geri veren `Escape` dışında bunlar engellenmeden durdurulur, bu sayede Gezginin alanlarında, düğmelerinde ve ağacında sıradan tuşlar gibi davranır, ne tuvale ne de sayfanın kabarcıklanma aşamasındaki `keydown` dinleyicisine ulaşır: Orada `Alt + N` tablo eklemez, `Delete` de hiçbir şey kaldırmaz. Ağaçta satırlar arasında gezinen, bir satırı daraltan veya bir satıra giden tuşlar ve `Find` ya da `Replace` alanında eşleşmeler arasında gezinen veya değiştirme yapan `Enter` ayrıca engellenir.  
Bir ana uygulamanın kaydetme veya komut paleti tuş kombinasyonu gibi diğer her tuş her zamanki gibi sayfaya geçer. [Gezgindeki tuşlar](../guide/guides/explorer.md#keys-in-the-explorer) bölümüne bakın. `4.1.0` sürümünden önce kayan Bul ve değiştir paneli, `Home`, `End`, bir tuş dizisinin son basışı ve `handTool` başka bir tuşa bağlıyken `Space` dışında tuşları aynı şekilde tutuyordu.  
`4.0.0` sürümünden itibaren görüntüleme dili seçicisi de tuşları aynı şekilde tutar: Aynı yedi bağlama geçer, diğer her bağlama (`4.1.0` sürümünden itibaren bir tuş dizisi son basışında), ok tuşları ve `Tab` ise bir IME'de birleştirme hâlâ sürerken basılan her tuş gibi orada engellenmeden durdurulur. Satırlarından birindeyken `↑`, `↓`, `Home`, `End`, `Enter` ve `Space` satırlar arasında gezinir veya birini seçer ve ayrıca engellenir.

`4.2.0` sürümünden itibaren [Sözlük](../guide/guides/dictionary.md#keys-on-the-tab) sekmesi de tuşları tutar ve düzenleyiciye yalnızca `search`, `findReplace`, `undo` ve `redo` geçer. `undo` ve `redo` gösterilen sayfanın kendi geçmişini çalıştırır, bir hücre düzenlemesi açıkken veya odak sekmenin arama alanındayken ise metne bırakılır: Orada durdurulur ama engellenmez. `search` ve `findReplace`, yukarıda anlatıldığı gibi, bir hücre düzenlemesi açıkken hiçbir şey yapmaz. Satır tuş kombinasyonları, yukarıda `addColumn` ve `removeColumn` altında anlatıldığı gibi ızgarada çalışır.  
Geçerli ayarıyla diğer her bağlama sekmede durur, bir tuş dizisi ise son basışında durur. Ok tuşları, `Tab`, `Enter`, `Space`, `Home`, `End` ve bir IME'de birleştirme hâlâ sürerken basılan her tuş da öyle. Hiçbiri tuvale veya sayfanın kabarcıklanma aşamasındaki `keydown` dinleyicisine ulaşmaz: Orada `Alt + N` tablo eklemez, `Delete` de diyagramdan hiçbir şey kaldırmaz. Sekmedeki kopyalama, kesme ve yapıştırma olayları da orada durur, böylece diyagram onları asla kendi olayları olarak okumaz. Diğer her tuş her zamanki gibi sayfaya geçer.

### dictionaryRowChords {#dictionaryrowchords}

`4.2.0` sürümünden itibaren paket `dictionaryRowChords()` işlevini dışa aktarır. Bu işlev, verdiğiniz tuş bağlama nesnesine göre Sözlük sekmesinin ızgarasının satır eklediği veya sildiği her tuş kombinasyonunu, her çağrıda yeni bir `ShortcutOption[]` olarak döndürür.  
Sırasıyla bunlar şunlardır: `addColumn` bağlamasının seçimin altına satır ekleyen tek basışlık tuş kombinasyonları; bunların her birinin `Shift` de basılı tutulan ve seçimin üstüne satır ekleyen hâli, zaten `Shift` içeren bir tuş kombinasyonu için ise hiçbiri; son olarak da `removeColumn` bağlamasının satır silen tek basışlık tuş kombinasyonları. Her biri geldiği bağlamanın `preventDefault` ve `stopPropagation` ayarlarını korur, tuş dizileri ise dışarıda bırakılır. [Satır ekleme ve silme](../guide/guides/dictionary.md#adding-and-deleting-rows) bölümüne bakın.  
Satırları üste ekleyen tuş kombinasyonu, varsayılanlarla `Alt+Shift+Enter`, hiçbir bağlamada yer almaz, bu nedenle değiştirici tuşları tam olarak eşleştiren ve geçireceği tuşların listesini yalnızca [createKeyBindingMap](#createkeybindingmap) sonucundan oluşturan bir ana uygulama onu asla geçirmez. Obsidian eklentisinin yaptığı gibi iki listeyi de geçirin.  
Yalnızca kendisine verilen nesneyi okur, öğenin bağlamalarını okumaz, bu nedenle ona tuş listenizi oluşturduğunuz nesneyi verin.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

`Control` tuşunu ortama göre değiştirir.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Kısayol tablosu {#shortcut-table}

Klavye olayının `key, code` özelliklerini kullanır.  
Mutlak konumlar için `code`, girilen değerler için `key` kullanın.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| Yok           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | Yok           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2` vb.  | `1`, `2` vb.    | `1`, `2` vb.  | `Digit1`, `Digit2` vb.         |
| `a`, `b` vb.  | `a`, `b` vb.    | `a`, `b` vb.  | `KeyA`, `KeyB` vb.             |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Hazır bir tema ayarlar.  
Varsayılanlar `appearance: 'dark'`, `grayColor: 'slate'` ve `accentColor: 'indigo'` değerleridir.  
Her alan ayrı ayrı uygulanır, bu nedenle kısmi bir çağrı diğer ikisini olduğu gibi bırakır. Aşağıdaki adlardan biri olmayan bir değer yok sayılır ve çağrı asla hata fırlatmaz.  
`4.0.0` sürümünden itibaren `appearance`, tema oluşturucudaki `System` seçeneğine karşılık gelen `'system'` değerini de alır. Bu değer, işletim sisteminin bildirdiği açık veya koyu görünüşü ya da [setSystemAppearance](#setsystemappearance) yönteminin belirttiğini gösterir ve bu değiştiğinde geçiş yapar.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

`4.0.0` sürümünden itibaren, bir IDE teması gibi kendi açık ve koyu görünüşü olan bir ana uygulama için `'system'` görünüşünün göstereceği açık veya koyu görünüşü belirtir. Biri belirtilmişken işletim sisteminin değişiklikleri yok sayılır.  
`null` ya da `'dark'` veya `'light'` dışındaki herhangi bir değer, yeniden işletim sistemini izlemeye döner.  
Görünüş `'light'` veya `'dark'` iken ekranda hiçbir şeyi değiştirmez, ancak değer saklanır ve görünüş `'system'` olur olmaz uygulanır. Aksi hâlde hemen uygulanır. Hiçbir olay tetiklemez ve `changePresetTheme` olayı `'system'` bildirmeye devam eder.  
VS Code, JetBrains ve Obsidian ana uygulamaları bunu kendi açık veya koyu görünüşleriyle çağırır ve bu her değiştiğinde yeniden çağırır.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Temanın özelleştirilmesini sağlar.  
Her çağrı özel katmanın tamamını değiştirir, bu nedenle mevcut bir geçersiz kılmanın üzerine tek bir token değiştirmek için nesnenin tamamını yeniden verin, hazır temaya geri dönmek için `{}` verin.  
Yalnızca aşağıdaki token adları, dize değerleriyle birlikte korunur; diğer her şey hata vermeden yok sayılır.  
Katman hazır temanın üzerinde durur, bu nedenle sonraki bir `setPresetTheme` çağrısı geçersiz kılmalarınız korunurken alttaki hazır temayı değiştirir.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` ve `memoShadow`, tabloların ve notların ERD tuvaline düşürdüğü gölgenin rengidir. Koyu hazır tema bunları `transparent` olarak bırakır, bu da `setTheme` yöntemine `none` veya boş bir dize vermenin yaptığı gibi hiç gölge düşürmez. Açık hazır tema ise `rgba(0, 0, 0, 0.18)` kullanır.

`4.0.0` sürümünden itibaren dokuz token daha vardır:

- `tableGroupHeaderBackground`, `tableGroupBackground` ve `tableGroupBorder`, kendine ait bir rengi olmayan bir [tablo grubunun](../guide/guides/table-groups.md) başlık çubuğunu, gövdesini ve dış çizgisini renklendirir.
- `toastSuccess` ve `toastError`, bir işin nasıl sonuçlandığını bildiren bir bildirimin işaretini renklendirir.
- `findReplaceError` ve `mapColumnsError`, Bul ve değiştir ile “Sütunları eşle” iletişim kutusunun gösterdiği hataları renklendirir. Bul ve değiştir daha önce `diffDeleteForeground` kullanıyordu, bu nedenle onu geçersiz kılmak artık Bul ve değiştir panelinin rengini değiştirmez.
- `schemaSqlWarningBackground` ve `schemaSqlWarningForeground`, Şema SQL sekmesinin seçeneklerindeki uyarıları renklendirir.

`4.1.0` sürümünden itibaren dokuz token daha vardır:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` ve `treeMatch`, [Gezgin](../guide/guides/explorer.md#the-tree) ile [Fark görüntüleyicinin](../guide/guides/table-related-functions.md#diff-viewer) paylaştığı ağacı renklendirir: Gezginin `Find` ve `Replace` alanlarını da dolduran arka planını; işaretçinin altındaki satırı, ağaç odaktayken klavyenin bulunduğu satırı ve Gezginin başlığında ve aramasında işaretçinin altındaki düğmeyi; geçerli arama eşleşmesinin satırını; sayılar, veri türleri ve daraltma okları gibi soluk metni ve bir aramanın bulduğu metnin arkasındaki işareti.
- `explorerBackground` ve `explorerBorder`, Gezgin panelini ve çizgilerini renklendirir: tuvalin yanındaki kenarını, aramasının altındaki çizgiyi, alanlarının ve `Search In` öğesinin açtığı düğmelerin kenarlıklarını. `explorerBorder` ayrıca Fark görüntüleyici ağacının kenarını, `Filter by name` alanının altındaki çizgiyi ve bu alanın kenarlığını çizer. Gezginin anahtar simgeleri `keyPK`, `keyFK` ve `keyPFK` renklerini alır.
- `diffModifyForeground` ve `diffRenameForeground`, Fark görüntüleyicinin ağacında ve iki belgede de değiştirildi ve yeniden adlandırıldı olarak işaretlediklerini renklendirir. `diffModifyForeground` ayrıca içinde başka ne değişmiş olursa olsun taşınan, yeniden boyutlandırılan, rengi değiştirilen veya grubu değiştirilen bir tablonun, notun ya da tablo grubunun dış çizgisini ve değişen bir yabancı anahtarın bağlantı çizgisini de çizer.

`diffInsertForeground` ve `diffDeleteForeground` artık Fark görüntüleyicinin eklendi ve kaldırıldı olarak işaretlediklerini ağacında ve bunları içeren belgede, metinde, dış çizgilerde ve bağlantı çizgilerinde aynı şekilde renklendirir. Fark görüntüleyici artık hücreleri doldurmadığı için `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` ve `diffCrossForeground`, `4.1.0` sürümünde kaldırıldı. `setTheme` bunları `Theme` içinde olmayan diğer her ad gibi yok sayar ve bunların CSS kancaları olan `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` ve `--erd-editor-diff-cross-foreground` artık okunmaz.

`4.2.0` sürümünden itibaren on iki token daha vardır:

- `columnHandleBackground` ve `columnHandleBorder`, bir tablonun sol kenarının hemen dışında, odaktaki sütun satırının yanında çizilen [sütun sürükleme tutamacını](../guide/guides/table-editing.md#rearranging-and-moving-columns) doldurur ve dış çizgisini çizer, işaretçi tutamacın üzerindeyken bunların yerini `columnHandleHoverBackground` ve `columnHandleHoverBorder` alır. Tutamacın kavrama işareti `foreground`, işaretçinin altındayken ise `active` rengini alır.
- `dictionaryErrorForeground` ve `dictionaryWarningForeground`, [sözlük denetimlerinin](../guide/guides/dictionary.md#what-each-check-finds) bulduğu hatayı veya uyarıyı renklendirir: ERD tuvalinde denetimlerin sorun bulduğu bir adı ([Tuvaldeki işaretler](../guide/guides/dictionary.md#marks-on-the-canvas) bölümüne bakın), `Domains`, `Words` ve `Terms` sayfalarında sorun bulunan bir hücrenin metnini ve `Checks` sayısını. `dictionaryErrorBackground` ve `dictionaryWarningBackground` böyle bir hücreyi doldurur. `dictionaryErrorForeground` ayrıca işaretçinin altındaki `Delete Rows` aracını da renklendirir.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` ve `dictionaryHeaderSelect`, [Sözlük](../guide/guides/dictionary.md#the-sheets) sekmesinin sayfasını renklendirir: sekmenin arama alanını ve bir terimin değer alanı listesini de dolduran hücrelerini; sütun başlıklarını ve satır numaralarını; sekmenin çubuğunu ve alanlarının kenarlıklarını da çizen hücreler arası çizgileri ve satırı veya sütunu seçimle kesişen bir başlığı. Sayfanın geri kalanı ortak token'ları alır: başlık etiketleri için `foreground`, hücre metni için `active`, sütun başlıklarını ve satır numaralarını hücrelerden ayıran çizgi için `grayColor7`, etkin hücrenin kenarı için `focus`, seçili bir aralığın kenarı ve %20 opaklıktaki dolgusu için `accentColor9`, tamamen seçili bir satırın veya sütunun başlığı için `accentColor6`, salt okunur hücreler için `grayColor3` ve kaydırma çubuğu token'ları. `#rgb` veya `#rrggbb` olarak yazılmamış bir `accentColor9`, seçili bir aralığı dolgusuz bırakır.

#### CSS değişkenleri {#css-variables}

`Theme` içindeki her token'ın, adı `--erd-editor-` ve kebab-case biçimindeki anahtardan oluşan eşleşen bir CSS kancası vardır: `grayColor10` için `--erd-editor-gray-color-10`, `keyPK` için `--erd-editor-key-pk` ve `keyPFK` için `--erd-editor-key-pfk`.  
Kancalar kalıtım yoluyla düzenleyicinin içine geçer, bu nedenle onları uygulanmasını istediğiniz yerde ayarlayın. `:root` üzerinde sayfadaki her düzenleyiciye, öğenin kendisi üzerinde ise yalnızca o düzenleyiciye tema uygularlar.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

`3.4.0` sürümünden itibaren yanlış yazılmış `dargSelect` token'ları `dragSelect` olarak yazılır ve kancaları `--erd-editor-darg-select-background` ve `--erd-editor-darg-select-border` adlarından `--erd-editor-drag-select-background` ve `--erd-editor-drag-select-border` adlarına değişti. Hâlâ eski adları kullanan bir stil sayfası yok sayılır.

<details>
<summary>Varsayılan tema değerleri</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Görüntüleme dili {#display-language}

`4.0.0` sürümünden itibaren düzenleyicinin kendi metni – menüleri, panelleri, iletişim kutuları, Hızlı arama, bildirimleri ve görüntü dışa aktarmaları dahil diyagram üzerine çizdiği `unnamed` gibi sözcükler – 25 dilde sunulur. Tablo ve sütun adları, SQL, veri türleri ve oluşturulan kod asla çevrilmez. [Dil ve tema](../guide/guides/language-and-theme.md) sayfasına bakın.  
[setLocale](#setlocale) çağrılmadan veya bir dil seçilmeden önce düzenleyici İngilizce gösterir ya da [enableLocalePicker](#enablelocalepicker) açıkken `'system'` seçeneğini izler.  
Düzenleyici `lang` ve `dir` özniteliklerini kapalı gölge kökün içindeki kendi kökünde ayarlar, ana öğede veya sayfada asla ayarlamaz, böylece sağdan sola bir sayfa düzenleyiciyi, sağdan sola yazılan bir dil de sayfayı ters çevirmez. İbranice, Arapça ve Farsça düzenleyicinin arayüzünü sağdan sola yerleştirir, diyagramın kendisi ise asla aynalanmaz. `4.1.0` sürümünden itibaren [Gezgin](../guide/guides/explorer.md) her dilde tuvalin solunda kalır ve bu üç dilde kendi satırları sağdan sola okunur.  
Paket `LocaleCode` (aşağıdaki kodlardan biri) ve `LocaleOption` türlerini dışa aktarır.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Kod     | Görünen ad           | Dil                  |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Endonezce            |
| `de-DE` | Deutsch              | Almanca              |
| `en`    | English              | İngilizce            |
| `es-ES` | Español              | İspanyolca           |
| `eu-ES` | Euskara              | Baskça               |
| `fr-FR` | Français             | Fransızca            |
| `it-IT` | Italiano             | İtalyanca            |
| `nl-NL` | Nederlands           | Felemenkçe           |
| `pl-PL` | Polski               | Lehçe                |
| `pt-PT` | Português            | Portekizce           |
| `pt-BR` | Português Brasileiro | Brezilya Portekizcesi |
| `ro-RO` | Română               | Rumence              |
| `sk-SK` | Slovenčina           | Slovakça             |
| `sl-SI` | Slovenščina          | Slovence             |
| `sv-SE` | Svenska              | İsveççe              |
| `tr-TR` | Türkçe               | Türkçe               |
| `ru-RU` | Русский              | Rusça                |
| `uk-UA` | Українська           | Ukraynaca            |
| `he-IL` | עברית                | İbranice             |
| `ar-SA` | العربية              | Arapça               |
| `fa-IR` | فارسی                | Farsça               |
| `ja-JP` | 日本語               | Japonca              |
| `zh-CN` | 简体中文             | Basitleştirilmiş Çince |
| `zh-TW` | 繁體中文             | Geleneksel Çince     |
| `ko-KR` | 한국어               | Korece               |

### setLocale {#setlocale}

Görüntüleme dilini ayarlar: `'system'` ya da yukarıdaki kodlardan biri. Tek başına `'ko'`, bilinmeyen bir kod veya dize olmayan bir değer gibi başka her şey hata vermeden yok sayılır.  
Çağrı dönmeden önce uygulanır, bu nedenle öğe sayfaya eklenmeden önce ayarlanan bir dil ilk karede görünür.  
Hiçbir olay tetiklemez – ne `changeLocale` ne de `change` – ve `value` değerine, geri alma geçmişine ya da paylaşılan bir depoya dokunmaz.  
`enableLocalePicker` açık da olsa kapalı da olsa seçim korunur ve `setLocale('system')` seçici kapalıyken de sistemi izler.  
Düzenleyici hiçbir şey saklamaz. Bir okuyucunun seçimini korumak için [changeLocale](#changelocale) olayını dinleyin ve bir sonraki yüklemede seçimi geri verin.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Kendi görüntüleme dili olan bir ana uygulama için `'system'` seçeneğinin karşılık geldiği dili bir BCP 47 etiketi olarak belirtir. VS Code, JetBrains ve Obsidian ana uygulamaları bunu kendi görüntüleme dilleriyle çağırır.  
Etiketin baştaki ve sondaki boşlukları kırpılır. `null`, boş bir dize veya dize olmayan bir değer, tarayıcının `navigator.languages` değerine geri döner ve düzenleyici bu değeri değiştikçe izler.  
Yalnızca geçerli seçenek `'system'` iken önemlidir ve hemen uygulanır. Seçicinin `System` satırı, bu seçeneğin çözümlendiği dili gösterir.  
Etiket ya da sırayla tarayıcının dillerinin her biri, büyük/küçük harf ve alt çizgiler dikkate alınmadan, dil alt etiketine göre düzenleyicide bulunan ilk dile çözümlenir: `de-AT` için `de-DE`, `en-GB` için `en` elde edilir. Çince yazı sistemine göre belirlenir, `Hant` için `zh-TW`, `Hans` için `zh-CN` elde edilir. Yazı sistemi yoksa bölgeye göre belirlenir: `TW`, `HK` ve `MO` için `zh-TW`, diğer her durumda `zh-CN`. `BR` dışında bir bölge belirtilmedikçe `pt` için `pt-BR` elde edilir. Hiçbir şey eşleşmezse düzenleyici İngilizce gösterir.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Bir Şema SQL dosyası yükler.  
Varsayılan olarak geçerli belgeyle birleştirmek yerine onu değiştirir; aşağıdaki `mode` seçeneğine bakın. Görünüm konumu ve yakınlaştırma düzeyi dışında, her kilit ve kilitli değeri dahil mevcut ayarlarınız korunur ve tablolar dosya okunduktan sonra, aşağıdaki `placement` aksini istemedikçe satırlar hâlinde yerleştirilir. `Viewport` kilitliyken `value` bundan sonra içe aktarmanın başladığı görünümü, yani `1` yakınlaştırma düzeyinde `0, 0` başlangıç noktasını yazar. Bu nedenle hiç değer verilmemiş bir öğeye içe aktarılan bir belgede, yeni bir belgede olduğu gibi tüm kilitler etkindir.  
`4.2.0` sürümünden itibaren bir değiştirme, belgenin metinde tutulamayan sözcüklerini, terimlerini ve değer alanlarını her Sözlük sayfasının geri alma geçmişiyle birlikte korur ve içe aktarmanın geri alınması veya yinelenmesi de onları korur. Değiştirme modundaki bir [setSchemaJSON](#setschemajson) çağrısı ve `value` değerine atama ise bunun yerine kendi belgelerinin tuttuklarını alır.  
Geçmiş listesine kaydedilir, böylece `Undo, Redo` kullanılabilir ve `change` olayını tetikler. Boş bir dize yok sayılır ve `readonly` ayarlıyken çağrı hiçbir şey yapmaz.  
`setSchemaGraphQL`, `setSchemaDBML` ve `setSchemaAML` de aynı şekilde davranır ve ayrıştırıcıları asla başarısız olmaz: Okuyamadıkları metin hata vermek yerine boş bir belge yükler.  
`4.0.0` sürümünden itibaren dördü de isteğe bağlı ikinci bir argüman olarak `{ placement, mode }` alır:

- Varsayılan olan `placement: 'grid'`, eskisi gibi tabloları hemen satırlar hâlinde yerleştirir ve çağrı hiçbir şey döndürmez.
- `placement: 'auto'`, düzenleyicideki `Import` öğesinin yaptığı gibi tabloları önce ilişkilerine göre düzenler ve içe aktarma tek bir geri alma adımı olarak yerleştiğinde çözümlenen bir `Promise` döndürür. İkiden az tablo olması, hiç ilişki olmaması, düzenin başarısız olması, sayfada `SharedWorker` bulunmaması ya da `Placing tables` bildirimindeki `Cancel` düğmesine basılması durumunda tablolar bunun yerine satırlar hâlinde yerleştirilir. Bu arada gerçekleşen bir yükleme – değiştiren başka bir içe aktarma, `value` değerine atama, `setInitialValue()`, `clear()`, bir ortak çalışanın yüklemesi ya da bir yüklemenin veya `clear()` çağrısının geri alınması veya yinelenmesi – onun yerini alır ve `Promise` hiçbir şey yüklenmeden çözümlenir. Bu şekilde yerleştirilen içe aktarmalar başladıkları sırayla yerleşir.
- Varsayılan olan `mode: 'replace'` belgeyi değiştirir. `mode: 'append'`, [İçe aktar ve ekle](../guide/guides/file-import-export.md#import-and-add) özelliğinin yaptığı gibi dosyayı diyagramın altına ekler, zaten orada olan her tabloyu ve sekme ile görünüm konumu dışındaki her ayarı olduğu gibi bırakır. Başka bir sekmedeyken önce ERD sekmesine geçilir. Yeni tablolar seçilir, tablo grupları gösteriliyorsa bir DBML dosyasının getirdiği tablo grupları da seçilir ve görünüm, `4.1.0` sürümünden itibaren her atlamanın uyduğu kurala göre, zaten düzgün biçimde görünür durumda değillerse onlara kaydırılır. [Atlamanın varış noktası](../guide/guides/table-related-functions.md#where-a-jump-lands) bölümüne bakın. Tek bir geri alma eklemenin tamamını kaldırır. Okuyamadığı metin hiçbir şey eklemez ve belgeyi olduğu gibi bırakır.

`readonly` ayarlıyken değiştirme yok sayılır, ekleme hiçbir şey eklemez ve `placement: 'auto'` çağrısı hemen çözümlenir.  
`3.10.0` sürümünden itibaren `setSchemaSQL` dosyayı belgenin geçerli veritabanına göre okur: Databricks seçiliyken tek tırnaklı dizeler Spark'ın ters eğik çizgi kaçış kurallarına uyar. [Açıklamalar](../guide/guides/file-import-export.md#comments) bölümüne bakın.  
`3.10.0` sürümünden itibaren `setSchemaSQL`, iki veya daha fazla sütunu kapsayan bir `UNIQUE` kısıtlamasını her sütunda bir Benzersiz bayrağı olarak değil, tek bir benzersiz dizin olarak okur. [Benzersiz anahtarlar ve dizinler](../guide/guides/file-import-export.md#unique-keys-and-indexes) bölümüne bakın.  
`3.10.0` sürümünden itibaren SQL, DBML ve AML içe aktarmaları, okudukları yabancı anahtarların `ON DELETE` ve `ON UPDATE` eylemlerini korur.  
`4.0.0` sürümünden itibaren `setSchemaSQL` bir sütunun `DEFAULT` ifadesinin tamamını korur, SQL Server'ın `ADD DEFAULT … FOR` ifadesini ve `MS_Description` açıklamalarını okur, PostgreSQL serial ve identity sütunlarını Otomatik artırmaya dönüştürür, bir veri türündeki `UNSIGNED` ve `ZEROFILL` ifadelerini korur ve `ALTER TABLE … ADD PRIMARY KEY` ile `CLUSTERED`, `NONCLUSTERED` veya `USING BTREE` olarak işaretlenen bir birincil anahtarı okur. [Şema SQL](../guide/guides/file-import-export.md#schema-sql) bölümüne bakın.  
Her ayrıştırıcının kabul ettiği söz dizimi için [Dosyaları içe veya dışa aktarma](../guide/guides/file-import-export.md) sayfasına bakın.

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Bir GraphQL SDL belgesi yükler.  
Nesne türü tanımları tablo olur, türü başka bir tablo olan bir alan da ilişki olur.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

dbdiagram.io ve dbdocs'un kullandığı biçim olan bir DBML dosyası yükler.  
`4.0.0` sürümünden itibaren her `TableGroup` bir [tablo grubu](../guide/guides/table-groups.md) olur ve bir tablonun `headercolor` değeri o tablonun rengi olur. [DBML](../guide/guides/file-import-export.md#dbml) bölümüne bakın.

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Bir AML (Azimutt Markup Language) dosyası yükler. Hem güncel yazım hem de eski v1 yazımı kabul edilir.  
`4.0.0` sürümünden itibaren bir varlığın, Azimutt renk adlarından biri veya tırnak içinde onaltılık bir değer olan rengi, tablosunun rengi olur. [AML](../guide/guides/file-import-export.md#aml) bölümüne bakın.

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

`4.0.0` sürümünden itibaren, [value](#value) özelliğinin döndürdüğü metin gibi bir `.erd.json` belgesi yükler.  
Varsayılan `mode: 'replace'` modunda belgeyi `value` değerine atamanın yaptığı gibi yükler: Geçmiş listesine kaydedilir, `change` olayını tetikler ve belgenin kilitlerini aynı şekilde alır, `4.2.0` sürümünden itibaren de belgenin sözcükleri, terimleri ve değer alanları düzenleyicininkilerin yerini alır. `value` özelliğinden farklı olarak boş bir dize veya dize olmayan bir değer yeni bir belge başlatmak yerine yok sayılır. JSON olmayan bir metin, `value` ile olduğu gibi belgeyi boşaltır.  
`mode: 'append'`, [İçe aktar ve ekle](../guide/guides/file-import-export.md#import-and-add) özelliğinin bir `json` dosyasıyla yaptığı gibi belgenin tablolarını, ilişkilerini, dizinlerini, notlarını ve tablo gruplarını birbirlerine göre konumlarını koruyarak yeni kimliklerle diyagramın altına ekler ve belgenin ayarlarını dışarıda bırakır. `4.2.0` sürümünden itibaren tabloların ve sütunların mantıksal adlarını ve türetilmiş ad bayraklarını korur, ancak belgenin sözcüklerini, terimlerini ve değer alanlarını geride bırakır, bu nedenle sütunlarından hiçbiri bir değer alanına bağlı olmaz. Okuyamadığı metin ya da hiç tablo ve not içermeyen bir belge hiçbir şey eklemez. Aksi hâlde bir [setSchemaSQL](#setschemasql) eklemesinin yaptığı gibi yerleşir ve yeni notları ve tablo grupları, her tür gösterildiği sürece, tablolarıyla birlikte seçilir.  
Belge yerleştiğinde döner ve `readonly` ayarlıyken yok sayılır.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Geçerli düzenleyici durumunu Şema SQL olarak dışa aktarır.  
`databaseVendor` belirtilmezse, o anda ayarlı olan veritabanı sistemine göre çalışır. Aşağıdaki listede olmayan bir ad da hata vermeden aynı şekilde ele alınır.  
Adlar, düzenleyicinin gösterdiği tırnak türüyle tırnak içine alınır. `Bracket Type` [kilitliyken](../guide/guides/settings.md#lock) bu, `value` değerinin kaydettiği türden farklı olabilir. Bir kodlama ajanının [`erd_read`](../mcp/tools.md#reading-a-document) aracı da adları bu kaydedilen türle tırnak içine alır. Yazılan adlar, Ad görünümü ne olursa olsun her zaman fiziksel adlardır.  
`4.0.0` sürümünden itibaren isteğe bağlı bir `options` argümanı, [Şema SQL](../guide/guides/schema-sql.md) sekmesinin seçenekleri gibi ifadeleri ve başlığı, `4.2.0` sürümünden itibaren de mantıksal adların boş açıklamaları doldurup doldurmayacağını seçer. `SchemaSQLOptions` bir tür olarak dışa aktarılır.

- `statements`: varsayılan olan `'create'`; MySQL, MariaDB, PostgreSQL, SQLite ve Databricks için `IF NOT EXISTS` yazan, diğerlerinde `'create'` değerine geri dönen `'ifNotExists'` ya da tabloları oluşturmadan önce kaldıran `'recreate'`, Snowflake ise bunun yerine `CREATE OR REPLACE TABLE` yazar.
- `header`: varsayılan olan `'none'`; belgenin veritabanına veya şemasına geçen `'use'` ya da önce yoksa onu oluşturan, ardından ona geçen `'createAndUse'`. İstenen seçeneği desteklemeyen bir veritabanı sekmenin yaptığı gibi geri döner: Oracle `'createAndUse'` için `'use'` yazar, PostgreSQL `'use'` için başlık yazmaz, SQLite ise hiç başlık yazmaz. Başlık yalnızca belgenin veritabanı adı yalın bir tanımlayıcıyken yazılır – ASCII harfler, rakamlar ve `_` karakterinden oluşan ve rakamla başlamayan bir ad.
- `logicalNameAsComment`, `4.2.0` sürümünden itibaren: `true`, bir tablonun veya sütunun kendi açıklaması boşsa ya da yalnızca boşluklardan oluşuyorsa ve mantıksal adı boş değilse, mantıksal adını o veritabanının açıklama yazdığı biçimde açıklaması olarak yazar. Metin içeren bir açıklama eskisi gibi yazılır. Bunu yalnızca `true` açar: Dışarıda bırakılması, `false` ya da `'true'` veya `1` gibi başka herhangi bir değer hiçbir mantıksal ad yazmaz. Sekmedeki [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) anahtarının yaptığını yapar.

Dışarıda bırakılan ya da bilinmeyen bir değere sahip bir seçenek varsayılan değeriyle okunur, bu nedenle seçeneksiz bir çağrı eskisi gibi başlıksız, yalın `CREATE` ifadeleri yazar.  
`4.0.0` sürümünden itibaren çıktı her zaman belgenin `Before tables` ve `After tables` betiklerini şu sırayla içerir: başlık, önceki betik, kaldırma ifadeleri, tablolar, sonraki betik. Şema SQL sekmesinin kendi `Statements`, `Header`, `Write logical names into empty comments` ve `Tables` seçimleri, her zaman belgenin tamamını yazan bu çağrıyı asla etkilemez.  
`3.10.0` sürümünden itibaren her yabancı anahtar, ilişkinin `ON DELETE` ve `ON UPDATE` yan tümcelerini taşır. Bir yan tümce yalnızca eylemi ayarlıysa ve veritabanı sistemi onu kabul ediyorsa yazılır, bu nedenle o sistemin kabul etmediği bir eylem yer almaz ve varsayılanı geçerli olur. `4.0.0` sürümünden itibaren Snowflake yalnızca `NO ACTION` kabul eder. Her veritabanının ne yazdığı için [ON DELETE ve ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) bölümüne bakın.  
`3.10.0` sürümünden itibaren bir tablo veya sütun açıklamasındaki tek tırnak kaçışlanır, bu nedenle `it's` gibi bir açıklama artık ifadeyi bozmaz. Açıklamaları dize sabiti olarak yazan her veritabanı sistemi tırnağı ikiler, tek istisna her tırnağın ve her ters eğik çizginin önüne bir ters eğik çizgi koyan Databricks'tir. SQLite açıklamaları hâlâ `--` satırları olarak yazar.  
`4.2.0` sürümünden itibaren SQL Server her açıklamayı `N'…'` biçiminde bir ulusal dize sabiti olarak yazar, böylece Korece gibi veritabanının kod sayfası dışında kalan metinler korunur. Oracle bir açıklamadaki her ardışık boş satır dizisini tek bir satır sonu olarak yazar, SQLite ise bir açıklamanın satır sonlarını boşluk olarak yazar, böylece açıklama kendi `--` satırında kalır. [Açıklamalar](../guide/guides/schema-sql.md#comments) bölümüne bakın.  
`4.0.0` sürümünden itibaren birkaç veritabanı anahtar adlarını, varsayılan değerleri ve otomatik artırmayı da farklı yazar. [DDL'in yazdıkları](../guide/guides/schema-sql.md#what-the-ddl-writes) bölümüne bakın.

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Gerçek zamanlı ortak düzenleme için bir depo döndürür.  
`config`, `{ getNickname?, mouseTracker?, focusTracker? }` biçimindedir. İki izleyici de varsayılan olarak `true` olur: `mouseTracker` bu düzenleyicinin imlecini diğerlerine yayınlar, `focusTracker` ise odaktaki hücresini, seçimini ve sürükleme kutusunu yayınlar.  
[Ortak düzenleme](./advanced/collaborative-editing.md) sayfasına bakın.

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

O anda açık olan belgeyi verdiğiniz belgeyle karşılaştırarak Fark görüntüleyiciyi açar.  
Hiçbir şey döndürmez ve belgeyi değiştirmez, bu nedenle görüntüleyiciyi kapatmak düzenleyiciyi tam olarak önceki hâlinde bırakır.  
Boş bir değer ya da dize olmayan herhangi bir şey boş bir belgeyle karşılaştırılır.  
Tuvalin bağlam menüsündeki [Fark görüntüleyici](../guide/guides/table-related-functions.md#diff-viewer) ile aynı katmandır.  
`4.1.0` sürümünden itibaren iki belgenin içerdiklerini önce kimliğe göre, ancak ondan sonra bir tablonun adı veya bir notun metni gibi her birinin tuttuğu içeriğe göre eşleştirir. [Neler karşılaştırılır](../guide/guides/table-related-functions.md#what-is-compared) bölümüne bakın. Bu nedenle aynı belgenin önceki bir sürümüne, örneğin dosyasının bir Git revizyonuna karşı bir yeniden adlandırma tek bir yeniden adlandırılmış öğe olarak görünür, kimlikleri farklı olan bir belgeye karşı ise bir kaldırma ve bir ekleme olarak görünür. Görüntüleyici değişenleri iki belgenin yanındaki bir ağaçta listeler ve değişiklikleri hücreleri doldurmak yerine renkle işaretler.  
`4.2.0` sürümünden itibaren, verilen belge ne kaydetmiş olursa olsun iki belge de bu düzenleyicinin gösterdiği Ad görünümünde açılır ve ağaç da tabloları ve sütunları bu görünüme göre adlandırır. [Tuvalin ötesinde](../guide/guides/logical-names.md#beyond-the-canvas) bölümüne bakın. Mantıksal adlar, değer alanı bağlantıları ve sözlükler karşılaştırılmaz, bu nedenle yalnızca bunlarda yapılan bir değişiklik hiçbir fark göstermez.

```js
editor.setDiffValue('prev json...');
```
