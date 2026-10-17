---
sidebar_position: 4
description: Tabloları ve notları seçme, taşıma, kopyalama, çoğaltma ve silme, renkleri ve görünüm seçeneklerini ayarlama, dizinleri ve alternatif anahtarları tanımlama, veritabanı seçme, sonsuz tuvalde gezinme ve belgeleri karşılaştırma.
---

# Tabloyla ilgili işlevler

Tablolar ve notlar oluşturulduktan sonra onlarla yaptığınız her şey – seçme, taşıma, kopyalama, silme, renklendirme ve tuvalin neyi göstereceğini ayarlama – ile çevrelerindeki tuval denetimleri.  
Önce tablo ve not komutları gelir; ardından Tablo özellikleri, tablolara odaklanma, dizinler ve alternatif anahtarlar, Otomatik düzen ve veritabanı sistemi; en son da tuvalin kendisi: tuval araç çubuğu, yakınlaştırma, kaydırma ile atlamanın varış noktası ve Fark görüntüleyici.  
Tabloları bir araya toplayan kutular olan tablo gruplarının kendi sayfası vardır. [Tablo grupları](./table-groups.md) sayfasına bakın.

## Çoklu seçim {#multiple-selection}

Üç yöntem desteklenir:

- `Ctrl + drag` (Windows/Linux) veya `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac)
- `Ctrl + A` veya `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` veya `⌘ + ⌥ + A` (Mac)

Notlar da aynı şekilde seçilir ve tümünü seçme kısayollarının ikisi de her tabloyu ve notu tek seferde seçer. View Option → `Memos` ile gizlenen notlar tümünü seçmede ve seçim kutusunda yer almaz. [Tablo görünüm seçenekleri](#table-view-options) bölümüne bakın.  
[Tablo grupları](./table-groups.md#selecting-groups), başlık çubuklarında `Ctrl + click` (Windows/Linux) veya `⌘ + click` (Mac) ile seçime eklenir, ancak tümünü seçme hiçbir zaman grup seçmez.  
`Ctrl + A` tuşları metin imlecine öncelik tanır, bu yüzden bir hücreyi düzenlerken diyagram yerine metni seçer.  
Seçim kutusu bir tabloyu veya notu ortasını kapladığında işaretler, kenarına değmesi tek başına yetmez. Bir tablo grubunu ise yalnızca grubun kutusunun tamamını içine aldığında seçer, bu yüzden bir grubun içinde çizilen kutu grubu dışarıda bırakarak tabloları seçer.  
Zaten seçili bir öğeye sağ tıklamak seçimin tamamını korur, bu yüzden `Color`, `Group selected tables` ve `Delete selected` gibi menü satırları seçimin tümüne uygulanır. Başka bir tabloya, nota veya tablo grubuna sağ tıklamak `Ctrl` veya `⌘` tuşu basılıyken bile yalnızca onu seçer, bir ilişkiye ya da tuvalin boş alanına sağ tıklamak ise seçimi kaldırır.  
`Escape` tuşu seçimi kaldırır. Bir hücre düzenleyicisi, not düzenleyicisi veya tablo grubu ad alanı açıkken ya da bir ilişki veya `New Table Group` çizimi sürerken `Escape` tuşuna ilk basış bunu sonlandırır, ikinci basış ise seçimi kaldırır.

![⌘ + drag ve ⌘ + click ile tabloları, ardından ⌘ + A ile her tabloyu ve notu seçme](/img/demo-table-select.webp)

Ortak düzenleme oturumunda her katılımcının seçimi, odaktaki hücresi ve seçim kutusu tuvalde o katılımcının renginde çizilir. [Ortak düzenleme](../../api/advanced/collaborative-editing.md) sayfasına bakın.

## Birden çok tabloyu taşıma {#moving-multiple-tables}

Zaten seçimin parçası olan herhangi bir tabloyu veya notu sürüklediğinizde seçimin tamamı onunla birlikte taşınır – değiştirici tuş gerekmez.  
Seçimin dışındaki bir öğeyi sürüklemek seçimi o öğeye indirger ve yalnızca onu taşır. `Ctrl + drag` (Windows/Linux) veya `⌘ + drag` (Mac) her iki durumda da seçimi korur.  
Tabloları ve notları yalnızca farenin sol düğmesi taşır. Sağ tıklama bağlam menüsünün neye uygulanacağını belirler ve hiçbir şeyi taşımaz, orta düğmeyle sürükleme ise bunun yerine tuvali kaydırır. [Tuvalde gezinme](#getting-around-the-canvas) bölümüne bakın.

![Seçili iki tablodan birini sürüklemek ikisini birden taşır ve ilişki de onlarla birlikte gider](/img/demo-table-multiple-move.webp)

Seçili bir [tablo grubu](./table-groups.md) da tablolarını taşıyarak hareket eder, hem seçili olan hem de taşınan bir grupta bulunan bir tablo ise yalnızca bir kez taşınır.  
Bir tabloyu bıraktığınız yer onu bir gruba sokabilir veya gruptan çıkarabilir. [Tablo ekleme ve çıkarma](./table-groups.md#adding-and-removing-tables) bölümüne bakın.

Tablolar ve notlar tek bir katman sırasını paylaşır. Bir tabloya veya nota farenin sol ya da sağ düğmesiyle basmak onu diğer tüm tabloların ve notların önüne getirir, bir tablo grubunun başlık çubuğuna basmak veya gövdesine sağ tıklamak ise grubun tablolarını öne getirir.  
Bu sıra kaydedilmez: Yeniden açılan bir diyagram tablolarını dosyada listelendikleri sırayla dizer ve tüm notları onların üstüne yerleştirir.

## Tabloları ve notları kopyalama/yapıştırma {#copyingpasting-tables-and-memos}

Seçili tabloları ve notları kopyalar ve yeni öğeler olarak geri yapıştırır.  
Kısayollar: `Ctrl + C` (Windows/Linux) veya `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) veya `⌘ + V` (Mac)

Kopyalanan bir tablo adını, açıklamasını, sütunlarını ve rengini korur; kopyalanan bir not ise metnini, boyutunu ve rengini korur.  
Dizinler ve ilişkiler de birlikte gelir: Bir dizin kopyalanan tabloya bütünüyle kopyalanır, bir ilişki ise bağladığı tabloların ikisi de kopyalanan kümede olduğunda türü ve ON DELETE ile ON UPDATE eylemleriyle birlikte kopyalanır. Yarım kalan bir ilişki özgün tabloyu gösterir hâlde bırakılmaz, atılır.  
Yapıştırılan kopyalar yeni seçim olur ve aynı kopyayı yeniden yapıştırmak onu her seferinde `50px` daha öteye yerleştirir, böylece art arda yapılan yapıştırmalar üst üste binmez.  
Kopya, ait olduğu [tablo grubunu](./table-groups.md) korumaz: Yapıştırılan tablo bir grubun kutusunun içine düşse bile hiçbir grupta yer almaz ve seçili bir grup kopyalanmaz.  
View Option → `Memos` notları gizlediği sürece, yapıştırma taşıdığı notları yine de gizli ve seçilmemiş olarak ekler, böylece seçim yalnızca yapıştırılan tablolardan oluşur.

![İlişkili iki tabloyu kopyalama ve ilişkisiyle birlikte iki kez yapıştırma](/img/demo-table-copy-paste.webp)

Odaktaki bir tablonun içinde sütunlar seçiliyken aynı kısayol bunun yerine o sütunları kopyalar. [Tablo düzenleme](./table-editing.md) sayfasına bakın.

## Tabloları ve notları çoğaltma {#duplicating-tables-and-memos}

`Alt` tuşunu basılı tutun ve bir tabloyu veya notu farenin sol düğmesiyle sürükleyin.  
Yarı saydam bir önizleme işaretçiyi izler ve düğmeyi bıraktığınızda kopya önizlemenin bulunduğu yere bırakılır.  
Tuttuğunuz öğe zaten bir seçimin parçasıysa seçimin tamamı çoğaltılır. Aksi hâlde seçim, işaretçinin altındaki varlıkla değiştirilir.  
Hareket ettirmeden yapılan `Alt + click` kopyayı `50px` aşağıya ve sağa bırakır, o nokta zaten dolu olduğunda bir adım daha ilerler.

