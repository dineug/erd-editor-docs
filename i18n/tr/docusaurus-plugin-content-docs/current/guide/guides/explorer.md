---
sidebar_position: 8
description: Diyagramın tablolarına sütunları, dizinleri ve yabancı anahtarlarıyla birlikte, tablo gruplarına ve notlarına ERD tuvalinin yanına yerleşik bir ağaçta göz atma ve herhangi birine tek tıklamayla gitme.
---

# Gezgin

Gezgin, ERD tuvalinin sol kenarına yerleşik olan ve diyagramı bir ağaç olarak listeleyen bir paneldir: her biri kendi sütunları, dizinleri ve yabancı anahtarlarıyla birlikte tablolar, ardından [tablo grupları](./table-groups.md), ardından da notlar. Bir satırın tuvalde temsil ettiği öğeye gitmek için o satıra tıklayın.  
Gezgin tuvali örtmek yerine daraltır. Diyagram düzenleyicisinin bir parçasıdır; VS Code'daki Explorer view ya da Obsidian'ın dosya gezgini değildir.

![Gezgini araç çubuğundan açma, products tablosuna, ardından orders tablosunun status sütununa ve member_id yabancı anahtarına gitme, Collapse All ile daraltma, paneli genişletme ve kapatma](/img/demo-explorer.webp)

