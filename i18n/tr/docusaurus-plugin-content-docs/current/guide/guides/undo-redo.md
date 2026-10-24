---
sidebar_position: 15
description: Düzenlemeleri geri alma ve yineleme, geçmişin kaydettikleri, Sözlük sayfalarının kendi geçmişleri ve Zaman yolculuğu ile diyagramın geçmişinde adım adım ilerleme.
---

# Geri al, yinele

Önceki bir düzenleme durumuna geri dönebilir veya sonraki bir duruma ilerleyebilirsiniz.  
Geçmiş en fazla `2048` değişiklik tutar.

- Geri al: `Ctrl + Z` (Windows/Linux) veya `⌘ + Z` (Mac)
- Yinele: `Ctrl + Shift + Z` (Windows/Linux) veya `⌘ + Shift + Z` (Mac)

ERD sekmesinde araç çubuğu aynı iki komutu `Time Travel` düğmesinin yanında `Undo` ve `Redo` düğmeleri olarak sunar. Sözlük sekmesinde `Undo` ve `Redo` düğmelerini `Time Travel` olmadan gösterir; başka hiçbir sekme bunları göstermez.  
Bu düğmeler yalnızca geri alınacak veya yinelenecek bir şey olduğunda etkinleşir. `readonly` bir düzenleyici bunları gizler ve kısayollar hiçbir şeyi geri almaz ya da yinelemez.

