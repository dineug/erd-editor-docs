---
sidebar_position: 4
description: Tablolara ve sütunlara mantıksal ad verme, Ad görünümüyle fiziksel adları, mantıksal adları veya ikisini birden gösterme, terim adlarını yazarken tamamlama, sütunları değer alanlarına bağlama ve adların görünümü başka nerelerde izlediğini görme.
---

# Mantıksal adlar

Bir tablonun ve her sütununun, adının yanında bir mantıksal adı olabilir. Mantıksal ad, `CUST_NM` için `Customer Name` gibi, insanların okuduğu addır. Adın kendisi fiziksel addır: [Şema SQL](./schema-sql.md) ile [Kod oluşturucunun](./code-generator.md) yazdığı ad.  
ERD tuvalinin ikisinden hangisini göstereceğine Ad görünümü karar verir: adlar, mantıksal adlar ya da her ikisi. [Ad görünümü](#name-view) bölümüne bakın.  
Bir mantıksal ad, tablosuna veya sütununa [Sözlük](./dictionary.md) sekmesindeki sözcüklerden ve terimlerden türetilen bir fiziksel ad da verebilir. [Fiziksel adları türetme](./dictionary.md#deriving-physical-names) bölümüne bakın.  
Bir sütun bir değer alanına bağlanabilir ve bu durumda değer alanının veri türünü taşır. Değer alanı, Sözlük sekmesindeki `Domains` sayfasında tutulan, `VARCHAR(100)` için `Name` gibi adlandırılmış bir veri türüdür. [Değer alanı hücresi](#the-domain-cell) bölümüne bakın.  
Şema SQL her mantıksal adı boş bir açıklamaya yazabilir. [Açıklama olarak mantıksal adlar](./schema-sql.md#logical-names-as-comments) bölümüne bakın.

## Ad görünümü {#name-view}

Üç görünüm vardır ve her biri bir tablonun başlığını ve satırlarını kendi biçiminde gösterir:

- Yeni bir diyagramın görünümü olan `Physical Names` hiçbir mantıksal ad göstermez. Başlık tablonun adını ve View Option → `Table Comment` açıkken açıklamasını gösterir, her satır da hücrelerini [sütun sırasına](./settings.md#adjusting-column-order) göre gösterir.
- `Logical Names` her adın yerine mantıksal adı gösterir: başlıkta ve her satırda, sütun sırasında `Name` öğesinin bulunduğu yerde. Bir satırın tür hücresi, aşağıda anlatıldığı gibi sütunun değer alanının yerini tutabilir.
- `Both Names` mantıksal adı adın yanında gösterir. Başlık önce mantıksal adı, ardından adı, ardından açıklamayı gösterir ve her satıra, sütun sırasının varsayılan olarak `Name` öğesinin hemen önüne yerleştirdiği bir `Logical Name` hücresi eklenir.

Yalnızca boşluklardan oluşanlar dahil boş bir mantıksal adın yerine soluk bir metin gösterilir. `Logical Names` görünümünde bu metin, mantıksal adın yerine gösterilen addır ya da ad da boşsa `table` veya `column` yer tutucusudur. `Both Names` görünümünde ise `logical` yer tutucusudur.

`Logical Names` görünümünde, Sözlük sekmesindeki `Domains` sayfasında adı olan bir değer alanına bağlı sütun, tür hücresinde veri türü yerine o değer alanının adını gösterir. Diğer her sütun orada veri türünü gösterir.  
View Option → `Domain` açıkken değer alanının kendine ait bir hücresi olur ve tür hücresi veri türünü korur, bu yüzden hiçbir satır değer alanını iki kez göstermez. [Değer alanı hücresi](#the-domain-cell) bölümüne bakın.

Her tablo, görünümde gösterdiği hücreler kadar geniştir, bu yüzden bir görünüm değişikliği tabloları yeniden boyutlandırır ve bağlantı çizgilerini yeniden yerleştirir. Hiçbir tablo yer değiştirmez.  
`70%` ve altındaki yakınlaştırmada bir tablo adına daralır. [Yakınlaştırma/uzaklaştırma](./table-related-functions.md#zoom-inout) bölümüne bakın. `Logical Names` görünümünde mantıksal adı ya da mantıksal ad yokken soluk olarak adı gösterir. `Both Names` görünümünde mantıksal adı ve altındaki satırda adı ya da mantıksal ad yokken yalnızca adı gösterir.

Sözlük sekmesindeki denetimler, sorun buldukları bir mantıksal adı veya adı kırmızı ya da kehribar renginde yazabilir. [Tuvaldeki işaretler](./dictionary.md#marks-on-the-canvas) bölümüne bakın.

## Görünümü değiştirme {#switching-the-view}

Görünüm dört yerden değiştirilir ve her biri `Physical Names`, `Logical Names` ve `Both Names` görünümlerini, geçerli görünüm işaretli olarak listeler:

- [Tuval araç çubuğunda](./table-related-functions.md#canvas-toolbar) dört ilişki gösterimi ile Zen modu arasında bulunan `Name View` düğmesi. Düğme, bir aşağı okla birlikte geçerli görünümün adını gösterir ve araç ipucunda `Name View` yazar. Bir tıklama listeyi araç çubuğunun üstünde açar, bir seçim de listeyi kapatır.
- Tuvalin bağlam menüsünde `View Option` öğesinin hemen ardından gelen `Name View` öğesi: üç görünümü içeren bir alt menü. Menü bir seçimden sonra açık kalır.
- Görselleştirme sekmesinin araç çubuğunda, `Flow` modunda satır görünümü menüsünden sonra gelen aynı liste. [Araç çubuğu](./visualization.md#toolbar) bölümüne bakın.
- [Hızlı aramada](./quick-search.md#what-the-palette-lists) `Tab` öğesinin hemen ardından gelen ve yalnızca ERD sekmesinde listelenen `Name View` öğesi. Alt menüsü, vurgu geçerli görünümün üzerindeyken açılır.

![Ad görünümünü tuval araç çubuğundan Logical Names, tuval menüsünden Both Names olarak değiştirme ve yeniden Physical Names görünümüne dönme, mantıksal adı olmayan ordered_at sütununun önce soluk, ardından logical yer tutucusu olarak görünmesi](/img/demo-name-view.webp)

Dördü de aynı görünümü ayarlar. Üst araç çubuğunda bunun için bir düğme yoktur.

Görünüm değişikliği seçimi korur ve [geri alma geçmişine](./undo-redo.md#what-the-history-records) kaydedilmez.  
Yeni görünümün göstermediği bir hücre odaktaysa odak, onun yerine gösterilen hücreye geçer: Ad ile mantıksal ad, tür ile değer alanı gibi birbirinin yerini tutar. O hücrede açık olan hücre düzenleyicisi kapanır. View Option → `Domain` seçeneğini açmak veya kapatmak da odağı aynı şekilde taşır.  
Yeni bir diyagramda olduğu gibi `Name View` kilidi etkinken, görünüm değişikliği yalnızca kendi ekranınızı değiştirir ve dosya kilitlendiği görünümü korur. Kilit devre dışıyken dosya, geçtiğiniz görünümü kaydeder. [Kilit](./settings.md#lock) bölümüne bakın.

## Mantıksal ad yazma {#writing-a-logical-name}

`Physical Names` görünümü hiçbir mantıksal ad göstermez, bu yüzden tuvalde mantıksal ad yazmak için `Logical Names` veya `Both Names` görünümüne geçin:

- `Logical Names` görünümünde başlığın ve satırların ad hücreleri mantıksal adları tutar, bu yüzden bu görünümde fiziksel ad tuvalde düzenlenemez.
- `Both Names` görünümünde mantıksal ad hücreleri mantıksal adları, ad hücreleri ise fiziksel adları tutar.

Mantıksal ad hücresi diğer hücreler gibi düzenlenir: `Enter` tuşuyla veya çift tıklayarak başlayın. [Tablo düzenleme](./table-editing.md) sayfasına bakın. Boş bir mantıksal adda açıldığında hücre düzenleyicisi, hücrenin gösterdiği metni yer tutucu olarak gösterir: `Logical Names` görünümünde adı, `Both Names` görünümünde `logical` metnini.  
Yazdıklarınız yalnızca mantıksal adı değiştirir. Hücre düzenleyicisi değişmiş bir mantıksal adda kapandığında (`Enter`, `Tab`, `Escape` veya başka bir yere tıklama), fiziksel ad, yazdıklarınızdan sonra ayrı bir geri alma adımı olarak ondan türetilir. Kendi yazdığınız bir fiziksel ad olduğu gibi bırakılır. [Fiziksel adları türetme](./dictionary.md#deriving-physical-names) bölümüne bakın.

`Tab` ve `Shift + Tab` tuşları, görünümün gösterdiği hücreleri sırasıyla dolaşır ([Tab tuşu](./table-editing.md#tab-key) bölümüne bakın):

- `Logical Names` görünümünde başlığın mantıksal adı, ardından açıklaması, ardından her satırın hücreleri sütun sırasıyla, adın yerinde mantıksal adla.
- `Both Names` görünümünde başlığın mantıksal adı, adı ve açıklaması, ardından her satırın hücreleri sütun sırasıyla, varsayılan olarak önce `Logical Name` hücresi.

`Alt + Enter` (Windows/Linux) veya `⌥ + Enter` (Mac) tuşları bir sütun ekler ve satırının çizdiği ilk hücreyi odağa alır. Varsayılan sütun sırasında bu, ad hücresidir; `Logical Names` görünümünde sütunun mantıksal adı, `Both Names` görünümünde ise `Logical Name` hücresi olur, böylece mantıksal adla başlayabilirsiniz. [Sütun ekleme](./table-editing.md#adding-columns) bölümüne bakın.

Bir ilişkinin eklediği yabancı anahtar sütunu, anahtarının türüyle birlikte mantıksal adını ve değer alanını da kopyalar. [Tanımlayıcı ilişkiler](./relationship-editing.md#identifying-relationships) bölümüne bakın.  
Sütunları bir elektronik tabloya kopyalama ve bir elektronik tablodan sütun yapıştırma, mantıksal ad ve değer alanı hücreleri dahil, görünümün gösterdiği hücreleri kullanır. [Sütunları kopyalama/yapıştırma](./table-editing.md#copyingpasting-columns) bölümüne bakın.

## Terim adlarını tamamlama {#completing-term-names}

Başlıktaki veya bir satırdaki bir mantıksal ad hücresine yazarken hücrenin altındaki bir liste, büyük/küçük harf ayrımı yapmadan ve metnin önündeki boşlukları yok sayarak, adı yazılan metinle başlayan terimleri önerir. Terim, Sözlük sekmesindeki `Terms` sayfasında, verdiği fiziksel ad ve değer alanıyla birlikte tutulan bütün bir mantıksal addır. Liste, ada göre sıralanmış ve yazılan metin vurgulanmış olarak en fazla sekiz terim gösterir. Hiçbir terim bu şekilde başlamadığı sürece liste görünmez.

![Both Names görünümünde ⌥ + Enter ile sütun ekleme, mantıksal adının altındaki terim listesinden Order Amount terimini seçerek ORD_AMT, DECIMAL(10,2) ve Amount değer alanını doldurma, ardından Order Date yazma ve Enter hücre düzenleyicisini kapatırken sözcüklerin ORD_DT adını vermesi](/img/demo-logical-names.webp)

- Başlangıçta hiçbir şey vurgulu değildir. `↑` ve `↓` tuşları vurguyu taşır ve iki uçta da öbür uca geçer, vurgulu terimde de `Enter` tuşu gösterilir.
- Vurgulu bir terimde `Enter` tuşu, terimin adını mantıksal ad olarak yazar ve düzenlemeyi bitirir. Fiziksel ad kendi yazdığınız bir ad değilse, aynı geri alma adımı fiziksel adı hemen terimden türetir ve bir sütuna terimin değer alanını da verir. Hiçbir şey vurgulu değilken `Enter` tuşu düzenlemeyi bitirir ve yazdığınızı korur.
- Bir terime tıklamak onu aynı şekilde yazar ve hücre düzenleyicisini açık bırakır.
- Liste görünürken `Escape` tuşu yalnızca listeyi kapatır, `Escape` tuşuna ikinci kez basmak da düzenlemeyi bitirir.
- `Tab` tuşu metni yazıldığı gibi bırakarak ilerler ve fiziksel ad, hücre düzenleyicisi kapanırken bu metinden türetilir.
- Bir giriş yönteminde birleştirme sürerken ok tuşları ve `Enter` tuşu birleştirmeye aittir.

Bir terimin bir tabloya veya sütuna verdikleri [Fiziksel adları türetme](./dictionary.md#deriving-physical-names) bölümünde anlatılır.

## Değer alanı hücresi {#the-domain-cell}

Varsayılan olarak kapalı olan View Option → `Domain`, her görünümde her satıra, sütun sırasında `Domain` öğesinin bulunduğu yerde, varsayılan olarak `DataType` öğesinin hemen ardından bir değer alanı hücresi ekler. [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options) bölümüne bakın.  
Hücre, sütunun bağlı olduğu değer alanının adını ya da `Domains` sayfasının listelediği hiçbir değer alanına bağlı olmayan bir sütun için soluk `domain` yer tutucusunu gösterir.

![View Option → Domain seçeneğini açma, listeyi amo ile daralttıktan sonra PAY_AMT sütununun değer alanı hücresinde Amount değerini seçme, Sözlük sekmesinde Amount değer alanının Data Type değerini DECIMAL(12,2) olarak değiştirme ve sütunun da onunla birlikte değiştiğini görme, ardından sütuna NUMERIC(12,2) yazarak bağlantısını kaldırma](/img/demo-domains.webp)

`Enter` tuşu veya çift tıklama hücrenin üzerinde bir seçici açar: yer tutucusu hücrenin metni olan boş bir alan ve altında önce `None`, ardından `Domains` sayfasındaki adı olan her değer alanı, sayfadaki sırayla. Vurgu bağlı değer alanında ya da `None` öğesinde başlar.

- Yazmak, büyük/küçük harf ayrımı yapmadan yalnızca adı metni içeren değer alanlarını listeler, `None` öğesini kaldırır ve ilkini vurgular. `↑` ve `↓` tuşları vurguyu taşır.
- `Enter` tuşu vurgulu değer alanını, tıklama ise tıklanan değer alanını bağlar. İkisi de tek bir geri alma adımı olarak sütuna değer alanının veri türünü verir ve düzenlemeyi bitirir. `None` sütunun bağlantısını kaldırır ve veri türünü korur.
- Yazdığınız metin hiçbir zaman sütuna yazılmaz. `Domains` sayfasında adı olan bir değer alanı yokken liste görünmez ve `Enter` tuşu hiçbir şey yazmadan düzenlemeyi bitirir.

View Option → `Domain` kapalıyken `Logical Names` görünümünde, bir değer alanının adını gösteren tür hücresi bu seçiciyi, veri türü gösteren tür hücresi ise veri türü düzenleyicisini açar. [Veri türü otomatik tamamlama](./table-editing.md#datatype-autocomplete) bölümüne bakın. Değer alanı olmayan bir sütuna değer alanı bağlamak için değer alanı hücresini açın.  
Bağlı bir sütun, değer alanının veri türünü taşır ve değer alanının türü değiştiğinde onu izler, DataType hücresine başka bir tür yazmak ise sütunun bağlantısını kaldırır. [Değer alanları ve veri türleri](./dictionary.md#domains-and-data-types) bölümüne bakın.

## Tuvalin ötesinde {#beyond-the-canvas}

Bir tablonun veya sütunun adını gösteren diğer yerlerin çoğu da Ad görünümünü izler:

- `Physical Names` görünümü adı gösterir.
- `Logical Names` görünümü mantıksal adı ya da mantıksal ad boşken adı gösterir, ad da soluk gösterilebilen yerlerde soluktur.
- `Both Names` görünümü mantıksal adı ve ardından adı gösterir: bir metin satırında soluk, bir graf etiketinde ikinci satırda ve tek bir metnin ikisini birden içermesi gereken yerlerde `Member (member)` gibi parantez içinde. Mantıksal adı olmayan bir tablo veya sütun yalnızca adını gösterir.

Gezginin tabloları veya Hızlı aramanın `#` satırları gibi ada göre sıralanan bir liste, her görünümde ada göre sıralı kalır, hiçbir zaman mantıksal ada göre sıralanmaz.

Görünümü izleyen yerler:

- Görselleştirme sekmesinde Akış modunun kartları ([Kartlardaki adlar](./visualization.md#names-on-the-cards) bölümüne bakın) ile grafın etiketleri ve üzerine gelme önizlemesi ([Grafı okuma](./visualization.md#reading-the-graph) ve [Üzerine gelme önizlemesi](./visualization.md#hover-preview) bölümlerine bakın).
- [Tablo özellikleri](./table-related-functions.md#table-properties): çipleri ve `Indexes` sekmesindeki `Columns` satırları ile `Index order` listesi. [Dizinler](./table-related-functions.md#indexes) bölümüne bakın.
- [Gezginin](./explorer.md#the-tree) tablo ve sütun satırları ile her tablo grubunun altında listelenen tablolar.
- Hızlı aramanın `#` satırları. [Diyagramda arama](./quick-search.md#searching-the-diagram) bölümüne bakın.
- [Fark görüntüleyicinin](./table-related-functions.md#diff-viewer) değişiklik ağacı ve iki tarafı.
- [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusu ve bir ilişki çizilirken `Create new columns` öğesinin gösterebildiği `<parent> has no primary key to copy` araç ipucu. [İlişki oluşturma](./editing-start.md#relationship-creation) bölümüne bakın.
- Bir sütun sürüklemesinin tuvalin boş alanı üzerinde taşıdığı, her satırın ad ve tür hücrelerini satırın gösterdiği gibi gösteren satır kopyası. [Sütunları yeniden sıralama ve taşıma](./table-editing.md#rearranging-and-moving-columns) bölümüne bakın.
- Sözlük sekmesindeki `Checks` sayfasının `Target` sütunu. [Denetimler sayfası](./dictionary.md#the-checks-sheet) bölümüne bakın.
- [Dışa aktarılan görüntü](./file-import-export.md#image).

Birkaç yer, görünüm ne olursa olsun adları korur: Gezginin dizin ve yabancı anahtar satırları, Tablo özelliklerinin `Indexes` sekmesindeki `Keys` bölümü, “Sütunları eşle” iletişim kutusundaki `New column: <name>` ve Hızlı aramadaki bir `@` veya `:` satırının yanında yazan konum.

Fark görüntüleyici, [Zaman yolculuğu](./undo-redo.md#time-travel), [Otomatik düzenin](./table-related-functions.md#auto-layout) `Force` önizlemesi ve `Export image` iletişim kutusu, dosya hangi görünümü tutarsa tutsun, baktığınız Ad görünümünde açılır. Her biri açık kaldığı sürece o görünümü korur.  
Her Otomatik düzen ile her Şema SQL, GraphQL, DBML veya AML `Import` ya da `Import and Add` işlemi, tabloları sizin görünümünüzde aldıkları genişliklerle yerleştirir.

## Mantıksal ada göre bulma {#finding-by-logical-name}

Mantıksal adlar, tuvalin hiçbirini göstermediği `Physical Names` dahil, her Ad görünümünde bulunur:

- [Bul ve değiştir](./find-and-replace.md#what-it-searches) onları tablolar ve sütunlar için aynı şekilde `Logical names` adlı tek bir metin türü olarak arar ve bu tür, arama ilk açıldığında açıktır. Bir mantıksal adı değiştirmek, mantıksal ad yazmanın yaptığı gibi fiziksel adı ondan türetir.
- [Hızlı aramada](./quick-search.md#searching-the-diagram) `#` bir tabloyu adına veya mantıksal adına göre, `@` da bir sütunu ikisinden birine göre bulur, mantıksal ad eşleşmesinin yanında `Logical name` yazar. `@` önekinin `.` işaretinden önceki tablo kısmı da bir tablonun adıyla veya mantıksal adıyla eşleşir.

Ad görünümünü değiştirmek sonuçların nasıl adlandırıldığını değiştirir, neyin bulunduğunu asla değiştirmez.

## Ortak çalışanlar {#collaborators}

Bir [ortak düzenleme oturumunda](../../api/advanced/collaborative-editing.md) mantıksal adlar ve değer alanı bağlantıları, diğer her düzenleme gibi her düzenleyiciye ulaşır.  
`Name View` kilidi etkinken her düzenleyici kendi görünümünü korur ve bir görünüm değişikliği yalnızca onu yapan düzenleyicide görünür. Kilit devre dışıyken, salt okunur olmayan herhangi bir düzenleyicideki görünüm değişikliği her düzenleyicinin görünümünü değiştirir. Kilidi etkinleştirmenin veya devre dışı bırakmanın her düzenleyicinin görünümüne etkisini de anlatan [Kilit](./settings.md#lock) bölümüne bakın.  
Bir katılımcının odaktaki hücresi sizin görünümünüzün göstermediği bir hücreyse, onun rengi görünümünüzün o hücrenin yerine gösterdiği hücrede görünür: `Physical Names` görünümündeki bir ad hücresi `Logical Names` görünümündeki mantıksal ad hücrenizde görünür ve tersi de geçerlidir, bir tür hücresi ile onun yerini tutan değer alanı da aynı şekilde eşleşir.

MCP sunucusu üzerinden çalışan bir kodlama ajanı, hangi görünüme bakıyor olursanız olun mantıksal adları ayarlar ve değer alanlarını bağlar, Ad görünümünü değiştiren bir aracı da yoktur. [Sözlükler](../../mcp/tools.md#dictionaries) ve [Ayarlar](../../mcp/tools.md#settings) bölümlerine bakın.

## Salt okunur düzenleyiciler {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) bir düzenleyicide Ad görünümü seçicilerinin hepsi çalışır: tuval araç çubuğunun `Name View` düğmesi, tuval bağlam menüsündeki ve Hızlı aramadaki `Name View` ve Akış araç çubuğundaki liste.  
Orada yapılan bir değişiklik, kilit ne durumda olursa olsun yalnızca o ekranı değiştirir: dosya, ortak çalışanlar ve geri alma geçmişi görünümü olduğu gibi korur. Düzenleyici yeniden yazılabilir olduğunda seçilen görünüm, orada bir sonraki değişikliğe kadar ya da kilit devre dışıyken bir ortak çalışan onu değiştirene veya belge yeniden yüklenene kadar o ekranda kalır.  
Orada mantıksal adlar ve değer alanları düzenlenemez, bu yüzden hiçbir hücre düzenleyicisi, terim listesi veya değer alanı seçici açılmaz ve `Derive Physical Name Again` ile `Derive Physical Names Again` öğelerinin hiçbiri sunulmaz.  
View Option → `Domain`, her [görünüm seçeneğinin](./table-related-functions.md#table-view-options) orada yaptığı gibi Değer alanı hücresini yalnızca o ekranda gösterir veya gizler ve düzenleyiciyi yeniden yazılabilir yapmak belgenin tuttuğu görünüm seçeneklerini geri koyar.
