---
sidebar_position: 13
description: Düzenlemeleri geri alma ve yineleme, geçmişin kaydettikleri ve Zaman yolculuğu ile geçmişte adım adım ilerleme.
---

# Geri al, yinele

Önceki bir düzenleme durumuna geri dönebilir veya sonraki bir duruma ilerleyebilirsiniz.  
Geçmiş en fazla `2048` değişiklik tutar.

- Geri al: `Ctrl + Z` (Windows/Linux) veya `⌘ + Z` (Mac)
- Yinele: `Ctrl + Shift + Z` (Windows/Linux) veya `⌘ + Shift + Z` (Mac)

Araç çubuğu aynı iki komutu `Time Travel` düğmesinin yanında `Undo` ve `Redo` düğmeleri olarak sunar.  
Bu düğmeler yalnızca geri alınacak veya yinelenecek bir şey olduğunda etkinleşir. `readonly` bir düzenleyici üçünü de gizler ve kısayollar hiçbir şey yapmaz.

Geri al ve Yinele yalnızca ERD sekmesinde çalışır. Görselleştirme, Şema SQL, Kod oluşturucu ve Ayarlar sekmelerinde kullanılamazlar. Şema SQL sekmesinin `Before tables` ve `After tables` alanlarında ise aynı tuşlar bunun yerine alana yazdıklarınızı geri alır ve yineler.  
Hızlı arama, `Table Properties`, `Diff Viewer`, `Auto Layout` önizlemesi, [`Export image`](./file-import-export.md#image) iletişim kutusu, [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusu veya Zaman yolculuğu açıkken kısayollar da çalışmaz.  
Klavye odağı, ağacı da dahil [Gezginin](./explorer.md#keys-in-the-explorer) herhangi bir yerindeyken ve [renk seçici](./table-related-functions.md#table-and-memo-color-specification) açıkken çalışmaya devam ederler. Metin imleci Bul, Değiştir veya `Hex` gibi bunların alanlarından birindeyken bile kısayollar alandaki metni değil, diyagramı geri alır ve yineler.

Geçmiş, geçerli oturum boyunca bellekte tutulur. Belgeye kaydedilmez; bu nedenle yeniden açılan bir diyagram boş bir geçmişle başlar.

![Bir tabloyu taşıma ve ⌥ + Backspace ile bir sütunu kaldırma, ardından ikisini ⌘ + Z ile geri alma ve ⌘ + Shift + Z ile yineleme](/img/demo-undo-redo.webp)

## Geçmişin kaydettikleri {#what-the-history-records}

Kaydedilenler:

- Tablolar ve notlar: ekleme, kaldırma, taşıma, renk, ad ve açıklama, not metni ve boyutu.
- Tablo grupları: ekleme, kaldırma, taşıma, yeniden boyutlandırma, ad, renk ve her tablonun hangi grupta olduğu. [Tablo grupları](./table-groups.md) sayfasına bakın.
- Sütunlar: ekleme, kaldırma, yeniden sıralama ve her sütun seçeneği.
- İlişkiler: ekleme, kaldırma, tür değişikliği, [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusunda belirlenen sütunlar ve `On Delete` veya `On Update` öğesinden yapılan her seçim. [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) bölümüne bakın. Bir kaldırmayı geri almak, ilişkiyi ON DELETE ve ON UPDATE eylemleriyle birlikte geri getirir.
- Dizinler ve sütunları.
- Görünüm konumu, yakınlaştırma düzeyi ve `View Option` aç/kapat düğmeleri.
- Şema SQL sekmesindeki `Before tables` ve `After tables` betikleri, alandan çıkarak uyguladığınız her düzenleme için bir adım. [Önceki ve sonraki betikler](./schema-sql.md#before-and-after-scripts) bölümüne bakın.
- Bir dosyayı içe aktarma ve [`Import and Add`](./file-import-export.md#import-and-add) ile bir dosya ekleme.

Kaydedilmeyenler:

- Veritabanı sistemi ve veritabanı adı.
- Kod oluşturucu dili, `Table Name Case` ve `Column Name Case`.
- Tırnak türü, ister Şema SQL sekmesinde ister Kod oluşturucu sekmesinde ayarlanmış olsun.
- Şema SQL sekmesindeki, düzenleyici penceresine ait olan `Statements`, `Header` ve `Tables` seçimleri. [Seçenekler paneli](./schema-sql.md#options-panel) bölümüne bakın.
- [`Lock`](./settings.md#lock) satırları dahil, Ayarlar sekmesindeki her şey.
- Tema ve görüntüleme dili. [Dil ve tema](./language-and-theme.md) sayfasına bakın.
- Hangi tablonun, notun veya grubun diğerlerinin önünde çizildiği.
- [Gezgin](./explorer.md): onu açma, kapatma veya yeniden boyutlandırma, ağacını daraltma, arama metni ve seçenekleri. Ancak `Replace` ve `Replace All` düğmelerinin yaptığı değişiklikler ve bir atlamanın yaptığı kaydırma kaydedilir. [Tek hareket, tek adım](#one-gesture-one-step) bölümüne bakın.
- Görselleştirme sekmesinde her iki modda yakınlaştırma ve kaydırma, graf düğümlerini veya Akış modu kartlarını taşıma, `Tidy Up`, satır görünümü ve tablolara odaklanma. [Akış modu belgeyi asla düzenlemez](./visualization.md#flow-never-edits-the-document) bölümüne bakın.

Bunlardan herhangi birinde yapılan değişiklik geri alınamaz.

Başka bir düzenleyiciden gelen değişiklikler de kaydedilmez; bu nedenle Geri al yalnızca kendi değişikliklerinizi geri alır. Bir [ortak düzenleme oturumunda](../../api/advanced/collaborative-editing.md) her düzenleyici kendi değişikliklerini geri alır, [MCP sunucusu](../../mcp/live-and-headless.md#undo) üzerinden düzenleme yapan bir kodlama ajanı da kendi değişikliklerini `erd_undo` aracıyla geri alır.

Diyagramın tamamının yerini alan bir `Import` işlemini geri almak, önceki diyagramı içe aktardığınız anda düzenleyicide bulunduğu hâliyle geri getirir; her [kilit](./settings.md#lock) o zamanki gibi etkin ya da devre dışı, her kilitli değer de o zamanki gibi olur.  
O diyagramda `Viewport` kilitliyse görünüm ve yakınlaştırma, bulunduğunuz yere değil, diyagramın açıldığı kilitli görünüme döner. `Viewport` kilidi devre dışıysa içe aktardığınız sırada bulunduğunuz yere dönerler. Bulunduğunuz sekme veya Kod oluşturucu dili gibi diğer kilitli ayarlar ekranınızda oldukları gibi kalır.  
Yeni bir diyagram tüm kilitler etkin olarak başlar. Böyle bir geri almada görünümünüzü korumak için içe aktarmadan önce `Viewport` kilidini açın. Kilidi sonradan açmak veya kendi `Viewport` kilidi devre dışı olan bir JSON dosyasını içe aktarmak, geri almanın sizi götürdüğü yeri değiştirmez.

## Tek hareket, tek adım {#one-gesture-one-step}

Tek bir hareketin tetiklediği her şey tek bir geçmiş kaydı olur.  
Birkaç tabloyu ve notu aynı anda yapıştırmak ya da bunları `Alt + drag` ile çoğaltmak tek adımda geri alınır.

`Delete` veya `Backspace` tuşuna bir kez basmak ya da bir bağlam menüsündeki `Delete selected` veya `Delete columns` öğesini seçmek, kaç tablo, not, tablo grubu veya sütun kaldırırsa kaldırsın tek bir adımdır.  
Seçili birkaç sütunda birincil anahtarı açmak ya da kapatmak, ister `Alt + K` (Windows/Linux) veya `⌥ + K` (Mac) tuşlarıyla ister bir tablonun bağlam menüsündeki `Primary Key on selected columns` öğesiyle yapılsın, tek bir adımdır.  
Seçimin rengini ayarlamak ya da `No color` veya `Remove color` ile temizlemek, kaç tablo, not ve grup seçili olursa olsun tek bir adımdır. Seçili her şeyin zaten sahip olduğu bir rengi seçmek hiçbir adım kaydetmez; seçili hiçbir öğenin rengi yokken `No color` da kaydetmez.  
[Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusundaki `Map` veya `Save` düğmesi, eklediği yabancı anahtar sütunları ve değiştirdiği veri türleriyle birlikte tek bir adımdır.  
`Import and Add` öğesi, eklenen bloğun görünmesi için kaydırma gerektiğinde bu kaydırmayla birlikte tek bir adımdır.

Bir [tablo grubunu](./table-groups.md) çizerek ya da seçili tabloları `Group selected tables` öğesiyle veya `T`, ardından `G` ile gruplayarak oluşturmak, içine aldığı her tabloyla birlikte tek bir adımdır. Bir grubu kaldırmak tek bir adımdır ve bunu geri almak grubu içindeki tablolarla birlikte geri getirir.  
Bir grubu başlık çubuğundan sürüklemek, grubu ve tüm tablolarını tek adımda taşır. Bir grubun içine veya dışına bırakılan tabloların grup değişikliği, son hareketten sonraki yaklaşık `200ms` içinde bıraktığınızda sürüklemeyle aynı adımda gerçekleşir; böylece tek bir geri alma tabloları eski yerlerine ve eski gruplarına geri getirir. Bırakmadan önce daha uzun bir duraklama olursa grup değişikliği kendi başına bir adım olur ve ilk geri alma yalnızca onu geri alır.  
Bir grubu bir kenarından veya köşesinden yeniden boyutlandırmak, bıraktığınızda bir kez kaydedilir.  
[Otomatik düzeni](./table-related-functions.md#auto-layout) uygulamak, tablolarının çevresine sığdırdığı gruplar dahil tek bir adımdır.

[Bul ve değiştir](./find-and-replace.md#replacing) içindeki `Replace All` düğmesi de kaç tablo adı, sütun adı, dizin adı, tablo grubu adı, açıklama ve not değiştirirse değiştirsin tek bir adımdır. Hiçbir şeyi değiştirmediğinde, örneğin `Preserve Case` her eşleşmeyi eski hâliyle geri yazdığında, adım kaydetmez.  
Tek bir `Replace` işlemi, sonraki eşleşme kaydırma gerektirdiğinde ona yapılan kaydırma dahil tek bir adımdır. Eşleşmesini eski hâliyle geri yazdığında yalnızca bu kaydırmayı kaydeder; kaydırma yoksa hiçbir şey kaydetmez.  
Bir eşleşmeye gitmek, tuvali yalnızca eşleşme zaten iyi görünmüyorsa kaydırır. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın. Bu kaydırma, görünüm konumundaki diğer her değişiklik gibi kaydedilir; bu nedenle eşleşmeler arasında gezindikten sonra Geri al önce bu kaydırmaları, her adımda bir tane olmak üzere geri alır.  
Tuvalde sonlanan diğer atlamalar da kaydırmalarını aynı şekilde kaydeder: Gezginde bir satırı, bir Hızlı arama sonucunu veya Akış modundaki dış bağlantı [kart düğmesini](./visualization.md#card-buttons) seçmek. Görünümü olduğu yerde bırakan bir atlama hiçbir şey kaydetmez. `Diff Viewer` listesinde bir satır seçmek de yalnızca Fark görüntüleyicinin kendi salt okunur taraflarını hareket ettirdiği için hiçbir şey kaydetmez.

Kesintisiz bir sürükleme, tuval kaydırma, yakınlaştırma, kıstırma hareketi veya renk değişikliği de yaklaşık `200ms` boyunca arabelleğe alınır ve tek bir kayıt olarak işlenir.  
Toplamda `20px` altında hareket eden bir sürükleme hiçbir taşıma kaydetmez. Varsa yalnızca yaptığı grup değişikliği kaydedilir.

Bir hücreye veya nota yazmak hareket başına değil, giriş başına kaydedilir: Yazılan her karakter, her yapıştırma ve bir IME birleştirmesinin her adımı ayrı bir adımdır.  
Bir tablo grubunun adı, `Enter` tuşu veya alandan çıkmak onu kaydettiğinde geçmişe bir kez işlenir; bu nedenle yeni oluşturduğunuz bir gruba yazdığınız ad, grubu oluşturmaktan ayrı bir adımdır. `Esc` tuşu veya değiştirilmeden bırakılan bir ad hiçbir şey kaydetmez.

## Zaman yolculuğu {#time-travel}

Araç çubuğunda Geri al ve Yinele düğmelerinin yanındaki `Time Travel` düğmesinden açılır.  
Oturumda en az bir kaydedilmiş değişiklik olana kadar düğme hiçbir şey yapmaz.

Zaman yolculuğu, `Viewport` kilidi etkin olsun ya da olmasın, diyagramın ayrı ve salt okunur bir kopyasını tuvalin gösterdiği kaydırma konumunda ve yakınlaştırma düzeyinde açar.  
Düzenleme geçmişinin tamamında ilerlemek ve her noktayı önizlemek için kaydırıcıyı sürükleyin veya kaydırıcı yolunun herhangi bir yerine tıklayın. Kaydırıcının en sol konumu, ilk kaydedilen değişiklikten bir adım önceki durumdur; kaydırıcı, tutamaç geçerli durumdayken açılır.  
Önizleme etkileşimsizdir: Bir mini harita çizer, ancak içinde gezinemez, onu kaydıramaz veya düzenleyemezsiniz ve uygulayana kadar gerçek belge olduğu gibi kalır.

Seçili noktayı geri yüklemek için `Apply` düğmesine, belgeyi değiştirmeden bırakmak için `Cancel` düğmesine veya `Esc` tuşuna basın.

![Zaman yolculuğunu açma, kaydırıcıyı oturum boyunca geriye sürükleme ve önceki bir noktayı uygulama](/img/demo-time-travel.webp)