[Bul ve değiştir](./find-and-replace.md), Gezginin en üstünde, başlık çubuğu ile ağacın arasında yer alır. Bul alanında metin olduğu sürece ağaç yalnızca eşleşenleri gösterir. [Sonuçlar](./find-and-replace.md#the-results) bölümüne bakın.  
Ağacın kendisi diyagramı hiçbir zaman değiştirmez: Ağaçta yeniden adlandırma, sürükleme, silme ya da gösterme ve gizleme yoktur. Panelin yaptığı tek düzenleme bir değiştirme işlemidir.

Gezginin kendi durumu yalnızca size aittir: açık olup olmadığı, genişliği, daraltma durumu, klavye odağının bulunduğu satır, kaydırma konumu ve arama.  
Bunların hiçbiri dosyaya kaydedilmez, geri alma geçmişine işlenmez, ortak çalışanlarla paylaşılmaz veya tarayıcıda saklanmaz. Düzenleyici açık kaldığı sürece, sekme değiştirmeler boyunca ve aynı düzenleyiciye yüklenen belgeler arasında korunur. Yeni açılan bir düzenleyici Gezgin kapalı olarak başlar.

## Açma ve kapatma {#opening-and-closing}

Gezgini şunlardan herhangi biriyle açın:

- Araç çubuğunda `Search` düğmesinin hemen ardından gelen, ağaç simgeli `Explorer` düğmesi. Araç ipucunda `Explorer (Ctrl + F)` (Windows/Linux) veya `Explorer (⌘ + F)` (Mac) yazar.
- Ayarlardaki [Kısayollar](./settings.md#shortcuts) sekmesinde `Toggle Explorer` adıyla yer alan `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac).
- [Hızlı aramada](./quick-search.md) her sekmede listelenen `Toggle Explorer` öğesi. `find`, `replace`, `rename`, `tree`, `outline` veya `objects` yazmak onu sonuçlara getirir.
- Tuvalin bağlam menüsündeki `Toggle Explorer` öğesi: ERD tuvalinde herhangi bir [tablo grubunun](./table-groups.md) dışındaki boş bir noktaya sağ tıklayın. `New Table`, `New Memo` ve `New Table Group` öğelerinden sonra, `Relationship` öğesinden önce yer alır.

İki `Toggle Explorer` öğesi de kısayolu sağ tarafta gösterir.  
Araç çubuğu düğmesi, kısayol ve Hızlı aramadaki öğe her sekmeden çalışır. Gezgin yalnızca ERD sekmesinde göründüğü için Görselleştirme, Şema SQL, Kod oluşturucu veya Ayarlar sekmesinden kullanıldıklarında önce ERD sekmesine geçerler.

Araç çubuğu düğmesi yalnızca paneli açar ve kapatır. Metin imlecini Bul alanına yerleştirmez; Tablo özelliklerini, tema oluşturucuyu ve `Display Language` seçicisini de açık bırakır.  
Kısayol ve iki `Toggle Explorer` öğesi Gezgini aramasıyla açar: Metin imleci Bul alanına gider ve alanın metni seçilir; [Yanında açılan iletişim kutuları](#dialogs-beside-it) bölümündeki beş iletişim kutusundan hangisi açıksa kapanır. Aramanın açılışlar arasında neleri koruduğu Bul ve değiştir sayfasındaki [Açma ve kapatma](./find-and-replace.md#opening-and-closing) bölümünde anlatılır.  
Bir tablo hücresi, bir not veya bir tablo grubunun adı düzenlenirken kısayol hiçbir şey yapmaz.

Gezgin ERD sekmesinde açıkken ve [Zen modu](#when-it-stands-aside) ile gizlenmemişken araç çubuğu düğmesi basılı görünür. Bu durumda düğme, kısayol ve `Toggle Explorer` öğelerinden herhangi biri Gezgini kapatır; klavye odağı paneldeyse düzenleyiciye geri döner.  
Hızlı arama veya beş iletişim kutusundan biri açıkken kısayol Gezgini hiçbir zaman kapatmaz. Bunun yerine paleti veya iletişim kutusunu kapatır ve klavye odağını Bul alanına götürür; alanın metni seçili olur ve Gezgin zaten görünüyorsa geçerli eşleşme korunur. Hızlı aramadaki `Toggle Explorer` öğesi böyle bir istisna yapmaz: Onu çalıştırmak paleti, ardından da açık bir Gezgini kapatır.

Başlık çubuğundaki, araç ipucunda `Close` yazan `x` düğmesi de Gezgini kapatır ve klavye odağını tuvale verir. `Escape` tuşu Gezgini kapatmaz. [Gezgindeki tuşlar](#keys-in-the-explorer) bölümüne bakın.  
Yeniden açılan Gezgin aynı genişlikte, ağaç önceki gibi daraltılmış ve kaydırılmış olarak ve aynı arama metniyle geri gelir. Kısayolla veya bir `Toggle Explorer` öğesiyle açıldığında bu arama metnini, her sonuç genişletilmiş olarak yeniden arar. [Sonuçlar](./find-and-replace.md#the-results) bölümüne bakın.

Kısayol veya bir `Toggle Explorer` öğesi Gezgini onu gösteremeyecek kadar dar bir düzenleyicide açtığında `Widen the window to show the Explorer` yazan bir bildirim görünür ve klavye odağı olduğu yerde kalır. [Tuvalin yanında](#beside-the-canvas) bölümüne bakın.  
Gezgin yine de açıktır ve araç çubuğu düğmesi basılı görünür; düzenleyici yeterince genişlediğinde Gezgin, arama zaten yapılmış olarak ve klavye odağını almadan görünür. Araç çubuğu düğmesiyle açmak hiçbir bildirim göstermez.

## Tuvalin yanında {#beside-the-canvas}

Gezgin, ERD sekmesinin sol kenarı boyunca, araç çubuğunun altında, tuvalin tüm yüksekliğince uzanır.  
Tuval ona yer açmak için daralır; böylece diyagramın hiçbir kısmı panelin altında kalmaz ve [tuval araç çubuğu](./table-related-functions.md#canvas-toolbar), mini harita ve [karşılama ekranı](./editing-start.md#welcome-screen) da hep onun yanındaki tuvalde yer alır.  
Gezgini açmak, kapatmak veya yeniden boyutlandırmak diyagramı kaydırmaz ve [geri alma geçmişine](./undo-redo.md#what-the-history-records) hiçbir şey kaydetmez.

Yeni açılan bir düzenleyicide `260px` genişliğinde başlar. Genişliği `200px` ile `480px` arasında herhangi bir değere ayarlamak için sağ kenarını sürükleyin ya da `260px` genişliğe dönmek için kenara çift tıklayın.

Tuval, Gezginin yanında her zaman en az `320px` genişlik korur:

- Gezginin genişliği artı `320px` değerinden dar bir düzenleyicide Gezgin sığmak için `200px` genişliğe kadar daha dar çizilir.
- `520px` genişlikten dar bir düzenleyicide kenara çekilir. Çizilmez ama açık kalır; bu yüzden araç çubuğu düğmesi yine basılı görünür ve düğmeye basmak Gezgini kapatır. Düzenleyici yeterince genişlediğinde kendi genişliğiyle geri gelir.

[Açma ve kapatma](#opening-and-closing) bölümündeki bildirim pencereden söz etse de önemli olan tarayıcı penceresinin değil, düzenleyicinin kendi genişliğidir.

[Sağdan sola yazılan bir görüntüleme dilinde](./language-and-theme.md#right-to-left-languages) tuval hiçbir zaman yansıtılmadığı için Gezgin tuvalin solunda kalır.  
İçeriği sağdan sola okunur: Başlık çubuğu, arama ve satırlar yansıtılır, satırlar da sağdan girintilenir. Sürüklediğiniz kenar, tuvale bitişik olarak sağ tarafında kalır. Veri türleri, dizin sütunları ve yabancı anahtar metni soldan sağa sıralarını korur.

## Kenara çekildiğinde {#when-it-stands-aside}

Gezgin yalnızca ERD sekmesinde görünür.  
Başka bir sekmeye geçmek onu gizler ve araç çubuğu düğmesi artık basılı görünmez. ERD sekmesine dönüldüğünde Gezgin bıraktığınız gibi, aynı şekilde daraltılmış ve kaydırılmış olarak yeniden görünür.

[Fark görüntüleyici](./table-related-functions.md#diff-viewer), [Zaman yolculuğu](./undo-redo.md#time-travel) veya [Otomatik düzenin](./table-related-functions.md#auto-layout) önizlemesi açıkken hiçbir şey Gezgini açmaz ya da kapatmaz:

- Açık bir Gezgin gizlenir ve bunlar kapandığında yeniden görünür.
- Araç çubuğu düğmesi soluk görünür ve hiçbir şey yapmaz.
- Hızlı aramada `Toggle Explorer` öğesi yer almaz.
- Kısayol tarayıcıya veya ana uygulamaya bırakılır. [Tarayıcının bulma çubuğu](./find-and-replace.md#the-browsers-find-bar) bölümüne bakın.

Fark görüntüleyici değişikliklerini aynı türden bir ağaçta listeler. [Fark görüntüleyici](./table-related-functions.md#diff-viewer) bölümüne bakın.

[Zen modunu](./table-related-functions.md#canvas-toolbar) `Alt + Z` (Windows/Linux) veya `⌥ + Z` (Mac) ile açmak, açık bir Gezgini kapatmadan gizler; Zen modunu kapatmak da Gezgini geri getirir.  
Zen modunda kısayol ve iki `Toggle Explorer` öğesi Gezgini yine aramasıyla açar ve Zen modu açık kalır. Üst araç çubuğu kalktığı için Gezgin bu durumda düzenleyicinin tüm yüksekliğince uzanır ve Zen modu kapatıldığında görünür kalır. Zen modunu yeniden açmak onu yeniden gizler.

Klavye odağı paneldeyken panel ortadan kalktığında, ister kapatılsın ister gizlensin ister kenara çekilsin, klavye odağı düzenleyiciye geri döner.

## Ağaç {#the-tree}

Başlık çubuğunda `Explorer` yazar ve iki düğme bulunur: `Collapse All` ve Gezgini kapatan `x`. Başlık çubuğunun altında arama, onun altında da ağaç yer alır. Arama için [Bul ve değiştir](./find-and-replace.md) sayfasına bakın.

En üst düzeyde şu sırayla üç klasör bulunur: `Tables`, `Table Groups` ve `Memos`. Her tablonun altında o tablonun kendi `Columns`, `Indexes` ve `Foreign Keys` klasörleri yer alır.  
İçi boş bir klasör gösterilmez; bu yüzden boş bir diyagramda hiç satır görünmez. [View Option](./table-related-functions.md#table-view-options) → `Table Groups` grupları gizlerken `Table Groups` klasörü, View Option → `Memos` notları gizlerken de `Memos` klasörü yer almaz.  
Bir klasör satırında bir klasör simgesi, klasörün adı ve en uçta doğrudan altındaki satırların sayısı gösterilir; bu yüzden `Tables` klasörünün yanındaki sayı diyagramdaki tablo sayısıdır.

Tablolar büyük/küçük harf ayrımı yapmadan ada göre listelenir; aynı adı taşıyan tablolar belgedeki sıralarını korur. Tablo grupları da, her grubun altındaki tablolar da aynı şekilde listelenir. Bir tablonun sütunları tablonun kendi sırasını, dizinleri, yabancı anahtarları ve notlar ise belgedeki sırayı korur.  
Ağaç, diyagram değiştikçe onu izler; değişiklik tuvaldeki bir düzenlemeden, bir geri alma veya yinelemeden, bir içe aktarmadan ya da bir ortak çalışandan veya kodlama ajanından gelebilir. Bu yüzden bir tabloyu yeniden adlandırmak satırının yerini değiştirir.

Her satır türü şunları gösterir:

- Tablo: bir tablo simgesi ve tablonun adı.
- Sütun: birincil anahtar veya yabancı anahtar sütunu için, tablonun kendi anahtar hücresinin birincil anahtarı, yabancı anahtarı ya da ikisini birden renklendirdiği gibi renklendirilmiş bir anahtar simgesi, diğer her sütun için bir liste simgesi. Ardından sütunun adı ve soluk renkte, arkasından `PK`, `FK` ya da ikisi birden gelen veri türü; örneğin `id` `BIGINT PK` veya `user_id` `BIGINT FK`.
- Dizin: bir dizin simgesi ve dizinin adı. Ardından soluk renkte, benzersiz bir dizin için `UNIQUE` ve dizinin sütunları dizin sırasıyla parantez içinde, azalan sıralı bir sütundan sonra `DESC` gelecek şekilde; örneğin `orders_user_idx` `UNIQUE (user_id DESC, total)` ya da yalnızca `(total)`.
- Yabancı anahtar: Yalnızca alt tablonun, yani yabancı anahtar sütunlarını tutan tablonun altında ve yalnızca üst tablo diyagramda olduğu sürece listelenir. Anahtar simgesi bağlantı çizgisinin rengini alır: [tanımlayıcı bir ilişki](./relationship-editing.md#identifying-relationships) için birincil anahtar ve yabancı anahtar rengini, aksi hâlde yabancı anahtar rengini. Alt tablonun anahtar sütunlarını virgülle ayrılmış olarak, ardından soluk renkte `→` ile birlikte üst tabloyu ve onun sütunlarını gösterir; örneğin `user_id` `→ users(id)`.
- Tablo grubu: grubun renginde, rengi olmayan bir grup için gri bir nokta ve grubun adı. Grubun tabloları altında ada göre listelenir ve her biri kendi tablosuna gider. Tablosu olmayan bir grubun genişletilecek bir şeyi yoktur.
- Not: bir yapışkan not simgesi ve notun ilk satırı.

Boş bir adın ya da ilk satırı boş olan bir notun yerinde italik olarak `unnamed` yazar.  
Dar bir panelde önce soluk metin `…` ile kısaltılır, ad ancak ondan sonra kısaltılır. Tamamını görmek için bir adın veya soluk metninin üzerine gelin.

Başlangıçta yalnızca `Tables` klasörü genişletilmiştir. Bir klasör satırını daraltmak veya genişletmek için ona tıklayın ya da üzerindeyken `Enter` veya `Space` tuşuna basın.  
Satırın başındaki ok, hiçbir yere gitmeden o satırı daraltır veya genişletir. Altında hiçbir şey olmayan bir tablonunki dahil, her tablo satırında bu ok bulunur. `→` ve `←` tuşları da daraltır ve genişletir. [Gezgindeki tuşlar](#keys-in-the-explorer) bölümüne bakın.  
`Collapse All` düğmesi her basışta bir düzey daraltır: görünen genişletilmiş satırların en derin düzeyini. Bu yüzden basışlar aşağıdan yukarıya doğru daraltır. En üst düzeye ulaşan basış, zaten daraltılmış bir satırın altındakiler dahil her satırı daraltır ve yalnızca en üst düzeydeki klasörleri bırakır.  
Düzenlemeler, geri alma ve yineleme ile ortak çalışanlardan veya bir kodlama ajanından gelen değişiklikler daraltma durumunu olduğu gibi bırakır.

## Bir satıra gitme {#going-to-a-row}

Bir satırın ERD tuvalinde temsil ettiği öğeye gitmek için satıra tıklayın ya da klavye odağı üzerindeyken `Enter` veya `Space` tuşuna basın. Bir klasör satırı yalnızca daralır veya genişler; ok tuşları da yalnızca ağacın içinde hareket eder.

- Bir tablo satırı veya bir grubun altında listelenen bir tablo, o tabloyu tek başına seçer ve öne getirir. Odaktaki hücre, zaten o tabloda değilse, tablonun adına gider.
- Bir sütun satırı, sütunun tablosunu tek başına seçer ve odaktaki hücreyi sütunun adına yerleştirir.
- Bir dizin satırı, tablo satırının yaptığı gibi dizinin tablosunu seçer. Dizinin kendisi ayrıca işaretlenmez; dizinler [Tablo özelliklerinde](./table-related-functions.md#indexes) düzenlenir.
- Bir yabancı anahtar satırı, ilişkinin iki tablosunu birlikte görünüme getirir; iki tablo birlikte gösterilemeyecek kadar uzaksa alt tabloyu getirir. Alt tabloyu yabancı anahtar sütunlarıyla birlikte tek başına seçer, odaktaki hücreyi bu sütunların ilkine yerleştirir ve ilişkinin bağlantı çizgisini vurgular. [Bağlantı çizgisini okuma](./relationship-editing.md#reading-a-connector) bölümüne bakın.
- Bir tablo grubu satırı, grubun kutusunu başlık çubuğunu esas alarak görünüme getirir, grubu tek başına seçer ve tablolarıyla birlikte öne getirir.
- Bir not satırı notu tek başına seçer ve öne getirir.

Görünüm, her atlamanın uyduğu ortak kurala göre hareket eder: Yakınlaştırma hiçbir zaman değişmez ve tuval yalnızca gittiğiniz öğe zaten iyi görünmüyorsa kaydırılır. [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın.  
Bir satıra gitmek, Tablo özellikleri açıksa önce onu kapatır; hiçbir zaman bir ilişki çizimini başlatmaz ya da çizilmekte olan bir ilişkiyi tamamlamaz.  
Bul alanında metin olduğu sürece kendi adında bir eşleşme bulunan ya da bir açıklamanın veya notun metin parçasını gösteren bir satır, bunun yerine o eşleşmeye gider. [Eşleşmeye gitme](./find-and-replace.md#going-to-a-match) bölümüne bakın.

Bir tıklamadan sonra klavye odağı ağaçta kalır; bu yüzden `Escape` tuşuna basana veya tuvale tıklayana kadar `Delete`, `Backspace` ve diğer düzenleme tuşları yeni seçime ulaşmaz. [Gezgindeki tuşlar](#keys-in-the-explorer) bölümüne bakın.

## Gezgindeki tuşlar {#keys-in-the-explorer}

Ağaç tek bir `Tab` durağıdır ve hiç satırı yokken atlanır.  
`Tab` tuşuyla ağaca girildiğinde klavye odağı en son bulunduğu satıra, o yoksa geçerli eşleşmenin satırına, o da yoksa tamamen görünen ilk satıra gider ve o satır görünüme kaydırılır. Klavye odağındaki satır, işaretçinin altındaki bir satır gibi çizilir.

Ağaçta:

- `↑` ve `↓` tuşları odağı bir satır taşır; başa ya da sona sarmak yerine ilk ve son satırda durur. `Home` ve `End` tuşları ilk ve son satıra gider.
- `→` tuşu daraltılmış bir satırı genişletir ya da genişletilmiş bir satırın ilk alt öğesine geçer. `←` tuşu genişletilmiş bir satırı daraltır ya da üst öğesine çıkar. Sağdan sola yazılan bir görüntüleme dilinde bu iki tuşun görevleri yer değiştirir.
- `Enter` ve `Space` tuşları tıklama gibi davranır: Satıra gider ya da bir klasörü daraltır veya genişletir. [Bir satıra gitme](#going-to-a-row) bölümüne bakın.
- Bir harf yazmak bir satıra atlamaz.

Gezginin herhangi bir yerinde, yani ağaçta, Bul veya Değiştir alanında ya da düğmelerinden birinde basılan `Escape` tuşu klavye odağını tuvale geri verir. Gezgin açık kalır ve seçim olduğu gibi kalır.  
Giriş yöntemiyle yapılan bir birleştirmeyi sona erdiren `Escape` tuşu yalnızca birleştirmeyi sona erdirir. `Escape` tuşu, ister Gezginde ister tuvalde basılsın, Gezgini hiçbir zaman kapatmaz.

Klavye odağı Gezgindeyken birkaç düzenleyici kısayolu yine çalışır ([Kısayollar](./settings.md#shortcuts) bölümüne bakın):

- `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) tuvalde olduğu gibi çalışır: Gezgini kapatır ya da yanında Tablo özellikleri açıksa Tablo özelliklerini kapatıp metin imlecini Bul alanına yerleştirir. [Açma ve kapatma](#opening-and-closing) bölümüne bakın.
- `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac) Hızlı aramayı açar veya kapatır.
- `Undo` ve `Redo` bir alandaki metni değil, diyagramı geri alır ve yineler.
- `Zoom In`, `Zoom Out` ve `Zoom Reset` tuvalin yakınlaştırmasını değiştirir.

Diğer tüm düzenleyici kısayolları Gezginde kalır; ok tuşları, `Tab`, `Enter`, `Space`, `Home`, `End` ve bir giriş yöntemiyle birleştirme sürerken basılan her tuş da öyle.  
Bunların hiçbiri tuvale ulaşmaz: `Delete` ve `Backspace` seçimi hiçbir zaman silmez, `Alt + N` (Windows/Linux) veya `⌥ + N` (Mac) tablo eklemez, `T`, ardından `G` de hiçbir şeyi gruplamaz. Bir alanda sıradan metin tuşları gibi davranırlar: `Ctrl + A` (Windows/Linux) veya `⌘ + A` (Mac) alanın metnini seçer, `Delete` ve `Backspace` metin siler, `Space` de bir boşluk yazar. `Tab` tuşu Gezginin düğmeleri, alanları ve ağacı arasında geçiş yapar.  
Bul ve değiştir alanlarının kendi tuşları [Arama alanlarındaki tuşlar](./find-and-replace.md#keys-in-the-search-fields) bölümünde anlatılır.  
Ana uygulamanın kendi kaydetme veya komut paleti kısayolu gibi, düzenleyicinin bağlamadığı tuşlar ana uygulamaya her zamanki gibi ulaşır.

## Yanında açılan iletişim kutuları {#dialogs-beside-it}

[Tablo özellikleri](./table-related-functions.md#table-properties), [tema oluşturucu](./language-and-theme.md#theme), [`Display Language`](./language-and-theme.md#picking-a-language) seçicisi, [`Export image`](./file-import-export.md#image) iletişim kutusu ve [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusu açılırken Gezgini açık bırakır.

- Tablo özellikleri Gezginin yanındaki tuvalin ortasında açılır ve yalnızca tuvali soluklaştırır. Gezgin kullanılabilir kalır: Bir satır seçmek Tablo özelliklerini kapatır, ardından o satıra gider.
- `Export image` ve “Sütunları eşle” iletişim kutuları, araç çubuğu ve Gezgin dahil tüm düzenleyiciyi soluklaştırır. Gezgin soluk alanın altında açık kalır ve oraya yapılan bir tıklama, soluk alanın herhangi bir yerine yapılan tıklama gibi iletişim kutusunu kapatır; bu durumda “Sütunları eşle” hiçbir şeyi eşlemeden kapanır.
- Soldan sağa yazılan bir görüntüleme dilinde tema oluşturucu ve `Display Language` seçicisi Gezginin üzerinde değil, hemen ötesinde açılır ve bunlar açıkken Gezgin açılır veya kapanırsa onunla birlikte kayar. Sağdan sola yazılan bir dilde sağdaki yerlerini korur. Gezginde bir yere basmak, araç çubuğundakiler dışında bunların dışına yapılan her basış gibi onları kapatır.

Aramayı kısayolla veya bir `Toggle Explorer` öğesiyle açmak bu beşini de kapatır; “Sütunları eşle” hiçbir şeyi eşlemeden kapanır.  
[Hızlı arama](./quick-search.md) da Gezgini açık bırakır; bu durumda `Escape` tuşu yalnızca paleti kapatır.

## Salt okunur düzenleyiciler {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) bir düzenleyicide Gezgin diğer düzenleyicilerde olduğu gibi çalışır: aynı araç ipucuna sahip araç çubuğu düğmesi, kısayol, iki `Toggle Explorer` öğesi, ağaç, daraltma, `Collapse All` ve her zamanki gibi gittiği öğeyi seçen satıra gitme. Orada da başlığında `Explorer` yazar.  
Araması yalnızca bulur. Bul ve değiştir sayfasındaki [Salt okunur düzenleyiciler](./find-and-replace.md#read-only-editors) bölümüne bakın.