Bir kopya yapıştırmayla aynı şeyleri taşır: adları, açıklamaları, sütunları, renkleri, not boyutlarını ve tamamen kopyaladığınız öğelere ait olan dizinleri ve ilişkileri. Yapıştırmada olduğu gibi kopya da hiçbir tablo grubunda yer almaz.  
Bir tablo grubunun başlık çubuğunda `Alt + drag`, grubu düz bir sürükleme gibi taşır; grup hiçbir zaman çoğaltılmaz.

![Alt + drag ile bir tabloyu çoğaltma, ardından Alt + click ile aşağıda ve sağda bir kopya daha oluşturma](/img/demo-table-duplicate.webp)

## Tablo ve not silme {#table-and-memo-deletion}

Seçili tabloları, notları ve [tablo gruplarını](./table-groups.md) siler.  
Kısayollar:

- `Delete` veya `Backspace`. Bu tuşlar seçimin tamamını kaldırır; ancak seçili tek öğe, sütunlarından bazıları seçili bir tabloysa ve yakınlaştırma `70%` üzerindeyse bunun yerine o sütunları kaldırır. [Sütun silme](./table-editing.md#column-deletion) bölümüne bakın.
- `Ctrl + Backspace` veya `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` veya `⌘ + Delete` (Mac). Bu tuşlar, sütunlar seçiliyken bile her zaman seçili tabloları, notları ve tablo gruplarını kaldırır.

![Delete tuşuyla bir tabloyu ilişkileriyle birlikte silme, ardından notun menüsündeki Delete selected ile bir tabloyu ve bir notu birlikte silme](/img/demo-table-remove.webp)

Bağlam menüleri de siler. Bir tablonun veya notun menüsünün son satırında, o tablo veya not seçili iki ya da daha fazla öğeden biri olduğu sürece `Delete selected` yazar ve bu satır seçimin tamamını kaldırır. Aksi hâlde satırda `Delete` yazar ve yalnızca o tabloyu veya notu kaldırır. Seçili bir sütunun satırı üzerinde ise tablonun menüsünde, [Sütun silme](./table-editing.md#column-deletion) bölümündeki gibi, bunun yerine `Delete column` veya `Delete columns` yazar.

Bir tabloyu kaldırmak ilişkilerini ve dizinlerini de onunla birlikte kaldırır. Bir tablo grubunu kaldırmak tablolarını korur ve bu tablolar hiçbir grupta yer almaz. [Grubu kaldırma](./table-groups.md#removing-a-group) bölümüne bakın.  
Onay istenmez, her kaldırma tek bir geri alma adımıdır ve `readonly` bir düzenleyicide hiçbir şey kaldırılmaz.  
`Delete` ve `Backspace` tuşları basılı tutulduğunda yalnızca bir kez kaldırır ve hiçbir zaman bir ilişkiyi kaldırmaz. [İlişki düzenleme](./relationship-editing.md#deletion) bölümüne bakın. Bir hücreye, nota veya başka herhangi bir metin alanına yazarken bu tuşlar bunun yerine metni düzenler.  
Ayarlar bu iki tuşu `Delete Selection` adıyla listeler. [Kısayollar](./settings.md#shortcuts) bölümüne bakın.

## Tablo ve not rengi belirleme {#table-and-memo-color-specification}

Kategoriye göre ayırt etmek için renk atayabilirsiniz.  
Tablo rengini sol kenarı boyunca, not ise üst kenarı boyunca taşır. Renk seçiciyi işaretçinin bulunduğu yerde açmak için bu kenara veya şeride farenin sol düğmesiyle tıklayın ya da tablonun veya notun bağlam menüsünden `Color` öğesini seçin. Renk yalnızca tıkladığınız öğeye değil, seçili tüm tablolara, notlara ve tablo gruplarına uygulanır.  
Bir tablo grubu kendi menüsündeki `Color` öğesiyle renklendirilir ve renkli bir gruptaki tablo, sol kenarında kendi rengini korurken tablo başlığı boyunca grubun rengini taşır. [Grubu renklendirme](./table-groups.md#coloring-a-group) bölümüne bakın.

![Seçili iki tablo ve not için notun renk şeridinden Blue hazır rengini seçme, ardından rengi No color ile kaldırma](/img/demo-table-color.webp)

Seçicide yukarıdan aşağıya şunlar bulunur:

- Bir doygunluk ve parlaklık alanı, ardından yanında rengin önizlemesi bulunan ton kaydırıcısı. Tarayıcı damlalık sunuyorsa, kaydırıcının önündeki `Pick a color from the screen` pipet düğmesi ekranın herhangi bir yerinden renk alır.
- `Hex`, `R`, `G` ve `B` alanları. `Hex` alanı, `#` işaretiyle ya da işaretsiz 3, 4, 6 veya 8 onaltılık basamak ya da yapıştırılmış bir `rgb()`, `hsl()` değeri veya CSS renk adı kabul eder. Tam 6 ya da 8 basamaklı bir değer yazdıkça uygulanır, diğer her şey ise `Enter` tuşuna bastığınızda veya alandan çıktığınızda uygulanır. `R`, `G` ve `B` alanları tam sayı kabul eder, `255` değerinin üzerindeki her şeyi `255` olarak okur ve `Enter` tuşuna bastığınızda veya alandan çıktığınızda uygulanır. Seçicinin okuyamadığı metin atılır.
- Sekizerli iki satırda on altı hazır renk örneği: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown ve Gray. Bir renk örneğinin üzerine gelmek onaltılık kodunu gösterir.
- `Document colors`: belgenin tablolarının, notlarının ve tablo gruplarının zaten kullandığı, en çok kullanılandan başlayarak en fazla sekiz renk. Bu satır yalnızca böyle renkler olduğunda görünür.
- `No color`.

Renk her zaman opaktır: Seçicide saydamlık denetimi yoktur ve seçici, yazılan ya da yapıştırılan bir değerin taşıdığı saydamlığı atar.  
Seçiciyi açmak hiçbir şeyi değiştirmez ve seçimin zaten sahip olduğu rengi seçmek geri alma adımı eklemez.

`No color` seçili her tablonun, notun ve tablo grubunun rengini tek bir geri alma adımında temizler ve seçiciyi kapatır. Seçili öğelerden herhangi birinin rengi olduğu sürece tablo, not ve tablo grubu bağlam menülerinde `Color` öğesinin hemen altında bulunan `Remove color` öğesi aynı işi seçiciyi açmadan yapar.

Seçici açıldığında klavye odağını alır ve `Tab` ile `Shift + Tab` tuşları denetimleri arasında dolaşır. Ok tuşları alanı ve ton kaydırıcısını 1, `Shift` ile 10 birim hareket ettirir ve renk örnekleri arasında geçerken her birini uygular.  
Klavye odağı seçicideyken geri alma ve yineleme, yakınlaştırma kısayolları, `Search` ve `Toggle Explorer` düzenleyiciye ulaşmaya devam eder, diğer düzenleyici kısayolları ise ulaşmaz: [Silme](#table-and-memo-deletion) kısayolları hiçbir şey kaldırmaz ve `Delete` ile `Backspace` yalnızca `Hex`, `R`, `G` ve `B` alanlarının metnini düzenler.  
`Escape` tuşu seçiciyi kapatır, seçicinin dışında tuvale basmak da kapatır.  
[Gezginde](./explorer.md) bir yere basmak tuvale basmak sayılmaz, bu yüzden seçiciyi açık bırakır. Orada seçilen bir satır seçimi değiştirir ve bir sonraki renk seçimi yeni seçimi renklendirir.

## Tablo görünüm seçenekleri {#table-view-options}

Şu görünüm seçeneklerini sunar:

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Unique`, `Alternate Key` ve `Auto Increment` varsayılan olarak kapalı, diğerleri açıktır.  
`Alternate Key` her alternatif anahtarın sütunlarını `AK1.1` gibi işaretlerle gösterir. [Alternatif anahtarlar](#alternate-keys) bölümüne bakın.  
`Referential Actions`, bir ilişkinin ON DELETE ve ON UPDATE eylemlerinin bağlantı çizgisinin alt tablo ucuna koyduğu `D:` ve `U:` etiketlerini gösterir. [Bağlantı çizgisini okuma](./relationship-editing.md#reading-a-connector) bölümüne bakın. Kapatmak yalnızca bu etiketleri gizler ve hiçbir tabloyu ya da bağlantı çizgisini taşımaz.  
`Table Groups`, [tablo gruplarını](./table-groups.md) ve tablolarının başlıklarındaki grup renklerini gösterir. Kapatmak bunları tuvalde, mini haritada ve görüntü dışa aktarmalarında gizler, hiçbir tabloyu taşımaz ve her tabloyu kendi grubunda tutar. [Grupları gizleme](./table-groups.md#hiding-groups) bölümüne bakın. Ayrıca `Table Groups` klasörünü [Gezginden](./explorer.md#the-tree), `New Table Group` düğmesini de [tuval araç çubuğundan](#canvas-toolbar) kaldırır ve Gezginin araması artık grup adlarını bulmaz.  
`Memos` notları gösterir. Kapatmak tuvaldeki, mini haritadaki ve görüntü dışa aktarmalarındaki tüm notları gizler ve hiçbir tabloyu ya da bağlantı çizgisini taşımaz. Gizli notlar yer kaplamaz, bu yüzden kaydırma çubukları, mini harita ve `Go to content` pusulası onları hesaba katmaz.  
Notları gizlemek onların seçimini kaldırır ve açık bir not düzenleyicisini kapatır. [Gezgin](./explorer.md#the-tree) `Memos` klasörünü kaldırır, Gezginin [Bul ve değiştir](./find-and-replace.md) araması ve Hızlı aramanın `:` öneki de bu notlarda arama yapmaz. Notlar gizliyken `New Memo` öğesi bağlam menüsünden, [tuval araç çubuğundan](#canvas-toolbar), Hızlı aramadan ve [karşılama ekranından](./editing-start.md#welcome-screen) kalkar ve `Alt + M` not eklemez. Yapıştırma veya [İçe aktar ve ekle](./file-import-export.md#import-and-add) taşıdığı notları yine de gizli ve seçilmemiş olarak ekler.  
`readonly` bir düzenleyicide seçenekleri açıp kapatmak hiçbir şeyi değiştirmez.

![Tablolar yeniden yerleşirken Görünüm seçenekleri girdilerini açıp kapatma, Alternate Key ile bileşik bir benzersiz dizini AK1.1 ve AK1.2 olarak işaretleme, ardından Memos seçeneğini kapatıp açma](/img/demo-view-options.webp)

Görselleştirme sekmesinin `Flow` modundaki kartlar bu seçenekleri izlemez: Kendi [satır görünümlerini](./visualization.md#row-display) kullanır ve `Relationship` kapalıyken bile bağlantı çizgilerini çizer.

## Tablo özellikleri {#table-properties}

Bir tablonun özellik panelini açar.  
Paneli sağ tıkladığınız tablo için açan, tablo bağlam menüsündeki `Table Properties` öğesiyle başlayın ya da bir tablo seçip `Alt + Space` tuşlarına basın.  
Panel, soluklaştırılmış tuvalin ortasında açılır. Yalnızca tuval soluklaşır, bu yüzden açık bir [Gezgin](./explorer.md#dialogs-beside-it) panelin yanında açık ve kullanılabilir kalır. Panelin başlık alanında `Table Properties` başlığı, geçerli tablo vurgulanmış olarak en son açılan beş tablonun çipleri ve bir kapatma düğmesi bulunur. Paneli yeniden açmadan o tabloya geçmek için bir çipe tıklayın.  
Başlık alanının altında üç sekme vardır: `Indexes`, `Schema SQL` ve `Code Generator`. Panel üçü için de aynı boyutu korur, bu yüzden sekme değiştirmek paneli taşımaz veya yeniden boyutlandırmaz.  
Paneli kapatma düğmesiyle, `Escape` tuşuyla ya da dışında tuvale tıklayarak kapatın.  
Gezginde klasör dışında bir satır seçmek veya Gezginin aramasındaki bir eşleşmeye gitmek, atlamadan önce Tablo özelliklerini kapatır. Gezginin aramasını açan ya da Gezgin zaten açıksa metin imlecini Bul alanına yerleştiren `Ctrl + F` (Windows/Linux) veya `⌘ + F` (Mac) de aynısını yapar. Gezginde – bir klasör satırı dahil – başka herhangi bir yere ya da araç çubuğundaki `Explorer` düğmesine tıklamak Tablo özelliklerini açık bırakır. Klavye odağı Gezgindeyken basılan `Escape` yalnızca klavye odağını tuvale geri verir, bu yüzden Tablo özelliklerini kapatmak için `Escape` tuşuna ikinci kez basmak gerekir.

`Indexes` sekmesi [Dizinler](#indexes) bölümünde anlatılır.  
`Schema SQL` sekmesi, tablonun DDL'ini seçili [veritabanına](#databases) göre gösterir: `CREATE TABLE` ifadesini, bazı veritabanlarının Benzersiz sütunlar için yazdığı ayrı kısıtlamaları ve dizinlerini. Araç çubuğundaki [Şema SQL](./schema-sql.md) sekmesi nasıl ayarlanmış olursa olsun, her zaman başlık ve tablolardan önceki ya da sonraki betik olmadan düz `CREATE` ifadeleri yazar. Seçenekler paneli yoktur ve bağlam menüsünde yalnızca `Database` ve `Bracket` bulunur.  
`Code Generator` sekmesi yalnızca bu tablo için kod oluşturur. [Kod oluşturucu](./code-generator.md) sayfasına bakın.

`readonly` bir düzenleyicide panel yine açılır ve başlığının yanında `Read only` rozeti görünür, ancak `Indexes` sekmesinde hiçbir düzenleme yapılamaz.

## Tablolara odaklanma {#focusing-on-tables}

Görselleştirme sekmesini, seçilen tablolara ve onlardan bir ilişki uzaklıktaki her tabloya daraltılmış olarak `Flow` modunda açar.  
Tablo bağlam menüsündeki `Focus on this table` öğesiyle başlayın ya da bir veya daha fazla tablo seçip `Alt + F` tuşlarına basın.  
Sağ tıkladığınız tablo seçili birkaç tablodan biriyse menü öğesinde `Focus on selected tables` yazar ve öğe seçimin tamamına odaklanır. Seçimin dışındaki bir tabloya sağ tıklamak yalnızca o tabloya odaklanır.  
Kısayol seçili tabloları alır, notları dışarıda bırakır ve hiçbir tablo seçili değilse hiçbir şey yapmaz.  
Seçili bir [tablo grubu](./table-groups.md) burada, kısayolda da menü öğesinde de hiçbir şey ifade etmez: Grubun tabloları yalnızca kendileri seçiliyse alınır, grubun menüsündeki `Select tables` öğesi de tam olarak bunu yapar.  
Daraltılmış görünümün neyi gösterdiği ve diyagramın tamamına nasıl dönüleceği [Görselleştirme](./visualization.md#focusing-on-tables) bölümünde anlatılır.

## Dizinler {#indexes}

Dizinler tablo özellik panelinin `Indexes` sekmesinde tanımlanır ve dışa aktarılan Şema SQL'e dahil edilir.

Sol taraf tablonun anahtarlarını ve dizinlerini iki grupta listeler.  
Tablonun anahtarı olduğunda görünen `Keys`, sütunlarının bildirdiği anahtarları listeler: PK olarak işaretli sütunlar üzerinde `PK_<table name>`, ardından sütun sırasıyla Benzersiz olarak işaretli her sütun için `UQ_<table name>_<column name>`. Adlar seçili veritabanının Şema SQL'ini izler, bu yüzden `Bracket` ayarı `None` iken `sales.users` gibi şema nitelikli bir tablo için Databricks ve Snowflake dışındaki her veritabanında `PK_users` listelenir. [Şema nitelikli tablo adları](./schema-sql.md#schema-qualified-table-names) bölümüne bakın. Her biri `PK` veya `UQ` etiketi taşır ve bir kilitle işaretlenir. Burada salt okunurdur ve yalnızca sütunların [PK](./table-editing.md#column-primary-key) ve [Benzersiz](./table-editing.md#not-null-unique-auto-increment) bayraklarıyla değişir.  
`Indexes`, tablonun dizinlerini eklenme sırasıyla listeler. Her dizinde onu benzersiz yapan bir `UQ` aç/kapat düğmesi, bir ad alanı ve onu kaldıran bir `x` bulunur. [Alternatif anahtar](#alternate-keys) olan bir dizin ayrıca `AK1` gibi numarasını da gösterir. Listenin altındaki `Add Index` düğmesiyle dizin ekleyin.

Sağ taraf tablonun sütunlarını, her birinin yanında bir onay kutusuyla `Columns` başlığı altında listeler. Solda bir dizin seçilene kadar hiçbir şey düzenlenemez.  
Bir sütunu seçili dizine eklemek için işaretleyin, kaldırmak için işaretini kaldırın. Bir anahtar seçmek sütunlarını işaretli gösterir, ancak kutular devre dışı kalır.  
Seçili dizinin sütunları aşağıda `Index order` başlığı altında listelenir. Yeniden sıralamak için onları tutamaçtan sürükleyin ve sıralama yönünü tersine çevirmek için bir satırdaki `ASC` veya `DESC` çipine tıklayın. Alternatif anahtarda her satır kendi `AK<n>.<m>` işaretiyle biter. Liste aynı anda üç satır gösterir, gerisi kaydırılır.

`readonly` bir düzenleyicide bir anahtarı veya dizini seçmek yine sütunlarını gösterir, ancak `Add Index` ve `x` bulunmaz ve sekmedeki başka hiçbir şey değiştirilemez.

[Gezgin](./explorer.md#the-tree) her tablonun dizinlerini tablonun `Indexes` klasöründe listeler ve orada birini seçmek onun tablosuna gider. Gezginin araması dizin adlarını da bulur ve onları yeniden adlandırabilir. [Neleri arar](./find-and-replace.md#what-it-searches) bölümüne bakın.

![Tablo özelliklerini orders üzerinde açma, Indexes sekmesinin PK ve UQ anahtarlarını dizinlerin üstünde listelemesi, ardından member_id ve ordered_at DESC üzerinde bir dizin ekleyip Şema SQL sekmesinde okuma](/img/demo-table-properties.webp)

## Alternatif anahtarlar {#alternate-keys}

Alternatif anahtar, iki veya daha fazla sütun üzerindeki benzersiz bir dizindir: `Indexes` sekmesinde `UQ` aç/kapat düğmesi açık olan ve tablonun en az iki sütunu işaretli olan bir dizin.  
Tek bir sütun üzerindeki benzersiz dizin o sütunun Benzersiz bayrağından fazlasını söylemez, bu yüzden alternatif anahtar değildir; düz bir dizin, birincil anahtar veya Benzersiz olarak işaretlenmiş bir sütun da alternatif anahtar değildir.

[Görünüm seçeneklerinde](#table-view-options) `Alternate Key` açıkken diyagram her alternatif anahtarın sütunlarını erwin ve IDEF1X'in yazdığı gibi işaretler: `AK1.1`, `AK1.2` vb. Bu seçenek varsayılan olarak kapalıdır.

Anahtarlar, dizinlerin eklenme sırasına göre değil, sütunlarının tablodaki konumuna göre numaralandırılır. `Index order` listesindeki ilk sütunu tabloda en üstte duran anahtar `AK1` olur. Eşitlik durumunda her anahtarın bir sonraki sütunu karar verir ve daha uzun bir anahtarın baş kısmı olan anahtar ondan önce gelir.  
Bir sütunu tablo içinde taşımak veya bir anahtarın `Index order` sırasını değiştirmek anahtarları yeniden numaralandırabilir. Bir anahtarın kaldırılmasını geri almak ona numarasını geri verir ve her ortak çalışan aynı numaraları görür.

Bir anahtarın her sütunu `AK<n>.<m>` ile işaretlenir; burada `n` anahtarın numarası, `m` ise sütunun anahtarın `Index order` listesindeki yeridir. Birden çok anahtarda bulunan bir sütun, virgülle birleştirilmiş olarak tüm işaretleri taşır.  
Örneğin, `a`, `b` ve `c` sütunlarına sahip bir tabloda (`c`, `a`) ve (`b`, `a`) üzerindeki benzersiz dizinler `AK1` = (`b`, `a`) ve `AK2` = (`c`, `a`) olur, çünkü `b` sütunu `c` sütunundan yukarıdadır. Böylece `b` sütununda `AK1.1`, `c` sütununda `AK2.1` ve `a` sütununda `AK1.2,AK2.2` yazar.

İşaret, [sütun sırası](./settings.md#adjusting-column-order) hangi hücreyi sona koyarsa onun ötesinde, satırın en sonunda çizilir. Bir hücre değildir, bu yüzden hiçbir zaman odak almaz, düzenlenmez veya kopyalanmaz. [Tablo düzenleme](./table-editing.md) sayfasına bakın.  
Birincil anahtar veya yabancı anahtar sütunu da AK işareti taşıyabilir, çünkü işaret hiçbir şeyin yerini almaz: Satırın başındaki anahtar simgesi PK ve FK işaretlerini göstermeye devam eder ve Benzersiz hücresi kendi `UQ` işaretini korur.  
Alternatif anahtarı olan bir tablo, en uzun işareti için her satırın son hücresinden sonra yer ayırır; alternatif anahtarı olmayan bir tablo ise genişliğini korur.  
İşaretler, `70%` ve altındaki yakınlaştırmada adına daraltılan tabloların hiç işaret göstermediği ERD tuvalinde ve yakınlaştırma ne olursa olsun her tabloyu eksiksiz çizen [görüntü dışa aktarmada](./file-import-export.md#image) görünür. Görselleştirme sekmesinin `Graph` modundaki [üzerine gelme önizlemesi](./visualization.md#hover-preview) de onları gösterir; `Flow` kartları ise hiçbir zaman göstermez.

`Indexes` sekmesi, seçenek açık olsun ya da olmasın numaraları gösterir. [Dizinler](#indexes) bölümüne bakın.

## Otomatik düzen {#auto-layout}

Tuvaldeki tüm tabloları sizin yerinize yerleştirir.  
Tuvalin bağlam menüsünden veya Hızlı aramadan `Auto Layout` öğesini açın ve dört düzenden birini seçin:

| Düzen | Ne çizer |
| --- | --- |
| `Force` | Bir simülasyon: İlişkiler tabloları birbirine çeker, komşular birbirini iter ve üst üste binen tablolar birbirinden ayrılır. |
| `Flow` | İlişkiler boyunca soldan sağa; her bağlantı çizgisine tablo üzerinde kendi temas noktası verilir. Kesişmeleri az tutmaya çalışır, ancak başka bir düzenin önleyeceği bazı kesişmeler bırakabilir. |
| `Tree - vertical` | Aşağıya doğru katmanlı: Üst tablo, kendisine yabancı anahtar taşıyan tabloların üstünde yer alır. |
| `Tree - horizontal` | Aynı katmanlama, soldan sağa doğru. |

`Force`, düzen otururken bir önizleme açar ve gösterdiği bilgi kutusunda `Apply` ile `Cancel` bulunur.  
Önizleme, düzen başladığı andaki diyagrama göre çerçevelenir, bu yüzden düzen otururken tablolar çerçevenin dışına çıkabilir. Önizleme `70%` veya daha düşük yakınlaştırmada çizilir, bu yüzden tablolar adlarına ve renkli kenarlarına daraltılmış görünür.  
`Apply` konumları o anki hâlleriyle korur, düzen durulduğunda ise kendiliğinden uygulanır. `Cancel` veya `Escape` diyagramı olduğu gibi bırakır.

Diğer üçü ana iş parçacığının dışında tek seferde hesaplanır, bu yüzden izlenecek bir şey yoktur: Düzen hesaplanırken bir bilgi kutusu görünür ve tamamlanan yerleşim, diyagramın zaten kapladığı alanın ortasına yerleştirilir. `Cancel` veya `Escape` artık beklemediğiniz bir düzeni iptal eder, paylaşımlı worker çalıştırmayan bir ana uygulamada ise sonuç `Could not place tables` olur. [Web Worker'lar](../../api/installation.md#web-workers) bölümüne bakın. 60 saniye içinde dönmeyen bir düzen de aynı şekilde sona erer.

Hangisini seçerseniz seçin tablolar ve tablo grupları taşınır, notlar ise yerinde kalır. Bir tablodan kendisine giden ilişki yok sayılır ve aynı iki tablo arasındaki birden çok ilişki bir kez sayılır.  
Her düzen, gruplar gösterilsin ya da gösterilmesin her grubun tablolarını bir arada tutar ve tablo içeren her grubu tablolarının çevresine oturtur. [Tablo grupları](./table-groups.md#auto-layout) bölümüne bakın.  
Sonuç tek bir geçmiş kaydı olarak eklenir, bu yüzden tek bir geri alma her tabloyu ve grubu eski yerine döndürür.

![Tuvalin bağlam menüsünden Otomatik düzenin Flow seçeneğiyle bir yığın tabloyu ilişkileri boyunca soldan sağa dizerek toparlama](/img/demo-automatic-table-placement.webp)

## Veritabanları {#databases}

Desteklenen veritabanları şunlardır:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Birini tuvalin bağlam menüsündeki, Şema SQL ve Kod oluşturucu sekmelerinin seçenekler panelindeki veya bağlam menüsündeki ya da Hızlı aramadaki `Database` öğesinden seçin. Hepsi aynı ayarı değiştirir.

Bu seçenekler dışa aktarma için Şema SQL söz dizimini, DataType otomatik tamamlamasını ve oluşturulan kodun ve içe aktarılan şemaların karşılık geldiği türleri belirler.  
Bunlar, [Şema SQL](./schema-sql.md#options-panel) sekmesinin hangi `Statements` ve `Header` seçeneklerini yazabileceğini belirler. Veritabanında bulunmayan bir seçenek seçenekler panelinde soluk olarak kalır ve SQL, veritabanının sahip olduğu en yakın seçeneğe geri döner.  
Ayrıca Şema SQL'in ve Kod oluşturucunun ORM hedeflerinin hangi ON DELETE ve ON UPDATE eylemlerini yazacağını ve ilişki menülerinin hangilerini `not in <database>` olarak işaretleyeceğini belirler. [ON DELETE ve ON UPDATE](./relationship-editing.md#on-delete-and-on-update) ve [Kod oluşturucu](./code-generator.md#database) bölümlerine bakın.  
Şema SQL içe aktarma, bir sütunun veri türünü – `TIMESTAMP WITH TIME ZONE`, `public.mood` veya `integer[]` gibi – düzenleyici listelesin ya da listelemesin, argüman listesiyle birlikte korur. [Veri türleri](./file-import-export.md#data-types) bölümüne bakın. DataType otomatik tamamlaması yalnızca seçili veritabanının listelediği türleri önerir.

![Veritabanını PostgreSQL olarak değiştirme, ardından otomatik tamamlamada bir PostgreSQL türü seçme](/img/demo-database.webp)

![Ok tuşlarıyla gezilen ve Right, Tab veya Enter ile kabul edilen bulanık DataType otomatik tamamlaması](/img/demo-data-type-autocomplete.webp)

## Tuval araç çubuğu {#canvas-toolbar}

Tuvalin alt kenarının ortasında yüzen küçük bir araç çubuğu, soldan sağa doğru tuvalin kendisi üzerinde çalışan araçları ve tuvale öğe ekleyen komutları barındırır:

- El aracı ve seçim aracı. Varsayılan araç seçim aracıdır; el aracı ise boş alanda olduğu kadar tabloların üzerinde de her sürüklemeyi kaydırmaya dönüştürür. `Space` tuşu ikisi arasında geçiş yapar. Bir [`New Table Group`](./table-groups.md#drawing-a-group) çizimi hazırken ikisinin yerine `New Table Group` düğmesi işaretli görünür ve ikisinden birine tıklamak, `Space` tuşuna basmak veya bir ilişki gösterimi seçmek grup eklemeden çizimi sonlandırır.
- `New Table`, `New Memo` ve `New Table Group`. `New Table`, `Alt + N` tuşlarının yaptığı gibi tablo ekler, `New Memo` da `Alt + M` tuşlarının yaptığı gibi not ekler. `New Table Group`, `Alt + G` tuşlarının yaptığı gibi [grup çizimini](./table-groups.md#drawing-a-group) hazırlar ve el aracını kapatır; ikinci bir tıklama, tıpkı `Alt + G` tuşlarına ikinci kez basmak gibi, grup eklemeden çizimi sonlandırır. View Option → `Memos` notları gizlerken `New Memo`, View Option → `Table Groups` grupları gizlerken de `New Table Group` yer almaz. `readonly` bir düzenleyici üçünden hiçbirini göstermez.
- Yakınlaştırma: `Zoom out`, yüzde olarak geçerli yakınlaştırma ve `Zoom in`. İki düğme yakınlaştırmayı yakınlaştırma kısayollarıyla aynı şekilde adım adım değiştirir ve yüzdeye tıklamak yakınlaştırmayı `100%` değerine geri getirir.
- Dört ilişki gösterimi, bir ilişkiye başlarken kullandığınız dördün aynısı. [Düzenlemeye başlama](./editing-start.md) sayfasına bakın. İlişki iki tabloya tıklanarak çizildiğinden, birini seçmek seçim aracına geri geçer.
- Tuval ve bu araç çubuğu dışındaki her şeyi kaldıran Zen modu, `Alt + Z`. `Alt + Z` tuşlarına yeniden basmak veya düğme geri kalanını geri getirir. Açık bir Gezgin kapatılmadan geri kalanıyla birlikte gizlenir ve onlarla birlikte geri gelir. Zen modu sırasında da açılabilir. [Kenara çekildiğinde](./explorer.md#when-it-stands-aside) bölümüne bakın.
- Yalnızca ekranda hiçbir tablo, gösterilen not veya gösterilen tablo grubu yokken araç çubuğunun sonuna eklenen `Go to content` pusulası. [Tuvalde gezinme](#getting-around-the-canvas) bölümüne bakın.

Kısayolu olan her düğme kısayolunu araç ipucunda gösterir, örneğin `New Table (Alt + N)` (Windows/Linux) veya `New Table (⌥ + N)` (Mac).  
Araç çubuğu, Otomatik düzenin `Force` önizlemesi, Tablo özellikleri, Zaman yolculuğu veya Fark görüntüleyici açıkken kenara çekilir ve bunlar kapandığında geri gelir.

![Araç çubuğundan bir tablo ve bir not ekleme, New Table Group çizimini hazırlayıp iptal etme, el aracıyla kaydırma, yakınlaştırmayı adım adım değiştirme ve ⌥ + Z ile Zen modunu açıp kapatma](/img/demo-canvas-toolbar.webp)

## Yakınlaştırma/uzaklaştırma {#zoom-inout}

`Ctrl + Wheel` (Windows/Linux) veya `⌘ + Wheel` (Mac) ile yakınlaştırır. Tek başına fare tekerleği tuvali kaydırır.  
Dokunmatik yüzeydeki kıstırma hareketi de kıstırdığınız noktayı merkez alarak yakınlaştırır, dokunmatik ekrandaki iki parmak da öyle yapar ve hareket ettikçe tuvali kaydırır.  
Kısayollar: `Ctrl + Plus` (Windows/Linux) veya `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) veya `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) veya `⌘ + 0` (Mac), ekranın ortasını yerinde tutarak doğrudan `100%` değerine döner.

[Tuval araç çubuğundaki](#canvas-toolbar) `Zoom out` ve `Zoom in` düğmeleri yakınlaştırmayı `Minus` ve `Plus` kısayolları gibi adım adım değiştirir: Her basış, ekranın ortasını yerinde tutarak yakınlaştırmayı 4 yüzde puanı değiştirir. Aralarındaki yüzde geçerli yakınlaştırmayı gösterir ve ona tıklamak, `Ctrl + 0` (Windows/Linux) veya `⌘ + 0` (Mac) gibi doğrudan `100%` değerine döner.

Yakınlaştırma `10%` ile `150%` arasında değişir.  
`70%` ve altındaki yakınlaştırmada tablolar adlarına ve renkli kenarlarına daralır ve hücre düzenleme, hücre kısayolları ile kopyalama ve yapıştırma yeniden yakınlaştırana kadar çalışmaz.

Aynı üç kısayol Görselleştirme sekmesini de `Graph` ve `Flow` modunda aynı şekilde, her modun kendi aralığında yakınlaştırır. [Görselleştirme](./visualization.md#toolbar) bölümüne bakın.

![Tablolar adlarına daralana kadar ⌘ + Wheel ile uzaklaştırma, ardından ⌘ + Plus, ⌘ + Minus ve ⌘ + 0 ile adım adım geri dönme](/img/demo-zoom.webp)

## Tuvalde gezinme {#getting-around-the-canvas}

Tuvalin kenarları ve ayarlanacak bir boyutu yoktur. Tablolar ve notlar onları nereye koyarsanız orada durur ve aşağıdaki her şey sabit bir sayfayı değil diyagramı anlatır.

Kaydırmak için tuvalin boş bir alanını sürükleyin ya da `Space` tuşuyla el aracına geçip bir tablonun üzeri dahil her yeri sürükleyin. Fare tekerleği de kaydırır, `Shift + Wheel` ise yatay olarak kaydırır.  
Bir [tablo grubunun](./table-groups.md#selecting-groups) başlık çubuğunun altındaki alan olan gövdesi, farenin sol düğmesi için tuvalin boş alanı sayılır: Onu sürüklemek kaydırır, `Ctrl + drag` (Windows/Linux) veya `⌘ + drag` (Mac) bir seçim kutusu çizer ve tıklamak seçimi kaldırır.  
Kaydırmanın sınırı yoktur: Fare tekerleği, sürükleme ve el aracı görünümü, tabloların her yönde ötesine geçerek ne kadar hareket ettirirseniz o kadar uzağa taşır.

Seçim aracı ya da el aracı fark etmeksizin tuvalin herhangi bir yerinden kaydırmak için farenin orta düğmesiyle (tekerleğe basarak) sürükleyin. Basış bir tablonun, notun, hücrenin, simgenin veya ilişkinin üzerine denk gelse bile çalışır.  
Orta düğmeyle sürükleme hiçbir şeyi seçmez, taşımaz veya tıklamaz ve seçimi korur. Açık bir bağlam menüsünü ve renk seçiciyi kapatır, tarayıcının kendi orta tıklama kaydırması ve yapıştırması da başlamaz.  
Kaydırma çubuklarında, mini haritada, tuval araç çubuğunda veya açık bir hücre ya da not düzenleyicisinde orta düğmeye basmak kaydırma yapmaz.

Sağ üst köşedeki mini harita diyagramı, her yanında bir ekranlık boşluk bırakarak, yani kaydırma çubuklarının erişebildiği alanı kaba bir ızgaraya dışa doğru yuvarlayarak gösterir, bu yüzden ne kadar uzaklaştırırsanız diyagram haritada o kadar küçük kalır. Görünümü o noktaya taşımak için haritaya tıklayın ya da kaydırmak için görünüm alanı dikdörtgenini sürükleyin. Uzaklaştırdıkça görünüm alanı dikdörtgeni haritanın daha fazlasını kaplayacak şekilde büyür.  
Her tabloyu tablonun renginde, gösterilen her tablo grubunu da tablolarının arkasında grubun renginde bir kutu olarak çizer.  
Sağ ve alt kenarlardaki kaydırma çubukları aynı hareket aralığını gösterir. Bu aralık, diyagramın ekranın bir yanının hemen dışında durduğu konumdan öbür yanının hemen dışında durduğu konuma kadar uzanır, bu yüzden çizilen diyagramdan en az bir ekran daha uzundur ve görünüm diyagramın ötesindeyken daha da uzar. Zen modu dışında, belgede bir tablo, gösterilen bir not veya gösterilen bir tablo grubu olduğu sürece, hepsi ekrana sığsa bile iki kaydırma çubuğu da görünür. Bunların hiçbirini içermeyen bir belge, örneğin yalnızca View Option → `Memos` ile gizlenmiş notlar içeren bir belge, kaydırma çubuklarının hiçbirini ve mini haritayı göstermez.  
Kaydırma çubuğu tutamacını veya mini haritanın görünüm alanı dikdörtgenini sürüklemek, bir sınırda duran tek kaydırmadır: Ekranın hemen dışındaki tablolardan ya da sürükleme daha dışarıda başladıysa başladığı yerden öteye gitmez.

Bir kaydırma ekranda hiçbir tablo, gösterilen not veya gösterilen tablo grubu bırakmazsa [tuval araç çubuğunun](#canvas-toolbar) sonuna, en yakın öğeyi gösteren bir ok ve o öğenin ne kadar uzakta olduğuyla birlikte bir `Go to content` pusulası eklenir. Yakınlaştırmayı değiştirmeden o öğeyi ortalamak için pusulaya tıklayın.

![Tuvalin boş alanını sürükleyerek, bir tablonun üzerinde orta düğmeyle sürükleyerek, mini haritayla ve fare tekerleğiyle kaydırma, ardından Go to content pusulasını izleyerek geri dönme](/img/demo-canvas-navigation.webp)

### Atlamanın varış noktası {#where-a-jump-lands}

Tuvaldeki bir öğeye götüren her atlama görünümü tek bir kurala göre taşır: [Hızlı aramanın](./quick-search.md#searching-the-diagram) `#`, `@` ve `:` sonuçları, [Gezginin](./explorer.md#going-to-a-row) satırları ve onun [Bul ve değiştir](./find-and-replace.md#going-to-a-match) aramasının eşleşmeleri, [Fark görüntüleyicinin](#going-to-a-change) listesindeki satırlar, Akış modundaki dış bağlantı [kart düğmesi](./visualization.md#card-buttons) ve [İçe aktar ve ekle](./file-import-export.md#import-and-add) işleminden sonraki yerleşim. Bu bölümlerin her biri atlamanın neyi seçtiğini anlatır; bu bölüm ise görünümün nereye gittiğini anlatır.

Atlama hiçbir zaman yakınlaştırmayı değiştirmez ve en fazla bir kaydırma yapar. Başka bir sekmedeyken önce ERD sekmesine geçer.  
Tuvali göründüğü hâliyle ölçer: üst araç çubuğunun altında kalan kısmı ya da Zen modunda tüm yüksekliği ve tuvali örtmek yerine daraltan açık bir Gezginin sağında kalan kısmı.

Yatay ve dikey yön ayrı ayrı değerlendirilir ve hedefin zaten iyi göründüğü bir yön olduğu gibi bırakılır:

- O yönde tuvalin yarısından uzun olmayan bir hedef, ortası tuvalin orta yarısında, yani yatayda ya da dikeyde dörtte bir ile dörtte üç arasında kaldığı sürece yerinde kalır. Aksi hâlde ortası tuvalin ortasına getirilir.
- Daha uzun olup her iki ucunda `40px` pay kalacak şekilde yine de sığan bir hedef, tamamen görünür olduğu sürece yerinde kalır. Aksi hâlde yatayda ortalanır; dikeyde ise üst kenarı tuvalin üst kenarının `40px` altına getirilir.
- Bundan da uzun bir hedef, tamamen görünür olduğu sürece ya da tuvalden uzunsa aşağıda listelenen ana kısmı görünür olduğu sürece yerinde kalır. Aksi hâlde sığıyorsa ortalanır, sığmıyorsa ana kısmının iki ucunu da tuvalin en az `40px` içinde tutacak kadar ortaya yakın yerleştirilir; bunun için fazla uzun olan bir ana kısmın ise başlangıcı `40px` içeride tutulur.

Bu yüzden tuvalin sol kenarına yakın ve dikeyde yarı yolda duran küçük bir tablo yalnızca yatay olarak hareket eder.

Bir atlamanın görünüme getirdiği şey ve tamamı sığmadığında görünmesi gereken ana kısım:

- Tablo: tablonun tamamı, ana kısmı üstündeki ad şeridi ya da View Option → `Table Comment` açıklamaları gösterirken bir tablo açıklaması eşleşmesinde açıklama hücresi. Tabloların adlarına daraldığı `70%` ve altındaki yakınlaştırmada ana kısmı kutunun ortasındaki ad.
- Sütun: sütunun satırı, ana kısmı atlamanın gittiği hücre: sütunun adı ya da View Option → `Column Comment` açıklamaları gösterirken eşleşmenin bulunduğu açıklama. `70%` ve altındaki yakınlaştırmada sütun, tablosunu tablonun kuralına göre görünüme getirir.
- Uzun bir açıklama gibi tamamı gösterilemeyecek kadar geniş bir hücre: ana kısmı içindeki eşleşen metin.
- İlişki: iki tablosunu kapsayan kutu, ana kısmı alt tablo.
- Tablo grubu: grubun kutusu, ana kısmı başlık çubuğu.
- Not ya da İçe aktar ve ekle işleminin yerleştirdiği blok: tamamı.

İki yön de hareket etmeyecekse kaydırma yapılmaz, bu yüzden aynı yere art arda iki kez gitmek ikinci seferde hiçbir şeyi hareket ettirmez. Tuvali kaydıran bir atlama, kaydırmayı görünüm konumundaki diğer her değişiklik gibi [geri alma geçmişine](./undo-redo.md#what-the-history-records) kaydeder, hiçbir şeyi hareket ettirmeyen bir atlama ise geri alınacak bir şey bırakmaz. İçe aktar ve ekle işleminde kaydırma, eklemeyle aynı adımın parçasıdır. Fark görüntüleyicinin listesindeki bir satır yalnızca görünümün salt okunur taraflarını hareket ettirir, bu yüzden hiçbir şey kaydetmez.  
Hiçbir atlama çizilmekte olan bir ilişkiyi başlatmaz veya tamamlamaz. `Go to content` pusulası bir atlama değildir: Gösterdiği öğeyi ortalar.

## Fark görüntüleyici {#diff-viewer}

Daha önce kaydedilmiş belgeleri geçerli belgeyle karşılaştırabilirsiniz.  
Tuvalin bağlam menüsünden `Diff Viewer` öğesini seçin ve daha önce dışa aktardığınız bir `.json` belgesini belirleyin.

Görünüm tuvalin üzerinde açılır: solda değişenler, ardından yan yana kaydedilmiş belge ve geçerli belge.  
Geçerli belge, görünüm açıldığı andaki hâliyle karşılaştırılır; bundan sonra yapılan değişiklikler, bir ortak çalışanınkiler dahil, görünüme yansımaz. Görünüm açıkken açık bir [Gezgin](./explorer.md#when-it-stands-aside) gizlenir, bu yüzden görünüm düzenleyicinin tüm genişliğini kaplar.  
Her taraf fare tekerleğiyle, boş bir alanı ya da bir tablo grubunun gövdesini sürükleyerek veya üzerinde herhangi bir yerde orta düğmeyle sürükleyerek kaydırılır ve `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) ya da kıstırma hareketiyle yakınlaştırılır. `70%` ve altındaki yakınlaştırmada tabloları tuvaldeki gibi daralır. [İki taraftaki işaretler](#marks-on-the-two-sides) bölümüne bakın.  
İki taraf da salt okunurdur, bu yüzden belgenizdeki hiçbir şey değişmez. Her taraf kendi seçimini korur ve orada bir tabloya tıklamak onu yalnızca o tarafta seçer.  
Görünümü, açılışta gösterdiği `Diff Viewer` bilgi kutusundaki `Close` düğmesiyle ya da `Escape` tuşuyla kapatın.

![Fark görüntüleyiciyi kaydedilmiş bir .json dosyasıyla açma, ağacında A, M, D ve R ile işaretli satırlara tıklama, ada göre süzme ve kapatma](/img/demo-diff-viewer.webp)

### Neler karşılaştırılır {#what-is-compared}

Tabloların, sütunların, dizinlerin, yabancı anahtarların, notların ve tablo gruplarının tümü karşılaştırılır.  
Her öğe önce kimliğine göre eşleştirilir, bu yüzden kimlikleri koruyan aynı dosyanın daha eski bir sürümüyle karşılaştırıldığında yeniden adlandırılmış bir tablo, sütun, dizin veya tablo grubu yine tek bir öğedir ve yeniden adlandırılmış olarak listelenir.  
Geriye kalanlar koruduklarına göre bire bir eşleşir: tablo veya tablo grubu büyük/küçük harf ayrımıyla adına göre; sütun veya dizin tablosuna ve adına göre; yabancı anahtar iki tablosuna ve sütun çiftlerine göre; not ise önce metnine, sonra konumuna göre. Adı olmayan bir dizin sütunlarına, bunların sırasına ve yönüne ve benzersiz olup olmadığına göre, adı olmayan bir tablo grubu ise en çok tabloyu paylaştığı grupla eşleşir.  
Bu yüzden SQL içe aktarmayla yeniden oluşturulmuş bir diyagram gibi başka bir kaynaktan gelen bir dosyayla karşılaştırıldığında, yeniden adlandırılmış bir tablo bir kaldırılmış ve bir eklenmiş tablo olarak görünür.

Değişiklik sayılanlar:

- Tablo: adı, açıklaması, tablo grubu, konumu ve rengi.
- Sütun: adı, açıklaması, veri türü, varsayılan değeri, Otomatik artırma, birincil anahtar, Benzersiz, NULL olamaz ve tablodaki yeri. Yalnızca iki belgenin ortak sırasının dışında kalan sütunlar taşınmış sayılır, bu yüzden bir sütunu eklemek, kaldırmak veya taşımak diğerlerini işaretlemez.
- Dizin: adı, UNIQUE ve sıra ile yönleriyle birlikte sütunları.
- Yabancı anahtar: sütun çiftleri, ilişki türü ve ON DELETE ile ON UPDATE eylemleri.
- Not: metni, konumu, boyutu ve rengi.
- Tablo grubu: adı, tuttuğu tablolar, rengi, konumu ve boyutu.

Bu yüzden yalnızca taşınmış, yeniden boyutlandırılmış veya yeniden renklendirilmiş bir tablo, not ya da grup değişmiş sayılır. Konumlar ve boyutlar tam piksel olarak karşılaştırılır, katman sırası ve bir bağlantı çizgisinin tabloya değdiği yer ise hiçbir zaman hesaba katılmaz.

### Değişiklik ağacı {#the-change-tree}

Soldaki liste [Gezginin ağacı](./explorer.md#the-tree) gibi çizilir ve yalnızca değişenleri içerir: her biri yalnızca bir satır içerdiğinde gösterilen `Tables`, `Table Groups` ve `Memos` ile bir tablonun altında kendi `Columns`, `Indexes` ve `Foreign Keys` klasörleri. Yabancı anahtar alt tablosunun altında listelenir, eklenmiş ya da kaldırılmış bir tablonun içinde ise hiçbir şey listelenmez.  
Her klasör kaç satır içerdiğini gösterir ve her klasör ile tablo genişletilmiş olarak başlar.  
Tablolar ve tablo grupları büyük/küçük harf ayrımı yapmadan ada göre listelenir. Notlar ile bir tablonun sütunları, dizinleri ve yabancı anahtarları geçerli belgenin sırasını korur, kaldırılmış olanlar ise eski yerlerine konur. Not satırında notun ilk satırı, yabancı anahtar satırında ise alt tablo sütunları, ardından `→` ile üst tablo ve onun sütunları yazar, örneğin `user_id → users(id)`. Boş bir adın yerinde italik `unnamed` yazar.

Her satır bir harfle biter ve `A`, `D`, `M` veya `R` ile işaretlenmiş bir satırın adı o harfin rengindedir:

- `A`, eklendi, yeşil: yalnızca geçerli belgede.
- `D`, kaldırıldı, kırmızı ve üstü çizili: yalnızca kaydedilmiş belgede.
- `M`, değiştirildi, kehribar rengi: ikisinde de var, değişmiş.
- `R`, yeniden adlandırıldı, mavi: ikisinde de var, yeni bir adla. Yeniden adlandırma diğer tüm değişikliklerden önce gelir, ancak araç ipucu onları yine de listeler.
- `~`, kehribar renginde, her klasörün ve yalnızca içindeki değişiklikler nedeniyle listelenen tablonun sonunda yer alır; bunların adları olağan renklerini korur.

Araç ipucunu görmek için bir satırın adının üzerine gelin: önce durum, yani `Added`, `Deleted`, `Modified`, `Renamed` veya `Changed inside`, ardından her değişiklik için bir satır, örneğin `Name: users → members` veya `NN: ✗ → ✓`. Bir metin, 40 karakterden sonra kesilerek ilk satırıyla alıntılanır ve boş bir değerin yerinde `—` yazar. Eklenmiş veya kaldırılmış bir öğenin araç ipucu yalnızca durumudur.

Ağacın üstündeki `Filter by name` alanı, büyük/küçük harf ayrımı yapmadan, geçerli veya kaydedilmiş adı yazdığınız metni içeren satırları tutar. Adı eşleşen bir tablo tüm satırlarını korur, eşleşmeyen bir tabloda ise yalnızca eşleşen satırlar kalır. Hiçbir şeyle eşleşmeyen bir süzgeç ağacı boş bırakır.  
İki belge hiç farklı değilse ağaçta `No changes` yazar.

Ağacı `200px` ile `480px` arasında genişletmek veya daraltmak için sağ kenarını sürükleyin, `260px` genişliğine geri döndürmek için kenara çift tıklayın. Her fark görünümü `260px` genişlikte açılır ve iki taraf genişliğin geri kalanını eşit olarak paylaşır.  
Klavyeyle ağaçta, Gezginin ağacında olduğu gibi gezinilir – [Gezgindeki tuşlar](./explorer.md#keys-in-the-explorer) bölümüne bakın – ancak burada ağaçtayken veya `Filter by name` alanındayken `Escape` görünümü kapatır.

### Bir değişikliğe gitme {#going-to-a-change}

Satırın öğesine, o öğeyi içeren her tarafta gitmek için satıra tıklayın ya da klavye odağı üzerindeyken `Enter` veya `Space` tuşuna basın: Eklenmiş bir öğeye yalnızca geçerli tarafta, kaldırılmış bir öğeye yalnızca kaydedilmiş tarafta, ikisinde de bulunan her şeye ise iki tarafta da gidilir. Klasör satırı yalnızca daraltır veya genişletir, bir tablo satırının başındaki ok da öyle.

- Tablo, sütun veya dizin satırı yalnızca tabloyu seçer.
- Yabancı anahtar satırı iki tablosunu ya da iki tablo birlikte gösterilemeyecek kadar uzaksa alt tabloyu görünüme getirir, alt tabloyu yabancı anahtar sütunlarıyla birlikte seçer ve bağlantı çizgisini vurgular. [Bağlantı çizgisini okuma](./relationship-editing.md#reading-a-connector) bölümüne bakın.
- Not satırı notu, tablo grubu satırı da grubu seçer. Bir tarafın belgesinin gizlediği not veya grup o tarafta hiçbir yere gitmez.

Her taraf, o tarafta ölçülerek [Atlamanın varış noktası](#where-a-jump-lands) bölümündeki kurala göre hareket eder, bu yüzden aynı satıra yeniden tıklamak hiçbir şeyi hareket ettirmez.

### İki taraftaki işaretler {#marks-on-the-two-sides}

İki taraf metinleri, dış çizgileri ve bağlantı çizgilerini renklendirir, hiçbir şeyin içini doldurmaz. Eklenenler yeşildir ve yalnızca geçerli tarafta, kaldırılanlar kırmızıdır ve yalnızca kaydedilmiş tarafta görünür, kehribar rengiyle değişenler ve maviyle yeniden adlandırılanlar ise iki tarafta da görünür. Değişmeyen her şey olağan şekilde çizilir.

- Eklenmiş veya kaldırılmış bir tablonun ya da tablo grubunun dış çizgisi bu renkte çizilir ve adı da bu rengi alır. Eklenmiş veya kaldırılmış bir not dış çizgiyle belirtilir.
- İki belgede de bulunan bir tabloda eklenmiş veya kaldırılmış bir sütun tüm satırını renklendirir, taşınmış bir sütun ise tüm satırını kehribar rengine boyar. Eklenmiş veya kaldırılmış bir tablonun içindeki hiçbir şey ayrıca işaretlenmez.
- Değişmiş bir hücrenin metni kehribar rengine döner: tablonun açıklaması, sütunun açıklaması, veri türü, varsayılan değeri, Otomatik artırma, Benzersiz veya NULL olamaz hücresi ya da notun metni. Birincil anahtar değişikliği sütunun anahtar simgesini kehribar rengine çevirir.
- Yeniden adlandırılmış bir tablonun, sütunun veya tablo grubunun adı mavi olur.
- Taşınma, yeni bir boyut ya da renk, grubun değişmesi veya bir grubun tablolarının değişmesi gibi kendi hücresi olmayan bir değişiklik içeren tablo, not veya tablo grubunun dış çizgisi kehribar rengiyle çizilir.
- Eklenmiş, kaldırılmış veya değişmiş bir yabancı anahtar bağlantı çizgisini o renkte çizer. Üzerine gelmek ya da bir satırın vurgusu onu bunun yerine olağan üzerine gelme renginde çizer.
- Dizin değişikliği iki tarafta da hiçbir şeyi işaretlemez; yalnızca ağaçta görünür.

Her taraf kendi belgesinin Görünüm seçeneklerini izler. O tarafın çizmediği bir hücredeki değişiklik bunun yerine adda görünür. İkisi de varsayılan olarak kapalı olan `Unique` veya `Auto Increment` gibi bir Görünüm seçeneğinin gizlediği hücredeki sütun değişikliği sütunun adını kehribar rengine çevirir, anahtar simgesi göstermeyen bir satırdaki birincil anahtar değişikliği de aynısını yapar. `Table Comment` kapalıyken bir tablo açıklaması değişikliği tablonun adını kehribar rengine çevirir. Yeniden adlandırmanın mavisi bu kehribar rengine baskın gelir. Belgesinin gizlediği bir not veya tablo grubu ağaçta listelenir, ancak o tarafta çizilmez.

`70%` ve altındaki yakınlaştırmada daraltılmış tablolar dış çizgilerini korur. Ad, eklenmiş veya kaldırılmış bir tablonun yeşilini ya da kırmızısını veya yeniden adlandırmanın mavisini korur, aksi hâlde bir açıklama değişikliğinin kehribar rengini alır. Sütun değişiklikleri yeniden yakınlaştırana kadar çizilmez; ağaç onları yine de listeler.
