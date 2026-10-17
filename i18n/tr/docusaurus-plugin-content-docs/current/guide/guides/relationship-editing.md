---
sidebar_position: 6
description: Bir ilişkiyi silme, türünü değiştirme, ON DELETE ve ON UPDATE eylemlerini ayarlama, “Sütunları eşle” iletişim kutusuyla mevcut sütunlara eşleme, bağlantı çizgisi gösterimini okuma, N:M ve tanımlayıcı ilişkilerle çalışma ve yeni yabancı anahtar sütunlarının nasıl adlandırıldığını görme.
---

# İlişki düzenleme

İlişkiler tuvalin bağlam menüsünden, tuval araç çubuğundan, [Hızlı aramadan](./quick-search.md#what-the-palette-lists) veya bir kısayolla çizilir. [Düzenlemeye başlama](./editing-start.md) sayfasına bakın.  
Bu sayfa, bir ilişki oluşturulduktan sonra onunla neler yapabileceğinizi, [Sütunları eşle](#map-columns) iletişim kutusunun bir ilişkiyi alt tablonun zaten sahip olduğu sütunlarda nasıl sonlandırdığını ve ilişkinin eklediği yabancı anahtar sütunlarının nasıl adlandırıldığını anlatır.

## Silme {#deletion}

İlişkinin bağlam menüsünden silinebilir.

![products ile reviews arasındaki ilişkiyi bağlam menüsünden silme](/img/demo-relationship-remove.webp)

Bunun için bir kısayol yoktur, çünkü bir ilişki bir tablo veya not gibi seçilmez: Seçili olanı kaldıran `Delete` ve `Backspace` tuşları bir ilişkiyi tek başına asla kaldırmaz. [Tablo ve not silme](./table-related-functions.md#table-and-memo-deletion) bölümüne bakın.  
İlişkiler bağladıkları öğelerle birlikte de kaldırılır: Bir tabloyu silmek ona bağlı her ilişkiyi, bir sütunu silmek de onu kullanan her ilişkiyi kaldırır.

## Tür değiştirme {#type-change}

İlişkinin bağlam menüsündeki `Relationship Type` öğesiyle değiştirilebilir.  
Dört tür sunulur ve geçerli tür bir onay işaretiyle belirtilir:

- Zero One
- Zero N
- One Only
- One N

![Bağlam menüsünde Zero N türündeki bir ilişkiyi önce One Only, ardından One N türüne değiştirme](/img/demo-relationship-type.webp)

Bunlar bir ilişkiye başlarken seçtiğiniz dört türle aynıdır ve her birinin kendi kısayolu vardır. [Düzenlemeye başlama](./editing-start.md) sayfasına bakın.

## ON DELETE ve ON UPDATE {#on-delete-and-on-update}

İlişkinin bağlam menüsünde `Relationship Type` ile `Map Columns` arasında yer alan `On Delete` ve `On Update` öğeleriyle ayarlanır.  
Her ikisi de aynı altı öğeyi sunar ve geçerli öğe bir onay işaretiyle belirtilir:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` hiçbir yan tümce yazmaz, bu nedenle veritabanının kendi varsayılanı geçerli olur. Çizilerek ya da [Sütunları eşle](#map-columns) iletişim kutusunda oluşturulan yeni bir ilişkide ikisi de başlangıçta `Not set` olur ve daha sonra `Not set` öğesini seçmek bir eylemi temizler.  
İkisi birbirinden bağımsızdır: Birini değiştirmek diğerini olduğu gibi bırakır.  
Bağlantı çizgisi ayarlanmış olanı gösterir. [Bağlantı çizgisini okuma](#reading-a-connector) bölümüne bakın.  
Tablolarıyla birlikte kopyalanıp yapıştırılan veya çoğaltılan bir ilişki her iki eylemi de korur ve Şema SQL, DBML veya AML içe aktarıldığında dosyanın bildirdiği eylemler de gelir. [Dosyaları içe veya dışa aktarma](./file-import-export.md) sayfasına bakın.

![orders ile order_items arasındaki ilişkide bağlam menüsünden ON DELETE CASCADE ve ON UPDATE RESTRICT ayarlama, etiketin D:C U:R olarak görünmesi, ardından ikisini yeniden okumak için üzerine gelme](/img/demo-referential-actions.webp)

Veritabanı ne olursa olsun her eylem seçilebilir.  
Seçili [veritabanının](./table-related-functions.md#databases) Şema SQL'inde dışarıda bıraktığı bir eylemin yanında `not in MySQL` gibi soluk bir bilgi notu yer alır. `Not set` öğesinde asla bilgi notu bulunmaz ve veritabanını değiştirmek bilgi notlarını günceller.  
Bilgi notu taşıyan bir eylem yine de ilişkide saklanır: Bağlantı çizgisi onu gösterir, JSON, DBML ve AML onu korur, ancak o veritabanının Şema SQL'i yan tümceyi dışarıda bırakır, bu nedenle veritabanının varsayılanı geçerli olur.

[Şema SQL](./schema-sql.md) şu eylemleri yazar ve geri kalanları dışarıda bırakır:

| Veritabanı | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | hiçbiri |
| PostgreSQL | beşi de | beşi de |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | beşi de | beşi de |

Snowflake'in Şema SQL'i ayrıca dışarıda bıraktığı her eylemi adlandıran bir yorum yazar. [Referans eylemleri](./schema-sql.md#referential-actions) bölümüne bakın.

Kod oluşturucunun ORM hedeflerinin hangi eylemleri yazdığı, seçili veritabanının yanı sıra hedefe de bağlıdır. [Kod oluşturucu](./code-generator.md#on-delete-and-on-update) bölümüne bakın.

## Sütunları eşleme {#map-columns}

“Sütunları eşle” iletişim kutusu, her anahtar sütunu için bir satır olmak üzere üst tablonun anahtarını alt tablonun sütunlarıyla eşleştirir.  
Her satır ya alt tablonun zaten sahip olduğu bir sütunu kullanır ya da yeni bir yabancı anahtar sütunu ekler, böylece bir ilişki zaten yerinde olan sütunlarda sonlanabilir.

![members tablosundan orders tablosuna bir Zero N ilişkisi çizme, Map to existing columns seçeneğini seçme ve id sütununu mevcut member_id sütunuyla eşleme](/img/demo-map-columns.webp)

İki şekilde açılır:

- Bir ilişki çizerken, alt tablonun yanındaki `Map to existing columns` öğesinden. [İlişki oluşturma](./editing-start.md#relationship-creation) bölümüne bakın. Bu durumda `Map` düğmesi, çizilmekte olan türde bir ilişki ekler.
- Mevcut bir ilişkinin sütunlarını değiştirmek için, ilişkinin bağlam menüsündeki `Map Columns` öğesinden. Bu durumda `Save` düğmesi değişikliği yazar. Salt okunur bir düzenleyicide bu öğe yer almaz.

İletişim kutusunun alt başlığı, `users → posts · One N` gibi, iki tabloyu ve ilişki türünü belirtir. Tür burada gösterilir ancak değiştirilmez. Türü değiştirmek için [Tür değiştirme](#type-change) bölümüne bakın.

`References` alanı, ilişkinin işaret ettiği anahtarı seçer: önce sütunları tablo sırasıyla gösterilen `Primary Key`, ardından `Unique` olarak işaretli her sütun için `Unique: <column>`. Yalnızca birden fazla seçenek olduğunda gösterilir.  
Benzersiz bir dizin burada anahtar sayılmaz ve birincil anahtarın tamamı olan bir `Unique` sütunu iki kez listelenmez.  
Başka bir anahtar seçmek satırları yeniden oluşturur. Bir satır, seçtiği sütun alt tabloda bulunduğu sürece seçimini korur.

`Referenced column` ve `Foreign key column` başlıkları altında her satır, anahtarın bir sütununu veri türüyle birlikte ve onunla eşleştirilecek alt tablo sütunlarının bir listesini gösterir:

- `Pick a column` satırı boş bırakır.
- `New column: <name>` yeni bir yabancı anahtar sütunu ekler. Gösterilen ad, [Yabancı anahtar sütun adları](#foreign-key-column-names) bölümünde anlatıldığı şekilde sütunun alacağı addır ve alt tablonun sütunlarına ve yeni sütun ekleyen diğer satırlara göre numaralandırılır. Adı olmayan bir anahtarda olduğu gibi ad boş kalacaksa bu seçenek sunulmaz.
- Alt tablonun her sütunu, `<name> (<data type>)` biçiminde. Başka bir satırın seçtiği bir sütun `<name> (<data type>) · in use` olarak görünür ve seçilemez, böylece iki satır aynı sütunu paylaşmaz. Başka bir ilişkinin zaten kullandığı bir sütun yine de seçilebilir, böylece paylaşılan bir `tenant_id` gibi bir sütun birkaç ilişkiye hizmet edebilir.

`Map` ile bir satır, yalnızca o satır için yeni bir yabancı anahtar sütununun herhangi bir `_2` numaralandırmasından önce alacağı ad, büyük/küçük harf ayrımı yapmadan, tam olarak bir alt tablo sütununda bulunuyorsa dolu olarak başlar, örneğin `users` tablosundaki `id` için `users_id` ve `member_id` için `member_id`. [`Bracket`](./schema-sql.md#database-and-bracket) ayarı varsayılan değer olan `None` iken şema nitelikli bir tablo adının tablo kısmından oluşturulan ad da sayılır, bu nedenle `public.users` tablosundaki `id`, `public.users_id` veya `users_id` ile eşleştirilir. Bir `Unique` anahtar için anahtar sütununun kendi adı da sayılır, bu nedenle `vin`, `vin` ile eşleştirilir. Diğer her satır `Pick a column` olarak başlar.  
`Save` ile her satır, ilişkinin şu anda kullandığı sütunla başlar. Her ikisinde de `References` alanında başka bir anahtar seçmek, o anahtarın boş satırlarını aynı adlara göre doldurur.

Seçilen bir sütunun veri türü, üst tablo sütununun bir yabancı anahtara verdiği türden farklı olduğunda, satırın altındaki bir bilgi notu bunu belirtir.  
[İlişkilerde veri türü eşitleme](./settings.md#relationship-datatype-sync) açıkken ve üst tablo sütununun bir veri türü varken bilgi notunda `<column> becomes <type>` yazar ve buradaki tür, eşlemenin yazacağı türdür. Aksi hâlde `Types differ: <parent type> and <child type>` yazar ve sütun türünü korur.

Bir engel olduğu sürece `Map` veya `Save` düğmesi devre dışı kalır ve satırların altında beliren bir ileti engelin ne olduğunu söyler:

- `Pick a foreign key column for every referenced column`: Bir satır hâlâ boştur.
- `At least one column must reference a different column`: her satırın kendi üst tablo sütununu seçtiği, kendine başvuran bir ilişki.
- `These columns are already linked by another relationship`: Aynı iki tablo arasındaki başka bir ilişki tam olarak bu sütunları bağlar.
- `<parent> has no key to reference`: `Map` ile, üst tablonun ne birincil anahtarı ne de `Unique` sütunu vardır.

`Save` düğmesi ayrıca eşleme, ilişkinin geçerli eşlemesinden farklı olana kadar devre dışı kalır.  
`Save` ile, sütunu artık tablosunda bulunmayan bir satırda `(removed)` yazar. Başka bir alt tablo sütunu seçin veya artık var olmayan bir üst tablo sütunu için `References` alanında bir anahtar seçin. `Map` ile, seçtiği sütun kaldırılan bir satır `Pick a column` durumuna geri döner.

Üst tablo sütunları tam olarak üst tablonun anahtarlarından biri olmayan bir ilişki, `References` alanının sonuna eklenen ve bu sütunları olduğu gibi tutan `Current columns (not a key)` seçeneği seçili olarak açılır. Üst tablonun hiç anahtarı yoksa tek seçenek budur ve `References` alanı gösterilmez.  
Bu durumda `The referenced columns are not a key of <parent>` iletisi veya üst tablonun hiç anahtarı yoksa `<parent> has no key to reference` iletisi bir hata değil, bir bilgi notudur: `Save` yine de çalışır, böylece alt tablo sütunlarını değiştirip başvuruyu koruyabilirsiniz.  
İki sütun listesi, örneğin uzunlukları farklı olduğu için eşleştirilemeyen bir ilişki `(invalid)` satırları gösterir ve `References` alanında bir anahtar seçene ya da üst tablonun hiç anahtarı yoksa ona bir birincil anahtar veya `Unique` sütunu ekleyene kadar `Save` düğmesini devre dışı tutar.

İletişim kutusu açık olduğu sürece, bir ortak çalışanın veya bir kodlama ajanının düzenlemeleri de dahil olmak üzere diyagramı izler ve seçtiklerinizi korur.  
Bu sırada ilişkinin sütunları veya iletişim kutusunun açıldığında seçili olan anahtar değişirse, iletişim kutusu `This relationship changed while the dialog was open` iletisini ekler.

`Map` ve `Save` düğmelerinin yazdıkları:

- `Map` ilişkiyi, `On Delete` ve `On Update` değerleri `Not set` olacak şekilde ekler. `Save` yalnızca ilişkinin sütunlarını değiştirir, üst tablo tarafını `References` alanında seçilen anahtara yönlendirir ve ilişkinin türünü, ON DELETE ve ON UPDATE eylemlerini korur.
- Bir `New column` satırı, ilişki çizmenin yaptığı gibi alt tablonun sonuna bir sütun ekler: `NOT NULL`, anahtarına göre adlandırılmış, anahtarın veri türü, varsayılan değeri ve açıklamasıyla. [Tanımlayıcı ilişkiler](#identifying-relationships) bölümüne bakın.
- Seçilen bir sütun asla yeniden adlandırılmaz ve `Not Null`, birincil anahtar, `Unique`, varsayılan değer ve açıklama ayarları olduğu gibi kalır. Veri türü yalnızca `Relationship DataType Sync` açıkken ve üst tablo sütununun bir veri türü varken değişir: Sütun, üst tablo sütununun bir yabancı anahtara verdiği türü alır – bir serial anahtar için bu, yeni bir sütunda olduğu gibi tamsayı türüdür – ve değişiklik, eşitlemenin yaptığı gibi ilişkiler boyunca ilerler.
- Eşlemenin artık kullanmadığı bir sütun alt tabloda kalır ve başka bir ilişki hâlâ onda sonlanmıyorsa artık yabancı anahtar olarak işaretlenmez.
- Tek bir `Map` veya `Save` işleminin yazdığı her şey, yeni sütunlar ve tür değişiklikleri de dahil, tek bir geri alma adımıdır.

İlişkinin tanımlayıcı olup olmadığı ve üst tablo ucunun nasıl çizildiği, her ilişkide olduğu gibi eşlenen alt tablo sütunlarından belirlenir. Alt tablonun birincil anahtar sütunlarına eşlemek ilişkiyi hemen tanımlayıcı yapar ve `NULL` değerine izin veren bir sütuna eşlemek üst tablo ucuna bir halka koyar. [Bağlantı çizgisini okuma](#reading-a-connector) bölümüne bakın.  
Şema SQL'deki yabancı anahtar, bir `Unique` anahtar için `REFERENCES vehicle (vin)` gibi, seçtiğiniz anahtara başvurur.

`Map` veya `Save` düğmesine bastığınızda, bir ortak çalışan veya bir kodlama ajanı sizden önce davrandığı için diyagram eşlemeyi zaten içeriyorsa hiçbir şey yazılmaz.  
Diyagram, eşleme artık uymayacak şekilde değiştiyse hiçbir şey yazılmaz ve `Couldn't map columns: the diagram changed` bildirimi gösterilir.

`Cancel`, `x` düğmesi, `Escape` tuşu veya iletişim kutusunun dışındaki soluk alana bir tıklama, iletişim kutusunu hiçbir şey yazmadan kapatır.  
Soluk alan, araç çubuğu da dahil olmak üzere tüm düzenleyiciyi kaplar ve açık bir [Gezgin](./explorer.md#dialogs-beside-it) onun altında açık kalır.  
Hızlı aramayı açmak, ERD sekmesinden ayrılmak veya düzenleyicinin salt okunur duruma geçmesi de iletişim kutusunu kapatır.  
`Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) da iletişim kutusunu kapatır ve metin imlecini Gezginin [aramasındaki](./find-and-replace.md#opening-and-closing) Bul alanına yerleştirir, Gezgin kapalıysa onu açar. Gezgini gösteremeyecek kadar dar bir düzenleyicide iletişim kutusunu yine kapatır, ancak metin imlecini taşımak yerine bir bildirim gösterir. [Açma ve kapatma](./explorer.md#opening-and-closing) bölümüne bakın.  
İletişim kutusu açıkken tablolarından biri veya ilişki kaldırılırsa, `Map Columns closed: the relationship was removed` gibi bir bildirimle kapanır.  
İletişim kutusu açıkken tuval kısayolları, geri alma ve yineleme, kopyalama ve yapıştırma hiçbir şey yapmaz.

Bir kodlama ajanının “Sütunları eşle” aracı yoktur. Ajan bir ilişkiyi, ikisi de tek bir `erd_batch` içinde olmak üzere, yabancı anahtar sütunlarını koruyan `erd_remove_relationship` aracıyla kaldırıp `erd_link_columns` aracıyla mevcut sütunlar üzerinde yeniden çizerek yeniden eşler. [Araçlar](../../mcp/tools.md#relationships) bölümüne bakın.

## N:M ilişkiler {#nm-relationships}

Düzenleyici fiziksel modele dayandığından, bir N:M ilişkisi aşağıda gösterildiği gibi bir eşleme tablosuyla ifade edilir.

![⌘ + ⌥ + 2 ile önce products, ardından tags tablosundan boş product_tags tablosuna ilişki çizme, önce product_id, ardından tag_id ekleme](/img/demo-relationship-n-m.webp)

Eşleme tablosunda `product_tags` tablosundaki `product_id` ve `tag_id` gibi anahtar sütunları zaten varsa, her ilişkiyi `Map to existing columns` seçeneğiyle çizin ve yenilerini eklemek yerine bu sütunları seçin. [Sütunları eşleme](#map-columns) bölümüne bakın. Bu sütunlar eşleme tablosunun birincil anahtarıysa her ilişki hemen tanımlayıcı olur.

GraphQL, DBML veya AML içe aktarmak eşleme tablosunu sizin için oluşturur.  
Çoktan çoğa bir bildirim, `<left>_<right>` adlı, `Junction table inferred from <left> <-> <right>` açıklamalı ve her iki tarafa tanımlayıcı ilişkilerle bağlı bir tablo olarak gelir.  
[Dosyaları içe veya dışa aktarma](./file-import-export.md) sayfasına bakın.

## Tanımlayıcı ilişkiler {#identifying-relationships}

Alt tabloya tıklayarak veya `Create new columns` seçeneğiyle bir ilişki çizmek, üst tablonun her birincil anahtarını alt tabloya `NOT NULL` bir yabancı anahtar sütunu olarak kopyalar, bu nedenle yeni bir ilişki tanımlayıcı olmayan bir ilişki olarak başlar.  
Kopya, anahtarın veri türünü, varsayılan değerini ve açıklamasını alır, ancak `Unique` veya `Auto Increment` ayarını almaz ve [Yabancı anahtar sütun adları](#foreign-key-column-names) bölümünde anlatıldığı gibi adlandırılır.  
Veri türündeki istisna serial anahtardır: Kopyası, serial türünün sakladığı tamsayı türünü alır. Hangi veritabanı olursa olsun `smallserial` ve `serial2` türleri `smallint`, `serial4` türü `integer`, `bigserial` ve `serial8` türleri `bigint` verir. Yalın bir `serial`, PostgreSQL'de `integer`, MySQL ve MariaDB'de `bigint unsigned` verir ve diğer tüm veritabanlarında `serial` olarak kalır.  
Büyük/küçük harf ayrımı yapmadan yalnızca türün adının tamamı dikkate alınır, bu nedenle `serial(4)` yazıldığı gibi kopyalanır. Büyük harflerle yazılmış bir tür büyük harfli bir tür verir: PostgreSQL'de `SERIAL`, `INTEGER` verir. Kaydedilmiş bir diyagramda türü zaten `serial` olan bir yabancı anahtar sütunu bu türü korur.  
İlişkiyi tanımlayıcı yapmak için alt tablodaki bu yabancı anahtar sütunlarını birincil anahtar olarak ayarlayın: Hepsini seçip `Alt + K` (Windows/Linux) veya `⌥ + K` (Mac) tuşlarına bir kez basın ya da tablonun bağlam menüsünde, iki veya daha fazla sütun seçiliyken `Primary Key on selected columns` olarak görünen `Primary Key` öğesini seçin. [Sütun birincil anahtarı](./table-editing.md#column-primary-key) bölümüne bakın.

![Alt + K ile product_id sütununu birincil anahtar olarak açıp kapatma, bağlantı çizgisinin önce düz, ardından kesikli hâle gelmesi](/img/demo-identifying-relationship.webp)

Düzenleyici bunu kendiliğinden güncel tutar.  
Bir ilişki, alt tablo tarafındaki her sütun birincil anahtar olduğu sürece tanımlayıcıdır ve bunlardan biri birincil anahtar olmaktan çıktığı anda tanımlayıcı olmayan bir ilişkiye dönüşür.

## Yabancı anahtar sütun adları {#foreign-key-column-names}

Bir ilişki çizmek, eklediği her yabancı anahtar sütununu o sütunun kopyaladığı üst tablo anahtarına göre adlandırır:

- `id`, `ID` veya `uuid` gibi tek sözcüklü bir anahtar adının önüne üst tablonun adı ve bir alt çizgi eklenir: `products` tablosundaki `id`, `products_id` olur.
- `member_id`, `userId` veya `UserID` gibi birden çok sözcüklü bir anahtar adı olduğu gibi korunur.
- Büyük/küçük harf ayrımı yapmadan tablonun kendi adıyla aynı olan tek sözcüklü bir anahtar adı da korunur: `currency` tablosundaki `currency`, `currency` olarak kalır. Tablonun adını yalnızca içeren bir anahtar ise yine de öneki alır: `user` tablosundaki `username`, `user_username` olur.

Bir ad, yalnızca harf ve rakamlardan oluştuğunda ve büyük/küçük harf geçişi içermediğinde tek sözcüktür.  
Başka herhangi bir karakter adı böler, bu nedenle `_id`, `order no` ve `order-no` birden çok sözcüktür.  
camelCase'in okunduğu gibi okunan bir büyük/küçük harf geçişi de adı böler: bir küçük harften sonra gelen bir büyük harf (`userId`), iki büyük harften sonra gelen bir küçük harf (`IDCard`, `IDs`) ya da Hangul, kana veya Han gibi büyük/küçük harf ayrımı olmayan bir yazı sisteminin, büyük/küçük harf ayrımı olan bir harfin yanındaki harfi (`회원ID`).  
Rakamlar bir sözcüğü bölmez, bu nedenle `id2` ve `SHA256` tek sözcüktür. Tümü küçük ya da tümü büyük harfle yazılmış bileşik bir ad da tek sözcüktür: `members` tablosundaki `memberid`, `members_memberid` olur.

Tablo adı, çevresindeki boşluklar dışında yazıldığı gibi kullanılır: Harflerinin büyük/küçük durumu, iç boşlukları ve noktaları korunur, tekil hâle getirilmez ve Kod oluşturucunun `Table Name Case` ve `Column Name Case` ayarlarının hiçbir etkisi olmaz. `ID` anahtarlı `Users` tablosu `Users_ID` verir.  
Bileşik bir anahtarın her sütunu ayrı ayrı adlandırılır: (`tenant_id`, `id`) anahtarlı `orders` tablosu `tenant_id` ve `orders_id` ekler.

Büyük/küçük harf ayrımı yapmadan alt tabloda zaten bulunan bir ad, boştaki ilk numarayı alarak `_2`, `_3` vb. ile numaralandırılır.  
`id` anahtarlı `users` tablosundan aynı tabloya giden ikinci bir ilişki `users_id_2` ekler, `member_id` anahtarlı `members` tablosundaki kendine başvuran bir ilişki de `member_id_2` ekler.  
Tek bir bileşik anahtarın sütunları da aynı şekilde birbirlerine göre numaralandırılır ve olduğu gibi korunan bir ad yerini önce alır: (`id`, `user_id`) anahtarlı `user` tablosu `user_id` için `user_id`, `id` için `user_id_2` ekler.

Adı olmayan bir üst tablo, anahtar adını olduğu gibi bırakır ve bu ad çakışma durumunda diğerleri gibi numaralandırılır.  
Adı olmayan bir anahtar, adı olmayan bir yabancı anahtar sütunu verir.  
Alt tabloya tıklamadan önce adlandırmadığınız sürece, düzenleyicinin birincil anahtarı olmayan bir üst tabloya eklediği birincil anahtar da buna dahildir.

Adlar ilişki çizildiğinde belirlenir. Üst tabloyu veya anahtarını daha sonra yeniden adlandırmak onları yeniden adlandırmaz.  
[Sütunları eşle](#map-columns) iletişim kutusunun `New column` satırları da aynı kurallarla adlandırılır ve liste her adı seçiminizden önce gösterir.  
Sütunlarıyla birlikte hazır gelen ilişkiler – bir içe aktarmadan, bir yapıştırmadan, bir çoğaltmadan ya da mevcut sütunları eşleştiren “Sütunları eşle” iletişim kutusundan gelenler – bu sütunların adlarını korur.  
`erd_add_relationship` aracıyla ilişki ekleyen bir kodlama ajanı da aynı adları ve veri türlerini elde eder. [Araçlar](../../mcp/tools.md#relationships) bölümüne bakın.

## Bağlantı çizgisini okuma {#reading-a-connector}

- Tanımlayıcı bir ilişki düz çizgiyle, tanımlayıcı olmayan bir ilişki kesikli çizgiyle çizilir.
- Alt tablo ucu ilişki türünün kardinalite simgesini taşır: Zero One için bir halka ve bir çubuk, Zero N için bir halka ve bir karga ayağı, One Only için iki çubuk, One N için bir çubuk ve bir karga ayağı.
- Üst tablo ucu, yabancı anahtar sütunlarından herhangi biri `NULL` değerine izin verdiğinde Zero One gibi bir halka ve bir çubuk, hepsi `NOT NULL` olduğunda ise One Only gibi iki çubuktur.
- Bir bağlantı çizgisinin üzerine gelmek, onu her iki tabloda bağladığı sütunlarla birlikte vurgular.

![Sırayla üç bağlantı çizgisinin üzerine gelme, her birinin bağladığı sütunlarla birlikte vurgulanması](/img/demo-relationship-hover.webp)

[ON DELETE veya ON UPDATE](#on-delete-and-on-update) ayarlayan bir ilişki, alt tablo ucunun yanında `D:C U:R` gibi bir etiket taşır: `D:` ve ON DELETE eylemi, ardından `U:` ve ON UPDATE eylemi, her biri yalnızca ayarlanmışsa.  
Eylemler erwin'in gösterimine göre kısaltılır: CASCADE için `C`, RESTRICT için `R`, SET NULL için `SN`, SET DEFAULT için `SD` ve NO ACTION için `NA`. İkisini de ayarlamayan bir ilişkinin etiketi olmaz.  
Etiket, kardinalite simgesiyle çakışmadan, alt tablodan uzak tarafta durur. Bağlantı çizgisi o tablonun sol veya sağ kenarından çıkıyorsa çizginin üstünde, üst veya alt kenarından çıkıyorsa çizginin sağında yer alır.  
Etiket, tuval arka planı renginde küçük bir kutunun üzerine bağlantı çizgisinin rengiyle çizilir ve bağlantı çizgisiyle birlikte vurgulanır. Etiketler tüm bağlantı çizgilerinin üzerine çizilir, bu nedenle bir etiketi kesen bir çizgi onun altından geçer.  
Etiket, seçili veritabanı ne yazarsa yazsın ilişkide saklanan eylemi gösterir, bu nedenle ON DELETE SET DEFAULT, MySQL'de yine `D:SD` olarak görünür.

Eylemlerden herhangi birini ayarlayan bir bağlantı çizgisinin üzerine gelmek, ayrıca `ON DELETE CASCADE` ve `ON UPDATE RESTRICT` gibi yan tümceleri her satıra bir tane olacak şekilde açıkça yazan bir araç ipucu gösterir.  
Araç ipucu, etiket gizliyken de görünür.

Bir ilişkiye gitmek onu vurgular: [Gezginde](./explorer.md#going-to-a-row) bir tablonun `Foreign Keys` klasörü altındaki bir satırı veya [Fark görüntüleyicide](./table-related-functions.md#going-to-a-change) bir yabancı anahtar satırını seçmek, ilişkinin bağlantı çizgisini ve etiketini üzerine gelme rengiyle çizer. Fark görüntüleyicide ilişkiyi içeren her taraftaki bağlantı çizgisini vurgular, bu nedenle eklenen bir yabancı anahtar yalnızca geçerli tarafı, kaldırılan bir yabancı anahtar ise yalnızca kaydedilmiş tarafı vurgular.  
Atlama yalnızca alt tabloyu yabancı anahtar sütunlarıyla birlikte seçer ve odaktaki hücre bunların ilkine yerleşir. İlişkinin kendisi yine de asla seçilmez. Görünümün nereye gittiği için [Atlamanın varış noktası](./table-related-functions.md#where-a-jump-lands) bölümüne bakın.  
Vurgu, tuvalde farenin sol veya sağ düğmesine bir sonraki basışta söner. Bu basışın boş bir yerde, bir tabloda, bir notta, bir tablo grubunda veya bir bağlantı çizgisinde olması fark etmez ve seçimi olduğu gibi bırakan bir basış da vurguyu söndürür. Gezginde başka bir satıra veya arama eşleşmesine gitmek de vurguyu söndürür, Fark görüntüleyicide başka bir satıra gitmek de o satırın gittiği her tarafta aynı şeyi yapar.  
Farenin orta düğmesiyle veya el aracıyla kaydırmak vurguyu söndürmez. Gezginde veya Fark görüntüleyicide bir satırı daraltmak ya da genişletmek, seçimi `Escape` tuşuyla kaldırmak ve [Hızlı aramadan](./quick-search.md) ya da Akış modunun dış bağlantı [kart düğmesinden](./visualization.md#card-buttons) yapılan bir atlama da vurguyu söndürmez.  
Vurgu kaydedilmez, geri alma geçmişinde yer almaz ve ortak çalışanlar onu görmez.

ERD tuvalindeki bağlantı çizgilerini `Relationship` görünüm seçeneğiyle, yalnızca etiketlerini ise varsayılan olarak açık olan `Referential Actions` görünüm seçeneğiyle gizleyin. [Tablo görünüm seçenekleri](./table-related-functions.md#table-view-options) bölümüne bakın.  
Tabloların yalnızca adlarına daraldığı `70%` ve altındaki yakınlaştırmada etiketler çizilmez.  
[Görüntü dışa aktarma](./file-import-export.md#image) her zaman %100'de çizilir, bu nedenle bir görünüm seçeneği onları gizlemedikçe, tuvalin yakınlaştırma düzeyi ne olursa olsun etiketleri çizer. `Background` seçeneği kapalıyken her etiketin arkasındaki kutu da saydam olur.  
Görselleştirme sekmesindeki [Akış modu](./visualization.md#flow-mode), `Relationship` seçeneği kapalıyken bile bağlantı çizgilerini, her birini aynı uç işaretlerine sahip, kesiksiz tek bir yumuşak gri eğri olarak çizer, bu nedenle bu sayfada anlatılan kesikli çizgi, etiketler, araç ipucu, atlamadan sonraki vurgu ve dik açılı yönlendirme yalnızca ERD tuvali için geçerlidir. Bir tablodan kendisine giden bir ilişki Akış modunda da sağ üst köşenin çevresinden kıvrılır. [Bağlantı çizgisi yönlendirme](#connector-routing) bölümüne bakın.

## Bağlantı çizgisi yönlendirme {#connector-routing}

Bağlantı çizgileri dik açılı olarak yönlendirilir.  
Bir rota, iki ucu arasında duran tabloları kesmek yerine onların çevresinden dolanır ve köşeleri yuvarlatılmıştır.  
Her uç, dönmeden önce tablosundan kısa, düz bir parçayla çıkar, bu nedenle birbirine yakın olan ve bağlantı çizgisi uçları aynı hizaya gelen iki tablo, dolambaçlı bir yol yerine tek bir düz çizgiyle birleştirilir.  
Bir tablonun aynı kenarından çıkan rotalar, üst üste binmemeleri için ayrı koridorlara dağıtılır.  
Yalnızca tablolardan kaçınılır: Bir bağlantı çizgisi bir notu veya bir tablo grubunun kutusunu kesebilir ve tablo gruplarının üstünde, tabloların ve notların altında çizilir.

Bir tablodan kendisine giden bir ilişki, üst tablo ucunda tablonun üst kenarından çıkan ve alt tablo ucunda sağ kenarından giren, tablonun sağ üst köşesinin çevresinden dolanan tek bir eğri olarak çizilir.  
Aynı tablodaki diğer kendine başvuran ilişkiler ilkinin dışına iç içe yerleşir, böylece eğrileri ne birbirini ne de tabloyu keser.

Yapılandırılacak bir şey yoktur.  
Tuvaldeki herhangi bir şey taşındığında veya yeniden boyutlandırıldığında rotalar otomatik olarak yeniden hesaplanır, bu nedenle hiçbir zaman elle düzeltilmeleri gerekmez.

![members tablosunu aşağı sürükleyip geri getirme, bu sırada orders tablosundan gelen bağlantı çizgisinin categories tablosunun sağından geçmekle solundan dolanmak arasında değişmesi, tüm köşelerin yuvarlatılmış olması](/img/demo-connector-routing.webp)