Geri al ve Yinele yalnızca ERD sekmesinde diyagramın geçmişi üzerinde çalışır.  
Orada Hızlı arama, `Table Properties`, `Diff Viewer`, `Auto Layout` önizlemesi, [`Export image`](./file-import-export.md#image) iletişim kutusu, [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusu veya Zaman yolculuğu açıkken kısayollar çalışmaz.  
Klavye odağı, ağacı da dahil [Gezginin](./explorer.md#keys-in-the-explorer) herhangi bir yerindeyken ve [renk seçici](./table-related-functions.md#table-and-memo-color-specification) açıkken çalışmaya devam ederler. Metin imleci Bul, Değiştir veya `Hex` gibi bunların alanlarından birindeyken bile kısayollar alandaki metni değil, diyagramı geri alır ve yineler.

Diğer sekmelerde:

- Sözlük: Kısayollar gösterilen `Domains`, `Words` veya `Terms` sayfasının düzenlemelerini, hiçbir zaman diyagramın geçmişinden değil, o sayfanın kendi geçmişinden geri alır ve yineler. `Checks` sayfasında hiçbir şey yapmazlar. [Sözlük sayfaları](#dictionary-sheets) bölümüne bakın.
- Görselleştirme: `Flow` modunda aynı tuşlar, `Previous table` ve `Next table` düğmelerinin yaptığı gibi, `readonly` bir düzenleyicide de Akış modunun gösterdikleri arasında bir adım geri ve ileri gider. Orada diyagramı asla geri almaz ya da yinelemezler. [Önceki tablo ve sonraki tablo](./visualization.md#previous-table-and-next-table) bölümüne bakın. `Graph` modunda hiçbir şey yapmazlar.
- Şema SQL, Kod oluşturucu ve Ayarlar: Kısayollar kullanılamaz. Şema SQL sekmesinin `Before tables` ve `After tables` alanlarında ise aynı tuşlar bunun yerine alana yazdıklarınızı geri alır ve yineler.

Geçmiş, geçerli oturum boyunca bellekte tutulur. Belgeye kaydedilmez; bu nedenle yeniden açılan bir diyagram boş bir geçmişle başlar.

![Bir tabloyu taşıma ve ⌥ + Backspace ile bir sütunu kaldırma, ardından ikisini ⌘ + Z ile geri alma ve ⌘ + Shift + Z ile yineleme](/img/demo-undo-redo.webp)

## Geçmişin kaydettikleri {#what-the-history-records}

Kaydedilenler:

- Tablolar ve notlar: ekleme, kaldırma, taşıma ve renk; bir tablonun adı, mantıksal adı ve açıklaması; bir notun metni ve boyutu.
- Tablo grupları: ekleme, kaldırma, taşıma, yeniden boyutlandırma, ad, renk ve her tablonun hangi grupta olduğu. [Tablo grupları](./table-groups.md) sayfasına bakın.
- Sütunlar: ekleme, kaldırma, yeniden sıralama, mantıksal ad, her birinin bağlı olduğu değer alanı ve her sütun seçeneği.
- Sözlüklerin türettiği fiziksel adlar ve her adın kendi yazdığınız ad mı yoksa sözlüklere ait mi olduğu: Tek bir geri alma, bir adı ve bu durumu birlikte geri getirir. [Kendi yazdığınız adlar](./dictionary.md#names-of-your-own) bölümüne bakın.
- `Derive Physical Name Again` ve `Derive Physical Names Again`. [Fiziksel adları yeniden türetme](./dictionary.md#derive-physical-names-again) bölümüne bakın.
- İlişkiler: ekleme, kaldırma, tür değişikliği, [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusunda belirlenen sütunlar ve `On Delete` veya `On Update` öğesinden yapılan her seçim. [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) bölümüne bakın. Bir kaldırmayı geri almak, ilişkiyi ON DELETE ve ON UPDATE eylemleriyle birlikte geri getirir.
- Dizinler ve sütunları.
- Görünüm konumu, yakınlaştırma düzeyi ve `View Option` aç/kapat düğmeleri.
- Şema SQL sekmesindeki `Before tables` ve `After tables` betikleri, alandan çıkarak uyguladığınız her düzenleme için bir adım. [Önceki ve sonraki betikler](./schema-sql.md#before-and-after-scripts) bölümüne bakın.
- Bir dosyayı içe aktarma ve [`Import and Add`](./file-import-export.md#import-and-add) ile bir dosya ekleme.

Kaydedilmeyenler:

- Veritabanı sistemi ve veritabanı adı.
- Kod oluşturucu dili, `Table Name Case` ve `Column Name Case`.
- Tırnak türü, ister Şema SQL sekmesinde ister Kod oluşturucu sekmesinde ayarlanmış olsun.
- Şema SQL sekmesindeki, düzenleyici penceresine ait olan `Statements`, `Header`, `Write logical names into empty comments` ve `Tables` seçimleri. [Seçenekler paneli](./schema-sql.md#options-panel) bölümüne bakın.
- [`Lock`](./settings.md#lock) satırları dahil, Ayarlar sekmesindeki her şey.
- Hangi yerden yapılırsa yapılsın ve kilidi etkin olsun ya da olmasın, Ad görünümünü değiştirme. [Görünümü değiştirme](./logical-names.md#switching-the-view) bölümüne bakın.
- Tema ve görüntüleme dili. [Dil ve tema](./language-and-theme.md) sayfasına bakın.
- Hangi tablonun, notun veya grubun diğerlerinin önünde çizildiği.
- [Gezgin](./explorer.md): onu açma, kapatma veya yeniden boyutlandırma, ağacını daraltma, arama metni ve seçenekleri. Ancak `Replace` ve `Replace All` düğmelerinin yaptığı değişiklikler ve bir atlamanın yaptığı kaydırma kaydedilir. [Tek hareket, tek adım](#one-gesture-one-step) bölümüne bakın.
- Görselleştirme sekmesinde her iki modda yakınlaştırma ve kaydırma, graf düğümlerini veya Akış modu kartlarını taşıma, `Tidy Up`, satır görünümü, tablolara odaklanma ve `Previous table` ile `Next table` düğmeleriyle adım adım ilerleme. [Akış modu belgeyi asla düzenlemez](./visualization.md#flow-never-edits-the-document) bölümüne bakın.
- Sözlük sekmesinde gösterilen sayfa ve her sayfanın araması, seçimi, kaydırma konumu ve sütun genişlikleri. [Sekmeyi açma](./dictionary.md#opening-the-tab) bölümüne bakın.

Bunlardan herhangi birinde yapılan değişiklik geri alınamaz.

Sözlük sekmesinde yapılan düzenlemeler geri alınabilir, ancak bu geçmişe değil kendi sayfalarının geçmişine girer; bu nedenle ERD sekmesindeki Geri al bunların hiçbirini, bir değer alanının yeni `Data Type` değerini ve bunun değiştirdiği sütun türlerini bile asla geri almaz. [Sözlük sayfaları](#dictionary-sheets) bölümüne bakın.

Başka bir düzenleyiciden gelen değişiklikler de kaydedilmez; bu nedenle Geri al yalnızca kendi değişikliklerinizi geri alır. Bir [ortak düzenleme oturumunda](../../api/advanced/collaborative-editing.md) her düzenleyici kendi değişikliklerini geri alır, [MCP sunucusu](../../mcp/live-and-headless.md#undo) üzerinden düzenleme yapan bir kodlama ajanı da kendi değişikliklerini `erd_undo` aracıyla geri alır.

Diyagramın tamamının yerini alan bir `Import` işlemini geri almak, önceki diyagramı içe aktardığınız anda düzenleyicide bulunduğu hâliyle geri getirir; her [kilit](./settings.md#lock) o zamanki gibi etkin ya da devre dışı, her kilitli değer de o zamanki gibi olur.  
O diyagramda `Viewport` kilitliyse görünüm ve yakınlaştırma, bulunduğunuz yere değil, diyagramın açıldığı kilitli görünüme döner. `Viewport` kilidi devre dışıysa içe aktardığınız sırada bulunduğunuz yere dönerler. Bulunduğunuz sekme, Kod oluşturucu dili veya Ad görünümü gibi diğer kilitli ayarlar ekranınızda oldukları gibi kalır.  
Yeni bir diyagram tüm kilitler etkin olarak başlar. Böyle bir geri almada görünümünüzü korumak için içe aktarmadan önce `Viewport` kilidini açın. Kilidi sonradan açmak veya kendi `Viewport` kilidi devre dışı olan bir JSON dosyasını içe aktarmak, geri almanın sizi götürdüğü yeri değiştirmez.

Bir JSON dosyasının içe aktarılmasını geri almak, önceki diyagramın sahip olduğu sözcükleri, terimleri ve değer alanlarını da geri getirir. Bir Şema SQL, GraphQL, DBML veya AML içe aktarma işlemi sözlükleri korur; bu nedenle bu işlemi geri almak ve yinelemek, o zamandan beri Sözlük sekmesinde yapılan düzenlemeler dahil, sözlükleri oldukları gibi bırakır.

ERD sekmesinde bir sütunu yeniden bir değer alanına bağlayan veya bir değer alanına bağlı bir sütunu geri getiren bir geri alma ya da yineleme, sütuna değer alanının şu anki veri türünü verir. Bağlı bir sütuna başka bir türü geri koyan bir geri alma ya da yineleme ise sütunun bağlantısını kaldırır. [Değer alanları ve veri türleri](./dictionary.md#domains-and-data-types) bölümüne bakın.

## Tek hareket, tek adım {#one-gesture-one-step}

Tek bir hareketin tetiklediği her şey tek bir geçmiş kaydı olur.  
Birkaç tabloyu ve notu aynı anda yapıştırmak ya da bunları `Alt + drag` ile çoğaltmak tek adımda geri alınır.

`Delete` veya `Backspace` tuşuna bir kez basmak ya da bir bağlam menüsündeki `Delete selected` veya `Delete columns` öğesini seçmek, kaç tablo, not, tablo grubu veya sütun kaldırırsa kaldırsın tek bir adımdır.  
Seçili birkaç sütunda birincil anahtarı açmak ya da kapatmak, ister `Alt + K` (Windows/Linux) veya `⌥ + K` (Mac) tuşlarıyla ister bir tablonun bağlam menüsündeki `Primary Key on selected columns` öğesiyle yapılsın, tek bir adımdır.  
Seçimin rengini ayarlamak ya da `No color` veya `Remove color` ile temizlemek, kaç tablo, not ve grup seçili olursa olsun tek bir adımdır. Seçili her şeyin zaten sahip olduğu bir rengi seçmek hiçbir adım kaydetmez; seçili hiçbir öğenin rengi yokken `No color` da kaydetmez.  
[Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusundaki `Map` veya `Save` düğmesi, eklediği yabancı anahtar sütunları ve değiştirdiği veri türleriyle birlikte tek bir adımdır.  
`Import and Add` öğesi, eklenen bloğun görünmesi için kaydırma gerektiğinde bu kaydırmayla birlikte tek bir adımdır.

Bir mantıksal ad hücresinin altındaki listeden bir terim seçmek tek bir adımdır: mantıksal ad, onun türettiği fiziksel ad ve bir sütun için terimin değer alanı ile veri türü. [Terim adlarını tamamlama](./logical-names.md#completing-term-names) bölümüne bakın.  
Bir sütunun değer alanı hücresinde bir değer alanı seçmek, sütuna verdiği veri türü ve [İlişkilerde veri türü eşitleme](./settings.md#relationship-datatype-sync) ayarının ilişkiler boyunca taşıdıklarıyla birlikte tek bir adımdır. Sütunun bağlantısını kaldıran `None` seçeneğini seçmek de tek bir adımdır. [Değer alanı hücresi](./logical-names.md#the-domain-cell) bölümüne bakın. Bağlı bir sütuna değer alanınınkinden farklı bir veri türü yazmak, o girişin adımında sütunun bağlantısını kaldırır.  
`Derive Physical Name Again` veya `Derive Physical Names Again`, kaç ad, değer alanı bağlantısı ve veri türü değiştirirse değiştirsin tek bir adımdır. Yalnızca hiçbir şeyi değiştirmediğinde adım kaydetmez. Kendi yazdığınız bir adı yeniden sözlüklere bırakmak, ad sözlüklerin verdiğini zaten içerse bile bir değişikliktir.

Bir [tablo grubunu](./table-groups.md) çizerek ya da seçili tabloları `Group selected tables` öğesiyle veya `T`, ardından `G` ile gruplayarak oluşturmak, içine aldığı her tabloyla birlikte tek bir adımdır. Bir grubu kaldırmak tek bir adımdır ve bunu geri almak grubu içindeki tablolarla birlikte geri getirir.  
Bir grubu başlık çubuğundan sürüklemek, grubu ve tüm tablolarını tek adımda taşır. Bir grubun içine veya dışına bırakılan tabloların grup değişikliği, son hareketten sonraki yaklaşık `200ms` içinde bıraktığınızda sürüklemeyle aynı adımda gerçekleşir; böylece tek bir geri alma tabloları eski yerlerine ve eski gruplarına geri getirir. Bırakmadan önce daha uzun bir duraklama olursa grup değişikliği kendi başına bir adım olur ve ilk geri alma yalnızca onu geri alır.  
Bir grubu bir kenarından veya köşesinden yeniden boyutlandırmak, bıraktığınızda bir kez kaydedilir.  
[Otomatik düzeni](./table-related-functions.md#auto-layout) uygulamak, tablolarının çevresine sığdırdığı gruplar dahil tek bir adımdır.

[Bul ve değiştir](./find-and-replace.md#replacing) içindeki `Replace All` düğmesi de kaç tablo adı, sütun adı, mantıksal ad, dizin adı, tablo grubu adı, açıklama ve not değiştirirse değiştirsin, mantıksal adların türettiği fiziksel adlar ve değer alanı bağlantıları dahil tek bir adımdır. Hiçbir şeyi değiştirmediğinde, örneğin `Preserve Case` her eşleşmeyi eski hâliyle geri yazdığında, adım kaydetmez.  
Tek bir `Replace` işlemi, bir mantıksal adın türettikleri ve sonraki eşleşme kaydırma gerektirdiğinde ona yapılan kaydırma dahil tek bir adımdır. Eşleşmesini eski hâliyle geri yazdığında yalnızca bu kaydırmayı kaydeder; kaydırma yoksa hiçbir şey kaydetmez.  
Bir eşleşmeye gitmek, tuvali yalnızca eşleşme zaten iyi görünmüyorsa kaydırır. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın. Bu kaydırma, görünüm konumundaki diğer her değişiklik gibi kaydedilir; bu nedenle eşleşmeler arasında gezindikten sonra Geri al önce bu kaydırmaları, her adımda bir tane olmak üzere geri alır.  
Tuvalde sonlanan diğer atlamalar da kaydırmalarını aynı şekilde kaydeder: Gezginde bir satırı, bir Hızlı arama sonucunu, Sözlük sekmesindeki `Checks` sayfasında bir tabloyu veya sütunu belirten bir denetimi ya da Akış modundaki dış bağlantı [kart düğmesini](./visualization.md#card-buttons) seçmek. Görünümü olduğu yerde bırakan bir atlama hiçbir şey kaydetmez. `Diff Viewer` listesinde bir satır seçmek de yalnızca Fark görüntüleyicinin kendi salt okunur taraflarını hareket ettirdiği için hiçbir şey kaydetmez.

Kesintisiz bir sürükleme, tuval kaydırma, yakınlaştırma, kıstırma hareketi veya renk değişikliği de yaklaşık `200ms` boyunca arabelleğe alınır ve tek bir kayıt olarak işlenir.  
Toplamda `20px` altında hareket eden bir sürükleme hiçbir taşıma kaydetmez. Varsa yalnızca yaptığı grup değişikliği kaydedilir.

Bir hücreye veya nota yazmak hareket başına değil, giriş başına kaydedilir: Yazılan her karakter, her yapıştırma ve bir IME birleştirmesinin her adımı ayrı bir adımdır.  
Bir mantıksal ad hücresi de aynı şekilde kaydedilir. Düzenleyicisi açıldığındakinden farklı bir mantıksal adla kapandığında, sözlüklerin bu addan türettiği fiziksel ad, yazdıklarınızdan sonra bir adım daha olur. İlk geri alma yalnızca bu adı, bir terimin getirdiği değer alanı ve veri türüyle birlikte geri alır ve yazdığınız mantıksal adı bırakır. Hiçbir şey türetilmediğinde başka bir şey kaydedilmez. [Mantıksal ad yazma](./logical-names.md#writing-a-logical-name) bölümüne bakın.  
Bir tablo grubunun adı, `Enter` tuşu veya alandan çıkmak onu kaydettiğinde geçmişe bir kez işlenir; bu nedenle yeni oluşturduğunuz bir gruba yazdığınız ad, grubu oluşturmaktan ayrı bir adımdır. `Esc` tuşu veya değiştirilmeden bırakılan bir ad hiçbir şey kaydetmez.

## Sözlük sayfaları {#dictionary-sheets}

Sözlük sekmesinin `Domains`, `Words` ve `Terms` sayfalarının her biri, diyagramınkinden ayrı olarak kendi geçmişini tutar. Sekmede yapılan her düzenleme, satırlarını yazdığı sayfanın geçmişine girer. Diyagramınki gibi her geçmiş en fazla `2048` adım tutar ve oturum boyunca bellekte kalır.

- Klavye odağı sekmedeyken `Ctrl + Z` (Windows/Linux) veya `⌘ + Z` (Mac) gösterilen sayfanın son düzenlemesini geri alır, `Ctrl + Shift + Z` (Windows/Linux) veya `⌘ + Shift + Z` (Mac) ise son geri alınanı yineler.
- Araç çubuğundaki `Undo` ve `Redo` aynısını yapar ve yalnızca gösterilen sayfada geri alınacak veya yinelenecek bir düzenleme olduğunda etkinleşir. Bunlara basmak klavye odağını olduğu yerde, ızgarada veya arama alanında bırakır. Sekmede `Time Travel` yoktur.
- Hiçbir şeyin düzenlenmediği `Checks` sayfasında düğmeler etkinleşmez ve ne düğmeler ne de tuşlar bir şey yapar.
- Bir hücre düzenlemesi açıkken veya metin imleci sekmenin arama alanındayken tuşlar bunun yerine oraya yazdıklarınızı geri alır ve yineler.

Geçmişler hiçbir zaman birbirine karışmaz. ERD sekmesindeki Geri al bir sayfanın düzenlemesini asla geri almaz; bir sayfanın Geri al komutu da başka bir sayfanın veya diyagramın düzenlemesini asla geri almaz. Siz sayfa veya sekme değiştirirken her sayfa kendi geçmişini korur.

Bunların her biri, sayfasının tek bir adımıdır:

- Yazılan her karakter için değil, yazıldığında bir kez ve yalnızca değeri değiştirdiğinde kaydedilen bir hücre düzenlemesi. [Hücreleri düzenleme](./dictionary.md#editing-cells) bölümüne bakın.
- Eklediği satırlar dahil bir yapıştırma ve seçili hücreleri `Delete` veya `Backspace` ile temizleme. [Kopyalama ve yapıştırma](./dictionary.md#copying-and-pasting) bölümüne bakın.
- `Add Row` ve çubuktan, ızgara menüsünden veya tuşlarla yapılan, kaç satırı kapsarsa kapsasın her satır ekleme ya da silme. [Satır ekleme ve silme](./dictionary.md#adding-and-deleting-rows) bölümüne bakın.
- Bir terimin listesinden seçilen değer alanı, `None` dahil. [Terimin değer alanı](./dictionary.md#a-terms-domain) bölümüne bakın.
- Bir sıralama. [Sıralama](./dictionary.md#sorting) bölümüne bakın.
- `Import CSV` ile içe aktarılan tek bir CSV dosyası, kaç satır eklerse ya da güncellerse güncellesin. Bu, hangi sayfadan içe aktarmış olursanız olun dosyanın doldurduğu ve sekmenin ardından gösterdiği sayfanın bir adımıdır. [İçe aktarma](./dictionary.md#importing) bölümüne bakın.

Aynı dosyanın yeniden içe aktarılması veya zaten o sırada olan bir sayfanın sıralanması gibi hiçbir şeyi değiştirmeyen bir yazma adım kaydetmez; `Nothing saved: …` bildirimiyle reddedilen bir yazma da kaydetmez. `Physical Name` değeri olmayan bir terime ad verildiğinde, sözcüklerinin oluşturduğu fiziksel ad o düzenlemenin adımına dahildir.

Bir değer alanının yeni `Data Type` değeri, değer alanına bağlı sütunlara verdiği türler ve İlişkilerde veri türü eşitleme ayarının bu sütunlardan ulaştıklarıyla birlikte `Domains` sayfasının tek bir adımıdır. [Değer alanları ve veri türleri](./dictionary.md#domains-and-data-types) bölümüne bakın.  
Bu adımı geri almak veya yinelemek, o anda değer alanına bağlı olan sütunların türünü yeniden belirler; bu nedenle o zamandan beri başka bir değer alanına bağladığınız veya türünü değiştirdiğiniz bir sütun kendi türünü korur. Adımın bağlantısını kaldırdığı bir sütun, örneğin kendi değer alanına bağlıyken eşitlemenin bu bağlantısını kaldırdığı bir yabancı anahtar, yalnızca hâlâ bağlantısızsa ve adımın ona bıraktığı türü hâlâ taşıyorsa yeniden bağlanır.

`readonly` bir düzenleyici düğmeleri gizler ve tuşlar hiçbir şeyi geri almaz ya da yinelemez.  
Ortak çalışanlardan ve kodlama ajanlarından gelen değişiklikler de bir sayfanın geçmişine kaydedilmez.

Sözlüklerin yerini başkaları aldığında her sayfanın geçmişi boşaltılır: sizin veya bir ortak çalışanın bir JSON dosyasıyla yaptığı `Import` işlemiyle, bu işlemin geri alınması veya yinelenmesiyle ve düzenleyiciye başka bir diyagram yüklenmesiyle. Bir Şema SQL, GraphQL, DBML veya AML `Import` işlemi sözlükleri ve onlarla birlikte her sayfanın geçmişini, geri alınması ve yinelenmesi boyunca da korur.

## Zaman yolculuğu {#time-travel}

Araç çubuğunda, ERD sekmesindeki Geri al ve Yinele düğmelerinin yanında bulunan `Time Travel` düğmesinden açılır.  
Diyagramın geçmişinde en az bir kaydedilmiş değişiklik olana kadar düğme hiçbir şey yapmaz.

Zaman yolculuğu, `Viewport` veya `Name View` kilidi etkin olsun ya da olmasın, diyagramın ayrı ve salt okunur bir kopyasını tuvalin gösterdiği kaydırma konumunda, yakınlaştırma düzeyinde ve [Ad görünümünde](./logical-names.md#name-view) açar.  
Yalnızca diyagramın geçmişinde ilerler; bu nedenle Sözlük sayfalarındaki düzenlemeler noktaları arasında yer almaz.  
Düzenleme geçmişinin tamamında ilerlemek ve her noktayı önizlemek için kaydırıcıyı sürükleyin veya kaydırıcı yolunun herhangi bir yerine tıklayın. Kaydırıcının en sol konumu, ilk kaydedilen değişiklikten bir adım önceki durumdur; kaydırıcı, tutamaç geçerli durumdayken açılır.  
Önizleme etkileşimsizdir: Bir mini harita çizer, ancak içinde gezinemez, onu kaydıramaz veya düzenleyemezsiniz ve uygulayana kadar gerçek belge olduğu gibi kalır.

Seçili noktayı geri yüklemek için `Apply` düğmesine, belgeyi değiştirmeden bırakmak için `Cancel` düğmesine veya `Esc` tuşuna basın.

![Zaman yolculuğunu açma, kaydırıcıyı oturum boyunca geriye sürükleme ve önceki bir noktayı uygulama](/img/demo-time-travel.webp)
