---
sidebar_position: 14
description: Diyagramın değer alanlarını, sözcüklerini ve terimlerini Sözlük sekmesinde tutma, mantıksal adlardan fiziksel adlar türetme, bir değer alanının sütunlarının veri türünü belirlemesini sağlama, Denetimler sayfasının bulduklarını okuma, sayfaları bir elektronik tablodaki gibi düzenleme ve sıralama, CSV dosyaları olarak içe ve dışa aktarma.
---

# Sözlük

Sözlük sekmesi, diyagramın adlandırma standardını, her biri bir elektronik tablo gibi düzenlediğiniz bir sayfada bulunan üç sözlükte tutar:

- `Domains`: `VARCHAR(100)` için `Name` gibi adlandırılmış veri türleri. Bir değer alanına bağlı sütun, değer alanının veri türünü taşır.
- `Words`: mantıksal adları oluşturan standart sözcükler ve fiziksel adın her biri için kullandığı kısaltma, örneğin `Customer` ve `CUST`.
- `Terms`: bir bütün olarak mantıksal adlar ve her birinin verdiği fiziksel ad ile değer alanı, örneğin `Customer Name` ve `CUST_NM`.

Bir tablonun veya sütunun [mantıksal adı](./logical-names.md) fiziksel adını bu sözlüklerden türetir, bir sütunun terimi de sütunu bir değer alanına bağlayabilir. [Fiziksel adları türetme](#deriving-physical-names) bölümüne bakın.  
Dördüncü sayfa olan `Checks`, sözlüklerin diyagramın adlarında ve türlerinde, ayrıca sözlüklerin kendilerinde bulduğu, mantıksal addaki yasaklı bir sözcük gibi sorunları listeler. [Denetimler sayfası](#the-checks-sheet) bölümüne bakın.

## Sekmeyi açma {#opening-the-tab}

Araç çubuğunda `Code Generator` ile `Settings` arasındaki kitap simgeli düğme olan `Dictionary` sekmesine geçin ya da [Hızlı aramada](./quick-search.md) `Tab` altından `Dictionary` öğesini seçin.  
Diyagramın açıldığı sekme de olabilir. [Kilit](./settings.md#lock) bölümündeki `Canvas Type` ayarına bakın.

Siz başka bir sayfa seçene kadar sekme `Domains` sayfasında açılır.  
Sekme her açıldığında sayfa, bıraktığınız seçim ve kaydırma konumuyla ya da ilk ziyarette ilk hücresi seçili olarak geri gelir. Klavye odağı ızgaraya geçer, bu yüzden yazmak veya ok tuşları hemen etki eder.

Gösterilen sayfa ve her sayfanın araması, seçimi, kaydırma konumu ve sütun genişlikleri yalnızca size aittir.  
Bunların hiçbiri dosyaya kaydedilmez, geri alma geçmişine yazılmaz veya ortak çalışanlarla paylaşılmaz. Düzenleyici açık kaldığı sürece, sekme değişikliklerinde ve aynı düzenleyiciye yüklenen belgeler arasında korunur.

## Sayfalar {#the-sheets}

Üstte boydan boya uzanan çubukta dört sayfa düğmesi bulunur: `Domains`, `Words`, `Terms` ve `Checks`. Gösterilen sayfanın düğmesi basılı görünür. Her biri adının yanında bir sayı gösterir: aramanın ne gösterdiğinden bağımsız olarak sayfasındaki satır sayısı ya da `Checks` düğmesinde, düzeylerine göre renklendirilen denetim sayısı. [Denetimler sayfası](#the-checks-sheet) bölümüne bakın.  
Ardından arama alanı gelir. [Arama](#searching) bölümüne bakın. Çubuğun sonunda, `Domains`, `Words` ve `Terms` sayfalarında ve salt okunur olmayan bir düzenleyicide dört araç bulunur: `Add Row`, `Delete Rows`, `Import CSV` ve `Export CSV`. [Satır ekleme ve silme](#adding-and-deleting-rows) ve [CSV içe ve dışa aktarma](#importing-and-exporting-csv) bölümlerine bakın.  
Dar bir bölmede veya metinleri uzun olan bir görüntüleme dilinde çubuk birden çok satıra kayar, böylece her düğme erişilebilir kalır.

Izgaranın altındaki durum satırı, `4 rows` örneğinde olduğu gibi aramanın bıraktığı satırları sayar ve seçim herhangi bir satırı kapsadığı sürece, `1 selected` örneğinde olduğu gibi kaç satırı kapsadığını da gösterir. İki aralığın paylaştığı bir satır bir kez sayılır, bu yüzden bu sayı `Delete Rows` düğmesinin kaldıracağı satır sayısıdır.  
Soldaki satır numaraları, satırları sayfanın gösterdiği sırayla 1'den başlayarak sayar. Salt okunur bir hücre, yani `Checks` sayfasındaki ve salt okunur bir düzenleyicideki her hücre, bir denetimin işaretlediği yerler dışında gri bir zemin üzerinde gösterilir.  
Boş bir `Domains`, `Words` veya `Terms` sayfasında, salt okunur bir düzenleyici dışında `Import a CSV file or add a row` yazar.

Her sayfanın sütunları, sırasıyla:

| Sayfa | Sütunlar |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Hücrelerin işlevleri:

- Değer alanının `Data Type` değeri, `VARCHAR(100)` veya `NUMERIC(15,2)` gibi bir sütun türü olarak yazılır ve değer alanına bağlı her sütun bu türü taşır. [Değer alanları ve veri türleri](#domains-and-data-types) bölümüne bakın.
- Sözcüğün `Abbreviation` değeri, fiziksel adın o sözcük için kullandığı metindir. [Sözcüklerden](#from-the-words) bölümüne bakın.
- Sözcüğün `Synonyms` ve `Forbidden Words` değerleri, aynı şey için kullanılan başka sözcükleri virgülle ayrılmış olarak listeler. Her öğenin başındaki ve sonundaki boşluklar kırpılır, boş bir öğe atılır ve sözcüğün kendisine eşit bir öğe yok sayılır. Bunlardan birini kullanan bir mantıksal ad fiziksel ad oluşturmaz ve `Checks` sayfası bu adı listeleyip yerine kullanılacak sözcüğü belirtir. [Her denetimin buldukları](#what-each-check-finds) bölümüne bakın.
- Terimin `Term` değeri bir bütün olarak mantıksal addır, `Physical Name` değeri ise bu mantıksal adın verdiği addır. [Terimden](#from-a-term) bölümüne bakın.
- Terimin `Domain` değeri bağladığı değer alanının adını gösterir ve hiçbir değer alanı bağlamadığı ya da sonradan kaldırılmış bir değer alanını bağladığı sürece boştur. [Terimin değer alanı](#a-terms-domain) bölümüne bakın.
- `Category`, `English Name`, her `Description` ve terimin `Synonyms` değeri bilgi notlarıdır. Hiçbir şeyi değiştirmezler ve hiçbir denetim onları okumaz.

[Sağdan sola yazılan bir görüntüleme dilinde](./language-and-theme.md#right-to-left-languages) çubuk, ızgara menüsü ve durum satırı yansıtılır, sayfalar ve terimin değer alanı listesi ise soldan sağa kalır.

## Fiziksel adları türetme {#deriving-physical-names}

Sözlükler, bir tabloya veya sütuna fiziksel adını, yani Şema SQL ve Kod oluşturucu sekmelerinin yazdığı adı, mantıksal adından türeterek verebilir. Önce `Term` değeri bu mantıksal ad olan bir terim aranır, bulunamazsa ad sözcüklerin kısaltmalarından oluşturulur.  
Örneğin, `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) ve `Date` (`DT`) sözcükleri ile fiziksel adı `CUST_NO`, değer alanı `Number` olan `Customer Number` terimi varsa ve bu değer alanının veri türü `INT` ise:

- `Customer Number` mantıksal adı bir sütunu `CUST_NO` olarak adlandırır, onu `Number` değer alanına bağlar ve ona `INT` türünü verir.
- `Order Date` mantıksal adı `ORD_DT` adını oluşturur.
- Mantıksal adı `Customer` olan bir tablo `CUST` olarak adlandırılır.

`Words` sayfası ve `Terms` sayfası boşken hiçbir şey türetilmez.

### Adın türetildiği anlar {#when-a-name-is-derived}

Bir mantıksal ad yazıldığında fiziksel ad türetilir:

- Tuvalde, mantıksal ad hücresinin düzenleyicisi `Enter`, `Tab` veya `Escape` tuşuyla ya da başka bir yere tıklanarak, açıldığı mantıksal addan farklı bir mantıksal adla kapandığında. Yazdığınız her tuş yalnızca mantıksal adı yazar. [Mantıksal ad yazma](./logical-names.md#writing-a-logical-name) bölümüne bakın.
- Hücrenin altındaki listeden bir terim seçtiğiniz anda. [Terim adlarını tamamlama](./logical-names.md#completing-term-names) bölümüne bakın.
- Bir yapıştırma bir mantıksal ad hücresine yazdığında. [Sütunları kopyalama/yapıştırma](./table-editing.md#copyingpasting-columns) bölümüne bakın.
- [Bul ve değiştir](./find-and-replace.md#replacing) bir mantıksal adı değiştirdiğinde, ister tek bir eşleşmeyi ister hepsini değiştirsin.
- Bir kodlama ajanı bir mantıksal ad ayarladığında.

Fiziksel ad yalnızca boşken veya kendisi de türetilmişse türetilir. [Kendi yazdığınız adlar](#names-of-your-own) bölümüne bakın.  
Seçilen bir terim, bir yapıştırma veya bir değiştirme, mantıksal adı ve ondan türetileni tek bir geri alma adımı olarak yazar. Tuvalde, düzenleyici kapanırken türetilen ad, yazmanın ardından gelen ayrı bir geri alma adımıdır: ilk geri alma, türetilen adı bir terimin getirdiği değer alanı ve türle birlikte geri alır ve yazdığınız mantıksal adı bırakır.

Sonradan hiçbir şey kendiliğinden yeniden türetilmez. Sözcüğün yeni `Abbreviation` değeri, terimin yeni `Physical Name` veya `Domain` değeri ve yeni sözcükler ya da terimler, önceden türetilmiş adları olduğu gibi bırakır. Bunun için [Fiziksel adları yeniden türetmeyi](#derive-physical-names-again) kullanın. Değer alanının `Data Type` değeri bunun istisnasıdır: sütunlarına hemen ulaşır.

### Terimden {#from-a-term}

Önce `Terms` sayfasında `Term` değeri mantıksal ada eşit olan bir terim aranır. Baştaki ve sondaki boşluklar ile Unicode normalleştirme biçimi yok sayılır, ancak büyük/küçük harf fark eder, bu yüzden `customer number`, `Customer Number` ile eşleşmez. Aynı adlı iki terimden sayfada önce gelen geçerli olur.

- Terim `Physical Name` değerini ya da bu değer boşken, sözcükleri bir ad oluşturuyorsa, aşağıda anlatıldığı gibi sözcüklerinin oluşturduğu adı verir.
- Bir sütunda terim, `Domain` değerindeki değer alanı `Domains` sayfasında listelendiği sürece sütunu bu değer alanına da bağlar ve bu, sütuna değer alanının veri türünü verir. [Sütunu bağlama](#linking-a-column) bölümüne bakın. Terim hiçbir ad vermediğinde bile bunu yapar. Değer alanı olmayan bir terim hiçbir bağlantıyı kaldırmaz.
- Tablo terimden yalnızca fiziksel adı alır.

### Sözcüklerden {#from-the-words}

Eşleşen bir terim yoksa adı sözcükler oluşturur:

1. Mantıksal ad boşluk, `_`, `-`, `·` ve `/` noktalarından bölünür ve hiçbir sözcük bir bölme noktasının ötesine uzanmaz.
2. Her parça soldan okunur, her noktada `Words` sayfasının `Word`, eş anlamlı sözcük veya yasaklı sözcük olarak listelediği en uzun metin alınır ve hiçbir zaman geri dönülmez. `가입`, `가입일` ve `일자` sözcükleri varken `가입일자` metni `가입일` ve `자` olarak okunur ve `자` kayıtlı olmayan sözcük olarak kalır, `가입 일자` ise `가입` ve `일자` olarak okunur. Büyük/küçük harf fark eder: `member`, `Member` sözcüğü değildir.
3. Fiziksel ad, her sözcüğün yazıldığı biçimdeki `Abbreviation` değerinin `_` ile birleştirilmesinden oluşur, örneğin `ORD_DT`. Aynı adlı iki sözcükten kısaltmayı sayfada önce gelen verir. Uzunluk sınırı uygulanmaz ve Kod oluşturucunun `Table Name Case` ile `Column Name Case` ayarlarının hiçbir etkisi olmaz.

Ya hepsi ya hiçbiri. Herhangi bir bölüm eş anlamlı sözcük, yasaklı sözcük veya hiçbir sözcüğün listelemediği bir metinse ya da bir sözcüğün `Abbreviation` değeri boşsa hiçbir ad oluşturulmaz ve fiziksel ad olduğu gibi kalır.

### Kendi yazdığınız adlar {#names-of-your-own}

Sözlükler bir fiziksel adı yalnızca ad boşken ya da adı daha önce yine kendileri doldurmuşsa doldurur. Düzenleyici bunu her tablo ve sütun için hatırlar, ancak tuvalde bunu gösteren hiçbir şey yoktur.

- Şu yollarla yazılan bir ad kendi yazdığınız ad sayılır: bir ad hücresine yazmak, Bul ve değiştir ile bir tablo veya sütun adını değiştirmek, bir sütunun ad hücresinin üzerine yapıştırmak ve bir kodlama ajanının yeniden adlandırması. Sonradan yazılan bir mantıksal ad bu adı olduğu gibi bırakır, yalnızca mantıksal adı yazar ve hiçbir değer alanı bağlamaz.
- Adı temizlemek onu yeniden sözlüklere bırakır, çünkü boş bir ad her zaman türetilir.
- Hiçbir şey türetmeyen bir mantıksal ad, fiziksel adı ve durumunu olduğu gibi bırakır: boş bir ad boş kalır, türetilmiş bir ad ise adını korur ve sözlüklere ait kalır.
- Yeni bir tablo veya sütun boş bir adla başlar, bu yüzden adını ilk mantıksal adı türetir. Bir ilişkinin eklediği yabancı anahtar sütunu anahtarına göre adlandırılır ve bu ad kendi yazdığınız ad sayılır. [Yabancı anahtar sütun adları](./relationship-editing.md#foreign-key-column-names) bölümüne bakın.
- Bir Şema SQL, GraphQL, DBML veya AML `Import` ya da `Import and Add` işleminin getirdiği adlar ve Sözlük sekmesinden önceki bir sürümle oluşturulmuş bir diyagramın adları kendi yazdığınız ad sayılır, bu yüzden bunların üzerine sonradan yazılan bir mantıksal ad hiçbir şey türetmez.
- [Çoğaltılan bir tablo](./table-related-functions.md#duplicating-tables-and-memos), sürükleme tutamacıyla [başka bir tabloya taşınan](./table-editing.md#rearranging-and-moving-columns) bir sütun, kopyalanan tabloların yapıştırılması ve bir JSON dosyasının `Import and Add` ile eklenmesi her adın durumunu korur. Seçili tablolara yeni sütun olarak yapıştırılan sütunların adları kendi yazdığınız ad sayılır, ancak yapıştırılan ad boşsa ve mantıksal adları bir ad türetiyorsa sayılmaz.
- [Fiziksel adları yeniden türetme](#derive-physical-names-again), içe aktarılmış olanlar dahil kendi yazdığınız bir adı yeniden sözlüklere bırakır.

### İki sütun, tek ad {#two-columns-one-name}

Sütunun türeteceği ada tablosundaki başka bir sütun zaten sahipse sütun hiçbir şey türetmez. Adını, durumunu ve değer alanı bağlantısını korur, yalnızca mantıksal adı yazılır. Adlar, yabancı anahtar sütun adlarında olduğu gibi büyük/küçük harf ayrımı yapmadan ve baştaki ile sondaki boşluklar yok sayılarak karşılaştırılır.  
Bir tablo üzerinde `Replace All` veya `Derive Physical Names Again` öğesinin yapabileceği gibi tek bir değişiklik iki sütuna aynı adı verecekse, adı tablodaki ilk sütun alır.  
Örneğin, anahtarı `MBR_NO` olan `members` tablosundaki kendine başvuran bir ilişki, `Member Number` mantıksal adını kopyalayan `MBR_NO_2` sütununu ekler. `Derive Physical Names Again` bu sütunu `MBR_NO` olarak adlandırırdı, ancak bu adı anahtar taşıdığı için sütun `MBR_NO_2` adını korur.  
Tablolar için böyle bir kural yoktur: iki tablo aynı adı türetebilir.

## Fiziksel adları yeniden türetme {#derive-physical-names-again}

Sözcüğün `Abbreviation` değerini ya da terimin `Physical Name` veya `Domain` değerini değiştirdikten sonra `Derive Physical Names Again` öğesini kullanın, çünkü bu değişiklikler kendi başlarına hiçbir şeyi yeniden adlandırmaz. Bu öğe kapsadığı adları, kendi yazdığınız adlar dahil, yeniden sözlüklere bırakır ve yukarıdaki kurallara göre yeniden türetir. Yalnızca ERD sekmesinde sunulur, salt okunur bir düzenleyicide ise sunulmaz:

- Tablonun bağlam menüsünde, `Focus on this table` veya `Focus on selected tables` öğesinin hemen ardından. Tablo seçili iki veya daha fazla tablodan biriyken, tablonun neresine sağ tıklarsanız tıklayın `Derive Physical Names Again` hepsini kapsar. Aksi hâlde bir sütunun satırına sağ tıklamak yalnızca o sütun için `Derive Physical Name Again` öğesini, tablo başlığına sağ tıklamak ise tablonun adı ve her sütunu için `Derive Physical Names Again` öğesini getirir.
- Tuvalin bağlam menüsünde, `Name View` öğesinin hemen ardından: diyagramdaki her tablo ve sütun için `Derive Physical Names Again`. Diyagramda hiç tablo yokken bu öğe yer almaz.
- [Hızlı aramada](./quick-search.md#what-the-palette-lists), odaktaki sütun, odaktaki tablo, seçili tablolar ve tüm diyagram için satırlar olarak.

![Words sayfasında Number sözcüğünün kısaltmasını NO'dan NUM'a değiştirme, diyagramdaki fiziksel adların MBR_NO ve PAY_NO olarak kalması, ardından tuval menüsündeki Derive Physical Names Again ile bunları MBR_NUM ve PAY_NUM yapma, terimin verdiği ORD_NO adının ise aynı kalması](/img/demo-derive-physical-names.webp)

Kapsanan ve mantıksal adı olan her tablo ve sütun yeniden türetilir. Sütun ayrıca teriminin verdiği değer alanını ve onunla birlikte değer alanının türünü alır. Bu tür, [İlişkilerde veri türü eşitleme](./settings.md#relationship-datatype-sync) açıkken ilişkiler boyunca yayılır.  
Mantıksal adı olmayan bir tabloya veya sütuna ve yeni adını tablosundaki başka bir sütunun taşıdığı bir sütuna dokunmaz. [İki sütun, tek ad](#two-columns-one-name) bölümüne bakın. Bunların her biri adını ve kendi yazdığınız ya da sözlüklere ait olma durumunu korur, bir sütun ayrıca değer alanı bağlantısını da korur.  
Şu anda hiçbir şey türetmeyen bir mantıksal ad fiziksel adı olduğu gibi korur, ancak adı yeniden sözlüklere bırakır, böylece yazacağınız bir sonraki mantıksal ad onu türetir.  
Kaç ad, bağlantı ve tür değiştirirse değiştirsin tek bir geri alma adımıdır. Yalnızca hiçbir şey değiştirmediğinde adım kaydetmez ve kendi yazdığınız bir adı yeniden sözlüklere bırakmak, ad sözlüklerin verdiği değeri zaten taşısa bile bir değişiklik sayılır.

Terimin kendi `Physical Name` değeri değişen sözcüklerden yeniden oluşturulmaz, bu yüzden yeniden türetmeden önce terimi düzenleyin.

## Değer alanları ve veri türleri {#domains-and-data-types}

Bir değer alanına bağlı sütun, değer alanının `Data Type` değerini taşır. Bir sütunu bağlamak ona bu türü hemen verir.  
Bir değer alanının `Data Type` değeri, ister `Domains` sayfasında düzenlenerek, yapıştırılarak veya içe aktarılarak ister bir ortak çalışan ya da bir kodlama ajanı tarafından değiştirilsin, ona bağlı her sütun yeni türü aynı adımda alır. [İlişkilerde veri türü eşitleme](./settings.md#relationship-datatype-sync) açıkken bu değişikliklerin her biri, yazılarak yapılan bir tür değişikliğinde olduğu gibi ilişkiler boyunca ilerler. Kapalıyken yalnızca bağlı sütunlar değişir.  
Bir değer alanını yeniden adlandırmak yalnızca sütunların değer alanı hücrelerinde gösterilen adı değiştirir.

`Domains` sayfasında yapılan bir tür değişikliği, verdiği sütun türleriyle birlikte orada geri alınır. [Sözlük sayfaları](./undo-redo.md#dictionary-sheets) bölümüne bakın.  
ERD sekmesinde bir sütunu bir değer alanına yeniden bağlayan ya da bir değer alanına bağlı bir sütunu geri getiren bir geri alma veya yineleme, sütuna değer alanının şu anki türünü verir. Başka bir türü geri koyan bir geri alma veya yineleme ise sütunun bağlantısını kaldırır.

### Sütunu bağlama {#linking-a-column}

Bir sütun şu yollarla bir değer alanına bağlanır:

- Değer alanını, sütunun View Option → `Domain` ile gösterilen değer alanı hücresinde ya da `Logical Names` görünümünde bu hücrenin yerine duran tür hücresinde seçmek. [Değer alanı hücresi](./logical-names.md#the-domain-cell) bölümüne bakın.
- Terimi bir değer alanı veren bir mantıksal ad. [Terimden](#from-a-term) bölümüne bakın. Bu yalnızca ad türetilirken olur, bu yüzden kendi yazdığınız bir adda ya da türetilen adını başka bir sütunun taşıdığı bir sütunda olmaz.
- Kapsanan her sütunu teriminin değer alanına bağlayan `Derive Physical Name Again` veya `Derive Physical Names Again`.
- Bir ilişki: yabancı anahtar sütunu, anahtarının değer alanını türü ve mantıksal adıyla birlikte kopyalar. [Tanımlayıcı ilişkiler](./relationship-editing.md#identifying-relationships) bölümüne bakın. Serial anahtarda olduğu gibi kopyası başka bir tür alan bir anahtar hiçbir değer alanı aktarmaz.
- Tablosunu çoğaltmak ya da sütunu sürükleme tutamacıyla başka bir tabloya taşımak. İkisi de bağlantıyı korur. Kopyalanan tabloların veya sütunların yapıştırılması bağlantıyı yalnızca bu diyagram değer alanını listeliyorsa ve değer alanı hâlâ kopyalanan sütunun türüne sahipse korur, bu yüzden başka bir diyagramdan gelen kopya bağlantısız gelir. [Tabloları ve notları kopyalama/yapıştırma](./table-related-functions.md#copyingpasting-tables-and-memos) bölümüne bakın. `Import and Add` hiçbir sütunu bağlamaz.
- Bir değer alanı hücresine yapıştırılan bir değer alanı adı. [Sütunları kopyalama/yapıştırma](./table-editing.md#copyingpasting-columns) bölümüne bakın.

### Bağlantıyı kaldırma {#unlinking}

- Bağlı bir sütunun `DataType` hücresine bir tür yazmak ya da bir öneriyi kabul etmek, sütunun türü değer alanınınkinden farklı olduğu anda sütunun bağlantısını kaldırır ve sütun yazdığınız türü korur. [Veri türü otomatik tamamlama](./table-editing.md#datatype-autocomplete) bölümüne bakın. Değer alanının türünü yeniden yazmak sütunu yeniden bağlamaz. Bunun yerine değer alanını sütunun değer alanı hücresinde seçin. `DataType` hücresinin üzerine yapıştırmak ve bir kodlama ajanının tür değişikliği de bağlantıyı aynı şekilde kaldırır.
- İlişkilerde veri türü eşitleme açıkken, bir tür değişikliğinin ulaştığı ve yeni türü kendi değer alanının türünden farklı olan her sütunun, örneğin kendi değer alanına bağlı bir yabancı anahtarın, bağlantısı aynı adımda kaldırılır. [Sütunları eşle](./relationship-editing.md#map-columns) iletişim kutusu, türünü değiştirdiği sütunların bağlantısını aynı şekilde kaldırır.
- Değer alanı hücresindeki `None` sütunun bağlantısını kaldırır ve türünü korur.
- Terimin `Domain` değerini değiştirmek veya temizlemek ya da bir terimi kaldırmak hiçbir sütunu değiştirmez.

### Değer alanını kaldırma {#removing-a-domain}

Bir değer alanının satırını kaldırmak sütunlarını mevcut türlerinde bırakır ve bağlantıları da kalır. Sütunlar hiçbir değer alanı göstermez ve `Domains` sayfasında hâlâ bir değer alanı bulunduğu sürece `Checks` sayfası her biri için `Unknown domain` denetimini listeler. Kaldırmayı `Domains` sayfasında geri almak bağlantıları yeniden gösterir.  
Değer alanı yokken böyle bir sütuna değer alanınınkinden farklı bir tür yazmak sütunun bağlantısını kalıcı olarak kaldırır, değer alanı hücresindeki `None` da öyle.  
Dosya kaydedilirken bu bağlantılar dosyaya alınmaz, bu yüzden diyagram yeniden açıldığında bu sütunlar bağlantısızdır.

Kaldırılmış bir değer alanına bağlı bir terim, `Unknown domain` olarak işaretlenmiş boş bir `Domain` hücresi gösterir. Hücrede `Delete` veya `Backspace` tuşu terimin bağlantısını kaldırır. [Terimin değer alanı](#a-terms-domain) bölümüne bakın.

## Denetimler sayfası {#the-checks-sheet}

`Checks` sayfası, sözlüklerin denetimlerinin sözlüklerde ve diyagramın tablo ve sütunlarında bulduklarını listeler. Denetimler yalnızca okur: hiçbir şeyi değiştirmez.  
Her denetim yalnızca okuduğu sayfada bir satır bulunduğu sürece, sözcük denetimleri ise yalnızca `Words` sayfasında adı olan bir sözcük bulunduğu sürece çalışır, bu yüzden sözlükleri boş bir diyagram hiçbir şey listelemez.

![Logical Names görünümünde Customer Num adının kırmızı, Order Stat adının kehribar renginde gösterilmesi, Checks sayfasının bunların üç denetimini kırmızı bir sayıyla listelemesi, Forbidden word satırına çift tıklayarak diyagramdaki Customer Num adına geri gitme ve onu Member Number olarak yeniden yazıp tek bir denetim bırakma](/img/demo-dictionary-checks.webp)

Üç sütunu da salt okunurdur:

- `Type` denetimin adını verir. [Her denetimin buldukları](#what-each-check-finds) bölümüne bakın.
- `Target` bir sözcüğü, terimi veya değer alanını adıyla, bir tabloyu adıyla, bir sütunu ise `table.column` biçiminde belirtir. Tablo ve sütun [Ad görünümünün](./logical-names.md#beyond-the-canvas) adlandırdığı gibi adlandırılır ve görünümün ad göstermediği yerde `unnamed` yazar.
- `Detail`, denetimin bulduğunu ve `→` işaretinden sonra sözlüklerin bunun yerine önerdiklerini, birden çoksa virgülle birleştirerek gösterir, örneğin `멤버 → 회원`. Boş bir tarafta `— → NUMERIC(15)` örneğinde olduğu gibi `—` yazar.

Önce sözcüklerin, ardından terimlerin ve değer alanlarının denetimleri gelir, sonra tablo tablo ilerlenir ve her tablonun ardından sütunları gelir.  
Liste, bir ortak çalışanın ve bir kodlama ajanının düzenlemeleri dahil her düzenlemeyi gerçekleştiği anda ve her Ad görünümü değişikliğini izler.  
`Checks` düğmesindeki sayı, herhangi bir denetim hata düzeyindeyken kırmızı, hepsi uyarı düzeyindeyken kehribar rengi, hiç denetim yokken soluktur.

Satırlar düzenlenemez, eklenemez, silinemez, sıralanamaz, içe veya dışa aktarılamaz: çubuk hiçbir araç göstermez, sağ tıklama ızgara menüsünü açmaz, geri alma ve yineleme de hiçbir şey yapmaz. Arama, seçme ve kopyalama diğer sayfalardaki gibi çalışır.

Bir satırda `Enter` tuşu veya çift tıklama satırın belirttiği öğeye gider:

- Bir sözcük, terim veya değer alanı: sekme ilgili sayfayı gösterir, denetimin okuduğu hücreyi, yani adı ya da terimin `Domain` değerini seçer ve satırı görünümün en üstüne getirir. Sayfanın araması satırı gizliyorsa temizlenir. Sonradan kaldırılmış bir satır hiçbir yere gitmez.
- Bir tablo veya sütun: ERD sekmesi açılır, yalnızca o tablo seçilir ve denetimin okuduğu hücre odağa alınır. Bu hücre ad, mantıksal ad veya değer alanı hücresidir ya da satır o hücreyi göstermiyorsa onun yerine gösterilen hücredir. Klavye odağı tuvale geçer ve görünüm [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümündeki kurala göre kayar.

Bir sütun başlığına, bir sütun kenarına, bir kaydırma çubuğuna veya satırların altına çift tıklamak hiçbir yere gitmez.  
Bir kodlama ajanı aynı denetimleri aynı sırayla `erd_list_checks` aracıyla listeler. [Sözlük denetimleri](../../mcp/tools.md#dictionary-checks) bölümüne bakın.

Diğer üç sayfa, denetimlerin okuduğu hücreleri, yani bir adı ya da terimin `Domain` değerini, renkli bir zemin üzerinde kırmızı veya kehribar rengi metinle işaretler:

- Kırmızı: sayfasındaki başka bir satırın da sahip olduğu bir ad, kaldırılmış bir değer alanını bağlayan bir terimin `Domain` değeri ve yasaklı bir sözcük kullanan bir `Term` değeri.
- Kehribar: eş anlamlı bir sözcük veya kayıtlı olmayan bir sözcük kullanan bir `Term` değeri.

Bir hücre, düzeylerinden daha ağır olanının rengini alır. İşaretler salt okunur bir düzenleyicide de görünür, `Checks` sayfasının kendisi ise renklendirilmez. ERD tuvalindeki işaretler için [Tuvaldeki işaretler](#marks-on-the-canvas) bölümüne bakın.

### Her denetimin buldukları {#what-each-check-finds}

| `Type` | Düzey | Bulunan | Örnek `Detail` değeri |
| --- | --- | --- | --- |
| `Duplicate name` | Hata | Aynı sayfadaki başka bir satırın da sahip olduğu bir `Word`, `Term` veya `Domain` değeri. Satırların her biri listelenir. | `Member` |
| `Unknown domain` | Hata | `Domains` sayfasında bir değer alanı bulunurken, hâlâ kaldırılmış bir değer alanına bağlı olan bir sütun veya terim | Kaldırılan değer alanının adı |
| `Forbidden word` | Hata | Bir mantıksal adın veya bir `Term` değerinin, bir sözcüğün `Forbidden Words` değerinde listelediği bir bölümü | `커스터머 → 고객` |
| `Unregistered word` | Uyarı | Bir tablonun veya sütunun mantıksal adının ya da bir `Term` değerinin, hiçbir sözcüğün listelemediği bir bölümü | `자` |
| `Synonym` | Uyarı | Bir sözcüğün `Synonyms` değerinde listelediği bir bölüm | `멤버 → 회원` |
| `Physical name mismatch` | Uyarı | Mantıksal adı bir terimle eşleşen ancak fiziksel adı terimin verdiği ad olmayan bir tablo veya sütun | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Uyarı | `DataType` değeri, bağladığı değer alanının `Data Type` değeri olmayan bir sütun | `INT → NUMERIC(15)` |

- Adlar baştaki ve sondaki boşluklar kırpılarak ve büyük/küçük harf ayrımı yapılarak karşılaştırılır, bu yüzden `Member` ve `member` iki ayrı addır ve boş bir ad hiçbir zaman yinelenen ad sayılmaz. Sayfalar iki satıra aynı adı verecek bir düzenlemeyi reddeder, bu yüzden `Duplicate name` yalnızca, iki ortak çalışanın satırları aynı anda adlandırması gibi iki düzenlemenin çakıştığı yerlerde ya da başka bir yerde düzenlenmiş bir dosyada ortaya çıkar.
- Sözcük denetimleri bir adı [Sözcüklerden](#from-the-words) bölümünde anlatıldığı gibi okur ve her farklı bölümü ad başına bir kez listeler. `Forbidden word` ve `Synonym`, o bölümü listeleyen sözcüğü önerir.
- `Physical name mismatch`, kırpılmış adı terimin `Physical Name` değeriyle ya da bu değer yoksa sözcüklerinin oluşturduğu adla karşılaştırır ve terim hiçbir ad vermediği sürece hiçbir şey bildirmez. Anahtarının mantıksal adını kopyalamış bir yabancı anahtar sütunu, kendi adı terimin verdiği addan farklı olduğu her durumda bu denetimi gösterir, örneğin `members_id → MBR_ID`. Başka bir sütun o adı taşımıyorsa `Derive Physical Name Again` bunu düzeltir.
- `Domain type mismatch` tek bir düzenleyicideki düzenlemelerden hiçbir zaman doğmaz, çünkü bağlı bir sütun her zaman sonunda değer alanının türünü alır. Bir ortak çalışan bir sütunu bağlarken başka biri o değer alanının türünü değiştirdiğinde ya da başka bir yerde yazılmış bir dosyada ortaya çıkabilir. Değer alanını sütunun değer alanı hücresinde yeniden seçmek sütuna değer alanının türünü verir, `None` ise bağlantıyı kaldırır. Kaldırılmış bir değer alanına olan bağlantı yalnızca `Unknown domain` olarak görünür.

### Tuvaldeki işaretler {#marks-on-the-canvas}

ERD tuvali, denetimlerin sorun bulduğu bir adı ilgili denetimin rengiyle yazar:

- Tablo başlığındaki veya bir sütunun satırındaki mantıksal ad hücresi, mantıksal adı yasaklı bir sözcük kullanıyorsa kırmızı, aksi hâlde eş anlamlı bir sözcük veya `Words` sayfasında olmayan bir sözcük kullanıyorsa kehribar renginde yazılır.
- Başlıktaki veya bir satırdaki fiziksel ad hücresi, mantıksal adının eşleştiği terim başka bir fiziksel ad veriyorsa kehribar renginde yazılır.

Yalnızca bu iki tür hücre işaretlenir, değer alanı veya `DataType` hücresi asla işaretlenmez, bu yüzden bir sütunun `Unknown domain` ve `Domain type mismatch` denetimleri yalnızca `Checks` sayfasında görünür.  
Bir hücre yalnızca gösterdiği şey için işaretlenir: `Physical Names` görünümü yalnızca fiziksel adları, `Logical Names` görünümü yalnızca mantıksal adları, `Both Names` görünümü ise her hücreyi kendi denetimlerine göre işaretleyebilir. [Ad görünümü](./logical-names.md#name-view) bölümüne bakın. Boş bir hücre yer tutucu rengini korur ve boş sözlükler hiçbir şeyi işaretlemez.  
Renkli bir [tablo grubundaki](./table-groups.md) bir tablonun başlığında, işaret yalnızca grubun rengi üzerinde okunabilir kaldığı sürece rengini korur. Aksi hâlde ad, başlığın kendi siyah veya beyaz rengini alır.

İşaretler ERD tuvalinde, [Zaman yolculuğunda](./undo-redo.md#time-travel) ve [Otomatik düzenin](./table-related-functions.md#auto-layout) önizlemesinde, salt okunur bir düzenleyicide de görünür. Görselleştirme sekmesi, [Fark görüntüleyicinin](./table-related-functions.md#diff-viewer) iki tarafı ve dışa aktarılan bir görüntü hiçbir işaret göstermez.  
İşaretler, ister bir adda ister bir sözcükte, terimde veya değer alanında olsun, her değişikliği gerçekleştiği anda izler.

## Arama {#searching}

Arama alanında `Search` yazar. Alan dört sayfanın hepsinde, salt okunur bir düzenleyicide de görünür. Her sayfanın kendi araması vardır.  
Aranan hücrelerden biri metni içerdiğinde satır eşleşir. Bu karşılaştırmada büyük/küçük harf ayrımı yapılmaz, Unicode normalleştirme biçimi ve arama metninin çevresindeki boşluklar da yok sayılır. Bir eşleşme hiçbir zaman iki hücreye yayılmaz. Aranan hücreler:

- `Domains`: `Domain`, `Data Type` ve `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` ve `Description`.
- `Terms`: `Term`, `Physical Name` ve `Description`.
- `Checks`: görüntüleme dilinde göründükleri biçimiyle üçü de.

Yeni bir arama seçimi ilk hücreye taşır ve en üste kaydırır.  
Alanda metin varken, araç ipucunda `Clear search` yazan bir `x` düğmesi alanı boşaltır ve metin imlecini alanda bırakır. Alandayken `Escape` tuşu da alanı boşaltır.  
Alanda `Ctrl + Z` (Windows/Linux) veya `⌘ + Z` (Mac) sayfayı değil, yazdığınızı geri alır ve [Satır ekleme ve silme](#adding-and-deleting-rows) bölümündeki satır tuşları metin tuşlarıdır.  
`Add Row` ve satır ekleme işlemleri, boş bir satır hiçbir aramayla eşleşmediği için önce aramayı temizler. İçe aktarma ise aramayı korur.

## Seçme ve gezinme {#selecting-and-moving}

Izgarada seçim, bir elektronik tablodaki gibi yapılır:

- Tıklama bir hücreyi seçer, sürükleme ise sayfanın kenarına gelindiğinde kaydırarak bir aralık seçer. `Shift + click` seçimi etkin hücreden genişletir, `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac) ise başka bir aralık ekler.
- Bir sütun başlığı sütununu, bir satır numarası satırını, sol üst köşe ise `Ctrl + A` (Windows/Linux) veya `⌘ + A` (Mac) tuşlarının yaptığı gibi her hücreyi seçer.
- Mac'te `Ctrl + click` bir sağ tıklamadır. [Izgara menüsü](#the-grids-menu) bölümüne bakın.

Klavyeyle:

- Ok tuşları bir hücre ilerler, `Ctrl` (Windows/Linux) veya `⌘` (Mac) basılı tutulduğunda ise o yönde sayfanın kenarına gider.
- `Home` ve `End` satırın ilk ve son hücresine, `Ctrl` veya `⌘` basılı tutulduğunda ise sayfanın ilk ve son hücresine gider.
- `Page Up` ve `Page Down` bir ekran dolusu satır ilerler.
- Yukarıdaki tuşlardan herhangi birine `Shift` basılı tutularak basıldığında bunun yerine seçim genişletilir.
- `Tab` ve `Shift + Tab` sağa ve sola, `Shift + Enter` yukarı gider. Tek başına `Enter` hücreyi düzenler. [Hücreleri düzenleme](#editing-cells) bölümüne bakın.

Bir geri alma veya bir ortak çalışanın kaldırması nedeniyle seçimin altındaki satırlar ortadan kalktığında, seçim kalan satırların içine geri çekilir.

Sütunu yeniden boyutlandırmak için sütun başlığının sağ kenarını sürükleyin ya da sütunu görünümdeki satırlarda en geniş metne sığdırmak için kenara çift tıklayın. Hiçbir tuş bir sütunu yeniden boyutlandırmaz.

## Hücreleri düzenleme {#editing-cells}

Seçili hücrede yazmak hücrenin değerini değiştirir. `Enter`, `F2` veya çift tıklama, metin imleci sonunda olacak şekilde değeri olduğu hâliyle düzenler.  
Bir hücre tek satır tutar, bu yüzden hücreye yapıştırılan bir sekme karakteri veya satır sonu boşluğa dönüşür.

- `Enter` düzenlemeyi yazar ve aşağı gider, `Tab` ise yazar ve sağa gider. `Shift` ile yukarı veya sola giderler.
- Başka bir yere tıklamak veya klavye odağının ızgaradan çıkması da düzenlemeyi yazar.
- `Escape` düzenlemeyi iptal eder.

![Words sayfasını düzenleme: bir hücrenin üzerine NUM yazıp Enter tuşuna basma, ⌥ + Enter ile bir satır ekleyip Tab ile doldurma, ızgara menüsünden Word sütununa göre sıralama, ardından ord araması yapıp aramayı Esc ile boşaltma](/img/demo-dictionary-editing.webp)

Değeri olduğu gibi bırakan bir düzenleme hiçbir şey yazmaz, yazılan bir düzenleme ise ne kadar metin yazılmış olursa olsun sayfasının tek bir geri alma adımıdır.  
Açık bir düzenleme yokken `Delete` veya `Backspace` her seçili hücreyi tek adımda boşaltır.  
Bir düzenleme açıkken geri alma ve yineleme tuşları hücreye yazdıklarınızı geri alır ve yineler, satır tuşları ise metin olarak yazar. [Sekmedeki tuşlar](#keys-on-the-tab) bölümüne bakın.  
`Checks` sayfasındaki her hücre ve salt okunur bir düzenleyicideki her hücre salt okunurdur ve düzenleme için açılmaz.

Bir düzenlemenin, yapıştırmanın veya temizlemenin herhangi bir satırı reddedildiğinde hiçbir kısmı kaydedilmez ve bir hata bildirimi, satırları sayıp ilk üçünü adlandırarak nedenini belirtir:

- Sayfadaki başka bir satırın sahip olduğu ya da aynı yapıştırmanın başka bir satırının yazdığı bir ad: `Nothing saved: 1 row shares a name with another row (Member)` veya `Nothing saved: 2 rows share a name with another row (…)`. Adlar kırpılarak ve büyük/küçük harf ayrımı yapılarak karşılaştırılır, bu yüzden `Member` ve `member` farklıdır. Boş bir ad hiçbir zaman reddedilmez.
- Terimin `Domain` değeri olarak, `Domains` sayfasındaki hiçbir değer alanının adı olmayan bir metin verilmesi: `Nothing saved: 1 row names an unknown domain (…)`.
- Siz düzenlerken bir ortak çalışanın kaldırdığı bir satır: `Nothing saved: the row was removed`.

Bir yazma işlemi kendi hücresinin ötesine uzanabilir:

- `Physical Name` değeri boşken `Term` değeri verilen bir terim, sözcükleri bir ad oluşturuyorsa bu adı alır. [Sözcüklerden](#from-the-words) bölümüne bakın. Bu bir kez olur: sözcükler sonradan değiştiğinde ad yeniden oluşturulmaz.
- Değer alanının yeni `Data Type` değeri, değer alanına bağlı her sütunun türünü aynı geri alma adımında değiştirir. [Değer alanları ve veri türleri](#domains-and-data-types) bölümüne bakın.

### Terimin değer alanı {#a-terms-domain}

Terimin `Domain` hücresinde `Enter`, `F2` veya çift tıklama, hücrenin altında ya da yukarıda daha çok yer varsa üstünde, `Domain` yazan bir arama alanıyla birlikte bir liste açar.  
Listede önce `None`, ardından `Domains` sayfasındaki sırayla adı olan her değer alanı bulunur. Vurgu, terimin bağladığı değer alanında ya da `None` öğesinde başlar. Hücrede bir karakter yazmak listeyi o karakterle aranmış olarak açar.

- Yazmak listeyi, büyük/küçük harf ayrımı yapmadan, adı metni içeren değer alanlarına daraltır, `None` öğesini çıkarır ve ilk eşleşmeyi vurgular.
- `↑` ve `↓` vurguyu taşır ve iki uçta da öbür uca geçer.
- `Enter` veya `Tab` vurgulu satırı, tıklama ise tıklanan satırı tek bir geri alma adımı olarak seçer. Terim, aynı adlı iki değer alanından biri bile olsa tam olarak seçilen değer alanını bağlar, `None` ise bağlantıyı kaldırır.
- `Escape` veya dışarıya tıklama, yazdıklarınızı hücreye yazmadan listeyi kapatır.

`Domains` sayfasında adı olan hiçbir değer alanı yoksa alan listesiz açılır.  
Yapıştırılan metin o adla listelenen ilk değer alanını bağlar, boş metin bağlantıyı kaldırır, hücrenin gösterdiğine eşit metin ise bağlantıyı olduğu gibi korur. Başka herhangi bir ad reddedilir. [Hücreleri düzenleme](#editing-cells) bölümüne bakın. Hücrede `Delete` veya `Backspace` tuşu, kaldırılmış bir değer alanına olsa bile terimin bağlantısını kaldırır.

## Kopyalama ve yapıştırma {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) veya `⌘ + C` (Mac) seçimi, elektronik tabloların yazdığı biçimde, her satır için bir satır olmak üzere sekmeyle ayrılmış metin olarak kopyalar, böylece metin bir elektronik tabloya hücreler olarak yapıştırılır. Bir değerin içindeki sekme karakteri veya satır sonu boşluğa dönüşür.  
Birden çok aralık yalnızca yan yana aynı satırları ya da üst üste aynı sütunları kapsadığında birlikte kopyalanır. Aksi hâlde hiçbir şey kopyalanmaz ve `Nothing copied: the ranges share no rows or columns` hata bildirimi görünür.

`Ctrl + V` (Windows/Linux) veya `⌘ + V` (Mac), bir elektronik tablodan kopyalanan hücreler gibi sekmeyle ayrılmış metni etkin hücreden aşağıya ve sağa doğru yapıştırır:

- Tırnak işaretleri metin olarak yapıştırılır, bu yüzden satır sonu içeren bir elektronik tablo hücresi tek bir hücre olarak yapıştırılmaz.
- Tek bir değer her seçili aralığı doldurur.
- Son satırı aşan satırlar sırayla yeni satır olarak eklenir, bu yüzden boş bir sayfaya yapıştırmak sayfayı doldurur.
- Son sütunu aşan sütunlar dışarıda bırakılır ve geri kalanı kaydedildikten sonra `Columns past the last one weren't pasted` bildirimi bunu belirtir.
- Birden çok hücrelik bir yapıştırma ardından yazdığı bloğu seçer.

Bir yapıştırma, eklediği satırlar dahil tek bir geri alma adımıdır ve yinelenen bir ad ya da bilinmeyen bir değer alanı nedeniyle bütünüyle reddedilir. [Hücreleri düzenleme](#editing-cells) bölümüne bakın.  
Bir milyondan fazla hücreyi kapsayan bir kopyalama, yapıştırma veya temizleme hiçbir şey yapmaz ve `Nothing done: the selection covers too many cells` hata bildirimi görünür.  
Kesme, yani `Ctrl + X` (Windows/Linux) veya `⌘ + X` (Mac), bir sayfada hiçbir şey yapmaz. Bu sekmedeki kopyalama ve yapıştırma hiçbir zaman diyagrama ulaşmaz ve bir hücre düzenlemesi açıkken hücredeki metin üzerinde çalışır.

## Satır ekleme ve silme {#adding-and-deleting-rows}

`Add Row` sayfanın sonuna boş bir satır ekler. Aramayı temizler, yeni satırın ilk hücresini seçer ve klavye odağını ızgaraya verir, böylece yazmak o hücreyi doldurur.  
`Delete Rows`, seçim hangi sütunda olursa olsun seçimin kapsadığı her satırı kaldırır ve tek bir geri alma hepsini yerlerine geri koyar. Araç ipucu aynı işi yapan tuşu belirtir.

Klavye odağı ızgaradayken ve hiçbir hücre düzenlenmiyorken:

- `Alt + Enter` (Windows/Linux) veya `⌥ + Enter` (Mac), seçimin altına kapsadığı satır sayısı kadar boş satır ekler.
- `Alt + Shift + Enter` (Windows/Linux) veya `⌥ + Shift + Enter` (Mac) bu satırları üstüne ekler.
- `Alt + Backspace` veya `Alt + Delete` (Windows/Linux) ya da `⌥ + Backspace` veya `⌥ + Delete` (Mac), seçimin kapsadığı satırları siler.

Bu tuşlar, ızgara menüsündeki satır ekleme ve satır silme öğelerinin yaptığını yapar. [Izgara menüsü](#the-grids-menu) bölümüne bakın. Satır ekleme aramayı temizler ve yeni satırları seçimin kapsadığı ilk satırın hemen üstüne ya da son satırının hemen altına koyar. Yeni satırları ilk sütunda, ilki etkin olacak şekilde seçer ve tek bir geri alma adımıdır.

Bu tuşlar [Kısayollar](./settings.md#shortcuts) sekmesindeki `Add Column` ve `Remove Column` bağlamalarıdır, bu yüzden bunları [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) yöntemiyle yeniden bağlayan bir ana uygulama bu tuşları da değiştirir. `Alt + Shift + Enter`, `Shift` eklenmiş `Add Column` tuşudur ve orada kendine ait bir satırı yoktur.  
Açık bir düzenlemede ve arama alanında bunlar metin tuşlarıdır, bu yüzden Mac'te `⌥ + Backspace` bir sözcük siler. `Checks` sayfasında ve salt okunur bir düzenleyicide hiçbir şey yapmazlar. Bu sekmede hiçbir zaman bir tablonun sütununu eklemez veya kaldırmazlar.  
Obsidian'da, bir Obsidian kısayol tuşu aynı tuşu kullansa bile bu tuşlar sekmeye ulaşır.

Hiç doldurulmamış ya da tüm değerleri boşaltılmış bir satır sayfasında görünür ve ortak çalışanlara ulaşır, ancak dosyaya alınmaz, bu yüzden diyagram yeniden açıldığında kaybolur.

## Izgara menüsü {#the-grids-menu}

Izgara menüsünü açmak için `Domains`, `Words` veya `Terms` sayfasında bir hücreye sağ tıklayın. Seçimin dışındaki bir hücre önce seçim olur.  
Son satırın altına veya son sütunun sağına sağ tıklamak menüyü seçimin o anki hâli için açar, bu yüzden boş bir sayfada menü, sütun başlıklarının altında herhangi bir yerde açılır. Menü tuşu veya `Shift + F10` menüyü etkin hücre için açar.

- `Insert 1 row above`, `Insert 1 row below` ve `Delete 1 row`. Her biri, `Insert 3 rows above` örneğinde olduğu gibi seçimin kapsadığı satırları sayar ve tuşunu sağda gösterir. [Satır ekleme ve silme](#adding-and-deleting-rows) bölümüne bakın.
- `Sort by <column>, ascending` ve `Sort by <column>, descending`. İkisi de `Sort by Word, ascending` örneğinde olduğu gibi sağ tıkladığınız sütunu adlandırır. [Sıralama](#sorting) bölümüne bakın. Son sütunun sağında bu öğeler yer almaz.
- Çubuktaki düğmelerin yaptığını yapan `Import CSV` ve `Export CSV`. [CSV içe ve dışa aktarma](#importing-and-exporting-csv) bölümüne bakın.

Boş bir sayfada ya da hiçbir şeyle eşleşmeyen bir aramada olduğu gibi hiçbir satır görünmezken yalnızca `Insert 1 row below`, `Import CSV` ve `Export CSV` görünür.  
`Checks` sayfası ve salt okunur bir düzenleyici bunun yerine tarayıcının kendi menüsünü açar, bir sütun başlığına veya kaydırma çubuğuna sağ tıklamak da öyle.  
Menü, bir öğe seçildiğinde, `Escape` tuşuna basıldığında, sekmede başka bir yere basıldığında, seçim veya sayfa değiştiğinde ve sayfanın satırları sizin ya da bir ortak çalışanın düzenlemesiyle değiştiğinde kapanır.

## Sıralama {#sorting}

`Sort by <column>, ascending` ve `Sort by <column>, descending` yalnızca görünümü değil, sayfanın satırlarının kendisini yeniden sıralar. Yeni sıra dosyaya kaydedilir, ortak çalışanlar onu görür ve `Export CSV` bu sırayı izler. Tek bir geri alma eski sırayı geri getirir.  
Satırlar, hücrenin gösterdiği metne göre, terimin `Domain` değeri ise değer alanının adına göre, görüntüleme dilinin alfabetik sırasıyla karşılaştırılır. Sayılar değerlerine göre karşılaştırılır, bu yüzden `2`, `10` değerinden önce gelir. Boş hücreler her iki yönde de en sona gider ve eşit sayılan satırlar sıralarını korur. Zaten o sırada olan bir sayfayı sıralamak hiçbir şey kaydetmez.  
Arama olduğu gibi kalır, seçim de öyle, ancak seçimin hücrelerinde artık başka satırlar bulunur.

## CSV içe ve dışa aktarma {#importing-and-exporting-csv}

`Domains`, `Words` ve `Terms` sayfalarının her biri bir CSV dosyasından içe aktarılır ve bir CSV dosyasına dışa aktarılır. Bu dosyalar Sözlük sekmesine özgüdür: tuvalin bağlam menüsündeki `Import` ve `Export` bunları ne okur ne yazar. [Dosyaları içe veya dışa aktarma](./file-import-export.md) sayfasına bakın.

### İçe aktarma {#importing}

Çubukta veya ızgara menüsünde bulunan `Import CSV`, ana uygulamanın içe aktarma iletişim kutusunu değil, tarayıcının `.csv` dosyaları için kendi dosya seçicisini açar. Aynı dosyayı yeniden seçmek onu yeniden içe aktarır.  
Dosya, hangi sayfa gösteriliyor olursa olsun başlık satırının belirttiği sözlüğe aktarılır, ardından sekme o sayfayı gösterir ve klavye odağını ızgarasına verir. Sayfa aramasını, seçimini ve kaydırma konumunu korur, bu yüzden aramanın gizlediği satırlar ya da görünümün altına eklenen satırlar görünmez kalır.  
Dosya, bayt sırası işareti (BOM) olsun ya da olmasın UTF-8 olarak, geçerli bir UTF-8 değilse de eski kamu veri standardı dosyalarında olduğu gibi EUC-KR olarak okunur.

![Sözlük sekmesini araç çubuğundan açma, ardından Import CSV ile değer alanlarını, sözcükleri ve terimleri içe aktarma, her dosyanın sekmeyi kendi sayfasına geçirmesi ve eklediklerini bildirmesi](/img/demo-dictionary-import.webp)

Satırların aktarılma biçimi:

- Adı olan her satır, sayfadaki aynı adlı satırı, dosyada sütunu bulunan alanlarda günceller. Dosyada sütunu olmayan alanlar olduğu gibi kalır. Adlar kırpılarak ve büyük/küçük harf ayrımı yapılarak karşılaştırılır.
- Sayfada olmayan adlar, dosyadaki sırayla sayfanın son satırından sonra eklenir.
- İçe aktarma hiçbir zaman satır kaldırmaz.
- Adı boş bir satır atlanır. Dosyada bir ad iki kez geçtiğinde sonraki satır geçerli olur ve önceki atlanmış sayılır. Dosyadaki boş satırlar satır olarak sayılmaz.
- Terimin değer alanı adıyla, yani o adı taşıyan ilk değer alanı olarak bulunur. Hiçbir değer alanının taşımadığı bir ad terimi bağlantısız bırakır, bu yüzden önce değer alanlarını içe aktarın.

Bir içe aktarma, o sayfanın tek bir geri alma adımıdır.  
Ardından bildirimde örneğin `1 added · 1 updated · 2 skipped` yazar. Sayfadakiyle aynı olan bir satır ne eklenmiş ne de güncellenmiş sayılır, bu yüzden aynı dosyayı yeniden içe aktarmak hiçbir şey değiştirmez ve adım kaydetmez.  
Dosyadaki terimler diyagramda olmayan değer alanlarını belirttiğinde, `4 unknown domains: 연월일, 금액, 번호` örneğinde olduğu gibi ikinci bir satır ilk üçünü adlandırır.  
Başlık satırı hiçbir düzenle eşleşmeyen ya da iki düzenle birden eşleşen bir dosya hiçbir şey getirmez ve `Couldn't read this file as words, terms or domains` hata bildirimi görünür.

### Dosya düzenleri {#file-layouts}

Her sözlük iki düzeni okur. Birincisi, `Export CSV` öğesinin yazdığı, başlık satırında alan adlarının bulunduğu düzenleyicinin kendi düzenidir:

| Sözlük | Başlık satırı | Dosyada bulunması gereken |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

Sütunlar herhangi bir sırada olabilir, terimin `domain` sütunu değer alanının adını tutar ve diğer tüm sütunlar yok sayılır. Başlık satırında büyük/küçük harf fark eder ve hücreler, boşluklar dahil tam olarak yazıldıkları gibi okunur.

İkincisi, Kore'nin kamu veri standardının (공통표준) dosyalarının düzenidir:

| Sözlük | Dosyada bulunması gereken | Ayrıca okunan |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (kısaltma), `공통표준단어 영문명` (İngilizce ad), `공통표준단어 설명` (tanım), `이음동의어 목록` (eş anlamlılar), `금칙어 목록` (yasaklı sözcükler) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (fiziksel ad), `공통표준도메인명` (değer alanı, adıyla), `공통표준용어설명` (tanım), `용어 이음동의어 목록` (eş anlamlılar) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategori), `공통표준도메인설명` (tanım), `데이터길이`, `데이터소수점길이` |

Değer alanının `데이터타입`, `데이터길이` ve `데이터소수점길이` değerleri tek bir veri türünde birleşir: `NUMERIC(15,2)`, `CHAR(8)`, uzunluk yoksa `DATE` gibi yalnızca tür, ondalık basamak sayısı 0 ise de `NUMERIC(15)` örneğinde olduğu gibi bu sayı yazılmaz.  
Bu dosyalarda hücrelerin baştaki ve sondaki boşlukları kırpılır, değişiklik geçmişi gibi diğer sütunlar yok sayılır.  
Her iki düzende de bir başlık adındaki boşlukların önemi yoktur.

### Dışa aktarma {#exporting}

Çubukta veya ızgara menüsünde bulunan `Export CSV`, gösterilen sayfayı düzenleyicinin kendi düzeninde kaydeder: aramanın ne gösterdiğinden bağımsız olarak her satır sayfadaki sırasıyla yazılır ve terimin değer alanı adıyla yazılır ya da kaldırılmış bir değer alanı için boş bırakılır.  
Dosya bayt sırası işaretli ve CRLF satır sonlu UTF-8 biçimindedir ve yalnızca tırnak işareti, virgül veya satır sonu içeren bir alan tırnak içine alınır. Dosya bir elektronik tabloda açılır ve yeniden içe aktarıldığında aynı satırları verir.  
Dosya `<database name>-<timestamp>-words.csv`, `-terms.csv` veya `-domains.csv` olarak adlandırılır ve düzenleyicinin diğer dışa aktarmaları gibi kaydedilir. [Dışa aktarma](./file-import-export.md#exporting) bölümüne bakın.

`Checks` sayfasının dışa aktarması yoktur ve salt okunur bir düzenleyici içe veya dışa aktarma sunmaz.

## Geri alma ve yineleme {#undo-and-redo}

`Domains`, `Words` ve `Terms` sayfalarının her biri, diyagramınkinden ayrı kendi geri alma geçmişini tutar. Bu sekmede `Ctrl + Z` ve `Ctrl + Shift + Z` (Windows/Linux) veya `⌘ + Z` ve `⌘ + Shift + Z` (Mac) ile araç çubuğundaki `Undo` ve `Redo` gösterilen sayfada çalışır ve araç çubuğunda `Time Travel` düğmesi görünmez. `Checks` sayfasında bunlar hiçbir şey yapmaz.  
ERD sekmesindeki geri alma işlemi hiçbir zaman bir sayfadaki düzenlemeyi geri almaz. [Sözlük sayfaları](./undo-redo.md#dictionary-sheets) bölümüne bakın.

## Sekmedeki tuşlar {#keys-on-the-tab}

Klavye odağı sekmedeyken, [Kısayollar](./settings.md#shortcuts) bölümünde anlatılan şu düzenleyici kısayolları çalışır:

- `Search`, yani `Ctrl + K` (Windows/Linux) veya `⌘ + K` (Mac), [Hızlı aramayı](./quick-search.md) açar.
- `Toggle Explorer`, yani `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac), ERD sekmesine geçer ve [Gezgini](./explorer.md#opening-and-closing) arama alanına odaklanmış olarak açar.
- `Undo` ve `Redo` gösterilen sayfada çalışır. [Geri alma ve yineleme](#undo-and-redo) bölümüne bakın.
- `Add Column` ve `Remove Column` satır ekler ve siler. [Satır ekleme ve silme](#adding-and-deleting-rows) bölümüne bakın.

Terimin değer alanı listesi dahil bir hücre düzenlemesi açıkken `Search` ve `Toggle Explorer` hiçbir şey yapmaz, böylece yazılan metin kaybolmaz.

Diğer tüm düzenleyici kısayolları sekmede kalır ve hiçbir zaman tuvale ulaşmaz: `Alt + N` (Windows/Linux) veya `⌥ + N` (Mac) tablo eklemez, `Delete` ve `Backspace` de tuvalde hiçbir şey silmez.  
Bunun yerine ızgaranın kendi tuşları sayfada çalışır: `Enter` hücreyi düzenler, `Delete` ve `Backspace` seçili hücreleri temizler, `Ctrl + A` (Windows/Linux) veya `⌘ + A` (Mac) her hücreyi seçer, `Escape` ise bir düzenlemeyi iptal eder, ızgara menüsünü kapatır veya arama alanını boşaltır. Kopyalama, kesme ve yapıştırma da sekmede kalır. [Kopyalama ve yapıştırma](#copying-and-pasting) bölümüne bakın.

## Salt okunur düzenleyiciler {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) bir düzenleyicide sekme açılır ve her sayfayı gösterir.  
Sayfa değiştirme, arama, seçme, kaydırma, sütunları yeniden boyutlandırma ve kopyalama her zamanki gibi çalışır, `Checks` sayfasından `Enter` tuşuyla veya çift tıklamayla bir denetime gitmek de öyle. Denetimlerin işaretleri de görünür.

Hiçbir hücre düzenleme, yapıştırma veya temizleme kabul etmez ve hiçbir denetimin işaretlemediği her hücre salt okunur hücrelerin gri zemini üzerinde gösterilir.  
`Add Row`, `Delete Rows`, `Import CSV` ve `Export CSV` gizlenir, satır tuşları hiçbir şey yapmaz ve sağ tıklama tarayıcının menüsünü açar. Boş bir sayfa hiçbir ipucu göstermez ve araç çubuğunda `Undo` veya `Redo` görünmez.

## Ortak çalışanlar ve dosya {#collaborators-and-the-file}

Diyagramın dosyası sözcükleri, terimleri ve değer alanlarını, bir sıralamanın verdiği sıra dahil sayfadaki sıralarıyla tutar ve hiçbir değer içermeyen bir satırı dışarıda bırakır.  
Dosya ayrıca her tablonun ve sütunun mantıksal adını, her fiziksel adın sözlüklere ait olup olmadığını ve değer alanı listelendiği sürece her sütunun değer alanı bağlantısını tutar. Denetimler ve işaretler bunlardan hesaplanır ve hiçbir zaman kaydedilmez.

Bir [ortak düzenleme oturumunda](../../api/advanced/collaborative-editing.md) düzenleyiciler, sıralamalar ve satır eklemeler dahil birbirlerinin sözlük düzenlemelerini gerçekleştikleri anda görür. Her biri kendi sayfasını, aramasını ve seçimini korur ve sayfa geçmişleri yalnızca kendi düzenlemelerini içerir.  
Bir ortak çalışanın bu arada kaldırdığı bir satıra yapılan düzenleme veya yapıştırma hiçbir şey kaydetmez ve `Nothing saved: the row was removed` bildirimi görünür.  
Sözlük sekmesinden önceki bir sürümün düzenleyicisi diyagramı mantıksal adları, değer alanı bağlantıları ve sözlükleri olmadan kaydeder. [Sürümleri karıştırma](../../api/advanced/collaborative-editing.md#mixing-releases) bölümüne bakın.

Bir Şema SQL, GraphQL, DBML veya AML `Import` işlemi sözlükleri korur, bir JSON `Import` işlemi onları dosyadakilerle değiştirir, `Import and Add` ise hiçbirini getirmez. [Dış dosyaları içe aktarma](./file-import-export.md#importing-external-files) bölümüne bakın.  
Bir kodlama ajanı MCP sunucusu aracılığıyla sözcükleri, terimleri ve değer alanlarını düzenler, mantıksal adları ve değer alanlarını ayarlar, fiziksel adları yeniden türetir ve denetimleri listeler. [Sözlükler](../../mcp/tools.md#dictionaries) ve [Sözlük denetimleri](../../mcp/tools.md#dictionary-checks) bölümlerine bakın. CSV dosyaları için bir aracı yoktur.
