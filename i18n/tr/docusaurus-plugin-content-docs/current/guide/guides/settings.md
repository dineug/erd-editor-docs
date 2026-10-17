---
sidebar_position: 14
description: İlişkilerde veri türü eşitleme, en fazla açıklama genişliği, tablo genişliklerini yeniden hesaplama, ayar kilitleri (görünüm, sekme ve kod ayarları), sütunların görüntülenme sırası ve kısayol listesi.
---

# Ayarlar

Ayarlar ekranını araç çubuğundaki `Settings` düğmesiyle veya [Hızlı aramada](./quick-search.md) `Tab` altından açın.
Ayarlar ekranında iki sekme vardır: `Preferences` ve `Shortcuts`. Önce `Preferences` sekmesi açılır; yalnızca [karşılama ekranındaki](./editing-start.md#welcome-screen) `Shortcuts` satırından açıldığında `Shortcuts` sekmesi açılır.

Tema ve görüntüleme dili bu ekranda yer almaz. Bunları araç çubuğundaki `Theme` ve `Display Language` düğmeleri açar. [Dil ve tema](./language-and-theme.md) sayfasına bakın.

## İlişkilerde veri türü eşitleme {#relationship-datatype-sync}

Veri türlerinin eşitlenip eşitlenmeyeceğini belirler. Varsayılan olarak açıktır.
Ayar açıkken bir sütunun veri türünü değiştirmek, bu türü zinciri her iki uçtan izleyerek o sütuna ilişkiyle bağlı her sütuna uygular; böylece bir yabancı anahtar, başvurduğu anahtardan hiçbir zaman farklılaşmaz.
Bir anahtardan yabancı anahtarlarına geçerken serial türü, bir ilişki çizildiğinde olduğu gibi, sakladığı tamsayı türü olarak aktarılır. [Tanımlayıcı ilişkiler](./relationship-editing.md#identifying-relationships) bölümüne bakın. Bu nedenle PostgreSQL'de bir anahtarı `serial` olarak değiştirmek, yabancı anahtarlarına `integer` türünü verir ve değişiklik oradan itibaren zincir boyunca ilerler.
Bir yabancı anahtardan anahtarına geri dönerken tür yazıldığı gibi aktarılır; ancak serial bir anahtar kendi türünü korur ve değişiklik orada durur.
[Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusu da bu ayarı izler: Ayar açıkken eşlediği her mevcut sütun, üst tablodaki anahtarının bir yabancı anahtara verdiği türü alır ve değişiklik yukarıdaki gibi ilişkiler boyunca ilerler. Ayar kapalıyken veya anahtarın veri türü yoksa sütun kendi türünü korur.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="İlişkilerde veri türü eşitleme ayarı" loading="lazy" />

![members.id türünü BIGINT UNSIGNED olarak değiştirme ve ona bağlı her member_id sütununun güncellenmesi](/img/demo-relationship-data-type-sync.webp)

## En fazla açıklama genişliği {#maximum-comment-width}

Açıklama sütununun en fazla genişliğini piksel cinsinden belirtir (`60` ~ `200`).
Anahtarı kapatmak sınırı kaldırır ve anahtar kapalıyken giriş alanı devre dışıdır.
Anahtar açıldığında değer `60px` olarak başlar. Aralığın dışında yazılan bir değer en yakın sınıra çekilir.

![Maximum comment width ayarını açma, 120 girme ve ERD sekmesinin açıklamaları bu genişlikte kesilmiş olarak göstermesi](/img/demo-settings-comment-width.webp)

## Tablo genişliklerini yeniden hesaplama {#recalculation-table-width}

Her tablonun ve sütun hücresinin genişliğini geçerli metnine sığacak şekilde yeniden hesaplamak ve ilişkilerin bağlantı çizgilerini yeni boyutlara göre yeniden çizmek için `Sync` düğmesine basın.
İşlemi `Recalculated table width` bildirimi onaylar.
Genişlikler bir belge her yüklendiğinde kendiliğinden yeniden hesaplanır; bu nedenle bu işlem yalnızca yazı tipindeki veya görüntü oluşturmadaki bir değişiklik genişliklerin güncelliğini yitirmesine yol açtığında gerekir.
Genişlikler dosyaya kaydedilmez; bu nedenle `Sync` dosyayı hiçbir zaman değiştirmez.

## Kilit {#lock}

`Lock` listesinde altı ayar bulunur. Bir ayarın kilidi etkinken dosya, ayarın kilitlendiği andaki değerini korur; bu nedenle ayarı ekranda değiştirmek dosyayı olduğu gibi bırakır.

| Satır | Dosyanın koruduğu | Yeni bir diyagramda |
| --- | --- | --- |
| `Viewport` | ERD tuvalinin yakınlaştırma düzeyi ve görünüm konumu, tek bir kilit olarak | `100% · 0, 0` |
| `Canvas Type` | Diyagramın açıldığı sekme: `ERD`, `Visualization`, `Schema SQL` veya `Code Generator` | `ERD` |
| `Language` | [Kod oluşturucu](./code-generator.md#language) dili | `GraphQL` |
| `Table Name Case` | Kod oluşturucunun [tablo adı biçimi](./code-generator.md#name-case) | `Pascal` |
| `Column Name Case` | Kod oluşturucunun [sütun adı biçimi](./code-generator.md#name-case) | `Camel` |
| `Bracket Type` | [Şema SQL](./schema-sql.md#database-and-bracket) sekmesinin ve bu ayarı sunan [Kod oluşturucu](./code-generator.md#bracket) hedeflerinin `Bracket` ayarı | `None` |

Her satırda bir değer ve bir kilit düğmesi gösterilir; düğmeye tıklamak yalnızca o kilidi etkinleştirir veya devre dışı bırakır.
Kilit etkinken düğme, araç ipucunda `Unlock Viewport` yazan (diğer satırlarda da benzer şekilde) kapalı bir kilit gösterir; araç ipucunda `Locked value` yazan değer de dosyanın koruduğu değerdir.
Kilit devre dışıyken düğme, araç ipucunda `Lock Viewport` yazan açık bir kilit gösterir; soluk görünen ve araç ipucunda `Current value` yazan değer de ayarın şu anki hâlidir.
`Viewport` satırında önce yakınlaştırma, ardından görünüm konumu yazar; örneğin `75% · -40, 91`. Görünüm konumu, diyagramın `0, 0` noktasının ekranda bulunduğu yerin piksel cinsinden konumudur ve bin veya daha büyük bir koordinat `1.2k` ya da `-24k` gibi kısaltılır.

Kilitleme, ayarı o anki hâliyle alır.
Kilit etkinken ayar ekranda çalışmaya devam eder: Kaydırabilir ve yakınlaştırabilir, sekme değiştirebilir, menülerden, seçenekler panellerinden veya Hızlı aramadan başka bir dil, ad biçimi ya da tırnak seçebilirsiniz.
Ancak dosya kilitli değeri korur ve satır da bu değeri göstermeye devam eder; bu nedenle diyagram kilitli görünümde, kilitli sekmede, kilitli dil, ad biçimleri ve tırnakla yeniden açılır. JSON dışa aktarma da kilitli değerleri yazar.
Ekranda görüneni kaydetmek için kilidi devre dışı bırakın; dosya o andan itibaren ayarı izler: `Viewport` kilidi devre dışıyken diyagram bıraktığınız yerde açılır. Bunun yerine yeni bir başlangıç görünümü gibi yeni bir değeri kilitlemek için kilidi devre dışı bırakıp yeniden etkinleştirin.
Dosya açıldığında kilitli görünümde diyagramın hiçbir kısmı görünmüyorsa ekran yine de diyagramın üzerine gelir ve kilitli değer olduğu gibi kalır.
`Canvas Type` kilidi Ayarlar sekmesini hiçbir zaman korumaz. Bu kilidi etkinleştirmek, en son bulunduğunuz diğer sekmeyi kilitler; kilit devre dışıyken de satırında o sekmenin adı yazar.

![Viewport kilidini açma, diyagramı kaydırma ve yakınlaştırma, ardından satırının gösterdiği yeni görünümde yeniden kilitleme](/img/demo-settings-locks.webp)

Dosya hangi kilitlerin etkin olduğunu sakladığı için bir kilidi etkinleştirmek veya devre dışı bırakmak dosyayı değiştirir; ancak Ayarlar sekmesinin geri kalanı gibi bu da [geri alma geçmişine](./undo-redo.md#what-the-history-records) kaydedilmez. Salt okunur bir düzenleyicide kilit düğmeleri hiçbir şey yapmaz.
Diğer her ayar o anki hâliyle kaydedilir: veritabanı, [`View Option`](./table-related-functions.md#table-view-options) aç/kapat düğmeleri ve `Preferences` sekmesinin geri kalanı.

Sıfırdan başlatılan yeni bir diyagramda tüm kilitler etkindir: VS Code'da, Obsidian'da veya bir JetBrains IDE'sinde açılan boş bir dosya (Obsidian'ın `ERD Editor: Create new diagram` ve `New ERD` komutları böyle bir dosya oluşturur), web uygulamasında yeni bir şema, Google Drive'ın New menüsünden oluşturulan bir dosya veya kendisine değer verilmemiş bir `<erd-editor>` öğesi.
Web uygulamasının bir SQL, DBML, AML veya GraphQL dosyasını içe aktararak oluşturduğu bir şema ya da Google Drive dosyası da tüm kilitler etkin olarak başlar. Bir JSON dosyasından oluşturulan ise o dosyanın kaydettiği kilitleri korur.
Açtığınız bir dosya, kaydedildiği kilitleri her biri kendi kilitli değerinde olacak şekilde korur.
Kilitler gelmeden önceki bir sürümle kaydedilmiş ya da elle yazılmış bir dosya gibi hiç kilit kaydetmeyen bir dosya tüm kilitler etkin olarak açılır: hangi görünümü ve sekmeyi kaydetmiş olursa olsun görünüm `100% · 0, 0` değerinde, sekme `ERD` olarak; dili, ad biçimleri ve tırnak türü ise kaydettiği gibi kilitlenir.
Diyagramın yerini alan bir `Import` işlemi de kilitleri belirler: Bir JSON dosyası kaydettiği kilitleri ve bunların tuttuğu değerleri getirir; bir SQL, DBML, AML veya GraphQL dosyası ise kilitlerinizi korur, ancak görünümü, kilitli olsun ya da olmasın, `100% · 0, 0` değerine geri getirir. [Dış dosyaları içe aktarma](./file-import-export.md#importing-external-files) bölümüne bakın. İçe aktarmayı geri almak, içe aktarmanın yerini aldığı kilitleri ve kilitli değerleri geri getirir.

Bir kilidin dosyanın dışında tuttuğu değişiklik, değişiklik sayılmaz. VS Code sekmeyi değiştirilmiş olarak işaretlemez; Obsidian ve bir JetBrains IDE'si de hem kendiliğinden kaydettiklerinde hem de sekme kapandığında dosyayı olduğu gibi bırakır.
Bu nedenle tüm kilitler etkinken bir diyagramda gezinmek, sekme değiştirmek ve başka bir dil, ad biçimi ya da tırnak denemek `git diff` çıktısında hiçbir zaman görünmez.
`Viewport` kilidi devre dışıyken kaydırma ve yakınlaştırma dosyayı değiştirir; `Canvas Type` kilidi devre dışıyken Ayarlar sekmesine geçmek dahil sekme değiştirmek de öyle.
Yeni bir diyagramın boş dosyası, dosyanın koruduğu ilk değişikliğe kadar boş kalır: bir düzenleme, hiçbir kilidin tutmadığı bir ayarda yapılan değişiklik veya bir kilidin etkinleştirilmesi ya da devre dışı bırakılması.
Bir diyagramı açıp böyle bir değişiklik yapmadan kapatmak, dosyayı hangi sürüm veya makine yazmış olursa olsun onu olduğu gibi bırakır. Dosya yalnızca diyagramın ne olduğunu sabit bir sırayla tutar ve eski bir biçimde kaydedilmiş bir dosya, bu türden ilk değişikliğinde bir kez bu biçimde yeniden yazılır. [Depolama biçimi ve çalışma zamanı değeri](../../api/advanced/schema.md#storage-form-and-runtime-value) bölümüne bakın.
VS Code'da, bir Git revizyonu veya bir Local History kaydı gibi `Reopen Editor With...` ile diyagram olarak yeniden açılan bir revizyon salt okunurdur ve hiçbir zaman değiştirilmiş olarak işaretlenmez.
Google Drive'da bir kaydırma, bir yakınlaştırma veya başka bir sekmeye geçiş, kilitli olsun ya da olmasın, hiçbir zaman tek başına kaydedilmez. `Viewport` kilidi devre dışıyken görünüm yalnızca başka bir değişiklikle birlikte yazılır; bu nedenle bir Drive dosyası, görünümün son kayıttaki konumunda açılır. `Canvas Type` kilidi devre dışıyken sekme için de aynısı geçerlidir.

Bir [ortak düzenleme oturumunda](../../api/advanced/collaborative-editing.md) bir kilidi etkinleştirmek veya devre dışı bırakmak her düzenleyiciye ulaşır ve kilit, onu etkinleştiren düzenleyicinin değerini korur.
`Language` kilidini, bir ad biçimi kilidini veya `Bracket Type` kilidini devre dışı bırakmak, her düzenleyiciye kilidi devre dışı bırakan düzenleyicide gösterilen değeri verir; böylece hepsi tek bir değer kaydeder. `Viewport` veya `Canvas Type` kilidini devre dışı bırakmak kimsenin görünümünü ya da sekmesini değiştirmez.
MCP sunucusu üzerinden çalışan bir kodlama ajanının kilitler veya kilitlerin tuttuğu ayarlar için bir aracı yoktur ve ajan kilitli bir dili, ad biçimini veya tırnak türünü dosyanın koruduğu değerle okur. Bunlara, bir `Import` işleminin yaptığı gibi, yalnızca ajanın `replace` modundaki içe aktarmaları ulaşır. [Ayarlar](../../mcp/tools.md#settings) ve [İçe aktarma](../../mcp/tools.md#import) bölümlerine bakın.

## Sütun sırasını ayarlama {#adjusting-column-order}

Tablolardaki sütunların görüntülenme sırasını belirler.
Bir satırı taşımak için sürükleyin – satırın tamamı sürüklenebilir ve tutamaç simgesi de bunu işaret eder. Varsayılan sıralarıyla yedi satır şunlardır: `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` ve `Comment`.
Bir [tablo görünüm seçeneğiyle](./table-related-functions.md#table-view-options) gizlenen bir hücre listedeki yerini korur; bu nedenle sıra, hangi hücreler gösteriliyorsa onlara uygulanır.
[Alternatif anahtar](./table-related-functions.md#alternate-keys) işareti (`AK1.1` vb.) bu satırlardan biri değildir. Bu işaret bir satırda her zaman en sonda, bu sıranın en sona koyduğu hücre hangisiyse onun ardından yer alır.

![Column Order bölümüne kadar aşağı kaydırma ve Comment satırını yukarıya, Name satırının altına sürükleyerek her açıklamayı kendi sütun adının hemen ardına koyma](/img/demo-settings-column-order.webp)

## Kısayollar {#shortcuts}

`Shortcuts` sekmesi, `Command` ve `Keybinding` sütunlarından oluşan salt okunur bir tablodur ve kullandığınız platformun tuş bağlamalarını listeler.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T`, ardından `G` | `T`, ardından `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Bunların çoğu yalnızca ERD sekmesinde çalışır ve Hızlı arama, Tablo özellikleri, Fark görüntüleyici, Otomatik düzenin önizlemesi, Zaman yolculuğu, [`Export image`](./file-import-export.md#image) iletişim kutusu veya [`Map Columns`](./relationship-editing.md#map-columns) iletişim kutusu açıkken devre dışı kalır.
İstisnalar `Search`, `Toggle Explorer` ve `Stop` kısayollarıdır: `Search` her sekmede Hızlı aramayı açıp kapatır, `Toggle Explorer` her sekmede [Gezgini](./explorer.md#opening-and-closing) arama alanına odaklanmış olarak açar ve ERD sekmesine geçer; `Stop` ise Hızlı aramayı, Tablo özelliklerini, Fark görüntüleyiciyi, Otomatik düzenin önizlemesini, Zaman yolculuğunu, `Export image` iletişim kutusunu, `Map Columns` iletişim kutusunu, tema oluşturucuyu, `Display Language` seçicisini, renk seçiciyi ve açık bir bağlam menüsünü kapatan kısayoldur.
Gezgin ERD sekmesinde açıkken ve Zen moduyla gizlenmemişken `Toggle Explorer`, araç çubuğundaki `Explorer` düğmesinin yaptığı gibi Gezgini yeniden kapatır. Hızlı arama, Tablo özellikleri, tema oluşturucu, `Display Language` seçicisi, `Export image` iletişim kutusu veya `Map Columns` iletişim kutusu açıkken bunun yerine açık olanı kapatır ve klavye odağını Gezginin arama alanına taşır.
Bir hücre, bir not veya bir tablo grubunun adı düzenlenirken `Toggle Explorer` hiçbir şey yapmaz. Fark görüntüleyici, Otomatik düzenin önizlemesi veya Zaman yolculuğu açıkken tuşunu tarayıcıya veya ana uygulamaya bırakır. [Tarayıcının bulma çubuğu](./find-and-replace.md#the-browsers-find-bar) bölümüne bakın.
ERD sekmesinde `Stop`, açık bir hücre veya not düzenleyicisini sonlandırır, bir [tablo grubunun](./table-groups.md) ad alanını grubu yeniden adlandırmadan kapatır ya da çizilmekte olan bir ilişkiyi veya `New Table Group` çizimini iptal eder ve seçimi olduğu gibi bırakır. Bunların hiçbiri açık değilse seçimi ve odaktaki hücreyi temizler ve aynı basışta açık bir renk seçiciyi de kapatır. Açık bir tema oluşturucu veya `Display Language` seçicisi her iki durumda da aynı basışta kapanır.
Açık bir Gezgin, tema oluşturucu veya `Display Language` seçicisi tuvaldeki kısayolların hiçbirini engellemez. `Stop` Gezgini hiçbir zaman kapatmaz. `Stop` ve diğer tuşların Gezginin içinde ne yaptığı için [Gezgindeki tuşlar](./explorer.md#keys-in-the-explorer) bölümüne, seçicinin içinde ne yaptığı için [Dil seçme](./language-and-theme.md#picking-a-language) bölümüne bakın.
`Delete Selection` seçili her tabloyu, notu ve tablo grubunu kaldırır; tek bir tablo bazı sütunlarıyla birlikte seçiliyse ve yakınlaştırma `70%` değerinin üzerindeyse bunun yerine o sütunları kaldırır. [Tablo ve not silme](./table-related-functions.md#table-and-memo-deletion) bölümüne bakın. `Remove Table, Memo` seçili tablo gruplarını da kaldırır.
`Add Table Group`, bir [`New Table Group`](./table-groups.md#drawing-a-group) çizimini [tuval araç çubuğundaki](./table-related-functions.md#canvas-toolbar) `New Table Group` düğmesinin yaptığı gibi başlatır; ikinci bir basış çizimi iptal eder. `Group Selected Tables`, değiştirici tuş olmadan yapılan iki basıştır: `T` tuşundan sonra bir saniye içinde `G`. Bir tablonun bağlam menüsündeki `Group selected tables` öğesinin yaptığı gibi seçili tabloları yeni bir gruba koyar ve grubun ad alanını açar; hiçbir tablo seçili değilse hiçbir şey yapmaz. [Seçili tabloları gruplama](./table-groups.md#grouping-selected-tables) bölümüne bakın. İkisi de salt okunur bir düzenleyicide veya gruplar [gizliyken](./table-groups.md#hiding-groups) hiçbir şey yapmaz.
`Zoom In`, `Zoom Out` ve `Zoom Reset`, Hızlı arama açık olmadığı sürece [Görselleştirme](./visualization.md#toolbar) sekmesinde de hem `Graph` hem `Flow` modunda yakınlaştırma düzeyini değiştirir.
Görselleştirme sekmesinde `Stop`, [satır görünümü](./visualization.md#row-display) menüsünü de kapatır ve hâlâ sürmekte olan bir [Akış modu yerleşimini](./visualization.md#how-flow-is-placed) iptal eder; `Focus on this table` ile daraltılmış bir görünümü ise genişletmez.
`Focus on this table`, Görselleştirme sekmesini seçili tablolara ve bunlara tek bir ilişkiyle bağlı her tabloya daraltılmış olarak `Flow` modunda açar; hiçbir tablo seçili değilse hiçbir şey yapmaz. [Tablolara odaklanma](./visualization.md#focusing-on-tables) bölümüne bakın.
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` ve `Group Selected Tables` metin imlecine öncelik tanır: Bir hücreyi veya notu düzenlerken ya da Gezginin Bul alanı gibi bir metin alanına yazarken `Ctrl + A` (Windows/Linux) veya `⌘ + A` (Mac) metni seçer, `Space` bir boşluk yazar, `Delete` ve `Backspace` metni siler, `T`, ardından `G` de bu iki harfi yazar.
Kopyalama ve yapıştırma, tarayıcının kendi `Ctrl + C` ve `Ctrl + V` (Windows/Linux) veya `⌘ + C` ve `⌘ + V` (Mac) kısayollarıdır; bu nedenle bu listede yer almaz. [Tablo düzenleme](./table-editing.md) sayfasına bakın.

Tuş bağlamaları bu sekmeden değiştirilemez.
Düzenleyiciyi gömen bir ana uygulama bunları [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) yöntemiyle yeniden bağlar; sabit olan `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` ve `Zoom Reset` bunun dışındadır.
Bu durumda `Shortcuts` sekmesi ana uygulamanın bağlamalarını listeler: Ana uygulamanın yeniden bağlamadığı bir komut varsayılan bağlamasını korur, hiçbir tuşa bağlamadığı bir komut ise hiçbir tuş göstermez.

Obsidian'da diyagramın Obsidian sekmesi etkin olduğu sürece bu tuşlar, `Alt + Enter`, `Ctrl + K` ve `Ctrl + F` (Windows/Linux) veya `⌥ + Enter`, `⌘ + K` ve `⌘ + F` (Mac) gibi bir Obsidian kısayol tuşunun aynı tuşu kullandığı durumlarda bile düzenleyiciye ulaşır. Diğer tüm Obsidian kısayol tuşları orada çalışmaya devam eder. `Ctrl + F` veya `⌘ + F` için [Tarayıcının bulma çubuğu](./find-and-replace.md#the-browsers-find-bar) bölümüne bakın.
